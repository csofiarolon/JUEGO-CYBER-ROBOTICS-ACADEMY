# SPEC.MD — ESPECIFICACIÓN TÉCNICA Y PEDAGÓGICA (SDD)
## Taller de Cyber-Robótica: Onboarding MongoDB & Mongoose para Juniors
**Proyecto:** Cyber-Robotics MongoDB & Mongoose Academy  
**Lead Frontend Architect & Educational Game Designer:** Antigravity Architecture  
**Versión de la Especificación:** 2.0.0 (SDD - Spec-Driven Development)  
**Fecha:** Octubre 2026  

---

## 1. VISIÓN DEL SISTEMA Y METODOLOGÍA PEDAGÓGICA
El **Taller de Cyber-Robótica** es un entorno interactivo de capacitación técnica diseñado específicamente para desarrolladores juniors sin conocimientos previos en bases de datos NoSQL ni en el ODM Mongoose. 

A diferencia de un simulador genérico o un test tradicional, la plataforma adopta una **didáctica de micro-aprendizaje en dos tiempos obligatorios por cada módulo**:
1. **Fase de Micro-Lección Teórica (Antes de ensamblar):** El aspirante recibe una explicación limpia, directa y conceptualmente rigurosa de los fundamentos, con analogías industriales mecánicas (ej. colecciones vs. tablas, cintas de montaje para aggregation pipelines, etc.) y la presentación detallada de los 3 microchips disponibles.
2. **Fase de Reto / Ensamblaje Práctico:** El jugador aplica lo aprendido arrastrando los microchips correspondientes al **Slot de Ensamblaje del Robot**. El sistema valida de forma determinista y entrega feedback educativo inmediato (acierto o diagnóstico del colapso del reactor con su causa raíz técnica).

### Restricciones de Accesibilidad y UI/UX:
* **Cero Ruido Visual (Sin Scanlines):** Quedan terminantemente prohibidas las líneas CRT, scanlines, parpadeos o texturas rayadas.
* **Paleta Limpia de Alto Contraste:**
  * Fondo primario: `#0d1117` (Canvas espacial limpio)
  * Paneles y tarjetas: `#161b22` con bordes `#30363d`
  * Texto principal: `#f0f6fc` (máxima legibilidad)
  * Texto secundario / metadatos: `#8b949e`
  * Acentos funcionales: Verde terminal `#3fb950`, Ámbar de advertencia `#d29922`, Azul tecnológico `#58a6ff`, Rojo de fallo `#f85149`.
* **Pixel Art Focalizado:** El estilo pixel art queda restringido a los microchips de hardware y animaciones vectoriales de estado, manteniendo el resto de la interfaz con acabados modernos, limpios y accesibles.

---

## 2. ARQUITECTURA DE DATOS (DATA CONTRACTS)

```typescript
// ==========================================
// 1. DOMINIO CURRICULAR Y NIVELES
// ==========================================

export type LevelId = 1 | 2 | 3 | 4 | 5 | 6;

export type PixelIconType = 
  | 'microchip' 
  | 'ram' 
  | 'capacitor' 
  | 'pipeline' 
  | 'crystal' 
  | 'shield' 
  | 'diode' 
  | 'storage_controller';

export interface HardwareChip {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  analogia: string;
  iconoPixelArt: PixelIconType;
  codigoSnippet?: string;
}

export interface Question {
  id: number;
  levelId: LevelId;
  tituloDesafio: string;
  missionDescription: string;
  codigoContexto?: string;
  opciones: [HardwareChip, HardwareChip, HardwareChip];
  correctComponents: string[]; // IDs de componentes correctos (ej: ['c1'])
  errorExplanation: {
    mensaje: string;
    causaRaizTecnica: string;
    recomendacionDoc: string;
  };
  explicacionAcierto: string;
}

export interface LevelTheory {
  titulo: string;
  subtitulo: string;
  analogiaMecanica: string;
  puntosClave: {
    concepto: string;
    detalle: string;
    ejemplo?: string;
  }[];
}

export interface Level {
  id: LevelId;
  title: string;
  subtitulo: string;
  theorySummary: LevelTheory;
  components: [HardwareChip, HardwareChip, HardwareChip];
  questions: Question[];
}

// ==========================================
// 2. ESTADO DEL MOTOR DE JUEGO (GAME STATE)
// ==========================================

export type GameStatus = 
  | 'theory'      // Fase obligatoria: lectura pedagógica previa al nivel
  | 'gameplay'    // Fase activa: arrastre de microchips en el taller
  | 'feedback'    // Despliegue de telemetría de acierto o fallo
  | 'summary';    // Pantalla de certificación o reporte de recalibración

export interface UserAnswerRecord {
  questionId: number;
  levelId: LevelId;
  selectedComponentId: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface LevelProgress {
  levelId: LevelId;
  title: string;
  total: number;
  aciertos: number;
  fallos: number;
}

export interface GameState {
  currentLevelIndex: number; // 0 a 5 (Niveles 1 a 6)
  currentQuestionIndex: number; // 0 a 99 (Preguntas 1 a 100)
  score: number;
  totalQuestions: number;
  answeredCount: number;
  status: GameStatus;
  selectedComponent: HardwareChip | null;
  lastEvaluation: EvaluationResult | null;
  history: Record<number, UserAnswerRecord>;
  audioEnabled: boolean;
  viewingTheoryModal: boolean;
}

export interface EvaluationResult {
  isCorrect: boolean;
  questionId: number;
  selectedComponent: HardwareChip;
  expectedComponents: string[];
  feedbackMessage: string;
  technicalDetails: string;
}

export interface CertificationResult {
  aprobado: boolean;
  score: number;
  total: number;
  porcentaje: number;
  tituloBadge: string;
  rangoCybernetico: string;
  reporteNiveles: LevelProgress[];
  recomendacionesRecalibracion: string[];
}
```

---

## 3. CURVA PEDAGÓGICA INCREMENTAL (6 NIVELES)

### Nivel 1: Conceptos Básicos NoSQL (Fundamento Cero)
* **Teoría:** Qué es una base de datos NoSQL documental frente a una relacional SQL (tablas rígidas y filas normalizadas vs. colecciones y documentos BSON flexibles auto-contenidos). Cuándo embeber datos que se leen juntos.
* **Componentes del Nivel:** Document BSON Core, JSON Parser Module, Rigid SQL Table Adapter.
* **Desafíos:** Identificación de colecciones, estructuras BSON y modelado documental para principiantes.

### Nivel 2: Operaciones CRUD Básicas
* **Teoría:** Anatomía del identificador primario `_id` (ObjectId de 12 bytes con timestamp), consultas con filtros y proyecciones en `find()`, y modificaciones atómicas con `$set` (previene sobreescrituras) e `$inc` (evita race conditions en contadores).
* **Componentes del Nivel:** Atomic $set Modifier, Atomic $inc Counter, Full Overwrite Driver.
* **Desafíos:** Consultas seguras, manipulación de documentos y prevención de pérdida de datos.

### Nivel 3: Aggregation Framework (Tuberías de Datos)
* **Teoría:** La cinta de montaje secuencial de datos: etapas ordenadas. El filtro inicial `$match` (aprovecha índices), la agrupación `$group` con acumuladores (`$sum`, `$avg`), y la proyección final `$project`. Límite de 100MB de RAM por etapa (`allowDiskUse`).
* **Componentes del Nivel:** Assembly Stage $match, Grouping Accumulator $group, Raw V8 Javascript Pipe.
* **Desafíos:** Construcción de pipelines eficientes, optimización de etapas tempranas y uniones con `$lookup`.

### Nivel 4: Mongoose ODM y Modelado
* **Teoría:** Por qué necesitamos esquemas en Node.js sobre una base NoSQL flexible. Definición de SchemaTypes, validaciones obligatorias (tipos, rangos, regex), hooks `pre` y `post` (`save` vs `findOneAndUpdate`), y separación de capas (Modelos vs. Controladores).
* **Componentes del Nivel:** Mongoose Schema Validator, Plain POJO Lean Reader (.lean()), Loose Mixed Schema Bypass.
* **Desafíos:** Validación de esquemas, sanitización de entradas, activación de `{ runValidators: true }` y optimización de memoria.

### Nivel 5: Diseño de Esquemas (Embeber vs. Referenciar)
* **Teoría:** Criterio de lectura frecuente: 1:1 y 1:Pocos se embeben; 1:Muchos y 1:Infinito se referencian. El límite crítico de 16MB de BSON y el antipatrón de arrays no acotados (*Unbounded Arrays*). Uso de `.populate()` para hidratar referencias.
* **Componentes del Nivel:** Parent Reference Linker, Bounded Array Slicer ($slice), Infinite Unbounded Embedder.
* **Desafíos:** Diagnóstico de desbordamiento de 16MB, relaciones complejas, Subset Pattern y Bucket Pattern.

### Nivel 6: Rendimiento, Seguridad y Conexión
* **Teoría:** Índices B-Tree para saltar de escaneo lineal (`COLLSCAN`) a búsqueda logarítmica (`IXSCAN`). Análisis de `explain("executionStats")`. Regla ESR (Equality, Sort, Range). Prevención de inyección NoSQL (`$gt: ""`), resguardo de variables de entorno en `.env`, y gestión del pool de conexiones (`maxPoolSize`).
* **Componentes del Nivel:** B-Tree Index Accelerator, ESR Rule Composer, Insecure Root Connection.
* **Desafíos:** Optimización de queries lentas, auditoría con `$indexStats`, sanitización de peticiones y autenticación segura.

---

## 4. MATRIZ DE PRUEBAS DE QA (TEST PLAN)

| ID | Área / Funcionalidad | Precondición | Paso a Paso | Resultado Esperado | Atributo `data-testid` |
|---|---|---|---|---|---|
| **TC-00** | **Pantalla de Bienvenida (Onboarding)** | Primera carga o reinicio | El usuario ingresa a la aplicación | Se despliega modal de bienvenida con instructivo de 4 pasos y CTA `[ INICIAR CAPACITACIÓN ]` | `modal-welcome-onboarding`, `btn-start-training` |
| **TC-01** | **Fase de Teoría Obligatoria** | Iniciar juego o avanzar de nivel | Clic en `[ INICIAR CAPACITACIÓN ]` o nuevo nivel | La ventana modal de teoría (`TheoryModal`) se abre obligatoriamente antes de permitir ensamblar; explica conceptos desde cero. | `modal-theory-lesson`, `btn-start-level-assembly` |
| **TC-02** | **Consulta de Teoría en Partida** | Nivel activo en modo juego | Clic en el botón `[Teoría]` en la cabecera | Se despliega la lección del nivel actual sin perder el progreso ni la pregunta actual. | `btn-open-theory`, `modal-theory-lesson` |
| **TC-03** | **Drag & Drop al Reactor** | Nivel en modo `gameplay` | Arrastrar microchip desde la bandeja al slot central | El slot activa iluminación perimetral azul (`#58a6ff`). Al soltar, el chip queda acoplado. | `slot-robot-assembly`, `chip-draggable-{id}` |
| **TC-04** | **Click-to-Equip (Accesibilidad)** | Nivel en modo `gameplay` | Clic en el botón "ACOPLAR" de cualquier tarjeta | El chip se monta de forma inmediata en el slot sin necesidad de arrastre físico. | `btn-equip-chip-{id}`, `slot-robot-assembly` |
| **TC-05** | **Evaluación de Acierto** | Chip correcto acoplado | Clic en "Instalar Firmware" | Confirmación con acento verde (`#3fb950`), sonido sintetizado de éxito, score +1, botón de siguiente reto habilitado. | `btn-inject-firmware`, `hud-score-display`, `btn-next-question` |
| **TC-06** | **Evaluación de Fallo y Causa Raíz** | Chip incorrecto acoplado | Clic en "Instalar Firmware" | Slot activa borde rojo (`#f85149`), sonido de alerta, telemetría muestra explicación pedagógica de la causa raíz técnica. | `telemetry-error-alert`, `telemetry-root-cause` |
| **TC-07** | **Persistencia LocalStorage** | Responder 20 preguntas con aciertos y fallos | Recargar la pestaña del navegador (`F5`) | Se reanuda en el mismo nivel, misma pregunta, conservando el score exacto y el historial. | Clave: `CYBER_ROBOTICS_ACADEMY_v8` |
| **TC-08** | **Umbral de Aprobación (>= 70/100)** | Completar pregunta 100 con `score >= 70` | Inyectar última respuesta | Se abre `CertificationBadge` con la insignia dorada oficial: **"FIRMWARE CERTIFICADO: INGRESO AL EQUIPO BACKEND AUTORIZADO"**. | `modal-certification-success`, `badge-certified-firmware` |
| **TC-09** | **Umbral de Reprobación (< 70/100)** | Completar pregunta 100 con `score < 70` | Inyectar última respuesta | Se abre reporte de diagnóstico indicando los niveles específicos con menor rendimiento y consejos de recalibración. | `modal-certification-failure`, `btn-recalibrate-system` |
| **TC-10** | **Reinicio Total de Fábrica** | Cualquier estado | Clic en botón de purgar y confirmar diálogo | `localStorage` se limpia, vuelve a la pantalla de bienvenida con score 0. | `btn-factory-reset` |
