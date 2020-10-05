export function recursiveMazeDivision(grid, x, y, width, height, animations){
    if (width <= 2 || height <= 2) return;

    //horizontal or vertical line
    let horizontal;

    if(width < height){
        horizontal = true;
    } else if(height < width){
        horizontal = false;
    } else {
        horizontal = getRndInteger(0, 2) ? true : false;
    }

    //direction the wall is built in
    let dx = horizontal ? 1 : 0,
        dy = horizontal ? 0 : 1;
    
    //length of wall
    let length = horizontal ? width : height;

    //where the wall will be located
    let wx = x + (horizontal ? 0 : getRndInteger(1, width-1)),
        wy = y + (horizontal ? getRndInteger(1, height-1) : 0);
    
    //where the passage will be
    let px = wx + (horizontal ? getRndInteger(0, width) : -1),
        py = wy + (horizontal ? -1 : getRndInteger(0, height));
    
    //stops wall from blocking a previous passage
    let passageBlocked = false
    if(horizontal){
        if(!grid[wy][wx+length].isWall){
            px = wx+length-1;
            passageBlocked = true;
        }
        if(!grid[wy][wx-1].isWall){
            //double blocked passage
            if(passageBlocked){
                length -= 1;
                wx += 1
            } else {
                px = wx;
            }
        }
    } else {
        if(!grid[wy+length][wx].isWall){
            py = wy+length-1;
            passageBlocked = true;
        } 
        if(!grid[wy-1][wx].isWall){
            //double blocked passage
            if(passageBlocked){
                length -= 1;
                wy += 1
            } else {
                py = wy;
            }
        }
    }

    //building wall
    for(let i = 0; i < length; i++){
        //allow a spot for a passageway
        if(wx !== px && wy !== py && !grid[wy][wx].isStart && !grid[wy][wx].isFinish){ 
            grid[wy][wx].isWall = true; 
            animations.push(grid[wy][wx]);
        }
        wx += dx;
        wy += dy;
    }

    //up and left
    let [nx, ny] = [x, y];
    let [w, h] = horizontal ? [width, wy-y] : [wx-x, height];
    //console.log([grid, nx, ny, w, h]);
    recursiveMazeDivision(grid, nx, ny, w, h, animations);

    //bottom and right
    [nx, ny] = horizontal ? [x, wy+1] : [wx+1, y];
    [w, h] = horizontal ? [width, y+height-wy-1] : [x+width-wx-1, height];
    recursiveMazeDivision(grid, nx, ny, w, h, animations);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}