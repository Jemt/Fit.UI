// Performance:
// Once active development is over, consider disabling type checking
// for improved performance. This is mainly used during development
// to catch wrong data types being passed around.

/// <container name="Fit.Validation">
/// 	Validation logic
/// </container>
Fit.Validation = {};

// ==========================================================
// Expect
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
/// 	<description> Same as Fit.Validation.ExpectString(..), but string must contain an actual value (not be empty) </description>
/// 	<param name="val" type="object"> Object to validate </param>
/// </function>
Fit.Validation.ExpectStringValue = function(val)
{
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

	if (val instanceof Date === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of Date");
}

Fit.Validation.ExpectRegExp = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (val instanceof RegExp === false)
		Fit.Validation.ThrowError("Value '" + val + "' is not an instance of RegExp");
}

Fit.Validation.ExpectDomElement = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (!val.tagName || !val.appendChild || val.nodeType !== 1) // 1 = Element, 2 = Attribute, 3 = TextNode, Comment = 8
		Fit.Validation.ThrowError("Value '" + val + "' is not a DOMElement");
}

Fit.Validation.ExpectInstance = function(obj, instanceType, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if ((obj instanceof instanceType) === false)
		Fit.Validation.ThrowError("Unsupported object type passed");
}

// ==========================================================
// Misc.
// ==========================================================

Fit.Validation.IsSet = function(obj)
{
	return (obj !== null && obj !== undefined);
}

Fit.Validation.ThrowError = function(msg)
{
	//alert(msg); // Enable this during testing to make sure type related bugs are found
	throw new Error(msg);
}
