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
	var focusTrapStart = null;
	var focusTrapEnd = null;
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
	var resizeHandlerId = -1;

	var onDismissHandlers = [];
	var onCloseHandlers = [];
	var isClosing = false;

	// ============================================
	// Init
	// ============================================

	function init()
	{
		Fit.Dom.AddClass(dialog, "FitUiControl");
		Fit.Dom.AddClass(dialog, "FitUiControlDialog");
		Fit.Dom.Data(dialog, "framed", "false");
		Fit.Dom.Data(dialog, "maximized", "false");

		focusTrapStart = document.createElement("div");
		focusTrapStart.tabIndex = 0;
		Fit.Dom.Add(dialog, focusTrapStart);

		focusTrapEnd = document.createElement("div");
		focusTrapEnd.tabIndex = 0;
		Fit.Dom.Add(dialog, focusTrapEnd);

		content = createContentElement();
		Fit.Dom.InsertAfter(focusTrapStart, content);

		layer = document.createElement("div");
		Fit.Dom.AddClass(layer, "FitUiControlDialogModalLayer");

		// Focus first button when clicking dialog or modal layer

		Fit.Events.AddHandler(dialog, "click", function(e)
		{
			if (me === null)
				return; // Dialog was disposed when a button was clicked

			// Do not focus first button when a (any) button within the button area was clicked.
			// Button clicked might have been e.g. second button, which perhaps caused dialog to remain open,
			// in which case we should not change focus. The button clicked could also have changed focus in
			// which case we should not intervene. In case button did not change focus, it will remain focused
			// of course since it was clicked.
			if (buttons !== null && Fit.Dom.Contained(buttons, Fit.Events.GetTarget(e)))
				return;

			if (buttons !== null && (Fit.Dom.GetFocused() === null || Fit.Dom.Contained(dialog, Fit.Dom.GetFocused()) === false))
				buttons.children[0].focus();
		});

		Fit.Events.AddHandler(layer, "click", function(e)
		{
			if (buttons !== null && (Fit.Dom.GetFocused() === null || Fit.Dom.Contained(dialog, Fit.Dom.GetFocused()) === false))
				buttons.children[0].focus();
		});

		// Keep tab navigation within modal dialog

		Fit.Events.AddHandler(dialog, "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			if (modal === true && ev.keyCode === 9) // Tab key
			{
				if (ev.shiftKey === true && Fit.Events.GetTarget(ev) === focusTrapStart) // Tabbing backwards
				{
					Fit.Events.PreventDefault(ev);
				}
				else if (ev.shiftKey === false && Fit.Events.GetTarget(ev) === focusTrapEnd) // Tabbing forward
				{
					Fit.Events.PreventDefault(ev);
				}
			}
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
					updatePosition();
				}
			}
			else
			{
				if (title === null)
				{
					title = document.createElement("div");
					Fit.Dom.AddClass(title, "FitUiControlDialogTitle");
					Fit.Dom.InsertAfter(focusTrapStart, title);
				}

				Fit.Dom.Text(title, val);

				if (titleButtons !== null)
				{
					Fit.Dom.Add(title, titleButtons);
				}

				setContentHeight();
				updatePosition();
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

		var defaultValue = { Value: -1, Unit: "px" };

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

			updatePosition();
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

			updatePosition();
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

			updatePosition();
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
			updatePosition();
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
			updatePosition();
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
			updatePosition();
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
			if (val !== modal && me.IsOpen() === true)
			{
				if (val === true)
					Fit.Dom.InsertBefore(dialog, layer);
				else
					Fit.Dom.Remove(layer);
			}

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
			updatePosition();
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

					if (me !== null) // me is null if dialog was disposed from within OnDismiss handler
					{
						if (disposeOnDismiss === true)
						{
							me.Dispose();
						}
						else
						{
							me.Close();
						}
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
			Fit.Dom.InsertBefore(focusTrapEnd, buttons);
		}

		Fit.Dom.Add(buttons, btn.GetDomElement());

		setContentHeight();
		updatePosition();
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
				updatePosition();

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
		updatePosition();
	}

	/// <function container="Fit.Controls.Dialog" name="IsOpen" access="public" returns="boolean">
	/// 	<description> Get flag indicating whether dialog is open or not </description>
	/// </function>
	this.IsOpen = function()
	{
		return Fit.Dom.IsRooted(dialog);
	}

	/// <function container="Fit.Controls.Dialog" name="Open" access="public">
	/// 	<description> Open dialog </description>
	/// 	<param name="renderTarget" type="DOMElement" default="undefined">
	/// 		Optional render target which can be used to render dialog to specific
	/// 		container rather than the root of the body element. This allows for
	/// 		the dialog to inherit styles from the specified render target.
	/// 	</param>
	/// </function>
	this.Open = function(renderTarget)
	{
		Fit.Validation.ExpectDomElement(renderTarget, true);

		if (me.IsOpen() === true)
			return;

		if (modal === true)
			Fit.Dom.Add(renderTarget || document.body, layer);

		Fit.Dom.Add(renderTarget || document.body, dialog);

		setContentHeight();
		updatePosition();

		// Make dimensions and position adjust to dynamic content (added/removed/manipulated through DOM or Fit.Template).
		// Notice that mutation observer will not be triggered if title is set or buttons have been added,
		// and content is being updated using DOM, e.g. through GetContentDomElement() or an instance of
		// Fit.Template rendered to the content DOM element.
		// The reason for this can be found in setContentHeight() where a fixed height is being calculated,
		// based on whether title and/or button(s) have been added, and assigned to the content element of the
		// dialog. Therefore, in this case, changing the content of the content element through DOM (or an
		// instance of Fit.Template) will not change the dimension of the content element, and therefore not
		// trigger the mutation observer.
		// The external code using the dialog must call a public function which in turn calls setContentHeight(),
		// to have the dialog resize to its newly updated content - e.g. close and re-open the dialog, or update
		// the title like dia.Title(dia.Title()).
		// Making the observer monitor the entire dialog's DOM using the 'deep' flag would solve this problem in
		// most causes, although not when dimensions change using styling (e.g. .style.height).
		// Also, it would be more expensive, and could trigger height calculation even when not necessary, e.g.
		// when changing a selection in a drop down control which changes the DOM.
		mutationObserverId = Fit.Events.AddMutationObserver(dialog, function(elm)
		{
			setContentHeight();
			updatePosition();
		});

		resizeHandlerId = Fit.Events.AddHandler(window, "resize", function(e)
		{
			setContentHeight();
			updatePosition();
		});
	}

	/// <function container="Fit.Controls.Dialog" name="Close" access="public">
	/// 	<description> Close dialog </description>
	/// </function>
	this.Close = function()
	{
		if (me.IsOpen() === false)
			return;

		if (isClosing === true) // Guard against infinite loop if Dispose(), which calls Close(), is called from within an OnClose handler
			return;

		var canceled = false;
		isClosing = true;

		Fit.Array.ForEach(onCloseHandlers, function(cb)
		{
			if (cb(me) === false)
			{
				canceled = true;
				return false; // Break loop
			}
		});

		isClosing = false;

		if (canceled === true)
			return;

		if (me !== null) // me is null if dialog was disposed from within an OnClose handler
		{
			Fit.Events.RemoveMutationObserver(mutationObserverId);
			mutationObserverId = -1;

			Fit.Events.RemoveHandler(window, resizeHandlerId);
			resizeHandlerId = -1;

			Fit.Dom.Remove(dialog);

			if (layer !== null)
				Fit.Dom.Remove(layer);
		}
	}

	this.Render = function(toElement) // Override Render() on Fit.Controls.Component
	{
		Fit.Validation.ThrowError("Use Open function to open Dialog");
	}

	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		me.Close(); // Closes and triggers OnClose event, but only if dialog is open

		if (me === null) // me is null if dialog was disposed from within an OnClose handler
		{
			return;
		}

		if (layer !== null)
		{
			Fit.Dom.Remove(layer);
		}

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

		if (resizeHandlerId !== -1)
		{
			Fit.Events.RemoveHandler(window, resizeHandlerId);
		}

		me = dialog = title = titleButtons = cmdMaximize = cmdDismiss = content = buttons = modal = layer = width = minWidth = maxWidth = height = minHeight = maxHeight = mutationObserverId = resizeHandlerId = onDismissHandlers = onCloseHandlers = isClosing = null;

		base();
	});

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.Dialog" name="OnDismiss" access="public">
	/// 	<description>
	/// 		Add event handler fired when dialog is being dismissed by the user.
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

	/// <function container="Fit.Controls.Dialog" name="OnClose" access="public">
	/// 	<description>
	/// 		Add event handler fired when dialog is closed or dismissed.
	/// 		Use this event to react to dialog being closed, no matter
	/// 		the cause. Use OnDismiss event to detect when user closed it.
	/// 		Action can be suppressed by returning False.
	/// 		Function receives one argument: Sender (Fit.Controls.Dialog)
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnClose = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onCloseHandlers, cb);
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
		// have been added. If no title/buttons are added, the content element simply
		// adjusts to the height of the dialog.

		content.style.height = "";

		if ((buttons !== null || title !== null) && (me.Maximized() === true || me.Height().Value !== -1 || me.MinimumHeight().Value !== -1 || me.MaximumHeight().Value !== -1))
		{
			var dh = dialog.offsetHeight;
			var th = (title !== null ? title.offsetHeight : 0);
			var bh = (buttons !== null ? buttons.offsetHeight : 0);

			content.style.height = (dh - th - bh) + "px";
		}
	}

	function updatePosition()
	{
		if (me.IsOpen() === false)
			return;

		var elm = me.GetDomElement();

		// Updating the position may actually cause content to change dimensions,
		// which in turn triggers the Mutation Observer registered to monitor the
		// dialog element, which in turn triggers updatePosition() again.
		// So this may result in dialog bouncing around a few times, especially when
		// using tables with dynamic cell widths within the content area.
		// The reason for this is because when the dialog is pushed to the right side
		// of the viewport (when centered), it may be sqeezed if sufficient space is not
		// available for the content, which may happen when the dialog is configured to scale
		// with the content (default behaviour when no dimensions are set). This results in
		// the Mutation Observer being triggered which in turn causes updatePosition()
		// to be called again.
		// Resetting the position reduces the risk of this happening since it allows
		// for the content of the dialog to consume the space it needs, without
		// causing resizing of the content once the dialog is positioned further down.
		elm.style.left = "0px";
		elm.style.top = "0px";

		var dim = Fit.Browser.GetViewPortDimensions();
		var offsetLeft = Math.floor((dim.Width / 2) - (elm.offsetWidth / 2));	// Center horizontally - place center of dialog 1/2 (50%) from the left
		var offsetTop = Math.floor((dim.Height / 3) - (elm.offsetHeight / 2));	// Place center of dialog 1/3 (33%) from the top

		if (offsetTop < 0)
			offsetTop = 0;
		if (offsetLeft < 0)
			offsetLeft = 0;

		elm.style.left = offsetLeft + "px";
		elm.style.top = offsetTop + "px";
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

	// Create dialog

	var d = new Fit.Controls.Dialog();
	d.Content(content.replace(/\n/g, "<br>"));
	d.Modal(true);
	Fit.Dom.AddClass(d.GetDomElement(), "FitUiControlDialogBase");

	// Declare buttons

	var cmdOk = new Fit.Controls.Button();
	var cmdCancel = null;

	// Localization

	var localize = function()
	{
		var locale = Fit.Internationalization.GetLocale(d);

		cmdOk.Title(locale.Ok);

		if (cmdCancel !== null)
			cmdCancel.Title(locale.Cancel);
	};

	Fit.Internationalization.OnLocaleChanged(localize);

	// Configure and add buttons

	cmdOk.Icon("check");
	cmdOk.Type(Fit.Controls.ButtonType.Success);
	cmdOk.OnClick(function(sender)
	{
		Fit.Internationalization.RemoveOnLocaleChanged(localize);

		d.Dispose();

		if (Fit.Validation.IsSet(cb) === true)
			cb(true);
	});
	d.AddButton(cmdOk);

	if (showCancel === true)
	{
		cmdCancel = new Fit.Controls.Button();
		cmdCancel.Icon("ban");
		cmdCancel.Type(Fit.Controls.ButtonType.Danger);
		cmdCancel.OnClick(function(sender)
		{
			Fit.Internationalization.RemoveOnLocaleChanged(localize);

			d.Dispose();

			if (Fit.Validation.IsSet(cb) === true)
				cb(false);
		});
		d.AddButton(cmdCancel);
	}

	localize();

	// Open dialog

	return { Dialog: d, ConfirmButton: cmdOk, CancelButton: cmdCancel }; // NOTICE: CancelButton might be null !
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

	var baseDialog = Fit.Controls.Dialog._internal.BaseDialog(content, false, function(res)
	{
		if (Fit.Validation.IsSet(cb) === true)
			cb();
	});
	baseDialog.Dialog.Open();
	baseDialog.ConfirmButton.Focused(true);
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

	var baseDialog = Fit.Controls.Dialog._internal.BaseDialog(content, true, cb);
	baseDialog.Dialog.Open();
	baseDialog.ConfirmButton.Focused(true);
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

	var baseDialog = Fit.Controls.Dialog._internal.BaseDialog(content + "<br><br>", true, function(res)
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

	Fit.Events.AddHandler(baseDialog.Dialog.GetDomElement(), "keydown", function(e)
	{
		if (e.keyCode === 13 && txt.Focused() === true) // ENTER
		{
			baseDialog.ConfirmButton.Click();
		}
		else if (e.keyCode === 27) // ESC
		{
			baseDialog.CancelButton.Click();
		}
	});

	Fit.Dom.Add(baseDialog.Dialog.GetContentDomElement(), txt.GetDomElement());

	baseDialog.Dialog.Open();
	txt.Focused(true);
}
