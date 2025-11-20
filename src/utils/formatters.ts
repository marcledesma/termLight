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
 * @file formatters.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

export function formatDataAsAscii(data: Uint8Array): string {
  return new TextDecoder().decode(data);
}

export function formatDataAsHex(data: Uint8Array): string {
  return Array.from(data)
    .map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

export function formatDataAsDec(data: Uint8Array): string {
  return Array.from(data)
    .map((byte) => byte.toString(10))
    .join(' ');
}

export function formatDataAsBin(data: Uint8Array): string {
  return Array.from(data)
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join(' ');
}

// Input Parsers

export function parseAsciiInput(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

export function parseHexInput(input: string): Uint8Array {
  // Remove non-hex characters (except spaces to keep separation if needed, but standard hex parsers usually ignore all non-hex)
  // However, to be safe, let's just strip everything that isn't 0-9, a-f, A-F
  const cleanInput = input.replace(/[^0-9a-fA-F]/g, '');
  if (cleanInput.length % 2 !== 0) {
    // If odd length, pad with leading zero? Or throw error?
    // Docklight usually ignores invalid input or treats nibbles. 
    // Let's pad with leading zero if odd length to be safe, or just warn.
    // We'll return empty if invalid or just try to parse what we have.
  }
  
  const bytes: number[] = [];
  for (let i = 0; i < cleanInput.length; i += 2) {
    // If we have an odd number of chars at the end, take the last one as a lower nibble or full byte? 
    // Usually parsers treat "F" as "0F".
    const chunk = cleanInput.substring(i, i + 2);
    bytes.push(parseInt(chunk, 16));
  }
  return new Uint8Array(bytes);
}

export function parseDecInput(input: string): Uint8Array {
  // Expect space or comma separated decimal numbers
  const parts = input.split(/[\s,]+/);
  const bytes: number[] = [];
  
  for (const part of parts) {
    if (!part) continue;
    const val = parseInt(part, 10);
    if (!isNaN(val) && val >= 0 && val <= 255) {
      bytes.push(val);
    }
  }
  return new Uint8Array(bytes);
}

export function parseBinInput(input: string): Uint8Array {
  // Expect space or comma separated binary strings (8 bits usually, but can be varying)
  // Or just a stream of 0s and 1s.
  // Let's assume space separated for clarity, or stream.
  // If stream, we take 8 bits at a time.
  
  const cleanInput = input.replace(/[^01]/g, '');
  const bytes: number[] = [];
  
  for (let i = 0; i < cleanInput.length; i += 8) {
    const chunk = cleanInput.substring(i, Math.min(i + 8, cleanInput.length));
    // If chunk is < 8 bits, it's the MSB part? Or just parse it.
    // Usually "1" -> 1, "10" -> 2.
    bytes.push(parseInt(chunk, 2));
  }
  return new Uint8Array(bytes);
}
