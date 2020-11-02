import React from 'react'
import Node from './Node/Node'
import './PathFinding.css'
import { Alert, Navbar, Collapse, Nav, Button, Form } from 'react-bootstrap'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { dijkstra } from './algorithms/dijkstra'
import { aStar } from './algorithms/aStar'
import { BFS } from './algorithms/breadthFirstSearch'
import { DFS } from './algorithms/depthFirstSearch'
import { BestFS } from './algorithms/BestFS'
import { recursiveMazeDivision } from './mazeAlgorithms/recursiveDivsion'
import { backtrackingGenerator } from './mazeAlgorithms/backtracking'

let START_NODE_ROW = 0,
    START_NODE_COL = 0,
    END_NODE_ROW = 0,
    END_NODE_COL = 0,
    NODES_IN_COL = Math.floor(window.innerWidth/25)-2,
    NODES_IN_ROW = Math.floor((window.innerHeight-200)/25)-1;

export default class PathFinding extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: [],
            mouseIsPressed: false,
            disableBtn: false,
        };
    }

    componentDidMount(){
        this.initializeGrid(NODES_IN_COL, NODES_IN_ROW);
    }

    initializeGrid(width, height){
        const grid = [];

        START_NODE_ROW = Math.floor(height/2);
        START_NODE_COL = Math.floor(width/4);
        END_NODE_ROW = Math.floor(height/2);
        END_NODE_COL = Math.floor(width/4)*3;
              
        for (let row = 0; row < height; row++) {
            const currentRow = [];
            for (let col = 0; col < width; col++) {
                currentRow.push(this.createNode(col, row, false));
            }
            grid.push(currentRow);
        }

        this.setState({grid});
    }

    resizeGrid(){
        NODES_IN_COL = Math.floor(window.innerWidth/25)-2;
        NODES_IN_ROW = Math.floor((window.innerHeight-200)/25)-1;

        this.initializeGrid(NODES_IN_COL, NODES_IN_ROW);
    }

    // *** MOUSE ***
    handleMouseDown(row, col) {
        //disable walls while animations are running
        if(!this.state.disableBtn){
        
            this.setState({mouseIsPressed: true});
            
            let node = document.getElementById(`node-${row}-${col}`)
            const nodeType = node.classList[node.classList.length - 1];

            if(nodeType === "node-wall"){
                node.className = 'node';
            } else{
                node.className = 'node node-wall';
            }
        }
    }
    
    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        
        let node = document.getElementById(`node-${row}-${col}`)
        const nodeType = node.classList[node.classList.length - 1];
        if(nodeType === "node-wall"){
            node.className = 'node';
        } else{
            node.className = 'node node-wall';
        }
    }
    
    handleMouseUp() {
        //I set grid once the user is done as opposed to setting the 
        //grid everytime a node gets turned to a wall
        this.setGrid();
        this.setState({mouseIsPressed: false});
    }

    // *** ANIMATION ***
    animatePathFinding(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            //After the algorithm has been visualised I then visualise the shortest path
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            //Visualizing the algorithm
            setTimeout(() => {
                const node = visitedNodesInOrder[i];

                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';

            }, 10 * i);
        }
    }
    
    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                if(i === nodesInShortestPathOrder.length-1){
                    this.setState({disableBtn: false});
                }

                const node = nodesInShortestPathOrder[i];

                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
                
            }, 50 * i);
        }
    }

    animateMazeBuilding(animations, grid, inverted){
        for (let i = 0; i < animations.length; i++) {
            setTimeout(() => {
                if(i === 0){
                    this.setState({disableBtn: true});
                } else if(i === animations.length-1){
                    this.setState({disableBtn: false});
                }

                const node = animations[i];

                if(!inverted){
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-wall';
                } else {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node';
                }

                //have to set it once it's done so animaions will go off
                if(node === animations[animations.length-1]) this.setState({grid});
                
            }, 20 * i);
        }
    }

    getShortestPath(endNode) {

        const nodesInShortestPathOrder = [];
        let currentNode = endNode;
        while (currentNode !== null) {
          //Adds new item to beginning of the array
          nodesInShortestPathOrder.unshift(currentNode);
          currentNode = currentNode.previousNode;
        }
      
        return nodesInShortestPathOrder;
    }

    visualiseRecursiveMaze(){
        //prepare board for maze
        this.clearGrid();

        const { grid } = this.state,
              [width, height] = [NODES_IN_COL, NODES_IN_ROW],
              animations = this.animateOuterWalls(width, height);

        //adds more annimations to the array
        recursiveMazeDivision(grid, 1, 1, width-2, height-2, animations);

        this.animateMazeBuilding(animations, grid, false);
    }

    visualiseBacktrackingGenerator(){
        //prepare board for maze
        this.clearGrid();

        const { grid } = this.state,
              [width, height] = [NODES_IN_COL, NODES_IN_ROW],
              animations = [];

        this.gridWallFill();

        backtrackingGenerator(grid, width, height, animations);

        this.animateMazeBuilding(animations, grid, true);
    }

    animateOuterWalls(w, h){
        const { grid } = this.state;

        const animations = [];

        for(let i = 0; i < h; i++){
            if(i === 0 || i === h-1){
                for(let j = 0; j < w; j++){
                    animations.push(grid[i][j]);
                    grid[i][j].isWall = true;
                }
            } else {
                animations.push(grid[i][0]);
                animations.push(grid[i][w-1]);
                grid[i][0].isWall = true;
                grid[i][w-1].isWall = true;
            }
        }

        return animations
    }

    // *** BOARD SETTINGS ***
    clearGrid(){
        const {grid} = this.state;

        for(let row = 0; row < grid.length; row++){
            for(let col = 0; col < grid[row].length; col++){

                const node = document.getElementById(`node-${row}-${col}`)
                if(grid[row][col].isStart){
                    node.className = 'node node-start';
                } else if(grid[row][col].isFinish){
                    node.className = 'node node-finish';
                } else {
                    node.className ='node';
                }
            }
        }
        
        this.initializeGrid(NODES_IN_COL, NODES_IN_ROW);
    }

    clearVisitedNodes(){
        const {grid} = this.state;

        for(let row = 0; row < grid.length; row++){
            for(let col = 0; col < grid[row].length; col++){

                //the onscreen node that the user can see
                const node = document.getElementById(`node-${row}-${col}`)

                //the node behind the scene
                //resetting node
                grid[row][col].previousNode = null;
                grid[row][col].isVisited = false;
                grid[row][col].distance = Infinity;
                
                if(grid[row][col].isStart){
                    node.className = 'node node-start';
                } else if(grid[row][col].isFinish){
                    node.className = 'node node-finish';
                }
                else if(!grid[row][col].isWall){
                    node.className = 'node';
                }
            }
        }
        
        this.setState({grid});
    }

    gridWallFill(){
        const {grid} = this.state;
        
        for(let row = 0; row < NODES_IN_ROW; row++){
             for(let col = 0; col < NODES_IN_COL; col++){
                if(!grid[row][col].isStart && !grid[row][col].isFinish){
                    const node = document.getElementById(`node-${row}-${col}`)
                    node.className = 'node node-wall';
                }
             }
        }
    }

    createNode(col, row, iswall){
        return {
            col,
            row,
            isStart: row === START_NODE_ROW && col === START_NODE_COL,
            isFinish: row === END_NODE_ROW && col === END_NODE_COL,
            distance: Infinity,
            isVisited: false,
            isWall: iswall,
            previousNode: null,
        };
    };

    setGrid(){
        const grid = [];

        for(let row = 0; row < NODES_IN_ROW; row++){
            const currentRow = [];
             for(let col = 0; col < NODES_IN_COL; col++){
                
                const idName = "node-"+row.toString()+"-"+col.toString();
                let node = document.getElementById(idName);

                const classList = node.classList;
                //the last class is what type of node it is
                const nodeType = classList[classList.length - 1];

                if(nodeType === "node-wall"){
                    currentRow.push(this.createNode(col, row, true));
                } else {
                    currentRow.push(this.createNode(col, row, false));
                }
            }
            grid.push(currentRow);
        }
        
        this.setState({grid});
    }

    selectAlgorithm(){
        const algorithm = document.getElementById('algorithmSelect').value;

        if(algorithm !== "Pick an algorithm"){
            this.clearVisitedNodes();

            //Gets variables
            const { grid } = this.state,
                startNode = grid[START_NODE_ROW][START_NODE_COL],
                endNode = grid[END_NODE_ROW][END_NODE_COL];
            
            let visitedNodesInOrder = null,
                nodesInShortestPathOrder = null;

            //Reduces some initial lag
            this.setState({disableBtn: true});

            if(algorithm === "Dijkstra"){

                visitedNodesInOrder = dijkstra(grid, startNode, endNode);

            } else if(algorithm === "A*"){
                
                visitedNodesInOrder = aStar(grid, startNode, endNode);

            } else if(algorithm === "Breadth-First-Search"){
                
                visitedNodesInOrder = BFS(grid, startNode, endNode);

            } else if(algorithm === "Depth-First-Search"){
                
                visitedNodesInOrder = DFS(grid, startNode, endNode);

            } else if(algorithm === "Best-First-Search"){
                
                visitedNodesInOrder = BestFS(grid, startNode, endNode);

            }

            nodesInShortestPathOrder = this.getShortestPath(endNode);

            this.animatePathFinding(visitedNodesInOrder, nodesInShortestPathOrder)
        }
    }

    selectMazeAlgorithm(){
        const algorithm = document.getElementById('mazeAlgorithmSelect').value;

        this.clearGrid();
        
        if(algorithm === "Recursive Maze Division"){
            this.visualiseRecursiveMaze();
        } else if(algorithm === "Backtracking"){
            this.visualiseBacktrackingGenerator();
        } else if(algorithm === "Kruskal"){
            this.gridWallFill();
        }
    }

    moveNode(node){
        console.log(node);
    }

    render(){
        const { grid, disableBtn } = this.state;

        return(
        <>
            <style type="text/css">
                {`
                body{
                    background-color: #242582;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3Ccircle stroke='%23ff2b54' vector-effect='non-scaling-stroke' id='a' fill='none' stroke-width='6' r='315'/%3E%3Cuse id='f' href='%23a' stroke-dasharray='100 100 100 9999'/%3E%3Cuse id='b' href='%23a' stroke-dasharray='250 250 250 250 250 9999'/%3E%3Cuse id='e' href='%23a' stroke-dasharray='1000 500 1000 500 9999'/%3E%3Cuse id='g' href='%23a' stroke-dasharray='1500 9999'/%3E%3Cuse id='h' href='%23a' stroke-dasharray='2000 500 500 9999'/%3E%3Cuse id='j' href='%23a' stroke-dasharray='800 800 800 800 800 9999'/%3E%3Cuse id='k' href='%23a' stroke-dasharray='1200 1200 1200 1200 1200 9999'/%3E%3Cuse id='l' href='%23a' stroke-dasharray='1600 1600 1600 1600 1600 9999'/%3E%3C/defs%3E%3Cg transform='translate(1000 750)' %3E%3Cg transform='rotate(0 0 0)' %3E%3Ccircle fill='%23ff2b54' r='10'/%3E%3Cg transform='rotate(0 0 0)'%3E%3Cuse href='%23f' transform='scale(.1) rotate(50 0 0)' /%3E%3Cuse href='%23f' transform='scale(.2) rotate(100 0 0)' /%3E%3Cuse href='%23f' transform='scale(.3) rotate(150 0 0)' /%3E%3C/g%3E%3Cg transform='rotate(0 0 0)'%3E%3Cuse href='%23b' transform='scale(.4) rotate(200 0 0)' /%3E%3Cuse href='%23z' transform='scale(.5) rotate(250 0 0)' /%3E%3C/g%3E%3Cg id='z' transform='rotate(0 0 0)'%3E%3Cg transform='rotate(0 0 0)'%3E%3Cuse href='%23b'/%3E%3Cuse href='%23b' transform='scale(1.2) rotate(90 0 0)' /%3E%3Cuse href='%23b' transform='scale(1.4) rotate(60 0 0)' /%3E%3Cuse href='%23e' transform='scale(1.6) rotate(120 0 0)' /%3E%3Cuse href='%23e' transform='scale(1.8) rotate(30 0 0)' /%3E%3C/g%3E%3C/g%3E%3Cg id='y' transform='rotate(0 0 0)'%3E%3Cg transform='rotate(0 0 0)'%3E%3Cuse href='%23e' transform='scale(1.1) rotate(20 0 0)' /%3E%3Cuse href='%23g' transform='scale(1.3) rotate(-40 0 0)' /%3E%3Cuse href='%23g' transform='scale(1.5) rotate(60 0 0)' /%3E%3Cuse href='%23h' transform='scale(1.7) rotate(-80 0 0)' /%3E%3Cuse href='%23j' transform='scale(1.9) rotate(100 0 0)' /%3E%3C/g%3E%3C/g%3E%3Cg transform='rotate(0 0 0)'%3E%3Cg transform='rotate(0 0 0)'%3E%3Cg transform='rotate(0 0 0)'%3E%3Cuse href='%23h' transform='scale(2) rotate(60 0 0)'/%3E%3Cuse href='%23j' transform='scale(2.1) rotate(120 0 0)'/%3E%3Cuse href='%23j' transform='scale(2.3) rotate(180 0 0)'/%3E%3Cuse href='%23h' transform='scale(2.4) rotate(240 0 0)'/%3E%3Cuse href='%23j' transform='scale(2.5) rotate(300 0 0)'/%3E%3C/g%3E%3Cuse href='%23y' transform='scale(2) rotate(180 0 0)' /%3E%3Cuse href='%23j' transform='scale(2.7)'/%3E%3Cuse href='%23j' transform='scale(2.8) rotate(45 0 0)'/%3E%3Cuse href='%23j' transform='scale(2.9) rotate(90 0 0)'/%3E%3Cuse href='%23k' transform='scale(3.1) rotate(135 0 0)'/%3E%3Cuse href='%23k' transform='scale(3.2) rotate(180 0 0)'/%3E%3C/g%3E%3Cuse href='%23k' transform='scale(3.3) rotate(225 0 0)'/%3E%3Cuse href='%23k' transform='scale(3.5) rotate(270 0 0)'/%3E%3Cuse href='%23k' transform='scale(3.6) rotate(315 0 0)'/%3E%3Cuse href='%23k' transform='scale(3.7)'/%3E%3Cuse href='%23k' transform='scale(3.9) rotate(75 0 0)'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                    background-attachment: fixed;
                    background-repeat: no-repeat;
                    background-size: cover;
                }
                
                .btn-outline-custom {
                    color: #F64C72;
                    border-color: #F64C72;
                }

                .btn-outline-custom:hover, .btn-outline-custom:active, .btn-outline-custom:visited{
                    color: #FFF;
                    background-color: #F64C72;
                }

                .bg-dark-purple{
                    background-color: #2F2FA2;
                }

                .navbar-brand{
                    color: #FFF!important;
                }
                `}
            </style>
            <DndProvider backend={HTML5Backend}>
                
                <Navbar collapseOnSelect expand="lg" bg="dark-purple" >
                    <Navbar.Brand href="#home">Billy Dyball</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="navbar-collapse d-flex flex-md-row">

                            <Form.Control 
                                as="select" 
                                id="mazeAlgorithmSelect" 
                                disabled={disableBtn}
                                onChange={() => this.selectMazeAlgorithm()}
                                className="p-0 mr-2 my-1"
                                style={{width: "unset"}}
                            >
                                <option value="" disabled selected>Maze Algorithms</option>
                                <option>Recursive Maze Division</option>
                                <option>Backtracking</option>
                                <option>Kruskal</option>
                            </Form.Control>

                            <Form.Control 
                                as="select" 
                                id="algorithmSelect" 
                                disabled={disableBtn}
                                className="p-0 my-1"
                                style={{width: "unset"}}
                            >
                                <option value="" disabled selected>Search Algorithms</option>
                                <option>A*</option>
                                <option>Breadth-First-Search</option>
                                <option>Best-First-Search</option>
                                <option>Depth-First-Search</option>
                                <option>Dijkstra</option>
                            </Form.Control>
                                    
                            <Button variant="outline-custom"
                                onClick={() => this.selectAlgorithm()} 
                                id="btnSort"
                                disabled={disableBtn}
                                className="my-1">Search</Button>

                            <Button variant="outline-custom"
                                onClick={() => this.clearGrid()} 
                                disabled={disableBtn}
                                className="my-1">Clear Board</Button>
                                
                            <Button variant="outline-custom"
                                onClick={() => this.clearVisitedNodes()} 
                                disabled={disableBtn}
                                className="my-1">clear Visited Nodes</Button>

                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <div className="col bg-danger">
                    <div className="container">
                        <div className="row">
                            <div className="title mx-auto text-center">Key</div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                Node
                            </div>
                            <div className="col-4">
                                Wall
                            </div> 
                            <div className="col-4">
                                Shortestpath
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid mx-auto">
                    {grid.map((row, rowIdx) => {
                        return (
                        <div 
                            key={rowIdx} 
                            style={{ width: 25*row.length,
                                    height: 25,
                            }}>
                            {row.map((node, nodeIdx) => {
                                const { row, col, isFinish, isStart, isWall } = node;
                                return (
                                    <Node
                                    key={nodeIdx}
                                    row={row}
                                    col={col}
                                    isFinish={isFinish}
                                    isStart={isStart}
                                    isWall={isWall}
                                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                    onMouseEnter={(row, col) =>
                                        this.handleMouseEnter(row, col)
                                    }
                                    onMouseUp={() => this.handleMouseUp()}
                                    handleDrop={(node) => this.moveNode(node)}></Node>
                                );
                            })}
                        </div>
                        );
                    })}
                </div>
            </DndProvider>
        </>
        );
    }
}