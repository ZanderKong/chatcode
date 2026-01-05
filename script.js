const moduleSections = document.querySelectorAll('[data-source]');
const postListEl = document.getElementById('post-list');
const postPreviewEl = document.getElementById('post-preview');
const audioEl = document.getElementById('audio');
const playerTitle = document.getElementById('player-title');
const playerMeta = document.getElementById('player-meta');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const playlist = [
  {
    title: 'Morning Coffee — Lo-Fi',
    meta: '轻量节奏，适合写作',
    url:
      'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Delorean_Dynamite/Sunbeam/Delorean_Dynamite_-_03_-_Morning_Coffee.mp3',
  },
  {
    title: 'Fight Or Flight — Synthwave',
    meta: '夜间修订与推送的动力',
    url:
      'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Alpha_Chrome_Yayo/Fight_Or_Flight/Alpha_Chrome_Yayo_-_01_-_Fight_Or_Flight.mp3',
  },
  {
    title: 'Always Moving — Piano',
    meta: '温柔背景，适合放空',
    url:
      'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ryan_Andersen/One_Across_Two_Down/Ryan_Andersen_-_07_-_Always_Moving.mp3',
  },
];

let currentTrack = 0;

function updatePlayer(trackIndex) {
  const track = playlist[trackIndex];
  if (!track) return;
  playerTitle.textContent = track.title;
  playerMeta.textContent = track.meta;
  audioEl.src = track.url;
}

function setupPlayer() {
  updatePlayer(currentTrack);
  prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    updatePlayer(currentTrack);
    audioEl.play().catch(() => {});
  });
  nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    updatePlayer(currentTrack);
    audioEl.play().catch(() => {});
  });
}

async function loadMarkdown(section) {
  const source = section.getAttribute('data-source');
  const target = section.querySelector('[data-module]');
  if (!source || !target) return;
  try {
    const response = await fetch(source);
    const text = await response.text();
    target.innerHTML = markedLite.render(text);
  } catch (error) {
    target.innerHTML = '<p class="error">无法加载模块内容，请检查文件路径。</p>';
  }
}

function renderPostList(posts) {
  postListEl.innerHTML = '';
  posts.forEach((post, index) => {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.innerHTML = `
      <header>
        <p class="eyebrow">${post.date}</p>
        <h3>${post.title}</h3>
      </header>
      <p class="summary">${post.summary}</p>
      <div class="tags">${post.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      <button class="ghost" data-slug="${post.slug}">阅读</button>
    `;
    const button = card.querySelector('button');
    button.addEventListener('click', () => loadPost(post.slug, post.title));
    if (index === 0) {
      card.classList.add('active');
    }
    card.addEventListener('click', () => {
      document.querySelectorAll('.post-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
    });
    postListEl.appendChild(card);
  });
}

async function loadPost(slug, title) {
  try {
    const response = await fetch(`content/posts/${slug}.md`);
    const text = await response.text();
    postPreviewEl.innerHTML = `
      <div class="post-meta">
        <p class="eyebrow">阅读</p>
        <h3>${title}</h3>
      </div>
      <div class="post-content">${markedLite.render(text)}</div>
    `;
  } catch (error) {
    postPreviewEl.innerHTML = '<p class="error">无法加载博文，请检查文件。</p>';
  }
}

async function loadPostsModule() {
  try {
    const response = await fetch('content/posts/posts.json');
    const posts = await response.json();
    const published = posts.filter((post) => post.published).sort((a, b) => b.date.localeCompare(a.date));
    if (published.length === 0) {
      postListEl.innerHTML = '<p class="muted">暂无已发布的文章。</p>';
      return;
    }
    renderPostList(published);
    loadPost(published[0].slug, published[0].title);
  } catch (error) {
    postListEl.innerHTML = '<p class="error">无法读取文章清单。</p>';
  }
}

function init() {
  moduleSections.forEach(loadMarkdown);
  loadPostsModule();
  setupPlayer();
}

document.addEventListener('DOMContentLoaded', init);
