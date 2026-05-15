/* ─── SeedScreen ──────────────────────────────────────────────────────────────
   Crea (o restablece) la cuenta de prueba "laremolacha" con todas las etapas
   y actividades completadas. Acceder a /#/seed para ejecutarlo.
   Solo para uso en desarrollo/testing.
═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const USERS_KEY = "vgp-users";
const STATE_PREFIX = "vgp-state-";

const TEST_USERNAME = "laremolacha";
const TEST_PASSWORD = "elcepillo";
const TEST_DISPLAY = "La Remolacha";
const TEST_CHARACTER = "alchemist.png";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "::vgp-2024");
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function seedAccount() {
  // 1. Hash de contraseña
  const passwordHash = await hashPassword(TEST_PASSWORD);

  // 2. Registro de usuario
  const rawUsers = localStorage.getItem(USERS_KEY);
  const users: Record<string, unknown> = rawUsers ? JSON.parse(rawUsers) : {};
  users[TEST_USERNAME] = {
    username: TEST_USERNAME,
    passwordHash,
    displayName: TEST_DISPLAY,
    character: TEST_CHARACTER,
  };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // 3. Estado completo del juego
  const completedState = {
    userName: TEST_DISPLAY,
    character: TEST_CHARACTER,
    xp: 2640,
    streak: 7,
    consecutiveCorrect: 5,
    totalActivitiesCompleted: 36,
    hasSeenPixelTutorial: true,
    stagesIntroSeen: [1, 2, 3, 4, 5, 6],
    earnedAchievements: [
      "first-step",
      "concept-master",
      "mechanics-pro",
      "storyteller",
      "planner",
      "prototyper",
      "pitcher",
      "perfect-quiz",
      "streak-3",
    ],
    stageStatuses: {
      1: {
        status: "completed",
        activitiesCompleted: ["1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7"],
        quizPassed: true,
        quizScore: 5,
      },
      2: {
        status: "completed",
        activitiesCompleted: ["2-1", "2-2", "2-3", "2-4", "2-5", "2-6", "2-7"],
        quizPassed: true,
        quizScore: 5,
      },
      3: {
        status: "completed",
        activitiesCompleted: ["3-1", "3-2", "3-3", "3-4", "3-5", "3-6", "3-7"],
        quizPassed: true,
        quizScore: 5,
      },
      4: {
        status: "completed",
        activitiesCompleted: ["4-1", "4-2", "4-3", "4-4", "4-5", "4-6", "4-7"],
        quizPassed: true,
        quizScore: 5,
      },
      5: {
        status: "completed",
        activitiesCompleted: ["5-1", "5-2", "5-3", "5-4"],
        quizPassed: true,
        quizScore: 5,
      },
      6: {
        status: "completed",
        activitiesCompleted: ["6-1", "6-2", "6-3", "6-4"],
        quizPassed: true,
        quizScore: 5,
      },
    },
  };

  localStorage.setItem(
    STATE_PREFIX + TEST_USERNAME,
    JSON.stringify(completedState)
  );
}

export function SeedScreen() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"running" | "done" | "error">("running");

  useEffect(() => {
    seedAccount()
      .then(() => setStatus("done"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-950 text-white font-mono">
      <h1 className="text-2xl font-bold text-yellow-400">
        🌱 Cuenta de prueba
      </h1>

      {status === "running" && (
        <p className="text-gray-400">Creando cuenta…</p>
      )}

      {status === "error" && (
        <p className="text-red-400">Error al crear la cuenta. Revisa la consola.</p>
      )}

      {status === "done" && (
        <>
          <div className="bg-gray-800 rounded-xl p-6 text-sm space-y-1 w-full max-w-xs">
            <p>
              <span className="text-gray-400">Usuario:</span>{" "}
              <span className="text-green-400 font-bold">{TEST_USERNAME}</span>
            </p>
            <p>
              <span className="text-gray-400">Contraseña:</span>{" "}
              <span className="text-green-400 font-bold">{TEST_PASSWORD}</span>
            </p>
            <p>
              <span className="text-gray-400">Etapas:</span>{" "}
              <span className="text-green-400">6 / 6 completadas ✓</span>
            </p>
            <p>
              <span className="text-gray-400">Actividades:</span>{" "}
              <span className="text-green-400">36 / 36 completadas ✓</span>
            </p>
            <p>
              <span className="text-gray-400">Logros:</span>{" "}
              <span className="text-green-400">9 / 9 desbloqueados ✓</span>
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-400 text-gray-950 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
          >
            Ir al login →
          </button>
        </>
      )}
    </div>
  );
}
