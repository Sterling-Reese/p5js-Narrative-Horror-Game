//Credits:  
//Sujit Yadav -player sprite  
//Dan Fiddis - love island background  
//rileygombart - zombies sprite

let playerX = 400;
let playerY = 500;
let playerSize = 50;
let lives = 3;
let enemies = [];
let scene = "start";
let startTime;
let timeLimit = 20000;

let playerImg;
let zombieImg;
let loveBg;
let gameBg;

function preload() {
  loveBg = loadImage("Title_Screen.jpg");
  gameBg = loadImage("background2.png");
  zombieImg = loadImage("run0030.png");
  playerImg = loadImage("survivor.png");
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(32);
  spawnEnemies();
}

function draw() {
  if (scene === "start") {
    image(loveBg, width / 2, height / 2, width, height);
    fill("white");
    text("Love Island Interactive Game", width / 2, height / 2 - 40);
    textSize(20);
    text("Click to start your journey", width / 2, height / 2 + 20);
  }

  else if (scene === "jk") {
    background("pink");
    fill("white");
    text("Just kidding", width / 2, height / 2);
  }

  else if (scene === "play") {
    image(gameBg, width / 2, height / 2, width, height);
    drawPlayer();
    handleEnemies();
    drawUI();
    drawTimer();

    if (millis() - startTime > timeLimit) 
      scene = "win";

    if (lives <= 0) 
      scene = "lose";
  }

  else if (scene === "lose") {
    background("red");
    fill("white");
    text("YOU'RE NOT VERY GOOD AT THIS", width / 2, height / 2 - 30);
    textSize(20);
    text("Click to play again", width / 2, height / 2 + 20);
  }

  else if (scene === "win") {
    background("green");
    fill("white");
    text("YOU SURVIVED", width / 2, height / 2 - 30);
    textSize(20);
    text("Click to play again", width / 2, height / 2 + 20);
  }
}

function mousePressed() {
  if (scene === "start") {
    scene = "jk";
    setTimeout(() => {
      scene = "play";
      startTime = millis();
    }, 1500);
  } 
  
  else if (scene === "lose" || scene === "win") {
    resetGame();
  }
}

function resetGame() {
  playerX = 400;
  playerY = 500;
  lives = 3;
  enemies = [];
  spawnEnemies();
  startTime = millis();
  scene = "play";
}

function spawnEnemies() {
  for (let i = 0; i < 7; i++) {
    enemies.push(new Enemy());
  }
}

function drawPlayer() {
  translate(playerX, playerY);
  rotate(-HALF_PI);
  image(playerImg, 0, 0, playerSize, playerSize);
  resetMatrix();

  if (keyIsDown(87)) 
    playerY -= 5;

  if (keyIsDown(83)) 
    playerY += 5;

  if (keyIsDown(65)) 
    playerX -= 5;

  if (keyIsDown(68)) 
    playerX += 5;

  playerX = constrain(playerX, 0, width);
  playerY = constrain(playerY, 0, height);
}

function handleEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].move();
    enemies[i].display();

    if (enemies[i].hitsPlayer(playerX, playerY, playerSize)) {
      lives--;
      enemies[i].reset();
    }

    if (enemies[i].y > height) {
      enemies[i].reset();
    }
  }
}

function drawUI() {
  fill("white");
  textSize(20);
  text("Lives: " + lives, 70, 30);
}

function drawTimer() {
  let remaining = max(0, timeLimit - (millis() - startTime));
  let seconds = floor(remaining / 1000);
  fill("white");
  textSize(20);
  text("Time Left: " + seconds + "s", width - 100, 30);
}

class Enemy {
  constructor() {
    this.reset();
    this.size = 120;
    this.speed = random(3, 6);
  }

  reset() {
    this.x = random(width);
    this.y = random(-200, -50);
  }

  move() {
    this.y += this.speed;
  }

  display() {
    translate(this.x + this.size / 2, this.y + this.size / 2);
    rotate(HALF_PI);
    image(zombieImg, 0, 0, this.size, this.size);
    resetMatrix();
  }

  hitsPlayer(px, py, pr) {
    let ex = this.x + this.size / 2;
    let ey = this.y + this.size / 2;
    let d = dist(ex, ey, px, py);
    return d < this.size / 2 + pr / 2;
  }
}
