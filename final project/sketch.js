var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bgImg;
var sun, sunImg;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var jump, collide;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage = ["HighestScore"];
localStorage[0] = 0;

function preload(){
  trex_running =   loadImage("black_plane.png");
  //trex_collided = loadAnimation("trex_collided.png");
  
  sunImg = loadImage("sun.png");
  
  bgImg = loadImage("star background.jpg");
  
  groundImage = loadImage("groundd.png");
  
  cloudImage = loadImage("fireball.png");
  
  obstacle1 = loadImage("robot.png");
  obstacle2 = loadImage("snakess.png");
  obstacle3 = loadImage("obstacle3.png");
  
  jump = loadSound("jump.wav");
  collide = loadSound("collided.wav");
  
  gameOverImg = loadImage("please  work.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-90,120,10,10);
  sun.addImage(sunImg);
  sun.scale = 0.15;
  
  trex = createSprite(200, height/2,50,20);
  
  trex.addImage("running", trex_running);
  //trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  trex.setCollider("circle", 0, 0, 50);
  
  ground = createSprite(width/2,height,width,20);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.scale=2;
  ground.velocityX = -(1 + score/200);
  
  gameOver = createSprite(width/2,height/2 - 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2 + 50);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2, height-70,width, 10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(bgImg);
  fill("cyan")
  textSize(20);
  textFont("Comic Sans MS");
  text("Score: "+ score, width/5, height/10);
  text("HI: "+ localStorage[0], width/20, height/10);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    /*if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-180) {
      jump.play( )
      trex.velocityY = -10;
      touches = [];
    }*/
  
    //trex.velocityY = trex.velocityY + 0.6
    
    if (ground.x < 300){
      ground.x = ground.width/2;
    }
    if(keyDown("UP_ARROW")){
    trex.y=trex.y-5
    }
    if(keyDown("DOWN_ARROW")){
trex.y=trex.y+5
    }
    if(keyDown("LEFT_ARROW")&&trex.x>150){
      trex.x=trex.x-5
          }
          if(keyDown("RIGHT_ARROW")&&trex.x<windowWidth-150){
            trex.x=trex.x+5
                }

   // trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)||cloudsGroup.isTouching(trex)){
        gameState = END;
        collide.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
   // trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  ground.depth = trex.depth;
  trex.depth = trex.depth + 1;
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(height-300,height-700));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    cloud.depth = sun.depth;
    sun.depth = sun.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(width,height-95,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = (0.2);
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = (0.1);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.8;
    obstacle.lifetime = 300;
    obstacle.collide(ground)
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage[0]<score){
    localStorage[0] = score;
  }
  console.log(localStorage[0]);
  
  score = 0;
  
}