var sin = Math.sin;
var cos = Math.cos;

var d = document;
var canvas = d.getElementById("c");
var ctx = canvas.getContext("2d");
d.body.style.margin = 0;

var width = canvas.width = innerWidth;
var height = canvas.height = innerHeight;

var left = -width/2;
var ttop = -height/2;

ctx.translate(-left,-ttop);

var scale = height/3;

var rings = 32;
var ringsize = 30;

var zmax = 3;
var zstep = 2*zmax / rings;
var tstep = 2*Math.PI/ringsize;

var zshift = zstep;
var date;

// loop vars
var t,x,y,xt,yt,xtz,ytz,xz,yz;
var wx,wy,wxz,wyz,multiplier, multiplier2;

function rgb(r,g,b) { return "rgb("+ ~~r +","+ ~~g +","+ ~~b +")" }
function hsl(h,s,l) { return "hsl("+Math.floor(h)+","+(100*s)+"%,"+(100*l)+"%)" }

function render(date, ticks) {
  
  ctx.fillStyle = "black";
  ctx.clearRect(left,ttop,width,height);

  zshift-=zstep/3 * ticks / 200;
  if (zshift < 0)  
    zshift += zstep;
  
  var zr=rings;
  while ( zr--) { 
    
    if (zr < 1) continue;
    var z = zr * zstep + zshift;
    var z2 = (zr-1) * zstep + zshift;
    ctx.fillStyle = hsl((date/110 + 10*z)%360,0.5,0.2); //rgb(32,32,64);
    if (rings - zr == 1)
      document.body.style.backgroundColor = ctx.fillStyle;
    
    var color = 255 * (0.7 - z / (rings*zstep));
  
    ctx.strokeStyle = "#222";//rgb(color,color,color)
    
    var offsetx = 0;
    var offsety = 0;

    // wobble
    wx = offsetx+ sin(z+date/1700) * 70;
    wy = offsety+ cos(z+date/1100) * 70;
    wxz = offsetx+ sin(z2+date/1700) * 70;
    wyz = offsety+ cos(z2+date/1100) * 70;
    multiplier = scale / z;
    multiplier2 = scale / z2;    
    
    ctx.beginPath();

    for (var r=0 ; r<ringsize ; r++) {
      t = r*tstep + Math.PI + sin(date/3700); // includes roll
      
      x = wx + cos(t) * multiplier;
      y = wy + sin(t) * multiplier;
      
      // point moved 1 segment along the circle
      xt = wx + cos(t+tstep) * multiplier;
      yt = wy + sin(t+tstep) * multiplier;

      // point moved 1 segment along the circle and 1 step in z
      xtz = wxz + cos(t+tstep) * multiplier2;
      ytz = wyz + sin(t+tstep) * multiplier2;

      // point moved 1 step in z direction
      xz = wxz + cos(t) * multiplier2;      
      yz = wyz + sin(t) * multiplier2;

      
      ctx.moveTo(x,y);
      ctx.lineTo(xt,yt);        
      ctx.lineTo(xtz,ytz);        
      ctx.lineTo(xz,yz);        
      ctx.lineTo(x,y);        
      ctx.closePath();
        
    }
    
    ctx.fill();
    ctx.stroke();
  }

  
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


date = new Date;
(function animloop(){
  requestAnimFrame(animloop);
  //setTimeout(animloop,100);
  var newDate = +new Date;
  var ticks = newDate - date;
  render(date, ticks);
  date = newDate;
})();

window.onresize = function() {
  width = canvas.width = innerWidth;
  height = canvas.height = innerHeight;
  left = -width/2;
  ttop = -height/2;
  ctx.translate(-left,-ttop);
}

