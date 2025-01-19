mod engine;
mod validation;

use serde::{Deserialize, Serialize};
use async_trait::async_trait;
use uuid::Uuid;

pub use engine::{WorkflowEngine, Node, NodeData, NodePort, Workflow, Connection};
pub use validation::{ValidationError, ValidationErrorContext, format_validation_error};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Node {
    pub id: String,
    pub node_type: String,
    pub inputs: Vec<Port>,
    pub outputs: Vec<Port>,
    pub position: Position,
    pub config: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Port {
    pub id: String,
    pub port_type: String,
    pub name: String,
    pub data_type: DataType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DataType {
    String,
    Number,
    Boolean,
    Array,
    Object,
    Any,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Connection {
    pub id: String,
    pub source_node: String,
    pub source_port: String,
    pub target_node: String,
    pub target_port: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Workflow {
    pub id: String,
    pub name: String,
    pub nodes: Vec<Node>,
    pub connections: Vec<Connection>,
}

#[async_trait]
pub trait NodeExecutor {
    async fn execute(&self, inputs: serde_json::Value) -> anyhow::Result<serde_json::Value>;
}

impl Node {
    pub fn new(node_type: String) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            node_type,
            inputs: Vec::new(),
            outputs: Vec::new(),
            position: Position { x: 0.0, y: 0.0 },
            config: serde_json::Value::Null,
        }
    }
}

impl Workflow {
    pub fn new(name: String) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            nodes: Vec::new(),
            connections: Vec::new(),
        }
    }

    pub fn add_node(&mut self, node: Node) {
        self.nodes.push(node);
    }

    pub fn add_connection(&mut self, connection: Connection) {
        self.connections.push(connection);
    }
} 