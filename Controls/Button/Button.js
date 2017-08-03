/// <container name="Fit.Controls.Button">
/// 	Button control with support for Font Awesome icons
/// </container>

// http://fiddle.jshell.net/05q0tLt6/14/

/// <function container="Fit.Controls.Button" name="Button" access="public">
/// 	<description> Create instance of Button control </description>
/// 	<param name="controlId" type="string" default="undefined">
/// 		Unique control ID. If specified, control will be
/// 		accessible using the Fit.Controls.Find(..) function.
/// 	</param>
/// </function>
Fit.Controls.Button = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);

	// Support for Fit.Controls.Find(..)

	if (Fit.Validation.IsSet(controlId) === true)
	{
		if (Fit._internal.ControlBase.Controls[controlId] !== undefined)
			Fit.Validation.ThrowError("Control with ID '" + controlId + "' has already been defined - Control IDs must be unique!");

		Fit._internal.ControlBase.Controls[controlId] = this;
	}

	// Internals

	var me = this;
	var id = (controlId ? controlId : null);
	var element = null;
	var wrapper = null;
	var icon = null;
	var label = null;
	var width = { Value: -1, Unit: "px" };	// Initial width - a value of -1 indicates that size adjusts to content
	var height = { Value: -1, Unit: "px" };	// Initial height - a value of -1 indicates that size adjusts to content
	var onClickHandlers = [];

	function init()
	{
		Fit._internal.Core.EnsureStyles();

		element = document.createElement("div");

		if (id !== null)
			element.id = id;

		Fit.Events.AddHandler(element, "click", function(e)
		{
			if (me.Enabled() === true)
				me.Click();
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
		me.Type(Fit.Controls.Button.Type.Default);
	}

	/// <function container="Fit.Controls.Button" name="GetId" access="public" returns="string">
	/// 	<description> Get unique Control ID - returns Null if not set </description>
	/// </function>
	this.GetId = function()
	{
		return id;
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
	/// 	<description> Get/set button icon (Font Awesome icon name, e.g. fa-check-circle-o - http://fontawesome.io/icons) </description>
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

	/// <function container="Fit.Controls.Button" name="Type" access="public" returns="Fit.Controls.Button.Type">
	/// 	<description>
	/// 		Get/set button type producing specific look and feel.
	/// 		Possible values are:
	/// 		 - Fit.Controls.Button.Type.Default (white)
	/// 		 - Fit.Controls.Button.Type.Primary (blue)
	/// 		 - Fit.Controls.Button.Type.Success (green)
	/// 		 - Fit.Controls.Button.Type.Info (turquoise)
	/// 		 - Fit.Controls.Button.Type.Warning (orange)
	/// 		 - Fit.Controls.Button.Type.Danger (red)
	/// 	</description>
	/// 	<param name="val" type="Fit.Controls.Button.Type" default="undefined"> If specified, button type will be set to specified value </param>
	/// </function>
	this.Type = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (Fit.Validation.IsSet(Fit.Controls.Button.Type[val]) === false)
				Fit.Validation.ThrowError("Unsupported button type specified - use e.g. Fit.Controls.Button.Type.Default");

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

		if (Fit.Validation.IsSet(val) === true)
		{
			Fit.Dom.Data(element, "enabled", ((val === true) ? "true" : "false"));
			element.tabIndex = ((val === true) ? 0 : -1);
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

	/// <function container="Fit.Controls.Button" name="Width" access="public" returns="object">
	/// 	<description> Get/set control width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control width is updated to specified CSS unit </param>
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

	/// <function container="Fit.Controls.Button" name="Height" access="public" returns="object">
	/// 	<description> Get/set control height - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control height is updated to specified value. A value of -1 resets control height. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control height is updated to specified CSS unit </param>
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

	/// <function container="Fit.Controls.Button" name="OnClick" access="public">
	/// 	<description> Set callback function invoked when button is clicked </description>
	/// 	<param name="cb" type="function"> Callback function invoked when button is clicked - takes button instance as argument </param>
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

	/// <function container="Fit.Controls.Button" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing control </description>
	/// </function>
	this.GetDomElement = function()
	{
		return element;
	}

	/// <function container="Fit.Controls.Button" name="Render" access="public">
	/// 	<description> Render control, either inline or to element specified </description>
	/// 	<param name="toElement" type="DOMElement" default="undefined"> If defined, control is rendered to this element </param>
	/// </function>
	this.Render = function(toElement)
	{
		Fit.Validation.ExpectDomElement(toElement, true);

		if (Fit.Validation.IsSet(toElement) === true)
		{
			Fit.Dom.Add(toElement, element);
		}
		else
		{
			var script = document.scripts[document.scripts.length - 1];
			Fit.Dom.InsertBefore(script, element);
		}
	}

	/// <function container="Fit.Controls.Button" name="Dispose" access="public">
	/// 	<description> Destroys control to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		Fit.Dom.Remove(element);
		me = id = element = wrapper = icon = label = width = height = onClickHandlers = null;

		if (Fit.Validation.IsSet(controlId) === true)
			delete Fit._internal.ControlBase.Controls[controlId];
	}

	init();
}

/// <container name="Fit.Controls.Button.Type">
/// 	Enum values determining visual appearance of button controls
/// </container>
Fit.Controls.Button.Type =
{
	/// <member container="Fit.Controls.Button.Type" name="Default" access="public" static="true" type="string" default="Default">
	/// 	<description> White unless styled differently - default look and feel </description>
	/// </member>
	Default: "Default",

	/// <member container="Fit.Controls.Button.Type" name="Primary" access="public" static="true" type="string" default="Primary">
	/// 	<description> Blue unless styled differently </description>
	/// </member>
	Primary: "Primary",

	/// <member container="Fit.Controls.Button.Type" name="Success" access="public" static="true" type="string" default="Success">
	/// 	<description> Green unless styled differently </description>
	/// </member>
	Success: "Success",

	/// <member container="Fit.Controls.Button.Type" name="Info" access="public" static="true" type="string" default="Info">
	/// 	<description> Turquoise unless styled differently </description>
	/// </member>
	Info: "Info",

	/// <member container="Fit.Controls.Button.Type" name="Warning" access="public" static="true" type="string" default="Warning">
	/// 	<description> Orange unless styled differently </description>
	/// </member>
	Warning: "Warning",

	/// <member container="Fit.Controls.Button.Type" name="Danger" access="public" static="true" type="string" default="Danger">
	/// 	<description> Red unless styled differently </description>
	/// </member>
	Danger: "Danger"
}
