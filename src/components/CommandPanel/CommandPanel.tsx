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
 * @file CommandPanel.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { GripVertical } from 'lucide-react';
import { useRef } from 'react';
import { CommandHeader } from './CommandHeader';
import { CommandItem } from './CommandItem';
import { useCommands } from '../../hooks/useCommands';
import { useStore } from '../../store';

export function CommandPanel() {
  const { commands, searchQuery } = useCommands();
  const { commandPanelWidth, setCommandPanelWidth } = useStore();
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    startWidthRef.current = commandPanelWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startXRef.current - moveEvent.clientX; // Inverted because we're resizing from left
      const newWidth = Math.max(285, Math.min(570, startWidthRef.current + deltaX));
      setCommandPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-l border-gray-300 dark:border-gray-700 relative">
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 flex items-center justify-center group z-20"
        onMouseDown={handleResizeMouseDown}
      >
        <GripVertical size={12} className="text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100" />
      </div>
      <CommandHeader />
      <div className="flex-1 overflow-y-auto">
        {commands.length > 0 ? (
          commands.map((command) => (
            <CommandItem key={command.id} command={command} />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            {searchQuery ? 'No commands found' : 'No commands yet'}
          </div>
        )}
      </div>
    </div>
  );
}
