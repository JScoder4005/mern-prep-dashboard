# React — Countdown Timer / Stopwatch

## Q
Build a countdown timer (and stopwatch): start, pause, reset, accurate display. Common bug: stale closure in setInterval.

## Answer
Run a `setInterval` inside a `useEffect` that's gated on a `running` flag, and clear it in the cleanup on pause/unmount. The one non-negotiable detail is the **functional state updater** — `setSeconds(s => s - 1)` — because the interval callback is created once and would otherwise close over the `seconds` value from the render that started it, decrementing the same stale number forever. For a stopwatch, don't accumulate ticks (they drift); compute elapsed time from a stored start timestamp so it's accurate regardless of jitter.

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

## Gotchas
- **`setInterval` is not accurate** — the browser doesn't guarantee exactly 1000ms, and throttles background tabs. For anything that must match wall-clock time, derive elapsed from `Date.now() - start` (the stopwatch pattern) rather than counting ticks.
- **Clear the interval in cleanup** — the effect returns `() => clearInterval(id)`, which fires on pause (deps change) and unmount. Forget it and you leak intervals that keep calling `setState` on a gone component.
- Reset must both stop (`setRunning(false)`) and restore the value; leaving `running` true restarts the countdown from the reset value.

## Follow-ups
- **"Why does the naive `setSeconds(seconds - 1)` freeze/repeat?"** The interval closes over `seconds` from its creation render; without a functional updater it subtracts from the same captured value every tick. This is the [[Closures]] loop-variable trap in React form.
- **"How do you keep time correct across a backgrounded tab?"** Store an absolute target/`start` timestamp and recompute remaining time on each tick, so a throttled interval self-corrects when the tab refocuses.
- **"setInterval vs recursive setTimeout?"** A self-scheduling `setTimeout` lets you adjust the delay to compensate for drift and never overlaps if a tick runs long.

## Related
[[Hooks]] · [[Closures]] · [[Carousel]]
