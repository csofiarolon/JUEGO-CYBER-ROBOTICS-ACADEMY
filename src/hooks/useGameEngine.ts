import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  GameState, 
  GameStatus, 
  HardwareChip, 
  EvaluationResult, 
  CertificationResult, 
  UserAnswerRecord, 
  LevelProgress, 
  Question 
} from '../types/game';
import { CURRICULUM_LEVELS, ALL_100_QUESTIONS, TOTAL_QUESTIONS_COUNT } from '../data/curriculum';
import { soundFx } from '../utils/soundFx';

const STORAGE_KEY = 'CYBER_ROBOTICS_ACADEMY_v8';

// ==========================================
// 1. FUNCIONES PURAS DETERMINISTAS
// ==========================================

export function evaluateAnswer(
  question: Question,
  selectedChip: HardwareChip
): EvaluationResult {
  const isCorrect = question.correctComponents.includes(selectedChip.id);

  if (isCorrect) {
    return {
      isCorrect: true,
      questionId: question.id,
      selectedComponent: selectedChip,
      expectedComponents: question.correctComponents,
      feedbackMessage: `¡INTEGRACIÓN CORRECTA! ${question.explicacionAcierto}`,
      technicalDetails: 'Parámetros de arquitectura y sintaxis alineados según las especificaciones del manual de MongoDB.',
    };
  }

  return {
    isCorrect: false,
    questionId: question.id,
    selectedComponent: selectedChip,
    expectedComponents: question.correctComponents,
    feedbackMessage: `¡ANOMALÍA EN EL ENSAMBLAJE! ${question.errorExplanation.mensaje}`,
    technicalDetails: question.errorExplanation.causaRaizTecnica,
  };
}

export function calculateCertification(
  score: number,
  total: number,
  history: Record<number, UserAnswerRecord>
): CertificationResult {
  const aprobado = score >= 70;
  const porcentaje = Math.round((score / total) * 100);

  const reporteNiveles: LevelProgress[] = CURRICULUM_LEVELS.map((lvl) => {
    let aciertos = 0;
    let fallos = 0;

    lvl.questions.forEach((q) => {
      const rec = history[q.id];
      if (rec) {
        if (rec.isCorrect) aciertos++;
        else fallos++;
      }
    });

    return {
      levelId: lvl.id,
      title: lvl.title,
      total: lvl.questions.length,
      aciertos,
      fallos,
    };
  });

  const recomendacionesRecalibracion: string[] = [];
  reporteNiveles.forEach((lvl) => {
    const answered = lvl.aciertos + lvl.fallos;
    const ratio = answered > 0 ? lvl.aciertos / lvl.total : 0;
    if (ratio < 0.7) {
      switch (lvl.levelId) {
        case 1:
          recomendacionesRecalibracion.push('Nivel 1 (NoSQL Básico): Repasar colecciones vs tablas, estructura BSON y el límite estricto de 16MB.');
          break;
        case 2:
          recomendacionesRecalibracion.push('Nivel 2 (CRUD Básico): Reforzar uso obligatorio de $set en updates y $inc para evitar race conditions en contadores.');
          break;
        case 3:
          recomendacionesRecalibracion.push('Nivel 3 (Aggregation): Colocar $match como primera etapa para aprovechar índices y repasar $group con acumuladores.');
          break;
        case 4:
          recomendacionesRecalibracion.push('Nivel 4 (Mongoose): Activar { runValidators: true } en updateOne/findOneAndUpdate y optimizar lecturas con .lean().');
          break;
        case 5:
          recomendacionesRecalibracion.push('Nivel 5 (Modelado): Evitar el antipatrón de arrays infinitos (Unbounded Arrays) y usar referencias con .populate().');
          break;
        case 6:
          recomendacionesRecalibracion.push('Nivel 6 (Performance & Seguridad): Dominar índices B-Tree (IXSCAN vs COLLSCAN), regla ESR y protección de credenciales en .env.');
          break;
      }
    }
  });

  return {
    aprobado,
    score,
    total,
    porcentaje,
    tituloBadge: aprobado
      ? 'FIRMWARE CERTIFICADO: INGRESO AL EQUIPO BACKEND AUTORIZADO'
      : 'CALIBRACIÓN INCOMPLETA: ACCESO DENEGADO',
    rangoCybernetico: aprobado
      ? 'Junior Backend Developer (MongoDB Certified)'
      : 'Aspirante en Fase de Entrenamiento',
    reporteNiveles,
    recomendacionesRecalibracion,
  };
}

// ==========================================
// 2. HOOK useGameEngine
// ==========================================

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Solo restaurar si el usuario ya inició explícitamente y no está en welcome
        if (parsed.hasStarted && parsed.status !== 'welcome') {
          return {
            currentLevelIndex: parsed.currentLevelIndex || 0,
            currentQuestionIndex: parsed.currentQuestionIndex || 0,
            unlockedLevel: parsed.unlockedLevel || 1,
            score: parsed.score || 0,
            totalQuestions: TOTAL_QUESTIONS_COUNT,
            answeredCount: parsed.answeredCount || 0,
            status: parsed.status === 'summary' ? 'summary' : 'gameplay',
            selectedComponent: null,
            lastEvaluation: parsed.lastEvaluation || null,
            history: parsed.history || {},
            audioEnabled: parsed.audioEnabled !== undefined ? parsed.audioEnabled : true,
            viewingTheoryModal: false,
          };
        }
      } catch (e) {
        console.error('Error restaurando progreso previo:', e);
      }
    }

    // Estado inicial limpio obligatorio: Splash screen de bienvenida
    return {
      currentLevelIndex: 0,
      currentQuestionIndex: 0,
      unlockedLevel: 1,
      score: 0,
      totalQuestions: TOTAL_QUESTIONS_COUNT,
      answeredCount: 0,
      status: 'welcome',
      selectedComponent: null,
      lastEvaluation: null,
      history: {},
      audioEnabled: true,
      viewingTheoryModal: false,
    };
  });

  // Persistir estado en LocalStorage de forma reactiva
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          hasStarted: gameState.status !== 'welcome',
          currentLevelIndex: gameState.currentLevelIndex,
          currentQuestionIndex: gameState.currentQuestionIndex,
          unlockedLevel: gameState.unlockedLevel,
          score: gameState.score,
          answeredCount: gameState.answeredCount,
          history: gameState.history,
          audioEnabled: gameState.audioEnabled,
          lastEvaluation: gameState.lastEvaluation,
          status: gameState.status,
        })
      );
    } catch (e) {
      console.warn('Fallo al guardar en localStorage:', e);
    }
  }, [
    gameState.currentLevelIndex, 
    gameState.currentQuestionIndex, 
    gameState.unlockedLevel,
    gameState.score, 
    gameState.answeredCount, 
    gameState.history, 
    gameState.audioEnabled, 
    gameState.lastEvaluation, 
    gameState.status
  ]);

  useEffect(() => {
    soundFx.setMuted(!gameState.audioEnabled);
  }, [gameState.audioEnabled]);

  const currentLevel = useMemo(() => {
    return CURRICULUM_LEVELS[gameState.currentLevelIndex] || CURRICULUM_LEVELS[0];
  }, [gameState.currentLevelIndex]);

  const currentQuestion = useMemo(() => {
    return ALL_100_QUESTIONS[gameState.currentQuestionIndex] || ALL_100_QUESTIONS[0];
  }, [gameState.currentQuestionIndex]);

  const certification = useMemo(() => {
    return calculateCertification(gameState.score, TOTAL_QUESTIONS_COUNT, gameState.history);
  }, [gameState.score, gameState.history]);

  // Iniciar capacitación desde la Splash Screen de bienvenida -> Nivel 1 Teoría
  const startTraining = useCallback(() => {
    soundFx.playBlip(750, 0.08);
    setGameState((prev) => ({
      ...prev,
      currentLevelIndex: 0,
      currentQuestionIndex: 0,
      status: 'theory',
      viewingTheoryModal: true,
      selectedComponent: null,
      lastEvaluation: null,
    }));
  }, []);

  // Completar lectura de teoría y comenzar ensamblaje
  const startLevelAssembly = useCallback(() => {
    soundFx.playBlip(720, 0.08);
    setGameState((prev) => ({
      ...prev,
      status: 'gameplay',
      viewingTheoryModal: false,
      selectedComponent: null,
      lastEvaluation: null,
    }));
  }, []);

  // Abrir manual de teoría del nivel en cualquier momento
  const openTheoryModal = useCallback(() => {
    soundFx.playBlip(600, 0.05);
    setGameState((prev) => ({
      ...prev,
      viewingTheoryModal: true,
    }));
  }, []);

  const closeTheoryModal = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      viewingTheoryModal: false,
    }));
  }, []);

  // Seleccionar o soltar chip
  const selectChip = useCallback((chip: HardwareChip) => {
    soundFx.playBlip(880, 0.04);
    setGameState((prev) => ({
      ...prev,
      selectedComponent: chip,
    }));
  }, []);

  const dropChip = useCallback((chip: HardwareChip) => {
    soundFx.playBlip(980, 0.05);
    setGameState((prev) => ({
      ...prev,
      selectedComponent: chip,
    }));
  }, []);

  const unmountChip = useCallback(() => {
    soundFx.playBlip(440, 0.04);
    setGameState((prev) => ({
      ...prev,
      selectedComponent: null,
    }));
  }, []);

  // Inyección y evaluación de firmware
  const injectFirmware = useCallback(() => {
    if (!gameState.selectedComponent) return;

    const evaluation = evaluateAnswer(currentQuestion, gameState.selectedComponent);

    if (evaluation.isCorrect) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }

    const questionId = currentQuestion.id;
    const isNewAnswer = !gameState.history[questionId];
    const wasPreviouslyCorrect = gameState.history[questionId]?.isCorrect;

    let newScore = gameState.score;
    if (isNewAnswer) {
      if (evaluation.isCorrect) newScore += 1;
    } else {
      if (!wasPreviouslyCorrect && evaluation.isCorrect) {
        newScore += 1;
      } else if (wasPreviouslyCorrect && !evaluation.isCorrect) {
        newScore = Math.max(0, newScore - 1);
      }
    }

    const newHistory: Record<number, UserAnswerRecord> = {
      ...gameState.history,
      [questionId]: {
        questionId,
        levelId: currentQuestion.levelId,
        selectedComponentId: gameState.selectedComponent.id,
        isCorrect: evaluation.isCorrect,
        timestamp: Date.now(),
      },
    };

    setGameState((prev) => ({
      ...prev,
      score: newScore,
      answeredCount: Object.keys(newHistory).length,
      history: newHistory,
      lastEvaluation: evaluation,
      status: 'feedback',
    }));
  }, [gameState.selectedComponent, currentQuestion, gameState.score, gameState.history]);

  // Avanzar a la siguiente pregunta con desbloqueo y progresión estricta
  const nextQuestion = useCallback(() => {
    soundFx.playBlip(620, 0.05);

    setGameState((prev) => {
      const nextQIndex = prev.currentQuestionIndex + 1;

      // Si completó las 100 preguntas
      if (nextQIndex >= TOTAL_QUESTIONS_COUNT) {
        soundFx.playFanfare();
        return {
          ...prev,
          status: 'summary',
          selectedComponent: null,
          lastEvaluation: null,
        };
      }

      const nextQuestionItem = ALL_100_QUESTIONS[nextQIndex];
      const nextLevelIndex = nextQuestionItem ? nextQuestionItem.levelId - 1 : prev.currentLevelIndex;
      const isNewLevel = nextLevelIndex !== prev.currentLevelIndex;
      const nextLevelId = nextLevelIndex + 1;

      // Desbloquear el nuevo nivel secuencial
      const updatedUnlockedLevel = Math.max(prev.unlockedLevel, nextLevelId);

      return {
        ...prev,
        currentQuestionIndex: nextQIndex,
        currentLevelIndex: nextLevelIndex,
        unlockedLevel: updatedUnlockedLevel,
        selectedComponent: null,
        lastEvaluation: null,
        // Al entrar a un nuevo nivel, desplegar obligatoriamente la teoría
        status: isNewLevel ? 'theory' : 'gameplay',
        viewingTheoryModal: isNewLevel,
      };
    });
  }, []);

  const prevQuestion = useCallback(() => {
    soundFx.playBlip(520, 0.05);
    setGameState((prev) => {
      if (prev.currentQuestionIndex <= 0) return prev;
      const prevQIndex = prev.currentQuestionIndex - 1;
      const prevQuestionItem = ALL_100_QUESTIONS[prevQIndex];
      const prevLevelIndex = prevQuestionItem ? prevQuestionItem.levelId - 1 : prev.currentLevelIndex;

      return {
        ...prev,
        currentQuestionIndex: prevQIndex,
        currentLevelIndex: prevLevelIndex,
        selectedComponent: null,
        lastEvaluation: null,
        status: 'gameplay',
        viewingTheoryModal: false,
      };
    });
  }, []);

  // Salto de nivel con respeto a la progresión desbloqueada
  const jumpToLevel = useCallback((lvlId: number) => {
    const targetQIndex = ALL_100_QUESTIONS.findIndex((q) => q.levelId === lvlId);
    if (targetQIndex !== -1) {
      soundFx.playBlip(750, 0.05);
      setGameState((prev) => {
        const canAccess = lvlId <= prev.unlockedLevel;
        return {
          ...prev,
          currentLevelIndex: lvlId - 1,
          currentQuestionIndex: targetQIndex,
          selectedComponent: null,
          lastEvaluation: null,
          status: 'theory',
          viewingTheoryModal: true,
        };
      });
    }
  }, []);

  const openSummary = useCallback(() => {
    soundFx.playFanfare();
    setGameState((prev) => ({
      ...prev,
      status: 'summary',
    }));
  }, []);

  const closeSummary = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: 'gameplay',
    }));
  }, []);

  const openWelcomeModal = useCallback(() => {
    soundFx.playBlip(600, 0.05);
    setGameState((prev) => ({
      ...prev,
      status: 'welcome',
    }));
  }, []);

  const resetGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('CYBER_MDB_ACADEMY_v2');
      localStorage.removeItem('CYBER_MDB_ACADEMY_v5');
    } catch (e) {}
    soundFx.playBlip(300, 0.15);
    setGameState({
      currentLevelIndex: 0,
      currentQuestionIndex: 0,
      unlockedLevel: 1,
      score: 0,
      totalQuestions: TOTAL_QUESTIONS_COUNT,
      answeredCount: 0,
      status: 'welcome',
      selectedComponent: null,
      lastEvaluation: null,
      history: {},
      audioEnabled: true,
      viewingTheoryModal: false,
    });
  }, []);

  const toggleAudio = useCallback(() => {
    setGameState((prev) => {
      const nextAudio = !prev.audioEnabled;
      soundFx.setMuted(!nextAudio);
      if (nextAudio) soundFx.playBlip(880, 0.05);
      return {
        ...prev,
        audioEnabled: nextAudio,
      };
    });
  }, []);

  return {
    gameState,
    currentLevel,
    currentQuestion,
    certification,
    startTraining,
    startLevelAssembly,
    openWelcomeModal,
    openTheoryModal,
    closeTheoryModal,
    selectChip,
    dropChip,
    unmountChip,
    injectFirmware,
    nextQuestion,
    prevQuestion,
    jumpToLevel,
    openSummary,
    closeSummary,
    resetGame,
    toggleAudio,
  };
}
