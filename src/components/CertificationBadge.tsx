import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CertificationResult } from '../types/game';
import { Award, AlertOctagon, Copy, Check, X, ShieldAlert, Cpu, RefreshCw, BookOpen } from 'lucide-react';

interface CertificationBadgeProps {
  certification: CertificationResult;
  onClose: () => void;
  onReset: () => void;
  onReviewTheory: () => void;
}

export const CertificationBadge: React.FC<CertificationBadgeProps> = ({
  certification,
  onClose,
  onReset,
  onReviewTheory,
}) => {
  const [copied, setCopied] = useState(false);
  const { aprobado, score, total, porcentaje, tituloBadge, rangoCybernetico, reporteNiveles, recomendacionesRecalibracion } = certification;

  useEffect(() => {
    if (aprobado) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3fb950', '#58a6ff', '#d29922', '#ffffff'],
      });
    }
  }, [aprobado]);

  const certHash = `MDB-CERT-${score}-${Math.abs(score * 1337).toString(16).toUpperCase()}-AUTH`;

  const copyReport = () => {
    const reportText = `=== REPORTE DE CERTIFICACIÓN CYBER-ROBOTICS ===
ESTADO: ${tituloBadge}
RANGO: ${rangoCybernetico}
PUNTAJE: ${score}/${total} (${porcentaje}%)
TOKEN CRIPTOGRÁFICO: ${certHash}
DESGLOSE POR NIVELES:
${reporteNiveles.map(lvl => `- Nivel ${lvl.levelId} (${lvl.title}): ${lvl.aciertos}/${lvl.total} aciertos`).join('\n')}
==============================================`;

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        data-testid={aprobado ? 'modal-certification-success' : 'modal-certification-failure'}
        className={`relative w-full max-w-2xl bg-space-surface border rounded-xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-space-textMain my-8 ${
          aprobado ? 'border-space-green shadow-glow-green' : 'border-space-red shadow-glow-red'
        }`}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-md text-space-textMuted hover:text-space-textMain hover:bg-space-subtle transition-colors"
          title="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado e Insignia */}
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          {aprobado ? (
            <div
              data-testid="badge-certified-firmware"
              className="p-4 rounded-full bg-space-green/20 border-2 border-space-green text-space-green shadow-glow-green animate-bounce"
            >
              <Award className="w-12 h-12" />
            </div>
          ) : (
            <div className="p-4 rounded-full bg-space-red/20 border-2 border-space-red text-space-red shadow-glow-red">
              <AlertOctagon className="w-12 h-12" />
            </div>
          )}

          <div className="space-y-1">
            <span
              className={`text-xs uppercase font-bold tracking-widest px-3 py-1 rounded border font-mono ${
                aprobado
                  ? 'bg-space-green/20 text-space-green border-space-green/40'
                  : 'bg-space-red/20 text-space-red border-space-red/40'
              }`}
            >
              {aprobado ? 'PROTOCOLO DE CERTIFICACIÓN SUPERADO' : 'UMBRAL DE ADMISIÓN NO ALCANZADO'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-space-textMain uppercase tracking-tight mt-2">
              {tituloBadge}
            </h2>
            <p className="text-xs text-space-blue font-mono font-bold">
              RANGO ASIGNADO: {rangoCybernetico}
            </p>
          </div>
        </div>

        {/* Estadísticas Globales */}
        <div className="grid grid-cols-3 gap-3 text-center bg-space-bg border border-space-border rounded-lg p-3.5">
          <div>
            <div className="text-[10px] text-space-textMuted uppercase font-mono">Aciertos Totales</div>
            <div className={`text-xl font-bold font-mono ${aprobado ? 'text-space-green' : 'text-space-red'}`}>
              {score} / {total}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-space-textMuted uppercase font-mono">Efectividad Global</div>
            <div className="text-xl font-bold font-mono text-space-textMain">
              {porcentaje}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-space-textMuted uppercase font-mono">Meta de Ingreso</div>
            <div className="text-xl font-bold font-mono text-space-amber">
              &gt;= 70%
            </div>
          </div>
        </div>

        {/* Desglose de Niveles Curriculares */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold tracking-wider text-space-textMuted uppercase flex items-center gap-2 border-b border-space-border pb-1.5">
            <Cpu className="w-4 h-4 text-space-blue" />
            DESGLOSE POR NIVELES TEMÁTICOS (CURRÍCULO 1 AL 6)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {reporteNiveles.map((lvl) => {
              const pass = (lvl.aciertos / lvl.total) >= 0.7;
              return (
                <div
                  key={lvl.levelId}
                  className={`p-3 rounded-lg border flex flex-col gap-1.5 ${
                    pass
                      ? 'bg-space-bg border-space-green/30 text-space-textMain'
                      : 'bg-space-bg border-space-red/30 text-space-textMain'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate">
                      Nivel {lvl.levelId}: {lvl.title}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      pass ? 'bg-space-green/20 text-space-green' : 'bg-space-red/20 text-space-red'
                    }`}>
                      {lvl.aciertos}/{lvl.total}
                    </span>
                  </div>
                  {/* Barra limpia de progreso */}
                  <div className="w-full h-1.5 bg-space-subtle rounded-full overflow-hidden">
                    <div
                      className={`h-full ${pass ? 'bg-space-green' : 'bg-space-red'}`}
                      style={{ width: `${Math.round((lvl.aciertos / lvl.total) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reporte de Recalibración para Niveles Reprobados */}
        {!aprobado && recomendacionesRecalibracion.length > 0 && (
          <div className="bg-space-red/10 border border-space-red/40 rounded-lg p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-space-red font-bold font-mono">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>DIAGNÓSTICO: MÓDULOS A REPASAR ANTES DE REINTENTAR</span>
            </div>
            <ul className="space-y-1.5 text-space-textMuted pl-5 list-disc text-[11px] leading-relaxed">
              {recomendacionesRecalibracion.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Token Criptográfico Verificable */}
        {aprobado && (
          <div className="p-3.5 bg-space-green/10 border border-space-green/40 rounded-lg text-xs flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] text-space-textMuted uppercase font-mono">Código de Certificación Oficial:</div>
              <div className="font-mono font-bold text-space-green select-all">
                {certHash}
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 bg-space-green/20 text-space-green border border-space-green/40 rounded font-mono font-bold">
              VERIFICADO
            </span>
          </div>
        )}

        {/* Acciones */}
        <div className="pt-2 border-t border-space-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={copyReport}
              className="px-4 py-2 rounded-lg bg-space-subtle hover:bg-space-border text-space-textMain text-xs font-semibold flex items-center gap-1.5 transition-colors border border-space-border"
            >
              {copied ? <Check className="w-4 h-4 text-space-green" /> : <Copy className="w-4 h-4" />}
              {copied ? '¡REPORTE COPIADO!' : 'COPIAR REPORTE'}
            </button>

            {!aprobado && (
              <button
                onClick={() => {
                  if (window.confirm('¿Reiniciar el taller para recalibrar desde el Nivel 1?')) {
                    onReset();
                    onClose();
                  }
                }}
                data-testid="btn-recalibrate-system"
                className="px-4 py-2 rounded-lg bg-space-red/20 hover:bg-space-red/30 text-space-red border border-space-red/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                RECALIBRAR (REINTENTAR)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onReviewTheory();
              }}
              className="px-4 py-2 rounded-lg bg-space-subtle hover:bg-space-border text-space-blue text-xs font-semibold flex items-center gap-1.5 border border-space-border"
            >
              <BookOpen className="w-4 h-4" />
              REPASAR MANUAL
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-space-blue hover:bg-sky-400 text-space-bg font-bold text-xs tracking-wide transition-all shadow-glow-blue"
            >
              VOLVER AL TALLER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

