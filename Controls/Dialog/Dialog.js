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

	// ============================================
	// Init
	// ============================================

	function init()
	{
		dialog = document.createElement("div");
		Fit.Dom.AddClass(dialog, "FitUiControl");
		Fit.Dom.AddClass(dialog, "FitUiControlDialog");

		content = document.createElement("div");
		Fit.Dom.Add(dialog, content);

		buttons = document.createElement("div");
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
				var buttonFocused = document.activeElement;

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
			if (buttons.children.length > 0 && (document.activeElement === null || Fit.Dom.Contained(dialog, document.activeElement) === false))
				buttons.children[0].focus();
		});

		Fit.Events.AddHandler(layer, "click", function(e)
		{
			if (buttons.children.length > 0 && (document.activeElement === null || Fit.Dom.Contained(dialog, document.activeElement) === false))
				buttons.children[0].focus();
		});
	}

	// ============================================
	// Public
	// ============================================

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
	/// 	<description> Destroys component to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		Fit.Dom.Remove(dialog);
		Fit.Dom.Remove(layer);
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
	d.Content(content);
	d.Modal(true);
	Fit.Dom.AddClass(d.GetDomElement(), "FitUiControlDialogBase");

	var cmdOk = new Fit.Controls.Button(Fit.Data.CreateGuid());
	cmdOk.Title(Fit.Language.Translations.Ok);
	cmdOk.Icon("check");
	cmdOk.Type(Fit.Controls.Button.Type.Success);
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
		cmdCancel.Type(Fit.Controls.Button.Type.Danger);
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
