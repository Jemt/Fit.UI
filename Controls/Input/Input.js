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

	}

	// ============================================
	// Public - overrides
	// ============================================

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		var elm = ((designEditor !== null) ? designEditor : input);

		if (Fit.Validation.IsSet(focus) === true)
		{
			if (focus === true)
				elm.focus();
			else if (elm !== designEditor) // Blur doesn't work for CKEditor!
				elm.blur();
		}

		if (designEditor !== null)
		{
			return (designEditor._focused === true); // Focused element is found in an iFrame so we have to rely on the HTML Editor instance to provide this information
		}

		return (Fit.Dom.GetFocused() === elm);
	}

	// See documentation on ControlBase
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			var fireOnChange = (me.Value() !== val);

			orgVal = val;
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

		if (designEditor !== null)
			designEditor.destroy();

		if (mutationObserverId !== -1)
		{
			Fit.Events.RemoveMutationObserver(mutationObserverId);
		}

		if (rootedEventId !== -1)
		{
			Fit.Events.RemoveHandler(me.GetDomElement(), rootedEventId);
		}

		me = orgVal = preVal = input = cmdResize = designEditor = wasMultiLineBefore = minimizeHeight = maximizeHeight = minMaxUnit = mutationObserverId = rootedEventId = isIe8 = null;

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
			input.spellcheck = val;
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
				var oldInput = input;
				me._internal.RemoveDomElement(oldInput);

				input = document.createElement("textarea");
				input.value = oldInput.value;
				input.spellcheck = oldInput.spellcheck;
				input.onkeyup = oldInput.onkeyup;
				input.onchange = oldInput.onchange;
				me._internal.AddDomElement(input);

				if (me.Height().Value === -1)
					me.Height(150);

				me._internal.Data("multiline", "true");
				repaint();
			}
			else if (val === false && input.tagName === "TEXTAREA")
			{
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
				input.onkeyup = oldInput.onkeyup;
				input.onchange = oldInput.onchange;
				me._internal.AddDomElement(input);

				me.Height(-1);

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
				cmdResize.onclick = function()
				{
					me.Maximized(!me.Maximized());
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

			if (val === true && designMode === false)
			{
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
						if (Fit.Validation.IsSet(Fit._internal.Controls.Input.DefaultSkin) === true)
						{
							CKEDITOR.config.skin = Fit._internal.Controls.Input.DefaultSkin;
						}
						
						createEditor();
					});
				}
				else if (window.CKEDITOR === null)
				{
					var iId = -1;
					iId = setInterval(function()
					{
						if (me === null)
						{
							// Control was disposed while waiting for CKEditor to finish loading
							clearInterval(iId);
							return;
						}

						if (window.CKEDITOR !== null)
						{
							clearInterval(iId);
							createEditor();
						}
					}, 500);
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
				designEditor.destroy(); // Editor content automatically synchronized to input control when destroyed
				designEditor = null;

				if (wasMultiLineBefore === false)
					me.MultiLine(false);

				me._internal.Data("designmode", "false");
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

		designEditor = CKEDITOR.replace(me.GetId() + "_DesignMode",
		{
			//allowedContent: true, // http://docs.ckeditor.com/#!/guide/dev_allowed_content_rules and http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-allowedContent
			language: ((Fit.Browser.GetInfo().Language === "da") ? "da" : "en"), // TODO: Ship with all language files and remove this entry to have CKEditor default to browser language
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
					var h = me.Height();
					me.Height(((h.Value >= 150 && h.Unit === "px") ? h.Value : 150));

					designEditor._isReadyForInteraction = true;
				},
				change: function()
				{
					input.onkeyup();
				},
				focus: function()
				{
					designEditor._focused = true;
					me._internal.FireOnFocus();
				},
				blur: function()
				{
					delete designEditor._focused;
					me._internal.FireOnBlur();
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
