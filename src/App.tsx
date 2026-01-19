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
 * and managing commands via COM ports.
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
 * @file App.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useEffect } from 'react';
import clsx from 'clsx';
import './App.css';
import { MenuBar } from './components/MenuBar/MenuBar';
import { TitleBar } from './components/TitleBar/TitleBar';
import { Toolbar } from './components/Toolbar/Toolbar';
import { StatusBar } from './components/StatusBar/StatusBar';
import { MainPanel } from './components/MainPanel/MainPanel';
import { CommandPanel } from './components/CommandPanel/CommandPanel';
// import { Documentation } from './components/Documentation/Documentation';
import { CommSettingsModal } from './components/Modals/CommSettingsModal';
import { ConfigModal } from './components/Modals/ConfigModal';
import { AboutModal } from './components/Modals/AboutModal';
import { TutorialModal } from './components/Modals/TutorialModal';
import { CommandModal } from './components/Modals/CommandModal';
import { DeleteCommandModal } from './components/Modals/DeleteCommandModal';
import { UpdateModal } from './components/Modals/UpdateModal';
import { useStore } from './store';
import { serialService } from './services/serialService';
import { useUpdateCheck } from './hooks/useUpdateCheck';

function App() {
  const activeModal = useStore((state) => state.activeModal);
  const editingCommandId = useStore((state) => state.editingCommandId);
  const refreshPorts = useStore((state) => state.refreshPorts);
  const initRecentProjects = useStore((state) => state.initRecentProjects);
  const appendLog = useStore((state) => state.appendLog);
  const theme = useStore((state) => state.theme);
  const commandPanelWidth = useStore((state) => state.commandPanelWidth);

  // Check for updates on startup
  useUpdateCheck();

  useEffect(() => {
    const handleUnload = () => {
      // Attempt to close port on reload/close
      serialService.disconnect().catch(console.error);
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  useEffect(() => {
    // Initial port fetch
    refreshPorts();
    // Load recent projects
    initRecentProjects();

    // Listen for incoming data
    console.log("Initializing data listener in App");
    const unlistenPromise = serialService.listenToData((data) => {
      console.log("App received data:", data);
      appendLog({
        timestamp: Date.now(),
        direction: 'rx',
        data: Array.from(data), // Convert Uint8Array to regular array for storage
      });
    });

    return () => {
      unlistenPromise.then((fn) => {
        console.log("Cleaning up data listener");
        fn();
      });
    };
  }, [refreshPorts, appendLog, initRecentProjects]);

  return (
    <div className={clsx("flex flex-col h-screen", { "dark": theme === "Dark" })}>
      <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
        <TitleBar />
        <MenuBar />
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <MainPanel />
            {/* <Documentation /> */}
          </div>
          <div 
            className="border-l border-gray-300 dark:border-gray-700"
            style={{ width: `${commandPanelWidth}px`, minWidth: '285px', maxWidth: '570px' }}
          >
            <CommandPanel />
          </div>
        </div>
        <StatusBar />

        {activeModal === 'commSettings' && <CommSettingsModal />}
        {activeModal === 'config' && <ConfigModal />}
        {activeModal === 'about' && <AboutModal />}
        {activeModal === 'tutorial' && <TutorialModal />}
        {activeModal === 'command' && <CommandModal editingCommandId={editingCommandId} />}
        {activeModal === 'deleteCommand' && <DeleteCommandModal />}
        {activeModal === 'update' && <UpdateModal />}
      </div>
    </div>
  );
}

export default App;
