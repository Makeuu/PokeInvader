// Inits
window.onload = function init() {
  var game = new GF();
  game.start();
};

var pikachu = new Image();
var URL_PIKACHU = 'pikachu.png';
pikachu.src = URL_PIKACHU;

var pokemon = new Image();
var URL_POKEMON = 'pokemon.png';
pokemon.src = URL_POKEMON;

var currentFrame = 0;  // the current frame to draw
var counter = 0;       // keep track of frame rate
//Definition des objets
var etat_personnage = {
  enVie : 0,
  detruit : 1,
};

//Definition des objets
var mvt_pikachu = [134, 170 ,207,248];


function ObjetGraphique(x1, y1, w1, h1, x2, y2, w2, h2, img) {
  var x=x1, y=y1, w=w1, h=h1;
  var ximg=x2, yimg=y2, wimg=w2, himg=w2;
  var sprite = img;
  var speed = 1;
  var etat = etat_personnage.enVie;
  var mvt=0;

  function draw(ctx) {
    //ctx.fillRect(x, y, w, h);
    //ctx.drawImage(sprite, 136, 157, 40, 30, x, y, w, h);
    ctx.drawImage(sprite, ximg, yimg, wimg, himg, x, y, w, h);
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
  function getH() {
    return h;
  }
  function getSpeed(){
    return speed;
  }
  function setSpeed(s1){
    speed = s1;
  }
  function getEtat(){
    return etat;
  }
  function setEtat(e){
    etat = e;
  }
  function getX2() {
    return ximg;
  }
  function setX2() {
    // code removed for brevity
    // Update the animation
    // update to the next frame if it is time
    if (counter == (4 - 1)){
      ximg = mvt_pikachu [mvt];
      mvt++;
      if(mvt > 3){
        mvt = 0;
      }
    }
    // update the counter
    counter = (counter + 1) % 4;
  }

  return {
    draw:draw,
    getSpeed:getSpeed,
    setSpeed:setSpeed,
    getX:getX,
    getY: getY,
    setX: setX,
    setY:setY,
    getW:getW,
    getH:getH,
    getEtat:getEtat,
    setEtat:setEtat,
    getX2:getX2,
    setX2:setX2
  }
}

function Vaisseau(x, y, w, h, x2, y2, w2, h2, pikachu){
  var api = new ObjetGraphique(x, y, w, h, x2, y2, w2, h2, pikachu);
  // redéfinition
  var superDraw = api.draw;

  api.draw = function(ctx) {
    //console.log('draw redéfini dans Vaisseau');
    //ctx.fillStyle = 'red';
    // appel de la méthode de la pseudo classe mère que l'on
    // a redéfini
    superDraw.call(this, ctx);
  }
  return api;
}

function Monstre(x, y, w, h, x2, y2, w2, h2, pokemon){
  var api = new ObjetGraphique(x, y, w, h, x2, y2, w2, h2, pokemon);
  // redéfinition
  var superDraw = api.draw;

  api.draw = function(ctx) {
    //console.log('draw redéfini dans Monstre');
    //ctx.fillStyle = 'green';
    // appel de la méthode de la pseudo classe mère que l'on
    // a redéfini
    superDraw.call(this, ctx);
  }
  return api;
}

function Missile(x, y, w, h, x2, y2, w2, h2,pikachu){
  var api = new ObjetGraphique(x, y, w, h, x2, y2, w2, h2,pikachu);
  // redéfinition
  var superDraw = api.draw;

  api.draw = function(ctx) {
    //console.log('draw redéfini dans Monstre');
    //ctx.fillStyle = 'blue';
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

  var objetsGraphiques = [];
  var objetsMonstres = [];
  for(var i=1; i<=5; i++){
    for (var j=1; j<=10; j++){
      var monstre = new Monstre(j*64, i*64, 64, 64, 319, 133, 64, 64, pokemon);
      objetsMonstres.push(monstre);
    }
  }

  var objetsVaisseaux = [];
  var vaisseau = new Vaisseau(600, 500, 80, 66, 135, 156, 40, 32, pikachu);
  objetsVaisseaux.push(vaisseau);

  // array of balls to animate
  var objetsMissiles = [];

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

    switch(etatCourant) {
      case etats.jeuEnCours:
      //main function, called each frame
      measureFPS(time);

      // number of ms since last frame draw
      delta = timer(time);

      objetsMonstres.forEach(function f(elem, index) {
        //Dessiner
        if(elem.getEtat() == etat_personnage.enVie){
          elem.draw(ctx);
        }
        updateMonstre(delta, elem, index);
        //Update les positions
        //Test des collisions
      });
      objetsVaisseaux.forEach(function f(elem) {
        //Dessiner
        elem.draw(ctx);
        //Update les positions
        updateVaisseauPosition(delta, elem);
        if(inputStates.space && (objetsMissiles.length < 1)) {
          var m = new Missile(elem.getX(), elem.getY(), 10, 10, 136, 157, 10, 10, pikachu);
          objetsMissiles.push(m);
        }
      });
      objetsMissiles.forEach(function f(elem) {
        //Dessiner
        elem.draw(ctx);
        updateMissiles(delta, elem);
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
      ctx.scale(-1,1);
      elem.speedX = -elem.speed;
      elem.setX2();
    }
    /*if (inputStates.up) {
    elem.speedY = -elem.speed;
  }*/
  if (inputStates.right) {
    elem.speedX = elem.speed;
    elem.setX2();
  }
  elem.speed = 100;
  // COmpute the incX and inY in pixels depending
  // on the time elasped since last redraw
  elem.setX(elem.getX() + calcDistanceToMove(delta, elem.speedX));
  elem.setY(elem.getY() + calcDistanceToMove(delta, elem.speedY));
}

function updateMonstre(delta, elem, index) {
  // 1) move the ball
  elem.setX(elem.getX() + 2*elem.getSpeed() );

  // 2) test if the ball collides with a wall
  testCollisionWithWalls(elem);

  // 3 test avec missiles
  if(objetsMissiles.length > 0){
    testCollisionAvecMonstre(objetsMissiles[0], elem, index);
  }
}

function updateMissiles(delta, elem) {

  elem.setY(elem.getY() - 10 );

  testCollisionWithWalls(elem);
}

// Teste collisions entre cercles
function circleCollide(x1, y1, r1, x2, y2, r2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));
}
// Collisions between rectangle
function rectsOverlap(x0, y0, w0, h0, x2, y2, w2, h2) {
  /*if ((x0 > (x2 + w2)) || ((x0 + w0) < x2))
  return false;

  if ((y0 > (y2 + h2)) || ((y0 + h0) < y2))
  return false;
  return true;*/
  maxgauche=Math.max(x0,x2)
  mindroit=Math.min(x0+w0,x2+w2)
  maxbas=Math.max(y0,y2)
  minhaut=Math.min(y0+h0,y2+h2)
  if(maxgauche < mindroit && maxbas < minhaut){
    return true;
  }
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

function testCollisionWithWalls(elem) {
  // left
  if (elem.getX() < (elem.getW()*-1) ) {
    elem.setSpeed(1);
    elem.setY(elem.getY()+10);
  }
  // right
  if (elem.getX() > canvas.width ) {
    elem.setSpeed(-1);
    elem.setY(elem.getY()+10);
  }
  // haut
  if (elem.getY() < 0 ) {
    objetsMissiles = [];
    console.log('loupé');
  }
}

function testCollisionAvecMonstre(elem, monster, index){
  if(rectsOverlap(elem.getX(), elem.getY(), elem.getW(), elem.getH(), monster.getX(), monster.getY(), monster.getW(), monster.getH())){
    monster.setEtat(etat_personnage.detruit);
    objetsMonstres.splice(index,1);
    objetsMissiles.splice(0,1);
    elem.setEtat(etat_personnage.detruit);
    console.log('SHOOT');
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
