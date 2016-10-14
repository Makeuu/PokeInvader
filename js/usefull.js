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

var resetVar = function(){
  tempsTotal-=tempsTotal;
  ballArrayIndice=0;
  score=0;
  ballEaten=0;
}
