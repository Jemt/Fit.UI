ControlBase = {};

ControlBase.Focus = function(control, type)
{
	var me = this;

	this.Description = "Control of type " + type + " can gain focus"
	this.Execute = function()
	{
		Fit.Dom.Add(document.body, control.GetDomElement());
		control.Focused(true);
	}

	this.Assertions =
	[
		{
			Message: "Control has focus",
			Expected: true,
			GetResult: function()
			{
				return (control.Focused() === true && (control.GetDomElement() === document.activeElement || Fit.Dom.Contained(control.GetDomElement(), document.activeElement) === true));
			}
		}
	]

	this.Dispose = function()
	{
		control.Dispose();
	}
}

ControlBase.OnChange = function(control, type)
{
	var me = this;

	var dirty = false;
	var valid = false;
	var value = null;
	var focused = false;

	this.Description = "Control of type " + type + " can obtain correct state information from OnChange event when value is set programmatically"
	this.Execute = function()
	{
		Fit.Dom.Add(document.body, control.GetDomElement());
		control.OnChange(function(sender)
		{
			dirty = sender.IsDirty();	// Only dirty when user changes value through UI
			valid = sender.IsValid();	// Should return False - we assign an invalid value
			value = sender.Value();		// New value should be available now
			focused = sender.Focused();	// Should return True
		});
		control.SetValidationExpression(/^$/, "Invalid value - field should remain empty");
		control.Focused(true);
		control.Value("Test");
	}

	this.Assertions =
	[
		{
			Message: "Dirty state is False",
			Expected: false,
			GetResult: function()
			{
				return dirty;
			}
		},
		{
			Message: "Valid state is False",
			Expected: false,
			GetResult: function()
			{
				return valid;
			}
		},
		{
			Message: "Value is 'Test'",
			Expected: "Test",
			GetResult: function()
			{
				return ((value.indexOf("=") === -1) ? value : value.split("=")[1]);
			}
		},
		{
			Message: "Focused state is True",
			Expected: true,
			GetResult: function()
			{
				return focused;
			}
		}
	]

	this.Dispose = function()
	{
		control.Dispose();
	}
}
