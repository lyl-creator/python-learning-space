'use strict';

const STORAGE_KEY = 'python-learning-space:v1';
const routes = Array.from(document.querySelectorAll('.lesson')).map((node) => node.id);
const checkInputs = Array.from(document.querySelectorAll('[data-check]'));
const knownChecks = new Set(checkInputs.map((input) => input.dataset.check));
const masteryInputs = Array.from(document.querySelectorAll('#checklist [data-check]'));
const emptyState = () => ({ version: 1, checks: {}, entries: [] });
let state = emptyState();
let toastTimer;
let storageAvailable = true;

function toast(message) {
  const box = document.getElementById('toast');
  box.textContent = message;
  box.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { box.hidden = true; }, 3800);
}

function normalizeState(value) {
  if (!value || value.version !== 1 || !value.checks || typeof value.checks !== 'object' || !Array.isArray(value.entries)) {
    throw new Error('进度文件格式不正确');
  }
  const checks = {};
  for (const [key, checked] of Object.entries(value.checks)) {
    if (knownChecks.has(key) && typeof checked === 'boolean') checks[key] = checked;
  }
  const entries = value.entries.map((entry) => {
    if (!entry || typeof entry.id !== 'string' || entry.id.length > 100 ||
        typeof entry.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
        typeof entry.stage !== 'string' || entry.stage.length > 100 ||
        typeof entry.learned !== 'string' || entry.learned.length > 2000 ||
        typeof entry.question !== 'string' || entry.question.length > 2000) {
      throw new Error('学习记录格式不正确');
    }
    return { id: entry.id, date: entry.date, stage: entry.stage, learned: entry.learned, question: entry.question };
  });
  return { version: 1, checks, entries };
}

try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) state = normalizeState(JSON.parse(raw));
} catch (error) {
  storageAvailable = false;
  document.getElementById('save-status').textContent = '本地存储不可用，请导出备份';
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageAvailable = true;
    document.getElementById('save-status').textContent = '已保存到此浏览器';
    return true;
  } catch (error) {
    storageAvailable = false;
    document.getElementById('save-status').textContent = '保存失败，请导出备份';
    toast('浏览器未能保存进度，请使用“导出进度”备份。');
    return false;
  }
}

function updateProgress() {
  for (const input of checkInputs) {
    input.checked = state.checks[input.dataset.check] === true;
  }
  const count = masteryInputs.filter((input) => input.checked).length;
  document.getElementById('progress-count').textContent = String(count);
  document.getElementById('progress-total').textContent = String(masteryInputs.length);
  const progress = document.getElementById('mastery-progress');
  progress.max = masteryInputs.length;
  progress.value = count;
  progress.setAttribute('aria-valuetext', count + ' / ' + masteryInputs.length + ' 项已掌握');
}

for (const input of checkInputs) {
  input.addEventListener('change', () => {
    state.checks[input.dataset.check] = input.checked;
    persist();
    updateProgress();
  });
}
updateProgress();

function showChapter(shouldFocus) {
  const requested = location.hash.slice(1) || 'overview';
  if (requested === 'lesson-content') return;
  const route = routes.includes(requested) ? requested : 'overview';
  for (const article of document.querySelectorAll('.lesson')) article.hidden = article.id !== route;
  for (const link of document.querySelectorAll('[data-route]')) {
    if (link.dataset.route === route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  const active = document.getElementById(route);
  document.title = active.dataset.title + ' · Python 学习空间';
  document.getElementById('hero').hidden = route !== 'overview';
  document.getElementById('journal').hidden = route !== 'checklist';
  document.querySelector('.study-note').hidden = route === 'checklist';
  const index = routes.indexOf(route);
  const previous = document.getElementById('prev-chapter');
  const next = document.getElementById('next-chapter');
  previous.hidden = index === 0;
  previous.href = '#' + routes[Math.max(index - 1, 0)];
  if (index > 0) previous.textContent = '← ' + document.getElementById(routes[index - 1]).dataset.title;
  next.hidden = index === routes.length - 1;
  next.href = '#' + routes[Math.min(index + 1, routes.length - 1)];
  if (index < routes.length - 1) next.textContent = document.getElementById(routes[index + 1]).dataset.title + ' →';
  if (shouldFocus) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('lesson-content').focus({ preventScroll: true });
    document.querySelector('[data-route="' + route + '"]').scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}
window.addEventListener('hashchange', () => showChapter(true));
showChapter(false);

let selectedStudent = 's1';
const students = { s1: { name: '小明', age: 18 }, s2: { name: '小红', age: 20 } };
for (const button of document.querySelectorAll('[data-student]')) {
  button.addEventListener('click', () => {
    selectedStudent = button.dataset.student;
    for (const option of document.querySelectorAll('[data-student]')) {
      const selected = option.dataset.student === selectedStudent;
      option.classList.toggle('is-selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    }
    document.getElementById('demo-caller').textContent = selectedStudent;
    document.getElementById('demo-explanation').textContent = '此时 self 对应 ' + selectedStudent + '，也就是' + students[selectedStudent].name + '。';
  });
}
document.getElementById('grow-up').addEventListener('click', () => {
  const current = students[selectedStudent];
  current.age += 1;
  document.getElementById('age-' + selectedStudent).textContent = String(current.age);
  document.getElementById('demo-result').textContent = current.name + '现在 ' + current.age + ' 岁。' + (selectedStudent === 's1' ? '小红' : '小明') + '的年龄没有改变。';
});

for (const button of document.querySelectorAll('.copy-code')) {
  button.addEventListener('click', async () => {
    const code = button.closest('.code-block').querySelector('pre code').textContent;
    try {
      await navigator.clipboard.writeText(code);
      toast('代码已复制，可粘贴到 .py 文件中运行。');
    } catch (error) {
      const range = document.createRange();
      range.selectNodeContents(button.closest('.code-block').querySelector('pre code'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      toast('代码已选中，请按 Ctrl+C 或使用“下载 .py”。');
    }
  });
}

// Highlight text through DOM nodes; example contents remain literal and copyable.
for (const block of document.querySelectorAll('.language-python')) {
  const code = block.textContent;
  const tokens = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#.*$|\b(?:class|def|return|if|or|for|in|True|False|None)\b|\b\d+\b)/gm;
  let cursor = 0;
  for (const match of code.matchAll(tokens)) {
    if (cursor === 0) block.replaceChildren();
    block.append(document.createTextNode(code.slice(cursor, match.index)));
    const token = document.createElement('span');
    token.className = match[0].startsWith('#') ? 'syntax-comment' :
      /^["']/.test(match[0]) ? 'syntax-string' :
      /^\d/.test(match[0]) ? 'syntax-number' : 'syntax-keyword';
    token.textContent = match[0];
    block.append(token);
    cursor = match.index + match[0].length;
  }
  if (cursor > 0) block.append(document.createTextNode(code.slice(cursor)));
}

function renderEntries() {
  const container = document.getElementById('journal-entries');
  container.replaceChildren();
  if (!state.entries.length) {
    const empty = document.createElement('p');
    empty.className = 'journal-empty';
    empty.textContent = '还没有记录。从今天会独立写出的第一段代码开始。';
    container.append(empty);
    return;
  }
  for (const entry of [...state.entries].reverse()) {
    const card = document.createElement('article');
    card.className = 'journal-entry';
    const heading = document.createElement('h3');
    heading.textContent = entry.date + ' · ' + entry.stage;
    const learned = document.createElement('p');
    learned.textContent = entry.learned;
    card.append(heading, learned);
    if (entry.question) {
      const question = document.createElement('p');
      question.className = 'journal-question';
      question.textContent = '下次再练：' + entry.question;
      card.append(question);
    }
    container.append(card);
  }
}
renderEntries();
const today = new Date();
document.getElementById('entry-date').value = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
document.getElementById('journal-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const learned = document.getElementById('entry-learned').value.trim();
  if (!learned) { toast('请先记录一个已经掌握的知识点。'); return; }
  state.entries.push({
    id: crypto.randomUUID(),
    date: document.getElementById('entry-date').value,
    stage: document.getElementById('entry-stage').value,
    learned,
    question: document.getElementById('entry-question').value.trim(),
  });
  const saved = persist();
  renderEntries();
  document.getElementById('entry-learned').value = '';
  document.getElementById('entry-question').value = '';
  if (saved) toast('这次课堂记录已保存。');
});

document.getElementById('export-progress').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'python-learning-progress.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.getElementById('import-progress').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 5 * 1024 * 1024) throw new Error('请选择 5 MB 以内的进度文件。');
    const imported = normalizeState(JSON.parse(await file.text()));
    const entries = new Map(state.entries.map((entry) => [entry.id, entry]));
    for (const entry of imported.entries) entries.set(entry.id, entry);
    state = { version: 1, checks: { ...state.checks, ...imported.checks }, entries: [...entries.values()].sort((a, b) => a.date.localeCompare(b.date)) };
    const saved = persist();
    updateProgress();
    renderEntries();
    if (saved) toast('进度已导入，课堂记录已合并。');
  } catch (error) {
    toast(error instanceof SyntaxError ? '无法读取该文件，请选择导出的 JSON 进度文件。' : error.message);
  }
  event.target.value = '';
});
