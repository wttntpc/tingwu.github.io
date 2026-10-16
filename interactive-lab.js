(function exposeInteractiveLab(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.InteractiveLab = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createInteractiveLabApi() {
  let timers = [];
  let teardown = null;

  const content = {
    zh: {
      eyebrow: 'Interactive experiments',
      title: '腦與身體互動實驗室',
      lead: '先預測、親自作答、查看自己的結果，再理解注意力、情緒與身體活動如何影響行為表現。這裡不是智力或醫療診斷，而是一個把研究方法變得可操作的學習空間。',
      steps: [['01', '先預測', '在看答案前，先寫下你認為會發生什麼。'], ['02', '親自測量', '用簡化但有研究邏輯的作業記錄反應時間與正確率。'], ['03', '理解結果', '分辨觀察結果、合理推論，以及一次測驗無法回答的問題。']],
      taskLabel: '第一個互動實驗',
      taskTitle: '箭頭會把注意力帶走嗎？',
      taskName: 'Posner 空間提示作業',
      taskDesc: '比較有效、無效與中性提示下的反應時間，親手觀察注意力重新定向的成本。約需 2–3 分鐘，建議使用實體鍵盤。',
      open: '開始實驗 →',
      coming: '接下來',
      future: ['情緒臉孔 Go／No-Go：情緒與抑制控制', '三分鐘活動挑戰：運動前後的反應時間與心情']
    },
    en: {
      eyebrow: 'Interactive experiments',
      title: 'Brain × Body Interactive Lab',
      lead: 'Predict first, perform a short task, inspect your own result, and then learn how attention, emotion, and physical activity shape behavior. These demonstrations are for learning, not intelligence testing or medical diagnosis.',
      steps: [['01', 'Predict', 'Commit to an expectation before seeing the result.'], ['02', 'Measure', 'Use a simplified research task to record response time and accuracy.'], ['03', 'Interpret', 'Separate observation, plausible inference, and questions one session cannot answer.']],
      taskLabel: 'First interactive experiment',
      taskTitle: 'Can an arrow pull your attention?',
      taskName: 'Posner spatial cueing task',
      taskDesc: 'Compare response times after valid, invalid, and neutral cues to experience the cost of reorienting attention. Allow 2–3 minutes and use a physical keyboard if possible.',
      open: 'Start experiment →',
      coming: 'Coming next',
      future: ['Emotional face Go/No-Go: emotion and inhibitory control', 'Three-minute movement challenge: response time and mood before and after activity']
    }
  };

  const posnerCopy = {
    zh: {
      back: '← 返回互動實驗室', eyebrow: 'Attention experiment · 01', title: '箭頭會把注意力帶走嗎？',
      lead: '中央箭頭通常會提示目標可能出現的位置。請保持注視中央，看到左右任一側出現圓點後，盡快按下相同方向的方向鍵。',
      predict: '開始前，先做一個預測', question: '哪一種提示下，你認為自己的反應會最快？',
      choices: [['valid', '有效提示：箭頭與目標同方向'], ['same', '三種情況差不多'], ['invalid', '無效提示：箭頭與目標反方向']],
      valid: '有效提示', invalid: '無效提示', neutral: '中性提示',
      definitions: [['有效提示', '箭頭與圓點出現在同一側。'], ['無效提示', '箭頭先把注意力帶到另一側。'], ['中性提示', '雙向箭頭不提供位置資訊。']],
      privacy: '本實驗只在你的瀏覽器中計算；反應資料不會上傳、儲存或加入研究資料庫。',
      start: '開始 6 次練習', practice: '練習', formal: '正式測驗', ready: '準備好進入正式測驗',
      formalIntro: '接下來共 32 次。請保持看著中央十字，並兼顧速度與正確率。', formalStart: '開始正式測驗',
      progress: '進度', left: '← 左', right: '右 →', correct: '正確', incorrect: '方向不符', timeout: '這次沒有收到反應',
      resultTitle: '你的這次結果', resultLead: '以下只描述這一次、這台裝置上的表現，不代表固定能力。',
      median: '正確反應時間中位數', accuracy: '正確率', cueCost: '注意力重新定向成本',
      cueFormula: '無效提示 RT − 有效提示 RT', excluded: '未納入 RT 比較的試次', retry: '再做一次',
      interpretationPositive: '這次無效提示較慢，符合注意力先被帶往錯誤位置、之後需要重新定向的典型模式。',
      interpretationOther: '這次沒有出現典型的正向差值。試次數、裝置延遲、疲勞與自然波動都可能影響個人結果。',
      predictionLabels: { valid: '有效提示最快', same: '三種差不多', invalid: '無效提示最快', unsure: '未選擇' },
      limitsTitle: '如何正確解讀', limits: ['比較條件差異，比單看左邊或右邊的 RT 更有意義。', '錯誤反應及過快／過慢反應不納入 RT 中位數，但仍會反映在正確率。', '手機、鍵盤、瀏覽器與螢幕更新率會造成延遲，因此不宜跨裝置比較。'],
      source: '閱讀經典研究：Posner、Snyder 與 Davidson（1980）'
    },
    en: {
      back: '← Back to the interactive lab', eyebrow: 'Attention experiment · 01', title: 'Can an arrow pull your attention?',
      lead: 'The central arrow usually predicts where the target will appear. Keep looking at the center. When a dot appears on either side, press the matching arrow key as quickly as you can.',
      predict: 'Make a prediction first', question: 'Which cue condition do you expect to produce your fastest responses?',
      choices: [['valid', 'Valid cue: arrow and target match'], ['same', 'All three will be similar'], ['invalid', 'Invalid cue: arrow and target differ']],
      valid: 'Valid cue', invalid: 'Invalid cue', neutral: 'Neutral cue',
      definitions: [['Valid cue', 'The arrow and dot appear on the same side.'], ['Invalid cue', 'The arrow first draws attention to the other side.'], ['Neutral cue', 'A double arrow provides no location information.']],
      privacy: 'All calculations stay in this browser. Responses are not uploaded, stored, or added to a research database.',
      start: 'Start 6 practice trials', practice: 'Practice', formal: 'Test', ready: 'Ready for the test',
      formalIntro: 'There are 32 test trials. Keep looking at the central cross and balance speed with accuracy.', formalStart: 'Start the test',
      progress: 'Progress', left: '← Left', right: 'Right →', correct: 'Correct', incorrect: 'Wrong direction', timeout: 'No response recorded',
      resultTitle: 'Your result this time', resultLead: 'This describes one session on one device; it is not a measure of fixed ability.',
      median: 'Median correct RT', accuracy: 'Accuracy', cueCost: 'Reorienting cost', cueFormula: 'Invalid RT − valid RT', excluded: 'Trials excluded from RT comparison', retry: 'Try again',
      interpretationPositive: 'Invalid cues were slower this time, matching the typical pattern in which attention must be redirected from the wrong location.',
      interpretationOther: 'A typical positive difference did not appear this time. Trial count, device latency, fatigue, and ordinary variation can all affect an individual session.',
      predictionLabels: { valid: 'Valid cues fastest', same: 'All three similar', invalid: 'Invalid cues fastest', unsure: 'No prediction selected' },
      limitsTitle: 'How to interpret this responsibly', limits: ['Condition differences are more informative than raw left-versus-right RTs.', 'Incorrect, implausibly fast, and very slow trials are excluded from median RT but remain reflected in accuracy.', 'Phones, keyboards, browsers, and refresh rates add latency, so avoid comparisons across devices.'],
      source: 'Read the classic study: Posner, Snyder, and Davidson (1980)'
    }
  };

  function buildLabMarkup(lang = 'zh') {
    const c = content[lang] || content.zh;
    return `<div class="page-shell lab-page"><header class="lab-hero"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.lead}</p></header>
      <section class="lab-method" aria-label="${lang === 'zh' ? '互動學習步驟' : 'Interactive learning steps'}">${c.steps.map(step => `<article><span>${step[0]}</span><h2>${step[1]}</h2><p>${step[2]}</p></article>`).join('')}</section>
      <section class="lab-feature" aria-labelledby="lab-feature-title"><div><p>${c.taskLabel}</p><h2 id="lab-feature-title">${c.taskTitle}</h2><strong>${c.taskName}</strong><p>${c.taskDesc}</p><a href="#/lab/posner">${c.open}</a></div><div class="lab-cue-preview" aria-hidden="true"><span>←</span><i>+</i><b>●</b></div></section>
      <section class="lab-coming"><p class="eyebrow">${c.coming}</p><ol>${c.future.map(item => `<li>${item}</li>`).join('')}</ol></section></div>`;
  }

  function buildPosnerIntroMarkup(lang = 'zh') {
    const c = posnerCopy[lang] || posnerCopy.zh;
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="experiment-header"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.lead}</p></header>
      <section class="experiment-prediction" aria-labelledby="prediction-title"><p class="section-kicker">${c.predict}</p><h2 id="prediction-title">${c.question}</h2><div class="prediction-options">${c.choices.map(choice => `<label><input type="radio" name="posner-prediction" value="${choice[0]}"><span>${choice[1]}</span></label>`).join('')}</div></section>
      <section class="cue-definitions" aria-label="${lang === 'zh' ? '三種提示條件' : 'Three cue conditions'}">${c.definitions.map((item, index) => `<article><span>0${index + 1}</span><h2>${item[0]}</h2><p>${item[1]}</p></article>`).join('')}</section>
      <aside class="experiment-privacy"><strong>${lang === 'zh' ? '資料隱私' : 'Data privacy'}</strong><p>${c.privacy}</p></aside>
      <button class="experiment-primary" type="button" data-posner-start>${c.start}</button></div>`;
  }

  function clearTimers() {
    timers.forEach(timer => clearTimeout(timer));
    timers = [];
  }

  function later(callback, delay) {
    const timer = setTimeout(callback, delay);
    timers.push(timer);
    return timer;
  }

  function cleanup() {
    clearTimers();
    if (teardown) teardown();
    teardown = null;
  }

  function renderLab(container, lang = 'zh') {
    cleanup();
    container.innerHTML = buildLabMarkup(lang);
  }

  function renderPosner(container, lang = 'zh') {
    cleanup();
    const c = posnerCopy[lang] || posnerCopy.zh;
    container.innerHTML = buildPosnerIntroMarkup(lang);
    let prediction = 'unsure';
    let activeTrial = null;
    let targetOnset = 0;
    let phase = 'practice';
    let trials = [];
    let results = [];
    let index = 0;

    function responseControlsDisabled(disabled) {
      container.querySelectorAll('[data-posner-response]').forEach(button => { button.disabled = disabled; });
    }

    function finishTrial(key) {
      if (!activeTrial) return;
      clearTimers();
      const rt = key ? Math.round(performance.now() - targetOnset) : null;
      const correct = key === activeTrial.correctKey;
      results.push({ ...activeTrial, rt, correct });
      activeTrial = null;
      responseControlsDisabled(true);
      const stage = container.querySelector('[data-posner-stage]');
      if (phase === 'practice' && stage) {
        stage.innerHTML = `<p class="trial-feedback ${correct ? 'is-correct' : 'is-incorrect'}">${key ? (correct ? c.correct : c.incorrect) : c.timeout}</p>`;
      }
      later(nextTrial, phase === 'practice' ? 520 : 240);
    }

    function showTarget(trial) {
      const stage = container.querySelector('[data-posner-stage]');
      if (!stage) return;
      stage.innerHTML = `<span class="posner-fixation" aria-hidden="true">+</span><span class="posner-target posner-target-${trial.targetSide}" aria-label="${trial.targetSide === 'left' ? c.left.replace('← ', '') : c.right.replace(' →', '')}">●</span>`;
      activeTrial = trial;
      targetOnset = performance.now();
      responseControlsDisabled(false);
      later(() => finishTrial(null), 1500);
    }

    function presentTrial(trial) {
      const stage = container.querySelector('[data-posner-stage]');
      if (!stage) return;
      stage.innerHTML = '<span class="posner-fixation" aria-hidden="true">+</span>';
      later(() => {
        const cue = trial.cueSide === 'neutral' ? '↔' : trial.cueSide === 'left' ? '←' : '→';
        stage.innerHTML = `<span class="posner-cue" aria-hidden="true">${cue}</span>`;
        later(() => {
          stage.innerHTML = '<span class="posner-fixation" aria-hidden="true">+</span>';
          later(() => showTarget(trial), 100);
        }, 200);
      }, 450 + Math.round(Math.random() * 250));
    }

    function renderTaskShell() {
      container.innerHTML = `<div class="page-shell experiment-page experiment-running"><a class="back-link" href="#/lab">${c.back}</a><header class="task-status"><div><p class="eyebrow">${phase === 'practice' ? c.practice : c.formal}</p><h1>${c.title}</h1></div><p><span>${c.progress}</span> <strong data-posner-progress>0 / ${trials.length}</strong></p></header><div class="posner-stage" data-posner-stage aria-live="polite"><span class="posner-fixation" aria-hidden="true">+</span></div><div class="posner-response-controls" aria-label="${lang === 'zh' ? '反應按鍵' : 'Response keys'}"><button type="button" data-posner-response="ArrowLeft" disabled>${c.left}</button><button type="button" data-posner-response="ArrowRight" disabled>${c.right}</button></div><p class="task-hint">${lang === 'zh' ? '鍵盤：←／→　觸控：使用上方按鈕' : 'Keyboard: ← / → · Touch: use the buttons above'}</p></div>`;
    }

    function showFormalTransition() {
      container.innerHTML = `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><section class="experiment-transition"><p class="eyebrow">${c.ready}</p><h1>${c.title}</h1><p>${c.formalIntro}</p><button class="experiment-primary" type="button" data-posner-formal>${c.formalStart}</button></section></div>`;
    }

    function formatRt(value) {
      return value === null ? '—' : `${Math.round(value)} ms`;
    }

    function formatAccuracy(value) {
      return value === null ? '—' : `${Math.round(value * 100)}%`;
    }

    function showResults() {
      const summary = window.PosnerTask.summarizePosnerTrials(results);
      const rows = ['valid', 'neutral', 'invalid'].map(condition => `<tr><th scope="row">${c[condition]}</th><td>${formatRt(summary.conditions[condition].medianRt)}</td><td>${formatAccuracy(summary.conditions[condition].accuracy)}</td></tr>`).join('');
      const interpretation = summary.cueingCost !== null && summary.cueingCost > 0 ? c.interpretationPositive : c.interpretationOther;
      container.innerHTML = `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="result-header"><p class="eyebrow">Result</p><h1>${c.resultTitle}</h1><p>${c.resultLead}</p></header><section class="result-summary" aria-labelledby="cue-cost-title"><div><span>${c.cueCost}</span><strong id="cue-cost-title">${formatRt(summary.cueingCost)}</strong><small>${c.cueFormula}</small></div><p>${interpretation}</p></section><div class="result-table-wrap"><table><thead><tr><th>${lang === 'zh' ? '提示條件' : 'Cue condition'}</th><th>${c.median}</th><th>${c.accuracy}</th></tr></thead><tbody>${rows}</tbody></table></div><dl class="result-notes"><div><dt>${lang === 'zh' ? '你的預測' : 'Your prediction'}</dt><dd>${c.predictionLabels[prediction]}</dd></div><div><dt>${c.excluded}</dt><dd>${summary.excludedCount} / ${summary.totalCount}</dd></div></dl><section class="result-limits"><h2>${c.limitsTitle}</h2><ul>${c.limits.map(item => `<li>${item}</li>`).join('')}</ul><a href="https://pubmed.ncbi.nlm.nih.gov/7381367/" target="_blank" rel="noopener noreferrer">${c.source} ↗</a></section><button class="experiment-primary" type="button" data-posner-retry>${c.retry}</button></div>`;
    }

    function nextTrial() {
      if (index >= trials.length) {
        if (phase === 'practice') showFormalTransition();
        else showResults();
        return;
      }
      const progress = container.querySelector('[data-posner-progress]');
      if (progress) progress.textContent = `${index + 1} / ${trials.length}`;
      const trial = trials[index++];
      presentTrial(trial);
    }

    function start(nextPhase) {
      phase = nextPhase;
      results = [];
      index = 0;
      trials = nextPhase === 'practice'
        ? window.PosnerTask.createPosnerTrials({ valid: 2, invalid: 2, neutral: 2 })
        : window.PosnerTask.createPosnerTrials({ valid: 16, invalid: 8, neutral: 8 });
      renderTaskShell();
      later(nextTrial, 700);
    }

    function onClick(event) {
      const startButton = event.target.closest('[data-posner-start]');
      if (startButton) {
        prediction = container.querySelector('input[name="posner-prediction"]:checked')?.value || 'unsure';
        start('practice');
        return;
      }
      if (event.target.closest('[data-posner-formal]')) start('formal');
      if (event.target.closest('[data-posner-retry]')) renderPosner(container, lang);
      const response = event.target.closest('[data-posner-response]');
      if (response) finishTrial(response.dataset.posnerResponse);
    }

    function onKeydown(event) {
      if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && activeTrial) {
        event.preventDefault();
        finishTrial(event.key);
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

  return { buildLabMarkup, buildPosnerIntroMarkup, renderLab, renderPosner, cleanup };
});
