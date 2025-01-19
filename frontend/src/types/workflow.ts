export type DataType = 'String' | 'Number' | 'Boolean' | 'Array' | 'Object' | 'Any';

export interface Port {
    id: string;
    portType: string;
    name: string;
    dataType: DataType;
}

export interface Position {
    x: number;
    y: number;
}

export interface Node {
    id: string;
    nodeType: string;
    inputs: Port[];
    outputs: Port[];
    position: Position;
    config: any;
}

export interface Connection {
    id: string;
    sourceNode: string;
    sourcePort: string;
    targetNode: string;
    targetPort: string;
}

export interface Workflow {
    id: string;
    name: string;
    nodes: Node[];
    connections: Connection[];
} 