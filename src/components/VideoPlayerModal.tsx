import { useEffect, useRef, useState } from 'react';

interface Props {
  videoEmbedUrl: string;
  videoUrl: string;
  animalName: string;
  onClose: () => void;
}

export function VideoPlayerModal({ videoEmbedUrl, videoUrl, animalName, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

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

        {/* Video embed or error fallback */}
        {hasError ? (
          <div className="w-full rounded-xl bg-[var(--cream-deep)] flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="text-5xl mb-3">😕</div>
            <h4 className="font-display text-base font-bold">Video tidak tersedia</h4>
            <p className="text-xs font-semibold text-[var(--ink-soft)] mt-1 mb-4">
              Video ini mungkin telah dihapus atau disetel ke pribadi.
            </p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="crayon-btn bg-[#FF0000] text-white text-sm py-2.5 px-6 inline-flex items-center gap-2"
            >
              <span>▶</span>
              Tonton di YouTube
            </a>
          </div>
        ) : (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={videoEmbedUrl}
              title={`Video ${animalName}`}
              className="absolute inset-0 w-full h-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setHasError(true)}
            />
          </div>
        )}

        {/* Footer */}
        {!hasError && (
          <>
            <p className="text-[10px] font-semibold text-[var(--ink-soft)] mt-2 text-center">
              Video tidak muncul?{' '}
              <button
                onClick={() => setHasError(true)}
                className="text-[var(--blue-deep)] underline"
              >
                Klik di sini
              </button>
            </p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-[10px] font-semibold text-[var(--ink-soft)] mt-1 underline"
            >
              Buka di YouTube ↗
            </a>
          </>
        )}
      </div>
    </div>
  );
}