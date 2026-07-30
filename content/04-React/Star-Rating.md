# React — Star Rating

## Q
Build a star rating: N stars, click to set, hover to preview, controlled, read-only mode, half-stars optional.

## Answer
The trick is **derived UI state**: keep the committed `value` (from props, controlled) plus a transient `hover` index, and fill each star when its position ≤ `hover || value`. So while the mouse is over the stars you preview the hover value; when it leaves, `hover` resets to 0 and the display falls back to the committed rating. Support a `readOnly` mode for showing existing ratings.

## Code
```jsx
import { useState } from "react";

function StarRating({ max = 5, value = 0, onChange, readOnly = false }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div style={{ display: "inline-flex", cursor: readOnly ? "default" : "pointer" }}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={starValue}
            onClick={() => !readOnly && onChange?.(starValue)}
            onMouseEnter={() => !readOnly && setHover(starValue)}
            onMouseLeave={() => !readOnly && setHover(0)}
            style={{ fontSize: 28, color: starValue <= active ? "#f5b301" : "#ccc" }}
            role="button"
            aria-label={`${starValue} star`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

// usage (controlled)
function Demo() {
  const [rating, setRating] = useState(0);
  return (
    <>
      <StarRating value={rating} onChange={setRating} />
      <p>Rated: {rating}</p>
    </>
  );
}
```

## How it works
`const active = hover || value` is the whole idea — one expression that prefers the live preview and falls back to the committed value. Each star compares `starValue <= active` to pick its color. Because `value` comes from props and changes flow up through `onChange`, this is a **controlled** component; the parent owns the truth and the star just renders it.

## Gotchas
- **`hover || value` treats 0 as "no hover"** — that's intentional (0 is falsy, meaning "not hovering"), but it also means you can't hover-preview a rating of 0. Fine here since stars start at 1.
- Guard every handler with `!readOnly` so a display-only rating can't be changed by clicks or hover.
- `onChange?.(starValue)` — optional-chain the callback so an uncontrolled/display usage without `onChange` doesn't throw.

## Follow-ups
- **"Half stars?"** Compare against `active - 0.5` and render two overlaid layers (or a `clip-path`/width-based fill) per star.
- **"Keyboard accessible?"** Wrap in `role="radiogroup"`, make each star a `radio`, and handle arrow keys to move the selection — mouse-only isn't accessible.
- **"Controlled vs uncontrolled?"** As written it's controlled (`value`+`onChange`); for a self-contained widget, hold `value` in internal state instead.

## Related
[[React-Coding-Questions]] · [[Hooks]] · [[State-Management]]
