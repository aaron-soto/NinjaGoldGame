const SCALE = 2;
const WIDTH = 16;
const HEIGHT = 18;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const CYCLE_LOOP = [0, 1, 0, 2];
const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;
const FRAME_LIMIT = 8;
const MOVEMENT_SPEED = 3;

let canvas = document.querySelector('canvas');
let tilesize = 16
let screenRows = 31
let screenCols = 50
canvas.width = tilesize * screenCols
canvas.height = tilesize * screenRows

let ctx = canvas.getContext('2d');

ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

let keyPresses = {};
let currentDirection = FACING_DOWN;
let currentLoopIndex = 0;
let frameCount = 0;
let positionX = 0;
let positionY = 0;
let img = new Image();

let coins  = 0
let input1 = document.getElementById('testing');

let coinsValue = document.getElementById('coins')
coinsValue.innerText = coins
let messageValue = document.getElementById('message-value')
let notifyValue = document.getElementById('room-notify')




window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


function loadImage() {
  img.src = 'ninja_character.png';
  img.onload = function() {
    window.requestAnimationFrame(gameLoop);
  };
}

function drawFrame(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(img,
                frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
}

loadImage();


let globalRooms = []

class Room {
	constructor(x, y, width, height, goldMin, goldMax, value) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
    this.goldMin = goldMin;
    this.goldMax = goldMax;
		this.topBounds = this.y;
		this.bottomBounds = this.y + this.height;
		this.leftBounds = this.x;
		this.rightBounds = this.x + this.width;
    this.value = value;
    globalRooms.push(this)
	}

  checkBounds(positionX, positionY) {
    if (positionX > this.leftBounds && positionX < this.rightBounds && positionY > this.topBounds && positionY < this.bottomBounds)
    return true
  }

  performAction() {
    let deltaCoin = getRandomInt(this.goldMin, this.goldMax)
    coins = coins + deltaCoin
    let valueChange = "gained"
    if (deltaCoin < 0) {
      valueChange = "lost"
    }
    messageValue.innerText = `You ${valueChange} ${deltaCoin} coins at the ${this.value}!`
    coinsValue.innerText = coins
    input1.value = this.value
  }
}

let cave = new Room(50, 220, 100, 100, 0, 5, 'cave')
let casino = new Room(350, 50, 100, 100, -50, 50, 'casino')
let farm = new Room(650, 220, 100, 100, 10, 20, 'farm')
let house = new Room(350, 350, 100, 100, 2, 5, 'house')

function notifyRoom() {
  if (cave.checkBounds(positionX, positionY)) {
    notifyValue.innerText = cave.value
    }
  else if (casino.checkBounds(positionX, positionY)) {
    notifyValue.innerText = casino.value
    }
  else if (farm.checkBounds(positionX, positionY)) {
    notifyValue.innerText = farm.value
    }
  else if (house.checkBounds(positionX, positionY)) {
    notifyValue.innerText = house.value
    } else (
      notifyValue.innerText = ""
    )

}


document.addEventListener("keyup", event => {
	if (event.keyCode === 32) {
		if (cave.checkBounds(positionX, positionY)) {
			cave.performAction()
		  }
    if (casino.checkBounds(positionX, positionY)) {
      casino.performAction()
      }
    if (farm.checkBounds(positionX, positionY)) {
      farm.performAction()
      }
    if (house.checkBounds(positionX, positionY)) {
      house.performAction()
      }
	}
  });

  

  




// function drawMap() {
//   for (let i = 0; i < screenCols; i++) {
//     for(let j = 0; j < screenRows; j++) {
//       let randomSprite = Math.floor(Math.random() * 3);
//       ctx.drawImage(
//         grass_sheet,							// Image
//         tilesize * 0, tilesize * randomSprite,				// source x, y
//         tilesize, tilesize,						// source width, height
//         tilesize * i * SCALE, tilesize * j * SCALE,				// destination x, y
//         tilesize * SCALE, tilesize * SCALE		// destination width, height
//       )
//     }
    
//   }
// }


function gameLoop() {
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

  notifyRoom()
  
  

  


//   draw Grass


// ctx.drawImage(
// 	grass_sheet,							// Image
// 	tilesize * 0, tilesize * 0,				// source x, y
// 	tilesize, tilesize,						// source width, height
// 	tilesize * 5 * SCALE, tilesize * 6 * SCALE,				// destination x, y
// 	tilesize * SCALE, tilesize * SCALE		// destination width, height
// )
ctx.fillRect(cave.x, cave.y, cave.height, cave.width)
ctx.fillRect(casino.x, casino.y, casino.height, casino.width)
ctx.fillRect(farm.x, farm.y, farm.height, farm.width)
ctx.fillRect(house.x, house.y, house.height, house.width)



  let hasMoved = false;

  if (keyPresses.w) {
    moveCharacter(0, -MOVEMENT_SPEED, FACING_UP);
    hasMoved = true;
  } else if (keyPresses.s) {
    moveCharacter(0, MOVEMENT_SPEED, FACING_DOWN);
    hasMoved = true;
  }

  if (keyPresses.a) {
    moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
    hasMoved = true;
  } else if (keyPresses.d) {
    moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
    hasMoved = true;
  }

  


  

  if (hasMoved) {
    frameCount++;
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0;
      currentLoopIndex++;
      if (currentLoopIndex >= CYCLE_LOOP.length) {
        currentLoopIndex = 0;
      }
    }
  }

  if (!hasMoved) {
    currentLoopIndex = 0;
  }

  drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
  window.requestAnimationFrame(gameLoop);
}

function moveCharacter(deltaX, deltaY, direction) {
  if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
    positionX += deltaX;
  }
  if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height) {
    positionY += deltaY;
  }

  

  currentDirection = direction;
}