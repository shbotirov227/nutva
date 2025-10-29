"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { FormModal } from "./FormModal";

interface CountdownTimerProps {
  storageKey: string;
  resetDurationMs: number;
  targetTime?: Date;
  loop?: boolean;
  discountPercentage?: number;
  title?: string;
  color?: string;
  bgColor?: string;
  products?: { productId: string; quantity: number; total?: number }[];
}

export function CountdownTimer({
  storageKey,
  resetDurationMs,
  targetTime,
  loop = true,
  discountPercentage = 15,
  title,
  color,
  bgColor,
  products
}: CountdownTimerProps) {
  const { t } = useTranslation();
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [isExpired, setIsExpired] = useState(false);

  const localTitle = title ?? t("countdown.title");

  useEffect(() => {
    if (typeof window === "undefined") return;

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

  useEffect(() => {
    if (!expiresAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

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
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  useEffect(() => {
    if (!expiresAt) return;
    if (now >= expiresAt) {
      if (loop) {
        const next = Date.now() + resetDurationMs;
        setExpiresAt(next);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(storageKey, String(next));
        }
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    }
  }, [now, expiresAt, loop, resetDurationMs, storageKey]);

  const remaining = useMemo(() => {
    if (!expiresAt) return 0;
    return Math.max(0, expiresAt - now);
  }, [expiresAt, now]);

  const { hours, minutes, seconds } = useMemo(() => {
    let ms = remaining;
    const totalHours = Math.floor(ms / 3_600_000);
    ms %= 3_600_000;
    const minutes = Math.floor(ms / 60_000);
    ms %= 60_000;
    const seconds = Math.floor(ms / 1_000);
    return { hours: totalHours, minutes, seconds };
  }, [remaining]);

  if (expiresAt === null) return null;

  if (isExpired && !loop) {
    return (
      <div
        className="text-white p-4 rounded-lg shadow-lg text-center"
        style={{
          background: `linear-gradient(to right, ${color}, ${bgColor})`,
        }}
      >
        <p className="font-semibold">{t("countdown.expiredTitle")}</p>
        <p className="text-sm opacity-90">{t("countdown.expiredSubtitle")}</p>
      </div>
    );
  }



  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: `linear-gradient(to right, ${bgColor}, ${color}, ${bgColor})`,
        }}
      ></div>

      <div className="relative text-white p-6 rounded-xl shadow-2xl border"
        style={{
          background: `linear-gradient(to right, ${color}, ${bgColor})`,
          borderColor: color,
        }}
      >
        <div
          className="absolute inset-0 rounded-xl blur-sm"
          style={{
            background: `linear-gradient(to left, ${color}33, ${bgColor}33)`,
          }}
        ></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-6 h-6 animate-pulse" />
            <h3 className="text-lg font-bold">{localTitle}</h3>
          </div>

          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px] border border-white/30">
                <div className="text-2xl font-bold tabular-nums">
                  {hours.toString().padStart(2, "0")}
                </div>
                <div className="text-xs uppercase tracking-wide opacity-90">{t("discountPopup.hours")}</div>
              </div>
            </div>

            <div className="text-xl font-bold animate-pulse">:</div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px] border border-white/30">
                <div className="text-2xl font-bold tabular-nums">
                  {minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-xs uppercase tracking-wide opacity-90">{t("discountPopup.minutes")}</div>
              </div>
            </div>

            <div className="text-xl font-bold animate-pulse">:</div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px] border border-white/30">
                <div className="text-2xl font-bold tabular-nums animate-pulse">
                  {seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-xs uppercase tracking-wide opacity-90">{t("discountPopup.seconds")}</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="text-2xl font-bold">{t("countdown.discountToday", { percent: discountPercentage })}</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <FormModal
              products={products}
              btnColor={color}
            >
            <Button
              className={`bg-white px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer`}
              style={{ color }}
              onClick={() => redirect("/")}
            >
              {t("countdown.buyNow")}
              </Button>
            </FormModal>
          </div>
        </div>

        <div className="absolute top-2 right-2 w-2 h-2 bg-white/50 rounded-full animate-ping"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/50 rounded-full animate-ping delay-1000"></div>
      </div>
    </div>
  );
}
