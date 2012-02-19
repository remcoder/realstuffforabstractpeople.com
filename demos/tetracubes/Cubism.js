/*
 * MIT license
 * remcoder [at] gmail (dot) com
 
 This is a little library for making shapes out of multiple cubes (polycubes)
 
 supported platforms:
 - Safari on IPhone/Snow Leopard
 
 */
 
var Cubism = {
  
  CreateStage: function(el, perspective) {
    el.setStyle("webkitPerspective",perspective + "px");
    el.setStyle("webkitTransformStyle", "preserve-3d");
  },

  PolyCube : function(parent, matrix3d, size, properties, autocenter) {
    var xSize = size*matrix3d[0][0].length;
    var ySize = size*matrix3d[0].length;
    var zSize = size*matrix3d.length;
    var poly = new Element("div", { "styles" : { "position": "absolute", "width" : xSize+"px", "height" : ySize+"px" } });
    if (properties)
      poly.set(properties);
    poly.addClass("polycube");
    poly.setStyle("webkitTransformStyle", "preserve-3d");
    parent.grab(poly);
    
    
    var center =  autocenter ? -(0.5*zSize-0.5*size) : 0;
    matrix3d.each(function(layer, z) {
      layer.each(function(row, y) { 
        row.each(function(cell, x) { 
          if (cell)
            Cubism.Cube(poly, size).translate3d(x*size, y*size, z*size).translateZ(center);
        })
      })
    });
    
    if (autocenter)
      poly.translate3d(-xSize/2, -ySize/2, -zSize/2);
    return poly;
  }, 

  Cube : function(parent, size, properties, autocenter) {
    var cube = new Element("div", { "styles" : { "position": "absolute", "width" : size+"px", "height" : size+"px" } } );
    if (properties)
      cube.set(properties);
    cube.setStyle("webkitTransformStyle", "preserve-3d");
    cube.addClass("cube");
    parent.grab(cube);
    
    var _sides = "front back left right top bottom".split(" ");  
  
    _sides.each(function(which) { Cubism.Side(cube, which, size); });
    
    if (autocenter)
      cube.translate3d(-size/2, -size/2, -size/2);
    return cube;
  },
   
  Side: function(cube, which, size) {
    var side = new Element("div", { "styles" : { "position": "absolute", "width" : size+"px", "height" : size+"px" } } );
    side.addClass("side");
    side.addClass(which);
    cube.grab(side);
    
    var offset = size/2;
    
    switch(which)
    {
      case "front":
        side.translateZ(offset);
        break;
      case "back":
        side.translateZ(-offset);
        break;
      case "left":
        side.translateX(-offset).rotateY(90);
        break;
      case "right":
        side.translateX(offset).rotateY(-90);
        break;
      case "top":
        side.translateY(offset).rotateX(90);
        break;
      case "bottom":
        side.translateY(-offset).rotateX(90);
        break;
      default:
        side.rotateY(90);    
    }
    
    return side;
  }
}
