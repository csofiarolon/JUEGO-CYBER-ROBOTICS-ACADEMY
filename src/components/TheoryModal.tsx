import React from 'react';
import { Level } from '../types/game';
import { PixelIcon } from './PixelIcons';
import { BookOpen, Lightbulb, Cpu, Play, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface TheoryModalProps {
  level: Level;
  onStartAssembly: () => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  level,
  onStartAssembly,
  onClose,
  canDismiss = true,
}) => {
  const { theorySummary, components } = level;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        data-testid="modal-theory-lesson"
        className="relative w-full max-w-3xl bg-space-surface border border-space-border rounded-xl shadow-2xl flex flex-col gap-6 p-6 sm:p-8 text-space-textMain my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Botón de cierre si es descartable */}
        {canDismiss && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-md text-space-textMuted hover:text-space-textMain hover:bg-space-subtle transition-colors"
            title="Cerrar lección y continuar reto"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Encabezado Pedagógico */}
        <div className="flex flex-col gap-2 border-b border-space-border pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-space-blue/20 text-space-blue border border-space-blue/40 text-xs font-mono font-bold uppercase tracking-wider">
              FASE DE MICRO-LECCIÓN TEÓRICA
            </span>
            <span className="text-xs text-space-textMuted font-mono">
              NIVEL {level.id} DE 6
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-space-textMain">
            {theorySummary.titulo}
          </h2>
          <p className="text-sm text-space-textMuted">
            {theorySummary.subtitulo}
          </p>
        </div>

        {/* Analogía Mecánica para Principiantes */}
        <div className="bg-space-subtle/80 border border-space-border rounded-lg p-4 sm:p-5 flex items-start gap-3.5">
          <div className="p-2 rounded bg-space-amber/20 text-space-amber border border-space-amber/40 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-space-amber uppercase tracking-wider font-mono">
              Analogía del Taller Mecánico
            </h4>
            <p className="text-sm text-space-textMain leading-relaxed font-sans">
              {theorySummary.analogiaMecanica}
            </p>
          </div>
        </div>

        {/* Puntos Clave de la Lección */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-space-textMuted uppercase flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-space-green" />
            CONCEPTOS CLAVE DEL MANUAL DE ONBOARDING
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {theorySummary.puntosClave.map((pt, idx) => (
              <div
                key={idx}
                className="bg-space-bg border border-space-border rounded-lg p-3.5 flex flex-col justify-between gap-2"
              >
                <div>
                  <h5 className="text-sm font-semibold text-space-blue">
                    {pt.concepto}
                  </h5>
                  <p className="text-xs text-space-textMuted leading-relaxed mt-1">
                    {pt.detalle}
                  </p>
                </div>
                {pt.ejemplo && (
                  <div className="bg-space-surface border border-space-border rounded px-2.5 py-1.5 font-mono text-[11px] text-space-green mt-1">
                    <code>{pt.ejemplo}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Microchips de Hardware del Nivel */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-space-textMuted uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-space-amber" />
            MICROCHIPS ASIGNADOS A ESTE MÓDULO
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {components.map((chip) => (
              <div
                key={chip.id}
                className="bg-space-bg border border-space-border rounded-lg p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-space-surface rounded border border-space-border text-space-blue shrink-0">
                    <PixelIcon type={chip.iconoPixelArt} className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-space-textSubtle block truncate uppercase">
                      {chip.tipo}
                    </span>
                    <h6 className="text-xs font-bold text-space-textMain truncate">
                      {chip.nombre}
                    </h6>
                  </div>
                </div>

                <p className="text-[11px] text-space-textMuted leading-snug line-clamp-2">
                  {chip.descripcion}
                </p>

                <div className="pt-1.5 border-t border-space-border/60 text-[10px] text-space-amber italic">
                  💡 {chip.analogia}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Acción Principal para iniciar o volver al ensamble */}
        <div className="pt-2 border-t border-space-border flex items-center justify-between gap-4">
          <span className="text-xs text-space-textMuted hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-space-green" />
            Lectura obligatoria para asegurar &gt;= 70/100
          </span>

          <button
            onClick={onStartAssembly}
            data-testid="btn-start-level-assembly"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-space-green hover:bg-emerald-400 text-space-bg font-bold font-sans text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-glow-green cursor-pointer"
          >
            <span>ENTENDIDO, IR AL PRIMER RETO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

