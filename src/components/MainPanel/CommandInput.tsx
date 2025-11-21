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
 * @file CommandInput.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useState } from 'react';
import { SplitButton } from '../Common/SplitButton';
import { useStore } from '../../store';
import { parseAsciiInput, parseHexInput, parseDecInput, parseBinInput } from '../../utils/formatters';
import { InputFormat } from '../../types';
import { encodeCobs } from '../../utils/cobs';
import { appendCrc } from '../../utils/crc';

export function CommandInput() {
  const [inputValue, setInputValue] = useState('');
  const { 
    lineEnding, 
    setLineEnding, 
    isConnected, 
    sendSerialData, 
    appendLog,
    inputFormat,
    setInputFormat,
    cobsEnabled,
    crcType
  } = useStore();

  const handleSend = async () => {
    if (!inputValue) return;

    let dataToSend: Uint8Array;
    
    try {
      switch (inputFormat) {
        case 'HEX':
          dataToSend = parseHexInput(inputValue);
          break;
        case 'DEC':
          dataToSend = parseDecInput(inputValue);
          break;
        case 'BIN':
          dataToSend = parseBinInput(inputValue);
          break;
        case 'ASCII':
        default:
          // For ASCII, we might append line endings
          let text = inputValue;
          if (lineEnding === 'NL') text += '\n';
          else if (lineEnding === 'CR') text += '\r';
          else if (lineEnding === 'Both') text += '\r\n';
          dataToSend = parseAsciiInput(text);
          break;
      }

      if (dataToSend.length === 0) {
        return;
      }

      // Apply CRC and COBS encoding for HEX mode only
      if (inputFormat === 'HEX') {
        // First append CRC if enabled
        if (crcType !== 'None') {
          dataToSend = appendCrc(dataToSend, crcType);
        }
        
        // Then apply COBS encoding if enabled (after CRC as per requirement)
        if (cobsEnabled) {
          dataToSend = encodeCobs(dataToSend);
        }
      }

      await sendSerialData(dataToSend);
      
      appendLog({
        timestamp: Date.now(),
        direction: 'tx',
        data: Array.from(dataToSend), // Convert Uint8Array to regular array for storage
      });
      
      setInputValue('');
    } catch (error) {
      console.error("Error parsing input:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col gap-1 shrink-0">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Input ({inputFormat})</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              inputFormat === 'ASCII' 
                ? "Enter text..." 
                : `Enter ${inputFormat} values...`
            }
            className="w-full h-11 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          
          {/* Embedded Line Ending Selector for ASCII */}
          {inputFormat === 'ASCII' && (
            <div className="absolute right-1 top-1 bottom-1 flex items-center bg-white dark:bg-gray-900 rounded-r-md">
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
              <select
                value={lineEnding}
                onChange={(e) => setLineEnding(e.target.value as any)}
                className="h-full border-none bg-transparent text-xs text-gray-600 dark:text-gray-400 font-medium focus:ring-0 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 pr-8"
              >
                <option value="None">No Line Ending</option>
                <option value="NL">New Line (NL)</option>
                <option value="CR">Carriage Return (CR)</option>
                <option value="Both">Both (NL & CR)</option>
              </select>
            </div>
          )}
        </div>

        <SplitButton 
          onClick={handleSend}
          onOptionSelect={(opt) => setInputFormat(opt as InputFormat)}
          options={['ASCII', 'HEX', 'DEC', 'BIN']}
          selectedOption={inputFormat}
          mainActionDisabled={!isConnected || !inputValue}
          className="h-11"
        />
      </div>
    </div>
  );
}
