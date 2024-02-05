// Get the canvas element
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

// Set canvas width and height
canvas.width = 750;
canvas.height = 600;
//let animationInterval; // Declare animation interval variable outside of functions

// function startAnimation() {
//   let animationIndex = 0;
//   const animationFrames = [0, 1, 2]; // Example animation frames

//   animationInterval = setInterval(() => {
//     // Draw the character with the current animation frame
//     drawFrame(
//       animationFrames[animationIndex],
//       currentDirection,
//       positionX,
//       positionY
//     );
//     animationIndex = (animationIndex + 1) % animationFrames.length; // Cycle through animation frames
//   }, 100); // Adjust the interval as needed for animation speed
// }

//declare for character bug

const SCALE = 2; //scale of character
const WIDTH = 16; //character
const HEIGHT = 18;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const CYCLE_LOOP = [0, 1, 0, 2];
const FACING_DOWN = 3; //character facing in sprite
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;
const FRAME_LIMIT = 12;
const MOVEMENT_SPEED = 0; //character forward

let frameX = 0;
let frameY = 0;
let keyPresses = {};
let currentDirection = FACING_DOWN;
let currentLoopIndex = 0;
let frameCount = 0;
let positionX = 0;
let positionY = 115; //226 //character(man) position
let img = new Image();
let birdImg = new Image();
// Define the y-coordinates of the line paths
const linePaths = [230, 345, 115]; // 115 difference in line path so
let currentLineIndex = 265; // Track the current line path index


// Define variables for jump action
let isJumping = false;
const jumpHeight = 50;
let jumpCount = 0;
let initialJumpPositionY = 0;

// Update keyDownListener to handle spacebar press
window.addEventListener("keydown", keyDownListener);

function keyDownListener(event) {
  keyPresses[event.key] = true;

  if (event.key === " ") {
    // Start jump action if spacebar is pressed
    if (!isJumping) {
      isJumping = true;
      jumpCount = 0;
      initialJumpPositionY = positionY; // Store initial position before jump
    }
  } else if (event.key === "ArrowDown") {
    currentLineIndex++; // Move to the next line path
    if (currentLineIndex >= linePaths.length) {
      currentLineIndex = 0; // Wrap around to the first line path if exceeding the array length
    }
    // Update the character's position to the new line path
    positionY = linePaths[currentLineIndex];
    movesoundeffect.play();
  }
}


/*

===== Load Image  ========

*/


function loadImage() {
  img.src =
    "./images/Green-Cap-Character.png";
  birdImg.src = "./images/Birds.png";
  img.onload = function () {
    birdImg.onload = function () {
      // window.requestAnimationFrame(gameLoop);
    };
    window.requestAnimationFrame(gameLoop);
  };
}

loadImage();

/*

===== Add  a Bird Obstacle (sprite)  ========

*/

// Define bird properties
const birdWidth = 35; // Adjust according to the width of your bird sprite
const birdHeight = 35; // height of your bird sprite
let birdX = 600; //Initial x-coordinate of the bird
let birdY = 229;
let sx = 0; // Adjust according to the x-coordinate of the frame within the sprite sheet
let sy = 3; // y-coordinate of the frame within the sprite sheet
let sw = 15; // Adjust according to the width of the frame
let sh = 15; // height of the frame
//let birdVelocityX = -2; // Adjust according to the horizontal velocity of the bird

// Define initial positions and velocities for each bird
let birds = [
  { x: 730, y: 229, velocityX: -1 }, // Bird on the first path
  { x: 728, y: 115, velocityX: -0.5 }, // Bird on the second path
  { x: 731, y: 345, velocityX: -2 }, // Bird on the third path
];

function drawBird(x, y) {
  //ctx.drawImage(birdImg, sx, sy, sw, sh, x, y, birdWidth, birdHeight);
  ctx.drawImage(birdImg, 0, 3, 15, 15, x, y, birdWidth, birdHeight);
}

function updateBirdPosition(birds) {
  // Update bird's x-coordinate based on its velocity
  birds.x += birds.velocityX;

  // If the bird goes off-screen from the left, reset its position to the right side of the canvas
  if (birds.x + birdWidth < 0) {
    birds.x = canvas.width;
  }
}

function generateBirds() {
  // Generate birds for each path with a random delay
  for (let i = 0; i < birds.length; i++) {
    let path = birds[i];
    setTimeout(() => {
      setInterval(() => {
        drawBird(path.x, path.y);
        updateBirdPosition(path);
      }, 200); // Adjust the delay here (in milliseconds) for smoother movement
    }, Math.random() * 100); // Adjust the maximum delay here (in milliseconds)
  }

  // Generate additional random birds at predefined positions with a random delay
  setInterval(() => {
    let randomPathIndex = Math.floor(Math.random() * birds.length);
    let randomPath = birds[randomPathIndex];
    drawBird(randomPath.x, randomPath.y);
  }, 100); // Adjust the delay here (in milliseconds) for random bird generation
}

/*

===== Detect the Collision ========

*/

function detectCollision() {
  // Calculate the bounding boxes of the character and bird sprites
  const characterBoundingBox = {
    x: positionX,
    y: positionY,
    width: SCALED_WIDTH,
    height: SCALED_HEIGHT,
  };
  // Iterate over each bird and check for collision
  for (let i = 0; i < birds.length; i++) {
    const bird = birds[i];
    const birdBoundingBox = {
      x: bird.x,
      y: bird.y,
      width: birdWidth,
      height: birdHeight,
    };

    // Check for collision between bounding boxes
    if (
      characterBoundingBox.x < birdBoundingBox.x + birdBoundingBox.width &&
      characterBoundingBox.x + characterBoundingBox.width > birdBoundingBox.x &&
      characterBoundingBox.y < birdBoundingBox.y + birdBoundingBox.height &&
      characterBoundingBox.y + characterBoundingBox.height > birdBoundingBox.y
    ) {
      // Collision detected
      return true;
    }
  }
  // No collision
  return false;
}

//drawimage(image,sx,sy,sw,sh,dx,dy,dw,dh)
function drawFrame(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(
    img,
    frameX * WIDTH,
    frameY * HEIGHT,
    WIDTH,
    HEIGHT,
    canvasX,
    canvasY,
    SCALED_WIDTH,
    SCALED_HEIGHT
  );
}

/*

===== Draw a wire  ========

*/

function drawWire() {
  ctx.beginPath();
  ctx.strokeStyle = "#750E21";
  ctx.lineWidth = 2;
  ctx.moveTo(0, 150);
  ctx.lineTo(800, 150);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#750E21";
  ctx.lineWidth = 2;
  ctx.moveTo(0, 265);
  ctx.lineTo(800, 265);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#750E21";
  ctx.lineWidth = 2;
  ctx.moveTo(0, 380);
  ctx.lineTo(800, 380);
  ctx.stroke();
}

/*

===== Draw a wire End   ========

*/

function restartGame() {
  // Hide the game over popup
  document.getElementById("popupBox").style.display = "none";

  // Reset the game state
  score = 0;
  timer = 0;
  secondsElapsed = 0;
  lastUpdateTime = 0; // Reset the last update time for timer calculation

  document.location.reload();
  window.requestAnimationFrame(gameLoop);
}


/*

===== For Game Instruction   ========

*/

let showInstructions = true; // Variable to control whether to show instructions or not

function gameInstruction() {
  if (showInstructions) {
    ctx.font = "bold 34px serif";
    ctx.textAlign = "center"; // Center the text horizontally

    // Alternate between displaying and hiding the text every 500 milliseconds
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      ctx.fillStyle = "yellow";
    } else {
      ctx.fillStyle = "transparent"; // Hide the text
    }
    ctx.fillText("Press ' Enter ' key to start game", canvas.width / 2, 260);
  }
}

function showinstruction() {

  showInstructions = false;

}


/*

===== Game Instruction End   ========

*/



//main function

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawWire();
  drawTimerAndScore();
  gameInstruction();

  let hasMoved = false;

  if (keyPresses.a) {
    //moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
    hasMoved = false;
  } else if (keyPresses.Enter) {
    backgroundmusic.pause();
    showinstruction();

    // Check for collision between character and bird sprites
    if (detectCollision()) {
      collisionsoundeffect.play();
      const currentscore = score;
      updateHighScore(score);
      const highScore = getHighScoreFromLocalStorage();
      displayHighScore(highScore);
      showGameOverPopup(currentscore, highScore);
      //clearInterval(animationInterval); // Needed for Chrome to end game

      return;
    } else {
      moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
      hasMoved = true;
      // Start character animation
      // animateCharacter();
      moveBackground(1);

      // Draw the bird
      birds.forEach((bird) => {
        drawBird(bird.x, bird.y);
        updateBirdPosition(bird);
      });
      generateBirds();
      updateTimerAndScore();
    }
  }

  // Update animation frame

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

  drawFrame(
    CYCLE_LOOP[currentLoopIndex],
    currentDirection,
    positionX,
    positionY
  );

  window.requestAnimationFrame(gameLoop);
}


/*

===== move the character  ========

*/

function moveCharacter(deltaX, deltaY, direction) {
  if (
    positionX + deltaX > 0 &&
    positionX + SCALED_WIDTH + deltaX < canvas.width
  ) {
    positionX += deltaX;
  }
  if (
    positionY + deltaY > 0 &&
    positionY + SCALED_HEIGHT + deltaY < canvas.height
  ) {
    positionY += deltaY;
  }
  currentDirection = direction;

  // Implement jump action
  if (isJumping) {
    // Calculate jump motion
    positionY =
      initialJumpPositionY -
      2 * Math.sin((jumpCount * Math.PI) / 20) * jumpHeight;
    jumpCount++;
    jumpsoundeffect.play();

    // End jump action
    if (jumpCount >= 20) {
      isJumping = false;
      positionY = initialJumpPositionY; // Reset position after jump
    }
  }
}

/*

===== Move character End  ========

*/

/*

===== move the background image ========

*/

function moveBackground(deltaX) {
  // Move the background element
  var background1 = document.getElementById("background1");
  var background2 = document.getElementById("background2");

  background1.style.backgroundPositionX =
    parseInt(background1.style.backgroundPositionX || 0) - deltaX + "px";
  background2.style.backgroundPositionX =
    parseInt(background2.style.backgroundPositionX || 0) - deltaX + "px";

  //background.style.backgroundPositionY = parseInt(background.style.backgroundPositionY || 0) + deltaY + 'px';
}
// Call moveBackground(deltaY) in your character animation function
function animateCharacter() {
  // Move the background vertically (adjust deltaY as needed for speed)
  moveBackground(0.8);

  // Request the next frame
  requestAnimationFrame(animateCharacter);
}

/*

===== Move Background End  ========

*/

/*

===== For the Score  ========

*/
let timer = 0;
let score = 0;
let lastUpdateTime = Date.now();
let lastSecondUpdateTime = 0;
let secondsElapsed = 0;

function updateTimerAndScore() {
  let currentTime = Date.now();
  let elapsedTime = currentTime - lastUpdateTime;
  lastUpdateTime = currentTime;

  // Increment the timer based on elapsed time
  secondsElapsed += elapsedTime / 1000; // Convert milliseconds to seconds

  // Check if a second has passed
  if (currentTime - lastSecondUpdateTime >= 1000) {
    lastSecondUpdateTime = currentTime;
    // Increment the score by 1 for every second elapsed
    score += 1;
  }
}

function drawTimerAndScore() {
  ctx.font = "bold 29px serif";
  ctx.fillStyle = "#ffffff";
  // Calculate hours, minutes, and seconds
  let hours = Math.floor(secondsElapsed / 3600);
  let minutes = Math.floor((secondsElapsed % 3600) / 60);
  let seconds = Math.floor(secondsElapsed % 60);

  // Format the timer
  let timerString = `${hours.toString().padStart(2, "0")}:${minutes .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Draw the timer onto the canvas
  //ctx.fillText("Timer: " + timerString, 10, 30);
  //ctx.fillText("Timer: " + Math.floor(secondsElapsed), 10, 30);
  ctx.fillText("Score: " + score, 60, 40);
}

// Update the player's high score if needed
function updateHighScore(score) {
  const highScore = getHighScoreFromLocalStorage();
  if (score > highScore) {
    saveScoreToLocalStorage(score);
    return score;
  }
  return highScore;
}

// Save the player's score to local storage
function saveScoreToLocalStorage(score) {
  localStorage.setItem("highScore", score.toString());
}

// Retrieve the high score from local storage
function getHighScoreFromLocalStorage() {
  const highScore = localStorage.getItem("highScore");
  return highScore ? parseInt(highScore) : 0;
}

// Display the high score on the game interface
function displayHighScore(highScore) {
  ctx.font = "bold 23px Arial";
  ctx.fillStyle = "#ffff";
  ctx.fillText("High Score: " + highScore, 80, 100);
}

// Function to display the pop-up box with the player's score and high score

function showGameOverPopup(currentscore, highScore) {
  document.getElementById("playerScore").textContent = currentscore;
  document.getElementById("highScore").textContent = highScore;
  document.getElementById("popupBox").style.display = "block";

  // Add event listener to the restart button
  document
    .getElementById("restartgamebtn")
    .addEventListener("click", restartGame);
}

/*

===== Score End  ========

*/

/*

===== For Audio  ========

*/

const backgroundmusic = new Audio("./audio/bgmusic.mp3");
const gamesoundeffect = new Audio("./audio/soundeffect.wav");
const jumpsoundeffect = new Audio("./audio/jumpSE.mp3");
const collisionsoundeffect = new Audio("./audio/collisionsoundeffect.wav");
const movesoundeffect = new Audio("./audio/moveSE.wav");
let backgroundmusicPlaying = false;
let gamesoundeffectPlaying = false;

document.addEventListener("keydown", function (event) {
  if (event.key === "x") {
    togglebackgroundMusic();
  }
});

function togglebackgroundMusic() {
  if (!backgroundmusicPlaying) {
    backgroundmusic.play();
    backgroundmusicPlaying = true;
  } else {
    backgroundmusic.pause();
    backgroundmusicPlaying = false;
  }
}

/*

===== For Audio End ========

*/
