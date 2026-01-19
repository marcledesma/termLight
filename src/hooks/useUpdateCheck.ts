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
 * @file useUpdateCheck.ts
 * @author Marc Ledesma
 * @date 2026-01-19
 */

import { useEffect } from 'react';
import { useStore } from '../store';
import { updateService } from '../services/updateService';

/**
 * Hook to check for updates on app startup
 * Silently checks in the background and shows modal only if update is available
 */
export function useUpdateCheck() {
  const setActiveModal = useStore((state) => state.setActiveModal);

  useEffect(() => {
    // Check for updates on startup
    const checkForUpdates = async () => {
      try {
        // Only check for updates in production builds
        // In dev mode, there are no releases to check against
        if (import.meta.env.DEV) {
          console.log('Skipping update check in development mode');
          return;
        }

        console.log('Checking for updates on startup...');
        const updateInfo = await updateService.checkForUpdates();
        
        if (updateInfo.available) {
          console.log('Update available:', updateInfo.latestVersion);
          // Show the update modal
          setActiveModal('update');
        } else {
          console.log('No updates available');
        }
      } catch (error) {
        // Silent failure - don't interrupt user experience
        console.error('Failed to check for updates on startup:', error);
      }
    };

    // Small delay to let the app initialize first
    const timeoutId = setTimeout(checkForUpdates, 2000);

    return () => clearTimeout(timeoutId);
  }, [setActiveModal]);
}
