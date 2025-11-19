# termLight - Serial Command Manager

A serial communication tool for sending, receiving, and managing commands via COM ports, similar to Docklight with Arduino-style direct command functionality.

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-green.svg)

## Features

- **Serial Port Communication**: Auto-detect available COM ports and configure serial parameters
- **Command Management**: Save, organize, and execute commands with one click
- **Multiple Data Formats**: View data in ASCII, HEX, DEC, BIN, or Serial Monitor mode
- **Project Management**: Save and load project configurations
- **Modern UI**: Clean, intuitive interface inspired by Docklight
- **Cross-Platform**: Built with Tauri 2.0 for Windows, macOS, and Linux

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Tauri 2.0 (Rust)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Serial Communication**: serialport (Rust crate)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Rust (latest stable version)
- For development on Windows: Visual Studio C++ Build Tools

### Installation

1. Clone the repository:
```bash
git clone https://github.com/marcledesma/termLight.git
cd termLight
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run tauri:dev
```

4. Build for production:
```bash
npm run tauri:build
```

## Project Structure

```
termLight/
├── src/                    # Frontend React application
│   ├── components/         # UI components
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript type definitions
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Service layer
│   └── utils/             # Utility functions
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/
│   │   ├── commands/      # Tauri commands
│   │   └── serial/        # Serial port handling
│   └── Cargo.toml
└── package.json
```

## Usage

### Connecting to a Serial Port

1. Click the settings icon in the toolbar
2. Select your COM port and configure serial parameters (baud rate, parity, data bits, stop bits)
3. Click the Run button to start communication

### Managing Commands

- Use the command panel on the right to save frequently used commands
- Click the Send button next to any command to transmit it
- Add new commands using the "+ Add New Command" button
- Search and sort commands by name or creation date

### Viewing Data

- The main panel displays all received and sent data
- Switch between different data formats using the tabs at the top
- Use Serial Monitor mode for Arduino-style output

### Saving Projects

- Go to File > Save Project As to save your current configuration
- Recent projects appear in the File menu for quick access

## Development Phases

### Phase 1: UI Skeleton ✅
- Complete UI structure
- State management setup
- Component architecture

### Phase 2: Serial Communication (Upcoming)
- Serial port detection and connection
- Data transmission and reception
- Real-time data display

### Phase 3: Advanced Features (Upcoming)
- Project file management
- Command import/export
- Data logging and export
- Enhanced formatting options

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Important Notice

⚠️ **AI-Generated Code Warning**: Approximately 80% of this codebase was generated using AI assistance. Please review, test, and validate all code before use in production environments.

## Author

**Marc Ledesma**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Inspired by Docklight and Arduino Serial Monitor
- Built with Tauri 2.0, React, and Rust
- Icons provided by Lucide

## Repository

[https://github.com/marcledesma/termLight](https://github.com/marcledesma/termLight)



