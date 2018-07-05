;(function() // Terminate script if browser is not capable of running Fit.UI
{
	if (!window.JSON || !window.NodeList) // JSON and NodeList are not available on IE7 and older
	{
		if (navigator.userAgent.indexOf("MSIE") > -1)
			throw new Error("Browser not supported - Internet Explorer 8 or newer is required - make sure Compatibility View is not enabled");
		else
			throw new Error("Browser not supported");
	}

	return true;
})();

;(function() // Prevent Legacy IE from choking if e.g. console.log(..) is called without developer tools open
{
	if (!window.console)
		window.console = {};

	var shims = [ "log", "debug", "info", "error", "warn", "trace" ];

	for (var i = 0 ; i < shims.length ; i++)
	{
		if (!console[shims[i]])
			console[shims[i]] = function() {};
	}
})();


/// <container name="Fit.Core">
/// 	Core features extending the capabilities of native JS
/// </container>
var Fit = {};
Fit.Core = {};

/// <function container="Fit.Core" name="Extend" access="public" static="true" returns="object">
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
///
/// 		Notice that Fit.UI supports multiple inheritance. Be careful not to extend from multiple
/// 		classes implementing functions with identical names, or at least be aware that the last
/// 		class from which the derivative extends, takes precedence.
/// 	</description>
/// 	<param name="subInstance" type="object"> Instance of sub class to extend </param>
/// 	<param name="superType" type="function"> Class (function) to extend from </param>
/// </function>
Fit.Core.Extend = function(subInstance, superType)
{
	Fit.Validation.ExpectIsSet(subInstance);
	Fit.Validation.ExpectFunction(superType);

	// Notice that we support multiple inheritance. For that reason we
	// cannot do something like the code below to support instanceof:
	// Human.prototype = Object.create(Creature.prototype);
	// Human.prototype.constructor = Creature;
	// As an alternative to instanceof, use Fit.Core.InstanceOf(..).

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
			// The arguments variable is actually not an ordinary array
			// (see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments).
			// Browsers implementing ECMAScript prior to version 5 (e.g. IE8) require apply(..) to be
			// called with an ordinary array containing the arguments.
			var args = [];

			for (var i = 0 ; i < arguments.length ; i++)
				args[i] = arguments[i];

			if (args.length > 0)
				result = newFunction.apply(this, args);
			else
				result = newFunction.apply(this);
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
		var identical = true;
		var keys = Fit.Array.Merge(Fit.Array.GetKeys(jsObj1), Fit.Array.GetKeys(jsObj2));

		Fit.Array.ForEach(keys, function(k)
		{
			if (Fit.Core.IsEqual(jsObj1[k], jsObj2[k]) === false)
			{
				identical = false;
				return false;
			}
		});

		return identical;
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
		else if (typeof(org) === "number" && org === Infinity) // Infinity is turned into Null - turn back into Infinity
		{
			return Infinity;
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

Fit._internal =
{
	Core:
	{
		VersionInfo: { Major: 1, Minor: 0, Patch: 34 } // Do NOT modify format - version numbers are programmatically changed when releasing new versions - MUST be on a separate line!
	}
};

Fit._internal.Core.EnsureStyles = function()
{
	if (Fit._internal.Core.StylesEnsured === true)
		return;

	Fit._internal.Core.StylesEnsured = true;

	var elm = Fit.Dom.CreateElement("<div class='FitUiStyleCheck'></div>");
	Fit.Dom.Add(document.body, elm);

	if (Fit.Dom.GetComputedStyle(elm, "width") !== "20px")
	{
		Fit.Browser.Log("Lazy loading Fit.UI stylesheet. It is recommended to add a stylesheet reference to Fit.UI.min.css to prevent temporarily unstyled content.");
		Fit.Loader.LoadStyleSheet(Fit.GetUrl() + "/Fit.UI.min.css");
	}

	Fit.Dom.Remove(elm);
}

;(function()
{
	// Find Base URL - e.g. http://server.com/libs/fitui

	var src = document.scripts[document.scripts.length - 1].src;

	if (!src)
	{
		// Fit.UI was loaded dynamically as a module or bundled with e.g. WebPack.
		src = location.href;
	}

	Fit._internal.BaseUrl = src.substring(0, src.lastIndexOf("/"));

	// Calculate Base Path - e.g. / (unlikely scenario having Fit.UI located at the root though) or /libs/fitui

	var path = Fit._internal.BaseUrl.replace("http://", "").replace("https://", "");
	Fit._internal.BasePath = ((path.indexOf("/") !== -1) ? path.substring(path.indexOf("/")) : "/");
})();

/// <function container="Fit" name="GetVersion" access="public" static="true" returns="object">
/// 	<description>
/// 		Get Fit.UI version object containing the following properties:
///			Major (integer), Minor (integer), Patch (integer), Version (string representing Major.Minor.Patch).
/// 	</description>
/// </function>
Fit.GetVersion = function()
{
	var info = Fit.Core.Clone(Fit._internal.Core.VersionInfo);
	info.Version = info.Major + "." + info.Minor + "." + info.Patch;

	return info;
}

/// <function container="Fit" name="GetUrl" access="public" static="true" returns="string">
/// 	<description> Get fully qualified URL to Fit.UI on server - e.g. http://server.com/libs/fitui </description>
/// </function>
Fit.GetUrl = function()
{
	if (Fit._internal.BaseUrlOverride !== undefined)
		return Fit._internal.BaseUrlOverride;

	return Fit._internal.BaseUrl;
}

/// <function container="Fit" name="GetPath" access="public" static="true" returns="string">
/// 	<description> Get absolute path to Fit.UI on server - e.g. /libs/fitui </description>
/// </function>
Fit.GetPath = function()
{
	if (Fit._internal.BasePathOverride !== undefined)
		return Fit._internal.BasePathOverride;

	return Fit._internal.BasePath;
}

/// <function container="Fit" name="SetPath" access="public" static="true">
/// 	<description>
/// 		Set path to Fit.UI on server - e.g. libs/fitui.
/// 		This may be necessary if Fit.UI is loaded dynamically
/// 		using RequireJS or bundled using e.g. WebPack.
/// 		Changing the path affects the return value of both
/// 		GetUrl() and GetPath(), and from where Fit.UI will
/// 		load resources dynamically.
/// 	</description>
/// 	<param name="basePath" type="string"> Absolute or relative path to folder containing Fit.UI </param>
/// </function>
Fit.SetPath = function(basePath)
{
	Fit.Validation.ExpectStringValue((basePath === null ? "-" : basePath));

	if (basePath === null)
	{
		delete Fit._internal.BasePathOverride;
		delete Fit._internal.BaseUrlOverride;

		return;
	}

	// Remove trailing slash if found
	if (basePath !== "/" && basePath.lastIndexOf("/") === basePath.length - 1)
	{
		basePath = basePath.substring(0, basePath.length - 1);
	}

	var rootUrl = location.protocol + "//" + location.host; // E.g. http://my-domain.com

	// Both GetPath() and GetUrl() return values without trailing slashes.
	// E.g. libs/fitui and http://host/libs/fitui.
	// However, when installed to the root, this is indicated by a slash returned
	// from GetPath() while GetUrl() keeps returning a URL without a trailing slash.
	// E.g. / and http://my-domain.com.

	Fit._internal.BasePathOverride = basePath;

	if (basePath === "/")
	{
		Fit._internal.BaseUrlOverride = rootUrl; //curUrl;
	}
	else if (basePath.indexOf("/") === 0) // Absolute path
	{
		Fit._internal.BaseUrlOverride = rootUrl + basePath;
	}
	else // Relative path
	{
		var curPath = location.pathname.substring(0, location.pathname.lastIndexOf("/")); // E.g. "" (empty for root) or /path/to/folder
		Fit._internal.BaseUrlOverride = rootUrl + curPath + "/" + basePath;
	}
}
