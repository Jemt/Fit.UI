/// <container name="Fit.Validation">
/// 	Validation logic
/// </container>
Fit.Validation = {};

Fit._internal.Validation = {};
Fit._internal.Validation.DebugMode = true; // TODO: When ready for production: Remove or set False!
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

	if (typeof(val) !== "number")
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

/// <function container="Fit.Validation" name="ExpectCollection" access="public" static="true">
/// 	<description> Throws error if passed object is not a collection that can be iterated </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectCollection = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof NodeList) === false && (window.StaticNodeList && (val instanceof StaticNodeList) === false) && (val instanceof HTMLCollection) === false && (val instanceof Array) === false)
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
		alert("ThrowError: " + msg);

	if (window.console && console.trace)
		console.trace();

	throw new Error(msg); // Never change this behaviour - we should always re-throw the error to terminate execution
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

if (Fit._internal.Validation.DebugMode !== true)
	Fit.Validation.Enabled(false);
