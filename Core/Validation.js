/// <container name="Fit.Validation">
/// 	Validation logic
/// </container>
Fit.Validation = {};

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
		throw new Error("Value '" + val + "' is not a valid number");
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
		throw new Error("Value '" + val + "' is not a valid integer");
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
		throw new Error("Value '" + val + "' is not a valid string");
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
		throw new Error("Value '" + val + "' is not a valid boolean");
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
		throw new Error("Value '" + val + "' is not an instance of Date");
}
