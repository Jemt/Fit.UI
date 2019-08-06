UnitTestHelper.Validation = {};
UnitTestHelper.Validation.CreateUnitTest = function(validationType, validationCallback, validTypes, extra)
{
	Fit.Array.ForEach(UnitTestHelper.TestValues, function(testObj)
	{
		var valueType = testObj.Type;
		var testValues = testObj.Values; //(testObj.Values ? testObj.Values : [ testObj.Value ]);

		Fit.Array.ForEach(testValues, function(testVal)
		{
			Tests[validationType + Fit.Data.CreateGuid(false)] = function()
			{
				this.ThrowsError = (Fit.Array.Contains(validTypes, valueType) === false);
				this.Description = validationType + " " + ((Fit.Array.Contains(validTypes, valueType) === false) ? "throws error" : "does NOT throw error") + " when " + valueType + " is passed (actual value passed: " + ((typeof(testVal) === "string") ? "\"" : "") + testVal + ((typeof(testVal) === "string") ? "\"" : "") + ")";
				this.Execute = function()
				{
					if (!extra)
						validationCallback(testVal); // e.g. ExpectBoolean
					else
						validationCallback(testVal, extra); // e.g. ExpectTypeArray or ExpectInstanceArray
				}
				this.Assertions = // Not used when ThrowsError is True
				[
					{
						Message: ((Fit.Array.Contains(validTypes, valueType) === true) ? "Expects no error to be thrown" : ""),
						Expected: true,
						GetResult: function() { return true; }
					}
				];
			}
		});
	});
}

UnitTestHelper.Validation.CreateUnitTest("ExpectNumber", Fit.Validation.ExpectNumber, [ "integer", "float" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectInteger", Fit.Validation.ExpectInteger, [ "integer" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectString", Fit.Validation.ExpectString, [ "string" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectBoolean", Fit.Validation.ExpectBoolean, [ "boolean" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectDate", Fit.Validation.ExpectDate, [ "date" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectArray", Fit.Validation.ExpectArray, [ "string[]", "integer[]", "float[]", "object[]", "Fit.Controls.ControlBase[]" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectTypeArray (string)", Fit.Validation.ExpectTypeArray, [ "string[]" ], Fit.Validation.ExpectString);
UnitTestHelper.Validation.CreateUnitTest("ExpectTypeArray (integer)", Fit.Validation.ExpectTypeArray, [ "integer[]" ], Fit.Validation.ExpectInteger);
UnitTestHelper.Validation.CreateUnitTest("ExpectTypeArray (number)", Fit.Validation.ExpectTypeArray, [ "integer[]", "float[]" ], Fit.Validation.ExpectNumber);
UnitTestHelper.Validation.CreateUnitTest("ExpectInstanceArray", Fit.Validation.ExpectInstanceArray, [ "Fit.Controls.ControlBase[]" ], Fit.Controls.ControlBase);
UnitTestHelper.Validation.CreateUnitTest("ExpectCollection", Fit.Validation.ExpectCollection, [ "string[]", "integer[]", "float[]", "object[]", "Fit.Controls.ControlBase[]", "NodeList", "HTMLCollection" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectRegExp", Fit.Validation.ExpectRegExp, [ "RegExp" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectElement", Fit.Validation.ExpectDomElement, [ "DOMElement" ]);
//UnitTestHelper.Validation.CreateUnitTest("ExpectCommentNode", Fit.Validation.ExpectCommentNode, [ "CommentNode" ]);
//UnitTestHelper.Validation.CreateUnitTest("ExpectTextNode", Fit.Validation.ExpectTextNode, [ "TextNode" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectNode", Fit.Validation.ExpectNode, [ "DOMElement", "XMLElement", "TextNode", "CommentNode" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectWindow", Fit.Validation.ExpectWindow, [ "window" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectFunction", Fit.Validation.ExpectFunction, [ "function" ]);
UnitTestHelper.Validation.CreateUnitTest("ExpectInstance", Fit.Validation.ExpectInstance, [ "Fit.Controls.ControlBase" ], Fit.Controls.ControlBase);

// Not covered: ExpectEventTarget, ExpectEvent, ExpectIsSet
