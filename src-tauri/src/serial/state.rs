/*
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
 * @file state.rs
 * @author Marc Ledesma
 * @date 2025-11-19
 */

use serialport::SerialPort;
use std::sync::Mutex;
use std::sync::Arc;
use std::sync::atomic::AtomicBool;

pub struct SerialState {
    pub port: Mutex<Option<Box<dyn SerialPort>>>,
    pub is_connected: AtomicBool,
    pub should_stop: Arc<AtomicBool>,
}

impl SerialState {
    pub fn new() -> Self {
        Self {
            port: Mutex::new(None),
            is_connected: AtomicBool::new(false),
            should_stop: Arc::new(AtomicBool::new(false)),
        }
    }
}
