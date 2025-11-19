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
 * @file ConfigModal.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { X } from 'lucide-react';
import { Button } from '../Common/Button';
import { Dropdown } from '../Common/Dropdown';
import { useStore } from '../../store';

export function ConfigModal() {
  const { setActiveModal } = useStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Display Configuration</h2>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <Dropdown label="Theme">
            <option>Light</option>
            <option>Dark</option>
          </Dropdown>
          <Dropdown label="Font Size">
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </Dropdown>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Display Colors
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="color"
                  className="w-10 h-10 border border-gray-300 rounded"
                  defaultValue="#000000"
                />
                <span className="ml-2 text-sm">Receive Data</span>
              </div>
              <div className="flex items-center">
                <input
                  type="color"
                  className="w-10 h-10 border border-gray-300 rounded"
                  defaultValue="#0000FF"
                />
                <span className="ml-2 text-sm">Send Data</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="secondary" onClick={() => setActiveModal(null)}>
            Cancel
          </Button>
          <Button onClick={() => setActiveModal(null)}>Apply</Button>
        </div>
      </div>
    </div>
  );
}



