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
 * @file CommandModal.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store';
import { useCommands } from '../../hooks/useCommands';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import { InputFormat, LineEnding } from '../../types';
import { 
  parseAsciiInput, 
  parseHexInput, 
  parseDecInput, 
  parseBinInput,
  bytesToHex,
  bytesToDec,
  bytesToBin,
  bytesToAscii
} from '../../utils/formatters';
import { commandService } from '../../services/commandService';
import { appendCrc, CrcType } from '../../utils/crc';

interface CommandModalProps {
  // If editing, pass the command ID to edit
  editingCommandId?: string | null;
}

export function CommandModal({ editingCommandId }: CommandModalProps) {
  const { setActiveModal } = useStore();
  const { createCommand, updateCommand, commands } = useCommands();
  
  // Use a ref to access latest commands without triggering effect
  const commandsRef = useRef(commands);
  commandsRef.current = commands;

  const [name, setName] = useState('New Command');
  const [inputValue, setInputValue] = useState('');
  const [format, setFormat] = useState<InputFormat>('ASCII');
  const [lineEnding, setLineEnding] = useState<LineEnding>('None');
  const [crcType, setCrcType] = useState<CrcType>('None');
  const [error, setError] = useState<string | null>(null);

  // Initialize state when opening for edit
  useEffect(() => {
    if (editingCommandId) {
      // Re-find the command to ensure we have the latest data
      // Use ref to avoid resetting state when commands list updates (e.g. sorting/filtering changes)
      const currentCommand = commandsRef.current.find(c => c.id === editingCommandId);
      
      if (currentCommand) {
        setName(currentCommand.name);
        
        // Determine initial format from saved preference or default
        const initialFormat = currentCommand.inputFormat || 'HEX';
        setFormat(initialFormat);
        setLineEnding(currentCommand.lineEnding || 'None');

        // Convert stored Hex Sequence back to the input format for display
        try {
          const bytes = commandService.parseHexSequence(currentCommand.sequence);
          let displayValue = '';
          
          switch (initialFormat) {
            case 'HEX':
              displayValue = bytesToHex(bytes);
              break;
            case 'DEC':
              displayValue = bytesToDec(bytes);
              break;
            case 'BIN':
              displayValue = bytesToBin(bytes);
              break;
            case 'ASCII':
              displayValue = bytesToAscii(bytes);
              break;
            default:
               displayValue = bytesToHex(bytes);
          }
          setInputValue(displayValue);
        } catch (e) {
          console.error("Error parsing stored sequence for display", e);
          setInputValue(currentCommand.sequence); // Fallback
        }
      }
    } else {
      // Reset for new command
      setName('New Command');
      setInputValue('');
      setFormat('ASCII');
      setLineEnding('None');
      setCrcType('None');
    }
    // Only run when the ID changes (modal open/switch mode), NOT when commands list changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingCommandId]); 

  const handleSave = () => {
    setError(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Command name is required');
      return;
    }

    if (!inputValue) {
      setError('Command sequence is required');
      return;
    }

    try {
      let bytes: Uint8Array;

      // Parse input based on selected format
      switch (format) {
        case 'HEX':
          bytes = parseHexInput(inputValue);
          break;
        case 'DEC':
          bytes = parseDecInput(inputValue);
          break;
        case 'BIN':
          bytes = parseBinInput(inputValue);
          break;
        case 'ASCII':
        default:
          let text = inputValue;
          if (lineEnding === 'NL') text += '\n';
          else if (lineEnding === 'CR') text += '\r';
          else if (lineEnding === 'Both') text += '\r\n';
          bytes = parseAsciiInput(text);
          break;
      }

      // Append CRC if selected
      bytes = appendCrc(bytes, crcType);

      // Convert bytes to normalized Hex String for storage
      const hexSequence = commandService.bytesToHexSequence(bytes);

      if (editingCommandId) {
        updateCommand(editingCommandId, {
          name: trimmedName,
          sequence: hexSequence,
          inputFormat: format,
          lineEnding: lineEnding
        });
      } else {
        createCommand(trimmedName, hexSequence, undefined, 0, 5, format, lineEnding);
      }
      
      setActiveModal(null);
    } catch (err: any) {
      setError(err.message || 'Invalid sequence format');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[500px] max-h-[90vh] flex flex-col text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {editingCommandId ? 'Edit Command' : 'Add New Command'}
          </h2>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <Input
            label="Command Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error && error.includes('name')) setError(null);
            }}
            placeholder="Enter command name..."
            error={error && error.includes('name') ? error : undefined}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Command Sequence
            </label>
            
            <div className="flex gap-2 mb-2 items-center">
              <div className="w-1/3">
                <select
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value as InputFormat);
                    if (error && !error.includes('name')) setError(null);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ASCII">ASCII</option>
                  <option value="HEX">HEX</option>
                  <option value="DEC">DEC</option>
                  <option value="BIN">BIN</option>
                </select>
              </div>
              
              {format === 'ASCII' && (
                 <select
                  value={lineEnding}
                  onChange={(e) => {
                    setLineEnding(e.target.value as LineEnding);
                    if (error && !error.includes('name')) setError(null);
                  }}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="None">No Line Ending</option>
                  <option value="NL">New Line (NL)</option>
                  <option value="CR">Carriage Return (CR)</option>
                  <option value="Both">Both (NL & CR)</option>
                </select>
              )}
            </div>

            <textarea
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error && !error.includes('name')) setError(null);
              }}
              className={`w-full h-32 px-3 py-2 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                error && error.includes('sequence') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder={
                format === 'ASCII' 
                  ? "Enter text..." 
                  : `Enter ${format} values...`
              }
            />
            
            {error && !error.includes('name') && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Add CRC Checksum
              </label>
              <select
                value={crcType}
                onChange={(e) => setCrcType(e.target.value as CrcType)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="None">None</option>
                <option value="CRC-8">CRC-8/MAXIM-DOW</option>
                <option value="CRC-16">CRC-16/IBM-3740</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Calculated checksum will be appended to the command sequence.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setActiveModal(null)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
          >
            {editingCommandId ? 'Save Changes' : 'Add Command'}
          </Button>
        </div>
      </div>
    </div>
  );
}
