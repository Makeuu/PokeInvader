// Interface

var Interface = function(){


  var startInterface =function(){


    // Canvas
    canvas = document.querySelector("#myCanvas");

    w = canvas.width;
    h = canvas.height;

    //Context
    ctx = canvas.getContext('2d');
    // default police for text
    ctx.font="20px Arial";

    // FPS
    fpsContainer = document.createElement('div');
    document.body.appendChild(fpsContainer);

    //Score
    scoreContainer = document.createElement('div');
    document.body.appendChild(scoreContainer);

    //Curent time
    timeContainer = document.createElement('div');
    document.body.appendChild(timeContainer);


    return true;
  }

  // clears the canvas content
  var clearCanvas=function()  {
    ctx.clearRect(0, 0, w, h);
  }


  return {
    startInterface: startInterface,
    clearCanvas: clearCanvas
  };
}
