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
 * @file UpdateModal.tsx
 * @author Marc Ledesma
 * @date 2026-01-19
 */

import { useState, useEffect, useRef } from 'react';
import { X, Download, AlertCircle } from 'lucide-react';
import { Button } from '../Common/Button';
import { useStore } from '../../store';
import { updateService, UpdateInfo } from '../../services/updateService';
import { check, Update } from '@tauri-apps/plugin-updater';

export function UpdateModal() {
  const { setActiveModal } = useStore();
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [update, setUpdate] = useState<Update | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevent double-checking in React Strict Mode (dev only)
    if (hasChecked.current) return;
    hasChecked.current = true;
    
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    setIsChecking(true);
    setError(null);
    hasChecked.current = true;

    try {
      // Get update info
      const info = await updateService.checkForUpdates();
      setUpdateInfo(info);

      // If update is available, get the update object for installation
      if (info.available) {
        const updateObj = await check();
        setUpdate(updateObj);
      }
    } catch (err) {
      console.error('Failed to check for updates:', err);
      setError(err instanceof Error ? err.message : 'Failed to check for updates');
    } finally {
      setIsChecking(false);
    }
  };

  const handleInstall = async () => {
    if (!update) return;

    setIsDownloading(true);
    setError(null);

    try {
      await updateService.downloadAndInstall(update, (progress) => {
        setDownloadProgress(progress);
      });
      // The app will restart automatically after installation
    } catch (err) {
      console.error('Failed to install update:', err);
      setError(err instanceof Error ? err.message : 'Failed to install update');
      setIsDownloading(false);
    }
  };

  const handleClose = () => {
    if (!isDownloading) {
      setActiveModal(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Software Update</h2>
          <button
            onClick={handleClose}
            disabled={isDownloading}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isChecking ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Checking for updates...
              </p>
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Error
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          ) : updateInfo?.available ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Current Version:
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {updateInfo.currentVersion}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Latest Version:
                  </span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {updateInfo.latestVersion}
                  </span>
                </div>
              </div>

              {updateInfo.body && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Release Notes:
                  </h3>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {updateInfo.body}
                    </p>
                  </div>
                </div>
              )}

              {isDownloading && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 dark:text-gray-300">
                      Downloading update...
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {downloadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    The application will restart automatically after installation.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <Download className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                You're up to date!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Version {updateInfo?.currentVersion} is the latest version.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          {updateInfo?.available && !isDownloading && (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Later
              </Button>
              <Button onClick={handleInstall} disabled={isDownloading}>
                Install Now
              </Button>
            </>
          )}
          {!updateInfo?.available && !isChecking && !error && (
            <Button onClick={handleClose}>Close</Button>
          )}
          {error && (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={checkForUpdate}>Retry</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
