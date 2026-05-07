import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { PixelCharacter } from "./PixelCharacter";
import { useChatbot } from "../context/ChatbotContext";

/* ═══════════════════════════════════════════════════════════════════════════
   PIXEL COMPANION - PERSONAJE GUÍA INTEGRADO
   
   NO es un chatbot tradicional con panel lateral.
   ES un personaje que vive DENTRO de la experiencia educativa.
═══════════════════════════════════════════════════════════════════════════ */

type PixelPosition = "corner" | "center" | "left-side" | "top" | "bottom" | "floating";

interface PixelCompanionProps {
  position?: PixelPosition;
  forceShow?: boolean;
  context?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   INYECTAR ESTILOS GLOBALES UNA SOLA VEZ
═══════════════════════════════════════════════════════════════════════════ */
let _stylesInjected = false;
function injectStyles() {
  if (_stylesInjected || typeof document === "undefined") return;
  _stylesInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes pixel-pulse {
      0%, 100% { box-shadow: 0 8px 24px rgba(59,130,246,0.4), 0 0 0 0 rgba(59,130,246,0.3); }
      50%       { box-shadow: 0 8px 24px rgba(59,130,246,0.4), 0 0 0 10px rgba(59,130,246,0); }
    }
  `;
  document.head.appendChild(style);
}

const PIXEL_GREETINGS = [
  "¡Hola! Estoy aquí para acompañarte. Aparezco con consejos y celebraciones a lo largo del curso. ¿Listo para aprender?",
  "En Hyperlabgamecost aprenderás a planificar y presupuestar un videojuego desde cero, etapa por etapa. ¡Vamos allá!",
  "¿Sabías que la mayoría de proyectos indie fracasan por falta de planificación financiera? Este curso te enseña a evitar eso.",
  "Cada etapa que completes te acerca más a tener un presupuesto real y viable para tu videojuego. ¡Tú puedes!",
  "Tip: lee bien cada pregunta antes de responder. El contexto importa tanto como el concepto. 🎮",
  "Este programa cubre 6 etapas clave: desde la idea hasta el pitch financiero. ¡Una a la vez!",
  "Ganar XP no es solo diversión: refleja cuánto estás dominando el proceso de producción de un videojuego real.",
  "¿Atascado en una actividad? Recuerda que cada pregunta tiene una explicación detallada al confirmar tu respuesta.",
  "Los desarrolladores indie exitosos no solo saben programar o diseñar: saben gestionar su presupuesto. Eso aprenderás aquí.",
  "Completa todas las actividades de una etapa para desbloquear su quiz final y avanzar. ¡Paso a paso!",
  "Cada etapa tiene actividades prácticas y un quiz final. Necesitas 60 % o más para aprobar. ¡Confío en ti!",
];

export function PixelCompanion({ 
  position = "corner", 
  forceShow = false,
  context: _context,
}: PixelCompanionProps) {

  injectStyles();

  const { currentNotification, dismissNotification, notifications } = useChatbot();

  // isVisible arranca en true si forceShow, false en caso contrario
  const [isVisible, setIsVisible] = useState(forceShow);
  // manualOpen: el usuario abrió manualmente sin notificación activa
  const [manualOpen, setManualOpen] = useState(false);
  // índice del mensaje de saludo activo
  const [greetingIndex, setGreetingIndex] = useState(0);

  /* ═══════════════════════════════════════════════════════════════════════
     MOSTRAR PIXEL CUANDO LLEGA CUALQUIER NOTIFICACIÓN (o forceShow)
     ──────────────────────────────────────────────────────────────────────
     CORRECCIÓN CRÍTICA: antes solo respondía a showBubble:true, lo que
     causaba que Pixel desapareciera con notificaciones autoOpen sin bubble.
  ═══════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (currentNotification) {
      setIsVisible(true);
      setManualOpen(false);
    } else if (forceShow) {
      setIsVisible(true);
    }
  }, [currentNotification, forceShow]);

  /* ═══════════════════════════════════════════════════════════════════════
     CERRAR BURBUJA
  ═══════════════════════════════════════════════════════════════════════ */
  const handleClose = () => {
    setIsVisible(false);
    setManualOpen(false);
    if (currentNotification) {
      dismissNotification(currentNotification.id);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════
     CLICK EN EL BOTÓN SUTIL (cuando Pixel está "dormido")
  ═══════════════════════════════════════════════════════════════════════ */
  const handleButtonClick = () => {
    setIsVisible(true);
    if (!currentNotification) {
      setGreetingIndex(Math.floor(Math.random() * PIXEL_GREETINGS.length));
      setManualOpen(true);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════
     DATOS DE LA NOTIFICACIÓN ACTUAL
  ═══════════════════════════════════════════════════════════════════════ */
  const pixelState   = currentNotification?.pixelState || "idle";
  const pixelMood    = currentNotification?.mood       || "neutral";
  const priority     = currentNotification?.priority   || "normal";
  const isLargeMsg   = (currentNotification?.message?.length ?? 0) > 120;

  // Mensaje: el de la notificación, o un saludo rotativo si el usuario abrió manualmente
  const message = currentNotification?.message
    ?? (manualOpen
        ? PIXEL_GREETINGS[greetingIndex]
        : "");

  // Tamaño de Pixel según prioridad
  const pixelSize = priority === "high" ? 100 : priority === "normal" ? 80 : 70;

  // Para notificaciones de alta prioridad en modo "corner", mostramos Pixel centrado
  const isHighPriority   = priority === "high";
  const displayCenter    = position === "center" || (position === "corner" && isHighPriority && !!currentNotification);
  const displayLeftSide  = !displayCenter && position === "left-side";
  const displayCorner    = !displayCenter && !displayLeftSide; // corner, floating, top, bottom

  /* ═══════════════════════════════════════════════════════════════════════
     BOTÓN SUTIL (Pixel "durmiendo" en la esquina)
     ──────────────────────────────────────────────────────────────────────
     CORRECCIÓN: Se muestra siempre que !isVisible, independientemente de
     si hay una notificación pendiente. Antes la condición incluía
     !currentNotification, lo que causaba que con notificaciones autoOpen
     no se mostrara nada en absoluto.
  ═══════════════════════════════════════════════════════════════════════ */
  if (!isVisible) {
    const hasPending = notifications.length > 0;
    return (
      <motion.div
        style={{
          position: "fixed",
          bottom: "96px",   // Por encima del BottomNav (~65-91px)
          right: "16px",
          zIndex: 90,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.button
          onClick={handleButtonClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: hasPending
              ? "linear-gradient(135deg, #ef4444, #f97316)"
              : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            border: "3px solid white",
            boxShadow: "0 8px 24px rgba(59,130,246,0.45)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            animation: "pixel-pulse 2.5s infinite",
            padding: 0,
            touchAction: "manipulation",
          }}
        >
          {/* Mini Pixel */}
          <div style={{ width: "44px", height: "44px", pointerEvents: "none" }}>
            <PixelCharacter
              size={44}
              state={hasPending ? "explaining" : "idle"}
              mood="neutral"
            />
          </div>

          {/* Badge de notificaciones pendientes */}
          {hasPending && (
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#ef4444",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 700,
                color: "white",
                pointerEvents: "none",
              }}
            >
              {notifications.length}
            </motion.div>
          )}
        </motion.button>
      </motion.div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     PIXEL VISIBLE CON MENSAJE
     ──────────────────────────────────────────────────────────────────────
     Usamos un div wrapper para el posicionamiento fijo y un motion.div
     interior SOLO para las animaciones de entrada/salida.
     Esto evita conflictos entre style.transform (usado para centrar) y
     las animaciones de Framer Motion que también manipulan transforms.
  ═══════════════════════════════════════════════════════════════════════ */

  /* ── Burbuja de diálogo ─────────────────────────────────────────────── */
  const BubbleContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 24 }}
      style={{
        position: "relative",
        background: "white",
        borderRadius: displayCenter ? "24px" : "20px",
        padding: displayCenter ? "28px 24px" : "18px 18px",
        boxShadow: isHighPriority
          ? "0 20px 60px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.14)"
          : "0 12px 40px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)",
        border: "2px solid #e2e8f0",
        maxWidth: displayCenter ? "min(88vw, 400px)" : displayLeftSide ? "240px" : "280px",
        order: displayLeftSide ? 2 : 1,
      }}
    >
      {/* Cabecera */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "10px",
      }}>
        <div style={{
          fontSize: "11px",
          fontWeight: 800,
          color: "#8b5cf6",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
        }}>
          Pixel te acompaña
        </div>

        <button
          onClick={handleClose}
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "#f1f5f9",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            touchAction: "manipulation",
          }}
        >
          <X size={14} color="#64748b" />
        </button>
      </div>

      {/* Mensaje */}
      <p style={{
        fontSize: displayCenter ? "15px" : isLargeMsg ? "13px" : "14px",
        color: "#334155",
        margin: 0,
        lineHeight: 1.65,
      }}>
        {message}
      </p>

      {/* Cola de la burbuja apuntando hacia Pixel */}
      {!displayCenter && (
        <div style={{
          position: "absolute",
          bottom: displayLeftSide ? "50%" : "-8px",
          right: displayLeftSide ? "-8px" : "36px",
          transform: displayLeftSide
            ? "translateY(50%) rotate(45deg)"
            : "rotate(45deg)",
          width: "14px",
          height: "14px",
          background: "white",
          border: "2px solid #e2e8f0",
          borderTop: "none",
          borderLeft: "none",
        }} />
      )}

      {/* Tipo de notificación */}
      {currentNotification?.type && (
        <div style={{
          marginTop: "10px",
          paddingTop: "10px",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          <div style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: priority === "high" ? "#ef4444" : priority === "normal" ? "#3b82f6" : "#94a3b8",
            flexShrink: 0,
          }} />
          <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>
            {currentNotification.type === "stage-intro"         && "Introducción"}
            {currentNotification.type === "success-celebration" && "Celebración"}
            {currentNotification.type === "error-support"       && "Apoyo"}
            {currentNotification.type === "activity-hint"       && "Pista"}
            {currentNotification.type === "stage-complete"      && "Completado"}
            {currentNotification.type === "inactivity"          && "Recordatorio"}
            {currentNotification.type === "welcome"             && "Bienvenida"}
            {currentNotification.type === "milestone"           && "Hito"}
            {currentNotification.type === "encouragement"       && "Ánimo"}
          </span>
        </div>
      )}
    </motion.div>
  );

  /* ── Cuerpo de Pixel ────────────────────────────────────────────────── */
  const PixelBody = (
    <motion.div
      animate={{
        y: [0, -5, 0],
        rotate: pixelState === "correct" ? [-4, 4, -4] : [0, 0, 0],
      }}
      transition={{
        duration: pixelState === "correct" ? 0.6 : 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "relative",
        flexShrink: 0,
        order: displayLeftSide ? 1 : 2,
      }}
    >
      <PixelCharacter
        state={pixelState}
        mood={pixelMood}
        size={pixelSize}
        detailed={isHighPriority}
      />

      {/* Aura de color según estado */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.88, 1.1, 0.88] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${pixelSize * 1.4}px`,
          height: `${pixelSize * 1.4}px`,
          borderRadius: "50%",
          background:
            pixelState === "correct"      ? "radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)"  :
            pixelState === "encouraging"  ? "radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)" :
            pixelState === "completed"    ? "radial-gradient(circle, rgba(236,72,153,0.3),  transparent 70%)" :
                                            "radial-gradient(circle, rgba(59,130,246,0.3),  transparent 70%)",
          filter: "blur(16px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </motion.div>
  );

  /* ── Contenido agrupado ─────────────────────────────────────────────── */
  const GroupedContent = (
    <div style={{
      display: "flex",
      flexDirection: displayLeftSide ? "row" : "column",
      alignItems: displayCenter ? "center" : "flex-end",
      gap: "12px",
      maxWidth: displayCenter ? "min(90vw, 440px)" : "320px",
    }}>
      {message && BubbleContent}
      {PixelBody}
    </div>
  );

  /* ── Render: CENTRO ─────────────────────────────────────────────────── */
  if (displayCenter) {
    return (
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Overlay oscuro que cierra al hacer clic */}
            <motion.div
              key="pixel-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(5px)",
                zIndex: 99,
              }}
            />

            {/* Wrapper de posicionamiento: ocupa toda la pantalla como flex center */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                pointerEvents: "none",
                padding: "20px",
              }}
            >
              {/* motion.div solo para animación de entrada/salida — SIN transform de posición */}
              <motion.div
                key="pixel-center-content"
                initial={{ opacity: 0, scale: 0.5, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ pointerEvents: "auto" }}
              >
                {GroupedContent}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  }

  /* ── Render: LADO IZQUIERDO ─────────────────────────────────────────── */
  if (displayLeftSide) {
    return (
      <AnimatePresence>
        {isVisible && (
          /* Wrapper de posicionamiento: centrado verticalmente en el lado izquierdo */
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
              zIndex: 90,
              pointerEvents: "none",
            }}
          >
            <motion.div
              key="pixel-left-content"
              initial={{ opacity: 0, x: -120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ pointerEvents: "auto" }}
            >
              {GroupedContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  /* ── Render: ESQUINA / FLOATING / TOP / BOTTOM ──────────────────────── */
  const cornerStyle: React.CSSProperties =
    position === "floating"
      ? { position: "fixed", bottom: "120px", right: "16px", zIndex: 90 }
      : position === "top"
      ? { position: "fixed", top: "24px",     left: "50%",   zIndex: 90, transform: "translateX(-50%)" }
      : position === "bottom"
      ? { position: "fixed", bottom: "24px",  left: "50%",   zIndex: 90, transform: "translateX(-50%)" }
      : { position: "fixed", bottom: "96px",  right: "16px", zIndex: 90 }; // corner

  const cornerVariants =
    position === "top"    ? { initial: { opacity: 0, y: -80  }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40  } } :
    position === "bottom" ? { initial: { opacity: 0, y: 80   }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40   } } :
                            { initial: { opacity: 0, scale: 0.3, x: 80, y: 80 }, animate: { opacity: 1, scale: 1, x: 0, y: 0 }, exit: { opacity: 0, scale: 0.5, x: 40, y: 40 } };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="pixel-corner-content"
          {...cornerVariants}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={cornerStyle}
        >
          {GroupedContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
