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
 * @file DeleteCommandModal.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../Common/Button';
import { useStore } from '../../store';
import { useCommands } from '../../hooks/useCommands';

export function DeleteCommandModal() {
  const { setActiveModal, commandToDeleteId, setCommandToDeleteId } = useStore();
  const { deleteCommand, commands } = useCommands();
  
  const command = commands.find(c => c.id === commandToDeleteId);

  const handleClose = () => {
    setCommandToDeleteId(null);
    setActiveModal(null);
  };

  const handleDelete = () => {
    if (commandToDeleteId) {
      deleteCommand(commandToDeleteId);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} />
            Delete Command
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete this command?
          </p>
          {command && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
              <div className="font-semibold">{command.name}</div>
              <div className="text-gray-500 font-mono truncate">{command.sequence}</div>
            </div>
          )}
          <p className="mt-4 text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

