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

