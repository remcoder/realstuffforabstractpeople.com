///<reference path='Cubism.Point.ts' />
///<reference path='Cubism.Shape.ts' />


module Cubism {

    enum Side { front, back, left, right, top, bottom };


    // a Voxel is a set of coords and a DOM tree
    export class Voxel {
        element : HTMLElement
        constructor (public shape : Shape, public pos : IPos, public voxelSize : number ) {
            //var center =  this.autocenter ? -(0.5*this.zvoxelSize-0.5*this.voxelSize) : 0;

            this.createVoxelElement();
            this.updatePosition();
        }

        createVoxelElement() {

            this.element = $('<div>')
                .addClass("voxel")
                .appendTo(this.shape.element)[0];

            [Side.front, Side.back, Side.left, Side.right, Side.top, Side.bottom]
                .forEach((which) => this._createSide(which));

            // if (autocenter)
            //   element.translate3d(-size/2, -size/2, -size/2);
        }

        private _createSide(which: Side) {
            var side = $('<div>')
                .addClass("voxel-side")
                .addClass(Side[which])
                .appendTo(this.element)[0];


            var offset = this.voxelSize/2;
            switch(which)
            {
                case Side.front:
                    side.translateZ(offset);
                    break;
                case Side.back:
                    side.translateZ(-offset);
                    break;
                case Side.left:
                    side.translateX(-offset).rotateY(90);
                    break;
                case Side.right:
                    side.translateX(offset).rotateY(-90);
                    break;
                case Side.top:
                    side.translateY(offset).rotateX(90);
                    break;
                case Side.bottom:
                    side.translateY(-offset).rotateX(-90);
                    break;
                default:
                    side.rotateY(90);
            }

            return side;
        }

        updatePosition() {
            this.element.setTranslate3d(this.pos.x*this.voxelSize, this.pos.y*this.voxelSize, this.pos.z*this.voxelSize);
            //.translateZ(center);
        }
    //
    //    // rotate around the Z axis, in steps of 90 degrees,
    //    rotateZ(steps : number = 1) {
    //      for(var i=0 ; i<steps ; i++) {
    //        var prevX = this.pos.x;
    //        this.pos.x = this.pos.y;
    //        this.pos.y = -prevX;
    //      }
    //    }
    //
    //    // rotate around the X axis, in steps of 90 degrees,
    //    rotateX(steps : number = 1) {
    //      for(var i=0 ; i<steps ; i++) {
    //        var prevY = this.pos.y;
    //        this.pos.y = this.pos.z;
    //        this.pos.z = -prevY;
    //      }
    //    }
    //
    //    // rotate around the Y axis, in steps of 90 degrees,
    //    rotateY(steps : number = 1) {
    //      for(var i=0 ; i<steps ; i++) {
    //        var prevZ = this.pos.z;
    //        this.pos.z = this.pos.x;
    //        this.pos.x = -prevZ;
    //      }
    //    }
    }
}