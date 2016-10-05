// Inits
window.onload = function init() {
  var game = new GF();
  game.start();
};

//Definition des objets
var etat_personnage = {
  enVie : 0,
  detruit : 1,
};

function ObjetGraphique(x1, y1, w1, h1) {
  var x=x1, y=y1, w=w1, h=h1;
  var speed = 1;
  function draw(ctx) {
    ctx.fillRect(x, y, w, h);
  }

  function getX() {
    return x;
  }

  function setX(x1) {
    x = x1;
  }
  function getY() {
    return y;
  }

  function setY(y1) {
    y = y1;
  }
  function getW() {
    return w;
  }
  function getSpeed(){
    return speed;
  }
  function setSpeed(s1){
    speed = s1;
  }

  return {
    draw:draw,
    getSpeed:getSpeed,
    setSpeed:setSpeed,
    getX:getX,
    getY: getY,
    setX: setX,
    setY:setY,
    getW:getW
  }
}

function Vaisseau(x, y, w, h, v){
  var api = new ObjetGraphique(x, y, w, h);
  var vie = v;
  var etat = etat_personnage.enVie;
  // redéfinition
  var superDraw = api.draw;

  api.draw = function(ctx) {
    //console.log('draw redéfini dans Vaisseau');
    ctx.fillStyle = 'red';
    // appel de la méthode de la pseudo classe mère que l'on
    // a redéfini
    superDraw.call(this, ctx);
  }
  return api;
}

function Monstre(x, y, w, h, e){
  var api = new ObjetGraphique(x, y, w, h);
  var etat = etat_personnage.enVie;
  // redéfinition
  var superDraw = api.draw;


  api.draw = function(ctx) {
    //console.log('draw redéfini dans Monstre');
    ctx.fillStyle = 'green';
    // appel de la méthode de la pseudo classe mère que l'on
    // a redéfini
    superDraw.call(this, ctx);
  }
  return api;
}

// GAME FRAMEWORK STARTS HERE
var GF = function(){
  // Vars relative to the canvas
  var canvas, ctx, w, h;

  // etat du jeu
  var etats = {
    menuPrincipal : 0,
    jeuEnCours : 1,
    gameOver : 2,
  };

  var etatCourant = etats.jeuEnCours;

  // vars for counting frames/s, used by the measureFPS function
  var frameCount = 0;
  var lastTime;
  var fpsContainer;
  var fps;
  // for time based animation
  var delta, oldTime = 0;

  // vars for handling inputs
  var inputStates = {};

  // The monster !
  var monster = {
    x:200,
    y:200,
    speed:100, // pixels/s this time !
    boundingCircleRadius: 70
  };

  var objetsGraphiques = [];
  var objetsMonstres = [];
  for(var i=1; i<=5; i++){
    for (var j=1; j<=10; j++){
      var monstre = new Monstre(j*50, i*50, 30, 30);
      objetsMonstres.push(monstre);
    }
  }

  var objetsVaisseaux = [];
  var vaisseau = new Vaisseau(600, 500, 60, 30);
  objetsVaisseaux.push(vaisseau);

  // array of balls to animate
  var ballArray = [];

  // We want the rectangle to move at speed pixels/s (there are 60 frames in a second)
  // If we are really running at 60 frames/s, the delay between frames should be 1/60
  // = 16.66 ms, so the number of pixels to move = (speed * del)/1000. If the delay is twice
  // longer, the formula works : let's move the rectangle twice longer!
  var calcDistanceToMove = function(delta, speed) {
    //console.log("#delta = " + delta + " speed = " + speed);
    return (speed * delta) / 1000;
  };

  var measureFPS = function(newTime){

    // test for the very first invocation
    if(lastTime === undefined) {
      lastTime = newTime;
      return;
    }

    //calculate the difference between last & current frame
    var diffTime = newTime - lastTime;

    if (diffTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = newTime;
    }

    //and display it in an element we appended to the
    // document in the start() function
    fpsContainer.innerHTML = 'FPS: ' + fps;
    frameCount++;
  };

  // clears the canvas content
  function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
  }

  function timer(currentTime) {
    var delta = currentTime - oldTime;
    oldTime = currentTime;
    return delta;

  }
  var mainLoop = function(time){
    // Clear the canvas
    clearCanvas();

    if(monster.dead) {
      etatCourant = etats.gameOver;
    }

    switch(etatCourant) {
      case etats.jeuEnCours:
      //main function, called each frame
      measureFPS(time);

      // number of ms since last frame draw
      delta = timer(time);

      objetsMonstres.forEach(function f(elem) {
        //Dessiner
        elem.draw(ctx);
        updateMonster(delta, elem);
        //Update les positions
        //Test des collisions
      });
      objetsVaisseaux.forEach(function f(elem) {
        //Dessiner
        elem.draw(ctx);
        //Update les positions
        updateVaisseauPosition(delta, elem);
        //Test des collisions
      });
      break;
      case etats.gameOver:
      //console.log("GAME OVER");
      ctx.fillText("GAME OVER", 100, 100);
      ctx.fillText("Press SPACE to start again", 100, 150);

      if(inputStates.space) {
        //console.log("space enfoncee");
        createBalls(4);
        etatCourant = etats.jeuEnCours;
      }
      break;

    }
    requestAnimationFrame(mainLoop);
  };


  function updateVaisseauPosition(delta, elem) {
    elem.speedX = elem.speedY = 0;
    // check inputStates
    if (inputStates.left) {
      elem.speedX = -elem.speed;
    }
    /*if (inputStates.up) {
    elem.speedY = -elem.speed;
  }*/
  if (inputStates.right) {
    elem.speedX = elem.speed;
  }
  elem.speed = 100;
  // COmpute the incX and inY in pixels depending
  // on the time elasped since last redraw
  elem.setX(elem.getX() + calcDistanceToMove(delta, elem.speedX));
  elem.setY(elem.getY() + calcDistanceToMove(delta, elem.speedY));
}

function updateMonster(delta, elem) {
  // for each ball in the array

  // 1) move the ball
  elem.setX(elem.getX() + 2*elem.getSpeed() );
  //console.log(elem.getSpeed());

  // 2) test if the ball collides with a wall
  testCollisionWithWalls(elem);

  //Collision avec missiles

  /*if(circRectsOverlap(monster.x-50, monster.y-50, 100, 100, ball.x, ball.y, ball.radius)) {

  //console.log("collision");
  ball.color = 'red';
  monster.dead = true;
}*/

// 3) draw the ball
//monstre.draw(ctx);
}

// Teste collisions entre cercles
function circleCollide(x1, y1, r1, x2, y2, r2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));
}
// Collisions between rectangle
function rectsOverlap(x0, y0, w0, h0, x2, y2, w2, h2) {
  if ((x0 > (x2 + w2)) || ((x0 + w0) < x2))
  return false;

  if ((y0 > (y2 + h2)) || ((y0 + h0) < y2))
  //return false;
  return true;
}

// Collisions between rectangle and circle
/*function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
var testX=cx;
var testY=cy;

if (testX < x0) testX=x0;
if (testX > (x0+w0)) testX=(x0+w0);
if (testY < y0) testY=y0;
if (testY > (y0+h0)) testY=(y0+h0);

return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))<r*r);
}*/

function testCollisionWithWalls(monstre) {
  // left
  if (monstre.getX() < (monstre.getW()*-1) ) {
    monstre.setSpeed(1);
    monstre.setY(monstre.getY()+10);
  }
  // right
  if (monstre.getX() > canvas.width ) {
    monstre.setSpeed(-1);
    monstre.setY(monstre.getY()+10);
  }
}

function getMousePos(evt) {
  // necessary to take into account CSS boudaries
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

/*function createBalls(numberOfBalls) {
for(var i=0; i < numberOfBalls; i++) {
// Create a ball with random position and speed.
// You can change the radius
var ball =  new Ball(w*Math.random(),
h*Math.random(),
(2*Math.PI)*Math.random(),
50,
30);

if(!circleCollide(ball.x, ball.y, ball.radius,
monster.x, monster.y, monster.boundingCircleRadius)) {
// On la rajoute au tableau
ballArray[i] = ball;
} else {
i--;
}
}
}*/
// constructor function for balls
/*function Ball(x, y, angle, v, diameter, color) {
this.x = x;
this.y = y;
this.angle = angle;
this.v = v;
this.radius = diameter/2;
this.color = color;
this.dead = false;

this.draw = function() {
// si la balle est "morte" on ne fait rien
if(this.dead) return;

ctx.save();
ctx.beginPath();
ctx.fillStyle = this.color;
ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
ctx.fill();
ctx.restore();
this.color = 'black';
};

this.move = function() {
// si la balle est "morte" on ne fait rien
if(this.dead) return;

// add horizontal increment to the x pos
// add vertical increment to the y pos

var incX = this.v * Math.cos(this.angle);
var incY = this.v * Math.sin(this.angle);

this.x += calcDistanceToMove(delta, incX);
this.y += calcDistanceToMove(delta, incY);
};
}*/

var start = function(){
  // adds a div for displaying the fps value
  fpsContainer = document.createElement('div');
  document.body.appendChild(fpsContainer);

  // Canvas, context etc.
  canvas = document.querySelector("#myCanvas");

  // often useful
  w = canvas.width;
  h = canvas.height;

  // important, we will draw with this object
  ctx = canvas.getContext('2d');
  // default police for text
  ctx.font="20px Arial";

  //add the listener to the main, window object, and update the states
  window.addEventListener('keydown', function(event){
    if (event.keyCode === 37) {
      inputStates.left = true;
    } else if (event.keyCode === 38) {
      inputStates.up = true;
    } else if (event.keyCode === 39) {
      inputStates.right = true;
    } else if (event.keyCode === 40) {
      inputStates.down = true;
    }  else if (event.keyCode === 32) {
      inputStates.space = true;
    }
  }, false);

  //if the key will be released, change the states object
  window.addEventListener('keyup', function(event){
    if (event.keyCode === 37) {
      inputStates.left = false;
    } else if (event.keyCode === 38) {
      inputStates.up = false;
    } else if (event.keyCode === 39) {
      inputStates.right = false;
    } else if (event.keyCode === 40) {
      inputStates.down = false;
    } else if (event.keyCode === 32) {
      inputStates.space = false;
    }
  }, false);

  // Mouse event listeners
  canvas.addEventListener('mousemove', function (evt) {
    inputStates.mousePos = getMousePos(evt);
  }, false);

  canvas.addEventListener('mousedown', function (evt) {
    inputStates.mousedown = true;
    inputStates.mouseButton = evt.button;
  }, false);

  canvas.addEventListener('mouseup', function (evt) {
    inputStates.mousedown = false;
  }, false);

  // We create tge balls: try to change the parameter
  //createBalls(4);

  // start the animation
  requestAnimationFrame(mainLoop);
};

//our GameFramework returns a public API visible from outside its scope
return {
  start: start
};
};
