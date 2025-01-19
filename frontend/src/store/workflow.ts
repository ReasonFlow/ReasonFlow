import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/tauri';
import type { Node, Connection, Workflow } from '../types/workflow';

interface WorkflowState {
    workflow: Workflow | null;
    createWorkflow: (name: string) => Promise<void>;
    addNode: (nodeType: string) => Promise<void>;
    addConnection: (
        sourceNode: string,
        sourcePort: string,
        targetNode: string,
        targetPort: string
    ) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
    workflow: null,

    createWorkflow: async (name: string) => {
        try {
            const workflowId = await invoke<string>('create_workflow', { name });
            set({ workflow: { id: workflowId, name, nodes: [], connections: [] } });
        } catch (error) {
            console.error('Failed to create workflow:', error);
        }
    },

    addNode: async (nodeType: string) => {
        try {
            const nodeId = await invoke<string>('add_node', { nodeType });
            set((state) => {
                if (!state.workflow) return state;
                const newNode: Node = {
                    id: nodeId,
                    nodeType,
                    inputs: [],
                    outputs: [],
                    position: { x: 0, y: 0 },
                    config: null,
                };
                return {
                    workflow: {
                        ...state.workflow,
                        nodes: [...state.workflow.nodes, newNode],
                    },
                };
            });
        } catch (error) {
            console.error('Failed to add node:', error);
        }
    },

    addConnection: async (
        sourceNode: string,
        sourcePort: string,
        targetNode: string,
        targetPort: string
    ) => {
        try {
            const connectionId = await invoke<string>('add_connection', {
                sourceNode,
                sourcePort,
                targetNode,
                targetPort,
            });
            set((state) => {
                if (!state.workflow) return state;
                const newConnection: Connection = {
                    id: connectionId,
                    sourceNode,
                    sourcePort,
                    targetNode,
                    targetPort,
                };
                return {
                    workflow: {
                        ...state.workflow,
                        connections: [...state.workflow.connections, newConnection],
                    },
                };
            });
        } catch (error) {
            console.error('Failed to add connection:', error);
        }
    },
})); 