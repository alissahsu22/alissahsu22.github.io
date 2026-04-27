import { useEffect, useMemo, useRef, useState } from 'react';

function gestureUrl(relativePath) {
  const base = import.meta.env.BASE_URL ?? '/';
  const path = `gesture/${relativePath}`.replace(/^\//, '');
  try {
    return new URL(path, window.location.origin + base).href;
  } catch {
    return `${base.replace(/\/?$/, '/')}${path}`.replace(/([^:]\/)\/+/g, '$1/');
  }
}

const TECHNIQUE_LABELS = {
  blue: { jp: '術式順転「蒼あお」', en: 'Cursed Technique Reversal: Blue' },
  red: { jp: '術式順転「赤あか」', en: 'Cursed Technique Reversal: Red' },
  purple: { jp: '虚式「茈」', en: 'Hollow Technique: Purple' },
  infinite_void: { jp: '領域展開「無量空処」', en: 'Domain Expansion: Infinite Void' },
};

/** Optional reference art per technique: `public/gesture/<id>/handsign.png` — 512×512 (1:1) PNGs for uniform layout. */

const NORMALIZED_OUT_PX = 256;

function isLikelyHandsignBackground(r, g, b, a) {
  if (a < 14) return true;
  const avg = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  return avg > 245 && spread < 30;
}

/**
 * Crops away empty / near-white margins inside a square PNG, then scales the ink
 * into a fixed square so every card reads at the same visual weight.
 */
function buildNormalizedHandsignDataUrl(image, outSize = NORMALIZED_OUT_PX) {
  const sw = image.naturalWidth;
  const sh = image.naturalHeight;
  if (!sw || !sh) return null;

  const src = document.createElement('canvas');
  src.width = sw;
  src.height = sh;
  const sctx = src.getContext('2d', { willReadFrequently: true });
  if (!sctx) return null;
  sctx.drawImage(image, 0, 0);

  let idata;
  try {
    idata = sctx.getImageData(0, 0, sw, sh);
  } catch {
    return null;
  }
  const d = idata.data;

  let minX = sw;
  let minY = sh;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < sh; y++) {
    const row = y * sw * 4;
    for (let x = 0; x < sw; x++) {
      const i = row + x * 4;
      if (!isLikelyHandsignBackground(d[i], d[i + 1], d[i + 2], d[i + 3])) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX) return null;

  const pad = Math.max(2, Math.round(Math.min(sw, sh) * 0.04));
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(sw - 1, maxX + pad);
  maxY = Math.min(sh - 1, maxY + pad);

  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;

  const out = document.createElement('canvas');
  out.width = outSize;
  out.height = outSize;
  const octx = out.getContext('2d');
  if (!octx) return null;
  octx.imageSmoothingEnabled = false;
  octx.fillStyle = '#fcfcfc';
  octx.fillRect(0, 0, outSize, outSize);

  const scale = Math.min(outSize / bw, outSize / bh);
  const dw = Math.max(1, Math.round(bw * scale));
  const dh = Math.max(1, Math.round(bh * scale));
  const ox = Math.round((outSize - dw) / 2);
  const oy = Math.round((outSize - dh) / 2);
  octx.drawImage(src, minX, minY, bw, bh, ox, oy, dw, dh);

  try {
    return out.toDataURL('image/png');
  } catch {
    return null;
  }
}

function loadImageElement(url) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.decoding = 'async';
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('image-load'));
    im.src = url;
  });
}

function HelpIconSvg(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm-.1-5.2c-.7 0-1.25.56-1.25 1.25S11.2 17.3 11.9 17.3s1.25-.56 1.25-1.25-.56-1.25-1.25-1.25ZM12 6.2c-1.7 0-3.05 1.1-3.05 2.7h1.9c0-.7.5-1.2 1.15-1.2.7 0 1.2.4 1.2 1.05 0 .5-.3.85-.9 1.2-.95.55-1.7 1.25-1.7 2.9v.2h1.9v-.1c0-1.05.35-1.4 1.1-1.85 1.05-.65 1.65-1.45 1.65-2.5 0-1.6-1.35-2.6-3.15-2.6Z"
      />
    </svg>
  );
}

export default function HelpHandsPanel() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [normalizedSrc, setNormalizedSrc] = useState({});
  const panelRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const r = await fetch(gestureUrl('gestures.json'), { cache: 'no-store' });
        const data = r.ok ? await r.json() : null;
        const list = Array.isArray(data?.entries) ? data.entries : [];
        if (!cancelled) setEntries(list);
      } catch {
        if (!cancelled) setEntries([]);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => panelRef.current?.focus?.(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const cards = useMemo(() => {
    const ids = entries.map((e) => e?.id).filter(Boolean);
    const unique = [...new Set(ids)];
    return unique
      .map((id) => ({
        id,
        label: TECHNIQUE_LABELS[id] ?? { jp: id, en: id },
        imgUrl: gestureUrl(`${id}/handsign.png`),
      }))
      .filter(
        (c) =>
          c.id === 'blue' ||
          c.id === 'red' ||
          c.id === 'purple' ||
          c.id === 'infinite_void'
      );
  }, [entries]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!cards.length) {
        if (!cancelled) setNormalizedSrc({});
        return;
      }
      const next = {};
      for (const c of cards) {
        try {
          const im = await loadImageElement(c.imgUrl);
          if (cancelled) return;
          const dataUrl = buildNormalizedHandsignDataUrl(im);
          if (dataUrl) next[c.id] = dataUrl;
        } catch {
          /* keep original src */
        }
      }
      if (!cancelled) setNormalizedSrc(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [cards]);

  return (
    <>
      <button
        type="button"
        className="help-hands__fab"
        aria-label={open ? 'Close handsigns panel' : 'Open handsigns panel'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <HelpIconSvg className="help-hands__fab-icon" />
      </button>

      <div
        className={`help-hands__backdrop ${open ? 'help-hands__backdrop--open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <aside
        ref={panelRef}
        className={`help-hands__panel ${open ? 'help-hands__panel--open' : ''}`}
        role="dialog"
        aria-label="Handsigns"
        tabIndex={-1}
      >
        <div className="help-hands__header">
          <div className="help-hands__title">Handsigns</div>
          <button
            type="button"
            className="help-hands__close"
            onClick={() => setOpen(false)}
            aria-label="Close handsigns panel"
          >
            ×
          </button>
        </div>

        <div className="help-hands__subtitle">
          Follow these hand signs to trigger respective techniques.
        </div>

        <div className="help-hands__grid">
          {cards.map((c) => (
            <div
              key={c.id}
              className={`help-hands__card help-hands__card--${c.id}`}
              role="group"
              aria-label={`${c.label.en} handsign`}
            >
              <div className="help-hands__thumb">
                <img
                  className="help-hands__img"
                  src={normalizedSrc[c.id] ?? c.imgUrl}
                  alt={`${c.label.en} handsign reference`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.closest('.help-hands__thumb')?.classList.add(
                      'help-hands__thumb--missing'
                    );
                  }}
                />
              </div>
              <div className="help-hands__body">
                <div className="help-hands__card-jp">{c.label.jp}</div>
                <div className="help-hands__card-en">{c.label.en}</div>
              </div>
            </div>
          ))}
          {!cards.length && (
            <div className="help-hands__empty">
              No gestures found. Expected <code>public/gesture/gestures.json</code>.
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

