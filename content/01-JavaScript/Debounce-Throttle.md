# Debounce & Throttle

## Q
Implement debounce and throttle. What's the difference, and when do you use each?

## Answer
Both limit how often an expensive function runs in response to rapid events, using a closure to hold state between calls. **Debounce** waits for activity to *stop*: every call resets a timer, and the function only runs once things go quiet for N ms — ideal for search-as-you-type or autosave. **Throttle** enforces a *fixed rate*: the function runs at most once per N ms no matter how many calls arrive — ideal for scroll, resize, or mousemove handlers where you want steady updates, not a burst.

## How it works
Both return a wrapper that closes over private state (a timer id for debounce, a last-run timestamp for throttle) — see [[Closures]]. `fn.apply(this, args)` forwards the original `this` and arguments so the throttled/debounced function behaves like the original (see [[This-Binding]]). Debounce cancels the pending timer on each call; throttle checks whether enough time has elapsed since the last run.

## Code
Debounce — collapse a burst into the last call:
```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);                      // cancel the previous pending run
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
const search = debounce((q) => console.log("search:", q), 20);
search("a");
search("ab");
search("abc"); // only the last survives the quiet period
// search: abc
```

Throttle — run at most once per window:
```js
function throttle(fn, limit) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= limit) { last = now; fn.apply(this, args); }
  };
}
const onScroll = throttle((x) => console.log("tick", x), 30);
onScroll(1);                       // runs immediately -> tick 1
onScroll(2);                       // ignored — inside the 30ms window
setTimeout(() => onScroll(3), 40); // after the window -> tick 3
// tick 1
// tick 3
```

## Gotchas
- Debounce with a leading edge (run immediately, then wait) behaves differently from the trailing-edge version above — clarify which one the interviewer wants.
- Forgetting `fn.apply(this, args)` drops the caller's context and arguments — the wrapped handler then misbehaves on events.
- A debounced input handler can lose the *final* keystroke's result if the component unmounts before the timer fires — cancel on cleanup.
- Throttle's timestamp version skips the trailing call; a timer-based version can guarantee the last event still fires.

## Follow-ups
- **"Which for a search box?"** Debounce — you only want the request after the user pauses typing.
- **"Which for infinite scroll / mousemove?"** Throttle — you want steady, rate-limited updates.
- **"How would you cancel a pending debounce?"** Expose a `.cancel()` that does `clearTimeout(timer)`.

## Related
[[Closures]] · [[This-Binding]] · [[React-Coding-Questions]]
