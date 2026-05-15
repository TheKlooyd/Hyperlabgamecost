import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Check, User } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { registerUser } from "../utils/auth";
import { useApp } from "../context/AppContext";
import { CHARACTERS } from "../data/gameData";
import { playClick, playSelect, playStart, playWrong } from "../utils/sounds";

export function RegisterScreen() {
  const navigate = useNavigate();
  const { setUserName, setCharacter } = useApp();
  const [step, setStep] = useState(1);

  // ── Step 1 state ──────────────────────────────────────────────────────────
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step1Error, setStep1Error] = useState("");

  // ── Step 2 state ──────────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState("");
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [step2Error, setStep2Error] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────
  const validateStep1 = (): string => {
    if (username.trim().length < 3) return "El usuario debe tener al menos 3 caracteres.";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    return "";
  };

  const handleNextStep = () => {
    playClick();
    const err = validateStep1();
    if (err) { setStep1Error(err); return; }
    setDisplayName(username.trim());
    setStep(2);
  };

  const handleRegister = async () => {
    if (!selectedChar) { setStep2Error("Elige un personaje para continuar."); return; }
    const name = displayName.trim() || username.trim();
    setLoading(true);
    playClick();
    const result = await registerUser(username.trim(), password, name, selectedChar);
    setLoading(false);
    if (result.ok) {
      localStorage.setItem("vgp-onboarded", "true");
      const finalName = displayName.trim() || username.trim();
      setUserName(finalName);
      setCharacter(selectedChar);
      playStart();
      navigate("/home");
    } else {
      playWrong();
      setStep2Error(result.error ?? "Error al crear la cuenta.");
      if (result.error?.includes("usuario ya existe")) setStep(1);
    }
  };

  return (
    <MobileLayout noPadding hideAssistant>
      <div className="flex flex-col min-h-screen" style={{ background: "#f8fafc" }}>

        {/* Header */}
        <div
          className="px-5 pt-12 pb-5 flex items-center gap-3"
          style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #0f172a 100%)" }}
        >
          <button
            onClick={() => {
              playClick();
              if (step === 1) navigate("/login");
              else setStep(1);
            }}
            className="rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ width: 36, height: 36, background: "rgba(255,255,255,0.12)" }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <div className="flex-1">
            <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px" }}>
              CREAR CUENTA · PASO {step} DE 2
            </p>
            <h1 style={{ color: "white", fontSize: 18, fontWeight: 800 }}>
              {step === 1 ? "Datos de acceso" : "Elige tu personaje"}
            </h1>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5 items-center">
            {[1, 2].map(s => (
              <div
                key={s}
                style={{
                  width: s === step ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: s <= step ? "#3b82f6" : "rgba(255,255,255,0.2)",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Credentials ───────────────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="flex flex-col gap-4"
              >
                {/* Username */}
                <div>
                  <label style={{ color: "#475569", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setStep1Error(""); }}
                    placeholder="mi_usuario"
                    className="w-full rounded-2xl px-4 py-3.5"
                    style={{
                      border: "1.5px solid #e2e8f0",
                      fontSize: 15,
                      color: "#0f172a",
                      background: "white",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="username"
                  />
                  <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                    Mínimo 3 caracteres. Se usa para iniciar sesión.
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label style={{ color: "#475569", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setStep1Error(""); }}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full rounded-2xl px-4 py-3.5 pr-12"
                      style={{
                        border: "1.5px solid #e2e8f0",
                        fontSize: 15,
                        color: "#0f172a",
                        background: "white",
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label style={{ color: "#475569", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setStep1Error(""); }}
                      onKeyDown={e => e.key === "Enter" && handleNextStep()}
                      placeholder="Repite tu contraseña"
                      className="w-full rounded-2xl px-4 py-3.5 pr-12"
                      style={{
                        border: "1.5px solid #e2e8f0",
                        fontSize: 15,
                        color: "#0f172a",
                        background: "white",
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showConfirm ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {step1Error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: "#ef4444", fontSize: 13 }}
                  >
                    {step1Error}
                  </motion.p>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNextStep}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mt-2"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    color: "white",
                    fontSize: 16,
                    fontWeight: 700,
                    border: "none",
                    boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
                    cursor: "pointer",
                  }}
                >
                  Siguiente
                  <ArrowRight size={18} />
                </motion.button>

                {/* Back to login */}
                <button
                  onClick={() => { playClick(); navigate("/login"); }}
                  style={{ color: "#64748b", fontSize: 13, background: "none", border: "none", cursor: "pointer", textAlign: "center", padding: "8px" }}
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: Character + Display name ──────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="flex flex-col gap-5"
              >
                {/* Display name */}
                <div>
                  <label style={{ color: "#475569", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                    Nombre en el juego
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="¿Cómo quieres aparecer?"
                      className="w-full rounded-2xl py-3.5 pr-4"
                      style={{
                        paddingLeft: "42px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: 15,
                        color: "#0f172a",
                        background: "white",
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                    />
                    <User
                      size={16}
                      color="#94a3b8"
                      style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    />
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                    Este nombre aparecerá en tu perfil y progreso.
                  </p>
                </div>

                {/* Character grid */}
                <div>
                  <p style={{ color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                    Elige tu personaje{" "}
                    <span style={{ color: "#94a3b8", fontWeight: 400 }}>(requerido)</span>
                  </p>
                  <div className="grid grid-cols-4 gap-2.5">
                    {CHARACTERS.map(char => {
                      const isSelected = selectedChar === char.file;
                      return (
                        <motion.button
                          key={char.file}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => {
                            playSelect();
                            setSelectedChar(char.file);
                            setStep2Error("");
                          }}
                          className="flex flex-col items-center gap-1.5 rounded-2xl p-2"
                          style={{
                            background: isSelected ? "#eff6ff" : "white",
                            border: isSelected ? "2.5px solid #3b82f6" : "1.5px solid #e2e8f0",
                            boxShadow: isSelected
                              ? "0 4px 16px rgba(59,130,246,0.2)"
                              : "0 2px 6px rgba(0,0,0,0.04)",
                            position: "relative",
                            cursor: "pointer",
                          }}
                        >
                          {isSelected && (
                            <div
                              className="absolute rounded-full flex items-center justify-center"
                              style={{
                                top: 4,
                                right: 4,
                                width: 18,
                                height: 18,
                                background: "#3b82f6",
                              }}
                            >
                              <Check size={11} color="white" />
                            </div>
                          )}
                          <img
                            src={`${import.meta.env.BASE_URL}personajes/${encodeURIComponent(char.file)}`}
                            alt={char.name}
                            style={{
                              width: "100%",
                              aspectRatio: "1 / 1",
                              objectFit: "contain",
                              borderRadius: 8,
                            }}
                            onError={e => {
                              (e.target as HTMLImageElement).style.opacity = "0.3";
                            }}
                          />
                          <span
                            style={{
                              color: isSelected ? "#1d4ed8" : "#64748b",
                              fontSize: 10,
                              fontWeight: isSelected ? 700 : 500,
                              textAlign: "center",
                              lineHeight: 1.2,
                            }}
                          >
                            {char.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Error */}
                {step2Error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: "#ef4444", fontSize: 13 }}
                  >
                    {step2Error}
                  </motion.p>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRegister}
                  disabled={!selectedChar || loading}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                  style={{
                    background: selectedChar
                      ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                      : "#e2e8f0",
                    color: selectedChar ? "white" : "#94a3b8",
                    fontSize: 16,
                    fontWeight: 700,
                    border: "none",
                    boxShadow: selectedChar ? "0 8px 24px rgba(59,130,246,0.35)" : "none",
                    cursor: selectedChar ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? "Creando cuenta..." : "¡Empezar a jugar!"}
                </motion.button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </MobileLayout>
  );
}
