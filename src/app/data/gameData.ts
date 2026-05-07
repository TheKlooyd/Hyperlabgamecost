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
  // ETAPA 2 — DISEÑO DE MECÁNICAS
  // ═══════════════════════════════════════════════════════
  {
    id: 2,
    title: "Diseño de Mecánicas",
    subtitle: "Define cómo interactúa el jugador con el sistema de juego",
    icon: "gamepad-2",
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
    objective: "Comprender cómo se diseñan las mecánicas de un videojuego para que la interacción sea clara, entretenida y alineada con la visión del proyecto.",
    topics: [
      "Mecánica principal y mecánicas secundarias",
      "Verbos del jugador",
      "Bucle de juego (game loop)",
      "Retroalimentación al jugador",
      "Reglas y restricciones",
      "Equilibrio y curva de dificultad"
    ],
    xpReward: 175,
    intro: {
      summary: "Las mecánicas son el corazón de cualquier videojuego: son las acciones que el jugador puede realizar y las reglas que gobiernan el sistema. Un diseño de mecánicas claro define qué hace el jugador en cada momento, por qué lo hace y qué consecuencias tiene. Sin mecánicas bien pensadas, no hay experiencia de juego.",
      keyPoints: [
        "La mecánica principal es la acción más repetida del juego. En plataformas es saltar; en shooters es disparar. Todo lo demás gira en torno a ella.",
        "Los 'verbos del jugador' son las acciones disponibles: correr, saltar, atacar, construir. Menos verbos bien diseñados es mejor que muchos verbos confusos.",
        "El game loop es el ciclo básico de juego: el jugador recibe un desafío, actúa, recibe retroalimentación y pasa al siguiente desafío.",
        "La retroalimentación (feedback) es la respuesta del sistema a las acciones del jugador: sonidos, animaciones, puntos. Sin feedback claro, el jugador no sabe qué está haciendo bien o mal.",
      ],
      realWorldContext: "Super Mario Bros tiene exactamente un verbo principal: saltar. Todo el diseño de sus 32 niveles gira en torno a esa mecánica. La genialidad no está en la cantidad de mecánicas sino en la profundidad con la que se explora una sola. Tetris solo tiene 4 acciones posibles y es uno de los juegos más jugados de la historia.",
      pixelTip: "Al pensar en mecánicas, pregúntate: ¿qué hace el jugador en los primeros 30 segundos? Si no puedes responderlo en una sola frase, la mecánica no está suficientemente definida.",
      estimatedMinutes: 15,
    },
    activities: [
      {
        id: "2-1",
        type: "multiple-choice",
        title: "¿Cuál es la mecánica principal?",
        question: "Un equipo diseña un juego donde el jugador resuelve acertijos moviendo cajas para abrir puertas, evitar enemigos y activar interruptores. ¿Cuál es la mecánica principal?",
        options: [
          { id: "a", text: "Evitar a los enemigos que persiguen al personaje" },
          { id: "b", text: "Mover objetos del escenario para modificar el estado del nivel" },
          { id: "c", text: "Activar interruptores en el orden correcto" },
          { id: "d", text: "Abrir puertas para llegar a la salida del nivel" }
        ],
        correctAnswer: 1,
        explanation: "Mover objetos es la acción central de la que derivan todas las demás interacciones: los interruptores se activan moviéndolos, las puertas se abren como consecuencia, y los enemigos se evitan reubicando cajas. La mecánica principal es el verbo del que dependen los demás.",
        hint: "La mecánica principal es la acción más fundamental del juego. Las demás acciones son consecuencias o aplicaciones de esa acción base.",
        xp: 35
      },
      {
        id: "2-2",
        type: "multiple-choice",
        title: "Feedback al jugador",
        question: "Un jugador derrota a un enemigo en un juego de acción. ¿Cuál de estas respuestas del sistema comunica mejor el resultado de forma clara e inmediata?",
        options: [
          { id: "a", text: "Nada sucede visualmente; el contador de puntos sube en el menú de pausa" },
          { id: "b", text: "El enemigo desaparece, suena un efecto de victoria, aparece +50 puntos flotando y el personaje hace un gesto de celebración" },
          { id: "c", text: "Aparece un texto en pantalla que dice 'Enemigo eliminado. Consulta tu progreso en el menú principal'" },
          { id: "d", text: "El juego se pausa automáticamente para mostrar las estadísticas actualizadas del jugador" }
        ],
        correctAnswer: 1,
        explanation: "El buen feedback es inmediato, multisensorial y proporcional a la acción. La opción B combina visual (desaparición, puntos flotantes, animación), auditivo (efecto de sonido) e informativo (puntos). Las demás opciones interrumpen el flujo o son demasiado tardías para conectar con la acción del jugador.",
        hint: "El feedback efectivo ocurre en el momento exacto de la acción y usa más de un canal (visual + sonido + animación).",
        xp: 35
      },
      {
        id: "2-3",
        type: "order-steps",
        title: "El bucle de juego",
        question: "Ordena los elementos del game loop básico de un videojuego de plataformas en el orden correcto:",
        items: [
          "El jugador recibe el desafío del nivel (plataformas, enemigos, obstáculos)",
          "El jugador decide una acción y la ejecuta (saltar, moverse, atacar)",
          "El sistema evalúa la acción y actualiza el estado del juego",
          "El juego da retroalimentación inmediata al jugador (sonido, animación, puntos)",
          "Se presenta el siguiente desafío o se repite el ciclo"
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: "El game loop es el ciclo fundamental de toda experiencia de juego. Siempre comienza con un desafío que provoca una acción, el sistema evalúa esa acción, da retroalimentación y presenta el siguiente desafío. Este ciclo se repite cientos de veces en una sola sesión de juego.",
        hint: "El game loop sigue la lógica: desafío → acción del jugador → evaluación del sistema → feedback → nuevo desafío.",
        xp: 40
      },
      {
        id: "2-4",
        type: "reflection",
        title: "Define las mecánicas de tu juego",
        question: "Describe las mecánicas de tu videojuego: ¿cuál es el verbo principal del jugador?, ¿qué reglas gobiernan esa acción?, ¿cómo sabe el jugador si lo está haciendo bien o mal?, ¿cómo aumenta la dificultad progresivamente?",
        placeholder: "Ejemplo: 'El verbo principal es SALTAR. El jugador puede saltar sobre plataformas y enemigos. Si cae al vacío, pierde una vida. El feedback es un sonido de impacto y la pantalla parpadea en rojo. La dificultad aumenta reduciendo el tamaño de las plataformas y aumentando la velocidad de los enemigos...'",
        explanation: "Definir mecánicas con precisión evita la trampa del 'ya lo implementamos después'. Un diseñador que no puede describir en palabras cómo funciona su juego tampoco podrá implementarlo ni comunicarlo al equipo. La descripción escrita es la primera prueba de que la mecánica funciona.",
        hint: "Usa verbos concretos: el jugador SALTA, CONSTRUYE, DISPARA, CONECTA. Evita frases como 'el jugador interactúa con el entorno'.",
        xp: 50
      },
      {
        id: "2-5",
        type: "word-scramble",
        title: "Adivina el término",
        question: "Ordena las letras para formar el concepto clave de esta etapa:",
        word: "MECANICA",
        wordClue: "Regla o sistema que define qué puede hacer el jugador dentro del juego y cómo responde el sistema a sus acciones.",
        explanation: "Una MECÁNICA es el conjunto de reglas que define una interacción específica en el juego. El salto en plataformas, el turno en estrategia, el disparo en acción: cada uno es una mecánica con sus propias reglas, consecuencias y posibilidades.",
        hint: "La palabra tiene 8 letras y empieza con M. Es el concepto más fundamental del diseño de videojuegos.",
        xp: 30,
      },
      {
        id: "2-6",
        type: "true-false",
        title: "Verdadero o Falso: mecánicas",
        question: "Determina si el siguiente enunciado es verdadero o falso:",
        isTrue: false,
        explanation: "Más mecánicas no garantizan mejor experiencia. La sobrecarga de sistemas puede confundir al jugador y diluir la identidad del juego. Flappy Bird tiene una sola mecánica y fue el juego más descargado de su época. Tetris tiene cuatro acciones posibles. La profundidad de una mecánica bien diseñada supera en valor a la cantidad de mecánicas superficiales.",
        hint: "Piensa en los juegos más exitosos con una sola mecánica central: ¿la simpleza les restó valor o les dio identidad?",
        xp: 25,
      },
      {
        id: "2-7",
        type: "connect-concepts",
        title: "Elementos del diseño de mecánicas",
        question: "Conecta cada concepto de diseño de mecánicas con su descripción correcta.",
        pairs: [
          { left: "Verbo del jugador", right: "La acción principal que ejecuta el jugador: saltar, construir, disparar" },
          { left: "Game loop", right: "Ciclo repetitivo de desafío → acción → evaluación → feedback" },
          { left: "Curva de dificultad", right: "Progresión gradual del desafío para mantener al jugador en estado de flujo" },
          { left: "Feedback", right: "Respuesta inmediata del sistema ante la acción del jugador" },
        ],
        explanation: "Estos cuatro conceptos forman el núcleo del diseño de mecánicas. Sin verbos claros el jugador no sabe qué hacer; sin game loop no hay ritmo; sin curva de dificultad el juego se vuelve aburrido o frustrante; sin feedback el jugador no entiende las consecuencias de sus acciones.",
        hint: "El verbo es la acción, el game loop es el ciclo, la curva es la progresión y el feedback es la respuesta. Cada uno cumple una función diferente.",
        xp: 40,
      },
    ],
    quiz: [
      {
        id: "q2-1",
        question: "¿Qué es la mecánica principal de un videojuego?",
        options: [
          "El menú de inicio y las opciones de configuración del juego",
          "La acción más fundamental y repetida que define la interacción central del jugador con el sistema",
          "El motor gráfico que procesa las animaciones y efectos visuales del juego",
          "La historia principal que el jugador sigue a lo largo de la campaña"
        ],
        correctAnswer: 1,
        explanation: "La mecánica principal es el verbo central del juego: la acción que el jugador realiza más veces y que define la identidad del diseño. En plataformas es saltar, en shooters es apuntar y disparar, en puzzle es resolver. Todo el diseño de niveles y sistemas gira en torno a esta mecánica base."
      },
      {
        id: "q2-2",
        question: "¿Para qué sirve el 'game loop' en el diseño de un videojuego?",
        options: [
          "Para programar el ciclo de actualización del motor gráfico a 60 fotogramas por segundo",
          "Para definir el ciclo repetitivo de desafío, acción, evaluación y retroalimentación que estructura la experiencia",
          "Para crear un bucle infinito de niveles que evita que el juego tenga un final",
          "Para sincronizar los controles del jugador con la animación del personaje"
        ],
        correctAnswer: 1,
        explanation: "El game loop es la estructura fundamental de toda experiencia de juego: el jugador recibe un desafío, decide una acción, el sistema la evalúa y responde con feedback, y presenta el siguiente desafío. Este ciclo se repite cientos de veces por sesión y es lo que genera el ritmo y el engagement del juego."
      },
      {
        id: "q2-3",
        question: "¿Por qué es importante la retroalimentación (feedback) inmediata en un videojuego?",
        options: [
          "Porque los jugadores necesitan ver estadísticas detalladas de su rendimiento tras cada acción",
          "Porque sin respuesta inmediata del sistema, el jugador no puede conectar sus acciones con las consecuencias y pierde orientación",
          "Porque los efectos de sonido y animación hacen el juego visualmente más atractivo para marketing",
          "Porque el feedback es un requisito técnico del motor para mantener el juego sincronizado"
        ],
        correctAnswer: 1,
        explanation: "El feedback conecta causa (acción del jugador) con efecto (respuesta del sistema). Sin esa conexión inmediata, el jugador no puede aprender, no puede mejorar y no siente agencia sobre lo que ocurre. Un buen feedback es inmediato, proporcional a la acción y usa múltiples canales (visual + sonido)."
      },
      {
        id: "q2-4",
        question: "Un diseñador quiere que su juego sea accesible para nuevos jugadores pero desafiante para veteranos. ¿Qué herramienta de diseño usa?",
        options: [
          "Añadir más personajes jugables con habilidades diferentes para distintos niveles de habilidad",
          "Diseñar una curva de dificultad progresiva que gradualmente introduce y complejiza los desafíos",
          "Crear dos versiones del juego: una fácil para principiantes y una difícil para expertos",
          "Incluir un modo tutorial obligatorio antes de acceder al juego principal"
        ],
        correctAnswer: 1,
        explanation: "La curva de dificultad progresiva introduce primero los conceptos básicos y luego los combina y complejiza gradualmente. Esto permite que el jugador nuevo aprenda sin frustrarse y que el veterano encuentre desafíos crecientes. Es el principio de diseño que mantiene al jugador en 'estado de flujo'."
      },
      {
        id: "q2-5",
        question: "¿Qué significa diseñar 'menos mecánicas pero más profundas' en un videojuego?",
        options: [
          "Reducir el número de controles disponibles para que el juego sea más fácil de aprender",
          "Crear pocas acciones pero con múltiples aplicaciones, combinaciones y consecuencias que el jugador puede explorar",
          "Hacer niveles más cortos para que el jugador no tenga que aprender demasiado de una vez",
          "Limitar las mecánicas al mínimo para terminar el desarrollo más rápidamente"
        ],
        correctAnswer: 1,
        explanation: "Una mecánica profunda tiene muchas implicaciones a partir de una sola regla simple. En ajedrez, cada pieza tiene una regla de movimiento simple, pero sus combinaciones generan complejidad infinita. Diseñar pocas mecánicas con profundidad crea juegos más elegantes, más fáciles de aprender y más difíciles de dominar."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // ETAPA 3 — NARRATIVA Y MUNDO
  // ═══════════════════════════════════════════════════════
  {
    id: 3,
    title: "Narrativa y Mundo",
    subtitle: "Construye la historia, los personajes y el universo de tu videojuego",
    icon: "book-open",
    color: "#f97316",
    bgColor: "#fff7ed",
    borderColor: "#fed7aa",
    objective: "Diseñar la narrativa, los personajes y el mundo del videojuego de manera coherente y alineada con las mecánicas y la visión del proyecto.",
    topics: [
      "Historia principal y arco narrativo",
      "Diseño de personajes",
      "Construcción del mundo (worldbuilding)",
      "Narrativa ambiental",
      "Coherencia entre narrativa y mecánicas",
      "Tono y atmósfera del juego"
    ],
    xpReward: 175,
    intro: {
      summary: "La narrativa de un videojuego no es solo la historia que se cuenta: es el conjunto de historia, mundo, personajes, tono y atmósfera que le dan sentido a las mecánicas. El mejor diseño narrativo hace que las mecánicas sean una extensión natural de la historia y el mundo que habita el jugador.",
      keyPoints: [
        "El arco narrativo estructura la historia: situación inicial, conflicto, desarrollo, clímax y resolución. Sin estructura, la narrativa se fragmenta.",
        "Los personajes necesitan motivación clara: ¿qué quieren?, ¿qué los detiene?, ¿cómo cambian? Un personaje sin motivación es un muñeco con nombre.",
        "El worldbuilding define las reglas del universo: física, historia, cultura, facciones. Todo lo que el jugador ve debe tener coherencia interna.",
        "La narrativa ambiental cuenta la historia a través del entorno: un cartel roto, una ciudad abandonada, el tipo de vegetación. El mundo habla sin texto ni cinemáticas.",
      ],
      realWorldContext: "Dark Souls construye su lore casi sin diálogos: la historia se narra a través de descripciones de objetos, arquitectura y la disposición de los enemigos. Hollow Knight usa el mismo principio. Estos juegos demuestran que la narrativa más efectiva a veces es la que el jugador descubre, no la que le explican.",
      pixelTip: "Al diseñar tu narrativa, hazte siempre esta pregunta: ¿las mecánicas refuerzan la historia o contradicen al mundo? En un juego sobre la fragilidad de la vida, tener vidas infinitas rompe la coherencia narrativa.",
      estimatedMinutes: 15,
    },
    activities: [
      {
        id: "3-1",
        type: "multiple-choice",
        title: "Coherencia narrativa y mecánicas",
        question: "Un juego tiene como tema central 'la soledad del último ser humano en la Tierra'. ¿Qué mecánica es MÁS coherente con ese tema?",
        options: [
          { id: "a", text: "Modo multijugador cooperativo en línea con hasta 4 jugadores simultáneos" },
          { id: "b", text: "Un sistema de exploración en solitario donde el silencio y el aislamiento son parte del gameplay" },
          { id: "c", text: "Una tienda donde el jugador puede comprar aliados para que lo acompañen" },
          { id: "d", text: "Misiones de rescate de otros supervivientes para construir una comunidad" }
        ],
        correctAnswer: 1,
        explanation: "La coherencia entre narrativa y mecánica es fundamental. Si el tema es la soledad, el gameplay debe hacer sentir esa soledad al jugador. Las opciones A, C y D contradicen el tema añadiendo compañía y comunidad. La opción B convierte el tema en una experiencia mecánica, que es el objetivo del diseño narrativo-mecánico.",
        hint: "La mecánica debe ser una expresión física del tema. Pregúntate: ¿qué mecánica haría que el jugador SIENTA el tema central?",
        xp: 35
      },
      {
        id: "3-2",
        type: "order-steps",
        title: "El arco narrativo",
        question: "Ordena las etapas del arco narrativo clásico de un videojuego en el orden correcto:",
        items: [
          "Presentación del mundo y el protagonista en su estado inicial",
          "Aparece el conflicto o desequilibrio que motiva la aventura",
          "El protagonista enfrenta desafíos y crece a través de ellos",
          "Clímax: el enfrentamiento decisivo que concentra toda la tensión acumulada",
          "Resolución: el mundo cambia como consecuencia de las acciones del protagonista"
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: "El arco narrativo clásico sigue la estructura del viaje del héroe: primero conocemos al personaje y su mundo, luego algo lo desestabiliza, enfrenta dificultades que lo transforman, llega al punto de mayor tensión y finalmente resuelve el conflicto transformando el mundo. Esta estructura está presente en la mayoría de juegos narrativos exitosos.",
        hint: "La narrativa sigue una lógica emocional: primero presentas, luego generas conflicto, luego construyes tensión, llegas al pico y resuelves.",
        xp: 40
      },
      {
        id: "3-3",
        type: "multiple-choice",
        title: "Narrativa ambiental",
        question: "¿Qué es la 'narrativa ambiental' en el diseño de videojuegos?",
        options: [
          { id: "a", text: "Los diálogos y cinemáticas que explican la historia principal del juego" },
          { id: "b", text: "Contar la historia y el lore del mundo a través del diseño del entorno, objetos y escenarios sin texto explícito" },
          { id: "c", text: "Las descripciones del ambiente en el manual de usuario del juego" },
          { id: "d", text: "El sistema de clima dinámico que cambia el entorno durante el juego" }
        ],
        correctAnswer: 1,
        explanation: "La narrativa ambiental usa el entorno como narrador: una ciudad en ruinas dice que hubo una guerra, esqueletos alrededor de una puerta cerrada dicen que algo aterrador está detrás, una habitación con juguetes infantiles destruidos cuenta una historia de tragedia sin decir una sola palabra. Es la forma más inmersiva de narrar en videojuegos.",
        hint: "¿Cómo cuenta una historia el escenario físico sin necesidad de texto, diálogo ni cinemáticas?",
        xp: 35
      },
      {
        id: "3-4",
        type: "reflection",
        title: "Diseña la narrativa de tu juego",
        question: "Describe la narrativa de tu videojuego: ¿quién es el protagonista y qué quiere?, ¿cuál es el conflicto central?, ¿cómo es el mundo en el que ocurre la historia?, ¿cómo conecta la historia con las mecánicas del juego?",
        placeholder: "Ejemplo: 'El protagonista es una IA que despertó sin saber quién la creó. Quiere descubrir su origen. El conflicto es que las respuestas están bloqueadas en archivos que solo puede acceder resolviendo acertijos de lógica. El mundo es una estación espacial abandonada. La mecánica de puzzle refleja directamente la búsqueda de la IA por comprender su propio código...'",
        explanation: "Describir la narrativa en palabras es el primer paso para saber si tiene coherencia interna. Si no puedes explicar en pocas frases quién es el protagonista, qué quiere y qué se lo impide, la narrativa necesita más trabajo. La claridad en la descripción es síntoma de claridad en el diseño.",
        hint: "Usa esta estructura: [Protagonista] quiere [objetivo] pero [obstáculo]. La historia ocurre en [mundo]. Las mecánicas hacen que el jugador sienta [emoción o conflicto central].",
        xp: 50
      },
      {
        id: "3-5",
        type: "connect-concepts",
        title: "Elementos narrativos",
        question: "Conecta cada elemento narrativo con su función en el diseño del videojuego.",
        pairs: [
          { left: "Arco del personaje", right: "La transformación que sufre el protagonista a lo largo de la historia" },
          { left: "Worldbuilding", right: "La construcción coherente del universo, sus reglas, historia y cultura" },
          { left: "Narrativa ambiental", right: "Contar la historia a través del diseño del escenario y los objetos" },
          { left: "Tono narrativo", right: "La atmósfera emocional que define cómo se siente el mundo del juego" },
        ],
        explanation: "Estos cuatro elementos trabajan juntos para crear mundos coherentes y experiencias narrativas memorables. El arco da dirección emocional al personaje, el worldbuilding da coherencia al universo, la narrativa ambiental hace el mundo vivo sin interrumpir el gameplay, y el tono unifica toda la experiencia estética y emocional.",
        hint: "El arco es la transformación, el worldbuilding son las reglas del universo, la narrativa ambiental es el escenario que habla, y el tono es la atmósfera emocional.",
        xp: 40,
      },
      {
        id: "3-6",
        type: "true-false",
        title: "Verdadero o Falso: narrativa",
        question: "Determina si el siguiente enunciado es verdadero o falso:",
        isTrue: true,
        explanation: "Las mecánicas y la narrativa pueden y deben reforzarse mutuamente. En Journey, la mecánica de no poder comunicarse verbalmente con otros jugadores refuerza el tema de la conexión efímera. En Papers Please, la mecánica de revisar documentos repetitivamente refuerza la narrativa sobre la burocracia y el poder. Cuando mecánica y narrativa se alinean, la experiencia se vuelve significativa.",
        hint: "Piensa en juegos donde lo que haces con los controles y lo que cuenta la historia son la misma cosa expresada de formas distintas.",
        xp: 25,
      },
      {
        id: "3-7",
        type: "crossword",
        title: "Crucigrama de narrativa",
        question: "Completa el crucigrama con términos de diseño narrativo. Toca una pista para seleccionarla y escribe la respuesta.",
        crossword: {
          rows: 7,
          cols: 7,
          words: [
            {
              number: 1,
              direction: "across",
              clue: "Construcción del universo ficticio del juego: reglas, historia y cultura",
              answer: "LORE",
              row: 0,
              col: 0,
            },
            {
              number: 2,
              direction: "down",
              clue: "Evolución y cambio que experimenta el protagonista durante la historia",
              answer: "ARCO",
              row: 0,
              col: 2,
            },
            {
              number: 3,
              direction: "across",
              clue: "Atmósfera emocional que define cómo se siente el mundo del juego",
              answer: "TONO",
              row: 3,
              col: 1,
            },
          ],
        },
        explanation: "El LORE es el conjunto de conocimiento del universo del juego, el ARCO es la transformación del personaje y el TONO es la atmósfera emocional. Estos tres elementos forman la columna vertebral de cualquier diseño narrativo en videojuegos.",
        hint: "LORE tiene 4 letras (horizontal, fila 0). ARCO tiene 4 letras (vertical, columna 2). La O de LORE y la O inicial de ARCO se cruzan. TONO tiene 4 letras (horizontal, fila 3).",
        xp: 55,
      },
    ],
    quiz: [
      {
        id: "q3-1",
        question: "¿Qué es el 'worldbuilding' en el diseño de un videojuego?",
        options: [
          "El proceso técnico de construir los escenarios 3D del juego usando el motor gráfico",
          "La creación coherente del universo ficticio del juego: su historia, reglas, cultura y geografía",
          "El diseño del mapa o nivel por el que se desplaza el jugador durante el juego",
          "La generación procedural de mundos infinitos como en Minecraft o No Man's Sky"
        ],
        correctAnswer: 1,
        explanation: "El worldbuilding es la construcción del universo narrativo del juego: las leyes que lo rigen, su historia, las civilizaciones que lo habitan, su geografía y cultura. Un worldbuilding sólido hace que el mundo se sienta real y que cada elemento del diseño (arquitectura, enemigos, objetos) tenga coherencia interna."
      },
      {
        id: "q3-2",
        question: "¿Por qué es importante que un personaje tenga una motivación clara en el diseño narrativo?",
        options: [
          "Porque los evaluadores y jurados académicos siempre preguntan por la motivación del personaje",
          "Porque sin motivación el jugador no entiende por qué el personaje actúa, perdiendo conexión emocional con la historia",
          "Porque la motivación determina qué mecánicas puede usar el personaje en el juego",
          "Porque sin motivación el personaje no puede tener diálogos ni cinemáticas en el juego"
        ],
        correctAnswer: 1,
        explanation: "La motivación del personaje es el motor emocional de la historia: explica por qué hace lo que hace y qué tiene que perder. Sin motivación, el jugador no se conecta emocionalmente y la historia se siente vacía. Una motivación clara ('quiero salvar a mi hermana', 'quiero entender mi origen') da dirección a toda la narrativa."
      },
      {
        id: "q3-3",
        question: "¿Cuál es la ventaja de la narrativa ambiental sobre las cinemáticas tradicionales?",
        options: [
          "Que la narrativa ambiental es más barata de producir que las cinemáticas animadas",
          "Que mantiene al jugador activo y en control mientras descubre la historia, sin interrumpir el flujo del gameplay",
          "Que la narrativa ambiental puede contarse con menos trabajo de escritura y diseño",
          "Que los jugadores modernos prefieren leer carteles en el juego que ver cinemáticas"
        ],
        correctAnswer: 1,
        explanation: "La narrativa ambiental es no intrusiva: el jugador descubre la historia mientras juega, sin pausas forzadas. Dark Souls, Hollow Knight y Portal 2 usan este enfoque para construir mundos ricos sin cortar el flujo del gameplay. La historia se convierte en parte de la exploración, no un obstáculo entre sesiones de juego."
      },
      {
        id: "q3-4",
        question: "Un videojuego tiene como tema central 'el costo de la ambición'. ¿Qué elemento de diseño narrativo refuerza mejor ese tema?",
        options: [
          "Un protagonista que siempre tiene éxito en todo lo que intenta gracias a su gran talento",
          "Un sistema de progresión donde cuanto más poder obtiene el jugador, más pierde algo valioso",
          "Un mundo lleno de color y optimismo que contrasta con el tema serio del juego",
          "Un final múltiple donde todas las opciones llevan al mismo resultado positivo"
        ],
        correctAnswer: 1,
        explanation: "Un sistema de progresión donde el poder tiene un costo hace que el jugador EXPERIMENTE el tema en lugar de solo verlo. El jugador toma la decisión de ambicionar más poder y paga las consecuencias mecánicamente. Esto es 'ludonarrativa coherente': la mecánica y la narrativa cuentan la misma historia."
      },
      {
        id: "q3-5",
        question: "¿Qué es la 'disonancia ludonarrativa' en el diseño de videojuegos?",
        options: [
          "Cuando la música del juego no coincide con el tono visual de los escenarios",
          "Cuando las mecánicas del juego contradicen o entran en conflicto con la narrativa o el tema",
          "Cuando el jugador no entiende la historia por falta de información en el juego",
          "Cuando los diálogos del juego no están sincronizados con las animaciones de los personajes"
        ],
        correctAnswer: 1,
        explanation: "La disonancia ludonarrativa ocurre cuando lo que haces (mecánica) contradice lo que se cuenta (narrativa). El ejemplo clásico es Nathan Drake en Uncharted: es descrito como una persona buena y graciosa, pero el jugador mata a cientos de enemigos por nivel. Esa contradicción crea una ruptura inmersiva que debilita la credibilidad de la historia."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // ETAPA 4 — PLANIFICACIÓN DEL PROYECTO
  // ═══════════════════════════════════════════════════════
  {
    id: 4,
    title: "Planificación del Proyecto",
    subtitle: "Organiza las etapas, tareas y flujo de trabajo del desarrollo",
    icon: "clipboard-list",
    color: "#ec4899",
    bgColor: "#fdf2f8",
    borderColor: "#fbcfe8",
    objective: "Estructurar el proceso de desarrollo del videojuego en etapas claras, organizar tareas y visualizar el flujo de trabajo para que el proyecto avance de forma ordenada.",
    topics: [
      "Fases del desarrollo de videojuegos",
      "Desglose de tareas por área",
      "Priorización de funcionalidades",
      "Producto Mínimo Viable (MVP)",
      "Gestión del tiempo y milestones",
      "Control del alcance del proyecto"
    ],
    xpReward: 200,
    intro: {
      summary: "Un proyecto de videojuego sin planificación es un proyecto que se abandona. Planificar significa dividir el trabajo en etapas, definir qué se hace primero, establecer metas intermedias y saber exactamente cuándo el proyecto está 'terminado'. Esta etapa enseña a organizar el desarrollo de forma que el equipo sepa siempre qué hacer y qué viene después.",
      keyPoints: [
        "El desarrollo de videojuegos sigue fases: pre-producción (concepto, diseño), producción (construcción), alpha (funcional pero incompleto), beta (completo pero con errores) y lanzamiento.",
        "El MVP (Producto Mínimo Viable) es la versión más pequeña del juego que puede ser jugada y probada. Construirlo primero valida la idea antes de invertir más trabajo.",
        "Los milestones son metas intermedias que permiten medir el avance: 'al final de la semana 3, el personaje principal debe moverse en todas las direcciones'.",
        "La priorización es clave: no todas las tareas son igualmente urgentes. Las funcionalidades del núcleo del juego van primero; los extras van al final.",
      ],
      realWorldContext: "Minecraft lanzó como alfa con una sola mecánica: colocar y destruir bloques. No tenía objetivos, crafting complejo ni estructura. Esa versión mínima fue suficiente para validar que la idea funcionaba. El resto del juego se construyó sobre esa base a lo largo de años de desarrollo iterativo.",
      pixelTip: "Al planificar, piensa en qué puedes tener JUGABLE lo antes posible. Un juego simple que funciona es infinitamente más valioso que un diseño perfecto en papel que nadie puede jugar todavía.",
      estimatedMinutes: 18,
    },
    activities: [
      {
        id: "4-1",
        type: "multiple-choice",
        title: "¿Cuál es el primer paso del desarrollo?",
        question: "Un equipo quiere empezar a desarrollar su videojuego. ¿Cuál debería ser su primer paso?",
        options: [
          { id: "a", text: "Diseñar todos los niveles del juego antes de escribir una sola línea de código" },
          { id: "b", text: "Construir un prototipo jugable de la mecánica principal para validar que es divertida" },
          { id: "c", text: "Crear todos los assets de arte e ilustraciones antes de empezar la programación" },
          { id: "d", text: "Escribir el guion completo de la historia antes de empezar el diseño del juego" }
        ],
        correctAnswer: 1,
        explanation: "El prototipo de la mecánica principal es el primer paso porque valida la hipótesis más importante: ¿es divertido lo que el jugador hace? Si la mecánica no funciona, el resto del trabajo (arte, historia, niveles) no tiene sentido. Un prototipo rápido y feo que valide la diversión vale más que semanas de diseño sin probar.",
        hint: "¿Cuál de estas tareas te permite descubrir si el juego es divertido lo más rápido posible?",
        xp: 35
      },
      {
        id: "4-2",
        type: "order-steps",
        title: "Fases del desarrollo",
        question: "Ordena las fases del desarrollo de un videojuego en la secuencia correcta:",
        items: [
          "Pre-producción: definir concepto, mecánicas, narrativa y plan de desarrollo",
          "Prototipado: construir la mecánica mínima para validar la idea",
          "Producción: construir el juego completo con arte, audio y contenido",
          "Alpha: versión funcional completa pero con errores y sin pulir",
          "Beta y lanzamiento: corrección de errores, polish y publicación"
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: "Las fases del desarrollo siguen una lógica progresiva: primero se define (pre-producción), luego se valida la idea central (prototipado), luego se construye todo el contenido (producción), se tiene una versión funcional aunque imperfecta (alpha) y finalmente se pule y se publica (beta/lanzamiento). Saltarse fases tempranas genera retrabajos costosos.",
        hint: "El desarrollo va de lo abstracto (ideas en papel) a lo concreto (juego terminado), pasando por validaciones intermedias.",
        xp: 40
      },
      {
        id: "4-3",
        type: "multiple-choice",
        title: "¿Qué es el MVP?",
        question: "¿Qué caracteriza correctamente al Producto Mínimo Viable (MVP) de un videojuego?",
        options: [
          { id: "a", text: "La versión final del juego lista para publicar en tiendas digitales" },
          { id: "b", text: "La versión más pequeña y jugable que incluye solo la mecánica principal y permite probar si la idea funciona" },
          { id: "c", text: "Un documento de diseño que describe todas las características del juego terminado" },
          { id: "d", text: "El primer nivel completo del juego con todos sus assets definitivos de arte y sonido" }
        ],
        correctAnswer: 1,
        explanation: "El MVP es la versión más reducida del juego que aún puede ser jugada y evaluada. No necesita arte final, música, historia completa ni todos los niveles: necesita que la mecánica principal funcione y sea evaluable. Su propósito es validar la idea central antes de invertir semanas en construir algo que podría no funcionar.",
        hint: "El MVP no es el juego terminado ni el diseño en papel: es el mínimo que permite JUGAR y EVALUAR la idea central.",
        xp: 35
      },
      {
        id: "4-4",
        type: "reflection",
        title: "Planifica el desarrollo de tu juego",
        question: "Divide el desarrollo de tu videojuego en al menos 4 etapas o milestones. Para cada uno indica: qué estará terminado al final de esa etapa, quién es responsable de cada tarea y cuánto tiempo estimas que tomará.",
        placeholder: "Ejemplo:\nSEMANA 1-2 (Pre-producción): Documento de diseño finalizado, mecánica principal definida, referencias de arte seleccionadas. Responsable: todo el equipo.\nSEMANA 3-4 (Prototipo): Personaje que se mueve y salta. Primer nivel de prueba funcional. Responsable: programador.\nSEMANA 5-8 (Producción): 5 niveles con arte definitivo, sistema de puntos y audio básico. Responsable: programador + artista.\nSEMANA 9-10 (Polish y cierre): Corrección de bugs, pantallas de inicio y fin, testing con usuarios. Responsable: todo el equipo.",
        explanation: "Dividir el proyecto en milestones permite saber en todo momento si el proyecto va bien o está retrasado. Un equipo sin milestones no sabe cuándo terminará ni si tiene tiempo suficiente. Los milestones convierten un proyecto vago en una serie de metas concretas y verificables.",
        hint: "Cada milestone debe terminar con algo VISIBLE y EVALUABLE, no con 'avanzamos el 40%'. Ejemplo: 'el personaje puede correr y saltar' es un milestone concreto.",
        xp: 60
      },
      {
        id: "4-5",
        type: "word-scramble",
        title: "Adivina el término",
        question: "Ordena las letras para formar el concepto clave de esta etapa:",
        word: "MILESTONE",
        wordClue: "Meta intermedia del proyecto que marca un punto de avance verificable. Permite saber si el desarrollo va según lo planificado.",
        explanation: "Un MILESTONE (hito) es un punto de verificación en el cronograma del proyecto. No es una tarea: es un estado del proyecto. 'El jugador puede moverse, saltar y atacar' es un milestone. 'Programar el movimiento' es una tarea. Los milestones permiten medir el progreso real del proyecto.",
        hint: "La palabra tiene 9 letras, es un anglicismo del mundo de la gestión de proyectos y significa 'piedra milla' o 'hito'.",
        xp: 30,
      },
      {
        id: "4-6",
        type: "true-false",
        title: "Verdadero o Falso: planificación",
        question: "Determina si el siguiente enunciado es verdadero o falso:",
        isTrue: false,
        explanation: "Cambiar el diseño durante la producción no es señal de creatividad: es señal de falta de planificación. Cada cambio durante la producción puede invalidar trabajo ya realizado, desalinear al equipo y extender los plazos. La pre-producción existe precisamente para tomar esas decisiones antes de que el cambio sea costoso. Iterar en papel es gratis; iterar en código y arte cuesta tiempo.",
        hint: "Piensa en el costo de cambiar una decisión de diseño cuando ya hay arte, código y niveles construidos alrededor de ella.",
        xp: 25,
      },
      {
        id: "4-7",
        type: "connect-concepts",
        title: "Conceptos de planificación",
        question: "Conecta cada concepto de gestión de proyectos con su descripción correcta.",
        pairs: [
          { left: "Pre-producción", right: "Fase de diseño, planificación y definición antes de construir el juego" },
          { left: "MVP", right: "Versión mínima jugable que valida la idea central del proyecto" },
          { left: "Milestone", right: "Meta intermedia verificable que indica el avance del proyecto" },
          { left: "Scope creep", right: "Expansión no controlada del proyecto que añade tareas sin planificación" },
        ],
        explanation: "Estos cuatro conceptos definen el vocabulario básico de la planificación de proyectos de videojuegos. La pre-producción previene problemas, el MVP valida rápido, los milestones miden el avance y el scope creep es el enemigo de todo equipo que no sabe decir 'eso lo dejamos para la versión 2'.",
        hint: "Pre-producción es la fase, MVP es el producto, milestone es la meta y scope creep es el riesgo.",
        xp: 40,
      },
    ],
    quiz: [
      {
        id: "q4-1",
        question: "¿Cuál es el propósito principal de la fase de pre-producción en el desarrollo de un videojuego?",
        options: [
          "Construir la primera versión jugable del juego con sus mecánicas principales",
          "Definir el concepto, las mecánicas, la narrativa y el plan de trabajo antes de empezar a construir",
          "Probar el juego con usuarios externos para identificar problemas de jugabilidad",
          "Crear todos los assets de arte e ilustraciones que se usarán en el juego final"
        ],
        correctAnswer: 1,
        explanation: "La pre-producción es la fase de diseño y planificación: se define QUÉ se va a construir, CÓMO funcionará y en QUÉ orden se hará. Tomar estas decisiones antes de empezar a construir evita retrabajos costosos. Un equipo que salta la pre-producción generalmente termina rehaciendo trabajo varias veces."
      },
      {
        id: "q4-2",
        question: "¿Por qué es importante construir el MVP antes que el juego completo?",
        options: [
          "Porque el MVP es más fácil de mostrar en presentaciones y ferias de videojuegos",
          "Porque permite validar que la mecánica principal es divertida antes de invertir semanas en construir contenido sobre ella",
          "Porque los motores de videojuegos requieren una versión mínima antes de soportar proyectos más grandes",
          "Porque el MVP sirve como documentación técnica del proyecto para el equipo"
        ],
        correctAnswer: 1,
        explanation: "El MVP responde la pregunta más importante: ¿es divertida la idea central? Si el prototipo de la mecánica no es divertido, construir 10 niveles y un sistema de historia completo sobre esa mecánica sería un error. El MVP reduce el riesgo de gastar tiempo en una dirección equivocada."
      },
      {
        id: "q4-3",
        question: "Un equipo lleva 3 semanas desarrollando su juego y quiere saber si va bien. ¿Cuál es la mejor forma de evaluarlo?",
        options: [
          "Contar cuántas horas totales ha trabajado el equipo durante las 3 semanas",
          "Comparar el estado actual del proyecto con los milestones definidos en la planificación",
          "Preguntar a cada miembro del equipo si siente que el proyecto avanza bien",
          "Revisar cuántas líneas de código se han escrito hasta ese momento"
        ],
        correctAnswer: 1,
        explanation: "Los milestones son los puntos de verificación del proyecto. Si al final de la semana 3 el equipo planificó tener el movimiento del personaje funcionando y lo tiene, el proyecto va bien. Si no lo tiene, hay un retraso que debe gestionarse. Sin milestones definidos, la evaluación del avance es subjetiva e imprecisa."
      },
      {
        id: "q4-4",
        question: "¿Qué problema genera el 'scope creep' en un proyecto de videojuego?",
        options: [
          "Hace que el juego tenga demasiado contenido para que el jugador lo complete en una sola sesión",
          "Añade tareas y funcionalidades no planificadas que extienden el tiempo de desarrollo y desorganizan el equipo",
          "Genera conflictos entre los miembros del equipo por diferencias en la visión del proyecto",
          "Hace que el motor del juego sea más lento porque tiene que procesar más elementos simultáneamente"
        ],
        correctAnswer: 1,
        explanation: "El scope creep es el crecimiento no controlado del proyecto: 'ya que estamos, añadamos también esto'. Cada adición parece pequeña pero suma tiempo, complejidad y decisiones de diseño no planificadas. La suma de muchos 'pequeños extras' es frecuentemente la razón por la que proyectos no se terminan en el tiempo previsto."
      },
      {
        id: "q4-5",
        question: "¿En qué fase del desarrollo se debería decidir cuántos niveles tendrá el juego?",
        options: [
          "Durante la fase alpha, cuando ya se puede evaluar cuántos niveles caben en el tiempo restante",
          "Durante la pre-producción, para que toda la planificación posterior sea coherente con esa decisión",
          "Al final de la producción, cuando el equipo puede medir cuánto tiempo les tomó cada nivel",
          "Justo antes del lanzamiento, cuando se sabe exactamente qué está terminado y qué no"
        ],
        correctAnswer: 1,
        explanation: "La cantidad de niveles debe definirse en pre-producción porque condiciona toda la planificación: cuánto tiempo tomará, qué assets se necesitan, cuántas mecánicas deben funcionar. Decidirlo al final es como empezar a construir una casa sin saber cuántos pisos tendrá."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // ETAPA 5 — PROTOTIPADO Y PRUEBAS
  // ═══════════════════════════════════════════════════════
  {
    id: 5,
    title: "Prototipado y Pruebas",
    subtitle: "Construye, prueba e itera para mejorar la experiencia de juego",
    icon: "flask-conical",
    color: "#14b8a6",
    bgColor: "#f0fdfa",
    borderColor: "#99f6e4",
    objective: "Aprender a construir prototipos efectivos, realizar pruebas de jugabilidad y aplicar el proceso de iteración para mejorar el diseño del juego.",
    topics: [
      "Tipos de prototipos",
      "Pruebas de jugabilidad (playtesting)",
      "Iteración y mejora continua",
      "Identificar y documentar problemas",
      "Feedback de usuarios",
      "Criterios para tomar decisiones de diseño"
    ],
    xpReward: 200,
    intro: {
      summary: "Ningún juego sale bien en el primer intento. El prototipado y las pruebas son el proceso mediante el cual una idea se transforma en una experiencia real y disfrutable. Prototipar es construir versiones rápidas para aprender; testear es jugar para descubrir problemas; iterar es usar ese aprendizaje para mejorar. Este ciclo es el núcleo del diseño de juegos.",
      keyPoints: [
        "Un prototipo no necesita verse bien: necesita ser rápido de construir y fácil de probar. El objetivo es aprender, no impresionar.",
        "El playtesting con personas reales revela problemas que el equipo no puede ver porque conoce demasiado bien su propio juego.",
        "La iteración significa cambiar, probar, aprender y repetir. Un diseño que no se itera generalmente no es tan bueno como podría ser.",
        "El feedback de usuarios debe interpretarse: los jugadores dicen qué les frustró, pero el diseñador debe entender POR QUÉ y decidir cómo resolverlo.",
      ],
      realWorldContext: "Shigeru Miyamoto, creador de Mario y Zelda, es famoso por sus sesiones de playtesting intensivas. Super Mario Bros fue rediseñado múltiples veces basándose en observar a personas jugarlo. El concepto de 'Game Feel' (cómo se siente el juego al controlar el personaje) solo puede evaluarse jugando, no diseñando en papel.",
      pixelTip: "Al hacer playtesting, observa sin intervenir. Si el jugador se confunde, la solución no es explicarle: es rediseñar lo que lo confundió. Si necesitas explicar tu juego para que alguien lo entienda, hay un problema de diseño que resolver.",
      estimatedMinutes: 18,
    },
    activities: [
      {
        id: "5-1",
        type: "multiple-choice",
        title: "¿Qué prototipo construir primero?",
        question: "Un equipo diseña un juego de sigilo donde el jugador debe evitar guardias usando sombras y sonido. ¿Cuál es el prototipo más útil para validar la idea primero?",
        options: [
          { id: "a", text: "Un nivel completo con arte definitivo, música y todos los tipos de guardias planificados" },
          { id: "b", text: "Una habitación simple con un personaje, una sombra y un guardia para probar si la mecánica de sigilo se siente bien" },
          { id: "c", text: "Un documento de diseño detallado con todos los tipos de sigilo y sus variaciones" },
          { id: "d", text: "Una maqueta en papel del primer nivel con todas las rutas posibles de los guardias" }
        ],
        correctAnswer: 1,
        explanation: "El prototipo más útil es el que valida la hipótesis más importante con el menor trabajo posible. La pregunta clave es: ¿se siente bien el sigilo? Eso solo puede responderse jugándolo, no leyendo un documento. Una habitación simple con la mecánica básica es suficiente para saber si la dirección es correcta.",
        hint: "El mejor prototipo inicial es el más pequeño que permite JUGAR la mecánica principal. Todo lo demás viene después de validar que esa mecánica funciona.",
        xp: 40
      },
      {
        id: "5-2",
        type: "order-steps",
        title: "El ciclo de iteración",
        question: "Ordena las etapas del proceso de iteración en diseño de videojuegos en el orden correcto:",
        items: [
          "Diseñar o actualizar la versión del juego con la hipótesis de mejora",
          "Construir el prototipo o actualizar la versión existente",
          "Realizar sesiones de playtesting con usuarios",
          "Analizar el feedback y documentar los problemas encontrados",
          "Decidir qué cambiar y priorizar las mejoras más importantes"
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: "El ciclo de iteración es: diseñar → construir → testear → analizar → decidir → volver a diseñar. Este ciclo se repite hasta que el juego alcanza el nivel de calidad deseado. No existe un número 'correcto' de iteraciones: se itera hasta que el juego funciona como se espera.",
        hint: "La iteración sigue la lógica: primero piensas qué hacer, luego lo construyes, luego lo pruebas, analizas los resultados y decides qué mejorar.",
        xp: 40
      },
      {
        id: "5-3",
        type: "multiple-choice",
        title: "Leer el feedback correctamente",
        question: "Durante un playtesting, varios jugadores dicen 'el personaje se mueve muy lento'. ¿Cuál es la respuesta más correcta del equipo diseñador?",
        options: [
          { id: "a", text: "Duplicar inmediatamente la velocidad de movimiento del personaje en el código" },
          { id: "b", text: "Ignorar el feedback porque los testers no son el público objetivo del juego" },
          { id: "c", text: "Investigar si el problema es realmente la velocidad o si hay otra causa (falta de feedback visual, niveles demasiado grandes, controles confusos)" },
          { id: "d", text: "Añadir una opción de configuración en el menú para que cada jugador ajuste la velocidad manualmente" }
        ],
        correctAnswer: 2,
        explanation: "Los jugadores describen síntomas, no diagnósticos. 'Muy lento' puede significar velocidad baja, pero también puede significar que los niveles son demasiado grandes, que el feedback visual no comunica el movimiento correctamente, o que los controles no responden bien. El diseñador debe investigar la causa raíz antes de aplicar una solución.",
        hint: "Los jugadores te dicen qué sintieron, no qué está mal. Tu trabajo como diseñador es interpretar el síntoma y encontrar la causa real.",
        xp: 35
      },
      {
        id: "5-4",
        type: "reflection",
        title: "Diseña un plan de playtesting",
        question: "Diseña un plan de pruebas para tu videojuego: ¿qué aspectos específicos quieres probar?, ¿con qué tipo de jugadores harías el test?, ¿qué preguntas les harías después de jugar?, ¿cómo documentarías los problemas encontrados?",
        placeholder: "Ejemplo:\nASPECTOS A PROBAR: ¿La mecánica de salto es intuitiva? ¿El jugador entiende el objetivo sin que se lo expliquemos?\nPERFIL DE TESTERS: 3 personas que no conocen el juego, de 15-25 años, con experiencia básica en videojuegos.\nPREGUNTAS POST-TEST: ¿En qué momento te confundiste? ¿Qué parte te resultó más frustrante? ¿Qué parte disfrutaste más?\nDOCUMENTACIÓN: Tabla con: problema observado, frecuencia, posible causa, prioridad de corrección.",
        explanation: "Un plan de playtesting estructurado genera información útil, no solo opiniones generales. Saber exactamente qué probar, con qué tipo de usuario y cómo documentar los hallazgos permite tomar decisiones de diseño basadas en evidencia, no en intuición.",
        hint: "Observa a los jugadores sin intervenir. Si se confunden, no los ayudes: esa confusión es información valiosa que necesitas ver.",
        xp: 60
      }
    ],
    quiz: [
      {
        id: "q5-1",
        question: "¿Cuál es el objetivo principal de un prototipo en el desarrollo de videojuegos?",
        options: [
          "Crear una versión final del juego que pueda presentarse a inversores o evaluadores",
          "Aprender lo más rápido posible si una idea de diseño funciona, con el menor trabajo posible",
          "Demostrar las habilidades técnicas del programador del equipo en el motor elegido",
          "Producir una versión del juego que pueda publicarse en tiendas digitales para probar el mercado"
        ],
        correctAnswer: 1,
        explanation: "Un prototipo es una herramienta de aprendizaje rápido, no un producto terminado. Su propósito es responder una pregunta de diseño específica ('¿es divertida esta mecánica?') con el menor esfuerzo posible. Un buen prototipo puede ser feo, incompleto y lleno de placeholders; lo que importa es que permita evaluar la idea central."
      },
      {
        id: "q5-2",
        question: "¿Por qué es importante hacer playtesting con personas externas al equipo?",
        options: [
          "Porque los miembros del equipo no pueden jugar objetivamente su propio juego ya que conocen todos sus sistemas",
          "Porque las reglas de las competencias académicas de videojuegos exigen testers externos",
          "Porque los testers externos tienen más experiencia en videojuegos que los desarrolladores",
          "Porque los usuarios externos pueden ayudar a programar las correcciones identificadas"
        ],
        correctAnswer: 0,
        explanation: "El equipo tiene 'ceguera de diseñador': conoce tan bien el juego que no puede ver lo que confunde a alguien que lo juega por primera vez. Los problemas más obvios para un nuevo jugador son invisibles para quien diseñó el sistema. Los testers externos aportan la perspectiva del jugador real que el equipo ha perdido."
      },
      {
        id: "q5-3",
        question: "¿Qué significa 'iterar' en el proceso de diseño de videojuegos?",
        options: [
          "Repetir exactamente el mismo proceso de desarrollo para cada nivel del juego",
          "Aplicar cambios basados en pruebas y feedback, volver a probar y repetir el ciclo hasta mejorar el diseño",
          "Escribir el mismo código varias veces hasta que funcione correctamente sin errores",
          "Crear múltiples versiones del juego en paralelo y elegir la mejor al final"
        ],
        correctAnswer: 1,
        explanation: "La iteración es el ciclo diseñar → construir → probar → aprender → mejorar → volver a probar. No es repetición sin cambio: es refinamiento progresivo. Cada ciclo de iteración produce un diseño mejor porque incorpora lo aprendido en la prueba anterior. Los mejores juegos del mundo son el resultado de decenas de ciclos de iteración."
      },
      {
        id: "q5-4",
        question: "Durante una sesión de playtesting, un jugador abandona el nivel a los 2 minutos sin completarlo. ¿Cuál es la interpretación más útil?",
        options: [
          "El jugador no es el público objetivo del juego, así que el dato no es válido",
          "Hay un problema de diseño en esos primeros 2 minutos que debe identificarse y corregirse",
          "El jugador no tiene suficiente experiencia en videojuegos para apreciar el diseño del juego",
          "El nivel es demasiado largo y debe dividirse en partes más cortas"
        ],
        correctAnswer: 1,
        explanation: "Si un jugador abandona temprano, la hipótesis de diseño más probable es que algo en esos primeros minutos no funcionó: la curva de aprendizaje fue muy empinada, la mecánica no se comunicó bien, el desafío inicial fue frustrante o el objetivo no estaba claro. Ese dato es valioso y debe investigarse, no descartarse."
      },
      {
        id: "q5-5",
        question: "¿Qué diferencia un buen prototipo de un mal prototipo en diseño de videojuegos?",
        options: [
          "Un buen prototipo tiene arte definitivo y música; un mal prototipo usa placeholders visuales",
          "Un buen prototipo responde una pregunta específica de diseño; un mal prototipo intenta mostrar todo el juego a la vez",
          "Un buen prototipo es programado en el motor definitivo; un mal prototipo usa herramientas alternativas",
          "Un buen prototipo tarda semanas en construirse; un mal prototipo se hace en horas"
        ],
        correctAnswer: 1,
        explanation: "Un buen prototipo tiene un objetivo específico: probar si la mecánica de sigilo funciona, si la curva de dificultad del primer nivel es correcta, si el sistema de diálogos es claro. Un prototipo que intenta mostrar todo el juego al mismo tiempo no puede evaluar ninguna cosa bien. La especificidad es la clave de un prototipo útil."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // ETAPA 6 — PRESENTACIÓN DEL PROYECTO
  // ═══════════════════════════════════════════════════════
  {
    id: 6,
    title: "Presentación del Proyecto",
    subtitle: "Comunica y defiende el diseño de tu videojuego con claridad",
    icon: "presentation",
    color: "#f59e0b",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    objective: "Aprender a comunicar el diseño del videojuego de forma clara, estructurada y convincente, y a defender las decisiones tomadas durante el proceso de desarrollo.",
    topics: [
      "Estructura de una presentación de videojuego",
      "Comunicar mecánicas y narrativa",
      "Justificar decisiones de diseño",
      "Demostrar el prototipo",
      "Responder preguntas y críticas",
      "Documentación del proyecto (GDD)"
    ],
    xpReward: 225,
    intro: {
      summary: "Un videojuego que no puede comunicarse es un videojuego que no puede crecer. La presentación del proyecto es la habilidad de traducir meses de trabajo, decisiones y aprendizajes en una narrativa clara y convincente para cualquier audiencia: compañeros, evaluadores, colaboradores potenciales. Esta etapa te prepara para esa presentación.",
      keyPoints: [
        "Una buena presentación de videojuego sigue una estructura: qué es el juego, quién es el jugador ideal, cuál es la mecánica central, cuál es la narrativa, qué se ha construido hasta ahora y cuáles son los próximos pasos.",
        "Justificar una decisión de diseño significa conectar esa decisión con la visión del juego y la experiencia del jugador, no solo decir 'nos pareció bien'.",
        "El Game Design Document (GDD) es el documento que describe el juego completo: mecánicas, narrativa, niveles, personajes. Es la referencia central del equipo.",
        "Al responder críticas, la clave es distinguir entre críticas al diseño (válidas, requieren reflexión) y preferencias personales (no siempre aplicables al proyecto).",
      ],
      realWorldContext: "En la industria, los pitches de videojuegos son el primer filtro para conseguir financiamiento, distribución o atención de publishers. Estudios como A44, Devolver Digital y Raw Fury deciden con qué proyectos trabajar en base a presentaciones de pocos minutos. La claridad en la comunicación puede ser tan importante como la calidad del juego.",
      pixelTip: "Al presentar tu juego, empieza siempre por el 'por qué': ¿por qué alguien querría jugar esto? Si respondes esa pregunta en los primeros 30 segundos, ya tienes la atención de la audiencia.",
      estimatedMinutes: 20,
    },
    activities: [
      {
        id: "6-1",
        type: "multiple-choice",
        title: "¿Cómo empezar una presentación?",
        question: "Un equipo presenta su videojuego ante evaluadores. ¿Cuál es la mejor forma de comenzar la presentación?",
        options: [
          { id: "a", text: "'Nuestro juego usa el motor Godot 4.2 con un sistema de físicas personalizado y shaders procedurales'" },
          { id: "b", text: "'El jugador controla a un astronauta perdido que debe reconstruir su nave usando piezas de naves enemigas derrotadas. Cada pieza cambia sus capacidades'" },
          { id: "c", text: "'Empezamos este proyecto hace 3 meses con un equipo de 4 personas y ha sido un proceso muy desafiante'" },
          { id: "d", text: "'Nuestra presentación tiene 5 secciones: contexto, mecánicas, narrativa, proceso y conclusiones'" }
        ],
        correctAnswer: 1,
        explanation: "La mejor apertura es la que comunica la esencia del juego en forma concisa y evocadora. La opción B presenta al personaje, la mecánica principal y el diferenciador en dos frases. Las otras opciones empiezan con detalles técnicos, proceso o estructura de la presentación, que son menos relevantes para captar la atención de la audiencia.",
        hint: "La primera frase debe responder: ¿qué hace el jugador y qué lo hace único? Eso genera atención inmediata.",
        xp: 40
      },
      {
        id: "6-2",
        type: "order-steps",
        title: "Estructura de la presentación",
        question: "Ordena los elementos de una presentación de videojuego de la forma más efectiva:",
        items: [
          "Apertura: qué es el juego y por qué alguien querría jugarlo",
          "Mecánica principal: qué hace el jugador y cómo funciona el sistema",
          "Narrativa y mundo: la historia y el universo del juego",
          "Proceso y aprendizajes: qué se construyó, qué se aprendió y cómo se iteró",
          "Demo o prototipo: mostrar el juego funcionando en tiempo real"
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: "La estructura efectiva va de lo general a lo específico: primero enganchas con la esencia del juego, luego explicas cómo funciona, luego el mundo que habita, luego el proceso que llevó hasta aquí y finalmente lo demuestras en vivo. Terminar con la demo es poderoso porque permite que el juego hable por sí mismo.",
        hint: "La presentación es una historia: primero genera interés, luego explica, luego muestra evidencia y finalmente demuestra.",
        xp: 40
      },
      {
        id: "6-3",
        type: "multiple-choice",
        title: "Justificar una decisión de diseño",
        question: "Un evaluador pregunta: '¿Por qué el juego no tiene sistema de vidas y el jugador puede intentar los niveles infinitamente?' ¿Cuál es la mejor respuesta?",
        options: [
          { id: "a", text: "'Porque era más fácil de programar sin el sistema de vidas'" },
          { id: "b", text: "'Porque nos pareció más moderno y los juegos actuales no usan vidas'" },
          { id: "c", text: "'Porque nuestro diseño prioriza el aprendizaje sobre el castigo: el juego es un puzzle de exploración y las vidas generarían frustración que interrumpiría el proceso de descubrimiento'" },
          { id: "d", text: "'Podemos añadir vidas si el evaluador lo considera necesario para el proyecto'" }
        ],
        correctAnswer: 2,
        explanation: "La respuesta C conecta la decisión de diseño con la visión del juego y la experiencia del jugador. Cada elección de diseño debe poder justificarse con su impacto en la experiencia: 'decidimos X porque produce Y en el jugador'. Las otras respuestas dan razones técnicas, de tendencia o simplemente capitulación, ninguna de las cuales demuestra criterio de diseño.",
        hint: "Una buena justificación siempre conecta la decisión de diseño con el efecto que produce en la experiencia del jugador.",
        xp: 40
      },
      {
        id: "6-4",
        type: "reflection",
        title: "Escribe tu presentación del proyecto",
        question: "Redacta la presentación de tu videojuego cubriendo: apertura que capture la esencia del juego, descripción de la mecánica principal, resumen de la narrativa, una decisión de diseño que tomaste y cómo la justificas, y qué aprendiste durante el proceso de desarrollo.",
        placeholder: "Ejemplo:\nAPERTURA: Un robot olvidado que reconstruye su memoria resolviendo los acertijos que él mismo diseñó antes de perderla.\nMECÁNICA: El jugador reorganiza fragmentos de circuitos para crear rutas lógicas. Cada puzzle cambia la historia que el robot recuerda.\nNARRATIVA: Estación espacial abandonada. El robot es el único ser consciente. La historia se descubre resolviendo los puzzles, no a través de diálogos.\nDECISIÓN DE DISEÑO: Eliminamos el sistema de pistas. Justificación: el juego es sobre descubrimiento; las pistas habrían reducido la satisfacción de resolver el puzzle por cuenta propia.\nAPRENDIZAJE: En el primer playtesting descubrimos que el primer nivel era demasiado críptico. Lo rediseñamos para enseñar la mecánica básica antes de complicarla.",
        explanation: "Una presentación bien estructurada demuestra que el equipo tiene claridad sobre qué construyó, por qué tomó las decisiones que tomó y qué aprendió. Eso genera confianza. La confianza de un evaluador no viene de un juego perfecto: viene de un equipo que puede reflexionar honestamente sobre su proceso.",
        hint: "Sé específico en la decisión de diseño que justificas: no digas 'tomamos buenas decisiones', describe una decisión concreta y su impacto en la experiencia del jugador.",
        xp: 70
      }
    ],
    quiz: [
      {
        id: "q6-1",
        question: "¿Qué es un Game Design Document (GDD)?",
        options: [
          "Un contrato legal que protege la propiedad intelectual del videojuego ante terceros",
          "Un documento que describe el diseño completo del juego: mecánicas, narrativa, niveles y sistemas de referencia para el equipo",
          "Un manual de instrucciones que se incluye con el juego para que los jugadores entiendan cómo jugarlo",
          "Un formulario requerido por las tiendas digitales para publicar el juego comercialmente"
        ],
        correctAnswer: 1,
        explanation: "El GDD es la referencia central del equipo: describe qué es el juego, cómo funcionan sus mecánicas, cómo está estructurada su narrativa, qué contiene cada nivel y cuáles son las reglas del universo. No necesita ser perfecto desde el inicio: es un documento vivo que evoluciona con el proyecto."
      },
      {
        id: "q6-2",
        question: "¿Cuál es la característica más importante de una buena presentación de videojuego ante evaluadores?",
        options: [
          "Que incluya abundante terminología técnica para demostrar el conocimiento del equipo",
          "Que sea larga y detallada para cubrir todos los aspectos del proyecto en profundidad",
          "Que comunique claramente qué es el juego, qué hace el jugador y por qué la experiencia es valiosa",
          "Que incluya comparaciones con juegos comerciales exitosos para demostrar el potencial del proyecto"
        ],
        correctAnswer: 2,
        explanation: "Una buena presentación responde tres preguntas: ¿qué es el juego?, ¿qué hace el jugador? y ¿por qué vale la pena jugarlo? Si la audiencia puede responder esas tres preguntas al final de la presentación, fue exitosa. La longitud, la terminología técnica y las comparaciones son secundarias a la claridad."
      },
      {
        id: "q6-3",
        question: "¿Cómo se justifica correctamente una decisión de diseño durante una presentación?",
        options: [
          "Explicando el proceso técnico que hizo necesaria esa decisión para el funcionamiento del motor",
          "Conectando la decisión con su impacto en la experiencia del jugador y la visión del proyecto",
          "Mostrando que otros juegos populares tomaron la misma decisión anteriormente",
          "Describiendo el tiempo que el equipo invirtió en evaluar las alternativas antes de decidir"
        ],
        correctAnswer: 1,
        explanation: "Justificar una decisión de diseño es conectar causa (la elección) con efecto (la experiencia del jugador). 'Decidimos X porque produce Y en el jugador, y eso es coherente con la visión del juego'. Una justificación que no menciona al jugador o la visión del proyecto no es una justificación de diseño."
      },
      {
        id: "q6-4",
        question: "Un evaluador dice que la narrativa del juego es confusa. ¿Cuál es la respuesta más constructiva del equipo?",
        options: [
          "'La narrativa es intencional: buscamos que el jugador la interprete de formas distintas'",
          "'Agradecemos el feedback. ¿Puedes indicar en qué momento específico se generó la confusión? Eso nos ayuda a identificar qué necesita más claridad'",
          "'Creemos que el problema es que los evaluadores no son el público objetivo del juego'",
          "'Podemos reescribir la narrativa completamente si el evaluador lo considera necesario'"
        ],
        correctAnswer: 1,
        explanation: "La respuesta constructiva reconoce el feedback, pide información específica para poder actuar sobre él y lo enmarca como una oportunidad de mejora. Ni defensa a ultranza ni capitulación inmediata: investigación para entender la causa del problema y actuar desde esa comprensión."
      },
      {
        id: "q6-5",
        question: "¿Qué demuestra un equipo que puede explicar claramente qué aprendió durante el proceso de desarrollo?",
        options: [
          "Que el proceso fue especialmente difícil y que el equipo superó muchos obstáculos",
          "Que el equipo tiene capacidad de reflexión, iteración y mejora, que son las habilidades centrales del diseño de juegos",
          "Que el proyecto requirió más tiempo del planificado y que el equipo trabajó más horas de lo normal",
          "Que el equipo tiene experiencia previa en proyectos similares de videojuegos"
        ],
        correctAnswer: 1,
        explanation: "La capacidad de reflexionar sobre el proceso propio es la señal más clara de madurez en un diseñador de videojuegos. Los evaluadores buscan equipos que pueden aprender de sus errores, ajustar su dirección y mejorar iterativamente. Esas habilidades son más valiosas que un resultado perfecto obtenido sin dificultades."
      }
    ]
  }
];

export const achievementsList = [
  { id: "first-step", title: "Primer Paso", description: "Completa tu primera actividad", icon: "star" },
  { id: "concept-master", title: "Ideador", description: "Aprueba el quiz de Concepto e Idea", icon: "lightbulb" },
  { id: "mechanics-pro", title: "Diseñador de Mecánicas", description: "Completa la etapa de Diseño de Mecánicas", icon: "gamepad-2" },
  { id: "storyteller", title: "Narrador de Mundos", description: "Completa la etapa de Narrativa y Mundo", icon: "book-open" },
  { id: "planner", title: "Planificador Maestro", description: "Completa la etapa de Planificación del Proyecto", icon: "clipboard-list" },
  { id: "prototyper", title: "Prototipador Ágil", description: "Completa la etapa de Prototipado y Pruebas", icon: "flask-conical" },
  { id: "pitcher", title: "Game Presenter", description: "Completa todas las etapas del viaje", icon: "presentation" },
  { id: "perfect-quiz", title: "Sin Errores", description: "Pasa un quiz completo sin fallar ninguna pregunta", icon: "gem" },
  { id: "streak-3", title: "En Racha", description: "3 respuestas correctas consecutivas", icon: "flame" },
];
