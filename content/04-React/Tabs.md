# React — Tabs Component

## Q
Build a reusable, accessible Tabs component. Controlled active tab, only active panel rendered.

## A
Track `activeIndex`. Render tab buttons + the active panel. Add ARIA roles + keyboard nav.

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

## How
Single source of truth `active`. Clicking or arrow keys change index; only `tabs[active].content` renders (lazy — inactive panels not mounted).

## Why interviewers ask
Reusable component design (data-driven via props), controlled state, ARIA (`tablist`/`tab`/`tabpanel`, `aria-selected`), keyboard nav.

## Variations to mention
- **Uncontrolled** (internal state) vs **controlled** (parent passes `active`+`onChange`).
- Keep inactive panels mounted (preserve state) vs unmount (save memory) — trade-off.
- URL-synced tabs (`?tab=settings`) for deep-linking.

## Related
[[React-Coding-Questions]] · [[State-Management]]
