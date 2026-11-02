import React from 'react';
import { Volume2, VolumeX, RotateCcw, ChevronLeft, ChevronRight, Award, Zap } from 'lucide-react';
import { MODULE_NAMES } from '../data/questions';

interface TelemetryHUDProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  modulo: number;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onResetGame: () => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onJumpToModule: (mod: number) => void;
  onOpenSummary: () => void;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  currentQuestionIndex,
  totalQuestions,
  score,
  modulo,
  audioEnabled,
  onToggleAudio,
  onResetGame,
  onPrevQuestion,
  onNextQuestion,
  onJumpToModule,
  onOpenSummary,
}) => {
  const currentNumber = currentQuestionIndex + 1;
  const progressPercent = Math.round((currentNumber / totalQuestions) * 100);
  const scorePercent = Math.round((score / totalQuestions) * 100);
  const isApproved = score >= 70;

  return (
    <div className="w-full bg-cyber-darkest/90 border border-cyber-border rounded-lg p-3 backdrop-blur-md flex flex-col gap-3 font-mono">
      {/* Fila Superior: Título, Indicador de Módulo, y Acciones Globales */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-cyber-panel border border-cyber-neonCyan/40 rounded flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-neonGreen animate-ping" />
            <span className="text-xs font-bold text-cyber-neonCyan tracking-wider">
              MÓDULO {modulo}: {MODULE_NAMES[modulo]}
            </span>
          </div>

          {/* Selector de salto rápido para QA */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-[10px] text-slate-500 uppercase">Salto QA:</span>
            <select
              data-testid="select-module-jump"
              value={modulo}
              onChange={(e) => onJumpToModule(Number(e.target.value))}
              aria-label="Salto rápido a módulo"
              className="bg-cyber-panel border border-slate-700 text-slate-200 text-xs rounded px-2 py-0.5 focus:border-cyber-neonCyan focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((m) => (
                <option key={m} value={m}>
                  Módulo {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Acciones: Audio, Navegación de QA, Reset, Certificado */}
        <div className="flex items-center gap-2">
          {/* Navegación manual de retos */}
          <div className="flex items-center bg-cyber-panel rounded border border-cyber-border">
            <button
              onClick={onPrevQuestion}
              disabled={currentQuestionIndex === 0}
              data-testid="btn-question-prev"
              title="Pregunta anterior"
              className="p-1.5 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs text-slate-300 font-bold">
              {currentNumber.toString().padStart(3, '0')} / {totalQuestions}
            </span>
            <button
              onClick={onNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              data-testid="btn-question-next"
              title="Siguiente pregunta"
              className="p-1.5 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Botón de Sonido */}
          <button
            onClick={onToggleAudio}
            data-testid="btn-toggle-sound"
            title={audioEnabled ? 'Silenciar audio 8-bit' : 'Activar audio 8-bit'}
            className={`p-1.5 rounded border transition-colors ${
              audioEnabled
                ? 'bg-cyber-panel border-cyan-800 text-cyber-neonCyan hover:bg-cyan-950/60'
                : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Botón de Ver Certificado / Diagnóstico */}
          <button
            onClick={onOpenSummary}
            data-testid="btn-open-summary"
            title="Ver estado de certificación"
            className="px-2.5 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/50 text-cyber-neonAmber text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CERTIFICADO</span>
          </button>

          {/* Botón de Reinicio de Fábrica */}
          <button
            onClick={() => {
              if (window.confirm('¿Seguro que deseas purgar la memoria y reiniciar el taller desde la pregunta 1?')) {
                onResetGame();
              }
            }}
            data-testid="btn-factory-reset"
            title="Purgar memoria y reiniciar taller"
            className="p-1.5 rounded bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-700/50 text-slate-500 hover:text-cyber-neonRed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fila Inferior: Medidores de Telemetría, Score y Barra de Progreso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Contador de Score */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-panel rounded border border-cyber-border">
            <Zap className={`w-5 h-5 ${isApproved ? 'text-cyber-neonGreen' : 'text-cyber-neonAmber'}`} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">
              CALIBRACIÓN / PUNTAJE
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                data-testid="hud-score-counter"
                className={`text-lg font-black tracking-tight ${
                  isApproved ? 'text-cyber-neonGreen text-glow-green' : 'text-slate-100'
                }`}
              >
                {score}
              </span>
              <span className="text-xs text-slate-500">/ 100 Aciertos</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                isApproved ? 'bg-emerald-950 text-cyber-neonGreen border border-emerald-700/50' : 'bg-slate-800 text-slate-400'
              }`}>
                {isApproved ? 'UMBRAL CERTIFICADO (>=70)' : 'META: 70'}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Progreso de la Misión */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>AVANCE DEL PROTOCOLO DE ENTRENAMIENTO</span>
            <span className="font-bold text-cyber-neonCyan">{progressPercent}% ({currentNumber} de {totalQuestions})</span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            {/* Marcador del umbral de 70% */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 z-10"
              style={{ left: '70%' }}
              title="Umbral de Aprobación 70%"
            />
            {/* Barra rellena */}
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyber-neonGreen transition-all duration-300 shadow-neon-green"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

