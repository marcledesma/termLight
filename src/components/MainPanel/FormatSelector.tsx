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
import { useStore } from '../../store';
import { DataFormat } from '../../types';

const formats: DataFormat[] = ['Serial Monitor(ASCII)', 'HEX', 'DEC', 'BIN'];

export function FormatSelector() {
  const { dataFormat, setDataFormat } = useStore();

  return (
    <div className="flex border-b border-gray-300">
      {formats.map((format) => (
        <button
          key={format}
          className={clsx(
            'px-4 py-2 text-sm font-medium transition-colors',
            'border-r border-gray-300 last:border-r-0',
            {
              'bg-white text-blue-600 border-b-2 border-blue-600':
                dataFormat === format,
              'bg-gray-50 text-gray-700 hover:bg-gray-100':
                dataFormat !== format,
            }
          )}
          onClick={() => setDataFormat(format)}
        >
          {format}
        </button>
      ))}
    </div>
  );
}



