// Sets in Javascript (adapted from Laurens van den Oever)
// http://laurens.vd.oever.nl/weblog/items2005/setsinjavascript/

/*

create an empty set:
s = {};

check if an element is in the set:
if (e in s) ...

*/

var Set = {
	make: function()
	{
	  var result = {};

	  for (var i = 0; i < arguments.length; i++)
	    result[arguments[i]] = true;

	  return result;
	},

	union: function(s1, s2)
	{
		var result = {};

		for (var e in s1)
			result[e] = true;

		for (var e in s2)
			result[e] = true;

		return result;
	},

	intersection: function()
	{
		var result = {};
		
		for (var e in arguments[0])
		{
			var found = true;
			for (var i=1 ; i<arguments.length ; i++)
			{
				found = found && e in arguments[i];
				if (!found)
					break;
			}
			if (found)
				result[e] = true;
		}
		return result;
	},

	difference: function(s1, s2)
	{
		var result = {};

		for (var e in s1)
			if (!(e in s2))
				result[e] = true;

		return result;
	},
	
	add: function(s, e)
	{
		s[e] = true;
	},
	
	remove: function(s, e)
	{
		delete s[e];
	},
	
	map: function(s, f)
	{
		var temp = {};
		for (var e in s)
			temp[f(e)] = true;
		return temp;
	},
	
	// for numeric operations don't forget to convert elements from string to int/float first
	reduce: function(s, f, start)
	{
		var acc = start;
		for (var e in s)
			acc = f(acc, e)
		return acc;
	},
	
	// PRE: all elements in the set s are numeric or otherwise strange things will happen
	sum: function(s)
	{
		return Set.reduce(s, function(acc, el) { return acc+parseInt(el);}, 0 ); 
	},
	
	toArray: function(s)
	{
		var result = [];
		for (var e in s)
			result.push(e);
		return result;
	},
	
	count: function(s)
	{
		var count = 0;
		for (var e in s)
			count++
		return count;
	},
	
	toString: function(s)
	{
	  var result = "{ ";
	  for (var e in s)
	  {
	     result += e + " ";
	  }
	  return result + "}";
	}
}
