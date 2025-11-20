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

import { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { useProjectOperations } from '../../hooks/useProjectOperations';

export function FileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { recentProjects, isDirty } = useStore();
  const { 
    handleNew, 
    handleOpen, 
    handleSave, 
    handleLoadRecent, 
    handleExit 
  } = useProjectOperations();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSave().then(() => setIsOpen(false));
        } else if (e.key === 'o') {
          e.preventDefault();
          handleOpen().then(() => setIsOpen(false));
        } else if (e.key === 'n') {
          e.preventDefault();
          handleNew().then(() => setIsOpen(false));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onNew = async () => {
    await handleNew();
    setIsOpen(false);
  };

  const onOpen = async () => {
    await handleOpen();
    setIsOpen(false);
  };

  const onSave = async () => {
    await handleSave();
    setIsOpen(false);
  };

  const onLoadRecent = async (path: string) => {
    await handleLoadRecent(path);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        File
      </button>
      {isOpen && (
        <div
          className="absolute left-0 top-full w-56 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button 
            className="w-full px-4 py-2 text-left hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 flex justify-between items-center"
            onClick={onNew}
          >
            <span>New Project</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Ctrl+N</span>
          </button>
          <button 
            className="w-full px-4 py-2 text-left hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 flex justify-between items-center"
            onClick={onOpen}
          >
            <span>Open Project</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Ctrl+O</span>
          </button>
          <button 
            className="w-full px-4 py-2 text-left hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 flex justify-between items-center"
            onClick={onSave}
          >
            <span>Save Project{isDirty ? ' *' : ''}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Ctrl+S</span>
          </button>
          <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
          {recentProjects.length > 0 ? (
            <>
              <div className="px-4 py-1 text-xs text-gray-500 dark:text-gray-400">Recent Projects</div>
              {recentProjects.map((project, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 truncate"
                  onClick={() => onLoadRecent(project.path)}
                  title={project.path}
                >
                  {project.name}
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-2 text-gray-400 dark:text-gray-500 text-sm">No recent projects</div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
          <button 
            className="w-full px-4 py-2 text-left hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
            onClick={handleExit}
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
}



