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
        eyebrow: 'Inhibition · 04', title: '看到紅框，你還煞得住嗎？',
        lead: '這是「情緒選擇性停止訊號作業」：每次看到一張臉，你要立刻用對應的手判斷它是開心還是難過；有些題目臉孔外圍會突然冒出紅框（要停住）或綠框（照常按）。作業會依你的表現自動調整紅框出現的時間，最後估計你「停下一個動作需要多久」。',
        guideTitle: '作業怎麼進行', guideLead: '臉孔的表情就是你要判斷的內容：開心按一邊、難過按另一邊。',
        steps: [['1', '看臉，馬上按鍵', '每題先看到「+」，再出現一張臉。開心與難過各對應一個按鍵（電腦：← / →；手機：點下方左右按鈕）。對應方式每次隨機決定，開始前會顯示。'], ['2', '紅框＝停住，綠框＝照常按', '約一半的題目沒有外框；四分之一的題目在臉出現一會兒後冒出紅框，請不要按；另外四分之一冒出綠框，照常按。'], ['3', '不要等框，照常快速判斷', '不要為了「怕被停」而故意放慢。紅框後大約一半停得住是正常的，系統會自動調整難度。']],
        keyMapLabel: '按鍵對應', happyWord: '開心', sadWord: '難過', captionNone: '沒有框：按對應的鍵', captionStop: '紅框：不要按', captionCont: '綠框：照常按',
        predict: '先預測', question: '紅框出現後，哪一種表情比較容易沒停住（還是按了）？',
        choices: [['happy', '開心臉'], ['sad', '難過臉'], ['same', '差不多']],
        start: '開始練習', left: '左', right: '右', happy: '開心臉', sad: '難過臉',
        reminder: '看臉，用對應的鍵判斷開心或難過；紅框出現時請不要按，綠框照常按。', hint: '電腦：← / → 鍵　手機／平板：點下方左右按鈕',
        stages: {
          practice_go: { kicker: '練習 1', title: '快速判斷表情', body: '臉一出現就要馬上按，不用等任何訊號。請又快又準，每題會告訴你對錯。', button: '開始練習' },
          practice_signal: { kicker: '練習 2', title: '加入外框變色', body: '現在有些題目臉孔外圍會冒出外框。紅框：不要按。綠框：照常按。外框是在臉出現後才變色，不要等它，照常快速判斷。每題會告訴你對錯。', button: '開始練習' },
          baseline: { kicker: '第一部分', title: '判斷表情（沒有外框）', body: '這一段沒有外框，請又快又準。系統會用這一段的反應速度來設定紅框的起始時間。', button: '開始' },
          calib: { kicker: '第二部分', title: '判斷表情；看到紅框就停', body: '從這裡開始，紅框與綠框都會出現。紅框出現的時間會隨你的表現自動調整，所以有時容易停、有時不容易；請不要故意放慢。如果太慢或沒反應，畫面會出現「請再快一點」。', button: '開始' },
          formal: { kicker: '第三部分', title: '正式測驗', body: '規則和上一段相同，共 {total} 題，其中 {stops} 題出現紅框。紅框的時間會分別為開心臉和難過臉自動調整。請照平常速度又快又準地判斷。', button: '開始正式測驗' }
        },
        statsTitle: '上一段', statsRt: '平均反應時間', statsOmit: '漏按', statsWrong: '按錯邊',
        fb: { correct: '正確', wrong: '按錯邊了', slow: '太慢了，請再快一點', contOk: '正確（綠框要照常按）', contMiss: '綠框要照常按喔', stopOk: '成功停住', stopFail: '紅框後還是按了，這很正常', faster: '請再快一點' },
        frameLabel: { stop: '，出現紅框，請停住', cont: '，出現綠框，照常按' },
        resultTitle: '你的停止速度', resultLead: '停止訊號反應時間（SSRT）是用整合法估計的「你需要多久才能停下一個已經準備好的動作」，並不是直接量到的。',
        ssrt: '停止訊號反應時間（SSRT）', pRespond: '紅框出現後仍按鍵的比例', meanSsd: '平均紅框延遲', goRt: '一般題中位反應時間', goAcc: '一般題判斷正確率',
        contRt: '綠框題平均反應時間', frameCost: '綠框題比一般題慢', frameCostNote: '綠框題需要照常按，但畫面有變化；慢多少反映了「看到外框」本身的干擾，用來和停止指令的效果區分。',
        noSsrt: '無法可靠估計', prediction: '你的預測', predictionLabels: { happy: '開心臉較難停', sad: '難過臉較難停', same: '差不多', unsure: '未選擇' },
        tableTitle: '依表情分開看（僅供描述）', emotion: '臉孔', stopCount: '停止題數', ssrtExplore: '探索性 SSRT', meanSsdShort: '平均紅框延遲',
        perEmotionNote: '每種表情只有 {perEmotion} 題停止題，樣本太少，各自的 SSRT 只能當作探索，不適合下「某種表情較難停」的結論。「—」表示該表情沒有通過前提檢查，所以不報告。',
        warnRate: '紅框後仍按鍵的比例不在 25%–75% 之間，這次的 SSRT 不可靠。常見原因是故意等紅框、或反應太亂；請照平常速度再做一次。',
        warnRace: '平均而言，沒停住的反應並沒有比一般反應快，這違反了估計方法的前提，所以不報告 SSRT。',
        warnExtreme: '紅框後全部都停住或全部都按了，無法用這個方法估計 SSRT。',
        limitsTitle: '如何解讀', limits: ['SSRT 是模型估計值，不是直接量到的時間；它依賴「停止」與「前進」兩個過程賽跑的假設，並要求紅框後仍按鍵的比例接近一半。', '你的結果只代表這一次、這個簡短版本。正式研究的題數多很多，並先檢查前提是否成立才解讀。', '這個作業中，判斷表情本身就是你的反應，所以臉孔的情緒內容和你的任務有關；結果不能直接推論到「情緒與任務無關」的情境。', '紅框代表停止、綠框代表照常按，這個對應是固定的，所以顏色的效果無法和停止指令分開。', '臉孔是 AI 生成的虛構人物，未經驗證；這個示範不是用來判斷你的情緒或能力。'],
        sourceTitle: '延伸閱讀', sources: [['Nguyen 等人（2021）：含「繼續」條件的停止訊號作業（EEG）', 'https://doi.org/10.3390/brainsci11040478'], ['Verbruggen 等人（2019）：停止訊號作業的共識指南', 'https://doi.org/10.7554/eLife.46323']],
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
        eyebrow: 'Inhibition · 04', title: 'Can you still stop when a red frame appears?',
        lead: 'This is an emotional selective stop-signal task. On every trial you see a face and judge at once, with the matching hand, whether it looks happy or sad. On some trials a coloured frame suddenly appears around the face: red means hold back, green means respond as usual. The task adapts when the red frame appears and then estimates how long you need to stop an action.',
        guideTitle: 'How it works', guideLead: 'The expression is what you judge: one key for happy and the other for sad.',
        steps: [['1', 'Look at the face and press', 'Each trial starts with a “+” and then a face appears. Happy and sad each have one key (computer: ← / →; phone: tap the left or right button). The assignment is chosen at random each time and shown before you start.'], ['2', 'Red frame means stop, green means go on', 'About half of the trials have no frame. On a quarter, a red frame appears a moment after the face: do not press. On another quarter a green frame appears: respond as usual.'], ['3', 'Do not wait for the frame', 'Do not slow down on purpose out of fear of being stopped. Failing to stop on about half of the red-frame trials is normal; the task adjusts its difficulty automatically.']],
        keyMapLabel: 'Key assignment', happyWord: 'Happy', sadWord: 'Sad', captionNone: 'No frame: press the matching key', captionStop: 'Red frame: do not press', captionCont: 'Green frame: respond as usual',
        predict: 'Predict first', question: 'After the red frame appears, next to which expression will you fail to stop more often?',
        choices: [['happy', 'Happy faces'], ['sad', 'Sad faces'], ['same', 'About the same']],
        start: 'Start practice', left: 'Left', right: 'Right', happy: 'Happy face', sad: 'Sad face',
        reminder: 'Judge happy or sad with the matching key; do not press when the frame is red, respond as usual when it is green.', hint: 'Computer: ← / → keys   Phone/tablet: tap the left or right button below',
        stages: {
          practice_go: { kicker: 'Practice 1', title: 'Judge the expression quickly', body: 'Press as soon as the face appears; there is no signal to wait for. Be fast and accurate. Every trial tells you whether you were right.', button: 'Start practice' },
          practice_signal: { kicker: 'Practice 2', title: 'Adding the coloured frame', body: 'Now some faces get a frame. Red: do not press. Green: respond as usual. The frame changes colour only after the face has appeared, so do not wait for it; keep judging quickly. Every trial tells you whether you were right.', button: 'Start practice' },
          baseline: { kicker: 'Part 1', title: 'Judge the expression (no frames)', body: 'There are no frames in this part. Be fast and accurate. Your speed here sets where the red frame starts.', button: 'Start' },
          calib: { kicker: 'Part 2', title: 'Judge the expression; stop at a red frame', body: 'From here on, red and green frames appear. When the red frame appears is adjusted to your performance, so stopping will sometimes be easy and sometimes hard; please do not slow down on purpose. If you are too slow or miss a trial, “Respond faster” appears.', button: 'Start' },
          formal: { kicker: 'Part 3', title: 'The test', body: 'The rules are the same as in the previous part. There are {total} trials, {stops} of them with a red frame. The red-frame timing is adjusted separately for happy and sad faces. Respond at your normal speed, fast and accurate.', button: 'Start the test' }
        },
        statsTitle: 'Previous part', statsRt: 'Mean reaction time', statsOmit: 'Missed', statsWrong: 'Wrong key',
        fb: { correct: 'Correct', wrong: 'Wrong key', slow: 'Too slow, respond faster', contOk: 'Correct (respond as usual on green)', contMiss: 'Respond as usual on green', stopOk: 'Stopped successfully', stopFail: 'You pressed after the red frame—this is normal', faster: 'Respond faster' },
        frameLabel: { stop: ', red frame: stop', cont: ', green frame: respond as usual' },
        resultTitle: 'Your stopping speed', resultLead: 'The stop-signal reaction time (SSRT) is estimated with the integration method: how long you need to stop an action that is already prepared. It is not measured directly.',
        ssrt: 'Stop-signal reaction time (SSRT)', pRespond: 'Responses after the red frame', meanSsd: 'Mean red-frame delay', goRt: 'Median go reaction time', goAcc: 'Go accuracy',
        contRt: 'Mean green-frame reaction time', frameCost: 'Green-frame trials slower than go', frameCostNote: 'Green-frame trials require the usual response but the display changes. How much slower they are reflects the interference of seeing a frame, which helps to separate it from the effect of the stop instruction.',
        noSsrt: 'Cannot be estimated reliably', prediction: 'Your prediction', predictionLabels: { happy: 'Harder to stop with happy faces', sad: 'Harder to stop with sad faces', same: 'About the same', unsure: 'No prediction selected' },
        tableTitle: 'By expression (descriptive only)', emotion: 'Face', stopCount: 'Stop trials', ssrtExplore: 'Exploratory SSRT', meanSsdShort: 'Mean red-frame delay',
        perEmotionNote: 'Each expression has only {perEmotion} stop trials, which is too few for separate SSRTs to be more than exploratory, or to conclude that one expression is harder to stop. A dash means that expression did not pass the assumption checks, so no value is reported.',
        warnRate: 'The share of responses after the red frame is outside 25–75%, so this SSRT is not reliable. Common causes are waiting for the frame on purpose or erratic responding; try again at your normal speed.',
        warnRace: 'On average, failed stops were not faster than ordinary go responses. This breaks an assumption of the method, so no SSRT is reported.',
        warnExtreme: 'You either stopped on every red-frame trial or on none, so the method cannot estimate an SSRT.',
        limitsTitle: 'How to read this', limits: ['SSRT is a model-based estimate, not a directly measured time; it assumes that “go” and “stop” processes race each other and needs the share of responses after the red frame to be close to half.', 'Your result describes this one short session. Formal studies use many more trials and check the assumptions before interpreting an estimate.', 'In this task, judging the expression is itself your response, so the emotional content of the faces is relevant to your task; the result cannot be generalized to situations where emotion is irrelevant.', 'Red always means stop and green always means respond, so the effect of colour cannot be separated from the stop instruction.', 'The faces are AI-generated images of fictional people and have not been validated; this demonstration is not used to judge your emotions or abilities.'],
        sourceTitle: 'Further reading', sources: [['Nguyen et al. (2021): stop-signal task with a continue-go condition (EEG)', 'https://doi.org/10.3390/brainsci11040478'], ['Verbruggen et al. (2019): consensus guide to the stop-signal task', 'https://doi.org/10.7554/eLife.46323']],
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

  function keyMapMarkup(g, mapping = 'A') {
    const left = StopTask().keyFor('happy', mapping) === 'left' ? 'happy' : 'sad';
    const right = left === 'happy' ? 'sad' : 'happy';
    return `<div class="key-map" role="group" aria-label="${e(g.keyMapLabel)}"><span><kbd>←</kbd> ${g[`${left}Word`]}</span><span>${g[`${right}Word`]} <kbd>→</kbd></span></div>`;
  }

  function buildStopIntroMarkup(lang = 'zh', mapping = 'A') {
    const c = copy[lang] || copy.zh; const g = c.stop;
    const item = (level, identity, frame, caption) => `<span class="face-strip-item">${Face().faceHtml(level, { identity, frame })}<small class="frame-caption">${caption}</small></span>`;
    const demo = `<div class="face-strip" aria-hidden="true">${item(1, 'a', null, g.captionNone)}${item(0, 'b', 'stop', g.captionStop)}${item(1, 'c', 'cont', g.captionCont)}</div>`;
    return introShell(c, g, 'stop', lang, keyMapMarkup(g, mapping) + demo);
  }

  function statsMarkup(g, records) {
    const go = records.filter(record => record.kind === 'go');
    if (!go.length) return '';
    const rts = go.filter(record => record.correct && Number.isFinite(record.rt)).map(record => record.rt);
    const omitted = go.filter(record => !record.responded).length;
    const wrong = go.filter(record => record.outcome === 'choice_error').length;
    return `<p class="stage-stats"><strong>${g.statsTitle}</strong>　${g.statsRt} ${ms(StopTask().mean(rts))}　·　${g.statsOmit} ${omitted}　·　${g.statsWrong} ${wrong}</p>`;
  }

  // Trial counts in the copy come from the task configuration, so shortening or lengthening a block never leaves stale numbers.
  function fillCounts(text) {
    const { STAGES, EMOTIONS } = StopTask();
    const formal = STAGES.formal;
    return text.replace('{total}', EMOTIONS.length * (formal.go + 2 * formal.signal)).replace('{stops}', EMOTIONS.length * formal.signal).replace('{perEmotion}', formal.signal);
  }

  function stagePanelMarkup(lang, stage, mapping, previous = []) {
    const c = copy[lang] || copy.zh; const g = c.stop; const info = g.stages[stage];
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><section class="experiment-transition"><p class="eyebrow">${info.kicker}</p><h1>${info.title}</h1>${statsMarkup(g, previous)}${keyMapMarkup(g, mapping)}<p>${fillCounts(info.body)}</p><button class="experiment-primary" type="button" data-stop-next>${info.button}</button></section></div>`;
  }

  function buildStopResultsMarkup(lang = 'zh', summary, prediction = 'unsure') {
    const c = copy[lang] || copy.zh; const g = c.stop;
    const rows = StopTask().EMOTIONS.map(emotion => {
      const row = summary.byEmotion[emotion];
      return `<tr><th scope="row">${g[emotion]}</th><td>${ms(row.goMedianRt)}</td><td>${ms(row.contMeanRt)}</td><td>${pct(row.pRespondGivenStop)}</td><td>${ms(row.meanSsd)}</td><td>${row.ssrt === null ? '—' : ms(row.ssrt)}</td></tr>`;
    }).join('');
    const warningText = { rate: g.warnRate, race: g.warnRace, extreme: g.warnExtreme };
    const warnings = summary.ssrt === null ? [...new Set((summary.flags.length ? summary.flags : ['extreme']).map(flag => warningText[flag]))] : [];
    const cost = summary.frameCost === null ? '—' : `${summary.frameCost >= 0 ? '+' : '−'}${Math.abs(Math.round(summary.frameCost))} ms`;
    return `<div class="page-shell experiment-page"><a class="back-link" href="#/lab">${c.back}</a><header class="result-header"><p class="eyebrow">Result</p><h1>${g.resultTitle}</h1><p>${g.resultLead}</p></header>
      <section class="result-summary" aria-labelledby="ssrt-title"><div><span>${g.ssrt}</span><strong id="ssrt-title">${summary.ssrt === null ? g.noSsrt : ms(summary.ssrt)}</strong><small>${lang === 'zh' ? '整合法：第 n 個一般反應時間 − 平均紅框延遲（開心與難過合併）' : 'Integration method: nth go reaction time − mean red-frame delay (happy and sad pooled)'}</small></div><p>${warnings.map(item => `<span class="result-warning">${item}</span>`).join(' ')}</p></section>
      <dl class="result-notes"><div><dt>${g.pRespond}</dt><dd>${pct(summary.pRespond)}</dd></div><div><dt>${g.meanSsd}</dt><dd>${ms(summary.meanSsd)}</dd></div><div><dt>${g.goRt}</dt><dd>${ms(summary.goMedianRt)}</dd></div><div><dt>${g.goAcc}</dt><dd>${pct(summary.goAccuracy)}</dd></div><div><dt>${g.contRt}</dt><dd>${ms(summary.contMeanRt)}</dd></div><div><dt>${g.frameCost}</dt><dd>${cost}<br><small>${g.frameCostNote}</small></dd></div><div><dt>${g.prediction}</dt><dd>${g.predictionLabels[prediction] || g.predictionLabels.unsure}</dd></div></dl>
      <section class="result-table-wrap"><h2 class="result-subtitle">${g.tableTitle}</h2><table><thead><tr><th>${g.emotion}</th><th>${g.goRt}</th><th>${g.contRt}</th><th>${g.pRespond}</th><th>${g.meanSsdShort}</th><th>${g.ssrtExplore}</th></tr></thead><tbody>${rows}</tbody></table><p class="result-footnote">${fillCounts(g.perEmotionNote)}</p></section>
      <section class="result-limits"><h2>${g.limitsTitle}</h2><ul>${g.limits.map(item => `<li>${item}</li>`).join('')}</ul></section>
      <div class="result-sources"><strong>${g.sourceTitle}</strong>${g.sources.map(source => `<a href="${source[1]}" target="_blank" rel="noopener noreferrer">${source[0]} ↗</a>`).join('')}</div>
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
    const Task = StopTask();
    const c = copy[lang] || copy.zh; const g = c.stop; const cfg = Task.CONFIG;
    const mapping = Math.random() < 0.5 ? 'A' : 'B';
    container.innerHTML = buildStopIntroMarkup(lang, mapping);
    Face().preload();
    const leftEmotion = Task.keyFor('happy', mapping) === 'left' ? 'happy' : 'sad';
    const rightEmotion = leftEmotion === 'happy' ? 'sad' : 'happy';
    const controls = `<button type="button" data-stop-response="left" disabled>← ${g[`${leftEmotion}Word`]}</button><button type="button" data-stop-response="right" disabled>${g[`${rightEmotion}Word`]} →</button>`;
    const setControls = disabled => container.querySelectorAll('[data-stop-response]').forEach(button => { button.disabled = disabled; });
    let prediction = 'unsure'; let stageIndex = -1; let trials = []; let index = 0; let active = null; let onset = 0;
    let results = []; let stageResults = []; let baselineRts = []; let warnRt = null;
    let calibSsd = cfg.ssdFallback; let calibStopSsds = []; let tracked = { happy: cfg.ssdFallback, sad: cfg.ssdFallback };
    let pendingStage = null;

    const stageName = () => Task.STAGE_ORDER[stageIndex];
    const isPractice = () => stageName().startsWith('practice');
    const correctGoRts = list => list.filter(record => record.kind === 'go' && record.correct && Number.isFinite(record.rt)).map(record => record.rt);

    function ssdFor(spec) {
      if (spec.kind === 'go') return null;
      const stage = stageName();
      if (stage === 'practice_signal') return 250;
      if (stage === 'calib') return calibSsd;
      if (stage === 'formal') return tracked[spec.emotion];
      return null;
    }

    function feedbackFor(spec, scored) {
      const f = g.fb;
      if (isPractice()) {
        if (spec.kind === 'stop') return { text: scored.correct ? f.stopOk : f.stopFail, ok: scored.correct };
        if (spec.kind === 'cont') return scored.correct ? { text: f.contOk, ok: true } : { text: scored.outcome === 'omission' ? f.contMiss : f.wrong, ok: false };
        if (scored.outcome === 'omission') return { text: f.slow, ok: false };
        return { text: scored.correct ? f.correct : f.wrong, ok: scored.correct };
      }
      const slow = spec.kind === 'go' && (scored.outcome === 'omission' || (warnRt !== null && Number.isFinite(scored.rt) && scored.rt > warnRt));
      return slow ? { text: f.faster, ok: false, warn: true } : null;
    }

    function endTrial(trial, stage) {
      if (active !== trial) return;
      active = null; setControls(true);
      const spec = trial.spec;
      const scored = Task.scoreTrial(spec, trial.key, trial.rt, mapping, cfg.window);
      const record = { ...spec, ...scored, key: trial.key, plannedSsd: trial.ssd, ssd: trial.actualSsd !== null ? trial.actualSsd : trial.ssd };
      results.push(record); stageResults.push(record);
      if (spec.kind === 'stop') {
        if (stageName() === 'calib') { calibStopSsds.push(trial.ssd); calibSsd = Task.trackSsd(calibSsd, scored.correct); }
        if (stageName() === 'formal') tracked[spec.emotion] = Task.trackSsd(tracked[spec.emotion], scored.correct);
      }
      const feedback = feedbackFor(spec, scored);
      stage.innerHTML = feedback ? `<p class="trial-feedback ${feedback.ok ? 'is-correct' : 'is-incorrect'}">${feedback.text}</p>` : '';
      later(next, cfg.iti);
    }

    function present(spec, stage) {
      const ssd = ssdFor(spec);
      const label = frame => `${g[spec.emotion]}${frame ? g.frameLabel[frame] : ''}`;
      const draw = frame => `<div class="stop-trial" role="img" aria-label="${e(label(frame))}">${Face().faceHtml(spec.level, { identity: spec.identity, frame })}</div>`;
      stage.innerHTML = draw(null);
      const trial = { spec, ssd, actualSsd: null, key: null, rt: null };
      active = trial; onset = performance.now(); setControls(false);
      if (ssd !== null) {
        later(() => {
          if (active === trial && trial.key === null) { trial.actualSsd = Math.round(performance.now() - onset); stage.innerHTML = draw(spec.kind === 'stop' ? 'stop' : 'cont'); }
        }, ssd);
      }
      later(() => endTrial(trial, stage), cfg.window);
    }

    function show(spec) {
      const stage = container.querySelector('[data-stop-stage]');
      if (!stage) return;
      stage.innerHTML = `<span class="posner-fixation" aria-hidden="true">+</span>`;
      later(() => { stage.innerHTML = ''; later(() => present(spec, stage), cfg.blank); }, cfg.fixation);
    }

    function respond(key) {
      if (!active || active.key !== null) return;
      active.key = key; active.rt = Math.round(performance.now() - onset);
      setControls(true);
    }

    function afterStage() {
      const stage = stageName();
      if (stage === 'baseline') { baselineRts = correctGoRts(stageResults); warnRt = Task.warnThreshold(baselineRts); }
      if (stage === 'calib') { const rts = correctGoRts(stageResults); if (rts.length >= 5) warnRt = Task.warnThreshold(rts); }
    }

    function showPanel(stage, previous = []) {
      pendingStage = stage;
      container.innerHTML = stagePanelMarkup(lang, stage, mapping, previous);
    }

    function next() {
      if (index >= trials.length) {
        const finished = stageName(); const previous = stageResults;
        afterStage();
        const upcoming = Task.STAGE_ORDER[stageIndex + 1];
        if (!upcoming) { container.innerHTML = buildStopResultsMarkup(lang, Task.summarizeTrials(results), prediction); return; }
        showPanel(upcoming, finished === 'baseline' || finished === 'calib' ? previous : []);
        return;
      }
      const progress = container.querySelector('[data-stop-progress]');
      if (progress) progress.textContent = `${index + 1} / ${trials.length}`;
      show(trials[index++]);
    }

    function beginStage(name) {
      stageIndex = Task.STAGE_ORDER.indexOf(name); index = 0; stageResults = [];
      trials = Task.createBlock(name);
      if (name === 'calib') { calibSsd = Task.startSsd(baselineRts); calibStopSsds = []; }
      if (name === 'formal') { const critical = Task.finalizeCalibration(calibStopSsds).critical; tracked = { happy: critical, sad: critical }; }
      container.innerHTML = taskShell(c, g, 'stop', lang, isPractice() ? 'practice' : 'formal', trials.length, 'stop-stage', controls);
      later(next, 600);
    }

    function onClick(event) {
      if (event.target.closest('[data-stop-start]')) { prediction = container.querySelector('input[name="stop-prediction"]:checked')?.value || 'unsure'; showPanel('practice_go'); return; }
      if (event.target.closest('[data-stop-next]')) { beginStage(pendingStage); return; }
      if (event.target.closest('[data-stop-retry]')) { renderStopSignal(container, lang); return; }
      const button = event.target.closest('[data-stop-response]');
      if (button) respond(button.dataset.stopResponse);
    }
    function onKeydown(event) {
      if (!active) return;
      if (event.code === 'ArrowLeft') { event.preventDefault(); respond('left'); }
      if (event.code === 'ArrowRight') { event.preventDefault(); respond('right'); }
    }
    container.addEventListener('click', onClick); window.addEventListener('keydown', onKeydown);
    teardown = () => { container.removeEventListener('click', onClick); window.removeEventListener('keydown', onKeydown); active = null; };
  }

  return { copy, buildFaceIntroMarkup, buildFaceResultsMarkup, buildStopIntroMarkup, buildStopResultsMarkup, stagePanelMarkup, renderFaceJudgment, renderStopSignal, cleanup };
});
