# Business Builder

An autonomous AI agent that builds and runs a business under **your** standing
instructions. You tell it what you want in plain English; it plans, writes real
code and content, runs commands to build and test what it makes, keeps its own
task board and memory across runs, and stops to ask you only when it hits
something a human has to do.

It's powered by Claude (Opus 4.8) with a real agentic tool loop — this is not a
chatbot that describes a business, it's an operator that assembles one.

> **What it is / isn't.** There's no such thing as an agent with *no* limits — it
> runs on your machine, on your API key, and does what your `mission.md` tells it.
> What it *is*: a genuinely autonomous builder that works unattended, resumes
> where it left off, and hands you finished drafts. Everything it produces is a
> prototype for **you** to review before it goes live. It won't spend money,
> register domains, enter credentials, publish under a real brand, or push code —
> it does everything up to those lines and then asks you.

## Quick start

```bash
# 1. Install deps (adds the Anthropic SDK)
npm install

# 2. Give it a key
export ANTHROPIC_API_KEY=sk-ant-...

# 3. Tell it what business to build
$EDITOR builder/mission.md

# 4. Run a work session
npm run builder -- run "kick off the business and build the first real thing"

# ...or let it run several sessions unattended
npm run builder -- autopilot 5

# Check what it's done
npm run builder -- status
```

## How it works

```
mission.md ─┐
task board ─┼─► system prompt ─► Claude (thinks, calls tools) ─► you review
memory     ─┘                        │
                                     ├─ write_file / edit_file / read_file / list_files
                                     ├─ run_command   (build, test, run — in the workspace)
                                     ├─ web_search     (research, live info)
                                     ├─ task_add / task_update / task_list
                                     ├─ memory_write   (notes for its future self)
                                     ├─ report_to_user (a message straight to you)
                                     └─ finish         (end the session)
```

Everything it builds lives in `builder/workspace/`. Its durable state —
`tasks.json`, `memory.md`, `journal.md` — lives in `builder/state/`. Both are
gitignored, so the agent's work and notes stay out of your commits until you
choose to keep something.

Because the plan and memory are on disk, each run resumes cleanly:
`autopilot` just runs one work session after another, and stops early if the
agent reports it's blocked on you.

## The files

| File | What it is |
|---|---|
| `mission.md` | **Your** standing instructions — what to build, your rules, your constraints. Edit this. |
| `config.ts` | Model, effort, turn caps, paths. Override via env vars. |
| `agent.ts` | The streaming agentic loop. |
| `tools.ts` | The tool surface + safety confinement. |
| `state.ts` | Task board / memory / journal persistence. |
| `cli.ts` | The `run` / `autopilot` / `status` commands. |

## Configuration (env vars)

| Var | Default | Meaning |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | Required. Your Anthropic key (or `ANTHROPIC_AUTH_TOKEN`). |
| `BUILDER_MODEL` | `claude-opus-4-8` | The model. |
| `BUILDER_EFFORT` | `high` | `low`/`medium`/`high`/`xhigh`/`max` — how hard it thinks/acts. |
| `BUILDER_MAX_TURNS` | `40` | Max model turns per work session (a cost/runaway rail). |
| `BUILDER_MAX_TOKENS` | `32000` | Max output tokens per turn. |
| `BUILDER_AUTO_APPROVE` | off | Reserved flag for command auto-approval. |

## Safety

The agent is powerful on purpose, with guardrails that matter:

- **Filesystem confinement** — every file/edit/read is resolved inside
  `builder/workspace/`; paths that escape are rejected.
- **Command denylist** — `sudo`, `rm -rf /` or `~`, `mkfs`, `dd`, fork bombs,
  `shutdown`/`reboot`, and `git push` are refused outright. The shell is real, so
  it can `npm install`, build, and test — it just can't wander or reach outward.
- **Human-only line** — it's instructed to stop at anything irreversible or
  outward-facing (domains, payments, credentials, publishing, spending) and
  report exactly what it needs.
- **Turn cap** — each session is bounded so it can't loop forever or run up a
  surprise bill.

Run it in a sandbox/container if you want a harder boundary. The blocks above
are guardrails, not a substitute for isolation when running fully unattended.

## Cost

Each turn is a Claude API call. A work session is up to `BUILDER_MAX_TURNS`
turns. Start with a small `autopilot` count and watch `status` (and your
Anthropic usage dashboard) before letting it run long.
