Fit.Array = {};

/// <function container="Fit.Array" name="ForEach" access="public" static="true">
/// 	<description>
/// 		Iterates through elements in array and passes each value to the provided callback function.
/// 	</description>
/// 	<param name="arr" type="array"> Array containing values to iterate through </param>
/// 	<param name="callback" type="function">
/// 		Callback function accepting values from the array, passed in turn.
/// 		Return False from callback to break loop.
/// 	</param>
/// </function>
/// <function container="Fit.Array" name="ForEach" access="public" static="true">
/// 	<description>
/// 		Iterates through object properties and passes each property name to the provided callback function.
/// 	</description>
/// 	<param name="obj" type="object"> Object containing properties to iterate through </param>
/// 	<param name="callback" type="function">
/// 		Callback function accepting properties from the object, passed in turn.
/// 		Return False from callback to break loop.
/// 	</param>
/// </function>
Fit.Array.ForEach = function(obj, callback)
{
	if (obj instanceof Array || typeof(obj.length) === "number") // Array or DOMNodeList
	{
		for (var i = 0 ; i < obj.length ; i++)
			if (callback(obj[i]) === false)
				break;
	}
	else // Object
	{
		for (var i in obj)
			if (callback(i) === false)
				break;
	}
}

/// <function container="Fit.Array" name="Add" access="public" static="true">
/// 	<description> Add object to array </description>
/// 	<param name="arr" type="array"> Array to which object is added </param>
/// 	<param name="obj" type="object"> Object to add to array </param>
/// </function>
Fit.Array.Add = function(arr, obj)
{
    arr.push(obj);
}

/// <function container="Fit.Array" name="Insert" access="public" static="true">
/// 	<description> Insert object into array at specified index </description>
/// 	<param name="arr" type="array"> Array into which object is inserted </param>
/// 	<param name="idx" type="integer"> Index to insert object at </param>
/// 	<param name="obj" type="object"> Object to insert into array </param>
/// </function>
Fit.Array.Insert = function(arr, idx, obj)
{
    arr.splice(idx, 0, obj);
}

/// <function container="Fit.Array" name="Remove" access="public" static="true">
/// 	<description> Remove object from array </description>
/// 	<param name="arr" type="array"> Array from which object is remove </param>
/// 	<param name="obj" type="object"> Object to remove from array </param>
/// </function>
Fit.Array.Remove = function(arr, obj)
{
    var idx = Fit.Array.GetIndex(arr, obj);

    if (idx !== -1)
        arr.splice(idx, 1);
}

/// <function container="Fit.Array" name="RemoveAt" access="public" static="true">
/// 	<description> Remove object from array at specified index </description>
/// 	<param name="arr" type="array"> Array from which object is remove </param>
/// 	<param name="idx" type="integer"> Object index in array </param>
/// </function>
Fit.Array.RemoveAt = function(arr, idx)
{
    arr.splice(idx, 1);
}

/// <function container="Fit.Array" name="Clear" access="public" static="true">
/// 	<description> Clear all items from array </description>
/// 	<param name="arr" type="array"> Array from which all objects are remove </param>
/// </function>
Fit.Array.Clear = function(arr)
{
    arr = [];
}

/// <function container="Fit.Array" name="GetIndex" access="public" static="true">
/// 	<description> Get index of object in array </description>
/// 	<param name="arr" type="array"> Array containing object </param>
/// 	<param name="obj" type="object"> Object to obtain index for </param>
/// </function>
Fit.Array.GetIndex = function(arr, obj)
{
    for (var i = 0 ; i < arr.length ; i++)
        if (arr[i] === obj)
            return i;

    return -1;
}

/*
// Difference between using ordinary for loop and Fit.Array.ForEach
// can be easily demonstrated with the code below.
// Fit.Array.ForEach creates a new execution scope (closure) which
// ensure the expected array value is used, while an ordinary loop
// results in the same index (i) variable being used, which will
// have the value 3 when all setTimeout callbacks finally fire.

// Will output 1, 3, 6, 8 as expected
Fit.Array.ForEach([1,3,6,8], function(val)
{
	setTimeout(function() { console.log(val); }, 100);
});

// Will output "8" 4 times
for (var i in vals = [1,3,6,8])
{
	setTimeout(function() { console.log(vals[i]); }, 100);
}
*/
