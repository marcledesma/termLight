<!-- 35251fa9-8e05-4bc9-91b9-d607768c60a9 bb50b719-5bfd-4ab3-8078-5befa9d201ce -->
# Phase 2.1: Enhanced Input & Binary Support

## Overview

The user requested a larger SEND button with format selection (ASCII, HEX, DEC, BIN). To support sending non-ASCII data (like HEX `0xFF`), the entire data transmission pipeline must be refactored to handle raw bytes (`Vec<u8>`) instead of Strings.

## 1. Backend Refactor (Rust)

### `src-tauri/src/commands/serial.rs`

- Modify `send_data` command signature to accept `Vec<u8>` instead of `String`.
- This ensures that valid hex values (e.g. `0x80`-`0xFF`) can be sent without UTF-8 encoding errors.

## 2. Frontend Service Layer

### `src/services/serialService.ts`

- Update `send` method to accept `number[]` or `Uint8Array`.
- Ensure the Tauri `invoke` call passes the data correctly as an array of numbers (which Tauri maps to `Vec<u8>`).

### `src/utils/formatters.ts`

- Add **Input Parsers**:
- `parseHexInput(str) -> Uint8Array`: Parses "FF 0A" style input.
- `parseDecInput(str) -> Uint8Array`: Parses "255 10" style input.
- `parseBinInput(str) -> Uint8Array`: Parses "11111111 00001010" style input.
- `parseAsciiInput(str) -> Uint8Array`: Converts string to bytes.

## 3. Store Updates

### `src/store/slices/serialSlice.ts`

- Update `sendSerialData` thunk to accept `Uint8Array` instead of `string`.

### `src/store/slices/uiSlice.ts`

- Add `inputFormat` state (ASCII | HEX | DEC | BIN).
- Add action `setInputFormat`.

## 4. UI Enhancement

### `src/components/MainPanel/CommandInput.tsx`

- **Split Button Implementation**:
- Create a "Send" button area (larger size).
- Create a "Dropdown Trigger" (arrow) next to it.
- **Format Selection**:
- Clicking the arrow reveals: ASCII (default), HEX, DEC, BIN.
- Changing format clears/validates the current input or just changes parsing mode.
- **Send Logic**:
- On Send, use the active `inputFormat` to parse the text using the new formatters.
- Handle parsing errors (e.g., invalid HEX characters) with a toast or error state.

### `src/components/CommandPanel/CommandItem.tsx`

- Update to convert the command's sequence string to bytes before calling `sendSerialData`. (Assuming commands are stored as strings; might need to decide if commands save their format too, but for now assume ASCII for stored commands or auto-detect).

## 5. Testing

- Verify sending ASCII "A" works.
- Verify sending HEX "FF" works (and doesn't crash backend).
- Verify UI layout matches "little bigger" request.

### To-dos

- [ ] Refactor Rust backend `send_data` to accept `Vec<u8>`
- [ ] Update frontend `serialService` and `serialSlice` to handle byte arrays
- [ ] Implement input parser functions in `formatters.ts`
- [ ] Update `UiSlice` to include `inputFormat` state
- [ ] Create SplitButton component and enhance `CommandInput` UI
- [ ] Update `CommandItem` to use new send signature