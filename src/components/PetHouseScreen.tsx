import { useState, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { animals } from "@/data/animals";

export function PetHouseScreen() {
  const petAnimals = useGameStore((s) => s.petAnimals);
  const petData = useGameStore((s) => s.petData);
  const feedPet = useGameStore((s) => s.feedPet);
  const playWithPet = useGameStore((s) => s.playWithPet);
  const petPet = useGameStore((s) => s.petPet);
  const setTab = useGameStore((s) => s.setTab);

  const ownedPets = animals.filter((a) => petAnimals.includes(a.id));
  const [activeIdx, setActiveIdx] = useState(0);
  const safeIdx = Math.min(activeIdx, ownedPets.length - 1);
  const active = ownedPets.length > 0 ? ownedPets[safeIdx] : null;
  const petEntry = active ? petData[active.id] : null;

  // Compute live stats
  const now = Date.now();
  const calcStat = useCallback(
    (last: string | null, decayPerHour: number) => {
      if (!last) return 0;
      const hoursSince = (now - new Date(last).getTime()) / 3_600_000;
      return Math.max(
        0,
        Math.min(100, Math.round(100 - hoursSince * decayPerHour)),
      );
    },
    [now],
  );

  const hunger = petEntry ? calcStat(petEntry.lastFed, 3) : 0;
  const happiness = petEntry ? calcStat(petEntry.lastPlayed, 3) : 0;
  const affection = petEntry ? calcStat(petEntry.lastPetted, 2) : 0;

  const isMissing = hunger < 50 || happiness < 50 || affection < 50;

  const daysAdopted = petEntry
    ? Math.max(
        1,
        Math.floor((now - new Date(petEntry.adoptedAt).getTime()) / 86_400_000),
      )
    : 0;

  // Empty state
  if (ownedPets.length === 0 || !active) {
    return (
      <div className="screen-container bg-[var(--cream)]">
        <div className="screen-scroll">
          <div className="px-5 pt-5 pb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTab("home")}
                className="w-[32px] h-[32px] rounded-full bg-[var(--paper)] border-2 border-[var(--ink)] flex items-center justify-center text-sm flex-shrink-0 active:scale-90 transition-all"
              >
                ←
              </button>
              <div>
                <div className="text-xs font-semibold text-[var(--ink-soft)]">
                  Rumah
                </div>
                <h2 className="font-display text-xl font-extrabold">
                  Peliharaanmu
                </h2>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border-[3px] border-[var(--ink)] bg-[var(--paper)] p-4 shadow-[0_6px_0_var(--ink)]">
              <div className="text-sm font-bold">
                🐾 Hewan yang kamu pelihara
              </div>
              <div className="text-[11px] font-semibold text-[var(--ink-soft)] mt-1">
                Belum ada hewan yang dipelihara. Buka detail hewan lalu tekan
                tombol pelihara.
              </div>
            </div>

            <div className="mt-4">
              <div className="crayon-card p-4 bg-[var(--yellow)] text-center">
                <div className="text-4xl mb-2">🐣</div>
                <div className="font-black text-sm">
                  Belum ada teman peliharaan
                </div>
                <button
                  onClick={() => setTab("explore")}
                  className="mt-3 crayon-btn bg-[var(--green-deep)] text-white text-xs py-2 px-3"
                >
                  Jelajahi Hewan Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const moodBorder = isMissing ? "var(--blue-deep)" : "var(--green-deep)";
  const moodEmoji = isMissing ? "😴" : "😊";
  const moodLabel = isMissing
    ? `${active.name} kangen kamu...`
    : `${active.name} sedang bahagia!`;
  const moodColor = isMissing ? "var(--blue-deep)" : "var(--green-deep)";

  const gradientBg = `radial-gradient(ellipse at center, ${isMissing ? "var(--blue-pale)" : "var(--green-pale)"} 0%, var(--cream) 70%)`;

  return (
    <div className="screen-container bg-[var(--cream)]">
      <div className="screen-scroll flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-1">
          <button
            onClick={() => setTab("home")}
            className="w-[32px] h-[32px] rounded-full bg-[var(--paper)] border-2 border-[var(--ink)] flex items-center justify-center text-sm flex-shrink-0 active:scale-90 transition-all"
          >
            ←
          </button>
          <h2 className="font-display text-xl font-extrabold">
            Rumah Peliharaan 🏡
          </h2>
        </div>

        {/* Multi-pet tabs */}
        {ownedPets.length > 1 && (
          <div className="flex gap-2 px-5 pb-3 overflow-x-auto">
            {ownedPets.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveIdx(i)}
                className={`flex items-center gap-1.5 rounded-full border-[2px] px-3 py-1 text-xs font-display font-bold whitespace-nowrap transition-all ${
                  i === safeIdx
                    ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                    : "bg-[var(--paper)] text-[var(--ink-soft)] border-[var(--line)]"
                }`}
              >
                <span>{p.emoji}</span>
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Main pet display */}
        <div
          className="flex-1 flex flex-col items-center px-6 pt-2 pb-4"
          style={{ background: gradientBg }}
        >
          {/* Mood badge */}
          <div
            className="text-[11px] font-bold rounded-[14px] px-3 py-1 mb-3"
            style={{
              background: "var(--paper)",
              border: `2px solid ${moodBorder}`,
              color: moodColor,
            }}
          >
            {moodEmoji} {moodLabel}
          </div>

          {/* Large emoji */}
          <div
            className="text-[140px] leading-none select-none"
            style={{
              filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.12))",
              opacity: isMissing ? 0.85 : 1,
            }}
          >
            {active.emoji}
          </div>

          {/* Name */}
          <div className="font-display text-xl font-extrabold mt-1">
            {active.name}
          </div>

          {/* Days adopted */}
          <div className="text-[11px] font-semibold text-[var(--ink-soft)] mt-0.5">
            Dipelihara sejak {daysAdopted} hari
          </div>

          {/* Speech bubble (kangen mode) */}
          {isMissing && (
            <div className="crayon-card bg-[var(--paper)] px-4 py-2.5 mt-3 mb-1 text-center max-w-[260px]">
              <div className="text-[11px] font-bold text-[var(--ink)] leading-snug">
                "{feedMessage(hunger, happiness, active.foodEmoji)}"
              </div>
            </div>
          )}

          {/* Stat bars */}
          <div className="w-full max-w-[280px] flex flex-col gap-2.5 mt-3">
            <StatBar
              emoji={active.foodEmoji}
              label="Kenyang"
              value={hunger}
              color={hunger < 50 ? "var(--orange)" : "var(--green)"}
            />
            <StatBar
              emoji="🎮"
              label="Senang"
              value={happiness}
              color={happiness < 50 ? "var(--blue)" : "var(--blue)"}
            />
            <StatBar
              emoji="💛"
              label="Sayang"
              value={affection}
              color={affection < 50 ? "var(--orange)" : "var(--orange)"}
            />
          </div>

          {/* Reassurance text (kangen mode) */}
          {isMissing && (
            <div className="text-[10px] font-semibold text-[var(--ink-soft)] mt-3 text-center leading-relaxed max-w-[240px]">
              Tenang, {active.name} nggak akan kemana-mana.
              <br />
              Dia cuma nunggu kamu main lagi! 😊
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5 px-5 py-4 pb-6">
          <ActionButton
            emoji={active.foodEmoji}
            label="Beri Makan"
            highlight={isMissing}
            onClick={() => feedPet(active.id)}
          />
          <ActionButton
            emoji="🎮"
            label="Main Bareng"
            highlight={isMissing}
            onClick={() => playWithPet(active.id)}
          />
          <ActionButton
            emoji="💛"
            label="Elus-elus"
            highlight={isMissing}
            onClick={() => petPet(active.id)}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Stat bar ─── */
function StatBar({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-bold mb-1">
        <span>
          {emoji} {label}
        </span>
        <span
          style={{
            color: value < 50 ? "var(--orange-deep)" : "var(--green-deep)",
          }}
        >
          {value}%
        </span>
      </div>
      <div className="progress-track h-[14px]">
        <div
          className="progress-fill h-full rounded-[20px]"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ─── Action button ─── */
function ActionButton({
  emoji,
  label,
  highlight,
  onClick,
}: {
  emoji: string;
  label: string;
  highlight?: boolean;
  onClick: () => void;
}) {
  if (highlight) {
    return (
      <button
        onClick={onClick}
        className="flex-1 bg-[var(--orange)] border-[3px] border-[var(--ink)] rounded-[18px] px-2 py-3 text-center shadow-[0_3px_0_var(--ink)] text-white active:scale-95 transition-all"
      >
        <div className="text-[22px] leading-none">{emoji}</div>
        <div className="text-[10.5px] font-bold font-display mt-1">{label}</div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex-1 bg-[var(--paper)] border-[3px] border-[var(--ink)] rounded-[18px] px-2 py-3 text-center shadow-[0_3px_0_var(--ink)] active:scale-95 transition-all"
    >
      <div className="text-[22px] leading-none">{emoji}</div>
      <div className="text-[10.5px] font-bold font-display mt-1">{label}</div>
    </button>
  );
}

/** Friendly message when the pet is missing you — based on which stat is lowest */
function feedMessage(hunger: number, happiness: number, foodEmoji: string) {
  if (hunger < 30)
    return `Perutku keroncongan... Aku lapar! Yuk kasih makan ${foodEmoji}`;
  if (happiness < 30) return "Aku bosan sendiri... Ayo main bareng lagi! 🥺";
  if (hunger < 50) return `Aku agak lapar nih... Ayo kasih aku ${foodEmoji}!`;
  if (happiness < 50)
    return "Aku kangen main sama kamu! Yuk main bareng lagi 🎮";
  return "Sudah lama aku nggak ditemani. Yuk main lagi! 🥺";
}
