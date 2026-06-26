import { useGameStore } from "@/store/gameStore";

const tabs = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "explore", label: "Jelajah", emoji: "🔍" },
  { id: "games", label: "Games", emoji: "🎮" },
  /* { id: 'collection', label: 'Koleksi', emoji: '📚' }, */
  { id: "profile", label: "Profil", emoji: "🦊" },
];

export function BottomNav() {
  const currentTab = useGameStore((s) => s.currentTab);
  const setTab = useGameStore((s) => s.setTab);

  return (
    <nav className="flex-shrink-0 bg-[var(--paper)] border-t-[3px] border-[var(--ink)] flex justify-around items-center px-1 pb-3 pt-2.5">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className="flex flex-col items-center gap-0.5 transition-transform duration-100 active:scale-95"
          >
            <div
              className={`w-[26px] h-[26px] flex items-center justify-center text-base ${
                isActive ? "bg-[var(--green-pale)] rounded-full" : ""
              }`}
            >
              <span>{tab.emoji}</span>
            </div>
            <span
              className="font-display text-[10.5px] font-bold"
              style={{
                color: isActive ? "var(--green-deep)" : "var(--ink-soft)",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
