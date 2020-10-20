Fit.Controls = {};
Fit._internal.Controls = {}
Fit._internal.ControlBase = { Controls: {} };

/// <container name="Fit.Controls.Component">
/// 	Class from which all UI components extend
/// </container>
Fit.Controls.Component = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);

	var me = this;
	var id = null;
	var container = null;

	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	function init()
	{
		Fit._internal.Core.EnsureStyles();

		id = (Fit.Validation.IsSet(controlId) === true ? controlId : "Ctl" + Fit.Data.CreateGuid());

		if (Fit._internal.ControlBase.Controls[id] !== undefined)
			Fit.Validation.ThrowError("Control with ID '" + id + "' has already been defined - Control IDs must be unique!");

		Fit._internal.ControlBase.Controls[id] = me;

		container = document.createElement("div");
		container.id = id;
		container._internal = { Instance: me };
	}

	/// <function container="Fit.Controls.Component" name="GetId" access="public" returns="string">
	/// 	<description> Get unique Control ID </description>
	/// </function>
	this.GetId = function()
	{
		return id;
	}

   	/// <function container="Fit.Controls.Component" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing control </description>
	/// </function>
	this.GetDomElement = function()
	{
		return container;
	}

	/// <function container="Fit.Controls.Component" name="Render" access="public">
	/// 	<description> Render control, either inline or to element specified </description>
	/// 	<param name="toElement" type="DOMElement" default="undefined"> If defined, control is rendered to this element </param>
	/// </function>
	this.Render = function(toElement)
	{
		Fit.Validation.ExpectDomElement(toElement, true);

		if (Fit.Validation.IsSet(toElement) === true)
		{
			Fit.Dom.Add(toElement, me.GetDomElement()); // Using GetDomElement() which may have been overridden, e.g. by ControlBase which does some validation when GetDomElement() is called, or by ContextMenu which returns a different element
		}
		else
		{
			var script = document.scripts[document.scripts.length - 1];
			Fit.Dom.InsertBefore(script, me.GetDomElement()); // Using GetDomElement() which may have been overridden, e.g. by ControlBase which does some validation when GetDomElement() is called, or by ContextMenu which returns a different element
		}
	}

	/// <function container="Fit.Controls.Component" name="Dispose" access="public">
	/// 	<description>
	/// 		Destroys control to free up memory.
	/// 		Make sure to call Dispose() on Component which can be done like so:
	/// 		this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	/// 		{
	/// 			&#160;&#160;&#160;&#160; // Add control specific dispose logic here
	/// 			&#160;&#160;&#160;&#160; base(); // Call Dispose on Component
	/// 		});
	/// 	</description>
	/// </function>
	this.Dispose = function()
	{
		// This will destroy control - it will no longer work!

		Fit.Dom.Remove(container); // Dispose 'container' rather than object returned from GetDomElement() which may have been overridden and potentially returning a different object, in which case the derivative should dispose the object
		delete container._internal; // Removed in case external code holds a reference to DOMElement. Also allows us to internally determine whether control has been disposed or not (e.g. in Fit.Template), since it will always be presented unless disposed.
		delete Fit._internal.ControlBase.Controls[id];
		me = id = container = isIe8 = null;
	}

	// Internals

	this._internal = (this._internal ? this._internal : {});

	this._internal.Repaint = function(f) // Use callback function if a repaint is required both before and after a given operation, which often requires JS thread to be released on IE
	{
		Fit.Validation.ExpectFunction(f, true);

		var cb = ((Fit.Validation.IsSet(f) === true) ? f : function() {});

		if (isIe8 === false)
		{
			cb();
		}
		else
		{
			// Flickering may occure on IE8 when updating UI over time
			// (UI update + JS thread released + UI updates again "later").

			Fit.Dom.AddClass(me.GetDomElement(), "FitUi_Non_Existing_ControlBase_Class");
			Fit.Dom.RemoveClass(me.GetDomElement(), "FitUi_Non_Existing_ControlBase_Class");

			setTimeout(function()
			{
				if (me === null)
					return; // Control has been disposed

				cb();

				Fit.Dom.AddClass(me.GetDomElement(), "FitUi_Non_Existing_ControlBase_Class");
				Fit.Dom.RemoveClass(me.GetDomElement(), "FitUi_Non_Existing_ControlBase_Class");
			}, 0);
		}
	}

	init();
}

/// <container name="Fit.Controls.ControlBase" extends="Fit.Controls.Component">
/// 	Class from which all editable controls extend
/// </container>
Fit.Controls.ControlBase = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);
	Fit.Core.Extend(this, Fit.Controls.Component).Apply(controlId);

	// ============================================
	// Interface - must be overridden
	// ============================================

	/// <function container="Fit.Controls.ControlBase" name="Value" access="public" returns="string">
	/// 	<description>
	/// 		Get/set control value.
	/// 		For controls supporting multiple selections: Set value by providing a string in one the following formats:
	/// 		title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
	/// 		If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
	/// 		Selected items are returned in the first format described, also with reserved characters URIEncoded.
	/// 		Providing a new value to this function results in OnChange being fired.
	/// 	</description>
	/// 	<param name="val" type="string" default="undefined"> If defined, value is inserted into control </param>
	/// 	<param name="preserveDirtyState" type="boolean" default="false">
	/// 		If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
	/// 		If dirty state is reset (default), the control value will be compared against the value passed,
	/// 		to determine whether it has been changed by the user or not, when IsDirty() is called.
	/// 	</param>
	/// </function>
	this.Value = function(val, preserveDirtyState)
	{
		// Function MUST remember to fire OnChange event when
		// value is changed, both programmatically and by user.

		Fit.Validation.ThrowError("Not implemented");
	}

	/// <function container="Fit.Controls.ControlBase" name="UserValue" access="public" returns="string">
	/// 	<description>
	/// 		Get/set value as if it was changed by the user. Contrary to Value(..), this function will never reset the dirty state.
	/// 		Restrictions/filtering/modifications may be enforced just as the UI control might do, e.g. prevent the use of certain
	/// 		characters, or completely ignore input if not allowed. It may also allow invalid values such as a partially entered date
	/// 		value. The intention with UserValue(..) is to mimic the behaviour of what the user can do with the user interface control.
	/// 		For picker controls the value format is equivalent to the one dictated by the Value(..) function.
	/// 	</description>
	/// 	<param name="val" type="string" default="undefined"> If defined, value is inserted into control </param>
	/// </function>
	this.UserValue = function(val)
	{
		//Fit.Validation.ThrowError("Not implemented");
		return me.Value(val, true); // Default implementation - change value but do not reset dirty state
	}

	/// <function container="Fit.Controls.ControlBase" name="IsDirty" access="public" returns="boolean">
	/// 	<description> Get value indicating whether user has changed control value </description>
	/// </function>
	this.IsDirty = function()
	{
		Fit.Validation.ThrowError("Not implemented");
	}

	/// <function container="Fit.Controls.ControlBase" name="Clear" access="public">
	/// 	<description> Clear control value </description>
	/// </function>
	this.Clear = function()
	{
		// Function MUST remember to fire OnChange event when
		// value is clear, both programmatically and by user.

		Fit.Validation.ThrowError("Not implemented");
	}

	/// <function container="Fit.Controls.ControlBase" name="Focused" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control has focus </description>
	/// 	<param name="value" type="boolean" default="undefined"> If defined, True assigns focus, False removes focus (blur) </param>
	/// </function>
	this.Focused = function(val)
	{
		Fit.Validation.ThrowError("Not implemented");
	}

	// ============================================
	// Init
	// ============================================

	var me = this;
	var container = me.GetDomElement();
	var width = { Value: 200, Unit: "px" }; // Any changes to this line must be dublicated to Width(..)
	var height = { Value: -1, Unit: "px" };
	var scope = null;
	var required = false;
	var orgDirtyFunction = null;
	var validationExpr = null;			// Obsolete - used by SetValidationExpression
	var validationError = null;			// Obsolete - used by SetValidationExpression
	var validationErrorType = -1;		// 0 = Required, 1 = RegEx validation via SetValidationExpression(..), 2 = Callback validation via SetValidationHandler(..), 3 = Callback validation via SetValidationCallback(..), 4 = RegEx or Callback validation via AddValidationRule(..)
	var validationCallbackFunc = null;	// Obsolete - used by SetValidationCallback
	var validationCallbackError = null;	// Obsolete - used by SetValidationCallback
	var validationHandlerFunc = null;	// Obsolete - used by SetValidationHandler
	var validationHandlerError = null;	// Obsolete - used by SetValidationHandler
	var validationRules = [];
	var validationRuleError = null;
	var lazyValidation = false;
	var hasValidated = false;
	var blockAutoPostBack = false; // Used by AutoPostBack mechanism to prevent multiple postbacks, e.g on double click
	var onChangeHandlers = [];
	var onFocusHandlers = [];
	var onBlurHandlers = [];
	var hasFocus = false;			// Used by OnFocusIn and OnFocusOut handlers
	var onBlurTimeout = null;		// Used by OnFocusIn and OnFocusOut handlers
	var ensureFocusFires = false;	// Used by OnFocusIn and OnFocusOut handlers
	var waitingForFocus = false;	// Used by OnFocusIn and OnFocusOut handlers
	var focusStateLocked = false;	// Used by OnFocusIn and OnFocusOut handlers
	var txtValue = null;
	var txtDirty = null;
	var txtValid = null;

	function init()
	{
		container.style.width = width.Value + width.Unit;
		Fit.Dom.AddClass(container, "FitUiControl");

		me._internal.Data("focused", "false");
		me._internal.Data("valid", "true");
		me._internal.Data("dirty", "false");

		me._internal.Data("device", ((Fit.Browser.GetInfo().IsMobile === false) ? "Desktop" : (Fit.Browser.GetInfo().IsPhone === true) ? "Phone" : "Tablet"));

		// Add hidden inputs which are automatically populated with
		// control value and state information when control is updated.

		txtValue = document.createElement("textarea"); // Using Textarea to allow HTML content
		txtValue.style.display = "none";
		txtValue.name = "FitUIValue" + me.GetId();
		Fit.Dom.Add(container, txtValue);

		txtDirty = document.createElement("input");
		txtDirty.type = "hidden";
		txtDirty.name = "FitUIDirty" + me.GetId();
		Fit.Dom.Add(container, txtDirty);

		txtValid = document.createElement("input");
		txtValid.type = "hidden";
		txtValid.name = "FitUIValid" + me.GetId();
		Fit.Dom.Add(container, txtValid);

		me.OnChange(function(sender)
		{
			if (blockAutoPostBack === false && me.AutoPostBack() === true && document.forms.length > 0)
			{
				setTimeout(function() // Postpone to allow other handlers to execute before postback
				{
					blockAutoPostBack = true;
					document.forms[0].submit();

					setTimeout(function() { blockAutoPostBack = false; }, 500); // Enable AutoPostBack again in case OnBeforeUnload handler was used to cancel postback
				}, 0);
			}
		});

		if (Fit.Browser.GetBrowser() !== "MSIE" || Fit.Browser.GetVersion() >= 9)
		{
			// Notice: Using Capture (true argument) for these handlers,
			// meaning they are fired before the event reach its target.
			Fit.Events.AddHandler(container, "focus", true, onFocusIn);
			Fit.Events.AddHandler(container, "blur", true, onFocusOut);
		}
		else // Legacy IE does not support event capturing used above
		{
			container.onfocusin = onFocusIn;
			container.onfocusout = onFocusOut;
		}

		me.OnBlur(function(sender)
		{
			if (lazyValidation === true)
				me._internal.Validate(true);
		});

		Fit.Internationalization.OnLocaleChanged(localize);
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.ControlBase" name="AutoPostBack" access="public" returns="boolean">
	/// 	<description> Set flag indicating whether control should post back changes automatically when value is changed </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables auto post back, False disables it </param>
	/// </function>
	this.AutoPostBack = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			me._internal.Data("autopost", val.toString());
		}

		return (me._internal.Data("autopost") === "true");
	}

	this.GetDomElement = Fit.Core.CreateOverride(this.GetDomElement, function()
	{
		if (hasValidated === false)
		{
			hasValidated = true;
			me._internal.Validate();
			updateInternalState(); // Make sure state posted to server is up to date (Dirty and Valid flags) in case a control value has not been assigned
		}

		return base();
	});

	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		Fit.Internationalization.RemoveOnLocaleChanged(localize);
		me = container = width = height = scope = required = validationExpr = validationError = validationErrorType = validationCallbackFunc = validationCallbackError = validationHandlerFunc = validationHandlerError = validationRules = validationRuleError = lazyValidation = hasValidated = blockAutoPostBack = onChangeHandlers = onFocusHandlers = onBlurHandlers = hasFocus = onBlurTimeout = ensureFocusFires = waitingForFocus = focusStateLocked = txtValue = txtDirty = txtValid = null;
		base();
	});


	/// <function container="Fit.Controls.ControlBase" name="Width" access="public" returns="Fit.TypeDefs.CssValue">
	/// 	<description> Get/set control width - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="Fit.TypeDefs.CssUnit" default="px"> If defined, control width is updated to specified CSS unit </param>
	/// </function>
	this.Width = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				width = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				container.style.width = width.Value + width.Unit;
			}
			else
			{
				width = { Value: 200, Unit: "px" }; // Any changes to this line must be dublicated to line declaring the width variable !
				container.style.width = "";
			}
		}

		return width;
	}

	/// <function container="Fit.Controls.ControlBase" name="Height" access="public" returns="Fit.TypeDefs.CssValue">
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
			height = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true && val !== -1) ? unit : "px") };

			if (height.Value > -1)
				container.style.height = height.Value + height.Unit;
			else
				container.style.height = "";
		}

		return height;
	}

	/// <function container="Fit.Controls.ControlBase" name="AddCssClass" access="public">
	/// 	<description> Add CSS class to DOMElement representing control </description>
	/// 	<param name="val" type="string"> CSS class to add </param>
	/// </function>
	this.AddCssClass = function(val)
	{
		Fit.Validation.ExpectStringValue(val);
		Fit.Dom.AddClass(container, val);
	}

	/// <function container="Fit.Controls.ControlBase" name="RemoveCssClass" access="public">
	/// 	<description> Remove CSS class from DOMElement representing control </description>
	/// 	<param name="val" type="string"> CSS class to remove </param>
	/// </function>
	this.RemoveCssClass = function(val)
	{
		Fit.Validation.ExpectStringValue(val);
		Fit.Dom.RemoveClass(container, val);
	}

	/// <function container="Fit.Controls.ControlBase" name="HasCssClass" access="public" returns="boolean">
	/// 	<description> Check whether CSS class is found on DOMElement representing control </description>
	/// 	<param name="val" type="string"> CSS class to check for </param>
	/// </function>
	this.HasCssClass = function(val)
	{
		Fit.Validation.ExpectStringValue(val);
		return Fit.Dom.HasClass(container, val);
	}

	/// <function container="Fit.Controls.ControlBase" name="Visible" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is visible </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, control visibility is updated </param>
	/// </function>
	this.Visible = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
			container.style.display = ((val === true) ? "" : "none");

		return (container.style.display !== "none");
	}

	/// <function container="Fit.Controls.ControlBase" name="Required" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is required to be set </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, control required feature is enabled/disabled </param>
	/// </function>
	this.Required = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			required = val;
			me._internal.Validate(); // Update error indicator
		}

		return required;
	}

	/// <function container="Fit.Controls.ControlBase" name="Scope" access="public" returns="string">
	/// 	<description>
	/// 		Get/set scope to which control belongs - this is used to validate multiple
	/// 		controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
	/// 	</description>
	/// 	<param name="val" type="string" default="undefined"> If defined, control scope is updated </param>
	/// </function>
	this.Scope = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === "")
				scope = null;
			else
				scope = val;
		}

		return scope;
	}

	/// <function container="Fit.Controls.ControlBase" name="AlwaysDirty" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether control is always considered dirty. This
	/// 		comes in handy when programmatically changing a value of a control on behalf
	/// 		of the user. Some applications may choose to only save values from dirty controls.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, Always Dirty is enabled/disabled </param>
	/// </function>
	this.AlwaysDirty = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true && orgDirtyFunction === null)
			{
				orgDirtyFunction = this.IsDirty;
				this.IsDirty = function() { return true; };
				updateInternalState();
			}
			else if (val === false && orgDirtyFunction !== null)
			{
				this.IsDirty = orgDirtyFunction;
				orgDirtyFunction = null;
				updateInternalState();
			}
		}

		return (orgDirtyFunction !== null);
	}

	/// <function container="Fit.Controls.ControlBase" name="SetValidationExpression" access="public">
	/// 	<description>
	/// 		DEPRECATED! Please use AddValidationRule(..) instead.
	/// 		Set regular expression used to perform on-the-fly validation against control value.
	/// 	</description>
	/// 	<param name="regEx" type="RegExp" nullable="true"> Regular expression to validate against </param>
	/// 	<param name="errorMsg" type="string" default="undefined">
	/// 		If defined, specified error message is displayed when user clicks or hovers validation error indicator
	/// 	</param>
	/// </function>
	this.SetValidationExpression = function(regEx, errorMsg)
	{
		Fit.Validation.ExpectRegExp(regEx, true); // Allow Null/undefined which disables validation
		Fit.Validation.ExpectString(errorMsg, true);

		Fit.Browser.LogDeprecated("Use of deprecated function SetValidationExpression - please use AddValidationRule instead");

		validationExpr = (regEx ? regEx : null);
		validationError = (errorMsg ? errorMsg : null);

		me._internal.Validate();
	}

	/// <function container="Fit.Controls.ControlBase" name="SetValidationCallback" access="public">
	/// 	<description>
	/// 		DEPRECATED! Please use AddValidationRule(..) instead.
	/// 		Set callback function used to perform on-the-fly validation against control value.
	/// 	</description>
	/// 	<param name="cb" type="function" nullable="true"> Function receiving control value - must return True if value is valid, otherwise False </param>
	/// 	<param name="errorMsg" type="string" default="undefined">
	/// 		If defined, specified error message is displayed when user clicks or hovers validation error indicator
	/// 	</param>
	/// </function>
	this.SetValidationCallback = function(cb, errorMsg)
	{
		Fit.Validation.ExpectFunction(cb, true); // Allow Null/undefined which disables validation
		Fit.Validation.ExpectString(errorMsg, true);

		Fit.Browser.LogDeprecated("Use of deprecated function SetValidationCallback - please use AddValidationRule instead");

		validationHandlerFunc = null;
		validationCallbackFunc = (cb ? cb : null);;
		validationCallbackError = (errorMsg ? errorMsg : null);

		me._internal.Validate();
	}

	/// <function container="Fit.Controls.ControlBase" name="SetValidationHandler" access="public">
	/// 	<description>
	/// 		DEPRECATED! Please use AddValidationRule(..) instead.
	/// 		Set callback function used to perform on-the-fly validation against control value
	/// 	</description>
	/// 	<param name="cb" type="function" nullable="true">
	/// 		Function receiving an instance of the control and its value.
	/// 		An error message string must be returned if value is invalid,
	/// 		otherwise Null or an empty string if the value is valid.
	/// 	</param>
	/// </function>
	this.SetValidationHandler = function(cb)
	{
		Fit.Validation.ExpectFunction(cb, true); // Allow Null/undefined which disables validation

		Fit.Browser.LogDeprecated("Use of deprecated function SetValidationHandler - please use AddValidationRule instead");

		validationCallbackFunc = null;
		validationHandlerFunc = (cb ? cb : null);
		validationHandlerError = null;

		me._internal.Validate();
	}

	/// <function container="Fit.ControlBaseTypeDefs" name="ValidationCallback" returns="boolean | string | void">
	/// 	<description> Validation callback used with AddValidationRule(..) inherited from Fit.Controls.ControlBase </description>
	/// 	<param name="sender" type="Fit.Controls.ControlBase"> Control to validate </param>
	/// </function>

	/// <function container="Fit.Controls.ControlBase" name="AddValidationRule" access="public">
	/// 	<description> Set callback function used to perform on-the-fly validation against control </description>
	/// 	<param name="validator" type="Fit.ControlBaseTypeDefs.ValidationCallback">
	/// 		Function receiving an instance of the control.
	/// 		A value of False or a non-empty string with an
	/// 		error message must be returned if value is invalid.
	/// 	</param>
	/// </function>
	/// <function container="Fit.Controls.ControlBase" name="AddValidationRule" access="public">
	/// 	<description> Set regular expression used to perform on-the-fly validation against control value, as returned by the Value() function </description>
	/// 	<param name="validator" type="RegExp"> Regular expression to validate value against </param>
	/// 	<param name="errorMessage" type="string" default="undefined"> Optional error message displayed if value validation fails </param>
	/// </function>
	this.AddValidationRule = function(validator, errorMessage)
	{
		Fit.Validation.ExpectIsSet(validator);
		Fit.Validation.ExpectString(errorMessage, true);

		if (typeof(validator) === "function")
		{
			Fit.Validation.ExpectFunction(validator);
			validationRules.push( { Type: "Callback", Validator: validator, ErrorMessage: null } );
		}
		else
		{
			Fit.Validation.ExpectRegExp(validator);
			validationRules.push( { Type: "RegExp", Validator: validator, ErrorMessage: errorMessage || null } );
		}

		me._internal.Validate();
	}

	/// <function container="Fit.Controls.ControlBase" name="RemoveValidationRule" access="public">
	/// 	<description> Remove validation function used to perform on-the-fly validation against control </description>
	/// 	<param name="validator" type="Fit.ControlBaseTypeDefs.ValidationCallback"> Validation function registered using AddValidationRule(..) </param>
	/// </function>
	/// <function container="Fit.Controls.ControlBase" name="RemoveValidationRule" access="public">
	/// 	<description> Remove regular expression used to perform on-the-fly validation against control value </description>
	/// 	<param name="validator" type="RegExp"> Regular expression registered using AddValidationRule(..) </param>
	/// </function>
	this.RemoveValidationRule = function(validator) // Function or RegExp
	{
		var found = null;

		Fit.Array.ForEach(validationRules, function(rule)
		{
			if (rule.Validator === validator)
			{
				found = rule;
				return false; // Break loop
			}
		});

		if (found !== null)
		{
			Fit.Array.Remove(validationRules, found);
		}

		me._internal.Validate();
	}

	/// <function container="Fit.Controls.ControlBase" name="RemoveAllValidationRules" access="public">
	/// 	<description> Remove all validation rules </description>
	/// </function>
	this.RemoveAllValidationRules = function()
	{
		validationRules = [];
		me._internal.Validate();
	}

	/// <function container="Fit.Controls.ControlBase" name="IsValid" access="public" returns="boolean">
	/// 	<description>
	/// 		Get value indicating whether control value is valid.
	/// 		Control value is considered invalid if control is required, but no value is set,
	/// 		or if control value does not match regular expression set using SetValidationExpression(..).
	/// 	</description>
	/// </function>
	this.IsValid = function()
	{
		validationErrorType = -1;
		validationHandlerError = null;
		validationRuleError = null;

		if (validationExpr === null && validationCallbackFunc === null && validationHandlerFunc === null && required === false && validationRules.length === 0)
			return true;

		var obj = me.Value();
		var val = ((Fit.Validation.IsSet(obj) === true) ? obj.toString() : "");

		if (required === true && val === "")
		{
			validationErrorType = 0;
			return false;
		}

		if (validationExpr !== null && validationExpr.test(val) === false)
		{
			validationErrorType = 1;
			return false;
		}

		if (validationHandlerFunc !== null)
		{
			var errorMessage = validationHandlerFunc(me, val);

			if (errorMessage !== null && errorMessage !== "" && typeof(errorMessage) === "string")
			{
				validationErrorType = 2;
				validationHandlerError = errorMessage;
				return false;
			}
		}
		else if (validationCallbackFunc !== null && validationCallbackFunc(val) === false)
		{
			validationErrorType = 3;
			return false;
		}

		if (validationRules.length > 0)
		{
			Fit.Array.ForEach(validationRules, function(rule)
			{
				if (rule.Type === "Callback")
				{
					var result = rule.Validator(me);

					if (result === false || (typeof(result) === "string" && result !== ""))
					{
						validationErrorType = 4;
						validationRuleError = result || null;
						return false; // Break loop
					}
				}
				else // RegExp
				{
					if (rule.Validator.test(me.Value()) === false)
					{
						validationErrorType = 4;
						validationRuleError = rule.ErrorMessage;
						return false; // Break loop
					}
				}
			});

			if (validationErrorType === 4)
			{
				return false;
			}
		}

		return true;
	}

	/// <function container="Fit.Controls.ControlBase" name="LazyValidation" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether control initially appears as valid, even
	/// 		though it is not. It will appear invalid once the user touches the control,
	/// 		or when control value is validated using Fit.Controls.ValidateAll(..).
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, Lazy Validation is enabled/disabled </param>
	/// </function>
	this.LazyValidation = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			lazyValidation = val;

			if (lazyValidation === true)
			{
				me._internal.Data("valid", "true");
				me._internal.Data("errormessage", null);
			}
			else
			{
				this._internal.Validate();
			}
		}

		return lazyValidation;
	}

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.ControlBaseTypeDefs" name="BaseEvent">
	/// 	<description> Event handler receiving an instance of the control firing the event </description>
	/// 	<param name="sender" type="Fit.Controls.ControlBase"> Control instance </param>
	/// </function>

	/// <function container="Fit.Controls.ControlBase" name="OnChange" access="public">
	/// 	<description> Register OnChange event handler which is invoked when control value is changed either programmatically or by user </description>
	/// 	<param name="cb" type="Fit.ControlBaseTypeDefs.BaseEvent"> Event handler function which accepts Sender (ControlBase) </param>
	/// </function>
	this.OnChange = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onChangeHandlers, cb);
	}

	/// <function container="Fit.Controls.ControlBase" name="OnFocus" access="public">
	/// 	<description> Register OnFocus event handler which is invoked when control gains focus </description>
	/// 	<param name="cb" type="Fit.ControlBaseTypeDefs.BaseEvent"> Event handler function which accepts Sender (ControlBase) </param>
	/// </function>
	this.OnFocus = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onFocusHandlers, cb);
	}

	/// <function container="Fit.Controls.ControlBase" name="OnBlur" access="public">
	/// 	<description> Register OnBlur event handler which is invoked when control loses focus </description>
	/// 	<param name="cb" type="Fit.ControlBaseTypeDefs.BaseEvent"> Event handler function which accepts Sender (ControlBase) </param>
	/// </function>
	this.OnBlur = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onBlurHandlers, cb);
	}

	// ============================================
	// Private
	// ============================================

	function onFocusIn(e)
	{
		if (focusStateLocked === true)
			return;

		// Note on how OnFocus and OnBlur is handled:
		// OnFocus in JS fires for focusable elements only, meaning
		// elements with tabIndex set.
		// If an element within a control is clicked, and that
		// particular element is not focusable, <body> will be
		// focused by the browser, causing the control to lose focus
		// and fire OnBlur.
		// Programmatically re-assigning focus within a control
		// will not cause OnBlur to fire since onFocusIn cancels
		// onFocusOut.
		// Notice that onFocusOut is triggered for an element losing
		// focus before onFocusIn is triggered for an element gaining focus.
		// See http://fiddle.jshell.net/2eha07qt/33 to understand how
		// onFocusIn/Out fires internally and how OnFocus and OnBlur
		// fires externally.

		// Cancel OnBlur
		if (onBlurTimeout !== null)
		{
			clearTimeout(onBlurTimeout);
			onBlurTimeout = null;
		}

		if (waitingForFocus === true) // Ensure FIFO execution of OnFocus and OnBlur - see onFocusOut handler for details
		{
			// Control regained focus while waiting for OnFocus and OnBlur to fire.
			// OnBlur timer was canceled above, so we'll just let the initial FocusIn timer fire.
			// This happens if FIFO execution for timers are not honored.
			// See onFocusOut handler for details.

			waitingForFocus = false;
			return;
		}

		// Make sure OnFocus only fires once when control is initially given
		// focus - prevent it from firing when focus is changed internally.
		if (hasFocus === true)
			return;

		hasFocus = true;

		// Make sure control does in fact fire initial OnFocus event,
		// in case control is only assigned focus shortly - otherwise
		// OnBlur may fire without OnFocus firing first if FIFO execution
		// of timers are not honored. See onFocusOut handler for details.
		ensureFocusFires = true;

		// Queue, event has not reached target yet (using Capture instead of event bubbling).
		// Target must have focus before firing OnFocus. This approach also allow for control
		// to internally change focus (e.g. in TreeView where focus may change from one node
		// to another) which may fire both Focus and Blur multiple times.
		setTimeout(function()
		{
			if (me === null)
				return; // Control was disposed

			ensureFocusFires = false;

			me._internal.FireOnFocus();
		}, 0);
	}

	function onFocusOut(e)
	{
		if (me === null) // Disposed while focused (e.g. from an onscroll event handler)
			return;

		if (focusStateLocked === true)
			return;

		// See comments in onFocusIn(..)

		var fireBlur = null;
		fireBlur = function()
		{
			if (me === null)
				return; // Control was disposed

			if (ensureFocusFires === true) // Make absolutely sure initial OnFocus has fired before firing OnBlur
			{
				// Browsers can, in some situations, disregard FIFO execution for timers, for instance when attaching
				// a debugger, or if the browser suspends JS execution due to power management, especially on mobile devices.
				// Since the control has already lost focus at this point, it's safe to schedule another
				// timer to fire OnBlur once OnFocus has been fired. We will keep checking to make sure OnFocus fires first.
				// OnFocusOut should not be called again since the control no longer has focus, and if the control regains focus
				// while waiting for OnFocus and OnBlur to fire, then onFocusIn will cancel the OnBlur timer and let the
				// initial OnFocus timer execute (see the use of waitingForFocus in onFocusIn).
				// To simulate the FIFO problem, set the OnFocus timer to timeout late, e.g. after 1500 ms.
				// Then focus the control and immediately remove focus from it again. Register an OnFocus
				// and OnBlur handler to observe that OnFocus does in fact fire before OnBlur.
				waitingForFocus = true;

				onBlurTimeout = setTimeout(fireBlur, 0);
				return;
			}

			onBlurTimeout = null;
			waitingForFocus = false;
			hasFocus = false; // Control has lost focus, allow OnFocus to fire again when it regains focus

			me._internal.FireOnBlur();
		};

		onBlurTimeout = setTimeout(fireBlur, 0);
	}

	function updateInternalState()
	{
		txtValue.value = me.Value().toString(); // TBD: Why .toString() ? It always returns a string!
		txtDirty.value = ((me.IsDirty() === true) ? "1" : "0");
		txtValid.value = ((me.IsValid() === true) ? "1" : "0");

		me._internal.Data("dirty", ((me.IsDirty() === true) ? "true" : "false"));
	}

	function localize()
	{
		if (validationErrorType === 0 /*&& me._internal.Data("errormessage") !== null*/)
		{
			var locale = Fit.Internationalization.GetSystemLocale();
			me._internal.Data("errormessage", locale.Translations.Required);
		}
	}

	// Private members (must be public in order to be accessible to controls extending from ControlBase)

	this._internal.FireOnChange = function()
	{
		hasValidated = true;
		me._internal.Validate();
		updateInternalState();

		Fit.Array.ForEach(onChangeHandlers, function(cb)
		{
			cb(me);
		});
	}

	this._internal.FireOnFocus = function()
	{
		ensureFocusFires = false; // Usually set to False in onfocusin event handler, but specialized controls may fire OnFocus as well, in which case we assume control has in fact gained focus

		me._internal.Data("focused", "true");
		me._internal.Repaint();

		Fit.Array.ForEach(onFocusHandlers, function(cb)
		{
			cb(me);
		});
	}

	this._internal.FireOnBlur = function()
	{
		me._internal.Data("focused", "false");
		me._internal.Repaint();

		Fit.Array.ForEach(onBlurHandlers, function(cb)
		{
			cb(me);
		});
	}

	this._internal.FocusStateLocked = function(value)
	{
		Fit.Validation.ExpectBoolean(value, true);

		// Prevent control from firing OnFocus (onfocusin) and OnBlur (onfocusout) automatically.
		// Specialized controls can use this to either suppress OnFocus and OnBlur invocation temporarily,
		// or take over the responsibility of handling invocation of OnBlur and OnFocus.
		// This is useful if a control for instance opens a modal dialog and gives it focus, in which case the
		// control would lose focus and fire OnBlur. But since the dialog is considered part of the control, we
		// do not want OnBlur to fire. We can use FocusStateLocked(..) to make the control preserve its current
		// focused state, and let the specialized control handle invocation of focus events when needed, and hand
		// back control to ControlBase when the modal dialog closes.

		// Notice regarding Focused(): One could argue that Focused() should return True if focus state is locked,
		// if control was focused when lock was enabled, and if OnBlur has not been fired. But that means that two
		// controls could return True from Focused() which is just wrong, and the Focused() state would contradict
		// what is returned from Fit.Dom.GetFocused() or document.activeElement, which could potentially lead to
		// incorrect behaviour. So Focused() must give us the truth, even when focus state is locked.

		if (Fit.Validation.IsSet(value) === true)
		{
			if (value !== focusStateLocked)
			{
				focusStateLocked = value;

				// Make sure ControlBase can handle focus in/out properly when focus state is unlocked again
				hasFocus = Fit.Dom.Contained(me.GetDomElement(), Fit.Dom.GetFocused()) === true;
			}
		}

		return focusStateLocked;
	}

	this._internal.ExecuteWithNoOnChange = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);

		var onChangeHandler = me._internal.FireOnChange;
		me._internal.FireOnChange = function() {};

		var error = null;

		try // Try/catch to make absolutely sure OnChange handler is restored!
		{
			cb();
		}
		catch (err)
		{
			error = err.message;
		}

		me._internal.FireOnChange = onChangeHandler;

		if (error !== null)
			Fit.Validation.ThrowError(error);
	}

	this._internal.Data = function(key, val)
	{
		Fit.Validation.ExpectStringValue(key);
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true || val === null)
			Fit.Dom.Data(container, key, val);

		return Fit.Dom.Data(container, key);
	}

	this._internal.AddDomElement = function(elm)
	{
		Fit.Validation.ExpectDomElement(elm);
		Fit.Dom.InsertBefore(txtValue, elm); //Fit.Dom.Add(container, elm);
	}

	this._internal.RemoveDomElement = function(elm)
	{
		Fit.Validation.ExpectDomElement(elm);
		Fit.Dom.Remove(elm);
	}

	this._internal.Validate = function(force)
	{
		Fit.Validation.ExpectBoolean(force, true);

		// For LazyValidation the UI is only updated if control has focus, unless force is true
		if (lazyValidation === true && me.Focused() === false && force !== true)
			return;

		var valid = me.IsValid();

		me._internal.Data("valid", valid.toString());

		if (valid === false)
		{
			me._internal.Data("errormessage", null);

			if (validationErrorType === 0)
				me._internal.Data("errormessage", Fit.Internationalization.GetSystemLocale().Translations.Required);
			else if (validationErrorType === 1 && validationError !== null)
				me._internal.Data("errormessage", validationError.replace("\r", "").replace(/<br.*>/i, "\n"));
			else if (validationErrorType === 2 && validationHandlerError !== null)
				me._internal.Data("errormessage", validationHandlerError.replace("\r", "").replace(/<br.*>/i, "\n"));
			else if (validationErrorType === 3 && validationCallbackError !== null)
				me._internal.Data("errormessage", validationCallbackError.replace("\r", "").replace(/<br.*>/i, "\n"));
			else if (validationErrorType === 4 && validationRuleError !== null)
				me._internal.Data("errormessage", validationRuleError.replace("\r", "").replace(/<br.*>/i, "\n"));
		}
		else
		{
			me._internal.Data("errormessage", null);
		}

		me._internal.Repaint();
	}

	init();
}

// ============================================
// Public static
// ============================================

/// <function container="Fit.Controls" name="Find" access="public" static="true" returns="Fit.Controls.Component | null">
/// 	<description> Get control by unique Control ID - returns Null if not found </description>
/// 	<param name="id" type="string"> Unique Control ID </param>
/// </function>
/// <function container="Fit.Controls" name="Find" access="public" static="true" returns="$ExpectedControlType | null">
/// 	<description> Get control by unique Control ID - returns Null if not found </description>
/// 	<param name="id" type="string"> Unique Control ID </param>
/// 	<param name="expectedType" type="$ExpectedControlType">
/// 		For development environments supporting JSDoc and generics (e.g. VSCode), make Find(..) return found component
/// 		as specified type. For instance to return a type as Fit.Controls.DropDown, specify Fit.Controls.DropDown.prototype.
/// 	</param>
/// </function>
Fit.Controls.Find = function(id, expectedType) // The expectedType argument is there only to add support for a generic return type via typings
{
	Fit.Validation.ExpectStringValue(id);
	return ((Fit._internal.ControlBase.Controls[id] !== undefined) ? Fit._internal.ControlBase.Controls[id] : null);
}

/// <function container="Fit.Controls" name="ValidateAll" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Validate all controls - either all controls on page, or within specified scope.
/// 		Returns True if all controls contain valid values, otherwise False.
/// 	</description>
/// 	<param name="scope" type="string" default="undefined">
/// 		If specified, validate controls only within this scope.
/// 		See Fit.Controls.ControlBase.Scope(..)
/// 		for details on configurering scoped validation.
/// 	</param>
/// </function>
Fit.Controls.ValidateAll = function(scope)
{
	Fit.Validation.ExpectStringValue(scope, true);

	var result = true;

	Fit.Array.ForEach(Fit._internal.ControlBase.Controls, function(controlId)
	{
		var control = Fit._internal.ControlBase.Controls[controlId];

		if (Fit.Core.InstanceOf(control, Fit.Controls.ControlBase) === false)
			return;

		if (Fit.Validation.IsSet(scope) === true && control.Scope() !== scope)
			return;

		control._internal.Validate(true);

		if (control.IsValid() === false)
			result = false;
	});

	return result;
}

/// <function container="Fit.Controls" name="DirtyCheckAll" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Check dirty state for all controls - either all controls on page, or within specified scope.
/// 		Returns True if one or more controls are dirty, otherwise False.
/// 	</description>
/// 	<param name="scope" type="string" default="undefined">
/// 		If specified, dirty check controls only within this scope.
/// 		See Fit.Controls.ControlBase.Scope(..)
/// 		for details on configurering scoped validation.
/// 	</param>
/// </function>
Fit.Controls.DirtyCheckAll = function(scope)
{
	Fit.Validation.ExpectStringValue(scope, true);

	var result = false;

	Fit.Array.ForEach(Fit._internal.ControlBase.Controls, function(controlId)
	{
		var control = Fit._internal.ControlBase.Controls[controlId];

		if (Fit.Core.InstanceOf(control, Fit.Controls.ControlBase) === false)
			return;

		if (Fit.Validation.IsSet(scope) === true && control.Scope() !== scope)
			return;

		if (control.IsDirty() === true)
		{
			result = true;
			return false; // Break loop
		}
	});

	return result;
}
