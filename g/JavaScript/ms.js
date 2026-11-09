var tilesIMG = new Array();
var tilesObj = new Array();
var flaggin = false;
var difficulty; // obtížnost určuje počet min
var bombnum;
var timer;
var mines = new Array();
var currentPos;

/**
 * Setting off the timer and letting the player to choose difficulty,
 * after which all the squares of the playing field are created with an object 
 * with values telling if the tile created is a border tile.
 * At the end random positions for the mines are created.
 */
function init(){
    timer = setInterval(updateTimer, 1000);
    difficulty = prompt("Choose your difficulty : \nEasy\t[1]\nMedium\t[2]\nHard\t[3]");
    switch (difficulty) {
        case "1": bombnum = 40;
            break;
        case "2": bombnum = 60;
            break;
        case "3": bombnum = 80;
            break;
        default: bombnum = 60;
            break;
    }
    for (let i = 0; i < 400; i++) {
        const l = i % 20 != 0;
        const r = (i + 1) % 20 != 0;
        const u = i > 19;
        const d = i < 380;
        let obj = {
            left: l,
            right: r,
            up: u,
            down: d,
            upperleft: u && l,
            upperright: u && r,
            downright: d && r,
            downleft: d && l
        };
        tilesObj.push(obj);
    }
    
    do {
        let rand = 0;
        do {// Search the array of mines for duplicates and change the value if there is any duplicates until there are none
            rand = Math.floor(Math.random() * 400);// 0-399
        } while (mines.includes(rand));
        mines.push(rand);
    } while (mines.length != bombnum);
    
    var pb = document.getElementById('pb');
    var bestTime = localStorage.getItem('bestTime_' + bombnum);
    if (bestTime == null) {
        pb.innerHTML = '--:--';
    } else {
        pb.innerHTML = '00:' + (parseInt(bestTime) + 1);
    }
    if (bestTime >= 60) {
        const minutes = Math.floor(bestTime / 60);
        pb.innerHTML = minutes + ':' + (bestTime - minutes * 60);
    }
    loadPlayground();
}
//load playground and it's images
function loadPlayground(){
    const playground = document.getElementsByTagName('table')[0];
    for (var i = 0; i < 20; ++i){
        var row = document.createElement('TR');
        for (var j = 0; j < 20; ++j){
            var square = document.createElement('TD');
            // nastavení obrázku každého políčka 
            var tileIMG = document.createElement("img");
            tileIMG.src = "SVG/minesweeper/tile.jpg";
            tileIMG.style.width = "100%";
            tileIMG.style.height = "33px";
            tilesIMG.push(tileIMG);
            square.appendChild(tileIMG);
            row.appendChild(square);
        }
        playground.appendChild(row);
    }
    const tds = document.querySelectorAll('td');
    tds.forEach(value => {value.addEventListener('click', function(){display(value)})});
}

var time = null;
/**
 * Updates the timer each second
 * This function is called repeatedly each second by an interval
 */
function updateTimer() {
    var timer = document.getElementById("time");
    var str = timer.innerHTML;
    var minutes = parseInt(timer.innerHTML.substring(0, str.indexOf(":")));
    var seconds = parseInt(timer.innerHTML.substring(str.indexOf(":") + 1));
    time = seconds + minutes * 60;
    if (seconds + 1 == 60) {
        minutes += 1;
        timer.innerHTML = minutes + ":00";
    } else {
        seconds += 1;
        timer.innerHTML = minutes + ":" + seconds;
    }
}
/**Check if the clicked tile is a mine,
 * if it is, the player has lost and true is returned.
 * @param {HTMLDDivElement} _this the clicked tile
 * @param {Array} tilesArr array of all the tiles
 * @param {Array} minesArr array of the mines
 * @returns true or false if the player lost the game
 */
var lost = (_this,tilesArr,minesArr) => { // kontroluje zda vybraná pozice není mina
    if(_this == undefined || _this == null || !(minesArr instanceof Array)){
        throw new Error("Invalid argument");
    }
    if(typeof tilesArr !== "object" && !(tilesArr instanceof Array)){
        throw new Error('Invalid argument');
    }
    for (let i = 0; i < 400; i++) {
        if (_this == tilesArr[i]) {
            currentPos = i;
            for (let y = 0; y < minesArr.length; y++) {
            // pokud pozice na kterou jsme klikli je pozice určená náhodně pro minu, tak metoda vrací true (prohra = pravda)
                if (minesArr[y] == i) return true;    
            }
            return false;
        }
    }// clicked on unrecognized tile
    throw new Error("Invalid argument");
}
/**Reveals the box clicked
 * @param {HTMLDivElement} except the clicked element 
 */
function reveal(except) { // If the player has lost, show all mines except the one clicked (because the image is different)
    for (let wm = 0; wm < bombnum; wm++) {
        if (tilesIMG[mines[wm]] != except) { // this mine has not been clicked
            tilesIMG[mines[wm]].src = "SVG/minesweeper/bomb.png";
        }
    }
}
/**Counts the number of mines next to the clicked tile
 * 
 * @param {number} pos index of the clicked position 
 * @param {Array} minesArr array of positions of the mines
 * @param {Array} tilesObjArr the array of tiles
 * @returns the number of mines counted
 */
var countMines = (pos,minesArr,tilesObjArr) => { // počítá kolik sousedních min má pozice pos
    if(typeof pos !== 'number' || !(minesArr instanceof Array) || !(tilesObjArr instanceof Array)){
        throw new Error("Invalid argument");
    }
    let numOfMines = 0;
    for (let y = 0; y < bombnum; y++) {
        const arrMinesClose = [pos + 1 == minesArr[y], pos + 19 == minesArr[y], pos + 20 == minesArr[y], pos + 21 == minesArr[y],
        pos - 1 == minesArr[y], pos - 19 == minesArr[y], pos - 20 == minesArr[y], pos - 21 == minesArr[y]];
        const dirs = [tilesObjArr[pos].right, tilesObjArr[pos].downleft, tilesObjArr[pos].down, tilesObjArr[pos].downright,
        tilesObjArr[pos].left, tilesObjArr[pos].upperright, tilesObjArr[pos].up, tilesObjArr[pos].upperleft]
        for (let i = 0; i < 8; i++) {
            if (arrMinesClose[i] && dirs[i]) {
                numOfMines++;
            }
        }
    }
    return numOfMines;
}
var qp;                 // we get the path to the pictures so we can compare them in ifs
try{// modules don't recognize dom elements, therefore an error is expected when testing
    var pathTILE = "file://" + window.location.pathname.substring(0, window.location.pathname.length - 16) + "SVG/minesweeper/tile.jpg";
    var pathFLAG = "file://" + window.location.pathname.substring(0, window.location.pathname.length - 16) + "SVG/minesweeper/flag.png";
}catch(e){}
/**
 * Changes the image of the flag button
 */
var flag = () => {
    flaggin = true;
    qp = document.getElementById("f");
    qp.src = "SVG/minesweeper/usedFlag.png";
}
var playing = true;
/**Clear all the tiles next to a blank tile since there is no mines
 * next to it 
 * @param {number} index the index of the clicked tile
 */
var autoClear = (index) => {
    if(typeof index !== 'number'){
        throw new Error('Invalid argument');
    }
    // funkce na čištění sousedů volné pozice             
    // pokud pozice na indexu index je číslo
    if (countMines(index,mines,tilesObj) > 0) {
        tilesIMG[index].src = "SVG/minesweeper/" + countMines(index,mines,tilesObj) + ".png";
    } else {
        // pozice na indexu index je prázdná pozice
        tilesIMG[index].src = "SVG/minesweeper/nothin.png";
        
        if (tilesObj[index].right && tilesIMG[index + 1].src != pathTILE) {
            tilesObj[index].right = false;
        }
        if (tilesObj[index].left && tilesIMG[index - 1].src != pathTILE) {
            tilesObj[index].left = false;
        }
        if (tilesObj[index].upperright && tilesIMG[index - 19].src != pathTILE) {
            tilesObj[index].upperright = false;
        }
        if (tilesObj[index].up && tilesIMG[index - 20].src != pathTILE) {
            tilesObj[index].up = false;
        }
        if (tilesObj[index].upperleft && tilesIMG[index - 21].src != pathTILE) {
            tilesObj[index].upperleft = false;
        }
        if (tilesObj[index].down && tilesIMG[index + 20].src != pathTILE) {
            tilesObj[index].down = false;
        }
        if (tilesObj[index].downright && tilesIMG[index + 21].src != pathTILE) {
            tilesObj[index].downright = false;
        }
        if (tilesObj[index].downleft && tilesIMG[index + 19].src != pathTILE) {
            tilesObj[index].downleft = false;
        }
        clearCloseby(index);
    }
}
/**Clear the neighboring tiles of the tile clicked
 * 
 * @param {number} p index of the tile that has been clicked
 */
function clearCloseby(p) {
    if(typeof p !== 'number'){
        throw new Error('Invalid argument');
    }
    const dirs = [tilesObj[p].right, tilesObj[p].downleft, tilesObj[p].down, tilesObj[p].downright,
    tilesObj[p].left, tilesObj[p].upperright, tilesObj[p].up, tilesObj[p].upperleft]
    const neighbours = [p + 1, p + 19, p + 20, p + 21, p - 1, p - 19, p - 20, p - 21];
    for (let i = 0; i < 8; i++) {
        // if this position exists, reveal it
        if (dirs[i]) {
            autoClear(neighbours[i]);
        }
    }
}
// if the number of not clicked tiles is the same as the number of mines, the play has won
function checkWin(){
    var neodhaleny = 0;
    for (let i = 0; i < 400; i++) { 
        if (tilesIMG[i].src == pathTILE || tilesIMG[i].src == pathFLAG) {
            neodhaleny++;
        }
    }
    if (neodhaleny == bombnum) {
        document.getElementById("guy").src = "SVG/minesweeper/win.png";
        playing = false;
        const bestTime = localStorage.getItem("bestTime_" + bombnum);
        if (bestTime > time || bestTime == null) {
            localStorage.setItem("bestTime_" + bombnum, time);
        }
        clearInterval(timer);
    }
}
/**Display the tile that has been clicked
 * or put a flag there.
 * Also check if the player won or lost and call the according functions.
 * If the player has won and the current time is personal best, save it into local storage.
 * @param {HTMLDivElement} _this the clicked tile
 */
var display = (_this) => {
    if (!playing) return;
    var q = _this.getElementsByTagName("IMG")[0];
    if (flaggin) {
        // put a flag
        q.src = "SVG/minesweeper/flag.png";
        qp.src = "SVG/minesweeper/flag.png";
        flaggin = false;
    } else {
        if (q.src == pathFLAG) {
            // if there is a flag on the clicked tile, remove it                      
            q.src = "SVG/minesweeper/tile.jpg";
        } else {
            tiles = document.getElementsByTagName('TD');
            // if the player has lost, reveal the mines and end the game
            if (lost(_this,tiles,mines)) {
                q.src = "SVG/minesweeper/boom.jfif";
                var status = document.getElementById("guy");
                status.src = "SVG/minesweeper/lose.png";
                reveal(q);
                clearInterval(timer);
                playing = false;
            } else {
                // if clicked tile is blank, reveal every tile next to it
                // if not, set the background image to the number of mines that are close
                if (countMines(currentPos,mines,tilesObj) == 0) {
                    q.src = "SVG/minesweeper/nothin.png";
                    clearCloseby(currentPos);
                } else {
                    tilesIMG[currentPos].src = "SVG/minesweeper/" + countMines(currentPos,mines,tilesObj) + ".png";
                }
                checkWin();
            }
        }
    }
}
try{
    window.onload = init;
}catch(e){}
try {
    module.exports = {
        countMines,
        lost
    }
} catch (e) { }