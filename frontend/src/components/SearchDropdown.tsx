import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../utils'

export interface SearchDropdownOption {
  value: string;
  label: string;
}

export interface SearchDropdownProps {
  label?: string;
  options: SearchDropdownOption[];
  value?: string;
  placeholder?: string;
  error?: string;
  showError?: boolean;
  onChange?: (value: string) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const SearchDropdown = React.forwardRef<HTMLInputElement, SearchDropdownProps>(
  ({ 
    className, 
    label, 
    options, 
    value, 
    placeholder = "", 
    error, 
    showError = false, 
    onChange,
    size = 'medium',
    ...props 
  }, _ref) => { // ref changed to _ref
    const [isOpen, setIsOpen] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [hasValue, setHasValue] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const selectedOption = options.find(option => option.value === value)

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
      setHasValue(!!value)
      if (selectedOption && !isFocused) {
        setSearchTerm(selectedOption.label)
      }
    }, [value, selectedOption, isFocused])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setIsFocused(false)
          // Reset search term to selected value when clicking outside
          if (selectedOption) {
            setSearchTerm(selectedOption.label)
          } else {
            setSearchTerm('')
          }
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [selectedOption])

    const handleFocus = () => {
      setIsFocused(true)
      setIsOpen(true)
      // Clear search term on focus to allow typing
      setSearchTerm('')
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value
      setSearchTerm(newSearchTerm)
      setIsOpen(true)
    }

    const handleSelect = (optionValue: string, optionLabel: string) => {
      onChange?.(optionValue)
      setSearchTerm(optionLabel)
      setIsOpen(false)
      setIsFocused(false)
      setHasValue(true)
    }

    const handleBlur = () => {
      // Don't immediately close on blur, let click outside handle it
      // This prevents issues with option selection
    }

    // Size-specific styles
    const getSizeStyles = () => {
      switch (size) {
        case 'small':
          return {
            container: 'h-10',
            input: 'pl-2.5 pr-8 pt-4 pb-2 text-sm',
            label: isFocused || hasValue 
              ? 'top-0.5 left-3 text-xs' 
              : 'top-1/2 -translate-y-1/2 left-3 text-sm',
            dropdown: 'top-11'
          }
        case 'large':
          return {
            container: 'h-14',
            input: 'pl-5 pr-10 pt-6 pb-2 text-lg',
            label: isFocused || hasValue 
              ? 'top-1 left-5 text-sm' 
              : 'top-1/2 -translate-y-1/2 left-5 text-lg',
            dropdown: 'top-15'
          }
        default: // medium
          return {
            container: 'h-12',
            input: 'pl-3.5 pr-9 pt-5 pb-2 text-base',
            label: isFocused || hasValue 
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
              `${sizeStyles.container} w-full rounded-sm border-2 ${sizeStyles.input} text-portola-green bg-cloud font-serif focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-sand floating-input flex items-center justify-between`,
              showError && error && !isFocused ? 'border-alert' : isFocused ? 'border-grass' : 'border-pebble hover:border-dried-thyme',
              className
            )}
          >
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              className="flex-1 bg-transparent border-none outline-none p-0 font-serif text-portola-green"
              placeholder={placeholder}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoComplete="off"
              {...props}
            />
            <svg 
              className={cn(
                'w-4 h-4 transition-transform duration-200 ml-auto flex-shrink-0 -mt-2.5 cursor-pointer',
                showError && error && !isFocused ? 'text-alert' : isFocused ? 'text-grass' : 'text-steel',
                isOpen && 'rotate-180'
              )} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              onClick={(e) => {
                e.preventDefault()
                if (isOpen) {
                  setIsOpen(false)
                  setIsFocused(false)
                  if (selectedOption) {
                    setSearchTerm(selectedOption.label)
                  } else {
                    setSearchTerm('')
                  }
                } else {
                  setIsOpen(true)
                  setIsFocused(true)
                  setSearchTerm('')
                  inputRef.current?.focus()
                }
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {label && (
            <label className={cn(
              'pointer-events-none absolute font-serif transition-all duration-200 floating-label',
              `${sizeStyles.label}`,
              isFocused || hasValue 
                ? 'text-grass' 
                : showError && error 
                  ? 'text-alert'
                  : 'text-steel'
            )}>
              {label}
            </label>
          )}

          {isOpen && filteredOptions.length > 0 && (
            <div className={cn(
              `absolute ${sizeStyles.dropdown} left-0 right-0 bg-cloud border-2 border-pebble rounded-sm shadow-medium z-50 max-h-60 overflow-y-auto`
            )}>
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'px-3.5 py-3 cursor-pointer font-serif text-portola-green hover:bg-sand transition-colors duration-150',
                    value === option.value && 'bg-pebble'
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault() // Prevent input blur
                    handleSelect(option.value, option.label)
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}

          {isOpen && filteredOptions.length === 0 && searchTerm && (
            <div className={cn(
              `absolute ${sizeStyles.dropdown} left-0 right-0 bg-cloud border-2 border-pebble rounded-sm shadow-medium z-50`
            )}>
              <div className="px-3.5 py-3 font-serif text-steel">
                No results found
              </div>
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

SearchDropdown.displayName = 'SearchDropdown'

export { SearchDropdown }