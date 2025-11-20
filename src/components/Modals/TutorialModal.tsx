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
 * @file TutorialModal.tsx
 * @author Marc Ledesma
 * @date 2025-11-19
 */

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../Common/Button';
import { useStore } from '../../store';

const tutorialSteps = [
  {
    title: 'Welcome to termLight',
    content:
      'termLight is a serial communication tool that lets you send, receive, and manage commands via COM ports. This tutorial will guide you through the basics.',
  },
  {
    title: 'Connecting to a Port',
    content:
      'Click the settings icon in the toolbar to configure your COM port, baud rate, and other serial parameters. Then click Run to start communication.',
  },
  {
    title: 'Sending Commands',
    content:
      'Use the command panel on the right to save frequently used commands. Click Send to transmit them instantly. You can also type directly in the input bar at the bottom of the main panel.',
  },
  {
    title: 'Viewing Data',
    content:
      'The main panel displays all received and sent data. Switch between ASCII, HEX, DEC, BIN, or Serial Monitor mode using the tabs at the top.',
  },
  {
    title: 'Managing Projects',
    content:
      'Save your commands and settings as a project using File > Save Project. Your recent projects will appear in the File menu for quick access.',
  },
];

export function TutorialModal() {
  const { setActiveModal } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Tutorial</h2>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">
              {tutorialSteps[currentStep].title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{tutorialSteps[currentStep].content}</p>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              {currentStep < tutorialSteps.length - 1 ? (
                <Button size="sm" onClick={handleNext}>
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button size="sm" onClick={() => setActiveModal(null)}>
                  Finish
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



