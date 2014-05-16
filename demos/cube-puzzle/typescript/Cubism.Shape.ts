/*
 * MIT license
 * remcoder [at] gmail (dot) com
 
 This is a little library for making shapes out of voxels (cubes) using CSS 3D Transforms
 */

///<reference path='../typings/jquery/jquery.d.ts' />
///<reference path='../typings/CSSStyleDeclaration.d.ts' />
///<reference path='Element.Transform3d.ts' />
///<reference path='Cubism.Point.ts' />
///<reference path='Cubism.PointSet.ts' />
///<reference path='Cubism.Voxel.ts' />
 
module Cubism {
  

  export class Shape {

    width   : number
    height  : number
    depth   : number
    element : HTMLElement
    voxels  : Array<Voxel> = []

    constructor (public container : HTMLElement, public voxelSize : number, coordList: Array<IPos>) {
      // TODO: calc the size of the shape in 3 dimensions
      this.width = voxelSize;
      this.height = voxelSize;
      this.depth = voxelSize;
      
      this.element = $('<div>')
        .addClass("voxel-shape")
        .css({
          width : this.width,
          height : this.height
        })
        .appendTo(this.container)[0];
      
      coordList.forEach((pos) => {
        this.voxels.push(new Voxel(this, pos, this.voxelSize));
      });
      
      // if (autocenter)
      //   this.element.translate3d(-this.width/2, -this.height/2, -this.depth/2);
    }

    clone () : Shape {
      var coordsList = this.voxels.map((v) => {
        return {
          x: v.pos.x,
          y: v.pos.y,
          z: v.pos.z
        };
      });

      var newShape = new Shape(this.container, this.voxelSize, coordsList);
      $(newShape.element).attr("class", $(this.element).attr("class"));
      return newShape;
    }

//    // rotate around the Z axis, in steps of 90 degrees
//    rotateZ(steps : number = 1) {
//      this.voxels.forEach((v) => {
//        v.rotateZ(steps);
//        v.updatePosition();
//      })
//      return this;
//    }
//
//    // rotate around the X axis, in steps of 90 degrees
//    rotateX(steps : number = 1) {
//      this.voxels.forEach((v) => {
//        v.rotateX(steps);
//        v.updatePosition();
//      })
//      return this;
//    }
//
//    // rotate around the X axis, in steps of 90 degrees
//    rotateY(steps : number = 1) {
//      this.voxels.forEach((v) => {
//        v.rotateY(steps);
//        v.updatePosition();
//      })
//      return this;
//    }
  }


}
