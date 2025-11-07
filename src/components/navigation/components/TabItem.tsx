// Typography tokens available via typography.css (imported in index.css)
import React from 'react';
import { cn } from '../../../lib/utilsComprehensive';
import { glassTokenUtils } from '../../../tokens/glass';

export interface TabItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const TabItemComponent: React.FC<TabItemProps> = ({
  label,
  icon,
  badge,
  disabled = false,
  active = false,
  onClick,
}) => {
  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        background: active ? glassTokenUtils.getSurface('neutral', 'level1').surface.base : 'transparent',
        border: 'none',
        borderRadius: '6px',
        color: active ? 'var(--glass-white)' : glassTokenUtils.getSurface('neutral', 'level1').text.secondary,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontSize: '0.875rem', // body text
        fontWeight: active ? 600 : 400,
        transition: 'all 0.2s ease',
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
      {badge && (
        <span
          style={{
            background: 'var(--glass-color-danger)',
            color: 'white',
            borderRadius: '10px',
            padding: '2px 6px',
            fontSize: '0.625rem',
            fontWeight: 'var(--typography-heading-weight)', // semi-bold
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export default TabItemComponent;
