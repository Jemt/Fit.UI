/// <container name="Fit.Cookies">
/// 	Cookie functionality.
/// 	Set/Get/Remove functions can be invoked as static members, or an instance of Fit.Cookies
/// 	can be created to isolate cookies to either the current path or a custom path.
/// </container>

/// <container name="Fit.CookiesDefs.CookieIdentity">
/// 	<description> Cookie identity </description>
/// 	<member name="Name" type="string"> See Fit.Cookies.Set(..) function's description for its name argument </member>
/// 	<member name="Path" type="string" default="undefined"> See Fit.Cookies.Set(..) function's description for its path argument </member>
/// 	<member name="Domain" type="string" default="undefined"> See Fit.Cookies.Set(..) function's description for its domain argument </member>
/// </container>

/// <container name="Fit.CookiesDefs.Cookie" extends="Fit.CookiesDefs.CookieIdentity">
/// 	<description> New cookie </description>
/// 	<member name="Value" type="string"> See Fit.Cookies.Set(..) function's description for its value argument </member>
/// 	<member name="Seconds" type="integer" default="undefined"> See Fit.Cookies.Set(..) function's description for its seconds argument </member>
/// 	<member name="SameSite" type='"None" | "Lax" | "Strict"' default="undefined"> See Fit.Cookies.Set(..) function's description for its sameSite argument </member>
/// 	<member name="Secure" type="boolean" default="undefined"> See Fit.Cookies.Set(..) function's description for its secure argument </member>
/// </container>

/// <function container="Fit.Cookies" name="Cookies" access="public">
/// 	<description>
/// 		Create instance of cookie container isolated to either current path (default)
/// 		or a custom path, and optionally an alternative part of the domain (by default
/// 		cookies are available only on the current domain, while defining a domain makes
/// 		cookies available to that particular domain and subdomains).
/// 	</description>
/// </function>
Fit.Cookies = function()
{
	var me = this;
	var path = location.pathname.match(/^.*\//)[0]; // Examples: / OR /sub/ OR /sub/sub/sub/
	var domain = null;
	var sameSite = null;
	var secure = false;
	var prefix = null;

	function init()
	{
		// Remove trailing slash for path determined automatically,
		// to prevent double slashes when doing this: cookieContainer.Path() + "/sub"
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

	/// <function container="Fit.Cookies" name="Domain" access="public" returns="string | null">
	/// 	<description> Get/set portion of domain to which cookies are isolated </description>
	/// 	<param name="val" type="string | null" default="undefined">
	/// 		If defined, changes isolation to specified domain portion, including subdomains - pass
	/// 		Null to unset it to make cookies available to current domain only (excluding subdomains).
	/// 	</param>
	/// </function>
	this.Domain = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (val !== undefined)
		{
			domain = val;
		}

		return domain;
	}

	/// <function container="Fit.Cookies" name="SameSite" access="public" returns="string | null">
	/// 	<description> Get/set SameSite policy </description>
	/// 	<param name="val" type='"None" | "Lax" | "Strict" | null' default="undefined">
	/// 		If defined, changes SameSite policy - pass Null to unset it
	/// 	</param>
	/// </function>
	this.SameSite = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (val === "None" || val === "Lax" || val === "Strict" || val === null)
		{
			sameSite = val;
		}

		return sameSite;
	}

	/// <function container="Fit.Cookies" name="Secure" access="public" returns="boolean">
	/// 	<description> Get/set Secure flag </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, changes Secure flag </param>
	/// </function>
	this.Secure = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			secure = val;
		}

		return secure;
	}

	/// <function container="Fit.Cookies" name="Prefix" access="public" returns="string | null">
	/// 	<description>
	/// 		Get/set prefix added to all cookies - useful for grouping related cookies and to avoid naming conflicts.
	/// 		Notice that Set/Get/Remove functions automatically apply the prefix to cookie names, so the use of a prefix
	/// 		is completely transparent.
	/// 	</description>
	/// 	<param name="val" type="string" default="undefined"> If defined, changes cookie prefix to specified value - pass Null to unset it </param>
	/// </function>
	this.Prefix = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (val !== undefined)
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
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectInteger(seconds, true);

		Fit.Cookies.Set((prefix || "") + name, value, seconds, path || undefined, domain || undefined, sameSite || undefined, secure || undefined);
	}

	/// <function container="Fit.Cookies" name="Get" access="public" returns="string | null">
	/// 	<description> Returns cookie value if found, otherwise Null </description>
	/// 	<param name="name" type="string"> Unique cookie name </param>
	/// </function>
	this.Get = function(name)
	{
		Fit.Validation.ExpectStringValue(name);
		return Fit.Cookies.Get((prefix || "") + name);
	}

	/// <function container="Fit.Cookies" name="Remove" access="public">
	/// 	<description> Remove cookie </description>
	/// 	<param name="name" type="string"> Unique cookie name </param>
	/// </function>
	this.Remove = function(name)
	{
		Fit.Validation.ExpectStringValue(name);
		Fit.Cookies.Set((prefix || "") + name, "", -1, path || undefined, domain || undefined);
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
/// 		Specifying a path makes the cookie accessible to that particular path only.
/// 		However, this is not a security feature! A page can read cookies from any path
/// 		by creating an iframe with the path of the cookies, and read them through
/// 		the iframe's contentDocument.cookie property.
/// 	</param>
/// 	<param name="domain" type="string" default="undefined">
/// 		Optional cookie domain.
/// 		Not specifying a domain restricts the cookie to the host portion of the page currently loaded.
/// 		Specifying a domain makes the cookies accessible to the domain and subdomains.
/// 		It is not possible to specify a foreign domain name - this will be silently ignored.
/// 		Example: domain.com or sub.domain.com
/// 	</param>
/// 	<param name="sameSite" type='"None" | "Lax" | "Strict"' default="undefined">
/// 		Optional Same-Site policy determining whether to accept cookie and send it along with HTTP requests.
/// 		Different browsers (and versions) default to different values/behaviour, and a lot of different versions
/// 		are known to incorrectly handle SameSite, so don't expect this to work reliably across browsers.
/// 		Some browers may even work differently across platforms, despite being the same version, such as Safari on macOS and iOS.
/// 		Furthermore the behaviour may vary depending on browser configuration (configuration flags).
/// 		See https://www.chromium.org/updates/same-site/incompatible-clients
/// 		and https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#browser_compatibility
/// 		and https://caniuse.com/same-site-cookie-attribute
/// 		None = Cookie is included with cross-site requests, but only when Secure is True.
/// 		Lax = Cookie is included with all types of Same-Site requests, but only for top-level
/// 		navigation for cross-site requests (GET/HEAD requests only, and only in main window/frame).
/// 		Strict = Cookie is included with all types of Same-Site requests, never for cross-site requests.
/// 		More recent versions of Chrome (and Chrome based browsers) default to Lax.
/// 	</param>
/// 	<param name="secure" type="boolean" default="undefined">
/// 		Optional flag determining whether to accept and send along cookie on secure connections only.
/// 	</param>
/// </function>
/// <function container="Fit.Cookies" name="Set" access="public" static="true">
/// 	<description> Create or update cookie </description>
/// 	<param name="newCookie" type="Fit.CookiesDefs.Cookie"> New or updated cookie </param>
/// </function>
Fit.Cookies.Set = function()
{
	// Support for SameSite is an absolute mess with lots of bugs and varying browser/platform support
	// https://www.chromium.org/updates/same-site/incompatible-clients
	// https://bugs.webkit.org/show_bug.cgi?id=198181
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
	// More recent versions of Chrome (and Chrome based browsers) default to Lax,
	// while SameSite=None with Secure=true theoretically provides the best cross browser compatibility,
	// as it makes cookies behave as they did before the introduction of SameSite (on HTTPS) - had it not
	// been for the massive amount of bugs in various browsers, which unfortunately prevents
	// us from defaulting to this configuration.

	var name = undefined;
	var value = undefined;
	var seconds = undefined;
	var path = undefined;
	var domain = undefined;
	var sameSite = undefined;
	var secure = undefined;

	if (arguments.length === 1)
	{
		Fit.Validation.ExpectObject(arguments[0]);

		name = arguments[0].Name;
		value = arguments[0].Value;
		seconds = arguments[0].Seconds;
		path = arguments[0].Path;
		domain = arguments[0].Domain;
		sameSite = arguments[0].SameSite;
		secure = arguments[0].Secure;
	}
	else
	{
		name = arguments[0];
		value = arguments[1];
		seconds = arguments[2];
		path = arguments[3];
		domain = arguments[4];
		sameSite = arguments[5];
		secure = arguments[6];
	}

	Fit.Validation.ExpectStringValue(name);
	Fit.Validation.ExpectString(value);
	Fit.Validation.ExpectInteger(seconds, true);
	Fit.Validation.ExpectStringValue(path, true);
	Fit.Validation.ExpectStringValue(domain, true);
	Fit.Validation.ExpectStringValue(sameSite, true);
	Fit.Validation.ExpectBoolean(secure, true);

	if (value.indexOf(';') > -1)
		Fit.Validation.ThrowError("Unable to set cookie - value contains illegal character: ';'");

	value = value.replace(/\n/g, "\\n"); // Preserve line breaks which would otherwise break cookie value

	var newCookie = name + "=" + value;

	if (Fit.Validation.IsSet(seconds) === true)
	{
		var date = new Date();
		date.setTime(date.getTime() + (seconds * 1000));

		newCookie += "; expires=" + date.toGMTString();
	}

	if (Fit.Validation.IsSet(path) === true)
	{
		newCookie += "; path=" + path + ((path[path.length-1] !== "/") ? "/" : "");
	}

	if (Fit.Validation.IsSet(domain) === true)
	{
		newCookie += "; domain=" + domain;
	}

	if (sameSite === "None" || sameSite === "Lax" || sameSite === "Strict")
	{
		newCookie += "; samesite=" + sameSite.toLowerCase();
	}

	if (secure === true)
	{
		newCookie += "; secure";
	}

	document.cookie = newCookie;

	//document.cookie = name + "=" + value + ((date !== null) ? "; expires=" + date.toGMTString() : "") + "; path=" + ((Fit.Validation.IsSet(path) === true) ? path + ((path[path.length-1] !== "/") ? "/" : "") : "/");
}

/// <function container="Fit.Cookies" name="Get" access="public" static="true" returns="string | null">
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
/// 	<param name="domain" type="string" default="undefined">
/// 		Optional cookie domain.
/// 		If cookie was defined on a specific domain, the
/// 		same domain must be specified to remove the cookie.
/// 	</param>
/// </function>
/// <function container="Fit.Cookies" name="Remove" access="public" static="true">
/// 	<description> Remove cookie </description>
/// 	<param name="cookie" type="Fit.CookiesDefs.CookieIdentity"> Cookie to remove </param>
/// </function>
Fit.Cookies.Remove = function()
{
	var name = undefined;
	var path = undefined;
	var domain = undefined;

	if (arguments.length === 1)
	{
		Fit.Validation.ExpectObject(arguments[0]);

		name = arguments[0].Name;
		path = arguments[0].Path;
		domain = arguments[0].Domain;
	}
	else
	{
		name = arguments[0];
		path = arguments[1];
		domain = arguments[2];
	}

	Fit.Validation.ExpectStringValue(name);
	Fit.Validation.ExpectStringValue(path, true);
	Fit.Validation.ExpectStringValue(domain, true);

	Fit.Cookies.Set(name, "", -1, path, domain);
}
