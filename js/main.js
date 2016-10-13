var currentFrame = 0;  // the current frame to draw
var counter = 0;       // keep track of frame rate
var counterY=0;
var deplacement=0;
//Definition des objets
var etat_personnage = {
  enVie : 0,
  detruit : 1,
};

// Var utiles
var score=0;
var tempsTotal=0;

// GAME FRAMEWORK STARTS HERE
var GF = function(interface,pokemon,pikachu){


  // etat du jeu
  var etats = {
    menuPrincipal : 0,
    jeuEnCours : 1,
    gameOver : 2,
    win : 3
  };

  var etatCourant = etats.jeuEnCours;

  // vars for counting frames/s, used by the measureFPS function
  var frameCount = 0;
  var lastTime;
  //var fpsContainer;
  var fps;
  // for time based animation
  var delta, oldTime = 0;

  // vars for handling inputs
  var inputStates = {};

  var objetsGraphiques = [];
  var objetsMonstres = [];

  // var generateMonster = function(){
  //   for(var i=1; i<=5; i++){
  //     for (var j=1; j<=10; j++){
  //       var monstre = new Monstre(j*64, i*64, 64, 64, 319, 133, 64, 64, pokemon);
  //       objetsMonstres.push(monstre);
  //     }
  //   }
  // }
  generateMonster(pokemon,objetsMonstres);

  var objetsVaisseaux = [];
  //var vaisseau = new Vaisseau(600, 500, 80, 66, 135, 156, 40, 32, pikachu);
  var vaisseau = new Vaisseau(600, 500, 80, 66, 75, 133, 35.5, 32, pikachu);

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
/*
  // clears the canvas content
  function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
  }
*/

  var measureScore = function(){


      //vitesse du monster
     scoreContainer.innerHTML = 'Score: ' + score;
  };

  var curentTime = function(delta){

      tempsTotal += delta;
      //  ctx.fillText((tempsTotal/1000).toFixed(2) , 100, 100);
      var cTime= (tempsTotal/1000).toFixed(0);
      timeContainer.innerHTML = 'Time : '+cTime;

      return cTime;
  };


  var resetVar = function(){
    tempsTotal-=tempsTotal;
    ballArrayIndice=0;
    score=0;
    ballEaten=0;
  }

  function timer(currentTime) {

    var delta = currentTime - oldTime;
    oldTime = currentTime;
    //on incrémente notre temps total
    curentTime(delta);


    return delta;

  }

  var mainLoop = function(time){
    // Clear the canvas
    interface.clearCanvas();

    switch(etatCourant) {
      case etats.jeuEnCours:
      //main function, called each frame
      measureFPS(time);

      // number of ms since last frame draw
      delta = timer(time);

      // Test s'il reste des monstres
      if(objetsMonstres.length){
        // s'il en reste on les fait bouger

        objetsMonstres.forEach(function f(elem, index) {
          //Dessiner
          if(elem.getEtat() == etat_personnage.enVie){
            elem.draw(ctx);
          }
          updateMonstre(delta, elem, index);
          //Update les positions
          //Test des collisions
        });
      }
      else {
        // sinon fin de partie
        console.log("win");
        etatCourant=etats.win;
      }

      objetsVaisseaux.forEach(function f(elem) {
        //Dessiner
        elem.draw(ctx);
        //Update les positions
        updateVaisseauPosition(delta, elem);
        if(inputStates.space && (objetsMissiles.length < 1)) {
          // TOM attaque

          var m = new Missile(elem.getX() + 20, elem.getY()-66, 23, 50, 73, 241, 23, 35, pikachu); // 66-> taille de pika

        //  var m = new Missile(elem.getX(), elem.getY(), 10, 10, 136, 157, 10, 10, pikachu);
          objetsMissiles.push(m);
        }
      });
      objetsMissiles.forEach(function f(elem) {
        //Dessiner
        elem.draw(ctx);
        updateMissiles(delta, elem);
        //Test des collisions
      });


      //score
      measureScore();

      break;
      case etats.gameOver:
      //console.log("GAME OVER");
      ctx.fillText("GAME OVER", 100, 100);
      ctx.fillText("Press SPACE to start again", 100, 150);

      // on reset les variable
      resetVar();

      if(inputStates.space) {
        //console.log("space enfoncee");
        generateMonster();
        etatCourant = etats.jeuEnCours;
      }


      break;

      case etats.win:
      //console.log("GAME OVER");
      ctx.fillText("YOU WIN", 100, 100);
      ctx.fillText("Press SPACE to start again", 100, 150);


      // on reset les variable
      resetVar();

      if(inputStates.space) {
        //console.log("space enfoncee");
        generateMonster();
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
      //ctx.scale(-1,1);
      elem.speedX = -elem.speed;

      deplacement=1;
      elem.setY2();
      elem.setX2();
    }
    /*if (inputStates.up) {
    elem.speedY = -elem.speed;
  }*/
  else if (inputStates.right) {
    elem.speedX = elem.speed;


    deplacement=0;
    elem.setY2();
    elem.setX2();
  }else if (inputStates.space){
    elem.attaquePika();
  }else{
    elem.attentePika();
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
//    console.log('loupé');
  }
}

function testCollisionAvecMonstre(elem, monster, index){
  if(rectsOverlap(elem.getX(), elem.getY(), elem.getW(), elem.getH(), monster.getX(), monster.getY(), monster.getW(), monster.getH())){
    monster.setEtat(etat_personnage.detruit);
    objetsMonstres.splice(index,1);
    objetsMissiles.splice(0,1);
    elem.setEtat(etat_personnage.detruit);
    //console.log('SHOOT');

    // on incrémente le score
    score+=10;
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


  //on génère les monstres
  generateMonster();

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

      // On l'empêche de bouger
      inputStates.left=false;
      inputStates.right=false;
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
