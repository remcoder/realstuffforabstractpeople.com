///<reference path='../typings/jquery/jquery.d.ts' />
///<reference path='Cubism.Shape.ts' />
///<reference path='Cubism.PointSet.ts' />

module Solver {

    export var Pieces : { [key : string] : Array<Cubism.IPos> } = {
        shape_a : [{x:0,y:0,z:0},{x:3,y:0,z:0},{x:0,y:1,z:0},{x:0,y:0,z:1},{x:1,y:0,z:1},{x:2,y:0,z:1},{x:3,y:0,z:1},{x:3,y:1,z:1}],
        shape_b : [{x:0,y:0,z:0},{x:0,y:1,z:0},{x:3,y:1,z:0},{x:0,y:1,z:1},{x:1,y:1,z:1},{x:2,y:1,z:1},{x:3,y:1,z:1}],
        shape_c : [{x:1,y:0,z:0},{x:2,y:0,z:0},{x:3,y:0,z:0},{x:3,y:1,z:0},{x:0,y:2,z:0},{x:3,y:2,z:0},{x:0,y:3,z:0},{x:1,y:3,z:0},{x:2,y:3,z:0},{x:3,y:3,z:0},{x:2,y:0,z:1},{x:3,y:0,z:1},{x:0,y:2,z:1},{x:3,y:3,z:1}],
        shape_d : [{x:1,y:0,z:0},{x:2,y:0,z:0},{x:3,y:0,z:0},{x:2,y:1,z:0},{x:1,y:2,z:0},{x:2,y:2,z:0},{x:0,y:3,z:0},{x:1,y:3,z:0},{x:2,y:3,z:0},{x:3,y:3,z:0},{x:1,y:0,z:1},{x:2,y:0,z:1}],
        shape_e : [{x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:0},{x:3,y:1,z:0},{x:0,y:2,z:0},{x:3,y:2,z:0},{x:0,y:3,z:0},{x:1,y:3,z:0},{x:2,y:3,z:0},{x:3,y:3,z:0},{x:0,y:0,z:1},{x:1,y:3,z:1}],
        shape_f : [{x:0,y:0,z:0},{x:0,y:1,z:0},{x:0,y:2,z:0},{x:2,y:2,z:0},{x:0,y:3,z:0},{x:1,y:3,z:0},{x:2,y:3,z:0},{x:3,y:3,z:0},{x:1,y:2,z:1},{x:1,y:3,z:1},{x:3,y:3,z:1}]
    }

    var rotations =
        [
        "Y",
        "YY",
        "YYY",
        "Z",
        "ZX",
        "ZXX",
        "ZXXX",
        "ZZ",
        "ZZY",
        "ZZYY",
        "ZZYYY",
        "ZZZ",
        "ZZZX",
        "ZZZXX",
        "ZZZXXX",
        "X",
        "XZ",
        "XZZ",
        "XZZZ",
        "XXX",
        "XXXZ",
        "XXXZZ",
        "XXXZZZ"];

    var voxelSize = 50; // pixel size of 1 voxel

//    function drawShape(pieceType, pointSet : Cubism.PointSet, variant: string) {
//      var variants = <HTMLTableElement> $('#variants')[0];
//      var row = <HTMLTableRowElement> variants.insertRow(0);
//      var cell = row.insertCell();
//
//      var bounds = pointSet.getBounds();
//      var maxEdgeLength = 1 + Math.max( Math.max(bounds.max.x, bounds.max.y), bounds.max.z);
//      //console.debug('maxEdgeLength', maxEdgeLength);
//      var containerSize = maxEdgeLength * voxelSize * 1.5;
//      var $container = $('<div>')
//          .css({
//              width: containerSize,
//              height: containerSize
//          })
//          .addClass('voxel-shape-container');
//
//      $(cell).append($container);
//
//      var shape = new Cubism.Shape($container[0], voxelSize, pointSet.points);
//      $(shape.element)
//          .addClass(pieceType)
//          .addClass(variant)
//          .attr('title', variant);
//
//      return shape;
//    }
//
//    function drawShape2(className, pointSet : Cubism.PointSet, variant: string) {
//        var $container = $('<div>')
//            .css({
//                width: 200,
//                height: 200
//            })
//            .addClass('voxel-shape-container');
//
//        $('body').append($container);
//
//        var shape = new Cubism.Shape($container[0], voxelSize, pointSet.points);
//        $(shape.element).addClass(className);
//
//        return shape;
//    }

    function drawShape3(pieceType, pointSet : Cubism.PointSet, variant: string, pos: Cubism.IPos, alignToBottom : boolean = false) {

        var bounds = pointSet.getBounds();
        var maxEdgeLength = 1 + Math.max( Math.max(bounds.max.x, bounds.max.y), bounds.max.z);
        //console.debug('maxEdgeLength', maxEdgeLength);
        var containerSize = maxEdgeLength * voxelSize * 1.5;
        var $container = $('.voxel-shape-container');

        var alignedPointSet = alignToBottom ? pointSet.translateAll(0,3-bounds.max.y,0) : pointSet;
        var shape = new Cubism.Shape($container[0], voxelSize, alignedPointSet.points);
        $(shape.element)
            .addClass(pieceType)
            .addClass(variant)
            //.attr('title', pointSet.toString());

        shape.element.translate3d(pos.x, pos.y , pos.z);

        return shape;
    }

    function drawVariant(pieceType : string, pointSet : Cubism.PointSet, variant: string, pos: Cubism.IPos) {
        setTimeout(()=> {
            var variantVoxelSize = voxelSize / 5;
            var bounds = pointSet.getBounds();
            var $container = $('.voxel-shape-container');

            var shape = new Cubism.Shape($container[0], variantVoxelSize, pointSet.points);
            $(shape.element)
                .addClass(pieceType)
                .addClass(variant)
                .attr('title', variant);

            shape.element.translate3d(pos.x, pos.y , pos.z);

            var xyPlanePointSet = Cubism.PointSet.Cuboid(4, 4, 1).translateAll(0,0,-1);
            var xyPlane = new Cubism.Shape($container[0], variantVoxelSize, xyPlanePointSet.points);
            $(xyPlane.element)
                .addClass("plane")
                .addClass("xy-plane");

            xyPlane.element.translate3d(pos.x, pos.y , pos.z);

        },0);
        //return shape;
    }

    function drawGrid(pos: Cubism.IPos) {
        var $container = $('.voxel-shape-container');
        var xyPlanePointSet = Cubism.PointSet.Cuboid(4, 4, 1).translateAll(0,0,-1);
        var xyPlane = new Cubism.Shape($container[0], voxelSize, xyPlanePointSet.points);
        $(xyPlane.element)
            .addClass("plane")
            .addClass("xy-plane");


        xyPlane.element.translate3d(pos.x, pos.y , pos.z);

        var yzPlanePointSet = Cubism.PointSet.Cuboid(1, 4, 4).translateAll(-1,0,0);
        var yzPlane = new Cubism.Shape($container[0], voxelSize, yzPlanePointSet.points);
        $(yzPlane.element)
            .addClass("plane")
            .addClass("yz-plane");

        yzPlane.element.translate3d(pos.x, pos.y , pos.z);

        var xzPlanePointSet = Cubism.PointSet.Cuboid(4, 1, 4).translateAll(0,4,0);
        var xzPlane = new Cubism.Shape($container[0], voxelSize, xzPlanePointSet.points);
        $(xzPlane.element)
            .addClass("plane")
            .addClass("xz-plane");

        xzPlane.element.translate3d(pos.x, pos.y , pos.z);
    }

    export function rotationalVariants(s : Cubism.PointSet) : Array<{ variant: string; pointSet: Cubism.PointSet }> {

        var variants = [];
        for(var r=0 ; r<rotations.length ; r++)
        {
          var rot = rotations[r];
          var variant = s.clone();
//          console.debug(rot);

          for (var i=0 ; i<rot.length ; i++)
          {
            var step = rot[i];
            switch (step) {
              case "X":
                variant = variant.rotateAllX();
                break;
              case "Y":
                variant = variant.rotateAllY();
                break;
              case "Z":
                variant = variant.rotateAllZ();
                break;
              }
          }
          variant = variant.normalize();
          variants.push({ variant: rot, pointSet: variant });
        }

        return variants;
    }

    export function translationalVariants (s : Cubism.PointSet) : Array<{ variant: string; pointSet: Cubism.PointSet }> {
        var bounds = s.getBounds();
        // coords of the 4x4x4 cube is (3,3,3):
        var dx = 3-bounds.max.x;
        var dy = 3-bounds.max.y;
        var dz = 3-bounds.max.z;

        //console.log("translationalVariants: ", bounds, dx,dy,dz);

        var variants = [];
        for (var x=0;x<=dx;x++)
        for (var y=0;y<=dy;y++)
        for (var z=0;z<=dz;z++)
            variants.push({ pointSet: s.translateAll(x,y,z), variant: x+'_'+y+'_'+z });

        return variants;
    }

    export function allVariants (ps : Cubism.PointSet) : Array<{ variant: string; pointSet: Cubism.PointSet }>
    {
        return Solver.rotationalVariants(ps)
            .reduce((variants, r : {variant: string; pointSet: Cubism.PointSet} ) => {
                var tvariants = Solver.translationalVariants(r.pointSet);
                tvariants.forEach(t =>  {t.variant += '|' + r.variant });

                return variants.concat(tvariants);
            }, []);
    }

    var offset = new Cubism.Point({x:150, y:50, z:0});
    var pieceKeys = Object.keys(Pieces);
    //sort pieces descending
    pieceKeys.sort((a,b)=>Pieces[b].length - Pieces[a].length );
    //console.log(pieceKeys);


    /// precompute all variants of all pieces
    var variants : { [label: string] : Array<Cubism.PointSet> } = {};

    pieceKeys.forEach((p,i) => {
        var piece = new Cubism.PointSet( Pieces[p] );
        if (i == 0)
            variants[p] = [piece, piece.translateAll(0,0,1), piece.translateAll(0,0,2) ];
        else
            variants[p] = allVariants( piece).map(v => v.pointSet);
    });


    export interface IState extends Array<Cubism.PointSet>
    {}


    function next(state : IState) : Array<IState> {
        var nextPieceIndex = state.length;
        var nextPiece = pieceKeys[ nextPieceIndex ];

        return variants[ nextPiece ]
            .filter(v => state.every(p => !v.overlapsWith(p)) )
            .map(v => {
                var newState = state.slice(0);
                newState.push(v);
                return newState;
            });
    }

    export function solve(state : Array<Cubism.PointSet>) : IState {
        state = state || [];

        if (state.length == 6) {
            console.log('solution found!')
            //console.log(state);

            return state;
        }

        // calc possible successor states solution -> solution'
        // try solving each successor state until we're done
        var nextStates = next(state);
        if (!nextStates.length)
            return null;

        return nextStates.map(solve).filter(s=>!!s)[0];
    }

    export function displaySolution(state: IState) {
        state.forEach((ps,i) =>
            drawShape3(pieceKeys[i], ps, "", {x:150, y:0, z:0})
        , 0);
    }

    export function animateSolution(state: IState) {
        var pos = {x:150, y:0, z:0};

        function drawLoop(i) {

            drawShape3(pieceKeys[i], state[i], "", pos);
            if (i<5)
                setTimeout(() => drawLoop(++i), 1000);
            else {
                setTimeout(() => $('.shape_a, .shape_b, .shape_c, .shape_d, .shape_e, .shape_f').remove() , 3000);
                setTimeout(() => drawLoop(0), 4000 );
            }
        }

        drawGrid(pos);
        setTimeout(() => drawLoop(0), 1000 );
    }
}
