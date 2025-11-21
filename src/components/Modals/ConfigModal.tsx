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
 * @file ConfigModal.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../Common/Button';
import { Dropdown } from '../Common/Dropdown';
import { useStore } from '../../store';
import { Theme, FontSize, CrcType } from '../../types';
import { THEME_COLORS } from '../../utils/constants';

export function ConfigModal() {
  const { 
    setActiveModal, 
    theme, 
    fontSize, 
    displayColors,
    cobsEnabled,
    crcType,
    setTheme, 
    setFontSize, 
    setDisplayColors,
    setCobsEnabled,
    setCrcType
  } = useStore();

  const [localTheme, setLocalTheme] = useState<Theme>(theme);
  const [localFontSize, setLocalFontSize] = useState<FontSize>(fontSize);
  const [localReceiveColor, setLocalReceiveColor] = useState(displayColors.receive);
  const [localSendColor, setLocalSendColor] = useState(displayColors.send);
  const [localCobsEnabled, setLocalCobsEnabled] = useState(cobsEnabled);
  const [localCrcType, setLocalCrcType] = useState<CrcType>(crcType);

  // Sync with store if store updates (though usually modal is closed)
  useEffect(() => {
    setLocalTheme(theme);
    setLocalFontSize(fontSize);
    setLocalReceiveColor(displayColors.receive);
    setLocalSendColor(displayColors.send);
    setLocalCobsEnabled(cobsEnabled);
    setLocalCrcType(crcType);
  }, [theme, fontSize, displayColors, cobsEnabled, crcType]);

  // Automatically switch colors when theme changes, if they match the defaults
  const handleThemeChange = (newTheme: Theme) => {
    setLocalTheme(newTheme);
    
    // Check if current colors are the defaults for the OLD theme (or just check against all defaults)
    const isReceiveDefaultLight = localReceiveColor === THEME_COLORS.Light.receive;
    const isReceiveDefaultDark = localReceiveColor === THEME_COLORS.Dark.receive;
    const isSendDefaultLight = localSendColor === THEME_COLORS.Light.send;
    const isSendDefaultDark = localSendColor === THEME_COLORS.Dark.send;

    // If currently using default colors (either Light or Dark variant), switch to new theme's default
    if (newTheme === 'Dark') {
      if (isReceiveDefaultLight) setLocalReceiveColor(THEME_COLORS.Dark.receive);
      if (isSendDefaultLight) setLocalSendColor(THEME_COLORS.Dark.send);
    } else {
      if (isReceiveDefaultDark) setLocalReceiveColor(THEME_COLORS.Light.receive);
      if (isSendDefaultDark) setLocalSendColor(THEME_COLORS.Light.send);
    }
  };

  const handleApply = () => {
    setTheme(localTheme);
    setFontSize(localFontSize);
    setDisplayColors({
      receive: localReceiveColor,
      send: localSendColor
    });
    setCobsEnabled(localCobsEnabled);
    setCrcType(localCrcType);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Display Configuration</h2>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <Dropdown 
            label="Theme" 
            value={localTheme}
            onChange={(e) => handleThemeChange(e.target.value as Theme)}
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </Dropdown>
          <Dropdown 
            label="Font Size"
            value={localFontSize}
            onChange={(e) => setLocalFontSize(e.target.value as FontSize)}
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </Dropdown>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Display Colors
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="color"
                  className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded p-0 overflow-hidden"
                  value={localReceiveColor}
                  onChange={(e) => setLocalReceiveColor(e.target.value)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Receive Data</span>
              </div>
              <div className="flex items-center">
                <input
                  type="color"
                  className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded p-0 overflow-hidden"
                  value={localSendColor}
                  onChange={(e) => setLocalSendColor(e.target.value)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Send Data</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              HEX Mode Processing
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cobsEnabled"
                  checked={localCobsEnabled}
                  onChange={(e) => setLocalCobsEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="cobsEnabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable COBS Autodecoding
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                Automatically decode/encode COBS framing when in HEX mode
              </p>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  CRC Validation
                </label>
                <select
                  value={localCrcType}
                  onChange={(e) => setLocalCrcType(e.target.value as CrcType)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="None">None</option>
                  <option value="CRC-8">CRC-8/MAXIM-DOW</option>
                  <option value="CRC-16">CRC-16/IBM-3740</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Validate received CRC and append CRC to sent data in HEX mode
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={() => setActiveModal(null)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </div>
    </div>
  );
}
