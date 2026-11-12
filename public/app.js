'use strict';

/* =========================================================
   Utilities
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = (o) => JSON.parse(JSON.stringify(o));
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const isTyping = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

const COLORS = ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'];
const SECTION_ICONS = ['folder', 'users', 'code', 'flask', 'bug', 'briefcase', 'star', 'layers', 'rocket'];

const TYPES = {
  text:        { label: 'Text',         icon: 'text',     desc: 'Short single line' },
  longtext:    { label: 'Long text',    icon: 'longtext', desc: 'Descriptions, notes' },
  select:      { label: 'Dropdown',     icon: 'select',   desc: 'One colored option' },
  multiselect: { label: 'Multi-select', icon: 'tags',     desc: 'Several tags' },
  people:      { label: 'People',       icon: 'users',    desc: 'Names as chips' },
  links:       { label: 'Links',        icon: 'link',     desc: 'Label + hyperlink' },
  date:        { label: 'Date',         icon: 'calendar', desc: 'Calendar date' },
  number:      { label: 'Number',       icon: 'hash',     desc: 'Numeric value' },
  checkbox:    { label: 'Checkbox',     icon: 'check',    desc: 'Yes / no' },
  email:       { label: 'Email',        icon: 'mail',     desc: 'Click to send mail' },
  phone:       { label: 'Phone',        icon: 'phone',    desc: 'Click to call' },
  progress:    { label: 'Progress',     icon: 'progress', desc: '0–100% bar' },
  rating:      { label: 'Rating',       icon: 'star',     desc: '1–5 stars' },
  created:     { label: 'Created time', icon: 'clockPlus', desc: 'Filled automatically' },
  updated:     { label: 'Last edited',  icon: 'clock',    desc: 'Filled automatically' },
};
const DEFAULT_WIDTH = { text: 200, longtext: 280, select: 150, multiselect: 200, people: 220, links: 190, date: 150, number: 110, checkbox: 100, email: 210, phone: 150, progress: 160, rating: 130, created: 170, updated: 170 };
// Auto columns read row metadata instead of a stored cell value
const AUTO = { created: 'createdAt', updated: 'updatedAt' };
const val = (col, row) => (AUTO[col.type] ? row[AUTO[col.type]] : row.cells[col.id]);

const ICONS = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
  text: '<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
  longtext: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  select: '<circle cx="12" cy="12" r="9"/><path d="m8.5 10.5 3.5 3.5 3.5-3.5"/>',
  tags: '<path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M16 4a4 4 0 0 1 0 8M22 21v-1a6 6 0 0 0-4-5.6"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  check: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/>',
  tick: '<path d="M20 6 9 17l-5-5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  more: '<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7 15h10"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  bug: '<rect x="8" y="6" width="8" height="14" rx="4"/><path d="M12 20v-9M3 13h5M16 13h5M4 7l4 2M20 7l-4 2M4 19l4-2M20 19l-4-2M9.5 6 8 3M14.5 6 16 3"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  rocket: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.1 2.1 0 0 0-2.9-.1z"/><path d="M12 15 9 12a22 22 0 0 1 2-4 13 13 0 0 1 11-6c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.5-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.5 4-2c1.1-1.6 0-5 0-5"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  arrowDown: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  upload: '<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',
  grip: '<circle cx="9" cy="6" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.4" fill="currentColor" stroke="none"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  progress: '<rect x="2" y="8" width="20" height="8" rx="4"/><path d="M6 12h7"/>',
  clockPlus: '<path d="M12 7v5l3 2"/><path d="M21 12a9 9 0 1 0-9 9"/><path d="M19 15v6M16 18h6"/>',
  chevLeft: '<path d="m15 18-6-6 6-6"/>',
  chevRight: '<path d="m9 18 6-6-6-6"/>',
  chevsLeft: '<path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/>',
  chevsRight: '<path d="m13 17 5-5-5-5M6 17l5-5-5-5"/>',
  chevDown: '<path d="m6 9 6 6 6-6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
};
const icon = (n, s = 16) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* =========================================================
   Default data
   ========================================================= */
function defaultDb() {
  const opt = (label, color) => ({ id: uid(), label, color });
  const col = (name, type, width, options) => ({ id: uid(), name, type, width: width || DEFAULT_WIDTH[type], ...(options ? { options } : {}) });
  const prio = () => [opt('Medium', 'yellow'), opt('High', 'orange'), opt('Highest', 'red')];
  const now = Date.now();
  const row = (cells, ago = 0) => ({ id: uid(), createdAt: now - ago, updatedAt: now - ago, cells });

  const sCust = { id: uid(), name: 'Customers', icon: 'users' };
  const sDev = { id: uid(), name: 'Development', icon: 'code' };
  const sTest = { id: uid(), name: 'Testing', icon: 'flask' };

  const c = [
    col('Customer name', 'text', 220),
    col('Priority', 'select', 130, prio()),
    col('Status', 'select', 150, [opt('Initial lead', 'gray'), opt('Demo', 'blue'), opt('POC', 'purple'), opt('Open issues', 'orange'), opt('Converted', 'green')]),
    col('Description', 'longtext', 300),
    col('CP ticket', 'links', 180),
    col('CSE & members', 'people', 240),
    col('Use case', 'text', 240),
  ];
  const custRows = [
    row({ [c[0].id]: 'Acme Corp (sample)', [c[1].id]: c[1].options[2].id, [c[2].id]: c[2].options[2].id,
      [c[3].id]: 'Evaluating SSO + user provisioning for ~2k users.\nDelete this sample row any time.',
      [c[4].id]: [{ label: 'CP-1024', url: 'https://example.com/CP-1024' }], [c[5].id]: ['Alex M', 'Sam R'],
      [c[6].id]: 'SAML SSO with Azure AD' }, 3600e3),
    row({ [c[0].id]: 'Globex (sample)', [c[1].id]: c[1].options[0].id, [c[2].id]: c[2].options[1].id,
      [c[3].id]: 'Wants a walkthrough of adaptive MFA policies.', [c[5].id]: ['Sam R'],
      [c[6].id]: 'Adaptive MFA for remote workforce' }, 86400e3),
  ];

  const devCols = [
    col('Task', 'text', 260),
    col('Status', 'select', 140, [opt('To do', 'gray'), opt('In progress', 'blue'), opt('In review', 'purple'), opt('Blocked', 'red'), opt('Done', 'green')]),
    col('Priority', 'select', 120, prio()),
    col('Assignees', 'people', 200),
    col('Ticket', 'links', 170),
    col('Due date', 'date', 140),
    col('Notes', 'longtext', 280),
  ];
  const testCols = [
    col('Test case', 'text', 260),
    col('Module', 'text', 160),
    col('Status', 'select', 140, [opt('Not started', 'gray'), opt('Running', 'blue'), opt('Passed', 'green'), opt('Failed', 'red'), opt('Blocked', 'orange')]),
    col('Severity', 'select', 120, [opt('Low', 'gray'), opt('Medium', 'yellow'), opt('High', 'orange'), opt('Critical', 'red')]),
    col('Tester', 'people', 180),
    col('Bug ticket', 'links', 170),
    col('Notes', 'longtext', 280),
  ];

  return {
    version: 1,
    sections: [sCust, sDev, sTest],
    boards: [
      { id: uid(), sectionId: sCust.id, name: 'All customers', color: 'blue', columns: c, rows: custRows },
      { id: uid(), sectionId: sDev.id, name: 'General', color: 'purple', columns: devCols, rows: [] },
      { id: uid(), sectionId: sTest.id, name: 'Regression', color: 'green', columns: testCols, rows: [] },
    ],
  };
}

function basicColumns() {
  const opt = (label, color) => ({ id: uid(), label, color });
  return [
    { id: uid(), name: 'Title', type: 'text', width: 260 },
    { id: uid(), name: 'Status', type: 'select', width: 140, options: [opt('To do', 'gray'), opt('In progress', 'blue'), opt('Done', 'green')] },
    { id: uid(), name: 'Priority', type: 'select', width: 120, options: [opt('Medium', 'yellow'), opt('High', 'orange'), opt('Highest', 'red')] },
    { id: uid(), name: 'Owner', type: 'people', width: 200 },
    { id: uid(), name: 'Link', type: 'links', width: 170 },
    { id: uid(), name: 'Notes', type: 'longtext', width: 280 },
  ];
}

function migrate(d) {
  d.sections = Array.isArray(d.sections) ? d.sections : [];
  d.boards = Array.isArray(d.boards) ? d.boards : [];
  if (!d.sections.length) d.sections.push({ id: uid(), name: 'General', icon: 'folder' });
  const secIds = new Set(d.sections.map((s) => s.id));
  for (const b of d.boards) {
    if (!secIds.has(b.sectionId)) b.sectionId = d.sections[0].id;
    b.color = COLORS.includes(b.color) ? b.color : 'blue';
    b.columns = Array.isArray(b.columns) ? b.columns : [];
    if (!b.columns.length) b.columns.push({ id: uid(), name: 'Name', type: 'text', width: 220 });
    for (const c of b.columns) {
      if (!TYPES[c.type]) c.type = 'text';
      if ((c.type === 'select' || c.type === 'multiselect') && !Array.isArray(c.options)) c.options = [];
    }
    b.rows = Array.isArray(b.rows) ? b.rows : [];
    for (const r of b.rows) { r.cells = r.cells || {}; r.createdAt ||= Date.now(); r.updatedAt ||= r.createdAt; }
  }
  return d;
}

/* =========================================================
   State & persistence
   ========================================================= */
let db = null;
let saveState = 'local';
const ui = Object.assign({ view: 'overview', theme: 'system', search: '', sorts: {}, filters: {}, collapsed: {}, drawer: null, pinRow: null }, loadUi());

function loadUi() { try { return JSON.parse(localStorage.getItem('tracker-ui')) || {}; } catch { return {}; } }
function saveUi() {
  try {
    const { view, theme, accent, name, onboarded, tourDone, sorts, filters, collapsed, ovBoard } = ui;
    localStorage.setItem('tracker-ui', JSON.stringify({ view, theme, accent, name, onboarded, tourDone, sorts, filters, collapsed, ovBoard }));
  } catch { /* storage unavailable */ }
}

/* ---------- Storage model ----------
   All data lives in this browser (localStorage key `tracker-db`).
   `db`     : what this page shows / edits
   `synced` : what is currently stored (the merge base)
   If another tab saves at the same time, the two versions are three-way merged
   (base=synced, ours=db, theirs=other tab): different rows / cells / columns
   combine cleanly; only a true same-cell clash keeps this tab's edit. */
let synced = null;

function load() {
  let raw = null;
  try { raw = localStorage.getItem('tracker-db'); } catch { /* storage blocked */ }
  try { db = raw ? JSON.parse(raw) : null; } catch { db = null; }
  db = migrate(db || defaultDb());
  synced = clone(db);
}

const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const isPlainObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isIdList = (v) => Array.isArray(v) && v.every((x) => isPlainObj(x) && typeof x.id === 'string');

function merge3(base, ours, theirs) {
  if (sameJson(ours, theirs)) return ours;
  if (sameJson(base, ours)) return theirs;
  if (sameJson(base, theirs)) return ours;
  if (isPlainObj(ours) && isPlainObj(theirs)) {
    const b = isPlainObj(base) ? base : {};
    const out = {};
    for (const k of new Set([...Object.keys(ours), ...Object.keys(theirs)])) {
      const v = merge3(b[k], ours[k], theirs[k]);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  if (isIdList(ours) && isIdList(theirs) && (base === undefined || isIdList(base))) return mergeList(base || [], ours, theirs);
  return ours; // genuine conflict on the same value: the local edit wins
}

function mergeList(base, ours, theirs) {
  const map = (a) => new Map(a.map((x) => [x.id, x]));
  const B = map(base), O = map(ours), T = map(theirs);
  const keep = (id) => (B.has(id) ? O.has(id) && T.has(id) : O.has(id) || T.has(id));
  const ids = (a) => a.map((x) => x.id);
  const reordered = (a) => {
    const inA = new Set(ids(a));
    return !sameJson(ids(a).filter((id) => B.has(id)), ids(base).filter((id) => inA.has(id)));
  };
  const [primary, secondary] = !reordered(ours) && reordered(theirs) ? [theirs, ours] : [ours, theirs];
  const order = ids(primary).filter(keep);
  const sec = ids(secondary);
  sec.forEach((id, i) => {
    if (!keep(id) || order.includes(id)) return;
    let at = 0;
    for (let j = i - 1; j >= 0; j--) { const k = order.indexOf(sec[j]); if (k >= 0) { at = k + 1; break; } }
    order.splice(at, 0, id);
  });
  return order.map((id) => (!O.has(id) ? T.get(id) : !T.has(id) ? O.get(id) : merge3(B.get(id), O.get(id), T.get(id))));
}

const hasLocalChanges = () => !synced || !sameJson(db, synced);
const isBusy = () => !!pop || !!modalEl || document.body.classList.contains('resizing') || document.body.classList.contains('row-dragging');

// Called whenever an editor / dialog / drag finishes: apply changes from other tabs that waited
function flushRemote() {
  if (localPending && !isBusy()) { const t = localPending; localPending = null; applyLocalRemote(t); }
}

let saveTimer = null;
function save() {
  setStatus('local');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { saveTimer = null; persist(); }, 350);
}
function persist() {
  try {
    const snap = JSON.stringify(db);
    localStorage.setItem('tracker-db', snap);
    synced = JSON.parse(snap);
    setStatus('local');
  } catch { setStatus('error'); }
  scheduleBackup();
}

function setStatus(s) {
  saveState = s;
  const el = $('#save-status');
  if (!el) return;
  const txt = { local: 'Saved in this browser', error: 'Could not save — browser storage is full or blocked' }[s] || 'Saved in this browser';
  el.className = 'save-status ' + s;
  el.innerHTML = `<i></i><span>${txt}</span>`;
  el.title = 'Your data is stored in this browser. Use the ⋯ menu to export a backup file or import one.';
}

/* =========================================================
   Data helpers
   ========================================================= */
const board = (id) => db.boards.find((b) => b.id === id);
const section = (id) => db.sections.find((s) => s.id === id);
const curBoard = () => board(ui.view);
// Board that owns a DOM element (a table can live on its own page or in the overview browser)
const ctxBoard = (el) => board(el?.closest('[data-board]')?.dataset.board) || curBoard();
const ovBoard = () => board(ui.ovBoard) || db.boards[0];
// Re-render a board's table wherever it is currently shown
function refreshBoard(b) { if (ui.view === b.id) renderBoardBody(b); else renderMain(); }
const rowEl = (b, rowId) => $(`table[data-board="${b.id}"] tr[data-row="${rowId}"]`);
const boardsOf = (secId) => db.boards.filter((b) => b.sectionId === secId);
const optOf = (col, id) => (col.options || []).find((o) => o.id === id);
const selCols = (b) => b.columns.filter((c) => c.type === 'select');
const statusCol = (b) => { const s = selCols(b); return s.find((c) => /status|stage|state/i.test(c.name)) || s.find((c) => !/priority|severity|urgency/i.test(c.name)) || s[0]; };
const prioCol = (b) => selCols(b).find((c) => /priority|severity|urgency/i.test(c.name));

function nextColor(col) {
  const used = new Set((col.options || []).map((o) => o.color));
  const pool = COLORS.filter((c) => c !== 'gray');
  return pool.find((c) => !used.has(c)) || pool[(col.options || []).length % pool.length];
}

function isEmpty(col, v) {
  if (v == null || v === '' || v === false) return true;
  if (Array.isArray(v)) return v.length === 0;
  if ((col.type === 'number' || col.type === 'progress') && Number.isNaN(v)) return true;
  if (col.type === 'rating' && !v) return true;
  return false;
}

function cellText(col, v) {
  if (v == null) return '';
  switch (col.type) {
    case 'select': return optOf(col, v)?.label || '';
    case 'multiselect': return (v || []).map((id) => optOf(col, id)?.label).filter(Boolean).join(', ');
    case 'people': return (v || []).join(', ');
    case 'links': return (v || []).map((l) => l.label || l.url).join(', ');
    case 'checkbox': return v ? 'Yes' : '';
    case 'progress': return `${v}%`;
    case 'rating': return v ? `${v}/5` : '';
    case 'created': case 'updated': return fmtDateTime(v);
    default: return String(v);
  }
}

function setCell(row, col, nv) {
  const empty = isEmpty(col, nv);
  const old = row.cells[col.id];
  if (empty && isEmpty(col, old)) return false;
  if (!empty && JSON.stringify(old) === JSON.stringify(nv)) return false;
  if (empty) delete row.cells[col.id]; else row.cells[col.id] = nv;
  row.updatedAt = Date.now();
  save();
  return true;
}

const safeHref = (u) => (/^(https?:|mailto:)/i.test(u || '') ? u : '');
function normUrl(u) {
  u = (u || '').trim();
  if (!u) return '';
  if (/^(https?:|mailto:)/i.test(u)) return u;
  if (/^[a-z][\w+.-]*:/i.test(u)) return '';
  return 'https://' + u.replace(/^\/+/, '');
}
const isUrlish = (s) => /^(https?:\/\/|www\.)\S+$/i.test((s || '').trim()) || /^[\w-]+(\.[\w-]+)+\/\S*$/.test((s || '').trim());
function deriveLabel(url) {
  try {
    const u = new URL(url);
    const seg = u.pathname.split('/').filter(Boolean).pop();
    return seg ? decodeURIComponent(seg) : u.hostname.replace(/^www\./, '');
  } catch { return url; }
}

function initials(n) { return n.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase(); }
function colorFor(n) {
  let x = 0;
  for (const ch of n.toLowerCase()) x = (x * 31 + ch.charCodeAt(0)) >>> 0;
  const pool = COLORS.filter((c) => c !== 'gray' && c !== 'yellow');
  return pool[x % pool.length];
}
function allPeople() {
  const set = new Map();
  for (const b of db.boards) for (const c of b.columns) if (c.type === 'people')
    for (const r of b.rows) for (const n of r.cells[c.id] || []) set.set(n.toLowerCase(), n);
  return [...set.values()].sort((a, b) => a.localeCompare(b));
}

function fmtDate(v) {
  const d = new Date(v + 'T00:00:00');
  return isNaN(d) ? v : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtShortDT(ts) {
  const d = new Date(ts);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }), hour: 'numeric', minute: '2-digit' });
}
function fmtDateTime(ts) { return new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }); }
function relTime(ts) {
  const s = (Date.now() - ts) / 1000;
  if (s < 45) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.round(s / 86400)}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseYmd = (s) => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); };
const addDays = (s, n) => { const d = parseYmd(s); d.setDate(d.getDate() + n); return ymd(d); };
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

/* =========================================================
   Value rendering
   ========================================================= */
function chipHtml(o, rm) {
  return `<span class="chip c-${o.color}"><i class="dot"></i><span>${esc(o.label)}</span>${rm ? `<button type="button" class="chip-x" data-rm="${o.id}" title="Remove">${icon('x', 11)}</button>` : ''}</span>`;
}
function personHtml(n, i) {
  return `<span class="person"><span class="av c-${colorFor(n)}">${esc(initials(n))}</span><span>${esc(n)}</span>${i != null ? `<button type="button" class="chip-x" data-rm="${i}" title="Remove">${icon('x', 11)}</button>` : ''}</span>`;
}

function starsHtml(v) {
  return `<span class="stars" title="${v ? `${v} of 5` : 'Not rated'}">${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="star ${n <= (v || 0) ? 'on' : ''}" data-star="${n}" aria-label="${n} star${n > 1 ? 's' : ''}">${icon('star', 15)}</button>`).join('')}</span>`;
}
function dateChip(col, v) {
  let cls = '', hint = '';
  if (/due|deadline|eta|target|end|expir|renew/i.test(col.name)) {
    const t = todayStr();
    if (v < t) { cls = 'overdue'; hint = 'Overdue'; }
    else if (v === t) { cls = 'today'; hint = 'Due today'; }
    else if (v <= addDays(t, 3)) { cls = 'soon'; hint = 'Due soon'; }
  }
  return `<span class="dchip ${cls}" title="${esc(hint || fmtDate(v))}">${icon('calendar', 12)}<span>${esc(fmtDate(v))}</span></span>`;
}

function renderValue(col, v) {
  if (col.type === 'rating') return starsHtml(v);
  if (isEmpty(col, v)) return '';
  switch (col.type) {
    case 'text': return `<span class="txt">${esc(v)}</span>`;
    case 'longtext': return `<span class="ltxt">${esc(v)}</span>`;
    case 'number': return `<span class="txt">${esc(v)}</span>`;
    case 'select': { const o = optOf(col, v); return o ? `<div class="cv">${chipHtml(o)}</div>` : ''; }
    case 'multiselect': return `<div class="cv">${v.map((id) => optOf(col, id)).filter(Boolean).map((o) => chipHtml(o)).join('')}</div>`;
    case 'people': return `<div class="cv">${v.map((n) => personHtml(n)).join('')}</div>`;
    case 'links': return `<div class="cv">${v.map((l) => {
      const href = safeHref(l.url);
      const label = esc(l.label || l.url);
      return href
        ? `<a class="lnk" href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="${esc(l.url)}">${icon('link', 12)}<span class="txt">${label}</span></a>`
        : `<span class="lnk nourl">${label}</span>`;
    }).join('')}</div>`;
    case 'date': return dateChip(col, v);
    case 'checkbox': return `<span class="cbx on">${icon('tick', 12)}</span>`;
    case 'email': {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      return ok ? `<div class="cv"><a class="lnk" href="mailto:${esc(v)}" title="Send email">${icon('mail', 12)}<span class="txt">${esc(v)}</span></a></div>` : `<span class="txt">${esc(v)}</span>`;
    }
    case 'phone': {
      const tel = String(v).replace(/[^\d+]/g, '');
      return tel ? `<div class="cv"><a class="lnk" href="tel:${esc(tel)}" title="Call">${icon('phone', 12)}<span class="txt">${esc(v)}</span></a></div>` : `<span class="txt">${esc(v)}</span>`;
    }
    case 'progress': {
      const p = Math.max(0, Math.min(100, Math.round(+v || 0)));
      return `<div class="prog ${p >= 100 ? 'done' : ''}"><div class="prog-bar"><i style="width:${p}%"></i></div><span>${p}%</span></div>`;
    }
    case 'created': case 'updated':
      return `<span class="dchip auto" title="${esc(fmtDateTime(v))}">${icon(col.type === 'created' ? 'clockPlus' : 'clock', 12)}<span>${esc(fmtShortDT(v))}</span></span>`;
  }
  return esc(v);
}

/* =========================================================
   Filtering & sorting
   ========================================================= */
function filterCount(b) { return Object.values(ui.filters[b.id] || {}).reduce((a, x) => a + x.length, 0); }

function visibleRows(b) {
  const q = ui.search.trim().toLowerCase();
  const f = ui.filters[b.id] || {};
  let rows = b.rows.filter((r) => {
    if (r.id === ui.pinRow) return true;
    for (const [cid, ids] of Object.entries(f)) {
      if (!ids.length) continue;
      const col = b.columns.find((c) => c.id === cid);
      if (!col) continue;
      const v = r.cells[cid];
      const vals = col.type === 'multiselect' ? v || [] : v ? [v] : [];
      if (!ids.some((id) => (id === '__empty' ? vals.length === 0 : vals.includes(id)))) return false;
    }
    if (q && !b.columns.some((c) => cellText(c, val(c, r)).toLowerCase().includes(q))) return false;
    return true;
  });
  const s = ui.sorts[b.id];
  const col = s && b.columns.find((c) => c.id === s.col);
  if (col) {
    const key = (v) => {
      if (isEmpty(col, v)) return null;
      switch (col.type) {
        case 'select': return col.options.findIndex((o) => o.id === v);
        case 'multiselect': return col.options.findIndex((o) => o.id === v[0]);
        case 'number': case 'progress': case 'rating': case 'created': case 'updated': return +v;
        case 'checkbox': return v ? 1 : 0;
        default: return cellText(col, v).toLowerCase();
      }
    };
    rows = rows.map((r) => [r, key(val(col, r))]).sort(([, a], [, c]) => {
      if (a === null && c === null) return 0;
      if (a === null) return 1;
      if (c === null) return -1;
      return (typeof a === 'number' ? a - c : String(a).localeCompare(String(c), undefined, { numeric: true })) * s.dir;
    }).map(([r]) => r);
  }
  return rows;
}

function toggleFilterRaw(b, colId, optId) {
  const f = (ui.filters[b.id] ||= {});
  const arr = (f[colId] ||= []);
  const i = arr.indexOf(optId);
  if (i >= 0) arr.splice(i, 1); else arr.push(optId);
  if (!arr.length) delete f[colId];
  saveUi();
}

/* =========================================================
   Rendering
   ========================================================= */
function render() {
  renderPending = false;
  if (!db) return;
  renderSidebar();
  renderMain();
  renderDrawer();
}

function renderSidebar() {
  const side = $('#side');
  side.innerHTML = `
    <div class="brand"><div class="logo">${icon('layers', 18)}</div><div><b>Tracker</b><small>Customers · Dev · QA</small></div></div>
    <button class="me" data-act="profile" title="Your name, theme & tour">
      <span class="me-av">${ui.name ? esc(initials(ui.name)) : icon('users', 14)}</span>
      <span class="me-txt"><b>${ui.name ? esc(ui.name) : 'Set your name'}</b><small>${ui.name ? 'My workspace' : 'Personalise Tracker'}</small></span>
      ${icon('chevDown', 14)}
    </button>
    <nav class="nav">
      <div class="nav-item ${ui.view === 'overview' ? 'active' : ''}" data-nav="overview">${icon('grid', 16)}<span class="nm">Overview</span></div>
      <div class="nav-sep">Workspace</div>
      ${db.sections.map((sec) => {
        const bs = boardsOf(sec.id);
        return `<div class="sec ${ui.collapsed[sec.id] ? 'collapsed' : ''}">
          <div class="sec-head">
            <button class="sec-tog" data-act="sec-toggle" data-sec="${sec.id}" title="Collapse">${icon('chevDown', 14)}</button>
            <span class="sec-ic">${icon(sec.icon || 'folder', 15)}</span>
            <span class="sec-name" data-act="sec-toggle" data-sec="${sec.id}">${esc(sec.name)}</span>
            <span class="sec-acts">
              <button class="icon-btn xs" data-act="add-board" data-sec="${sec.id}" title="Add category">${icon('plus', 14)}</button>
              <button class="icon-btn xs" data-act="sec-menu" data-sec="${sec.id}" title="Section options">${icon('more', 14)}</button>
            </span>
          </div>
          <div class="sec-boards">
            ${bs.map((b) => `<div class="nav-item sub ${ui.view === b.id ? 'active' : ''}" data-nav="${b.id}"><span class="b-dot c-${b.color}"></span><span class="nm">${esc(b.name)}</span><span class="count">${b.rows.length}</span></div>`).join('')}
            ${bs.length ? '' : `<div class="nav-empty" data-act="add-board" data-sec="${sec.id}">+ Add a category</div>`}
          </div>
        </div>`;
      }).join('')}
      <div class="nav-item add" data-act="add-section">${icon('plus', 15)}<span class="nm">New section</span></div>
    </nav>
    <div class="side-foot">
      <div class="save-row"><div id="save-status" class="save-status"></div><span class="spacer"></span><button class="icon-btn xs" data-act="app-menu" title="Backup & import">${icon('database', 14)}</button></div>
      <div class="theme-seg">${['light', 'system', 'dark'].map((t) => `<button class="${ui.theme === t ? 'on' : ''}" data-act="theme" data-t="${t}" title="${t[0].toUpperCase() + t.slice(1)} theme">${icon(t === 'light' ? 'sun' : t === 'dark' ? 'moon' : 'monitor', 14)}</button>`).join('')}</div>
    </div>`;
  setStatus(saveState);
}

function renderMain() {
  const main = $('#main');
  const qa = document.activeElement?.id === 'q' ? { s: document.activeElement.selectionStart, e: document.activeElement.selectionEnd } : null;
  const tw = $('#tw');
  const keep = tw && tw.dataset.view === ui.view ? { t: tw.scrollTop, l: tw.scrollLeft } : null;
  const ovKeep = $('.ov') && ui.view === 'overview' ? $('.ov').scrollTop : null;
  const ovt = $('#ovb-tw');
  const ovtKeep = ovt && ovt.dataset.view === ui.ovBoard ? { t: ovt.scrollTop, l: ovt.scrollLeft } : null;
  const tabsKeep = $('.ovb-tabs')?.scrollLeft;
  const b = curBoard();
  if (!b) {
    ui.view = 'overview';
    main.innerHTML = overviewHtml();
    if (ovKeep != null) $('.ov').scrollTop = ovKeep;
    if (ovtKeep) { const t = $('#ovb-tw'); if (t) { t.scrollTop = ovtKeep.t; t.scrollLeft = ovtKeep.l; } }
    const tabs = $('.ovb-tabs');
    if (tabs && tabsKeep != null) tabs.scrollLeft = tabsKeep;
    return;
  }
  main.innerHTML = boardHtml(b);
  renderBoardBody(b);
  if (keep) { const t = $('#tw'); t.scrollTop = keep.t; t.scrollLeft = keep.l; }
  if (qa) { const q = $('#q'); q.focus({ preventScroll: true }); try { q.setSelectionRange(qa.s, qa.e); } catch { /* search inputs may not support it */ } }
}

function boardHtml(b) {
  const s = section(b.sectionId);
  const fc = filterCount(b);
  return `
    <header class="topbar">
      <button class="icon-btn only-mobile" data-act="toggle-side">${icon('menu', 18)}</button>
      <div class="title-wrap">
        <div class="crumb">${icon(s?.icon || 'folder', 13)}<span>${esc(s?.name || '')}</span></div>
        <h1 class="board-title" data-act="rename-board" title="Rename / change color"><span class="b-dot c-${b.color}"></span>${esc(b.name)}</h1>
      </div>
      <div class="spacer"></div>
      <label class="search">${icon('search', 15)}<input id="q" type="search" placeholder="Search rows…" value="${esc(ui.search)}" autocomplete="off"><kbd>/</kbd></label>
      <button class="btn" data-act="filter">${icon('filter', 15)}<span>Filter</span>${fc ? `<span class="badge">${fc}</span>` : ''}</button>
      <button class="btn icon" data-act="board-menu" title="Category options">${icon('more', 16)}</button>
      <button class="btn primary" data-act="new-row">${icon('plus', 15)}<span>New</span></button>
    </header>
    <section id="summary" class="summary"></section>
    <div class="table-wrap" id="tw" data-view="${b.id}"></div>`;
}

function renderBoardBody(b) {
  $('#summary').innerHTML = summaryHtml(b);
  $('#tw').innerHTML = tableHtml(b);
}

function updateFilterBadge(b) {
  const btn = $('[data-act="filter"]');
  if (!btn) return;
  $('.badge', btn)?.remove();
  const n = filterCount(b);
  if (n) btn.insertAdjacentHTML('beforeend', `<span class="badge">${n}</span>`);
}

function distribution(col, rows) {
  const has = (v, id) => (col.type === 'multiselect' ? (v || []).includes(id) : v === id);
  const counts = col.options.map((o) => ({ o, n: rows.filter((r) => has(r.cells[col.id], o.id)).length }));
  const empty = rows.filter((r) => isEmpty(col, r.cells[col.id])).length;
  return { counts, empty };
}
function barHtml(col, rows) {
  const { counts, empty } = distribution(col, rows);
  const segs = counts.filter((x) => x.n).map((x) => `<span class="seg c-${x.o.color}" style="flex:${x.n}" title="${esc(x.o.label)}: ${x.n}"></span>`).join('')
    + (empty ? `<span class="seg empty" style="flex:${empty}" title="No value: ${empty}"></span>` : '');
  return `<div class="bar">${segs}</div>`;
}

function summaryHtml(b) {
  const rows = b.rows;
  const vis = visibleRows(b).length;
  const cols = b.columns.filter((c) => c.type === 'select' || c.type === 'multiselect').slice(0, 3);
  const f = ui.filters[b.id] || {};
  let html = `<div class="stat-card total"><div class="stat-label">${icon('layers', 13)} Items</div><div class="stat-num">${rows.length}</div><div class="stat-sub">${vis === rows.length ? 'all shown' : `${vis} shown`}${filterCount(b) ? ` · <a href="#" data-act="clear-filters" style="color:var(--accent)">clear</a>` : ''}</div></div>`;
  for (const col of cols) {
    const { counts } = distribution(col, rows);
    const on = f[col.id] || [];
    html += `<div class="stat-card">
      <div class="stat-label">${icon(TYPES[col.type].icon, 13)} ${esc(col.name)}</div>
      ${barHtml(col, rows)}
      <div class="legend">${counts.map(({ o, n }) => `<button class="leg ${on.includes(o.id) ? 'on' : ''} ${n ? '' : 'zero'}" data-act="sum-filter" data-col="${col.id}" data-opt="${o.id}" title="Filter by ${esc(o.label)}"><i class="dot c-${o.color}"></i>${esc(o.label)} <b>${n}</b></button>`).join('')}</div>
    </div>`;
  }
  return html;
}

const GUTTER = 64;
const tableWidth = (b) => GUTTER + b.columns.reduce((a, c) => a + (c.width || DEFAULT_WIDTH[c.type] || 180), 0) + 52;

function tableHtml(b) {
  const rows = visibleRows(b);
  const cols = b.columns;
  const s = ui.sorts[b.id];
  let out = `<table class="grid" data-board="${b.id}" style="width:max(${tableWidth(b)}px,100%)">
    <colgroup><col style="width:${GUTTER}px">${cols.map((c) => `<col data-col="${c.id}" style="width:${c.width || DEFAULT_WIDTH[c.type]}px">`).join('')}<col style="min-width:52px"></colgroup>
    <thead><tr><th class="gutter">#</th>`;
  cols.forEach((c, i) => {
    out += `<th class="colhead ${i === 0 ? 'stick1' : ''}" data-act="col-menu" data-col="${c.id}" title="${esc(c.name)} · ${TYPES[c.type].label}">
      <div class="th-in">${icon(TYPES[c.type].icon, 14)}<span class="th-name">${esc(c.name)}</span>${s && s.col === c.id ? `<span class="sort-ind">${icon(s.dir > 0 ? 'arrowUp' : 'arrowDown', 13)}</span>` : ''}</div>
      <div class="resizer" data-resize="${c.id}"></div></th>`;
  });
  out += `<th class="add-col"><button class="icon-btn" data-act="add-col" title="Add column">${icon('plus', 16)}</button></th></tr></thead><tbody>`;
  rows.forEach((r, i) => {
    out += `<tr data-row="${r.id}"><td class="gutter"><div class="g-in"><span class="rn">${i + 1}</span><button class="drag-h" title="${s ? 'Clear the sort to reorder rows' : 'Drag to reorder · Alt+↑/↓'}" aria-label="Reorder row">${icon('grip', 14)}</button><button class="open-row" data-act="open-row" title="Open details">${icon('expand', 13)}</button></div></td>`;
    cols.forEach((c, j) => { out += `<td class="cell t-${c.type} ${j === 0 ? 'stick1' : ''}" data-col="${c.id}" tabindex="0">${renderValue(c, val(c, r))}</td>`; });
    out += `<td class="row-end"><button class="icon-btn sm danger-hover" data-act="del-row" title="Delete row">${icon('trash', 14)}</button></td></tr>`;
  });
  if (!rows.length) {
    out += `<tr class="empty-tr"><td colspan="${cols.length + 2}"><div class="empty">${b.rows.length ? 'No rows match your search or filters.' : 'No rows yet — click <b>New</b> to add the first one.'}</div></td></tr>`;
  }
  out += `</tbody><tfoot><tr><td class="gutter"></td><td colspan="${cols.length + 1}" class="add-row-td"><button class="add-row" data-act="add-row">${icon('plus', 14)} New row</button></td></tr></tfoot></table>`;
  return out;
}

function overviewHtml() {
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const week = Date.now() - 7 * 86400e3;
  let weekCount = 0;
  const recent = [];
  for (const b of db.boards) for (const r of b.rows) { if (r.updatedAt > week) weekCount++; recent.push({ b, r }); }
  recent.sort((a, c) => c.r.updatedAt - a.r.updatedAt);
  const secColors = ['blue', 'purple', 'green', 'orange', 'pink', 'teal'];

  const kpis = db.sections.map((s, i) => {
    const bs = boardsOf(s.id);
    const n = bs.reduce((a, b) => a + b.rows.length, 0);
    return `<div class="kpi"><div class="kpi-ic c-${secColors[i % secColors.length]}">${icon(s.icon || 'folder', 20)}</div><div><div class="kpi-num">${n}</div><div class="kpi-lbl">${esc(s.name)} · ${bs.length} ${bs.length === 1 ? 'category' : 'categories'}</div></div></div>`;
  }).join('') + `<div class="kpi"><div class="kpi-ic c-gray">${icon('clock', 20)}</div><div><div class="kpi-num">${weekCount}</div><div class="kpi-lbl">Updated in the last 7 days</div></div></div>`;

  const card = (b, sec) => {
    const sc = statusCol(b), pc = prioCol(b);
    let body = '';
    if (!b.rows.length) body = `<div class="bcard-empty">No rows yet</div>`;
    else {
      if (sc) {
        const { counts } = distribution(sc, b.rows);
        body += barHtml(sc, b.rows) + `<div class="mini-leg">${counts.filter((x) => x.n).slice(0, 6).map(({ o, n }) => `<span><i class="dot c-${o.color}"></i>${esc(o.label)} <b>${n}</b></span>`).join('')}</div>`;
      }
      if (pc && pc !== sc) {
        const { counts } = distribution(pc, b.rows);
        const chips = counts.filter((x) => x.n).reverse().map(({ o, n }) => `<span class="chip c-${o.color}"><i class="dot"></i>${n} ${esc(o.label)}</span>`).join('');
        if (chips) body += `<div class="chips">${chips}</div>`;
      }
    }
    return `<div class="bcard" data-nav="${b.id}" tabindex="0">
      <div class="bcard-sec">${icon(sec.icon || 'folder', 12)}${esc(sec.name)}</div>
      <div class="bcard-top"><span class="b-dot c-${b.color}"></span><b>${esc(b.name)}</b><span class="num">${b.rows.length}</span></div>
      <div class="bcard-sub">${b.columns.length} columns${sc ? ` · by ${esc(sc.name)}` : ''}</div>${body}</div>`;
  };

  // All categories in one grid (3 per row), ordered by section; empty sections get an "add" tile
  const tiles = db.sections.map((s) => {
    const bs = boardsOf(s.id);
    return bs.length
      ? bs.map((b) => card(b, s)).join('')
      : `<div class="dashed" data-act="add-board" data-sec="${s.id}">${icon('plus', 18)}<span>Add a category to ${esc(s.name)}</span></div>`;
  }).join('');
  const sections = `
    <section class="ov-sec">
      <div class="ov-sec-head"><h2>${icon('grid', 16)} Categories <span class="ovb-pos">${db.boards.length}</span></h2><button class="btn sm ghost" data-act="add-board">${icon('plus', 14)} Category</button></div>
      <div class="cards">${tiles}</div>
    </section>`;

  const recentHtml = recent.slice(0, 30).map(({ b, r }) => {
    const sc = statusCol(b);
    const o = sc && optOf(sc, r.cells[sc.id]);
    const title = cellText(b.columns[0], val(b.columns[0], r)) || 'Untitled';
    return `<button class="recent" data-act="goto-row" data-b="${b.id}" data-r="${r.id}">
      <div class="r-main"><div class="r-title">${esc(title)}</div><div class="r-sub"><span class="b-dot c-${b.color}"></span>${esc(b.name)} · ${relTime(r.updatedAt)}</div></div>
      ${o ? chipHtml(o) : ''}</button>`;
  }).join('') || `<div class="empty sm">Nothing yet. Rows you add or edit show up here.</div>`;

  return `
    <header class="topbar">
      <button class="icon-btn only-mobile" data-act="toggle-side">${icon('menu', 18)}</button>
      <div class="title-wrap"><div class="crumb">${esc(dateStr)}</div><h1>${greet}${firstName() ? `, ${esc(firstName())}` : ''}</h1></div>
      <div class="spacer"></div>
      <button class="btn" data-act="add-section">${icon('plus', 15)}<span>New section</span></button>
    </header>
    <div class="ov">
      <div class="kpis">${kpis}</div>
      <div class="ov-grid">
        ${sections}
        <aside class="ov-side"><div class="panel"><div class="panel-head">${icon('clock', 16)} Recently updated</div><div class="panel-list">${recentHtml}</div></div></aside>
      </div>
      ${browserHtml()}
    </div>`;
}

function browserHtml() {
  const b = ovBoard();
  if (!b) return '';
  ui.ovBoard = b.id;
  const all = db.sections.flatMap((s) => boardsOf(s.id).map((x) => ({ s, b: x })));
  const i = all.findIndex((x) => x.b.id === b.id);
  const fc = filterCount(b);
  const s = ui.sorts[b.id];
  return `
    <section class="ov-browse" id="ov-browse">
      <div class="ovb-head">
        <h2>${icon('layers', 16)} Browse categories <span class="ovb-pos">${i + 1} / ${all.length}</span></h2>
        <div class="ovb-nav">
          <button class="icon-btn" data-act="ovb-step" data-d="-1" title="Previous category (←)">${icon('arrowLeft', 16)}</button>
          <button class="icon-btn" data-act="ovb-step" data-d="1" title="Next category (→)">${icon('arrowRight', 16)}</button>
          <button class="btn sm" data-nav="${b.id}">Open full view ${icon('expand', 13)}</button>
        </div>
      </div>
      <div class="ovb-tabs" role="tablist">
        ${all.map(({ s: sec, b: x }, j) => `${j === 0 || all[j - 1].s !== sec ? `<span class="ovb-sec">${icon(sec.icon || 'folder', 13)}${esc(sec.name)}</span>` : ''}<button class="ovb-tab ${x.id === b.id ? 'on' : ''}" role="tab" data-act="ovb-pick" data-b="${x.id}"><span class="b-dot c-${x.color}"></span>${esc(x.name)}<span class="count">${x.rows.length}</span></button>`).join('')}
      </div>
      ${fc || s ? `<div class="ovb-note">${icon('filter', 13)} Showing this category with its saved ${[fc ? `${fc} filter${fc > 1 ? 's' : ''}` : '', s ? 'sort' : ''].filter(Boolean).join(' and ')} — <a href="#" data-act="ovb-clear">clear</a></div>` : ''}
      <div class="table-wrap ovb-table" id="ovb-tw" data-view="${b.id}">${tableHtml(b)}</div>
    </section>`;
}

function renderDrawer() {
  const d = $('#drawer');
  const st = ui.drawer;
  const b = st && board(st.b);
  const r = b && b.rows.find((x) => x.id === st.r);
  if (!r) {
    ui.drawer = null;
    document.body.classList.remove('drawer-open');
    return;
  }
  const first = b.columns[0];
  const title = cellText(first, val(first, r)) || 'Untitled';
  d.dataset.board = b.id;
  d.innerHTML = `
    <div class="dr-head">
      <div class="crumb"><span class="b-dot c-${b.color}"></span>${esc(section(b.sectionId)?.name || '')} / ${esc(b.name)}</div>
      <div class="dr-actions">
        <button class="icon-btn" data-act="drawer-dup" title="Duplicate row">${icon('copy', 15)}</button>
        <button class="icon-btn danger-hover" data-act="drawer-del" title="Delete row">${icon('trash', 15)}</button>
        <button class="icon-btn" data-act="drawer-close" title="Close (Esc)">${icon('x', 17)}</button>
      </div>
    </div>
    <h2 class="dr-title">${esc(title)}</h2>
    <div class="dr-fields" data-row="${r.id}">
      ${b.columns.map((c) => `<div class="fld">
        <div class="fld-label">${icon(TYPES[c.type].icon, 14)}<span>${esc(c.name)}</span></div>
        <div class="cell fld-val t-${c.type}" data-col="${c.id}" tabindex="0">${renderValue(c, val(c, r)) || '<span class="ph">Empty</span>'}</div>
      </div>`).join('')}
      <div class="fld"><div></div><div><button class="lnk-btn" data-act="add-col-drawer">${icon('plus', 13)} Add a field</button></div></div>
    </div>
    <div class="dr-meta">Created ${esc(fmtDateTime(r.createdAt))} · Updated ${esc(relTime(r.updatedAt))}</div>`;
  document.body.classList.add('drawer-open');
}

/* =========================================================
   Popovers
   ========================================================= */
let pop = null;
let lastClosed = { el: null, t: 0 };
let renderPending = false;

function openPop(anchor, el, o = {}) {
  const rect = anchor.getBoundingClientRect();
  if (pop) closePop(true);
  el.classList.add('pop');
  document.body.appendChild(el);
  const w = Math.max(o.minWidth || 0, o.cover ? rect.width : 0);
  if (w) el.style.width = Math.min(w, innerWidth - 16) + 'px';
  const er = el.getBoundingClientRect();
  let left = o.alignRight ? rect.right - er.width : rect.left;
  let top = o.cover ? rect.top : rect.bottom + 6;
  if (top + er.height > innerHeight - 8) top = o.cover ? Math.max(8, innerHeight - er.height - 8) : Math.max(8, rect.top - er.height - 6);
  left = Math.min(Math.max(8, left), innerWidth - er.width - 8);
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  pop = { el, anchor, onClose: o.onClose, escCommits: !!o.escCommits };
  return pop;
}

function closePop(commit = true, defer = false) {
  if (!pop) return;
  const p = pop;
  pop = null;
  p.el.remove();
  const changed = p.onClose ? p.onClose(commit) : false;
  if (changed) defer ? scheduleRender() : render();
  setTimeout(flushRemote, 0);
}

// Render after the in-flight click finishes so the click still lands on its target.
function scheduleRender() {
  if (renderPending) return;
  renderPending = true;
  const run = () => { if (renderPending) render(); };
  window.addEventListener('pointerup', () => setTimeout(run, 0), { once: true });
  setTimeout(run, 900);
}

const recentlyClosed = (anchor) => lastClosed.el === anchor && Date.now() - lastClosed.t < 450;

document.addEventListener('pointerdown', (e) => {
  if (!pop || pop.el.contains(e.target)) return;
  if (pop.anchor && pop.anchor.contains(e.target)) lastClosed = { el: pop.anchor, t: Date.now() };
  closePop(true, true);
}, true);
document.addEventListener('scroll', (e) => { if (pop && !pop.el.contains(e.target)) closePop(true); }, true);
window.addEventListener('resize', () => pop && closePop(true));

function menu(anchor, items, o = {}) {
  if (recentlyClosed(anchor)) return;
  const el = h('<div class="menu"></div>');
  for (const it of items.filter(Boolean)) {
    if (it.sep) { el.append(h('<div class="menu-sep"></div>')); continue; }
    if (it.note) { el.append(h(`<div class="menu-note">${esc(it.note)}</div>`)); continue; }
    const btn = h(`<button class="menu-item ${it.danger ? 'danger' : ''}" ${it.disabled ? 'disabled' : ''}>${it.icon ? icon(it.icon, 15) : ''}<span>${esc(it.label)}</span>${it.on ? `<span class="mi-tick">${icon('tick', 14)}</span>` : ''}</button>`);
    btn.onclick = () => { closePop(false); it.fn(); };
    el.append(btn);
  }
  openPop(anchor, el, o);
}

/* ---------- Cell editors ---------- */
function cellCtx(cell) {
  const b = board(cell.closest('[data-board]')?.dataset.board);
  const row = b?.rows.find((r) => r.id === cell.closest('[data-row]')?.dataset.row);
  const col = b?.columns.find((c) => c.id === cell.dataset.col);
  return row && col ? { b, row, col } : null;
}

function rateCell(cell, n) {
  const ctx = cellCtx(cell);
  if (!ctx) return;
  setCell(ctx.row, ctx.col, ctx.row.cells[ctx.col.id] === n ? undefined : n);
  render();
}

function editCell(cell) {
  const ctx = cellCtx(cell);
  if (!ctx || recentlyClosed(cell)) return;
  const { b, row, col } = ctx;
  const v = row.cells[col.id];
  const commit = (nv) => setCell(row, col, nv);
  switch (col.type) {
    case 'checkbox': setCell(row, col, !v); render(); return;
    case 'date': return dateEditor(cell, v, commit);
    case 'progress': return progressEditor(cell, v, commit);
    case 'rating': return; // stars are clicked directly
    case 'created': case 'updated': toast(`${TYPES[col.type].label} is filled in automatically`); return;
    case 'longtext': return textEditor(cell, v, commit, 'longtext');
    case 'select': return selectEditor(cell, b, col, v, commit, false);
    case 'multiselect': return selectEditor(cell, b, col, v, commit, true);
    case 'people': return peopleEditor(cell, v, commit);
    case 'links': return linksEditor(cell, v, commit);
    default: return textEditor(cell, v, commit, col.type);
  }
}

function textEditor(anchor, v, commit, type) {
  const multi = type === 'longtext';
  const el = multi
    ? h(`<div class="editor multi"><textarea class="ed-in" rows="7" placeholder="Write something…"></textarea><div class="ed-hint"><span>Ctrl + Enter to save</span><span>Esc to cancel</span></div></div>`)
    : h(`<div class="editor"><input class="ed-in" type="${type === 'number' ? 'number' : type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'}" ${type === 'number' ? 'step="any"' : ''} placeholder="${type === 'email' ? 'name@company.com' : type === 'phone' ? '+91 98765 43210' : ''}"></div>`);
  const inp = $('.ed-in', el);
  inp.value = v ?? '';
  openPop(anchor, el, {
    cover: true,
    minWidth: multi ? 400 : type === 'date' ? 260 : 240,
    onClose: (ok) => {
      if (!ok) return false;
      let nv = inp.value;
      if (type === 'number') nv = nv === '' ? undefined : Number(nv);
      else if (multi) nv = nv.replace(/\s+$/, '');
      else nv = nv.trim();
      return commit(nv === '' ? undefined : nv);
    },
  });
  inp.focus({ preventScroll: true });
  if (multi) inp.setSelectionRange(inp.value.length, inp.value.length);
  else inp.select();
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (!multi || e.ctrlKey || e.metaKey)) { e.preventDefault(); closePop(true); }
    if (e.key === 'Tab') { e.preventDefault(); closePop(true); }
  });
  el.addEventListener('click', (e) => {
    const btn = e.target.closest('.ed-clear');
    if (!btn) return;
    inp.value = btn.hasAttribute('data-clear') ? '' : todayStr();
    closePop(true);
  });
}

function dateEditor(anchor, v, commit) {
  const today = todayStr();
  let sel = v || null;
  let focus = sel || today;
  const view = parseYmd(focus); view.setDate(1);
  const el = h('<div class="cal-ed" tabindex="-1"></div>');
  const draw = () => {
    const y = view.getFullYear(), m = view.getMonth();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7; // weeks start on Monday
    let days = '';
    for (let i = 0; i < 42; i++) {
      const d = new Date(y, m, 1 - offset + i);
      const ds = ymd(d);
      days += `<button type="button" tabindex="-1" class="cal-d${d.getMonth() !== m ? ' out' : ''}${ds === today ? ' today' : ''}${ds === sel ? ' sel' : ''}${ds === focus ? ' foc' : ''}${d.getDay() % 6 === 0 ? ' we' : ''}" data-d="${ds}">${d.getDate()}</button>`;
    }
    el.innerHTML = `
      <div class="cal-head">
        <button type="button" class="icon-btn sm" data-mv="-12" title="Previous year">${icon('chevsLeft', 15)}</button>
        <button type="button" class="icon-btn sm" data-mv="-1" title="Previous month (PageUp)">${icon('chevLeft', 15)}</button>
        <div class="cal-title">${view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
        <button type="button" class="icon-btn sm" data-mv="1" title="Next month (PageDown)">${icon('chevRight', 15)}</button>
        <button type="button" class="icon-btn sm" data-mv="12" title="Next year">${icon('chevsRight', 15)}</button>
      </div>
      <div class="cal-grid">${['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((w) => `<span class="cal-w">${w}</span>`).join('')}${days}</div>
      <div class="cal-foot">
        <button type="button" class="cal-q" data-q="0">Today</button>
        <button type="button" class="cal-q" data-q="1">Tomorrow</button>
        <button type="button" class="cal-q" data-q="7">+1 week</button>
        <button type="button" class="cal-q" data-q="30">+1 month</button>
        <span class="spacer"></span>
        ${sel ? `<button type="button" class="cal-q clear" data-q="clear">Clear</button>` : ''}
      </div>`;
  };
  const setFocus = (ds) => {
    focus = ds;
    const f = parseYmd(ds);
    if (f.getFullYear() !== view.getFullYear() || f.getMonth() !== view.getMonth()) { view.setFullYear(f.getFullYear(), f.getMonth(), 1); }
    draw();
  };
  const pick = (ds) => { sel = ds; closePop(true); };
  el.addEventListener('click', (e) => {
    const d = e.target.closest('[data-d]');
    if (d) return pick(d.dataset.d);
    const mv = e.target.closest('[data-mv]');
    if (mv) { view.setMonth(view.getMonth() + +mv.dataset.mv); draw(); return; }
    const q = e.target.closest('[data-q]');
    if (q) { if (q.dataset.q === 'clear') { sel = null; closePop(true); } else pick(addDays(today, +q.dataset.q)); }
  });
  el.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (step) { e.preventDefault(); setFocus(addDays(focus, step)); }
    else if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); const f = parseYmd(focus); f.setMonth(f.getMonth() + (e.key === 'PageUp' ? -1 : 1)); setFocus(ymd(f)); }
    else if (e.key === 'Home') { e.preventDefault(); setFocus(today); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(focus); }
    else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); sel = null; closePop(true); }
  });
  draw();
  openPop(anchor, el, { onClose: (ok) => (ok ? commit(sel || undefined) : false) });
  el.focus({ preventScroll: true });
}

function progressEditor(anchor, v, commit) {
  let p = 0;
  const el = h(`<div class="prog-ed">
    <div class="prog-ed-top"><input type="range" min="0" max="100" step="5" class="pe-range"><input type="number" min="0" max="100" class="inp sm pe-num"><span class="muted">%</span></div>
    <div class="prog-quick">${[0, 25, 50, 75, 100].map((n) => `<button type="button" class="cal-q" data-p="${n}">${n}%</button>`).join('')}<span class="spacer"></span>${v != null ? '<button type="button" class="cal-q clear" data-p="clear">Clear</button>' : ''}</div>
  </div>`);
  const range = $('.pe-range', el), num = $('.pe-num', el);
  let cleared = false;
  const sync = (x) => { p = Math.max(0, Math.min(100, Math.round(+x || 0))); range.value = p; num.value = p; range.style.setProperty('--p', p + '%'); };
  sync(v ?? 0);
  range.addEventListener('input', () => sync(range.value));
  num.addEventListener('input', () => { if (num.value !== '') { const n = Math.max(0, Math.min(100, Math.round(+num.value))); p = n; range.value = n; range.style.setProperty('--p', n + '%'); } });
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    if (b.dataset.p === 'clear') cleared = true; else sync(b.dataset.p);
    closePop(true);
  });
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); closePop(true); } });
  openPop(anchor, el, { minWidth: 280, onClose: (ok) => (ok ? commit(cleared ? undefined : p) : false) });
  num.focus({ preventScroll: true });
  num.select();
}

function selectEditor(anchor, b, col, v, commit, multi) {
  let sel = multi ? new Set(v || []) : v;
  let q = '';
  let active = 0;
  let structChanged = false;
  const el = h(`<div class="sel-ed">
    <div class="sel-top">${multi ? '<span class="sel-chips" style="display:contents"></span>' : ''}<input class="sel-q" placeholder="${col.options.length ? 'Search or create…' : 'Type to create an option…'}"></div>
    <div class="sel-list"></div>
    <div class="sel-foot"><button type="button" class="lnk-btn" data-edit>${icon('edit', 13)} Edit options & colors</button></div>
  </div>`);
  const list = $('.sel-list', el);
  const inp = $('.sel-q', el);
  const items = () => {
    const ql = q.trim().toLowerCase();
    const arr = col.options.filter((o) => o.label.toLowerCase().includes(ql)).map((o) => ({ o }));
    if (ql && !col.options.some((o) => o.label.toLowerCase() === ql)) arr.push({ create: q.trim() });
    return arr;
  };
  const isOn = (id) => (multi ? sel.has(id) : sel === id);
  const draw = () => {
    const it = items();
    active = Math.min(active, Math.max(0, it.length - 1));
    if (multi) $('.sel-chips', el).innerHTML = col.options.filter((o) => sel.has(o.id)).map((o) => chipHtml(o, true)).join('');
    list.innerHTML = it.map((x, i) => x.create
      ? `<button type="button" class="sel-item create ${i === active ? 'act' : ''}" data-i="${i}">${icon('plus', 14)} Create <span class="chip c-${nextColor(col)}"><i class="dot"></i><span>${esc(x.create)}</span></span></button>`
      : `<button type="button" class="sel-item ${i === active ? 'act' : ''} ${isOn(x.o.id) ? 'on' : ''}" data-i="${i}">${chipHtml(x.o)}<span class="tick">${icon('tick', 15)}</span></button>`).join('')
      || `<div class="sel-empty">No options yet — type to create one</div>`;
    if (!multi && sel && !q) list.insertAdjacentHTML('beforeend', `<button type="button" class="sel-item clear" data-clear>${icon('x', 13)} Clear</button>`);
  };
  const pick = (i) => {
    const x = items()[i];
    if (!x) return;
    let id;
    if (x.create) {
      const o = { id: uid(), label: x.create, color: nextColor(col) };
      col.options.push(o);
      structChanged = true;
      save();
      id = o.id;
      q = ''; inp.value = '';
    } else id = x.o.id;
    if (multi) { sel.has(id) ? sel.delete(id) : sel.add(id); q = ''; inp.value = ''; draw(); inp.focus(); }
    else { sel = id; closePop(true); }
  };
  el.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-rm]');
    if (rm) { sel.delete(rm.dataset.rm); draw(); inp.focus(); return; }
    if (e.target.closest('[data-clear]')) { sel = undefined; closePop(true); return; }
    if (e.target.closest('[data-edit]')) { closePop(true); columnModal(b, col); return; }
    const it = e.target.closest('[data-i]');
    if (it) pick(+it.dataset.i);
  });
  inp.addEventListener('input', () => { q = inp.value; active = 0; draw(); });
  inp.addEventListener('keydown', (e) => {
    const n = items().length;
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % Math.max(1, n); draw(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + n) % Math.max(1, n); draw(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (n) pick(active); else if (multi) closePop(true); }
    else if (e.key === 'Backspace' && multi && !inp.value && sel.size) { sel.delete([...sel].pop()); draw(); }
  });
  draw();
  openPop(anchor, el, {
    minWidth: Math.max(anchor.offsetWidth, 270),
    escCommits: multi,
    onClose: (ok) => {
      if (!ok) return structChanged;
      const changed = commit(multi ? col.options.filter((o) => sel.has(o.id)).map((o) => o.id) : sel);
      return changed || structChanged;
    },
  });
  inp.focus({ preventScroll: true });
}

function peopleEditor(anchor, v, commit) {
  const names = [...(v || [])];
  let active = -1;
  const el = h(`<div class="ppl-ed">
    <div class="ppl-box"><input class="ppl-in" placeholder="Type a name and press Enter…"></div>
    <div class="sel-list ppl-sugg"></div>
    <div class="ed-hint"><span>Enter or comma to add</span><span>Backspace removes last</span></div>
  </div>`);
  const box = $('.ppl-box', el), inp = $('.ppl-in', el), sug = $('.ppl-sugg', el);
  const add = (n) => {
    n = (n || '').trim().replace(/\s+/g, ' ');
    if (n && !names.some((x) => x.toLowerCase() === n.toLowerCase())) names.push(n);
  };
  let sugList = [];
  const draw = () => {
    $$('.person', box).forEach((x) => x.remove());
    inp.insertAdjacentHTML('beforebegin', names.map((n, i) => personHtml(n, i)).join(''));
    const ql = inp.value.trim().toLowerCase();
    sugList = allPeople().filter((n) => !names.some((x) => x.toLowerCase() === n.toLowerCase()) && (!ql || n.toLowerCase().includes(ql))).slice(0, 8);
    if (active >= sugList.length) active = sugList.length - 1;
    sug.innerHTML = sugList.length ? `<div class="sel-label">${ql ? 'Matches' : 'Suggestions'}</div>` + sugList.map((n, i) => `<button type="button" class="sel-item ${i === active ? 'act' : ''}" data-s="${i}">${personHtml(n)}</button>`).join('') : '';
    sug.style.display = sugList.length ? '' : 'none';
  };
  el.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-rm]');
    if (rm) { names.splice(+rm.dataset.rm, 1); draw(); inp.focus(); return; }
    const s = e.target.closest('[data-s]');
    if (s) { add(sugList[+s.dataset.s]); inp.value = ''; active = -1; draw(); inp.focus(); return; }
    if (e.target.closest('.ppl-box')) inp.focus();
  });
  inp.addEventListener('input', () => {
    if (/[,;]/.test(inp.value)) {
      const parts = inp.value.split(/[,;]/);
      inp.value = parts.pop();
      parts.forEach(add);
    }
    active = -1;
    draw();
  });
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && sugList[active]) add(sugList[active]);
      else if (inp.value.trim()) add(inp.value);
      else { closePop(true); return; }
      inp.value = ''; active = -1; draw();
    } else if (e.key === 'Backspace' && !inp.value && names.length) { names.pop(); draw(); }
    else if (e.key === 'ArrowDown' && sugList.length) { e.preventDefault(); active = (active + 1) % sugList.length; draw(); }
    else if (e.key === 'ArrowUp' && sugList.length) { e.preventDefault(); active = active <= 0 ? sugList.length - 1 : active - 1; draw(); }
  });
  draw();
  openPop(anchor, el, {
    minWidth: Math.max(anchor.offsetWidth, 320),
    escCommits: true,
    onClose: (ok) => { if (!ok) return false; add(inp.value); return commit(names); },
  });
  inp.focus({ preventScroll: true });
}

function linksEditor(anchor, v, commit) {
  const el = h(`<div class="lnk-ed">
    <div class="lnk-head"><span>Label</span><span>URL</span><span></span></div>
    <div class="lnk-rows"></div>
    <button type="button" class="lnk-btn" data-add>${icon('plus', 13)} Add another link</button>
    <div class="lnk-foot"><span class="hint">Enter to save · label is optional</span><button type="button" class="btn sm" data-cancel>Cancel</button><button type="button" class="btn sm primary" data-save>Save</button></div>
  </div>`);
  const rows = $('.lnk-rows', el);
  const addRow = (l = { label: '', url: '' }) => {
    rows.insertAdjacentHTML('beforeend', `<div class="lnk-row"><input class="inp sm lr-label" placeholder="CP-1234" value="${esc(l.label)}"><input class="inp sm lr-url" placeholder="https://…" value="${esc(l.url)}"><button type="button" class="icon-btn sm" data-rm title="Remove">${icon('x', 14)}</button></div>`);
  };
  (v && v.length ? v : [{ label: '', url: '' }]).forEach(addRow);
  el.addEventListener('click', (e) => {
    if (e.target.closest('[data-rm]')) { e.target.closest('.lnk-row').remove(); if (!rows.children.length) addRow(); return; }
    if (e.target.closest('[data-add]')) { addRow(); $('.lnk-row:last-child .lr-label', rows).focus(); return; }
    if (e.target.closest('[data-save]')) { closePop(true); return; }
    if (e.target.closest('[data-cancel]')) closePop(false);
  });
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); closePop(true); } });
  openPop(anchor, el, {
    minWidth: 470,
    onClose: (ok) => {
      if (!ok) return false;
      const links = $$('.lnk-row', rows).map((r) => {
        let label = $('.lr-label', r).value.trim();
        let url = $('.lr-url', r).value.trim();
        if (!url && isUrlish(label)) { url = label; label = ''; }
        url = normUrl(url);
        if (!label && url) label = deriveLabel(url);
        return { label, url };
      }).filter((l) => l.label || l.url);
      return commit(links);
    },
  });
  const firstEmpty = $$('input', rows).find((i) => !i.value) || $('input', rows);
  firstEmpty.focus({ preventScroll: true });
}

/* =========================================================
   Modals
   ========================================================= */
let modalEl = null;
function modal({ title, body, actions, size }) {
  closeModal();
  const bd = h(`<div class="modal-backdrop"><div class="modal ${size || ''}" role="dialog" aria-modal="true"><div class="m-head"><h3>${esc(title)}</h3><button class="icon-btn" data-close title="Close">${icon('x', 17)}</button></div><div class="m-body"></div><div class="m-foot"></div></div></div>`);
  const mb = $('.m-body', bd);
  typeof body === 'string' ? (mb.innerHTML = body) : mb.append(body);
  const foot = $('.m-foot', bd);
  for (const a of actions.filter(Boolean)) {
    const btn = h(`<button class="btn ${a.primary ? 'primary' : ''} ${a.danger ? 'danger' : ''} ${a.solidDanger ? 'danger solid' : ''} ${a.left ? 'left' : ''}" ${a.primary || a.solidDanger ? 'data-primary' : ''}>${esc(a.label)}</button>`);
    btn.onclick = async () => {
      if (a.fn) { const r = await a.fn(); if (r === false) return; }
      if (modalEl === bd) closeModal();
    };
    foot.append(btn);
  }
  bd.addEventListener('mousedown', (e) => { if (e.target === bd) closeModal(); });
  $('[data-close]', bd).onclick = () => closeModal();
  bd.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox' && e.target.type !== 'radio') {
      e.preventDefault();
      $('[data-primary]', bd)?.click();
    }
  });
  document.body.append(bd);
  modalEl = bd;
  requestAnimationFrame(() => bd.classList.add('show'));
  setTimeout(() => { const f = $('input:not([type=radio]):not([type=checkbox]), textarea', bd) || $('[data-primary]', bd); f && f.focus(); }, 30);
  return bd;
}
function closeModal() {
  if (!modalEl) return;
  const m = modalEl;
  modalEl = null;
  m._onClose && m._onClose();
  m.remove();
  setTimeout(flushRemote, 0);
}

function confirmDialog(title, message, okLabel = 'Delete') {
  return new Promise((resolve) => {
    let done = false;
    const m = modal({
      title, size: 'sm', body: `<p>${message}</p>`,
      actions: [{ label: 'Cancel' }, { label: okLabel, solidDanger: true, fn: () => { done = true; resolve(true); } }],
    });
    m._onClose = () => { if (!done) resolve(false); };
  });
}

/* ---------- Column modal ---------- */
function columnModal(b, col, insertAt) {
  const isNew = !col;
  const d = isNew ? { id: uid(), name: '', type: 'text', options: [] } : clone(col);
  if (!d.options) d.options = [];
  let paletteFor = -1;
  const body = h(`<div>
    <label class="field"><span>Column name</span><input class="inp" id="cf-name" placeholder="e.g. Owner, Region, Release" value="${esc(d.name)}"></label>
    <div class="field"><span>Type</span><div class="type-grid">${Object.entries(TYPES).map(([k, t]) => `<button type="button" class="type-card" data-type="${k}">${icon(t.icon, 17)}<b>${t.label}</b><small>${t.desc}</small></button>`).join('')}</div></div>
    <div class="field opts-field"><span>Dropdown options</span><div class="opts-list"></div><div><button type="button" class="lnk-btn" data-add-opt>${icon('plus', 13)} Add option</button></div></div>
    ${!isNew ? '<p class="muted" id="cf-conv" style="font-size:12.5px;display:none">Existing values will be converted to the new type where possible.</p>' : ''}
  </div>`);
  const draw = () => {
    $$('.type-card', body).forEach((x) => x.classList.toggle('on', x.dataset.type === d.type));
    const isSel = d.type === 'select' || d.type === 'multiselect';
    $('.opts-field', body).style.display = isSel ? '' : 'none';
    const conv = $('#cf-conv', body);
    if (conv) {
      conv.style.display = d.type !== col.type ? '' : 'none';
      conv.textContent = AUTO[d.type]
        ? 'This column will show each row\'s timestamp automatically; values typed in it so far will be removed.'
        : 'Existing values will be converted to the new type where possible.';
    }
    $('.opts-list', body).innerHTML = d.options.map((o, i) => `
      <div class="opt-row" data-i="${i}">
        <button type="button" class="swatch c-${o.color}" data-sw title="Change color"></button>
        <input class="inp sm" data-lbl value="${esc(o.label)}" placeholder="Option name">
        <button type="button" class="icon-btn sm" data-up ${i ? '' : 'disabled'} title="Move up">${icon('arrowUp', 14)}</button>
        <button type="button" class="icon-btn sm" data-down ${i < d.options.length - 1 ? '' : 'disabled'} title="Move down">${icon('arrowDown', 14)}</button>
        <button type="button" class="icon-btn sm danger-hover" data-del title="Remove option">${icon('trash', 14)}</button>
      </div>
      ${paletteFor === i ? `<div class="palette" data-i="${i}">${COLORS.map((c) => `<button type="button" class="pal c-${c} ${o.color === c ? 'on' : ''}" data-c="${c}" title="${c}"></button>`).join('')}</div>` : ''}`).join('')
      || '<div class="muted" style="font-size:12.5px">No options yet. You can also create them while editing a cell.</div>';
  };
  body.addEventListener('input', (e) => {
    if (e.target.matches('[data-lbl]')) d.options[+e.target.closest('[data-i]').dataset.i].label = e.target.value;
  });
  body.addEventListener('click', (e) => {
    const tc = e.target.closest('.type-card');
    if (tc) {
      d.type = tc.dataset.type;
      if ((d.type === 'select' || d.type === 'multiselect') && !d.options.length && isNew) {
        d.options.push({ id: uid(), label: '', color: 'blue' });
        draw();
        $('[data-lbl]', body)?.focus();
        return;
      }
      draw();
      return;
    }
    if (e.target.closest('[data-add-opt]')) {
      d.options.push({ id: uid(), label: '', color: nextColor(d) });
      draw();
      $$('[data-lbl]', body).pop()?.focus();
      return;
    }
    const rowEl = e.target.closest('[data-i]');
    if (!rowEl) return;
    const i = +rowEl.dataset.i;
    if (e.target.closest('[data-sw]')) { paletteFor = paletteFor === i ? -1 : i; draw(); }
    else if (e.target.closest('[data-c]')) { d.options[i].color = e.target.closest('[data-c]').dataset.c; paletteFor = -1; draw(); }
    else if (e.target.closest('[data-up]')) { [d.options[i - 1], d.options[i]] = [d.options[i], d.options[i - 1]]; paletteFor = -1; draw(); }
    else if (e.target.closest('[data-down]')) { [d.options[i + 1], d.options[i]] = [d.options[i], d.options[i + 1]]; paletteFor = -1; draw(); }
    else if (e.target.closest('[data-del]')) { d.options.splice(i, 1); paletteFor = -1; draw(); }
  });
  draw();

  const saveCol = () => {
    d.name = $('#cf-name', body).value.trim() || 'Untitled';
    d.options = d.options.filter((o) => o.label.trim()).map((o) => ({ ...o, label: o.label.trim() }));
    if (isNew) {
      d.width = DEFAULT_WIDTH[d.type] || 180;
      if (d.type !== 'select' && d.type !== 'multiselect') delete d.options;
      b.columns.splice(insertAt ?? b.columns.length, 0, d);
    } else {
      const idx = b.columns.indexOf(col);
      if (idx < 0) return;
      const optIds = new Set(d.options.map((o) => o.id));
      for (const r of b.rows) {
        if (AUTO[d.type]) { delete r.cells[col.id]; continue; }
        const v = AUTO[col.type] ? val(col, r) : r.cells[col.id];
        if (v == null) continue;
        let nv = v;
        if (col.type !== d.type) nv = convertValue(col, d, v);
        else if (d.type === 'select') nv = optIds.has(v) ? v : undefined;
        else if (d.type === 'multiselect') nv = v.filter((id) => optIds.has(id));
        if (isEmpty(d, nv)) delete r.cells[col.id]; else r.cells[col.id] = nv;
      }
      b.columns[idx] = d;
      const f = ui.filters[b.id];
      if (f && f[d.id]) {
        if (d.type === 'select' || d.type === 'multiselect') f[d.id] = f[d.id].filter((id) => id === '__empty' || optIds.has(id));
        else delete f[d.id];
        if (f[d.id] && !f[d.id].length) delete f[d.id];
        saveUi();
      }
    }
    save();
    render();
  };

  modal({
    title: isNew ? 'Add column' : 'Edit column',
    body,
    actions: [
      !isNew && b.columns.length > 1 && { label: 'Delete column', danger: true, left: true, fn: () => { deleteCol(b, col); } },
      { label: 'Cancel' },
      { label: isNew ? 'Add column' : 'Save changes', primary: true, fn: saveCol },
    ],
  });
}

function ensureOpt(col, label) {
  const o = col.options.find((x) => x.label.toLowerCase() === label.toLowerCase());
  if (o) return o.id;
  const n = { id: uid(), label, color: nextColor(col) };
  col.options.push(n);
  return n.id;
}

function convertValue(a, to, v) {
  if (AUTO[a.type]) {
    if (to.type === 'date') return ymd(new Date(v));
    if (to.type === 'number') return v;
  }
  let list;
  if (a.type === 'people') list = v;
  else if (a.type === 'multiselect') list = (v || []).map((id) => optOf(a, id)?.label).filter(Boolean);
  else if (a.type === 'links') list = (v || []).map((l) => (to.type === 'text' || to.type === 'longtext') && l.url ? `${l.label} (${l.url})` : l.label || l.url);
  else {
    const s = cellText(a, v);
    list = s ? (to.type === 'people' || to.type === 'multiselect' ? s.split(/[,;]\s*/) : [s]) : [];
  }
  list = list.map((s) => String(s).trim()).filter(Boolean);
  const text = list.join(', ');
  switch (to.type) {
    case 'text': case 'longtext': return text || undefined;
    case 'number': { const n = parseFloat(text.replace(/[^\d.-]/g, '')); return Number.isFinite(n) ? n : undefined; }
    case 'date': {
      if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
      const dt = new Date(text);
      return text && !isNaN(dt) ? ymd(dt) : undefined;
    }
    case 'email': case 'phone': return text || undefined;
    case 'progress': { const n = parseFloat(text.replace(/[^\d.-]/g, '')); return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : undefined; }
    case 'rating': {
      const stars = (text.match(/★/g) || []).length;
      const n = stars || parseFloat(text);
      return Number.isFinite(n) && n >= 1 ? Math.min(5, Math.round(n)) : undefined;
    }
    case 'created': case 'updated': return undefined;
    case 'checkbox': return (!!text && !/^(no|false|0)$/i.test(text)) || undefined;
    case 'people': return list.length ? list : undefined;
    case 'links':
      if (a.type === 'links') return v;
      return list.length ? list.map((s) => (isUrlish(s) ? { label: deriveLabel(normUrl(s)), url: normUrl(s) } : { label: s, url: '' })) : undefined;
    case 'select': return list.length ? ensureOpt(to, list[0]) : undefined;
    case 'multiselect': return list.length ? [...new Set(list.map((s) => ensureOpt(to, s)))] : undefined;
  }
  return undefined;
}

async function deleteCol(b, col) {
  const used = b.rows.filter((r) => !isEmpty(col, r.cells[col.id])).length;
  const ok = await confirmDialog('Delete column?', `“<b>${esc(col.name)}</b>” will be removed${used ? ` along with its values in ${used} row${used > 1 ? 's' : ''}` : ''}. This can't be undone.`, 'Delete column');
  if (!ok) return;
  b.columns = b.columns.filter((c) => c !== col);
  for (const r of b.rows) delete r.cells[col.id];
  if (ui.sorts[b.id]?.col === col.id) delete ui.sorts[b.id];
  if (ui.filters[b.id]) delete ui.filters[b.id][col.id];
  saveUi();
  save();
  render();
}

function moveCol(b, i, dir) {
  const j = i + dir;
  if (j < 0 || j >= b.columns.length) return;
  [b.columns[i], b.columns[j]] = [b.columns[j], b.columns[i]];
  save();
  render();
}

/* ---------- Board / section modals ---------- */
function paletteHtml(sel) {
  return `<div class="palette" style="padding:2px 0" id="color-pal">${COLORS.map((c) => `<button type="button" class="pal c-${c} ${sel === c ? 'on' : ''}" data-c="${c}" title="${c}"></button>`).join('')}</div>`;
}
function bindPalette(body, d) {
  $('#color-pal', body).addEventListener('click', (e) => {
    const p = e.target.closest('[data-c]');
    if (!p) return;
    d.color = p.dataset.c;
    $$('.pal', body).forEach((x) => x.classList.toggle('on', x === p));
  });
}

function boardModal(b, sectionId) {
  const isNew = !b;
  const secId = isNew ? sectionId || db.sections[0]?.id : b.sectionId;
  const d = { color: isNew ? COLORS.filter((c) => c !== 'gray')[db.boards.length % 8] : b.color };
  const sibling = isNew && (boardsOf(secId)[0] || null);
  const boardOptions = db.sections.map((s) => {
    const bs = boardsOf(s.id);
    return bs.length ? `<optgroup label="${esc(s.name)}">${bs.map((x) => `<option value="${x.id}" ${sibling && x.id === sibling.id ? 'selected' : ''}>${esc(x.name)} (${x.columns.length} columns)</option>`).join('')}</optgroup>` : '';
  }).join('');
  const body = h(`<div>
    <label class="field"><span>Category name</span><input class="inp" id="bf-name" placeholder="e.g. Backend, Mobile app, Q4 release" value="${isNew ? '' : esc(b.name)}"></label>
    <label class="field"><span>Section</span><select class="inp" id="bf-sec">${db.sections.map((s) => `<option value="${s.id}" ${s.id === secId ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label>
    <div class="field"><span>Color</span>${paletteHtml(d.color)}</div>
    ${isNew ? `<div class="field"><span>Start with</span><div class="seg-choice">
      ${db.boards.length ? `<label class="choice"><input type="radio" name="tpl" value="copy" ${sibling ? 'checked' : ''}><div style="flex:1"><b>Same columns as an existing category</b><small>Copies column setup & dropdown options, not rows</small><select class="inp sm" id="bf-copy">${boardOptions}</select></div></label>` : ''}
      <label class="choice"><input type="radio" name="tpl" value="basic" ${sibling ? '' : 'checked'}><div><b>Starter columns</b><small>Title · Status · Priority · Owner · Link · Notes</small></div></label>
      <label class="choice"><input type="radio" name="tpl" value="blank"><div><b>Blank</b><small>Just a name column — build your own</small></div></label>
    </div></div>` : ''}
  </div>`);
  bindPalette(body, d);
  $('#bf-copy', body)?.addEventListener('focus', () => { $('input[value=copy]', body).checked = true; });

  modal({
    title: isNew ? 'New category' : 'Category settings',
    body,
    actions: [
      { label: 'Cancel' },
      {
        label: isNew ? 'Create category' : 'Save', primary: true,
        fn: () => {
          const name = $('#bf-name', body).value.trim();
          if (!name) { $('#bf-name', body).focus(); return false; }
          const sec = $('#bf-sec', body).value;
          if (!isNew) { Object.assign(b, { name, color: d.color, sectionId: sec }); save(); render(); return; }
          const tpl = $('input[name=tpl]:checked', body).value;
          let columns;
          if (tpl === 'copy') columns = cloneColumns(board($('#bf-copy', body).value).columns);
          else if (tpl === 'basic') columns = basicColumns();
          else columns = [{ id: uid(), name: 'Name', type: 'text', width: 240 }];
          const nb = { id: uid(), sectionId: sec, name, color: d.color, columns, rows: [] };
          db.boards.push(nb);
          ui.collapsed[sec] = false;
          save();
          go(nb.id);
        },
      },
    ],
  });
}

function cloneColumns(cols) {
  return cols.map((c) => ({ ...clone(c), id: uid(), ...(c.options ? { options: c.options.map((o) => ({ ...o, id: uid() })) } : {}) }));
}

function sectionModal(s) {
  const isNew = !s;
  const d = { icon: s?.icon || 'folder' };
  const body = h(`<div>
    <label class="field"><span>Section name</span><input class="inp" id="sf-name" placeholder="e.g. Support, Releases, Partners" value="${esc(s?.name || '')}"></label>
    <div class="field"><span>Icon</span><div class="icon-row">${SECTION_ICONS.map((n) => `<button type="button" class="icon-pick ${d.icon === n ? 'on' : ''}" data-ic="${n}">${icon(n, 18)}</button>`).join('')}</div></div>
  </div>`);
  body.addEventListener('click', (e) => {
    const p = e.target.closest('[data-ic]');
    if (!p) return;
    d.icon = p.dataset.ic;
    $$('.icon-pick', body).forEach((x) => x.classList.toggle('on', x === p));
  });
  modal({
    title: isNew ? 'New section' : 'Edit section', body, size: 'sm',
    actions: [
      { label: 'Cancel' },
      {
        label: isNew ? 'Create section' : 'Save', primary: true,
        fn: () => {
          const name = $('#sf-name', body).value.trim();
          if (!name) { $('#sf-name', body).focus(); return false; }
          if (isNew) {
            const ns = { id: uid(), name, icon: d.icon };
            db.sections.push(ns);
            save(); render();
            setTimeout(() => boardModal(null, ns.id), 60);
          } else { Object.assign(s, { name, icon: d.icon }); save(); render(); }
        },
      },
    ],
  });
}

/* =========================================================
   Actions
   ========================================================= */
function go(view) {
  closePop(false);
  ui.view = view;
  ui.search = '';
  ui.drawer = null;
  ui.pinRow = null;
  saveUi();
  document.body.classList.remove('side-open');
  render();
}

function newRow(b, where) {
  const r = { id: uid(), createdAt: Date.now(), updatedAt: Date.now(), cells: {} };
  for (const [cid, ids] of Object.entries(ui.filters[b.id] || {})) {
    const c = b.columns.find((x) => x.id === cid);
    if (c && ids.length === 1 && ids[0] !== '__empty') r.cells[cid] = c.type === 'multiselect' ? [ids[0]] : ids[0];
  }
  where === 'top' ? b.rows.unshift(r) : b.rows.push(r);
  ui.pinRow = r.id;
  save();
  if (where === 'top') {
    ui.drawer = { b: b.id, r: r.id };
    render();
    setTimeout(() => { const f = $(`#drawer .cell[data-col="${b.columns[0].id}"]`); f && editCell(f); }, 230);
  } else {
    render();
    const td = rowEl(b, r.id)?.querySelector('td.cell');
    if (td) { td.scrollIntoView({ block: 'nearest' }); requestAnimationFrame(() => editCell(td)); }
  }
}

function deleteRow(b, rowId) {
  const i = b.rows.findIndex((r) => r.id === rowId);
  if (i < 0) return;
  const [r] = b.rows.splice(i, 1);
  if (ui.drawer?.r === rowId) ui.drawer = null;
  save();
  render();
  const bId = b.id;
  toast('Row deleted', { label: 'Undo', fn: () => {
    const bb = board(bId);
    if (!bb || bb.rows.some((x) => x.id === r.id)) return;
    bb.rows.splice(Math.min(i, bb.rows.length), 0, r);
    save(); render();
  } });
}

function dupRow(b, rowId) {
  const i = b.rows.findIndex((r) => r.id === rowId);
  if (i < 0) return;
  const r = { ...clone(b.rows[i]), id: uid(), createdAt: Date.now(), updatedAt: Date.now() };
  b.rows.splice(i + 1, 0, r);
  ui.drawer = { b: b.id, r: r.id };
  ui.pinRow = r.id;
  save();
  render();
  toast('Row duplicated');
}

function setSort(b, colId, dir) {
  if (!colId) delete ui.sorts[b.id]; else ui.sorts[b.id] = { col: colId, dir };
  saveUi();
  renderMain();
}

function colMenu(anchor, b, col) {
  const i = b.columns.indexOf(col);
  const s = ui.sorts[b.id];
  const sorted = s && s.col === col.id;
  menu(anchor, [
    { icon: 'edit', label: 'Edit column…', fn: () => columnModal(b, col) },
    { sep: true },
    { icon: 'arrowUp', label: 'Sort ascending', on: sorted && s.dir > 0, fn: () => setSort(b, col.id, 1) },
    { icon: 'arrowDown', label: 'Sort descending', on: sorted && s.dir < 0, fn: () => setSort(b, col.id, -1) },
    sorted && { icon: 'x', label: 'Clear sort', fn: () => setSort(b, null) },
    { sep: true },
    { icon: 'arrowLeft', label: 'Move left', disabled: i === 0, fn: () => moveCol(b, i, -1) },
    { icon: 'arrowRight', label: 'Move right', disabled: i === b.columns.length - 1, fn: () => moveCol(b, i, 1) },
    { icon: 'plus', label: 'Insert column left', fn: () => columnModal(b, null, i) },
    { icon: 'plus', label: 'Insert column right', fn: () => columnModal(b, null, i + 1) },
    { sep: true },
    { icon: 'trash', label: 'Delete column', danger: true, disabled: b.columns.length <= 1, fn: () => deleteCol(b, col) },
  ]);
}

function boardMenu(anchor, b) {
  menu(anchor, [
    { icon: 'edit', label: 'Rename, color & section…', fn: () => boardModal(b) },
    { icon: 'plus', label: 'Add column', fn: () => columnModal(b, null, b.columns.length) },
    { icon: 'copy', label: 'Duplicate columns as new category', fn: () => {
      const nb = { id: uid(), sectionId: b.sectionId, name: `${b.name} copy`, color: b.color, columns: cloneColumns(b.columns), rows: [] };
      db.boards.splice(db.boards.indexOf(b) + 1, 0, nb);
      save(); go(nb.id); toast('Category duplicated (columns only)');
    } },
    { icon: 'download', label: 'Export visible rows as CSV', fn: () => exportCsv(b) },
    { sep: true },
    { icon: 'trash', label: 'Delete category', danger: true, fn: async () => {
      if (!(await confirmDialog('Delete category?', `“<b>${esc(b.name)}</b>” and its ${b.rows.length} row${b.rows.length === 1 ? '' : 's'} will be permanently removed.`, 'Delete category'))) return;
      db.boards = db.boards.filter((x) => x !== b);
      delete ui.sorts[b.id]; delete ui.filters[b.id];
      save(); go('overview');
    } },
  ], { alignRight: true });
}

function sectionMenu(anchor, s) {
  const i = db.sections.indexOf(s);
  menu(anchor, [
    { icon: 'plus', label: 'Add category', fn: () => boardModal(null, s.id) },
    { icon: 'edit', label: 'Rename / icon…', fn: () => sectionModal(s) },
    { icon: 'arrowUp', label: 'Move up', disabled: i === 0, fn: () => { [db.sections[i - 1], db.sections[i]] = [db.sections[i], db.sections[i - 1]]; save(); render(); } },
    { icon: 'arrowDown', label: 'Move down', disabled: i === db.sections.length - 1, fn: () => { [db.sections[i + 1], db.sections[i]] = [db.sections[i], db.sections[i + 1]]; save(); render(); } },
    { sep: true },
    { icon: 'trash', label: 'Delete section', danger: true, disabled: db.sections.length <= 1, fn: async () => {
      const bs = boardsOf(s.id);
      const rows = bs.reduce((a, b) => a + b.rows.length, 0);
      if (!(await confirmDialog('Delete section?', `“<b>${esc(s.name)}</b>”${bs.length ? ` and its ${bs.length} categor${bs.length === 1 ? 'y' : 'ies'} (${rows} rows)` : ''} will be permanently removed.`, 'Delete section'))) return;
      db.boards = db.boards.filter((b) => b.sectionId !== s.id);
      db.sections = db.sections.filter((x) => x !== s);
      save();
      go(curBoard() ? ui.view : 'overview');
    } },
  ]);
}

function filterMenu(anchor, b) {
  if (recentlyClosed(anchor)) return;
  const cols = b.columns.filter((c) => c.type === 'select' || c.type === 'multiselect');
  const el = h('<div class="menu filter-pop"></div>');
  const draw = () => {
    const f = ui.filters[b.id] || {};
    el.innerHTML = cols.length
      ? cols.map((c) => `<div class="fp-group"><div class="sel-label">${esc(c.name)}</div>${[...c.options, { id: '__empty' }].map((o) => `<label class="fp-item"><input type="checkbox" data-c="${c.id}" data-o="${o.id}" ${(f[c.id] || []).includes(o.id) ? 'checked' : ''}>${o.label ? chipHtml(o) : '<span class="ph">No value</span>'}</label>`).join('')}</div>`).join('')
        + `<div class="menu-sep"></div><button class="menu-item" data-clear ${filterCount(b) ? '' : 'disabled'}>${icon('x', 14)}<span>Clear all filters</span></button>`
      : `<div class="fp-none">Add a <b>Dropdown</b> or <b>Multi-select</b> column to filter this category.</div>`;
  };
  el.addEventListener('change', (e) => {
    toggleFilterRaw(b, e.target.dataset.c, e.target.dataset.o);
    renderBoardBody(b);
    updateFilterBadge(b);
    $('[data-clear]', el)?.toggleAttribute('disabled', !filterCount(b));
  });
  el.addEventListener('click', (e) => {
    if (!e.target.closest('[data-clear]')) return;
    ui.filters[b.id] = {};
    saveUi(); draw(); renderBoardBody(b); updateFilterBadge(b);
  });
  draw();
  openPop(anchor, el, { alignRight: true });
}

function appMenu(anchor) {
  menu(anchor, [
    { note: 'Data is stored in this browser' },
    { icon: 'clock', label: 'Restore a daily snapshot…', fn: snapshotsModal },
    { sep: true },
    { icon: 'download', label: 'Export full backup (JSON)', fn: () => download(`tracker-backup-${todayStr()}.json`, JSON.stringify(db, null, 2), 'application/json') },
    { icon: 'upload', label: 'Import backup (JSON)…', fn: importJson },
  ]);
}

function download(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

function exportCsv(b) {
  const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  const lines = [b.columns.map((c) => q(c.name)).join(',')];
  for (const r of visibleRows(b)) {
    lines.push(b.columns.map((c) => {
      const v = val(c, r);
      if (c.type === 'links') return q((v || []).map((l) => (l.url ? `${l.label} (${l.url})` : l.label)).join(', '));
      return q(cellText(c, v));
    }).join(','));
  }
  download(`${b.name.replace(/[^\w-]+/g, '_')}.csv`, '﻿' + lines.join('\r\n'), 'text/csv');
}

function importJson() {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'application/json,.json';
  inp.onchange = async () => {
    const f = inp.files[0];
    if (!f) return;
    try {
      const data = parseBackup(await f.text());
      if (!data) throw new Error('not a Tracker backup file');
      if (!(await confirmDialog('Import backup?', `This replaces <b>all</b> current data with ${data.boards.length} categories from “${esc(f.name)}”. Export a backup first if unsure.`, 'Replace data'))) return;
      db = migrate(data);
      save();
      go('overview');
      toast(`Backup imported — ${data.boards.length} categories, ${rowCount(db)} rows`);
    } catch (err) {
      toast('Import failed: ' + err.message);
    }
  };
  inp.click();
}

function stepOverview(d) {
  const all = db.sections.flatMap((s) => boardsOf(s.id));
  if (!all.length) return;
  const i = all.findIndex((x) => x.id === ovBoard()?.id);
  ui.ovBoard = all[(i + d + all.length) % all.length].id;
  saveUi();
  renderMain();
  scrollTabIntoView();
}
function scrollTabIntoView() {
  const t = $('.ovb-tab.on');
  const strip = $('.ovb-tabs');
  if (!t || !strip) return;
  const tr = t.getBoundingClientRect(), sr = strip.getBoundingClientRect();
  if (tr.left < sr.left || tr.right > sr.right) strip.scrollLeft += tr.left - sr.left - (sr.width - tr.width) / 2;
}

function toast(msg, action) {
  const t = h(`<div class="toast"><span>${esc(msg)}</span>${action ? `<button>${esc(action.label)}</button>` : ''}</div>`);
  $('#toasts').append(t);
  if (action) $('button', t).onclick = () => { action.fn(); t.remove(); };
  const life = action ? 6000 : 2600;
  setTimeout(() => t.classList.add('out'), life);
  setTimeout(() => t.remove(), life + 350);
}

const ACCENTS = [
  { k: 'indigo', label: 'Indigo', sw: '#6366f1' },
  { k: 'blue', label: 'Blue', sw: '#3b82f6' },
  { k: 'teal', label: 'Teal', sw: '#14b8a6' },
  { k: 'green', label: 'Green', sw: '#22c55e' },
  { k: 'orange', label: 'Orange', sw: '#f97316' },
  { k: 'rose', label: 'Rose', sw: '#f43f5e' },
];
function applyTheme() {
  const t = ui.theme || 'system';
  const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.accent = ACCENTS.some((a) => a.k === ui.accent) ? ui.accent : 'indigo';
}
const firstName = () => (ui.name || '').trim().split(/\s+/)[0] || '';

/* =========================================================
   Global events
   ========================================================= */
let lastResize = 0;

function act(name, el, e) {
  const b = ctxBoard(el);
  switch (name) {
    case 'toggle-side': document.body.classList.toggle('side-open'); break;
    case 'sec-toggle': ui.collapsed[el.dataset.sec] = !ui.collapsed[el.dataset.sec]; saveUi(); renderSidebar(); break;
    case 'add-board': boardModal(null, el.dataset.sec); break;
    case 'add-section': sectionModal(null); break;
    case 'sec-menu': sectionMenu(el, section(el.dataset.sec)); break;
    case 'theme': ui.theme = el.dataset.t; saveUi(); applyTheme(); renderSidebar(); break;
    case 'app-menu': appMenu(el); break;
    case 'profile': menu(el, [
      { note: ui.name ? `Hi ${firstName()}!` : 'Make Tracker yours' },
      { icon: 'edit', label: 'Name, theme & colour…', fn: () => onboardingModal(true) },
      { icon: 'star', label: 'Take the dashboard tour', fn: startTour },
    ]); break;
    case 'rename-board': boardModal(b); break;
    case 'filter': filterMenu(el, b); break;
    case 'board-menu': if (!recentlyClosed(el)) boardMenu(el, b); break;
    case 'new-row': newRow(b, 'top'); break;
    case 'add-row': newRow(b, 'bottom'); break;
    case 'open-row': ui.drawer = { b: b.id, r: el.closest('[data-row]').dataset.row }; renderDrawer(); break;
    case 'del-row': deleteRow(b, el.closest('[data-row]').dataset.row); break;
    case 'col-menu':
      if (e.target.closest('.resizer') || Date.now() - lastResize < 300) return;
      colMenu(el, b, b.columns.find((c) => c.id === el.dataset.col));
      break;
    case 'add-col': columnModal(b, null, b.columns.length); break;
    case 'add-col-drawer': { const db_ = board(ui.drawer.b); columnModal(db_, null, db_.columns.length); break; }
    case 'sum-filter': toggleFilterRaw(b, el.dataset.col, el.dataset.opt); renderMain(); break;
    case 'clear-filters': e.preventDefault(); ui.filters[b.id] = {}; saveUi(); renderMain(); break;
    case 'goto-row': go(el.dataset.b); ui.drawer = { b: el.dataset.b, r: el.dataset.r }; renderDrawer(); break;
    case 'drawer-close': ui.drawer = null; renderDrawer(); break;
    case 'drawer-del': deleteRow(board(ui.drawer.b), ui.drawer.r); break;
    case 'drawer-dup': dupRow(board(ui.drawer.b), ui.drawer.r); break;
    case 'ovb-pick': ui.ovBoard = el.dataset.b; saveUi(); renderMain(); scrollTabIntoView(); break;
    case 'ovb-step': stepOverview(+el.dataset.d); break;
    case 'ovb-clear': e.preventDefault(); delete ui.filters[b.id]; delete ui.sorts[b.id]; saveUi(); renderMain(); break;
  }
}

document.addEventListener('click', (e) => {
  if (!db || e.target.closest('.pop, .modal-backdrop')) return;
  if (e.target.closest('a[href]') && !e.target.closest('[data-act]')) return;
  const a = e.target.closest('[data-act]');
  if (a) { act(a.dataset.act, a, e); return; }
  const nav = e.target.closest('[data-nav]');
  if (nav) { go(nav.dataset.nav); return; }
  const star = e.target.closest('[data-star]');
  if (star && star.closest('.cell')) { rateCell(star.closest('.cell'), +star.dataset.star); return; }
  const cell = e.target.closest('.cell');
  if (cell) editCell(cell);
});

document.addEventListener('keydown', (e) => {
  if (tour) { tourKey(e); return; }
  if (e.key === 'Escape') {
    if (pop) { e.preventDefault(); closePop(pop.escCommits); return; }
    if (modalEl) { closeModal(); return; }
    if (ui.drawer) { ui.drawer = null; renderDrawer(); return; }
    if (document.body.classList.contains('side-open')) { document.body.classList.remove('side-open'); return; }
    if (document.activeElement?.id === 'q' && ui.search) { ui.search = ''; renderMain(); return; }
  }
  if (pop || modalEl) return;
  if (ui.view === 'overview' && !isTyping(e.target) && !e.altKey && !e.target.classList?.contains('cell') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && $('#ov-browse')) {
    e.preventDefault(); stepOverview(e.key === 'ArrowLeft' ? -1 : 1); return;
  }
  if (e.key === '/' && !isTyping(e.target)) { const q = $('#q'); if (q) { e.preventDefault(); q.focus(); q.select(); } }
  if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.target.matches?.('.table-wrap td.cell')) {
    e.preventDefault();
    const b = ctxBoard(e.target);
    const rowId = e.target.closest('[data-row]').dataset.row;
    const colId = e.target.dataset.col;
    if (moveRowBy(b, rowId, e.key === 'ArrowUp' ? -1 : 1)) rowEl(b, rowId)?.querySelector(`td.cell[data-col="${colId}"]`)?.focus();
    return;
  }
  if (e.key === 'Enter') {
    if (e.target.classList?.contains('cell')) { e.preventDefault(); editCell(e.target); }
    else if (e.target.dataset?.nav) { go(e.target.dataset.nav); }
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id !== 'q') return;
  ui.search = e.target.value;
  const b = curBoard();
  if (b) renderBoardBody(b);
});

// Column resize
document.addEventListener('pointerdown', (e) => {
  const rz = e.target.closest('.resizer');
  if (!rz) return;
  e.preventDefault();
  e.stopPropagation();
  const b = ctxBoard(rz);
  const col = b.columns.find((c) => c.id === rz.dataset.resize);
  const colEl = rz.closest('table').querySelector(`col[data-col="${col.id}"]`);
  const table = rz.closest('table');
  const startX = e.clientX;
  const startW = col.width || DEFAULT_WIDTH[col.type] || 180;
  rz.classList.add('active');
  document.body.classList.add('resizing');
  const move = (ev) => {
    col.width = Math.round(Math.max(80, Math.min(900, startW + ev.clientX - startX)));
    colEl.style.width = col.width + 'px';
    table.style.width = `max(${tableWidth(b)}px,100%)`;
  };
  const up = () => {
    window.removeEventListener('pointermove', move);
    rz.classList.remove('active');
    document.body.classList.remove('resizing');
    lastResize = Date.now();
    if (col.width !== startW) save();
    setTimeout(flushRemote, 0);
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up, { once: true });
});

// Row reordering -------------------------------------------------------
// Moves `rowId` so it sits right before `beforeId` (or at the end of the
// visible block when beforeId is null). Works on the full b.rows array, so
// it behaves sensibly while a search or filter hides some rows.
function placeRow(b, rowId, beforeId, afterId) {
  const from = b.rows.findIndex((r) => r.id === rowId);
  if (from < 0) return false;
  const [r] = b.rows.splice(from, 1);
  let to;
  if (beforeId) to = b.rows.findIndex((x) => x.id === beforeId);
  else if (afterId) to = b.rows.findIndex((x) => x.id === afterId) + 1;
  else to = b.rows.length;
  if (to < 0) to = b.rows.length;
  b.rows.splice(to, 0, r);
  if (to === from) return false;
  save();
  return true;
}

function moveRowBy(b, rowId, dir) {
  if (ui.sorts[b.id]) { toast('Clear the sort to reorder rows manually'); return false; }
  const vis = visibleRows(b).map((r) => r.id);
  const i = vis.indexOf(rowId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= vis.length) return false;
  const moved = dir < 0 ? placeRow(b, rowId, vis[j]) : placeRow(b, rowId, null, vis[j]);
  if (moved) refreshBoard(b);
  return moved;
}

document.addEventListener('pointerdown', (e) => {
  const handle = e.target.closest('.drag-h');
  if (!handle || e.button !== 0) return;
  const b = ctxBoard(handle);
  if (!b) return;
  e.preventDefault();
  if (ui.sorts[b.id]) { toast('Clear the sort to reorder rows manually'); return; }
  const wrap = handle.closest('.table-wrap');
  const tr = handle.closest('tr');
  const rowId = tr.dataset.row;
  const startY = e.clientY;
  let started = false, ghost = null, line = null, target = null, lastY = e.clientY, raf = 0;

  const rowsEls = () => $$('tbody tr[data-row]', wrap);
  const start = () => {
    started = true;
    document.body.classList.add('row-dragging');
    tr.classList.add('drag-src');
    line = h('<div class="drop-line"></div>');
    wrap.append(line);
    const first = b.columns[0];
    const dr = b.rows.find((r) => r.id === rowId);
    const title = (dr && cellText(first, val(first, dr))) || 'Untitled';
    ghost = h(`<div class="drag-ghost">${icon('grip', 14)}<span>${esc(title)}</span></div>`);
    document.body.append(ghost);
  };
  const update = () => {
    raf = 0;
    const wr = wrap.getBoundingClientRect();
    // auto-scroll near the edges
    const edge = 48;
    if (lastY < wr.top + edge + 40) wrap.scrollTop -= Math.ceil((wr.top + edge + 40 - lastY) / 4);
    else if (lastY > wr.bottom - edge) wrap.scrollTop += Math.ceil((lastY - (wr.bottom - edge)) / 4);
    const els = rowsEls();
    let idx = els.length;
    for (let i = 0; i < els.length; i++) {
      const r = els[i].getBoundingClientRect();
      if (lastY < r.top + r.height / 2) { idx = i; break; }
    }
    target = idx;
    const ref = els[idx] || els[els.length - 1];
    if (!ref) return;
    const rr = ref.getBoundingClientRect();
    const y = (els[idx] ? rr.top : rr.bottom) - wr.top + wrap.scrollTop;
    line.style.top = (y - 1) + 'px';
    line.style.left = wrap.scrollLeft + 'px';
    line.style.width = wrap.clientWidth + 'px';
    if (lastY < wr.top + edge + 40 || lastY > wr.bottom - edge) raf = requestAnimationFrame(update);
  };
  const move = (ev) => {
    lastY = ev.clientY;
    if (!started) { if (Math.abs(ev.clientY - startY) < 4) return; start(); }
    ghost.style.transform = `translate(${ev.clientX + 14}px, ${ev.clientY - 14}px)`;
    if (!raf) raf = requestAnimationFrame(update);
  };
  const end = (ev) => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', end);
    window.removeEventListener('pointercancel', end);
    cancelAnimationFrame(raf);
    if (!started) return;
    document.body.classList.remove('row-dragging');
    setTimeout(flushRemote, 0);
    tr.classList.remove('drag-src');
    line.remove();
    ghost.remove();
    if (ev.type === 'pointercancel' || target == null) return;
    const ids = rowsEls().map((x) => x.dataset.row);
    const before = ids[target];
    const moved = before === rowId || (target > 0 && ids[target - 1] === rowId)
      ? false
      : before ? placeRow(board(b.id), rowId, before) : placeRow(board(b.id), rowId, null, ids[ids.length - 1]);
    if (moved) {
      refreshBoard(board(b.id));
      const el = rowEl(b, rowId);
      el?.classList.add('just-moved');
      setTimeout(() => el?.classList.remove('just-moved'), 900);
    }
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
});

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

/* =========================================================
   Daily snapshots, multi-tab sync
   ========================================================= */
// Tiny IndexedDB key/value store (file handles can't go in localStorage)
const idb = (() => {
  let dbp;
  const open = () => (dbp ||= new Promise((res, rej) => {
    const r = indexedDB.open('tracker', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
  const run = async (mode, fn) => {
    const d = await open();
    return new Promise((res, rej) => {
      const t = d.transaction('kv', mode);
      const req = fn(t.objectStore('kv'));
      t.oncomplete = () => res(req && req.result);
      t.onerror = () => rej(t.error);
    });
  };
  return {
    get: (k) => run('readonly', (st) => st.get(k)),
    set: (k, v) => run('readwrite', (st) => st.put(v, k)),
    del: (k) => run('readwrite', (st) => st.delete(k)),
  };
})();

let snapTimer = null;
let localPending = null;
// Called after every local save: refresh today's snapshot (debounced)
function scheduleBackup() {
  clearTimeout(snapTimer);
  snapTimer = setTimeout(() => { snapTimer = null; dailySnapshot(); }, 1200);
}

// One snapshot per day (the day's latest state), last 14 days, kept in IndexedDB.
async function dailySnapshot() {
  try {
    const day = todayStr();
    await idb.set('snap:' + day, { at: Date.now(), data: clone(db) });
    const idx = (await idb.get('snapIndex')) || [];
    if (!idx.includes(day)) {
      idx.push(day);
      idx.sort();
      while (idx.length > 14) await idb.del('snap:' + idx.shift());
      await idb.set('snapIndex', idx);
    }
  } catch { /* best effort */ }
}

function parseBackup(text) {
  try {
    const parsed = JSON.parse(text);
    const data = parsed && parsed.data && parsed.data.boards ? parsed.data : parsed;
    return data && Array.isArray(data.boards) && Array.isArray(data.sections) ? data : null;
  } catch { return null; }
}
const rowCount = (d) => d.boards.reduce((a, b) => a + (b.rows || []).length, 0);

async function snapshotsModal() {
  let idx = [];
  try { idx = ((await idb.get('snapIndex')) || []).slice().reverse(); } catch { /* ignore */ }
  const snaps = [];
  for (const d of idx) { try { const sn = await idb.get('snap:' + d); if (sn) snaps.push({ d, ...sn }); } catch { /* ignore */ } }
  const body = h(`<div>
    <p>One snapshot is kept per day (the last state of that day) for 14 days, in this browser.</p>
    <div class="snap-list">${snaps.map((sn, i) => `<div class="snap"><div><b>${esc(fmtDate(sn.d))}</b><small>${sn.data.boards.length} categories · ${rowCount(sn.data)} rows · saved ${esc(fmtShortDT(sn.at))}</small></div><button class="btn sm" data-i="${i}">Restore</button></div>`).join('') || '<div class="muted">No snapshots yet — one is made after your first change today.</div>'}</div>
  </div>`);
  body.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    const sn = snaps[+b.dataset.i];
    if (!(await confirmDialog('Restore snapshot?', `All current data will be replaced with the snapshot from <b>${esc(fmtDate(sn.d))}</b> (${rowCount(sn.data)} rows). Today's snapshot is updated after this, so export a backup first if unsure.`, 'Restore'))) return;
    db = migrate(clone(sn.data));
    save();
    go('overview');
    toast(`Restored snapshot from ${fmtDate(sn.d)}`);
  });
  modal({ title: 'Daily snapshots', body, actions: [{ label: 'Close' }] });
}

// Keep several tabs of the browser-only app in sync (same merge as server mode)
function applyLocalRemote(theirs) {
  const local = hasLocalChanges();
  db = local ? migrate(merge3(synced || undefined, db, theirs)) : theirs;
  synced = clone(theirs);
  render();
  if (local && hasLocalChanges()) save();
}
window.addEventListener('storage', (e) => {
  if (e.key !== 'tracker-db' || !e.newValue) return;
  let theirs;
  try { theirs = migrate(JSON.parse(e.newValue)); } catch { return; }
  if (isBusy()) { localPending = theirs; return; }
  applyLocalRemote(theirs);
});

// Flush pending writes when the tab is hidden or closed
function flushNow() {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; persist(); }
  if (snapTimer) { clearTimeout(snapTimer); snapTimer = null; dailySnapshot(); }
}
document.addEventListener('visibilitychange', () => { if (document.hidden) flushNow(); });
window.addEventListener('pagehide', flushNow);

// Dropping a file anywhere else must not navigate away from the app
document.addEventListener('dragover', (e) => { if (e.dataTransfer?.types?.includes('Files')) e.preventDefault(); });
document.addEventListener('drop', (e) => { if (e.dataTransfer?.types?.includes('Files')) e.preventDefault(); });

/* =========================================================
   Personalisation: first-run setup + dashboard tour
   ========================================================= */
function onboardingModal(edit) {
  const orig = { theme: ui.theme || 'system', accent: ui.accent || 'indigo' };
  let saved = false;
  const body = h(`<div class="onb">
    <div class="onb-hero">
      <div class="logo big">${icon('layers', 26)}</div>
      <h2>${edit ? 'Make it yours' : 'Welcome to Tracker'}</h2>
      <p>${edit ? 'Update your name, theme and accent colour.' : 'Track customers, development and testing in one place. Let\'s set it up — it takes 10 seconds.'}</p>
    </div>
    <label class="field"><span>What should we call you?</span><input class="inp onb-name" id="onb-name" maxlength="40" autocomplete="given-name" placeholder="Your name" value="${esc(ui.name || '')}"></label>
    <div class="field"><span>Theme</span>
      <div class="theme-cards">${[['light', 'Light', 'sun'], ['dark', 'Dark', 'moon'], ['system', 'System', 'monitor']].map(([k, label, ic]) => `
        <button type="button" class="theme-card ${orig.theme === k ? 'on' : ''}" data-t="${k}">
          <span class="tc-prev tc-${k}"><i class="tc-side"></i><i class="tc-head"></i><i class="tc-row"></i><i class="tc-row short"></i></span>
          <span class="tc-label">${icon(ic, 14)}${label}</span>
        </button>`).join('')}</div>
    </div>
    <div class="field"><span>Accent colour</span>
      <div class="accent-row">${ACCENTS.map((a) => `<button type="button" class="acc ${orig.accent === a.k ? 'on' : ''}" data-a="${a.k}" style="--sw:${a.sw}" title="${a.label}" aria-label="${a.label}"></button>`).join('')}</div>
    </div>
  </div>`);
  const nameInp = $('#onb-name', body);
  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-t]');
    if (t) { ui.theme = t.dataset.t; applyTheme(); $$('.theme-card', body).forEach((x) => x.classList.toggle('on', x === t)); return; }
    const a = e.target.closest('[data-a]');
    if (a) { ui.accent = a.dataset.a; applyTheme(); $$('.acc', body).forEach((x) => x.classList.toggle('on', x === a)); }
  });
  const finish = () => {
    const name = nameInp.value.trim().replace(/\s+/g, ' ');
    if (!name) {
      nameInp.focus();
      nameInp.classList.remove('shake'); void nameInp.offsetWidth; nameInp.classList.add('shake');
      return false;
    }
    saved = true;
    ui.name = name;
    ui.onboarded = true;
    saveUi();
    render();
    if (!edit) { setTimeout(startTour, 350); }
    else toast('Saved');
  };
  const m = modal({
    title: '',
    body,
    size: 'onb-modal',
    actions: edit
      ? [{ label: 'Cancel' }, { label: 'Save', primary: true, fn: finish }]
      : [
        { label: 'Skip for now', left: true, fn: () => { saved = true; ui.onboarded = true; saveUi(); renderSidebar(); } },
        { label: 'Done', primary: true, fn: finish },
      ],
  });
  m._onClose = () => {
    if (saved) return;
    if (edit) { ui.theme = orig.theme; ui.accent = orig.accent; applyTheme(); }
    else { ui.onboarded = true; saveUi(); renderSidebar(); } // closed with X / Esc: don't ask again
  };
  setTimeout(() => nameInp.focus(), 60);
}

const TOUR = [
  { sel: '#side .nav', side: 'right', title: 'Your workspace', text: 'Sections like Customers, Development and Testing hold your categories. Hover a section and press <b>+</b> to add a category, or add a new section at the bottom.' },
  { sel: '.kpis', side: 'bottom', title: 'Totals at a glance', text: 'How many items each section holds, and how much changed in the last 7 days.' },
  { sel: '.ov-sec .cards', side: 'bottom', title: 'Category cards', text: 'Status and priority breakdown for every category. Click a card to open its full table.' },
  { sel: '.ov-side', side: 'left', title: 'Recently updated', text: 'The latest edits from every category — click one to jump straight to that row.' },
  { sel: '#ov-browse', side: 'top', title: 'Work right from here', text: 'Switch categories with the tabs or <b>← →</b>. Click any cell to edit it, drag <b>⋮⋮</b> to reorder rows, click a column header to rename, sort or change its type, and use <b>+</b> to add columns.' },
  { sel: '[data-act="app-menu"]', side: 'right', title: 'Backups', text: 'Use this menu to <b>export</b> a backup file now and then, or <b>import</b> one on another computer or browser.' },
  { sel: '.theme-seg', side: 'right', title: 'Light or dark', text: 'Switch the theme any time.' },
  { sel: '.me', side: 'right', title: 'That\'s you', text: 'Click your name to change it, pick another accent colour, or replay this tour.' },
];
let tour = null;

function startTour() {
  closePop(false);
  closeModal();
  if (ui.view !== 'overview') go('overview');
  tour = { i: 0, el: h('<div class="tour"><div class="tour-spot"></div><div class="tour-card" role="dialog" aria-live="polite"></div></div>') };
  document.body.append(tour.el);
  tour.el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tour]');
    if (!b) return;
    const a = b.dataset.tour;
    if (a === 'next') tourGo(1);
    else if (a === 'back') tourGo(-1);
    else endTour();
  });
  window.addEventListener('resize', placeTour);
  tourGo(0);
}

function tourTarget(st) {
  const el = $(st.sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width && r.height ? el : null;
}

function tourGo(dir) {
  if (!tour) return;
  let i = tour.i + dir;
  // skip steps whose element isn't on screen (e.g. empty workspace)
  while (i >= 0 && i < TOUR.length && !tourTarget(TOUR[i]) && !(innerWidth < 860 && TOUR[i].sel.includes('#side')) && !(innerWidth < 860 && /app-menu|theme-seg|\.me/.test(TOUR[i].sel))) i += dir || 1;
  if (i >= TOUR.length) return endTour(true);
  if (i < 0) i = 0;
  tour.i = i;
  const st = TOUR[i];
  const inSide = st.sel.includes('#side') || /app-menu|theme-seg|\.me/.test(st.sel);
  document.body.classList.toggle('side-open', innerWidth < 860 && inSide);
  const el = $(st.sel);
  if (el && !inSide) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  const last = i === TOUR.length - 1;
  $('.tour-card', tour.el).innerHTML = `
    <div class="tour-top"><span class="tour-step">${i + 1} / ${TOUR.length}</span><button class="icon-btn sm" data-tour="skip" title="Close tour">${icon('x', 14)}</button></div>
    <h4>${st.title}</h4>
    <p>${st.text}</p>
    <div class="tour-dots">${TOUR.map((_, j) => `<i class="${j === i ? 'on' : j < i ? 'done' : ''}"></i>`).join('')}</div>
    <div class="tour-foot">
      <button class="btn sm ghost" data-tour="skip">Skip tour</button>
      <span class="spacer"></span>
      ${i > 0 ? '<button class="btn sm" data-tour="back">Back</button>' : ''}
      <button class="btn sm primary" data-tour="next">${last ? 'Finish' : 'Next'}</button>
    </div>`;
  placeTour();
  setTimeout(placeTour, 380); // after smooth scroll / sidebar slide
  $('[data-tour="next"]', tour.el).focus({ preventScroll: true });
}

function placeTour() {
  if (!tour) return;
  const st = TOUR[tour.i];
  const el = $(st.sel);
  const spot = $('.tour-spot', tour.el), card = $('.tour-card', tour.el);
  if (!el) return;
  const pad = 6;
  const r = el.getBoundingClientRect();
  const top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad);
  const w = Math.min(innerWidth - 8, r.width + pad * 2), hgt = Math.min(innerHeight - 8, r.bottom + pad - top);
  Object.assign(spot.style, { top: top + 'px', left: left + 'px', width: w + 'px', height: hgt + 'px' });
  const cw = card.offsetWidth, ch = card.offsetHeight, gap = 14;
  const fits = {
    right: left + w + gap + cw < innerWidth - 8,
    left: left - gap - cw > 8,
    bottom: top + hgt + gap + ch < innerHeight - 8,
    top: top - gap - ch > 8,
  };
  const side = fits[st.side] ? st.side : ['bottom', 'top', 'right', 'left'].find((k) => fits[k]) || 'inside';
  let x, y;
  if (side === 'right') { x = left + w + gap; y = top; }
  else if (side === 'left') { x = left - gap - cw; y = top; }
  else if (side === 'bottom') { x = left; y = top + hgt + gap; }
  else if (side === 'top') { x = left; y = top - gap - ch; }
  else { x = left + 16; y = top + 16; }
  card.style.left = Math.min(Math.max(8, x), innerWidth - cw - 8) + 'px';
  card.style.top = Math.min(Math.max(8, y), innerHeight - ch - 8) + 'px';
  card.dataset.side = side;
}

function tourKey(e) {
  if (e.key === 'Escape') { e.preventDefault(); endTour(); }
  else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); tourGo(1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); tourGo(-1); }
}

function endTour(finished) {
  if (!tour) return;
  tour.el.remove();
  tour = null;
  window.removeEventListener('resize', placeTour);
  document.body.classList.remove('side-open');
  ui.tourDone = true;
  saveUi();
  if (finished) toast(`You're all set${firstName() ? `, ${firstName()}` : ''}!`);
}
window.addEventListener('scroll', () => tour && placeTour(), true);

/* =========================================================
   Boot
   ========================================================= */
(async function boot() {
  applyTheme();
  load();
  if (ui.view !== 'overview' && !board(ui.view)) ui.view = 'overview';
  render();
  if (!ui.onboarded) onboardingModal(false);
  try { navigator.storage?.persist?.(); } catch { /* best effort: ask the browser not to evict our data */ }
})();
