import React, { useState, useEffect } from 'react';
import Navbar from './../Navbar.js';
import "./Graphs_page.css"
import Footer from '../Footer.js';
import { string } from 'mathjs';

function create_nodes(num) {
    var nodes = []
    for (let i = 1; i <= num; i++) {
        nodes.push({id : i, label : string(i)})
    }
    return nodes
}

function Graphs_page() {

    const [nodeCount, setNodeCount] = useState(1)

    const [nodes, setNodes] = useState(
        [{ id: 1, label: string(1) }]
    )
    const [edges, setEdges] = useState(
        []
    )
    
    const [graph, setGraph] = useState({
        nodes: nodes,
        edges: edges
    })

    const [options, setOptions] = useState({
        autoResize: true, 
        height: '100%',
        width: '100%',
        layout: {
            hierarchical:false,
            randomSeed: 7
        },
        physics: {
            stabilization: {
                enabled: true,
                updateInterval:1,
                fit: true
            },
            timestep: 1,
            repulsion: {
                nodeDistance:0,
                springLength:0,
                springConstant:0,
                damping: 0
            }
        }
    })

    useEffect(() => {
        setNodes(create_nodes(nodeCount))
        setGraph({nodes:nodes,edges:edges})
      }, [nodeCount])

    useEffect(() => {
        setGraph({nodes:nodes,edges:edges})
        setOptions(options)
      }, [nodes, edges])

    return (
        <div>
            <Navbar/>
            <div id = "Info">
                <p>This page is currently under construction</p>
            </div>
            <div id = "GraphConfig">
                <p>Nodes</p>
                <button onClick={() => (nodeCount < 10 ? setNodeCount(nodeCount + 1): setNodeCount(nodeCount))}>+</button>
                <button onClick={() => (nodeCount > 1 ? setNodeCount(nodeCount - 1): setNodeCount(nodeCount))}>-</button>
                <p>{nodeCount}</p>
            </div>
            <div id = "Graph">
            </div>
            <Footer/>
        </div>
    )
}

export default Graphs_page;