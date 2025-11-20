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
  Loader2,
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { useStore } from '../../store';
import { useProjectOperations } from '../../hooks/useProjectOperations';

export function Toolbar() {
  const { 
    isConnected, 
    isConnecting, 
    connectPort, 
    disconnectPort, 
    setActiveModal 
  } = useStore();

  const { handleNew, handleOpen, handleSave, handlePrint } = useProjectOperations();

  const handleRunClick = () => {
    if (isConnected) {
      disconnectPort();
    } else {
      connectPort();
    }
  };

  return (
    <div className="flex items-center gap-1 px-2 h-12 bg-gray-200 border-b border-gray-300">
      <ToolbarButton icon={FileText} tooltip="New" onClick={handleNew} />
      <ToolbarButton icon={FolderOpen} tooltip="Open" onClick={handleOpen} />
      <ToolbarButton icon={Save} tooltip="Save" onClick={handleSave} />
      <ToolbarButton icon={Printer} tooltip="Print" onClick={handlePrint} />
      <div className="w-px h-8 bg-gray-400 mx-1"></div>
      
      {isConnecting ? (
        <ToolbarButton 
          icon={Loader2} 
          tooltip="Connecting..." 
          className="text-blue-600 animate-spin" 
          disabled 
        />
      ) : !isConnected ? (
        <ToolbarButton 
          icon={Play} 
          tooltip="Run" 
          className="text-green-600" 
          onClick={handleRunClick}
        />
      ) : (
        <ToolbarButton 
          icon={Square} 
          tooltip="Stop" 
          className="text-red-600" 
          onClick={handleRunClick}
        />
      )}
      
      <div className="w-px h-8 bg-gray-400 mx-1"></div>
      <ToolbarButton
        icon={Settings}
        tooltip="Communication Settings"
        onClick={() => setActiveModal('commSettings')}
        disabled={isConnected}
      />
      <ToolbarButton
        icon={Palette}
        tooltip="Display Configuration"
        onClick={() => setActiveModal('config')}
      />
    </div>
  );
}
