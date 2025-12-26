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
 * @file file.rs
 * @author Marc Ledesma
 * @date 2025-11-19
 */

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use tauri::Manager;

// ============================================================================
// Data Structures
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectData {
    pub version: i32,
    pub comm_settings: CommSettings,
    pub comm_display: i32,
    pub comm_channels: Vec<String>,
    pub send_commands: Vec<SendCommand>,
    pub receive_commands: Vec<ReceiveCommand>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub versatap: Option<i32>,
    #[serde(skip_serializing_if = "Vec::is_empty", default)]
    pub channel_alias: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommSettings {
    pub params: Vec<String>, // Parameters as strings to handle mixed types (v7: numbers, v8: port names + numbers)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendCommand {
    pub index: i32,
    pub name: String,
    pub hex_data: String,
    pub repetition_mode: i32,
    pub color_index: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReceiveCommand {
    pub index: i32,
    pub name: String,
    pub hex_data: String,
    pub param1: i32,
    pub param2: i32,
    pub comment: String,
    pub comment_text: String,
    pub param3: i32,
    pub param4: i32,
    pub param5: i32,
    pub param6: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecentProject {
    pub name: String,
    pub path: String,
    pub last_modified: String, // ISO string
}

const RECENT_FILES_JSON: &str = "recent_projects.json";

// ============================================================================
// Parser Implementation
// ============================================================================

pub fn parse_project_file(path: &Path) -> Result<ProjectData, String> {
    let content = fs::read_to_string(path)
        .map_err(|e| format!("Failed to read file: {}", e))?;
    
    let lines: Vec<&str> = content.lines().collect();
    let mut idx = 0;
    
    let mut project = ProjectData {
        version: 0,
        comm_settings: CommSettings { params: vec![] },
        comm_display: 0,
        comm_channels: vec![],
        send_commands: vec![],
        receive_commands: vec![],
        versatap: None,
        channel_alias: vec![],
    };
    
    while idx < lines.len() {
        let line = lines[idx].trim();
        
        if line == "VERSION" {
            idx += 1;
            if idx < lines.len() {
                match lines[idx].trim().parse() {
                    Ok(v) => project.version = v,
                    Err(e) => eprintln!("Warning: Invalid VERSION: {}, using default", e),
                }
            }
        } else if line == "COMMSETTINGS" {
            // Parse COMMSETTINGS with flexible string handling (v7: all numbers, v8: mixed strings/numbers)
            let mut params = vec![];
            loop {
                idx += 1;
                if idx >= lines.len() {
                    break;
                }
                
                let val_str = lines[idx].trim();
                
                // Stop if we hit an empty line or another section header
                if val_str.is_empty() {
                    break;
                }
                
                if val_str.starts_with("COMMDISPLAY") || val_str.starts_with("COMMCHANNELS") 
                    || val_str.starts_with("VERSATAP") || val_str.starts_with("CHANNELALIAS")
                    || val_str.starts_with("SEND") || val_str.starts_with("RECEIVE") {
                    idx -= 1; // Back up so we process this header next iteration
                    break;
                }
                
                // Store as string to handle both numeric and text values
                params.push(val_str.to_string());
            }
            project.comm_settings = CommSettings { params };
        } else if line == "COMMDISPLAY" {
            idx += 1;
            if idx < lines.len() {
                match lines[idx].trim().parse() {
                    Ok(v) => project.comm_display = v,
                    Err(e) => eprintln!("Warning: Invalid COMMDISPLAY: {}, using default", e),
                }
            }
        } else if line == "VERSATAP" {
            idx += 1;
            if idx < lines.len() {
                match lines[idx].trim().parse() {
                    Ok(v) => project.versatap = Some(v),
                    Err(e) => eprintln!("Warning: Invalid VERSATAP: {}, skipping", e),
                }
            }
        } else if line == "CHANNELALIAS" {
            idx += 1;
            while idx < lines.len() {
                let val_str = lines[idx].trim();
                
                // Stop if we hit an empty line or another section header
                if val_str.is_empty() || val_str.starts_with("SEND") || val_str.starts_with("RECEIVE") 
                    || val_str.starts_with("VERSION") || val_str.starts_with("COMM") 
                    || val_str.starts_with("VERSATAP") {
                    idx -= 1;
                    break;
                }
                
                project.channel_alias.push(val_str.to_string());
                idx += 1;
            }
        } else if line == "COMMCHANNELS" {
            idx += 1;
            while idx < lines.len() {
                let val_str = lines[idx].trim();
                
                // Stop if we hit an empty line or another section header
                if val_str.is_empty() || val_str.starts_with("SEND") || val_str.starts_with("RECEIVE")
                    || val_str.starts_with("VERSION") || val_str.starts_with("COMM") 
                    || val_str.starts_with("VERSATAP") || val_str.starts_with("CHANNELALIAS") {
                    idx -= 1;
                    break;
                }
                
                project.comm_channels.push(val_str.to_string());
                idx += 1;
            }
        } else if line == "SEND" {
            // Parse SEND command with error isolation
            idx += 1;
            if idx + 4 < lines.len() {
                match parse_send_command(&lines, &mut idx) {
                    Ok(cmd) => project.send_commands.push(cmd),
                    Err(e) => {
                        eprintln!("Warning: Failed to parse SEND command: {}, skipping", e);
                        // Skip to next section
                        while idx < lines.len() && !lines[idx].trim().is_empty() 
                            && !lines[idx].trim().starts_with("SEND") 
                            && !lines[idx].trim().starts_with("RECEIVE") {
                            idx += 1;
                        }
                        continue;
                    }
                }
            }
        } else if line == "RECEIVE" {
            // Parse RECEIVE command with error isolation
            idx += 1;
            if idx + 3 < lines.len() {
                match parse_receive_command(&lines, &mut idx) {
                    Ok(cmd) => project.receive_commands.push(cmd),
                    Err(e) => {
                        eprintln!("Warning: Failed to parse RECEIVE command: {}, skipping", e);
                        // Skip to next section
                        while idx < lines.len() && !lines[idx].trim().is_empty() 
                            && !lines[idx].trim().starts_with("SEND") 
                            && !lines[idx].trim().starts_with("RECEIVE") {
                            idx += 1;
                        }
                        continue;
                    }
                }
            }
        }
        
        idx += 1;
    }
    
    Ok(project)
}

// Helper function to parse a SEND command
fn parse_send_command(lines: &[&str], idx: &mut usize) -> Result<SendCommand, String> {
    let index = lines[*idx].trim().parse()
        .map_err(|e| format!("Invalid SEND index: {}", e))?;
    *idx += 1;
    let name = lines[*idx].trim().to_string();
    *idx += 1;
    let hex_data = lines[*idx].trim().to_string();
    *idx += 1;
    let repetition_mode = lines[*idx].trim().parse()
        .map_err(|e| format!("Invalid SEND repetition_mode: {}", e))?;
    *idx += 1;
    let color_index = lines[*idx].trim().parse()
        .map_err(|e| format!("Invalid SEND color_index: {}", e))?;
    
    Ok(SendCommand {
        index,
        name,
        hex_data,
        repetition_mode,
        color_index,
    })
}

// Helper function to parse a RECEIVE command
fn parse_receive_command(lines: &[&str], idx: &mut usize) -> Result<ReceiveCommand, String> {
    let index = lines[*idx].trim().parse()
        .map_err(|e| format!("Invalid RECEIVE index: {}", e))?;
    *idx += 1;
    let name = lines[*idx].trim().to_string();
    *idx += 1;
    let hex_data = lines[*idx].trim().to_string();
    *idx += 1;
    let param1 = lines[*idx].trim().parse().unwrap_or(0);
    *idx += 1;
    let param2 = lines[*idx].trim().parse().unwrap_or(0);
    *idx += 1;
    
    // Parse COMMENT line
    let mut comment = String::new();
    let mut comment_text = String::new();
    if *idx < lines.len() && lines[*idx].trim().starts_with("COMMENT") {
        comment = lines[*idx].trim().to_string();
        // Extract text between quotes if present
        if let Some(start) = lines[*idx].find('"') {
            if let Some(end) = lines[*idx][start + 1..].find('"') {
                comment_text = lines[*idx][start + 1..start + 1 + end].to_string();
            }
        }
        *idx += 1;
    }
    
    let param3 = if *idx < lines.len() { lines[*idx].trim().parse().unwrap_or(0) } else { 0 };
    *idx += 1;
    let param4 = if *idx < lines.len() { lines[*idx].trim().parse().unwrap_or(0) } else { 0 };
    *idx += 1;
    let param5 = if *idx < lines.len() { lines[*idx].trim().parse().unwrap_or(0) } else { 0 };
    *idx += 1;
    let param6 = if *idx < lines.len() { lines[*idx].trim().parse().unwrap_or(0) } else { 0 };
    
    Ok(ReceiveCommand {
        index,
        name,
        hex_data,
        param1,
        param2,
        comment,
        comment_text,
        param3,
        param4,
        param5,
        param6,
    })
}

// ============================================================================
// Serializer Implementation
// ============================================================================

pub fn write_project_file(project: &ProjectData, path: &Path) -> Result<(), String> {
    let mut output = String::new();
    
    // VERSION
    output.push_str("VERSION\r\n");
    output.push_str(&format!("{}\r\n", project.version));
    output.push_str("\r\n");
    
    // COMMSETTINGS (now stored as strings)
    output.push_str("COMMSETTINGS\r\n");
    for param in &project.comm_settings.params {
        output.push_str(&format!("{}\r\n", param));
    }
    output.push_str("\r\n");
    
    // COMMDISPLAY
    output.push_str("COMMDISPLAY\r\n");
    output.push_str(&format!("{}\r\n", project.comm_display));
    output.push_str("\r\n");
    
    // VERSATAP (optional, v8+)
    if let Some(versatap) = project.versatap {
        output.push_str("VERSATAP\r\n");
        output.push_str(&format!("{}\r\n", versatap));
        output.push_str("\r\n");
    }
    
    // CHANNELALIAS (optional, v8+)
    if !project.channel_alias.is_empty() {
        output.push_str("CHANNELALIAS\r\n");
        for alias in &project.channel_alias {
            output.push_str(&format!("{}\r\n", alias));
        }
        output.push_str("\r\n");
    }
    
    // COMMCHANNELS (if present)
    if !project.comm_channels.is_empty() {
        output.push_str("COMMCHANNELS\r\n");
        for channel in &project.comm_channels {
            output.push_str(&format!("{}\r\n", channel));
        }
        output.push_str("\r\n");
    }
    
    // SEND commands
    for cmd in &project.send_commands {
        output.push_str("SEND\r\n");
        output.push_str(&format!("{}\r\n", cmd.index));
        output.push_str(&format!("{}\r\n", cmd.name));
        output.push_str(&format!("{}\r\n", cmd.hex_data));
        output.push_str(&format!("{}\r\n", cmd.repetition_mode));
        output.push_str(&format!("{}\r\n", cmd.color_index));
        output.push_str("\r\n");
    }
    
    // RECEIVE commands
    for cmd in &project.receive_commands {
        output.push_str("RECEIVE\r\n");
        output.push_str(&format!("{}\r\n", cmd.index));
        output.push_str(&format!("{}\r\n", cmd.name));
        output.push_str(&format!("{}\r\n", cmd.hex_data));
        output.push_str(&format!("{}\r\n", cmd.param1));
        output.push_str(&format!("{}\r\n", cmd.param2));
        output.push_str(&format!("{}\r\n", cmd.comment));
        output.push_str(&format!("{}\r\n", cmd.comment_text));
        output.push_str(&format!("{}\r\n", cmd.param3));
        output.push_str(&format!("{}\r\n", cmd.param4));
        output.push_str(&format!("{}\r\n", cmd.param5));
        output.push_str(&format!("{}\r\n", cmd.param6));
        output.push_str("\r\n");
    }
    
    fs::write(path, output)
        .map_err(|e| format!("Failed to write file: {}", e))?;
    
    Ok(())
}

// ============================================================================
// Helper Functions
// ============================================================================

fn get_recent_files_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let config_dir = app.path().app_config_dir()
        .map_err(|e| format!("Failed to get app config dir: {}", e))?;
    
    if !config_dir.exists() {
        fs::create_dir_all(&config_dir)
            .map_err(|e| format!("Failed to create config dir: {}", e))?;
    }
    
    Ok(config_dir.join(RECENT_FILES_JSON))
}

// ============================================================================
// Tauri Commands
// ============================================================================

#[tauri::command]
pub async fn save_project(
    app: tauri::AppHandle,
    project: ProjectData, 
    file_path: String
) -> Result<(), String> {
    let path = Path::new(&file_path);
    write_project_file(&project, path)?;
    add_recent_project(app, file_path).await?;
    Ok(())
}

#[tauri::command]
pub async fn load_project(
    app: tauri::AppHandle,
    file_path: String
) -> Result<ProjectData, String> {
    let path = Path::new(&file_path);
    let project = parse_project_file(path)?;
    add_recent_project(app, file_path).await?;
    Ok(project)
}

#[tauri::command]
pub async fn save_project_dialog(
    app: tauri::AppHandle,
    project: ProjectData,
) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::{DialogExt, FilePath};
    
    let file_path = app.dialog()
        .file()
        .add_filter("termLight Project", &["ptp"])
        .set_title("Save Project")
        .blocking_save_file();
    
    if let Some(FilePath::Path(path)) = file_path {
        write_project_file(&project, &path)?;
        let path_str = path.to_string_lossy().to_string();
        add_recent_project(app, path_str.clone()).await?;
        Ok(Some(path_str))
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub async fn load_project_dialog(
    app: tauri::AppHandle,
) -> Result<Option<(String, ProjectData)>, String> {
    use tauri_plugin_dialog::{DialogExt, FilePath};
    
    let file_path = app.dialog()
        .file()
        .add_filter("termLight Project", &["ptp"])
        .set_title("Open Project")
        .blocking_pick_file();
    
    if let Some(FilePath::Path(path)) = file_path {
        let project = parse_project_file(&path)?;
        let path_str = path.to_string_lossy().to_string();
        add_recent_project(app, path_str.clone()).await?;
        Ok(Some((path_str, project)))
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub async fn get_recent_projects(app: tauri::AppHandle) -> Result<Vec<RecentProject>, String> {
    let path = get_recent_files_path(&app)?;
    
    if !path.exists() {
        return Ok(Vec::new());
    }
    
    let content = fs::read_to_string(path)
        .map_err(|e| format!("Failed to read recent projects file: {}", e))?;
        
    let projects: Vec<RecentProject> = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse recent projects: {}", e))?;
        
    Ok(projects)
}

#[tauri::command]
pub async fn add_recent_project(app: tauri::AppHandle, path: String) -> Result<Vec<RecentProject>, String> {
    let json_path = get_recent_files_path(&app)?;
    
    let mut projects: Vec<RecentProject> = if json_path.exists() {
        let content = fs::read_to_string(&json_path)
            .map_err(|e| format!("Failed to read recent projects file: {}", e))?;
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        Vec::new()
    };
    
    // Remove existing entry if present
    projects.retain(|p| p.path != path);
    
    // Add new entry to the top
    let name = Path::new(&path)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("Untitled")
        .to_string();
        
    projects.insert(0, RecentProject {
        name,
        path,
        last_modified: chrono::Local::now().to_rfc3339(),
    });
    
    // Keep only top 10
    if projects.len() > 10 {
        projects.truncate(10);
    }
    
    let content = serde_json::to_string_pretty(&projects)
        .map_err(|e| format!("Failed to serialize recent projects: {}", e))?;
        
    fs::write(json_path, content)
        .map_err(|e| format!("Failed to write recent projects file: {}", e))?;
        
    Ok(projects)
}

#[tauri::command]
pub async fn clear_recent_projects(app: tauri::AppHandle) -> Result<(), String> {
    let path = get_recent_files_path(&app)?;
    if path.exists() {
        fs::remove_file(path)
            .map_err(|e| format!("Failed to delete recent projects file: {}", e))?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use tempfile::NamedTempFile;

    #[test]
    fn test_parse_project_file_v7() {
        let content = "VERSION
7

COMMSETTINGS
0
1
2
9600
2
63
4
0
0

COMMDISPLAY
0

COMMCHANNELS
UDP:LOCALHOST:50000
COM2

SEND
0
Ping
2D 2D 2D 2D 6F 20 50 69 6E 67
0
5

SEND
1
Pong
6F 2D 2D 2D 2D 20 50 6F 6E 67
0
5
";
        
        let mut file = NamedTempFile::new().unwrap();
        write!(file, "{}", content).unwrap();
        
        let result = parse_project_file(file.path());
        assert!(result.is_ok());
        
        let project = result.unwrap();
        assert_eq!(project.version, 7);
        assert_eq!(project.comm_settings.params.len(), 9);
        assert_eq!(project.comm_settings.params[0], "0");
        assert_eq!(project.comm_settings.params[3], "9600");
        assert_eq!(project.comm_channels.len(), 2);
        assert_eq!(project.send_commands.len(), 2);
    }

    #[test]
    fn test_parse_project_file_v8() {
        let content = "VERSION
8

COMMSETTINGS
0
COM3
COM2
57600
2
63
4
0
0

COMMDISPLAY
0

VERSATAP
0

CHANNELALIAS



SEND
0
-----------------------
2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D
0
5

SEND
1
ATM Sof Reset
24 30 31 2C 30 37 2C 30 30 30 31 2C 2C 2C 65 37 37 62 2A
0
5
";
        
        let mut file = NamedTempFile::new().unwrap();
        write!(file, "{}", content).unwrap();
        
        let result = parse_project_file(file.path());
        assert!(result.is_ok());
        
        let project = result.unwrap();
        assert_eq!(project.version, 8);
        assert_eq!(project.comm_settings.params.len(), 9);
        assert_eq!(project.comm_settings.params[0], "0");
        assert_eq!(project.comm_settings.params[1], "COM3");
        assert_eq!(project.comm_settings.params[2], "COM2");
        assert_eq!(project.comm_settings.params[3], "57600");
        assert_eq!(project.versatap, Some(0));
        assert_eq!(project.send_commands.len(), 2);
        assert_eq!(project.send_commands[0].name, "-----------------------");
        assert_eq!(project.send_commands[1].name, "ATM Sof Reset");
    }
}
