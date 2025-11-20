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
 * @file PortSelector.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useState } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { useStore } from '../../store';

export function PortSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { portName, availablePorts, setSerialConfig, refreshPorts, isConnected } = useStore();

  const handlePortSelect = (name: string) => {
    setSerialConfig({ portName: name });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 px-2 py-0.5 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isConnected}
        title={isConnected ? "Cannot change port while connected" : "Select COM port"}
      >
        <span>{portName || 'No Port'}</span>
        <ChevronDown size={12} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-1 right-0 w-48 bg-white border border-gray-300 shadow-lg rounded z-50">
          <div className="max-h-40 overflow-y-auto">
            {availablePorts.length > 0 ? (
              availablePorts.map((port) => (
                <button
                  key={port.name}
                  className="w-full px-3 py-1.5 text-left hover:bg-blue-100 text-xs truncate"
                  onClick={() => handlePortSelect(port.name)}
                  title={port.description || port.name}
                >
                  {port.name}
                </button>
              ))
            ) : (
              <div className="px-3 py-1.5 text-gray-400 text-xs">
                No ports available
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 p-1">
             <button 
               className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
               onClick={() => refreshPorts()}
             >
               <RefreshCw size={10} />
               Refresh Ports
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
