// Math functions
'use strict';
var Math2 = {

  /**
    * returns a random integer from the closed interval [lbound, ubound].
    */
  random: function(lbound, ubound) {
  	return lbound + Math.floor(Math.random() * (ubound - lbound + 1));
  },

  dec2hex: function(dec) { 
    var h = Math.round(dec).toString(16);
    return (h.length == 1 ? "0" : "") + h;
  }

};