# React — Multi-Step Form (Wizard)

## Q
Build a multi-step form: next/back, per-step validation, shared form data, progress indicator, submit at end.

## Answer
Keep two pieces of state: a `step` index and one shared `data` object spanning all steps — not separate state per step, so nothing is lost when you go back. `step` decides which fields render; `validate()` checks only the current step's fields and gates `next`/`submit`. Persisting all fields in one object is the key design point: back/next just changes which slice you show, and the final submit sends the whole object.

## Code
```jsx
import { useState } from "react";

const steps = ["Account", "Profile", "Review"];

function Wizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ email: "", password: "", name: "", age: "" });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) =>
    setData((d) => ({ ...d, [field]: e.target.value })); // immutable merge

  const validate = () => {
    const err = {};
    if (step === 0) {
      if (!data.email.includes("@")) err.email = "Invalid email";
      if (data.password.length < 6) err.password = "Min 6 chars";
    }
    if (step === 1) {
      if (!data.name) err.name = "Required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => validate() && setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    if (validate()) fetch("/api/register", { method: "POST", body: JSON.stringify(data) });
  };

  return (
    <div>
      {/* progress */}
      <div style={{ display: "flex", gap: 8 }}>
        {steps.map((label, i) => (
          <span key={label} style={{ fontWeight: i === step ? 700 : 400, color: i <= step ? "#2563eb" : "#999" }}>
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {step === 0 && (
        <>
          <input placeholder="Email" value={data.email} onChange={update("email")} />
          {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
          <input type="password" placeholder="Password" value={data.password} onChange={update("password")} />
          {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
        </>
      )}
      {step === 1 && (
        <>
          <input placeholder="Name" value={data.name} onChange={update("name")} />
          {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
          <input placeholder="Age" value={data.age} onChange={update("age")} />
        </>
      )}
      {step === 2 && <pre>{JSON.stringify(data, null, 2)}</pre>}

      <div style={{ marginTop: 12 }}>
        {step > 0 && <button onClick={back}>Back</button>}
        {step < steps.length - 1
          ? <button onClick={next}>Next</button>
          : <button onClick={submit}>Submit</button>}
      </div>
    </div>
  );
}
```

## How it works
`update(field)` is a curried handler returning an `onChange` that spread-merges one field into `data` immutably, so every input is controlled off the same object. `next` runs `validate()` (which only inspects the current `step`'s fields, writing an `errors` map) and advances only if it returns true; `back` just decrements. The last step renders a review and swaps the Next button for Submit.

## Gotchas
- **One shared object, not per-step state** — separate `useState` per step loses earlier answers on back-navigation and makes the final submit awkward.
- **Immutable merges only:** `setData(d => ({ ...d, [field]: value }))`. Mutating `data` directly won't re-render and corrupts history.
- Re-validate on **submit**, not just on each `next` — a user can edit an earlier step then jump forward; the final gate must recheck everything.
- Client validation is UX; the server must validate again (never trust the client).

## Follow-ups
- **"When would you switch to `useReducer`?"** When step transitions and validation get complex — a reducer centralizes "NEXT/BACK/SET_FIELD/SET_ERRORS" transitions and is easier to test. See [[Hooks]].
- **"Real-world validation?"** React Hook Form + Zod/Yup schemas per step — declarative rules, less boilerplate, typed data.
- **"Survive a refresh?"** Persist `data` (and `step`) to localStorage on change and rehydrate on mount — see the `useLocalStorage` hook in [[React-Coding-Questions]].

## Related
[[React-Coding-Questions]] · [[State-Management]] · [[Hooks]]
