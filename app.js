const app = document.getElementById('app');
const navLinks = document.getElementById('nav-links');
const langToggle = document.getElementById('lang-toggle');

// Language State
let currentLang = localStorage.getItem('lang') || 'zh';

const i18n = {
  zh: {
    nav_home: '首頁',
    nav_blog: '文章',
    nav_about: '關於我',
    loading: '載入中...',
    not_found: '404 找不到網頁',
    hero_name: '吳亭葶 Ting-Ting Wu',
    hero_title: '認知神經科學博士生 & 運動防護員',
    hero_pills: ['徒手・運動治療', 'AI・程式開發', '學術研究'],
    btn_about: '完整學經歷 →',
    btn_pub: '學術文章列表 →',
    btn_blog: '閱讀文章 →',
    latest_posts: '最新文章',
    blog_title: '文章列表',
    back_to_blog: '← 返回文章列表',
    post_error: '無法載入文章，或者該文章不存在。'
  },
  en: {
    nav_home: 'Home',
    nav_blog: 'Blog',
    nav_about: 'About',
    loading: 'Loading...',
    not_found: '404 Page Not Found',
    hero_name: 'Ting-Ting Wu',
    hero_title: 'Ph.D. Student in Cognitive Neuroscience & Athletic Trainer',
    hero_pills: ['Manual Therapy', 'AI & Coding', 'Academic Research'],
    btn_about: 'Full CV →',
    btn_pub: 'Publications →',
    btn_blog: 'Read Blog →',
    latest_posts: 'Latest Posts',
    blog_title: 'Blog Posts',
    back_to_blog: '← Back to Blog',
    post_error: 'Failed to load post, or it does not exist.'
  }
};

function t(key) {
  return i18n[currentLang][key];
}

// Toggle Language
langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', currentLang);
  updateNav();
  router(); // re-render page
});

function updateNav() {
  langToggle.textContent = currentLang === 'zh' ? 'EN' : '中文';
  navLinks.innerHTML = `
    <li><a href="#/">${t('nav_home')}</a></li>
    <li><a href="#/blog">${t('nav_blog')}</a></li>
    <li><a href="#/about">${t('nav_about')}</a></li>
  `;
}

marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

async function router() {
  const hash = window.location.hash.slice(1) || '/';
  app.innerHTML = `<div style="text-align: center; padding: 3rem;">${t('loading')}</div>`;

  try {
    if (hash === '/') {
      await renderHome();
    } else if (hash === '/about') {
      await renderAbout();
    } else if (hash === '/blog') {
      await renderBlog();
    } else if (hash.startsWith('/post/')) {
      const postId = hash.split('/')[2];
      await renderPost(postId);
    } else {
      app.innerHTML = `<h1>${t('not_found')}</h1>`;
    }
  } catch (e) {
    console.error('Router error:', e);
    app.innerHTML = `<div style="text-align: center; padding: 3rem; color: red;">Error loading page: ${e.message}<br><button onclick="window.location.reload()" style="margin-top:1rem;padding:0.5rem 1rem;">Retry / 重新整理</button></div>`;
  }
}

async function renderHome() {
  const res = await fetch('posts.json');
  const posts = await res.json();
  const recentPosts = posts.filter(p => p.id !== 'publications').slice(0, 2);

  let html = `
    <section class="hero">
      <img src="https://ui-avatars.com/api/?name=Ting-Ting+Wu&background=334155&color=fff&size=140" alt="Avatar" class="avatar" />
      <div>
        <h1>${t('hero_name')}</h1>
        <p>${t('hero_title')}</p>
        <div class="pills">
          ${t('hero_pills').map(pill => `<span class="pill">${pill}</span>`).join('')}
        </div>
        <div style="margin-top: 1.5rem;">
          <a href="#/about" class="btn-ghost" style="margin-right: 1rem;">${t('btn_about')}</a>
          <a href="#/post/publications" class="btn-ghost" style="margin-right: 1rem;">${t('btn_pub')}</a>
          <a href="#/blog" class="btn-ghost">${t('btn_blog')}</a>
        </div>
        <div style="margin-top: 1rem; font-family: monospace;">
          <a href="https://orcid.org/0009-0003-2432-9812" target="_blank" class="btn-ghost" style="border-bottom: none; margin-right: 1.5rem;">🔗 ORCID ↗</a>
          <a href="https://scholar.google.com.tw/citations?user=uHNX07sAAAAJ&hl=zh-TW" target="_blank" class="btn-ghost" style="border-bottom: none;">🎓 Google Scholar ↗</a>
        </div>
      </div>
    </section>

    <section>
      <h2>${t('latest_posts')}</h2>
      <div>
  `;

  recentPosts.forEach(post => {
    html += `
      <a href="#/post/${post.id}" class="card">
        <div class="card-meta"><span class="pill">${post.category}</span> <span>${post.date}</span></div>
        <h3 class="card-title">${post.title}</h3>
      </a>
    `;
  });

  html += `</div></section>`;
  app.innerHTML = html;
}

async function renderAbout() {
  app.innerHTML = `<div style="text-align: center; padding: 3rem;">${t('loading')}</div>`;
  
  let pubHtml = '';
  try {
    const res = await fetch('posts/publications.md');
    if (res.ok) {
      const text = await res.text();
      // Remove the duplicate h1 and h2 headers from publications.md if they exist, or let marked parse it.
      // publications.md has ## 期刊論文 and ## 研討會發表. 
      pubHtml = marked.parse(text);
    }
  } catch (e) {
    console.error('Failed to load publications', e);
  }

  if (currentLang === 'zh') {
    app.innerHTML = `
      <div class="markdown-body">
        <h1>關於我 (About Me)</h1>
        <p>你好，我是吳亭葶 Ting-Ting Wu。<br/>我是認知神經科學的博士班學生，同時也是一位具備豐富實務經驗的運動防護員。</p>
        <h2>專業領域</h2>
        <ul>
          <li>認知神經科學 (Cognitive Neuroscience)</li>
          <li>運動醫學與防護 (Sports Medicine & Athletic Training)</li>
          <li>AI 與資料分析 (AI & Data Analysis)</li>
        </ul>
        <h2>經歷與證照</h2>
        <ul>
          <li>國立中央大學 認知神經科學研究所 博士生</li>
          <li>專業運動防護員 (Athletic Trainer)</li>
          <li>超過 5 張以上的專業證照與研習認證</li>
        </ul>
        <h2>聯絡方式</h2>
        <p>Email: <a href="mailto:wtt.ntpc@gmail.com">wtt.ntpc@gmail.com</a></p>
        
        <br/><hr/><br/>
        
        <div class="publications-section">
          ${pubHtml}
        </div>
      </div>
    `;
  } else {
    app.innerHTML = `
      <div class="markdown-body">
        <h1>About Me</h1>
        <p>Hello, I'm Ting-Ting Wu.<br/>I am a Ph.D. student in Cognitive Neuroscience and an experienced Athletic Trainer.</p>
        <h2>Areas of Expertise</h2>
        <ul>
          <li>Cognitive Neuroscience</li>
          <li>Sports Medicine & Athletic Training</li>
          <li>AI & Data Analysis</li>
        </ul>
        <h2>Experience & Certifications</h2>
        <ul>
          <li>Ph.D. Student, Institute of Cognitive Neuroscience, National Central University</li>
          <li>Certified Athletic Trainer</li>
          <li>Holds over 5 professional certifications and workshop credentials</li>
        </ul>
        <h2>Contact</h2>
        <p>Email: <a href="mailto:wtt.ntpc@gmail.com">wtt.ntpc@gmail.com</a></p>
        
        <br/><hr/><br/>
        
        <div class="publications-section">
          ${pubHtml}
        </div>
      </div>
    `;
  }
}

async function renderBlog() {
  const res = await fetch('posts.json');
  const posts = await res.json();
  
  let html = `<h1>${t('blog_title')}</h1><div style="margin-top: 2rem;">`;
  
  posts.forEach(post => {
    html += `
      <a href="#/post/${post.id}" class="card">
        <div class="card-meta"><span class="pill">${post.category}</span> <span>${post.date}</span></div>
        <h2 class="card-title">${post.title}</h2>
        <p style="color: var(--text-secondary);">${post.description}</p>
      </a>
    `;
  });
  html += `</div>`;
  app.innerHTML = html;
}

async function renderPost(id) {
  try {
    const metaRes = await fetch('posts.json');
    const posts = await metaRes.json();
    const postMeta = posts.find(p => p.id === id);

    const res = await fetch(`posts/${id}.md`);
    if (!res.ok) throw new Error('Not found');
    const text = await res.text();
    
    let html = `
      <div style="margin-bottom: 2rem;"><a href="#/blog" style="color: var(--text-muted); font-size: 0.95rem;">${t('back_to_blog')}</a></div>
      <article class="markdown-body">
    `;
    
    if (postMeta) {
      html += `
        <div style="margin-bottom: 2rem; text-align: center;">
          <h1 style="margin-bottom: 0.5rem;">${postMeta.title}</h1>
          <div style="font-family: monospace; color: var(--text-muted);">
            ${postMeta.date} &nbsp;·&nbsp; ${postMeta.category}
          </div>
        </div>
      `;
    } else {
      // Remove the h1 from markdown if we don't have meta, to keep it clean, but since it's just raw md, we let it render
    }

    html += marked.parse(text);
    html += `</article>`;
    app.innerHTML = html;
  } catch (e) {
    app.innerHTML = `<div style="padding: 2rem; text-align: center;">${t('post_error')}</div>`;
  }
}

// Initialize
updateNav();
window.addEventListener('hashchange', router);
router();
