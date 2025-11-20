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
 * @file serialService.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { SerialConfig, PortInfo } from '../types';

export interface SerialPayload {
  data: number[];
}

export const serialService = {
  listPorts: async (): Promise<PortInfo[]> => {
    return await invoke('list_ports');
  },

  connect: async (config: SerialConfig): Promise<void> => {
    console.log('Connecting to port:', config);
    await invoke('open_port', {
      portName: config.portName,
      baudRate: Number(config.baudRate),
      dataBits: Number(config.dataBits),
      stopBits: Number(config.stopBits),
      parity: config.parity,
    });
  },

  disconnect: async (): Promise<void> => {
    await invoke('close_port');
  },

  send: async (data: Uint8Array | number[]): Promise<void> => {
    // Tauri expects Vec<u8> as number[] or similar
    await invoke('send_data', { data: Array.from(data) });
  },

  listenToData: async (callback: (data: Uint8Array) => void) => {
    console.log('Setting up serial data listener');
    return await listen<SerialPayload>('serial-payload', (event) => {
      console.log('Serial data received:', event.payload);
      callback(new Uint8Array(event.payload.data));
    });
  },
};
