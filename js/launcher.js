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

  //Lancement



  //Jeu
  //Variable globales

  //Lancement
  var game = new GF(interface,pokemon,pikachu);

  if(game.start()){
    console.log("interface loaded");
  }else{
    console.log("interface error");
  }

};
