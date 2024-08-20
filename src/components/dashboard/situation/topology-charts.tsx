import React from 'react';
import { TrafficMap } from 'react-network-diagrams'; // Ensure correct import statement

const topology = {
    "description": "Simple topo",
    "name": "simple",
    "nodes": [
        {
            "label_dx": null,
            "label_dy": null,
            "label_position": "top",
            "name": "Node1",
            "type": "esnet_site",
            "x": 100,
            "y": 20,
        },
        {
            "label_dx": null,
            "label_dy": null,
            "label_position": "top",
            "name": "Node2",
            "site": 5,
            "type": "esnet_site",
            "x": 50,
            "y": 80,
        },
        {
            "label_dx": null,
            "label_dy": null,
            "label_position": "top",
            "name": "Node3",
            "site": 5,
            "type": "hub",
            "x": 150,
            "y": 80,
        },
        {
            "label_dx": null,
            "label_dy": null,
            "label_position": "top",
            "name": "Node4",
            "site": 5,
            "type": "hub",
            "x": 190,
            "y": 90,
        }
    ],
    "edges": [
        {
            "capacity": "100G",
            "source": "Node1",
            "target": "Node2"
        },
        {
            "capacity": "40G",
            "source": "Node2",
            "target": "Node3"
        },
        {
            "capacity": "10G",
            "source": "Node3",
            "target": "Node1"
        }
    ]
};

const edgeColorMap = [
    { color: "#990000", label: ">=50 Gbps", range: [50, 100] },  // GBps
    { color: "#bd0026", label: "20 - 50", range: [20, 50] },
    { color: "#cc4c02", label: "10 - 20", range: [10, 20] },
    { color: "#016c59", label: "5 - 10", range: [5, 10] },
    { color: "#238b45", label: "2 - 5", range: [2, 5] },
    { color: "#3690c0", label: "1 - 2", range: [1, 2] },
    { color: "#74a9cf", label: "0 - 1", range: [0, 1] }
];

const TopologyDiagram: React.FC = () => {
    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            <TrafficMap
                bounds={{ x1: 0, y1: 0, x2: 200, y2: 150 }}
                topology={topology}
                edgeColorMap={edgeColorMap}
                edgeDrawingMethod="bidirectionalArrow" />

        </div>
    );
};

export default TopologyDiagram;
