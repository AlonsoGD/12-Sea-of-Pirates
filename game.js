//global variables
  const html = document.querySelector('html');
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const UPKEY = {
    keycode : 87,
    pressed : false 
  }
  const DOWNKEY = {
    keycode : 83,
    pressed : false
  }
  const LEFTKEY = {
    keycode : 65,
    pressed : false
  }
  const RIGHTKEY = {
    keycode : 68,
    pressed : false
  }
  const SPACEKEY = {
    keycode : 32,
    pressed : false
  }
  const LEFTCLICK = {
    keycode : 0,
    pressed : false
  }
  var width = canvas.width = window.innerWidth;
  var height = canvas.height = window.innerHeight;
  var startedGame = false;
  var mX = 0;
  var mY = 0;
//activate game
html.onclick = function () {
  if (startedGame === false) {
    startedGame = true;
    loop();
    return false;
  }
}

//game loop
function debugMode() {
  var cannondirection = [
    document.getElementById('cannondirectionX'), 
    document.getElementById('cannondirectionY'), 
    document.getElementById('cannonAngle'),
    document.getElementById('boatAngle'),
  ]
  cannondirection[0].innerHTML = playerCannon.directionX;
  cannondirection[1].innerHTML = playerCannon.directionY;
  cannondirection[2].innerHTML = playerCannon.targetAngle;
  cannondirection[3].innerHTML = playerBoat.boatAngleDegrees;
}

var playerBoat;
var playerCannon;
var seaTexture = new Image();
var cannonBalls = [];
seaTexture.src = 'media/watertexture.jpg';

function loop() {
  
  ctx.fillStyle = ctx.createPattern(seaTexture, "repeat");
  ctx.fillRect(0, 0, width, height);

  if (playerBoat === undefined) {
    playerBoat = new Boat ("Santa Maria", random(0, width), random(0, height));
  }
  
  if (playerCannon === undefined) {
    playerCannon = new Cannon(playerBoat.x, playerBoat.y, 20, 'transparent');
  }

  playerCannon.draw();
  playerBoat.draw();
  playerBoat.setControls();
  playerCannon.setControls();
  playerBoat.update();
  playerBoat.checkBounds();
  playerCannon.update(mX, mY);
  
  for (var i = 0; i < cannonBalls.length; i++){
    if (cannonBalls[i].exist === true) {
    cannonBalls[i].draw();
    cannonBalls[i].update();
    }
  }
  
  debugMode(); 

  requestAnimationFrame(loop);
}

// function to generate random number
function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

//Object common for every object in the boat or the boat itself. Determines its position, speed, turnspeed, thrust, etc.
function OnBoatObj (x, y) {
  this.x = x;
  this.y = y;

  this.isThrusting = false;
  this.thrust = 0.065;
  this.turnSpeed = 0.0002;
  this.angle = 0;
  this.friction = 0.98;

  this.px = 0;
  this.py = 0;

  this.velX = 0;
  this.velY = 0;
}

//Boat object constructor
function Boat(name, x, y) {
  OnBoatObj.call(this, x, y); //inherits OnBoatObj properties

  this.w = 65;
  this.h = 31;

  this.name = name;

  this.exist = true;
  this.hp = 100;

  this.boatTexture = new Image();
  this.boatTexture.src = 'media/playerShip.png';
}

Boat.prototype = Object.create(OnBoatObj.prototype);
Boat.prototype.constructor = Boat;

//Boat object methods 
Boat.prototype = {
  draw: function() {
    var radians = this.angle/Math.PI*180;
    this.boatAngleDegrees = radians*180/Math.PI;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(radians);
    ctx.drawImage(this.boatTexture, -(this.w*1.5)/2, -this.h/1.5);
    ctx.restore();
  },

  checkBounds: function() {
    if ((this.x) >= width + (this.w * 1.1)) {
      this.x = -(this.w);
    }
  
    if ((this.x) <= -(this.w * 1.1)) {
      this.x = width + (this.w);
     }
  
    if ((this.y ) >= height + (this.w * 1.1)) {
      this.y = -(this.w);
    }
  
    if ((this.y) <= -(this.w * 1.1)) {
      this.y = height + (this.w);
    }
  },

  turn: function(dir) {
    this.angle += this.turnSpeed * dir;
  },

  update: function() {
    var radians = this.angle/Math.PI*180;
    
    if(this.isThrusting){
      this.velX += Math.cos(radians) * this.thrust;
      this.velY += Math.sin(radians) * this.thrust;
    }
        
    // calc the point out in front of the ship
    this.px = this.x - this.pointLength * Math.cos(radians);
    this.py = this.y - this.pointLength * Math.sin(radians);

    // apply friction
    this.velX *= this.friction;
    this.velY *= this.friction;
    
    // apply velocities    
    this.x -= this.velX;
    this.y -= this.velY;
  },

  setControls: function() {
    var _this = this;

    window.onmousedown = function(event) {
      if (event.button === LEFTCLICK.keycode) {
        LEFTCLICK.pressed = true;
      }
    }

    window.onmouseup = function(event) {
      if (event.button === LEFTCLICK.keycode) {
        LEFTCLICK.pressed = false;
      }
    }

    window.onkeydown = function(event) {
      switch (event.which || event.keyCode) {
        case LEFTKEY.keycode: // Left
          LEFTKEY.pressed = true;
          break;
        case RIGHTKEY.keycode: // Right
          RIGHTKEY.pressed = true;
          break;
        case UPKEY.keycode: // Up
          UPKEY.pressed = true;
          break;
        case DOWNKEY.keycode: // Down
          DOWNKEY.pressed = true;
          break;
        // case SPACEKEY.keycode: //Shoot
        //   SPACEKEY.pressed = true;
        //   break;
      }
    }
  
    window.onkeyup = function(event) {
      switch (event.which || event.keyCode) {
        case LEFTKEY.keycode: // Left
          LEFTKEY.pressed = false;
          break;
        case RIGHTKEY.keycode: // Right
          RIGHTKEY.pressed = false;
          break;
        case UPKEY.keycode: // Up
          UPKEY.pressed = false;
          break;
        case DOWNKEY.keycode: // Down
          DOWNKEY.pressed = false;
          break;
        // case SPACEKEY.keycode: //Shoot
        //   SPACEKEY.pressed = false;
        //   break;
      }
    }
    
    if (this.isThrusting === true) {
      if (LEFTKEY.pressed === true) {
        _this.turn(-1); 
      } 
      if (RIGHTKEY.pressed === true) {
        _this.turn(1);
      } 
    }
    if (UPKEY.pressed === true) {
      _this.isThrusting = true;
    }
    if (UPKEY.pressed === false) {
      _this.isThrusting = false;
    }
  },

  collisionDetect: function() {

  },
  explode: function() {

  }
}

//Cannon object constructor
function Cannon(x, y, radius, color) {
  OnBoatObj.call(this, x, y); //inherits OnBoatObj properties

  

  this.radius = radius || 10;

  this.x = (this.x-this.radius/2)
  this.y = (this.y-this.radius/2);

  this.pointLength = 23;

  this.color = color || "rgba(255, 255, 255, 0.0);";
}

Cannon.prototype = Object.create(OnBoatObj.prototype);
Cannon.prototype.constructor = Cannon;

//Cannon Methods
Cannon.prototype = {
  update: function(x, y) {
    // get the target x and y
    this.targetX = mX;
    this.targetY = mY;
    
    this.directionX = this.x - this.targetX;
    this.directionY = this.y - this.targetY;
    var radians = Math.atan2(this.directionY, this.directionX);

    this.targetAngle = radians*(180/Math.PI);
    
    this.px = this.x - this.pointLength * Math.cos(radians);
    this.py = this.y - this.pointLength * Math.sin(radians);

    this.x = playerBoat.x;
    this.y = playerBoat.y;

    this.angle = playerBoat.angle;
  },

  draw: function() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    
    if (this.x <= width && this.x >= 0 && this.y <= height && this.y >= 0) { 
      ctx.strokeStyle = "rgb(0,0,0)";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.px, this.py);
      ctx.closePath();
      ctx.stroke();
    }
  },

  setControls: function() {
    canvas.addEventListener("mousemove", function (e) {
      mX = e.pageX;
      mY = e.pageY;
    });
    
    if (SPACEKEY.pressed === true || LEFTCLICK.pressed === true) {
      this.shoot();
      //SPACEKEY.pressed = false;
      LEFTCLICK.pressed = false;
    }
  },

  shoot: function() {
    if (cannonBalls.length < 10000) { 
      cannonBall = new CannonBall(playerCannon.px, playerCannon.py);
      cannonBalls.push(cannonBall);
    }
  },
}

//CannonBall object constructor
function CannonBall (x, y) {
  this.x = x;
  this.y = y;

  this.directionX = playerCannon.directionX * -1;
  this.directionY = playerCannon.directionY * -1;

  var len = Math.sqrt(this.directionX * this.directionX + this.directionY * this.directionY);
  this.directionX = this.directionX / len;
  this.directionY = this.directionY / len;

  this.speed = 5;

  this.radius = 4;

  this.exist = true;

  //this.cannonBallTexture = new Image();
  //this.cannonBallTexture.src = '';
}

//CannonBall Methods
CannonBall.prototype = {
  draw: function () {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  },

  update: function() {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  }
}