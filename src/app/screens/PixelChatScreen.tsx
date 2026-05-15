import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { BottomNav } from "../components/BottomNav";
import { PixelCharacter } from "../components/PixelCharacter";
import { useApp } from "../context/AppContext";
import { stages } from "../data/gameData";

/* ═══════════════════════════════════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════════════════════════════════ */

interface Message {
  id: string;
  role: "user" | "pixel";
  text: string;
  mood?: "happy" | "thinking" | "celebrating" | "helping" | "neutral";
  chips?: string[];
}

/* ═══════════════════════════════════════════════════════════════════════
   BASE DE CONOCIMIENTO — usa el contenido real del curso
═══════════════════════════════════════════════════════════════════════ */

const KNOWLEDGE: Array<{
  keywords: string[];
  response: string;
  mood: Message["mood"];
}> = [
  /* ── SALUDOS ── */
  {
    keywords: ["hola", "buenas", "hey", "hi", "ola", "buenos", "saludos", "qué tal", "que tal"],
    response:
      "¡Hola! Soy Pixel, tu compañero del curso 🤖✨ Puedo ayudarte con cualquier duda: las 6 etapas, conceptos de diseño de videojuegos, costos de producción, narrativa, mecánicas… ¡Lo que necesites!",
    mood: "happy",
  },

  /* ── SOBRE PIXEL / QUÉ PUEDES HACER ── */
  {
    keywords: ["quién eres", "quien eres", "qué eres", "que eres", "qué puedes", "que puedes", "para qué sirves", "para que sirves", "ayuda"],
    response:
      "Soy Pixel, el asistente inteligente de Hyperlabgamecost. 🎮 Conozco todo el contenido del curso: las 6 etapas, sus actividades, conceptos de diseño, presupuestos y más. Pregúntame lo que quieras sobre el curso.",
    mood: "helping",
  },

  /* ── ETAPA 1 ── */
  {
    keywords: ["etapa 1", "concepto", "idea", "sinopsis", "propuesta de valor", "género", "referente", "público objetivo"],
    response:
      "La **Etapa 1: Concepto e Idea** es donde todo comienza 💡\n\nSu objetivo es definir la visión base del videojuego. Los temas clave son:\n• Género del juego\n• Público objetivo\n• Propuesta de valor\n• Problema que resuelve\n• Sinopsis breve\n• Referente o inspiración\n\n👉 Recuerda: la propuesta de valor habla de la *experiencia del jugador*, no de características técnicas.",
    mood: "thinking",
  },

  /* ── ETAPA 2 ── */
  {
    keywords: ["etapa 2", "mecánicas", "mecanicas", "game loop", "verbo", "feedback", "retroalimentación", "dificultad", "curva", "bucle"],
    response:
      "La **Etapa 2: Diseño de Mecánicas** es el corazón del juego ⚙️\n\nCubre:\n• Mecánica principal y secundarias\n• Verbos del jugador (saltar, disparar, construir…)\n• Bucle de juego (game loop)\n• Retroalimentación al jugador\n• Reglas y restricciones\n• Curva de dificultad\n\n🎮 Tip: menos mecánicas bien diseñadas es mejor que muchas mecánicas confusas.",
    mood: "thinking",
  },

  /* ── ETAPA 3 ── */
  {
    keywords: ["etapa 3", "narrativa", "historia", "personajes", "worldbuilding", "mundo", "tono", "atmósfera", "arco narrativo"],
    response:
      "La **Etapa 3: Narrativa y Mundo** construye el universo del juego 📖\n\nTemas:\n• Historia principal y arco narrativo\n• Diseño de personajes\n• Worldbuilding\n• Narrativa ambiental\n• Coherencia entre narrativa y mecánicas\n• Tono y atmósfera\n\n✍️ El mundo debe sentirse coherente: las mecánicas y la historia deben apoyarse mutuamente.",
    mood: "helping",
  },

  /* ── ETAPA 4 ── */
  {
    keywords: ["etapa 4", "equipo", "roles", "producción", "cronograma", "pipeline", "scrum", "agile", "planificación"],
    response:
      "La **Etapa 4: Equipo y Producción** organiza a las personas y el tiempo 👥\n\nEsta etapa cubre la estructura del equipo de desarrollo, los roles necesarios (programador, artista, diseñador, productor), metodologías ágiles y la planificación del cronograma de producción.",
    mood: "helping",
  },

  /* ── ETAPA 5 ── */
  {
    keywords: ["etapa 5", "presupuesto", "costos", "financiero", "finanzas", "ingresos", "gastos", "monetización", "revenue"],
    response:
      "La **Etapa 5: Presupuesto y Costos** es donde la visión se encuentra con la realidad 💰\n\nSe analizan los costos de desarrollo (salarios, herramientas, licencias), los ingresos esperados, modelos de monetización y la viabilidad financiera del proyecto.",
    mood: "thinking",
  },

  /* ── ETAPA 6 ── */
  {
    keywords: ["etapa 6", "pitch", "lanzamiento", "marketing", "distribución", "steam", "app store", "publicación"],
    response:
      "La **Etapa 6: Pitch y Lanzamiento** es la presentación final 🚀\n\nCubre cómo presentar el proyecto a inversores o publishers, la estrategia de marketing, canales de distribución (Steam, App Store, itch.io) y los pasos del lanzamiento.",
    mood: "celebrating",
  },

  /* ── PROPUESTA DE VALOR ── */
  {
    keywords: ["propuesta de valor", "valor único", "diferencial", "por qué mi juego"],
    response:
      "La **propuesta de valor** responde: ¿por qué alguien elegiría TU juego sobre los miles disponibles?\n\n✅ Buena: 'El jugador toma decisiones que afectan el destino de una civilización'\n❌ Mala: 'El juego tiene gráficos en 4K'\n\nSiempre habla desde la experiencia del jugador, no de características técnicas.",
    mood: "helping",
  },

  /* ── GDD ── */
  {
    keywords: ["gdd", "game design document", "documento", "documentación"],
    response:
      "El **GDD (Game Design Document)** es el documento central del proyecto. Contiene la visión del juego, mecánicas, narrativa, arte conceptual, referencias y plan de producción.\n\nEstudios como Nintendo o Naughty Dog documentan su concepto inicial antes de prototipar cualquier cosa. Una página bien escrita vale más que semanas de código sin dirección.",
    mood: "thinking",
  },

  /* ── INDIE ── */
  {
    keywords: ["indie", "independiente", "estudio pequeño", "solo dev"],
    response:
      "Un **videojuego indie** es desarrollado por un equipo pequeño e independiente de grandes publishers.\n\nEjemplos exitosos: Minecraft, Undertale, Stardew Valley, Hollow Knight. Todos comenzaron con una sola persona o un equipo muy pequeño con una visión clara y un presupuesto limitado.\n\n💡 La clave del indie: enfocarse en una mecánica o narrativa muy bien ejecutada.",
    mood: "happy",
  },

  /* ── QUIZ / ACTIVIDADES ── */
  {
    keywords: ["quiz", "actividad", "ejercicio", "preguntas", "nota", "puntuación", "aprobar", "pasar"],
    response:
      "Para avanzar en cada etapa necesitas:\n\n1. Completar **todas las actividades** de la etapa\n2. Obtener **60% o más** en el quiz final\n\nCada actividad tiene una explicación detallada cuando confirmas tu respuesta. Si no entiendes algo, lee esa explicación con calma. ¡Están escritas para ayudarte a entender el concepto!",
    mood: "helping",
  },

  /* ── XP / PROGRESO ── */
  {
    keywords: ["xp", "experiencia", "puntos", "progreso", "avanzar", "nivel", "logro"],
    response:
      "El sistema de XP refleja tu dominio del proceso de producción de videojuegos 🏆\n\n• Cada actividad correcta da XP\n• Completar una etapa da XP de recompensa\n• Subes de nivel cada 500 XP\n• Los logros se desbloquean por hitos especiales\n\nEl XP no es solo gamificación: indica cuánto contenido has procesado y practicado.",
    mood: "celebrating",
  },

  /* ── MECÁNICA PRINCIPAL ── */
  {
    keywords: ["mecánica principal", "verbo principal", "acción principal"],
    response:
      "La **mecánica principal** es el verbo más repetido del juego:\n• Plataformas → SALTAR\n• Shooter → DISPARAR\n• Puzzle → RESOLVER\n• RTS → GESTIONAR\n\nTodo el diseño de niveles, dificultad y sistemas gira en torno a esa mecánica base. Si no puedes describir la mecánica principal en una frase, el concepto no está listo.",
    mood: "thinking",
  },

  /* ── PÚBLICO OBJETIVO ── */
  {
    keywords: ["público objetivo", "target", "audiencia", "jugadores", "para quién"],
    response:
      "El **público objetivo** no es 'todo el mundo' 🎯\n\nCuanto más específico, más coherentes serán las decisiones de diseño:\n• ¿Edad? ¿Género? ¿Experiencia con videojuegos?\n• ¿En qué plataforma juegan?\n• ¿Qué tipo de experiencias valoran?\n\nUn RPG complejo por turnos no es para jugadores casuales de móvil. La coherencia entre juego y audiencia es fundamental.",
    mood: "helping",
  },

  /* ── PRESUPUESTO / COSTOS ── */
  {
    keywords: ["cuánto cuesta", "cuanto cuesta", "costo de desarrollo", "presupuesto videojuego", "precio", "inversión"],
    response:
      "El costo de un videojuego varía enormemente:\n\n• **Indie pequeño (1-2 personas, 6-12 meses)**: $10.000 - $50.000\n• **Indie mediano (equipo 5-10, 1-2 años)**: $100.000 - $500.000\n• **AA (equipo 20-50)**: $1M - $10M\n• **AAA (equipos enormes)**: $50M - $300M+\n\nEn este curso aprenderás a estimar el presupuesto de tu propio proyecto.",
    mood: "thinking",
  },

  /* ── HIPERLABGAMECOST / CURSO ── */
  {
    keywords: ["hyperlabgamecost", "este curso", "de qué trata", "para qué sirve el curso", "curso"],
    response:
      "**Hyperlabgamecost** es un curso interactivo para aprender a planificar y presupuestar un videojuego desde cero 🎮\n\nTiene **6 etapas** que cubren todo el proceso:\n1. Concepto e Idea\n2. Diseño de Mecánicas\n3. Narrativa y Mundo\n4. Equipo y Producción\n5. Presupuesto y Costos\n6. Pitch y Lanzamiento\n\nCada etapa tiene actividades prácticas y un quiz final.",
    mood: "celebrating",
  },

  /* ── MOTIVACIÓN / ÁNIMO ── */
  {
    keywords: ["no entiendo", "está difícil", "difícil", "no puedo", "me trabo", "confundido", "confundida", "me perdí", "me perdi"],
    response:
      "¡Tranquilo/a! El diseño de videojuegos tiene muchos conceptos pero se aprenden paso a paso 💙\n\nConsejo: cuando una actividad sea difícil, lee con calma la pregunta otra vez y busca la palabra clave. Después de responder, lee la explicación aunque hayas acertado: ahí está el valor real.\n\n¡Tú puedes! Cada duda que resuelves te hace mejor diseñador/a.",
    mood: "helping",
  },
  {
    keywords: ["gracias", "genial", "excelente", "perfecto", "muy bien", "chévere", "chevere", "buenísimo", "buenisimo"],
    response:
      "¡Con mucho gusto! Para eso estoy aquí 🤖✨ Si tienes más preguntas sobre el curso o sobre diseño de videojuegos, solo escríbeme. ¡Sigue adelante con el curso!",
    mood: "celebrating",
  },
];

/* ══════════════════════════════════════════════════════════════════════
   MOTOR DE RESPUESTAS
══════════════════════════════════════════════════════════════════════ */

function getPixelResponse(
  input: string,
  state: ReturnType<typeof useApp>["state"]
): Pick<Message, "text" | "mood" | "chips"> {
  const lower = input.toLowerCase();

  // Buscar en la base de conocimiento
  for (const entry of KNOWLEDGE) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { text: entry.response, mood: entry.mood };
    }
  }

  // Buscar en gameData dinámicamente
  for (const stage of stages) {
    if (
      lower.includes(stage.title.toLowerCase()) ||
      stage.topics.some((t) => lower.includes(t.toLowerCase()))
    ) {
      const topicsList = stage.topics.map((t) => `• ${t}`).join("\n");
      return {
        text: `**Etapa ${stage.id}: ${stage.title}**\n\n${stage.subtitle}\n\nTemas que cubre:\n${topicsList}\n\n🎯 Objetivo: ${stage.objective}`,
        mood: "thinking",
      };
    }
  }

  // Respuesta con contexto del progreso del usuario
  const completedStages = Object.entries(state.stageStatuses).filter(
    ([, s]) => s.status === "completed"
  ).length;
  const currentEntry = Object.entries(state.stageStatuses).find(
    ([, s]) => s.status === "current"
  );

  if (lower.includes("progreso") || lower.includes("cómo voy") || lower.includes("como voy") || lower.includes("dónde estoy") || lower.includes("donde estoy")) {
    const currentStage = currentEntry
      ? stages.find((s) => s.id === Number(currentEntry[0]))
      : null;
    return {
      text: `Tu progreso actual:\n\n✅ ${completedStages} etapa${completedStages !== 1 ? "s" : ""} completada${completedStages !== 1 ? "s" : ""}\n⭐ ${state.xp} XP acumulados\n🔥 Racha de ${state.streak} día${state.streak !== 1 ? "s" : ""}${currentStage ? `\n📍 Etapa actual: ${currentStage.title}` : ""}\n\n¡Sigue así! Cada etapa completada te acerca más al dominio completo del proceso.`,
      mood: completedStages >= 3 ? "celebrating" : "happy",
    };
  }

  // Fallback
  const fallbacks = [
    `Hmm, no tengo información específica sobre eso 🤔 Puedo ayudarte con las **6 etapas del curso**, conceptos de diseño de videojuegos, actividades o tu progreso. ¿Sobre qué quieres saber más?`,
    `No encontré una respuesta exacta para eso, pero puedo contarte sobre cualquiera de las **etapas del curso** o conceptos como mecánicas, narrativa, presupuestos… ¡Pregúntame con más detalle!`,
    `Esa pregunta se sale un poco de mi conocimiento sobre el curso 😅 Prueba preguntarme sobre las etapas, el diseño de mecánicas, la narrativa o el presupuesto de videojuegos.`,
  ];
  return {
    text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
    mood: "neutral",
    chips: ["¿Qué es la propuesta de valor?", "Explícame las 6 etapas", "¿Cómo es el game loop?"],
  };
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */

const WELCOME_CHIPS = [
  "¿Qué cubre la Etapa 1?",
  "¿Qué es el game loop?",
  "¿Cuánto cuesta un videojuego indie?",
  "¿Cómo voy en el curso?",
];

export function PixelChatScreen() {
  const { state } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "pixel",
      text: `¡Hola, ${state.userName || "estudiante"}! 👋 Soy **Pixel**, tu asistente del curso.\n\nPuedo responderte preguntas sobre las etapas del curso, conceptos de diseño de videojuegos, presupuestos, narrativa y más. ¿En qué puedo ayudarte hoy?`,
      mood: "happy",
      chips: WELCOME_CHIPS,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getPixelResponse(text, state);
      const pixelMsg: Message = {
        id: `p-${Date.now()}`,
        role: "pixel",
        ...response,
      };
      setMessages((prev) => [...prev, pixelMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const moodColor: Record<NonNullable<Message["mood"]>, string> = {
    happy: "#3b82f6",
    thinking: "#06b6d4",
    celebrating: "#f97316",
    helping: "#8b5cf6",
    neutral: "#64748b",
  };

  const renderText = (text: string) =>
    text.split("\n").map((line, i) => {
      // Bold con **texto**
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j}>{part}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });

  return (
    <MobileLayout noPadding>
      <div className="flex flex-col min-h-screen" style={{ background: "#f8fafc" }}>

        {/* Header */}
        <div
          className="px-5 pt-12 pb-4 flex items-center gap-3"
          style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #1a2d5a 100%)" }}
        >
          <div style={{ width: 48, height: 48, flexShrink: 0 }}>
            <PixelCharacter mood="happy" state="welcome" size={48} />
          </div>
          <div>
            <p style={{ color: "white", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.2px" }}>
              Pixel
            </p>
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 6px #22c55e",
                }}
              />
              <p style={{ color: "#94a3b8", fontSize: "12px" }}>Asistente del curso · siempre activo</p>
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Sparkles size={20} color="#f59e0b" />
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ paddingBottom: "140px" }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "pixel" && (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      marginRight: 8,
                      marginTop: 2,
                    }}
                  >
                    <PixelCharacter
                      mood={msg.mood ?? "neutral"}
                      size={32}
                    />
                  </div>
                )}

                <div style={{ maxWidth: "78%" }}>
                  <div
                    className="px-4 py-3"
                    style={{
                      borderRadius:
                        msg.role === "user"
                          ? "18px 18px 4px 18px"
                          : "4px 18px 18px 18px",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                          : "white",
                      color: msg.role === "user" ? "white" : "#1e293b",
                      fontSize: "14px",
                      lineHeight: 1.55,
                      boxShadow:
                        msg.role === "user"
                          ? "0 4px 14px rgba(59,130,246,0.35)"
                          : "0 2px 10px rgba(0,0,0,0.07)",
                      borderLeft:
                        msg.role === "pixel"
                          ? `3px solid ${moodColor[msg.mood ?? "neutral"]}`
                          : "none",
                    }}
                  >
                    {renderText(msg.text)}
                  </div>

                  {/* Quick chips */}
                  {msg.chips && msg.chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.chips.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => sendMessage(chip)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "1.5px solid #bfdbfe",
                            background: "white",
                            color: "#3b82f6",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex items-end gap-2 mb-3"
              >
                <div style={{ width: 32, height: 32, flexShrink: 0 }}>
                  <PixelCharacter mood="thinking" size={32} />
                </div>
                <div
                  className="flex items-center gap-1.5 px-4 py-3"
                  style={{
                    borderRadius: "4px 18px 18px 18px",
                    background: "white",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                    borderLeft: "3px solid #06b6d4",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#06b6d4",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div
          className="fixed left-0 right-0"
          style={{
            bottom: "60px",
            maxWidth: "430px",
            margin: "0 auto",
            background: "white",
            borderTop: "1px solid #e2e8f0",
            padding: "10px 16px",
            zIndex: 100,
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale algo a Pixel…"
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "24px",
                border: "1.5px solid #e2e8f0",
                fontSize: "14px",
                outline: "none",
                background: "#f8fafc",
                color: "#1e293b",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: input.trim() && !isTyping
                  ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                  : "#e2e8f0",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <Send size={18} color={input.trim() && !isTyping ? "white" : "#94a3b8"} />
            </button>
          </form>
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
}
