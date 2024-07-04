// TopologyDiagram.tsx

import React from 'react';
import { NetworkDiagram } from 'react-network-diagrams';


// Define your topology data structure
const nodes = [
    { id: 'node1', type: 'host', x: 100, y: 100, label: 'Node 1' },
    { id: 'node2', type: 'switch', x: 300, y: 100, label: 'Node 2' },
    { id: 'node3', type: 'host', x: 500, y: 100, label: 'Node 3' },
];

const links = [
    { id: 'link1', source: 'node1', target: 'node2', label: 'Link 1-2' },
    { id: 'link2', source: 'node2', target: 'node3', label: 'Link 2-3' },
];

const TopologyDiagram: React.FC = () => {
    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            <NetworkDiagram
                width={800}
                height={400}
                nodes={nodes}
                links={links}
                nodeSize={30}
                linkShape="curve"
                snapGrid={[10, 10]}
                onNodeClick={(nodeId: string) => console.log('Clicked on node:', nodeId)}
            />
        </div>
    );
};

export default TopologyDiagram;
