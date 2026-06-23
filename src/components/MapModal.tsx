import { useEffect } from "react";
import { DistributionMapLeaflet } from "@/components/DistributionMapLeaflet";

interface Props {
  distribution: string[];
  countries: string;
  animalName: string;
  onClose: () => void;
}

export function MapModal({ distribution, countries, animalName, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 animate-fade-in-up"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="crayon-card w-full max-w-lg bg-[var(--paper)] p-3 animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-display text-sm font-bold truncate flex-1">
            🌍 Tinggal di Mana Aku?
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--cream-deep)] border-2 border-[var(--ink)] flex items-center justify-center text-xs hover:scale-105 active:scale-95 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Map content */}
        <DistributionMapLeaflet
          distribution={distribution}
          countries={countries}
        />
      </div>
    </div>
  );
}