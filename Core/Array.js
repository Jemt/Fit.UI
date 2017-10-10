/// <container name="Fit.Array">
/// 	Functionality extending the capabilities of native JS arrays
/// </container>
Fit.Array = {};

/// <function container="Fit.Array" name="ForEach" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Iterates through elements in array and passes each value to the provided callback function.
/// 		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
/// 	</description>
/// 	<param name="arr" type="array"> Array containing values to iterate through </param>
/// 	<param name="callback" type="function">
/// 		Callback function accepting values from the array, passed in turn.
/// 		Return False from callback to break loop.
/// 	</param>
/// </function>
/// <function container="Fit.Array" name="ForEach" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Iterates through object properties and passes each property name to the provided callback function.
/// 		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
/// 	</description>
/// 	<param name="obj" type="object"> Object containing properties to iterate through </param>
/// 	<param name="callback" type="function">
/// 		Callback function accepting properties from the object, passed in turn.
/// 		Return False from callback to break loop.
/// 	</param>
/// </function>
Fit.Array.ForEach = function(obj, callback) // obj not validated - passing null/undefined is allowed - no iteration is performed in this case
{
	Fit.Validation.ExpectFunction(callback);

	if (Fit._internal.Validation.IsCollectionType(obj) === true)
	{
		var count = obj.length;
		var res = false;

		for (var i = 0 ; i < obj.length ; i++)
		{
			res = callback(obj[i]);

			if (obj.length !== count)
				Fit.Validation.ThrowError("Collection was modified while iterating objects");

			if (res === false)
				return false;
		}
	}
	else if (typeof(obj) === "object")
	{
		for (var i in obj) // Object array is not vulnerable to changes in callback - properties removed or added are not iterated
			if (callback(i) === false)
				return false;
	}

	return true;
}

/// <function container="Fit.Array" name="Count" access="public" static="true" returns="integer">
/// 	<description> Returns number of elements in collection </description>
/// 	<param name="arr" type="array"> Collection to count elements within </param>
/// </function>
/// <function container="Fit.Array" name="Count" access="public" static="true" returns="integer">
/// 	<description> Returns number of elements in object array </description>
/// 	<param name="obj" type="object"> Object array to count elements within </param>
/// </function>
Fit.Array.Count = function(obj)
{
	if (Fit._internal.Validation.IsCollectionType(obj) === true)
	{
		return obj.length;
	}
	else if (typeof(obj) === "object")
	{
		var count = 0;

		for (var i in obj)
			count++;

		return count;
	}

	Fit.Validation.ThrowError("Unsupported collection type passed - unable to determine number of contained elements");
}

/// <function container="Fit.Array" name="Recurse" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Recursively iterates through objects in array and passes each object to the provided callback function.
/// 		Returns boolean indicating whether recursion was carried through (True) or interrupted (False).
/// 	</description>
/// 	<param name="arr" type="array"> Array containing objects to iterate through </param>
/// 	<param name="childrenProperty" type="string">
/// 		Name of property or argumentless getter function returning children (e.g. "Children" or "GetChildren")
/// 	</param>
/// 	<param name="callback" type="function">
/// 		Callback function accepting objects from the array, passed in turn.
/// 		Return False from callback to break loop.
/// 	</param>
/// </function>
Fit.Array.Recurse = function(arr, childrenProperty, callback)
{
	Fit.Validation.ExpectCollection(arr, true);
	Fit.Validation.ExpectStringValue(childrenProperty);
	Fit.Validation.ExpectFunction(callback);

	if (Fit.Validation.IsSet(arr) === false)
		return true;

	var count = arr.length;

	for (var i = 0 ; i < arr.length ; i++)
	{
		if (arr.length !== count)
			Fit.Validation.ThrowError("Collection was modified while iterating objects");

		if (callback(arr[i]) === false)
			return false;

		if (Fit.Validation.IsSet(arr[i][childrenProperty]) === false)
			continue;

		if (arr[i][childrenProperty] instanceof Function)
		{
			if (Fit.Array.Recurse(arr[i][childrenProperty](), childrenProperty, callback) === false)
				return false;
		}
		else
		{
			if (Fit.Array.Recurse(arr[i][childrenProperty], childrenProperty, callback) === false)
				return false;
		}
	}

	return true;
}

/// <function container="Fit.Array" name="CustomRecurse" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Iterate objects in collection and pass each object to provided callback.
/// 		Callback is expected to return any children supposed to be iterated too, or Null
/// 		if further/deeper iteration is not necessary.
/// 	</description>
/// 	<param name="arr" type="array"> Array containing objects to iterate through </param>
/// 	<param name="callback" type="function">
/// 		Callback function accepting objects from the array, passed in turn.
/// 		Function must return children collection to continue recursive operation,
/// 		or Null to prevent further processing.
/// 	</param>
/// </function>
Fit.Array.CustomRecurse = function(arr, callback) // arr not validated - passing null/undefined is allowed - no iteration is performed in this case
{
	Fit.Validation.ExpectFunction(callback);

	if (arr !== undefined && arr !== null && Fit._internal.Validation.IsCollectionType(arr) === false)
		Fit.Validation.ThrowError("Unexpected collection type passed"); // CustomRecurse does not support iterating object arrays like ForEach does

	Fit.Array.ForEach(arr, function(o)
	{
		Fit.Array.CustomRecurse(callback(o), callback);
	});
}

/// <function container="Fit.Array" name="Add" access="public" static="true">
/// 	<description> Add object to array </description>
/// 	<param name="arr" type="array"> Array to which object is added </param>
/// 	<param name="obj" type="object"> Object to add to array </param>
/// </function>
Fit.Array.Add = function(arr, obj) // obj not validated - passing any object or undefined/null is allowed
{
	Fit.Validation.ExpectArray(arr);
    arr.push(obj);
}

/// <function container="Fit.Array" name="Insert" access="public" static="true">
/// 	<description> Insert object into array at specified index </description>
/// 	<param name="arr" type="array"> Array into which object is inserted </param>
/// 	<param name="idx" type="integer"> Index to insert object at </param>
/// 	<param name="obj" type="object"> Object to insert into array </param>
/// </function>
Fit.Array.Insert = function(arr, idx, obj) // obj not validated - passing any object or undefined/null is allowed
{
	Fit.Validation.ExpectArray(arr);
	Fit.Validation.ExpectInteger(idx);
    arr.splice(idx, 0, obj);
}

/// <function container="Fit.Array" name="Merge" access="public" static="true">
/// 	<description> Merge/join two arrays </description>
/// 	<param name="arr1" type="array"> Array 1 to merge with array 2 </param>
/// 	<param name="arr2" type="array"> Array 2 to merge with array 1 </param>
/// </function>
Fit.Array.Merge = function(arr1, arr2)
{
	Fit.Validation.ExpectArray(arr1);
	Fit.Validation.ExpectArray(arr2);
    return arr1.concat(arr2);
}

/// <function container="Fit.Array" name="Remove" access="public" static="true">
/// 	<description> Remove object from array </description>
/// 	<param name="arr" type="array"> Array from which object is remove </param>
/// 	<param name="obj" type="object"> Object to remove from array </param>
/// </function>
Fit.Array.Remove = function(arr, obj) // obj not validated - passing any object or undefined/null is allowed
{
	Fit.Validation.ExpectArray(arr);

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
	Fit.Validation.ExpectArray(arr);
	Fit.Validation.ExpectInteger(idx);
    arr.splice(idx, 1);
}

/// <function container="Fit.Array" name="Clear" access="public" static="true">
/// 	<description> Clear all items from array </description>
/// 	<param name="arr" type="array"> Array from which all objects are remove </param>
/// </function>
Fit.Array.Clear = function(arr)
{
	Fit.Validation.ExpectArray(arr);
    arr.length = 0; // http://jsperf.com/array-destroy/151
}

/// <function container="Fit.Array" name="GetIndex" access="public" static="true" returns="integer">
/// 	<description> Returns index of object in array if found, otherwise a value of -1 is returned </description>
/// 	<param name="arr" type="array"> Array to search through </param>
/// 	<param name="obj" type="object"> Object to obtain index for </param>
/// </function>
Fit.Array.GetIndex = function(arr, obj) // obj not validated - passing any object or undefined/null is allowed
{
	Fit.Validation.ExpectArray(arr);

    for (var i = 0 ; i < arr.length ; i++)
        if (arr[i] === obj)
            return i;

    return -1;
}

/// <function container="Fit.Array" name="GetKeys" access="public" static="true" returns="array">
/// 	<description> Returns all keys in array (indices) - 0, 1, 2, 3, ... </description>
/// 	<param name="arr" type="array"> Array to get keys from </param>
/// </function>
/// <function container="Fit.Array" name="GetKeys" access="public" static="true" returns="array">
/// 	<description> Returns all keys (property names) in object </description>
/// 	<param name="obj" type="object"> Object to get keys from </param>
/// </function>
Fit.Array.GetKeys = function(obj)
{
	var keys = [];

	if (Fit._internal.Validation.IsCollectionType(obj) === true)
	{
		for (var i = 0 ; i < obj.length ; i++)
		{
			keys.push(i);
		}
	}
	else if (typeof(obj) === "object")
	{
		for (var i in obj)
		{
			keys.push(i);
		}
	}

	return keys;
}

/// <function container="Fit.Array" name="Contains" access="public" static="true" returns="boolean">
/// 	<description> Returns True if given object is contained in array, otherwise False </description>
/// 	<param name="arr" type="array"> Array to search through </param>
/// 	<param name="obj" type="object"> Object to look for </param>
/// </function>
Fit.Array.Contains = function(arr, obj) // obj not validated - passing any object or undefined/null is allowed
{
	Fit.Validation.ExpectArray(arr);
    return (Fit.Array.GetIndex(arr, obj) > -1);
}

/// <function container="Fit.Array" name="Copy" access="public" static="true" returns="array">
/// 	<description>
/// 		Returns a shallow copy of the array - for a deep copy see Fit.Core.Clone(..)
/// 	</description>
/// 	<param name="arr" type="array"> Array to copy </param>
/// </function>
Fit.Array.Copy = function(arr)
{
	Fit.Validation.ExpectCollection(arr);

	var newArr = [];
	Fit.Array.ForEach(arr, function(item)
	{
		newArr.push(item);
	});
	return newArr;
}

/// <function container="Fit.Array" name="ToArray" access="public" static="true" returns="array">
/// 	<description> Convert collection (NodeList, StaticNodeList, or HTMLCollection) to JS array </description>
/// 	<param name="coll" type="object"> Collection to convert to array </param>
/// </function>
Fit.Array.ToArray = function(coll)
{
	Fit.Validation.ExpectCollection(coll);

	var arr = [];

	for (var i = 0 ; i < coll.length ; i++)
		arr.push(coll[i]);

	return arr;
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
