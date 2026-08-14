const app = document.querySelector('#app');
const navLinks = document.querySelector('#nav-links');
const langToggle = document.querySelector('#lang-toggle');
const menuToggle = document.querySelector('#menu-toggle');
const navPanel = document.querySelector('#nav-panel');
const themeToggle = document.querySelector('#theme-toggle');
const topLink = document.querySelector('#top-link');
const SITE_VERSION = '20260814-5';

let lang = localStorage.getItem('tingting-language') || 'zh';
if (lang !== 'zh' && lang !== 'en') lang = 'zh';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);
}

function safeMarkdownParse(mdText) {
  if (!mdText) return '';
  if (typeof window.marked !== 'undefined' && typeof window.marked.parse === 'function') {
    try {
      return window.marked.parse(mdText);
    } catch (e) {
      console.warn('marked.parse error:', e);
    }
  }
  const message = lang === 'zh'
    ? '文章格式載入較慢，先顯示可閱讀的純文字版本。'
    : 'Formatting is loading slowly. A readable plain-text version is shown below.';
  return `<div class="markdown-fallback"><p>${message}</p><pre>${escapeHtml(mdText)}</pre></div>`;
}

function renderMermaidNodes(selector = '.mermaid') {
  let attempts = 0;
  const maxAttempts = 30; // 3 seconds timeout
  const run = () => {
    if (window.__mermaid) {
      const nodes = Array.from(document.querySelectorAll(selector));
      if (nodes.length > 0) {
        window.__mermaid.run({ nodes }).catch(err => console.error('Mermaid render error:', err));
      }
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(run, 100);
    }
  };
  run();
}

const copy = {
  zh: {
    nav: [['首頁', '/'], ['關於', '/about'], ['學術發表', '/publications'], ['文章', '/blog']],
    footer: '探索身體活動如何改變大腦與心智。',
    heroLead: '我是吳亭葶，一位認知神經科學博士生與運動防護員。我研究身體活動、執行功能與腦神經震盪之間的關係，並運用資料與 AI 把複雜問題變得清楚。',
    profileRole: '認知神經科學博士生 · 國立中央大學',
    profilePillars: '運動科學 × 認知神經科學 × AI 資料分析',
    fullProfile: '完整學經歷 →',
    selectedAreas: '研究主軸',
    focuses: [
      ['運動與情緒和認知功能', '研究身體活動如何影響情緒與認知功能。'],
      ['認知神經科學', '運用 EEG 與行為測量，探索執行功能、神經可塑性及運動後的認知變化。'],
      ['AI 與資料分析', '使用 Python、Matlab 與統計工具，建立透明、有效率且可重現的研究流程。']
    ],
    featuredTitle: '精選論文',
    allPublications: '查看完整學術發表 →',
    featuredPublications: [
      ['2026', 'Effects of volume-matched acute resistance exercise at different intensities on high-order and core executive functions in older adults', 'Acta Psychologica'],
      ['2025', '比較傳統式與血流限制阻力健身運動對計畫相關執行功能之影響', '運動表現期刊'],
      ['2024', 'The combined impact of physical activity and sedentary behavior on executive functions in older adults', 'Psychology Research and Behavior Management']
    ],
    latestTitle: '最近的文章',
    allPosts: '查看所有文章 →',
    introTitle: '關於我',
    introText: '你好，我是吳亭葶。我目前就讀國立中央大學認知神經科學研究所博士班，也具備台灣運動防護員證照。我的研究關心身體活動如何改變執行功能、情緒與大腦健康。',
    journeyTitle: '學歷與經歷',
    journey: [
      ['2025—至今', '國立中央大學・認知神經科學研究所博士班', '研究方向：運動、執行功能與認知神經科學'],
      ['2023—2025', '國立清華大學・運動科學系碩士', '運動心理學、認知與健康老化研究'],
      ['2019—2023', '中國醫藥大學・運動醫學系', '運動醫學與運動傷害防護'],
      ['2024—2026', '《運動表現期刊》編輯助理', '學術出版與編輯工作'],
      ['2022—2025', '研究助理與課程助教', '參與多項國科會研究計畫及教學工作']
    ],
    skillGroups: [
      ['研究領域', ['認知神經科學', '運動與健康老化', '執行功能', '心理健康']],
      ['研究測量', ['EEG／腦電圖', 'VO₂max／體適能測量', '行為作業']],
      ['資料分析工具', ['EEGLAB', 'SPM12', 'HHSA toolbox', 'Python', 'Matlab', 'SPSS', 'JASP']],
      ['專業證照', ['運動防護員', 'EMT-1', '銀髮族體適能 C 級指導員']]
    ],
    awardsTitle: '獲獎紀錄',
    awards: [
      ['2025', '教育部博士生獎學金'],
      ['2025', '國立中央大學 博士班入學獎學金'],
      ['2025', '國立清華大學 中華民國斐陶斐榮譽會員'],
      ['2025', '平安菁英教育基金會 113-2 菁英獎學金'],
      ['2023', '中國醫藥大學 智育獎-優秀畢業生獎項'],
      ['2021–2022', '中國醫藥大學運動醫學系 學業績優獎']
    ],
    blogEyebrow: 'Writing',
    blogTitle: '研究筆記與想法',
    blogDesc: '關於運動科學、認知神經科學、資料分析與 AI 工作流的觀察。',
    blogVersionIntro: '每篇文章都提供「簡單白話版」與「專業版」，可依閱讀需求自由切換。',
    categories: [
      ['all', '全部文章'],
      ['popular-science', '學術科普'],
      ['research-methods', '研究方法'],
      ['data-analysis', '數據分析'],
      ['ai-tools', 'AI 工具與工作流']
    ],
    categoryFilterLabel: '依主題篩選文章',
    noPosts: '這個分類的文章正在準備中。',
    searchLabel: '搜尋文章',
    searchPlaceholder: '搜尋標題、摘要或標籤…',
    clearSearch: '清除',
    searchResults: count => `找到 ${count} 篇文章`,
    noSearchResults: '找不到符合條件的文章，請嘗試其他關鍵字。',
    simpleVersion: '簡單白話版',
    professionalVersion: '專業版',
    versionHint: '先掌握重點，或切換到專業版閱讀術語、方法與研究細節。',
    back: '← 返回文章列表',
    notFound: '找不到這個頁面。'
  },
  en: {
    nav: [['Home', '/'], ['About', '/about'], ['Publications', '/publications'], ['Writing', '/blog']],
    footer: 'Exploring how physical activity shapes the mind.',
    heroLead: 'I am Ting-Ting Wu, a Ph.D. student in the Institute of Cognitive Neuroscience and a certified athletic trainer. I study physical activity, executive function, and brain oscillations and use data and AI to make complex questions clearer.',
    profileRole: 'Ph.D. Student in Institute of Cognitive Neuroscience · National Central University',
    profilePillars: 'Kinesiology × Cognitive Neuroscience × AI & Data',
    fullProfile: 'Full profile →',
    selectedAreas: 'Research pillars',
    focuses: [
      ['Cognitive neuroscience', 'Using EEG and behavioral measures to study executive function, neuroplasticity, and post-exercise cognitive change.'],
      ['Kinesiology & Physical activity', 'Studying how resistance exercise, aerobic activity, and daily movement support brain health in older adults.'],
      ['AI & data analysis', 'Using Python, Matlab, and statistical tools to build transparent, efficient, reproducible research workflows.']
    ],
    featuredTitle: 'Selected publications',
    allPublications: 'View all publications →',
    featuredPublications: [
      ['2026', 'Effects of volume-matched acute resistance exercise at different intensities on high-order and core executive functions in older adults', 'Acta Psychologica'],
      ['2025', 'Comparing traditional and blood flow restriction resistance exercise on planning-related executive function', 'Journal of Sports Performance'],
      ['2024', 'The combined impact of physical activity and sedentary behavior on executive functions in older adults', 'Psychology Research and Behavior Management']
    ],
    latestTitle: 'Latest writing',
    allPosts: 'See all writing →',
    introTitle: 'Profile',
    introText: 'I am Ting-Ting Wu, a Ph.D. student at the Institute of Cognitive Neuroscience, National Central University, and a certified athletic trainer. My research examines how physical activity shapes executive function, emotion, and brain health, with a particular focus on older adults.',
    journeyTitle: 'Education & experience',
    journey: [
      ['2025—Present', 'Ph.D., Institute of Cognitive Neuroscience, NCU', 'Exercise, executive function, and cognitive neuroscience'],
      ['2023—2025', 'M.S., Department of Kinesiology, NTHU', 'Exercise psychology, cognition, and healthy aging'],
      ['2019—2023', 'B.S., Department of Sports Medicine, CMU', 'Sports medicine and athletic training'],
      ['2024—2026', 'Editorial Assistant, Journal of Sports Performance', 'Academic publishing and editorial support'],
      ['2022—2025', 'Research & Teaching Assistant', 'Research projects and university teaching']
    ],
    skillGroups: [
      ['Research areas', ['Cognitive neuroscience', 'Exercise & healthy aging', 'Executive function', 'Mental health']],
      ['Research measures', ['EEG', 'VO₂max & fitness testing', 'Behavioral tasks']],
      ['Data & software', ['EEGLAB', 'SPM12', 'HHSA toolbox', 'Python', 'Matlab', 'SPSS', 'JASP']],
      ['Certifications', ['Certified Athletic Trainer', 'EMT-1', 'Senior Fitness Instructor (Level C)']]
    ],
    awardsTitle: 'Selected honors',
    awards: [
      ['2025', 'Ministry of Education Ph.D. Scholarship, Taiwan'],
      ['2025', 'Ph.D. Entrance Scholarship, National Central University'],
      ['2025', 'Phi Tau Phi Scholastic Honor Society'],
      ['2025', 'Ping-An Elite Educational Foundation Scholarship'],
      ['2023', 'Intellectual Award (Graduate Honor), China Medical University'],
      ['2021–2022', 'Academic Excellence Award, Department of Sports Medicine, CMU']
    ],
    blogEyebrow: 'Writing',
    blogTitle: 'Research notes & ideas',
    blogDesc: 'Observations on cognitive neuroscience, exercise and health, data analysis, and AI-enabled research.',
    blogVersionIntro: 'Every article includes a plain-language and a professional version for different reading needs.',
    categories: [
      ['all', 'All writing'],
      ['popular-science', 'Science for everyone'],
      ['research-methods', 'Research methods'],
      ['data-analysis', 'Data analysis'],
      ['ai-tools', 'AI tools & workflows']
    ],
    categoryFilterLabel: 'Filter writing by topic',
    noPosts: 'Articles in this category are in preparation.',
    searchLabel: 'Search articles',
    searchPlaceholder: 'Search titles, summaries, or tags…',
    clearSearch: 'Clear',
    searchResults: count => `${count} article${count === 1 ? '' : 's'} found`,
    noSearchResults: 'No matching articles. Try a different keyword.',
    simpleVersion: 'Plain-language',
    professionalVersion: 'Professional',
    versionHint: 'Start with the key ideas, or switch to the professional version for terminology, methods, and research detail.',
    back: '← Back to writing',
    notFound: 'This page could not be found.'
  }
};

const t = () => copy[lang] || copy.zh;

function updateChrome() {
  if (!navLinks) return;
  const path = (location.hash.slice(1) || '/').split('/').slice(0, 2).join('/') || '/';
  const c = t();
  if (c && c.nav) {
    navLinks.innerHTML = c.nav.map(([label, href]) =>
      `<li><a href="#${href}" ${path === href ? 'aria-current="page"' : ''}>${label}</a></li>`
    ).join('');
  }
  if (langToggle) {
    langToggle.textContent = lang === 'zh' ? 'EN' : '中文';
    const label = lang === 'zh' ? '切換為英文' : 'Switch to Chinese';
    langToggle.setAttribute('aria-label', label);
    langToggle.setAttribute('title', label);
  }
  updateMenuLabel();
  updateThemeChrome();
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  const footerTagline = document.querySelector('#footer-tagline');
  if (footerTagline && c && c.footer) footerTagline.textContent = c.footer;
}

function updateThemeChrome() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const label = lang === 'zh'
    ? (dark ? '切換淺色模式' : '切換深色模式')
    : (dark ? 'Switch to light mode' : 'Switch to dark mode');
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111a27' : '#f7f3e8');
}

function updateMenuLabel() {
  if (!menuToggle) return;
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  const label = lang === 'zh'
    ? (open ? '關閉選單' : '開啟選單')
    : (open ? 'Close menu' : 'Open menu');
  menuToggle.setAttribute('aria-label', label);
  const text = menuToggle.querySelector('.sr-only');
  if (text) text.textContent = label;
}

function closeMenu() {
  if (navPanel) navPanel.classList.remove('is-open');
  if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  updateMenuLabel();
}

const POSTS_DATA = [
  { "id": "fitness-hrv-cognitive-performance", "title": "體適能較好，注意力就更穩嗎？從 HRV 看認知作業中的心身調節", "date": "2026-08-12", "category": "popular-science", "tags": ["心肺適能", "HRV", "持續注意", "認知功能", "研究解讀"], "description": "解讀一項比較高、低體適能年輕男性的研究：較高體適能與持續注意反應及較穩定的 HRV 有關，但不是所有認知能力都較好。" },
  { "id": "open-source-research-statistics-skills", "title": "開源研究 Skills 怎麼選？文獻、統計與研究寫作工具箱", "date": "2026-08-11", "category": "ai-tools", "tags": ["開源軟體", "AI Skills", "文獻研究", "統計分析", "研究工作流"], "description": "盤點具有明確 MIT、BSD-3-Clause 或 Apache-2.0 授權的學術研究與統計 Skills，說明用途、適用階段與再利用注意事項。" },
  { "id": "ten-design-skills-academic-website", "title": "十套前端設計 Skills 都要裝嗎？以學術研究與個人網站為例的選擇指南", "date": "2026-08-11", "category": "ai-tools", "tags": ["AI Skills", "網站設計", "學術研究", "工具評估"], "description": "比較十套熱門前端設計 Skills，辨認哪些適合研究視覺化、個人學術網站與長文呈現，以及為什麼安裝越多不一定越好。" },
  { "id": "research-update-1", "title": "身體活動如何影響大腦健康？", "date": "2026-07-28", "category": "popular-science", "tags": ["運動", "大腦健康", "執行功能"], "description": "整理身體活動、認知功能、情緒調節與神經可塑性之間的重要連結。" },
  { "id": "first-ai-code", "title": "第一次的 AI Code 分享", "date": "2026-08-01", "category": "ai-tools", "tags": ["AI", "Python", "研究工作流"], "description": "分享我如何將 AI 導入資料分析、程式除錯與網站開發的日常工作流程。" },
  { "id": "python-statistics-pipeline", "title": "從研究設計到報告：Python 統計分析 Pipeline 的核心原則", "date": "2026-08-03", "category": "data-analysis", "tags": ["Python", "統計分析", "可重現研究"], "description": "統計分析不只是執行檢定；從研究設計、資料驗證到效果量與報告，每一步都需要留下判斷依據。" },
  { "id": "post-hoc-power-confidence-interval", "title": "統計不顯著後，要算 Post-hoc Power 嗎？從信賴區間看懂研究結果", "date": "2026-08-06", "category": "data-analysis", "tags": ["統計分析", "Statistical Power", "信賴區間", "MCID", "等效性檢定"], "description": "Observed post-hoc power 常只是 p 值的回音；改用效果量、信賴區間、重要效果門檻與敏感度分析，才能分辨接近零與結果不精確。" },
  { "id": "data-analysis-workflow", "title": "數據如何變成結論？從研究問題到可重現報告的分析流程", "date": "2026-08-06", "category": "data-analysis", "tags": ["數據分析", "研究設計", "統計推論", "可重現研究"], "description": "數據分析不只是選檢定與計算 p 值；從問題定義、資料清理、探索、模型診斷到效果估計，整理一套能被檢查與重現的完整流程。" },
  { "id": "eeg-preprocessing-principles", "title": "EEG 前處理不是按下按鈕：八個步驟與品質檢查", "date": "2026-08-03", "category": "research-methods", "tags": ["EEG", "EEGLAB", "訊號處理"], "description": "從原始腦電訊號到可分析資料，整理濾波、重參考、壞道、ICA 與品質紀錄的完整思路。" },
  { "id": "teleportation-reaction-time-task", "title": "反應時間與移動時間有何不同？認識瞬間移動認知作業", "date": "2026-08-03", "category": "research-methods", "tags": ["認知作業", "反應時間", "資料品質"], "description": "用一個簡單的點擊作業，理解大腦開始反應與身體完成動作其實是兩段不同的歷程。" },
  { "id": "garmin-raw-data-hrv", "title": "從手錶 PPG 到 HRV：交感、副交感與 Poincaré plot", "date": "2026-08-05", "category": "data-analysis", "tags": ["Garmin", "HRV", "PPG", "Poincaré plot", "生理訊號"], "description": "完整理解 BBI、ECG 與腕式 PPG 的量測原理，以及時域、頻域、Poincaré plot、entropy、DFA 與 RQA 等 HRV 指標的限制。" },
  { "id": "hermes-telegram-academic-brief", "title": "讓 Hermes 每天把學術文章送到手機：免費模型、Telegram 與排程", "date": "2026-08-05", "category": "ai-tools", "tags": ["Hermes", "Telegram", "自動排程", "AI Agent"], "description": "從 Hermes 架構、Session、Memory 與 Skills，到模型選擇、Telegram 安全設定及每天 8 點的 cronjob，完整建立可查核的學術文獻推送。" },
  { "id": "ai-tools-skills-research-workflow", "title": "把 AI 工具連接變成可重用 Skills：我的 GitHub 研究工作流", "date": "2026-08-03", "category": "ai-tools", "tags": ["AI Skills", "GitHub", "Gemini Notebook", "研究工作流"], "description": "用 AI-tools-skills 串接 Gemini Notebook、GitHub、Zotero 與 HackMD，再延伸到完整的學術研究技能流程。" },
  { "id": "ai-academic-skills-paper-screening-grants", "title": "文獻篩選到計畫書撰寫：把 AI-academic-skills 拆成找、評、寫三步驟", "date": "2026-08-05", "category": "ai-tools", "tags": ["AI Skills", "文獻評讀", "計畫書撰寫", "GRADE", "Zotero", "NotebookLM"], "description": "文獻篩選與計畫書撰寫是研究工作中最花時間的兩段流程。整理 AI-academic-skills 中的 litpilot、paper-review、paper-digest 與 research-grants，並加上把既有 Zotero 收藏與 NotebookLM 綜整一起納入評讀的串接流程。" },
  { "id": "hhsa-nonlinear-eeg", "title": "非線性腦波分析入門：從線性方法看不到的大腦動態，到 Holo-Hilbert Spectral Analysis", "date": "2026-08-04", "category": "research-methods", "tags": ["EEG", "HHSA", "非線性分析"], "description": "傳統頻譜分析只看單一頻段強弱，卻可能漏掉頻段之間的跨頻耦合。介紹 HHSA 方法定位，及其在運動科學研究中的應用缺口。" },
  { "id": "cardsort-cognitive-flexibility-task", "title": "規則悄悄換了，你多快發現？認識圖卡分類作業與認知彈性", "date": "2026-08-05", "category": "research-methods", "tags": ["認知作業", "執行功能", "認知彈性"], "description": "圖卡分類作業用雙重規則系統測量認知彈性：切換代價與難度負荷兩個指標，分別代表規則轉換與選項增加的認知成本。" },
  { "id": "conflict-inhibitory-control-task", "title": "當直覺是錯的，你需要多久踩剎車？認識方向感作業與抑制控制", "date": "2026-08-05", "category": "research-methods", "tags": ["認知作業", "執行功能", "抑制控制"], "description": "方向感作業用一致／不一致箭頭測量抑制控制：從一致性效果到 Delta Plot、Gratton Effect，拆解抑制歷程的動態變化。" },
  { "id": "pathend-spatial-working-memory-task", "title": "記住位置還不夠，要在腦中走一遍：認識路徑終點 II 與空間工作記憶", "date": "2026-08-05", "category": "research-methods", "tags": ["認知作業", "工作記憶", "空間認知"], "description": "路徑終點 II 作業要求玩家記住箭頭位置與方向，並在腦中模擬沿路徑行走，同時涉及空間工作記憶與抗干擾能力。" },
  { "id": "seqclick-working-memory-span-task", "title": "記住內容不夠，還要記住順序：認識順向點擊作業與工作記憶廣度", "date": "2026-08-05", "category": "research-methods", "tags": ["認知作業", "工作記憶", "Corsi測驗"], "description": "順向點擊作業是 Corsi 積木敲擊測驗的數位化版本，測量視覺空間工作記憶廣度，並拆解出校正動作時間後的純記憶處理指標。" }
];

let cachedPosts = null;
async function fetchSiteFile(path, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const separator = path.includes('?') ? '&' : '?';
    const response = await fetch(`${path}${separator}v=${SITE_VERSION}`, {
      cache: 'no-cache',
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Unable to load ${path} (${response.status})`);
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getPosts() {
  if (cachedPosts) return cachedPosts;
  try {
    const response = await fetchSiteFile('posts.json', 2500);
    cachedPosts = await response.json();
    return cachedPosts;
  } catch (e) {
    console.warn('Using embedded POSTS_DATA fallback');
  }
  cachedPosts = POSTS_DATA;
  return cachedPosts;
}

function newestFirst(posts) {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function categoryLabel(category) {
  return t().categories.find(item => item[0] === category)?.[1] || category;
}

function tagList(post) {
  if (!Array.isArray(post.tags) || post.tags.length === 0) return '';
  return `<div class="tag-list" aria-label="${lang === 'zh' ? '文章標籤' : 'Article tags'}">${post.tags.map(tag => `<span>${tag}</span>`).join('')}</div>`;
}

function postRow(post) {
  return `<a class="post-card" href="#/post/${post.id}">
    <div class="post-meta">${categoryLabel(post.category)}<br>${post.date}</div>
    <div><h3>${post.title}</h3><p>${post.description}</p></div>
    <span class="post-arrow" aria-hidden="true">→</span>
  </a>`;
}

async function renderHome() {
  const allPosts = newestFirst((await getPosts()).filter(post => post.id !== 'publications'));
  const posts = allPosts.slice(0, 2);
  const c = t();
  const overview = lang === 'zh' ? [
    ['研究主軸', c.focuses.length, '查看專長', '#/about/skills'],
    ['公開文章', allPosts.length, '瀏覽文章', '#/blog'],
    ['精選發表', c.featuredPublications.length, '查看發表', '#/publications'],
    ['閱讀模式', 2, '白話／專業', '#/blog']
  ] : [
    ['Research areas', c.focuses.length, 'View expertise', '#/about/skills'],
    ['Public articles', allPosts.length, 'Browse articles', '#/blog'],
    ['Selected works', c.featuredPublications.length, 'View publications', '#/publications'],
    ['Reading modes', 2, 'Simple / professional', '#/blog']
  ];
  app.innerHTML = `<div class="page-shell home-shell">
    <section class="profile-hero">
      <div class="profile-rail">
        <p class="profile-kicker">${lang === 'zh' ? '研究者檔案 · 01' : 'Research profile · 01'}</p>
        <div class="avatar-wrap"><img src="assets/profile-tingting.webp" width="750" height="1000" alt="${lang === 'zh' ? '吳亭葶的個人照片' : 'Portrait of Ting-Ting Wu'}" decoding="async" fetchpriority="high"></div>
      </div>
      <div class="profile-id">
        <h1>${lang === 'zh' ? '吳亭葶' : 'Ting-Ting Wu'} <span>${lang === 'zh' ? 'Ting-Ting Wu' : '吳亭葶'}</span></h1>
        <p class="profile-role">${c.profileRole}</p>
        <p class="profile-pillars">${c.profilePillars}</p>
        <p class="profile-intro">${c.heroLead}</p>
        <div class="profile-links"><a href="#/about">${c.fullProfile}</a><a href="https://orcid.org/0009-0003-2432-9812" target="_blank" rel="noopener noreferrer">ORCID ↗</a><a href="https://scholar.google.com.tw/citations?user=uHNX07sAAAAJ&amp;hl=zh-TW" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a></div>
      </div>
    </section>
    <nav class="home-overview" aria-label="${lang === 'zh' ? '研究與內容概覽' : 'Research and content overview'}">
      ${overview.map((item, index) => `<a href="${item[3]}" class="overview-item${index === 1 ? ' overview-item-primary' : ''}"><span>${item[0]}</span><strong>${item[1]}</strong><small>${item[2]} →</small></a>`).join('')}
    </nav>
    <div class="home-editorial-grid">
      <section class="home-block research-section"><h2>${c.selectedAreas}</h2><div class="pillar-grid">${c.focuses.map(item => `<a class="pillar-card" href="#/about/skills"><b>${item[0]}</b><span>${item[1]}</span></a>`).join('')}</div></section>
      <section class="home-block featured-publications"><div class="block-heading"><h2>${c.featuredTitle}</h2><a href="#/publications">${c.allPublications}</a></div><div class="publication-preview-list">${c.featuredPublications.map(item => `<a href="#/publications" class="publication-preview"><span>${item[0]}</span><div><b>${item[1]}</b><small>${item[2]}</small></div></a>`).join('')}</div></section>
    </div>
    <section class="home-block latest-section"><div class="block-heading"><h2>${c.latestTitle}</h2><a href="#/blog">${c.allPosts}</a></div><div class="post-list">${posts.map(postRow).join('')}</div></section>
  </div>`;
}

const researchFrameworkDiagram = {
  zh: `flowchart TD
  subgraph K["運動科學 (Kinesiology)"]
    PA["身體活動與久坐行為"]
    EX["運動介入 (阻力／有氧)"]
    FIT["心肺適能與體組成"]
  end
  
  subgraph C["認知神經科學 (Cognitive Neuroscience)"]
    EEG["神經生理機制<br>(EEG / HHSA 跨頻耦合)"]
    COG["執行功能<br>(抑制控制、工作記憶、認知彈性)"]
    EMO["情緒與心理健康"]
  end
  
  subgraph M["研究方法與工具 (Methodology & AI)"]
    DATA["資料科學與統計建模"]
    AI["AI 驅動的自動化工作流"]
  end

  PA <--> EX
  EX --> FIT
  FIT --> EEG
  FIT --> COG
  FIT --> EMO
  EEG <--> COG
  EEG <--> EMO
  COG <--> EMO
  
  M -. "支持測量與推論" .-> K
  M -. "支持測量與推論" .-> C`,
  en: `flowchart TD
  subgraph K["Kinesiology"]
    PA["Physical Activity & Sedentary Behavior"]
    EX["Exercise Interventions (Resistance/Aerobic)"]
    FIT["Cardiorespiratory Fitness & Body Composition"]
  end
  
  subgraph C["Cognitive Neuroscience"]
    EEG["Neurophysiology<br>(EEG / HHSA)"]
    COG["Executive Function<br>(Inhibition, Memory, Flexibility)"]
    EMO["Emotion & Mental Health"]
  end
  
  subgraph M["Methodology & AI"]
    DATA["Data Science & Statistical Modeling"]
    AI["AI-Driven Reproducible Workflows"]
  end

  PA <--> EX
  EX --> FIT
  FIT --> EEG
  FIT --> COG
  FIT --> EMO
  EEG <--> COG
  EEG <--> EMO
  COG <--> EMO
  
  M -. "Enhance measurement & inference" .-> K
  M -. "Enhance measurement & inference" .-> C`
};

async function renderAbout(section = '') {
  const c = t();
  const labels = lang === 'zh' ? {
    home: '首頁', title: '關於我', meta: '吳亭葶 Ting-Ting Wu', language: '語言：English', toc: '目錄',
    role: '認知神經科學博士生 / 運動防護員 / 研究者', education: '學經歷', expertise: '專長領域', honors: '榮譽', contact: '聯繫',
    bio2: '我的研究主題是運動科學與認知神經科學的交界，關注身體活動如何影響執行功能、情緒及大腦功能。除了實驗研究，我也持續探索 AI 與可重現資料分析如何改善研究工作流程。',
    framework: '研究框架', frameworkCaveat: '示意圖，簡化呈現研究變項間的關係，非統計模型或因果推論結果。'
  } : {
    home: 'Home', title: 'About', meta: 'Ting-Ting Wu', language: 'Language: 中文', toc: 'Table of contents',
    role: 'Ph.D. Student in Cognitive Neuroscience / Athletic Trainer / Researcher', education: 'Education & experience', expertise: 'Expertise', honors: 'Honors', contact: 'Contact',
    bio2: 'My work sits at the intersection of exercise science and cognitive neuroscience. I study how exercise intensity, physical activity, and sedentary behavior shape executive function, emotion, and healthy aging, while exploring reproducible data analysis and AI-enabled research workflows.',
    framework: 'Research framework', frameworkCaveat: 'Simplified schematic of how these variables relate — not a statistical model or a causal claim.'
  };
  const tocItems = [[c.introTitle, 'intro'], [labels.framework, 'framework'], [labels.education, 'journey'], [labels.expertise, 'skills'], [labels.honors, 'awards'], [labels.contact, 'contact']];

  app.innerHTML = `<div class="page-shell about-page"><article class="about-article">
    <header class="post-header">
      <div class="breadcrumbs"><a href="#/">${labels.home}</a></div>
      <h1>${labels.title}</h1>
      <div class="page-meta"><span>${labels.meta}</span><span>·</span><button type="button" class="inline-language">${labels.language}</button></div>
    </header>
    <details class="about-toc" open><summary>${labels.toc}</summary><nav>${tocItems.map(item => `<a href="#/about/${item[1]}" ${section === item[1] ? 'aria-current="location"' : ''}>${item[0]}</a>`).join('')}</nav></details>
    <div class="about-content">
      <p class="about-avatar"><span><img src="assets/profile-tingting.webp" width="750" height="1000" alt="${lang === 'zh' ? '吳亭葶的個人照片' : 'Portrait of Ting-Ting Wu'}" loading="lazy" decoding="async"></span></p>
      <section id="about-intro" class="about-section"><h2>${lang === 'zh' ? '吳亭葶 Ting-Ting Wu' : 'Ting-Ting Wu 吳亭葶'}</h2><blockquote><strong>${labels.role}</strong></blockquote><p>${c.introText}</p><p>${labels.bio2}</p></section>
      <section id="about-framework" class="about-section"><h2>${labels.framework}</h2><div class="mermaid-wrap"><pre class="mermaid">${researchFrameworkDiagram[lang]}</pre></div><p class="demo-caveat">⚠️ ${labels.frameworkCaveat}</p></section>
      <section id="about-journey" class="about-section"><h2>${labels.education}</h2><ul class="plain-list">${c.journey.map(item => `<li><strong>${item[0]}</strong>　${item[1]}<br><span>${item[2]}</span></li>`).join('')}</ul></section>
      <section id="about-skills" class="about-section"><h2>${labels.expertise}</h2><ul class="expertise-list">${c.focuses.map(item => `<li><strong>${item[0]}</strong>：${item[1]}</li>`).join('')}</ul><div class="about-skill-groups">${c.skillGroups.slice(1).map(group => `<div><h3>${group[0]}</h3><p>${group[1].join('、')}</p></div>`).join('')}</div></section>
      <section id="about-awards" class="about-section"><h2>${labels.honors}</h2><ul class="plain-list">${c.awards.map(item => `<li><strong>${item[0]}</strong>　${item[1]}</li>`).join('')}</ul></section>
      <section id="about-contact" class="about-section"><h2>${labels.contact}</h2><ul><li>Email：<a href="mailto:tingwu.new@gmail.com">tingwu.new@gmail.com</a></li><li><a href="https://orcid.org/0009-0003-2432-9812" target="_blank" rel="noopener noreferrer">ORCID</a></li><li><a href="https://scholar.google.com.tw/citations?user=uHNX07sAAAAJ&amp;hl=zh-TW" target="_blank" rel="noopener noreferrer">Google Scholar</a></li><li><a href="https://github.com/wttntpc" target="_blank" rel="noopener noreferrer">GitHub</a></li></ul></section>
    </div>
  </article></div>`;
  document.querySelector('.inline-language').addEventListener('click', () => langToggle.click());
  renderMermaidNodes('#about-framework .mermaid');
  if (section) {
    requestAnimationFrame(() => document.querySelector(`#about-${CSS.escape(section)}`)?.scrollIntoView());
  }
}

async function renderPublications() {
  const response = await fetchSiteFile('posts/publications.md');
  const content = safeMarkdownParse(await response.text());
  const labels = lang === 'zh' ? {
    home: '首頁', title: '學術發表', description: '期刊論文與國內外研討會發表紀錄。'
  } : {
    home: 'Home', title: 'Publications', description: 'Journal articles and national and international conference presentations.'
  };
  app.innerHTML = `<div class="page-shell publications-page"><article>
    <header class="post-header"><div class="breadcrumbs"><a href="#/">${labels.home}</a></div><h1>${labels.title}</h1><p>${labels.description}</p></header>
    <div class="publication-links"><a href="https://orcid.org/0009-0003-2432-9812" target="_blank" rel="noopener noreferrer">ORCID ↗</a><a href="https://scholar.google.com.tw/citations?user=uHNX07sAAAAJ&amp;hl=zh-TW" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a></div>
    <div class="markdown-body">${content}</div>
  </article></div>`;
}

async function renderBlog(requestedCategory = 'all') {
  const posts = newestFirst((await getPosts()).filter(post => post.id !== 'publications'));
  const c = t();
  const activeCategory = c.categories.some(item => item[0] === requestedCategory) ? requestedCategory : 'all';
  const visiblePosts = activeCategory === 'all' ? posts : posts.filter(post => post.category === activeCategory);
  const renderCards = items => items.map((post, index) => `<a class="blog-card${index === 0 ? ' blog-card-featured' : ''}" href="#/post/${post.id}">${index === 0 ? `<span class="featured-label">${lang === 'zh' ? '最新文章' : 'Latest article'}</span>` : ''}<div class="post-meta">${categoryLabel(post.category)} · ${post.date}</div><h2>${post.title}</h2><p>${post.description}</p>${tagList(post)}<span class="version-badge">${c.simpleVersion} · ${c.professionalVersion}</span></a>`).join('');
  app.innerHTML = `<div class="page-shell blog-page"><header class="inner-hero"><p class="eyebrow">${c.blogEyebrow}</p><h1 class="display">${c.blogTitle}</h1><p>${c.blogDesc}</p><p class="blog-version-intro">${c.blogVersionIntro}</p></header>
    <div class="article-search"><label for="article-search-input">${c.searchLabel}</label><div class="article-search-control"><span aria-hidden="true">⌕</span><input id="article-search-input" name="article-search" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="${c.searchPlaceholder}"><button id="article-search-clear" type="button" hidden>${c.clearSearch}</button></div><p id="article-search-status" role="status" aria-live="polite"></p></div>
    <nav class="category-filter" aria-label="${c.categoryFilterLabel}">${c.categories.map(([id, label]) => { const count = id === 'all' ? posts.length : posts.filter(post => post.category === id).length; const href = id === 'all' ? '#/blog' : `#/blog/${id}`; return `<a href="${href}" ${activeCategory === id ? 'aria-current="page"' : ''}><span>${label}</span><b>${count}</b></a>`; }).join('')}</nav>
    <div class="blog-grid" id="article-search-results">${visiblePosts.length ? renderCards(visiblePosts) : `<p class="empty-category">${c.noPosts}</p>`}</div></div>`;

  const searchInput = document.querySelector('#article-search-input');
  const clearButton = document.querySelector('#article-search-clear');
  const status = document.querySelector('#article-search-status');
  const results = document.querySelector('#article-search-results');

  const updateSearch = () => {
    const query = searchInput.value.trim().toLocaleLowerCase(lang === 'zh' ? 'zh-Hant' : 'en');
    const matches = query ? visiblePosts.filter(post => {
      const searchable = [post.title, post.description, categoryLabel(post.category), ...(post.tags || [])].join(' ').toLocaleLowerCase(lang === 'zh' ? 'zh-Hant' : 'en');
      return searchable.includes(query);
    }) : visiblePosts;
    clearButton.hidden = query.length === 0;
    status.textContent = query ? c.searchResults(matches.length) : '';
    results.innerHTML = matches.length ? renderCards(matches) : `<p class="empty-category">${query ? c.noSearchResults : c.noPosts}</p>`;
  };

  searchInput.addEventListener('input', updateSearch);
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    updateSearch();
    searchInput.focus();
  });
}

function parseArticleVersions(source) {
  const simpleMarker = '<!-- SIMPLE -->';
  const professionalMarker = '<!-- PROFESSIONAL -->';
  const simpleStart = source.indexOf(simpleMarker);
  const professionalStart = source.indexOf(professionalMarker);

  if (simpleStart === -1 || professionalStart === -1 || professionalStart < simpleStart) {
    const fallback = source.trim();
    return { simple: fallback, professional: fallback };
  }

  return {
    simple: source.slice(simpleStart + simpleMarker.length, professionalStart).trim(),
    professional: source.slice(professionalStart + professionalMarker.length).trim()
  };
}

function initCorsiDemo() {
  const demos = document.querySelectorAll('.corsi-demo');
  if (demos.length === 0) return;

  demos.forEach(demo => {
    const stage = demo.querySelector('.corsi-stage');
    const status = demo.querySelector('.corsi-status');
    const startBtn = demo.querySelector('.corsi-start');
    if (!stage || !status || !startBtn) return;

    // Only create blocks if they don't exist yet
    if (stage.children.length === 0) {
      for (let i = 0; i < 9; i++) {
        const block = document.createElement('button');
        block.className = 'corsi-block';
        block.dataset.index = i;
        stage.appendChild(block);
      }
    }

    const blocks = Array.from(stage.querySelectorAll('.corsi-block'));
    let sequence = [];
    let userStep = 0;
    let state = 'idle'; 
    let activeTimeout;
    
    function playSequence() {
      state = 'playing';
      status.textContent = '請記住發亮的順序…';
      startBtn.hidden = true;
      let i = 0;
      
      blocks.forEach(b => b.classList.remove('active', 'clicked'));

      const playNext = () => {
        if (i > 0) blocks[sequence[i-1]].classList.remove('active');
        if (i < sequence.length) {
          blocks[sequence[i]].classList.add('active');
          i++;
          activeTimeout = setTimeout(playNext, 800);
        } else {
          state = 'waiting_user';
          status.textContent = '換你了！請依序點擊方塊。';
        }
      };
      
      activeTimeout = setTimeout(playNext, 600);
    }

    function nextLevel() {
      let next;
      do {
        next = Math.floor(Math.random() * 9);
      } while (sequence.length > 0 && next === sequence[sequence.length - 1]);
      sequence.push(next);
      userStep = 0;
      status.textContent = `第 ${sequence.length} 關準備…`;
      activeTimeout = setTimeout(playSequence, 1000);
    }

    startBtn.addEventListener('click', () => {
      clearTimeout(activeTimeout);
      blocks.forEach(b => b.classList.remove('active', 'clicked'));
      sequence = [];
      nextLevel();
    });

    blocks.forEach(block => {
      block.addEventListener('click', () => {
        if (state !== 'waiting_user') return;
        
        const idx = parseInt(block.dataset.index);
        block.classList.add('clicked');
        setTimeout(() => block.classList.remove('clicked'), 200);

        if (idx === sequence[userStep]) {
          userStep++;
          if (userStep === sequence.length) {
            state = 'playing';
            status.textContent = '正確！準備下一回合…';
            activeTimeout = setTimeout(nextLevel, 500);
          }
        } else {
          state = 'gameover';
          status.textContent = `遊戲結束！你的工作記憶廣度 (Span) 是 ${sequence.length - 1}`;
          startBtn.hidden = false;
          startBtn.textContent = '再試一次';
        }
      });
    });
  });
}

function initConflictDemo() {
  const demos = document.querySelectorAll('.conflict-demo');
  if (demos.length === 0) return;

  demos.forEach(demo => {
    const stage = demo.querySelector('.conflict-stage');
    const status = demo.querySelector('.conflict-status');
    const startBtn = demo.querySelector('.conflict-start');
    const stimulus = demo.querySelector('.conflict-stimulus');
    const resultBox = demo.querySelector('.conflict-result');
    if (!stage || !status || !startBtn || !stimulus || !resultBox) return;

    let state = 'idle';
    let trials = [];
    let currentTrial = 0;
    const maxTrials = 10;
    let tStimulus = 0;
    let swipeStart = null;
    const directionSymbols = { up: '↑', right: '→', down: '↓', left: '←' };
    const directionLabels = { up: '上', right: '右', down: '下', left: '左' };

    function generateTrials() {
      trials = window.ConflictTask.createTrials(maxTrials);
    }

    function showFixation() {
      state = 'waiting';
      swipeStart = null;
      stimulus.textContent = '+';
      stimulus.className = 'conflict-stimulus';
      stage.classList.remove('is-correct', 'is-incorrect');
      status.textContent = `第 ${currentTrial + 1}／${maxTrials} 題：請準備`;
      setTimeout(showStimulus, 500 + Math.random() * 500);
    }

    function showStimulus() {
      if (state !== 'waiting') return;
      state = 'shown';
      const trial = trials[currentTrial];
      stimulus.textContent = directionSymbols[trial.arrowDirection];
      stimulus.className = `conflict-stimulus ${trial.isReversed ? 'is-incongruent' : 'is-congruent'}`;
      status.textContent = trial.isReversed ? '紅色：請選相反方向' : '藍色：請選相同方向';
      tStimulus = performance.now();
    }

    function finishGame() {
      state = 'gameover';
      stimulus.textContent = '完成';
      stimulus.className = 'conflict-stimulus';
      startBtn.hidden = false;
      startBtn.textContent = '再試一次';
      controls.hidden = true;
      document.removeEventListener('keydown', handleKey);

      const congruentTrials = trials.filter(t => !t.isReversed && t.correct);
      const incongruentTrials = trials.filter(t => t.isReversed && t.correct);
      const correctCount = trials.filter(t => t.correct).length;
      const meanRt = conditionTrials => conditionTrials.length
        ? Math.round(conditionTrials.reduce((sum, trial) => sum + trial.rt, 0) / conditionTrials.length)
        : null;
      const cRt = meanRt(congruentTrials);
      const iRt = meanRt(incongruentTrials);
      const interferenceCost = cRt !== null && iRt !== null ? iRt - cRt : null;

      resultBox.innerHTML = `
        <div class="demo-result-grid">
          <div><b>藍色／一致</b><br>${cRt === null ? 'N/A' : `${cRt} ms`}</div>
          <div><b>紅色／不一致</b><br>${iRt === null ? 'N/A' : `${iRt} ms`}</div>
        </div>
        <p class="demo-result-note">準確率：${Math.round(correctCount / maxTrials * 100)}%<br>一致性效果：${interferenceCost === null ? 'N/A' : `${interferenceCost} ms`}</p>
      `;
      resultBox.hidden = false;
      status.textContent = '測驗完成！結果僅供理解作業，不代表正式評估。';
    }

    const handleInput = direction => {
      if (state !== 'shown') return;
      const trial = trials[currentTrial];
      trial.rt = performance.now() - tStimulus;
      trial.correct = direction === trial.targetDirection;
      stage.classList.add(trial.correct ? 'is-correct' : 'is-incorrect');
      status.textContent = trial.correct
        ? `正確：目標方向是${directionLabels[trial.targetDirection]}`
        : `錯誤：正確方向是${directionLabels[trial.targetDirection]}`;

      state = 'idle';
      currentTrial++;
      setTimeout(() => {
        if (currentTrial < maxTrials) showFixation();
        else finishGame();
      }, 450);
    };

    const handleKey = event => {
      if (state !== 'shown') return;
      const keyDirection = {
        ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left'
      }[event.key];
      if (!keyDirection) return;
      event.preventDefault();
      handleInput(keyDirection);
    };

    const controls = document.createElement('div');
    controls.className = 'conflict-controls';
    controls.setAttribute('aria-label', '滑動方向選擇');
    controls.innerHTML = `
      <button type="button" class="conflict-btn" data-direction="up" aria-label="往上滑">↑</button>
      <button type="button" class="conflict-btn" data-direction="left" aria-label="往左滑">←</button>
      <button type="button" class="conflict-btn" data-direction="down" aria-label="往下滑">↓</button>
      <button type="button" class="conflict-btn" data-direction="right" aria-label="往右滑">→</button>
    `;
    demo.appendChild(controls);
    controls.hidden = true;
    controls.querySelectorAll('.conflict-btn').forEach(button => {
      button.addEventListener('click', () => handleInput(button.dataset.direction));
    });

    stage.addEventListener('pointerdown', event => {
      if (state !== 'shown') return;
      swipeStart = { x: event.clientX, y: event.clientY };
      stage.setPointerCapture?.(event.pointerId);
    });
    stage.addEventListener('pointerup', event => {
      if (!swipeStart) return;
      const start = swipeStart;
      swipeStart = null;
      if (state !== 'shown') return;
      const direction = window.ConflictTask.getSwipeDirection(
        event.clientX - start.x,
        event.clientY - start.y
      );
      if (direction) handleInput(direction);
    });
    stage.addEventListener('pointercancel', () => { swipeStart = null; });

    startBtn.addEventListener('click', () => {
      generateTrials();
      currentTrial = 0;
      startBtn.hidden = true;
      resultBox.hidden = true;
      controls.hidden = false;
      status.textContent = '藍色選同方向，紅色選反方向；可在箭頭區滑動，或使用按鈕與鍵盤。';
      document.removeEventListener('keydown', handleKey);
      document.addEventListener('keydown', handleKey);
      setTimeout(showFixation, 1000);
    });
  });
}

function initCardSortDemo() {
  const demos = document.querySelectorAll('.cardsort-demo');
  if (demos.length === 0) return;

  const shapes = ['circle', 'square', 'triangle'];
  const colors = ['#e74c3c', '#3498db', '#2ecc71'];

  demos.forEach(demo => {
    const targetArea = demo.querySelector('.cs-target');
    const optionsArea = demo.querySelector('.cs-options');
    const status = demo.querySelector('.cs-status');
    const startBtn = demo.querySelector('.cs-start');
    const resultBox = demo.querySelector('.cs-result');
    if (!targetArea || !optionsArea || !status || !startBtn) return;

    let state = 'idle';
    let trials = [];
    let currentTrial = 0;
    const maxTrials = 10;
    let tStart = 0;
    let currentTarget = null;
    let currentCorrectIndex = -1;

    function renderCard(shape, color, interactive = false) {
      const el = document.createElement(interactive ? 'button' : 'div');
      el.className = 'cs-card';
      if (interactive) el.type = 'button';
      const shapeElement = document.createElement('div');
      const colorName = color === colors[0] ? 'red' : color === colors[1] ? 'blue' : 'green';
      shapeElement.className = `cs-shape cs-shape-${shape} cs-color-${colorName}`;
      shapeElement.setAttribute('aria-hidden', 'true');
      el.appendChild(shapeElement);
      const shapeLabel = { circle: '圓形', square: '方形', triangle: '三角形' }[shape];
      const colorLabel = { red: '紅色', blue: '藍色', green: '綠色' }[colorName];
      el.setAttribute('aria-label', `${colorLabel}${shapeLabel}`);
      if (!interactive) el.setAttribute('role', 'img');
      return el;
    }

    function generateTrial() {
      // 50% Match rule, 50% Non-match rule
      const isMatch = Math.random() > 0.5;
      const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
      const targetColor = colors[Math.floor(Math.random() * colors.length)];
      
      let options = [];
      let correctIdx = Math.floor(Math.random() * 3);
      
      for (let i = 0; i < 3; i++) {
        if (i === correctIdx) {
          if (isMatch) {
            options.push({ shape: targetShape, color: targetColor });
          } else {
            // Find completely different shape and color
            let diffShape = shapes.find(s => s !== targetShape);
            let diffColor = colors.find(c => c !== targetColor);
            options.push({ shape: diffShape, color: diffColor });
          }
        } else {
          // Distractors
          if (isMatch) {
            // Distractors should not be perfect matches
            let s = shapes[Math.floor(Math.random() * shapes.length)];
            let c = colors[Math.floor(Math.random() * colors.length)];
            while (s === targetShape && c === targetColor) {
              s = shapes[Math.floor(Math.random() * shapes.length)];
              c = colors[Math.floor(Math.random() * colors.length)];
            }
            options.push({ shape: s, color: c });
          } else {
            // Non-match rule: distractors MUST share at least one attribute so they aren't completely different
            let shareAttr = Math.random() > 0.5; // Share shape or color
            if (shareAttr) {
              let c = colors.find(c => c !== targetColor);
              options.push({ shape: targetShape, color: c || colors[0] });
            } else {
              let s = shapes.find(s => s !== targetShape);
              options.push({ shape: s || shapes[0], color: targetColor });
            }
          }
        }
      }
      return { isMatch, target: { shape: targetShape, color: targetColor }, options, correctIdx, rt: null, correct: false };
    }

    function showTrial() {
      targetArea.innerHTML = '';
      optionsArea.innerHTML = '';
      
      const trial = trials[currentTrial];
      
      const tCard = renderCard(trial.target.shape, trial.target.color);
      targetArea.appendChild(tCard);

      trial.options.forEach((opt, idx) => {
        const oCard = renderCard(opt.shape, opt.color, true);
        oCard.addEventListener('click', () => {
          if (state !== 'playing') return;
          handleResponse(idx);
        });
        optionsArea.appendChild(oCard);
      });

      state = 'playing';
      tStart = performance.now();
      status.textContent = `第 ${currentTrial + 1} / ${maxTrials} 題 (請選出答案)`;
    }

    function handleResponse(idx) {
      const trial = trials[currentTrial];
      trial.rt = performance.now() - tStart;
      trial.correct = (idx === trial.correctIdx);

      const cards = optionsArea.querySelectorAll('.cs-card');
      cards[idx].classList.add(trial.correct ? 'correct' : 'incorrect');

      state = 'idle';
      setTimeout(() => {
        currentTrial++;
        if (currentTrial < maxTrials) {
          showTrial();
        } else {
          finishGame();
        }
      }, 500);
    }

    function finishGame() {
      state = 'gameover';
      targetArea.innerHTML = '';
      optionsArea.innerHTML = '';
      startBtn.hidden = false;
      startBtn.textContent = '再測一次';
      
      const matchTrials = trials.filter(t => t.isMatch && t.correct);
      const nonMatchTrials = trials.filter(t => !t.isMatch && t.correct);
      
      const mRt = matchTrials.length ? Math.round(matchTrials.reduce((a, b) => a + b.rt, 0) / matchTrials.length) : 'N/A';
      const nmRt = nonMatchTrials.length ? Math.round(nonMatchTrials.reduce((a, b) => a + b.rt, 0) / nonMatchTrials.length) : 'N/A';
      
      resultBox.innerHTML = `
        <div class="demo-result-grid">
          <div><b>規則一 (完全匹配)</b><br/>${mRt} ms</div>
          <div><b>規則二 (完全不同)</b><br/>${nmRt} ms</div>
        </div>
        <p class="demo-result-note">* 切換代價 (Switching Cost) = ${nmRt !== 'N/A' && mRt !== 'N/A' ? nmRt - mRt : 'N/A'} ms</p>
      `;
      resultBox.hidden = false;
      status.textContent = '測驗完成！請看下方結果。';
    }

    startBtn.addEventListener('click', () => {
      trials = [];
      for(let i=0; i<maxTrials; i++) trials.push(generateTrial());
      currentTrial = 0;
      startBtn.hidden = true;
      resultBox.hidden = true;
      showTrial();
    });
  });
}

function initReactionDemo() {
  const demo = document.querySelector('#rtDemo');
  if (!demo) return;
  const stage = demo.querySelector('#rtStage');
  const startBtn = demo.querySelector('#rtStart');
  const targetBtn = demo.querySelector('#rtTarget');
  const status = demo.querySelector('#rtStatus');
  const result = demo.querySelector('#rtResult');
  const rtValue = demo.querySelector('#rtValue');
  const mtValue = demo.querySelector('#mtValue');

  let state = 'idle';
  let timerId = null;
  let tStimulus = 0;
  let tReleased = 0;

  function resetTrial(message) {
    clearTimeout(timerId);
    state = 'idle';
    targetBtn.hidden = true;
    status.textContent = message;
  }

  function placeTargetRandomly() {
    const bounds = stage.getBoundingClientRect();
    const maxLeft = Math.max(bounds.width - 84, 0);
    const maxTop = Math.max(bounds.height - 84, 0);
    targetBtn.style.left = `${Math.round(Math.random() * maxLeft)}px`;
    targetBtn.style.top = `${Math.round(Math.random() * maxTop)}px`;
  }

  startBtn.addEventListener('pointerdown', event => {
    event.preventDefault();
    if (state !== 'idle') return;
    state = 'waiting';
    result.hidden = true;
    status.textContent = '等待中…現在放開就算提前猜測。';
    const delay = 1200 + Math.random() * 2000;
    timerId = setTimeout(() => {
      state = 'target-shown';
      placeTargetRandomly();
      targetBtn.hidden = false;
      tStimulus = performance.now();
      status.textContent = '放開紅色方塊，再點擊藍色方塊！';
    }, delay);
  });

  startBtn.addEventListener('pointerup', () => {
    if (state === 'waiting') {
      resetTrial('太早放開了，這算提前猜測——再試一次。');
      return;
    }
    if (state === 'target-shown') {
      tReleased = performance.now();
      state = 'released';
      status.textContent = '現在點擊藍色方塊。';
    }
  });

  targetBtn.addEventListener('pointerdown', event => {
    event.preventDefault();
    if (state !== 'released') return;
    const tClicked = performance.now();
    const rt = Math.round(tReleased - tStimulus);
    const mt = Math.round(tClicked - tReleased);
    rtValue.textContent = rt;
    mtValue.textContent = mt;
    result.hidden = false;
    resetTrial('點「按住」再試一次。');
  });
}

function initBbiDemo() {
  const demos = document.querySelectorAll('.bbi-demo');
  if (demos.length === 0) return;

  demos.forEach(demo => {
  const timeline = demo.querySelector('#bbiTimeline');
  const rmssdOut = demo.querySelector('#bbiRmssd');
  const countOut = demo.querySelector('#bbiCount');
  const status = demo.querySelector('#bbiStatus');
  const gapBtn = demo.querySelector('#bbiModeGap');
  const fillBtn = demo.querySelector('#bbiModeFill');

  // Simulated beat timestamps (ms), two real segments separated by a device dropout.
  const segmentA = [0, 780, 1585, 2380, 3200, 3960];
  const dropoutMs = 4000;
  const segmentB = segmentA.map(t => t + 3960 + dropoutMs).slice(1); // continues after the gap
  const realBeats = segmentA.concat(segmentB);
  const lastKnownBbi = segmentA[segmentA.length - 1] - segmentA[segmentA.length - 2]; // 760ms
  const GAP_THRESHOLD_MS = 1500;

  function buildFilledBeats() {
    const filled = [...segmentA];
    let t = segmentA[segmentA.length - 1];
    const gapEnd = segmentB[0];
    while (t + lastKnownBbi < gapEnd) {
      t += lastKnownBbi;
      filled.push(t);
    }
    return filled.concat(segmentB);
  }

  function rmssd(beats, { excludeLargeGaps }) {
    const diffs = [];
    for (let i = 1; i < beats.length; i++) {
      const d = beats[i] - beats[i - 1];
      if (excludeLargeGaps && d > GAP_THRESHOLD_MS) continue;
      diffs.push(d);
    }
    if (diffs.length < 2) return { value: null, n: diffs.length };
    let sumSq = 0;
    for (let i = 1; i < diffs.length; i++) {
      sumSq += (diffs[i] - diffs[i - 1]) ** 2;
    }
    return { value: Math.sqrt(sumSq / (diffs.length - 1)), n: diffs.length };
  }

  function render(mode) {
    const beats = mode === 'fill' ? buildFilledBeats() : realBeats;
    const totalSpan = beats[beats.length - 1] - beats[0];
    timeline.innerHTML = beats.map((t, i) => {
      const isSynthetic = mode === 'fill' && t > segmentA[segmentA.length - 1] && t < segmentB[0];
      const left = (t / totalSpan) * 100;
      return `<span class="bbi-beat${isSynthetic ? ' bbi-beat-synthetic' : ''}" style="left:${left}%" title="${isSynthetic ? '填補產生的假心跳' : '真實心跳'}"></span>`;
    }).join('');
    const { value, n } = rmssd(beats, { excludeLargeGaps: mode === 'gap' });
    rmssdOut.textContent = value === null ? '–' : value.toFixed(1);
    countOut.textContent = `（採用 ${n} 個相鄰間隔）`;
    status.textContent = mode === 'gap'
      ? '目前顯示：保留缺口，只用同一段連續心跳的間隔計算 RMSSD。'
      : '目前顯示：用最後已知的 BBI（760 ms）向前填補缺口——填補區間的點是軟體生出來的假心跳，不是真實觀測。';
    gapBtn.setAttribute('aria-pressed', String(mode === 'gap'));
    fillBtn.setAttribute('aria-pressed', String(mode === 'fill'));
  }

  gapBtn.addEventListener('click', () => render('gap'));
  fillBtn.addEventListener('click', () => render('fill'));
  render('gap');
  });
}

function initPoincareDemos() {
  const scenarios = {
    rest: { label: '安靜休息', mean: 900, sd1: 38, sd2: 76, seed: 11 },
    recovery: { label: '運動後早期恢復', mean: 560, sd1: 10, sd2: 25, seed: 23 },
    fitHigh: { label: '心肺適能較高', mean: 970, sd1: 47, sd2: 91, seed: 31 },
    fitLow: { label: '心肺適能較低', mean: 810, sd1: 25, sd2: 53, seed: 43 },
    active: { label: '規律運動', mean: 920, sd1: 42, sd2: 82, seed: 59 },
    sedentary: { label: '久坐情境', mean: 840, sd1: 28, sd2: 59, seed: 71 }
  };
  const comparisons = {
    'rest-recovery': {
      keys: ['rest', 'recovery'],
      note: '運動後早期恢復的模擬點雲較集中、平均 BBI 較短；實際恢復速度需依相同個體與相同時間窗比較。'
    },
    fitness: {
      keys: ['fitHigh', 'fitLow'],
      note: '這是「較高適能可能伴隨較高靜息迷走神經相關 HRV」的研究假設，不代表每位高適能者都會有較大的點雲。'
    },
    habit: {
      keys: ['active', 'sedentary'],
      note: '規律運動與久坐是不同構念；現有研究對久坐時間與 HRV 的關係並不一致，應分別量測與建模。'
    }
  };

  function random(seed) {
    let value = seed >>> 0;
    return () => {
      value = (1664525 * value + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function normalPair(rand) {
    const u1 = Math.max(rand(), 1e-9);
    const u2 = rand();
    const radius = Math.sqrt(-2 * Math.log(u1));
    return [radius * Math.cos(2 * Math.PI * u2), radius * Math.sin(2 * Math.PI * u2)];
  }

  function makePoints(scenario) {
    const rand = random(scenario.seed);
    const points = [];
    for (let i = 0; i < 110; i++) {
      const [along, across] = normalPair(rand);
      points.push({
        x: scenario.mean + (scenario.sd2 * along - scenario.sd1 * across) / Math.SQRT2,
        y: scenario.mean + (scenario.sd2 * along + scenario.sd1 * across) / Math.SQRT2
      });
    }
    return points;
  }

  function draw(canvas, scenario) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const pad = 36;
    const min = 400;
    const max = 1150;
    const scaleX = value => pad + ((value - min) / (max - min)) * (width - pad * 2);
    const scaleY = value => height - pad - ((value - min) / (max - min)) * (height - pad * 2);
    const styles = getComputedStyle(document.documentElement);
    const grid = styles.getPropertyValue('--tertiary').trim() || '#d6d6d6';
    const textColor = styles.getPropertyValue('--secondary').trim() || '#6b7280';
    const accent = styles.getPropertyValue('--accent').trim() || '#0d7377';

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = grid;
    ctx.fillStyle = textColor;
    ctx.font = '11px sans-serif';
    ctx.lineWidth = 1;
    [500, 700, 900, 1100].forEach(tick => {
      const x = scaleX(tick);
      const y = scaleY(tick);
      ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, height - pad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(width - pad, y); ctx.stroke();
      ctx.fillText(String(tick), x - 10, height - 16);
      ctx.fillText(String(tick), 4, y + 4);
    });
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = textColor;
    ctx.beginPath(); ctx.moveTo(scaleX(min), scaleY(min)); ctx.lineTo(scaleX(max), scaleY(max)); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = accent;
    ctx.globalAlpha = .58;
    makePoints(scenario).forEach(point => {
      ctx.beginPath();
      ctx.arc(scaleX(point.x), scaleY(point.y), 2.4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = textColor;
    ctx.fillText('BBI(n) ms', width / 2 - 24, height - 2);
    ctx.save();
    ctx.translate(11, height / 2 + 28);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('BBI(n+1) ms', 0, 0);
    ctx.restore();
  }

  document.querySelectorAll('[data-poincare-demo]').forEach(demo => {
    const grid = demo.querySelector('[data-poincare-grid]');
    const note = demo.querySelector('[data-poincare-note]');

    function render(comparisonId) {
      const comparison = comparisons[comparisonId];
      grid.innerHTML = comparison.keys.map((key, index) => {
        const scenario = scenarios[key];
        const heartRate = Math.round(60000 / scenario.mean);
        const rmssd = scenario.sd1 * Math.SQRT2;
        return `<section class="poincare-card"><h3>${scenario.label}</h3><canvas width="330" height="300" data-scenario="${key}" aria-label="${scenario.label}的模擬 Poincaré plot"></canvas><dl><div><dt>平均心率</dt><dd>${heartRate} bpm</dd></div><div><dt>RMSSD</dt><dd>${rmssd.toFixed(1)} ms</dd></div><div><dt>SD1</dt><dd>${scenario.sd1} ms</dd></div><div><dt>SD2</dt><dd>${scenario.sd2} ms</dd></div></dl></section>`;
      }).join('');
      grid.querySelectorAll('canvas').forEach(canvas => draw(canvas, scenarios[canvas.dataset.scenario]));
      note.textContent = comparison.note;
      demo.querySelectorAll('[data-comparison]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.comparison === comparisonId)));
    }

    demo.querySelectorAll('[data-comparison]').forEach(button => button.addEventListener('click', () => render(button.dataset.comparison)));
    render('rest-recovery');
  });
}

function initCfcDemo() {
  const demo = document.querySelector('#cfcDemo');
  if (!demo) return;
  const canvas = demo.querySelector('#cfcCanvas');
  const ctx = canvas.getContext('2d');
  const slider = demo.querySelector('#cfcSlider');
  const valueOut = demo.querySelector('#cfcValue');
  const width = canvas.width;
  const height = canvas.height;
  const midY = height / 2;
  const slowFreq = 1.4; // cycles across the canvas — stands in for a slow rhythm (e.g. theta)
  const fastFreq = 18; // cycles across the canvas — stands in for a fast rhythm (e.g. gamma)

  function draw(couplingPct) {
    const coupling = couplingPct / 100;
    ctx.clearRect(0, 0, width, height);
    const styles = getComputedStyle(document.documentElement);
    const gridColor = styles.getPropertyValue('--tertiary').trim() || '#d6d6d6';
    const slowColor = '#2f6fed';
    const fastColor = styles.getPropertyValue('--accent').trim() || '#0d7377';

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // Slow rhythm (phase reference)
    ctx.strokeStyle = slowColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= width; x++) {
      const phase = (x / width) * slowFreq * 2 * Math.PI;
      const y = midY - Math.sin(phase) * (height * 0.28);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Fast rhythm, amplitude modulated by the slow rhythm's phase (phase-amplitude coupling)
    ctx.strokeStyle = fastColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= width; x++) {
      const slowPhase = (x / width) * slowFreq * 2 * Math.PI;
      const envelope = 1 - coupling + coupling * (1 + Math.cos(slowPhase)) / 2;
      const fastPhase = (x / width) * fastFreq * 2 * Math.PI;
      const y = midY - Math.sin(fastPhase) * envelope * (height * 0.16);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Envelope guide (dashed)
    ctx.strokeStyle = fastColor;
    ctx.globalAlpha = 0.45;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x++) {
      const slowPhase = (x / width) * slowFreq * 2 * Math.PI;
      const envelope = 1 - coupling + coupling * (1 + Math.cos(slowPhase)) / 2;
      const y = midY - envelope * (height * 0.16);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  slider.addEventListener('input', () => {
    valueOut.textContent = `${slider.value}%`;
    draw(Number(slider.value));
  });
  valueOut.textContent = `${slider.value}%`;
  draw(Number(slider.value));
}

function initFilterDemo() {
  const demo = document.querySelector('#filterDemo');
  if (!demo) return;
  const canvas = demo.querySelector('#filterCanvas');
  const ctx = canvas.getContext('2d');
  const hpSlider = demo.querySelector('#hpSlider');
  const lpSlider = demo.querySelector('#lpSlider');
  const hpValue = demo.querySelector('#hpValue');
  const lpValue = demo.querySelector('#lpValue');
  const width = canvas.width;
  const height = canvas.height;
  const midY = height / 2;
  const fs = 250; // Hz
  const n = 500; // 2 seconds of synthetic signal
  const dt = 1 / fs;

  const raw = [];
  for (let i = 0; i < n; i++) {
    const t = i * dt;
    const drift = 35 * Math.sin(2 * Math.PI * 0.2 * t);
    const alphaWave = 12 * Math.sin(2 * Math.PI * 10 * t);
    const lineNoise = 6 * Math.sin(2 * Math.PI * 58 * t);
    const jitter = (Math.random() - 0.5) * 2;
    raw.push(drift + alphaWave + lineNoise + jitter);
  }

  function highPass(x, cutoffHz) {
    if (cutoffHz <= 0) return x.slice();
    const rc = 1 / (2 * Math.PI * cutoffHz);
    const alpha = rc / (rc + dt);
    const y = [x[0]];
    for (let i = 1; i < x.length; i++) {
      y.push(alpha * (y[i - 1] + x[i] - x[i - 1]));
    }
    return y;
  }

  function lowPass(x, cutoffHz) {
    if (cutoffHz >= fs / 2) return x.slice();
    const rc = 1 / (2 * Math.PI * cutoffHz);
    const alpha = dt / (rc + dt);
    const y = [x[0]];
    for (let i = 1; i < x.length; i++) {
      y.push(y[i - 1] + alpha * (x[i] - y[i - 1]));
    }
    return y;
  }

  function drawSeries(series, color, lineWidth, scale) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    series.forEach((v, i) => {
      const x = (i / (series.length - 1)) * width;
      const y = midY - v * scale;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function render() {
    const hp = Number(hpSlider.value) / 10; // slider steps of 1 => 0.1 Hz resolution
    const lp = Number(lpSlider.value);
    hpValue.textContent = `${hp.toFixed(1)} Hz`;
    lpValue.textContent = `${lp} Hz`;
    const filtered = lowPass(highPass(raw, hp), lp);
    const scale = height / 140;
    ctx.clearRect(0, 0, width, height);
    const styles = getComputedStyle(document.documentElement);
    ctx.strokeStyle = styles.getPropertyValue('--tertiary').trim() || '#d6d6d6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();
    drawSeries(raw, '#9b9c9d', 1, scale);
    drawSeries(filtered, styles.getPropertyValue('--accent').trim() || '#0d7377', 2, scale);
  }

  hpSlider.addEventListener('input', render);
  lpSlider.addEventListener('input', render);
  render();
}

async function renderPost(id) {
  const [posts, response] = await Promise.all([getPosts(), fetchSiteFile(`posts/${id}.md`)]);
  const meta = posts.find(post => post.id === id);
  const versions = parseArticleVersions(await response.text());
  const selectedVersion = localStorage.getItem('tingting-article-version') === 'professional' ? 'professional' : 'simple';
  const c = t();
  app.innerHTML = `<article class="article-shell"><a class="back-link" href="#/blog">${c.back}</a><header class="article-header"><div class="post-meta">${meta ? `${categoryLabel(meta.category)} · ${meta.date}` : ''}</div><h1>${meta?.title || ''}</h1>${meta?.description ? `<p>${meta.description}</p>` : ''}${meta ? tagList(meta) : ''}</header>
    <div class="version-bar"><div class="version-toggle" role="group" aria-label="${lang === 'zh' ? '文章版本切換' : 'Article version'}"><button type="button" data-version="simple" aria-pressed="${selectedVersion === 'simple'}">${c.simpleVersion}</button><button type="button" data-version="professional" aria-pressed="${selectedVersion === 'professional'}">${c.professionalVersion}</button></div><p>${c.versionHint}</p></div>
    <div class="article-version markdown-body" data-version-content="simple" ${selectedVersion !== 'simple' ? 'hidden' : ''}>${safeMarkdownParse(versions.simple)}</div>
    <div class="article-version markdown-body" data-version-content="professional" ${selectedVersion !== 'professional' ? 'hidden' : ''}>${safeMarkdownParse(versions.professional)}</div></article>`;
  document.querySelectorAll('.version-toggle button').forEach(button => button.addEventListener('click', () => {
    const version = button.dataset.version;
    localStorage.setItem('tingting-article-version', version);
    document.querySelectorAll('.version-toggle button').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.version === version)));
    document.querySelectorAll('[data-version-content]').forEach(content => { content.hidden = content.dataset.versionContent !== version; });
  }));
  document.querySelectorAll('.markdown-body img').forEach(image => {
    image.loading = 'lazy';
    image.decoding = 'async';
  });
  if (typeof window.hljs !== 'undefined' && typeof window.hljs.highlightElement === 'function') {
    document.querySelectorAll('pre code').forEach(block => {
      try { window.hljs.highlightElement(block); } catch (e) {}
    });
  }
  renderMermaidNodes('.markdown-body .mermaid');
  initCorsiDemo();
  initConflictDemo();
  initCardSortDemo();
  initReactionDemo();
  initBbiDemo();
  initPoincareDemos();
  initCfcDemo();
  initFilterDemo();
}

async function router() {
  if (!app) return;
  closeMenu();
  updateChrome();
  app.innerHTML = '<div class="loading">Loading<span>…</span></div>';
  const path = location.hash.slice(1) || '/';
  try {
    if (path === '/') await renderHome();
    else if (path === '/about' || path.startsWith('/about/')) await renderAbout(path.split('/')[2] || '');
    else if (path === '/publications') await renderPublications();
    else if (path === '/blog' || path.startsWith('/blog/')) await renderBlog(path.split('/')[2] || 'all');
    else if (path.startsWith('/post/')) await renderPost(path.split('/')[2]);
    else app.innerHTML = `<div class="error-state"><h1>${t()?.notFound || 'Page Not Found'}</h1></div>`;
  } catch (error) {
    console.error('Router error:', error);
    const title = lang === 'zh' ? '網站內容暫時無法載入' : 'The site content could not be loaded';
    const message = lang === 'zh' ? '請檢查網路連線後再試一次；若網站剛更新，也可以重新載入取得最新版本。' : 'Check your connection and try again. If the site was just updated, reload to get the latest version.';
    const retry = lang === 'zh' ? '重新載入' : 'Reload';
    app.innerHTML = `<div class="error-state"><h1>${title}</h1><p>${message}</p><button id="route-retry" type="button">${retry}</button></div>`;
    document.querySelector('#route-retry')?.addEventListener('click', router);
  }
  window.scrollTo(0, 0);
  if (app.focus) app.focus({ preventScroll: true });
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('tingting-language', lang);
    router();
  });
}
if (menuToggle && navPanel) {
  menuToggle.addEventListener('click', () => {
    const open = navPanel.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    updateMenuLabel();
  });
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (dark) delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = 'dark';
    localStorage.setItem('tingting-theme', dark ? 'light' : 'dark');
    updateThemeChrome();
  });
}
if (topLink) {
  topLink.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => topLink.classList.toggle('is-visible', window.scrollY > 700), { passive: true });
}
window.addEventListener('hashchange', router);
window.addEventListener('markdownready', () => {
  const path = location.hash.slice(1) || '/';
  if (path === '/publications' || path.startsWith('/post/')) router();
});
window.addEventListener('mermaidready', () => renderMermaidNodes());
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

updateChrome();
router();
