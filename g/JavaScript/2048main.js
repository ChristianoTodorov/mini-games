var direction = "";
var playground = null;
var boxes = new Array();
const posLength = 146;

// load the playing field and create 2 boxes in the beginning of the game
function init() {
    playground = document.getElementById("game-container");
    const pb = document.getElementById("pb");
    pb.innerHTML = localStorage.getItem("highscore");
    createBox();
    createBox();
}

/**Creates a box on a random position with a number 2 or 4
 * chances of getting 4 are 10% since 2s should be more common
 */
function createBox() {
    var box = document.createElement("div");
    var randNum = Math.floor(Math.random() * 10) + 1;
    box.className = "box";
    if (randNum != 4) {
        box.innerHTML = 2;
    } else {
        box.innerHTML = 4;
        box.style.backgroundColor = '#eee1c9';
    }
    var indexes = boxes.map(function (item) { return item.x + "x" + item.y });
    do {
        var randX = Math.floor(Math.random() * 4);
        var randY = Math.floor(Math.random() * 4);
    } while (indexes.includes(randX + "x" + randY));
    var Box = {
        dom: box,
        value: box.innerHTML,
        x: randX,
        y: randY
    }
    Box.dom.style.left = (posLength * randX + 15) + 'px';
    Box.dom.style.top = (posLength * randY + 15) + 'px';
    boxes.push(Box);
    grid[Box.y][Box.x] = Box.value;
    playground.appendChild(box);
}

/**Change the score by the amount gained
 * @param {number} amount the score gained
 */
function updateScore(amount) {
    if(typeof amount != "number"&&typeof amount != "string"){
        throw new Error('Invalid argument');
    }
    var score = document.getElementById("score");
    var accumulated = score.innerHTML.match(/\d+/g);
    accumulated = parseInt(accumulated) + parseInt(amount);
    score.innerHTML = "Score: " + accumulated;
}
/**
 * Check if the game is over
 */
var game_finished = false;
function gameOver() {
    const cantMoveHoriz = !movementPossible(grid,'left')&&!movementPossible(grid,'right');
    const cantMoveVert = !movementPossible(grid,'up')&&!movementPossible(grid,'down');
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].value == 2048) {
            console.log('You\'ve won!');
        }
    }
    if (cantMoveVert&&cantMoveHoriz) {
        alert('Game Over!');
        game_finished = true;
        var score = document.getElementById("score");
        var points = score.innerHTML.match(/\d+/g);
        points = parseInt(points);
        var highscore = localStorage.getItem('highscore');
        if (highscore==null || parseInt(highscore) < points) {
            alert('Congratulations!\nYou have set a new highscore!');
            localStorage.setItem('highscore', points);
        }
        return true;
    }
}

window.onload = init;