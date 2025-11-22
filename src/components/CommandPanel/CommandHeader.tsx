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
 * @file CommandHeader.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { Search, GripVertical, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import { Dropdown } from '../Common/Dropdown';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { useStore } from '../../store';

export function CommandHeader() {
  const { sortBy, setSortBy, searchQuery, setSearchQuery, commandColumnWidths, setCommandColumnWidths, setActiveModal } = useStore();
  const [_resizing, setResizing] = useState<'name' | null>(null);
  const startXRef = useRef(0);
  const startWidthsRef = useRef({ name: 0, sequence: 0 });

  const handleMouseDown = (column: 'name', e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(column);
    startXRef.current = e.clientX;
    startWidthsRef.current = {
      name: commandColumnWidths.name,
      sequence: 0, // Not used anymore
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startXRef.current;
      
      if (column === 'name') {
        const newNameWidth = Math.max(76, startWidthsRef.current.name + deltaX);
        setCommandColumnWidths({
          ...commandColumnWidths,
          name: newNameWidth,
        });
      }
    };

    const handleMouseUp = () => {
      setResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">Commands</span>
             <Button 
              variant="primary" 
              size="sm" 
              className="text-xs px-3 h-7"
              onClick={() => {
                useStore.getState().setEditingCommandId(null);
                setActiveModal('command');
              }}
              title="Add New Command"
            >
              <Plus size={14} className="mr-1" />
              Add New Command
            </Button>
        </div>
        <div className="flex gap-2">
          <div className="w-1/3 min-w-[120px]">
            <Dropdown
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'alphabetical')}
              className="text-xs w-full"
            >
              <option value="date">Creation Date</option>
              <option value="alphabetical">Alphabetical</option>
            </Dropdown>
          </div>
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              type="text"
              placeholder="Search commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 text-xs w-full"
            />
          </div>
        </div>
      </div>
      <div 
        className="flex px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="text-center flex items-center justify-center relative" style={{ width: `${commandColumnWidths.send}px` }}>
          Send
          {/* Divider */}
          <div className="absolute right-0 top-1 bottom-1 w-px bg-gray-300 dark:bg-gray-600" />
        </div>
        
        <div className="flex items-center relative" style={{ width: `${commandColumnWidths.name}px` }}>
          <div className="pl-2 flex-1">Name</div>
          
          {/* Divider */}
          <div className="absolute right-0 top-1 bottom-1 w-px bg-gray-300 dark:bg-gray-600" />

          <div
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 flex items-center justify-center group z-10"
            onMouseDown={(e) => handleMouseDown('name', e)}
          >
            <GripVertical size={12} className="text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100" />
          </div>
        </div>
        
        <div className="flex items-center flex-1">
          <div className="pl-2">Sequence</div>
        </div>
        
        <div className="flex items-center justify-center" style={{ width: `${commandColumnWidths.delete}px` }}></div>
      </div>
    </div>
  );
}