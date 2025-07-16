import React from 'react';
import { InputLarge } from './InputLarge';
import type { InputLargeProps } from './InputLarge';

// 1. ADD `size` to the component's props
interface DayInputProps extends Omit<InputLargeProps, 'value' | 'onChange' | 'maxLength' | 'size'> {
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const DayInput = React.forwardRef<HTMLInputElement, DayInputProps>(
  ({ value, onChange, onComplete, size, ...props }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
      onChange(digits);

      if (onComplete) {
        if (digits.length === 2 || (digits.length === 1 && parseInt(digits[0]) >= 4)) {
          onComplete();
        }
      }
    };

    return (
      <InputLarge
        {...props}
        ref={ref}
        value={value}
        onChange={handleChange}
        maxLength={2}
      />
    );
  }
);
DayInput.displayName = 'DayInput';