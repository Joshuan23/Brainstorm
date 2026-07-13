/**
 * The agent's hands: the tools it can actually use to affect the world.
 *
 * Two halves:
 *   - TOOL_DEFS: the JSON schemas sent to the model so it knows what it can do.
 *   - executeTool(): the harness-side implementation that actually runs each
 *     tool when the model calls it.
 *
 * Design notes:
 *   - Filesystem tools are confined to WORKSPACE. Attempts to escape (../,
 *     absolute paths outside the workspace, symlinks) are rejected.
 *   - run_command runs inside WORKSPACE with a denylist of obviously
 *     destructive / privilege-escalating patterns. This is a real shell, so
 *     it is powerful by design — the confinement keeps it from wandering.
 *   - web_search is a server-side tool (declared in agent.ts), not here.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { WORKSPACE } from "./config.js";
import {
  addTask,
  updateTask,
  loadTasks,
  renderTaskBoard,
  writeMemory,
  journal,
  type TaskStatus,
} from "./state.js";

export interface Tool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

/** Resolve a model-supplied path inside the workspace, or throw if it escapes. */
function resolveInWorkspace(p: string): string {
  const full = path.resolve(WORKSPACE, p);
  const rel = path.relative(WORKSPACE, full);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(
      `Path "${p}" escapes the workspace. All file operations must stay inside builder/workspace/.`,
    );
  }
  return full;
}

/** Patterns we refuse to run outright, even in auto-approve mode. */
const DANGEROUS = [
  /\brm\s+-rf?\s+[~/]/, // rm -rf / or ~
  /\bsudo\b/,
  /\bmkfs\b/,
  /\b(shutdown|reboot|halt)\b/,
  /\bdd\s+if=/,
  /:\(\)\s*\{.*\}\s*;/, // fork bomb
  /\bgit\s+push\b/, // pushing is an outward action — the outer harness owns that
  /\bchmod\s+-R\s+777\s+\//,
  />\s*\/dev\/sd/,
];

export const TOOL_DEFS: Tool[] = [
  {
    name: "write_file",
    description:
      "Create or overwrite a file in the workspace. Use for writing code, configs, docs, plans — any text artifact.",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Path relative to the workspace root." },
        content: { type: "string", description: "Full file contents to write." },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "read_file",
    description: "Read a file from the workspace.",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Path relative to the workspace root." },
      },
      required: ["path"],
    },
  },
  {
    name: "edit_file",
    description:
      "Replace an exact string in a file with a new string. Fails if the old string is missing or appears more than once — read the file first if unsure.",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string" },
        old_string: { type: "string", description: "Exact text to replace (must be unique)." },
        new_string: { type: "string", description: "Replacement text." },
      },
      required: ["path", "old_string", "new_string"],
    },
  },
  {
    name: "list_files",
    description: "List files and directories under a workspace path (recursive, up to a sensible depth).",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: 'Directory relative to workspace root. Use "." for the root.' },
      },
      required: ["path"],
    },
  },
  {
    name: "run_command",
    description:
      "Run a shell command inside the workspace (e.g. npm install, npm run build, node script.js, git init/add/commit, curl). Returns combined stdout+stderr. Destructive or privilege-escalating commands are blocked. `git push` is blocked — surface finished work via report_to_user instead.",
    input_schema: {
      type: "object",
      properties: {
        command: { type: "string", description: "The shell command to run." },
        cwd: { type: "string", description: "Optional working directory relative to the workspace root." },
      },
      required: ["command"],
    },
  },
  {
    name: "task_add",
    description: "Add a task to the durable task board so the plan survives across runs.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        detail: { type: "string", description: "Optional extra context for the task." },
      },
      required: ["title"],
    },
  },
  {
    name: "task_update",
    description: "Update a task's status. Use this to keep the board honest as you work.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "integer" },
        status: { type: "string", enum: ["todo", "in_progress", "blocked", "done"] },
        note: { type: "string", description: "Optional note (e.g. why it's blocked, or a result)." },
      },
      required: ["id", "status"],
    },
  },
  {
    name: "task_list",
    description: "Show the current task board.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "memory_write",
    description:
      "Save a durable note for your future self: a decision made, a credential location, an approach that worked, a lesson learned. Read at the start of every run.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        content: { type: "string" },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "report_to_user",
    description:
      "Deliver a message to the human operator exactly as written — a result, a decision that needs their input, a deliverable, or a status update. Shown prominently and saved to the journal.",
    input_schema: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
      required: ["message"],
    },
  },
  {
    name: "finish",
    description:
      "Call this when the current work session is complete (or blocked on something only the human can do). Provide a concise summary of what got done and what's next.",
    input_schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
      },
      required: ["summary"],
    },
  },
];

export interface ToolOutcome {
  result: string;
  isError?: boolean;
  /** Set by finish() to end the work session. */
  done?: boolean;
}

export function executeTool(name: string, input: any): ToolOutcome {
  try {
    switch (name) {
      case "write_file": {
        const full = resolveInWorkspace(input.path);
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, input.content ?? "");
        journal(`wrote ${input.path} (${(input.content ?? "").length} bytes)`);
        return { result: `Wrote ${input.path}.` };
      }
      case "read_file": {
        const full = resolveInWorkspace(input.path);
        if (!fs.existsSync(full)) return { result: `File not found: ${input.path}`, isError: true };
        return { result: fs.readFileSync(full, "utf8") };
      }
      case "edit_file": {
        const full = resolveInWorkspace(input.path);
        if (!fs.existsSync(full)) return { result: `File not found: ${input.path}`, isError: true };
        const before = fs.readFileSync(full, "utf8");
        const count = before.split(input.old_string).length - 1;
        if (count === 0) return { result: `old_string not found in ${input.path}.`, isError: true };
        if (count > 1) return { result: `old_string appears ${count} times in ${input.path}; make it unique.`, isError: true };
        fs.writeFileSync(full, before.replace(input.old_string, input.new_string));
        journal(`edited ${input.path}`);
        return { result: `Edited ${input.path}.` };
      }
      case "list_files": {
        const full = resolveInWorkspace(input.path);
        if (!fs.existsSync(full)) return { result: `Not found: ${input.path}` };
        return { result: listRecursive(full, WORKSPACE) || "(empty)" };
      }
      case "run_command":
        return runCommand(input.command, input.cwd);
      case "task_add": {
        const t = addTask(input.title, input.detail);
        journal(`task #${t.id} added: ${t.title}`);
        return { result: `Added task #${t.id}: ${t.title}` };
      }
      case "task_update": {
        const t = updateTask(input.id, input.status as TaskStatus, input.note);
        if (!t) return { result: `No task #${input.id}.`, isError: true };
        journal(`task #${t.id} -> ${t.status}`);
        return { result: `Task #${t.id} is now ${t.status}.` };
      }
      case "task_list":
        return { result: renderTaskBoard(loadTasks()) };
      case "memory_write": {
        writeMemory(input.title, input.content);
        journal(`memory: ${input.title}`);
        return { result: `Saved to memory: "${input.title}".` };
      }
      case "report_to_user": {
        journal(`REPORT: ${input.message.replace(/\s+/g, " ").slice(0, 200)}`);
        const bar = "-".repeat(50);
        console.log(`\n+-- Message for you ${bar.slice(19)}`);
        console.log(indent(input.message, "| "));
        console.log(`+${bar}\n`);
        return { result: "Delivered to the operator." };
      }
      case "finish": {
        journal(`FINISH: ${input.summary.replace(/\s+/g, " ").slice(0, 200)}`);
        return { result: "Work session closed.", done: true };
      }
      default:
        return { result: `Unknown tool: ${name}`, isError: true };
    }
  } catch (err: any) {
    return { result: `Tool error: ${err?.message ?? String(err)}`, isError: true };
  }
}

function runCommand(command: string, cwd?: string): ToolOutcome {
  for (const pat of DANGEROUS) {
    if (pat.test(command)) {
      return {
        result: `Refused: "${command}" matches a blocked pattern (${pat}). This command is destructive, escalates privileges, or performs an outward push — the operator must do it manually.`,
        isError: true,
      };
    }
  }
  const workdir = cwd ? resolveInWorkspace(cwd) : WORKSPACE;
  fs.mkdirSync(workdir, { recursive: true });
  journal(`$ ${command}`);
  try {
    const out = execSync(command, {
      cwd: workdir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 1000 * 60 * 10, // 10 min ceiling per command
      maxBuffer: 1024 * 1024 * 20,
      env: process.env,
    });
    return { result: truncate(out) || "(command produced no output)" };
  } catch (err: any) {
    const stdout = err?.stdout ?? "";
    const stderr = err?.stderr ?? "";
    const body = truncate(`${stdout}\n${stderr}`.trim());
    return { result: `Command failed (exit ${err?.status ?? "?"}):\n${body}`, isError: true };
  }
}

function listRecursive(dir: string, base: string, depth = 0): string {
  if (depth > 4) return "";
  const lines: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === "node_modules" || entry.name === ".git") {
      lines.push(`${"  ".repeat(depth)}${entry.name}/  (skipped)`);
      continue;
    }
    const rel = path.relative(base, path.join(dir, entry.name));
    if (entry.isDirectory()) {
      lines.push(`${"  ".repeat(depth)}${rel}/`);
      lines.push(listRecursive(path.join(dir, entry.name), base, depth + 1));
    } else {
      lines.push(`${"  ".repeat(depth)}${rel}`);
    }
  }
  return lines.filter(Boolean).join("\n");
}

function truncate(s: string, limit = 12000): string {
  if (s.length <= limit) return s;
  return s.slice(0, limit) + `\n… [truncated ${s.length - limit} chars]`;
}

function indent(s: string, prefix: string): string {
  return s
    .split("\n")
    .map((l) => prefix + l)
    .join("\n");
}
