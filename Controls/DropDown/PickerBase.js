Fit.Controls.PickerBase = function()
{
	var me = this;

	/// <function container="Fit.Controls.DropDown.PickerBase" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing control </description>
	/// </function>
	this.GetDomElement = function()
	{
		Fit.Validation.ThrowError("Function not implemented");
	}

	/// <function container="Fit.Controls.DropDown.PickerBase" name="MaxHeight" access="public" returns="object">
	/// 	<description> Get/set max height of control - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, max height is updated to specified value </param>
	/// 	<param name="unit" type="string" default="px"> If defined, max height is updated to specified CSS unit </param>
	/// </function>
	this.MaxHeight = function(val, unit)
    {
        Fit.Validation.ThrowError("Function not implemented");
    }

	/// <function container="Fit.Controls.DropDown.PickerBase" name="OnSelected" access="public">
	/// 	<description>
	/// 		Add event handler fired when an item is selected.
	/// 		Function receives two arguments: title (string), value (string).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
    this.OnSelected = function(cb)
    {
        Fit.Validation.ThrowError("Function not implemented");
    }

	/// <function container="Fit.Controls.DropDown.PickerBase" name="HandleEvent" access="public">
	/// 	<description>
	/// 		Have picker control process keyboard events to support keyboard
	/// 		navigation with keys such as arrow up/down/left/right, enter, etc.
	/// 	</description>
	/// 	<param name="ev" type="Event"> Keyboard event to process </param>
	/// </function>
	this.HandleEvent = function(ev)
	{
		Fit.Validation.ThrowError("Function not implemented");
	}


	// TODO: Get rid of these!
	/*this.SetSelectionHandler = this.OnSelected;
	this.GetElement = this.GetDomElement;
	this.ResetSelection = this.Clear;
	this.SetMaxHeight = function(h) { this.MaxHeight(h, "px"); };
	this.GetSelected = this.Selected;*/
}
