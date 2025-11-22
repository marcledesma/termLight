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
 * @file projectSlice.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { StateCreator } from 'zustand';
import { Project, ProjectMetadata } from '../../types';
import { projectService } from '../../services/projectService';

export interface ProjectSlice {
  currentProject: Project | null;
  recentProjects: ProjectMetadata[];
  isDirty: boolean;
  setCurrentProject: (project: Project | null) => void;
  setRecentProjects: (projects: ProjectMetadata[]) => void;
  setIsDirty: (isDirty: boolean) => void;
  loadProject: () => Promise<void>;
  saveProject: () => Promise<void>;
  newProject: () => void;
  initRecentProjects: () => Promise<void>;
}

export const createProjectSlice: StateCreator<
  ProjectSlice & { setCommands?: (commands: any[]) => void }
> = (set, get) => ({
  currentProject: null,
  recentProjects: [],
  isDirty: false,
  setCurrentProject: (currentProject) => set({ currentProject, isDirty: false }),
  setRecentProjects: (recentProjects) => set({ recentProjects }),
  setIsDirty: (isDirty) => set({ isDirty }),

  initRecentProjects: async () => {
    try {
      const recentProjects = await projectService.getRecentProjects();
      set({ recentProjects });
    } catch (error) {
      console.error('Failed to load recent projects:', error);
    }
  },
  
  loadProject: async () => {
    try {
      const result = await projectService.loadProject();
      if (result) {
        const { project } = result;
        set({ currentProject: project, isDirty: false });
        
        // Update commands in the command slice
        const state = get();
        if (state.setCommands) {
          state.setCommands(project.commands);
        }
        
        // Refresh recent projects from backend
        await state.initRecentProjects();
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      throw error;
    }
  },
  
  saveProject: async () => {
    try {
      const state = get();
      const currentProject = state.currentProject;
      
      if (!currentProject) {
        // Create new project from current state
        const newProject = projectService.createNewProject();
        if (state.setCommands) {
          // Get commands from command slice if available
          newProject.commands = (state as any).commands || [];
        }
        
        const savedPath = await projectService.saveProject(newProject);
        if (savedPath) {
          newProject.metadata.path = savedPath;
          newProject.metadata.name = savedPath.split(/[/\\]/).pop()?.replace(/\.ptp$/, '') || 'Untitled';
          set({ currentProject: newProject, isDirty: false });
          // Refresh recent projects
          await state.initRecentProjects();
        }
      } else {
        // Update current project with latest commands
        const updatedProject = {
          ...currentProject,
          commands: (state as any).commands || currentProject.commands,
          metadata: {
            ...currentProject.metadata,
            lastModified: new Date(),
          },
        };
        
        if (currentProject.metadata.path) {
          await projectService.saveProjectToPath(updatedProject, currentProject.metadata.path);
          // Explicitly add to recent projects (or refresh if backend handles it on save)
          // Backend save_project handles it, so just refresh
          set({ currentProject: updatedProject, isDirty: false });
          await state.initRecentProjects();
        } else {
          const savedPath = await projectService.saveProject(updatedProject);
          if (savedPath) {
            updatedProject.metadata.path = savedPath;
            updatedProject.metadata.name = savedPath.split(/[/\\]/).pop()?.replace(/\.ptp$/, '') || 'Untitled';
            set({ currentProject: updatedProject, isDirty: false });
            await state.initRecentProjects();
          }
        }
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      throw error;
    }
  },
  
  newProject: () => {
    const newProject = projectService.createNewProject();
    set({ currentProject: newProject, isDirty: false });
    
    // Clear commands
    const state = get();
    if (state.setCommands) {
      state.setCommands([]);
    }
  },
});



