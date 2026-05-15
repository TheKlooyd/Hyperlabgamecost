import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, LogIn, UserPlus, Gamepad2 } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { loginUser, getCurrentUser } from "../utils/auth";
import { useApp } from "../context/AppContext";
import { playClick, playStart, playWrong } from "../utils/sounds";

export function LoginScreen() {
  const navigate = useNavigate();
  const { setUserName, setCharacter, reloadState } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) return;
    setError("");
    setLoading(true);
    playClick();
    const result = await loginUser(username, password);
    setLoading(false);
    if (result.ok) {
      reloadState();
      playStart();
      navigate("/home");
    } else {
      playWrong();
      setError(result.error ?? "Error al iniciar sesión.");
    }
  };

  const canSubmit = username.trim().length > 0 && password.length > 0;

  return (
    <MobileLayout noPadding hideAssistant>
      <div
        className="flex flex-col min-h-screen"
        style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #0f172a 100%)" }}
      >
        {/* Logo area */}
        <div className="flex flex-col items-center pt-20 pb-8 px-5">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="rounded-3xl flex items-center justify-center mb-5"
            style={{
              width: 84,
              height: 84,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              boxShadow: "0 12px 32px rgba(59,130,246,0.4)",
            }}
          >
            <Gamepad2 size={42} color="white" strokeWidth={1.5} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ color: "white", fontSize: 26, fontWeight: 800, marginBottom: 4 }}
          >
            Bienvenido
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ color: "#94a3b8", fontSize: 14 }}
          >
            Inicia sesión para continuar
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 120 }}
          className="flex-1 rounded-t-3xl px-6 pt-8 pb-10 flex flex-col gap-5"
          style={{ background: "#f8fafc" }}
        >
          <div className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label style={{ color: "#475569", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="tu_usuario"
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
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className="w-full rounded-2xl px-4 py-3.5 pr-12"
                  style={{
                    border: "1.5px solid #e2e8f0",
                    fontSize: 15,
                    color: "#0f172a",
                    background: "white",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword
                    ? <EyeOff size={18} color="#94a3b8" />
                    : <Eye size={18} color="#94a3b8" />
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: "#ef4444", fontSize: 13 }}
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Login button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            disabled={!canSubmit || loading}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
            style={{
              background: canSubmit
                ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                : "#e2e8f0",
              color: canSubmit ? "white" : "#94a3b8",
              fontSize: 16,
              fontWeight: 700,
              border: "none",
              boxShadow: canSubmit ? "0 8px 24px rgba(59,130,246,0.35)" : "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            <LogIn size={18} />
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            <span style={{ color: "#94a3b8", fontSize: 13 }}>¿No tienes cuenta?</span>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          </div>

          {/* Register button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { playClick(); navigate("/register"); }}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
            style={{
              background: "white",
              color: "#3b82f6",
              fontSize: 15,
              fontWeight: 700,
              border: "2px solid #dbeafe",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              cursor: "pointer",
            }}
          >
            <UserPlus size={18} />
            Crear cuenta nueva
          </motion.button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
