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

//Tab
var objetsGraphiques = [];
var objetsMonstres = [];
var objetsMissiles = [];
var objetsMissilesEnnemies = [];

// vars for handling inputs
var inputStates = {};

// vars for counting frames/s, used by the measureFPS function
var frameCount = 0;
var lastTime;
//var fpsContainer;
var fps;
// for time based animation
var delta, oldTime = 0;

// GAME FRAMEWORK STARTS HERE
var GF = function(interface,menu,pokemon,pikachu,openning,combat){

  // etat du jeu
  var etats = {
    menuPrincipal : 0,
    jeuEnCours : 1,
    gameOver : 2,
    win : 3
  };


  var etatCourant = etats.menuPrincipal;

  var objetsVaisseaux = [];
  var vaisseau = new Vaisseau(600, 500, 80, 66, 75, 133, 35.5, 32, pikachu);

  objetsVaisseaux.push(vaisseau);

  // array of balls to animate


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
      case etats.menuPrincipal:
      //console.log("GAME OVER");
      ctx.drawImage(menu, 0,0,1200,600);
      ctx.fillText("Poke - Invader", 500, 150);
      ctx.fillText("Press SPACE to start the game", 500, 200);
      openning.play();
      combat.pause();

      // on reset les variable

      if(inputStates.space) {
        //console.log("space enfoncee");
        resetVar();
        etatCourant = etats.jeuEnCours;
      }
      break;

      case etats.jeuEnCours:
      //main function, called each frame
      measureFPS(time);

      // number of ms since last frame draw
      delta = timer(time);
      openning.pause();
      combat.play();

      // Test s'il reste des monstres
      if(objetsMonstres.length){
        // s'il en reste on les fait bouger
        objetsMonstres.forEach(function f(elem, index) {
          //Dessiner
          if(elem.getEtat() == etat_personnage.enVie){
            elem.draw(ctx);
          }
          updateMonstre(delta, elem, index);
        });
      }
      else {
        // sinon fin de partie
        etatCourant=etats.win;
      }

      objetsVaisseaux.forEach(function f(elem) {
        //Dessiner
        elem.draw(ctx);
        //Update les positions
        updateVaisseauPosition(delta, elem);
        if(inputStates.space && (objetsMissiles.length < 1)) {

          var m = new Missile(elem.getX() + 20, elem.getY()-66, 23, 50, 73, 241, 23, 35, pikachu); // 66-> taille de pika

          //  var m = new Missile(elem.getX(), elem.getY(), 10, 10, 136, 157, 10, 10, pikachu);
          objetsMissiles.push(m);

        }
      });
      objetsMissiles.forEach(function f(elem) {
        //Dessiner
        elem.draw(ctx);
        updateMissiles(delta, elem);
      });
      objetsMissilesEnnemies.forEach(function f(elem) {
        //Dessiner
        elem.draw(ctx);
        updateMissilesEnnemies(delta, elem);
      });

      //score
      measureScore();

      break;
      case etats.gameOver:
      // log("GAME OVER");
      ctx.fillText("GAME OVER", 100, 100);
      ctx.fillText("Press SPACE to start again", 100, 150);

      // on reset les variable
      resetVar();
      if(inputStates.space) {
        generateMonster(pokemon);
        etatCourant = etats.jeuEnCours;
      }

      break;
      case etats.win:
      //console.log("GAME OVER");
      ctx.fillText("YOU WIN", 100, 100);
      ctx.fillText("Press SPACE to start again", 100, 150);
      openning.pause();
      combat.pause();

      // on reset les variable
      resetVar();

      if(inputStates.space) {
        //console.log("space enfoncee");
        generateMonster(pokemon);
        etatCourant = etats.jeuEnCours;
      }
      break;

    }
    requestAnimationFrame(mainLoop);
  };

  function updateMonstre(delta, elem, index) {

    // 1) move the monster
    elem.setX(elem.getX() + 2*elem.getSpeed() );

    // 2) test if the monster collides with a wall
    testCollisionWithWalls(elem);

    // 3 test avec missiles
    if(objetsMissiles.length > 0){
      testCollisionAvecMonstre(objetsMissiles[0], elem, index);

    }
    if(getRandomInt(0,750) == 0){
      // Tire un missiles ennemies
      var m = new Missile(elem.getX() + 20, elem.getY()-66, 23, 50, 73, 241, 23, 35, pikachu); // 66-> taille de pika
      objetsMissilesEnnemies.push(m);
    }
  }

  function updateMissiles(delta, elem) {

    elem.setY(elem.getY() - 10 );

    testCollisionWithWalls(elem);
  }

  function updateMissilesEnnemies(delta, elem) {

    elem.setY(elem.getY() + 5 );

    testCollisionWithWalls(elem);

    if(rectsOverlap(elem.getX(), elem.getY(), elem.getW(), elem.getH(), vaisseau.getX(), vaisseau.getY(), vaisseau.getW(), vaisseau.getH())){
      etatCourant = etats.gameOver;
    }
  }


  // Collisions between rectangle
  function rectsOverlap(x0, y0, w0, h0, x2, y2, w2, h2) {
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
      elem.setY(elem.getY()+15);

    }
    // right
    if (elem.getX() > canvas.width ) {
      elem.setSpeed(-1);
      elem.setY(elem.getY()+15);


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
    generateMonster(pokemon);

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



    // start the animation
    requestAnimationFrame(mainLoop);

    return true;
  };

  //our GameFramework returns a public API visible from outside its scope
  return {
    start: start
  };
};
