export function kruskal(grid, width, height, animations) {
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (!grid[row][col].isStart || !grid[row][col].isFinish) {
                grid[row][col].isWall = true;
            }
        }
    }
}
