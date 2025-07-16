import React from 'react';
import { InputLarge } from './InputLarge';
import type { InputLargeProps } from './InputLarge'; // <-- Corrected import

interface SimpleDateInputProps extends Omit<InputLargeProps, 'value' | 'onChange'> {
  value: string; // Expects "MM-DD-YYYY"
  onChange: (value: string) => void;
}

const formatInput = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  let result = '';
  if (digits.length > 0) {
    result = digits.slice(0, 2);
  }
  if (digits.length > 2) {
    result += '-' + digits.slice(2, 4);
  }
  if (digits.length > 4) {
    result += '-' + digits.slice(4, 8);
  }
  return result;
};

export const SimpleDateInput = React.forwardRef<HTMLInputElement, SimpleDateInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');

    React.useEffect(() => {
        setDisplayValue(formatInput(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatInput(e.target.value);
      setDisplayValue(formatted);
      onChange(formatted);
    };

    return (
      <InputLarge
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        maxLength={10} // MM-DD-YYYY
      />
    );
  }
);
SimpleDateInput.displayName = 'SimpleDateInput';