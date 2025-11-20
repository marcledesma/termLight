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
 * @file serial.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

export type Parity = 'None' | 'Even' | 'Odd';
export type DataBits = 5 | 6 | 7 | 8;
export type StopBits = 1 | 1.5 | 2;
export type DataFormat = 'ASCII' | 'HEX' | 'DEC' | 'BIN' | 'Serial Monitor';
export type InputFormat = 'ASCII' | 'HEX' | 'DEC' | 'BIN';
export type LineEnding = 'None' | 'NL' | 'CR' | 'Both';

export interface SerialConfig {
  portName: string;
  baudRate: number;
  parity: Parity;
  dataBits: DataBits;
  stopBits: StopBits;
}

export interface PortInfo {
  name: string;
  description?: string;
}
