import React, { useState, useEffect } from 'react'
import { cn } from '../utils'

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label?: string;
  value?: string;
  error?: string;
  showError?: boolean;
  onChange?: (value: string) => void;
  onValidDate?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, label, value, error, showError = false, onChange, onValidDate, size = 'medium', ...props }, ref) => {
    const [hasValue, setHasValue] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)

    const setRefs = (element: HTMLInputElement | null) => {
      setInputRef(element)
      if (typeof ref === 'function') { ref(element) } else if (ref) { ref.current = element }
    }

    useEffect(() => {
      if (inputRef) { setHasValue(inputRef.value !== '') }
    }, [inputRef, value])

    const isValidDate = (dateStr: string): boolean => {
      if (dateStr.length !== 8) return false
      const month = parseInt(dateStr.substring(0, 2))
      const day = parseInt(dateStr.substring(2, 4))
      const year = parseInt(dateStr.substring(4, 8))
      if (year < 1900 || year > 2100) return false
      if (month < 1 || month > 12) return false
      if (day < 1 || day > 31) return false
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
      if (isLeapYear && month === 2) { daysInMonth[1] = 29 }
      return day <= daysInMonth[month - 1]
    }

    const formatDate = (input: string): string => {
      const digits = input.replace(/\D/g, '')
      const limitedDigits = digits.substring(0, 8)
      if (limitedDigits.length >= 2) {
        let formatted = limitedDigits.substring(0, 2)
        if (limitedDigits.length >= 4) {
          formatted += '/' + limitedDigits.substring(2, 4)
          if (limitedDigits.length >= 6) {
            formatted += '/' + limitedDigits.substring(4, 8)
          }
        }
        return formatted
      }
      return limitedDigits
    }

    const shouldAutoTab = (input: string): boolean => {
      const digits = input.replace(/\D/g, '')
      if (digits.length === 1 && parseInt(digits[0]) >= 4) return true
      if (digits.length === 8 && isValidDate(digits)) return true
      return false
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value
      const formattedValue = formatDate(rawInput)
      e.target.value = formattedValue
      setHasValue(formattedValue !== '')
      if (onChange) { onChange(formattedValue) }
      if (shouldAutoTab(rawInput) && onValidDate) { onValidDate() }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (props.onFocus) { props.onFocus(e) }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      if (props.onBlur) { props.onBlur(e) }
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
            ref={setRefs}
            placeholder=" "
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={10}
            {...props}
          />
          {label && ( <label className={cn('pointer-events-none absolute font-serif transition-all duration-200 floating-label', `${sizeStyles.label}`, isFocused || hasValue ? 'text-grass' : showError && error ? 'text-alert' : 'text-steel')}> {label} </label> )}
        </div>
        {showError && error && !isFocused && ( <div className="flex items-center gap-1.5 -mt-3"> <svg className="w-3 h-3 text-alert flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"> <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /> </svg> <p className="text-sm text-alert font-serif"> {error} </p> </div> )}
      </div>
    )
  }
)
DateInput.displayName = 'DateInput'
export { DateInput }