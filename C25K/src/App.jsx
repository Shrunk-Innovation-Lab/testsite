import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  segments.push({
    label: "Cool down walk",
    type: "walk",
    seconds: Math.round(day.cooldown * 60),
  });
  return segments;
}

function totalMinutes(day) {
  const base = day.warmup + day.cooldown;
  const intervals = day.intervals.reduce(
    (sum, item) => sum + (item.run + item.walk) * item.repeat,
    0
  );
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

function buildWorkoutRecord({
  selectedWeek,
  day,
  elapsedSeconds,
  distance,
  avgPace,
  avgSpeed,
  routePoints,
  splits,
}) {
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
        if (typeof window !== "undefined") {
          window.setTimeout(() => playTone(1174, 0.16, "triangle", 0.05), 120);
        }
      } else {
        playTone(659, 0.12, "triangle", 0.05);
        if (typeof window !== "undefined") {
          window.setTimeout(() => playTone(523, 0.16, "triangle", 0.05), 120);
        }
      }
    },
    finish() {
      playTone(784, 0.14, "triangle", 0.05);
      if (typeof window !== "undefined") {
        window.setTimeout(() => playTone(988, 0.18, "triangle", 0.05), 160);
        window.setTimeout(() => playTone(1318, 0.24, "triangle", 0.05), 340);
      }
    },
  };
}

export default function App() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [started, setStarted] = useState(false);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [distance, setDistance] = useState(0);
  const [routePoints, setRoutePoints] = useState([]);
  const [gpsError, setGpsError] = useState("");
  const [completed, setCompleted] = useState({});
  const [splits, setSplits] = useState([]);
  const [startCountdown, setStartCountdown] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [planExpandedWeek, setPlanExpandedWeek] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("stats");
  const [autoCenter, setAutoCenter] = useState(true);

  const watchRef = useRef(null);
  const lastPosRef = useRef(null);
  const segmentIndexRef = useRef(0);
  const currentSegmentDistanceRef = useRef(0);
  const segmentStartedAtRef = useRef(Date.now());
  const audioContextRef = useRef(null);
  const startCountdownIntervalRef = useRef(null);
  const lastTenSecondBeepRef = useRef(null);
  const lastSegmentBeepRef = useRef(0);
  const savedResultRef = useRef(false);
  const iframeRef = useRef(null);

  const day = PROGRAM[selectedWeek].days[selectedDay];
  const segments = useMemo(() => buildSegments(day), [day]);

  const totalWorkoutSeconds = useMemo(
    () => segments.reduce((sum, seg) => sum + seg.seconds, 0),
    [segments]
  );

  const elapsedSeconds = useMemo(() => {
    const finishedSeconds = segments
      .slice(0, segmentIndex)
      .reduce((sum, seg) => sum + seg.seconds, 0);
    const currentSegmentSeconds = segments[segmentIndex]?.seconds || 0;
    return Math.max(0, finishedSeconds + (currentSegmentSeconds - timeLeft));
  }, [segments, segmentIndex, timeLeft]);

  const sessionProgress = totalWorkoutSeconds
    ? Math.round((elapsedSeconds / totalWorkoutSeconds) * 100)
    : 0;

  const currentSegment = segments[segmentIndex] || null;
  const avgPace = distance > 0 ? elapsedSeconds / (distance / 1000) : 0;
  const avgSpeed = elapsedSeconds > 0 ? distance / elapsedSeconds : 0;
  const smoothedRoutePoints = useMemo(() => smoothRoutePoints(routePoints), [routePoints]);
  const miniMapPoints = useMemo(
    () => buildMiniMapPoints(smoothedRoutePoints),
    [smoothedRoutePoints]
  );
  const currentSplitDistance = currentSegmentDistanceRef.current;
  const latestPoint = routePoints[routePoints.length - 1] || lastPosRef.current;
  const firstPoint = routePoints[0] || null;
  const googleMapsEmbedUrl = getGoogleMapsEmbedUrl(latestPoint);
  const googleMapsExternalUrl = getGoogleMapsExternalUrl(latestPoint);
  const totalCompletedWorkouts = Object.values(completed).filter(Boolean).length;

  useEffect(() => {
    try {
      const storedCompleted = localStorage.getItem(STORAGE_KEYS.completed);
      const storedSound = localStorage.getItem(STORAGE_KEYS.soundEnabled);
      const storedHistory = localStorage.getItem(STORAGE_KEYS.history);
      const storedSelected = localStorage.getItem(STORAGE_KEYS.selectedWorkout);

      if (storedCompleted) setCompleted(JSON.parse(storedCompleted));
      if (storedSound !== null) setSoundEnabled(storedSound === "true");
      if (storedHistory) setWorkoutHistory(JSON.parse(storedHistory));
      if (storedSelected) {
        const parsed = JSON.parse(storedSelected);
        setSelectedWeek(parsed.week ?? 0);
        setSelectedDay(parsed.day ?? 0);
        setPlanExpandedWeek(parsed.week ?? 0);
      }
    } catch (error) {
      console.error("Failed to restore saved data", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.soundEnabled, String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.selectedWorkout,
      JSON.stringify({ week: selectedWeek, day: selectedDay })
    );
  }, [selectedWeek, selectedDay]);

  const playTone = useCallback(
    (frequency = 880, duration = 0.12, type = "sine", volume = 0.05) => {
      if (!soundEnabled) return;

      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContextClass();
        }

        const context = audioContextRef.current;
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
    },
    [soundEnabled]
  );

  const beeps = useMemo(() => createBeepScheduler(playTone), [playTone]);

  const resumeAudio = useCallback(async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  }, []);

  const clearStartCountdown = useCallback(() => {
    if (startCountdownIntervalRef.current) {
      window.clearInterval(startCountdownIntervalRef.current);
      startCountdownIntervalRef.current = null;
    }
    setStartCountdown(null);
  }, []);

  useEffect(() => {
    setTimeLeft(segments[0]?.seconds || 0);
    setSplits(createEmptySplits(segments));
    setSegmentIndex(0);
    segmentIndexRef.current = 0;
    currentSegmentDistanceRef.current = 0;
    segmentStartedAtRef.current = Date.now();
    lastTenSecondBeepRef.current = null;
    lastSegmentBeepRef.current = 0;
    savedResultRef.current = false;
    clearStartCountdown();
  }, [segments, clearStartCountdown]);

  useEffect(() => {
    segmentIndexRef.current = segmentIndex;
  }, [segmentIndex]);

  useEffect(() => {
    return () => clearStartCountdown();
  }, [clearStartCountdown]);

  useEffect(() => {
    if (!started || !timerActive) {
      lastTenSecondBeepRef.current = null;
      return;
    }

    if (timeLeft <= 10 && timeLeft > 0 && lastTenSecondBeepRef.current !== timeLeft) {
      beeps.finalCountdown(timeLeft);
      lastTenSecondBeepRef.current = timeLeft;
    }

    if (timeLeft > 10) {
      lastTenSecondBeepRef.current = null;
    }
  }, [timeLeft, timerActive, started, beeps]);

  useEffect(() => {
    if (!started || !timerActive) return;

    if (segmentIndex !== lastSegmentBeepRef.current) {
      if (segmentIndex > 0) {
        beeps.intervalChange(segments[segmentIndex]?.type || "walk");
      }
      lastSegmentBeepRef.current = segmentIndex;
    }
  }, [segmentIndex, timerActive, started, segments, beeps]);

  const finalizeSplit = useCallback((index, actualSecondsOverride = null) => {
    setSplits((prev) =>
      prev.map((split, i) => {
        if (i !== index) return split;
        return {
          ...split,
          distance: currentSegmentDistanceRef.current,
          actualSeconds:
            actualSecondsOverride ??
            Math.max(0, Math.round((Date.now() - segmentStartedAtRef.current) / 1000)),
        };
      })
    );
    currentSegmentDistanceRef.current = 0;
    segmentStartedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!started) {
      if (watchRef.current && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not available on this device/browser.");
      return;
    }

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsError("");

        const accuracy = pos.coords.accuracy ?? 0;
        const point = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: pos.timestamp,
          accuracy,
        };

        if (accuracy > 35) return;

        setRoutePoints((prev) => [...prev, point]);

        if (lastPosRef.current) {
          const delta = haversineDistance(lastPosRef.current, point);
          if (delta >= 0.8 && delta <= 80) {
            setDistance((prev) => prev + delta);
            currentSegmentDistanceRef.current += delta;
          }
        }

        lastPosRef.current = point;
      },
      (error) => {
        if (error.code === 1) setGpsError("Location permission was denied.");
        else if (error.code === 2) setGpsError("Position unavailable. Move to a clearer outdoor area.");
        else if (error.code === 3) setGpsError("Location request timed out.");
        else setGpsError("Unable to track GPS location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1500,
      }
    );

    return () => {
      if (watchRef.current && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
    };
  }, [started]);

  useEffect(() => {
    if (!timerActive || !started) return;

    const id = window.setInterval(() => {
      setTimeLeft((currentTimeLeft) => {
        if (currentTimeLeft > 1) return currentTimeLeft - 1;

        const currentIndex = segmentIndexRef.current;
        const nextIndex = currentIndex + 1;
        finalizeSplit(currentIndex, segments[currentIndex]?.seconds || 0);

        if (nextIndex >= segments.length) {
          setTimerActive(false);
          setStarted(false);
          beeps.finish();
          setCompleted((prev) => ({
            ...prev,
            [getDayKey(selectedWeek, selectedDay)]: true,
          }));
          return 0;
        }

        setSegmentIndex(nextIndex);
        return segments[nextIndex].seconds;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [timerActive, started, segments, selectedWeek, selectedDay, finalizeSplit, beeps]);

  useEffect(() => {
    if (started || timerActive || timeLeft !== 0 || savedResultRef.current) return;
    if (!segments.length || elapsedSeconds <= 0) return;

    savedResultRef.current = true;
    const record = buildWorkoutRecord({
      selectedWeek,
      day,
      elapsedSeconds,
      distance,
      avgPace,
      avgSpeed,
      routePoints,
      splits,
    });

    setWorkoutHistory((prev) => [record, ...prev].slice(0, 30));
  }, [
    started,
    timerActive,
    timeLeft,
    segments.length,
    elapsedSeconds,
    selectedWeek,
    day,
    distance,
    avgPace,
    avgSpeed,
    routePoints,
    splits,
  ]);

  const start = async () => {
    await resumeAudio();

    if (started) {
      setTimerActive(true);
      return;
    }

    clearStartCountdown();
    setTimerActive(false);
    setStarted(false);
    setSegmentIndex(0);
    segmentIndexRef.current = 0;
    setTimeLeft(segments[0]?.seconds || 0);
    savedResultRef.current = false;
    setDistance(0);
    setRoutePoints([]);
    setGpsError("");
    setSplits(createEmptySplits(segments));
    lastPosRef.current = null;
    currentSegmentDistanceRef.current = 0;
    segmentStartedAtRef.current = Date.now();
    lastTenSecondBeepRef.current = null;
    lastSegmentBeepRef.current = 0;

    let count = 3;
    setStartCountdown(count);
    beeps.startCountdown(count);

    startCountdownIntervalRef.current = window.setInterval(() => {
      count -= 1;

      if (count > 0) {
        setStartCountdown(count);
        beeps.startCountdown(count);
        return;
      }

      setStartCountdown(0);
      beeps.startCountdown(0);
      window.clearInterval(startCountdownIntervalRef.current);
      startCountdownIntervalRef.current = null;

      window.setTimeout(() => {
        clearStartCountdown();
        setStarted(true);
        setTimerActive(true);
        setSegmentIndex(0);
        segmentIndexRef.current = 0;
        setTimeLeft(segments[0]?.seconds || 0);
        segmentStartedAtRef.current = Date.now();
        lastSegmentBeepRef.current = 0;
      }, 250);
    }, 1000);
  };

  const pause = () => {
    clearStartCountdown();
    setTimerActive(false);
  };

  const reset = () => {
    clearStartCountdown();
    setTimerActive(false);
    setStarted(false);
    setSegmentIndex(0);
    segmentIndexRef.current = 0;
    setTimeLeft(segments[0]?.seconds || 0);
    savedResultRef.current = false;
    setDistance(0);
    setRoutePoints([]);
    setGpsError("");
    setSplits(createEmptySplits(segments));
    lastPosRef.current = null;
    currentSegmentDistanceRef.current = 0;
    segmentStartedAtRef.current = Date.now();
    lastTenSecondBeepRef.current = null;
    lastSegmentBeepRef.current = 0;
  };

  const selectWorkout = (weekIndex, dayIndex) => {
    clearStartCountdown();
    savedResultRef.current = false;
    setSelectedWeek(weekIndex);
    setSelectedDay(dayIndex);
    setTimerActive(false);
    setStarted(false);
    setDistance(0);
    setRoutePoints([]);
    setGpsError("");
    lastPosRef.current = null;
    currentSegmentDistanceRef.current = 0;
    segmentStartedAtRef.current = Date.now();
  };

  useEffect(() => {
    if (!autoCenter || !latestPoint || !googleMapsEmbedUrl) return;
    if (iframeRef.current) {
      iframeRef.current.src = googleMapsEmbedUrl;
    }
  }, [autoCenter, latestPoint, googleMapsEmbedUrl]);

  return (
    <div className="app-shell">
      <div className="app-container">
        <header className="hero">
          <div>
            <p className="eyebrow">Couch to 5K</p>
            <h1>Run your first 5K</h1>
            <p className="subtle">
              Week {selectedWeek + 1} • {day.title}
            </p>
          </div>
          <div className="hero-badge">👟</div>
        </header>

        <section className="card timer-card">
          <p className="subtle">Current interval</p>
          <h2>{currentSegment?.label || "Ready"}</h2>
          <div className="big-time">{formatTime(timeLeft)}</div>

          <div className="countdown-line">
            {startCountdown !== null ? (
              <span className="countdown-text">
                {startCountdown > 0 ? `Starting in ${startCountdown}` : "Go"}
              </span>
            ) : (
              <span>Session progress {sessionProgress}%</span>
            )}
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${sessionProgress}%` }} />
          </div>

          <div className="sound-row">
            <span>🔊</span>
            <button
              type="button"
              className="pill-button"
              onClick={() => setSoundEnabled((value) => !value)}
            >
              {soundEnabled ? "Sound on" : "Sound off"}
            </button>
          </div>

          <div className="controls-grid">
            <button className="primary-btn" onClick={start}>Start</button>
            <button className="secondary-btn" onClick={pause}>Pause</button>
            <button className="secondary-btn" onClick={reset}>Stop</button>
          </div>
        </section>

        <section className="tabs">
          <div className="tabs-list">
            {["stats", "route", "splits", "history"].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "stats" && (
            <div className="stats-grid">
              <div className="card stat-card">
                <div className="stat-title">Distance</div>
                <div className="stat-value">{formatDistance(distance)}</div>
                <div className="stat-note">Live GPS tracked distance</div>
              </div>

              <div className="card stat-card">
                <div className="stat-title">Pace</div>
                <div className="stat-value">{formatPace(avgPace)}</div>
                <div className="stat-note">Average pace</div>
              </div>

              <div className="card stat-card">
                <div className="stat-title">Speed</div>
                <div className="stat-value">{formatSpeed(avgSpeed)}</div>
                <div className="stat-note">Average speed</div>
              </div>

              <div className="card stat-card">
                <div className="stat-title">Current split</div>
                <div className="stat-value">{formatDistance(currentSplitDistance)}</div>
                <div className="stat-note">Distance in this interval</div>
              </div>
            </div>
          )}

          {activeTab === "route" && (
            <div className="stack">
              <div className="card">
                <div className="row-between">
                  <div>
                    <h3>Google Maps</h3>
                    <p className="subtle">
                      {latestPoint
                        ? "Centered on your latest tracked location"
                        : "Start a workout and allow location access to open the map"}
                    </p>
                  </div>
                  <div className="route-actions">
                    {googleMapsExternalUrl ? (
                      <a
                        href={googleMapsExternalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pill-button"
                      >
                        Open map
                      </a>
                    ) : null}
                    <button
                      type="button"
                      className="pill-button"
                      onClick={() => setAutoCenter((value) => !value)}
                    >
                      {autoCenter ? "Auto-center on" : "Auto-center off"}
                    </button>
                  </div>
                </div>

                <div className="map-frame">
                  {googleMapsEmbedUrl ? (
                    <iframe
                      ref={iframeRef}
                      title="Google Maps route"
                      src={googleMapsEmbedUrl}
                      className="iframe-map"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="map-empty">No map yet</div>
                  )}
                </div>
              </div>

              <div className="card">
                <h3>Route sketch</h3>
                <p className="subtle">
                  {routePoints.length > 1
                    ? "Smoothed route with start, end, and distance overlay"
                    : "Start a workout and allow location access to draw your route"}
                </p>

                <div className="mini-map">
                  <svg viewBox="0 0 320 180" className="mini-map-svg">
                    <rect x="0" y="0" width="320" height="180" fill="#f8fafc" />
                    {miniMapPoints ? (
                      <>
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={miniMapPoints}
                        />
                        {(() => {
                          const coords = miniMapPoints.split(" ");
                          const [startX, startY] = (coords[0] || "160,90").split(",");
                          const [endX, endY] = (coords[coords.length - 1] || "160,90").split(",");

                          return (
                            <>
                              <circle cx={startX} cy={startY} r="6" fill="#0ea5e9" />
                              <circle cx={endX} cy={endY} r="6" fill="#047857" />
                              <rect x="12" y="12" width="100" height="34" rx="10" fill="#ffffff" />
                              <text x="24" y="26" fontSize="10" fill="#64748b">Distance</text>
                              <text x="24" y="40" fontSize="12" fontWeight="700" fill="#0f172a">
                                {formatDistance(distance)}
                              </text>
                            </>
                          );
                        })()}
                      </>
                    ) : (
                      <text x="160" y="90" textAnchor="middle" fill="#94a3b8" fontSize="14">
                        No route yet
                      </text>
                    )}
                  </svg>
                </div>

                {(firstPoint || latestPoint) && (
                  <div className="coords-grid">
                    <div className="coord-card">
                      <strong>Start</strong>
                      <div>
                        {firstPoint
                          ? `${firstPoint.lat.toFixed(5)}, ${firstPoint.lng.toFixed(5)}`
                          : "—"}
                      </div>
                    </div>
                    <div className="coord-card">
                      <strong>End</strong>
                      <div>
                        {latestPoint
                          ? `${latestPoint.lat.toFixed(5)}, ${latestPoint.lng.toFixed(5)}`
                          : "—"}
                      </div>
                    </div>
                  </div>
                )}

                {gpsError ? <p className="error-text">{gpsError}</p> : null}
              </div>
            </div>
          )}

          {activeTab === "splits" && (
            <div className="card">
              <h3>Split distance per interval</h3>
              <p className="subtle">Each interval records its own distance and elapsed time.</p>

              <div className="stack-sm">
                {splits.map((split, index) => {
                  const isCurrent = index === segmentIndex && started;
                  const currentElapsed = Math.max(0, split.plannedSeconds - timeLeft);
                  const displayDistance = isCurrent ? currentSplitDistance : split.distance;
                  const displaySeconds = isCurrent
                    ? currentElapsed
                    : split.actualSeconds || split.plannedSeconds;
                  const displayPace =
                    displayDistance > 0 ? displaySeconds / (displayDistance / 1000) : 0;

                  return (
                    <div
                      key={`${split.label}-${index}`}
                      className={`split-card ${isCurrent ? "active" : ""}`}
                    >
                      <div className="row-between">
                        <div>
                          <div className="split-title">{split.label}</div>
                          <div className="subtle capitalize">{split.type}</div>
                        </div>
                        <div className="split-metrics">
                          <div>{formatDistance(displayDistance)}</div>
                          <div>{formatDurationLong(displaySeconds)}</div>
                        </div>
                      </div>
                      <div className="split-pace">Pace: {formatPace(displayPace)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="card">
              <h3>Saved runs</h3>
              <p className="subtle">
                Your last 30 completed workouts are saved on this device with localStorage.
              </p>

              <div className="stack-sm">
                {workoutHistory.length ? (
                  workoutHistory.map((run) => (
                    <div key={run.id} className="history-card">
                      <div className="row-between">
                        <div>
                          <div className="split-title">
                            Week {run.week} • {run.dayTitle}
                          </div>
                          <div className="subtle">
                            {new Date(run.completedAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="split-metrics">
                          <div>{formatDistance(run.distance)}</div>
                          <div>{formatDurationLong(run.totalSeconds)}</div>
                        </div>
                      </div>

                      <div className="history-tags">
                        <span className="tag">Pace {formatPace(run.averagePace)}</span>
                        <span className="tag">Speed {formatSpeed(run.averageSpeed)}</span>
                        <span className="tag">Splits {run.splits.length}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-card">
                    No saved runs yet. Finish a workout to save it automatically.
                  </div>
                )}

                {workoutHistory.length ? (
                  <button
                    className="secondary-btn full-width"
                    onClick={() => {
                      setWorkoutHistory([]);
                      localStorage.removeItem(STORAGE_KEYS.history);
                    }}
                  >
                    Clear saved history
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <div className="row-between">
            <div>
              <h3>Workout plan</h3>
              <p className="subtle">Switch between workouts.</p>
            </div>
            <div className="summary-pill">
              {totalCompletedWorkouts}/{PROGRAM.reduce((sum, week) => sum + week.days.length, 0)} done
            </div>
          </div>

          <div className="stack-sm top-gap">
            {PROGRAM.map((week, weekIndex) => {
              const expanded = planExpandedWeek === weekIndex;
              return (
                <div key={week.week} className="week-card">
                  <button
                    type="button"
                    onClick={() =>
                      setPlanExpandedWeek((current) =>
                        current === weekIndex ? -1 : weekIndex
                      )
                    }
                    className="week-toggle"
                  >
                    <div>
                      <div className="split-title">Week {week.week}</div>
                      <div className="subtle">{week.days.length} workouts</div>
                    </div>
                    <div>{expanded ? "▲" : "▼"}</div>
                  </button>

                  {expanded && (
                    <div className="stack-sm top-gap">
                      {week.days.map((item, dayIndex) => {
                        const active =
                          selectedWeek === weekIndex && selectedDay === dayIndex;
                        const done = completed[getDayKey(weekIndex, dayIndex)];

                        return (
                          <button
                            key={`${week.week}-${item.title}`}
                            type="button"
                            onClick={() => selectWorkout(weekIndex, dayIndex)}
                            className={`workout-btn ${active ? "active" : ""}`}
                          >
                            <div>
                              <div className="split-title">{item.title}</div>
                              <div className="subtle">{totalMinutes(item)} minutes</div>
                            </div>
                            {done ? <span className="done-pill">Done</span> : null}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
