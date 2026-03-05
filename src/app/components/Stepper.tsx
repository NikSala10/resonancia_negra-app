import { Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Stepper({ value, onChange, min = 0, max, step = 1, label, size = 'md' }: StepperProps) {
  const handleDecrement = () => {
    const newValue = value - step;
    if (min !== undefined && newValue < min) return;
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <span className="text-xs font-semibold text-[#FCFFBA] uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleDecrement}
          variant="outline"
          size="icon"
          disabled={min !== undefined && value <= min}
          className={`${sizeClasses[size]} shrink-0 bg-[#063850]/50 border-[#11A1AB]/30 hover:bg-[#063850] hover:border-[#B89726] text-[#FCFFBA] disabled:opacity-30`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className={`flex-1 flex items-center justify-center ${sizeClasses[size]} bg-[#063850]/70 border-2 border-[#11A1AB]/30 rounded-md font-bold text-[#FCFFBA]`}>
          {value}
        </div>
        
        <Button
          onClick={handleIncrement}
          variant="outline"
          size="icon"
          disabled={max !== undefined && value >= max}
          className={`${sizeClasses[size]} shrink-0 bg-[#063850]/50 border-[#11A1AB]/30 hover:bg-[#063850] hover:border-[#B89726] text-[#FCFFBA] disabled:opacity-30`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
