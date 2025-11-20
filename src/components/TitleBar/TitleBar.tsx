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
 * @file TitleBar.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X, Zap, Maximize2 } from 'lucide-react';
import clsx from 'clsx';

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const appWindow = getCurrentWindow();

  useEffect(() => {
    const checkMaximized = async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    };

    checkMaximized();

    // Listen for resize event which might indicate maximize/restore
    // Note: Tauri v2 doesn't expose a direct "onMaximized" event easily in the frontend 
    // without using the event system, but checking on resize is a common workaround.
    const unlisten = appWindow.listen('tauri://resize', checkMaximized);

    return () => {
      unlisten.then(f => f());
    };
  }, []);

  const handleMinimize = () => {
    appWindow.minimize();
  };

  const handleMaximizeToggle = async () => {
    if (isMaximized) {
      await appWindow.unmaximize();
    } else {
      await appWindow.maximize();
    }
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    appWindow.close();
  };

  // Backup for drag if data-tauri-drag-region fails
  const handleDrag = (e: React.MouseEvent) => {
    // Only drag if left click and not on a button
    if (e.button === 0 && (e.target as HTMLElement).tagName !== 'BUTTON') {
       appWindow.startDragging();
    }
  };

  return (
    <div 
      data-tauri-drag-region 
      onMouseDown={handleDrag}
      className={clsx(
        "h-8 flex justify-between items-center select-none",
        "bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700",
        "text-gray-900 dark:text-gray-100 transition-colors"
      )}
    >
      <div className="flex items-center px-3 gap-2 pointer-events-none">
        <Zap size={16} className="text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-semibold">termLight</span>
      </div>

      <div className="flex h-full">
        <button
          onClick={handleMinimize}
          className="inline-flex justify-center items-center w-12 h-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          tabIndex={-1}
        >
          <Minus size={16} />
        </button>
        <button
          onClick={handleMaximizeToggle}
          className="inline-flex justify-center items-center w-12 h-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          tabIndex={-1}
        >
          {isMaximized ? <Maximize2 size={14} className="rotate-180" /> : <Square size={14} />}
        </button>
        <button
          onClick={handleClose}
          className="inline-flex justify-center items-center w-12 h-full hover:bg-red-500 hover:text-white transition-colors"
          tabIndex={-1}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
