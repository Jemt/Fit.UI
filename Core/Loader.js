// The order of processing scripts and stylesheets:
// http://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#The_order_of_processing_scripts_and_style_sheets

/// <container name="Fit.Loader">
/// 	Loader is a useful mechanism for loading styleheets and JavaScript on demand in a non blocking manner.
/// </container>
Fit.Loader = {};

/// <function container="Fit.LoaderTypeDefs" name="LoadSingleEventHandler">
/// 	<description> Callback invoked when resource is loaded </description>
/// 	<param name="src" type="string"> Resource loaded </param>
/// </function>

/// <function container="Fit.Loader" name="ExecuteScript" access="public" static="true">
/// 	<description>
/// 		Load client script on demand in a non-blocking manner.
///
/// 		ExecuteScript differs from LoadScript in the way code is loaded
/// 		and executed. ExecuteScript loads the script using AJAX, meaning
/// 		the script file either has to be located on the same domain as
/// 		the application invoking ExecuteScript, or have the
/// 		Access-Control-Allow-Origin header configured to allow file to be
/// 		loaded from a foreign domain.
/// 		The code loaded is injected into the virtual machine meaning debugging
/// 		will not reveal from which file the code originated, although this
/// 		information can be retrived by inspecting the call stack.
/// 		ExecuteScript has the advantages that is allows for both an OnSuccess
/// 		and OnFailure handler, and it allows for objects to be passed to
/// 		the executing script using the context parameter, which will
/// 		cause the code to execute within its own contained scope (closure).
/// 		The script will execute in the global scope if no context object is provided.
///
/// 		// Example of loading a JavaScript file, passing variables to it:
///
/// 		Fit.Loader.ExecuteScript(&quot;extensions/test/test.js&quot;, function(src)
/// 		{
/// 			&#160;&#160;&#160;&#160; alert(&quot;JavaScript &quot; + src + &quot; loaded and ready to be used!&quot;);
/// 		},
/// 		function(src)
/// 		{
/// 			&#160;&#160;&#160;&#160; alert(&quot;JavaScript &quot; + src + &quot; could NOT be loaded;);
///
/// 		}, { $: window.jQuery, mode: &quot;advanced&quot;, showData: &quot;users&quot; });
/// 	</description>
/// 	<param name="src" type="string"> Script source (path or URL) </param>
/// 	<param name="onSuccess" type="Fit.LoaderTypeDefs.LoadSingleEventHandler" default="undefined">
/// 		Callback function fired when script has been successfully loaded and executed.
/// 		The function takes the script source requested as an argument.
/// 	</param>
/// 	<param name="onFailure" type="Fit.LoaderTypeDefs.LoadSingleEventHandler" default="undefined">
/// 		Callback function fired if script could not be loaded or executed successfully.
/// 		The function takes the script source requested as an argument.
/// 	</param>
/// 	<param name="context" type="object" default="undefined">
/// 		Properties registered on the context object will be
/// 		exposed as globally accessible objects for the executing script.
/// 		Example: { jQuery: window.jQuery, $: window.jQuery }
/// 		The script will execute in the global window scope if no
/// 		context object is defined.
/// 	</param>
/// </function>
Fit.Loader.ExecuteScript = function(src, onSuccess, onFailure, context)
{
	// Loading JS using AJAX and Eval versus a traditional script block
	// like Fit.Loader.LoadScript(..) uses:
	// The approach with AJAX allows us to expose both OnSuccess and
	// OnFailure, even on legacy browsers. However, if a script fails
	// or need debugging, it is not immediately obvious what file is
	// being debugged since the code runs as "anonymous" code in the VM.
	// One would have to investigate the call stack to reveal the source file.
	// Also, the AJAX request will not allow scripts from remote locations
	// to be loaded, unless the Access-Control-Allow-Origin header is configured.
	// The best thing about using eval however, is the possibility of passing
	// variables to the file being loaded using the context object.

	Fit.Validation.ExpectStringValue(src);
	Fit.Validation.ExpectFunction(onSuccess, true);
	Fit.Validation.ExpectFunction(onFailure, true);

	var r = new Fit.Http.Request(src);
	r.OnSuccess(function(sender)
	{
		var js = r.GetResponseText();
		var error = null;

		if (Fit.Validation.IsSet(context) === false || context === window)
		{
			try
			{
				eval(js);
			}
			catch (err)
			{
				error = err;
			}
		}
		else
		{
			// Execute in closure (execution scope).
			// All variables registered on context object is made globally available to JS file.

			var args = "";
			var parms = "";
			for (var prop in (context ? context : {}))
			{
				args += (args !== "" ? ", " : "") + prop;
				parms += (parms !== "" ? ", " : "") + "this." + prop;
			}

			try
			{
				eval("(function() { (function(" + args + ") { " + js + " })(" + parms + "); })").call(context ? context : this); // https://jsfiddle.net/yut8fptm/
			}
			catch (err)
			{
				error = err;
			}
		}

		if (error === null && Fit.Validation.IsSet(onSuccess) === true)
		{
			onSuccess(src);
		}
		else if (error !== null)
		{
			if (window.console)
			{
				console.log(error.message);
				console.log(error.stack);
				console.log(error);
			}

			if (Fit.Validation.IsSet(onFailure) === true)
				onFailure(src);
		}
	});
	r.OnFailure(function(sender)
	{
		if (Fit.Validation.IsSet(onFailure) === true)
		{
			onFailure(src);
		}
	});
	r.Start();
}

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
/// 	<param name="callback" type="Fit.LoaderTypeDefs.LoadSingleEventHandler" default="undefined">
/// 		Callback function fired when script loading is complete - takes the script source requested as an argument.
/// 		Be aware that a load error will also trigger the callback to make sure control is always returned.
/// 		Consider using feature detection within callback function for super reliable execution - example:
/// 		if (expectedObjectOrFunction) { /* Successfully loaded, continue.. */ }
/// 	</param>
/// </function>
Fit.Loader.LoadScript = function(src, callback)
{
	Fit.Validation.ExpectStringValue(src);
	Fit.Validation.ExpectFunction(callback, true);

	if (arguments.length > 2)
	{
		// One could easily confuse LoadScript with ExecuteScript - help the developer to choose the right function
		Fit.Validation.ThrowError("Argument(s) do not match function signature - did you intend to use Fit.Loader.ExecuteScript instead ?");
	}

	// Scripts injected always load as if they had the async attribute
	// set, so we will not cause the parser to stall using this approach.
	// It is completely non-blocking while the script loads.
	// https://developer.mozilla.org/en/docs/Web/HTML/Element/script

	var script = document.createElement("script");
	script.type = "text/javascript";
	script.charset = "UTF-8";

	if (Fit.Validation.IsSet(callback) === true && (Fit.Browser.GetBrowser() !== "MSIE" || (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() >= 9)))
	{
		script.onload = function() { callback(src); };

		// Terrible, but we need same behaviour for all browsers, and IE8 (and below) does not distinguish between success and failure.
		// Also, we need to make sure control is returned no matter what - just like using ordinary <script src=".."> elements which
		// doesn't halt execution on 404 or syntax errors.
		script.onerror = function() { callback(src); };
	}
	else if (Fit.Validation.IsSet(callback) === true && Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() <= 8)
	{
		script.onreadystatechange = function()
		{
			if (this.readyState === "complete" || this.readyState === "loaded") // loaded = initial load, complete = from cache
				callback(src);
		}
	}

	script.src = src;

	// NOTICE: Scripts loaded this way will NOT be able to reliably resolve their own
	// script block using something like this: document.scripts[document.scripts.length - 1].
	// The reason is of couse that scripts are loaded async., and multiple script blocks
	// may have been defined after LoadScript(..) was initially invoked.

	document.getElementsByTagName("head")[0].appendChild(script);
}

/// <container name="Fit.LoaderTypeDefs.ResourceConfiguration">
/// 	<description> Resource configuration </description>
/// 	<member name="source" type="string"> Path to resource </member>
/// 	<member name="loaded" type="Fit.LoaderTypeDefs.LoadSingleConfigurationEventHandler" default="undefined">
/// 		Callback invoked when resource is loaded
/// 	</member>
/// </container>

/// <function container="Fit.LoaderTypeDefs" name="LoadSingleConfigurationEventHandler">
/// 	<description> Callback invoked when resource is loaded </description>
/// 	<param name="cfg" type="Fit.LoaderTypeDefs.ResourceConfiguration"> Resource loaded </param>
/// </function>

/// <function container="Fit.LoaderTypeDefs" name="LoadMultiConfigurationsEventHandler">
/// 	<description> Callback invoked when all resources are loaded </description>
/// 	<param name="cfgs" type="Fit.LoaderTypeDefs.ResourceConfiguration[]"> Resources loaded </param>
/// </function>

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
/// 	<param name="cfg" type="Fit.LoaderTypeDefs.ResourceConfiguration[]"> Configuration array (see function description for details) </param>
/// 	<param name="callback" type="Fit.LoaderTypeDefs.LoadMultiConfigurationsEventHandler" default="undefined">
/// 		Callback function fired when all scripts have finished loading (see function description for details)
/// 	</param>
/// </function>
Fit.Loader.LoadScripts = function(cfg, callback, skipValidation)
{
	Fit.Validation.ExpectArray(cfg);
	Fit.Validation.ExpectFunction(callback, true);
	Fit.Validation.ExpectBoolean(skipValidation, true);

	// Verify configuration

	if (skipValidation !== true)
	{
		for (var i = 0 ; i < cfg.length ; i++)
		{
			Fit.Validation.ExpectStringValue(cfg[i].source);
			Fit.Validation.ExpectFunction(cfg[i].loaded, true);
		}
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
		if (Fit.Validation.IsSet(callback) === true)
			callback(cfg);

		return;
	}

	// Load script

	toLoad.handled = true;

	Fit.Loader.LoadScript(toLoad.source, function()
	{
		if (Fit.Validation.IsSet(toLoad.loaded) === true)
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
/// 	<param name="callback" type="Fit.LoaderTypeDefs.LoadSingleEventHandler" default="undefined">
/// 		Callback function fired when CSS file loading is complete - takes the file source requested as an argument.
/// 		Be aware that a load error will also trigger the callback to make sure control is always returned.
/// 	</param>
/// </function>
Fit.Loader.LoadStyleSheet = function(src, callback)
{
	Fit.Validation.ExpectStringValue(src);
	Fit.Validation.ExpectFunction(callback, true);

	// OnError event could likely be supported using the following
	// lines of code which allows us to check the number of loaded CSS rules:
	// W3C browsers: var success = (cssLinkNode.sheet.cssRules.length > 0);
	// Internet Explorer: var success = (cssLinkNode.styleSheet.rules.length > 0);
	// For consistency this approach is not currently being used - we need same
	// behaviour for both LoadStyleSheet(..), and LoadScript(..) which doesn't support OnError.

	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";

	if (Fit.Validation.IsSet(callback) === true && (Fit.Browser.GetBrowser() !== "MSIE" || (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() >= 9)))
	{
		link.onload = function() { callback(src); };
		link.onerror = function() { callback(src); }; // Same behaviour as LoadScript(..)
	}
	else if (Fit.Validation.IsSet(callback) === true && Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() <= 8)
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
/// 	<param name="cfg" type="Fit.LoaderTypeDefs.ResourceConfiguration[]"> Configuration array (see function description for details) </param>
/// 	<param name="callback" type="Fit.LoaderTypeDefs.LoadMultiConfigurationsEventHandler" default="undefined"> Callback function fired when all stylesheets have finished loading (see function description for details) </param>
/// </function>
Fit.Loader.LoadStyleSheets = function(cfg, callback)
{
	Fit.Validation.ExpectArray(cfg);
	Fit.Validation.ExpectFunction(callback, true);

	// Verify configuration

	for (var i = 0 ; i < cfg.length ; i++)
	{
		Fit.Validation.ExpectStringValue(cfg[i].source);
		Fit.Validation.ExpectFunction(cfg[i].loaded, true);
	}

	// Invoke callback if nothing to load

	if (cfg.length === 0)
	{
		if (Fit.Validation.IsSet(callback) === true)
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

					if (Fit.Validation.IsSet(cfg[j].loaded) === true)
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

			if (Fit.Validation.IsSet(callback) === true)
				callback(cfg);
		});
	}
}
