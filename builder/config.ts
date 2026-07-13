/**
 * Central configuration for the Business Builder agent.
 *
 * Everything the agent needs to know about *where* it works and *how* it
 * thinks lives here. Paths are resolved relative to this file so the agent
 * behaves the same no matter which directory you launch it from.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = here; // the builder/ directory
export const WORKSPACE = path.join(ROOT, "workspace"); // where the agent builds things
export const STATE_DIR = path.join(ROOT, "state"); // task board, memory, journal
export const TASKS_FILE = path.join(STATE_DIR, "tasks.json");
export const MEMORY_FILE = path.join(STATE_DIR, "memory.md");
export const JOURNAL_FILE = path.join(STATE_DIR, "journal.md");
export const MISSION_FILE = path.join(ROOT, "mission.md");

/** The model that powers the agent. Opus 4.8 is the most capable for long-horizon agentic work. */
export const MODEL = process.env.BUILDER_MODEL || "claude-opus-4-8";

/** Effort controls how hard the model thinks/acts. "high" is the sweet spot for agentic work. */
export const EFFORT = (process.env.BUILDER_EFFORT || "high") as
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "max";

/** Max output tokens per model turn. Streaming is used, so we can afford headroom. */
export const MAX_TOKENS = Number(process.env.BUILDER_MAX_TOKENS || 32000);

/**
 * Safety rail for one "work session": the maximum number of model turns the
 * agent may take before it must stop and report. Prevents runaway loops and
 * runaway bills. Raise it for bigger jobs.
 */
export const MAX_TURNS = Number(process.env.BUILDER_MAX_TURNS || 40);

/**
 * When true, the agent runs commands without pausing for confirmation.
 * Autopilot mode implies this. For interactive `run`, destructive-looking
 * commands are still blocked outright (see tools.ts).
 */
export const AUTO_APPROVE = process.env.BUILDER_AUTO_APPROVE === "1";
