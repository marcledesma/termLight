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

import { Send, X } from 'lucide-react';
import { Command } from '../../types';
import { Button } from '../Common/Button';
import { useStore } from '../../store';
import { commandService } from '../../services/commandService';

interface CommandItemProps {
  command: Command;
}

export function CommandItem({ command }: CommandItemProps) {
  const { setSelectedCommand, sendSerialData, appendLog, isConnected, setActiveModal, setEditingCommandId, setCommandToDeleteId, commandColumnWidths } = useStore();

  const handleSend = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the item when clicking send
    if (!isConnected) return;

    try {
      // Command sequence is stored as normalized Hex String
      // We need to parse it back to bytes to send
      const data = commandService.parseHexSequence(command.sequence);
      
      await sendSerialData(data);
      
      appendLog({
        timestamp: Date.now(),
        direction: 'tx',
        data: Array.from(data),
      });
    } catch (error) {
      console.error("Failed to send command:", error);
    }
  };

  const handleDoubleClick = () => {
    setEditingCommandId(command.id);
    setActiveModal('command');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCommandToDeleteId(command.id);
    setActiveModal('deleteCommand');
  };

  return (
    <div
      className="flex p-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-xs relative group text-gray-900 dark:text-gray-100"
      onClick={() => setSelectedCommand(command)}
      onDoubleClick={handleDoubleClick}
    >
      <div 
        className="flex items-center justify-center"
        style={{ width: `${commandColumnWidths.send}px` }}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <Button 
          variant="icon" 
          size="sm" 
          className="h-7 w-full text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          onClick={handleSend}
          disabled={!isConnected}
          title="Send Command"
        >
          <Send size={14} />
        </Button>
      </div>
      
      <div 
        className="px-2 py-1 bg-transparent truncate select-none overflow-hidden flex items-center"
        style={{ width: `${commandColumnWidths.name}px` }}
        title={command.name}
      >
        {command.name}
      </div>
      
      <div 
        className="px-2 py-1 bg-transparent font-mono truncate select-none text-gray-600 dark:text-gray-400 overflow-hidden flex items-center flex-1"
        title={command.sequence}
      >
        {command.sequence}
      </div>

      <div 
        className="flex items-center justify-center"
        style={{ width: `${commandColumnWidths.delete}px` }}
      >
        <Button
          variant="icon"
          size="sm"
          className="h-7 w-full text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-0"
          onClick={handleDelete}
          title="Delete Command"
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}
