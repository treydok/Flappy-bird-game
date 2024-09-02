
let board;
let boardHeight = 640;
let boardWidth = 450;
let context;

let shipWidth = 34;
let shipHeight = 24;
let shipX = boardWidth/8;
let shipY = boardHeight/2;
let shipImg;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
};

let rockArray=[];
let rockWidth = 64;
let rockHeight = 512;

let rockX = boardWidth;

let rockY = 0;

let topRockImg;
let bottomRockImg;

let velocityX =-2;

let velocityY = 0;

let gravity = 0.4;

let gameOver = false;

let score = 0;

let background = new Audio("./space-img/backsound.mp3");

background.volume = .3;

let thruster = new Audio("./space-img/ship sound.mp3");

thruster.volume = .1;

let loss = new Audio("./space-img/youLose.mp3");

loss.volume = .3;

let backgroundIndex = 0;
const backgrounds = [
    "url('./space-img/back4.gif')",
    "url('./space-img/back3.jpg')",
    "url('./space-img/back2.gif')",
    "url('./space-img/back5.gif')"
   
]



window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");


    shipImg = new Image();
    shipImg.src = "./space-img/spaceship2.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x,ship.y,ship.width, ship.height);
    }

    topRockImg = new Image();
    topRockImg.src = "./space-img/rock.png"

    bottomRockImg = new Image();
    bottomRockImg.src = "./space-img/rock2.png"

    requestAnimationFrame(update);
    setInterval(placeRocks, 1500);
    document.addEventListener("keydown",moveShip);
    document.addEventListener("keyup", stopShip);
    document.addEventListener("keydown",changeBack);
}

function update(){
    requestAnimationFrame(update);
    if (gameOver){
        return;
        
    }

    context.clearRect(0,0,board.width,board.height);
     velocityY+= gravity;
     ship.y += velocityY; 



     if (ship.y + ship.height > boardHeight) {
        ship.y = boardHeight - ship.height;
        velocityY = 0; // stop the ship from falling further
    }

 

    context.drawImage(shipImg, ship.x,ship.y,ship.width, ship.height);
//addes astroids
    for(let i = 0; i < rockArray.length; i++) {
        let rock = rockArray[i];
        rock.x += velocityX;
        context.drawImage(rock.img, rock.x, rock.y,rock.width, rock.height);

        if( !rock.passed && ship.x > rock.x + rock.width){
            score += .5;
            rock.passed = true;
        }

        if(detectCollision(ship, rock)) {
            gameOver = true
            loss.play();
        }

    }

    while (rockArray.length > 0 && rockArray[0].x < -rockWidth){
        rockArray.shift();
    }

    context.fillStyle = "white";
    context. font = "45px sans serif";
    context.fillText(score,5,45);

    if(gameOver) {
        context.fillText("YOU LOSE",100, 300)
    }

}
//rock generation 
function placeRocks() {

    if(gameOver){
        return;
    }

    let randomRockY = rockY - rockHeight/4 - Math.random()*(rockHeight/2);

    let openingSpace = board.height/4;

    let topRock ={
        img : topRockImg,
        x: rockX,
        y: randomRockY,
        width: rockWidth,
        height: rockHeight,
        passed : false
    }

    rockArray.push(topRock);

    let bottomRock = {
        img : bottomRockImg,
        x: rockX,
        y: randomRockY + rockHeight + openingSpace, 
        width : rockWidth,
        height: rockHeight,
        passed :false
    }

    rockArray.push(bottomRock)
}

function moveShip(e) {
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
        velocityY = -6;

        shipImg.src = "./space-img/spaceship1.png";

        thruster.play();
        background.play();
        

        if(gameOver) {
            ship.y=shipY;
            rockArray = [];
            score = 0;
            gameOver = false;
            
        }
    }
}

function stopShip(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
        setTimeout(() => {
            shipImg.src = "./space-img/spaceship2.png";
        }, 800);
    }
}

function changeBack(e){
    if (e.code == "KeyE") {
        backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
        let board = document.getElementById("board");
        board.style.backgroundImage = backgrounds[backgroundIndex];
    }
}

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}