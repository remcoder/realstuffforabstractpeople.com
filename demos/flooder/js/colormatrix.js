var Colors = ["red", "blue", "pink" ,"yellow", "green", "purple"];
var ColorCodes = new Hash({
  "red": "DC4A20",
  "blue": "46b1e2",
  "pink": "ed70a1",
  "yellow": "f3f61d",
  "green": "7e9d1e",
  "purple": "605ca8"
});

var ColorMatrix = new Class({
  // state
  _wetCells: new Hash(),
  _dryCells: new Hash(),
  
  _moves: [], // we'll store the sequence of colors
  _numberOFfloodedCellsPerMove: [],
  _groups: new Hash(),
  _timeout: null, // for the solver
  
  requests:0,
  hits:0,
  misses:0,
  
  initialize : function(table, size, chart) {
    this.size = size;
    //this.log("size: " + this.size);
    this.table = table;
    this.chart = chart;
    this.timer = new Timer();
    
    while (table.rows.length)
      table.deleteRow(0);
    
    
    for (var r=0 ; r<this.size ; r++)
    {      
      var row = table.insertRow(table.rows.length);
            
      for (var c=0 ; c<this.size ; c++)
      {
        var colorIndex = $random(0,5);
        var cell = new Cell(r, c, colorIndex);
        if (r==0 && c==0)
          this._wetCells.set(cell.getHash(), cell);
        else
          this._dryCells.set(cell.getHash(), cell);
          
        var td = row.insertCell(row.cells.length);
        $(td).addClass(Colors[colorIndex]);
      }
    }
    
    //this.log(this._dryCells);
    //this.log("done");
  },
  
  //these are the official values from labpixies: 14,15  21,35  28,50
  getMaxMoves: function() {
    switch (this.size)
    {
      case 14:
        return 15;
      case 21:
        return 35;
      case 28:
        return 50;
    }
  },
  
  move: function(color) {
    this.timer.start();
    
    this._moves.push(color);
    window.status = "move: " + this._moves.length;
    
    var count = 0;
    var groups = [];
    var matrix = this;
    var dryFront = this.getDryFront();
    var dryFrontMatchingColor = this.filterByColor(dryFront, color);
    
    dryFrontMatchingColor.each(function(cell) {
      var group = matrix.getGroupFast(cell);
      if (group)
        groups.push(group);
    });
    
    // move the flooded cells from dry to wet
    groups.each(function(group) {
    
      group.each(function(cell) {
    
        var hash = cell.getHash();
        if (matrix._dryCells.get(hash));
        {
          matrix._wetCells.set(hash, cell);
          matrix._dryCells.erase(hash);
          count++;
        }
      });
    });
    
    // color all wet cells
    this._wetCells.each(function(cell, key) {
      cell.color = color;
      matrix.table.rows[cell.row].cells[cell.column].className = Colors[color];
       } );

    this.timer.stop();
    return count; 
  },
  
  // OPTIMIZE!
  getDryFront:function() {
    var dryFront = [];
    var matrix = this;
    
    this._dryCells.each(function(dry) {
      matrix._wetCells.each(function(wet) {
        if (dry.isAdjacent(wet))
          dryFront.push(dry);
        })
      });
    return dryFront;
  },
  
  filterByColor: function(cells, color) {
    var result = [];
    cells.each(function(cell) { if (cell.color == color) result.push(cell); } );
    return result;
  },
  
  getGroupFast: function(cell) {
    var group = this._groups.get(cell.getHash());
    this.requests++;
    if (group) {
      this.hits++;
      return group;
    }
    else
    {
      this.misses++;
    }
    var matrix = this;
    var group = this.getGroup(cell);
    group.each(function(groupCell) {
      matrix._groups.set(groupCell.getHash(), group);
    });
    
    return group;
  },
  
  getGroup: function(cell) {
    var found = new Hash();
    found.set(cell.row + "," + cell.column, cell);
    this.findGroup(cell, found);
    //console.log(found);
    
    var group = [];
    found.each(function(value, key) { if (value!=false) { group.push(value);} } );
    
    return group;
  },
  
  findGroup: function(cell, found) {
    var matrix = this;
    //console.log("inpecting neighborhood of: ", cell, Colors[cell.color]);
    this.getNeighbors(cell).each(function(neighbor) {
      if (!found.has(neighbor))
      {
        //console.log("inspecting: " +neighbor);
              
        var nCell = matrix._dryCells.get(neighbor);
        
        if (nCell == null || nCell.color != cell.color)
        {
          //console.log("false");
          found.set(neighbor, false);
        }
        else
        { 
          //console.log("true"); 
          found.set(neighbor, nCell);
          matrix.findGroup(nCell, found);
        } 
      }
    });
  },
  
  // needs hashtable
  getNeighbors: function(cell) {
    var neighbors = [];
    
    if (cell.row > 0)
      neighbors.push(cell.row-1 + "," + cell.column);
    
    if (cell.row < this.size-1)
      neighbors.push(cell.row+1 + "," + cell.column);
    
    if (cell.column > 0)
      neighbors.push(cell.row + "," + (cell.column-1));
    
    if (cell.column < this.size-1)
      neighbors.push(cell.row + "," + (cell.column+1));
    
    return neighbors;
  },
  
  // PRE: check for win first
  isLoss: function() {
    return this._moves.length == this.getMaxMoves();
  },
  
  isWin: function() {
    return this._dryCells.getLength() == 0;
  },
  
  attachSolver: function(solver){
    this.solver = solver;
  },
  
  solve : function() {    
    var floodedCells = this.move( this.solver.move() );
    this._numberOFfloodedCellsPerMove.push(floodedCells);
    
    window.status = "move " + this._moves.length + ", " + floodedCells + " cells flooded";
    
    if (! this.isWin())
    {
      this._timeout = this.solve.delay(100 ,this);
    }
    else
    {
      this.displayStats();
      this._numberOFfloodedCellsPerMove = [];
    }
  },
  
  stop : function() {
    clearTimeout(this._timeout);
  },
  
  displayStats: function() {
    var data_string = this._numberOFfloodedCellsPerMove.join(",");
    var max = Math.max.apply(this, this._numberOFfloodedCellsPerMove);
    var color = ColorCodes.get(Colors[this._moves[this._moves.length-1]]);

    
    var total = 0;
    this._numberOFfloodedCellsPerMove.map(function(n) {
      total += n;
    });
    var avg = 1.0 * total / this._numberOFfloodedCellsPerMove.length;
    var width = 9 * this._numberOFfloodedCellsPerMove.length;
    var avg_line = avg/max;
    var title = encodeURIComponent("# flooded cells/step");
    
    $("stats").innerHTML = this._moves.length + " steps<br/>average # of flooded cells per step: " + avg.toFixed(2);
    //console.log(data_string);
    //console.log("avg: " + avg);
    this.chart.src = "http://chart.apis.google.com/chart?cht=bvs&chd=t:{data_string}&chs={width}x100&chds=0,{max}&chbh=a&chco={color}&chtt={title}&chxt=y&chxr=0,0,{max}&chm=r,000000,0,{avg},{avg2}".substitute({
      data_string: data_string,
      max: max,
      color: color,
      title: title,
      avg: avg_line.toFixed(2),
      avg2: (avg_line + 0.01).toFixed(2),
      width: width
    });
    
    // NORM 196, 197, 209, 218, 203
    
    // FAST 212, 199, 209, 218, 223
    $("stats").innerHTML += "<br/>average time/step: " + this.timer.times.average().toFixed(2) + "ms";
    $("stats").innerHTML += "<br/>cache hit/miss: " + (100.0 * this.hits/this.requests).toFixed(2) + "/" + (100.0 * this.misses/this.requests).toFixed(2);
  }
  
});