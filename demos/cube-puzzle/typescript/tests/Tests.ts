///<reference path='../Cubism.Shape.ts' />
///<reference path='../solver.ts' />

module Tests {
    export function run() {
        console.info('running tests');
        var before = +new Date;

        var pSet = new Cubism.PointSet(Solver.Pieces['shape_a']);

        // bounds

        var bounds = pSet.getBounds();
        if (bounds.min.x < 0)
            throw new Error('bounds.min.x should be > 0');
        if (bounds.min.y < 0)
            throw new Error('bounds.min.y should be > 0');
        if (bounds.min.z < 0)
            throw new Error('bounds.min.z should be > 0');

        console.info('[test 2] a normalized pointset should always start at (0,0,0)');

        // normalize

        var pSet2 = pSet.normalize();
        var bounds2 = pSet2.getBounds();
        if (bounds2.min.x != 0)
            throw new Error('bounds.min.x should be 0');
        if (bounds2.min.y != 0)
            throw new Error('bounds.min.y should be 0');
        if (bounds2.min.z != 0)
            throw new Error('bounds.min.z should be 0');

        var dims= 'XYZ';
        for(var d = 0 ; d<dims.length ; d++)
        {
            var dim = dims[d];
            var pSet3 = pSet.clone();
            for(var times = 0 ; times<3 ; times++)
            {
                //console.debug( dim + times );
                if (dim == 'X')
                    pSet3 = pSet3.rotateAllX();
                else if (dim == 'Y')
                    pSet3 = pSet3.rotateAllY();
                else if (dim == 'Z')
                    pSet3 = pSet3.rotateAllZ();
            }
            pSet3 = pSet3.normalize();
            var bounds3 = pSet3.getBounds();
            if (bounds3.min.x != 0)
                throw new Error('bounds.min.x should be 0');
            if (bounds3.min.y != 0)
                throw new Error('bounds.min.y should be 0');
            if (bounds3.min.z != 0)
                throw new Error('bounds.min.z should be 0');
        }

        // equals
        var pSet4 = new Cubism.PointSet([{x:0,y:0,z:0}, {x:1,y:0,z:0}]);
        var pSet5 = new Cubism.PointSet([{x:1,y:0,z:0}, {x:2,y:0,z:0}]);
        if (pSet4.equals(pSet5))
            throw new Error('distinct pointsets should  not be equal');

        Object.keys(Solver.Pieces).forEach(p=> {
            var piece = Solver.Pieces[p];
            var pSet1 = new Cubism.PointSet(piece);
            var pSet2 = new Cubism.PointSet(shuffle(piece));
            if (! pSet1.equals(pSet2))
                throw new Error('pointset should equal itself');
        });



        var pSet4 = new Cubism.PointSet([{x:0,y:0,z:0}, {x:1,y:0,z:0}]);
        var pSet5 = new Cubism.PointSet([{x:1,y:0,z:0}, {x:0,y:0,z:0}]);
        if (! pSet4.equals(pSet5))
            throw new Error('pointset equality shouldn\'t depend on order');

        var pSet4 = new Cubism.PointSet([{x:0,y:0,z:0}, {x:0,y:1,z:0}]);
        var pSet5 = new Cubism.PointSet([{x:0,y:1,z:0}, {x:0,y:0,z:0}]);
        if (! pSet4.equals(pSet5))
            throw new Error('pointset equality shouldn\'t depend on order');

        var pSet4 = new Cubism.PointSet([{x:0,y:0,z:0}, {x:0,y:0,z:1}]);
        var pSet5 = new Cubism.PointSet([{x:0,y:0,z:1}, {x:0,y:0,z:0}]);
        if (! pSet4.equals(pSet5))
            throw new Error('pointset equality shouldn\'t depend on order');

        var pSet4 = new Cubism.PointSet([{x:0,y:0,z:0}]);
        var pSet5 = new Cubism.PointSet([{x:1,y:0,z:0}]);
        if (pSet4.intersect(pSet5).count())
            throw new Error('intersection of disjunct pointsets should be empty');

        var pSet4 = new Cubism.PointSet([{x:0,y:0,z:0}]);
        var pSet5 = new Cubism.PointSet([{x:0,y:1,z:0}]);
        if (pSet4.intersect(pSet5).count())
            throw new Error('intersection of disjunct pointsets should be empty');

        var pSet4 = new Cubism.PointSet([{x:0,y:0,z:0}]);
        var pSet5 = new Cubism.PointSet([{x:0,y:0,z:1}]);
        if (pSet4.intersect(pSet5).count())
            throw new Error('intersection of disjunct pointsets should be empty');


        Object.keys(Solver.Pieces).forEach(p=> {
            var piece = Solver.Pieces[p];

            Solver
                .allVariants(new Cubism.PointSet(piece))
                .forEach(v => {
                    if (v.pointSet.points.length != v.pointSet.normalize().toString().match(/1/g).length)
                    {
                        console.debug(JSON.stringify(v.pointSet.points));
                        console.debug(v.pointSet.normalize().toString());
                        throw new Error("bit count not equal to number of points for " + p + " " + v.variant);
                    }

                    var clone = Cubism.PointSet.fromBits(v.pointSet.bits0, v.pointSet.bits1, v.pointSet.bits2, v.pointSet.bits3);
                    if (!clone.rotateAllX().rotateAllX().rotateAllX().rotateAllX().equals(v.pointSet))
                        throw new Error('bitwise clone differs from original ' + p + ' ' + v.variant);

                    if (clone.points.length != v.pointSet.points.length)
                        throw new Error('clone should have same number of points as original for ' + p + ' ' + v.variant);

                    var selfIntersection = v.pointSet.intersect(v.pointSet);
                    if (selfIntersection.count() != v.pointSet.count())
                        throw new Error ('intersection with self should yield same bit count for ' + p + ' ' + v.variant);
                    if (!selfIntersection.equals(v.pointSet))
                        throw new Error ('intersection with self should equal self for ' + p + ' ' + v.variant);

            });
        });

        var count = 0;

        Object.keys(Solver.Pieces).forEach(p=> {
            var piece = Solver.Pieces[p];
            var variants = [];
            Solver.allVariants(new Cubism.PointSet(piece)).forEach(v1 =>{
                variants.forEach(v2 =>{

                    if (v1.variant != v2.variant) {
                        //console.debug( count + '| testing ' + p + ': ' + (v1.variant || 'Id') + ' vs ' + (v2.variant || 'Id'));
                        if (v1.pointSet.equals(v2.pointSet)) {
                            console.debug(JSON.stringify(v1.pointSet));

                            console.debug(JSON.stringify(v2.pointSet));
                            console.debug(v1.pointSet.toString());

                            console.debug(v2.pointSet.toString());
                            console.error('for piece ' + p + ', variant ' + v1.variant + ' unexpectedly equals ' + v2.variant);
                        }

                        count++;
                    }
                });
            });
        });
        console.info('done running tests');
        console.log(+new Date - before, 'ms passed');
    }
}