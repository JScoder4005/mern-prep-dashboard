# React — Tabs Component

## Q
Build a reusable, accessible Tabs component. Controlled active tab, only active panel rendered.

## Answer
Keep one source of truth — `active` (the selected index). Render the tab buttons in a `role="tablist"` and only the active panel's content below. Clicking or arrow keys update `active`. The interview signal is doing the accessibility properly: `role="tab"`/`tabpanel`, `aria-selected`, and **roving tabindex** (only the active tab is `tabIndex={0}`) so Tab enters the group once and arrow keys move between tabs.

## Code
```jsx
import { useState } from "react";

function Tabs({ tabs }) {
  // tabs = [{ label, content }]
  const [active, setActive] = useState(0);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") setActive((i) => (i + 1) % tabs.length);
    if (e.key === "ArrowLeft") setActive((i) => (i - 1 + tabs.length) % tabs.length);
  };

  return (
    <div>
      <div role="tablist" onKeyDown={onKeyDown} style={{ display: "flex", gap: 4 }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            style={{
              padding: "8px 16px",
              borderBottom: i === active ? "2px solid #2563eb" : "2px solid transparent",
              fontWeight: i === active ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" style={{ padding: 16 }}>
        {tabs[active].content}
      </div>
    </div>
  );
}

// usage
<Tabs
  tabs={[
    { label: "Profile", content: <Profile /> },
    { label: "Settings", content: <Settings /> },
  ]}
/>;
```

## How it works
`active` is the single source of truth. Clicks and arrow keys change it; the arrow handler wraps with modulo so it cycles at both ends. Only `tabs[active].content` is rendered, so inactive panels aren't mounted — cheap, but note that means their state resets when you switch away.

## Gotchas
- **Roving tabindex is the part people miss:** set `tabIndex={0}` on the active tab and `-1` on the rest, or Tab stops on every tab button and keyboard users can't page past the group.
- Rendering only the active panel **discards inactive panel state** (scroll position, form input). If that matters, keep all panels mounted and hide inactive ones with CSS instead.
- Proper wiring links tab↔panel via `id` + `aria-controls`/`aria-labelledby`; the demo omits it for brevity but interviewers may probe.

## Follow-ups
- **"Controlled vs uncontrolled?"** Uncontrolled owns `active` internally; controlled lifts it to the parent via `active` + `onChange` props so URL/deep-linking or external logic can drive it.
- **"Deep-linkable tabs?"** Sync `active` to a URL param (`?tab=settings`) so a shared link opens the right tab.
- **"Lazy vs eager panels?"** Mount-on-demand saves memory; keep-mounted preserves state — call the trade-off explicitly.

## Related
[[React-Coding-Questions]] · [[State-Management]] · [[Hooks]]
