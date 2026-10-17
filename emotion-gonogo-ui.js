(function exposeEmotionGoNoGoUI(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EmotionGoNoGoUI = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createEmotionGoNoGoUIApi() {
  let timers = [];
  let teardown = null;

  const copy = {
    zh: {
      back: '← 返回互動實驗室', eyebrow: 'Emotion × inhibition · 02', title: '情緒會影響「忍住不按」嗎？',
      lead: '這個簡化版情緒 Go／No-Go 作業，把「看到就反應」和「看到也要忍住」放在同一個任務中。請先理解兩個相反規則，再預測自己的表現。',
      guideTitle: '實驗怎麼進行', guideLead: '每次只會在中央出現一張示意臉。GO 要立刻反應，NO-GO 則什麼都不要做。',
      guideSteps: [['1', '固定注視', '每次試次先看中央「＋」，臉孔出現前不要預先按鍵。'], ['2', '記住當前規則', '畫面會清楚標示哪種臉是 GO、哪種臉是 NO-GO；第二區塊會交換規則。'], ['3', '只對 GO 反應', '電腦按空白鍵；手機或平板點下方單一反應按鈕。'], ['4', '遇到 NO-GO 忍住', '不要按任何鍵，也不要點按鈕；等待下一個試次即可。']],
      mappingsTitle: '兩個規則區塊', mappingsLead: '同一種情緒在不同區塊會分別成為 GO 和 NO-GO，避免把情緒與動作固定綁在一起。',
      mappings: [['區塊 A', '快樂臉：GO（按）', '悲傷臉：NO-GO（不要按）'], ['區塊 B', '悲傷臉：GO（按）', '快樂臉：NO-GO（不要按）']],
      predict: '理解規則後，再做預測', question: '當哪一種臉孔是 NO-GO 時，你覺得自己比較容易忍不住按下去？',
      choices: [['sad', '悲傷臉：可能比較難抑制'], ['same', '快樂與悲傷臉可能差不多'], ['happy', '快樂臉：可能比較難抑制']],
      privacy: '所有反應只在你的瀏覽器中計算，不會上傳、儲存或加入研究資料庫。',
      caveat: '本作業使用自製示意臉，只用於說明實驗邏輯；不是標準化情緒辨識測驗，也不是心理或醫療評估。',
      start: '查看第一區塊規則', practice: '練習', formal: '正式測驗', progress: '進度',
      blockTitle: '先記住這個區塊的規則', blockLead: '每個區塊先做 6 次練習，再做 16 次正式測驗。GO 出現較多，讓「按下去」成為較常見反應。',
      go: 'GO｜按下反應鍵', nogo: 'NO-GO｜不要按', beginPractice: '開始這個區塊的練習',
      practiceDone: '練習完成', formalIntro: '接下來進入正式測驗。請兼顧速度與正確率，並繼續遵守目前規則。', formalStart: '開始正式測驗',
      reminder: (go, nogo) => `${go}：按／點；${nogo}：不要按。`, response: 'GO 臉孔出現時，立即反應',
      correct: '正確', commission: '這是 NO-GO，應該忍住不按', omission: '這是 GO，需要按下反應鍵',
      resultTitle: '你的這次結果', resultLead: '請比較情緒條件，而不是把單次分數當成固定能力。',
      happy: '快樂臉', sad: '悲傷臉', goRt: 'GO 中位反應時間', goAccuracy: 'GO 正確率', noGoAccuracy: 'NO-GO 抑制正確率',
      rtDiff: '悲傷 GO RT − 快樂 GO RT', inhibitionDiff: '悲傷 NO-GO 正確率 − 快樂 NO-GO 正確率',
      predictionLabels: { sad: '悲傷臉較難抑制', same: '兩者差不多', happy: '快樂臉較難抑制', unsure: '未選擇' },
      excluded: '排除的極端 GO RT', retry: '再做一次', limitsTitle: '如何解讀',
      limits: ['GO 反應時間描述執行速度；NO-GO 正確率描述是否成功抑制，兩者不能合併成單一能力分數。', '區塊順序、練習、疲勞與裝置延遲都會影響這次結果。', '短版示範的試次很少；情緒差異若未出現，不代表情緒對認知控制完全沒有影響。'],
      source: '閱讀情緒 Go／No-Go 的效度研究'
    },
    en: {
      back: '← Back to the interactive lab', eyebrow: 'Emotion × inhibition · 02', title: 'Does emotion change your ability to withhold a response?',
      lead: 'This simplified emotional Go/No-Go task combines rapid responding with response withholding. Learn the two reversed rules before predicting your performance.',
      guideTitle: 'How the experiment works', guideLead: 'One schematic face appears at the center. Respond to GO faces and do nothing for NO-GO faces.',
      guideSteps: [['1', 'Fixate', 'Watch the central “+” and do not respond before a face appears.'], ['2', 'Remember the rule', 'The current GO and NO-GO emotion will be shown clearly; the mapping reverses in the second block.'], ['3', 'Respond only to GO', 'Press Space on a computer or tap the single response button on a phone or tablet.'], ['4', 'Withhold for NO-GO', 'Do not press or tap anything; wait for the next trial.']],
      mappingsTitle: 'Two reversed rule blocks', mappingsLead: 'Each emotion serves as GO and NO-GO in different blocks so emotion is not permanently tied to one action.',
      mappings: [['Block A', 'Happy face: GO (respond)', 'Sad face: NO-GO (withhold)'], ['Block B', 'Sad face: GO (respond)', 'Happy face: NO-GO (withhold)']],
      predict: 'Predict after learning the rules', question: 'Which NO-GO face do you expect will be harder to resist responding to?',
      choices: [['sad', 'Sad face may be harder to inhibit'], ['same', 'Happy and sad may be similar'], ['happy', 'Happy face may be harder to inhibit']],
      privacy: 'All responses are calculated in this browser and are not uploaded, stored, or added to a research database.',
      caveat: 'The task uses original schematic faces to demonstrate experimental logic. It is not a standardized emotion-recognition, psychological, or medical assessment.',
      start: 'See the first block rule', practice: 'Practice', formal: 'Test', progress: 'Progress',
      blockTitle: 'Remember this block rule', blockLead: 'Each block begins with 6 practice trials followed by 16 test trials. GO appears more often, making responding the prepotent action.',
      go: 'GO | respond', nogo: 'NO-GO | withhold', beginPractice: 'Start this block practice',
      practiceDone: 'Practice complete', formalIntro: 'The test begins next. Balance speed and accuracy while keeping the current rule in mind.', formalStart: 'Start test block',
      reminder: (go, nogo) => `${go}: press/tap; ${nogo}: do not respond.`, response: 'Respond when a GO face appears',
      correct: 'Correct', commission: 'This was NO-GO: withhold the response', omission: 'This was GO: press the response key',
      resultTitle: 'Your result this time', resultLead: 'Compare emotion conditions rather than treating one brief score as a fixed ability.',
      happy: 'Happy face', sad: 'Sad face', goRt: 'Median GO RT', goAccuracy: 'GO accuracy', noGoAccuracy: 'NO-GO inhibition accuracy',
      rtDiff: 'Sad GO RT − happy GO RT', inhibitionDiff: 'Sad NO-GO accuracy − happy NO-GO accuracy',
      predictionLabels: { sad: 'Sad faces harder to inhibit', same: 'Both similar', happy: 'Happy faces harder to inhibit', unsure: 'No prediction selected' },
      excluded: 'Extreme GO RTs excluded', retry: 'Try again', limitsTitle: 'How to interpret this responsibly',
      limits: ['GO reaction time describes response execution; NO-GO accuracy describes successful withholding. They are not one interchangeable ability score.', 'Block order, practice, fatigue, and device latency can affect this session.', 'This short demonstration has few trials; no observed emotion difference does not prove emotion never affects cognitive control.'],
      source: 'Read a validation study of the emotional Go/No-Go task'
    }
  };

  function faceMarkup(emotion, label, decorative = false) {
    return `<span class="emotion-face emotion-face-${emotion}" ${decorative ? 'aria-hidden="true"' : `role="img" aria-label="${label}"`}><i></i><b></b><em></em></span>`;
  }

  function buildEmotionGoNoGoIntroMarkup(lang = 'zh') {
    const c = copy[lang] || copy.zh;
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="experiment-header"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.lead}</p></header>
      <section class="posner-guide" aria-labelledby="emotion-guide-title"><p class="section-kicker">01 · ${c.guideTitle}</p><h2 id="emotion-guide-title">${c.guideLead}</h2><ol>${c.guideSteps.map(step => `<li><span>${step[0]}</span><div><strong>${step[1]}</strong><p>${step[2]}</p></div></li>`).join('')}</ol></section>
      <section class="emotion-mappings" aria-labelledby="emotion-mappings-title"><p class="section-kicker">02 · ${c.mappingsTitle}</p><h2 id="emotion-mappings-title">${c.mappingsLead}</h2><div>${c.mappings.map((item, index) => `<article><span>0${index + 1}</span><h3>${item[0]}</h3><p><strong>${item[1]}</strong><br>${item[2]}</p></article>`).join('')}</div></section>
      <section class="experiment-prediction" aria-labelledby="emotion-prediction-title"><p class="section-kicker">03 · ${c.predict}</p><h2 id="emotion-prediction-title">${c.question}</h2><div class="prediction-options">${c.choices.map(choice => `<label><input type="radio" name="emotion-prediction" value="${choice[0]}"><span>${choice[1]}</span></label>`).join('')}</div></section>
      <aside class="experiment-privacy"><strong>${lang === 'zh' ? '資料隱私與範圍' : 'Privacy and scope'}</strong><p>${c.privacy}</p><p>${c.caveat}</p></aside>
      <button class="experiment-primary" type="button" data-emotion-start>${c.start}</button></div>`;
  }

  function buildEmotionGoNoGoTaskShellMarkup(lang = 'zh', options = {}) {
    const c = copy[lang] || copy.zh;
    const phase = options.phase || 'practice';
    const go = c[options.goEmotion || 'happy'];
    const nogo = c[options.noGoEmotion || 'sad'];
    return `<div class="page-shell experiment-page experiment-running"><a class="back-link" href="#/lab">${c.back}</a><header class="task-status"><div><p class="eyebrow">${phase === 'practice' ? c.practice : c.formal}</p><h1>${c.title}</h1></div><p><span>${c.progress}</span> <strong data-emotion-progress>0 / ${options.trialCount || 0}</strong></p></header><p class="task-fixation-reminder">${c.reminder(go, nogo)}</p><div class="emotion-stage" data-emotion-stage aria-live="polite"><span class="posner-fixation" aria-hidden="true">+</span></div><div class="emotion-response-controls" aria-label="${lang === 'zh' ? '單一反應鍵' : 'Single response key'}"><button type="button" data-emotion-response="Space" disabled>${c.response}</button></div><p class="task-hint">${lang === 'zh' ? '電腦：按空白鍵　手機／平板：點按鈕；' : 'Computer: Space · Phone/tablet: tap; '}${nogo}${lang === 'zh' ? '出現時不要按。' : ': do not respond.'}</p></div>`;
  }

  function clearTimers() {
    timers.forEach(timer => clearTimeout(timer));
    timers = [];
  }

  function later(callback, delay) {
    const timer = setTimeout(callback, delay);
    timers.push(timer);
  }

  function cleanup() {
    clearTimers();
    if (teardown) teardown();
    teardown = null;
  }

  function renderEmotionGoNoGo(container, lang = 'zh') {
    cleanup();
    const c = copy[lang] || copy.zh;
    container.innerHTML = buildEmotionGoNoGoIntroMarkup(lang);
    let prediction = 'unsure';
    let blocks = [];
    let blockIndex = 0;
    let phase = 'practice';
    let trials = [];
    let results = [];
    let index = 0;
    let activeTrial = null;
    let targetOnset = 0;

    function activeBlock() { return blocks[blockIndex]; }
    function setResponseDisabled(disabled) {
      container.querySelectorAll('[data-emotion-response]').forEach(button => { button.disabled = disabled; });
    }
    function formatRt(value) { return value === null ? '—' : `${Math.round(value)} ms`; }
    function formatAccuracy(value) { return value === null ? '—' : `${Math.round(value * 100)}%`; }

    function finishTrial(responded) {
      if (!activeTrial) return;
      clearTimers();
      const rt = responded ? Math.round(performance.now() - targetOnset) : null;
      const correct = activeTrial.action === 'go' ? responded : !responded;
      const result = { ...activeTrial, responded, correct, rt };
      if (phase === 'formal') results.push(result);
      activeTrial = null;
      setResponseDisabled(true);
      const stage = container.querySelector('[data-emotion-stage]');
      if (phase === 'practice' && stage) {
        const feedback = correct ? c.correct : result.action === 'nogo' ? c.commission : c.omission;
        stage.innerHTML = `<p class="trial-feedback ${correct ? 'is-correct' : 'is-incorrect'}">${feedback}</p>`;
      }
      later(nextTrial, phase === 'practice' ? 550 : 260);
    }

    function showFace(trial) {
      const stage = container.querySelector('[data-emotion-stage]');
      if (!stage) return;
      stage.innerHTML = faceMarkup(trial.emotion, c[trial.emotion]);
      activeTrial = trial;
      targetOnset = performance.now();
      setResponseDisabled(false);
      later(() => finishTrial(false), 900);
    }

    function presentTrial(trial) {
      const stage = container.querySelector('[data-emotion-stage]');
      if (!stage) return;
      stage.innerHTML = '<span class="posner-fixation" aria-hidden="true">+</span>';
      later(() => showFace(trial), 500 + Math.round(Math.random() * 250));
    }

    function showBlockIntro() {
      const block = activeBlock();
      const go = c[block.goEmotion];
      const nogo = c[block.noGoEmotion];
      container.innerHTML = `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><section class="experiment-transition emotion-block-intro"><p class="eyebrow">Block ${blockIndex + 1} / 2</p><h1>${c.blockTitle}</h1><p>${c.blockLead}</p><div class="emotion-rule-pair"><article>${faceMarkup(block.goEmotion, go)}<strong>${go}</strong><span>${c.go}</span></article><article>${faceMarkup(block.noGoEmotion, nogo)}<strong>${nogo}</strong><span>${c.nogo}</span></article></div><button class="experiment-primary" type="button" data-emotion-block-start>${c.beginPractice}</button></section></div>`;
    }

    function showFormalTransition() {
      container.innerHTML = `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><section class="experiment-transition"><p class="eyebrow">${c.practiceDone}</p><h1>${c.title}</h1><p>${c.formalIntro}</p><button class="experiment-primary" type="button" data-emotion-formal>${c.formalStart}</button></section></div>`;
    }

    function showResults() {
      const summary = window.EmotionGoNoGoTask.summarizeEmotionGoNoGoTrials(results);
      const rows = ['happy', 'sad'].map(emotion => `<tr><th scope="row">${c[emotion]}</th><td>${formatRt(summary.emotions[emotion].goMedianRt)}</td><td>${formatAccuracy(summary.emotions[emotion].goAccuracy)}</td><td>${formatAccuracy(summary.emotions[emotion].noGoAccuracy)}</td></tr>`).join('');
      container.innerHTML = `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="result-header"><p class="eyebrow">Result</p><h1>${c.resultTitle}</h1><p>${c.resultLead}</p></header><section class="emotion-result-differences"><div><span>${c.rtDiff}</span><strong>${formatRt(summary.goRtDifference)}</strong></div><div><span>${c.inhibitionDiff}</span><strong>${formatAccuracy(summary.noGoAccuracyDifference)}</strong></div></section><div class="result-table-wrap"><table><thead><tr><th>${lang === 'zh' ? '情緒' : 'Emotion'}</th><th>${c.goRt}</th><th>${c.goAccuracy}</th><th>${c.noGoAccuracy}</th></tr></thead><tbody>${rows}</tbody></table></div><dl class="result-notes"><div><dt>${lang === 'zh' ? '你的預測' : 'Your prediction'}</dt><dd>${c.predictionLabels[prediction]}</dd></div><div><dt>${c.excluded}</dt><dd>${summary.excludedRtCount}</dd></div></dl><section class="result-limits"><h2>${c.limitsTitle}</h2><ul>${c.limits.map(item => `<li>${item}</li>`).join('')}</ul><a href="https://pubmed.ncbi.nlm.nih.gov/17207962/" target="_blank" rel="noopener noreferrer">${c.source} ↗</a></section><button class="experiment-primary" type="button" data-emotion-retry>${c.retry}</button></div>`;
    }

    function nextTrial() {
      if (index >= trials.length) {
        if (phase === 'practice') showFormalTransition();
        else if (blockIndex < blocks.length - 1) { blockIndex += 1; showBlockIntro(); }
        else showResults();
        return;
      }
      const progress = container.querySelector('[data-emotion-progress]');
      if (progress) progress.textContent = `${index + 1} / ${trials.length}`;
      presentTrial(trials[index++]);
    }

    function start(nextPhase) {
      phase = nextPhase;
      index = 0;
      trials = window.EmotionGoNoGoTask.createEmotionGoNoGoTrials(
        activeBlock(),
        nextPhase === 'practice' ? { go: 4, nogo: 2 } : { go: 12, nogo: 4 }
      );
      container.innerHTML = buildEmotionGoNoGoTaskShellMarkup(lang, {
        phase,
        trialCount: trials.length,
        goEmotion: activeBlock().goEmotion,
        noGoEmotion: activeBlock().noGoEmotion
      });
      later(nextTrial, 650);
    }

    function onClick(event) {
      if (event.target.closest('[data-emotion-start]')) {
        prediction = container.querySelector('input[name="emotion-prediction"]:checked')?.value || 'unsure';
        blocks = window.EmotionGoNoGoTask.createEmotionBlocks();
        blockIndex = 0;
        results = [];
        showBlockIntro();
        return;
      }
      if (event.target.closest('[data-emotion-block-start]')) start('practice');
      if (event.target.closest('[data-emotion-formal]')) start('formal');
      if (event.target.closest('[data-emotion-retry]')) renderEmotionGoNoGo(container, lang);
      if (event.target.closest('[data-emotion-response]')) finishTrial(true);
    }

    function onKeydown(event) {
      if ((event.code === 'Space' || event.key === ' ' || event.key === 'Spacebar') && activeTrial) {
        event.preventDefault();
        finishTrial(true);
      }
    }

    container.addEventListener('click', onClick);
    window.addEventListener('keydown', onKeydown);
    teardown = () => {
      container.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKeydown);
      activeTrial = null;
    };
  }

  return { buildEmotionGoNoGoIntroMarkup, buildEmotionGoNoGoTaskShellMarkup, renderEmotionGoNoGo, cleanup };
});
