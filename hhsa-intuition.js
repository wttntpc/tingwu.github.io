(function exposeHhsaIntuition(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HhsaIntuition = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createHhsaIntuitionApi() {
  // A concept demonstration of amplitude modulation (AM), written from scratch for this site.
  // It is NOT an HHSA computation: there is no empirical mode decomposition here. The signal is a clean synthetic
  //   x(t) = [1 + depth * cos(2π fAM t)] * cos(2π fc t) + noise
  // and the "envelope" is the magnitude of the analytic signal. The design principles it teaches (a rhythm is only
  // trustworthy when the record holds enough cycles, a modulation cannot be faster than its carrier, and every demo
  // states what it can and cannot show) follow the Kidney & Cognition Lab HHSA 3-D pages (ckt520728/kidney-cognition-lab,
  // MIT). No code from that project is used.
  const FS = 128;
  const DURATIONS = [4, 8, 16];
  const MODULATION_FLOOR = 0.05; // envelope-spectrum peaks below this (carrier amplitude is about 1) are treated as no modulation
  const PEAK_TO_FLOOR = 8; // ... and must stand this many times above the median level of the envelope spectrum
  const MIN_CYCLES = 3; // rule of thumb: a rhythm needs about three cycles in the record before its frequency is trusted
  const LIMITS = {
    fc: { min: 4, max: 30, step: 0.5, value: 10 },
    fAM: { min: 0.25, max: 24, step: 0.25, value: 0.5 },
    depth: { min: 0, max: 1, step: 0.05, value: 0.7 },
    noise: { min: 0, max: 1, step: 0.05, value: 0 },
    T: { value: 8 }
  };
  const DEFAULTS = { fc: LIMITS.fc.value, fAM: LIMITS.fAM.value, depth: LIMITS.depth.value, noise: LIMITS.noise.value, T: LIMITS.T.value };

  const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

  function normalizeParams(input = {}) {
    const p = { ...DEFAULTS, ...input };
    return {
      fc: clamp(Number(p.fc), LIMITS.fc.min, LIMITS.fc.max),
      fAM: clamp(Number(p.fAM), LIMITS.fAM.min, LIMITS.fAM.max),
      depth: clamp(Number(p.depth), LIMITS.depth.min, LIMITS.depth.max),
      noise: clamp(Number(p.noise), LIMITS.noise.min, LIMITS.noise.max),
      T: DURATIONS.includes(Number(p.T)) ? Number(p.T) : DEFAULTS.T
    };
  }

  // In-place radix-2 FFT; length must be a power of two. `inverse` scales by 1/n.
  function fft(re, im, inverse = false) {
    const n = re.length;
    if (n & (n - 1)) throw new Error('fft length must be a power of two');
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const angle = (inverse ? 2 : -2) * Math.PI / len;
      const wRe = Math.cos(angle); const wIm = Math.sin(angle);
      for (let i = 0; i < n; i += len) {
        let curRe = 1; let curIm = 0;
        for (let k = 0; k < len / 2; k++) {
          const a = i + k; const b = i + k + len / 2;
          const tRe = re[b] * curRe - im[b] * curIm;
          const tIm = re[b] * curIm + im[b] * curRe;
          re[b] = re[a] - tRe; im[b] = im[a] - tIm;
          re[a] += tRe; im[a] += tIm;
          const nextRe = curRe * wRe - curIm * wIm;
          curIm = curRe * wIm + curIm * wRe; curRe = nextRe;
        }
      }
    }
    if (inverse) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generate(input = {}, seed = 7) {
    const { fc, fAM, depth, noise, T } = normalizeParams(input);
    const n = FS * T;
    const rng = mulberry32(seed);
    const x = new Float64Array(n); const trueEnvelope = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / FS;
      const env = 1 + depth * Math.cos(2 * Math.PI * fAM * t);
      const gauss = Math.sqrt(-2 * Math.log(1 - rng())) * Math.cos(2 * Math.PI * rng());
      x[i] = env * Math.cos(2 * Math.PI * fc * t) + noise * 0.5 * gauss;
      trueEnvelope[i] = Math.abs(env);
    }
    return { fs: FS, n, T, x, trueEnvelope };
  }

  // Envelope = magnitude of the analytic signal (Hilbert transform computed in the frequency domain).
  function analyticEnvelope(x) {
    const n = x.length;
    const re = Float64Array.from(x); const im = new Float64Array(n);
    fft(re, im);
    for (let k = 1; k < n / 2; k++) { re[k] *= 2; im[k] *= 2; }
    for (let k = n / 2 + 1; k < n; k++) { re[k] = 0; im[k] = 0; }
    fft(re, im, true);
    const env = new Float64Array(n);
    for (let i = 0; i < n; i++) env[i] = Math.hypot(re[i], im[i]);
    return env;
  }

  // Hann-windowed, zero-padded amplitude spectrum; a pure sinusoid of amplitude A shows up with height A.
  function amplitudeSpectrum(x, fs = FS, pad = 4) {
    const n = x.length; const size = n * pad;
    const re = new Float64Array(size); const im = new Float64Array(size);
    let windowSum = 0;
    for (let i = 0; i < n; i++) {
      const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (n - 1));
      re[i] = x[i] * w; windowSum += w;
    }
    fft(re, im);
    const bins = size / 2 + 1; const freqs = new Float64Array(bins); const amp = new Float64Array(bins);
    for (let k = 0; k < bins; k++) {
      freqs[k] = k * fs / size;
      amp[k] = (k === 0 || k === size / 2 ? 1 : 2) * Math.hypot(re[k], im[k]) / windowSum;
    }
    return { freqs, amp };
  }

  function peakIn(spectrum, lo, hi) {
    const { freqs, amp } = spectrum;
    let best = -1;
    for (let k = 1; k < freqs.length - 1; k++) {
      if (freqs[k] < lo || freqs[k] > hi) continue;
      if (best < 0 || amp[k] > amp[best]) best = k;
    }
    if (best < 0) return { f: NaN, a: NaN };
    const a = amp[best - 1]; const b = amp[best]; const c = amp[best + 1];
    const denom = a - 2 * b + c;
    const shift = denom === 0 ? 0 : 0.5 * (a - c) / denom;
    const step = freqs[1] - freqs[0];
    return { f: freqs[best] + shift * step, a: b - 0.25 * (a - c) * shift };
  }

  function medianIn(spectrum, lo, hi) {
    const values = [];
    for (let k = 0; k < spectrum.freqs.length; k++) if (spectrum.freqs[k] >= lo && spectrum.freqs[k] <= hi) values.push(spectrum.amp[k]);
    values.sort((a, b) => a - b);
    return values.length ? values[Math.floor(values.length / 2)] : NaN;
  }

  function amplitudeAt(spectrum, f) {
    const { freqs, amp } = spectrum;
    if (f < 0 || f > freqs[freqs.length - 1]) return NaN;
    return amp[Math.round(f / (freqs[1] - freqs[0]))];
  }

  const floorHz = T => MIN_CYCLES / T;

  function analyze(input = {}, seed = 7) {
    const params = normalizeParams(input);
    const signal = generate(params, seed);
    const envelope = analyticEnvelope(signal.x);
    const spectrum = amplitudeSpectrum(signal.x, FS, 4);
    const centred = Float64Array.from(envelope); let mean = 0;
    for (const v of centred) mean += v; mean /= centred.length;
    for (let i = 0; i < centred.length; i++) centred[i] -= mean;
    const envSpectrum = amplitudeSpectrum(centred, FS, 8);

    const carrier = peakIn(spectrum, 1, FS / 2 - 1);
    const am = peakIn(envSpectrum, 0.75 / params.T, FS / 2 - 1);
    const lower = params.fc - params.fAM; const upper = params.fc + params.fAM;
    const cycles = params.fAM * params.T;
    const admissible = params.fAM < params.fc;
    const resolvable = cycles >= MIN_CYCLES;
    const modulationDetected = Number.isFinite(am.a) && am.a >= MODULATION_FLOOR && am.a >= PEAK_TO_FLOOR * medianIn(envSpectrum, 0.75 / params.T, FS / 2 - 1);
    const flags = { admissible, resolvable, noisy: params.noise >= 0.5, flat: params.depth === 0, modulationDetected };
    return {
      params, signal, envelope, spectrum, envSpectrum,
      estimates: {
        carrierHz: carrier.f, carrierAmp: carrier.a, amAmp: am.a,
        amHz: modulationDetected ? am.f : NaN, amError: modulationDetected ? am.f - params.fAM : NaN,
        lowerSideband: { f: lower, amp: amplitudeAt(spectrum, lower) },
        upperSideband: { f: upper, amp: amplitudeAt(spectrum, upper) },
        expectedSidebandAmp: params.depth / 2
      },
      cycles, floorHz: floorHz(params.T), flags,
      reliable: admissible && resolvable && modulationDetected
    };
  }

  return { FS, DURATIONS, LIMITS, DEFAULTS, MIN_CYCLES, MODULATION_FLOOR, normalizeParams, fft, generate, analyticEnvelope, amplitudeSpectrum, peakIn, amplitudeAt, floorHz, analyze };
});
