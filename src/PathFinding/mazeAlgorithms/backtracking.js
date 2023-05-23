export function backtrackingGenerator(grid, width, height, animations) {
    /* 
    // In this algorithm the current node will look for valid neigbors
    // upon finding one it will set it as a wall and set this node as 
    // the current node if no neighbors are found the current node will
    // backtrack, looking for a new valid neigbor untill it either finds 
    // one or becomes the starting node again
    */
    //fill grid with walls
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (!grid[row][col].isStart && !grid[row][col].isFinish) {
                grid[row][col].isWall = true;
            }
        }
    }

    let [scol, srow] = [Math.floor(width / 2), Math.floor(height / 2)]

    //starting node
    grid[srow][scol].isWall = false;
    let track = [grid[srow][scol]];

    while (track.length !== 0) {
        let currentNode = track[track.length - 1];
        let [crow, ccol] = [currentNode.row, currentNode.col];

        //get list of potential neigbors
        let neigbors = findNeighbors(crow, ccol, grid);

        if (neigbors === undefined || neigbors.length === 0) {
            track.pop();
        } else {
            //new row, new col
            let [nrow, ncol] = [neigbors[0].row, neigbors[0].col];
            //gap row, gap col
            let [grow, gcol] = [Math.floor((nrow + crow) / 2), Math.floor((ncol + ccol) / 2)];

            //do gap animation first
            if (!grid[grow][gcol].isStart && !grid[grow][gcol].isFinish) {
                grid[grow][gcol].isWall = false;
                animations.push(grid[grow][gcol]);
            }

            //end aniamtion
            if (!grid[nrow][ncol].isStart && !grid[nrow][ncol].isFinish) {
                grid[nrow][ncol].isWall = false;
                animations.push(grid[nrow][ncol]);
            }
            track.push(grid[nrow][ncol]);
        }
    }
}

function findNeighbors(row, col, grid) {
    let ns = [];

    //finds neigbors 2 spaces away to prevent over impossible to solve mazes
    if (row > 3 && grid[row - 2][col].isWall) {
        ns.push(grid[row - 2][col]);
    }
    if (row < grid.length - 2 && grid[row + 2][col].isWall) {
        ns.push(grid[row + 2][col]);
    }
    if (col > 3 && grid[row][col - 2].isWall) {
        ns.push(grid[row][col - 2]);
    }
    if (col < grid[0].length - 4 && grid[row][col + 2].isWall) {
        ns.push(grid[row][col + 2]);
    }

    //randomizes the neighbors array
    return shuffle(ns);
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}