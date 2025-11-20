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

import { Plus } from 'lucide-react';
import { CommandHeader } from './CommandHeader';
import { CommandItem } from './CommandItem';
import { Button } from '../Common/Button';
import { useCommands } from '../../hooks/useCommands';
import { useStore } from '../../store';

export function CommandPanel() {
  const { commands, searchQuery } = useCommands();
  const { setActiveModal } = useStore();

  return (
    <div className="flex flex-col h-full bg-gray-50 border-l border-gray-300">
      <CommandHeader />
      <div className="flex-1 overflow-y-auto">
        {commands.length > 0 ? (
          commands.map((command) => (
            <CommandItem key={command.id} command={command} />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchQuery ? 'No commands found' : 'No commands yet'}
          </div>
        )}
      </div>
      <div className="p-2 border-t border-gray-300">
        <Button 
          variant="primary" 
          size="sm" 
          className="w-full"
          onClick={() => {
            useStore.getState().setEditingCommandId(null);
            setActiveModal('command');
          }}
        >
          <Plus size={16} className="mr-1" />
          Add New Command
        </Button>
      </div>
    </div>
  );
}
