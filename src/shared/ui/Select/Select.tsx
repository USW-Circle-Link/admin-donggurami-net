import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({ options, value, onChange, placeholder, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between h-[74px] px-[24px] py-[10px] bg-white rounded-[12px] border border-[#d7d7d7] shadow-card cursor-pointer w-full"
      >
        <span className="text-[20px] text-[#9d9d9d] font-['Pretendard']">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("text-[#9d9d9d] transition-transform", isOpen && "rotate-180")} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%-8px)] left-0 w-full z-10 flex flex-col shadow-card rounded-[12px] overflow-hidden">
          {options.map((option, index) => {
            const isLast = index === options.length - 1;
            const isFirst = index === 0;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "h-[74px] flex items-center px-[24px] py-[10px] border border-[#d7d7d7] cursor-pointer transition-colors",
                  option.value === value
                    ? "bg-[#FFB052] border-[#FFB052]"
                    : "bg-white hover:bg-gray-50",
                  // Replicate the visual style from Figma where dropdown items stack
                  isFirst ? "rounded-t-[12px]" : "",
                  isLast ? "rounded-b-[12px]" : "",
                  "border-t-0 first:border-t"
                )}
              >
                <span className={cn(
                  "text-[20px] font-['Pretendard'] font-bold",
                  option.value === value ? "text-white" : "text-[#9d9d9d]"
                )}>
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
