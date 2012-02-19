function Star ()
{
 this.pos = {x: 0, y:0, z:0};
}
 
Star.prototype = {
 randomize: function(minZ) {
   function random(lbound, ubound)
   {
   	return lbound + Math.floor(Math.random() * (ubound - lbound + 1));
   }
   
   this.pos.z = random(minZ, starfield.depth);
   this.pos.x = random(starfield.maxLeft, starfield.maxRight) * this.pos.z;
   this.pos.y = random(starfield.maxUp, starfield.maxDown) * this.pos.z;
 },
 

 
 update: function() {
   
   function projection(pos) {
     return { x: pos.x / pos.z, y: pos.y / pos.z };
   }
   
   this.pos.x += starfield.speed.x;
   this.pos.y += starfield.speed.y;
   this.pos.z += starfield.speed.z;
   
   this.projection = projection(this.pos);      
   
   if (! this.isVisible())
   {
     this.randomize(starfield.depth-1);
     this.projection = projection(this.pos);
   }
   
   this.plot();
 },
 
 plot: function() {
   var size = Math.min(starfield.starSize / this.pos.z, starfield.starSize);
   starfield.ctx.fillRect (this.projection.x, this.projection.y, size, size); 
 },
 
 isVisible: function() {
    return this.pos.z > 0 && 
     this.pos.z <= starfield.depth && 
     this.projection.x <= starfield.maxRight && 
     this.projection.x >= starfield.maxLeft && 
     this.projection.y <= starfield.maxDown && 
     this.projection.y >= starfield.maxUp;
 }
};