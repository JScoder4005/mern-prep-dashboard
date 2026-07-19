# Debounce & Throttle

## Q
Implement debounce and throttle. Difference and when to use each?

## A
- **Debounce** — run function only after activity **stops** for N ms. Resets timer on each call. (Wait for pause.)
- **Throttle** — run function **at most once per N ms**, no matter how many calls. (Fixed rate.)

## Code
Debounce:
```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);                 // cancel previous
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
// usage
const onSearch = debounce((q) => api(q), 300);
```

Throttle (timestamp version):
```js
function throttle(fn, limit) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn.apply(this, args);
    }
  };
}
// usage
const onScroll = throttle(() => console.log("scroll"), 200);
```

## How
Both use **closure** to hold timer/timestamp state across calls. See [[Closures]]. `apply(this, args)` preserves context + arguments — see [[This-Binding]].

## Why
Reduce expensive work (API calls, re-renders, layout) triggered by rapid events.

## Where / Scenario
- **Debounce** — search-as-you-type, autosave, resize-then-recalc, form validation.
- **Throttle** — scroll handlers, infinite scroll, mousemove, rate-limit button spam, analytics.

## Related
[[Closures]] · [[This-Binding]] · [[React-Coding-Questions]]
