<!-- 35251fa9-8e05-4bc9-91b9-d607768c60a9 edf05d30-c9f0-4bfe-a56e-b055b78b5d7d -->
# Phase 2: Serial Communication Backend

## Overview

Implement the core serial communication functionality using Rust's `serialport` crate and Tauri's event system. This phase bridges the UI skeleton with actual hardware communication.

## 1. Rust Backend Implementation

### Dependencies

- Verify `serialport`, `serde`, `serde_json` in `src-tauri/Cargo.toml`.
- Ensure `tauri-plugin-shell` is configured if needed (already added in Phase 1).

### Serial State Management (`src-tauri/src/serial/`)

- **`state.rs`**: Create a `SerialState` struct using `std::sync::Mutex` to hold the `Option<Box<dyn SerialPort>>`.
- **`manager.rs`**: Implement the logic to:
- Open a port non-exclusively (or exclusively as needed).
- Spawn a thread to continuously read from the port.
- Emit `serial-payload` events to the frontend when data is received.
- Handle writing data to the port.

### Tauri Commands (`src-tauri/src/commands/serial.rs`)

- Implement `get_ports`: Returns a list of available serial ports.
- Implement `open_port`: Accepts `port_name`, `baud_rate`, etc. Initializes the connection and starts the read thread.
- Implement `close_port`: Closes the connection and stops the read thread.
- Implement `write_data`: Accepts string/bytes and writes to the open port.
- Register commands in `main.rs`.

## 2. Frontend Service Layer

### Serial Service (`src/services/serialService.ts`)

- Implement `listPorts()` calling `get_ports`.
- Implement `connect(config)` calling `open_port`.
- Implement `disconnect()` calling `close_port`.
- Implement `send(data)` calling `write_data`.
- Add `listenToData(callback)` using Tauri's `listen` function for `serial-payload` events.

### Data Formatting (`src/utils/formatters.ts`)

- Implement conversion functions:
- `stringToHex`, `hexToString`
- `stringToDecimal`, `decimalToString`
- `stringToBinary`, `binaryToString`
- Ensure data sent/received respects the selected format in the UI.

## 3. State Management Integration

### Serial Slice Updates (`src/store/slices/serialSlice.ts`)

- Add `refreshPorts` thunk to update `availablePorts`.
- Add `connectPort` and `disconnectPort` thunks managing loading states and errors.
- Add `sendSerialData` thunk.

### UI Slice / Data Handling

- Update `dataDisplay` logic to append incoming data chunks.
- Handle "Clear Display" functionality (if not already present).

## 4. Component Integration

### Connection Logic

- **PortSelector**: Fetch ports on mount and on dropdown open.
- **CommSettingsModal**: Pass selected config to the `connectPort` action.
- **Toolbar/RunMenu**: "Run" calls `connectPort`, "Stop" calls `disconnectPort`.

### Data Transmission

- **CommandInput**: Validate input based on selected mode (e.g., only hex chars in HEX mode) and call `sendSerialData`.
- **CommandItem**: "Send" button triggers `sendSerialData` with the command's sequence.

### Data Reception

- **MainPanel/DataDisplay**: Subscribe to the store's data stream and render it according to the selected format (ASCII/HEX/etc.).

## 5. Error Handling & Polish

- Add toast notifications or status bar messages for:
- Connection success/failure.
- Port disconnected unexpectedly.
- Write errors.
- ensure resources are cleaned up (port closed) when the app exits.

### To-dos

- [ ] Initialize Tauri 2.0 project with React + TypeScript + Vite
- [ ] Install and configure dependencies (Zustand, Tailwind CSS, Lucide React)
- [ ] Create complete folder structure and header template file
- [ ] Set up Zustand store with all slices and TypeScript types
- [ ] Build main App layout with MenuBar, Toolbar, StatusBar components
- [ ] Build CommandPanel and MainPanel components with all subcomponents
- [ ] Create all modal components (Settings, Config, About, Tutorial)
- [ ] Build reusable common components (Button, Dropdown, Input, Icon)
- [ ] Apply Tailwind CSS styling to match Docklight-inspired design
- [ ] Add GPL v3.0 headers to all source files
- [ ] Create README.md and documentation files