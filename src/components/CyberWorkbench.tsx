import React from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import { RobotAssemblySlot } from './RobotAssemblySlot';
import { InventoryDock } from './InventoryDock';
import { TheoryModal } from './TheoryModal';
import { CertificationBadge } from './CertificationBadge';
import { WelcomeModal } from './WelcomeModal';
import { 
  Bot, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Code2, 
  Lock,
  Unlock
} from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculum';

export const CyberWorkbench: React.FC = () => {
  const {
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
  } = useGameEngine();

  const currentNumber = gameState.currentQuestionIndex + 1;
  const isApproved = gameState.score >= 70;

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-space-bg text-space-textMain font-sans flex flex-col justify-between selection:bg-space-blue selection:text-space-bg">
      {/* =========================================================================
          1. HEADER ULTRA-LIMPIO Y MINIMALISTA (EN UNA SOLA LÍNEA ESENCIAL)
          ========================================================================= */}
      <header className="w-full bg-space-surface border-b border-space-border px-4 py-2.5 shrink-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* 1. Nombre del juego / Logo */}
          <div 
            onClick={openWelcomeModal}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
            title="Ver pantalla de bienvenida e instructivo"
          >
            <div className="p-1.5 rounded-md bg-space-bg border border-space-border text-space-green shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-xs sm:text-sm font-bold font-mono tracking-tight text-space-textMain whitespace-nowrap">
              CYBER-ROBOTICS ACADEMY
            </h1>
          </div>

          {/* 2. Tema actual (Pill limpia) */}
          <div className="hidden sm:flex items-center">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-space-blue/10 text-space-blue border border-space-blue/30 font-semibold truncate max-w-xs md:max-w-md">
              Nivel {currentLevel.id}: {currentLevel.title.split(':')[1]?.trim() || currentLevel.title}
            </span>
          </div>

          {/* 3. Progreso / Avance Directo + 4. Botón Único de Apoyo [Teoría] */}
          <div className="flex items-center gap-3">
            {/* Indicador de Avance: Desafío X/100 y Aciertos */}
            <div 
              data-testid="hud-score-display"
              className="flex items-center gap-2 bg-space-bg border border-space-border px-3 py-1 rounded-lg text-xs font-mono"
            >
              <span className="text-space-textMuted font-bold">
                Desafío <strong className="text-space-textMain">{currentNumber}</strong>/100
              </span>
              <span className="text-space-border">|</span>
              <span className={`font-bold ${isApproved ? 'text-space-green' : 'text-space-amber'}`}>
                Aciertos: {gameState.score}
              </span>
            </div>

            {/* Único Botón de Apoyo: [Teoría] */}
            <button
              onClick={openTheoryModal}
              data-testid="btn-open-theory"
              className="px-3 py-1 rounded-lg bg-space-subtle hover:bg-space-border border border-space-border text-space-textMain text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Consultar manual de teoría del nivel"
            >
              <BookOpen className="w-3.5 h-3.5 text-space-blue" />
              <span>Teoría</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. ESTRUCTURA EN 2 COLUMNAS (JERARQUÍA PASO A PASO // CERO SCROLL)
          ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full p-3 sm:p-4 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:overflow-hidden">
        {/* COLUMNA IZQUIERDA (lg:col-span-7): PASO 1 (DIAGNÓSTICO) + PASO 2 (CHIPS) */}
        <section className="lg:col-span-7 flex flex-col justify-between gap-3 h-full min-h-0">
          {/* PASO 1: LECTURA DE LA ORDEN DE TRABAJO */}
          <div className="bg-space-surface border border-space-border rounded-xl p-3.5 sm:p-4 flex flex-col gap-2.5 shadow-sm flex-1 min-h-0 justify-between">
            <div>
              {/* Header de Paso 1 con Badge de Alto Contraste */}
              <div className="flex items-center justify-between border-b border-space-border pb-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-space-blue text-space-bg font-mono font-black text-[11px] shadow-glow-blue uppercase tracking-wider">
                    <span className="w-4 h-4 rounded-full bg-space-bg text-space-blue flex items-center justify-center text-[10px] font-black">
                      1
                    </span>
                    <span>PASO 1</span>
                  </div>
                  <h2 className="text-xs font-bold text-space-textMain font-mono uppercase tracking-wider">
                    DIAGNÓSTICO DEL ERROR // {currentQuestion.tituloDesafio}
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-space-textSubtle">
                  Nivel {currentQuestion.levelId}
                </span>
              </div>

              {/* Premisa concisa del problema */}
              <p className="text-xs sm:text-sm text-space-textMain leading-relaxed font-sans">
                {currentQuestion.missionDescription}
              </p>
            </div>

            {/* Bloque de código / log del error detectado */}
            {currentQuestion.codigoContexto && (
              <div className="bg-space-bg border border-space-border rounded-lg p-2.5 font-mono text-xs text-space-textMain overflow-x-auto max-h-28 overflow-y-auto mt-1">
                <div className="flex items-center gap-1.5 text-space-textSubtle text-[9px] uppercase pb-1 mb-1 border-b border-space-border">
                  <Code2 className="w-3 h-3 text-space-amber" /> LOG TÉCNICO DE CAPTURA
                </div>
                <pre className="text-space-blue text-[11px] leading-tight">
                  <code>{currentQuestion.codigoContexto}</code>
                </pre>
              </div>
            )}
          </div>

          {/* PASO 2: SELECCIÓN DE COMPONENTES (DRAG & DROP) */}
          <div className="bg-space-surface border border-space-border rounded-xl p-3.5 sm:p-4 shadow-sm shrink-0">
            <InventoryDock
              chips={currentQuestion.opciones}
              equippedChipId={gameState.selectedComponent?.id}
              onSelectChip={selectChip}
              disabled={gameState.status === 'feedback'}
            />
          </div>
        </section>

        {/* COLUMNA DERECHA (lg:col-span-5): PASO 3 (BAHÍA DE ENSAMBLE Y CONFIRMACIÓN) */}
        <section className="lg:col-span-5 bg-space-surface border border-space-border rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-sm h-full min-h-0">
          <RobotAssemblySlot
            equippedChip={gameState.selectedComponent}
            onDropChip={dropChip}
            onUnmountChip={unmountChip}
            onInjectFirmware={injectFirmware}
            onNextQuestion={nextQuestion}
            lastEvaluation={gameState.lastEvaluation}
            status={gameState.status === 'feedback' ? 'feedback' : 'gameplay'}
          />
        </section>
      </main>

      {/* =========================================================================
          3. FOOTER DISCRETO Y COMPACTO (SOPORTE Y PROGRESIÓN SECUENCIAL)
          ========================================================================= */}
      <footer className="w-full bg-space-surface border-t border-space-border px-4 py-1.5 shrink-0 text-[11px] text-space-textMuted font-sans">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Controles de navegación manual discreta */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevQuestion}
              disabled={gameState.currentQuestionIndex === 0}
              data-testid="btn-question-prev"
              className="p-1 rounded text-space-textMuted hover:text-space-textMain disabled:opacity-30 transition-colors"
              title="Pregunta anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] text-space-textSubtle">
              Reto {currentNumber}/100
            </span>
            <button
              onClick={nextQuestion}
              disabled={gameState.currentQuestionIndex === gameState.totalQuestions - 1}
              data-testid="btn-question-next"
              className="p-1 rounded text-space-textMuted hover:text-space-textMain disabled:opacity-30 transition-colors"
              title="Siguiente pregunta"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progresión secuencial estricta de niveles (Bloqueados vs Desbloqueados) */}
          <div className="hidden md:flex items-center gap-1.5 font-mono text-[10px]">
            <span className="text-space-textSubtle uppercase">Nivel:</span>
            {CURRICULUM_LEVELS.map((lvl) => {
              const isUnlocked = lvl.id <= gameState.unlockedLevel;
              const isCurrent = currentLevel.id === lvl.id;

              return (
                <button
                  key={lvl.id}
                  onClick={() => isUnlocked && jumpToLevel(lvl.id)}
                  disabled={!isUnlocked}
                  className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                    isCurrent
                      ? 'bg-space-blue/20 text-space-blue font-bold border border-space-blue/40'
                      : isUnlocked
                      ? 'text-space-textMuted hover:text-space-textMain bg-space-subtle/50'
                      : 'text-space-textSubtle/50 cursor-not-allowed opacity-50'
                  }`}
                  title={isUnlocked ? `Ir a Nivel ${lvl.id}` : `Nivel ${lvl.id} bloqueado. Completa los niveles previos.`}
                >
                  {isUnlocked ? <Unlock className="w-2.5 h-2.5 text-space-green" /> : <Lock className="w-2.5 h-2.5" />}
                  <span>N{lvl.id}</span>
                </button>
              );
            })}
          </div>

          {/* Opciones auxiliares: Audio, Certificación y Reinicio */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSummary}
              data-testid="btn-open-summary"
              className="text-space-textSubtle hover:text-space-amber flex items-center gap-1 transition-colors"
              title="Ver estado de certificación"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Certificación</span>
            </button>

            <button
              onClick={toggleAudio}
              data-testid="btn-toggle-sound"
              className="text-space-textSubtle hover:text-space-blue p-1 transition-colors"
              title={gameState.audioEnabled ? 'Silenciar audio' : 'Activar audio'}
            >
              {gameState.audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                if (window.confirm('¿Reiniciar progreso y volver a la pantalla de bienvenida?')) {
                  resetGame();
                }
              }}
              data-testid="btn-factory-reset"
              className="text-space-textSubtle hover:text-space-red p-1 transition-colors"
              title="Reiniciar taller a valores de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          4. MODALES DE FLUJO: ONBOARDING -> TEORÍA -> CERTIFICACIÓN
          ========================================================================= */}
      {/* 4.1 Pantalla de Bienvenida Inicial (Splash Screen / Onboarding) */}
      {gameState.status === 'welcome' && (
        <WelcomeModal onStartTraining={startTraining} />
      )}

      {/* 4.2 Modal de Micro-Lección Teórica Obligatoria al inicio de nivel */}
      {gameState.viewingTheoryModal && (
        <TheoryModal
          level={currentLevel}
          onStartAssembly={startLevelAssembly}
          onClose={closeTheoryModal}
          canDismiss={gameState.status !== 'theory'}
        />
      )}

      {/* 4.3 Modal de Certificación Final */}
      {gameState.status === 'summary' && (
        <CertificationBadge
          certification={certification}
          onClose={closeSummary}
          onReset={resetGame}
          onReviewTheory={openTheoryModal}
        />
      )}
    </div>
  );
};
