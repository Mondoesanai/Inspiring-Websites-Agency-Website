# Supervised development window — activation record

| | |
|---|---|
| **Activated** | 2026-10-01T21:29:50.350Z |
| **Deadline** | 2026-10-03T21:29:50.350Z (48h) |
| **Status at activation** | `active`, verified by `supervisor.mjs status` |
| **Bound session** | `939cd2ef-ae5a-4607-93f7-dac635472f9e` (unchanged from the trial) |
| **Bound project** | `C:/Users/mondo/Inspiring Websites website` (unchanged) |
| **Cycle cap** | 400 |
| **Auto-renew** | **No.** Never. |

## The trial that preceded this (inspected, not assumed)

From `state.json` history and `supervisor.log`:

| Cycle | Time (UTC) | Decision | HEAD | Tests | Progressed |
|---|---|---|---|---|---|
| 1 | 19:03:11 | CONTINUE | `b8e8bd8` | 468 | yes |
| 2 | 19:12:52 | CONTINUE | `5f68d3a` | 562 | yes |
| 3 | 19:33:34 | CONTINUE | `30bf2d0` | 686 | yes |
| — | after cycle 3 | **STOP** | — | — | `trial limit reached: 3 continuations` |

Three continuations, each with a different HEAD and a higher test count, then a
cap-triggered stop. The log line for the stop is present. Real events carried
`stop_hook_active`, logged six times as "would recurse" and correctly **not** obeyed
as a veto — vetoing on it would have allowed exactly one continuation.

## What this mechanism can and cannot do

Verified against the installed runtime (Claude Code v2.1.281) and the current
official hooks documentation:

**Supported.** A `Stop` hook fires "when Claude finishes responding". There is **no
documented maximum** on how many times it may block and continue a session, so a
48-hour window needs no new mechanism — only a deadline instead of a 3-cycle cap.
The documented default timeout for a `command` hook is 600s; this one is set to 240s,
well inside it.

**The real limit, stated plainly.** The hook only fires when a turn ends, which means
**it only runs while this session is alive.** It cannot start a session, resume one
after the editor closes, survive a reboot or a sleep, or fire while nothing is
running. So:

> **48 hours is a deadline, not a promise of 48 hours of unattended work.**

If the session ends at hour 3, supervision ends at hour 3. Nothing in this design
changes that, and no number in a config file would.

**Why not an external scheduler.** A cron job or Task Scheduler entry could survive
session death, but it would spawn **new** sessions — which breaks the "keep the exact
existing session binding" requirement, and would spend tokens unattended with no
human present. Not implemented. If that trade is wanted, it needs an explicit
decision; it is listed in the external-setup list rather than done quietly.

**Mitigation for the limit.** Every cycle writes `RESUME.md` — status, reason, HEAD,
test counts, plan position and the next task — so a dead session can be resumed
deliberately with one command. Resuming is a human act, never automatic.

## Controls preserved from the trial

All still enforced, all still tested (67 isolation checks, 0 failing):

- session binding and project binding, compared against `state.json`, never taken from the event
- `pause` / `disable` / `completed` / `blocked` all stop continuation
- atomic lock — two supervisors cannot both run
- duplicate events processed at most once (content hash, not message length)
- bounded retries — two reviewer failures pause it
- no-progress stop — two cycles with no change to repo, checklist or test count
- prompt injection in the event payload cannot change the binding, the caps, or the window

## New stops added for this window

1. **Deadline** — past `deadlineAt`, it pauses and names the window. Checked *before* the cycle cap, so an open cycle budget cannot outlive the window.
2. **No self-renewal** — a test asserts `deadlineAt` is assigned in exactly one place (`start`) and that nothing increments a renewal counter. An agent that can extend its own window has no window.

## Reviewer changes

The reviewer previously received counts plus my own summary, and said so itself:
*"cannot be verified without code review."* It now receives:

- the **actual diff** since the last reviewed checkpoint (committed and uncommitted)
- the **acceptance criteria** of the requirement in play, read from `PROJECT_SPEC.md`
- instructions to judge a **complete workflow**, with "a passing test suite only means
  the written tests pass" and "code that is never called from anywhere is not implemented"

It remains advisory: it can raise a concern and sharpen the next task. It cannot grant
cycles, extend the window, or change the binding.

## Cost and authentication

Uses the owner's existing Claude login through the bundled binary. **No API key**, and
nothing drawn from the acquisition app's operating budget. No credits purchased, no
overages enabled. Development spend is tracked as `devSpendUsd` (trial total: $0.1049).
