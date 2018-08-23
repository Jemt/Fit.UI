/// <container name="Fit.Controls.Dialog" extends="Fit.Controls.Component">
/// 	Simple Dialog control with support for Fit.UI buttons.
/// </container>

/// <function container="Fit.Controls.Dialog" name="Dialog" access="public">
/// 	<description> Create instance of Dialog control </description>
/// 	<param name="controlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.Dialog = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);
	Fit.Core.Extend(this, Fit.Controls.Component).Apply(controlId);

	var me = this;
	var dialog = me.GetDomElement();
	var title = null;
	var titleButtons = null;
	var cmdMaximize = null;
	var cmdDismiss = null;
	var content = null;
	var iframe = null;
	var buttons = null;
	var modal = false;
	var layer = null;

	var width = null;
	var minWidth = null;
	var maxWidth = null;

	var height = null;
	var minHeight = null;
	var maxHeight = null;
	var mutationObserverId = -1;

	var onDismissHandlers = [];

	// ============================================
	// Init
	// ============================================

	function init()
	{
		Fit.Dom.AddClass(dialog, "FitUiControl");
		Fit.Dom.AddClass(dialog, "FitUiControlDialog");
		Fit.Dom.Data(dialog, "framed", "false");
		Fit.Dom.Data(dialog, "maximized", "false");

		content = createContentElement();
		Fit.Dom.Add(dialog, content);

		layer = document.createElement("div");
		Fit.Dom.AddClass(layer, "FitUiControlDialogModalLayer");

		// Keep tab navigation within modal dialog

		Fit.Events.AddHandler(dialog, "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			var key = Fit.Events.GetModifierKeys();

			if (modal === true && buttons !== null && ev.keyCode === 9) // Tab key
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

			if (buttons !== null && (Fit.Dom.GetFocused() === null || Fit.Dom.Contained(dialog, Fit.Dom.GetFocused()) === false))
				buttons.children[0].focus();
		});

		Fit.Events.AddHandler(layer, "click", function(e)
		{
			if (buttons !== null && (Fit.Dom.GetFocused() === null || Fit.Dom.Contained(dialog, Fit.Dom.GetFocused()) === false))
				buttons.children[0].focus();
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.Dialog" name="Title" access="public" returns="string">
	/// 	<description> Get/set title - returns null if not set, and null can be passed to remove title </description>
	/// 	<param name="val" type="string" default="undefined"> If specified, dialog title is updated with specified value </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (val !== undefined) // Allow null to remove title
		{
			if (val === null && title !== null)
			{
				if (titleButtons !== null)
				{
					Fit.Dom.Text(title, "");
					Fit.Dom.Add(title, titleButtons);
				}
				else
				{
					Fit.Dom.Remove(title);
					title = null;

					setContentHeight();
				}
			}
			else
			{
				if (title === null)
				{
					title = document.createElement("div");
					Fit.Dom.AddClass(title, "FitUiControlDialogTitle");
					Fit.Dom.InsertAt(dialog, 0, title);
				}

				Fit.Dom.Text(title, val);

				if (titleButtons !== null)
				{
					Fit.Dom.Add(title, titleButtons);
				}

				setContentHeight();
			}
		}

		return (title !== null ? Fit.Dom.Text(title) : null);
	}

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

	/// <function container="Fit.Controls.Dialog" name="Height" access="public" returns="object">
	/// 	<description> Get/set dialog height - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, dialog height is updated to specified value. A value of -1 resets height to default. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, dialog width is updated to specified CSS unit </param>
	/// </function>
	this.Height = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		// defaultValue must match height in Dialog.css
		var defaultValue = (iframe !== null ? { Value: 40, Unit: "%" } : { Value: -1, Unit: "px" });

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				height = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				dialog.style.height = height.Value + height.Unit;
			}
			else
			{
				height = null;
				dialog.style.height = "";
			}

			setContentHeight();
		}

		return (height !== null ? height : defaultValue);
	}

	/// <function container="Fit.Controls.Dialog" name="MinimumHeight" access="public" returns="object">
	/// 	<description> Get/set dialog minimum height - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, dialog minimum height is updated to specified value. A value of -1 resets minimum height. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, dialog minimum height is updated to specified CSS unit </param>
	/// </function>
	this.MinimumHeight = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		// defaultValue must match min-height in Dialog.css (which is not defined)
		var defaultValue = { Value: -1, Unit: "px" };

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				minHeight = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				dialog.style.minHeight = minHeight.Value + minHeight.Unit;
			}
			else
			{
				minHeight = null;
				dialog.style.minHeight = "";
			}

			setContentHeight();
		}

		return (minHeight !== null ? minHeight : defaultValue);
	}

	/// <function container="Fit.Controls.Dialog" name="MaximumHeight" access="public" returns="object">
	/// 	<description> Get/set dialog maximum height - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, dialog maximum height is updated to specified value. A value of -1 resets maximum height. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, dialog maximum height is updated to specified CSS unit </param>
	/// </function>
	this.MaximumHeight = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		// defaultValue must match max-height in Dialog.css (which is not defined)
		var defaultValue = { Value: -1, Unit: "px" };

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				maxHeight = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				dialog.style.maxHeight = maxHeight.Value + maxHeight.Unit;
			}
			else
			{
				maxHeight = null;
				dialog.style.maxHeight = "";
			}

			setContentHeight();
		}

		return (maxHeight !== null ? maxHeight : defaultValue);
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

			if (iframe !== null)
			{
				Fit.Dom.Data(dialog, "framed", "false");
				iframe = null;
			}

			setContentHeight();
		}

		return content.innerHTML;
	}

	/// <function container="Fit.Controls.Dialog" name="GetContentDomElement" access="public" returns="DOMElement">
	/// 	<description> Get dialog content element </description>
	/// </function>
	this.GetContentDomElement = function()
	{
		return content;
	}

	/// <function container="Fit.Controls.Dialog" name="ContentUrl" access="public" returns="string">
	/// 	<description> Get/set content URL - returns null if not set </description>
	/// 	<param name="url" type="string" default="undefined"> If specified, dialog is updated with content from specified URL </param>
	/// 	<param name="onLoadHandler" type="function" default="undefined"> If specified, callback is invoked when content has been loaded </param>
	/// </function>
	this.ContentUrl = function(url, onLoadHandler)
	{
		Fit.Validation.ExpectString(url, true);
		Fit.Validation.ExpectFunction(onLoadHandler, true);

		if (Fit.Validation.IsSet(url) === true)
		{
			iframe = Fit.Dom.CreateElement("<iframe src='" + url + "' scrolling='yes' frameBorder='0' allowtransparency='true'></iframe>");
			
			if (Fit.Validation.IsSet(onLoadHandler) === true)
			{
				Fit.Events.AddHandler(iframe, "load", function(e)
				{
					onLoadHandler(me);
				});
			}

			content.innerHTML = "";
			Fit.Dom.Add(content, iframe);
			Fit.Dom.Data(dialog, "framed", "true");
		}

		return (iframe !== null ? iframe.src : null);
	}

	/// <function container="Fit.Controls.Dialog" name="Maximized" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether dialog is maximized or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True maximizes dialog while False restores it </param>
	/// </function>
	this.Maximized = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			Fit.Dom.Data(dialog, "maximized", (val === true ? "true" : "false"));

			if (cmdMaximize !== null)
			{
				if (Fit.Dom.Data(dialog, "maximized") === "true")
				{
					cmdMaximize.Icon("compress");
				}
				else
				{
					cmdMaximize.Icon("expand");
				}
			}

			me._internal.Repaint(function()
			{
				// Safari on iOS: Scroll does not work after resizing the
				// dialog. Temporarily hiding the iframe solves the problem.
				var b = Fit.Browser.GetInfo();
				if (iframe !== null && b.Name === "Safari" && b.IsMobile === true)
				{
					iframe.style.display = "none";
					setTimeout(function() { iframe.style.display = ""; }, 0);
				}
			});
		}

		return (Fit.Dom.Data(dialog, "maximized") === "true");
	}

	/// <function container="Fit.Controls.Dialog" name="Maximizable" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether dialog is maximizable or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, a value of True makes dialog maximizable by adding a maximize button while False disables it </param>
	/// </function>
	this.Maximizable = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true && cmdMaximize === null)
			{
				cmdMaximize = new Fit.Controls.Button();
				cmdMaximize.Icon((me.Maximized() === false ? "expand" : "compress"));
				cmdMaximize.OnClick(function(sender)
				{
					if (me.Maximized() === false)
					{
						me.Maximized(true); // Also updates button icon
					}
					else
					{
						me.Maximized(false); // Also updates button icon
					}
				});

				updateTitleButtons();
			}
			else if (val === false && cmdMaximize !== null)
			{
				cmdMaximize.Dispose();
				cmdMaximize = null;
				updateTitleButtons();
			}
		}

		return (cmdMaximize !== null);
	}

	/// <function container="Fit.Controls.Dialog" name="Dismissible" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether dialog is dismissible or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, a value of True makes dialog dismissible by adding a close button while False disables it </param>
	/// 	<param name="disposeOnDismiss" type="boolean" default="undefined"> If defined, a value of True results in dialog being disposed (destroyed) when closed using dismiss/close button </param>
	/// </function>
	this.Dismissible = function(val, disposeOnDismiss)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(disposeOnDismiss, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true && cmdDismiss === null)
			{
				cmdDismiss = new Fit.Controls.Button();
				cmdDismiss.Icon("close");
				cmdDismiss.OnClick(function(sender)
				{
					var canceled = false;

					Fit.Array.ForEach(onDismissHandlers, function(cb)
					{
						if (cb(me) === false)
						{
							canceled = true;
							return false; // Break loop
						}
					});

					if (canceled === true)
					{
						return;
					}

					if (disposeOnDismiss === true)
					{
						me.Dispose();
					}
					else
					{
						me.Close();
					}
				});

				updateTitleButtons();
			}
			else if (val === false && cmdDismiss !== null)
			{
				cmdDismiss.Dispose();
				cmdDismiss = null;
				updateTitleButtons();
			}
		}

		return (cmdDismiss !== null);
	}

	/// <function container="Fit.Controls.Dialog" name="AddButton" access="public">
	/// 	<description> Add button to dialog </description>
	/// 	<param name="btn" type="Fit.Controls.Button"> Instance of Fit.Controls.Button </param>
	/// </function>
	this.AddButton = function(btn)
	{
		Fit.Validation.ExpectInstance(btn, Fit.Controls.Button);

		if (buttons === null)
		{
			buttons = document.createElement("div");
			Fit.Dom.AddClass(buttons, "FitUiControlDialogButtons");
			Fit.Dom.Add(dialog, buttons);
		}

		Fit.Dom.Add(buttons, btn.GetDomElement());

		setContentHeight();
	}

	/// <function container="Fit.Controls.Dialog" name="RemoveButton" access="public">
	/// 	<description> Remove button from dialog </description>
	/// 	<param name="btn" type="Fit.Controls.Button"> Instance of Fit.Controls.Button </param>
	/// 	<param name="dispose" type="boolean" default="undefined"> If defined, a value of True results in button being disposed (destroyed) </param>
	/// </function>
	this.RemoveButton = function(btn, dispose)
	{
		Fit.Validation.ExpectInstance(btn, Fit.Controls.Button);
		Fit.Validation.ExpectBoolean(dispose, true);

		if (buttons === null)
			return;

		Fit.Array.ForEach(buttons.children, function(elm)
		{
			if (elm === btn.GetDomElement())
			{
				if (dispose === true)
				{
					btn.Dispose();
				}
				else
				{
					Fit.Dom.Remove(btn.GetDomElement());
				}

				if (buttons.children.length === 0)
				{
					Fit.Dom.Remove(buttons);
					buttons = null;
				}

				setContentHeight();

				return false; // Break loop
			}
		});
	}

	/// <function container="Fit.Controls.Dialog" name="RemoveAllButtons" access="public">
	/// 	<description> Remove all buttons from dialog </description>
	/// 	<param name="dispose" type="boolean" default="undefined"> If defined, a value of True results in buttons being disposed (destroyed) </param>
	/// </function>
	this.RemoveAllButtons = function(dispose)
	{
		Fit.Validation.ExpectBoolean(dispose, true);

		if (buttons === null)
			return;

		Fit.Array.ForEach(Fit.Array.Copy(buttons.children), function(buttonElm) // Using Copy(..) since code modifies children collection
		{
			if (dispose === true)
			{
				buttonElm._internal.Instance.Dispose();
			}
			else
			{
				Fit.Dom.Remove(buttonElm);
			}
		});

		Fit.Dom.Remove(buttons);
		buttons = null;

		setContentHeight();
	}

	/// <function container="Fit.Controls.Dialog" name="IsOpen" access="public" returns="boolean">
	/// 	<description> Get flag indicating whether dialog is open or not </description>
	/// </function>
	this.IsOpen = function()
	{
		return (dialog.parentElement === document.body);
	}

	/// <function container="Fit.Controls.Dialog" name="Open" access="public">
	/// 	<description> Open dialog </description>
	/// </function>
	this.Open = function()
	{
		Fit.Dom.Add(document.body, dialog);

		if (modal === true)
			Fit.Dom.Add(document.body, layer);
		
		setContentHeight();
		mutationObserverId = Fit.Events.AddMutationObserver(dialog, function(elm)
		{
			setContentHeight();
		});
	}

	/// <function container="Fit.Controls.Dialog" name="Close" access="public">
	/// 	<description> Close dialog </description>
	/// </function>
	this.Close = function()
	{
		if (me.IsOpen() === false)
			return;

		Fit.Events.RemoveMutationObserver(mutationObserverId);
		mutationObserverId = -1;

		Fit.Dom.Remove(dialog);

		if (layer !== null)
			Fit.Dom.Remove(layer);
	}

	this.Render = function(toElement) // Override Render() on Fit.Controls.Component
	{
		Fit.Validation.ThrowError("Use Open function to open Dialog");
	}

	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		if (layer !== null)
			Fit.Dom.Remove(layer);
		
		if (cmdMaximize !== null)
		{
			cmdMaximize.Dispose();
		}

		if (cmdDismiss !== null)
		{
			cmdDismiss.Dispose();
		}

		if (buttons !== null)
		{
			Fit.Array.ForEach(Fit.Array.Copy(buttons.children), function(buttonElm) // Using Copy(..) since Dispose() modifies children collection
			{
				buttonElm._internal.Instance.Dispose();
			});
		}

		if (mutationObserverId !== -1)
		{
			Fit.Events.RemoveMutationObserver(mutationObserverId);
		}

		me = dialog = title = titleButtons = cmdMaximize = cmdDismiss = content = buttons = modal = layer = width = minWidth = maxWidth = height = minHeight = maxHeight = mutationObserverId = onDismissHandlers = null;

		base();
	});

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.Dialog" name="OnDismiss" access="public">
	/// 	<description>
	/// 		Add event handler fired when dialog is being dismissed (closed).
	/// 		Action can be suppressed by returning False.
	/// 		Function receives one argument: Sender (Fit.Controls.Dialog)
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnDismiss = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onDismissHandlers, cb);
	}

	// ============================================
	// Private
	// ============================================

	function createContentElement()
	{
		var div = document.createElement("div");
		Fit.Dom.AddClass(div, "FitUiControlDialogContent");
		return div;
	}

	function setContentHeight()
	{
		if (me.IsOpen() === false)
			return;

		// By default the Dialog component adjusts its height to the content.
		// But if Height/MinimumHeight/MaximumHeight is set, or dialog is maximized,
		// then make sure to adjust the height of the content element if title/buttons
		// are added. If no title/buttons are added, the content element simply adjusts
		// to the height of the dialog since it has height:100%.

		content.style.height = "";

		if ((buttons !== null || title !== null) && (me.Maximized() === true || me.Height().Value !== -1 || me.MinimumHeight().Value !== -1 || me.MaximumHeight().Value !== -1))
		{
			var dh = dialog.offsetHeight;
			var th = (title !== null ? title.offsetHeight : 0);
			var bh = (buttons !== null ? buttons.offsetHeight : 0);

			content.style.height = (dh - th - bh) + "px";
		}
	}

	function updateTitleButtons()
	{
		// Remove title buttons container if no longer needed

		if (titleButtons !== null && cmdMaximize === null && cmdDismiss === null)
		{
			Fit.Dom.Remove(titleButtons);
			titleButtons = null;
			return;
		}

		// Ensure title bar and container for title buttons

		if (titleButtons === null && (cmdMaximize !== null || cmdDismiss !== null))
		{
			if (me.Title() === null)
				me.Title("");

			titleButtons = document.createElement("div");
			Fit.Dom.AddClass(titleButtons, "FitUiControlDialogTitleButtons");
			Fit.Dom.Add(title, titleButtons);
		}

		// Add/re-add to ensure proper order

		if (cmdMaximize !== null)
		{
			Fit.Dom.Add(titleButtons, cmdMaximize.GetDomElement());
		}

		if (cmdDismiss !== null)
		{
			Fit.Dom.Add(titleButtons, cmdDismiss.GetDomElement());
		}
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
		d.Dispose();

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
			d.Dispose();

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
		// Notice: Dialog is disposed at this point!
		
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

	Fit.Dom.Add(dia.GetContentDomElement(), txt.GetDomElement());
	txt.Focused(true);
}
