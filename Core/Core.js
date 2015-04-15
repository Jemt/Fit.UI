
// TODO (entire framework):
//  - Ensure consistency
//     - SetX/GetX, or simply X(set) ?
//     - parentNode vs parentElement
//     - firstChild vs firstElementChild
//     - previousSibling vs previousElementSibling
//     - elm.insertBefore vs Fit.Dom.InsertBefore(..)
//  - Type check arguments in all public functions
//  - Add XML docs to all public functions
//  - Clean up code/CSS
//  - Review all changes


Fit = {};
Fit.Core = {};

/// <function container="Fit.Core" name="Extend" access="public" static="true">
/// 	<description>
/// 		Extend any object with the public members of a super class.
///
/// 		MyClass = function(controlId)
/// 		{
/// 			&#160;&#160;&#160;&#160; Fit.Core.Extend(this, MySuperClass).Apply();
/// 		}
///
/// 		The code above defines a class called MyClass which inherits from MySuperClass.
/// 		Use Apply() to pass variables to the super class constructor as shown below:
///
/// 		Male = function(name, age)
/// 		{
/// 			&#160;&#160;&#160;&#160; Fit.Core.Extend(this, Person).Apply("Male", name, age);
/// 		}
///
/// 		Notice that calling just Extend(..) without calling Apply() on the object returned,
/// 		will not cause inheritance. Apply() must be called, with or without parameters.
/// 	</description>
/// 	<param name="subInstance" type="object"> Instance of sub class </param>
/// 	<param name="superType" type="function"> Class (function) to inherit from </param>
/// </function>
Fit.Core.Extend = function(subInstance, superType)
{
	var binder =
	{
		Apply: function()
		{
			superType.apply(subInstance, arguments);
		}
	}
	return binder;
}

/// <function container="Fit.Core" name="IsEqual" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Compare two JavaScript objects to determine whether they are identical.
/// 		Returns True if objects are identical (equal), otherwise False.
/// 		Functions are compared by reference, not by value.
/// 		Custom properties set on native JS objects (e.g. Array.XYZ) are not compared, only
/// 		values are. Naturally JSON objects will be fully compared, including all properties.
/// 		Be aware of self referencing variables and circular structures, which
/// 		will cause an infinite loop, and eventually a stack overflow exception.
/// 		DOM objects and window/frame instances are not supported.
/// 	</description>
/// 	<param name="jsObj1" type="object"> JS object to compare agains second JS object </param>
/// 	<param name="jsObj2" type="object"> JS object to compare agains first JS object </param>
/// </function>
Fit.Core.IsEqual = function(jsObj1, jsObj2)
{

	// TEST CASE: Example below is supposed to return: TRUE!
	/*var f1 = function() { alert("Hello"); }
	var f2 = f1;
	Fit.Core.IsEqual(
	{
		str: "Hello world",
		num: 123,
		dec: 123.321,
		date: new Date("2014-12-01 13:02:23"),
		bool: true,
		bool2: false,
		arr: [100, 200, 250, 400],
		arr2: ["Hello", "world"],
		arr3: [123, "hello", true, false, new Date("1990-01-20"), [1,2,3], { x: { "hapsen": f1, "hello": new Array(1,2,3) } }],
		obj: { a: 123, b: 123.321, c: true, d: false, e: new Date("1993-06-25"), f: "hello", g: null, h: undefined }
	},
	{
		str: "Hello world",
		num: 123,
		dec: 123.321,
		date: new Date("2014-12-01 13:02:23"),
		bool: true,
		bool2: false,
		arr: [100, 200, 250, 400],
		arr2: ["Hello", "world"],
		arr3: [123, "hello", true, false, new Date("1990-01-20"), [1,2,3], { x: { "hapsen": f2, "hello": new Array(1,2,3) } }],
		obj: { a: 123, b: 123.321, c: true, d: false, e: new Date("1993-06-25"), f: "hello", g: null, h: undefined }
	});*/

	if (typeof(jsObj1) !== typeof(jsObj2))
		return false;

	if ((jsObj1 === undefined && jsObj2 === undefined) || (jsObj1 === null && jsObj2 === null))
	{
		return true;
	}
	else if (typeof(jsObj1) === "string" || typeof(jsObj1) === "boolean")
	{
		return (jsObj1 === jsObj2);
	}
	else if (typeof(jsObj1) === "number")
	{
		if (isNaN(jsObj1) === true && isNaN(jsObj2) === true) // NaN variables are not comparable!
			return true;
		else
			return (jsObj1 === jsObj2);
	}
	else if (jsObj1 instanceof Date && jsObj2 instanceof Date)
	{
		return (jsObj1.getTime() === jsObj2.getTime());
	}
	else if (jsObj1 instanceof Array && jsObj2 instanceof Array)
	{
		if (jsObj1.length !== jsObj2.length)
			return false;

		for (var i = 0 ; i < jsObj1.length ; i++)
		{
			if (Fit.Core.IsEqual(jsObj1[i], jsObj2[i]) === false)
				return false;
		}

		return true;
	}
	else if (typeof(jsObj1) === "object" && typeof(jsObj2) === "object" && jsObj1 !== null && jsObj2 !== null) // typeof(null) returns "object"
	{
		for (var k in jsObj1)
			if (Fit.Core.IsEqual(jsObj1[k], jsObj2[k]) === false)
				return false;

		return true;
	}
	else if (typeof(jsObj1) === "function" && typeof(jsObj2) === "function")
	{
		// Returns True in the following situation:
		// var f1 = function() { alert("Hello"); }
		// var f2 = f1;
		// Fit.Core.IsEqual(f1, f2);

		// Returns False in the following situation:
		// var f1 = function() { alert("Hello"); }
		// var f2 = function() { alert("Hello"); }
		// Fit.Core.IsEqual(f1, f2);

		return (jsObj1 === jsObj2);
	}

	return false;
}

/// <function container="Fit.Core" name="Clone" access="public" static="true" returns="object">
/// 	<description>
/// 		Clone JavaScript object. Supported object types and values:
/// 		String, Number, Boolean, Date, Array, (JSON) Object, Function, Undefined, Null, NaN.
/// 		Variables defined as undefined are left out of clone,
/// 		since an undefined variable is equal to a variable defined as undefined.
/// 		Notice that Arrays and Objects can contain supported object types and values only.
/// 		Functions are considered references, and as such the cloned object will reference
/// 		the same functions.
/// 		Custom properties set on native JS objects (e.g. Array.XYZ) are not cloned, only
/// 		values are. Naturally custom (JSON) objects will be fully cloned, including all
/// 		properties. Both arrays and custom (JSON) objects are cloned recursively.
/// 		Be aware of self referencing variables and circular structures, which
/// 		will cause an infinite loop, and eventually a stack overflow exception.
/// 		DOM objects and window/frame instances are not supported.
/// 	</description>
/// 	<param name="obj" type="object"> JS object to clone </param>
/// </function>
Fit.Core.Clone = function(obj)
{
	// TODO - Known problem:
	// var a = new SomeClass();
	// var b = (a instanceOf SomeClass);
	// var c = (SMCore.Clone(a) instanceOf SomeClass);
	// Variable b is True as expected, while variable c is False!
	// TODO: Restore/preserve support for instanceof!

	// TEST CASE: Example below is supposed to return: TRUE!
	/*var f1 = function() { alert("Hello"); }
	var x =
	{
		str: "Hello world",
		num: 123,
		dec: 123.321,
		date: new Date("2014-12-01 13:02:23"),
		bool: true,
		bool2: false,
		arr: [100, 200, 250, 400],
		arr2: ["Hello", "world"],
		arr3: [123, "hello", true, false, new Date("1990-01-20"), [1,2,3], { x: { "hapsen": f1, "hello": new Array(1,2,3) } }],
		obj: { a: 123, b: 123.321, c: true, d: false, e: new Date("1993-06-25"), f: "hello", g: null, h: undefined }
	};
	var y = SMCore.Clone(x);
	console.log("Is equal: " + SMCore.IsEqual(x, y));*/

	// Clone object by serializing it into a JSON string, and parse it back into a JS object

	var serialized = JSON.stringify(obj); // Returns undefined if obj is either undefined or a function (these are not serialized)
	var clone = ((serialized !== undefined) ? JSON.parse(serialized) : serialized); // parse(..) throws error if argument is undefined

	// Fixes
	//  - Dates are serialized into strings - turn back into Date instances.
	//  - Functions are not serialized (discarded) - add function reference to clone
	//  - Number variables with a value of NaN is serialized into Null - convert to NaN

	var fixClone = null;
	fixClone = function(org, clo)
	{
		if (org instanceof Date) // Dates are turned into string representations - turn back into Date instances
		{
			return new Date(org.getTime());
		}
		else if (typeof(org) === "function") // Functions are not serialized - use same reference as original object
		{
			return org;
		}
		else if (typeof(org) === "number" && isNaN(org) === true) // NaN is turned into Null - turn back into NaN
		{
			return parseInt("");
		}
		else if (org && typeof(org) === "object") // Recursively fix children (object/array)
		{
			for (var p in org)
				clo[p] = fixClone(org[p], clo[p]);
		}

		return clo;
	};

	clone = fixClone(obj, clone);

	// Done, clone is now identical to original object - SMCore.IsEqual(obj, clone) should return True

	return clone;
}


// INTERNAL

Fit._internal = {};

(function()
{
	var src = document.scripts[document.scripts.length - 1].src;
	Fit._internal.BasePath = src.substring(0, src.lastIndexOf("/"));
})();
