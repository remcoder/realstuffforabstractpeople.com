var DEBUG       = +getParamFromHash("debug");
var ZOOM        = +getParamFromHash("zoom");
var SHOW_GRID   = +getParamFromHash("show_grid");
var HEX_SIZE    = +getParamFromHash("hex_size");
var BETA        = +getParamFromHash("beta");
var GAMMA       = +getParamFromHash("gamma");
var DELTA       = +getParamFromHash("delta");
var GENERATIONS = +getParamFromHash("generations");
var STATS       = +getParamFromHash("stats");
var VALUES      = +getParamFromHash("values");
var COORDS      = +getParamFromHash("coords");
var STOP        = +getParamFromHash("stop");

// NOTE: using the hash to pass params instead of the querystring b/c
// my python server does a redirect and appends a slash to the 
// url, effectively breaking the page.
// So the workaround is to parse the hash as if it was a querystring
// and to automatically reload the page when the hash changes *sigh*
window.onhashchange = function () { document.location.reload(); }

function hexDia(size)
{ 
  var side = 0.5 * size / Math.cos(Math.PI/6);
  return Math.sin(Math.PI/6) * side + side;
}
  
var delta = DELTA || 0.05; // redraw threshold: redraw a cell only if its value change (since last draw) is greater than delta
var beta = BETA || 0.4; // background
var gamma = GAMMA || 0.001; // water influx
var generations_per_frame = GENERATIONS || 10;
var hex_height = HEX_SIZE || 6;
var hex_width = hexDia(hex_height);

var canvas = $("#snow");
var ctx = canvas[0].getContext("2d");

canvas[0].width = 600;
canvas[0].height = 600;

var width = canvas[0].width;
var height = canvas[0].height;

if (ZOOM) { 
  ctx.scale(1/ZOOM,1/ZOOM);
  //ctx.translate(width * zoom/4,height * zoom/4)
}

var columns = ~~(width / hex_width) + 2;
var cut_rows = columns;
var used_rows = ~~(height / hex_height);
var rows = used_rows + ~~(cut_rows/2) + 2;


var dy =  -hex_height/2 -(cut_rows/2) * hex_height;
var dx =  -hex_width;

var center = { i:~~(rows/2) , j:~~(columns/2) };


var debug_div = $("#debug");
function debug(obj) {
  for (var k in obj)
    debug_div.html(debug_div.html() + k + " : " + obj[k] + "<br>");
} 

if (STATS)
  debug({
    "hex_width": hex_width.toFixed(2),
    "hex_height": hex_height,
    "GRID" : "",
    "width": width,
    "height": height,
    "columns" : columns,
    "used rows": used_rows,
    "cut rows": cut_rows,
    "total rows": rows,
    "HEXES" : "",
    "used hexes" : used_rows * (columns-2),
    "total hexes" : rows * columns,
    "OPTIONS": "",
    "beta": beta,
    "gamma": gamma,
    "RENDERING": "",
    "delta": delta,
    "gen/frame" : generations_per_frame
    });

function color(value) {
  var c = value <= 1 ? 255 * value : 128 + 128 / (value - 1);
  return "rgb(" + ~~c +","+ ~~c +", 255)";
}

var skip = function(i,j) {
  // to make the grid rectangular we need to cut the triangles off
  var outside_square_ish = i + ~~((j+1)/2) >= rows || i - ~~((columns-j-1)/2) <= 0;
  return outside_square_ish || i==0 || j==0 || i==(rows-1) || j==(columns-1);
};

var Snow = {
  generations: 0,
  
  init: function() {
    // init canvas background so we don't have to stroke() the hexes
    var background =   color(beta);
    //$(document.body).css({ "background-color" : background });
    canvas.css({ "background-color" : background });
    var flake;
    Snow.flake = flake = new HexGrid(canvas[0], hex_height, rows, columns, {x:dx, y:dy });
    var prev;
    
	
	
    for (var k=0 ; k < flake.hexes.length ; k++)
    {
      var hex = flake.hexes[k];

      // init background water level
      hex.value = beta //* Math.random();

      // force initial draw by guaranteeing abs(hex.value-hex.prev) > delta
      hex.prev = Infinity;

      hex.receptive = false; 

      // start with a single cell of ice in the center
      if (hex.row==center.i && hex.column ==center.j)
        hex.value = 1;

      // precompute skips
      if (skip(hex.row, hex.column)) {
		    hex.skip = true;
        continue;
      }

      Snow.seed = Snow.seed || { next: hex };
      if (prev)
        prev.next = hex;
      prev = hex;

      // pre-compute the nearest neighbors for performance
      hex.nn = Snow.flake.getNeighbors(hex.row,hex.column);
      /*
      for (var n=0 ; n<hex.nn.length ; n++)
        hex["nn" + n] = hex.nn[n];
      */
    }
  },
  
  /* try to beat 43.36 gen/sec 
  ?stop=540&hex_size=6&stats=1&generations=20&gamma=0.000000001&beta=0.5
   0- 43.36                  [start]
   1- 46.? using +-          [7%]
   2- 49.82 removed 3rd loop [7%] [15%]
   3- 54.45 while(n--)       [9%] [26%]
   4- 64.08 linked-list      [18%] [27% against #2] [48%]
  */
  iterate : function() {
    //ctx.clearRect(0,0,canvas.width, canvas.height);
    Snow.generations++;
    var flake = Snow.flake;
    var hexes = flake.hexes;
    
    var hex = Snow.seed;
    // 1 determine receptivenes.
    // a cell is receptive if it's ice (hex.value >= 1) or if at least one of its nearest neighbors is ice.

    while(true)
    {
      hex = hex.next;
      if (!hex)
        break;
        
      if (hex.value >= 1)
      {
        hex.receptive = 1;
        continue;
      }
      
      var nn = hex.nn;
      var n = 6;
      while(n--)
      {
        if (nn[n].value >= 1)
        {
          hex.receptive = true;
          break;
        }
      }
    } 
    
    // for non-receptive: average 1/2 self + 1/12 NN
    hex = Snow.seed;
    while (true)
    {
      hex = hex.next;
      if (!hex) break;
        
      // skip ice cells %5
      if (hex.value >= 1)
      {
        hex.diffusion = 0;
      }
      else
      {
        var nn = hex.nn;
        var neighbors=0;
        
        n=6;
        while (n--)
        {
          var nb = nn[n];
          if (!nb.receptive)
            neighbors += nb.value;
        }

        hex.diffusion = neighbors/12;
        if (!hex.receptive)
          hex.diffusion += hex.value/2;
      }
      
      // add diffusion and gamma
      if (hex.receptive)
        hex.value += gamma * Math.random() + hex.diffusion;
      else
        hex.value = hex.diffusion;
    }
  },
  
  draw: function() {    
    Snow.flake.draw();
  },

  render: function() {
    var now= +new Date;
    var diff = now - Snow.time;
    var gps = 1000 * Snow.generations / (now - Snow.start_time) ;
    
    document.title =  "[g = " + Snow.generations + "]["+gps.toFixed(2)+" gen/sec]";
    
    for (var i=0 ; i<generations_per_frame ; i++)
      Snow.iterate();
    
    Snow.draw();
    
    if (STOP && Snow.generations > STOP) return;
    
    Snow.time = +new Date;
    Snow.timeout = setTimeout(Snow.render, 2);
  },
  
  start: function() {
    Snow.start_time = +new Date;
    Snow.render();
  },
  
  stop: function() {
    clearTimeout(Snow.timeout);
    Snow.timeout = null;
  }
};

window["Snow"] = Snow;
