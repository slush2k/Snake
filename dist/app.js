"use strict";
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
//const snakeSeg = document.getElementById("snakeSeg");
let SnakeMoveTickID;
//initArena
const arena = document.getElementById("canvas");
let ctx;
arena.width = window.innerHeight * 0.9;
arena.height = window.innerHeight * 0.9;
const gridDiv = 15;
const tileWidth = arena.height / gridDiv;
let Apple = {
    pointWorth: 100,
    xPos: 4,
    yPos: 0,
};
let snake = {
    length: 1,
    colourBody: "#1e81b0",
    colourEyes: "#000000",
    //colourEyes: "#ffffff",
    colourMouth: "#ff7581",
    colourApple: "#1e81b0",
    width: tileWidth * 0.9,
    moveDirection: Direction.Down,
    prevMoveDirection: Direction.Down,
    //Initial Starting Position
    xPos: 0,
    yPos: 0,
};
let snakeSegments = [
    {
        xPos: snake.xPos,
        yPos: snake.yPos,
    },
    {
        xPos: snake.xPos,
        yPos: snake.yPos - 1,
    },
    {
        xPos: snake.xPos,
        yPos: snake.yPos - 2,
    },
    {
        xPos: snake.xPos,
        yPos: snake.yPos - 3,
    },
];
const bevelOffset = (1 - snake.width / tileWidth) / 2;
if (arena.getContext("2d") !== null) {
    ctx = arena.getContext("2d");
}
else {
    throw new Error("Error Initializing Canvas");
}
function rect(x, y, size) {
    //Draws Squares
    ctx.fillStyle = snake.colourBody;
    ctx.fillRect(x, y, size, size);
}
function tileErase(x, y) {
    //Erases a tile
    ctx.clearRect(x * tileWidth, y * tileWidth, tileWidth, tileWidth);
}
function drawSegment(x, y) {
    //draw a segment;
    ctx.fillStyle = snake.colourBody;
    ctx.fillRect((x + bevelOffset) * tileWidth, (y + bevelOffset) * tileWidth, snake.width, snake.width);
}
function drawHead(x, y, dir) {
    //draw head
    drawSegment(x, y);
    //draw eyes
    ctx.fillStyle = snake.colourEyes;
    switch (dir) {
        case Direction.Up:
            ctx.fillRect((x + bevelOffset + 0.15) * tileWidth, (y + 0.15 + bevelOffset) * tileWidth, snake.width * 0.1, snake.width * 0.1);
            ctx.fillRect((x + 1 - bevelOffset - 0.15) * tileWidth - snake.width * 0.1, (y + 0.15 + bevelOffset) * tileWidth, snake.width * 0.1, snake.width * 0.1);
            break;
        case Direction.Left:
            ctx.fillRect((x + 0.15 + bevelOffset) * tileWidth, (y + bevelOffset + 0.15) * tileWidth, snake.width * 0.1, snake.width * 0.1);
            ctx.fillRect((x + 0.15 + bevelOffset) * tileWidth, (y + 1 - bevelOffset - 0.15) * tileWidth - snake.width * 0.1, snake.width * 0.1, snake.width * 0.1);
            break;
        case Direction.Right:
            ctx.fillRect((x + 1 - bevelOffset - 0.15) * tileWidth - snake.width * 0.1, (y + bevelOffset + 0.15) * tileWidth, snake.width * 0.1, snake.width * 0.1);
            ctx.fillRect((x + 1 - bevelOffset - 0.15) * tileWidth - snake.width * 0.1, (y + 1 - bevelOffset - 0.15) * tileWidth - snake.width * 0.1, snake.width * 0.1, snake.width * 0.1);
            break;
        case Direction.Down:
            ctx.fillRect((x + bevelOffset + 0.15) * tileWidth, (y + 1 - bevelOffset - 0.15) * tileWidth - snake.width * 0.1, snake.width * 0.1, snake.width * 0.1);
            ctx.fillRect((x + 1 - bevelOffset - 0.15) * tileWidth - snake.width * 0.1, (y + 1 - bevelOffset - 0.15) * tileWidth - snake.width * 0.1, snake.width * 0.1, snake.width * 0.1);
            break;
        default:
    }
}
function drawApple(x, y) {
    ctx.beginPath();
    ctx.arc((x + 0.5) * tileWidth, (y + 0.5) * tileWidth, 0.1 * tileWidth, 0, 2 * Math.PI);
    ctx.lineWidth = tileWidth * 0.3;
    ctx.strokeStyle = snake.colourApple;
    ctx.stroke();
}
function isAppleHere(x, y) {
    if (x === Apple.xPos && y === Apple.yPos) {
        return true;
    }
    else {
        return false;
    }
}
function spawnApple() {
    //Generate a randomized spawn.
    Apple.xPos = Math.floor(Math.random() * gridDiv);
    Apple.yPos = Math.floor(Math.random() * gridDiv);
    //Check if spawn is a snake tile
    for (let i = 0; i < snakeSegments.length; i++) {
        if (
        //if true, then generate another apple spawn
        snakeSegments[i].xPos === Apple.xPos &&
            snakeSegments[i].yPos === Apple.yPos) {
            i = 0;
            Apple.xPos = Math.floor(Math.random() * gridDiv);
            Apple.yPos = Math.floor(Math.random() * gridDiv);
        }
    }
    drawApple(Apple.xPos, Apple.yPos);
}
//Updates the latest key press to the snake direction
function UpdateMovementDirection(movement) {
    //console.log(snake.prevMoveDirection);
    switch (snake.prevMoveDirection) {
        case Direction.Up:
            if (movement === Direction.Down) {
                movement = snake.prevMoveDirection;
                return;
            }
            break;
        case Direction.Down:
            if (movement === Direction.Up) {
                movement = snake.prevMoveDirection;
                return;
            }
            break;
        case Direction.Left:
            if (movement === Direction.Right) {
                movement = snake.prevMoveDirection;
                return;
            }
            break;
        case Direction.Right:
            if (movement === Direction.Left) {
                movement = snake.prevMoveDirection;
                return;
            }
            break;
    }
    snake.moveDirection = movement;
}
//Directional key press handeler
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        //Moving Up
        case "w":
        case "ArrowUp":
            //console.log("Moving Up");
            UpdateMovementDirection(Direction.Up);
            break;
        //Moving Down
        case "s":
        case "ArrowDown":
            //console.log("Moving Down");
            UpdateMovementDirection(Direction.Down);
            break;
        //Moving Left
        case "a":
        case "ArrowLeft":
            //console.log("Moving Left");
            UpdateMovementDirection(Direction.Left);
            break;
        //Moving Right
        case "d":
        case "ArrowRight":
            //console.log("Moving Right");
            UpdateMovementDirection(Direction.Right);
            break;
        default: //Did not find the requested movement key
            //console.log("Not a movement key");
            break;
    }
});
//Detect if the snake has hit a wall
function CollisionDetectionWall() {
    if (snakeSegments[0].xPos > gridDiv - 1 ||
        snakeSegments[0].yPos > gridDiv - 1 ||
        snakeSegments[0].xPos < 0 ||
        snakeSegments[0].yPos < 0) {
        return true;
    }
    else {
        return false;
    }
}
//Determine if the snake has hit itself
function CollisionDetectionSnake() {
    for (let i = 1; i < snakeSegments.length; i++) {
        if (snakeSegments[0].xPos == snakeSegments[i].xPos &&
            snakeSegments[0].yPos == snakeSegments[i].yPos) {
            return true;
        }
    }
    return false;
}
//Get the stored movement direction and proceed to move snake in that direction
function MoveSnake() {
    snake.prevMoveDirection = snake.moveDirection;
    switch (snake.moveDirection) {
        case Direction.Down:
            snakeSegments.unshift({
                xPos: snakeSegments[0].xPos,
                yPos: snakeSegments[0].yPos + 1,
            });
            snake.yPos++;
            break;
        case Direction.Up:
            snakeSegments.unshift({
                xPos: snakeSegments[0].xPos,
                yPos: snakeSegments[0].yPos - 1,
            });
            snake.yPos--;
            break;
        case Direction.Left:
            snakeSegments.unshift({
                xPos: snakeSegments[0].xPos - 1,
                yPos: snakeSegments[0].yPos,
            });
            snake.xPos--;
            break;
        case Direction.Right:
            snakeSegments.unshift({
                xPos: snakeSegments[0].xPos + 1,
                yPos: snakeSegments[0].yPos,
            });
            snake.xPos++;
            break;
    }
    //remove the tail segment and add head segment
    const tail = snakeSegments.pop();
    tileErase(tail.xPos, tail.yPos);
    drawHead(snakeSegments[0].xPos, snakeSegments[0].yPos, snake.moveDirection);
    drawSegment(snakeSegments[1].xPos, snakeSegments[1].yPos);
    //if there is a collision
    if (CollisionDetectionWall() || CollisionDetectionSnake()) {
        console.log("Collision!!!");
        clearInterval(SnakeMoveTickID);
        return;
    }
    //Determine if the snake has reached an apple.
    if (isAppleHere(snakeSegments[0].xPos, snakeSegments[0].yPos)) {
        snakeSegments.push(tail); //extend the snake and spawn and apple
        spawnApple();
    }
}
//----Main----//
//rect(1, 1, tileWidth);
//drawHead(0, 1, Direction.Down);
//tileErase(0, 0);
SnakeMoveTickID = setInterval(MoveSnake, 75);
spawnApple();
//clearInterval(SnakeMoveTickID);
//drawHead(snakeSegments[0].xPos, snakeSegments[0].yPos, Direction.Down);
//drawSegment(snakeSegments[1].xPos, snakeSegments[1].yPos);
/*
  ctx.beginPath();
  ctx.arc(95, 50, 40, 0, 2 * Math.PI);
  ctx.stroke();
  
*/
