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
 * @file serial.rs
 * @author Marc Ledesma
 * @date 2025-11-19
 */

use crate::serial::state::SerialState;
use serde::{Deserialize, Serialize};
use serialport::{DataBits, Parity, StopBits, SerialPort};
use std::io::{Read, Write};
use std::sync::atomic::Ordering;
use std::time::Duration;
use tauri::{AppHandle, Emitter, State};

#[derive(Debug, Serialize, Deserialize)]
pub struct PortInfo {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Clone, Serialize)]
struct SerialPayload {
    data: Vec<u8>,
}

#[tauri::command]
pub fn list_ports() -> Result<Vec<PortInfo>, String> {
    match serialport::available_ports() {
        Ok(ports) => {
            let port_list = ports
                .into_iter()
                .map(|p| PortInfo {
                    name: p.port_name,
                    description: None, // SerialPortInfo doesn't always provide a description in a standard way
                })
                .collect();
            Ok(port_list)
        }
        Err(e) => Err(format!("Failed to list ports: {}", e)),
    }
}

#[tauri::command]
pub fn open_port(
    app: AppHandle,
    state: State<'_, SerialState>,
    port_name: String,
    baud_rate: u32,
    data_bits: u8,
    stop_bits: f32,
    parity: String,
) -> Result<(), String> {
    let mut port_lock = state.port.lock().map_err(|_| "Failed to lock port mutex")?;

    if port_lock.is_some() {
        return Err("Port is already open".to_string());
    }

    let d_bits = match data_bits {
        5 => DataBits::Five,
        6 => DataBits::Six,
        7 => DataBits::Seven,
        8 => DataBits::Eight,
        _ => return Err("Invalid data bits".to_string()),
    };

    let s_bits = if stop_bits == 1.0 {
        StopBits::One
    } else if stop_bits == 2.0 {
        StopBits::Two
    } else {
        return Err("Invalid stop bits (only 1 and 2 supported)".to_string())
    };

    let p_parity = match parity.as_str() {
        "None" => Parity::None,
        "Even" => Parity::Even,
        "Odd" => Parity::Odd,
        _ => return Err("Invalid parity".to_string()),
    };

    let mut port = serialport::new(&port_name, baud_rate)
        .data_bits(d_bits)
        .stop_bits(s_bits)
        .parity(p_parity)
        .timeout(Duration::from_millis(100))
        .open()
        .map_err(|e| format!("Failed to open port: {}", e))?;

    // Clear any stale data in the receive buffer
    let _ = port.clear(serialport::ClearBuffer::Input);
    
    // Give the device a moment to settle after port open
    std::thread::sleep(Duration::from_millis(50));
    
    // Clear buffer again to discard any bytes sent during port initialization
    let _ = port.clear(serialport::ClearBuffer::Input);
    
    // Clone port for the read thread
    let mut read_port = port.try_clone().map_err(|e| format!("Failed to clone port: {}", e))?;
    
    *port_lock = Some(port);
    state.is_connected.store(true, Ordering::SeqCst);
    state.should_stop.store(false, Ordering::SeqCst);

    let should_stop = state.should_stop.clone();
    
    println!("Port {} opened successfully. Starting read thread...", port_name);

    std::thread::spawn(move || {
        let mut serial_buf: Vec<u8> = vec![0; 1024];
        let mut packet_buffer: Vec<u8> = Vec::new();
        let mut last_receive_time = std::time::Instant::now();
        let packet_timeout = Duration::from_millis(5); // Group data within 5ms as one packet
        
        loop {
            if should_stop.load(Ordering::SeqCst) {
                println!("Stopping read thread (requested)");
                break;
            }

            match read_port.read(&mut serial_buf) {
                Ok(t) if t > 0 => {
                    // Append received data to packet buffer
                    packet_buffer.extend_from_slice(&serial_buf[..t]);
                    last_receive_time = std::time::Instant::now();
                    println!("Received {} bytes (buffer now: {} bytes)", t, packet_buffer.len());
                }
                Ok(_) => {}
                Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => {}
                Err(e) => {
                    println!("Read error (stopping thread): {}", e);
                    break;
                }
            }
            
            // If we have data and enough time has passed without new data, emit the packet
            if !packet_buffer.is_empty() && last_receive_time.elapsed() >= packet_timeout {
                println!("Emitting packet with {} bytes: {:?}", packet_buffer.len(), packet_buffer);
                if let Err(e) = app.emit("serial-payload", SerialPayload { data: packet_buffer.clone() }) {
                    println!("Failed to emit serial-payload event: {}", e);
                }
                packet_buffer.clear();
            }
            
            // Small sleep to prevent 100% CPU usage
            std::thread::sleep(Duration::from_millis(1));
        }
    });

    Ok(())
}

#[tauri::command]
pub fn close_port(state: State<'_, SerialState>) -> Result<(), String> {
    let mut port_lock = state.port.lock().map_err(|_| "Failed to lock port mutex")?;
    
    if port_lock.is_none() {
        return Ok(());
    }

    // Signal thread to stop
    state.should_stop.store(true, Ordering::SeqCst);
    
    // Dropping the port closes it
    *port_lock = None;
    state.is_connected.store(false, Ordering::SeqCst);
    println!("Port closed");

    Ok(())
}

#[tauri::command]
pub fn send_data(state: State<'_, SerialState>, data: Vec<u8>) -> Result<(), String> {
    let mut port_lock = state.port.lock().map_err(|_| "Failed to lock port mutex")?;
    
    if let Some(port) = port_lock.as_mut() {
        port.write_all(&data)
            .map_err(|e| format!("Failed to write to port: {}", e))?;
        port.flush().map_err(|e| format!("Failed to flush port: {}", e))?;
        println!("Sent {} bytes", data.len());
        Ok(())
    } else {
        Err("Port is not open".to_string())
    }
}
