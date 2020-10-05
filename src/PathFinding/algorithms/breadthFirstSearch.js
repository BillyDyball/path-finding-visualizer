export function BFS(grid, startNode, endNode) {
    startNode.isVisited = true;

    const stack = [startNode],
        visitedNodesInOrder = [];

    while(stack[0] !== undefined){
        const currentNode = stack.shift();
        
        visitedNodesInOrder.push(currentNode); //for animations

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
    if (row > 0) neighbors.push(grid[row - 1][col]); //UP
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); //DOWN
    if (col > 0) neighbors.push(grid[row][col - 1]); //LEFT
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); //RIGHT
    return neighbors.filter(neighbor => (!neighbor.isVisited && !neighbor.isWall));
}