import React, { useState, useRef, useCallback } from 'react';

import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import './index.css';
import 'reactflow/dist/style.css';

const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'input node' },
        position: { x: 250, y: 5 },
    },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    //Background
    const [variant, setVariant] = useState('dots')

    const [selectedNodeId, setSelectedNodeId] = useState(null);
    //Delete Node
    const handleDelete = () => {
        const updatedNodes = nodes.filter((node) => node.id !== selectedNodeId);
        setNodes(updatedNodes);
        setSelectedNodeId(null);
    };

    const [selectedEdgeId, setSelectedEdgeId] = useState(null);
    const onEdgeClick = (event, edge) => {
        setSelectedEdgeId(edge.id); // Store the selected edge ID
    };
    
    const handleDeleteEdge = () => {
        if (selectedEdgeId) {
            const updatedEdges = edges.filter((edge) => edge.id !== selectedEdgeId);
            setEdges(updatedEdges);
            setSelectedEdgeId(null);
        }
    };
    
    //Update node
    const [isEditing, setisEditing] = useState(false);
    const [editvalue, setEditvalue] = useState(nodes.data);
    const [id, setId] = useState();

    //function for edit title
    const onNodeClick = (e, val) => {
        setEditvalue(val.data.label);
        setId(val.id);
        setisEditing(true);
        setSelectedNodeId(val.id);
    }
    //handle change function
    const handleChange = (e) => {
        e.preventDefault(e.target.value);
        setEditvalue(e.target.value);
    }

    const handleEdit = () => {
        const res = nodes.map((item) => {
            if (item.id === id) {
                item.data = {
                    ...item.data,
                    label: editvalue,
                }
            }
            return item;
        })
        setNodes(res);
        setEditvalue('');
        setisEditing(false);
    }

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance],
    );
    const handleCancel = () => {
        setisEditing(false);
        setEditvalue('');
    }

    

    return (
        <div className="dndflow">
            {isEditing && (
                <div className="updatenode_controls">
                    <label>
                        label:
                    </label><br />
                    <input type='text' value={editvalue} onChange={handleChange} /><br />
                    <button className='btn' onClick={handleEdit}>Update</button><br />
                    <button className='btn' onClick={handleCancel}>Cancel</button><br/>
                    <button className='btn' onClick={handleDelete}>Delete Node</button><br/>
                    <button className='btn' onClick={handleDeleteEdge}>Delete Edge</button><br/>
                </div>
            )}
          
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodeClick={(e, val) => onNodeClick(e, val)}
                        onEdgeClick={(e,edge)=> onEdgeClick(e,edge)}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <Background color='blue' variant={variant} />
                        <Controls />     
                    </ReactFlow>
                </div>
                <Sidebar />
            </ReactFlowProvider>
            
        </div>
    );
};

export default DnDFlow;