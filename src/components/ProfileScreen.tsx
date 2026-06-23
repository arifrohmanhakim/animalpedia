import { useGameStore } from '@/store/gameStore';

export function ProfileScreen() {
  const playerName = useGameStore((s) => s.playerName);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const xp = useGameStore((s) => s.xp);
  const getLevel = useGameStore((s) => s.getLevel);
  const badges = useGameStore((s) => s.badges);
  const dailyStreak = useGameStore((s) => s.dailyStreak);
  const getCollectionProgress = useGameStore((s) => s.getCollectionProgress);

  const level = getLevel();
  const progress = getCollectionProgress();

  const characterEmojis: Record<string, string> = {
    fox: '🦊',
    dolphin: '🐬',
    owl: '🦉',
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalBadges = badges.length;

  return (
    <div className="screen-container bg-[var(--cream)]">
      <div className="screen-scroll">
        {/* Profile header */}
        <div
          className="px-5 pt-6 pb-9 text-center"
          style={{
            background: 'var(--green-pale)',
            borderRadius: '0 0 32px 32px',
          }}
        >
          <div className="w-[84px] h-[84px] rounded-full bg-[var(--yellow)] border-[4px] border-[var(--ink)] flex items-center justify-center text-[42px] mx-auto shadow-[0_4px_0_var(--ink)]">
            {characterEmojis[selectedCharacter] || '🦊'}
          </div>
          <h2 className="font-display text-lg font-extrabold mt-2.5">
            {playerName || 'Naila'}
          </h2>
          <span className="sticker-badge mt-1.5 inline-block" style={{ background: 'var(--green-deep)' }}>
            LV {level.level} · {level.title}
          </span>
        </div>

        {/* XP Card */}
        <div className="px-5 -mt-5">
          <div className="crayon-card p-3.5 bg-[var(--paper)]">
            <div className="flex justify-between text-[11px] font-bold mb-1.5">
              <span>XP ke Level {level.level + 1}</span>
              <span style={{ color: 'var(--orange-deep)' }}>
                {xp} / {level.xpForNext}
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${level.progress * 100}%`,
                  background: 'var(--orange)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="px-5 pt-4">
          <div className="crayon-card p-3.5 bg-[var(--paper)] flex items-center gap-3">
            <div className="text-3xl">🔥</div>
            <div>
              <div className="font-bold text-sm">Daily Streak</div>
              <div className="text-[11px] font-semibold text-[var(--ink-soft)]">
                {dailyStreak} hari berturut-turut
              </div>
            </div>
            <div className="ml-auto text-xl font-extrabold" style={{ color: 'var(--orange-deep)' }}>
              {dailyStreak}
            </div>
          </div>
        </div>

        {/* Collection Progress */}
        <div className="px-5 pt-4">
          <div className="crayon-card p-3.5 bg-[var(--paper)] flex items-center gap-3">
            <div className="text-3xl">📚</div>
            <div className="flex-1">
              <div className="font-bold text-sm">Koleksi Hewan</div>
              <div className="text-[11px] font-semibold text-[var(--ink-soft)]">
                {progress.discovered} dari {progress.total}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold" style={{ color: 'var(--green-deep)' }}>
                {Math.round((progress.discovered / progress.total) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="px-5 pt-5 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-bold">🏅 Badge</h3>
            <span className="text-xs font-semibold text-[var(--ink-soft)]">
              {unlockedCount}/{totalBadges}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`text-center ${!badge.unlocked ? 'opacity-40' : ''}`}
              >
                <div
                  className={`w-16 h-16 rounded-full border-[3px] flex items-center justify-center text-2xl mx-auto transition-all ${
                    badge.unlocked
                      ? ''
                      : 'bg-[var(--cream-deep)] border-dashed border-[var(--ink-soft)]'
                  }`}
                  style={
                    badge.unlocked
                      ? {
                          background: badge.color,
                          borderColor: 'var(--ink)',
                          boxShadow: '0 3px 0 var(--ink)',
                        }
                      : undefined
                  }
                >
                  {badge.unlocked ? badge.emoji : '🔒'}
                </div>
                <div className="text-[10.5px] font-bold mt-1.5 leading-tight">
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badge details */}
        <div className="px-5 pb-8">
          <h3 className="font-display text-sm font-bold mb-3">📋 Pencapaian</h3>
          <div className="space-y-2.5">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`crayon-card p-3 flex items-center gap-3 ${
                  badge.unlocked ? '' : 'opacity-50'
                }`}
              >
                <div className="text-2xl">{badge.unlocked ? badge.emoji : '🔒'}</div>
                <div className="flex-1">
                  <div className="font-bold text-xs">{badge.name}</div>
                  <div className="text-[10px] font-semibold text-[var(--ink-soft)]">
                    {badge.description}
                  </div>
                </div>
                <div className="text-sm">
                  {badge.unlocked ? '✅' : '⏳'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}