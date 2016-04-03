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
	var path = location.pathname.match(/^.*\//)[0];
	var prefix = "";

	function init()
	{
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

	for (i = 0 ; i < cookies.length ; i++)
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
