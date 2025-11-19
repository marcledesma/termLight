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
 * @file CommandItem.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { Send } from 'lucide-react';
import { Command } from '../../types';
import { Button } from '../Common/Button';
import { useStore } from '../../store';

interface CommandItemProps {
  command: Command;
}

export function CommandItem({ command }: CommandItemProps) {
  const { setSelectedCommand } = useStore();

  return (
    <div
      className="grid grid-cols-[60px_1fr_2fr] gap-1 p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer text-xs"
      onClick={() => setSelectedCommand(command)}
    >
      <Button variant="icon" size="sm" className="h-7 w-full">
        <Send size={14} />
      </Button>
      <input
        type="text"
        value={command.name}
        readOnly
        className="px-2 py-1 bg-white border border-gray-300 rounded text-xs"
      />
      <input
        type="text"
        value={command.sequence}
        readOnly
        className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono"
      />
    </div>
  );
}



