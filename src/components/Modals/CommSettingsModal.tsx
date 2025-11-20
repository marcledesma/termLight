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
 * @file CommSettingsModal.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../Common/Button';
import { Dropdown } from '../Common/Dropdown';
import { useStore } from '../../store';
import { SerialConfig } from '../../types';

export function CommSettingsModal() {
  const { 
    setActiveModal, 
    portName, 
    baudRate, 
    parity, 
    dataBits, 
    stopBits,
    availablePorts,
    setSerialConfig,
    refreshPorts 
  } = useStore();

  const [localConfig, setLocalConfig] = useState<SerialConfig>({
    portName,
    baudRate,
    parity,
    dataBits,
    stopBits
  });

  useEffect(() => {
    refreshPorts();
  }, [refreshPorts]);

  const handleSave = () => {
    setSerialConfig(localConfig);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Communication Settings</h2>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <Dropdown 
            label="COM Port" 
            value={localConfig.portName} 
            onChange={(e) => setLocalConfig({...localConfig, portName: e.target.value})}
          >
            <option value="" disabled>Select a port</option>
            {availablePorts.map(p => (
              <option key={p.name} value={p.name}>{p.name} {p.description ? `(${p.description})` : ''}</option>
            ))}
          </Dropdown>
          <Dropdown 
            label="Baud Rate" 
            value={localConfig.baudRate}
            onChange={(e) => setLocalConfig({...localConfig, baudRate: Number(e.target.value)})}
          >
            <option value="300">300</option>
            <option value="1200">1200</option>
            <option value="2400">2400</option>
            <option value="4800">4800</option>
            <option value="9600">9600</option>
            <option value="19200">19200</option>
            <option value="38400">38400</option>
            <option value="57600">57600</option>
            <option value="115200">115200</option>
          </Dropdown>
          <Dropdown 
            label="Parity" 
            value={localConfig.parity}
            onChange={(e) => setLocalConfig({...localConfig, parity: e.target.value as any})}
          >
            <option value="None">None</option>
            <option value="Even">Even</option>
            <option value="Odd">Odd</option>
          </Dropdown>
          <Dropdown 
            label="Data Bits" 
            value={localConfig.dataBits}
            onChange={(e) => setLocalConfig({...localConfig, dataBits: Number(e.target.value) as any})}
          >
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </Dropdown>
          <Dropdown 
            label="Stop Bits" 
            value={localConfig.stopBits}
            onChange={(e) => setLocalConfig({...localConfig, stopBits: Number(e.target.value) as any})}
          >
            <option value="1">1</option>
            <option value="1.5">1.5</option>
            <option value="2">2</option>
          </Dropdown>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="secondary" onClick={() => setActiveModal(null)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Apply</Button>
        </div>
      </div>
    </div>
  );
}
