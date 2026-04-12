import React from 'react';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  effect?: 'float' | 'tilt' | 'glow' | 'scale' | 'magnetic';
  glowColor?: 'emerald' | 'green' | 'cyan' | 'blue' | 'red';
  borderColor?: string;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className = '',
  effect = 'float',
  glowColor = 'emerald',
  borderColor = 'from-emerald-500 to-cyan-500'
}) => {
  const baseClasses = "group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 transition-all duration-500 border border-slate-200/50 cursor-pointer";
  
  const effectClasses = {
    float: "hover:-translate-y-2 hover:shadow-2xl",
    tilt: "hover:rotate-1 hover:-translate-y-1 hover:shadow-2xl",
    glow: `hover:shadow-2xl hover:shadow-${glowColor}-200/30 hover:border-${glowColor}-200`,
    scale: "hover:scale-105 hover:shadow-2xl",
    magnetic: "hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
  };

  const combinedClasses = `${baseClasses} ${effectClasses[effect]} ${className}`;

  return (
    <div className={combinedClasses}>
      {/* Top gradient border */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${borderColor} rounded-t-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
      
      {/* Magnetic field effect */}
      {effect === 'magnetic' && (
        <div className={`absolute -inset-4 bg-${glowColor}-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl rounded-3xl`}></div>
      )}
      
      {/* Glow effect */}
      {effect === 'glow' && (
        <div className={`absolute -inset-2 bg-${glowColor}-100/50 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shine overlay */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      </div>
      
      {/* Floating particles for magnetic effect */}
      {effect === 'magnetic' && (
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className={`absolute top-4 right-4 w-2 h-2 bg-${glowColor}-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-100`}></div>
          <div className={`absolute bottom-6 left-6 w-1 h-1 bg-${glowColor}-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-200`}></div>
        </div>
      )}
    </div>
  );
};