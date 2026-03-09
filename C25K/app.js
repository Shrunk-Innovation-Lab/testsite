/* ─── CONSTANTS ─────────────────────────────────────────────────────────── */
const STORAGE_KEYS = {
  completed: "c25k-completed-v1",
  soundEnabled: "c25k-sound-enabled-v1",
  history: "c25k-history-v1",
  selectedWorkout: "c25k-selected-workout-v1",
};

const RING_RADIUS = 120;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // 753.98

const PROGRAM = [
  {
    week: 1,
    days: [
      { title: "Day 1", warmup: 5, cooldown: 5, intervals: [{ run: 1, walk: 1.5, repeat: 8 }] },
      { title: "Day 2", warmup: 5, cooldown: 5, intervals: [{ run: 1, walk: 1.5, repeat: 8 }] },
      { title: "Day 3", warmup: 5, cooldown: 5, intervals: [{ run: 1, walk: 1.5, repeat: 8 }] },
    ],
  },
  {
    week: 2,
    days: [
      { title: "Day 1", warmup: 5, cooldown: 5, intervals: [{ run: 1.5, walk: 2, repeat: 6 }] },
      { title: "Day 2", warmup: 5, cooldown: 5, intervals: [{ run: 1.5, walk: 2, repeat: 6 }] },
      { title: "Day 3", warmup: 5, cooldown: 5, intervals: [{ run: 1.5, walk: 2, repeat: 6 }] },
    ],
  },
  {
    week: 3,
    days: [
      { title: "Day 1", warmup: 5, cooldown: 5, intervals: [{ run: 1.5, walk: 1.5, repeat: 2 }, { run: 3, walk: 3, repeat: 2 }] },
      { title: "Day 2", warmup: 5, cooldown: 5, intervals: [{ run: 1.5, walk: 1.5, repeat: 2 }, { run: 3, walk: 3, repeat: 2 }] },
      { title: "Day 3", warmup: 5, cooldown: 5, intervals: [{ run: 2, walk: 2, repeat: 2 }, { run: 4, walk: 3, repeat: 2 }] },
    ],
  },
  {
    week: 4,
    days: [
      { title: "Day 1", warmup: 5, cooldown: 5, intervals: [{ run: 3, walk: 1.5, repeat: 2 }, { run: 5, walk: 2.5, repeat: 2 }] },
      { title: "Day 2", warmup: 5, cooldown: 5, intervals: [{ run: 3, walk: 1.5, repeat: 2 }, { run: 5, walk: 2.5, repeat: 2 }] },
      { title: "Day 3", warmup: 5, cooldown: 5, intervals: [{ run: 4, walk: 2, repeat: 2 }, { run: 5, walk: 2, repeat: 2 }] },
    ],
  },
  {
    week: 5,
    days: [
      { title: "Day 1", warmup: 5, cooldown: 5, intervals: [{ run: 5, walk: 3, repeat: 2 }, { run: 5, walk: 0, repeat: 1 }] },
      { title: "Day 2", warmup: 5, cooldown: 5, intervals: [{ run: 8, walk: 5, repeat: 1 }, { run: 8, walk: 0, repeat: 1 }] },
      { title: "Day 3", warmup: 5, cooldown: 5, intervals: [{ run: 20, walk: 0, repeat: 1 }] },
    ],
  },
  {
    week: 6,
    days: [
      { title: "Day 1", warmup: 5, cooldown: 5, intervals: [{ run: 5, walk: 3, repeat: 1 }, { run: 8, walk: 3, repeat: 1 }, { run: 5, walk: 0, repeat: 1 }] },
      { title: "Day 2", warmup: 5, cooldown: 5, intervals: [{ run: 10, walk: 3, repeat: 1 }, { run: 10, walk: 0, repeat: 1 }] },
      { title: "Day 3", warmup: 5, cooldown: 5, intervals: [{ run: 22, walk: 0, repeat: 1 }] },
    ],
  },
  {
    week: 7,
    days: [
      { title: "Day 1", warmup: 5, cooldown: 5, intervals: [{ run: 25, walk: 0, repeat: 1 }] },
      { title: "Day 2", warmup: 5, cooldown: 5, intervals: [{ run: 25, walk: 0, repeat: 1 }] },
      { title: "Day 3", warmup: 5, cooldown: 5, intervals: [{ run: 28, walk: 0, repeat: 1 }] },
    ],
  },
  {
    week: 8,
    days: [
      { title: "Day 1", warmup: 5, cooldown: 5, intervals: [{ run: 30, walk: 0, repeat: 1 }] },
      { title: "Day 2", warmup: 5, cooldown: 5, intervals: [{ run: 30, walk: 0, repeat: 1 }] },
      { title: "5K Day", warmup: 5, cooldown: 5, intervals: [{ run: 35, walk: 0, repeat: 1 }] },
    ],
  },
];

/* ─── SVG ICONS ─────────────────────────────────────────────────────────── */
const ICONS = {
  shoe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16.5c2.2 0 3.8-.4 5.1-1.2l1.5-.9c.5-.3.9-.8 1-1.4l.3-1.4c.1-.4.5-.6.9-.5l1.2.4c.5.2.8.6.9 1.1l.2 1c.1.5.4 1 .9 1.2l2 .9c.8.4 1.4 1.2 1.4 2.1V19H4c-1.1 0-2-.9-2-2s.9-2 2-2Z" fill="currentColor" stroke="none"/></svg>`,
  volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 14h3l4 3V7L7 10H4v4Z" fill="currentColor" stroke="none"/><path d="M15 9.5a4 4 0 0 1 0 5"/><path d="M17.5 7a7.5 7.5 0 0 1 0 10"/></svg>`,
  mute: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 14h3l4 3V7L7 10H4v4Z" fill="currentColor" stroke="none"/><path d="M17 9l4 4m0-4-4 4"/></svg>`,
  distance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" fill="currentColor" stroke="none"/><circle cx="12" cy="10" r="2.5" fill="#060810"/></svg>`,
  pace: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 4a9 9 0 1 0 9 9" /><path d="M12 12l4-3"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>`,
  speed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 13.5A8 8 0 0 1 20 13.5"/><path d="M12 13l5-4"/><circle cx="12" cy="13" r="1.4" fill="currentColor" stroke="none"/></svg>`,
  split: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 5v14M18 5v14"/><path d="M9 8h6l-2.5 4L15 16H9l2.5-4L9 8Z" fill="currentColor" stroke="none"/></svg>`,
  history: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12A7.5 7.5 0 1 0 7 6.4"/><path d="M4 4v4h4"/><path d="M12 8v4l2.8 1.8"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5h5v5"/><path d="M10 14 19 5"/><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/></svg>`,
  center: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  fire: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z" fill="none"/><path d="M12 21c-3.5 0-5-2-5-4.5 0-1.5 1-3 2-3.5C9 14.5 9 16 11 16c1 0 2-1 2-2.5 0-1-.5-2-1.5-2.5C13 10 15 11 15 14c1-1 1.5-2.5 1.5-4C16.5 7 14 5 12 5c0 0 2 2 2 4 0 1-1 2-2 2s-2-1.5-2-3C8 9 7 11 7 13c-1-1-1.5-3-1-5C4.5 9 4 11 4 13c0 4.5 3.5 8 8 8Z" fill="currentColor" stroke="none"/></svg>`,
};

function iconEl(name, size = 16) {
  return `<span class="icon" style="width:${size}px;height:${size}px">${ICONS[name] || ""}</span>`;
}

/* ─── UTILITY FUNCTIONS (unchanged logic) ─────────────────────────────── */
function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function formatDurationLong(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
}

function getDayKey(weekIndex, dayIndex) {
  return `w${weekIndex + 1}-d${dayIndex + 1}`;
}

function haversineDistance(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function smoothRoutePoints(points) {
  if (points.length <= 2) return points;
  return points.map((point, index) => {
    if (index === 0 || index === points.length - 1) return point;
    const prev = points[index - 1];
    const next = points[index + 1];
    return { ...point, lat: (prev.lat + point.lat + next.lat) / 3, lng: (prev.lng + point.lng + next.lng) / 3 };
  });
}

function buildSegments(day) {
  const segments = [{ label: "Warm-up walk", type: "walk", seconds: Math.round(day.warmup * 60) }];
  day.intervals.forEach((block) => {
    for (let i = 0; i < block.repeat; i++) {
      if (block.run) segments.push({ label: `Run ${block.run} min`, type: "run", seconds: Math.round(block.run * 60) });
      if (block.walk) segments.push({ label: `Walk ${block.walk} min`, type: "walk", seconds: Math.round(block.walk * 60) });
    }
  });
  segments.push({ label: "Cool-down walk", type: "walk", seconds: Math.round(day.cooldown * 60) });
  return segments;
}

function totalMinutes(day) {
  const base = day.warmup + day.cooldown;
  const intervals = day.intervals.reduce((sum, item) => sum + (item.run + item.walk) * item.repeat, 0);
  return base + intervals;
}

function formatDistance(meters) {
  if (!meters || meters < 1) return "0 m";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

function formatPace(secondsPerKm) {
  if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) return "--:--";
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.round(secondsPerKm % 60);
  if (secs === 60) return `${mins + 1}:00 /km`;
  return `${mins}:${String(secs).padStart(2, "0")} /km`;
}

function formatSpeed(metersPerSecond) {
  if (!Number.isFinite(metersPerSecond) || metersPerSecond <= 0) return "0.0 km/h";
  return `${(metersPerSecond * 3.6).toFixed(1)} km/h`;
}

function buildMiniMapPoints(points, width = 320, height = 164, padding = 14) {
  if (!points.length) return "";
  if (points.length === 1) return `${width / 2},${height / 2}`;
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const latRange = Math.max(maxLat - minLat, 0.00001);
  const lngRange = Math.max(maxLng - minLng, 0.00001);
  return points.map((p) => {
    const x = padding + ((p.lng - minLng) / lngRange) * (width - padding * 2);
    const y = height - padding - ((p.lat - minLat) / latRange) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");
}

function createEmptySplits(segments) {
  return segments.map((segment, index) => ({
    index, label: segment.label, type: segment.type,
    plannedSeconds: segment.seconds, actualSeconds: 0, distance: 0,
  }));
}

function getGoogleMapsEmbedUrl(point) {
  if (!point) return "";
  return `https://www.google.com/maps?q=${point.lat},${point.lng}&z=16&output=embed`;
}

function getGoogleMapsExternalUrl(point) {
  if (!point) return "";
  return `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
}

function buildWorkoutRecord({ selectedWeek, day, elapsedSeconds, distance, avgPace, avgSpeed, routePoints, splits }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    completedAt: new Date().toISOString(),
    week: selectedWeek + 1,
    dayTitle: day.title,
    totalSeconds: elapsedSeconds,
    distance, averagePace: avgPace, averageSpeed: avgSpeed,
    routePoints, splits,
  };
}

function createBeepScheduler(playTone) {
  return {
    startCountdown(value) {
      if (value <= 0) playTone(1320, 0.22, "triangle", 0.06);
      else playTone(value <= 3 ? 1046 : 880, value <= 3 ? 0.18 : 0.12, "sine", 0.05);
    },
    finalCountdown(value) {
      playTone(value <= 3 ? 1046 : 880, value <= 3 ? 0.18 : 0.12, "sine", 0.05);
    },
    intervalChange(type) {
      if (type === "run") {
        playTone(880, 0.12, "triangle", 0.05);
        window.setTimeout(() => playTone(1174, 0.16, "triangle", 0.05), 120);
      } else {
        playTone(659, 0.12, "triangle", 0.05);
        window.setTimeout(() => playTone(523, 0.16, "triangle", 0.05), 120);
      }
    },
    finish() {
      playTone(784, 0.14, "triangle", 0.05);
      window.setTimeout(() => playTone(988, 0.18, "triangle", 0.05), 160);
      window.setTimeout(() => playTone(1318, 0.24, "triangle", 0.05), 340);
    },
  };
}

/* ─── TESTS ─────────────────────────────────────────────────────────────── */
function runTests() {
  const d = haversineDistance({ lat: 0, lng: 0 }, { lat: 0, lng: 0.001 });
  if (d <= 0) throw new Error("distance calc broken");
  if (formatDistance(1200) !== "1.20 km") throw new Error("distance formatting failed");
  if (formatPace(360) !== "6:00 /km") throw new Error("pace formatting failed");
  if (formatSpeed(2.7777777778) !== "10.0 km/h") throw new Error("speed formatting failed");
  if (formatTime(75) !== "1:15") throw new Error("formatTime failed");
  if (formatDurationLong(75) !== "1m 15s") throw new Error("formatDurationLong failed");
  if (getDayKey(0, 0) !== "w1-d1") throw new Error("getDayKey failed");
  const smoothed = smoothRoutePoints([{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }, { lat: 3, lng: 3 }]);
  if (smoothed[1].lat !== 2 || smoothed[1].lng !== 2) throw new Error("route smoothing failed");
  const path = buildMiniMapPoints([{ lat: -37.81, lng: 144.96 }, { lat: -37.82, lng: 144.97 }]);
  if (!path.includes(",")) throw new Error("mini map points failed");
  const splits = createEmptySplits([{ label: "Run 1 min", type: "run", seconds: 60 }]);
  if (splits.length !== 1 || splits[0].distance !== 0) throw new Error("split creation failed");
  const calls = [];
  const scheduler = createBeepScheduler((freq) => calls.push(freq));
  scheduler.startCountdown(3);
  scheduler.finalCountdown(10);
  if (calls.length !== 2) throw new Error("audio scheduler failed");
  if (!getGoogleMapsEmbedUrl({ lat: -37.81, lng: 144.96 }).includes("output=embed")) throw new Error("google maps embed url failed");
  if (!getGoogleMapsExternalUrl({ lat: -37.81, lng: 144.96 }).includes("query=")) throw new Error("google maps external url failed");
  const record = buildWorkoutRecord({ selectedWeek: 0, day: { title: "Day 1" }, elapsedSeconds: 600, distance: 1200, avgPace: 500, avgSpeed: 2.4, routePoints: [], splits: [] });
  if (record.week !== 1 || record.dayTitle !== "Day 1") throw new Error("workout record failed");
  const weekOneSegments = buildSegments(PROGRAM[0].days[0]);
  if (weekOneSegments.length !== 18) throw new Error("buildSegments failed");
}

/* ─── STATE ─────────────────────────────────────────────────────────────── */
const state = {
  selectedWeek: 0, selectedDay: 0,
  timerActive: false, started: false,
  segmentIndex: 0, timeLeft: 0,
  distance: 0, routePoints: [], gpsError: "",
  completed: {}, splits: [],
  startCountdown: null,
  soundEnabled: true,
  planExpandedWeek: 0,
  workoutHistory: [],
  activeTab: "stats",
  autoCenter: true,
};

const refs = {
  watchId: null, lastPos: null,
  currentSegmentDistance: 0,
  segmentStartedAt: Date.now(),
  audioContext: null,
  startCountdownInterval: null,
  lastTenSecondBeep: null,
  lastSegmentBeep: 0,
  savedResult: false,
  timerInterval: null,
  prevSegmentIndex: -1,
};

/* ─── STATE HELPERS ─────────────────────────────────────────────────────── */
function getDay() { return PROGRAM[state.selectedWeek].days[state.selectedDay]; }
function getSegments() { return buildSegments(getDay()); }
function getTotalWorkoutSeconds() { return getSegments().reduce((sum, seg) => sum + seg.seconds, 0); }
function getElapsedSeconds() {
  const segments = getSegments();
  const finishedSeconds = segments.slice(0, state.segmentIndex).reduce((sum, seg) => sum + seg.seconds, 0);
  const currentSegmentSeconds = segments[state.segmentIndex]?.seconds || 0;
  return Math.max(0, finishedSeconds + (currentSegmentSeconds - state.timeLeft));
}
function getSessionProgress() {
  const total = getTotalWorkoutSeconds();
  const elapsed = getElapsedSeconds();
  return total ? Math.round((elapsed / total) * 100) : 0;
}
function getAvgPace() {
  const elapsed = getElapsedSeconds();
  return state.distance > 0 ? elapsed / (state.distance / 1000) : 0;
}
function getAvgSpeed() {
  const elapsed = getElapsedSeconds();
  return elapsed > 0 ? state.distance / elapsed : 0;
}
function latestPoint() { return state.routePoints[state.routePoints.length - 1] || refs.lastPos; }
function firstPoint() { return state.routePoints[0] || null; }

/* ─── PERSISTENCE ───────────────────────────────────────────────────────── */
function loadState() {
  try {
    const storedCompleted = localStorage.getItem(STORAGE_KEYS.completed);
    const storedSound = localStorage.getItem(STORAGE_KEYS.soundEnabled);
    const storedHistory = localStorage.getItem(STORAGE_KEYS.history);
    const storedSelected = localStorage.getItem(STORAGE_KEYS.selectedWorkout);
    if (storedCompleted) state.completed = JSON.parse(storedCompleted);
    if (storedSound !== null) state.soundEnabled = storedSound === "true";
    if (storedHistory) state.workoutHistory = JSON.parse(storedHistory);
    if (storedSelected) {
      const parsed = JSON.parse(storedSelected);
      state.selectedWeek = parsed.week ?? 0;
      state.selectedDay = parsed.day ?? 0;
      state.planExpandedWeek = parsed.week ?? 0;
    }
  } catch (error) { console.error("Failed to restore saved data", error); }
}

function persistState() {
  localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(state.completed));
  localStorage.setItem(STORAGE_KEYS.soundEnabled, String(state.soundEnabled));
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.workoutHistory));
  localStorage.setItem(STORAGE_KEYS.selectedWorkout, JSON.stringify({ week: state.selectedWeek, day: state.selectedDay }));
}

/* ─── AUDIO ─────────────────────────────────────────────────────────────── */
function playTone(frequency = 880, duration = 0.12, type = "sine", volume = 0.05) {
  if (!state.soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!refs.audioContext) refs.audioContext = new AudioContextClass();
    const context = refs.audioContext;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  } catch (error) { console.error("Audio playback failed", error); }
}

const beeps = createBeepScheduler(playTone);

async function resumeAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!refs.audioContext) refs.audioContext = new AudioContextClass();
  if (refs.audioContext.state === "suspended") await refs.audioContext.resume();
}

/* ─── TIMER CONTROL ─────────────────────────────────────────────────────── */
function clearStartCountdown() {
  if (refs.startCountdownInterval) { window.clearInterval(refs.startCountdownInterval); refs.startCountdownInterval = null; }
  state.startCountdown = null;
}

function resetWorkoutState() {
  clearStartCountdown();
  state.timerActive = false; state.started = false;
  state.segmentIndex = 0;
  state.timeLeft = getSegments()[0]?.seconds || 0;
  state.distance = 0; state.routePoints = []; state.gpsError = "";
  state.splits = createEmptySplits(getSegments());
  refs.lastPos = null; refs.currentSegmentDistance = 0;
  refs.segmentStartedAt = Date.now();
  refs.lastTenSecondBeep = null; refs.lastSegmentBeep = 0;
  refs.savedResult = false; refs.prevSegmentIndex = -1;
  stopGeolocationWatch(); stopTimer();
}

function finalizeSplit(index, actualSecondsOverride = null) {
  state.splits = state.splits.map((split, i) => {
    if (i !== index) return split;
    return {
      ...split, distance: refs.currentSegmentDistance,
      actualSeconds: actualSecondsOverride ?? Math.max(0, Math.round((Date.now() - refs.segmentStartedAt) / 1000)),
    };
  });
  refs.currentSegmentDistance = 0;
  refs.segmentStartedAt = Date.now();
}

/* ─── GEOLOCATION ───────────────────────────────────────────────────────── */
function startGeolocationWatch() {
  if (!state.started) return;
  if (!navigator.geolocation) {
    state.gpsError = "Geolocation is not available on this device/browser.";
    render(); return;
  }
  stopGeolocationWatch();
  refs.watchId = navigator.geolocation.watchPosition(
    (pos) => {
      state.gpsError = "";
      const accuracy = pos.coords.accuracy ?? 0;
      const point = { lat: pos.coords.latitude, lng: pos.coords.longitude, timestamp: pos.timestamp, accuracy };
      if (accuracy > 35) { render(); return; }
      state.routePoints.push(point);
      if (refs.lastPos) {
        const delta = haversineDistance(refs.lastPos, point);
        if (delta >= 0.8 && delta <= 80) { state.distance += delta; refs.currentSegmentDistance += delta; }
      }
      refs.lastPos = point;
      render();
    },
    (error) => {
      if (error.code === 1) state.gpsError = "Location permission was denied.";
      else if (error.code === 2) state.gpsError = "Position unavailable. Move outdoors.";
      else if (error.code === 3) state.gpsError = "Location request timed out.";
      else state.gpsError = "Unable to track GPS location.";
      render();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 1500 }
  );
}

function stopGeolocationWatch() {
  if (refs.watchId !== null && navigator.geolocation) { navigator.geolocation.clearWatch(refs.watchId); refs.watchId = null; }
}

function stopTimer() {
  if (refs.timerInterval) { window.clearInterval(refs.timerInterval); refs.timerInterval = null; }
}

function maybeSaveWorkoutResult() {
  const elapsedSeconds = getElapsedSeconds();
  if (state.started || state.timerActive || state.timeLeft !== 0 || refs.savedResult) return;
  if (!getSegments().length || elapsedSeconds <= 0) return;
  refs.savedResult = true;
  state.workoutHistory = [
    buildWorkoutRecord({ selectedWeek: state.selectedWeek, day: getDay(), elapsedSeconds, distance: state.distance, avgPace: getAvgPace(), avgSpeed: getAvgSpeed(), routePoints: state.routePoints, splits: state.splits }),
    ...state.workoutHistory,
  ].slice(0, 30);
  persistState();
}

function maybePlayCountdownBeeps() {
  if (!state.started || !state.timerActive) { refs.lastTenSecondBeep = null; return; }
  if (state.timeLeft <= 10 && state.timeLeft > 0 && refs.lastTenSecondBeep !== state.timeLeft) {
    beeps.finalCountdown(state.timeLeft);
    refs.lastTenSecondBeep = state.timeLeft;
  }
  if (state.timeLeft > 10) refs.lastTenSecondBeep = null;
}

function maybePlayIntervalChangeBeeps() {
  if (!state.started || !state.timerActive) return;
  if (state.segmentIndex !== refs.lastSegmentBeep) {
    if (state.segmentIndex > 0) beeps.intervalChange(getSegments()[state.segmentIndex]?.type || "walk");
    refs.lastSegmentBeep = state.segmentIndex;
  }
}

function startTimer() {
  stopTimer();
  refs.timerInterval = window.setInterval(() => {
    if (state.timeLeft > 1) {
      state.timeLeft -= 1;
      maybePlayCountdownBeeps();
      render(); return;
    }
    const segments = getSegments();
    const currentIndex = state.segmentIndex;
    const nextIndex = currentIndex + 1;
    finalizeSplit(currentIndex, segments[currentIndex]?.seconds || 0);
    if (nextIndex >= segments.length) {
      state.timerActive = false; state.started = false; state.timeLeft = 0;
      beeps.finish();
      state.completed[getDayKey(state.selectedWeek, state.selectedDay)] = true;
      persistState(); stopTimer(); stopGeolocationWatch();
      maybeSaveWorkoutResult(); render(); return;
    }
    state.segmentIndex = nextIndex;
    state.timeLeft = segments[nextIndex].seconds;
    maybePlayIntervalChangeBeeps();
    render();
  }, 1000);
}

/* ─── WORKOUT ACTIONS ───────────────────────────────────────────────────── */
async function startWorkout() {
  await resumeAudio();
  if (state.started) {
    state.timerActive = true; startTimer(); maybePlayCountdownBeeps(); render(); return;
  }
  clearStartCountdown();
  state.timerActive = false; state.started = false;
  state.segmentIndex = 0;
  state.timeLeft = getSegments()[0]?.seconds || 0;
  refs.savedResult = false; state.distance = 0; state.routePoints = [];
  state.gpsError = ""; state.splits = createEmptySplits(getSegments());
  refs.lastPos = null; refs.currentSegmentDistance = 0;
  refs.segmentStartedAt = Date.now();
  refs.lastTenSecondBeep = null; refs.lastSegmentBeep = 0; refs.prevSegmentIndex = -1;

  let count = 3;
  state.startCountdown = count;
  beeps.startCountdown(count);
  render();

  refs.startCountdownInterval = window.setInterval(() => {
    count -= 1;
    if (count > 0) { state.startCountdown = count; beeps.startCountdown(count); render(); return; }
    state.startCountdown = 0; beeps.startCountdown(0); render();
    window.clearInterval(refs.startCountdownInterval);
    refs.startCountdownInterval = null;
    window.setTimeout(() => {
      clearStartCountdown();
      state.started = true; state.timerActive = true;
      state.segmentIndex = 0;
      state.timeLeft = getSegments()[0]?.seconds || 0;
      refs.segmentStartedAt = Date.now(); refs.lastSegmentBeep = 0;
      startGeolocationWatch(); startTimer(); render();
    }, 250);
  }, 1000);
}

function pauseWorkout() { clearStartCountdown(); state.timerActive = false; stopTimer(); render(); }
function stopWorkout() { resetWorkoutState(); render(); }

function selectWorkout(weekIndex, dayIndex) {
  clearStartCountdown(); refs.savedResult = false;
  state.selectedWeek = weekIndex; state.selectedDay = dayIndex;
  state.timerActive = false; state.started = false;
  state.distance = 0; state.routePoints = []; state.gpsError = "";
  refs.lastPos = null; refs.currentSegmentDistance = 0;
  refs.segmentStartedAt = Date.now();
  state.timeLeft = getSegments()[0]?.seconds || 0;
  state.splits = createEmptySplits(getSegments());
  stopTimer(); stopGeolocationWatch();
  persistState(); render();
}

function renderTabs(activeTab) { state.activeTab = activeTab; render(); }
function toggleWeek(weekIndex) { state.planExpandedWeek = state.planExpandedWeek === weekIndex ? -1 : weekIndex; render(); }
function clearHistory() { state.workoutHistory = []; localStorage.removeItem(STORAGE_KEYS.history); render(); }
function toggleSound() { state.soundEnabled = !state.soundEnabled; persistState(); render(); }
function toggleAutoCenter() { state.autoCenter = !state.autoCenter; render(); }

/* ─── ANIMATION HELPERS ─────────────────────────────────────────────────── */
function addRipple(btn, event) {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = (event.clientX - rect.left) - size / 2;
  const y = (event.clientY - rect.top) - size / 2;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function updateBodyState() {
  const body = document.body;
  body.classList.remove("state-run", "state-walk", "timer-active");
  if (state.timerActive) body.classList.add("timer-active");
  if (!state.started) return;
  const seg = getSegments()[state.segmentIndex];
  if (seg?.type === "run") body.classList.add("state-run");
  else if (seg?.type === "walk") body.classList.add("state-walk");
}

/* ─── RENDER ────────────────────────────────────────────────────────────── */
function render() {
  maybeSaveWorkoutResult();
  persistState();
  updateBodyState();

  const day = getDay();
  const segments = getSegments();
  const currentSegment = segments[state.segmentIndex] || null;
  const elapsedSeconds = getElapsedSeconds();
  const sessionProgress = getSessionProgress();
  const avgPace = getAvgPace();
  const avgSpeed = getAvgSpeed();
  const smoothedRoutePoints = smoothRoutePoints(state.routePoints);
  const miniMapPoints = buildMiniMapPoints(smoothedRoutePoints);
  const currentSplitDistance = refs.currentSegmentDistance;
  const latest = latestPoint();
  const first = firstPoint();
  const googleMapsEmbedUrl = getGoogleMapsEmbedUrl(latest);
  const googleMapsExternalUrl = getGoogleMapsExternalUrl(latest);
  const totalCompletedWorkouts = Object.values(state.completed).filter(Boolean).length;
  const totalWorkouts = PROGRAM.reduce((sum, week) => sum + week.days.length, 0);
  const totalRemaining = getTotalWorkoutSeconds() - elapsedSeconds;

  // Ring progress
  const segProgress = (currentSegment && state.started)
    ? 1 - (state.timeLeft / currentSegment.seconds)
    : 0;
  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - segProgress);
  const segType = currentSegment?.type || "idle";

  // Badge label
  let badgeLabel = "Ready";
  let badgeClass = "type-idle";
  if (state.startCountdown !== null) { badgeLabel = "Get ready…"; badgeClass = "type-idle"; }
  else if (state.started && currentSegment) {
    badgeLabel = currentSegment.label;
    badgeClass = `type-${currentSegment.type}`;
  } else if (!state.started && state.timeLeft === 0 && elapsedSeconds > 0) {
    badgeLabel = "Workout complete!"; badgeClass = "type-idle";
  }

  const app = document.getElementById("app");

  app.innerHTML = `
<div class="app-container">

  <!-- HERO -->
  <header class="hero">
    <div class="hero-left">
      <p class="eyebrow">Couch to 5K</p>
      <h1>Run your<br>first 5K</h1>
      <p class="hero-sub">Week ${state.selectedWeek + 1} — ${day.title} · ${totalMinutes(day)} min</p>
    </div>
    <button id="toggle-sound" class="sound-icon-btn ${state.soundEnabled ? "sound-on" : ""}" title="${state.soundEnabled ? "Mute" : "Unmute"}">
      ${state.soundEnabled ? ICONS.volume : ICONS.mute}
    </button>
  </header>

  <!-- TIMER CARD -->
  <section class="timer-card">
    <!-- Segment badge -->
    <div class="segment-badge-wrap">
      <span class="segment-badge ${badgeClass}" key="${badgeLabel}">
        <span class="badge-dot"></span>
        ${badgeLabel}
      </span>
    </div>

    <!-- Ring -->
    <div class="ring-container">
      <svg class="timer-ring" viewBox="0 0 290 290" aria-hidden="true">
        <defs>
          <linearGradient id="gradRun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff6b4a"/>
            <stop offset="100%" stop-color="#ff9640"/>
          </linearGradient>
          <linearGradient id="gradWalk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4ae3b5"/>
            <stop offset="100%" stop-color="#5edbff"/>
          </linearGradient>
          <linearGradient id="gradIdle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#b8ff5e"/>
            <stop offset="100%" stop-color="#7cff8a"/>
          </linearGradient>
          <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Track -->
        <circle class="ring-track" cx="145" cy="145" r="${RING_RADIUS}"/>
        <!-- Progress ring -->
        <circle
          class="ring-progress type-${segType}"
          cx="145" cy="145"
          r="${RING_RADIUS}"
          stroke-dasharray="${RING_CIRCUMFERENCE.toFixed(2)}"
          stroke-dashoffset="${strokeDashoffset.toFixed(2)}"
          transform="rotate(-90 145 145)"
        />
        <!-- Small tick marks at segments -->
        ${segments.map((_, i) => {
          const angle = (i / segments.length) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const cx2 = 145 + (RING_RADIUS + 14) * Math.cos(rad);
          const cy2 = 145 + (RING_RADIUS + 14) * Math.sin(rad);
          return `<circle cx="${cx2.toFixed(1)}" cy="${cy2.toFixed(1)}" r="2" fill="rgba(255,255,255,0.15)"/>`;
        }).join("")}
      </svg>

      <!-- Center content -->
      <div class="ring-content">
        ${state.startCountdown !== null
          ? `<div class="${state.startCountdown > 0 ? "countdown-overlay" : "countdown-go"}">${state.startCountdown > 0 ? state.startCountdown : "GO"}</div>`
          : `<div class="big-time">${formatTime(state.timeLeft)}</div>
             <div class="time-sub-label">${state.started ? (currentSegment?.type === "run" ? "running" : "walking") : "ready"}</div>`
        }
      </div>
    </div>

    <!-- Progress meta -->
    <div class="session-meta">
      <span class="meta-label">${sessionProgress}%</span>
      <div class="progress-pill">
        <div class="progress-pill-fill" style="width:${sessionProgress}%"></div>
      </div>
      <span class="meta-label right">${formatTime(Math.max(0, totalRemaining))}</span>
    </div>

    <!-- Controls -->
    <div class="controls-row">
      <button id="stop-btn" class="ctrl-btn ctrl-secondary">Stop</button>
      <button id="start-btn" class="ctrl-btn ctrl-primary">${state.timerActive ? "Running" : (state.started ? "Resume" : "Start")}</button>
      <button id="pause-btn" class="ctrl-btn ctrl-secondary">Pause</button>
    </div>
  </section>

  <!-- TABS -->
  <section class="tabs">
    <div class="tabs-list">
      ${["stats","route","splits","history"].map(tab =>
        `<button class="tab-button ${state.activeTab === tab ? "active" : ""}" data-tab="${tab}">${tab}</button>`
      ).join("")}
    </div>

    <!-- STATS -->
    <div class="${state.activeTab === "stats" ? "tab-panel" : "hidden"}">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">${iconEl("distance",13)} Distance</div>
          <div class="stat-value">${formatDistance(state.distance)}</div>
          <div class="stat-note">GPS tracked</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${iconEl("pace",13)} Avg Pace</div>
          <div class="stat-value" style="font-size:20px">${formatPace(avgPace)}</div>
          <div class="stat-note">Per kilometre</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${iconEl("speed",13)} Speed</div>
          <div class="stat-value" style="font-size:20px">${formatSpeed(avgSpeed)}</div>
          <div class="stat-note">Average</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${iconEl("split",13)} Split</div>
          <div class="stat-value">${formatDistance(currentSplitDistance)}</div>
          <div class="stat-note">This interval</div>
        </div>
      </div>
    </div>

    <!-- ROUTE -->
    <div class="${state.activeTab === "route" ? "tab-panel" : "hidden"}">
      <div class="stack">
        <div class="card">
          <div class="row-between">
            <div>
              <p class="card-title">${iconEl("distance",15)} Google Maps</p>
              <p class="card-sub">${latest ? "Centred on your latest position" : "Allow location access to show map"}</p>
            </div>
            <div class="route-actions">
              ${googleMapsExternalUrl ? `<a href="${googleMapsExternalUrl}" target="_blank" rel="noreferrer" class="pill-btn">${iconEl("external",13)} Open</a>` : ""}
              <button id="toggle-auto-center" class="icon-circle-btn ${state.autoCenter ? "is-active" : ""}" title="${state.autoCenter ? "Auto-centre on" : "Auto-centre off"}">${iconEl("center",14)}</button>
            </div>
          </div>
          <div class="map-frame">
            ${googleMapsEmbedUrl
              ? `<iframe id="map-iframe" title="Map" src="${googleMapsEmbedUrl}" class="iframe-map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
              : `<div class="map-empty">📍 No location yet</div>`}
          </div>
        </div>

        <div class="card">
          <p class="card-title">${iconEl("speed",15)} Route sketch</p>
          <p class="card-sub">${state.routePoints.length > 1 ? "Smoothed GPS route" : "Your route appears here as you run"}</p>
          <div class="mini-map">
            <svg viewBox="0 0 320 164" class="mini-map-svg">
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#4ae3b5"/>
                  <stop offset="100%" stop-color="#5edbff"/>
                </linearGradient>
              </defs>
              <rect width="320" height="164" fill="#0b0e18"/>
              ${miniMapPoints ? (() => {
                const coords = miniMapPoints.split(" ");
                const [sx,sy] = (coords[0]||"160,82").split(",");
                const [ex,ey] = (coords[coords.length-1]||"160,82").split(",");
                return `
                  <polyline fill="none" stroke="url(#routeGrad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" points="${miniMapPoints}" opacity="0.9"/>
                  <circle cx="${sx}" cy="${sy}" r="5.5" fill="#4ae3b5"/>
                  <circle cx="${ex}" cy="${ey}" r="5.5" fill="#5edbff"/>
                  <rect x="10" y="10" width="90" height="28" rx="9" fill="rgba(0,0,0,0.6)"/>
                  <text x="20" y="22" font-size="9" fill="#64748b" font-family="Manrope,sans-serif">Distance</text>
                  <text x="20" y="34" font-size="11" font-weight="700" fill="#eef0f8" font-family="Anton,sans-serif">${formatDistance(state.distance)}</text>
                `;
              })() : `<text x="160" y="82" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-size="13" font-family="Manrope,sans-serif">No route yet</text>`}
            </svg>
          </div>
          ${first || latest ? `
            <div class="coords-grid">
              <div class="coord-card"><strong>Start</strong>${first ? `${first.lat.toFixed(5)}, ${first.lng.toFixed(5)}` : "—"}</div>
              <div class="coord-card"><strong>Current</strong>${latest ? `${latest.lat.toFixed(5)}, ${latest.lng.toFixed(5)}` : "—"}</div>
            </div>` : ""}
          ${state.gpsError ? `<p class="error-text">⚠️ ${state.gpsError}</p>` : ""}
        </div>
      </div>
    </div>

    <!-- SPLITS -->
    <div class="${state.activeTab === "splits" ? "tab-panel" : "hidden"}">
      <div class="card">
        <p class="card-title">${iconEl("split",15)} Split intervals</p>
        <p class="card-sub">Distance and time per interval segment.</p>
        <div class="stack-sm">
          ${state.splits.map((split, index) => {
            const isCurrent = index === state.segmentIndex && state.started;
            const currentElapsed = Math.max(0, split.plannedSeconds - state.timeLeft);
            const displayDistance = isCurrent ? currentSplitDistance : split.distance;
            const displaySeconds = isCurrent ? currentElapsed : (split.actualSeconds || split.plannedSeconds);
            const displayPace = displayDistance > 0 ? displaySeconds / (displayDistance / 1000) : 0;
            return `
              <div class="split-card ${isCurrent ? "active" : ""}">
                <div class="row-between">
                  <div>
                    <div class="split-title">${split.label}</div>
                    <div class="split-type">${split.type}</div>
                  </div>
                  <div class="split-metrics">
                    <div>${formatDistance(displayDistance)}</div>
                    <div>${formatDurationLong(displaySeconds)}</div>
                  </div>
                </div>
                <div class="split-pace">Pace: ${formatPace(displayPace)}</div>
              </div>`;
          }).join("")}
        </div>
      </div>
    </div>

    <!-- HISTORY -->
    <div class="${state.activeTab === "history" ? "tab-panel" : "hidden"}">
      <div class="card">
        <p class="card-title">${iconEl("history",15)} Saved runs</p>
        <p class="card-sub">Last 30 completed workouts stored on this device.</p>
        <div class="stack-sm">
          ${state.workoutHistory.length
            ? state.workoutHistory.map(run => `
              <div class="history-card">
                <div class="row-between">
                  <div>
                    <div class="split-title">Week ${run.week} · ${run.dayTitle}</div>
                    <div class="split-type">${new Date(run.completedAt).toLocaleString()}</div>
                  </div>
                  <div class="split-metrics">
                    <div>${formatDistance(run.distance)}</div>
                    <div>${formatDurationLong(run.totalSeconds)}</div>
                  </div>
                </div>
                <div class="history-tags">
                  <span class="tag">⚡ ${formatPace(run.averagePace)}</span>
                  <span class="tag">🔥 ${formatSpeed(run.averageSpeed)}</span>
                  <span class="tag">${run.splits.length} splits</span>
                </div>
              </div>`).join("")
            : `<div class="empty-card">No saved runs yet.<br>Complete a workout to see it here.</div>`}
          ${state.workoutHistory.length ? `<button id="clear-history" class="secondary-btn full-width" style="margin-top:4px">Clear history</button>` : ""}
        </div>
      </div>
    </div>
  </section>

  <!-- WORKOUT PLAN -->
  <section class="card">
    <div class="plan-header">
      <div>
        <h3 class="plan-title">Workout plan</h3>
        <p class="plan-sub">9 weeks to your first 5K</p>
      </div>
      <span class="summary-pill">${totalCompletedWorkouts}/${totalWorkouts} done</span>
    </div>
    <div class="stack-sm">
      ${PROGRAM.map((week, weekIndex) => {
        const expanded = state.planExpandedWeek === weekIndex;
        return `
          <div class="week-card">
            <button class="week-toggle-btn" data-week="${weekIndex}">
              <div>
                <div class="split-title">Week ${week.week}</div>
                <div class="split-type">${week.days.length} workouts · ${week.days.map(d => totalMinutes(d)).join(", ")} min</div>
              </div>
              <div class="week-chevron ${expanded ? "open" : ""}">${ICONS.chevron}</div>
            </button>
            ${expanded ? `
              <div class="stack-sm top-gap">
                ${week.days.map((item, dayIndex) => {
                  const active = state.selectedWeek === weekIndex && state.selectedDay === dayIndex;
                  const done = state.completed[getDayKey(weekIndex, dayIndex)];
                  return `
                    <button class="workout-btn ${active ? "active" : ""}" data-select-week="${weekIndex}" data-select-day="${dayIndex}">
                      <div>
                        <div class="split-title">${item.title}</div>
                        <div class="split-type">${totalMinutes(item)} min · ${item.intervals.map(iv => iv.run > 0 ? `${iv.run}m run` : "").filter(Boolean).join(", ") || "Walk only"}</div>
                      </div>
                      ${done ? `<span class="done-pill">✓ Done</span>` : ""}
                    </button>`;
                }).join("")}
              </div>` : ""}
          </div>`;
      }).join("")}
    </div>
  </section>

</div>
  `;

  bindEvents();

  // Update map iframe if auto-center
  if (state.autoCenter && latest && googleMapsEmbedUrl) {
    const iframe = document.getElementById("map-iframe");
    if (iframe && iframe.src !== googleMapsEmbedUrl) iframe.src = googleMapsEmbedUrl;
  }
}

/* ─── EVENT BINDING ─────────────────────────────────────────────────────── */
function bindEvents() {
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const stopBtn  = document.getElementById("stop-btn");
  const soundBtn = document.getElementById("toggle-sound");
  const centerBtn = document.getElementById("toggle-auto-center");
  const clearBtn = document.getElementById("clear-history");

  // Ripple helper
  function withRipple(btn, fn) {
    if (!btn) return;
    btn.onclick = (e) => { addRipple(btn, e); fn(e); };
  }

  withRipple(startBtn, startWorkout);
  withRipple(pauseBtn, pauseWorkout);
  withRipple(stopBtn,  stopWorkout);
  if (soundBtn) soundBtn.onclick = toggleSound;
  if (centerBtn) centerBtn.onclick = toggleAutoCenter;
  if (clearBtn) clearBtn.onclick = clearHistory;

  document.querySelectorAll("[data-tab]").forEach(btn => {
    btn.onclick = () => renderTabs(btn.dataset.tab);
  });

  document.querySelectorAll("[data-week]").forEach(btn => {
    btn.onclick = () => toggleWeek(Number(btn.dataset.week));
  });

  document.querySelectorAll("[data-select-week]").forEach(btn => {
    btn.onclick = () => selectWorkout(Number(btn.dataset.selectWeek), Number(btn.dataset.selectDay));
  });
}

/* ─── BOOT ──────────────────────────────────────────────────────────────── */
runTests();
loadState();
resetWorkoutState();
render();
