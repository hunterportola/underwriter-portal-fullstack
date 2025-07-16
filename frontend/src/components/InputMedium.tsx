import React, { useState, useEffect } from 'react'
import { cn } from '../utils'

export interface InputMediumProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  showError?: boolean;
}

const InputMedium = React.forwardRef<HTMLInputElement, InputMediumProps>(
  ({ className, type = 'text', label, error, showError = false, ...props }, ref) => {
    const [hasValue, setHasValue] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)

    const setRefs = (element: HTMLInputElement | null) => {
      setInputRef(element)
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }

    useEffect(() => {
      if (inputRef) {
        setHasValue(inputRef.value !== '')
      }
    }, [inputRef, props.value])

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value !== '')
      if (props.onChange) {
        props.onChange(e)
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (props.onFocus) {
        props.onFocus(e)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      if (props.onBlur) {
        props.onBlur(e)
      }
    }

    return (
      <div className="w-full">
        <div className="relative my-4 floating-label-container">
          <input
            type={type}
            className={cn(
              'h-12 w-full rounded-sm border-2 pl-3.5 pr-4 pt-5 pb-2 text-base text-portola-green bg-cloud font-serif focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-sand floating-input',
              showError && error ? 'border-alert focus:border-grass' : 'border-pebble hover:border-dried-thyme focus:border-grass',
              className
            )}
            ref={setRefs}
            placeholder=" "
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {label && (
            <label className={cn(
              'pointer-events-none absolute left-4 font-serif transition-all duration-200 floating-label',
              isFocused || hasValue 
                ? 'top-1 text-xs text-grass' 
                : showError && error 
                  ? 'top-1/2 -translate-y-1/2 text-sm text-alert'
                  : 'top-1/2 -translate-y-1/2 text-sm text-steel'
            )}>
              {label}
            </label>
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
InputMedium.displayName = 'InputMedium'

export { InputMedium }