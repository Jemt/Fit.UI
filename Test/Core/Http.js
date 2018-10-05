Tests.RequestFormData = function()
{
	var req = null;

	this.Description = "Testing use of Form Data";

	this.Execute = function()
	{
		req = new Fit.Http.Request("localhost");

		req.SetData("Key1=Val1&Key2=Val2");
		req.AddFormData("Key3", "Val3 < Val4");
		req.AddFormData("Key4", "Val4 > Val3");
		req.AddFormData("Key 5", "Value & Value = Value");
		req.AddFormData("Hello world", "ABC");

		req.RemoveFormData("Key1");
		req.RemoveFormData("Hello world");
	}

	this.Assertions =
	[
		{
			Message: "Expected keys are present in Form Data collection",
			Expected: true,
			GetResult: function()
			{
				return (req.GetFormData("Key1") === null && req.GetFormData("Hello world") === null
						&& req.GetFormData("Key2") !== null && req.GetFormData("Key3") !== null && req.GetFormData("Key4") !== null && req.GetFormData("Key 5") !== null)
			}
		},
		{
			Message: "Expected values are present in Form Data collection",
			Expected: true,
			GetResult: function()
			{
				return (req.GetFormData("Key2") === "Val2" && req.GetFormData("Key3") === "Val3 < Val4" && req.GetFormData("Key4") === "Val4 > Val3" && req.GetFormData("Key 5") === "Value & Value = Value");
			}
		},
		{
			Message: "Expecting Form Data can be removed",
			Expected: null,
			GetResult: function()
			{
				req.ClearFormData();
				return req.GetData();
			}
		}
	]
}

Tests.RequestMethod = function()
{
	this.Description = "Testing Method and Async states";

	this.Execute = function()
	{
	}

	this.Assertions =
	[
		{
			Message: "Expecting Async. POST when data is set and OnSuccess handler is registered",
			Expected: "POST ASYNC",
			GetResult: function()
			{
				var req = new Fit.Http.Request("localhost");
				req.SetData({});
				req.OnSuccess(function(sender) {});

				return req.Method() + " " + (req.Async() === true ? "ASYNC" : "SYNC");
			}
		},
		{
			Message: "Expecting Sync. POST when data is set without any callbacks registered",
			Expected: "POST SYNC",
			GetResult: function()
			{
				var req = new Fit.Http.Request("localhost");
				req.SetData({});

				return req.Method() + " " + (req.Async() === true ? "ASYNC" : "SYNC");
			}
		},
		{
			Message: "Expecting Sync. GET when no data is set and no callbacks are registered",
			Expected: "GET SYNC",
			GetResult: function()
			{
				var req = new Fit.Http.Request("localhost");
				return req.Method() + " " + (req.Async() === true ? "ASYNC" : "SYNC");
			}
		},
		{
			Message: "Expecting Async. GET when no data is set but OnSuccess handler is registered",
			Expected: "GET ASYNC",
			GetResult: function()
			{
				var req = new Fit.Http.Request("localhost");
				req.OnSuccess(function(sender) {});

				return req.Method() + " " + (req.Async() === true ? "ASYNC" : "SYNC");
			}
		}
	]
}

Tests.RequestHeaders = function()
{
	var req = null;

	this.Description = "Testing Headers collection";

	this.Execute = function()
	{
		req = new Fit.Http.Request("localhost");
		req.AddHeader("Authorization", "Bearer MyAccessToken");
		req.AddFormData("NewUser", "My username");
		req.AddFormData("NewPass", "P@ssw0rD");
	}

	this.Assertions =
	[
		{
			Message: "Expecting Authorization header is set",
			Expected: "Bearer MyAccessToken",
			GetResult: function()
			{
				return req.GetHeader("AuthORizaTIoN"); // Case insensitive
			}
		},
		{
			Message: "Expecting Content-Type header is automatically added along with Form Data",
			Expected: "application/x-www-form-urlencoded",
			GetResult: function()
			{
				return req.GetHeader("conTENt-TYpE"); // Case insensitive
			}
		},
		{
			Message: "Expecting exactly three headers set (Content-Type, X-Requested-With, Authorization)",
			Expected: 3,
			GetResult: function()
			{
				return Fit.Array.Count(req.GetHeaders()); // Associative object array
			}
		},
		{
			Message: "Expecting header keys in same casing as provided to AddHeader(..)",
			Expected: "Authorization",
			GetResult: function()
			{
				var headers = req.GetHeaders();
				var found = null;

				Fit.Array.ForEach(headers, function(key)
				{
					if (key.toLowerCase() === "authorization")
					{
						found = key; // Expecting Authorization starting with Upper Case
						return false; // Break loop
					}
				});

				return found;
			}
		},
		{
			Message: "Expecting Content-Type header automatically added along with Form Data is removed when JSON data is set",
			Expected: true,
			GetResult: function()
			{
				req.SetData({}); // Removes all Form Data and removes Content-Type header
				return (req.GetHeader("Content-Type") === null);
			}
		},
		{
			Message: "Expecting ClearHeaders() to remove all headers",
			Expected: 0,
			GetResult: function()
			{
				req.ClearHeaders();
				return Fit.Array.Count(req.GetHeaders()); // Associative object array
			}
		},
		{
			Message: "Expecting Content-Type header manually set to be preserved when adding and removing Form Data",
			Expected: true,
			GetResult: function()
			{
				req.AddHeader("ContENT-typE", "test");
				req.AddFormData("Key", "Value");
				req.ClearFormData();

				return (req.GetHeader("content-TYPE") === "test");
			}
		}
	]
}