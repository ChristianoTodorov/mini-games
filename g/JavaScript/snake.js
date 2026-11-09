/**
 * class Snake representing the snake in the game
 * with all of its main functionalities
 * 
 * The snake has a direction of its movement, array for all the body parts,
 * count for the apples eaten (= score) and an array of the last visited position
 */
class Snake{
    direction = "";
    body = [];
    applesEaten = 0;
    positions = [];
    // the constructor only need the starting speed and the element of the head oof the snake (first moving part)
    constructor(head,speed){
        if(speed<60 || speed>1000 || typeof speed !== "number"){
            throw new Error("Invalid argument");
        }
        this.snakeHead = head;
        this.speed = speed;
    }
    //Basic getters and setters for the snake
    get direction(){
        return this.direction;
    }
    get body(){
        return this.body;
    }
    get applesEaten(){
        return this.applesEaten;
    }
    get positions(){
        return this.positions;
    }
    set direction(dir){
        const dirs = ['left','right','up','down'];
        if(!dirs.includes(dir)){
            throw new Error("Invalid direction");
        }
        this.direction = dir;
    }
    set body(bod){
        if(typeof bod != 'HTMLDivElement'){
            throw new Error("Invalid argument"+bod);
        }
        this.body = bod
    }
    set applesEaten(applesC){
        if(isNaN(applesC)){
            throw new Error("Invalid argument");
        }
        this.applesEaten = applesC;
    }
    set positions(pos){
        if(!(pos instanceof Array)){
            throw new Error("Invalid positions");
        }
        this.positions = pos;
    }
    /*returns true if there is a part of the snake's body on the specified position X and Y
    * posX and posY = number of pixels of the position searched (margin from left and top)
    */
    OnPos(posX,posY){
        if(typeof posX != 'number' || typeof posY != 'number'){
            throw new Error("Invalid argument");
        }
        if(posX > 1200 || posX<0 || posY > 1200 || posY<0){
            throw new Error("Argument is not in the correct range");
        }
        for(let i = 0;i<this.body.length;i++){
            const bodyPartX = this.body[i].style.left;
            const bodyPartY = this.body[i].style.top;
            if(bodyPartX == posX+'px' && bodyPartY == posY+'px'){
                return true;
            }
        }
        return false;
    }
    /*This function is making the snake longer = creating a new div (body part) 
    * size = number of new body parts connected to the snake
    */
    grow(size){
        if(typeof size != 'number' || size<1) throw new Error("Invalid argument");
        // speed player up with growth (make the game harder)
        if(this.applesEaten%3==0 && this.speed > 200){
            this.speed -= 50;
            clearInterval(m);
            m = setInterval(move, this.speed);
        }
        // grow the player by given size
        for(let i = 0;i<size;i++){
            var tail = this.body[this.body.length-1].cloneNode();
            tail.style.backgroundColor = 'rgb(127, 187, 255)';
            playground.appendChild(tail);
            this.body.push(tail);
        }
    }
    //Searching if the snake has collided with an apple or himself
    checkCollision(){
        var snakeX = this.snakeHead.style.left;
        var snakeY = this.snakeHead.style.top;
        // check if player is dead
        if(this.body.length>1){
            for(let i = 1;i<this.body.length;i++){
                const bodyPartX = this.body[i].style.left;
                const bodyPartY = this.body[i].style.top;
                if(snakeX==bodyPartX&&snakeY==bodyPartY){
                    gameOver();
                }
            }
        }
        var apple = document.getElementById("apple");
        var appleX = apple.style.left;
        var appleY = apple.style.top;
        // check if an apple is being eaten and update score if it has
        // after eating an apple, grow, remove the apple div and create a new one
        if((appleX == snakeX)&&(appleY==snakeY)){
            score.innerHTML = "Score: "+(++this.applesEaten);
            const pb = localStorage.getItem('record_'+size);
            if(parseInt(pb)<this.applesEaten&&score.style.animation==''){
                score.style.animation = 'nameColor 3.5s infinite alternate';
            }
            if(score.style.animation==''){
                score.style.color = "rgb("+randomColor()+")";
            }
            apple.remove();
            this.grow(1);
            spawnApple(playground);
        }
    }
    // functions for the movement that are called with each interval
    moveLeft() {
        if(this.snakeHead.style.left == 0+'px') gameOver();
        else this.snakeHead.style.left = parseInt(this.snakeHead.style.left) - 50 + "px";    
    }
    moveUp() {
        if(this.snakeHead.style.top == 0+'px') gameOver();
        else this.snakeHead.style.top = parseInt(this.snakeHead.style.top) - 50 + "px";
    }
    moveRight() {
        if(this.snakeHead.style.left == (size*50-50)+'px') gameOver();
        else this.snakeHead.style.left = parseInt(this.snakeHead.style.left) + 50 + "px";
    }
    moveDown() {
        if(this.snakeHead.style.top == (size*50-50)+'px') gameOver();
        else this.snakeHead.style.top = parseInt(this.snakeHead.style.top) + 50 + "px";
    }
}
// export class Snake for testing purposes
try{
    module.exports = Snake;
}catch(e){}