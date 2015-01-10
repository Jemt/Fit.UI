Fit.Loader = {};

Fit.Loader.LoadScript = function(src, callback)
{
	var script = document.createElement("script");
	script.type = "text/javascript";

	if (callback !== undefined && (Fit.Browser.GetBrowser() !== "MSIE" || (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() >= 9)))
	{
		script.onload = function() { callback(src); };

		// Terrible, but we need same behaviour for all browsers, and IE8 (and below) does not distinguish between success and failure.
		// Also, we need to make sure control is returned no matter what - just like using ordinary <script src=".."> elements which
		// doesn't halt execution on 404 or syntax errors.
		script.onerror = function() { callback(src); };
	}
	else if (callback !== undefined && Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() <= 8)
	{
		script.onreadystatechange = function()
		{
			if (this.readyState === "complete" || this.readyState === "loaded") // loaded = initial load, complete = from cache
				callback(src);
		}
	}

	script.src = src;
	document.getElementsByTagName("head")[0].appendChild(script);
}

Fit.Loader.LoadScripts = function(cfg, callback, skipValidation)
{
	// Verify configuration

	if (skipValidation !== true)
	{
		for (var i = 0 ; i < cfg.length ; i++)
			if (cfg[i].source === undefined)
				throw new Error("Unable to load script with source property undefined");
	}

	// Find next unhandled script to load

	var toLoad = null;

	for (var i = 0 ; i < cfg.length ; i++)
	{
		if (cfg[i].handled !== true)
		{
			toLoad = cfg[i];
			break;
		}
	}

	// Break out if no more scripts need handling

	if (toLoad === null)
	{
		if (callback !== undefined)
			callback(cfg);

		return;
	}

	// Load script

	toLoad.handled = true;

	Fit.Loader.LoadScript(toLoad.source, function()
	{
		if (toLoad.loaded !== undefined)
		{
			try // Use try/catch to prevent buggy code from stopping the chain
			{
				toLoad.loaded(toLoad);
			}
			catch (err)
			{
				if (window.console) console.log(err);
			}
		}

		// Continue chain - load next script from configuration

		Fit.Loader.LoadScripts(cfg, callback, true);
	});
}

Fit.Loader.LoadStyleSheet = function(src, callback)
{
	// OnError event could likely be supported using the following
	// lines of code which allows us to check the number of loaded CSS rules:
	// W3C browsers: var success = (cssLinkNode.sheet.cssRules.length > 0);
	// Internet Explorer: var success = (cssLinkNode.styleSheet.rules.length > 0);
	// For consistency this approach is not currently being used - we need same
	// behaviour for both LoadStyleSheet(..), and LoadScript(..) which doesn't support OnError.

	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";

	if (callback !== undefined && (Fit.Browser.GetBrowser() !== "MSIE" || (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() >= 9)))
	{
		link.onload = function() { callback(src); };
		link.onerror = function() { callback(src); }; // Same behaviour as LoadScript(..)
	}
	else if (callback !== undefined && Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() <= 8)
	{
		link.onreadystatechange = function()
		{
			if (this.readyState === "complete" || this.readyState === "loaded") // loaded = initial load, complete = from cache
				callback(src);
		}
	}

	link.href = src;
	document.getElementsByTagName("head")[0].appendChild(link);
}

Fit.Loader.LoadStyleSheets = function(cfg, callback)
{
	// Verify configuration

	for (var i = 0 ; i < cfg.length ; i++)
		if (cfg[i].source === undefined)
			throw new Error("Unable to load stylesheet with source property undefined");

	// Invoke callback if nothing to load

	if (cfg.length === 0)
	{
		if (callback !== undefined)
			callback(cfg);

		return;
	}

	// Batch load all stylesheets

	for (var i = 0 ; i < cfg.length ; i++)
	{
		// Load stylesheet

		Fit.Loader.LoadStyleSheet(cfg[i].source, function(src)
		{
			// Fire stylesheet callback function when completed

			for (var j = 0 ; j < cfg.length ; j++)
			{
				if (cfg[j].source === src)
				{
					cfg[j].handled = true;

					if (cfg[j].loaded !== undefined)
					{
						try // Use try/catch to make sure a buggy callback function does not prevent "all completed" callback to be reached
						{
							cfg[j].loaded(cfg[j]);
						}
						catch (err)
						{
							if (window.console) console.log(err);
						}
					}

					break;
				}
			}

			// Fire "all completed" callback if all stylesheets have finished loading

			for (var j = 0 ; j < cfg.length ; j++)
			{
				if (cfg[j].handled !== true)
					return;
			}

			if (callback !== undefined)
				callback(cfg);
		});
	}
}
