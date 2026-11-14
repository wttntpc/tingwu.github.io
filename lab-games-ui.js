(function exposeLabGamesUI(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LabGamesUI = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createLabGamesUIApi() {
  const dep = (name, file) => (typeof require === 'function' ? require(file) : globalThis[name]);
  const Face = () => dep('FaceImages', './face-images.js');
  const FaceTask = () => dep('FaceJudgmentTask', './face-judgment-task.js');
  const StopTask = () => dep('StopSignalTask', './stop-signal-task.js');

  let timers = [];
  let teardown = null;

  const copy = {
    zh: {
      back: '← 返回互動實驗室', practice: '練習', formal: '正式測驗', progress: '進度',
      privacy: '所有反應只在你的瀏覽器中計算，不會上傳、儲存或加入任何研究資料庫。這是科普示範，不是研究作業，也不是心理或醫療評估。',
      faceStimuli: '臉孔是 AI 生成的虛構人物影像，不對應任何真人。「難過 → 中性 → 開心」之間的中間格是兩張生成影像的混合步數，不是經過評定的情緒強度；這些影像未經驗證，不是研究用刺激。',
      face: {
        eyebrow: 'Interpretation · 03', title: '模糊的臉，你會看成開心還是難過？',
        lead: '真實生活中的表情常常不是「很明顯的開心」或「很明顯的難過」，而是介於兩者之間。這個小作業讓你判斷一系列由難過漸變到開心的臉，畫出你的「判斷曲線」。',
        guideTitle: '作業怎麼進行', guideLead: '每次一張臉，你只需要選「開心」或「難過」。',
        steps: [['1', '看中央十字', '每次先看「＋」，臉孔出現後立刻判斷，不用想太久。'], ['2', '二選一', '電腦：← 是難過、→ 是開心；手機：點下方按鈕。'], ['3', '看你的曲線', '9 種程度各出現 4 次共 36 題；最後看你的答案在哪個位置從「難過」翻到「開心」。']],
        predict: '先預測', question: '你覺得自己的「分界點」會落在哪裡？',
        choices: [['early', '偏難過側：臉還有點難過就會答開心'], ['mid', '中間：大約在最模糊的那張'], ['late', '偏開心側：要很明顯開心才會答開心']],
        start: '開始練習', sad: '難過', happy: '開心', reminder: '請持續盯著中央「＋」，臉孔出現後立刻選擇。',
        hint: '電腦：← 難過 · → 開心　手機／平板：點下方按鈕',
        practiceDone: '練習完成', formalIntro: '接下來是 36 題正式測驗，臉孔會從很難過到很開心隨機出現，沒有標準答案，憑第一印象回答即可。', formalStart: '開始正式測驗',
        correct: '正確', incorrect: '再看一次：這張比較像另一個表情', timeout: '太慢了，請在臉孔出現後立刻選擇',
        resultTitle: '你的判斷曲線', resultLead: '橫軸是臉部表情從難過到開心的程度，縱軸是你回答「開心」的比例。曲線翻過 50% 的位置，就是你的分界點。',
        pseLabel: '分界點（50% 回答開心）', slopeLabel: '曲線陡度', slopeNote: '越陡，代表你的判斷越乾脆',
        axisX: '臉部表情（0% = 最難過，100% = 最開心）', axisY: '回答「開心」的比例',
        prediction: '你的預測', predictionLabels: { early: '偏難過側', mid: '中間', late: '偏開心側', unsure: '未選擇' },
        noPse: '這次資料沒有讓曲線在 0%–100% 的範圍內跨過 50%，所以無法估計分界點。可能是你幾乎一律回答同一個答案，或題數不夠；再做一次看看。',
        method: { logistic: '以羅吉斯曲線（maximum likelihood）擬合', interpolation: '你的回答非常乾脆（幾乎沒有中間地帶），曲線無法擬合，因此用相鄰兩點內插求 50% 位置，陡度不估計', 'out-of-range': '曲線沒有在範圍內跨過 50%', none: '' },
        clearAcc: '明顯開心／難過臉的正確率', timeouts: '超時題數',
        limitsTitle: '如何解讀', limits: ['分界點較低，表示臉孔還偏難過時你就已經開始回答「開心」；較高則相反。這只是這一次、這組 AI 生成臉孔的結果，不是固定特質。', '臉孔是在影像上等距混合的，但人感受到的情緒強度不一定等距，所以曲線的形狀只能當作示範。', '研究文獻會用經過驗證的臉孔材料、更多題數與較大的樣本，並把這種分界點當成「情緒知覺偏誤」的一個指標，而非診斷工具。'],
        sourceTitle: '延伸閱讀', source: 'Penton-Voak、Munafò 與 Looi（2017）：情緒臉孔知覺偏誤與心理健康的回顧', doi: 'https://doi.org/10.1177/0963721417704405',
        retry: '再做一次'
      },
      stop: {
        eyebrow: 'Inhibition · 04', title: '看到「停」的訊號，你還煞得住嗎？',
        lead: '這是停止訊號作業：大多數時候要依箭頭方向快速按鍵，偶爾出現停止訊號就要立刻忍住不按。作業會依你的表現自動調整訊號出現的時間，最後估計你「停下一個動作需要多久」。',
        guideTitle: '作業怎麼進行', guideLead: '臉孔下方有一個箭頭，臉孔本身與你的任務無關，只是背景。',
        steps: [['1', '看箭頭按鍵', '電腦：← 或 →；手機：點左右按鈕。越快越好，但要按對方向。'], ['2', '紅圈出現就停', '約四分之一的題目，臉孔外圍會出現紅圈。看到紅圈就不要按。'], ['3', '不要刻意等待', '不要為了「怕被停」而故意放慢；請照平常速度回答，系統會自動調整難度。']],
        predict: '先預測', question: '紅圈出現後，哪一種臉孔旁比較容易失敗（還是按了）？',
        choices: [['happy', '開心臉'], ['sad', '難過臉'], ['same', '差不多']],
        start: '開始練習', left: '左', right: '右', happy: '開心臉', sad: '難過臉',
        reminder: '看箭頭按鍵；紅圈出現時，請忍住不按。', hint: '電腦：← / → 鍵　手機／平板：點下方左右按鈕',
        practiceDone: '練習完成', formalIntro: '正式測驗共 64 題，約 4 分鐘；其中 16 題會出現紅圈。不要刻意放慢，照平常速度反應。', formalStart: '開始正式測驗',
        correct: '正確', wrong: '方向錯了', slow: '太慢了', stopOk: '成功停住', stopFail: '紅圈出現後還是按了，這很正常',
        resultTitle: '你的停止速度', resultLead: '停止訊號反應時間（SSRT）是用整合法估計的「你需要多久才能停下一個已經準備好的動作」，並不是直接量到的。',
        ssrt: '停止訊號反應時間（SSRT）', pRespond: '紅圈出現後仍按鍵的比例', meanSsd: '平均紅圈延遲', goRt: '一般題中位反應時間',
        noSsrt: '無法估計', prediction: '你的預測', predictionLabels: { happy: '開心臉較難停', sad: '難過臉較難停', same: '差不多', unsure: '未選擇' },
        tableTitle: '依表情分開看（僅供描述）', emotion: '臉孔', stopCount: '停止題數', omission: '一般題漏答率',
        perEmotionNote: '每種表情只有 8 題停止題，樣本太少，不能用來估計各自的 SSRT，也不適合下「某種表情較難停」的結論。',
        warnRate: '紅圈後仍按鍵的比例不在 25%–75% 之間，這次的 SSRT 可能不準。常見原因是故意等紅圈、或反應太亂；請照平常速度再做一次。',
        warnRace: '平均而言，沒停住的反應並沒有比一般反應快，這違反了估計方法的前提，SSRT 只能當作粗略參考。',
        limitsTitle: '如何解讀', limits: ['SSRT 是模型估計值，不是直接量到的時間；它依賴「停止」與「前進」兩個過程賽跑的假設。', '你的結果只代表這一次、這個簡短版本。正式研究的題數更多，並檢查前提是否成立後才解讀。', '這裡的臉孔是 AI 生成的虛構人物，目的在示範「情緒背景」這種實驗設計，不是用來判斷你的情緒或能力。'],
        sourceTitle: '延伸閱讀', source: 'Verbruggen 等人（2019）：停止訊號作業的共識指南', doi: 'https://doi.org/10.7554/eLife.46323',
        retry: '再做一次'
      }
    },
    en: {
      back: '← Back to the interactive lab', practice: 'Practice', formal: 'Test', progress: 'Progress',
      privacy: 'All responses are calculated in this browser and are not uploaded, stored, or added to any research database. This is a science-communication demonstration, not a research task or a psychological or medical assessment.',
      faceStimuli: 'The faces are AI-generated images of fictional people and depict no real person. The steps between sad, neutral and happy are blends of generated images, not rated emotional intensities, and the images have not been validated, so they are not research stimuli.',
      face: {
        eyebrow: 'Interpretation · 03', title: 'Do you read an ambiguous face as happy or sad?',
        lead: 'Real expressions are often not clearly happy or clearly sad but somewhere in between. In this short task you judge faces that shift step by step from sad to happy, and we draw your judgment curve.',
        guideTitle: 'How it works', guideLead: 'One face at a time; you only choose “happy” or “sad”.',
        steps: [['1', 'Look at the cross', 'Watch the “+”, then judge the face as soon as it appears—no need to deliberate.'], ['2', 'Two choices', 'Computer: ← sad, → happy. Phone: tap a button below.'], ['3', 'See your curve', 'Nine levels appear four times each (36 trials). The result shows where your answers flip from sad to happy.']],
        predict: 'Predict first', question: 'Where do you think your “balance point” will fall?',
        choices: [['early', 'Toward the sad side: I say happy even if a face is still a little sad'], ['mid', 'In the middle: around the most ambiguous face'], ['late', 'Toward the happy side: a face must look clearly happy before I say happy']],
        start: 'Start practice', sad: 'Sad', happy: 'Happy', reminder: 'Keep looking at the central “+” and choose as soon as the face appears.',
        hint: 'Computer: ← sad · → happy   Phone/tablet: tap the buttons below',
        practiceDone: 'Practice complete', formalIntro: 'The test has 36 trials. Faces from very sad to very happy appear in random order; there is no right answer, so go with your first impression.', formalStart: 'Start the test',
        correct: 'Correct', incorrect: 'Look again: this face resembles the other expression', timeout: 'Too slow—please choose as soon as the face appears',
        resultTitle: 'Your judgment curve', resultLead: 'The horizontal axis is how sad-to-happy the face is; the vertical axis is how often you answered “happy”. Where the curve crosses 50% is your balance point.',
        pseLabel: 'Balance point (50% answer “happy”)', slopeLabel: 'Curve steepness', slopeNote: 'Steeper means a more decisive switch',
        axisX: 'Face (0% = saddest, 100% = happiest)', axisY: 'Proportion answering “happy”',
        prediction: 'Your prediction', predictionLabels: { early: 'Toward the sad side', mid: 'In the middle', late: 'Toward the happy side', unsure: 'No prediction selected' },
        noPse: 'In this session the curve did not cross 50% within the 0–100% range, so no balance point can be estimated. You may have given almost the same answer every time, or there were too few trials; try again.',
        method: { logistic: 'Fitted with a logistic curve (maximum likelihood)', interpolation: 'Your answers switched almost abruptly (hardly any middle ground), so no curve could be fitted; the 50% point was interpolated between neighbouring levels and the steepness is not estimated', 'out-of-range': 'The curve did not cross 50% within the range', none: '' },
        clearAcc: 'Accuracy on clearly happy/sad faces', timeouts: 'Timed-out trials',
        limitsTitle: 'How to read this', limits: ['A lower balance point means you began answering “happy” while the face still leaned sad; a higher one means the opposite. It reflects this session and this set of AI-generated faces, not a fixed trait.', 'The faces are blended in equal image steps, but perceived emotion does not necessarily change in equal steps, so the shape of the curve is only illustrative.', 'Research uses validated face sets, many more trials, and larger samples, and treats this kind of balance point as one index of emotion-perception bias, not as a diagnostic tool.'],
        sourceTitle: 'Further reading', source: 'Penton-Voak, Munafò, & Looi (2017): review of biased facial-emotion perception and mental health', doi: 'https://doi.org/10.1177/0963721417704405',
        retry: 'Try again'
      },
      stop: {
        eyebrow: 'Inhibition · 04', title: 'Can you still stop when the “stop” signal appears?',
        lead: 'In the stop-signal task you usually press a key for an arrow as fast as you can, but on some trials a stop signal tells you to hold back. The task adapts when the signal appears and estimates how long you need to stop an action.',
        guideTitle: 'How it works', guideLead: 'An arrow sits below a face. The face is just background and is irrelevant to your task.',
        steps: [['1', 'Press for the arrow', 'Computer: ← or →. Phone: tap the left or right button. Be fast, but press the correct direction.'], ['2', 'Red ring means stop', 'On about one trial in four a red ring appears around the face. When you see it, do not press.'], ['3', 'Do not wait on purpose', 'Do not slow down in fear of a stop signal. Respond at your normal speed; the task adjusts its difficulty automatically.']],
        predict: 'Predict first', question: 'After the red ring appears, next to which faces will you fail to stop more often?',
        choices: [['happy', 'Happy faces'], ['sad', 'Sad faces'], ['same', 'About the same']],
        start: 'Start practice', left: 'Left', right: 'Right', happy: 'Happy face', sad: 'Sad face',
        reminder: 'Press for the arrow; hold back when the red ring appears.', hint: 'Computer: ← / → keys   Phone/tablet: tap the left or right button below',
        practiceDone: 'Practice complete', formalIntro: 'The test has 64 trials and takes about four minutes; 16 of them show the red ring. Do not slow down on purpose—respond at your normal speed.', formalStart: 'Start the test',
        correct: 'Correct', wrong: 'Wrong direction', slow: 'Too slow', stopOk: 'Stopped successfully', stopFail: 'You pressed after the ring appeared—this is normal',
        resultTitle: 'Your stopping speed', resultLead: 'The stop-signal reaction time (SSRT) is estimated with the integration method: how long you need to stop an action that is already prepared. It is not measured directly.',
        ssrt: 'Stop-signal reaction time (SSRT)', pRespond: 'Responses after the red ring', meanSsd: 'Mean ring delay', goRt: 'Median go reaction time',
        noSsrt: 'Cannot be estimated', prediction: 'Your prediction', predictionLabels: { happy: 'Harder to stop with happy faces', sad: 'Harder to stop with sad faces', same: 'About the same', unsure: 'No prediction selected' },
        tableTitle: 'By expression (descriptive only)', emotion: 'Face', stopCount: 'Stop trials', omission: 'Go omission rate',
        perEmotionNote: 'Each expression has only 8 stop trials, which is too few to estimate separate SSRTs or to conclude that one expression is harder to stop.',
        warnRate: 'The share of responses after the red ring is outside 25–75%, so this SSRT may be inaccurate. Common causes are waiting for the ring on purpose or erratic responding; try again at your normal speed.',
        warnRace: 'On average, failed stops were not faster than ordinary go responses. This breaks an assumption of the method, so treat the SSRT as a rough guide only.',
        limitsTitle: 'How to read this', limits: ['SSRT is a model-based estimate, not a directly measured time; it assumes that “go” and “stop” processes race each other.', 'Your result describes this one short session. Formal studies use more trials and check the assumptions before interpreting an estimate.', 'The faces are AI-generated images of fictional people that demonstrate an emotional-background design; they are not used to judge your emotions or abilities.'],
        sourceTitle: 'Further reading', source: 'Verbruggen et al. (2019): consensus guide to the stop-signal task', doi: 'https://doi.org/10.7554/eLife.46323',
        retry: 'Try again'
      }
    }
  };

  const e = text => String(text).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const ms = value => (value === null || value === undefined || !Number.isFinite(value) ? '—' : `${Math.round(value)} ms`);
  const pct = value => (value === null || value === undefined ? '—' : `${Math.round(value * 100)}%`);

  function clearTimers() { timers.forEach(timer => clearTimeout(timer)); timers = []; }
  function later(callback, delay) { const timer = setTimeout(callback, delay); timers.push(timer); return timer; }
  function cleanup() { clearTimers(); if (teardown) teardown(); teardown = null; }

  function introShell(c, g, namespace, lang, withExtra = '') {
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="experiment-header"><p class="eyebrow">${g.eyebrow}</p><h1>${g.title}</h1><p>${g.lead}</p></header>
      <section class="posner-guide" aria-labelledby="${namespace}-guide-title"><p class="section-kicker">01 · ${g.guideTitle}</p><h2 id="${namespace}-guide-title">${g.guideLead}</h2><ol>${g.steps.map(step => `<li><span>${step[0]}</span><div><strong>${step[1]}</strong><p>${step[2]}</p></div></li>`).join('')}</ol></section>
      ${withExtra}
      <section class="experiment-prediction" aria-labelledby="${namespace}-prediction-title"><p class="section-kicker">02 · ${g.predict}</p><h2 id="${namespace}-prediction-title">${g.question}</h2><div class="prediction-options">${g.choices.map(choice => `<label><input type="radio" name="${namespace}-prediction" value="${choice[0]}"><span>${choice[1]}</span></label>`).join('')}</div></section>
      <aside class="experiment-privacy"><strong>${lang === 'zh' ? '資料隱私' : 'Data privacy'}</strong><p>${c.privacy}</p><p>${c.faceStimuli}</p></aside>
      <button class="experiment-primary" type="button" data-${namespace}-start>${g.start}</button></div>`;
  }

  function buildFaceIntroMarkup(lang = 'zh') {
    const c = copy[lang] || copy.zh;
    const strip = FaceTask().LEVELS.filter((_, index) => index % 2 === 0).map((level, index) => `<span class="face-strip-item">${Face().faceHtml(level, { identity: Face().IDENTITIES[index % Face().IDENTITIES.length] })}</span>`).join('');
    return introShell(c, c.face, 'face', lang, `<div class="face-strip" aria-hidden="true">${strip}</div>`);
  }

  function buildStopIntroMarkup(lang = 'zh') {
    const c = copy[lang] || copy.zh;
    const demo = `<div class="face-strip" aria-hidden="true"><span class="face-strip-item">${Face().faceHtml(1, { identity: 'a' })}<b class="stop-arrow">→</b></span><span class="face-strip-item">${Face().faceHtml(0, { identity: 'b', ring: true })}<b class="stop-arrow">←</b></span></div>`;
    return introShell(c, c.stop, 'stop', lang, demo);
  }

  function taskShell(c, g, namespace, lang, phase, total, stageClass, controls) {
    return `<div class="page-shell experiment-page experiment-running"><a class="back-link" href="#/lab">${c.back}</a><header class="task-status"><div><p class="eyebrow">${phase === 'practice' ? c.practice : c.formal}</p><h1>${g.title}</h1></div><p><span>${c.progress}</span> <strong data-${namespace}-progress>0 / ${total}</strong></p></header><p class="task-fixation-reminder">${g.reminder}</p><div class="posner-stage ${stageClass}" data-${namespace}-stage aria-live="polite"><span class="posner-fixation" aria-hidden="true">+</span></div><div class="posner-response-controls face-controls">${controls}</div><p class="task-hint">${g.hint}</p></div>`;
  }

  function transition(c, g, lang, intro, button, attribute) {
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><section class="experiment-transition"><p class="eyebrow">${g.practiceDone}</p><h1>${g.title}</h1><p>${intro}</p><button class="experiment-primary" type="button" ${attribute}>${button}</button></section></div>`;
  }

  function curveSvg(summary, g) {
    const W = 380; const H = 250; const left = 52; const right = 14; const top = 14; const bottom = 54;
    const x = level => left + level * (W - left - right);
    const y = proportion => top + (1 - proportion) * (H - top - bottom);
    const ticksX = [0, 0.25, 0.5, 0.75, 1].map(value => `<line x1="${x(value)}" y1="${H - bottom}" x2="${x(value)}" y2="${H - bottom + 4}" class="curve-axis"/><text x="${x(value)}" y="${H - bottom + 16}" text-anchor="middle" class="curve-tick">${Math.round(value * 100)}%</text>`).join('');
    const ticksY = [0, 0.5, 1].map(value => `<line x1="${left - 4}" y1="${y(value)}" x2="${left}" y2="${y(value)}" class="curve-axis"/><text x="${left - 8}" y="${y(value) + 3}" text-anchor="end" class="curve-tick">${Math.round(value * 100)}%</text>`).join('');
    const half = `<line x1="${left}" y1="${y(0.5)}" x2="${W - right}" y2="${y(0.5)}" class="curve-half"/>`;
    let fitted = '';
    if (summary.method === 'logistic' && summary.fit) {
      const pts = Array.from({ length: 41 }, (_, i) => { const level = i / 40; return `${x(level).toFixed(1)},${y(FaceTask().predictLogistic(summary.fit, level)).toFixed(1)}`; }).join(' ');
      fitted = `<polyline points="${pts}" class="curve-fit" fill="none"/>`;
    }
    const pse = summary.pse !== null ? `<line x1="${x(summary.pse)}" y1="${top}" x2="${x(summary.pse)}" y2="${H - bottom}" class="curve-pse"/>` : '';
    const dots = summary.rows.filter(row => row.n > 0).map(row => `<circle cx="${x(row.level)}" cy="${y(row.proportionHappy)}" r="${3 + Math.min(row.n, 6) * 0.6}" class="curve-dot"><title>${Math.round(row.level * 100)}%: ${row.happy}/${row.n}</title></circle>`).join('');
    return `<svg class="curve-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${e(g.resultTitle)}"><line x1="${left}" y1="${top}" x2="${left}" y2="${H - bottom}" class="curve-axis"/><line x1="${left}" y1="${H - bottom}" x2="${W - right}" y2="${H - bottom}" class="curve-axis"/>${half}${ticksX}${ticksY}${fitted}${pse}${dots}<text x="${(left + W - right) / 2}" y="${H - 8}" text-anchor="middle" class="curve-label">${e(g.axisX)}</text><text transform="translate(12 ${(top + H - bottom) / 2}) rotate(-90)" text-anchor="middle" class="curve-label">${e(g.axisY)}</text></svg>`;
  }

  function buildFaceResultsMarkup(lang = 'zh', summary, prediction = 'unsure') {
    const c = copy[lang] || copy.zh; const g = c.face;
    const pseText = summary.pse === null ? '—' : `${Math.round(summary.pse * 100)}%`;
    const slopePoints = summary.slope === null ? null : Math.round(summary.slope / 40 * 100);
    const slopeText = slopePoints === null ? '—' : (lang === 'zh' ? `${slopePoints} 個百分點` : `${slopePoints} percentage points`);
    const slopeUnit = lang === 'zh' ? '在分界點附近，表情每變 10%，回答「開心」的機率約改變這麼多' : 'Near the balance point, the chance of answering “happy” changes by about this much for every 10% change in expression';
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="result-header"><p class="eyebrow">Result</p><h1>${g.resultTitle}</h1><p>${g.resultLead}</p></header>
      <section class="result-summary" aria-labelledby="pse-title"><div><span>${g.pseLabel}</span><strong id="pse-title">${pseText}</strong><small>${summary.pse === null ? '' : e(g.method[summary.method] || '')}</small></div><p>${summary.pse === null ? g.noPse : ''}</p></section>
      <figure class="curve-figure">${curveSvg(summary, g)}<figcaption>${lang === 'zh' ? '點的大小代表該程度的題數；實線是擬合曲線，虛線標出 50% 與分界點。' : 'Dot size reflects the number of trials at each level; the solid line is the fitted curve, and dashed lines mark 50% and the balance point.'}</figcaption></figure>
      <dl class="result-notes"><div><dt>${g.slopeLabel}</dt><dd>${slopeText === '—' ? '—' : slopeText}<br><small>${slopePoints === null ? '' : `${slopeUnit}. `}${g.slopeNote}</small></dd></div><div><dt>${g.prediction}</dt><dd>${g.predictionLabels[prediction] || g.predictionLabels.unsure}</dd></div><div><dt>${g.clearAcc}</dt><dd>${pct(summary.clearAccuracy)}</dd></div><div><dt>${g.timeouts}</dt><dd>${summary.timeoutCount} / ${summary.totalCount}</dd></div><div><dt>${lang === 'zh' ? '中位反應時間' : 'Median response time'}</dt><dd>${ms(summary.medianRt)}</dd></div></dl>
      <section class="result-limits"><h2>${g.limitsTitle}</h2><ul>${g.limits.map(item => `<li>${item}</li>`).join('')}</ul></section>
      <div class="result-sources"><a href="${g.doi}" target="_blank" rel="noopener noreferrer">${g.sourceTitle}：${g.source} ↗</a></div>
      <button class="experiment-primary" type="button" data-face-retry>${g.retry}</button></div>`;
  }

  function buildStopResultsMarkup(lang = 'zh', summary, prediction = 'unsure') {
    const c = copy[lang] || copy.zh; const g = c.stop;
    const rows = StopTask().EMOTIONS.map(emotion => { const row = summary.byEmotion[emotion]; return `<tr><th scope="row">${g[emotion]}</th><td>${ms(row.goMedianRt)}</td><td>${pct(row.omissionRate)}</td><td>${pct(row.pRespondGivenSignal)}</td><td>${row.stopCount}</td></tr>`; }).join('');
    const warnings = [];
    if (summary.ssrt !== null && !summary.pRespondValid) warnings.push(g.warnRate);
    if (summary.ssrt !== null && summary.raceModelHolds === false) warnings.push(g.warnRace);
    if (summary.ssrt === null) warnings.push(g.warnRate);
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="result-header"><p class="eyebrow">Result</p><h1>${g.resultTitle}</h1><p>${g.resultLead}</p></header>
      <section class="result-summary" aria-labelledby="ssrt-title"><div><span>${g.ssrt}</span><strong id="ssrt-title">${summary.ssrt === null ? g.noSsrt : ms(summary.ssrt)}</strong><small>${lang === 'zh' ? '整合法：第 n 個一般反應時間 − 平均紅圈延遲' : 'Integration method: nth go reaction time − mean ring delay'}</small></div><p>${warnings.map(item => `<span class="result-warning">${item}</span>`).join(' ')}</p></section>
      <dl class="result-notes"><div><dt>${g.pRespond}</dt><dd>${pct(summary.pRespond)}</dd></div><div><dt>${g.meanSsd}</dt><dd>${ms(summary.meanSsd)}</dd></div><div><dt>${g.goRt}</dt><dd>${ms(summary.goMedianRt)}</dd></div><div><dt>${g.prediction}</dt><dd>${g.predictionLabels[prediction] || g.predictionLabels.unsure}</dd></div></dl>
      <section class="result-table-wrap"><h2 class="result-subtitle">${g.tableTitle}</h2><table><thead><tr><th>${g.emotion}</th><th>${g.goRt}</th><th>${g.omission}</th><th>${g.pRespond}</th><th>${g.stopCount}</th></tr></thead><tbody>${rows}</tbody></table><p class="result-footnote">${g.perEmotionNote}</p></section>
      <section class="result-limits"><h2>${g.limitsTitle}</h2><ul>${g.limits.map(item => `<li>${item}</li>`).join('')}</ul></section>
      <div class="result-sources"><a href="${g.doi}" target="_blank" rel="noopener noreferrer">${g.sourceTitle}：${g.source} ↗</a></div>
      <button class="experiment-primary" type="button" data-stop-retry>${g.retry}</button></div>`;
  }

  function renderFaceJudgment(container, lang = 'zh') {
    cleanup();
    const c = copy[lang] || copy.zh; const g = c.face;
    container.innerHTML = buildFaceIntroMarkup(lang);
    Face().preload();
    let prediction = 'unsure'; let phase = 'practice'; let trials = []; let index = 0; let active = null; let onset = 0;
    const controls = `<button type="button" data-face-response="sad" disabled>← ${g.sad}</button><button type="button" data-face-response="happy" disabled>${g.happy} →</button>`;

    function setControls(disabled) { container.querySelectorAll('[data-face-response]').forEach(button => { button.disabled = disabled; }); }

    function finish(response) {
      if (!active) return;
      clearTimers();
      const trial = active; active = null; setControls(true);
      trial.response = response; trial.rt = response ? Math.round(performance.now() - onset) : null;
      const stage = container.querySelector('[data-face-stage]');
      if (phase === 'practice' && stage) {
        const clearHappy = trial.level > 0.5;
        const ok = response === (clearHappy ? 'happy' : 'sad');
        stage.innerHTML = `<p class="trial-feedback ${ok ? 'is-correct' : 'is-incorrect'}">${response ? (ok ? g.correct : g.incorrect) : g.timeout}</p>`;
      }
      later(next, phase === 'practice' ? 700 : 260);
    }

    function show(trial) {
      const stage = container.querySelector('[data-face-stage]');
      if (!stage) return;
      stage.innerHTML = `<span class="posner-fixation" aria-hidden="true">+</span>`;
      later(() => {
        stage.innerHTML = Face().faceHtml(trial.level, { identity: trial.identity, label: lang === 'zh' ? '一張 AI 生成的虛構臉孔' : 'An AI-generated fictional face' });
        active = trial; onset = performance.now(); setControls(false);
        later(() => finish(null), 4000);
      }, 500);
    }

    function next() {
      if (index >= trials.length) {
        if (phase === 'practice') container.innerHTML = transition(c, g, lang, g.formalIntro, g.formalStart, 'data-face-formal');
        else container.innerHTML = buildFaceResultsMarkup(lang, FaceTask().summarizeTrials(trials), prediction);
        return;
      }
      const progress = container.querySelector('[data-face-progress]');
      if (progress) progress.textContent = `${index + 1} / ${trials.length}`;
      show(trials[index++]);
    }

    function start(nextPhase) {
      phase = nextPhase; index = 0;
      trials = nextPhase === 'practice' ? FaceTask().createPracticeTrials() : FaceTask().createTrials({ repeats: 4 });
      container.innerHTML = taskShell(c, g, 'face', lang, phase, trials.length, 'face-stage', controls);
      later(next, 600);
    }

    function onClick(event) {
      if (event.target.closest('[data-face-start]')) { prediction = container.querySelector('input[name="face-prediction"]:checked')?.value || 'unsure'; start('practice'); return; }
      if (event.target.closest('[data-face-formal]')) { start('formal'); return; }
      if (event.target.closest('[data-face-retry]')) { renderFaceJudgment(container, lang); return; }
      const button = event.target.closest('[data-face-response]');
      if (button) finish(button.dataset.faceResponse);
    }
    function onKeydown(event) {
      if (!active) return;
      if (event.code === 'ArrowLeft') { event.preventDefault(); finish('sad'); }
      if (event.code === 'ArrowRight') { event.preventDefault(); finish('happy'); }
    }
    container.addEventListener('click', onClick); window.addEventListener('keydown', onKeydown);
    teardown = () => { container.removeEventListener('click', onClick); window.removeEventListener('keydown', onKeydown); active = null; };
  }

  function renderStopSignal(container, lang = 'zh') {
    cleanup();
    const c = copy[lang] || copy.zh; const g = c.stop; const limits = StopTask().DEFAULT_LIMITS;
    container.innerHTML = buildStopIntroMarkup(lang);
    Face().preload();
    let prediction = 'unsure'; let phase = 'practice'; let trials = []; let index = 0; let active = null; let onset = 0; let stairs = null; let results = [];
    const controls = `<button type="button" data-stop-response="left" disabled>← ${g.left}</button><button type="button" data-stop-response="right" disabled>${g.right} →</button>`;
    const setControls = disabled => container.querySelectorAll('[data-stop-response]').forEach(button => { button.disabled = disabled; });

    function finish(key) {
      if (!active) return;
      clearTimers();
      const trial = active; active = null; setControls(true);
      const responded = Boolean(key);
      const record = { ...trial.spec, responded, rt: responded ? Math.round(performance.now() - onset) : null, correct: responded && key === trial.spec.arrow, ssd: trial.ssd, ringShown: trial.ringShown };
      results.push(record);
      if (trial.spec.type === 'stop') stairs[trial.spec.emotion].update(!responded);
      const stage = container.querySelector('[data-stop-stage]');
      if (phase === 'practice' && stage) {
        let message; let ok;
        if (trial.spec.type === 'stop') { ok = !responded; message = ok ? g.stopOk : g.stopFail; }
        else if (!responded) { ok = false; message = g.slow; } else { ok = record.correct; message = ok ? g.correct : g.wrong; }
        stage.innerHTML = `<p class="trial-feedback ${ok ? 'is-correct' : 'is-incorrect'}">${message}</p>`;
      }
      later(next, phase === 'practice' ? 800 : 350);
    }

    function show(spec) {
      const stage = container.querySelector('[data-stop-stage]');
      if (!stage) return;
      stage.innerHTML = `<span class="posner-fixation" aria-hidden="true">+</span>`;
      later(() => {
        const ssd = spec.type === 'stop' ? stairs[spec.emotion].ssd : null;
        const arrow = spec.arrow === 'left' ? '←' : '→';
        const label = lang === 'zh' ? `${g[spec.emotion]}，箭頭向${spec.arrow === 'left' ? '左' : '右'}` : `${g[spec.emotion]}, arrow pointing ${spec.arrow}`;
        const draw = ring => `<div class="stop-trial" role="img" aria-label="${e(label)}${ring ? (lang === 'zh' ? '，出現紅圈' : ', red ring shown') : ''}">${Face().faceHtml(spec.emotion === 'happy' ? 1 : 0, { identity: spec.identity, ring })}<b class="stop-arrow">${arrow}</b></div>`;
        stage.innerHTML = draw(false);
        const trial = { spec, ssd, ringShown: false };
        active = trial; onset = performance.now(); setControls(false);
        if (spec.type === 'stop') later(() => { if (active === trial) { trial.ringShown = true; stage.innerHTML = draw(true); } }, ssd);
        later(() => finish(null), limits.maxRt);
      }, 500);
    }

    function next() {
      if (index >= trials.length) {
        if (phase === 'practice') container.innerHTML = transition(c, g, lang, g.formalIntro, g.formalStart, 'data-stop-formal');
        else container.innerHTML = buildStopResultsMarkup(lang, StopTask().summarizeTrials(results), prediction);
        return;
      }
      const progress = container.querySelector('[data-stop-progress]');
      if (progress) progress.textContent = `${index + 1} / ${trials.length}`;
      show(trials[index++]);
    }

    function start(nextPhase) {
      phase = nextPhase; index = 0; results = [];
      stairs = { happy: StopTask().createStaircase(), sad: StopTask().createStaircase() };
      trials = nextPhase === 'practice' ? StopTask().createTrials({ goPerEmotion: 3, stopPerEmotion: 1 }) : StopTask().createTrials({ goPerEmotion: 24, stopPerEmotion: 8 });
      container.innerHTML = taskShell(c, g, 'stop', lang, phase, trials.length, 'stop-stage', controls);
      later(next, 600);
    }

    function onClick(event) {
      if (event.target.closest('[data-stop-start]')) { prediction = container.querySelector('input[name="stop-prediction"]:checked')?.value || 'unsure'; start('practice'); return; }
      if (event.target.closest('[data-stop-formal]')) { start('formal'); return; }
      if (event.target.closest('[data-stop-retry]')) { renderStopSignal(container, lang); return; }
      const button = event.target.closest('[data-stop-response]');
      if (button) finish(button.dataset.stopResponse);
    }
    function onKeydown(event) {
      if (!active) return;
      if (event.code === 'ArrowLeft') { event.preventDefault(); finish('left'); }
      if (event.code === 'ArrowRight') { event.preventDefault(); finish('right'); }
    }
    container.addEventListener('click', onClick); window.addEventListener('keydown', onKeydown);
    teardown = () => { container.removeEventListener('click', onClick); window.removeEventListener('keydown', onKeydown); active = null; };
  }

  return { copy, buildFaceIntroMarkup, buildFaceResultsMarkup, buildStopIntroMarkup, buildStopResultsMarkup, renderFaceJudgment, renderStopSignal, cleanup };
});
