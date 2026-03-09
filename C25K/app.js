/* ─── CONSTANTS ──────────────────────────────────────────────────── */
const STORAGE_KEYS = {
  completed: "c25k-completed-v2",
  sound: "c25k-sound-v2",
  history: "c25k-history-v2",
  selected: "c25k-selected-v2",
};

const PROGRAM = [
  { week:1, days:[
    {title:"Day 1",warmup:5,cooldown:5,intervals:[{run:1,walk:1.5,repeat:8}]},
    {title:"Day 2",warmup:5,cooldown:5,intervals:[{run:1,walk:1.5,repeat:8}]},
    {title:"Day 3",warmup:5,cooldown:5,intervals:[{run:1,walk:1.5,repeat:8}]},
  ]},
  { week:2, days:[
    {title:"Day 1",warmup:5,cooldown:5,intervals:[{run:1.5,walk:2,repeat:6}]},
    {title:"Day 2",warmup:5,cooldown:5,intervals:[{run:1.5,walk:2,repeat:6}]},
    {title:"Day 3",warmup:5,cooldown:5,intervals:[{run:1.5,walk:2,repeat:6}]},
  ]},
  { week:3, days:[
    {title:"Day 1",warmup:5,cooldown:5,intervals:[{run:1.5,walk:1.5,repeat:2},{run:3,walk:3,repeat:2}]},
    {title:"Day 2",warmup:5,cooldown:5,intervals:[{run:1.5,walk:1.5,repeat:2},{run:3,walk:3,repeat:2}]},
    {title:"Day 3",warmup:5,cooldown:5,intervals:[{run:2,walk:2,repeat:2},{run:4,walk:3,repeat:2}]},
  ]},
  { week:4, days:[
    {title:"Day 1",warmup:5,cooldown:5,intervals:[{run:3,walk:1.5,repeat:2},{run:5,walk:2.5,repeat:2}]},
    {title:"Day 2",warmup:5,cooldown:5,intervals:[{run:3,walk:1.5,repeat:2},{run:5,walk:2.5,repeat:2}]},
    {title:"Day 3",warmup:5,cooldown:5,intervals:[{run:4,walk:2,repeat:2},{run:5,walk:2,repeat:2}]},
  ]},
  { week:5, days:[
    {title:"Day 1",warmup:5,cooldown:5,intervals:[{run:5,walk:3,repeat:2},{run:5,walk:0,repeat:1}]},
    {title:"Day 2",warmup:5,cooldown:5,intervals:[{run:8,walk:5,repeat:1},{run:8,walk:0,repeat:1}]},
    {title:"Day 3",warmup:5,cooldown:5,intervals:[{run:20,walk:0,repeat:1}]},
  ]},
  { week:6, days:[
    {title:"Day 1",warmup:5,cooldown:5,intervals:[{run:5,walk:3,repeat:1},{run:8,walk:3,repeat:1},{run:5,walk:0,repeat:1}]},
    {title:"Day 2",warmup:5,cooldown:5,intervals:[{run:10,walk:3,repeat:1},{run:10,walk:0,repeat:1}]},
    {title:"Day 3",warmup:5,cooldown:5,intervals:[{run:22,walk:0,repeat:1}]},
  ]},
  { week:7, days:[
    {title:"Day 1",warmup:5,cooldown:5,intervals:[{run:25,walk:0,repeat:1}]},
    {title:"Day 2",warmup:5,cooldown:5,intervals:[{run:25,walk:0,repeat:1}]},
    {title:"Day 3",warmup:5,cooldown:5,intervals:[{run:28,walk:0,repeat:1}]},
  ]},
  { week:8, days:[
    {title:"Day 1",warmup:5,cooldown:5,intervals:[{run:30,walk:0,repeat:1}]},
    {title:"Day 2",warmup:5,cooldown:5,intervals:[{run:30,walk:0,repeat:1}]},
    {title:"5K Day",warmup:5,cooldown:5,intervals:[{run:35,walk:0,repeat:1}]},
  ]},
];

/* ─── ICONS ──────────────────────────────────────────────────────── */
const IC = {
  volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 14h3l4 3V7L7 10H4v4Z" fill="currentColor" stroke="none"/><path d="M15 9.5a4 4 0 0 1 0 5"/><path d="M17.5 7a7.5 7.5 0 0 1 0 10"/></svg>`,
  mute:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 14h3l4 3V7L7 10H4v4Z" fill="currentColor" stroke="none"/><path d="M17 9l4 4m0-4-4 4"/></svg>`,
  plan:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  center: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>`,
  ext:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5h5v5"/><path d="M10 14 19 5"/><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/></svg>`,
  chev:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
};

/* ─── PURE UTILS ─────────────────────────────────────────────────── */
const fmt = {
  time(s) {
    const n = Math.max(0, Math.floor(s||0));
    return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
  },
  dur(s) {
    const n = Math.max(0, Math.floor(s||0));
    return `${Math.floor(n/60)}m ${String(n%60).padStart(2,'0')}s`;
  },
  dist(m) {
    if (!m || m < 1) return '0 m';
    return m < 1000 ? `${Math.round(m)} m` : `${(m/1000).toFixed(2)} km`;
  },
  pace(spk) {
    if (!Number.isFinite(spk) || spk <= 0) return '--:--';
    const m = Math.floor(spk/60), s = Math.round(spk%60);
    return s===60 ? `${m+1}:00 /km` : `${m}:${String(s).padStart(2,'0')} /km`;
  },
  speed(mps) {
    if (!Number.isFinite(mps) || mps <= 0) return '0.0 km/h';
    return `${(mps*3.6).toFixed(1)} km/h`;
  },
};

function dayKey(w, d) { return `w${w+1}-d${d+1}`; }

function haversine(a, b) {
  const R=6371000, dLat=((b.lat-a.lat)*Math.PI/180), dLon=((b.lng-a.lng)*Math.PI/180);
  const x=Math.sin(dLat/2)**2+Math.sin(dLon/2)**2*Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180);
  return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

function smoothPts(pts) {
  if (pts.length<=2) return pts;
  return pts.map((p,i)=>{
    if(i===0||i===pts.length-1) return p;
    return {
      ...p,
      lat:(pts[i-1].lat+p.lat+pts[i+1].lat)/3,
      lng:(pts[i-1].lng+p.lng+pts[i+1].lng)/3,
    };
  });
}

function buildSegments(day) {
  const s=[{label:'Warm-up',type:'walk',seconds:Math.round(day.warmup*60)}];
  day.intervals.forEach(b=>{
    for(let i=0;i<b.repeat;i++){
      if(b.run)  s.push({label:`Run ${b.run} min`,  type:'run',  seconds:Math.round(b.run*60)});
      if(b.walk) s.push({label:`Walk ${b.walk} min`,type:'walk', seconds:Math.round(b.walk*60)});
    }
  });
  s.push({label:'Cool-down',type:'walk',seconds:Math.round(day.cooldown*60)});
  return s;
}

function totalMin(day) {
  return day.warmup + day.cooldown + day.intervals.reduce((s,i)=>(s+(i.run+i.walk)*i.repeat),0);
}

function miniMapPts(pts, W=320, H=140, P=12) {
  if(!pts.length) return '';
  if(pts.length===1) return `${W/2},${H/2}`;
  const lats=pts.map(p=>p.lat), lngs=pts.map(p=>p.lng);
  const minLat=Math.min(...lats), maxLat=Math.max(...lats);
  const minLng=Math.min(...lngs), maxLng=Math.max(...lngs);
  const lr=Math.max(maxLat-minLat,0.00001), lgr=Math.max(maxLng-minLng,0.00001);
  return pts.map(p=>{
    const x=P+((p.lng-minLng)/lgr)*(W-P*2);
    const y=H-P-((p.lat-minLat)/lr)*(H-P*2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

function emptySplits(segs) {
  return segs.map((s,i)=>({index:i,label:s.label,type:s.type,plannedSec:s.seconds,actualSec:0,dist:0}));
}

function mapsEmbed(p) { return p ? `https://www.google.com/maps?q=${p.lat},${p.lng}&z=16&output=embed` : ''; }
function mapsExt(p)   { return p ? `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}` : ''; }

function buildRecord({week,day,elapsed,dist,pace,speed,pts,splits}) {
  return {
    id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    at: new Date().toISOString(),
    week:week+1, dayTitle:day.title,
    totalSec:elapsed, dist, pace, speed, pts, splits,
  };
}

function mkBeeps(play) {
  return {
    countdown(v) {
      if(v<=0) play(1320,.22,'triangle',.06);
      else play(v<=3?1046:880, v<=3?.18:.12,'sine',.05);
    },
    final(v) { play(v<=3?1046:880, v<=3?.18:.12,'sine',.05); },
    change(type) {
      if(type==='run') { play(880,.12,'triangle',.05); setTimeout(()=>play(1174,.16,'triangle',.05),120); }
      else             { play(659,.12,'triangle',.05); setTimeout(()=>play(523,.16,'triangle',.05),120); }
    },
    finish() {
      play(784,.14,'triangle',.05);
      setTimeout(()=>play(988,.18,'triangle',.05),160);
      setTimeout(()=>play(1318,.24,'triangle',.05),340);
    },
  };
}

/* ─── TESTS ──────────────────────────────────────────────────────── */
function runTests() {
  if(haversine({lat:0,lng:0},{lat:0,lng:0.001})<=0) throw new Error('haversine');
  if(fmt.dist(1200)!=='1.20 km') throw new Error('dist');
  if(fmt.pace(360)!=='6:00 /km') throw new Error('pace');
  if(fmt.speed(2.7777778)!=='10.0 km/h') throw new Error('speed');
  if(fmt.time(75)!=='1:15') throw new Error('time');
  if(fmt.dur(75)!=='1m 15s') throw new Error('dur');
  if(dayKey(0,0)!=='w1-d1') throw new Error('dayKey');
  const s=smoothPts([{lat:1,lng:1},{lat:2,lng:2},{lat:3,lng:3}]);
  if(s[1].lat!==2) throw new Error('smooth');
  const pts=miniMapPts([{lat:-37.81,lng:144.96},{lat:-37.82,lng:144.97}]);
  if(!pts.includes(',')) throw new Error('miniMap');
  const sp=emptySplits([{label:'x',type:'run',seconds:60}]);
  if(sp.length!==1||sp[0].dist!==0) throw new Error('splits');
  const calls=[]; const b=mkBeeps(f=>calls.push(f));
  b.countdown(3); b.final(10);
  if(calls.length!==2) throw new Error('beeps');
  const rec=buildRecord({week:0,day:{title:'Day 1'},elapsed:600,dist:1200,pace:500,speed:2.4,pts:[],splits:[]});
  if(rec.week!==1||rec.dayTitle!=='Day 1') throw new Error('record');
  if(buildSegments(PROGRAM[0].days[0]).length!==18) throw new Error('segs');
}

/* ─── STATE ──────────────────────────────────────────────────────── */
const ST = {
  selWeek:0, selDay:0,
  active:false, started:false,
  segIdx:0, timeLeft:0,
  dist:0, pts:[], gpsErr:'', splits:[],
  countdown:null, soundOn:true,
  completed:{}, history:[],
  expandedWeek:0,
  panel:0,            // 0=stats 1=route 2=splits
  sheetOpen:false,
  sheetTab:'plan',    // plan|history
  autoCenter:true,
};

const RF = {
  watchId:null, lastPos:null,
  segDist:0, segStart:Date.now(),
  audio:null, cdInterval:null,
  tenBeep:null, segBeep:0,
  saved:false, timerInterval:null,
};

/* ─── DERIVED ────────────────────────────────────────────────────── */
function curDay()  { return PROGRAM[ST.selWeek].days[ST.selDay]; }
function curSegs() { return buildSegments(curDay()); }

function totalSec() { return curSegs().reduce((s,seg)=>s+seg.seconds,0); }

function elapsed() {
  const segs=curSegs();
  const done=segs.slice(0,ST.segIdx).reduce((s,sg)=>s+sg.seconds,0);
  const cur=segs[ST.segIdx]?.seconds||0;
  return Math.max(0,done+(cur-ST.timeLeft));
}

function progress() {
  const t=totalSec(); const e=elapsed();
  return t ? Math.round((e/t)*100) : 0;
}

function avgPace()  { const e=elapsed(); return ST.dist>0 ? e/(ST.dist/1000) : 0; }
function avgSpeed() { const e=elapsed(); return e>0 ? ST.dist/e : 0; }
function latPt()    { return ST.pts[ST.pts.length-1]||RF.lastPos; }
function firstPt()  { return ST.pts[0]||null; }

/* ─── STORAGE ────────────────────────────────────────────────────── */
function load() {
  try {
    const c=localStorage.getItem(STORAGE_KEYS.completed);
    const snd=localStorage.getItem(STORAGE_KEYS.sound);
    const h=localStorage.getItem(STORAGE_KEYS.history);
    const sel=localStorage.getItem(STORAGE_KEYS.selected);
    if(c) ST.completed=JSON.parse(c);
    if(snd!==null) ST.soundOn=snd==='true';
    if(h) ST.history=JSON.parse(h);
    if(sel){ const p=JSON.parse(sel); ST.selWeek=p.week??0; ST.selDay=p.day??0; ST.expandedWeek=p.week??0; }
  } catch(e){ console.error(e); }
}

function save() {
  localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(ST.completed));
  localStorage.setItem(STORAGE_KEYS.sound, String(ST.soundOn));
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(ST.history));
  localStorage.setItem(STORAGE_KEYS.selected, JSON.stringify({week:ST.selWeek,day:ST.selDay}));
}

/* ─── AUDIO ──────────────────────────────────────────────────────── */
function playTone(freq=880,dur=0.12,type='sine',vol=0.05) {
  if(!ST.soundOn) return;
  try {
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx) return;
    if(!RF.audio) RF.audio=new Ctx();
    const ctx=RF.audio, now=ctx.currentTime;
    const osc=ctx.createOscillator(), gain=ctx.createGain();
    osc.type=type; osc.frequency.setValueAtTime(freq,now);
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0.0001,now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001,vol),now+0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001,now+dur);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now+dur+0.03);
  } catch(e){ console.error(e); }
}

const beeps=mkBeeps(playTone);

async function resumeAudio() {
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx) return;
  if(!RF.audio) RF.audio=new Ctx();
  if(RF.audio.state==='suspended') await RF.audio.resume();
}

/* ─── TIMER LOGIC ────────────────────────────────────────────────── */
function clearCd() {
  if(RF.cdInterval){ clearInterval(RF.cdInterval); RF.cdInterval=null; }
  ST.countdown=null;
}

function resetTimer() {
  clearCd();
  ST.active=false; ST.started=false;
  ST.segIdx=0; ST.timeLeft=curSegs()[0]?.seconds||0;
  ST.dist=0; ST.pts=[]; ST.gpsErr=''; ST.splits=emptySplits(curSegs());
  RF.lastPos=null; RF.segDist=0; RF.segStart=Date.now();
  RF.tenBeep=null; RF.segBeep=0; RF.saved=false;
  stopGeo(); stopTimer();
}

function finalizeSplit(idx, override=null) {
  ST.splits=ST.splits.map((sp,i)=>{
    if(i!==idx) return sp;
    return {...sp, dist:RF.segDist, actualSec:override??Math.max(0,Math.round((Date.now()-RF.segStart)/1000))};
  });
  RF.segDist=0; RF.segStart=Date.now();
}

function stopGeo() {
  if(RF.watchId!==null&&navigator.geolocation){ navigator.geolocation.clearWatch(RF.watchId); RF.watchId=null; }
}

function startGeo() {
  if(!ST.started) return;
  if(!navigator.geolocation){ ST.gpsErr='Geolocation not available.'; render(); return; }
  stopGeo();
  RF.watchId=navigator.geolocation.watchPosition(
    pos=>{
      ST.gpsErr='';
      const acc=pos.coords.accuracy??0;
      const pt={lat:pos.coords.latitude,lng:pos.coords.longitude,timestamp:pos.timestamp,accuracy:acc};
      if(acc>35){ render(); return; }
      ST.pts.push(pt);
      if(RF.lastPos){ const d=haversine(RF.lastPos,pt); if(d>=0.8&&d<=80){ ST.dist+=d; RF.segDist+=d; } }
      RF.lastPos=pt; render();
    },
    err=>{
      const msgs=['','Location permission denied.','Position unavailable.','Location timed out.'];
      ST.gpsErr=msgs[err.code]||'GPS error.'; render();
    },
    {enableHighAccuracy:true,timeout:10000,maximumAge:1500}
  );
}

function stopTimer() {
  if(RF.timerInterval){ clearInterval(RF.timerInterval); RF.timerInterval=null; }
}

function maybeSave() {
  const e=elapsed();
  if(ST.started||ST.active||ST.timeLeft!==0||RF.saved) return;
  if(!curSegs().length||e<=0) return;
  RF.saved=true;
  ST.history=[
    buildRecord({week:ST.selWeek,day:curDay(),elapsed:e,dist:ST.dist,pace:avgPace(),speed:avgSpeed(),pts:ST.pts,splits:ST.splits}),
    ...ST.history
  ].slice(0,30);
  save();
}

function beepCountdown() {
  if(!ST.started||!ST.active){ RF.tenBeep=null; return; }
  if(ST.timeLeft<=10&&ST.timeLeft>0&&RF.tenBeep!==ST.timeLeft){ beeps.final(ST.timeLeft); RF.tenBeep=ST.timeLeft; }
  if(ST.timeLeft>10) RF.tenBeep=null;
}

function beepChange() {
  if(!ST.started||!ST.active) return;
  if(ST.segIdx!==RF.segBeep){
    if(ST.segIdx>0) beeps.change(curSegs()[ST.segIdx]?.type||'walk');
    RF.segBeep=ST.segIdx;
  }
}

function startTick() {
  stopTimer();
  RF.timerInterval=setInterval(()=>{
    if(ST.timeLeft>1){ ST.timeLeft-=1; beepCountdown(); render(); return; }
    const segs=curSegs(), cur=ST.segIdx, nxt=cur+1;
    finalizeSplit(cur, segs[cur]?.seconds||0);
    if(nxt>=segs.length){
      ST.active=false; ST.started=false; ST.timeLeft=0;
      beeps.finish();
      ST.completed[dayKey(ST.selWeek,ST.selDay)]=true;
      save(); stopTimer(); stopGeo(); maybeSave(); render(); return;
    }
    ST.segIdx=nxt; ST.timeLeft=segs[nxt].seconds;
    beepChange(); render();
  },1000);
}

/* ─── ACTIONS ────────────────────────────────────────────────────── */
async function start() {
  await resumeAudio();
  if(ST.started){ ST.active=true; startTick(); beepCountdown(); render(); return; }
  clearCd();
  ST.active=false; ST.started=false;
  ST.segIdx=0; ST.timeLeft=curSegs()[0]?.seconds||0;
  RF.saved=false; ST.dist=0; ST.pts=[]; ST.gpsErr=''; ST.splits=emptySplits(curSegs());
  RF.lastPos=null; RF.segDist=0; RF.segStart=Date.now();
  RF.tenBeep=null; RF.segBeep=0;

  let c=3; ST.countdown=c; beeps.countdown(c); render();
  RF.cdInterval=setInterval(()=>{
    c-=1;
    if(c>0){ ST.countdown=c; beeps.countdown(c); render(); return; }
    ST.countdown=0; beeps.countdown(0); render();
    clearInterval(RF.cdInterval); RF.cdInterval=null;
    setTimeout(()=>{
      clearCd();
      ST.started=true; ST.active=true;
      ST.segIdx=0; ST.timeLeft=curSegs()[0]?.seconds||0;
      RF.segStart=Date.now(); RF.segBeep=0;
      startGeo(); startTick(); render();
    },250);
  },1000);
}

function pause()  { clearCd(); ST.active=false; stopTimer(); render(); }
function stop()   { resetTimer(); render(); }

function selectWorkout(w,d) {
  clearCd(); RF.saved=false;
  ST.selWeek=w; ST.selDay=d;
  ST.active=false; ST.started=false;
  ST.dist=0; ST.pts=[]; ST.gpsErr='';
  RF.lastPos=null; RF.segDist=0; RF.segStart=Date.now();
  ST.timeLeft=curSegs()[0]?.seconds||0;
  ST.splits=emptySplits(curSegs());
  stopTimer(); stopGeo(); save(); render();
}

function clearHistory() { ST.history=[]; localStorage.removeItem(STORAGE_KEYS.history); render(); }
function toggleSound()  { ST.soundOn=!ST.soundOn; save(); render(); }
function toggleAutoCenter() { ST.autoCenter=!ST.autoCenter; render(); }

/* ─── SWIPE STATE ────────────────────────────────────────────────── */
const swipe = { startX:0, startY:0, dragging:false, locked:false };

function initSwipe(track) {
  const PANELS=3;
  track.addEventListener('touchstart', e=>{
    swipe.startX=e.touches[0].clientX;
    swipe.startY=e.touches[0].clientY;
    swipe.dragging=true; swipe.locked=false;
  },{passive:true});
  track.addEventListener('touchmove', e=>{
    if(!swipe.dragging||swipe.locked) return;
    const dx=e.touches[0].clientX-swipe.startX;
    const dy=e.touches[0].clientY-swipe.startY;
    if(!swipe.locked){
      if(Math.abs(dy)>Math.abs(dx)){ swipe.locked=true; swipe.dragging=false; return; }
    }
    e.preventDefault();
    const base=-ST.panel*100;
    const drag=(dx/track.offsetWidth)*100;
    track.style.transition='none';
    track.style.transform=`translateX(${base+drag}%)`;
  },{passive:false});
  track.addEventListener('touchend', e=>{
    if(!swipe.dragging){ swipe.dragging=false; return; }
    const dx=e.changedTouches[0].clientX-swipe.startX;
    swipe.dragging=false;
    track.style.transition='';
    if(Math.abs(dx)>44){
      if(dx<0&&ST.panel<PANELS-1) ST.panel++;
      else if(dx>0&&ST.panel>0) ST.panel--;
    }
    track.style.transform=`translateX(${-ST.panel*100}%)`;
    updateDots();
  },{passive:true});
}

function updateDots() {
  document.querySelectorAll('.panel-dot').forEach((d,i)=>{
    d.classList.toggle('active', i===ST.panel);
  });
}

/* ─── SHEET DRAG ─────────────────────────────────────────────────── */
const sheetDrag = { startY:0, startT:0 };

function initSheet(sheet, handle) {
  let dragging=false, startY=0, startT=0;
  function open()  { ST.sheetOpen=true;  sheet.classList.add('open');    document.getElementById('sheet-scrim').classList.add('visible'); }
  function close() { ST.sheetOpen=false; sheet.classList.remove('open'); document.getElementById('sheet-scrim').classList.remove('visible'); }

  handle.addEventListener('click', ()=>{ ST.sheetOpen ? close() : open(); });
  document.getElementById('sheet-scrim').addEventListener('click', ()=>close());

  handle.addEventListener('touchstart', e=>{ dragging=true; startY=e.touches[0].clientY; startT=Date.now(); sheet.style.transition='none'; },{passive:true});
  handle.addEventListener('touchmove', e=>{
    if(!dragging) return;
    const dy=e.touches[0].clientY-startY;
    const baseY=ST.sheetOpen ? 0 : (sheet.offsetHeight-68);
    const newY=Math.max(0, Math.min(sheet.offsetHeight-68, baseY+dy));
    sheet.style.transform=`translateY(${newY}px)`;
  },{passive:true});
  handle.addEventListener('touchend', e=>{
    if(!dragging) return; dragging=false;
    sheet.style.transition='';
    const dy=e.changedTouches[0].clientY-startY;
    const dt=Date.now()-startT;
    const vel=dy/dt;
    if(!ST.sheetOpen){ if(dy<-40||vel<-0.4) open(); else close(); }
    else             { if(dy>40||vel>0.4)  close(); else open(); }
  },{passive:true});
}

/* ─── BODY STATE ─────────────────────────────────────────────────── */
function syncBodyState() {
  document.body.classList.remove('s-run','s-walk');
  if(!ST.started) return;
  const seg=curSegs()[ST.segIdx];
  if(seg?.type==='run')  document.body.classList.add('s-run');
  if(seg?.type==='walk') document.body.classList.add('s-walk');
}

/* ─── SWEEP UPDATE ───────────────────────────────────────────────── */
function updateSweep() {
  const sweep=document.getElementById('seg-sweep');
  if(!sweep) return;
  const seg=curSegs()[ST.segIdx];
  if(ST.started && seg && ST.timeLeft > 0) {
    const elapsed_pct=(1 - ST.timeLeft/seg.seconds)*100;
    sweep.style.clipPath=`inset(0 ${elapsed_pct.toFixed(1)}% 0 0)`;
  } else {
    sweep.style.clipPath='inset(0 100% 0 0)';
  }
}

/* ─── RIPPLE ─────────────────────────────────────────────────────── */
function ripple(btn, e) {
  const r=btn.getBoundingClientRect();
  const sz=Math.max(r.width,r.height);
  const span=document.createElement('span');
  span.className='ripple';
  span.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-r.left-sz/2}px;top:${e.clientY-r.top-sz/2}px`;
  btn.appendChild(span);
  setTimeout(()=>span.remove(),700);
}

/* ─── RENDER ─────────────────────────────────────────────────────── */
let _initDone=false;

function render() {
  maybeSave(); save();
  syncBodyState(); updateSweep();

  const day=curDay(), segs=curSegs();
  const seg=segs[ST.segIdx]||null;
  const e=elapsed(), prog=progress();
  const pace=avgPace(), spd=avgSpeed();
  const smPts=smoothPts(ST.pts);
  const mapPts=miniMapPts(smPts);
  const segDist=RF.segDist;
  const latest=latPt(), first=firstPt();
  const embedUrl=mapsEmbed(latest), extUrl=mapsExt(latest);
  const totalDone=Object.values(ST.completed).filter(Boolean).length;
  const totalAll=PROGRAM.reduce((s,w)=>s+w.days.length,0);
  const remain=Math.max(0, totalSec()-e);

  // Segment label text
  let segLabelText='Ready to run';
  if(ST.countdown!==null) segLabelText='Get ready…';
  else if(ST.started && seg) segLabelText=seg.label;
  else if(!ST.started && e>0 && ST.timeLeft===0) segLabelText='Workout complete!';

  const segType=seg?.type||'idle';

  // Segment markers for progress bar
  let cumSec=0;
  const markerHtml=segs.map(s=>{
    cumSec+=s.seconds;
    const pct=(cumSec/totalSec())*100;
    return `<div class="seg-marker" style="left:${pct.toFixed(2)}%"></div>`;
  }).join('');

  const app=document.getElementById('app');

  app.innerHTML=`
<!-- TOP BAR -->
<div class="top-bar">
  <div class="top-label">
    <span class="top-eyebrow">Couch to 5K</span>
    <span class="top-title">Week ${ST.selWeek+1} · ${day.title}</span>
  </div>
  <div class="top-right">
    <button id="btn-sound" class="icon-btn ${ST.soundOn?'active':''}" title="${ST.soundOn?'Mute':'Unmute'}">
      ${ST.soundOn ? IC.volume : IC.mute}
    </button>
    <button id="btn-plan" class="icon-btn" title="Workout plan">
      ${IC.plan}
    </button>
  </div>
</div>

<!-- HERO -->
<div class="hero-area">
  <div class="segment-label">
    <span class="seg-dot"></span>
    ${segLabelText}
  </div>

  ${ST.countdown !== null
    ? (ST.countdown > 0
        ? `<div class="countdown-num">${ST.countdown}</div>`
        : `<div class="countdown-go">GO</div>`)
    : `<div class="big-time">${fmt.time(ST.timeLeft)}</div>`
  }

  <div class="time-sub">
    ${ST.started ? (segType==='run' ? '— running —' : '— walking —') : (e>0&&ST.timeLeft===0?'— done —':'— tap start —')}
  </div>
</div>

<!-- SESSION PROGRESS -->
<div class="session-progress">
  <div class="progress-row">
    <span class="progress-pct">${prog}%</span>
    <span class="progress-remain">${fmt.time(remain)} left</span>
  </div>
  <div class="progress-track">
    <div class="progress-fill" style="width:${prog}%"></div>
  </div>
  <div class="seg-markers">${markerHtml}</div>
</div>

<!-- CONTROLS -->
<div class="controls">
  <button id="btn-stop" class="ctrl-ghost">Stop</button>
  <button id="btn-start" class="ctrl-main">
    ${ST.active ? 'Running' : (ST.started ? 'Resume' : 'Start')}
  </button>
  <button id="btn-pause" class="ctrl-ghost">Pause</button>
</div>

<!-- SWIPE PANELS -->
<div class="panels-wrap">
  <div class="panels-track" id="panels-track" style="transform:translateX(${-ST.panel*100}%)">

    <!-- Stats -->
    <div class="panel">
      <div class="stats-grid">
        <div class="stat-tile">
          <div class="stat-lbl">Distance</div>
          <div class="stat-val">${fmt.dist(ST.dist)}</div>
          <div class="stat-unit">GPS tracked</div>
        </div>
        <div class="stat-tile">
          <div class="stat-lbl">Avg Pace</div>
          <div class="stat-val" style="font-size:22px">${fmt.pace(pace)}</div>
          <div class="stat-unit">per km</div>
        </div>
        <div class="stat-tile">
          <div class="stat-lbl">Speed</div>
          <div class="stat-val" style="font-size:22px">${fmt.speed(spd)}</div>
          <div class="stat-unit">average</div>
        </div>
        <div class="stat-tile">
          <div class="stat-lbl">Split dist</div>
          <div class="stat-val">${fmt.dist(segDist)}</div>
          <div class="stat-unit">this interval</div>
        </div>
      </div>
    </div>

    <!-- Route -->
    <div class="panel">
      <div class="route-panel">
        <div class="mini-map-wrap">
          <svg viewBox="0 0 320 140" class="mini-map-svg">
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#38d9f5"/>
                <stop offset="100%" stop-color="#c8ff5a"/>
              </linearGradient>
            </defs>
            <rect width="320" height="140" fill="#0a0c14"/>
            ${mapPts ? (()=>{
              const pts=mapPts.split(' ');
              const [sx,sy]=(pts[0]||'160,70').split(',');
              const [ex,ey]=(pts[pts.length-1]||'160,70').split(',');
              return `
                <polyline fill="none" stroke="url(#rg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${mapPts}" opacity="0.9"/>
                <circle cx="${sx}" cy="${sy}" r="5" fill="#38d9f5"/>
                <circle cx="${ex}" cy="${ey}" r="5" fill="#c8ff5a"/>
                <rect x="8" y="8" width="80" height="26" rx="8" fill="rgba(0,0,0,0.7)"/>
                <text x="16" y="19" font-size="8" fill="#555e6e" font-family="JetBrains Mono,monospace">DIST</text>
                <text x="16" y="30" font-size="10" font-weight="600" fill="#e8eaf2" font-family="JetBrains Mono,monospace">${fmt.dist(ST.dist)}</text>
              `;
            })() : `<text x="160" y="70" text-anchor="middle" fill="rgba(255,255,255,0.18)" font-size="11" font-family="JetBrains Mono,monospace">NO ROUTE YET</text>`}
          </svg>
        </div>
        ${first||latest ? `
          <div class="gps-row">
            <div class="gps-tile"><strong>Start</strong>${first?`${first.lat.toFixed(5)}, ${first.lng.toFixed(5)}`:'—'}</div>
            <div class="gps-tile"><strong>Current</strong>${latest?`${latest.lat.toFixed(5)}, ${latest.lng.toFixed(5)}`:'—'}</div>
          </div>` : ''}
        ${extUrl ? `<a href="${extUrl}" target="_blank" rel="noreferrer" style="display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:10px;color:var(--text-3);padding-top:4px">${IC.ext} Open in Google Maps</a>` : ''}
        ${ST.gpsErr ? `<div class="error-row">⚠ ${ST.gpsErr}</div>` : ''}
      </div>
    </div>

    <!-- Splits -->
    <div class="panel">
      <div class="splits-list">
        ${ST.splits.map((sp,idx)=>{
          const isCur=idx===ST.segIdx&&ST.started;
          const curEl=Math.max(0,sp.plannedSec-ST.timeLeft);
          const dDist=isCur?segDist:sp.dist;
          const dSec=isCur?curEl:(sp.actualSec||sp.plannedSec);
          const dPace=dDist>0?dSec/(dDist/1000):0;
          return `<div class="split-row ${isCur?'active':''}">
            <div>
              <div class="split-name">${sp.label}</div>
              <div class="split-type">${sp.type} · ${fmt.pace(dPace)}</div>
            </div>
            <div class="split-data">
              <div>${fmt.dist(dDist)}</div>
              <div>${fmt.dur(dSec)}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

  </div>
</div>

<!-- PANEL DOTS -->
<div class="panel-dots">
  ${['Stats','Route','Splits'].map((l,i)=>`<div class="panel-dot ${i===ST.panel?'active':''}" title="${l}"></div>`).join('')}
</div>

<!-- SHEET SCRIM -->
<div id="sheet-scrim"></div>

<!-- BOTTOM SHEET -->
<div class="plan-sheet ${ST.sheetOpen?'open':''}" id="plan-sheet">
  <div class="sheet-handle-area" id="sheet-handle">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div>
        <div class="sheet-title">Workout Plan</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="sheet-tabs">
          <button class="sheet-tab ${ST.sheetTab==='plan'?'active':''}" data-sheet-tab="plan">Plan</button>
          <button class="sheet-tab ${ST.sheetTab==='history'?'active':''}" data-sheet-tab="history">History</button>
        </div>
        <span style="font-family:var(--font-mono);font-size:9px;color:var(--text-3)">${totalDone}/${totalAll}</span>
      </div>
    </div>
  </div>

  <div class="sheet-body">
    ${ST.sheetTab==='plan' ? `
      <div class="plan-weeks">
        ${PROGRAM.map((wk,wi)=>{
          const exp=ST.expandedWeek===wi;
          return `<div class="week-block">
            <div class="week-row" data-toggle-week="${wi}">
              <div>
                <div class="week-name">Week ${wk.week}</div>
                <div class="week-meta">${wk.days.length} workouts · ${wk.days.map(d=>totalMin(d)).join(', ')} min</div>
              </div>
              <div class="week-chev ${exp?'open':''}">${IC.chev}</div>
            </div>
            ${exp ? `<div class="week-days">
              ${wk.days.map((d,di)=>{
                const sel=ST.selWeek===wi&&ST.selDay===di;
                const done=ST.completed[dayKey(wi,di)];
                return `<button class="day-btn ${sel?'selected':''}" data-sel-w="${wi}" data-sel-d="${di}">
                  <div>
                    <div class="day-name">${d.title}</div>
                    <div class="day-meta">${totalMin(d)} min</div>
                  </div>
                  ${done?`<span class="done-badge">✓ Done</span>`:''}
                </button>`;
              }).join('')}
            </div>` : ''}
          </div>`;
        }).join('')}
      </div>
    ` : `
      <div class="history-list">
        ${ST.history.length ? ST.history.map(r=>`
          <div class="hist-row">
            <div class="hist-head">
              <div>
                <div class="hist-title">Week ${r.week} · ${r.dayTitle}</div>
                <div class="hist-date">${new Date(r.at).toLocaleString()}</div>
              </div>
              <div class="hist-data">
                <div>${fmt.dist(r.dist)}</div>
                <div>${fmt.dur(r.totalSec)}</div>
              </div>
            </div>
            <div class="hist-tags">
              <span class="tag">${fmt.pace(r.pace)}</span>
              <span class="tag">${fmt.speed(r.speed)}</span>
              <span class="tag">${r.splits.length} splits</span>
            </div>
          </div>`).join('')
          : `<div class="empty-state">Complete a workout to see your history here.</div>`}
        ${ST.history.length ? `<button id="btn-clear" style="margin-top:8px;width:100%;height:40px;border-radius:999px;background:rgba(255,255,255,0.04);border:1px solid var(--line);font-size:12px;font-weight:700;color:var(--text-3);cursor:pointer">Clear history</button>` : ''}
      </div>
    `}
  </div>
</div>
  `;

  bindEvents();
  if(!_initDone){ _initDone=true; }

  // Update map iframe src only if needed
  if(ST.autoCenter && latest && embedUrl) {
    const iframe=document.getElementById('map-iframe');
    if(iframe && iframe.src!==embedUrl) iframe.src=embedUrl;
  }
}

/* ─── BIND ───────────────────────────────────────────────────────── */
function bindEvents() {
  const $=id=>document.getElementById(id);
  const btnStart=$('btn-start'), btnPause=$('btn-pause'), btnStop=$('btn-stop');
  const btnSound=$('btn-sound'), btnPlan=$('btn-plan');
  const sheet=$('plan-sheet'), handle=$('sheet-handle'), scrim=$('sheet-scrim');
  const track=$('panels-track');
  const btnClear=$('btn-clear');

  if(btnStart) btnStart.onclick=e=>{ ripple(btnStart,e); start(); };
  if(btnPause) btnPause.onclick=e=>{ ripple(btnPause,e); pause(); };
  if(btnStop)  btnStop.onclick=e=>{ ripple(btnStop,e);  stop(); };
  if(btnSound) btnSound.onclick=toggleSound;
  if(btnPlan)  btnPlan.onclick=()=>{ ST.sheetOpen=!ST.sheetOpen; render(); };
  if(btnClear) btnClear.onclick=clearHistory;

  // Sheet tabs
  document.querySelectorAll('[data-sheet-tab]').forEach(b=>{
    b.onclick=()=>{ ST.sheetTab=b.dataset.sheetTab; render(); };
  });

  // Week toggles
  document.querySelectorAll('[data-toggle-week]').forEach(b=>{
    b.onclick=()=>{
      const w=Number(b.dataset.toggleWeek);
      ST.expandedWeek=ST.expandedWeek===w?-1:w;
      render();
    };
  });

  // Day select
  document.querySelectorAll('[data-sel-w]').forEach(b=>{
    b.onclick=()=>{ selectWorkout(Number(b.dataset.selW),Number(b.dataset.selD)); };
  });

  // Dot clicks
  document.querySelectorAll('.panel-dot').forEach((d,i)=>{
    d.onclick=()=>{ ST.panel=i; if(track) track.style.transform=`translateX(${-i*100}%)`; updateDots(); };
  });

  // Sheet scrim
  if(scrim) scrim.onclick=()=>{ ST.sheetOpen=false; render(); };

  // Sheet open/close from plan button in re-render
  if(sheet) {
    sheet.classList.toggle('open',ST.sheetOpen);
    if(scrim) scrim.classList.toggle('visible',ST.sheetOpen);
  }

  // Init swipe (fresh each render since track is re-created)
  if(track) initSwipe(track);

  // Init sheet drag
  if(sheet && handle) initSheet(sheet, handle);
}

/* ─── BOOT ───────────────────────────────────────────────────────── */
runTests();
load();
resetTimer();
render();
