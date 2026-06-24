import { useEffect, useState, useRef } from 'react';
import { showToastInfo } from '@/components/ToastNotification';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

const DISMISS_KEY = 'animalpedia-install-dismissed';

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOSUser, setIsIOSUser] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;

    // Skip if dismissed this session
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const isiOS = isIOS();
    setIsIOSUser(isiOS);

    // iOS: show immediately
    if (isiOS) {
      setShow(true);
      return;
    }

    // Non-iOS (Chrome/Edge/Android/Samsung/desktop):

    // Listen for the native install prompt event
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Listen for installation completion
    const onInstalled = () => setShow(false);
    window.addEventListener('appinstalled', onInstalled);

    // Watch for standalone mode change
    const mq = window.matchMedia('(display-mode: standalone)');
    const onMqChange = (e: MediaQueryListEvent) => {
      if (e.matches) setShow(false);
    };
    mq.addEventListener('change', onMqChange);

    // On desktop Chrome, beforeinstallprompt needs engagement signals
    // (multiple visits, user interaction). Show a gentle banner immediately
    // so users know the app is installable via the address bar icon.
    setShow(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
      mq.removeEventListener('change', onMqChange);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPrompt.current;
    if (prompt) {
      prompt.prompt();
      const result = await prompt.userChoice;
      if (result.outcome === 'accepted') {
        setShow(false);
      }
      deferredPrompt.current = null;
    } else {
      // No native install prompt available yet (Chrome desktop needs engagement)
      // Show instructions instead
      showToastInfo('Buka menu ⋮ di Chrome › Cast, save, and share › Install halaman...');
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setShow(false);
  };

  if (!show) return null;

  const card = isIOSUser ? (
    <div className="crayon-card p-3.5 flex items-start gap-3 bg-[var(--paper)] border-[3px] border-[var(--blue)] shadow-[0_4px_0_var(--blue)] pointer-events-auto">
      <div className="text-2xl flex-shrink-0 mt-0.5">📲</div>
      <div className="flex-1 min-w-0">
        <div className="font-extrabold text-xs text-[var(--blue-deep)]">
          Install Aplikasi
        </div>
        <div className="text-[11px] font-semibold text-[var(--ink-soft)] mt-0.5 leading-snug">
          Tekan tombol bagikan <span className="text-sm">⎙</span> di Safari, lalu pilih
          <span className="font-bold"> "Add to Home Screen"</span>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors flex-shrink-0"
      >
        ✕
      </button>
    </div>
  ) : (
    <div className="crayon-card p-3.5 flex items-center gap-3 bg-gradient-to-r from-[var(--orange)] to-[#E8832A] border-[3px] border-[var(--ink)] shadow-[0_4px_0_var(--ink)] pointer-events-auto">
      <div className="text-2xl flex-shrink-0">🚀</div>
      <div className="flex-1 min-w-0">
        <div className="font-extrabold text-xs text-[var(--ink)]">
          Install Animalpedia Kids
        </div>
        <div className="text-[11px] font-semibold text-[var(--ink-soft)] mt-0.5 leading-snug">
          {deferredPrompt.current
            ? 'Buka kapan saja, bahkan offline!'
            : 'Gunakan menu browser untuk install'}
        </div>
      </div>
      <button
        onClick={handleInstall}
        className="crayon-btn px-4 py-1.5 text-xs font-extrabold bg-white text-[var(--orange-deep)] border-2 border-[var(--ink)] shadow-[0_2px_0_var(--ink)] active:translate-y-[1px] active:shadow-none transition-all whitespace-nowrap"
      >
        {deferredPrompt.current ? 'Install' : 'Cara Install'}
      </button>
      <button
        onClick={handleDismiss}
        className="text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[100] flex justify-center pointer-events-none animate-fade-in-up">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-sm">
        {card}
      </div>
    </div>
  );
}
