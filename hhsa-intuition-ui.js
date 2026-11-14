(function exposeHhsaIntuitionUI(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HhsaIntuitionUI = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createHhsaIntuitionUIApi() {
  const dep = (name, file) => (typeof require === 'function' ? require(file) : globalThis[name]);
  const Core = () => dep('HhsaIntuition', './hhsa-intuition.js');

  let teardown = null;

  const copy = {
    zh: {
      back: '← 返回互動實驗室', eyebrow: 'Signal intuition · 05', title: '誰在調變誰？<br>看見「振幅的振幅」',
      lead: '腦波、心率這類訊號，不只是在振盪，振盪的強弱本身也在起落。用滑桿調整載波與調幅，看傅立葉頻譜、包絡，以及「載波–調幅平面」各自能告訴你什麼。',
      caveat: '這是概念示範，不是 HHSA 計算：使用乾淨的合成訊號與希爾伯特包絡，沒有經驗模態分解，也沒有任何真人資料。',
      controlsTitle: '調整訊號', presetsTitle: '試試看',
      fc: '載波頻率 fc', fAM: '調幅頻率 fAM', depth: '調幅深度 m', noise: '雜訊', T: '紀錄長度 T', hz: 'Hz', sec: '秒',
      presets: [['flat', '沒有調幅'], ['short', '紀錄太短'], ['fast', '調幅比載波快'], ['noise', '加入雜訊'], ['reset', '重設']],
      timeTitle: '① 時間序列與包絡', timeLead: '細線是訊號；實線是由訊號估計的包絡，虛線是設定的真實包絡。兩端的差異是希爾伯特包絡的邊界效應。',
      specTitle: '② 傅立葉頻譜', specLead: '調幅訊號在傅立葉頻譜裡只是三個固定的頻率成分：載波與上下各一個側帶（理論振幅 m/2）。頻譜看不出「誰在調變誰」。橫軸已自動放大到載波附近。',
      planeTitle: '③ 載波–調幅平面', planeLead: '橫軸是載波、縱軸是調幅（對數刻度）。斜線上方的灰色區塊是不成立的區域（調幅不能比載波快）；底部灰帶低於 3/T，紀錄裡不到三個週期。',
      legend: { signal: '訊號', est: '估計包絡', truth: '設定包絡', set: '設定值', found: '由訊號估計' },
      axis: { time: '時間（秒）', freq: '頻率（Hz）', amp: '振幅', fc: '載波頻率 fc（Hz）', fam: '調幅頻率 fAM（Hz）' },
      forbid: 'fAM ≥ fc：不成立', floorLabel: '低於 3/T：不可解析',
      readTitle: '讀數', rows: {
        carrier: '載波頻率', sidebands: '側帶振幅（理論 m/2）', am: '調幅頻率', cycles: '紀錄中的調幅週期數',
        set: '設定', peak: '頻譜峰值', lower: '下側帶', upper: '上側帶', est: '由包絡估計', err: '誤差', none: '偵測不到', need: '至少需要 3 個', ok: '足夠', short: '不足'
      },
      alerts: {
        inadmissible: '調幅頻率不能比載波頻率快（fAM ≥ fc）。這組設定在物理上不成立：包絡失去意義，下方的估計值不可信。',
        short: cycles => `紀錄裡只有 ${cycles} 個調幅週期（少於 3 個）。頻率與振幅的估計都可能偏差；請延長紀錄，或提高調幅頻率。`,
        flat: '調幅深度為 0：訊號沒有調幅，包絡是平的，傅立葉頻譜只有一個峰。',
        undetected: '雜訊太大或調幅太淺，包絡的頻譜裡找不到明確的調幅節奏。',
        noisy: '雜訊很高：包絡的起伏有一部分來自雜訊，不是調幅。',
        fine: '目前設定下，各項條件都成立。這只代表這個乾淨的合成示範。'
      },
      canTitle: '可以說', can: ['調幅訊號在傅立葉頻譜裡，只是載波加上下兩個側帶，三個固定的頻率成分。', '調幅的節奏藏在包絡裡，對包絡再做頻譜，就能讀出它。', '紀錄越短，越慢的調幅越難可靠估計；調幅不可能比載波還快。'],
      cannotTitle: '不能說', cannot: ['這不是 HHSA：沒有經驗模態分解，用的是乾淨、已知的合成訊號與希爾伯特包絡。', '不能代表腦波、心率等真實訊號的表現；它們是非平穩的，且有雜訊與偽影。', '「至少三個週期」是經驗法則，不是嚴格的統計門檻。', '這裡沒有任何真人資料，不能用來判斷任何人的生理狀態。'],
      readingTitle: '延伸閱讀', readingPost: '從 EMD、瞬時頻率到 HHSA：如何看見腦波的振幅調變？',
      refs: ['Huang, N. E., Hu, K., Yang, A. C. C., Chang, H.-C., Jia, D., Liang, W.-K., Yeh, J. R., Kao, C.-L., Juan, C.-H., Peng, C. K., Meijer, J. H., Wang, Y.-H., Long, S. R., & Wu, Z. (2016). On Holo-Hilbert spectral analysis: A full informational spectral representation for nonlinear and non-stationary data. Philosophical Transactions of the Royal Society A, 374(2065), Article 20150206.', 'Huang, N. E., Shen, Z., Long, S. R., Wu, M. C., Shih, H. H., Zheng, Q., Yen, N.-C., Tung, C. C., & Liu, H. H. (1998). The empirical mode decomposition and the Hilbert spectrum for nonlinear and non-stationary time series analysis. Proceedings of the Royal Society of London. Series A, 454(1971), 903–995.'],
      refLinks: ['https://doi.org/10.1098/rsta.2015.0206', 'https://doi.org/10.1098/rspa.1998.0193'],
      privacy: '所有計算都在你的瀏覽器裡進行，沒有上傳任何資料。', alt: { time: '訊號與包絡的時間序列', spec: '傅立葉振幅頻譜', plane: '載波對調幅的平面圖' }
    },
    en: {
      back: '← Back to the interactive lab', eyebrow: 'Signal intuition · 05', title: 'Who modulates whom?<br>Seeing the “amplitude of the amplitude”',
      lead: 'Signals such as EEG and heart rate do not only oscillate; the strength of the oscillation itself rises and falls. Adjust the carrier and the modulation with the sliders and see what the Fourier spectrum, the envelope, and the carrier–modulation plane each tell you.',
      caveat: 'This is a concept demonstration, not an HHSA computation: it uses a clean synthetic signal and a Hilbert envelope, with no empirical mode decomposition and no human data.',
      controlsTitle: 'Adjust the signal', presetsTitle: 'Try it',
      fc: 'Carrier frequency fc', fAM: 'Modulation frequency fAM', depth: 'Modulation depth m', noise: 'Noise', T: 'Record length T', hz: 'Hz', sec: 's',
      presets: [['flat', 'No modulation'], ['short', 'Record too short'], ['fast', 'Modulation faster than carrier'], ['noise', 'Add noise'], ['reset', 'Reset']],
      timeTitle: '① Time series and envelope', timeLead: 'The thin line is the signal; the solid line is the envelope estimated from it, and the dashed line is the true envelope that was set. Differences at the two ends are the boundary effect of the Hilbert envelope.',
      specTitle: '② Fourier spectrum', specLead: 'In the Fourier spectrum a modulated signal is just three fixed frequency components: the carrier and one sideband on each side (theoretical amplitude m/2). The spectrum cannot show who modulates whom. The horizontal axis zooms in near the carrier automatically.',
      planeTitle: '③ Carrier–modulation plane', planeLead: 'Carrier on the horizontal axis and modulation on the vertical axis (log scales). The grey region above the diagonal is not allowed (a modulation cannot be faster than its carrier); the band at the bottom is below 3/T, fewer than three cycles in the record.',
      legend: { signal: 'Signal', est: 'Estimated envelope', truth: 'True envelope', set: 'Set value', found: 'Estimated from signal' },
      axis: { time: 'Time (s)', freq: 'Frequency (Hz)', amp: 'Amplitude', fc: 'Carrier fc (Hz)', fam: 'Modulation fAM (Hz)' },
      forbid: 'fAM ≥ fc: not allowed', floorLabel: 'Below 3/T: not resolvable',
      readTitle: 'Readout', rows: {
        carrier: 'Carrier frequency', sidebands: 'Sideband amplitude (theory m/2)', am: 'Modulation frequency', cycles: 'Modulation cycles in the record',
        set: 'Set', peak: 'Spectral peak', lower: 'Lower sideband', upper: 'Upper sideband', est: 'Estimated from envelope', err: 'Error', none: 'Not detected', need: 'At least 3 needed', ok: 'enough', short: 'too few'
      },
      alerts: {
        inadmissible: 'A modulation cannot be faster than its carrier (fAM ≥ fc). This setting is not physically valid: the envelope loses its meaning and the estimates below cannot be trusted.',
        short: cycles => `The record holds only ${cycles} modulation cycles (fewer than 3). Frequency and amplitude estimates may be off; lengthen the record or raise the modulation frequency.`,
        flat: 'Modulation depth is 0: the signal has no modulation, the envelope is flat, and the Fourier spectrum has a single peak.',
        undetected: 'With this much noise, or a modulation this shallow, the envelope spectrum shows no clear modulation rhythm.',
        noisy: 'Noise is high: part of the envelope’s ups and downs comes from noise, not from modulation.',
        fine: 'Under the current settings every condition holds. That only describes this clean synthetic demonstration.'
      },
      canTitle: 'What this can show', can: ['In the Fourier spectrum a modulated signal is just a carrier plus two sidebands: three fixed frequency components.', 'The modulation rhythm lives in the envelope, and the spectrum of the envelope reveals it.', 'The shorter the record, the harder it is to estimate a slow modulation reliably; a modulation cannot be faster than its carrier.'],
      cannotTitle: 'What it cannot show', cannot: ['It is not HHSA: there is no empirical mode decomposition, only a clean, known synthetic signal and a Hilbert envelope.', 'It does not represent how real EEG or heart-rate signals behave; those are non-stationary and carry noise and artifacts.', '“At least three cycles” is a rule of thumb, not a strict statistical threshold.', 'No human data are used here, so it cannot be used to judge anyone’s physiological state.'],
      readingTitle: 'Further reading', readingPost: 'From EMD and Instantaneous Frequency to HHSA: How Can We See Amplitude Modulation in Brain Waves?',
      refs: ['Huang, N. E., Hu, K., Yang, A. C. C., Chang, H.-C., Jia, D., Liang, W.-K., Yeh, J. R., Kao, C.-L., Juan, C.-H., Peng, C. K., Meijer, J. H., Wang, Y.-H., Long, S. R., & Wu, Z. (2016). On Holo-Hilbert spectral analysis: A full informational spectral representation for nonlinear and non-stationary data. Philosophical Transactions of the Royal Society A, 374(2065), Article 20150206.', 'Huang, N. E., Shen, Z., Long, S. R., Wu, M. C., Shih, H. H., Zheng, Q., Yen, N.-C., Tung, C. C., & Liu, H. H. (1998). The empirical mode decomposition and the Hilbert spectrum for nonlinear and non-stationary time series analysis. Proceedings of the Royal Society of London. Series A, 454(1971), 903–995.'],
      refLinks: ['https://doi.org/10.1098/rsta.2015.0206', 'https://doi.org/10.1098/rspa.1998.0193'],
      privacy: 'Everything is computed in your browser; no data are uploaded.', alt: { time: 'Time series of the signal and its envelope', spec: 'Fourier amplitude spectrum', plane: 'Plane of carrier against modulation frequency' }
    }
  };

  const PRESETS = {
    flat: { depth: 0 },
    short: { T: 4, fAM: 0.5 },
    fast: { fc: 6, fAM: 9 },
    noise: { noise: 0.8 },
    reset: {}
  };

  const W = 640; const H = 214; const M = { l: 48, r: 14, t: 16, b: 42 };
  const fmt = (value, digits = 2) => (Number.isFinite(value) ? (Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value).toFixed(digits) : '—');
  const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function niceStep(span, count) {
    const raw = span / count; const magnitude = 10 ** Math.floor(Math.log10(raw));
    const norm = raw / magnitude;
    return (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * magnitude;
  }

  function ticks(lo, hi, count = 5) {
    const step = niceStep(hi - lo, count); const list = [];
    for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) list.push(Number(v.toFixed(6)));
    return list;
  }

  function polyline(xs, ys, className, stride = 1) {
    let d = '';
    for (let i = 0; i < xs.length; i += stride) d += `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`;
    return `<path class="${className}" d="${d}" fill="none"/>`;
  }

  function timeChart(c, result) {
    const { signal, envelope, params } = result; const n = signal.n;
    let maxAbs = 0; for (const v of signal.x) maxAbs = Math.max(maxAbs, Math.abs(v));
    const A = Math.max(2, Math.ceil(maxAbs * 2) / 2);
    const px = i => M.l + (i / (n - 1)) * (W - M.l - M.r);
    const py = v => M.t + (1 - (v + A) / (2 * A)) * (H - M.t - M.b);
    const xs = Array.from({ length: n }, (_, i) => px(i));
    const series = values => Array.from(values, v => py(v));
    const neg = values => Array.from(values, v => py(-v));
    const xTicks = [0, params.T / 2, params.T].map(v => `<line class="hh-grid" x1="${(M.l + (v / params.T) * (W - M.l - M.r)).toFixed(1)}" x2="${(M.l + (v / params.T) * (W - M.l - M.r)).toFixed(1)}" y1="${M.t}" y2="${H - M.b}"/><text x="${(M.l + (v / params.T) * (W - M.l - M.r)).toFixed(1)}" y="${H - M.b + 14}" text-anchor="middle">${v}</text>`).join('');
    const yTicks = [-A, 0, A].map(v => `<line class="hh-grid" x1="${M.l}" x2="${W - M.r}" y1="${py(v).toFixed(1)}" y2="${py(v).toFixed(1)}"/><text x="${M.l - 6}" y="${(py(v) + 4).toFixed(1)}" text-anchor="end">${v}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.alt.time}" class="hhsa-chart"><title>${c.alt.time}</title>${xTicks}${yTicks}
      ${polyline(xs, series(signal.x), 'hh-signal')}${polyline(xs, series(signal.trueEnvelope), 'hh-true')}${polyline(xs, neg(signal.trueEnvelope), 'hh-true')}
      ${polyline(xs, series(envelope), 'hh-env')}${polyline(xs, neg(envelope), 'hh-env hh-env-low')}
      <text x="${(W + M.l) / 2}" y="${H - 4}" text-anchor="middle">${c.axis.time}</text><text x="${M.l}" y="${M.t - 4}" text-anchor="start">${c.axis.amp}</text></svg>`;
  }

  function spectrumChart(c, result) {
    const { params, spectrum, estimates } = result;
    const span = Math.max(params.fAM, 1) * 2.5;
    const lo = Math.max(0, params.fc - span); const hi = Math.min(64, params.fc + span);
    const px = f => M.l + ((f - lo) / (hi - lo)) * (W - M.l - M.r);
    const maxAmp = 1.2;
    const py = a => M.t + (1 - Math.min(a, maxAmp) / maxAmp) * (H - M.t - M.b);
    const xs = []; const ys = [];
    for (let k = 0; k < spectrum.freqs.length; k++) {
      const f = spectrum.freqs[k];
      if (f < lo || f > hi) continue;
      xs.push(px(f)); ys.push(py(spectrum.amp[k]));
    }
    const xTicks = ticks(lo, hi, 6).map(v => `<line class="hh-grid" x1="${px(v).toFixed(1)}" x2="${px(v).toFixed(1)}" y1="${M.t}" y2="${H - M.b}"/><text x="${px(v).toFixed(1)}" y="${H - M.b + 14}" text-anchor="middle">${v}</text>`).join('');
    const yTicks = [0, 0.5, 1].map(v => `<line class="hh-grid" x1="${M.l}" x2="${W - M.r}" y1="${py(v).toFixed(1)}" y2="${py(v).toFixed(1)}"/><text x="${M.l - 6}" y="${(py(v) + 4).toFixed(1)}" text-anchor="end">${v}</text>`).join('');
    const marks = [['fc−fAM', params.fc - params.fAM, 0], ['fc', params.fc, 1], ['fc+fAM', params.fc + params.fAM, 0]]
      .filter(item => item[1] >= lo && item[1] <= hi && item[1] > 0)
      .map(([label, f, level]) => `<line class="hh-marker" x1="${px(f).toFixed(1)}" x2="${px(f).toFixed(1)}" y1="${M.t + 14}" y2="${H - M.b}"/><text class="hh-marker-label" x="${px(f).toFixed(1)}" y="${M.t + 10 + level * 12}" text-anchor="middle">${label}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.alt.spec}" class="hhsa-chart"><title>${c.alt.spec}</title>${xTicks}${yTicks}${marks}
      ${polyline(xs, ys, 'hh-spectrum')}<text x="${(W + M.l) / 2}" y="${H - 4}" text-anchor="middle">${c.axis.freq}</text><text x="${M.l}" y="${M.t - 4}" text-anchor="start">${c.axis.amp}</text></svg>`;
  }

  function planeChart(c, result) {
    const { params, estimates, floorHz, flags } = result;
    const PW = 420; const PH = 320; const P = { l: 52, r: 14, t: 14, b: 40 };
    const xLo = 1; const xHi = 40; const yLo = 0.1; const yHi = 40;
    const lx = v => Math.log10(v); const px = v => P.l + ((lx(v) - lx(xLo)) / (lx(xHi) - lx(xLo))) * (PW - P.l - P.r);
    const py = v => P.t + (1 - (lx(v) - lx(yLo)) / (lx(yHi) - lx(yLo))) * (PH - P.t - P.b);
    const xs = [1, 2, 5, 10, 20, 40]; const ys = [0.1, 0.3, 1, 3, 10, 30];
    const grid = xs.map(v => `<line class="hh-grid" x1="${px(v).toFixed(1)}" x2="${px(v).toFixed(1)}" y1="${P.t}" y2="${PH - P.b}"/><text x="${px(v).toFixed(1)}" y="${PH - P.b + 14}" text-anchor="middle">${v}</text>`).join('')
      + ys.map(v => `<line class="hh-grid" x1="${P.l}" x2="${PW - P.r}" y1="${py(v).toFixed(1)}" y2="${py(v).toFixed(1)}"/><text x="${P.l - 6}" y="${(py(v) + 4).toFixed(1)}" text-anchor="end">${v}</text>`).join('');
    const forbid = `<polygon class="hh-forbid" points="${px(1).toFixed(1)},${py(1).toFixed(1)} ${px(1).toFixed(1)},${py(yHi).toFixed(1)} ${px(xHi).toFixed(1)},${py(yHi).toFixed(1)}"/><line class="hh-diagonal" x1="${px(1).toFixed(1)}" y1="${py(1).toFixed(1)}" x2="${px(xHi).toFixed(1)}" y2="${py(yHi).toFixed(1)}"/>`;
    const floor = `<rect class="hh-floor" x="${P.l}" y="${py(floorHz).toFixed(1)}" width="${(PW - P.l - P.r).toFixed(1)}" height="${(py(yLo) - py(floorHz)).toFixed(1)}"/>`;
    const inFrame = (x, y) => Number.isFinite(x) && Number.isFinite(y) && x >= xLo && x <= xHi && y >= yLo && y <= yHi;
    const truth = inFrame(params.fc, params.fAM) ? `<circle class="hh-point" cx="${px(params.fc).toFixed(1)}" cy="${py(params.fAM).toFixed(1)}" r="5"/>` : '';
    const found = flags.modulationDetected && inFrame(estimates.carrierHz, estimates.amHz) ? `<circle class="hh-est" cx="${px(estimates.carrierHz).toFixed(1)}" cy="${py(estimates.amHz).toFixed(1)}" r="9"/>` : '';
    return `<svg viewBox="0 0 ${PW} ${PH}" role="img" aria-label="${c.alt.plane}" class="hhsa-chart hhsa-plane">
      <title>${c.alt.plane}</title>${grid}${forbid}${floor}
      <text class="hh-note" x="${px(1.25).toFixed(1)}" y="${py(25).toFixed(1)}">${c.forbid}</text><text class="hh-note" x="${(PW - P.r - 4).toFixed(1)}" y="${(py(yLo) - 5).toFixed(1)}" text-anchor="end">${c.floorLabel}</text>
      ${found}${truth}
      <text x="${(PW + P.l) / 2}" y="${PH - 4}" text-anchor="middle">${c.axis.fc}</text><text x="${P.l}" y="${P.t - 3}" text-anchor="start">${c.axis.fam}</text></svg>`;
  }

  function legendMarkup(c) {
    return `<ul class="hhsa-legend"><li><i class="hh-key hh-key-signal"></i>${c.legend.signal}</li><li><i class="hh-key hh-key-env"></i>${c.legend.est}</li><li><i class="hh-key hh-key-true"></i>${c.legend.truth}</li></ul>`;
  }

  function planeLegendMarkup(c) {
    return `<ul class="hhsa-legend"><li><i class="hh-key hh-key-point"></i>${c.legend.set}</li><li><i class="hh-key hh-key-est"></i>${c.legend.found}</li></ul>`;
  }

  function readoutMarkup(c, result, lang = 'zh') {
    const { params, estimates, cycles, flags } = result; const r = c.rows;
    const [open, close, semi] = lang === 'zh' ? ['（', '）', '；'] : [' (', ')', '; '];
    const cycleStatus = flags.resolvable ? r.ok : r.short;
    const amText = flags.modulationDetected ? `${fmt(estimates.amHz)} ${c.hz}${open}${r.err} ${estimates.amError >= 0 ? '+' : ''}${fmt(estimates.amError)}${close}` : r.none;
    return `<dl class="hhsa-readout">
      <div><dt>${r.carrier}</dt><dd>${r.set} ${fmt(params.fc, 1)} ${c.hz} · ${r.peak} ${fmt(estimates.carrierHz)} ${c.hz}</dd></div>
      <div><dt>${r.sidebands}</dt><dd>${fmt(estimates.expectedSidebandAmp)} · ${r.lower} ${fmt(estimates.lowerSideband.amp)} · ${r.upper} ${fmt(estimates.upperSideband.amp)}</dd></div>
      <div><dt>${r.am}</dt><dd>${r.set} ${fmt(params.fAM)} ${c.hz} · ${r.est} ${amText}</dd></div>
      <div><dt>${r.cycles}</dt><dd>${fmt(cycles, 1)}${open}${r.need}${semi}${cycleStatus}${close}</dd></div></dl>`;
  }

  function alertsMarkup(c, result) {
    const { flags, cycles } = result; const items = [];
    if (!flags.admissible) items.push(['warn', c.alerts.inadmissible]);
    else if (flags.flat) items.push(['info', c.alerts.flat]);
    else {
      if (!flags.resolvable) items.push(['warn', c.alerts.short(fmt(cycles, 1))]);
      if (!flags.modulationDetected) items.push(['warn', c.alerts.undetected]);
      else if (flags.noisy) items.push(['info', c.alerts.noisy]);
    }
    if (!items.length) items.push(['ok', c.alerts.fine]);
    return `<ul class="hhsa-alerts" role="status" aria-live="polite">${items.map(([level, text]) => `<li class="is-${level}">${text}</li>`).join('')}</ul>`;
  }

  function chartsMarkup(lang, result) {
    const c = copy[lang] || copy.zh;
    return { time: timeChart(c, result) + legendMarkup(c), spectrum: spectrumChart(c, result), plane: planeChart(c, result) + planeLegendMarkup(c), readout: readoutMarkup(c, result, lang), alerts: alertsMarkup(c, result) };
  }

  function controlMarkup(c, key, limits, value) {
    const unit = key === 'depth' || key === 'noise' ? '' : ` ${c.hz}`;
    return `<div class="hhsa-control"><label for="hhsa-${key}">${c[key]}</label><input id="hhsa-${key}" data-hhsa="${key}" type="range" min="${limits.min}" max="${limits.max}" step="${limits.step}" value="${value}"><output id="hhsa-${key}-out" for="hhsa-${key}">${value}${unit}</output></div>`;
  }

  function buildHhsaMarkup(lang = 'zh', input = {}) {
    const c = copy[lang] || copy.zh; const Hh = Core();
    const params = Hh.normalizeParams(input); const result = Hh.analyze(params); const parts = chartsMarkup(lang, result);
    const durations = Hh.DURATIONS.map(value => `<option value="${value}"${value === params.T ? ' selected' : ''}>${value} ${c.sec}</option>`).join('');
    return `<div class="page-shell experiment-page hhsa-page"><a class="back-link" href="#/lab">${c.back}</a>
      <header class="experiment-header"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.lead}</p></header>
      <p class="demo-caveat">⚠️ ${c.caveat}</p>
      <section class="hhsa-controls" aria-labelledby="hhsa-controls-title"><h2 id="hhsa-controls-title">${c.controlsTitle}</h2>
        ${controlMarkup(c, 'fc', Hh.LIMITS.fc, params.fc)}${controlMarkup(c, 'fAM', Hh.LIMITS.fAM, params.fAM)}${controlMarkup(c, 'depth', Hh.LIMITS.depth, params.depth)}${controlMarkup(c, 'noise', Hh.LIMITS.noise, params.noise)}
        <div class="hhsa-control"><label for="hhsa-T">${c.T}</label><select id="hhsa-T" data-hhsa="T">${durations}</select></div>
        <div class="hhsa-presets" role="group" aria-label="${c.presetsTitle}"><span>${c.presetsTitle}</span>${c.presets.map(([id, label]) => `<button type="button" data-hhsa-preset="${id}">${label}</button>`).join('')}</div>
      </section>
      <div id="hhsa-alerts">${parts.alerts}</div>
      <section class="hhsa-figure"><h2>${c.timeTitle}</h2><p>${c.timeLead}</p><div id="hhsa-time">${parts.time}</div></section>
      <section class="hhsa-figure"><h2>${c.specTitle}</h2><p>${c.specLead}</p><div id="hhsa-spectrum">${parts.spectrum}</div></section>
      <section class="hhsa-figure"><h2>${c.planeTitle}</h2><p>${c.planeLead}</p><div id="hhsa-plane">${parts.plane}</div></section>
      <section class="hhsa-readout-wrap"><h2>${c.readTitle}</h2><div id="hhsa-readout">${parts.readout}</div></section>
      <section class="hhsa-claims"><div><h2>${c.canTitle}</h2><ul>${c.can.map(item => `<li>${item}</li>`).join('')}</ul></div><div><h2>${c.cannotTitle}</h2><ul>${c.cannot.map(item => `<li>${item}</li>`).join('')}</ul></div></section>
      <section class="hhsa-reading"><h2>${c.readingTitle}</h2><ul><li><a href="#/post/hhsa-nonlinear-eeg">${c.readingPost}</a></li>${c.refs.map((ref, index) => `<li>${esc(ref)} <a href="${c.refLinks[index]}" target="_blank" rel="noopener noreferrer">${c.refLinks[index]}</a></li>`).join('')}</ul></section>
      <aside class="experiment-privacy"><strong>${lang === 'zh' ? '資料隱私' : 'Data privacy'}</strong><p>${c.privacy}</p></aside></div>`;
  }

  function cleanup() { if (teardown) teardown(); teardown = null; }

  function renderHhsaIntuition(container, lang = 'zh') {
    cleanup();
    const Hh = Core();
    let params = Hh.normalizeParams({});
    container.innerHTML = buildHhsaMarkup(lang, params);
    const c = copy[lang] || copy.zh; let frame = null;

    const paint = () => {
      frame = null;
      const parts = chartsMarkup(lang, Hh.analyze(params));
      const set = (id, html) => { const node = container.querySelector(id); if (node) node.innerHTML = html; };
      set('#hhsa-alerts', parts.alerts); set('#hhsa-time', parts.time); set('#hhsa-spectrum', parts.spectrum); set('#hhsa-plane', parts.plane); set('#hhsa-readout', parts.readout);
    };
    const schedule = () => { if (frame === null) frame = (typeof requestAnimationFrame === 'function' ? requestAnimationFrame : fn => setTimeout(fn, 16))(paint); };
    const syncControls = () => {
      for (const key of ['fc', 'fAM', 'depth', 'noise']) {
        const input = container.querySelector(`#hhsa-${key}`); const out = container.querySelector(`#hhsa-${key}-out`);
        if (input) input.value = params[key];
        if (out) out.textContent = `${params[key]}${key === 'depth' || key === 'noise' ? '' : ` ${c.hz}`}`;
      }
      const select = container.querySelector('#hhsa-T'); if (select) select.value = String(params.T);
    };
    const onInput = event => {
      const key = event.target && event.target.dataset && event.target.dataset.hhsa;
      if (!key) return;
      params = Hh.normalizeParams({ ...params, [key]: Number(event.target.value) });
      syncControls(); schedule();
    };
    const onClick = event => {
      const button = event.target.closest && event.target.closest('[data-hhsa-preset]');
      if (!button) return;
      params = Hh.normalizeParams({ ...Hh.DEFAULTS, ...(PRESETS[button.dataset.hhsaPreset] || {}) });
      syncControls(); schedule();
    };
    container.addEventListener('input', onInput); container.addEventListener('change', onInput); container.addEventListener('click', onClick);
    teardown = () => { container.removeEventListener('input', onInput); container.removeEventListener('change', onInput); container.removeEventListener('click', onClick); };
  }

  return { copy, PRESETS, chartsMarkup, buildHhsaMarkup, renderHhsaIntuition, cleanup };
});
