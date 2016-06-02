/// <container name="Fit.Core">
/// 	Core features extending the capabilities of native JS
/// </container>
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
/// 		The code above defines a class called MyClass which extends from MySuperClass.
/// 		Use Apply() to pass variables to the super class constructor as shown below:
///
/// 		Male = function(name, age)
/// 		{
/// 			&#160;&#160;&#160;&#160; Fit.Core.Extend(this, Person).Apply("Male", name, age);
/// 		}
///
/// 		Notice that calling just Extend(..) without calling Apply() on the object returned,
/// 		will not cause extension to occure. Apply() must be called, with or without parameters.
/// 	</description>
/// 	<param name="subInstance" type="object"> Instance of sub class to extend </param>
/// 	<param name="superType" type="function"> Class (function) to extend from </param>
/// </function>
Fit.Core.Extend = function(subInstance, superType)
{
	Fit.Validation.ExpectIsSet(subInstance);
	Fit.Validation.ExpectFunction(superType);

	var binder =
	{
		Apply: function()
		{
			superType.apply(subInstance, arguments);

			// Support for Fit.Core.Extends(..)

			if (!subInstance._internal)
				subInstance._internal = {};

			if (!subInstance._internal.Extends)
				subInstance._internal.Extends = [];

			Fit.Array.Add(subInstance._internal.Extends, superType);
		}
	}
	return binder;
}

/// <function container="Fit.Core" name="Extends" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Returns boolean indicating whether given object is an extension of a given super type - see Fit.Core.Extend(..).
/// 		Also look into Fit.Core.InstanceOf(..) which may provide the desired behaviour.
/// 	</description>
/// 	<param name="instance" type="object"> Object instance </param>
/// 	<param name="superType" type="function"> Reference to super class (function) </param>
/// </function>
Fit.Core.Extends = function(instance, superType)
{
	Fit.Validation.ExpectIsSet(instance);
	Fit.Validation.ExpectFunction(superType);

	return (instance._internal && instance._internal.Extends && Fit.Array.Contains(instance._internal.Extends, superType) === true);
}

/// <function container="Fit.Core" name="InstanceOf" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Returns boolean indicating whether given object is an instance or extension of a given class type - see Fit.Core.Extend(..).
/// 		This is equivalent of: var result = (obj instanceof MyType || Fit.Core.Extends(obj, MyType));
/// 	</description>
/// 	<param name="instance" type="object"> Object instance </param>
/// 	<param name="type" type="function"> Reference to class (function) </param>
/// </function>
Fit.Core.InstanceOf = function(instance, type)
{
	return (instance instanceof type || Fit.Core.Extends(instance, type) === true);
}

/// <function container="Fit.Core" name="CreateOverride" access="public" static="true" returns="function">
/// 	<description>
/// 		Create a function override for any given function using the approach below.
///
/// 		this.SayHello = function(name) { alert("Hello " + name); }
/// 		this.SayHello = Fit.Core.CreateOverride(this.SayHello, function(name)
/// 		{
/// 			console.log(name + " logged in");
/// 			console.log(name + " is using the following browser: " + navigator.userAgent);
///
/// 			base(name); // Call original SayHello function
/// 		});
///
/// 		Notice how base(..) allows us to call the original function.
/// 	</description>
/// 	<param name="originalFunction" type="function"> Reference to function to override </param>
/// 	<param name="newFunction" type="function"> Reference to replacement function </param>
/// </function>
Fit.Core.CreateOverride = function(originalFunction, newFunction)
{
	Fit.Validation.ExpectFunction(originalFunction);
	Fit.Validation.ExpectFunction(newFunction);

	return function()
	{
		var orgBase = window.base; // May already exist
		window.base = originalFunction; // Globally accessible base function

		var error = null;
		var result = undefined;

		try // Make sure we can clean up globally accessible base function in case of errors
		{
			result = newFunction.apply(this, arguments);
		}
		catch (err)
		{
			error = err;
		}

		if (orgBase)
		{
			window.base = orgBase;
		}
		else
		{
			try
			{
				delete window.base; // Fails in IE8 with "Object doesn't support this action"
			}
			catch (err)
			{
				window.base = undefined;
			}
		}

		if (error !== null)
			Fit.Validation.ThrowError(error);

		if (result !== undefined)
			return result;
	}
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
	// Find Base URL - e.g. http://server.com/libs/fitui
	var src = document.scripts[document.scripts.length - 1].src;
	Fit._internal.BaseUrl = src.substring(0, src.lastIndexOf("/"));

	// Calculate Base Path - e.g. /libs/fitui
	var path = Fit._internal.BaseUrl.replace("http://", "").replace("https://", "");
	Fit._internal.BasePath = path.substring(path.indexOf("/"));
})();

/// <function container="Fit" name="GetUrl" access="public" static="true" returns="string">
/// 	<description> Get fully qualified URL to Fit.UI on server - e.g. http://server.com/libs/fitui </description>
/// </function>
Fit.GetUrl = function()
{
	return Fit._internal.BaseUrl;
}

/// <function container="Fit" name="GetPath" access="public" static="true" returns="string">
/// 	<description> Get absolute path to Fit.UI on server - e.g. /libs/fitui </description>
/// </function>
Fit.GetPath = function()
{
	return Fit._internal.BasePath;
}
/// <container name="Fit.Validation">
/// 	Validation logic
/// </container>
Fit.Validation = {};

Fit._internal.Validation = {};
Fit._internal.Validation.DebugMode = true;
Fit._internal.Validation.Clone = null;

// ==========================================================
// Type checking
// ==========================================================

/// <function container="Fit.Validation" name="ExpectNumber" access="public" static="true">
/// 	<description> Throws error if passed object is not a number </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectNumber = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (typeof(val) !== "number" || isNaN(val) === true)
		Fit.Validation.ThrowError("Value '" + val + "' is not a valid number");
}

/// <function container="Fit.Validation" name="ExpectInteger" access="public" static="true">
/// 	<description> Throws error if passed object is not an integer </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectInteger = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (typeof(val) !== "number" || val % 1 !== 0)
		Fit.Validation.ThrowError("Value '" + val + "' is not a valid integer");
}

/// <function container="Fit.Validation" name="ExpectString" access="public" static="true">
/// 	<description> Throws error if passed object is not a string </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectString = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (typeof(val) !== "string")
		Fit.Validation.ThrowError("Value '" + val + "' is not a valid string");
}

/// <function container="Fit.Validation" name="ExpectStringValue" access="public" static="true">
/// 	<description> Same as Fit.Validation.ExpectString(..), but string must contain an actual value if set (not be empty) </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectStringValue = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	Fit.Validation.ExpectString(val);

	if (val === "")
		Fit.Validation.ThrowError("String cannot be empty");
}

/// <function container="Fit.Validation" name="ExpectBoolean" access="public" static="true">
/// 	<description> Throws error if passed object is not a boolean </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectBoolean = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (typeof(val) !== "boolean")
		Fit.Validation.ThrowError("Value '" + val + "' is not a valid boolean");
}

/// <function container="Fit.Validation" name="ExpectDate" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of Date </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectDate = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof Date) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of Date");
}

/// <function container="Fit.Validation" name="ExpectArray" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of Array </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectArray = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof Array) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of Array");
}

/// <function container="Fit.Validation" name="ExpectTypeArray" access="public" static="true">
/// 	<description>
/// 		Throws error if passed object is not an instance of Array
/// 		contaning only objects/values of type given by validation callback.
/// 		Example: Fit.Validation.ExpectTypeArray(arr, Fit.Validation.ExpectString)
/// 	</description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="typeValCallback" type="function"> Value validation callback </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectTypeArray = function(val, typeValCallback, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof Array) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of Array");

	// Validate types within array

	Fit.Validation.ExpectFunction(typeValCallback); // Make sure callback is valid

	Fit.Array.ForEach(val, function(v)
	{
		typeValCallback(v);
	});
}

/// <function container="Fit.Validation" name="ExpectInstanceArray" access="public" static="true">
/// 	<description>
/// 		Throws error if passed object is not an instance of Array
/// 		contaning only instances of specified type. Example:
/// 		Fit.Validation.ExpectInstanceArray(arr, Fit.Controls.TreeView.Node)
/// 	</description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="instanceType" type="object"> Instance type (constructor, e.g. Fit.Http.Request) </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectInstanceArray = function(val, instanceType, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof Array) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of Array");

	// Validate types within array

	Fit.Array.ForEach(val, function(v)
	{
		Fit.Validation.ExpectInstance(v, instanceType);
	});
}

/// <function container="Fit.Validation" name="ExpectCollection" access="public" static="true">
/// 	<description> Throws error if passed object is not a collection that can be iterated </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectCollection = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (!window.StaticNodeList)
		window.StaticNodeList = function() {};
	if (!window.FileList)
		window.FileList = function() {};

	if ((val instanceof NodeList) === false && (val instanceof StaticNodeList) === false && (val instanceof FileList) === false && (val instanceof HTMLCollection) === false && (val instanceof Array) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not a valid collection");
}

/// <function container="Fit.Validation" name="ExpectRegExp" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of RegExp </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectRegExp = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (val instanceof RegExp === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of RegExp");
}

/// <function container="Fit.Validation" name="ExpectDomElement" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of Element </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectDomElement = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof Element) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not a DOMElement");
}

/// <function container="Fit.Validation" name="ExpectContentNode" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of Element or Text </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectContentNode = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof Element) === false && (val instanceof Text) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not a Content Node (Element or Text)");
}

/// <function container="Fit.Validation" name="ExpectWindow" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of Window </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectWindow = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof Window) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of Window");
}

/// <function container="Fit.Validation" name="ExpectFunction" access="public" static="true">
/// 	<description> Throws error if passed object is not a valid function </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectFunction = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (typeof(val) !== "function")
		Fit.Validation.ThrowError("Value '" + val + "' is not a valid function");
}

/// <function container="Fit.Validation" name="ExpectEventTarget" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of EventTarget </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectEventTarget = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (typeof(EventTarget) !== "undefined" && (val instanceof EventTarget) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of EventTarget");
	else if (!val.removeEventListener && !val.attachEvent) // IE8
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of EventTarget");
}

/// <function container="Fit.Validation" name="ExpectEvent" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of Event </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectEvent = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	// IE9 and above: window.event is now of type MSEventObj (legacy),
	// while an actual Event instance is passed to handlers as specified by W3C.
	if ((val instanceof Event) === false && (val instanceof MSEventObj) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of Event");
}

/// <function container="Fit.Validation" name="ExpectInstance" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of specified type </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="instanceType" type="object"> Instance type (constructor, e.g. Fit.Http.Request) </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectInstance = function(val, instanceType, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof instanceType) === true || Fit.Core.Extends(val, instanceType) === true)
		return;

	Fit.Validation.ThrowError("Unsupported object type passed");
}

/// <function container="Fit.Validation" name="ExpectIsSet" access="public" static="true">
/// 	<description> Throws error if passed object is either Null or Undefined </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// </function>
Fit.Validation.ExpectIsSet = function(val)
{
	if (Fit.Validation.IsSet(val) === false)
		Fit.Validation.ThrowError("Value not set");
}

// ==========================================================
// Misc.
// ==========================================================

/// <function container="Fit.Validation" name="IsSet" access="public" static="true">
/// 	<description> Returns True if specified object is set (not Null or Undefined), otherwise False </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// </function>
Fit.Validation.IsSet = function(obj)
{
	return (obj !== null && obj !== undefined);
}

/// <function container="Fit.Validation" name="ThrowError" access="public" static="true">
/// 	<description> Throw error and provide stack trace to browser console </description>
/// 	<param name="msg" type="object"> Object to validate </param>
/// </function>
Fit.Validation.ThrowError = function(msg)
{
	if (Fit._internal.Validation.DebugMode === true)
	{
		var stackTrace = Fit.Validation.GetStackTrace();
		alert("ThrowError: " + msg + ((stackTrace !== "") ? "\n\n" : "") + stackTrace);

		if (window.console && console.trace)
		{
			console.log(msg);
			console.trace();
		}
	}

	throw new Error(msg); // Never change this behaviour - we should always re-throw the error to terminate execution
}

Fit.Validation.GetStackTrace = function()
{
	if (window.Error === undefined || Error.captureStackTrace === undefined)
		return "";

	var obj = {};
	Error.captureStackTrace(obj, Fit.Validation.GetStackTrace);
	return obj.stack;
}

// ==========================================================
// DebugMode (enable/disable type checking)
// ==========================================================

/// <function container="Fit.Validation" name="Enabled" access="public" static="true">
/// 	<description> Set or get flag indicating whether type checking should take place (DebugMode) </description>
/// 	<param name="val" type="boolean"> True enables DebugMode, False disables DebugMode </param>
/// </function>
Fit.Validation.Enabled = function(val)
{
	if (Fit.Validation.IsSet(val) === true)
	{
		if (val === true)
		{
			Fit._internal.Validation.DebugMode = true;

			if (Fit._internal.Validation.Clone !== null) // Null if Debug Mode is already enabled
				Fit.Validation = Fit.Core.Clone(Fit._internal.Validation.Clone);
		}
		else
		{
			Fit._internal.Validation.DebugMode = false;

			if (Fit._internal.Validation.Clone === null)
				Fit._internal.Validation.Clone = Fit.Core.Clone(Fit.Validation);

			// Replace all type checking functions when Debug Mode is disabled
			for (var f in Fit.Validation)
				if (f.indexOf("Expect") === 0)
					Fit.Validation[f] = function() {}
		}
	}

	return (Fit._internal.Validation.DebugMode === true);
}
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

	if (Fit._internal.Array.isCollectionType(obj) === true)
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
		for (var i in obj)
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
	if (Fit._internal.Array.isCollectionType(obj) === true)
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

	if (arr !== undefined && arr !== null && Fit._internal.Array.isCollectionType(arr) === false)
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
/// 	<param name="arr1" type="array"> Array 2 to merge with array 1 </param>
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

	/*if (Fit._internal.Array.isCollectionType(coll) === true)
	{
		var newArr = [];
		Fit.Array.ForEach(coll, function(item)
		{
			newArr.push(item);
		});
		return newArr;
	}
	else
	{
		var newObjArr = {};
		Fit.Array.ForEach(coll, function(key)
		{
			newObjArr[key] = coll[key];
		});
		return newObjArr;
	}*/
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

// Internal members

Fit._internal.Array = {};

Fit._internal.Array.isCollectionType = function(obj) // Returns True if obj is a collection that can be iterated using a .length property
{
	var debug = Fit._internal.Validation.DebugMode;
	Fit._internal.Validation.DebugMode = false; // Prevent alerts in debug mode

	var result = false;

	try
	{
		Fit.Validation.ExpectCollection(obj);
		result = true;
	}
	catch (err) { }

	Fit._internal.Validation.DebugMode = debug;
	return result;

	/*if (!window.FileList)
		window.FileList = function() {};
	if (!window.StaticNodeList)
		window.StaticNodeList = function() {};

	return (obj instanceof Array || obj instanceof NodeList || obj instanceof FileList || obj instanceof StaticNodeList || obj instanceof HTMLCollection);*/
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
/// <container name="Fit.Browser">
/// 	Provides access to various browser information.
///
/// 	// Example code
///
/// 	var browserName = Fit.Browser.GetBrowser();
/// 	var browserVersion = Fit.Browser.GetVersion();
/// 	var browserLanguage = Fit.Browser.GetLanguage();
///
/// 	if (browserName === &quot;MSIE&quot; &amp;&amp; browserVersion &lt; 7)
/// 	{
/// 		&#160;&#160;&#160;&#160; if (browserLanguage === &quot;da&quot;)
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; alert(&quot;Opgrader venligst til IE7 eller nyere&quot;);
/// 		&#160;&#160;&#160;&#160; else
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; alert(&quot;Please upgrade to IE7 or newer&quot;);
/// 	}
/// </container>
Fit.Browser = {};
Fit._internal.Browser = {};

/// <function container="Fit.Browser" name="GetBrowser" access="public" static="true" returns="string">
/// 	<description> Returns browser name. Possible values are: Chrome, Safari, Edge, MSIE, Firefox, Opera, Unknown </description>
/// </function>
Fit.Browser.GetBrowser = function()
{
	var agent = navigator.userAgent;

	if (agent.indexOf("Edge/") > -1) // Check Edge first, it contain portions from Chrome's and Safari's user agent strings
		return "Edge";
	if (agent.indexOf("Chrome") > -1)
		return "Chrome";
	if (agent.indexOf("Safari") > -1)
		return "Safari";
	if (agent.indexOf("MSIE") > -1 || agent.indexOf("Trident") > -1)
		return "MSIE";
	if (agent.indexOf("Firefox") > -1)
		return "Firefox";
	if (agent.indexOf("Opera") > -1)
		return "Opera";

	return "Unknown";
}

/// <function container="Fit.Browser" name="GetVersion" access="public" static="true" returns="integer">
/// 	<description> Returns major version number for known browsers, -1 for unknown browsers </description>
/// </function>
Fit.Browser.GetVersion = function()
{
	var start = 0;
	var end = 0;
	var agent = navigator.userAgent;

	if (Fit.Browser.GetBrowser() === "Edge")
	{
		start = agent.indexOf("Edge/");
		start = (start !== -1 ? start + 5 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "Chrome")
	{
		start = agent.indexOf("Chrome/");
		start = (start !== -1 ? start + 7 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "Safari")
	{
		start = agent.indexOf("Version/");
		start = (start !== -1 ? start + 8 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "MSIE")
	{
		if (agent.indexOf("MSIE") > -1)
		{
			start = agent.indexOf("MSIE ");
			start = (start !== -1 ? start + 5 : 0);
			end = agent.indexOf(".", start);
			end = (end !== -1 ? end : 0);
		}
		else if (agent.indexOf("Trident") > -1) // IE11+
		{
			start = agent.indexOf("rv:");
			start = (start !== -1 ? start + 3 : 0);
			end = agent.indexOf(".", start);
			end = (end !== -1 ? end : 0);
		}
	}
	if (Fit.Browser.GetBrowser() === "Firefox")
	{
		start = agent.indexOf("Firefox/");
		start = (start !== -1 ? start + 8 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "Opera")
	{
		start = agent.indexOf("Version/");
		start = (start !== -1 ? start + 8 : -1);

		if (start === -1)
		{
			start = agent.indexOf("Opera/");
			start = (start !== -1 ? start + 6 : -1);
		}

		if (start === -1)
		{
			start = agent.indexOf("Opera ");
			start = (start !== -1 ? start + 6 : -1);
		}

		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}

	if (start !== 0 && start !== 0)
		return parseInt(agent.substring(start, end));

	return -1;
}

/// <function container="Fit.Browser" name="GetQueryString" access="public" static="true" returns="object">
/// 	<description>
/// 		Returns query string object contain the following properties:
/// 		 - Url:string (Full URL)
/// 		 - Parameters:object (associative object array with URL parameters as keys)
/// 		 - Anchor:string (anchor if set, otherwise Null)
/// 	</description>
/// </function>
Fit.Browser.GetQueryString = function()
{
	var qs = { Url: null, Parameters: {}, Anchor: null };

	var url = location.href;
	var params = ((url.indexOf("?") > -1) ? url.split("?")[1] : "");
	var anchor = null;

	params = ((params.indexOf("#") > -1) ? params.split("#")[0] : params);
	anchor = ((url.indexOf("#") > -1) ? url.split("#")[1] : null);

	qs.Url = url;
	qs.Anchor = anchor;

	Fit.Array.ForEach(((params !== "") ? params.split("&") : []), function(p)
	{
		var keyval = p.split("=");
		qs.Parameters[keyval[0]] = ((keyval.length > 1) ? decodeURIComponent(keyval[1]) : "");
	});

	return qs;
}

/// <function container="Fit.Browser" name="GetLanguage" access="public" static="true" returns="string">
/// 	<description> Returns browser language - e.g. &quot;da&quot; (Danish), &quot;en&quot; (English) etc. </description>
/// </function>
Fit.Browser.GetLanguage = function()
{
	var lang = null;

	if (navigator.language)
		lang = navigator.language.toLowerCase();
	else if (navigator.browserLanguage)
		lang = navigator.browserLanguage.toLowerCase();

	if (lang === null || lang === "")
		return "en";

	if (lang.length === 2)
		return lang;

	if (lang.length === 5)
		return lang.substring(0, 2);

	return "en";
}

/// <function container="Fit.Browser" name="GetPageWidth" access="public" static="true" returns="integer">
/// 	<description> Returns page width in pixels on succes, -1 on failure </description>
/// </function>
Fit.Browser.GetPageWidth = function()
{
	var w = -1;

	if (window.innerWidth) // W3C
		w = window.innerWidth;
	else if (document.documentElement && document.documentElement.clientWidth) // IE 6-8 (not quirks mode)
		w = document.documentElement.clientWidth;

	return w;
}

/// <function container="Fit.Browser" name="GetPageHeight" access="public" static="true" returns="integer">
/// 	<description> Returns page height in pixels on succes, -1 on failure </description>
/// </function>
Fit.Browser.GetPageHeight = function()
{
	var h = -1;

	if (window.innerHeight) // W3C
		h = window.innerHeight;
	else if (document.documentElement && document.documentElement.clientHeight) // IE 6-8 (not quirks mode)
		h = document.documentElement.clientHeight;

	return h;
}

/// <function container="Fit.Browser" name="GetViewPortDimensions" access="public" static="true" returns="object">
/// 	<description> Returns object with Width and Height properties specifying dimensions of viewport </description>
/// </function>
Fit.Browser.GetViewPortDimensions = function()
{
	return { Width: Fit.Browser.GetPageWidth(), Height: Fit.Browser.GetPageHeight() };
}

/// <function container="Fit.Browser" name="GetScrollPosition" access="public" static="true" returns="object">
/// 	<description> Returns object with X and Y properties specifying scroll position </description>
/// </function>
Fit.Browser.GetScrollPosition = function()
{
	var x = document.body.scrollLeft || document.documentElement.scrollLeft || window.pageXOffset || -1;
	var y = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || -1;

	return { X: x, Y: y };
}

/// <function container="Fit.Browser" name="GetScreenWidth" access="public" static="true" returns="integer">
/// 	<description> Get screen width </description>
/// 	<param name="onlyAvailable" type="boolean" default="false">
/// 		Set True to return only available space (may be reduced by e.g. start menu (Windows) or Dock (Linux/OSX)
/// 	</param>
/// </function>
Fit.Browser.GetScreenWidth = function(onlyAvailable)
{
	Fit.Validation.ExpectBoolean(onlyAvailable, true);

	if (onlyAvailable === true)
		return window.screen.availWidth;

	return window.screen.width;
}

/// <function container="Fit.Browser" name="GetScreenHeight" access="public" static="true" returns="integer">
/// 	<description> Get screen height </description>
/// 	<param name="onlyAvailable" type="boolean" default="false">
/// 		Set True to return only available space (may be reduced by e.g. start menu (Windows) or Dock (Linux/OSX)
/// 	</param>
/// </function>
Fit.Browser.GetScreenHeight = function(onlyAvailable)
{
	Fit.Validation.ExpectBoolean(onlyAvailable, true);

	if (onlyAvailable === true)
		return window.screen.availHeight;

	return window.screen.height;
}

/// <function container="Fit.Browser" name="GetScreenDimensions" access="public" static="true" returns="object">
/// 	<description> Returns object with Width and Height properties specifying screen dimensions </description>
/// 	<param name="onlyAvailable" type="boolean" default="false">
/// 		Set True to return only available space (may be reduced by e.g. Start menu (Windows) or Dock (Linux/OSX)
/// 	</param>
/// </function>
Fit.Browser.GetScreenDimensions = function(onlyAvailable)
{
	Fit.Validation.ExpectBoolean(onlyAvailable, true);
	return { Width: Fit.Browser.GetScreenWidth(onlyAvailable), Height: Fit.Browser.GetScreenHeight(onlyAvailable) };
}

/// <function container="Fit.Browser" name="Log" access="public" static="true">
/// 	<description> Log message or object </description>
/// 	<param name="msg" type="object"> Message or object to log </param>
/// </function>
Fit.Browser.Log = function(msg) // msg not validated - any object or value (including null/undefined) can be logged
{
	if (window.console)
		console.log(msg);
}

/// <function container="Fit.Browser" name="GetInfo" access="public" static="true" returns="object">
/// 	<description> Returns cached object with browser information available through Name, Version, and Language properties </description>
/// </function>
Fit.Browser.GetInfo = function()
{
	if (!Fit._internal.Browser.Info)
	{
		Fit._internal.Browser.Info = {};

		Fit._internal.Browser.Info.Name = Fit.Browser.GetBrowser();
		Fit._internal.Browser.Info.Version = Fit.Browser.GetVersion();
		Fit._internal.Browser.Info.Language = Fit.Browser.GetLanguage();
	}

	return Fit.Core.Clone(Fit._internal.Browser.Info); // Clone to ensure values are not shared and potentially changed
}

/// <function container="Fit.Browser" name="IsStorageSupported" access="public" static="true" returns="boolean">
/// 	<description> Returns value indicating whether Session and Local storage is supported or not </description>
/// </function>
Fit.Browser.IsStorageSupported = function()
{
	if (Fit._internal.Browser.StorageSupported === undefined)
	{
		Fit._internal.Browser.StorageSupported = false;

		try
		{
			if (window.localStorage && window.sessionStorage)
			{
				var x = "__FITUITEST__";

				localStorage.setItem(x, x);
				localStorage.removeItem(x);

				sessionStorage.setItem(x, x);
				sessionStorage.removeItem(x);

				Fit._internal.Browser.StorageSupported = true;
			}
		}
		catch (err)
		{
		}
	}

	return Fit._internal.Browser.StorageSupported;
}
Fit.Controls = {};
Fit._internal.ControlBase = {};
Fit._internal.ControlBase.Controls = {};

/// <container name="Fit.Controls.ControlBase">
/// 	Class from which all UI Controls extend
/// </container>
Fit.Controls.ControlBase = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId);

	if (Fit._internal.ControlBase.Controls[controlId] !== undefined)
		Fit.Validation.ThrowError("Control with ID '" + controlId + "' has already been defined - Control IDs must be unique!");

	Fit._internal.ControlBase.Controls[controlId] = this;

	// ============================================
	// Interface - must be overridden
	// ============================================

	/// <function container="Fit.Controls.ControlBase" name="Value" access="public" returns="string">
	/// 	<description>
	/// 		Get/set control value.
	/// 		For controls supporting multiple selections: Set value by providing a string in one the following formats:
	/// 		title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
	/// 		If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
	/// 		Selected items are returned in the first format described, also with reserved characters URIEncoded.
	/// 		Providing a new value to this function results in OnChange being fired.
	/// 	</description>
	/// 	<param name="val" type="string" default="undefined"> If defined, items are selected </param>
	/// </function>
	this.Value = function(val)
	{
		// Function MUST remember to fire OnChange event when
		// value is changed, both programmatically and by user.

		Fit.Validation.ThrowError("Not implemented");
	}

	/// <function container="Fit.Controls.ControlBase" name="IsDirty" access="public" returns="boolean">
	/// 	<description> Get value indicating whether user has changed control value </description>
	/// </function>
	this.IsDirty = function()
	{
		Fit.Validation.ThrowError("Not implemented");
	}

	/// <function container="Fit.Controls.ControlBase" name="Clear" access="public">
	/// 	<description> Clear control value </description>
	/// </function>
	this.Clear = function()
	{
		// Function MUST remember to fire OnChange event when
		// value is clear, both programmatically and by user.

		Fit.Validation.ThrowError("Not implemented");
	}

	/// <function container="Fit.Controls.ControlBase" name="Focused" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control has focus </description>
	/// 	<param name="value" type="boolean" default="undefined"> If defined, True assigns focus, False removes focus (blur) </param>
	/// </function>
	this.Focused = function(val)
	{
		Fit.Validation.ThrowError("Not implemented");
	}

	// ============================================
	// Init
	// ============================================

	var me = this;
	var id = controlId;
	var container = null;
	var width = { Value: 200, Unit: "px" }; // Any changes to this line must be dublicated to Width(..)
	var height = { Value: -1, Unit: "px" };
	var scope = null;
	var required = false;
	var validationExpr = null;
	var validationError = null;
	var validationErrorType = -1; // 0 = Required, 1 = RegEx validation, 2 = Callback validation
	var validationCallbackFunc = null;
	var validationCallbackError = null;
	var lazyValidation = false;
	var blockAutoPostBack = false; // Used by AutoPostBack mechanism to prevent multiple postbacks, e.g on double click
	var onChangeHandlers = [];
	var onFocusHandlers = [];
	var onBlurHandlers = [];
	var hasFocus = false;			// Used by OnFocusIn and OnFocusOut handlers
	var focusBlurTimeout = null;	// Used by OnFocusIn and OnFocusOut handlers
	var txtValue = null;
	var txtDirty = null;
	var txtValid = null;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	function init()
	{
		container = document.createElement("div");
		container.id = id;
		container.style.width = width.Value + width.Unit;
		Fit.Dom.AddClass(container, "FitUiControl");

		me._internal.Data("focused", "false");
		me._internal.Data("valid", "true");

		// Add hidden inputs which are automatically populated with
		// control value and state information when control is updated.

		txtValue = document.createElement("textarea"); // Using Textarea to allow HTML content
		txtValue.style.display = "none";
		txtValue.name = "FitUIValue" + me.GetId();
		Fit.Dom.Add(container, txtValue);

		txtDirty = document.createElement("input");
		txtDirty.type = "hidden";
		txtDirty.name = "FitUIDirty" + me.GetId();
		Fit.Dom.Add(container, txtDirty);

		txtValid = document.createElement("input");
		txtValid.type = "hidden";
		txtValid.name = "FitUIValid" + me.GetId();
		Fit.Dom.Add(container, txtValid);

		me.OnChange(function(sender)
		{
			txtValue.value = sender.Value().toString();
			txtDirty.value = ((sender.IsDirty() === true) ? "1" : "0");
			txtValid.value = ((sender.IsValid() === true) ? "1" : "0");

			if (blockAutoPostBack === false && me.AutoPostBack() === true && document.forms.length > 0)
			{
				setTimeout(function() // Postpone to allow other handlers to execute before postback
				{
					document.forms[0].submit();
					blockAutoPostBack = true;

					setTimeout(function() { blockAutoPostBack = false; }, 1000); // Enable AutoPostBack again in case OnBeforeUnload handler was used to cancel postback
				}, 0);
			}
		});

		if (Fit.Browser.GetBrowser() !== "MSIE" || Fit.Browser.GetVersion() >= 9)
		{
			// Notice: Using Capture (true argument) for these handlers,
			// meaning they are fired before the event reach its target.
			Fit.Events.AddHandler(container, "focus", true, onFocusIn);
			Fit.Events.AddHandler(container, "blur", true, onFocusOut);
		}
		else // Legacy IE does not support event capturing used above
		{
			container.onfocusin = onFocusIn;
			container.onfocusout = onFocusOut;
		}

		me.OnBlur(function(sender)
		{
			if (lazyValidation === true)
				me._internal.Validate(true);
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.ControlBase" name="AutoPostBack" access="public" returns="boolean">
	/// 	<description> Set flag indicating whether control should post back changes automatically when value is changed </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables auto post back, False disables it </param>
	/// </function>
	this.AutoPostBack = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			me._internal.Data("autopost", val.toString());
		}

		return (me._internal.Data("autopost") === "true");
	}

	/// <function container="Fit.Controls.ControlBase" name="GetId" access="public" returns="string">
	/// 	<description> Get unique Control ID </description>
	/// </function>
	this.GetId = function()
	{
		return id;
	}

	/// <function container="Fit.Controls.ControlBase" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing control </description>
	/// </function>
	this.GetDomElement = function()
	{
		return container;
	}

	/// <function container="Fit.Controls.ControlBase" name="Dispose" access="public">
	/// 	<description>
	/// 		Destroys control to free up memory.
	/// 		Make sure to call Dispose() on ControlBase which can be done like so:
	/// 		this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	/// 		{
	/// 			&#160;&#160;&#160;&#160; // Add control specific dispose logic here
	/// 			&#160;&#160;&#160;&#160; base(); // Call Dispose on ControlBase
	/// 		});
	/// 	</description>
	/// </function>
	this.Dispose = function()
	{
		// This will destroy control - it will no longer work!

		Fit.Dom.Remove(container);
		me = id = container = width = height = scope = required = validationExpr = validationError = validationErrorType = validationCallbackFunc = validationCallbackError = onChangeHandlers = onFocusHandlers = onBlurHandlers = hasFocus = focusBlurTimeout = txtValue = txtDirty = txtValid = isIe8 = null;
		delete Fit._internal.ControlBase.Controls[controlId];
	}

	/// <function container="Fit.Controls.ControlBase" name="Width" access="public" returns="object">
	/// 	<description> Get/set control width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control width is updated to specified CSS unit </param>
	/// </function>
	this.Width = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				width = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				container.style.width = width.Value + width.Unit;
			}
			else
			{
				width = { Value: 200, Unit: "px" }; // Any changes to this line must be dublicated to line declaring the width variable !
				container.style.width = "";
			}
		}

		return width;
	}

	/// <function container="Fit.Controls.ControlBase" name="Height" access="public" returns="object">
	/// 	<description> Get/set control height - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control height is updated to specified value. A value of -1 resets control height. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control height is updated to specified CSS unit </param>
	/// </function>
	this.Height = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			height = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true && val !== -1) ? unit : "px") };

			if (height.Value > -1)
				container.style.height = height.Value + height.Unit;
			else
				container.style.height = "";
		}

		return height;
	}

	/// <function container="Fit.Controls.ControlBase" name="AddCssClass" access="public">
	/// 	<description> Add CSS class to DOMElement representing control </description>
	/// 	<param name="val" type="string"> CSS class to add </param>
	/// </function>
	this.AddCssClass = function(val)
	{
		Fit.Validation.ExpectStringValue(val);
		Fit.Dom.AddClass(container, val);
	}

	/// <function container="Fit.Controls.ControlBase" name="RemoveCssClass" access="public">
	/// 	<description> Remove CSS class from DOMElement representing control </description>
	/// 	<param name="val" type="string"> CSS class to remove </param>
	/// </function>
	this.RemoveCssClass = function(val)
	{
		Fit.Validation.ExpectStringValue(val);
		Fit.Dom.RemoveClass(container, val);
	}

	/// <function container="Fit.Controls.ControlBase" name="HasCssClass" access="public" returns="boolean">
	/// 	<description> Check whether CSS class is found on DOMElement representing control </description>
	/// 	<param name="val" type="string"> CSS class to check for </param>
	/// </function>
	this.HasCssClass = function(val)
	{
		Fit.Validation.ExpectStringValue(val);
		return Fit.Dom.HasClass(container, val);
	}

	/// <function container="Fit.Controls.ControlBase" name="Visible" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is visible </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, control visibility is updated </param>
	/// </function>
	this.Visible = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
			container.style.display = ((val === true) ? "" : "none");

		return (container.style.display !== "none");
	}

	/// <function container="Fit.Controls.ControlBase" name="Required" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is required to be set </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, control required feature is enabled/disabled </param>
	/// </function>
	this.Required = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			required = val;
			me._internal.Validate(); // Update error indicator
		}

		return required;
	}

	/// <function container="Fit.Controls.ControlBase" name="Scope" access="public" returns="string">
	/// 	<description> Get/set scope to which control belongs - this is used to validate multiple controls at once using Fit.Controls.ValidateAll(scope) </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, control scope is updated </param>
	/// </function>
	this.Scope = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === "")
				scope = null;
			else
				scope = val;
		}

		return scope;
	}

	/// <function container="Fit.Controls.ControlBase" name="Render" access="public">
	/// 	<description> Render control, either inline or to element specified </description>
	/// 	<param name="toElement" type="DOMElement" default="undefined"> If defined, control is rendered to this element </param>
	/// </function>
	this.Render = function(toElement)
	{
		Fit.Validation.ExpectDomElement(toElement, true);

		if (Fit.Validation.IsSet(toElement) === true)
		{
			Fit.Dom.Add(toElement, container);
		}
		else
		{
			var script = document.scripts[document.scripts.length - 1];
			Fit.Dom.InsertBefore(script, container);
		}

		me._internal.Validate();
	}

	/// <function container="Fit.Controls.ControlBase" name="SetValidationExpression" access="public">
	/// 	<description> Set regular expression used to perform on-the-fly validation against control value </description>
	/// 	<param name="regEx" type="RegExp"> Regular expression to validate against </param>
	/// 	<param name="errorMsg" type="string" default="undefined">
	/// 		If defined, specified error message is displayed when user clicks or hovers validation error indicator
	/// 	</param>
	/// </function>
	this.SetValidationExpression = function(regEx, errorMsg)
	{
		Fit.Validation.ExpectRegExp(regEx, true); // Allow Null/undefined which disables validation
		Fit.Validation.ExpectString(errorMsg, true);

		validationExpr = (regEx ? regEx : null);
		validationError = (errorMsg ? errorMsg : null);

		me._internal.Validate();
	}

	/// <function container="Fit.Controls.ControlBase" name="SetValidationCallback" access="public">
	/// 	<description> Set callback function used to perform on-the-fly validation against control value </description>
	/// 	<param name="cb" type="function"> Function receiving control value - must return True if value is valid, otherwise False </param>
	/// 	<param name="errorMsg" type="string" default="undefined">
	/// 		If defined, specified error message is displayed when user clicks or hovers validation error indicator
	/// 	</param>
	/// </function>
	this.SetValidationCallback = function(cb, errorMsg)
	{
		Fit.Validation.ExpectFunction(cb, true); // Allow Null/undefined which disables validation
		Fit.Validation.ExpectString(errorMsg, true);

		validationCallbackFunc = (cb ? cb : null);;
		validationCallbackError = (errorMsg ? errorMsg : null);

		me._internal.Validate();
	}

	/// <function container="Fit.Controls.ControlBase" name="IsValid" access="public" returns="boolean">
	/// 	<description>
	/// 		Get value indicating whether control value is valid.
	/// 		Control value is considered invalid if control is required, but no value is set,
	/// 		or if control value does not match regular expression set using SetValidationExpression(..).
	/// 	</description>
	/// </function>
	this.IsValid = function()
	{
		validationErrorType = -1;

		if (validationExpr === null && validationCallbackFunc === null && required === false)
			return true;

		var obj = me.Value();
		var val = ((Fit.Validation.IsSet(obj) === true) ? obj.toString() : "");

		if (required === true && val === "")
		{
			validationErrorType = 0;
			return false;
		}

		if (validationExpr !== null && validationExpr.test(val) === false)
		{
			validationErrorType = 1;
			return false;
		}

		if (validationCallbackFunc !== null && validationCallbackFunc(val) === false)
		{
			validationErrorType = 2;
			return false;
		}

		return true;
	}

	this.LazyValidation = function(val) // Make control appear valid until user touches it, or until Fit.Controls.ValidateAll(..) is invoked
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			lazyValidation = val;

			if (lazyValidation === true)
			{
				me._internal.Data("valid", "true");
				me._internal.Data("errormessage", null);
			}
		}

		return lazyValidation;
	}

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.ControlBase" name="OnChange" access="public">
	/// 	<description> Register OnChange event handler which is invoked when control value is changed either programmatically or by user </description>
	/// 	<param name="cb" type="function"> Event handler function which accepts Sender (ControlBase) </param>
	/// </function>
	this.OnChange = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onChangeHandlers, cb);
	}

	/// <function container="Fit.Controls.ControlBase" name="OnFocus" access="public">
	/// 	<description> Register OnFocus event handler which is invoked when control gains focus </description>
	/// 	<param name="cb" type="function"> Event handler function which accepts Sender (ControlBase) </param>
	/// </function>
	this.OnFocus = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onFocusHandlers, cb);
	}

	/// <function container="Fit.Controls.ControlBase" name="OnBlur" access="public">
	/// 	<description> Register OnBlur event handler which is invoked when control loses focus </description>
	/// 	<param name="cb" type="function"> Event handler function which accepts Sender (ControlBase) </param>
	/// </function>
	this.OnBlur = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onBlurHandlers, cb);
	}

	// ============================================
	// Private
	// ============================================

	function onFocusIn(e)
	{
		// Cancel OnBlur (or OnFocus if browser erroneously allow this
		// event to fire multiple times without firing OnBlur in-between).
		if (focusBlurTimeout !== null)
		{
			clearTimeout(focusBlurTimeout);
			focusBlurTimeout = null;
		}

		// Make sure OnFocus only fires once when control is initially given
		// focus - prevent it from firing when focus is changed internally.
		if (hasFocus === true)
			return;
		hasFocus = true;

		// Queue, event has not reached target yet (using Capture instead of event bubbling).
		// Target must have focus before firing OnFocus. This approach also allow for control
		// to internally change focus (e.g. in TreeView where focus may change from one node
		// to another) which may fire both Focus and Blur multiple times. When Focus fires,
		// any previous Blur event is canceled. When Blur fires, any previous Focus event is
		// canceled. The last event fired takes precedence and fires when JS thread is released.
		focusBlurTimeout = setTimeout(function()
		{
			if (me === null)
				return; // Control was disposed

			me._internal.FireOnFocus();
		}, 0);
	}

	function onFocusOut(e)
	{
		// See comments in onFocusIn(..)

		if (focusBlurTimeout !== null)
		{
			clearTimeout(focusBlurTimeout);
			focusBlurTimeout = null;
		}

		focusBlurTimeout = setTimeout(function()
		{
			if (me === null)
				return; // Control was disposed

			hasFocus = false; // Control has lost focus, allow OnFocus to fire again when it regains focus
			me._internal.FireOnBlur();
		}, 0);
	}

	// Private members (must be public in order to be accessible to controls extending from ControlBase)

	this._internal = (this._internal ? this._internal : {});

		this._internal.FireOnChange = function()
		{
			me._internal.Validate();

			Fit.Array.ForEach(onChangeHandlers, function(cb)
			{
				cb(me);
			});
		},

		this._internal.FireOnFocus = function()
		{
			me._internal.Data("focused", "true");
			me._internal.Repaint();

			Fit.Array.ForEach(onFocusHandlers, function(cb)
			{
				cb(me);
			});
		},

		this._internal.FireOnBlur = function()
		{
			me._internal.Data("focused", "false");
			me._internal.Repaint();

			Fit.Array.ForEach(onBlurHandlers, function(cb)
			{
				cb(me);
			});
		},

		this._internal.ExecuteWithNoOnChange = function(cb)
		{
			Fit.Validation.ExpectFunction(cb);

			var onChangeHandler = me._internal.FireOnChange;
			me._internal.FireOnChange = function() {};

			var error = null;

			try // Try/catch to make absolutely sure OnChange handler is restored!
			{
				cb();
			}
			catch (err)
			{
				error = err.message;
			}

			me._internal.FireOnChange = onChangeHandler;

			if (error !== null)
				Fit.Validation.ThrowError(error);
		}

		this._internal.Data = function(key, val)
		{
			Fit.Validation.ExpectStringValue(key);
			Fit.Validation.ExpectString(val, true);

			if (Fit.Validation.IsSet(val) === true || val === null)
				Fit.Dom.Data(container, key, val);

			return Fit.Dom.Data(container, key);
		},

		this._internal.AddDomElement = function(elm)
		{
			Fit.Validation.ExpectDomElement(elm);
			Fit.Dom.InsertBefore(txtValue, elm); //Fit.Dom.Add(container, elm);
		},

		this._internal.RemoveDomElement = function(elm)
		{
			Fit.Validation.ExpectDomElement(elm);
			Fit.Dom.Remove(elm);
		},

		this._internal.Validate = function(force)
		{
			Fit.Validation.ExpectBoolean(force, true);

			if (lazyValidation === true && me.Focused() === false && force !== true)
				return;

			if (me.IsValid() === valid)
				return;

			var valid = me.IsValid();

			me._internal.Data("valid", valid.toString());

			if (valid === false)
			{
				if (validationErrorType === 0)
					me._internal.Data("errormessage", Fit.Language.Translations.Required);
				else if (validationErrorType === 1 && validationError !== null)
					me._internal.Data("errormessage", validationError.replace("\r", "").replace(/<br.*>/i, "\n"));
				else if (validationErrorType === 2 && validationCallbackError !== null)
					me._internal.Data("errormessage", validationCallbackError.replace("\r", "").replace(/<br.*>/i, "\n"));
			}
			else
			{
				me._internal.Data("errormessage", null);
			}

			me._internal.Repaint();
		}

		this._internal.Repaint = function(f) // Use callback function if a repaint is required both before and after a given operation, which often requires JS thread to be released on IE
		{
			Fit.Validation.ExpectFunction(f, true);

			var cb = ((Fit.Validation.IsSet(f) === true) ? f : function() {});

			if (isIe8 === false)
			{
				cb();
			}
			else
			{
				// Flickering may occure on IE8 when updating UI over time
				// (UI update + JS thread released + UI updates again "later").

				Fit.Dom.AddClass(me.GetDomElement(), "FitUi_Non_Existing_ControlBase_Class");
				Fit.Dom.RemoveClass(me.GetDomElement(), "FitUi_Non_Existing_ControlBase_Class");

				setTimeout(function()
				{
					cb();

					Fit.Dom.AddClass(me.GetDomElement(), "FitUi_Non_Existing_ControlBase_Class");
					Fit.Dom.RemoveClass(me.GetDomElement(), "FitUi_Non_Existing_ControlBase_Class");
				}, 0);
			}
		}

	init();
}

// ============================================
// Public static
// ============================================

/// <function container="Fit.Controls" name="Find" access="public" static="true" returns="Fit.Controls.ControlBase">
/// 	<description> Get control by unique Control ID - returns Null if not found </description>
/// 	<param name="id" type="string"> Unique Control ID </param>
/// </function>
Fit.Controls.Find = function(id)
{
	Fit.Validation.ExpectStringValue(id);
	return ((Fit._internal.ControlBase.Controls[id] !== undefined) ? Fit._internal.ControlBase.Controls[id] : null);
}

/// <function container="Fit.Controls" name="ValidateAll" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Validate all controls - either all controls on page, or within specified scope.
/// 		Returns True if all controls contain valid values, otherwise False.
/// 	</description>
/// 	<param name="id" type="scope" default="undefined">
/// 		If specified, validate controls only within this scope.
/// 		See Fit.Controls.ControlBase.Scope(..)
/// 		for details on configurering scoped validation.
/// 	</param>
/// </function>
Fit.Controls.ValidateAll = function(scope)
{
	Fit.Validation.ExpectStringValue(scope, true);

	var result = true;
	Fit.Array.ForEach(Fit._internal.ControlBase.Controls, function(controlId)
	{
		var control = Fit._internal.ControlBase.Controls[controlId];

		if (Fit.Core.InstanceOf(control, Fit.Controls.ControlBase) === false)
			return;

		if (Fit.Validation.IsSet(scope) === true && control.Scope() !== scope)
			return;

		control._internal.Validate(true);

		if (control.IsValid() === false)
		{
			result = false;
			//return false;
		}
	});
	return result;
}
/// <container name="Fit.Cookies">
/// 	Cookie functionality.
/// 	Set/Get/Remove functions can be invoked as static members, or an instance of Fit.Cookies
/// 	can be created to isolate cookies to either the current path or a custom path.
/// </container>

/// <function container="Fit.Cookies" name="Cookies" access="public">
/// 	<description> Create instance of cookie container isolated to either current path or a custom path </description>
/// </function>
Fit.Cookies = function()
{
	var me = this;
	var path = location.pathname.match(/^.*\//)[0]; // Examples: / OR /sub/ OR /sub/sub/sub/
	var prefix = "";

	function init()
	{
		// Remove trailing slash for path determined automatically,
		// to prevent double slashes when doing this: cookieContainer.Prefix() + "/sub"
		// Actually a trailing slash should be used for the path, but fortunately
		// Fit.Cookies.Set(..) makes sure to add it if missing.
		path = path.substring(0, path.length - 1);
	}

	/// <function container="Fit.Cookies" name="Path" access="public" returns="string">
	/// 	<description> Get/set path to which cookies are isolated </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, changes isolation to specified path </param>
	/// </function>
	this.Path = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			path = val;
		}

		return path;
	}

	/// <function container="Fit.Cookies" name="Prefix" access="public" returns="string">
	/// 	<description>
	/// 		Get/set prefix added to all cookies - useful for grouping related cookies and to avoid naming conflicts.
	/// 		Notice that Set/Get/Remove functions automatically apply the prefix to cookie names, so the use of a prefix
	/// 		is completely transparent.
	/// 	</description>
	/// 	<param name="val" type="string" default="undefined"> If defined, changes cookie prefix to specified value </param>
	/// </function>
	this.Prefix = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			prefix = val;
		}

		return prefix;
	}

	/// <function container="Fit.Cookies" name="Set" access="public">
	/// 	<description> Create or update cookie </description>
	/// 	<param name="name" type="string"> Unique cookie name </param>
	/// 	<param name="value" type="string"> Cookie value (cannot contain semicolon!) </param>
	/// 	<param name="seconds" type="integer" default="undefined">
	/// 		Optional expiration time in seconds. Creating a cookie with
	/// 		no expiration time will cause it to expire when session ends.
	/// 	</param>
	/// </function>
	this.Set = function(name, value, seconds)
	{
		Fit.Validation.ExpectStringValue(name);
		Fit.Validation.ExpectString(name);
		Fit.Validation.ExpectInteger(seconds, true);

		Fit.Cookies.Set(prefix + name, value, seconds, path);
	}

	/// <function container="Fit.Cookies" name="Get" access="public" returns="string">
	/// 	<description> Returns cookie value if found, otherwise Null </description>
	/// 	<param name="name" type="string"> Unique cookie name </param>
	/// </function>
	this.Get = function(name)
	{
		Fit.Validation.ExpectStringValue(name);
		return Fit.Cookies.Get(prefix + name);
	}

	/// <function container="Fit.Cookies" name="Remove" access="public">
	/// 	<description> Remove cookie </description>
	/// 	<param name="name" type="string"> Unique cookie name </param>
	/// </function>
	this.Remove = function(name)
	{
		Fit.Validation.ExpectStringValue(name);
		Fit.Cookies.Set(prefix + name, "", -1, path);
	}

	init();
}

/// <function container="Fit.Cookies" name="Set" access="public" static="true">
/// 	<description> Create or update cookie </description>
/// 	<param name="name" type="string"> Unique cookie name </param>
/// 	<param name="value" type="string"> Cookie value (cannot contain semicolon!) </param>
/// 	<param name="seconds" type="integer" default="undefined">
/// 		Optional expiration time in seconds. Creating a cookie with
/// 		no expiration time will cause it to expire when session ends.
/// 	</param>
/// 	<param name="path" type="string" default="undefined">
/// 		Optional cookie path.
/// 		Specifying no path makes cookie accessible to entire domain.
/// 	</param>
/// </function>
Fit.Cookies.Set = function(name, value, seconds, path)
{
	Fit.Validation.ExpectStringValue(name);
	Fit.Validation.ExpectString(name);
	Fit.Validation.ExpectInteger(seconds, true);
	Fit.Validation.ExpectStringValue(path, true);

	if (value.indexOf(';') > -1)
		Fit.Validation.ThrowError("Unable to set cookie - value contains illegal character: ';'");

	value = value.replace(/\n/g, "\\n"); // Preserve line breaks which would otherwise break cookie value

	var date = null;

	if (Fit.Validation.IsSet(seconds) === true)
	{
		date = new Date();
		date.setTime(date.getTime() + (seconds * 1000));
	}

	document.cookie = name + "=" + value + ((date !== null) ? "; expires=" + date.toGMTString() : "") + "; path=" + ((Fit.Validation.IsSet(path) === true) ? path + ((path[path.length-1] !== "/") ? "/" : "") : "/");
}

/// <function container="Fit.Cookies" name="Get" access="public" static="true" returns="string">
/// 	<description> Returns cookie value if found, otherwise Null </description>
/// 	<param name="name" type="string"> Unique cookie name </param>
/// </function>
Fit.Cookies.Get = function(name)
{
	Fit.Validation.ExpectStringValue(name);

	var cookieName = name + "=";
	var cookies = document.cookie.split(";");
	var cookie = null;

	for (var i = 0 ; i < cookies.length ; i++)
	{
		cookie = cookies[i];

		while (cookie.charAt(0) === " ")
			cookie = cookie.substring(1, cookie.length);

		if (cookie.indexOf(cookieName) === 0)
			return cookie.substring(cookieName.length, cookie.length).replace(/\\n/g, "\n");
	}

	return null;
}

/// <function container="Fit.Cookies" name="Remove" access="public" static="true">
/// 	<description> Remove cookie </description>
/// 	<param name="name" type="string"> Unique cookie name </param>
/// 	<param name="path" type="string" default="undefined">
/// 		Optional cookie path.
/// 		If cookie was defined on a custom path, the
/// 		same path must be specified to remove the cookie.
/// 	</param>
/// </function>
Fit.Cookies.Remove = function(name, path)
{
	Fit.Validation.ExpectStringValue(name);
	Fit.Validation.ExpectStringValue(path, true);

	Fit.Cookies.Set(name, "", -1, path);
}
// =====================================
// Data
// =====================================

Fit.Data = {};

/// <function container="Fit.Data" name="CreateGuid" access="public" static="true" returns="string">
/// 	<description> Returns Version 4 compliant GUID </description>
/// 	<param name="dashFormat" type="boolean" default="true">
/// 		Flag indicating whether to use format with or without dashes.
/// 		True = With dashes (default): 57df75f2-3d09-48ca-9c94-f64a5986518f (length = 36)
/// 		False = Without dashes: 57df75f23d0948ca9c94f64a5986518f (length = 32)
/// 	</param>
/// </function>
Fit.Data.CreateGuid = function(dashFormat)
{
	Fit.Validation.ExpectBoolean(dashFormat, true);

	/*
	// Test case proving that unique GUIDs are generated every time.
	// Use a powerful computer to run this test, and a fast browser (e.g. Safari).

	var guids = {};
	var minors = 0;

	for (var i = 0 ; i < 25000000 ; i++) // 25 million
	{
		var g = Fit.Data.CreateGuid();

		minors++;
		if (minors === 5000)
		{
			console.log("5000 more GUIDs generated");
			minors = 0;
		}

		if (guids[g])
		{
			alert("GUID already in use: " + g);
			break;
		}
		else
		{
			guids[g] = 1;
		}
	}
	*/

	var chars = "0123456789abcdef".split("");

	var uuid = new Array();
	var rnd = Math.random;
	var r = -1;

	if (dashFormat !== false) uuid[8] = "-";
	if (dashFormat !== false) uuid[13] = "-";
	uuid[14] = "4"; // version 4 compliant
	if (dashFormat !== false) uuid[18] = "-";
	if (dashFormat !== false) uuid[23] = "-";

	var length = 32 + ((dashFormat !== false) ? 4 : 0);

	for (var i = 0 ; i < length ; i++)
	{
		if (uuid[i] !== undefined)
			continue;

		r = 0 | rnd() * 16;

		uuid[i] = chars[((i === 19) ? (r & 0x3) | 0x8 : r & 0xf)];
	}

	return uuid.join("");
}


// =====================================
// Math
// =====================================

Fit.Math = {};

/// <function container="Fit.Math" name="Round" access="public" static="true" returns="number">
/// 	<description> Round off value to a number with the specified precision </description>
/// 	<param name="value" type="number"> Number to round off </param>
/// 	<param name="precision" type="integer"> Desired precision </param>
/// </function>
Fit.Math.Round = function(value, precision)
{
	Fit.Validation.ExpectNumber(value);
	Fit.Validation.ExpectInteger(precision, true);

	var decimals = ((Fit.Validation.IsSet(precision) === true) ? precision : 0);

    var factor = 1;
    for (var i = 0 ; i < decimals ; i++) factor = factor * 10;
    var res = Math.round(value * factor) / factor;

	return res;
}

/// <function container="Fit.Math" name="Format" access="public" static="true" returns="string">
/// 	<description>
/// 		Format value to produce a number with the specified number of decimals.
/// 		Value is properly rounded off to ensure best precision.
/// 	</description>
/// 	<param name="value" type="number"> Number to format </param>
/// 	<param name="decimals" type="integer"> Desired number of decimals </param>
/// 	<param name="decimalSeparator" type="string" default="undefined">
/// 		If defined, the specified decimal separator will be used
/// 	</param>
/// </function>
Fit.Math.Format = function(value, decimals, decimalSeparator)
{
	Fit.Validation.ExpectNumber(value);
	Fit.Validation.ExpectInteger(decimals, true);
	Fit.Validation.ExpectString(decimalSeparator, true);

	var res = Fit.Math.Round(value, decimals);

    if (decimals <= 0)
        return res.toString();

    var str = ((res % 1 === 0) ? res.toString() + ".0" : res.toString());

    for (var i = str.split(".")[1].length ; i < decimals ; i++)
        str += "0";

    return ((Fit.Validation.IsSet(decimalSeparator) === true) ? str.replace(".", decimalSeparator) : str);
}


// =====================================
// String
// =====================================

Fit.String = {};

/// <function container="Fit.String" name="Trim" access="public" static="true" returns="string">
/// 	<description> Removes any whitespaces in beginning and end of string passed, and returns the new string </description>
/// 	<param name="str" type="string"> String to trim </param>
/// </function>
Fit.String.Trim = function(str)
{
	Fit.Validation.ExpectString(str);
	return str.replace(/^\s+|\s+$/g, "");
}

/// <function container="Fit.String" name="StripHtml" access="public" static="true" returns="string">
/// 	<description> Removes any HTML contained in string, and returns the raw text value </description>
/// 	<param name="str" type="string"> String to strip HTML from </param>
/// </function>
Fit.String.StripHtml = function(str)
{
	Fit.Validation.ExpectString(str);

	return str.replace(/(<([^>]+)>)/g, "");

	// Disabled - whitespaces are not preserved!
	/*var span = document.createElement("span");
	span.innerHTML = str;
	return Fit.String.Trim(Fit.Dom.Text(span));*/
}

Fit.String.EncodeHtml = function(str)
{
	Fit.Validation.ExpectString(str);
	return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

Fit.String.DecodeHtml = function(str)
{
	Fit.Validation.ExpectString(str);
	return str.replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

/// <function container="Fit.String" name="Hash" access="public" static="true" returns="integer">
/// 	<description> Get Java compatible Hash Code from string </description>
/// 	<param name="str" type="string"> String to get hash code from </param>
/// </function>
Fit.String.Hash = function(str)
{
	Fit.Validation.ExpectString(str);

	if (str.length == 0) return 0;

	var hash = 0;
	var chr = '';

	for (var i = 0 ; i < str.length ; i++)
	{
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash = hash & hash;
	}

	return hash;
}

Fit.String.UpperCaseFirst = function(str)
{
	Fit.Validation.ExpectString(str);

	if (str === "")
		return str;

	return str[0].toUpperCase() + str.slice(1);
}


// =====================================
// Date
// =====================================

Fit.Date = {};

Fit.Date.Format = function(date, format)
{
	Fit.Validation.ExpectDate(date);
	Fit.Validation.ExpectString(format);

	format = format.replace(/YYYY/g, date.getFullYear().toString());
	format = format.replace(/YY/g, date.getFullYear().toString().substring(2));
	format = format.replace(/Y/g, parseInt(date.getFullYear().toString().substring(2)).toString());
	format = format.replace(/MM/g, ((date.getMonth() + 1 <= 9) ? "0" : "") + (date.getMonth() + 1));
	format = format.replace(/M/g, (date.getMonth() + 1).toString());
	format = format.replace(/DD/g, ((date.getDate() <= 9) ? "0" : "") + date.getDate());
	format = format.replace(/D/g, date.getDate().toString());
	format = format.replace(/W/g, Fit.Date.GetWeek(date).toString());
	format = format.replace(/hh/g, ((date.getHours() <= 9) ? "0" : "") + date.getHours());
	format = format.replace(/h/g, date.getHours().toString());
	format = format.replace(/mm/g, ((date.getMinutes() <= 9) ? "0" : "") + date.getMinutes());
	format = format.replace(/m/g, date.getMinutes().toString());
	format = format.replace(/ss/g, ((date.getSeconds() <= 9) ? "0" : "") + date.getSeconds());
	format = format.replace(/s/g, date.getSeconds().toString());

	return format;
}

Fit.Date.Parse = function(strDate, format)
{
	Fit.Validation.ExpectString(strDate);
	Fit.Validation.ExpectString(format);

	var regex = /\d+/g;
	var match = null;
	var matches = [];

	while ((match = regex.exec(strDate)) !== null)
	{
		Fit.Array.Add(matches, match[0]);
	}

	// MM_DD/YYYY => YYYY-MM-DD
	// 05-20-2016

	var date = new Date(); //new Date(0); // Jan 01 1970 01:00:00

	var parts =
	[
		{ Name: "Year", Key: "Y", Index: -1, Value: date.getFullYear() },
		{ Name: "Month", Key: "M", Index: -1, Value: date.getMonth() + 1 },
		{ Name: "Day", Key: "D", Index: -1, Value: date.getDate() },
		{ Name: "Hours", Key: "h", Index: -1, Value: date.getHours() },
		{ Name: "Minutes", Key: "m", Index: -1, Value: date.getMinutes() },
		{ Name: "Seconds", Key: "s", Index: -1, Value: date.getSeconds() }
	];

	parts.getVal = function(key/*, asString*/)
	{
		var res = null;

		Fit.Array.ForEach(this, function(part)
		{
			if (key === part.Key)
			{
				//res = ((asString !== true) ? part.Value : ((part.Value <= 9) ? "0" : "") + part.Value);
				res = part.Value;
				return false;
			}
		});

		return res;
	}

	Fit.Array.ForEach(parts, function(part)
	{
		part.Index = format.indexOf(part.Key);
	});

	parts.sort(function(a, b)
	{
		return ((a.Index !== -1) ? a.Index : 999999) - ((b.Index !== -1) ? b.Index : 999999);
	});

	var idx = -1;

	Fit.Array.ForEach(parts, function(part)
	{
		if (part.Index !== -1)
		{
			idx++;

			if (idx > matches.length - 1)
				throw "InvalidDateFormat - " + part.Name + " not found in value";

			part.Value = parseInt(matches[idx], 10); // Radix (10) set to prevent some implementations of ECMAScript (e.g. on IE8) to intepret the value as octal (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

			if (part.Key === "M")
				part.Value = part.Value - 1; // Month is zero-based
		}
	});

	if (parts.getVal("Y").toString().length !== 4)
		throw "InvalidDateFormat - Year must be defined with four digits";

	//return new Date(parts.getVal("Y") + "-" + parts.getVal("M") + "-" + parts.getVal("D") + " " + parts.getVal("h") + ":" + parts.getVal("m") + ":" + parts.getVal("s"));
	var dt = new Date(parts.getVal("Y"), parts.getVal("M"), parts.getVal("D", true), 0, 0, 0);

	dt.setHours(parseInt(parts.getVal("h")));
	dt.setMinutes(parseInt(parts.getVal("m")));
	dt.setSeconds(parseInt(parts.getVal("s")));

	return dt;
}

Fit.Date.GetWeek = function(date) // ISO 8601 - use MomentJS for wider support!
{
	Fit.Validation.ExpectDate(date);
	//Fit.Validation.ExpectBoolean(useIso8601, true);

	// https://en.wikipedia.org/wiki/Date_and_time_representation_by_country
	// https://en.wikipedia.org/wiki/Week#Week_numbering

	/*if (useIso8601 === true) // https://en.wikipedia.org/wiki/ISO_week_date
	{*/
		// http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php/6117889#6117889
	    var d = new Date(+date);
		d.setHours(0,0,0);
		d.setDate(d.getDate()+4-(d.getDay()||7));
		return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
	/*}
	else
	{
		// http://javascript.about.com/library/blweekyear.htm
		var janFirst = new Date(date.getFullYear(), 0, 1);
		return Math.ceil((((date - janFirst) / 86400000) + janFirst.getDay() + ((useIso8601 !== true) ? 1 : 0) ) / 7);
	}*/
}


// =====================================
// Color
// =====================================

Fit.Color = {};

/// <function container="Fit.Color" name="RgbToHex" access="public" static="true" returns="string">
/// 	<description> Convert RGB colors into HEX color string - returns null in case of invalid RGB values </description>
/// 	<param name="r" type="integer"> Color index for red </param>
/// 	<param name="g" type="integer"> Color index for green </param>
/// 	<param name="b" type="integer"> Color index for blue </param>
/// </function>
Fit.Color.RgbToHex = function(r, g, b)
{
	Fit.Validation.ExpectNumber(r);
	Fit.Validation.ExpectNumber(g);
	Fit.Validation.ExpectNumber(b);

	if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255)
		return null;

    var rHex = r.toString(16);
    var gHex = g.toString(16);
    var bHex = b.toString(16);

    return ("#" + ((rHex.length === 1) ? "0" : "") + rHex + ((gHex.length === 1) ? "0" : "") + gHex + ((bHex.length === 1) ? "0" : "") + bHex).toUpperCase();
}

/// <function container="Fit.Color" name="HexToRgb" access="public" static="true" returns="string">
/// 	<description> Convert HEX color string into RGB color string - returns null in case of invalid HEX value </description>
/// 	<param name="hex" type="string"> HEX color string, e.g. #C0C0C0 (hash symbol is optional) </param>
/// </function>
Fit.Color.HexToRgb = function(hex)
{
	Fit.Validation.ExpectString(hex);

	var rgb = Fit.Color.ParseHex(hex);

	if (rgb === null)
		return null;

	return "rgb(" + rgb.Red + ", " + rgb.Green + ", " + rgb.Blue + ")";
}

/// <function container="Fit.Color" name="ParseHex" access="public" static="true" returns="object">
/// 	<description> Convert HEX color string into RGB color object, e.g. { Red: 150, Green: 30, Blue: 185 } - returns null in case of invalid HEX value </description>
/// 	<param name="hex" type="string"> HEX color string, e.g. #C0C0C0 (hash symbol is optional) </param>
/// </function>
Fit.Color.ParseHex = function(hex)
{
	Fit.Validation.ExpectString(hex);

	var result = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);

	if (result === null)
		return null;

	return { Red: parseInt(result[1], 16), Green: parseInt(result[2], 16), Blue: parseInt(result[3], 16) };
}

/// <function container="Fit.Color" name="ParseRgb" access="public" static="true" returns="object">
/// 	<description>
/// 		Parses RGB(A) string and turns result into RGB(A) color object, e.g.
/// 		{ Red: 100, Green: 100, Blue: 100, Alpha: 0.3 } - returns null in case of invalid value.
/// 	</description>
/// 	<param name="val" type="string"> RGB(A) color string, e.g. rgba(100, 100, 100, 0.3) or simply 100,100,200,0.3 </param>
/// </function>
Fit.Color.ParseRgb = function(val)
{
	// Parse colors from rgb[a](r, g, b[, a]) string
	var result = val.match(/\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(\s*,\s*(\d*.*\d+))*/); // http://regex101.com/r/rZ7rO2/9

	if (result === null)
		return null;

	var c = {};
	c.Red = parseInt(result[1]);
	c.Green = parseInt(result[2]);
	c.Blue = parseInt(result[3]);
	c.Alpha = ((result[5] !== undefined) ? parseFloat(result[5]) : 1.00);

	return c;
}
/// <container name="Fit.Dom">
/// 	DOM (Document Object Model) manipulation and helper functionality
/// </container>
Fit.Dom = {};

// ==========================================================
// CSS
// ==========================================================

/// <function container="Fit.Dom" name="AddClass" access="public" static="true">
/// 	<description> Add CSS class to element if not already found </description>
/// 	<param name="elm" type="DOMElement"> Element on which CSS class is to be added </param>
/// 	<param name="cls" type="string"> CSS class name </param>
/// </function>
Fit.Dom.AddClass = function(elm, cls)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(cls);

	if (Fit.Dom.HasClass(elm, cls) === false)
		elm.className += ((elm.className !== "") ? " " : "") + cls;
}

/// <function container="Fit.Dom" name="RemoveClass" access="public" static="true">
/// 	<description> Remove CSS class from element if found </description>
/// 	<param name="elm" type="DOMElement"> Element from which CSS class is to be removed </param>
/// 	<param name="cls" type="string"> CSS class name </param>
/// </function>
Fit.Dom.RemoveClass = function(elm, cls)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(cls);

    var arr = elm.className.split(" ");
    var newCls = "";

    Fit.Array.ForEach(arr, function(item)
    {
        if (item !== cls)
            newCls += ((newCls !== "") ? " " : "") + item;
    });

    elm.className = newCls;
}

/// <function container="Fit.Dom" name="HasClass" access="public" static="true" returns="boolean">
/// 	<description> Check whether given DOMElement has specified CSS class registered - returns True if found, otherwise False </description>
/// 	<param name="elm" type="DOMElement"> Element for which CSS class may be registered </param>
/// 	<param name="cls" type="string"> CSS class name </param>
/// </function>
Fit.Dom.HasClass = function(elm, cls)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(cls);

    var arr = elm.className.split(" ");
	var found = false;

    Fit.Array.ForEach(arr, function(item)
    {
        if (item === cls)
		{
			found = true;
			return false; // Stop loop
		}
    });

    return found;
}

/// <function container="Fit.Dom" name="GetComputedStyle" access="public" static="true" returns="string">
/// 	<description>
/// 		Get style value applied after stylesheets have been loaded.
/// 		An empty string may be returned if style has not been defined, or Null if style does not exist.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element which contains desired CSS style value </param>
/// 	<param name="style" type="string"> CSS style property name </param>
/// </function>
Fit.Dom.GetComputedStyle = function(elm, style)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(style);

	var res = null;

    if (window.getComputedStyle) // W3C
	{
		res = window.getComputedStyle(elm)[style];
	}
    else if (elm.currentStyle)
	{
		if (style.indexOf("-") !== -1) // Turn e.g. border-bottom-style into borderBottomStyle which is required by legacy browsers
		{
			var items = style.split("-");
			style = "";

			Fit.Array.ForEach(items, function(i)
			{
				if (style === "")
					style = i;
				else
					style += Fit.String.UpperCaseFirst(i);
			});
		}

        res = elm.currentStyle[style];
	}

    return (res !== undefined ? res : null);
}

/// <function container="Fit.Dom" name="GetInnerDimensions" access="public" static="true" returns="object">
/// 	<description>
/// 		Returns object with X and Y properties (integers) with inner dimensions of specified
/// 		container. Inner dimensions are width and height with padding and borders substracted.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get inner dimensions for </param>
/// </function>
Fit.Dom.GetInnerDimensions = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	var px = function(val) { return (val ? parseInt(val) : 0); }

	var width = elm.offsetWidth;
	var height = elm.offsetHeight;

	if (width !== 0) // Width is 0 if element is either not visible, or truly 0px
	{
		width -= px(Fit.Dom.GetComputedStyle(elm, "padding-left"));
		width -= px(Fit.Dom.GetComputedStyle(elm, "padding-right"));
		width -= px(Fit.Dom.GetComputedStyle(elm, "border-left-width"));
		width -= px(Fit.Dom.GetComputedStyle(elm, "border-right-width"));
	}

	if (height !== 0) // Height is 0 if element is either not visible, or truly 0px
	{
		height -= px(Fit.Dom.GetComputedStyle(elm, "padding-top"));
		height -= px(Fit.Dom.GetComputedStyle(elm, "padding-bottom"));
		height -= px(Fit.Dom.GetComputedStyle(elm, "border-top-width"));
		height -= px(Fit.Dom.GetComputedStyle(elm, "border-bottom-width"));
	}

	return { X: Math.floor(width), Y: Math.floor(height) };
}

Fit.Dom.GetInnerWidth = function(elm) // Backward compatibility
{
	Fit.Validation.ExpectDomElement(elm);
	return Fit.Dom.GetInnerDimensions(elm).X;
}


// ==========================================================
// DOM
// ==========================================================

/// <function container="Fit.Dom" name="IsRooted" access="public" static="true" returns="boolean">
/// 	<description> Returns True if element is rooted in document (appended to body), otherwise False </description>
/// 	<param name="elm" type="DOMElement"> Element to check </param>
/// </function>
Fit.Dom.IsRooted = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	var parent = elm.parentElement;
	while (parent !== null)
	{
		if (parent === document.body)
			return true;

		parent = parent.parentElement;
	}

	return false;
}

/// <function container="Fit.Dom" name="InsertBefore" access="public" static="true">
/// 	<description> Insert DOMElement before another DOMElement </description>
/// 	<param name="target" type="DOMElement"> Element to insert new element before </param>
/// 	<param name="newElm" type="DOMElement"> Element to insert before target element </param>
/// </function>
Fit.Dom.InsertBefore = function(target, newElm)
{
	Fit.Validation.ExpectDomElement(target);
	Fit.Validation.ExpectDomElement(newElm);

	target.parentElement.insertBefore(newElm, target);
}

/// <function container="Fit.Dom" name="InsertAfter" access="public" static="true">
/// 	<description> Insert DOMElement after another DOMElement </description>
/// 	<param name="target" type="DOMElement"> Element to insert new element after </param>
/// 	<param name="newElm" type="DOMElement"> Element to insert after target element </param>
/// </function>
Fit.Dom.InsertAfter = function(target, newElm)
{
	Fit.Validation.ExpectDomElement(target);
	Fit.Validation.ExpectDomElement(newElm);

	if (target.nextSibling)
		target.parentElement.insertBefore(newElm, target.nextSibling);
	else
		target.parentElement.appendChild(newElm);
}

/// <function container="Fit.Dom" name="InsertAt" access="public" static="true">
/// 	<description> Insert DOMElement at given position </description>
/// 	<param name="container" type="DOMElement"> Container to insert element into </param>
/// 	<param name="position" type="integer"> Position (index) to insert element at </param>
/// 	<param name="newElm" type="DOMElement"> Element to insert </param>
/// </function>
Fit.Dom.InsertAt = function(container, position, newElm)
{
	Fit.Validation.ExpectDomElement(container);
	Fit.Validation.ExpectInteger(position);
	Fit.Validation.ExpectDomElement(newElm);

	if (container.children.length === 0 || container.children.length - 1 < position)
	{
		container.appendChild(newElm);
	}
	else
	{
		var before = container.children[position];

		if (before)
			Fit.Dom.InsertBefore(before, newElm);
	}
}

/// <function container="Fit.Dom" name="Replace" access="public" static="true">
/// 	<description> Replace element with another one </description>
/// 	<param name="oldElm" type="object"> Element to replace (Element or Text) </param>
/// 	<param name="newElm" type="object"> Replacement element (Element or Text) </param>
/// </function>
Fit.Dom.Replace = function(oldElm, newElm) // http://jsfiddle.net/Jemt/eu74o984/
{
	Fit.Validation.ExpectContentNode(oldElm);
	Fit.Validation.ExpectContentNode(newElm);

	var container = oldElm.parentElement;
	container.replaceChild(newElm, oldElm);
}

/// <function container="Fit.Dom" name="Add" access="public" static="true">
/// 	<description> Add element to container </description>
/// 	<param name="container" type="DOMElement"> Add element to this container </param>
/// 	<param name="elm" type="object"> Element or Text node to add to container </param>
/// </function>
Fit.Dom.Add = function(container, elm)
{
	Fit.Validation.ExpectDomElement(container);
	Fit.Validation.ExpectContentNode(elm);

	container.appendChild(elm);
}

/// <function container="Fit.Dom" name="Remove" access="public" static="true">
/// 	<description> Remove DOMElement from its container element </description>
/// 	<param name="elm" type="DOMElement"> DOMElement to remove </param>
/// </function>
Fit.Dom.Remove = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	if (elm.parentElement === null)
		return; // Element not rooted

	elm.parentElement.removeChild(elm);
}

/// <function container="Fit.Dom" name="Attribute" access="public" static="true" returns="string">
/// 	<description> Get/set attribute on DOMElement </description>
/// 	<param name="elm" type="DOMElement"> DOMElement to which attribute is set and/or returned from </param>
/// 	<param name="name" type="string"> Name of attribute to set or retrieve </param>
/// 	<param name="value" type="string" default="undefined">
/// 		If defined, attribute is updated with specified value.
/// 		Passing Null results in attribute being removed.
/// 	</param>
/// </function>
Fit.Dom.Attribute = function(elm, name, value)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(name);
	Fit.Validation.ExpectString(value, true);

	if (Fit.Validation.IsSet(value) === true)
		elm.setAttribute(name, value);
	else if (value === null)
		elm.removeAttribute(name);

	return elm.getAttribute(name);
}

/// <function container="Fit.Dom" name="Data" access="public" static="true" returns="string">
/// 	<description> Get/set data attribute on DOMElement </description>
/// 	<param name="elm" type="DOMElement"> DOMElement to which data attribute is set and/or returned from </param>
/// 	<param name="name" type="string"> Name of data attribute to set or retrieve </param>
/// 	<param name="value" type="string" default="undefined">
/// 		If defined, data attribute is updated with specified value.
/// 		Passing Null results in data attribute being removed.
/// 	</param>
/// </function>
Fit.Dom.Data = function(elm, name, value)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(name);
	Fit.Validation.ExpectString(value, true);

	// Modern browsers can read data-attributes from elm.dataset.ATTRIBUTE.
	// Notice that data-title-value="XYZ" becomes elm.dataset.titleValue.

	return Fit.Dom.Attribute(elm, "data-" + name, value);
}

/// <function container="Fit.Dom" name="CreateElement" access="public" static="true" returns="DOMElement">
/// 	<description>
/// 		Create element with the specified HTML content.
/// 		HTML content is (by default) wrapped in a &lt;div&gt; if it produced multiple elements.
/// 		If content on the other hand produces only one outer element, that particular element is returned.
/// 		The container type used to wrap multiple elements can be changed using the containerTagName argument.
/// 	</description>
/// 	<param name="html" type="string"> HTML element to create DOMElement from </param>
/// 	<param name="containerTagName" type="string" default="div">
/// 		If defined, and html argument produces multiple element, the result is wrapped in a container of
/// 		the specified type. If not set, multiple elements will be wrapped in a &lt;div&gt; container.
/// 	</param>
/// </function>
Fit.Dom.CreateElement = function(html, containerTagName)
{
	Fit.Validation.ExpectString(html);
	Fit.Validation.ExpectStringValue(containerTagName, true);

	if (Fit.String.Trim(html).toLowerCase().indexOf("<tr") === 0) // <tr> can only be rooted in a <table> container
	{
		html = Fit.String.Trim(html);

		var container = document.createElement("div"); // Using <div> rather than <tbody> because tbody.innerHTML is read-only in Legacy IE
		container.innerHTML = "<table><tbody>" + html + "</tbody></table>";

		if (container.firstChild.firstChild.children.length === 1)
			return container.firstChild.firstChild.firstChild;

		return container.firstChild;
	}
	else if (Fit.String.Trim(html).toLowerCase().indexOf("<td") === 0) // <td> can only be rooted in a <tr> container
	{
		html = Fit.String.Trim(html); // Make sure container is not returned if e.g. "  <td>test</td>" is passed

		var container = document.createElement("div"); // Using <div> rather than <tr> because tr.innerHTML is read-only in Legacy IE
		container.innerHTML = "<table><tbody><tr>" + html + "</tr></tbody></table>";

		if (container.firstChild.firstChild.firstChild.children.length === 1)
			return container.firstChild.firstChild.firstChild.firstChild;

		return container.firstChild.firstChild.firstChild;
	}
	else
	{
		var container = document.createElement(((Fit.Validation.IsSet(containerTagName) === true) ? containerTagName : "div"));
		container.innerHTML = html;

		// Using childNodes property instead of children property to include text nodes,
		// which the DOM functions in Fit.UI usually do not take into account.
		// If text nodes are not included, a call like the following would exclude
		// the " world" portion. We do not want to throw away data, naturally! Example:
		// Fit.Dom.CreateElement("<span>Hello</span> world"); // Returns <div><span>Hello</span> world</div>
		if (container.childNodes.length === 1)
			return container.firstChild;

		return container;
	}
}

/// <function container="Fit.Dom" name="Text" access="public" static="true" returns="string">
/// 	<description> Get/set inner text of DOMElement </description>
/// 	<param name="elm" type="DOMElement"> DOMElement to which text is added and/or returned from </param>
/// 	<param name="value" type="string" default="undefined"> If defined, inner text is updated with specified value </param>
/// </function>
Fit.Dom.Text = function(elm, value)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectString(value, true);

	if (Fit.Validation.IsSet(value) === true)
	{
		if (elm.textContent)
			elm.textContent = value;
		else
			elm.innerText = value;
	}

	return (elm.textContent ? elm.textContent : elm.innerText);
}

/// <function container="Fit.Dom" name="GetIndex" access="public" static="true" returns="integer">
/// 	<description> Get element position within parent element </description>
/// 	<param name="elm" type="DOMElement"> DOMElement to get index for </param>
/// </function>
Fit.Dom.GetIndex = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	if (!elm.parentElement)
		return -1;

	var parent = elm.parentElement;

	for (var i = 0 ; i < parent.children.length ; i++)
		if (parent.children[i] === elm)
			return i;

	return -1; // Should not happen
}

/// <function container="Fit.Dom" name="GetDepth" access="public" static="true" returns="integer">
/// 	<description>
/// 		Get number of levels specified element is nested in DOM.
/// 		HTMLElement is at level 0, HTMLBodyElement is at level 1,
/// 		first element in HTMLBodyElement is at level 2, and so forth.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get depth in DOM for </param>
/// </function>
Fit.Dom.GetDepth = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

    var i = 0;
    var parent = elm.parentElement;

    while (parent)
    {
        i++;
        parent = parent.parentElement;
    }

    return i;
}

/// <function container="Fit.Dom" name="Contained" access="public" static="true" returns="boolean">
/// 	<description> Check whether given element is found in given container at any given level in object hierarchy </description>
/// 	<param name="container" type="DOMElement"> Container expected to contain element </param>
/// 	<param name="elm" type="DOMElement"> Element expected to be found in container's object hierarchy </param>
/// </function>
Fit.Dom.Contained = function(container, elm)
{
	Fit.Validation.ExpectDomElement(container);
	Fit.Validation.ExpectDomElement(elm);

    var parent = elm.parentElement;

    while (parent)
    {
        if (parent === container)
			return true;

        parent = parent.parentElement;
    }

    return false;
}

/// <function container="Fit.Dom" name="IsVisible" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Check whether given element is visible. Returns True if element has been rooted
/// 		in DOM and is visible. Returns False if not rooted, or display:none has been set
/// 		on element or any of its ancestors.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to check visibility for </param>
/// </function>
Fit.Dom.IsVisible = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	// Determine visibility quickly using offsetParent if possible.
	// Notice that offsetParent is always Null for an element with
	// position:fixed, in which case this check will not suffice.
	if (Fit._internal.Dom.IsOffsetParentSupported() === true && Fit.Dom.GetComputedStyle(elm, "position") !== "fixed")
	{
		return (elm.offsetParent !== null);
	}

	// Traverse DOM bottom-up to determine whether element or any ancestors have display:none set

	var element = elm;
	var previous = null;

	while (element !== null)
	{
		if (Fit.Dom.GetComputedStyle(element, "display") === "none")
			return false; // Element is not visible

		previous = element;
		element = element.parentElement;
	}

	return (previous === document.documentElement); // If last parent reached is not <html>, then element is not rooted in DOM yet
}

/// <function container="Fit.Dom" name="GetConcealer" access="public" static="true" returns="DOMElement">
/// 	<description>
/// 		Get container responsible for hiding given element.
/// 		Element passed will be returned if hidden itself.
/// 		Returns Null if element is visible, or has not been rooted in DOM yet.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get concealer for </param>
/// </function>
Fit.Dom.GetConcealer = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	if (Fit.Dom.IsVisible(elm) === true)
		return null; // Element is not concealed - it is visible and rooted in DOM

	// Element is hidden or not rooted in DOM.
	// Traverse DOM bottom-up to find container hiding element.

	var element = elm;
	while (element !== null)
	{
		if (Fit.Dom.GetComputedStyle(element, "display") === "none")
			return element;

		element = element.parentElement;
	}

	return null; // Not rooted in DOM yet
}

/// <function container="Fit.Dom" name="GetParentOfType" access="public" static="true" returns="DOMElement">
/// 	<description> Returns first parent of specified type for a given DOMElement if found, otherwise Null </description>
/// 	<param name="element" type="DOMElement"> DOMElement to find parent for </param>
/// 	<param name="parentType" type="string"> Tagname of parent element to look for </param>
/// </function>
Fit.Dom.GetParentOfType = function(element, parentType)
{
	Fit.Validation.ExpectDomElement(element);
	Fit.Validation.ExpectStringValue(parentType);

    var parent = element.parentElement;

    while (parent !== null)
    {
        if (parent.tagName.toLowerCase() === parentType.toLowerCase())
			return parent;

        parent = parent.parentElement;
    }

    return null;
}

/// <function container="Fit.Dom" name="Wrap" access="public" static="true">
/// 	<description> Wraps element in container element while preserving position in DOM </description>
/// 	<param name="elementToWrap" type="DOMElement"> Element to wrap </param>
/// 	<param name="container" type="DOMElement"> Container to wrap element within </param>
/// </function>
Fit.Dom.Wrap = function(elementToWrap, container)
{
	Fit.Validation.ExpectDomElement(elementToWrap);
	Fit.Validation.ExpectDomElement(container);

	var parent = elementToWrap.parentElement;
	var nextSibling = elementToWrap.nextSibling;

	container.appendChild(elementToWrap); // Causes elementToWrap to be removed from existing container

	if (nextSibling === null)
		parent.appendChild(container);
	else
		parent.insertBefore(container, nextSibling);
}


// ==========================================================
// Position
// ==========================================================

// Notice: Browser vendors are changing the way coordinates
// and dimensions are reported. W3C previously define these as
// integers/longs, but browsers are moving to floats for smoother
// animation and scrolling, and for more accurate positioning.
// https://code.google.com/p/chromium/issues/detail?id=323935
// For consistency we use Math.floor to make sure integers are
// always returned on both modern and legacy browsers.

/// <function container="Fit.Dom" name="GetPosition" access="public" static="true" returns="object">
/// 	<description>
/// 		Get element position.
/// 		Object returned contains an X and Y property with the desired integer values (pixels).
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get position for </param>
/// 	<param name="relativeToViewport" type="boolean" default="false">
/// 		Set False to get element position relative to viewport rather than to document which may exceed the viewport
/// 	</param>
/// </function>
Fit.Dom.GetPosition = function(elm, relativeToViewport)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectBoolean(relativeToViewport, true);

	// Return position within viewport

	if (relativeToViewport === true)
	{
		var res = elm.getBoundingClientRect(); // DOMRect object with float properties
		return { X: Math.floor(res.left), Y: Math.floor(res.top) };
	}

	// Return position within document.
	// NOTICE: Does not substract any scrolling! Use Fit.Dom.GetScrollPosition(..)
	// to calculate the amount of pixels a given element has been scrolled.

	var pos = { X: 0, Y: 0 };

	while (elm)
	{
		pos.X += elm.offsetLeft;
		pos.Y += elm.offsetTop;
		elm = elm.offsetParent;
	}

	pos.X = Math.floor(pos.X);
	pos.Y = Math.floor(pos.Y);

	return pos;
}

/// <function container="Fit.Dom" name="GetInnerPosition" access="public" static="true" returns="object">
/// 	<description>
/// 		Get element position relative to a parent or ancestor.
/// 		Object returned contains an X and Y property with the desired integer values (pixels).
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get position for </param>
/// 	<param name="parent" type="DOMElement"> Parent or ancestor element to measure distance within </param>
/// </function>
Fit.Dom.GetInnerPosition = function(elm, parent)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectDomElement(parent);

	var x = elm.offsetLeft;
	var y = elm.offsetTop;

	while ((elm = elm.offsetParent) !== parent && elm !== null)
	{
		x += elm.offsetLeft;
		y += elm.offsetTop;
	}

	return { X: Math.floor(x), Y: Math.floor(y) };
}

/// <function container="Fit.Dom" name="GetPosition" access="public" static="true" returns="object">
/// 	<description>
/// 		Get number of pixels specified element's container(s)
/// 		have been scrolled. This gives us the total scroll value
/// 		for nested scrollable elements.
/// 		Object returned contains an X and Y property with the desired integer values (pixels).
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get scroll position for </param>
/// </function>
Fit.Dom.GetScrollPosition = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	// Get number of pixels specified element's container(s)
	// have been scrolled. This gives us the total scroll value
	// for nested scrollable elements which in combination with
	// X,Y mouse coordinates can be used to determine the mouse
	// position in the document rather than in the viewport:
	// scrollX = mouseXviewport + GetScrollPosition(elm).X;
	// scrollY = mouseYviewport + GetScrollPosition(elm).Y;

	var pos = { X: 0, Y: 0 };

	while (elm)
	{
		pos.X += elm.scrollLeft;
		pos.Y += elm.scrollTop;
		elm = elm.parentElement;
	}

	pos.X = Math.floor(pos.X);
	pos.Y = Math.floor(pos.Y);

	return pos;
}

// Internal members

Fit._internal.Dom = {};

Fit._internal.Dom.IsOffsetParentSupported = function()
{
	if (Fit._internal.Dom.OffsetParentSupported === undefined)
	{
		var parent = document.createElement("div");
		var child = document.createElement("div");

		parent.style.display = "none";

		Fit.Dom.Add(document.body, parent);
		Fit.Dom.Add(parent, child);

		Fit._internal.Dom.OffsetParentSupported = (child.offsetParent === null); // If supported, offsetParent should return Null (will return <body> on e.g. IE9-10)
	}

	return Fit._internal.Dom.OffsetParentSupported;
}
Fit.DragDrop = {};

/*

TODO: Ryd op i Draggable og Dropzone!
      Properties på objekt i _internal.active og objekter i _internal.dropzones
      bør være instanser af Draggable og DropZone, som blot eksponerer en funktion
      der giver adgang til relevante properties. Saml det sammen!

      Performance-test: Hvordan fungerer det med 3000 draggable elementer og 1000 dropzones?

*/





// Draggable

/// <function container="Fit.DragDrop.Draggable" name="Draggable" access="public">
/// 	<description> Constructor - create instance of Draggable class </description>
/// 	<param name="domElm" type="DOMElement"> Element to turn into draggable object </param>
/// </function>
Fit.DragDrop.Draggable = function(domElm)
{
    // Private properties

    var elm = domElm;
    var me = this;

    var onDragStart = null;
    var onDragging = null;
    var onDragStop = null;

    // Construct

    function init()
    {
        Fit.Dom.AddClass(elm, "FitDragDropDraggable");

        // Mouse down

        Fit.Events.AddHandler(elm, "mousedown", function(e)
        {
            var ev = e || window.event;

            Fit.Dom.AddClass(elm, "FitDragDropDragging");

            // Mouse position in viewport
            var mouseXviewport = (ev.clientX || e.pageX);
            var mouseYviewport = (ev.clientY || e.pageY);

            // Make sure element being dragged is on top of every other draggable element
            Fit.DragDrop.Draggable._internal.zIndex++;
            elm.style.zIndex = Fit.DragDrop.Draggable._internal.zIndex;

            // Create state information object for draggable currently being dragged
            var state =
            {
                Draggable: me,
                Positioning: (Fit.Dom.GetComputedStyle(elm, "position") === "absolute" ? "absolute" : "relative"),
                Mouse: {Viewport: {X: -1, Y: -1}, Document: {X: -1, Y: -1}},
                Position: {Viewport: {X: -1, Y: -1}, Document: {X: -1, Y: -1}, Offset: {X: -1, Y: -1}},
                Events: { OnDragStart: onDragStart, OnDragging: onDragging, OnDragStop: onDragStop },
                OnSelectStart : document.onselectstart
            };

            // Disable text selection for legacy browsers
            document.onselectstart = function() { return false; }

            // Find mouse position in viewport
            state.Mouse.Viewport.X = mouseXviewport;
            state.Mouse.Viewport.Y = mouseYviewport;

            // Find mouse position in document (which may have been scrolled)
            //state.Mouse.Document.X = mouseXviewport + window.scrollX;
            //state.Mouse.Document.Y = mouseYviewport + window.scrollY;
            var scrollPos = Fit.Dom.GetScrollPosition(elm);
            state.Mouse.Document.X = mouseXviewport + scrollPos.X;
            state.Mouse.Document.Y = mouseYviewport + scrollPos.Y;

            // Find draggable position in viewport and document
            state.Position.Viewport = Fit.Dom.GetPosition(elm, true);
            state.Position.Document = Fit.Dom.GetPosition(elm);

            // Find X,Y position already set for draggable (by previous drag operation or using CSS positioning)
            var offsetX = Fit.Dom.GetComputedStyle(elm, "left");
            var offsetY = Fit.Dom.GetComputedStyle(elm, "top");
            state.Position.Offset.X = (offsetX.indexOf("px") > -1 ? parseInt(offsetX) : 0);
            state.Position.Offset.Y = (offsetY.indexOf("px") > -1 ? parseInt(offsetY) : 0);

            Fit.DragDrop.Draggable._internal.active = state;

            // If draggable is also a dropzone, move it to the end of internal dropzones collection
            // to make sure this dropzone is considered "on top" of other dropzones.
            // NOTICE: This only works reliable if draggable dropzones are placed on top of each
            // other by the user. If the dropzones are programmatically floated on top of each other,
            // the dropzones must be added (turned into dropzones) in the same order as they appear
            // visually.

            if (Fit.Dom.HasClass(elm, "FitDragDropDropzone") === true)
            {
                // Find draggable dropzone in dropzones collection
                var draggableDropzone = null;
                Fit.Array.ForEach(Fit.DragDrop.Dropzone._internal.dropzones, function(dzState)
                {
                    if (dzState.Dropzone.GetElement() === elm)
                    {
                        draggableDropzone = dzState;
                        return false;
                    }
                });

                // Move dropzone to end of collection
                Fit.Array.Remove(Fit.DragDrop.Dropzone._internal.dropzones, draggableDropzone);
                Fit.Array.Add(Fit.DragDrop.Dropzone._internal.dropzones, draggableDropzone);
            }

            if (state.Events.OnDragStart)
                state.Events.OnDragStart(elm);

            // NECESSARY?
            if (ev.preventDefault)
                ev.preventDefault();
            ev.cancelBubble = true;
        });

        // Mouse Up

        if (Fit.DragDrop.Draggable._internal.mouseUpRegistered === false)
        {
            Fit.DragDrop.Draggable._internal.mouseUpRegistered = true;

            Fit.Events.AddHandler(document, "mouseup", function(e)
            {
                if (Fit.DragDrop.Draggable._internal.active === null)
                    return;

                var ev = e || window.event;

                var draggableState = Fit.DragDrop.Draggable._internal.active;
                var draggable = Fit.DragDrop.Draggable._internal.active.Draggable;

                var dropzoneState = Fit.DragDrop.Dropzone._internal.active
                var dropzone = (dropzoneState !== null ? dropzoneState.Dropzone : null);

                // Handle draggable

                Fit.Dom.RemoveClass(draggable.GetElement(), "FitDragDropDragging");
                Fit.DragDrop.Draggable._internal.active = null;

                if (draggableState.Events.OnDragStop)
                    draggableState.Events.OnDragStop(draggable);

                // Handle active dropzone

                if (dropzoneState !== null)
                {
                    Fit.Dom.RemoveClass(dropzone.GetElement(), "FitDragDropDropzoneActive");
                    Fit.DragDrop.Dropzone._internal.active = null;

                    if (dropzoneState.OnDrop)
                        dropzoneState.OnDrop(dropzone, draggable);
                }

                // Restore OnSelectStart event
                document.onselectstart = draggableState.OnSelectStart;
            });
        }

        // Mouse move

        if (Fit.DragDrop.Draggable._internal.mouseMoveRegistered === false)
        {
            Fit.DragDrop.Draggable._internal.mouseMoveRegistered = true;

            Fit.Events.AddHandler(document, "mousemove", function(e)
            {
                if (Fit.DragDrop.Draggable._internal.active === null)
                    return;

                var ev = e || window.event;

                // Handle draggable

                var state = Fit.DragDrop.Draggable._internal.active;
                var draggable = state.Draggable;
                var elm = draggable.GetElement();

                // Mouse position in viewport
                var mouseXviewport = (ev.clientX || e.pageX);
                var mouseYviewport = (ev.clientY || e.pageY);

                // Mouse position in document.
                // Potential performance optimization: Only call GetScrollPosition if element
                // is contained in scrollable element. If not, use window.scrollX/Y instead!
                //var mouseXdocument = mouseXviewport + window.scrollX;
                //var mouseYdocument = mouseYviewport + window.scrollY;
                var scrollPos = Fit.Dom.GetScrollPosition(elm);
                mouseXdocument = mouseXviewport + scrollPos.X;
                mouseYdocument = mouseYviewport + scrollPos.Y;

                if (Fit.DragDrop.Draggable._internal.active.Positioning === "absolute")
                {
                    // Mouse position within draggable
                    var mouseFromLeft = state.Mouse.Viewport.X - state.Position.Viewport.X;
                    var mouseFromTop = state.Mouse.Viewport.Y - state.Position.Viewport.Y;

                    elm.style.position = "absolute";
                    elm.style.left = (mouseXdocument - mouseFromLeft) + "px";
                    elm.style.top = (mouseYdocument - mouseFromTop) + "px";
                }
                else // relative
                {
                    // Number of pixels mouse moved
                    var mouseXmoved = mouseXdocument - state.Mouse.Document.X;
                    var mouseYmoved = mouseYdocument - state.Mouse.Document.Y;

                    // Element have been initially positioned or previously moved
                    var elementLeft = state.Position.Offset.X;
                    var elementTop = state.Position.Offset.Y;

                    elm.style.position = "relative";
                    elm.style.left = elementLeft + mouseXmoved + "px";
                    elm.style.top = elementTop + mouseYmoved + "px";
                }

                if (state.Events.OnDragging)
                    state.Events.OnDragging(elm);

                // Handle dropzones

                var dropzone = null;
                var dropzoneElement = null;
                var pos = null;
                var dropZoneX = -1;
                var dropZoneY = -1;

                // State objects
                var previouslyActiveDropzone = Fit.DragDrop.Dropzone._internal.active;
                var dropzoneActive = null;

                // Find active dropzone.
                // NOTICE: If dropzones are floated on top of each other, make sure they are added to the
                // internal dropzones collection in order of appearance to make sure the correct dropzone
                // is turned active.
                Fit.Array.ForEach(Fit.DragDrop.Dropzone._internal.dropzones, function(dzState)
                {
                    dropzone = dzState.Dropzone;
                    dropzoneElement = dropzone.GetElement();

                    pos = Fit.Dom.GetPosition(dropzoneElement, true);
                    dropZoneX = pos.X;
                    dropZoneY = pos.Y;

                    var dropzoneFound = (dropzoneActive === null);
                    var dropzoneDeeperThanPreviouslyFound = (dropzoneActive === null || Fit.Dom.GetDepth(dropzoneElement) > Fit.Dom.GetDepth(dropzoneActive.Dropzone.GetElement()));
                    var dropzoneCurrentlyBeingDragged = (Fit.Dom.HasClass(dropzoneElement, "FitDragDropDragging") === true);
                    var draggableHoveringDropzone = (mouseXviewport > dropZoneX && mouseXviewport < (dropZoneX + dropzoneElement.offsetWidth) && mouseYviewport > dropZoneY && mouseYviewport < (dropZoneY + dropzoneElement.offsetHeight));

                    if ((dropzoneFound === false || dropzoneDeeperThanPreviouslyFound === true) && dropzoneCurrentlyBeingDragged === false && draggableHoveringDropzone === true)
                    {
                        dropzoneActive = dzState;
                    }
                });

                // Leave previously active dropzone if no longer active
                if (previouslyActiveDropzone !== null && dropzoneActive !== previouslyActiveDropzone)
                {
                    Fit.Dom.RemoveClass(previouslyActiveDropzone.Dropzone.GetElement(), "FitDragDropDropzoneActive");
                    Fit.DragDrop.Dropzone._internal.active = null;

                    if (previouslyActiveDropzone.OnLeave)
                        previouslyActiveDropzone.OnLeave(previouslyActiveDropzone.Dropzone);
                }

                // Mark dropzone active if not already done
                if (dropzoneActive !== null && dropzoneActive !== previouslyActiveDropzone)
                {
                    Fit.Dom.AddClass(dropzoneActive.Dropzone.GetElement(), "FitDragDropDropzoneActive");
                    Fit.DragDrop.Dropzone._internal.active = dropzoneActive;

                    if (dropzoneActive.OnEnter)
                        dropzoneActive.OnEnter(dropzoneActive.Dropzone);
                }
            });
        }
    }
    init();

    // Public

	/// <function container="Fit.DragDrop.Draggable" name="Reset" access="public">
	/// 	<description> Reset draggable to initial position </description>
	/// </function>
    this.Reset = function()
    {
        elm.style.position = "";
        elm.style.left = "";
        elm.style.top = "";
    }

	/// <function container="Fit.DragDrop.Draggable" name="GetElement" access="public" returns="DOMElement">
	/// 	<description> Get draggable DOM element </description>
	/// </function>
    this.GetElement = function()
    {
        return elm;
    }

    // Event handling
	// TODO: Allow multiple event handlers !!!

    /// <function container="Fit.DragDrop.Draggable" name="OnDragStart" access="public">
	/// 	<description> Add event handler which gets fired when dragging starts </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - draggable DOM element is passed to function </param>
	/// </function>
	this.OnDragStart = function(cb)
    {
        onDragStart = cb;
    }

	/// <function container="Fit.DragDrop.Draggable" name="OnDragging" access="public">
	/// 	<description> Add event handler which constantly gets fired when dragging takes place </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - draggable DOM element is passed to function </param>
	/// </function>
    this.OnDragging = function(cb)
    {
        onDragging = cb;
    }

    /// <function container="Fit.DragDrop.Draggable" name="OnDragStop" access="public">
	/// 	<description> Add event handler which gets fired when dragging stops </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - draggable DOM element is passed to function </param>
	/// </function>
	this.OnDragStop = function(cb)
    {
        onDragStop = cb;
    }
}
Fit.DragDrop.Draggable._internal =
{
    /* Shared */
    zIndex : 10000,
    mouseUpRegistered : false,
    mouseMoveRegistered : false,

    /* Draggable state object */
    active: null
}

// Dropzone

/// <function container="Fit.DragDrop.Dropzone" name="Dropzone" access="public">
/// 	<description> Constructor - create instance of Dropzone class </description>
/// 	<param name="domElm" type="DOMElement"> Element to turn into dropzone object </param>
/// </function>
Fit.DragDrop.Dropzone = function(domElm)
{
    var elm = domElm;

    var cfg =
    {
        Dropzone: this,
        OnEnter: null,
        OnDrop: null,
        OnLeave: null
    };

    function init()
    {
        Fit.Dom.AddClass(elm, "FitDragDropDropzone");
        Fit.DragDrop.Dropzone._internal.dropzones.push(cfg);
    }
    init();

	/// <function container="Fit.DragDrop.Dropzone" name="GetElement" access="public" returns="DOMElement">
	/// 	<description> Get dropzone DOM element </description>
	/// </function>
    this.GetElement = function()
    {
        return elm;
    }

	// Event handling
	// TODO: Allow multiple event handlers !!!

    /// <function container="Fit.DragDrop.Dropzone" name="OnEnter" access="public">
	/// 	<description> Add event handler which gets fired when draggable enters dropzone, ready to be dropped </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - instance of Dropzone is passed to function </param>
	/// </function>
	this.OnEnter = function(cb)
    {
        cfg.OnEnter = cb;
    }

    /// <function container="Fit.DragDrop.Dropzone" name="OnDrop" access="public">
	/// 	<description> Add event handler which gets fired when draggable is dropped on dropzone </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - instance of Dropzone and Draggable is passed to function (in that order) </param>
	/// </function>
	this.OnDrop = function(cb)
    {
        cfg.OnDrop = cb;
    }

	/// <function container="Fit.DragDrop.Dropzone" name="OnLeave" access="public">
	/// 	<description> Add event handler which gets fired when draggable leaves dropzone </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - instance of Dropzone is passed to function </param>
	/// </function>
    this.OnLeave = function(cb)
    {
        cfg.OnLeave = cb;
    }
}
Fit.DragDrop.Dropzone._internal =
{
    dropzones: [],
    active: null
}
/// <container name="Fit.Events">
/// 	Event handler functionality
/// </container>
Fit.Events = {};

/// <function container="Fit.Events" name="AddHandler" access="public" static="true">
/// 	<description> Registers handler for specified event on given EventTarget </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="eventFunction" type="function"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true">
/// 	<description> Registers handler for specified event on given EventTarget </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="useCapture" type="boolean">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="function"> JavaScript function to register </param>
/// </function>
Fit.Events.AddHandler = function()
{
	var element = null;
	var event = null;
	var useCapture = false; // false = event bubbling (reverse of event capturing)
	var eventFunction = null;

	if (arguments.length === 3)
	{
		element = arguments[0];
		event = arguments[1];
		eventFunction = arguments[2];
	}
	else if (arguments.length === 4)
	{
		element = arguments[0];
		event = arguments[1];
		useCapture = arguments[2];
		eventFunction = arguments[3];
	}

	Fit.Validation.ExpectEventTarget(element);
	Fit.Validation.ExpectStringValue(event);
	Fit.Validation.ExpectBoolean(useCapture);
	Fit.Validation.ExpectFunction(eventFunction);

	if (element.addEventListener) // W3C
		element.addEventListener(event, eventFunction, useCapture);
	else if (element.attachEvent) // IE
		element.attachEvent("on" + event, eventFunction);

	// Fire event function for onload event if document in window/iframe has already been loaded.
	// Notice that no event argument is passed to function since we don't have one.
	if (event.toLowerCase() === "load" && element.document && element.document.readyState === "complete")
		eventFunction();
}

/// <function container="Fit.Events" name="RemoveHandler" access="public" static="true">
/// 	<description> Remove event handler for specified event on given EventTarget </description>
/// 	<param name="element" type="DOMElement"> EventTarget (e.g. Window or DOMElement) from which event handler is removed </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="eventFunction" type="function"> JavaScript function to remove </param>
/// </function>
/// <function container="Fit.Events" name="RemoveHandler" access="public" static="true">
/// 	<description> Remove event handler for specified event on given EventTarget </description>
/// 	<param name="element" type="DOMElement"> EventTarget (e.g. Window or DOMElement) from which event handler is removed </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="useCapture" type="boolean">
/// 		Value indicating whether event handler was registered using event capturing (True) or event bubbling (False).
/// 	</param>
/// 	<param name="eventFunction" type="function"> JavaScript function to remove </param>
/// </function>
Fit.Events.RemoveHandler = function()
{
	var element = null;
	var event = null;
	var useCapture = false; // false = event bubbling (reverse of event capturing)
	var eventFunction = null;

	if (arguments.length === 3)
	{
		element = arguments[0];
		event = arguments[1];
		eventFunction = arguments[2];
	}
	else if (arguments.length === 4)
	{
		element = arguments[0];
		event = arguments[1];
		useCapture = arguments[2];
		eventFunction = arguments[3];
	}

	Fit.Validation.ExpectEventTarget(element);
	Fit.Validation.ExpectStringValue(event);
	Fit.Validation.ExpectBoolean(useCapture);
	Fit.Validation.ExpectFunction(eventFunction);

	if (element.removeEventListener)
		element.removeEventListener(event, eventFunction, useCapture);
	else if (element.detachEvent)
		element.detachEvent("on" + event, eventFunction);
}

/// <function container="Fit.Events" name="PreventDefault" access="public" static="true" returns="boolean">
/// 	<description> Prevent default behaviour triggered by given event - returns False </description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.PreventDefault = function(e)
{
	Fit.Validation.ExpectEvent(e, true);

	var ev = e || window.event;

	if ((ev.type === "click" || ev.type === "mousedown" || ev.type === "mouseup") && ev.button === 2) // Right click = suppress context menu
	{
		var preventContextMenu = Fit.Events.PreventDefault;

		Fit.Events.AddHandler(document, "contextmenu", true, preventContextMenu);
		Fit.Events.AddHandler(document, "contextmenu", preventContextMenu);

		setTimeout(function()
		{
			Fit.Events.RemoveHandler(document, "contextmenu", true, preventContextMenu);
			Fit.Events.RemoveHandler(document, "contextmenu", preventContextMenu);
		}, 0);
	}

	if (ev.preventDefault)
		ev.preventDefault();
	ev.returnValue = false;
	return false;
}

/// <function container="Fit.Events" name="StopPropagation" access="public" static="true" returns="boolean">
/// 	<description> Prevent given event from propagating (bubble up) - returns False </description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.StopPropagation = function(e)
{
	Fit.Validation.ExpectEvent(e, true);

	var ev = e || window.event;

	if (ev.StopPropagation)
		ev.StopPropagation();
	ev.cancelBubble = true;
	return false;
}

/// <function container="Fit.Events" name="Stop" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Completely suppress event which is equivalent of
/// 		calling both PreventDefault(e) and StopPropagation(e).
/// 		Returns False.
/// 	</description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.Stop = function(e) // e not validated, done by PreventDefault(..) and StopPropagation(..)
{
	Fit.Events.PreventDefault(e);
	Fit.Events.StopPropagation(e);
	return false;
}

/// <function container="Fit.Events" name="GetTarget" access="public" static="true" returns="DOMElement">
/// 	<description> Get a reference to the object that is affected by an event </description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.GetTarget = function(e)
{
	Fit.Validation.ExpectEvent(e, true);

	var ev = e || window.event;
	var target = ev.srcElement || ev.target;
	return (target ? target : null);
}

/// <function container="Fit.Events" name="GetEvent" access="public" static="true" returns="Event">
/// 	<description> Get event argument related to event just fired in a cross browser compatible manner </description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.GetEvent = function(e)
{
	Fit.Validation.ExpectEvent(e, true);
	return e || window.event;
}

/// <function container="Fit.Events" name="GetModifierKeys" access="public" static="true" returns="object">
/// 	<description>
/// 		Get object containing information about modifier keys currently being active.
/// 		Object contains the following properties which are True if the given key is being held down:
/// 		Shift, Ctrl, Alt, Meta (Cmd key on Mac OSX, Win key on Windows).
/// 	</description>
/// </function>
Fit.Events.GetModifierKeys = function()
{
	if (window.event && (window.event.type === "keypress" || window.event.type === "keydown" || window.event.type === "keyup")) // Make sure state is current on IE8 which does not support event capturing
	{
		Fit._internal.Events.KeysDown.Shift = window.event.shiftKey;
		Fit._internal.Events.KeysDown.Ctrl = window.event.ctrlKey;
		Fit._internal.Events.KeysDown.Alt = window.event.altKey;
		Fit._internal.Events.KeysDown.Meta = window.event.metaKey;
	}

	// Cloning to prevent external code from manipulating the object
	return Fit.Core.Clone(Fit._internal.Events.KeysDown);
}

/// <function container="Fit.Events" name="GetPointerState" access="public" static="true" returns="object">
/// 	<description>
/// 		Get object containing information about pointer.
/// 		Object contains the following properties:
/// 		Buttons.Primary/Secondary: Is True if given button is being held down
/// 		Coordinates.ViewPort.X/Y: Mouse coordinates within viewport
/// 		Coordinates.Document.X/Y: Mouse coordinates within document which may have been scrolled
/// 	</description>
/// </function>
Fit.Events.GetPointerState = function()
{
	if (window.event && (window.event.type === "click" || window.event.type === "mousedown" || window.event.type === "mouseup")) // Make sure state is current on IE8 which does not support event capturing
	{
		if ((Fit._internal.Events.Browser.Name === "MSIE" && Fit._internal.Events.Browser.Version === 8 && window.event.button === 1) || window.event.button === 0)
		{
			Fit._internal.Events.Mouse.Buttons.Primary = true;
			Fit._internal.Events.Mouse.Buttons.Secondary = false;
		}
		else if (window.event.button === 2)
		{
			Fit._internal.Events.Mouse.Buttons.Secondary = true;
			Fit._internal.Events.Mouse.Buttons.Primary = false;
		}
	}

	// Cloning to prevent external code from manipulating the object
	return Fit.Core.Clone(Fit._internal.Events.Mouse);
}

// ==============================================
// Internals
// ==============================================

Fit._internal.Events = {};
Fit._internal.Events.Browser = Fit.Browser.GetInfo();
Fit._internal.Events.KeysDown = { Shift: false, Ctrl: false, Alt: false, Meta: false, KeyDown: -1, KeyUp: -1 };
Fit._internal.Events.Mouse = { Buttons: { Primary: false, Secondary: false, Touch: false }, Coordinates: { ViewPort: { X: -1, Y: -1 }, Document: { X: -1, Y: -1 } } };
Fit._internal.Events.OnReadyHandlers = [];

// ==============================================
// Keyboard tracking
// ==============================================

// Using event capturing to make sure event is registered before target is reached.
// This is not supported by MSIE 8, but we solve this by updating the state when
// Fit.Events.GetModifierKeys() is invoked.

Fit.Events.AddHandler(document, "keydown", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	Fit._internal.Events.KeysDown.Shift = ev.shiftKey;
	Fit._internal.Events.KeysDown.Ctrl = ev.ctrlKey;
	Fit._internal.Events.KeysDown.Alt = ev.altKey;
	Fit._internal.Events.KeysDown.Meta = ev.metaKey;
	Fit._internal.Events.KeysDown.KeyUp = -1;
	Fit._internal.Events.KeysDown.KeyDown = ev.keyCode;
});
Fit.Events.AddHandler(document, "keyup", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	Fit._internal.Events.KeysDown.Shift = ev.shiftKey;
	Fit._internal.Events.KeysDown.Ctrl = ev.ctrlKey;
	Fit._internal.Events.KeysDown.Alt = ev.altKey;
	Fit._internal.Events.KeysDown.Meta = ev.metaKey;
	Fit._internal.Events.KeysDown.KeyUp = ev.keyCode;
	Fit._internal.Events.KeysDown.KeyDown = -1;
});

// ==============================================
// Mouse and touch tracking
// ==============================================

// Using event capturing to make sure event is registered before target is reached.
// This is not supported by MSIE 8, but we solve this by updating the state when
// Fit.Events.GetPointerState() is invoked.

// Notice that MouseUp is not fired when using the secondary mouse button (right click)
// if context menu is not suppressed. Therefore we always assume the secondary button
// is released when MouseDown or MouseUp is fired.
// And for consistency, we do the same for the primary button.
// Therefore, the primary and secondary buttons are never considered pressed or held down
// simultaneously.

// http://www.quirksmode.org/js/events_properties.html

Fit.Events.AddHandler(document, "mousedown", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	if ((Fit._internal.Events.Browser.Name === "MSIE" && Fit._internal.Events.Browser.Version === 8 && ev.button === 1) || ev.button === 0)
	{
		Fit._internal.Events.Mouse.Buttons.Primary = true;
		Fit._internal.Events.Mouse.Buttons.Secondary = false;
	}
	else if (ev.button === 2)
	{
		Fit._internal.Events.Mouse.Buttons.Secondary = true;
		Fit._internal.Events.Mouse.Buttons.Primary = false;
	}
});
Fit.Events.AddHandler(document, "mouseup", true, function(e)
{
	Fit._internal.Events.Mouse.Buttons.Primary = false;
	Fit._internal.Events.Mouse.Buttons.Secondary = false;
});
Fit.Events.AddHandler(document, "mouseout", true, function(e)
{
	Fit._internal.Events.Mouse.Buttons.Primary = false;
	Fit._internal.Events.Mouse.Buttons.Secondary = false;
});
Fit.Events.AddHandler(document, "mousemove", function(e)
{
	var ev = Fit.Events.GetEvent(e);

	if (document.body === null) // Not ready yet
		return;

	// Notice: Browser vendors are changing the way coordinates
	// and dimensions are reported. W3C previously define these as
	// integers/longs, but browsers are moving to floats for smoother
	// animation and scrolling, and for more accurate positioning.
	// https://code.google.com/p/chromium/issues/detail?id=323935
	// For consistency we use Math.floor to make sure integers are
	// always returned on both modern and legacy browsers.

	// Mouse position in viewport
	Fit._internal.Events.Mouse.Coordinates.ViewPort.X = Math.floor(ev.clientX);
	Fit._internal.Events.Mouse.Coordinates.ViewPort.Y = Math.floor(ev.clientY);

	// Mouse position in document which may have been scrolled
	var scrollPos = Fit.Dom.GetScrollPosition(document.body); // Object with integer values returned
	Fit._internal.Events.Mouse.Coordinates.Document.X = Fit._internal.Events.Mouse.Coordinates.ViewPort.X + scrollPos.X;
	Fit._internal.Events.Mouse.Coordinates.Document.Y = Fit._internal.Events.Mouse.Coordinates.ViewPort.Y + scrollPos.Y;
});
Fit.Events.AddHandler(document, "touchstart", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	Fit._internal.Events.Mouse.Buttons.Touch = true;

	// Touch position in viewport
	Fit._internal.Events.Mouse.Coordinates.ViewPort.X = Math.floor(ev.touches[0].clientX);
	Fit._internal.Events.Mouse.Coordinates.ViewPort.Y = Math.floor(ev.touches[0].clientY);

	// Touch position in document which may have been scrolled
	var scrollPos = Fit.Dom.GetScrollPosition(document.body); // Object with integer values returned
	Fit._internal.Events.Mouse.Coordinates.Document.X = Fit._internal.Events.Mouse.Coordinates.ViewPort.X + scrollPos.X;
	Fit._internal.Events.Mouse.Coordinates.Document.Y = Fit._internal.Events.Mouse.Coordinates.ViewPort.Y + scrollPos.Y;
});
Fit.Events.AddHandler(document, "touchend", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	Fit._internal.Events.Mouse.Buttons.Touch = false;

	/*Fit._internal.Events.Mouse.Coordinates.ViewPort.X = -1;
	Fit._internal.Events.Mouse.Coordinates.ViewPort.Y = -1;
	Fit._internal.Events.Mouse.Coordinates.Document.X = -1;
	Fit._internal.Events.Mouse.Coordinates.Document.Y = -1;*/
});
Fit.Events.AddHandler(document, "touchcancel", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	Fit._internal.Events.Mouse.Buttons.Touch = false;

	/*Fit._internal.Events.Mouse.Coordinates.ViewPort.X = -1;
	Fit._internal.Events.Mouse.Coordinates.ViewPort.Y = -1;
	Fit._internal.Events.Mouse.Coordinates.Document.X = -1;
	Fit._internal.Events.Mouse.Coordinates.Document.Y = -1;*/
});
Fit.Events.AddHandler(document, "touchmove", function(e)
{
	var ev = Fit.Events.GetEvent(e);

	// Touch position in viewport
	Fit._internal.Events.Mouse.Coordinates.ViewPort.X = Math.floor(ev.touches[0].clientX);
	Fit._internal.Events.Mouse.Coordinates.ViewPort.Y = Math.floor(ev.touches[0].clientY);

	// Touch position in document which may have been scrolled
	var scrollPos = Fit.Dom.GetScrollPosition(document.body); // Object with integer values returned
	Fit._internal.Events.Mouse.Coordinates.Document.X = Fit._internal.Events.Mouse.Coordinates.ViewPort.X + scrollPos.X;
	Fit._internal.Events.Mouse.Coordinates.Document.Y = Fit._internal.Events.Mouse.Coordinates.ViewPort.Y + scrollPos.Y;
});

// ==============================================
// Simple mutation tracking
// ==============================================

// This is a very simple substitution for native mutation observers,
// which unfortunately requires recent versions of some of the major
// browsers (e.g. IE 11, Safari 6 and Chrome on Android 4.4).

Fit._internal.Events.MutationObservers = [];
Fit._internal.Events.MutationObserverIds = -1;
Fit._internal.Events.MutationObserverIntervalId = -1;

/// <function container="Fit.Events" name="AddMutationObserver" access="public" static="true">
/// 	<description>
/// 		Registers mutation observer which is invoked when a DOMElement is updated. By default
/// 		only attributes are observed. Use deep flag to have children and character data observed too.
/// 		An observer ID is returned which can be used to remove mutation observer.
/// 		Important: Mutation observers should be removed when no longer needed for better performance!
/// 		To remove an observer from within the observer function itself, simply call disconnect().
/// 	</description>
/// 	<param name="elm" type="DOMElement"> DOMElement to observe </param>
/// 	<param name="obs" type="function"> JavaScript observer function to register - receives reference to DOMElement being observed when updated </param>
/// 	<param name="deep" type="boolean" default="false"> Flag indicating whether to check for modifications within element (children and character data) - this could potentially be expensive </param>
/// </function>
Fit.Events.AddMutationObserver = function(elm, obs, deep)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectFunction(obs);
	Fit.Validation.ExpectBoolean(deep, true);

	// Configure event handlers responsible for triggering mutation check

	if (Fit._internal.Events.MutationObservers.length === 0)
	{
		Fit.Events.AddHandler(document, "click", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "mousedown", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "mouseup", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "keypress", Fit._internal.Events.CheckMutations); // Not using keydown, it fires continuously
		Fit.Events.AddHandler(document, "keyup", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "touchstart", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "touchend", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "touchcancel", Fit._internal.Events.CheckMutations);
		Fit._internal.Events.MutationObserverIntervalId = setInterval(Fit._internal.Events.CheckMutations, 1000);
	}

	// Add mutation observer

	var hashCode = 0;
	var dimensions = elm.offsetWidth + "x" + elm.offsetHeight;

	if (deep === true)
	{
		hashCode = Fit.String.Hash(elm.outerHTML + dimensions);
	}
	else
	{
		var clone = elm.cloneNode(false);
		hashCode = Fit.String.Hash(clone.outerHTML + dimensions)
	}

	Fit._internal.Events.MutationObserverIds++;
	Fit.Array.Add(Fit._internal.Events.MutationObservers, { Element: elm, Observer: obs, Hash: hashCode, Deep: (deep === true), Id: Fit._internal.Events.MutationObserverIds });

	return Fit._internal.Events.MutationObserverIds;
}

/// <function container="Fit.Events" name="RemoveMutationObserver" access="public" static="true">
/// 	<description> Remove mutation observer </description>
/// 	<param name="elm" type="DOMElement"> DOMElement being observed </param>
/// 	<param name="obs" type="function"> JavaScript observer function to remove </param>
/// 	<param name="deep" type="boolean" default="undefined"> If defined, observer must have been registered with the same deep value to be removed </param>
/// </function>
/// <function container="Fit.Events" name="RemoveMutationObserver" access="public" static="true">
/// 	<description> Remove mutation observer by ID </description>
/// 	<param name="id" type="integer"> Observer ID returned from AddMutationObserver(..) function </param>
/// </function>
Fit.Events.RemoveMutationObserver = function()
{
	var elm, obs, deep, id = undefined;

	if (arguments.length > 1)
	{
		elm = arguments[0];
		obs = arguments[1];
		deep = arguments[2];

		Fit.Validation.ExpectDomElement(elm);
		Fit.Validation.ExpectFunction(obs);
		Fit.Validation.ExpectBoolean(deep, true);
	}
	else
	{
		id = arguments[0];

		Fit.Validation.ExpectInteger(id);
	}

	var found = null;

	Fit.Array.ForEach(Fit._internal.Events.MutationObservers, function(mo)
	{
		if ((Fit.Validation.IsSet(id) === true && mo.Id === id) || (mo.Element === elm && mo.Observer === obs && mo.Deep === ((Fit.Validation.IsSet(deep) === true) ? deep : false)))
		{
			found = mo;
			return false; // Break loop
		}
	});

	if (found !== null)
		Fit.Array.Remove(Fit._internal.Events.MutationObservers, found);

	// Remove event handlers if all mutation observers have been removed

	if (Fit._internal.Events.MutationObservers.length === 0)
	{
		Fit.Events.RemoveHandler(document, "click", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "mousedown", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "mouseup", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "keypress", Fit._internal.Events.CheckMutations); // Not using keydown, it fires continuously
		Fit.Events.RemoveHandler(document, "keyup", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "touchstart", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "touchend", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "touchcancel", Fit._internal.Events.CheckMutations);
		clearInterval(Fit._internal.Events.MutationObserverIntervalId);
	}
}

Fit._internal.Events.CheckMutations = function()
{
	var toRemove = [];

	Fit.Array.ForEach(Fit._internal.Events.MutationObservers, function(mo)
	{
		var newHash = 0;
		var dimensions = mo.Element.offsetWidth + "x" + mo.Element.offsetHeight;

		if (mo.Deep === true)
		{
			newHash = Fit.String.Hash(mo.Element.outerHTML + dimensions);
		}
		else
		{
			var clone = mo.Element.cloneNode(false);
			newHash = Fit.String.Hash(clone.outerHTML + dimensions)
		}

		if (mo.Hash !== newHash)
		{
			// Element has mutated

			mo.Hash = newHash;

			// Create global disconnect function allowing observer to remove itself by simply invoking disconnect()

			var orgDisconnect = window.disconnect;
			window.disconnect = function() { Fit.Array.Add(toRemove, mo); };

			// Call observer

			var error = null;

			try
			{
				mo.Observer(mo.Element);
			}
			catch (err)
			{
				error = err;
			}

			// Remove global disconnect function

			if (orgDisconnect)
			{
				window.disconnect = orgDisconnect;
			}
			else
			{
				try
				{
					delete window.disconnect; // Fails in IE8 with "Object doesn't support this action"
				}
				catch (err)
				{
					window.disconnect = undefined;
				}
			}

			// Re-throw error if observer failed

			if (error !== null)
				Fit.Validation.Throw(error);
		}
	});

	Fit.Array.ForEach(toRemove, function(mo)
	{
		Fit.Events.RemoveMutationObserver(mo.Element, mo.Observer, mo.Deep);
	});
}

// ==============================================
// OnReady handling
// ==============================================

/// <function container="Fit.Events" name="OnReady" access="public" static="true">
/// 	<description> Registers OnReady handler which gets fired when document is ready, or if it is already ready </description>
/// 	<param name="callback" type="function"> JavaScript function to register </param>
/// </function>
Fit.Events.OnReady = function(callback)
{
	Fit.Validation.ExpectFunction(callback);

	if (Fit._internal.Events.OnReadyFired === true)
	{
		callback();
	}
	else
	{
		Fit._internal.Events.OnReadyHandlers.push(callback);
	}
}

Fit.Events.AddHandler(window, "load", function()
{
	Fit._internal.Events.OnReadyFired = true;

	Fit.Array.ForEach(Fit._internal.Events.OnReadyHandlers, function(handler)
	{
		handler();
	});

	Fit.Array.Clear(Fit._internal.Events.OnReadyHandlers);
});
Fit.Http = {};

// Use http://www.jsontest.com for testing

/// <container name="Fit.Http.Request">
/// 	Asynchronous HTTP request functionality (AJAX/WebService).
///
/// 	// Example code
///
/// 	var http = new Fit.Http.Request(&quot;CreateUser.php&quot;);
///
/// 	http.SetData(&quot;username=Jack&amp;password=Secret&quot;);
/// 	http.SetStateListener(function()
/// 	{
/// 		&#160;&#160;&#160;&#160; if (http.GetCurrentState() === 4 &amp;&amp; http.GetHttpStatus() === 200)
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; alert(&quot;User created - server said: &quot; + http.GetResponseText());
/// 	});
///
/// 	http.Start();
/// </container>

/// <function container="Fit.Http.Request" name="Request" access="public">
/// 	<description> Constructor - creates instance of Request class </description>
/// 	<param name="uri" type="string"> URL to request </param>
/// </function>
Fit.Http.Request = function(uri)
{
	/*
	// Test case
	req = new Fit.Http.Request("./post.php");
	req.AddData("Name", "Jimmy");
	req.AddData("Age", "31");
	req.AddData("Gender", "Male");
	req.SetStateListener(function(r) { console.log("State listener", r, r.GetCurrentState(), r.GetHttpStatus()); });
	req.OnStateChange(function(r) { console.log("OnStateChange ", r, r.GetCurrentState(), r.GetHttpStatus()); });
	req.OnSuccess(function(r) { console.log("OnSuccess ", r, r.GetResponseText()); });
	req.OnSuccess(function(r) { console.log("Finally done!"); });
	req.OnFailure(function(r) { console.log("OnFailure ", r, r.GetHttpStatus()); });
	req.Start();*/

	Fit.Validation.ExpectStringValue(uri);

	var me = this;
	var url = uri;
	var httpRequest = getHttpRequestObject();
	var customHeaders = {};
	var data = "";
	var method = "";

	var onStateChange = [];
	var onRequestHandlers = [];
	var onSuccessHandlers = [];
	var onFailureHandlers = [];
	var onAbortHandlers = [];

	// Init

	httpRequest.onreadystatechange = function()
	{
		Fit.Array.ForEach(onStateChange, function(handler)
		{
			handler(me);
		});

		if (httpRequest.readyState === 4)
		{
			if (httpRequest.status === 0)
			{
				Fit.Array.ForEach(onAbortHandlers, function(handler) { handler(me); });
			}
			else if (httpRequest.status === 200)
			{
				Fit.Array.ForEach(onSuccessHandlers, function(handler) { handler(me); });
			}
			else
			{
				Fit.Array.ForEach(onFailureHandlers, function(handler) { handler(me); });
			}
		}
	}

	// Public

	/// <function container="Fit.Http.Request" name="AddHeader" access="public">
	/// 	<description>
	/// 		Add header to request.
	/// 		Manually adding headers will prevent the Request instance from
	/// 		manipulating headers. This is done to provide full control with the headers.
	/// 		You will in this case most likely need to add the following header for a POST request:
	/// 		Content-type : application/x-www-form-urlencoded
	/// 	</description>
	/// 	<param name="key" type="string"> Header key </param>
	/// 	<param name="value" type="string"> Header value </param>
	/// </function>
	this.AddHeader = function(key, value)
	{
		Fit.Validation.ExpectStringValue(key);
		Fit.Validation.ExpectString(value);
		customHeaders[key] = value;
	}

	/// <function container="Fit.Http.Request" name="SetData" access="public">
	/// 	<description> Set data to post - this will change the request method from GET to POST </description>
	/// 	<param name="dataStr" type="string"> Data to send </param>
	/// </function>
	this.SetData = function(dataStr)
	{
		Fit.Validation.ExpectString(dataStr, true);
		data = ((Fit.Validation.IsSet(dataStr) === true) ? dataStr : "");
	}

	/// <function container="Fit.Http.Request" name="GetData" access="public" returns="string">
	/// 	<description> Get data set to be posted </description>
	/// </function>
	this.GetData = function()
	{
		return data;
	}

	/// <function container="Fit.Http.Request" name="AddData" access="public">
	/// 	<description> Add data to post - this will change the request method from GET to POST </description>
	/// 	<param name="key" type="string"> Data key </param>
	/// 	<param name="value" type="string"> Data value </param>
	/// 	<param name="uriEncode" type="boolean" default="true">
	/// 		Set False to prevent value from being URI encoded to preserve special characters
	/// 	</param>
	/// </function>
	this.AddData = function(key, value, uriEncode)
	{
		Fit.Validation.ExpectStringValue(key);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(uriEncode, true);

		data += ((data !== "") ? "&" : "") + key + "=" + ((uriEncode === false) ? value : encodeURIComponent(value).replace(/%20/g, "+"));
	}

	this.Method = function(val)
	{
		Fit.Validation.ExpectString(val);

		if (Fit.Validation.IsSet(val) === true)
		{
			method = val;
		}

		return method;
	}

	this.Url = function(val)
	{
		Fit.Validation.ExpectStringValue(val);

		if (Fit.Validation.IsSet(val) === true)
		{
			url = val;
		}

		return url;
	}

	/// <function container="Fit.Http.Request" name="Start" access="public">
	/// 	<description>
	/// 		Invoke request. An asynchroneus request is performed if an
	/// 		OnStateChange, OnSuccess, or OnFailure event handler has been set.
	/// 		If no event handlers have been set, a synchronous request will be performed,
	/// 		causing the client to wait (and freeze) until data is received.
	/// 	</description>
	/// </function>
	this.Start = function()
	{
		// Fire OnRequest

		var cancel = false;

		Fit.Array.ForEach(onRequestHandlers, function(handler)
		{
			if (handler(me) === false)
				cancel = true;
		});

		if (cancel === true)
			return;

		// Perform request

		var httpMethod = (method ? method : (data ? "POST" : "GET"));
		var async = (onStateChange.length > 0 || onSuccessHandlers.length > 0 || onFailureHandlers.length > 0);
		httpRequest.open(httpMethod, url, async);

		var usingCustomHeaders = false;
		for (var header in customHeaders)
		{
			httpRequest.setRequestHeader(header, customHeaders[header]);
			usingCustomHeaders = true;
		}

		if (httpMethod !== "GET" && httpMethod !== "HEAD" && usingCustomHeaders === false) // https://www.w3.org/Protocols/rfc2616/rfc2616-sec7.html#sec7.2.1
			httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		httpRequest.send(data);
	}

	/// <function container="Fit.Http.Request" name="Abort" access="public">
	/// 	<description> Abort asynchroneus request </description>
	/// </function>
	this.Abort = function()
	{
		httpRequest.abort();
	}

	/// <function container="Fit.Http.Request" name="GetResponseXml" access="public" returns="Document">
	/// 	<description>
	/// 		Returns result from request as XML or HTML document.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 200 (request successful).
	/// 	</description>
	/// </function>
	this.GetResponseXml = function()
	{
		return httpRequest.responseXML;
	}

	/// <function container="Fit.Http.Request" name="GetResponseText" access="public" returns="string">
	/// 	<description>
	/// 		Returns text result from request.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 200 (request successful).
	/// 	</description>
	/// </function>
	this.GetResponseText = function()
	{
		return httpRequest.responseText;
	}

	/// <function container="Fit.Http.Request" name="GetResponseJson" access="public" returns="object">
	/// 	<description>
	/// 		Returns result from request as JSON object, Null if no response was returned.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 200 (request successful).
	/// 	</description>
	/// </function>
	this.GetResponseJson = function()
	{
		return ((httpRequest.responseText !== "") ? JSON.parse(httpRequest.responseText) : null);
	}

	/// <function container="Fit.Http.Request" name="GetCurrentState" access="public" returns="integer">
	/// 	<description>
	/// 		Get current request state.
	/// 		0 = Unsent
	/// 		1 = Opened
	/// 		2 = Headers received
	/// 		3 = Loading
	/// 		4 = Done (response is ready for processing)
	/// 	</description>
	/// </function>
	this.GetCurrentState = function() // 0 = unsent, 1 = opened, 2 = headers received, 3 = loading, 4 = done
	{
		return httpRequest.readyState;
	}

	/// <function container="Fit.Http.Request" name="GetHttpStatus" access="public" returns="integer">
	/// 	<description>
	/// 		Returns HTTP status. Common return values are:
	/// 		200 = OK (successful request)
	/// 		304 = Forbidden (access denied)
	/// 		404 = Not found
	/// 		408 = Request time out
	/// 		500 = Internal server error
	/// 		503 = Service unavailable
	/// 	</description>
	/// </function>
	this.GetHttpStatus = function()
	{
		return httpRequest.status;
	}

	// Events

	/// <function container="Fit.Http.Request" name="OnStateChange" access="public">
	/// 	<description>
	/// 		Add function to invoke when request state is changed.
	/// 		Use GetCurrentState() to read the state at the given time.
	/// 	</description>
	/// 	<param name="func" type="function">
	/// 		JavaScript function invoked when state changes.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnStateChange = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onStateChange, func);
	}

	this.SetStateListener = this.OnStateChange; // Backward compatibility

	/// <function container="Fit.Http.Request" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add function to invoke when request is initiated.
	/// 		Request can be canceled by returning False.
	/// 	</description>
	/// 	<param name="func" type="function">
	/// 		JavaScript function invoked when request is initiated.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnRequest = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onRequestHandlers, func);
	}

	/// <function container="Fit.Http.Request" name="OnSuccess" access="public">
	/// 	<description> Add function to invoke when request is successful </description>
	/// 	<param name="func" type="function">
	/// 		JavaScript function invoked when request finished successfully.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnSuccess = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onSuccessHandlers, func);
	}

	/// <function container="Fit.Http.Request" name="OnFailure" access="public">
	/// 	<description> Add function to invoke when request is unsuccessful </description>
	/// 	<param name="func" type="function">
	/// 		JavaScript function invoked when request finished, but not successfully.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnFailure = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onFailureHandlers, func);
	}

	/// <function container="Fit.Http.Request" name="OnAbort" access="public">
	/// 	<description> Add function to invoke when request is canceled </description>
	/// 	<param name="func" type="function">
	/// 		JavaScript function invoked when request is canceled.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnAbort = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onAbortHandlers, func);
	}

	// Private

	function getHttpRequestObject()
	{
		if (window.XMLHttpRequest) // Firefox, IE7, Chrome, Opera, Safari
			return new XMLHttpRequest();
		else if (window.ActiveXObject) // IE5, IE6
			return new ActiveXObject("Microsoft.XMLHTTP");

		throw new Error("Http Request object not supported");
	}
}

/// <container name="Fit.Http.JsonRequest">
/// 	Asynchronous HTTP request functionality (AJAX/WebService)
/// 	optimized for exchanging data with the server in JSON format.
/// 	Extending from Fit.Http.Request.
///
/// 	// Example code
///
/// 	var http = new Fit.Http.JsonRequest(&quot;WebService.asmx/AddUser&quot;);
///
/// 	http.SetData({ Username: &quot;Jack&quot;, Password: &quot;Secret&quot; });
/// 	http.OnSuccess(function(sender)
/// 	{
/// 		&#160;&#160;&#160;&#160; var json = http.GetResponseJson();
/// 		&#160;&#160;&#160;&#160; alert(&quot;User created - server response: &quot; + json.Message);
/// 	});
///
/// 	http.Start();
/// </container>

/// <function container="Fit.Http.JsonRequest" name="JsonRequest" access="public">
/// 	<description>
/// 		Constructor - creates instance of JSON Request class.
/// 	</description>
/// 	<param name="url" type="string">
/// 		URL to request, e.g.
/// 		http://server/_layouts/15/Company/MyWebService.asmx/MyMethod
/// 	</param>
/// </function>
Fit.Http.JsonRequest = function(url)
{
	Fit.Validation.ExpectStringValue(url);
	Fit.Core.Extend(this, Fit.Http.Request).Apply(url);

	var me = this;
	var data = null;

	function init()
	{
		me.AddHeader("Content-Type", "application/json; charset=UTF-8");
		me.AddHeader("X-Requested-With", "XMLHttpRequest");
	}

	/// <function container="Fit.Http.JsonRequest" name="SetData" access="public">
	/// 	<description> Set JSON data to post - this will change the request method from GET to POST </description>
	/// 	<param name="json" type="object"> Data to send </param>
	/// </function>
	var baseSetData = me.SetData;
	this.SetData = function(json) // JSON
	{
		Fit.Validation.ExpectIsSet(json);
		data = json;
		baseSetData(JSON.stringify(data));
	}

	/// <function container="Fit.Http.JsonRequest" name="GetData" access="public" returns="object">
	/// 	<description> Get JSON data set to be posted </description>
	/// </function>
	this.GetData = function(dataStr)
	{
		return data;
	}

	this.Start = Fit.Core.CreateOverride(this.Start, function()
	{
		baseSetData(JSON.stringify(data)); // In case external code manipulated data without calling SetData(json) - example: req.GetData().Xyz = newValue;
		base();
	});

	this.AddData = function(key, value, uriEncode)
	{
		Fit.Validation.ThrowError("Use SetData(..) to set JSON request data for JSON WebService");
	}

	/// <function container="Fit.Http.JsonRequest" name="GetResponseJson" access="public" returns="object">
	/// 	<description>
	/// 		Returns result from request as JSON object, Null if no response was returned.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 200 (request successful).
	/// 		Notice: .NET usually wraps data in a .d property. Data is automatically extracted
	/// 		from this property, hence contained data is returned as the root object.
	/// 	</description>
	/// </function>
	var baseGetResponseJson = me.GetResponseJson;
	this.GetResponseJson = function()
	{
		var resp = baseGetResponseJson();

		if (url.toLowerCase().indexOf(".asmx/") !== -1 && resp && resp.d)
			resp = resp.d; // Extract .NET response data

		return resp;
	}

	init();
}

/// <container name="Fit.Http.DotNetJsonRequest">
/// 	Backward compatibility class - use Fit.Http.JsonRequest instead
/// </container>
Fit.Http.DotNetJsonRequest = Fit.Http.JsonRequest;

Fit.Http.JsonpRequest = function(url, jsonpCallbackName)
{
	Fit.Validation.ExpectStringValue(url);
	Fit.Validation.ExpectStringValue(jsonpCallbackName);

	var me = this;
	var cbKey = jsonpCallbackName;
	var data = {};
	var timeout = 30000;
	var timer = -1;

	var onRequestHandlers = [];
	var onSuccessHandlers = [];
	var onTimeoutHandlers = [];

	this.Callback = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			cbKey = val;
		}

		return cbKey;
	}

	this.Timeout = function(val)
	{
		Fit.Validation.ExpectInteger(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			timeout = val;
		}

		return timeout;
	}

	this.SetParameter = function(key, value, uriEncode)
	{
		Fit.Validation.ExpectStringValue(key);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(uriEncode, true);

		data[key] = ((uriEncode === false) ? value : encodeURIComponent(value).replace(/%20/g, "+"));
	}

	this.RemoveParameter = function(key)
	{
		Fit.Validation.ExpectStringValue(key);
		delete data[key];
	}

	this.GetParameter = function(key)
	{
		Fit.Validation.ExpectStringValue(key);

		var val = data[key];
		return ((val !== undefined) ? val : null);
	}

	this.GetParameters = function()
	{
		var keys = [];

		Fit.Array.ForEach(data, function(key)
		{
			Fit.Array.Add(keys, key);
		});

		return keys;
	}

	this.Start = function()
	{
		// Fire OnRequest handlers

		fireEvent(onRequestHandlers);

		// Configure callback

		var cbParam = cbKey;
		var cbId = "CB" + Fit.Data.CreateGuid(false);
		var cbName = "Fit.Http.JsonpRequest._internal.Callbacks." + cbId;

		Fit.Http.JsonpRequest._internal.Callbacks[cbId] = function(response)
		{
			clearTimeout(timer);
			timer = -1;

			fireEvent(onSuccessHandlers, response);
			delete Fit.Http.JsonpRequest._internal.Callbacks[cbId];
		}

		// Configure timeout

		timer = setTimeout(function()
		{
			// Prevent OnSuccess handlers from executing if data is received after timeout is reached.
			// NOTICE: Do not remove callback - it would cause a JavaScript error if the situation described above occures.
			Fit.Http.JsonpRequest._internal.Callbacks[cbId] = function(response) { };

			fireEvent(onTimeoutHandlers);

		}, timeout);

		// Construct URL

		var newUrl = url;
		newUrl += ((newUrl.indexOf("?") === -1) ? "?" : "&") + cbParam + "=" + cbName;

		Fit.Array.ForEach(data, function(key)
		{
			newUrl += "&" + key + "=" + data[key];
		});

		// Inject script

		var script = document.createElement("script");
		script.type = "text/javascript";

		/*if (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() <= 8)
		{
			script.onreadystatechange = function()
			{
				if (this.readyState === "complete" || this.readyState === "loaded") // loaded = initial load, complete = from cache
					callback(src);
			}
		}
		else
		{
			script.onload = function() { callback(src); };
			script.onerror = function() { callback(src); }; // Terrible, but we need same behaviour for all browsers, and IE8 (and below) does not distinguish between success and failure
		}*/

		script.src = newUrl;
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	// Events

	this.OnRequest = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onRequestHandlers, func);
	}

	/// <function container="Fit.Http.Request" name="OnSuccess" access="public">
	/// 	<description> Add function to invoke when request is successful </description>
	/// 	<param name="func" type="function">
	/// 		JavaScript function invoked when request finished successfully.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnSuccess = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onSuccessHandlers, func);
	}

	/// <function container="Fit.Http.Request" name="OnFailure" access="public">
	/// 	<description> Add function to invoke when request is unsuccessful </description>
	/// 	<param name="func" type="function">
	/// 		JavaScript function invoked when request finished, but not successfully.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnTimeout = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onTimeoutHandlers, func);
	}

	function fireEvent(handlers, response)
	{
		Fit.Array.ForEach(handlers, function(handler)
		{
			if (response)
				handler(response);
			else
				handler();
		});
	}
}
Fit.Http.JsonpRequest._internal = {};
Fit.Http.JsonpRequest._internal.Callbacks = {};
Fit.Language = {};
Fit.Language.Translations = {};

// Simply override translation object to change language

// ControlBase
Fit.Language.Translations.Required = "Field is required";

// DropDown
Fit.Language.Translations.InvalidSelection = "Invalid selection";

// FilePicker
Fit.Language.Translations.SelectFile = "Select file";
Fit.Language.Translations.SelectFiles = "Select file(s)";

// Dialog
Fit.Language.Translations.Ok = "OK";
Fit.Language.Translations.Cancel = "Cancel";
// The order of processing scripts and stylesheets:
// http://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#The_order_of_processing_scripts_and_style_sheets

/// <container name="Fit.Loader">
/// 	Loader is a useful mechanism for loading styleheets and JavaScript on demand in a non blocking manner.
/// </container>
Fit.Loader = {};

/// <function container="Fit.Loader" name="LoadScript" access="public" static="true">
/// 	<description>
/// 		Load client script on demand in a non-blocking manner.
///
/// 		// Example of loading a JavaScript file
///
/// 		Fit.Loader.LoadScript(&quot;extensions/test/test.js&quot;, function(src)
/// 		{
/// 			&#160;&#160;&#160;&#160; alert(&quot;JavaScript &quot; + src + &quot; loaded and ready to be used!&quot;);
/// 		});
/// 	</description>
/// 	<param name="src" type="string"> Script source (path or URL) </param>
/// 	<param name="callback" type="function" default="undefined">
/// 		Callback function fired when script loading is complete - takes the script source requested as an argument.
/// 		Be aware that a load error will also trigger the callback to make sure control is always returned.
/// 		Consider using feature detection within callback function for super reliable execution - example:
/// 		if (expectedObjectOrFunction) { /* Successfully loaded, continue.. */ }
/// 	</param>
/// </function>
Fit.Loader.LoadScript = function(src, callback)
{
	Fit.Validation.ExpectStringValue(src);
	Fit.Validation.ExpectFunction(callback, true);

	var script = document.createElement("script");
	script.type = "text/javascript";

	if (Fit.Validation.IsSet(callback) === true && (Fit.Browser.GetBrowser() !== "MSIE" || (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() >= 9)))
	{
		script.onload = function() { callback(src); };

		// Terrible, but we need same behaviour for all browsers, and IE8 (and below) does not distinguish between success and failure.
		// Also, we need to make sure control is returned no matter what - just like using ordinary <script src=".."> elements which
		// doesn't halt execution on 404 or syntax errors.
		script.onerror = function() { callback(src); };
	}
	else if (Fit.Validation.IsSet(callback) === true && Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() <= 8)
	{
		script.onreadystatechange = function()
		{
			if (this.readyState === "complete" || this.readyState === "loaded") // loaded = initial load, complete = from cache
				callback(src);
		}
	}

	script.src = src;
	document.getElementsByTagName("head")[0].appendChild(script);
}

/// <function container="Fit.Loader" name="LoadScripts" access="public" static="true">
/// 	<description>
/// 		Chain load multiple client scripts on demand in a non-blocking manner.
///
/// 		// Example of loading multiple JavaScript files in serial:
///
/// 		Fit.Loader.LoadScripts(
/// 		[
/// 			&#160;&#160;&#160;&#160; {
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;extensions/test/menu.js&quot;,
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;JavaScript &quot; + cfg.source + &quot; loaded&quot;); }
/// 			&#160;&#160;&#160;&#160; },
/// 			&#160;&#160;&#160;&#160; {
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;http://cdn.domain.com/chat.js&quot;,
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;JavaScript &quot; + cfg.source + &quot; loaded&quot;); }
/// 			&#160;&#160;&#160;&#160; }
/// 		],
/// 		function(cfgs)
/// 		{
/// 			&#160;&#160;&#160;&#160; alert(&quot;All files loaded&quot;);
/// 		});
///
/// 		First argument is an array of script configurations:
/// 		source:string (required): Script source (path or URL)
/// 		loaded:function (optional): Callback function to execute when file has loaded (takes file configuration as argument)
/// 		Be aware that loaded callback is invoked even if a load error occures, to make sure control is returned to your code.
///
/// 		Second argument is the callback function fired when all files have finished loading - takes configuration array as argument.
/// 		This too may be invoked even if a load error occured, to make sure control is returned to your code.
///
/// 		Consider using feature detection within callback functions for super reliable execution - example:
/// 		if (expectedObjectOrFunction) { /* Successfully loaded, continue.. */ }
/// 	</description>
/// 	<param name="cfg" type="array"> Configuration array (see function description for details) </param>
/// 	<param name="callback" type="function" default="undefined"> Callback function fired when all scripts have finished loading (see function description for details) </param>
/// </function>
Fit.Loader.LoadScripts = function(cfg, callback, skipValidation)
{
	Fit.Validation.ExpectArray(cfg);
	Fit.Validation.ExpectFunction(callback, true);
	Fit.Validation.ExpectBoolean(skipValidation, true);

	// Verify configuration

	if (skipValidation !== true)
	{
		for (var i = 0 ; i < cfg.length ; i++)
		{
			Fit.Validation.ExpectStringValue(cfg[i].source);
			Fit.Validation.ExpectFunction(cfg[i].loaded, true);
		}
	}

	// Find next unhandled script to load

	var toLoad = null;

	for (var i = 0 ; i < cfg.length ; i++)
	{
		if (cfg[i].handled !== true)
		{
			toLoad = cfg[i];
			break;
		}
	}

	// Break out if no more scripts need handling

	if (toLoad === null)
	{
		if (Fit.Validation.IsSet(callback) === true)
			callback(cfg);

		return;
	}

	// Load script

	toLoad.handled = true;

	Fit.Loader.LoadScript(toLoad.source, function()
	{
		if (Fit.Validation.IsSet(toLoad.loaded) === true)
		{
			try // Use try/catch to prevent buggy code from stopping the chain
			{
				toLoad.loaded(toLoad);
			}
			catch (err)
			{
				if (window.console)
				{
					console.log(err.message);
					console.log(err.stack);
					console.log(err);
				}
			}
		}

		// Continue chain - load next script from configuration

		Fit.Loader.LoadScripts(cfg, callback, true);
	});
}

/// <function container="Fit.Loader" name="LoadStyleSheet" access="public" static="true">
/// 	<description>
/// 		Load CSS stylesheet on demand in a non-blocking manner.
/// 		It is recommended to load stylesheets before rendering items using
/// 		the CSS classes to avoid FOUC (Flash Of Unstyled Content).
///
/// 		// Example of loading a CSS file
///
/// 		Fit.Loader.LoadStyleSheet(&quot;extensions/test/layout.css&quot;, function(src)
/// 		{
/// 			&#160;&#160;&#160;&#160; alert(&quot;CSS file &quot; + src + &quot; loaded!&quot;);
/// 		});
/// 	</description>
/// 	<param name="src" type="string"> CSS file source (path or URL) </param>
/// 	<param name="callback" type="function" default="undefined">
/// 		Callback function fired when CSS file loading is complete - takes the file source requested as an argument.
/// 		Be aware that a load error will also trigger the callback to make sure control is always returned.
/// 	</param>
/// </function>
Fit.Loader.LoadStyleSheet = function(src, callback)
{
	Fit.Validation.ExpectStringValue(src);
	Fit.Validation.ExpectFunction(callback, true);

	// OnError event could likely be supported using the following
	// lines of code which allows us to check the number of loaded CSS rules:
	// W3C browsers: var success = (cssLinkNode.sheet.cssRules.length > 0);
	// Internet Explorer: var success = (cssLinkNode.styleSheet.rules.length > 0);
	// For consistency this approach is not currently being used - we need same
	// behaviour for both LoadStyleSheet(..), and LoadScript(..) which doesn't support OnError.

	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";

	if (Fit.Validation.IsSet(callback) === true && (Fit.Browser.GetBrowser() !== "MSIE" || (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() >= 9)))
	{
		link.onload = function() { callback(src); };
		link.onerror = function() { callback(src); }; // Same behaviour as LoadScript(..)
	}
	else if (Fit.Validation.IsSet(callback) === true && Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() <= 8)
	{
		link.onreadystatechange = function()
		{
			if (this.readyState === "complete" || this.readyState === "loaded") // loaded = initial load, complete = from cache
				callback(src);
		}
	}

	link.href = src;
	document.getElementsByTagName("head")[0].appendChild(link);
}

/// <function container="Fit.Loader" name="LoadStyleSheets" access="public" static="true">
/// 	<description>
/// 		Load multiple stylesheets in parrallel in a non-blocking manner.
///
/// 		// Example of loading multiple CSS files:
///
/// 		Fit.Loader.LoadStyleSheets(
/// 		[
/// 			&#160;&#160;&#160;&#160; {
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;extensions/test/menu.css&quot;,
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;Stylesheet &quot; + cfg.source + &quot; loaded&quot;); }
/// 			&#160;&#160;&#160;&#160; },
/// 			&#160;&#160;&#160;&#160; {
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;http://cdn.domain.com/chat.css&quot;,
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;Stylesheet &quot; + cfg.source + &quot; loaded&quot;); }
/// 			&#160;&#160;&#160;&#160; }
/// 		],
/// 		function(cfgs)
/// 		{
/// 			&#160;&#160;&#160;&#160; alert(&quot;All stylesheets loaded&quot;);
/// 		});
///
/// 		First argument is an array of stylesheet configurations:
/// 		source:string (required): Stylesheet source (path or URL)
/// 		loaded:function (optional): Callback function to execute when stylesheet has loaded (takes stylesheet configuration as argument)
/// 		Be aware that loaded callback is invoked even if a load error occures, to make sure control is returned to your code.
///
/// 		Second argument is the callback function fired when all stylesheets have finished loading - takes configuration array as argument.
/// 		This too may be invoked even if a load error occured, to make sure control is returned to your code.
/// 	</description>
/// 	<param name="cfg" type="array"> Configuration array (see function description for details) </param>
/// 	<param name="callback" type="function" default="undefined"> Callback function fired when all stylesheets have finished loading (see function description for details) </param>
/// </function>
Fit.Loader.LoadStyleSheets = function(cfg, callback)
{
	Fit.Validation.ExpectArray(cfg);
	Fit.Validation.ExpectFunction(callback, true);

	// Verify configuration

	for (var i = 0 ; i < cfg.length ; i++)
	{
		Fit.Validation.ExpectStringValue(cfg[i].source);
		Fit.Validation.ExpectFunction(cfg[i].loaded, true);
	}

	// Invoke callback if nothing to load

	if (cfg.length === 0)
	{
		if (Fit.Validation.IsSet(callback) === true)
			callback(cfg);

		return;
	}

	// Batch load all stylesheets

	for (var i = 0 ; i < cfg.length ; i++)
	{
		// Load stylesheet

		Fit.Loader.LoadStyleSheet(cfg[i].source, function(src)
		{
			// Fire stylesheet callback function when completed

			for (var j = 0 ; j < cfg.length ; j++)
			{
				if (cfg[j].source === src)
				{
					cfg[j].handled = true;

					if (Fit.Validation.IsSet(cfg[j].loaded) === true)
					{
						try // Use try/catch to make sure a buggy callback function does not prevent "all completed" callback to be reached
						{
							cfg[j].loaded(cfg[j]);
						}
						catch (err)
						{
							if (window.console)
							{
								console.log(err.message);
								console.log(err.stack);
								console.log(err);
							}
						}
					}

					break;
				}
			}

			// Fire "all completed" callback if all stylesheets have finished loading

			for (var j = 0 ; j < cfg.length ; j++)
			{
				if (cfg[j].handled !== true)
					return;
			}

			if (Fit.Validation.IsSet(callback) === true)
				callback(cfg);
		});
	}
}
/// <container name="Fit.Controls.Button">
/// 	Button control with support for Font Awesome icons
/// </container>

// http://fiddle.jshell.net/05q0tLt6/14/

/// <function container="Fit.Controls.Button" name="Button" access="public">
/// 	<description> Create instance of Button control </description>
/// 	<param name="controlId" type="string" default="undefined">
/// 		Unique control ID. If specified, control will be
/// 		accessible using the Fit.Controls.Find(..) function.
/// 	</param>
/// </function>
Fit.Controls.Button = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);

	// Support for Fit.Controls.Find(..)

	if (Fit.Validation.IsSet(controlId) === true)
	{
		if (Fit._internal.ControlBase.Controls[controlId] !== undefined)
			Fit.Validation.ThrowError("Control with ID '" + controlId + "' has already been defined - Control IDs must be unique!");

		Fit._internal.ControlBase.Controls[controlId] = this;
	}

	// Internals

	var me = this;
	var id = (controlId ? controlId : null);
	var element = null;
	var wrapper = null;
	var icon = null;
	var label = null;
	//var title = "";
	//var icon = "";
	var width = { Value: -1, Unit: "px" };	// Initial width - a value of -1 indicates that size adjusts to content
	var height = { Value: -1, Unit: "px" };	// Initial height - a value of -1 indicates that size adjusts to content
	var onClickHandlers = [];

	function init()
	{
		element = document.createElement("div");

		if (id !== null)
			element.id = id;

		Fit.Events.AddHandler(element, "click", function(e)
		{
			if (me.Enabled() === true)
				me.Click();
		});
		Fit.Events.AddHandler(element, "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			if (me.Enabled() === true && (ev.keyCode === 13 || ev.keyCode === 32)) // Enter or Spacebar
			{
				me.Click();
				Fit.Events.PreventDefault(ev);
			}
		});

		Fit.Dom.AddClass(element, "FitUiControl");
		Fit.Dom.AddClass(element, "FitUiControlButton");

		wrapper = document.createElement("div");
		Fit.Dom.Add(element, wrapper);

		icon = document.createElement("span");
		Fit.Dom.Add(wrapper, icon);

		label = document.createElement("span");
		Fit.Dom.Add(wrapper, label);

		me.Enabled(true);
		me.Type(Fit.Controls.Button.Type.Default);
	}

	/// <function container="Fit.Controls.Button" name="GetId" access="public" returns="string">
	/// 	<description> Get unique Control ID - returns Null if not set </description>
	/// </function>
	this.GetId = function()
	{
		return id;
	}

	/// <function container="Fit.Controls.Button" name="Title" access="public" returns="string">
	/// 	<description> Get/set button title </description>
	/// 	<param name="val" type="string" default="undefined"> If specified, button title will be set to specified value </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			Fit.Dom.Data(element, "title", ((val !== "") ? val : null));
			label.innerHTML = val;
			//label.title = val;
			//title = val;
			//label.innerHTML = ((icon !== "") ? "<span class=\"fa " + ((icon.indexOf("fa-") !== 0) ? "fa-" : "") + icon + "\"></span>" : "") + val;
		}

		return ((Fit.Dom.Data(element, "title") !== null) ? Fit.Dom.Data(element, "title") : "");
		//return ((label.title !== undefined) ? label.title : "");
		//return label.innerHTML;
		//return title;
	}

	/// <function container="Fit.Controls.Button" name="Icon" access="public" returns="string">
	/// 	<description> Get/set button icon (Font Awesome icon name, e.g. fa-check-circle-o - http://fontawesome.io/icons) </description>
	/// 	<param name="val" type="string" default="undefined"> If specified, button icon will be set to specified value </param>
	/// </function>
	this.Icon = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			//icon.icon = val;
			Fit.Dom.Data(element, "icon", ((val !== "") ? val : null));
			icon.className = ((val !== "") ? "fa " + ((val.indexOf("fa-") !== 0) ? "fa-" : "") + val : "");
		}

		return ((Fit.Dom.Data(element, "icon") !== null) ? Fit.Dom.Data(element, "icon") : "");
		//return ((icon.icon !== undefined) ? icon.icon : "");
	}

	/// <function container="Fit.Controls.Button" name="Type" access="public" returns="Fit.Controls.Button.Type">
	/// 	<description>
	/// 		Get/set button type producing specific look and feel.
	/// 		Possible values are:
	/// 		 - Fit.Controls.Button.Type.Default (white)
	/// 		 - Fit.Controls.Button.Type.Primary (blue)
	/// 		 - Fit.Controls.Button.Type.Success (green)
	/// 		 - Fit.Controls.Button.Type.Info (turquoise)
	/// 		 - Fit.Controls.Button.Type.Warning (orange)
	/// 		 - Fit.Controls.Button.Type.Danger (red)
	/// 	</description>
	/// 	<param name="val" type="Fit.Controls.Button.Type" default="undefined"> If specified, button type will be set to specified value </param>
	/// </function>
	this.Type = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (Fit.Validation.IsSet(Fit.Controls.Button.Type[val]) === false)
				Fit.Validation.ThrowError("Unsupported button type specified - use e.g. Fit.Controls.Button.Type.Default");

			Fit.Dom.Data(element, "type", val);
		}

		return Fit.Dom.Data(element, "type");
	}

	/// <function container="Fit.Controls.Button" name="Enabled" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether button is enabled or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If specified, True enables button, False disables it </param>
	/// </function>
	this.Enabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			Fit.Dom.Data(element, "enabled", ((val === true) ? "true" : "false"));
			element.tabIndex = ((val === true) ? 0 : -1);
		}

		return (Fit.Dom.Data(element, "enabled") === "true");
	}

	/// <function container="Fit.Controls.Button" name="Focused" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control has focus </description>
	/// 	<param name="focus" type="boolean" default="undefined"> If defined, True assigns focus, False removes focus (blur) </param>
	/// </function>
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true)
		{
			if (focus === true)
				element.focus();
			else
				element.blur();
		}

		// Fit.Dom.Contained(..) portion added to support IE which incorrectly assigns focus to contained elements, even though tabIndex is not set
		return (document.activeElement === element || (document.activeElement && Fit.Dom.Contained(element, document.activeElement)));
	}

	/// <function container="Fit.Controls.Button" name="Width" access="public" returns="object">
	/// 	<description> Get/set control width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control width is updated to specified CSS unit </param>
	/// </function>
	this.Width = function(val, unit) // Differs from ControlBase.Width(..) when -1 is passed - this control resets to width:auto while ControlBase resets to width:200px
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				width = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				element.style.width = width.Value + width.Unit;
			}
			else
			{
				width = { Value: -1, Unit: "px" };
				element.style.width = ""; // Notice: width:auto is applied in Button.css
			}
		}

		return width;
	}

	/// <function container="Fit.Controls.Button" name="Height" access="public" returns="object">
	/// 	<description> Get/set control height - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control height is updated to specified value. A value of -1 resets control height. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control height is updated to specified CSS unit </param>
	/// </function>
	this.Height = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				height = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				element.style.height = height.Value + height.Unit;

				// Work around bug in WebKit/Chrome:
				// https://code.google.com/p/chromium/issues/detail?id=573715
				// Also see Button.css (div.FitUiControlButton[style*="height"] > div)
				wrapper.style.position = "relative";
			}
			else
			{
				height = { Value: -1, Unit: "px" };
				element.style.height = "";

				// Undo WebKit/Chrome bug fix (see condition above)
				wrapper.style.position = "";
			}
		}

		return height;
	}

	/// <function container="Fit.Controls.Button" name="OnClick" access="public">
	/// 	<description> Set callback function invoked when button is clicked </description>
	/// 	<param name="cb" type="function"> Callback function invoked when button is clicked - takes button instance as argument </param>
	/// </function>
	this.OnClick = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onClickHandlers, cb);
	}

	/// <function container="Fit.Controls.Button" name="Click" access="public">
	/// 	<description> Programmatically trigger a button click </description>
	/// </function>
	this.Click = function()
	{
		Fit.Array.ForEach(onClickHandlers, function(handler)
		{
			handler(me);
		});
	}

	/// <function container="Fit.Controls.Button" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing control </description>
	/// </function>
	this.GetDomElement = function()
	{
		return element;
	}

	/// <function container="Fit.Controls.Button" name="Render" access="public">
	/// 	<description> Render control, either inline or to element specified </description>
	/// 	<param name="toElement" type="DOMElement" default="undefined"> If defined, control is rendered to this element </param>
	/// </function>
	this.Render = function(toElement)
	{
		Fit.Validation.ExpectDomElement(toElement, true);

		if (Fit.Validation.IsSet(toElement) === true)
		{
			Fit.Dom.Add(toElement, element);
		}
		else
		{
			var script = document.scripts[document.scripts.length - 1];
			Fit.Dom.InsertBefore(script, element);
		}
	}

	/// <function container="Fit.Controls.Button" name="Dispose" access="public">
	/// 	<description> Destroys control to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		Fit.Dom.Remove(element);
		me = id = element = label = title = icon = width = height = onClickHandlers = null;

		if (Fit.Validation.IsSet(controlId) === true)
			delete Fit._internal.ControlBase.Controls[controlId];
	}

	init();
}

/// <container name="Fit.Controls.Button.Type">
/// 	Enum values determining visual appearance of button controls
/// </container>
Fit.Controls.Button.Type =
{
	/// <member container="Fit.Controls.Button.Type" name="Default" access="public" static="true" type="string" default="Default">
	/// 	<description> White unless styled differently - default look and feel </description>
	/// </member>
	Default: "Default",

	/// <member container="Fit.Controls.Button.Type" name="Primary" access="public" static="true" type="string" default="Primary">
	/// 	<description> Blue unless styled differently </description>
	/// </member>
	Primary: "Primary",

	/// <member container="Fit.Controls.Button.Type" name="Success" access="public" static="true" type="string" default="Success">
	/// 	<description> Green unless styled differently </description>
	/// </member>
	Success: "Success",

	/// <member container="Fit.Controls.Button.Type" name="Info" access="public" static="true" type="string" default="Info">
	/// 	<description> Turquoise unless styled differently </description>
	/// </member>
	Info: "Info",

	/// <member container="Fit.Controls.Button.Type" name="Warning" access="public" static="true" type="string" default="Warning">
	/// 	<description> Orange unless styled differently </description>
	/// </member>
	Warning: "Warning",

	/// <member container="Fit.Controls.Button.Type" name="Danger" access="public" static="true" type="string" default="Danger">
	/// 	<description> Red unless styled differently </description>
	/// </member>
	Danger: "Danger"
}
/// <container name="Fit.Controls.CheckBox">
/// 	Simple CheckBox control.
/// 	Extending from Fit.Controls.ControlBase.
/// </container>

/// <function container="Fit.Controls.CheckBox" name="CheckBox" access="public">
/// 	<description> Create instance of CheckBox control </description>
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.CheckBox = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var checkbox = null;
	var label = null;
	var width = { Value: -1, Unit: "px" };	// Initial width - a value of -1 indicates that size adjusts to content
	var orgChecked = false;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	// ============================================
	// Init
	// ============================================

	function init()
	{
		me.AddCssClass("FitUiControlCheckBox");
		me.GetDomElement().tabIndex = 0;

		checkbox = document.createElement("div");
		Fit.Dom.AddClass(checkbox, "fa");
		Fit.Dom.AddClass(checkbox, "fa-check");

		Fit.Events.AddHandler(me.GetDomElement(), "click", function(e)
		{
			if (me.Enabled() === true)
			{
				//var orgVal = orgChecked;
				me.Checked(!me.Checked(), true);
				//orgChecked = orgVal;
			}
		});
		Fit.Events.AddHandler(me.GetDomElement(), "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			if (me.Enabled() === true && ev.keyCode === 32) // Spacebar
			{
				//var orgVal = orgChecked;
				me.Checked(!me.Checked(), true);
				//orgChecked = orgVal;

				Fit.Events.PreventDefault(ev); // Prevent scroll
			}
		});

		label = document.createElement("span");

		me._internal.AddDomElement(checkbox);
		me._internal.AddDomElement(label);

		me.Enabled(true);
		me.Checked(false);
		me.Width(-1);
	}

	// ============================================
	// Public - overrides
	// ============================================

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true)
		{
			if (focus === true)
				me.GetDomElement().focus();
			else
				me.GetDomElement().blur();
		}

		// Fit.Dom.Contained(..) portion added to support IE which incorrectly assigns focus to contained elements, even though tabIndex is not set
		return (document.activeElement === me.GetDomElement() || (document.activeElement && Fit.Dom.Contained(me.GetDomElement(), document.activeElement)));
	}

	// See documentation on ControlBase
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			var valStr = val.toLowerCase();

			if (valStr === "true")
			{
				me.Checked(true);
			}
			else if (valStr === "false")
			{
				me.Checked(false);
			}
		}

		return ((me.Checked() === true) ? "true" : "false");
	}

	/// <function container="Fit.Controls.CheckBox" name="Checked" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is checked </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, control's checked state is updated to specified value </param>
	/// </function>
	this.Checked = function(val, preserveDirtyState) // preserveDirtyState is for internal use only - do not add to documentation!
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(preserveDirtyState, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			var before = (Fit.Dom.Data(me.GetDomElement(), "checked") === "true");

			Fit.Dom.Data(me.GetDomElement(), "checked", val.toString());

			if (preserveDirtyState !== true)
				orgChecked = (Fit.Dom.Data(me.GetDomElement(), "checked") === "true");

			if (before !== val)
			{
				repaint();
				me._internal.FireOnChange();
			}
		}

		return (Fit.Dom.Data(me.GetDomElement(), "checked") === "true");
	}

	/// <function container="Fit.Controls.CheckBox" name="Width" access="public" returns="object">
	/// 	<description> Get/set control width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control width is updated to specified CSS unit </param>
	/// </function>
	this.Width = function(val, unit) // Differs from ControlBase.Width(..) when -1 is passed - this control resets to width:auto while ControlBase resets to width:200px
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				width = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				me.GetDomElement().style.width = width.Value + width.Unit;
			}
			else
			{
				width = { Value: -1, Unit: "px" };
				me.GetDomElement().style.width = ""; // Notice: width:auto is applied in CheckBox.css
			}
		}

		return width;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		return (orgChecked !== me.Checked());
	}

	// See documentation on ControlBase
	this.Clear = function()
	{
		me.Checked(false);
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		// This will destroy control - it will no longer work!

		me = checkbox = label = width = orgChecked = isIe8 = null;

		base();
	});

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.CheckBox" name="Label" access="public" returns="string">
	/// 	<description> Get/set label associated with checkbox </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, label is updated to specified value </param>
	/// </function>
	this.Label = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			label.innerHTML = val;
		}

		return label.innerHTML;
	}

	/// <function container="Fit.Controls.CheckBox" name="Enabled" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is enabled or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If specified, True enables control, False disables it </param>
	/// </function>
	this.Enabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			Fit.Dom.Data(me.GetDomElement(), "enabled", val.toString());
			me.GetDomElement().tabIndex = ((val === true) ? 0 : -1);
		}

		return (Fit.Dom.Data(me.GetDomElement(), "enabled") === "true");
	}

	// ============================================
	// Private
	// ============================================

	function repaint()
	{
		if (isIe8 === true)
		{
			// IE8 does not update pseudo elements properly.
			// Changing CSS classes or content within the control
			// is not sufficient - we actually have to remove the
			// control temporarily from the DOM to make it update.
			// Unfortunately this results in focus being lost if
			// control had focus, so we have to restore it as well.

			var focused = document.activeElement;

			var elm = document.createElement("");
			Fit.Dom.Replace(checkbox, elm);
			Fit.Dom.Replace(elm, checkbox);

			if (document.activeElement !== focused)
				focused.focus();
		}
	}

	init();
}
/// <container name="Fit.Controls.ContextMenu">
/// 	ContextMenu control allowing for quick access to select features.
/// </container>

/// <function container="Fit.Controls.ContextMenu" name="ContextMenu" access="public">
/// 	<description> Create instance of ContextMenu control </description>
/// </function>
Fit.Controls.ContextMenu = function()
{
	var me = this;
	var tree = new Fit.Controls.TreeView("ContextMenuTreeView_" + Fit.Data.CreateGuid());
	var prevFocused = null;
	var detectBoundaries = true;
	var highlightOnInitKeyStroke = true;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	var onShowing = [];
	var onShown = [];
	var onHide = [];
	var onSelect = [];

	// ============================================
	// Init
	// ============================================

	function init()
	{
		Fit.Dom.Data(tree.GetDomElement(), "keynav", "false");				// True when navigating using keyboard
		Fit.Dom.Data(tree.GetDomElement(), "sticky", "false");				// True when user toggles node
		Fit.Dom.Data(tree.GetDomElement(), "viewportcollision", "false");	// True when context menu collides with viewport boundaries

		tree.AddCssClass("FitUiControlContextMenu");
		tree.Selectable(true);

		// Custom keyboard navigation

		tree.KeyboardNavigation(false);

		Fit.Events.AddHandler(tree.GetDomElement(), "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			if (ev.keyCode === 27) // Escape
			{
				me.Hide();

				// Return focus to previously focused element
				if (prevFocused !== null)
				{
					prevFocused.focus();
					prevFocused = null;
				}

				return;
			}

			var node = tree.GetNodeFocused();

			if (node === null) // In case context menu has no children
				return;

			if (highlightOnInitKeyStroke === true)
			{
				highlightOnInitKeyStroke = false;
				Fit.Dom.Data(tree.GetDomElement(), "keynav", "true"); // Requires repaint in Legacy IE
				repaint();

				// Make sure the first item is highlighted instead of
				// the 2nd item, in case initial keystroke was arrow down.

				if (ev.keyCode === 40 && tree.GetChildren().length > 0)
				{
					tree.GetChildren()[0].Focused(true);

					Fit.Events.PreventDefault(ev); // Prevent scrolling
					return;
				}
			}

			if (ev.keyCode === 37) // Arrow left
			{
				if (node.Expanded() === true)
				{
					node.Expanded(false);
				}
				else if (node.GetParent() !== null)
				{
					node.GetParent().Focused(true);
				}

				Fit.Events.PreventDefault(ev); // Prevent scrolling
				return;
			}

			if (ev.keyCode === 39) // Arrow right
			{
				if (node.GetChildren().length > 0)
				{
					node.Expanded(true);
					node.GetChildren()[0].Focused(true);
				}

				Fit.Events.PreventDefault(ev); // Prevent scrolling
				return;
			}

			if (ev.keyCode === 38) // Arrow up
			{
				var newNode = tree.GetNodeAbove(node);

				if (newNode !== null)
					newNode.Focused(true);

				Fit.Events.PreventDefault(ev); // Prevent scrolling
				return;
			}

			if (ev.keyCode === 40) // Arrow down
			{
				var newNode = tree.GetNodeBelow(node);

				if (newNode !== null)
					newNode.Focused(true);

				Fit.Events.PreventDefault(ev); // Prevent scrolling
				return;
			}

			if (ev.keyCode === 13) // Enter
			{
				if (node.Selectable() === true)
					node.Selected(true);

				return;
			}
		});

		// Have OnSelect fire when TreeView node is selected

		tree.OnSelected(function(sender, node)
		{
			if (node.Selected() === true) // OnSelected fires when both selecting and deselecting nodes
			{
				node.Selected(false); // Notice: Fires OnSelected again
				node.Expanded(!node.Expanded());

				// Navigate link contained in item, or fire ContextMenu.OnSelect

				var links = node.GetDomElement().getElementsByTagName("a");

				if (links.length === 1 && Fit.Dom.GetParentOfType(links[0], "li") === node.GetDomElement())
				{
					links[0].click();
					me.Hide();
				}
				else
				{
					fireEventHandlers(onSelect, node.GetDomElement()._internal.ContextMenuItem);
				}
			}
		});

		// Support for sticky nodes

		tree.OnToggled(function(sender, node)
		{
			if (node.Expanded() === false) // Node collapsed
			{
				// Collapse all children
				Fit.Array.ForEach(node.GetChildren(), function(c)
				{
					c.Expanded(false); // Notice: Fires OnToggled again if node is expanded, causing all children to be collapsed recursively
				});
			}
			else // Node expanded
			{
				if (node.Focused() === true) // Prevent this from executing when recursively expanding parent nodes (see further down)
				{
					Fit.Dom.Data(tree.GetDomElement(), "sticky", "true");
					highlightOnInitKeyStroke = false;

					// Collapse previously expanded nodes

					var expanded = null;
					var currentNode = node;

					while (currentNode !== null)
					{
						if (currentNode.GetParent() !== null)
							expanded = getExpandedChild(currentNode.GetParent().GetChildren(), currentNode);
						else
							expanded = getExpandedChild(tree.GetChildren(), currentNode);

						if (expanded !== null)
						{
							expanded.Expanded(false); // Notice: Fires OnToggled again, causing all children to be collapsed recursively
							break;
						}

						currentNode = currentNode.GetParent();
					}
				}

				// Expand parent nodes to make the currently hovered hierarchy/path sticky
				if (node.GetParent() !== null)
					node.GetParent().Expanded(true); // Notice: Fires OnToggled again causing all parents to expand recursively

				// Boundary detection - detect and handle viewport collisions
				if (detectBoundaries === true)
					handleViewPortCollision(node.GetDomElement());
			}
		});

		// Boundary detection - detect and handle viewport collisions when hovering items to open submenus

		Fit.Events.AddHandler(tree.GetDomElement(), "mouseover", function(e)
		{
			if (detectBoundaries === true && Fit.Dom.Data(tree.GetDomElement(), "sticky") === "false") // Viewport collision is handled by OnToggled handler when items are sticky
			{
				var elm = Fit.Events.GetTarget(e);
				elm = ((elm.tagName === "LI") ? elm : Fit.Dom.GetParentOfType(elm, "li")); // Null if user is hovering context menu border or any margin/padding applied to context menu container

				if (elm !== null)
					handleViewPortCollision(elm);
			}
		});

		// Contain clicks - prevents e.g. drop down from closing when context menu is used within picker control

		Fit.Events.AddHandler(tree.GetDomElement(), "click", function(e)
		{
			Fit.Events.StopPropagation(e);
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.ContextMenu" name="Show" access="public">
	/// 	<description> Make context menu show up. If X,Y coordinates are not specified, the position of the mouse pointer will be used. </description>
	/// 	<param name="x" type="integer" default="undefined"> If defined, context menu will open at specified horizontal position </param>
	/// 	<param name="y" type="integer" default="undefined"> If defined, context menu will open at specified vertical position </param>
	/// </function>
	this.Show = function(x, y)
	{
		Fit.Validation.ExpectInteger(x, true);
		Fit.Validation.ExpectInteger(y, true);

		// Fire OnShowing event

		if (fireEventHandlers(onShowing) === false)
			return;

		// Close context menu if one is already open

		if (Fit._internal.ContextMenu.Current !== null && Fit._internal.ContextMenu.Current !== me && Fit._internal.ContextMenu.Current.IsVisible() === true)
		{
			Fit._internal.ContextMenu.Current.Hide();
			Fit._internal.ContextMenu.Current = null;
		}

		// Set position

		var pos = Fit.Events.GetPointerState().Coordinates.Document;

		var posX = ((Fit.Validation.IsSet(x) === true) ? x : pos.X);
		var posY = ((Fit.Validation.IsSet(y) === true) ? y : pos.Y);

		tree.GetDomElement().style.left = posX + "px";
		tree.GetDomElement().style.top = posY + "px";
		tree.GetDomElement().style.width = "auto"; // TreeView.Width(val, unit) cannot be used to set width:auto

		// Add to DOM

		if (me.IsVisible() === false) // Only append to DOM once - ContextMenu may have been rooted elsewhere by external code
		{
			Fit.Dom.Add(document.body, tree.GetDomElement());
			Fit._internal.ContextMenu.Current = me;
		}

		// Boundary detection

		if (detectBoundaries === true)
		{
			var treeElm = tree.GetDomElement();
			Fit.Dom.Data(treeElm, "viewportcollision", "false");

			if (Fit.Browser.GetViewPortDimensions().Height < (posY - Fit.Dom.GetScrollPosition(document.body).Y) + treeElm.offsetHeight)
			{
				Fit.Dom.Data(treeElm, "viewportcollision", "true");
				treeElm.style.top = (posY - treeElm.offsetHeight) + "px";
			}
		}

		// Focus context menu to allow keyboard navigation

		me.Focused(true);

		// Fire OnShown event

		fireEventHandlers(onShown);
	}

	/// <function container="Fit.Controls.ContextMenu" name="Hide" access="public">
	/// 	<description> Hide context menu </description>
	/// </function>
	this.Hide = function()
	{
		if (me.IsVisible() === true)
		{
			Fit.Dom.Remove(tree.GetDomElement());
			fireEventHandlers(onHide);

			Fit.Array.ForEach(tree.GetChildren(), function(n) // OnToggled handler makes sure to collapse nodes recursively
			{
				n.Expanded(false);
			});

			highlightOnInitKeyStroke = true;
			Fit.Dom.Data(tree.GetDomElement(), "keynav", "false");
			Fit.Dom.Data(tree.GetDomElement(), "viewportcollision", "false");
			Fit.Dom.Data(tree.GetDomElement(), "sticky", "false");

			Fit.Array.ForEach(tree.GetDomElement().getElementsByTagName("ul"), function(ul)
			{
				Fit.Dom.Data(ul, "viewportcollision", null);
			});
		}
	}

	/// <function container="Fit.Controls.ContextMenu" name="DetectBoundaries" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether boundary/collision detection is enabled or not </description>
	/// </function>
	this.DetectBoundaries = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === false)
			{
				Fit.Dom.Data(tree.GetDomElement(), "viewportcollision", "false");

				Fit.Array.ForEach(tree.GetDomElement().getElementsByTagName("ul"), function(ul)
				{
					Fit.Dom.Data(ul, "viewportcollision", null);
				});
			}

			detectBoundaries = val;
		}

		return detectBoundaries;
	}

	/// <function container="Fit.Controls.ContextMenu" name="IsVisible" access="public" returns="boolean">
	/// 	<description> Get value indicating whether context menu is visible or not </description>
	/// </function>
	this.IsVisible = function()
	{
		return (tree.GetDomElement().parentElement !== null);
	}

	/// <function container="Fit.Controls.ContextMenu" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing context menu </description>
	/// </function>
	this.GetDomElement = function()
	{
		return tree.GetDomElement();
	}

	/// <function container="Fit.Controls.ContextMenu" name="AddChild" access="public">
	/// 	<description> Add item to ContextMenu </description>
	/// 	<param name="item" type="Fit.Controls.ContextMenu.Item"> Item to add </param>
	/// </function>
	this.AddChild = function(item)
	{
		Fit.Validation.ExpectInstance(item, Fit.Controls.ContextMenu.Item);

		var tvNode = item.GetDomElement()._internal.Node;
		tree.AddChild(tvNode);
	}

	/// <function container="Fit.Controls.ContextMenu" name="RemoveChild" access="public">
	/// 	<description> Remove item from ContextMenu </description>
	/// 	<param name="item" type="Fit.Controls.ContextMenu.Item"> Item to remove </param>
	/// </function>
	this.RemoveChild = function(item)
	{
		Fit.Validation.ExpectInstance(item, Fit.Controls.ContextMenu.Item);

		var tvNode = tree.GetChild(item.Value());

		if (tvNode !== null)
			tree.RemoveChild(tvNode);
	}

	/// <function container="Fit.Controls.ContextMenu" name="RemoveAllChildren" access="public">
	/// 	<description> Remove all items contained in ContextMenu </description>
	/// 	<param name="dispose" type="boolean" default="false"> Set True to dispose items </param>
	/// </function>
	this.RemoveAllChildren = function(dispose)
	{
		Fit.Validation.ExpectBoolean(dispose, true);
		tree.RemoveAllChildren(dispose);
	}

	/// <function container="Fit.Controls.ContextMenu" name="GetChild" access="public" returns="Fit.Controls.ContextMenu.Item">
	/// 	<description> Get item by value - returns Null if not found </description>
	/// 	<param name="val" type="string"> Item value </param>
	/// 	<param name="recursive" type="boolean" default="false"> If defined, True enables recursive search </param>
	/// </function>
	this.GetChild = function(val, recursive)
	{
		Fit.Validation.ExpectString(val);
		Fit.Validation.ExpectBoolean(recursive, true);

		var tvNode = tree.GetChild(val, recursive);

		if (tvNode === null)
			return null;

		return tvNode.GetDomElement()._internal.ContextMenuItem;
	}

	/// <function container="Fit.Controls.ContextMenu" name="GetChildren" access="public" returns="Fit.Controls.ContextMenu.Item[]">
	/// 	<description> Get all children </description>
	/// </function>
	this.GetChildren = function()
	{
		var items = [];

		Fit.Array.ForEach(tree.GetChildren(), function(tvNode)
		{
			Fit.Array.Add(items, tvNode.GetDomElement()._internal.ContextMenuItem);
		});

		return items;
	}

	/// <function container="Fit.Controls.ContextMenu" name="GetAllChildren" access="public" returns="Fit.Controls.ContextMenu.Item[]">
	/// 	<description> Get all children across entire hierarchy in a flat collection </description>
	/// </function>
	this.GetAllChildren = function()
	{
		var items = [];

		Fit.Array.ForEach(tree.GetAllNodes(), function(tvNode)
		{
			Fit.Array.Add(items, tvNode.GetDomElement()._internal.ContextMenuItem);
		});

		return items;
	}

	/// <function container="Fit.Controls.ContextMenu" name="Focused" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control has focus </description>
	/// 	<param name="value" type="boolean" default="undefined"> If defined, True assigns focus, False removes focus (blur) </param>
	/// </function>
	this.Focused = function(value)
	{
		Fit.Validation.ExpectBoolean(value, true);

		if (Fit.Validation.IsSet(value) === true)
		{
			prevFocused = document.activeElement;
		}

		return tree.Focused(value);
	}

	/// <function container="Fit.Controls.ContextMenu" name="Dispose" access="public">
	/// 	<description> Destroys component to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		tree.Dispose();
		me = tree = prevFocused = detectBoundaries = highlightOnInitKeyStroke = isIe8 = onShowing = onShown = onHide = onSelect = null;
	}

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.ContextMenu" name="OnShowing" access="public">
	/// 	<description>
	/// 		Add event handler fired before context menu is shown.
	/// 		This event can be canceled by returning False.
	/// 		Function receives one argument: Sender (Fit.Controls.ContextMenu).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnShowing = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onShowing, cb);
	}

	/// <function container="Fit.Controls.ContextMenu" name="OnShown" access="public">
	/// 	<description>
	/// 		Add event handler fired when context menu is shown.
	/// 		Function receives one argument: Sender (Fit.Controls.ContextMenu).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnShown = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onShown, cb);
	}

	/// <function container="Fit.Controls.ContextMenu" name="OnHide" access="public">
	/// 	<description>
	/// 		Add event handler fired when context menu is hidden.
	/// 		Function receives one argument: Sender (Fit.Controls.ContextMenu).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnHide = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onHide, cb);
	}

	/// <function container="Fit.Controls.ContextMenu" name="OnSelect" access="public">
	/// 	<description>
	/// 		Add event handler fired when an item is selected in context menu.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.ContextMenu) and Item (Fit.Controls.ContextMenu.Item).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnSelect = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelect, cb);
	}

	// ============================================
	// Private
	// ============================================

	this._internal = (this._internal ? this._internal : {});

	this._internal.FireOnShowing = function()
	{
		return fireEventHandlers(onShowing);
	}
	this._internal.FireOnShown = function()
	{
		fireEventHandlers(onShown);
	}
	this._internal.FireOnHide = function()
	{
		fireEventHandlers(onHide);
	}
	this._internal.FireOnSelect = function()
	{
		fireEventHandlers(onSelect);
	}

	function fireEventHandlers(handlers, item) // Notice: item variable only provided for OnSelect event
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (cb(me, item) === false)
				cancel = true; // Do NOT cancel loop though! All handlers must be fired!
		});

		return !cancel;
	}

	function getExpandedChild(children, childToIgnore)
	{
		Fit.Validation.ExpectInstanceArray(children, Fit.Controls.TreeView.Node);
		Fit.Validation.ExpectInstance(childToIgnore, Fit.Controls.TreeView.Node);

		var found = null;

		Fit.Array.ForEach(children, function(c)
		{
			if (c.Expanded() === true && c !== childToIgnore)
			{
				found = c;
				return false; // Break loop
			}
		});

		return found;
	}

	function handleViewPortCollision(nodeElm)
	{
		Fit.Validation.ExpectDomElement(nodeElm);

		if (nodeElm.getElementsByTagName("ul").length > 0)
		{
			var ul = nodeElm.getElementsByTagName("ul")[0];
			Fit.Dom.Data(ul, "viewportcollision", null); // Requires repaint in Legacy IE

			repaint(function()
			{
				var pos = Fit.Dom.GetPosition(ul, true);

				if (Fit.Browser.GetViewPortDimensions().Height < pos.Y + ul.offsetHeight)
					Fit.Dom.Data(ul, "viewportcollision", "true");
			});
		}
	}

	function repaint(f)
	{
		Fit.Validation.ExpectFunction(f, true);

		var cb = ((Fit.Validation.IsSet(f) === true) ? f : function() {});

		if (isIe8 === false)
		{
			cb();
		}
		else
		{
			// Flickering may occure on IE8 when updating UI over time
			// (UI update + JS thread released + UI updates again "later").

			Fit.Dom.AddClass(tree.GetDomElement(), "FitUi_Non_Existing_ContextMenu_Class");
			Fit.Dom.RemoveClass(tree.GetDomElement(), "FitUi_Non_Existing_ContextMenu_Class");

			setTimeout(function()
			{
				cb();

				Fit.Dom.AddClass(tree.GetDomElement(), "FitUi_Non_Existing_ContextMenu_Class");
				Fit.Dom.RemoveClass(tree.GetDomElement(), "FitUi_Non_Existing_ContextMenu_Class");
			}, 0);
		}
	}

	init();
}

/// <function container="Fit.Controls.ContextMenu.Item" name="Item" access="public">
/// 	<description> Create instance of ContextMenu Item </description>
/// 	<param name="displayTitle" type="string"> Item title </param>
/// 	<param name="itemValue" type="string"> Item value </param>
/// </function>
Fit.Controls.ContextMenu.Item = function(displayTitle, itemValue)
{
	Fit.Validation.ExpectString(displayTitle);
	Fit.Validation.ExpectString(itemValue);

	var me = this;
	var node = new Fit.Controls.TreeView.Node(displayTitle, itemValue);

	// ============================================
	// Init
	// ============================================

	function init()
	{
		node.GetDomElement()._internal.ContextMenuItem = me;
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.ContextMenu.Item" name="Title" access="public" returns="string">
	/// 	<description> Get/set item title </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, item title is updated </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);
		return node.Title(val);
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="Value" access="public" returns="string">
	/// 	<description> Get item value </description>
	/// </function>
	this.Value = function()
	{
		return node.Value();
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="Selectable" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether item is selectable or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables item, False disables it </param>
	/// </function>
	this.Selectable = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);
		return node.Selectable(val);
	}

	/// <function container="Fit.Controls.ContextMenu" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing context menu </description>
	/// </function>
	this.GetDomElement = function()
	{
		return node.GetDomElement();
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="AddChild" access="public">
	/// 	<description> Add child item </description>
	/// 	<param name="item" type="Fit.Controls.ContextMenu.Item"> Item to add </param>
	/// </function>
	this.AddChild = function(item)
	{
		Fit.Validation.ExpectInstance(item, Fit.Controls.ContextMenu.Item);

		var tvNode = item.GetDomElement()._internal.Node;
		node.AddChild(tvNode);
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="RemoveChild" access="public">
	/// 	<description> Remove child item </description>
	/// 	<param name="item" type="Fit.Controls.ContextMenu.Item"> Item to remove </param>
	/// </function>
	this.RemoveChild = function(item)
	{
		Fit.Validation.ExpectInstance(item, Fit.Controls.ContextMenu.Item);

		var tvNode = node.GetChild(item.Value());

		if (tvNode !== null)
			node.RemoveChild(tvNode);
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="GetChild" access="public" returns="Fit.Controls.ContextMenu.Item">
	/// 	<description> Get item by value - returns Null if not found </description>
	/// 	<param name="val" type="string"> Item value </param>
	/// 	<param name="recursive" type="boolean" default="false"> If defined, True enables recursive search </param>
	/// </function>
	this.GetChild = function(val, recursive)
	{
		Fit.Validation.ExpectString(val);
		Fit.Validation.ExpectBoolean(recursive, true);

		var tvNode = node.GetChild(val, recursive);

		if (tvNode === null)
			return null;

		return tvNode.GetDomElement()._internal.ContextMenuItem;
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="GetChildren" access="public" returns="Fit.Controls.ContextMenu.Item[]">
	/// 	<description> Get all children </description>
	/// </function>
	this.GetChildren = function()
	{
		var items = [];

		Fit.Array.ForEach(node.GetChildren(), function(tvNode)
		{
			Fit.Array.Add(items, tvNode.GetDomElement()._internal.ContextMenuItem);
		});

		return items;
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="GetParent" access="public" returns="Fit.Controls.ContextMenu.Item">
	/// 	<description> Get parent item - returns Null for a root item </description>
	/// </function>
	this.GetParent = function()
	{
		var parent = node.GetParent();
		return ((parent !== null) ? parent.GetDomElement()._internal.ContextMenuItem : null);
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="Dispose" access="public">
	/// 	<description> Destroys item to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		node.Dispose();
		node = null;
	}

	init();
}

// Internals

Fit._internal.ContextMenu = {};
Fit._internal.ContextMenu.Current = null;

// Event handler responsible for closing context menu when clicking outside of context menu

Fit.Events.OnReady(function()
{
	Fit.Events.AddHandler(document, "click", function(e)
	{
		var target = Fit.Events.GetTarget(e);
		var ctx = Fit._internal.ContextMenu.Current;

		if (ctx === null || target === ctx.GetDomElement() || Fit.Dom.Contained(ctx.GetDomElement(), target) === true)
			return;

		ctx.Hide();
	});

	/*Fit.Events.AddHandler(document, "mousewheel", function(e) // Close ContextMenu when scrolling
	{
		if (Fit._internal.ContextMenu.Current !== null)
			Fit._internal.ContextMenu.Current.Hide();
	});*/
});
/// <container name="Fit.Controls.WSContextMenu">
/// 	ContextMenu control allowing for quick access to select features provided by a WebService.
/// 	Extending from Fit.Controls.ContextMenu.
/// </container>

/// <function container="Fit.Controls.WSContextMenu" name="WSContextMenu" access="public">
/// 	<description> Create instance of WSContextMenu control </description>
/// </function>
Fit.Controls.WSContextMenu = function()
{
	Fit.Core.Extend(this, Fit.Controls.ContextMenu).Apply();

	var me = this;
	var url = null;

	var onRequestHandlers = [];
	var onResponseHandlers = [];
	var onPopulatedHandlers = [];

	// ============================================
	// Init
	// ============================================

	function init()
	{
	}

	// ============================================
	// Public
	// ============================================

	this.Show = function(x, y)
	{
		Fit.Validation.ExpectInteger(x, true);
		Fit.Validation.ExpectInteger(y, true);

		// Fire OnShowing event

		if (me._internal.FireOnShowing() === false)
			return;

		// Close context menu if one is already open

		if (Fit._internal.ContextMenu.Current !== null && Fit._internal.ContextMenu.Current !== me && Fit._internal.ContextMenu.Current.IsVisible() === true)
		{
			Fit._internal.ContextMenu.Current.Hide();
			Fit._internal.ContextMenu.Current = null;
		}

		// Load data

		getData(function(eventArgs)
		{
			// Populate data received

			me.RemoveAllChildren();

			Fit.Array.ForEach(eventArgs.Children, function(c)
			{
				me.AddChild(createItemFromJson(c));
			});

			// Set position

			var pos = Fit.Events.GetPointerState().Coordinates.Document;

			var posX = ((Fit.Validation.IsSet(x) === true) ? x : pos.X);
			var posY = ((Fit.Validation.IsSet(y) === true) ? y : pos.Y);

			me.GetDomElement().style.left = posX + "px";
			me.GetDomElement().style.top = posY + "px";
			me.GetDomElement().style.width = "auto"; // TreeView.Width(val, unit) cannot be used to set width:auto

			// Add to DOM (context menu shows up)

			if (me.IsVisible() === false) // Only append to DOM once - ContextMenu may have been rooted elsewhere by external code
			{
				Fit.Dom.Add(document.body, me.GetDomElement());
				Fit._internal.ContextMenu.Current = me;
			}

			// Boundary detection

			if (me.DetectBoundaries() === true)
			{
				var treeElm = me.GetDomElement();
				Fit.Dom.Data(treeElm, "viewportcollision", "false");

				if (Fit.Browser.GetViewPortDimensions().Height < (posY - Fit.Dom.GetScrollPosition(document.body).Y) + treeElm.offsetHeight)
				{
					Fit.Dom.Data(treeElm, "viewportcollision", "true");
					treeElm.style.top = (posY - treeElm.offsetHeight) + "px";
				}
			}

			// Focus context menu to allow keyboard navigation

			me.Focused(true);

			// Fire OnShown event

			me._internal.FireOnShown();
		});
	}

	/// <function container="Fit.Controls.WSContextMenu" name="Url" access="public" returns="string">
	/// 	<description>
	/// 		Get/set URL to WebService responsible for providing data to ContextMenu.
	/// 		WebService must deliver all data at once in the following JSON format:
	/// 		[
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 1", Value: "1001", Selectable: true, Selected: true, Children: [] },
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 2", Value: "1002", Selectable: false, Selected: false, Children: [] }
	/// 		]
	/// 		Only Value is required. Children is a collection of items with the same format as described above.
	/// 	</description>
	/// 	<param name="wsUrl" type="string"> WebService URL - e.g. http://server/ws/data.asxm/GetItems </param>
	/// </function>
	this.Url = function(wsUrl)
	{
		Fit.Validation.ExpectString(wsUrl, true);

		if (Fit.Validation.IsSet(wsUrl) === true)
		{
			url = wsUrl;
		}

		return url;
	}

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.WSContextMenu" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is being requested.
	/// 		Request can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSContextMenu) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSContextMenu instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnRequest = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onRequestHandlers, cb);
	}

	/// <function container="Fit.Controls.WSContextMenu" name="OnResponse" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is received,
	/// 		allowing for data transformation to occure before
	/// 		ContextMenu is populated. Function receives two arguments:
	/// 		Sender (Fit.Controls.WSContextMenu) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSContextMenu instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Children: JSON items received from WebService
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnResponse = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onResponseHandlers, cb);
	}

	/// <function container="Fit.Controls.WSContextMenu" name="OnPopulated" access="public">
	/// 	<description>
	/// 		Add event handler fired when ContextMenu has been populated with items.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSContextMenu) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSContextMenu instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Children: JSON items received from WebService
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnPopulated = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPopulatedHandlers, cb);
	}

	// ============================================
	// Private
	// ============================================

	function getData(cb)
	{
		Fit.Validation.ExpectFunction(cb);

		if (url === null)
			Fit.Validation.ThrowError("Unable to get data, no WebService URL has been specified");

		var request = ((url.toLowerCase().indexOf(".asmx/") === -1) ? new Fit.Http.Request(url) : new Fit.Http.JsonRequest(url));

		// Fire OnRequest

		var eventArgs = { Sender: null, Request: null, Children: null };
		eventArgs.Sender = me;
		eventArgs.Request = request;

		if (fireEventHandlers(onRequestHandlers, eventArgs) === false)
			return;

		// Set request callbacks

		request.OnSuccess(function(req)
		{
			var children = request.GetResponseJson();

			// Fire OnResponse

			eventArgs.Children = ((children instanceof Array) ? children : []);
			fireEventHandlers(onResponseHandlers, eventArgs);

			// Fire getData callback

			cb(eventArgs); // Callback is responsible for populating Context Menu

			// Fire OnPopulated

			fireEventHandlers(onPopulatedHandlers, eventArgs);
		});

		request.OnFailure(function(req)
		{
			Fit.Validation.ThrowError("Unable to load data for context menu - request failed with HTTP Status code " + request.GetHttpStatus())
		});

		// Invoke request

		request.Start();
	}

	function createItemFromJson(jsonNode)
	{
		Fit.Validation.ExpectIsSet(jsonNode);

		// Convert JSON to ContextMenu item, including all contained children

		var item = new Fit.Controls.ContextMenu.Item((jsonNode.Title ? jsonNode.Title : jsonNode.Value), jsonNode.Value);

		if (jsonNode.Selectable !== undefined)
			item.Selectable((jsonNode.Selectable === true));

		if (jsonNode.Children instanceof Array)
		{
			Fit.Array.ForEach(jsonNode.Children, function(c)
			{
				item.AddChild(createItemFromJson(c));
			});
		}

		return item;
	}

	function fireEventHandlers(handlers, eventArgs)
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (cb(me, eventArgs) === false)
				cancel = true; // Do NOT cancel loop though! All handlers must be fired!
		});

		return !cancel;
	}

	init();
}
/// <container name="Fit.Controls.Dialog">
/// 	Simple Dialog control with support for Fit.UI buttons.
/// </container>

/// <function container="Fit.Controls.Dialog" name="Dialog" access="public">
/// 	<description> Create instance of Dialog control </description>
/// </function>
Fit.Controls.Dialog = function()
{
	var me = this;
	var dialog = null;
	var content = null;
	var buttons = null;
	var modal = false;
	var layer = null;

	// ============================================
	// Init
	// ============================================

	function init()
	{
		dialog = document.createElement("div");
		Fit.Dom.AddClass(dialog, "FitUiControl");
		Fit.Dom.AddClass(dialog, "FitUiControlDialog");

		content = document.createElement("div");
		Fit.Dom.Add(dialog, content);

		buttons = document.createElement("div");
		Fit.Dom.Add(dialog, buttons);

		layer = document.createElement("div");
		Fit.Dom.AddClass(layer, "FitUiControlDialogModalLayer");

		// Keep tab navigation within modal dialog

		Fit.Events.AddHandler(dialog, "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			var key = Fit.Events.GetModifierKeys();

			if (modal === true && buttons.children.length > 0 && ev.keyCode === 9) // Tab key
			{
				var buttonFocused = document.activeElement;

				if (ev.shiftKey === false)
				{
					if (buttonFocused === buttons.children[buttons.children.length - 1])
					{
						buttons.children[0].focus();
						Fit.Events.PreventDefault(ev);
					}
				}
				else
				{
					if (buttonFocused === buttons.children[0])
					{
						buttons.children[buttons.children.length - 1].focus();
						Fit.Events.PreventDefault(ev);
					}
				}
			}
		});

		// Focus first button when clicking dialog or modal layer

		Fit.Events.AddHandler(dialog, "click", function(e)
		{
			if (me === null)
				return; // Dialog was disposed when a button was clicked

			if (buttons.children.length > 0 && (document.activeElement === null || Fit.Dom.Contained(dialog, document.activeElement) === false))
				buttons.children[0].focus();
		});

		Fit.Events.AddHandler(layer, "click", function(e)
		{
			if (buttons.children.length > 0 && (document.activeElement === null || Fit.Dom.Contained(dialog, document.activeElement) === false))
				buttons.children[0].focus();
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.Dialog" name="Modal" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether dialog is modal or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If specified, True enables modal mode, False disables it </param>
	/// </function>
	this.Modal = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			modal = val;
		}

		return modal;
	}

	/// <function container="Fit.Controls.Dialog" name="Content" access="public" returns="string">
	/// 	<description> Get/set dialog content </description>
	/// 	<param name="val" type="string" default="undefined"> If specified, dialog content is updated with specified value </param>
	/// </function>
	this.Content = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			content.innerHTML = val;
		}

		return content.innerHTML;
	}

	/// <function container="Fit.Controls.Dialog" name="AddButton" access="public">
	/// 	<description> Add button to dialog </description>
	/// 	<param name="btn" type="Fit.Controls.Button"> Instance of Fit.Controls.Button </param>
	/// </function>
	this.AddButton = function(btn)
	{
		Fit.Validation.ExpectInstance(btn, Fit.Controls.Button);
		Fit.Dom.Add(buttons, btn.GetDomElement());
	}

	/// <function container="Fit.Controls.Dialog" name="Open" access="public">
	/// 	<description> Open dialog </description>
	/// </function>
	this.Open = function()
	{
		Fit.Dom.Add(document.body, dialog);

		if (modal === true)
			Fit.Dom.Add(document.body, layer);
	}

	/// <function container="Fit.Controls.Dialog" name="Close" access="public">
	/// 	<description> Close dialog </description>
	/// </function>
	this.Close = function()
	{
		Fit.Dom.Remove(dialog);

		if (layer !== null)
			Fit.Dom.Remove(layer);
	}

	/// <function container="Fit.Controls.Dialog" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing control </description>
	/// </function>
	this.GetDomElement = function()
	{
		return dialog;
	}

	/// <function container="Fit.Controls.Dialog" name="Dispose" access="public">
	/// 	<description> Destroys component to free up memory, including associated buttons </description>
	/// </function>
	this.Dispose = function()
	{
		Fit.Dom.Remove(dialog);

		if (layer !== null)
			Fit.Dom.Remove(layer);

		Fit.Array.ForEach(Fit.Array.Copy(buttons.children), function(buttonElm) // Using Copy(..) sinse Dispose() modifies children collection
		{
			Fit.Controls.Find(buttonElm.id).Dispose();
		});

		me = dialog = content = buttons = modal = layer = null;
	}

	init();
}

Fit.Controls.Dialog._internal = {};

Fit.Controls.Dialog._internal.BaseDialog = function(content, showCancel, cb)
{
	Fit.Validation.ExpectString(content);
	Fit.Validation.ExpectBoolean(showCancel);
	Fit.Validation.ExpectFunction(cb, true);

	var d = new Fit.Controls.Dialog();
	d.Content(content);
	d.Modal(true);
	Fit.Dom.AddClass(d.GetDomElement(), "FitUiControlDialogBase");

	var cmdOk = new Fit.Controls.Button(Fit.Data.CreateGuid());
	cmdOk.Title(Fit.Language.Translations.Ok);
	cmdOk.Icon("check");
	cmdOk.Type(Fit.Controls.Button.Type.Success);
	cmdOk.OnClick(function(sender)
	{
		d.Close();

		if (Fit.Validation.IsSet(cb) === true)
			cb(true);
	});
	d.AddButton(cmdOk);

	if (showCancel === true)
	{
		var cmdCancel = new Fit.Controls.Button(Fit.Data.CreateGuid());
		cmdCancel.Title(Fit.Language.Translations.Cancel);
		cmdCancel.Icon("ban");
		cmdCancel.Type(Fit.Controls.Button.Type.Danger);
		cmdCancel.OnClick(function(sender)
		{
			d.Close();

			if (Fit.Validation.IsSet(cb) === true)
				cb(false);
		});
		d.AddButton(cmdCancel);
	}

	d.Open();
	cmdOk.Focused(true);
}

/// <function container="Fit.Controls.Dialog" name="Alert" access="public" static="true">
/// 	<description> Display alert dialog </description>
/// 	<param name="content" type="string"> Content to display in alert dialog </param>
/// 	<param name="cb" type="function" default="undefined"> Optional callback function invoked when OK button is clicked </param>
/// </function>
Fit.Controls.Dialog.Alert = function(content, cb)
{
	Fit.Validation.ExpectString(content);
	Fit.Validation.ExpectFunction(cb, true);

	Fit.Controls.Dialog._internal.BaseDialog(content, false, function(res)
	{
		if (Fit.Validation.IsSet(cb) === true)
			cb();
	});
}

/// <function container="Fit.Controls.Dialog" name="Confirm" access="public" static="true">
/// 	<description> Display confirmation dialog with OK and Cancel buttons </description>
/// 	<param name="content" type="string"> Content to display in confirmation dialog </param>
/// 	<param name="cb" type="function">
/// 		Callback function invoked when a button is clicked.
/// 		True is passed to callback function when OK is clicked, otherwise False.
/// 	</param>
/// </function>
Fit.Controls.Dialog.Confirm = function(content, cb)
{
	Fit.Validation.ExpectString(content);
	Fit.Validation.ExpectFunction(cb);

	Fit.Controls.Dialog._internal.BaseDialog(content, true, cb);
}
// TODO - potentiale and fairly easy improvements:
//  - Indexed collection of selected nodes for quick retrivale and lookup
//  - Shared event handlers rather than creating new ones for every single item (input fields + delete button)
//  - Inputs should register an _internal.Left and _internal.Right attribute revealing position, to replace expensive Fit.Dom.GetIndex(..) = 0 or 2
//  - Font formatting is very hardcoded, and it will not scale properly to general font size on page

//{ Drag and Drop
/*
// Drag and drop support (quick and dirty):
Fit.Array.ForEach(document.querySelectorAll("div.FitUiControlDropDown > div:first-child > span"), function(elm)
{
    var d = new Fit.DragDrop.Draggable(elm);
    d.OnDragStop(function(dObj)
    {
        dObj.Reset();
    });
});
Fit.Array.ForEach(document.querySelectorAll("div.FitUiControlDropDown > div:first-child > span > input"), function(elm)
{
    var dz = new Fit.DragDrop.Dropzone(elm);
    dz.OnDrop(function(dzObj, dObj)
    {
        var dz = dzObj.GetElement();
        var d = dObj.GetElement();

        if (Fit.Dom.GetIndex(dz) === 0) // Left input
            Fit.Dom.InsertBefore(dz.parentElement, d);
        else // Right input
            Fit.Dom.InsertAfter(dz.parentElement, d);
    });
});
*/
//}

/// <container name="Fit.Controls.DropDown">
/// 	Drop Down Menu control allowing for single and multi selection.
/// 	Supports data selection using any control extending from Fit.Controls.PickerBase.
/// 	This control is extending from Fit.Controls.ControlBase.
/// </container>

/// <function container="Fit.Controls.DropDown" name="DropDown" access="public">
/// 	<description> Create instance of DropDown control </description>
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.DropDown = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

    var me = this;								// Access to members from event handlers (where "this" may have a different meaning)
    var itemContainer = null;					// Container for selected items and input fields
    var hidden = null;							// Area used to hide DOM elements (e.g span used to calculate width of input fields)
    var spanFitWidth = null;					// Span element used to calculate text width - used to dynamically control width of input fields
    var txtPrimary = null;						// Primary input (search) field initially available
    var txtCssWidth = -1;						// Width of input (search) field(s) - specified using CSS
    var txtActive = null;						// Currently active input (search) field
	var txtEnabled = false;						// Flag indicating whether user can enter text
    var dropDownMenu = null;					// Drop down menu element
    var picker = null;							// Picker control within drop down menu
	var orgSelections = [];						// Original selection set using Value(..) function - used to determine whether control is dirty
    var invalidMessage = "Invalid selection";	// Mouse over text for invalid selections
    var initialFocus = true;					// Flag indicating first focus of control
	var maxHeight = { Value: 150, Unit: "px"};	// Picker max height (px)
	var prevValue = "";							// Previous input value - used to determine whether OnChange should be fired
	var focusAssigned = false;					// Boolean ensuring that control is only given focus when AddSelection is called, if user assigned focus to control
	var visibilityObserverId = -1;				// Observer (ID) responsible for updating input control width when drop down becomes visible (if initially hidden)
	var widthObserverId = -1;					// Observer (ID) responsible for updating tab flow when control width is changed
	var tabOrderObserverId = -1;				// Observer (ID) responsible for updating tab flow when control becomes visible
	var partiallyHidden = null;					// Reference to item partially hidden (only used in Single Selection Mode where word wrapping is disabled)

	var onInputChangedHandlers = [];			// Invoked when input value is changed - takes two arguments (sender (this), text value)
	var onPasteHandlers = [];					// Invoked when a value is pasted - takes two arguments (sender (this), text value)
	var onOpenHandlers = [];					// Invoked when drop down is opened - takes one argument (sender (this))
	var onCloseHandlers = [];					// Invoked when drop down is closed - takes one argument (sender (this))

	function init()
	{
		invalidMessage = Fit.Language.Translations.InvalidSelection;

		// Initial settings

		me._internal.Data("multiselect", "false");

		// Create item container

		itemContainer = document.createElement("div");
		itemContainer.onclick = function(e)
		{
			focusAssigned = true;
			focusInput(((partiallyHidden !== null) ? partiallyHidden.previousSibling : txtPrimary));
			me.OpenDropDown();
		}
		Fit.Dom.AddClass(itemContainer, "FitUiControlDropDownItems");

		// Create arrow button used to open drop down

		var arrow = document.createElement("i");
		Fit.Dom.AddClass(arrow, "fa");
		Fit.Dom.AddClass(arrow, "fa-chevron-down");
		arrow.onclick = function(e)
		{
			// Do nothing by default, event propagates out to itemContainer
			// which opens drop down (See itemContainer.onclick handler above).

			// Close drop down if already open
			if (me.IsDropDownOpen() === true)
			{
				me.CloseDropDown();
				Fit.Events.StopPropagation(e); // Prevent drop down from opening again
			}
		}

		// Create primary search textbox

		txtPrimary = createSearchField();
		txtActive = txtPrimary;

		// Create drop down menu

		dropDownMenu = document.createElement("div");
		if (Fit.Browser.GetBrowser() !== "MSIE" || Fit.Browser.GetVersion() >= 9) // OnMouseWheel event is buggy in IE8
		{
			dropDownMenu.onmousewheel = function(e) // Handler prevents scroll on page when scrolling picker
			{
				var ev = Fit.Events.GetEvent(e);

				dropDownMenu.firstChild.scrollTop -= ((ev.wheelDeltaY !== undefined) ? ev.wheelDeltaY : ev.wheelDelta); // Expecting PickerControl's container (firstChild) to be scrollable for this to work
				Fit.Events.PreventDefault(ev);
			}
		}
		Fit.Dom.AddClass(dropDownMenu, "FitUiControlDropDownPicker");
		dropDownMenu.style.display = "none"; // Considered closed by default (prevent OnClose from firing if CloseDropDown() is called on closed drop down)

		// Create hidden span used to calculate width of input field value

		hidden = document.createElement("div");
		Fit.Dom.AddClass(hidden, "FitUiControlDropDownHidden");

		spanFitWidth = document.createElement("span");

		// Make drop down close when user clicks outside of control

		Fit.Events.AddHandler(document, "click", function(e)
		{
			var target = Fit.Events.GetTarget(e);

			if (me.IsDropDownOpen() === true && target !== me.GetDomElement() && Fit.Dom.Contained(me.GetDomElement(), target) === false)
				me.CloseDropDown();
		});

		// Suppress context menu (except for input fields)

		Fit.Events.AddHandler(me.GetDomElement(), "contextmenu", function(e)
		{
			if (Fit.Events.GetTarget(e).tagName !== "INPUT")
				return Fit.Events.PreventDefault(e);
		});

		// Append elements to the DOM

		Fit.Dom.Add(hidden, spanFitWidth);
		Fit.Dom.Add(itemContainer, txtPrimary);
		Fit.Dom.Add(itemContainer, arrow);
		me._internal.AddDomElement(itemContainer);
		me._internal.AddDomElement(dropDownMenu);
		me._internal.AddDomElement(hidden);

		me.AddCssClass("FitUiControlDropDown");
	}

	// ============================================
	// Public
	// ============================================

    // Error message

	/// <function container="Fit.Controls.DropDown" name="InvalidSelectionMessage" access="public" returns="string">
	/// 	<description> Get/set mouse over text shown for invalid selections </description>
	/// 	<param name="msg" type="string" default="undefined"> If defined, error message for invalid selections are set </param>
	/// </function>
    this.InvalidSelectionMessage = function(msg)
    {
		Fit.Validation.ExpectString(msg, true);

		if (Fit.Validation.IsSet(msg) === true)
		{
			invalidMessage = msg;

			Fit.Array.ForEach(getSelectionElements(), function(selection)
			{
				if (Fit.Dom.HasClass(selection, "FitUiControlDropDownInvalid") === true)
					Fit.Dom.Attribute(selection, "title", invalidMessage);
			});
		}

		return invalidMessage;
    }

    // Dimensions

	// See documentation on ControlBase
	this.Width = Fit.Core.CreateOverride(this.Width, function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		var rtn = base(val, unit);

		// Make sure tab flow is automatically updated if control width is changed due to use of relative unit

		if (Fit.Validation.IsSet(val) === true)
		{
			if ((rtn.Unit === "%" || rtn.Unit === "em" || rtn.Unit === "rem") && widthObserverId === -1)
			{
				var prevWidth = me.GetDomElement().offsetWidth;
				var moTimeout = null;

				widthObserverId = Fit.Events.AddMutationObserver(me.GetDomElement(), function(elm)
				{
					var newWidth = me.GetDomElement().offsetWidth;

					if (prevWidth !== newWidth) // Width has changed
					{
						prevWidth = newWidth;

						if (moTimeout !== null) // Clear pending optimization
							clearTimeout(moTimeout);

						// Schedule optimization to prevent too many identical operations
						// in case observer fires several times almost simultaneously.
						moTimeout = setTimeout(function()
						{
							moTimeout = null;
							optimizeTabOrder();
						}, 250);
					}
				});
			}
			else
			{
				if (widthObserverId !== -1)
				{
					Fit.Events.RemoveMutationObserver(widthObserverId);
					widthObserverId = -1;
				}
			}

			// Immediately update tab flow when control width is changed

			optimizeTabOrder();
		}

		return rtn;
	});

	/// <function container="Fit.Controls.DropDown" name="DropDownMaxHeight" access="public" returns="object">
	/// 	<description> Get/set max height of drop down - returns object with Value (number) and Unit (string) properties </description>
	/// 	<param name="value" type="number" default="undefined"> If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content. </param>
	/// 	<param name="unit" type="string" default="undefined"> If defined, max height is updated to specified CSS unit, otherwise px is assumed </param>
	/// </function>
    this.DropDownMaxHeight = function(value, unit)
    {
		Fit.Validation.ExpectNumber(value, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(value) === true)
		{
			maxHeight = { Value: value, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px")};

			if (picker !== null)
				picker.MaxHeight(maxHeight.Value, maxHeight.Unit);
		}

		return maxHeight;
    }

	/// <function container="Fit.Controls.DropDown" name="DropDownMaxWidth" access="public" returns="object">
	/// 	<description> Get/set max width of drop down - returns object with Value (number) and Unit (string) properties </description>
	/// 	<param name="value" type="number" default="undefined"> If defined, max width is updated to specified value. A value of -1 forces drop down to use control width. </param>
	/// 	<param name="unit" type="string" default="undefined"> If defined, max width is updated to specified CSS unit, otherwise px is assumed </param>
	/// </function>
    this.DropDownMaxWidth = function(value, unit)
    {
		Fit.Validation.ExpectNumber(value, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(value) === true)
		{
			if (value !== -1)
			{
				dropDownMenu.style.width = "auto"; // Adjust width to content
				dropDownMenu.style.maxWidth = value + ((Fit.Validation.IsSet(unit) === true) ? unit : "px");
			}
			else
			{
				dropDownMenu.style.width = "";
				dropDownMenu.style.maxWidth = "";
			}
		}

		var res = { Value: -1, Unit: "px" };

		if (dropDownMenu.style.maxWidth !== "")
		{
			res.Value = parseFloat(dropDownMenu.style.maxWidth);
			res.Unit = dropDownMenu.style.maxWidth.replace(res.Value, "");
		}

		return res;
    }

	// ControlBase interface

	// See documentation on ControlBase
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		// Set

		if (Fit.Validation.IsSet(val) === true)
		{
			orgSelection = [];
			var fireChange = (getSelectionElements().length > 0 || val !== ""); // Fire OnChange if current selections are cleared, and/or if new selections are set

			me._internal.ExecuteWithNoOnChange(function()
			{
				me.Clear();

				if (val !== "")
				{
					Fit.Array.ForEach(val.split(";"), function(item)
					{
						var info = item.split("=");

						if (info.length === 2) // Format: title1=val1;title2=val2;title3=val3
							me.AddSelection(decodeReserved(info[0]), decodeReserved(info[1]));
						else // Format: val1;val2;val3
							me.AddSelection(decodeReserved(info[0]), decodeReserved(info[0]));
					});
				}
			});

			orgSelections = me.GetSelections();

			if (fireChange === true)
				fireOnChange();
		}

		// Get

		var selections = me.GetSelections(); // Invalid selections excluded
		var value = "";

		Fit.Array.ForEach(selections, function(item)
		{
			value += ((value !== "") ? ";" : "") + encodeReserved(item.Title) + "=" + encodeReserved(item.Value);
		});

		return value;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		return (Fit.Core.IsEqual(orgSelections, me.GetSelections()) === false); // Invalid selections excluded
	}

	// See documentation on ControlBase
	this.Clear = function()
	{
		me.ClearSelections();
	}

	// See documentation on ControlBase
    this.Focused = function(val)
    {
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true)
			{
				var c = txtPrimary; //txtActive;
				var v = c.value;

				// Set focus
				c.focus();

				// Make cursor move to end
				c.value = "";
				c.value = v;
			}
			else if (val === false && txtActive === document.activeElement)
			{
				me.CloseDropDown();
				txtActive.blur();
			}
		}

		return (txtActive === document.activeElement);
    }

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		// This will destroy control - it will no longer work!

		if (picker !== null)
			picker.Dispose();

		me = itemContainer = hidden = spanFitWidth = txtPrimary = txtCssWidth = txtActive = txtEnabled = dropDownMenu = picker = orgSelections = invalidMessage = initialFocus = maxHeight = prevValue = focusAssigned = visibilityObserverId = widthObserverId = partiallyHidden = onInputChangedHandlers = onPasteHandlers = onOpenHandlers = onCloseHandlers = null;

		base();
	});

	// Misc. options

	/// <function container="Fit.Controls.DropDown" name="MultiSelectionMode" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether control allows for multiple selections </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables multi selection mode, False disables it </param>
	/// </function>
    this.MultiSelectionMode = function(val)
    {
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && me.MultiSelectionMode() !== val)
		{
			me.ClearSelections();
			me._internal.Data("multiselect", val.toString());
			optimizeTabOrder();
		}

		return (me._internal.Data("multiselect") === "true");
    }

    // Controlling selections

	var suppressUpdateItemSelectionState = false;
	var suppressOnItemSelectionChanged = false;

	/// <function container="Fit.Controls.DropDown" name="GetPicker" access="public" returns="Fit.Controls.PickerBase">
	/// 	<description> Get picker control used to add items to drop down control </description>
	/// </function>
	this.GetPicker = function()
	{
		return picker;
	}

	/// <function container="Fit.Controls.DropDown" name="SetPicker" access="public">
	/// 	<description> Set picker control used to add items to drop down control </description>
	/// 	<param name="pickerControl" type="Fit.Controls.PickerBase"> Picker control extending from PickerBase </param>
	/// </function>
	this.SetPicker = function(pickerControl)
	{
		Fit.Validation.ExpectInstance(pickerControl, Fit.Controls.PickerBase, true);

		// Remove existing picker

		if (picker !== null)
			Fit.Dom.Remove(picker.GetDomElement());

		// Add picker

		if (!pickerControl)
		{
			picker = null;
			return;
		}

		pickerControl._internal.Initialize();

		picker = pickerControl;
		Fit.Dom.Add(dropDownMenu, picker.GetDomElement());

		picker.SetEventDispatcher(txtActive);

		// Allow picker to select items in case selections have already been set in drop down

		suppressOnItemSelectionChanged = true;
		picker.SetSelections(me.GetSelections());
		suppressOnItemSelectionChanged = false;

		// Set picker MaxHeight

		picker.MaxHeight(maxHeight.Value, maxHeight.Unit);

		// Make sure OnItemSelectionChanged is only registered once

		if (!picker._internal)
			picker._internal = {};

		if (picker._internal.HostControl)
			return;

		picker._internal.HostControl = me;

		// Register OnItemSelectionChanged handler which is used to
		// synchronize selections from picker control to drop down.

		var fireChangeEvent = false;

		picker.OnItemSelectionChanged(function(sender, eventArgs)
		{
			if (suppressOnItemSelectionChanged === true)
				return; // Skip - already processing OnItemSelectionChanged - may be invoked multiple times if e.g. switching selection in Single Selection Mode (existing item removed + new item selected)

			var txt = null;

			// Prevent this.AddSelection and this.RemoveSelection from calling
			// picker.UpdateItemSelection which in turn fires OnItemSelectionChanged, causing an infinite loop.
			suppressUpdateItemSelectionState = true;

			if (eventArgs.Selected === true && me.GetSelectionByValue(eventArgs.Value) === null) // Check whether node is already selected (PreSelection)
			{
				fireChangeEvent = true;

				// Changing a selection in the picker control may cause OnItemSelectionChanged to be fired multiple
				// times since an existing selection may first be deselected, followed by new item being selected.
				// In this case we suppress OnChange fired by RemoveSelection(..) and AddSelection(..), and instead
				// fire it when picker's OnItemSelectionComplete event is fired.
				me._internal.ExecuteWithNoOnChange(function() { me.AddSelection(eventArgs.Title, eventArgs.Value); });

				if (me.MultiSelectionMode() === false)
					me.CloseDropDown();
			}
			else if (eventArgs.Selected === false && me.GetSelectionByValue(eventArgs.Value) !== null)
			{
				fireChangeEvent = true;

				txt = txtActive; // RemoveSelection changes txtActive

				// Changing a selection in the picker control may cause OnItemSelectionChanged to be fired multiple
				// times since an existing selection may first be deselected, followed by new item being selected.
				// In this case we suppress OnChange fired by RemoveSelection(..) and AddSelection(..), and instead
				// fire it when picker's OnItemSelectionComplete event is fired.
				me._internal.ExecuteWithNoOnChange(function() { me.RemoveSelection(eventArgs.Value) });

				// Fix - if item removed was the last item, and txtActive
				// was one of the input fields belonging to that selection,
				// it will now have been removed.
				if (txt.parentElement.parentElement === null)
					txt = txtPrimary;
			}

			focusInput(((txt !== null) ? txt : txtActive));

			suppressUpdateItemSelectionState = false;
		});

		picker.OnItemSelectionComplete(function(sender)
		{
			if (suppressOnItemSelectionChanged === true)
				return;

			// Picker may notify about selections that has already been
			// made due to PreSelections (nodes are selected when loaded).
			// Only fire OnChange if control value has actually changed.
			if (fireChangeEvent === true)
			{
				me._internal.FireOnChange();
				fireChangeEvent = false;
			}
		});
	}

	/// <function container="Fit.Controls.DropDown" name="AddSelection" access="public">
	/// 	<description> Add selection to control </description>
	/// 	<param name="title" type="string"> Item title </param>
	/// 	<param name="value" type="string"> Item value </param>
	/// 	<param name="valid" type="boolean" default="true">
	/// 		Flag indicating whether selection is valid or not. Invalid selections are highlighted and
	/// 		not included when selections are retrived using Value() function, and not considered when
	/// 		IsDirty() is called to determine whether control value has been changed by user.
	/// 		GetSelections(true) can be used to retrive all items, including invalid selections.
	/// 	</param>
	/// </function>
    this.AddSelection = function(title, value, valid)
    {
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(valid, true);

        if (me.GetSelectionByValue(value) !== null)
            return;

		// Update picker control

		// Notice: suppressUpdateItemSelectionState is True if item was added by picker,
		// in which case picker.UpdateItemSelection(..) should not be called.
		// What happens is that picker fires drop down's OnItemSelectionChanged when an item is
		// selected, which sets suppressUpdateItemSelectionState to True, and calls AddSelection.
		// Failing to prevent picker.UpdateItemSelection(..) from being called in this case could
		// result in an infinite loop.
		if (picker !== null && suppressUpdateItemSelectionState === false)
		{
			// Notice: Picker fires OnItemSelectionChanged when picker.UpdateItemSelection(..) is invoked
			// below (other controls than DropDown may have registered an OnItemSelectionChanged
			// handler too). In this case we set suppressOnItemSelectionChanged to True, causing
			// drop down to do nothing in OnItemSelectionChanged handler when fired. Drop down's OnItemSelectionChanged
			// handler is responsible for handling items added/removed by picker, but in this case the change did not
			// come from the picker (since suppressUpdateItemSelectionState is False).
			// Failing to set this flag could result in an infinite loop.
			suppressOnItemSelectionChanged = true;

			var res = true;
			var error = null;

			try // Make sure we can set suppressOnItemSelectionChanged false again, so drop down remains in a functioning state
			{
				res = picker.UpdateItemSelection(value, true);
			}
			catch (err) { error = err; }

			suppressOnItemSelectionChanged = false;

			if (error !== null)
				Fit.Validation.ThrowError(error);

			if (res === false)
				return; // Picker prevented selection from being added
		}

        // Clear selection if in Single Selection Mode

		if (me.MultiSelectionMode() === false)
		{
			var error = null;

			// ClearSelections() results in picker.UpdateItemSelection(..) being called if an item is currently selected,
			// eventually resulting in picker firing OnItemSelectionChanged and OnItemSelectionComplete. However, operation has
			// not completed yet, since new element has not yet been selected (done below). Skip events.
			suppressOnItemSelectionChanged = true;

			try // Make sure we can set suppressOnItemSelectionChanged false again, so drop down remains in a functioning state
			{
				me._internal.ExecuteWithNoOnChange(function() { me.ClearSelections(); });
			}
			catch (err) { error = err; }

			suppressOnItemSelectionChanged = false;

			if (error !== null)
				Fit.Validation.ThrowError(error);

			if (getSelectionElements().length > 0) // A picker prevented selected item from being removed
				return;
		}

		// Create new item

		// Delete button
		var cmdDelete = document.createElement("i");
		Fit.Dom.AddClass(cmdDelete, "fa");
		Fit.Dom.AddClass(cmdDelete, "fa-times");
		cmdDelete.onclick = function(e)
        {
            me.RemoveSelection(decode(Fit.Dom.Data(cmdDelete.parentElement, "value")));

			focusInput(txtPrimary);

            // Do not open drop down when an item is removed
            Fit.Events.StopPropagation(e);
        }

		// Item container (left input, title box, right input)
        var container = document.createElement("span");

		// Input fields (left and right)
        var searchLeft = createSearchField();
        var searchRight = createSearchField();

		// Title box
        var item = document.createElement("span");
		Fit.Dom.Data(item, "value", encode(value)); // Value may contain special characters - encode to prevent value from breaking item

		// Set CSS class and mouse over for invalid selection
        if (valid === false)
		{
			Fit.Dom.Attribute(item, "title", invalidMessage);
			Fit.Dom.AddClass(item, "FitUiControlDropDownInvalid");
		}

		// Add title and delete button to title box
		Fit.Dom.Add(item, document.createTextNode(Fit.String.StripHtml(title)));
		Fit.Dom.Add(item, cmdDelete);

		// Add elements to item container
		Fit.Dom.Add(container, searchLeft);
		Fit.Dom.Add(container, item);
		Fit.Dom.Add(container, searchRight);

		// Add new item

        var before = null;

		if (txtActive !== txtPrimary && me.MultiSelectionMode() === true && Fit.Dom.GetIndex(txtActive) === 0) // Left input
			before = txtActive.parentElement;
		else if (txtActive !== txtPrimary && me.MultiSelectionMode() === true && Fit.Dom.GetIndex(txtActive) === 2) // Right input
			before = txtActive.parentElement.nextSibling;
		else
			before = txtPrimary;

        itemContainer.insertBefore(container, before);

		// Clear input control value

        me.ClearInput();

		// Optimize tab order

		if (Fit.Dom.IsVisible(me.GetDomElement()) === true)
		{
			// Controls is visible - immediately optimize tab order

			if (me.MultiSelectionMode() === true)
				optimizeTabOrder(item); // Optmize tab order for this particular item only - disables right search field (tabIndex = -1) if item is wider than control
			else
				optimizeTabOrder(); // Update tab flow and partiallyHidden variable
		}
		else
		{
			// Control is hidden or not rooted - optimize tab order once it becomes visible

			// Register mutation observer if not already registered
			if (tabOrderObserverId === -1)
			{
				tabOrderObserverId = Fit.Events.AddMutationObserver(me.GetDomElement(), function(elm)
				{
					if (Fit.Dom.IsVisible(me.GetDomElement()) === true)
					{
						optimizeTabOrder();
						disconnect(); // Observers are expensive - remove when no longer needed
						tabOrderObserverId = -1;
					}
				});
			}
		}

		// Focus input control

        if (me.MultiSelectionMode() === true)
        {
			// Make input to the right of newly added item active. This to make sure that
            // the next item added appears to the right of the previously added item.
            // If a left input field is selected, it remains focused, as the new element
            // is added in front of the left input field.
			if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2)
			{
				if (searchRight.tabIndex !== -1) // Select right search field if not taken out of tab flow (see optimizeTabOrder(item) above)
					focusInput(searchRight);
				else if (container.nextSibling.tagName === "SPAN") // Right search field has been taken out of flow - use left search field in following item if found
					focusInput(container.nextSibling.children[0]);
			}
        }
		else
		{
			// Focus primary search field in Single Selection Mode, unless selected item is partially hidden,
			// in which case the first input field (left side) is focused instead, since txtPrimary will also
			// have been hidden due to word wrapping being disabled in Single Selection Mode.

			focusInput(((partiallyHidden !== null) ? partiallyHidden.previousSibling : txtPrimary)); // partiallyHidden.previousSibling is the same as searchLeft
		}

		// Fire OnChange event

		fireOnChange();
    }

	/// <function container="Fit.Controls.DropDown" name="GetSelections" access="public" returns="array">
	/// 	<description> Get selected items - returned array contain objects with Title (string), Value (string), and Valid (boolean) properties </description>
	/// 	<param name="includeInvalid" type="boolean" default="false"> Flag indicating whether invalid selection should be included or not </param>
	/// </function>
    this.GetSelections = function(includeInvalid)
    {
		Fit.Validation.ExpectBoolean(includeInvalid, true);

		var selections = Fit.Array.ToArray(itemContainer.children); // Convert NodeList to JS Array, since RemoveAt takes an instance of Array

		// Remove two last elements from array which are not selections (primary input field and arrow button)
		Fit.Array.RemoveAt(selections, selections.length - 1);
		Fit.Array.RemoveAt(selections, selections.length - 1);

        var toReturn = [];
		Fit.Array.ForEach(selections, function(selection)
		{
			if (includeInvalid === true || Fit.Dom.HasClass(selection.children[1], "FitUiControlDropDownInvalid") === false)
				Fit.Array.Add(toReturn, { Title: Fit.Dom.Text(selection.children[1]), Value: decode(Fit.Dom.Data(selection.children[1], "value")), Valid: !Fit.Dom.HasClass(selection.children[1], "FitUiControlDropDownInvalid") });
		});
        return toReturn;
    }

	/// <function container="Fit.Controls.DropDown" name="GetSelectionByValue" access="public" returns="object">
	/// 	<description> Get selected item by value - returns object with Title (string), Value (string), and Valid (boolean) properties if found, otherwise Null is returned </description>
	/// 	<param name="val" type="string"> Value of selected item to retrive </param>
	/// </function>
    this.GetSelectionByValue = function(val)
    {
		Fit.Validation.ExpectString(val);

		var found = null;
		Fit.Array.ForEach(me.GetSelections(), function(selection)
		{
			if (selection.Value === val)
			{
				found = selection;
				return false; // Break loop
			}
		});
        return found;
    }

	/// <function container="Fit.Controls.DropDown" name="ClearSelections" access="public">
	/// 	<description> Clear selections </description>
	/// </function>
    this.ClearSelections = function()
    {
        var selections = getSelectionElements();
        var fireEvent = false;
		var wasFocused = focusAssigned; // Removing an input from DOM fires OnBlur which sets focusAssigned to False

		me._internal.ExecuteWithNoOnChange(function() // picker.UpdateItemSelection results in OnChange being fired
		{
			Fit.Array.ForEach(getSelectionElements(), function(selection)
			{
				if (picker !== null)
				{
					var res = picker.UpdateItemSelection(decode(Fit.Dom.Data(selection, "value")), false); // OnItemSelectionChanging and OnItemSelectionChanged are fired if picker recognizes item, causing it to be removed in drop down's OnItemSelectionChanged handler (unless canceled, in which case False is returned)

					if (res !== false && selection.parentElement.parentElement !== null)
					{
						// Element was not removed (still rooted in DOM), because picker did not recognize
						// it (did not fire OnItemSelectionChanged) which would otherwise have triggered Drop
						// Down's OnItemSelectionChanged handler, which in turn would have called RemoveSelection.
						// And we know it did not cancel change since picker.UpdateItemSelection did not return False.
						// It is fine to remove item.
						Fit.Dom.Remove(selection.parentElement);
					}

					if (res !== false)
						fireEvent = true;
				}
				else
				{
					Fit.Dom.Remove(selection.parentElement);
					fireEvent = true;
				}
			});
		});

		focusAssigned = wasFocused;

		optimizeTabOrder();
		focusInput(txtPrimary);

        if (fireEvent === true)
            fireOnChange();
    }

	/// <function container="Fit.Controls.DropDown" name="RemoveSelection" access="public">
	/// 	<description> Remove selected item by value </description>
	/// 	<param name="value" type="string"> Value of selected item to remove </param>
	/// </function>
    this.RemoveSelection = function(value)
    {
		Fit.Validation.ExpectString(value);

		// Update picker control.
		// Notice: suppressUpdateItemSelectionState is True if item was removed by picker,
		// in which case picker.UpdateItemSelection(..) should not be called.
		// What happens is that picker fires drop down's OnItemSelectionChanged when an item is
		// deselected, which sets suppressUpdateItemSelectionState to True, and calls RemoveSelection.
		// Failing to prevent picker.UpdateItemSelection(..) from being called in this case could
		// result in an infinite loop.
		if (picker !== null && suppressUpdateItemSelectionState === false)
		{
			// Notice: Picker fires OnItemSelectionChanged when picker.UpdateItemSelection(..) is invoked
			// below (other controls than DropDown may have registered an OnItemSelectionChanged
			// handler too). In this case we set suppressOnItemSelectionChanged to True, causing
			// drop down to do nothing in OnItemSelectionChanged handler when fired. Drop down's OnItemSelectionChanged
			// handler is responsible for handling items added/removed by picker, but in this case the change did not
			// come from the picker (since suppressUpdateItemSelectionState is False).
			// Failing to set this flag could result in an infinite loop.
			suppressOnItemSelectionChanged = true;

			var res = false;
			var error = null;

			try // Make sure we can set suppressOnItemSelectionChanged false again, so drop down remains in a functioning state
			{
				res = picker.UpdateItemSelection(value, false);
			}
			catch (err) { error = err; }

			suppressOnItemSelectionChanged = false;

			if (error !== null)
				Fit.Validation.ThrowError(error);

			if (res === false)
				return; // Picker prevented selection from being removed
		}

        var changed = false;
		var wasFocused = focusAssigned; // Removing an input from DOM causes OnBlur to fire, which sets focusAssigned to False
		var txt = null;

		Fit.Array.ForEach(getSelectionElements(), function(selection)
        {
			if (decode(Fit.Dom.Data(selection, "value")) === value)
            {
				if (me.MultiSelectionMode() === true && selection.parentElement.nextSibling !== null && selection.parentElement.nextSibling !== txtPrimary)
                    txt = selection.parentElement.nextSibling.children[0];

				Fit.Dom.Remove(selection.parentElement);
                changed = true;

                return false;
            }
        });

		focusAssigned = wasFocused; // Restore focusAssigned to make sure focusInput(..) works

		if (me.MultiSelectionMode() === false)
		{
			optimizeTabOrder();
			focusInput(((partiallyHidden !== null) ? partiallyHidden.previousSibling : txtPrimary));
		}
		else
		{
			if (getSelectionElements().length === 0)
				optimizeTabOrder(); // Make sure txtPrimary can receive focus using Tab or Shift+Tab

			focusInput(((txt !== null) ? txt : txtPrimary));
		}

        if (changed === true)
            fireOnChange();
    }

    // Controlling input field

	/// <function container="Fit.Controls.DropDown" name="ClearInput" access="public">
	/// 	<description> Clear text field </description>
	/// </function>
    this.ClearInput = function(input)
    {
		Fit.Validation.ExpectInstance(input, HTMLInputElement, true);

        var inp = ((Fit.Validation.IsSet(input) === true) ? input : txtActive);

		if (inp.value === "")
			return;

        inp.value = "";
		inp.style.width = "";

		fireOnInputChanged("");

		// Resetting width (above): Seems to be buggy with Chrome+SharePoint. Input sometime retains width and is incorrectly positioned above selected items,
		// which does not happen with IE and Firefox. Releasing JS thread using setTimeout solves the problem, but it will only work when input argument is passed,
		// since txtActive may change during execution (e.g. if ClearInput is called from clearAllInputsButActive).
		// Perhaps forcing a repaint using either zoom in CSS, or by temporarily assigning a CSS class, may also fix the problem.
    }

	/// <function container="Fit.Controls.DropDown" name="SetInputValue" access="public">
	/// 	<description>
	/// 		Set value of text field which is automatically cleared the first time control
	/// 		receives focus. Notice that this function should be called after AddSelection(..),
	/// 		since adding selections causes the value of the text field to be cleared.
	/// 	</description>
	/// 	<param name="val" type="string"> New value for text field </param>
	/// </function>
    this.SetInputValue = function(val)
    {
		Fit.Validation.ExpectString(val);

		if (txtActive.value === val)
			return;

		txtActive.value = "";
		txtActive.style.width = "";

		var txt = ((focusAssigned === true) ? txtActive : txtPrimary);

		if (partiallyHidden !== null)
			txt = partiallyHidden.previousSibling;

		txt.value = val;
		txtActive = txt;

		fitWidthToContent(txt);
		fireOnInputChanged(txt.value);

		// Fix for hidden or non-rooted control, in which case fitWidthToContent(..) won't work and txt.offsetWidth remains 0.
		// Register mutation observer which is invoked when control is rooted, or when DOMElement hiding control becomes visible.

		if (visibilityObserverId !== -1) // Cancel any mutation observer previously registered
		{
			Fit.Events.RemoveMutationObserver(visibilityObserverId);
			visibilityObserverId = -1;
		}

		if (val.length > 0 && txt.offsetWidth === 0)
		{
			var observe = null;

			if (Fit.Dom.IsRooted(txt) === false)
				observe = txt;
			else
				observe = Fit.Dom.GetConcealer(txt); // Returns Null if not concealed (hidden)

			if (observe !== null)
			{
				visibilityObserverId = Fit.Events.AddMutationObserver(observe, function(elm)
				{
					if (Fit.Dom.IsVisible(txt) === true)
					{
						fitWidthToContent(txt);
						disconnect(); // Observers are expensive - remove when no longer needed
						visibilityObserverId = -1;
					}
				});
			}
		}
    }

	/// <function container="Fit.Controls.DropDown" name="GetInputValue" access="public" returns="string">
	/// 	<description> Get input value </description>
	/// </function>
	this.GetInputValue = function()
	{
		return txtActive.value;
	}

	/// <function container="Fit.Controls.DropDown" name="InputEnabled" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether input is enabled </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables input, False disables it </param>
	/// </function>
	this.InputEnabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			txtEnabled = val;
		}

		return txtEnabled;
	}

    // Controlling drop down menu

	/// <function container="Fit.Controls.DropDown" name="OpenDropDown" access="public">
	/// 	<description> Open drop down menu </description>
	/// </function>
    this.OpenDropDown = function()
    {
		if (dropDownMenu.style.display === "block")
			return;

        if (Fit._internal.DropDown.Current !== null && Fit._internal.DropDown.Current !== me)
            Fit._internal.DropDown.Current.CloseDropDown();

		dropDownMenu.style.minWidth = me.GetDomElement().offsetWidth + "px"; // In case DropDownMaxWidth(..) is set - update every time drop down is opened in case viewport is resized and has changed control width
        dropDownMenu.style.display = "block";

        Fit._internal.DropDown.Current = me;

        fireOnDropDownOpen();
    }

	/// <function container="Fit.Controls.DropDown" name="CloseDropDown" access="public">
	/// 	<description> Close drop down menu </description>
	/// </function>
    this.CloseDropDown = function()
    {
		if (dropDownMenu.style.display === "none")
			return;

        dropDownMenu.style.display = "none";

        Fit._internal.DropDown.Current = null;

        fireOnDropDownClose();
    }

	/// <function container="Fit.Controls.DropDown" name="IsDropDownOpen" access="public" returns="boolean">
	/// 	<description> Get flag indicating whether drop down is open or not </description>
	/// </function>
    this.IsDropDownOpen = function()
    {
        return (dropDownMenu.style.display === "block");
    }

	// ============================================
	// Events (OnChange defined on BaseControl)
	// ============================================

	/// <function container="Fit.Controls.DropDown" name="OnInputChanged" access="public">
	/// 	<description>
	/// 		Add event handler fired when input value is changed.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.DropDown) and Value (string).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnInputChanged = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onInputChangedHandlers, cb);
	}

	/// <function container="Fit.Controls.DropDown" name="OnPaste" access="public">
	/// 	<description>
	/// 		Add event handler fired when text is pasted into input field.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.DropDown) and Value (string).
	/// 		Return False to cancel event and change, and prevent OnInputChanged from firing.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnPaste = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPasteHandlers, cb);
	}

	/// <function container="Fit.Controls.DropDown" name="OnOpen" access="public">
	/// 	<description>
	/// 		Add event handler fired when drop down menu is opened.
	/// 		Function receives one argument: Sender (Fit.Controls.DropDown)
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnOpen = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onOpenHandlers, cb);
	}

	/// <function container="Fit.Controls.DropDown" name="OnClose" access="public">
	/// 	<description>
	/// 		Add event handler fired when drop down menu is closed.
	/// 		Function receives one argument: Sender (Fit.Controls.DropDown)
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnClose = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onCloseHandlers, cb);
	}

    // ============================================
	// Private
	// ============================================

    function createSearchField()
    {
        var txt = document.createElement("input");
        txt.autocomplete = "off";

        txt.onpaste = function(e)
        {
			var orgValue = txt.value;

            setTimeout(function() // Timeout to queue event to have pasted value available
            {
				var pastedValue = txt.value;

				if (fireOnPaste(txt.value) === true)
				{
					fitWidthToContent(txt);
					fireOnInputChanged(txt.value);
				}
				else
				{
					// Paste canceled - restore old value, unless OnPaste handler called SetInputValue with a different value

					if (txt.value === pastedValue)
						txt.value = orgValue;
				}
            }, 0);
        }

        txt.onfocus = function(e)
        {
			focusAssigned = true;

            if (initialFocus === true)
            {
                initialFocus = false;
                me.ClearInput(txtPrimary);
            }

            txtActive = txt;
			prevValue = txtActive.value;

			clearAllInputsButActive();

			if (picker !== null)
				picker.SetEventDispatcher(txtActive);
        }

		txt.onblur = function(e)
		{
			focusAssigned = false;
		}

		var timeOutId = null;

        txt.onkeydown = function(e) // Fires continuously for any key pressed - both characters and e.g backspace/delete/arrows etc. Key press may be canceled (change has not yet occured)
        {
			var ev = Fit.Events.GetEvent(e);

            txtActive = txt;
            clearAllInputsButActive();

			if (picker !== null)
			{
				//picker.SetEventDispatcher(txtActive);

				if (me.IsDropDownOpen() === true)
				{
					var res = picker.HandleEvent(ev);

					if (res === false)
						return; // Picker returned False to prevent DropDown from also handling event
				}
			}

            if (ev.keyCode === 9) // Tab
            {
                if (ev.shiftKey === true) // Moving left
                {
                    if (me.GetSelections().length === 0)
                    {
                        me.CloseDropDown();
                        return;
                    }
                    else if (txt !== txtPrimary && txt.parentElement.previousSibling === null)
                    {
                        me.CloseDropDown();
                        return;
                    }

                    moveToInput("Prev");
                }
                else // Moving right
                {
					if (me.MultiSelectionMode() === false && partiallyHidden !== null)
					{
						// Let browser handle navigation - only left input control can receive focus at this point

						me.CloseDropDown();
						return;
					}
					else if (txt === txtPrimary)
                    {
                        me.CloseDropDown();
                        return;
                    }

                    moveToInput("Next");
                }

                return false;
            }
            else if (ev.keyCode === 38) // Arrow up
            {
                me.OpenDropDown(); // Make sure it is opened
            }
            else if (ev.keyCode === 40) // Arrow down
            {
                me.OpenDropDown(); // Make sure it is opened
            }
            else if (ev.keyCode === 37) // Arrow left
            {
                moveToInput("Prev");
            }
            else if (ev.keyCode === 39) // Arrow right
            {
				if (me.MultiSelectionMode() === false && partiallyHidden !== null)
					return;

                moveToInput("Next");
            }
            else if (ev.keyCode === 27) // Escape
            {
                me.CloseDropDown();
            }
            else if (ev.keyCode === 8) // Backspace - remove selection
            {
                if (txt.value.length === 0)
                {
                    var toRemove = null;

					if (txt !== txtPrimary && Fit.Dom.GetIndex(txt) === 2) // Right input
                        toRemove = txt.parentElement;
					else if (txt !== txtPrimary && Fit.Dom.GetIndex(txt) === 0 && txt.parentElement.previousSibling !== null) // Left input
                        toRemove = txt.parentElement.previousSibling;
					else if (txt.previousSibling !== null) // Primary input
                        toRemove = txt.previousSibling;

                    if (toRemove !== null)
                    {
						// Update focus if input in item being removed has focus

                        if (toRemove.previousSibling !== null)
                            focusInput(toRemove.previousSibling.children[2]); // Focus right input in selection that comes before
						else if (toRemove.nextSibling.tagName === "SPAN")
                            focusInput(toRemove.nextSibling.children[0]); // Focus left input in selection that comes after (no more selection to the left of selection being removed)

                        me.RemoveSelection(decode(Fit.Dom.Data(toRemove.children[1], "value")));
                    }
                }
                else
                {
					if (timeOutId !== null)
						clearTimeout(timeOutId);

                    // New length is not known when removing characters until OnKeyUp is fired.
                    // We won't wait for that. Instead we calculate the width "once in a while".
                    // Passing txt instance rather than txtActive, as the latter may change before
                    // timeout is reached and delegate is executed.
                    timeOutId = setTimeout(function() { fitWidthToContent(txt); timeOutId = null; }, 50);
                }
            }
            else if (ev.keyCode === 46) // Delete - remove selection
            {
                if (txt.value.length === 0)
                {
                    var toRemove = null;

					if (txt !== txtPrimary && Fit.Dom.GetIndex(txt) === 0) // Left input
                        toRemove = txt.parentElement;
					else if (txt !== txtPrimary && Fit.Dom.GetIndex(txt) === 2 && txt.parentElement.nextSibling.tagName === "SPAN") // Right input
                        toRemove = txt.parentElement.nextSibling;

                    if (toRemove !== null)
                    {
						// Update focus if input in item being removed has focus

						if (toRemove.nextSibling.tagName === "SPAN")
							focusInput(toRemove.nextSibling.children[0]); // Focus left input in selection that comes after
                        else
                            focusInput(txtPrimary);

                        me.RemoveSelection(decode(Fit.Dom.Data(toRemove.children[1], "value")));
                    }
                }
                else
                {
					if (timeOutId !== null)
						clearTimeout(timeOutId);

                    // New length is not known when removing characters until OnKeyUp is fired.
                    // We won't wait for that. Instead we calculate the width "once in a while".
                    // Passing txt instance rather than txtActive, as the latter may change before
                    // timeout is reached and delegate is executed.
                    timeOutId = setTimeout(function() { fitWidthToContent(txt); timeOutId = null; }, 50);
                }
            }
			else if (ev.keyCode === 13) // Enter - notice that item selection is handled by (delegated to) picker when Enter is pressed - picker.OnItemSelectionChanged receives selected item
			{
				// Prevent form submit
				Fit.Events.PreventDefault(e);
			}
            else
            {
				if (txtEnabled === false)
				{
					Fit.Events.PreventDefault(ev);
					return;
				}

				if (timeOutId !== null)
					clearTimeout(timeOutId);

				var mods = Fit.Events.GetModifierKeys();

				if (mods.Ctrl === true || mods.Meta === true) // Queue operation to have value updated - this could be Ctrl/Cmd+X to cut or Ctrl/Cmd+V to paste
					timeOutId = setTimeout(function() { fitWidthToContent(txt); timeOutId = null; }, 0);
				else
					fitWidthToContent(txt, txt.value + String.fromCharCode(ev.keyCode | ev.charCode)); // TODO: Will not work properly if multiple characters are selected, and just one character is entered - the input field will obtain an incorrect width until next key stroke. The solution is NOT to always use setTimeout since the delayed update is noticeable.
            }
        }

		txt.onkeyup = function(e) // Fires only once when a key is released
        {
            var ev = Fit.Events.GetEvent(e);

            if (ev.keyCode !== 37 && ev.keyCode !== 38 && ev.keyCode !== 39 && ev.keyCode !== 40 && ev.keyCode !== 27 && ev.keyCode !== 9 && ev.keyCode !== 16 && ev.ctrlKey === false && ev.keyCode !== 17) // Do not fire change event for: arrow keys, escape, tab, shift, and on paste (never fires when CTRL is held down (ev.ctrlKey true) or released (ev.keyCode 17))
            {
				if (txt.value !== prevValue)
				{
					prevValue = txt.value;
					fireOnInputChanged(txt.value);
				}
            }
        }

        txt.onclick = function(e)
        {
            Fit.Events.StopPropagation(e);
        }

        return txt;
    }

    function getSelectionElements() // Return spans containing Title and Value (also include elements marked as invalid selections)
    {
		return itemContainer.querySelectorAll("span[data-value]");
    }

    function fitWidthToContent(input, val) // Set width of input field equivalent to its content
    {
		Fit.Validation.ExpectInstance(input, HTMLInputElement);
		Fit.Validation.ExpectString(val, true);

        var value = ((Fit.Validation.IsSet(val) === true) ? val : input.value);

        // Width of txtPrimary cannot reliably be determined initially if picker is hidden.
        // Re-calculating when fitWidthToContent gets called again when the picker is visible.
        if (txtCssWidth <= 0)
            txtCssWidth = txtPrimary.offsetWidth; // Notice: offsetWidth returns 0 if picker is hidden using display:none

		spanFitWidth.innerHTML = value;
		var newWidth = (((value !== "") ? spanFitWidth.offsetWidth : 0) + txtCssWidth);

		// Make sure new input width does not exceed width of drop down control
		var offsetLeft = Fit.Dom.GetInnerPosition(input, itemContainer).X;
		var innerWidth = Fit.Dom.GetInnerWidth(itemContainer);
		newWidth = ((offsetLeft + newWidth > innerWidth) ? innerWidth - offsetLeft : newWidth);

		input.style.width = newWidth + "px";
    }

    function moveToInput(direction) // direction = Next/Prev
    {
		Fit.Validation.ExpectString(direction);

        var newInput = null;

        if (direction === "Prev") // Moving left
        {
			if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 0 && txtActive.parentElement.previousSibling !== null) // Left input has focus
				newInput = txtActive.parentElement.previousSibling.children[0];
			else if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2) // Right input has focus
				newInput = txtActive.parentElement.children[0];
			else if (txtActive.previousSibling !== null) // Primary input has focus
				newInput = txtActive.previousSibling.children[0];
        }
        else // Moving right
        {
			// TODO: Clean up - remove disabled code below - has been replaced by more compact code below it
			/*if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 0) // Left input has focus
			{
				var itemContainer = txtActive.parentElement;

				if (itemContainer.children[2].tabIndex !== -1) // Focus right search field in next item if not taken out of tab flow
					newInput = itemContainer.children[2];
				else if (itemContainer.nextSibling.tagName === "SPAN") // Next item's right search field has been taken out of flow - focus left search field in following item if found
					newInput = itemContainer.nextSibling.children[0];
				else // No more elements available, focus primary search field
					newInput = txtPrimary;
			}
			else if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2 && txtActive.parentElement.nextSibling.tagName === "SPAN") // Right input has focus
			{
				var nextItemContainer = txtActive.parentElement.nextSibling;

				if (nextItemContainer.children[2].tabIndex !== -1) // Focus right search field in next item if not taken out of tab flow
					newInput = nextItemContainer.children[2];
				else if (nextItemContainer.nextSibling.tagName === "SPAN") // Next item's right search field has been taken out of flow - focus left search field in following item if found
					newInput = nextItemContainer.nextSibling.children[0];
				else // No more elements available, focus primary search field
					newInput = txtPrimary;
			}*/

			var itemContainer = null; // Remains Null if last item's right input control has focus (unlikely since it will never be focused unless user manages to actually click it (5px wide)

			if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 0) // Left input has focus
				itemContainer = txtActive.parentElement; // Use current item
			else if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2 && txtActive.parentElement.nextSibling.tagName === "SPAN") // Right input has focus
				itemContainer = txtActive.parentElement.nextSibling; // Use next item

			if (itemContainer !== null)
			{
				if (itemContainer.children[2].tabIndex !== -1) // Focus right search field if not taken out of tab flow
					newInput = itemContainer.children[2];
				else if (itemContainer.nextSibling.tagName === "SPAN") // Right search field has been taken out of flow - focus left search field in following item if found
					newInput = itemContainer.nextSibling.children[0];
				else // No more elements available, focus primary search field - happens in Multi Selection Mode if last item is partially hidden due to overflow (item wider than control)
					newInput = txtPrimary;
			}

			// If newInput is last selection's right input field, then select txtPrimary instead
			if (newInput !== null && newInput.parentElement.nextSibling === txtPrimary && Fit.Dom.GetIndex(newInput) === 2)
				newInput = txtPrimary;
        }

        if (newInput === null) // May be null if no selections are available to move to
            return;

		// Move content
		/*newInput.value = txtActive.value;
		me.ClearInput();
		fitWidthToContent(newInput);*/

		focusInput(newInput);
    }

    function focusInput(input)
    {
		Fit.Validation.ExpectInstance(input, HTMLInputElement);

        txtActive = input;

		if (focusAssigned === true) // Only set focus if user initially assigned focus to control
			txtActive.focus(); // Input's OnFocus handler calls picker.SetEventDispatcher(..)
		else if (/*focusAssigned === false &&*/ picker !== null) // User did not give focus to control, manually call SetEventDispatcher(..) on picker control
			picker.SetEventDispatcher(txtActive);
    }

    function clearAllInputsButActive()
    {
        var inputs = itemContainer.getElementsByTagName("input");

		Fit.Array.ForEach(inputs, function(input)
		{
			if (input === txtActive)
                return;

            me.ClearInput(input);
		});
    }

	function optimizeTabOrder(item)
	{
		Fit.Validation.ExpectDomElement(item, true);

		// Fix tab order for passed item only

		if (Fit.Validation.IsSet(item) === true) // Used in Multi Selection Mode only
		{
			if (item.parentElement.offsetWidth + 1 > Fit.Dom.GetInnerWidth(itemContainer)) // Adding 1px to offsetWidth - otherwise right aligned cursor may become hidden behind drop down arrow box
				item.nextSibling.tabIndex = -1; // Item is partially hidden - disable right search field

			return;
		}

		// Fix tab navigation by taking input controls out of tab flow if hidden due to overflow

		if (me.MultiSelectionMode() === false) // Single Selection Mode
		{
			var selections = getSelectionElements();
			partiallyHidden = ((selections.length > 0 && selections[0].parentElement.offsetWidth + 1 > Fit.Dom.GetInnerWidth(itemContainer)) ? selections[0] : null); // Adding 1px to offsetWidth - otherwise right aligned cursor may become hidden behind drop down arrow box

			var inputs = itemContainer.querySelectorAll("input");
			Fit.Array.ForEach(inputs, function(input)
			{
				input.tabIndex = ((partiallyHidden !== null) ? -1 : 0);
			});

			if (partiallyHidden !== null)
				inputs[0].tabIndex = 0;
		}
		else //  // Multi Selection Mode
		{
			partiallyHidden = null;

			Fit.Array.ForEach(getSelectionElements(), function(item)
			{
				if (item.parentElement.offsetWidth + 1 > Fit.Dom.GetInnerWidth(itemContainer)) // Adding 1px to offsetWidth - otherwise right aligned cursor may become hidden behind drop down arrow box
					item.nextSibling.tabIndex = -1; // Item is partially hidden - disable right search field
				else
					item.nextSibling.tabIndex = 0; // Fully visible - part of tab flow
			});
		}
	}

	function decodeReserved(str)
	{
		Fit.Validation.ExpectString(str);
		return str.replace(/%3B/g, ";").replace(/%3D/g, "=") // Decode characters reserved for value format: title1=value1;title2=value2;etc..
	}

	function encodeReserved(str)
	{
		Fit.Validation.ExpectString(str);
		return str.replace(/;/g, "%3B").replace(/=/g, "%3D") // Encode characters reserved for value format: title1=value1;title2=value2;etc..
	}

	function decode(str)
	{
		Fit.Validation.ExpectString(str);
		return decodeURIComponent(str);
	}

	function encode(str)
	{
		Fit.Validation.ExpectString(str);
		return encodeURIComponent(str);
	}

    // Event dispatchers

    function fireOnInputChanged(val)
    {
		Fit.Validation.ExpectString(val);

		Fit.Array.ForEach(onInputChangedHandlers, function(handler)
		{
			handler(me, val);
		});
    }

    function fireOnChange()
    {
		me._internal.FireOnChange();
    }

    function fireOnPaste(val)
    {
		Fit.Validation.ExpectString(val);

		var proceed = true;

		Fit.Array.ForEach(onPasteHandlers, function(handler)
		{
			if (handler(me, val) === false)
				proceed = false; // Do not cancel loop, allow all handlers to fire
		});

		return proceed;
    }

    function fireOnDropDownOpen()
    {
		Fit.Array.ForEach(onOpenHandlers, function(handler)
		{
			handler(me);
		});

		if (picker !== null)
			picker._internal.FireOnShow();
    }

    function fireOnDropDownClose()
    {
		Fit.Array.ForEach(onCloseHandlers, function(handler)
		{
			handler(me);
		});

		if (picker !== null)
			picker._internal.FireOnHide();
    }

	init();
}

Fit._internal.DropDown = {};
Fit._internal.DropDown.Current = null;

/*Fit.Controls.DropDown.Item = function()
{
	var title = null;
	var value = null;

	function init()
	{
		if (arguments.length === 1)
		{
			value = arguments[0];
		}
		else if (arguments.length === 2)
		{
			title = arguments[0];
			value = arguments[1];
		}

	}

	this.Title = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
			title = val;

		return title;
	}

	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
			value = val;

		return value;
	}

	init();
}*/
/// <container name="Fit.Controls.PickerBase">
/// 	Class from which all Picker Controls extend.
/// 	Control developers must override: GetDomElement, Destroy.
/// 	Overriding the following functions is optional:
/// 	UpdateItemSelectionState, SetEventDispatcher, HandleEvent.
/// 	Picker Control must fire OnItemSelectionChanging and OnItemSelectionChanged when an item's
/// 	selection state is being changed, which is done by invoking
/// 	this._internal.FireOnItemSelectionChanging(title:string, value:string, currentSelectionState:boolean)
/// 	and
/// 	this._internal.FireOnItemSelectionChanged(title:string, value:string, newSelectionState:boolean).
/// 	Notice that FireOnItemSelectionChanging may return False, which must prevent item from being
/// 	selected, and at the same time prevent FireOnItemSelectionChanged from being called.
/// 	Changing an item selection may cause OnItemSelectionChanging and OnItemSelectionChanged to be
/// 	fired multiple times (e.g. if picker needs to first deselect one item before selecting another one).
/// 	Therefore PickerBase also features the OnItemSelectionComplete event which must be fired when related
/// 	changes complete, which is done by invoking this._internal.FireOnItemSelectionComplete().
/// 	OnItemSelectionComplete should only fire if a change was made (changes can be canceled using
/// 	OnItemSelectionChanging).
/// </container>
Fit.Controls.PickerBase = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);

	// Support for Fit.Controls.Find(..)

	if (Fit.Validation.IsSet(controlId) === true)
	{
		if (Fit._internal.ControlBase.Controls[controlId] !== undefined)
			Fit.Validation.ThrowError("Control with ID '" + controlId + "' has already been defined - Control IDs must be unique!");

		Fit._internal.ControlBase.Controls[controlId] = this;
	}

	// Private variables

	var me = this;
	var id = (controlId ? controlId : null);

	var onShowHandlers = [];
	var onHideHandlers = [];
	var onChangingHandlers = [];
	var onChangeHandlers = [];
	var onCompleteHandlers = [];

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="GetId" access="public" returns="string">
	/// 	<description> Get unique Control ID </description>
	/// </function>
	this.GetId = function()
	{
		return id;
	}

	/// <function container="Fit.Controls.PickerBase" name="MaxHeight" access="public" returns="object">
	/// 	<description> Get/set max height of control - returns object with Value (number) and Unit (string) properties </description>
	/// 	<param name="value" type="number" default="undefined"> If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content. </param>
	/// 	<param name="unit" type="string" default="undefined"> If defined, max height is updated to specified CSS unit, otherwise px is assumed </param>
	/// </function>
	this.MaxHeight = function(value, unit)
    {
		Fit.Validation.ExpectNumber(value, true);
		Fit.Validation.ExpectStringValue(unit, true);

		var elm = me.GetDomElement();

		if (Fit.Validation.IsSet(value) === true)
		{
			if (value !== -1)
			{
				elm.style.maxHeight = value + ((Fit.Validation.IsSet(unit) === true) ? unit : "px");
			}
			else
			{
				elm.style.maxHeight = "";
			}
		}

		var res = { Value: -1, Unit: "px" }; // No maxHeight set, height adjusts to content

		if (elm.style.maxHeight !== "") // MaxHeight set
		{
			res.Value = parseFloat(elm.style.maxHeight);
			res.Unit = elm.style.maxHeight.replace(res.Value, "");
		}

		return res;
    }

	// ============================================
	// Events fired by host control
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="OnShow" access="public">
	/// 	<description>
	/// 		Register event handler fired when picker control is shown in host control.
	/// 		The following argument is passed to event handler function: Sender (PickerBase).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnShow = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onShowHandlers, cb);
	}

	/// <function container="Fit.Controls.PickerBase" name="OnHide" access="public">
	/// 	<description>
	/// 		Register event handler fired when picker control is hidden in host control.
	/// 		The following argument is passed to event handler function: Sender (PickerBase).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnHide = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onHideHandlers, cb);
	}

	// ============================================
	// Events fired by picker control itself
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="OnItemSelectionChanging" access="public">
	/// 	<description>
	/// 		Register event handler fired when item selection is changing.
	/// 		Selection can be canceled by returning False.
	/// 		The following arguments are passed to event handler function:
	/// 		Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
    this.OnItemSelectionChanging = function(cb)
    {
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onChangingHandlers, cb);
    }

	/// <function container="Fit.Controls.PickerBase" name="OnItemSelectionChanged" access="public">
	/// 	<description>
	/// 		Register event handler fired when item selection is changed.
	/// 		This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode,
	/// 		where an existing selected item is deselected, followed by selection of new item.
	/// 		The following arguments are passed to event handler function:
	/// 		Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
    this.OnItemSelectionChanged = function(cb)
    {
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onChangeHandlers, cb);
    }

	/// <function container="Fit.Controls.PickerBase" name="OnItemSelectionComplete" access="public">
	/// 	<description> Register event handler invoked when a series of related item changes are completed </description>
	/// 	<param name="cb" type="function"> Event handler function which accepts Sender (PickerBase) </param>
	/// </function>
	this.OnItemSelectionComplete = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onCompleteHandlers, cb);
	}

	// ============================================
	// For derivatives - control developers
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description>
	/// 		Overridden by control developers (required).
	/// 		Get DOMElement representing control.
	/// 	</description>
	/// </function>
	this.GetDomElement = function()
	{
		Fit.Validation.ThrowError("Function not implemented");
	}

	/// <function container="Fit.Controls.PickerBase" name="UpdateItemSelection" access="public">
	/// 	<description>
	/// 		Overridden by control developers (optional).
	/// 		Host control invokes this function when an item's selection state is changed from host control.
	/// 		Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged,
	/// 		as demonstrated below, if the picker control contains the given item.
	///
	/// 		var item = getItem(value);
	/// 		if (item !== null)
	/// 		{
	/// 			&#160;&#160;&#160;&#160; if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected) === false)
	/// 			&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; return false;
	///
	/// 			&#160;&#160;&#160;&#160; item.SetSelected(selected);
	/// 			&#160;&#160;&#160;&#160; this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected);
	/// 		}
	///
	/// 		Both events are fired by passing the given item's title, value, and current selection state.
	/// 		Be aware that host control may pass information about items not found in picker, e.g. when pasting
	/// 		items which may turn out not to be valid selections.
	/// 		Returning False from UpdateItemSelection will cancel the change.
	/// 	</description>
	/// 	<param name="value" type="string"> Item value </param>
	/// 	<param name="selected" type="boolean"> True if item was selected, False if item was deselected </param>
	/// </function>
	this.UpdateItemSelection = function(value, selected)
	{
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(selected);

		// Default implementation fires both events, even though specialized control may not know
		// anything about the given item selected/deselected. This is necessary in order to support
		// events out of the box without requiring developer to override function.

		// It's safe to assume that current selection state is equal to !selected since host control will
		// never call UpdateItemSelection with the current value of the given item, only the desired value.
		if (me._internal.FireOnItemSelectionChanging("", value, !selected) === false)
			return false;

		me._internal.FireOnItemSelectionChanged("", value, selected);
	}

	/// <function container="Fit.Controls.PickerBase" name="SetSelections" access="public">
	/// 	<description>
	/// 		Overridden by control developers (optional).
	/// 		Host control invokes this function when picker is assigned to host control, providing an array
	/// 		of items already selected. An item is an object with a Title (string) and Value (string) property set.
	/// 		If picker defines preselected items, firing OnItemSelectionChanged
	/// 		for these items, will update the host control appropriately.
	/// 	</description>
	/// 	<param name="items" type="array"> Array containing selected items: {Title:string, Value:string} </param>
	/// </function>
	this.SetSelections = function(items)
	{
		Fit.Validation.ExpectArray(items);

		Fit.Array.ForEach(items, function(item)
		{
			Fit.Validation.ExpectString(item.Title);
			Fit.Validation.ExpectString(item.Value);
		});
	}

	/// <function container="Fit.Controls.PickerBase" name="SetEventDispatcher" access="public" returns="DOMElement">
	/// 	<description>
	/// 		Overriden by control developers (optional).
	/// 		Host control invokes this function, passing a reference to the
	/// 		input control dispatching keyboard events using the HandleEvent function.
	/// 		This function may be called multiple times with identical or different controls.
	/// 	</description>
	/// 	<param name="control" type="DOMElement"> Event dispatcher control </param>
	/// </function>
	this.SetEventDispatcher = function(control)
	{
		Fit.Validation.ExpectDomElement(control);
	}

	/// <function container="Fit.Controls.PickerBase" name="HandleEvent" access="public">
	/// 	<description>
	/// 		Overridden by control developers (optional).
	/// 		Host control dispatches keyboard events to this function to allow
	/// 		picker control to handle keyboard navigation with keys such as
	/// 		arrow up/down/left/right, enter, space, etc.
	/// 		Picker may return False to prevent host control from reacting to given event.
	/// 	</description>
	/// 	<param name="e" type="Event" default="undefined"> Keyboard event to process </param>
	/// </function>
	this.HandleEvent = function(e)
	{
		Fit.Validation.ExpectEvent(e, true);
	}

	/// <function container="Fit.Controls.PickerBase" name="Destroy" access="public">
	/// 	<description>
	/// 		Overridden by control developers (required).
	/// 		Destroys control to free up memory.
	/// 		Make sure to call Destroy() on PickerBase which can be done like so:
	/// 		this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
	/// 		{
	/// 			&#160;&#160;&#160;&#160; // Add control specific logic here
	/// 			&#160;&#160;&#160;&#160; base(); // Call Destroy on PickerBase
	/// 		});
	/// 	</description>
	/// </function>
	this.Destroy = function() // Must be overridden - remember to call base !
	{
		me = id = onShowHandlers = onHideHandlers = onChangingHandlers = onChangeHandlers = onCompleteHandlers = null;

		if (Fit.Validation.IsSet(controlId) === true)
			delete Fit._internal.ControlBase.Controls[controlId];
	}

	// ============================================
	// Private
	// ============================================

	// Private members (must be public in order to be accessible to host control and controls extending from PickerBase)

	this._internal = (this._internal ? this._internal : {});

	this._internal.Initialize = function() // Called by Host Control when picker is assigned to it
	{
	}

	this._internal.FireOnShow = function() // Called by Host Control
	{
		Fit.Array.ForEach(onShowHandlers, function(handler)
		{
			handler(me);
		});
	},

	this._internal.FireOnHide = function() // Called by Host Control
	{
		Fit.Array.ForEach(onHideHandlers, function(handler)
		{
			handler(me);
		});
	},

	this._internal.FireOnItemSelectionChanging = function(title, value, selected) // Called by Picker Control
	{
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(selected);

		var cancel = false;

		Fit.Array.ForEach(onChangingHandlers, function(handler)
		{
			if (handler(me, { Title: title, Value: value, Selected: selected }) === false)
				cancel = true;
		});

		return !cancel;
	}

	this._internal.FireOnItemSelectionChanged = function(title, value, selected) // Called by Picker Control
	{
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(selected);

		Fit.Array.ForEach(onChangeHandlers, function(handler)
		{
			handler(me, { Title: title, Value: value, Selected: selected });
		});
	}

	this._internal.FireOnItemSelectionComplete = function() // Called by Picker Control
	{
		Fit.Array.ForEach(onCompleteHandlers, function(handler)
		{
			handler(me);
		});
	}
}
Fit.Controls.WSDropDown = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.DropDown).Apply(ctlId);

	var me = this;
	var list = null;
	var tree = null;

	var search = "";
	var forceNewSearch = false;
	var suppressTreeOnOpen = false;
	var timeOut = null;
	var currentRequest = null;
	var classes = null;

	var onRequestHandlers = [];
	var onResponseHandlers = [];
	var onAbortHandlers = [];
	//var onPopulatedHandlers = [];

	function init()
	{
		// Initialize self (drop down)

		me.OnInputChanged(function(sender, value)
		{
			if (me.Focused() === true) // Prevent search from being triggered when OnInputChanged fires after programmatically changing input value
				searchData(value);
		});

		// Get drop down open/close button element (arrow)

		var cmdOpen = me.GetDomElement().firstChild.children[me.GetDomElement().firstChild.children.length - 1];
		classes = cmdOpen.className;

		// Create ListView

		list = new Fit.Controls.WSListView(ctlId + "__WSListView");
		list.OnRequest(function(sender, eventArgs)
		{
			if (fireEventHandlers(onRequestHandlers, list, eventArgs) === false)
				return false;

			currentRequest = eventArgs.Request;
			cmdOpen.className = "fa fa-refresh fa-spin";
		});
		list.OnResponse(function(sender, eventArgs)
		{
			fireEventHandlers(onResponseHandlers, list, eventArgs);
			cmdOpen.className = classes;
			currentRequest = null;

			if (forceNewSearch === true)
			{
				forceNewSearch = false;

				eventArgs.Items = []; // Remove data, we do not want it to be populated to control
				searchData(me.GetInputValue());
			}
		});
		list.OnItemSelectionChanging(function(sender, item)
		{
			// Prevent user from deselecting node which is read only in tree (not selectable)

			var node = tree.GetChild(item.Value, true);

			if (node !== null && node.Selectable() === false)
				return false;
		});
		list.OnItemSelectionChanged(function(sender, item)
		{
			// DropDown (base) automatically closes drop down in Single Selection Mode, but we
			// always want it to close drop down when using ListView to select data from a search query.
			// ListView is only used to select data from search results - TreeView is used to display
			// all data, no matter if it is received in a flat list or a hierarchy.
			if (item.Selected === true) // Only close when a selection is made - removing an item keeps drop down open
				me.CloseDropDown();
		});

		// Create TreeView

		var initialLoad = true;

		tree = new Fit.Controls.WSTreeView(ctlId + "__WSTreeView");
		tree.Width(100, "%");
		tree.Lines(true);
		tree.OnRequest(function(sender, eventArgs)
		{
			if (fireEventHandlers(onRequestHandlers, tree, eventArgs) === false)
				return false;

			if (eventArgs.Node === null)
				cmdOpen.className = "fa fa-refresh fa-spin";
		});
		tree.OnResponse(function(sender, eventArgs)
		{
			fireEventHandlers(onResponseHandlers, tree, eventArgs);
			cmdOpen.className = classes;
		});
		tree.OnAbort(function(sender, eventArgs)
		{
			fireEventHandlers(onAbortHandlers, tree, eventArgs);
			cmdOpen.className = classes;
		});
		tree.OnPopulated(function(sender, eventArgs)
		{
			if (initialLoad === true)
			{
				// Disable helper lines if no children are contained

				var hasChildren = false;

				Fit.Array.ForEach(tree.GetChildren(), function(c)
				{
					if (c.GetChildren().length > 0)
					{
						hasChildren = true;
						return false;
					}
				});

				if (hasChildren === false)
				{
					tree.Lines(false);
					//tree.GetDomElement().style.marginLeft = "-2em";
				}

				initialLoad = false;
			}
		});
		tree.OnSelectAll(function(sender, eventArgs)
		{
			// Make sure focus is lost when SelectAll is invoked. Otherwise control will
			// reassign focus every time an item is added which is very expensive performance wise.
			me.Focused(false);

			// Make sure TreeView is the active picker to have changes synchronized with
			// drop down control (in case SelectAll is triggered programmatically).
			if (me.GetPicker() !== tree)
				me.SetPicker(tree);
		});

		me.OnOpen(function()
		{
			if (suppressTreeOnOpen === true)
			{
				suppressTreeOnOpen = false;
				return;
			}

			me.SetPicker(tree);

			if (tree.GetChildren().length === 0)
			{
				var selected = tree.Selected(); // Save selection which is cleared when Reload() is called
				tree.Reload();
				tree.Selected(selected); // Restore selection
			}
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.WSDropDown" name="Url" access="public" returns="string">
	/// 	<description>
	/// 		Get/set URL to WebService responsible for providing data to drop down.
	/// 		WebService must deliver data in the following JSON format:
	/// 		[
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 1", Value: "1001", Selectable: true, Selected: true, Children: [] },
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 2", Value: "1002", Selectable: false, Selected: false, Children: [] }
	/// 		]
	/// 		Only Value is required. Children is a collection of nodes with the same format as described above.
	/// 		HasChildren:boolean may be set to indicate that children are available server side and that WebService
	/// 		should be called to load these children when the given node is expanded.
	/// 	</description>
	/// 	<param name="wsUrl" type="string"> WebService URL - e.g. http://server/ws/data.asxm/GetData </param>
	/// </function>
	this.Url = function(wsUrl)
	{
		Fit.Validation.ExpectString(wsUrl);

		if (Fit.Validation.IsSet(wsUrl) === true)
		{
			list.Url(wsUrl);
			tree.Url(wsUrl);
		}

		return list.Url();
	}

	this.JsonpCallback = function(val)
	{
		Fit.Validation.ExpectString(val);

		if (Fit.Validation.IsSet(val) === true)
		{
			list.JsonpCallback(val);
			tree.JsonpCallback(val);
		}

		return list.JsonpCallback();
	}

	/// <function container="Fit.Controls.WSDropDown" name="MultiSelectionMode" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control allows for multiple selections simultaneously </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables support for multiple selections, False disables it </param>
	/// </function>
	this.MultiSelectionMode = Fit.Core.CreateOverride(this.MultiSelectionMode, function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			tree.Selectable(true, val);
		}

		return base(val);
	});


	/// <function container="Fit.Controls.WSListView" name="GetListView" access="public" returns="Fit.Controls.WSListView">
	/// 	<description> Get WSListView control used to display data in a flat list view </description>
	/// </function>
	this.GetListView = function()
	{
		return list;
	}

	/// <function container="Fit.Controls.WSDropDown" name="GetTreeView" access="public" returns="Fit.Controls.WSTreeView">
	/// 	<description> Get WSTreeView control used to display data in a hierarchical tree view </description>
	/// </function>
	this.GetTreeView = function()
	{
		return tree;
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		list.Destroy();
		tree.Destroy();

		me = list = tree = search = forceNewSearch = suppressTreeOnOpen = timeOut = currentRequest = classes = onRequestHandlers = onResponseHandlers = null;

		base();
	});

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.WSDropDown" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is being requested.
	/// 		Request can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSDropDown) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSDropDown instance
	/// 		 - Picker: Picker causing WebService data request (WSTreeView or WSListView instance)
	/// 		 - Node: Fit.Controls.TreeView.Node instance if requesting TreeView children, Null if requesting root nodes
	/// 		 - Search: Search value if entered
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnRequest = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onRequestHandlers, cb);
	}

	/// <function container="Fit.Controls.WSDropDown" name="OnResponse" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is received,
	/// 		allowing for data transformation to occure before
	/// 		picker control is populated. Function receives two arguments:
	/// 		Sender (Fit.Controls.WSDropDown) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSDropDown instance
	/// 		 - Picker: Picker causing WebService data request (WSTreeView or WSListView instance)
	/// 		 - Node: Fit.Controls.TreeView.Node instance if requesting TreeView children, Null if requesting root nodes
	/// 		 - Search: Search value if entered
	/// 		 - Data: JSON data received from WebService
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnResponse = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onResponseHandlers, cb);
	}

	/// <function container="Fit.Controls.WSDropDown" name="OnAbort" access="public">
	/// 	<description>
	/// 		Add event handler fired if data request is canceled.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSDropDown) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSDropDown instance
	/// 		 - Picker: Picker causing WebService data request (WSTreeView or WSListView instance)
	/// 		 - Node: Fit.Controls.TreeView.Node instance if requesting TreeView children, Null if requesting root nodes
	/// 		 - Search: Search value if entered
	/// 		 - Data: JSON data received from WebService (Null in this particular case)
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnAbort = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onAbortHandlers, cb);
	}

	/*this.OnPopulated = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPopulatedHandlers, cb);
	}*/

	// ============================================
	// Private
	// ============================================

	function searchData(value)
	{
		// Abort time responsible for starting search request X milliseconds after user stops typing

		if (timeOut !== null)
		{
			clearTimeout(timeOut);
			timeOut = null;
		}

		// Schedule new search request if a WebService request is already in progress

		if (currentRequest !== null)
		{
			forceNewSearch = true;
			return;
		}

		// Schedule search to run X milliseconds after user stops typing

		// Search value is passed to WSDropDown event handler using EventArgs object. External code
		// is responsible for exposing it to the backend, which in turn must return matching items.
		search = value;

		if (search !== "")
		{
			list.RemoveItems(); // Remove data from previous search
			me.SetPicker(list);

			timeOut = setTimeout(function()
			{
				if (me.IsDropDownOpen() === false)
				{
					suppressTreeOnOpen = true; // Drop Down changes picker to TreeView when OnOpen fires - prevent this from happening
					me.OpenDropDown();
				}

				list.Reload();

				timeOut = null;
			}, 500);
		}
	}

	function fireEventHandlers(handlers, picker, eventArgs)
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			var data = null; // Remains Null for OnAbort event (no Children or Items provided)

			if (eventArgs.Children) // WSTreeView
				data = eventArgs.Children;
			else if (eventArgs.Items) // WSListView
				data = eventArgs.Items;

			var newArgs = { Sender: me, Picker: picker, Node: (eventArgs.Node ? eventArgs.Node : null), SelectAll: eventArgs.SelectAll, Search: search, Data: data, Request: eventArgs.Request };

			if (cb(me, newArgs) === false)
				cancel = true; // Do not cancel loop though - all handlers must be fired!

			// Assign data back to eventArgs, in case a new array instance was created
			if (eventArgs.Children) // WSTreeView
				eventArgs.Children = newArgs.Data;
			else if (eventArgs.Items) // WSListView
				eventArgs.Items = newArgs.Data;
		});

		return !cancel;
	}

	init();
}
/// <container name="Fit.Controls.FilePicker">
/// 	Control allowing for files to be selected locally and uploaded asynchronously.
/// 	Extending from Fit.Controls.ControlBase.
/// </container>

// http://fiddle.jshell.net/gho7Lmno/84/

/// <function container="Fit.Controls.FilePicker" name="FilePicker" access="public">
/// 	<description> Create instance of FilePicker control </description>
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.FilePicker = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var button = null;
	var input = null;
	var width = { Value: -1, Unit: "px" }; // Differs from default value on ControlBase which is 200px - here a value of -1 indicates width:auto
	var url = null;
	var files = [];
	var inputs = []; // Legacy control - contains input controls when legacy mode is enabled (IE9 and older)

	var onUploadHandlers = [];
	var onProgressHandlers = [];
	var onSuccessHandlers = [];
	var onFailureHandlers = [];
	var onCompletedHandlers = [];
	//var onAbortHandlers = [];

	function init()
	{
		createUploadField();

		if (inputs.length === 0) // Modern control
		{
			button = new Fit.Controls.Button("Button" + me.GetId());
			button.Title(Fit.Language.Translations.SelectFile);
			button.Icon("upload"); // files-o
			button.OnClick(function(sender) { input.click(); }); // Make sure Enter/Spacebar opens file dialog

			// Add file picker to button
			Fit.Dom.Add(button.GetDomElement(), input);
			me._internal.AddDomElement(button.GetDomElement());
		}

		me.AddCssClass("FitUiControlFilePicker");
		me.Width(-1); // Set width:auto - ControlBase uses width:200px by default
		me.Enabled(true);

		me._internal.Data("legacy", (inputs.length > 0).toString());
	}

	function createUploadField()
	{
		var inp = document.createElement("input");
		inp.type = "file";
		inp.onchange = function(e) // e may be null if called programmatically from FilePicker.Clear()
		{
			// The modern control clears any previously selected files when a new selection is made.
			// The legacy control consists of multiple single picker controls, so it has to keep
			// previously selected files. This adds a bit more complexity to the legacy control since
			// we need to preserve some state information between every time OnChange is fired
			// and if Upload is called multiple times.

			if (inputs.length === 0) // Modern control
			{
				files = [];

				// Add selected files to internal collection
				Fit.Array.ForEach(inp.files, function(file)
				{
					Fit.Array.Add(files, { Filename: file.name, Type: file.type, Size: file.size, Id: Fit.Data.CreateGuid(), Processed: false, Input: inp, FileObject: file, GetImagePreview: function() { return getImagePreview(file); }, ServerResponse: null });
				});
			}
			else // Legacy control
			{
				files = [];

				// Add selected files to internal collection

				Fit.Array.ForEach(Fit.Array.Copy(inputs), function(i)
				{
					// Remove empty input fields

					if (i.value === "")
					{
						if (me.MultiSelectionMode() === true) // Remove empty upload controls in Multi Selection Mode
						{
							Fit.Dom.Remove(i);
							Fit.Array.Remove(inputs, i);
						}

						return; // Skip file picker, no file selected
					}

					// file has been selected, create file information object

					var file = null;

					// Some files may have been uploaded earlier (e.g. if AutoPostBack is enabled or if user
					// selects 3 files, triggers upload, selects another 5 files, and triggers upload again).
					// Make sure file information is preserved for files already processed.

					if (me.MultiSelectionMode() === true && i._file !== undefined && i._file.Processed === true)
					{
						file = i._file;
					}
					else
					{
						file = { Filename: i.value, Type: "Unknown", Size: -1, Id: Fit.Data.CreateGuid(), Processed: false, Input: i, FileObject: null, GetImagePreview: function() { return null; }, ServerResponse: null };
					}

					i._file = file;

					// Add file information

					Fit.Array.Add(files, file);
				});

				// Make sure an empty upload control is always available in Multi Selection Mode, allowing for another file to be added
				if (me.MultiSelectionMode() === true)
					createUploadField();
			}

			me._internal.FireOnChange();

			if (me.AutoPostBack() === true)
				me.Upload();
		}

		if (inp.files && !Fit.Controls.FilePicker.ForceLegacyMode) // Modern control
		{
			input = inp;
			input.tabIndex = -1;

			Fit.Events.AddHandler(input, "click", function(e)
			{
				// Do not trigger OnClick on button containing file picker.
				// It will cause file picker to open file dialog twice.
				Fit.Events.StopPropagation(e);
			});
		}
		else // Legacy control
		{
			inp.name = "SelectedFile";

			Fit.Array.Add(inputs, inp);
			me._internal.AddDomElement(inp);
		}
	}

	// ============================================
	// Public - overrides
	// ============================================

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true)
		{
			if (inputs.length === 0) // Modern control
			{
				if (focus === true)
					input.focus();
				else
					input.blur();
			}
			else // Legacy control
			{
				if (focus === true)
					inputs[0].focus();
				else
					inputs[0].blur();
			}
		}

		return (document.activeElement === input);
	}

	// See documentation on ControlBase
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			Fit.Validation.ThrowError("SecurityError: Due to security restrictions, the value of an upload control cannot be set");
		}

		var strFiles = "";

		Fit.Array.ForEach(files, function(file)
		{
			strFiles += ((strFiles !== "") ? ";" : "") + file.Filename;
		});

		return strFiles;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		return (files.length > 0);
	}

	// See documentation on ControlBase
	this.Clear = function()
	{
		if (files.length === 0)
			return;

		if (inputs.length === 0) // Modern control
		{
			input.value = "";
			input.onchange(null);
		}
		else // Legacy control
		{
			// Remove all file pickers in Legacy Mode - clearing them is not possible in Legacy IE
			Fit.Array.ForEach(Fit.Array.Copy(inputs), function(i)
			{
				Fit.Dom.Remove(i);
				Fit.Array.Remove(inputs, i);
			});

			createUploadField();
			inputs[0].onchange(null);
		}
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		// This will destroy control - it will no longer work!

		me = button = input = width = url = files = inputs = onUploadHandlers = onProgressHandlers = onSuccessHandlers = onFailureHandlers = onCompletedHandlers = null; // onAbortHandlers
		base();
	});

	/// <function container="Fit.Controls.FilePicker" name="Width" access="public" returns="object">
	/// 	<description>
	/// 		Fit.Controls.ControlBase.Width override:
	/// 		Get/set control width - returns object with Value and Unit properties.
	/// 		This implementation differs from ControlBase.Width as passing a value of -1 resets
	/// 		the control width to fit its content, rather than assuming a fixed default width.
	/// 	</description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control width is updated to specified CSS unit </param>
	/// </function>
	this.Width = Fit.Core.CreateOverride(this.Width, function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1) // Fixed width
			{
				width = base(val, unit);

				if (inputs.length === 0)
					button.Width(100, "%");
			}
			else // Adjust width to content size
			{
				width = { Value: -1, Unit: "px" }; // Any changes to this line must be dublicated to line declaring the width variable !
				me.GetDomElement().style.width = "auto";

				if (inputs.length === 0)
					button.Width(-1);
			}
		}

		return width;
	});

	// See documentation on ControlBase
	this.Height = Fit.Core.CreateOverride(this.Height, function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true && inputs.length === 0) // Modern control - not supported in Legacy Mode
		{
			base(val, unit);

			if (val > -1) // Fixed height
				button.Height(100, "%");
			else // Adjust height to content size
				button.Height(-1);
		}

		return base();
	});

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.FilePicker" name="Url" access="public" returns="string">
	/// 	<description>
	/// 		Get/set URL to which files are uploaded when FilePicker.Upload() is called.
	/// 		Multiple files will be uploaded using POST over individual HTTP connections,
	/// 		and each file will be accessible from the POST data collection using the SelectedFile key.
	/// 	</description>
	/// 	<param name="url" type="string" default="undefined"> If defined, upload URL is set to specified value </param>
	/// </function>
	this.Url = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true)

		if (Fit.Validation.IsSet(val) === true)
		{
			url = val;
		}

		return url;
	}

	/// <function container="Fit.Controls.FilePicker" name="Title" access="public" returns="string">
	/// 	<description> Get/set file picker title </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, file picker title is set to specified value </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectString(val, true)

		if (button === null)
			return ""; // Legacy mode

		if (Fit.Validation.IsSet(val) === true)
		{
			button.Title(val);
			Fit.Dom.Add(button.GetDomElement(), input);
		}

		return button.Title();
	}

	/// <function container="Fit.Controls.FilePicker" name="GetFiles" access="public" returns="object[]">
	/// 	<description>
	/// 		Get collection of selected files. Each file is represented as an object with the following members:
	/// 		 - Filename:string (Name of selected file)
	/// 		 - Type:string (Mime type for selected file)
	/// 		 - Size:integer (File size in bytes)
	/// 		 - Id:string (Unique file ID)
	/// 		 - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
	/// 		 - Input:HTMLInputElement (Input control used as file picker)
	/// 		 - FileObject:File (Native JS File object representing selected file)
	/// 		 - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
	/// 		NOTICE: The following properties/functions are not available in Legacy Mode: Type, Size, FileObject, GetImagePreview().
	/// 	</description>
	/// </function>
	this.GetFiles = function()
	{
		return files;
	}

	/// <function container="Fit.Controls.FilePicker" name="MultiSelectionMode" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether control allows for multiple selections </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables multi selection mode, False disables it </param>
	/// </function>
	this.MultiSelectionMode = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true)

		if (Fit.Validation.IsSet(val) === true)
		{
			if (inputs.length === 0) // Modern control
			{
				if (val === true && me.MultiSelectionMode() === false)
				{
					input.multiple = "multiple";

					// Change title unless a custom title has been set
					if (me.Title() === Fit.Language.Translations.SelectFile)
						me.Title(Fit.Language.Translations.SelectFiles);
				}
				else if (val === false && me.MultiSelectionMode() === true)
				{
					if (files.length > 1)
						me.Clear();

					input.multiple = "";

					// Change title unless a custom title has been set
					if (me.Title() === Fit.Language.Translations.SelectFiles)
						me.Title(Fit.Language.Translations.SelectFile);
				}
			}
			else // Legacy control
			{
				me.Clear();
			}

			me._internal.Data("multiple", val.toString());
		}

		return (me._internal.Data("multiple") === "true");
	}

	/// <function container="Fit.Controls.FilePicker" name="Enabled" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is enabled or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If specified, True enables control, False disables it </param>
	/// </function>
	this.Enabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			me._internal.Data("enabled", val.toString());

			if (inputs.length === 0) // Modern control
			{
				input.disabled = !val;
				button.Enabled(val);
			}
			else // Legacy control
			{
				Fit.Array.ForEach(inputs, function(inp)
				{
					inp.disabled = !val;

					if (me.MultiSelectionMode() === true && val === true && inp._file !== undefined && inp._file.Processed === true) // Input controls previously uploaded should remain disabled
						inp.disabled = true;
				})
			}
		}

		return (me._internal.Data("enabled") === "true");
	}

	/// <function container="Fit.Controls.FilePicker" name="IsLegacyModeEnabled" access="public" returns="boolean">
	/// 	<description> Get value indicating whether control is in legacy mode (old fashion upload control) </description>
	/// </function>
	this.IsLegacyModeEnabled = function()
	{
		return (inputs.length > 0);
	}

	/// <function container="Fit.Controls.FilePicker" name="Upload" access="public">
	/// 	<description>
	/// 		Upload selected files. Each file will be uploaded using POST over individual HTTP connections,
	/// 		and each file will be accessible from the POST data collection using the SelectedFile key.
	/// 		Use the OnProgress event to monitor the upload process, or use the OnCompleted event
	/// 		to be notified when all files have been fully processed.
	/// 	</description>
	/// 	<param name="skip" type="string[]" default="undefined">
	/// 		Optional argument allowing some of the selected files to be skipped during
	/// 		upload. The argument is a string array with the names of the files to skip.
	/// 	</param>
	/// </function>
	this.Upload = function(skip)
	{
		Fit.Validation.ExpectTypeArray(skip, Fit.Validation.ExpectStringValue, true);

		if (url === null)
			Fit.Validation.ThrowError("Unable to upload file(s), no URL has been specified");

		if (me.Enabled() === false) // Legacy control cannot upload data when disabled - this ensures consistency
			return;

		var filesToUpload = [];

		Fit.Array.ForEach(files, function(file)
		{
			if (Fit.Validation.IsSet(skip) === false || Fit.Array.Contains(skip, file.Filename) === false)
			{
				if (file.Processed === true) // Skip previously uploaded files
					return;

				Fit.Array.Add(filesToUpload, file);
			}
		});

		if (filesToUpload.length === 0)
			return;

		if (fireEvent(onUploadHandlers) === false)
			return;

		var completed = [];

		Fit.Array.ForEach(filesToUpload, function(file)
		{
			file.Processed = true;

			if (inputs.length === 0) // Modern control
			{
				var data = new FormData();
				data.append("SelectedFile", file.FileObject);

				var req = new XMLHttpRequest();
				Fit.Events.AddHandler(req.upload, "progress", function(e)
				{
					var ev = Fit.Events.GetEvent(e);
					fireEvent(onProgressHandlers, file, ((ev.loaded > 0 && ev.total > 0) ? Math.floor((ev.loaded / ev.total) * 100) : 0));
				});
				Fit.Events.AddHandler(req, "readystatechange", function(e)
				{
					// Using readystatechange rather than req.upload.onload (success) and req.upload.onerror (failure).
					// Server response is not available when req.upload.onload fires: Fit.Events.AddHandler(req.upload, "load", function(e) { /*..*/ });
					// OnError only fires when network communication fails (e.g. network unplugged or server process is restarted), not when an error
					// occur server side (500 Internal Server Error). Using readystatechange we can catch both communication and server errors.

					if (req.readyState === 4)
					{
						if (req.status === 200) // Success
						{
							file.ServerResponse = req.responseText;

							Fit.Array.Add(completed, file);
							fireEvent(onSuccessHandlers, file);
						}
						else // Failure
						{
							Fit.Array.Add(completed, file);
							fireEvent(onFailureHandlers, file);
						}

						if (completed.length === filesToUpload.length)
							fireEvent(onCompletedHandlers);
					}
				});
				/*Fit.Events.AddHandler(req.upload, "abort", function(e)
				{
					fireEvent(onAbortHandlers, file);
				});*/

				req.open("POST", url);
				req.send(data);
			}
			else // Legacy control
			{
				var enforcedOnModernBrowser = (Fit.Browser.GetInfo().Name !== "MSIE" || Fit.Browser.GetInfo().Version !== 8);

				var picker = file.Input;

				var iFrame = null;
				var form = null;

				var progress = 0;
				var interval = null;

				// Create hidden iFrame used to upload current file asynchronously

				iFrame = document.createElement("iframe");
				iFrame.name = "iFrame" + Fit.Data.CreateGuid();
				iFrame.style.display = "none";

				if (enforcedOnModernBrowser === true)
				{
					// When Legacy Mode is enforced in modern browsers, the OnLoad handler MUST be registered
					// AFTER rooting iFrame in DOM, to prevent WebKit/Chrome from firing OnLoad multiple times.
					Fit.Dom.InsertAfter(picker, iFrame);
				}

				Fit.Events.AddHandler(iFrame, "load", function(e)
				{
					Fit.Browser.Log("[Legacy Mode] OnLoad fired");

					// Read server response

					try // Will throw an error if uploading to foreign domain, in which case ServerResponse will remain Null
					{
						file.ServerResponse = iFrame.contentDocument.body.innerHTML;
					}
					catch (err)
					{
						Fit.Browser.Log("Unable to read server response, most likely due to violation of Same-Origin Policy");
					}

					// Clean up

					Fit.Dom.Remove(iFrame);
					clearInterval(interval);

					// Fire events

					Fit.Array.Add(completed, file);

					fireEvent(onProgressHandlers, file, 100);
					fireEvent(onSuccessHandlers, file);

					if (completed.length === filesToUpload.length)
						fireEvent(onCompletedHandlers);
				});

				if (enforcedOnModernBrowser === false)
				{
					// On IE8 the OnLoad handler MUST be registered BEFORE
					// rooting iFrame in DOM, otherwise it will not be fired.
					Fit.Dom.InsertAfter(picker, iFrame);
				}

				// Create form used to upload current file - data is posted to hidden iFrame created above

				form = document.createElement("form");
				form.action = url;
				form.method = "POST";
				form.setAttribute("enctype", "multipart/form-data"); // Must be registered using setAttribute() for upload to work in IE8 //form.enctype="multipart/form-data";
				form.target = iFrame.name;

				// Add form to page, and file picker to form.
				// Having multiple forms on the same page might break apps expecting only one form element, so it is
				// immediately removed from page once submitted, and picker is returned to its prior location in the DOM.
				Fit.Dom.InsertAfter(picker, form);
				form.appendChild(picker);

				// Post data - start file upload
				form.submit();

				// Immediately remove form element after submit, as it might confuse apps expecting
				// only one form element on page. Picker is returned to its prior location in the DOM.
				Fit.Dom.InsertBefore(iFrame, picker);
				Fit.Dom.Remove(form);

				// Simulate progress in legacy mode which does not support the progress event

				interval = setInterval(function()
				{
					progress = progress + 5;
					fireEvent(onProgressHandlers, file, progress);

					if (progress === 90) // Halt progress on 90% and wait for file to fully complete
						clearInterval(interval);

				}, 1000);

				if (me.MultiSelectionMode() === true)
					picker.disabled = true;
			}
		});
	}

	function getImagePreview(file) // file is an instance of File (native JS object type) - returns Image instance if preview can be created, otherwise Null
	{
		if (inputs.length > 0)
			return null; // Legacy control

		if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/svg" || file.type === "image/gif")
		{
			var img = new Image();

			setTimeout(function() // Postpone to allow external code to register an onload handler on the image, which should be registered before assigning image source (src)
			{
				var fr = new FileReader();
				fr.onload = function(e)
				{
					var ev = Fit.Events.GetEvent(e);
					img.src = ev.target.result;
				}
				fr.readAsDataURL(file);
			}, 0);

			return img;
		}

		return null;
	}

	function fireEvent(handlers, file, progress)
	{
		var canceled = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (Fit.Validation.IsSet(file) === true) // OnSuccess/OnFailure/OnProcess
			{
				var eventArgs = file;
				eventArgs.Progress = 100;

				if (Fit.Validation.IsSet(progress) === true)
					eventArgs.Progress = progress;

				if (cb(me, eventArgs) === false)
					canceled = true;
			}
			else // OnUpload/OnCompleted
			{
				if (cb(me) === false)
					canceled = true;
			}
		});

		return !canceled;
	}

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.FilePicker" name="OnUpload" access="public">
	/// 	<description>
	/// 		Add event handler fired when upload is started.
	/// 		Operation can be canceled by returning False.
	/// 		Function receives one argument: Sender (Fit.Controls.FilePicker).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnUpload = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onUploadHandlers, cb);
	}

	/// <function container="Fit.Controls.FilePicker" name="OnProgress" access="public">
	/// 	<description>
	/// 		Add event handler fired when the upload process for a given file is progressing.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.FlePicker) and EventArgs object.
	/// 		EventArgs object contains the following members:
	/// 		 - Filename:string (Name of given file)
	/// 		 - Type:string (Mime type for given file)
	/// 		 - Size:integer (File size in bytes)
	/// 		 - Id:string (Unique file ID)
	/// 		 - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
	/// 		 - Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded)
	/// 		 - Input:HTMLInputElement (Input control used as file picker)
	/// 		 - FileObject:File (Native JS File object representing given file)
	/// 		 - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
	/// 		Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this
	/// 		case will be Null. GetImagePreview() will also return Null in Legacy Mode.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnProgress = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onProgressHandlers, cb);
	}

	/// <function container="Fit.Controls.FilePicker" name="OnSuccess" access="public">
	/// 	<description>
	/// 		Add event handler fired when a file has successfully been uploaded.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.FlePicker) and EventArgs object.
	/// 		EventArgs object contains the following members:
	/// 		 - Filename:string (Name of given file)
	/// 		 - Type:string (Mime type for given file)
	/// 		 - Size:integer (File size in bytes)
	/// 		 - Id:string (Unique file ID)
	/// 		 - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
	/// 		 - Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded)
	/// 		 - Input:HTMLInputElement (Input control used as file picker)
	/// 		 - FileObject:File (Native JS File object representing given file)
	/// 		 - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
	/// 		 - ServerResponse:string (Contains the response received from the server after a successful upload)
	/// 		Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this
	/// 		case will be Null. GetImagePreview() will also return Null in Legacy Mode.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnSuccess = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSuccessHandlers, cb);
	}

	/// <function container="Fit.Controls.FilePicker" name="OnFailure" access="public">
	/// 	<description>
	/// 		Add event handler fired for a given file if the upload process failed.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.FlePicker) and EventArgs object.
	/// 		EventArgs object contains the following members:
	/// 		 - Filename:string (Name of given file)
	/// 		 - Type:string (Mime type for given file)
	/// 		 - Size:integer (File size in bytes)
	/// 		 - Id:string (Unique file ID)
	/// 		 - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
	/// 		 - Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded)
	/// 		 - Input:HTMLInputElement (Input control used as file picker)
	/// 		 - FileObject:File (Native JS File object representing given file)
	/// 		 - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
	/// 		Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this
	/// 		case will be Null. GetImagePreview() will also return Null in Legacy Mode.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnFailure = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onFailureHandlers, cb);
	}

	/// <function container="Fit.Controls.FilePicker" name="OnCompleted" access="public">
	/// 	<description>
	/// 		Add event handler fired when all files selected have been fully processed.
	/// 		Be aware that this event fires even if some files were not uploaded successfully.
	/// 		At this point files returned from GetFiles() contains a ServerResponse:string property
	/// 		containing the response from the server. This property remains Null in case of errors.
	/// 		Function receives one argument: Sender (Fit.Controls.FlePicker).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnCompleted = function(cb) // Fires when all files have been processed, even if files have failed!
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onCompletedHandlers, cb);
	}

	/*this.OnAbort = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onAbortHandlers, cb);
	}*/

	init();
}
/// <container name="Fit.Controls.Input">
/// 	Input control which allows for one or multiple lines of
/// 	text, and features a Design Mode for rich HTML content.
/// 	Extending from Fit.Controls.ControlBase.
/// </container>

/// <function container="Fit.Controls.Input" name="Input" access="public">
/// 	<description> Create instance of Input control </description>
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.Input = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var orgVal = "";
	var preVal = "";
	var input = null;
	var cmdResize = null;
	var designEditor = null;
	var wasMultiLineBefore = false;
	var minimizeHeight = -1;
	var maximizeHeight = -1;
	var minMaxUnit = null;
	var mutationObserverId = -1;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	// ============================================
	// Init
	// ============================================

	function init()
	{
		input = document.createElement("input");
		input.autocomplete = "off";
		input.onkeyup = function()
		{
			if (me.Value() !== preVal)
			{
				preVal = me.Value();
				me._internal.FireOnChange();
			}
		}
		input.onchange = function() // OnKeyUp does not catch changes by mouse (e.g. paste or moving selected text)
		{
			input.onkeyup();
		}
		me._internal.AddDomElement(input);

		me.AddCssClass("FitUiControlInput");

		me._internal.Data("multiline", "false");
		me._internal.Data("maximizable", "false");
		me._internal.Data("maximized", "false");
		me._internal.Data("designmode", "false");

	}

	// ============================================
	// Public - overrides
	// ============================================

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		var elm = ((designEditor !== null) ? designEditor : input);

		if (Fit.Validation.IsSet(focus) === true)
		{
			if (focus === true)
				elm.focus();
			else if (elm !== designEditor) // Blur doesn't work for CKEditor!
				elm.blur();
		}

		return (document.activeElement === elm);
	}

	// See documentation on ControlBase
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			var fireOnChange = (me.Value() !== val);

			orgVal = val;
			preVal = val;

			if (designEditor !== null)
				CKEDITOR.instances[me.GetId() + "_DesignMode"].setData(val);
			else
				input.value = val;

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		if (designEditor !== null)
			return CKEDITOR.instances[me.GetId() + "_DesignMode"].getData();

		return input.value;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		return (orgVal !== me.Value());
	}

	// See documentation on ControlBase
	this.Clear = function()
	{
		me.Value("");
	}

	// See documentation on ControlBase
	var baseDispose = me.Dispose;
	this.Dispose = function()
	{
		// This will destroy control - it will no longer work!

		if (designEditor !== null)
			designEditor.destroy();

		me = orgVal = preVal = input = cmdResize = designEditor = wasMultiLineBefore = minimizeHeight = maximizeHeight = minMaxUnit = mutationObserverId = isIe8 = null;

		baseDispose();
	}

	// See documentation on ControlBase
	var baseWidth = me.Width;
	this.Width = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			baseWidth(val, unit);
			updateDesignEditorSize();
		}

		return baseWidth();
	}

	// See documentation on ControlBase
	var baseHeight = me.Height;
	this.Height = function(val, unit, suppressMinMax)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);
		Fit.Validation.ExpectBoolean(suppressMinMax, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			var h = baseHeight(val, unit);
			updateDesignEditorSize(); // Throws error if in DesignMode and unit is not px

			if (me.Maximizable() === true && suppressMinMax !== true)
			{
				minimizeHeight = h.Value;
				maximizeHeight = ((maximizeHeight > h.Value && h.Unit === minMaxUnit) ? maximizeHeight : h.Value * 2)
				minMaxUnit = h.Unit;

				me.Maximized(false);
			}
		}

		return baseHeight();
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.Input" name="MultiLine" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is in Multi Line mode (textarea) </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables Multi Line mode, False disables it </param>
	/// </function>
	this.MultiLine = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (me.DesignMode() === true)
				me.DesignMode(false);

			if (val === true && input.tagName === "INPUT")
			{
				var oldInput = input;
				me._internal.RemoveDomElement(oldInput);

				input = document.createElement("textarea");
				input.name = me.GetId();
				input.value = oldInput.value;
				input.onkeyup = oldInput.onkeyup;
				input.onchange = oldInput.onchange;
				me._internal.AddDomElement(input);

				if (me.Height().Value === -1)
					me.Height(150);

				me._internal.Data("multiline", "true");
				repaint();
			}
			else if (val === false && input.tagName === "TEXTAREA")
			{
				var oldInput = input;
				me._internal.RemoveDomElement(oldInput);

				if (cmdResize !== null)
				{
					me._internal.RemoveDomElement(cmdResize);
					cmdResize = null;

					me._internal.Data("maximized", "false");
					me._internal.Data("maximizable", "false");
					repaint();
				}

				input = document.createElement("input");
				input.autocomplete = "off";
				input.name = me.GetId();
				input.value = oldInput.value;
				input.onkeyup = oldInput.onkeyup;
				input.onchange = oldInput.onchange;
				me._internal.AddDomElement(input);

				me.Height(-1);

				wasMultiLineBefore = false;

				me._internal.Data("multiline", "false");
				repaint();
			}
		}

		return (input.tagName === "TEXTAREA" && designEditor === null);
	}

	/// <function container="Fit.Controls.Input" name="Maximizable" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is maximizable </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables maximize button, False disables it </param>
	/// 	<param name="heightMax" type="number" default="undefined">
	/// 		If defined, this becomes the height of the input control when maximized.
	/// 		The value is considered the same unit set using Height(..) which defaults to px.
	/// 		However, if DesignMode is enabled, the value unit is considered to be px.
	/// 	</param>
	/// </function>
	this.Maximizable = function(val, heightMax)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectNumber(heightMax, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true && cmdResize === null)
			{
				if (me.MultiLine() === true)
					wasMultiLineBefore = true;

				if (me.MultiLine() === false && designEditor === null)
					me.MultiLine(true);

				// Determine height to use when maximizing and minimizing

				var h = me.Height();

				if (designEditor === null)
				{
					minimizeHeight = h.Value;
					maximizeHeight = ((Fit.Validation.IsSet(heightMax) === true) ? heightMax : ((minimizeHeight !== -1) ? minimizeHeight * 2 : 150));
					minMaxUnit = h.Unit;
				}
				else
				{
					minimizeHeight = h.Value;
					maximizeHeight = ((Fit.Validation.IsSet(heightMax) === true) ? heightMax : ((minimizeHeight !== -1) ? minimizeHeight * 2 : 300));
					minMaxUnit = "px";
				}

				// Create maximize/minimize button

				cmdResize = document.createElement("span");
				cmdResize.onclick = function()
				{
					me.Maximized(!me.Maximized());
				}
				Fit.Dom.AddClass(cmdResize, "fa");
				Fit.Dom.AddClass(cmdResize, "fa-chevron-down");
				me._internal.AddDomElement(cmdResize);

				me._internal.Data("maximizable", "true");
				repaint();
			}
			else if (val === false && cmdResize !== null)
			{
				me._internal.RemoveDomElement(cmdResize);
				cmdResize = null;

				if (wasMultiLineBefore === true)
					me.Height(minimizeHeight, minMaxUnit);
				else
					me.MultiLine(false);

				me._internal.Data("maximizable", "false"); // Also set in MultiLine(..)
				repaint();
			}
		}

		return (cmdResize !== null);
	}

	/// <function container="Fit.Controls.Input" name="Maximized" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is maximized </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True maximizes control, False minimizes it </param>
	/// </function>
	this.Maximized = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && cmdResize !== null)
		{
			if (val === true && Fit.Dom.HasClass(cmdResize, "fa-chevron-up") === false)
			{
				me.Height(maximizeHeight, minMaxUnit, true);
				Fit.Dom.RemoveClass(cmdResize, "fa-chevron-down");
				Fit.Dom.AddClass(cmdResize, "fa-chevron-up");

				me._internal.Data("maximized", "true");
				repaint();
			}
			else if (val === false && Fit.Dom.HasClass(cmdResize, "fa-chevron-down") === false)
			{
				me.Height(minimizeHeight, minMaxUnit, true);
				Fit.Dom.RemoveClass(cmdResize, "fa-chevron-up");
				Fit.Dom.AddClass(cmdResize, "fa-chevron-down");

				me._internal.Data("maximized", "false"); // Also set in MultiLine(..)
				repaint();
			}
		}

		return (cmdResize !== null && Fit.Dom.HasClass(cmdResize, "fa-chevron-up") === true);
	}

	/// <function container="Fit.Controls.Input" name="DesignMode" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether control is in Design Mode allowing for rich HTML content.
	/// 		Notice that this control type requires dimensions (Width/Height) to be specified in pixels.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables Design Mode, False disables it </param>
	/// </function>
	this.DesignMode = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true && designEditor === null)
			{
				if (me.MultiLine() === true)
					wasMultiLineBefore = true;
				else
					me.MultiLine(true);

				input.id = me.GetId() + "_DesignMode";

				if (window.CKEDITOR !== undefined)
				{
					createEditor();
				}
				else
				{
					Fit.Loader.LoadScript(Fit.GetUrl() + "/Resources/CKEditor/ckeditor.js", function(src) // Using Fit.GetUrl() rather than Fit.GetPath() to allow editor to be used on e.g. JSFiddle (Cross-Origin Resource Sharing policy)
					{
						createEditor();
					});
				}

				me._internal.Data("designmode", "true");
				repaint();
			}
			else if (val === false && designEditor !== null)
			{
				designEditor.destroy(); // Editor content automatically synchronized to input control when destroyed
				designEditor = null;

				if (wasMultiLineBefore === false)
					me.MultiLine(false);

				me._internal.Data("designmode", "false");
				repaint();
			}
		}

		return (designEditor !== null);
	}

	// ============================================
	// Private
	// ============================================

	function createEditor()
	{
		// Prevent the following error: Uncaught TypeError: Cannot read property 'getEditor' of undefined
		// It seems CKEDITOR is not happy about initializing multiple instances at once.
		if (CKEDITOR._loading === true)
		{
			setTimeout(createEditor, 100);
			return;
		}
		CKEDITOR._loading = true;
		CKEDITOR.on("instanceLoaded", function () { CKEDITOR._loading = false; });

		// Create editor

		// NOTICE: CKEDITOR requires input control to be rooted in DOM.
		// Creating the editor when Render(..) is called is not the solution, since the programmer
		// may call GetDomElement() instead and root the element at any given time which is out of our control.
		// It may be possible to temporarily root the control and make it invisible while the control
		// is being created, and remove it from the DOM when instanceReady is fired. However, since creating
		// the editor is an asynchronous operation, we need to detect whether the element has been rooted
		// elsewhere when instanceCreated is fired, and only remove it from the DOM if this is not the case.
		// This problem needs to be solved some other time as it may spawn other problems, such as determining
		// the size of objects while being invisible. The CKEditor team may also solve the bug in an update.
		if (Fit.Dom.IsRooted(me.GetDomElement()) === false)
		{
			CKEDITOR._loading = false;
			Fit.Validation.ThrowError("Control must be appended/rendered to DOM before DesignMode can be initialized");
		}

		designEditor = CKEDITOR.replace(me.GetId() + "_DesignMode",
		{
			//allowedContent: true, // http://docs.ckeditor.com/#!/guide/dev_allowed_content_rules and http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-allowedContent
			extraPlugins: "justify,pastefromword",
			toolbar:
			[
				{
					name: "BasicFormatting",
					items: [ "Bold", "Italic", "Underline" ]
				},
				{
					name: "Justify",
					items: [ "JustifyLeft", "JustifyCenter", "JustifyRight" ]
				},
				{
					name: "Lists",
					items: [ "NumberedList", "BulletedList", "Indent", "Outdent" ]
				},
				{
					name: "Links",
					items: [ "Link", "Unlink" ]
				}
			],
			removeButtons: "", // Set to empty string to prevent CKEditor from removing buttons such as Underline
			on:
			{
				instanceReady: function()
				{
					var h = me.Height();
					me.Height(((h.Value >= 150 && h.Unit === "px") ? h.Value : 150));
				},
				change: function()
				{
					input.onkeyup();
				},
				focus: function()
				{
					me._internal.FireOnFocus();
				},
				blur: function()
				{
					me._internal.FireOnBlur();
				}
			}
		});
	}

	function updateDesignEditorSize()
	{
		if (designEditor !== null)
		{
			var w = me.Width();
			var h = me.Height();

			// CKEditor contains a bug that prevents us from resizing
			// with a CSS unit, so currently only pixels are supported.

			if (w.Unit !== "px" || h.Unit !== "px")
				throw new Error("DesignMode does not support resizing in units different from px");

			// Default control width is 200px (defined in Styles.css).
			// NOTICE: resize does not work reliably when editor is hidden, e.g. behind a tab with display:none.
			// The height set will not have the height of the toolbar substracted since the height can not be
			// determined for hidden objects, so the editor will become larger than the value set (height specified + toolbar height).
			// http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-resize
			designEditor.resize(((w.Value > -1) ? w.Value : 200), ((h.Value > -1) ? h.Value : 150));

			// Set mutation observer responsible for updating editor size once it becomes visible

			if (mutationObserverId !== -1) // Cancel any mutation observer previously registered
			{
				Fit.Events.RemoveMutationObserver(mutationObserverId);
				mutationObserverId = -1;
			}

			var concealer = Fit.Dom.GetConcealer(me.GetDomElement()); // Get element hiding editor

			if (concealer !== null) // Editor is hidden - adjust size when it becomes visible
			{
				mutationObserverId = Fit.Events.AddMutationObserver(concealer, function(elm)
				{
					if (Fit.Dom.IsVisible(me.GetDomElement()) === true)
					{
						designEditor.resize(((w.Value > -1) ? w.Value : 200), ((h.Value > -1) ? h.Value : 150));
						disconnect(); // Observers are expensive - remove when no longer needed
					}
				});
			}
		}
	}

	function repaint()
	{
		if (isIe8 === true)
		{
			me.AddCssClass("FitUi_Non_Existing_Input_Class");
			me.RemoveCssClass("FitUi_Non_Existing_Input_Class");
		}
	}

	init();
}
/// <container name="Fit.Controls.ListView">
/// 	Picker control which allows for entries
/// 	to be selected in the DropDown control.
/// </container>

/// <function container="Fit.Controls.ListView" name="ListView" access="public">
/// 	<description> Create instance of ListView control </description>
/// 	<param name="controlId" type="string" default="undefined">
/// 		Unique control ID. if specified, control will be
/// 		accessible using the Fit.Controls.Find(..) function.
/// 	</param>
/// </function>
Fit.Controls.ListView = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);

	Fit.Core.Extend(this, Fit.Controls.PickerBase).Apply(controlId);

	var me = this;
	var list = null;
	var active = null;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	function init()
	{
		list = document.createElement("div");
		list.tabIndex = "0";
		Fit.Dom.AddClass(list, "FitUiControlListView");

		me.OnShow(function()
		{
			list.scrollTop = 0;
			setActive(null);
		});

		list.onclick = function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			var elm = Fit.Events.GetTarget(e);

			if (elm === list)
				return;

			while (elm.parentElement !== list)
				elm = elm.parentElement;

			setActive(elm);

			// Fire OnChanging and OnChange events

			// Notice: We always pass False as current selection state to OnItemSelectionChanging since ListView does
			// not keep track of selection state. In theory item could very well already be selected in host control.
			// Event handlers should not trust boolean to reveal selection in host control, only in picker.
			if (me._internal.FireOnItemSelectionChanging(Fit.Dom.Text(elm), decode(Fit.Dom.Data(elm, "value")), false) === true)
			{
				me._internal.FireOnItemSelectionChanged(Fit.Dom.Text(elm), decode(Fit.Dom.Data(elm, "value")), true);
				me._internal.FireOnItemSelectionComplete();
			}
		}

		list.onfocus = function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			// Skip if this was a mouse click, leave handling to OnClick which fires after OnFocus.
			// Notice that Fit.Events.GetPointerState() is used to determine whether mouse button
			// is active since this information is not accessible through Event instance passed in OnFocus.
			if (Fit.Events.GetPointerState().Buttons.Primary === true)
				return;

			// Implemented Tab and Shift+Tab support below rather than using built-in support to prevent
			// the need for an OnFocus event handler on every single item contained, which would otherwise
			// be necessary to intercept focus and make element active.

			if (Fit.Events.GetModifierKeys().Shift === true) // Shift+Tab: Navigate up/backwards
			{
				if (list.children.length > 0)
					setActive(list.children[list.children.length - 1]);
			}
			else // Tab: Navigate down/forward
			{
				if (list.children.length > 0)
					setActive(list.children[0]);
			}
		}

		list.onkeydown = function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			// Handle Tab navigation manually to prevent the need to
			// implement a onfocus handler on every single item, responsible
			// for selecting an item when it gains focus.

			if (ev.keyCode === 9 && ev.shiftKey === false) // Tab
			{
				if (active !== list.children[list.children.length - 1])
				{
					moveDown();

					// Prevent native tab navigation from moving focus to next focusable element
					Fit.Events.PreventDefault(ev);
					return false;
				}
			}
			else if (ev.keyCode === 9 && ev.shiftKey === true) // Shift + Tab
			{
				if (active !== list.firstChild)
				{
					moveUp();

					// Prevent native tab navigation from moving focus to any focusable element above
					Fit.Events.PreventDefault(ev);
					return false;
				}
			}
			else
			{
				me.HandleEvent(ev); // Handle arrow up/down and enter
			}
		}
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.ListView" name="AddItem" access="public">
	/// 	<description> Add item to ListView </description>
	/// 	<param name="title" type="string"> Item title </param>
	/// 	<param name="value" type="string"> Item value </param>
	/// </function>
	this.AddItem = function(title, value)
	{
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);

		var entry = document.createElement("div");
		entry.innerHTML = title;
		Fit.Dom.Data(entry, "value", encode(value));
		Fit.Dom.Data(entry, "active", "false");

		list.appendChild(entry);
	}

	/// <function container="Fit.Controls.ListView" name="HasItem" access="public" returns="boolean">
	/// 	<description> Returns value indicating whether control contains item with specified value </description>
	/// 	<param name="value" type="string"> Value of item to check for </param>
	/// </function>
	this.HasItem = function(value)
	{
		Fit.Validation.ExpectString(value);

		var exists = false;

		Fit.Array.ForEach(list.children, function(child)
		{
			if (decode(Fit.Dom.Data(child, "value")) === value)
			{
				exists = true;
				return false;
			}
		});

		return exists;
	}

	/// <function container="Fit.Controls.ListView" name="RemoveItem" access="public">
	/// 	<description> Remove item from ListView </description>
	/// 	<param name="value" type="string"> Value of item to remove </param>
	/// </function>
	this.RemoveItem = function(value)
	{
		Fit.Validation.ExpectString(value);

		Fit.Array.ForEach(list.children, function(child)
		{
			if (decode(Fit.Dom.Data(child, "value")) === value)
			{
				Fit.Dom.Remove(child);
				return false;
			}
		});
	}

	/// <function container="Fit.Controls.ListView" name="RemoveItems" access="public">
	/// 	<description> Remove all items from ListView </description>
	/// </function>
	this.RemoveItems = function()
	{
		list.innerHTML = "";
		setActive(null);
	}

	// ============================================
	// PickerBase interface
	// ============================================

	this.GetDomElement = function()
	{
		return list;
	}

    this.HandleEvent = function(e)
    {
		Fit.Validation.ExpectEvent(e, true);

        var ev = Fit.Events.GetEvent(e);

        if (ev.type === "keydown")
        {
            if (ev.keyCode === 38) // arrow up
            {
                moveUp();

				// Prevent scrollable div from scrolling up
				Fit.Events.PreventDefault(ev);
            }
            else if (ev.keyCode === 40) // arrow down
            {
                moveDown();

				// Prevent scrollable div from scrolling down
				Fit.Events.PreventDefault(ev);
            }
            else if (ev.keyCode === 13) // enter
            {
                if (active === null && list.children.length === 1)
					moveDown(); // Select first item if no item is selected

				if (active !== null)
				{
					// Notice: We always pass False as current selection state to OnItemSelectionChanging since ListView does
					// not keep track of selection state. In theory item could very well already be selected in host control.
					// Event handlers should not trust boolean to reveal selection in host control, only in picker.
					if (me._internal.FireOnItemSelectionChanging(Fit.Dom.Text(active), decode(Fit.Dom.Data(active, "value")), false) === true)
					{
						me._internal.FireOnItemSelectionChanged(Fit.Dom.Text(active), decode(Fit.Dom.Data(active, "value")), true);
						me._internal.FireOnItemSelectionComplete();
					}
				}

				// Prevent form submit
				Fit.Events.PreventDefault(ev);
            }
        }
    }

	this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
	{
		// This will destroy control - it will no longer work!

		Fit.Dom.Remove(list);
		me = list = active = isIe8 = null;
		base();
	});

    // ============================================
	// Private
	// ============================================

	function setActive(elm)
	{
		Fit.Validation.ExpectDomElement(elm, true);

		if (active !== null)
			Fit.Dom.Data(active, "active", "false");

		active = (elm ? elm : null);

		if (active !== null)
		{
			Fit.Dom.Data(active, "active", "true");

			list.scrollTop = active.offsetHeight * Fit.Dom.GetIndex(active); // Alternative to active.scrollIntoView(true) which unfortunately also scrolls main view
			repaint();
		}
	}

    function moveUp()
    {
        if (list.children.length === 0)
            return;

        // Select item

        if (active === null) // Select first entry if no selection is made
        {
			setActive(list.firstChild);
        }
        else if (active.previousSibling !== null) // Select previous entry if available
        {
			setActive(active.previousSibling);
        }
    }

    function moveDown()
    {
        if (list.children.length === 0)
            return;

        // Select item

        if (active === null) // Select first entry if no selection is made
        {
			setActive(list.firstChild);
        }
        else if (active.nextSibling !== null) // Select next entry if available
        {
			setActive(active.nextSibling);
        }
    }

	function repaint()
	{
		if (isIe8 === true)
		{
			Fit.Dom.AddClass(list, "FitUi_Non_Existing_ListView_Class");
			Fit.Dom.RemoveClass(list, "FitUi_Non_Existing_ListView_Class");
		}
	}

	function decode(str)
	{
		Fit.Validation.ExpectString(str);
		return decodeURIComponent(str);
	}

	function encode(str)
	{
		Fit.Validation.ExpectString(str);
		return encodeURIComponent(str);
	}

	init();
}
Fit.Controls.WSListView = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.ListView).Apply(ctlId);

	var me = this;
	var url = null;
	var jsonpCallback = null;
	var onRequestHandlers = [];
	var onResponseHandlers = [];
	var onAbortHandlers = [];
	var onPopulatedHandlers = [];

	function init()
	{
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.WSListView" name="Url" access="public" returns="string">
	/// 	<description>
	/// 		Get/set URL to WebService responsible for providing data to control.
	/// 		WebService must deliver data in the following JSON format:
	/// 		[
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 1", Value: "1001", Selectable: true, Children: [] },
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 2", Value: "1002", Selectable: false, Children: [] }
	/// 		]
	/// 		Only Value is required. Children is a collection of items with the same format as described above.
	/// 		Be aware that items are treated as a flat list, even when hierarchically structured using the Children property.
	/// 		Items with Selectable set to False will simply be ignored (not shown) while children will still be added.
	/// 	</description>
	/// 	<param name="wsUrl" type="string"> WebService URL - e.g. http://server/ws/data.asxm/GetItems </param>
	/// </function>
	this.Url = function(wsUrl)
	{
		Fit.Validation.ExpectString(wsUrl, true);

		if (Fit.Validation.IsSet(wsUrl) === true)
		{
			url = wsUrl;
		}

		return url;
	}

	this.JsonpCallback = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			jsonpCallback = val;
		}

		return jsonpCallback;
	}

	/// <function container="Fit.Controls.WSListView" name="Reload" access="public">
	/// 	<description> Load/reload data from WebService </description>
	/// </function>
	this.Reload = function()
	{
		getData();
	}

	// See documentation on PickerBase
	this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
	{
		// This will destroy control - it will no longer work!

		me = url = onRequestHandlers = onResponseHandlers = onAbortHandlers = onPopulatedHandlers = null;
		base();
	});

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.WSListView" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is being requested.
	/// 		Request can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSListView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSListView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnRequest = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onRequestHandlers, cb);
	}

	/// <function container="Fit.Controls.WSListView" name="OnResponse" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is received,
	/// 		allowing for data transformation to occure before
	/// 		ListView is populated. Function receives two arguments:
	/// 		Sender (Fit.Controls.WSListView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSListView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Items: JSON items received from WebService
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnResponse = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onResponseHandlers, cb);
	}

	/// <function container="Fit.Controls.WSListView" name="OnAbort" access="public">
	/// 	<description>
	/// 		Add event handler fired if data request is canceled.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSListView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSListView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Items: JSON items received from WebService (Null in this particular case)
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnAbort = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onAbortHandlers, cb);
	}

	/// <function container="Fit.Controls.WSListView" name="OnPopulated" access="public">
	/// 	<description>
	/// 		Add event handler fired when ListView has been populated with items.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSListView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSListView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Items: JSON items received from WebService
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnPopulated = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPopulatedHandlers, cb);
	}

	// ============================================
	// Private
	// ============================================

	function getData()
	{
		if (url === null)
			Fit.Validation.ThrowError("Unable to get data, no WebService URL has been specified");

		var request = null;

		if (url.toLowerCase().indexOf(".asmx/") !== -1)
		{
			request = new Fit.Http.Request(url);
		}
		else if (jsonpCallback === null)
		{
			request = new Fit.Http.JsonRequest(url)
		}
		else
		{
			request = new Fit.Http.JsonpRequest(url, jsonpCallback);
		}

		//var request = ((url.toLowerCase().indexOf(".asmx/") === -1) ? new Fit.Http.Request(url) : new Fit.Http.JsonRequest(url));

		// Fire OnRequest

		var eventArgs = { Sender: me, Request: request, Items: null };

		if (fireEventHandlers(onRequestHandlers, eventArgs) === false)
			return;

		// Set request callbacks

		var onSuccess = function(data)
		{
			// Fire OnResponse

			eventArgs.Items = ((data instanceof Array) ? data : []);
			fireEventHandlers(onResponseHandlers, eventArgs);

			// Populate ListView

			me.RemoveItems();

			Fit.Array.ForEach(eventArgs.Items, function(item)
			{
				populate(item);
			});

			// Fire OnPopulated

			fireEventHandlers(onPopulatedHandlers, eventArgs);
		}

		var onFailure = function(httpStatusCode)
		{
			Fit.Validation.ThrowError("Unable to get data - request failed with HTTP Status code " + httpStatusCode)
		};

		var onAbort = function()
		{
			fireEventHandlers(onAbortHandlers, eventArgs);
		}

		if (Fit.Core.InstanceOf(request, Fit.Http.JsonpRequest) === false)
		{
			request.OnSuccess(function(req)
			{
				var data = request.GetResponseJson();
				onSuccess(data);
			});

			request.OnFailure(function(req)
			{
				onFailure(request.GetHttpStatus());
			});

			request.OnAbort(function(req)
			{
				onAbort();
			});
		}
		else
		{
			request.OnSuccess(function(response)
			{
				onSuccess(response);
			});

			request.OnTimeout(function()
			{
				onFailure("UNKNOWN (JSONP)");
			});
		}

		// Invoke request

		request.Start();
	}

	function populate(jsonItem)
	{
		Fit.Validation.ExpectIsSet(jsonItem);
		Fit.Validation.ExpectString(jsonItem.Value);
		Fit.Validation.ExpectString(jsonItem.Title, true);
		Fit.Validation.ExpectBoolean(jsonItem.Selectable, true);
		Fit.Validation.ExpectArray(jsonItem.Children, true);

		if (jsonItem.Selectable !== false)
			me.AddItem((jsonItem.Title ? jsonItem.Title : jsonItem.Value), jsonItem.Value);

		if (jsonItem.Children)
		{
			Fit.Array.ForEach(jsonItem.Children, function(c)
			{
				populate(c);
			});
		}
	}

	function fireEventHandlers(handlers, eventArgs)
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (cb(me, eventArgs) === false)
				cancel = true; // Do not cancel loop - all handlers must be fired!
		});

		return !cancel;
	}

	init();
}
/// <container name="Fit.Controls.ProgressBar">
/// 	ProgressBar control useful for indicating progress.
/// </container>

/// <function container="Fit.Controls.ProgressBar" name="ProgressBar" access="public">
/// 	<description> Create instance of ProgressBar control </description>
/// 	<param name="controlId" type="string" default="undefined">
/// 		Unique control ID. if specified, control will be
/// 		accessible using the Fit.Controls.Find(..) function.
/// 	</param>
/// </function>
Fit.Controls.ProgressBar = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);

	// Support for Fit.Controls.Find(..)

	if (Fit.Validation.IsSet(controlId) === true)
	{
		if (Fit._internal.ControlBase.Controls[controlId] !== undefined)
			Fit.Validation.ThrowError("Control with ID '" + controlId + "' has already been defined - Control IDs must be unique!");

		Fit._internal.ControlBase.Controls[controlId] = this;
	}

	// Internals

	var me = this;
	var id = (controlId ? controlId : null);
	var element = null;
	var status = null;
	var title = "";
	var width = { Value: 200, Unit: "px" }; // Any changes to this line must be dublicated to Width(..)
	var onProgressHandlers = [];

	function init()
	{
		element = document.createElement("div");

		if (id !== null)
			element.id = id;

		Fit.Dom.AddClass(element, "FitUiControl");
		Fit.Dom.AddClass(element, "FitUiControlProgressBar");

		status = document.createElement("div");
		status.style.width = "0%";
		Fit.Dom.AddClass(status, "FitUiControlProgressBarStatus");
		Fit.Dom.Add(element, status);

		title = document.createElement("span");
		Fit.Dom.Add(status, title);
	}

	/// <function container="Fit.Controls.ProgressBar" name="GetId" access="public" returns="string">
	/// 	<description> Get unique Control ID - returns Null if not set </description>
	/// </function>
	this.GetId = function()
	{
		return id;
	}

	/// <function container="Fit.Controls.ProgressBar" name="Title" access="public" returns="string">
	/// 	<description> Get/set title in progress bar </description>
	/// 	<param name="val" type="string" default="undefined"> If specified, title will be set to specified value </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			title.innerHTML = val;
		}

		return title.innerHTML;
	}

	/// <function container="Fit.Controls.ProgressBar" name="Width" access="public" returns="object">
	/// 	<description> Get/set control width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control width is updated to specified CSS unit </param>
	/// </function>
	this.Width = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				width = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				element.style.width = width.Value + width.Unit;
			}
			else
			{
				width = { Value: 200, Unit: "px" }; // Any changes to this line must be dublicated to line declaring the width variable !
				element.style.width = "";
			}
		}

		return width;
	}

	/// <function container="Fit.Controls.ProgressBar" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing control </description>
	/// </function>
	this.GetDomElement = function()
	{
		return element;
	}

	/// <function container="Fit.Controls.ProgressBar" name="Render" access="public">
	/// 	<description> Render control, either inline or to element specified </description>
	/// 	<param name="toElement" type="DOMElement" default="undefined"> If defined, control is rendered to this element </param>
	/// </function>
	this.Render = function(toElement)
	{
		Fit.Validation.ExpectDomElement(toElement, true);

		if (Fit.Validation.IsSet(toElement) === true)
		{
			Fit.Dom.Add(toElement, element);
		}
		else
		{
			var script = document.scripts[document.scripts.length - 1];
			Fit.Dom.InsertBefore(script, element);
		}
	}

	/// <function container="Fit.Controls.ProgressBar" name="Progress" access="public" returns="integer">
	/// 	<description> Get/set progress - a value between 0 and 100 </description>
	/// 	<param name="val" type="integer" default="undefined"> If defined, progress is set to specified value (0-100) </param>
	/// </function>
	this.Progress = function(val)
	{
		Fit.Validation.ExpectInteger(val, true);

		if (Fit.Validation.IsSet(val) === true && val >= 0 && val <= 100 && status.style.width !== val + "%")
		{
			status.style.width = val + "%";

			// Fire OnProgress event

			Fit.Array.ForEach(onProgressHandlers, function(cb)
			{
				cb(me);
			});
		}

		return parseInt(status.style.width);
	}

	/// <function container="Fit.Controls.ProgressBar" name="OnProgress" access="public">
	/// 	<description> Set callback function invoked when progress is changed </description>
	/// 	<param name="cb" type="function"> Callback function invoked when progress is changed - takes progress bar instance as argument </param>
	/// </function>
	this.OnProgress = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onProgressHandlers, cb);
	}

	/// <function container="Fit.Controls.ProgressBar" name="Dispose" access="public">
	/// 	<description> Destroys control to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		Fit.Dom.Remove(element);
		me = id = element = status = title = width = onProgressHandlers = null;

		if (Fit.Validation.IsSet(controlId) === true)
			delete Fit._internal.ControlBase.Controls[controlId];
	}

	init();
}
/// <container name="Fit.Controls.TreeView">
/// 	TreeView control allowing data to be listed in a structured manner.
/// 	Extending from Fit.Controls.PickerBase.
/// 	Extending from Fit.Controls.ControlBase.
///
/// 	Performance considerations (for huge amounts of data):
///
/// 	1) Selectable(..) is used to transform how nodes allow selections
/// 	   (disabled/single select/multi select/select all). This requires the function to
/// 	   recursively modify all nodes contained to make sure they are configured identically.
/// 	   However, this also happens when AddChild(node) is called, to make sure
/// 	   nodes added at any time is configured in accordance with TreeView configuration.
/// 	   Selectable(..) should therefore be called before adding nodes to prevent
/// 	   an extra recursive operation on all nodes contained.
///
/// 	2) Selected(nodes) performs better than Value("val1;val2;val3")
///
/// 	3) RemoveChild(node) performance is non-linear, relative to the amount of children contained.
/// 	   The function recursively iterates children to find selected nodes to deselect them, to
/// 	   make sure TreeView is updated accordingly.
///
/// 	4) GetChild("val1", true) is faster at finding one specific node, compared to recursively
/// 	   iterating the result from GetChildren(), since internal children collections are indexed.
///
/// 	5) Be aware that some operations (e.g. AddChild, Expand/Collapse, Select/Deselect) forces
/// 	   Internet Explorer 8 to repaint tree to work around render bugs. Repainting can be minimized
/// 	   greately by populating root nodes before adding them to the TreeView instance.
/// 	   However, be aware that this comes with the performance penalty mentioned in article 1 (AddChild).
/// 	   It is likely that repainting does not pose a major performance problem, though.
/// </container>

/// <function container="Fit.Controls.TreeView" name="TreeView" access="public">
/// 	<description> Create instance of TreeView control </description>
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.TreeView = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.PickerBase).Apply();
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var rootContainer = null;		// UL element
	var rootNode = null;			// Fit.Controls.TreeView.Node instance

	var keyNavigationEnabled = true;

	var selectable = false;
	var multiSelect = false;
	var showSelectAll = false;

	var selected = createInternalCollection();
	var selectedOrg = [];

	var ctx = null; // Context menu

	// These events fire when user interacts with the tree,
	// NOT when nodes are manipulated programmatically!
	// OnSelect and OnToggle can be canceled by returning False.
	// OnChange event is always fired when state of nodes are
	// manipulated, also when done programmatically.
	var onSelectHandlers = [];
	var onSelectedHandlers = [];
	var onToggleHandlers = [];
	var onToggledHandlers = [];
	var onSelectAllHandlers = [];
	var onContextMenuHandlers = [];

	var forceClear = false;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	// ============================================
	// Init
	// ============================================

	function init()
	{
		// Initial settings

		me.AddCssClass("FitUiControlTreeView");
		me._internal.Data("selectable", "false");
		me._internal.Data("multiselect", "false");
		me._internal.Data("wordwrap", "false");

		// Create internal root node to hold children

		rootContainer = document.createElement("ul");
		me._internal.AddDomElement(rootContainer);

		rootNode = new Fit.Controls.TreeView.Node(" ", "TREEVIEW_ROOT_NODE");
		rootNode.GetDomElement().tabIndex = -1;
		rootContainer.appendChild(rootNode.GetDomElement());

		// TreeView Node Interface:
		// The Tree View Node Interface allow nodes to synchronize their selection state to the TreeView.
		// That way the TreeView never has to recursively iterate a potentially huge tree to determine
		// which nodes are selected, to clear all nodes, etc.
		// One might wonder why the TreeView does not maintain the internal selected collection itself
		//  - after all, all event handling is performed by the TreeView, so it knows when a node is
		//    selected. The reason for this, of course, is that nodes can be selected programmatically as well.
		// The TreeView Node Interface also ensures that once a node is attached to the TreeView, any children added to that
		// particular node is configured accordingly with the existing nodes in the TreeView (Selectable, Checkbox, ShowSelectAll).

		var treeViewNodeInterface =
		{
			Select: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

				// Deselect selected node if Multi Selection is not enabled
				if (multiSelect === false && selected.length > 0)
					executeWithNoOnChange(function() { selected[0].Selected(false) });

				// Add node to internal selection
				Fit.Array.Add(selected, node);
			},
			Deselect: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

				// Remove node from internal selection
				Fit.Array.Remove(selected, node);
			},
			Selected: function(val)
			{
				Fit.Validation.ExpectArray(val, true);
				return me.Selected(val); // Fires OnChange
			},
			IsSelectable: function()
			{
				return selectable;
			},
			IsMultiSelect: function()
			{
				return multiSelect;
			},
			ShowSelectAll: function()
			{
				return showSelectAll;
			},
			Repaint: function()
			{
				repaint();
			},
			FireToggle: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
				return fireEventHandlers(onToggleHandlers, node);
			},
			FireToggled: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
				return fireEventHandlers(onToggledHandlers, node);
			},
			FireSelect: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

				// FireSelect is invoked prior to node change.
				// If TreeView is in Single Selection Mode, and a non-selectable node is already selected,
				// new selection is canceled by returning False, to keep existing selection.
				// However, we never want to cancel change if TreeView.Clear() is invoked, in which case forceClear is true.
				if (forceClear === false && multiSelect === false && selected.length > 0 && selected[0].Selectable() === false)
					return false;

				return fireEventHandlers(onSelectHandlers, node);
			},
			FireSelected: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
				fireEventHandlers(onSelectedHandlers, node);
			},
			FireOnChange: function()
			{
				me._internal.FireOnChange();
			},
			GetTreeView: function()
			{
				return me;
			}
		}

		rootNode.GetDomElement()._internal.TreeView = treeViewNodeInterface;

		// Event handling

		rootNode.GetDomElement().onkeydown = function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			var elm = Fit.Events.GetTarget(e);

			if (keyNavigationEnabled === false)
				return;

			//{ PickerControl support - START

			// If used as picker control, make sure first node is selected on initial key press
			if (hostControl !== null && activeNode === null && rootNode.GetChildren().length > 0)
			{
				focusNode(rootNode.GetChildren()[0]); // Sets activeNode to first child
				return;
			}

			// If onkeydown was not fired from a list item (which usually has focus),
			// it was most likely fired from a host control through HandleEvent(..).
			// In this case activeNode will be set.
			if (elm.tagName !== "LI" && hostControl !== null && activeNode !== null)
				elm = activeNode.GetDomElement();

			//} // PickerControl support - END

			// Variable elm above is almost always a <li> node element since we make sure only these elements are focused
			// when node is clicked or keyboard navigation occure. However, IF the node title for some strange reason contains an element
			// that gains focus (e.g. an input control), that element could be contained in the elm variable when onkeydown is fired.
			// We already make sure that <a> link elements do not gain focus which is more likely to be used as node title, so there
			// is almost no chance the elm variable will ever contain anything else but the <li> node element. But better safe than sorry.
			if (elm.tagName !== "LI")
				return;

			// Element is root node if user clicked next to a child node within root node element
			if (elm === rootNode.GetDomElement())
			{
				if (rootNode.GetChildren().length > 0)
					focusNode(rootNode.GetChildren()[0]); // Select first node

				Fit.Events.PreventDefault(ev);
				return;
			}

			var node = elm._internal.Node;

			// Handle context menu

			if (ev.keyCode === 93 || (Fit.Events.GetModifierKeys().Shift === true && ev.keyCode === 121)) // Context menu button or Shift+F10
			{
				var label = node.GetDomElement().querySelector("span");

				var pos = Fit.Dom.GetPosition(label);
				var scrollContainers = Fit.Dom.GetScrollPosition(label); // TreeView may be placed in container(s) with scroll
				var scrollDocument = Fit.Dom.GetScrollPosition(document.body); // Page may have been scrolled

				pos.X = (pos.X - scrollContainers.X) + scrollDocument.X + label.offsetWidth - 10;
				pos.Y = (pos.Y - scrollContainers.Y) + scrollDocument.Y + label.offsetHeight - 5;

				openContextMenu(node, pos);

				Fit.Events.PreventDefault(ev);
				return;
			}

			// Handle navigation links

			if (ev.keyCode === 13) // Enter
			{
				if (node.Selectable() === true)
				{
					node.Selected(true);
				}
				else
				{
					// Navigate link contained in item

					var links = node.GetDomElement().getElementsByTagName("a");

					if (links.length === 1)
						links[0].click();
				}

				Fit.Events.PreventDefault(ev);
				return;
			}

			// Toggle selection

			if (ev.keyCode === 32) // Spacebar (toggle selection)
			{
				if (node.Selectable() === true)
					toggleNodeSelection(node);

				Fit.Events.PreventDefault(ev);
				return;
			}

			// Determine which node to focus next on keyboard navigation (arrow keys)

			var next = null;

			if (ev.keyCode === 37) // Left (collapse or move to parent)
			{
				// Collapse node if expanded - if not expanded, jump to parent node

				if (node.Expanded() === true)
				{
					node.Expanded(false);
				}
				else
				{
					next = node.GetParent();
				}

				Fit.Events.PreventDefault(ev);
			}
			else if (ev.keyCode === 39) // Right (expand)
			{
				// Expand node if not already expanded, and children are contained

				if (node.Expanded() === false && node.GetChildren().length > 0)
					node.Expanded(true);

				Fit.Events.PreventDefault(ev);
			}
			else if (ev.keyCode === 38) // Up
			{
				// Move selection up
				next = getNodeAbove(node);

				Fit.Events.PreventDefault(ev);
			}
			else if (ev.keyCode === 40) // Down
			{
				// Move selection down
				next = getNodeBelow(node);

				Fit.Events.PreventDefault(ev);
			}

			// Focus next node

			if (next !== null)
				focusNode(next);
		}

		rootNode.GetDomElement().onclick = function(e)
		{
			var elm = Fit.Events.GetTarget(e);

			// If element was a node's checkbox, cancel change to selection,
			// and let node handle whether it should be checked or not.
			if (elm.tagName === "INPUT" && elm.parentElement.tagName === "LI")
				elm.checked = !elm.checked;

			var nodeElm = ((elm.tagName === "LI") ? elm : Fit.Dom.GetParentOfType(elm, "LI"));
			var node = nodeElm._internal.Node;

			// Focus node
			focusNode(node);

			// Toggle node if expand button was clicked
			if (elm.tagName === "DIV")
				node.Expanded(!node.Expanded());

			// Toggle selection or perform auto postback if node is selectable
			if (elm.tagName !== "DIV" && node.Selectable() === true)
			{
				toggleNodeSelection(node);
			}
		}

		Fit.Events.AddHandler(me.GetDomElement(), "contextmenu", function(e) { return Fit.Events.PreventDefault(e); }); // Disable context menu
		Fit.Events.AddHandler(me.GetDomElement(), "mouseup", function(e) // Select All feature
		{
			if (Fit.Events.GetPointerState().Buttons.Secondary === true) // Right click
			{
				var target = Fit.Events.GetTarget(e);

				if (target !== me.GetDomElement()) // Skip if right clicking TreeView container (possible if padding is applied)
				{
					var node = ((target.tagName === "LI") ? target._internal.Node : Fit.Dom.GetParentOfType(target, "li")._internal.Node);
					openContextMenu(node);
				}

				return Fit.Events.PreventDefault(e);
			}
		});

		var touchTimeout = null;
		Fit.Events.AddHandler(me.GetDomElement(), "touchstart", function(e)
		{
			var target = Fit.Events.GetTarget(e);

			if (target !== me.GetDomElement()) // Skip if touching TreeView container (possible if padding is applied)
			{
				touchTimeout = setTimeout(function()
				{
					var node = ((target.tagName === "LI") ? target._internal.Node : Fit.Dom.GetParentOfType(target, "li")._internal.Node);
					openContextMenu(node);

					touchTimeout = null;
				}, 500);
			}
		});
		Fit.Events.AddHandler(me.GetDomElement(), "touchend", function(e)
		{
			var elm = Fit.Events.GetTarget(e);

			if (touchTimeout !== null)
			{
				clearTimeout(touchTimeout);
				touchTimeout = null;
			}
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.TreeView" name="WordWrap" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether Word Wrapping is enabled </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables Word Wrapping, False disables it </param>
	/// </function>
	this.WordWrap = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			me._internal.Data("wordwrap", val.toString()); // Actual word-wrapping is achieved using CSS
			repaint();
		}

		return (me._internal.Data("wordwrap") === "true");
	}

	/// <function container="Fit.Controls.TreeView" name="Selectable" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether user can change selection state of nodes.
	/// 		This affects all contained nodes. To configure nodes
	/// 		individually, use Selectable(..) function on node instances.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables node selection, False disables it </param>
	/// 	<param name="multi" type="boolean" default="false"> If defined, True enables node multi selection, False disables it </param>
	/// 	<param name="showSelAll" type="boolean" default="false"> If defined, True enables Select All checkbox, False disables it </param>
	/// </function>
	this.Selectable = function(val, multi, showSelAll)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(multi, true);
		Fit.Validation.ExpectBoolean(showSelAll, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			selectable = val;
			multiSelect = ((multi === true) ? true : false);
			showSelectAll = ((showSelAll === true) ? true : false);

			me._internal.Data("selectable", selectable.toString());
			me._internal.Data("multiselect", multiSelect.toString());

			var fireOnChange = (selected.length > 0);

			selected = createInternalCollection();

			// Deselect all children and make sure they are configured identically
			executeWithNoOnChange(function() // Prevent n.Selected(false) from firering OnChange event
			{
				executeRecursively(rootNode, function(n)
				{
					if (n === rootNode)
						return; // Skip root node itself

					n.Selectable(selectable, multiSelect, showSelectAll)
					n.Selected(false);
				});
			});

			repaint();

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		return selectable;
	}

	/// <function container="Fit.Controls.TreeView" name="Selected" access="public" returns="Fit.Controls.TreeView.Node[]">
	/// 	<description> Get/set selected nodes </description>
	/// 	<param name="val" type="Fit.Controls.TreeView.Node[]" default="undefined"> If defined, provided nodes are selected </param>
	/// </function>
	this.Selected = function(val)
	{
		Fit.Validation.ExpectArray(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			selectedOrg = [];
			var fireOnChange = (selected.length > 0);

			executeWithNoOnChange(function() // Prevent node.Selected(true) from firering OnChange event
			{
				me.Clear();

				Fit.Array.ForEach(val, function(n)
				{
					Fit.Validation.ExpectInstance(n, Fit.Controls.TreeView.Node);

					var node = ((n.GetTreeView() === me) ? n : me.GetChild(n.Value(), true)); // Try GetChild(..) in case node was constructed, but with a valid value

					if (node === null)
						Fit.Validation.ThrowError("Node is not assiciated with this TreeView, unable to change selection");

					Fit.Array.Add(selectedOrg, node);
					node.Selected(true); // Adds node to internal selected collection through TreeViewNodeInterface
					fireOnChange = true;
				});
			});

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		return Fit.Array.Copy(selected); // Copy to prevent changes to internal selection array

		/*var copy = Fit.Array.Copy(selected); // Copy to prevent changes to internal selection array
		copy.toString = selected.toString;

		return copy;*/
	}

	/// <function container="Fit.Controls.TreeView" name="SelectAll" access="public">
	/// 	<description> Select all nodes </description>
	/// 	<param name="selected" type="boolean"> Value indicating whether to select or deselect nodes </param>
	/// 	<param name="selectAllNode" type="Fit.Controls.TreeView.Node" default="undefined">
	/// 		If specified, given node is selected/deselected along with all its children.
	/// 		If not specified, all nodes contained in TreeView will be selected/deselected.
	/// 	</param>
	/// </function>
	this.SelectAll = function(selected, selectAllNode)
	{
		Fit.Validation.ExpectBoolean(selected);
		Fit.Validation.ExpectInstance(selectAllNode, Fit.Controls.TreeView.Node, true);

		var node = (selectAllNode ? selectAllNode : null); // Null = select all nodes, Set = select only children under passed node

		// Fire OnSelectAll event

		if (fireEventHandlers(onSelectAllHandlers, { Node: node, Selected: selected }) === false)
			return; // Event handler canceled event

		// Change selection and expand (all nodes)

		var changed = false;

		executeWithNoOnChange(function() // Prevent OnChange from firing every time a node's selection state is changed
		{
			var nodes = ((node !== null) ? [node] : rootNode.GetChildren());

			Fit.Array.Recurse(nodes, "GetChildren", function(child)
			{
				if (child.Selectable() === true)
				{
					if (child.Selected() !== selected)
					{
						changed = true;
						child.Selected(selected);
					}
				}

				child.Expanded(true);
			});
		});

		if (changed === true)
			me._internal.FireOnChange();
	}

	// See documentation on ControlBase
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true)

		// Set

		if (Fit.Validation.IsSet(val) === true)
		{
			selectedOrg = [];
			var fireOnChange = (selected.length > 0);

			executeWithNoOnChange(function()
			{
				me.Clear();

				var values = val.split(";");

				Fit.Array.ForEach(values, function(nodeValue)
				{
					var nodeVal = decodeReserved(((nodeValue.indexOf("=") === -1) ? nodeValue : nodeValue.split("=")[1]));
					var child = me.GetChild(nodeVal, true);

					if (child !== null)
					{
						Fit.Array.Add(selectedOrg, child);
						child.Selected(true);
						fireOnChange = true;
					}
				});
			});

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		// Get

		var nodes = me.Selected();
		var value = "";

		Fit.Array.ForEach(nodes, function(node)
		{
			value += ((value !== "") ? ";" : "") + encodeReserved(node.Title()) + "=" + encodeReserved(node.Value());
		});

		return value;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		if (selected.length !== selectedOrg.length)
			return true;

		var dirty = false;
		Fit.Array.ForEach(selectedOrg, function(node)
		{
			if (Fit.Array.Contains(selected, node) === false)
			{
				dirty = true;
				return false;
			}
		});
		return dirty;
	}

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true)
		{
			var focused = getNodeFocused();

			if (focus === true && focused === null)
			{
				var nodes = rootNode.GetChildren();

				if (nodes.length > 0)
					nodes[0].Focused(true);
			}
			else if (focus === false && focused !== null)
			{
				focused.Focused(false);
			}
		}

		return (getNodeFocused() !== null);
	}

	/// <function container="Fit.Controls.TreeView" name="Lines" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether helper lines are shown.
	/// 		Notice that helper lines cause node items to obtain a fixed
	/// 		line height of 20px, making it unsuitable for large fonts.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables helper lines, False disables them </param>
	/// </function>
	this.Lines = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true)
			{
				me.AddCssClass("FitUiControlTreeViewLines");
				me.AddCssClass("FitUiControlTreeViewDotLines"); // Optional, render dotted lines instead of solid lines
			}
			else
			{
				me.RemoveCssClass("FitUiControlTreeViewLines");
				me.RemoveCssClass("FitUiControlTreeViewDotLines");
			}

			repaint();
		}

		return me.HasCssClass("FitUiControlTreeViewLines");
	}

	/// <function container="Fit.Controls.TreeView" name="ContextMenu" access="public" returns="Fit.Controls.ContextMenu">
	/// 	<description> Get/set instance of ContextMenu control triggered when right clicking nodes in TreeView </description>
	/// 	<param name="contextMenu" type="Fit.Controls.ContextMenu" default="undefined"> If defined, assignes ContextMenu control to TreeView </param>
	/// </function>
	this.ContextMenu = function(contextMenu)
	{
		Fit.Validation.ExpectInstance(contextMenu, Fit.Controls.ContextMenu, true);

		if (contextMenu !== undefined) // Accept null to disable context menu
		{
			ctx = contextMenu;
		}

		return ctx;
	}

	/// <function container="Fit.Controls.TreeView" name="Clear" access="public">
	/// 	<description>
	/// 		Fit.Controls.ControlBase.Clear override:
	/// 		Clear control value.
	/// 		Override allows for non-selectable nodes to keep their selection state.
	/// 		This is useful if TreeView has been configured to preselect some non-selectable
	/// 		nodes, hence preventing the user from removing these selections. In that case the
	/// 		desired functionality of the Clear function could be to preserve these preselections.
	/// 		If called with no arguments, all selections are cleared.
	/// 	</description>
	/// 	<param name="preserveNonSelectable" type="boolean" default="false">
	/// 		True causes selection state of non-selectable nodes to be preserved, False do not
	/// 	</param>
	/// </function>
	this.Clear = function(preserveNonSelectable)
	{
		if (selected.length === 0)
			return;

		forceClear = (preserveNonSelectable !== true);

		// Deselecting items causes them to be removed from internal selected collection.
		// Copying array to avoid breaking ForEach which doesn't like collection being modified while iterated.
		var sel = Fit.Array.Copy(selected);

		executeWithNoOnChange(function() // Prevent node.Selected(false) from firering OnChange
		{
			Fit.Array.ForEach(sel, function(node)
			{
				if (preserveNonSelectable !== true || node.Selectable() === true)
					node.Selected(false); // Removes node from internal selected collection through TreeViewNodeInterface
			});
		});

		forceClear = false;

		me._internal.FireOnChange();
	}

	/// <function container="Fit.Controls.TreeView" name="AddChild" access="public">
	/// 	<description> Add node to TreeView </description>
	/// 	<param name="node" type="Fit.Controls.TreeView.Node"> Node to add </param>
	/// </function>
	this.AddChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
		rootNode.AddChild(node);
	}

	/// <function container="Fit.Controls.TreeView" name="RemoveChild" access="public">
	/// 	<description> Remove node from TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes </description>
	/// 	<param name="node" type="Fit.Controls.TreeView.Node"> Node to remove </param>
	/// </function>
	this.RemoveChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
		rootNode.RemoveChild(node);
	}

	/// <function container="Fit.Controls.TreeView" name="RemoveAllChildren" access="public">
	/// 	<description> Remove all nodes contained in TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes </description>
	/// 	<param name="dispose" type="boolean" default="false"> Set True to dispose nodes </param>
	/// </function>
	this.RemoveAllChildren = function(dispose)
	{
		Fit.Validation.ExpectBoolean(dispose, true);

		var fireOnChange = (selected.length > 0);

		// Clear internal selections by creating new collection rather than calling me.Clear().
		// This is done to prevent OnSelect (and OnItemSelectionChanging), OnSelected (and
		// OnItemSelectionChanged), and OnChange from firing if selections were made.
		// In fact, we want to preserve selection state for removed nodes in case it is
		// needed later, e.g. if moved to another TreeView.
		selected = createInternalCollection();

		executeWithNoOnChange(function()
		{
			var children = rootNode.GetChildren();

			Fit.Array.ForEach(children, function(child)
			{
				if (dispose === true)
					child.Dispose();
				else
					rootNode.RemoveChild(child);
			});
		});

		if (fireOnChange === true)
			me._internal.FireOnChange();
	}

	/// <function container="Fit.Controls.TreeView" name="GetChild" access="public" returns="Fit.Controls.TreeView.Node">
	/// 	<description> Get node by value - returns Null if not found </description>
	/// 	<param name="val" type="string"> Node value </param>
	/// 	<param name="recursive" type="boolean" default="false"> If defined, True enables recursive search </param>
	/// </function>
	this.GetChild = function(val, recursive)
	{
		Fit.Validation.ExpectString(val);
		Fit.Validation.ExpectBoolean(recursive, true);

		return rootNode.GetChild(val, recursive);
	}

	/// <function container="Fit.Controls.TreeView" name="GetChildren" access="public" returns="Fit.Controls.TreeView.Node[]">
	/// 	<description> Get all children </description>
	/// </function>
	this.GetChildren = function()
	{
		return rootNode.GetChildren();
	}

	/// <function container="Fit.Controls.TreeView" name="GetAllNodes" access="public" returns="Fit.Controls.TreeView.Node[]">
	/// 	<description> Get all nodes across all children and their children, in a flat structure </description>
	/// </function>
	this.GetAllNodes = function()
	{
		var nodes = [];
		executeRecursively(rootNode, function(n)
		{
			if (n === rootNode)
				return;

			Fit.Array.Add(nodes, n);
		});
		return nodes;
	}

	/// <function container="Fit.Controls.TreeView" name="GetNodeFocused" access="public" returns="Fit.Controls.TreeView.Node">
	/// 	<description> Get node currently having focus - returns Null if no node has focus </description>
	/// </function>
	this.GetNodeFocused = function()
	{
		return getNodeFocused();
	}

	/// <function container="Fit.Controls.TreeView" name="GetNodeAbove" access="public" returns="Fit.Controls.TreeView.Node">
	/// 	<description> Get node above specified node - returns Null if no node is above the specified one </description>
	/// 	<param name="node" type="Fit.Controls.TreeView.Node"> Node to get node above </param>
	/// </function>
	this.GetNodeAbove = function(node)
	{
		return getNodeAbove(node, true);
	}

	/// <function container="Fit.Controls.TreeView" name="GetNodeBelow" access="public" returns="Fit.Controls.TreeView.Node">
	/// 	<description> Get node below specified node - returns Null if no node is below the specified one </description>
	/// 	<param name="node" type="Fit.Controls.TreeView.Node"> Node to get node below </param>
	/// </function>
	this.GetNodeBelow = function(node)
	{
		return getNodeBelow(node, true, true);
	}

	/// <function container="Fit.Controls.TreeView" name="KeyboardNavigation" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether keyboard navigation is enabled </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables keyboard navigation, False disables it </param>
	/// </function>
	this.KeyboardNavigation = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			keyNavigationEnabled = val;
		}

		return keyNavigationEnabled;
	}

	// See documentation on ControlBase
	var baseDispose = me.Dispose;
	this.Dispose = function()
	{
		// This will destroy control - it will no longer work!

		rootNode.Dispose();
		me = rootContainer = rootNode = selectable = multiSelect = showSelectAll = selected = selectedOrg = ctx = onContextMenuHandlers = onSelectHandlers = onSelectedHandlers = onToggleHandlers = onToggledHandlers = hostControl = activeNode = isIe8 = null;
		baseDispose();
	}

	// ============================================
	// Events (OnChange defined on BaseControl)
	// ============================================

	/// <function container="Fit.Controls.TreeView" name="OnSelect" access="public">
	/// 	<description>
	/// 		Add event handler fired when node is being selected or deselected.
	/// 		Selection can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnSelect = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnSelected" access="public">
	/// 	<description>
	/// 		Add event handler fired when node is selected or deselected.
	/// 		Selection can not be canceled. Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnSelected = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectedHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnToggle" access="public">
	/// 	<description>
	/// 		Add event handler fired when node is being expanded or collapsed.
	/// 		Toggle can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnToggle = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onToggleHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnToggled" access="public">
	/// 	<description>
	/// 		Add event handler fired when node is expanded or collapsed.
	/// 		Toggle can not be canceled. Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnToggled = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onToggledHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnSelectAll" access="public">
	/// 	<description>
	/// 		Add event handler fired when Select All is used for a given node.
	/// 		This event can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Node: Fit.Controls.TreeView.Node instance
	/// 		 - Selected: Boolean value indicating new selection state
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnSelectAll = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectAllHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnContextMenu" access="public">
	/// 	<description>
	/// 		Add event handler fired before context menu is shown.
	/// 		This event can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
	/// 		Use Sender.ContextMenu() to obtain a reference to the context menu.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnContextMenu = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onContextMenuHandlers, cb);
	}

	// ============================================
	// PickerBase interface
	// ============================================

	var hostControl = null;
	var activeNode = null;

	this.OnShow(function(sender)
	{
		// Reset scroll
		me.GetDomElement().scrollTop = 0;
		me.GetDomElement().scrollLeft = 0;
	});

	this.OnSelect(function(sender, node)
	{
		// Handlers may return False which will prevent node from being selected, and OnSelected from being fired
		return me._internal.FireOnItemSelectionChanging(node.Title(), node.Value(), node.Selected());
	});

	this.OnSelected(function(sender, node)
	{
		me._internal.FireOnItemSelectionChanged(node.Title(), node.Value(), node.Selected());
	});

	this.OnChange(function(sender)
	{
		me._internal.FireOnItemSelectionComplete();
	});

	this.SetSelections = function(items)
	{
		Fit.Validation.ExpectArray(items);

		var vals = [];
		var fireOnChange = false;

		Fit.Array.ForEach(items, function(item)
		{
			Fit.Array.Add(vals, item.Value);
		});

		// Set new selections provided by host control

		executeWithNoOnChange(function()
		{
			// Deselect nodes not found in items passed (vals array)

			Fit.Array.ForEach(Fit.Array.Copy(selected), function(selectedNode) // Copying array to prevent "Collection modified" error - deselecting nodes causes them to be removed from array
			{
				// Notice that non-selectable (read only) nodes always keep their selection state
				if (Fit.Array.Contains(vals, selectedNode.Value()) === false && selectedNode.Selectable() === true)
				{
					selectedNode.Selected(false);
					fireOnChange = true;
				}
			});

			// Select nodes from items argument not already selected

			Fit.Array.ForEach(vals, function(nodeVal)
			{
				var child = me.GetChild(nodeVal, true); // Based on indexed lookup - fast!

				// Notice: Items passed may contain nodes that were already selected, hence checking node's
				// Selected state to prevent OnChange from firing if items provided matched TreeView's current selection.
				if (child !== null && child.Selected() === false)
				{
					child.Selected(true);
					fireOnChange = true;
				}
			});
		});

		// Fire OnChange

		if (fireOnChange === true)
			me._internal.FireOnChange();
	}

	this.UpdateItemSelection = function(itemValue, selected)
	{
		Fit.Validation.ExpectString(itemValue);
		Fit.Validation.ExpectBoolean(selected);

		var node = me.GetChild(itemValue, true);

		if (node !== null && node.Selected() !== selected)
		{
			if (node.Selectable() === false)
				return false; // Cancel, node is not selectable

			node.Selected(selected); // Fires OnSelect (which fires OnItemSelectionChanging) and OnSelected (which fires OnItemSelectionChanged)

			if (node.Selected() !== selected)
				return false; // An event handler has canceled change, node's selection state was not updated - return false to prevent host control from adding item
		}
	}

	this.SetEventDispatcher = function(control)
	{
		Fit.Validation.ExpectDomElement(control);

		me.GetDomElement().style.paddingLeft = "0.5em";
		me.GetDomElement().style.paddingRight = "30px"; // Make room for scrollbar in drop down to prevent items from being partially hidden (drop down fits content up to a given maximum width, so items may not word wrap)

		// This is not pretty. SetEventDispatcher was implemented to support the TreeView
		// picker control which uses this function to register an OnBlur handler on the
		// input controls, which in turn is used to change how nodes are selected.
		// The TreeView was originally design so that nodes were highlighted when gaining
		// focus, but since we need to be able to navigate the TreeView while keeping
		// focus in the host control, this approach did not work.
		// Therefore, when this control is used as a picker control and navigation occure
		// through the host control and HandleEvent(..), nodes are selected using a CSS
		// data attribute (data-active=true), and when host control looses focus, we
		// revert to using the normal selection mode based on focus.

		if (Fit.Validation.IsSet(control) === true)
		{
			hostControl = control;

			// Make sure OnBlur handler is only registered once

			if (!hostControl._internal)
				hostControl._internal = {};

			if (hostControl._internal.TreeViewPickerControl)
				return;

			hostControl._internal.TreeViewPickerControl = me;

			// Register OnBlur handler

			Fit.Events.AddHandler(hostControl, "blur", function(e)
			{
				hostControl = null;

				// Host control may temporarily loose focus and regain it
				// shortly after (host control consists of multiple input controls).
				// Stay in Picker Control Mode for a short amount of time, allowing
				// the host control to regain focus, and keep item selection (activeNode).
				setTimeout(function()
				{
					if (hostControl !== null)
						return; // Host control regained focus - do not remove selection made using host control

					// Remove highlighting
					if (activeNode !== null)
						Fit.Dom.Data(activeNode.GetDomElement(), "active", null);

					// Make sure first child is selected, next time host control is used to navigate items
					activeNode = null;
				}, 100);
			});
		}
	}

    this.HandleEvent = function(e)
    {
		Fit.Validation.ExpectEvent(e, true);

		var ev = Fit.Events.GetEvent(e);

		if (ev.type === "keydown")
		{
			rootNode.GetDomElement().onkeydown(e);

			if (ev.keyCode === 37 || ev.keyCode === 39) // Left/Right
				return false; // Suppress, left/right is reserved for expanding/collapsing nodes
			if (ev.keyCode === 32) // Space
				return false; // Suppress, space is reserved for selecting nodes
		}
    }

	this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
	{
		// This will destroy control - it will no longer work!

		me.Dispose();
		base();
	});

	// ============================================
	// Private
	// ============================================

	function executeWithNoOnChange(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		me._internal.ExecuteWithNoOnChange(cb);
	}

	function executeRecursively(node, cb)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
		Fit.Validation.ExpectFunction(cb);

		if (cb(node) === false)
			return false;

		Fit.Array.ForEach(node.GetChildren(), function(child)
		{
			if (executeRecursively(child, cb) === false)
				return false;
		});
	}

	function createInternalCollection()
	{
		var selected = [];
		return selected;
	}

	function repaint()
	{
		// In some cases, IE8 does not repaint Treeview properly.
		// This often happens when modifying the TreeView programmatically.
		// Calling this function resolves the problem.

		if (isIe8 === true)
		{
			me.AddCssClass("FitUi_Non_Existing_TreeView_Class");
			me.RemoveCssClass("FitUi_Non_Existing_TreeView_Class");
		}
	}

	function toggleNodeSelection(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

		// TreeViewNodeInterface now takes care of deselecting an existing node if in Single Selection Mode,
		// but prevents selection change if currently selected node is non-selectable (read only).
		// See Select and FireSelect functions on TreeViewNodeInterface for details.
		// Node itself is responsible for firing OnChange which also happens through TreeViewNodeInterface.
		node.Selected(!node.Selected());
	}

	function focusNode(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

		if (hostControl !== null)
		{
			// Since host control has focus, we use the "active" data attribute
			// to indicate that the node has focus, even though it has not,
			// and keep a reference to the "pseudo focused" node in activeNode.

			if (activeNode !== null)
				Fit.Dom.Data(activeNode.GetDomElement(), "active", null);

			activeNode = node;
			Fit.Dom.Data(activeNode.GetDomElement(), "active", "true");

			// Scroll active node into view if necessary.
			// This is a bit expensive, especially if we navigate up the
			// tree from 5+ nested levels, and holds down the arrow key.

			// Get node position and height

			var nodePositionWithinControl = Fit.Dom.GetInnerPosition(activeNode.GetDomElement(), me.GetDomElement());
			var nodeHeightWithoutChildren = -1;

			var childrenContainer = ((activeNode.GetChildren().length > 0) ? activeNode.GetChildren()[0].GetDomElement().parentElement : null);

			if (childrenContainer !== null)
				childrenContainer.style.display = "none";

			nodeHeightWithoutChildren = activeNode.GetDomElement().offsetHeight;

			if (childrenContainer !== null)
				childrenContainer.style.display = "";

			// Scroll item into view

			// Vertical scroll
			if (nodePositionWithinControl.Y > (me.GetDomElement().scrollTop + me.GetDomElement().clientHeight - nodeHeightWithoutChildren) || nodePositionWithinControl.Y < me.GetDomElement().scrollTop)
				me.GetDomElement().scrollTop = nodePositionWithinControl.Y - (me.GetDomElement().clientHeight / 2); // Horizontal center

			// Horizontal scroll
			if (activeNode.GetLevel() > 2)
				me.GetDomElement().scrollLeft = nodePositionWithinControl.X;
			else
				me.GetDomElement().scrollLeft = 0;

			repaint();
		}
		else
		{
			node.Focused(true);
		}
	}

	function getNodeFocused()
	{
		return ((document.activeElement && document.activeElement.tagName === "LI" && document.activeElement._internal && Fit.Dom.Contained(rootContainer, document.activeElement) === true) ? document.activeElement._internal.Node : null);
	}

	function getNodeAbove(node, noLastOnExpand)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
		Fit.Validation.ExpectBoolean(noLastOnExpand, true);

		// Get parent node
		var parent = node.GetParent();
		parent = ((parent !== null) ? parent : rootNode);

		// Find current node's position in parent node
		var children = parent.GetChildren();
		var idx = Fit.Array.GetIndex(children, node);

		// Select node above current node, within same parent
		var next = ((idx > 0) ? children[idx-1] : null);

		if (noLastOnExpand === true)
			return next;

		// Now make sure the last node in a hierarchy
		// of expanded nodes gets selected.

		if (next !== null)
		{
			while (next.Expanded() === true)
			{
				children = next.GetChildren();
				next = children[children.length - 1];
			}
		}
		else
		{
			// Current node is top node within parent - select parent
			next = node.GetParent();
		}

		return next;
	}

	function getNodeBelow(node, noFirstOnExpand, noSkipToParent)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
		Fit.Validation.ExpectBoolean(noFirstOnExpand, true);
		Fit.Validation.ExpectBoolean(noSkipToParent, true);

		if (node.Expanded() === true && noFirstOnExpand !== true) // Select first child if current node is expanded
		{
			var children = node.GetChildren();
			return children[0];
		}
		else // Get node below current node within same level (parent)
		{
			// Get parent node

			var parent = node.GetParent();
			parent = ((parent !== null) ? parent : rootNode);

			// Find current node's position in parent node
			var children = parent.GetChildren();
			var idx = Fit.Array.GetIndex(children, node);

			// Select node below current node, within same parent
			var next = ((children.length - 1 >= idx + 1) ? children[idx+1] : null);

			if (noSkipToParent === true || next !== null || node.GetParent() === null) // Found, or last element within root node (in which case next variable is Null)
				return next;

			// No more nodes within parent - select node below parent

			return getNodeBelow(parent, true);
		}
	}

	function openContextMenu(node, pos) // pos is optional
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

		if (ctx === null)
			return;

		if (fireEventHandlers(onContextMenuHandlers, node) === false)
			return;

		if (Fit.Validation.IsSet(pos) === true)
			ctx.Show(pos.X, pos.Y);
		else
			ctx.Show();
	}

	function fireEventHandlers(handlers, evObj)
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (cb(me, evObj) === false)
				cancel = true; // Do NOT cancel loop though! All handlers must be fired!
		});

		return !cancel;
	}

	function decodeReserved(str)
	{
		Fit.Validation.ExpectString(str);
		return str.replace(/%3B/g, ";").replace(/%3D/g, "="); // Decode characters reserved for value format
	}

	function encodeReserved(str)
	{
		Fit.Validation.ExpectString(str);
		return str.replace(/;/g, "%3B").replace(/=/g, "%3D"); // Encode characters reserved for value format
	}

	init();
}

/// <function container="Fit.Controls.TreeView.Node" name="Node" access="public">
/// 	<description> Create instance of TreeView Node </description>
/// 	<param name="displayTitle" type="string"> Node title </param>
/// 	<param name="nodeValue" type="string"> Node value </param>
/// </function>
Fit.Controls.TreeView.Node = function(displayTitle, nodeValue)
{
	Fit.Validation.ExpectString(displayTitle);
	Fit.Validation.ExpectString(nodeValue);

	var me = this;
	var elmLi = null;
	var elmUl = null;
	var cmdToggle = null;
	var chkSelectAll = null;
	var chkSelect = null;
	var lblTitle = null;
	var childrenIndexed = {};
	var childrenArray = [];
	var lastChild = null;

	// ============================================
	// Init
	// ============================================

	function init()
	{
		elmLi = document.createElement("li");
		cmdToggle = document.createElement("div");
		lblTitle = document.createElement("span");

		me.Title(displayTitle);
		Fit.Dom.Data(elmLi, "value", encode(nodeValue));

		Fit.Dom.Data(elmLi, "state", "static");
		Fit.Dom.Data(elmLi, "selectable", "false");
		Fit.Dom.Data(elmLi, "selected", "false");
		Fit.Dom.Data(elmLi, "last", "false");

		elmLi.tabIndex = 0; // Make focusable

		elmLi.appendChild(cmdToggle);
		elmLi.appendChild(lblTitle);

		elmLi._internal = { Node: me, TreeView: null, TreeViewConfigOverrides: { Selectable: undefined, ShowCheckbox: undefined, ShowSelectAll: undefined } };
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.TreeView.Node" name="Title" access="public" returns="string">
	/// 	<description> Get/set node title </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, node title is updated </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			lblTitle.innerHTML = val;

			// Make sure any contained links do not receive focus when navigating TreeView with Tab/Shift+Tab
			Fit.Array.ForEach(lblTitle.getElementsByTagName("a"), function(link) { link.tabIndex = -1; });
		}

		return Fit.Dom.Text(lblTitle); // Using inner text to get rid of HTML formatting
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Value" access="public" returns="string">
	/// 	<description> Get node value </description>
	/// </function>
	this.Value = function()
	{
		return decode(Fit.Dom.Data(elmLi, "value")); // Read only - value has been used on parent node as index (childrenIndexed)
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Expanded" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether node is expanded </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True expands node, False collapses it </param>
	/// </function>
	this.Expanded = function(expand)
	{
		Fit.Validation.ExpectBoolean(expand, true);

		if (Fit.Validation.IsSet(expand) === true && Fit.Dom.Data(elmLi, "state") !== "static" && me.Expanded() !== expand)
		{
			var tv = elmLi._internal.TreeView;

			// Fire OnToggle event

			if (tv !== null && tv.FireToggle(me) === false)
				return (Fit.Dom.Data(elmLi, "state") === "expanded");

			// Update state

			Fit.Dom.Data(elmLi, "state", ((expand === true) ? "expanded" : "collapsed"));

			// Repaint and fire OnToggled event

			if (tv !== null)
			{
				tv.Repaint();
				tv.FireToggled(me);
			}
		}

		return (Fit.Dom.Data(elmLi, "state") === "expanded");
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Selectable" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether user can change node selection state </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables node selection, False disables it </param>
	/// 	<param name="showCheckbox" type="boolean" default="false"> If defined, True adds a selection checkbox, False removes it </param>
	/// 	<param name="showSelectAll" type="boolean" default="false"> If defined, True adds a Select All checkbox useful for selecting all children, False removes it </param>
	/// </function>
	this.Selectable = function(val, showCheckbox, showSelectAll)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(showCheckbox, true);
		Fit.Validation.ExpectBoolean(showSelectAll, true);


		// TODO: REMEMBER - Update HasSelectAll() function when support for Select All is added!!


		if (Fit.Validation.IsSet(val) === true)
		{
			// Prevent node from obtaining configuration from TreeView if explicitly set
			// before adding node to TreeView. See AddChild(..) for TreeViewConfigOverrides usage.
			elmLi._internal.TreeViewConfigOverrides.Selectable = val;
			elmLi._internal.TreeViewConfigOverrides.ShowCheckbox = showCheckbox;
			elmLi._internal.TreeViewConfigOverrides.ShowSelectAll = showSelectAll;

			Fit.Dom.Data(elmLi, "selectable", val.toString());

			if (showCheckbox === true && chkSelect === null)
			{
				chkSelect = document.createElement("input");
				chkSelect.type = "checkbox";
				chkSelect.tabIndex = "-1";
				chkSelect.checked = me.Selected();

				Fit.Dom.InsertBefore(lblTitle, chkSelect);
			}
			else if (showCheckbox === false && chkSelect !== null)
			{
				Fit.Dom.Remove(chkSelect);
				chkSelect = null;
			}

			if (chkSelect !== null)
				chkSelect.disabled = ((val === false) ? true : false);
		}

		return (Fit.Dom.Data(elmLi, "selectable") === "true");
	}

	/// <function container="Fit.Controls.TreeView.Node" name="HasCheckbox" access="public" returns="boolean">
	/// 	<description> Get value indicating whether node has its selection checkbox enabled </description>
	/// </function>
	this.HasCheckbox = function()
	{
		return (chkSelect !== null);
	}

	/// <function container="Fit.Controls.TreeView.Node" name="HasSelectAll" access="public" returns="boolean">
	/// 	<description> Get value indicating whether node has its Select All checkbox enabled </description>
	/// </function>
	this.HasSelectAll = function()
	{
		return false;
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Selected" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether node is selected.
	/// 		If node is selected, it will automatically be made
	/// 		selectable, if not already done so.
	/// 	</description>
	/// 	<param name="select" type="boolean" default="undefined"> If defined, True selects node, False deselects it </param>
	/// </function>
	this.Selected = function(select)
	{
		Fit.Validation.ExpectBoolean(select, true);

		// Notice:
		// Nodes are responsible for keeping the TreeView current
		// in regards to selected nodes, through the TreeViewNodeInterface.
		// If this approach was not used, TreeView would have to
		// iterate recursively over all nodes to determine which
		// nodes are selected, which would be too expensive for
		// huge tree views containing thousands of nodes.

		if (Fit.Validation.IsSet(select) === true && me.Selected() !== select)
		{
			var tv = elmLi._internal.TreeView;

			// Fire OnSelect event

			if (tv !== null && tv.FireSelect(me) === false)
				return (Fit.Dom.Data(elmLi, "selected") === "true");

			var wasSelected = me.Selected();

			// Update state

			Fit.Dom.Data(elmLi, "selected", select.toString());

			if (chkSelect !== null)
				chkSelect.checked = select;

			// Repaint

			if (tv !== null)
				tv.Repaint();

			// Synchronize selection to TreeView

			if (tv !== null)
			{
				if (select === true && wasSelected === false)
				{
					tv.Select(me);
					tv.FireSelected(me);
					tv.FireOnChange();
				}
				else if (select === false && wasSelected === true)
				{
					tv.Deselect(me);
					tv.FireSelected(me);
					tv.FireOnChange();
				}
			}
		}

		return (Fit.Dom.Data(elmLi, "selected") === "true");
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Focused" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether node has focus </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True assigns focus, False removes it (blur) </param>
	/// </function>
	this.Focused = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true)
				elmLi.focus();
			else if (document.activeElement === elmLi)
				elmLi.blur();
		}

		return (document.activeElement === elmLi);
	}

	/// <function container="Fit.Controls.TreeView.Node" name="GetParent" access="public" returns="Fit.Controls.TreeView.Node">
	/// 	<description> Get parent node - returns Null if node has no parent </description>
	/// </function>
	this.GetParent = function()
	{
		if (!elmLi.parentElement)
			return null; // Not rooted in another node yet
		if (!elmLi.parentElement.parentElement._internal)
			return null; // Rooted, but not in another node - most likely rooted in TreeView UL container
		if (elmLi.parentElement.parentElement._internal.Node.Value() === "TREEVIEW_ROOT_NODE")
			return null; // Indicate top by returning Null when root node is reached

		return elmLi.parentElement.parentElement._internal.Node;
	}

	/// <function container="Fit.Controls.TreeView.Node" name="GetTreeView" access="public" returns="Fit.Controls.TreeView">
	/// 	<description> Returns TreeView if associated, otherwise Null </description>
	/// </function>
	this.GetTreeView = function()
	{
		if (elmLi._internal.TreeView !== null)
			return elmLi._internal.TreeView.GetTreeView();

		return null;
	}

	/// <function container="Fit.Controls.TreeView.Node" name="GetLevel" access="public" returns="integer">
	/// 	<description> Get node depth in current hierarchy - root node is considered level 0 </description>
	/// </function>
	this.GetLevel = function()
	{
		var level = 0;
		var node = me;

		while ((node = node.GetParent()) !== null) // Parent is Null when no more nodes are found, and when TREEVIEW_ROOT_NODE is reached for nodes rooted in TreeView
		{
			level++;
		}

		return level;
	}

	/// <function container="Fit.Controls.TreeView.Node" name="AddChild" access="public">
	/// 	<description> Add child node </description>
	/// 	<param name="node" type="Fit.Controls.TreeView.Node"> Node to add </param>
	/// </function>
	this.AddChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

		// Remove node from existing parent if already rooted.
		// This is important to make sure that TreeView, from which
		// node is moved, is updated to reflect the change, and
		// to ensure that node (and its children) is no longer capable
		// of updating the old TreeView through its TreeViewNodeInterface.

		if (node.GetParent() !== null)
			node.GetParent().RemoveChild(node);
		if (node.GetTreeView() !== null)
			node.GetTreeView().RemoveChild(node);

		// Register child node.
		// This is done prior to firing any events so that event handlers
		// can rely on node being fully accessible through DOM (rooted).

		// Create child container (<ul>) if not already added
		if (elmUl === null)
		{
			elmUl = document.createElement("ul");
			elmLi.appendChild(elmUl);

			Fit.Dom.Data(elmLi, "state", "collapsed");
		}

		// Make sure last node is marked as such, allowing for specialized CSS behaviour
		if (lastChild !== null)
			Fit.Dom.Data(lastChild.GetDomElement(), "last", "false");
		Fit.Dom.Data(node.GetDomElement(), "last", "true");
		lastChild = node;

		// Add child to DOM and internal collections
		elmUl.appendChild(node.GetDomElement());
		childrenIndexed[node.Value()] = node;
		Fit.Array.Add(childrenArray, node);

		// Changing data attribute above requires repaint in IE8
		// for dynamically added nodes to render helper lines properly.
		if (elmLi._internal.TreeView !== null)
			elmLi._internal.TreeView.Repaint();

		// Configure TreeView association and synchronize selection state

		var tv = elmLi._internal.TreeView;

		if (tv !== null)
		{
			var selected = [];
			var fireOnChange = false;

			executeRecursively(node, function(n)
			{
				//n.GetDomElement()._internal.TreeView = null; // Avoid conflicts if node currently belongs to another TreeView (e.g. drag and drop)

				if (n.Selected() === true)
				{
					// Deselect node which allows us to reselect it later and have all
					// relevant events fired with appropriate current selection state set
					// (OnSelect with Selected = false, and OnSelected with Selected = true).
					Fit.Array.Add(selected, n);
					n.Selected(false); // Does not fire any events since TreeViewNodeInterface is not set yet
				}

				n.GetDomElement()._internal.TreeView = tv;
				var ovr = n.GetDomElement()._internal.TreeViewConfigOverrides;

				// Configure node like TreeView, unless node has been explicitly configured (see TreeViewConfigOverrides)
				n.Selectable(((Fit.Validation.IsSet(ovr.Selectable) === true) ? ovr.Selectable : tv.IsSelectable()), ((Fit.Validation.IsSet(ovr.ShowCheckbox) === true) ? ovr.ShowCheckbox : tv.IsMultiSelect()), ((Fit.Validation.IsSet(ovr.ShowSelectAll) === true) ? ovr.ShowSelectAll : tv.ShowSelectAll()));
			});

			// Re-select nodes initially selected

			Fit.Array.ForEach(selected, function(node)
			{
				// Notice that TreeViewNodeInterface is temporarily removed to prevent
				// node.Selected(true) from firing events - we do not want OnChange to be
				// fired multiple times, so we fire only OnSelect and OnSelected below.
				node.GetDomElement()._internal.TreeView = null;

				if (tv.FireSelect(node) === true)
				{
					node.Selected(true);
					tv.Select(node);
					tv.FireSelected(node);
					fireOnChange = true;
				}

				node.GetDomElement()._internal.TreeView = tv;
			});

			// Fire OnChange if selections were made

			if (fireOnChange === true)
				tv.FireOnChange();
		}
	}

	/// <function container="Fit.Controls.TreeView.Node" name="RemoveChild" access="public">
	/// 	<description> Remove child node - this does not result in TreeView.OnSelect and TreeView.OnSelected being fired for selected nodes </description>
	/// 	<param name="node" type="Fit.Controls.TreeView.Node"> Node to remove </param>
	/// </function>
	this.RemoveChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

		if (node.GetParent() === me || (me.Value() === "TREEVIEW_ROOT_NODE" && me.GetTreeView().GetChild(node.Value()) !== null))
		{
			// Deconfigure TreeView association and synchronize selection state

			var tv = node.GetDomElement()._internal.TreeView;

			if (tv !== null)
			{
				// Deselecting selected nodes in TreeView

				var fireOnChange = false;

				executeRecursively(node, function(n)
				{
					if (n.Selected() === true)
					{
						// Node itself remains selected, this only removes node from TreeView's internal selection collection.
						// Notice that OnSelect and OnSelected is not fired since the node is not actually deselected, only removed from TreeView.
						tv.Deselect(n);

						fireOnChange = true;
					}

					n.GetDomElement()._internal.TreeView = null; // Make sure removed node cannot update TreeView anymore
				});

				if (fireOnChange === true)
					tv.FireOnChange();
			}

			// Remove from DOM

			elmUl.removeChild(node.GetDomElement());
			delete childrenIndexed[node.Value()];
			Fit.Array.Remove(childrenArray, node);

			if (childrenArray.length === 0)
			{
				elmLi.removeChild(elmUl);
				elmUl = null;
				Fit.Dom.Data(elmLi, "state", "static");
			}

			// Update last node

			if (node === lastChild)
			{
				lastChild = null;
				Fit.Dom.Data(node.GetDomElement(), "last", "false");

				if (childrenArray.length > 0)
				{
					lastChild = childrenArray[childrenArray.length - 1];
					Fit.Dom.Data(lastChild.GetDomElement(), "last", "true");
				}
			}

			// Make sure helper lines are repainted on IE8
			if (elmLi._internal.TreeView !== null)
				elmLi._internal.TreeView.Repaint();
		}
	}

	/// <function container="Fit.Controls.TreeView.Node" name="GetChild" access="public" returns="Fit.Controls.TreeView.Node">
	/// 	<description> Get node by value - returns Null if not found </description>
	/// 	<param name="val" type="string"> Node value </param>
	/// 	<param name="recursive" type="boolean" default="false"> If defined, True enables recursive search </param>
	/// </function>
	this.GetChild = function(val, recursive)
	{
		Fit.Validation.ExpectString(val);
		Fit.Validation.ExpectBoolean(recursive, true);

		var node = childrenIndexed[val];

		if (node === undefined && recursive === true)
		{
			var found = null;
			Fit.Array.ForEach(childrenArray, function(child)
			{
				found = child.GetChild(val, recursive);

				if (found !== null)
					return false;
			});
			return found;
		}

		return ((node !== undefined) ? node : null);
	}

	/// <function container="Fit.Controls.TreeView.Node" name="GetChildren" access="public" returns="Fit.Controls.TreeView.Node[]">
	/// 	<description> Get all children </description>
	/// </function>
	this.GetChildren = function()
	{
		return Fit.Array.Copy(childrenArray); // Copy to prevent changes to internal children array
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Dispose" access="public">
	/// 	<description> Destroys object to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		// This will destroy node - it will no longer work!

		// Dispose children
		Fit.Array.ForEach(Fit.Array.Copy(childrenArray), function(child) { child.Dispose(); });

		// Remove from DOM

		var parentNode = me.GetParent();

		if (parentNode !== null)
		{
			parentNode.RemoveChild(me);
		}
		else
		{
			if (me.GetTreeView() !== null)
			{
				me.GetTreeView().RemoveChild(me);
			}
			else
			{
				Fit.Dom.Remove(elmLi);
			}
		}

		// Dispose private members
		me = elmLi = elmUl = cmdToggle = chkSelectAll = chkSelect = lblTitle = childrenIndexed = childrenArray = lastChild
	}

	/// <function container="Fit.Controls.TreeView.Node" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing node </description>
	/// </function>
	this.GetDomElement = function()
	{
		return elmLi;
	}

	// Private

	function executeRecursively(node, cb)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
		Fit.Validation.ExpectFunction(cb);

		if (cb(node) === false)
			return false;

		Fit.Array.ForEach(node.GetChildren(), function(child)
		{
			if (executeRecursively(child, cb) === false)
				return false;
		});
	}

	function decode(str)
	{
		Fit.Validation.ExpectString(str);
		return decodeURIComponent(str); // Turn string back to original value
	}

	function encode(str)
	{
		Fit.Validation.ExpectString(str);
		return encodeURIComponent(str); // Allow value to be stored in a HTML Data Attribute
	}

	init();
}
/// <container name="Fit.Controls.WSTreeView">
/// 	TreeView control allowing data from a
/// 	WebService to be listed in a structured manner.
/// 	Extending from Fit.Controls.TreeView.
///
/// 	Notice: WSTreeView works a bit differently from TreeView.
/// 	Nodes are loaded on-demand, meaning when Selected(..) or Value(..)
/// 	is called to set selections, nodes not loaded yet are stored internally as
/// 	preselections. Nodes not loaded yet will not have OnSelect, OnSelected,
/// 	and any associated events fired, until they are actually loaded.
/// 	But they will be returned when Selected() or Value() is called (getters).
/// 	OnChange, however, will always be fired when selections are changed,
/// 	no matter if nodes are loaded or not.
/// </container>

/// <function container="Fit.Controls.WSTreeView" name="WSTreeView" access="public">
/// 	<description> Create instance of WSTreeView control </description>
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.WSTreeView = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.TreeView).Apply(ctlId);

	var me = this;
	var url = null;
	var jsonpCallback = null;
	var rootNode = null;
	var preSelected = {};
	var orgSelected = [];
	var loadDataOnInit = true;
	var selectAllMode = Fit.Controls.WSTreeView.SelectAllMode.Progressively;
	var onRequestHandlers = [];
	var onResponseHandlers = [];
	var onAbortHandlers = [];
	var onPopulatedHandlers = [];

	function init()
	{
		rootNode = me.GetDomElement().firstChild.firstChild._internal.Node;
		rootNode.GetDomElement()._internal.WSHasChildren = true; // Support for nodeFullyLoaded(..)

		me.OnToggle(function(sender, node)
		{
			if (node.Expanded() === true) // Node is currently expanded and will now become collapsed
				return;

			if (node.GetDomElement()._internal.WSDone === true)
				return;

			if (node.GetDomElement()._internal.WSLoading === true)
				return false; // Return False to cancel toggle to prevent user from being able to expand node while loading (clicking expand twice)

			if (node.GetDomElement()._internal.WSHasChildren === false)
				return;

			// Get data

			node.GetDomElement()._internal.WSLoading = true;

			var canceled = !getData(node, function(n, eventArgs) // Delegate fired when data is ready
			{
				// Remove place holder child which served the purpose of making the node expandable

				var expanderNode = node.GetChild("__");

				if (expanderNode !== null)
					node.RemoveChild(expanderNode);

				// Populate node

				Fit.Array.ForEach(eventArgs.Children, function(c)
				{
					node.AddChild(createNodeFromJson(c));
				});

				node.GetDomElement()._internal.WSDone = true;
				node.Expanded(true); // Unfortunately causes both OnToggle and OnToggled to be fired, although OnToggle has already been fired once (canceled below)
			});

			return false; // Cancel toggle, will be "resumed" when data is loaded
		});

		//{ SelectAll - Mode: Progressively

		// Progressive Mode - how it works:
		// Nodes are loaded progressively (chain loaded).
		// Nodes with children not loaded yet are automatically expanded to force their children to load.
		// WebService may return multiple levels of nodes, or even the complete hierarchy, but Progressive Mode
		// will never be able to quarantee that only one request is made, since the node triggering Select All
		// may already have multiple children loaded with HasChildren set to True, which will spawn individual
		// requests when expanded. OnChange will fire multiple times.
		// Chain loading is made possible using the OnPopulated handler which automatically expands children received.

		me.OnSelectAll(function(sender, eventArgs)
		{
			if (selectAllMode !== Fit.Controls.WSTreeView.SelectAllMode.Progressively)
				return;

			// Handle Select All for TreeView containing no data yet

			var node = ((eventArgs.Node !== null) ? eventArgs.Node : rootNode);

			// Flags set below ensures that Select All is resumed in OnPopulated event handler
			node.GetDomElement()._internal.WSSelectAll = true;
			node.GetDomElement()._internal.WSCheckedState = eventArgs.Selected;

			if (loadDataOnInit === true) // No data - load root nodes
			{
				setTimeout(function() // Postpone call to Reload to allow SelectAll to fire all OnSelectAll listeners before requesting data which causes OnRequest to fire
				{
					// Use Reload function to load root nodes - using expand/collapse on TREEVIEW_ROOT_NODE
					// will cause it to be passed to event handlers which is not the desired behaviour.
					// We always want Null to be passed to event handlers when requesting root nodes.

					var selected = me.Selected(); // Keep PreSelections (Reload(..) removes all selections))
					me.Reload();
					me.Selected(selected); // Restore selections
				}, 0);

				return false; // Cancel SelectAll, no nodes to select
			}

			// Handle Select All for TreeView with data already loaded.

			Fit.Array.Recurse(node.GetChildren(), "GetChildren", function(n)
			{
				var internal = n.GetDomElement()._internal;

				if (internal.WSHasChildren === true && internal.WSDone !== true) // Node has children server side which have not been loaded yet
				{
					internal.WSSelectAll = true;
					internal.WSCheckedState = eventArgs.Selected;
				}
			});

			// Event handler complete - caller (TreeView.SelectAll) takes over now, selecting and expanded node and its children, causing those with HasChildren:true to load
		});

		me.OnPopulated(function(sender, eventArgs)
		{
			if (selectAllMode !== Fit.Controls.WSTreeView.SelectAllMode.Progressively)
				return;

			var node = ((eventArgs.Node !== null) ? eventArgs.Node : rootNode);
			var selected = node.GetDomElement()._internal.WSCheckedState;

			if (node.GetDomElement()._internal.WSSelectAll === true) // Select All triggered request
			{
				// Select and expand all children

				var fireOnChange = false;

				me._internal.ExecuteWithNoOnChange(function()
				{
					Fit.Array.Recurse(node.GetChildren(), "GetChildren", function(child)
					{
						// Make sure children (and their children) keeps loading in Progressive Mode (chain loading).

						var internal = child.GetDomElement()._internal;

						if (internal.WSHasChildren === true && internal.WSDone !== true) // Node has children server side which have not loaded yet
						{
							internal.WSSelectAll = true;
							internal.WSCheckedState = selected;
						}

						// Select node if selectable

						if (child.Selectable() === true && child.Selected() !== selected)
						{
							child.Selected(selected);
							fireOnChange = true;
						}

						// Expand node to load children (HasChildren)

						child.Expanded(true);
					});
				});

				if (fireOnChange === true)
					me._internal.FireOnChange();
			}
		});

		//}

		//{ SelectAll - Mode: Instantly

		// Instant Mode - how it works:
		// Node on which Select All is triggered will have all its children removed (in OnResponse handler)
		// and replaced by the new data returned. This is to prevent that any children already loaded is
		// expanded and causing separate requests. Instant Mode is quaranteed to only trigger
		// one request and fire OnChange only once, provided that no nodes returned has HasChildren set to True
		// which WILL trigger additional requests and fire OnChange multiple times.
		// Instant Mode provides better performance over Progressive Mode since the latter will constantly
		// occupy the JS thread on and off, as nodes are received from multiple requests, making the browser less responsive.

		me.OnSelectAll(function(sender, eventArgs)
		{
			if (selectAllMode !== Fit.Controls.WSTreeView.SelectAllMode.Instantly)
				return;

			var node = ((eventArgs.Node !== null) ? eventArgs.Node : rootNode);
			var internal = node.GetDomElement()._internal;

			// Check whether all nodes have already been loaded

			if (nodeFullyLoaded(node) === true)
				return; // Everything is already loaded, let TreeView.SelectAll take care of selecting and expanding nodes

			// Some (or all) children missing - load now

			// Flags set below ensures that Select All is resumed in OnPopulated event handler
			internal.WSSelectAll = true;
			internal.WSCheckedState = eventArgs.Selected;

			if (node === rootNode) // Load root nodes
			{
				setTimeout(function() // Postpone call to Reload to allow SelectAll to fire all OnSelectAll listeners before requesting data, causing OnRequest to fire
				{
					var selected = me.Selected(); // Keep PreSelections (Reload(..) removes all selections))
					me.Reload();
					me.Selected(selected); // Restore selections
				}, 0);
			}
			else
			{
				// Clear WebService state in case node has already been expanded
				delete internal.WSDone;
				delete internal.WSLoading;

				// Make node load children after OnSelectAll is canceled below, by returning False
				node.Expanded(false);
				setTimeout(function() { node.Expanded(true); }, 0);
			}

			// Cancel SelectAll, it will cause any existing children to be selected, and in turn fire OnChange.
			// Children will be selected once the complete hierarchy of children is received and populated (see OnResponse and OnPopulated below).
			return false;
		});

		me.OnResponse(function(sender, eventArgs)
		{
			if (selectAllMode !== Fit.Controls.WSTreeView.SelectAllMode.Instantly)
				return;

			// Remove any existing children (subtree may have been partially loaded by user).
			// WebService is expected to return entire record set capable of replacing partially loaded data.

			var node = ((eventArgs.Node !== null) ? eventArgs.Node : rootNode);
			var selected = node.GetDomElement()._internal.WSCheckedState;

			if (node.GetDomElement()._internal.WSSelectAll === true) // Select All triggered request
			{
				me._internal.ExecuteWithNoOnChange(function() // Prevent checked nodes from firing OnChange when removed, fires in OnPopulated event handler
				{
					// Deselect children first (recursively) - may need to be synchronized with drop down control
					Fit.Array.Recurse(node.GetChildren(), "GetChildren", function(n)
					{
						n.Selected(false); // NOTICE: In case n.Selectable() returns False, we rely on WebService to return node with the same Selectable and Selected state as it has now
					});

					// Remove nodes - will be replaced in OnPopulated event handler
					Fit.Array.ForEach(node.GetChildren(), function(child)
					{
						node.RemoveChild(child);
					});
				});
			}
		});

		me.OnPopulated(function(sender, eventArgs)
		{
			if (selectAllMode !== Fit.Controls.WSTreeView.SelectAllMode.Instantly)
				return;

			var node = ((eventArgs.Node !== null) ? eventArgs.Node : rootNode);
			var selected = node.GetDomElement()._internal.WSCheckedState;

			if (node.GetDomElement()._internal.WSSelectAll === true) // Select All triggered request
			{
				// Select/deselect and expand all nodes

				var changed = false;

				me._internal.ExecuteWithNoOnChange(function()
				{
					if (node !== rootNode && node.Selectable() === true && node.Selected() !== selected)
					{
						node.Selected(selected);
						changed = true;
					}

					Fit.Array.Recurse(node.GetChildren(), "GetChildren", function(child)
					{
						// Support HasChildren:true, even in Instant Mode

						var childInternal = child.GetDomElement()._internal;

						if (childInternal.WSHasChildren === true && childInternal.WSDone !== true) // Node has children server side which have not loaded yet
						{
							Fit.Browser.Log("NOTICE: WebService did not provide all data in one single HTTP request - an additional request is required to load data for node with value '" + child.Value() + "'");
							childInternal.WSSelectAll = true;
							childInternal.WSCheckedState = selected;
						}

						// Select node if selectable

						if (child.Selectable() === true && child.Selected() !== selected)
						{
							child.Selected(selected);
							changed = true;
						}

						// Expand node to load children (HasChildren)

						child.Expanded(true);
					});
				});

				if (changed === true)
					me._internal.FireOnChange();
			}
		});

		//}
	}

	/// <function container="Fit.Controls.WSTreeView" name="Render" access="public">
	/// 	<description>
	/// 		Render control, either inline or to element specified.
	/// 		This also results in initial WebService request to load root nodes.
	/// 	</description>
	/// 	<param name="toElement" type="DOMElement" default="undefined"> If defined, control is rendered to this element </param>
	/// </function>
	var baseRender = me.Render;
	this.Render = function(elm)
	{
		if (loadDataOnInit === true)
		{
			var selected = me.Selected(); // Save selection which is cleared when Reload() is called
			me.Reload();
			me.Selected(selected); // Restore selection
		}

		baseRender(elm);
	}

	/// <function container="Fit.Controls.WSTreeView" name="Url" access="public" returns="string">
	/// 	<description>
	/// 		Get/set URL to WebService responsible for providing data to TreeView.
	/// 		WebService must deliver data in the following JSON format:
	/// 		[
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 1", Value: "1001", Selectable: true, Selected: true, Children: [] },
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 2", Value: "1002", Selectable: false, Selected: false, Children: [] }
	/// 		]
	/// 		Only Value is required. Children is a collection of nodes with the same format as described above.
	/// 		HasChildren:boolean may be set to indicate that children are available server side and that WebService
	/// 		should be called to load these children when the given node is expanded.
	/// 		Additionally Expanded:boolean can be set to initially display node as expanded.
	/// 	</description>
	/// 	<param name="wsUrl" type="string"> WebService URL - e.g. http://server/ws/data.asxm/GetNodes </param>
	/// </function>
	this.Url = function(wsUrl)
	{
		Fit.Validation.ExpectString(wsUrl, true);

		if (Fit.Validation.IsSet(wsUrl) === true)
		{
			url = wsUrl;
		}

		return url;
	}

	this.JsonpCallback = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			jsonpCallback = val;
		}

		return jsonpCallback;
	}

	/// <function container="Fit.Controls.WSTreeView" name="SelectAllMode" access="public" returns="Fit.Controls.WSTreeView.SelectAllMode">
	/// 	<description>
	/// 		Get/set flag indicating whether WebService returns the complete hierarchy when
	/// 		Select All is triggered (Instantly), or loads data for each level individually
	/// 		when TreeView automatically expands all nodes (Progressively - chain loading).
	/// 	</description>
	/// 	<param name="val" type="Fit.Controls.WSTreeView.SelectAllMode" default="undefined"> If defined, behaviour is set to specified mode </param>
	/// </function>
	this.SelectAllMode = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === Fit.Controls.WSTreeView.SelectAllMode.Progressively || val === Fit.Controls.WSTreeView.SelectAllMode.Instantly)
				selectAllMode = val;
		}

		return selectAllMode;
	}

	// See documentation on TreeView
	this.RemoveAllChildren = Fit.Core.CreateOverride(this.RemoveAllChildren, function()
	{
		preSelected = {}; // Clear preselections to avoid auto selection of nodes added later
		base();
	});

	// See documentation on TreeView
	this.Selectable = Fit.Core.CreateOverride(this.Selectable, function(val, multi, showSelAll)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(multi, true);
		Fit.Validation.ExpectBoolean(showSelAll, true);

		preSelected = {}; // Clear preselections to ensure same behaviour as TreeView.Selectable(..) which clear selections - avoid auto selection if nodes are loaded later
		return base(val, multi, showSelAll);
	});

	// See documentation on ControlBase
	this.Clear = Fit.Core.CreateOverride(this.Clear, function()
	{
		var fireChange = (me.Selected().length > 0); // Selected() return nodes loaded as well as preselections

		preSelected = {};

		me._internal.ExecuteWithNoOnChange(function() { base(); });

		if (fireChange === true)
			me._internal.FireOnChange();
	});

	/// <function container="Fit.Controls.WSTreeView" name="Reload" access="public">
	/// 	<description>
	/// 		Reload data from WebService. This will clear any selections, which are not
	/// 		restored. Use the approach below to restore selections after reload.
	/// 		var selected = tree.Selected();
	/// 		tree.Reload();
	/// 		tree.Selected(selected);
	/// 	</description>
	/// 	<param name="cb" type="function" default="undefined">
	/// 		If defined, callback function is invoked when root nodes have been loaded
	/// 		and populated - takes Sender (Fit.Controls.WSTreeView) as an argument.
	/// 	</param>
	/// </function>
	this.Reload = function(cb)
	{
		Fit.Validation.ExpectFunction(cb, true);

		me.RemoveAllChildren(true); // True to dispose objects
		preSelected = {};

		getData(null, function(node, eventArgs)
		{
			Fit.Array.ForEach(eventArgs.Children, function(jsonChild)
			{
				me.AddChild(createNodeFromJson(jsonChild));
			});

			if (Fit.Validation.IsSet(cb) === true)
			{
				cb(me); // Fires when nodes are populated (above), but before OnPopulated is fired by getData(..)
			}
		});

		loadDataOnInit = false;
	}

	// See documentation on ControlBase
	this.Value = Fit.Core.CreateOverride(this.Value, function(val)
	{
		Fit.Validation.ExpectString(val, true);

		// Setter

		if (Fit.Validation.IsSet(val) === true)
		{
			orgSelected = [];
			preSelected = {};
			var fireOnChange = (me.Selected().length > 0); // Selected() return nodes already loaded and preselections

			me._internal.ExecuteWithNoOnChange(function()
			{
				// Select nodes already loaded

				base(val);
				var selected = baseSelected(); // Get selection just made as node objects, which can be iterated using ForEach

				if (selected.length > 0)
					fireOnChange = true;

				// Update orgSelected used to determine dirty state

				Fit.Array.ForEach(selected, function(node)
				{
					Fit.Array.Add(orgSelected, node.Value());
				});

				// Add nodes not loaded yet to preselections

				var values = val.split(";");

				Fit.Array.ForEach(values, function(nodeVal)
				{
					var info = nodeVal.split("=");
					var preSel = { Title: null, Value: null };

					if (info.length === 1)
					{
						preSel.Title = "[pre-selection]";
						preSel.Value = decodeReserved(info[0]);
					}
					else
					{
						preSel.Title = decodeReserved(info[0]);
						preSel.Value = decodeReserved(info[1]);
					}

					if (me.GetChild(preSel.Value, true) === null)
					{
						preSelected[preSel.Value] = preSel;
						Fit.Array.Add(orgSelected, preSel.Value);
						fireOnChange = true;
					}
				});
			});

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		// Getter

		var nodes = me.Selected();
		var value = "";

		Fit.Array.ForEach(nodes, function(node)
		{
			value += ((value !== "") ? ";" : "") + encodeReserved(node.Title()) + "=" + encodeReserved(node.Value());
		});

		return value;
	});

	/// <function container="Fit.Controls.WSTreeView" name="Selected" access="public" returns="Fit.Controls.TreeView.Node[]">
	/// 	<description>
	/// 		Fit.Controls.TreeView.Selected override:
	/// 		Get/set selected nodes.
	/// 		Notice for getter: Nodes not loaded yet (preselections) are NOT valid nodes associated with TreeView.
	/// 		Therefore most functions will not work. Preselection nodes can be identified by their title:
	/// 		if (node.Title() === "[pre-selection]") console.log("This is a preselection node");
	/// 		Only the following getter functions can be used for preselection nodes:
	/// 		node.Title(), node.Value(), node.Selected()
	/// 	</description>
	/// 	<param name="val" type="Fit.Controls.TreeView.Node[]" default="undefined"> If defined, provided nodes are selected </param>
	/// </function>
	var baseSelected = me.Selected; // Used by Selected(..), Value(), and SetSelections(..)
	this.Selected = function(val)
	{
		Fit.Validation.ExpectArray(val, true);

		// Setter

		if (Fit.Validation.IsSet(val) === true)
		{
			// Exclude nodes not belonging to TreeView - trying to select them
			// will cause an error to be thrown from TreeView.Selected (base).
			// Nodes excluded is added as preselections instead.

			var toSelect = [];

			Fit.Array.ForEach(val, function(n)
			{
				Fit.Validation.ExpectInstance(n, Fit.Controls.TreeView.Node);

				var node = ((n.GetTreeView() === me) ? n : me.GetChild(n.Value(), true)); // Try GetChild(..) in case node was constructed, but with a value of an existing node

				if (node !== null)
					Fit.Array.Add(toSelect, node);
			});

			// Select nodes

			orgSelected = [];
			preSelected = {};
			var fireOnChange = (me.Selected().length > 0); // Selected() return nodes already loaded and preselections

			// Select nodes already loaded

			var selected = null;
			me._internal.ExecuteWithNoOnChange(function() { selected = baseSelected(toSelect); });

			if (selected.length > 0)
				fireOnChange = true;

			// Update orgSelected used to determine dirty state

			Fit.Array.ForEach(selected, function(node)
			{
				Fit.Array.Add(orgSelected, node.Value());
			});

			// Add nodes not loaded yet to preselections

			Fit.Array.ForEach(val, function(node)
			{
				if (me.GetChild(node.Value(), true) === null)
				{
					preSelected[node.Value()] = {Title: node.Title(), Value: node.Value()};
					Fit.Array.Add(orgSelected, node.Value());
					fireOnChange = true;
				}
			});
		}

		// Getter

		var nodes = baseSelected();

		// Add preselections - they are considered part of value
		Fit.Array.ForEach(preSelected, function(preSelVal)
		{
			var preSel = preSelected[preSelVal];
			Fit.Array.Add(nodes, new Fit.Controls.TreeView.Node(preSel.Title, preSel.Value)); // Invalid nodes! E.g. node.Selected(true) and node.GetTreeView() will not work since node has no association with TreeView
		});

		return nodes;
	}

	// See documentation on ControlBase
	this.IsDirty = Fit.Core.CreateOverride(this.IsDirty, function()
	{
		// Get nodes currently selected

		var valuesSelected = [];

		Fit.Array.ForEach(me.Selected(), function(selected)
		{
			Fit.Array.Add(valuesSelected, selected.Value());
		});

		// Determine dirty state

		if (valuesSelected.length !== orgSelected.length)
			return true;

		var dirty = false;
		Fit.Array.ForEach(orgSelected, function(val)
		{
			if (Fit.Array.Contains(valuesSelected, val) === false)
			{
				dirty = true;
				return false;
			}
		});
		return dirty;
	});

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		me = url = preSelected = orgSelected = loadDataOnInit = onRequestHandlers = onResponseHandlers = onPopulatedHandlers = baseRender = baseSelected = null;

		base();
	});

	// ============================================
	// PickerBase interface
	// ============================================

	/*this.OnShow(function(sender) // Event defined on PickerBase
	{
		if (loadDataOnInit === true)
		{
			me.Reload();
			loadDataOnInit = false;
		}
	});*/

	// See documentation on PickerBase
	this.SetSelections = Fit.Core.CreateOverride(this.SetSelections, function(items)
	{
		Fit.Validation.ExpectArray(items);

		var fireOnChange = (me.Selected().length > 0); // me.Selected() return nodes already loaded and preselections

		// Make sure calls to Value() or Selected() does not return old preselections for events fired

		preSelected = {};

		// Call SetSelections(..) on base class to make sure nodes already loaded is immediately selected.

		me._internal.ExecuteWithNoOnChange(function() { base(items); });

		if (me.Selected().length > 0)
			fireOnChange = true;

		// Set preselections for nodes not loaded yet

		// Add all values to preselections - preselections for nodes already loaded is removed further down
		Fit.Array.ForEach(items, function(item)
		{
			Fit.Validation.ExpectString(item.Title);
			Fit.Validation.ExpectString(item.Value);

			preSelected[item.Value] = {Title: item.Title, Value: item.Value};
		});

		// Remove values from preselections if already loaded
		Fit.Array.ForEach(baseSelected(), function(selected)
		{
			delete preSelected[selected.Value()];
		});

		if (Fit.Core.IsEqual(preSelected, {}) === false)
			fireOnChange = true;

		// Fire OnChange

		if (fireOnChange === true)
			me._internal.FireOnChange();
	});

	// See documentation on PickerBase
	this.UpdateItemSelection = Fit.Core.CreateOverride(this.UpdateItemSelection, function(itemValue, selected)
	{
		Fit.Validation.ExpectString(itemValue);
		Fit.Validation.ExpectBoolean(selected);

		if (me.GetChild(itemValue, true) === null) // Node not loaded yet, update preselections
		{
			// Since the node is not loaded yet, OnSelect, OnItemSelectionChanging,
			// OnSelected, and OnItemSelectionChanged are not fired - they fire once the node is loaded.

			if (selected === true && preSelected[itemValue] === undefined)
			{
				preSelected[itemValue] = {Title: "[pre-selection]", Value: itemValue};
				me._internal.FireOnChange();
			}
			else if (selected === false && preSelected[itemValue] !== undefined)
			{
				delete preSelected[itemValue];
				me._internal.FireOnChange();
			}
		}
		else // Update nodes already loaded
		{
			if (base(itemValue, selected) === false) // Fires OnSelect, OnItemSelectionChanging, OnSelected, OnItemSelectionChanged, and OnChange
				return false;
		}
	});

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.WSTreeView" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is being requested.
	/// 		Request can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSTreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSTreeView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Node: Fit.Controls.TreeView.Node instance
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnRequest = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onRequestHandlers, cb);
	}

	/// <function container="Fit.Controls.WSTreeView" name="OnResponse" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is received,
	/// 		allowing for data transformation to occure before
	/// 		TreeView is populated. Function receives two arguments:
	/// 		Sender (Fit.Controls.WSTreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSTreeView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Node: Fit.Controls.TreeView.Node instance to be populated
	/// 		 - Children: JSON nodes received from WebService
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnResponse = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onResponseHandlers, cb);
	}

	/// <function container="Fit.Controls.WSTreeView" name="OnAbort" access="public">
	/// 	<description>
	/// 		Add event handler fired if data request is canceled.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSTreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSTreeView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Node: Fit.Controls.TreeView.Node instance to be populated
	/// 		 - Children: JSON nodes received from WebService (Null in this particular case)
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnAbort = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onAbortHandlers, cb);
	}

	/// <function container="Fit.Controls.WSTreeView" name="OnPopulated" access="public">
	/// 	<description>
	/// 		Add event handler fired when TreeView has been populated with nodes.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSTreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSTreeView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 		 - Node: Fit.Controls.TreeView.Node instance now populated with children
	/// 		 - Children: JSON nodes received from WebService
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnPopulated = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPopulatedHandlers, cb);
	}

	// ============================================
	// Private
	// ============================================

	function getData(node, cb)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node, true); // Node is null when requesting root nodes
		Fit.Validation.ExpectFunction(cb);

		if (url === null)
			Fit.Validation.ThrowError("Unable to get data, no WebService URL has been specified");

		var request = null;

		if (url.toLowerCase().indexOf(".asmx/") === -1)
		{
			request = new Fit.Http.Request(url);
		}
		else if (jsonpCallback === null)
		{
			request = new Fit.Http.JsonRequest(url)
		}
		else
		{
			request = new Fit.Http.JsonpRequest(url, jsonpCallback);
		}

		//var request = ((url.toLowerCase().indexOf(".asmx/") === -1) ? new Fit.Http.Request(url) : new Fit.Http.JsonRequest(url));

		// Fire OnRequest

		var eventArgs = { Sender: null, Node: null, Request: null, Children: null };
		eventArgs.Sender = me;
		eventArgs.Node = node;
		eventArgs.Request = request;
		eventArgs.SelectAll = (node !== null && node.GetDomElement()._internal.WSSelectAll === true);

		if (fireEventHandlers(onRequestHandlers, eventArgs) === false)
			return false;

		// Set request callbacks

		var onSuccess = function(children)
		{
			// Fire OnResponse

			eventArgs.Children = ((children instanceof Array) ? children : []);
			fireEventHandlers(onResponseHandlers, eventArgs);

			// Fire getData callback

			cb(node, eventArgs); // Callback is responsible for populating TreeView

			// Remove loading indicator

			if (request._loadingIndicator !== undefined) // Loading indicator not set when requesting root nodes
			{
				Fit.Dom.Remove(request._loadingIndicator);
				delete request._loadingIndicator;
			}

			// Select nodes found in preselections

			if (Fit.Core.IsEqual(preSelected, {}) === false) // Prevent nodes from being iterated if no preselections are found
			{
				// Notice: OnChange is not fired! It has already been fired when PreSelections were added.
				// They are also included when e.g. WSTreeView.Value() is called to obtain current selections.
				// However, OnSelect (which fires OnItemSelectionChanging) and OnSelected (which fires OnItemSelectionChanged)
				// fires when node.selected(boolean) is called below.
				me._internal.ExecuteWithNoOnChange(function()
				{
					Fit.Array.Recurse(((node !== null) ? node.GetChildren() : me.GetChildren()), "GetChildren", function(n)
					{
						if (preSelected[n.Value()] !== undefined)
						{
							delete preSelected[n.Value()];
							n.Selected(true);
						}
					});
				});
			}

			// Fire OnPopulated

			fireEventHandlers(onPopulatedHandlers, eventArgs);
		}

		var onFailure = function(httpStatusCode)
		{
			Fit.Validation.ThrowError("Unable to get children for " + ((node !== null) ? "node '" + node.Title() + "'" : "root level") + " - request failed with HTTP Status code " + httpStatusCode)
		}

		var onAbort = function()
		{
			if (request._loadingIndicator !== undefined) // Loading indicator not set when requesting root nodes
			{
				Fit.Dom.Remove(request._loadingIndicator);
				delete request._loadingIndicator;
			}

			if (node !== null) // Null when requesting root nodes
			{
				delete node.GetDomElement()._internal.WSLoading;
			}

			fireEventHandlers(onAbortHandlers, eventArgs);
		};

		if (Fit.Core.InstanceOf(request, Fit.Http.JsonpRequest) === false)
		{
			request.OnSuccess(function(req)
			{
				var children = request.GetResponseJson();
				onSuccess(children);
			});

			request.OnFailure(function(req)
			{
				onFailure(request.GetHttpStatus());
			});

			request.OnAbort(function(req)
			{
				onAbort();
			});
		}
		else
		{
			request.OnSuccess(function(response)
			{
				onSuccess(response);
			});

			request.OnTimeout(function()
			{
				onFailure("UNKNOWN (JSONP)");
			});
		}

		// Display loading indicator

		if (node !== null) // Null when requesting root nodes
		{
			var li = node.GetDomElement();

			request._loadingIndicator = document.createElement("i");
			Fit.Dom.AddClass(request._loadingIndicator, "FitUiControlLoadingIndicator");
			Fit.Dom.Add(li, request._loadingIndicator);
		}

		// Invoke request

		request.Start();

		return true;
	}

	function createNodeFromJson(jsonNode)
	{
		Fit.Validation.ExpectIsSet(jsonNode);

		// Convert JSON to TreeView node, including all contained children

		var child = new Fit.Controls.TreeView.Node((jsonNode.Title ? jsonNode.Title : jsonNode.Value), jsonNode.Value);

		if (jsonNode.Selectable !== undefined)
			child.Selectable((jsonNode.Selectable === true)); // Node will obtain Selectable state from TreeView unless explicitly set here

		if (jsonNode.Selected !== undefined)
			child.Selected((jsonNode.Selected === true)); // Notice, will not cause various events to fire since TreeViewNodeInterface is not assigned at this point

		if (jsonNode.Children instanceof Array)
		{
			Fit.Array.ForEach(jsonNode.Children, function(c)
			{
				child.AddChild(createNodeFromJson(c));
			});
		}

		if (jsonNode.Expanded !== undefined)
			child.Expanded((jsonNode.Expanded === true)); // Notice, will not cause various events to fire since TreeViewNodeInterface is not assigned at this point

		// Set internal flag indicating whether node has children server side

		child.GetDomElement()._internal.WSHasChildren = (jsonNode.HasChildren === true);

		// Add fake child to node if HasChildren indicates that there are more children
		// server side. Adding the fake child ensures that the node can be expanded, which
		// allow us to use OnToggle to load the children at this point.
		// However, the current node may already have some of its children added,
		// so only add the fake child if no children are found.

		if (jsonNode.HasChildren === true && child.GetChildren().length === 0)
		{
			// Make node expandable by attaching a place holder node
			// which is automatically removed when node is expanded.
			var expanderNode = new Fit.Controls.TreeView.Node("__", "__");
			expanderNode.Selectable(false); // Prevent it from being selected when using SelectAll
			child.AddChild(expanderNode);
		}

		// Add supplementary information provided by WebService

		child.Supplementary = {};
		var reserved = new Array("Title", "Value", "Children", "HasChildren", "Selected", "Selectable", "Expanded");

		Fit.Array.ForEach(jsonNode, function(key)
		{
			if (Fit.Array.Contains(reserved, key) === false)
				child.Supplementary[key] = jsonNode[key];
		});

		return child;
	}

	function nodeFullyLoaded(node) // Check whether all children has been loaded
	{
		var internal = node.GetDomElement()._internal;

		if (internal.WSSelectAll === true)
			return true; // This node previously caused SelectAll

		// Check whether node was part of hierarchy loaded using Select All

		var parent = node.GetParent();

		while (parent !== null)
		{
			if (parent.GetDomElement()._internal.WSSelectAll === true)
				return true;

			parent = parent.GetParent();
		}

		// Check whether all children are loaded (usually manually by expanding nodes)

		var fullyLoaded = true;

		Fit.Array.Recurse([node], "GetChildren", function(child)
		{
			var childInternal = child.GetDomElement()._internal;

			if (childInternal.WSHasChildren === true && childInternal.WSDone !== true)
			{
				fullyLoaded = false;
				return false; // Break loop
			}
		});

		return fullyLoaded;
	}

	function fireEventHandlers(handlers, eventArgs)
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (cb(me, eventArgs) === false)
				cancel = true; // Do NOT cancel loop though! All handlers must be fired!
		});

		return !cancel;
	}

	function decodeReserved(str)
	{
		Fit.Validation.ExpectString(str);
		return str.replace(/%3B/g, ";").replace(/%3D/g, "="); // Decode characters reserved for value format
	}

	function encodeReserved(str)
	{
		Fit.Validation.ExpectString(str);
		return str.replace(/;/g, "%3B").replace(/=/g, "%3D"); // Encode characters reserved for value format
	}

	init();
}

/// <container name="Fit.Controls.WSTreeView.SelectAllMode">
/// 	Enum indicating how data is loaded from WebService when using the Select All feature
/// </container>
Fit.Controls.WSTreeView.SelectAllMode =
{
	/// <member container="Fit.Controls.WSTreeView.SelectAllMode" name="Progressively" access="public" static="true" type="string" default="Progressively">
	/// 	<description>
	/// 		Chain load children by progressively expanding them as they are loaded.
	/// 		This may result in several HTTP requests to WebService, and OnChange will
	/// 		fire for every node expanded if children are available server side.
	/// 	</description>
	/// </member>
	Progressively: "Progressively",

	/// <member container="Fit.Controls.WSTreeView.SelectAllMode" name="Instantly" access="public" static="true" type="string" default="Instantly">
	/// 	<description>
	/// 		Load all children at once (WebService is expected to return the complete hierarchy in one single request).
	/// 		This approach will provide better performance as it does not fire OnChange for every child expanded,
	/// 		and only sends one HTTP request to WebService.
	/// 	</description>
	/// </member>
	Instantly: "Instantly"
};
