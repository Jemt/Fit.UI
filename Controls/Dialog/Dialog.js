/// <container name="Fit.Controls.Dialog">
/// 	Simple Dialog control with support for Fit.UI buttons.
/// </container>

/// <function container="Fit.Controls.Dialog" name="Dialog" access="public">
/// 	<description> Create instance of Dialog control </description>
/// </function>
Fit.Controls.Dialog = function()
{
	var me = this;
	var dialog = null;
	var content = null;
	var buttons = null;
	var modal = false;
	var layer = null;

	var width = null;
	var minWidth = null;
	var maxWidth = null;

	// ============================================
	// Init
	// ============================================

	function init()
	{
		Fit._internal.Core.EnsureStyles();

		dialog = document.createElement("div");
		Fit.Dom.AddClass(dialog, "FitUiControl");
		Fit.Dom.AddClass(dialog, "FitUiControlDialog");

		content = document.createElement("div");
		Fit.Dom.AddClass(content, "FitUiControlDialogContent");
		Fit.Dom.Add(dialog, content);

		buttons = document.createElement("div");
		Fit.Dom.AddClass(buttons, "FitUiControlDialogButtons");
		Fit.Dom.Add(dialog, buttons);

		layer = document.createElement("div");
		Fit.Dom.AddClass(layer, "FitUiControlDialogModalLayer");

		// Keep tab navigation within modal dialog

		Fit.Events.AddHandler(dialog, "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			var key = Fit.Events.GetModifierKeys();

			if (modal === true && buttons.children.length > 0 && ev.keyCode === 9) // Tab key
			{
				var buttonFocused = Fit.Dom.GetFocused();

				if (ev.shiftKey === false)
				{
					if (buttonFocused === buttons.children[buttons.children.length - 1])
					{
						buttons.children[0].focus();
						Fit.Events.PreventDefault(ev);
					}
				}
				else
				{
					if (buttonFocused === buttons.children[0])
					{
						buttons.children[buttons.children.length - 1].focus();
						Fit.Events.PreventDefault(ev);
					}
				}
			}
		});

		// Focus first button when clicking dialog or modal layer

		Fit.Events.AddHandler(dialog, "click", function(e)
		{
			if (me === null)
				return; // Dialog was disposed when a button was clicked

			if (buttons.children.length > 0 && (Fit.Dom.GetFocused() === null || Fit.Dom.Contained(dialog, Fit.Dom.GetFocused()) === false))
				buttons.children[0].focus();
		});

		Fit.Events.AddHandler(layer, "click", function(e)
		{
			if (buttons.children.length > 0 && (Fit.Dom.GetFocused() === null || Fit.Dom.Contained(dialog, Fit.Dom.GetFocused()) === false))
				buttons.children[0].focus();
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.Dialog" name="Width" access="public" returns="object">
	/// 	<description> Get/set dialog width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, dialog width is updated to specified value. A value of -1 resets width (auto sizing). </param>
	/// 	<param name="unit" type="string" default="px"> If defined, dialog width is updated to specified CSS unit </param>
	/// </function>
	this.Width = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		// defaultValue must match width (for both modern browsers and legacy IE) in Dialog.css
		var defaultValue = (Fit.Browser.GetInfo().Name !== "MSIE" || Fit.Browser.GetInfo().Version >= 9 ? { Value: -1, Unit: "px" } : { Value: 50, Unit: "%" });

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				width = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				dialog.style.width = width.Value + width.Unit;

				if (minWidth === null)
				{
					dialog.style.minWidth = "0";
				}

				if (maxWidth === null)
				{
					dialog.style.maxWidth = "none";
				}
			}
			else
			{
				width = null;
				dialog.style.width = "";

				if (minWidth === null)
				{
					dialog.style.minWidth = "";
				}

				if (maxWidth === null)
				{
					dialog.style.maxWidth = "";
				}
			}
		}

		return (width !== null ? width : defaultValue);
	}

	/// <function container="Fit.Controls.Dialog" name="MinimumWidth" access="public" returns="object">
	/// 	<description> Get/set dialog minimum width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, dialog minimum width is updated to specified value. A value of -1 resets minimum width. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, dialog minimum width is updated to specified CSS unit </param>
	/// </function>
	this.MinimumWidth = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		// defaultValue must match min-width in Dialog.css
		var defaultValue = { Value: 280, Unit: "px" };

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				minWidth = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				dialog.style.minWidth = minWidth.Value + minWidth.Unit;
			}
			else
			{
				minWidth = null;
				dialog.style.minWidth = (width !== null ? "0" : ""); // Apply "0" (no min-width) if width is set
			}
		}

		return (minWidth !== null ? minWidth : (width !== null ? width : defaultValue));
	}

	/// <function container="Fit.Controls.Dialog" name="MaximumWidth" access="public" returns="object">
	/// 	<description> Get/set dialog maximum width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, dialog maximum width is updated to specified value. A value of -1 resets maximum width. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, dialog maximum width is updated to specified CSS unit </param>
	/// </function>
	this.MaximumWidth = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		// defaultValue must match max-width in Dialog.css
		var defaultValue = { Value: 800, Unit: "px" };

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				maxWidth = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				dialog.style.maxWidth = maxWidth.Value + maxWidth.Unit;
			}
			else
			{
				maxWidth = null;
				dialog.style.maxWidth = (width !== null ? "none" : ""); // Apply "none" (no max-width) if width is set
			}
		}

		return (maxWidth !== null ? maxWidth : (width !== null ? width : defaultValue));
	}

	/// <function container="Fit.Controls.Dialog" name="Modal" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether dialog is modal or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If specified, True enables modal mode, False disables it </param>
	/// </function>
	this.Modal = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			modal = val;
		}

		return modal;
	}

	/// <function container="Fit.Controls.Dialog" name="Content" access="public" returns="string">
	/// 	<description> Get/set dialog content </description>
	/// 	<param name="val" type="string" default="undefined"> If specified, dialog content is updated with specified value </param>
	/// </function>
	this.Content = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			content.innerHTML = val;
		}

		return content.innerHTML;
	}

	/// <function container="Fit.Controls.Dialog" name="ContentDomElement" access="public" returns="DOMElement">
	/// 	<description> Get/set dialog content element </description>
	/// 	<param name="elm" type="DOMElement" default="undefined"> If specified, content element is replaced with the provided element </param>
	/// </function>
	this.ContentDomElement = function(elm)
	{
		Fit.Validation.ExpectElementNode(elm, true);

		if (Fit.Validation.IsSet(elm) === true)
		{
			Fit.Dom.Replace(content, elm);
			content = elm;
		}

		return content;
	}

	/// <function container="Fit.Controls.Dialog" name="AddButton" access="public">
	/// 	<description> Add button to dialog </description>
	/// 	<param name="btn" type="Fit.Controls.Button"> Instance of Fit.Controls.Button </param>
	/// </function>
	this.AddButton = function(btn)
	{
		Fit.Validation.ExpectInstance(btn, Fit.Controls.Button);
		Fit.Dom.Add(buttons, btn.GetDomElement());
	}

	/// <function container="Fit.Controls.Dialog" name="Open" access="public">
	/// 	<description> Open dialog </description>
	/// </function>
	this.Open = function()
	{
		Fit.Dom.Add(document.body, dialog);

		if (modal === true)
			Fit.Dom.Add(document.body, layer);
	}

	/// <function container="Fit.Controls.Dialog" name="Close" access="public">
	/// 	<description> Close dialog </description>
	/// </function>
	this.Close = function()
	{
		Fit.Dom.Remove(dialog);

		if (layer !== null)
			Fit.Dom.Remove(layer);
	}

	/// <function container="Fit.Controls.Dialog" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing control </description>
	/// </function>
	this.GetDomElement = function()
	{
		return dialog;
	}

	/// <function container="Fit.Controls.Dialog" name="Dispose" access="public">
	/// 	<description> Destroys component to free up memory, including associated buttons </description>
	/// </function>
	this.Dispose = function()
	{
		Fit.Dom.Remove(dialog);

		if (layer !== null)
			Fit.Dom.Remove(layer);

		Fit.Array.ForEach(Fit.Array.Copy(buttons.children), function(buttonElm) // Using Copy(..) since Dispose() modifies children collection
		{
			Fit.Controls.Find(buttonElm.id).Dispose();
		});

		me = dialog = content = buttons = modal = layer = null;
	}

	init();
}

Fit.Controls.Dialog._internal = {};

Fit.Controls.Dialog._internal.BaseDialog = function(content, showCancel, cb)
{
	Fit.Validation.ExpectString(content);
	Fit.Validation.ExpectBoolean(showCancel);
	Fit.Validation.ExpectFunction(cb, true);

	var d = new Fit.Controls.Dialog();
	d.Content(content.replace(/\n/g, "<br>"));
	d.Modal(true);
	Fit.Dom.AddClass(d.GetDomElement(), "FitUiControlDialogBase");

	var cmdOk = new Fit.Controls.Button(Fit.Data.CreateGuid());
	cmdOk.Title(Fit.Language.Translations.Ok);
	cmdOk.Icon("check");
	cmdOk.Type(Fit.Controls.ButtonType.Success);
	cmdOk.OnClick(function(sender)
	{
		d.Close();

		if (Fit.Validation.IsSet(cb) === true)
			cb(true);
	});
	d.AddButton(cmdOk);

	if (showCancel === true)
	{
		var cmdCancel = new Fit.Controls.Button(Fit.Data.CreateGuid());
		cmdCancel.Title(Fit.Language.Translations.Cancel);
		cmdCancel.Icon("ban");
		cmdCancel.Type(Fit.Controls.ButtonType.Danger);
		cmdCancel.OnClick(function(sender)
		{
			d.Close();

			if (Fit.Validation.IsSet(cb) === true)
				cb(false);
		});
		d.AddButton(cmdCancel);
	}

	d.Open();
	cmdOk.Focused(true);

	return d;
}

/// <function container="Fit.Controls.Dialog" name="Alert" access="public" static="true">
/// 	<description> Display alert dialog </description>
/// 	<param name="content" type="string"> Content to display in alert dialog </param>
/// 	<param name="cb" type="function" default="undefined"> Optional callback function invoked when OK button is clicked </param>
/// </function>
Fit.Controls.Dialog.Alert = function(content, cb)
{
	Fit.Validation.ExpectString(content);
	Fit.Validation.ExpectFunction(cb, true);

	Fit.Controls.Dialog._internal.BaseDialog(content, false, function(res)
	{
		if (Fit.Validation.IsSet(cb) === true)
			cb();
	});
}

/// <function container="Fit.Controls.Dialog" name="Confirm" access="public" static="true">
/// 	<description> Display confirmation dialog with OK and Cancel buttons </description>
/// 	<param name="content" type="string"> Content to display in confirmation dialog </param>
/// 	<param name="cb" type="function">
/// 		Callback function invoked when a button is clicked.
/// 		True is passed to callback function when OK is clicked, otherwise False.
/// 	</param>
/// </function>
Fit.Controls.Dialog.Confirm = function(content, cb)
{
	Fit.Validation.ExpectString(content);
	Fit.Validation.ExpectFunction(cb);

	Fit.Controls.Dialog._internal.BaseDialog(content, true, cb);
}

/// <function container="Fit.Controls.Dialog" name="Prompt" access="public" static="true">
/// 	<description> Display prompt dialog that allows for user input </description>
/// 	<param name="content" type="string"> Content to display in prompt dialog </param>
/// 	<param name="defaultValue" type="string"> Default value in input field </param>
/// 	<param name="cb" type="function" default="undefined">
/// 		Callback function invoked when OK or Cancel button is clicked.
/// 		Value entered in input field is passed, null if prompt is canceled.
/// 	</param>
/// </function>
Fit.Controls.Dialog.Prompt = function(content, defaultValue, cb)
{
	Fit.Validation.ExpectString(content);
	Fit.Validation.ExpectString(defaultValue);
	Fit.Validation.ExpectFunction(cb);

	var txt = new Fit.Controls.Input("FitUiControlDialogPrompt" + Fit.Data.CreateGuid());
	txt.Width(100, "%");
	txt.Value(defaultValue);

	var dia = Fit.Controls.Dialog._internal.BaseDialog(content + "<br><br>", true, function(res)
	{
		var val = txt.Value();
		txt.Dispose();

		if (res === true) // OK
		{
			cb(val);
		}
		else // Cancel
		{
			cb(null);
		}
	});

	Fit.Dom.Add(dia.ContentDomElement(), txt.GetDomElement());
	txt.Focused(true);
}
