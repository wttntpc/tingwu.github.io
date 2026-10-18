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
      task2Label: '第二個互動實驗', task2Title: '情緒會自動改變動作嗎？', task2Name: '情緒臉孔 × 動作啟動',
      task2Desc: '改編自 Mirabella 等人（2023）的向前步態啟動研究：使用虛構的 AI 合成臉孔，比較情緒與任務相關或無關時，憤怒與快樂臉孔是否呈現不同反應。網站以單鍵安全模擬，約需 4–5 分鐘。',
      coming: '接下來',
      future: ['三分鐘活動挑戰：運動前後的反應時間與心情']
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
      task2Label: 'Second interactive experiment', task2Title: 'Does emotion automatically change action?', task2Name: 'Emotional faces × action initiation',
      task2Desc: 'Adapted from Mirabella et al. (2023): use fictional AI-generated faces to compare angry and happy expressions when emotion is relevant versus irrelevant to the current goal. A single key safely stands in for a forward step. Allow 4–5 minutes.',
      coming: 'Coming next',
      future: ['Three-minute movement challenge: response time and mood before and after activity']
    }
  };

  const posnerCopy = {
    zh: {
      back: '← 返回互動實驗室', eyebrow: 'Attention experiment · 01', title: '箭頭會把注意力帶走嗎？',
      lead: '這個作業測量「提示把注意力帶到某處後，我們多快找到目標」。先理解每一步與三種情境，再進行預測和練習。',
      guideTitle: '實驗怎麼進行', guideLead: '每一次試次都依照相同順序進行。真正需要反應的是圓點出現的時刻，不必判斷圓點在左邊或右邊。',
      guideSteps: [['1', '固定注視', '眼睛盯著中央凝視點「＋」，整個試次都不要追著箭頭或圓點移動。'], ['2', '看見提示', '中央會短暫出現箭頭；這只是提示，先不要按鍵或點選。'], ['3', '偵測目標', '不論圓點出現在左側或右側，只要看到圓點就立即反應。'], ['4', '使用同一個反應鍵', '電腦請按空白鍵；手機或平板請用手指點下方單一反應按鈕。']],
      scenariosTitle: '先看三種情境', scenariosLead: '假設箭頭朝左：圓點接著出現在哪裡，決定這次屬於哪一種提示。',
      scenarios: [
        ['有效提示', '←', '● ·', '箭頭向左，圓點出現在左側；提示的位置正確。'],
        ['無效提示', '←', '· ●', '箭頭向左，圓點出現在右側；注意力需要從左側重新轉向右側。'],
        ['中性提示', '↔', '● ·', '雙向箭頭不偏向任何一側；圓點可出現在左側或右側。']
      ],
      predict: '看完情境後，再做預測', question: '根據上面的情境，哪一種提示下，你認為自己的反應會最快？',
      choices: [['valid', '有效提示：箭頭與目標同方向'], ['same', '三種情況差不多'], ['invalid', '無效提示：箭頭與目標反方向']],
      valid: '有效提示', invalid: '無效提示', neutral: '中性提示',
      definitions: [['有效提示', '箭頭與圓點出現在同一側。'], ['無效提示', '箭頭先把注意力帶到另一側。'], ['中性提示', '雙向箭頭不提供位置資訊。']],
      privacy: '本實驗只在你的瀏覽器中計算；反應資料不會上傳、儲存或加入研究資料庫。',
      start: '開始 6 次練習', practice: '練習', formal: '正式測驗', ready: '準備好進入正式測驗',
      formalIntro: '接下來共 32 次。請持續看著中央十字；不必判斷左右，只要看到圓點就立即反應。', formalStart: '開始正式測驗',
      progress: '進度', left: '← 左', right: '右 →', correct: '正確', incorrect: '方向不符', timeout: '這次沒有收到反應',
      resultTitle: '你的這次結果', resultLead: '以下只描述這一次、這台裝置上的表現，不代表固定能力。',
      median: '反應時間中位數', cueCost: '注意力重新定向成本',
      cueFormula: '無效提示 RT − 有效提示 RT', excluded: '未納入 RT 比較的試次', retry: '再做一次',
      interpretationPositive: '這次無效提示較慢，符合注意力先被帶往錯誤位置、之後需要重新定向的典型模式。',
      interpretationOther: '這次沒有出現典型的正向差值。試次數、裝置延遲、疲勞與自然波動都可能影響個人結果。',
      predictionLabels: { valid: '有效提示最快', same: '三種差不多', invalid: '無效提示最快', unsure: '未選擇' },
      limitsTitle: '如何正確解讀', limits: ['這是單鍵目標偵測作業，重點是三種提示條件的反應時間差異，不是左右位置判斷題。', '沒有反應，以及過快／過慢的反應不納入 RT 中位數；排除數量會另外列出。', '手機、鍵盤、瀏覽器與螢幕更新率會造成延遲，因此不宜跨裝置比較。'],
      scienceKicker: '小小科普｜這個實驗有趣在哪裡？', scienceTitle: '眼睛維持不動，注意力仍然可以先移到別處',
      covertTitle: '隱性注意力（covert attention）', covertText: '眼睛仍看著中央十字，但心理上的選擇已移到箭頭提示的周邊位置。這正是本作業主要想呈現的現象。',
      overtTitle: '外顯注意力（overt attention）', overtText: '轉動眼睛或頭部，把目標移到中央視野。這種方向改變通常看得見，也可以用眼動儀記錄。',
      eyeNote: '眼睛移動不等於注意力本身：凝視位置只能告訴我們眼睛朝哪裡，不能完整代表心智正在選擇什麼。兩者經常合作，例如眼球跳視前常先把注意力移向下一個目標，但它們可以被實驗分開研究。',
      designNote: '中央箭頭是具有方向意義的符號提示。若無效提示使反應較慢，代表大腦可能先依箭頭分配注意力，之後才重新轉向真正出現圓點的位置；這是「提示效果」，不是箭頭把眼睛拉走。',
      source: '經典 Posner 空間提示研究', attentionReview: '視覺注意力回顧：Carrasco（2011）'
    },
    en: {
      back: '← Back to the interactive lab', eyebrow: 'Attention experiment · 01', title: 'Can an arrow pull your attention?',
      lead: 'This task measures how quickly we find a target after a cue directs attention. Learn the sequence and three situations before predicting and practising.',
      guideTitle: 'How the experiment works', guideLead: 'Every trial follows the same sequence. Respond when the dot appears; you do not need to identify whether it is on the left or right.',
      guideSteps: [['1', 'Fixate', 'Keep your eyes on the central fixation point “+” throughout the trial; do not follow the arrow or dot with your eyes.'], ['2', 'See the cue', 'An arrow briefly appears at the center. It is only a cue, so do not respond yet.'], ['3', 'Detect the target', 'Whether the dot appears on the left or right, respond as soon as you see it.'], ['4', 'Use one response key', 'On a computer, press the Space key. On a phone or tablet, tap the single response button with your finger.']],
      scenariosTitle: 'See the three situations first', scenariosLead: 'Suppose the arrow points left. Where the dot appears next determines the cue condition.',
      scenarios: [
        ['Valid cue', '←', '● ·', 'The arrow points left and the dot appears on the left: the cue correctly predicts the location.'],
        ['Invalid cue', '←', '· ●', 'The arrow points left but the dot appears on the right: attention must be redirected.'],
        ['Neutral cue', '↔', '● ·', 'The double arrow favors neither side; the dot can appear on either side.']
      ],
      predict: 'Now make a prediction', question: 'Based on the situations above, which cue condition should produce your fastest responses?',
      choices: [['valid', 'Valid cue: arrow and target match'], ['same', 'All three will be similar'], ['invalid', 'Invalid cue: arrow and target differ']],
      valid: 'Valid cue', invalid: 'Invalid cue', neutral: 'Neutral cue',
      definitions: [['Valid cue', 'The arrow and dot appear on the same side.'], ['Invalid cue', 'The arrow first draws attention to the other side.'], ['Neutral cue', 'A double arrow provides no location information.']],
      privacy: 'All calculations stay in this browser. Responses are not uploaded, stored, or added to a research database.',
      start: 'Start 6 practice trials', practice: 'Practice', formal: 'Test', ready: 'Ready for the test',
      formalIntro: 'There are 32 test trials. Keep looking at the central cross; do not judge left versus right—respond as soon as the dot appears.', formalStart: 'Start the test',
      progress: 'Progress', left: '← Left', right: 'Right →', correct: 'Correct', incorrect: 'Wrong direction', timeout: 'No response recorded',
      resultTitle: 'Your result this time', resultLead: 'This describes one session on one device; it is not a measure of fixed ability.',
      median: 'Median response time', cueCost: 'Reorienting cost', cueFormula: 'Invalid RT − valid RT', excluded: 'Trials excluded from RT comparison', retry: 'Try again',
      interpretationPositive: 'Invalid cues were slower this time, matching the typical pattern in which attention must be redirected from the wrong location.',
      interpretationOther: 'A typical positive difference did not appear this time. Trial count, device latency, fatigue, and ordinary variation can all affect an individual session.',
      predictionLabels: { valid: 'Valid cues fastest', same: 'All three similar', invalid: 'Invalid cues fastest', unsure: 'No prediction selected' },
      limitsTitle: 'How to interpret this responsibly', limits: ['This is a one-key target-detection task. The main outcome is the reaction-time difference among cue conditions, not a left-right identification score.', 'Missed responses and implausibly fast or slow responses are excluded from median RT; the excluded count is reported separately.', 'Phones, keyboards, browsers, and refresh rates add latency, so avoid comparisons across devices.'],
      scienceKicker: 'A short explainer | Why is this design interesting?', scienceTitle: 'Attention can move while the eyes remain still',
      covertTitle: 'Covert attention', covertText: 'The eyes stay on the central cross while mental selection shifts toward the peripheral location indicated by the arrow. This is the phenomenon the task is designed to demonstrate.',
      overtTitle: 'Overt attention', overtText: 'The eyes or head turn so the target reaches central vision. This change is visible and can be recorded with eye tracking.',
      eyeNote: 'Eye movement is not attention itself: gaze position tells us where the eyes point, not everything the mind is selecting. The systems often cooperate—for example, covert attention commonly moves to a future target before a saccade—but experiments can dissociate them.',
      designNote: 'The central arrow is a symbolic directional cue. Slower responses after invalid cues suggest attention may first have followed the arrow and then reoriented to the dot. This is a cueing effect, not evidence that the arrow physically pulled the eyes.',
      source: 'Classic Posner spatial-cueing study', attentionReview: 'Visual-attention review: Carrasco (2011)'
    }
  };

  function buildLabMarkup(lang = 'zh') {
    const c = content[lang] || content.zh;
    return `<div class="page-shell lab-page"><header class="lab-hero"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.lead}</p></header>
      <section class="lab-method" aria-label="${lang === 'zh' ? '互動學習步驟' : 'Interactive learning steps'}">${c.steps.map(step => `<article><span>${step[0]}</span><h2>${step[1]}</h2><p>${step[2]}</p></article>`).join('')}</section>
      <section class="lab-feature" aria-labelledby="lab-feature-title"><div><p>${c.taskLabel}</p><h2 id="lab-feature-title">${c.taskTitle}</h2><strong>${c.taskName}</strong><p>${c.taskDesc}</p><a href="#/lab/posner">${c.open}</a></div><div class="lab-cue-preview" aria-hidden="true"><span>←</span><i>+</i><b>●</b></div></section>
      <section class="lab-feature lab-feature-emotion" aria-labelledby="lab-emotion-title"><div><p>${c.task2Label}</p><h2 id="lab-emotion-title">${c.task2Title}</h2><strong>${c.task2Name}</strong><p>${c.task2Desc}</p><a href="#/lab/emotion-gonogo">${c.open}</a></div><div class="lab-emotion-preview" aria-hidden="true"><span class="emotion-face"><img src="assets/emotion-faces/identity-a-happy.webp" alt="" width="512" height="512" decoding="async"></span><span class="emotion-face"><img src="assets/emotion-faces/identity-b-angry.webp" alt="" width="512" height="512" decoding="async"></span></div></section>
      <section class="lab-coming"><p class="eyebrow">${c.coming}</p><ol>${c.future.map(item => `<li>${item}</li>`).join('')}</ol></section></div>`;
  }

  function buildPosnerIntroMarkup(lang = 'zh') {
    const c = posnerCopy[lang] || posnerCopy.zh;
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="experiment-header"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.lead}</p></header>
      <section class="posner-guide" aria-labelledby="posner-guide-title"><p class="section-kicker">01 · ${c.guideTitle}</p><h2 id="posner-guide-title">${c.guideLead}</h2><ol>${c.guideSteps.map(step => `<li><span>${step[0]}</span><div><strong>${step[1]}</strong><p>${step[2]}</p></div></li>`).join('')}</ol></section>
      <section class="posner-scenarios" aria-labelledby="posner-scenarios-title"><p class="section-kicker">02 · ${c.scenariosTitle}</p><h2 id="posner-scenarios-title">${c.scenariosLead}</h2><div class="posner-scenario-grid">${c.scenarios.map((item, index) => `<article><span>0${index + 1}</span><h3>${item[0]}</h3><div class="posner-scenario-sequence" aria-hidden="true"><b>＋</b><i>→</i><b>${item[1]}</b><i>→</i><b>${item[2]}</b></div><p>${item[3]}</p></article>`).join('')}</div></section>
      <section class="experiment-prediction" aria-labelledby="prediction-title"><p class="section-kicker">03 · ${c.predict}</p><h2 id="prediction-title">${c.question}</h2><div class="prediction-options">${c.choices.map(choice => `<label><input type="radio" name="posner-prediction" value="${choice[0]}"><span>${choice[1]}</span></label>`).join('')}</div></section>
      <aside class="experiment-privacy"><strong>${lang === 'zh' ? '資料隱私' : 'Data privacy'}</strong><p>${c.privacy}</p></aside>
      <button class="experiment-primary" type="button" data-posner-start>${c.start}</button></div>`;
  }

  function buildPosnerTaskShellMarkup(lang = 'zh', phase = 'practice', trialCount = 0) {
    const c = posnerCopy[lang] || posnerCopy.zh;
    return `<div class="page-shell experiment-page experiment-running"><a class="back-link" href="#/lab">${c.back}</a><header class="task-status"><div><p class="eyebrow">${phase === 'practice' ? c.practice : c.formal}</p><h1>${c.title}</h1></div><p><span>${c.progress}</span> <strong data-posner-progress>0 / ${trialCount}</strong></p></header><p class="task-fixation-reminder">${lang === 'zh' ? '請持續盯著中央「＋」；箭頭出現時先不要作答，看到圓點才按下反應鍵。' : 'Keep looking at the central “+”. Do not respond to the arrow; press the response key only when the dot appears.'}</p><div class="posner-stage" data-posner-stage aria-live="polite"><span class="posner-fixation" aria-hidden="true">+</span></div><div class="posner-response-controls" aria-label="${lang === 'zh' ? '單一反應鍵' : 'Single response key'}"><button type="button" data-posner-response="Space" disabled>${lang === 'zh' ? '看到圓點，立即反應' : 'Respond when the dot appears'}</button></div><p class="task-hint">${lang === 'zh' ? '電腦：按空白鍵　手機／平板：用手指點上方反應按鈕' : 'Computer: press Space · Phone/tablet: tap the response button above'}</p></div>`;
  }

  function formatPosnerRt(value) {
    return value === null || value === undefined ? '—' : `${Math.round(value)} ms`;
  }

  function buildPosnerResultsMarkup(lang = 'zh', summary, prediction = 'unsure') {
    const c = posnerCopy[lang] || posnerCopy.zh;
    const rows = ['valid', 'neutral', 'invalid'].map(condition => `<tr><th scope="row">${c[condition]} RT</th><td>${formatPosnerRt(summary.conditions[condition].medianRt)}</td></tr>`).join('');
    const interpretation = summary.cueingCost !== null && summary.cueingCost > 0 ? c.interpretationPositive : c.interpretationOther;
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="result-header"><p class="eyebrow">Result</p><h1>${c.resultTitle}</h1><p>${c.resultLead}</p></header>
      <section class="result-summary" aria-labelledby="cue-cost-title"><div><span>${c.cueCost}</span><strong id="cue-cost-title">${formatPosnerRt(summary.cueingCost)}</strong><small>${c.cueFormula}</small></div><p>${interpretation}</p></section>
      <div class="result-table-wrap"><table><thead><tr><th>${lang === 'zh' ? '提示條件' : 'Cue condition'}</th><th>${c.median}</th></tr></thead><tbody>${rows}</tbody></table></div>
      <dl class="result-notes"><div><dt>${lang === 'zh' ? '你的預測' : 'Your prediction'}</dt><dd>${c.predictionLabels[prediction] || c.predictionLabels.unsure}</dd></div><div><dt>${c.excluded}</dt><dd>${summary.excludedCount} / ${summary.totalCount}</dd></div></dl>
      <section class="result-limits"><h2>${c.limitsTitle}</h2><ul>${c.limits.map(item => `<li>${item}</li>`).join('')}</ul></section>
      <section class="result-science" aria-labelledby="posner-science-title"><p class="section-kicker">${c.scienceKicker}</p><h2 id="posner-science-title">${c.scienceTitle}</h2><div class="attention-contrast"><article><h3>${c.covertTitle}</h3><p>${c.covertText}</p></article><article><h3>${c.overtTitle}</h3><p>${c.overtText}</p></article></div><p><strong>${lang === 'zh' ? '關鍵差別：' : 'Key distinction: '}</strong>${c.eyeNote}</p><p>${c.designNote}</p><div class="result-sources"><a href="https://pubmed.ncbi.nlm.nih.gov/7381367/" target="_blank" rel="noopener noreferrer">${c.source} ↗</a><a href="https://pubmed.ncbi.nlm.nih.gov/21549742/" target="_blank" rel="noopener noreferrer">${c.attentionReview} ↗</a></div></section>
      <button class="experiment-primary" type="button" data-posner-retry>${c.retry}</button></div>`;
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
      container.innerHTML = buildPosnerTaskShellMarkup(lang, phase, trials.length);
    }

    function showFormalTransition() {
      container.innerHTML = `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><section class="experiment-transition"><p class="eyebrow">${c.ready}</p><h1>${c.title}</h1><p>${c.formalIntro}</p><button class="experiment-primary" type="button" data-posner-formal>${c.formalStart}</button></section></div>`;
    }

    function showResults() {
      const summary = window.PosnerTask.summarizePosnerTrials(results);
      container.innerHTML = buildPosnerResultsMarkup(lang, summary, prediction);
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
      if ((event.code === 'Space' || event.key === ' ' || event.key === 'Spacebar') && activeTrial) {
        event.preventDefault();
        finishTrial('Space');
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

  return { buildLabMarkup, buildPosnerIntroMarkup, buildPosnerTaskShellMarkup, buildPosnerResultsMarkup, renderLab, renderPosner, cleanup };
});
