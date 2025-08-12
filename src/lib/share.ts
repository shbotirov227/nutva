// lib/share.ts
// Sharing helpers: popup window, Instagram story poster generation, and platform share wrappers.

export function openSharePopup(url: string) {
  const w = 760, h = 600;
  const y = window.top?.outerHeight ? Math.max(0, (window.top.outerHeight - h) / 2) : 0;
  const x = window.top?.outerWidth ? Math.max(0, (window.top.outerWidth - w) / 2) : 0;
  window.open(url, "_blank", `scrollbars=1,resizable=1,width=${w},height=${h},top=${y},left=${x}`);
}

/**
 * Build a simple poster (1080x1920) for stories.
 * NOTE: Remote cover image must allow CORS (Access-Control-Allow-Origin: *),
 * otherwise it will be skipped (or taint the canvas preventing export).
 */
export async function buildStoryPoster(opts: {
  title: string;
  coverUrl?: string;
  brand?: string; // e.g. "nutva.uz"
}) {
  const W = 1080, H = 1920;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  // background gradient
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#e8ffe9");
  g.addColorStop(1, "#ffffff");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // cover image (optional)
  if (opts.coverUrl) {
  const img: HTMLImageElement | null = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = opts.coverUrl!;
  }).catch(() => null);

    if (img) {
      const targetH = Math.min(H * 0.55, (W / img.width) * img.height);
      try { ctx.drawImage(img, 0, 0, W, targetH); } catch {}
      const og = ctx.createLinearGradient(0, targetH - 260, 0, targetH);
      og.addColorStop(0, "rgba(0,0,0,0)");
      og.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = og;
      ctx.fillRect(0, targetH - 260, W, 260);
    }
  }

  // title text wrapping
  const title = opts.title?.trim() || "Nutva News";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#111";
  ctx.font = "bold 54px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  const maxWidth = W - 120;
  const lineHeight = 64;
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = (line + " " + w).trim();
    if (ctx.measureText(t).width > maxWidth) {
      if (line) lines.push(line);
      line = w;
      if (lines.length >= 6) break; // limit lines
    } else line = t;
  }
  if (line && lines.length < 6) lines.push(line);

  let y = 640;
  for (const l of lines) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 8;
    ctx.fillText(l, 60, y, maxWidth);
    ctx.restore();
    y += lineHeight;
  }

  // footer brand
  ctx.font = "600 32px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillStyle = "#16a34a";
  ctx.fillText(opts.brand || "nutva.uz", 60, H - 120);

  const blob: Blob | null = await new Promise(r => c.toBlob(r, "image/jpeg", 0.92));
  return blob ? new File([blob], "nutva-story.jpg", { type: "image/jpeg" }) : null;
}

/**
 * Instagram Stories sharing flow on web (best-effort):
 * 1. Copy link to clipboard
 * 2. If Web Share with files is supported -> share poster directly
 * 3. Else: trigger file download (user can add manually) + deep link to IG story camera
 * 4. Fallback open instagram.com if deep link fails
 */
export async function shareInstagramStoryWeb(args: {
  title: string;
  coverUrl?: string | null;
  pageUrl: string;
  brand?: string;
}) {
  const file = await buildStoryPoster({
    title: args.title,
    coverUrl: args.coverUrl || undefined,
    brand: args.brand || "nutva.uz",
  });

  try { await navigator.clipboard.writeText(args.pageUrl); } catch {}

  // Narrow navigator to potential extended interface supporting canShare & share
  interface ShareFileData { files?: File[]; title?: string; text?: string; url?: string; }
  type ShareCapableNavigator = Navigator & { canShare?: (data: ShareFileData) => boolean; share?: (data: ShareFileData) => Promise<void> };
  const nav = navigator as ShareCapableNavigator;
  const canShareFiles = nav?.canShare?.({ files: file ? [file] : [] }) ?? false;
  if (file && canShareFiles) {
    try {
  await nav.share?.({ files: [file], title: args.title });
      return;
    } catch { /* fallback */ }
  }

  if (file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url; a.download = file.name; a.click();
    URL.revokeObjectURL(url);
  }

  const t0 = Date.now();
  window.location.href = "instagram://story-camera";
  setTimeout(() => {
    if (Date.now() - t0 < 1500) openSharePopup("https://www.instagram.com/");
  }, 900);
}

/**
 * Facebook share using dialog/share when appId provided, else sharer.php fallback.
 */
export function shareFacebookWeb(args: {
  pageUrl: string;
  quote?: string;
  hashtag?: string; // e.g. "#Nutva" or "Nutva"
  appId?: string;   // NEXT_PUBLIC_FB_APP_ID
}) {
  const hashtag = args.hashtag ? (args.hashtag.startsWith("#") ? args.hashtag : `#${args.hashtag}`) : undefined;
  const u = encodeURIComponent(args.pageUrl);
  if (args.appId) {
    const dialog = `https://www.facebook.com/dialog/share?app_id=${encodeURIComponent(args.appId)}&display=popup&href=${u}` +
      (args.quote ? `&quote=${encodeURIComponent(args.quote)}` : "") +
      (hashtag ? `&hashtag=${encodeURIComponent(hashtag)}` : "");
    openSharePopup(dialog);
  } else {
    const sharer = `https://www.facebook.com/sharer/sharer.php?u=${u}` +
      (args.quote ? `&quote=${encodeURIComponent(args.quote)}` : "");
    openSharePopup(sharer);
  }
}

export function shareTelegramWeb(pageUrl: string, text?: string) {
  const u = encodeURIComponent(pageUrl);
  const t = text ? `&text=${encodeURIComponent(text)}` : "";
  openSharePopup(`https://t.me/share/url?url=${u}${t}`);
}
