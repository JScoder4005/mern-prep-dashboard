# React — Countdown Timer / Stopwatch

## Q
Build a countdown timer (and stopwatch): start, pause, reset, accurate display. Common bug: stale closure in setInterval.

## A
`useEffect` + `setInterval` while running. Use **functional updater** to avoid stale state. Clear interval on pause/unmount.

## Code
Countdown:
```jsx
import { useState, useEffect, useRef } from "react";

function Countdown({ initial = 60 }) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {                 // functional -> no stale closure
        if (s <= 1) { clearInterval(id); setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);        // cleanup
  }, [running]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div>
      <h2>{fmt(seconds)}</h2>
      <button onClick={() => setRunning(true)} disabled={running || seconds === 0}>Start</button>
      <button onClick={() => setRunning(false)} disabled={!running}>Pause</button>
      <button onClick={() => { setRunning(false); setSeconds(initial); }}>Reset</button>
    </div>
  );
}
```

Stopwatch (counts up, ms precision via timestamp — accurate):
```jsx
function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed;
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 100);
    return () => clearInterval(id);
  }, [running]); // eslint-disable-line

  return (
    <div>
      <h2>{(elapsed / 1000).toFixed(1)}s</h2>
      <button onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start"}</button>
      <button onClick={() => { setRunning(false); setElapsed(0); }}>Reset</button>
    </div>
  );
}
```

## The classic bug
```jsx
// WRONG - stale closure captures seconds=initial forever
setInterval(() => setSeconds(seconds - 1), 1000);
// RIGHT - functional updater reads latest
setInterval(() => setSeconds((s) => s - 1), 1000);
```

## Why timestamp for stopwatch
`setInterval` drifts (not exact 1000ms). Compute `Date.now() - start` → accurate regardless of tick jitter.

## Why interviewers ask
Tests `useEffect` cleanup, stale closures (huge React gotcha), functional setState, timer accuracy.

## Related
[[Hooks]] · [[Closures]] · [[Carousel]]
