# React — Multi-Step Form (Wizard)

## Q
Build a multi-step form: next/back, per-step validation, shared form data, progress indicator, submit at end.

## A
One `step` index + one `formData` object shared across steps. Validate current step before advancing. Submit on last step.

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

## How
Single `data` object persists across steps (spread-merge on change). `step` decides which fields render. `validate()` gates `next`/`submit`.

## Why interviewers ask
State management across steps, controlled inputs, conditional rendering, validation, immutable updates.

## Scale-ups to mention
- Config-driven steps (array of field schemas).
- `useReducer` for complex form state. See [[Hooks]].
- Libraries: React Hook Form + Zod/Yup for real validation.
- Persist to localStorage so refresh doesn't lose progress. See [[React-Coding-Questions]] (useLocalStorage).

## Related
[[React-Coding-Questions]] · [[State-Management]] · [[Hooks]]
