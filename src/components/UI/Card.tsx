import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  onClick,
}) => {
  return (
    <div
      className={`
        rounded-xl p-6 transition-all duration-300
        bg-white/[0.05] backdrop-blur-sm
        border border-cyber-green/10
        hover:border-cyber-green/30
        ${glow ? 'hover:shadow-lg hover:shadow-cyber-green/10' : ''}
        ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  trend?: { value: number; isPositive: boolean };
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  color = '#00ff88',
  trend,
}) => {
  return (
    <Card className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={24} style={{ color }} />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold text-white">{value}</p>
          {trend && (
            <span
              className={`text-xs ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'blue' | 'gold' | 'red';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  className = '',
}) => {
  const colors = {
    green: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30',
    blue: 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30',
    gold: 'bg-cyber-gold/20 text-cyber-gold border-cyber-gold/30',
    red: 'bg-cyber-red/20 text-cyber-red border-cyber-red/30',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border
        ${colors[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: LucideIcon;
  colorScheme?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  colorScheme = 'basic',
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg';

  const outlineColors = {
    basic: 'border-cyber-green text-cyber-green hover:bg-cyber-green/10',
    penetration: 'border-cyber-red text-cyber-red hover:bg-cyber-red/10',
    defense: 'border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyber-green to-cyber-green/80 text-cyber-black hover:shadow-lg hover:shadow-cyber-green/30 hover:scale-105',
    outline: `border-2 ${outlineColors[colorScheme as keyof typeof outlineColors] || outlineColors.basic}`,
    danger: 'border-2 border-red-500 text-red-500 hover:bg-red-500/10',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (Icon ? <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} /> : null)}
      {children}
    </button>
  );
};
