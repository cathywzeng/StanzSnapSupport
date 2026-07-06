const API = '/api/feedback';
let token = localStorage.getItem('stanzsnap-admin-token') || '';
let currentFilter = 'all';

function htmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function login() {
  const pwd = document.getElementById('password-input').value;
  if (!pwd) return;
  token = pwd;
  localStorage.setItem('stanzsnap-admin-token', token);
  document.getElementById('login-error').textContent = '';
  loadDashboard();
}

function logout() {
  token = '';
  localStorage.removeItem('stanzsnap-admin-token');
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  loadFeedback();
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

async function loadDashboard() {
  // Test auth first
  const res = await fetch(`${API}?filter=all`, { headers: authHeaders() });
  if (!res.ok) {
    document.getElementById('login-error').textContent = '密码错误';
    return;
  }
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  loadFeedback();
}

async function loadFeedback() {
  const container = document.getElementById('feedback-list');
  container.innerHTML = '<p class="loading">加载中…</p>';

  try {
    const res = await fetch(`${API}?filter=${currentFilter}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('unauthorized');
    const json = await res.json();
    if (!json.success) throw new Error('load failed');

    renderTable(json.data);
  } catch (err) {
    container.innerHTML = '<p class="empty">加载失败，请刷新重试</p>';
  }
}

function renderTable(data) {
  const container = document.getElementById('feedback-list');
  const countLabel = document.getElementById('count-label');

  if (!data || !data.length) {
    countLabel.textContent = '暂无留言';
    container.innerHTML = '<p class="empty">暂无留言</p>';
    return;
  }

  countLabel.textContent = `共 ${data.length} 条${currentFilter !== 'all' ? ` (${currentFilter})` : ''}`;

  const catLabels = { feature: '功能建议', bug: '问题反馈', praise: '称赞', other: '其他' };
  const catBadges = { feature: 'badge-feature', bug: 'badge-bug', praise: 'badge-praise', other: 'badge-other' };

  container.innerHTML = `
    <div class="table-wrap"><table>
      <thead>
        <tr>
          <th>ID</th>
          <th>时间</th>
          <th>分类</th>
          <th>用户</th>
          <th>留言</th>
          <th>GitHub</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => {
          const safeName = htmlEscape(item.name || '匿名');
          const safeEmail = item.email ? htmlEscape(item.email) : '';
          const safeMessage = htmlEscape(item.message);
          const safeFeature = item.feature ? htmlEscape(item.feature) : '';
          const safeCategory = catLabels[item.category] || htmlEscape(item.category);
          const badgeClass = catBadges[item.category] || 'badge-other';
          const titleAttr = safeMessage + (safeFeature ? '\\n\\n功能：' + safeFeature : '');
          return `
          <tr>
            <td>#${item.id}</td>
            <td style="white-space:nowrap;font-size:0.8rem" data-label="时间">${htmlEscape(item.created_at)}</td>
            <td data-label="分类"><span class="badge ${badgeClass}">${safeCategory}</span></td>
            <td data-label="用户">${safeName}${safeEmail ? `<br><small style="color:#6b7280">${safeEmail}</small>` : ''}</td>
            <td class="msg-cell" title="${titleAttr}" data-label="留言">${safeMessage}${safeFeature ? `<br><small style="color:#b0843e">📌 ${safeFeature}</small>` : ''}</td>
            <td data-label="GitHub">${item.github_issue ? `<a href="https://github.com/cathywzeng/StanzSnapSupport/issues/${item.github_issue}" target="_blank" class="issue-link">#${item.github_issue}</a>` : '<span style="color:#9ca3af">—</span>'}</td>
            <td data-label="操作">
              <button class="action-btn github" onclick="submitToGitHub(${item.id})" ${item.github_issue ? 'disabled' : ''}>${item.github_issue ? '已提交' : '→ GitHub'}</button>
              <button class="action-btn delete" onclick="deleteFeedback(${item.id})">删除</button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
  `;
}

async function submitToGitHub(id) {
  if (!confirm(`确定将留言 #${id} 提交到 GitHub Issues 吗？`)) return;

  const res = await fetch(`${API}/${id}/github`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const json = await res.json();

  if (json.success) {
    alert(`✅ 已创建 Issue #${json.issue}`);
    loadFeedback();
  } else {
    alert(`❌ 提交失败：${json.error}`);
  }
}

async function deleteFeedback(id) {
  if (!confirm(`确定删除留言 #${id} 吗？`)) return;

  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const json = await res.json();

  if (json.success) {
    loadFeedback();
  } else {
    alert(`❌ 删除失败：${json.error}`);
  }
}

// Auto-login if token exists
document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    loadDashboard();
  }
});

// ── Tab switching ──────────────────────────────────────
function switchTab(tab) {
  document.getElementById('feedback-section').style.display = tab === 'feedback' ? 'block' : 'none';
  document.getElementById('stats-section').style.display = tab === 'stats' ? 'block' : 'none';
  document.getElementById('tab-feedback').style.background = tab === 'feedback' ? '#b0843e' : 'white';
  document.getElementById('tab-feedback').style.color = tab === 'feedback' ? '#fff' : '#1f2937';
  document.getElementById('tab-stats').style.background = tab === 'stats' ? '#b0843e' : 'white';
  document.getElementById('tab-stats').style.color = tab === 'stats' ? '#fff' : '#1f2937';
  if (tab === 'stats') loadStats();
}

// ── Visit stats ────────────────────────────────────────
async function loadStats() {
  const el = document.getElementById('stats-content');
  el.innerHTML = '<p class="loading">加载中…</p>';
  try {
    const res = await fetch('/api/visits', { headers: authHeaders() });
    if (!res.ok) throw new Error('unauthorized');
    const json = await res.json();
    if (!json.success) throw new Error('load failed');
    renderStats(json.data);
  } catch {
    el.innerHTML = '<p class="empty">加载失败</p>';
  }
}

function renderStats(d) {
  document.getElementById('stats-content').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="num">${d.total}</div><div class="label">总访问次数</div></div>
      <div class="stat-card"><div class="num">${d.today}</div><div class="label">今日访问</div></div>
      <div class="stat-card"><div class="num">${d.uniqueToday}</div><div class="label">今日独立访客</div></div>
      <div class="stat-card"><div class="num">${d.uniqueTotal}</div><div class="label">总独立访客</div></div>
    </div>
    <div class="stats-two">
      <div class="card">
        <h3>各页面访问排行</h3>
        <table>
          <thead><tr><th>页面</th><th>次数</th></tr></thead>
          <tbody>${(d.pages || []).map(p => '<tr><td>' + htmlEscape(p.page) + '</td><td>' + p.c + '</td></tr>').join('')}</tbody>
        </table>
      </div>
      <div class="card">
        <h3>最近访问</h3>
        <div style="max-height:400px;overflow-y:auto">
          <table>
            <thead><tr><th>IP</th><th>页面</th><th>时间</th></tr></thead>
            <tbody>${(d.recent || []).map(r => '<tr><td>' + htmlEscape(r.ip) + '</td><td>' + htmlEscape(r.page) + '</td><td style="white-space:nowrap;font-size:0.8rem">' + htmlEscape(r.created_at) + '</td></tr>').join('')}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
