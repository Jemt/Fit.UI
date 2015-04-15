Fit.Controls.Input = function(ctlId)
{
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var orgVal = "";
	var preVal = "";
	var cmdResize = null;
	var designEditor = null;
	var wasMultiLineBefore = false;

	// Init

	var input = document.createElement("input");
	input.name = me.GetId();
	input.autocomplete = "off";
	input.onkeyup = function()
	{
		if (me.GetValue()/*input.value*/ !== preVal)
		{
			preVal = me.GetValue(); //input.value;
			me._internal.FireOnChange();
		}
	}
	input.onchange = function() // OnKeyUp does not catch changes by mouse (e.g. paste or moving selected text)
	{
		input.onkeyup();
	}
	me._internal.AddDomElement(input);

	me.AddCssClass("FitUiControlInput");

	// Public

	this.Focus = function()
	{
		if (designEditor !== null)
			designEditor.focus();
		else
			input.focus();
	}

	this.SetValue = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		orgVal = val;
		preVal = val;

		if (designEditor !== null)
			CKEDITOR.instances[me.GetId() + "_DesignMode"].setData(((val !== undefined && val !== null) ? val : ""));
		else
			input.value = ((val !== undefined && val !== null) ? val : "");
	}

	this.GetValue = function()
	{
		if (designEditor !== null)
			return CKEDITOR.instances[me.GetId() + "_DesignMode"].getData();

		return input.value;
	}

	this.IsDirty = function()
	{
		return (orgVal !== me.GetValue());
	}

	this.Clear = function()
	{
		me.SetValue("");
	}

	var baseDispose = me.Dispose;
	this.Dispose = function()
	{
		if (designEditor !== null)
		{
			designEditor.destroy();
			designEditor = null;
		}

		// TODO: Dispose all private objects and DOMElements!!

		baseDispose();
	}

	var baseSetWidth = me.SetWidth;
	this.SetWidth = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectString(unit, true);

		baseSetWidth(val, unit);
		updateDesignEditorSize();
	}

	var baseSetHeight = me.SetHeight;
	this.SetHeight = function(val, unit, callerIsSetMaximize)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectString(unit, true);

		baseSetHeight(val, unit);
		updateDesignEditorSize();

		// Maximizable must be configured again if height is changed, since its Min/Max Height is based on the old height.
		// Maximized may have been configured with Min/Max set to 200/400, but if SetHeight is called with a size of 800,
		// it would be really odd to have it "maximize" to 400, and "minimize" to 800.
		if (me.GetMaximizable() === true && callerIsSetMaximize === undefined)
			me.SetMaximizable(true);
	}

	this.SetMultiLine = function(enable)
	{
		if (me.GetDesignMode() === true)
			me.SetDesignMode(false);

		if (enable === true && input.tagName === "INPUT")
		{
			var oldInput = input;
			me._internal.RemoveDomElement(oldInput);

			input = document.createElement("textarea");
			input.name = me.GetId();
			input.value = oldInput.value;
			input.onkeyup = oldInput.onkeyup;
			me._internal.AddDomElement(input);

			if (me.GetHeight().Value === -1)
				me.SetHeight(150);
		}
		else if (enable === false && input.tagName === "TEXTAREA")
		{
			var oldInput = input;
			me._internal.RemoveDomElement(oldInput);

			if (cmdResize !== null)
			{
				me._internal.RemoveDomElement(cmdResize);
				cmdResize = null;
			}

			input = document.createElement("input");
			input.value = oldInput.value;
			input.onkeyup = oldInput.onkeyup;
			me._internal.AddDomElement(input);

			me.SetHeight(null);

			wasMultiLineBefore = false;
		}
	}

	this.GetMultiLine = function()
	{
		return (input.tagName === "TEXTAREA" && designEditor === null);
	}

	var minimizeHeight = -1;
	var maximizeHeight = -1;
	var minMaxUnit = null;
	this.SetMaximizable = function(enable, heightMax) // maxHeight is considered same unit as specified with SetHeight(..)
	{
		if (enable === true)
		{
			if (me.GetMultiLine() === true)
				wasMultiLineBefore = true;

			if (me.GetMultiLine() === false && designEditor === null)
				me.SetMultiLine(true);

			// Create maximize/minimize button

			if (cmdResize !== null) // Already maximizable, avoid multiple buttons
				me._internal.RemoveDomElement(cmdResize);

			var h = me.GetHeight();
			var unit = ((h.Value !== -1) ? h.Unit : "px");
			var minHeight = ((h.Value !== -1) ? h.Value : 150);
			var maxHeight = ((heightMax !== undefined) ? heightMax : minHeight * 2);

			minimizeHeight = minHeight;
			maximizeHeight = maxHeight;
			minMaxUnit = unit;

			cmdResize = document.createElement("span");
			cmdResize.onclick = function()
			{
				if (Fit.Dom.HasClass(cmdResize, "fa-chevron-up") === true) // Minimize
				{
					//me.SetHeight(((minHeight !== undefined) ? minHeight : 100), unit);
					me.SetHeight(minHeight, unit, true);
					Fit.Dom.RemoveClass(cmdResize, "fa-chevron-up");
					Fit.Dom.AddClass(cmdResize, "fa-chevron-down");
				}
				else // Maximize
				{
					//me.SetHeight(((maxHeight !== undefined) ? maxHeight : 300), unit);
					me.SetHeight(maxHeight, unit, true);
					Fit.Dom.RemoveClass(cmdResize, "fa-chevron-down");
					Fit.Dom.AddClass(cmdResize, "fa-chevron-up");
				}
			}
			Fit.Dom.AddClass(cmdResize, "fa");
			Fit.Dom.AddClass(cmdResize, "fa-chevron-down");
			me._internal.AddDomElement(cmdResize);

			// Set initial height
			me.SetHeight(minHeight, unit, true);
		}
		else if (enable === false && cmdResize !== null)
		{
			me._internal.RemoveDomElement(cmdResize);
			cmdResize = null;

			if (wasMultiLineBefore === true)
				me.SetHeight(minimizeHeight, minMaxUnit);
			else
				me.SetMultiLine(false);
		}
	}

	this.GetMaximizable = function()
	{
		return (cmdResize !== null);
	}

	this.SetDesignMode = function(enable) // NOTICE: IE7 is NOT supported by CKEditor 4.4.6 !
	{
		if (enable === true && designEditor === null)
		{
			if (me.GetMultiLine() === true)
				wasMultiLineBefore = true;

			me.SetMultiLine(true);

			input.id = me.GetId() + "_DesignMode";

			if (window.CKEDITOR !== undefined)
			{
				createEditor();
			}
			else
			{
				Fit.Loader.LoadScript(Fit._internal.BasePath + "/Resources/CKEditor/ckeditor.js", function(src)
				{
					createEditor();
				});
			}
		}
		else if (enable === false && designEditor !== null)
		{
			designEditor.destroy(); // Editor content automatically moved to textarea field when destroyed
			designEditor = null;

			if (wasMultiLineBefore === false)
				me.SetMultiLine(false);
		}
	}

	this.GetDesignMode = function()
	{
		return (designEditor !== null);
	}

	function createEditor()
	{
		// Prevent the following error: Uncaught TypeError: Cannot read property 'getEditor' of undefined
		// It seems CKEDITOR is not happy about initializing multiple instances at once.
		if (CKEDITOR._loading === true)
		{
			setTimeout(createEditor, 100);
			return;
		}
		CKEDITOR._loading = true;
		CKEDITOR.on("instanceLoaded", function () { CKEDITOR._loading = false; });

		// Create editor

		designEditor = CKEDITOR.replace(me.GetId() + "_DesignMode",
		{
			allowedContent: true, // http://docs.ckeditor.com/#!/guide/dev_allowed_content_rules
			extraPlugins: "justify",
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
					// Start with a usuable height
					var h = me.GetHeight();
					me.SetHeight(((h.Value >= 150) ? h.Value : 150));

					if (me.GetMaximizable() === true)
						me.SetMaximizable(true, ((maximizeHeight >= 300) ? maximizeHeight : 300));
				},
				change: function()
				{
					input.onkeyup();
				}
			}
		});
	}

	function updateDesignEditorSize()
	{
		if (designEditor !== null)
		{
			var w = me.GetWidth();
			var h = me.GetHeight();

			// CKEditor contains a bug that prevents us from resizing
			// with a CSS unit, so currently only pixels are supported.

			if (w.Unit !== "px" || h.Unit !== "px")
				throw new Error("DesignMode does not support resizing in units different from px");

			/*if (h.Value < 150)
			{
				me.SetHeight(150); // Causes updateDesignEditorSize() to be called again
				return;
			}*/

			//designEditor.resize(w.Value + w.Unit, h.Value + h.Unit);
			designEditor.resize(w.Value, ((h.Value !== -1) ? h.Value : 200));
		}
	}
}
