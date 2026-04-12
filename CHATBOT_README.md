# Sistema de Chatbot Mejorado - Pixel

## Visión General

El chatbot "Pixel" es el compañero virtual del usuario durante todo el viaje de aprendizaje en "El viaje del videojuego". Ha sido completamente rediseñado para ofrecer una experiencia más amigable, motivadora y contextual.

## Características Principales

### 1. **Personalidad Rica y Cercana**
- **Nombre**: Pixel (tu compañero de viaje)
- **Tono**: Amigable, motivador, cercano y empático
- **Comunicación**: Mensajes cortos, claros y humanos
- **Rol**: Guía paso a paso que acompaña emocionalmente al usuario

### 2. **Estados del Chatbot**

El chatbot tiene 5 estados claramente definidos:

- **Bienvenida**: Saluda al usuario y lo introduce al sistema
- **Explicación**: Proporciona contexto sobre cada sección/etapa
- **Ayuda Contextual**: Ofrece consejos según la ubicación en la app
- **Feedback**: Celebra logros o motiva tras errores
- **Motivación**: Refuerza el progreso y la constancia

### 3. **Estados de Ánimo (Moods)**

Pixel cambia su estado visual según el tipo de mensaje:

- **Happy** (Azul): Mensajes motivacionales generales
- **Celebrating** (Naranja/Amarillo): Celebraciones de logros
- **Helping** (Morado): Consejos y ayuda práctica
- **Thinking** (Cyan): Explicaciones y conceptos profundos
- **Neutral** (Azul estándar): Información general

### 4. **Mensajes Contextuales Inteligentes**

El chatbot adapta sus mensajes según:

#### Por Ubicación:
- `/home` - Consejos sobre progreso general
- `/stages` - Explicación del sistema de etapas
- `/stage/1-6` - Tips específicos de cada etapa
- `/activity/*` - Ayuda durante actividades
- `/quiz/*` - Motivación antes y durante quizzes

#### Por Progreso:
- **0-50 XP**: Mensajes de ánimo para principiantes
- **500+ XP**: Reconocimiento del esfuerzo acumulado
- **1000+ XP**: Celebración de dedicación constante

#### Por Etapas Completadas:
- **0 etapas**: Bienvenida y primeros pasos
- **1 etapa**: Celebración de primera etapa
- **3 etapas**: Reconocimiento de haber llegado a la mitad
- **6 etapas**: Celebración de finalización completa

#### Por Rachas:
- **3+ respuestas correctas seguidas**: Reconocimiento de racha
- **5+ respuestas correctas seguidas**: Celebración especial

#### Por Logros:
- **3-6 logros**: Motivación de coleccionista
- **6+ logros**: Celebración de dedicación

### 5. **Chips de Acción Rápida**

Botones contextuales que permiten navegación rápida:

- **Ver etapas**: Navega a `/stages`
- **Ver logros**: Navega a `/profile`
- **Ver resumen**: Navega a `/results` (al completar todo)
- **Ir al inicio**: Navega a `/home`

### 6. **Microinteracciones**

- **Animación de entrada**: Escala y fade-in suave
- **Animación de salida**: Escala y fade-out
- **Transición de mensajes**: Cambio suave con fade
- **Avatar animado**: 
  - Rebote sutil cuando está pensando
  - Sacudida celebratoria cuando celebra
  - Flotación cuando está inactivo
- **Badge de notificación**: Pulso continuo hasta que el usuario abre el chatbot
- **Grip visual**: Indicador de que el chatbot es arrastrable

### 7. **Sistema de Navegación**

- **Múltiples mensajes**: El usuario puede navegar entre varios tips
- **Indicadores de página**: Puntos que muestran cuántos mensajes hay
- **Botones prev/next**: Navegación intuitiva
- **Tap directo**: Toca un indicador para saltar a ese mensaje

### 8. **Posicionamiento Inteligente**

- **Draggable**: El usuario puede arrastrar el chatbot a cualquier parte
- **Bounds checking**: No sale de los límites de la pantalla
- **Apertura adaptativa**: El panel se abre arriba o abajo según el espacio
- **Posición izquierda/derecha**: Se adapta al espacio disponible

## Diseño Visual

### Paleta de Colores

- **Fondo panel**: Blanco `#ffffff`
- **Bordes**: Gris claro `#e2e8f0`
- **Texto principal**: Gris oscuro `#334155`
- **Texto secundario**: Gris medio `#94a3b8`
- **Accent (Happy)**: Azul `#3b82f6` → Índigo `#6366f1`
- **Accent (Celebrating)**: Ámbar `#f59e0b` → Naranja `#f97316`
- **Accent (Helping)**: Violeta `#8b5cf6` → Púrpura `#a855f7`
- **Accent (Thinking)**: Cyan `#06b6d4` → Teal `#0891b2`

### Tipografía

- **Nombre (Pixel)**: 14px, peso 700
- **Subtítulo**: 11px, peso regular, color secundario
- **Mensaje**: 14px, line-height 1.7, color principal
- **Botones**: 13px, peso 600

### Bordes y Sombras

- **Panel**: border-radius 24px, sombra profunda
- **Avatar**: border-radius 50%, borde blanco 3px
- **Botones**: border-radius 10px, hover suave

## Integración con la App

### Uso Básico

El chatbot se integra automáticamente en el `MobileLayout`:

```tsx
<MobileLayout>
  {/* Contenido */}
</MobileLayout>
```

### Ocultar el Chatbot

En pantallas específicas (Splash, Onboarding, Feedback, etc.):

```tsx
<MobileLayout hideAssistant>
  {/* Contenido */}
</MobileLayout>
```

### Acceso al Contexto de la App

El chatbot usa el `AppContext` para acceder a:
- `state.xp`: XP acumulado
- `state.stageStatuses`: Estado de las etapas
- `state.consecutiveCorrect`: Racha de respuestas correctas
- `state.earnedAchievements`: Logros desbloqueados

## Mensajes Clave

### Por Etapa

**Etapa 1 - Concepto e Idea**:
- Enfoque en propuesta de valor
- Importancia del concepto claro
- Género y expectativas del jugador

**Etapa 2 - Alcance del Proyecto**:
- Relación alcance-costo
- Viabilidad vs ambición
- Scope creep y sus riesgos

**Etapa 3 - Recursos y Equipo**:
- Costo del talento humano
- Herramientas gratuitas
- Polivalencia en equipos pequeños

**Etapa 4 - Costos de Producción**:
- Costos fijos vs variables
- Distribución del presupuesto
- Costos ocultos comunes

**Etapa 5 - Viabilidad y Presupuesto**:
- Reserva para contingencias
- Proyectos viables vs ambiciosos
- Mejor terminado que grande a medias

**Etapa 6 - Pitch Financiero**:
- Transparencia presupuestal
- Honestidad sobre limitaciones
- Claridad > tamaño del presupuesto

## Mejores Prácticas de Uso

1. **Tocar el chatbot** cuando necesites ayuda contextual
2. **Navegar entre mensajes** para obtener diferentes perspectivas
3. **Usar los botones de acción** para navegación rápida
4. **Arrastrar el chatbot** si bloquea contenido importante
5. **Confiar en Pixel** como guía constante durante el viaje

## Diferencias con el Anterior

| Aspecto | Anterior (FloatingAssistant) | Nuevo (Chatbot) |
|---------|------------------------------|-----------------|
| Personalidad | Tips generales | Compañero con personalidad |
| Mensajes | Estáticos por contexto | Dinámicos según progreso |
| Estados visuales | Un solo estado | 5 moods diferentes |
| Interacción | Solo navegación | Navegación + acciones |
| Animaciones | Básicas | Ricas y expresivas |
| Contexto | Por ruta únicamente | Ruta + progreso + logros |
| Chips de acción | No | Sí, contextuales |
| Tono | Informativo | Motivador y empático |

## Notas Técnicas

- **Framework**: React 18 + Motion (Framer Motion)
- **Routing**: react-router v7
- **Iconos**: lucide-react
- **Gestos**: Pointer Events API
- **Estado**: React useState + useRef
- **Contexto**: AppContext personalizado

---

**Desarrollado para "El viaje del videojuego"** - Sistema educativo gamificado para enseñar presupuestación de videojuegos.
