import React from "react";
import { motion } from "motion/react";

type PixelMood = "happy" | "thinking" | "celebrating" | "helping" | "neutral" | "excited";

// NUEVOS ESTADOS DE ACOMPAÑAMIENTO
type PixelState = 
  | "welcome"           // Bienvenida - brazos abiertos
  | "explaining"        // Explicando etapa - señalando
  | "correct"           // Respuesta correcta - celebrando
  | "encouraging"       // Respuesta incorrecta - apoyo
  | "waiting"           // Inactividad - esperando
  | "completed"         // Etapa completada - victoria máxima
  | "idle";             // Estado por defecto

interface PixelCharacterProps {
  mood?: PixelMood;
  state?: PixelState;    // NUEVA PROP
  size?: number;
  isIdle?: boolean;
  showSparkles?: boolean;
  detailed?: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTE PIXEL - Robot 2D Animado con Estados de Acompañamiento
═══════════════════════════════════════════════════════════════════════════ */

export function PixelCharacter({ 
  mood = "neutral", 
  state = "idle",        // Por defecto idle
  size = 120, 
  isIdle = false,
  showSparkles = false,
  detailed = false 
}: PixelCharacterProps) {
  
  /* ═══════════════════════════════════════════════════════════════════════
     COLORES SEGÚN EL ESTADO DE ACOMPAÑAMIENTO
  ═══════════════════════════════════════════════════════════════════════ */
  
  const getColors = () => {
    switch (state) {
      case "welcome":
        return {
          primary: "#f59e0b",      // Naranja cálido
          secondary: "#fbbf24",
          accent: "#fcd34d",
          glow: "#f59e0b",
          bright: "#fef3c7",
        };
      case "explaining":
        return {
          primary: "#06b6d4",      // Cyan educativo
          secondary: "#22d3ee",
          accent: "#67e8f9",
          glow: "#06b6d4",
          bright: "#cffafe",
        };
      case "correct":
        return {
          primary: "#10b981",      // Verde éxito
          secondary: "#34d399",
          accent: "#6ee7b7",
          glow: "#10b981",
          bright: "#d1fae5",
        };
      case "encouraging":
        return {
          primary: "#8b5cf6",      // Morado empático
          secondary: "#a78bfa",
          accent: "#c4b5fd",
          glow: "#8b5cf6",
          bright: "#ede9fe",
        };
      case "waiting":
        return {
          primary: "#64748b",      // Gris neutro
          secondary: "#94a3b8",
          accent: "#cbd5e1",
          glow: "#64748b",
          bright: "#f1f5f9",
        };
      case "completed":
        return {
          primary: "#ec4899",      // Rosa victoria
          secondary: "#f472b6",
          accent: "#f9a8d4",
          glow: "#ec4899",
          bright: "#fce7f3",
        };
      default:
        return {
          primary: "#3b82f6",
          secondary: "#60a5fa",
          accent: "#93c5fd",
          glow: "#3b82f6",
          bright: "#dbeafe",
        };
    }
  };

  const colors = getColors();

  /* ═══════════════════════════════════════════════════════════════════════
     EXPRESIONES FACIALES SEGÚN ESTADO
  ═══════════════════════════════════════════════════════════════════════ */
  
  const getEyeExpression = () => {
    switch (state) {
      case "welcome":
        return { 
          leftY: 48, 
          rightY: 48, 
          shape: "happy-wide",      // Ojos cerrados felices amplios
          eyeWidth: 12,             // Más anchos
        };
      case "explaining":
        return { 
          leftY: 50, 
          rightY: 48, 
          shape: "focused",         // Un ojo más alto (curioso)
          eyeWidth: 10,
        };
      case "correct":
        return { 
          leftY: 47, 
          rightY: 47, 
          shape: "excited",         // Ojos grandes y brillantes
          eyeWidth: 12,
        };
      case "encouraging":
        return { 
          leftY: 51, 
          rightY: 51, 
          shape: "soft",            // Ojos suaves y empáticos
          eyeWidth: 9,
        };
      case "waiting":
        return { 
          leftY: 52, 
          rightY: 50, 
          shape: "sleepy",          // Ojos medio cerrados
          eyeWidth: 8,
        };
      case "completed":
        return { 
          leftY: 46, 
          rightY: 46, 
          shape: "star",            // Ojos de estrella
          eyeWidth: 14,
        };
      default:
        return { 
          leftY: 50, 
          rightY: 50, 
          shape: "neutral",
          eyeWidth: 10,
        };
    }
  };

  const eyeExpression = getEyeExpression();

  /* ═══════════════════════════════════════════════════════════════════════
     ANIMACIONES SEGÚN ESTADO
  ═══════════════════════════════════════════════════════════════════════ */
  
  const getAnimations = () => {
    switch (state) {
      case "welcome":
        return {
          body: {
            y: [0, -6, 0],
            rotate: [-2, 2, -2],
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          },
          antenna: {
            rotate: [-15, 15, -15],
            transition: { duration: 0.8, repeat: Infinity },
          },
          eyes: {
            scale: [1, 1.3, 1],
            transition: { duration: 1.2, repeat: Infinity, repeatDelay: 0.5 },
          },
        };
      
      case "explaining":
        return {
          body: {
            y: [0, -3, 0],
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          },
          antenna: {
            rotate: [0, 8, 0],
            transition: { duration: 2, repeat: Infinity },
          },
          eyes: {
            x: [-1, 1, -1],
            transition: { duration: 3, repeat: Infinity },
          },
        };
      
      case "correct":
        return {
          body: {
            y: [0, -12, 0],
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.8 },
          },
          antenna: {
            rotate: [-20, 20, -20],
            transition: { duration: 0.4, repeat: Infinity },
          },
          eyes: {
            scale: [1, 1.5, 1],
            transition: { duration: 0.5, repeat: Infinity, repeatDelay: 0.6 },
          },
        };
      
      case "encouraging":
        return {
          body: {
            y: [0, -2, 0],
            scale: [1, 1.02, 1],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          },
          antenna: {
            rotate: [-3, 3, -3],
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          },
          eyes: {
            scale: [1, 1.1, 1],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          },
        };
      
      case "waiting":
        return {
          body: {
            y: [0, -1, 0],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          },
          antenna: {
            rotate: [0, -10, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          },
          eyes: {
            scaleY: [1, 0.3, 1],
            transition: { duration: 3, repeat: Infinity, repeatDelay: 2 },
          },
        };
      
      case "completed":
        return {
          body: {
            y: [0, -10, -5, -10, 0],
            rotate: [0, -8, 8, -8, 0],
            transition: { duration: 0.8, repeat: Infinity, repeatDelay: 0.5 },
          },
          antenna: {
            rotate: [-25, 25, -25],
            transition: { duration: 0.3, repeat: Infinity },
          },
          eyes: {
            scale: [1, 1.6, 1.3, 1.6, 1],
            transition: { duration: 0.7, repeat: Infinity, repeatDelay: 0.5 },
          },
        };
      
      default:
        return {
          body: {
            y: [0, -4, 0],
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          },
          antenna: {
            rotate: [-5, 5, -5],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          },
          eyes: {
            scale: [1, 1.05, 1],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          },
        };
    }
  };

  const animations = getAnimations();

  /* ═══════════════════════════════════════════════════════════════════════
     POSICIONES DE BRAZOS SEGÚN ESTADO
  ═══════════════════════════════════════════════════════════════════════ */
  
  const getArmPositions = () => {
    switch (state) {
      case "welcome":
        return {
          left: { x: 18, y: 55, rotation: -35, width: 12, height: 24 },
          right: { x: 90, y: 55, rotation: 35, width: 12, height: 24 },
        };
      case "explaining":
        return {
          left: { x: 22, y: 58, rotation: 0, width: 10, height: 20 },
          right: { x: 88, y: 45, rotation: -45, width: 10, height: 26 }, // Brazo señalando arriba
        };
      case "correct":
        return {
          left: { x: 20, y: 48, rotation: -60, width: 10, height: 22 },  // Brazos arriba
          right: { x: 90, y: 48, rotation: 60, width: 10, height: 22 },
        };
      case "encouraging":
        return {
          left: { x: 18, y: 58, rotation: -25, width: 11, height: 22 },  // Brazos extendidos
          right: { x: 91, y: 58, rotation: 25, width: 11, height: 22 },
        };
      case "waiting":
        return {
          left: { x: 22, y: 62, rotation: 5, width: 10, height: 18 },    // Brazos caídos
          right: { x: 88, y: 62, rotation: -5, width: 10, height: 18 },
        };
      case "completed":
        return {
          left: { x: 19, y: 50, rotation: -70, width: 10, height: 24 },  // Brazos muy arriba
          right: { x: 91, y: 50, rotation: 70, width: 10, height: 24 },
        };
      default:
        return {
          left: { x: 22, y: 58, rotation: 0, width: 10, height: 20 },
          right: { x: 88, y: 58, rotation: 0, width: 10, height: 20 },
        };
    }
  };

  const armPositions = getArmPositions();

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* ═══════════════════════════════════════════════════════════════════
          EFECTOS DECORATIVOS SEGÚN ESTADO
      ═══════════════════════════════════════════════════════════════════ */}
      
      {/* WELCOME - Ondas de bienvenida */}
      {state === "welcome" && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`wave-${i}`}
              animate={{
                scale: [1, 2.5, 2.5],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: `3px solid ${colors.accent}`,
              }}
            />
          ))}
        </>
      )}

      {/* EXPLAINING - Iconos flotantes educativos */}
      {state === "explaining" && (
        <>
          {["?", "!", "💡"].map((icon, i) => (
            <motion.div
              key={`icon-${i}`}
              animate={{
                y: [-10, -30, -10],
                opacity: [0.3, 1, 0.3],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                position: "absolute",
                top: "10%",
                right: `${-5 + i * 15}%`,
                fontSize: "18px",
                fontWeight: 700,
                color: colors.primary,
              }}
            >
              {icon}
            </motion.div>
          ))}
        </>
      )}

      {/* CORRECT - Estrellas de celebración */}
      {state === "correct" && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: [0, Math.cos((i * Math.PI * 2) / 12) * 50],
                y: [0, Math.sin((i * Math.PI * 2) / 12) * 50],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: i * 0.08,
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "8px",
                height: "8px",
                background: colors.accent,
                clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                boxShadow: `0 0 10px ${colors.glow}`,
              }}
            />
          ))}
        </>
      )}

      {/* ENCOURAGING - Corazones flotantes */}
      {state === "encouraging" && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`heart-${i}`}
              animate={{
                y: [0, -40, -40],
                x: [0, Math.sin(i) * 15, Math.sin(i) * 15],
                opacity: [0.8, 0.4, 0],
                scale: [0.8, 1.2, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              style={{
                position: "absolute",
                top: "70%",
                left: `${35 + i * 10}%`,
                fontSize: "16px",
              }}
            >
              💜
            </motion.div>
          ))}
        </>
      )}

      {/* WAITING - Zzz de espera */}
      {state === "waiting" && (
        <>
          {["Z", "z", "z"].map((letter, i) => (
            <motion.div
              key={`zzz-${i}`}
              animate={{
                y: [0, -25, -25],
                x: [0, 8, 8],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.4,
                repeatDelay: 1,
              }}
              style={{
                position: "absolute",
                top: "15%",
                right: `${5 + i * 12}%`,
                fontSize: `${18 - i * 3}px`,
                fontWeight: 700,
                color: colors.primary,
              }}
            >
              {letter}
            </motion.div>
          ))}
        </>
      )}

      {/* COMPLETED - Confetti explosión */}
      {state === "completed" && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              initial={{ opacity: 1 }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, Math.random() * 80 + 40],
                rotate: [0, Math.random() * 720],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.3,
                delay: i * 0.05,
              }}
              style={{
                position: "absolute",
                top: "30%",
                left: "50%",
                width: `${Math.random() * 6 + 4}px`,
                height: `${Math.random() * 8 + 6}px`,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                background: ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#06b6d4"][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </>
      )}

      {/* Glow effect base */}
      <motion.div
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [0.85, 1.05, 0.85],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: size * 1.1,
          height: size * 1.1,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.glow}50, transparent 65%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          PERSONAJE SVG CON POSE SEGÚN ESTADO
      ═══════════════════════════════════════════════════════════════════ */}

      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        style={{ position: "relative", zIndex: 1 }}
        animate={animations.body}
      >
        <defs>
          <linearGradient id={`bodyGradient-${state}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
          <linearGradient id={`screenGradient-${state}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id={`glowGradient-${state}`}>
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sombra */}
        <ellipse
          cx="60"
          cy="108"
          rx="30"
          ry="5"
          fill="#00000030"
          style={{ filter: "blur(3px)" }}
        />

        <g>
          {/* Cuerpo del robot */}
          <motion.rect
            x="42"
            y="78"
            width="36"
            height="24"
            rx="10"
            fill={`url(#bodyGradient-${state})`}
            stroke={colors.bright}
            strokeWidth="2"
          />
          
          <rect x="48" y="84" width="24" height="3" rx="1.5" fill={colors.bright} opacity="0.5" />
          <rect x="48" y="90" width="24" height="3" rx="1.5" fill={colors.bright} opacity="0.5" />
          <circle cx="50" cy="96" r="2" fill={colors.accent} opacity="0.7" />
          <circle cx="70" cy="96" r="2" fill={colors.accent} opacity="0.7" />

          {/* Conexión cuerpo-cabeza */}
          <rect x="54" y="72" width="12" height="8" rx="3" fill={colors.secondary} />

          {/* CABEZA/VISOR - con expresión según estado */}
          <motion.g>
            <rect
              x="30"
              y="28"
              width="60"
              height="52"
              rx="14"
              fill={`url(#bodyGradient-${state})`}
              stroke="white"
              strokeWidth="4"
            />

            <rect
              x="34"
              y="32"
              width="52"
              height="44"
              rx="11"
              fill={colors.secondary}
              opacity="0.3"
            />

            <rect
              x="38"
              y="36"
              width="44"
              height="38"
              rx="9"
              fill={`url(#screenGradient-${state})`}
              stroke={colors.bright}
              strokeWidth="1"
              opacity="0.95"
            />

            <rect x="42" y="40" width="18" height="14" rx="4" fill="white" opacity="0.12" />
            <rect x="42" y="40" width="10" height="8" rx="2" fill="white" opacity="0.2" />

            {/* OJOS - Diferentes expresiones */}
            <motion.g animate={animations.eyes}>
              {/* Ojos según expresión */}
              {eyeExpression.shape === "happy-wide" && (
                // Arcos felices anchos
                <>
                  <path
                    d="M 44 50 Q 50 56 56 50"
                    stroke={colors.accent}
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 64 50 Q 70 56 76 50"
                    stroke={colors.accent}
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
              
              {eyeExpression.shape === "excited" && (
                // Ojos muy grandes y brillantes
                <>
                  <circle cx="50" cy={eyeExpression.leftY} r="6" fill={colors.accent} />
                  <circle cx="50" cy={eyeExpression.leftY} r="4" fill={colors.bright} />
                  <circle cx="51" cy={eyeExpression.leftY - 1.5} r="2" fill="white" />
                  
                  <circle cx="70" cy={eyeExpression.rightY} r="6" fill={colors.accent} />
                  <circle cx="70" cy={eyeExpression.rightY} r="4" fill={colors.bright} />
                  <circle cx="71" cy={eyeExpression.rightY - 1.5} r="2" fill="white" />
                </>
              )}

              {eyeExpression.shape === "star" && (
                // Ojos de estrella
                <>
                  <path
                    d="M 50 44 L 52 49 L 57 49 L 53 52 L 55 57 L 50 54 L 45 57 L 47 52 L 43 49 L 48 49 Z"
                    fill={colors.accent}
                  />
                  <path
                    d="M 70 44 L 72 49 L 77 49 L 73 52 L 75 57 L 70 54 L 65 57 L 67 52 L 63 49 L 68 49 Z"
                    fill={colors.accent}
                  />
                </>
              )}

              {eyeExpression.shape === "soft" && (
                // Ojos suaves empáticos
                <>
                  <ellipse cx="50" cy={eyeExpression.leftY} rx="5" ry="4" fill={colors.accent} />
                  <circle cx="50" cy={eyeExpression.leftY} r="2.5" fill={colors.bright} />
                  <circle cx="51" cy={eyeExpression.leftY - 1} r="1.2" fill="white" />
                  
                  <ellipse cx="70" cy={eyeExpression.rightY} rx="5" ry="4" fill={colors.accent} />
                  <circle cx="70" cy={eyeExpression.rightY} r="2.5" fill={colors.bright} />
                  <circle cx="71" cy={eyeExpression.rightY - 1} r="1.2" fill="white" />
                </>
              )}

              {eyeExpression.shape === "sleepy" && (
                // Ojos somnolientos
                <>
                  <motion.path
                    d="M 46 51 Q 50 49 54 51"
                    stroke={colors.accent}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <motion.path
                    d="M 66 51 Q 70 49 74 51"
                    stroke={colors.accent}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}

              {(eyeExpression.shape === "focused" || eyeExpression.shape === "neutral") && (
                // Ojos normales
                <>
                  <circle cx="50" cy={eyeExpression.leftY} r="5" fill={colors.accent} />
                  <circle cx="50" cy={eyeExpression.leftY} r="3" fill={colors.bright} />
                  <circle cx="51" cy={eyeExpression.leftY - 1} r="1.5" fill="white" />
                  
                  <circle cx="70" cy={eyeExpression.rightY} r="5" fill={colors.accent} />
                  <circle cx="70" cy={eyeExpression.rightY} r="3" fill={colors.bright} />
                  <circle cx="71" cy={eyeExpression.rightY - 1} r="1.5" fill="white" />
                </>
              )}
            </motion.g>

            {/* BOCA según estado */}
            {(state === "welcome" || state === "correct" || state === "completed") && (
              <motion.path
                d="M 48 62 Q 60 70 72 62"
                stroke={colors.accent}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {state === "explaining" && (
              <ellipse
                cx="60"
                cy="64"
                rx="4"
                ry="5"
                fill={colors.accent}
                opacity="0.8"
              />
            )}

            {state === "encouraging" && (
              <path
                d="M 50 66 Q 60 64 70 66"
                stroke={colors.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {state === "waiting" && (
              <line
                x1="50"
                y1="65"
                x2="70"
                y2="65"
                stroke={colors.accent}
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}

            {state === "idle" && (
              <path
                d="M 50 65 Q 60 67 70 65"
                stroke={colors.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Detalles tech */}
            <rect x="42" y="42" width="3" height="3" rx="1" fill={colors.accent} opacity="0.5" />
            <rect x="75" y="42" width="3" height="3" rx="1" fill={colors.accent} opacity="0.5" />
          </motion.g>

          {/* ANTENA */}
          <motion.g animate={animations.antenna} style={{ transformOrigin: "60px 28px" }}>
            <line
              x1="60"
              y1="28"
              x2="60"
              y2="18"
              stroke={colors.secondary}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <motion.circle
              cx="60"
              cy="15"
              r="5"
              fill={colors.accent}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <circle cx="60" cy="15" r="3" fill={colors.bright} opacity="0.9" />
            <circle cx="61" cy="14" r="1.5" fill="white" />
            <circle cx="60" cy="15" r="8" fill={`url(#glowGradient-${state})`} opacity="0.6" />
          </motion.g>

          {/* BRAZOS con poses según estado */}
          <motion.g
            animate={
              state === "welcome" || state === "encouraging"
                ? { rotate: [0, 5, 0, -5, 0] }
                : state === "explaining"
                ? { y: [0, -2, 0] }
                : {}
            }
            transition={
              state === "welcome" || state === "encouraging"
                ? { duration: 2, repeat: Infinity }
                : state === "explaining"
                ? { duration: 1.5, repeat: Infinity }
                : {}
            }
          >
            {/* Brazo izquierdo */}
            <g style={{ transformOrigin: `${armPositions.left.x + 5}px ${armPositions.left.y}px` }}>
              <motion.rect
                x={armPositions.left.x}
                y={armPositions.left.y}
                width={armPositions.left.width}
                height={armPositions.left.height}
                rx="5"
                fill={`url(#bodyGradient-${state})`}
                style={{ transformOrigin: "center" }}
                animate={{ rotate: armPositions.left.rotation }}
              />
              <motion.circle
                cx={armPositions.left.x + armPositions.left.width / 2}
                cy={armPositions.left.y + armPositions.left.height - 2}
                r="4"
                fill={colors.accent}
                animate={{ rotate: armPositions.left.rotation }}
              />
            </g>

            {/* Brazo derecho */}
            <g style={{ transformOrigin: `${armPositions.right.x + 5}px ${armPositions.right.y}px` }}>
              <motion.rect
                x={armPositions.right.x}
                y={armPositions.right.y}
                width={armPositions.right.width}
                height={armPositions.right.height}
                rx="5"
                fill={`url(#bodyGradient-${state})`}
                style={{ transformOrigin: "center" }}
                animate={{ rotate: armPositions.right.rotation }}
              />
              <motion.circle
                cx={armPositions.right.x + armPositions.right.width / 2}
                cy={armPositions.right.y + armPositions.right.height - 2}
                r="4"
                fill={colors.accent}
                animate={{ rotate: armPositions.right.rotation }}
              />
            </g>
          </motion.g>

          {/* Panel de control detallado */}
          {detailed && (
            <>
              <rect x="52" y="82" width="16" height="10" rx="3" fill="#1e293b" opacity="0.3" />
              <rect x="54" y="84" width="5" height="2" rx="1" fill={colors.accent} opacity="0.6" />
              <rect x="60" y="84" width="5" height="2" rx="1" fill={colors.accent} opacity="0.6" />
              <circle cx="56.5" cy="88" r="1" fill={colors.bright} />
              <circle cx="61.5" cy="88" r="1" fill={colors.bright} />
            </>
          )}
        </g>
      </motion.svg>

      {/* Elemento adicional de pointing para "explaining" */}
      {state === "explaining" && (
        <motion.div
          animate={{
            y: [-5, -15, -5],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "25%",
            right: "15%",
            fontSize: "24px",
            transform: "rotate(-30deg)",
          }}
        >
          👆
        </motion.div>
      )}

      {/* Trofeo para "completed" */}
      {state === "completed" && (
        <motion.div
          animate={{
            rotate: [-10, 10, -10],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "32px",
          }}
        >
          🏆
        </motion.div>
      )}
    </div>
  );
}
