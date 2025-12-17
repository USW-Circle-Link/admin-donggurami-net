import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '../utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string; // Placeholder behavior in design looks like a label or placeholder
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, icon, label, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-[10px] h-[74px] px-[24px] py-[10px] bg-white rounded-[12px] border border-[#d7d7d7] shadow-card w-full",
          containerClassName
        )}
      >
        {icon && <div className="shrink-0 size-[26px] text-[#9d9d9d] flex items-center justify-center">{icon}</div>}
        <input
          ref={ref}
          className={cn(
            "w-full h-full bg-transparent border-none outline-none text-[20px] text-[#9d9d9d] placeholder:text-[#9d9d9d] font-['Pretendard']",
            className
          )}
          placeholder={label}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
