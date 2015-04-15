Fit.Controls = {};
Fit.Controls.ControlBase = {};

Fit.Controls.ControlBase = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId);

	if (Fit._internal.ControlBase.Controls[controlId] !== undefined)
		Fit.Validation.ThrowError("Control with ID '" + controlId + "' has already been defined - Control IDs must be unique!");

	Fit._internal.ControlBase.Controls[controlId] = this;

	// ============================================
	// Interface - must be overridden
	// ============================================

	this.Value = function(val) // Set/Get
	{
		// Object type (return value and accepted parameter):
		//  - String (best)
		//  - Array for collections (e.g. nodes from TreeView - MUST override toString())
		//  - Object (MUST override toString())
		// Overriding toString() for Array and Object is important,
		// and the string representation is used in the RegEx validation logic!

		throw new Error("Not implemented");
	}

	this.IsDirty = function()
	{
		throw new Error("Not implemented");
	}

	this.Clear = function()
	{
		throw new Error("Not implemented");
	}

	// ============================================
	// Inherited
	// ============================================

	var me = this;
	var id = controlId;
	var container = null;
	var width = { Value: 200, Unit: "px" };
	var height = { Value: -1, Unit: "px" };
	var required = false;
	var validationExpr = null;
	var validationError = null;
	var validationErrorType = -1; // 0 = Required, 1 = RegEx validation
	var lblValidationError = null;
	var onChangeHandlers = [];

	container = document.createElement("div");
	container.id = id;
	container.style.width = "200px";
	Fit.Dom.AddClass(container, "FitUiControl");

	this.GetId = function()
	{
		return id;
	}

	this.GetDomElement = function()
	{
		return container;
	}

	this.Dispose = function()
	{
		if (container.parentNode !== null)
			container.parentNode.removeChild(container);
	}

	this.SetWidth = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectString(unit, true);

		width = { Value: ((val !== undefined && val !== null) ? val : 200), Unit: ((unit !== undefined && unit !== null) ? unit : "px") };
		container.style.width = width.Value + width.Unit;
	}

	this.GetWidth = function()
	{
		return width;
	}

	this.SetHeight = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectString(unit, true);

		height = { Value: ((val !== undefined && val !== null) ? val : -1), Unit: ((unit !== undefined && unit !== null) ? unit : "px") };

		if (height.Value === -1)
		{
			container.style.height = "";
			return;
		}

		container.style.height = height.Value + height.Unit;
	}

	this.GetHeight = function()
	{
		return height;
	}

	this.AddCssClass = function(val)
	{
		Fit.Validation.ExpectString(val);
		Fit.Dom.AddClass(container, val);
	}

	this.RemoveCssClass = function(val)
	{
		Fit.Validation.ExpectString(val);
		Fit.Dom.RemoveClass(container, val);
	}

	this.Data = function(key, val)
	{
		Fit.Validation.ExpectString(key);
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
			Fit.Dom.Data(container, key, val);

		return Fit.Dom.Data(container, key);
	}

	this.SetVisible = function(val) // show/hide
	{
		Fit.Validation.ExpectBoolean(val);
		container.style.display = ((val === true) ? "" : "none");
	}

	this.SetRequired = function(val, scope)
	{
		Fit.Validation.ExpectBoolean(val);
		Fit.Validation.ExpectString(scope, true);

		required = val;
		me._internal.ValidationScope = scope; // Used by Fit.Controls.ValidateAll
	}

	this.Render = function(toElement)
	{
		Fit.Validation.ExpectDomElement(toElement, true);

		if (toElement)
		{
			toElement.appendChild(me.GetDomElement()); // Using GetDomElement() to get container - may have been overridden on derivative
		}
		else
		{
			var script = document.scripts[document.scripts.length - 1];
			script.parentNode.insertBefore(me.GetDomElement(), script);
		}

		me._internal.Validate();
	}

	this.SetValidationExpression = function(regEx, errorMsg, scope)
	{
		Fit.Validation.ExpectRegExp(regEx, true); // Allow Null which disables validation
		Fit.Validation.ExpectString(errorMsg, true);
		Fit.Validation.ExpectString(scope, true);

		validationExpr = regEx;
		validationError = errorMsg;
		me._internal.ValidationScope = scope; // Used by Fit.Controls.ValidateAll
	}

	this.IsValid = function()
	{
		validationErrorType = -1;

		if (!validationExpr && required === false)
			return true;

		var val = me.Value();

		if (required === true && !val)
		{
			validationErrorType = 0;
			return false;
		}

		if (validationExpr && validationExpr.test(val) === false)
		{
			validationErrorType = 1;
			return false;
		}

		return true;
	}

	this.OnChange = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onChangeHandlers, cb);
	}

	// Private members (must be public in order to be controls inheriting from ControlBase)

	this._internal =
	{
		FireOnChange: function()
		{
			me._internal.Validate();

			Fit.Array.ForEach(onChangeHandlers, function(cb)
			{
				cb(me, me.Value());
			});
		},

		AddDomElement: function(elm)
		{
			container.appendChild(elm);
		},

		RemoveDomElement: function(elm)
		{
			if (elm.parentNode === container)
				container.removeChild(elm);
		},

		Validate: function()
		{
			if (container.parentNode === null)
				return; // Not rendered yet!

			var valid = me.IsValid();

			if (valid === false && lblValidationError === null)
			{
				// Add error indicator

				lblValidationError = document.createElement("div");
				lblValidationError.title = (validationError ? validationError : "");
				lblValidationError.onclick = function() { alert(lblValidationError.title); };
				Fit.Dom.AddClass(lblValidationError, "fa");
				Fit.Dom.AddClass(lblValidationError, "fa-exclamation-circle");
				Fit.Dom.AddClass(lblValidationError, "FitUiControlError");

				//if (required === true && !me.Value()) // Validation failed because no value is set for required field
				if (validationErrorType === 0)
					lblValidationError.title = Fit.Language.Translations.Required;

				container.insertBefore(lblValidationError, container.firstChild);
			}
			else if (valid === false && lblValidationError !== null)
			{
				// Update error indicator - make sure error indicator contains correct description

				if (validationErrorType === 0)
					lblValidationError.title = Fit.Language.Translations.Required;
				else
					lblValidationError.title = ((validationError !== null) ? validationError : "");
			}
			else if (valid === true && lblValidationError !== null)
			{
				// Update error indicator - temporarily show success indicator when invalid value is corrected

				Fit.Dom.RemoveClass(lblValidationError, "fa-exclamation-circle");
				Fit.Dom.AddClass(lblValidationError, "fa-thumbs-up");
				lblValidationError.style.backgroundColor = "green";
				lblValidationError.onclick = null;

				var lblValidationErrorClosure = lblValidationError;
				lblValidationError = null;

				setTimeout(function()
				{
					container.removeChild(lblValidationErrorClosure);
				}, 1000);
			}
		}
	}
}

Fit._internal.ControlBase = {};
Fit._internal.ControlBase.Controls = {};
Fit.Controls.Find = function(id)
{
	return ((Fit._internal.ControlBase.Controls[id] !== undefined) ? Fit._internal.ControlBase.Controls[id] : null);
}

Fit.Controls.ValidateAll = function(scope)
{
	Fit.Validation.ExpectString(scope, true);

	var result = true;
	Fit.Array.ForEach(Fit._internal.ControlBase.Controls, function(controlId)
	{
		var control = Fit._internal.ControlBase.Controls[controlId];

		if (scope && control._internal.ValidationScope !== scope)
			return;

		if (control.IsValid() === false)
		{
			result = false;
			return false;
		}
	});
	return result;
}
