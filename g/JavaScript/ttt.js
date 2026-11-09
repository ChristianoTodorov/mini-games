let xFirst;
let playerFirst;
let playAI;
let tdArr = null;
let vysledek = null;
// Load all the necessary HTML components and ask the player which symbol is starting
// also load the score of the player x and o
function init() {
    xFirst = confirm('Is X playing first ?');
    playAI = confirm('Do you wish to play against a computer?');
    tdArr = document.getElementsByTagName('td');
    vysledek = document.getElementById("vysledek");
    vysledek.style.visibility = 'hidden';
    //AI is playing first move
    if(playAI){
        playerFirst = confirm('Do you wish to play first?');
        if (!playerFirst) moveAI();
    }
    // load score of the previous games
    const wx = document.getElementById('xwins');
    const xScore = localStorage.getItem('wins_of_x');
    if (xScore != null) wx.innerHTML = xScore;
    const wo = document.getElementById('owins');
    const oScore = localStorage.getItem('wins_of_o');
    if (oScore != null) wo.innerHTML = oScore;
}
/**Count the number of occurrences of the symbol X and O
 * @param {boolean} x true if counting the symbol X
 * @param {Array / Object} imgs of the symbols in the game
 * @returns return the number of X or O
 */
function count(x, imgs) {
    if (typeof x !== 'boolean' || (typeof imgs !== 'object' && !(imgs instanceof Array))) {
        throw new Error('Invalid argument');
    }
    let countx = 0;
    let counto = 0;
    for (let i = 0; i < 9; i++) {
        if (imgs[i] == 'url("SVG/x.svg")') countx++;
        if (imgs[i] == 'url("SVG/o.svg")') counto++;
    }
    if (x) return countx;
    else return counto;
}
/**Place a symbol on the position clicked
 * 
 * @param {HTMLDivElement} td the box that has been clicked
 * @param {Array / Object} imgs Array of the images 
 */
function place(td, imgs) {
    if (typeof td !== 'object' || !(imgs instanceof Array)) {
        throw new Error('Invalid argument');
    }
    if ((xFirst && count(true, imgs) == count(false, imgs)) || (!xFirst && count(false, imgs) > count(true, imgs))) {
        if (td.style.backgroundImage == '') {
            td.style.backgroundImage = "url('SVG/x.svg')";
        }
    } else if (td.style.backgroundImage == '') {
        td.style.backgroundImage = "url('SVG/o.svg')";
    }
}
/**
 * Function for the control of the AI.
 * Chooses what position to pick for the placement of it's symbol.
 * Calls the function minimax to get the best move possible.
 */
function moveAI() {
    if(vysledek.style.visibility == "visible") return;
    let bestScore = Number.MIN_SAFE_INTEGER;
    let bestMove;
    for (let i = 0; i < tdArr.length; i++) {
        if (tdArr[i].style.backgroundImage == '') {
            place(tdArr[i], updateBackImgs());
            let score = minimax(updateBackImgs(), 0, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, false);
            tdArr[i].style.backgroundImage = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    place(tdArr[bestMove], updateBackImgs());
    checkWin(updateBackImgs(), false);
}
/** Minimax algorithm, also using alpha beta pruning to make the function more efficient.
 * Minimax finds the best possible move for the maximizing player to play and returns it.
 * 
 * @param {Object/Array} backImgs The list of all the symbols in the game
 * @param {Number} depth depth of the tree
 * @param {Number} alpha score of alpha branch
 * @param {Number} beta score of beta branch
 * @param {boolean} maximizing true if it's the turn of the maximizing player
 * @returns 
 */
function minimax(backImgs, depth, alpha, beta, maximizing) {
    if(typeof maximizing !== 'boolean' || typeof depth != 'number'){
        throw new Error('Invalid argument');
    }
    const result = checkWin(backImgs, true);
    let resultScore;
    if (result != 0) {
        switch (result) {
            case "Player X won !!!":
                if(xFirst) resultScore = playerFirst ? -10:10;
                else resultScore = playerFirst ? 10:-10;
                break;
            case "Player O won !!!":
                if(xFirst) resultScore = playerFirst ? 10:-10;
                else resultScore = playerFirst ? -10:10;
                break;
            default:
                return 0;
        }
        return resultScore-depth;
    }
    // Minimax
    let bestScore = maximizing ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;                        
    for (let i = 0; i < tdArr.length; i++) {
        if (tdArr[i].style.backgroundImage == '') {
            place(tdArr[i], backImgs);
            let score = minimax(updateBackImgs(), depth + 1, alpha, beta, !maximizing);
            tdArr[i].style.backgroundImage = '';
            bestScore = maximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
            if(maximizing){
                alpha = Math.max(alpha, score);
            }else{
                beta = Math.min(beta, score);
            } 
            if(beta<=alpha) break;
        }
    }
    return bestScore;
}
/**Increases the score of a player by one
 * @param {boolean} x if x is true, update the score of the player X
 */
function updateScore(x) {
    if (typeof x !== 'boolean') {
        throw new Error("Invalid argument");
    }
    const winner = x ? document.getElementById('xwins') : document.getElementById('owins');
    const text = winner.innerHTML;
    const count = text.match(/\d+/g);
    winner.innerHTML = text.substring(0, text.indexOf(text.match(/\d/))) + (parseInt(count) + 1);
    const scoreName = x ? 'wins_of_x' : 'wins_of_o';
    localStorage.setItem(scoreName, winner.innerHTML);
}
//Removes the saved amount of wins of each player
function resetScore() {
    localStorage.removeItem('wins_of_x');
    localStorage.removeItem('wins_of_o');
    const wx = document.getElementById('xwins');
    const wo = document.getElementById('owins');
    wx.innerHTML = 'X: 0';
    wo.innerHTML = 'O: 0';
}
/**Copies an array vertically
 * @param {2DArray} grid the array that is copied
 * @returns returns a copy of the supplied array vertically
 */
function copyArrayVertical(grid) {
    if (!(grid instanceof Array)) {
        throw new Error('Invalid argument');
    }
    let gridCopy = new Array();
    for (let i = 0; i < grid.length; i++) {
        let arr = new Array();
        for (let j = 0; j < grid[i].length; j++) {
            arr.push(grid[j][i]);
        }
        gridCopy.push(arr);
    }
    return gridCopy;
}
// check vertically and horizontally for 3 Xs or Os
function checkWinFor(X, playArea, vertPlayArea) {
    let arrVert = [];
    let arrHoriz = [];
    for (let i = 0; i < 3; i++) {
        let symbol = null;
        if (X) symbol = 'url("SVG/x.svg")';
        else symbol = 'url("SVG/o.svg")';
        arrHoriz.push(playArea[i].every(value => value === symbol));
        arrVert.push(vertPlayArea[i].every(value => value === symbol));
    }
    const vert = !arrVert.every(value => value === false);
    const horiz = !arrHoriz.every(value => value === false);
    return [vert, horiz];
}
/**Checks if a player has won and if someone has,
 * a text of who won is shown
 * @param {Array / Object} backImgs the images of the symbols in the game
 */
function checkWin(backImgs, ai) {
    const playArea = [[]];
    for (let i = 0; i < 3; ++i) {
        const row = [];
        for (let j = 0; j < 3; ++j) {
            row.push(backImgs[i * 3 + j]);
        }
        playArea.push(row);
    }
    playArea.splice(playArea[0], 1);
    const vertPlayArea = copyArrayVertical(playArea);
    const vertX = checkWinFor(true, playArea, vertPlayArea)[0];
    const horizX = checkWinFor(true, playArea, vertPlayArea)[1];
    if (vertX || horizX || (backImgs[6] == 'url("SVG/x.svg")' && backImgs[4] == backImgs[2] && backImgs[4] == backImgs[6])
        || (backImgs[0] == 'url("SVG/x.svg")' && backImgs[4] == backImgs[8] && backImgs[8] == backImgs[0])) {
        if(!ai){
            vysledek.innerHTML = "Player X won !!!";
            vysledek.style.visibility = "visible";
            updateScore(true);
        }else{
            return "Player X won !!!";
        }
    }
    // check vertically and horizontally for 3 Os
    const vertO = checkWinFor(false, playArea, vertPlayArea)[0];
    const horizO = checkWinFor(false, playArea, vertPlayArea)[1];
    if (vertO || horizO || (backImgs[6] == 'url("SVG/o.svg")' && backImgs[4] == backImgs[2] && backImgs[4] == backImgs[6])
        || (backImgs[0] == 'url("SVG/o.svg")' && backImgs[4] == backImgs[8] && backImgs[0] == backImgs[4])) {
        if(!ai){
            vysledek.innerHTML = "Player O won !!!";
            vysledek.style.visibility = "visible";
            updateScore(false);
        }else{
            return "Player O won !!!";
        }
    }
    if (count(true, backImgs) + count(false, backImgs) == 9 && vysledek.style.visibility == 'hidden') {
        if(!ai){
            vysledek.innerHTML = "IT'S A TIE!";
            vysledek.style.visibility = "visible";
        }else{
            return "IT'S A TIE!";
        }
    }
    if(ai) return 0;
}
/**Checks all the positions and their background images,
 * then saves them into an array backImgs
 * @returns an updated version of the array of background images
 */
function updateBackImgs() {
    var backImgs = [];
    for (let i = 0; i < 9; i++) {
        backImgs.push(tdArr[i].style.backgroundImage);
    }
    return backImgs;
}
/**Places a symbol by calling function place and checks if the game is over
 * @param {number} id the id of the box clicked
 */
function play(id) {
    var td = tdArr[id];
    var backImgs = updateBackImgs();
    if (vysledek.style.visibility == 'hidden') {
        let placed = false;
        if (td.style.backgroundImage == '') placed = true;
        place(td, backImgs);
        var backImgs = updateBackImgs();
        if (count(true, backImgs) > 2 || count(false, backImgs) > 2) {
            checkWin(backImgs, false);
        }
        if (playAI && placed) moveAI();
    }
}
// the testing module does not recognize DOM elements, therefore an error is expected
try {
    window.onload = init;
} catch (e) { }
// The commonjs does not recognize module.exports, therefore an error is expected
try {
    module.exports = {
        copyArrayVertical,
        count
    }
} catch (e) { }