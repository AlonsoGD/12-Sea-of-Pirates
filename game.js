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
//activate game

html.onclick = function () {
  loop();
  return false;
}

//game loop
var playerBoat;
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
  this.w = 70;
  this.h = 120;

  this.exist = true;
  this.hp = 100;

  this.isThrusting = false;
  this.thrust = 0.1;
  this.turnSpeed = 0.001;
  this.angle = 0;
  this.friction = 0.985;
  this.maxSpeed = 0.1;

  this.pointLength = 20;
  this.px = 0;
  this.py = 0;

  this.velX = 0;
  this.velY = 0;

  this.texture = new Image();
  this.texture.src = 'media/playerShip.png';
}

//Boat object methods 
Boat.prototype = {
  draw: function() {
    ctx.drawImage(this.texture, this.x, this.y, this.w, this.h);
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
  
    if (LEFTKEY.pressed === true) {
      _this.turn(-1);
    } 
    if (RIGHTKEY.pressed === true) {
      _this.turn(1);
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
