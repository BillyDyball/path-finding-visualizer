export function BiBFS(grid, startNode, endNode) {
    startNode.isVisited = true;
    endNode.isVisited = true;

    const startNodeStack = [startNode],
        endNodeStack = [endNode],
        visitedNodesInOrder = [];

    while(stack[0] !== undefined){
        const currentStartSideNode = stack.shift();
        const currentEndSideNode = stack.shift();
        
        visitedNodesInOrder.push(currentStartSideNode); //for animations
        visitedNodesInOrder.push(currentEndSideNode);

        if(currentNode === endNode) break; 

        const neigbors = getUnvisitedNeighbors(currentNode, grid);
        for(let i = 0; i < neigbors.length; i++){
            neigbors[i].isVisited = true;
            neigbors[i].previousNode = currentNode;
            stack.push(neigbors[i]);
        }
    }

    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => (!neighbor.isVisited && !neighbor.isWall));
}