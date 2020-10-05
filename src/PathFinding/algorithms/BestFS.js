export function BestFS(grid, startNode, endNode){
    startNode.distance = 0;
    const visitedNodesInOrder = [],
        stack = [startNode];

    while (!!stack.length) {
        
        sortNodesByDistance(stack);
        const currentNode = stack.shift();

        if (currentNode.distance === Infinity) break;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === endNode) break;
        
        const neigbors = getUnvisitedNeighbors(currentNode, grid);
        for(let i = 0; i < neigbors.length; i++){
            neigbors[i].previousNode = currentNode;
            neigbors[i].isVisited = true;
            neigbors[i].distance = heuristic(neigbors[i], endNode);
            stack.push(neigbors[i]);
        }

    }

    return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => (nodeA.distance) - (nodeB.distance));
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
  }

//Im basing the heuristic of the distance from the node Im 
//looking at to where its trying to go
function heuristic(node, endNode){
    let dist = 0;

    dist += Math.abs(node.col - endNode.col);
    dist += Math.abs(node.row - endNode.row);

    return dist;
}