const STORAGE_KEYS = {
  completed: "c25k-completed-v2",
  soundEnabled: "c25k-sound-enabled-v2",
  history: "c25k-history-v2",
  selectedWorkout: "c25k-selected-workout-v2",
};

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

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function formatDistance(meters) {
  if (!meters || meters < 1) return "0 m";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

function formatPace(secondsPerKm) {
  if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) return "--:-- /km";
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.round(secondsPerKm % 60);
  if (secs === 60) return `${mins + 1}:00 /km`;
  return `${mins}:${String(secs).padStart(2, "0")} /km`;
}

function formatSpeed(mps) {
  if (!Number.isFinite(mps) || mps <= 0) return "0.0 km/h";
  return `${(mps * 3.6).toFixed(1)} km/h`;
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
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function smoothRoutePoints(points) {
  if (points.length <= 2) return points;
  return points.map((point, index) => {
    if (index === 0 || index === points.length - 1) return point;
    const prev = points[index - 1];
    const next = points[index + 1];
    return {
      ...point,
      lat: (prev.lat + point.lat + next.lat) / 3,
      lng: (prev.lng + point.lng + next.lng) / 3,
    };
  });
}

function buildMiniMapPoints(points, width = 320, height = 180, padding = 16) {
  if (!points.length) return "";
  if (points.length === 1) return `${width / 2},${height / 2}`;
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = Math.max(maxLat - minLat, 0.00001);
  const lngRange = Math.max(maxLng - minLng, 0.00001);

  return points
    .map((p) => {
      const x = padding + ((p.lng - minLng) / lngRange) * (width - padding * 2);
      const y = height - padding - ((p.lat - minLat) / latRange) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

function buildSegments(day) {
  const segments = [{ label: "Warm up walk", type: "walk", seconds: Math.round(day.warmup * 60) }];
  day.intervals.forEach((block) => {
    for (let i = 0; i < block.repeat; i += 1) {
      if (block.run) {
        segments.push({
          label: `Run ${block.run} min`,
          type: "run",
          seconds: Math.round(block.run * 60),
        });
      }
      if (block.walk) {
        segments.push({
          label: `Walk ${block.walk} min`,
          type: "walk",
          seconds: Math.round(block.walk * 60),
        });
      }
    }
  });
  segments.push({ label: "Cool down walk", type: "walk", seconds: Math.round(day.cooldown * 60) });
  return segments;
}

function totalMinutes(day) {
  const base = day.warmup + day.cooldown;
  const intervals = day.intervals.reduce((sum, item) => sum + (item.run + item.walk) * item.repeat, 0);
  return base + intervals;
}

function createEmptySplits(segments) {
  return segments.map((segment, index) => ({
    index,
    label: segment.label,
    type: segment.type,
    plannedSeconds: segment.seconds,
    actualSeconds: 0,
    distance: 0,
  }));
}

function getGoogleMapsEmbedUrl(point) {
  if (!point) return "";
  return `https://www.google.com/maps?q=${point.lat},${point.lng}&z=16&output=embed`;
}

function buildWorkoutRecord({ selectedWeek, day, elapsedSeconds, distance, avgPace, avgSpeed, routePoints, splits }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    completedAt: new Date().toISOString(),
    week: selectedWeek + 1,
    dayTitle: day.title,
    totalSeconds: elapsedSeconds,
    distance,
    averagePace: avgPace,
    averageSpeed: avgSpeed,
    routePoints,
    splits,
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

const state = {
  selectedWeek: 0,
  selectedDay: 0,
  activeScene: "session",
  timerActive: false,
  started: false,
  segmentIndex: 0,
  timeLeft: 0,
  distance: 0,
  routePoints: [],
  gpsError: "",
  completed: {},
  splits: [],
  startCountdown: null,
  soundEnabled: true,
  workoutHistory: [],
};

const refs = {
  timerInterval: null,
  startCountdownInterval: null,
  audioContext: null,
  watchId: null,
  lastPos: null,
  currentSegmentDistance: 0,
  segmentStartedAt: Date.now(),
  lastTenSecondBeep: null,
  lastSegmentBeep: 0,
  savedResult: false,
  timerPulseTimeout: null,
};

function getDay() {
  return PROGRAM[state.selectedWeek].days[state.selectedDay];
}

function getSegments() {
  return buildSegments(getDay());
}

function getElapsedSeconds() {
  const segments = getSegments();
  const finishedSeconds = segments
    .slice(0, state.segmentIndex)
    .reduce((sum, seg) => sum + seg.seconds, 0);
  const currentSegmentSeconds = segments[state.segmentIndex]?.seconds || 0;
  return Math.max(0, finishedSeconds + (currentSegmentSeconds - state.timeLeft));
}

function getTotalWorkoutSeconds() {
  return getSegments().reduce((sum, seg) => sum + seg.seconds, 0);
}

function getProgressPct() {
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

function latestPoint() {
  return state.routePoints[state.routePoints.length - 1] || refs.lastPos;
}

function loadState() {
  try {
    const completed = localStorage.getItem(STORAGE_KEYS.completed);
    const sound = localStorage.getItem(STORAGE_KEYS.soundEnabled);
    const history = localStorage.getItem(STORAGE_KEYS.history);
    const selected = localStorage.getItem(STORAGE_KEYS.selectedWorkout);

    if (completed) state.completed = JSON.parse(completed);
    if (sound !== null) state.soundEnabled = sound === "true";
    if (history) state.workoutHistory = JSON.parse(history);
    if (selected) {
      const parsed = JSON.parse(selected);
      state.selectedWeek = parsed.week ?? 0;
      state.selectedDay = parsed.day ?? 0;
    }
  } catch (error) {
    console.error("Failed to restore saved data", error);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(state.completed));
  localStorage.setItem(STORAGE_KEYS.soundEnabled, String(state.soundEnabled));
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.workoutHistory));
  localStorage.setItem(
    STORAGE_KEYS.selectedWorkout,
    JSON.stringify({ week: state.selectedWeek, day: state.selectedDay })
  );
}

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
  } catch (error) {
    console.error("Audio playback failed", error);
  }
}

const beeps = createBeepScheduler(playTone);

async function resumeAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!refs.audioContext) refs.audioContext = new AudioContextClass();
  if (refs.audioContext.state === "suspended") {
    await refs.audioContext.resume();
  }
}

function stopTimer() {
  if (refs.timerInterval) {
    clearInterval(refs.timerInterval);
    refs.timerInterval = null;
  }
}

function stopStartCountdown() {
  if (refs.startCountdownInterval) {
    clearInterval(refs.startCountdownInterval);
    refs.startCountdownInterval = null;
  }
  state.startCountdown = null;
}

function stopGeolocationWatch() {
  if (refs.watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(refs.watchId);
    refs.watchId = null;
  }
}

function resetWorkoutState() {
  stopTimer();
  stopStartCountdown();
  stopGeolocationWatch();
  state.timerActive = false;
  state.started = false;
  state.segmentIndex = 0;
  state.timeLeft = getSegments()[0]?.seconds || 0;
  state.distance = 0;
  state.routePoints = [];
  state.gpsError = "";
  state.splits = createEmptySplits(getSegments());
  refs.lastPos = null;
  refs.currentSegmentDistance = 0;
  refs.segmentStartedAt = Date.now();
  refs.lastTenSecondBeep = null;
  refs.lastSegmentBeep = 0;
  refs.savedResult = false;
}

function finalizeSplit(index, actualSecondsOverride = null) {
  state.splits = state.splits.map((split, i) => {
    if (i !== index) return split;
    return {
      ...split,
      distance: refs.currentSegmentDistance,
      actualSeconds:
        actualSecondsOverride ??
        Math.max(0, Math.round((Date.now() - refs.segmentStartedAt) / 1000)),
    };
  });
  refs.currentSegmentDistance = 0;
  refs.segmentStartedAt = Date.now();
}

function pulseTimer() {
  const timerEl = document.querySelector(".timer");
  if (!timerEl) return;
  timerEl.classList.add("pulse");
  clearTimeout(refs.timerPulseTimeout);
  refs.timerPulseTimeout = setTimeout(() => {
    timerEl.classList.remove("pulse");
  }, 220);
}

function startGeolocationWatch() {
  if (!state.started) return;
  if (!navigator.geolocation) {
    state.gpsError = "Geolocation is not available on this device/browser.";
    render();
    return;
  }

  stopGeolocationWatch();

  refs.watchId = navigator.geolocation.watchPosition(
    (pos) => {
      state.gpsError = "";
      const accuracy = pos.coords.accuracy ?? 0;
      const point = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        timestamp: pos.timestamp,
        accuracy,
      };

      if (accuracy > 35) {
        render();
        return;
      }

      state.routePoints.push(point);

      if (refs.lastPos) {
        const delta = haversineDistance(refs.lastPos, point);
        if (delta >= 0.8 && delta <= 80) {
          state.distance += delta;
          refs.currentSegmentDistance += delta;
        }
      }

      refs.lastPos = point;
      render();
    },
    (error) => {
      if (error.code === 1) state.gpsError = "Location permission was denied.";
      else if (error.code === 2) state.gpsError = "Position unavailable.";
      else if (error.code === 3) state.gpsError = "Location request timed out.";
      else state.gpsError = "Unable to track GPS location.";
      render();
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1500,
    }
  );
}

function maybeSaveWorkoutResult() {
  const elapsedSeconds = getElapsedSeconds();
  if (state.started || state.timerActive || state.timeLeft !== 0 || refs.savedResult) return;
  if (!getSegments().length || elapsedSeconds <= 0) return;

  refs.savedResult = true;
  state.workoutHistory = [
    buildWorkoutRecord({
      selectedWeek: state.selectedWeek,
      day: getDay(),
      elapsedSeconds,
      distance: state.distance,
      avgPace: getAvgPace(),
      avgSpeed: getAvgSpeed(),
      routePoints: state.routePoints,
      splits: state.splits,
    }),
    ...state.workoutHistory,
  ].slice(0, 30);
  persistState();
}

function startTimer() {
  stopTimer();
  refs.timerInterval = setInterval(() => {
    if (state.timeLeft > 1) {
      state.timeLeft -= 1;
      pulseTimer();

      if (
        state.started &&
        state.timerActive &&
        state.timeLeft <= 10 &&
        state.timeLeft > 0 &&
        refs.lastTenSecondBeep !== state.timeLeft
      ) {
        beeps.finalCountdown(state.timeLeft);
        refs.lastTenSecondBeep = state.timeLeft;
      }

      render();
      return;
    }

    const segments = getSegments();
    const currentIndex = state.segmentIndex;
    const nextIndex = currentIndex + 1;

    finalizeSplit(currentIndex, segments[currentIndex]?.seconds || 0);

    if (nextIndex >= segments.length) {
      state.timerActive = false;
      state.started = false;
      state.timeLeft = 0;
      beeps.finish();
      state.completed[getDayKey(state.selectedWeek, state.selectedDay)] = true;
      persistState();
      stopTimer();
      stopGeolocationWatch();
      maybeSaveWorkoutResult();
      render();
      return;
    }

    state.segmentIndex = nextIndex;
    state.timeLeft = segments[nextIndex].seconds;
    refs.lastTenSecondBeep = null;

    if (state.segmentIndex > 0) {
      beeps.intervalChange(segments[state.segmentIndex]?.type || "walk");
    }

    pulseTimer();
    render();
  }, 1000);
}

async function startWorkout() {
  await resumeAudio();

  if (state.started) {
    state.timerActive = true;
    startTimer();
    render();
    return;
  }

  stopStartCountdown();
  state.timerActive = false;
  state.started = false;
  state.segmentIndex = 0;
  state.timeLeft = getSegments()[0]?.seconds || 0;
  state.distance = 0;
  state.routePoints = [];
  state.gpsError = "";
  state.splits = createEmptySplits(getSegments());
  refs.lastPos = null;
  refs.currentSegmentDistance = 0;
  refs.segmentStartedAt = Date.now();
  refs.lastTenSecondBeep = null;
  refs.lastSegmentBeep = 0;
  refs.savedResult = false;

  let count = 3;
  state.startCountdown = count;
  beeps.startCountdown(count);
  render();

  refs.startCountdownInterval = setInterval(() => {
    count -= 1;

    if (count > 0) {
      state.startCountdown = count;
      beeps.startCountdown(count);
      render();
      return;
    }

    state.startCountdown = 0;
    beeps.startCountdown(0);
    render();

    clearInterval(refs.startCountdownInterval);
    refs.startCountdownInterval = null;

    setTimeout(() => {
      state.startCountdown = null;
      state.started = true;
      state.timerActive = true;
      state.segmentIndex = 0;
      state.timeLeft = getSegments()[0]?.seconds || 0;
      refs.segmentStartedAt = Date.now();
      startGeolocationWatch();
      startTimer();
      render();
    }, 250);
  }, 1000);
}

function pauseWorkout() {
  stopStartCountdown();
  state.timerActive = false;
  stopTimer();
  render();
}

function stopWorkout() {
  resetWorkoutState();
  render();
}

function selectWorkout(weekIndex, dayIndex) {
  state.selectedWeek = weekIndex;
  state.selectedDay = dayIndex;
  resetWorkoutState();
  persistState();
  render();
}

function setScene(scene) {
  state.activeScene = scene;
  render();
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  persistState();
  render();
}

function clearHistory() {
  state.workoutHistory = [];
  localStorage.removeItem(STORAGE_KEYS.history);
  render();
}

function renderSessionScene() {
  const day = getDay();
  const segments = getSegments();
  const currentSegment = segments[state.segmentIndex] || null;
  const progress = getProgressPct();
  const avgPace = getAvgPace();
  const avgSpeed = getAvgSpeed();
  const timerClass = currentSegment?.type === "run" ? "run" : "walk";

  return `
    <section class="scene ${state.activeScene === "session" ? "active" : ""}">
      <div class="hero">
        <div>
          <p class="kicker">Couch to 5K</p>
          <div class="title">Run your first 5K</div>
          <div class="dayline">Week ${state.selectedWeek + 1} • ${day.title}</div>
        </div>
        <div class="badge">⟡</div>
      </div>

      <div class="hero">
        <div class="interval-label">Current interval</div>
        <div class="interval-name">${currentSegment?.label || "Ready"}</div>
        <div class="timer ${timerClass}">${formatTime(state.timeLeft)}</div>
        <div class="substatus">
          ${
            state.startCountdown !== null
              ? `<strong>${state.startCountdown > 0 ? `Starting in ${state.startCountdown}` : "Go"}</strong>`
              : `Progress ${progress}%`
          }
        </div>
        <div class="progress">
          <div class="progress-bar" style="width:${progress}%"></div>
        </div>

        <div class="metrics-row">
          <div class="metric">
            <div class="metric-label">Distance</div>
            <div class="metric-value">${formatDistance(state.distance)}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Pace</div>
            <div class="metric-value">${formatPace(avgPace)}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Speed</div>
            <div class="metric-value">${formatSpeed(avgSpeed)}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Split</div>
            <div class="metric-value">${formatDistance(refs.currentSegmentDistance)}</div>
          </div>
        </div>

        <div class="controls">
          <button class="btn btn-primary" id="start-btn">${state.started && state.timerActive ? "Resume" : "Start"}</button>
          <button class="btn btn-secondary" id="pause-btn">Pause</button>
          <button class="btn btn-secondary" id="stop-btn">Stop</button>
        </div>

        <div class="sound-row">
          <button class="sound-toggle" id="sound-btn">${state.soundEnabled ? "Sound on" : "Sound off"}</button>
        </div>
      </div>

      <div class="scene-panel">
        <div class="row">
          <div>
            <h3 class="panel-title">Workout plan</h3>
            <div class="panel-sub">Choose your next session.</div>
          </div>
          <div class="panel-sub">${Object.values(state.completed).filter(Boolean).length}/${PROGRAM.reduce((n, w) => n + w.days.length, 0)} done</div>
        </div>

        <div class="plan-list">
          ${PROGRAM.map((week, weekIndex) => `
            <div class="plan-week">
              <button class="plan-toggle" data-week="${weekIndex}">
                <div class="row">
                  <div>
                    <div class="strong">Week ${week.week}</div>
                    <div class="small muted">${week.days.length} workouts</div>
                  </div>
                  <div class="small faint">${weekIndex === state.selectedWeek ? "open" : "view"}</div>
                </div>
              </button>
              ${
                weekIndex === state.selectedWeek
                  ? week.days.map((item, dayIndex) => `
                    <button class="plan-day" data-select-week="${weekIndex}" data-select-day="${dayIndex}">
                      <div class="plan-day-card ${weekIndex === state.selectedWeek && dayIndex === state.selectedDay ? "active" : ""}">
                        <div class="row">
                          <div>
                            <div class="strong">${item.title}</div>
                            <div class="small muted">${totalMinutes(item)} minutes</div>
                          </div>
                          <div>
                            ${state.completed[getDayKey(weekIndex, dayIndex)] ? `<span class="done-pill">Done</span>` : ""}
                          </div>
                        </div>
                      </div>
                    </button>
                  `).join("")
                  : ""
              }
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderRouteScene() {
  const latest = latestPoint();
  const first = state.routePoints[0] || null;
  const mapUrl = getGoogleMapsEmbedUrl(latest);
  const miniMapPoints = buildMiniMapPoints(smoothRoutePoints(state.routePoints));

  return `
    <section class="scene ${state.activeScene === "route" ? "active" : ""}">
      <div class="hero">
        <div>
          <p class="kicker">Route</p>
          <div class="title">Live route</div>
          <div class="dayline">${state.routePoints.length ? "Tracking current workout" : "Start a session to see movement"}</div>
        </div>
      </div>

      <div class="scene-panel">
        <h3 class="panel-title">Map</h3>
        <div class="panel-sub">${latest ? "Centered on your latest position" : "Waiting for GPS"}</div>

        <div class="map-frame">
          ${
            mapUrl
              ? `<iframe title="Google Maps" src="${mapUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
              : `<div class="map-empty">No map yet</div>`
          }
        </div>

        <div class="route-sketch">
          <svg viewBox="0 0 320 180">
            <rect x="0" y="0" width="320" height="180" fill="#0b0f14"></rect>
            ${
              miniMapPoints
                ? `
                  <polyline
                    fill="none"
                    stroke="#7cff8a"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    points="${miniMapPoints}"
                  ></polyline>
                `
                : `<text x="160" y="92" text-anchor="middle" fill="rgba(255,255,255,0.36)" font-size="14">No route yet</text>`
            }
          </svg>
        </div>

        ${
          first || latest
            ? `
              <div class="coords-grid">
                <div class="coord-card">
                  <div class="small faint">Start</div>
                  <div class="medium strong">${first ? `${first.lat.toFixed(5)}, ${first.lng.toFixed(5)}` : "—"}</div>
                </div>
                <div class="coord-card">
                  <div class="small faint">End</div>
                  <div class="medium strong">${latest ? `${latest.lat.toFixed(5)}, ${latest.lng.toFixed(5)}` : "—"}</div>
                </div>
              </div>
            `
            : ""
        }

        ${state.gpsError ? `<div class="error-text">${state.gpsError}</div>` : ""}
      </div>
    </section>
  `;
}

function renderHistoryScene() {
  return `
    <section class="scene ${state.activeScene === "history" ? "active" : ""}">
      <div class="hero">
        <div>
          <p class="kicker">History</p>
          <div class="title">Workout log</div>
          <div class="dayline">Your last 30 completed workouts.</div>
        </div>
      </div>

      <div class="scene-panel">
        <h3 class="panel-title">Saved runs</h3>
        <div class="panel-sub">Stored locally on this device.</div>

        <div class="history-list">
          ${
            state.workoutHistory.length
              ? state.workoutHistory.map((run) => `
                  <div class="history-item">
                    <div class="row">
                      <div>
                        <div class="strong">Week ${run.week} • ${run.dayTitle}</div>
                        <div class="small muted">${new Date(run.completedAt).toLocaleString()}</div>
                      </div>
                      <div class="small muted">${formatDistance(run.distance)}</div>
                    </div>
                    <div class="small faint" style="margin-top:10px;">
                      ${formatDurationLong(run.totalSeconds)} • Pace ${formatPace(run.averagePace)} • Speed ${formatSpeed(run.averageSpeed)}
                    </div>
                  </div>
                `).join("")
              : `<div class="history-item"><div class="muted">No saved runs yet.</div></div>`
          }
        </div>

        ${
          state.workoutHistory.length
            ? `<button class="btn btn-secondary" id="clear-history-btn" style="margin-top:14px;width:100%;">Clear history</button>`
            : ""
        }
      </div>
    </section>
  `;
}

function renderNav() {
  return `
    <nav class="bottom-nav">
      <button class="nav-btn ${state.activeScene === "session" ? "active" : ""}" data-scene="session">session</button>
      <button class="nav-btn ${state.activeScene === "route" ? "active" : ""}" data-scene="route">route</button>
      <button class="nav-btn ${state.activeScene === "history" ? "active" : ""}" data-scene="history">history</button>
      <button class="nav-btn ${state.activeScene === "session" ? "" : ""}" data-scene="session">back</button>
    </nav>
  `;
}

function bindEvents() {
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const stopBtn = document.getElementById("stop-btn");
  const soundBtn = document.getElementById("sound-btn");
  const clearHistoryBtn = document.getElementById("clear-history-btn");

  if (startBtn) startBtn.onclick = startWorkout;
  if (pauseBtn) pauseBtn.onclick = pauseWorkout;
  if (stopBtn) stopBtn.onclick = stopWorkout;
  if (soundBtn) soundBtn.onclick = toggleSound;
  if (clearHistoryBtn) clearHistoryBtn.onclick = clearHistory;

  document.querySelectorAll("[data-scene]").forEach((btn) => {
    btn.onclick = () => setScene(btn.dataset.scene);
  });

  document.querySelectorAll("[data-select-week]").forEach((btn) => {
    btn.onclick = () => selectWorkout(Number(btn.dataset.selectWeek), Number(btn.dataset.selectDay));
  });

  document.querySelectorAll("[data-week]").forEach((btn) => {
    btn.onclick = () => {
      state.selectedWeek = Number(btn.dataset.week);
      state.selectedDay = 0;
      resetWorkoutState();
      persistState();
      render();
    };
  });
}

function render() {
  maybeSaveWorkoutResult();
  persistState();

  document.getElementById("app").innerHTML = `
    ${renderSessionScene()}
    ${renderRouteScene()}
    ${renderHistoryScene()}
    ${renderNav()}
  `;

  bindEvents();
}

function init() {
  loadState();
  resetWorkoutState();
  render();
}

init();
