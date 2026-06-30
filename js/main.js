document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  setActiveNav();
  initTypewriter();
  renderLatestPosts();
  renderProjects();
  fetchGitHubProfile();
  drawCategoryChart();
  initReadingProgress();
});

function initTheme() {
  const themeToggle = document.getElementById("themeToggle");

  let savedTheme = "light";

  try {
    savedTheme = localStorage.getItem("theme") || "light";
  } catch (error) {
    savedTheme = "light";
  }

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
  }

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const isDark = document.documentElement.classList.toggle("dark");
      document.body.classList.toggle("dark", isDark);

      try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch (error) {
        console.log("localStorage不可用，但主题切换仍然可以临时生效。");
      }

      updateThemeButton();

      if (typeof drawCategoryChart === "function") {
        drawCategoryChart();
      }
    });
  }
}

function updateThemeButton() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const isDark = document.documentElement.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
}
function setActiveNav() {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-link");

  links.forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }

    if (currentPage === "article.html" && href === "blog.html") {
      link.classList.add("active");
    }
  });
}

function initTypewriter() {
  const element = document.getElementById("typewriter");
  if (!element) return;

  const text = "记录技术学习，也记录项目生长。";
  let index = 0;

  function type() {
    if (index <= text.length) {
      element.textContent = text.slice(0, index);
      index++;
      setTimeout(type, 90);
    }
  }

  type();
}

function renderLatestPosts() {
  const container = document.getElementById("latestPosts");
  if (!container || !window.blogPosts) return;

  const latest = [...window.blogPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  container.innerHTML = latest.map(createPostCard).join("");
}

function createPostCard(post) {
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
}

function renderProjects() {
  const container = document.getElementById("projectGrid");
  if (!container || !window.projects) return;

  container.innerHTML = window.projects.map(function (project) {
    return `
      <article class="project-card">
        <div class="project-cover">
          <img src="${project.image}" alt="${project.name}" onerror="this.style.display='none'; this.parentElement.textContent='${project.name.slice(0, 2)}';" />
        </div>
        <div class="project-body">
          <h3>${project.name}</h3>
          <p>${project.intro}</p>
          <div class="tag-row">
            ${project.tags.map(tag => `<span>${tag}</span>`).join("")}
          </div>
        </div>
      </article>
    `;
  }).join("");
}

async function fetchGitHubProfile() {
  const container = document.getElementById("githubProfile");
  if (!container) return;

  try {
    const response = await fetch("https://api.github.com/users/XE929");

    if (!response.ok) {
      throw new Error("GitHub API请求失败");
    }

    const data = await response.json();

    container.innerHTML = `
      <img src="${data.avatar_url}" alt="GitHub头像" />
      <h3>${data.name || data.login}</h3>
      <p>@${data.login}</p>
      <p>公开仓库：${data.public_repos}</p>
      <p>关注者：${data.followers}</p>
      <a class="btn secondary-btn" href="${data.html_url}" target="_blank">访问GitHub主页</a>
    `;
  } catch (error) {
    container.innerHTML = `
      <p>GitHub信息暂时加载失败。</p>
      <a class="btn secondary-btn" href="https://github.com/XE929" target="_blank">访问GitHub主页</a>
    `;
  }
}

function drawCategoryChart() {
  const canvas = document.getElementById("categoryChart");
  if (!canvas || !window.blogPosts) return;

  const ctx = canvas.getContext("2d");
  const counts = {};

  window.blogPosts.forEach(function (post) {
    counts[post.category] = (counts[post.category] || 0) + 1;
  });

  const entries = Object.entries(counts);
  const maxCount = Math.max(...entries.map(item => item[1]));
  const barHeight = 26;
  const gap = 18;
  const startX = 90;
  const startY = 24;
  const maxBarWidth = 150;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "13px Microsoft YaHei";
  ctx.textBaseline = "middle";

  entries.forEach(function ([category, count], index) {
    const y = startY + index * (barHeight + gap);
    const barWidth = (count / maxCount) * maxBarWidth;

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--muted-color");
    ctx.fillText(category, 8, y + barHeight / 2);

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--primary-color");
    ctx.fillRect(startX, y, barWidth, barHeight);

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--text-color");
    ctx.fillText(count + "篇", startX + barWidth + 10, y + barHeight / 2);
  });
}

function initReadingProgress() {
  const progress = document.getElementById("readingProgress");
  if (!progress) return;

  window.addEventListener("scroll", function () {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progress.style.width = percent + "%";
  });
}