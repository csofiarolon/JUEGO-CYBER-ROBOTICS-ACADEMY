import React, { useState } from 'react';
import { HardwareChip, EvaluationResult } from '../types/game';
import { PixelIcon } from './PixelIcons';
import { Zap, CheckCircle2, AlertTriangle, ArrowRight, X, Cpu, Sparkles } from 'lucide-react';

interface RobotAssemblySlotProps {
  equippedChip: HardwareChip | null;
  onDropChip: (chip: HardwareChip) => void;
  onUnmountChip: () => void;
  onInjectFirmware: () => void;
  onNextQuestion: () => void;
  lastEvaluation: EvaluationResult | null;
  status: 'gameplay' | 'feedback';
}

export const RobotAssemblySlot: React.FC<RobotAssemblySlotProps> = ({
  equippedChip,
  onDropChip,
  onUnmountChip,
  onInjectFirmware,
  onNextQuestion,
  lastEvaluation,
  status,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const isSuccess = lastEvaluation?.isCorrect === true;
  const isFailure = lastEvaluation?.isCorrect === false;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const chip = JSON.parse(data) as HardwareChip;
        onDropChip(chip);
      }
    } catch (err) {
      console.error('Error al recibir microchip:', err);
    }
  };

  // Bordes activos y feedback visual según estado
  const getSlotBorder = () => {
    if (isDragOver) return 'border-space-blue bg-space-blue/15 shadow-glow-blue scale-[1.01] ring-2 ring-space-blue/60';
    if (isSuccess) return 'border-space-green bg-space-green/10 shadow-glow-green ring-1 ring-space-green/40';
    if (isFailure) return 'border-space-red bg-space-red/10 shadow-glow-red ring-1 ring-space-red/40';
    if (equippedChip) return 'border-space-amber bg-space-amber/10 shadow-glow-amber ring-1 ring-space-amber/40';
    return 'border-space-border hover:border-space-textSubtle bg-space-bg';
  };

  return (
    <div className="flex flex-col justify-between h-full gap-3">
      {/* Header con Badge de Alto Contraste para el Paso 3 */}
      <div className="flex items-center justify-between border-b border-space-border pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-space-green text-space-bg font-mono font-black text-[11px] shadow-glow-green uppercase tracking-wider">
            <span className="w-4 h-4 rounded-full bg-space-bg text-space-green flex items-center justify-center text-[10px] font-black">
              3
            </span>
            <span>PASO 3</span>
          </div>
          <h3 className="text-xs font-bold text-space-textMain uppercase tracking-wide font-mono">
            ACOPLE EN LA BAHÍA DE INTEGRACIÓN
          </h3>
        </div>

        {/* Indicadores LED del Chasis */}
        <div className="flex items-center gap-1.5" title="Telemetría LED del Chasis">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                isSuccess
                  ? 'bg-space-green shadow-glow-green'
                  : isFailure
                  ? i % 2 === 0 ? 'bg-space-red' : 'bg-space-amber'
                  : equippedChip
                  ? 'bg-space-amber'
                  : 'bg-space-subtle border border-space-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Ranura Receptora Drop Zone (Destino visible de Paso 2) */}
      <div
        data-testid="slot-robot-assembly"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full rounded-xl border-2 border-dashed p-4 transition-all duration-200 flex flex-col items-center justify-center min-h-[125px] ${getSlotBorder()}`}
      >
        {equippedChip ? (
          <div className="w-full flex items-center justify-between gap-3 text-left animate-fadeIn">
            <div className="p-2.5 bg-space-bg rounded-lg border border-space-border shadow-sm flex items-center justify-center shrink-0">
              <PixelIcon
                type={equippedChip.iconoPixelArt}
                className={`w-8 h-8 ${isSuccess ? 'text-space-green' : isFailure ? 'text-space-red' : 'text-space-amber'}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-space-subtle text-space-amber border border-space-border font-bold">
                  {equippedChip.tipo}
                </span>
                <span className="text-[10px] text-space-green font-mono flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3" /> LISTO PARA INSTALAR
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-space-textMain truncate mt-0.5">
                {equippedChip.nombre}
              </h4>
              <p className="text-[11px] text-space-textMuted line-clamp-1">
                {equippedChip.descripcion}
              </p>
            </div>

            {status !== 'feedback' && (
              <button
                onClick={onUnmountChip}
                data-testid="btn-unmount-chip"
                className="p-1.5 rounded-md text-space-textMuted hover:text-space-red hover:bg-space-subtle transition-colors"
                title="Desacoplar microchip"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-center py-2">
            <div className="p-2 rounded-full bg-space-subtle border border-space-border text-space-textMuted">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold tracking-wider text-space-textMain uppercase">
                {isDragOver ? 'SOLTAR MICROCHIP EN LA RANURA' : 'RANURA DE INTEGRACIÓN VACÍA'}
              </p>
              <p className="text-[11px] text-space-textMuted mt-0.5 font-sans">
                Arrastra el chip seleccionado del Paso 2 o pulsa [Acoplar]
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botón de Confirmación Principal ([Instalar Firmware] / [Siguiente Reto]) */}
      <div className="w-full">
        {status === 'feedback' ? (
          <button
            onClick={onNextQuestion}
            data-testid="btn-next-question"
            className="w-full py-2.5 rounded-lg bg-space-blue hover:bg-sky-400 text-space-bg font-bold font-sans text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-glow-blue transition-all cursor-pointer"
          >
            <span>SIGUIENTE RETO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onInjectFirmware}
            disabled={!equippedChip}
            data-testid="btn-inject-firmware"
            className={`w-full py-2.5 rounded-lg font-sans text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              equippedChip
                ? 'bg-space-green hover:bg-emerald-400 text-space-bg shadow-glow-green cursor-pointer'
                : 'bg-space-subtle text-space-textSubtle border border-space-border cursor-not-allowed opacity-60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>INSTALAR FIRMWARE</span>
          </button>
        )}
      </div>

      {/* Panel de Diagnóstico y Telemetría Limpio */}
      <div className="min-h-[90px] flex flex-col justify-center">
        {lastEvaluation ? (
          <div
            data-testid="telemetry-diagnostic-card"
            className={`p-3 rounded-lg border text-xs font-sans flex flex-col gap-1.5 animate-fadeIn ${
              isSuccess
                ? 'bg-space-green/10 border-space-green text-space-textMain'
                : 'bg-space-red/10 border-space-red text-space-textMain'
            }`}
          >
            <div className="flex items-start gap-2">
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-space-green shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-space-red shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h5 className={`font-bold text-xs ${isSuccess ? 'text-space-green' : 'text-space-red'}`}>
                  {lastEvaluation.feedbackMessage}
                </h5>
                <p
                  data-testid="telemetry-root-cause"
                  className="text-[11px] text-space-textMuted leading-relaxed"
                >
                  <strong className="text-space-textMain">Causa Raíz:</strong>{' '}
                  {lastEvaluation.technicalDetails}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-space-bg/60 border border-space-border/60 rounded-lg text-center text-[11px] text-space-textSubtle">
            Selecciona un microchip y presiona <strong className="text-space-textMuted">Instalar Firmware</strong> para iniciar la calibración cuántica.
          </div>
        )}
      </div>
    </div>
  );
};
