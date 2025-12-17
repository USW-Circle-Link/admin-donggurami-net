import type { ReactNode } from 'react';
import { cn } from '../utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("bg-white rounded-[16px] shadow-card", className)}>
      {children}
    </div>
  );
}
