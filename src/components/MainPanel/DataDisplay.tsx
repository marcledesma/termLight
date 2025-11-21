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
 * @file DataDisplay.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useStore } from '../../store';
import { formatDataAsAscii, formatDataAsHex, formatDataAsDec, formatDataAsBin } from '../../utils/formatters';
import { decodeCobs } from '../../utils/cobs';
import { validateCrc } from '../../utils/crc';

export function DataDisplay() {
  const { dataFormat, dataLog, fontSize, displayColors, autoScroll, cobsEnabled, crcType } = useStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current && autoScroll) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dataLog, autoScroll]);

  const renderData = (data: number[]): { formatted: string; crcValid: boolean | null } => {
    // Convert number[] back to Uint8Array for formatting
    let uint8Data = new Uint8Array(data);
    let crcValid: boolean | null = null;
    
    // Apply COBS decoding and CRC validation only for HEX mode
    if (dataFormat === 'HEX') {
      try {
        // First, decode COBS if enabled
        if (cobsEnabled) {
          uint8Data = decodeCobs(uint8Data);
        }
        
        // Then, validate and strip CRC if enabled
        if (crcType !== 'None') {
          const validation = validateCrc(uint8Data, crcType);
          crcValid = validation.isValid;
          uint8Data = validation.dataWithoutCrc;
        }
      } catch (error) {
        console.error('Error processing HEX data:', error);
        // If processing fails, show original data
        crcValid = false;
      }
    }
    
    let formatted: string;
    switch (dataFormat) {
      case 'HEX':
        formatted = formatDataAsHex(uint8Data);
        break;
      case 'DEC':
        formatted = formatDataAsDec(uint8Data);
        break;
      case 'BIN':
        formatted = formatDataAsBin(uint8Data);
        break;
      case 'Serial Monitor(ASCII)':
      default:
        formatted = formatDataAsAscii(uint8Data);
        break;
    }
    
    return { formatted, crcValid };
  };

  const fontSizeClass = {
    'Small': 'text-sm',
    'Medium': 'text-base',
    'Large': 'text-lg',
  }[fontSize];

  const metaFontSizeClass = {
    'Small': 'text-xs',
    'Medium': 'text-sm',
    'Large': 'text-base',
  }[fontSize];

  return (
    <div
      className={clsx(
        'flex-1 overflow-y-auto p-4 font-mono printable-content',
        fontSizeClass,
        'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100'
      )}
    >
      {dataLog.length === 0 && (
        <div className="text-gray-500 dark:text-gray-400 italic">
          {`${dataFormat} mode - Data will appear here...`}
        </div>
      )}
      
      {dataLog.map((entry, index) => {
        const { formatted, crcValid } = renderData(entry.data);
        const timestamp = new Date(entry.timestamp).toLocaleTimeString();
        const color = entry.direction === 'rx' ? displayColors.receive : displayColors.send;
        
        // Docklight style: structured log
        return (
          <div key={index} className="mb-1" style={{ color }}>
            <span className={clsx("text-gray-400 select-none mr-2", metaFontSizeClass)}>
              [{timestamp}] {entry.direction.toUpperCase()}:
            </span>
            <span className="whitespace-pre-wrap break-all font-medium">
              {formatted}
            </span>
            {crcValid !== null && (
              <span className={clsx("ml-2 select-none", metaFontSizeClass)}>
                {crcValid ? (
                  <span className="text-green-600 dark:text-green-400">✓ CRC</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">✗ CRC</span>
                )}
              </span>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
