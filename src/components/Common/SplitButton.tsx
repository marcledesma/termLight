/**
 * termLight - Serial Command Manager
 * 
 * Copyright (c) 2025 Marc Ledesma
 * 
 * This project is licensed under the GNU General Public License v3.0
 * See LICENSE file for details or visit: https://www.gnu.org/licenses/gpl-3.0.html
 * 
 * WARNING: Approximately 80% of this codebase was generated using AI assistance.
 * Please review, test, and validate all code before use in production environments.
 * 
 * Description: A serial communication tool for sending, receiving, 
 * and managing commands via COM ports, similar to Docklight with 
 * Arduino-style direct command functionality.
 * 
 * GitHub: https://github.com/marcledesma/termLight
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * @file SplitButton.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Send } from 'lucide-react';
import clsx from 'clsx';

interface SplitButtonProps {
  onClick: () => void;
  onOptionSelect: (option: string) => void;
  options: string[];
  selectedOption: string;
  disabled?: boolean;
  mainActionDisabled?: boolean;
  className?: string;
}

export function SplitButton({
  onClick,
  onOptionSelect,
  options,
  selectedOption,
  disabled = false,
  mainActionDisabled = false,
  className,
}: SplitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={clsx("relative inline-flex shadow-sm rounded-md", className)} ref={dropdownRef}>
      <button
        type="button"
        className={clsx(
          "relative inline-flex items-center gap-x-1.5 rounded-l-md px-4 py-2 text-sm font-semibold text-white",
          "bg-blue-600 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        )}
        onClick={onClick}
        disabled={disabled || mainActionDisabled}
      >
        <Send className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Send
      </button>
      <button
        type="button"
        className={clsx(
          "relative -ml-px inline-flex items-center rounded-r-md bg-blue-600 px-2 py-2 text-white hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="sr-only">Open options</span>
        <ChevronDown className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-1 z-10 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-600">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                className={clsx(
                  "block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700",
                  option === selectedOption ? "bg-gray-50 dark:bg-gray-700 font-semibold text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                )}
                onClick={() => {
                  onOptionSelect(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



