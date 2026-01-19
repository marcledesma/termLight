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
 * @file updateService.ts
 * @author Marc Ledesma
 * @date 2026-01-19
 */

import { check, Update } from '@tauri-apps/plugin-updater';
import { getVersion } from '@tauri-apps/api/app';

export interface UpdateInfo {
  available: boolean;
  currentVersion: string;
  latestVersion?: string;
  body?: string;
  date?: string;
}

class UpdateService {
  private isChecking = false;
  private isDownloading = false;

  /**
   * Get the current application version
   */
  async getCurrentVersion(): Promise<string> {
    try {
      return await getVersion();
    } catch (error) {
      console.error('Failed to get current version:', error);
      return '0.0.0';
    }
  }

  /**
   * Check if an update is available
   */
  async checkForUpdates(): Promise<UpdateInfo> {
    if (this.isChecking) {
      throw new Error('Update check already in progress');
    }

    this.isChecking = true;

    try {
      const currentVersion = await this.getCurrentVersion();
      
      // Check for updates
      const update = await check();

      if (update?.available) {
        return {
          available: true,
          currentVersion,
          latestVersion: update.version,
          body: update.body,
          date: update.date,
        };
      }

      return {
        available: false,
        currentVersion,
      };
    } catch (error) {
      console.error('Failed to check for updates:', error);
      throw new Error('Failed to check for updates. Please try again later.');
    } finally {
      this.isChecking = false;
    }
  }

  /**
   * Download and install an update
   * @param update The update object from check()
   * @param onProgress Callback for download progress (0-100)
   */
  async downloadAndInstall(
    update: Update,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    if (this.isDownloading) {
      throw new Error('Download already in progress');
    }

    this.isDownloading = true;

    try {
      // Download and install the update
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            console.log('Update download started');
            onProgress?.(0);
            break;
          case 'Progress':
            const progress = Math.round((event.data.downloaded / event.data.contentLength!) * 100);
            console.log(`Download progress: ${progress}%`);
            onProgress?.(progress);
            break;
          case 'Finished':
            console.log('Update download finished');
            onProgress?.(100);
            break;
        }
      });

      console.log('Update installed successfully');
      // Note: The updater will automatically restart the application
    } catch (error) {
      console.error('Failed to download and install update:', error);
      throw new Error('Failed to install update. Please try again later.');
    } finally {
      this.isDownloading = false;
    }
  }

  /**
   * Check if currently checking for updates
   */
  isCheckingForUpdates(): boolean {
    return this.isChecking;
  }

  /**
   * Check if currently downloading an update
   */
  isDownloadingUpdate(): boolean {
    return this.isDownloading;
  }
}

export const updateService = new UpdateService();
