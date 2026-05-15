/* ─── Auth Storage Utilities ───────────────────────────────────────────────
   Handles user registry, sessions, and per-user state keys.
   Passwords are hashed with SHA-256 (Web Crypto API) before storage.
═══════════════════════════════════════════════════════════════════════════ */

const USERS_KEY = "vgp-users";
const SESSION_KEY = "vgp-session";
const STATE_PREFIX = "vgp-state-";

export interface UserRecord {
  username: string;      // lowercase, unique key
  passwordHash: string;
  displayName: string;   // shown in-app
  character: string;     // filename e.g. "alchemist.png"
}

// ── Hashing ─────────────────────────────────────────────────────────────────
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "::vgp-2024");
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── User registry ────────────────────────────────────────────────────────────
function getUsers(): Record<string, UserRecord> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, UserRecord>): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Register ─────────────────────────────────────────────────────────────────
export async function registerUser(
  username: string,
  password: string,
  displayName: string,
  character: string
): Promise<{ ok: boolean; error?: string }> {
  const normalized = username.trim().toLowerCase();
  if (normalized.length < 3) {
    return { ok: false, error: "El usuario debe tener al menos 3 caracteres." };
  }
  if (password.length < 6) {
    return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
  }
  const users = getUsers();
  if (users[normalized]) {
    return { ok: false, error: "Ese nombre de usuario ya existe." };
  }
  const passwordHash = await hashPassword(password);
  users[normalized] = {
    username: normalized,
    passwordHash,
    displayName: displayName.trim() || normalized,
    character,
  };
  saveUsers(users);
  setSession(normalized);
  return { ok: true };
}

// ── Login ────────────────────────────────────────────────────────────────────
export async function loginUser(
  username: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const normalized = username.trim().toLowerCase();
  const users = getUsers();
  const user = users[normalized];
  if (!user) {
    return { ok: false, error: "Usuario no encontrado." };
  }
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) {
    return { ok: false, error: "Contraseña incorrecta." };
  }
  setSession(normalized);
  return { ok: true };
}

// ── Session ───────────────────────────────────────────────────────────────────
export function setSession(username: string): void {
  localStorage.setItem(SESSION_KEY, username);
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): UserRecord | null {
  const session = getSession();
  if (!session) return null;
  return getUsers()[session] ?? null;
}

// ── Profile update ────────────────────────────────────────────────────────────
export function updateUserProfile(
  username: string,
  updates: Partial<Pick<UserRecord, "character" | "displayName">>
): void {
  const users = getUsers();
  if (users[username]) {
    users[username] = { ...users[username], ...updates };
    saveUsers(users);
  }
}

// ── Per-user state key ────────────────────────────────────────────────────────
export function getStateKey(username: string): string {
  return `${STATE_PREFIX}${username}`;
}
