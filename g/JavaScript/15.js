var positionsUsed = new Array();
var arr = new Array(15);
var game_is_over = false;
var timerChange = null;
var time = null;
var moveC = null;
const posLength = 121;

//Constructor = loading all necessary components for the web
function init(){
    moveC = document.getElementById("moves");
    const bMovesDiv = document.getElementById('Bmoves');
    bMovesDiv.innerHTML = localStorage.getItem('bestMoves');
    const bestTimeDiv = document.getElementById('Btime');
    const btime = localStorage.getItem('15bestTime');
    if(btime==null){
        bestTimeDiv.innerHTML = '--:--';
    }else{
        bestTimeDiv.innerHTML = btime;
    }

    for (let i = 0;i<15;i++){
        let randx = Math.floor(Math.random()*4);
        let randy = Math.floor(Math.random()*4);
        while(positionsUsed.includes(randx+"x"+randy)){
            randx = Math.floor(Math.random()*4);
            randy = Math.floor(Math.random()*4);
        }
        var tile = document.getElementsByClassName("box")[i];
        arr.splice((randx+randy*4),1,i+1);
        positionsUsed.push(randx+"x"+randy);
        tile.style.top = (randy*posLength)+15+"px";
        tile.style.left = (randx*posLength)+15+"px";
        tile.innerHTML = i+1;
        if((randx+randy*4)+1==i+1){
            tile.style.backgroundColor = "rgb(232, 138, 69)";
        }
    }
    // if the game is not possible to solve, site is reloaded
    if(isSolvable(arr,positionsUsed)==false){
        location.reload();
    }
    window.onkeydown = arrowsMove;
}
/**Increases the time by a second and show it on the website
 * This function is being called each second by an interval
 * @param {HTMLDivElement} timer the div element in which the time is being shown
 */
function updateTimer(timer){
    if(typeof timer!=="object"){
        throw new Error("Invalid argument");
    }
    const timerText = timer.innerHTML;
    const increase = parseInt(timerText.substring(timerText.indexOf(':')+1))+1;
    time = timerText.substring(0,timerText.indexOf(':')+1)+increase;
    var str = timer.innerHTML;
    var minutes = parseInt(timer.innerHTML.substring(0,str.indexOf(":")));
    var seconds = parseInt(timer.innerHTML.substring(str.indexOf(":")+1));
    if(seconds+1==60){
        minutes += 1;
        timer.innerHTML = minutes+":00";
    }else{
        seconds += 1;
        timer.innerHTML =  minutes+":"+seconds;
    }
}
/**Checks if the game is over
 * @returns true or false if the game is over
 */
function gameOver(){
    var boxes = document.getElementsByClassName("box");
    for(let i = 0;i<boxes.length;i++){
        if(boxes[i].style.backgroundColor != "rgb(232, 138, 69)"){
            return false;
        }
    }
    return true;
}
/**Counts the number of inversions of the current puzzle and the position of the free tile from the bottom
 * of the playing field and according to those values returns if the puzzle can be solved 
 * @param {Array} arr one dimensional array of the position of every box
 * @param {Array} posUsed positions of the boxes in the game
 * @returns boolean value true or false if the puzzle can be solved
 */
function isSolvable(arr,posUsed){
    if(!(arr instanceof Array && posUsed instanceof Array)){
        throw new Error("Invalid argument");
    }
    // index Y volného místa od konce +1
    const freeIndex = findFree(posUsed);
    var blankRow = 4-parseInt(freeIndex.substring(2,3));
    var finishedarr = new Array();
    arr = arr.filter(element => {
        return element !== undefined;
    });
    for(let i = 0;i<arr.length;i++){
        finishedarr.push(arr[i]);
    }
    finishedarr.sort((a, b) => a - b);
    // minimální počet potřebných inverzí
    var invCount = 0;
    while(arr.every((val, index) => val === finishedarr[index])==false){
        for(let i = 0;i<14;i++){
                if(arr[i]>arr[i+1]){
                    invCount += 1;
                    let swap = arr[i];
                    arr[i] = arr[i+1];
                    arr[i+1] = swap;
            }
        }
    }
    if(blankRow%2===invCount%2||invCount<70){
        return false;
    }
    return true;
}
/**Finds and returns the position that has no box on it
 * @param {Array} positions positions of the boxes in the game
 * @returns the index of the free position
 */
function findFree(positions){
    if(!(positions instanceof Array)|| positions.length==0){
        throw new Error("Invalid argument");
    }
    var found = true;
    for(let i = 0;i<4;i++){
        for(let j = 0;j<4;j++){
            for(let l = 0;l<15;l++){
                if(i+"x"+j==positions[l]){
                    found = false;
                    continue;
                }
            }
            if(found == true){
                return i+"x"+j;
            }
            found = true;
        }
    }
}
/**Changes the position of the box clicked by 11 pixels in the direction
 * of the free tile
 * @param {HTMLDivElement} box Div that has been clicked
 * @param {boolean} horiz true if the movement is horizontal
 * @param {boolean} decreasing true if the movement is to the left or up
 */
var setPosition = (box, horiz, decreasing) =>{
    if(typeof box !== "object" || typeof horiz !== "boolean" || typeof decreasing !== 'boolean'){
        throw new Error("Invalid argument");
    }
    var pos = horiz ? parseFloat(box.style.left) : parseFloat(box.style.top);
    pos = decreasing ? pos-11 : pos+11;
    if(horiz){
        box.style.left = pos+'px';
    }else{
        box.style.top = pos+'px';
    }
}
/**Saves the current time and count of moves used to finish the game
 * if they are less than what has previously been saved as best.
 * @param {string} time time to finish the game in string format
 * @param {string} moves count of moves used to finish the game
 */
function updateHighscore(time,moves){
    const bmoves = localStorage.getItem('bestMoves');
    const btime = localStorage.getItem('15bestTime');

    if(bmoves>moves||bmoves==null){
        alert('Congratulations, you\'ve gotten the least amount of moves!');
        localStorage.setItem('bestMoves',moves);
    }
    if(btime>time||btime==null){
        alert('Congratulations, you\'ve beaten your best time!');
        localStorage.setItem("15bestTime",time);
    }
}
/**Function creates an interval for the animation of the movement of the clicked box.
 * By the end of each interval, checks if the player has achieved victory
 * @param {HTMLDivElement} box the clicked box
 * @param {boolean} horiz is true if the movement is horizontal
 * @param {Integer} initialPos the position before the movement started
 * @param {Integer} decreasing direction is left or up if true
 */
var posReplace = function (box, horiz, initialPos, decreasing) {
    let i = setInterval(function(){
        let curX = parseFloat(box.style.left);
        let curY = parseFloat(box.style.top);
        if(((initialPos+110==curX||initialPos-110==curX)&&horiz)
        ||((initialPos+110==curY||initialPos-110==curY)&&!horiz)){
            if(gameOver()){
                alert("You won!\nIt took you a total of "+moveC.innerHTML+" moves and a time of "+time);
                updateHighscore(time,moveC.innerHTML);
                game_is_over = true;
                clearInterval(timerChange);
            }
            clearInterval(i);
        }
        setPosition(box,horiz,decreasing);
    },4);
}
/**Move the boxes in the direction specified
 * @param {Event} event the button press
 */
function arrowsMove(event){
    var freeX = parseInt(findFree(positionsUsed).substring(0,1));
    var freeY = parseInt(findFree(positionsUsed).substring(2,3));
    var boxes = document.getElementsByClassName("box");
    var movingBox = null;
    switch(event.keyCode){
        case 37:
            if(freeX!=3){
                Array.prototype.forEach.call(boxes, function(box){
                    if(parseInt(box.style.left)==(freeX+1)*posLength+15
                    &&(freeY*posLength+15)==parseInt(box.style.top)){
                        movingBox = box;
                    }
                });
            }
            break;
        case 38:
            if(freeY!=3){
                Array.prototype.forEach.call(boxes, function(box){
                    if(parseInt(box.style.top)==(freeY+1)*posLength+15
                    &&(freeX*posLength+15)==parseInt(box.style.left)){
                        movingBox = box;
                    }
                });
            }
            break;
        case 39:
            if(freeX!=0){
                Array.prototype.forEach.call(boxes, function(box){
                    if(parseInt(box.style.left)==(freeX-1)*posLength+15
                    &&(freeY*posLength+15)==parseInt(box.style.top)){
                        movingBox = box;
                    }
                });
            }
            break;
        case 40:
            if(freeY!=0){
                Array.prototype.forEach.call(boxes, function(box){
                    if(parseInt(box.style.top)==(freeY-1)*posLength+15
                    &&(freeX*posLength+15)==parseInt(box.style.left)){
                        movingBox = box;
                    }
                });
            }
            break;
    }
    if(movingBox!=null){
        move(movingBox);
    }
}
/**Start the timer on first click
 * and if the game is not over, find the free position and call another function to move the box in it
 * at the end color the box that moved if it moved to its correct position to finish the game or not
 * @param {HTMLDivElement} _this box clicked
 */
let firstClick = true;
function move(_this){
    if(firstClick){
        var timer = document.getElementById("time");
        timerChange = setInterval(updateTimer,1000,timer);
        firstClick = false;
    }
    if(game_is_over) return;
    var curY = Math.round((parseFloat(_this.style.top)-15)/posLength);
    var curX = Math.round((parseFloat(_this.style.left)-15)/posLength);
    var freeX = parseInt(findFree(positionsUsed).substring(0,1));
    var freeY = parseInt(findFree(positionsUsed).substring(2,3));
    var crrPos = false;
    if(curX==freeX||curY==freeY){
        var index = 20;
        if(positionsUsed.indexOf(curX+"x"+curY)!==-1){
            var index = positionsUsed.indexOf(curX+"x"+curY);
        }
        const arrFreeX = [freeX+1,freeX-1];
        const arrFreeY = [freeY+1,freeY-1];
        if(arrFreeX.includes(curX)||arrFreeY.includes(curY)){
            positionsUsed.splice(index,1);
            positionsUsed.push(freeX+"x"+freeY);
            moveC.innerHTML = parseInt(moveC.innerHTML)+1;
            crrPos = true;
        }
        switch(curX){
            case freeX-1:
                posReplace(_this, true, parseFloat(_this.style.left), false);
                break;
            case freeX+1:
                posReplace(_this, true, parseFloat(_this.style.left), true);
                break;
        }
        switch(curY){
            case freeY-1:
                posReplace(_this, false, parseFloat(_this.style.top), false);
                break;
            case freeY+1:
                posReplace(_this, false, parseFloat(_this.style.top), true);
                break;
        }
        if((freeX+freeY*4)+1==_this.innerHTML&&crrPos){
            _this.style.backgroundColor = "rgb(232, 138, 69)";
        }else if(crrPos){
            _this.style.backgroundColor = "rgb(106, 198, 184)";
        }
    }
}
try{
    window.onload = init;
}catch(e){}
try{
    module.exports = {
        findFree,
        isSolvable
        }
}catch(e){}