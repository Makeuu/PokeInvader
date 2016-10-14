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
