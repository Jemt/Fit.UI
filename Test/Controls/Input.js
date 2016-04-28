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
