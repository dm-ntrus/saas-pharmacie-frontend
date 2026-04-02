import React from 'react';

interface MicroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  animation?: 'ripple' | 'glow' | 'bounce' | 'magnetic' | 'slide';
}

export const MicroButton: React.FC<MicroButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  animation = 'ripple',
  className = '',
  ...props
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 focus-visible:ring-emerald-500",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:shadow-md hover:border-slate-300 focus-visible:ring-slate-500",
    ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500",
    outline: "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:shadow-md focus-visible:ring-emerald-500"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };

  const animationClasses = {
    ripple: "before:absolute before:inset-0 before:bg-white/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
    glow: "hover:shadow-2xl",
    bounce: "hover:scale-105",
    magnetic: "hover:scale-105 hover:-translate-y-1",
    slide: "hover:translate-x-1"
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${animationClasses[animation]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && iconPosition === 'left' && (
          <span className="group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-200">
            {icon}
          </span>
        )}
        <span className="group-hover:tracking-wide transition-all duration-200">
          {children}
        </span>
        {icon && iconPosition === 'right' && (
          <span className="group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-200">
            {icon}
          </span>
        )}
      </span>

      {/* Ripple effect */}
      {animation === 'ripple' && (
        <span className="absolute inset-0 overflow-hidden rounded-xl">
          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        </span>
      )}

      {/* Glow effect */}
      {animation === 'glow' && (
        <span className="absolute -inset-2 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl rounded-2xl" />
      )}

      {/* Magnetic field */}
      {animation === 'magnetic' && (
        <>
          <span className="absolute -inset-4 bg-gradient-to-r from-emerald-100/0 via-emerald-100/30 to-emerald-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl rounded-3xl" />
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 to-cyan-400/0 group-hover:from-emerald-400/10 group-hover:to-cyan-400/10 transition-all duration-300 rounded-xl" />
        </>
      )}

      {/* Particle effects for bounce */}
      {animation === 'bounce' && (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute top-2 right-2 w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-200"></div>
        </div>
      )}

      {/* Slide indicator */}
      {animation === 'slide' && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-200 delay-100" />
      )}
    </button>
  );
};