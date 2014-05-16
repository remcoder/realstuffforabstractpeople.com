module Cubism {
   export interface IPos { 
    x:number; 
    y:number; 
    z:number;
  }

  export class Point implements IPos {
  	x:number; 
    y:number; 
    z:number;

    constructor( x_or_pos:{} )
    constructor( x_or_pos:number,  y:number,  z?:number)
    constructor( x_or_pos:any,  y?:number,  z?:number) {
      if (typeof x_or_pos == 'number')
      {
	      this.x = x_or_pos;
	      this.y = y;
	      this.z = z;
  	  }
  	  else 
  	  {
  	  	this.x = x_or_pos.x;
  	  	this.y = x_or_pos.y;
  	  	this.z = x_or_pos.z;
  	  }
    }

    rotateZ() {
      return new Point(this.y, -this.x, this.z);
    }

    rotateX() {
      return new Point(this.x, this.z, -this.y);
    }

    rotateY() {
      return new Point(-this.z, this.y, this.x)
    }

    translate(x,y,z) : Point {
        return new Point(this.x + x, this.y + y, this.z + z);
    }

    equals(p2 : Point) : boolean {
        return this.x == p2.x && this.y == p2.y && this.z == p2.z;
    }
  }
}
