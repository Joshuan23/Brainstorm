import { VW, VH } from "./constants";

export interface Transform {
  scale: number;
  ox: number;
  oy: number;
}

export interface Button {
  id: "A" | "B" | "TURBO" | "SWITCH";
  x: number;
  y: number;
  r: number;
  label: string;
}

// On-screen touch button layout in virtual coordinates.
const BUTTONS: Button[] = [
  { id: "A", x: VW - 150, y: VH - 130, r: 66, label: "SHOOT" },
  { id: "B", x: VW - 305, y: VH - 96, r: 54, label: "PASS" },
  { id: "TURBO", x: VW - 118, y: VH - 285, r: 46, label: "TURBO" },
  { id: "SWITCH", x: VW - 268, y: VH - 240, r: 42, label: "SW" },
];

interface Pointer {
  id: number;
  vx: number;
  vy: number;
  role: "stick" | "A" | "B" | "TURBO" | "SWITCH" | null;
  startX: number;
  startY: number;
}

export class Input {
  axis = { x: 0, y: 0 };
  turbo = false;

  private pressed = new Set<string>(); // edge buffer, consumed via take()
  private held = new Set<string>();
  private keys = new Set<string>();
  private pointers = new Map<number, Pointer>();
  private stickBase = { x: 0, y: 0 };
  private stickActive = false;
  private stickVec = { x: 0, y: 0 };
  private getT: () => Transform;

  buttons = BUTTONS;
  stickView = { active: false, bx: 0, by: 0, kx: 0, ky: 0 };
  context: "offense" | "defense" | "menu" = "menu";
  private lastTap: { x: number; y: number } | null = null;

  // Consume the most recent tap/click position (for menu hit-testing).
  takeTap(): { x: number; y: number } | null {
    const t = this.lastTap;
    this.lastTap = null;
    return t;
  }

  constructor(canvas: HTMLCanvasElement, getTransform: () => Transform) {
    this.getT = getTransform;
    const opts = { passive: false } as AddEventListenerOptions;
    canvas.addEventListener("pointerdown", this.onDown, opts);
    canvas.addEventListener("pointermove", this.onMove, opts);
    canvas.addEventListener("pointerup", this.onUp, opts);
    canvas.addEventListener("pointercancel", this.onUp, opts);
    window.addEventListener("keydown", this.onKey);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  labelFor(id: Button["id"]): string {
    if (this.context === "defense") {
      if (id === "A") return "BLOCK";
      if (id === "B") return "STEAL";
    } else if (this.context === "offense") {
      if (id === "A") return "SHOOT";
      if (id === "B") return "PASS";
    }
    if (id === "TURBO") return "TURBO";
    if (id === "SWITCH") return "SW";
    return id;
  }

  private toVirtual(e: PointerEvent): { vx: number; vy: number } {
    const t = this.getT();
    return { vx: (e.clientX - t.ox) / t.scale, vy: (e.clientY - t.oy) / t.scale };
  }

  private hitButton(vx: number, vy: number): Button | null {
    for (const b of BUTTONS) {
      if (Math.hypot(vx - b.x, vy - b.y) <= b.r * 1.25) return b;
    }
    return null;
  }

  private onDown = (e: PointerEvent) => {
    e.preventDefault();
    const { vx, vy } = this.toVirtual(e);
    this.lastTap = { x: vx, y: vy };
    const btn = this.hitButton(vx, vy);
    const p: Pointer = { id: e.pointerId, vx, vy, role: null, startX: vx, startY: vy };
    if (btn) {
      p.role = btn.id;
      if (btn.id === "TURBO") this.turbo = true;
      else this.pressed.add(btn.id), this.held.add(btn.id);
    } else if (vx < VW * 0.55) {
      // Left region → floating stick.
      p.role = "stick";
      this.stickActive = true;
      this.stickBase = { x: vx, y: vy };
      this.stickVec = { x: 0, y: 0 };
    } else {
      // Right dead zone tap counts as a menu confirm.
      this.pressed.add("TAP");
    }
    this.pointers.set(e.pointerId, p);
  };

  private onMove = (e: PointerEvent) => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    e.preventDefault();
    const { vx, vy } = this.toVirtual(e);
    p.vx = vx;
    p.vy = vy;
    if (p.role === "stick") {
      const dx = vx - this.stickBase.x;
      const dy = vy - this.stickBase.y;
      const max = 92;
      const d = Math.hypot(dx, dy);
      const k = d > max ? max / d : 1;
      this.stickVec = { x: (dx * k) / max, y: (dy * k) / max };
    }
  };

  private onUp = (e: PointerEvent) => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    if (p.role === "stick") {
      this.stickActive = false;
      this.stickVec = { x: 0, y: 0 };
    } else if (p.role === "TURBO") {
      // Release turbo only if no other turbo pointer is active.
      const stillHeld = [...this.pointers.values()].some(
        (o) => o.id !== e.pointerId && o.role === "TURBO",
      );
      if (!stillHeld) this.turbo = false;
    } else if (p.role) {
      this.held.delete(p.role);
    }
    this.pointers.delete(e.pointerId);
  };

  private onKey = (e: KeyboardEvent) => {
    if (e.repeat) {
      this.keys.add(e.code);
      return;
    }
    this.keys.add(e.code);
    switch (e.code) {
      case "KeyJ":
      case "Enter":
        this.pressed.add("A");
        this.held.add("A");
        this.pressed.add("TAP");
        break;
      case "KeyK":
        this.pressed.add("B");
        this.held.add("B");
        break;
      case "Space":
        this.pressed.add("SWITCH");
        e.preventDefault();
        break;
      case "KeyP":
      case "Escape":
        this.pressed.add("PAUSE");
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
    if (e.code === "KeyJ" || e.code === "Enter") this.held.delete("A");
    if (e.code === "KeyK") this.held.delete("B");
  };

  // Consume a one-shot press.
  take(id: string): boolean {
    if (this.pressed.has(id)) {
      this.pressed.delete(id);
      return true;
    }
    return false;
  }

  isHeld(id: string): boolean {
    return this.held.has(id);
  }

  // Recompute continuous axis + turbo from keyboard and stick each frame.
  update(): void {
    let kx = 0;
    let ky = 0;
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) kx -= 1;
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) kx += 1;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) ky -= 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) ky += 1;
    const keyTurbo = this.keys.has("ShiftLeft") || this.keys.has("ShiftRight");

    if (this.stickActive && (this.stickVec.x || this.stickVec.y)) {
      this.axis = { x: this.stickVec.x, y: this.stickVec.y };
    } else if (kx || ky) {
      const l = Math.hypot(kx, ky) || 1;
      this.axis = { x: kx / l, y: ky / l };
    } else {
      this.axis = { x: 0, y: 0 };
    }

    // Turbo held via keyboard OR touch button.
    const touchTurbo = this.turbo;
    this.turboEffective = keyTurbo || touchTurbo;

    // Stick view for rendering.
    this.stickView.active = this.stickActive;
    this.stickView.bx = this.stickBase.x;
    this.stickView.by = this.stickBase.y;
    this.stickView.kx = this.stickBase.x + this.stickVec.x * 92;
    this.stickView.ky = this.stickBase.y + this.stickVec.y * 92;
  }

  turboEffective = false;

  clearFrame(): void {
    // one-shot presses are cleared on take(); nothing else to do.
  }
}
