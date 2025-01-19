#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reasonflow::{Workflow, Node, Connection};
use tauri::State;
use std::sync::Mutex;

struct WorkflowState(Mutex<Workflow>);

#[tauri::command]
async fn create_workflow(name: String, state: State<'_, WorkflowState>) -> Result<String, String> {
    let mut workflow = Workflow::new(name);
    let id = workflow.id.clone();
    *state.0.lock().unwrap() = workflow;
    Ok(id)
}

#[tauri::command]
async fn add_node(
    node_type: String,
    state: State<'_, WorkflowState>
) -> Result<String, String> {
    let node = Node::new(node_type);
    let id = node.id.clone();
    state.0.lock().unwrap().add_node(node);
    Ok(id)
}

#[tauri::command]
async fn add_connection(
    source_node: String,
    source_port: String,
    target_node: String,
    target_port: String,
    state: State<'_, WorkflowState>
) -> Result<String, String> {
    let connection = Connection {
        id: uuid::Uuid::new_v4().to_string(),
        source_node,
        source_port,
        target_node,
        target_port,
    };
    let id = connection.id.clone();
    state.0.lock().unwrap().add_connection(connection);
    Ok(id)
}

fn main() {
    let workflow_state = WorkflowState(Mutex::new(Workflow::new("Default".to_string())));
    
    tauri::Builder::default()
        .manage(workflow_state)
        .invoke_handler(tauri::generate_handler![
            create_workflow,
            add_node,
            add_connection
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
} 