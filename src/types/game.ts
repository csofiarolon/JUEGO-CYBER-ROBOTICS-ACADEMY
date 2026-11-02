// ==========================================
// CONTRATOS DE DATOS: CURRÍCULO PEDAGÓGICO
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
  analogia?: string;
  iconoPixelArt: PixelIconType;
  codigoSnippet?: string;
}

export interface Question {
  id: number;
  levelId: LevelId;
  modulo?: number;
  moduloNombre?: string;
  tituloDesafio: string;
  missionDescription: string;
  premisa?: string;
  codigoContexto?: string;
  opciones: [HardwareChip, HardwareChip, HardwareChip];
  correctComponents: string[]; // IDs de componentes correctos (ej: ['c1'])
  solucion?: string[];
  errorExplanation: {
    mensaje: string;
    causaRaizTecnica: string;
    recomendacionDoc: string;
  };
  pistaError?: {
    mensaje: string;
    tipoAnimacion?: string;
    detallesTecnicos: string;
    recomendacionDoc: string;
  };
  explicacionAcierto: string;
}

// Interfaz para preguntas crudas de módulos antes de ser adaptadas
export interface RawModuleQuestion {
  id: number;
  modulo: number;
  moduloNombre: string;
  tituloDesafio: string;
  premisa: string;
  codigoContexto?: string;
  opciones: any;
  solucion: string[];
  pistaError: {
    mensaje: string;
    tipoAnimacion?: string;
    detallesTecnicos: string;
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
// ESTADO DE LA MÁQUINA DE JUEGO (GAME STATE)
// ==========================================

export type GameStatus = 
  | 'welcome'     // Pantalla de bienvenida y onboarding inicial
  | 'theory'      // Fase obligatoria de micro-lección pedagógica previa al nivel
  | 'gameplay'    // Fase activa de resolución y ensamblaje de chips
  | 'feedback'    // Despliegue de telemetría de acierto o diagnóstico de fallo
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

export interface GameState {
  currentLevelIndex: number; // 0 a 5
  currentQuestionIndex: number; // 0 a 99
  unlockedLevel: number; // 1 a 6 (progresión secuencial estricta)
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
