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
 * @file Toolbar.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import {
  FileText,
  FolderOpen,
  Save,
  Printer,
  Play,
  Square,
  Settings,
  Palette,
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { useStore } from '../../store';

export function Toolbar() {
  const { isConnected, setActiveModal } = useStore();

  return (
    <div className="flex items-center gap-1 px-2 h-12 bg-gray-200 border-b border-gray-300">
      <ToolbarButton icon={FileText} tooltip="New" />
      <ToolbarButton icon={FolderOpen} tooltip="Open" />
      <ToolbarButton icon={Save} tooltip="Save" />
      <ToolbarButton icon={Printer} tooltip="Print" />
      <div className="w-px h-8 bg-gray-400 mx-1"></div>
      {!isConnected ? (
        <ToolbarButton icon={Play} tooltip="Run" className="text-green-600" />
      ) : (
        <ToolbarButton icon={Square} tooltip="Stop" className="text-red-600" />
      )}
      <div className="w-px h-8 bg-gray-400 mx-1"></div>
      <ToolbarButton
        icon={Settings}
        tooltip="Communication Settings"
        onClick={() => setActiveModal('commSettings')}
      />
      <ToolbarButton
        icon={Palette}
        tooltip="Display Configuration"
        onClick={() => setActiveModal('config')}
      />
    </div>
  );
}



