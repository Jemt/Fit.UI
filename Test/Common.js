// ==========================================================================
// Test data
// ==========================================================================

UnitTestHelper = {};

;(function()
{
	// Generate various DOM elements useful for testing.
	// These are selected using querySelector[All](..)
	// further down.

	var div = document.createElement("div");
	div.id = "UnitTestData";
	div.style.display = "none";

	var span = document.createElement("span");
	span.innerHTML = "Hello world";
	div.appendChild(span);

	var list = document.createElement("ul");
	for (var i = i ; i <= 5 ; i++)
	{
		var item = document.createElement("li");
		item.innerHTML = "Item " + i;
		list.appendChild(item);
	}

	var input = new Fit.Controls.Input("UnitTestControl1");
	input.MultiLine(true);
	input.Maximizable(true);
	input.Render(div);

	document.body.appendChild(div);
})();

UnitTestHelper.TestValues =
[
	{
		Type: "integer",
		Values: [ -87473112, 0, 3487891 ]
	},
	{
		Type: "float",
		Values: [ -3286540.0214293, -1.00001, 1.00001, -1254892.45817 ]
	},
	{
		Type: "string",
		Values: [ "true", "false", "123", "hello world", (new Date()).toString(), "" ]
	},
	{
		Type: "boolean",
		Values: [ true, false ]
	},
	{
		Type: "null",
		Values: [ null ]
	},
	{
		Type: "undefined",
		Values: [ undefined ]
	},
	{
		Type: "string[]",
		Values: [ [ "true", "false", "123", "hello world", (new Date()).toString() ] ]
	},
	{
		Type: "integer[]",
		Values: [ [ -87473112, 0, 3487891 ] ]
	},
	{
		Type: "float[]",
		Values: [ [ -3286540.0214293, -1.00001, 1.00001, -1254892.45817 ] ]
	},
	{
		Type: "object[]",
		Values:
		[[
			{
				Title: "Root node 1",
				Value: "RN1",
				Children:
				[
					{
						Title: "Child node 1.1",
						Value: "CN1.1",
						Children:
						[
							{
								Title: "Child node 1.1.1",
								Value: "CN1.1.1",
								Children:
								[
									{
										Title: "Child node 1.1.1.1",
										Value: "CN1.1.1.1"
									},
									{
										Title: "Child node 1.1.1.2",
										Value: "CN1.1.1.2"
									},
									{
										Title: "Child node 1.1.1.3",
										Value: "CN1.1.1.3"
									}
								]
							},
							{
								Title: "Child node 1.1.2",
								Value: "CN1.1.2",
								Children:
								[
									{
										Title: "Child node 1.1.2.1",
										Value: "CN1.1.2.1"
									},
									{
										Title: "Child node 1.1.2.2",
										Value: "CN1.1.2.2"
									},
									{
										Title: "Child node 1.1.2.3",
										Value: "CN1.1.2.3"
									}
								]
							}
						],
					},
					{
						Title: "Child node 1.2",
						Value: "CN1.2",
						Children:
						[
							{
								Title: "Child node 1.2.1",
								Value: "CN1.2.1",
								Children:
								[
									{
										Title: "Child node 1.2.1.1",
										Value: "CN1.2.1.1"
									},
									{
										Title: "Child node 1.2.1.2",
										Value: "CN1.2.1.2"
									},
									{
										Title: "Child node 1.2.1.3",
										Value: "CN1.2.1.3"
									}
								]
							},
							{
								Title: "Child node 1.2.2",
								Value: "CN1.2.2",
								Children:
								[
									{
										Title: "Child node 1.2.2.1",
										Value: "CN1.2.2.1"
									},
									{
										Title: "Child node 1.2.2.2",
										Value: "CN1.2.2.2"
									},
									{
										Title: "Child node 1.2.2.3",
										Value: "CN1.2.2.3"
									}
								]
							}
						],
					},
				]
			},
		]]
	},
	{
		Type: "NodeList",
		Values: [ document.querySelectorAll("div.UnitTestData *"), document.querySelectorAll("div#NonExistingIdNothingFound") ]
	},
	{
		Type: "HTMLCollection",
		Values: [ document.body.children ]
	},
	{
		Type: "DOMElement",
		Values: [ document.body, document.createElement("div") ]
	},
	{
		Type: "TextNode",
		Values: [ document.createTextNode("Hello world") ]
	},
	{
		Type: "CommentNode",
		Values: [ document.createComment("Hello world") ]
	},
	{
		Type: "Fit.Controls.ControlBase",
		Values:
		[
			new Fit.Controls.Input("UnitTest1"),
			new Fit.Controls.TreeView("UnitTest2"),
			new Fit.Controls.CheckBox("UnitTest3"),
			new Fit.Controls.FilePicker("UnitTest4")
		]
	},
	{
		Type: "Fit.Controls.ControlBase[]",
		Values:
		[[
			new Fit.Controls.Input("UnitTest2-1"),
			new Fit.Controls.TreeView("UnitTest2-2"),
			new Fit.Controls.CheckBox("UnitTest2-3"),
			new Fit.Controls.FilePicker("UnitTest2-4")
		]]
	},
	{
		Type: "RegExp",
		Values: [ new RegExp("[A-Z]+", "i"), /[A-Z]+/i ]
	},
	{
		Type: "date",
		Values: [ new Date() ]
	},
	{
		Type: "object",
		Values: [ { A: "hello", B: new Date(), Val: true, Amount: 4852.00132810 }, {} ]
	},
	{
		Type: "function",
		Values: [ function() { alert(123456789); console.log(987654321); }, Fit.Validation.IsSet, alert ]
	},
	{
		Type: "window",
		Values: [ window ]
	}
];

UnitTestHelper.TestValues.GetType = function(type)
{
	for (var i = 0 ; i < UnitTestHelper.TestValues.length ; i++)
	{
		if (UnitTestHelper.TestValues[i].Type === type)
		{
			return UnitTestHelper.TestValues[i];
		}
	}

	return null;
}

UnitTestHelper.TestValues.GetTypes = function(types)
{
	var toReturn = [];

	Fit.Array.ForEach(UnitTestHelper.TestValues, function(tv)
	{
		if (Fit.Array.Contains(types, tv.Type) === true)
			Fit.Array.Add(toReturn, tv);
	});

	return toReturn;
}
