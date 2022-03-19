/// <container name="Fit.Controls.Button" extends="Fit.Controls.Component">
/// 	Button control with support for Font Awesome icons
/// </container>

// http://fiddle.jshell.net/05q0tLt6/14/

/// <function container="Fit.Controls.Button" name="Button" access="public">
/// 	<description> Create instance of Button control </description>
/// 	<param name="controlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.Button = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);
	Fit.Core.Extend(this, Fit.Controls.Component).Apply(controlId);

	// Internals

	var me = this;
	var id = me.GetId();
	var element = me.GetDomElement();
	var wrapper = null;
	var icon = null;
	var label = null;
	var width = { Value: -1, Unit: "px" };	// Initial width - a value of -1 indicates that size adjusts to content
	var height = { Value: -1, Unit: "px" };	// Initial height - a value of -1 indicates that size adjusts to content
	var returnFocus = false;
	var onClickHandlers = [];

	function init()
	{
		var invokeClick = true;
		var focusedBeforeClick = null;

		Fit.Events.AddHandler(element, Fit.Browser.IsTouchEnabled() === true ? "touchstart" : "mousedown", function(e)
		{
			invokeClick = true;
			focusedBeforeClick = returnFocus === true ? Fit.Dom.GetFocused() : null;
		});
		Fit.Browser.IsTouchEnabled() === true && Fit.Events.AddHandler(element, "touchmove", function(e)
		{
			invokeClick = false;
		});
		Fit.Events.AddHandler(element, Fit.Browser.IsTouchEnabled() === true ? "touchend" : "click", function(e)
		{
			if (invokeClick === true && me.Enabled() === true)
				me.Click();

			if (focusedBeforeClick !== null)
			{
				focusedBeforeClick.focus();
				focusedBeforeClick = null;
			}
		});
		Fit.Browser.IsTouchEnabled() === true && Fit.Events.AddHandler(element, "touchcancel", function(e)
		{
			focusedBeforeClick = null;
		});
		Fit.Events.AddHandler(element, "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			if (me.Enabled() === true && (ev.keyCode === 13 || ev.keyCode === 32)) // Enter or Spacebar
			{
				me.Click();
				Fit.Events.PreventDefault(ev);
			}
		});

		Fit.Dom.AddClass(element, "FitUiControl");
		Fit.Dom.AddClass(element, "FitUiControlButton");

		wrapper = document.createElement("div");
		Fit.Dom.Add(element, wrapper);

		icon = document.createElement("span");
		Fit.Dom.Add(wrapper, icon);

		label = document.createElement("span");
		Fit.Dom.Add(wrapper, label);

		me.Enabled(true);
		me.Type(Fit.Controls.ButtonType.Default);
	}

	/// <function container="Fit.Controls.Button" name="Title" access="public" returns="string">
	/// 	<description> Get/set button title </description>
	/// 	<param name="val" type="string" default="undefined"> If specified, button title will be set to specified value </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			Fit.Dom.Data(element, "title", ((val !== "") ? val : null));
			label.innerHTML = val;
		}

		return ((Fit.Dom.Data(element, "title") !== null) ? Fit.Dom.Data(element, "title") : "");
	}

	/// <function container="Fit.Controls.Button" name="Icon" access="public" returns="string">
	/// 	<description> Get/set button icon (Font Awesome icon name, e.g. fa-check-circle-o - https://fontawesome.com/v4.7.0/icons) </description>
	/// 	<param name="val" type="string" default="undefined"> If specified, button icon will be set to specified value </param>
	/// </function>
	this.Icon = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			Fit.Dom.Data(element, "icon", ((val !== "") ? val : null));
			icon.className = ((val !== "") ? "fa " + ((val.indexOf("fa-") !== 0) ? "fa-" : "") + val : "");
		}

		return ((Fit.Dom.Data(element, "icon") !== null) ? Fit.Dom.Data(element, "icon") : "");
	}

	/// <function container="Fit.Controls.Button" name="Type" access="public" returns="Fit.Controls.ButtonType">
	/// 	<description>
	/// 		Get/set button type producing specific look and feel.
	/// 		Possible values are:
	/// 		 - Fit.Controls.ButtonType.Default (white)
	/// 		 - Fit.Controls.ButtonType.Primary (blue)
	/// 		 - Fit.Controls.ButtonType.Success (green)
	/// 		 - Fit.Controls.ButtonType.Info (turquoise)
	/// 		 - Fit.Controls.ButtonType.Warning (orange)
	/// 		 - Fit.Controls.ButtonType.Danger (red)
	/// 	</description>
	/// 	<param name="val" type="Fit.Controls.ButtonType" default="undefined"> If specified, button type will be set to specified value </param>
	/// </function>
	this.Type = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (Fit.Validation.IsSet(Fit.Controls.ButtonType[val]) === false)
				Fit.Validation.ThrowError("Unsupported button type specified - use e.g. Fit.Controls.ButtonType.Default");

			Fit.Dom.Data(element, "type", val);
		}

		return Fit.Dom.Data(element, "type");
	}

	/// <function container="Fit.Controls.Button" name="Enabled" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether button is enabled or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If specified, True enables button, False disables it </param>
	/// </function>
	this.Enabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && val !== me.Enabled())
		{
			Fit.Dom.Data(element, "enabled", ((val === true) ? "true" : "false"));

			if (val === true)
			{
				element.tabIndex = 0;
			}
			else
			{
				me.Focused(false);
				Fit.Dom.Attribute(element, "tabindex", null);
			}

			me._internal.Repaint();
		}

		return (Fit.Dom.Data(element, "enabled") === "true");
	}

	/// <function container="Fit.Controls.Button" name="Focused" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control has focus </description>
	/// 	<param name="focus" type="boolean" default="undefined"> If defined, True assigns focus, False removes focus (blur) </param>
	/// </function>
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true)
		{
			if (focus === true)
				element.focus();
			else
				element.blur();
		}

		// Fit.Dom.Contained(..) portion added to support IE which incorrectly assigns focus to contained elements, even though tabIndex is not set
		return (Fit.Dom.GetFocused() === element || (Fit.Dom.GetFocused() && Fit.Dom.Contained(element, Fit.Dom.GetFocused())));
	}

	/// <function container="Fit.Controls.Button" name="Width" access="public" returns="Fit.TypeDefs.CssValue">
	/// 	<description> Get/set control width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="Fit.TypeDefs.CssUnit" default="px"> If defined, control width is updated to specified CSS unit </param>
	/// </function>
	this.Width = function(val, unit) // Differs from ControlBase.Width(..) when -1 is passed - this control resets to width:auto while ControlBase resets to width:200px
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
				width = { Value: -1, Unit: "px" };
				element.style.width = ""; // Notice: width:auto is applied in Button.css
			}
		}

		return width;
	}

	/// <function container="Fit.Controls.Button" name="Height" access="public" returns="Fit.TypeDefs.CssValue">
	/// 	<description> Get/set control height - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control height is updated to specified value. A value of -1 resets control height. </param>
	/// 	<param name="unit" type="Fit.TypeDefs.CssUnit" default="px"> If defined, control height is updated to specified CSS unit </param>
	/// </function>
	this.Height = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				height = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				element.style.height = height.Value + height.Unit;

				// Work around bug in WebKit/Chrome:
				// https://code.google.com/p/chromium/issues/detail?id=573715
				// Also see Button.css (div.FitUiControlButton[style*="height"] > div)
				wrapper.style.position = "relative";
			}
			else
			{
				height = { Value: -1, Unit: "px" };
				element.style.height = "";

				// Undo WebKit/Chrome bug fix (see condition above)
				wrapper.style.position = "";
			}
		}

		return height;
	}

	/// <function container="Fit.Controls.Button" name="ReturnFocus" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether button returns focus after click </description>
	/// 	<param name="val" type="boolean" default="undefined">
	/// 		A value of True causes button to return focus to previously focused element after click - defaults to False
	/// 	</param>
	/// </function>
	this.ReturnFocus = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			returnFocus = val;
		}

		return returnFocus;
	}

	/// <function container="Fit.Controls.ButtonTypeDefs" name="ClickEventHandler">
	/// 	<description> OnClick event handler </description>
	/// 	<param name="sender" type="Fit.Controls.Button"> Instance of Button </param>
	/// </function>

	/// <function container="Fit.Controls.Button" name="OnClick" access="public">
	/// 	<description> Set callback function invoked when button is clicked </description>
	/// 	<param name="cb" type="Fit.Controls.ButtonTypeDefs.ClickEventHandler">
	/// 		Callback function invoked when button is clicked - takes button instance as argument
	/// 	</param>
	/// </function>
	this.OnClick = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onClickHandlers, cb);
	}

	/// <function container="Fit.Controls.Button" name="Click" access="public">
	/// 	<description> Programmatically trigger a button click </description>
	/// </function>
	this.Click = function()
	{
		Fit.Array.ForEach(onClickHandlers, function(handler)
		{
			handler(me);
		});
	}

	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		me = id = element = wrapper = icon = label = width = height = returnFocus = onClickHandlers = null;
		base();
	});

	init();
}

/// <container name="Fit.Controls.ButtonType">
/// 	Enum values determining visual appearance of button controls
/// </container>
Fit.Controls.ButtonType =
{
	/// <member container="Fit.Controls.ButtonType" name="Default" access="public" static="true" type="string" default="Default">
	/// 	<description> White unless styled differently - default look and feel </description>
	/// </member>
	Default: "Default",

	/// <member container="Fit.Controls.ButtonType" name="Primary" access="public" static="true" type="string" default="Primary">
	/// 	<description> Blue unless styled differently </description>
	/// </member>
	Primary: "Primary",

	/// <member container="Fit.Controls.ButtonType" name="Success" access="public" static="true" type="string" default="Success">
	/// 	<description> Green unless styled differently </description>
	/// </member>
	Success: "Success",

	/// <member container="Fit.Controls.ButtonType" name="Info" access="public" static="true" type="string" default="Info">
	/// 	<description> Turquoise unless styled differently </description>
	/// </member>
	Info: "Info",

	/// <member container="Fit.Controls.ButtonType" name="Warning" access="public" static="true" type="string" default="Warning">
	/// 	<description> Orange unless styled differently </description>
	/// </member>
	Warning: "Warning",

	/// <member container="Fit.Controls.ButtonType" name="Danger" access="public" static="true" type="string" default="Danger">
	/// 	<description> Red unless styled differently </description>
	/// </member>
	Danger: "Danger"
}

Fit.Controls.Button.Type = Fit.Controls.ButtonType; // Backward compatibility
