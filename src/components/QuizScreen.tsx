import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { animals } from '@/data/animals';
import { showToastXP, showToastBadge } from '@/components/ToastNotification';

interface Props {
  animalId: string;
  onBack: () => void;
  onFinish: () => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function generateQuestions(animalId: string): QuizQuestion[] {
  const animal = animals.find((a) => a.id === animalId);
  if (!animal) return [];

  const otherAnimals = animals.filter((a) => a.id !== animalId);

  const getRandomOptions = (correctValue: string, allValues: string[], count: number = 3) => {
    const others = allValues.filter((v) => v !== correctValue);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    const options = [correctValue, ...shuffled.slice(0, count)].sort(() => Math.random() - 0.5);
    return {
      options,
      correctIndex: options.indexOf(correctValue),
    };
  };

  const q1 = getRandomOptions(
    animal.food,
    animals.map((a) => a.food)
  );
  const q2 = getRandomOptions(
    animal.habitat,
    animals.map((a) => a.habitat)
  );

  const maxFacts = Math.min(animal.funFacts.length, 3);
  const factQuestions: QuizQuestion[] = [];
  for (let i = 0; i < maxFacts; i++) {
    const fact = animal.funFacts[i];
    const fakeFacts = otherAnimals
      .flatMap((a) => a.funFacts)
      .filter((f) => f !== fact)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const options = [fact, ...fakeFacts].sort(() => Math.random() - 0.5);
    factQuestions.push({
      question: `Manakah fakta yang BENAR tentang ${animal.name}?`,
      options,
      correctIndex: options.indexOf(fact),
      explanation: `${fact} Fakta seru lainnya bisa kamu temukan di halaman ${animal.name}!`,
    });
  }

  return [
    {
      question: `Apa makanan kesukaan ${animal.name}?`,
      options: q1.options,
      correctIndex: q1.correctIndex,
      explanation: `${animal.name} adalah pemakan ${animal.food.toLowerCase()}. ${animal.foodEmoji}`,
    },
    {
      question: `Di mana habitat asli ${animal.name}?`,
      options: q2.options,
      correctIndex: q2.correctIndex,
      explanation: `${animal.name} tinggal di ${animal.habitat}. ${animal.habitatEmoji}`,
    },
    ...factQuestions,
  ];
}

function CelebrationConfetti() {
  const emojis = ['🎉', '🎊', '⭐', '🌟', '✨', '💫', '🌈', '🦋'];
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1.5,
    size: 16 + Math.random() * 24,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-fade-in-up"
          style={{
            left: `${p.x}%`,
            top: '-10%',
            fontSize: `${p.size}px`,
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        >
          {p.emoji}
        </div>
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 1;
          }
          20% {
            transform: translateY(20vh) rotate(180deg) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export function QuizScreen({ animalId, onBack, onFinish }: Props) {
  const animal = animals.find((a) => a.id === animalId);
  const addXP = useGameStore((s) => s.addXP);
  const recordCorrectQuiz = useGameStore((s) => s.recordCorrectQuiz);
  const checkNewBadges = useGameStore((s) => s.checkNewBadges);

  const [questions] = useState(() => generateQuestions(animalId));
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!animal || questions.length === 0) {
    return (
      <div className="absolute inset-0 z-50 bg-[var(--cream)] flex items-center justify-center">
        <p>Soal tidak tersedia</p>
      </div>
    );
  }

  const question = questions[currentQ];
  const totalQuestions = questions.length;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz finished
      const isPerfect = score === totalQuestions;
      const xpAmount = isPerfect ? 15 : 10;
      addXP(xpAmount);
      if (score > 0) {
        for (let i = 0; i < score; i++) recordCorrectQuiz();
      }

      showToastXP(xpAmount, `Kuis ${animal.name} selesai!`);

      setTimeout(() => {
        const newBadges = checkNewBadges();
        newBadges.forEach((badgeId) => showToastBadge(badgeId));
      }, 300);

      setFinished(true);
    }
  };

  const progressPercent = ((currentQ + (showResult ? 1 : 0)) / totalQuestions) * 100;

  if (finished) {
    return (
      <div className="absolute inset-0 z-50 bg-[var(--cream)] flex flex-col items-center justify-center px-8 overflow-hidden">
        {score >= totalQuestions / 2 && <CelebrationConfetti />}
        <div className="text-8xl mb-4 z-20">
          {score === totalQuestions ? '🏆' : score >= totalQuestions / 2 ? '🎉' : '💪'}
        </div>
        <h2 className="font-display text-2xl font-extrabold text-center z-20">
          {score === totalQuestions
            ? 'Sempurna!'
            : score >= totalQuestions / 2
            ? 'Hebat!'
            : 'Ayo coba lagi!'}
        </h2>
        <p className="text-sm font-semibold text-[var(--ink-soft)] mt-2 text-center z-20">
          Kamu menjawab {score} dari {totalQuestions} pertanyaan dengan benar
        </p>
        <div className="mt-4 text-lg font-bold z-20" style={{ color: 'var(--green-deep)' }}>
          +{score === totalQuestions ? 15 : 10} XP ⭐
        </div>

        <button
          onClick={onFinish}
          className="mt-8 w-full crayon-btn bg-[var(--orange)] text-white text-sm py-3.5 max-w-xs z-20"
        >
          Selesai
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 bg-[var(--cream)] flex flex-col animate-fade-in-up">
      {/* Top bar */}
      <div className="flex items-center gap-2.5 px-5 pt-4 pb-2">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-[var(--paper)] border-2 border-[var(--ink)] flex items-center justify-center text-xs"
        >
          ✕
        </button>
        <div className="progress-track flex-1">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%`, background: 'var(--orange)' }}
          />
        </div>
        <span className="text-xs font-bold text-[var(--ink-soft)]">
          {currentQ + 1}/{totalQuestions}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center px-5 pb-5">
        <div className="text-6xl mt-4 mb-2 animate-float">{animal.emoji}</div>
        <h2 className="font-display text-lg font-bold text-center leading-snug mt-2 mb-6">
          {question.question}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {question.options.map((option, i) => {
            let bg = 'var(--paper)';
            let border = 'var(--ink)';
            let shadow = 'var(--ink)';

            if (showResult) {
              if (i === question.correctIndex) {
                bg = 'var(--green-pale)';
                border = 'var(--green-deep)';
                shadow = 'var(--green-deep)';
              } else if (i === selectedAnswer) {
                bg = 'var(--red-pale)';
                border = 'var(--red)';
                shadow = 'var(--red)';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showResult}
                className="w-full crayon-btn flex items-center gap-2.5 px-4 py-3.5 text-left"
                style={{
                  background: bg,
                  borderColor: border,
                  boxShadow: `0 3px 0 ${shadow}`,
                  color: showResult && i === question.correctIndex ? 'var(--green-deep)' : 'var(--ink)',
                }}
              >
                <span className="flex-1 font-display text-sm font-bold">{option}</span>
                {showResult && i === question.correctIndex && (
                  <span className="text-sm">✓</span>
                )}
                {showResult && i === selectedAnswer && i !== question.correctIndex && (
                  <span className="text-sm">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showResult && (
          <div
            className="mt-auto w-full max-w-sm crayon-card p-3 text-center"
            style={{
              background: selectedAnswer === question.correctIndex
                ? 'var(--green-pale)'
                : 'var(--red-pale)',
              borderColor: selectedAnswer === question.correctIndex
                ? 'var(--green-deep)'
                : 'var(--red)',
            }}
          >
            <div
              className="font-extrabold text-sm"
              style={{
                color: selectedAnswer === question.correctIndex
                  ? 'var(--green-deep)'
                  : 'var(--red)',
              }}
            >
              {selectedAnswer === question.correctIndex
                ? '✅ Benar! +10 XP ⭐'
                : '❌ Belum tepat'}
            </div>
            <div className="text-[11px] font-semibold mt-1 text-[var(--ink-soft)]">
              {question.explanation}
            </div>

            <button
              onClick={handleNext}
              className="mt-3 w-full crayon-btn bg-[var(--orange)] text-white text-sm py-2.5"
            >
              {currentQ < totalQuestions - 1 ? 'Soal Selanjutnya →' : 'Lihat Hasil 🏆'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}