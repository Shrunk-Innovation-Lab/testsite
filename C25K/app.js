/* ── PROGRAM ─────────────────────────────────────────────────────── */
const STORE = { done:'c25k-done-v4', snd:'c25k-snd-v4', hist:'c25k-hist-v4', sel:'c25k-sel-v4' };

const PROG = [
  {w:1,days:[
    {t:'Day 1',wu:5,cd:5,iv:[{r:1,wk:1.5,rep:8}]},
    {t:'Day 2',wu:5,cd:5,iv:[{r:1,wk:1.5,rep:8}]},
    {t:'Day 3',wu:5,cd:5,iv:[{r:1,wk:1.5,rep:8}]},
  ]},
  {w:2,days:[
    {t:'Day 1',wu:5,cd:5,iv:[{r:1.5,wk:2,rep:6}]},
    {t:'Day 2',wu:5,cd:5,iv:[{r:1.5,wk:2,rep:6}]},
    {t:'Day 3',wu:5,cd:5,iv:[{r:1.5,wk:2,rep:6}]},
  ]},
  {w:3,days:[
    {t:'Day 1',wu:5,cd:5,iv:[{r:1.5,wk:1.5,rep:2},{r:3,wk:3,rep:2}]},
    {t:'Day 2',wu:5,cd:5,iv:[{r:1.5,wk:1.5,rep:2},{r:3,wk:3,rep:2}]},
    {t:'Day 3',wu:5,cd:5,iv:[{r:2,wk:2,rep:2},{r:4,wk:3,rep:2}]},
  ]},
  {w:4,days:[
    {t:'Day 1',wu:5,cd:5,iv:[{r:3,wk:1.5,rep:2},{r:5,wk:2.5,rep:2}]},
    {t:'Day 2',wu:5,cd:5,iv:[{r:3,wk:1.5,rep:2},{r:5,wk:2.5,rep:2}]},
    {t:'Day 3',wu:5,cd:5,iv:[{r:4,wk:2,rep:2},{r:5,wk:2,rep:2}]},
  ]},
  {w:5,days:[
    {t:'Day 1',wu:5,cd:5,iv:[{r:5,wk:3,rep:2},{r:5,wk:0,rep:1}]},
    {t:'Day 2',wu:5,cd:5,iv:[{r:8,wk:5,rep:1},{r:8,wk:0,rep:1}]},
    {t:'Day 3',wu:5,cd:5,iv:[{r:20,wk:0,rep:1}]},
  ]},
  {w:6,days:[
    {t:'Day 1',wu:5,cd:5,iv:[{r:5,wk:3,rep:1},{r:8,wk:3,rep:1},{r:5,wk:0,rep:1}]},
    {t:'Day 2',wu:5,cd:5,iv:[{r:10,wk:3,rep:1},{r:10,wk:0,rep:1}]},
    {t:'Day 3',wu:5,cd:5,iv:[{r:22,wk:0,rep:1}]},
  ]},
  {w:7,days:[
    {t:'Day 1',wu:5,cd:5,iv:[{r:25,wk:0,rep:1}]},
    {t:'Day 2',wu:5,cd:5,iv:[{r:25,wk:0,rep:1}]},
    {t:'Day 3',wu:5,cd:5,iv:[{r:28,wk:0,rep:1}]},
  ]},
  {w:8,days:[
    {t:'Day 1',wu:5,cd:5,iv:[{r:30,wk:0,rep:1}]},
    {t:'Day 2',wu:5,cd:5,iv:[{r:30,wk:0,rep:1}]},
    {t:'5K Day',wu:5,cd:5,iv:[{r:35,wk:0,rep:1}]},
  ]},
];

/* ── ICONS ───────────────────────────────────────────────────────── */
const IC = {
  vol:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 14h3l4 3V7L7 10H4v4Z" fill="currentColor" stroke="none"/><path d="M15 9.5a4 4 0 0 1 0 5"/><path d="M17.5 7a7.5 7.5 0 0 1 0 10"/></svg>`,
  mute: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 14h3l4 3V7L7 10H4v4Z" fill="currentColor" stroke="none"/><path d="M17 9l4 4m0-4-4 4"/></svg>`,
  run:  `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="4" r="2"/><path d="M15.777 10.969a2.007 2.007 0 0 0 2.148.83l3.316-.829-.483-1.94-3.316.829-1.379-2.067a2.01 2.01 0 0 0-1.272-.854l-3.846-.77a1.998 1.998 0 0 0-2.181 1.067l-1.658 3.316 1.789.895 1.658-3.317 1.967.394L7.434 17H3v2h4.434c.698 0 1.355-.372 1.715-.971l1.918-3.196 5.169 1.034 1.816 5.449 1.896-.633-1.815-5.448a2.007 2.007 0 0 0-1.506-1.33l-3.039-.607 1.772-2.954.417.625z"/></svg>`,
  chev: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  ext:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5h5v5"/><path d="M10 14 19 5"/><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/></svg>`,
};

/* ── FORMAT ──────────────────────────────────────────────────────── */
function fmtTime(s) {
  var n = Math.max(0, Math.floor(s || 0));
  return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');
}
function fmtDur(s) {
  var n = Math.max(0, Math.floor(s || 0));
  return Math.floor(n / 60) + 'm ' + String(n % 60).padStart(2, '0') + 's';
}
function fmtDist(m) {
  if (!m || m < 1) return '0 m';
  return m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(2) + ' km';
}
function fmtPace(spk) {
  if (!Number.isFinite(spk) || spk <= 0) return '--:--';
  var mins = Math.floor(spk / 60), secs = Math.round(spk % 60);
  if (secs === 60) return (mins + 1) + ':00 /km';
  return mins + ':' + String(secs).padStart(2, '0') + ' /km';
}
function fmtSpeed(mps) {
  if (!Number.isFinite(mps) || mps <= 0) return '0.0 km/h';
  return (mps * 3.6).toFixed(1) + ' km/h';
}

function dayKey(wi, di) { return 'w' + (wi + 1) + '-d' + (di + 1); }

function haversine(a, b) {
  var R = 6371000;
  var dLa = (b.lat - a.lat) * Math.PI / 180;
  var dLo = (b.lng - a.lng) * Math.PI / 180;
  var x = Math.sin(dLa/2)**2 + Math.sin(dLo/2)**2 * Math.cos(a.lat*Math.PI/180) * Math.cos(b.lat*Math.PI/180);
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function smoothPts(pts) {
  if (pts.length <= 2) return pts;
  return pts.map(function(p, i) {
    if (i === 0 || i === pts.length - 1) return p;
    return { lat: (pts[i-1].lat + p.lat + pts[i+1].lat) / 3, lng: (pts[i-1].lng + p.lng + pts[i+1].lng) / 3 };
  });
}

function buildSegs(dayObj) {
  var out = [{ lbl: 'Warm-up', tp: 'walk', sec: Math.round(dayObj.wu * 60) }];
  dayObj.iv.forEach(function(b) {
    for (var i = 0; i < b.rep; i++) {
      if (b.r)  out.push({ lbl: 'Run ' + b.r + ' min',  tp: 'run',  sec: Math.round(b.r * 60) });
      if (b.wk) out.push({ lbl: 'Walk ' + b.wk + ' min', tp: 'walk', sec: Math.round(b.wk * 60) });
    }
  });
  out.push({ lbl: 'Cool-down', tp: 'walk', sec: Math.round(dayObj.cd * 60) });
  return out;
}

function totalMin(dayObj) {
  return dayObj.wu + dayObj.cd + dayObj.iv.reduce(function(s, i) { return s + (i.r + i.wk) * i.rep; }, 0);
}

function miniMapPts(pts) {
  var W = 360, H = 160, P = 12;
  if (!pts.length) return '';
  if (pts.length === 1) return (W/2) + ',' + (H/2);
  var lats = pts.map(function(p) { return p.lat; });
  var lngs = pts.map(function(p) { return p.lng; });
  var minLat = Math.min.apply(null, lats), maxLat = Math.max.apply(null, lats);
  var minLng = Math.min.apply(null, lngs), maxLng = Math.max.apply(null, lngs);
  var lr = Math.max(maxLat - minLat, 0.00001);
  var lgr = Math.max(maxLng - minLng, 0.00001);
  return pts.map(function(p) {
    var x = P + ((p.lng - minLng) / lgr) * (W - P*2);
    var y = H - P - ((p.lat - minLat) / lr) * (H - P*2);
    return x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');
}

function emptySplits(segsArr) {
  return segsArr.map(function(s, i) {
    return { i: i, lbl: s.lbl, tp: s.tp, plan: s.sec, actual: 0, dist: 0 };
  });
}

/* ── STATE ───────────────────────────────────────────────────────── */
var ST = {
  w: 0, d: 0,
  active: false, started: false,
  si: 0, tl: 0,
  dist: 0, pts: [], gpsErr: '', splits: [],
  cd: null, snd: true,
  done: {}, hist: [],
  expW: 0,
  tab: 'stats',
  view: 'workout',
  sheetOpen: false, sheetTab: 'plan',
};

// Refs — mutable runtime vars, not state
var RF = {
  wid: null, lastPt: null,
  segDist: 0, segT: Date.now(),
  audio: null, cdInt: null,
  tenBeep: null, segBeep: 0,
  saved: false, tick: null,
};

/* ── DERIVED ─────────────────────────────────────────────────────── */
function curDay()  { return PROG[ST.w].days[ST.d]; }
function curSegs() { return buildSegs(curDay()); }
function totSec()  { return curSegs().reduce(function(s, sg) { return s + sg.sec; }, 0); }

function elapsed() {
  var sg = curSegs();
  var done = sg.slice(0, ST.si).reduce(function(s, g) { return s + g.sec; }, 0);
  var cur = sg[ST.si] ? sg[ST.si].sec : 0;
  return Math.max(0, done + (cur - ST.tl));
}
function prog() {
  var t = totSec(), e = elapsed();
  return t ? Math.round((e / t) * 100) : 0;
}
function avgPace()  { var e = elapsed(); return ST.dist > 0 ? e / (ST.dist / 1000) : 0; }
function avgSpeed() { var e = elapsed(); return e > 0 ? ST.dist / e : 0; }
function latPt()    { return ST.pts[ST.pts.length - 1] || RF.lastPt; }

/* ── PERSIST ─────────────────────────────────────────────────────── */
function loadST() {
  try {
    var c = localStorage.getItem(STORE.done);
    var sn = localStorage.getItem(STORE.snd);
    var h = localStorage.getItem(STORE.hist);
    var sl = localStorage.getItem(STORE.sel);
    if (c)  ST.done = JSON.parse(c);
    if (sn !== null) ST.snd = sn === 'true';
    if (h)  ST.hist = JSON.parse(h);
    if (sl) { var p = JSON.parse(sl); ST.w = p.w || 0; ST.d = p.d || 0; ST.expW = p.w || 0; }
  } catch(e) { console.warn('load error', e); }
}
function saveST() {
  try {
    localStorage.setItem(STORE.done, JSON.stringify(ST.done));
    localStorage.setItem(STORE.snd, String(ST.snd));
    localStorage.setItem(STORE.hist, JSON.stringify(ST.hist));
    localStorage.setItem(STORE.sel, JSON.stringify({ w: ST.w, d: ST.d }));
  } catch(e) {}
}

/* ── AUDIO ───────────────────────────────────────────────────────── */
function playTone(freq, dur, type, vol) {
  if (!ST.snd) return;
  try {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!RF.audio) RF.audio = new Ctx();
    var ctx = RF.audio, now = ctx.currentTime;
    var osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq || 880, now);
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol || 0.05), now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (dur || 0.12));
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + (dur || 0.12) + 0.03);
  } catch(e) {}
}

function beepCountdown(v) {
  if (v <= 0) playTone(1320, 0.22, 'triangle', 0.06);
  else playTone(v <= 3 ? 1046 : 880, v <= 3 ? 0.18 : 0.12, 'sine', 0.05);
}
function beepFinal(v)  { playTone(v <= 3 ? 1046 : 880, v <= 3 ? 0.18 : 0.12, 'sine', 0.05); }
function beepChange(tp) {
  if (tp === 'run') {
    playTone(880, 0.12, 'triangle', 0.05);
    setTimeout(function() { playTone(1174, 0.16, 'triangle', 0.05); }, 120);
  } else {
    playTone(659, 0.12, 'triangle', 0.05);
    setTimeout(function() { playTone(523, 0.16, 'triangle', 0.05); }, 120);
  }
}
function beepDone() {
  playTone(784, 0.14, 'triangle', 0.05);
  setTimeout(function() { playTone(988, 0.18, 'triangle', 0.05); }, 160);
  setTimeout(function() { playTone(1318, 0.24, 'triangle', 0.05); }, 340);
}

async function resumeAudio() {
  var Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  if (!RF.audio) RF.audio = new Ctx();
  if (RF.audio.state === 'suspended') await RF.audio.resume();
}

/* ── TIMER CONTROL ───────────────────────────────────────────────── */
function clearCd() {
  if (RF.cdInt) { clearInterval(RF.cdInt); RF.cdInt = null; }
  ST.cd = null;
}
function stopTick() { if (RF.tick) { clearInterval(RF.tick); RF.tick = null; } }
function stopGeo()  { if (RF.wid !== null && navigator.geolocation) { navigator.geolocation.clearWatch(RF.wid); RF.wid = null; } }

function resetAll() {
  clearCd(); stopTick(); stopGeo();
  ST.active = false; ST.started = false;
  ST.si = 0; ST.tl = curSegs()[0] ? curSegs()[0].sec : 0;
  ST.dist = 0; ST.pts = []; ST.gpsErr = '';
  ST.splits = emptySplits(curSegs());
  RF.lastPt = null; RF.segDist = 0; RF.segT = Date.now();
  RF.tenBeep = null; RF.segBeep = 0; RF.saved = false;
}

function finalizeSplit(idx, ov) {
  ST.splits = ST.splits.map(function(sp, i) {
    if (i !== idx) return sp;
    return { i: sp.i, lbl: sp.lbl, tp: sp.tp, plan: sp.plan,
             dist: RF.segDist,
             actual: ov != null ? ov : Math.max(0, Math.round((Date.now() - RF.segT) / 1000)) };
  });
  RF.segDist = 0; RF.segT = Date.now();
}

function startGeo() {
  if (!ST.started) return;
  if (!navigator.geolocation) { ST.gpsErr = 'Geolocation not available.'; render(); return; }
  stopGeo();
  RF.wid = navigator.geolocation.watchPosition(
    function(pos) {
      ST.gpsErr = '';
      var acc = pos.coords.accuracy || 0;
      var pt = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (acc > 35) { render(); return; }
      ST.pts.push(pt);
      if (RF.lastPt) {
        var d = haversine(RF.lastPt, pt);
        if (d >= 0.8 && d <= 80) { ST.dist += d; RF.segDist += d; }
      }
      RF.lastPt = pt; render();
    },
    function(err) {
      var msgs = ['', 'Permission denied.', 'Position unavailable.', 'Timed out.'];
      ST.gpsErr = msgs[err.code] || 'GPS error.'; render();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 1500 }
  );
}

function maybeSave() {
  var e = elapsed();
  if (ST.started || ST.active || ST.tl !== 0 || RF.saved) return;
  if (!curSegs().length || e <= 0) return;
  RF.saved = true;
  ST.hist = [{
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    at: new Date().toISOString(),
    week: ST.w + 1, dayT: curDay().t,
    sec: e, dist: ST.dist, pace: avgPace(), speed: avgSpeed(),
    splits: ST.splits,
  }].concat(ST.hist).slice(0, 30);
  saveST();
}

function maybeTenBeep() {
  if (!ST.started || !ST.active) { RF.tenBeep = null; return; }
  if (ST.tl <= 10 && ST.tl > 0 && RF.tenBeep !== ST.tl) { beepFinal(ST.tl); RF.tenBeep = ST.tl; }
  if (ST.tl > 10) RF.tenBeep = null;
}
function maybeChangeBeep() {
  if (!ST.started || !ST.active) return;
  if (ST.si !== RF.segBeep) {
    if (ST.si > 0) { var sg = curSegs()[ST.si]; beepChange(sg ? sg.tp : 'walk'); }
    RF.segBeep = ST.si;
  }
}

function startTick() {
  stopTick();
  RF.tick = setInterval(function() {
    if (ST.tl > 1) { ST.tl--; maybeTenBeep(); tickUpdate(); return; }
    var sg = curSegs(), cur = ST.si, nxt = cur + 1;
    finalizeSplit(cur, sg[cur] ? sg[cur].sec : 0);
    if (nxt >= sg.length) {
      ST.active = false; ST.started = false; ST.tl = 0;
      beepDone();
      ST.done[dayKey(ST.w, ST.d)] = true;
      wakeLockRelease();
      saveST(); stopTick(); stopGeo(); maybeSave(); render(); return;
    }
    ST.si = nxt; ST.tl = sg[nxt].sec; maybeChangeBeep(); render();
  }, 1000);
}

/* ── TICK UPDATE — no DOM rebuild ────────────────────────────────── */
function tickUpdate() {
  var RING_R = 110;
  var CIRC = 2 * Math.PI * RING_R;
  var cur = curSegs()[ST.si] || null;
  var e = elapsed();
  var pr = prog();
  var remain = Math.max(0, totSec() - e);
  var segPct = (cur && ST.tl > 0) ? (1 - ST.tl / cur.sec) : 0;
  var offset = (CIRC * (1 - segPct)).toFixed(2);

  var elTime = document.getElementById('ring-time');
  if (elTime) elTime.textContent = fmtTime(ST.tl);

  var elFill = document.getElementById('sbar-fill');
  if (elFill) elFill.style.width = pr + '%';

  var elPct = document.getElementById('sbar-pct');
  if (elPct) elPct.textContent = pr + '%';

  var elRem = document.getElementById('sbar-rem');
  if (elRem) elRem.textContent = fmtTime(remain) + ' left';

  var rings = document.querySelectorAll('.ring-prog, .ring-glow');
  rings.forEach(function(el) { el.setAttribute('stroke-dashoffset', offset); });

  if (ST.tab === 'route') mapUpdate();
}

/* ── ACTIONS ─────────────────────────────────────────────────────── */
async function doStart() {
  await resumeAudio();
  if (ST.started) { ST.active = true; startTick(); maybeTenBeep(); wakeLockAcquire(); render(); return; }
  clearCd();
  ST.active = false; ST.started = false;
  ST.si = 0; ST.tl = curSegs()[0] ? curSegs()[0].sec : 0;
  RF.saved = false; ST.dist = 0; ST.pts = []; ST.gpsErr = '';
  ST.splits = emptySplits(curSegs());
  RF.lastPt = null; RF.segDist = 0; RF.segT = Date.now();
  RF.tenBeep = null; RF.segBeep = 0;

  var c = 3;
  ST.cd = c; beepCountdown(c); render();
  RF.cdInt = setInterval(function() {
    c--;
    if (c > 0) { ST.cd = c; beepCountdown(c); render(); return; }
    ST.cd = 0; beepCountdown(0); render();
    clearInterval(RF.cdInt); RF.cdInt = null;
    setTimeout(function() {
      clearCd();
      ST.started = true; ST.active = true;
      ST.si = 0; ST.tl = curSegs()[0] ? curSegs()[0].sec : 0;
      RF.segT = Date.now(); RF.segBeep = 0;
      startGeo(); startTick(); wakeLockAcquire(); render();
    }, 250);
  }, 1000);
}

function doPause() { clearCd(); ST.active = false; stopTick(); wakeLockRelease(); render(); }
function doStop()  { wakeLockRelease(); resetAll(); render(); }

function selWork(wi, di) {
  clearCd(); RF.saved = false;
  ST.w = wi; ST.d = di;
  ST.active = false; ST.started = false;
  ST.dist = 0; ST.pts = []; ST.gpsErr = '';
  RF.lastPt = null; RF.segDist = 0; RF.segT = Date.now();
  var sg = curSegs();
  ST.tl = sg[0] ? sg[0].sec : 0;
  ST.splits = emptySplits(sg);
  stopTick(); stopGeo(); saveST(); render();
}

/* ── BODY CLASSES ────────────────────────────────────────────────── */
function syncBody() {
  document.body.classList.remove('s-run', 's-walk');
  if (!ST.started) return;
  var sg = curSegs()[ST.si];
  if (sg && sg.tp === 'run')  document.body.classList.add('s-run');
  if (sg && sg.tp === 'walk') document.body.classList.add('s-walk');
}

/* ── RING SVG ────────────────────────────────────────────────────── */
function makeRing(tp, segPct) {
  var RING_R = 110, CX = 130, CY = 130;
  var CIRC = (2 * Math.PI * RING_R).toFixed(2);
  var offset = (2 * Math.PI * RING_R * (1 - segPct)).toFixed(2);
  var cls = tp === 'run' ? 'run' : tp === 'walk' ? 'walk' : 'idle';
  return '<svg class="ring-svg" viewBox="0 0 260 260">' +
    '<defs><filter id="gf"><feGaussianBlur stdDeviation="5"/></filter></defs>' +
    '<circle class="ring-glow ' + cls + '" cx="' + CX + '" cy="' + CY + '" r="' + RING_R + '"' +
      ' stroke-dasharray="' + CIRC + '" stroke-dashoffset="' + offset + '"' +
      ' transform="rotate(-90 ' + CX + ' ' + CY + ')" style="filter:url(#gf)"/>' +
    '<circle class="ring-track" cx="' + CX + '" cy="' + CY + '" r="' + RING_R + '"/>' +
    '<circle class="ring-prog ' + cls + '" cx="' + CX + '" cy="' + CY + '" r="' + RING_R + '"' +
      ' stroke-dasharray="' + CIRC + '" stroke-dashoffset="' + offset + '"' +
      ' transform="rotate(-90 ' + CX + ' ' + CY + ')"/>' +
    '</svg>';
}

/* == LONG PRESS for stop/pause during active wake lock == */
var LP = { timer: null, prog: null, dur: 700 };

function lpStart(btn, action, ev) {
  if (!WAKE.lock) { action(); return; }
  ev.preventDefault();

  var ring = document.createElement('div');
  ring.className = 'lp-ring';
  var C = 2 * Math.PI * 20;
  ring.innerHTML = '<svg viewBox="0 0 48 48"><circle class="lp-track" cx="24" cy="24" r="20"/><circle class="lp-arc" cx="24" cy="24" r="20" style="stroke-dasharray:' + C + ';stroke-dashoffset:' + C + '"/></svg>';
  btn.appendChild(ring);
  LP.prog = ring;

  var arc = ring.querySelector('.lp-arc');
  var start = null;
  function frame(ts) {
    if (!start) start = ts;
    var pct = Math.min((ts - start) / LP.dur, 1);
    arc.style.strokeDashoffset = C * (1 - pct);
    if (pct < 1 && LP.timer !== null) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  LP.timer = setTimeout(function() {
    lpCancel(); action();
  }, LP.dur);
}

function lpCancel() {
  if (LP.timer !== null) { clearTimeout(LP.timer); LP.timer = null; }
  if (LP.prog) { LP.prog.remove(); LP.prog = null; }
}

/* == WAKE LOCK == */
var WAKE = { lock: null };

function wakeLockAcquire() {
  if (!navigator.wakeLock) return;
  navigator.wakeLock.request('screen').then(function(lock) {
    WAKE.lock = lock;
    lock.addEventListener('release', function() { WAKE.lock = null; });
  }).catch(function() {});
}

function wakeLockRelease() {
  if (WAKE.lock) { WAKE.lock.release(); WAKE.lock = null; }
}

// Re-acquire after screen is unlocked (iOS releases it on screen off)
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible' && ST.active) wakeLockAcquire();
});


var MAP = {
  instance: null,
  tile: null,
  route: null,
  dot: null,
  dotPulse: null,
};

function mapInit() {
  if (MAP.instance) return;
  var el = document.getElementById('map-outer');
  if (!el || typeof L === 'undefined') return;

  MAP.instance = L.map(el, {
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    tap: false,
  }).setView([0, 0], 15);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
  }).addTo(MAP.instance);

  MAP.route = L.polyline([], {
    color: '#c8ff5a',
    weight: 4,
    opacity: 0.9,
    lineCap: 'round',
    lineJoin: 'round',
  }).addTo(MAP.instance);

  // Current position dot
  var dotIcon = L.divIcon({
    className: '',
    html: '<div style="width:14px;height:14px;border-radius:50%;background:#c8ff5a;border:2px solid #fff;box-shadow:0 0 10px rgba(200,255,90,0.8)"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
  MAP.dot = L.marker([0, 0], { icon: dotIcon, zIndexOffset: 1000 });
}

function mapUpdate() {
  if (!MAP.instance) return;

  var pts = ST.pts;
  var lp  = latPt();

  // Update route polyline
  if (pts.length > 1) {
    var latlngs = pts.map(function(p) { return [p.lat, p.lng]; });
    MAP.route.setLatLngs(latlngs);
  }

  // Update current position dot
  if (lp) {
    if (!MAP.instance.hasLayer(MAP.dot)) MAP.dot.addTo(MAP.instance);
    MAP.dot.setLatLng([lp.lat, lp.lng]);
    MAP.instance.panTo([lp.lat, lp.lng], { animate: true, duration: 0.5 });
  }

  // Colour route by state
  var col = document.body.classList.contains('s-run') ? '#ff6b35' :
            document.body.classList.contains('s-walk') ? '#38d9f5' : '#c8ff5a';
  MAP.route.setStyle({ color: col });
  if (MAP.dot) {
    MAP.dot.setIcon(L.divIcon({
      className: '',
      html: '<div style="width:14px;height:14px;border-radius:50%;background:' + col + ';border:2px solid #fff;box-shadow:0 0 10px ' + col + '88"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    }));
  }
}

function mapPosition() {
  // Position map-outer over the .map-slot placeholder in the DOM
  var slot = document.querySelector('.map-slot');
  var outer = document.getElementById('map-outer');
  if (!slot || !outer) { if (outer) outer.classList.remove('visible'); return; }
  var r = slot.getBoundingClientRect();
  outer.style.left   = r.left + 'px';
  outer.style.top    = r.top  + 'px';
  outer.style.width  = r.width  + 'px';
  outer.style.height = r.height + 'px';
  outer.classList.add('visible');
  if (MAP.instance) MAP.instance.invalidateSize();
  mapUpdate();
}

function mapHide() {
  var outer = document.getElementById('map-outer');
  if (outer) outer.classList.remove('visible');
}


function renderPlan() {
  mapHide();
  var totDone = Object.values(ST.done).filter(Boolean).length;
  var totAll  = PROG.reduce(function(s, wk) { return s + wk.days.length; }, 0);

  var planRows = '';
  for (var wi = 0; wi < PROG.length; wi++) {
    var wk = PROG[wi], exp = ST.expW === wi;
    var daysHTML = '';
    if (exp) {
      for (var di = 0; di < wk.days.length; di++) {
        var dd = wk.days[di], sel = ST.w === wi && ST.d === di, dn = ST.done[dayKey(wi, di)];
        daysHTML += '<button class="day-btn' + (sel ? ' sel' : '') + '" data-sw="' + wi + '" data-sd="' + di + '">' +
          '<div><div class="day-name">' + dd.t + '</div><div class="day-meta">' + totalMin(dd) + ' min</div></div>' +
          (dn ? '<span class="done-pill">Done</span>' : '') + '</button>';
      }
      daysHTML = '<div class="week-days">' + daysHTML + '</div>';
    }
    var wkMins = wk.days.map(function(d) { return totalMin(d); }).join(', ');
    planRows += '<div class="week-block">' +
      '<div class="week-hd" data-tw="' + wi + '">' +
        '<div><div class="week-name">Week ' + wk.w + '</div>' +
        '<div class="week-meta">' + wk.days.length + ' workouts - ' + wkMins + ' min</div></div>' +
        '<div class="week-chev' + (exp ? ' open' : '') + '">' + IC.chev + '</div>' +
      '</div>' + daysHTML + '</div>';
  }

  var histRows = '';
  if (ST.hist.length) {
    for (var hi = 0; hi < ST.hist.length; hi++) {
      var hr = ST.hist[hi];
      histRows += '<div class="hist-row">' +
        '<div class="hist-hd">' +
          '<div><div class="hist-title">Week ' + hr.week + ' - ' + hr.dayT + '</div>' +
          '<div class="hist-date">' + new Date(hr.at).toLocaleString() + '</div></div>' +
          '<div class="hist-data"><div>' + fmtDist(hr.dist) + '</div><div>' + fmtDur(hr.sec) + '</div></div>' +
        '</div>' +
        '<div class="hist-tags"><span class="tag">' + fmtPace(hr.pace) + '</span>' +
          '<span class="tag">' + fmtSpeed(hr.speed) + '</span>' +
          '<span class="tag">' + hr.splits.length + ' splits</span></div>' +
      '</div>';
    }
    histRows += '<button class="clear-btn" id="b-clear">Clear history</button>';
  } else {
    histRows = '<div class="empty">Complete a workout to see history here.</div>';
  }

  var html =
    '<div class="topbar">' +
      '<div class="topbar-left">' +
        '<div class="topbar-eyebrow">Couch to 5K</div>' +
        '<div class="topbar-title">Week ' + (ST.w + 1) + ' - ' + curDay().t + '</div>' +
      '</div>' +
      '<div class="topbar-right">' +
        '<button id="b-snd" class="icon-btn' + (ST.snd ? ' lit' : '') + '">' + (ST.snd ? IC.vol : IC.mute) + '</button>' +
        '<button id="b-plan" class="icon-btn lit">' + IC.run + '</button>' +
      '</div>' +
    '</div>' +
    '<div class="plan-head">' +
      '<div class="plan-tabs">' +
        '<button class="ptab' + (ST.sheetTab === 'plan' ? ' on' : '') + '" data-pt="plan">Plan</button>' +
        '<button class="ptab' + (ST.sheetTab === 'hist' ? ' on' : '') + '" data-pt="hist">History</button>' +
      '</div>' +
      '<span class="sheet-count">' + totDone + '/' + totAll + '</span>' +
    '</div>' +
    '<div class="plan-scroll">' +
      (ST.sheetTab === 'plan' ? planRows : histRows) +
    '</div>';

  document.getElementById('app').innerHTML = html;
  bind();
}


function render() {
  try {
    maybeSave(); saveST(); syncBody();

    if (ST.view === 'plan') { renderPlan(); return; }

    var dy = curDay();
    var sg = curSegs();
    var curSeg = sg[ST.si] || null;
    var e = elapsed(), pr = prog();
    var pace = avgPace(), spd = avgSpeed();
    var smPts = smoothPts(ST.pts);
    var mPts = miniMapPts(smPts);
    var segDist = RF.segDist;
    var lp = latPt(), fp = ST.pts[0] || null;
    var extUrl = lp ? 'https://www.google.com/maps/search/?api=1&query=' + lp.lat + ',' + lp.lng : '';
    var totDone = Object.values(ST.done).filter(Boolean).length;
    var totAll = PROG.reduce(function(s, wk) { return s + wk.days.length; }, 0);
    var remain = Math.max(0, totSec() - e);
    var tp = curSeg ? curSeg.tp : 'idle';
    var segPct = (curSeg && ST.started && ST.tl > 0) ? (1 - ST.tl / curSeg.sec) : 0;

    // Segment label
    var lbl = 'Ready to run';
    if (ST.cd !== null) lbl = 'Get ready…';
    else if (ST.started && curSeg) lbl = curSeg.lbl;
    else if (!ST.started && e > 0 && ST.tl === 0) lbl = 'Workout complete!';

    // Sub label
    var sub = ST.started ? (tp === 'run' ? '— running —' : '— walking —') : '';

    // Start button label
    var startLbl;
    if (!ST.started && ST.cd === null) startLbl = 'Start';
    else if (ST.active) startLbl = tp === 'run' ? 'Running' : 'Walking';
    else startLbl = 'Resume';

    // Progress marks
    var cum = 0;
    var tot = totSec();
    var marks = sg.map(function(s) {
      cum += s.sec;
      return '<div class="sbar-mark" style="left:' + ((cum / tot) * 100).toFixed(2) + '%"></div>';
    }).join('');

    // Tab content
    var tabHTML = '';
    if (ST.tab === 'stats') {
      tabHTML = '<div class="stats-grid">' +
        '<div class="stat-tile"><div class="stat-lbl">Distance</div><div class="stat-val">' + fmtDist(ST.dist) + '</div><div class="stat-unit">GPS tracked</div></div>' +
        '<div class="stat-tile"><div class="stat-lbl">Avg Pace</div><div class="stat-val" style="font-size:22px">' + fmtPace(pace) + '</div><div class="stat-unit">per km</div></div>' +
        '<div class="stat-tile"><div class="stat-lbl">Speed</div><div class="stat-val" style="font-size:22px">' + fmtSpeed(spd) + '</div><div class="stat-unit">average</div></div>' +
        '<div class="stat-tile"><div class="stat-lbl">Split dist</div><div class="stat-val">' + fmtDist(segDist) + '</div><div class="stat-unit">this interval</div></div>' +
        '</div>';
    } else if (ST.tab === 'route') {
      var mapContent;
      if (mPts) {
        var pArr = mPts.split(' ');
        var s0 = (pArr[0] || '180,80').split(',');
        var sE = (pArr[pArr.length - 1] || '180,80').split(',');
        mapContent =
          '<polyline fill="none" stroke="url(#rg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="' + mPts + '"/>' +
          '<circle cx="' + s0[0] + '" cy="' + s0[1] + '" r="5" fill="#38d9f5"/>' +
          '<circle cx="' + sE[0] + '" cy="' + sE[1] + '" r="5" fill="#c8ff5a"/>' +
          '<rect x="10" y="10" width="78" height="26" rx="7" fill="rgba(0,0,0,.7)"/>' +
          '<text x="18" y="20" font-size="8" fill="#555e6e" font-family="monospace">DIST</text>' +
          '<text x="18" y="31" font-size="10" font-weight="600" fill="#e9ebf4" font-family="monospace">' + fmtDist(ST.dist) + '</text>';
      } else {
        mapContent = '<text x="180" y="80" text-anchor="middle" fill="rgba(255,255,255,.18)" font-size="11" font-family="monospace">NO ROUTE YET</text>';
      }
      var extLink = extUrl ? '<a href="' + extUrl + '" target="_blank" rel="noreferrer" class="gps-ext">' + IC.ext + ' Open in Google Maps</a>' : '';
      var errRow = ST.gpsErr ? '<div class="gps-err">&#9888; ' + ST.gpsErr + '</div>' : '';
      tabHTML = '<div class="route-card">' +
        '<div class="map-slot"></div>' +
        extLink + errRow +
        '</div>';
    } else {
      // Splits
      var splitRows = ST.splits.map(function(sp, idx) {
        var isCur = idx === ST.si && ST.started;
        var cEl = Math.max(0, sp.plan - ST.tl);
        var dD = isCur ? segDist : sp.dist;
        var dS = isCur ? cEl : (sp.actual || sp.plan);
        var dP = dD > 0 ? dS / (dD / 1000) : 0;
        return '<div class="split-row' + (isCur ? ' active' : '') + '">' +
          '<div><div class="split-name">' + sp.lbl + '</div><div class="split-type">' + sp.tp + ' · ' + fmtPace(dP) + '</div></div>' +
          '<div class="split-data"><div>' + fmtDist(dD) + '</div><div>' + fmtDur(dS) + '</div></div>' +
          '</div>';
      }).join('');
      tabHTML = '<div class="splits-list">' + splitRows + '</div>';
    }

    // Sheet content
    var sheetContent = '';
    if (ST.sheetTab === 'plan') {
      sheetContent = PROG.map(function(wk, wi) {
        var exp = ST.expW === wi;
        var daysHTML = '';
        if (exp) {
          daysHTML = '<div class="week-days">' + wk.days.map(function(dd, di) {
            var sel = ST.w === wi && ST.d === di;
            var dn = ST.done[dayKey(wi, di)];
            return '<button class="day-btn' + (sel ? ' sel' : '') + '" data-sw="' + wi + '" data-sd="' + di + '">' +
              '<div><div class="day-name">' + dd.t + '</div><div class="day-meta">' + totalMin(dd) + ' min</div></div>' +
              (dn ? '<span class="done-pill">✓ Done</span>' : '') +
              '</button>';
          }).join('') + '</div>';
        }
        return '<div class="week-block">' +
          '<div class="week-hd" data-tw="' + wi + '">' +
            '<div><div class="week-name">Week ' + wk.w + '</div>' +
            '<div class="week-meta">' + wk.days.length + ' workouts · ' + wk.days.map(function(dd) { return totalMin(dd); }).join(', ') + ' min</div></div>' +
            '<div class="week-chev' + (exp ? ' open' : '') + '">' + IC.chev + '</div>' +
          '</div>' + daysHTML +
          '</div>';
      }).join('');
    } else {
      if (ST.hist.length) {
        sheetContent = ST.hist.map(function(r) {
          return '<div class="hist-row">' +
            '<div class="hist-hd">' +
              '<div><div class="hist-title">Week ' + r.week + ' · ' + r.dayT + '</div>' +
              '<div class="hist-date">' + new Date(r.at).toLocaleString() + '</div></div>' +
              '<div class="hist-data"><div>' + fmtDist(r.dist) + '</div><div>' + fmtDur(r.sec) + '</div></div>' +
            '</div>' +
            '<div class="hist-tags">' +
              '<span class="tag">' + fmtPace(r.pace) + '</span>' +
              '<span class="tag">' + fmtSpeed(r.speed) + '</span>' +
              '<span class="tag">' + r.splits.length + ' splits</span>' +
            '</div></div>';
        }).join('') + '<button class="clear-btn" id="b-clear">Clear history</button>';
      } else {
        sheetContent = '<div class="empty">Complete a workout to see history here.</div>';
      }
    }

    var html =
      '<div class="topbar">' +
        '<div class="topbar-left">' +
          '<div class="topbar-eyebrow">Couch to 5K</div>' +
          '<div class="topbar-title">Week ' + (ST.w + 1) + ' · ' + dy.t + '</div>' +
        '</div>' +
        '<div class="topbar-right">' +
          '<button id="b-snd" class="icon-btn' + (ST.snd ? ' lit' : '') + '">' + (ST.snd ? IC.vol : IC.mute) + '</button>' +
          '<button id="b-plan" class="icon-btn' + (ST.view === 'plan' ? ' lit' : '') + '">' + IC.run + '</button>' +
        '</div>' +
      '</div>' +

      '<div class="ring-area">' +
        '<div class="ring-wrap">' +
          makeRing(tp, segPct) +
          '<div class="ring-inner">' +
            '<div class="ring-seg-label"><span class="seg-pip"></span>' + lbl + '</div>' +
            (ST.cd !== null
              ? (ST.cd > 0 ? '<div class="cnt-num">' + ST.cd + '</div>' : '<div class="cnt-go">GO</div>')
              : '<div class="ring-time" id="ring-time">' + fmtTime(ST.tl) + '</div>') +
            '<div class="ring-sub">' + sub + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="session-bar">' +
        '<div class="sbar-row">' +
          '<span class="sbar-pct" id="sbar-pct">' + pr + '%</span>' +
          '<span class="sbar-rem" id="sbar-rem">' + fmtTime(remain) + ' left</span>' +
        '</div>' +
        '<div class="sbar-track"><div class="sbar-fill" id="sbar-fill" style="width:' + pr + '%"></div></div>' +
        '<div class="sbar-marks">' + marks + '</div>' +
      '</div>' +

      '<div class="controls">' +
        '<button id="b-stop"  class="ctrl-side">Stop</button>' +
        '<button id="b-start" class="ctrl-main">' + startLbl + '</button>' +
        '<button id="b-pause" class="ctrl-side">Pause</button>' +
      '</div>' +

      '<div class="tab-bar">' +
        '<button class="tab-btn' + (ST.tab==='stats'?' active':'') + '" data-tab="stats">Stats</button>' +
        '<button class="tab-btn' + (ST.tab==='route'?' active':'') + '" data-tab="route">Route</button>' +
        '<button class="tab-btn' + (ST.tab==='splits'?' active':'') + '" data-tab="splits">Splits</button>' +
      '</div>' +

      '<div class="tab-content">' + tabHTML + '</div>';

    document.getElementById('app').innerHTML = html;
    bind();

    // Map: show if route tab, hide otherwise
    if (ST.tab === 'route' && ST.view !== 'plan') {
      mapInit();
      // If not yet tracking, get a one-shot position to centre the map
      if (!ST.started && !latPt() && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
          if (!MAP.instance) return;
          MAP.instance.setView([pos.coords.latitude, pos.coords.longitude], 15);
          var col = '#c8ff5a';
          if (MAP.dot) {
            MAP.dot.setLatLng([pos.coords.latitude, pos.coords.longitude]);
            if (!MAP.instance.hasLayer(MAP.dot)) MAP.dot.addTo(MAP.instance);
          }
        }, null, { enableHighAccuracy: true, timeout: 8000 });
      }
      requestAnimationFrame(mapPosition);
    } else {
      mapHide();
    }
  } catch(err) {
    console.error('Render error:', err);
    document.getElementById('app').innerHTML = '<div style="color:red;padding:40px;font-family:monospace">Error: ' + err.message + '</div>';
  }
}

/* ── BIND ────────────────────────────────────────────────────────── */
function addRipple(btn, ev) {
  var rc = btn.getBoundingClientRect(), sz = Math.max(rc.width, rc.height);
  var s = document.createElement('span');
  s.className = 'ripple';
  s.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;left:' + (ev.clientX-rc.left-sz/2) + 'px;top:' + (ev.clientY-rc.top-sz/2) + 'px';
  btn.appendChild(s);
  setTimeout(function() { s.remove(); }, 700);
}

function bind() {
  function $(id) { return document.getElementById(id); }

  var bStart = $('b-start'), bPause = $('b-pause'), bStop = $('b-stop');
  var bSnd = $('b-snd'), bPlan = $('b-plan'), bClear = $('b-clear');
  var scrim = $('scrim'), handle = $('sheet-handle');

  if (bStart) bStart.onclick = function(ev) { addRipple(bStart, ev); doStart(); };

  function bindLongPress(btn, action) {
    btn.addEventListener('touchstart',  function(ev) { lpStart(btn, action, ev); }, { passive: false });
    btn.addEventListener('touchend',    function()   { lpCancel(); });
    btn.addEventListener('touchcancel', function()   { lpCancel(); });
    // Desktop fallback
    btn.addEventListener('mousedown',   function(ev) { lpStart(btn, action, ev); });
    btn.addEventListener('mouseup',     function()   { lpCancel(); });
    btn.addEventListener('mouseleave',  function()   { lpCancel(); });
  }

  if (bPause) bindLongPress(bPause, doPause);
  if (bStop)  bindLongPress(bStop,  doStop);
  if (bSnd)   bSnd.onclick   = function() { ST.snd = !ST.snd; saveST(); render(); };
  if (bPlan)  bPlan.onclick  = function() { ST.view = ST.view === 'plan' ? 'workout' : 'plan'; render(); };
  if (bClear) bClear.onclick = function() { ST.hist = []; localStorage.removeItem(STORE.hist); render(); };

  document.querySelectorAll('[data-pt]').forEach(function(b) {
    b.onclick = function() { ST.sheetTab = b.dataset.pt; render(); };
  });

  document.querySelectorAll('[data-tab]').forEach(function(b) {
    b.onclick = function() { ST.tab = b.dataset.tab; render(); };
  });
  document.querySelectorAll('[data-stab]').forEach(function(b) {
    b.onclick = function() { ST.sheetTab = b.dataset.stab; render(); };
  });
  document.querySelectorAll('[data-tw]').forEach(function(b) {
    b.onclick = function(ev) {
      ev.stopPropagation();
      var wi = Number(b.dataset.tw);
      ST.expW = ST.expW === wi ? -1 : wi;
      render();
    };
  });
  document.querySelectorAll('[data-sw]').forEach(function(b) {
    b.onclick = function() { selWork(Number(b.dataset.sw), Number(b.dataset.sd)); ST.view = 'workout'; render(); };
  });
}

/* ── BOOT ────────────────────────────────────────────────────────── */
loadST();
resetAll();
render();
