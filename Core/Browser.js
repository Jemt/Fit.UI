Fit.Browser = {};

Fit.Browser.GetBrowser = function()
{
	var agent = navigator.userAgent;

	if (agent.indexOf("Chrome") > -1)
		return "Chrome";
	if (agent.indexOf("Safari") > -1)
		return "Safari";
	if (agent.indexOf("MSIE") > -1 || agent.indexOf("Trident") > -1)
		return "MSIE";
	if (agent.indexOf("Firefox") > -1)
		return "Firefox";
	if (agent.indexOf("Opera") > -1)
		return "Opera";

	return "Unknown";
}

Fit.Browser.GetVersion = function()
{
	var start = 0;
	var end = 0;
	var agent = navigator.userAgent;

	if (Fit.Browser.GetBrowser() === "Chrome")
	{
		start = agent.indexOf("Chrome/");
		start = (start !== -1 ? start + 7 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "Safari")
	{
		start = agent.indexOf("Version/");
		start = (start !== -1 ? start + 8 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "MSIE")
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
	if (Fit.Browser.GetBrowser() === "Firefox")
	{
		start = agent.indexOf("Firefox/");
		start = (start !== -1 ? start + 8 : 0);
		end = agent.indexOf(".", start);
		end = (end !== -1 ? end : 0);
	}
	if (Fit.Browser.GetBrowser() === "Opera")
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

	if (start !== 0 && start !== 0)
		return parseInt(agent.substring(start, end));

	return -1;
}

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

Fit.Browser.GetPageWidth = function()
{
	var w = -1;

	if (window.innerWidth) // W3C
		w = window.innerWidth;
	else if (document.documentElement && document.documentElement.clientWidth) // IE 6-8 (not quirks mode)
		w = document.documentElement.clientWidth;

	return w;
}

Fit.Browser.GetPageHeight = function()
{
	var h = -1;

	if (window.innerHeight) // W3C
		h = window.innerHeight;
	else if (document.documentElement && document.documentElement.clientHeight) // IE 6-8 (not quirks mode)
		h = document.documentElement.clientHeight;

	return h;
}

Fit.Browser.GetScreenWidth = function(onlyAvailable)
{
	if (onlyAvailable === true)
		return window.screen.availWidth;

	return window.screen.width;
}

Fit.Browser.GetScreenHeight = function(onlyAvailable)
{
	if (onlyAvailable === true)
		return window.screen.availHeight;

	return window.screen.height;
}

Fit.Browser.Log = function(msg)
{
	if (window.console)
		console.log(msg);
}
