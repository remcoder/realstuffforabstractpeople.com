function $(id)
{
  var elem = document.getElementById(id);
  if (!elem)
    throw new Error("unable to find id: " + id);
  else
    return elem;
}

function addClassName(element, className)
{
  if (! hasClassName(element, className))
    element.className += " " + className;
}

function removeClassName(element, className)
{
  if( hasClassName(element, className))
    element.className = element.className.replace(className, "");
}

function replaceClassName(element, orgClassName, newClassName)
{
  element.className = element.className.replace(orgClassName, newClassName);
}

function hasClassName(element, className)
{
  var classes = element.className.split(" ");
  //console.log(classes);
  for (var i=0; i< classes.length; i++ )
  {
    //  console.log(classes[i]);
    if (classes[i].length > 0)
      if (classes[i] == className)
        return true;
  }
  return false;
}

function getClassNames(element)
{
  var classes = element.className.split(" ");
  
  // remove empty strings that result from multiple spaces between classnames
  for (var i= classes.length - 1; i >= 0; i-- )
    if (classes[i].length == 0)
      classes.splice(i, 1);
      
  return classes;
}

function setClassNames(element, classes)
{
  element.className = classes.join(" ");
}