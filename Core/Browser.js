/// <container name="Fit.Browser">
/// 	Provides access to various browser information.
///
/// 	// Example code
///
/// 	var browserName = Fit.Browser.GetBrowser();
/// 	var browserVersion = Fit.Browser.GetVersion();
/// 	var browserLanguage = Fit.Browser.GetLanguage();
///
/// 	if (browserName === &quot;MSIE&quot; &amp;&amp; browserVersion &lt; 7)
/// 	{
/// 		&#160;&#160;&#160;&#160; if (browserLanguage === &quot;da&quot;)
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; alert(&quot;Opgrader venligst til IE7 eller nyere&quot;);
/// 		&#160;&#160;&#160;&#160; else
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; alert(&quot;Please upgrade to IE7 or newer&quot;);
/// 	}
/// </container>
Fit.Browser = {};
Fit._internal.Browser = {};

/// <function container="Fit.Browser" name="GetBrowser" access="public" static="true" returns='"Edge" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "Unknown"'>
/// 	<description>
/// 		Returns name of browser. Possible values are: Chrome (which also covers modern versions of Opera and Edge),
/// 		Safari, Edge (version 12-18), MSIE (version 8-11), Firefox, Opera (version 1-12), Unknown.
/// 	</description>
/// 	<param name="returnAppId" type="false" default="false"> Set True to have app specific identifier returned </param>
/// </function>
/// <function container="Fit.Browser" name="GetBrowser" access="public" static="true" returns='"Edge" | "EdgeChromium" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "OperaChromium" | "Unknown"'>
/// 	<description>
/// 		Returns browser app identifer. Possible values are: Chrome, Safari, Edge (version 12-18), EdgeChromium (version 85+),
/// 		MSIE (version 8-11), Firefox, Opera (version 1-12), OperaChromium (version 15+), Unknown
/// 	</description>
/// 	<param name="returnAppId" type="true"> Set True to have app specific identifier returned </param>
/// </function>
Fit.Browser.GetBrowser = function(returnAppId)
{
	Fit.Validation.ExpectBoolean(returnAppId, true);

	var agent = navigator.userAgent;

	// IMPORTANT: The order in which browsers are detected matters! For instance, several browsers define both Chrome and Safari as part of their user agent string. Examples:
	// Firefox 46	"Mozilla/5.0 (Windows NT 5.2; rv:46.0) Gecko/20100101 Firefox/46.0"
	// Firefox 81	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:81.0) Gecko/20100101 Firefox/81.0"
	// Chrome 85	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
	// Safari 13	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15"
	// Opera 12		"Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16.2"
	// Opera 71		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 OPR/71.0.3770.228"
	// IE 8			"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.2; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)"
	// IE 11		"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko"
	// Edge 18		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363"
	// Edge 85		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.41"

	if (agent.indexOf("Edge/") > -1)
		return "Edge";
	if (returnAppId === true && agent.indexOf("Edg/") > -1)
		return "EdgeChromium";
	if (agent.indexOf("MSIE") > -1 || agent.indexOf("Trident") > -1)
		return "MSIE";
	if (agent.indexOf("Firefox") > -1)
		return "Firefox";
	if (agent.indexOf("Opera") > -1)
		return "Opera";
	if (returnAppId === true && agent.indexOf("OPR/") > -1)
		return "OperaChromium";
	if (agent.indexOf("Chrome") > -1)
		return "Chrome";
	if (agent.indexOf("Safari") > -1)
		return "Safari";

	return "Unknown";
}

/// <function container="Fit.Browser" name="GetVersion" access="public" static="true" returns="integer">
/// 	<description> Returns major version number for known browsers, -1 for unknown browsers </description>
/// 	<param name="returnAppVersion" type="boolean" default="false">
/// 		Set True to have app specific version number returned, rather than version number of browser engine.
/// 		If version number is used in combination with the result from Fit.Browser.GetBrowser(true), then
/// 		this argument should be True as well, otherwise False (default).
/// 	</param>
/// </function>
Fit.Browser.GetVersion = function(returnAppVersion)
{
	Fit.Validation.ExpectBoolean(returnAppVersion, true);

	// Firefox 46	"Mozilla/5.0 (Windows NT 5.2; rv:46.0) Gecko/20100101 Firefox/46.0"
	// Firefox 81	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:81.0) Gecko/20100101 Firefox/81.0"
	// Chrome 85	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
	// Safari 13	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15"
	// Opera 12		"Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16.2"
	// Opera 71		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 OPR/71.0.3770.228"
	// IE 8			"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.2; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)"
	// IE 11		"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko"
	// Edge 18		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363"
	// Edge 85		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.41"

	var browser = Fit.Browser.GetBrowser(returnAppVersion);

	var start = 0;
	var end = 0;
	var agent = navigator.userAgent;

	if (browser === "Edge")
	{
		start = agent.indexOf("Edge/");
		start = (start !== -1 ? start + 5 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (browser === "EdgeChromium")
	{
		start = agent.indexOf("Edg/");
		start = (start !== -1 ? start + 4 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (browser === "Chrome")
	{
		start = agent.indexOf("Chrome/");
		start = (start !== -1 ? start + 7 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (browser === "Safari")
	{
		start = agent.indexOf("Version/");
		start = (start !== -1 ? start + 8 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (browser === "MSIE")
	{
		if (agent.indexOf("MSIE") > -1)
		{
			start = agent.indexOf("MSIE ");
			start = (start !== -1 ? start + 5 : 0);
			end = agent.indexOf(".", start);
			end = (end !== -1 ? end : 0);
		}
		else if (agent.indexOf("Trident") > -1) // IE11+
		{
			start = agent.indexOf("rv:");
			start = (start !== -1 ? start + 3 : 0);
			end = agent.indexOf(".", start);
			end = (end !== -1 ? end : 0);
		}
	}
	if (browser === "Firefox")
	{
		start = agent.indexOf("Firefox/");
		start = (start !== -1 ? start + 8 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (browser === "Opera")
	{
		start = agent.indexOf("Version/");
		start = (start !== -1 ? start + 8 : -1);

		if (start === -1)
		{
			start = agent.indexOf("Opera/");
			start = (start !== -1 ? start + 6 : -1);
		}

		if (start === -1)
		{
			start = agent.indexOf("Opera ");
			start = (start !== -1 ? start + 6 : -1);
		}

		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (browser === "OperaChromium")
	{
		start = agent.indexOf("OPR/");
		start = (start !== -1 ? start + 4 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}

	if (start !== 0 && start !== 0)
		return parseInt(agent.substring(start, end));

	return -1;
}

/// <container name="Fit.BrowserTypeDefs.QueryString">
/// 	<description> Object representing query string </description>
/// 	<member name="Url" type="string"> Full URL address </member>
/// 	<member name="Parameters" type="{[key:string]: string | undefined}">
/// 		Associative array with key value pairs representing URL parameters
/// 	</member>
/// 	<member name="Hash" type="string | null"> URL hash value if specified, otherwise Null </member>
/// </container>

/// <function container="Fit.Browser" name="GetQueryString" access="public" static="true" returns="Fit.BrowserTypeDefs.QueryString">
/// 	<description> Returns query string information </description>
/// 	<param name="alternativeUrl" type="string" default="undefined"> Alternative URL to parse </param>
/// </function>
Fit.Browser.GetQueryString = function(alternativeUrl)
{
	Fit.Validation.ExpectString(alternativeUrl, true);

	var qs = { Url: null, Parameters: {}, Hash: null, Anchor: null }; // Anchor is there for backwards compatibility

	var url = ((alternativeUrl !== undefined) ? alternativeUrl : location.href);
	var params = ((url.indexOf("?") > -1) ? url.split("?")[1] : "");
	var hash = null;

	params = ((params.indexOf("#") > -1) ? params.split("#")[0] : params);
	hash = ((url.indexOf("#") > -1) ? url.split("#")[1] : null);

	qs.Url = url;
	qs.Hash = hash;
	qs.Anchor = hash; // Backwards compatibility

	Fit.Array.ForEach(((params !== "") ? params.split("&") : []), function(p)
	{
		var keyval = p.split("=");

		try
		{
			// Notice: decodeURIComponent(..) throws an error in case invalid encoding is used
			qs.Parameters[decodeURIComponent(keyval[0])] = ((keyval.length > 1) ? decodeURIComponent(keyval[1]) : "");
		}
		catch (err)
		{
			// An error occurred decoding parameter - use raw value instead
			qs.Parameters[keyval[0]] = ((keyval.length > 1) ? keyval[1] : "");
		}
	});

	return qs;
}

/// <container name="Fit.BrowserTypeDefs.ParsedUrl">
/// 	<description> Object representing components of a URL </description>
/// 	<member name="Url" type="string"> Full URL address </member>
/// 	<member name="Protocol" type='"ftp" | "http" | "https"'> Full URL address </member>
/// 	<member name="Port" type="integer"> Port number - returns -1 if not defined in URL </member>
/// 	<member name="Auth" type="string"> Authentication token or user:pass if specified, otherwise Null </member>
/// 	<member name="Host" type="string"> Hostname, e.g. localhost or domain name </member>
/// 	<member name="Path" type="string"> Path to folder containing resources, e.g. / or /folder </member>
/// 	<member name="Resource" type="string"> Name of resource, e.g. resource.php </member>
/// 	<member name="FullPath" type="string"> Path and Resource combined, e.g. /folder/resource.php </member>
/// 	<member name="Parameters" type="{[key:string]: string | undefined}">
/// 		Associative array with key value pairs representing URL parameters
/// 	</member>
/// 	<member name="Hash" type="string | null"> URL hash value if specified, otherwise Null </member>
/// </container>

/// <function container="Fit.Browser" name="ParseUrl" access="public" static="true" returns="Fit.BrowserTypeDefs.ParsedUrl">
/// 	<description>
/// 		Parses well-formed URLs and returns an object containing the various components.
/// 	</description>
/// 	<param name="url" type="string"> Well-formed URL to parse </param>
/// </function>
Fit.Browser.ParseUrl = function(url)
{
	Fit.Validation.ExpectString(url);

	// URLs are often concatenated incorrectly with double forward slashes.
	// E.g. http://localhost//path/to//file.php
	// Compensate for this problem to reduce risk of runtime parse errors.
	// https://regex101.com/r/DMQs9A/1/
	var doubleSlashes = /(^.*:\/\/.*?)\/\/(.*)/;
	while (doubleSlashes.test(url) === true)
	{
		url = url.replace(doubleSlashes, "$1/$2");
	}

	// This function is not perfect.
	// It will parse well-formed URLs properly
	// but may be fooled by incorrecly formatted URLs,
	// and does not currently support IPv6 addresses.
	// But for a solution using Regular Expression it
	// is works quite well and is very simple in its
	// implementation.

	// Using JS is possible although known to give slightly
	// different results across different browsers - example:
	//    var a = document.createElement("a");
	//    console.log(a.pathname, a.host, a.port, a.protocol, a.username, a.password); // etc.
	// On top of differences across browsers it also depends on DOM which is not available in Workers,
	// it will automatically canonicalize the URL to the page (relative to domain, protocol, etc.),
	// and some browsers (e.g. Legacy IE) does not parse IPv6 addresses either.
	// See comments here: https://gist.github.com/jlong/2428561
	// Solution must be cross browser and support Legacy IE !

	// It is impossible to produce a perfect solution using a one-liner
	// regular expression. Inventer of WWW, Tim Burners-Lee (TimBL / TBL),
	// among many others, solves parsing programmatically: https://www.w3.org/wiki/UriTesting
	// Such solutions tend to be much more complex though.
	// Another example: https://github.com/unshiftio/url-parse

	/* RegEx fiddle: https://regex101.com/r/poWR2S/14
	0 = Full match
	1 = Protocol (http/https/ftp/etc)
	2 = Group used to exclude @ from auth in #3
	3 = Auth
	5 = Host followed by port in #7
	6 = Group used to exclude / from port in #7
	7 = Port
	8 = Host NOT followed by port
	9 = Host NOT followed by anything (end of string)
	10 = Group used to wrap #11 #12 #13 #14 #15
	11 = Path followed by QS (and possibly #hash) in #12
	12 = QS (and possibly #hash)
	13 = Path followed by #hash in #14
	14 = #hash value
	15 = Path NOT followed by anything (end of string) */
	var regEx = /(.+):\/\/((.+)@)?((.+):((\d+)\/?)?|(.+?)\/|(.+?)$)((.*)\?(.+)|(.*)#(.*)|(.*)$)/;
	var match = regEx.exec(url);
	var result = { Url: null, Protocol: null, Port: null, Auth: null, Host: null, FullPath: null, Path: null, Resource: null, Parameters: {}, Hash: null, Anchor: null }; // Anchor is there for backwards compatibility

	if (match === null)
	{
		Fit.Validation.ThrowError("Unable to parse invalid URL - valid example: schema://[auth@]host[:port][/path/resource[?parm=val[#hash]]]");
	}

	if (match.length !== 16) // RegExp should produce this amount of capture group results!
	{
		Fit.Validation.ThrowError("Unexpected parse error - internal error"); // Happens if RegExp is changed without adjusting code using it
	}

	var fullPath = (match[11] || match[13] || match[15] || ""); //var fullPath = (match[11] || match[13] || (match[15] && match[15] !== "?" ? match[15] : "") || "");
	var qs = Fit.Browser.GetQueryString(url);

	result.Url = url;
	result.Protocol = match[1].toLowerCase();
	result.Auth = match[3] || null;
	result.Host = match[5] || match[8] || match[9];
	result.Port = (match[7] ? parseInt(match[7]) : -1);
	result.FullPath = "/" + fullPath;
	result.Parameters = qs.Parameters;
	result.Hash = qs.Hash;
	result.Anchor = qs.Hash; // Backwards compatibility

	result.Path = "/";

	if (fullPath !== "")
	{
		var pathInfo = fullPath.split("/");

		// Construct path without resource (/path/to/resource.php => /path/to/)
		result.Path += pathInfo.slice(0, -1).join("/") + (pathInfo.length > 0 ? "/" : "");

		// Add resource (e.g. resource.php) if found in URL
		if (pathInfo[pathInfo.length - 1] !== "")
		{
			result.Resource = pathInfo[pathInfo.length - 1];
		}
	}

	return result;
}

/// <function container="Fit.Browser" name="GetLanguage" access="public" static="true" returns="string">
/// 	<description> Returns browser language - e.g. &quot;da&quot; (Danish), &quot;en&quot; (English) etc. </description>
/// </function>
Fit.Browser.GetLanguage = function()
{
	var lang = null;

	if (navigator.language)
		lang = navigator.language.toLowerCase();
	else if (navigator.browserLanguage)
		lang = navigator.browserLanguage.toLowerCase();

	if (lang === null || lang === "")
		return "en";

	if (lang.length === 2)
		return lang;

	if (lang.length === 5)
		return lang.substring(0, 2);

	return "en";
}

/// <function container="Fit.Browser" name="GetPageWidth" access="public" static="true" returns="integer">
/// 	<description> Returns page width in pixels </description>
/// </function>
Fit.Browser.GetPageWidth = function()
{
	var w = 0;

	if (window.innerWidth) // W3C
		w = window.innerWidth;
	else if (document.documentElement && document.documentElement.clientWidth) // IE 6-8 (not quirks mode)
		w = document.documentElement.clientWidth;

	return w;
}

/// <function container="Fit.Browser" name="GetPageHeight" access="public" static="true" returns="integer">
/// 	<description> Returns page height in pixels </description>
/// </function>
Fit.Browser.GetPageHeight = function()
{
	var h = 0;

	if (window.innerHeight) // W3C
		h = window.innerHeight;
	else if (document.documentElement && document.documentElement.clientHeight) // IE 6-8 (not quirks mode)
		h = document.documentElement.clientHeight;

	return h;
}

/// <function container="Fit.Browser" name="GetViewPortDimensions" access="public" static="true" returns="Fit.TypeDefs.Dimension">
/// 	<description> Returns object with Width and Height properties specifying dimensions of viewport </description>
/// </function>
Fit.Browser.GetViewPortDimensions = function()
{
	return { Width: Fit.Browser.GetPageWidth(), Height: Fit.Browser.GetPageHeight() };
}

/// <function container="Fit.Browser" name="GetScrollPosition" access="public" static="true" returns="Fit.TypeDefs.Position">
/// 	<description> Returns object with X and Y properties specifying scroll position </description>
/// </function>
Fit.Browser.GetScrollPosition = function()
{
	var x = document.body.scrollLeft || document.documentElement.scrollLeft || window.pageXOffset || 0;
	var y = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;

	return { X: x, Y: y };
}

/// <function container="Fit.Browser" name="GetScreenWidth" access="public" static="true" returns="integer">
/// 	<description> Get screen width </description>
/// 	<param name="onlyAvailable" type="boolean" default="false">
/// 		Set True to return only available space (may be reduced by e.g. start menu (Windows) or Dock (Linux/OSX)
/// 	</param>
/// </function>
Fit.Browser.GetScreenWidth = function(onlyAvailable)
{
	Fit.Validation.ExpectBoolean(onlyAvailable, true);

	if (onlyAvailable === true)
		return window.screen.availWidth;

	return window.screen.width;
}

/// <function container="Fit.Browser" name="GetScreenHeight" access="public" static="true" returns="integer">
/// 	<description> Get screen height </description>
/// 	<param name="onlyAvailable" type="boolean" default="false">
/// 		Set True to return only available space (may be reduced by e.g. start menu (Windows) or Dock (Linux/OSX)
/// 	</param>
/// </function>
Fit.Browser.GetScreenHeight = function(onlyAvailable)
{
	Fit.Validation.ExpectBoolean(onlyAvailable, true);

	if (onlyAvailable === true)
		return window.screen.availHeight;

	return window.screen.height;
}

/// <function container="Fit.Browser" name="GetScreenDimensions" access="public" static="true" returns="Fit.TypeDefs.Dimension">
/// 	<description> Returns object with Width and Height properties specifying screen dimensions </description>
/// 	<param name="onlyAvailable" type="boolean" default="false">
/// 		Set True to return only available space (may be reduced by e.g. Start menu (Windows) or Dock (Linux/OSX)
/// 	</param>
/// </function>
Fit.Browser.GetScreenDimensions = function(onlyAvailable)
{
	Fit.Validation.ExpectBoolean(onlyAvailable, true);
	return { Width: Fit.Browser.GetScreenWidth(onlyAvailable), Height: Fit.Browser.GetScreenHeight(onlyAvailable) };
}

/// <function container="Fit.Browser" name="IsMobile" access="public" static="true" returns="boolean">
/// 	<description> Returns value indicating whether devices currently being used is a mobile device or not </description>
/// 	<param name="includeTablets" type="boolean" default="true"> Value indicating whether tablets are considered mobile devices or not </param>
/// </function>
Fit.Browser.IsMobile = function(includeTablets)
{
	Fit.Validation.ExpectBoolean(includeTablets, true);

	// Based on http://detectmobilebrowsers.com
	// See About section for Tablet support: http://detectmobilebrowsers.com/about

	var nav = navigator.userAgent || navigator.vendor;

	if (includeTablets !== false && /android|ipad|playbook|silk/i.test(nav))
		return true;

	return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(nav) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(nav.substr(0,4)));
}


/// <function container="Fit.Browser" name="Log" access="public" static="true">
/// 	<description> Log message or object </description>
/// 	<param name="msg" type="object"> Message or object to log </param>
/// </function>
Fit.Browser.Log = function(msg) // msg not validated - any object or value (including null/undefined) can be logged
{
	if (window.console)
		console.log(msg);
}

Fit.Browser.Debug = function(msg) // msg not validated - any object or value (including null/undefined) can be logged
{
	if (window.console && Fit._internal.Validation.DebugMode === true)
		console.log(msg);
}

/// <function container="Fit.Browser" name="LogDeprecated" access="public" static="true">
/// 	<description> Log message about use of deprecated feature </description>
/// 	<param name="msg" type="string"> Message to log </param>
/// </function>
Fit.Browser.LogDeprecated = function(msg)
{
	Fit.Validation.ExpectString(msg);

	if (window.console && console.warn)
		console.warn(msg);
	else
		Fit.Browser.Log(msg);

	//if (window.console && console.trace)
		//console.trace();
}

/// <container name="Fit.BrowserTypeDefs.BrowserInfo">
/// 	<description> Object representing browser environment </description>
/// 	<member name="Name" type='"Edge" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "Unknown"'> Browser name </member>
/// 	<member name="Version" type="integer"> Browser version </member>
/// 	<member name="Language" type="string"> Browser language, e.g. en, da, de, etc. </member>
/// 	<member name="IsMobile" type="boolean"> Boolean indicating whether this is a mobile device (tablet or phone) </member>
/// 	<member name="IsPhone" type="boolean"> Boolean indicating whether this is a phone </member>
/// 	<member name="IsTablet" type="boolean"> Boolean indicating whether this is a tablet device </member>
/// </container>
/// <container name="Fit.BrowserTypeDefs.BrowserAppInfo" extends="Fit.BrowserTypeDefs.BrowserInfo">
/// 	<description> Object representing browser app environment </description>
/// 	<member name="Name" type='"Edge" | "EdgeChromium" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "OperaChromium" | "Unknown"'> Browser app name </member>
/// </container>

/// <function container="Fit.Browser" name="GetInfo" access="public" static="true" returns="Fit.BrowserTypeDefs.BrowserInfo">
/// 	<description> Returns cached object with browser information </description>
/// 	<param name="returnAppInfo" type="false" default="false"> Set True to have app specific browser information returned - see GetBrowser(..) for details </param>
/// </function>
/// <function container="Fit.Browser" name="GetInfo" access="public" static="true" returns="Fit.BrowserTypeDefs.BrowserAppInfo">
/// 	<description> Returns cached object with browser app information </description>
/// 	<param name="returnAppInfo" type="true"> Set True to have app specific browser information returned - see GetBrowser(..) for details </param>
/// </function>
Fit.Browser.GetInfo = function(returnAppInfo)
{
	Fit.Validation.ExpectBoolean(returnAppInfo, true);

	if (returnAppInfo === true)
	{
		if (!Fit._internal.Browser.AppInfo)
		{
			Fit._internal.Browser.AppInfo = Fit.Browser.GetInfo();
			Fit._internal.Browser.AppInfo.Name = Fit.Browser.GetBrowser(true);		// Get app specific browser identifier (e.g. EdgeChromium for the chromed based Edge browser)
			Fit._internal.Browser.AppInfo.Version = Fit.Browser.GetVersion(true);	// Get app specific version number rather than browser engine version number
		}

		return Fit.Core.Clone(Fit._internal.Browser.AppInfo); // Clone to ensure values are not shared and potentially changed
	}

	if (!Fit._internal.Browser.Info)
	{
		Fit._internal.Browser.Info = {};

		Fit._internal.Browser.Info.Name = Fit.Browser.GetBrowser();
		Fit._internal.Browser.Info.Version = Fit.Browser.GetVersion();
		Fit._internal.Browser.Info.Language = Fit.Browser.GetLanguage();
		Fit._internal.Browser.Info.IsMobile = Fit.Browser.IsMobile();
		Fit._internal.Browser.Info.IsPhone = Fit.Browser.IsMobile(false); // Phone only
		Fit._internal.Browser.Info.IsTablet = (Fit.Browser.IsMobile() === true && Fit.Browser.IsMobile(false) === false); // Tablet only
	}

	return Fit.Core.Clone(Fit._internal.Browser.Info); // Clone to ensure values are not shared and potentially changed
}

/// <function container="Fit.Browser" name="IsStorageSupported" access="public" static="true" returns="boolean">
/// 	<description> Returns value indicating whether Session and Local storage is supported or not </description>
/// </function>
Fit.Browser.IsStorageSupported = function()
{
	if (Fit._internal.Browser.StorageSupported === undefined)
	{
		Fit._internal.Browser.StorageSupported = false;

		try
		{
			if (window.localStorage && window.sessionStorage)
			{
				var x = "__FITUITEST__";

				localStorage.setItem(x, x);
				localStorage.removeItem(x);

				sessionStorage.setItem(x, x);
				sessionStorage.removeItem(x);

				Fit._internal.Browser.StorageSupported = true;
			}
		}
		catch (err)
		{
		}
	}

	return Fit._internal.Browser.StorageSupported;
}
