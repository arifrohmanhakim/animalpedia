import { useGameStore } from '@/store/gameStore';

export function ProfileScreen() {
  const playerName = useGameStore((s) => s.playerName);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const xp = useGameStore((s) => s.xp);
  const getLevel = useGameStore((s) => s.getLevel);
  const badges = useGameStore((s) => s.badges);

  const level = getLevel();

  const characterEmojis: Record<string, string> = {
    fox: '🦊',
    dolphin: '🐬',
    owl: '🦉',
  };

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

        {/* Badges */}
        <div className="px-5 pt-5 pb-6">
          <h3 className="font-display text-sm font-bold mb-3">🏅 Badge Terkumpul</h3>
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

        {/* Unlocked badge info */}
        <div className="px-5 pb-6">
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
