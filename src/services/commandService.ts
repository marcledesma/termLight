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
 * @file commandService.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { Command, InputFormat, LineEnding } from '../types';

/**
 * Command service for CRUD operations on commands
 */
export const commandService = {
  /**
   * Create a new command
   */
  createCommand: (
    name: string,
    sequence: string,
    documentation?: string,
    repetitionMode: number = 0,
    colorIndex: number = 5,
    inputFormat?: InputFormat,
    lineEnding?: LineEnding
  ): Command => {
    return {
      id: crypto.randomUUID(),
      name,
      sequence,
      documentation,
      createdAt: new Date(),
      repetitionMode,
      colorIndex,
      inputFormat,
      lineEnding,
    };
  },

  /**
   * Validate command data
   */
  validateCommand: (command: Partial<Command>): string[] => {
    const errors: string[] = [];

    if (!command.name || command.name.trim() === '') {
      errors.push('Command name is required');
    }

    if (!command.sequence || command.sequence.trim() === '') {
      errors.push('Command sequence is required');
    }

    // Validate hex sequence format (space-separated hex bytes)
    if (command.sequence) {
      const hexPattern = /^[0-9A-Fa-f]{2}(\s+[0-9A-Fa-f]{2})*$/;
      if (!hexPattern.test(command.sequence.trim())) {
        errors.push('Command sequence must be space-separated hex bytes (e.g., "2D 2D 6F")');
      }
    }

    return errors;
  },

  /**
   * Format hex sequence to DochLight format (uppercase, space-separated)
   */
  formatHexSequence: (sequence: string): string => {
    return sequence
      .trim()
      .toUpperCase()
      .replace(/\s+/g, ' '); // Normalize spaces
  },

  /**
   * Parse hex sequence from DochLight format to bytes
   */
  parseHexSequence: (hexString: string): Uint8Array => {
    const hexBytes = hexString.trim().split(/\s+/);
    const bytes = new Uint8Array(hexBytes.length);
    
    for (let i = 0; i < hexBytes.length; i++) {
      bytes[i] = parseInt(hexBytes[i], 16);
    }
    
    return bytes;
  },

  /**
   * Convert bytes to hex sequence string
   */
  bytesToHexSequence: (bytes: Uint8Array): string => {
    return Array.from(bytes)
      .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
  },
};
