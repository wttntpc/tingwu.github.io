const app = document.getElementById('app');

// 設定 Marked.js 使用 highlight.js 進行程式碼上色
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

// 路由設定
async function router() {
  const hash = window.location.hash.slice(1) || '/';
  app.innerHTML = '<div style="text-align: center; padding: 3rem;">載入中...</div>';

  if (hash === '/') {
    renderHome();
  } else if (hash === '/about') {
    renderAbout();
  } else if (hash === '/blog') {
    renderBlog();
  } else if (hash.startsWith('/post/')) {
    const postId = hash.split('/')[2];
    renderPost(postId);
  } else {
    app.innerHTML = '<h1>404 找不到網頁</h1>';
  }
}

// 渲染首頁
async function renderHome() {
  const res = await fetch('posts.json');
  const posts = await res.json();
  const recentPosts = posts.slice(0, 2);

  let html = `
    <section class="hero">
      <img src="https://ui-avatars.com/api/?name=Ting-Ting+Wu&background=0d7377&color=fff&size=120" alt="Avatar" class="avatar" />
      <div>
        <h1>吳亭葶 Ting-Ting Wu</h1>
        <p>認知神經科學博士生 & 運動防護員</p>
        <div class="pills">
          <span class="pill">徒手・運動治療</span>
          <span class="pill">AI・程式開發</span>
          <span class="pill">學術研究</span>
        </div>
        <div style="margin-top: 1.5rem;">
          <a href="#/about" class="btn btn-ghost" style="margin-right: 1rem;">完整學經歷 →</a>
          <a href="#/post/publications" class="btn btn-ghost" style="margin-right: 1rem;">學術文章列表 →</a>
          <a href="#/blog" class="btn">閱讀文章 →</a>
        </div>
      </div>
    </section>

    <section>
      <h2 style="margin-bottom: 1.5rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; display: inline-block;">最新文章</h2>
      <div>
  `;

  recentPosts.forEach(post => {
    html += `
      <a href="#/post/${post.id}" class="card">
        <div class="card-meta"><span class="pill">${post.category}</span> <span style="margin-left: 1rem;">${post.date}</span></div>
        <h3 class="card-title">${post.title}</h3>
      </a>
    `;
  });

  html += `</div></section>`;
  app.innerHTML = html;
}

// 渲染關於我
function renderAbout() {
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
      <h2>學術著作</h2>
      <p>目前累積 9 篇以上的期刊論文發表，探討身體活動與健身運動對大腦與情緒的神經調控機制。</p>
      <h2>聯絡方式</h2>
      <p>Email: <a href="mailto:tingwu.new@gmail.com">tingwu.new@gmail.com</a></p>
    </div>
  `;
}

// 渲染文章列表
async function renderBlog() {
  const res = await fetch('posts.json');
  const posts = await res.json();
  
  let html = `<h1 style="margin-bottom: 2rem;">文章列表 (Blog)</h1><div>`;
  
  posts.forEach(post => {
    html += `
      <a href="#/post/${post.id}" class="card">
        <div class="card-meta"><span class="pill">${post.category}</span> <span style="margin-left: 1rem;">${post.date}</span></div>
        <h2 class="card-title">${post.title}</h2>
        <p style="color: var(--text-secondary);">${post.description}</p>
      </a>
    `;
  });
  html += `</div>`;
  app.innerHTML = html;
}

// 渲染單篇文章
async function renderPost(id) {
  try {
    // 取得文章標題等 metadata
    const metaRes = await fetch('posts.json');
    const posts = await metaRes.json();
    const postMeta = posts.find(p => p.id === id);

    // 取得 Markdown 內容
    const res = await fetch(`posts/${id}.md`);
    if (!res.ok) throw new Error('找不到文章');
    const text = await res.text();
    
    let html = `
      <div style="margin-bottom: 1rem;"><a href="#/blog" style="color: var(--text-muted);">← 返回文章列表</a></div>
      <article class="markdown-body">
    `;
    
    if (postMeta) {
      html += `
        <div style="margin-bottom: 1rem;">
          <span class="pill">${postMeta.category}</span>
          <span style="margin-left: 1rem; color: var(--text-muted);">${postMeta.date}</span>
        </div>
        <h1 style="margin-bottom: 2rem;">${postMeta.title}</h1>
      `;
    }

    html += marked.parse(text);
    html += `</article>`;
    app.innerHTML = html;
  } catch (e) {
    app.innerHTML = '<div style="padding: 2rem;">無法載入文章，或者該文章不存在。</div>';
  }
}

// 監聽網址變化
window.addEventListener('hashchange', router);
// 初始載入
router();
