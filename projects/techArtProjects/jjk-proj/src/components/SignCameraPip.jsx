import { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function gestureUrl(relativePath) {
  const base = import.meta.env.BASE_URL ?? '/';
  const path = `gesture/${relativePath}`.replace(/^\//, '');
  try {
    return new URL(path, window.location.origin + base).href;
  } catch {
    return `${base.replace(/\/?$/, '/')}${path}`.replace(/([^:]\/)\/+/g, '$1/');
  }
}

const MANIFEST_URL = gestureUrl('gestures.json');
const LEGACY_BLUE_MODEL = gestureUrl('gesture-model.json');
const LEGACY_META = gestureUrl('gesture-model.meta.json');

// Fast on / fast off: raw sigmoid per model; pick highest above threshold.
const DEFAULT_SIGN_ON_RAW = 0.9;
const SIGN_ON_BY_ID = {
  // Blue can be a bit looser because we already gate it by "two hands".
  blue: 0.97,
  // Tighten red/purple to reduce accidental activations.
  red: 0.97,
  purple: 0.97,
  // Domain expansion: keep fairly strict.
  infinite_void: 0.97,
};
const OFF_STREAK = 2;

/** Require a technique to win N consecutive frames before activating/switching. */
const ACTIVATE_HOLD_FRAMES = 2;

/**
 * Disambiguation rules to reduce false positives:
 * - Blue is the only two-hand sign: only consider blue when BOTH hands are visible.
 * - All other signs are treated as one-hand: only consider them when EXACTLY one hand is visible.
 */
const TWO_HAND_ONLY_IDS = new Set(['blue']);

/** Skip all technique models when the tracked hand looks like a full fist (reduces NN false positives). */
const REJECT_CLOSED_FIST = true;
/** Index/middle/ring/pinky: curled if fingertip is not clearly past the PIP toward the wrist (full fist → all four curled). */
const FIST_CURLED_RATIO = 1.06;
const FIST_MIN_CURLED_TO_VETO = 4;

const FINGER_INDICES = {
  thumb: [0, 1, 2, 3, 4],
  index: [0, 5, 6, 7, 8],
  middle: [0, 9, 10, 11, 12],
  ring: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

function normalizeHand(lm) {
  const w = lm[0];
  const mcp = lm[9];
  const scale =
    Math.sqrt((mcp.x - w.x) ** 2 + (mcp.y - w.y) ** 2 + (mcp.z - w.z) ** 2) ||
    1;
  const out = [];
  for (let i = 0; i < 21; i++) {
    out.push((lm[i].x - w.x) / scale);
    out.push((lm[i].y - w.y) / scale);
    out.push((lm[i].z - w.z) / scale);
  }
  return out;
}

function dist3(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z ?? 0) - (b.z ?? 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Landmarks used for a given pack (same choice as feature vector).
 * Returns null for `both` (no fist veto).
 */
function landmarksForHandMode(right, left, gestureHandMode) {
  if (gestureHandMode === 'both') return null;
  if (gestureHandMode === 'right') return right ?? null;
  if (gestureHandMode === 'left') return left ?? null;
  return right ?? left ?? null;
}

/** True if all four fingers read as curled (typical closed fist). */
function looksLikeClosedFist(lm) {
  if (!lm || lm.length < 21) return false;
  const wrist = lm[0];
  const chains = [
    [8, 6],
    [12, 10],
    [16, 14],
    [20, 18],
  ];
  let curled = 0;
  for (const [tipI, pipI] of chains) {
    const dTip = dist3(lm[tipI], wrist);
    const dPip = dist3(lm[pipI], wrist);
    if (dTip < dPip * FIST_CURLED_RATIO) curled += 1;
  }
  return curled >= FIST_MIN_CURLED_TO_VETO;
}

function buildGestureFeatures(right, left, gestureHandMode) {
  if (gestureHandMode === 'both') {
    if (!right || !left) return null;
    return [...normalizeHand(right), ...normalizeHand(left)];
  }
  if (gestureHandMode === 'right') {
    if (!right) return null;
    return normalizeHand(right);
  }
  if (gestureHandMode === 'left') {
    if (!left) return null;
    return normalizeHand(left);
  }
  if (right) return normalizeHand(right);
  if (left) return normalizeHand(left);
  return null;
}

function drawFingerSkeleton(ctx, lm, w, h) {
  ctx.strokeStyle = 'rgba(120, 220, 255, 0.85)';
  ctx.lineWidth = 2;
  for (const indices of Object.values(FINGER_INDICES)) {
    ctx.beginPath();
    indices.forEach((i, idx) => {
      const x = lm[i].x * w;
      const y = lm[i].y * h;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  lm.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x * w, point.y * h, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 200, 120, 0.95)';
    ctx.fill();
  });
}

async function loadMeta(url) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (r.ok) return await r.json();
  } catch {
    /* optional */
  }
  return null;
}

function handModeFromMeta(meta, dim, fallback) {
  let mode = fallback;
  const metaDim =
    meta && meta.featureDim != null ? Number(meta.featureDim) : null;
  const metaOk =
    metaDim == null || Number.isNaN(metaDim) || metaDim === dim;
  if (metaOk && meta && meta.handMode) mode = meta.handMode;
  if (dim === 126) return 'both';
  if (dim === 63 && mode === 'both') return 'either';
  return mode;
}

async function loadGesturePack() {
  let entries = null;
  try {
    const mr = await fetch(MANIFEST_URL, { cache: 'no-store' });
    if (mr.ok) {
      const data = await mr.json();
      entries = data.entries;
    }
  } catch {
    /* use legacy */
  }

  if (!entries?.length) {
    entries = [
      {
        id: 'blue',
        model: 'gesture-model.json',
        meta: 'gesture-model.meta.json',
      },
    ];
  }

  const loaded = [];
  for (const ent of entries) {
    const id = ent.id;
    if (id !== 'blue' && id !== 'red' && id !== 'purple' && id !== 'infinite_void')
      continue;
    const modelUrl = gestureUrl(ent.model);
    const metaUrl = ent.meta ? gestureUrl(ent.meta) : null;

    try {
      const model = await tf.loadLayersModel(modelUrl);
      const dim = model.inputs[0].shape[1];
      const meta = metaUrl ? await loadMeta(metaUrl) : null;
      const handMode = handModeFromMeta(meta, dim, 'either');
      loaded.push({ id, model, handMode });
      console.log('SignCameraPip: loaded gesture model', { id, handMode, dim });
    } catch (e) {
      console.warn(`SignCameraPip: skipped "${id}" (${modelUrl})`, e?.message || e);
    }
  }

  if (!loaded.length) {
    try {
      const model = await tf.loadLayersModel(LEGACY_BLUE_MODEL);
      const dim = model.inputs[0].shape[1];
      const meta = await loadMeta(LEGACY_META);
      const handMode = handModeFromMeta(meta, dim, 'either');
      loaded.push({ id: 'blue', model, handMode });
      console.log('SignCameraPip: fallback legacy blue model');
    } catch (e) {
      console.error('SignCameraPip: no gesture models loaded', e);
    }
  }

  return loaded;
}

/**
 * Webcam PIP: one trained binary model per technique (see public/gesture/gestures.json).
 * Highest confidence above threshold wins (blue / red / purple anytime).
 */
export default function SignCameraPip({
  onActivateTechnique,
  onClearGestureEffects,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const onActivateRef = useRef(onActivateTechnique);
  const onClearRef = useRef(onClearGestureEffects);

  useEffect(() => {
    onActivateRef.current = onActivateTechnique;
    onClearRef.current = onClearGestureEffects ?? (() => {});
  }, [onActivateTechnique, onClearGestureEffects]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const HolisticCtor = window.Holistic;
    const CameraCtor = window.Camera;
    if (!HolisticCtor || !CameraCtor) {
      console.warn('SignCameraPip: MediaPipe scripts missing (Holistic / Camera).');
      return;
    }

    let cancelled = false;
    /** @type {{ id: string, model: import('@tensorflow/tfjs').LayersModel, handMode: string }[]} */
    let packs = [];

    const activeIdRef = { v: null };
    const belowOffRef = { v: 0 };
    const pendingIdRef = { v: null };
    const pendingStreakRef = { v: 0 };

    const ctx = canvas.getContext('2d');

    async function loadAll() {
      packs = await loadGesturePack();
      if (cancelled) {
        for (const p of packs) p.model.dispose();
        packs = [];
      }
    }

    function predictRaw(pack, right, left) {
      const vec = buildGestureFeatures(right, left, pack.handMode);
      if (!vec) return null;
      const input = tf.tensor2d([vec]);
      const raw = pack.model.predict(input).dataSync()[0];
      input.dispose();
      return raw;
    }

    function pickWinner(right, left) {
      const bothHands = Boolean(right && left);
      const oneHand = Boolean((right && !left) || (!right && left));
      const candidates = [];
      for (const pack of packs) {
        if (bothHands) {
          if (!TWO_HAND_ONLY_IDS.has(pack.id)) continue;
        } else if (oneHand) {
          if (TWO_HAND_ONLY_IDS.has(pack.id)) continue;
        } else {
          continue;
        }

        if (REJECT_CLOSED_FIST) {
          const lm = landmarksForHandMode(right, left, pack.handMode);
          if (lm && looksLikeClosedFist(lm)) {
            continue;
          }
        }
        const raw = predictRaw(pack, right, left);
        const onThr = SIGN_ON_BY_ID[pack.id] ?? DEFAULT_SIGN_ON_RAW;
        if (raw != null && raw >= onThr) {
          candidates.push({ id: pack.id, raw });
        }
      }
      if (!candidates.length) return null;
      candidates.sort((a, b) => b.raw - a.raw);
      return candidates[0].id;
    }

    function runGestureCheck(right, left) {
      if (!packs.length) return;

      if (!right && !left) {
        belowOffRef.v = 0;
        pendingIdRef.v = null;
        pendingStreakRef.v = 0;
        if (activeIdRef.v != null) {
          activeIdRef.v = null;
          onClearRef.current();
        }
        return;
      }

      const winner = pickWinner(right, left);
      const active = activeIdRef.v;

      if (winner == null) {
        pendingIdRef.v = null;
        pendingStreakRef.v = 0;
        belowOffRef.v += 1;
        if (belowOffRef.v >= OFF_STREAK && active != null) {
          activeIdRef.v = null;
          onClearRef.current();
        }
        return;
      }

      belowOffRef.v = 0;

      if (winner === active) {
        pendingIdRef.v = null;
        pendingStreakRef.v = 0;
        return;
      }

      if (pendingIdRef.v === winner) pendingStreakRef.v += 1;
      else {
        pendingIdRef.v = winner;
        pendingStreakRef.v = 1;
      }

      if (pendingStreakRef.v >= ACTIVATE_HOLD_FRAMES) {
        pendingIdRef.v = null;
        pendingStreakRef.v = 0;
        activeIdRef.v = winner;
        onActivateRef.current?.(winner);
      }
    }

    const holistic = new HolisticCtor({
      locateFile: (f) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${f}`,
    });
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
    });

    holistic.onResults((res) => {
      if (cancelled || !video.videoWidth) return;
      const displayW = video.clientWidth;
      const displayH = video.clientHeight;
      if (displayW < 2 || displayH < 2) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(displayW * dpr);
      canvas.height = Math.round(displayH * dpr);
      canvas.style.width = `${displayW}px`;
      canvas.style.height = `${displayH}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, displayW, displayH);
      ctx.drawImage(video, 0, 0, displayW, displayH);

      runGestureCheck(res.rightHandLandmarks, res.leftHandLandmarks);

      if (res.rightHandLandmarks)
        drawFingerSkeleton(ctx, res.rightHandLandmarks, displayW, displayH);
      if (res.leftHandLandmarks)
        drawFingerSkeleton(ctx, res.leftHandLandmarks, displayW, displayH);
    });

    const camera = new CameraCtor(video, {
      width: 640,
      height: 480,
      onFrame: async () => {
        if (cancelled) return;
        await holistic.send({ image: video });
      },
    });

    void loadAll().then(() => {
      if (!cancelled) camera.start();
    });

    return () => {
      cancelled = true;
      camera.stop();
      holistic.close();
      for (const p of packs) {
        p.model.dispose();
      }
      packs = [];
    };
  }, []);

  return (
    <div className="sign-camera-pip">
      <div className="sign-camera-pip__mirror">
        <video
          ref={videoRef}
          className="sign-camera-pip__video"
          playsInline
          muted
          autoPlay
        />
        <canvas ref={canvasRef} className="sign-camera-pip__canvas" />
      </div>
    </div>
  );
}
