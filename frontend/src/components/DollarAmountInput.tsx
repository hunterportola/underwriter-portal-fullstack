import React, { useState, useEffect } from 'react'
import { cn } from '../utils'

export interface DollarAmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label?: string;
  value?: string;
  error?: string;
  showError?: boolean;
  onChange?: (value: string) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  allowCents?: boolean;
  maxAmount?: number;
}

const DollarAmountInput = React.forwardRef<HTMLInputElement, DollarAmountInputProps>(
  ({ className, label, value, error, showError = false, onChange, size = 'medium', allowCents = true, maxAmount = 999999999, ...props }, ref) => {
    const [hasValue, setHasValue] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [displayValue, setDisplayValue] = useState('')

    useEffect(() => {
      if (value) {
        setDisplayValue(formatCurrency(value))
        setHasValue(true)
      } else {
        setDisplayValue('')
        setHasValue(false)
      }
    }, [value, allowCents, maxAmount])

    const formatCurrency = (input: string): string => {
      let digits = input.replace(/[^\d.]/g, '')
      if (allowCents) {
        const decimalCount = (digits.match(/\./g) || []).length
        if (decimalCount > 1) {
          const parts = digits.split('.')
          digits = parts[0] + '.' + parts.slice(1).join('')
        }
        const decimalIndex = digits.indexOf('.')
        if (decimalIndex !== -1 && digits.length > decimalIndex + 3) {
          digits = digits.substring(0, decimalIndex + 3)
        }
      } else {
        digits = digits.replace(/\./g, '')
      }
      if (!digits) return ''
      const numValue = parseFloat(digits)
      if (isNaN(numValue) || numValue > maxAmount) {
        return displayValue
      }
      if (allowCents && digits.includes('.')) {
        const [wholePart, decimalPart] = digits.split('.')
        const formattedWhole = parseInt(wholePart).toLocaleString()
        return `$${formattedWhole}.${decimalPart}`
      } else {
        const formattedNumber = numValue.toLocaleString()
        return `$${formattedNumber}`
      }
    }

    const getRawValue = (formattedValue: string): string => {
      return formattedValue.replace(/[$,]/g, '')
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (!inputValue.startsWith('$') && inputValue !== '') {
        const corrected = '$' + inputValue
        const formatted = formatCurrency(corrected)
        setDisplayValue(formatted)
        setHasValue(formatted !== '' && formatted !== '$')
        if (onChange) {
          const rawValue = getRawValue(formatted)
          onChange(rawValue)
        }
        return
      }
      if (inputValue === '' || inputValue === '$') {
        if (!isFocused) {
          setDisplayValue('')
          setHasValue(false)
          if (onChange) {
            onChange('')
          }
        } else {
          setDisplayValue('$')
          setHasValue(false)
          if (onChange) {
            onChange('')
          }
        }
        return
      }
      const formatted = formatCurrency(inputValue)
      setDisplayValue(formatted)
      setHasValue(formatted !== '' && formatted !== '$')
      if (onChange) {
        const rawValue = getRawValue(formatted)
        onChange(rawValue)
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (!displayValue) {
        setDisplayValue('$')
      }
      if (props.onFocus) {
        props.onFocus(e)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      if (displayValue === '$') {
        setDisplayValue('')
        setHasValue(false)
        if (onChange) {
          onChange('')
        }
      }
      if (props.onBlur) {
        props.onBlur(e)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget
      const cursorPos = input.selectionStart || 0
      if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPos <= 1) {
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowLeft' && cursorPos <= 1) {
        e.preventDefault()
        return
      }
      if (e.key === 'Home') {
        e.preventDefault()
        input.setSelectionRange(1, 1)
        return
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'small': return { container: 'h-10', input: 'pl-2.5 pr-3 pt-4 pb-2 text-sm', label: isFocused || hasValue ? 'top-0.5 left-3 text-xs' : 'top-1/2 -translate-y-1/2 left-3 text-sm' }
        case 'large': return { container: 'h-14', input: 'pl-5 pr-5 pt-6 pb-2 text-lg', label: isFocused || hasValue ? 'top-1 left-5 text-sm' : 'top-1/2 -translate-y-1/2 left-5 text-lg' }
        default: return { container: 'h-12', input: 'pl-3.5 pr-4 pt-5 pb-2 text-base', label: isFocused || hasValue ? 'top-1 left-4 text-xs' : 'top-1/2 -translate-y-1/2 left-4 text-sm' }
      }
    }
    const sizeStyles = getSizeStyles()

    return (
      <div className="w-full">
        <div className="relative my-4 floating-label-container">
          <input
            type="text"
            className={cn(`${sizeStyles.container} w-full rounded-sm border-2 ${sizeStyles.input} text-portola-green bg-cloud font-serif focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-sand floating-input`, showError && error && !isFocused ? 'border-alert' : isFocused ? 'border-grass' : 'border-pebble hover:border-dried-thyme', className)}
            ref={ref}
            value={displayValue}
            placeholder=" "
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            {...props}
          />
          {label && ( <label className={cn('pointer-events-none absolute font-serif transition-all duration-200 floating-label', `${sizeStyles.label}`, isFocused || hasValue ? 'text-grass' : showError && error ? 'text-alert' : 'text-steel')}> {label} </label> )}
        </div>
        {showError && error && !isFocused && ( <div className="flex items-center gap-1.5 -mt-3"> <svg className="w-3 h-3 text-alert flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /> </svg> <p className="text-sm text-alert font-serif"> {error} </p> </div> )}
      </div>
    )
  }
)
DollarAmountInput.displayName = 'DollarAmountInput'
export { DollarAmountInput }