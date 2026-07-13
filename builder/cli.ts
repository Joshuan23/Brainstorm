#!/usr/bin/env node
/**
 * Business Builder — command-line entry point.
 *
 *   npm run builder -- run "kick off the business and build the first thing"
 *   npm run builder -- autopilot 5      # run 5 back-to-back work sessions
 *   npm run builder -- status           # show the task board + recent journal
 *   npm run builder -- help
 *
 * The agent's standing instructions live in builder/mission.md — edit that to
 * tell it what business to build and how you want it run.
 */
import fs from "node:fs";
import { runSession, ensureWorkspace } from "./agent.js";
import { renderTaskBoard, loadTasks, journal } from "./state.js";
import { JOURNAL_FILE, MISSION_FILE, MODEL, AUTO_APPROVE } from "./config.js";

function requireApiKey(): boolean {
  if (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) return true;
  console.error(
    "\nNo Anthropic credentials found.\n" +
      "Set ANTHROPIC_API_KEY in your environment (or a .env), e.g.:\n" +
      "  export ANTHROPIC_API_KEY=sk-ant-...\n",
  );
  return false;
}

function showStatus(): void {
  console.log(`\nBusiness Builder — model: ${MODEL}  auto-approve: ${AUTO_APPROVE ? "on" : "off"}\n`);
  console.log("Task board");
  console.log("----------");
  console.log(renderTaskBoard(loadTasks()));
  console.log("\nRecent activity");
  console.log("---------------");
  if (fs.existsSync(JOURNAL_FILE)) {
    const lines = fs.readFileSync(JOURNAL_FILE, "utf8").trim().split("\n");
    console.log(lines.slice(-15).join("\n"));
  } else {
    console.log("(no activity yet)");
  }
  console.log();
}

function showHelp(): void {
  console.log(`
Business Builder — an autonomous agent that builds and runs your business.

Usage:
  npm run builder -- run "<what to do this session>"
      Run one work session toward the mission. Omit the quote to use a
      generic "advance the mission" directive.

  npm run builder -- autopilot [N]
      Run N back-to-back work sessions (default 3), stopping early if the
      agent reports it's blocked on you.

  npm run builder -- status
      Show the task board and recent activity.

  npm run builder -- help

First-time setup:
  1. Edit builder/mission.md — tell it what business to build and your rules.
  2. Set ANTHROPIC_API_KEY in your environment.
  3. npm run builder -- run

The agent builds everything inside builder/workspace/. It keeps a durable
task board and memory so it resumes where it left off. It stops at anything
only you can do (domains, payments, credentials, going live) and asks.
`);
}

async function autopilot(cycles: number): Promise<void> {
  console.log(`\nAutopilot: up to ${cycles} work session(s).\n`);
  for (let i = 1; i <= cycles; i++) {
    console.log(`\n========== Autopilot cycle ${i}/${cycles} ==========`);
    journal(`autopilot cycle ${i}/${cycles} start`);
    const before = journalSize();
    await runSession(
      "Autopilot cycle: review the task board and memory, then advance the mission by completing the next most valuable unit of work. If you are blocked on something only the human can provide, report it clearly and finish.",
    );
    // Cheap heuristic: if the agent reported being blocked, pause the loop.
    if (recentlyBlocked(before)) {
      console.log("\nAutopilot paused: the agent is blocked on you (see the message above).");
      return;
    }
  }
  console.log("\nAutopilot finished its cycles. Run `status` to review, or run more.");
}

function journalSize(): number {
  return fs.existsSync(JOURNAL_FILE) ? fs.statSync(JOURNAL_FILE).size : 0;
}

function recentlyBlocked(sinceByte: number): boolean {
  if (!fs.existsSync(JOURNAL_FILE)) return false;
  const fresh = fs.readFileSync(JOURNAL_FILE, "utf8").slice(sinceByte).toLowerCase();
  return fresh.includes("blocked") || /report:.*\b(need|require|please|credential|api key|domain|payment)\b/.test(fresh);
}

async function main(): Promise<void> {
  const [cmd, ...rest] = process.argv.slice(2);

  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    showHelp();
    return;
  }
  if (cmd === "status") {
    showStatus();
    return;
  }
  if (!fs.existsSync(MISSION_FILE)) {
    console.error(`\nNo mission found at builder/mission.md — create it first (see README).`);
    process.exit(1);
  }
  if (!requireApiKey()) process.exit(1);
  ensureWorkspace();

  if (cmd === "run") {
    const directive = rest.join(" ").trim() ||
      "Review the mission, task board, and memory, then advance the business by completing the next most valuable unit of work.";
    await runSession(directive);
    return;
  }
  if (cmd === "autopilot") {
    const n = Math.max(1, Math.min(20, Number(rest[0]) || 3));
    await autopilot(n);
    return;
  }

  console.error(`Unknown command: ${cmd}\n`);
  showHelp();
  process.exit(1);
}

main().catch((err) => {
  console.error("\nFatal error:", err?.message ?? err);
  process.exit(1);
});
