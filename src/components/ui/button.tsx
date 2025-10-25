import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    default: 'bg-terminal-blue text-white hover:bg-terminal-blue/80 focus:ring-terminal-blue',
    outline: 'border border-terminal-border text-terminal-text hover:bg-terminal-surface focus:ring-terminal-blue',
    ghost: 'text-terminal-text hover:bg-terminal-surface focus:ring-terminal-blue'
  };
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-8'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}