document.addEventListener("DOMContentLoaded", function () {
  initBlogPage();
});

let currentCategory = "全部";

function initBlogPage() {
  renderCategoryFilters();
  renderBlogPosts();

  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  if (searchInput) {
    searchInput.addEventListener("input", renderBlogPosts);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", renderBlogPosts);
  }
}

function renderCategoryFilters() {
  const container = document.getElementById("categoryFilters");
  if (!container || !window.blogPosts) return;

  const categories = ["全部", ...new Set(window.blogPosts.map(post => post.category))];

  container.innerHTML = categories.map(function (category) {
    return `
      <button class="filter-btn ${category === currentCategory ? "active" : ""}" data-category="${category}" type="button">
        ${category}
      </button>
    `;
  }).join("");

  container.querySelectorAll(".filter-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      currentCategory = this.dataset.category;
      renderCategoryFilters();
      renderBlogPosts();
    });
  });
}

function renderBlogPosts() {
  const container = document.getElementById("postList");
  const count = document.getElementById("postCount");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  if (!container || !window.blogPosts) return;

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const sortOrder = sortSelect ? sortSelect.value : "desc";

  let filtered = window.blogPosts.filter(function (post) {
    const matchCategory = currentCategory === "全部" || post.category === currentCategory;
    const matchKeyword =
      post.title.toLowerCase().includes(keyword) ||
      post.summary.toLowerCase().includes(keyword) ||
      post.tags.join(" ").toLowerCase().includes(keyword);

    return matchCategory && matchKeyword;
  });

  filtered.sort(function (a, b) {
    if (sortOrder === "asc") {
      return new Date(a.date) - new Date(b.date);
    }
    return new Date(b.date) - new Date(a.date);
  });

  if (count) {
    count.textContent = `共找到 ${filtered.length} 篇文章`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="no-result">没有找到符合条件的文章。</div>`;
    return;
  }

  container.innerHTML = filtered.map(function (post) {
    return `
      <article class="post-card">
        <div class="post-meta">${post.date} · ${post.category}</div>
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
        <div class="tag-row">
          ${post.tags.map(tag => `<span>${tag}</span>`).join("")}
        </div>
        <br />
        <a class="btn secondary-btn" href="article.html?id=${post.id}">阅读全文</a>
      </article>
    `;
  }).join("");
}