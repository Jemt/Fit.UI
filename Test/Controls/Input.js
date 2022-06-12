Tests.Dimensions = function()
{
	var inp = null;
	var width = 327;
	var height = 193;

	this.Description = "Make sure input control respect dimensions set";

	this.Execute = function()
	{
		inp = new Fit.Controls.Input("FitUiInputTest1");
		inp.MultiLine(true);
		inp.Width(width, "px");
		inp.Height(height, "px");
		inp.Render(document.body);
	}

	this.Assertions =
	[
		{
			Message: "Width is accurate",
			Expected: width,
			GetResult: function()
			{
				return inp.GetDomElement().offsetWidth;
			}
		},
		{
			Message: "Height is accurate",
			Expected: height,
			GetResult: function()
			{
				return inp.GetDomElement().offsetHeight;
			}
		}
	]

	this.Dispose = function()
	{
		inp.Dispose();
	}
}

Tests.Focus = function()
{
	Fit.Core.Extend(this, ControlBase.Focus).Apply(new Fit.Controls.Input("FitUiInputTest2"), "Input");
}

Tests.OnChange = function()
{
	Fit.Core.Extend(this, ControlBase.OnChange).Apply(new Fit.Controls.Input("FitUiInputTest3"), "Input");
}

Tests.HtmlEditorDirtyAndValueState = function()
{
	var dia = null;
	var values = [
		['Hello world', '<p>Hello world</p>'], // 0 = Test value and expected return value, 1 (optional) = expected alternative return value from UserValue()
		['<p>Hello world</p>'],
		['<p><u><em><strong>Hello</strong></em></u> world</p>'],
		['<p>Todo list:</p>\n\n<ol>\n\t<li>Buy snacks\n\t<ul>\n\t\t<li>At <em>least</em>&nbsp;one cake</li>\n\t\t<li>3 bags of chips</li>\n\t</ul>\n\t</li>\n\t<li>Buy drinks</li>\n\t<li>Clean house</li>\n</ol>\n\n<p>Make sure this is done by tomorrow.</p>\n\n<p>Powered by <a href="https://fitui.org" target="_blank">Fit.UI</a>.</p>'],
		['<p>See picture <img src="data:image/png;base64,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"></p>'],
		['<p>See picture <img style="margin-right:0.25em; float:left; height:2.09em; margin-bottom:0.25em; border:0.25em solid black; margin-left:0.25em; margin-top:0.25em; width:2em" alt="Pretty image" src="data:image/png;base64,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"></p>',
		 '<p>See picture <img alt="Pretty image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAYAAABTTPsKAAABfGlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGAqSSwoyGFhYGDIzSspCnJ3UoiIjFJgv8PAzcDDIMRgxSCemFxc4BgQ4MOAE3y7xsAIoi/rgsxK8/x506a1fP4WNq+ZclYlOrj1gQF3SmpxMgMDIweQnZxSnJwLZOcA2TrJBUUlQPYMIFu3vKQAxD4BZIsUAR0IZN8BsdMh7A8gdhKYzcQCVhMS5AxkSwDZAkkQtgaInQ5hW4DYyRmJKUC2B8guiBvAgNPDRcHcwFLXkYC7SQa5OaUwO0ChxZOaFxoMcgcQyzB4MLgwKDCYMxgwWDLoMjiWpFaUgBQ65xdUFmWmZ5QoOAJDNlXBOT+3oLQktUhHwTMvWU9HwcjA0ACkDhRnEKM/B4FNZxQ7jxDLX8jAYKnMwMDcgxBLmsbAsH0PA4PEKYSYyjwGBn5rBoZt5woSixLhDmf8xkKIX5xmbARh8zgxMLDe+///sxoDA/skBoa/E////73o//+/i4H2A+PsQA4AJHdp4IxrEg8AAAAJcEhZcwAAFiUAABYlAUlSJPAAAAGbaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQ0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjQ2PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CvSQNwsAAAAcaURPVAAAAAIAAAAAAAAAFwAAACgAAAAXAAAAFwAABNmNzJl9AAAEpUlEQVRoBayX229bRRDGv+O7j51LSyXahypBKAjaAL0AEg8gVUgVfwT3S/86HngoVUFCCAEpJAUVyTy0FCEIRaghgoaGOo4d833jneP1wQ4Oykq7s7M7M/s7c+as5aR/KekjwbD1w9TXJunu4XbS3db3JON9X8/bxTa5vX7QJTRPDNgDHZb0Q2OQaWO7rwCDj0A173EYBXaLScFjgAm2tux7tI9dRsLmN9wnyFgVsGC1lvTfZUkcUlMge4WcGE+AyrONfYqIwqeeWQfuoUjgdyYA+ynuHT+U72nN97mmwHvS2c2EQ2YaJpkex4vieDiXiue9jfo+wPmA/6HrAAPe4wGcF9kTh8xR5tQsskMqjpqESkHAu/0EG4WHCPz2hAyby3SDAnt2LcNyI1VhIDJwLasJOA+tGGomOXjMHte6hG2jhFZ58ZCAGb3HtGYfhk4mkaAMOtB5xsN2oJM2aAbLqR5ec8UT8J/JLH4pHsVK/RSB38pl2B/dvQex9h2V1Y5KIfjkQQtcsLAuPdqYM7SkPiwF4Hb5JD5uPIcv68+OAfZg00hGVjYUvBOkl0E+s9I96xNDKx439Q3o4bfRwN3CDK5Xl/DB7EV8Wz9L4DdzGZ4Y7d8bXrfdAKvXpyY4B5fupeDS4LWRa/6GJAW9XjyOtdoyVtKz+LzxDH6uLO4DrEdVs3c5mNro61QUeFe1y7mW/UD52C1hDsMQHsrBw7b5avDQ7aSGLWa3RcCPmi9ijcDf1xaxUTpC4Df+f4b1oe2wK8NxcyCv3Qw0GLkuVa7eHXqT19et8gKupU/hw5kXcKu2hHuFBjpJicCvHxzYDuCg7O5Q7lEKMgMJEwmHFowt+x6lx5HU2+kmZV5fKT+yE/giPY9rjXO4nj6JXysnaMxD2JL+awcHtlLQAeyCVi2LwzPr5MYW9jJwO5UD19V4xRqscP5K5nC3eAxf1Z/A+3MX0Kov4w+WwYNC1Ww1JP1XJwDrtBA0sw4T3QoqBcEKXmYxsIFGTrYnPb8RbHr8UdhBBeulY/i69jhWmNlPZ57HT9WF4DN0HADrRLXh+kDXmNtTNnfZH3SZYaVFLfh5WYwL49n3PQvLQbKdpNgqNLFaexTvzb2EG40z2Cwfx/1iM4tt5+io/itjMjwS1U0Hwe3OJWibwAI3Uw6S/trdfeipkwaa7+nB9c+hy/tko3gEN5nNzxpP4zJL4XbtMdqX2HkBukMINh545KShouurw2GHfeSXjUEVV1mM71/3VBY9w7ZmsHxDKoWkglZtAZdnL2CteR4/Vh/BZmk+OES0YXogYEGqFCR1pQlELSsFBlXc/A8DTbOmPenq9wpzWK/wI0tP48r8y7hZP42tYopOoZzZ5yfTASsj7PrQtgXMDDusCAWZdU2CLpnZSWEblIKuMOCH6kl8wo9rlb9i36Wn8FvlYd61+smJSiEOQJ+pgO2ODKXwt4AZxLgCnJeBr4VlA4wHnS3gbf4IbJRmcSNdwtX5i2ilZ/B7+ahlN7YfNx8Cx08SW/J03QZWCoRVlvXhWQtkDujgvufr0uUiP8k7/GH4prmM1eY563eY6fu8a/csu7Ie1waH/gMAAP//hyOpMwAABZZJREFUpVf7b1RFFD6z7/duLQVsIwIiWA1QlEBihFRrfP1gYnzrn+kvGgIBYlQMWEAKkYqLWrAIS7vb93Z3r983d869d18Y4yRzZ+bMOd/55uyZc+8a70vjyRMaN5ttkbVtkS2MLQg66Magq50iOFlM5W7Nbdpsmaw04nm5ld0n58qn5Wp+Su5m9kgtUfIB1W7g6DsxAeGIU6uPNUUeHpsg2mjCYceXcZ9ktVORuhRQxqajlWMNUxDbIfOZfXK5cETOV16VavaArMRy0jSJfgNGxDZF8NfG+2J4hDvw0kTfbImsoG/TK+xoGu3E7YalxG+UtyQlG7Gs3EmPyw+lE3K5OCU38i/KYmqnqvUT5o7P0elggegZ7/PhhEl2HamwgQgzym14jzkQJRx67J/pIRqxsjxI7pQrIPn16LTcxriMNNg0ad/IYuLBUY364axkMGEY0U5TgYRt7kIWd0DWB+Y6UtzrqyUJ2QaphdSYXAPJH4vH5FLlhCykn3EokSFIAZUpWtQD/Hmf9UeYectLsoY0WEbubjAV0BRTLxWhuuH8XKUu7ZsmL/VYUa4WDshXozNys3hEHiPSa7h4A5sFU8T/QLgNgqwIJNxASjA1bFVwWArJ9NA5CdiDYuxA2kZ0H8afkvnsXrlUOirnkArV7HMw4G+kR6ZVb1PQYYQ/7Y8wq8EqiLKUbWLecoQJbYk7H9GIQ8USppuWJGUTl2wuu0e+GX1driMV7mG+nKhAyR1RjXlKNl37q6FP40UI05bmG4jsElJh3V00xSSK4mpkubYunS2J1+MV+TO9S64UX5IzO96Sam5SVuMZabN8WeUIkIIrMJ08oRnvkzDCzDtGk6mw5KpD6KAbhYTZ1b8etgXhb3gZXBx5TWbLx+XX3EF5gEvXtqmAzYCYs1QAlQcHUH/0ErYuwiTL6K6i10GYqUF1LWWBGZwojPpjZNdjeamlSnK9cEjOjr4jt3nJEmVcskxgaic0VsNgpwdRl4EnX9F4H4cRZhmrIxVImJXB5i70eHi9JiQWdaZ+Od5PPy0/laZktvSyXCsflcX0BF4YSVxCWPcRUMtgg8hhU3GPmvE+MvZHoJypUNvyx20IuEE77USjHrs2zrdMRlYSRbmd2ycXccluoircy4zLUqKgav5oSTgmwU/v1t2aQ1fG+9B4jBpL1wrSoIa+DuK2OWZRwpRHSXNeS47JndwBuVo+It+PnJQFEF9BGrRM0sJ0PYblqvPVl+PBT+MrWML2FQySDfRl5i5SI0qyNwaK3TQplK8cqsCEXK6clOtIh/niQfk7tcMdi1R7rbvoD1hAP8xSt0+MCGFetBpylxFmKWM6sLwPcqVkidRAXV1M7UadnZQLY6elWpiUOtJgK4ZvhMBYJ1FLlRFF5VFZRK6/CEVopvWB8XjJHiJ3SZhkwbnvm0FhmT4d7G7j2/avzJj8jFo7Wz4m10ZekfuZCWKGzXJQIkBQEGoERFSoemoekUe2zPr7xmMqPOJlA1N+kWnr8geh3cJjyxTs19Zc8Xk5u+sN+aV0WJaTo7Iez6npv49DCTsCyqNHz9TeM14dhPlm42u4r0VOx/LU4TcCyM0X9iOyR+XS2Cn5PbcfZlSMKPcB9Qqga9UDZk4BaxVZSbeeufs2CDuy9gM9NAs9wIZVqM1LZnJyq/isnNk1I7cqU/IYH+WNOP7iDCNrSWFbSeha0XWt+yrvHV2kzdyMnxL8QtPSSF3aK4bO68kRW19nK4fl/O43pZo/ZA8RvlZ6vQxZk6SCK+EhqqHYVzRXpo3HF4YlhUevPbOEey3sVPN75dvd03Jj5Lj8gT+SNRxgeD0JXQ2cqSOC63ygYrfQfHfKeHwlqxFt1d6mAdYb8aI8SldkrvyCXBh/V6rFw9Kwfx75YlBtTP9vGwbFQ7n2DwAW8wDoPBqaAAAAAElFTkSuQmCC" style="border:0.25em solid black; float:left; height:2.09em; margin-bottom:0.25em; margin-left:0.25em; margin-right:0.25em; margin-top:0.25em; width:2em"></p>'],
		["See picture <img title='Hello' style=\"border: 0.5em solid red  ;  margin: 2em\" alt='Hello world' src='data:image/png;base64,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'>",
		 '<p>See picture <img alt="Hello world" src="data:image/png;base64,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" style="border:0.5em solid red; margin:2em"></p>'],
		["This snippet contains XHTML <br />", "<p>This snippet contains XHTML</p>"],
		["<p>This snippet contains XHTML <br /> indeed</p>", "<p>This snippet contains XHTML<br>\nindeed</p>"],
		["<p All this is invalid html></p>", ""],
		["This is <b invalid html</b>", "<p>This is</p>"],
		["<p>This is <b invalid html</b></p>", "<p>This is</p>"]
	];
	var tests = [];

	this.Description = "IsDirty(), Value(), UserValue() and OnChange(..) produce expected values for the HTML editor";

	this.Execute = function()
	{
		dia = new Fit.Controls.Dialog();
		dia.Title("HTML editor test running..");
		dia.Modal(true);
		dia.MaximumHeight(80, "%");
		dia.Open();

		// Create sets of tests where values are changed using the following approaches:
		//  - With Value(..) or UserValue(..)
		//    - With DesignMode enabled or with DesignMode disabled
		//      - With a clean editor or with an editor already holding a value
		// Test count: 2 * 2 * 2 * values.length

		var editorConfig =
		{
			Plugins:
			{
				Emojis: true,
				Images:
				{
					Enabled: true,
					EmbedType: "base64"
				}
			},
			Toolbar:
			{
				Images: true
			}
		};

		for (var i = 0 ; i < 2 ; i++)
		{
			var changeAsUser = i === 1;

			for (var j = 0 ; j < 2 ; j++)
			{
				var disableDesignMode = j === 1;

				for (var k = 0 ; k < 2 ; k++)
				{
					var setValueBeforeTest = k === 1;

					Fit.Array.ForEach(values, function(val)
					{
						var inp = new Fit.Controls.Input();
						inp.DesignMode(true, editorConfig);
						inp.Render(dia.GetContentDomElement());

						if (setValueBeforeTest === true)
						{
							inp.Value("Hello world " + Fit.Data.CreateGuid());
						}

						var expectedUserValue = val[0];
						var expectedDirtyValue = changeAsUser;

						if (disableDesignMode === false && val[1] !== undefined)
						{
							expectedUserValue = val[1];
						}

						var test = {
							Editor: inp,
							DisableDesignMode: disableDesignMode,
							InitValue: inp.Value(),
							Value: val[0],
							ChangeAsUser: changeAsUser,
							ExpectedUserValue: expectedUserValue,
							ExpectedDirty: expectedDirtyValue,
							Result: null,
							OnChangeResult: null
						};

						Fit.Array.Add(tests, test);

						inp.OnChange(function(sender)
						{
							test.OnChangeResult = sender.Value();
						});
					});
				}
			}
		}
	}

	this.PostponeVerification = 60000; // Allow HTML editors to fully load - if tests fail, try increasing this value - for some browsers 7.5 seconds is fine, other browsers require much more time

	this.Assertions =
	[
		{
			Message: "All tests results in expected values from Value(), UserValue(), IsDirty() and OnChange event",
			Expected: true,
			GetResult: function()
			{
				//console.log("Test count: " + tests.length);

				// NOTICE: Tests will fail if CKEditor does not have enough time to fully initialize !
				// In this case it will simply be an ordinary input field (not in DesignMode) handling
				// the test values, which has no knowledge about HTML.

				var returnValue = true;

				Fit.Array.ForEach(tests, function(test)
				{
					if (test.DisableDesignMode === true)
					{
						// Toggle to MultiLine to keep line breaks (\n)
						test.Editor.MultiLine(true);
					}

					var result = { Value: null, OnChangeValue: null, IsDirty: false };
					var expected = { Value: null, OnChangeValue: null, IsDirty: false };

					test.Result = result;

					if (test.ChangeAsUser === false)
					{
						test.Editor.Value(test.Value);

						result.Value = test.Editor.Value();
						result.IsDirty = test.Editor.IsDirty();
						result.OnChangeValue = test.OnChangeResult;

						expected.Value = test.Value; // Always the same return value when not changed by user
						expected.IsDirty = test.ExpectedDirty;
						expected.OnChangeValue = test.Value; // Always the same return value when not changed by user
					}
					else
					{
						// Calling UserValue(..) is equivalent to the user changing the value.
						// So the control is expected to become dirty (IsDirty() returns true),
						// and test values will have its HTML changed to adhere to the editors
						// Advanced Content Filter.

						test.Editor.UserValue(test.Value);

						result.Value = test.Editor.UserValue();
						result.IsDirty = test.Editor.IsDirty();

						expected.Value = test.ExpectedUserValue;
						expected.IsDirty = test.ExpectedDirty; // Always dirty when a new value has been assigned with UserValue(..) which is equal to the user making the change
					}

					if (Fit.Core.IsEqual(result, expected) === false)
					{
						returnValue = JSON.stringify(expected) + " !== " + JSON.stringify(result);

						// Calling functions to allow developer to step into
						// them for the purpose of debugging incorrect return values.

						// test.Editor.Value();
						// test.Editor.UserValue();
						// test.Editor.IsDirty();

						return false; // Break loop
					}
				});

				return returnValue;
			}
		}
	]

	this.Dispose = function()
	{
		dia.Dispose();

		Fit.Array.ForEach(tests, function(test)
		{
			test.Editor.Dispose();
		});
	}
}
