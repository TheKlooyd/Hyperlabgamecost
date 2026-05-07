import type { Stage } from "../data/gameData";

type IllustrationProfileId = "concept" | "scope" | "team" | "budget" | "risk" | "pitch";

interface IllustrationProfile {
  id: IllustrationProfileId;
  label: string;
  keywords: string[];
  fallbackTags: string[];
}

const ILLUSTRATION_PROFILES: IllustrationProfile[] = [
  {
    id: "concept",
    label: "Concepto claro",
    keywords: ["idea", "genero", "mecanica", "sinopsis", "propuesta", "publico", "referente", "valor"],
    fallbackTags: ["vision", "diseno"],
  },
  {
    id: "scope",
    label: "Alcance viable",
    keywords: ["alcance", "scope", "niveles", "pantallas", "personajes", "desarrollo", "tiempo", "viable"],
    fallbackTags: ["tamano", "plan"],
  },
  {
    id: "team",
    label: "Equipo y roles",
    keywords: ["equipo", "rol", "roles", "outsourcing", "programador", "artista", "disenador", "musico", "herramientas"],
    fallbackTags: ["talento", "recursos"],
  },
  {
    id: "budget",
    label: "Costo estimado",
    keywords: ["presupuesto", "costo", "costos", "gasto", "gastos", "steam", "sprites", "qa", "fijo", "variable"],
    fallbackTags: ["dinero", "prioridad"],
  },
  {
    id: "risk",
    label: "Riesgo y control",
    keywords: ["riesgo", "contingencia", "margen", "viable financieramente", "reducir", "equilibrada", "analisis"],
    fallbackTags: ["reserva", "control"],
  },
  {
    id: "pitch",
    label: "Pitch financiero",
    keywords: ["pitch", "inversion", "inversion de", "evaluador", "credibilidad", "justificar", "presenta", "argumentos"],
    fallbackTags: ["defensa", "valor"],
  },
];

const PROFILE_BY_ID = Object.fromEntries(
  ILLUSTRATION_PROFILES.map(profile => [profile.id, profile]),
) as Record<IllustrationProfileId, IllustrationProfile>;

const STAGE_PROFILE_FALLBACK: Record<number, IllustrationProfileId> = {
  1: "concept",
  2: "scope",
  3: "team",
  4: "budget",
  5: "risk",
  6: "pitch",
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function clipText(value: string, maxLength: number) {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 3).trim()}...`;
}

function wrapText(value: string, maxLength: number, maxLines = 2) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxLength) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;

    if (lines.length === maxLines) {
      break;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (lines.length === maxLines && words.length > lines.join(" ").split(/\s+/).filter(Boolean).length) {
    lines[maxLines - 1] = clipText(lines[maxLines - 1], maxLength);
  }

  return lines;
}

function hexToRgb(hexColor: string) {
  const normalized = hexColor.replace("#", "");
  const expanded = normalized.length === 3
    ? normalized.split("").map(char => `${char}${char}`).join("")
    : normalized;

  if (!/^[\da-fA-F]{6}$/.test(expanded)) {
    return { r: 59, g: 130, b: 246 };
  }

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function rgba(hexColor: string, alpha: number) {
  const { r, g, b } = hexToRgb(hexColor);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function resolveProfile(questionText: string, stageId: number) {
  const normalizedQuestion = normalizeText(questionText);
  const matchedProfile = ILLUSTRATION_PROFILES.find(profile => (
    profile.keywords.some(keyword => normalizedQuestion.includes(normalizeText(keyword)))
  ));

  return matchedProfile ?? PROFILE_BY_ID[STAGE_PROFILE_FALLBACK[stageId] ?? "concept"];
}

function uniqueTexts(values: string[]) {
  const seen = new Set<string>();

  return values.filter(value => {
    const normalized = normalizeText(value);
    if (seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}

function resolveTags(questionText: string, stageTitle: string, profile: IllustrationProfile) {
  const normalizedQuestion = normalizeText(questionText);
  const matchedKeywords = profile.keywords.filter(keyword => (
    normalizedQuestion.includes(normalizeText(keyword))
  ));

  return uniqueTexts([
    stageTitle,
    ...matchedKeywords,
    ...profile.fallbackTags,
  ])
    .map(tag => clipText(tag, 14))
    .slice(0, 3);
}

function renderIcon(profileId: IllustrationProfileId, accentColor: string) {
  switch (profileId) {
    case "concept":
      return `
        <g>
          <path d="M78 55C67.507 55 59 63.507 59 74C59 81.655 63.68 86.548 67.12 90.143C68.84 91.94 70 94.073 70 96.56H86C86 94.073 87.16 91.94 88.88 90.143C92.32 86.548 97 81.655 97 74C97 63.507 88.493 55 78 55Z" fill="#ffffff" stroke="${accentColor}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M71 104H85" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <path d="M73 110H83" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <path d="M78 47V41" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <path d="M98 54L102 50" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <path d="M58 54L54 50" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    case "scope":
      return `
        <g>
          <rect x="54" y="56" width="48" height="18" rx="8" fill="#ffffff" stroke="${accentColor}" stroke-width="4"/>
          <rect x="46" y="78" width="64" height="18" rx="8" fill="#ffffff" stroke="${accentColor}" stroke-width="4"/>
          <rect x="60" y="100" width="36" height="18" rx="8" fill="#ffffff" stroke="${accentColor}" stroke-width="4"/>
          <path d="M112 68H120" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <path d="M116 64L120 68L116 72" stroke="${accentColor}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </g>`;
    case "team":
      return `
        <g>
          <circle cx="63" cy="70" r="10" fill="#ffffff" stroke="${accentColor}" stroke-width="4"/>
          <circle cx="92" cy="70" r="10" fill="#ffffff" stroke="${accentColor}" stroke-width="4"/>
          <circle cx="78" cy="58" r="11" fill="#ffffff" stroke="${accentColor}" stroke-width="4"/>
          <path d="M52 99C52 90.163 59.163 83 68 83H88C96.837 83 104 90.163 104 99V102H52V99Z" fill="#ffffff" stroke="${accentColor}" stroke-width="4" stroke-linejoin="round"/>
        </g>`;
    case "budget":
      return `
        <g>
          <rect x="52" y="92" width="12" height="22" rx="4" fill="${accentColor}"/>
          <rect x="70" y="78" width="12" height="36" rx="4" fill="${accentColor}" opacity="0.8"/>
          <rect x="88" y="62" width="12" height="52" rx="4" fill="${accentColor}" opacity="0.65"/>
          <circle cx="62" cy="60" r="12" fill="#ffffff" stroke="${accentColor}" stroke-width="4"/>
          <path d="M62 53V67" stroke="${accentColor}" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M57 57H65C67.209 57 69 58.791 69 61C69 63.209 67.209 65 65 65H59" stroke="${accentColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>`;
    case "risk":
      return `
        <g>
          <path d="M78 50L102 60V80C102 94 92.4 106.4 78 110C63.6 106.4 54 94 54 80V60L78 50Z" fill="#ffffff" stroke="${accentColor}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M78 66V83" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <circle cx="78" cy="92" r="3.5" fill="${accentColor}"/>
        </g>`;
    case "pitch":
      return `
        <g>
          <rect x="48" y="54" width="60" height="40" rx="8" fill="#ffffff" stroke="${accentColor}" stroke-width="4"/>
          <path d="M78 94V108" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <path d="M66 108H90" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <path d="M58 67H98" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <path d="M58 79H86" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <circle cx="108" cy="104" r="6" fill="#ffffff" stroke="${accentColor}" stroke-width="4"/>
          <path d="M108 110V120" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <path d="M102 120H114" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
        </g>`;
  }
}

export function getQuestionIllustration(
  questionText: string,
  stage: Pick<Stage, "id" | "title" | "color" | "bgColor">,
) {
  const cleanedQuestion = questionText.replace(/[¿?]/g, "").trim();
  const profile = resolveProfile(cleanedQuestion, stage.id);
  const questionLines = wrapText(cleanedQuestion, 34, 2);
  const tags = resolveTags(cleanedQuestion, stage.title, profile);
  const chipLayout = [
    { x: 40, width: 108 },
    { x: 164, width: 112 },
    { x: 292, width: 108 },
  ];

  const chips = tags.map((tag, index) => {
    const layout = chipLayout[index];
    return `
      <rect x="${layout.x}" y="156" width="${layout.width}" height="30" rx="15" fill="#ffffff" fill-opacity="0.92" stroke="${rgba(stage.color, 0.2)}"/>
      <text x="${layout.x + (layout.width / 2)}" y="175" fill="#334155" font-size="12" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle">${escapeXml(tag.toUpperCase())}</text>`;
  }).join("");

  const svg = `
    <svg width="440" height="220" viewBox="0 0 440 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="background" x1="18" y1="12" x2="422" y2="208" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${stage.bgColor}" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
        <linearGradient id="accent-surface" x1="40" y1="42" x2="116" y2="118" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${rgba(stage.color, 0.18)}" />
          <stop offset="100%" stop-color="${rgba(stage.color, 0.05)}" />
        </linearGradient>
      </defs>
      <rect width="440" height="220" rx="28" fill="url(#background)" />
      <circle cx="390" cy="40" r="76" fill="${rgba(stage.color, 0.08)}" />
      <circle cx="44" cy="192" r="52" fill="${rgba(stage.color, 0.08)}" />
      <rect x="24" y="24" width="392" height="172" rx="26" fill="#ffffff" fill-opacity="0.9" />
      <rect x="40" y="42" width="76" height="84" rx="22" fill="url(#accent-surface)" stroke="${rgba(stage.color, 0.12)}" />
      ${renderIcon(profile.id, stage.color)}
      <text x="134" y="58" fill="${stage.color}" font-size="12" font-family="Arial, sans-serif" font-weight="700" letter-spacing="1">${escapeXml(clipText(stage.title.toUpperCase(), 24))}</text>
      <text x="134" y="88" fill="#0f172a" font-size="23" font-family="Arial, sans-serif" font-weight="700">${escapeXml(profile.label)}</text>
      <text x="134" y="116" fill="#334155" font-size="14" font-family="Arial, sans-serif" font-weight="500">${escapeXml(questionLines[0] ?? "")}</text>
      <text x="134" y="136" fill="#334155" font-size="14" font-family="Arial, sans-serif" font-weight="500">${escapeXml(questionLines[1] ?? "")}</text>
      ${chips}
    </svg>`;

  return {
    src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    alt: `Ilustracion relacionada con la pregunta sobre ${profile.label.toLowerCase()}`,
  };
}