/**
 * The agent loop — the brain.
 *
 * A "work session" is one call to runSession(). It:
 *   1. Loads your standing instructions (mission.md), the task board, and memory.
 *   2. Builds a system prompt that fuses your instructions with operating rules.
 *   3. Runs a streaming agentic loop: the model thinks, calls tools, sees the
 *      results, and continues until it calls finish() or hits the turn cap.
 *
 * Continuity between sessions is durable and file-based (task board + memory +
 * journal), so autopilot can pick up exactly where the last run left off.
 */
import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import {
  MODEL,
  EFFORT,
  MAX_TOKENS,
  MAX_TURNS,
  MISSION_FILE,
  WORKSPACE,
} from "./config.js";
import { TOOL_DEFS, executeTool } from "./tools.js";
import { loadMemory, renderTaskBoard, journal } from "./state.js";

const client = new Anthropic(); // resolves ANTHROPIC_API_KEY / auth profile from env

function loadMission(): string {
  if (!fs.existsSync(MISSION_FILE)) return "(No mission.md found — ask the operator what the business is.)";
  return fs.readFileSync(MISSION_FILE, "utf8").trim();
}

function buildSystemPrompt(): string {
  return `You are the Business Builder — an autonomous operator that builds and runs a business under the human operator's standing instructions.

You are not a chat assistant. You are an executor: you plan, you build, you ship, and you report. You have real tools — a filesystem workspace, a shell, a durable task board, and memory. Use them.

# The operator's standing instructions (their mission)
${loadMission()}

# How you operate
- Work toward the mission above. Every session, advance it concretely.
- Start by reading your task board and memory (already shown below). Keep the board honest: mark tasks in_progress when you start them and done when finished; add new tasks as the plan develops.
- Break big goals into tasks. Do the next most valuable task, not everything at once.
- BUILD real artifacts in the workspace: code, apps, marketing copy, plans, spreadsheets-as-CSV, landing pages. Prefer shipping a working thing over describing one.
- Use run_command to install deps, build, test, and run what you create. Verify your work actually runs before calling it done.
- Use web_search when current information would change your decision (market data, competitors, pricing, APIs, current events).
- Write down decisions, credentials-locations, and lessons with memory_write so your future self benefits.
- When you finish a unit of work, or need a human decision or a credential/secret you don't have, use report_to_user with a clear, specific message — then finish().

# Judgment and boundaries
- Act on what you can do autonomously. Don't ask permission for reversible steps that clearly follow from the mission.
- Some things only the human can do: registering domains, entering payment/API credentials, publishing under a real brand, signing up for accounts, pushing to remote git, spending money. When you hit one, do everything up to that line, then report exactly what you need from them.
- Never fabricate results. If a build fails or a step is skipped, say so plainly with the evidence.
- Everything you create is a draft/prototype for the operator to review before it goes live. You do not impersonate real people or organizations, publish content as genuine when it isn't, or take outward actions on the operator's behalf without them.
- Keep all file work inside the workspace. \`git push\` and destructive shell commands are blocked by design — surface finished work via report_to_user instead.

# Current state
## Task board
${renderTaskBoard()}

## Memory
${loadMemory() || "(empty)"}

Lead with action. When you have enough to act, act.`;
}

type MsgParam = Anthropic.MessageParam;

/**
 * Run one work session. `directive` is the specific instruction for this run
 * (e.g. "kick off the business" or "write the landing page copy"). In autopilot
 * it's a generic "advance the mission" nudge.
 */
export async function runSession(directive: string): Promise<void> {
  const system = buildSystemPrompt();
  const messages: MsgParam[] = [{ role: "user", content: directive }];

  const tools: any[] = [
    ...TOOL_DEFS,
    { type: "web_search_20260209", name: "web_search", max_uses: 8 },
  ];

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    process.stdout.write(`\n\x1b[2m─── turn ${turn}/${MAX_TURNS} ───\x1b[0m\n`);

    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      thinking: { type: "adaptive", display: "summarized" },
      output_config: { effort: EFFORT },
      system,
      tools,
      messages,
    });

    // Live progress: print thinking summaries and assistant text as they stream.
    stream.on("thinking", (delta: string) => process.stdout.write(`\x1b[2m${delta}\x1b[0m`));
    stream.on("text", (delta: string) => process.stdout.write(delta));

    const response = await stream.finalMessage();
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "refusal") {
      console.log("\n[agent] The model declined this request. Stopping.");
      journal("session ended: refusal");
      return;
    }

    // Server-side tool (web_search) needs another round trip to continue.
    if (response.stop_reason === "pause_turn") {
      continue;
    }

    const toolUses = response.content.filter((b: any) => b.type === "tool_use");
    if (toolUses.length === 0) {
      // Model stopped without calling a tool — treat as end of session.
      journal(`session ended: ${response.stop_reason}`);
      return;
    }

    const toolResults: any[] = [];
    let sessionDone = false;
    for (const tu of toolUses as any[]) {
      process.stdout.write(`\n\x1b[33m→ ${tu.name}\x1b[0m ${summarizeInput(tu.input)}\n`);
      const outcome = executeTool(tu.name, tu.input);
      if (outcome.done) sessionDone = true;
      toolResults.push({
        type: "tool_result",
        tool_use_id: tu.id,
        content: outcome.result,
        is_error: outcome.isError ?? false,
      });
    }

    messages.push({ role: "user", content: toolResults });
    if (sessionDone) {
      journal("session ended: finish()");
      return;
    }
  }

  console.log(`\n[agent] Hit the ${MAX_TURNS}-turn cap for this session. Run again to continue.`);
  journal(`session ended: turn cap (${MAX_TURNS})`);
}

function summarizeInput(input: any): string {
  if (!input) return "";
  const s = JSON.stringify(input);
  return s.length > 120 ? s.slice(0, 117) + "..." : s;
}

/** Ensure the workspace exists before any session runs. */
export function ensureWorkspace(): void {
  fs.mkdirSync(WORKSPACE, { recursive: true });
}
