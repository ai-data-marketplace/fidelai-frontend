import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({ className, label, id, checked, onChange, disabled, ...props }: CheckboxProps) {
  return (
    <div className={cn('flex items-center gap-2', disabled && 'opacity-50 cursor-not-allowed')}>
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            'w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors',
            'border-gray-500 bg-white dark:bg-zinc-900 dark:border-zinc-500',
            'peer-checked:bg-primary peer-checked:border-primary',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
            className
          )}
        >
          {checked && (
            <svg
              className="w-2.5 h-2.5 text-white"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 5L4 7.5L8.5 2.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      {label && (
        <label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none select-none',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}