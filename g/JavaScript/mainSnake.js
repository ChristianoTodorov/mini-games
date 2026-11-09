
var snakeHead = null;
var snake = null;
var m = null;

var playground = null;
var score = null;
var size = null;
// Create the playing field with the size specified by the user and create an apple on a random position.
// Also load the previous high score
function init() {
    size = parseInt(prompt("Choose the size of the field (N*N) [6-24] :\nSize must be even!"));
    if(isNaN(size)||size<6||size>24||size%2!=0){
        size = 24;
    }
    if(localStorage.getItem('record_'+size)!=null){
        const record = document.getElementById('record');
        record.innerHTML = record.innerHTML + localStorage.getItem('record_'+size);
    }
    score = document.getElementById("score");
    snakeHead = document.getElementById("snake");
    snakeHead.style.left = (size*25)+"px";
    snakeHead.style.top = (size*25)+"px";
    snake = new Snake(snakeHead,500);
    window.onkeydown = handleKeyDown;
    snake.body.push(snakeHead);
    loadPlayground();
    spawnApple(playground);
    m = setInterval(function(){move(snake)}, snake.speed);
}
// returns a random rgb color
function randomColor() {
    let r = Math.floor(Math.random()*(255 + 1));
    let g = Math.floor(Math.random()*(255 + 1));
    let b = Math.floor(Math.random()*(255 + 1));
    return [r,g,b];
}
// Create the playing field by the size specified
function loadPlayground(){
    playground = document.getElementById('playground');
    playground.style.width = size*50+"px";
    playground.style.height = size*50+"px";
    for (var i = 0; i < size; ++i){
        var row = document.createElement('div');
        row.className = 'row';
        row.style.flexDirection = i % 2 === 0 ? '' : 'row-reverse';
        for (var j = 0; j < size; ++j){
            var square = document.createElement('div');
            square.className = 'square';
            square.style.backgroundColor = j % 2 === 0 ? 'greenyellow' : '#81cf0c';
            row.appendChild(square);
        }
        playground.appendChild(row);
    }
}
// spawn an apple on a random position of the field
function spawnApple(playground){
    var apple = document.createElement("img");
    var randX = Math.floor(Math.random() * size)*50;
    var randY = Math.floor(Math.random() * size)*50;
    while(snake.OnPos(randX,randY)){
        randX =  Math.floor(Math.random() * size)*50;
        randY = Math.floor(Math.random() * size)*50;
    }
    if((randX+randY)%100==0){
        apple.src = "SVG//snake/apple.png";
    }else{
        apple.src = "SVG//snake/apple.jpg";
    }
    apple.id = "apple";
    // 0 - 1150
    apple.style.top = randY+"px";
    apple.style.left = randX+"px";
    playground.appendChild(apple);
}
// Alert the user when the game is over and stop the snake from moving
// Also save the score if it is a high score for the current playing field
function gameOver(){
    clearInterval(m);
    let msg = 'You\'ve died!\nYou have successfully accumulated a score of '+(snake.applesEaten);
    if(localStorage.getItem("record_"+size)<snake.applesEaten){
        msg += '\nThis is your new highscore!';
        localStorage.setItem("record_"+size,JSON.stringify(snake.applesEaten));
    }
    alert(msg);
    location.reload();
}
/**Handle the snakes movement and with each new position, 
 * check if has been a collision 
 */
function move(){
    let lastX = snake.body[snake.body.length-1].style.left;
    let lastY = snake.body[snake.body.length-1].style.top;
    snake.positions.push([lastX,lastY]);
    if(snake.positions.length>snake.body.length+1){
        snake.positions.pop();
    }
    snake.checkCollision();
    for(let i = snake.body.length-1;i>0;i--){
        snake.body[i].style.top = snake.body[i-1].style.top;
        snake.body[i].style.left = snake.body[i-1].style.left;
    }
    switch(snake.direction){
        case "left":
            snake.moveLeft();
            break;
        case "right":
            snake.moveRight();
            break;
        case "down":
            snake.moveDown();
            break;
        case "up":
            snake.moveUp();
            break;
    }
}
/**This function find the direction of the snake's movement
 * not by the variable direction (because that is inconsistent) but by checking the position of the second body part
 * @param {*} headX the margin of the head of the snake from left
 * @param {*} headY the margin of the head of the snake from the top
 * @param {*} bodX the margin of the first body part of the snake from left
 * @param {*} bodY the margin of the first body part of the snake from the top
 * @returns an array of the directions with values true or false
 */
function getCurrDir(headX,headY,bodX,bodY){
    var right = bodX==parseInt(headX)-50+'px'&&bodY==headY;
    var left = bodX==parseInt(headX)+50+'px'&&bodY==headY;
    var up = bodY==parseInt(headY)+50+'px'&&bodX==headX;
    var down = bodY==parseInt(headY)-50+'px'&&bodX==headX;
    return [right,left,up,down];
}
/**Called when a key has been pressed
 * Changing the value of the variable direction so the next position in which
 * the snake will be moved is defined
 * @param {Event} e the event of the key being pressed
 */
function handleKeyDown(e) {
    var key_code = e.keyCode;
    var headX = snakeHead.style.left;
    var headY = snakeHead.style.top;
    var onlyHead = false;
    try{
        var bodX = snake.body[1].style.left;
        var bodY = snake.body[1].style.top;
        var pos = getCurrDir(headX,headY,bodX,bodY);
    }catch(e){
        onlyHead = true;
        console.log(e);
    }
    switch (key_code) {
        case 37: //left
            if(onlyHead||!pos[0]){
                snake.direction = "left";
            }
            break;
        case 38: //up
            if(onlyHead||!pos[3]){
                snake.direction = "up";
            }
            break;
        case 39: //right
            if(onlyHead||!pos[1]){
                snake.direction = "right";
            }
            break;
        case 40: //down
            if(onlyHead||!pos[2]){
                snake.direction = "down";
            }
            break;
    }
}
try{
    window.onload = init;
}catch(e){}

try{
    module.exports = {
        randomColor,
        getCurrDir
        }
}catch(e){}