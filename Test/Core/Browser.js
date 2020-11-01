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
            var parsed = Fit.Browser.ParseUrl(test.Url);
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
}