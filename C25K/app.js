const STORAGE_KEYS = {
  completed: "c25k-completed-v1",
  soundEnabled: "c25k-sound-enabled-v1",
  history: "c25k-history-v1",
  selectedWorkout: "c25k-selected-workout-v1",
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

function formatSpeed(metersPerSecond) {
  if (!Number.isFinite(metersPerSecond) || metersPerSecond <= 0) return "0.0 km/h";
  return `${(metersPerSecond * 3.6).toFixed(1)} km/h`;
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

function runTests() {
  const d = haversineDistance({ lat: 0, lng: 0 }, { lat: 0, lng: 0.001 });
  if (d <= 0) throw new Error("distance calc broken");
  if (formatDistance(1200) !== "1.20 km") throw new Error("distance formatting failed");
  if (formatPace(360) !== "6:00 /km") throw new Error("pace formatting failed");
  if (formatSpeed(2.7777777778) !== "10.0 km/h") throw new Error("speed formatting failed");
  if (formatTime(75) !== "1:15") throw new Error("formatTime failed");
  if (formatDurationLong(75) !== "1m 15s") throw new Error("formatDurationLong failed");
  if (getDayKey(0, 0) !== "w1-d1") throw new Error("getDayKey failed");

  const smoothed = smoothRoutePoints([
    { lat: 1, lng: 1 },
    { lat: 2, lng: 2 },
    { lat: 3, lng: 3 },
  ]);
  if (smoothed[1].lat !== 2 || smoothed[1].lng !== 2) {
    throw new Error("route smoothing failed");
  }

  const path = buildMiniMapPoints([
    { lat: -37.81, lng: 144.96 },
    { lat: -37.82, lng: 144.97 },
  ]);
  if (!path.includes(",")) throw new Error("mini map points failed");

  const splits = createEmptySplits([{ label: "Run 1 min", type: "run", seconds: 60 }]);
  if (splits.length !== 1 || splits[0].distance !== 0) throw new Error("split creation failed");

  const calls = [];
  const scheduler = createBeepScheduler((freq) => calls.push(freq));
  scheduler.startCountdown(3);
  scheduler.finalCountdown(10);
  if (calls.length !== 2) throw new Error("audio scheduler failed");

  if (!getGoogleMapsEmbedUrl({ lat: -37.81, lng: 144.96 }).includes("output=embed")) {
    throw new Error("google maps embed url failed");
  }
  if (!getGoogleMapsExternalUrl({ lat: -37.81, lng: 144.96 }).includes("query=")) {
    throw new Error("google maps external url failed");
  }

  const record = buildWorkoutRecord({
    selectedWeek: 0,
    day: { title: "Day 1" },
    elapsedSeconds: 600,
    distance: 1200,
    avgPace: 500,
    avgSpeed: 2.4,
    routePoints: [],
    splits: [],
  });
  if (record.week !== 1 || record.dayTitle !== "Day 1") throw new Error("workout record failed");

  const weekOneSegments = buildSegments(PROGRAM[0].days[0]);
  if (weekOneSegments.length !== 18) throw new Error("buildSegments failed");
}

const state = {
  selectedWeek: 0,
  selectedDay: 0,
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
  planExpandedWeek: 0,
  workoutHistory: [],
  activeTab: "stats",
  autoCenter: true,
};

const refs = {
  watchId: null,
  lastPos: null,
  currentSegmentDistance: 0,
  segmentStartedAt: Date.now(),
  audioContext: null,
  startCountdownInterval: null,
  lastTenSecondBeep: null,
  lastSegmentBeep: 0,
  savedResult: false,
  timerInterval: null,
};

function getDay() {
  return PROGRAM[state.selectedWeek].days[state.selectedDay];
}

function getSegments() {
  return buildSegments(getDay());
}

function getTotalWorkoutSeconds() {
  return getSegments().reduce((sum, seg) => sum + seg.seconds, 0);
}

function getElapsedSeconds() {
  const segments = getSegments();
  const finishedSeconds = segments
    .slice(0, state.segmentIndex)
    .reduce((sum, seg) => sum + seg.seconds, 0);
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

function latestPoint() {
  return state.routePoints[state.routePoints.length - 1] || refs.lastPos;
}

function firstPoint() {
  return state.routePoints[0] || null;
}

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
  if (refs.audioContext.state === "suspended") await refs.audioContext.resume();
}

function clearStartCountdown() {
  if (refs.startCountdownInterval) {
    window.clearInterval(refs.startCountdownInterval);
    refs.startCountdownInterval = null;
  }
  state.startCountdown = null;
}

function resetWorkoutState() {
  clearStartCountdown();
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
  stopGeolocationWatch();
  stopTimer();
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
      else if (error.code === 2) state.gpsError = "Position unavailable. Move to a clearer outdoor area.";
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

function stopGeolocationWatch() {
  if (refs.watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(refs.watchId);
    refs.watchId = null;
  }
}

function stopTimer() {
  if (refs.timerInterval) {
    window.clearInterval(refs.timerInterval);
    refs.timerInterval = null;
  }
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

function maybePlayCountdownBeeps() {
  if (!state.started || !state.timerActive) {
    refs.lastTenSecondBeep = null;
    return;
  }

  if (
    state.timeLeft <= 10 &&
    state.timeLeft > 0 &&
    refs.lastTenSecondBeep !== state.timeLeft
  ) {
    beeps.finalCountdown(state.timeLeft);
    refs.lastTenSecondBeep = state.timeLeft;
  }

  if (state.timeLeft > 10) refs.lastTenSecondBeep = null;
}

function maybePlayIntervalChangeBeeps() {
  if (!state.started || !state.timerActive) return;
  if (state.segmentIndex !== refs.lastSegmentBeep) {
    if (state.segmentIndex > 0) {
      beeps.intervalChange(getSegments()[state.segmentIndex]?.type || "walk");
    }
    refs.lastSegmentBeep = state.segmentIndex;
  }
}

function startTimer() {
  stopTimer();
  refs.timerInterval = window.setInterval(() => {
    if (state.timeLeft > 1) {
      state.timeLeft -= 1;
      maybePlayCountdownBeeps();
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
    maybePlayIntervalChangeBeeps();
    render();
  }, 1000);
}

async function startWorkout() {
  await resumeAudio();

  if (state.started) {
    state.timerActive = true;
    startTimer();
    maybePlayCountdownBeeps();
    render();
    return;
  }

  clearStartCountdown();
  state.timerActive = false;
  state.started = false;
  state.segmentIndex = 0;
  state.timeLeft = getSegments()[0]?.seconds || 0;
  refs.savedResult = false;
  state.distance = 0;
  state.routePoints = [];
  state.gpsError = "";
  state.splits = createEmptySplits(getSegments());
  refs.lastPos = null;
  refs.currentSegmentDistance = 0;
  refs.segmentStartedAt = Date.now();
  refs.lastTenSecondBeep = null;
  refs.lastSegmentBeep = 0;

  let count = 3;
  state.startCountdown = count;
  beeps.startCountdown(count);
  render();

  refs.startCountdownInterval = window.setInterval(() => {
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

    window.clearInterval(refs.startCountdownInterval);
    refs.startCountdownInterval = null;

    window.setTimeout(() => {
      clearStartCountdown();
      state.started = true;
      state.timerActive = true;
      state.segmentIndex = 0;
      state.timeLeft = getSegments()[0]?.seconds || 0;
      refs.segmentStartedAt = Date.now();
      refs.lastSegmentBeep = 0;
      startGeolocationWatch();
      startTimer();
      render();
    }, 250);
  }, 1000);
}

function pauseWorkout() {
  clearStartCountdown();
  state.timerActive = false;
  stopTimer();
  render();
}

function stopWorkout() {
  resetWorkoutState();
  render();
}

function selectWorkout(weekIndex, dayIndex) {
  clearStartCountdown();
  refs.savedResult = false;
  state.selectedWeek = weekIndex;
  state.selectedDay = dayIndex;
  state.timerActive = false;
  state.started = false;
  state.distance = 0;
  state.routePoints = [];
  state.gpsError = "";
  refs.lastPos = null;
  refs.currentSegmentDistance = 0;
  refs.segmentStartedAt = Date.now();
  state.timeLeft = getSegments()[0]?.seconds || 0;
  state.splits = createEmptySplits(getSegments());
  stopTimer();
  stopGeolocationWatch();
  persistState();
  render();
}

function renderTabs(activeTab) {
  state.activeTab = activeTab;
  render();
}

function toggleWeek(weekIndex) {
  state.planExpandedWeek = state.planExpandedWeek === weekIndex ? -1 : weekIndex;
  render();
}

function clearHistory() {
  state.workoutHistory = [];
  localStorage.removeItem(STORAGE_KEYS.history);
  render();
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  persistState();
  render();
}

function toggleAutoCenter() {
  state.autoCenter = !state.autoCenter;
  render();
}

function iconText(label) {
  return label;
}

function render() {
  maybeSaveWorkoutResult();
  persistState();

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

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="app-shell">
      <div class="app-container">
        <header class="hero">
          <div>
            <p class="eyebrow">Couch to 5K</p>
            <h1>Run your first 5K</h1>
            <p class="subtle">Week ${state.selectedWeek + 1} • ${day.title}</p>
          </div>
          <div class="hero-badge">👟</div>
        </header>

        <section class="card timer-card">
          <p class="subtle">Current interval</p>
          <h2>${currentSegment?.label || "Ready"}</h2>
          <div class="big-time">${formatTime(state.timeLeft)}</div>

          <div class="countdown-line">
            ${
              state.startCountdown !== null
                ? `<span class="countdown-text">${state.startCountdown > 0 ? `Starting in ${state.startCountdown}` : "Go"}</span>`
                : `<span>Session progress ${sessionProgress}%</span>`
            }
          </div>

          <div class="progress-track">
            <div class="progress-fill" style="width: ${sessionProgress}%"></div>
          </div>

          <div class="sound-row">
            <span>🔊</span>
            <button id="toggle-sound" class="pill-button">
              ${state.soundEnabled ? "Sound on" : "Sound off"}
            </button>
          </div>

          <div class="controls-grid">
            <button id="start-btn" class="primary-btn">Start</button>
            <button id="pause-btn" class="secondary-btn">Pause</button>
            <button id="stop-btn" class="secondary-btn">Stop</button>
          </div>
        </section>

        <section class="tabs">
          <div class="tabs-list">
            <button class="tab-button ${state.activeTab === "stats" ? "active" : ""}" data-tab="stats">stats</button>
            <button class="tab-button ${state.activeTab === "route" ? "active" : ""}" data-tab="route">route</button>
            <button class="tab-button ${state.activeTab === "splits" ? "active" : ""}" data-tab="splits">splits</button>
            <button class="tab-button ${state.activeTab === "history" ? "active" : ""}" data-tab="history">history</button>
          </div>

          <div class="${state.activeTab === "stats" ? "" : "hidden"}">
            <div class="stats-grid">
              <div class="card stat-card">
                <div class="stat-title">Distance</div>
                <div class="stat-value">${formatDistance(state.distance)}</div>
                <div class="stat-note">Live GPS tracked distance</div>
              </div>

              <div class="card stat-card">
                <div class="stat-title">Pace</div>
                <div class="stat-value">${formatPace(avgPace)}</div>
                <div class="stat-note">Average pace</div>
              </div>

              <div class="card stat-card">
                <div class="stat-title">Speed</div>
                <div class="stat-value">${formatSpeed(avgSpeed)}</div>
                <div class="stat-note">Average speed</div>
              </div>

              <div class="card stat-card">
                <div class="stat-title">Current split</div>
                <div class="stat-value">${formatDistance(currentSplitDistance)}</div>
                <div class="stat-note">Distance in this interval</div>
              </div>
            </div>
          </div>

          <div class="${state.activeTab === "route" ? "" : "hidden"}">
            <div class="stack">
              <div class="card">
                <div class="row-between">
                  <div>
                    <h3>Google Maps</h3>
                    <p class="subtle">
                      ${
                        latest
                          ? "Centered on your latest tracked location"
                          : "Start a workout and allow location access to open the map"
                      }
                    </p>
                  </div>
                  <div class="route-actions">
                    ${
                      googleMapsExternalUrl
                        ? `<a href="${googleMapsExternalUrl}" target="_blank" rel="noreferrer" class="pill-button">Open map</a>`
                        : ""
                    }
                    <button id="toggle-auto-center" class="pill-button">
                      ${state.autoCenter ? "Auto-center on" : "Auto-center off"}
                    </button>
                  </div>
                </div>

                <div class="map-frame">
                  ${
                    googleMapsEmbedUrl
                      ? `<iframe id="map-iframe" title="Google Maps route" src="${googleMapsEmbedUrl}" class="iframe-map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
                      : `<div class="map-empty">No map yet</div>`
                  }
                </div>
              </div>

              <div class="card">
                <h3>Route sketch</h3>
                <p class="subtle">
                  ${
                    state.routePoints.length > 1
                      ? "Smoothed route with start, end, and distance overlay"
                      : "Start a workout and allow location access to draw your route"
                  }
                </p>

                <div class="mini-map">
                  <svg viewBox="0 0 320 180" class="mini-map-svg">
                    <rect x="0" y="0" width="320" height="180" fill="#f8fafc" />
                    ${
                      miniMapPoints
                        ? (() => {
                            const coords = miniMapPoints.split(" ");
                            const [startX, startY] = (coords[0] || "160,90").split(",");
                            const [endX, endY] = (coords[coords.length - 1] || "160,90").split(",");
                            return `
                              <polyline
                                fill="none"
                                stroke="#10b981"
                                stroke-width="4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                points="${miniMapPoints}"
                              />
                              <circle cx="${startX}" cy="${startY}" r="6" fill="#0ea5e9" />
                              <circle cx="${endX}" cy="${endY}" r="6" fill="#047857" />
                              <rect x="12" y="12" width="100" height="34" rx="10" fill="#ffffff" />
                              <text x="24" y="26" font-size="10" fill="#64748b">Distance</text>
                              <text x="24" y="40" font-size="12" font-weight="700" fill="#0f172a">${formatDistance(state.distance)}</text>
                            `;
                          })()
                        : `<text x="160" y="90" text-anchor="middle" fill="#94a3b8" font-size="14">No route yet</text>`
                    }
                  </svg>
                </div>

                ${
                  first || latest
                    ? `
                      <div class="coords-grid">
                        <div class="coord-card">
                          <strong>Start</strong>
                          <div>${first ? `${first.lat.toFixed(5)}, ${first.lng.toFixed(5)}` : "—"}</div>
                        </div>
                        <div class="coord-card">
                          <strong>End</strong>
                          <div>${latest ? `${latest.lat.toFixed(5)}, ${latest.lng.toFixed(5)}` : "—"}</div>
                        </div>
                      </div>
                    `
                    : ""
                }

                ${state.gpsError ? `<p class="error-text">${state.gpsError}</p>` : ""}
              </div>
            </div>
          </div>

          <div class="${state.activeTab === "splits" ? "" : "hidden"}">
            <div class="card">
              <h3>Split distance per interval</h3>
              <p class="subtle">Each interval records its own distance and elapsed time.</p>

              <div class="stack-sm">
                ${state.splits
                  .map((split, index) => {
                    const isCurrent = index === state.segmentIndex && state.started;
                    const currentElapsed = Math.max(0, split.plannedSeconds - state.timeLeft);
                    const displayDistance = isCurrent ? currentSplitDistance : split.distance;
                    const displaySeconds = isCurrent
                      ? currentElapsed
                      : split.actualSeconds || split.plannedSeconds;
                    const displayPace =
                      displayDistance > 0 ? displaySeconds / (displayDistance / 1000) : 0;

                    return `
                      <div class="split-card ${isCurrent ? "active" : ""}">
                        <div class="row-between">
                          <div>
                            <div class="split-title">${split.label}</div>
                            <div class="subtle capitalize">${split.type}</div>
                          </div>
                          <div class="split-metrics">
                            <div>${formatDistance(displayDistance)}</div>
                            <div>${formatDurationLong(displaySeconds)}</div>
                          </div>
                        </div>
                        <div class="split-pace">Pace: ${formatPace(displayPace)}</div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </div>

          <div class="${state.activeTab === "history" ? "" : "hidden"}">
            <div class="card">
              <h3>Saved runs</h3>
              <p class="subtle">Your last 30 completed workouts are saved on this device with localStorage.</p>

              <div class="stack-sm">
                ${
                  state.workoutHistory.length
                    ? state.workoutHistory
                        .map(
                          (run) => `
                            <div class="history-card">
                              <div class="row-between">
                                <div>
                                  <div class="split-title">Week ${run.week} • ${run.dayTitle}</div>
                                  <div class="subtle">${new Date(run.completedAt).toLocaleString()}</div>
                                </div>
                                <div class="split-metrics">
                                  <div>${formatDistance(run.distance)}</div>
                                  <div>${formatDurationLong(run.totalSeconds)}</div>
                                </div>
                              </div>

                              <div class="history-tags">
                                <span class="tag">Pace ${formatPace(run.averagePace)}</span>
                                <span class="tag">Speed ${formatSpeed(run.averageSpeed)}</span>
                                <span class="tag">Splits ${run.splits.length}</span>
                              </div>
                            </div>
                          `
                        )
                        .join("")
                    : `<div class="empty-card">No saved runs yet. Finish a workout to save it automatically.</div>`
                }

                ${
                  state.workoutHistory.length
                    ? `<button id="clear-history" class="secondary-btn full-width">Clear saved history</button>`
                    : ""
                }
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="row-between">
            <div>
              <h3>Workout plan</h3>
              <p class="subtle">Switch between workouts.</p>
            </div>
            <div class="summary-pill">${totalCompletedWorkouts}/${totalWorkouts} done</div>
          </div>

          <div class="stack-sm top-gap">
            ${PROGRAM.map((week, weekIndex) => {
              const expanded = state.planExpandedWeek === weekIndex;
              return `
                <div class="week-card">
                  <button class="week-toggle" data-week="${weekIndex}">
                    <div>
                      <div class="split-title">Week ${week.week}</div>
                      <div class="subtle">${week.days.length} workouts</div>
                    </div>
                    <div>${expanded ? "▲" : "▼"}</div>
                  </button>

                  ${
                    expanded
                      ? `
                        <div class="stack-sm top-gap">
                          ${week.days
                            .map((item, dayIndex) => {
                              const active =
                                state.selectedWeek === weekIndex && state.selectedDay === dayIndex;
                              const done = state.completed[getDayKey(weekIndex, dayIndex)];

                              return `
                                <button class="workout-btn ${active ? "active" : ""}" data-select-week="${weekIndex}" data-select-day="${dayIndex}">
                                  <div>
                                    <div class="split-title">${item.title}</div>
                                    <div class="subtle">${totalMinutes(item)} minutes</div>
                                  </div>
                                  ${done ? `<span class="done-pill">Done</span>` : ""}
                                </button>
                              `;
                            })
                            .join("")}
                        </div>
                      `
                      : ""
                  }
                </div>
              `;
            }).join("")}
          </div>
        </section>
      </div>
    </div>
  `;

  bindEvents();

  if (state.autoCenter && latest && googleMapsEmbedUrl) {
    const iframe = document.getElementById("map-iframe");
    if (iframe) iframe.src = googleMapsEmbedUrl;
  }
}

function bindEvents() {
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const stopBtn = document.getElementById("stop-btn");
  const toggleSoundBtn = document.getElementById("toggle-sound");
  const toggleAutoCenterBtn = document.getElementById("toggle-auto-center");
  const clearHistoryBtn = document.getElementById("clear-history");

  if (startBtn) startBtn.onclick = startWorkout;
  if (pauseBtn) pauseBtn.onclick = pauseWorkout;
  if (stopBtn) stopBtn.onclick = stopWorkout;
  if (toggleSoundBtn) toggleSoundBtn.onclick = toggleSound;
  if (toggleAutoCenterBtn) toggleAutoCenterBtn.onclick = toggleAutoCenter;
  if (clearHistoryBtn) clearHistoryBtn.onclick = clearHistory;

  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.onclick = () => renderTabs(btn.dataset.tab);
  });

  document.querySelectorAll("[data-week]").forEach((btn) => {
    btn.onclick = () => toggleWeek(Number(btn.dataset.week));
  });

  document.querySelectorAll("[data-select-week]").forEach((btn) => {
    btn.onclick = () => {
      selectWorkout(Number(btn.dataset.selectWeek), Number(btn.dataset.selectDay));
    };
  });
}

runTests();
loadState();
resetWorkoutState();
render();
