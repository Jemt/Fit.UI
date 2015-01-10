Fit.Validation = {};

Fit.Validation.ExpectNumber = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (typeof(val) !== "number")
		throw new Exception("Value '" + val + "' is not a valid number");
}

Fit.Validation.ExpectInteger = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (typeof(val) !== "number" || val % 1 !== 0)
		throw new Exception("Value '" + val + "' is not a valid integer");
}

Fit.Validation.ExpectString = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (typeof(val) !== "string")
		throw new Exception("Value '" + val + "' is not a valid string");
}

Fit.Validation.ExpectBoolean = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (typeof(val) !== "boolean")
		throw new Exception("Value '" + val + "' is not a valid boolean");
}

Fit.Validation.ExpectDate = function(val, allowNotSet)
{
	if (allowNotSet === true && (val === undefined || val === null))
		return;

	if (val instanceof Date === false)
		throw new Exception("Value '" + val + "' is not an instance of Date");
}
