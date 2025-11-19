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
    <div className="p-2 border-b border-gray-300 space-y-2">
      <div className="grid grid-cols-[60px_1fr_2fr] gap-1 text-xs font-semibold text-gray-700 px-1">
        <div>Send</div>
        <div>Name</div>
        <div>Sequence</div>
      </div>
      <div className="flex gap-2">
        <Dropdown
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'alphabetical')}
          className="text-xs flex-1"
        >
          <option value="date">Creation Date</option>
          <option value="alphabetical">Alphabetical</option>
        </Dropdown>
      </div>
      <div className="relative">
        <Search
          size={14}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <Input
          type="text"
          placeholder="Search commands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-7 text-xs"
        />
      </div>
    </div>
  );
}



