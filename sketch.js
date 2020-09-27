//storing objects
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var gameOver, restart;

function preload(){
  //loading images
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground.png");
  cloudImage = loadImage("cloud0.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("game over.jpg");
  restartImg = loadImage("reset.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  //creating trex
  trex = createSprite(50,height-100,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //creating ground
  ground = createSprite(200,height-35,800,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  //creating game over
  gameOver = createSprite(300,height-280);
  gameOver.addImage(gameOverImg);
  
  //creating restart
  restart = createSprite(300,height-220);
  restart.addImage(restartImg);
  
  //resizing game over and restart
  gameOver.scale = 0.5;
  restart.scale = 0.2;
  
  //making game over and restart invisible
  gameOver.visible = false;
  restart.visible = false;
  
  //creating invisible ground and making it invisible
  invisibleGround = createSprite(width/2,height-0,width,125);
  invisibleGround.visible = false;
  
  //making groups
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  //score
  score = 0;
}

function draw() {
  //trex.debug = true;
  //background
  background("skyblue");
  text("Score: "+ score, 500,50);
  
  //game state on play and end
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length>0 || keyDown("SPACE")) && trex.y>=height-120){
      
    }
  
    if(touches.length>0 || keyDown("space") && trex.y >= 120) {
      trex.velocityY = -12;
      touches=[];
    }
  
    //gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //reseting ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    //depth
    ground.depth=trex.depth;
    trex.deth=trex.depth+1;
    
    //making trex walk on invisible ground
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
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
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //restarting the game on pressong restart
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //creating clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,150));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -3;
    cloud.lifetime = 200;
    
    //depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding objects in a group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-80,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //adding objects in a group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  //reseting
  gameState = PLAY;
  //making game over and restart invisible
  gameOver.visible = false;
  restart.visible = false;
  
  //destroying the groups
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  //changing animation
  trex.changeAnimation("running",trex_running);
  
  
  
}