Tests.CreateGuid = function()
{
	var guids = {};
	var duplicates = [];

	this.Description = "Create 2 million unique GUIDs";

	this.Execute = function()
	{
		var g = null;

		for (var i = 0 ; i < 2000000 ; i++)
		{
			g = Fit.Data.CreateGuid();

			if (guids[g] === undefined)
				guids[g] = 1;
			else
				duplicates.push(g);
		}
	}

	this.Assertions =
	[
		{
			Message: "2 million unique GUIDs produced",
			Expected: 2000000,
			GetResult: function()
			{
				return Fit.Array.Count(guids);
			}
		},
		{
			Message: "No duplicates produced",
			Expected: 0,
			GetResult: function()
			{
				return duplicates.length;
			}
		},
		{
			Message: "All GUIDs produced comforms to the format specified in version 4 (casing ignored)",
			Expected: true,
			GetResult: function()
			{
				var regEx = /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}/i;

				Fit.Array.ForEach(guids, function(guid)
				{
					if (regEx.test(guid) === false)
					{
						throw "GUID '" + guid + "' is not formatted according to the specification"
					}
				});

				return true;
			}
		}
	]
}

Tests.MathRound = function()
{
	this.Description = "Fit.Math.Round round numbers to the expected precision";

	this.Execute = function()
	{
	}

	this.Assertions =
	[
		{
			Message: "1.23456 with precision of 3 decimals is 1.235",
			Expected: 1.235,
			GetResult: function()
			{
				return Fit.Math.Round(1.23456, 3);
			}
		},
		{
			Message: "0.000001 with precision of 3 decimals is 0",
			Expected: 0,
			GetResult: function()
			{
				return Fit.Math.Round(0.000001, 3);
			}
		},
		{
			Message: "14 with precision of 3 decimals is 14",
			Expected: 14,
			GetResult: function()
			{
				return Fit.Math.Round(14, 3);
			}
		},
		{
			Message: "-14.999 with precision of 1 decimal is -15",
			Expected: -15,
			GetResult: function()
			{
				return Fit.Math.Round(-14.999, 1);
			}
		},
		{
			Message: "-0.099 with precision of 2 decimals is 0.1",
			Expected: -0.1,
			GetResult: function()
			{
				return Fit.Math.Round(-0.099, 2);
			}
		}
	]
}

Tests.NumberFormat = function()
{
	this.Description = "Fit.Math.Format format numbers with given number of decimals";

	this.Execute = function()
	{
	}

	this.Assertions =
	[
		{
			Message: "1.23456 with precision of 3 decimals is 1.235",
			Expected: "1.235",
			GetResult: function()
			{
				return Fit.Math.Format(1.23456, 3);
			}
		},
		{
			Message: "0.000001 with precision of 3 decimals is 0.000",
			Expected: "0.000",
			GetResult: function()
			{
				return Fit.Math.Format(0.000001, 3);
			}
		},
		{
			Message: "14 with precision of 3 decimals is 14.000",
			Expected: "14.000",
			GetResult: function()
			{
				return Fit.Math.Format(14, 3);
			}
		},
		{
			Message: "-14.999 with precision of 1 decimal is -15.0",
			Expected: "-15.0",
			GetResult: function()
			{
				return Fit.Math.Format(-14.999, 1);
			}
		},
		{
			Message: "-0.099 with precision of 2 decimals is 0.10",
			Expected: "-0.10",
			GetResult: function()
			{
				return Fit.Math.Format(-0.099, 2);
			}
		},
		{
			Message: "0 with precision of 2 decimals is 0.00",
			Expected: "0.00",
			GetResult: function()
			{
				return Fit.Math.Format(0, 2);
			}
		}
	]
}

Tests.StringTrim = function()
{
	var testString = " \t\r\nHello\nWorld \t\r\n   ";
	var expected = "Hello\nWorld";

	var testString2 = "ABCDEFG\nHIJKLMN\tOPQRSTU     VWXYZ "; // Trailing space is a non-breaking space (OSX: ALT + Space)

	this.Description = "Fit.String.Trim removes leading and trailing whitespaces";

	this.Execute = function()
	{
	}

	this.Assertions =
	[
		{
			Message: "All whitespaces are removed from string (tabs, line breaks, spaces)",
			Expected: expected,
			GetResult: function()
			{
				return Fit.String.Trim(testString);
			}
		},
		{
			Message: "All whitespaces are preserved within string",
			Expected: testString2,
			GetResult: function()
			{
				return Fit.String.Trim(testString2);
			}
		}
	]
}

Tests.StringStripHtml = function()
{
	var testString = "<b>Hello world</b>, What a <span style=\"color: orange\">beautiful</span> morning <script>alert(123);</script>";
	var expected = "Hello world, What a beautiful morning alert(123);";

	var testString2 = "&lt;b&gt;Hello world&lt;/b&gt;, What a &lt;span style=\"color: orange\"&gt;beautiful&lt;/span&gt; morning &lt;script&gt;alert(123);&lt;/script&gt;";

	this.Description = "Fit.String.StripHtml removes all HTML elements";

	this.Execute = function()
	{
	}

	this.Assertions =
	[
		{
			Message: "All HTML elements are removed from string",
			Expected: expected,
			GetResult: function()
			{
				return Fit.String.StripHtml(testString);
			}
		},
		{
			Message: "HTML entities are preserved within string",
			Expected: testString2,
			GetResult: function()
			{
				return Fit.String.StripHtml(testString2);
			}
		}
	]
}

Tests.DateFormat = function()
{
	var testDate = new Date(2016, 10, 26, 15, 17, 59);
	var testDate2 = new Date(2009, 0, 09, 0, 1, 9);

	this.Description = "Fit.DateFormat formats DateTimes (" + testDate + " and " + testDate2 + ") according to format";

	this.Execute = function()
	{
	}

	this.Assertions =
	[
		// Test 1

		{
			Message: testDate + ": YYYY-MM-DD produces 2016-11-26",
			Expected: "2016-11-26",
			GetResult: function()
			{
				return Fit.Date.Format(testDate, "YYYY-MM-DD");
			}
		},
		{
			Message: testDate + ": hh:mm:ss produces 15:17:59",
			Expected: "15:17:59",
			GetResult: function()
			{
				return Fit.Date.Format(testDate, "hh:mm:ss");
			}
		},
		{
			Message: testDate + ": DD-MM/YY hh:mm produces 26-11/16 15:17",
			Expected: "26-11/16 15:17",
			GetResult: function()
			{
				return Fit.Date.Format(testDate, "DD-MM/YY hh:mm");
			}
		},
		{
			Message: testDate + ": M|D/Y h:m:s produces 11|26/16 15:17:59",
			Expected: "11|26/16 15:17:59",
			GetResult: function()
			{
				return Fit.Date.Format(testDate, "M|D/Y h:m:s");
			}
		},

		// Test 2
		{
			Message: testDate2 + ": YYYY-MM-DD produces 2009-01-09",
			Expected: "2009-01-09",
			GetResult: function()
			{
				return Fit.Date.Format(testDate2, "YYYY-MM-DD");
			}
		},
		{
			Message: testDate2 + ": hh:mm:ss produces 00:01:09",
			Expected: "00:01:09",
			GetResult: function()
			{
				return Fit.Date.Format(testDate2, "hh:mm:ss");
			}
		},
		{
			Message: testDate2 + ": DD-MM/YY hh:mm produces 09-01/09 00:01",
			Expected: "09-01/09 00:01",
			GetResult: function()
			{
				return Fit.Date.Format(testDate2, "DD-MM/YY hh:mm");
			}
		},
		{
			Message: testDate2 + ": M|D/Y h:m:s produces 1|9/9 0:1:9",
			Expected: "1|9/9 0:1:9",
			GetResult: function()
			{
				return Fit.Date.Format(testDate2, "M|D/Y h:m:s");
			}
		}
	]
}

// Missing: Fit.String.Hash, Fit.Color.*, Fit.Date.GetWeek, and Fit.String.[Encode/Decode]Html
