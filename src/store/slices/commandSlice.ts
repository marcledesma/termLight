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
 * @file commandSlice.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { StateCreator } from 'zustand';
import { Command, CommandSort } from '../../types';

export interface CommandSlice {
  commands: Command[];
  selectedCommand: Command | null;
  sortBy: CommandSort;
  searchQuery: string;
  setCommands: (commands: Command[]) => void;
  setSelectedCommand: (command: Command | null) => void;
  setSortBy: (sortBy: CommandSort) => void;
  setSearchQuery: (query: string) => void;
  addCommand: (command: Command) => void;
  updateCommand: (id: string, updates: Partial<Command>) => void;
  deleteCommand: (id: string) => void;
}

export const createCommandSlice: StateCreator<
  CommandSlice & { setIsDirty?: (isDirty: boolean) => void }
> = (set, get) => ({
  commands: [],
  selectedCommand: null,
  sortBy: 'date',
  searchQuery: '',
  setCommands: (commands) => set({ commands }),
  setSelectedCommand: (selectedCommand) => set({ selectedCommand }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addCommand: (command) => {
    set((state) => ({ commands: [...state.commands, command] }));
    const state = get();
    if (state.setIsDirty) {
      state.setIsDirty(true);
    }
  },
  updateCommand: (id, updates) => {
    set((state) => ({
      commands: state.commands.map((cmd) =>
        cmd.id === id ? { ...cmd, ...updates } : cmd
      ),
    }));
    const state = get();
    if (state.setIsDirty) {
      state.setIsDirty(true);
    }
  },
  deleteCommand: (id) => {
    set((state) => ({
      commands: state.commands.filter((cmd) => cmd.id !== id),
    }));
    const state = get();
    if (state.setIsDirty) {
      state.setIsDirty(true);
    }
  },
});



