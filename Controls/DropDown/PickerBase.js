/// <container name="Fit.Controls.PickerBase">
/// 	Class from which all Picker Controls extend.
/// 	Control developers must override: GetDomElement, Destroy.
/// 	Overriding the following functions is optional:
/// 	UpdateItemSelectionState, SetEventDispatcher, HandleEvent.
/// 	Picker Control must fire OnItemSelectionChanging and OnItemSelectionChanged when an item's
/// 	selection state is being changed, which is done by invoking
/// 	this._internal.FireOnItemSelectionChanging(title:string, value:string, currentSelectionState:boolean)
/// 	and
/// 	this._internal.FireOnItemSelectionChanged(title:string, value:string, newSelectionState:boolean).
/// 	Notice that FireOnItemSelectionChanging may return False, which must prevent item from being
/// 	selected, and at the same time prevent FireOnItemSelectionChanged from being called.
/// 	Changing an item selection may cause OnItemSelectionChanging and OnItemSelectionChanged to be
/// 	fired multiple times (e.g. if picker needs to first deselect one item before selecting another one).
/// 	Therefore PickerBase also features the OnItemSelectionComplete event which must be fired when related
/// 	changes complete, which is done by invoking this._internal.FireOnItemSelectionComplete().
/// 	OnItemSelectionComplete should only fire if a change was made (changes can be canceled using
/// 	OnItemSelectionChanging).
/// </container>
Fit.Controls.PickerBase = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);

	// Support for Fit.Controls.Find(..)

	if (Fit.Validation.IsSet(controlId) === true)
	{
		if (Fit._internal.ControlBase.Controls[controlId] !== undefined)
			Fit.Validation.ThrowError("Control with ID '" + controlId + "' has already been defined - Control IDs must be unique!");

		Fit._internal.ControlBase.Controls[controlId] = this;
	}

	// Private variables

	var me = this;
	var id = (controlId ? controlId : null);

	var onShowHandlers = [];
	var onHideHandlers = [];
	var onChangingHandlers = [];
	var onChangeHandlers = [];
	var onCompleteHandlers = [];

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="GetId" access="public" returns="string">
	/// 	<description> Get unique Control ID </description>
	/// </function>
	this.GetId = function()
	{
		return id;
	}

	/// <function container="Fit.Controls.PickerBase" name="MaxHeight" access="public" returns="object">
	/// 	<description> Get/set max height of control - returns object with Value (number) and Unit (string) properties </description>
	/// 	<param name="value" type="number" default="undefined"> If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content. </param>
	/// 	<param name="unit" type="string" default="undefined"> If defined, max height is updated to specified CSS unit, otherwise px is assumed </param>
	/// </function>
	this.MaxHeight = function(value, unit)
    {
		Fit.Validation.ExpectNumber(value, true);
		Fit.Validation.ExpectStringValue(unit, true);

		var elm = me.GetDomElement();

		if (Fit.Validation.IsSet(value) === true)
		{
			if (value !== -1)
			{
				elm.style.maxHeight = value + ((Fit.Validation.IsSet(unit) === true) ? unit : "px");
			}
			else
			{
				elm.style.maxHeight = "";
			}
		}

		var res = { Value: -1, Unit: "px" }; // No maxHeight set, height adjusts to content

		if (elm.style.maxHeight !== "") // MaxHeight set
		{
			res.Value = parseFloat(elm.style.maxHeight);
			res.Unit = elm.style.maxHeight.replace(res.Value, "");
		}

		return res;
    }

	// ============================================
	// Events fired by host control
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="OnShow" access="public">
	/// 	<description>
	/// 		Register event handler fired when picker control is shown in host control.
	/// 		The following argument is passed to event handler function: Sender (PickerBase).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnShow = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onShowHandlers, cb);
	}

	/// <function container="Fit.Controls.PickerBase" name="OnHide" access="public">
	/// 	<description>
	/// 		Register event handler fired when picker control is hidden in host control.
	/// 		The following argument is passed to event handler function: Sender (PickerBase).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnHide = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onHideHandlers, cb);
	}

	// ============================================
	// Events fired by picker control itself
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="OnItemSelectionChanging" access="public">
	/// 	<description>
	/// 		Register event handler fired when item selection is changing.
	/// 		Selection can be canceled by returning False.
	/// 		The following arguments are passed to event handler function:
	/// 		Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
    this.OnItemSelectionChanging = function(cb)
    {
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onChangingHandlers, cb);
    }

	/// <function container="Fit.Controls.PickerBase" name="OnItemSelectionChanged" access="public">
	/// 	<description>
	/// 		Register event handler fired when item selection is changed.
	/// 		This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode,
	/// 		where an existing selected item is deselected, followed by selection of new item.
	/// 		The following arguments are passed to event handler function:
	/// 		Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
    this.OnItemSelectionChanged = function(cb)
    {
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onChangeHandlers, cb);
    }

	/// <function container="Fit.Controls.PickerBase" name="OnItemSelectionComplete" access="public">
	/// 	<description> Register event handler invoked when a series of related item changes are completed </description>
	/// 	<param name="cb" type="function"> Event handler function which accepts Sender (PickerBase) </param>
	/// </function>
	this.OnItemSelectionComplete = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onCompleteHandlers, cb);
	}

	// ============================================
	// For derivatives - control developers
	// ============================================

	/// <function container="Fit.Controls.PickerBase" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description>
	/// 		Overridden by control developers (required).
	/// 		Get DOMElement representing control.
	/// 	</description>
	/// </function>
	this.GetDomElement = function()
	{
		Fit.Validation.ThrowError("Function not implemented");
	}

	/// <function container="Fit.Controls.PickerBase" name="UpdateItemSelection" access="public">
	/// 	<description>
	/// 		Overridden by control developers (optional).
	/// 		Host control invokes this function when an item's selection state is changed from host control.
	/// 		Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged,
	/// 		as demonstrated below, if the picker control contains the given item.
	///
	/// 		var item = getItem(value);
	/// 		if (item !== null)
	/// 		{
	/// 			&#160;&#160;&#160;&#160; if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected) === false)
	/// 			&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; return false;
	///
	/// 			&#160;&#160;&#160;&#160; item.SetSelected(selected);
	/// 			&#160;&#160;&#160;&#160; this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected);
	/// 		}
	///
	/// 		Both events are fired by passing the given item's title, value, and current selection state.
	/// 		Be aware that host control may pass information about items not found in picker, e.g. when pasting
	/// 		items which may turn out not to be valid selections.
	/// 		Returning False from UpdateItemSelection will cancel the change.
	/// 	</description>
	/// 	<param name="value" type="string"> Item value </param>
	/// 	<param name="selected" type="boolean"> True if item was selected, False if item was deselected </param>
	/// </function>
	this.UpdateItemSelection = function(value, selected)
	{
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(selected);

		// Default implementation fires both events, even though specialized control may not know
		// anything about the given item selected/deselected. This is necessary in order to support
		// events out of the box without requiring developer to override function.

		// It's safe to assume that current selection state is equal to !selected since host control will
		// never call UpdateItemSelection with the current value of the given item, only the desired value.
		if (me._internal.FireOnItemSelectionChanging("", value, !selected) === false)
			return false;

		me._internal.FireOnItemSelectionChanged("", value, selected);
	}

	/// <function container="Fit.Controls.PickerBase" name="SetSelections" access="public">
	/// 	<description>
	/// 		Overridden by control developers (optional).
	/// 		Host control invokes this function when picker is assigned to host control, providing an array
	/// 		of items already selected. An item is an object with a Title (string) and Value (string) property set.
	/// 		If picker defines preselected items, firing OnItemSelectionChanged
	/// 		for these items, will update the host control appropriately.
	/// 	</description>
	/// 	<param name="items" type="array"> Array containing selected items: {Title:string, Value:string} </param>
	/// </function>
	this.SetSelections = function(items)
	{
		Fit.Validation.ExpectArray(items);

		Fit.Array.ForEach(items, function(item)
		{
			Fit.Validation.ExpectString(item.Title);
			Fit.Validation.ExpectString(item.Value);
		});
	}

	/// <function container="Fit.Controls.PickerBase" name="SetEventDispatcher" access="public" returns="DOMElement">
	/// 	<description>
	/// 		Overriden by control developers (optional).
	/// 		Host control invokes this function, passing a reference to the
	/// 		input control dispatching keyboard events using the HandleEvent function.
	/// 		This function may be called multiple times with identical or different controls.
	/// 	</description>
	/// 	<param name="control" type="DOMElement"> Event dispatcher control </param>
	/// </function>
	this.SetEventDispatcher = function(control)
	{
		Fit.Validation.ExpectDomElement(control);
	}

	/// <function container="Fit.Controls.PickerBase" name="HandleEvent" access="public">
	/// 	<description>
	/// 		Overridden by control developers (optional).
	/// 		Host control dispatches keyboard events to this function to allow
	/// 		picker control to handle keyboard navigation with keys such as
	/// 		arrow up/down/left/right, enter, space, etc.
	/// 		Picker may return False to prevent host control from reacting to given event.
	/// 	</description>
	/// 	<param name="e" type="Event" default="undefined"> Keyboard event to process </param>
	/// </function>
	this.HandleEvent = function(e)
	{
		Fit.Validation.ExpectEvent(e, true);
	}

	/// <function container="Fit.Controls.PickerBase" name="Destroy" access="public">
	/// 	<description>
	/// 		Overridden by control developers (required).
	/// 		Destroys control to free up memory.
	/// 		Make sure to call Destroy() on PickerBase which can be done like so:
	/// 		this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
	/// 		{
	/// 			&#160;&#160;&#160;&#160; // Add control specific logic here
	/// 			&#160;&#160;&#160;&#160; base(); // Call Destroy on PickerBase
	/// 		});
	/// 	</description>
	/// </function>
	this.Destroy = function() // Must be overridden - remember to call base !
	{
		me = id = onShowHandlers = onHideHandlers = onChangingHandlers = onChangeHandlers = onCompleteHandlers = null;
	}

	// ============================================
	// Private
	// ============================================

	// Private members (must be public in order to be accessible to host control and controls extending from PickerBase)

	this._internal = (this._internal ? this._internal : {});

	this._internal.Initialize = function() // Called by Host Control when picker is assigned to it
	{
	}

	this._internal.FireOnShow = function() // Called by Host Control
	{
		Fit.Array.ForEach(onShowHandlers, function(handler)
		{
			handler(me);
		});
	},

	this._internal.FireOnHide = function() // Called by Host Control
	{
		Fit.Array.ForEach(onHideHandlers, function(handler)
		{
			handler(me);
		});
	},

	this._internal.FireOnItemSelectionChanging = function(title, value, selected) // Called by Picker Control
	{
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(selected);

		var cancel = false;

		Fit.Array.ForEach(onChangingHandlers, function(handler)
		{
			if (handler(me, { Title: title, Value: value, Selected: selected }) === false)
				cancel = true;
		});

		return !cancel;
	}

	this._internal.FireOnItemSelectionChanged = function(title, value, selected) // Called by Picker Control
	{
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(selected);

		Fit.Array.ForEach(onChangeHandlers, function(handler)
		{
			handler(me, { Title: title, Value: value, Selected: selected });
		});
	}

	this._internal.FireOnItemSelectionComplete = function() // Called by Picker Control
	{
		Fit.Array.ForEach(onCompleteHandlers, function(handler)
		{
			handler(me);
		});
	}
}
