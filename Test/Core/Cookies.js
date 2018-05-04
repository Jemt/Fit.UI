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
		Fit.Cookies.Set(cookies.Prefix() + "C", testValue, 5000, cookies.Path() + "/sub/sub"); // Alternative path
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
			Message: "Cookie C is not accessible due to use of alternative path (security policy)",
			Expected: null,
			GetResult: function()
			{
				var cookies = UnitTestHelper.Cookies.GetCookieStore();
				return Fit.Cookies.Get(cookies.Prefix() + "C");
			}
		}
	]

	this.Tests =
	{
		Remove: function()
		{
			this.Description = "Remove cookie A";

			this.Execute = function()
			{
				var cookies = UnitTestHelper.Cookies.GetCookieStore();
				cookies.Remove("A");
			}

			this.Assertions =
			[
				{
					Message: "Cookie A was removed",
					Expected: true,
					GetResult: function()
					{
						var cookies = UnitTestHelper.Cookies.GetCookieStore();
						return (cookies.Get("A") === null);
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
	cookies.Prefix("FitUiUnitTest");
	return cookies;
}
