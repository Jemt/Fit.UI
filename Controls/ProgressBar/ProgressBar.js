/// <container name="Fit.Controls.ProgressBar" extends="Fit.Controls.Component">
/// 	ProgressBar control useful for indicating progress.
/// </container>

/// <function container="Fit.Controls.ProgressBar" name="ProgressBar" access="public">
/// 	<description> Create instance of ProgressBar control </description>
/// 	<param name="controlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.ProgressBar = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);
	Fit.Core.Extend(this, Fit.Controls.Component).Apply(controlId);

	// Internals

	var me = this;
	var id = me.GetId();
	var element = me.GetDomElement();
	var status = null;
	var title = "";
	var width = { Value: 200, Unit: "px" }; // Any changes to this line must be dublicated to Width(..)
	var onProgressHandlers = [];

	function init()
	{
		Fit.Dom.AddClass(element, "FitUiControl");
		Fit.Dom.AddClass(element, "FitUiControlProgressBar");

		status = document.createElement("div");
		status.style.width = "0%";
		Fit.Dom.AddClass(status, "FitUiControlProgressBarStatus");
		Fit.Dom.Add(element, status);

		title = document.createElement("span");
		Fit.Dom.Add(status, title);
	}

	/// <function container="Fit.Controls.ProgressBar" name="Title" access="public" returns="string">
	/// 	<description> Get/set title in progress bar </description>
	/// 	<param name="val" type="string" default="undefined"> If specified, title will be set to specified value </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			title.innerHTML = val;
		}

		return title.innerHTML;
	}

	/// <function container="Fit.Controls.ProgressBar" name="Width" access="public" returns="Fit.TypeDefs.CssValue">
	/// 	<description> Get/set control width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="Fit.TypeDefs.CssUnit" default="px"> If defined, control width is updated to specified CSS unit </param>
	/// </function>
	this.Width = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				width = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				element.style.width = width.Value + width.Unit;
			}
			else
			{
				width = { Value: 200, Unit: "px" }; // Any changes to this line must be dublicated to line declaring the width variable !
				element.style.width = "";
			}
		}

		return width;
	}

	/// <function container="Fit.Controls.ProgressBar" name="Progress" access="public" returns="integer">
	/// 	<description> Get/set progress - a value between 0 and 100 </description>
	/// 	<param name="val" type="integer" default="undefined"> If defined, progress is set to specified value (0-100) </param>
	/// </function>
	this.Progress = function(val)
	{
		Fit.Validation.ExpectInteger(val, true);

		if (Fit.Validation.IsSet(val) === true && val >= 0 && val <= 100 && status.style.width !== val + "%")
		{
			status.style.width = val + "%";

			// Fire OnProgress event

			Fit.Array.ForEach(onProgressHandlers, function(cb)
			{
				cb(me);
			});
		}

		return parseInt(status.style.width);
	}

	/// <function container="Fit.Controls.ProgressBarTypeDefs" name="ProgressEventHandler">
	/// 	<description> Progress event handler </description>
	/// 	<param name="sender" type="Fit.Controls.ProgressBar"> Instance of ProgressBar </param>
	/// </function>

	/// <function container="Fit.Controls.ProgressBar" name="OnProgress" access="public">
	/// 	<description> Set callback function invoked when progress is changed </description>
	/// 	<param name="cb" type="Fit.Controls.ProgressBarTypeDefs.ProgressEventHandler">
	/// 		Event handler invoked when progress is changed - takes progress bar instance as argument
	/// 	</param>
	/// </function>
	this.OnProgress = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onProgressHandlers, cb);
	}

	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		me = id = element = status = title = width = onProgressHandlers = null;
		base();
	});

	init();
}
