// TODO - potentiale and fairly easy improvements:
//  - Indexed collection of selected nodes for quick retrivale and lookup
//  - Shared event handlers rather than creating new ones for every single item (input fields + delete button)
//  - Multiple drop downs should share same Layer and Hidden field (latter may not be possible if styled differently)
//  - Inputs should register an _internal.Left and _internal.Right attribute revealing position, to replace expensive Fit.Dom.GetIndex(..) = 0 or 2
//  - Font formatting is very hardcoded, and it will not scale properly to general font size on page

//{ Drag and Drop
/*
// Drag and drop support (quick and dirty):
Fit.Array.ForEach(document.querySelectorAll("div.FitUiControlDropDown > div:first-child > span"), function(elm)
{
    var d = new Fit.DragDrop.Draggable(elm);
    d.OnDragStop(function(dObj)
    {
        dObj.Reset();
    });
});
Fit.Array.ForEach(document.querySelectorAll("div.FitUiControlDropDown > div:first-child > span > input"), function(elm)
{
    var dz = new Fit.DragDrop.Dropzone(elm);
    dz.OnDrop(function(dzObj, dObj)
    {
        var dz = dzObj.GetElement();
        var d = dObj.GetElement();

        if (Fit.Dom.GetIndex(dz) === 0) // Left input
            Fit.Dom.InsertBefore(dz.parentElement, d);
        else // Right input
            Fit.Dom.InsertAfter(dz.parentElement, d);
    });
});
*/
//}

/// <container name="Fit.Controls.DropDown">
/// 	Drop Down Menu control allowing for single and multi selection.
/// 	Supports data selection using any control extending from Fit.Controls.PickerBase.
/// 	This control is extending from Fit.Controls.ControlBase.
/// </container>

/// <function container="Fit.Controls.DropDown" name="DropDown" access="public">
/// 	<description> Create instance of DropDown control </description>
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.DropDown = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

    var me = this;                              // Access to members from event handlers (where "this" may have a different meaning)
    var itemContainer = null					// Container for selected items and input fields
	var layer = null;                           // Invisible background layer used to close drop down menu when clicked
    var hidden = null;                          // Area used to hide DOM elements (e.g span used to calculate width of input fields)
    var spanFitWidth = null;                    // Span element used to calculate text width - used to dynamically control width of input fields
    var txtPrimary = null;                      // Primary input (search) field initially available
    var txtCssWidth = -1;                       // Width of input (search) field(s) - specified using CSS
    var txtActive = null;                       // Currently active input (search) field
    var dropDownMenu = null;                    // Drop down menu element
    var picker = null;                          // Picker control within drop down menu
	var orgSelections = [];						// Original selection set using Value(..) function - used to determine whether control is dirty
    var invalidMessage = "Invalid selection";   // Mouse over text for invalid selections
    var initialFocus = true;                    // Flag indicating first focus of control
    var multiMode = true;                       // Flag indicating whether control allows for multiple selections
	var maxHeight = 150;						// Picker max height (px)

	var onInputChangedHandlers = [];			// Invoked when input value is changed - takes two arguments (sender (this), text value)
	var onPasteHandlers = [];					// Invoked when a value is pasted - takes two arguments (sender (this), text value)
	var onOpenHandlers = [];					// Invoked when drop down is opened - takes one argument (sender (this))
	var onCloseHandlers = [];					// Invoked when drop down is closed - takes one argument (sender (this))

	function init()
	{
		invalidMessage = Fit.Language.Translations.InvalidSelection;

		// Create item container

		itemContainer = document.createElement("div");
		Fit.Dom.AddClass(itemContainer, "FitUiControlDropDownItems");
		itemContainer.onclick = function()
		{
			focusInput(txtPrimary);
			me.OpenDropDown();
		}

		// Create arrow button used to open drop down

		var arrow = document.createElement("i");
		Fit.Dom.AddClass(arrow, "fa");
		Fit.Dom.AddClass(arrow, "fa-chevron-down");
        arrow.onclick = function(e)
        {
			// Do nothing by default, event propagates out to itemContainer
			// which opens drop down (See itemContainer.onclick handler above).

			// Close drop down if already open
            if (me.IsDropDownOpen() === true)
            {
                me.CloseDropDown();
				Fit.Events.StopPropagation(e); // Prevent drop down from opening again
            }
        }

		// Create primary search textbox

		txtPrimary = createSearchField();
		txtActive = txtPrimary;

		// Create drop down menu

		dropDownMenu = document.createElement("div");
		Fit.Dom.AddClass(dropDownMenu, "FitUiControlDropDownPicker");

		// Create hidden span used to calculate width of input field value

		hidden = document.createElement("div");
		Fit.Dom.AddClass(hidden, "FitUiControlDropDownHidden");

		spanFitWidth = document.createElement("span");

		// Create fullscreen invisible layer behind picker that causes drop down to close when clicked

		layer = document.createElement("div");
		Fit.Dom.AddClass(layer, "FitUiControlDropDownLayer");
		layer.onclick = function()
		{
			me.CloseDropDown();
		}

		// Append elements to the DOM

		Fit.Dom.Add(document.body, layer);
		//Fit.Dom.Add(document.body, hidden);
		Fit.Dom.Add(hidden, spanFitWidth);
		Fit.Dom.Add(itemContainer, txtPrimary);
		Fit.Dom.Add(itemContainer, arrow);
		me._internal.AddDomElement(itemContainer);
		me._internal.AddDomElement(dropDownMenu);
		me._internal.AddDomElement(hidden);

		me.AddCssClass("FitUiControlDropDown");
	}

	// ============================================
	// Public
	// ============================================

    // Error message

	/// <function container="Fit.Controls.DropDown" name="InvalidSelectionMessage" access="public" returns="string">
	/// 	<description> Get/set mouse over text shown for invalid selections </description>
	/// 	<param name="msg" type="string" default="undefined"> If defined, error message for invalid selections are set </param>
	/// </function>
    this.InvalidSelectionMessage = function(msg)
    {
		Fit.Validation.ExpectString(msg, true);

		if (Fit.Validation.IsSet(msg) === true)
		{
			invalidMessage = msg;

			Fit.Array.ForEach(getSelectionElements(), function(selection)
			{
				if (Fit.Dom.HasClass(selection, "FitUiControlDropDownInvalid") === true)
					Fit.Dom.Attribute(selection, "title", invalidMessage);
			});
		}

		return invalidMessage;
    }

    // Dimensions

	/// <function container="Fit.Controls.DropDown" name="DropDownMaxHeight" access="public" returns="integer">
	/// 	<description> Get/set max height of drop down in pixels </description>
	/// 	<param name="val" type="integer" default="undefined> If defined, updates drop down max height (pixels) </param>
	/// </function>
    this.DropDownMaxHeight = function(val)
    {
		Fit.Validation.ExpectInteger(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			maxHeight = val;

			if (picker !== null)
				picker.MaxHeight(val, "px");
		}

		return maxHeight
    }

    // ControlBase interface

	/// <function container="Fit.Controls.DropDown" name="Value" access="public" returns="object">
	/// 	<description>
	/// 		Fit.Controls.ControlBase.Value override:
	/// 		Get/set control selections.
	/// 		Set selections by providing a string in one the following formats:
	/// 		title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
	/// 		Data is returned as an item array with objects containing Title and Value properties.
	/// 		Array implements ToString as defined by ControlBase which returns data as val1[;val2[;val3]].
	/// 	</description>
	/// 	<param name="val" type="object" default="undefined"> If defined, items are selected </param>
	/// </function>
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		// Set

		if (Fit.Validation.IsSet(val) === true)
		{
			orgSelection = [];
			var fireChange = (getSelectionElements().length > 0 || val !== ""); // Fire OnChange if current selections are cleared, and/or if new selections are set

			me._internal.ExecuteWithNoOnChange(function()
			{
				me.Clear();

				if (val !== "")
				{
					Fit.Array.ForEach(val.split(";"), function(item)
					{
						var res = true;
						var info = item.split("=");

						if (info.length === 2) // Format: title1=val1;title2=val2;title3=val3
							me.AddSelection(info[0], info[1]);
						else // Format: val1;val2;val3
							me.AddSelection(info[0], info[0]);
					});
				}
			});

			orgSelections = me.GetSelections();

			if (fireChange === true)
				fireOnChange();
		}

		// Get

		var selections = me.GetSelections(); // Invalid selections excluded

		selections.toString = function(alternativeSeparator)
		{
			Fit.Validation.ExpectString(alternativeSeparator, true);

			var val = "";
			Fit.Array.ForEach(this, function(item)
			{
				val += ((val !== "") ? ((Fit.Validation.IsSet(alternativeSeparator) === true) ? alternativeSeparator : ";") : "") + item.Value;
			});
			return val;
		}

		return selections;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		return (Fit.Core.IsEqual(orgSelections, me.GetSelections()) === false); // Invalid selections excluded
	}

	// See documentation on ControlBase
	this.Clear = function()
	{
		me.ClearSelections();
	}

	// See documentation on ControlBase
    this.Focused = function(val)
    {
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true)
			{
				var c = txtPrimary; //txtActive;
				var v = c.value;

				// Set focus
				c.focus();

				// Make cursor move to end
				c.value = "";
				c.value = v;
			}
			else if (val === false && txtActive === document.activeElement)
			{
				me.CloseDropDown();
				txtActive.blur();
			}
		}

		return (txtActive === document.activeElement);
    }

	// Misc. options

	/// <function container="Fit.Controls.DropDown" name="MultiSelectionMode" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether control allows for multiple selections </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables multi selection mode, False disables it </param>
	/// </function>
    this.MultiSelectionMode = function(val)
    {
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
			multiMode = val;

		return multiMode;
    }

    // Controlling selections

	var suppressUpdateItemSelectionState = false;
	var suppressOnItemSelectionChanged = false;

	/// <function container="Fit.Controls.DropDown" name="SetPicker" access="public">
	/// 	<description> Set picker control used to add items to drop down control </description>
	/// 	<param name="pickerControl" type="Fit.Controls.PickerBase"> Picker control extending from PickerBase </param>
	/// </function>
	this.SetPicker = function(pickerControl)
	{
		Fit.Validation.ExpectInstance(pickerControl, Fit.Controls.PickerBase, true);

		// Remove existing picker

		if (picker !== null)
			Fit.Dom.Remove(picker.GetDomElement());

		// Add picker

		if (!pickerControl)
		{
			picker = null;
			return;
		}

		picker = pickerControl;
		Fit.Dom.Add(dropDownMenu, picker.GetDomElement());

		picker.SetEventDispatcher(txtActive);

		// Allow picker to select items in case selections have already been set in drop down

		suppressOnItemSelectionChanged = true;
		picker.SetSelections(me.Value().toString());
		suppressOnItemSelectionChanged = false;

		// Set picker MaxHeight

		picker.MaxHeight(maxHeight, "px");

		// Make sure OnItemSelectionChanged is only registered once

		if (!picker._internal)
			picker._internal = {};

		if (picker._internal.HostControl)
			return;

		picker._internal.HostControl = me;

		// Register OnItemSelectionChanged handler which is used to
		// synchronize selections from picker control to drop down.

		picker.OnItemSelectionChanged(function(sender, eventArgs)
		{
			if (suppressOnItemSelectionChanged === true)
				return;

			var txt = null;

			// Prevent this.AddSelection and this.RemoveSelection from calling
			// picker.UpdateItemSelection which in turn fires OnItemSelectionChanged, causing an infinite loop.
			suppressUpdateItemSelectionState = true;

			if (eventArgs.Selected === true)
			{
				me.AddSelection(eventArgs.Title, eventArgs.Value); // Skips item if already added

				if (multiMode === false)
					me.CloseDropDown();
			}
			else
			{
				txt = txtActive; // RemoveSelection changes txtActive
				me.RemoveSelection(eventArgs.Value);

				// Fix - if item removed was the last item, and txtActive
				// was one of the input fields belonging to that selection,
				// it will now have been removed.
				if (txt.parentElement.parentElement === null)
					txt = txtPrimary;
			}

			focusInput(((txt !== null) ? txt : txtActive));

			suppressUpdateItemSelectionState = false;
		});
	}

	/// <function container="Fit.Controls.DropDown" name="AddSelection" access="public">
	/// 	<description> Add selection to control </description>
	/// 	<param name="title" type="string"> Item title </param>
	/// 	<param name="value" type="string"> Item value </param>
	/// 	<param name="valid" type="boolean" default="true">
	/// 		Flag indicating whether selection is valid or not. Invalid selections are highlighted and
	/// 		not included when selections are retrived using Value() function, and not considered when
	/// 		IsDirty() is called to determine whether control value has been changed by user.
	/// 		GetSelections(true) can be used to retrive all items, including invalid selections.
	/// 	</param>
	/// </function>
    this.AddSelection = function(title, value, valid)
    {
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(valid, true);

        if (me.GetSelectionByValue(value) !== null)
            return;

		// Update picker control

		// Notice: suppressUpdateItemSelectionState is True if item was added by picker,
		// in which case picker.UpdateItemSelection(..) should not be called.
		// What happens is that picker fires drop down's OnItemSelectionChanged when an item is
		// selected, which sets suppressUpdateItemSelectionState to True, and calls AddSelection.
		// Failing to prevent picker.UpdateItemSelection(..) from being called in this case could
		// result in an infinite loop.
		if (picker !== null && suppressUpdateItemSelectionState === false)
		{
			// Notice: Picker fires OnItemSelectionChanged when picker.UpdateItemSelection(..) is invoked
			// below (other controls than DropDown may have registered an OnItemSelectionChanged
			// handler too). In this case we set suppressOnItemSelectionChanged to True, causing
			// drop down to do nothing in OnItemSelectionChanged when fired. Drop down's OnItemSelectionChanged
			// handler is responsible for handling items added/removed by picker, but in this case the change did not
			// come from the picker (since suppressUpdateItemSelectionState is False).
			// Failing to set this flag could result in an infinite loop.
			suppressOnItemSelectionChanged = true;

			var res = true;
			var error = null;

			try // Make sure we can set suppressOnItemSelectionChanged false again, so drop down remains in a functioning state
			{
				res = picker.UpdateItemSelection(value, true);
			}
			catch (err) { error = err; }

			suppressOnItemSelectionChanged = false;

			if (error !== null)
				Fit.Validation.ThrowError(error);

			if (res === false)
				return; // Picker prevented selection from being added
		}

        // Clear selection if in Single Selection Mode

		if (multiMode === false)
            me._internal.ExecuteWithNoOnChange(function() { me.ClearSelections(); });

		// Create new item

		// Delete button
		var cmdDelete = document.createElement("i");
		Fit.Dom.AddClass(cmdDelete, "fa");
		Fit.Dom.AddClass(cmdDelete, "fa-times");
		cmdDelete.onclick = function(e)
        {
            me.RemoveSelection(Fit.Dom.Data(cmdDelete.parentElement, "value"));

			focusInput(txtPrimary);

            // Do not open drop down when an item is removed
            Fit.Events.StopPropagation(e);
        }

		// Item container (left input, title box, right input)
        var container = document.createElement("span");

		// Input fields (left and right)
        var searchLeft = createSearchField();
        var searchRight = createSearchField();

		// Title box
        var item = document.createElement("span");
		Fit.Dom.Data(item, "value", value)

		// Set CSS class and mouse over for invalid selection
        if (valid === false)
		{
			Fit.Dom.Attribute(item, "title", invalidMessage);
			Fit.Dom.AddClass(item, "FitUiControlDropDownInvalid");
		}

		// Add title and delete button to title box
		Fit.Dom.Add(item, document.createTextNode(title));
		Fit.Dom.Add(item, cmdDelete);

		// Add elements to item container
		Fit.Dom.Add(container, searchLeft);
		Fit.Dom.Add(container, item);
		Fit.Dom.Add(container, searchRight);

		// Add new item

        var before = null;

		if (txtActive !== txtPrimary && multiMode === true && Fit.Dom.GetIndex(txtActive) === 0) // Left input
			before = txtActive.parentElement;
		else if (txtActive !== txtPrimary && multiMode === true && Fit.Dom.GetIndex(txtActive) === 2) // Right input
			before = txtActive.parentElement.nextSibling;
		else
			before = txtPrimary;

        itemContainer.insertBefore(container, before);

		// Clear input control value

        me.ClearInput();

		// Focus input control

        if (multiMode === true)
        {
			// Make input to the right of newly added item active. This to make sure that
            // the next item added appears to the right of the previously added item.
            // If a left input field is selected, it remains focused, as the new element
            // is added in front of the left input field.
			if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2)
				focusInput(searchRight);
        }
		else
		{
			// Always focus primary search field in Single Selection Mode
			focusInput(txtPrimary);
		}

		// Fire OnChange event

        fireOnChange();
    }

	/// <function container="Fit.Controls.DropDown" name="GetSelections" access="public" returns="array">
	/// 	<description> Get selected items - returned array contain objects with Title (string), Value (string), and Valid (boolean) properties </description>
	/// 	<param name="includeInvalid" type="boolean" default="false"> Flag indicating whether invalid selection should be included or not </param>
	/// </function>
    this.GetSelections = function(includeInvalid)
    {
		Fit.Validation.ExpectBoolean(includeInvalid, true);

		var selections = Fit.Array.ToArray(itemContainer.children); // Convert NodeList to JS Array, since RemoveAt takes an instance of Array

		// Remove two last elements from array which are not selections (primary input field and arrow button)
		Fit.Array.RemoveAt(selections, selections.length - 1);
		Fit.Array.RemoveAt(selections, selections.length - 1);

        var toReturn = [];
		Fit.Array.ForEach(selections, function(selection)
		{
			if (includeInvalid === true || Fit.Dom.HasClass(selection.children[1], "FitUiControlDropDownInvalid") === false)
				Fit.Array.Add(toReturn, { Title: Fit.Dom.Text(selection.children[1]), Value: Fit.Dom.Data(selection.children[1], "value"), Valid: !Fit.Dom.HasClass(selection.children[1], "FitUiControlDropDownInvalid") });
		});
        return toReturn;
    }

	/// <function container="Fit.Controls.DropDown" name="GetSelectionByValue" access="public" returns="object">
	/// 	<description> Get selected item by value - returns object with Title (string), Value (string), and Valid (boolean) properties if found, otherwise Null is returned </description>
	/// 	<param name="val" type="string"> Value of selected item to retrive </param>
	/// </function>
    this.GetSelectionByValue = function(val)
    {
		Fit.Validation.ExpectString(val);

		var found = null;
		Fit.Array.ForEach(me.GetSelections(), function(selection)
		{
			if (selection.Value === val)
			{
				found = selection;
				return false; // Break loop
			}
		});
        return found;
    }

	/// <function container="Fit.Controls.DropDown" name="ClearSelections" access="public">
	/// 	<description> Clear selections </description>
	/// </function>
    this.ClearSelections = function()
    {
        var selections = getSelectionElements();
        var fireEvent = false;

		me._internal.ExecuteWithNoOnChange(function() // picker.UpdateItemSelection results in OnChange being fired
		{
			Fit.Array.ForEach(getSelectionElements(), function(selection)
			{
				if (picker !== null)
				{
					var res = picker.UpdateItemSelection(Fit.Dom.Data(selection, "value"), false); // OnItemSelectionChanging and OnItemSelectionChanged are fired if picker recognizes item, causing it to be removed in drop down's OnItemSelectionChanged handler (unless canceled, in which case False is returned)

					if (res !== false && selection.parentElement.parentElement !== null)
					{
						// Element was not removed (stilled rooted in DOM), because picker did not recognize
						// it (did not fire OnItemSelectionChanged) which would otherwise have triggered Drop
						// Down's OnItemSelectionChanged handler, which in turn would have called RemoveSelection.
						// And we know it did not cancel change since picker.UpdateItemSelection did not return False.
						// It is fine to remove item.
						Fit.Dom.Remove(selection.parentElement);
					}

					if (res !== false)
						fireEvent = true;
				}
				else
				{
					Fit.Dom.Remove(selection.parentElement);
					fireEvent = true;
				}
			});
		});

        if (fireEvent === true)
            fireOnChange();

		focusInput(txtPrimary);
    }

	/// <function container="Fit.Controls.DropDown" name="RemoveSelection" access="public">
	/// 	<description> Remove selected item by value </description>
	/// 	<param name="value" type="string"> Value of selected item to remove </param>
	/// </function>
    this.RemoveSelection = function(value)
    {
		Fit.Validation.ExpectString(value);

		// Update picker control.
		// Notice: suppressUpdateItemSelectionState is True if item was removed by picker,
		// in which case picker.UpdateItemSelection(..) should not be called.
		// What happens is that picker fires drop down's OnItemSelectionChanged when an item is
		// deselected, which sets suppressUpdateItemSelectionState to True, and calls RemoveSelection.
		// Failing to prevent picker.UpdateItemSelection(..) from being called in this case could
		// result in an infinite loop.
		if (picker !== null && suppressUpdateItemSelectionState === false)
		{
			// Notice: Picker fires OnItemSelectionChanged when picker.UpdateItemSelection(..) is invoked
			// below (other controls than DropDown may have registered an OnItemSelectionChanged
			// handler too). In this case we set suppressOnItemSelectionChanged to True, causing
			// drop down to do nothing in OnItemSelectionChanged when fired. Drop down's OnItemSelectionChanged
			// handler is responsible for handling items added/removed by picker, but in this case the change did not
			// come from the picker (since suppressUpdateItemSelectionState is False).
			// Failing to set this flag could result in an infinite loop.
			suppressOnItemSelectionChanged = true;

			var res = false;
			var error = null;

			try // Make sure we can set suppressOnItemSelectionChanged false again, so drop down remains in a functioning state
			{
				res = picker.UpdateItemSelection(value, false);
			}
			catch (err) { error = err; }

			suppressOnItemSelectionChanged = false;

			if (error !== null)
				Fit.Validation.ThrowError(error);

			if (res === false)
				return; // Picker prevented selection from being removed
		}

        var changed = false;

		Fit.Array.ForEach(getSelectionElements(), function(selection)
        {
			if (Fit.Dom.Data(selection, "value") === value)
            {
                if (selection.parentElement.nextSibling !== null && selection.parentElement.nextSibling !== txtPrimary)
                    focusInput(selection.parentElement.nextSibling.children[0]);
                else
                    focusInput(txtPrimary);

				Fit.Dom.Remove(selection.parentElement);
                changed = true;

                return false;
            }
        })

        if (changed === true)
            fireOnChange();
    }

    // Controlling input field

	/// <function container="Fit.Controls.DropDown" name="ClearInput" access="public">
	/// 	<description> Clear text field </description>
	/// </function>
    this.ClearInput = function(input)
    {
		Fit.Validation.ExpectInstance(input, HTMLInputElement, true);

        inp = ((Fit.Validation.IsSet(input) === true) ? input : txtActive);
        inp.value = "";
        inp.style.width = null;
    }

	/// <function container="Fit.Controls.DropDown" name="SetInputValue" access="public">
	/// 	<description>
	/// 		Set value of text field which is automatically cleared the first time control
	/// 		receives focus. Notice that this function should be called after AddSelection(..),
	/// 		since adding selections causes the value of the text field to be cleared.
	/// 	</description>
	/// 	<param name="val" type="string"> New value for text field </param>
	/// </function>
    this.SetInputValue = function(val)
    {
		Fit.Validation.ExpectString(val);

        txtPrimary.value = val;
        fitWidthToContent(txtPrimary);
    }

    // Controlling drop down menu

	/// <function container="Fit.Controls.DropDown" name="OpenDropDown" access="public">
	/// 	<description> Open drop down menu </description>
	/// </function>
    this.OpenDropDown = function()
    {
		if (dropDownMenu.style.display === "block")
			return;

        if (Fit._internal.DropDown.Current !== null && Fit._internal.DropDown.Current !== me)
            Fit._internal.DropDown.Current.CloseDropDown();

        layer.style.display = "block";
        dropDownMenu.style.display = "block";

        Fit._internal.DropDown.Current = me;

        fireOnDropDownOpen();
    }

	/// <function container="Fit.Controls.DropDown" name="CloseDropDown" access="public">
	/// 	<description> Close drop down menu </description>
	/// </function>
    this.CloseDropDown = function()
    {
		if (dropDownMenu.style.display === "none")
			return;

        layer.style.display = "none";
        dropDownMenu.style.display = "none";

        Fit._internal.DropDown.Current = null;

        fireOnDropDownClose();
    }

	/// <function container="Fit.Controls.DropDown" name="IsDropDownOpen" access="public" returns="boolean">
	/// 	<description> Get flag indicating whether drop down is open or not </description>
	/// </function>
    this.IsDropDownOpen = function()
    {
        return (dropDownMenu.style.display === "block");
    }

	// ============================================
	// Events (OnChange defined on BaseControl)
	// ============================================

	/// <function container="Fit.Controls.TreeView" name="OnInputChanged" access="public">
	/// 	<description>
	/// 		Add event handler fired when input value is changed.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.DropDown) and Value (string).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnInputChanged = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onInputChangedHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnPaste" access="public">
	/// 	<description>
	/// 		Add event handler fired when text is pasted into input field.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.DropDown) and Value (string).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnPaste = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPasteHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnOpen" access="public">
	/// 	<description>
	/// 		Add event handler fired when drop down menu is opened.
	/// 		Function receives one argument: Sender (Fit.Controls.DropDown)
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnOpen = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onOpenHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnClose" access="public">
	/// 	<description>
	/// 		Add event handler fired when drop down menu is closed.
	/// 		Function receives one argument: Sender (Fit.Controls.DropDown)
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

    function createSearchField()
    {
        var txt = document.createElement("input");
        txt.autocomplete = "off";

        txt.onpaste = function(e)
        {
            setTimeout(function() // Timeout to queue event to have pasted value available
            {
                fitWidthToContent(txt);

                fireOnPaste(txt.value);
                fireOnInputChanged(txt.value);
            }, 100);
        }

        txt.onfocus = function(e)
        {
            if (initialFocus === true)
            {
                initialFocus = false;
                me.ClearInput(txtPrimary);
            }

            txtActive = txt;

			if (picker !== null)
				picker.SetEventDispatcher(txtActive);
        }

        txt.onkeydown = function(e) // Fires continuously for any key pressed - both characters and e.g backspace/delete/arrows etc. Key press may be canceled (change has not yet occured)
        {
			var ev = Fit.Events.GetEvent(e);

            txtActive = txt;
            clearAllInputsButActive();

			if (picker !== null)
			{
				//picker.SetEventDispatcher(txtActive);

				if (me.IsDropDownOpen() === true)
				{
					var res = picker.HandleEvent(ev);

					if (res === false)
						return; // Picker returned False to prevent DropDown from also handling event
				}
			}

            if (ev.keyCode === 9) // Tab
            {
                if (ev.shiftKey === true) // Moving left
                {
                    if (me.GetSelections().length === 0)
                    {
                        me.CloseDropDown();
                        return;
                    }
                    else if (txt !== txtPrimary && txt.parentElement.previousSibling === null)
                    {
                        me.CloseDropDown();
                        return;
                    }

                    moveToInput("Prev", true);
                }
                else // Moving right
                {
                    if (txt === txtPrimary)
                    {
                        me.CloseDropDown();
                        return;
                    }

                    moveToInput("Next", true);
                }

                return false;
            }
            else if (ev.keyCode === 38) // Arrow up
            {
                me.OpenDropDown(); // Make sure it is opened
            }
            else if (ev.keyCode === 40) // Arrow down
            {
                me.OpenDropDown(); // Make sure it is opened
            }
            else if (ev.keyCode === 37) // Arrow left
            {
                moveToInput("Prev", true);
            }
            else if (ev.keyCode === 39) // Arrow right
            {
                moveToInput("Next", true);
            }
            else if (ev.keyCode === 27) // Escape
            {
                me.CloseDropDown();
            }
            else if (ev.keyCode === 8) // Backspace - remove selection
            {
                if (txt.value.length === 0)
                {
                    var toRemove = null;

					if (txt !== txtPrimary && Fit.Dom.GetIndex(txt) === 2) // Right input
                        toRemove = txt.parentElement;
					else if (txt !== txtPrimary && Fit.Dom.GetIndex(txt) === 0 && txt.parentElement.previousSibling !== null) // Left input
                        toRemove = txt.parentElement.previousSibling;
					else if (txt.previousSibling !== null) // Primary input
                        toRemove = txt.previousSibling;

                    if (toRemove !== null)
                    {
						// Update focus if input in item being removed has focus

                        if (toRemove.previousSibling !== null)
                            focusInput(toRemove.previousSibling.children[2]); // Focus right input in selection that comes before
						else if (toRemove.nextSibling.tagName === "SPAN")
                            focusInput(toRemove.nextSibling.children[0]); // Focus left input in selection that comes after (no more selection to the left of selection being removed)

                        me.RemoveSelection(Fit.Dom.Data(toRemove.children[1], "value"));
                    }
                }
                else
                {
                    // New length is not known when removing characters until OnKeyUp is fired.
                    // We won't wait for that. Instead we calculate the width "once in a while".
                    // Passing txt instance rather than txtActive, as the latter may change before
                    // timeout is reached and delegate is executed.
                    setTimeout(function() { fitWidthToContent(txt); }, 100);
                }
            }
            else if (ev.keyCode === 46) // Delete - remove selection
            {
                if (txt.value.length === 0)
                {
                    var toRemove = null;

					if (txt !== txtPrimary && Fit.Dom.GetIndex(txt) === 0) // Left input
                        toRemove = txt.parentElement;
					else if (txt !== txtPrimary && Fit.Dom.GetIndex(txt) === 2 && txt.parentElement.nextSibling.tagName === "SPAN") // Right input
                        toRemove = txt.parentElement.nextSibling;

                    if (toRemove !== null)
                    {
						// Update focus if input in item being removed has focus

						if (toRemove.nextSibling.tagName === "SPAN")
							focusInput(toRemove.nextSibling.children[0]); // Focus left input in selection that comes after
                        else
                            focusInput(txtPrimary);

                        me.RemoveSelection(Fit.Dom.Data(toRemove.children[1], "value"));
                    }
                }
                else
                {
                    // New length is not known when removing characters until OnKeyUp is fired.
                    // We won't wait for that. Instead we calculate the width "once in a while".
                    // Passing txt instance rather than txtActive, as the latter may change before
                    // timeout is reached and delegate is executed.
                    setTimeout(function() { fitWidthToContent(txt); }, 100);
                }
            }
			else if (ev.keyCode === 13) // Enter
			{
				// Prevent form submit
				Fit.Events.PreventDefault(e);
			}
            else
            {
                fitWidthToContent(txt, txt.value + String.fromCharCode(ev.keyCode | ev.charCode));
            }
        }

		txt.onkeyup = function(e) // Fires only once when a key is released
        {
            var ev = Fit.Events.GetEvent(e);

            if (ev.keyCode !== 37 && ev.keyCode !== 38 && ev.keyCode !== 39 && ev.keyCode !== 40 && ev.keyCode !== 27 && ev.keyCode !== 9 && ev.keyCode !== 16 && ev.ctrlKey === false && ev.keyCode !== 17) // Do not fire change event for: arrow keys, escape, tab, shift, and on paste (never fires when CTRL is held down (ev.ctrlKey true) or released (ev.keyCode 17))
            {
                fireOnInputChanged(txt.value);
            }
        }

        txt.onclick = function(e)
        {
            Fit.Events.StopPropagation(e);
        }

        return txt;
    }

    function getSelectionElements() // Return spans containing Title and Value (also include elements marked as invalid selections)
    {
		return itemContainer.querySelectorAll("span[data-value]");
    }

    function fitWidthToContent(input, val) // Set width of input field equivalent to its content
    {
		Fit.Validation.ExpectInstance(input, HTMLInputElement);
		Fit.Validation.ExpectString(val, true);

        var value = ((Fit.Validation.IsSet(val) === true) ? val : input.value);

        // Width of txtPrimary cannot reliably be determined initially if picker is hidden.
        // Re-calculating when fitWidthToContent gets called again when the picker is visible.
        if (txtCssWidth <= 0)
            txtCssWidth = txtPrimary.offsetWidth; // Notice: offsetWidth returns 0 if picker is hidden using display:none

        spanFitWidth.innerHTML = value;
        input.style.width = (((value !== "") ? spanFitWidth.offsetWidth : 0) + txtCssWidth) + "px";
    }

    function moveToInput(direction, moveContent) // direction = Next/Prev
    {
		Fit.Validation.ExpectString(direction);
		Fit.Validation.ExpectBoolean(moveContent);

        var newInput = null;

        if (direction === "Prev") // Moving left
        {
			if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 0 && txtActive.parentElement.previousSibling !== null) // Left input has focus
				newInput = txtActive.parentElement.previousSibling.children[0];
			else if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2) // Right input has focus
				newInput = txtActive.parentElement.children[0];
			else if (txtActive.previousSibling !== null) // Primary input has focus
				newInput = txtActive.previousSibling.children[0];
        }
        else // Moving right
        {
			if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 0) // Left input has focus
				newInput = txtActive.parentElement.children[2];
			else if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2 && txtActive.parentElement.nextSibling.tagName === "SPAN") // Right input has focus
				newInput = txtActive.parentElement.nextSibling.children[2];

			// If newInput belongs to last selection, then select txtPrimary instead
			if (newInput !== null && newInput.parentElement.nextSibling === txtPrimary)
                newInput = txtPrimary;
        }

        if (newInput === null) // May be null if no selections are available to move to
            return;

        if (moveContent === true)
        {
            newInput.value = txtActive.value;
            me.ClearInput();

            fitWidthToContent(newInput);
        }

        focusInput(newInput);
    }

    function focusInput(input)
    {
		Fit.Validation.ExpectInstance(input, HTMLInputElement);

        txtActive = input;
        txtActive.focus();

		if (picker !== null)
			picker.SetEventDispatcher(txtActive);
    }

    function clearAllInputsButActive()
    {
        var inputs = itemContainer.getElementsByTagName("input");

		Fit.Array.ForEach(inputs, function(input)
		{
			if (input === txtActive)
                return;

            me.ClearInput(input);
		});
    }

    // Event dispatchers

    function fireOnInputChanged(val)
    {
		Fit.Validation.ExpectString(val);

		Fit.Array.ForEach(onInputChangedHandlers, function(handler)
		{
			handler(me, val);
		});
    }

    function fireOnChange()
    {
		me._internal.FireOnChange();
    }

    function fireOnPaste(val)
    {
		Fit.Validation.ExpectString(val);

		Fit.Array.ForEach(onPasteHandlers, function(handler)
		{
			handler(me, val);
		});
    }

    function fireOnDropDownOpen()
    {
		Fit.Array.ForEach(onOpenHandlers, function(handler)
		{
			handler(me);
		});

		if (picker !== null)
			picker._internal.FireOnShow();
    }

    function fireOnDropDownClose()
    {
		Fit.Array.ForEach(onCloseHandlers, function(handler)
		{
			handler(me);
		});

		if (picker !== null)
			picker._internal.FireOnHide();
    }

	init();
}

Fit._internal.DropDown = {};
Fit._internal.DropDown.Current = null;