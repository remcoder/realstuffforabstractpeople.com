/*
 * TODO: @interface {shape}
 * defines a property 'vertices', which in turn is an array of objects with an x and y: [ {x:Number, y:{Number}} ]
 * 
 */


/**
  * @constructor
  * //@implements {shape}
  * TODO: 
  *  - make sure we don't update the original x,y
  *  - 
  */
function Poly(ctx, n, x, y, r, rotation)
{
  this.ctx = ctx;
  this.n = n;
  this.x = x;
  this.y = y;
  this.r = r;
  this.rotation = rotation;
  this.ctx = ctx;
  
  this.vertices = [];
  var a;
  
  for (var i=0 ; i<n ; i++)
  {
    a = i*2*Math.PI/n + rotation;
    x += r*Math.sin(a);
    y += r*Math.cos(a);
    this.vertices.push({x:x,y:y});
  }
}

Poly.prototype = {
  contains: function(coord) {
    var start =  this.vertices[0];
    
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);

    for( var i=0 ; i<this.vertices.length ; i++)
    {
      var v = this.vertices[i];
      this.ctx.lineTo(v.x, v.y);
    }
    this.ctx.closePath();
    return this.ctx.isPointInPath(coord.x, coord.y);
  },
  
  clone: function() {
    var r = new Poly(this.ctx, this.n, this.x, this.y, this.r, this.rotation);
    // FIXME: workaround. need to separate shape from hex
    r.row = this.row;
    r.column = this.column;
    return r;
  },
  
  translate: function(diff) {
    for( var v=0 ; v<this.vertices.length ; v++)
    {
      var vertex = this.vertices[v];
      vertex.x += diff.x;
      vertex.y += diff.y;
    }
  },
  
  draw: function(ctx) {
     var start = this.vertices[0];

     ctx.fillStyle = this.color;
     //ctx.strokeStyle = this.color; 

     ctx.beginPath();
     ctx.moveTo(start.x, start.y);
     for( var i=0 ; i<this.vertices.length ; i++)
     {
       var v = this.vertices[i];
       ctx.lineTo(v.x, v.y);
     }
     ctx.closePath();
     if (SHOW_GRID)
       ctx.stroke();
     ctx.fill();
     //this.drawCoord(ctx);
     
     //this.ctx.fillStyle = "blue";
     //this.ctx.fillRect(start.x + this.offset.x, start.y + this.offset.y, 4,4);
   },
   
   drawText: function(ctx, text) {
     ctx.fillStyle = "red";
     ctx.fillText(text, this.x + 4, this.y+3);
   }
};