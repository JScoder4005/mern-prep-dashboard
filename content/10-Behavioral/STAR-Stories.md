# Behavioral — STAR Stories

## Q
At 6 YOE they probe ownership, leadership, conflict, impact. Prep stories, not adjectives.

## A
Use **STAR**: Situation → Task → Action → Result (quantify result). Prep 6-8 reusable stories; each maps to multiple questions.

## STAR template
- **S** — context (project, team, constraint).
- **T** — your specific responsibility/goal.
- **A** — what YOU did (decisions, trade-offs, "I" not "we").
- **R** — outcome with numbers (%, time saved, users, latency).

## Stories to prepare
| Story | Answers questions |
|---|---|
| Hard bug you debugged | debugging, persistence, ownership |
| System you scaled/optimized | impact, technical depth |
| Conflict with teammate/manager | conflict, communication |
| Missed deadline / failure | learning, accountability |
| Mentored a junior | leadership |
| Pushed back on bad decision | judgment, courage |
| Led a project/migration | ownership, planning |
| Tight deadline trade-off | prioritization |

## Common questions
```
- Tell me about yourself (2-min pitch: role, strengths, why switching)
- Toughest technical challenge
- Time you disagreed with your team/lead
- A project you're proud of
- A mistake you made + what you learned
- How you handle conflicting priorities
- Why leaving current company? (stay positive - growth, not blame)
- Where in 5 years
```

## Example (scaling)
- **S:** API p95 latency 2s, users complaining, 50k DAU.
- **T:** I owned reducing latency without downtime.
- **A:** Profiled → N+1 Mongo queries. Added compound indexes, Redis cache-aside on hot reads, paginated heavy endpoint. Load-tested before rollout.
- **R:** p95 2s → 200ms (90% drop), DB load -60%, zero downtime deploy.

## Tips
- Quantify everything. Numbers = credibility.
- "I" for your actions, "we" for context only.
- Failure stories: own it → what changed after.
- Why-leaving: growth/scale/tech, never trash current employer.
- Prep questions to ASK them (team, on-call, growth, tech decisions).

## Related
[[Fundamentals]]
