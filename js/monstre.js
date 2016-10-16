function Monstre(x, y, w, h, x2, y2, w2, h2, pokemon){
  var api = new ObjetGraphique(x, y, w, h, x2, y2, w2, h2, pokemon);
  // redéfinition
  var superDraw = api.draw;

  api.draw = function(ctx) {
    // appel de la méthode de la pseudo classe mère que l'on
    // a redéfini
    superDraw.call(this, ctx);
  }
  return api;
}

var generateMonster =function(pokemon){
  for(var i=1; i<=5; i++){
    for (var j=1; j<=10; j++){
      var monstre = new Monstre(j*64, i*64, 64, 64, 319, 133, 64, 64, pokemon);
      objetsMonstres.push(monstre);
    }
  }
}
