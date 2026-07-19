# Testing (Jest, Supertest, RTL)

## Q
How do you test a MERN app? Unit vs integration vs e2e. Mocking. Test an Express API + React component.

## A
- **Unit** — one function/module in isolation (fast, many).
- **Integration** — modules together (API + DB).
- **E2E** — full flow through UI (Cypress/Playwright, few).
Testing pyramid: many unit, some integration, few e2e.

## Code
Jest unit test:
```js
function add(a, b) { return a + b; }

test("adds numbers", () => {
  expect(add(2, 3)).toBe(5);
});

describe("scorePassword", () => {
  it("weak for short", () => expect(scorePassword("ab")).toBeLessThan(2));
  it("strong for complex", () => expect(scorePassword("Ab1!xyz9")).toBe(4));
});
```

Mocking:
```js
jest.mock("../db");                 // auto-mock module
const db = require("../db");
db.getUser.mockResolvedValue({ id: 1, name: "X" });

// spy
const spy = jest.spyOn(mailer, "send").mockResolvedValue(true);
expect(spy).toHaveBeenCalledWith("a@b.com");
```

Express API test (Supertest):
```js
const request = require("supertest");
const app = require("../app");

describe("GET /users/:id", () => {
  it("returns user", async () => {
    const res = await request(app).get("/users/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name");
  });

  it("401 without token", async () => {
    const res = await request(app).post("/profile");
    expect(res.status).toBe(401);
  });
});
```

React component test (React Testing Library):
```jsx
import { render, screen, fireEvent } from "@testing-library/react";

test("counter increments", () => {
  render(<Counter />);
  const btn = screen.getByText("+");
  fireEvent.click(btn);
  expect(screen.getByText("1")).toBeInTheDocument();
});

test("async search shows results", async () => {
  render(<Search />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "react" } });
  expect(await screen.findByText(/result/i)).toBeInTheDocument(); // waits
});
```

## Principles
- **RTL** — test behavior/what user sees, not implementation details.
- Query by role/text/label, not class/id.
- `findBy*` = async wait; `getBy*` = sync; `queryBy*` = may be absent.
- Mock external I/O (DB, network, timers), test your logic.
- In-memory Mongo (`mongodb-memory-server`) for integration.
- `jest.useFakeTimers()` for debounce/timers.

## Coverage / CI
```bash
jest --coverage        # % lines/branches
```
Run in CI (GitHub Actions) on every PR.

## Why
Catch regressions, enable refactor, document behavior, ship confidently.

## Where / Scenario
Business logic, API contracts, critical UI flows (login, checkout). Don't chase 100% — test what breaks.

## Related
[[Error-Handling]] · [[React-Coding-Questions]]
