var Cell = new Class({
  
  row: 0,
  column: 0,
  color: 0,
  
  hash: null,
  
  initialize: function(row, column, color) {
    this.row = row;
    this.column = column;
    this.color = color;
    
    this.hash = this.row + "," + this.column;
  },
  
  isAdjacent: function(cell2) {
    
    //horizontal neighbors
    return (this.row == cell2.row && 
      ( this.column+1 == cell2.column || this.column-1 == cell2.column ))
      
      ||
    
    // vertical neighbors  
    (this.column == cell2.column && 
      ( this.row+1 == cell2.row || this.row-1 == cell2.row ));
  },
  
  getHash: function() {
    return this.hash;
  },
  
  toString: function() {
    return  this.getHash() + Colors[this.color];
  }
  
});