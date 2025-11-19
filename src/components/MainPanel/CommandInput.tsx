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
import { Send } from 'lucide-react';
import { Button } from '../Common/Button';
import { Dropdown } from '../Common/Dropdown';
import { useStore } from '../../store';

export function CommandInput() {
  const [inputValue, setInputValue] = useState('');
  const { lineEnding, setLineEnding, isConnected } = useStore();

  return (
    <div className="flex items-center gap-2 p-2 border-t border-gray-300 bg-gray-50">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter command..."
        disabled={!isConnected}
        className="flex-1 px-3 py-2 border border-gray-300 rounded font-mono text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <Dropdown
        value={lineEnding}
        onChange={(e) => setLineEnding(e.target.value as any)}
        className="w-32 text-xs"
        disabled={!isConnected}
      >
        <option value="None">No Line Ending</option>
        <option value="NL">New Line</option>
        <option value="CR">Carriage Return</option>
        <option value="Both">Both NL & CR</option>
      </Dropdown>
      <Button disabled={!isConnected || !inputValue}>
        <Send size={16} className="mr-1" />
        Send
      </Button>
    </div>
  );
}



