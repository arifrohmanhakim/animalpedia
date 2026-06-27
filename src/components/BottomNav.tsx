import { useGameStore } from "@/store/gameStore";
import {
  HomeIcon,
  ExploreIcon,
  GamesIcon,
  ProfileIcon,
} from "@/components/icons/NavIcons";

const tabs = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "explore", label: "Jelajah", Icon: ExploreIcon },
  { id: "games", label: "Games", Icon: GamesIcon },
  /* { id: 'collection', label: 'Koleksi', emoji: '📚' }, */
  { id: "profile", label: "Profil", Icon: ProfileIcon },
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
              className={`w-[48px] h-[48px] flex items-center justify-center ${
                isActive ? "bg-[var(--green-pale)] rounded-full" : ""
              }`}
            >
              <tab.Icon active={isActive} size={36} />
            </div>
            {/* <span
              className="font-display text-[10.5px] font-bold"
              style={{
                color: isActive ? "var(--green-deep)" : "var(--ink-soft)",
              }}
            >
              {tab.label}
            </span> */}
          </button>
        );
      })}
    </nav>
  );
}
