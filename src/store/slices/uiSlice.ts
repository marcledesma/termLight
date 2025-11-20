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
 * @file uiSlice.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { StateCreator } from 'zustand';
import { DataFormat, InputFormat, LineEnding } from '../../types';

export type ModalType = 'commSettings' | 'config' | 'about' | 'tutorial' | 'command' | null;

export interface LogEntry {
  timestamp: number;
  direction: 'rx' | 'tx';
  data: number[]; // Store as number[] to avoid Uint8Array serialization issues
}

export interface UiSlice {
  activeModal: ModalType;
  editingCommandId: string | null; // Add this
  dataFormat: DataFormat;
  inputFormat: InputFormat;
  lineEnding: LineEnding;
  showDocumentation: boolean;
  dataLog: LogEntry[];
  
  setActiveModal: (modal: ModalType) => void;
  setEditingCommandId: (id: string | null) => void; // Add this
  setDataFormat: (format: DataFormat) => void;
  setInputFormat: (format: InputFormat) => void;
  setLineEnding: (ending: LineEnding) => void;
  setShowDocumentation: (show: boolean) => void;
  appendLog: (entry: LogEntry) => void;
  clearLog: () => void;
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  activeModal: null,
  editingCommandId: null, // Add this
  dataFormat: 'ASCII',
  inputFormat: 'ASCII',
  lineEnding: 'None',
  showDocumentation: true,
  dataLog: [],

  setActiveModal: (activeModal) => set({ activeModal }),
  setEditingCommandId: (editingCommandId) => set({ editingCommandId }), // Add this
  setDataFormat: (dataFormat) => set({ dataFormat }),
  setInputFormat: (inputFormat) => set({ inputFormat }),
  setLineEnding: (lineEnding) => set({ lineEnding }),
  setShowDocumentation: (showDocumentation) => set({ showDocumentation }),
  
  appendLog: (entry) => set((state) => {
    // Limit log size to prevent performance issues
    const newLog = [...state.dataLog, entry];
    if (newLog.length > 1000) {
      return { dataLog: newLog.slice(-1000) };
    }
    return { dataLog: newLog };
  }),
  
  clearLog: () => set({ dataLog: [] }),
});
