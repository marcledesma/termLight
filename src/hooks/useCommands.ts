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
 * @file useCommands.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useMemo } from 'react';
import { useStore } from '../store';
import { commandService } from '../services/commandService';
import { Command, InputFormat, LineEnding } from '../types';

/**
 * Hook for managing commands with filtering and sorting
 */
export function useCommands() {
  const {
    commands,
    selectedCommand,
    sortBy,
    searchQuery,
    addCommand,
    updateCommand,
    deleteCommand,
    setSelectedCommand,
    setSortBy,
    setSearchQuery,
    reorderCommands,
  } = useStore();

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!searchQuery) return commands;
    
    const query = searchQuery.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.sequence.toLowerCase().includes(query) ||
        cmd.documentation?.toLowerCase().includes(query)
    );
  }, [commands, searchQuery]);

  // Sort commands
  const sortedCommands = useMemo(() => {
    const sorted = [...filteredCommands];
    
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Sort by date: prioritize manual order field, then fall back to creation date
      sorted.sort((a, b) => {
        // If both have order values, use those
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        // If only one has an order value, it comes first
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        // Otherwise, sort by date (newest first)
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    }
    
    return sorted;
  }, [filteredCommands, sortBy]);

  // Create a new command
  const createCommand = (
    name: string,
    sequence: string,
    documentation?: string,
    repetitionMode?: number,
    colorIndex?: number,
    inputFormat?: InputFormat,
    lineEnding?: LineEnding
  ) => {
    const errors = commandService.validateCommand({ name, sequence });
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const formattedSequence = commandService.formatHexSequence(sequence);
    
    // Calculate the next order value (highest order + 1)
    const maxOrder = commands.reduce((max, cmd) => {
      return cmd.order !== undefined && cmd.order > max ? cmd.order : max;
    }, -1);
    
    const command = commandService.createCommand(
      name,
      formattedSequence,
      documentation,
      repetitionMode,
      colorIndex,
      inputFormat,
      lineEnding
    );
    
    // Add order field to the new command
    const commandWithOrder = {
      ...command,
      order: maxOrder + 1,
    };
    
    addCommand(commandWithOrder);
    return commandWithOrder;
  };

  // Update an existing command
  const updateExistingCommand = (id: string, updates: Partial<Command>) => {
    if (updates.sequence) {
      // We need to include the name in validation because validateCommand requires it
      // If name is not being updated, use a placeholder to bypass the name check
      const nameToCheck = updates.name !== undefined ? updates.name : 'placeholder';
      const errors = commandService.validateCommand({ 
        name: nameToCheck, 
        sequence: updates.sequence 
      });

      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }
      updates.sequence = commandService.formatHexSequence(updates.sequence);
    }
    
    updateCommand(id, updates);
  };

  // Delete a command
  const removeCommand = (id: string) => {
    if (selectedCommand?.id === id) {
      setSelectedCommand(null);
    }
    deleteCommand(id);
  };

  return {
    commands: sortedCommands,
    selectedCommand,
    sortBy,
    searchQuery,
    createCommand,
    updateCommand: updateExistingCommand,
    deleteCommand: removeCommand,
    selectCommand: setSelectedCommand,
    setSortBy,
    setSearchQuery,
    reorderCommands,
    parseHexSequence: commandService.parseHexSequence,
    bytesToHexSequence: commandService.bytesToHexSequence,
  };
}
