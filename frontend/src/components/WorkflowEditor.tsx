import { useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection as FlowConnection,
    Edge,
    Node as FlowNode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../store/workflow';

const WorkflowEditor = () => {
    const workflow = useWorkflowStore((state) => state.workflow);
    const addConnection = useWorkflowStore((state) => state.addConnection);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        async (connection: FlowConnection) => {
            if (
                connection.source &&
                connection.sourceHandle &&
                connection.target &&
                connection.targetHandle
            ) {
                await addConnection(
                    connection.source,
                    connection.sourceHandle,
                    connection.target,
                    connection.targetHandle
                );
                setEdges((eds) => addEdge(connection, eds));
            }
        },
        [addConnection]
    );

    return (
        <div className="w-full h-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

export default WorkflowEditor; 