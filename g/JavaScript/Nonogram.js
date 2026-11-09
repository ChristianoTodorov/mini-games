let cellsReq = null;
let timer = null;
let time = null;
var size = null;
let squares = [];
let blueSquares = [];

/**Constructor for the website.
 * This function is used as soon as the page loads
 */
function init(){
    const input = prompt("Enter the size of the field\n1 > [5x5]\n 2 > [10x10]\n 3 > [15x15]\n");
    switch(parseInt(input)){
        case 1: 
            size = 5;
            break;
        case 2: 
            size = 10;
            break;
        case 3: 
            size = 15;
            break;
        default:
            size = 10;
    }
    // loading best time and starting the timer
    const pb = localStorage.getItem('bestTime_'+size);
    const pbEl = document.getElementById('pbtime');
    pbEl.innerHTML = pb;
    cellsReq = generateCells(size);
    time = document.getElementById('time');
    timer = setInterval(updateTimer,1000,time);
    loadPlayground();
}
/**
 * Function creating the playground for the website
 */
function loadPlayground(){
    const board = document.getElementById('board-container');
    switch(size){
        case 5:
            board.style.marginLeft = '35%';
            break;
        case 10:
            board.style.marginLeft = '25%';
            break;
        case 15:
            board.style.marginLeft = '15%';
            break;
    }
    const playground = document.getElementById('board');
    playground.style.width = size*50+"px";
    playground.style.height = size*50+"px";
    for (let i = 0; i < size; ++i){
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < size; ++j){
            var square = document.createElement('div');
            square.className = 'square';
            square.id = j+'x'+i;
            row.appendChild(square);
            squares.push(square);
            square.addEventListener('click',fillBox,false);
        }
        playground.appendChild(row);
    }
    createNumbers(size);
}
/** Function coloring the square that has just been clicked
 *  and checking if the player just filled the final required square to win
 * @param {HTMLDivElement} div is the html element (div) that has just been clicked
 */
function fillBox(div){
    if(typeof div != 'object'){
        return new Error('Invalid argument');
    }
    const thisCell = div.currentTarget;
    let cellBG = thisCell.style.backgroundColor;
    if(thisCell.style.backgroundImage == "url(\"SVG/xxx.svg\")"){
        thisCell.style.background = '';
        return;
    }
    switch(cellBG){
        case '':
            thisCell.style.backgroundColor = '#306';
            blueSquares.push(thisCell.id);
            break;
        case 'rgb(51, 0, 102)':
            blueSquares.splice(blueSquares.indexOf(thisCell.id),1);
            thisCell.style.backgroundColor = '';
            thisCell.style.backgroundImage = "url('SVG/xxx.svg')";
            break;
    }
    if(playerWon(cellsReq,blueSquares)){
        alert('You\'ve won! \nYour time is: '+time);
        saveBestTime(time);
        disableAllEvents(squares);
    }
}
/** Saving the time from the timer that has passed
 * into the local storage if it is the player's best time
 * @param {string} time the time in string format
 */
function saveBestTime(time){
    if(typeof time !== 'string'){
        throw new Error('Invalid argument');
    }
    const minutes = parseInt(time.substring(0,time.indexOf(':')));
    const seconds = parseInt(time.substring(time.indexOf(':')+1));
    const timeSeconds = minutes*60+seconds;

    const pb = localStorage.getItem('bestTime_'+size);
    let pbSeconds = Number.MAX_SAFE_INTEGER;
    if(pb!=null){
        const pbM = parseInt(pb.substring(0,pb.indexOf(':')));
        const pbSec = parseInt(pb.substring(pb.indexOf(':')+1));
        pbSeconds = pbM*60+pbSec;
    }
    if(timeSeconds<pbSeconds){
        localStorage.setItem('bestTime_'+size,time);
    }
}
/**Creating numbers that tell the player
 * how many squares are in a row or column
 */
function createNumbers() {
    const column = document.getElementById('numbers-column');
    const maxNums = size%2==0 ? size/2 : (size+1)/2;
    column.style.height = (maxNums*50)+'px';
    column.style.width = size*50+'px';
    column.style.marginLeft = (maxNums*50)+'px';

    // generating numbers for the row of numbers
    for (let i = 0; i < size; ++i){
        const numbers_column = document.createElement('div');
        numbers_column.className = 'numColumn';
        const numGroups = countGroups(i, cellsReq, size, false);
        for (let j = 0; j < numGroups.length; ++j){
            const num = document.createElement('div');
            if(maxNums!=numGroups.length&&j==0){
                const missing = maxNums-numGroups.length;
                num.style.paddingTop = (missing*50)+'px';
            }
            num.className = 'num';
            num.innerHTML = numGroups[j];
            numbers_column.appendChild(num);
        }
        column.appendChild(numbers_column);
    }
    const row = document.getElementById('numbers-row');
    row.style.width = (maxNums*50)+'px';
    row.style.height = size*50+'px';

    //generating numbers for the column of numbers
    for (let i = 0; i < size; ++i){
        const numbers_row = document.createElement('div');
        numbers_row.className = 'numRow';
        const numGroups = countGroups(i, cellsReq, size, true);
        for (let j = 0; j < numGroups.length; ++j){
            const num = document.createElement('div');
            if(maxNums!=numGroups.length&&j==0){
                const missing = maxNums-numGroups.length;
                num.style.paddingLeft = (missing*50)+'px';
            }
            num.className = 'num';
            num.innerHTML = numGroups[j];
            numbers_row.appendChild(num);
        }
        row.appendChild(numbers_row);
    }
}
/**Counts the number of occurring squares that are part of the solution in a row or column
 * 
 * @param {number} index index of the searched row or column
 * @param {Array} arr Array of indexes with required squares for the win
 * @param {number} size size of the playing field
 * @param {boolean} isRow true if a row is being searched or false for a column
 * @returns number of squares in a group
 */
function countGroups(index,arr,size,isRow){
    if(typeof index !== 'number' || typeof isRow !== 'boolean' || typeof size !== 'number' || !(cellsReq instanceof Array)||!(arr instanceof Array)){
        throw new Error('Invalid argument');
    }
    let countBoxes = [];
    for(let i = 0;i<size;i++){
        const after = (i+1).toString();
        const endOfGroup_col = !arr.includes(index+'x'+after);
        const endOfGroup_row = !arr.includes(after+'x'+index);
        const endOfGroup = isRow ? endOfGroup_row : endOfGroup_col;
        const include = isRow ? arr.includes(i+'x'+index) : arr.includes(index+'x'+i);
        if(include&&endOfGroup){                      
            let boxesReq = 1;
            for(let j = i;j>0;j--){
                const before = (j-1).toString();
                const includedRow = arr.includes(before+'x'+index);
                const includedColumn = arr.includes(index+'x'+before);
                const included = isRow ? includedRow : includedColumn;
                if(included){                     
                    boxesReq++;
                }else{
                    continue;
                }
            }
            if(countBoxes.length>0){
                const reducer = (accumulator, curr) => accumulator + curr;
                boxesReq -= countBoxes.reduce(reducer);
            }
            countBoxes.push(boxesReq);
        }
    }
    return countBoxes;
}

/**Function updating the time passed since the begging of the game
 * This function is called repeatedly with an interval every second
 * 
 * @param {HTMLDivElement} timer this is the div object of the timer 
 * that holds the current time passed since the start of the game
 */
function updateTimer(timer){
    if(typeof timer!='object'){
        throw new Error('Invalid argument');
    }
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
    time = timer.innerHTML;
}

/**Creating random indexes for the squares that will be
 * required to click in order to win the game
 * @param {number} size size of the playing field
 * @returns random positions that have been generated
 */
function generateCells(size){
    const sizeArr = [5,10,15];
    if(typeof size !=='number' || !sizeArr.includes(size)){
        throw new Error('Invalid argument');
    }
    const count = Math.round(size*size*0.6);
    let usedPositions = [];
    for(let i = 0;i<count;i++){
        let posX;
        let posY;
        do{
            posX = Math.floor(Math.random()*size);
            posY = Math.floor(Math.random()*size);
        }while(usedPositions.includes(posX+'x'+posY));
        usedPositions.push(posX+'x'+posY);
    }
    return usedPositions;
}
/**Disables all the event listeners for the squares
 * so the player can't play anymore after winning
 * @param {Array} squares array of the div elements of each square on the field
 */
function disableAllEvents(squares){
    if(!(squares instanceof Array)){
        throw new Error('Invalid argument');
    }
    for(let i = 0;i<squares.length;i++){
        squares[i].removeEventListener('click',fillBox,false);
    }
    clearInterval(timer);
}
/**Functions checks if the player has won
 * @param {Array} req required indexes of squares to be clicked
 * @param {Array} filled indexes of squares that have been clicked
 * @returns 
 */
function playerWon(req,filled){
    if(!(req instanceof Array)||!(filled instanceof Array)){
        throw new Error('Invalid argument');
    }
    if(req.length!=filled.length){
        return false;
    }
    for(let i = 0;i < filled.length;i++){
        if(!req.includes(filled[i])){
            return false;
        }
    }
    return true;
}
try{
    window.onload = init;
}catch(e){}
// Exporting functions for testing
try{
    module.exports = {
        generateCells,
        playerWon
    }
}catch(e){}
