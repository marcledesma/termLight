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

import { Search } from 'lucide-react';
import { Dropdown } from '../Common/Dropdown';
import { Input } from '../Common/Input';
import { useStore } from '../../store';

export function CommandHeader() {
  const { sortBy, setSortBy, searchQuery, setSearchQuery } = useStore();

  return (
    <div className="flex flex-col border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="p-2 space-y-2">
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
      <div className="grid grid-cols-[60px_1fr_2fr_40px] gap-1 px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">Send</div>
        <div className="pl-1">Name</div>
        <div className="pl-1">Sequence</div>
        <div></div>
      </div>
    </div>
  );
}
