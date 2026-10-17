(function exposeEmotionGoNoGoUI(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EmotionGoNoGoUI = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createEmotionGoNoGoUIApi() {
  let timers = [];
  let teardown = null;

  const copy = {
    zh: {
      back: '← 返回互動實驗室', eyebrow: 'Emotion × action · 02', title: '情緒會自動改變動作嗎？',
      lead: '這個互動示範改編自 Mirabella 等人（2023）的向前步態啟動研究。真正的問題不是「哪張臉比較可怕」，而是：只有當情緒與目前任務有關時，表情才會改變動作準備嗎？',
      guideTitle: '實驗怎麼進行', guideLead: '你會看到相同的快樂、憤怒與中性示意臉，但在兩個區塊中使用不同判斷規則。',
      guideSteps: [['1', '固定注視', '每次先看中央「＋」，臉孔出現前不要預先反應。'], ['2', '記住當前規則', '第一種規則要判斷表情；另一種規則只看人物組別並忽略表情。'], ['3', '模擬向前踏步', '電腦請按空白鍵，手機或平板請點畫面下方的單一按鈕代表 GO。基於安全，請不要真的向前踏步。'], ['4', '遇到 NO-GO 忍住', '不要按任何鍵，也不要點按鈕；等待下一個試次。']],
      mappingsTitle: '兩種任務規則', mappingsLead: '關鍵操弄是「情緒是否與作業目標相關」，而不是把某種情緒永遠設成 NO-GO。',
      mappings: [['情緒判斷｜情緒相關', '憤怒臉、快樂臉：GO', '中性臉：NO-GO'], ['人物判斷｜情緒無關', '指定人物組別：GO', '另一組：NO-GO；忽略表情']],
      predict: '理解規則後，再做預測', question: '你認為憤怒臉相較快樂臉，會在哪一種情況讓反應變慢？',
      choices: [['relevant', '只有情緒判斷時會變慢'], ['automatic', '兩種任務都會變慢'], ['same', '兩種表情可能差不多']],
      evidenceLabel: '研究依據', evidence: 'Mirabella 等人以 20 名大學生、動作捕捉與每種任務 180 次試驗研究真正的向前踏步。網站版只保留任務邏輯。',
      privacy: '所有反應只在你的瀏覽器中計算，不會上傳、儲存或加入研究資料庫。',
      caveat: '這是使用自製示意臉、按鍵與短試次的概念重現，不是原研究的步態測量、正式複製研究或心理評估。原研究的對照作業是判斷性別；網站改用 A／B 人物組別，避免以簡筆臉推測性別。',
      start: '查看第一個任務規則', practice: '練習', formal: '正式測驗', progress: '進度',
      blockTitle: '先記住這個任務的規則', blockLead: '每個任務先做 9 次練習，再做 18 次測驗；GO 與 NO-GO 比例維持約 2：1。',
      emotionTask: '情緒判斷｜情緒與目標相關', identityTask: '人物判斷｜情緒與目標無關',
      go: 'GO｜按下反應鍵', nogo: 'NO-GO｜不要按', beginPractice: '開始這個任務的練習',
      practiceDone: '練習完成', formalIntro: '接下來進入短版測驗。請依目前規則，在 GO 出現時儘快反應；NO-GO 則完全不要按。', formalStart: '開始短版測驗',
      emotionReminder: '憤怒臉、快樂臉：按／點；中性臉：不要按。',
      identityReminder: (go, nogo) => `人物 ${go.toUpperCase()}：按／點；人物 ${nogo.toUpperCase()}：不要按，並忽略表情。`,
      response: 'GO 出現時，立即反應', correct: '正確', commission: '這是 NO-GO，應該忍住不按', omission: '這是 GO，需要按下反應鍵',
      happy: '快樂臉', angry: '憤怒臉', neutral: '中性臉', identity: identity => `人物 ${identity.toUpperCase()}`,
      resultTitle: '你的任務相關性結果', resultLead: '比較同一組表情在兩種任務中的差異；單次短版結果不代表固定能力，也不能視為原研究的重現。',
      relevantDiff: '情緒相關：憤怒 RT − 快樂 RT', irrelevantDiff: '情緒無關：憤怒 RT − 快樂 RT', interaction: '兩個差值之差',
      task: '任務', emotion: '表情', goRt: 'GO 中位反應時間', omission: 'GO 漏答率',
      predictionLabels: { relevant: '只有情緒判斷時變慢', automatic: '兩種任務都變慢', same: '兩種表情差不多', unsure: '未選擇' },
      excluded: '排除的極端 GO RT', retry: '再做一次', limitsTitle: '如何解讀你的結果',
      limits: ['若情緒相關區塊的「憤怒 − 快樂」差值較大，方向上較接近原研究的任務相關性效應。', '短版只有少量試次，示意臉也不是原研究的 Pictures of Facial Affect 照片；沒有出現差異不代表研究結論錯誤。', '按鍵反應不是步態啟動。原研究以動作捕捉測量腳跟開始移動的時間，兩者不可直接比較。'],
      paperTitle: '原研究發現了什麼？', paperLead: '20 名大學生的群體平均顯示：憤怒表情只有在必須判斷情緒時才拖慢向前步態啟動。',
      paperEmotion: '情緒判斷', paperIdentity: '性別判斷', paperConclusion: '這支持「情緒效果取決於當下目標與有意識評估」，而不是任何情緒臉都會自動改變動作。',
      source: 'Mirabella 等人（2023）原始研究', doi: 'DOI：10.1037/emo0001112'
    },
    en: {
      back: '← Back to the interactive lab', eyebrow: 'Emotion × action · 02', title: 'Does emotion automatically change action?',
      lead: 'This interactive demonstration adapts Mirabella et al. (2023), a forward gait-initiation study. The key question is whether facial expressions alter action preparation only when emotion is relevant to the current goal.',
      guideTitle: 'How the experiment works', guideLead: 'The same happy, angry, and neutral schematic faces appear under two different task rules.',
      guideSteps: [['1', 'Fixate', 'Watch the central “+” and do not respond before a face appears.'], ['2', 'Remember the rule', 'One task requires expression judgments; the other uses person group while emotion must be ignored.'], ['3', 'Simulate a forward step', 'Space or the single button represents GO. For safety, do not physically step forward.'], ['4', 'Withhold for NO-GO', 'Do not press or tap anything; wait for the next trial.']],
      mappingsTitle: 'Two task rules', mappingsLead: 'The manipulation is whether emotion is relevant to the goal—not whether one emotion is permanently assigned to NO-GO.',
      mappings: [['Emotion task | relevant', 'Angry and happy: GO', 'Neutral: NO-GO'], ['Person task | irrelevant', 'Assigned person group: GO', 'Other group: NO-GO; ignore expression']],
      predict: 'Predict after learning the rules', question: 'When will angry faces slow responses relative to happy faces?',
      choices: [['relevant', 'Only during emotion judgments'], ['automatic', 'During both tasks'], ['same', 'The expressions may be similar']],
      evidenceLabel: 'Evidence base', evidence: 'Mirabella et al. studied real forward steps in 20 university students using motion capture and 180 trials per task. This browser version preserves only the task logic.',
      privacy: 'All responses are calculated in this browser and are not uploaded, stored, or added to a research database.',
      caveat: 'This is a conceptual adaptation using original schematic faces, keypresses, and few trials—not gait measurement, a formal replication, or a psychological assessment. The published control task used gender judgments; this site substitutes A/B person groups to avoid inferring gender from schematic faces.',
      start: 'See the first task rule', practice: 'Practice', formal: 'Test', progress: 'Progress',
      blockTitle: 'Remember this task rule', blockLead: 'Each task starts with 9 practice trials followed by 18 test trials; the GO/NO-GO ratio is approximately 2:1.',
      emotionTask: 'Emotion judgment | emotion relevant', identityTask: 'Person judgment | emotion irrelevant',
      go: 'GO | respond', nogo: 'NO-GO | withhold', beginPractice: 'Start this task practice',
      practiceDone: 'Practice complete', formalIntro: 'The short test begins next. Respond quickly to GO and make no response to NO-GO.', formalStart: 'Start short test',
      emotionReminder: 'Angry and happy: press/tap; neutral: do not respond.',
      identityReminder: (go, nogo) => `Person ${go.toUpperCase()}: press/tap; person ${nogo.toUpperCase()}: do not respond; ignore expression.`,
      response: 'Respond immediately for GO', correct: 'Correct', commission: 'This was NO-GO: withhold the response', omission: 'This was GO: press the response key',
      happy: 'Happy face', angry: 'Angry face', neutral: 'Neutral face', identity: identity => `Person ${identity.toUpperCase()}`,
      resultTitle: 'Your task-relevance result', resultLead: 'Compare the same expressions across task rules. One short browser session is not a fixed ability or a replication of the original study.',
      relevantDiff: 'Emotion relevant: angry RT − happy RT', irrelevantDiff: 'Emotion irrelevant: angry RT − happy RT', interaction: 'Difference of differences',
      task: 'Task', emotion: 'Expression', goRt: 'Median GO RT', omission: 'GO omission rate',
      predictionLabels: { relevant: 'Slower only for emotion judgments', automatic: 'Slower in both tasks', same: 'Expressions similar', unsure: 'No prediction selected' },
      excluded: 'Extreme GO RTs excluded', retry: 'Try again', limitsTitle: 'How to interpret your result',
      limits: ['A larger angry-minus-happy difference in the emotion task points in the direction of the published task-relevance effect.', 'This short version has few trials and does not use the original Pictures of Facial Affect stimuli; no difference here does not overturn the study.', 'A keypress is not gait initiation. The original study used motion capture to detect heel movement onset, so the values are not directly comparable.'],
      paperTitle: 'What did the original study find?', paperLead: 'Group means from 20 university students showed that angry expressions delayed forward gait initiation only when expression had to be judged.',
      paperEmotion: 'Emotion task', paperIdentity: 'Gender task', paperConclusion: 'The findings support an effect that depends on current goals and conscious appraisal, rather than an automatic motor effect of every emotional face.',
      source: 'Mirabella et al. (2023) original study', doi: 'DOI: 10.1037/emo0001112'
    }
  };

  function faceMarkup(emotion, identity, label, decorative = false) {
    const badge = identity ? `<small>${identity.toUpperCase()}</small>` : '';
    return `<span class="emotion-face emotion-face-${emotion}" ${decorative ? 'aria-hidden="true"' : `role="img" aria-label="${label}"`}>${badge}<i></i><b></b><em></em></span>`;
  }

  function buildEmotionGoNoGoIntroMarkup(lang = 'zh') {
    const c = copy[lang] || copy.zh;
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="experiment-header"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.lead}</p></header>
      <section class="posner-guide" aria-labelledby="emotion-guide-title"><p class="section-kicker">01 · ${c.guideTitle}</p><h2 id="emotion-guide-title">${c.guideLead}</h2><ol>${c.guideSteps.map(step => `<li><span>${step[0]}</span><div><strong>${step[1]}</strong><p>${step[2]}</p></div></li>`).join('')}</ol></section>
      <section class="emotion-mappings" aria-labelledby="emotion-mappings-title"><p class="section-kicker">02 · ${c.mappingsTitle}</p><h2 id="emotion-mappings-title">${c.mappingsLead}</h2><div>${c.mappings.map((item, index) => `<article><span>0${index + 1}</span><h3>${item[0]}</h3><p><strong>${item[1]}</strong><br>${item[2]}</p></article>`).join('')}</div></section>
      <section class="experiment-prediction" aria-labelledby="emotion-prediction-title"><p class="section-kicker">03 · ${c.predict}</p><h2 id="emotion-prediction-title">${c.question}</h2><div class="prediction-options">${c.choices.map(choice => `<label><input type="radio" name="emotion-prediction" value="${choice[0]}"><span>${choice[1]}</span></label>`).join('')}</div></section>
      <aside class="experiment-evidence"><strong>${c.evidenceLabel}</strong><p>${c.evidence}</p></aside>
      <aside class="experiment-privacy"><strong>${lang === 'zh' ? '資料隱私與範圍' : 'Privacy and scope'}</strong><p>${c.privacy}</p><p>${c.caveat}</p></aside>
      <button class="experiment-primary" type="button" data-emotion-start>${c.start}</button></div>`;
  }

  function reminderFor(c, options) {
    return options.rule === 'identity'
      ? c.identityReminder(options.goIdentity || 'a', options.noGoIdentity || 'b')
      : c.emotionReminder;
  }

  function buildEmotionGoNoGoTaskShellMarkup(lang = 'zh', options = {}) {
    const c = copy[lang] || copy.zh;
    const phase = options.phase || 'practice';
    return `<div class="page-shell experiment-page experiment-running"><a class="back-link" href="#/lab">${c.back}</a><header class="task-status"><div><p class="eyebrow">${phase === 'practice' ? c.practice : c.formal}</p><h1>${c.title}</h1></div><p><span>${c.progress}</span> <strong data-emotion-progress>0 / ${options.trialCount || 0}</strong></p></header><p class="task-fixation-reminder">${reminderFor(c, options)}</p><div class="emotion-stage" data-emotion-stage aria-live="polite"><span class="posner-fixation" aria-hidden="true">+</span></div><div class="emotion-response-controls" aria-label="${lang === 'zh' ? '單一反應鍵' : 'Single response key'}"><button type="button" data-emotion-response="Space" disabled>${c.response}</button></div><p class="task-hint">${lang === 'zh' ? '電腦：按空白鍵　手機／平板：點按鈕；請不要真的向前踏步。' : 'Computer: Space · Phone/tablet: tap; do not physically step forward.'}</p></div>`;
  }

  function formatRt(value) { return value === null ? '—' : `${Math.round(value)} ms`; }
  function formatRate(value) { return value === null ? '—' : `${Math.round(value * 100)}%`; }

  function buildEmotionResultsMarkup(lang = 'zh', summary, prediction = 'unsure') {
    const c = copy[lang] || copy.zh;
    const rows = [
      ['emotion', 'angry'], ['emotion', 'happy'], ['identity', 'angry'], ['identity', 'happy']
    ].map(([rule, emotion]) => `<tr><th scope="row">${rule === 'emotion' ? c.paperEmotion : c.paperIdentity}</th><td>${c[emotion]}</td><td>${formatRt(summary.tasks[rule][emotion].goMedianRt)}</td><td>${formatRate(summary.tasks[rule][emotion].omissionRate)}</td></tr>`).join('');
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="result-header"><p class="eyebrow">Result</p><h1>${c.resultTitle}</h1><p>${c.resultLead}</p></header>
      <section class="emotion-result-differences"><div><span>${c.relevantDiff}</span><strong>${formatRt(summary.relevantRtDifference)}</strong></div><div><span>${c.irrelevantDiff}</span><strong>${formatRt(summary.irrelevantRtDifference)}</strong></div><div><span>${c.interaction}</span><strong>${formatRt(summary.taskRelevanceInteraction)}</strong></div></section>
      <div class="result-table-wrap"><table><thead><tr><th>${c.task}</th><th>${c.emotion}</th><th>${c.goRt}</th><th>${c.omission}</th></tr></thead><tbody>${rows}</tbody></table></div>
      <dl class="result-notes"><div><dt>${lang === 'zh' ? '你的預測' : 'Your prediction'}</dt><dd>${c.predictionLabels[prediction] || c.predictionLabels.unsure}</dd></div><div><dt>${c.excluded}</dt><dd>${summary.excludedRtCount}</dd></div></dl>
      <section class="result-limits"><h2>${c.limitsTitle}</h2><ul>${c.limits.map(item => `<li>${item}</li>`).join('')}</ul></section>
      <section class="result-science gait-paper-result" aria-labelledby="gait-paper-title"><p class="section-kicker">Mirabella et al. · Emotion · 2023</p><h2 id="gait-paper-title">${c.paperTitle}</h2><p>${c.paperLead}</p><div class="paper-result-grid"><article><span>${c.paperEmotion}</span><strong>687 vs 622 ms</strong><p>${lang === 'zh' ? '憤怒 vs 快樂；平均慢 65 ms' : 'Angry vs happy; 65 ms slower on average'}</p><small>${lang === 'zh' ? '漏答：2.15% vs 0.25%' : 'Omissions: 2.15% vs 0.25%'}</small></article><article><span>${c.paperIdentity}</span><strong>628 vs 619 ms</strong><p>${lang === 'zh' ? '憤怒 vs 快樂；未出現顯著差異' : 'Angry vs happy; no significant difference'}</p><small>${lang === 'zh' ? '中性臉平均 621 ms' : 'Neutral faces averaged 621 ms'}</small></article></div><p>${c.paperConclusion}</p><div class="result-sources"><a href="https://pubmed.ncbi.nlm.nih.gov/35588387/" target="_blank" rel="noopener noreferrer">${c.source} ↗</a><a href="https://doi.org/10.1037/emo0001112" target="_blank" rel="noopener noreferrer">${c.doi} ↗</a></div></section>
      <button class="experiment-primary" type="button" data-emotion-retry>${c.retry}</button></div>`;
  }

  function clearTimers() { timers.forEach(timer => clearTimeout(timer)); timers = []; }
  function later(callback, delay) { timers.push(setTimeout(callback, delay)); }
  function cleanup() { clearTimers(); if (teardown) teardown(); teardown = null; }

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
    function setResponseDisabled(disabled) { container.querySelectorAll('[data-emotion-response]').forEach(button => { button.disabled = disabled; }); }

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
      stage.innerHTML = faceMarkup(trial.emotion, trial.identity, `${c.identity(trial.identity)}，${c[trial.emotion]}`);
      activeTrial = trial;
      targetOnset = performance.now();
      setResponseDisabled(false);
      later(() => finishTrial(false), 1100);
    }

    function presentTrial(trial) {
      const stage = container.querySelector('[data-emotion-stage]');
      if (!stage) return;
      stage.innerHTML = '<span class="posner-fixation" aria-hidden="true">+</span>';
      later(() => showFace(trial), 500 + Math.round(Math.random() * 250));
    }

    function ruleCards(block) {
      if (block.rule === 'emotion') {
        return `<article>${faceMarkup('angry', 'a', c.angry)}<strong>${c.angry}</strong><span>${c.go}</span></article><article>${faceMarkup('happy', 'b', c.happy)}<strong>${c.happy}</strong><span>${c.go}</span></article><article>${faceMarkup('neutral', 'a', c.neutral)}<strong>${c.neutral}</strong><span>${c.nogo}</span></article>`;
      }
      return `<article>${faceMarkup('happy', block.goIdentity, c.identity(block.goIdentity))}<strong>${c.identity(block.goIdentity)}</strong><span>${c.go}</span></article><article>${faceMarkup('angry', block.noGoIdentity, c.identity(block.noGoIdentity))}<strong>${c.identity(block.noGoIdentity)}</strong><span>${c.nogo}</span></article>`;
    }

    function showBlockIntro() {
      const block = activeBlock();
      const taskName = block.rule === 'emotion' ? c.emotionTask : c.identityTask;
      container.innerHTML = `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><section class="experiment-transition emotion-block-intro"><p class="eyebrow">Task ${blockIndex + 1} / 2</p><h1>${c.blockTitle}</h1><p><strong>${taskName}</strong></p><p>${c.blockLead}</p><div class="emotion-rule-pair ${block.rule === 'emotion' ? 'has-three' : ''}">${ruleCards(block)}</div><button class="experiment-primary" type="button" data-emotion-block-start>${c.beginPractice}</button></section></div>`;
    }

    function showFormalTransition() {
      container.innerHTML = `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><section class="experiment-transition"><p class="eyebrow">${c.practiceDone}</p><h1>${c.title}</h1><p>${c.formalIntro}</p><button class="experiment-primary" type="button" data-emotion-formal>${c.formalStart}</button></section></div>`;
    }

    function showResults() {
      const summary = window.EmotionGoNoGoTask.summarizeEmotionGoNoGoTrials(results);
      container.innerHTML = buildEmotionResultsMarkup(lang, summary, prediction);
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
      trials = window.EmotionGoNoGoTask.createEmotionGoNoGoTrials(activeBlock(), nextPhase === 'practice' ? { go: 6, nogo: 3 } : { go: 12, nogo: 6 });
      container.innerHTML = buildEmotionGoNoGoTaskShellMarkup(lang, {
        phase,
        trialCount: trials.length,
        rule: activeBlock().rule,
        goIdentity: activeBlock().goIdentity,
        noGoIdentity: activeBlock().noGoIdentity
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

  return { buildEmotionGoNoGoIntroMarkup, buildEmotionGoNoGoTaskShellMarkup, buildEmotionResultsMarkup, renderEmotionGoNoGo, cleanup };
});
