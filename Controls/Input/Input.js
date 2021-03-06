/// <container name="Fit.Controls.Input" extends="Fit.Controls.ControlBase">
/// 	Input control which allows for one or multiple lines of
/// 	text, and features a Design Mode for rich HTML content.
/// 	Extending from Fit.Controls.ControlBase.
/// </container>

/// <function container="Fit.Controls.Input" name="Input" access="public">
/// 	<description> Create instance of Input control </description>
/// 	<param name="ctlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.Input = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId, true);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var orgVal = "";
	var preVal = "";
	var input = null;
	var cmdResize = null;
	var designEditor = null;
	var wasMultiLineBefore = false;
	var minimizeHeight = -1;
	var maximizeHeight = -1;
	var minMaxUnit = null;
	var mutationObserverId = -1;
	var rootedEventId = -1;
	var createWhenReadyIntervalId = -1;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	// ============================================
	// Init
	// ============================================

	function init()
	{
		input = document.createElement("input");
		input.type = "text";
		input.autocomplete = "off";
		input.spellcheck = true;
		input.onkeyup = function()
		{
			if (me.Value() !== preVal)
			{
				preVal = me.Value();
				me._internal.FireOnChange();
			}
		}
		input.onchange = function() // OnKeyUp does not catch changes by mouse (e.g. paste or moving selected text)
		{
			if (me === null)
			{
				// Fix for Chrome which fires OnChange and OnBlur (in both capturering and bubbling phase)
				// if control has focus while being removed from DOM, e.g. if used in a dialog closed using ESC.
				// More details here: https://bugs.chromium.org/p/chromium/issues/detail?id=866242
				return;
			}

			input.onkeyup();
		}
		me._internal.AddDomElement(input);

		me.AddCssClass("FitUiControlInput");

		me._internal.Data("multiline", "false");
		me._internal.Data("maximizable", "false");
		me._internal.Data("maximized", "false");
		me._internal.Data("designmode", "false");

		Fit.Internationalization.OnLocaleChanged(localize);
	}

	// ============================================
	// Public - overrides
	// ============================================

	// See documentation on ControlBase
	this.Enabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && val !== me.Enabled())
		{
			me._internal.Data("enabled", val === true ? "true" : "false");

			input.disabled = val === false;

			if (designEditor !== null && designEditor._isReadyForInteraction === true) // ReadOnly mode will be set when instance is ready, if not ready at this time
			{
				designEditor.setReadOnly(input.disabled);

				// Unfortunately there is no API for changing the tabIndex
				designEditor.container.$.querySelector("[contenteditable]").tabIndex = input.disabled === true ? -1 : 0;
			}

			me._internal.UpdateInternalState();
			me._internal.Repaint();
		}

		return me._internal.Data("enabled") === "true";
	}

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		var elm = ((designEditor !== null) ? designEditor : input); // Notice: designEditor is an instance of CKEditor, not a DOM element

		if (Fit.Validation.IsSet(focus) === true)
		{
			if (focus === true)
			{
				if (Fit._internal.Controls.Input.ActiveEditorForDialog === me)
				{
					// Remove flag used to auto close editor dialog, in case Focused(false)
					// was called followed by Focused(true), while editor dialog was loading.
					delete Fit._internal.Controls.Input.ActiveDialogForEditorCanceled;
				}

				elm.focus();
			}
			else // Remove focus
			{
				if (designEditor !== null)
				{
					if (Fit._internal.Controls.Input.ActiveEditorForDialog === me)
					{
						if (Fit._internal.Controls.Input.ActiveDialogForEditor !== null)
						{
							// A dialog (e.g. link or image dialog) is currently open, and will now be closed

							// Hide dialog - fires dialog's OnHide event and returns focus to editor
							Fit._internal.Controls.Input.ActiveDialogForEditor.hide();

							// CKEditor instance has no blur() function, so we call blur() on DOM element currently focused within CKEditor
							Fit.Dom.GetFocused().blur();

							// Fire OnBlur manually as blur() above didn't trigger this, as it normally
							// would. The call to the dialog's hide() function fires its OnHide event
							// which disables the focus lock, but does so asynchronously, which is
							// why OnBlur does not fire via ControlBase's onfocusout handler.
							me._internal.FireOnBlur();
						}
						else
						{
							// A dialog (e.g. link or image dialog) is currently loading. This situation
							// can be triggered for debugging purposes by adding the following code in the
							// beforeCommandExec event handler:
							// setTimeout(function() { me.Focused(false); }, 0);
							// Alternatively register an onwheel/onscroll handler on the document that
							// removes focus from the control, and quickly scroll the document while the
							// dialog is loading. Use network throttling to increase the load time of the
							// dialog if necessary.

							// Make dialog close automatically when loaded and shown - handled in dialog's OnShow event handler
							Fit._internal.Controls.Input.ActiveDialogForEditorCanceled = true;

							// CKEditor instance has no blur() function, so we call blur() on DOM element currently focused within CKEditor.
							// Notice that OnBlur does not fire immediately (focus state is locked), but does so when dialog's OnHide event fires (async).
							// While we could fire it immediately and prevent it from firing when the dialog's OnHide event fires, it would prevent
							// developers from using the OnBlur event to dispose a control in Design Mode, since CKEditor fails when being disposed
							// while dialogs are open. Focused() will return False after the call to blur() below though - as expected.
							Fit.Dom.GetFocused().blur();
						}
					}
					else
					{
						// Make sure this control is focused so that one control instance can not
						// be used to accidentially remove focus from another control instance.
						if (Fit.Dom.Contained(me.GetDomElement(), Fit.Dom.GetFocused()) === true)
						{
							// CKEditor instance has no blur() function, so we call blur() on DOM element currently focused within CKEditor
							Fit.Dom.GetFocused().blur();
						}
					}
				}
				else
				{
					elm.blur();
				}
			}
		}

		if (designEditor !== null)
		{
			// Considered focused if a dialog is opened.
			// DISABLED:
			// Only one element on a page can be focused, and with this approach, two individual
			// controls could both return True from Focused() which does not seem appropriate.
			/*if (Fit._internal.Controls.Input.ActiveEditorForDialog === me)
				return true;*/

			return Fit.Dom.Contained(me.GetDomElement(), Fit.Dom.GetFocused());
		}

		return (Fit.Dom.GetFocused() === elm);
	}

	// See documentation on ControlBase
	this.Value = function(val, preserveDirtyState)
	{
		Fit.Validation.ExpectString(val, true);
		Fit.Validation.ExpectBoolean(preserveDirtyState, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			var fireOnChange = (designEditor === null && me.Value() !== val); // DesignEditor invokes input.onchange() if value is changed

			orgVal = (preserveDirtyState !== true ? val : orgVal);
			preVal = val;

			if (designEditor !== null)
				CKEDITOR.instances[me.GetId() + "_DesignMode"].setData(val);
			else
				input.value = val;

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		if (designEditor !== null)
			return CKEDITOR.instances[me.GetId() + "_DesignMode"].getData();

		return input.value;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		return (orgVal !== me.Value());
	}

	// See documentation on ControlBase
	this.Clear = function()
	{
		me.Value("");
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		// This will destroy control - it will no longer work!

		if (Fit._internal.Controls.Input.ActiveEditorForDialog === me)
		{
			if (Fit._internal.Controls.Input.ActiveDialogForEditor === null)
			{
				// Dialog is currently loading.
				// CKEditor will throw an error if disposed while a dialog (e.g. the link dialog) is loading,
				// leaving a modal layer on the page behind, making it unusable. This may happen if disposed
				// from e.g. a DOM event handler, a mutation observer, a timer, or an AJAX request. The input control
				// itself does not fire any events while the dialog is loading which could trigger this situation, so
				// this can only happen from "external code".

				// WARNING: This has the potential to leak memory if dialog never loads and resumes task of disposing control!
				Fit._internal.Controls.Input.ActiveEditorForDialogDestroyed = designEditor;
				Fit.Dom.Remove(me.GetDomElement());

				// Detect memory leak
				/* setTimeout(function()
				{
					if (me !== null)
					{
						Fit.Browser.Log("WARNING: Input in DesignMode was not properly disposed in time - potential memory leak detected");
					}
				}, 5000); // Usually the load time for a dialog is barely measurable, so 5 seconds seems sufficient */

				return;
			}
			else
			{
				Fit._internal.Controls.Input.ActiveDialogForEditor.hide(); // Fires dialog's OnHide event
			}
		}

		if (designEditor !== null)
		{
			// Destroying editor also fires OnHide event for any dialog currently open, which will clean up
			// Fit._internal.Controls.Input.ActiveEditorForDialog;
			// Fit._internal.Controls.Input.ActiveEditorForDialogDestroyed;
			// Fit._internal.Controls.Input.ActiveEditorForDialogDisabledPostponed;
			// Fit._internal.Controls.Input.ActiveDialogForEditor;
			// Fit._internal.Controls.Input.ActiveDialogForEditorCanceled;

			designEditor.destroy();
		}

		Fit.Internationalization.RemoveOnLocaleChanged(localize);

		if (mutationObserverId !== -1)
		{
			Fit.Events.RemoveMutationObserver(mutationObserverId);
		}

		if (rootedEventId !== -1)
		{
			Fit.Events.RemoveHandler(me.GetDomElement(), rootedEventId);
		}

		if (createWhenReadyIntervalId !== -1)
		{
			clearInterval(createWhenReadyIntervalId);
		}

		me = orgVal = preVal = input = cmdResize = designEditor = wasMultiLineBefore = minimizeHeight = maximizeHeight = minMaxUnit = mutationObserverId = rootedEventId = createWhenReadyIntervalId = isIe8 = null;

		base();
	});

	// See documentation on ControlBase
	this.Width = Fit.Core.CreateOverride(this.Width, function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			base(val, unit);
			updateDesignEditorSize();
		}

		return base();
	});

	// See documentation on ControlBase
	this.Height = Fit.Core.CreateOverride(this.Height, function(val, unit, suppressMinMax)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);
		Fit.Validation.ExpectBoolean(suppressMinMax, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			var h = base(val, unit);
			updateDesignEditorSize(); // Throws error if in DesignMode and unit is not px

			if (me.Maximizable() === true && suppressMinMax !== true)
			{
				minimizeHeight = h.Value;
				maximizeHeight = ((maximizeHeight > h.Value && h.Unit === minMaxUnit) ? maximizeHeight : h.Value * 2)
				minMaxUnit = h.Unit;

				me.Maximized(false);
			}
		}

		return base();
	});

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.Input" name="Placeholder" access="public" returns="string">
	/// 	<description> Get/set value used as a placeholder to indicate expected input on supported browsers </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, value is set as placeholder </param>
	/// </function>
	this.Placeholder = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			input.placeholder = val;
		}

		return (input.placeholder ? input.placeholder : "");
	}

	/// <function container="Fit.Controls.Input" name="CheckSpelling" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control should have spell checking enabled (default) or disabled </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, true enables spell checking while false disables it </param>
	/// </function>
	this.CheckSpelling = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val !== input.spellcheck)
			{
				input.spellcheck = val;

				if (me.DesignMode() === true)
				{
					reloadEditor();
				}
			}
		}

		return input.spellcheck;
	}

	/// <function container="Fit.Controls.Input" name="Type" access="public" returns="Fit.Controls.InputType">
	/// 	<description> Get/set input type (e.g. Text, Password, Email, etc.) </description>
	/// 	<param name="val" type="Fit.Controls.InputType" default="undefined"> If defined, input type is changed to specified value </param>
	/// </function>
	this.Type = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (Fit.Validation.IsSet(Fit.Controls.InputType[val]) === false || val === Fit.Controls.InputType.Unknown)
				Fit.Validation.ThrowError("Unsupported input type specified - use e.g. Fit.Controls.InputType.Text");

			if (val === Fit.Controls.InputType.Textarea)
			{
				me.MultiLine(true);
			}
			else
			{
				me.MultiLine(false);

				if (val === Fit.Controls.InputType.Color)
					input.type = "color";
				else if (val === Fit.Controls.InputType.Date)
					input.type = "date";
				else if (val === Fit.Controls.InputType.DateTime)
					input.type = "datetime";
				else if (val === Fit.Controls.InputType.Email)
					input.type = "email";
				else if (val === Fit.Controls.InputType.Month)
					input.type = "month";
				else if (val === Fit.Controls.InputType.Number)
					input.type = "number";
				else if (val === Fit.Controls.InputType.Password)
					input.type = "password";
				else if (val === Fit.Controls.InputType.PhoneNumber)
					input.type = "tel";
				else if (val === Fit.Controls.InputType.Text)
					input.type = "text";
				else if (val === Fit.Controls.InputType.Time)
					input.type = "time";
				else if (val === Fit.Controls.InputType.Week)
					input.type = "week";
			}
		}

		if (me.MultiLine() === true || me.DesignMode() === true)
			return Fit.Controls.InputType.Textarea;
		else if (input.type === "color")
			return Fit.Controls.InputType.Color;
		else if (input.type === "date")
			return Fit.Controls.InputType.Date;
		else if (input.type === "datetime")
			return Fit.Controls.InputType.DateTime;
		else if (input.type === "email")
			return Fit.Controls.InputType.Email;
		else if (input.type === "month")
			return Fit.Controls.InputType.Month;
		else if (input.type === "number")
			return Fit.Controls.InputType.Number;
		else if (input.type === "password")
			return Fit.Controls.InputType.Password;
		else if (input.type === "tel")
			return Fit.Controls.InputType.PhoneNumber;
		else if (input.type === "text")
			return Fit.Controls.InputType.Text;
		else if (input.type === "time")
			return Fit.Controls.InputType.Time;
		else if (input.type === "week")
			return Fit.Controls.InputType.Week;

		return Fit.Controls.InputType.Unknown; // Only happens if someone changed the type to an unsupported value through the DOM (e.g. hidden or checkbox)
	}

	/// <function container="Fit.Controls.Input" name="MultiLine" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is in Multi Line mode (textarea) </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables Multi Line mode, False disables it </param>
	/// </function>
	this.MultiLine = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (me.DesignMode() === true)
				me.DesignMode(false);

			if (val === true && input.tagName === "INPUT")
			{
				var focused = me.Focused();

				var oldInput = input;
				me._internal.RemoveDomElement(oldInput);

				input = document.createElement("textarea");
				input.value = oldInput.value;
				input.spellcheck = oldInput.spellcheck;
				input.placeholder = oldInput.placeholder;
				input.disabled = oldInput.disabled;
				input.onkeyup = oldInput.onkeyup;
				input.onchange = oldInput.onchange;
				me._internal.AddDomElement(input);

				if (me.Height().Value === -1)
					me.Height(150);

				if (focused === true)
					input.focus();

				me._internal.Data("multiline", "true");
				repaint();
			}
			else if (val === false && input.tagName === "TEXTAREA")
			{
				var focused = me.Focused();

				var oldInput = input;
				me._internal.RemoveDomElement(oldInput);

				if (cmdResize !== null)
				{
					me._internal.RemoveDomElement(cmdResize);
					cmdResize = null;

					me._internal.Data("maximized", "false");
					me._internal.Data("maximizable", "false");
					repaint();
				}

				input = document.createElement("input");
				input.autocomplete = "off";
				input.type = "text";
				input.value = oldInput.value;
				input.spellcheck = oldInput.spellcheck;
				input.placeholder = oldInput.placeholder;
				input.disabled = oldInput.disabled;
				input.onkeyup = oldInput.onkeyup;
				input.onchange = oldInput.onchange;
				me._internal.AddDomElement(input);

				me.Height(-1);

				if (focused === true)
					input.focus();

				wasMultiLineBefore = false;

				me._internal.Data("multiline", "false");
				repaint();
			}
		}

		return (input.tagName === "TEXTAREA" && designEditor === null);
	}

	/// <function container="Fit.Controls.Input" name="Maximizable" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is maximizable </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables maximize button, False disables it </param>
	/// 	<param name="heightMax" type="number" default="undefined">
	/// 		If defined, this becomes the height of the input control when maximized.
	/// 		The value is considered the same unit set using Height(..) which defaults to px.
	/// 		However, if DesignMode is enabled, the value unit is considered to be px.
	/// 	</param>
	/// </function>
	this.Maximizable = function(val, heightMax)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectNumber(heightMax, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true && cmdResize === null)
			{
				if (me.MultiLine() === true)
					wasMultiLineBefore = true;

				if (me.MultiLine() === false && designEditor === null)
					me.MultiLine(true);

				// Determine height to use when maximizing and minimizing

				var h = me.Height();

				if (designEditor === null)
				{
					minimizeHeight = h.Value;
					maximizeHeight = ((Fit.Validation.IsSet(heightMax) === true) ? heightMax : ((minimizeHeight !== -1) ? minimizeHeight * 2 : 150));
					minMaxUnit = h.Unit;
				}
				else
				{
					minimizeHeight = h.Value;
					maximizeHeight = ((Fit.Validation.IsSet(heightMax) === true) ? heightMax : ((minimizeHeight !== -1) ? minimizeHeight * 2 : 300));
					minMaxUnit = "px";
				}

				// Create maximize/minimize button

				cmdResize = document.createElement("span");
				cmdResize.tabIndex = -1; // Allow button to temporarily gain focus so control does not fire OnBlur
				cmdResize.onclick = function()
				{
					me.Maximized(!me.Maximized());
					me.Focused(true);
				}
				Fit.Dom.AddClass(cmdResize, "fa");
				Fit.Dom.AddClass(cmdResize, "fa-chevron-down");
				me._internal.AddDomElement(cmdResize);

				me._internal.Data("maximizable", "true");
				repaint();
			}
			else if (val === false && cmdResize !== null)
			{
				me._internal.RemoveDomElement(cmdResize);
				cmdResize = null;

				if (wasMultiLineBefore === true)
					me.Height(minimizeHeight, minMaxUnit);
				else
					me.MultiLine(false);

				me._internal.Data("maximizable", "false"); // Also set in MultiLine(..)
				repaint();
			}
		}

		return (cmdResize !== null);
	}

	/// <function container="Fit.Controls.Input" name="Maximized" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is maximized </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True maximizes control, False minimizes it </param>
	/// </function>
	this.Maximized = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && cmdResize !== null)
		{
			if (val === true && Fit.Dom.HasClass(cmdResize, "fa-chevron-up") === false)
			{
				me.Height(maximizeHeight, minMaxUnit, true);
				Fit.Dom.RemoveClass(cmdResize, "fa-chevron-down");
				Fit.Dom.AddClass(cmdResize, "fa-chevron-up");

				me._internal.Data("maximized", "true");
				repaint();
			}
			else if (val === false && Fit.Dom.HasClass(cmdResize, "fa-chevron-down") === false)
			{
				me.Height(minimizeHeight, minMaxUnit, true);
				Fit.Dom.RemoveClass(cmdResize, "fa-chevron-up");
				Fit.Dom.AddClass(cmdResize, "fa-chevron-down");

				me._internal.Data("maximized", "false"); // Also set in MultiLine(..)
				repaint();
			}
		}

		return (cmdResize !== null && Fit.Dom.HasClass(cmdResize, "fa-chevron-up") === true);
	}

	/// <function container="Fit.Controls.Input" name="DesignMode" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether control is in Design Mode allowing for rich HTML content.
	/// 		Notice that this control type requires dimensions (Width/Height) to be specified in pixels.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables Design Mode, False disables it </param>
	/// </function>
	this.DesignMode = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			var designMode = (me._internal.Data("designmode") === "true");

			if (Fit._internal.Controls.Input.ActiveEditorForDialog === me && Fit._internal.Controls.Input.ActiveEditorForDialogDisabledPostponed === true)
				designMode = false; // Not considered in Design Mode if scheduled to be disabled (postponed because a dialog is currently loading)

			if (val === true && designMode === false)
			{
				if (Fit._internal.Controls.Input.ActiveEditorForDialog === me)
				{
					// Control is actually already in Design Mode, but waiting
					// for dialog to finish loading, so DesignMode can be disabled (scheduled).
					// Remove flag responsible for disabling DesignMode so it remains an editor.
					delete Fit._internal.Controls.Input.ActiveEditorForDialogDisabledPostponed;
					return;
				}

				if (me.MultiLine() === true)
					wasMultiLineBefore = true;
				else
					me.MultiLine(true);

				input.id = me.GetId() + "_DesignMode";

				if (window.CKEDITOR === undefined)
				{
					window.CKEDITOR = null;

					Fit.Loader.LoadScript(Fit.GetUrl() + "/Resources/CKEditor/ckeditor.js", function(src) // Using Fit.GetUrl() rather than Fit.GetPath() to allow editor to be used on e.g. JSFiddle (Cross-Origin Resource Sharing policy)
					{
						// WARNING: Control could potentially have been disposed at this point, but
						// we still need to finalize the configuration of CKEditor which is global.

						if (Fit.Validation.IsSet(Fit._internal.Controls.Input.DefaultSkin) === true)
						{
							CKEDITOR.config.skin = Fit._internal.Controls.Input.DefaultSkin;
						}

						// Register OnShow and OnHide event handlers when a dialog is opened for the first time.
						// IMPORTANT: These event handlers are shared by all input control instances in Design Mode,
						// so we cannot use 'me' to access the current control for which a dialog is opened.
						// Naturally 'me' will always be a reference to the first control that opened a given dialog.
						CKEDITOR.on("dialogDefinition", function(e) // OnDialogDefinition fires only once
						{
							//var dialogName = e.data.name;
							var dialog = e.data.definition.dialog;

							dialog.on("show", function(ev)
							{
								if (Fit._internal.Controls.Input.ActiveDialogForEditorCanceled)
								{
									// Focused(false) was called on control while dialog was loading - close dialog

									if (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() < 9)
									{
										// CKEditor uses setTimeout(..) to focus an input field in the dialog, but if the dialog is
										// closed immediately, that input field will be removed from DOM along with the dialog of course,
										// which in IE8 results in an error:
										// "Can't move focus to the control because it is invisible, not enabled, or of a type that does not accept the focus."
										// Other browsers simply ignore the request to focus a control that is no longer found in DOM.
										setTimeout(function()
										{
											ev.sender.hide(); // Fires OnHide
										}, 100);
									}
									else
									{
										ev.sender.hide(); // Fires OnHide
									}

									return;
								}

								if (Fit._internal.Controls.Input.ActiveEditorForDialog === undefined)
									return; // Control was disposed while waiting for dialog to load and open

								// Keep instance to dialog so we can close it if e.g. Focused(false) is invoked
								Fit._internal.Controls.Input.ActiveDialogForEditor = ev.sender;

								if (Fit._internal.Controls.Input.ActiveEditorForDialogDestroyed)
								{
									// Dispose() was called on control while dialog was loading.
									// Since destroying editor while a dialog is loading would cause
									// an error in CKEditor, the operation has been postponed til dialog's
									// OnShow event fires, and the dialog is ready.
									setTimeout(function()
									{
										// Dispose() calls destroy() on editor which closes dialog and causes the dialog's OnHide event to fire.
										// Dispose() uses Fit._internal.Controls.Input.ActiveDialogForEditor, which is why it is set above, before
										// checking whether control has been destroyed (scheduled for destruction).
										Fit._internal.Controls.Input.ActiveEditorForDialog.Dispose();
									}, 0); // Postponed - CKEditor throws an error if destroyed from OnShow event handler

									return;
								}

								if (Fit._internal.Controls.Input.ActiveEditorForDialogDisabledPostponed)
								{
									setTimeout(function()
									{
										delete Fit._internal.Controls.Input.ActiveEditorForDialogDisabledPostponed;

										// DesignMode(false) calls destroy() on editor which closes dialog and causes the dialog's OnHide event to fire.
										Fit._internal.Controls.Input.ActiveEditorForDialog.DesignMode(false);
									}, 0); // Postponed - CKEditor throws an error if destroyed from OnShow event handler

									return;
								}

								// Move dialog to control - otherwise placed in the root of the document where it pollutes,
								// and makes it impossible to interact with the dialog in light dismissable panels and callouts.
								// Dialog is placed alongside control and not within the control's container, to prevent Fit.UI
								// styling from affecting the dialog.

								var ckeDialogElement = this.getElement().$;
								Fit.Dom.InsertAfter(Fit._internal.Controls.Input.ActiveEditorForDialog.GetDomElement(), ckeDialogElement);

								// 2nd+ time dialog is opened it remains invisible - make it appear and position it
								ckeDialogElement.style.display = !CKEDITOR.env.ie || CKEDITOR.env.edge ? "flex" : ""; // https://github.com/ckeditor/ckeditor4/blob/8b208d05d1338d046cdc8f971c9faf21604dd75d/plugins/dialog/plugin.js#L152
								this.layout(); // 'this' is the dialog instance - layout() positions dialog
							});

							dialog.on("hide", function(ev) // Fires when user closes dialog, or when hide() is called on dialog, or if destroy() is called on editor instance from Dispose() or DesignMode(false)
							{
								var inputControl = Fit._internal.Controls.Input.ActiveEditorForDialog;
								var showCanceledDueToBlur = Fit._internal.Controls.Input.ActiveDialogForEditorCanceled === true;

								// Clean up global references accessible while dialog is open
								delete Fit._internal.Controls.Input.ActiveEditorForDialog;
								delete Fit._internal.Controls.Input.ActiveEditorForDialogDestroyed;
								delete Fit._internal.Controls.Input.ActiveEditorForDialogDisabledPostponed;
								delete Fit._internal.Controls.Input.ActiveDialogForEditor;
								delete Fit._internal.Controls.Input.ActiveDialogForEditorCanceled;

								// Disable focus lock - let ControlBase handle OnFocus and OnBlur automatically again.
								// This is done postponed since unlocking it immediately will cause OnFocus to fire when
								// dialog returns focus to the editor.
								setTimeout(function()
								{
									if (inputControl.GetDomElement() === null)
										return; // Control was disposed - OnHide was fired because destroy() was called on editor instance from Dispose()

									inputControl._internal.FocusStateLocked(false);

									if (showCanceledDueToBlur === true)
									{
										// Undo focus which dialog returned to editor.
										// ControlBase fires OnBlur because focus state was unlocked above.
										Fit.Dom.GetFocused().blur();
									}
								}, 0);
							});
						});

						if (me === null)
							return; // Control was disposed while waiting for jQuery UI to load

						if (me.DesignMode() === false)
							return; // DesignMode was disabled while waiting for resources to load

						createEditor();
					});
				}
				else if (window.CKEDITOR === null)
				{
					if (createWhenReadyIntervalId === -1) // Make sure DesignMode has not been enabled multiple times - e.g. DesignMode(true); DesignMode(false); DesignMode(true); - in which case an interval timer may already be "waiting" for CKEditor resources to finish loading
					{
						createWhenReadyIntervalId = setInterval(function()
						{
							/*if (me === null)
							{
								// Control was disposed while waiting for CKEditor to finish loading
								clearInterval(iId);
								return;
							}*/

							if (window.CKEDITOR !== null)
							{
								clearInterval(createWhenReadyIntervalId);
								createWhenReadyIntervalId = -1;

								// Create editor if still in DesignMode (might have been disabled while waiting for
								// CKEditor resources to finish loading), and if editor has not already been created.
								// Editor may already exist if control had DesignMode enabled, then disabled, and then
								// enabled once again.
								// If the control is the first one to enabled DesignMode, it will start loading CKEditor
								// resources and postpone editor creation until resources have finished loading.
								// When disabled and re-enabled, the control will realize that resources are being loaded,
								// and postpone editor creation once again, this time using the interval timer here.
								// When resources are loaded, it will create the editor instances, and when the interval
								// timer here executes, it will also create the editor instance, unless we prevent it by
								// making sure only to do it if designEditor is null. Without this check we might experience
								// the following warning in the browser console, when editor is being created on the same
								// textarea control multiple times:
								// [CKEDITOR] Error code: editor-element-conflict. {editorName: "64992ea4-bd01-4081-b606-aa9ff23f417b_DesignMode"}
								// [CKEDITOR] For more information about this error go to https://ckeditor.com/docs/ckeditor4/latest/guide/dev_errors.html#editor-element-conflict
								if (me.DesignMode() === true && designEditor === null)
								{
									createEditor();
								}
							}
						}, 500);
					}
				}
				else
				{
					createEditor();
				}

				me._internal.Data("designmode", "true");
				repaint();
			}
			else if (val === false && designMode === true)
			{
				var focused = me.Focused();

				if (Fit._internal.Controls.Input.ActiveEditorForDialog === me)
				{
					if (Fit._internal.Controls.Input.ActiveDialogForEditor !== null)
					{
						focused = true; // Always considered focused when a dialog is open - Focused() returns False which is actually the truth
						Fit._internal.Controls.Input.ActiveDialogForEditor.hide(); // Fires dialog's OnHide event
					}
					else
					{
						// Dialog is still loading - calling designEditor.destroy() below will cause an error,
						// leaving a modal layer on the page behind, making it unusable. This may happen if Design Mode is disabled
						// from e.g. a DOM event handler, a mutation observer, a timer, or an AJAX request. The input control
						// itself does not fire any events while the dialog is loading which could trigger this situation, so
						// this can only happen from "external code".

						// WARNING: This has the potential to leak memory if dialog never loads and resumes task of destroying control!
						Fit._internal.Controls.Input.ActiveEditorForDialogDisabledPostponed = true;

						// Detect memory leak
						/* setTimeout(function()
						{
							if (me !== null && me.DesignMode() === false && Fit._internal.Controls.Input.ActiveEditorForDialog === me)
							{
								Fit.Browser.Log("WARNING: Input in DesignMode was not properly disposed in time - potential memory leak detected");
							}
						}, 5000); // Usually the load time for a dialog is barely measurable, so 5 seconds seems sufficient */

						return;
					}
				}

				// Destroy editor - content is automatically synchronized to input control.
				// Calling destroy() fires OnHide for any dialog currently open, which in turn
				// disables locked focus state and returns focus to the control.
				if (designEditor !== null) // Will be null if DesignMode is being disabled while CKEditor resources are loading, in which case editor has not yet been created - e.g. DesignMode(true); DesignMode(false);
				{
					designEditor.destroy();
					designEditor = null;
				}

				me._internal.Data("designmode", "false");

				if (wasMultiLineBefore === false)
					me.MultiLine(false);

				// Remove tabindex used to prevent control from losing focus when clicking toolbar buttons
				Fit.Dom.Attribute(me.GetDomElement(), "tabindex", null);

				if (focused === true)
				{
					if (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() < 9 && me.MultiLine() === false)
					{
						// On IE8 input.focus() does not work if input field is switched to a single line control
						// above (MultiLine(false)). Wrapping the code in setTimeout(..) solves the problem.

						setTimeout(function()
						{
							if (me === null)
								return; // Control was disposed

							input.focus();
						}, 0);
					}
					else
					{
						input.focus();
					}
				}

				repaint();
			}
		}

		return (me._internal.Data("designmode") === "true");
	}

	// ============================================
	// Private
	// ============================================

	function createEditor()
	{
		// NOTICE: CKEDITOR requires input control to be rooted in DOM.
		// Creating the editor when Render(..) is called is not the solution, since the programmer
		// may call GetDomElement() instead and root the element at any given time which is out of our control.
		// It may be possible to temporarily root the control and make it invisible while the control
		// is being created, and remove it from the DOM when instanceReady is fired. However, since creating
		// the editor is an asynchronous operation, we need to detect whether the element has been rooted
		// elsewhere when instanceCreated is fired, and only remove it from the DOM if this is not the case.
		// This problem needs to be solved some other time as it may spawn other problems, such as determining
		// the size of objects while being invisible. The CKEditor team may also solve the bug in an update.
		if (Fit.Dom.IsRooted(me.GetDomElement()) === false)
		{
			//Fit.Validation.ThrowError("Control must be appended/rendered to DOM before DesignMode can be initialized");

			var retry = function()
			{
				if (Fit.Dom.IsRooted(me.GetDomElement()) === true)
				{
					if (me.DesignMode() === true)
					{
						createEditor();
					}

					return true;
				}

				// Return False to indicate that we still need to keep retrying (still in DesignMode).
				// Otherwie return True to indicate success - retrying is no longer relevant.
				return (me.DesignMode() === true ? false : true);
			};

			setTimeout(function() // Queue to allow control to be rooted
			{
				if (me === null)
				{
					return; // Control was disposed
				}

				if (retry() === false)
				{
					// Still not rooted - add observer to create editor instance once control is rooted

					rootedEventId = Fit.Events.AddHandler(me.GetDomElement(), "#rooted", function(e)
					{
						if (retry() === true || me.DesignMode() === false)
						{
							Fit.Events.RemoveHandler(me.GetDomElement(), rootedEventId);
							rootedEventId = -1;
						}
					});
				}
			}, 0);

			return;
		}

		var langSupport = ["da", "de", "en"];
		var locale = Fit.Internationalization.Locale().length === 2 ? Fit.Internationalization.Locale() : Fit.Internationalization.Locale().substring(0, 2);
		var lang = Fit.Array.Contains(langSupport, locale) === true ? locale : "en";

		// Prevent control from losing focus when HTML editor is initialized,
		// e.g. if Design Mode is enabled when ordinary input control gains focus.
		// This also prevents control from losing focus if toolbar is clicked without
		// hitting a button. A value of -1 makes it focusable, but keeps it out of
		// tab flow (keyboard navigation).
		me.GetDomElement().tabIndex = -1; // TabIndex is removed if DesignMode is disabled

		var focused = me.Focused();
		if (focused === true)
		{
			me.GetDomElement().focus(); // Outer container is focusable - tabIndex set above
		}

		designEditor = CKEDITOR.replace(me.GetId() + "_DesignMode",
		{
			//allowedContent: true, // http://docs.ckeditor.com/#!/guide/dev_allowed_content_rules and http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-allowedContent
			language: lang,
			disableNativeSpellChecker: me.CheckSpelling() === false,
			readOnly: me.Enabled() === false,
			tabIndex: me.Enabled() === false ? -1 : 0,
			title: "",
			startupFocus: focused === true ? "end" : false,
			extraPlugins: "justify,pastefromword",
			toolbar:
			[
				{
					name: "BasicFormatting",
					items: [ "Bold", "Italic", "Underline" ]
				},
				{
					name: "Justify",
					items: [ "JustifyLeft", "JustifyCenter", "JustifyRight" ]
				},
				{
					name: "Lists",
					items: [ "NumberedList", "BulletedList", "Indent", "Outdent" ]
				},
				{
					name: "Links",
					items: [ "Link", "Unlink" ]
				}
			],
			removeButtons: "", // Set to empty string to prevent CKEditor from removing buttons such as Underline
			on:
			{
				instanceReady: function()
				{
					// Enabled state might have been changed while loading.
					// Unfortunately there is no API for changing the tabIndex.
					designEditor.setReadOnly(me.Enabled() === false);
					designEditor.container.$.querySelector("[contenteditable]").tabIndex = me.Enabled() === false ? -1 : 0;

					if (focused === true)
					{
						me.Focused(true); // Focus actual input area rather than outer container temporarily focused further up
					}

					var maximized = me.Maximized(); // Call to Height(..) below will minimize control

					if (maximized === true)
					{
						me.Maximized(false); // Minimize to allow editor to initially assume normal height - maximized again afterwards
					}

					var h = me.Height();
					me.Height(((h.Value >= 150 && h.Unit === "px") ? h.Value : 150));

					if (maximized === true)
					{
						me.Maximized(true);
					}

					designEditor._isReadyForInteraction = true;
				},
				change: function() // CKEditor bug: not fired in Opera 12 (possibly other old versions as well)
				{
					input.onkeyup();
				},
				beforeCommandExec: function(ev)
				{
					if (ev && ev.data && ev.data.command && ev.data.command.dialogName)
					{
						// Command triggered was a dialog

						// IE9-IE11 does not fire OnFocus when user clicks a dialog button directly,
						// without placing the text cursor in the editing area first. To avoid this
						// problem, we simply ignore dialog commands if control does not already
						// have focus. We target all versions of IE for consistency.
						if (me.Focused() === false && Fit.Browser.GetBrowser() === "MSIE")
						{
							ev.cancel();
							return;
						}

						// Prevent multiple control instances from opening a dialog at the same time.
						// This is very unlikely to happen, as it requires the second dialog to be
						// triggered programmatically, since a modal layer is immediately placed on top
						// of the page when clicking a button that opens a dialog, preventing additional
						// interaction with editors.
						// Naturally conflicting CSS causing the modal layer to remain hidden could
						// allow the user to trigger multiple dialogs. Better safe than sorry.
						if (Fit._internal.Controls.Input.ActiveEditorForDialog)
						{
							ev.cancel();
							return;
						}

						// Make sure OnFocus fires before locking focus state

						if (me.Focused() === false)
						{
							// Control not focused - make sure OnFocus fires when a button is clicked,
							// and make sure ControlBase internally considers itself focused, so there is
							// no risk of OnFocus being fire twice without OnBlur firing in between,
							// when focus state is unlocked, and focus is perhaps re-assigned to another
							// DOM element within the control, which will be the case if the design editor
							// is switched back to an ordinary input field (e.g. using DesignMode(false)).
							me.Focused(true);
						}

						// Prevent control from firing OnBlur when dialogs are opened.
						// Notice that locking the focus state will also prevent OnFocus
						// from being fired automatically.
						me._internal.FocusStateLocked(true);

						// Make control available to global dialog event handlers which
						// cannot access individual control instances otherwise.

						Fit._internal.Controls.Input.ActiveEditorForDialog = me;	// Editor instance is needed when OnHide event is fired for dialog on global CKEditor instance
						Fit._internal.Controls.Input.ActiveDialogForEditor = null;	// Dialog instance associated with editor will be set when dialog's OnShow event fires
					}
				}
			}
		});
	}

	function updateDesignEditorSize()
	{
		if (designEditor !== null)
		{
			if (designEditor._isReadyForInteraction !== true)
			{
				// Postpone, editor is not ready yet.
				// This may happen when editor is created and Width(..) is
				// immediately set after creating and mounting the control.
				// https://github.com/Jemt/Fit.UI/issues/34
				// This is a problem because CKEditor uses setTimeout(..) to for instance
				// allow early registration of events, and because resources are loaded
				// in an async. manner.
				setTimeout(updateDesignEditorSize, 100);
				return;
			}

			var w = me.Width();
			var h = me.Height();

			// CKEditor contains a bug that prevents us from resizing
			// with a CSS unit, so currently only pixels are supported.

			if (w.Unit !== "px" || h.Unit !== "px")
				throw new Error("DesignMode does not support resizing in units different from px");

			// Default control width is 200px (defined in Styles.css).
			// NOTICE: resize does not work reliably when editor is hidden, e.g. behind a tab with display:none.
			// The height set will not have the height of the toolbar substracted since the height can not be
			// determined for hidden objects, so the editor will become larger than the value set (height specified + toolbar height).
			// http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-resize
			designEditor.resize(((w.Value > -1) ? w.Value : 200), ((h.Value > -1) ? h.Value : 150));

			// Set mutation observer responsible for updating editor size once it becomes visible

			if (mutationObserverId !== -1) // Cancel any mutation observer previously registered
			{
				Fit.Events.RemoveMutationObserver(mutationObserverId);
				mutationObserverId = -1;
			}

			var concealer = Fit.Dom.GetConcealer(me.GetDomElement()); // Get element hiding editor

			if (concealer !== null) // Editor is hidden - adjust size when it becomes visible
			{
				mutationObserverId = Fit.Events.AddMutationObserver(concealer, function(elm)
				{
					if (Fit.Dom.IsVisible(me.GetDomElement()) === true)
					{
						designEditor.resize(((w.Value > -1) ? w.Value : 200), ((h.Value > -1) ? h.Value : 150));
						disconnect(); // Observers are expensive - remove when no longer needed
					}
				});
			}
		}
	}

	function reloadEditor()
	{
		// Disabling DesignMode brings it back to input or textarea mode.
		// If reverting to input mode, the Height is reset, so we need to preserve that.

		var height = me.Height();
		me.DesignMode(false);
		me.Height(height.Value, height.Unit);
		me.DesignMode(true);
	}

	function localize()
	{
		if (me.DesignMode() === true)
		{
			// Re-create editor with new language
			reloadEditor();
		}
	}

	function repaint()
	{
		if (isIe8 === true)
		{
			me.AddCssClass("FitUi_Non_Existing_Input_Class");
			me.RemoveCssClass("FitUi_Non_Existing_Input_Class");
		}
	}

	init();
}

/// <container name="Fit.Controls.InputType">
/// 	Enum values determining input type
/// </container>
Fit.Controls.InputType =
{
	/// <member container="Fit.Controls.InputType" name="Textarea" access="public" static="true" type="string" default="Textarea">
	/// 	<description> Multi line input field </description>
	/// </member>
	Textarea: "Textarea",

	/// <member container="Fit.Controls.InputType" name="Color" access="public" static="true" type="string" default="Color">
	/// 	<description> Input control useful for entering a color </description>
	/// </member>
	Color: "Color",

	/// <member container="Fit.Controls.InputType" name="Date" access="public" static="true" type="string" default="Date">
	/// 	<description> Input control useful for entering a date </description>
	/// </member>
	Date: "Date",

	/// <member container="Fit.Controls.InputType" name="DateTime" access="public" static="true" type="string" default="DateTime">
	/// 	<description> Input control useful for entering a date and time </description>
	/// </member>
	DateTime: "DateTime",

	/// <member container="Fit.Controls.InputType" name="Email" access="public" static="true" type="string" default="Email">
	/// 	<description> Input control useful for entering an e-mail address </description>
	/// </member>
	Email: "Email",

	/// <member container="Fit.Controls.InputType" name="Month" access="public" static="true" type="string" default="Month">
	/// 	<description> Input control useful for entering a month </description>
	/// </member>
	Month: "Month",

	/// <member container="Fit.Controls.InputType" name="Number" access="public" static="true" type="string" default="Number">
	/// 	<description> Input control useful for entering a number </description>
	/// </member>
	Number: "Number",

	/// <member container="Fit.Controls.InputType" name="Password" access="public" static="true" type="string" default="Password">
	/// 	<description> Input control useful for entering a password (characters are masked) </description>
	/// </member>
	Password: "Password",

	/// <member container="Fit.Controls.InputType" name="PhoneNumber" access="public" static="true" type="string" default="PhoneNumber">
	/// 	<description> Input control useful for entering a phone number </description>
	/// </member>
	PhoneNumber: "PhoneNumber",

	/// <member container="Fit.Controls.InputType" name="Text" access="public" static="true" type="string" default="Text">
	/// 	<description> Input control useful for entering ordinary text </description>
	/// </member>
	Text: "Text",

	/// <member container="Fit.Controls.InputType" name="Time" access="public" static="true" type="string" default="Time">
	/// 	<description> Input control useful for entering time </description>
	/// </member>
	Time: "Time",

	/// <member container="Fit.Controls.InputType" name="Week" access="public" static="true" type="string" default="Week">
	/// 	<description> Input control useful for entering a week number </description>
	/// </member>
	Week: "Week",

	Unknown: "Unknown"
}

Fit.Controls.Input.Type = Fit.Controls.InputType; // Backward compatibility

Fit._internal.Controls.Input = {};
Fit._internal.Controls.Input.DefaultSkin = null; // Notice: CKEditor does not support multiple different skins on the same page - do not change value once an editor has been created
