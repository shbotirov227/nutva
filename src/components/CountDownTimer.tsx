'use client';

import { useState, useEffect, useMemo } from 'react';
import { Clock, Gift, Tag } from 'lucide-react';

interface CountdownTimerProps {
  /** Unikal localStorage kalit (masalan: countdown:product:123) — shart */
  storageKey: string;
  /** Har bir sikl davomiyligi (ms) — shart (masalan 3 soat = 3*60*60*1000) */
  resetDurationMs: number;

  /** Faqat birinchi safar uchun boshlang'ich deadline (ixtiyoriy) */
  targetTime?: Date;

  /** Timer tugaganda avtomatik qayta boshlash (default: true) */
  loop?: boolean;

  discountPercentage?: number;
  title?: string;
  subtitle?: string;
}

export function CountdownTimer({
  storageKey,
  resetDurationMs,
  targetTime,
  loop = true,
  discountPercentage = 15,
  title = 'Chegirma tugashiga',
  subtitle = 'Bugun xarid qilganlar uchun',
}: CountdownTimerProps) {
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [isExpired, setIsExpired] = useState(false);

  // expiry ni o‘rnatish: localStorage -> (targetTime || now+resetDurationMs)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem(storageKey);
    const savedNum = saved ? Number(saved) : NaN;
    const savedValid = Number.isFinite(savedNum) && savedNum > Date.now();

    if (savedValid) {
      setExpiresAt(savedNum);
      setIsExpired(false);
      return;
    }

    const first =
      targetTime && targetTime.getTime() > Date.now()
        ? targetTime.getTime()
        : Date.now() + resetDurationMs;

    setExpiresAt(first);
    window.localStorage.setItem(storageKey, String(first));
    setIsExpired(false);
  }, [storageKey, resetDurationMs, targetTime]);

  // Har 1 soniyada vaqtni yangilash
  useEffect(() => {
    if (!expiresAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  // Multi-tab sinxron
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const nv = Number(e.newValue);
        if (Number.isFinite(nv)) {
          setExpiresAt(nv);
          setIsExpired(false);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storageKey]);

  // Tugaganda: loop bo'lsa qayta boshlash, bo‘lmasa “tugadi” holatida qoladi
  useEffect(() => {
    if (!expiresAt) return;
    if (now >= expiresAt) {
      if (loop) {
        const next = Date.now() + resetDurationMs;
        setExpiresAt(next);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(storageKey, String(next));
        }
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    }
  }, [now, expiresAt, loop, resetDurationMs, storageKey]);

  // Qolgan vaqtni hisoblash
  const remaining = useMemo(() => {
    if (!expiresAt) return 0;
    return Math.max(0, expiresAt - now);
  }, [expiresAt, now]);

  // UI: kunlarni soatlarga qo‘shib yuboramiz (senga hozirgi layoutda d/h/m/s bo‘lishi shart emas)
  const { hours, minutes, seconds } = useMemo(() => {
    let ms = remaining;
    const totalHours = Math.floor(ms / 3_600_000); // 60*60*1000
    ms %= 3_600_000;
    const minutes = Math.floor(ms / 60_000);
    ms %= 60_000;
    const seconds = Math.floor(ms / 1_000);
    return { hours: totalHours, minutes, seconds };
  }, [remaining]);

  if (expiresAt === null) return null; // SSR/hydration guard

  if (isExpired && !loop) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg shadow-lg text-center">
        <p className="font-semibold">Chegirma tugadi!</p>
        <p className="text-sm opacity-90">Keyingi aksiyani kuting</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 animate-pulse"></div>

      {/* Main content */}
      <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-xl shadow-2xl border border-emerald-300">
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-500/20 rounded-xl blur-sm"></div>

        <div className="relative z-10">
          {/* Header with icon */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-6 h-6 animate-pulse" />
            <h3 className="text-lg font-bold">{title}</h3>
          </div>

          {/* Countdown display */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px] border border-white/30">
                <div className="text-2xl font-bold tabular-nums">
                  {hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wide opacity-90">Soat</div>
              </div>
            </div>

            <div className="text-xl font-bold animate-pulse">:</div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px] border border-white/30">
                <div className="text-2xl font-bold tabular-nums">
                  {minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wide opacity-90">Daqiqa</div>
              </div>
            </div>

            <div className="text-xl font-bold animate-pulse">:</div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px] border border-white/30">
                <div className="text-2xl font-bold tabular-nums animate-pulse">
                  {seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wide opacity-90">Soniya</div>
              </div>
            </div>
          </div>

          {/* Discount info */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-5 h-5" />
              <span className="font-semibold">{subtitle}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Tag className="w-6 h-6" />
              <span className="text-2xl font-bold">{discountPercentage}% CHEGIRMA</span>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-4 text-center">
            <button className="bg-white text-green-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Hoziroq xarid qiling!
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-white/50 rounded-full animate-ping"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/50 rounded-full animate-ping delay-1000"></div>
      </div>
    </div>
  );
}
