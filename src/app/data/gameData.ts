export type ActivityType =
  | "multiple-choice"
  | "order-steps"
  | "fill-blank"
  | "reflection"
  | "true-false"
  | "connect-concepts"
  | "word-scramble"
  | "crossword";

export interface ActivityOption {
  id: string;
  text: string;
}

export interface ConceptPair {
  left: string;
  right: string;
}

export interface CrosswordWord {
  number: number;
  direction: "across" | "down";
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export interface CrosswordData {
  rows: number;
  cols: number;
  words: CrosswordWord[];
}

export interface StageIntro {
  summary: string;
  keyPoints: string[];
  realWorldContext: string;
  pixelTip: string;
  estimatedMinutes: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  question: string;
  options?: ActivityOption[];
  correctAnswer?: number;
  items?: string[];
  correctOrder?: number[];
  placeholder?: string;
  explanation: string;
  hint: string;
  xp: number;
  // true-false
  isTrue?: boolean;
  // connect-concepts
  pairs?: ConceptPair[];
  // word-scramble
  word?: string;
  wordClue?: string;
  // crossword
  crossword?: CrosswordData;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  objective: string;
  topics: string[];
  xpReward: number;
  intro: StageIntro;
  activities: Activity[];
  quiz: QuizQuestion[];
}

export const stages: Stage[] = [
  // ═══════════════════════════════════════════════════════
  // ETAPA 1 — CONCEPTO E IDEA (NO MODIFICAR)
  // ═══════════════════════════════════════════════════════
  {
    id: 1,
    title: "Concepto e Idea",
    subtitle: "Define la visión base de tu videojuego",
    icon: "lightbulb",
    color: "#3b82f6",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    objective: "Definir la visión base del videojuego y comunicar su esencia de forma clara y convincente.",
    topics: [
      "Género del juego",
      "Público objetivo",
      "Propuesta de valor",
      "Problema que resuelve",
      "Sinopsis breve",
      "Referente o inspiración"
    ],
    xpReward: 150,
    intro: {
      summary: "Toda obra comienza con una idea. En el diseño de videojuegos, transformar esa chispa inicial en un concepto sólido y comunicable es el primer paso antes de escribir código o dibujar un pixel. Esta etapa te enseña a estructurar y articular la visión central de tu juego.",
      keyPoints: [
        "El género define las mecánicas base: RPG, plataformas, estrategia, puzzle. Elegirlo bien orienta todas las decisiones de diseño.",
        "El público objetivo no es 'todo el mundo'. Cuanto más específico, más coherentes serán tus decisiones de diseño y marketing.",
        "La propuesta de valor responde: ¿por qué alguien elegiría TU juego sobre los miles disponibles? Es el 'por qué jugar esto'.",
        "Un buen referente (juego similar) ahorra tiempo, aclara expectativas y sirve como estándar de calidad alcanzable.",
      ],
      realWorldContext: "Estudios como Nintendo o Naughty Dog documentan su concepto inicial en un GDD (Game Design Document) antes de prototipar. The Legend of Zelda fue descrito originalmente como 'un juego que simula un mundo en miniatura donde los jugadores pueden explorar con libertad'. Una frase. Eso es todo lo que necesitas para empezar.",
      pixelTip: "Cuando respondas preguntas sobre concepto, piensa siempre desde la perspectiva del jugador. La pregunta clave no es '¿qué tiene el juego?' sino '¿qué siente y hace el jugador?'. Las características técnicas no son propuesta de valor.",
      estimatedMinutes: 12,
    },
    activities: [
      {
        id: "1-1",
        type: "multiple-choice",
        title: "La propuesta de valor",
        question: "¿Cuál enunciado describe mejor una propuesta de valor para un videojuego?",
        options: [
          { id: "a", text: "El juego tiene gráficos en 3D de alta resolución" },
          { id: "b", text: "El juego permite que el jugador tome decisiones que afectan el destino de una civilización completa" },
          { id: "c", text: "El juego tiene muchos niveles y personajes jugables" },
          { id: "d", text: "El juego funciona en múltiples plataformas" }
        ],
        correctAnswer: 1,
        explanation: "Una propuesta de valor describe la experiencia única que ofrece el juego al jugador. La mecánica de decisiones narrativas es un diferenciador significativo que apela directamente a la emoción y agencia del jugador.",
        hint: "Piensa en qué hace ÚNICO a este juego desde la perspectiva del jugador, no en sus características técnicas o de producción.",
        xp: 30
      },
      {
        id: "1-2",
        type: "multiple-choice",
        title: "Identificando al público",
        question: "Si tu videojuego es un RPG de estrategia por turnos con narrativa compleja, ¿qué público objetivo sería más coherente?",
        options: [
          { id: "a", text: "Niños de 5 a 8 años que prefieren juegos de colores y movimiento" },
          { id: "b", text: "Jóvenes adultos de 18-30 años con experiencia en RPGs y gusto por narrativa profunda" },
          { id: "c", text: "Adultos mayores de 65 años sin experiencia previa en videojuegos" },
          { id: "d", text: "Jugadores casuales que prefieren sesiones de 2-3 minutos en móvil" }
        ],
        correctAnswer: 1,
        explanation: "El público debe coincidir con el tipo de experiencia que ofrece el juego. Un RPG complejo por turnos requiere atención sostenida, paciencia y familiaridad con las convenciones del género.",
        hint: "Considera la complejidad del sistema de juego y el tiempo de atención que requiere cada sesión.",
        xp: 30
      },
      {
        id: "1-3",
        type: "order-steps",
        title: "Proceso de ideación",
        question: "Ordena estos pasos para definir correctamente la idea principal de un videojuego. Toca cada elemento en el orden correcto:",
        items: [
          "Identificar la emoción que quieres provocar",
          "Identificar al jugador ideal",
          "Investigar referentes y juegos similares",
          "Definir el género y mecánica central",
          "Escribir la sinopsis en una sola frase"
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: "El proceso creativo parte de la emoción buscada, luego define al jugador ideal, investiga referentes del género, construye mecánicas coherentes y finalmente sintetiza todo en una idea clara.",
        hint: "Empieza por el 'por qué' emocional antes de pasar al 'cómo' técnico. El jugador ideal viene antes que las mecánicas.",
        xp: 40
      },
      {
        id: "1-4",
        type: "reflection",
        title: "Define tu sinopsis",
        question: "Escribe una sinopsis de una sola frase para un videojuego. Debe comunicar: quién es el protagonista, cuál es el conflicto central y qué hace especial la experiencia.",
        placeholder: "Ejemplo: 'Un arqueólogo robot que debe reconstruir su memoria perdida resolviendo acertijos ambientales en ruinas del futuro...'",
        explanation: "Una buena sinopsis captura la esencia en menos de 40 palabras: el protagonista, el conflicto y el 'gancho' que hace al juego irresistible. Es la base de todo el pitch.",
        hint: "Sigue la estructura: [Protagonista] que debe [conflicto] en un mundo donde [contexto único].",
        xp: 50
      },
      {
        id: "1-5",
        type: "connect-concepts",
        title: "Géneros y sus mecánicas",
        question: "Conecta cada género de videojuego con su descripción de mecánica central. Toca un género y luego su descripción correspondiente.",
        pairs: [
          { left: "RPG", right: "Progresión de personaje con estadísticas, habilidades y narrativa profunda" },
          { left: "Plataformas", right: "Saltar y sortear obstáculos en niveles con scroll lateral o vertical" },
          { left: "Estrategia", right: "Gestionar recursos y tomar decisiones tácticas con visión global" },
          { left: "Puzzle", right: "Resolver acertijos lógicos o de pensamiento espacial para avanzar" },
        ],
        explanation: "Conocer las mecánicas centrales de cada género es fundamental para elegir el correcto para tu idea. El género no es solo una etiqueta: define cómo el jugador interactúa con el sistema en cada momento del juego.",
        hint: "Piensa en el verbo principal de cada género: en RPG 'progresas', en plataformas 'saltas', en estrategia 'gestionas', en puzzle 'resuelves'.",
        xp: 40,
      },
      {
        id: "1-6",
        type: "true-false",
        title: "Propuesta de valor",
        question: "Determina si el siguiente enunciado es verdadero o falso:",
        isTrue: false,
        explanation: "La propuesta de valor describe la experiencia emocional y la ventaja diferencial del juego, no sus especificaciones técnicas. 'Gráficos en 4K' no es propuesta de valor. 'El jugador toma decisiones que determinan el destino de civilizaciones enteras' sí lo es, porque habla de la experiencia del jugador.",
        hint: "La propuesta de valor siempre habla de la EXPERIENCIA del jugador, no de las características técnicas del producto.",
        xp: 25,
      },
      {
        id: "1-7",
        type: "crossword",
        title: "Crucigrama del concepto",
        question: "Completa el crucigrama con los términos del diseño de concepto. Toca una pista para seleccionarla y escribe la respuesta.",
        crossword: {
          rows: 7,
          cols: 5,
          words: [
            {
              number: 1,
              direction: "down",
              clue: "Grupo de personas a quien va dirigido el videojuego",
              answer: "PUBLICO",
              row: 0,
              col: 1,
            },
            {
              number: 2,
              direction: "across",
              clue: "Documento narrativo con historia y diálogos del juego",
              answer: "GUION",
              row: 1,
              col: 0,
            },
            {
              number: 3,
              direction: "down",
              clue: "Producción con equipo pequeño e independiente de grandes estudios",
              answer: "INDIE",
              row: 1,
              col: 2,
            },
          ],
        },
        explanation: "El PUBLICO objetivo, el GUION narrativo y el tipo de producción INDIE son conceptos fundamentales en la etapa de concepto. Cada uno condiciona las decisiones de diseño y presupuesto del proyecto.",
        hint: "PUBLICO tiene 7 letras (vertical), GUION tiene 5 letras (horizontal) e INDIE tiene 5 letras (vertical). La U de PUBLICO y la U de GUION se cruzan.",
        xp: 50,
      },
    ],
    quiz: [
      {
        id: "q1-1",
        question: "¿Qué es el género de un videojuego?",
        options: [
          "El estilo artístico y paleta de colores utilizados",
          "La categoría que agrupa juegos con mecánicas y estructuras de interacción similares",
          "La plataforma técnica en la que se publica el juego",
          "El número de jugadores que puede soportar simultáneamente"
        ],
        correctAnswer: 1,
        explanation: "El género define la familia de mecánicas: RPG, plataformas, estrategia, etc. No se refiere al arte ni a aspectos técnicos o de distribución."
      },
      {
        id: "q1-2",
        question: "¿Cuál es la diferencia entre el tema y la mecánica de un videojuego?",
        options: [
          "No hay diferencia, son sinónimos en diseño de juegos",
          "El tema es el escenario narrativo; la mecánica es cómo el jugador interactúa con el sistema",
          "La mecánica es el arte visual; el tema es la jugabilidad en sí",
          "El tema es el tutorial introductorio; la mecánica es el menú principal"
        ],
        correctAnswer: 1,
        explanation: "Un juego de 'zombis' (tema) puede ser un FPS, estrategia por turnos o puzzle (mecánicas). Son capas independientes pero complementarias que deben cohesionarse."
      },
      {
        id: "q1-3",
        question: "¿Para qué sirve tener un referente o juego de inspiración en la etapa de concepto?",
        options: [
          "Para copiar exactamente ese juego y adaptarlo a una nueva historia",
          "Para tener algo que citar formalmente en la presentación final del proyecto",
          "Para entender convenciones del género, posibilidades técnicas y estándares de calidad",
          "No sirve de nada; cada juego debe ser completamente original desde cero"
        ],
        correctAnswer: 2,
        explanation: "Estudiar referentes permite entender las convenciones del género, identificar oportunidades de diferenciación y establecer un estándar de calidad alcanzable y comparable."
      },
      {
        id: "q1-4",
        question: "¿Qué hace efectiva a una sinopsis de videojuego?",
        options: [
          "Que sea lo más larga posible con todos los detalles técnicos y de producción",
          "Que mencione todas las mecánicas disponibles y los niveles que tendrá el juego",
          "Que comunique en pocas palabras la experiencia central y por qué alguien querría jugarla",
          "Que incluya el precio de venta y las plataformas de lanzamiento previstas"
        ],
        correctAnswer: 2,
        explanation: "Una buena sinopsis captura la esencia del juego: protagonista, conflicto y el 'gancho' que define la experiencia diferencial. Es concisa, evocadora y convincente."
      },
      {
        id: "q1-5",
        question: "¿Qué significa el 'problema que resuelve' un videojuego en términos de diseño?",
        options: [
          "Un bug o error técnico que el equipo de programación debe corregir",
          "La necesidad emocional, social o de entretenimiento que satisface en su audiencia objetivo",
          "El algoritmo matemático que gestiona la física y las colisiones del juego",
          "El presupuesto total necesario para terminar el desarrollo del proyecto"
        ],
        correctAnswer: 1,
        explanation: "Todo producto, incluido un videojuego, responde a una necesidad humana: escapar, socializar, competir, explorar o aprender. Identificarla alinea el diseño con el usuario real."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // ETAPA 2 — ALCANCE DEL PROYECTO
  // ═══════════════════════════════════════════════════════
  {
    id: 2,
    title: "Alcance del Proyecto",
    subtitle: "Define qué tan grande será tu videojuego y su impacto en el costo",
    icon: "maximize",
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
    objective: "Comprender cómo el alcance del proyecto determina el presupuesto, los recursos necesarios y la viabilidad del desarrollo.",
    topics: [
      "Alcance pequeño, medio y grande",
      "Duración estimada del proyecto",
      "Cantidad de niveles y contenido",
      "Complejidad técnica y de arte",
      "Relación entre alcance y costo",
      "Decisiones que encarecen la producción"
    ],
    xpReward: 175,
    intro: {
      summary: "Definir el alcance es decidir exactamente qué se va a construir y —igual de importante— qué NO se va a construir. Es la diferencia entre un proyecto que se termina y uno que nunca ve la luz. El alcance determina el presupuesto, el tiempo y el equipo necesario.",
      keyPoints: [
        "Más contenido no es mejor: cada característica adicional suma costo, tiempo y complejidad de mantenimiento.",
        "El 'scope creep' (expansión no controlada del proyecto) es la causa número uno de proyectos abandonados en desarrollo de videojuegos.",
        "Un prototipo pequeño y bien ejecutado vale más que un concepto enorme incompleto. Enfoque sobre ambición.",
        "Cada decisión de diseño tiene impacto directo en el presupuesto: pasar de 2D a 3D puede multiplicar el costo por 10.",
      ],
      realWorldContext: "Minecraft comenzó como un juego de un solo jugador con bloques básicos. No Man's Sky prometió un universo infinito y lanzó con características incompletas, generando una crisis de reputación enorme. El alcance realista no limita la creatividad; la enfoca. Los juegos más exitosos de estudios pequeños son los más enfocados.",
      pixelTip: "Al evaluar preguntas de alcance, hazte siempre esta pregunta: ¿puede un equipo pequeño construir esto en el tiempo disponible con los recursos descritos? Si hay duda, el alcance es demasiado grande.",
      estimatedMinutes: 15,
    },
    activities: [
      {
        id: "2-1",
        type: "multiple-choice",
        title: "¿Qué define el alcance?",
        question: "Un equipo indie con 3 personas y 4 meses de desarrollo quiere hacer un juego. ¿Cuál de estas decisiones hace el proyecto MÁS costoso e inviable?",
        options: [
          { id: "a", text: "Hacer un juego 2D con 5 niveles y mecánica principal de plataformas" },
          { id: "b", text: "Hacer un RPG de mundo abierto en 3D con 30 horas de contenido y voces en varios idiomas" },
          { id: "c", text: "Hacer un puzzle con 10 niveles y arte en pixel art" },
          { id: "d", text: "Hacer un juego de un solo nivel con mecánica de rompecabezas simple" }
        ],
        correctAnswer: 1,
        explanation: "Un RPG de mundo abierto en 3D con 30 horas de contenido requiere decenas de profesionales, años de producción y presupuestos de millones. Para 3 personas en 4 meses, es completamente inviable. El alcance debe ajustarse a los recursos reales disponibles.",
        hint: "Piensa en cuántos recursos (personas, tiempo, dinero) requiere cada opción. ¿Cuál es claramente desproporcionada?",
        xp: 35
      },
      {
        id: "2-2",
        type: "multiple-choice",
        title: "Decisiones que encarecen",
        question: "¿Cuál de estas características añade MÁS costo al presupuesto de un videojuego indie?",
        options: [
          { id: "a", text: "Usar música gratuita con licencia Creative Commons" },
          { id: "b", text: "Usar sprites 2D hechos por un miembro del equipo" },
          { id: "c", text: "Agregar doblaje de voz profesional en 3 idiomas distintos" },
          { id: "d", text: "Usar un motor gratuito como Godot o Unity Community" }
        ],
        correctAnswer: 2,
        explanation: "El doblaje profesional en múltiples idiomas implica contratar actores de voz nativos, un estudio de grabación y producción de audio. Puede costar desde $5,000 hasta $50,000+ dependiendo del volumen de diálogos. Las otras opciones son formas inteligentes de reducir costos.",
        hint: "¿Cuál de estas opciones requiere contratar profesionales externos y pagar por tiempo de estudio o licencias costosas?",
        xp: 35
      },
      {
        id: "2-3",
        type: "order-steps",
        title: "Clasificando el alcance",
        question: "Ordena estas características de videojuego de MENOR a MAYOR impacto en el presupuesto de producción:",
        items: [
          "1 nivel, mecánica simple, sin audio, arte básico",
          "5 niveles, mecánica central, efectos de sonido, pixel art propio",
          "15 niveles, 2 mecánicas, música original, arte 2D ilustrado",
          "Mundo abierto 3D, mecánicas complejas, banda sonora completa, cinemáticas"
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: "El costo crece exponencialmente con la complejidad. Un juego simple puede desarrollarse con $0 adicionales; un juego de mundo abierto 3D puede costar millones. Elegir el alcance correcto es la decisión financiera más importante del proyecto.",
        hint: "Piensa en cuántos recursos humanos, herramientas y tiempo requiere cada nivel de complejidad. De menos a más.",
        xp: 40
      },
      {
        id: "2-4",
        type: "reflection",
        title: "Define el alcance de tu proyecto",
        question: "Describe el alcance de tu videojuego respondiendo: ¿cuántos niveles o pantallas tendrá?, ¿qué tan compleja es la mecánica principal?, ¿usarás arte propio o gratuito?, ¿cuánto tiempo de desarrollo estimas necesitar?",
        placeholder: "Ejemplo: 'Mi juego tendrá 8 niveles con una mecánica de plataformas. El arte será pixel art hecho por un integrante del equipo. Estimamos 3 meses con un equipo de 2 personas...'",
        explanation: "Definir el alcance desde el inicio es la base de cualquier presupuesto real. Sin claridad sobre QUÉ se va a construir, es imposible estimar CUÁNTO costará. Un alcance bien delimitado permite calcular tiempos, roles y gastos de forma realista.",
        hint: "Sé específico: cuantifica niveles, personajes, mecánicas. Evita frases como 'muchos niveles' o 'arte bonito'. Los números concretos hacen el presupuesto manejable.",
        xp: 50
      },
      {
        id: "2-5",
        type: "word-scramble",
        title: "Adivina el término",
        question: "Ordena las letras para formar el concepto clave de esta etapa:",
        word: "ALCANCE",
        wordClue: "Define qué características, niveles y funcionalidades tendrá el juego final. Sin él, no hay presupuesto confiable.",
        explanation: "El ALCANCE es la delimitación exacta de lo que se va a construir. Todo lo que queda fuera del alcance no se presupuesta, no se desarrolla y no retrasa el proyecto. Dominarlo es el primer paso para controlar los costos.",
        hint: "La palabra tiene 7 letras y empieza con A. Está relacionada con los límites y el tamaño del proyecto.",
        xp: 30,
      },
      {
        id: "2-6",
        type: "true-false",
        title: "Verdadero o Falso: el alcance",
        question: "Determina si el siguiente enunciado es verdadero o falso:",
        isTrue: false,
        explanation: "Más características no garantizan mejor experiencia. La sobrecarga de contenido puede confundir al jugador, dispersar el esfuerzo del equipo y elevar el costo de forma inmanejable. Flappy Bird, Undertale y Minecraft comenzaron con alcances mínimos y tuvieron éxito enorme. La calidad de una mecánica bien pulida supera a la cantidad de mecánicas a medias.",
        hint: "Piensa en juegos exitosos con mecánica simple vs. juegos ambiciosos que fracasaron por prometer demasiado.",
        xp: 25,
      },
      {
        id: "2-7",
        type: "connect-concepts",
        title: "Tipos de alcance",
        question: "Conecta cada nivel de alcance con sus características típicas de producción.",
        pairs: [
          { left: "Alcance mínimo", right: "1 mecánica, pocos niveles, arte básico, equipo de 1-2 personas" },
          { left: "Alcance mediano", right: "3-5 mecánicas, 10-20 niveles, arte propio, equipo de 3-6 personas" },
          { left: "Alcance grande", right: "Múltiples sistemas, +30 niveles, cinemáticas, equipo de 10+ personas" },
          { left: "Scope creep", right: "Expansión no planificada del proyecto que dispara costos y retrasos" },
        ],
        explanation: "Reconocer a qué tipo de alcance pertenece cada característica es esencial para presupuestar correctamente. El scope creep no es un tipo de proyecto: es una trampa que convierte cualquier alcance en uno mayor sin planificación ni presupuesto.",
        hint: "El scope creep es diferente a los otros: no es un tamaño de proyecto, sino un problema de gestión que sucede cuando el proyecto crece sin control.",
        xp: 40,
      },
    ],
    quiz: [
      {
        id: "q2-1",
        question: "¿Qué es el 'scope' o alcance en un proyecto de videojuego?",
        options: [
          "El campo de visión de la cámara en juegos en primera persona",
          "El conjunto definido de características, niveles y funcionalidades que tendrá el juego final",
          "El rango de precios en que se venderá el juego en distintas plataformas",
          "El número total de horas que tardará el jugador promedio en completarlo"
        ],
        correctAnswer: 1,
        explanation: "El scope define qué ESTÁ y qué NO ESTÁ en el proyecto. Delimitar el alcance correctamente es lo que hace posible planificar tiempos y presupuestos realistas. Sin scope claro, no hay presupuesto confiable."
      },
      {
        id: "q2-2",
        question: "¿Qué es el 'scope creep' y por qué es un problema financiero?",
        options: [
          "Un error técnico que aumenta el tamaño del archivo del juego",
          "La expansión no controlada del proyecto más allá del plan original, que dispara los costos y retrasos",
          "Una técnica de diseño para añadir contenido extra después del lanzamiento",
          "El proceso de reducir funcionalidades del juego para cumplir con el presupuesto"
        ],
        correctAnswer: 1,
        explanation: "El scope creep ocurre cuando se añaden características no planificadas durante el desarrollo. Cada adición parece pequeña, pero sumadas extienden el tiempo y el costo significativamente. Es la causa #1 de proyectos que no se terminan."
      },
      {
        id: "q2-3",
        question: "¿Cuál de estas características tiene el MAYOR impacto en el costo de producción de un videojuego?",
        options: [
          "El número de opciones en el menú de pausa del juego",
          "El tipo de música de fondo (lofi vs. orquestal)",
          "El motor gráfico elegido (Unity vs Godot)",
          "Pasar de gráficos 2D pixel art a gráficos 3D renderizados en tiempo real"
        ],
        correctAnswer: 3,
        explanation: "El salto de 2D a 3D multiplica exponencialmente los costos: modelos 3D cuestan entre 5 y 20 veces más que sprites 2D, se necesitan animadores 3D especializados, y el tiempo de desarrollo se multiplica. Es una de las decisiones de alcance más costosas posibles."
      },
      {
        id: "q2-4",
        question: "Un proyecto académico de videojuego tiene 5 meses y un equipo de 4 estudiantes. ¿Qué alcance es más viable?",
        options: [
          "Un MMORPG con economía virtual, gremios y 100 horas de contenido",
          "Un juego de plataformas 2D con 6-8 niveles y una mecánica central bien pulida",
          "Un simulador de ciudad en 3D con economía dinámica y IA avanzada",
          "Un juego de mundo abierto con narrativa ramificada y 50 personajes con voces"
        ],
        correctAnswer: 1,
        explanation: "Un plataformas 2D con 6-8 niveles es alcanzable en 5 meses con 4 personas. Permite enfocarse en la calidad de una mecánica central en lugar de dispersar esfuerzo. Los proyectos más exitosos de estudiantes son los más enfocados, no los más ambiciosos."
      },
      {
        id: "q2-5",
        question: "¿Cómo afecta la cantidad de personajes jugables al presupuesto de un videojuego?",
        options: [
          "No afecta el presupuesto porque todos los personajes comparten la misma base de código",
          "Cada personaje adicional requiere arte, animaciones, balanceo y testing específicos que incrementan el costo",
          "Más personajes siempre significa un juego más exitoso, así que el costo adicional se justifica solo",
          "Solo afecta el presupuesto si los personajes tienen voces en el doblaje del juego"
        ],
        correctAnswer: 1,
        explanation: "Cada personaje jugable adicional implica sprites o modelos únicos, animaciones propias (caminar, atacar, morir), balanceo de habilidades y horas de testing para asegurar que funcione correctamente. Duplicar personajes puede casi duplicar el costo de arte y QA."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // ETAPA 3 — RECURSOS Y EQUIPO
  // ═══════════════════════════════════════════════════════
  {
    id: 3,
    title: "Recursos y Equipo",
    subtitle: "Identifica quién hace qué y cuánto cuesta el talento humano",
    icon: "users",
    color: "#f97316",
    bgColor: "#fff7ed",
    borderColor: "#fed7aa",
    objective: "Identificar los recursos humanos y técnicos necesarios para el proyecto y cómo se traducen en costos reales de producción.",
    topics: [
      "Roles del equipo de desarrollo",
      "Costo del talento humano",
      "Herramientas gratuitas vs. de pago",
      "Hardware y software necesario",
      "Outsourcing vs. trabajo propio",
      "Equipo mínimo viable (MVP de equipo)"
    ],
    xpReward: 175,
    intro: {
      summary: "El talento humano es el recurso más valioso y costoso de cualquier producción de videojuego. Saber quién hace qué, cuánto cuesta cada rol y qué herramientas usar puede ser la diferencia entre un proyecto que avanza con claridad y uno que se estanca por falta de planificación.",
      keyPoints: [
        "El programador es el rol más crítico en cualquier equipo: sin código, el juego no existe. Todo lo demás viene después.",
        "El equipo humano representa entre el 60% y el 80% del presupuesto total. Es el gasto dominante.",
        "Herramientas gratuitas como Godot, Krita o Audacity son completamente profesionales y no limitan los ingresos del proyecto.",
        "La polivalencia (una persona con varios roles) reduce costos pero tiene límites: hay un punto donde genera agotamiento y baja la calidad.",
      ],
      realWorldContext: "Undertale fue creado por una sola persona (Toby Fox) en 2.5 años. Stardew Valley también fue obra de un solo desarrollador durante 4 años. La mayoría de juegos indie exitosos tienen equipos de 2-8 personas muy bien coordinadas, no decenas de especialistas.",
      pixelTip: "Al evaluar roles y herramientas, piensa siempre en la relación costo-beneficio. No necesitas el software más caro ni el equipo más grande. Necesitas las personas correctas con las herramientas correctas para TU proyecto específico.",
      estimatedMinutes: 15,
    },
    activities: [
      {
        id: "3-1",
        type: "multiple-choice",
        title: "El rol más crítico",
        question: "Para un juego indie 2D simple, ¿qué rol sería el MÁS indispensable para arrancar el proyecto?",
        options: [
          { id: "a", text: "Community manager para manejar redes sociales desde el día 1" },
          { id: "b", text: "Programador con experiencia en el motor elegido (Unity/Godot)" },
          { id: "c", text: "Compositor de música orquestal para la banda sonora completa" },
          { id: "d", text: "Especialista en monetización y estrategia de precios" }
        ],
        correctAnswer: 1,
        explanation: "Sin programación, el juego no existe. El programador que domina el motor es el núcleo técnico que hace posible que todos los demás roles trabajen. El marketing, la música y la monetización vienen después de tener un juego funcional. Esta es la base del equipo mínimo viable.",
        hint: "¿Qué rol construye el producto en sí? Piensa en el producto mínimo viable: ¿qué necesitas para que el juego exista y sea jugable?",
        xp: 35
      },
      {
        id: "3-2",
        type: "order-steps",
        title: "Roles por costo típico",
        question: "Ordena estos roles de videojuego de MENOR a MAYOR costo típico por hora de trabajo freelance:",
        items: [
          "Tester de QA (control de calidad básico)",
          "Artista 2D de sprites y fondos",
          "Programador de gameplay senior",
          "Director artístico / Lead Artist con portafolio AAA"
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: "Los roles más especializados y con mayor demanda de mercado tienen tarifas más altas. Un tester puede trabajar por $8-15/hora; un artista 2D por $20-40/hora; un programador senior por $40-80/hora; y un director artístico reconocido puede cobrar $80-150+/hora.",
        hint: "Piensa en el nivel de especialización y escasez de cada rol en el mercado de videojuegos. ¿Quién tiene la curva de aprendizaje más larga?",
        xp: 40
      },
      {
        id: "3-3",
        type: "multiple-choice",
        title: "Herramientas y su costo",
        question: "Un equipo indie quiere reducir costos de software al mínimo. ¿Cuál combinación de herramientas les da la mejor relación calidad-costo?",
        options: [
          { id: "a", text: "Adobe Creative Cloud ($60/mes), Unity Pro ($2,040/año), FMOD Studio Pro ($800/año)" },
          { id: "b", text: "Godot Engine (gratis), Krita (gratis), Audacity (gratis), LMMS (gratis)" },
          { id: "c", text: "Unreal Engine 5 (gratis hasta $1M ingresos), Maya ($1,700/año), Wwise (gratis con límites)" },
          { id: "d", text: "Unity Personal (gratis con límites), Photoshop ($23/mes), Adobe Audition ($23/mes)" }
        ],
        correctAnswer: 1,
        explanation: "Godot + Krita + Audacity + LMMS son herramientas profesionales completamente gratuitas y de código abierto, sin restricciones de ingresos ni marcas de agua. Para equipos estudiantiles o sin financiamiento, representan $0 en licencias de software.",
        hint: "Busca la opción donde todas las herramientas son gratuitas sin restricciones de uso comercial o límites de ingresos.",
        xp: 35
      },
      {
        id: "3-4",
        type: "reflection",
        title: "Define tu equipo mínimo viable",
        question: "Describe el equipo que necesitas para tu videojuego: ¿qué roles son indispensables?, ¿cuáles pueden ser cubiertos por un mismo miembro?, ¿qué tareas podrías externalizar (outsourcing) y cuáles deben hacerse internamente?",
        placeholder: "Ejemplo: 'Necesitamos 1 programador (también hará diseño de niveles), 1 artista 2D (también hará UI), y externalizaríamos la música comprando packs de audio. El equipo central sería de 2 personas con apoyo puntual en audio...'",
        explanation: "El equipo mínimo viable es el conjunto mínimo de personas con los roles necesarios para que el proyecto avance. Identificarlo correctamente es crucial porque los salarios y honorarios son el gasto más alto en cualquier producción de videojuego, representando entre el 60% y el 80% del presupuesto total.",
        hint: "En proyectos estudiantiles, una persona puede tener varios roles. La clave es que los roles críticos estén cubiertos, aunque sea por la misma persona.",
        xp: 50
      },
      {
        id: "3-5",
        type: "connect-concepts",
        title: "Roles del equipo",
        question: "Conecta cada rol del equipo de desarrollo con su responsabilidad principal.",
        pairs: [
          { left: "Programador", right: "Implementa mecánicas, sistemas y lógica del juego en código" },
          { left: "Artista 2D", right: "Crea sprites, fondos, animaciones y elementos visuales del juego" },
          { left: "Diseñador de niveles", right: "Diseña la estructura, flujo, desafíos y ritmo de cada nivel" },
          { left: "QA Tester", right: "Detecta y documenta errores y problemas antes del lanzamiento" },
        ],
        explanation: "Conocer las responsabilidades exactas de cada rol ayuda a planificar el equipo y calcular los costos correctamente. En equipos pequeños, una persona puede cubrir varios roles, pero es importante saber qué tareas conlleva cada uno para estimar el tiempo necesario.",
        hint: "Piensa en el producto final de cada rol: el programador entrega código funcional, el artista entrega assets visuales, el diseñador entrega niveles jugables, el tester entrega reportes de bugs.",
        xp: 40,
      },
      {
        id: "3-6",
        type: "true-false",
        title: "Herramientas gratuitas",
        question: "Determina si el siguiente enunciado es verdadero o falso:",
        isTrue: true,
        explanation: "Godot Engine es completamente gratuito y de código abierto, sin restricciones de ingresos ni marcas de agua. A diferencia de Unity (que tiene planes gratuitos con límites), Godot permite desarrollo y publicación comercial sin costo. Es mantenido por una fundación sin fines de lucro y tiene una comunidad activa.",
        hint: "Piensa en la diferencia entre 'gratuito con límites' y 'completamente gratuito sin restricciones'. No todos los motores gratuitos tienen las mismas condiciones.",
        xp: 25,
      },
      {
        id: "3-7",
        type: "crossword",
        title: "Crucigrama del equipo",
        question: "Completa el crucigrama con términos de recursos y equipo. Toca una pista para seleccionarla y escribe la respuesta.",
        crossword: {
          rows: 6,
          cols: 7,
          words: [
            {
              number: 1,
              direction: "across",
              clue: "Motor de videojuego gratuito y open source, creado en Latinoamérica",
              answer: "GODOT",
              row: 0,
              col: 0,
            },
            {
              number: 2,
              direction: "down",
              clue: "Rol que verifica la calidad y detecta errores antes del lanzamiento",
              answer: "TESTER",
              row: 0,
              col: 4,
            },
            {
              number: 3,
              direction: "across",
              clue: "Rol encargado del arte visual, sprites y diseño gráfico del juego",
              answer: "ARTISTA",
              row: 2,
              col: 0,
            },
          ],
        },
        explanation: "GODOT es un motor de videojuegos gratuito y open source. Un TESTER es fundamental para el control de calidad. El ARTISTA crea todos los assets visuales. Estos tres elementos forman el núcleo de recursos técnicos y humanos de un equipo indie.",
        hint: "GODOT tiene 5 letras (horizontal, fila 0). TESTER tiene 6 letras (vertical, columna 4). ARTISTA tiene 7 letras (horizontal, fila 2). La T de GODOT y la T de TESTER se cruzan. La S de ARTISTA y la S de TESTER se cruzan.",
        xp: 55,
      },
    ],
    quiz: [
      {
        id: "q3-1",
        question: "En promedio, ¿qué porcentaje del presupuesto total de un videojuego indie corresponde al costo del equipo humano?",
        options: [
          "Entre el 10% y el 20% del presupuesto total",
          "Entre el 60% y el 80% del presupuesto total",
          "Exactamente el 50% del presupuesto total siempre",
          "Menos del 10% si el equipo es de estudiantes universitarios"
        ],
        correctAnswer: 1,
        explanation: "El talento humano es el gasto dominante en cualquier proyecto de software, incluyendo videojuegos. Las personas —programadores, artistas, diseñadores— representan entre el 60% y el 80% del costo. Por eso, definir bien el equipo es la decisión presupuestal más impactante."
      },
      {
        id: "q3-2",
        question: "¿Qué es el 'outsourcing' en el contexto de producción de videojuegos?",
        options: [
          "Lanzar el juego en mercados internacionales fuera del país de origen",
          "Contratar externamente a terceros o freelancers para tareas específicas del proyecto",
          "Usar inteligencia artificial para generar assets automáticamente sin intervención humana",
          "Distribuir el trabajo entre los miembros del equipo interno según sus habilidades"
        ],
        correctAnswer: 1,
        explanation: "El outsourcing permite acceder a habilidades que el equipo no tiene internamente (ej: música, efectos de sonido, arte especializado) sin necesidad de contratar a tiempo completo. Es una estrategia común para controlar costos en proyectos indie y académicos."
      },
      {
        id: "q3-3",
        question: "¿Cuál es el 'costo oculto' más común que los equipos novatos de videojuegos subestiman?",
        options: [
          "El costo de licencias de música con derechos de autor para el juego",
          "El tiempo de iteración, corrección de bugs y revisiones que multiplican las horas reales de trabajo",
          "El costo de marketing en redes sociales para promocionar el juego terminado",
          "El precio de publicación en tiendas digitales como Steam o App Store"
        ],
        correctAnswer: 1,
        explanation: "Los equipos novatos calculan el tiempo 'ideal' pero no consideran que cada funcionalidad requiere correcciones, pruebas y revisiones. En la práctica, el tiempo real puede ser 2 o 3 veces el estimado inicial. Este 'tiempo oculto' es el mayor generador de sobrecostos en proyectos indie."
      },
      {
        id: "q3-4",
        question: "Para un equipo de estudiantes sin presupuesto, ¿cuál es la mejor estrategia para cubrir el rol de músico/compositor?",
        options: [
          "No incluir música en el juego para eliminar ese costo completamente",
          "Contratar a un compositor profesional a precio de mercado como primera inversión",
          "Usar música con licencia Creative Commons o free-to-use de repositorios como OpenGameArt",
          "Grabar música con el micrófono del celular para reducir costos de equipo"
        ],
        correctAnswer: 2,
        explanation: "Repositorios como OpenGameArt, Freesound y itch.io tienen miles de piezas musicales gratuitas con licencias que permiten uso en proyectos comerciales. Es una forma profesional y ética de cubrir el audio sin costo. Muchos juegos indie exitosos usan música gratuita bien seleccionada."
      },
      {
        id: "q3-5",
        question: "¿Qué significa que un miembro del equipo sea 'polivalente' en el contexto de producción indie?",
        options: [
          "Que puede trabajar desde distintos países simultáneamente en el mismo proyecto",
          "Que domina múltiples disciplinas (ej: programar Y hacer arte) reduciendo la cantidad de personas necesarias",
          "Que tiene experiencia en varios géneros de videojuegos como jugador experto",
          "Que puede trabajar en múltiples proyectos al mismo tiempo sin perder calidad"
        ],
        correctAnswer: 1,
        explanation: "En equipos pequeños, la polivalencia es un recurso valioso. Un miembro que puede programar Y diseñar niveles, o que puede hacer arte Y UI, reduce la cantidad de personas necesarias. Sin embargo, hay límites: la polivalencia tiene un costo en tiempo y puede generar agotamiento si no se gestiona bien."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // ETAPA 4 — COSTOS DE PRODUCCIÓN
  // ═══════════════════════════════════════════════════════
  {
    id: 4,
    title: "Costos de Producción",
    subtitle: "Aprende a clasificar, priorizar y controlar los gastos del desarrollo",
    icon: "banknote",
    color: "#ec4899",
    bgColor: "#fdf2f8",
    borderColor: "#fbcfe8",
    objective: "Distinguir los tipos de costos en producción de videojuegos, identificar cuáles son prescindibles y cómo priorizarlos para no exceder el presupuesto.",
    topics: [
      "Costos fijos vs. costos variables",
      "Categorías principales de gasto",
      "Costos de arte, programación y sonido",
      "Costos de licencias y publicación",
      "Outsourcing y sus costos",
      "Costos ocultos o subestimados",
      "Priorización del gasto"
    ],
    xpReward: 200,
    intro: {
      summary: "Un presupuesto no es solo una lista de gastos: es una herramienta de control y decisión. Entender la diferencia entre costos fijos y variables, y saber cuáles priorizar, es fundamental para mantener el proyecto dentro de sus posibilidades reales sin comprometer la calidad del núcleo del juego.",
      keyPoints: [
        "Los costos fijos se pagan siempre, independientemente de la producción (ej: suscripción mensual a la nube). Los variables cambian según el trabajo realizado (ej: pago por sprite entregado).",
        "El arte y la programación son los gastos más altos en producción: juntos pueden representar el 70-80% del presupuesto total.",
        "El costo del polish y corrección de bugs representa entre el 20-40% del tiempo total de producción, pero rara vez se presupuesta explícitamente.",
        "Publicar en Steam cuesta $100 USD (tarifa única que se recupera al superar $1,000 en ventas). App Store cobra $99 USD/año.",
      ],
      realWorldContext: "Un juego indie promedio cuesta entre $10,000 y $500,000 dependiendo del alcance. El desglose típico: 60-70% equipo humano, 10-15% arte y assets, 5-10% audio, 5-10% marketing y publicación, 5-10% imprevistos y contingencia.",
      pixelTip: "Al analizar costos, clasifícalos primero en dos preguntas: ¿Es fijo o variable? ¿Es esencial para el núcleo del juego o es un 'nice to have' que puede eliminarse? Esta clasificación simplifica cualquier decisión de recorte presupuestal.",
      estimatedMinutes: 18,
    },
    activities: [
      {
        id: "4-1",
        type: "multiple-choice",
        title: "Costo fijo o variable",
        question: "¿Cuál de estos es un ejemplo de COSTO FIJO en la producción de un videojuego?",
        options: [
          { id: "a", text: "El pago por hora a un artista freelance por cada sprite que entrega" },
          { id: "b", text: "La suscripción mensual a un servicio de almacenamiento en la nube del proyecto" },
          { id: "c", text: "El costo de publicar actualizaciones adicionales después del lanzamiento" },
          { id: "d", text: "El porcentaje de regalías que se paga a la tienda por cada venta del juego" }
        ],
        correctAnswer: 1,
        explanation: "Un costo fijo es aquel que se paga independientemente de cuánto se produzca. La suscripción mensual a la nube se paga siempre, haya mucha o poca actividad. Los pagos por sprite (variable), las actualizaciones (variable) y las regalías (variable según ventas) cambian según el uso o producción.",
        hint: "Un costo fijo no cambia según la cantidad de trabajo realizado. ¿Cuál de las opciones se paga igual sin importar cuánto se produzca?",
        xp: 35
      },
      {
        id: "4-2",
        type: "order-steps",
        title: "Prioridad de gastos",
        question: "Ordena estas categorías de gasto de MAYOR a MENOR prioridad para el núcleo del juego (la experiencia mínima jugable):",
        items: [
          "Marketing y redes sociales antes del lanzamiento",
          "Programación del gameplay y mecánica principal",
          "Arte básico funcional para representar el juego",
          "Música de menú y efectos de sonido esenciales"
        ],
        correctOrder: [1, 2, 3, 0],
        explanation: "La programación del gameplay es lo primero porque sin código no hay juego. El arte básico funcional permite representar el mundo. Los efectos de sonido dan feedback al jugador. El marketing es el último paso porque no tiene sentido promocionar algo que no está listo o no existe aún.",
        hint: "Piensa qué necesita existir PRIMERO para que el juego sea jugable. El marketing viene cuando hay algo que mostrar.",
        xp: 40
      },
      {
        id: "4-3",
        type: "multiple-choice",
        title: "Reducir sin dañar el núcleo",
        question: "Un equipo necesita recortar $2,000 de su presupuesto. ¿Qué gasto puede eliminarse sin afectar la experiencia central del juego?",
        options: [
          { id: "a", text: "El tiempo de programación del sistema de colisiones y física del juego" },
          { id: "b", text: "Los efectos de sonido de las acciones principales del jugador" },
          { id: "c", text: "Las cinemáticas animadas de introducción y créditos finales" },
          { id: "d", text: "El arte de los niveles principales del juego" }
        ],
        correctAnswer: 2,
        explanation: "Las cinemáticas de introducción y créditos son elementos que enriquecen la experiencia pero no son parte del gameplay central. Pueden reemplazarse con imágenes estáticas o texto sin afectar la jugabilidad. La física, los sonidos de acción y el arte de niveles son esenciales para que el juego funcione.",
        hint: "¿Cuál de estas opciones puede reemplazarse por una alternativa más barata (ej: texto estático en lugar de animación) sin que el juego deje de funcionar y ser divertido?",
        xp: 35
      },
      {
        id: "4-4",
        type: "reflection",
        title: "Mapea los costos de tu proyecto",
        question: "Identifica al menos 5 costos concretos de tu proyecto de videojuego. Para cada uno, indica si es fijo o variable, si es esencial o prescindible, y una estimación aproximada en horas o dinero.",
        placeholder: "Ejemplo: '1. Programación del sistema de movimiento — fijo/esencial — 40 horas. 2. Arte de personaje principal — variable/esencial — 20 horas. 3. Música de fondo — fijo/prescindible — $0 (Creative Commons). 4. Testing con usuarios — variable/esencial — 10 horas. 5. Trailer de lanzamiento — variable/prescindible — 8 horas...'",
        explanation: "Listar y clasificar costos es el primer paso para construir un presupuesto real. No necesitas saber el costo exacto de cada ítem — una estimación informada te permite priorizar, identificar riesgos y tomar decisiones antes de comprometer recursos.",
        hint: "Divide tu proyecto en áreas: programación, arte, audio, testing y marketing. Dentro de cada área, lista las tareas específicas con su clasificación.",
        xp: 60
      },
      {
        id: "4-5",
        type: "word-scramble",
        title: "Adivina el término",
        question: "Ordena las letras para formar el concepto financiero de esta etapa:",
        word: "VARIABLE",
        wordClue: "Tipo de costo que sube o baja según la cantidad de trabajo o producción realizada. Contraste con los costos que se pagan siempre igual.",
        explanation: "Un costo VARIABLE cambia según la producción. El pago a un artista freelance por cada sprite entregado es variable: más sprites = más costo. Distinguir costos variables de fijos es clave para planificar el flujo de caja y saber cuándo se generarán los gastos.",
        hint: "La palabra tiene 8 letras. Empieza con V y termina con E. Es un adjetivo que describe algo que puede cambiar.",
        xp: 30,
      },
      {
        id: "4-6",
        type: "true-false",
        title: "Verdadero o Falso: el equipo",
        question: "Determina si el siguiente enunciado es verdadero o falso:",
        isTrue: false,
        explanation: "El talento humano representa entre el 60% y el 80% del presupuesto total en producción de videojuegos, no menos del 30%. Es el gasto dominante. Por eso, optimizar el equipo mediante polivalencia, outsourcing selectivo y herramientas gratuitas tiene el mayor impacto posible en el control de costos.",
        hint: "Recuerda el dato clave de la etapa anterior: los programadores, artistas y diseñadores son el recurso más costoso en cualquier producción de software.",
        xp: 25,
      },
      {
        id: "4-7",
        type: "connect-concepts",
        title: "Clasifica los costos",
        question: "Conecta cada gasto con su clasificación correcta según su tipo (fijo o variable).",
        pairs: [
          { left: "Suscripción mensual a la nube", right: "Costo fijo — se paga igual independientemente de la producción" },
          { left: "Pago por sprite entregado", right: "Costo variable — aumenta según la cantidad de trabajo realizado" },
          { left: "Licencia anual de motor gráfico", right: "Costo fijo — se paga independientemente del avance del proyecto" },
          { left: "Tarifa de publicación en Steam", right: "Costo fijo — pago único de $100 USD por juego publicado" },
        ],
        explanation: "Clasificar los costos correctamente permite planificar el flujo de caja: los costos fijos se pagan siempre y deben estar presupuestados desde el inicio. Los variables se acumulan con la producción y permiten ajustar el gasto según el avance real del proyecto.",
        hint: "La pregunta clave para clasificar: ¿este gasto cambia según cuánto trabajo se haga o cuánto se produzca? Si sí, es variable. Si se paga igual sin importar la producción, es fijo.",
        xp: 40,
      },
    ],
    quiz: [
      {
        id: "q4-1",
        question: "¿Cuál es la diferencia principal entre un costo fijo y un costo variable en producción de videojuegos?",
        options: [
          "Los costos fijos son más caros; los variables son más económicos siempre",
          "Los costos fijos no cambian independientemente del volumen de trabajo; los variables sí cambian según la producción",
          "Los costos fijos se pagan al final del proyecto; los variables se pagan mensualmente",
          "Los costos fijos son de software; los variables son de recursos humanos únicamente"
        ],
        correctAnswer: 1,
        explanation: "Un costo fijo (licencia de software mensual, alquiler de servidores) se paga igual sin importar cuánto se produzca. Un costo variable (pago a artista por sprite) aumenta o disminuye según la producción. Conocer esta diferencia permite planificar el flujo de caja del proyecto."
      },
      {
        id: "q4-2",
        question: "¿Cuánto cuesta aproximadamente publicar un juego en Steam (PC)?",
        options: [
          "Es completamente gratuito; Valve no cobra ninguna tarifa a los desarrolladores",
          "Cuesta $100 USD como tarifa única de registro por juego publicado",
          "Cuesta el 30% de todas las ganancias generadas por el juego antes de cualquier pago",
          "Cuesta entre $500 y $1,000 USD dependiendo del tamaño del equipo de desarrollo"
        ],
        correctAnswer: 1,
        explanation: "Steam cobra $100 USD por juego como tarifa de acceso a Steam Direct. Esta tarifa se reembolsa una vez que el juego genera más de $1,000 en ventas. Adicionalmente, Steam retiene el 30% de las ganancias (que baja al 25% o 20% con mayores ventas). Es un costo de publicación que debe incluirse en el presupuesto."
      },
      {
        id: "q4-3",
        question: "¿Cuál es el costo más frecuentemente subestimado en proyectos indie de videojuegos?",
        options: [
          "El costo de diseñar el logo y la identidad visual del juego",
          "El tiempo y costo de corrección de bugs, iteraciones y polish del juego",
          "El costo de registrar el nombre del juego como marca comercial",
          "El precio de las licencias de música para el trailer oficial del juego"
        ],
        correctAnswer: 1,
        explanation: "El 'polish' (pulir el juego) y la corrección de bugs consumen entre el 20% y el 40% del tiempo total de producción, pero rara vez se presupuestan explícitamente. Los equipos planean 'terminar' el juego pero no cuentan el tiempo de hacer que todo funcione sin errores y se sienta bien."
      },
      {
        id: "q4-4",
        question: "Si un artista freelance cobra $25 USD por hora y estimas necesitar 80 sprites para tu juego (cada sprite toma 2 horas), ¿cuánto costará el arte del juego?",
        options: [
          "$1,000 USD (80 sprites × $12.50 promedio por sprite)",
          "$2,000 USD (80 sprites × 2 horas × $12.50 por hora)",
          "$4,000 USD (80 sprites × 2 horas × $25 por hora)",
          "$6,000 USD (80 sprites × 3 horas promedio × $25 por hora)"
        ],
        correctAnswer: 2,
        explanation: "80 sprites × 2 horas/sprite = 160 horas totales de trabajo. 160 horas × $25/hora = $4,000 USD. Este tipo de cálculo simple pero preciso es exactamente lo que un presupuesto de videojuego necesita. Estimar horas por tarea y multiplicar por la tarifa es el método básico de presupuestación."
      },
      {
        id: "q4-5",
        question: "¿Qué representa el costo de 'QA' (Quality Assurance) en producción de videojuegos?",
        options: [
          "El costo de adquirir equipos de alta calidad (computadoras, monitores, etc.) para el equipo",
          "El tiempo y recursos invertidos en probar el juego para encontrar y documentar errores antes del lanzamiento",
          "El costo de contratar diseñadores que aseguren que la interfaz sea de alta calidad visual",
          "El presupuesto asignado para premios y certificaciones de calidad de la industria"
        ],
        correctAnswer: 1,
        explanation: "QA (control de calidad) es el proceso de probar sistemáticamente el juego para detectar bugs, problemas de usabilidad y situaciones inesperadas. En estudios grandes representa el 15-25% del presupuesto. En proyectos indie se subestima, pero lanzar sin QA adecuado puede destruir la reputación del producto."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // ETAPA 5 — PRESUPUESTO Y VIABILIDAD
  // ═══════════════════════════════════════════════════════
  {
    id: 5,
    title: "Presupuesto y Viabilidad",
    subtitle: "Construye y evalúa un presupuesto real para tu videojuego",
    icon: "bar-chart",
    color: "#14b8a6",
    bgColor: "#f0fdfa",
    borderColor: "#99f6e4",
    objective: "Construir un presupuesto básico estructurado, evaluar si el proyecto es viable con los recursos disponibles y tomar decisiones para ajustarlo si no lo es.",
    topics: [
      "Estimación básica de costos",
      "Distribución porcentual del presupuesto",
      "Margen de contingencia",
      "Análisis de viabilidad",
      "Decisiones para reducir costos",
      "Priorización por valor",
      "Imprevistos y riesgos financieros"
    ],
    xpReward: 200,
    intro: {
      summary: "Un presupuesto bien construido es la diferencia entre un proyecto que se termina y uno que se abandona a medio camino. Esta etapa enseña a estructurar un presupuesto real, evaluar si el proyecto es viable con los recursos disponibles y tomar decisiones cuando los números no cuadran.",
      keyPoints: [
        "Todo presupuesto comienza con el alcance: sin saber qué se construirá, es imposible estimar cuánto costará.",
        "El margen de contingencia (10-20% del total) es un colchón financiero para absorber imprevistos sin cancelar el proyecto.",
        "Viabilidad no es solo tener el dinero: también implica tener el tiempo, las personas y las herramientas necesarias.",
        "Un presupuesto honesto incluye las horas de trabajo propio, aunque no haya pago en dinero. El tiempo tiene valor.",
      ],
      realWorldContext: "El juego 'Papers, Please' (Lucas Pope, 2013) fue desarrollado con un presupuesto prácticamente de $0 en dinero, pero miles de horas de trabajo. Vendió más de 2 millones de copias. La viabilidad no solo depende del dinero: la planificación correcta de tiempo y recursos es igual de importante.",
      pixelTip: "Cuando evalúes si un presupuesto es correcto, revisa que cubra TODAS las áreas esenciales y que incluya contingencia. Un presupuesto que concentra todo el dinero en una sola área está mal distribuido, sin importar el total.",
      estimatedMinutes: 18,
    },
    activities: [
      {
        id: "5-1",
        type: "multiple-choice",
        title: "¿Cuál presupuesto está mejor balanceado?",
        question: "Un equipo tiene $5,000 para desarrollar un juego indie 2D. ¿Cuál distribución del presupuesto es más equilibrada y viable?",
        options: [
          { id: "a", text: "Arte: $4,500 (90%) | Programación: $500 (10%) | Audio: $0 | Testing: $0 | Contingencia: $0" },
          { id: "b", text: "Arte: $1,500 (30%) | Programación: $2,000 (40%) | Audio: $500 (10%) | Testing: $500 (10%) | Contingencia: $500 (10%)" },
          { id: "c", text: "Marketing: $3,000 (60%) | Arte: $1,000 (20%) | Programación: $1,000 (20%) | Audio: $0 | Testing: $0" },
          { id: "d", text: "Programación: $5,000 (100%) | Arte: $0 | Audio: $0 | Testing: $0 | Contingencia: $0" }
        ],
        correctAnswer: 1,
        explanation: "La distribución B es la más equilibrada: 40% programación (núcleo técnico), 30% arte (identidad visual), 10% audio, 10% testing (calidad) y 10% contingencia (imprevistos). Ninguna área es ignorada y hay un margen de seguridad. Las demás opciones sacrifican áreas críticas o invierten desproporcionadamente en una sola.",
        hint: "Un presupuesto sano cubre las áreas esenciales SIN ignorar ninguna. La contingencia (reserva para imprevistos) siempre debe existir.",
        xp: 40
      },
      {
        id: "5-2",
        type: "order-steps",
        title: "Pasos para construir un presupuesto",
        question: "Ordena los pasos para construir un presupuesto básico de videojuego en el orden correcto:",
        items: [
          "Definir el alcance detallado del proyecto (qué se va a construir exactamente)",
          "Listar todas las tareas necesarias por área (arte, código, audio, testing)",
          "Estimar las horas o costo de cada tarea con el equipo",
          "Sumar todos los costos y comparar con el presupuesto disponible",
          "Ajustar el alcance o buscar alternativas si el costo supera el presupuesto"
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: "El presupuesto siempre comienza con el alcance (qué se construirá), luego se listan tareas concretas, se estiman sus costos, se totaliza y finalmente se ajusta si es necesario. Hacer el presupuesto sin definir el alcance primero es como calcular el costo de un viaje sin saber a dónde vas.",
        hint: "La secuencia lógica es: saber qué se hace → listar qué se necesita → estimar cuánto cuesta → verificar si alcanza → ajustar si no alcanza.",
        xp: 40
      },
      {
        id: "5-3",
        type: "multiple-choice",
        title: "¿Cuál proyecto es viable?",
        question: "Un equipo tiene 3 meses y un presupuesto de $0 (trabajo voluntario). ¿Cuál de estos proyectos es VIABLE en esas condiciones?",
        options: [
          { id: "a", text: "RPG de mundo abierto 3D, 50+ horas de contenido, voces en español e inglés" },
          { id: "b", text: "Juego de plataformas 2D, 5 niveles, pixel art propio, sin audio externo" },
          { id: "c", text: "Battle royale multijugador en línea con 100 jugadores simultáneos" },
          { id: "d", text: "Simulador de ciudad con economía dinámica e inteligencia artificial avanzada" }
        ],
        correctAnswer: 1,
        explanation: "Con $0 y 3 meses, solo proyectos muy acotados son viables. Un plataformas 2D de 5 niveles en pixel art puede hacerse con herramientas gratuitas (Godot + Krita) por un equipo pequeño. Los otros proyectos requieren meses de trabajo de equipos de decenas de personas o infraestructura costosa.",
        hint: "¿Cuál de estas opciones puede completarse con herramientas gratuitas, sin contratar a nadie y en 3 meses de trabajo a tiempo parcial?",
        xp: 35
      },
      {
        id: "5-4",
        type: "reflection",
        title: "Construye tu estimación de presupuesto",
        question: "Elabora una estimación básica del presupuesto de tu videojuego con al menos 4 categorías de gasto. Para cada categoría indica: el costo estimado, si usarás recursos gratuitos o pagos, y cómo justificas ese gasto en relación al proyecto.",
        placeholder: "Ejemplo:\nPROGRAMACIÓN: 80 horas de trabajo propio ($0 en equipo). Motor: Godot (gratuito).\nARTE: 60 horas de trabajo propio + $200 en assets de itch.io.\nAUDIO: $0 — música Creative Commons + efectos de Freesound.\nTESTING: 10 horas con 5 compañeros como testers voluntarios ($0).\nCONTINGENCIA: $50 para imprevistos menores.\nTOTAL ESTIMADO: $250 + ~150 horas de trabajo.",
        explanation: "Una estimación de presupuesto honesta incluye tanto el dinero como las horas de trabajo (tiempo = costo). Muchos proyectos estudiantiles tienen $0 en efectivo pero invierten cientos de horas. Documentar esas horas permite entender el costo real del proyecto aunque no se pague en dinero.",
        hint: "No olvides incluir tu tiempo de trabajo como un costo, aunque no te paguen. Valora tu hora de trabajo al menos en $10-15 para entender el costo real del proyecto.",
        xp: 60
      }
    ],
    quiz: [
      {
        id: "q5-1",
        question: "¿Qué es el 'margen de contingencia' en un presupuesto de videojuego?",
        options: [
          "El porcentaje de ganancias que se reserva para el equipo como bono al terminar el proyecto",
          "Una reserva de recursos (tiempo/dinero) para absorber imprevistos sin comprometer el proyecto",
          "El margen de error permitido en el balance final de ingresos vs. egresos del proyecto",
          "El presupuesto extra que se pide a los inversores en caso de que el proyecto fracase"
        ],
        correctAnswer: 1,
        explanation: "La contingencia es un colchón financiero (normalmente 10-20%) que cubre imprevistos: un miembro del equipo que se retira, una funcionalidad que tarda más de lo esperado, o un costo no anticipado. Sin contingencia, cualquier imprevisto pone en riesgo todo el proyecto."
      },
      {
        id: "q5-2",
        question: "Un equipo estima que su juego costará $3,000. ¿Cuánto deberían añadir como margen de contingencia del 15%?",
        options: [
          "$150 adicionales (5% del presupuesto base)",
          "$300 adicionales (10% del presupuesto base)",
          "$450 adicionales (15% del presupuesto base)",
          "$600 adicionales (20% del presupuesto base)"
        ],
        correctAnswer: 2,
        explanation: "$3,000 × 0.15 = $450 de contingencia. El presupuesto total sería $3,450. Este cálculo es fundamental para no quedarse sin recursos ante cualquier imprevisto. Siempre es mejor sobrar presupuesto que quedarse corto a mitad del desarrollo."
      },
      {
        id: "q5-3",
        question: "¿Cuál es el indicador más claro de que un proyecto de videojuego NO es viable financieramente?",
        options: [
          "El juego no tiene música original compuesta específicamente para él",
          "El costo estimado de producción supera significativamente los recursos disponibles del equipo",
          "El juego no tiene un plan de monetización claro para después del lanzamiento",
          "El equipo no tiene experiencia previa publicando juegos en tiendas digitales"
        ],
        correctAnswer: 1,
        explanation: "Un proyecto no es viable cuando el costo supera los recursos. Querer hacer un juego de $50,000 con $2,000 no es un problema de creatividad sino de viabilidad financiera. La solución no es ignorar la brecha, sino ajustar el alcance hasta que el costo sea congruente con los recursos."
      },
      {
        id: "q5-4",
        question: "¿Qué estrategia es más efectiva para reducir el presupuesto de un videojuego sin comprometer su calidad central?",
        options: [
          "Reducir el tiempo de testing para terminar más rápido y con menos horas de trabajo",
          "Eliminar los efectos de sonido del juego para no pagar por diseño de audio",
          "Usar assets gratuitos de calidad (OpenGameArt, itch.io) para arte secundario y enfocarse en pulir el gameplay",
          "Quitar niveles intermedios del juego para reducir el tiempo de diseño de niveles"
        ],
        correctAnswer: 2,
        explanation: "Usar assets gratuitos de calidad para elementos secundarios (música de fondo, efectos genéricos, tiles de escenario) libera presupuesto para enfocarse en lo diferencial: el gameplay, los personajes principales y la experiencia central. Esto reduce costos sin comprometer la identidad del juego."
      },
      {
        id: "q5-5",
        question: "¿Qué significa 'análisis de riesgo' en el contexto de un presupuesto de videojuego?",
        options: [
          "Calcular la probabilidad de que el juego tenga bugs graves que impidan su lanzamiento",
          "Identificar los factores que podrían aumentar los costos o retrasar el proyecto, y planear cómo mitigarlos",
          "Evaluar si el género del juego es demasiado competitivo en el mercado actual",
          "Analizar si el equipo tiene suficiente experiencia técnica para usar el motor elegido"
        ],
        correctAnswer: 1,
        explanation: "El análisis de riesgo presupuestal identifica qué podría salir mal financieramente: un miembro que abandona el proyecto, costos de arte que duplican la estimación, o un motor que no soporta lo necesario. Planear respuestas a esos riesgos ANTES de que ocurran es lo que separa proyectos exitosos de los que quedan incompletos."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // ETAPA 6 — VALIDACIÓN, PRESENTACIÓN Y PITCH
  // ═══════════════════════════════════════════════════════
  {
    id: 6,
    title: "Validación y Pitch",
    subtitle: "Justifica tu presupuesto y presenta tu proyecto con claridad",
    icon: "trending-up",
    color: "#f59e0b",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    objective: "Aprender a justificar las decisiones presupuestales, comunicar el alcance y los costos del proyecto de forma clara y convincente, y presentar un pitch financiero estructurado.",
    topics: [
      "Justificación de decisiones presupuestales",
      "Comunicar costos de forma clara",
      "Argumentar prioridades de gasto",
      "Presentar alcance realista",
      "Reconocer limitaciones y riesgos",
      "Fortalezas del presupuesto",
      "Pitch financiero básico del videojuego"
    ],
    xpReward: 225,
    intro: {
      summary: "Un presupuesto sin justificación es solo una lista de números. El verdadero valor profesional está en poder explicar cada decisión financiera, anticipar objeciones y comunicar con claridad por qué tu proyecto es viable. Esta etapa te prepara para el pitch final de tu videojuego.",
      keyPoints: [
        "Justificar un gasto significa conectar el costo con un resultado específico o una ventaja estratégica, no simplemente decir que era necesario.",
        "Un pitch financiero convincente anticipa las preguntas difíciles: ¿por qué tan caro? ¿qué pasa si se acaba el dinero? ¿qué pueden recortar?",
        "Reconocer los riesgos y tener un plan de mitigación genera más credibilidad que presentar un presupuesto que parece perfecto e infalible.",
        "La estructura del pitch: contexto del proyecto → alcance → principales gastos justificados → riesgos y mitigación → por qué es viable.",
      ],
      realWorldContext: "En la industria, los pitches financieros no son solo para buscar inversión: los estudios los usan internamente para aprobar proyectos entre departamentos. Riot Games, CD Projekt y cualquier estudio mediano requieren pitches estructurados para autorizar cualquier proyecto nuevo. Esta habilidad es directamente transferible al mundo laboral.",
      pixelTip: "Cuando justifiques un gasto, sigue esta fórmula: 'Invertimos [monto] en [ítem] porque [razón específica que conecta con el éxito del proyecto]'. Evita justificaciones vagas como 'es necesario' o 'todo lo demás también lo hace'.",
      estimatedMinutes: 20,
    },
    activities: [
      {
        id: "6-1",
        type: "multiple-choice",
        title: "¿Qué pitch justifica mejor el presupuesto?",
        question: "Un equipo presenta su videojuego. ¿Cuál de estos argumentos justifica mejor una inversión de $3,000 en arte?",
        options: [
          { id: "a", text: "'El arte es muy importante para todos los juegos y necesitamos que se vea bonito'" },
          { id: "b", text: "'Invertimos $3,000 en arte porque nuestro género (plataformas casual) compite visualmente; la dirección de arte es el diferenciador clave que convierte a un visitante en comprador'" },
          { id: "c", text: "'El artista cobró $3,000 y no podíamos pagar menos porque así son los precios del mercado'" },
          { id: "d", text: "'Si no invertimos en arte ahora, tendremos que hacerlo después del lanzamiento, lo cual costará más'" }
        ],
        correctAnswer: 1,
        explanation: "La opción B justifica el gasto con argumentos específicos: el género del juego, la función del arte en la decisión de compra y la ventaja competitiva que aporta. Justificar un gasto es conectar el costo con un resultado medible o una decisión estratégica clara, no simplemente explicar que era necesario.",
        hint: "La mejor justificación conecta el GASTO con un RESULTADO específico o una VENTAJA ESTRATÉGICA concreta para el proyecto.",
        xp: 40
      },
      {
        id: "6-2",
        type: "order-steps",
        title: "Estructura de un pitch financiero",
        question: "Ordena los elementos de un pitch financiero de videojuego de la forma más efectiva y lógica:",
        items: [
          "Resumen del proyecto: qué es el juego y a quién va dirigido",
          "Alcance definido: qué incluye y qué no incluye el proyecto",
          "Desglose de costos por categoría con su justificación",
          "Análisis de riesgos y cómo se mitigarán",
          "Conclusión: por qué el proyecto es viable con este presupuesto"
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: "Un pitch financiero efectivo sigue una narrativa: primero contextualiza el proyecto (qué es), luego delimita su alcance (qué se hará), detalla los costos (cuánto costará y por qué), anticipa los riesgos (qué puede fallar) y cierra con la viabilidad (por qué va a funcionar). Esta estructura genera confianza y credibilidad.",
        hint: "Piensa en el pitch como una historia: contexto → qué se hará → cuánto costará → qué puede salir mal → por qué funcionará de todas formas.",
        xp: 40
      },
      {
        id: "6-3",
        type: "multiple-choice",
        title: "Respondiendo a una crítica",
        question: "Un evaluador dice: 'Su presupuesto de $200 en audio me parece insuficiente para un juego de aventura.' ¿Cuál es la mejor respuesta?",
        options: [
          { id: "a", text: "'Tiene razón, debimos haber pedido más dinero para audio desde el inicio'" },
          { id: "b", text: "'El audio no es importante en nuestro proyecto, así que $200 es más que suficiente'" },
          { id: "c", text: "'Usaremos $150 en licencias de música específica para nuestras escenas clave y $50 en efectos de Freesound. La música de exploración vendrá de Creative Commons para mantener el costo bajo sin sacrificar momentos críticos'" },
          { id: "d", text: "'Podemos subir el presupuesto de audio si usted nos da más financiamiento para el proyecto'" }
        ],
        correctAnswer: 2,
        explanation: "La respuesta C demuestra que el equipo pensó cómo optimizar el presupuesto de audio: priorizar la inversión donde más impacta (escenas clave) y usar recursos gratuitos donde se puede. Esta respuesta muestra planificación, conocimiento del tema y criterio financiero, que es exactamente lo que busca un evaluador.",
        hint: "La mejor respuesta demuestra que pensaste en CÓMO usar ese presupuesto estratégicamente, no solo cuánto tienes disponible.",
        xp: 40
      },
      {
        id: "6-4",
        type: "reflection",
        title: "Escribe tu pitch financiero",
        question: "Redacta el pitch financiero de tu videojuego. Incluye: resumen del proyecto, alcance definido, los 3 gastos principales con su justificación, un riesgo financiero identificado y por qué el proyecto es viable con tu presupuesto.",
        placeholder: "Ejemplo:\nPROYECTO: Plataformas 2D, 6 niveles, pixel art, sin multiplayer.\nALCANCE: Juego individual de ~1 hora, motor Godot, arte propio.\nPRINCIPALES GASTOS:\n  1. Arte de personajes ($200) — diferenciador visual clave.\n  2. Música licenciada ($80) — 3 pistas para zonas principales.\n  3. Testing con usuarios ($0) — 5 testers voluntarios.\nRIESGO: Retraso por bugs en el sistema de colisiones — mitigamos con 2 semanas de buffer.\nVIABILIDAD: El proyecto cuesta $280 + 160 horas de trabajo. Con nuestros recursos disponibles, es completamente realizable en 4 meses.",
        explanation: "Un pitch financiero bien escrito no necesita ser perfecto, necesita ser honesto, claro y fundamentado. Demostrar que conoces tus costos, has pensado en los riesgos y tienes un plan para ser viable genera más confianza que presentar números perfectos sin respaldo argumentado.",
        hint: "Sé específico con los números: di '$200 en arte' en lugar de 'algo de dinero para arte'. La especificidad demuestra que realmente planificaste.",
        xp: 70
      }
    ],
    quiz: [
      {
        id: "q6-1",
        question: "¿Cuál es el objetivo principal de un pitch financiero de videojuego académico?",
        options: [
          "Demostrar que el equipo puede gastar el presupuesto completo disponible",
          "Convencer a evaluadores de que el proyecto es viable, bien planificado y que el presupuesto es coherente con el alcance",
          "Mostrar el presupuesto más alto posible para demostrar ambición y escala del proyecto",
          "Explicar con detalle técnico cómo se programará cada sistema del videojuego"
        ],
        correctAnswer: 1,
        explanation: "Un pitch financiero busca demostrar viabilidad y coherencia. Los evaluadores no buscan el presupuesto más grande ni el más pequeño, sino el más bien justificado: que cada peso invertido tenga una razón clara y que el alcance sea alcanzable con esos recursos."
      },
      {
        id: "q6-2",
        question: "¿Qué elemento de un pitch financiero genera MÁS credibilidad ante un evaluador?",
        options: [
          "Un presupuesto muy alto que demuestre ambición y alcance del proyecto",
          "Reconocer honestamente las limitaciones del proyecto y explicar cómo se abordarán",
          "Afirmar que el equipo terminará el proyecto antes de lo planificado con el presupuesto actual",
          "Comparar el presupuesto con los de grandes estudios de videojuegos como referencia"
        ],
        correctAnswer: 1,
        explanation: "Los evaluadores valoran la madurez y el realismo. Reconocer limitaciones (tiempo, equipo, recursos) y explicar cómo se abordarán demuestra que el equipo ha pensado honestamente en el proyecto. La credibilidad viene de la honestidad, no de las promesas exageradas."
      },
      {
        id: "q6-3",
        question: "¿Qué significa 'justificar un gasto' en un presupuesto de videojuego?",
        options: [
          "Presentar recibos y facturas de todos los pagos realizados durante el proyecto",
          "Explicar por qué ese gasto específico contribuye directamente a los objetivos o calidad del proyecto",
          "Demostrar que el costo es más bajo que el precio de mercado promedio del sector",
          "Obtener la aprobación escrita de todos los miembros del equipo antes de gastar"
        ],
        correctAnswer: 1,
        explanation: "Justificar un gasto es conectar el costo con un beneficio concreto para el proyecto. '$500 en arte de personaje porque es el elemento visual más reconocible del juego y el que más aparece en marketing' es una justificación. '$500 porque lo necesitamos' no lo es."
      },
      {
        id: "q6-4",
        question: "¿Cuál es la debilidad más importante que un equipo debe reconocer al presentar su presupuesto?",
        options: [
          "Que los miembros del equipo no tienen suficiente experiencia profesional en la industria",
          "Las limitaciones reales de alcance, tiempo o recursos que podrían afectar el resultado final",
          "Que el juego podría no ser divertido para todos los tipos de jugadores del mercado",
          "Que existen otros juegos similares en el mercado con mayores presupuestos de producción"
        ],
        correctAnswer: 1,
        explanation: "Las limitaciones de alcance, tiempo y recursos son las más importantes de reconocer porque afectan directamente si el proyecto puede completarse. Un evaluador prefiere escuchar 'sabemos que tenemos solo 4 meses, por eso limitamos el proyecto a X' que descubrirlo después de que el proyecto no se entregó a tiempo."
      },
      {
        id: "q6-5",
        question: "¿Qué hace que un presupuesto de videojuego sea considerado 'bien distribuido'?",
        options: [
          "Que todas las categorías de gasto tengan exactamente el mismo porcentaje del presupuesto total",
          "Que la mayor parte del presupuesto esté en marketing para garantizar visibilidad al lanzamiento",
          "Que los gastos estén alineados con las prioridades del proyecto y que ninguna área crítica quede desfinanciada",
          "Que el presupuesto total sea el más alto posible para tener margen de error en todas las áreas"
        ],
        correctAnswer: 2,
        explanation: "Un presupuesto bien distribuido no busca igualdad entre áreas, sino coherencia con las prioridades. Un juego que compite en arte debe invertir más en arte; uno que compite en gameplay debe invertir más en programación. La clave es que las áreas críticas para el éxito del proyecto estén bien financiadas y ninguna quede completamente desatendida."
      }
    ]
  }
];

export const achievementsList = [
  { id: "first-step", title: "Primer Paso", description: "Completa tu primera actividad", icon: "star" },
  { id: "concept-master", title: "Ideador", description: "Aprueba el quiz de Concepto e Idea", icon: "lightbulb" },
  { id: "scope-pro", title: "Estratega de Alcance", description: "Completa la etapa de Alcance del Proyecto", icon: "maximize" },
  { id: "team-builder", title: "Líder de Equipo", description: "Completa la etapa de Recursos y Equipo", icon: "users" },
  { id: "cost-master", title: "Controlador de Costos", description: "Completa la etapa de Costos de Producción", icon: "banknote" },
  { id: "budget-pro", title: "Gestor de Presupuesto", description: "Completa la etapa de Presupuesto y Viabilidad", icon: "bar-chart" },
  { id: "pitcher", title: "Game Pitcher", description: "Completa todas las etapas del viaje", icon: "trending-up" },
  { id: "perfect-quiz", title: "Sin Errores", description: "Pasa un quiz completo sin fallar ninguna pregunta", icon: "gem" },
  { id: "streak-3", title: "En Racha", description: "3 respuestas correctas consecutivas", icon: "flame" },
];
