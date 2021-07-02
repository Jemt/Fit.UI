Tests.SetGet = function()
{
	var testValue = (new Date()).getTime().toString();

	this.Description = "Create cookies: A (session cookie), B (expires in 1 sec.), C (alternative path)";

	this.Execute = function()
	{
		// NOTICE: Will NOT work on file:// - it will silently fail because cookies cannot be set on this protocol

		var cookies = UnitTestHelper.Cookies.GetCookieStore();
		cookies.Set("A", testValue);		// Session cookie
		cookies.Set("B", testValue, 1);		// Expires in 1 seconds
		Fit.Cookies.Set(cookies.Prefix() + "C", testValue, 5000, cookies.Path() + (cookies.Path() !== "/" ? "/" : "") + "sub/sub"); // Alternative path - not available to client once created due to path, although it will be visible in browser's cookie database in settings
		Fit.Cookies.Set({					// Session cookie with domain and path
			Name: cookies.Prefix() + "D",
			Value: "testing",
			Secure: false,
			Domain: Fit.Browser.ParseUrl(location.href).Host,
			Path: "/"
		});
	}

	this.PostponeVerification = 1500; // Allow cookie B to expire
	this.Assertions =
	[
		{
			Message: "Cookie A has been set and can be retrieved",
			Expected: testValue,
			GetResult: function()
			{
				var cookies = UnitTestHelper.Cookies.GetCookieStore();
				return cookies.Get("A");
			}
		},
		{
			Message: "Cookie B has expired and is no longer accessible",
			Expected: null,
			GetResult: function()
			{
				var cookies = UnitTestHelper.Cookies.GetCookieStore();
				return cookies.Get("B");
			}
		},
		{
			Message: "Cookie C is not accessible due to use of alternative path",
			Expected: null,
			GetResult: function()
			{
				var cookies = UnitTestHelper.Cookies.GetCookieStore();
				return Fit.Cookies.Get(cookies.Prefix() + "C");
			}
		},
		{
			Message: "Cookie D has been set and can be retrieved",
			Expected: "testing",
			GetResult: function()
			{
				var cookies = UnitTestHelper.Cookies.GetCookieStore();
				return Fit.Cookies.Get(cookies.Prefix() + "D");
			}
		}
	]

	this.Tests =
	{
		Remove: function()
		{
			this.Description = "Remove cookie A and D";

			this.Execute = function()
			{
				var cookies = UnitTestHelper.Cookies.GetCookieStore();
				cookies.Remove("A");

				Fit.Cookies.Remove({
					Name: cookies.Prefix() + "D",
					Domain: Fit.Browser.ParseUrl(location.href).Host,
					Path: "/"
				});
			}

			this.Assertions =
			[
				{
					Message: "Cookie A and D were removed",
					Expected: true,
					GetResult: function()
					{
						var cookies = UnitTestHelper.Cookies.GetCookieStore();
						return (cookies.Get("A") === null && Fit.Cookies.Get(cookies.Prefix() + "D") === null);
					}
				}
			]
		}
	}
}

UnitTestHelper.Cookies = {};
UnitTestHelper.Cookies.GetCookieStore = function()
{
	var cookies = new Fit.Cookies();
	cookies.Domain(Fit.Browser.ParseUrl(location.href).Host);
	cookies.Path("/");
	cookies.Prefix("FitUiUnitTest");
	return cookies;
}
