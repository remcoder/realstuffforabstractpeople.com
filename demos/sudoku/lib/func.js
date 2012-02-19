function foreach(fun, list)
{
	for (var i=0; i < list.length; i++)
		fun.apply(this, [list[i]]);
}

function map(fun, list)
{
	var length = list.length,  newList = [];

	for (var i=0; i < length; i++)
	{
		//console.log(list[i]);
		newList.push(fun.apply(this, [list[i]]));
	}	
		
	return newList;
}

function filter(list, predicate)
{	
	var newList = [];	
	
	for (var i=0; i < list.length; i++)
		if (predicate == undefined)
		{
			if (list[i])
				newList.push(list[i]);
		}
		else
		{
			if (predicate.apply(this,[list[i]]))
				newList.push(list[i]);
		}
		
	return newList;
}

function all(list)
{
	var length = list.length;
	result = true;
	for (var i=0; i<length; i++)
	{
		result &= list[i];
		if (!result)
			return false;
	}
	return true;
}

// FIXME: deprecated! don't use! 
// use set.js instead
function set()
{
  var result = {};

  for (var i = 0; i < arguments.length; i++)
    result[arguments[i]] = true;

  return result;
}
/* 
 * example:
 *	range(10) = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 *  range(10, 20) = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
 */
function range(n, m)
{
	if (m != undefined)
	{
		start = 0;
		end = n;
	}
	else
	{
		start = n;
		end = m;
	}
	var result = [];
	for (var i=start ; i<end ; i++)
		result.push(i);
	
	return result;
}

function contains(list, soughtItem)
{
	for (var i=0 ; i<list.length ; i++)
		if ( list[i] === soughtItem )
			return true;
	
	return false;
}

// takes the cross-section of two lists
// set-theoretic conjunction
// FIXME: proper name is 'intersection' (or the verb 'intersect')
function crossSection(list1, list2)
{
	return filter(list1, function(item) { return contains(list2,item); });
}

// FIXME: if we're using nouns instead of verbs is should be 'difference'
function subtract(list1, list2)
{
	return filter(list1, function(item) { return !contains(list2, item); } );
}

// PRE: list is a properly initialized, standard array (no additions to it's prototype)
// PRE: f is function that returns a value
function fill(list, f, length, dim)
{
	if (length !== undefined)
		list.length = length;
		
	for (var i=0 ; i<list.length ; i++)
		if (dim > 1)
		{
			if (! (list[i] instanceof Array))
				list[i] = [];
			list[i] = fill( list[i], f, length, dim - 1 )
		}
		else
		{
			//console.log(list[i]);
			list[i] = f(i, list[i]); // f doesn't need to use these params
		}
		
	return list;
}

function sum(list)
{
	var total = 0;
	for (var i in list)
		total += list[i];
	return total;
}

function min(list)
{
  var min = list[0];
  for (var i in list)
  {
    if (list[i] < min)
      min = list[i];
  }
  return min;
}
