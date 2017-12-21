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
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var startedGame = false;
var mX = 0
var mY = 0
//activate game

html.onclick = function () {
  if (startedGame === false) {
    startedGame = true;
    loop();
    return false;
  }
}

//game loop
var playerBoat;
var playerCannon;
var seaTexture = new Image();
seaTexture.src = 'media/watertexture.jpg';

function loop() {
  
  ctx.fillStyle = ctx.createPattern(seaTexture, "repeat");
  ctx.fillRect(0, 0, width, height);

  if (playerBoat === undefined) {
    playerBoat = new Boat ("Santa Maria", random(0, width), random(0, height));
  }
  playerBoat.draw();
  playerBoat.setControls();
  playerBoat.update();
  playerBoat.checkBounds();

  if (playerCannon === undefined) {
    playerCannon = new Cannon(playerBoat.x, playerBoat.y, 1);
  }
  playerCannon.setControlsCannons();
  playerCannon.updateCannon(mX, mY);
  playerCannon.renderCannon();
  playerCannon.setControls();
  playerCannon.update();
  playerCannon.checkBounds();

  requestAnimationFrame(loop);
}

// function to generate random number
function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

//Boat object constructor
function Boat(name, x, y) {
  this.name = name;

  this.x = x;
  this.y = y;

  this.w = 90;
  this.h = 41;

  this.exist = true;
  this.hp = 100;

  this.isThrusting = false;
  this.thrust = 0.065;
  this.turnSpeed = 0.0002;
  this.angle = 0;
  this.friction = 0.98;

  this.pointLength = 20;
  this.px = 0;
  this.py = 0;

  this.velX = 0;
  this.velY = 0;

  this.boatTexture = new Image();
  this.boatTexture.src = 'media/playerShip.png';
}

//Boat object methods 
Boat.prototype = {
  draw: function() {
    var radians = this.angle/Math.PI*180;

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

  },
  shoot: function() {

  }
}

//Cannon object constructor
function Cannon(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius || 10;

  this.w = 90;
  this.h = 41;
  
  this.x = (this.x-this.radius/2)
  this.y = (this.y-this.radius/2);

  this.isThrusting = false;
  this.thrust = 0.065;
  this.turnSpeed = 0.0002;
  this.angle = 0;
  this.friction = 0.98;

  this.pointLength = 100;
  this.px = 0;
  this.py = 0;

  this.velX = 0;
  this.velY = 0;

  this.color = color || "rgb(255,0,0)";
}

//Cannon Methods
Cannon.prototype = {
  updateCannon: function(x, y) {
    // get the target x and y
    this.targetX = x;
    this.targetY = y;
    
    var x = this.x - this.targetX;
    var y = this.y - this.targetY;
    var radians = Math.atan2(y,x);
    
    this.px = this.x - this.pointLength * Math.cos(radians);
    this.py = this.y - this.pointLength * Math.sin(radians);
  },

  renderCannon: function() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = "rgb(0,0,255)";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.px, this.py);
    ctx.closePath();
    ctx.stroke();
  },

  setControlsCannons: function() {
    canvas.addEventListener("mousemove", function (e) {
      mX = e.pageX;
      mY = e.pageY;
    });
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
}