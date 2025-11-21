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
import { DataFormat, InputFormat, LineEnding, Theme, FontSize, DisplayColors, CrcType } from '../../types';

export type ModalType = 'commSettings' | 'config' | 'about' | 'tutorial' | 'command' | 'deleteCommand' | null;

export interface LogEntry {
  timestamp: number;
  direction: 'rx' | 'tx';
  data: number[]; // Store as number[] to avoid Uint8Array serialization issues
}

export interface UiSlice {
  activeModal: ModalType;
  editingCommandId: string | null;
  commandToDeleteId: string | null;
  dataFormat: DataFormat;
  inputFormat: InputFormat;
  lineEnding: LineEnding;
  showDocumentation: boolean;
  autoScroll: boolean;
  dataLog: LogEntry[];
  
  // Display Config
  theme: Theme;
  fontSize: FontSize;
  displayColors: DisplayColors;
  cobsEnabled: boolean;
  crcType: CrcType;
  commandColumnWidths: {
    send: number;
    name: number;
    sequence: number;
    delete: number;
  };
  commandPanelWidth: number;

  setActiveModal: (modal: ModalType) => void;
  setEditingCommandId: (id: string | null) => void;
  setCommandToDeleteId: (id: string | null) => void;
  setDataFormat: (format: DataFormat) => void;
  setInputFormat: (format: InputFormat) => void;
  setLineEnding: (ending: LineEnding) => void;
  setShowDocumentation: (show: boolean) => void;
  setAutoScroll: (autoScroll: boolean) => void;
  appendLog: (entry: LogEntry) => void;
  clearLog: () => void;
  
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setDisplayColors: (colors: DisplayColors) => void;
  setCobsEnabled: (enabled: boolean) => void;
  setCrcType: (type: CrcType) => void;
  setCommandColumnWidths: (widths: { send: number; name: number; sequence: number; delete: number }) => void;
  setCommandPanelWidth: (width: number) => void;
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  activeModal: null,
  editingCommandId: null,
  commandToDeleteId: null,
  dataFormat: 'Serial Monitor(ASCII)',
  inputFormat: 'ASCII',
  lineEnding: 'None',
  showDocumentation: false,
  autoScroll: true,
  dataLog: [],
  
  theme: 'Light',
  fontSize: 'Small',
  displayColors: {
    receive: '#000000',
    send: '#0000FF',
  },
  cobsEnabled: false,
  crcType: 'None',
  commandColumnWidths: {
    send: 46,
    name: 164,
    sequence: 113,
    delete: 38,
  },
  commandPanelWidth: 361,

  setActiveModal: (activeModal) => set({ activeModal }),
  setEditingCommandId: (editingCommandId) => set({ editingCommandId }),
  setCommandToDeleteId: (commandToDeleteId) => set({ commandToDeleteId }),
  setDataFormat: (dataFormat) => set({ dataFormat }),
  setInputFormat: (inputFormat) => set({ inputFormat }),
  setLineEnding: (lineEnding) => set({ lineEnding }),
  setShowDocumentation: (showDocumentation) => set({ showDocumentation }),
  setAutoScroll: (autoScroll) => set({ autoScroll }),
  
  appendLog: (entry) => set((state) => {
    // Limit log size to prevent performance issues
    const newLog = [...state.dataLog, entry];
    if (newLog.length > 1000) {
      return { dataLog: newLog.slice(-1000) };
    }
    return { dataLog: newLog };
  }),
  
  clearLog: () => set({ dataLog: [] }),

  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  setDisplayColors: (displayColors) => set({ displayColors }),
  setCobsEnabled: (cobsEnabled) => set({ cobsEnabled }),
  setCrcType: (crcType) => set({ crcType }),
  setCommandColumnWidths: (commandColumnWidths) => set({ commandColumnWidths }),
  setCommandPanelWidth: (commandPanelWidth) => set({ commandPanelWidth }),
});
