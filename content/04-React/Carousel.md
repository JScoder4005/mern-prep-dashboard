# React — Image Carousel / Slider

## Q
Build a carousel: prev/next, dots, auto-play, wrap-around, pause on hover.

## A
Track `index`. Prev/next with modulo wrap. `useEffect` interval for autoplay, cleared on hover/unmount.

## Code
```jsx
import { useState, useEffect, useCallback } from "react";

function Carousel({ images, interval = 3000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = () =>
    setIndex((i) => (i - 1 + images.length) % images.length); // wrap negative

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);          // cleanup on pause/unmount
  }, [next, interval, paused]);

  return (
    <div
      style={{ position: "relative", width: 400, overflow: "hidden" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <img src={images[index]} alt={`slide ${index}`} style={{ width: "100%" }} />
      <button onClick={prev} style={{ position: "absolute", left: 8, top: "50%" }}>‹</button>
      <button onClick={next} style={{ position: "absolute", right: 8, top: "50%" }}>›</button>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: 10, height: 10, borderRadius: "50%", cursor: "pointer",
              background: i === index ? "#2563eb" : "#ccc",
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

## How
Modulo `(i + 1) % len` wraps forward; `(i - 1 + len) % len` wraps backward. Autoplay via interval in effect, paused flag stops it, cleanup prevents leak.

## Why interviewers ask
Timer + cleanup, wrap-around math, derived UI (active dot), event handling.

## Extensions
- Slide animation: `transform: translateX(-index*100%)` on a flex track + CSS transition.
- Swipe (touch events).
- Lazy-load images.
- Keyboard arrows.

## Related
[[Hooks]] · [[Countdown-Timer]]
