import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "relative cursor-pointer inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 focus-visible:ring-sky-500 before:absolute before:inset-0 before:bg-gradient-to-r before:from-sky-500 before:to-cyan-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        destructive: "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5 focus-visible:ring-red-500 before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500 before:to-pink-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        outline: "border-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md focus-visible:ring-slate-500 transition-all duration-200",
        secondary: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900 hover:from-slate-200 hover:to-slate-300 hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-slate-500 transition-all duration-200",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500 hover:scale-105 transition-all duration-200",
        link: "text-sky-600 underline-offset-4 hover:underline focus-visible:ring-sky-500 hover:text-sky-700 transition-colors duration-200",
        gradient: "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:-translate-y-1 focus-visible:ring-yellow-500 before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow-300 before:to-orange-400 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        glassmorphism: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:scale-105 focus-visible:ring-white/50 transition-all duration-300",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, icon, iconPosition = 'left', children, ...props }, ref) => {
    const Component = asChild ? 'span' : 'button';
    
    return (
      <Component
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Chargement...</span>
          </div>
        ) : (
          <div className="relative z-10 flex items-center gap-2">
            {icon && iconPosition === 'left' && (
              <span className="group-hover:scale-110 transition-transform duration-200">
                {icon}
              </span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                {icon}
              </span>
            )}
          </div>
        )}
        
        {/* Ripple effect */}
        <span className="absolute inset-0 overflow-hidden rounded-xl">
          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        </span>
      </Component>
    );
  }
));
Button.displayName = "Button";

export { Button, buttonVariants };