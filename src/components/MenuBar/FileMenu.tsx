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
import { projectService } from '../../services/projectService';
import { getCurrentWindow } from '@tauri-apps/api/window';

export function FileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { recentProjects, newProject, loadProject, saveProject, isDirty, currentProject } = useStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSave();
        } else if (e.key === 'o') {
          e.preventDefault();
          handleOpen();
        } else if (e.key === 'n') {
          e.preventDefault();
          handleNew();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProject]);

  const handleNew = async () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to continue?');
      if (!confirmed) return;
    }
    newProject();
    setIsOpen(false);
  };

  const handleOpen = async () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to continue?');
      if (!confirmed) return;
    }
    
    try {
      await loadProject();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to open project:', error);
      alert('Failed to open project: ' + (error as Error).message);
    }
  };

  const handleSave = async () => {
    try {
      await saveProject();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project: ' + (error as Error).message);
    }
  };

  const handleLoadRecent = async (path: string) => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to continue?');
      if (!confirmed) return;
    }
    
    try {
      const project = await projectService.loadProjectFromPath(path);
      const { setCurrentProject, setCommands } = useStore.getState();
      setCurrentProject(project);
      setCommands(project.commands);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to load recent project:', error);
      alert('Failed to load project: ' + (error as Error).message);
    }
  };

  const handleExit = async () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to exit?');
      if (!confirmed) return;
    }
    const appWindow = getCurrentWindow();
    await appWindow.close();
  };

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
          <button 
            className="w-full px-4 py-2 text-left hover:bg-blue-100 flex justify-between items-center"
            onClick={handleNew}
          >
            <span>New Project</span>
            <span className="text-xs text-gray-500">Ctrl+N</span>
          </button>
          <button 
            className="w-full px-4 py-2 text-left hover:bg-blue-100 flex justify-between items-center"
            onClick={handleOpen}
          >
            <span>Open Project</span>
            <span className="text-xs text-gray-500">Ctrl+O</span>
          </button>
          <button 
            className="w-full px-4 py-2 text-left hover:bg-blue-100 flex justify-between items-center"
            onClick={handleSave}
          >
            <span>Save Project{isDirty ? ' *' : ''}</span>
            <span className="text-xs text-gray-500">Ctrl+S</span>
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          {recentProjects.length > 0 ? (
            <>
              <div className="px-4 py-1 text-xs text-gray-500">Recent Projects</div>
              {recentProjects.map((project, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-blue-100 truncate"
                  onClick={() => handleLoadRecent(project.path)}
                  title={project.path}
                >
                  {project.name}
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-2 text-gray-400 text-sm">No recent projects</div>
          )}
          <div className="border-t border-gray-200 my-1"></div>
          <button 
            className="w-full px-4 py-2 text-left hover:bg-blue-100"
            onClick={handleExit}
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
}



