Fit.Http = {};

Fit._internal.Http = {};
Fit._internal.Http.JsonpRequest = {};
Fit._internal.Http.JsonpRequest.Callbacks = {};

// Use http://www.jsontest.com for testing

/// <container name="Fit.Http.Request">
/// 	Asynchronous HTTP request functionality (AJAX/WebService).
///
/// 	// Example code
///
/// 	var http = new Fit.Http.Request(&quot;CreateUser.php&quot;);
///
/// 	http.SetData(&quot;username=Jack&amp;password=Secret&quot;);
/// 	http.OnStateChange(function(r)
/// 	{
/// 		&#160;&#160;&#160;&#160; if (http.GetCurrentState() === 4 &amp;&amp; http.GetHttpStatus() === 200)
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; alert(&quot;User created - server said: &quot; + http.GetResponseText());
/// 	});
///
/// 	http.Start();
/// </container>

/// <function container="Fit.Http.Request" name="Request" access="public">
/// 	<description> Constructor - creates instance of Request class </description>
/// 	<param name="uri" type="string"> URL to request </param>
/// </function>
Fit.Http.Request = function(uri)
{
	/*
	// Test case
	req = new Fit.Http.Request("./post.php");
	req.AddData("Name", "Jimmy");
	req.AddData("Age", "31");
	req.AddData("Gender", "Male");
	req.OnStateChange(function(r) { console.log("State listener", r, r.GetCurrentState(), r.GetHttpStatus()); });
	req.OnStateChange(function(r) { console.log("OnStateChange ", r, r.GetCurrentState(), r.GetHttpStatus()); });
	req.OnSuccess(function(r) { console.log("OnSuccess ", r, r.GetResponseText()); });
	req.OnSuccess(function(r) { console.log("Finally done!"); });
	req.OnFailure(function(r) { console.log("OnFailure ", r, r.GetHttpStatus()); });
	req.Start();*/

	Fit.Validation.ExpectStringValue(uri);

	var me = this;
	var url = uri;
	var async = -1; // -1 = not defined / enforced, 0 = sync, 1 = async
	var httpRequest = getHttpRequestObject();
	var customHeaders = {};
	var customProperties = {};
	var formData = null;
	var data = null;
	var method = null;

	var onStateChange = [];
	var onRequestHandlers = [];
	var onSuccessHandlers = [];
	var onFailureHandlers = [];
	var onAbortHandlers = [];

	// Init

	function init()
	{
		httpRequest.onreadystatechange = function()
		{
			me._internal.FireOnStateChange();

			if (httpRequest.readyState === 4)
			{
				if (httpRequest.status === 0)
				{
					me._internal.FireOnAbort();
				}
				else if (httpRequest.status >= 200 && httpRequest.status <= 299) // Entire 2xx range indicates success
				{
					me._internal.FireOnSuccess();
				}
				else
				{
					me._internal.FireOnFailure();
				}
			}
		}

		// Cross Site Request Forgery (CSRF) protection
		// https://markitzeroday.com/x-requested-with/cors/2017/06/29/csrf-mitigation-for-ajax-requests.html
		me.AddHeader("X-Requested-With", "XMLHttpRequest");
	}

	// Public

	/// <function container="Fit.Http.Request" name="AddHeader" access="public">
	/// 	<description> Add header to request </description>
	/// 	<param name="key" type="string"> Header key </param>
	/// 	<param name="value" type="string"> Header value </param>
	/// </function>
	this.AddHeader = function(key, value)
	{
		Fit.Validation.ExpectStringValue(key);
		Fit.Validation.ExpectString(value);
		customHeaders[key.toLowerCase()] = { Key: key, Value: value };
	}

	/// <function container="Fit.Http.Request" name="GetHeader" access="public" returns="string | null">
	/// 	<description> Get request header - returns Null if not found </description>
	/// 	<param name="key" type="string"> Header name </param>
	/// </function>
	this.GetHeader = function(key)
	{
		Fit.Validation.ExpectString(key);
		return (Fit.Validation.IsSet(customHeaders[key.toLowerCase()]) === true ? customHeaders[key.toLowerCase()].Value : null);
	}

	/// <function container="Fit.Http.Request" name="RemoveHeader" access="public">
	/// 	<description> Remove request header </description>
	/// 	<param name="key" type="string"> Header name </param>
	/// </function>
	this.RemoveHeader = function(key)
	{
		Fit.Validation.ExpectString(key);
		delete customHeaders[key.toLowerCase()];
	}

	/// <function container="Fit.Http.Request" name="GetHeaders" access="public" returns="string[]">
	/// 	<description> Get all request header names </description>
	/// </function>
	this.GetHeaders = function()
	{
		var keys = [];

		Fit.Array.ForEach(customHeaders, function(key)
		{
			Fit.Array.Add(keys, customHeaders[key].Key);
		})

		return keys;
	}

	/// <function container="Fit.Http.Request" name="ClearHeaders" access="public">
	/// 	<description> Remove all request headers </description>
	/// </function>
	this.ClearHeaders = function()
	{
		customHeaders = {};
	}

	/// <function container="Fit.Http.Request" name="SetData" access="public">
	/// 	<description> Set data to post - this will change the request method from GET to POST </description>
	/// 	<param name="dataObj" type="object"> Data to send </param>
	/// </function>
	this.SetData = function(dataObj)
	{
		me.ClearFormData(); // Clears both form data and removes content-type header if ensured in conjunction with form data previously set
		data = null;

		if (typeof(dataObj) === "string" && (me.GetHeader("content-type") === null || me.GetHeader("content-type").toLowerCase() === "application/x-www-form-urlencoded"))
		{
			// Backward compatibility - Fit.Http.Request previously only allowed "key=val&key2=val2&etc" being passed to SetData.
			// Now accepting both the old "form data string mode" and any kind of object which will be stringified upon request.
			// Unfortunately this means that passing a "clean string" will not be possible without triggering "form data mode",
			// unless the Content-Type header is set prior to calling SetData("My string").
			// So request.SetData("Hello world") without setting the Content-Type header first will be considered form data
			// (Hello world=) and the Content-Type header will be set to "application/x-www-form-urlencoded".
			Fit.Browser.Log("Deprecated use of SetData(..) to set form data on instance of Fit.Http.Request - please use AddFormData(..) instead! If data added is not to be considered form data then make sure to set Content-Type header prior to calling SetData(..)!");

			formData = {};
			ensureContentTypeHeaderForFormData();

			var coll = parseKeyValuePairs(dataObj);

			Fit.Array.ForEach(coll, function(key)
			{
				formData[key] = { Value: coll[key], Encode: true };
			});
		}
		else
		{
			data = dataObj;
		}
	}

	/// <function container="Fit.Http.Request" name="GetData" access="public" returns="object">
	/// 	<description> Get data set to be posted </description>
	/// </function>
	this.GetData = function()
	{
		if (formData !== null)
		{
			return getFormDataString(false); // False = do not encode values (returns string as provided to SetData(..))
		}

		return data;
	}

	/// <function container="Fit.Http.Request" name="AddFormData" access="public">
	/// 	<description>
	/// 		Add form data - this will change the request method from GET to POST
	/// 		and cause the following header to be added to the request, unless already
	/// 		defined: Content-type: application/x-www-form-urlencoded
	/// 	</description>
	/// 	<param name="key" type="string"> Data key </param>
	/// 	<param name="value" type="string"> Data value </param>
	/// 	<param name="uriEncode" type="boolean" default="true">
	/// 		Set False to prevent value from being URI encoded to preserve special characters
	/// 	</param>
	/// </function>
	this.AddFormData = function(key, value, uriEncode)
	{
		Fit.Validation.ExpectStringValue(key);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(uriEncode, true);

		if (formData === null)
		{
			formData = {};
			ensureContentTypeHeaderForFormData();
		}

		formData[key] = { Value: value, Encode: (uriEncode !== false) };
	}

	this.AddData = function(key, value, uriEncode) // Backward compatibility
	{
		Fit.Validation.ExpectStringValue(key);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(uriEncode, true);

		Fit.Browser.Log("Use of deprecated AddData(..) function to set form data on instance of Fit.Http.Request - please use AddFormData(..) instead!")

		me.AddFormData(key, value, uriEncode);
	}

	/// <function container="Fit.Http.Request" name="GetFormData" access="public" returns="string | null">
	/// 	<description> Get form value added to form data collection - returns Null if not found </description>
	/// 	<param name="key" type="string"> Data key </param>
	/// </function>
	this.GetFormData = function(key)
	{
		Fit.Validation.ExpectString(key);
		return (formData !== null && Fit.Validation.IsSet(formData[key]) === true ? formData[key].Value : null);
	}

	/// <function container="Fit.Http.Request" name="RemoveFormData" access="public">
	/// 	<description> Remove form value from form data collection </description>
	/// 	<param name="key" type="string"> Data key </param>
	/// </function>
	this.RemoveFormData = function(key)
	{
		Fit.Validation.ExpectString(key);

		if (formData !== null)
			delete formData[key];
	}

	/// <function container="Fit.Http.Request" name="ClearFormData" access="public">
	/// 	<description> Remove all form values from form data collection </description>
	/// </function>
	this.ClearFormData = function()
	{
		formData = null;

		if (me.GetHeader("content-type") !== null && customHeaders["content-type"]._ensured === true)
			me.RemoveHeader("content-type");
	}

	/// <function container="Fit.Http.Request" name="Method" access="public" returns='"GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS"'>
	/// 	<description> Get/set request method (e.g. GET, POST, HEAD, PUT, DELETE, OPTIONS) </description>
	/// 	<param name="val" type='"GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS"' default="undefined"> If defined, changes HTTP request method to specified value </param>
	/// </function>
	this.Method = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			method = val;
		}

		return (method !== null ? method : (data !== null || formData !== null ? "POST" : "GET"));
	}

	/// <function container="Fit.Http.Request" name="Async" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether request is made asynchronously or synchronously </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, enforces an async or sync request based on the boolean value provided </param>
	/// </function>
	this.Async = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			async = (val === true ? 1 : 0);
		}

		if (async !== -1) // Enforced (value is 0 or 1)
			return (async === 1);

		// Not enforced - request will become async if event handlers are registered
		return (onStateChange.length > 0 || onSuccessHandlers.length > 0 || onFailureHandlers.length > 0);
	}

	/// <function container="Fit.Http.Request" name="Url" access="public" returns="string">
	/// 	<description> Get/set request URL </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, changes request URL to specified value </param>
	/// </function>
	this.Url = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			url = val;
		}

		return url;
	}

	/// <function container="Fit.Http.Request" name="Start" access="public">
	/// 	<description>
	/// 		Invoke request. An asynchroneus request is performed if an
	/// 		OnStateChange, OnSuccess, or OnFailure event handler has been set.
	/// 		If no event handlers have been set, a synchronous request will be performed,
	/// 		causing the client to wait (and freeze) until data is received.
	/// 	</description>
	/// </function>
	this.Start = function()
	{
		if (formData !== null && data !== null)
		{
			Fit.Validation.ThrowError("Unable to send both (JSON) Data and Form Data simultaneously - specify only one type of data to send");
		}

		// Fire OnRequest

		var cancel = me._internal.FireOnRequest();

		if (cancel === true)
			return;

		// Perform request

		var httpMethod = me.Method();
		var async = me.Async();
		httpRequest.open(httpMethod, url, async);

		for (var header in customHeaders)
		{
			httpRequest.setRequestHeader(header, customHeaders[header].Value);
		}

		Fit.Array.ForEach(customProperties, function(key)
		{
			httpRequest[key] = customProperties[key];
		});

		// Monitor request to catch communication problems (e.g. DNS errors)
		var checkerId = -1;
		checkerId = setInterval(function()
		{
			if (me.GetCurrentState() === 4) // Request done
			{
				clearInterval(checkerId);

				if (me.GetHttpStatus() === 0)
				{
					// Request is done (ready state === 4) and failed (HTTP status === 0),
					// possibly due to DNS problem (ERR_NAME_NOT_RESOLVED) - fire OnFailure.

					me._internal.FireOnFailure();
				}
			}
		}, 1000);

		try // Using try/catch to catch any error that may occur when initializing connection
		{
			if (formData !== null)
				httpRequest.send(getFormDataString(true));
			else
				httpRequest.send((data !== null ? (typeof(data) === "string" ? data : JSON.stringify(data)) : ""));
		}
		catch (err)
		{
			me._internal.FireOnFailure();
		}
	}

	/// <function container="Fit.Http.Request" name="Abort" access="public">
	/// 	<description> Abort asynchroneus request </description>
	/// </function>
	this.Abort = function()
	{
		httpRequest.abort();
	}

	/// <function container="Fit.Http.Request" name="GetResponseXml" access="public" returns="Document">
	/// 	<description>
	/// 		Returns result from request as XML or HTML document.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 2xx (request successful).
	/// 	</description>
	/// </function>
	this.GetResponseXml = function()
	{
		return httpRequest.responseXML;
	}

	/// <function container="Fit.Http.Request" name="GetResponseText" access="public" returns="string">
	/// 	<description>
	/// 		Returns text result from request.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 2xx (request successful).
	/// 	</description>
	/// </function>
	this.GetResponseText = function()
	{
		return httpRequest.responseText;
	}

	/// <function container="Fit.Http.Request" name="GetResponseJson" access="public" returns="object | null">
	/// 	<description>
	/// 		Returns result from request as JSON object, Null if no response was returned.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 2xx (request successful).
	/// 	</description>
	/// </function>
	this.GetResponseJson = function()
	{
		return ((httpRequest.responseText !== "") ? JSON.parse(httpRequest.responseText) : null);
	}

	/// <function container="Fit.Http.Request" name="GetResponse" access="public" returns="object">
	/// 	<description>
	/// 		Returns result from request. Use this to obtain e.g. binary data on supported browsers.
	/// 		For requests without custom RequestProperties set the return value will be the response text.
	/// 	</description>
	/// </function>
	this.GetResponse = function()
	{
		return (((!httpRequest.responseType || httpRequest.responseType === "text") && typeof(httpRequest.responseText) === "string") ? httpRequest.responseText : httpRequest.response);
	}

	/// <function container="Fit.Http.Request" name="GetCurrentState" access="public" returns="integer">
	/// 	<description>
	/// 		Get current request state.
	/// 		0 = Unsent
	/// 		1 = Opened
	/// 		2 = Headers received
	/// 		3 = Loading
	/// 		4 = Done (response is ready for processing)
	/// 	</description>
	/// </function>
	this.GetCurrentState = function() // 0 = unsent, 1 = opened, 2 = headers received, 3 = loading, 4 = done
	{
		return httpRequest.readyState;
	}

	/// <function container="Fit.Http.Request" name="GetHttpStatus" access="public" returns="integer">
	/// 	<description>
	/// 		Returns HTTP status. Common return values are:
	/// 		200 = OK (successful request)
	/// 		304 = Forbidden (access denied)
	/// 		404 = Not found
	/// 		408 = Request time out
	/// 		500 = Internal server error
	/// 		503 = Service unavailable
	/// 	</description>
	/// </function>
	this.GetHttpStatus = function()
	{
		return httpRequest.status;
	}

	/// <function container="Fit.Http.Request" name="GetResponseHeaders" access="public" returns="{ Key: string, Value: string }[]">
	/// 	<description> Get response headers - returned array contain objects with Key (string) and Value (string) properties </description>
	/// </function>
	this.GetResponseHeaders = function()
	{
		var headers = [];

		if (httpRequest.getAllResponseHeaders() === "")
			return headers;

		Fit.Array.ForEach(Fit.String.Trim(httpRequest.getAllResponseHeaders()).split("\n"), function(h)
		{
			var info = h.split(":");
			Fit.Array.Add(headers, { Key: Fit.String.Trim(info[0]), Value: Fit.String.Trim(info[1]) });
		});

		return headers;
	}

	/// <function container="Fit.Http.Request" name="GetResponseHeader" access="public" returns="string | null">
	/// 	<description> Get response header (e.g. text/html) - returns Null if not found </description>
	/// 	<param name="key" type="string"> Header key (e.g. Content-Type) </param>
	/// </function>
	this.GetResponseHeader = function(key)
	{
		Fit.Validation.ExpectString(key);

		var headerValue = httpRequest.getResponseHeader(key);

		if (headerValue === "" && Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() < 10) // Legacy IE returns an empty string for non-existing headers - make sure it exists or return Null if it does not
		{
			var found = false;

			Fit.Array.ForEach(me.GetResponseHeaders(), function(header)
			{
				if (header.Key.toLowerCase() === key.toLowerCase())
				{
					found = true;
					return false; // Break loop
				}
			});

			headerValue = (found === true ? headerValue : null);
		}

		return headerValue;
	}

	// Events

	/// <function container="Fit.Http.RequestTypeDefs" name="EventHandler">
	/// 	<description> Request event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of request which triggered event </param>
	/// </function>

	/// <function container="Fit.Http.Request" name="OnStateChange" access="public">
	/// 	<description>
	/// 		Add function to invoke when request state is changed.
	/// 		Use GetCurrentState() to read the state at the given time.
	/// 	</description>
	/// 	<param name="func" type="Fit.Http.RequestTypeDefs.EventHandler">
	/// 		JavaScript function invoked when state changes.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnStateChange = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onStateChange, func);
	}

	this.SetStateListener = this.OnStateChange; // Backward compatibility

	/// <function container="Fit.Http.Request" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add function to invoke when request is initiated.
	/// 		Request can be canceled by returning False.
	/// 	</description>
	/// 	<param name="func" type="Fit.Http.RequestTypeDefs.EventHandler">
	/// 		JavaScript function invoked when request is initiated.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnRequest = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onRequestHandlers, func);
	}

	/// <function container="Fit.Http.Request" name="OnSuccess" access="public">
	/// 	<description> Add function to invoke when request is successful </description>
	/// 	<param name="func" type="Fit.Http.RequestTypeDefs.EventHandler">
	/// 		JavaScript function invoked when request finished successfully.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnSuccess = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onSuccessHandlers, func);
	}

	/// <function container="Fit.Http.Request" name="OnFailure" access="public">
	/// 	<description> Add function to invoke when request is unsuccessful </description>
	/// 	<param name="func" type="Fit.Http.RequestTypeDefs.EventHandler">
	/// 		JavaScript function invoked when request finished, but not successfully.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnFailure = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onFailureHandlers, func);
	}

	/// <function container="Fit.Http.Request" name="OnAbort" access="public">
	/// 	<description> Add function to invoke when request is canceled </description>
	/// 	<param name="func" type="Fit.Http.RequestTypeDefs.EventHandler">
	/// 		JavaScript function invoked when request is canceled.
	/// 		Fit.Http.Request instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnAbort = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onAbortHandlers, func);
	}

	/// <function container="Fit.Http.Request" name="RequestProperties" access="public" returns="object">
	/// 	<description>
	/// 		Set/get custom XHR request properties.
	/// 		Example of property object: { withCredentials: true, responseType: 'blob' }.
	/// 		How different browsers and versions support and handle custom properties differ:
	/// 		https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
	/// 		Full cross browser support is therefore not guaranteed.
	/// 	</description>
	/// 	<param name="propertyObject" type="object" default="undefined"> If specified, properties will be applied to XHR request when Start() is invoked </param>
	/// </function>
	this.RequestProperties = function(propertyObject)
	{
		Fit.Validation.ExpectObject(propertyObject, true);

		if (Fit.Validation.IsSet(propertyObject) === true)
		{
			customProperties = propertyObject;
		}

		return customProperties;
	}

	// Protected

	this._internal =
	{
		FireOnStateChange: function()
		{
			Fit.Array.ForEach(onStateChange, function(handler) { handler(me); });
		},

		FireOnSuccess: function()
		{
			Fit.Array.ForEach(onSuccessHandlers, function(handler) { handler(me); });
		},

		FireOnFailure: function()
		{
			Fit.Array.ForEach(onFailureHandlers, function(handler) { handler(me); });
		},

		FireOnAbort: function()
		{
			Fit.Array.ForEach(onAbortHandlers, function(handler) { handler(me); });
		},

		FireOnRequest: function()
		{
			var cancel = false;

			Fit.Array.ForEach(onRequestHandlers, function(handler)
			{
				if (handler(me) === false)
					cancel = true;
			});

			return cancel;
		},
	}

	// Private

	function getHttpRequestObject()
	{
		if (window.XMLHttpRequest) // Firefox, IE7, Chrome, Opera, Safari
			return new XMLHttpRequest();
		else if (window.ActiveXObject) // IE5, IE6
			return new ActiveXObject("Microsoft.XMLHTTP");

		throw new Error("Http Request object not supported");
	}

	function parseKeyValuePairs(formDataStr) // formDataStr = key1=val1&name=james&keyOnly&more=data
	{
		Fit.Validation.ExpectString(formDataStr);

		if (formDataStr === "")
			return {};

		var obj = {};
		var entries = formDataStr.split("&");

		Fit.Array.ForEach(entries, function(entry)
		{
			var kv = entry.split("=");
			obj[kv[0]] = (kv.length > 1 ? kv[1] : "");
		});

		return obj;
	}

	function getFormDataString(encode) // Returns form data in query string format: key1=val1&name=james&keyOnly=&more=data
	{
		Fit.Validation.ExpectBoolean(encode);

		var formDataStr = "";

		Fit.Array.ForEach((formData !== null ? formData : {}), function(key)
		{
			formDataStr += (formDataStr !== "" ? "&" : "") + key + "=" + (encode === true && formData[key].Encode === true ? encodeURIComponent(formData[key].Value) : formData[key].Value);
		});

		return formDataStr;
	}

	function ensureContentTypeHeaderForFormData() // Add content-type header for Form Data if content-type header has not already been defined
	{
		if (me.GetHeader("content-type") === null)
		{
			// https://www.w3.org/Protocols/rfc2616/rfc2616-sec7.html#sec7.2.1
			me.AddHeader("content-type", "application/x-www-form-urlencoded");
			customHeaders["content-type"]._ensured = true;
		}
	}

	init();
}

/// <container name="Fit.Http.JsonRequest" extends="Fit.Http.Request">
/// 	Asynchronous HTTP request functionality (AJAX/WebService)
/// 	optimized for exchanging data with the server in JSON format.
/// 	Extending from Fit.Http.Request.
///
/// 	// Example code
///
/// 	var http = new Fit.Http.JsonRequest(&quot;WebService.asmx/AddUser&quot;);
///
/// 	http.SetData({ Username: &quot;Jack&quot;, Password: &quot;Secret&quot; });
/// 	http.OnSuccess(function(sender)
/// 	{
/// 		&#160;&#160;&#160;&#160; var json = http.GetResponseJson();
/// 		&#160;&#160;&#160;&#160; alert(&quot;User created - server response: &quot; + json.Message);
/// 	});
///
/// 	http.Start();
/// </container>

/// <function container="Fit.Http.JsonRequest" name="JsonRequest" access="public">
/// 	<description>
/// 		Constructor - creates instance of JSON Request class.
/// 	</description>
/// 	<param name="url" type="string">
/// 		URL to request, e.g.
/// 		http://server/_layouts/15/Company/MyWebService.asmx/MyMethod
/// 	</param>
/// </function>
Fit.Http.JsonRequest = function(url)
{
	Fit.Validation.ExpectStringValue(url);
	Fit.Core.Extend(this, Fit.Http.Request).Apply(url);

	var me = this;

	function init()
	{
		me.AddHeader("Content-Type", "application/json; charset=UTF-8");
	}

	this.AddFormData = function(key, value, uriEncode)
	{
		Fit.Validation.ThrowError("Use SetData(..) to set JSON request data for JSON WebService");
	}

	/// <function container="Fit.Http.JsonRequest" name="GetResponseJson" access="public" returns="object | null">
	/// 	<description>
	/// 		Returns result from request as JSON object, Null if no response was returned.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 2xx (request successful).
	/// 		Notice: .NET usually wraps data in a .d property. Data is automatically extracted
	/// 		from this property, hence contained data is returned as the root object.
	/// 	</description>
	/// </function>
	this.GetResponseJson = Fit.Core.CreateOverride(this.GetResponseJson, function()
	{
		var resp = base();

		if (url.toLowerCase().indexOf(".asmx/") !== -1 && resp && resp.d)
			resp = resp.d; // Extract .NET response data

		return resp;
	});

	init();
}

/// <container name="Fit.Http.JsonpRequest">
/// 	JSONP (JSON with Padding) request functionality allowing for cross-domain data exchange.
///
/// 	// Example code
///
/// 	var http = new Fit.Http.JsonpRequest(&quot;GetUsers.php&quot;);
/// 	http.OnSuccess(function(r)
/// 	{
/// 		&#160;&#160;&#160;&#160; var data = http.GetResponse();
/// 		&#160;&#160;&#160;&#160; console.log(data);
/// 	});
/// 	http.Start();
/// </container>

/// <function container="Fit.Http.JsonpRequest" name="JsonpRequest" access="public">
/// 	<description> Constructor - creates instance of JsonpRequest class </description>
/// 	<param name="uri" type="string"> URL to request </param>
/// 	<param name="jsonpCallbackName" type="string" default="callback">
/// 		Name of URL parameter receiving name of JSONP callback function
/// 	</param>
/// </function>
Fit.Http.JsonpRequest = function(uri, jsonpCallbackName)
{
	Fit.Validation.ExpectStringValue(uri);
	Fit.Validation.ExpectStringValue(jsonpCallbackName, true);

	var me = this;
	var url = uri;
	var cbKey = ((Fit.Validation.IsSet(jsonpCallbackName) === true) ? jsonpCallbackName : "callback");
	var cbId = null;
	var data = {};
	var timeout = 30000;
	var timer = -1;
	var response = null;
	var aborted = false;

	var onRequestHandlers = [];
	var onSuccessHandlers = [];
	var onTimeoutHandlers = [];

	/// <function container="Fit.Http.JsonpRequest" name="Url" access="public" returns="string">
	/// 	<description> Get/set request URL </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, changes request URL to specified value </param>
	/// </function>
	this.Url = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			url = val;
		}

		return url;
	}

	/// <function container="Fit.Http.JsonpRequest" name="Callback" access="public" returns="string">
	/// 	<description> Get/set name of URL parameter receiving the name of the JSONP callback function </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, changes the name of the URL parameter to specified value </param>
	/// </function>
	this.Callback = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			cbKey = val;
		}

		return cbKey;
	}

	/// <function container="Fit.Http.JsonpRequest" name="Timeout" access="public" returns="integer">
	/// 	<description>
	/// 		Get/set request timeout in milliseconds.
	/// 		OnTimeout is fired if response is not received
	/// 		within specified amount of time. Defaults to 30000 ms.
	/// 	</description>
	/// 	<param name="val" type="string" default="undefined"> If defined, changes timeout to specified value </param>
	/// </function>
	this.Timeout = function(val)
	{
		Fit.Validation.ExpectInteger(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			timeout = val;
		}

		return timeout;
	}

	/// <function container="Fit.Http.JsonpRequest" name="Abort" access="public">
	/// 	<description> Abort request </description>
	/// </function>
	this.Abort = function()
	{
		aborted = true;
	}

	/// <function container="Fit.Http.JsonpRequest" name="SetParameter" access="public">
	/// 	<description> Set URL parameter </description>
	/// 	<param name="key" type="string"> URL parameter key </param>
	/// 	<param name="value" type="string"> URL parameter value </param>
	/// 	<param name="uriEncode" type="boolean" default="true">
	/// 		Set False to prevent value from being URI encoded to preserve special characters
	/// 	</param>
	/// </function>
	this.SetParameter = function(key, value, uriEncode)
	{
		Fit.Validation.ExpectStringValue(key);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(uriEncode, true);

		data[key] = ((uriEncode === false) ? value : encodeURIComponent(value).replace(/%20/g, "+"));
	}

	/// <function container="Fit.Http.JsonpRequest" name="GetParameter" access="public" returns="string | null">
	/// 	<description> Get URL parameter value - returns Null if parameter is not defined </description>
	/// 	<param name="key" type="string"> URL parameter key </param>
	/// </function>
	this.GetParameter = function(key)
	{
		Fit.Validation.ExpectString(key);

		var val = data[key];
		return ((val !== undefined) ? val : null);
	}

	/// <function container="Fit.Http.JsonpRequest" name="GetParameters" access="public" returns="string[]">
	/// 	<description> Get all URL parameter keys </description>
	/// </function>
	this.GetParameters = function()
	{
		var keys = [];

		Fit.Array.ForEach(data, function(key)
		{
			Fit.Array.Add(keys, key);
		});

		return keys;
	}

	/// <function container="Fit.Http.JsonpRequest" name="Start" access="public">
	/// 	<description> Invoke asynchroneus request </description>
	/// </function>
	this.Start = function()
	{
		aborted = false;

		// Fire OnRequest handlers

		if (fireEvent(onRequestHandlers) === false)
			return;

		response = null;

		// Handle situation where Start() is invoked multiple times before initial request is done processing.
		// Behave like Fit.Http.Request which cancels previous request.

		if (timer !== -1)
		{
			clearTimeout(timer);
			timer = -1;

			// Prevent OnSuccess handlers from executing if data is received after being canceled.
			// Request is not actually canceled, only ignored.
			// NOTICE: Do not remove callback - it would cause a JavaScript error if the situation described above occures.
			Fit._internal.Http.JsonpRequest.Callbacks[cbId] = function(response) { };
		}

		// Register callback

		cbId = "CB" + Fit.Data.CreateGuid(false);

		Fit._internal.Http.JsonpRequest.Callbacks[cbId] = function(resp)
		{
			clearTimeout(timer);
			timer = -1;

			response = resp;
			delete Fit._internal.Http.JsonpRequest.Callbacks[cbId];

			if (aborted === false)
			{
				fireEvent(onSuccessHandlers);
			}
		}

		// Configure timeout

		timer = setTimeout(function()
		{
			timer = -1;

			// Prevent OnSuccess handlers from executing if data is received after timeout is reached.
			// NOTICE: Do not remove callback - it would cause a JavaScript error if the situation described above occures.
			Fit._internal.Http.JsonpRequest.Callbacks[cbId] = function(response) { };

			if (aborted === false)
			{
				fireEvent(onTimeoutHandlers);
			}
		}, timeout);

		// Construct request URL

		var newUrl = url;
		var cbName = "Fit._internal.Http.JsonpRequest.Callbacks." + cbId;

		newUrl += ((newUrl.indexOf("?") === -1) ? "?" : "&") + cbKey + "=" + cbName;

		Fit.Array.ForEach(data, function(key)
		{
			newUrl += "&" + key + "=" + data[key];
		});

		// Inject script to invoke JSONP request

		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = newUrl;
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	/// <function container="Fit.Http.JsonpRequest" name="GetResponse" access="public" returns="object">
	/// 	<description> Get response returned from server </description>
	/// </function>
	this.GetResponse = function()
	{
		return response;
	}

	// Events

	/// <function container="Fit.Http.JsonpRequestTypeDefs" name="EventHandler">
	/// 	<description> JsonpRequest event handler </description>
	/// 	<param name="sender" type="Fit.Http.JsonpRequest"> Instance of JsonpRequest which triggered event </param>
	/// </function>

	/// <function container="Fit.Http.JsonpRequest" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add function to invoke when request is initiated.
	/// 		Request can be canceled by returning False.
	/// 	</description>
	/// 	<param name="func" type="Fit.Http.JsonpRequestTypeDefs.EventHandler">
	/// 		JavaScript function invoked when request is initiated.
	/// 		Fit.Http.JsonpRequest instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnRequest = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onRequestHandlers, func);
	}

	/// <function container="Fit.Http.JsonpRequest" name="OnSuccess" access="public">
	/// 	<description> Add function to invoke when request is successful </description>
	/// 	<param name="func" type="Fit.Http.JsonpRequestTypeDefs.EventHandler">
	/// 		JavaScript function invoked when request finished successfully.
	/// 		Fit.Http.JsonpRequest instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnSuccess = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onSuccessHandlers, func);
	}

	/// <function container="Fit.Http.JsonpRequest" name="OnTimeout" access="public">
	/// 	<description> Add function to invoke when request is unsuccessful due to timeout </description>
	/// 	<param name="func" type="Fit.Http.JsonpRequestTypeDefs.EventHandler">
	/// 		JavaScript function invoked when request timed out.
	/// 		Fit.Http.JsonpRequest instance is passed to function.
	/// 	</param>
	/// </function>
	this.OnTimeout = function(func)
	{
		Fit.Validation.ExpectFunction(func);
		Fit.Array.Add(onTimeoutHandlers, func);
	}

	function fireEvent(handlers)
	{
		var canceled = false; // Only OnRequest can be canceled!

		Fit.Array.ForEach(handlers, function(handler)
		{
			if (handler(me) === false)
				canceled = true;
		});

		return !canceled;
	}
}

Fit.Http.DotNetJsonRequest = Fit.Http.JsonRequest;
