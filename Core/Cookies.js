/// <container name="Fit.Cookies">
/// 	Cookie functionality
/// </container>
Fit.Cookies = {};

/// <function container="Fit.Cookies" name="Set" access="public" static="true" returns="boolean">
/// 	<description> Create or update cookie - returns True on success, otherwise False </description>
/// 	<param name="name" type="string"> Unique cookie name </param>
/// 	<param name="value" type="string"> Cookie value (cannot contain semicolon!) </param>
/// 	<param name="seconds" type="integer" default="undefined">
/// 		Optional expiration time in seconds. Creating a cookie with
/// 		no expiration time will cause it to expire when session ends.
/// 	</param>
/// </function>
Fit.Cookies.Set = function(name, value, seconds)
{
	Fit.Validation.ExpectStringValue(name);
	Fit.Validation.ExpectString(name);
	Fit.Validation.ExpectInteger(seconds, true);

	if (value.indexOf(';') > -1)
	{
		throw new Error("Unable to set cookie - value contains illegal character: ';'");
		return false;
	}

	var date = null;

	if (Fit.Validation.IsSet(seconds) === true)
	{
		date = new Date();
		date.setTime(date.getTime() + (seconds * 1000));
	}

	document.cookie = name + "=" + value + ((date !== null) ? "; expires=" + date.toGMTString() : "") + "; path=/";

	return true;
}

/// <function container="Fit.Cookies" name="Get" access="public" static="true" returns="string">
/// 	<description> Returns cookie value if found, otherwise Null </description>
/// 	<param name="name" type="string"> Unique cookie name </param>
/// </function>
Fit.Cookies.Get = function(name)
{
	Fit.Validation.ExpectStringValue(name);

	var name = name + "=";
	var cookies = document.cookie.split(";");
	var cookie = null;

	for (i = 0 ; i < cookies.length ; i++)
	{
		cookie = cookies[i];

		while (cookie.charAt(0) === " ")
			cookie = cookie.substring(1, cookie.length);

		if (cookie.indexOf(name) === 0)
			return cookie.substring(name.length, cookie.length);
	}

	return null;
}

/// <function container="Fit.Cookies" name="Remove" access="public" static="true" returns="boolean">
/// 	<description> Remove cookie - returns True on success, otherwise False </description>
/// 	<param name="name" type="string"> Unique cookie name </param>
/// </function>
Fit.Cookies.Remove = function(name)
{
	Fit.Validation.ExpectStringValue(name);
	return this.Set(name, "", -1);
}
