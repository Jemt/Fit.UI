Tests.DomClass = function()
{
	var domElm = document.createElement("div");

	this.Description = "CSS classes can be added and removed from DOM elements";

	this.Execute = function()
	{
		Fit.Dom.AddClass(domElm, "UnitTestClass");
		Fit.Dom.AddClass(domElm, "AlternativeClass");
		Fit.Dom.AddClass(domElm, "AnotherClass");

		Fit.Dom.RemoveClass(domElm, "AlternativeClass");
	}

	this.Assertions =
	[
		{
			Message: "UnitTestClass and AnotherClass added",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Dom.HasClass(domElm, "UnitTestClass") && Fit.Dom.HasClass(domElm, "AnotherClass"));
			}
		},
		{
			Message: "AlternativeClass removed",
			Expected: false,
			GetResult: function()
			{
				return Fit.Dom.HasClass(domElm, "AlternativeClass");
			}
		}
	]
}

Tests.ComputedStyles = function()
{
	var domElm = document.createElement("div");
	document.body.appendChild(domElm);

	this.Description = "CSS applied using class names can be determined (computed styles)";

	this.Execute = function()
	{
		Fit.Dom.AddClass(domElm, "UnitTestFont");
		Fit.Dom.AddClass(domElm, "UnitTestBox");
	}

	//this.PostponeTest = 100; // Allow test on IE8 which requires JS thread to be released before interrogating object
	this.Assertions =
	[
		// UnitTestFont

		{
			Message: "Font family (font-family) is verdana",
			Expected: "verdana",
			GetResult: function()
			{
				return Fit.Dom.GetComputedStyle(domElm, "font-family");
			}
		},
		{
			Message: "Font size (font-size) is 14px",
			Expected: "14px",
			GetResult: function()
			{
				return Fit.Dom.GetComputedStyle(domElm, "font-size");
			}
		},
		{
			Message: "Font color (color) is #333333",
			Expected: "#333333",
			GetResult: function()
			{
				var color = Fit.Dom.GetComputedStyle(domElm, "color");

				if (color.indexOf("#") === 0)
				{
					return color;
				}
				else // RGB
				{
					var rgb = Fit.Color.ParseRgb(color);
					return Fit.Color.RgbToHex(rgb.Red, rgb.Green, rgb.Blue);
				}
			}
		},
		{
			Message: "Border is 1px solid #C0C0C0 (extracting border-left-width, borderLeftStyle, and borderLeftColor)",
			Expected: "1px solid #C0C0C0",
			GetResult: function()
			{
				var color = Fit.Dom.GetComputedStyle(domElm, "borderLeftColor");

				if (color.indexOf("#") === -1)
				{
					var rgb = Fit.Color.ParseRgb(color);
					color = Fit.Color.RgbToHex(rgb.Red, rgb.Green, rgb.Blue);
				}

				return Fit.Dom.GetComputedStyle(domElm, "border-left-width") + " " + Fit.Dom.GetComputedStyle(domElm, "borderLeftStyle") + " " + color.toUpperCase();
			}
		},
		{
			Message: "Padding top/right/bottom/left is 10px",
			Expected: "10px 10px 10px 10px",
			GetResult: function()
			{
				return Fit.Dom.GetComputedStyle(domElm, "padding-top") + " " + Fit.Dom.GetComputedStyle(domElm, "paddingRight") + " " + Fit.Dom.GetComputedStyle(domElm, "paddingBottom") + " " + Fit.Dom.GetComputedStyle(domElm, "padding-left");
			}
		}
	]

	this.Dispose = function()
	{
		Fit.Dom.Remove(domElm);
	}
}

Tests.ScrollingAndOverflowingParent = function()
{
	var div1 = document.createElement("div");
	div1.id = "div1";
	var div2 = document.createElement("div");
	div2.id = "div2";
	var div3 = document.createElement("div");
	div3.id = "div3";
	var div4 = document.createElement("div");
	div4.id = "div4";

	// Hierarchy:
	// <body>
	//     <div1>
	//         <div2>
	//             <div3>
	//                 <div4></div4>
	//             </div3>
	//         </div2>
	//     </div1>
	// </body>
	document.body.appendChild(div1);
	div1.appendChild(div2);
	div2.appendChild(div3);
	div3.appendChild(div4);

	var expected = [];
	var results = [];

	this.Description = "ScrollParent and OverflowingParent can be reliably determined";

	this.Execute = function()
	{
		// Test 1

		div1.style.cssText = "";
		div2.style.cssText = "";
		div3.style.cssText = "";
		div4.style.cssText = "";

		expected.push({
			ScrollParent: document.documentElement,
			OverflowParent: null
		});

		results.push({
			ScrollParent: Fit.Dom.GetScrollParent(div4),
			OverflowParent: Fit.Dom.GetOverflowingParent(div4)
		});

		// Test 2

		div1.style.cssText = "";
		div2.style.cssText = "overflow: auto; width: 100px; height: 30px;";
		div3.style.cssText = "";
		div4.style.cssText = "";

		expected.push({
			ScrollParent: div2,
			OverflowParent: div2
		});

		results.push({
			ScrollParent: Fit.Dom.GetScrollParent(div4),
			OverflowParent: Fit.Dom.GetOverflowingParent(div4)
		});

		// Test 3

		div1.style.cssText = "position: relative;";
		div2.style.cssText = "overflow: auto; width: 100px; height: 30px;";
		div3.style.cssText = "";
		div4.style.cssText = "";

		expected.push({
			ScrollParent: div2,
			OverflowParent: div2
		});

		results.push({
			ScrollParent: Fit.Dom.GetScrollParent(div4),
			OverflowParent: Fit.Dom.GetOverflowingParent(div4)
		});

		// Test 4

		div1.style.cssText = "position: relative;";
		div2.style.cssText = "overflow: auto; width: 100px; height: 30px;";
		div3.style.cssText = "";
		div4.style.cssText = "position: absolute;"; // Positioned relative to div1 - parent with overflow:auto will not affect its position when scrolled, so document is considered scroll parent

		expected.push({
			ScrollParent: document.documentElement,
			OverflowParent: div2
		});

		results.push({
			ScrollParent: Fit.Dom.GetScrollParent(div4),
			OverflowParent: Fit.Dom.GetOverflowingParent(div4)
		});

		// Test 5

		div1.style.cssText = "position: relative;";
		div2.style.cssText = "overflow: auto; width: 100px; height: 30px;";
		div3.style.cssText = "position: relative;";
		div4.style.cssText = "position: absolute;"; // Positioned relative to div3 which is statically positioned within div2, which therefore makes div2 the scroll parent

		expected.push({
			ScrollParent: div2,
			OverflowParent: div2
		});

		results.push({
			ScrollParent: Fit.Dom.GetScrollParent(div4),
			OverflowParent: Fit.Dom.GetOverflowingParent(div4)
		});

		// Test 6

		div1.style.cssText = "position: relative;";
		div2.style.cssText = "overflow: auto; width: 100px; height: 30px; position: relative;";
		div3.style.cssText = "";
		div4.style.cssText = "position: absolute;"; // Positioned relative to div2 which has both overflow and is positioned, and therefore makes div2 the scroll parent

		expected.push({
			ScrollParent: div2,
			OverflowParent: div2
		});

		results.push({
			ScrollParent: Fit.Dom.GetScrollParent(div4),
			OverflowParent: Fit.Dom.GetOverflowingParent(div4)
		});

		// Test 7

		div1.style.cssText = "position: relative;";
		div2.style.cssText = "overflow: auto; width: 100px; height: 30px; position: relative;";
		div3.style.cssText = "position: relative;";
		div4.style.cssText = "position: fixed;"; // Independent stacking context

		expected.push({
			ScrollParent: null,
			OverflowParent: null
		});

		results.push({
			ScrollParent: Fit.Dom.GetScrollParent(div4),
			OverflowParent: Fit.Dom.GetOverflowingParent(div4)
		});

		// Test 8

		div1.style.cssText = "position: relative;";
		div2.style.cssText = "overflow: auto; width: 100px; height: 30px; position: relative;";
		div3.style.cssText = "position: fixed;";
		div4.style.cssText = ""; // Part of independent stacking context (div3)

		expected.push({
			ScrollParent: null,
			OverflowParent: null
		});

		results.push({
			ScrollParent: Fit.Dom.GetScrollParent(div4),
			OverflowParent: Fit.Dom.GetOverflowingParent(div4)
		});

		// Test 9

		div1.style.cssText = "position: relative;";
		div2.style.cssText = "overflow: auto; width: 100px; height: 30px; position: fixed;";
		div3.style.cssText = "";
		div4.style.cssText = ""; // Part of independent stacking context (div2) that has overflow

		expected.push({
			ScrollParent: div2,
			OverflowParent: div2
		});

		results.push({
			ScrollParent: Fit.Dom.GetScrollParent(div4),
			OverflowParent: Fit.Dom.GetOverflowingParent(div4)
		});

		// Test 10

		div1.style.cssText = "position: relative;";
		div2.style.cssText = "overflow: auto; width: 100px; height: 30px; position: fixed;";
		div3.style.cssText = "";
		div4.style.cssText = "position: absolute;"; // Positioned relative to div2 which has both overflow and is positioned, and therefore makes div2 the scroll parent

		expected.push({
			ScrollParent: div2,
			OverflowParent: div2
		});

		results.push({
			ScrollParent: Fit.Dom.GetScrollParent(div4),
			OverflowParent: Fit.Dom.GetOverflowingParent(div4)
		});
	}

	this.Assertions =
	[
		{
			Message: "Test returns expected result for calls to GetScrollParent and GetOverflowingParent in different configurations",
			Expected: true,
			GetResult: function()
			{
				for (var i = 0 ; i < results.length ; i++)
				{
					if (expected[i].ScrollParent !== results[i].ScrollParent || expected[i].OverflowParent !== results[i].OverflowParent)
					{
						var err = "";
						err += "Result from Test " + (i + 1) + " is not as expected!\n";
						err += "Expected scroll parent = " + (expected[i].ScrollParent && expected[i].ScrollParent.id || "null") + "\n";
						err += "Expected overflow parent = " + (expected[i].OverflowParent && expected[i].OverflowParent.id || "null") + "\n";
						err += "Actual scroll parent = " + (results[i].ScrollParent && results[i].ScrollParent.id || "null") + "\n";
						err += "Actual overflow parent = " + (results[i].OverflowParent && results[i].OverflowParent.id || "null") + "\n";
						throw new Error(err);
					}
				}

				return true;
			}
		}
	]

	this.Dispose = function()
	{
		Fit.Dom.Remove(div1); // Contains div2, div3, and div4
	}
}

Tests.DomVisibility = function()
{
	// Visible
	var domElmNormalVisible = Fit.Dom.CreateElement("<div style=''>Test</div>");
	var domElmPositionAbsVisible = Fit.Dom.CreateElement("<div style='position: absolute;'>Test</div>");
	var domElmPositionFixVisible = Fit.Dom.CreateElement("<div style='position: fixed;'>Test</div>");
	var domElmVisibilityHidden = Fit.Dom.CreateElement("<div style='visibility: hidden;'>Test</div>");

	// Invisible
	var domElmNormalInvisible = Fit.Dom.CreateElement("<div style='display: none;'>Test</div>");
	var domElmPositionAbsInvisible = Fit.Dom.CreateElement("<div style='position: absolute; display: none;'>Test</div>");
	var domElmPositionFixInvisible = Fit.Dom.CreateElement("<div style='position: fixed; display: none;'>Test</div>");
	var domElmNormalNotMounted = Fit.Dom.CreateElement("<div style='display: block;'>Test</div>"); // Do not mount this!

	this.Description = "Visibility for DOM elements can be determined";

	this.Execute = function()
	{
		document.body.appendChild(domElmNormalVisible);
		document.body.appendChild(domElmPositionAbsVisible);
		document.body.appendChild(domElmPositionFixVisible);

		document.body.appendChild(domElmNormalInvisible);
		document.body.appendChild(domElmPositionAbsInvisible);
		document.body.appendChild(domElmPositionFixInvisible);

		document.body.appendChild(domElmVisibilityHidden);
	}

	this.Assertions =
	[
		// Visible DOM elements
		{
			Message: "Can determine visibility for mounted div with no styling",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Dom.IsVisible(domElmNormalVisible));
			}
		},
		{
			Message: "Can determine visibility for mounted div with position:absolute",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Dom.IsVisible(domElmPositionAbsVisible));
			}
		},
		{
			Message: "Can determine visibility for mounted div with position:fixed",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Dom.IsVisible(domElmPositionFixVisible));
			}
		},
		{
			Message: "Can determine visibility for div with visibility:hidden",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Dom.IsVisible(domElmVisibilityHidden));
			}
		},

		// Invisible DOM elements
		{
			Message: "Can determine visibility for mounted div with display:none",
			Expected: false,
			GetResult: function()
			{
				return (Fit.Dom.IsVisible(domElmNormalInvisible));
			}
		},
		{
			Message: "Can determine visibility for mounted div with position:absolute;display:none",
			Expected: false,
			GetResult: function()
			{
				return (Fit.Dom.IsVisible(domElmPositionAbsInvisible));
			}
		},
		{
			Message: "Can determine visibility for mounted div with position:fixed;display:none",
			Expected: false,
			GetResult: function()
			{
				return (Fit.Dom.IsVisible(domElmPositionFixInvisible));
			}
		},
		{
			Message: "Can determine visibility for div not mounted in DOM",
			Expected: false,
			GetResult: function()
			{
				return (Fit.Dom.IsVisible(domElmNormalNotMounted));
			}
		},
		{
			Message: "Performance for visibility lookups (50.000 iterations, all elements) - see time usage",
			Expected: true,
			GetResult: function()
			{
				var elements = [domElmNormalVisible, domElmPositionAbsVisible, domElmPositionFixVisible, domElmNormalInvisible, domElmPositionAbsInvisible, domElmPositionFixInvisible, domElmVisibilityHidden];

				for (var i = 0 ; i < 50000 ; i++)
				{
					for (var j = 0 ; j < elements.length ; j++)
					{
						Fit.Dom.IsVisible(elements[j]);
					}
				}

				return true;
			}
		},
	]

	this.Dispose = function()
	{
		Fit.Dom.Remove(domElmNormalVisible);
		Fit.Dom.Remove(domElmPositionAbsVisible);
		Fit.Dom.Remove(domElmPositionFixVisible);
		Fit.Dom.Remove(domElmVisibilityHidden);
		Fit.Dom.Remove(domElmNormalInvisible);
		Fit.Dom.Remove(domElmPositionAbsInvisible);
		Fit.Dom.Remove(domElmPositionFixInvisible);
	}
}

;(function()
{
	var structures = [ "div", "ul", "table" ];
	var boxSizing = [ "border-box", "content-box" ];
	var modes = [ [ false, false ], [ true, false ] ]; // [ [ false, false ], [ false, true ], [ true, false ], [ true, true ] ];
	var sizes = [ 0, 1, 2 ]; // 0 = no borders/margins/padding, 1 = use px, 2 = use em
	var positioning = [ "static", "relative", "absolute", "fixed", "static; display: none" ];

	Fit.Array.ForEach(structures, function(structure)
	{
		Fit.Array.ForEach(boxSizing, function(boxSize)
		{
			Fit.Array.ForEach(sizes, function(size)
			{
				Fit.Array.ForEach(modes, function(mode)
				{
					Fit.Array.ForEach(positioning, function(posParent)
					{
						Fit.Array.ForEach(positioning, function(posElement)
						{
							Tests["GetRelativePosition" + Fit.Data.CreateGuid(false)] = function()
							{
								Fit.Core.Extend(this, UnitTestHelper.Dom.GetRelativePosition).Apply(structure, posParent, posElement, boxSize, mode[0], mode[1], size);
							}
						});
					});
				});
			});
		});
	});
})();

/*Tests["GetRelativePosition" + Fit.Data.CreateGuid(false)] = function()
{
	Fit.Core.Extend(this, UnitTestHelper.Dom.GetRelativePosition).Apply("static", "relative", "border-box", true, true, true);
}*/

UnitTestHelper.Dom = {};
UnitTestHelper.Dom.GetRelativePosition = function(structure, parentPosition, elementPosition, boxSizing, bodyBorder, docRootMargin, size)
{
	var me = this;
	var domElm = null;
	var innerPos = null;
	var outerPos = null;
	var outerPos2 = null;
	var outerPosCheck = null;
	var outerPosCheck2 = null;

	this.Description = "GetRelativePosition works (structure: " + structure + ", parent: " + (parentPosition !== null ? parentPosition : "static") + ", element: " + (elementPosition !== null ? elementPosition : "static") + ", box-sizing: " + boxSizing + ", body border: " + (bodyBorder ? "true" : "false") + ", docroot margin: " + (docRootMargin ? "true" : "false") + ", unit sizing mode: " + (size === 0 ? "none" : (size === 1) ? "px" : "em") + ")";

	this.Execute = function()
	{
		// NOTICE: Do NOT use .style.cssText, as changing this property dynamically works poorly in older versions of IE

		// Border on body and margin on document root makes calculating relative positions difficult across different browsers
		if (bodyBorder === true)
		{
			if (size === 0)
			{
				document.body.style.border = "0px solid cyan";
				document.body.style.padding = "0px";
				document.body.style.margin = "0px;";
			}
			else if (size === 1)
			{
				document.body.style.border = "100px solid cyan";
				document.body.style.padding = "200px";
				document.body.style.margin = "400px;";
			}
			else if (size === 2)
			{
				document.body.style.border = "10em solid cyan";
				document.body.style.padding = "20em";
				document.body.style.margin = "40em;";
			}
		}
		if (docRootMargin === true)
		{
			if (size === 0)
			{
				document.documentElement.style.border = "0px solid brown";
				document.documentElement.style.padding = "0px";
				document.documentElement.style.margin = "0px";
			}
			else if (size === 1)
			{
				document.documentElement.style.border = "50px solid brown";
				document.documentElement.style.padding = "75px";
				document.documentElement.style.margin = "90px";
			}
			else if (size === 2)
			{
				document.documentElement.style.border = "5em solid brown";
				document.documentElement.style.padding = "7.5em";
				document.documentElement.style.margin = "9.0em";
			}
		}

		var style1 = "";
		var style2 = "";

		if (size === 1)
		{
			style2 = "box-sizing: " + boxSizing + "; border: 1px solid blue; padding: 2px; margin: 3px;";	// Parent
			style1 = "box-sizing: " + boxSizing + "; border: 10px solid red; padding: 20px; margin: 30px;";	// Element
		}
		else if (size === 2)
		{
			style2 = "box-sizing: " + boxSizing + "; border: 0.1em solid blue; padding: 0.2em; margin: 0.3em;";	// Parent
			style1 = "box-sizing: " + boxSizing + "; border: 1em solid red; padding: 2em; margin: 3em;";		// Element
		}

		var div = null;

		if (structure === "div")
		{
			div = Fit.Dom.CreateElement(""
				+ "<div style='" + style1 + "'>"
				+ "  <div style='" + style2 + " border-color: green; position: " + (parentPosition !== null ? parentPosition : "static") + ";'>" // Parent
				+ "    <div style='" + style1 + "'>"
				+ "      <div style='" + style2 + "'>"
				+ "        <div style='" + style1 + " border-color: orange; position: " + (elementPosition !== null ? elementPosition : "static") + ";' class='DomPosTestTargetElm'>" // Element
				+ "          <div style='" + style2 + "'>Hello world"
				+ "          </div>"
				+ "        </div>"
				+ "      </div>"
				+ "    </div>"
				+ "  </div>"
				+ "</div>"
			);
		}
		else if (structure === "ul")
		{
			div = Fit.Dom.CreateElement(""
				+ "<ul style='" + style1 + "'>"
				+ "  <li style='" + style2 + " position: " + (parentPosition !== null ? parentPosition : "static") + ";'><ul>" // Parent
				+ "    <li style='" + style1 + "'><ul>"
				+ "      <li style='" + style2 + "'><ul>"
				+ "        <li style='" + style1 + " border-width: 192px; position: " + (elementPosition !== null ? elementPosition : "static") + ";' class='DomPosTestTargetElm'><ul>" // Element
				+ "          <li style='" + style2 + "'>World, hello"
				+ "          </li>"
				+ "        </ul></li>"
				+ "      </ul></li>"
				+ "    </ul></li>"
				+ "  </ul></li>"
				+ "</ul></li>"
			);
		}
		else if (structure === "table")
		{
			div = Fit.Dom.CreateElement(""
				+ "<table border='20' cellspacing='30' cellpadding='70' style='position: " + (parentPosition !== null ? parentPosition : "static") + ";'>" // Parent
				+ "  <tr>"
				+ "    <td>Hello</td>"
				+ "    <td>World</td>"
				+ "  </tr>"
				+ "  <tr>"
				+ "    <td>Hello</td>"
				+ "    <td><div style='position: " + (elementPosition !== null ? elementPosition : "static") + ";' class='DomPosTestTargetElm'>World</td>" // Element
				+ "  </tr>"
				+ "</table>"
			);
		}

		var brs = Fit.Dom.CreateElement(""
			+ "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
			+ "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
			+ "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
			+ "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
			+ "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
			+ "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>");
		Fit.Dom.InsertAt(div, 0, brs);

		Fit.Dom.InsertAt(document.body, 0, div);
		domElm = div;

		var elm = div.querySelector(".DomPosTestTargetElm");

		var runWithJquery = false; // Make sure jQuery is loaded if variable is set to True (index.html)

		if (!UnitTestHelper.Dom.frameworkReported)
		{
			console.log("Framework used: " + (!runWithJquery ? "Fit.UI" : "jQuery"));
			UnitTestHelper.Dom.frameworkReported = true;
		}

		if (runWithJquery === false)
		{
			innerPos = Fit.Dom.GetRelativePosition(elm);
			outerPos = Fit.Dom.GetPosition(elm);
		}
		else
		{
			innerPos = { X: $(elm).position().left, Y: $(elm).position().top };
			outerPos = $(elm).offset();
		}

		outerPos2 = { Left: Math.round(elm.getBoundingClientRect().left), Top: Math.round(elm.getBoundingClientRect().top) }; // Round to make result comparable to result from Fit.UI

		// Position element within parent using position:absolute and coordinates just determined.
		// If position calculated is accurate, the element will not change position, although it will be taken out of flow.

		if (innerPos !== null) // Null if element is hidden
		{
			if (elementPosition !== "fixed")
				elm.style.position = "absolute";
			elm.style.left = innerPos.X + "px";
			elm.style.top = innerPos.Y + "px";
			elm.style.borderColor = "cyan";
		}

		if (runWithJquery === false)
		{
			outerPosCheck = Fit.Dom.GetPosition(elm);
		}
		else
		{
			outerPosCheck = $(elm).offset();
		}

		outerPosCheck2 = { Left: Math.round(elm.getBoundingClientRect().left), Top: Math.round(elm.getBoundingClientRect().top) };
	}

	//this.PostponeVerification = 15000;
	this.Assertions =
	[
		{
			Message: "Inner position calculated is correct",
			Expected: true,
			GetResult: function()
			{
				if (innerPos === null && outerPos === null)
					return true; // Element was hidden (display: none)

				if (Fit.Core.IsEqual(outerPos, outerPosCheck) !== true || Fit.Core.IsEqual(outerPos2, outerPosCheck2) !== true)
					console.log(me.Description + ": " + JSON.stringify(outerPos) + " [" + JSON.stringify(outerPos2) + "]  vs  " + JSON.stringify(outerPosCheck) + " [" + JSON.stringify(outerPosCheck2) + "] - " + ((Fit.Core.IsEqual(outerPos, outerPosCheck) === true) ? "Success" : "FAILED" + (size === 2 ? " (perhaps due to rounded off subpixels in which case test result is accepted)" : "")));

				// Subpixel problem:
				// Positions used to verify result is determined using getBoundingClientRect (within Fit.Dom.GetPosition(..))
				// which might return subpixel based values (floats) when elements are part of ordinary content flow.
				// These values are rounded off to integer values before returned from Fit.Dom.GetPosition(..).
				// Once the element has position/left/top set, the values returned from getBoundingClientRect
				// will be exact pixel coordinates since exact values were provided to left/top.
				// This might cause outerPos and outerPosCheck to be off by 1 pixel for both X and Y coordinate.

				if (size === 2)
				{
					// Obviously this is not perfect as it will not catch a bug causing incorrect positioning by 1 pixel for relative CSS units.
					// Fortunately we have hundredes of other test cases which is likely to catch such bugs.
					var check1 = ((outerPos.X === outerPosCheck.X || outerPos.X === outerPosCheck.X - 1 || outerPos.X === outerPosCheck.X + 1) && (outerPos.Y === outerPosCheck.Y || outerPos.Y === outerPosCheck.Y - 1 || outerPos.Y === outerPosCheck.Y + 1));
					var check2 = ((outerPos2.X === outerPosCheck2.X || outerPos2.X === outerPosCheck2.X - 1 || outerPos2.X === outerPosCheck2.X + 1) && (outerPos2.Y === outerPosCheck2.Y || outerPos2.Y === outerPosCheck2.Y - 1 || outerPos2.Y === outerPosCheck2.Y + 1));

					return (check1 && check2);
				}
				else
				{
					return Fit.Core.IsEqual(outerPos, outerPosCheck) && Fit.Core.IsEqual(outerPos2, outerPosCheck2);
				}
			}
		}
	]

	this.Dispose = function()
	{
		document.body.style.border = "";
		document.body.style.padding = "";
		document.body.style.margin = "";
		document.documentElement.style.border = "";
		document.documentElement.style.padding = "";
		document.documentElement.style.margin = "";

		Fit.Dom.Remove(domElm);
	}
}
