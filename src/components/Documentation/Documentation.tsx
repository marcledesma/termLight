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
 * @file Documentation.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../../store';

export function Documentation() {
  const { showDocumentation, setShowDocumentation, selectedCommand } =
    useStore();

  if (!showDocumentation) {
    return (
      <div className="h-8 bg-gray-100 border-t border-gray-300 flex items-center px-2">
        <button
          onClick={() => setShowDocumentation(true)}
          className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
        >
          <ChevronUp size={16} />
          Documentation
        </button>
      </div>
    );
  }

  return (
    <div className="h-48 bg-gray-50 border-t border-gray-300 flex flex-col">
      <div className="h-8 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-2">
        <span className="text-sm font-semibold text-gray-700">Documentation</span>
        <button
          onClick={() => setShowDocumentation(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronDown size={16} />
        </button>
      </div>
      <div className="flex-1 p-2">
        <textarea
          className="w-full h-full px-3 py-2 border border-gray-300 rounded resize-none
                   focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder={
            selectedCommand
              ? `Add documentation for "${selectedCommand.name}"...`
              : 'Select a command to add documentation...'
          }
          value={selectedCommand?.documentation || ''}
          readOnly
        />
      </div>
    </div>
  );
}



