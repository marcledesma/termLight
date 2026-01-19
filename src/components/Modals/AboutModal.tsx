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
 * @file AboutModal.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { X } from 'lucide-react';
import { Button } from '../Common/Button';
import { useStore } from '../../store';

export function AboutModal() {
  const { setActiveModal } = useStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">About termLight</h2>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">termLight</h3>
            <p className="text-gray-600 dark:text-gray-400">Version 0.1.2</p>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p>
              A serial communication tool for sending, receiving, and managing
              commands via COM ports.
            </p>
            <p className="font-semibold">Author: Marc Ledesma</p>
            <p>
              <span className="font-semibold">License:</span> GNU General Public
              License v3.0
            </p>
            <p>
              <a
                href="https://github.com/marcledesma/termLight"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                GitHub Repository
              </a>
            </p>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Approximately 80% of this codebase was
                generated using AI assistance. Please review and test thoroughly.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={() => setActiveModal(null)}>Close</Button>
        </div>
      </div>
    </div>
  );
}



