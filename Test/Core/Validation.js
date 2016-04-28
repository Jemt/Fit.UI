function createUnitTest(validationType, validationCallback, validTypes, extra)
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

createUnitTest("ExpectNumber", Fit.Validation.ExpectNumber, [ "integer", "float" ]);
createUnitTest("ExpectInteger", Fit.Validation.ExpectInteger, [ "integer" ]);
createUnitTest("ExpectString", Fit.Validation.ExpectString, [ "string" ]);
createUnitTest("ExpectBoolean", Fit.Validation.ExpectBoolean, [ "boolean" ]);
createUnitTest("ExpectDate", Fit.Validation.ExpectDate, [ "date" ]);
createUnitTest("ExpectArray", Fit.Validation.ExpectArray, [ "string[]", "integer[]", "float[]", "object[]", "Fit.Controls.ControlBase[]" ]);
createUnitTest("ExpectTypeArray (string)", Fit.Validation.ExpectTypeArray, [ "string[]" ], Fit.Validation.ExpectString);
createUnitTest("ExpectTypeArray (integer)", Fit.Validation.ExpectTypeArray, [ "integer[]" ], Fit.Validation.ExpectInteger);
createUnitTest("ExpectTypeArray (number)", Fit.Validation.ExpectTypeArray, [ "integer[]", "float[]" ], Fit.Validation.ExpectNumber);
createUnitTest("ExpectInstanceArray", Fit.Validation.ExpectInstanceArray, [ "Fit.Controls.ControlBase[]" ], Fit.Controls.ControlBase);
createUnitTest("ExpectCollection", Fit.Validation.ExpectCollection, [ "string[]", "integer[]", "float[]", "object[]", "Fit.Controls.ControlBase[]", "NodeList", "HTMLCollection" ]);
createUnitTest("ExpectRegExp", Fit.Validation.ExpectRegExp, [ "RegExp" ]);
createUnitTest("ExpectDomElement", Fit.Validation.ExpectDomElement, [ "DOMElement" ]);
createUnitTest("ExpectContentNode", Fit.Validation.ExpectContentNode, [ "DOMElement", "TextNode" ]);
createUnitTest("ExpectWindow", Fit.Validation.ExpectWindow, [ "window" ]);
createUnitTest("ExpectFunction", Fit.Validation.ExpectFunction, [ "function" ]);
createUnitTest("ExpectInstance", Fit.Validation.ExpectInstance, [ "Fit.Controls.ControlBase" ], Fit.Controls.ControlBase);

// Not covered: ExpectEventTarget, ExpectEvent, ExpectIsSet
