import { useEffect, useRef } from 'react';

interface Props {
  videoEmbedUrl: string;
  animalName: string;
  onClose: () => void;
}

export function VideoPlayerModal({ videoEmbedUrl, animalName, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 animate-fade-in-up"
    >
      <div className="crayon-card w-full max-w-lg bg-[var(--paper)] p-3 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-display text-sm font-bold truncate flex-1">
            🎬 Video {animalName}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--cream-deep)] border-2 border-[var(--ink)] flex items-center justify-center text-xs hover:scale-105 active:scale-95 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Video embed */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={videoEmbedUrl}
            title={`Video ${animalName}`}
            className="absolute inset-0 w-full h-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer */}
        <p className="text-[10px] font-semibold text-[var(--ink-soft)] mt-2 text-center">
          Sumber: National Geographic
        </p>
      </div>
    </div>
  );
}