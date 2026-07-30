# React — Image Carousel / Slider

## Q
Build a carousel: prev/next, dots, auto-play, wrap-around, pause on hover.

## Answer
Track a single `index`. Prev/next use modulo so they wrap at both ends (`(i + 1) % len` forward, `(i - 1 + len) % len` backward — the `+ len` matters because JS `%` can go negative). Autoplay is a `setInterval` inside a `useEffect`, cleared on unmount and whenever a `paused` flag (set on hover) is true. Dots are derived UI — the active one is just `i === index`.

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

## How it works
`next` is `useCallback`-memoized on `images.length` so the autoplay effect gets a stable reference and doesn't recreate the interval every render. The effect early-returns when `paused`, otherwise sets an interval calling `next` and clears it on cleanup — so hovering (which sets `paused`) tears the interval down, and leaving restarts it. The dots map over images and highlight `i === index`.

## Gotchas
- **Autoplay + manual nav fight over the timer.** If a click doesn't reset the interval, the next auto-advance can fire almost immediately after a manual one. Include `next` (or the index) in the effect deps so each change restarts the timer cleanly.
- **`%` on a negative number stays negative** in JS — `(-1) % 3 === -1`, not `2`. Always `(i - 1 + len) % len` for backward wrap.
- Clear the interval on unmount (the effect return) or it keeps calling `setState` after the carousel is gone.

## Follow-ups
- **"Smooth slide animation?"** Render all slides in a flex track and animate `transform: translateX(-index * 100%)` with a CSS transition, instead of swapping a single `<img>`.
- **"Touch/swipe support?"** Track `touchstart`/`touchend` X delta and advance when it passes a threshold.
- **"Accessibility?"** Pause on focus as well as hover, label dots as buttons, support arrow keys, and respect `prefers-reduced-motion` by disabling autoplay.

## Related
[[Hooks]] · [[Countdown-Timer]]
