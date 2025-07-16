import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../utils'

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  error?: string;
  showError?: boolean;
  onChange?: (value: string) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ 
    className, 
    label, 
    options, 
    value, 
    placeholder = "Select an option...", 
    error, 
    showError = false, 
    onChange,
    size = 'medium',
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(option => option.value === value)

    useEffect(() => {
      setHasValue(!!value)
    }, [value])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setIsFocused(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleToggle = () => {
      setIsOpen(!isOpen)
      setIsFocused(!isOpen)
    }

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue)
      setIsOpen(false)
      setIsFocused(false)
      setHasValue(true)
    }

    // Size-specific styles
    const getSizeStyles = () => {
      switch (size) {
        case 'small':
          return {
            container: 'h-10',
            input: 'pl-2.5 pr-8 pt-4 pb-2 text-sm',
            label: hasValue 
              ? 'top-0.5 left-3 text-xs' 
              : 'top-1/2 -translate-y-1/2 left-3 text-sm',
            dropdown: 'top-11'
          }
        case 'large':
          return {
            container: 'h-14',
            input: 'pl-5 pr-10 pt-6 pb-2 text-lg',
            label: hasValue 
              ? 'top-1 left-5 text-sm' 
              : 'top-1/2 -translate-y-1/2 left-5 text-lg',
            dropdown: 'top-15'
          }
        default: // medium
          return {
            container: 'h-12',
            input: 'pl-3.5 pr-9 pt-5 pb-2 text-base',
            label: hasValue 
              ? 'top-1 left-4 text-xs' 
              : 'top-1/2 -translate-y-1/2 left-4 text-sm',
            dropdown: 'top-13'
          }
      }
    }

    const sizeStyles = getSizeStyles()

    return (
      <div className="w-full">
        <div className="relative my-4 floating-label-container" ref={dropdownRef}>
          <div
            className={cn(
              `${sizeStyles.container} w-full rounded-sm border-2 ${sizeStyles.input} text-portola-green bg-cloud font-serif cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-sand floating-input flex items-center justify-between`,
              showError && error ? 'border-alert focus:border-grass' : 'border-pebble hover:border-dried-thyme focus:border-grass',
              className
            )}
            onClick={handleToggle}
            ref={ref}
            {...props}
          >
            {selectedOption && (
              <span className="text-portola-green">
                {selectedOption.label}
              </span>
            )}
            <svg 
              className={cn(
                'w-4 h-4 text-steel transition-transform duration-200 ml-auto flex-shrink-0 -mt-2.5',
                isOpen && 'rotate-180'
              )} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {label && (
            <label className={cn(
              'pointer-events-none absolute font-serif transition-all duration-200 floating-label',
              `${sizeStyles.label}`,
              hasValue 
                ? 'text-grass' 
                : showError && error 
                  ? 'text-alert'
                  : 'text-steel'
            )}>
              {label}
            </label>
          )}

          {isOpen && (
            <div className={cn(
              `absolute ${sizeStyles.dropdown} left-0 right-0 bg-cloud border-2 border-pebble rounded-sm shadow-medium z-50 max-h-60 overflow-y-auto`
            )}>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'px-3.5 py-3 cursor-pointer font-serif text-portola-green hover:bg-sand transition-colors duration-150',
                    value === option.value && 'bg-pebble'
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {showError && error && !isFocused && (
          <div className="flex items-center gap-1.5 -mt-3">
            <svg className="w-3 h-3 text-alert flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-alert font-serif">
              {error}
            </p>
          </div>
        )}
      </div>
    )
  }
)

Dropdown.displayName = 'Dropdown'

export { Dropdown }