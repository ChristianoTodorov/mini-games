
var grid = [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]];
/** Copying an array vertically
 * @param {2DArray} grid array to copy from vertically
 * @returns copied vertical version of the given array
 */
function copyArrayVertical(grid) {
    if(!(grid[0] instanceof Array) || !(grid instanceof Array)) {
        throw new Error("Invalid argument");
    }
    let gridCopy = new Array();
    for(let i = 0;i<grid.length;i++){
        let arr = new Array();
        for(let j = 0;j<grid.length;j++){
            arr.push(grid[j][i]);
        }
        gridCopy.push(arr);
    }
    return gridCopy;
}

/** Function find out if the player is able to move the squares
 * @param {Array} grid array in which the boxes that are being moved are
 * @param {string} dir direction of the movement
 * @returns boolean value true or false 
 */
function movementPossible(grid, dir) {
    const dirsHoriz = ['left', 'right'];                                         
    const dirsVert = ['up', 'down'];
    if (!dirsHoriz.includes(dir)&&!dirsVert.includes(dir)) {
        throw new Error("Invalid direction");
    }
    if(!(grid instanceof Array)){
        throw new Error("Invalid grid");
    }
    let vertical = copyArrayVertical(grid);                                                                                         
    for (let j = 0; j < grid.length; j++) {
        let found0 = false;
        let search = null;
        if(dirsVert.includes(dir)){
            search = dir==='up' ? vertical[j] : [...vertical[j]].reverse();
        }else{
            search = dir==='left' ? grid[j] : [...grid[j]].reverse();
        }
        for (let i = 0;i<grid.length; i++) {
            if(i>0){
               if(search[i]===search[i-1]&&search[i]!=0){
                   return true;
                } 
            }
            if (found0 && search[i] != 0) {
                return true;
            }
            if (search[i] === 0) {
                found0 = true;
            }
        }
    }
    return false;
}

/**Changing the color of the box according to its value
 * @param {Object} box the box object required to change it's color
 * @returns color in hex code
 */
function updateColor(box) {
    if(typeof box!=='object' || (typeof box.value!== 'string'&&typeof box.value!== 'number')){
        throw new Error("Invalid argument");
    }
    const colors = ['#eee1c9', '#f3b27a', '#f69664', '#f77c5f',
        '#f75f3b', '#edd073', '#edcc62', '#edc950', '#edc53f', '#edc22e','#edb32f'];
    if (box.value > 2048) return;
    if(box.value==4){
        box.dom.style.color = 'white';
    }
    let count = 0;
    do {
        count++;
    } while (Math.pow(2, count) != box.value * 2);
    return colors[count - 2];
}
/**Function finds the object with the specified index x and y 
 * in the array boxes
 * @param {number} x 
 * @param {number} y 
 * @param {Array} boxes 
 * @returns 
 */
function findBoxOnIndex(x, y, boxes) {
    if(typeof x !== 'number' || typeof y !== 'number' || !(boxes instanceof Array) || boxes.length==0){
        throw new Error("Invalid argument");
    }
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].x == x && boxes[i].y == y) {
            return boxes[i];
        }
    }
    return null;
}
/**
 * Updating the values in the array grid with new values
 */
function updateGrid() {
    grid = [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]];
    for (let i = 0; i < boxes.length; i++) {
        grid[boxes[i].y][boxes[i].x] = boxes[i].value;
    }
}
/**Increasing the value of a combined box
 * and deleting the other box that has combined
 * @param {HTMLDivElement} boxIncrease  multiply its value by 2
 * @param {HTMLDivElement} boxDel remove
 */
function increaseAndDelete(boxIncrease, boxDel) {
    if(typeof boxIncrease != 'object' || typeof boxDel != 'object' ){
        throw new Error("Invalid argument");
    }
    boxIncrease.dom.innerHTML = boxIncrease.value * 2;
    boxIncrease.value = boxIncrease.dom.innerHTML;
    updateScore(boxIncrease.value);
    boxDel.dom.remove();
    boxes.splice(boxes.indexOf(boxDel), 1);
    grid[boxDel.y][boxDel.x] = 0;
}
/**Combine boxes horizontally with the same values in the direction of the movement
 * @param {boolean} left direction is left if its value is true, otherwise its right
 */
function horizontalCombine(left){
    if(typeof left !== 'boolean'){
        throw new Error("Invalid argument");
    }
    for (let y = 0; y < 4; y++) {                                           
        for (let x = 0; x < 3; x++) {                                       
            if (grid[y][x] == grid[y][x + 1] && grid[y][x] != 0) {          
                var boxIncrease = null;
                var boxDel = null;
                if (left) {                                         
                    boxIncrease = findBoxOnIndex(x, y, boxes);          
                    boxDel = findBoxOnIndex(x + 1, y, boxes);           
                } else {
                    try {
                        boxIncrease = findBoxOnIndex(x + 1, y, boxes);  
                        boxDel = findBoxOnIndex(x, y, boxes);     
                        if (grid[y][x] == grid[y][x + 2] && grid[y][x] != grid[y][x + 3]) { 
                            boxIncrease = findBoxOnIndex(x + 2, y, boxes);              
                            boxDel = findBoxOnIndex(x + 1, y, boxes);                   
                        }
                    } catch (e) {}
                }
                if (boxDel.value == boxIncrease.value) {
                    boxIncrease.dom.style.backgroundColor = updateColor(boxIncrease);
                    increaseAndDelete(boxIncrease, boxDel);
                }
            }
        }
    }
}
/**Combine boxes vertically with the same values in the direction of the movement
 * @param {boolean} up direction is up if its value is true, otherwise its down
 */
function verticalCombine(up){
    if(typeof up !== 'boolean'){
        throw new Error("Invalid argument");
    }
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x++) {
            if (grid[y][x] == grid[y + 1][x] && grid[y][x] != 0) {
                var boxIncrease = null;
                var boxDel = null;
                if (up) {
                    boxIncrease = findBoxOnIndex(x, y, boxes);
                    boxDel = findBoxOnIndex(x, y + 1, boxes);
                } else {
                    try {
                        boxIncrease = findBoxOnIndex(x, y + 1, boxes);
                        boxDel = findBoxOnIndex(x, y, boxes);
                        if (grid[y][x] == grid[y + 2][x] && (grid[y + 3] == undefined || grid[y][x] != grid[y + 3][x])) {
                            boxIncrease = findBoxOnIndex(x, y + 2, boxes);
                            boxDel = findBoxOnIndex(x, y + 1, boxes);
                        }
                    } catch (e) {}
                }
                if (boxDel.value == boxIncrease.value) {
                    boxIncrease.dom.style.backgroundColor = updateColor(boxIncrease);
                    increaseAndDelete(boxIncrease, boxDel);
                }
            }
        }
    }
}
/**Check if combination of squares is possible
 * according to the direction
 * @param {*} firstDir left or up if horizontal is true or false
 * @param {*} horizontal true if direction is left or right
 */
function combine(firstDir,horizontal) {
    if(typeof horizontal !== 'boolean'){
        throw new Error("Invalid argument");
    }
    if(horizontal){
        // horizontal combination
        horizontalCombine(firstDir);
    }else{
        // vertical combination
        verticalCombine(firstDir);
    }// after combining (making a free tile), make sure every tile
    // has moved in the direction as much as possible
    switch(horizontal){
        case true: 
            if(firstDir) moveLeft();
            else moveRight();
            break;
        case false:
            if(firstDir) moveUp();
            else moveDown();
            break;
    }
}
// Count the number of boxes vertically and horizontally
function nearbyCount(x, y, Boxes) {
    if(typeof x !== 'number' || typeof y !== 'number' || !(Boxes instanceof Array) || Boxes.length == 0){
        throw new Error("Invalid argument");
    }
    let leftX = Boxes.filter(box => (parseInt(box.x) < x && parseInt(box.y) == y)).length;
    let rightX = Boxes.filter(box => (parseInt(box.x) > x && parseInt(box.y) == y)).length;
    let upY = Boxes.filter(box => (parseInt(box.y) < y && parseInt(box.x) == x)).length;
    let downY = Boxes.filter(box => (parseInt(box.y) > y && parseInt(box.x) == x)).length;
    return [leftX, rightX, upY, downY];
}
//Moving left
function moveLeft() {
    // box with the smalles index X should be first in the array
    boxes.sort((a, b) => (a.x > b.x) ? 1 : -1);
    Array.prototype.forEach.call(boxes, function (box) {
        box.x = nearbyCount(box.x, box.y, boxes)[0];
        destination = (box.x * posLength) + 15;
        box.dom.style.left = destination + "px";
    });
    updateGrid();
}
const maxPosPx = 453;
//Moving right
function moveRight() {
    boxes.sort((a, b) => (a.x < b.x) ? 1 : -1);
    Array.prototype.forEach.call(boxes, function (box) {
        box.x = 3 - nearbyCount(box.x, box.y, boxes)[1];
        destination = maxPosPx - (nearbyCount(box.x, box.y, boxes)[1] * posLength);
        box.dom.style.left = destination + "px";
    });
    updateGrid();
}
//Moving up
function moveUp() {
    boxes.sort((a, b) => (a.y > b.y) ? 1 : -1);
    Array.prototype.forEach.call(boxes, function (box) {
        box.y = nearbyCount(box.x, box.y, boxes)[2];
        destination = box.y * posLength + 15;
        box.dom.style.top = destination + "px";
    });
    updateGrid();
}
//Moving down
function moveDown() {
    boxes.sort((a, b) => (a.y < b.y) ? 1 : -1);
    Array.prototype.forEach.call(boxes, function (box) {
        box.y = 3 - nearbyCount(box.x, box.y, boxes)[3];
        destination = maxPosPx - (nearbyCount(box.x, box.y, boxes)[3] * posLength);
        box.dom.style.top = destination + "px";
    });
    updateGrid();
}
/**Handling the press of a button
 * if the button is an arrow, the direction is set to the direction of the arrow
 * @param {Event} e the event of the button press
 * @returns 
 */
function keyPressed(e) {
    var key_code = e.keyCode;
    if (game_finished) return;
    switch (key_code) {
        case 37:
            direction = 'left';
            break;
        case 38:
            direction = 'up';
            break;
        case 39:
            direction = 'right';
            break;
        case 40:
            direction = 'down';
            break;
    }
    if (key_code > 36 && key_code < 41) {
        move();
    }
}
//Function moving the boxes if the game is not over
function move() {
    gameOver(false);
    if(!movementPossible(grid,direction)) return;
    switch (direction) {
        case 'left':
            moveLeft();
            combine(true,true);
            break;
        case 'up':
            moveUp();
            combine(true,false);
            break;
        case 'right':
            moveRight();
            combine(false,true);
            break;
        case 'down':
            moveDown();
            combine(false,false);
            break;
    }
    createBox();
}
try {
    window.onkeydown = keyPressed;
} catch (e) { }
try {
    module.exports = {
        nearbyCount,
        findBoxOnIndex,
        updateColor,
        movementPossible,
        copyArrayVertical
    }
} catch (e) { }