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
