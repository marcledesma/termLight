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
 * @file useProjectOperations.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useStore } from '../store';
import { projectService } from '../services/projectService';
import { getCurrentWindow } from '@tauri-apps/api/window';

export function useProjectOperations() {
  const { 
    newProject, 
    loadProject, 
    saveProject, 
    isDirty, 
    setCurrentProject, 
    setCommands,
    initRecentProjects
  } = useStore();

  const handleNew = async () => {
    if (isDirty) {
      const confirmed = await window.confirm('You have unsaved changes. Do you want to continue?');
      if (!confirmed) return;
    }
    newProject();
  };

  const handleOpen = async () => {
    if (isDirty) {
      const confirmed = await window.confirm('You have unsaved changes. Do you want to continue?');
      if (!confirmed) return;
    }
    
    try {
      await loadProject();
    } catch (error) {
      console.error('Failed to open project:', error);
      alert('Failed to open project: ' + (error as Error).message);
    }
  };

  const handleSave = async () => {
    try {
      await saveProject();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project: ' + (error as Error).message);
    }
  };

  const handleLoadRecent = async (path: string) => {
    if (isDirty) {
      const confirmed = await window.confirm('You have unsaved changes. Do you want to continue?');
      if (!confirmed) return;
    }
    
    try {
      const project = await projectService.loadProjectFromPath(path);
      setCurrentProject(project);
      setCommands(project.commands);
      await initRecentProjects();
    } catch (error) {
      console.error('Failed to load recent project:', error);
      alert('Failed to load project: ' + (error as Error).message);
    }
  };

  const handleExit = async () => {
    if (isDirty) {
      const confirmed = await window.confirm('You have unsaved changes. Do you want to exit?');
      if (!confirmed) return;
    }
    const appWindow = getCurrentWindow();
    await appWindow.close();
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    handleNew,
    handleOpen,
    handleSave,
    handleLoadRecent,
    handleExit,
    handlePrint
  };
}
