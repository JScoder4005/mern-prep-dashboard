# React — Star Rating

## Q
Build a star rating: N stars, click to set, hover to preview, controlled, read-only mode, half-stars optional.

## A
Track `rating` + transient `hover`. Fill star if its index ≤ (hover || rating).

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

## How
`hover` shows preview while mouse over; falls back to committed `value`. `starValue <= active` decides fill color.

## Why interviewers ask
Tests derived UI state (hover vs value), controlled component pattern, array rendering, accessibility.

## Extensions to mention
- Half stars: compare against `active - 0.5`, use two overlaid layers or clip-path.
- Keyboard support (arrow keys + `role="radiogroup"`).
- Read-only display for reviews.

## Related
[[React-Coding-Questions]] · [[Hooks]]
