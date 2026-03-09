/* ─── PROGRAM DATA ───────────────────────────────────────────────── */
const STORE = { done:‘c25k-done-v3’, snd:‘c25k-snd-v3’, hist:‘c25k-hist-v3’, sel:‘c25k-sel-v3’ };

const PROG = [
{w:1,days:[
{t:‘Day 1’,wu:5,cd:5,iv:[{r:1,wk:1.5,rep:8}]},
{t:‘Day 2’,wu:5,cd:5,iv:[{r:1,wk:1.5,rep:8}]},
{t:‘Day 3’,wu:5,cd:5,iv:[{r:1,wk:1.5,rep:8}]},
]},
{w:2,days:[
{t:‘Day 1’,wu:5,cd:5,iv:[{r:1.5,wk:2,rep:6}]},
{t:‘Day 2’,wu:5,cd:5,iv:[{r:1.5,wk:2,rep:6}]},
{t:‘Day 3’,wu:5,cd:5,iv:[{r:1.5,wk:2,rep:6}]},
]},
{w:3,days:[
{t:‘Day 1’,wu:5,cd:5,iv:[{r:1.5,wk:1.5,rep:2},{r:3,wk:3,rep:2}]},
{t:‘Day 2’,wu:5,cd:5,iv:[{r:1.5,wk:1.5,rep:2},{r:3,wk:3,rep:2}]},
{t:‘Day 3’,wu:5,cd:5,iv:[{r:2,wk:2,rep:2},{r:4,wk:3,rep:2}]},
]},
{w:4,days:[
{t:‘Day 1’,wu:5,cd:5,iv:[{r:3,wk:1.5,rep:2},{r:5,wk:2.5,rep:2}]},
{t:‘Day 2’,wu:5,cd:5,iv:[{r:3,wk:1.5,rep:2},{r:5,wk:2.5,rep:2}]},
{t:‘Day 3’,wu:5,cd:5,iv:[{r:4,wk:2,rep:2},{r:5,wk:2,rep:2}]},
]},
{w:5,days:[
{t:‘Day 1’,wu:5,cd:5,iv:[{r:5,wk:3,rep:2},{r:5,wk:0,rep:1}]},
{t:‘Day 2’,wu:5,cd:5,iv:[{r:8,wk:5,rep:1},{r:8,wk:0,rep:1}]},
{t:‘Day 3’,wu:5,cd:5,iv:[{r:20,wk:0,rep:1}]},
]},
{w:6,days:[
{t:‘Day 1’,wu:5,cd:5,iv:[{r:5,wk:3,rep:1},{r:8,wk:3,rep:1},{r:5,wk:0,rep:1}]},
{t:‘Day 2’,wu:5,cd:5,iv:[{r:10,wk:3,rep:1},{r:10,wk:0,rep:1}]},
{t:‘Day 3’,wu:5,cd:5,iv:[{r:22,wk:0,rep:1}]},
]},
{w:7,days:[
{t:‘Day 1’,wu:5,cd:5,iv:[{r:25,wk:0,rep:1}]},
{t:‘Day 2’,wu:5,cd:5,iv:[{r:25,wk:0,rep:1}]},
{t:‘Day 3’,wu:5,cd:5,iv:[{r:28,wk:0,rep:1}]},
]},
{w:8,days:[
{t:‘Day 1’,wu:5,cd:5,iv:[{r:30,wk:0,rep:1}]},
{t:‘Day 2’,wu:5,cd:5,iv:[{r:30,wk:0,rep:1}]},
{t:‘5K Day’,wu:5,cd:5,iv:[{r:35,wk:0,rep:1}]},
]},
];

/* ─── ICONS ──────────────────────────────────────────────────────── */
const IC = {
vol:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 14h3l4 3V7L7 10H4v4Z" fill="currentColor" stroke="none"/><path d="M15 9.5a4 4 0 0 1 0 5"/><path d="M17.5 7a7.5 7.5 0 0 1 0 10"/></svg>`,
mute: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 14h3l4 3V7L7 10H4v4Z" fill="currentColor" stroke="none"/><path d="M17 9l4 4m0-4-4 4"/></svg>`,
cal:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
chev: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
ext:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5h5v5"/><path d="M10 14 19 5"/><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/></svg>`,
};

/* ─── FORMAT ─────────────────────────────────────────────────────── */
const F = {
t:  s => { const n=Math.max(0,Math.floor(s||0)); return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`; },
d:  s => { const n=Math.max(0,Math.floor(s||0)); return `${Math.floor(n/60)}m ${String(n%60).padStart(2,'0')}s`; },
m:  m => { if(!m||m<1) return ‘0 m’; return m<1000?`${Math.round(m)} m`:`${(m/1000).toFixed(2)} km`; },
p:  v => { if(!Number.isFinite(v)||v<=0) return ‘–:–’; const m=Math.floor(v/60),s=Math.round(v%60); return (s===60?`${m+1}:00`:`${m}:${String(s).padStart(2,'0')}`)+’ /km’; },
sp: v => { if(!Number.isFinite(v)||v<=0) return ‘0.0 km/h’; return `${(v*3.6).toFixed(1)} km/h`; },
};

function dk(w,d) { return `w${w+1}-d${d+1}`; }

function hav(a,b) {
const R=6371000,dLa=((b.lat-a.lat)*Math.PI/180),dLo=((b.lng-a.lng)*Math.PI/180);
const x=Math.sin(dLa/2)**2+Math.sin(dLo/2)**2*Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180);
return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

function smooth(pts) {
if(pts.length<=2) return pts;
return pts.map((p,i)=>{
if(!i||i===pts.length-1) return p;
return{…p,lat:(pts[i-1].lat+p.lat+pts[i+1].lat)/3,lng:(pts[i-1].lng+p.lng+pts[i+1].lng)/3};
});
}

function mkSegs(day) {
const s=[{lbl:‘Warm-up’,tp:‘walk’,sec:Math.round(day.wu*60)}];
day.iv.forEach(b=>{
for(let i=0;i<b.rep;i++){
if(b.r)  s.push({lbl:`Run ${b.r} min`, tp:‘run’,  sec:Math.round(b.r*60)});
if(b.wk) s.push({lbl:`Walk ${b.wk} min`,tp:‘walk’,sec:Math.round(b.wk*60)});
}
});
s.push({lbl:‘Cool-down’,tp:‘walk’,sec:Math.round(day.cd*60)});
return s;
}

function totMin(day) { return day.wu+day.cd+day.iv.reduce((s,i)=>(s+(i.r+i.wk)*i.rep),0); }

function mapPts(pts,W=360,H=160,P=12) {
if(!pts.length) return ‘’;
if(pts.length===1) return `${W/2},${H/2}`;
const la=pts.map(p=>p.lat),lo=pts.map(p=>p.lng);
const mla=Math.min(…la),xla=Math.max(…la),mlo=Math.min(…lo),xlo=Math.max(…lo);
const lr=Math.max(xla-mla,.00001),lgr=Math.max(xlo-mlo,.00001);
return pts.map(p=>{
const x=P+((p.lng-mlo)/lgr)*(W-P*2);
const y=H-P-((p.lat-mla)/lr)*(H-P*2);
return `${x.toFixed(1)},${y.toFixed(1)}`;
}).join(’ ’);
}

function emptySplits(segs) {
return segs.map((s,i)=>({i,lbl:s.lbl,tp:s.tp,plan:s.sec,actual:0,dist:0}));
}

/* ─── STATE ──────────────────────────────────────────────────────── */
const S = {
w:0, d:0,
active:false, started:false,
si:0, tl:0,
dist:0, pts:[], gpsErr:’’, splits:[],
cd:null, snd:true,
done:{}, hist:[],
expW:0,
tab:‘stats’,
sheetOpen:false, sheetTab:‘plan’,
};

const R = {
wid:null, lastPt:null,
segDist:0, segT:Date.now(),
audio:null, cdInt:null,
tenBeep:null, segBeep:0,
saved:false, tick:null,
};

/* ─── DERIVED ────────────────────────────────────────────────────── */
const day  = () => PROG[S.w].days[S.d];
const segs = () => mkSegs(day());
const totSec = () => segs().reduce((s,sg)=>s+sg.sec,0);

function elapsed() {
const sg=segs(),done=sg.slice(0,S.si).reduce((s,g)=>s+g.sec,0),cur=sg[S.si]?.sec||0;
return Math.max(0,done+(cur-S.tl));
}
function prog() { const t=totSec(),e=elapsed(); return t?Math.round((e/t)*100):0; }
function aPace()  { const e=elapsed(); return S.dist>0?e/(S.dist/1000):0; }
function aSpeed() { const e=elapsed(); return e>0?S.dist/e:0; }
const latPt = () => S.pts[S.pts.length-1]||R.lastPt;

/* ─── PERSIST ────────────────────────────────────────────────────── */
function loadSt() {
try {
const c=localStorage.getItem(STORE.done),sn=localStorage.getItem(STORE.snd),
h=localStorage.getItem(STORE.hist),sl=localStorage.getItem(STORE.sel);
if(c) S.done=JSON.parse(c);
if(sn!==null) S.snd=sn===‘true’;
if(h) S.hist=JSON.parse(h);
if(sl){const p=JSON.parse(sl);S.w=p.w??0;S.d=p.d??0;S.expW=p.w??0;}
} catch(e){console.error(e);}
}
function saveSt() {
localStorage.setItem(STORE.done,JSON.stringify(S.done));
localStorage.setItem(STORE.snd,String(S.snd));
localStorage.setItem(STORE.hist,JSON.stringify(S.hist));
localStorage.setItem(STORE.sel,JSON.stringify({w:S.w,d:S.d}));
}

/* ─── AUDIO ──────────────────────────────────────────────────────── */
function tone(freq=880,dur=.12,type=‘sine’,vol=.05) {
if(!S.snd) return;
try {
const C=window.AudioContext||window.webkitAudioContext; if(!C) return;
if(!R.audio) R.audio=new C();
const ctx=R.audio,now=ctx.currentTime,osc=ctx.createOscillator(),g=ctx.createGain();
osc.type=type; osc.frequency.setValueAtTime(freq,now);
g.gain.cancelScheduledValues(now);
g.gain.setValueAtTime(.0001,now);
g.gain.exponentialRampToValueAtTime(Math.max(.0001,vol),now+.01);
g.gain.exponentialRampToValueAtTime(.0001,now+dur);
osc.connect(g); g.connect(ctx.destination);
osc.start(now); osc.stop(now+dur+.03);
} catch(e){console.error(e);}
}

const B = {
cnt: v => { if(v<=0)tone(1320,.22,‘triangle’,.06); else tone(v<=3?1046:880,v<=3?.18:.12,‘sine’,.05); },
fin: v => tone(v<=3?1046:880,v<=3?.18:.12,‘sine’,.05),
chg: tp => { if(tp===‘run’){tone(880,.12,‘triangle’,.05);setTimeout(()=>tone(1174,.16,‘triangle’,.05),120);} else{tone(659,.12,‘triangle’,.05);setTimeout(()=>tone(523,.16,‘triangle’,.05),120);} },
done: () => { tone(784,.14,‘triangle’,.05);setTimeout(()=>tone(988,.18,‘triangle’,.05),160);setTimeout(()=>tone(1318,.24,‘triangle’,.05),340); },
};

async function resumeAudio() {
const C=window.AudioContext||window.webkitAudioContext; if(!C) return;
if(!R.audio) R.audio=new C();
if(R.audio.state===‘suspended’) await R.audio.resume();
}

/* ─── TIMER ──────────────────────────────────────────────────────── */
function clearCd() { if(R.cdInt){clearInterval(R.cdInt);R.cdInt=null;} S.cd=null; }
function stopTick() { if(R.tick){clearInterval(R.tick);R.tick=null;} }
function stopGeo()  { if(R.wid!==null&&navigator.geolocation){navigator.geolocation.clearWatch(R.wid);R.wid=null;} }

function reset() {
clearCd(); stopTick(); stopGeo();
S.active=false; S.started=false;
S.si=0; S.tl=segs()[0]?.sec||0;
S.dist=0; S.pts=[]; S.gpsErr=’’;
S.splits=emptySplits(segs());
R.lastPt=null; R.segDist=0; R.segT=Date.now();
R.tenBeep=null; R.segBeep=0; R.saved=false;
}

function finSplit(idx,ov=null) {
S.splits=S.splits.map((sp,i)=>i!==idx?sp:{…sp,dist:R.segDist,actual:ov??Math.max(0,Math.round((Date.now()-R.segT)/1000))});
R.segDist=0; R.segT=Date.now();
}

function startGeo() {
if(!S.started) return;
if(!navigator.geolocation){S.gpsErr=‘Geolocation not available.’;render();return;}
stopGeo();
R.wid=navigator.geolocation.watchPosition(
pos=>{
S.gpsErr=’’;
const acc=pos.coords.accuracy??0,pt={lat:pos.coords.latitude,lng:pos.coords.longitude,timestamp:pos.timestamp,accuracy:acc};
if(acc>35){render();return;}
S.pts.push(pt);
if(R.lastPt){const dlt=hav(R.lastPt,pt);if(dlt>=.8&&dlt<=80){S.dist+=dlt;R.segDist+=dlt;}}
R.lastPt=pt; render();
},
err=>{S.gpsErr=[’’,‘Permission denied.’,‘Position unavailable.’,‘Timed out.’][err.code]||‘GPS error.’;render();},
{enableHighAccuracy:true,timeout:10000,maximumAge:1500}
);
}

function maybeSave() {
const e=elapsed();
if(S.started||S.active||S.tl!==0||R.saved) return;
if(!segs().length||e<=0) return;
R.saved=true;
S.hist=[{
id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
at:new Date().toISOString(),
week:S.w+1, dayT:day().t,
sec:e, dist:S.dist, pace:aPace(), speed:aSpeed(),
pts:S.pts, splits:S.splits,
},…S.hist].slice(0,30);
saveSt();
}

function maybeBeepCd() {
if(!S.started||!S.active){R.tenBeep=null;return;}
if(S.tl<=10&&S.tl>0&&R.tenBeep!==S.tl){B.fin(S.tl);R.tenBeep=S.tl;}
if(S.tl>10) R.tenBeep=null;
}
function maybeBeepChg() {
if(!S.started||!S.active) return;
if(S.si!==R.segBeep){if(S.si>0)B.chg(segs()[S.si]?.tp||‘walk’);R.segBeep=S.si;}
}

function startTick() {
stopTick();
R.tick=setInterval(()=>{
if(S.tl>1){S.tl–;maybeBeepCd();tickUpdate();return;}
const sg=segs(),cur=S.si,nxt=cur+1;
finSplit(cur,sg[cur]?.sec||0);
if(nxt>=sg.length){
S.active=false;S.started=false;S.tl=0;
B.done(); S.done[dk(S.w,S.d)]=true;
saveSt(); stopTick(); stopGeo(); maybeSave(); render(); return;
}
S.si=nxt; S.tl=sg[nxt].sec; maybeBeepChg(); render();
},1000);
}

/* ─── ACTIONS ────────────────────────────────────────────────────── */
async function doStart() {
await resumeAudio();
if(S.started){S.active=true;startTick();maybeBeepCd();render();return;}
clearCd(); S.active=false; S.started=false;
S.si=0; S.tl=segs()[0]?.sec||0;
R.saved=false; S.dist=0; S.pts=[]; S.gpsErr=’’;
S.splits=emptySplits(segs());
R.lastPt=null; R.segDist=0; R.segT=Date.now();
R.tenBeep=null; R.segBeep=0;

let c=3; S.cd=c; B.cnt(c); render();
R.cdInt=setInterval(()=>{
c–;
if(c>0){S.cd=c;B.cnt(c);render();return;}
S.cd=0;B.cnt(0);render();
clearInterval(R.cdInt);R.cdInt=null;
setTimeout(()=>{
clearCd(); S.started=true; S.active=true;
S.si=0; S.tl=segs()[0]?.sec||0;
R.segT=Date.now(); R.segBeep=0;
startGeo(); startTick(); render();
},250);
},1000);
}

function doPause()  { clearCd(); S.active=false; stopTick(); render(); }
function doStop()   { reset(); render(); }

function selWork(w,d) {
clearCd(); R.saved=false;
S.w=w; S.d=d; S.active=false; S.started=false;
S.dist=0; S.pts=[]; S.gpsErr=’’;
R.lastPt=null; R.segDist=0; R.segT=Date.now();
S.tl=segs()[0]?.sec||0;
S.splits=emptySplits(segs());
stopTick(); stopGeo(); saveSt(); render();
}

/* ─── TICK UPDATE (no DOM rebuild) ──────────────────────────────── */
function tickUpdate() {
const cur=segs()[S.si]||null;
const e=elapsed(), pr=prog();
const remain=Math.max(0,totSec()-e);
const segPct=(cur&&S.tl>0)?(1-S.tl/cur.sec):0;
const C=2*Math.PI*110;
const offset=(C*(1-segPct)).toFixed(2);

// Time display
const td=document.getElementById(‘ring-time’);
if(td) td.textContent=F.t(S.tl);

// Ring progress circles (both prog and glow)
document.querySelectorAll(’.ring-prog,.ring-glow’).forEach(el=>{
el.setAttribute(‘stroke-dashoffset’, offset);
});

// Session bar
const fill=document.getElementById(‘sbar-fill’);
if(fill) fill.style.width=pr+’%’;
const pct=document.getElementById(‘sbar-pct’);
if(pct) pct.textContent=pr+’%’;
const rem=document.getElementById(‘sbar-rem’);
if(rem) rem.textContent=F.t(remain)+’ left’;
}

/* ─── BODY STATE ─────────────────────────────────────────────────── */
function syncBody() {
document.body.classList.remove(‘s-run’,‘s-walk’);
if(!S.started) return;
const sg=segs()[S.si];
if(sg?.tp===‘run’)  document.body.classList.add(‘s-run’);
if(sg?.tp===‘walk’) document.body.classList.add(‘s-walk’);
}

/* ─── RING SVG ───────────────────────────────────────────────────── */
function ringHTML(tp, pct) {
const R=110, CX=130, CY=130, C=2*Math.PI*R;
const offset = C*(1-pct);
const cls = tp===‘run’?‘run’:tp===‘walk’?‘walk’:‘idle’;
return `
<svg class="ring-svg" viewBox="0 0 260 260">
<defs>
<filter id="gf"><feGaussianBlur stdDeviation="5"/></filter>
</defs>

  <!-- glow layer -->

<circle class="ring-glow ${cls}" cx="${CX}" cy="${CY}" r="${R}"
stroke-dasharray="${C.toFixed(2)}"
stroke-dashoffset="${offset.toFixed(2)}"
transform="rotate(-90 ${CX} ${CY})"
style="filter:url(#gf)"
/>

  <!-- track -->

  <circle class="ring-track" cx="${CX}" cy="${CY}" r="${R}"/>
  <!-- progress -->
  <circle class="ring-prog ${cls}" cx="${CX}" cy="${CY}" r="${R}"
    stroke-dasharray="${C.toFixed(2)}"
    stroke-dashoffset="${offset.toFixed(2)}"
    transform="rotate(-90 ${CX} ${CY})"
  />
</svg>`;
}

/* ─── RENDER ─────────────────────────────────────────────────────── */
function render() {
maybeSave(); saveSt(); syncBody();

const dy=day(), sg=segs(), cur=sg[S.si]||null;
const e=elapsed(), pr=prog();
const pace=aPace(), spd=aSpeed();
const smPts=smooth(S.pts), mPts=mapPts(smPts);
const segD=R.segDist, lp=latPt(), fp=S.pts[0]||null;
const extUrl=lp?`https://www.google.com/maps/search/?api=1&query=${lp.lat},${lp.lng}`:’’;
const totDone=Object.values(S.done).filter(Boolean).length;
const totAll=PROG.reduce((s,w)=>s+w.days.length,0);
const remain=Math.max(0,totSec()-e);

// Ring
const segPct = (cur&&S.started&&S.tl>0) ? (1-S.tl/cur.sec) : 0;
const tp=cur?.tp||‘idle’;

// Label
let lbl=‘Ready to run’;
if(S.cd!==null) lbl=‘Get ready…’;
else if(S.started&&cur) lbl=cur.lbl;
else if(!S.started&&e>0&&S.tl===0) lbl=‘Workout complete!’;

// Seg markers
let cum=0;
const marks=sg.map(s=>{cum+=s.sec;return`<div class="sbar-mark" style="left:${((cum/totSec())*100).toFixed(2)}%"></div>`;}).join(’’);

const app=document.getElementById(‘app’);
app.innerHTML=`

<!-- TOP -->

<div class="topbar">
  <div class="topbar-left">
    <div class="topbar-eyebrow">Couch to 5K</div>
    <div class="topbar-title">Week ${S.w+1} · ${dy.t}</div>
  </div>
  <div class="topbar-right">
    <button id="b-snd" class="icon-btn ${S.snd?'lit':''}">${S.snd?IC.vol:IC.mute}</button>
    <button id="b-plan" class="icon-btn">${IC.cal}</button>
  </div>
</div>

<!-- RING -->

<div class="ring-area">
  <div class="ring-wrap">
    ${ringHTML(tp, segPct)}
    <div class="ring-inner">
      <div class="ring-seg-label">
        <span class="seg-pip"></span>
        ${lbl}
      </div>
      ${S.cd!==null
        ? (S.cd>0
            ? `<div class="cnt-num">${S.cd}</div>`
            : `<div class="cnt-go">GO</div>`)
        : `<div class="ring-time" id="ring-time">${F.t(S.tl)}</div>`}
      <div class="ring-sub">
        ${S.started
          ? (tp==='run' ? '— running —' : '— walking —')
          : (e>0&&S.tl===0 ? '— done —' : '— tap start —')}
      </div>
    </div>
  </div>
</div>

<!-- SESSION BAR -->

<div class="session-bar">
  <div class="sbar-row">
    <span class="sbar-pct" id="sbar-pct">${pr}%</span>
    <span class="sbar-rem" id="sbar-rem">${F.t(remain)} left</span>
  </div>
  <div class="sbar-track"><div class="sbar-fill" id="sbar-fill" style="width:${pr}%"></div></div>
  <div class="sbar-marks">${marks}</div>
</div>

<!-- CONTROLS -->

<div class="controls">
  <button id="b-stop"  class="ctrl-side" style="position:relative;overflow:hidden">Stop</button>
  <button id="b-start" class="ctrl-main">${!S.started && S.cd===null ? 'Start' : S.active ? (tp==='run' ? 'Running' : 'Walking') : 'Resume'}</button>
  <button id="b-pause" class="ctrl-side" style="position:relative;overflow:hidden">Pause</button>
</div>

<!-- TABS -->

<div class="tab-bar">
  <button class="tab-btn ${S.tab==='stats'?'active':''}" data-tab="stats">Stats</button>
  <button class="tab-btn ${S.tab==='route'?'active':''}" data-tab="route">Route</button>
  <button class="tab-btn ${S.tab==='splits'?'active':''}" data-tab="splits">Splits</button>
</div>

<!-- TAB CONTENT -->

<div class="tab-content">

${S.tab===‘stats’?`

  <div class="stats-grid">
    <div class="stat-tile">
      <div class="stat-lbl">Distance</div>
      <div class="stat-val">${F.m(S.dist)}</div>
      <div class="stat-unit">GPS tracked</div>
    </div>
    <div class="stat-tile">
      <div class="stat-lbl">Avg Pace</div>
      <div class="stat-val" style="font-size:22px">${F.p(pace)}</div>
      <div class="stat-unit">per kilometre</div>
    </div>
    <div class="stat-tile">
      <div class="stat-lbl">Speed</div>
      <div class="stat-val" style="font-size:22px">${F.sp(spd)}</div>
      <div class="stat-unit">average</div>
    </div>
    <div class="stat-tile">
      <div class="stat-lbl">Split dist</div>
      <div class="stat-val">${F.m(segD)}</div>
      <div class="stat-unit">this interval</div>
    </div>
  </div>
  `:S.tab==='route'?`
  <div class="route-card">
    <svg viewBox="0 0 360 160" class="mini-svg">
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#38d9f5"/>
          <stop offset="100%" stop-color="#c8ff5a"/>
        </linearGradient>
      </defs>
      <rect width="360" height="160" fill="#0a0c14"/>
      ${mPts?(()=>{
        const pts=mPts.split(' ');
        const[sx,sy]=(pts[0]||'180,80').split(',');
        const[ex,ey]=(pts[pts.length-1]||'180,80').split(',');
        return`<polyline fill="none" stroke="url(#rg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${mPts}"/>
               <circle cx="${sx}" cy="${sy}" r="5" fill="#38d9f5"/>
               <circle cx="${ex}" cy="${ey}" r="5" fill="#c8ff5a"/>
               <rect x="10" y="10" width="78" height="26" rx="7" fill="rgba(0,0,0,.7)"/>
               <text x="18" y="20" font-size="8" fill="#555e6e" font-family="monospace">DIST</text>
               <text x="18" y="31" font-size="10" font-weight="600" fill="#e9ebf4" font-family="monospace">${F.m(S.dist)}</text>`;
      })():`<text x="180" y="80" text-anchor="middle" fill="rgba(255,255,255,.18)" font-size="11" font-family="monospace">NO ROUTE YET</text>`}
    </svg>
    ${fp||lp?`<div class="gps-row">
      <div class="gps-cell"><strong>Start</strong>${fp?`${fp.lat.toFixed(5)}, ${fp.lng.toFixed(5)}`:'—'}</div>
      <div class="gps-cell"><strong>Current</strong>${lp?`${lp.lat.toFixed(5)}, ${lp.lng.toFixed(5)}`:'—'}</div>
    </div>`:''}
    ${extUrl?`<a href="${extUrl}" target="_blank" rel="noreferrer" class="gps-ext">${IC.ext} Open in Google Maps</a>`:''}
    ${S.gpsErr?`<div class="gps-err">⚠ ${S.gpsErr}</div>`:''}
  </div>
  `:`
  <div class="splits-list">
    ${S.splits.map((sp,idx)=>{
      const isCur=idx===S.si&&S.started;
      const cEl=Math.max(0,sp.plan-S.tl);
      const dD=isCur?segD:sp.dist;
      const dS=isCur?cEl:(sp.actual||sp.plan);
      const dP=dD>0?dS/(dD/1000):0;
      return`<div class="split-row ${isCur?'active':''}">
        <div>
          <div class="split-name">${sp.lbl}</div>
          <div class="split-type">${sp.tp} · ${F.p(dP)}</div>
        </div>
        <div class="split-data"><div>${F.m(dD)}</div><div>${F.d(dS)}</div></div>
      </div>`;
    }).join('')}
  </div>
  `}

</div>

<!-- SCRIM -->

<div id="scrim" class="${S.sheetOpen?'on':''}"></div>

<!-- SHEET -->

<div class="sheet ${S.sheetOpen?'open':''}" id="sheet">
  <div class="sheet-handle-row" id="sheet-handle">
    <div class="sheet-nub"></div>
    <div class="sheet-head">
      <div class="sheet-title">Workout Plan</div>
      <div class="sheet-right">
        <div class="sheet-tabs">
          <button class="stab ${S.sheetTab==='plan'?'on':''}" data-stab="plan">Plan</button>
          <button class="stab ${S.sheetTab==='hist'?'on':''}" data-stab="hist">History</button>
        </div>
        <span class="sheet-count">${totDone}/${totAll}</span>
      </div>
    </div>
  </div>

  <div class="sheet-scroll">
    ${S.sheetTab==='plan'?`
    ${PROG.map((wk,wi)=>{
      const exp=S.expW===wi;
      return`<div class="week-block">
        <div class="week-hd" data-tw="${wi}">
          <div>
            <div class="week-name">Week ${wk.w}</div>
            <div class="week-meta">${wk.days.length} workouts · ${wk.days.map(d=>totMin(d)).join(', ')} min</div>
          </div>
          <div class="week-chev ${exp?'open':''}">${IC.chev}</div>
        </div>
        ${exp?`<div class="week-days">${wk.days.map((dy,di)=>{
          const sel=S.w===wi&&S.d===di, dn=S.done[dk(wi,di)];
          return`<button class="day-btn ${sel?'sel':''}" data-sw="${wi}" data-sd="${di}">
            <div>
              <div class="day-name">${dy.t}</div>
              <div class="day-meta">${totMin(dy)} min</div>
            </div>
            ${dn?`<span class="done-pill">✓ Done</span>`:''}
          </button>`;
        }).join('')}</div>`:''}
      </div>`;
    }).join('')}
    `:`
    ${S.hist.length?S.hist.map(r=>`
    <div class="hist-row">
      <div class="hist-hd">
        <div>
          <div class="hist-title">Week ${r.week} · ${r.dayT}</div>
          <div class="hist-date">${new Date(r.at).toLocaleString()}</div>
        </div>
        <div class="hist-data"><div>${F.m(r.dist)}</div><div>${F.d(r.sec)}</div></div>
      </div>
      <div class="hist-tags">
        <span class="tag">${F.p(r.pace)}</span>
        <span class="tag">${F.sp(r.speed)}</span>
        <span class="tag">${r.splits.length} splits</span>
      </div>
    </div>`).join(''):`<div class="empty">Complete a workout to see your history here.</div>`}
    ${S.hist.length?`<button class="clear-btn" id="b-clear">Clear history</button>`:''}
    `}
  </div>
</div>
  `;

bind();
}

/* ─── BIND ───────────────────────────────────────────────────────── */
function rpl(btn, ev) {
const rc=btn.getBoundingClientRect(),sz=Math.max(rc.width,rc.height);
const s=document.createElement(‘span’);
s.className=‘ripple’;
s.style.cssText=`width:${sz}px;height:${sz}px;left:${ev.clientX-rc.left-sz/2}px;top:${ev.clientY-rc.top-sz/2}px`;
btn.appendChild(s); setTimeout(()=>s.remove(),700);
}

function bind() {
const $=id=>document.getElementById(id);
const bStart=$(‘b-start’),bPause=$(‘b-pause’),bStop=$(‘b-stop’);
const bSnd=$(‘b-snd’),bPlan=$(‘b-plan’),bClear=$(‘b-clear’);
const scrim=$(‘scrim’),sheet=$(‘sheet’),handle=$(‘sheet-handle’);

if(bStart) bStart.onclick=ev=>{rpl(bStart,ev);doStart();};
if(bPause) bPause.onclick=ev=>{rpl(bPause,ev);doPause();};
if(bStop)  bStop.onclick=ev=>{rpl(bStop,ev);doStop();};
if(bSnd)   bSnd.onclick=()=>{S.snd=!S.snd;saveSt();render();};
if(bPlan)  bPlan.onclick=()=>{S.sheetOpen=!S.sheetOpen;render();};
if(bClear) bClear.onclick=()=>{S.hist=[];localStorage.removeItem(STORE.hist);render();};

// Tab bar
document.querySelectorAll(’[data-tab]’).forEach(b=>{ b.onclick=()=>{S.tab=b.dataset.tab;render();}; });

// Sheet tabs
document.querySelectorAll(’[data-stab]’).forEach(b=>{ b.onclick=()=>{S.sheetTab=b.dataset.stab;render();}; });

// Sheet toggle from handle / scrim
if(handle) handle.onclick=()=>{S.sheetOpen=!S.sheetOpen;render();};
if(scrim)  scrim.onclick=()=>{S.sheetOpen=false;render();};

// Week toggles
document.querySelectorAll(’[data-tw]’).forEach(b=>{
b.onclick=ev=>{
ev.stopPropagation();
const w=Number(b.dataset.tw);
S.expW=S.expW===w?-1:w; render();
};
});

// Day select
document.querySelectorAll(’[data-sw]’).forEach(b=>{
b.onclick=()=>{selWork(Number(b.dataset.sw),Number(b.dataset.sd));S.sheetOpen=false;render();};
});
}

/* ─── TESTS ──────────────────────────────────────────────────────── */
function runTests() {
if(hav({lat:0,lng:0},{lat:0,lng:.001})<=0) throw new Error(‘hav’);
if(F.m(1200)!==‘1.20 km’) throw new Error(‘dist’);
if(F.p(360)!==‘6:00 /km’) throw new Error(‘pace’);
if(F.sp(2.7777778)!==‘10.0 km/h’) throw new Error(‘spd’);
if(F.t(75)!==‘1:15’) throw new Error(‘time’);
if(F.d(75)!==‘1m 15s’) throw new Error(‘dur’);
if(dk(0,0)!==‘w1-d1’) throw new Error(‘dk’);
if(mkSegs(PROG[0].days[0]).length!==18) throw new Error(‘segs’);
const sp=smooth([{lat:1,lng:1},{lat:2,lng:2},{lat:3,lng:3}]);
if(sp[1].lat!==2) throw new Error(‘smooth’);
}

/* ─── BOOT ───────────────────────────────────────────────────────── */
runTests();
loadSt();
reset();
render();