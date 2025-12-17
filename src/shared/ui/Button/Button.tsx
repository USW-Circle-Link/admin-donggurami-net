import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary';
}

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "w-full h-[74px] flex items-center justify-center px-[24px] py-[10px] rounded-[12px] border border-[#d7d7d7] font-['Pretendard'] font-bold text-[32px] transition-colors",
        variant === 'primary' && "bg-[#FFB052] text-white hover:bg-[#ffa030]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
