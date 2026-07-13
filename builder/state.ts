/**
 * Durable state for the agent — the part that survives between runs.
 *
 * A single model conversation is ephemeral, but a business is not. Continuity
 * comes from three files on disk that every run reads at startup:
 *
 *   tasks.json   — the task board (what needs doing, what's done)
 *   memory.md    — durable notes/decisions the agent wants its future self to know
 *   journal.md   — an append-only log of everything the agent did, timestamped
 *
 * This is deliberately plain files, not a database: it's inspectable, diffable,
 * and trivially portable.
 */
import fs from "node:fs";
import { STATE_DIR, TASKS_FILE, MEMORY_FILE, JOURNAL_FILE } from "./config.js";

export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";

export interface Task {
  id: number;
  title: string;
  detail?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  note?: string;
}

function ensureStateDir(): void {
  fs.mkdirSync(STATE_DIR, { recursive: true });
}

export function loadTasks(): Task[] {
  ensureStateDir();
  if (!fs.existsSync(TASKS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(TASKS_FILE, "utf8")) as Task[];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  ensureStateDir();
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

export function addTask(title: string, detail?: string): Task {
  const tasks = loadTasks();
  const now = new Date().toISOString();
  const task: Task = {
    id: (tasks.at(-1)?.id ?? 0) + 1,
    title,
    detail,
    status: "todo",
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

export function updateTask(
  id: number,
  status: TaskStatus,
  note?: string,
): Task | null {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  task.status = status;
  if (note !== undefined) task.note = note;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  return task;
}

export function renderTaskBoard(tasks: Task[] = loadTasks()): string {
  if (tasks.length === 0) return "(no tasks yet)";
  const icon: Record<TaskStatus, string> = {
    todo: "[ ]",
    in_progress: "[~]",
    blocked: "[!]",
    done: "[x]",
  };
  return tasks
    .map((t) => {
      const line = `${icon[t.status]} #${t.id} ${t.title}`;
      return t.note ? `${line}\n      ↳ ${t.note}` : line;
    })
    .join("\n");
}

export function loadMemory(): string {
  ensureStateDir();
  if (!fs.existsSync(MEMORY_FILE)) return "";
  return fs.readFileSync(MEMORY_FILE, "utf8");
}

/** Append a titled note to durable memory. */
export function writeMemory(title: string, content: string): void {
  ensureStateDir();
  const stamp = new Date().toISOString();
  const entry = `\n## ${title}\n_${stamp}_\n\n${content}\n`;
  fs.appendFileSync(MEMORY_FILE, entry);
}

/** Append a timestamped line to the activity journal. */
export function journal(line: string): void {
  ensureStateDir();
  const stamp = new Date().toISOString();
  fs.appendFileSync(JOURNAL_FILE, `- ${stamp}  ${line}\n`);
}
