/**Check if number value is allowed
 * on the position r,s in the grid
 * @param {Array} grid the Array of the sudoku numbers
 * @param {number} r index of the row
 * @param {number} s index of the column
 * @param {number} value number 1-9
 * @returns true if the number is allowed on this position according to the sudoku rules
 */
function possible(grid, r, s, value) {
    let X = Math.floor(r / 3) * 3;
    let Y = Math.floor(s / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + X][j + Y].innerHTML == value) {
                return false;
            }
        }
    }
    for (let w = 0; w < 9; w++) {
        if (grid[r][w].innerHTML == value || grid[w][s].innerHTML == value) {
            return false;
        }
    }
    return true;
}
/**Check if the sudoku written by the user
 * is a valid sudoku according to the sudoku rules
 * @param {Array} grid the array of the sudoku numbers
 * @returns false if the sudoku is breaking the sudoku rules and a number is being repeated
 */
function SudokuIsValid(grid){
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j].innerHTML != "") {
                if (!realSudoku(grid, i, j, grid[i][j].innerHTML)) {
                    alert("Sudoku není možné vyřešit!\nZadejte prosím vyřešitelné sudoku pro správný výsledek");
                    repeat = false;
                    return false;
                }
            }
        }
    }
    return true;
}
/**Finds the incorrectly inputted numbers in the sudoku if there are any
 * and colors them red
 * @param {Array} grid the Array of the sudoku numbers
 * @param {number} r index of the row
 * @param {number} s index of the column
 * @param {number} value number that is potentially breaking the rules
 * @returns 
 */
function realSudoku(grid, r, s, value) {
    if(typeof r !== 'number' || typeof s !== 'number' ||  (typeof value !== 'string' && typeof value !== 'number')){
        throw new Error('Invalid argument');
    }
    let X = Math.floor(r / 3) * 3;
    let Y = Math.floor(s / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + X][j + Y].innerHTML == value && grid[i + X][j + Y] != grid[r][s]) {
                grid[i + X][j + Y].style.backgroundColor = "red";
                grid[r][s].style.backgroundColor = "red";
                return false;
            }
        }
    }
    for (let w = 0; w < 9; w++) {
        if ((grid[r][w].innerHTML == value || grid[w][s].innerHTML == value)
         && grid[r][w] != grid[r][s] && grid[w][s] != grid[r][s]) {
            if (grid[r][w].innerHTML == value) {
                grid[r][w].style.backgroundColor = "red";
                grid[r][s].style.backgroundColor = "red";
            }
            if (grid[w][s].innerHTML == value) {
                grid[w][s].style.backgroundColor = "red";
                grid[r][s].style.backgroundColor = "red";
            }
            return false;
        }
    }
    return true;
}
// solving algorithm
var pocetBacktracku = 1;
var grid = [[], [], [], [], [], [], [], [], []];
var freeSpace = [];
var aktualniDeadEnd;
var repeat;

/**Fill the sudoku with all the possible numbers until
 * we arrive to a deadend where no number can be filled.
 * When this happens, backtrack to find the correct number.
 */
function solveSudoku() {
    available = false;
    if(grid.every(row => row.every(value => value==0 ))){
    for (let radek = 0; radek < 9; radek++) {
        for (let sloupec = 0; sloupec < 9; sloupec++) {
                grid[radek][sloupec] = document.getElementById(radek + "" + sloupec); 
            }
        }
    }
    if(!SudokuIsValid(grid)){
        return;
    }
    for (var r = 0; r < 9; r++) {
        for (var s = 0; s < 9; s++) {
            if (grid[r][s].innerHTML == "") {
                var duplicates = false;
                for (let x = 0; x < freeSpace.length; x++) {
                    if (freeSpace[x] == grid[r][s]) {
                        duplicates = true;
                        break;
                    }
                }
                if (duplicates == false) {
                    freeSpace.push(grid[r][s]);
                }
                for (let i = 1; i < 10; i++) {
                    if (possible(grid, r, s, i)) {
                        grid[r][s].innerHTML = i;
                        //solve();             
                        repeat = true;
                        return;
                    }
                }
                backtrack(grid, r, s);
                //solve();                                        
                return;
            }
        }
    }
    const duration = Date.now() - start;
    console.log('Completed in : '+duration+'ms');
    repeat = false;
}
let start;
// repeat the function solve until the sudoku is completely filled
function solve() {
    start = Date.now();
    do {
        solveSudoku();
    } while (repeat);
}
/**If there can be no numbers filled, return to the previous guessed number and increase it until some number is allowed.
 * If the previous guessed number has tried unsuccessfully all numbers from 1 to 9, backtrack more to another number (increase pocetBacktracku)
 * @param {Array} grid the Array of the sudoku numbers
 * @param {number} deadR index of the row of the deadend position
 * @param {number} deadS index of the column of the deadend position
 */
function backtrack(grid, deadR, deadS) {
    if(!(grid instanceof Array)|| typeof deadR != 'number' || typeof deadS != 'number'){
        throw new Error('Invalid argument');
    }
    if (aktualniDeadEnd != grid[deadR][deadS] || aktualniDeadEnd == null) {
        aktualniDeadEnd = grid[deadR][deadS];
        pocetBacktracku = 1;
    }
    for (let i = 0; i < freeSpace.length; i++) {
        if (freeSpace[i] == aktualniDeadEnd) {
            var x = (i - pocetBacktracku)+1;
        }
    }
    try{
        var w = parseInt(freeSpace[x].innerHTML)+1;
    }catch(e){
        alert("Sudoku není možné vyřešit!\nZadejte prosím vyřešitelné sudoku pro správný výsledek");
        repeat = false;
        return;
    }
    var id1 = freeSpace[x].id.substr(0, 1);
    var id2 = freeSpace[x].id.substr(1, 2);

    for (let i = x; i < freeSpace.length; i++) {
        freeSpace[i].innerHTML = "";
    }
    for (; w < 10; w++) {
        if (possible(grid, id1, id2, w)) {
            grid[id1][id2].innerHTML = w;
            pocetBacktracku = 1;
            return;
        }
    }
    grid[id1][id2].innerHTML = "";
    pocetBacktracku++;
    backtrack(grid,deadR,deadS);
}
try{
    module.exports = {
        realSudoku,
        possible
        }
}catch(e){}