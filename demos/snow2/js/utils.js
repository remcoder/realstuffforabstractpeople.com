function rgba(r,g,b,a) { return "rgba("+ ~~r +","+ ~~g +","+ ~~b +"," + a +")"; }

function rgb(r,g,b) { return rgba(r,g,b,1); }

function tone(x,a) { 
  return a === undefined ? rgba(x,x,x,1) : rgba(x,x,x,a);
}
  
// easy normal distribution
// from: http://www.protonfish.com/random.shtml
function rnd(mean, stdev) {
  var _r = Math.random;
  return mean + stdev * (-3 + _r()*2 + _r()*2 + _r()*2);
}

// from: http://stackoverflow.com/questions/901115/get-querystring-values-with-jquery
function querystring( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getParamFromHash(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
        results = regex.exec(location.hash);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

