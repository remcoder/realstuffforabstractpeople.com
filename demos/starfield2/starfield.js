function Starfield(obj)
{ 
  obj.__proto__ = Starfield.prototype;
  return obj
}

Starfield.prototype = {  
  init: function()
  {
    // set up boundaries
    this.maxLeft = -this.width/2,
    this.maxRight = this.width/2,
    this.maxUp = -this.height/2,
    this.maxDown = this.height/2,
    
    // init canvas
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.getContext('2d').translate(this.width/2,this.height/2); 
 
    this.ctx = this.canvas.getContext('2d');
    
    // create stars
    this.stars = [];
    for (var i=0 ; i<this.num_stars ; i++)
    {
      var star = new Star();
      star.randomize(2.3);
      this.stars.push(star);
    }
    
    // init frame counter
    this.frames = 0;
    this.frameRate = 0.0;
    this.maxRate = 0.0;
    this.timestamp = new Date();
  },

  animate: function()
  { 

    // blur
    /*if (this.explosion ==0 )
      this.ctx.fillStyle = "rgba(255,255,255, " + this.opacity + ")";
    else*/
      this.ctx.fillStyle = "rgba(0,0,0, " + this.opacity + ")";
    this.ctx.fillRect(this.maxLeft, this.maxUp, this.width, this.height);
          
    // update stars
    this.ctx.fillStyle = "rgb(150,150,255)";
    for (var i=0 ; i<this.num_stars ; i++)
      this.stars[i].update();      
      
    this.updateStats();
    
    // store the timeout so we can cancel it
    this.timeout = window.setTimeout(function() {starfield.animate(); }, 0);
  },
  
  updateStats: function()
  {
    this.calcFrameRate();
  
    if (this.frames == 0)
    {
      var frameRateString  = "[current: " + this.frameRate.toFixed(1) + " frames/sec]";
      var maxRateString  = "[max: " + this.maxRate.toFixed(1) + " frames/sec]";
      document.title = "Starfield " + frameRateString + maxRateString;
      window.status = frameRateString + maxRateString;
    }
  },
  
  calcFrameRate: function()
  {
    var newTime = +new Date();
    var milliseconds =  newTime - this.timestamp;
    var epoch = 4000; // wait for this many milliseconds before recalculating the framerate
    if (milliseconds >= epoch)
    {
      this.frameRate = 1000 * this.frames / milliseconds;
      this.maxRate = Math.max(this.frameRate, this.maxRate);
      
      this.timestamp = newTime;
      this.frames = 0;
    }
    else
    {
      this.frames++;
    }
  }
};