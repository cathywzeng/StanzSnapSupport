import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
function getLogFile() {
  const today = new Date().toISOString().slice(0, 10);
  return path.join(__dirname, `feedback-${today}.log`);
}

const DB_FILE = path.join(__dirname, 'feedback.db');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = 'cathywzeng/StanzSnapSupport';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error('FATAL: ADMIN_PASSWORD environment variable is required');
  process.exit(1);
}
const PORT = process.env.PORT || 3001;

// ── Log ──────────────────────────────────────────────
function log(level, msg, extra = '') {
  const time = new Date().toISOString();
  const line = `[${time}] [${level}] ${msg}${extra ? ' | ' + extra : ''}`;
  console.log(line);
  fs.appendFileSync(getLogFile(), line + '\n', 'utf-8');
}

// ── Admin auth middleware ────────────────────────────
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'unauthorized' });
  }
  next();
}

// ── SQLite setup ─────────────────────────────────────
let db;
try {
  db = new Database(DB_FILE);
  db.pragma('journal_mode = WAL');
  db.exec(`CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    category TEXT DEFAULT 'other',
    message TEXT NOT NULL,
    feature TEXT,
    github_issue INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )`);
  // Visit counter table
  db.exec(`CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    page TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )`);
  // Add columns if missing (schema migration for existing DBs)
  for (const col of ['category', 'github_issue']) {
    try { db.exec(`ALTER TABLE feedback ADD COLUMN ${col} TEXT`); } catch {}
  }
  log('INFO', 'SQLite ready', DB_FILE);
} catch (err) {
  log('ERROR', 'SQLite init failed', err.message);
  process.exit(1);
}

// ── GitHub Issue ─────────────────────────────────────
async function createGitHubIssue({ name, email, category, message, feature }) {
  const labelMap = { feature: 'enhancement', bug: 'bug', praise: 'feedback', other: 'feedback' };
  const labels = [labelMap[category] || 'feedback'];

  const body = [
    `**来自：** ${name || '匿名用户'} ${email ? '(' + email + ')' : ''}`,
    `**分类：** ${category || 'other'}`,
    '',
    message,
    '',
    feature ? `**想增加的功能：** ${feature}` : null,
  ].filter(Boolean).join('\n');

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'stanzsnap-feedback/1.0',
      },
      body: JSON.stringify({
        title: `[${category}] ${(name || '匿名用户').slice(0, 40)} — ${message.slice(0, 60)}`,
        body,
        labels,
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => 'unknown');
    throw new Error(`GitHub API ${res.status}: ${errText}`);
  }

  const issue = await res.json();
  return issue.number;
}

// ── Express app ──────────────────────────────────────
const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: ['https://www.curiousbuddy.cloud', 'https://curiousbuddy.cloud'] }));
app.use(express.json({ limit: '16kb' }));

// ── Rate limiting ────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'too many requests' },
});
app.use('/api/', limiter);

// Serve static files from stanzsnap/ directory under /stanzsnap/ path
app.use('/stanzsnap', express.static(path.join(__dirname, '..')));

// Serve root index.html (landing page) at /
app.use('/', express.static(path.join(__dirname, '..', '..')));

// /admin → admin.html
app.get('/admin', (req, res) => res.redirect('/stanzsnap/admin.html'));

// ── Visit counter middleware ───────────────────────────
app.use((req, res, next) => {
  // Only count page visits (HTML or root), skip API calls and assets
  if (req.path === '/' || req.path.endsWith('.html')) {
    try {
      const stmt = db.prepare('INSERT INTO visits (ip, page, user_agent) VALUES (?, ?, ?)');
      stmt.run(req.ip || req.socket.remoteAddress, req.path, req.headers['user-agent'] || '');
    } catch (err) {
      log('ERROR', 'Visit log failed', err.message);
    }
  }
  next();
});

// ── Public: submit feedback ──────────────────────────
app.post('/api/feedback', async (req, res) => {
  const { name, email, category, message, feature } = req.body || {};

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: 'message is required' });
  }

  const entry = {
    name: (name || '').trim().slice(0, 100),
    email: (email || '').trim().slice(0, 200),
    category: (category || 'other').trim().slice(0, 20),
    message: message.trim().slice(0, 2000),
    feature: (feature || '').trim().slice(0, 200),
  };

  try {
    const stmt = db.prepare(
      'INSERT INTO feedback (name, email, category, message, feature) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(entry.name, entry.email, entry.category, entry.message, entry.feature);
    log('INFO', 'Feedback saved', JSON.stringify(entry));
    return res.json({ success: true });
  } catch (err) {
    log('ERROR', 'SQLite insert failed', err.message);
    return res.status(500).json({ success: false, error: 'storage failed' });
  }
});

// ── Admin: list feedback ─────────────────────────────
app.get('/api/feedback', requireAdmin, (req, res) => {
  const { filter } = req.query;
  let rows;
  if (filter === 'pending') {
    rows = db.prepare('SELECT * FROM feedback WHERE github_issue IS NULL ORDER BY created_at DESC').all();
  } else if (filter === 'submitted') {
    rows = db.prepare('SELECT * FROM feedback WHERE github_issue IS NOT NULL ORDER BY created_at DESC').all();
  } else {
    rows = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC').all();
  }
  res.json({ success: true, data: rows });
});

// ── Admin: submit specific feedback to GitHub ────────
app.post('/api/feedback/:id/github', requireAdmin, async (req, res) => {
  if (!GITHUB_TOKEN) {
    return res.status(400).json({ success: false, error: 'GITHUB_TOKEN not set on server' });
  }

  const row = db.prepare('SELECT * FROM feedback WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, error: 'feedback not found' });
  }
  if (row.github_issue) {
    return res.status(400).json({ success: false, error: `already submitted as issue #${row.github_issue}` });
  }

  try {
    const issueNum = await createGitHubIssue(row);
    db.prepare('UPDATE feedback SET github_issue = ? WHERE id = ?').run(issueNum, row.id);
    log('INFO', `GitHub issue #${issueNum} created from feedback #${row.id}`);
    return res.json({ success: true, issue: issueNum });
  } catch (err) {
    log('ERROR', `GitHub create failed for feedback #${row.id}`, err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── Admin: delete feedback ───────────────────────────
app.delete('/api/feedback/:id', requireAdmin, (req, res) => {
  const row = db.prepare('SELECT * FROM feedback WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, error: 'feedback not found' });
  }
  db.prepare('DELETE FROM feedback WHERE id = ?').run(req.params.id);
  log('INFO', `Feedback #${req.params.id} deleted by admin`);
  res.json({ success: true });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', github: !!GITHUB_TOKEN });
});

// ── Admin: visit stats ─────────────────────────────────
app.get('/api/visits', requireAdmin, (req, res) => {
  const total  = db.prepare('SELECT COUNT(*) AS c FROM visits').get().c;
  const today  = db.prepare("SELECT COUNT(*) AS c FROM visits WHERE created_at >= datetime('now','start of day')").get().c;
  const uniqueToday = db.prepare("SELECT COUNT(DISTINCT ip) AS c FROM visits WHERE created_at >= datetime('now','start of day')").get().c;
  const uniqueTotal = db.prepare('SELECT COUNT(DISTINCT ip) AS c FROM visits').get().c;
  const pages  = db.prepare("SELECT page, COUNT(*) AS c FROM visits GROUP BY page ORDER BY c DESC").all();
  const recent = db.prepare('SELECT id, ip, page, created_at FROM visits ORDER BY id DESC LIMIT 50').all();
  res.json({ success: true, data: { total, today, uniqueToday, uniqueTotal, pages, recent } });
});

app.listen(PORT, () => {
  log('INFO', `Server started on port ${PORT}`);
  log('INFO', `GitHub token: ${GITHUB_TOKEN ? 'set' : 'NOT SET'}`);
  log('INFO', 'Admin password: set');
});
