const app = document.querySelector('#app');
const navLinks = document.querySelector('#nav-links');
const langToggle = document.querySelector('#lang-toggle');
const menuToggle = document.querySelector('#menu-toggle');
const navPanel = document.querySelector('#nav-panel');

let lang = localStorage.getItem('tingting-language') || 'zh';

const copy = {
  zh: {
    nav: [['首頁', '/'], ['關於', '/about'], ['文章', '/blog']],
    footer: '探索身體活動如何改變大腦與心智。',
    heroEyebrow: '吳亭葶 Ting-Ting Wu · Academic Portfolio',
    heroTitle: 'Cognitive Neuroscience<br><em>× Exercise Science</em>',
    heroLead: '我是吳亭葶，一位認知神經科學博士生與運動防護員。我研究身體活動、執行功能與健康老化之間的關係，並運用資料與 AI 把複雜問題變得清楚。',
    aboutButton: '認識我的研究 <span>↗</span>',
    pubButton: '瀏覽學術著作',
    heroNote: '國立中央大學博士生 · 運動防護員 · 臺灣',
    focusEyebrow: 'Research focus',
    focusTitle: '研究領域',
    focusIntro: '我的工作橫跨實驗室與實務現場，關注不同運動刺激如何影響認知功能，並以可重現的分析方法連結科學證據與真實世界。',
    focuses: [
      ['認知神經科學', '運用 EEG 與行為測量，探索執行功能、神經可塑性及運動後的認知變化。'],
      ['運動與健康老化', '研究阻力運動、有氧運動與身體活動如何支持高齡者的大腦與日常功能。'],
      ['AI 與資料分析', '使用 Python、Matlab 與統計工具，建立透明、有效率且可重現的研究流程。']
    ],
    factsLabel: '學術成果概覽',
    facts: [['9+', '期刊論文'], ['14+', '研討會發表'], ['3', '核心研究領域']],
    latestEyebrow: 'Notes & updates',
    latestTitle: '最近的文章',
    allPosts: '查看所有文章 →',
    aboutEyebrow: 'About me',
    aboutTitle: '研究大腦，<br>也理解身體。',
    aboutDesc: '從運動傷害防護走進認知神經科學，我持續尋找能讓人活得更健康、更清醒的科學答案。',
    asideTitle: '頁面導覽',
    aside: [['簡介','intro'], ['學歷與經歷','journey'], ['專業技能','skills'], ['獲獎紀錄','awards'], ['學術著作','publications']],
    introTitle: '關於我',
    introText: '你好，我是吳亭葶。我目前就讀國立中央大學認知神經科學研究所博士班，也是一名具備實務經驗的運動防護員。我的研究關心身體活動如何改變執行功能、情緒與腦部健康，特別聚焦於高齡族群。',
    journeyTitle: '學歷與經歷',
    journey: [
      ['2025—至今', '國立中央大學・認知神經科學研究所博士班', '研究方向：運動、執行功能與認知神經科學'],
      ['2023—2025', '國立清華大學・運動科學系碩士', '運動心理學、認知與健康老化研究'],
      ['2019—2023', '中國醫藥大學・運動醫學系', '運動醫學與運動傷害防護'],
      ['2024—2026', '《運動表現期刊》編輯助理', '學術出版與編輯工作'],
      ['2022—2025', '研究助理與課程助教', '參與多項國科會研究計畫及教學工作']
    ],
    skillsTitle: '專業技能',
    skills: ['EEG／腦電圖', 'VO₂max／體適能測量', 'EEGLAB', 'SPM12', 'HHSA toolbox', 'Python', 'Matlab', 'SPSS', 'JASP', '運動防護', 'EMT-1', '高齡體適能'],
    awardsTitle: '獲獎紀錄',
    awards: [
      ['2025', '教育部博士生獎學金、中央大學博士班入學獎學金'],
      ['2025', '中華民國斐陶斐榮譽學會榮譽會員'],
      ['2025', '第十二屆國際競技與健身運動心理學研討會・最佳口頭發表'],
      ['2023', '台灣運動心理學會年會・海報發表優秀論文獎'],
      ['2021–22', '中國醫藥大學運動醫學系・學業績優獎']
    ],
    pubTitle: '學術著作',
    blogEyebrow: 'Writing',
    blogTitle: '研究筆記與想法',
    blogDesc: '關於認知神經科學、運動健康、資料分析與 AI 工作流的觀察。',
    back: '← 返回文章列表',
    notFound: '找不到這個頁面。'
  },
  en: {
    nav: [['Home', '/'], ['About', '/about'], ['Writing', '/blog']],
    footer: 'Exploring how movement shapes the mind.',
    heroEyebrow: 'Ting-Ting Wu · Academic Portfolio',
    heroTitle: 'Cognitive Neuroscience<br><em>× Exercise Science</em>',
    heroLead: 'I am Ting-Ting Wu, a Ph.D. student in cognitive neuroscience and a certified athletic trainer. I study physical activity, executive function, and healthy aging—and use data and AI to make complex questions clearer.',
    aboutButton: 'Explore my research <span>↗</span>',
    pubButton: 'View publications',
    heroNote: 'Ph.D. Student · Athletic Trainer · Taiwan',
    focusEyebrow: 'Research focus',
    focusTitle: 'Research areas',
    focusIntro: 'My work bridges laboratory research and real-world practice, examining how different exercise stimuli affect cognition through transparent, reproducible analysis.',
    focuses: [
      ['Cognitive neuroscience', 'Using EEG and behavioral measures to study executive function, neuroplasticity, and post-exercise cognitive change.'],
      ['Exercise & healthy aging', 'Studying how resistance exercise, aerobic activity, and daily movement support brain health in older adults.'],
      ['AI & data analysis', 'Using Python, Matlab, and statistical tools to build transparent, efficient, reproducible research workflows.']
    ],
    factsLabel: 'Research at a glance',
    facts: [['9+', 'Journal articles'], ['14+', 'Conference presentations'], ['3', 'Research pillars']],
    latestEyebrow: 'Notes & updates',
    latestTitle: 'Latest writing',
    allPosts: 'See all writing →',
    aboutEyebrow: 'About me',
    aboutTitle: 'Studying the brain,<br>understanding the body.',
    aboutDesc: 'My path from athletic training to cognitive neuroscience is driven by one question: how can science help us live healthier, sharper lives?',
    asideTitle: 'On this page',
    aside: [['Profile','intro'], ['Education & work','journey'], ['Skills','skills'], ['Honors','awards'], ['Publications','publications']],
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
    skillsTitle: 'Methods & skills',
    skills: ['EEG', 'VO₂max testing', 'EEGLAB', 'SPM12', 'HHSA toolbox', 'Python', 'Matlab', 'SPSS', 'JASP', 'Athletic training', 'EMT-1', 'Senior fitness'],
    awardsTitle: 'Selected honors',
    awards: [
      ['2025', 'MOE Ph.D. Scholarship & NCU Entrance Scholarship'],
      ['2025', 'Phi Tau Phi Scholastic Honor Society'],
      ['2025', 'Best Oral Presentation, 12th ISSEP'],
      ['2023', 'Outstanding Poster Award, SSEPT Annual Conference'],
      ['2021–22', 'Academic Excellence Awards, CMU']
    ],
    pubTitle: 'Publications',
    blogEyebrow: 'Writing',
    blogTitle: 'Research notes & ideas',
    blogDesc: 'Observations on cognitive neuroscience, exercise and health, data analysis, and AI-enabled research.',
    back: '← Back to writing',
    notFound: 'This page could not be found.'
  }
};

const t = () => copy[lang];

function updateChrome() {
  const path = (location.hash.slice(1) || '/').split('/').slice(0, 2).join('/') || '/';
  navLinks.innerHTML = t().nav.map(([label, href]) =>
    `<li><a href="#${href}" ${path === href ? 'aria-current="page"' : ''}>${label}</a></li>`
  ).join('');
  langToggle.textContent = lang === 'zh' ? 'EN' : '中文';
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.querySelector('#footer-tagline').textContent = t().footer;
}

function closeMenu() {
  navPanel.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

async function getPosts() {
  const response = await fetch('posts.json');
  if (!response.ok) throw new Error('Unable to load posts');
  return response.json();
}

function postRow(post) {
  return `<a class="post-card" href="#/post/${post.id}">
    <div class="post-meta">${post.category}<br>${post.date}</div>
    <div><h3>${post.title}</h3><p>${post.description}</p></div>
    <span class="post-arrow" aria-hidden="true">→</span>
  </a>`;
}

async function renderHome() {
  const posts = (await getPosts()).filter(post => post.id !== 'publications').slice(0, 2);
  const c = t();
  app.innerHTML = `<div class="page-shell">
    <section class="hero editorial-hero">
      <div class="hero-copy">
        <p class="eyebrow">${c.heroEyebrow}</p>
        <h1 class="display">${c.heroTitle}</h1>
        <p class="hero-lead">${c.heroLead}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#/about">${c.aboutButton}</a>
          <a class="button button-secondary" href="#/about/publications">${c.pubButton}</a>
        </div>
        <p class="hero-credential">${c.heroNote}</p>
      </div>
    </section>
    <section class="focus-section">
      <div class="section-intro">
        <div><p class="eyebrow">${c.focusEyebrow}</p><h2 class="section-heading">${c.focusTitle}</h2></div>
        <p>${c.focusIntro}</p>
      </div>
      <div class="focus-grid">${c.focuses.map((item, i) => `<article class="focus-card"><span class="focus-number">0${i + 1}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('')}</div>
    </section>
  </div>
  <section class="facts"><div class="fact-label">${c.factsLabel}</div>${c.facts.map(item => `<div class="fact"><strong>${item[0]}</strong><span>${item[1]}</span></div>`).join('')}</section>
  <div class="page-shell"><section class="latest-section">
    <div class="latest-head"><div><p class="eyebrow">${c.latestEyebrow}</p><h2 class="section-heading">${c.latestTitle}</h2></div><a class="text-link" href="#/blog">${c.allPosts}</a></div>
    <div class="post-list">${posts.map(postRow).join('')}</div>
  </section></div>`;
}

async function renderAbout(section = '') {
  const c = t();
  let publications = '';
  try {
    const response = await fetch('posts/publications.md');
    if (response.ok) publications = marked.parse(await response.text());
  } catch (_) { publications = '<p>Publications are being updated.</p>'; }

  app.innerHTML = `<div class="page-shell">
    <header class="inner-hero"><p class="eyebrow">${c.aboutEyebrow}</p><h1 class="display">${c.aboutTitle}</h1><p>${c.aboutDesc}</p></header>
    <div class="about-layout">
      <aside class="about-aside"><span class="aside-label">${c.asideTitle}</span><ul>${c.aside.map(item => `<li><a href="#/about/${item[1]}" ${section === item[1] ? 'aria-current="location"' : ''}>${item[0]}</a></li>`).join('')}</ul><a class="button button-secondary" href="mailto:wtt.ntpc@gmail.com">Email me ↗</a></aside>
      <div class="about-main">
        <section id="about-intro"><h2>${c.introTitle}</h2><p class="lead">${c.introText}</p></section>
        <section id="about-journey"><h2>${c.journeyTitle}</h2><div class="timeline">${c.journey.map(item => `<div class="timeline-item"><time>${item[0]}</time><h3>${item[1]}</h3><p>${item[2]}</p></div>`).join('')}</div></section>
        <section id="about-skills"><h2>${c.skillsTitle}</h2><div class="tag-cloud">${c.skills.map(skill => `<span>${skill}</span>`).join('')}</div></section>
        <section id="about-awards"><h2>${c.awardsTitle}</h2><ul class="award-list">${c.awards.map(item => `<li><strong>${item[0]}</strong><span>${item[1]}</span></li>`).join('')}</ul></section>
        <section id="about-publications" class="publications"><div class="publication-heading"><div><span class="aside-label">Academic work</span><h2>${c.pubTitle}</h2></div><div class="publication-profiles"><a href="https://orcid.org/0009-0003-2432-9812" target="_blank" rel="noopener noreferrer">ORCID ↗</a><a href="https://scholar.google.com.tw/citations?user=uHNX07sAAAAJ&amp;hl=zh-TW" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a></div></div><div class="markdown-body">${publications}</div></section>
      </div>
    </div>
  </div>`;
  if (section) {
    requestAnimationFrame(() => document.querySelector(`#about-${CSS.escape(section)}`)?.scrollIntoView());
  }
}

async function renderBlog() {
  const posts = (await getPosts()).filter(post => post.id !== 'publications');
  const c = t();
  app.innerHTML = `<div class="page-shell"><header class="inner-hero"><p class="eyebrow">${c.blogEyebrow}</p><h1 class="display">${c.blogTitle}</h1><p>${c.blogDesc}</p></header>
    <div class="blog-grid">${posts.map(post => `<a class="blog-card" href="#/post/${post.id}"><div class="post-meta">${post.category} · ${post.date}</div><h2>${post.title}</h2><p>${post.description}</p></a>`).join('')}</div></div>`;
}

async function renderPost(id) {
  const [posts, response] = await Promise.all([getPosts(), fetch(`posts/${id}.md`)]);
  if (!response.ok) throw new Error('Post not found');
  const meta = posts.find(post => post.id === id);
  const body = marked.parse(await response.text());
  app.innerHTML = `<article class="article-shell"><a class="back-link" href="#/blog">${t().back}</a><header class="article-header"><div class="post-meta">${meta ? `${meta.category} · ${meta.date}` : ''}</div><h1>${meta?.title || ''}</h1>${meta?.description ? `<p>${meta.description}</p>` : ''}</header><div class="markdown-body">${body}</div></article>`;
  document.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
}

async function router() {
  closeMenu();
  updateChrome();
  app.innerHTML = '<div class="loading">Loading<span>...</span></div>';
  const path = location.hash.slice(1) || '/';
  try {
    if (path === '/') await renderHome();
    else if (path === '/about' || path.startsWith('/about/')) await renderAbout(path.split('/')[2] || '');
    else if (path === '/blog') await renderBlog();
    else if (path.startsWith('/post/')) await renderPost(path.split('/')[2]);
    else app.innerHTML = `<div class="error-state"><h1>${t().notFound}</h1></div>`;
  } catch (error) {
    console.error(error);
    app.innerHTML = `<div class="error-state"><h1>${t().notFound}</h1></div>`;
  }
  window.scrollTo(0, 0);
  app.focus({ preventScroll: true });
}

langToggle.addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('tingting-language', lang);
  router();
});
menuToggle.addEventListener('click', () => {
  const open = navPanel.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
window.addEventListener('hashchange', router);
document.querySelector('#year').textContent = new Date().getFullYear();
updateChrome();
router();
