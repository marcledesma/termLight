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
 * @file FormatSelector.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import clsx from 'clsx';
import { ArrowDown, Trash2 } from 'lucide-react';
import { useStore } from '../../store';
import { DataFormat } from '../../types';

const formats: DataFormat[] = ['Serial Monitor(ASCII)', 'HEX', 'DEC', 'BIN'];

export function FormatSelector() {
  const { dataFormat, setDataFormat, autoScroll, setAutoScroll, clearLog } = useStore();

  return (
    <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 pr-2 relative z-10 shrink-0">
      <div className="flex">
        {formats.map((format) => (
          <button
            key={format}
            className={clsx(
              'px-4 py-2 text-sm font-medium transition-colors',
              'border-r border-gray-300 dark:border-gray-700 last:border-r-0',
              {
                'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500':
                  dataFormat === format,
                'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800':
                  dataFormat !== format,
              }
            )}
            onClick={() => setDataFormat(format)}
          >
            {format}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={clsx(
            "flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors border",
            autoScroll
              ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
          )}
          title="Toggle Auto-scroll"
        >
          <ArrowDown size={14} />
          <span>Auto-scroll</span>
        </button>

        <button
          onClick={clearLog}
          className="flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-red-600 hover:border-red-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-red-400 dark:hover:border-red-800"
          title="Clear Terminal"
        >
          <Trash2 size={14} />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}



