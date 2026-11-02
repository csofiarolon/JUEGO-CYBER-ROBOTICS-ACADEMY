import React from 'react';
import { Bot, BookOpen, Search, Cpu, Award, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface WelcomeModalProps {
  onStartTraining: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStartTraining }) => {
  return (
    <div 
      data-testid="modal-welcome-onboarding"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl bg-space-surface border-2 border-space-blue/50 rounded-2xl shadow-2xl flex flex-col gap-6 p-6 sm:p-8 text-space-textMain my-8">
        {/* Identidad y Header de Bienvenida */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="p-3.5 rounded-2xl bg-space-blue/15 border border-space-blue/40 text-space-blue shadow-glow-blue animate-bounce">
            <Bot className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-space-green/15 text-space-green border border-space-green/30 text-[11px] font-mono font-bold tracking-wider uppercase">
                ONBOARDING PARA PRINCIPIANTES
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-space-subtle text-space-textMuted border border-space-border text-[11px] font-mono">
                100 RETOS
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-space-textMain uppercase font-mono">
              CYBER-ROBOTICS ACADEMY: MONGODB CORE
            </h1>

            <p className="text-xs sm:text-sm text-space-blue font-medium max-w-lg mx-auto">
              Aprende arquitectura NoSQL desde cero ensamblando robots de telemetría industrial
            </p>
          </div>
        </div>

        {/* Instructivo Rápido: Cómo Jugar en Pasos Guiados */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-space-textMuted uppercase flex items-center gap-2 border-b border-space-border pb-2">
            <Zap className="w-4 h-4 text-space-amber" />
            CÓMO JUGAR // METODOLOGÍA EN 4 PASOS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Paso 1 */}
            <div className="bg-space-bg border border-space-border rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-space-blue text-space-bg font-bold font-mono text-xs flex items-center justify-center shrink-0 shadow-sm">
                1
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-space-textMain flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-space-blue" />
                  Aprende la teoría
                </h5>
                <p className="text-[11px] text-space-textMuted leading-relaxed">
                  Cada nivel inicia con una explicación simple sin jerga técnica del concepto clave antes de los retos.
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-space-bg border border-space-border rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-space-amber text-space-bg font-bold font-mono text-xs flex items-center justify-center shrink-0 shadow-sm">
                2
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-space-textMain flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-space-amber" />
                  Analiza el fallo
                </h5>
                <p className="text-[11px] text-space-textMuted leading-relaxed">
                  Lee el diagnóstico del sistema y examina los 3 microchips de solución disponibles en el taller.
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-space-bg border border-space-border rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-space-green text-space-bg font-bold font-mono text-xs flex items-center justify-center shrink-0 shadow-sm">
                3
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-space-textMain flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-space-green" />
                  Arrastra y ensambla
                </h5>
                <p className="text-[11px] text-space-textMuted leading-relaxed">
                  Arrastra o acopla el chip a la ranura del robot y presiona "Instalar Firmware" para comprobarlo.
                </p>
              </div>
            </div>

            {/* Paso 4 / Meta */}
            <div className="bg-space-bg border border-space-border rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-space-purple text-space-bg font-bold font-mono text-xs flex items-center justify-center shrink-0 shadow-sm">
                4
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-space-textMain flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-space-purple" />
                  Meta: Certificación
                </h5>
                <p className="text-[11px] text-space-textMuted leading-relaxed">
                  Alcanza al menos <strong>70 de los 100 aciertos</strong> para desbloquear la insignia oficial de ingreso al equipo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call To Action Prominente */}
        <div className="pt-2 border-t border-space-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-space-textMuted flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-space-green shrink-0" />
            <span>Progresión secuencial estricta desde cero.</span>
          </div>

          <button
            onClick={onStartTraining}
            data-testid="btn-start-training"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-space-green hover:bg-emerald-400 text-space-bg font-bold font-sans text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-glow-green active:scale-95 cursor-pointer"
          >
            <span>INICIAR CAPACITACIÓN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

