import React from 'react';
import { PixelIconType } from '../types/game';

interface PixelIconProps {
  type: PixelIconType | string;
  className?: string;
  color?: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({ type, className = 'w-8 h-8', color = 'currentColor' }) => {
  switch (type) {
    case 'microchip':
    case 'core_processor':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="14" height="14" fill="#0d1520" stroke={color} strokeWidth="1.5" />
          <rect x="8" y="8" width="8" height="8" fill="#142436" stroke={color} strokeWidth="1" />
          {/* Pins */}
          <path d="M2 8h3M2 12h3M2 16h3M19 8h3M19 12h3M19 16h3M8 2v3M12 2v3M16 2v3M8 19v3M12 19v3M16 19v3" stroke={color} strokeWidth="1.5" strokeLinecap="square" />
          <circle cx="12" cy="12" r="1.5" fill={color} />
        </svg>
      );

    case 'ram':
    case 'memory_bus':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="6" width="18" height="12" rx="1" fill="#0d1b1e" stroke={color} strokeWidth="1.5" />
          <rect x="6" y="9" width="3" height="4" fill={color} opacity="0.8" />
          <rect x="11" y="9" width="3" height="4" fill={color} opacity="0.8" />
          <rect x="16" y="9" width="3" height="4" fill={color} opacity="0.8" />
          <path d="M5 18v2M8 18v2M11 18v2M14 18v2M17 18v2M20 18v2" stroke={color} strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      );

    case 'capacitor':
    case 'flux_capacitor':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" fill="#1a1103" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" fill="#2d1d05" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
          <path d="M12 3v5M12 16v5M3 12h5M16 12h5" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="1.5" fill={color} />
        </svg>
      );

    case 'pipeline':
    case 'instruction_set':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5h6v4H3zM15 5h6v4h-6zM9 15h6v4H9z" fill="#0b1726" stroke={color} strokeWidth="1.5" />
          <path d="M9 7h6M12 7v8M12 19v2" stroke={color} strokeWidth="1.5" strokeDasharray="1 1" />
          <circle cx="6" cy="7" r="1" fill={color} />
          <circle cx="18" cy="7" r="1" fill={color} />
          <circle cx="12" cy="17" r="1" fill={color} />
        </svg>
      );

    case 'crystal':
    case 'quantum':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 8l8 14 8-14-8-6z" fill="#082026" stroke={color} strokeWidth="1.5" />
          <path d="M4 8h16M12 2v20M8 8l4 14M16 8l-4 14" stroke={color} strokeWidth="1" opacity="0.6" />
        </svg>
      );

    case 'shield':
    case 'crypto_unit':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 5v7c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V5l-8-3z" fill="#140a20" stroke={color} strokeWidth="1.5" />
          <path d="M12 6v12M8 10l4-2 4 2" stroke={color} strokeWidth="1.2" />
          <circle cx="12" cy="12" r="2" fill={color} />
        </svg>
      );

    case 'diode':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h5M16 12h5" stroke={color} strokeWidth="1.5" />
          <path d="M8 7l8 5-8 5V7z" fill="#1a111a" stroke={color} strokeWidth="1.5" />
          <path d="M16 7v10" stroke={color} strokeWidth="2" />
        </svg>
      );

    case 'storage_controller':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="5" rx="1" fill="#0f1924" stroke={color} strokeWidth="1.5" />
          <rect x="4" y="11" width="16" height="5" rx="1" fill="#0f1924" stroke={color} strokeWidth="1.5" />
          <rect x="4" y="18" width="16" height="5" rx="1" fill="#0f1924" stroke={color} strokeWidth="1.5" />
          <circle cx="7" cy="6.5" r="1" fill={color} />
          <circle cx="7" cy="13.5" r="1" fill={color} />
          <circle cx="7" cy="20.5" r="1" fill={color} />
          <path d="M14 6.5h3M14 13.5h3M14 20.5h3" stroke={color} strokeWidth="1.5" />
        </svg>
      );
  }
};

