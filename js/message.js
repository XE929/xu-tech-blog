document.addEventListener("DOMContentLoaded", function () {
  initMessageBoard();
});

function initMessageBoard() {
  const nicknameInput = document.getElementById("nicknameInput");
  const messageInput = document.getElementById("messageInput");
  const submitButton = document.getElementById("submitMessage");
  const tip = document.getElementById("messageTip");

  renderMessages();

  if (!submitButton) return;

  submitButton.addEventListener("click", function () {
    const nickname = nicknameInput.value.trim();
    const content = messageInput.value.trim();

    if (!nickname || !content) {
      tip.textContent = "昵称和留言内容都不能为空。";
      return;
    }

    const messages = getMessages();

    messages.unshift({
      nickname: nickname,
      content: content,
      date: new Date().toLocaleString()
    });

    localStorage.setItem("messages", JSON.stringify(messages));

    nicknameInput.value = "";
    messageInput.value = "";
    tip.textContent = "留言提交成功。";

    renderMessages();
  });
}

function getMessages() {
  const saved = localStorage.getItem("messages");

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}

function renderMessages() {
  const container = document.getElementById("messageList");
  if (!container) return;

  const messages = getMessages();

  if (messages.length === 0) {
    container.innerHTML = `<div class="no-result">还没有留言，欢迎留下第一条留言。</div>`;
    return;
  }

  container.innerHTML = messages.map(function (message) {
    return `
      <article class="message-card">
        <h4>${escapeHTML(message.nickname)}</h4>
        <p>${escapeHTML(message.content)}</p>
        <div class="message-date">${message.date}</div>
      </article>
    `;
  }).join("");
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (match) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return map[match];
  });
}