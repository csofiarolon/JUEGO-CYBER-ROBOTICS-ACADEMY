import React from 'react';
import { HardwareChip } from '../types/game';
import { PixelIcon } from './PixelIcons';
import { Move, Check } from 'lucide-react';

interface InventoryDockProps {
  chips: [HardwareChip, HardwareChip, HardwareChip];
  equippedChipId: string | undefined;
  onSelectChip: (chip: HardwareChip) => void;
  disabled?: boolean;
}

export const InventoryDock: React.FC<InventoryDockProps> = ({
  chips,
  equippedChipId,
  onSelectChip,
  disabled = false,
}) => {
  const handleDragStart = (e: React.DragEvent, chip: HardwareChip) => {
    e.dataTransfer.setData('application/json', JSON.stringify(chip));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Header con Badge de Alto Contraste para el Paso 2 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-space-amber text-space-bg font-mono font-black text-[11px] shadow-glow-amber uppercase tracking-wider">
            <span className="w-4 h-4 rounded-full bg-space-bg text-space-amber flex items-center justify-center text-[10px] font-black">
              2
            </span>
            <span>PASO 2</span>
          </div>
          <h3 className="text-xs font-bold text-space-textMain uppercase tracking-wide font-mono">
            SELECCIONA Y ARRASTRA EL CHIP
          </h3>
        </div>
        <span className="text-[10px] font-mono text-space-textSubtle hidden sm:inline">
          Arrastra hacia la bahía o haz clic en [Acoplar]
        </span>
      </div>

      {/* Grid de 3 Microchips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {chips.map((chip) => {
          const isEquipped = chip.id === equippedChipId;

          return (
            <div
              key={chip.id}
              data-testid={`chip-draggable-${chip.id}`}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, chip)}
              className={`rounded-xl p-3 border transition-all duration-150 cursor-grab active:cursor-grabbing flex flex-col justify-between select-none ${
                isEquipped
                  ? 'bg-space-amber/15 border-space-amber shadow-glow-amber ring-2 ring-space-amber/70'
                  : 'bg-space-bg hover:bg-space-subtle border-space-border hover:border-space-textSubtle'
              }`}
            >
              <div>
                {/* Header de la tarjeta con pixel art icon */}
                <div className="flex items-start gap-2.5 mb-1.5">
                  <div className="p-1.5 bg-space-surface rounded border border-space-border shrink-0 shadow-sm">
                    <PixelIcon
                      type={chip.iconoPixelArt}
                      className={`w-6 h-6 ${isEquipped ? 'text-space-amber' : 'text-space-blue'}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-space-subtle text-space-textMuted border border-space-border font-semibold block w-fit truncate">
                      {chip.tipo}
                    </span>
                    <h5 className="text-xs font-bold text-space-textMain truncate mt-0.5" title={chip.nombre}>
                      {chip.nombre}
                    </h5>
                  </div>
                </div>

                {/* Descripción funcional de 1 a 2 líneas */}
                <p className="text-[11px] text-space-textMuted leading-snug line-clamp-2 font-sans">
                  {chip.descripcion}
                </p>

                {chip.codigoSnippet && (
                  <div className="bg-space-surface border border-space-border rounded px-2 py-1 font-mono text-[10px] text-space-green overflow-x-auto my-1.5">
                    <code className="truncate block">{chip.codigoSnippet}</code>
                  </div>
                )}
              </div>

              {/* Botón de acople rápido */}
              <div className="pt-2 border-t border-space-border/60 flex items-center justify-between gap-1 mt-1.5">
                <span className="text-[9px] font-mono text-space-textSubtle flex items-center gap-1">
                  <Move className="w-2.5 h-2.5" /> Arrastrar
                </span>

                <button
                  onClick={() => onSelectChip(chip)}
                  disabled={disabled}
                  data-testid={`btn-equip-chip-${chip.id}`}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded flex items-center gap-1 transition-all ${
                    isEquipped
                      ? 'bg-space-amber text-space-bg font-bold shadow-sm'
                      : 'bg-space-subtle hover:bg-space-blue hover:text-space-bg text-space-textMain border border-space-border'
                  }`}
                >
                  {isEquipped ? (
                    <>
                      <Check className="w-3 h-3" /> ACOPLADO
                    </>
                  ) : (
                    'ACOPLAR'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
