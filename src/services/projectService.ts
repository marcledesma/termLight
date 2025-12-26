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
 * @file projectService.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { invoke } from '@tauri-apps/api/core';
import { Project, Command, ReceiveCommand, ProjectMetadata } from '../types';
import { SerialConfig } from '../types/serial';

// DochLight backend types (matching Rust structures)
interface ProjectData {
  version: number;
  comm_settings: {
    params: string[]; // Changed to string[] to handle mixed types (v7: numbers, v8: port names + numbers)
  };
  comm_display: number;
  comm_channels: string[];
  send_commands: {
    index: number;
    name: string;
    hex_data: string;
    repetition_mode: number;
    color_index: number;
  }[];
  receive_commands: {
    index: number;
    name: string;
    hex_data: string;
    param1: number;
    param2: number;
    comment: string;
    comment_text: string;
    param3: number;
    param4: number;
    param5: number;
    param6: number;
  }[];
  versatap?: number; // v8+ optional field
  channel_alias?: string[]; // v8+ optional field
}

/**
 * Project service for save/load operations
 */
export const projectService = {
  /**
   * Save current project with file dialog
   */
  saveProject: async (project: Project): Promise<string | null> => {
    try {
      const projectData = projectService.toProjectData(project);
      const savedPath = await invoke<string | null>('save_project_dialog', {
        project: projectData,
      });
      return savedPath;
    } catch (error) {
      console.error('Failed to save project:', error);
      return null;
    }
  },

  /**
   * Save project to specific path
   */
  saveProjectToPath: async (project: Project, filePath: string): Promise<void> => {
    try {
      const projectData = projectService.toProjectData(project);
      await invoke('save_project', {
        project: projectData,
        filePath,
      });
    } catch (error) {
      console.error('Failed to save project to path:', error);
      throw error;
    }
  },

  /**
   * Load project with file dialog
   */
  loadProject: async (): Promise<{ path: string; project: Project } | null> => {
    try {
      const result = await invoke<[string, ProjectData] | null>('load_project_dialog');
      
      if (!result) {
        return null;
      }

      const [path, projectData] = result;
      const project = projectService.fromProjectData(projectData, path);
      
      return { path, project };
    } catch (error) {
      console.error('Failed to load project:', error);
      throw error;
    }
  },

  /**
   * Load project from specific path
   */
  loadProjectFromPath: async (filePath: string): Promise<Project> => {
    try {
      const projectData = await invoke<ProjectData>('load_project', {
        filePath,
      });
      
      return projectService.fromProjectData(projectData, filePath);
    } catch (error) {
      console.error('Failed to load project from path:', error);
      throw error;
    }
  },

  /**
   * Create a new empty project
   */
  createNewProject: (): Project => {
    return {
      metadata: {
        name: 'Untitled',
        path: '',
        lastModified: new Date(),
      },
      serialConfig: {
        portName: '',
        baudRate: 9600,
        parity: 'None',
        dataBits: 8,
        stopBits: 1,
      },
      commands: [],
      receiveCommands: [],
      version: 7,
      commSettings: [0, 1, 2, 9600, 2, 63, 4, 0, 0],
      commDisplay: 0,
      commChannels: [],
    };
  },

  /**
   * Convert Project to backend format
   */
  toProjectData: (project: Project): ProjectData => {
    return {
      version: project.version || 0,
      comm_settings: {
        params: (project.commSettings || []).map(s => String(s)), // Ensure all params are strings
      },
      comm_display: project.commDisplay || 0,
      comm_channels: project.commChannels || [],
      send_commands: project.commands.map((cmd, idx) => ({
        index: idx,
        name: cmd.name,
        hex_data: cmd.sequence,
        repetition_mode: cmd.repetitionMode || 0,
        color_index: cmd.colorIndex || 0,
      })),
      receive_commands: (project.receiveCommands || []).map((cmd) => ({
        index: cmd.index,
        name: cmd.name,
        hex_data: cmd.hex_data,
        param1: cmd.param1,
        param2: cmd.param2,
        comment: cmd.comment,
        comment_text: cmd.comment_text,
        param3: cmd.param3,
        param4: cmd.param4,
        param5: cmd.param5,
        param6: cmd.param6,
      })),
    };
  },

  /**
   * Convert backend format to Project
   */
  fromProjectData: (data: ProjectData, path: string): Project => {
    const fileName = path.split(/[/\\]/).pop() || 'Untitled';
    const projectName = fileName.replace(/\.ptp$/, '');

    // Convert SEND commands to Command objects
    const commands: Command[] = data.send_commands.map((cmd) => ({
      id: crypto.randomUUID(),
      name: cmd.name,
      sequence: cmd.hex_data,
      documentation: '',
      createdAt: new Date(),
      repetitionMode: cmd.repetition_mode,
      colorIndex: cmd.color_index,
    }));

    // Convert RECEIVE commands
    const receiveCommands: ReceiveCommand[] = data.receive_commands.map((cmd) => ({
      index: cmd.index,
      name: cmd.name,
      hex_data: cmd.hex_data,
      param1: cmd.param1,
      param2: cmd.param2,
      comment: cmd.comment,
      comment_text: cmd.comment_text,
      param3: cmd.param3,
      param4: cmd.param4,
      param5: cmd.param5,
      param6: cmd.param6,
      // ... other parameters as needed
    }));

    // Parse serial config from comm_settings (if valid)
    const serialConfig: SerialConfig = projectService.parseSerialConfig(
      data.comm_settings.params
    );

    // Convert params: try to parse as numbers where possible (for backward compatibility with v7)
    const commSettings: (number | string)[] = data.comm_settings.params.map(param => {
      const numValue = parseInt(param, 10);
      // Keep as string if it's not a pure number or if it looks like a port name
      if (isNaN(numValue) || param.toUpperCase().startsWith('COM') || param.includes(':')) {
        return param;
      }
      return numValue;
    });

    return {
      metadata: {
        name: projectName,
        path,
        lastModified: new Date(),
      },
      serialConfig,
      commands,
      receiveCommands,
      version: data.version,
      commSettings,
      commDisplay: data.comm_display,
      commChannels: data.comm_channels,
    };
  },

  /**
   * Parse serial config from COMMSETTINGS parameters
   * Handles both v7 (all numeric) and v8 (mixed string/numeric) formats
   * Common baud rates: 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600
   */
  parseSerialConfig: (params: string[]): SerialConfig => {
    let baudRate = 9600; // Default
    
    // Search for a valid baud rate in the params array
    const commonBaudRates = [
      300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 
      28800, 31250, 38400, 56000, 57600, 115200, 
      128000, 230400, 256000, 460800, 921600
    ];
    
    for (const param of params) {
      const numValue = parseInt(param, 10);
      if (!isNaN(numValue) && commonBaudRates.includes(numValue)) {
        baudRate = numValue;
        break;
      }
    }
    
    return {
      portName: '',
      baudRate,
      parity: 'None',
      dataBits: 8,
      stopBits: 1,
    };
  },

  /**
   * Get recent projects from persistent storage
   */
  getRecentProjects: async (): Promise<ProjectMetadata[]> => {
    try {
      const projects = await invoke<any[]>('get_recent_projects');
      return projects.map(p => ({
        name: p.name,
        path: p.path,
        lastModified: new Date(p.last_modified)
      }));
    } catch (error) {
      console.error('Failed to get recent projects:', error);
      return [];
    }
  },

  /**
   * Clear recent projects from persistent storage
   */
  clearRecentProjects: async (): Promise<void> => {
    try {
      await invoke('clear_recent_projects');
    } catch (error) {
      console.error('Failed to clear recent projects:', error);
      throw error;
    }
  }
};
