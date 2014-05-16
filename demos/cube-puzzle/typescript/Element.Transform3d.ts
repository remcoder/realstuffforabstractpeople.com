/*
  Element.Transform3d.js
  
  MIT license
  remcoder [at] gmail (dot) com
 
  This is a convenience library for making simple CSS 3D Tranformations easily scriptable.
*/


///<reference path='utils.ts' />
///<reference path='../typings/CSSStyleDeclaration.d.ts' />

interface HTMLElement {
  // method that start with 'set' will overwrite current transformation
  setTranslate3d(x:number,y:number,z:number);
  setRotate3d(x:number,y:number,z:number);
  setScale3d(x:number,y:number,z:number);

  /**
    *
    * methods that do not start with 'set' can incrementally change the elements transformation
    * this works by first parsing the elements transformation string back into a WebkitCSSMatrix
    * this could possible be sped up by using a pure js implementation of CSSMatrix instead, avoing parsing.
    * For a pure js implementation of CSSMatrix see:
    * - FirminCSSMatrix: https://github.com/beastaugh/firmin/blob/master/src/matrix.js
    * - XCssMatrix: https://npmjs.org/package/xcssmatrix
  */
  translate3d(x:number,y:number,z:number);
  translateX(x: number);
  translateY(y: number);
  translateZ(z: number);

  rotateAxisAngle(x:number, y:number, z:number, a: number);
  rotate3d(x:number,y:number,z:number);
  rotateX(angle: number);
  rotateY(angle: number);
  rotateZ(angle: number);

  scale3d(x:number,y:number,z:number);
  scaleX(angle: number);
  scaleY(angle: number);
  scaleZ(angle: number);
}

interface WebKitCSSMatrix {
  new (s: string) : WebKitCSSMatrix;
  __IDENTITY__ : WebKitCSSMatrix;
  translate(x:number, y:number, z:number) : WebKitCSSMatrix;
  rotate(x:number, y:number, z:number) : WebKitCSSMatrix;
  rotateAxisAngle(x:number, y:number, z:number, a: number) : WebKitCSSMatrix;
  scale(x:number, y:number, z:number) : WebKitCSSMatrix;
}

declare var WebKitCSSMatrix : WebKitCSSMatrix;
WebKitCSSMatrix.__IDENTITY__ = new WebKitCSSMatrix("matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)");

extend(Element.prototype, { 
  getComputedTransform : function () {
    // returns a WebKitCSSMatrix object. for reference see:
    // http://developer.apple.com/safari/library/documentation/AppleApplications/Reference/SafariJSRef/WebKitCSSMatrix/WebKitCSSMatrix.html 
    
    // TODO: test if it is faster w/o the try/catch and always pre-parse the transformation string
    var transform = window.getComputedStyle(this).webkitTransform;

    if (transform === "") // a null would be OK because that would a readable but uninitialized value
      throw new Error("Cannot read transform info. Element not attached to the DOM?");
      
    try {
      return new WebKitCSSMatrix(transform);
    }
    catch (error) {
      if (transform == null) return null;
      // FIXME: split the numbers directly with a regexp (for speed)
      var matches = transform.match(/matrix3d\((.*)\)/);
      if (matches && matches[1]) {
        var numbers = matches[1].split(",").map(parseFloat);
        return new WebKitCSSMatrix("matrix3d(" + numbers.join(",") +")");
      }
      else {
        // try a 2D matrix
        matches = transform.match(/matrix\((.*)\)/);
        if (matches && matches[1]) {
          var numbers = matches[1].split(",").map(parseFloat);
          return new WebKitCSSMatrix("matrix(" + numbers.join(",") +")");
        }
        else {
          throw new Error("Unable to fix this transformation string:\n" + transform + "\n\tinner exception:\n\t" + error);
        }
      }
    }
  },
  
  resetTransform: function() : HTMLElement {
    this.style.webkitTransform = null;
    return this;
  },
  
  setTranslate3d: function(x,y,z) : HTMLElement {
    this.style.webkitTransform = WebKitCSSMatrix.__IDENTITY__.translate(x,y,z);
    return this;
  },
  
  translate3d: function(x,y,z) : HTMLElement {
    this.style.webkitTransform = this.getComputedTransform().translate(x,y,z);
    return this;
  },
  
  translateX : function(x) : HTMLElement {
    this.translate3d(x,0,0);
    return this;
  },
  
  translateY : function(y) : HTMLElement {
    this.translate3d(0,y,0);
    return this;
  },
  
  translateZ : function(z) : HTMLElement {
    this.translate3d(0,0,z);
    return this;
  },
  
  setRotateAxisAngle: function(x,y,z,a) : HTMLElement {
    this.style.webkitTransform = WebKitCSSMatrix.__IDENTITY__.rotateAxisAngle(x,y,z,a);
    return this;
  },

  rotateAxisAngle: function(x,y,z,a) : HTMLElement {
    this.style.webkitTransform = this.getComputedTransform().rotateAxisAngle(x,y,z,a);
    return this;
  },

    setRotate3d: function(x,y,z,a) : HTMLElement {
        this.style.webkitTransform = WebKitCSSMatrix.__IDENTITY__.rotate(x,y,z);
        return this;
    },

    rotate3d: function(x,y,z,a) : HTMLElement {
        this.style.webkitTransform = this.getComputedTransform().rotate(x,y,z);
        return this;
    },
  
  rotateX: function(x) : HTMLElement {
    this.rotate3d(x,0,0);
    return this;
  },
  
  rotateY: function(y) : HTMLElement {
    this.rotate3d(0,y,0);
    return this;
  },
  
  rotateZ: function(z) : HTMLElement {
    this.rotate3d(0,0,z);
    return this;
  },
  
  setScale3d: function(x,y,z) : HTMLElement {
    this.style.webkitTransform = WebKitCSSMatrix.__IDENTITY__.scale(x,y,z);
    return this;
  },
  
  scale3d: function(x,y,z) : HTMLElement {
    this.style.webkitTransform = this.getComputedTransform().scale(x,y,z);
    return this;
  },
  
  scaleX: function(x) : HTMLElement {
    this.scale3d(x,1,1);
    return this;
  },
  
  scaleY: function(y) : HTMLElement {
    this.scale3d(1,y,1);
    return this;
  },
  
  scaleZ: function(z) : HTMLElement {
    this.scale3d(1,1,z);
    return this;
  }
});

