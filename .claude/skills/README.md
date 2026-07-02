# Superpowers skills (vendored)

This directory is a vendored copy of the **skills library** from
[obra/superpowers](https://github.com/obra/superpowers) — Jesse Vincent /
Prime Radiant's agentic software-development methodology for coding agents.

- **Upstream:** https://github.com/obra/superpowers
- **Version:** 6.1.0 (plugin `superpowers`)
- **License:** MIT — see [`LICENSE`](LICENSE) (Copyright (c) 2025 Jesse Vincent)

## Why it's vendored (not installed as a plugin)

This repo's environment can't clone `obra/superpowers` (network access is
scoped to this repository), and Claude Code plugin install isn't available
here. So the `skills/` tree was mirrored file-by-file from
`raw.githubusercontent.com` and committed directly. Claude Code
auto-discovers project skills under `.claude/skills/`, so the skills are
active for any session run in this repo.

## What's included

14 skills, each in its own directory with a `SKILL.md` plus any reference
files and scripts it ships:

| Category | Skills |
|----------|--------|
| Testing | `test-driven-development` |
| Debugging | `systematic-debugging` (root-cause-tracing, defense-in-depth, condition-based-waiting), `verification-before-completion` |
| Collaboration | `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`, `requesting-code-review`, `receiving-code-review`, `using-git-worktrees`, `finishing-a-development-branch` |
| Meta | `writing-skills`, `using-superpowers` |

## Activation

Skills are model-invoked automatically based on their `description`
frontmatter. In addition, `../settings.json` registers a `SessionStart` hook
(`../hooks/superpowers-session-start.sh`) that injects the `using-superpowers`
bootstrap at the start of every session, so the workflow triggers from the
first message — this mirrors the upstream plugin's session-start behavior.

To disable the bootstrap, set the environment variable
`SUPERPOWERS_DISABLE` to any non-empty value.

## Updating

Re-mirror from upstream `main` (or a pinned tag) with `raw.githubusercontent.com`
and replace the contents of this directory. Because this is a vendored copy,
it does not update automatically the way the upstream plugin does.
