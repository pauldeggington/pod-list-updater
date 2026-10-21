// ==UserScript==
// @name         Feather: Pod filter menu
// @namespace    local.feather.pod-menu
// @version      2.4.4
// @description  Adds a pod menu to the CheckSet task list: filter the Runtime Findings V2 and Individual Apps tasks by POD.
// @match        https://feather.openai.com/*
// @noframes
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @updateURL    https://raw.githubusercontent.com/pauldeggington/pod-list-updater/main/userscript.user.js
// @downloadURL  https://raw.githubusercontent.com/pauldeggington/pod-list-updater/main/userscript.user.js
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  // Run once per page, top window only.
  if (window.top !== window.self) return;
  if (window.__podMenuLoaded) return;
  window.__podMenuLoaded = true;

  const VERSION = '2.4.4';
  const TAG = '[podmenu v' + VERSION + ']';

  /* ======================= Pod data ======================= */
  // Replace the block between the markers to update the built-in lists, or paste newer data in the
  // menu ("Import pod list...") without touching this file. Imported data wins only while its
  // "updated" date is the same as or newer than the built-in date.
  /* POD_DATA_START */
  const BUILTIN_POD_DATA = {
    "updated": "2026-10-21",
    "groups": [
      {
        "name": "Runtime Findings V2",
        "pods": [
          {
            "id": "v2-commercial",
            "name": "Commercial",
            "apps": [
              "Agoda",
              "Aircall",
              "Apartments.com",
              "Clay",
              "Crayon",
              "Customer.io",
              "FullEnrich",
              "Funnel",
              "Gainsight",
              "GetYourGuide",
              "Google Flights",
              "Gorgias",
              "Hootsuite",
              "Loop Returns",
              "Muck Rack",
              "Navan",
              "Oracle OPERA Cloud",
              "Resy",
              "Shopify",
              "Thumbtack",
              "Ticketmaster",
              "Vendoo",
              "Viator",
              "WhatsApp Business",
              "Yelp",
              "Adobe Sign",
              "Ashby",
              "Box",
              "ClickUp",
              "Clio",
              "Confluence",
              "Deel",
              "eFax",
              "FaxUtil",
              "Gmail",
              "Google Drive",
              "Google Sheets",
              "Google Workspace",
              "Gradescope",
              "Ironclad",
              "Lattice",
              "LinkedIn Recruiter",
              "Notion",
              "notion",
              "Outlook",
              "PowerPoint",
              "powerpoint",
              "Signal",
              "Slack",
              "Slack Web",
              "AutoCAD Web",
              "Autodesk Maya",
              "clo3d-website",
              "ESPN",
              "frame",
              "Milanote",
              "nuke-desktop",
              "rl-sketchup",
              "shotgrid",
              "Style3D",
              "Unity"
            ]
          },
          {
            "id": "v2-creative",
            "name": "Creative & Design",
            "apps": [
              "AutoCAD Web",
              "Autodesk Maya",
              "clo3d-website",
              "ESPN",
              "frame",
              "Milanote",
              "nuke-desktop",
              "rl-sketchup",
              "shotgrid",
              "Style3D",
              "Unity",
              "Adobe Sign",
              "Ashby",
              "Box",
              "ClickUp",
              "Clio",
              "Confluence",
              "Deel",
              "eFax",
              "FaxUtil",
              "Gmail",
              "Google Drive",
              "Google Sheets",
              "Google Workspace",
              "Gradescope",
              "Ironclad",
              "Lattice",
              "LinkedIn Recruiter",
              "Notion",
              "notion",
              "Outlook",
              "PowerPoint",
              "powerpoint",
              "Signal",
              "Slack",
              "Slack Web"
            ]
          },
          {
            "id": "v2-engineering",
            "name": "Engineering & Data",
            "apps": [
              "arXiv",
              "AWS",
              "azure-monitor",
              "Bastion",
              "BigQuery",
              "Coop",
              "cursor-website",
              "cypress-website",
              "Datadog Logs, Metrics & Monitors",
              "datadog-apm",
              "datadog-logs",
              "datadog-metrics-monitors",
              "Looker BI",
              "metabase-website",
              "mixpanel",
              "mlflow",
              "mlflow3",
              "ms-azure-devops",
              "n8n",
              "NX Witness",
              "OneTrust",
              "onetrust-website",
              "Sentry",
              "servicenow",
              "Snowflake",
              "splunk",
              "Tableau",
              "vertex-ai",
              "vs-code-website",
              "Google Workspace"
            ]
          },
          {
            "id": "v2-finance",
            "name": "Finance & Markets",
            "apps": [
              "American Express",
              "Anaplan",
              "Bank of Harbor",
              "bloomberg",
              "Bloomberg Terminal",
              "Crunchbase",
              "ExpertNetwork",
              "FactSet",
              "Finance LH",
              "FLG",
              "FraudLabs",
              "IBISWorld",
              "LSEG",
              "Moody's",
              "NetSuite",
              "Odoo",
              "odoo-website",
              "Oracle EPM",
              "PayU",
              "pitchbook-web",
              "plaid",
              "ProjectionLab",
              "QuickBooks",
              "QuickBooks Angular",
              "Razorpay",
              "Razorpay (RL)",
              "redtail-website",
              "Sage",
              "SignalDesk",
              "statista-website",
              "Stripe",
              "TallyPrime",
              "TradingView",
              "zip-procurement",
              "Google Workspace"
            ]
          },
          {
            "id": "v2-healthcare",
            "name": "Healthcare",
            "apps": [
              "COROS",
              "covermymeds",
              "health-equity",
              "Lifeline",
              "Meditech Inpatient",
              "Mindbody",
              "mychart-epic-website",
              "pacs-dicom",
              "photon-health",
              "powerbi-multi-rl-clinical-ops-administration",
              "Stedi",
              "Strava",
              "zocdoc-website",
              "Adobe Sign",
              "Ashby",
              "Box",
              "ClickUp",
              "Clio",
              "Confluence",
              "Deel",
              "eFax",
              "FaxUtil",
              "Gmail",
              "Google Drive",
              "Google Sheets",
              "Google Workspace",
              "Gradescope",
              "Ironclad",
              "Lattice",
              "LinkedIn Recruiter",
              "Notion",
              "notion",
              "Outlook",
              "PowerPoint",
              "powerpoint",
              "Signal",
              "Slack",
              "Slack Web"
            ]
          },
          {
            "id": "v2-productivity",
            "name": "Productivity",
            "apps": [
              "Adobe Sign",
              "Ashby",
              "Box",
              "ClickUp",
              "Clio",
              "Confluence",
              "Deel",
              "eFax",
              "FaxUtil",
              "Gmail",
              "Google Drive",
              "Google Sheets",
              "Google Workspace",
              "Gradescope",
              "Ironclad",
              "Lattice",
              "LinkedIn Recruiter",
              "Notion",
              "notion",
              "Outlook",
              "PowerPoint",
              "powerpoint",
              "Signal",
              "Slack",
              "Slack Web",
              "Agoda",
              "Aircall",
              "Apartments.com",
              "Clay",
              "Crayon",
              "Customer.io",
              "FullEnrich",
              "Funnel",
              "Gainsight",
              "GetYourGuide",
              "Google Flights",
              "Gorgias",
              "Hootsuite",
              "Loop Returns",
              "Muck Rack",
              "Navan",
              "Oracle OPERA Cloud",
              "Resy",
              "Shopify",
              "Thumbtack",
              "Ticketmaster",
              "Vendoo",
              "Viator",
              "WhatsApp Business",
              "Yelp",
              "AutoCAD Web",
              "Autodesk Maya",
              "clo3d-website",
              "ESPN",
              "frame",
              "Milanote",
              "nuke-desktop",
              "rl-sketchup",
              "shotgrid",
              "Style3D",
              "Unity"
            ]
          }
        ]
      },
      {
        "name": "Individual apps",
        "pods": [
          {
            "id": "ia-commercial",
            "name": "Commercial",
            "apps": [
              "Ahrefs Site Explorer",
              "Amazon Ads Campaign Manager",
              "AWeber",
              "Constant Contact",
              "ConvertKit",
              "eBay Seller Hub",
              "Getfly CRM",
              "GetResponse",
              "Google Analytics",
              "Google Trends",
              "HoneyBook",
              "Instantly",
              "Kommo CRM",
              "LinkedIn Campaign Manager",
              "Pipedrive",
              "Salesforce"
            ]
          },
          {
            "id": "ia-creative",
            "name": "Creative",
            "apps": [
              "Miro",
              "Scrivener",
              "SoundCloud"
            ]
          },
          {
            "id": "ia-engineering",
            "name": "Engineering",
            "apps": [
              "SQL Server Management Studio"
            ]
          },
          {
            "id": "ia-finance",
            "name": "Finance",
            "apps": [
              "Acumatica ERP",
              "FreshBooks",
              "Oracle JD Edwards EnterpriseOne",
              "Payoneer",
              "PayPal",
              "SAP Business One",
              "YNAB"
            ]
          },
          {
            "id": "ia-healthcare",
            "name": "Healthcare",
            "apps": [
              "DocuWare",
              "ERPNext",
              "Foxit PDF Editor",
              "Jotform",
              "LimeSurvey"
            ]
          },
          {
            "id": "ia-productivity",
            "name": "Productivity",
            "apps": [
              "Domo",
              "Ironclad",
              "LibreOffice Calc",
              "Medium",
              "Microsoft Loop",
              "Microsoft Planner",
              "Microsoft Whiteboard",
              "Notepad",
              "Odoo",
              "Typeform",
              "Viber"
            ]
          }
        ]
      }
    ]
  };
  /* POD_DATA_END */

  // Lists of your own that site refreshes never touch. Same shape as a pod; shown as a last group.
  const EXTRA_PODS = [];

  /* ======================= Settings ======================= */
  const DEFAULT_SETTINGS = { useLatestTag: true, extraPages: 1, dock: true, untilFound: true, needOwner: true }; // changeable in the menu
  const MAX_EXTRA_PAGES = 3;
  const AUTO_MAX_PAGES = 10; // ceiling for "keep loading until the pod's apps are found"
  const LS_SETTINGS = 'podmenu.settings.v1';
  const LS_PODS = 'podmenu.podData.v1';
  const LS_LAST = 'podmenu.last.v1';

  const POD_COLORS = {
    commercial: '#4f7cf0', creative: '#a56bd0', engineering: '#33a583',
    finance: '#d19a3a', healthcare: '#d4616f', productivity: '#7d8da3'
  };
  const colorFor = name => POD_COLORS[key(String(name).split(/&|\band\b/)[0])] || null;

  /* ======================= Timings (ms) ======================= */
  const T = {
    poll: 250, tagPoll: 500, tagApply: 4000, refetchStart: 4000, settle: 1500,
    rowsWait: 15000, moreWait: 10000, moreGap: 3000, cooldown: 15000, debounce: 250,
    heartbeat: 2000, missLeave: 2500
  };

  /* ======================= Internals ======================= */
  const ROOT_ID = 'pm-root', BTN_ID = 'pm-btn', MENU_ID = 'pm-menu', IMPORT_ID = 'pm-import';
  const LIVE_ID = 'pm-live', STYLE_ID = 'pm-style', HIDE_ATTR = 'data-pm-hidden', ERR_ID = 'pm-err';
  const LINK_SEL = 'a[href*="/tasks/"]';
  const SEP = '[-\\u2010-\\u2015\\u2212:|\\u00B7\\u2022]';
  const SUFFIX_RE = /\s*[-–—:|]*\s*runtime[\s-]*quality[\s-]*review\b.*$/i;
  const IQC_RE = new RegExp('\\s*(?:' + SEP + '+\\s*)?individual\\s*qc\\b.*$', 'i');
  const TASKDATE_RE = new RegExp('\\s*' + SEP + '\\s*(?:task(?![a-z])|uploaded\\b|\\d{4}-\\d{2}-\\d{2}\\b).*$', 'i');

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
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };

  // "Google Trends", "google-trends" and "Google Trends  " all become "googletrends".
  const key = s => String(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
  // "hootsuite · Task 2" and "Jotform · 2026-09-18" are extra task links for the same app.
  const cleanApp = s => String(s).replace(/\s+/g, ' ')
    .replace(/\s*[·•|]\s*(task\s*\d+|\d{4}-\d{2}-\d{2})\s*$/i, '').trim();
  const stripTitle = text => String(text).replace(/\s+/g, ' ')
    .replace(IQC_RE, '').replace(SUFFIX_RE, '').replace(TASKDATE_RE, '')
    .replace(/\s*[(\[]\s*\d{4}-\d{2}-\d{2}\s*[)\]]\s*$/, '')
    .replace(/\s+task\s+[a-z0-9]{1,3}\s*$/i, '').trim();
  const appKey = text => key(stripTitle(text));

  class Fail extends Error {}
  class Cancelled extends Error {}
  class RateLimited extends Error {}

  /* ---------- Pod data parsing ---------- */
  function cleanJson(s) {
    s = String(s).replace(/^﻿/, '').trim();
    if (!s) throw new Error('Paste the pod list JSON first');
    const f = s.match(/```[a-z]*\s*([\s\S]*?)```/i);
    if (f) s = f[1].trim();
    const i = s.search(/[\[{]/), j = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
    if (i < 0 || j < i) throw new Error('No JSON found in the pasted text');
    s = s.slice(i, j + 1).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/,\s*([}\]])/g, '$1');
    try { return JSON.parse(s); } catch (e) { throw new Error('Not valid JSON: ' + e.message); }
  }

  // dflt = the "updated" value to use when the data has none.
  function parsePodData(raw, dflt) {
    let d = typeof raw === 'string' ? cleanJson(raw) : raw;
    if (Array.isArray(d)) d = { pods: d };
    if (!d || typeof d !== 'object') throw new Error('Expected a JSON object');
    if (typeof d.updated !== 'string') d.updated = dflt != null ? dflt : new Date().toISOString().slice(0, 10);
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
        if (!Array.isArray(p.apps)) throw new Error('Pod "' + p.name + '" needs an "apps" list');
        p.apps = p.apps.map(a => (a && typeof a === 'object') ? (a.name || a.app || a.title) : a)
          .filter(a => (typeof a === 'string' && a.trim()) || typeof a === 'number').map(String);
        if (!p.apps.length) throw new Error('Pod "' + p.name + '" needs a non-empty "apps" list');
        if (++n > 200) throw new Error('Too many pods (max 200)');
      });
    });
    if (!n) throw new Error('No pods found');
    return d;
  }

  const EXTRA_OK = EXTRA_PODS.filter(p => p && typeof p.name === 'string' && Array.isArray(p.apps) && p.apps.length);

  function buildPods(data) {
    const seen = new Set();
    const out = [];
    const groups = EXTRA_OK.length ? data.groups.concat([{ name: 'My lists', pods: EXTRA_OK }]) : data.groups;
    groups.forEach((g, gi) => {
      g.pods.forEach(p => {
        let id = String(p.id || key(p.name) || 'pod').replace(/\|/g, '-');
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
  let imported = false, staleNote = '';
  try {
    const raw = store.get(LS_PODS);
    if (raw) {
      const d = parsePodData(raw, ''); // undated old data counts as the oldest
      if (d.updated >= BUILTIN_POD_DATA.updated) { podData = d; imported = true; }
      else {
        store.del(LS_PODS);
        staleNote = 'Your imported list (' + (d.updated || 'undated') + ') was older than the built-in one (' + BUILTIN_POD_DATA.updated + '), so the built-in list is in use.';
      }
    }
  } catch (e) { store.del(LS_PODS); }
  // Auto-update: pods.json in the GitHub repo is refreshed by the daily task; the script re-reads it every few hours.
  // A list imported by hand always wins over the auto-updated one.
  const AUTO_URL = 'https://raw.githubusercontent.com/pauldeggington/pod-list-updater/main/pods.json';
  const AUTO_EVERY_MS = 2 * 60 * 60 * 1000;
  const LS_AUTO = 'podmenu.auto.v1', LS_AUTO_AT = 'podmenu.autoAt.v1';
  let autoData = null;
  try {
    const rawAuto = store.get(LS_AUTO);
    if (rawAuto) {
      const d = parsePodData(rawAuto, '');
      if (String(d.updated) >= String(BUILTIN_POD_DATA.updated)) autoData = d;
    }
  } catch (e) { store.del(LS_AUTO); }
  if (!imported && autoData) podData = autoData;
  const usingAuto = () => !imported && !!autoData && podData === autoData;
  const dataLabel = () => imported ? ' (imported)' : (usingAuto() ? ' (auto)' : ' (built in)');
  let pods = buildPods(podData);

  function applyAuto(text) {
    const d = parsePodData(text, '');
    store.set(LS_AUTO, JSON.stringify(d)); store.set(LS_AUTO_AT, String(Date.now()));
    autoData = d;
    if (!imported) { podData = d; rebuildPods(); }
    log('auto-updated pod data', d.updated);
  }
  function autoRefresh() {
    if ((parseInt(store.get(LS_AUTO_AT), 10) || 0) + AUTO_EVERY_MS > Date.now()) return;
    const url = AUTO_URL + '?t=' + Math.floor(Date.now() / 600000); // dodge long caches, at most once per 10 min
    const fail = m => log('auto-update failed:', m);
    if (typeof GM_xmlhttpRequest === 'function') {
      GM_xmlhttpRequest({
        method: 'GET', url: url, timeout: 20000,
        onload: r => { try { if (r.status < 200 || r.status >= 300) throw new Error('HTTP ' + r.status); applyAuto(r.responseText); } catch (e) { fail(e.message); } },
        onerror: () => fail('network error'), ontimeout: () => fail('timed out')
      });
    } else if (typeof fetch === 'function') {
      fetch(url, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
        .then(applyAuto).catch(e => fail(e.message));
    }
  }

  const settings = Object.assign({}, DEFAULT_SETTINGS);
  try {
    const s = JSON.parse(store.get(LS_SETTINGS) || '{}');
    if (typeof s.useLatestTag === 'boolean') settings.useLatestTag = s.useLatestTag;
    if (typeof s.dock === 'boolean') settings.dock = s.dock;
    if (typeof s.untilFound === 'boolean') settings.untilFound = s.untilFound;
    if (typeof s.needOwner === 'boolean') settings.needOwner = s.needOwner;
    if (Number.isInteger(s.extraPages) && s.extraPages >= 0) settings.extraPages = Math.min(s.extraPages, MAX_EXTRA_PAGES);
  } catch (e) { /* use defaults */ }
  const saveSettings = () => store.set(LS_SETTINGS, JSON.stringify(settings));

  let activePodId = null;  // pod id, or several joined by '|' (a union), or null = filter off
  let busy = false;
  let gen = 0;             // bumps to cancel an in-flight flow
  let menuOpen = false;
  let lastError = '', lastWarn = staleNote, statusText = '';
  let cooldownUntil = 0, activeSig = '', loadedSig = '', loadedRows = 0, loadedPages = 0, missSince = 0, lastMoreAt = 0;
  let flashText = '', flashUntil = 0;

  const activeIds = () => (activePodId ? activePodId.split('|') : []);
  let apCache = { id: null, pods: null, val: null };
  function activePod() { // one pod, or the merged union of several
    if (apCache.id === activePodId && apCache.pods === pods) return apCache.val;
    const ps = activeIds().map(i => pods.find(p => p.id === i)).filter(Boolean);
    let v = null;
    if (ps.length === 1) v = ps[0];
    else if (ps.length > 1) {
      const apps = [];
      ps.forEach(p => p.apps.forEach(a => { if (!apps.some(b => key(b) === key(a))) apps.push(a); }));
      v = { id: activePodId, name: ps.map(p => (p.groupIndex > 0 ? p.group + ' · ' : '') + p.name).join(' + '),
        group: '', groupIndex: 0, apps: apps, keys: new Set(apps.map(key)) };
    }
    apCache = { id: activePodId, pods: pods, val: v };
    return v;
  }
  const isActive = () => !!activePod();
  const saveLast = () => { if (activePodId) store.set(LS_LAST, activePodId); };
  function lastPod() { // remembered selection, if every pod in it still exists
    const ids = (store.get(LS_LAST) || '').split('|').filter(Boolean);
    const ps = ids.map(i => pods.find(p => p.id === i));
    if (!ps.length || ps.some(p => !p) || ids.join('|') === activePodId) return null;
    return { id: ids.join('|'), name: ps.map(p => p.name).join(' + ') };
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const mouseInit = { bubbles: true, cancelable: true, view: window };
  const $ = id => document.getElementById(id);
  const root = () => $(ROOT_ID);
  const isOurs = n => {
    const e = n && (n.nodeType === 1 ? n : n.parentElement);
    return !!e && !!e.closest('#' + ROOT_ID + ',#' + STYLE_ID);
  };

  /* ---------- DOM helpers (all selectors live here) ---------- */
  const searchBox = () =>
    document.querySelector('input[placeholder*="Search by tag" i]') ||
    document.querySelector('input[placeholder*="tag" i][placeholder*="task" i]');
  const taskRows = () =>
    [...document.querySelectorAll('[role=row]')].filter(r => r.querySelector(LINK_SEL));
  const rowCount = () => taskRows().length;
  const firstHref = () => {
    const r = taskRows()[0];
    const a = r && r.querySelector(LINK_SEL);
    return a ? a.getAttribute('href') : '';
  };

  // One pass over the rows, with the app key cached per link element (recomputed only if its text changes).
  const keyCache = new WeakMap();
  // Column of "Previous Stage Owner" (-1 if the table has no such column).
  function ownerCol(row) {
    let box = row.parentElement, head = [];
    for (let i = 0; box && i < 8 && !head.length; i++, box = box.parentElement) {
      head = [...box.querySelectorAll('[role=columnheader]')];
    }
    if (!head.length) return -1;
    return head.findIndex(h => /previous\s*stage\s*owner/i.test(h.textContent));
  }
  function hasOwner(row, col) {
    if (col < 0) return true; // unknown layout: do not hide anything
    const cell = row.querySelectorAll('[role=gridcell],[role=cell]')[col];
    if (!cell) return true;
    const t = cell.textContent.replace(/\s+/g, ' ').trim();
    return t !== '' && !/^(none|n\/a|-|—|–|unassigned)$/i.test(t);
  }
  function snapshot() {
    const out = [];
    let col = null;
    document.querySelectorAll('[role=row]').forEach(row => {
      const a = row.querySelector(LINK_SEL);
      if (!a) return;
      if (col === null) col = ownerCol(row);
      const t = a.textContent;
      let c = keyCache.get(a);
      if (!c || c.t !== t) { c = { t: t, k: appKey(t) }; keyCache.set(a, c); }
      out.push({ row: row, title: t, k: c.k, noOwner: settings.needOwner && !hasOwner(row, col) });
    });
    return out;
  }

  // Rate limit: watch only nodes added while a flow runs, so old toasts and task titles are ignored.
  let rlHit = false;
  const RL_RE = /too many requests/i;
  const rlObserver = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'characterData') {
        if (!isOurs(m.target) && RL_RE.test(m.target.nodeValue || '')) { rlHit = true; return; }
        continue;
      }
      for (const n of m.addedNodes) {
        if ((n.nodeType !== 1 && n.nodeType !== 3) || isOurs(n)) continue;
        const el = n.nodeType === 1 ? n : n.parentElement;
        if (el && el.closest && el.closest('[role=row]')) continue; // task titles are not toasts
        const t = n.textContent;
        if (t && t.length < 3000 && RL_RE.test(t)) { rlHit = true; return; }
      }
    }
  });
  // Outside a run, a toast from the user's own "Load more" click only produces a hint (the filter stays on).
  new MutationObserver(muts => {
    if (busy || !activePodId) return;
    for (const m of muts) for (const n of m.addedNodes) {
      if (n.nodeType !== 1 || isOurs(n) || (n.closest && n.closest('[role=row]'))) continue;
      const t = n.textContent;
      if (t && t.length < 500 && RL_RE.test(t)) {
        lastWarn = 'Feather said "Too many requests". Wait a few seconds before loading more.';
        setTimeout(() => { if (lastWarn.indexOf('Too many') > -1) { lastWarn = ''; render(); } }, 8000);
        render(); return;
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
  function watchRateLimit(on) {
    rlObserver.disconnect(); rlHit = false;
    if (on) rlObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  const rateLimited = () => rlHit;

  function loadMoreBtn() {
    const isMore = b => /^\s*load\s*more/i.test(b.textContent) && !b.disabled &&
      b.getAttribute('aria-disabled') !== 'true' && !b.closest('[role=dialog],[hidden],[aria-hidden=true]');
    const rows = taskRows();
    if (rows.length) {
      const scope = rows[0].closest('[role=table],[role=grid]') || rows[0].parentElement;
      const rt = scope && scope.parentElement;
      const hit = rt && [...rt.querySelectorAll('button')].find(isMore);
      if (hit) return hit;
    }
    return [...document.querySelectorAll('button')].find(isMore);
  }

  // The "latest" tag chip may hold a remove button, and its text may carry a count.
  const ownText = e => [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.nodeValue).join(' ').replace(/\s+/g, ' ').trim();
  const LATEST_RE = /^latest(\s*[(\[]\s*\d[\d,]*\s*[)\]]|\s+\d[\d,]*)?$/i;
  const spacedText = e => {
    const out = [], w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) out.push(n.nodeValue);
    return out.join(' ').replace(/\s+/g, ' ').trim();
  };

  function hasLatestTag() {
    const inp = searchBox();
    const box = inp && inp.parentElement && inp.parentElement.parentElement;
    if (!box) return false;
    return [...box.querySelectorAll('*')].some(e =>
      LATEST_RE.test(ownText(e).replace(/(\s+x|\s*[×✕✖])$/i, '')) &&
      !e.closest('li,[role=listbox],[role=option],[role=row],[role=table],[role=grid],#' + ROOT_ID));
  }

  const optionRoot = inp => {
    const id = inp.getAttribute('aria-controls');
    return (id && document.getElementById(id)) || document;
  };
  const optionsOf = inp => {
    const own = [...optionRoot(inp).querySelectorAll('[role=option]')];
    return own.length ? own : [...document.querySelectorAll('[role=option]')];
  };
  const latestOption = inp => optionsOf(inp).find(e => LATEST_RE.test(spacedText(e)));
  const listboxOpen = inp => {
    const ex = inp.getAttribute('aria-expanded');
    return ex === 'true' || (ex === null && optionsOf(inp).length > 0);
  };

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
    if (run !== gen) throw new Cancelled();
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

  function applyFilter(snap) {
    const pod = activePod();
    snap = snap || snapshot();
    let matched = 0;
    snap.forEach(x => {
      const isMatch = !!pod && !x.noOwner && pod.keys.has(x.k);
      if (isMatch) matched++;
      const hide = !!pod && !isMatch;
      if (x.row.hasAttribute(HIDE_ATTR) !== hide) {
        if (hide) x.row.setAttribute(HIDE_ATTR, ''); else x.row.removeAttribute(HIDE_ATTR);
      }
    });
    return { matched: matched, total: snap.length };
  }

  function unseenApps(pod, snap) {
    const k = new Set((snap || snapshot()).filter(x => !x.noOwner).map(x => x.k));
    return pod.apps.filter(a => !k.has(key(a)));
  }

  function podCounts(snap) {
    snap = snap || snapshot();
    const counts = Object.create(null);
    pods.forEach(p => { counts[p.id] = 0; });
    const names = [];
    snap.forEach(x => {
      if (x.noOwner) return;
      let any = false;
      pods.forEach(p => { if (p.keys.has(x.k)) { counts[p.id]++; any = true; } });
      if (!any) {
        const n = stripTitle(x.title) || x.title.trim();
        if (names.indexOf(n) < 0) names.push(n);
      }
    });
    return { counts: counts, total: snap.length, unassigned: names };
  }

  /* ---------- Click flow ---------- */
  async function ensureLatestTag(run) {
    const inp = searchBox();
    if (!inp) throw new Fail('Tag search box not found');
    if (hasLatestTag()) return;
    const h0 = firstHref();
    let opens = 0;
    for (let i = 0; i < 24 && !latestOption(inp); i++) {
      if (i % 3 === 0 && opens < 4 && !listboxOpen(inp)) { openDropdown(inp); opens++; }
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

  async function loadMore(run, pages) {
    for (let i = 0; i < pages; i++) {
      if (!loadMoreBtn()) { log('no Load more button'); return; }
      const gap = lastMoreAt + T.moreGap - Date.now();
      if (gap > 0) await pause(gap, run); // never click twice in quick succession
      const b = loadMoreBtn();
      if (!b) { log('no Load more button'); return; }
      const before = rowCount();
      lastMoreAt = Date.now();
      b.click();
      let goneSince = 0;
      const ok = await waitFor(() => {
        if (rowCount() > before) return true;
        if (!loadMoreBtn()) { // last page was exactly full: the button just disappears
          if (!goneSince) goneSince = Date.now();
          return Date.now() - goneSince > T.settle * 2;
        }
        goneSince = 0;
        return false;
      }, T.moreWait, run);
      if (!ok) { lastWarn = 'Load more did not respond.'; log(lastWarn); return; }
      if (rowCount() <= before) { log('last page reached'); return; }
      await pause(T.settle, run);
    }
  }

  function setStatus(t) { statusText = t; render(); }

  function failWith(e) {
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
  }

  function inCooldown() {
    const wait = cooldownUntil - Date.now();
    if (wait <= 0) return false;
    lastError = 'Rate limited, wait ' + Math.ceil(wait / 1000) + 's';
    render();
    return true;
  }

  async function startFlow(podId) {
    if (inCooldown()) return;
    const run = ++gen;
    busy = true; lastError = ''; lastWarn = '';
    watchRateLimit(true);
    setStatus('Working: preparing...');
    try {
      if (!podId.split('|').every(i => pods.some(p => p.id === i))) throw new Fail('That pod is no longer in the list');
      if (settings.useLatestTag) { setStatus('Working: tag...'); await ensureLatestTag(run); }
      setStatus('Working: loading list...');
      if (!(await waitFor(() => rowCount() > 0, T.rowsWait, run))) {
        throw new Fail('No rows loaded (none match, or timed out)');
      }
      const same = loadedSig === sig() && rowCount() >= loadedRows; // same list as when we last loaded pages
      const have = same ? loadedPages : 0;
      const need = settings.extraPages - have;
      if (need > 0) {
        setStatus('Working: loading more...');
        const rowsBefore = rowCount();
        let limited = false;
        try { await loadMore(run, need); }
        catch (e) {
          if (!(e instanceof RateLimited)) throw e;
          limited = true; // the pages already loaded are still usable
          cooldownUntil = Date.now() + T.cooldown;
          lastWarn = 'Rate limited while loading more; showing what is loaded.';
        }
        if (run !== gen) throw new Cancelled();
        loadedSig = sig(); loadedRows = rowCount();
        loadedPages = limited ? have + (rowCount() > rowsBefore ? 1 : 0) : have + need;
      }
      if (run !== gen) throw new Cancelled();
      if (settings.untilFound && Date.now() >= cooldownUntil) { // pod tasks are spread over many pages: keep paging, politely, until each app has a task
        const keep = activePodId; activePodId = podId; const pod = activePod(); activePodId = keep;
        let done = loadedSig === sig() ? loadedPages : 0;
        while (pod && done < AUTO_MAX_PAGES && loadMoreBtn()) {
          const miss = unseenApps(pod, snapshot()).length;
          if (!miss) break;
          setStatus('Working: page ' + (done + 2) + ', ' + (pod.apps.length - miss) + '/' + pod.apps.length + ' apps found (click to stop)');
          const before = rowCount();
          try { await loadMore(run, 1); }
          catch (e) {
            if (!(e instanceof RateLimited)) throw e;
            cooldownUntil = Date.now() + T.cooldown;
            lastWarn = 'Rate limited while loading more; showing what is loaded.';
            break;
          }
          if (run !== gen) throw new Cancelled();
          if (rowCount() <= before) break;
          done++; loadedSig = sig(); loadedRows = rowCount(); loadedPages = done;
        }
        if (pod && done >= AUTO_MAX_PAGES && loadMoreBtn() && unseenApps(pod, snapshot()).length)
          lastWarn = 'Stopped after ' + (AUTO_MAX_PAGES + 1) + ' pages; some apps have no task in what is loaded.';
      }
      if (run !== gen) throw new Cancelled();
      activePodId = podId;
      activeSig = sig();
      saveLast();
      const inp = searchBox();
      if (inp && inp.value && inp.value.trim()) lastWarn = 'Search box has text, which may narrow the results.';
      log('filter on:', podId, '-', rowCount(), 'rows loaded');
    } catch (e) {
      if (run !== gen || e instanceof Cancelled) return;
      failWith(e);
    } finally {
      if (run === gen) { busy = false; watchRateLimit(false); }
      if (root()) render();
    }
  }

  // Menu action: load exactly one more page, politely.
  async function loadOnePage() {
    closeMenu();
    if (busy) return;
    if (!loadMoreBtn()) { lastWarn = 'No Load more button: all rows are loaded.'; render(); return; }
    if (inCooldown()) return;
    const run = ++gen;
    busy = true; lastError = ''; lastWarn = '';
    watchRateLimit(true);
    setStatus('Working: loading more...');
    try {
      await loadMore(run, 1);
      if (run !== gen) throw new Cancelled();
      loadedRows = rowCount();
    } catch (e) {
      if (run !== gen || e instanceof Cancelled) return;
      failWith(e);
    } finally {
      if (run === gen) { busy = false; watchRateLimit(false); }
      if (root()) render();
    }
  }

  function focusBtn() { const b = $(BTN_ID); if (b) b.focus(); }

  // add = shift/ctrl/cmd-click: toggle this pod in a union. id may be a '|' joined list (the "Last" item).
  function choosePod(id, add) {
    if (!add) { closeMenu(); focusBtn(); }
    if (busy) return;
    if (id === null) { deactivate(); return; }
    if (isActive()) { // no network needed to change which pods show
      let ids = add ? activeIds() : [];
      ids = ids.indexOf(id) >= 0 ? ids.filter(x => x !== id) : ids.concat(id);
      if (!ids.length) { deactivate(); return; }
      activePodId = ids.join('|'); saveLast(); lastWarn = ''; log('pods:', activePodId); render();
      return;
    }
    startFlow(id);
  }

  function deactivate(msg) {
    activePodId = null;
    clearHidden();
    lastError = '';
    lastWarn = msg || '';
    log('filter off', msg || '');
    render();
  }

  function leaveList() {
    gen++; busy = false; activePodId = null; menuOpen = false;
    lastError = ''; lastWarn = ''; statusText = ''; missSince = 0; loadedSig = ''; loadedRows = 0; loadedPages = 0;
    watchRateLimit(false);
    clearHidden();
    const r = root(); if (r) r.remove();
    log('left the task list');
  }

  /* ---------- Copy helpers ---------- */
  function flash(text) {
    flashText = text; flashUntil = Date.now() + 2000;
    render();
    setTimeout(render, 2100);
  }

  async function copyText(text, okMsg) {
    try { await navigator.clipboard.writeText(text); flash(okMsg); }
    catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { /* ignore */ }
      ta.remove();
      flash(ok ? okMsg : 'Copy failed, see console');
    }
  }

  function buildReport() {
    const pod = activePod();
    const snap = snapshot();
    const pc = podCounts(snap);
    return JSON.stringify({
      version: VERSION, url: location.href, searchBox: !!searchBox(), latestTag: hasLatestTag(),
      settings: settings, podDataUpdated: podData.updated, podDataImported: imported, podDataAuto: usingAuto(),
      podIds: pods.map(p => p.id),
      sampleTitles: snap.slice(0, 5).map(x => x.title.trim()),
      activePod: activePodId, rows: snap.length,
      matched: pod ? snap.filter(x => pod.keys.has(x.k)).length : null,
      busy: busy, loadMoreFound: !!loadMoreBtn(), lastError: lastError, lastWarn: lastWarn,
      activePodAppsNotLoaded: pod ? unseenApps(pod, snap) : null,
      perPodLoaded: pc.counts,
      inNoPod: pc.unassigned,
      log: logs.slice(-25)
    }, null, 2);
  }

  async function copyReport() {
    const text = buildReport();
    console.info(TAG, 'report', text);
    copyText(text, 'Report copied');
  }

  /* ---------- UI ---------- */
  const CSS =
    '[' + HIDE_ATTR + ']{display:none!important}' +
    '#pm-root{position:fixed;left:20px;bottom:20px;z-index:2147483000;font:14px/1.3 system-ui,sans-serif;color:#fff}' +
    '#pm-root.pm-docked{position:relative;left:auto;bottom:auto;margin:8px;display:block}' +
    '#pm-root.pm-docked #pm-menu,#pm-root.pm-docked #pm-import{bottom:auto;top:calc(100% + 8px)}' +
    '#pm-btn{max-width:min(380px,calc(100vw - 40px));padding:10px 16px;border-radius:999px;border:2px solid transparent;' +
      'background:#0b7a5e;color:#fff;font:600 14px/1.2 system-ui,sans-serif;cursor:pointer;white-space:nowrap;' +
      'overflow:hidden;text-overflow:ellipsis;box-shadow:0 2px 10px rgba(0,0,0,.4)}' +
    '#pm-btn[data-state=off]::after{content:" \\25BE"}' +
    '#pm-btn:hover{filter:brightness(1.12)}' +
    '#pm-root button:focus-visible,#pm-root select:focus-visible,#pm-root input:focus-visible,#pm-root textarea:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '#pm-btn:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 7px #1b2530}' +
    '#pm-btn[data-state=on]{background:#1b2530;border-color:#2fd5a6}' +
    '#pm-btn[data-state=error]{background:#b3261e}' +
    '#pm-btn[data-state=busy]{opacity:.85;cursor:progress}' +
    '#pm-menu,#pm-import{position:absolute;left:0;bottom:calc(100% + 8px);width:340px;max-width:calc(100vw - 40px);' +
      'max-height:70vh;overflow:auto;box-sizing:border-box;background:#1b2530;border:1px solid #3a4756;border-radius:12px;' +
      'box-shadow:0 6px 24px rgba(0,0,0,.5);padding:8px}' +
    '#pm-menu[hidden],#pm-import[hidden]{display:none}' +
    '.pm-head{padding:6px 8px;font-weight:700;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:#9fb0c3}' +
    '.pm-item{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;' +
      'color:#fff;text-align:left;cursor:pointer;font:inherit}' +
    '.pm-item:hover{background:#273445}.pm-item[aria-checked=true]{background:#17392f}' +
    '.pm-item[aria-checked=true] .pm-name::after{content:" \\2713"}' +
    '.pm-dot{flex:none;width:10px;height:10px;border-radius:50%;background:#7d8da3}' +
    '.pm-name{flex:1;min-width:0;font-weight:600}.pm-meta{flex:none;white-space:nowrap;font-size:12px;color:#9fb0c3}' +
    '.pm-sep{height:1px;margin:8px 0;background:#3a4756}' +
    '.pm-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 8px;font-size:13px;color:#dbe4ee}' +
    '.pm-row select{background:#273445;color:#fff;border:1px solid #3a4756;border-radius:6px;padding:2px 4px}' +
    '.pm-link{border:0;background:transparent;color:#7fd8bd;cursor:pointer;font:inherit;padding:4px 8px;text-decoration:underline}' +
    '.pm-note{padding:4px 8px;font-size:12px;color:#9fb0c3;overflow-wrap:anywhere}' +
    '.pm-note[title]{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}' +
    '#pm-import textarea{width:100%;height:170px;box-sizing:border-box;background:#0f1720;color:#dbe4ee;border:1px solid #3a4756;' +
      'border-radius:8px;padding:8px;font:12px/1.4 ui-monospace,monospace}' +
    '.pm-err{color:#ff9b93;font-size:12px;padding:4px 0;min-height:16px}' +
    '.pm-actions{display:flex;gap:8px;justify-content:flex-end}' +
    '.pm-actions button{padding:6px 12px;border-radius:8px;border:1px solid #3a4756;background:#273445;color:#fff;cursor:pointer;font:inherit}' +
    '.pm-actions button.pm-primary{background:#0b7a5e;border-color:#0b7a5e}' +
    '#pm-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '@media (forced-colors:active){#pm-btn{border:2px solid ButtonText}' +
      '.pm-item[aria-checked=true]{outline:2px solid Highlight;outline-offset:-2px}.pm-dot{forced-color-adjust:none}}';

  // Styles go in a <style> element; if the page's CSP blocks it, fall back to a constructable stylesheet.
  let cssMode = 'style', pmSheet = null;
  function ensureStyle() {
    const st = $(STYLE_ID);
    if (cssMode === 'style') {
      if (st && st.isConnected && st.sheet) return;
      if (st) st.remove();
      const n = document.createElement('style');
      n.id = STYLE_ID; n.textContent = CSS;
      (document.head || document.documentElement).appendChild(n);
      if (n.sheet) return; // null when the CSP blocked it
      n.remove(); cssMode = 'adopted';
      log('style element blocked, using adoptedStyleSheets');
    }
    try {
      if (!pmSheet) { pmSheet = new CSSStyleSheet(); pmSheet.replaceSync(CSS); }
      if (!document.adoptedStyleSheets.includes(pmSheet)) {
        document.adoptedStyleSheets = document.adoptedStyleSheets.concat(pmSheet);
      }
    } catch (e) { lastWarn = 'Styles blocked by page CSP.'; log('no stylesheet possible:', e.message); }
  }

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
    const dialogOpen = !!document.querySelector('[role=dialog],[role=alertdialog],dialog[open]');
    const r = root();
    const display = dialogOpen ? 'none' : '';
    if (r.style.display !== display) r.style.display = display;

    const pod = activePod();
    const snap = (pod || menuOpen) ? snapshot() : null;
    let state, label, title;
    if (busy) {
      state = 'busy'; label = statusText || 'Working...'; title = 'Working. Click to cancel.';
    } else if (lastError) {
      state = 'error'; label = '⚠ ' + lastError;
      title = lastError + '. Click to open the menu and retry. Shift-click copies a debug report.';
    } else if (pod) {
      const c = applyFilter(snap);
      const more = !!loadMoreBtn();
      const missing = unseenApps(pod, snap).length;
      state = 'on';
      label = (pod.groupIndex > 0 ? pod.group + ' · ' : '') + pod.name + ': ' + c.matched + '/' + c.total + (more ? '+' : '');
      title = 'Showing ' + c.matched + ' ' + pod.name + ' task' + (c.matched === 1 ? '' : 's') + ' of ' + c.total +
        ' loaded rows' + (more ? ' (more pages are not loaded)' : '') + '. ' +
        missing + ' of ' + pod.apps.length + ' apps in this pod have no loaded task. Click for the pod menu.' +
        (c.matched === 0 && more ? ' None of this pod is on the loaded pages; use "Load one more page" in the menu.' : '');
    } else {
      state = 'off'; label = 'Pods';
      title = 'Filter tasks by pod (Alt+P). Pod data from ' + podData.updated + dataLabel() + '. Shift-click copies a debug report.';
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
    renderMenu(snap);
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
    it.addEventListener('click', ev => choosePod(id, !!(ev.shiftKey || ev.ctrlKey || ev.metaKey) && id !== null && id.indexOf('|') < 0));
    return it;
  }

  function linkButton(dataId, text, fn) {
    const b = el('button', 'pm-link', text);
    b.type = 'button'; b.setAttribute('data-id', dataId);
    b.addEventListener('click', fn);
    return b;
  }

  function renderMenu(snap) {
    const menu = $(MENU_ID);
    if (!menu) return;
    menu.hidden = !menuOpen;
    if (!menuOpen) return;
    snap = snap || snapshot();
    const pc = podCounts(snap);
    const act = activePod();
    const lp = lastPod();
    const miss = act ? unseenApps(act, snap) : [];
    const more = !!loadMoreBtn();
    const sigStr = JSON.stringify([activePodId, pc, settings, imported, podData.updated,
      pods.map(p => p.id + p.name + p.apps.length), lp && lp.id, miss, more, busy, staleNote]);
    if (menu.getAttribute('data-sig') === sigStr) return;
    menu.setAttribute('data-sig', sigStr);
    const focused = menu.contains(document.activeElement) ? document.activeElement.getAttribute('data-id') : null;
    menu.textContent = '';
    menu.appendChild(el('div', 'pm-head', 'Filter tasks by pod (shift-click adds)'));
    if (lp) {
      const li = menuItem(lp.id, '↺ Last: ' + lp.name, 'one click', false, null);
      li.setAttribute('data-id', '__last');
      li.removeAttribute('aria-checked'); li.setAttribute('role', 'button');
      menu.appendChild(li);
    }
    const group = el('div'); group.setAttribute('role', 'radiogroup'); group.setAttribute('aria-label', 'Pod');
    group.appendChild(menuItem(null, 'All tasks', pc.total + ' loaded', !activePodId, null));
    let lastGroup = -1;
    const on = activeIds();
    pods.forEach(p => {
      if (p.groupIndex !== lastGroup) {
        lastGroup = p.groupIndex;
        group.appendChild(el('div', 'pm-sep'));
        if (p.group) group.appendChild(el('div', 'pm-head', p.group));
      }
      group.appendChild(menuItem(p.id, p.name, p.apps.length + ' apps · ' + pc.counts[p.id] + ' loaded',
        on.indexOf(p.id) >= 0, colorFor(p.name)));
    });
    menu.appendChild(group);
    if (pc.unassigned.length) {
      const un = el('div', 'pm-note', 'In no pod: ' + pc.unassigned.slice(0, 6).join(', ') + (pc.unassigned.length > 6 ? ' +' + (pc.unassigned.length - 6) + ' more' : ''));
      un.title = pc.unassigned.join('\n');
      menu.appendChild(un);
    }
    if (miss.length) {
      const mn = el('div', 'pm-note', 'No task loaded for ' + miss.length + '/' + act.apps.length + ' apps in this filter: ' + miss.slice(0, 8).join(', ') + (miss.length > 8 ? ' +' + (miss.length - 8) + ' more' : ''));
      mn.title = miss.join('\n');
      menu.appendChild(mn);
    }
    menu.appendChild(el('div', 'pm-sep'));

    if (more) menu.appendChild(linkButton('__more', 'Load one more page', loadOnePage));

    const r1 = el('label', 'pm-row');
    r1.appendChild(el('span', null, 'Apply the “latest” tag first'));
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = settings.useLatestTag; cb.setAttribute('data-id', '__tag');
    cb.addEventListener('change', () => { settings.useLatestTag = cb.checked; saveSettings(); renderMenu(); });
    r1.appendChild(cb); menu.appendChild(r1);

    const rd = el('label', 'pm-row');
    rd.appendChild(el('span', null, 'Dock in the sidebar pane'));
    const cd = document.createElement('input');
    cd.type = 'checkbox'; cd.checked = settings.dock; cd.setAttribute('data-id', '__dock');
    cd.addEventListener('change', () => { settings.dock = cd.checked; saveSettings(); placeRoot(); renderMenu(); });
    rd.appendChild(cd); menu.appendChild(rd);

    const ro = el('label', 'pm-row');
    ro.appendChild(el('span', null, 'Only tasks with a previous stage owner'));
    const co = document.createElement('input');
    co.type = 'checkbox'; co.checked = settings.needOwner; co.setAttribute('data-id', '__owner');
    co.addEventListener('change', () => { settings.needOwner = co.checked; saveSettings(); render(); });
    ro.appendChild(co); menu.appendChild(ro);

    const ru = el('label', 'pm-row');
    ru.appendChild(el('span', null, 'Keep loading until all apps found'));
    const cu = document.createElement('input');
    cu.type = 'checkbox'; cu.checked = settings.untilFound; cu.setAttribute('data-id', '__until');
    cu.addEventListener('change', () => { settings.untilFound = cu.checked; saveSettings(); renderMenu(); });
    ru.appendChild(cu); menu.appendChild(ru);

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
    menu.appendChild(linkButton('__import', 'Import pod list...', openImport));
    menu.appendChild(linkButton('__export', 'Copy pod list', () => { closeMenu(); copyText(JSON.stringify(podData, null, 2), 'Pod list copied'); }));
    if (imported) menu.appendChild(linkButton('__reset', 'Use built-in list', resetPodData));
    menu.appendChild(el('div', 'pm-note', 'Pod data: ' + podData.updated + dataLabel()));
    if (staleNote) menu.appendChild(el('div', 'pm-note', staleNote));

    if (focused) {
      const again = [...menu.querySelectorAll('[data-id]')].find(e => e.getAttribute('data-id') === focused);
      if (again) again.focus({ preventScroll: true });
    }
  }

  function openMenu() {
    menuOpen = true; closeImport(); render();
    const m = $(MENU_ID);
    const first = m && ((isActive() ? m.querySelector('[aria-checked=true]') : null) ||
      m.querySelector('[data-id=__last]') || m.querySelector('[aria-checked=true]'));
    if (first) { first.focus({ preventScroll: true }); m.scrollTop = 0; }
  }
  function closeMenu() { if (!menuOpen) return; menuOpen = false; render(); }

  /* ---------- Pod list import ---------- */
  function openImport() {
    menuOpen = false; render();
    const box = $(IMPORT_ID);
    box.querySelector('.pm-err').textContent = '';
    box.querySelector('textarea').removeAttribute('aria-invalid');
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
    store.del(LS_PODS); podData = BUILTIN_POD_DATA; imported = false; staleNote = '';
    closeMenu(); focusBtn(); rebuildPods(); flash('Built-in list restored');
  }
  function saveImport() {
    const box = $(IMPORT_ID);
    const err = box.querySelector('.pm-err');
    const ta = box.querySelector('textarea');
    try {
      const d = parsePodData(ta.value);
      if (d.updated < BUILTIN_POD_DATA.updated) {
        throw new Error('This list is dated ' + d.updated + ', older than the built-in ' + BUILTIN_POD_DATA.updated +
          '. Change "updated" to today to use it anyway.');
      }
      if (!store.set(LS_PODS, JSON.stringify(d))) throw new Error('Could not save in this browser');
      podData = d; imported = true; staleNote = '';
      ta.value = ''; err.textContent = ''; ta.removeAttribute('aria-invalid');
      closeImport(); focusBtn(); rebuildPods(); flash('Pod list imported');
    } catch (e) {
      err.textContent = e.message;
      ta.setAttribute('aria-invalid', 'true');
    }
  }

  const DOCK_SEL = '#stagecraft-sidebar-group-center-panel > div > div:nth-child(1)';
  // Put the widget into Feather's pane when it is there and visible; otherwise it floats bottom-left.
  function placeRoot() {
    const r = root(); if (!r) return;
    let pane = null;
    if (settings.dock) {
      try { pane = document.querySelector(DOCK_SEL); } catch (e) { pane = null; }
      if (pane && (!pane.offsetWidth || !pane.offsetHeight)) pane = null;
    }
    if (pane) {
      if (r.parentElement !== pane) pane.insertBefore(r, pane.firstChild);
      r.classList.add('pm-docked');
    } else {
      if (r.parentElement !== document.body) document.body.appendChild(r);
      r.classList.remove('pm-docked');
    }
  }

  function createUI() {
    ensureStyle();
    const r = el('div'); r.id = ROOT_ID;

    const menu = el('div'); menu.id = MENU_ID; menu.setAttribute('role', 'group');
    menu.setAttribute('aria-label', 'Pod filter'); menu.hidden = true;
    menu.addEventListener('keydown', e => {
      if (e.target.tagName === 'SELECT') return; // let the select use its own arrow keys
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
    ta.setAttribute('aria-describedby', ERR_ID);
    imp.appendChild(ta);
    const err = el('div', 'pm-err'); err.id = ERR_ID; err.setAttribute('role', 'alert');
    imp.appendChild(err);
    const acts = el('div', 'pm-actions');
    const cancel = el('button', null, 'Cancel'); cancel.type = 'button';
    cancel.addEventListener('click', () => { closeImport(); focusBtn(); });
    const save = el('button', 'pm-primary', 'Save'); save.type = 'button'; save.addEventListener('click', saveImport);
    acts.appendChild(cancel); acts.appendChild(save); imp.appendChild(acts);
    ['keydown', 'keyup', 'keypress'].forEach(t => imp.addEventListener(t, e => { // keep Feather hotkeys out of the textarea
      if (e.key !== 'Escape') e.stopPropagation();
    }));
    r.appendChild(imp);

    const b = el('button'); b.id = BTN_ID; b.type = 'button';
    b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-controls', MENU_ID);
    b.addEventListener('click', ev => {
      if (ev.shiftKey) { copyReport(); return; }
      if (busy) { gen++; busy = false; statusText = ''; lastWarn = 'Cancelled.'; watchRateLimit(false); log('cancelled'); render(); return; }
      if (menuOpen) closeMenu(); else openMenu();
    });
    b.addEventListener('keydown', ev => {
      if (ev.key !== 'ArrowDown' && ev.key !== 'ArrowUp') return;
      ev.preventDefault();
      if (busy) return;
      if (!menuOpen) openMenu();
      if (ev.key === 'ArrowUp') { const it = [...menu.querySelectorAll('button,input,select')]; if (it.length) it[it.length - 1].focus(); }
    });
    r.appendChild(b);

    r.addEventListener('focusout', ev => { // tabbing out of the widget closes it
      const n = ev.relatedTarget;
      if (n && !r.contains(n)) { closeMenu(); closeImport(); }
    });

    const live = el('div'); live.id = LIVE_ID; live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
    r.appendChild(live);
    if (window.__cpodLoaded || document.getElementById('cpod-filter-btn')) {
      r.style.bottom = '72px'; // old single-pod script still installed: stack above it
      lastWarn = 'The old "Commercial pod" userscript is still enabled. Disable it in Tampermonkey.';
      log('old cpod script detected');
    }
    document.body.appendChild(r);
    placeRoot();
    log('menu added');
    render();
  }

  document.addEventListener('click', e => {
    if (!root() || !e.target.isConnected) return; // a re-rendered menu item is gone by now; not an outside click
    if (!e.target.closest || !e.target.closest('#' + ROOT_ID)) { closeMenu(); closeImport(); }
  });
  document.addEventListener('keydown', e => {
    if (!root()) return;
    if (e.altKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyP') { // Alt+P toggles the menu
      e.preventDefault();
      if (menuOpen) closeMenu(); else if (!busy) openMenu();
      return;
    }
    if (e.key !== 'Escape') return;
    const wasOpen = menuOpen || ($(IMPORT_ID) && !$(IMPORT_ID).hidden);
    closeMenu(); closeImport();
    if (wasOpen) focusBtn();
  });

  /* ---------- Keep it alive in the SPA ---------- */
  const basePart = s => s.split('|').slice(0, 2).join('|');
  function sync() {
    try {
      const onList = !!searchBox();
      if (onList) {
        missSince = 0;
        if (!root()) createUI();
        ensureStyle();
        placeRoot();
        // A brief empty list while Feather refetches is not a change; a different first row is.
        if (!busy && isActive() && sig() !== activeSig && !(rowCount() === 0 && basePart(sig()) === basePart(activeSig))) {
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

  let timer = null, lastSync = 0, lastApply = 0;
  function schedule() {
    if (timer) return;
    timer = setTimeout(() => { timer = null; lastSync = Date.now(); sync(); },
      Math.max(0, T.debounce - (Date.now() - lastSync)));
  }
  function start() {
    new MutationObserver(muts => {
      if (muts.every(m => isOurs(m.target))) return;
      if (!busy && isActive() && Date.now() - lastApply > 50) { // hide new rows at once, no flicker
        lastApply = Date.now();
        try { applyFilter(); } catch (e) { /* sync will retry */ }
      }
      schedule();
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true }); // row hiding is an attribute change, not observed
    setInterval(sync, T.heartbeat);
    log('loaded; pod data', podData.updated, dataLabel());
    autoRefresh();
    setInterval(autoRefresh, 30 * 60 * 1000);
    sync();
  }

  if (document.body) start();
  else addEventListener('DOMContentLoaded', start);
})();
