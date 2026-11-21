(function exposeEmotionFlankerUI(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EmotionFlankerUI = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createEmotionFlankerUIApi() {
  let timers = [];
  let teardown = null;

  const copy = {
    zh: {
      back: '← 返回互動實驗室', eyebrow: 'Attention control · 06', title: '旁邊的臉，會干擾你判斷中間的臉嗎？',
      lead: '「側翼作業」（flanker task）是研究注意力與衝突處理的經典作業：你只要判斷中間的目標，旁邊的刺激要忽略，但它們常常忽略不掉。這裡改用 AI 生成的臉孔，看旁邊相同或相反的表情，會不會影響你判斷中間那張臉。',
      guideTitle: '作業怎麼進行', guideLead: '每次畫面中有五張臉，你只判斷「正中間」那一張。',
      guideSteps: [['1', '看中央十字', '每次先看「＋」，五張臉出現後立刻判斷。'], ['2', '只看中間那張', '正中間那張臉下方有一個小三角「▲」；左右各兩張是干擾，要忽略。'], ['3', '判斷表情', '中間是憤怒還是開心？電腦用 ← →，手機或平板點下方按鈕；實際的左右對應會在開始前告訴你。'], ['4', '又快又準', '請盡量快，但不要亂按；太慢（超過 1.5 秒）會被記為超時。']],
      conditionsTitle: '旁邊的臉有三種', conditionsLead: '關鍵比較是：旁邊的臉與中間的臉表情「一樣」「相反」或「中性」。',
      conditions: [['一致', '旁邊與中間表情相同', 'angry', 'angry'], ['不一致', '旁邊與中間表情相反', 'angry', 'happy'], ['中性', '旁邊是中性臉', 'angry', 'neutral']],
      predict: '先預測', question: '中間是「憤怒臉」時，旁邊開心臉造成的干擾，和中間是「開心臉」時、旁邊憤怒臉造成的干擾相比，你覺得會…',
      choices: [['angry-smaller', '憤怒臉當目標時，干擾比較小'], ['angry-larger', '憤怒臉當目標時，干擾比較大'], ['same', '兩者差不多']],
      evidenceLabel: '研究依據', evidence: 'Eriksen 與 Eriksen（1974）提出側翼作業；Fenske 與 Eastwood（2003）把它用在表情臉孔上。這個網站版只保留作業邏輯：練習 12 次、正式 48 次。',
      privacy: '所有反應只在你的瀏覽器中計算，不會上傳、儲存或加入研究資料庫。這是科普示範，不是研究作業，也不是心理或醫療評估。',
      caveat: '臉孔是 AI 生成的虛構人物，未經情緒辨識率、效價或喚醒度的正式驗證，只供科普互動。每一試次的五張臉是同一位虛構人物。',
      start: '開始', practice: '練習', formal: '正式測驗', progress: '進度',
      keysTitle: '先記住按鍵', keysLead: '這次的對應如下（每個人的左右對應可能不同，以免固定在某一側）。', keyLeft: '按 ←', keyRight: '按 →',
      angry: '憤怒', happy: '開心', neutral: '中性', face: 'AI 合成臉孔', beginPractice: '開始練習（12 次）',
      reminder: '只判斷正中間（▲）那張臉的表情，旁邊的臉要忽略。', hint: '電腦：← → 鍵　手機／平板：點下方按鈕',
      practiceDone: '練習完成', formalIntro: '接下來是 48 次正式測驗，約 2 分鐘。請又快又準地判斷正中間那張臉，忽略旁邊的臉。', formalStart: '開始正式測驗',
      correct: '正確', incorrect: '不對：再看一次中間那張臉', timeout: '太慢了，請在五張臉出現後立刻判斷',
      resultTitle: '你的側翼效應', resultLead: '比較旁邊的臉「一致、相反、中性」時你的反應時間與正確率。單次短版結果不是固定能力，也不能視為原研究的重現。',
      condition: '旁邊的臉', rt: '中位反應時間', acc: '正確率', trials: '試次',
      conditionNames: { congruent: '一致（相同表情）', incongruent: '不一致（相反表情）', neutral: '中性' },
      interference: '干擾效應：不一致 − 一致', facilitation: '促進：中性 − 一致', conflictCost: '衝突代價：不一致 − 中性',
      targetTitle: '依中間的臉分開看', targetLead: '干擾效應（不一致 − 一致）在中間是憤怒臉與開心臉時是否不同？',
      angryTarget: '中間是憤怒臉', happyTarget: '中間是開心臉', targetDiff: '差值：憤怒目標 − 開心目標',
      predictionLabels: { 'angry-smaller': '憤怒臉當目標時干擾較小', 'angry-larger': '憤怒臉當目標時干擾較大', same: '兩者差不多', unsure: '未選擇' },
      yourPrediction: '你的預測', excluded: '排除的極端 RT（<150 或 >1500 ms 的正確試次）', timeouts: '超時題數',
      retry: '再做一次', limitsTitle: '如何解讀你的結果',
      limits: [
        '干擾效應為正，表示旁邊相反表情的臉讓你變慢，是側翼作業常見的方向；為負或接近 0 也可能出現，在這麼少的試次下不必過度解讀。',
        '正式測驗中，每個「中間 × 旁邊」組合只有 8 次試次，中位數與差值都很不穩定；單次結果不是固定能力。',
        '每一試次的五張臉是同一位虛構人物，因此「一致」試次的旁邊臉與中間臉是同一張圖。一致與不一致的差異，可能有一部分來自「長得一模一樣」而非情緒本身。原研究另有改變表情、保留臉部特徵差異的控制條件，本示範沒有。',
        'AI 合成臉孔未經正式驗證，本站只用憤怒與開心兩種表情，與原研究的刺激不同。'
      ],
      paperTitle: '原研究發現了什麼？', paperKicker: 'Fenske & Eastwood · Emotion · 2003',
      paperLead: '三個實驗檢驗表情臉孔是否會調節專注的範圍。以下是摘要層級的整理，本頁沒有重現這些結果：',
      paperPoints: ['辨識表情臉孔時，被「相同（相容）」臉孔包圍，通常比被「不同（不相容）」臉孔包圍更快。', '這個相容效應在目標是負向表情時，比目標是正向表情時小；負向目標也比中性目標小，負向與中性目標都比正向目標小。', '把臉孔改成破壞表情、但保留特徵差異後（實驗 1B），觀察到相等的相容效應。'],
      paperConclusion: '作者認為，這些結果顯示注意力的收縮會受表情影響。',
      source: 'Fenske 與 Eastwood（2003）', origin: 'Eriksen 與 Eriksen（1974）提出原始側翼作業'
    },
    en: {
      back: '← Back to the interactive lab', eyebrow: 'Attention control · 06', title: 'Do the faces beside a face disturb your judgment of the middle one?',
      lead: 'The flanker task is a classic way to study attention and conflict: you judge only the central target and ignore the items beside it, but they are often hard to ignore. Here AI-generated faces are used to see whether neighbors with the same or the opposite expression affect your judgment of the central face.',
      guideTitle: 'How the task works', guideLead: 'Five faces appear each time, and you judge only the one in the middle.',
      guideSteps: [['1', 'Fixate', 'Look at the central “+”, then judge as soon as the five faces appear.'], ['2', 'Judge the middle one', 'A small triangle “▲” sits under the middle face; the two faces on each side are distractors to ignore.'], ['3', 'Judge the expression', 'Is the middle face angry or happy? Use ← → on a computer or tap the buttons on a phone or tablet; the exact mapping is shown before you start.'], ['4', 'Fast and accurate', 'Respond quickly without guessing; slower than 1.5 seconds counts as a timeout.']],
      conditionsTitle: 'Three kinds of neighbors', conditionsLead: 'The key comparison: neighbors with the same, the opposite, or a neutral expression compared with the middle face.',
      conditions: [['Congruent', 'Neighbors match the middle face', 'angry', 'angry'], ['Incongruent', 'Neighbors show the opposite expression', 'angry', 'happy'], ['Neutral', 'Neighbors are neutral', 'angry', 'neutral']],
      predict: 'Predict first', question: 'When the middle face is angry, will the interference from happy neighbors be smaller or larger than the interference from angry neighbors when the middle face is happy?',
      choices: [['angry-smaller', 'Smaller when the target is angry'], ['angry-larger', 'Larger when the target is angry'], ['same', 'About the same']],
      evidenceLabel: 'Evidence base', evidence: 'Eriksen and Eriksen (1974) introduced the flanker task; Fenske and Eastwood (2003) applied it to emotional faces. This browser version keeps only the task logic: 12 practice and 48 test trials.',
      privacy: 'All responses are calculated in this browser and are not uploaded, stored, or added to a research database. This is a science-communication demonstration, not a research task or a psychological or medical assessment.',
      caveat: 'The faces are AI-generated fictional people and have not been validated for recognition rate, valence, or arousal; they are for educational interaction only. The five faces on each trial belong to the same fictional person.',
      start: 'Start', practice: 'Practice', formal: 'Test', progress: 'Progress',
      keysTitle: 'Remember the keys', keysLead: 'This is your mapping (the left/right assignment differs between people so it is not fixed to one side).', keyLeft: 'Press ←', keyRight: 'Press →',
      angry: 'Angry', happy: 'Happy', neutral: 'Neutral', face: 'AI-generated face', beginPractice: 'Start practice (12 trials)',
      reminder: 'Judge only the expression of the middle face (▲) and ignore the faces beside it.', hint: 'Computer: ← → keys · Phone/tablet: tap the buttons below',
      practiceDone: 'Practice complete', formalIntro: 'The 48-trial test comes next and takes about 2 minutes. Judge the middle face quickly and accurately, and ignore the faces beside it.', formalStart: 'Start test',
      correct: 'Correct', incorrect: 'Not quite: look at the middle face again', timeout: 'Too slow: respond as soon as the five faces appear',
      resultTitle: 'Your flanker effect', resultLead: 'Compare your reaction time and accuracy when the neighbors are congruent, incongruent, or neutral. One short session is not a fixed ability and is not a replication of the original study.',
      condition: 'Neighbors', rt: 'Median RT', acc: 'Accuracy', trials: 'Trials',
      conditionNames: { congruent: 'Congruent (same expression)', incongruent: 'Incongruent (opposite expression)', neutral: 'Neutral' },
      interference: 'Interference: incongruent − congruent', facilitation: 'Facilitation: neutral − congruent', conflictCost: 'Conflict cost: incongruent − neutral',
      targetTitle: 'Split by the middle face', targetLead: 'Does the interference effect (incongruent − congruent) differ when the middle face is angry versus happy?',
      angryTarget: 'Middle face angry', happyTarget: 'Middle face happy', targetDiff: 'Difference: angry target − happy target',
      predictionLabels: { 'angry-smaller': 'Smaller when the target is angry', 'angry-larger': 'Larger when the target is angry', same: 'About the same', unsure: 'No prediction selected' },
      yourPrediction: 'Your prediction', excluded: 'Extreme RTs excluded (correct trials <150 or >1500 ms)', timeouts: 'Timeouts',
      retry: 'Try again', limitsTitle: 'How to interpret your result',
      limits: [
        'A positive interference effect means opposite-expression neighbors slowed you down, the usual direction in flanker tasks. A negative or near-zero value can also occur and should not be over-read with so few trials.',
        'Each middle × neighbor combination has only 8 trials in the test, so medians and differences are very unstable; one session is not a fixed ability.',
        'The five faces on a trial are the same fictional person, so on congruent trials the neighbors are the same image as the middle face. Part of the congruent–incongruent difference may therefore come from looking identical rather than from emotion. The original study included a control condition that altered faces to disrupt expression while keeping feature differences; this demonstration does not.',
        'The AI-generated faces have not been formally validated, and this site uses only angry and happy expressions, which differ from the original stimuli.'
      ],
      paperTitle: 'What did the original study find?', paperKicker: 'Fenske & Eastwood · Emotion · 2003',
      paperLead: 'Three experiments tested whether facial expressions modulate the allocation of focused attention. The summary below is at abstract level, and this page does not reproduce these results:',
      paperPoints: ['Identifying emotionally expressive target faces was typically faster when they were flanked by identical (compatible) faces than by different (incompatible) faces.', 'This compatibility effect was smaller when the target expressed negative rather than positive emotion; it was also smaller for negative than for neutral targets, and for both negative and neutral targets than for positive targets.', 'When faces were altered to disrupt emotional expression but keep feature differences (Experiment 1B), equal compatibility effects were observed.'],
      paperConclusion: 'The authors conclude that the constriction of attention is influenced by facial expressions of emotion.',
      source: 'Fenske and Eastwood (2003)', origin: 'Eriksen and Eriksen (1974) introduced the original flanker task'
    }
  };

  const FACE = (identity, emotion) => `assets/emotion-faces/identity-${identity}-${emotion}.webp`;

  function faceMarkup(emotion, identity, label = '', extraClass = '') {
    return `<span class="emotion-face emotion-face-${emotion}${extraClass ? ' ' + extraClass : ''}" aria-hidden="true"><img src="${FACE(identity, emotion)}" alt="${label}" width="512" height="512" decoding="async"></span>`;
  }

  function preloadFaces() {
    if (typeof Image === 'undefined') return;
    ['a', 'b', 'c', 'd'].forEach(identity => ['happy', 'angry', 'neutral'].forEach(emotion => { const img = new Image(); img.src = FACE(identity, emotion); }));
  }

  function arrayMarkup(trial) {
    const flank = trial.flankerExpression;
    const f = () => faceMarkup(flank, trial.identity, '', 'flanker-face');
    return `<div class="flanker-array" role="img" aria-label="AI-generated face array">${f()}${f()}<span class="flanker-target">${faceMarkup(trial.target, trial.identity, '', 'flanker-face is-target')}<i aria-hidden="true">▲</i></span>${f()}${f()}</div>`;
  }

  function sampleArray(target, flanker, identity = 'a') {
    const flank = flanker;
    const f = () => faceMarkup(flank, identity, '', 'flanker-face');
    return `<div class="flanker-array flanker-array-sample" aria-hidden="true">${f()}${f()}<span class="flanker-target">${faceMarkup(target, identity, '', 'flanker-face is-target')}<i aria-hidden="true">▲</i></span>${f()}${f()}</div>`;
  }

  function buildIntroMarkup(lang = 'zh') {
    const c = copy[lang] || copy.zh;
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="experiment-header"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.lead}</p></header>
      <section class="posner-guide" aria-labelledby="flanker-guide-title"><p class="section-kicker">01 · ${c.guideTitle}</p><h2 id="flanker-guide-title">${c.guideLead}</h2><ol>${c.guideSteps.map(step => `<li><span>${step[0]}</span><div><strong>${step[1]}</strong><p>${step[2]}</p></div></li>`).join('')}</ol></section>
      <section class="flanker-conditions" aria-labelledby="flanker-conditions-title"><p class="section-kicker">02 · ${c.conditionsTitle}</p><h2 id="flanker-conditions-title">${c.conditionsLead}</h2><div>${c.conditions.map((item, index) => `<article><span>0${index + 1}</span><h3>${item[0]}</h3>${sampleArray(item[2], item[3])}<p>${item[1]}</p></article>`).join('')}</div></section>
      <section class="experiment-prediction" aria-labelledby="flanker-prediction-title"><p class="section-kicker">03 · ${c.predict}</p><h2 id="flanker-prediction-title">${c.question}</h2><div class="prediction-options">${c.choices.map(choice => `<label><input type="radio" name="flanker-prediction" value="${choice[0]}"><span>${choice[1]}</span></label>`).join('')}</div></section>
      <aside class="experiment-evidence"><strong>${c.evidenceLabel}</strong><p>${c.evidence}</p></aside>
      <aside class="experiment-privacy"><strong>${lang === 'zh' ? '資料隱私與範圍' : 'Privacy and scope'}</strong><p>${c.privacy}</p><p>${c.caveat}</p></aside>
      <button class="experiment-primary" type="button" data-flanker-start>${c.start}</button></div>`;
  }

  function controlsMarkup(c, mapping) {
    const left = mapping === 'B' ? 'happy' : 'angry';
    const right = mapping === 'B' ? 'angry' : 'happy';
    return `<button type="button" data-flanker-response="left" disabled>← ${c[left]}</button><button type="button" data-flanker-response="right" disabled>${c[right]} →</button>`;
  }

  function buildTaskShellMarkup(lang = 'zh', options = {}) {
    const c = copy[lang] || copy.zh;
    const phase = options.phase || 'practice';
    return `<div class="page-shell experiment-page experiment-running"><a class="back-link" href="#/lab">${c.back}</a><header class="task-status"><div><p class="eyebrow">${phase === 'practice' ? c.practice : c.formal}</p><h1>${c.title}</h1></div><p><span>${c.progress}</span> <strong data-flanker-progress>0 / ${options.trialCount || 0}</strong></p></header><p class="task-fixation-reminder">${c.reminder}</p><div class="flanker-stage" data-flanker-stage aria-live="polite"><span class="posner-fixation" aria-hidden="true">+</span></div><div class="flanker-controls" aria-label="${lang === 'zh' ? '反應按鈕' : 'Response buttons'}">${controlsMarkup(c, options.mapping)}</div><p class="task-hint">${c.hint}</p></div>`;
  }

  const fmtRt = v => (v === null || v === undefined ? '—' : `${Math.round(v)} ms`);
  const fmtSigned = v => (v === null || v === undefined ? '—' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(Math.round(v))} ms`);
  const fmtAcc = v => (v === null || v === undefined ? '—' : `${Math.round(v * 100)}%`);

  function buildResultsMarkup(lang = 'zh', summary, prediction = 'unsure') {
    const c = copy[lang] || copy.zh;
    const rows = ['congruent', 'incongruent', 'neutral'].map(key => {
      const cell = summary.byFlanker[key];
      return `<tr><th scope="row">${c.conditionNames[key]}</th><td>${fmtRt(cell.medianRt)}</td><td>${fmtAcc(cell.accuracy)}</td><td>${cell.count}</td></tr>`;
    }).join('');
    const doi1 = 'https://doi.org/10.1037/1528-3542.3.4.327';
    const doi2 = 'https://doi.org/10.3758/BF03203267';
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="result-header"><p class="eyebrow">Result</p><h1>${c.resultTitle}</h1><p>${c.resultLead}</p></header>
      <section class="emotion-result-differences"><div><span>${c.interference}</span><strong>${fmtSigned(summary.interference)}</strong></div><div><span>${c.facilitation}</span><strong>${fmtSigned(summary.facilitation)}</strong></div><div><span>${c.conflictCost}</span><strong>${fmtSigned(summary.conflictCost)}</strong></div></section>
      <div class="result-table-wrap"><table><thead><tr><th>${c.condition}</th><th>${c.rt}</th><th>${c.acc}</th><th>${c.trials}</th></tr></thead><tbody>${rows}</tbody></table></div>
      <section class="flanker-target-split" aria-labelledby="flanker-target-title"><h2 id="flanker-target-title">${c.targetTitle}</h2><p>${c.targetLead}</p><div class="emotion-result-differences"><div><span>${c.angryTarget}</span><strong>${fmtSigned(summary.interferenceAngry)}</strong></div><div><span>${c.happyTarget}</span><strong>${fmtSigned(summary.interferenceHappy)}</strong></div><div><span>${c.targetDiff}</span><strong>${fmtSigned(summary.targetDifference)}</strong></div></div></section>
      <dl class="result-notes"><div><dt>${c.yourPrediction}</dt><dd>${c.predictionLabels[prediction] || c.predictionLabels.unsure}</dd></div><div><dt>${c.excluded}</dt><dd>${summary.excludedRtCount}</dd></div><div><dt>${c.timeouts}</dt><dd>${summary.timeouts}</dd></div></dl>
      <section class="result-limits"><h2>${c.limitsTitle}</h2><ul>${c.limits.map(item => `<li>${item}</li>`).join('')}</ul></section>
      <section class="result-science" aria-labelledby="flanker-paper-title"><p class="section-kicker">${c.paperKicker}</p><h2 id="flanker-paper-title">${c.paperTitle}</h2><p>${c.paperLead}</p><ul>${c.paperPoints.map(item => `<li>${item}</li>`).join('')}</ul><p>${c.paperConclusion}</p><div class="result-sources"><a href="https://pubmed.ncbi.nlm.nih.gov/14674827/" target="_blank" rel="noopener noreferrer">${c.source} ↗</a><a href="${doi1}" target="_blank" rel="noopener noreferrer">DOI ↗</a><a href="${doi2}" target="_blank" rel="noopener noreferrer">${c.origin} ↗</a></div></section>
      <button class="experiment-primary" type="button" data-flanker-retry>${c.retry}</button></div>`;
  }

  function clearTimers() { timers.forEach(timer => clearTimeout(timer)); timers = []; }
  function later(callback, delay) { timers.push(setTimeout(callback, delay)); }
  function cleanup() { clearTimers(); if (teardown) teardown(); teardown = null; }

  function render(container, lang = 'zh') {
    cleanup();
    preloadFaces();
    const c = copy[lang] || copy.zh;
    const Core = () => (typeof window !== 'undefined' && window.EmotionFlankerTask) || (typeof require === 'function' ? require('./emotion-flanker-task.js') : null);
    container.innerHTML = buildIntroMarkup(lang);
    let prediction = 'unsure';
    let mapping = 'A';
    let phase = 'practice';
    let trials = [];
    let results = [];
    let index = 0;
    let active = null;
    let onset = 0;

    function setDisabled(disabled) { container.querySelectorAll('[data-flanker-response]').forEach(button => { button.disabled = disabled; }); }

    function finishTrial(key) {
      if (!active) return;
      clearTimers();
      const trial = active;
      active = null;
      setDisabled(true);
      const timedOut = key === null;
      const rt = timedOut ? null : Math.round(performance.now() - onset);
      const correct = !timedOut && key === trial.correctKey;
      const done = { ...trial, response: key, rt, correct, timedOut };
      if (phase === 'formal') results.push(done);
      const stage = container.querySelector('[data-flanker-stage]');
      if (phase === 'practice' && stage) {
        stage.innerHTML = `<p class="trial-feedback ${correct ? 'is-correct' : 'is-incorrect'}">${timedOut ? c.timeout : correct ? c.correct : c.incorrect}</p>`;
      } else if (stage) {
        stage.innerHTML = '<span class="posner-fixation" aria-hidden="true">+</span>';
      }
      later(nextTrial, phase === 'practice' ? 650 : 280);
    }

    function showArray(trial) {
      const stage = container.querySelector('[data-flanker-stage]');
      if (!stage) return;
      stage.innerHTML = arrayMarkup(trial);
      active = trial;
      onset = performance.now();
      setDisabled(false);
      later(() => finishTrial(null), 1500);
    }

    function presentTrial(trial) {
      const stage = container.querySelector('[data-flanker-stage]');
      if (!stage) return;
      stage.innerHTML = '<span class="posner-fixation" aria-hidden="true">+</span>';
      later(() => showArray(trial), 500 + Math.round(Math.random() * 250));
    }

    function showKeyIntro() {
      const left = mapping === 'B' ? 'happy' : 'angry';
      const right = mapping === 'B' ? 'angry' : 'happy';
      container.innerHTML = `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><section class="experiment-transition flanker-key-intro"><p class="eyebrow">${c.practice}</p><h1>${c.keysTitle}</h1><p>${c.keysLead}</p><div class="flanker-key-pair"><article>${faceMarkup(left, left === 'angry' ? 'a' : 'b', c.face)}<strong>${c[left]}</strong><span>${c.keyLeft}</span></article><article>${faceMarkup(right, right === 'angry' ? 'a' : 'b', c.face)}<strong>${c[right]}</strong><span>${c.keyRight}</span></article></div><button class="experiment-primary" type="button" data-flanker-begin>${c.beginPractice}</button></section></div>`;
    }

    function showFormalTransition() {
      container.innerHTML = `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><section class="experiment-transition"><p class="eyebrow">${c.practiceDone}</p><h1>${c.title}</h1><p>${c.formalIntro}</p><button class="experiment-primary" type="button" data-flanker-formal>${c.formalStart}</button></section></div>`;
    }

    function showResults() {
      container.innerHTML = buildResultsMarkup(lang, Core().summarizeTrials(results), prediction);
    }

    function nextTrial() {
      if (index >= trials.length) {
        if (phase === 'practice') showFormalTransition(); else showResults();
        return;
      }
      const progress = container.querySelector('[data-flanker-progress]');
      if (progress) progress.textContent = `${index + 1} / ${trials.length}`;
      presentTrial(trials[index++]);
    }

    function start(nextPhase) {
      phase = nextPhase;
      index = 0;
      trials = Core().createTrials(nextPhase === 'practice' ? 2 : 8, mapping);
      container.innerHTML = buildTaskShellMarkup(lang, { phase, trialCount: trials.length, mapping });
      later(nextTrial, 650);
    }

    function onClick(event) {
      if (event.target.closest('[data-flanker-start]')) {
        prediction = container.querySelector('input[name="flanker-prediction"]:checked')?.value || 'unsure';
        mapping = Math.random() < 0.5 ? 'A' : 'B';
        results = [];
        showKeyIntro();
        return;
      }
      if (event.target.closest('[data-flanker-begin]')) { start('practice'); return; }
      if (event.target.closest('[data-flanker-formal]')) { start('formal'); return; }
      if (event.target.closest('[data-flanker-retry]')) { render(container, lang); return; }
      const response = event.target.closest('[data-flanker-response]');
      if (response && !response.disabled) finishTrial(response.dataset.flankerResponse);
    }

    function onKeydown(event) {
      if (!active) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); finishTrial('left'); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); finishTrial('right'); }
    }

    container.addEventListener('click', onClick);
    window.addEventListener('keydown', onKeydown);
    teardown = () => {
      container.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKeydown);
      active = null;
    };
  }

  return { copy, buildIntroMarkup, buildTaskShellMarkup, buildResultsMarkup, arrayMarkup, renderEmotionFlanker: render, cleanup };
});
