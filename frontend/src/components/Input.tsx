import React, { useState, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils'

const inputContainerVariants = cva(
  'relative w-full',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const inputVariants = cva(
  'w-full border-2 font-serif text-portola-green bg-cloud transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-sand peer',
  {
    variants: {
      size: {
        sm: 'h-10 px-3 py-2 text-xs rounded-sm',
        md: 'h-12 px-4 py-3 text-sm rounded-md',
        lg: 'h-14 px-5 py-4 text-base rounded-lg',
        xl: 'h-16 px-6 py-5 text-lg rounded-xl',
      },
      state: {
        default: 'border-pebble hover:border-dried-thyme focus:border-grass',
        error: 'border-alert focus:border-alert',
        hasContent: 'border-pebble hover:border-dried-thyme focus:border-grass pt-6 pb-1',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  showError?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, type = 'text', label, error, showError = false, ...props }, ref) => {
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

    // Horizontal position - move slightly left to align with cursor
    const labelLeft = size === 'sm' ? 'left-2' : size === 'md' ? 'left-3' : size === 'lg' ? 'left-4' : 'left-5'
    
    // Position label in the vertical center initially, then move to top when focused
    const getLabelClasses = () => {
      if (isFocused || hasValue) {
        // Move to top when focused or has content, but keep same horizontal alignment
        const topPos = size === 'sm' ? 'top-1' : size === 'md' ? 'top-1.5' : size === 'lg' ? 'top-2' : 'top-2.5'
        return `${topPos} ${labelLeft}`
      }
      // Keep vertically centered and horizontally aligned with cursor position
      return `top-1/2 -translate-y-1/2 ${labelLeft}`
    }

    const getTextSize = () => {
      if (isFocused || hasValue) {
        return 'text-xs'
      }
      return size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'
    }

    return (
      <div className="w-full">
        <div className={cn(inputContainerVariants({ size }))}>
          <input
            type={type}
            className={cn(inputVariants({ 
              size, 
              state: showError && error ? 'error' : 'default',
              className 
            }))}
            ref={setRefs}
            placeholder=" "
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {label && (
            <label className={cn(
              'absolute font-serif transition-all duration-200 pointer-events-none',
              isFocused ? 'text-grass' : 'text-steel',
              getLabelClasses(),
              getTextSize()
            )}>
              {label}
            </label>
          )}
        </div>
        {showError && error && (
          <p className="mt-1 text-sm text-alert font-sans">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }