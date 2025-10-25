import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`terminal-card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`terminal-card-header ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`font-semibold text-heading ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`terminal-card-content ${className}`}>
      {children}
    </div>
  );
}