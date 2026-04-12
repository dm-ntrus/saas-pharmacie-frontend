import React from 'react';
import { cn } from '@/lib/utils';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'tilt' | 'magnetic';
  glowColor?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  hoverEffect = 'lift',
  glowColor = 'emerald',
}) => {
  const getHoverClasses = () => {
    switch (hoverEffect) {
      case 'lift':
        return 'hover:-translate-y-2 hover:shadow-2xl';
      case 'glow':
        return `hover:shadow-2xl hover:shadow-${glowColor}-200/30`;
      case 'scale':
        return 'hover:scale-105';
      case 'tilt':
        return 'hover:rotate-1 hover:-translate-y-1';
      case 'magnetic':
        return 'hover:scale-105 hover:-translate-y-1 hover:shadow-2xl';
      default:
        return 'hover:-translate-y-2 hover:shadow-2xl';
    }
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 transition-all duration-500 border border-slate-200/50 cursor-pointer",
        getHoverClasses(),
        className
      )}
    >
      {/* Top border gradient animation */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${glowColor}-500 to-cyan-500 rounded-t-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
      
      {/* Magnetic field effect */}
      {hoverEffect === 'magnetic' && (
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100/0 via-emerald-100/20 to-emerald-100/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shine overlay */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      </div>
    </div>
  );
};