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
 * @file cobs.ts
 * @author Marc Ledesma
 * @date 2025-11-19
 */

/**
 * COBS (Consistent Overhead Byte Stuffing) Encoding Utility
 * 
 * COBS removes all zero bytes (0x00) from a packet, making it suitable for 
 * framing where 0x00 is used as a delimiter.
 */

/**
 * Encodes a byte array using COBS (Consistent Overhead Byte Stuffing)
 * Appends a 0x00 delimiter at the end.
 * 
 * @param data - The data to encode
 * @returns COBS encoded data with 0x00 delimiter
 */
export function encodeCobs(data: Uint8Array): Uint8Array {
  let readIndex = 0;
  let writeIndex = 1; // Reserve first byte for code
  let codeIndex = 0;
  let code = 1;
  
  // Max overhead is roughly 1 byte per 254 bytes + 1 byte + 1 delimiter
  // Safe upper bound: length + length/254 + 2
  const encoded = new Uint8Array(data.length + Math.ceil(data.length / 254) + 2);
  
  while (readIndex < data.length) {
    if (data[readIndex] === 0) {
      encoded[codeIndex] = code;
      code = 1;
      codeIndex = writeIndex++;
      readIndex++;
    } else {
      encoded[writeIndex++] = data[readIndex++];
      code++;
      
      if (code === 0xFF) {
        encoded[codeIndex] = code;
        code = 1;
        codeIndex = writeIndex++;
      }
    }
  }
  
  encoded[codeIndex] = code;
  
  // Final zero delimiter
  encoded[writeIndex++] = 0x00;
  
  return encoded.slice(0, writeIndex);
}

/**
 * Decodes a COBS-encoded byte array
 * Expects data to end with 0x00 delimiter (will be stripped)
 * 
 * @param data - The COBS encoded data (with or without 0x00 delimiter)
 * @returns Decoded data
 * @throws Error if COBS decoding fails
 */
export function decodeCobs(data: Uint8Array): Uint8Array {
  // Remove trailing 0x00 delimiter if present
  let length = data.length;
  if (length > 0 && data[length - 1] === 0x00) {
    length--;
  }
  
  if (length === 0) {
    return new Uint8Array(0);
  }
  
  const decoded = new Uint8Array(length); // Max size (will trim later)
  let readIndex = 0;
  let writeIndex = 0;
  
  while (readIndex < length) {
    const code = data[readIndex++];
    
    if (code === 0) {
      throw new Error('Invalid COBS encoding: unexpected zero byte');
    }
    
    // Copy (code - 1) bytes
    for (let i = 1; i < code && readIndex < length; i++) {
      decoded[writeIndex++] = data[readIndex++];
    }
    
    // Add zero byte if not at end and code < 0xFF
    if (code < 0xFF && readIndex < length) {
      decoded[writeIndex++] = 0x00;
    }
  }
  
  return decoded.slice(0, writeIndex);
}