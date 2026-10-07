// ==UserScript==
// @name         Feather: Pod filter menu
// @namespace    local.feather.pod-menu
// @version      2.2.2
// @description  Adds a pod menu to the CheckSet task list: filter the Runtime Findings V2 and Individual Apps tasks by POD.
// @match        https://feather.openai.com/*
// @noframes
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  // Run once per page, top window only.
  if (window.top !== window.self) return;
  if (window.__podMenuLoaded) return;
  window.__podMenuLoaded = true;

  const VERSION = '2.2.2';
  const TAG = '[podmenu v' + VERSION + ']';

  /* ======================= Pod data ======================= */
  // The block between the markers is rewritten by the scheduled "pod list refresh" task.
  // Source: CheckSet site > Individual apps > Introduction > "Applications by POD".
  // You can also paste newer data in the menu ("Import pod list...") without touching this file.
  /* POD_DATA_START */
  // Two groups: the Testing batch (New Runtime Findings V2) PODs, whose Feather titles look like
  // "aftership runtime quality review", and the Individual Apps PODs, whose titles look like
  // "Google Trends — Individual QC — Task A — Uploaded 2026-09-11".
  // Sources: /testing-batch/new-runtime-findings-v2/introduction ("Runtime Apps by POD") and
  //          /individual-apps/introduction ("Applications by POD").
  const BUILTIN_POD_DATA = {
    "updated": "2026-10-07",
    "groups": [
      { "name": "Runtime Findings V2", "pods": [
        { "id": "v2-commercial", "name": "Commercial", "apps": ["aftership", "apollo", "clay", "close-crm-website", "crayon", "flg", "gong", "gorgias", "hootsuite", "hubspot", "loop-returns", "mmt-connect", "outreach", "rl-yotpo", "salesforce", "salesloft", "sap", "shopify", "similarweb", "whatsapp-business", "zendesk-qa-website"] },
        { "id": "v2-creative", "name": "Creative & Design", "apps": ["adobe-audition", "adobe-express", "adobe-lightroom-desktop", "after-effects", "behance-website", "calibre", "camtasia", "canva", "clo3d-website", "coreldraw-website", "davninci-website", "figma", "figma-website", "frame", "framer-website", "houzz-website", "letterboxd", "nuke-desktop", "premiere-pro", "rl-sketchup", "scrivener", "shotgrid", "webflow-website", "wordpress-website", "adobe-sign", "asana", "calendly-website", "clickup", "document360-website", "fireflies-website", "google-workspace", "lexisnexis", "monday", "ms-sharepoint", "msoffice", "notion", "notion-website", "powerpoint", "sharepoint", "slack", "westlaw-website", "zapier", "zoho-recruit-website"] },
        { "id": "v2-engineering", "name": "Engineering & Data", "apps": ["1password-business", "airflow", "amplitude", "azure-devops-pipelines", "azure-monitor", "azure-portal", "bigquery", "browserstack-website", "cursor", "cursor-website", "datadog-apm", "datadog-logs", "datadog-metrics-monitors", "github-website", "gitlab", "grafana", "kaggle-website", "lastpass-website", "mixpanel", "mlflow", "mlflow3", "ms-azure-devops", "okta", "onetrust-website", "rl-postman-website", "sentry", "servicenow", "splunk", "tableau", "together", "twilio-website", "vertex-ai", "vs-code-website", "wandb"] },
        { "id": "v2-finance", "name": "Finance & Markets", "apps": ["anaplan", "anaplan-cua", "bank-of-america", "bloomberg", "bloomberg-terminal", "capiq", "commercial-bank-portal", "edgar-sec", "expertnetwork", "factsite-website", "kyriba", "moodys", "odoo", "odoo-website", "paypal-website", "pitchbook-web", "plaid", "ramp", "razorpay", "redtail-website", "square", "square-website-v2", "statista-website", "stripe", "taxjar-website", "tipalti", "zip-procurement"] },
        { "id": "v2-healthcare", "name": "Healthcare", "apps": ["covermymeds", "health-equity", "lifeline", "mychart-epic-website", "pacs-dicom", "photon-health", "powerbi-multi-rl-clinical-ops-administration", "zocdoc-website", "adobe-sign", "asana", "calendly-website", "clickup", "document360-website", "fireflies-website", "google-workspace", "lexisnexis", "monday", "ms-sharepoint", "msoffice", "notion", "notion-website", "powerpoint", "sharepoint", "slack", "westlaw-website", "zapier", "zoho-recruit-website"] },
        { "id": "v2-productivity", "name": "Productivity", "apps": ["adobe-sign", "asana", "calendly-website", "clickup", "document360-website", "fireflies-website", "google-workspace", "lexisnexis", "monday", "ms-sharepoint", "msoffice", "notion", "notion-website", "powerpoint", "sharepoint", "slack", "westlaw-website", "zapier", "zoho-recruit-website", "aftership", "apollo", "clay", "close-crm-website", "crayon", "flg", "gong", "gorgias", "hootsuite", "hubspot", "loop-returns", "mmt-connect", "outreach", "rl-yotpo", "salesforce", "salesloft", "sap", "shopify", "similarweb", "whatsapp-business", "zendesk-qa-website"] }
      ] },
      { "name": "Individual apps", "pods": [
        { "id": "ia-commercial", "name": "Commercial", "apps": ["Ahrefs Site Explorer", "Amazon Ads Campaign Manager", "AWeber", "Constant Contact", "ConvertKit", "eBay Seller Hub", "Getfly CRM", "GetResponse", "Google Analytics", "Google Trends", "HoneyBook", "Instantly", "Kommo CRM", "LinkedIn Campaign Manager", "Pipedrive", "Salesforce"] },
        { "id": "ia-creative", "name": "Creative", "apps": ["Miro", "Scrivener", "SoundCloud"] },
        { "id": "ia-engineering", "name": "Engineering", "apps": ["SQL Server Management Studio"] },
        { "id": "ia-finance", "name": "Finance", "apps": ["Acumatica ERP", "FreshBooks", "Oracle JD Edwards EnterpriseOne", "Payoneer", "PayPal", "SAP Business One", "YNAB"] },
        { "id": "ia-healthcare", "name": "Healthcare", "apps": ["DocuWare", "ERPNext", "Foxit PDF Editor", "Jotform", "LimeSurvey"] },
        { "id": "ia-productivity", "name": "Productivity", "apps": ["Domo", "Ironclad", "LibreOffice Calc", "Medium", "Microsoft Loop", "Microsoft Planner", "Microsoft Whiteboard", "Notepad", "Odoo", "Typeform", "Viber"] }
      ] }
    ]
  };
  /* POD_DATA_END */

  // Lists of your own that site refreshes never touch. Same shape as a pod; shown as a last group.
  const EXTRA_PODS = [];

  /* ======================= Auto-update ======================= */
  // Paste the link of pods.json (copy it from the "Feather Pod Lists" page) between the quotes.
  // Left empty, auto-update is off and the built-in list below is used.
  // A list you imported by hand always wins over the auto-updated one.
  const AUTO_URL = '';
  const AUTO_EVERY_MS = 6 * 60 * 60 * 1000;
  const LS_AUTO = 'podmenu.auto.v1', LS_AUTO_AT = 'podmenu.autoAt.v1';

  /* ======================= Settings ======================= */
  const DEFAULT_SETTINGS = { useLatestTag: true, extraPages: 1 }; // changeable in the menu
  const MAX_EXTRA_PAGES = 3;
  const LS_SETTINGS = 'podmenu.settings.v1';
  const LS_PODS = 'podmenu.podData.v1';

  const POD_COLORS = {
    commercial: '#4f7cf0', creative: '#a56bd0', engineering: '#33a583',
    finance: '#d19a3a', healthcare: '#d4616f', productivity: '#7d8da3'
  };
  const colorFor = name => POD_COLORS[key(String(name).split(/&|\band\b/)[0])] || null;

  /* ======================= Timings (ms) ======================= */
  const T = {
    poll: 250, tagPoll: 500, tagApply: 4000, refetchStart: 4000, settle: 1500,
    rowsWait: 15000, moreWait: 10000, cooldown: 15000, debounce: 250,
    heartbeat: 2000, missLeave: 2500
  };

  /* ======================= Internals ======================= */
  const ROOT_ID = 'pm-root', BTN_ID = 'pm-btn', MENU_ID = 'pm-menu', IMPORT_ID = 'pm-import';
  const LIVE_ID = 'pm-live', STYLE_ID = 'pm-style', HIDE_ATTR = 'data-pm-hidden';
  const LINK_SEL = 'a[href*="/tasks/"]';
  const SUFFIX_RE = /\s*[-–—:|]*\s*runtime[\s-]*quality[\s-]*review\b.*$/i;
  const IQC_RE = /\s*[-–—:|]+\s*individual\s*qc\b.*$/i;

  const logs = [];
  function log() {
    const msg = Array.prototype.slice.call(arguments).join(' ');
    logs.push(new Date().toTimeString().slice(0, 8) + ' ' + msg);
    if (logs.length > 40) logs.shift();
    console.info(TAG, msg);
  }

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
    }
  };

  // "Google Trends", "google-trends" and "Google Trends  " all become "googletrends".
  const key = s => String(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
  // "hootsuite · Task 2" and "Jotform · 2026-09-18" are extra task links for the same app.
  const cleanApp = s => String(s).replace(/\s+/g, ' ').replace(/\s*[·•|]\s*(task\s*\d+|\d{4}-\d{2}-\d{2})\s*$/i, '').trim();
  const appKey = text => key(String(text).replace(/\s+/g, ' ')
    .replace(IQC_RE, '').replace(SUFFIX_RE, '')
    .replace(/\s*[-\u2013\u2014]\s*(task\s*[a-z0-9]|uploaded)\b.*$/i, '')
    .replace(/\s*[\u00B7\u2022]\s*\d{4}-\d{2}-\d{2}\s*$/, ''));

  class Fail extends Error {}
  class Cancelled extends Error {}
  class RateLimited extends Error {}

  function parsePodData(raw) {
    const d = typeof raw === 'string'
      ? JSON.parse(raw.trim().replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, ''))
      : raw;
    if (!d || typeof d !== 'object') throw new Error('Expected a JSON object');
    if (typeof d.updated !== 'string') d.updated = new Date().toISOString().slice(0, 10);
    if (!Array.isArray(d.groups)) {
      if (!Array.isArray(d.pods)) throw new Error('Expected {"groups":[...]} or {"pods":[...]}');
      d.groups = [{ name: '', pods: d.pods }];
      delete d.pods;
    }
    let n = 0;
    d.groups.forEach(g => {
      if (!g || !Array.isArray(g.pods)) throw new Error('Every group needs a "pods" list');
      if (typeof g.name !== 'string') g.name = '';
      g.pods.forEach(p => {
        if (!p || typeof p.name !== 'string' || !p.name.trim()) throw new Error('Every pod needs a "name"');
        if (!Array.isArray(p.apps) || !p.apps.length) throw new Error('Pod "' + p.name + '" needs a non-empty "apps" list');
        n++;
      });
    });
    if (!n) throw new Error('No pods found');
    return d;
  }

  function buildPods(data) {
    const seen = new Set();
    const out = [];
    const groups = EXTRA_PODS.length ? data.groups.concat([{ name: 'My lists', pods: EXTRA_PODS }]) : data.groups;
    groups.forEach((g, gi) => {
      g.pods.forEach(p => {
        let id = String(p.id || key(p.name)) || 'pod';
        while (seen.has(id)) id += '-2';
        seen.add(id);
        const apps = []; // de-duplicated, order kept
        p.apps.map(cleanApp).filter(Boolean).forEach(a => { if (!apps.some(b => key(b) === key(a))) apps.push(a); });
        out.push({ id: id, name: String(p.name).trim(), group: g.name, groupIndex: gi, apps: apps, keys: new Set(apps.map(key).filter(Boolean)) });
      });
    });
    return out;
  }

  let podData = BUILTIN_POD_DATA;
  let imported = false;
  try {
    const raw = store.get(LS_PODS);
    if (raw) { podData = parsePodData(raw); imported = true; }
  } catch (e) { log('ignoring bad imported pod data:', e.message); store.del(LS_PODS); }
  let autoData = null;
  try {
    const rawAuto = store.get(LS_AUTO);
    if (rawAuto) {
      const d = parsePodData(rawAuto);
      if (String(d.updated) >= String(BUILTIN_POD_DATA.updated)) autoData = d;
    }
  } catch (e) { store.del(LS_AUTO); }
  if (!imported && autoData) podData = autoData;
  const dataLabel = () => imported ? ' (imported)' : (autoData && podData === autoData ? ' (auto)' : ' (built in)');
  let pods = buildPods(podData);

  function autoRefresh() {
    if (!AUTO_URL || typeof GM_xmlhttpRequest !== 'function') return;
    if (Date.now() - (parseInt(store.get(LS_AUTO_AT), 10) || 0) < AUTO_EVERY_MS) return;
    GM_xmlhttpRequest({
      method: 'GET', url: AUTO_URL, timeout: 20000,
      onload: r => {
        try {
          if (r.status < 200 || r.status >= 300) throw new Error('HTTP ' + r.status);
          const d = parsePodData(r.responseText);
          store.set(LS_AUTO, JSON.stringify(d)); store.set(LS_AUTO_AT, String(Date.now()));
          autoData = d;
          if (!imported) { podData = d; rebuildPods(); }
          log('auto-updated pod data', d.updated);
        } catch (e) { log('auto-update failed:', e.message); }
      },
      onerror: () => log('auto-update: network error'),
      ontimeout: () => log('auto-update: timed out')
    });
  }

  const settings = Object.assign({}, DEFAULT_SETTINGS);
  try {
    const s = JSON.parse(store.get(LS_SETTINGS) || '{}');
    if (typeof s.useLatestTag === 'boolean') settings.useLatestTag = s.useLatestTag;
    if (Number.isInteger(s.extraPages) && s.extraPages >= 0) settings.extraPages = Math.min(s.extraPages, MAX_EXTRA_PAGES);
  } catch (e) { /* use defaults */ }
  const saveSettings = () => store.set(LS_SETTINGS, JSON.stringify(settings));

  let activePodId = null;  // which pod filter is on (null = none)
  let busy = false;
  let gen = 0;             // bumps to cancel an in-flight flow
  let menuOpen = false;
  let lastError = '', lastWarn = '', statusText = '';
  let cooldownUntil = 0, activeSig = '', loadedSig = '', missSince = 0;
  let flashText = '', flashUntil = 0;

  const activePod = () => pods.find(p => p.id === activePodId) || null;
  const isActive = () => !!activePod();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const mouseInit = { bubbles: true, cancelable: true, view: window };
  const $ = id => document.getElementById(id);

  /* ---------- DOM helpers (all selectors live here) ---------- */
  const searchBox = () =>
    document.querySelector('input[placeholder*="Search by tag" i]') ||
    document.querySelector('input[placeholder*="tag" i][placeholder*="task" i]');
  const taskRows = () =>
    [...document.querySelectorAll('[role=row]')].filter(r => r.querySelector(LINK_SEL));
  const rowCount = () => taskRows().length;
  const rowTitle = r => r.querySelector(LINK_SEL).textContent;
  const firstHref = () => {
    const r = taskRows()[0];
    const a = r && r.querySelector(LINK_SEL);
    return a ? a.getAttribute('href') : '';
  };
  const rateLimited = () =>
    /too many requests/i.test(document.body.innerText || document.body.textContent || '');

  function loadMoreBtn() {
    const isMore = b => /^\s*load\s*more/i.test(b.textContent) && !b.disabled && !b.closest('[role=dialog]');
    const rows = taskRows();
    if (rows.length) {
      const scope = rows[0].closest('[role=table],[role=grid]') || rows[0].parentElement;
      const root = scope && scope.parentElement;
      const hit = root && [...root.querySelectorAll('button')].find(isMore);
      if (hit) return hit;
    }
    return [...document.querySelectorAll('button')].find(isMore);
  }

  function hasLatestTag() {
    const inp = searchBox();
    const box = inp && inp.parentElement && inp.parentElement.parentElement;
    if (!box) return false;
    return [...box.querySelectorAll('*')].some(e =>
      e.children.length === 0 &&
      e.textContent.trim().toLowerCase() === 'latest' &&
      !e.closest('li,[role=listbox],[role=row],[role=table],[role=grid]'));
  }

  const optionRoot = inp => {
    const id = inp.getAttribute('aria-controls');
    return (id && document.getElementById(id)) || document;
  };
  const latestOption = inp =>
    [...optionRoot(inp).querySelectorAll('li[role=option]')]
      .find(e => /^latest(\s*\(\d+\))?$/i.test(e.textContent.trim()));
  const listboxOpen = inp =>
    inp.getAttribute('aria-expanded') === 'true' || !!optionRoot(inp).querySelector('li[role=option]');

  function openDropdown(inp) {
    ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(t => inp.dispatchEvent(new MouseEvent(t, mouseInit)));
    inp.focus();
  }

  // Identity of the list on screen (page, tag state, first row).
  const sig = () => location.pathname + location.search + '|' + (hasLatestTag() ? 1 : 0) + '|' + firstHref();

  async function waitFor(fn, ms, run) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      if (run !== gen) throw new Cancelled();
      if (fn()) return true;
      if (rateLimited()) throw new RateLimited();
      await sleep(T.poll);
    }
    return false;
  }
  async function pause(ms, run) {
    await sleep(ms);
    if (run !== gen) throw new Cancelled();
  }

  /* ---------- Filtering ---------- */
  function clearHidden() {
    document.querySelectorAll('[' + HIDE_ATTR + ']').forEach(e => e.removeAttribute(HIDE_ATTR));
  }

  function applyFilter() {
    const pod = activePod();
    let matched = 0, total = 0;
    taskRows().forEach(row => {
      total++;
      const isMatch = !!pod && pod.keys.has(appKey(rowTitle(row)));
      if (isMatch) matched++;
      if (pod && !isMatch) row.setAttribute(HIDE_ATTR, '');
      else row.removeAttribute(HIDE_ATTR);
    });
    return { matched: matched, total: total };
  }

  function loadedKeys() { return new Set(taskRows().map(r => appKey(rowTitle(r)))); }
  const unseenApps = pod => { const k = loadedKeys(); return pod.apps.filter(a => !k.has(key(a))); };

  function podCounts() {
    const keys = taskRows().map(r => appKey(rowTitle(r)));
    const counts = {};
    pods.forEach(p => { counts[p.id] = keys.filter(k => p.keys.has(k)).length; });
    const names = [];
    taskRows().forEach(r => {
      const k = appKey(rowTitle(r));
      if (!pods.some(p => p.keys.has(k))) {
        const n = rowTitle(r).replace(/\s+/g, ' ').replace(IQC_RE, '').replace(SUFFIX_RE, '').trim();
        if (names.indexOf(n) < 0) names.push(n);
      }
    });
    return { counts: counts, total: keys.length, unassigned: names };
  }

  /* ---------- Click flow ---------- */
  async function ensureLatestTag(run) {
    const inp = searchBox();
    if (!inp) throw new Fail('Tag search box not found');
    if (hasLatestTag()) return;
    const h0 = firstHref();
    let opens = 0;
    for (let i = 0; i < 12 && !latestOption(inp); i++) {
      if (i % 2 === 0 && opens < 3 && !listboxOpen(inp)) { openDropdown(inp); opens++; }
      await pause(T.tagPoll, run);
    }
    const o = latestOption(inp);
    if (!o) throw new Fail('"latest" tag option not found');
    o.dispatchEvent(new MouseEvent('mousedown', mouseInit));
    o.click();
    if (!(await waitFor(hasLatestTag, T.tagApply, run))) throw new Fail('"latest" tag did not apply');
    await waitFor(() => rowCount() === 0 || firstHref() !== h0, T.refetchStart, run);
    await pause(T.settle, run);
  }

  async function loadMore(run) {
    for (let i = 0; i < settings.extraPages; i++) {
      const b = loadMoreBtn();
      if (!b) { log('no Load more button'); return; }
      const before = rowCount();
      b.click();
      if (!(await waitFor(() => rowCount() > before, T.moreWait, run))) {
        lastWarn = 'Load more did not add rows.'; log(lastWarn); return;
      }
      await pause(T.settle, run);
    }
  }

  function setStatus(t) { statusText = t; render(); }

  async function startFlow(podId) {
    const wait = cooldownUntil - Date.now();
    if (wait > 0) { lastError = 'Rate limited, wait ' + Math.ceil(wait / 1000) + 's'; render(); return; }
    const run = ++gen;
    busy = true; lastError = ''; lastWarn = '';
    setStatus('Working: preparing...');
    try {
      if (settings.useLatestTag) { setStatus('Working: tag...'); await ensureLatestTag(run); }
      setStatus('Working: loading list...');
      if (!(await waitFor(() => rowCount() > 0, T.rowsWait, run))) {
        throw new Fail('No rows loaded (none match, or timed out)');
      }
      if (settings.extraPages > 0 && loadedSig !== sig()) {
        setStatus('Working: loading more...');
        await loadMore(run);
        loadedSig = sig();
      }
      if (run !== gen) throw new Cancelled();
      activePodId = podId;
      activeSig = sig();
      const inp = searchBox();
      if (inp && inp.value && inp.value.trim()) lastWarn = 'Search box has text, which may narrow the results.';
      log('filter on:', podId, '-', rowCount(), 'rows loaded');
    } catch (e) {
      if (e instanceof Cancelled) return;
      if (e instanceof RateLimited) {
        cooldownUntil = Date.now() + T.cooldown;
        lastError = 'Rate limited, wait ' + Math.round(T.cooldown / 1000) + 's';
        log('server said too many requests; cooling down');
      } else if (e instanceof Fail) {
        lastError = e.message; log('failed:', e.message);
      } else {
        lastError = 'Unexpected error (shift-click for a report)';
        console.error(TAG, e); log('error:', e && e.message);
      }
    } finally {
      if (run === gen) busy = false;
      if (root()) render();
    }
  }

  function choosePod(id) {
    closeMenu();
    if (busy) return;
    if (id === null) { deactivate(); return; }
    if (isActive()) { activePodId = id; lastWarn = ''; log('switched pod:', id); render(); return; } // no network
    startFlow(id);
  }

  function deactivate(msg) {
    activePodId = null;
    clearHidden();
    lastWarn = msg || '';
    log('filter off', msg || '');
    render();
  }

  function leaveList() {
    gen++; busy = false; activePodId = null; menuOpen = false;
    lastError = ''; lastWarn = ''; statusText = ''; missSince = 0;
    clearHidden();
    const r = root(); if (r) r.remove();
    log('left the task list');
  }

  /* ---------- Debug report (shift-click the button) ---------- */
  function buildReport() {
    const pod = activePod();
    const keys = taskRows().map(r => appKey(rowTitle(r)));
    return JSON.stringify({
      version: VERSION, url: location.href, searchBox: !!searchBox(), latestTag: hasLatestTag(),
      settings: settings, podDataUpdated: podData.updated, podDataImported: imported,
      podIds: pods.map(p => p.id),
      sampleTitles: taskRows().slice(0, 5).map(r => rowTitle(r).trim()),
      activePod: activePodId, rows: keys.length,
      matched: pod ? keys.filter(k => pod.keys.has(k)).length : null,
      busy: busy, loadMoreFound: !!loadMoreBtn(), lastError: lastError, lastWarn: lastWarn,
      activePodAppsNotLoaded: pod ? unseenApps(pod) : null,
      perPodLoaded: podCounts().counts,
      inNoSitePod: podCounts().unassigned,
      log: logs.slice(-25)
    }, null, 2);
  }

  function flash(text) {
    flashText = text; flashUntil = Date.now() + 2000;
    render();
    setTimeout(render, 2100);
  }

  async function copyReport() {
    const text = buildReport();
    console.info(TAG, 'report', text);
    try { await navigator.clipboard.writeText(text); flash('Report copied'); }
    catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { /* ignore */ }
      ta.remove();
      flash(ok ? 'Report copied' : 'Copy failed, see console');
    }
  }

  /* ---------- UI ---------- */
  const CSS =
    '[' + HIDE_ATTR + ']{display:none!important}' +
    '#pm-root{position:fixed;left:20px;bottom:20px;z-index:2147483000;font:14px/1.3 system-ui,sans-serif;color:#fff}' +
    '#pm-btn{max-width:min(380px,calc(100vw - 40px));padding:10px 16px;border-radius:999px;border:2px solid transparent;' +
      'background:#0b7a5e;color:#fff;font:600 14px/1.2 system-ui,sans-serif;cursor:pointer;white-space:nowrap;' +
      'overflow:hidden;text-overflow:ellipsis;box-shadow:0 2px 10px rgba(0,0,0,.4)}' +
    '#pm-btn:hover:not(:disabled){filter:brightness(1.12)}' +
    '#pm-root button:focus-visible,#pm-root select:focus-visible,#pm-root input:focus-visible,#pm-root textarea:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '#pm-btn[data-state=on]{background:#1b2530;border-color:#2fd5a6}' +
    '#pm-btn[data-state=error]{background:#b3261e}' +
    '#pm-btn[data-state=busy]{opacity:.85;cursor:progress}' +
    '#pm-menu,#pm-import{position:absolute;left:0;bottom:calc(100% + 8px);width:310px;max-width:calc(100vw - 40px);' +
      'max-height:70vh;overflow:auto;box-sizing:border-box;background:#1b2530;border:1px solid #3a4756;border-radius:12px;' +
      'box-shadow:0 6px 24px rgba(0,0,0,.5);padding:8px}' +
    '#pm-menu[hidden],#pm-import[hidden]{display:none}' +
    '.pm-head{padding:6px 8px;font-weight:700;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:#9fb0c3}' +
    '.pm-item{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;' +
      'color:#fff;text-align:left;cursor:pointer;font:inherit}' +
    '.pm-item:hover{background:#273445}.pm-item[aria-checked=true]{background:#17392f}' +
    '.pm-dot{flex:none;width:10px;height:10px;border-radius:50%;background:#7d8da3}' +
    '.pm-name{flex:1;font-weight:600}.pm-meta{font-size:12px;color:#9fb0c3}' +
    '.pm-sep{height:1px;margin:8px 0;background:#3a4756}' +
    '.pm-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 8px;font-size:13px;color:#dbe4ee}' +
    '.pm-row select{background:#273445;color:#fff;border:1px solid #3a4756;border-radius:6px;padding:2px 4px}' +
    '.pm-link{border:0;background:transparent;color:#7fd8bd;cursor:pointer;font:inherit;padding:4px 8px;text-decoration:underline}' +
    '.pm-note{padding:4px 8px;font-size:12px;color:#9fb0c3}' +
    '#pm-import textarea{width:100%;height:170px;box-sizing:border-box;background:#0f1720;color:#dbe4ee;border:1px solid #3a4756;' +
      'border-radius:8px;padding:8px;font:12px/1.4 ui-monospace,monospace}' +
    '.pm-err{color:#ff9b93;font-size:12px;padding:4px 0;min-height:16px}' +
    '.pm-actions{display:flex;gap:8px;justify-content:flex-end}' +
    '.pm-actions button{padding:6px 12px;border-radius:8px;border:1px solid #3a4756;background:#273445;color:#fff;cursor:pointer;font:inherit}' +
    '.pm-actions button.pm-primary{background:#0b7a5e;border-color:#0b7a5e}' +
    '#pm-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '@media (forced-colors:active){#pm-btn{border:2px solid ButtonText}}';

  const root = () => $(ROOT_ID);
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function setAttr(e, k, v) { if (e.getAttribute(k) !== v) e.setAttribute(k, v); }

  function render() {
    const b = $(BTN_ID);
    if (!b) return;
    const dialogOpen = !!document.querySelector('[role=dialog]');
    const r = root();
    const display = dialogOpen ? 'none' : '';
    if (r.style.display !== display) r.style.display = display;

    const pod = activePod();
    let state, label, title;
    if (busy) {
      state = 'busy'; label = statusText || 'Working...'; title = 'Working. Click to cancel.';
    } else if (lastError) {
      state = 'error'; label = '⚠ ' + lastError;
      title = lastError + '. Click to open the menu and retry. Shift-click copies a debug report.';
    } else if (pod) {
      const c = applyFilter();
      const more = !!loadMoreBtn();
      const missing = unseenApps(pod).length;
      state = 'on';
      label = (pod.groupIndex > 0 ? pod.group + ' · ' : '') + pod.name + ': ' + c.matched + '/' + c.total + (more ? '+' : '');
      title = 'Showing ' + c.matched + ' ' + pod.name + ' task' + (c.matched === 1 ? '' : 's') + ' of ' + c.total +
        ' loaded rows' + (more ? ' (more pages are not loaded)' : '') + '. ' +
        missing + ' of ' + pod.apps.length + ' apps in this pod have no loaded task. Click for the pod menu.' +
        (c.matched === 0 && more ? ' None of this pod is on the loaded pages; raise "Extra pages to load".' : '');
    } else {
      state = 'off'; label = 'Pods ▾';
      title = 'Filter tasks by pod. Pod data from ' + podData.updated + dataLabel() + '. Shift-click copies a debug report.';
    }
    if (lastWarn && state !== 'busy') title += ' Note: ' + lastWarn;
    if (Date.now() < flashUntil) label = flashText;

    if (b.textContent !== label) b.textContent = label;
    setAttr(b, 'title', title);
    setAttr(b, 'data-state', state);
    setAttr(b, 'aria-expanded', String(menuOpen));
    setAttr(b, 'aria-busy', String(state === 'busy'));
    const live = $(LIVE_ID);
    if (live && live.textContent !== label) live.textContent = label;
    renderMenu();
  }

  function menuItem(id, name, meta, checked, color) {
    const it = el('button', 'pm-item');
    it.type = 'button';
    it.setAttribute('role', 'radio');
    it.setAttribute('aria-checked', String(checked));
    it.setAttribute('data-id', id === null ? '__all' : id);
    const dot = el('span', 'pm-dot');
    if (color) dot.style.background = color;
    it.appendChild(dot);
    it.appendChild(el('span', 'pm-name', name));
    it.appendChild(el('span', 'pm-meta', meta));
    it.addEventListener('click', () => choosePod(id));
    return it;
  }

  function renderMenu() {
    const menu = $(MENU_ID);
    if (!menu) return;
    menu.hidden = !menuOpen;
    if (!menuOpen) return;
    const pc = podCounts();
    const sigStr = JSON.stringify([activePodId, pc, settings, imported, podData.updated, pods.map(p => p.id)]);
    if (menu.getAttribute('data-sig') === sigStr) return;
    menu.setAttribute('data-sig', sigStr);
    const focused = menu.contains(document.activeElement) ? document.activeElement.getAttribute('data-id') : null;
    menu.textContent = '';
    menu.appendChild(el('div', 'pm-head', 'Filter tasks by pod'));
    menu.appendChild(menuItem(null, 'All tasks', pc.total + ' loaded', !activePodId, null));
    let lastGroup = -1;
    pods.forEach(p => {
      if (p.groupIndex !== lastGroup) {
        lastGroup = p.groupIndex;
        menu.appendChild(el('div', 'pm-sep'));
        if (p.group) menu.appendChild(el('div', 'pm-head', p.group));
      }
      menu.appendChild(menuItem(p.id, p.name, p.apps.length + ' apps · ' + pc.counts[p.id] + ' loaded',
        activePodId === p.id, colorFor(p.name)));
    });
    if (pc.unassigned.length) {
      const un = el('div', 'pm-note', 'In no pod: ' + pc.unassigned.slice(0, 6).join(', ') + (pc.unassigned.length > 6 ? ' +' + (pc.unassigned.length - 6) + ' more' : ''));
      un.title = pc.unassigned.join('\n');
      menu.appendChild(un);
    }
    menu.appendChild(el('div', 'pm-sep'));

    const r1 = el('label', 'pm-row');
    r1.appendChild(el('span', null, 'Apply the “latest” tag first'));
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = settings.useLatestTag; cb.setAttribute('data-id', '__tag');
    cb.addEventListener('change', () => { settings.useLatestTag = cb.checked; saveSettings(); renderMenu(); });
    r1.appendChild(cb); menu.appendChild(r1);

    const r2 = el('label', 'pm-row');
    r2.appendChild(el('span', null, 'Extra pages to load'));
    const sel = document.createElement('select');
    sel.setAttribute('data-id', '__pages');
    for (let i = 0; i <= MAX_EXTRA_PAGES; i++) {
      const o = document.createElement('option'); o.value = String(i); o.textContent = String(i);
      if (i === settings.extraPages) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener('change', () => { settings.extraPages = parseInt(sel.value, 10) || 0; saveSettings(); renderMenu(); });
    r2.appendChild(sel); menu.appendChild(r2);

    menu.appendChild(el('div', 'pm-sep'));
    const imp = el('button', 'pm-link', 'Import pod list...'); imp.type = 'button'; imp.setAttribute('data-id', '__import');
    imp.addEventListener('click', openImport);
    menu.appendChild(imp);
    if (imported) {
      const rs = el('button', 'pm-link', 'Use built-in list'); rs.type = 'button'; rs.setAttribute('data-id', '__reset');
      rs.addEventListener('click', resetPodData);
      menu.appendChild(rs);
    }
    menu.appendChild(el('div', 'pm-note', 'Pod data: ' + podData.updated + dataLabel()));

    if (focused) {
      const again = [...menu.querySelectorAll('[data-id]')].find(e => e.getAttribute('data-id') === focused);
      if (again) again.focus();
    }
  }

  function openMenu() { menuOpen = true; closeImport(); renderMenu(); render();
    const first = $(MENU_ID) && $(MENU_ID).querySelector('[aria-checked=true]');
    if (first) first.focus();
  }
  function closeMenu() { if (!menuOpen) return; menuOpen = false; render(); }

  /* ---------- Pod list import ---------- */
  function openImport() {
    menuOpen = false; render();
    const box = $(IMPORT_ID);
    box.hidden = false;
    box.querySelector('textarea').focus();
  }
  function closeImport() { const box = $(IMPORT_ID); if (box) box.hidden = true; }

  function rebuildPods() {
    pods = buildPods(podData);
    if (activePodId && !activePod()) deactivate('The selected pod is no longer in the list.');
    render();
  }
  function resetPodData() {
    store.del(LS_PODS); podData = autoData || BUILTIN_POD_DATA; imported = false;
    closeMenu(); rebuildPods(); flash('Built-in list restored');
  }
  function saveImport() {
    const box = $(IMPORT_ID);
    const err = box.querySelector('.pm-err');
    try {
      const d = parsePodData(box.querySelector('textarea').value);
      if (!store.set(LS_PODS, JSON.stringify(d))) throw new Error('Could not save in this browser');
      podData = d; imported = true;
      box.querySelector('textarea').value = ''; err.textContent = '';
      closeImport(); rebuildPods(); flash('Pod list imported');
    } catch (e) {
      err.textContent = e.message;
    }
  }

  function createUI() {
    if (!$(STYLE_ID)) {
      const st = document.createElement('style');
      st.id = STYLE_ID; st.textContent = CSS;
      (document.head || document.documentElement).appendChild(st);
    }
    const r = el('div'); r.id = ROOT_ID;

    const menu = el('div'); menu.id = MENU_ID; menu.setAttribute('role', 'group');
    menu.setAttribute('aria-label', 'Pod filter'); menu.hidden = true;
    menu.addEventListener('keydown', e => {
      const items = [...menu.querySelectorAll('button,input,select')];
      const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
      else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    });
    r.appendChild(menu);

    const imp = el('div'); imp.id = IMPORT_ID; imp.setAttribute('role', 'group');
    imp.setAttribute('aria-label', 'Import pod list'); imp.hidden = true;
    imp.appendChild(el('div', 'pm-head', 'Import pod list'));
    imp.appendChild(el('div', 'pm-note', 'Paste JSON: {"updated":"YYYY-MM-DD","groups":[{"name":"...","pods":[{"name":"...","apps":["..."]}]}]} (a plain {"pods":[...]} also works)'));
    const ta = document.createElement('textarea'); ta.setAttribute('aria-label', 'Pod list JSON'); ta.spellcheck = false;
    imp.appendChild(ta);
    imp.appendChild(el('div', 'pm-err'));
    const acts = el('div', 'pm-actions');
    const cancel = el('button', null, 'Cancel'); cancel.type = 'button'; cancel.addEventListener('click', closeImport);
    const save = el('button', 'pm-primary', 'Save'); save.type = 'button'; save.addEventListener('click', saveImport);
    acts.appendChild(cancel); acts.appendChild(save); imp.appendChild(acts);
    r.appendChild(imp);

    const b = el('button'); b.id = BTN_ID; b.type = 'button';
    b.setAttribute('aria-haspopup', 'true');
    b.addEventListener('click', ev => {
      if (ev.shiftKey) { copyReport(); return; }
      if (busy) { gen++; busy = false; statusText = ''; lastWarn = 'Cancelled.'; log('cancelled'); render(); return; }
      if (menuOpen) closeMenu(); else openMenu();
    });
    r.appendChild(b);

    const live = el('div'); live.id = LIVE_ID; live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
    r.appendChild(live);
    if (window.__cpodLoaded || document.getElementById('cpod-filter-btn')) {
      r.style.bottom = '72px'; // old single-pod script still installed: stack above it
      lastWarn = 'The old "Commercial pod" userscript is still enabled. Disable it in Tampermonkey.';
      log('old cpod script detected');
    }
    document.body.appendChild(r);
    log('menu added');
    render();
  }

  document.addEventListener('click', e => {
    if (!root() || !e.target.isConnected) return;
    if (!e.target.closest || !e.target.closest('#' + ROOT_ID)) { closeMenu(); closeImport(); }
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !root()) return;
    const wasOpen = menuOpen || ($(IMPORT_ID) && !$(IMPORT_ID).hidden);
    closeMenu(); closeImport();
    if (wasOpen && $(BTN_ID)) $(BTN_ID).focus();
  });

  /* ---------- Keep it alive in the SPA ---------- */
  function sync() {
    try {
      const onList = !!searchBox();
      if (onList) {
        missSince = 0;
        if (!root()) createUI();
        if (!busy && isActive() && sig() !== activeSig) {
          deactivate('The list changed, so the filter was turned off.');
          return;
        }
        if (!busy && !isActive() && document.querySelector('[' + HIDE_ATTR + ']')) clearHidden();
        render();
      } else if (root()) {
        if (!missSince) missSince = Date.now();
        if (Date.now() - missSince > T.missLeave) leaveList();
      }
    } catch (e) {
      console.error(TAG, e);
    }
  }

  const isOurs = n => {
    const e = n && (n.nodeType === 1 ? n : n.parentElement);
    return !!e && !!e.closest('#' + ROOT_ID + ',#' + STYLE_ID);
  };

  let timer = null;
  function start() {
    new MutationObserver(muts => {
      if (muts.every(m => isOurs(m.target))) return;
      clearTimeout(timer);
      timer = setTimeout(sync, T.debounce);
    }).observe(document.documentElement, { childList: true, subtree: true }); // row hiding is an attribute change, not observed
    setInterval(sync, T.heartbeat);
    log('loaded; pod data', podData.updated, dataLabel());
    autoRefresh();
    sync();
  }

  if (document.body) start();
  else addEventListener('DOMContentLoaded', start);
})();