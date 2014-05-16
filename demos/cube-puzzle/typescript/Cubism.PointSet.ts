///<reference path='utils.ts' />
///<reference path='Cubism.Point.ts' />

module Cubism {
	export class PointSet {

	    points : Array<Point>;
        bits0 : number;
        bits1 : number;
        bits2 : number;
        bits3 : number;

        static fromBits(bits0 : number, bits1: number, bits2: number, bits3: number) : PointSet {
            var ps = new PointSet();

            ps.bits0 = bits0;
            ps.bits1 = bits1;
            ps.bits2 = bits2;
            ps.bits3 = bits3;

            ps.points = [];
            for(var x=0 ; x<4 ;x++)
            for(var y=0 ; y<4 ;y++)
            for(var z=0 ; z<4 ;z++)
            {
                var bits = z === 0 ? bits0
                            : z === 1 ? bits1
                            : z === 2 ? bits2
                            : bits3;
                if (bits >> (x + y*4) & 1)
                    ps.points.push(new Point({x:x,y:y,z:z}));
            }

            return ps;
        }

		constructor(points? : Array<IPos>) {
            if (!points)
                return; // uninitialized;

		    this.points = points.map(p => new Point(p) );

            // numeric encoding in 4 parts b/c integers cannot be accurately represented until 31 bits
            // http://www.hunlock.com/blogs/The_Complete_Javascript_Number_Reference
            this.bits0 = this.points
                .filter(p => p.z===0)
                .reduce((acc : number, p : Point) => {
                    return acc | (1 << (p.x + p.y * 4));
                }, 0);

            this.bits1 = this.points
                .filter(p => p.z===1)
                .reduce((acc : number, p : Point) => {
                    return acc | (1 << (p.x + p.y * 4));
                }, 0);

            this.bits2 = this.points
                .filter(p => p.z===2)
                .reduce((acc : number, p : Point) => {
                    return acc | (1 << (p.x + p.y * 4));
                }, 0);

            this.bits3 = this.points
                .filter(p => p.z===3)
                .reduce((acc : number, p : Point) => {
                    return acc | (1 << (p.x + p.y * 4));
                }, 0);
		}

		rotateAllX() : PointSet
		{
			return new PointSet(this.points.map(p => p.rotateX() ));
		}

		rotateAllY() : PointSet
		{
			return new PointSet(this.points.map(p => p.rotateY() ));
		}

		rotateAllZ() : PointSet
		{
			return new PointSet(this.points.map(p => p.rotateZ() ));
		}

        clone() : PointSet {
            return new PointSet(this.points);
        }

        // get the bounding cuboid for this pointset, defined by two opposing points: min & max.
        getBounds() : { min : IPos; max : IPos}  {
            return this.points.reduce((acc: { min : IPos; max : IPos}, p: IPos) => {
                return {
                    min : { x:Math.min(acc.min.x, p.x), y:Math.min(acc.min.y, p.y), z:Math.min(acc.min.z, p.z)},
                    max : { x:Math.max(acc.max.x, p.x), y:Math.max(acc.max.y, p.y), z:Math.max(acc.max.z, p.z)}
                }
            }, {
                min : {x: Infinity, y: Infinity, z: Infinity},
                max : {x:-Infinity, y:-Infinity, z:-Infinity}
            });
        }

        translateAll(x,y,z) : PointSet {
            return new PointSet(this.points.map(p => p.translate(x,y,z) ))
        }

        // translates the pointset such that this.getBounds().min equals (0,0,0)
        normalize() : PointSet {
            var bounds = this.getBounds();
            return this.translateAll(-bounds.min.x, -bounds.min.y, -bounds.min.z);
        }

        equals(s2 : PointSet) : boolean {
//            return this.toString() == s2.toString();
            return this.bits0 == s2.bits0 && this.bits1 == s2.bits1 && this.bits2 == s2.bits2 && this.bits3 == s2.bits3;
        }

        toString() : string {
            var s0 = this.bits0.toString(2);
            var s1 = this.bits1.toString(2);
            var s2 = this.bits2.toString(2);
            var s3 = this.bits3.toString(2);

            // pad with leading zeros
            return  "0".times(16 - s0.length) + s0 + ' | ' +
                    "0".times(16 - s1.length) + s1 + ' | ' +
                    "0".times(16 - s2.length) + s2 + ' | ' +
                    "0".times(16 - s3.length) + s3;

//            var bits = new Array(64);
//            var result = "";
//            this.points.forEach(p => bits[p.x + p.y*4 + p.z*16] = true);
//            for(var i=0 ; i<64 ; i++)
//                result += bits[i] ? "1" : "0";
//
//            return result;
        }

        count() : number {
            return this.bits0.countBits() + this.bits1.countBits() + this.bits2.countBits() + this.bits3.countBits();
        }

        intersect(ps : PointSet) : PointSet {
            var bits0 = this.bits0 & ps.bits0;
            var bits1 = this.bits1 & ps.bits1;
            var bits2 = this.bits2 & ps.bits2;
            var bits3 = this.bits3 & ps.bits3;
            return PointSet.fromBits(bits0, bits1, bits2, bits3);
        }

        overlapsWith(ps : PointSet) {
            return  this.bits0 & ps.bits0 ||
                    this.bits1 & ps.bits1 ||
                    this.bits2 & ps.bits2 ||
                    this.bits3 & ps.bits3;
        }

        static Cube(edgeLength: number) : PointSet {
            return PointSet.Cuboid(edgeLength, edgeLength, edgeLength);
        }

        static Cuboid(xLength: number, yLength: number, zLength: number) : PointSet {
            var voxels = [];

            for(var x=0 ; x<xLength ; x++)
                for(var y=0 ; y<yLength ; y++)
                    for(var z=0 ; z<zLength; z++)
                        voxels.push({x:x, y:y, z:z});

            return new PointSet(voxels);
        }
	}
}
