document.addEventListener("DOMContentLoaded", function () {
  renderArticle();
});

function renderArticle() {
  const container = document.getElementById("articleContainer");
  if (!container || !window.blogPosts) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const post = window.blogPosts.find(item => item.id === id);

  if (!post) {
    container.innerHTML = `
      <h1>文章不存在</h1>
      <p class="article-meta">没有找到对应的文章内容。</p>
      <a class="btn primary-btn" href="blog.html">返回博客列表</a>
    `;
    return;
  }

  const plainText = post.content.replace(/<[^>]*>/g, "");
  const readingTime = Math.max(1, Math.ceil(plainText.length / 500));

  document.title = `${post.title} - Xu Jiayu's Tech Blog`;

  container.innerHTML = `
    <a class="btn secondary-btn" href="blog.html">← 返回博客列表</a>
    <h1>${post.title}</h1>
    <div class="article-meta">
      ${post.date} · ${post.category} · 预计阅读 ${readingTime} 分钟
    </div>
    <div class="tag-row" style="justify-content:flex-start;margin-bottom:28px;">
      ${post.tags.map(tag => `<span>${tag}</span>`).join("")}
    </div>
    <div class="article-content">
      ${post.content}
    </div>
  `;
}