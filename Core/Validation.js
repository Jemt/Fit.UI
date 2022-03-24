/// <container name="Fit.Validation">
/// 	Validation logic
/// </container>
Fit.Validation = {};

Fit._internal.Validation = {};
Fit._internal.Validation.DebugMode = true;
Fit._internal.Validation.Clone = null;

// Ensure object types not found in all browsers
(function()
{
	// window.event is of type MSEventObj in IE9 and above.
	// Type used by Fit.Validation.ExpectEvent.
	if (!window.MSEventObj)
		window.MSEventObj = function() {};

	// StaticNodeList type is produced by document.querySelectorAll(..) in Legacy IE.
	// FileList type is not defined in Legacy IE.
	// These types are used by Fit._internal.Validation.IsCollectionType.
	if (!window.StaticNodeList)
		window.StaticNodeList = function() {};
	if (!window.FileList)
		window.FileList = function() {};

	// File type not defined in Legacy IE.
	// Make sure we can use Fit.Validation.ExpectInstance(selectedFileFromInput, File, true)
	if (!window.File)
		window.File = function() {};

	// Some versions of Firefox temporarily removed NamedNodeMap.
	// They renamed it to MozNamedAttrMap, but it was later restored.
	// https://bugzilla.mozilla.org/show_bug.cgi?id=858344
	if (!window.NamedNodeMap)
		window.NamedNodeMap = function() {};
})();

// ==========================================================
// Type checking
// ==========================================================

/// <function container="Fit.Validation" name="ExpectObject" access="public" static="true">
/// 	<description> Throws error if passed object is not a valid object such as { Name: 'Jimmy', Age: 34 } </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectObject = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (!val || val.constructor !== Object)
		Fit.Validation.ThrowError("Value '" + val + "' is not a valid object");
}

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
/// 		Fit.Validation.ExpectInstanceArray(arr, Fit.Controls.TreeViewNode)
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

/// <function container="Fit.Validation" name="ExpectDictionary" access="public" static="true">
/// 	<description>
/// 		Throws error if passed object is not a dictionary (associative array / object array),
/// 		contaning only objects/values of type given by validation callback.
/// 		Example: Fit.Validation.ExpectDictionary(dict, Fit.Validation.ExpectString)
/// 	</description>
/// 	<param name="val" type="object"> Dictionary to validate </param>
/// 	<param name="typeValCallback" type="function"> Value validation callback </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectDictionary = function(val, typeValCallback, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	Fit.Validation.ExpectObject(val);
	Fit.Validation.ExpectFunction(typeValCallback);

	Fit.Array.ForEach(val, function(key)
	{
		Fit.Validation.ExpectStringValue(key);
		typeValCallback(val[key]);
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

	if (Fit._internal.Validation.IsCollectionType(val) === false)
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

/// <function container="Fit.Validation" name="ExpectElement" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of HTMLElement </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectElement = function(val, allowNotSet) // DOMElement (actually HTMLElement)
{
	// All elements within the HTML DOM tree inherits from Element except for Comments, CDATA, and Text nodes.
	// But most elements from an XML document (also excluding Comments, CDATA, and Text nodes) also
	// inherit from Element.
	// (new DOMParser()).parseFromString("<root></root>", "text/xml").getElementsByTagName("root")[0] instanceof Element; // Returns true
	// However, Fit.UI is for building HTML applications, and is therefore not expected to handle XML elements.
	// Therefore, despite the function name ExpectElement, it actually ensures that the passed element is an instance of HTMLElement.
	// (new DOMParser()).parseFromString("<root></root>", "text/xml").getElementsByTagName("root")[0] instanceof HTMLElement; // Returns false

	// More about HTMLElement vs Element vs Node, as well as the nodeType property:
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
	// https://developer.mozilla.org/en-US/docs/Web/API/Element
	// https://developer.mozilla.org/en-US/docs/Web/API/Node
	// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
	// The inheritance chain looks like this: EventTarget <= Node <= Element <= HTMLElement

	if (allowNotSet === true && (val === undefined || val === null))
		return;

	// The HTMLElement interface is not available in legacy IE, in which case we use feature detection instead
	if ((window.HTMLElement && (val instanceof HTMLElement) === false) || (val instanceof Element) === false || (val.style instanceof CSSStyleDeclaration) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an HTMLElement");
}
Fit.Validation.ExpectDomElement = Fit.Validation.ExpectElement;		// Backward compatibility
Fit.Validation.ExpectElementNode = Fit.Validation.ExpectElement;	// Backward compatibility

// DISABLED - not in use internally, and not supported by legacy IE
// <function container="Fit.Validation" name="ExpectTextNode" access="public" static="true">
// 	<description> Throws error if passed object is not an instance of Text </description>
// 	<param name="val" type="object"> Object to validate </param>
// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
// </function>
/*Fit.Validation.ExpectTextNode = function(val, allowNotSet) // DOMText
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof Text) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not a Text node");
}*/

// DISABLED - not in use internally, and not supported by legacy IE
// <function container="Fit.Validation" name="ExpectCommentNode" access="public" static="true">
// 	<description> Throws error if passed object is not an instance of Comment </description>
// 	<param name="val" type="object"> Object to validate </param>
// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
// </function>
/*Fit.Validation.ExpectCommentNode = function(val, allowNotSet) // DOMComment
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof Comment) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not a Comment node");
}*/

/// <function container="Fit.Validation" name="ExpectNode" access="public" static="true">
/// 	<description> Throws error if passed object is not an instance of Element, Text, or Comment </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
/// </function>
Fit.Validation.ExpectNode = function(val, allowNotSet) // DOMNode
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	// The Text and Comment interfaces are not available in legacy IE so we use feature detection instead.
	// We assume we have a valid Node instance if it exposes common functions and properties of a Node instance,
	// and has the appropriate nodeType: 1 = Element, 3 = Text, 8 = Comment. More on node types here:
	// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
	if (!val.cloneNode || !val.nodeName || !val.nodeType || (val.nodeType !== 1 && val.nodeType !== 3 && val.nodeType !== 8))
		Fit.Validation.ThrowError("Value '" + val + "' is not a Node (Element, Text, or Comment)");
}

// <function container="Fit.Validation" name="ExpectTextNode" access="public" static="true">
// 	<description> Throws error if passed object is not an instance of Text </description>
// 	<param name="val" type="object"> Object to validate </param>
// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
// </function>
Fit.Validation.ExpectTextNode = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	// The Text interface is not available in legacy IE so we use feature detection instead.
	// We assume we have a valid Node instance if it exposes common functions and properties of a Node instance,
	// and has the appropriate nodeType: 1 = Element, 3 = Text, 8 = Comment. More on node types here:
	// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
	if (!val.cloneNode || !val.nodeName || val.nodeType !== 3)
		Fit.Validation.ThrowError("Value '" + val + "' is not a Text node");
}

// <function container="Fit.Validation" name="ExpectContentNode" access="public" static="true">
// 	<description> Throws error if passed object is not an instance of Element or Text </description>
// 	<param name="val" type="object"> Object to validate </param>
// 	<param name="allowNotSet" type="boolean" default="false"> Set True to allow object to be Null or Undefined </param>
// </function>
/*Fit.Validation.ExpectContentNode = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((val instanceof Element) === false && (val instanceof Text) === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not a Content Node (Element or Text)");
}*/

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

/// <function container="Fit.Validation" name="IsSet" access="public" static="true" returns="boolean">
/// 	<description> Returns True if specified object is set (not Null or Undefined), otherwise False </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// </function>
Fit.Validation.IsSet = function(obj)
{
	return (obj !== null && obj !== undefined);
}

/// <function container="Fit.Validation" name="ThrowError" access="public" static="true">
/// 	<description> Throw error and provide stack trace to browser console </description>
/// 	<param name="msg" type="string"> Error message </param>
/// </function>
Fit.Validation.ThrowError = function(msg)
{
	if (Fit._internal.Validation.DebugMode === true)
	{
		/*var stackTrace = Fit.Validation.GetStackTrace();
		alert("ThrowError: " + msg + ((stackTrace !== "") ? "\n\n" : "") + stackTrace);

		if (window.console && console.trace)
			console.trace();*/

		if (window.console && console.log) console.log("ThrowError: " + msg);
		if (window.console && console.trace) console.trace(); // Not all browsers produce a stack trace when an error is thrown (below)
	}

	throw new Error(msg); // Never change this behaviour - we should always re-throw the error to terminate execution
}

Fit.Validation.GetStackTrace = function() // NOTICE: captureStackTrace is a feature of V8/Chromium!
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

// ==========================================================
// Internal
// ==========================================================

Fit._internal.Validation.IsCollectionType = function(val) // Used by Fit.Validation and Fit.Array
{
	if (val === null || val === undefined)
		return false;
	else if (val instanceof Array)
		return true;
	else if (val instanceof NodeList)
		return true;
	else if (val instanceof StaticNodeList)
		return true;
	else if (val instanceof HTMLCollection)
		return true;
	else if (val instanceof NamedNodeMap)
		return true;
	else if (val instanceof FileList)
		return true;
	else if (val instanceof StyleSheetList)
		return true;
	else if (val instanceof CSSRuleList)
		return true;
	else if (val.callee && val.length !== null && val.length !== undefined) // Arguments array - https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
		return true;

	return false;

	/*if (val === null || val === undefined)
		return false;
	if ((val instanceof NodeList) === false && (val instanceof StaticNodeList) === false && (val instanceof FileList) === false && (val instanceof HTMLCollection) === false && (val instanceof Array) === false && (!val.callee && (val.length === undefined || val.length === null)))
		return false;
	return true;*/
}
