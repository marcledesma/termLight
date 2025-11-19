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
 * @file FileMenu.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useState } from 'react';
import { useStore } from '../../store';

export function FileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { recentProjects } = useStore();

  return (
    <div className="relative">
      <button
        className="px-3 py-1 hover:bg-gray-200"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        File
      </button>
      {isOpen && (
        <div
          className="absolute left-0 top-full w-56 bg-white border border-gray-300 shadow-lg z-10"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button className="w-full px-4 py-2 text-left hover:bg-blue-100">
            New Project
          </button>
          <button className="w-full px-4 py-2 text-left hover:bg-blue-100">
            Open Project
          </button>
          <button className="w-full px-4 py-2 text-left hover:bg-blue-100">
            Save Project As
          </button>
          <button className="w-full px-4 py-2 text-left hover:bg-blue-100">
            Save Configuration As
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          {recentProjects.length > 0 ? (
            <>
              <div className="px-4 py-1 text-xs text-gray-500">Recent Projects</div>
              {recentProjects.map((project, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-blue-100 truncate"
                >
                  {project.name}
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-2 text-gray-400 text-sm">No recent projects</div>
          )}
          <div className="border-t border-gray-200 my-1"></div>
          <button className="w-full px-4 py-2 text-left hover:bg-blue-100">
            Exit
          </button>
        </div>
      )}
    </div>
  );
}



