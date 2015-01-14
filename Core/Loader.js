// The order of processing scripts and stylesheets:
// http://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#The_order_of_processing_scripts_and_style_sheets

/// <container name="Fit.Loader">
/// 	Loader is a useful mechanism for loading styleheets and JavaScript on demand in a non blocking manner.
/// </container>
Fit.Loader = {};

/// <function container="Fit.Loader" name="LoadScript" access="public" static="true">
/// 	<description>
/// 		Load client script on demand in a non-blocking manner.
///
/// 		// Example of loading a JavaScript file
///
/// 		Fit.Loader.LoadScript(&quot;extensions/test/test.js&quot;, function(src)
/// 		{
/// 			&#160;&#160;&#160;&#160; alert(&quot;JavaScript &quot; + src + &quot; loaded and ready to be used!&quot;);
/// 		});
/// 	</description>
/// 	<param name="src" type="string"> Script source (path or URL) </param>
/// 	<param name="callback" type="function" default="undefined">
/// 		Callback function fired when script loading is complete - takes the script source requested as an argument.
/// 		Be aware that a load error will also trigger the callback to make sure control is always returned.
/// 		Consider using feature detection within callback function for super reliable execution - example:
/// 		if (expectedObjectOrFunction) { /* Successfully loaded, continue.. */ }
/// 	</param>
/// </function>
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

/// <function container="Fit.Loader" name="LoadScripts" access="public" static="true">
/// 	<description>
/// 		Chain load multiple client scripts on demand in a non-blocking manner.
///
/// 		// Example of loading multiple JavaScript files in serial:
///
/// 		Fit.Loader.LoadScripts(
/// 		[
/// 			&#160;&#160;&#160;&#160; {
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;extensions/test/menu.js&quot;,
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;JavaScript &quot; + cfg.source + &quot; loaded&quot;); }
/// 			&#160;&#160;&#160;&#160; },
/// 			&#160;&#160;&#160;&#160; {
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;http://cdn.domain.com/chat.js&quot;,
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;JavaScript &quot; + cfg.source + &quot; loaded&quot;); }
/// 			&#160;&#160;&#160;&#160; }
/// 		],
/// 		function(cfgs)
/// 		{
/// 			&#160;&#160;&#160;&#160; alert(&quot;All files loaded&quot;);
/// 		});
///
/// 		First argument is an array of script configurations:
/// 		source:string (required): Script source (path or URL)
/// 		loaded:function (optional): Callback function to execute when file has loaded (takes file configuration as argument)
/// 		Be aware that loaded callback is invoked even if a load error occures, to make sure control is returned to your code.
///
/// 		Second argument is the callback function fired when all files have finished loading - takes configuration array as argument.
/// 		This too may be invoked even if a load error occured, to make sure control is returned to your code.
///
/// 		Consider using feature detection within callback functions for super reliable execution - example:
/// 		if (expectedObjectOrFunction) { /* Successfully loaded, continue.. */ }
/// 	</description>
/// 	<param name="cfg" type="array"> Configuration array (see function description for details) </param>
/// 	<param name="callback" type="function" default="undefined"> Callback function fired when all scripts have finished loading (see function description for details) </param>
/// </function>
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
				if (window.console)
				{
					console.log(err.message);
					console.log(err.stack);
					console.log(err);
				}
			}
		}

		// Continue chain - load next script from configuration

		Fit.Loader.LoadScripts(cfg, callback, true);
	});
}

/// <function container="Fit.Loader" name="LoadStyleSheet" access="public" static="true">
/// 	<description>
/// 		Load CSS stylesheet on demand in a non-blocking manner.
/// 		It is recommended to load stylesheets before rendering items using
/// 		the CSS classes to avoid FOUC (Flash Of Unstyled Content).
///
/// 		// Example of loading a CSS file
///
/// 		Fit.Loader.LoadStyleSheet(&quot;extensions/test/layout.css&quot;, function(src)
/// 		{
/// 			&#160;&#160;&#160;&#160; alert(&quot;CSS file &quot; + src + &quot; loaded!&quot;);
/// 		});
/// 	</description>
/// 	<param name="src" type="string"> CSS file source (path or URL) </param>
/// 	<param name="callback" type="function" default="undefined">
/// 		Callback function fired when CSS file loading is complete - takes the file source requested as an argument.
/// 		Be aware that a load error will also trigger the callback to make sure control is always returned.
/// 	</param>
/// </function>
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

/// <function container="Fit.Loader" name="LoadStyleSheets" access="public" static="true">
/// 	<description>
/// 		Load multiple stylesheets in parrallel in a non-blocking manner.
///
/// 		// Example of loading multiple CSS files:
///
/// 		Fit.Loader.LoadStyleSheets(
/// 		[
/// 			&#160;&#160;&#160;&#160; {
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;extensions/test/menu.css&quot;,
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;Stylesheet &quot; + cfg.source + &quot; loaded&quot;); }
/// 			&#160;&#160;&#160;&#160; },
/// 			&#160;&#160;&#160;&#160; {
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;http://cdn.domain.com/chat.css&quot;,
/// 			&#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;Stylesheet &quot; + cfg.source + &quot; loaded&quot;); }
/// 			&#160;&#160;&#160;&#160; }
/// 		],
/// 		function(cfgs)
/// 		{
/// 			&#160;&#160;&#160;&#160; alert(&quot;All stylesheets loaded&quot;);
/// 		});
///
/// 		First argument is an array of stylesheet configurations:
/// 		source:string (required): Stylesheet source (path or URL)
/// 		loaded:function (optional): Callback function to execute when stylesheet has loaded (takes stylesheet configuration as argument)
/// 		Be aware that loaded callback is invoked even if a load error occures, to make sure control is returned to your code.
///
/// 		Second argument is the callback function fired when all stylesheets have finished loading - takes configuration array as argument.
/// 		This too may be invoked even if a load error occured, to make sure control is returned to your code.
/// 	</description>
/// 	<param name="cfg" type="array"> Configuration array (see function description for details) </param>
/// 	<param name="callback" type="function" default="undefined"> Callback function fired when all stylesheets have finished loading (see function description for details) </param>
/// </function>
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
							if (window.console)
							{
								console.log(err.message);
								console.log(err.stack);
								console.log(err);
							}
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
