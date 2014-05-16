function extend(...args: {}[]){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


interface String {
    times(n:number) : string;
}

String.prototype.times = function(n) {
    return new Array(n+1).join(this);
};

interface Number {
    countBits() : number;
}

Number.prototype.countBits = function() {
    var b = this, count = 0;
    while(b) {
        count += b & 1;
        b >>=1;
    }
    return count;
}
