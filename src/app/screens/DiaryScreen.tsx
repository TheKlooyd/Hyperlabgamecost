import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Plus, Trash2, X, PenLine, ChevronDown, ChevronUp } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { BottomNav } from "../components/BottomNav";
import { playClick, playNavigate } from "../utils/sounds";

/* ─── Week Calendar ──────────────────────────────────────────────────────── */
const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function getWeekDays(today: Date): Date[] {
  // Monday-based week
  const dow = today.getDay(); // 0=Sun … 6=Sat
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function WeekCalendar() {
  const today = new Date();
  const weekDays = getWeekDays(today);
  const monthLabel = today.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  const capitalMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <div
      className="mx-5 mt-4 mb-2 rounded-2xl"
      style={{
        background: "white",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: "14px 12px 12px",
      }}
    >
      {/* Month & year */}
      <p
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "13px",
          color: "#0f172a",
          marginBottom: "10px",
          letterSpacing: "0.2px",
        }}
      >
        {capitalMonth}
      </p>

      {/* Day columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {/* Day letter headers */}
        {DAY_LABELS.map((label, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: 600,
              color: "#94a3b8",
              paddingBottom: "4px",
            }}
          >
            {label}
          </div>
        ))}

        {/* Date numbers */}
        {weekDays.map((d, i) => {
          const isToday =
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isToday ? "#6366f1" : "transparent",
                  color: isToday ? "white" : "#0f172a",
                  fontSize: "13px",
                  fontWeight: isToday ? 700 : 500,
                }}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface DiaryEntry {
  id: string;
  title: string;
  text: string;
  createdAt: string; // ISO string
}

const STORAGE_KEY = "vgp-diary-entries";

function loadEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DiaryEntry[];
  } catch {
    // ignore
  }
  return [];
}

function saveEntries(entries: DiaryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

/* ─── Accent color palette for cards ─────────────────────────────────────── */
const CARD_ACCENTS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#6366f1", // indigo
];

function accentForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  return CARD_ACCENTS[Math.abs(hash) % CARD_ACCENTS.length];
}

/* ═══════════════════════════════════════════════════════════════════════════
   DIARY SCREEN
═══════════════════════════════════════════════════════════════════════════ */
export function DiaryScreen() {
  const [entries, setEntries] = useState<DiaryEntry[]>(loadEntries);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const handleAdd = () => {
    const trimTitle = newTitle.trim();
    const trimText = newText.trim();
    if (!trimText) return;
    const entry: DiaryEntry = {
      id: Date.now().toString(),
      title: trimTitle || "Entrada sin título",
      text: trimText,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
    setNewTitle("");
    setNewText("");
    setShowForm(false);
    playNavigate();
  };

  const handleDelete = (id: string) => {
    playClick();
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <MobileLayout noPadding>
      <div className="flex flex-col min-h-screen" style={{ background: "#f8fafc" }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 pt-12 pb-4"
          style={{ background: "white", borderBottom: "1px solid #e2e8f0" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="rounded-xl flex items-center justify-center"
              style={{ width: 36, height: 36, background: "#fef3c7" }}
            >
              <BookOpen size={20} color="#f59e0b" strokeWidth={2} />
            </div>
            <div>
              <h1 style={{ color: "#0f172a", fontSize: "17px", fontWeight: 700, lineHeight: 1.1 }}>
                Diario del viaje
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "11px" }}>
                {entries.length} {entries.length === 1 ? "entrada" : "entradas"}
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => { playClick(); setShowForm((v) => !v); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{
              background: showForm ? "#fee2e2" : "#fef3c7",
              color: showForm ? "#ef4444" : "#f59e0b",
              fontWeight: 700,
              fontSize: "13px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancelar" : "Nueva nota"}
          </motion.button>
        </div>

        {/* ── Week calendar ─────────────────────────────────────────────────── */}
        <WeekCalendar />

        {/* ── New entry form ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="px-5 py-4 flex flex-col gap-3"
                style={{
                  background: "white",
                  borderBottom: "2px solid #fbbf24",
                }}
              >
                <div className="flex items-center gap-2">
                  <PenLine size={16} color="#f59e0b" />
                  <span style={{ color: "#0f172a", fontSize: "13px", fontWeight: 700 }}>
                    Nueva entrada
                  </span>
                </div>

                {/* Title input */}
                <input
                  type="text"
                  placeholder="Título (opcional)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={60}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "14px",
                    color: "#0f172a",
                    background: "#f8fafc",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />

                {/* Text area */}
                <textarea
                  ref={textareaRef}
                  placeholder="Escribe tu observación aquí..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "14px",
                    color: "#0f172a",
                    background: "#f8fafc",
                    outline: "none",
                    resize: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                    boxSizing: "border-box",
                  }}
                />
                <div className="flex items-center justify-between">
                  <span style={{ color: "#cbd5e1", fontSize: "11px" }}>
                    {newText.length}/1000
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    disabled={!newText.trim()}
                    style={{
                      background: newText.trim() ? "#f59e0b" : "#e2e8f0",
                      color: newText.trim() ? "white" : "#94a3b8",
                      border: "none",
                      borderRadius: "12px",
                      padding: "10px 20px",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: newText.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    Guardar entrada
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Entries list ──────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 flex flex-col gap-3">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 pt-16 gap-3">
              <div
                className="rounded-3xl flex items-center justify-center"
                style={{ width: 80, height: 80, background: "#fef3c7" }}
              >
                <BookOpen size={38} color="#f59e0b" strokeWidth={1.5} />
              </div>
              <p style={{ color: "#0f172a", fontSize: "16px", fontWeight: 700, textAlign: "center" }}>
                Tu diario está vacío
              </p>
              <p style={{ color: "#94a3b8", fontSize: "13px", textAlign: "center", lineHeight: 1.6, maxWidth: "240px" }}>
                Comienza anotando tus primeras observaciones del viaje con el botón "Nueva nota".
              </p>
            </div>
          ) : (
            <>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.6px",
                  marginBottom: "4px",
                }}
              >
                MIS NOTAS
              </p>
              <AnimatePresence initial={false}>
                {entries.map((entry, index) => {
                  const accent = accentForId(entry.id);
                  const isExpanded = expandedId === entry.id;
                  const isLong = entry.text.length > 120;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: "white",
                        border: `1.5px solid ${accent}25`,
                        boxShadow: `0 2px 8px ${accent}12`,
                      }}
                    >
                      {/* Color accent stripe */}
                      <div style={{ height: 4, background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />

                      <div className="p-4">
                        {/* Top row: title + delete */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p
                            style={{
                              color: "#0f172a",
                              fontSize: "14px",
                              fontWeight: 700,
                              lineHeight: 1.3,
                              flex: 1,
                            }}
                          >
                            {entry.title}
                          </p>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="flex-shrink-0 rounded-lg flex items-center justify-center"
                            style={{
                              width: 30,
                              height: 30,
                              background: "#fee2e2",
                              color: "#ef4444",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Date & time */}
                        <p style={{ color: "#94a3b8", fontSize: "11px", marginBottom: "8px" }}>
                          {formatDate(entry.createdAt)} · {formatTime(entry.createdAt)}
                        </p>

                        {/* Text content */}
                        <p
                          style={{
                            color: "#475569",
                            fontSize: "13px",
                            lineHeight: 1.65,
                            whiteSpace: "pre-wrap",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: isExpanded ? undefined : 3,
                          }}
                        >
                          {entry.text}
                        </p>

                        {/* Expand/collapse */}
                        {isLong && (
                          <button
                            onClick={() => toggleExpand(entry.id)}
                            className="flex items-center gap-1 mt-2"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: accent,
                              fontSize: "12px",
                              fontWeight: 600,
                              padding: 0,
                            }}
                          >
                            {isExpanded ? (
                              <>Ver menos <ChevronUp size={13} /></>
                            ) : (
                              <>Ver más <ChevronDown size={13} /></>
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </>
          )}
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
}
