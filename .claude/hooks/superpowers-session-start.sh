#!/usr/bin/env sh
# Superpowers activation bootstrap (vendored from obra/superpowers, MIT).
# Runs at session start and injects the "using-superpowers" rule so the
# vendored skills in .claude/skills/ trigger automatically.
# Opt out at any time by setting SUPERPOWERS_DISABLE to a non-empty value.
[ -n "${SUPERPOWERS_DISABLE:-}" ] && exit 0

cat <<'EOF'
# Superpowers is active

Before responding to any request in this repository — including clarifying
questions, exploring the codebase, or entering plan mode — check the project
skills in `.claude/skills/` and invoke any that apply. If there is even a 1%
chance a skill applies, use it. See `.claude/skills/using-superpowers/SKILL.md`
for the full rules.

Common process-skill triggers:
- "Let's build X" / new feature → brainstorming first, then implement.
- "Fix this bug" / test failure → systematic-debugging first.
- Have a spec, before touching code → writing-plans.
- Before claiming work is done → verification-before-completion.
EOF
