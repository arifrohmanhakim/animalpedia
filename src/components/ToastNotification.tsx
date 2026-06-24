import { useEffect, useState } from 'react';
import { badges as badgeData } from '../data/badges';

type ToastType = 'xp' | 'badge' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  emoji: string;
  amount?: number;
  badgeColor?: string;
}

let toastListeners: Array<(toast: ToastItem) => void> = [];

export function showToast(toast: ToastItem) {
  toastListeners.forEach((listener) => listener(toast));
}

export function showToastXP(xpAmount: number, reason: string) {
  showToast({
    id: `xp-${Date.now()}`,
    type: 'xp',
    message: reason,
    emoji: '⭐',
    amount: xpAmount,
  });
}

export function showToastBadge(badgeId: string) {
  const badgeInfo = badgeData.find((b) => b.id === badgeId);
  if (!badgeInfo) return;
  showToast({
    id: `badge-${Date.now()}`,
    type: 'badge',
    message: `Badge "${badgeInfo.name}" terbuka!`,
    emoji: badgeInfo.emoji,
    badgeColor: badgeInfo.color,
  });
}

export function showToastInfo(message: string) {
  showToast({
    id: `info-${Date.now()}`,
    type: 'info',
    message,
    emoji: '💡',
  });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (toast: ToastItem) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 2500);
    };

    toastListeners.push(handler);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handler);
    };
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <div className="flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((toast, i) => (
        <div
          key={toast.id}
          className="crayon-card p-3 flex items-center gap-3 animate-fade-in-up pointer-events-auto"
          style={{
            background:
              toast.type === 'badge'
                ? (toast.badgeColor || 'var(--yellow)')
                : toast.type === 'info'
                ? 'var(--blue-pale)'
                : 'var(--paper)',
            marginTop: i > 0 ? `${i * 60}px` : '0',
            position: i > 0 ? 'absolute' : 'relative',
            top: i > 0 ? `${i * 60}px` : '0',
            left: 0,
            right: 0,
          }}
        >
          <div className="text-2xl">{toast.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xs">
              {toast.type === 'xp'
                ? `+${toast.amount} XP`
                : toast.type === 'badge'
                ? '🏅 Badge Baru!'
                : '💡 Info'}
            </div>
            <div className="text-[11px] font-semibold text-[var(--ink-soft)] truncate">
              {toast.message}
            </div>
          </div>
          {toast.type === 'xp' && (
            <div className="text-lg font-extrabold" style={{ color: 'var(--green-deep)' }}>
              +{toast.amount}
            </div>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}