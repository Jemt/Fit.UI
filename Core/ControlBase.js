Fit.Controls = {};
Fit.Controls.ControlBase = {};

Fit.Controls.ControlBase = function(controlId)
{
	if (Fit._internal.ControlBase.Controls[controlId] !== undefined)
		throw new Error("Control with ID '" + controlId + "' has already been defined - Control IDs must be unique!");

	Fit._internal.ControlBase.Controls[controlId] = this;

	// ============================================
	// Interface - must be overridden
	// ============================================

	this.SetValue = function(val)
	{
		throw new Error("Not implemented");
	}

	this.GetValue = function()
	{
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
	var validationRule = null;
	var onSubmitHandler = null;
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
		if (onSubmitHandler !== null)
			Fit.Events.RemoveHandler(document.getElementsByTagName("form")[0], "submit", onSubmitHandler);

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
		Fit.Dom.AddClass(container, val);
	}

	this.RemoveCssClass = function(val)
	{
		Fit.Dom.RemoveClass(container, val);
	}

	this.SetVisible = function(val) // show/hide
	{
		container.style.display = ((val === true) ? "" : "none");
	}

	this.Render = function(toElement)
	{
		toElement.appendChild(container);
	}

	this.SetValueRule = function(regExStr, preventPostback)
	{
		if (onSubmitHandler !== null)
			Fit.Events.RemoveHandler(document.getElementsByTagName("form")[0], "submit", onSubmitHandler);

		validationRule = regExStr;

		if (preventPostback === true)
		{
			onSubmitHandler = function()
			{
				var regEx = new RegExp(regExStr);

				return regEx.test(); // TODO: Also return True ? Perhaps returning anything cancels postback!
			};

			Fit.Events.AddHandler(document.getElementsByTagName("form")[0], "submit", onSubmitHandler);
		}
	}

	this.OnChange = function(cb)
	{
		Fit.Array.Add(onChangeHandlers, cb);
	}

	fireOnChange = function()
	{
		Fit.Array.ForEach(onChangeHandlers, function(cb)
		{
			cb(me, me.GetValue());
		});
	}

	addDomElement = function(elm)
	{
		container.appendChild(elm);
	}
	removeDomElement = function(elm)
	{
		if (elm.parentNode === container)
			container.removeChild(elm);
	}
}

Fit._internal.ControlBase = {};
Fit._internal.ControlBase.Controls = {};
Fit.Controls.Find = function(id)
{
	return ((Fit._internal.ControlBase.Controls[id] !== undefined) ? Fit._internal.ControlBase.Controls[id] : null);
}

/*Fit._internal.ControlBase.EnsureIcons = function()
{
	Fit.Loader.LoadStyleSheet(Fit._internal.BasePath + "/Resources/font-awesome-4.2.0/css/font-awesome.css");
}*/
