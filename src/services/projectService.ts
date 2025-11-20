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
import { Project, Command, ReceiveCommand } from '../types';
import { SerialConfig } from '../types/serial';

// DochLight backend types (matching Rust structures)
interface DochlightProject {
  version: number;
  comm_settings: {
    params: number[];
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
      const dochlightProject = projectService.toDochlightFormat(project);
      const result = await invoke<string | null>('save_project_dialog', {
        project: dochlightProject,
      });
      return result;
    } catch (error) {
      console.error('Failed to save project:', error);
      throw error;
    }
  },

  /**
   * Save project to specific path
   */
  saveProjectToPath: async (project: Project, filePath: string): Promise<void> => {
    try {
      const dochlightProject = projectService.toDochlightFormat(project);
      await invoke('save_project', {
        project: dochlightProject,
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
      const result = await invoke<[string, DochlightProject] | null>('load_project_dialog');
      
      if (!result) {
        return null;
      }

      const [path, dochlightProject] = result;
      const project = projectService.fromDochlightFormat(dochlightProject, path);
      
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
      const dochlightProject = await invoke<DochlightProject>('load_project', {
        filePath,
      });
      
      return projectService.fromDochlightFormat(dochlightProject, filePath);
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
   * Convert Project to DochLight format
   */
  toDochlightFormat: (project: Project): DochlightProject => {
    return {
      version: project.version,
      comm_settings: {
        params: project.commSettings,
      },
      comm_display: project.commDisplay,
      comm_channels: project.commChannels,
      send_commands: project.commands.map((cmd, index) => ({
        index,
        name: cmd.name,
        hex_data: cmd.sequence,
        repetition_mode: cmd.repetitionMode,
        color_index: cmd.colorIndex,
      })),
      receive_commands: project.receiveCommands.map((cmd) => ({
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
   * Convert DochLight format to Project
   */
  fromDochlightFormat: (dochlight: DochlightProject, path: string): Project => {
    const fileName = path.split(/[/\\]/).pop() || 'Untitled';
    const projectName = fileName.replace(/\.ptp$/, '');

    // Convert SEND commands to Command objects
    const commands: Command[] = dochlight.send_commands.map((cmd) => ({
      id: crypto.randomUUID(),
      name: cmd.name,
      sequence: cmd.hex_data,
      documentation: '',
      createdAt: new Date(),
      repetitionMode: cmd.repetition_mode,
      colorIndex: cmd.color_index,
    }));

    // Convert RECEIVE commands
    const receiveCommands: ReceiveCommand[] = dochlight.receive_commands.map((cmd) => ({
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
    }));

    // Parse serial config from comm_settings (if valid)
    const serialConfig: SerialConfig = projectService.parseSerialConfig(
      dochlight.comm_settings.params
    );

    return {
      metadata: {
        name: projectName,
        path,
        lastModified: new Date(),
      },
      serialConfig,
      commands,
      receiveCommands,
      version: dochlight.version,
      commSettings: dochlight.comm_settings.params,
      commDisplay: dochlight.comm_display,
      commChannels: dochlight.comm_channels,
    };
  },

  /**
   * Parse serial config from COMMSETTINGS parameters
   * Format: [?, ?, ?, baudRate, ?, ?, ?, ?, ?]
   */
  parseSerialConfig: (params: number[]): SerialConfig => {
    const baudRate = params.length > 3 ? params[3] : 9600;

    return {
      portName: '',
      baudRate,
      parity: 'None',
      dataBits: 8,
      stopBits: 1,
    };
  },
};
