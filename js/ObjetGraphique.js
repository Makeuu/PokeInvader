var mvt_pikachu = [75, 115 ,150,188];
var mvt_attaque = [78,114,150];

function ObjetGraphique(x1, y1, w1, h1, x2, y2, w2, h2, img) {
  var x=x1, y=y1, w=w1, h=h1;
  var ximg=x2, yimg=y2, wimg=w2, himg=w2;
  var sprite = img;
  var speed = 1;
  var etat = etat_personnage.enVie;
  var mvt=0;
  var mvt_a=0;

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
      if (yimg == 133){
        //droite
        mvt++;
        if(mvt > 3){
          mvt = 0;
        }

      }
      else{
        //gauche
        mvt--;
        if(mvt < 0){
          mvt = 3;
        }
      }

    }
    // update the counter
    counter = (counter + 1) % 4;
  }

  function setY2() {
    if (counterY == (4 - 1)){
      // gérer le reverse
      if (deplacement == 1){
        //gauche
        yimg = 97;
      }
      else{
        //droite
        yimg = 133;
      }
    }
    // update the counter
    counterY = (counterY + 1) % 4;
  }

  function attentePika(){

    if(deplacement){
      //gauche
      ximg = 160;
      yimg = 241;
    }else {
      //droite
      ximg = 117;
      yimg = 241;
    }
  }

  function attaquePika(){


    if (counter == (3 - 1)){
      ximg = mvt_attaque [mvt_a];
      if (deplacement == 1){
        //droite
        yimg = 205;
        mvt_a++;
        if(mvt_a > 2){
          mvt_a = 0;
        }

      }
      else{
        //gauche
        yimg=172;
        mvt_a--;
        if(mvt_a < 0){
          mvt_a = 2;
        }
      }

    }
    // update the counter
    counter = (counter + 1) % 3;
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
    setX2:setX2,
    setY2:setY2,
    attentePika:attentePika,
    attaquePika:attaquePika
  }
}
