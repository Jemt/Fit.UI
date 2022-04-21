Tests.ParseUrl = function()
{
	var tests =
	[
		{
			Url: "http://localhost",
			Protocol: "http",
			Port: -1,
			Auth: null,
			Host: "localhost",
			FullPath: "/",
			Path: "/",
			Resource: null,
			Parameters: {},
			Hash: null,
			Anchor: null, // Backwards compatibility
			_TestUrl: "http://localhost"
		},
		{
			Url: "https://localhost/",
			Protocol: "https",
			Port: -1,
			Auth: null,
			Host: "localhost",
			FullPath: "/",
			Path: "/",
			Resource: null,
			Parameters: {},
			Hash: null,
			Anchor: null, // Backwards compatibility
			_TestUrl: "https://localhost/"
		},
		{
			Url: "https://sitemagic.org/page1",
			Protocol: "https",
			Port: -1,
			Auth: null,
			Host: "sitemagic.org",
			FullPath: "/page1",
			Path: "/",
			Resource: "page1",
			Parameters: {},
			Hash: null,
			Anchor: null, // Backwards compatibility
			_TestUrl: "https://sitemagic.org/page1"
		},
		{
			Url: "http://localhost/page1.php?arg=val&parm=data#section",
			Protocol: "http",
			Port: -1,
			Auth: null,
			Host: "localhost",
			FullPath: "/page1.php",
			Path: "/",
			Resource: "page1.php",
			Parameters: { arg: "val", parm: "data" },
			Hash: "section",
			Anchor: "section", // Backwards compatibility
			_TestUrl: "http://localhost/page1.php?arg=val&parm=data#section"
		},
		{
			Url: "https://sitemagic.org/folder1/",
			Protocol: "https",
			Port: -1,
			Auth: null,
			Host: "sitemagic.org",
			FullPath: "/folder1/",
			Path: "/folder1/",
			Resource: null,
			Parameters: {},
			Hash: null,
			Anchor: null, // Backwards compatibility
			_TestUrl: "https://sitemagic.org/folder1/"
		},
		{
			Url: "http://sitemagic.org/?arg=val&parm=data#section",
			Protocol: "http",
			Port: -1,
			Auth: null,
			Host: "sitemagic.org",
			FullPath: "/",
			Path: "/",
			Resource: null,
			Parameters: { arg: "val", parm: "data" },
			Hash: "section",
			Anchor: "section", // Backwards compatibility
			_TestUrl: "http://sitemagic.org/?arg=val&parm=data#section"
		},
		{
			Url: "FTP://user:pass@sub.localhost:21/wwwroot/demo/",
			Protocol: "ftp",
			Port: 21,
			Auth: "user:pass",
			Host: "sub.localhost",
			FullPath: "/wwwroot/demo/",
			Path: "/wwwroot/demo/",
			Resource: null,
			Parameters: {},
			Hash: null,
			Anchor: null, // Backwards compatibility
			_TestUrl: "FTP://user:pass@sub.localhost:21/wwwroot/demo/"
		},
		{
			Url: "https://192.168.1.101:8030/sub/folder/hierarchy/index.php?parm=val&arg=data#calc",
			Protocol: "https",
			Port: 8030,
			Auth: null,
			Host: "192.168.1.101",
			FullPath: "/sub/folder/hierarchy/index.php",
			Path: "/sub/folder/hierarchy/",
			Resource: "index.php",
			Parameters: { parm: "val", arg: "data" },
			Hash: "calc",
			Anchor: "calc", // Backwards compatibility
			_TestUrl: "https://192.168.1.101:8030/sub/folder/hierarchy/index.php?parm=val&arg=data#calc"
		},
		{
			Url: "http://myToken@1.0.0.1/?parm=val",
			Protocol: "http",
			Port: -1,
			Auth: "myToken",
			Host: "1.0.0.1",
			FullPath: "/",
			Path: "/",
			Resource: null,
			Parameters: { parm: "val" },
			Hash: null,
			Anchor: null, // Backwards compatibility
			_TestUrl: "http://myToken@1.0.0.1/?parm=val"
		},
		{
			Url: "tel://12345678/#",
			Protocol: "tel",
			Port: -1,
			Auth: null,
			Host: "12345678",
			FullPath: "/",
			Path: "/",
			Resource: null,
			Parameters: {},
			Hash: "",
			Anchor: "", // Backwards compatibility
			_TestUrl: "tel://12345678/#"
		},
		{
			Url: "https://not:needed@sitemagic.org:443/sites/cms-guide/index.php?expand-menu#dummy",
			Protocol: "https",
			Port: 443,
			Auth: "not:needed",
			Host: "sitemagic.org",
			FullPath: "/sites/cms-guide/index.php",
			Path: "/sites/cms-guide/",
			Resource: "index.php",
			Parameters: { "expand-menu": "" },
			Hash: "dummy",
			Anchor: "dummy", // Backwards compatibility
			_TestUrl: "https://not:needed@sitemagic.org:443/sites/cms-guide/index.php?expand-menu#dummy"
		},
		{
			Url: "https://subsub.www.sitemagic.org/too/many/forward/slashes/res.php#Success",
			Protocol: "https",
			Port: -1,
			Auth: null,
			Host: "subsub.www.sitemagic.org",
			FullPath: "/too/many/forward/slashes/res.php",
			Path: "/too/many/forward/slashes/",
			Resource: "res.php",
			Parameters: {},
			Hash: "Success",
			Anchor: "Success", // Backwards compatibility
			_TestUrl: "https://subsub.www.sitemagic.org//too//many////forward/slashes//res.php#Success"
		}
		// Add IPv6 tests when supported!
		// http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]:8010/index.php
		// http://user:pass@[2001:0db8:85a3:0000:0000:8a2e:0370:7334]/index.php?par=val#test
	];

	var results = [];

	this.Description = "Can parse collection of test URLs";

	this.Execute = function()
	{
		Fit.Array.ForEach(tests, function(test)
		{
			var parsed = Fit.Browser.ParseUrl(test._TestUrl);
			parsed._TestUrl = test._TestUrl; // Make sure result object is equal to test case - otherwise every test will fail
			Fit.Array.Add(results, parsed);
		});
	}

	this.Assertions =
	[
		{
			Message: "All URLs (" + tests.length + ") parsed successfully",
			Expected: JSON.stringify(tests),
			GetResult: function()
			{
				return JSON.stringify(results);
			}
		}
	]
};

Tests.GetBrowserInfo = function()
{
	var tests =
	[
		{
			Name: "Internet Explorer 8",
			UserAgents:
			[
				"Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR 3.3.69573; WOW64; en-US)",
				"Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR",
				"Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; InfoPath.1; SV1; .NET CLR 3.8.36217; WOW64; en-US)",
				"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; MS-RTC LM 8; InfoPath.3; .NET4.0C; .NET4.0E) chromeframe/8.0.552.224"
			],
			ExpectedEngine: "MSIE",
			ExpectedAppName: "MSIE",
			ExpectedVersion: 8,
			ExpectedAppVersion: 8,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "Internet Explorer 11",
			UserAgents:
			[
				"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko",
				"Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko"
			],
			ExpectedEngine: "MSIE",
			ExpectedAppName: "MSIE",
			ExpectedVersion: 11,
			ExpectedAppVersion: 11,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "MS Edge 18 (legacy)",
			UserAgents:
			[
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582"
			],
			ExpectedEngine: "Edge",
			ExpectedAppName: "Edge",
			ExpectedVersion: 18,
			ExpectedAppVersion: 18,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "MS Edge 99",
			UserAgents:
			[
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/99.0.1150.36",
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 12_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/99.0.1150.36"
			],
			ExpectedEngine: "Chrome",
			ExpectedAppName: "Edge",
			ExpectedVersion: 100,
			ExpectedAppVersion: 99,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "MS Edge 97 on iPhone with iOS 15",
			UserAgents:
			[
				"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 EdgiOS/97.1072.69 Mobile/15E148 Safari/605.1.15"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Edge",
			ExpectedVersion: 15,
			ExpectedAppVersion: 97,
			ExpectedPhone: true,
			ExpectedTablet: false
		},
		{
			Name: "MS Edge 97 on Android 10 Phone",
			UserAgents:
			[
				"Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36 EdgA/97.0.1072.69"
			],
			ExpectedEngine: "Chrome",
			ExpectedAppName: "Edge",
			ExpectedVersion: 100,
			ExpectedAppVersion: 97,
			ExpectedPhone: true,
			ExpectedTablet: false
		},
		{
			Name: "Firefox 21",
			UserAgents:
			[
				"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:21.0) Gecko/20130331 Firefox/21.0",
				"Mozilla/5.0 (X11; Linux i686; rv:21.0) Gecko/20100101 Firefox/21.0",
				"Mozilla/5.0 (Windows NT 6.2; WOW64; rv:21.0) Gecko/20130514 Firefox/21.0",
				"Mozilla/5.0 (Windows NT 6.2; rv:21.0) Gecko/20130326 Firefox/21.0",
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:21.0) Gecko/20100101 Firefox/21.0"
			],
			ExpectedEngine: "Firefox",
			ExpectedAppName: "Firefox",
			ExpectedVersion: 21,
			ExpectedAppVersion: 21,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "Firefox 99",
			UserAgents:
			[
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0",
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 12.3; rv:99.0) Gecko/20100101 Firefox/99.0",
				"Mozilla/5.0 (X11; Linux i686; rv:99.0) Gecko/20100101 Firefox/99.0",
				"Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:99.0) Gecko/20100101 Firefox/99.0"
			],
			ExpectedEngine: "Firefox",
			ExpectedAppName: "Firefox",
			ExpectedVersion: 99,
			ExpectedAppVersion: 99,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "Firefox 98 on iPhone with iOS 15",
			UserAgents:
			[
				"Mozilla/5.0 (iPhone; CPU iPhone OS 15_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/98.2 Mobile/15E148 Safari/605.1.15"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Firefox",
			ExpectedVersion: 15,
			ExpectedAppVersion: 98,
			ExpectedPhone: true,
			ExpectedTablet: false
		},
		{
			Name: "Firefox 98 on iPad with iOS 13 (Request Desktop Website ENABLED (default) - identifies as Safari 13 on a Mac)",
			UserAgents:
			[
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Safari",
			ExpectedVersion: 13,
			ExpectedAppVersion: 13,
			ExpectedPhone: false,
			ExpectedTablet: false // This is a tablet, but the device does not identify as such - detect iPhone/iPad using: Fit.Browser.GetBrowser() === "Safari" && Fit.Browser.IsTouchEnabled()
		},
		{
			Name: "Firefox 99 on Android 12 Phone",
			UserAgents:
			[
				"Mozilla/5.0 (Android 12; Mobile; rv:68.0) Gecko/68.0 Firefox/99.0",
				"Mozilla/5.0 (Android 12; Mobile; LG-M255; rv:99.0) Gecko/99.0 Firefox/99.0"
			],
			ExpectedEngine: "Firefox",
			ExpectedAppName: "Firefox",
			ExpectedVersion: 99,
			ExpectedAppVersion: 99,
			ExpectedPhone: true,
			ExpectedTablet: false
		},
		{
			Name: "Chrome 12",
			UserAgents:
			[
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.30 (KHTML, like Gecko) Ubuntu/11.04 Chromium/12.0.742.112 Chrome/12.0.742.112 Safari/534.30",
				"Mozilla/5.0 (Windows NT 7.1) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.112 Safari/534.30",
				"Mozilla/5.0 (Windows 8) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.112 Safari/534.30",
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_4) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.112 Safari/534.30"
			],
			ExpectedEngine: "Chrome", // Actually Chrome 12 was based on WebKit but we consider all Chrome engines independent from WebKit
			ExpectedAppName: "Chrome",
			ExpectedVersion: 12,
			ExpectedAppVersion: 12,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "Chrome 100",
			UserAgents:
			[
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
				"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
				"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 12_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
			],
			ExpectedEngine: "Chrome",
			ExpectedAppName: "Chrome",
			ExpectedVersion: 100,
			ExpectedAppVersion: 100,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "Chrome 100 on iPhone",
			UserAgents:
			[
				"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/100.0.4896.85 Mobile/15E148 Safari/604.1"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Chrome",
			ExpectedVersion: 15,
			ExpectedAppVersion: 100,
			ExpectedPhone: true,
			ExpectedTablet: false
		},
		{
			Name: "Chrome 100 on iPad",
			UserAgents:
			[
				"Mozilla/5.0 (iPad; CPU OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/100.0.4896.85 Mobile/15E148 Safari/604.1"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Chrome",
			ExpectedVersion: 15,
			ExpectedAppVersion: 100,
			ExpectedPhone: false,
			ExpectedTablet: true
		},
		{
			Name: "Chrome 100 on Android 10 Phone",
			UserAgents:
			[
				"Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36",
				"Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36",
				"Mozilla/5.0 (Linux; Android 10; LM-Q720) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36"
			],
			ExpectedEngine: "Chrome",
			ExpectedAppName: "Chrome",
			ExpectedVersion: 100,
			ExpectedAppVersion: 100,
			ExpectedPhone: true,
			ExpectedTablet: false
		},
		{
			Name: "Chrome 18 on Android 4 Phone",
			UserAgents:
			[
				"Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19"
			],
			ExpectedEngine: "Chrome",
			ExpectedAppName: "Chrome",
			ExpectedVersion: 18,
			ExpectedAppVersion: 18,
			ExpectedPhone: true,
			ExpectedTablet: false
		},
		{
			Name: "Opera 12",
			UserAgents:
			[
				"Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16",
				"Opera/9.80 (Macintosh; Intel Mac OS X 10.14.1) Presto/2.12.388 Version/12.16",
				"Mozilla/5.0 (Windows NT 6.0; rv:2.0) Gecko/20100101 Firefox/4.0 Opera 12.14",
				"Opera/12.0(Windows NT 5.2;U;en)Presto/22.9.168 Version/12.00"
			],
			ExpectedEngine: "Opera",
			ExpectedAppName: "Opera",
			ExpectedVersion: 12,
			ExpectedAppVersion: 12,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "Opera 85",
			UserAgents:
			[
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 OPR/85.0.4341.18",
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 12_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 OPR/85.0.4341.18",
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 OPR/85.0.4341.18",
			],
			ExpectedEngine: "Chrome",
			ExpectedAppName: "Opera",
			ExpectedVersion: 100,
			ExpectedAppVersion: 85,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "Opera 2 on Android 10",
			UserAgents:
			[
				"Mozilla/5.0 (Linux; Android 10; PCT-AL10 Build/HUAWEIPCT-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36 OPT/2.8"
			],
			ExpectedEngine: "Chrome",
			ExpectedAppName: "Opera",
			ExpectedVersion: 83,
			ExpectedAppVersion: 2,
			ExpectedPhone: true,
			ExpectedTablet: false
		},
		{
			Name: "Opera 3 on iPhone",
			UserAgents:
			[
				"Mozilla/5.0 (iPhone; CPU iPhone OS 15_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 OPT/3.2.12"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Opera",
			ExpectedVersion: 15,
			ExpectedAppVersion: 3,
			ExpectedPhone: true,
			ExpectedTablet: false
		},
		{
			Name: "Opera 3 on iPad",
			UserAgents:
			[
				"Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 OPT/3.2.12"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Opera",
			ExpectedVersion: 14,
			ExpectedAppVersion: 3,
			ExpectedPhone: false,
			ExpectedTablet: true
		},
		{
			Name: "Safari 5",
			UserAgents:
			[
				"Mozilla/5.0 (X11; U; Linux x86_64; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/531.2+",
				"Mozilla/5.0 (Windows; U; Windows NT 6.1; ja-JP) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16",
				"Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_5_8; ja-jp) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Safari",
			ExpectedVersion: 5,
			ExpectedAppVersion: 5,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "Safari 15 on Mac",
			UserAgents:
			[
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 12_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Safari",
			ExpectedVersion: 15,
			ExpectedAppVersion: 15,
			ExpectedPhone: false,
			ExpectedTablet: false
		},
		{
			Name: "Safari 15 on iPhone",
			UserAgents:
			[
				"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Mobile/15E148 Safari/604.1"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Safari",
			ExpectedVersion: 15,
			ExpectedAppVersion: 15,
			ExpectedPhone: true,
			ExpectedTablet: false
		},
		{
			Name: "Safari 15 on iPhone (Request Desktop Website ENABLED (disabled by default) - identifies as Safari 15 on a Mac)",
			UserAgents:
			[
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15"
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Safari",
			ExpectedVersion: 15,
			ExpectedAppVersion: 15,
			ExpectedPhone: false, // This is a phone, but the device does not identify as such - detect iPhone/iPad using: Fit.Browser.GetBrowser() === "Safari" && Fit.Browser.IsTouchEnabled()
			ExpectedTablet: false
		},
		{
			Name: "Safari 15 on iPad (Request Desktop Website DISABLED (enabled by default) - identifies as Safari 15 on an iPad)",
			UserAgents:
			[
				"Mozilla/5.0 (iPad; CPU OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Mobile/15E148 Safari/604.1" // "Request desktop website" disabled (enabled by default)
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Safari",
			ExpectedVersion: 15,
			ExpectedAppVersion: 15,
			ExpectedPhone: false,
			ExpectedTablet: true
		},
		{
			Name: "Safari 13 on iPad with iOS 13 (Request Desktop Website ENABLED (default) - identifies as Safari 13 on a Mac)",
			UserAgents:
			[
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15" // "Request desktop website" enabled (enabled by default)
			],
			ExpectedEngine: "Safari",
			ExpectedAppName: "Safari",
			ExpectedVersion: 13,
			ExpectedAppVersion: 13,
			ExpectedPhone: false,
			ExpectedTablet: false // This is a tablet, but the device does not identify as such - detect iPhone/iPad using: Fit.Browser.GetBrowser() === "Safari" && Fit.Browser.IsTouchEnabled()
		}
	];

	this.Description = "Can reliably detect popular browsers from user agent strings";

	this.Execute = function()
	{
		// Keep original user agent information - restored later
		var orgUserAgent = Fit._internal.Browser.UserAgent;

		Fit.Array.ForEach(tests, function(test)
		{
			Fit.Array.ForEach(test.UserAgents, function(ua)
			{
				// Override user agent information used internally by e.g. Fit.Browser.GetInfo([boolean]).
				// This allows us to test Fit.Browser with different user agent information, rather than
				// using the browser's actual user agent string.
				Fit._internal.Browser.UserAgent = ua;

				// Make sure Fit.Browser.GetInfo([boolean]) does not return a cached result - user agent details changed above
				delete Fit._internal.Browser.Info;
				delete Fit._internal.Browser.AppInfo;

				// Get and verify engine info

				var info = Fit.Browser.GetInfo();

				if (info.Name !== test.ExpectedEngine)
				{
					test.Result = "Testing '" + test.Name + "' engine returned name '" + info.Name + "' but '" + test.ExpectedEngine + "' was expected";
					return;
				}

				if (info.Version !== test.ExpectedVersion)
				{
					test.Result = "Testing '" + test.Name + "' engine returned version '" + info.Version + "' but '" + test.ExpectedVersion + "' was expected";
					return;
				}

				if (info.IsPhone !== test.ExpectedPhone)
				{
					test.Result = "Testing '" + test.Name + "' engine returned IsPhone '" + info.IsPhone + "' but '" + test.ExpectedPhone + "' was expected";
					return;
				}

				if (info.IsTablet !== test.ExpectedTablet)
				{
					test.Result = "Testing '" + test.Name + "' engine returned IsTablet '" + info.IsTablet + "' but '" + test.ExpectedTablet + "' was expected";
					return;
				}

				// Get and verify application info

				var appInfo = Fit.Browser.GetInfo(true);

				if (appInfo.Name !== test.ExpectedAppName)
				{
					test.Result = "Testing '" + test.Name + "' app returned name '" + appInfo.Name + "' but '" + test.ExpectedAppName + "' was expected";
					return;
				}

				if (appInfo.Version !== test.ExpectedAppVersion)
				{
					test.Result = "Testing '" + test.Name + "' app returned version '" + appInfo.Version + "' but '" + test.ExpectedAppVersion + "' was expected";
					return;
				}

				// Make sure both engine info and app info is identical when name and version information is removed.
				// They should contain identical values for IsMobile, IsPhone, IsTablet, IsTouchEnabled, and Language.

				delete info.Name;
				delete info.Version;
				delete appInfo.Name;
				delete appInfo.Version;

				if (Fit.Core.IsEqual(info, appInfo) === false)
				{
					test.Result = "Parsed Engine Info and App Info differed for '" + test.Name + "' when ignoring Name and Version info - unexpected!";
					return;
				}

				test.Result = "OK";
			});
		});

		// Restore original user agent information (actual browser's user agent string)
		Fit._internal.Browser.UserAgent = orgUserAgent;
	}

	var assertions = [];
	Fit.Array.ForEach(tests, function(test)
	{
		assertions.push(
		{
			Message: test.Name + " (" + test.UserAgents.length + " user agent string(s)) successfully parsed",
			Expected: "OK",
			GetResult: function()
			{
				return test.Result;
			}
		});
	});

	this.Assertions = assertions;
};