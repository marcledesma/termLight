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
 * @file serialSlice.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { StateCreator } from 'zustand';
import { SerialConfig, PortInfo } from '../../types';
import { serialService } from '../../services/serialService';

export interface SerialSlice {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  portName: string;
  baudRate: number;
  parity: 'None' | 'Even' | 'Odd';
  dataBits: 5 | 6 | 7 | 8;
  stopBits: 1 | 1.5 | 2;
  availablePorts: PortInfo[];
  
  // Actions
  setIsConnected: (isConnected: boolean) => void;
  setSerialConfig: (config: Partial<SerialConfig>) => void;
  refreshPorts: () => Promise<void>;
  connectPort: () => Promise<void>;
  disconnectPort: () => Promise<void>;
  sendSerialData: (data: Uint8Array) => Promise<void>;
  clearError: () => void;
}

export const createSerialSlice: StateCreator<SerialSlice> = (set, get) => ({
  isConnected: false,
  isConnecting: false,
  error: null,
  portName: '',
  baudRate: 9600,
  parity: 'None',
  dataBits: 8,
  stopBits: 1,
  availablePorts: [],

  setIsConnected: (isConnected) => set({ isConnected }),
  
  setSerialConfig: (config) => set((state) => ({ ...state, ...config })),
  
  refreshPorts: async () => {
    try {
      const ports = await serialService.listPorts();
      set({ availablePorts: ports });
      
      // Auto-select first port if none selected
      if (!get().portName && ports.length > 0) {
        set({ portName: ports[0].name });
      }
    } catch (err) {
      console.error('Failed to list ports:', err);
      set({ error: 'Failed to list ports' });
    }
  },

  connectPort: async () => {
    const state = get();
    if (!state.portName) {
      set({ error: 'No port selected' });
      return;
    }

    set({ isConnecting: true, error: null });

    try {
      await serialService.connect({
        portName: state.portName,
        baudRate: state.baudRate,
        parity: state.parity,
        dataBits: state.dataBits,
        stopBits: state.stopBits,
      });
      set({ isConnected: true, isConnecting: false });
    } catch (err) {
      console.error('Failed to connect:', err);
      set({ 
        isConnected: false, 
        isConnecting: false, 
        error: typeof err === 'string' ? err : 'Failed to connect to port' 
      });
    }
  },

  disconnectPort: async () => {
    try {
      await serialService.disconnect();
      set({ isConnected: false });
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  },

  sendSerialData: async (data: Uint8Array) => {
    if (!get().isConnected) return;
    try {
      await serialService.send(data);
    } catch (err) {
      console.error('Failed to send data:', err);
      set({ error: 'Failed to send data' });
    }
  },

  clearError: () => set({ error: null }),
});
