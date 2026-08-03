const app = document.querySelector('#app');
const navLinks = document.querySelector('#nav-links');
const langToggle = document.querySelector('#lang-toggle');
const menuToggle = document.querySelector('#menu-toggle');
const navPanel = document.querySelector('#nav-panel');
const themeToggle = document.querySelector('#theme-toggle');
const topLink = document.querySelector('#top-link');

let lang = localStorage.getItem('tingting-language') || 'zh';

const copy = {
  zh: {
    nav: [['首頁', '/'], ['關於', '/about'], ['文章', '/blog']],
    footer: '探索身體活動如何改變大腦與心智。',
    heroLead: '我是吳亭葶，一位認知神經科學博士生與運動防護員。我研究身體活動、執行功能與心理健康之間的關係，並運用資料與 AI 把複雜問題變得清楚。',
    profileRole: '認知神經科學博士生 · 國立中央大學',
    profilePillars: '認知神經科學 × 運動科學 × AI 資料分析',
    fullProfile: '完整學經歷與發表 →',
    selectedAreas: '研究主軸',
    topicsTitle: '專長與興趣',
    focuses: [
      ['運動與情緒和認知功能', '研究身體活動如何影響情緒與認知功能。'],
      ['認知神經科學', '運用 EEG 與行為測量，探索執行功能、神經可塑性及運動後的認知變化。'],
      ['AI 與資料分析', '使用 Python、Matlab 與統計工具，建立透明、有效率且可重現的研究流程。']
    ],
    facts: [['9+', '期刊論文'], ['14+', '研討會發表'], ['3', '核心研究領域']],
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
    footer: 'Exploring how physical activity shapes the mind.',
    heroLead: 'I am Ting-Ting Wu, a Ph.D. student in cognitive neuroscience and a certified athletic trainer. I study physical activity, executive function, and healthy aging—and use data and AI to make complex questions clearer.',
    profileRole: 'Ph.D. Student in Cognitive Neuroscience · National Central University',
    profilePillars: 'Cognitive Neuroscience × Exercise Science × AI & Data',
    fullProfile: 'Full profile & publications →',
    selectedAreas: 'Research pillars',
    topicsTitle: 'Expertise & interests',
    focuses: [
      ['Cognitive neuroscience', 'Using EEG and behavioral measures to study executive function, neuroplasticity, and post-exercise cognitive change.'],
      ['Exercise & healthy aging', 'Studying how resistance exercise, aerobic activity, and daily movement support brain health in older adults.'],
      ['AI & data analysis', 'Using Python, Matlab, and statistical tools to build transparent, efficient, reproducible research workflows.']
    ],
    facts: [['9+', 'Journal articles'], ['14+', 'Conference presentations'], ['3', 'Research pillars']],
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
  app.innerHTML = `<div class="page-shell home-shell">
    <section class="profile-hero">
      <div class="avatar-wrap"><img src="https://github.com/wttntpc.png?size=240" alt="Ting-Ting Wu" width="120" height="120" onerror="this.style.display='none'"><span aria-hidden="true">TW</span></div>
      <div class="profile-id">
        <h1>${lang === 'zh' ? '吳亭葶' : 'Ting-Ting Wu'} <span>${lang === 'zh' ? 'Ting-Ting Wu' : '吳亭葶'}</span></h1>
        <p class="profile-role">${c.profileRole}</p>
        <p class="profile-pillars">${c.profilePillars}</p>
        <p class="profile-intro">${c.heroLead}</p>
        <div class="profile-links"><a href="#/about">${c.fullProfile}</a><a href="https://orcid.org/0009-0003-2432-9812" target="_blank" rel="noopener noreferrer">ORCID ↗</a><a href="https://scholar.google.com.tw/citations?user=uHNX07sAAAAJ&amp;hl=zh-TW" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a></div>
      </div>
    </section>
    <section class="home-block"><h2>${c.selectedAreas}</h2><div class="pillar-grid">${c.focuses.map(item => `<a class="pillar-card" href="#/about/skills"><b>${item[0]}</b><span>${item[1]}</span></a>`).join('')}</div></section>
    <section class="home-stats">${c.facts.map(item => `<span><b>${item[0]}</b> ${item[1]}</span>`).join('<i>·</i>')}</section>
    <section class="home-block topics-block"><h2>${c.topicsTitle}</h2><div class="topic-chips">${c.skills.map(topic => `<span>${topic}</span>`).join('')}</div></section>
    <section class="home-block latest-section"><div class="block-heading"><h2>${c.latestTitle}</h2><a href="#/blog">${c.allPosts}</a></div><div class="post-list">${posts.map(postRow).join('')}</div></section>
  </div>`;
}

async function renderAbout(section = '') {
  const c = t();
  let publications = '';
  try {
    const response = await fetch('posts/publications.md');
    if (response.ok) publications = marked.parse(await response.text());
  } catch (_) { publications = '<p>Publications are being updated.</p>'; }

  const labels = lang === 'zh' ? {
    home: '首頁', title: '關於我', meta: '吳亭葶 Ting-Ting Wu', language: '語言：English', toc: '目錄',
    role: '認知神經科學博士生 / 運動防護員 / 研究者', education: '學經歷', expertise: '專長領域', honors: '榮譽', contact: '聯繫',
    bio2: '我的研究位於運動科學與認知神經科學的交界，關注運動強度、身體活動與靜態行為如何影響執行功能、情緒及健康老化。除了實驗研究，我也持續探索 AI 與可重現資料分析如何改善研究工作流程。'
  } : {
    home: 'Home', title: 'About', meta: 'Ting-Ting Wu', language: 'Language: 中文', toc: 'Table of contents',
    role: 'Ph.D. Student in Cognitive Neuroscience / Athletic Trainer / Researcher', education: 'Education & experience', expertise: 'Expertise', honors: 'Honors', contact: 'Contact',
    bio2: 'My work sits at the intersection of exercise science and cognitive neuroscience. I study how exercise intensity, physical activity, and sedentary behavior shape executive function, emotion, and healthy aging, while exploring reproducible data analysis and AI-enabled research workflows.'
  };
  const tocItems = [[c.introTitle, 'intro'], [labels.education, 'journey'], [labels.expertise, 'skills'], [c.pubTitle, 'publications'], [labels.honors, 'awards'], [labels.contact, 'contact']];

  app.innerHTML = `<div class="page-shell about-page"><article class="about-article">
    <header class="post-header">
      <div class="breadcrumbs"><a href="#/">${labels.home}</a></div>
      <h1>${labels.title}</h1>
      <div class="page-meta"><span>${labels.meta}</span><span>·</span><button type="button" class="inline-language">${labels.language}</button></div>
    </header>
    <details class="about-toc" open><summary>${labels.toc}</summary><nav>${tocItems.map(item => `<a href="#/about/${item[1]}" ${section === item[1] ? 'aria-current="location"' : ''}>${item[0]}</a>`).join('')}</nav></details>
    <div class="about-content">
      <p class="about-avatar"><span><img src="https://github.com/wttntpc.png?size=280" alt="Ting-Ting Wu" width="140" height="140" onerror="this.style.display='none'"><b aria-hidden="true">TW</b></span></p>
      <section id="about-intro" class="about-section"><h2>${lang === 'zh' ? '吳亭葶 Ting-Ting Wu' : 'Ting-Ting Wu 吳亭葶'}</h2><blockquote><strong>${labels.role}</strong></blockquote><p>${c.introText}</p><p>${labels.bio2}</p></section>
      <section id="about-journey" class="about-section"><h2>${labels.education}</h2><ul class="plain-list">${c.journey.map(item => `<li><strong>${item[0]}</strong>　${item[1]}<br><span>${item[2]}</span></li>`).join('')}</ul></section>
      <section id="about-skills" class="about-section"><h2>${labels.expertise}</h2><ul class="expertise-list">${c.focuses.map(item => `<li><strong>${item[0]}</strong>：${item[1]}</li>`).join('')}<li><strong>${c.skillsTitle}</strong>：${c.skills.join('、')}</li></ul></section>
      <section id="about-publications" class="about-section publications"><div class="publication-links"><a href="https://orcid.org/0009-0003-2432-9812" target="_blank" rel="noopener noreferrer">ORCID ↗</a><a href="https://scholar.google.com.tw/citations?user=uHNX07sAAAAJ&amp;hl=zh-TW" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a></div><div class="markdown-body">${publications}</div></section>
      <section id="about-awards" class="about-section"><h2>${labels.honors}</h2><ul class="plain-list">${c.awards.map(item => `<li><strong>${item[0]}</strong>　${item[1]}</li>`).join('')}</ul></section>
      <section id="about-contact" class="about-section"><h2>${labels.contact}</h2><ul><li>Email：<a href="mailto:wtt.ntpc@gmail.com">wtt.ntpc@gmail.com</a></li><li><a href="https://orcid.org/0009-0003-2432-9812" target="_blank" rel="noopener noreferrer">ORCID</a></li><li><a href="https://scholar.google.com.tw/citations?user=uHNX07sAAAAJ&amp;hl=zh-TW" target="_blank" rel="noopener noreferrer">Google Scholar</a></li><li><a href="https://github.com/wttntpc" target="_blank" rel="noopener noreferrer">GitHub</a></li></ul></section>
    </div>
  </article></div>`;
  document.querySelector('.inline-language').addEventListener('click', () => langToggle.click());
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
themeToggle.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  if (dark) delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = 'dark';
  localStorage.setItem('tingting-theme', dark ? 'light' : 'dark');
});
topLink.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => topLink.classList.toggle('is-visible', window.scrollY > 700), { passive: true });
window.addEventListener('hashchange', router);
document.querySelector('#year').textContent = new Date().getFullYear();
updateChrome();
router();
