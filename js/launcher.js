//Inits
window.onload = function init() {
  //Interface
  //Variables globales
  var canvas,ctx,h,w;
  var fpsContainer,scoreContainer,fpsContainer;
  //Lancement
  var interface = new Interface();

  if(interface.startInterface()){
    console.log("interface loaded");
  }else{
    console.log("interface error");
  }

  //Vaisseau
  //Variables globales
  var pikachu = new Image();
  var URL_PIKACHU = './pictures/pika_mouvement.png';
  pikachu.src = URL_PIKACHU;
  //Lancement

  //Vaisseau
  //Variables globales
  var pokemon = new Image();
  //var URL_PIKACHU = './pictures/pikachu.png';
  var URL_POKEMON = './pictures/pokemon.png';
  pokemon.src = URL_POKEMON;

  var menu = new Image();
  var URL_MENU = './pictures/menu.jpg';
  menu.src = URL_MENU;

// Fichiers audio
var openning = new Audio("./sounds/Openning.mp3");
openning.loop = true;
openning.volume = .25;
openning.load();
var combat = new Audio("./sounds/Combat.mp3");
combat.loop = true;
combat.volume = .25;
combat.load();
  //Lancement



  //Jeu
  //Variable globales

  //Lancement
  var test=false;
  var game = new GF(interface,menu,pokemon,pikachu,openning,combat);

  if(game.start()){
    console.log("game loaded");
  }else{
    console.log("game error");
  }

};
