Fit.Http = {};

// Use http://www.jsontest.com for testing

/// <function container="client/SMHttpRequest" name="SMHttpRequest" access="public">
/// 	<description> Constructor - creates instance of SMHttpRequest </description>
/// 	<param name="url" type="string"> URL to request </param>
/// 	<param name="async" type="boolean"> Value indicating whether to perform request asynchronous or not </param>
/// </function>
Fit.Http.Request = function(url, async) // url, true|false
{
	this.url = url;
	this.async = async;

	this.httpRequest = getHttpRequestObject();
	this.usingCustomHeaders = false;
	this.data = null;

	/// <function container="client/SMHttpRequest" name="AddHeader" access="public">
	/// 	<description>
	/// 		Add header to request.
	/// 		Manually adding headers will prevent the SMHttpRequest instance from
	/// 		manipulating headers. This is done to provide full control with the headers.
	/// 		You will in this case most likely need to add the following header for a POST request:
	/// 		Content-type : application/x-www-form-urlencoded
	/// 	</description>
	/// 	<param name="key" type="string"> Header key </param>
	/// 	<param name="value" type="string"> Header value </param>
	/// </function>
	this.AddHeader = function(key, value)
	{
		this.httpRequest.setRequestHeader(key, value)
		this.usingCustomHeaders = true;
	}

	/// <function container="client/SMHttpRequest" name="SetData" access="public">
	/// 	<description> Set data to post - this will change the request method from GET to POST </description>
	/// 	<param name="data" type="string"> Data to send </param>
	/// </function>
	this.SetData = function(data)
	{
		this.data = data;
	}

	/// <function container="client/SMHttpRequest" name="Start" access="public">
	/// 	<description> Invoke request </description>
	/// </function>
	this.Start = function()
	{
		var method = ((this.data === null || this.data === "") ? "GET" : "POST");
		this.httpRequest.open(method, this.url, this.async);

		if (method === "POST" && this.usingCustomHeaders === false)
			this.httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		this.httpRequest.send(this.data);
	}

	/// <function container="client/SMHttpRequest" name="GetResponseXml" access="public" returns="Document">
	/// 	<description>
	/// 		Returns result from request as XML or HTML document.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 200 (request successfull).
	/// 	</description>
	/// </function>
	this.GetResponseXml = function()
	{
		return this.httpRequest.responseXML;
	}

	/// <function container="client/SMHttpRequest" name="GetResponseText" access="public" returns="string">
	/// 	<description>
	/// 		Returns text result from request.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 200 (request successfull).
	/// 	</description>
	/// </function>
	this.GetResponseText = function()
	{
		return this.httpRequest.responseText;
	}

	/// <function container="client/SMHttpRequest" name="GetResponseJson" access="public" returns="object">
	/// 	<description>
	/// 		Returns result from request as JSON object.
	/// 		Return value will only be as expected if GetCurrentState() returns a value of 4
	/// 		(request done) and GetHttpStatus() returns a value of 200 (request successfull).
	/// 	</description>
	/// </function>
	this.GetResponseJson = function()
	{
		return JSON.parse(this.httpRequest.responseText);
	}

	/// <function container="client/SMHttpRequest" name="SetStateListener" access="public">
	/// 	<description>
	/// 		Set delegate to invoke when request state is changed.
	/// 		Use GetCurrentState() to read the state at the given time.
	/// 	</description>
	/// 	<param name="func" type="delegate"> JavaScript function invoked when state changes </param>
	/// </function>
	this.SetStateListener = function(func)
	{
		this.httpRequest.onreadystatechange = func;
	}

	/// <function container="client/SMHttpRequest" name="GetCurrentState" access="public" returns="integer">
	/// 	<description>
	/// 		Get current request state.
	/// 		0 = Unsent
	/// 		1 = Opened
	/// 		2 = Headers received
	/// 		3 = Loading
	/// 		4 = Done (response is ready for processing)
	/// 	</description>
	/// 	<param name="func" type="delegate"> JavaScript function invoked when state changes </param>
	/// </function>
	this.GetCurrentState = function() // 0 = unsent, 1 = opened, 2 = headers received, 3 = loading, 4 = done
	{
		return this.httpRequest.readyState;
	}

	/// <function container="client/SMHttpRequest" name="GetHttpStatus" access="public" returns="integer">
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
		return this.httpRequest.status;
	}

	function getHttpRequestObject()
	{
		if (window.XMLHttpRequest) // Firefox, IE7, Chrome, Opera, Safari
			return new XMLHttpRequest();
		else if (window.ActiveXObject) // IE5, IE6
			return new ActiveXObject("Microsoft.XMLHTTP");
		else
		{
			alert("Http Request object not supported");
			return null;
		}
	}
}
