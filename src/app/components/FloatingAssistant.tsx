import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, GripHorizontal, Bot, Lightbulb } from "lucide-react";
import { stages } from "../data/gameData";

/* ─── Tips por contexto ─────────────────────────────────────────────────────── */
const tipsByContext: Record<string, string[]> = {
  home: [
    "Completa las 6 etapas en orden para aprender a presupuestar tu videojuego de principio a fin.",
    "Responde correctamente para ganar XP. Cuanto más preciso seas, más puntos acumulas.",
    "Mantén tu racha activa estudiando cada día. La consistencia es clave en el aprendizaje.",
    "Hay logros especiales esperándote. Completa hitos del viaje para desbloquearlos.",
  ],
  stages: [
    "Las etapas se desbloquean en orden. Termina el quiz de cada una para avanzar.",
    "Cada etapa tiene actividades de práctica y un quiz final de validación.",
    "Puedes repasar etapas ya completadas en cualquier momento para reforzar tu aprendizaje.",
    "Este viaje te llevará desde la idea hasta el presupuesto completo de tu videojuego.",
  ],
  "stage-1": [
    "La propuesta de valor describe la experiencia única de tu juego, no sus características técnicas.",
    "Piensa en tu juego favorito: ¿qué lo hace especial? Eso es su propuesta de valor.",
    "El género define las expectativas del jugador. Conocerlas te permite superarlas.",
    "Un buen concepto se puede explicar en una sola frase que haga querer jugar.",
  ],
  "stage-2": [
    "El alcance define qué tan grande será tu juego. A mayor alcance, mayor costo.",
    "Reducir el alcance no significa hacer un juego peor; significa hacer uno más viable.",
    "El 'scope creep' (expandir el proyecto sin control) es la causa número uno de fracasos indie.",
    "Un alcance bien definido desde el inicio ahorra tiempo y dinero durante toda la producción.",
  ],
  "stage-3": [
    "El costo del equipo humano es usualmente el gasto más alto en cualquier proyecto de videojuego.",
    "Herramientas gratuitas como Godot o Blender pueden reducir significativamente el presupuesto.",
    "El equipo mínimo viable para un indie 2D puede ser 1-3 personas con roles polivalentes.",
    "Identifica qué roles son indispensables vs. cuáles puedes cubrir con outsourcing o colaboradores.",
  ],
  "stage-4": [
    "Distinguir costos fijos de variables te permite planear mejor en qué puedes ahorrar.",
    "El arte y la programación suelen representar el 60-70% del presupuesto total de un indie.",
    "Los costos ocultos más comunes: revisiones de arte, bugs imprevistos y retrasos en entrega.",
    "Prioriza los gastos que impactan directamente la experiencia del jugador en el núcleo del juego.",
  ],
  "stage-5": [
    "Un presupuesto bien distribuido reserva 10-20% para imprevistos y contingencias.",
    "Evalúa la viabilidad preguntando: ¿tenemos tiempo, equipo y dinero para terminarlo?",
    "Un proyecto viable no es el más ambicioso, sino el que puede completarse con los recursos disponibles.",
    "Es mejor hacer un juego pequeño terminado que uno grande a medias.",
  ],
  "stage-6": [
    "Un pitch financiero sólido explica claramente en qué se invertirá cada peso del presupuesto.",
    "Los evaluadores buscan honestidad: reconoce las limitaciones de tu proyecto sin disculparte.",
    "Un pitch convincente justifica cada decisión presupuestal con datos o argumentos claros.",
    "La fortaleza de tu pitch no está en el tamaño del presupuesto, sino en la claridad y lógica.",
  ],
  "activity-multiple-choice": [
    "Lee todas las opciones antes de elegir. La más específica suele ser la correcta.",
    "Elimina primero las opciones claramente incorrectas para enfocarte en las posibles.",
    "Si tienes dudas, usa el botón de pista para obtener ayuda sin perder XP.",
    "Relaciona la pregunta con conceptos de presupuestación y costos que ya estudiaste.",
  ],
  "activity-order-steps": [
    "Piensa en el flujo lógico: ¿qué debe ocurrir primero para que lo siguiente tenga sentido?",
    "Si te equivocas, toca la × junto al elemento para devolverlo y recolocarlo.",
    "Imagina que eres el director del proyecto: ¿en qué orden priorizarías estas tareas?",
    "En presupuestación, la secuencia importa: primero identificar costos, luego priorizarlos.",
  ],
  "activity-reflection": [
    "No hay respuestas incorrectas en la reflexión. Lo importante es que sea genuina y aplicada.",
    "Conecta el concepto con tu proyecto real. ¿Cuánto costaría aplicar esto en tu videojuego?",
    "Escribe al menos 20 caracteres. Cuanto más detalles, más consolidas el aprendizaje.",
    "Las mejores reflexiones relacionan la teoría con decisiones concretas de presupuesto.",
  ],
  quiz: [
    "Lee cada pregunta con calma. Las respuestas están en lo que aprendiste en las actividades.",
    "Necesitas el 60% correcto para pasar. Si no lo logras, puedes repasar y volver a intentarlo.",
    "Completaste todas las actividades. Ya tienes el conocimiento necesario para el quiz.",
    "Cada respuesta tiene una explicación que refuerza tu aprendizaje sobre presupuestación.",
    "Responder todo correctamente te da el logro de 'Sin Errores'. Apunta alto.",
  ],
};

/* ─── Resolver contexto por ruta ───────────────────────────────────────────── */
function getContextKey(pathname: string): string | null {
  if (pathname === "/home") return "home";
  if (pathname === "/stages") return "stages";

  const stageDetailMatch = pathname.match(/^\/stage\/(\d+)$/);
  if (stageDetailMatch) {
    const num = parseInt(stageDetailMatch[1]);
    if (num >= 1 && num <= 6) return `stage-${num}`;
    return "stages";
  }

  const quizMatch = pathname.match(/^\/quiz\/\d+$/);
  if (quizMatch) return "quiz";

  const activityMatch = pathname.match(/^\/activity\/(\d+)\/(.+)$/);
  if (activityMatch) {
    const stageId = parseInt(activityMatch[1]);
    const activityId = activityMatch[2];
    const stage = stages.find((s) => s.id === stageId);
    const activity = stage?.activities.find((a) => a.id === activityId);
    if (activity) return `activity-${activity.type}`;
    return "activity-multiple-choice";
  }

  return null;
}

/* ─── Constantes ────────────────────────────────────────────────────────────── */
const BUBBLE_SIZE = 52;
const PANEL_WIDTH = 272;
const PANEL_HEIGHT_EST = 200;
const DRAG_THRESHOLD = 6; // px de movimiento para considerar que es drag

/* ─── Componente ─────────────────────────────────────────────────────────────── */
export function FloatingAssistant() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  /* posición draggable — inicio: esquina inferior derecha */
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);
  const dragging = useRef(false);
  const hasMoved = useRef(false);
  const pointerStartPos = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  /* Inicializar posición una sola vez */
  useEffect(() => {
    if (!initialized) {
      const container = containerRef.current?.closest("[style*='max-width']") as HTMLElement | null;
      const maxW = container ? container.offsetWidth : Math.min(430, window.innerWidth);
      const maxH = window.innerHeight;
      setPos({
        x: maxW - BUBBLE_SIZE - 16,
        y: maxH - BUBBLE_SIZE - 170,
      });
      setInitialized(true);
    }
  }, [initialized]);

  /* Reset tip/open cuando cambia la ruta */
  useEffect(() => {
    setTipIndex(0);
    setIsOpen(false);
    setHasBeenSeen(false);
  }, [location.pathname]);

  /* ── Bounds helpers ── */
  const getContainerBounds = useCallback(() => {
    const container = containerRef.current?.closest("[style*='max-width']") as HTMLElement | null;
    if (container) {
      return { width: container.offsetWidth, height: container.offsetHeight };
    }
    return { width: Math.min(430, window.innerWidth), height: window.innerHeight };
  }, []);

  const clampPos = useCallback(
    (x: number, y: number) => {
      const { width, height } = getContainerBounds();
      return {
        x: Math.max(8, Math.min(x, width - BUBBLE_SIZE - 8)),
        y: Math.max(60, Math.min(y, height - BUBBLE_SIZE - 8)),
      };
    },
    [getContainerBounds]
  );

  /* ── Drag handlers ── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      dragging.current = true;
      hasMoved.current = false;
      pointerStartPos.current = { x: e.clientX, y: e.clientY };

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const containerEl = containerRef.current?.closest("[style*='max-width']") as HTMLElement | null;
      const containerRect = containerEl ? containerEl.getBoundingClientRect() : { left: 0, top: 0 };
      dragOffset.current = {
        x: e.clientX - rect.left + (containerRect.left - (containerEl?.offsetLeft || 0)),
        y: e.clientY - rect.top + (containerRect.top - (containerEl?.offsetTop || 0)),
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const dx = Math.abs(e.clientX - pointerStartPos.current.x);
      const dy = Math.abs(e.clientY - pointerStartPos.current.y);

      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        hasMoved.current = true;
        e.preventDefault();
        const containerEl = containerRef.current?.closest("[style*='max-width']") as HTMLElement | null;
        const containerRect = containerEl ? containerEl.getBoundingClientRect() : { left: 0, top: 0 };
        const rawX = e.clientX - containerRect.left - dragOffset.current.x + BUBBLE_SIZE / 2;
        const rawY = e.clientY - containerRect.top - dragOffset.current.y + BUBBLE_SIZE / 2;
        setPos(clampPos(rawX, rawY));
      }
    },
    [clampPos]
  );

  const handlePointerUp = useCallback(() => {
    const wasClick = !hasMoved.current;
    dragging.current = false;
    hasMoved.current = false;

    if (wasClick) {
      setIsOpen((prev) => {
        if (!prev) setHasBeenSeen(true);
        return !prev;
      });
    }
  }, []);

  /* ── Context ── */
  const contextKey = getContextKey(location.pathname);
  if (!contextKey) return null;
  const currentTips = tipsByContext[contextKey] ?? [];
  if (currentTips.length === 0) return null;

  const safeTipIndex = tipIndex % currentTips.length;
  const currentTip = currentTips[safeTipIndex];

  const handleClose = () => setIsOpen(false);
  const handleNext = () => setTipIndex((p) => (p + 1) % currentTips.length);
  const handlePrev = () => setTipIndex((p) => (p - 1 + currentTips.length) % currentTips.length);

  /* Calcular si el panel debe abrirse arriba o abajo */
  const { height: containerH } = getContainerBounds();
  const openAbove = pos.y + BUBBLE_SIZE + PANEL_HEIGHT_EST > containerH - 20;
  const panelBottom = openAbove ? BUBBLE_SIZE + 8 : undefined;
  const panelTop = !openAbove ? BUBBLE_SIZE + 8 : undefined;

  /* Calcular si el panel debe abrir a la izquierda o a la derecha */
  const { width: containerW } = getContainerBounds();
  const openLeft = pos.x + PANEL_WIDTH > containerW - 8;
  const panelRight = openLeft ? 0 : undefined;
  const panelLeft = !openLeft ? 0 : undefined;

  if (!initialized) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: `${BUBBLE_SIZE}px`,
        height: `${BUBBLE_SIZE}px`,
        zIndex: 50,
        touchAction: "none",
      }}
    >
      {/* Panel de consejos */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: openAbove ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: openAbove ? 8 : -8 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            style={{
              position: "absolute",
              bottom: panelBottom,
              top: panelTop,
              left: panelLeft,
              right: panelRight,
              width: `${PANEL_WIDTH}px`,
              background: "white",
              borderRadius: "20px",
              padding: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)",
              border: "1.5px solid #e2e8f0",
              zIndex: 51,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Bot size={14} color="white" strokeWidth={2} />
                </div>
                <div>
                  <p style={{ color: "#0f172a", fontSize: "12px", fontWeight: 700, lineHeight: 1 }}>Pixel</p>
                  <p style={{ color: "#94a3b8", fontSize: "10px", lineHeight: 1, marginTop: "1px" }}>Tu asistente</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                style={{
                  padding: "5px", borderRadius: "8px", background: "#f1f5f9",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  lineHeight: 0,
                }}
              >
                <X size={14} color="#94a3b8" />
              </button>
            </div>

            <div style={{ height: "1px", background: "#f1f5f9", marginBottom: "10px" }} />

            {/* Tip content */}
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: currentTips.length > 1 ? "12px" : "0" }}>
              <div style={{ flexShrink: 0, marginTop: "2px" }}>
                <Lightbulb size={14} color="#f59e0b" strokeWidth={2} />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={safeTipIndex}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    color: "#334155", fontSize: "13px", lineHeight: 1.65,
                    minHeight: "52px",
                  }}
                >
                  {currentTip}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Navegación */}
            {currentTips.length > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  onClick={handlePrev}
                  style={{
                    width: "28px", height: "28px", borderRadius: "8px", background: "#f1f5f9",
                    border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <ChevronLeft size={14} color="#64748b" />
                </button>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  {currentTips.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTipIndex(i)}
                      style={{
                        width: i === safeTipIndex ? "20px" : "6px",
                        height: "6px",
                        borderRadius: i === safeTipIndex ? "3px" : "50%",
                        background: i === safeTipIndex ? "#3b82f6" : "#cbd5e1",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        padding: 0,
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  style={{
                    width: "28px", height: "28px", borderRadius: "8px", background: "#f1f5f9",
                    border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <ChevronRight size={14} color="#64748b" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón-burbuja draggable */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ position: "relative", width: `${BUBBLE_SIZE}px`, height: `${BUBBLE_SIZE}px`, cursor: "grab" }}
      >
        {/* Grip indicator */}
        <div
          style={{
            position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)",
            opacity: 0.5, pointerEvents: "none",
          }}
        >
          <GripHorizontal size={10} color="#94a3b8" />
        </div>

        <motion.div
          whileTap={{ scale: 0.88 }}
          animate={!isOpen && !hasBeenSeen ? { y: [0, -5, 0] } : { y: 0 }}
          transition={
            !isOpen && !hasBeenSeen
              ? { duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }
              : { duration: 0.2 }
          }
          style={{
            width: `${BUBBLE_SIZE}px`, height: `${BUBBLE_SIZE}px`, borderRadius: "50%",
            background: isOpen
              ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
              : "linear-gradient(135deg, #3b82f6, #6366f1)",
            boxShadow: isOpen
              ? "0 4px 20px rgba(99,102,241,0.55)"
              : "0 4px 20px rgba(59,130,246,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <Bot size={22} color="white" strokeWidth={1.75} />
          {/* Notificación */}
          {!hasBeenSeen && (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                position: "absolute", top: "2px", right: "2px",
                width: "12px", height: "12px", borderRadius: "50%",
                background: "#f59e0b", border: "2px solid white",
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}