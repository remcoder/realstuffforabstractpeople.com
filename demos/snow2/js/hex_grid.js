/** 
  * see also: http://www-cs-students.stanford.edu/~amitp/game-programming/grids/

  * @description The HexGrid handles the translation of the hexagonal coords to euclidian coords
  * @constructor
  */
function HexGrid(canvas, tilesize, rows, columns, offset)
{
  this.rows = rows;
  this.columns = columns;
  this.hexSize = tilesize;
  this.hexSide = 0.5 * this.hexSize / Math.cos(Math.PI/6);
  //this.dia_offset = Math.sin(Math.PI/6) * this.hexSide + this.hexSide;
  this.dia_offset = hexDia(tilesize);
  this.vert_offset = tilesize
  this.canvas = canvas;
  this.element = canvas;
  this.ctx = canvas.getContext("2d");
  
  // copy the offset.. we don't want to make changes to the original
  this.offset = { x:offset.x, y:offset.y };
  
  this.offset.y += this.hexSize; // 1 hex extra offset because the hexagon's first vertex is one of bottom ones. Strangely we're drawing down to up...
  
  this.hexes = [];
  
  for(var i=0 ; i<this.rows ; i++)
  for(var j=0 ; j<this.columns ; j++)
  {
    //console.log(i,j);
    var hex_coord = this.matrix2hex(i,j);
    var coord = this.hex2euclid(hex_coord);
    var hex = new Poly(this.ctx,6, coord.x, coord.y, this.hexSide, Math.PI/6 );
    hex.row = i;
    hex.column = j;
    
    this.hexes.push(hex);
  }
}

HexGrid.prototype = {
  matrix2hex: function(row, column) {
    return { x:column, y:row  };
  },
  
  hex2euclid: function(coord) {
    return {
      x:coord.x*this.dia_offset+this.offset.x, 
      y:coord.y*this.vert_offset + 
        (coord.x-1)*this.vert_offset*0.5 + 
        this.offset.y};
  },
  
  // TODO: make faster by first narrowing down to 1 or 2 hexes using bounding boxes
  euclid2hex: function(coord) {
    //console.log(this.id);
    var rel_coord = { x: coord.x - this.offset.x,
                      y: coord.y - this.offset.y };

    // loop through all this.hexes
    for (var k=0 ; k < this.hexes.length ; k++)
    {
      var hex = this.hexes[k];
      
      // throw current hex if the coord is inside
      if (hex.contains(coord))
        return hex; // 'throw' is used to exit loop      
    }

    return null;
  },

  hex: function(i,j) {
    return this.hexes[i*this.columns + j];
  },  
  
  getNeighbors: function(u,v) {
    var neighborCoords = [ [u,v+1], [u+1,v], [u+1,v-1], [u,v-1], [u-1,v], [u-1,v+1] ];
    var results = [];
    for (var n=0 ; n<6 ; n++)
    {
      var coord = neighborCoords[n];
      var row = coord[0];
      var column = coord[1];
      results[n] = this.hexes[coord[0]*this.columns + coord[1]];
    }
    return results;
  },
  
  getHex:function(coord) {
    return this.euclid2hex(coord);
  },
  
  draw: function() {
    var ctx = this.ctx;

    for (var k=0 ; k < this.hexes.length ; k++)
    {
      var hex = this.hexes[k];
      if (hex.skip) 
      { 
        if (DEBUG)
        {
          hex.color = "orange";
          hex.draw(ctx);
        }
        if (COORDS)
          hex.drawText(ctx, hex.row+","+hex.column);
        continue;
      }
      
      hex.color = color(hex.value);
      
      if (Math.abs(hex.value - hex.prev) > delta)
      { 
        if (true || Math.random() > 0.8)
        {
          hex.draw(ctx);
          hex.prev = hex.value;
        }
      }
      if (VALUES)
        hex.drawText(ctx, hex.value.toFixed(1));
      
      if (COORDS)
        hex.drawText(ctx, hex.row + "," + hex.column);
    }
  }
};
