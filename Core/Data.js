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
	return str.replace(/^\s+|\s+$/gm, "");
}

/// <function container="Fit.String" name="StripHtml" access="public" static="true" returns="string">
/// 	<description> Removes any HTML contained in string, and returns the raw text value </description>
/// 	<param name="str" type="string"> String to strip HTML from </param>
/// </function>
Fit.String.StripHtml = function(str)
{
	Fit.Validation.ExpectString(str);

	// return str.replace(/(<([^>]+)>)/g, "");

	var span = document.createElement("span");
	span.innerHTML = str;
	return Fit.String.Trim(Fit.Dom.Text(span));
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
