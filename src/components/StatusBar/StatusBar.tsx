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
 * @file StatusBar.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { ConnectionStatus } from './ConnectionStatus';
import { PortSelector } from './PortSelector';
import { useStore } from '../../store';

export function StatusBar() {
  const { isConnected, baudRate, parity, dataBits, stopBits, setActiveModal } =
    useStore();

  const handleSettingsDoubleClick = () => {
    setActiveModal('commSettings');
  };

  return (
    <div className="flex items-center justify-between h-6 px-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 text-xs dark:text-gray-300">
      <ConnectionStatus isConnected={isConnected} />
      <div className="flex items-center gap-2">
        <PortSelector />
        <span className="text-gray-400 dark:text-gray-500">|</span>
        <span
          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-0.5 rounded"
          onDoubleClick={handleSettingsDoubleClick}
          title="Double-click to open settings"
        >
          {baudRate}, {parity}, {dataBits}, {stopBits}
        </span>
      </div>
    </div>
  );
}



