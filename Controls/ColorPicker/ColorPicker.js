/// <container name="Fit.Controls.ColorPicker" extends="Fit.Controls.ControlBase">
/// 	ColorPicker control which allows for color selection.
/// 	Extending from Fit.Controls.ControlBase.
/// </container>

/// <function container="Fit.Controls.ColorPicker" name="ColorPicker" access="public">
/// 	<description> Create instance of ColorPicker control </description>
/// 	<param name="ctlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.ColorPicker = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId, true);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var colorPicker = null;			// Native color picker control: <input type="color">
	var lblValue = null;			// Label showing selected HEX color code
	var orgColor = "";				// Holds initial value used to determine IsDirty state
	var prevColor = "";				// Holds latest change made by user - used to determine whether OnChange needs to be fired
	var cmdClear = null;			// Clear button to remove color selection (transparency)
	var defaultColor = "#FFD6D6";	// Color (use upper case!) that is unlikely to be used - OnChange won't fire if we click on the initially selected color, so this color cannot be selected without selecting another color first

	// ============================================
	// Init
	// ============================================

	function init()
	{
		me.AddCssClass("FitUiControlColorPicker");
		transparent(true);

		colorPicker = document.createElement("input");
		colorPicker.type = "color";
		colorPicker.value = defaultColor;
		colorPicker.oninput = function() // Contrary to OnChange, OnInput fires continuously
		{
			if (me === null)
			{
				// Fix for Chrome which fires OnChange and OnBlur (in both capturering and bubbling phase)
				// if control has focus while being removed from DOM, e.g. if used in a dialog closed using ESC.
				// More details here: https://bugs.chromium.org/p/chromium/issues/detail?id=866242
				return;
			}

			transparent(false);
			fireOnChange();
		}
		me._internal.AddDomElement(colorPicker);

		lblValue = document.createElement("span");
		lblValue.tabIndex = -1;
		lblValue.onclick = function(e)
		{
			if (window.getSelection().isCollapsed === true) // No selection - open picker - otherwise user is likely trying to copy color which color picker will prevent
			{
				colorPicker.click();
			}
		}
		me._internal.AddDomElement(lblValue);

		cmdClear = document.createElement("span");
		cmdClear.tabIndex = -1;
		cmdClear.innerHTML = "&times;";
		cmdClear.onclick = function()
		{
			colorPicker.focus(); // Move focus to color picker - clear button will be hidden when transparent
			transparent(true);

			colorPicker.value = defaultColor;
			prevColor = defaultColor;

			fireOnChange();
		}
		me._internal.AddDomElement(cmdClear);
	}

	// ============================================
	// Public - overrides
	// ============================================

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true && focus !== me.Focused())
		{
			if (focus === true)
			{
				colorPicker.focus();
			}
			else
			{
				Fit.Dom.GetFocused().blur(); // Multiple elements can hold focus - we have ensured control is the one having focus (me.Focused() above)
			}
		}

		return Fit.Dom.Contained(me.GetDomElement(), Fit.Dom.GetFocused());
	}

	// See documentation on ControlBase
	this.Value = function(val, preserveDirtyState)
	{
		Fit.Validation.ExpectString(val, true);
		Fit.Validation.ExpectBoolean(preserveDirtyState, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			val = val.toUpperCase();

			if (me.Value() !== val)
			{
				var changed = false;

				if (val === "")
				{
					transparent(true);
					changed = true;
				}
				else if (isValidColor(val) === true)
				{
					transparent(false);
					colorPicker.value = val;
					changed = true;
				}

				if (changed === true)
				{
					orgColor = (preserveDirtyState !== true ? val : orgColor);
					fireOnChange();
				}
			}
		}

		return (transparent() ? "" : colorPicker.value.toUpperCase());
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		return (orgColor !== me.Value());
	}

	// See documentation on ControlBase
	this.Clear = function()
	{
		me.Value("");
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		me = colorPicker = lblValue = orgColor = prevColor = cmdClear = defaultColor = null;
		base();
	});

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.ColorPicker" name="ShowValue" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control should show HEX color code (default) or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True shows label with HEX color code, False hides it </param>
	/// </function>
	this.ShowValue = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			lblValue.style.display = (val === false ? "none" : "");
		}

		return lblValue.style.display === "";
	}

	// ============================================
	// Private
	// ============================================

	function transparent(val)
	{
		if (Fit.Validation.IsSet(val) === true)
		{
			me._internal.Data("transparent", val ? "true" : "false");
		}

		return me._internal.Data("transparent") === "true";
	}

	function isValidColor(val)
	{
		return /^#[A-F0-9]{6}$/.test(val);
	}

	function fireOnChange()
	{
		var newVal = me.Value();
		var compareValue = prevColor.toUpperCase(); // Value() returns uppercase value for color picker - preVal might be in lower case if assigned before input type was changed

		if (newVal !== compareValue)
		{
			prevColor = newVal;
			me._internal.FireOnChange();

			var contrastColor = me.Value() !== "" ? Fit.Color.GetContrastColor(me.Value(), 120) : "black";

			// Update control's background color
			me.GetDomElement().style.background = me.Value();

			// Update label showing color code
			lblValue.innerHTML = me.Value();
			lblValue.style.color = contrastColor;

			// Update clear button's contract color
			cmdClear.style.color = contrastColor;
		}
	}

	init();
}