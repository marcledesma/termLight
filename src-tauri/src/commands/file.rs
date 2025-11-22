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
use tauri::{Manager, path::BaseDirectory};

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
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommSettings {
    pub params: Vec<i32>, // 9 parameters as integers
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
    };
    
    while idx < lines.len() {
        let line = lines[idx].trim();
        
        if line == "VERSION" {
            idx += 1;
            if idx < lines.len() {
                project.version = lines[idx].trim().parse()
                    .map_err(|e| format!("Invalid VERSION: {}", e))?;
            }
        } else if line == "COMMSETTINGS" {
            let mut params = vec![];
            while params.len() < 9 {
                idx += 1;
                if idx >= lines.len() {
                    break;
                }
                
                let val_str = lines[idx].trim();
                if val_str.is_empty() {
                    continue;
                }
                
                params.push(val_str.parse()
                    .map_err(|e| format!("Invalid COMMSETTINGS parameter: {}", e))?);
            }
            project.comm_settings = CommSettings { params };
        } else if line == "COMMDISPLAY" {
            idx += 1;
            if idx < lines.len() {
                project.comm_display = lines[idx].trim().parse()
                    .map_err(|e| format!("Invalid COMMDISPLAY: {}", e))?;
            }
        } else if line == "COMMCHANNELS" {
            idx += 1;
            while idx < lines.len() && !lines[idx].trim().is_empty() 
                && !lines[idx].trim().starts_with("SEND") 
                && !lines[idx].trim().starts_with("RECEIVE") {
                project.comm_channels.push(lines[idx].trim().to_string());
                idx += 1;
            }
            continue; // Don't increment idx again
        } else if line == "SEND" {
            idx += 1;
            if idx + 4 < lines.len() {
                let index = lines[idx].trim().parse()
                    .map_err(|e| format!("Invalid SEND index: {}", e))?;
                idx += 1;
                let name = lines[idx].trim().to_string();
                idx += 1;
                let hex_data = lines[idx].trim().to_string();
                idx += 1;
                let repetition_mode = lines[idx].trim().parse()
                    .map_err(|e| format!("Invalid SEND repetition_mode: {}", e))?;
                idx += 1;
                let color_index = lines[idx].trim().parse()
                    .map_err(|e| format!("Invalid SEND color_index: {}", e))?;
                
                project.send_commands.push(SendCommand {
                    index,
                    name,
                    hex_data,
                    repetition_mode,
                    color_index,
                });
            }
        } else if line == "RECEIVE" {
            idx += 1;
            if idx + 3 < lines.len() {
                let index = lines[idx].trim().parse()
                    .map_err(|e| format!("Invalid RECEIVE index: {}", e))?;
                idx += 1;
                let name = lines[idx].trim().to_string();
                idx += 1;
                let hex_data = lines[idx].trim().to_string();
                idx += 1;
                let param1 = lines[idx].trim().parse().unwrap_or(0);
                idx += 1;
                let param2 = lines[idx].trim().parse().unwrap_or(0);
                idx += 1;
                
                // Parse COMMENT line
                let mut comment = String::new();
                let mut comment_text = String::new();
                if idx < lines.len() && lines[idx].trim().starts_with("COMMENT") {
                    comment = lines[idx].trim().to_string();
                    // Extract text between quotes if present
                    if let Some(start) = lines[idx].find('"') {
                        if let Some(end) = lines[idx][start + 1..].find('"') {
                            comment_text = lines[idx][start + 1..start + 1 + end].to_string();
                        }
                    }
                    idx += 1;
                }
                
                let param3 = if idx < lines.len() { lines[idx].trim().parse().unwrap_or(0) } else { 0 };
                idx += 1;
                let param4 = if idx < lines.len() { lines[idx].trim().parse().unwrap_or(0) } else { 0 };
                idx += 1;
                let param5 = if idx < lines.len() { lines[idx].trim().parse().unwrap_or(0) } else { 0 };
                idx += 1;
                let param6 = if idx < lines.len() { lines[idx].trim().parse().unwrap_or(0) } else { 0 };
                
                project.receive_commands.push(ReceiveCommand {
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
                });
            }
        }
        
        idx += 1;
    }
    
    Ok(project)
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
    
    // COMMSETTINGS
    output.push_str("COMMSETTINGS\r\n");
    for param in &project.comm_settings.params {
        output.push_str(&format!("{}\r\n", param));
    }
    output.push_str("\r\n");
    
    // COMMDISPLAY
    output.push_str("COMMDISPLAY\r\n");
    output.push_str(&format!("{}\r\n", project.comm_display));
    output.push_str("\r\n");
    
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
    fn test_parse_project_file() {
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
        assert_eq!(project.comm_settings.params[0], 0);
        assert_eq!(project.comm_settings.params[3], 9600);
        assert_eq!(project.comm_channels.len(), 2);
        assert_eq!(project.send_commands.len(), 2);
    }
}
