/// <container name="Fit.Controls.DropDown" extends="Fit.Controls.ControlBase">
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

	var me = this;								// Access to members from event handlers (where "this" may have a different meaning)
	var itemContainer = null;					// Container for selected items and input fields
	var arrow = null;							// Arrow button used to open/close drop down menu
	var hidden = null;							// Area used to hide DOM elements (e.g span used to calculate width of input fields)
	var spanFitWidth = null;					// Span element used to calculate text width - used to dynamically control width of input fields
	var txtPrimary = null;						// Primary input (search) field initially available
	var txtCssWidth = -1;						// Width of input (search) field(s) - specified using CSS
	var txtActive = null;						// Currently active input (search) field
	var txtEnabled = false;						// Flag indicating whether user can enter text
	var dropDownMenu = null;					// Drop down menu element
	var picker = null;							// Picker control within drop down menu
	var orgSelections = [];						// Original selection set using Value(..) function - used to determine whether control is dirty
	var invalidMessage = "Invalid selection";	// Mouse over text for invalid selections
	var initialFocus = true;					// Flag indicating first focus of control
	var maxHeight = { Value: 150, Unit: "px"};	// Picker max height (px)
	var prevValue = "";							// Previous input value - used to determine whether OnChange should be fired
	var focusAssigned = false;					// Boolean ensuring that control is only given focus when AddSelection is called, if user assigned focus to control
	var visibilityObserverId = -1;				// Observer (ID) responsible for updating input control width when drop down becomes visible (if initially hidden)
	var widthObserverId = -1;					// Observer (ID) responsible for updating tab flow when control width is changed
	var tabOrderObserverId = -1;				// Observer (ID) responsible for updating tab flow when control becomes visible
	var partiallyHidden = null;					// Reference to item partially hidden (only used in Single Selection Mode where word wrapping is disabled)
	var closeHandlers = [];						// Events (IDs) responsible for closing drop down when user clicks outside of control
	var dropZone = null;						// Active DropZone (drag and drop support)
	var isMobile = false;						// Flag indicating whether control is running on a mobile (touch) device
	var focusInputOnMobile = false;				// Flag indicating whether control should focus input after removing an item or selecting a new item from the picker control

	var onInputChangedHandlers = [];			// Invoked when input value is changed - takes two arguments (sender (this), text value)
	var onPasteHandlers = [];					// Invoked when a value is pasted - takes two arguments (sender (this), text value)
	var onOpenHandlers = [];					// Invoked when drop down is opened - takes one argument (sender (this))
	var onCloseHandlers = [];					// Invoked when drop down is closed - takes one argument (sender (this))

	function init()
	{
		invalidMessage = Fit.Language.Translations.InvalidSelection;

		// Initial settings

		me._internal.Data("multiselect", "false");

		if (Fit.Browser.GetInfo().IsMobile === true)
			isMobile = true;

		// Create item container

		itemContainer = document.createElement("div");
		itemContainer.onmousedown = function(e)
		{
			itemContainer.tabIndex = 0; // Prevent control from losing focus when clicked by temporarily making the element focusable
		}
		itemContainer.onmouseup = function(e)
		{
			itemContainer.tabIndex = -1; // Remove tabindex to prevent element from interfering with tab flow
		}
		itemContainer.onclick = function(e)
		{
			if (Fit.Events.GetTarget(e) === itemContainer) // Could be triggered by a click on the arrow button which propagates
			{
				focusInputOnMobile = true;

				focusAssigned = true; // Clicking the item container causes blur to fire for input fields in drop down which changes focusAssigned to false - it must be true for focusInput(..) to assign focus
				focusInput(((partiallyHidden !== null) ? partiallyHidden.previousSibling : txtPrimary));
			}

			me.OpenDropDown();
		}
		Fit.Dom.AddClass(itemContainer, "FitUiControlDropDownItems");

		// Create arrow button used to open drop down

		arrow = document.createElement("i");
		Fit.Dom.AddClass(arrow, "fa");
		Fit.Dom.AddClass(arrow, "fa-chevron-down");
		arrow.tabIndex = ((isMobile === true) ? 0 : -1); // We need to be able to focus arrow on mobile to keep DropDown focused (search for the use of arrow.focus())
		arrow.onmousedown = function(e)
		{
			if (isMobile === false)
				arrow.tabIndex = 0; // Prevent control from losing focus when clicked by temporarily making the element focusable
		}
		arrow.onmouseup = function(e)
		{
			if (isMobile === false) // Assigning focus on a mobile device often pops up the virtual keyboard which is annoying
			{
				arrow.tabIndex = -1; // Remove tabindex to prevent element from interfering with tab flow

				// Prevent DropDown from losing focus when arrow is used to close menu.
				// It would otherwise leave the control with no blinking cursor.
				// Also, we want the control to be ready for input and keyboard navigation.
				focusAssigned = true; // Clicking the arrow causes blur to fire for input fields in drop down which changes focusAssigned to false - it must be true for focusInput(..) to assign focus
				focusInput(((partiallyHidden !== null) ? partiallyHidden.previousSibling : txtPrimary));
			}
		}
		arrow.onclick = function(e)
		{
			focusInputOnMobile = false;

			// Do nothing by default, event propagates out to itemContainer
			// which opens drop down (See itemContainer.onclick handler above).

			// Close drop down if already open
			if (me.IsDropDownOpen() === true)
			{
				me.CloseDropDown();
				Fit.Events.StopPropagation(e); // Prevent drop down from opening again

				if (isMobile === true)
				{
					me.Focused(false); // Force control to lose focus when closed on mobile, to have the OnBlur event fire
				}
			}
		}

		// Create primary search textbox

		txtPrimary = createSearchField();
		txtActive = txtPrimary;

		// Create drop down menu

		dropDownMenu = document.createElement("div");
		if (Fit.Browser.GetBrowser() !== "MSIE" || Fit.Browser.GetVersion() >= 9) // OnMouseWheel event is buggy in IE8
		{
			dropDownMenu.onmousewheel = function(e) // Handler prevents scroll on page when scrolling picker
			{
				var ev = Fit.Events.GetEvent(e);

				dropDownMenu.firstChild.scrollTop -= ((ev.wheelDeltaY !== undefined) ? ev.wheelDeltaY : ev.wheelDelta); // Expecting PickerControl's container (firstChild) to be scrollable for this to work
				Fit.Events.PreventDefault(ev);
			}
		}
		Fit.Dom.AddClass(dropDownMenu, "FitUiControlDropDownPicker");
		dropDownMenu.style.display = "none"; // Considered closed by default (prevent OnClose from firing if CloseDropDown() is called on closed drop down)

		// Create hidden span used to calculate width of input field value

		hidden = document.createElement("div");
		Fit.Dom.AddClass(hidden, "FitUiControlDropDownHidden");

		spanFitWidth = document.createElement("span");

		// Make drop down close when user clicks outside of control

		if (isMobile === false)
		{
			var eventId = Fit.Events.AddHandler(document, "click", function(e)
			{
				var target = Fit.Events.GetTarget(e);

				if (me.IsDropDownOpen() === true && target !== me.GetDomElement() && Fit.Dom.Contained(me.GetDomElement(), target) === false)
					me.CloseDropDown();
			});
			Fit.Array.Add(closeHandlers, eventId);
		}
		else
		{
			// OnClick does not work reliably on mobile (at least not on iOS 9 and 10), so using touch events instead

			var coords = null;
			var eventId = -1;

			eventId = Fit.Events.AddHandler(document, "touchstart", function(e)
			{
				var target = Fit.Events.GetTarget(e);

				coords = null;

				if (me.IsDropDownOpen() === true && target !== me.GetDomElement() && Fit.Dom.Contained(me.GetDomElement(), target) === false)
				{
					coords = Fit.Events.GetPointerState().Coordinates.Document;
				}
			});
			Fit.Array.Add(closeHandlers, eventId);

			eventId = Fit.Events.AddHandler(document, "touchend", function(e)
			{
				if (coords === null)
					return;

				// Determine whether user moved finger (e.g. to scroll page) in which case we do not want to close the menu

				var curCoords = Fit.Events.GetPointerState().Coordinates.Document;
				var moved = (Math.abs(coords.X - curCoords.X) > 10 || Math.abs(coords.Y - curCoords.Y) > 10); // Must be moved at least 10px left/right or up/down

				if (moved === false)
				{
					me.CloseDropDown();
					me.Focused(false);
				}
			});
			Fit.Array.Add(closeHandlers, eventId);
		}

		// Make drop down close if focus is removed programmatically
		// or by iOS which happens when onscreen keyboard is closed.

		me.OnBlur(function()
		{
			focusInputOnMobile = false;
			me.CloseDropDown();
		});

		// Suppress context menu (except for input fields)

		Fit.Events.AddHandler(me.GetDomElement(), "contextmenu", function(e)
		{
			if (Fit.Events.GetTarget(e).tagName !== "INPUT")
				return Fit.Events.PreventDefault(e);
		});

		// Append elements to the DOM

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

	// See documentation on ControlBase
	this.Width = Fit.Core.CreateOverride(this.Width, function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		var rtn = base(val, unit);

		// Make sure tab flow is automatically updated if control width is changed due to use of relative unit

		if (Fit.Validation.IsSet(val) === true)
		{
			if ((rtn.Unit === "%" || rtn.Unit === "em" || rtn.Unit === "rem") && widthObserverId === -1)
			{
				var prevWidth = me.GetDomElement().offsetWidth;
				var moTimeout = null;

				widthObserverId = Fit.Events.AddMutationObserver(me.GetDomElement(), function(elm)
				{
					var newWidth = me.GetDomElement().offsetWidth;

					if (prevWidth !== newWidth) // Width has changed
					{
						prevWidth = newWidth;

						if (moTimeout !== null) // Clear pending optimization
							clearTimeout(moTimeout);

						// Schedule optimization to prevent too many identical operations
						// in case observer fires several times almost simultaneously.
						moTimeout = setTimeout(function()
						{
							moTimeout = null;
							optimizeTabOrder();
						}, 250);
					}
				});
			}
			else
			{
				if (widthObserverId !== -1)
				{
					Fit.Events.RemoveMutationObserver(widthObserverId);
					widthObserverId = -1;
				}
			}

			// Immediately update tab flow when control width is changed

			optimizeTabOrder();
		}

		return rtn;
	});

	/// <function container="Fit.Controls.DropDown" name="DropDownMaxHeight" access="public" returns="object">
	/// 	<description> Get/set max height of drop down - returns object with Value (number) and Unit (string) properties </description>
	/// 	<param name="value" type="number" default="undefined"> If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content. </param>
	/// 	<param name="unit" type="string" default="undefined"> If defined, max height is updated to specified CSS unit, otherwise px is assumed </param>
	/// </function>
	this.DropDownMaxHeight = function(value, unit)
	{
		Fit.Validation.ExpectNumber(value, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(value) === true)
		{
			maxHeight = { Value: value, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px")};

			if (picker !== null)
				picker.MaxHeight(maxHeight.Value, maxHeight.Unit);
		}

		return maxHeight;
	}

	/// <function container="Fit.Controls.DropDown" name="DropDownMaxWidth" access="public" returns="object">
	/// 	<description> Get/set max width of drop down - returns object with Value (number) and Unit (string) properties </description>
	/// 	<param name="value" type="number" default="undefined"> If defined, max width is updated to specified value. A value of -1 forces drop down to use control width. </param>
	/// 	<param name="unit" type="string" default="undefined"> If defined, max width is updated to specified CSS unit, otherwise px is assumed </param>
	/// </function>
	this.DropDownMaxWidth = function(value, unit)
	{
		Fit.Validation.ExpectNumber(value, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(value) === true)
		{
			if (value !== -1)
			{
				dropDownMenu.style.width = "auto"; // Adjust width to content
				dropDownMenu.style.maxWidth = value + ((Fit.Validation.IsSet(unit) === true) ? unit : "px");
			}
			else
			{
				dropDownMenu.style.width = "";
				dropDownMenu.style.maxWidth = "";
			}
		}

		var res = { Value: -1, Unit: "px" };

		if (dropDownMenu.style.maxWidth !== "")
		{
			res.Value = parseFloat(dropDownMenu.style.maxWidth);
			res.Unit = dropDownMenu.style.maxWidth.replace(res.Value, "");
		}

		return res;
	}

	// ControlBase interface

	// See documentation on ControlBase
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		// Set

		if (Fit.Validation.IsSet(val) === true)
		{
			orgSelections = [];
			var fireChange = (getSelectionElements().length > 0 || val !== ""); // Fire OnChange if current selections are cleared, and/or if new selections are set

			me._internal.ExecuteWithNoOnChange(function()
			{
				me.Clear();

				if (val !== "")
				{
					Fit.Array.ForEach(val.split(";"), function(item)
					{
						var info = item.split("=");

						if (info.length === 2) // Format: title1=val1;title2=val2;title3=val3
							me.AddSelection(decodeReserved(info[0]), decodeReserved(info[1]));
						else // Format: val1;val2;val3
							me.AddSelection(decodeReserved(info[0]), decodeReserved(info[0]));
					});
				}
			});

			orgSelections = me.GetSelections();

			if (fireChange === true)
				fireOnChange();
		}

		// Get

		var selections = me.GetSelections(); // Invalid selections excluded
		var value = "";

		Fit.Array.ForEach(selections, function(item)
		{
			value += ((value !== "") ? ";" : "") + encodeReserved(item.Title) + "=" + encodeReserved(item.Value);
		});

		return value;
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
			else if (val === false && Fit.Dom.Contained(me.GetDomElement(), Fit.Dom.GetFocused()) === true)
			{
				me.CloseDropDown();
				Fit.Dom.GetFocused().blur(); // Focused element could be txtActive (holds reference to currently focused input field) or arrow button
			}
		}

		return (txtActive === Fit.Dom.GetFocused());
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		// This will destroy control - it will no longer work!

		if (picker !== null)
			picker.Destroy();

		if (Fit._internal.DropDown.Current === me)
		{
			Fit._internal.DropDown.Current = null;
		}

		if (widthObserverId !== -1)
			Fit.Events.RemoveMutationObserver(widthObserverId);

		Fit.Array.ForEach(closeHandlers, function(eventId)
		{
			Fit.Events.RemoveHandler(document, eventId);
		});

		me = itemContainer = arrow = hidden = spanFitWidth = txtPrimary = txtCssWidth = txtActive = txtEnabled = dropDownMenu = picker = orgSelections = invalidMessage = initialFocus = maxHeight = prevValue = focusAssigned = visibilityObserverId = widthObserverId = partiallyHidden = closeHandlers = dropZone = isMobile = focusInputOnMobile = onInputChangedHandlers = onPasteHandlers = onOpenHandlers = onCloseHandlers = null;

		base();
	});

	// Misc. options

	/// <function container="Fit.Controls.DropDown" name="MultiSelectionMode" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether control allows for multiple selections </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables multi selection mode, False disables it </param>
	/// </function>
	this.MultiSelectionMode = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && me.MultiSelectionMode() !== val)
		{
			me.ClearSelections();
			me._internal.Data("multiselect", val.toString());
			optimizeTabOrder();
		}

		return (me._internal.Data("multiselect") === "true");
	}

	// Controlling selections

	var suppressUpdateItemSelectionState = false;
	var suppressOnItemSelectionChanged = false;

	/// <function container="Fit.Controls.DropDown" name="GetPicker" access="public" returns="Fit.Controls.PickerBase">
	/// 	<description> Get picker control used to add items to drop down control </description>
	/// </function>
	this.GetPicker = function()
	{
		return picker;
	}

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

		pickerControl._internal.InitializePicker();

		picker = pickerControl;
		Fit.Dom.Add(dropDownMenu, picker.GetDomElement());

		// Allow picker to select items in case selections have already been set in drop down

		suppressOnItemSelectionChanged = true;
		picker.SetSelections(me.GetSelections());
		suppressOnItemSelectionChanged = false;

		// Set picker MaxHeight

		picker.MaxHeight(maxHeight.Value, maxHeight.Unit);

		// Make sure OnItemSelectionChanged is only registered once

		if (!picker._internal)
			picker._internal = {};

		if (picker._internal.HostControl)
			return;

		picker._internal.HostControl = me;

		// Register OnItemSelectionChanged handler which is used to
		// synchronize selections from picker control to drop down.

		var fireChangeEvent = false;

		picker.OnItemSelectionChanged(function(sender, eventArgs)
		{
			if (suppressOnItemSelectionChanged === true)
				return; // Skip - already processing OnItemSelectionChanged - may be invoked multiple times if e.g. switching selection in Single Selection Mode (existing item removed + new item selected)

			var txt = null;

			// Prevent this.AddSelection and this.RemoveSelection from calling
			// picker.UpdateItemSelection which in turn fires OnItemSelectionChanged, causing an infinite loop.
			suppressUpdateItemSelectionState = true;

			if (eventArgs.Selected === true && me.GetSelectionByValue(eventArgs.Value) === null) // Check whether node is already selected (PreSelection)
			{
				fireChangeEvent = true;

				// Changing a selection in the picker control may cause OnItemSelectionChanged to be fired multiple
				// times since an existing selection may first be deselected, followed by new item being selected.
				// In this case we suppress OnChange fired by RemoveSelection(..) and AddSelection(..), and instead
				// fire it when picker's OnItemSelectionComplete event is fired.
				me._internal.ExecuteWithNoOnChange(function() { me.AddSelection(eventArgs.Title, eventArgs.Value); });

				if (me.MultiSelectionMode() === false)
					me.CloseDropDown();
			}
			else if (eventArgs.Selected === false && me.GetSelectionByValue(eventArgs.Value) !== null)
			{
				fireChangeEvent = true;

				txt = txtActive; // RemoveSelection changes txtActive

				// Changing a selection in the picker control may cause OnItemSelectionChanged to be fired multiple
				// times since an existing selection may first be deselected, followed by new item being selected.
				// In this case we suppress OnChange fired by RemoveSelection(..) and AddSelection(..), and instead
				// fire it when picker's OnItemSelectionComplete event is fired.
				me._internal.ExecuteWithNoOnChange(function() { me.RemoveSelection(eventArgs.Value) });

				// Fix - if item removed was the last item, and txtActive
				// was one of the input fields belonging to that selection,
				// it will now have been removed.
				if (txt.parentElement.parentElement === null)
					txt = txtPrimary;
			}

			if (isMobile === false || focusInputOnMobile === true)
			{
				focusAssigned = true; // Clicking the picker causes blur to fire for input fields in drop down which changes focusAssigned to false - it must be true for focusInput(..) to assign focus
				focusInput(((txt !== null) ? txt : txtActive));
			}

			suppressUpdateItemSelectionState = false;
		});

		picker.OnItemSelectionComplete(function(sender)
		{
			if (suppressOnItemSelectionChanged === true)
				return;

			// Picker may notify about selections that has already been
			// made due to PreSelections (nodes are selected when loaded).
			// Only fire OnChange if control value has actually changed.
			if (fireChangeEvent === true)
			{
				me._internal.FireOnChange();
				fireChangeEvent = false;
			}
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
			// drop down to do nothing in OnItemSelectionChanged handler when fired. Drop down's OnItemSelectionChanged
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

		if (me.MultiSelectionMode() === false)
		{
			var error = null;

			// ClearSelections() results in picker.UpdateItemSelection(..) being called if an item is currently selected,
			// eventually resulting in picker firing OnItemSelectionChanged and OnItemSelectionComplete. However, operation has
			// not completed yet, since new element has not yet been selected (done below). Skip events.
			suppressOnItemSelectionChanged = true;

			try // Make sure we can set suppressOnItemSelectionChanged false again, so drop down remains in a functioning state
			{
				me._internal.ExecuteWithNoOnChange(function() { me.ClearSelections(); });
			}
			catch (err) { error = err; }

			suppressOnItemSelectionChanged = false;

			if (error !== null)
				Fit.Validation.ThrowError(error);

			if (getSelectionElements().length > 0) // A picker prevented selected item from being removed
				return;
		}

		// Create new item

		// Delete button
		var cmdDelete = document.createElement("i");
		Fit.Dom.AddClass(cmdDelete, "fa");
		Fit.Dom.AddClass(cmdDelete, "fa-times");
		cmdDelete.tabIndex = 0; // Prevents control from losing focus when clicking button - will not interfear with tab flow since we have custom handling for that
		cmdDelete.onclick = function(e) // OnClick fires after MouseUp
		{
			// Whether OnClick fires depends on what browser is being used. A couple of tests reveal this:
			// Chrome and IE: Does not fire onclick if an element is moved to another position in DOM (dragged and dropped).
			// Firefox: Does not fire onclick if element is moved, unless it is dropped in a new position in DOM (drag and drop)
			//  - opposite of Chrome and IE. Firefox does ignore minor movements though, for the sake of usability.

			me.RemoveSelection(decode(Fit.Dom.Data(cmdDelete.parentElement, "value")));

			// Always focus control when removing and moving items.
			// First of all it prevents OnFocus and OnBlur from firing
			// a lot of times if multiple elements are removed or moved,
			// secondly it's easier to ensure consistency across browsers
			// as various events are implemented differently, especially
			// when drag and drop comes into place.
			// RemoveSelection changes focus if control already has focus.
			// If three items are selected, and the first one is removed,
			// then focus is set to the first (left most) input field.
			// We always want txtPrimary to have focus after removing an
			// item using the mouse which is why focus is assigned below.
			// This is also the reason why the code in cmdDelete.OnMouseUp
			// alone is not sufficient. Focus must be assigned to txtPrimary
			// AFTER RemoveSelection(..) is invoked.
			if (isMobile === false || focusInputOnMobile === true)
			{
				focusAssigned = true;
				focusInput(txtPrimary);
			}
			else
			{
				arrow.focus(); // Focus arrow to keep DropDown control focused on mobile
			}

			// Do not open drop down when an item is removed
			Fit.Events.StopPropagation(e);
		}
		cmdDelete.onmouseup = function() // MouseUp fires before OnClick
		{
			// OnClick is not fired in Firefox when mouse is moved (but not dropped in a new position),
			// which causes the item to remain intact and focused. Make sure proper element is focused in this case.
			if (isMobile === false || focusInputOnMobile === true)
			{
				focusAssigned = true;
				focusInput(txtPrimary);
			}
			else
			{
				arrow.focus(); // Focus arrow to keep DropDown control focused on mobile
			}
		}

		// Item container (left input, title box, right input)
		var container = document.createElement("span");
		container.onmousedown = function(e)
		{
			container.tabIndex = 0; // Prevent control from losing focus when clicked by temporarily making the element focusable
		}
		container.onmouseup = function(e)
		{
			container.tabIndex = -1; // Remove tabindex to prevent element from interfering with tab flow
		}
		container.onclick = function(e)
		{
			focusAssigned = true;
			focusInput(((partiallyHidden !== null) ? partiallyHidden.previousSibling : txtPrimary)); //focusInput(txtPrimary);
		}

		// Input fields (left and right)
		var searchLeft = createSearchField();
		var searchRight = createSearchField();

		// Title box
		var item = document.createElement("span");
		Fit.Dom.Data(item, "value", encode(value)); // Value may contain special characters - encode to prevent value from breaking item

		// Set CSS class and mouse over for invalid selection
		if (valid === false)
		{
			Fit.Dom.Attribute(item, "title", invalidMessage);
			Fit.Dom.AddClass(item, "FitUiControlDropDownInvalid");
		}

		// Add title and delete button to title box
		Fit.Dom.Add(item, document.createTextNode(Fit.String.StripHtml(title)));
		Fit.Dom.Add(item, cmdDelete);

		// Add elements to item container
		Fit.Dom.Add(container, searchLeft);
		Fit.Dom.Add(container, item);
		Fit.Dom.Add(container, searchRight);

		// Add new item

		var before = null;

		if (txtActive !== txtPrimary && me.MultiSelectionMode() === true && Fit.Dom.GetIndex(txtActive) === 0) // Left input
			before = txtActive.parentElement;
		else if (txtActive !== txtPrimary && me.MultiSelectionMode() === true && Fit.Dom.GetIndex(txtActive) === 2) // Right input
			before = txtActive.parentElement.nextSibling;
		else
			before = txtPrimary;

		itemContainer.insertBefore(container, before);

		// Clear input control value

		me.ClearInput();

		// Optimize tab order

		if (Fit.Dom.IsVisible(me.GetDomElement()) === true)
		{
			// Controls is visible - immediately optimize tab order

			if (me.MultiSelectionMode() === true)
				optimizeTabOrder(item); // Optmize tab order for this particular item only - disables right search field (tabIndex = -1) if item is wider than control
			else
				optimizeTabOrder(); // Update tab flow and partiallyHidden variable
		}
		else
		{
			// Control is hidden or not rooted - optimize tab order once it becomes visible

			// Register mutation observer if not already registered
			if (tabOrderObserverId === -1)
			{
				tabOrderObserverId = Fit.Events.AddMutationObserver(me.GetDomElement(), function(elm)
				{
					if (Fit.Dom.IsVisible(me.GetDomElement()) === true)
					{
						optimizeTabOrder();
						disconnect(); // Observers are expensive - remove when no longer needed
						tabOrderObserverId = -1;
					}
				});
			}
		}

		// Drag and Drop

		var drg = new Fit.DragDrop.Draggable(container, item);
		drg.OnDragStop(onDragStop);
		drg.OnDragging(onDragging);

		var drp = new Fit.DragDrop.DropZone(container);
		drp.OnDrop(onDrop);
		drp.OnEnter(onDropZoneEnter);
		drp.OnLeave(onDropZoneLeave);

		// Focus input control

		if (me.MultiSelectionMode() === true)
		{
			// Make input to the right of newly added item active. This to make sure that
			// the next item added appears to the right of the previously added item.
			// If a left input field is selected, it remains focused, as the new element
			// is added in front of the left input field.
			if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2)
			{
				if (searchRight.tabIndex !== -1) // Select right search field if not taken out of tab flow (see optimizeTabOrder(item) above)
					focusInput(searchRight);
				else if (container.nextSibling.tagName === "SPAN") // Right search field has been taken out of flow - use left search field in following item if found
					focusInput(container.nextSibling.children[0]);
			}
		}
		else
		{
			// Focus primary search field in Single Selection Mode, unless selected item is partially hidden,
			// in which case the first input field (left side) is focused instead, since txtPrimary will also
			// have been hidden due to word wrapping being disabled in Single Selection Mode.

			focusInput(((partiallyHidden !== null) ? partiallyHidden.previousSibling : txtPrimary)); // partiallyHidden.previousSibling is the same as searchLeft
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
				Fit.Array.Add(toReturn, { Title: Fit.Dom.Text(selection.children[1]), Value: decode(Fit.Dom.Data(selection.children[1], "value")), Valid: !Fit.Dom.HasClass(selection.children[1], "FitUiControlDropDownInvalid") });
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
		var wasFocused = focusAssigned; // Removing an input from DOM fires OnBlur which sets focusAssigned to False

		me._internal.ExecuteWithNoOnChange(function() // picker.UpdateItemSelection results in OnChange being fired
		{
			Fit.Array.ForEach(getSelectionElements(), function(selection)
			{
				if (picker !== null)
				{
					var res = picker.UpdateItemSelection(decode(Fit.Dom.Data(selection, "value")), false); // OnItemSelectionChanging and OnItemSelectionChanged are fired if picker recognizes item, causing it to be removed in drop down's OnItemSelectionChanged handler (unless canceled, in which case False is returned)

					if (res !== false && selection.parentElement.parentElement !== null)
					{
						// Element was not removed (still rooted in DOM), because picker did not recognize
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

		focusAssigned = wasFocused;

		optimizeTabOrder();
		focusInput(txtPrimary);

		if (fireEvent === true)
			fireOnChange();
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
			// drop down to do nothing in OnItemSelectionChanged handler when fired. Drop down's OnItemSelectionChanged
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

		var found = null;
		var txt = null;

		Fit.Array.ForEach(getSelectionElements(), function(selection)
		{
			if (decode(Fit.Dom.Data(selection, "value")) === value)
			{
				if (me.MultiSelectionMode() === true && selection.parentElement.nextSibling !== null && selection.parentElement.nextSibling !== txtPrimary)
					txt = selection.parentElement.nextSibling.children[0];

				found = selection.parentElement;
				return false;
			}
		});

		if (found === null)
			return;

		if (me.MultiSelectionMode() === false)
			focusInput(txtPrimary);
		else
			focusInput(((txt !== null) ? txt : txtPrimary));

		Fit.Dom.Remove(found);

		if (me.MultiSelectionMode() === false)
		{
			optimizeTabOrder();
		}
		else
		{
			if (getSelectionElements().length === 0)
				optimizeTabOrder(); // Make sure txtPrimary can receive focus using Tab or Shift+Tab
		}

		fireOnChange();
	}

	// Controlling input field

	/// <function container="Fit.Controls.DropDown" name="ClearInput" access="public">
	/// 	<description> Clear text field </description>
	/// </function>
	this.ClearInput = function(input)
	{
		Fit.Validation.ExpectInstance(input, HTMLInputElement, true);

		var inp = ((Fit.Validation.IsSet(input) === true) ? input : txtActive);

		if (inp.value === "")
			return;

		inp.value = "";
		inp.style.width = "";

		fireOnInputChanged("");

		// Resetting width (above): Seems to be buggy with Chrome+SharePoint. Input sometime retains width and is incorrectly positioned above selected items,
		// which does not happen with IE and Firefox. Releasing JS thread using setTimeout solves the problem, but it will only work when input argument is passed,
		// since txtActive may change during execution (e.g. if ClearInput is called from clearAllInputsButActive).
		// Perhaps forcing a repaint using either zoom in CSS, or by temporarily assigning a CSS class, may also fix the problem.
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

		if (txtActive.value === val)
			return;

		txtActive.value = "";
		txtActive.style.width = "";

		var txt = ((focusAssigned === true) ? txtActive : txtPrimary);

		if (partiallyHidden !== null)
			txt = partiallyHidden.previousSibling;

		txt.value = val;
		txtActive = txt;

		fitWidthToContent(txt);
		fireOnInputChanged(txt.value);

		// Fix for hidden or non-rooted control, in which case fitWidthToContent(..) won't work and txt.offsetWidth remains 0.
		// Register mutation observer which is invoked when control is rooted, or when DOMElement hiding control becomes visible.

		if (visibilityObserverId !== -1) // Cancel any mutation observer previously registered
		{
			Fit.Events.RemoveMutationObserver(visibilityObserverId);
			visibilityObserverId = -1;
		}

		if (val.length > 0 && txt.offsetWidth === 0)
		{
			var observe = null;

			if (Fit.Dom.IsRooted(txt) === false)
				observe = txt;
			else
				observe = Fit.Dom.GetConcealer(txt); // Returns Null if not concealed (hidden)

			if (observe !== null)
			{
				visibilityObserverId = Fit.Events.AddMutationObserver(observe, function(elm)
				{
					if (Fit.Dom.IsVisible(txt) === true)
					{
						fitWidthToContent(txt);
						disconnect(); // Observers are expensive - remove when no longer needed
						visibilityObserverId = -1;
					}
				});
			}
		}
	}

	/// <function container="Fit.Controls.DropDown" name="GetInputValue" access="public" returns="string">
	/// 	<description> Get input value </description>
	/// </function>
	this.GetInputValue = function()
	{
		return txtActive.value;
	}

	/// <function container="Fit.Controls.DropDown" name="InputEnabled" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether input is enabled </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables input, False disables it </param>
	/// </function>
	this.InputEnabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			txtEnabled = val;
		}

		return txtEnabled;
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

		dropDownMenu.style.minWidth = me.GetDomElement().offsetWidth + "px"; // In case DropDownMaxWidth(..) is set - update every time drop down is opened in case viewport is resized and has changed control width
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

	/// <function container="Fit.Controls.DropDown" name="OnInputChanged" access="public">
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

	/// <function container="Fit.Controls.DropDown" name="OnPaste" access="public">
	/// 	<description>
	/// 		Add event handler fired when text is pasted into input field.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.DropDown) and Value (string).
	/// 		Return False to cancel event and change, and prevent OnInputChanged from firing.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnPaste = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPasteHandlers, cb);
	}

	/// <function container="Fit.Controls.DropDown" name="OnOpen" access="public">
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

	/// <function container="Fit.Controls.DropDown" name="OnClose" access="public">
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
			var orgValue = txt.value;

			setTimeout(function() // Timeout to queue event to have pasted value available
			{
				var pastedValue = txt.value;

				if (fireOnPaste(txt.value) === true)
				{
					fitWidthToContent(txt);
					fireOnInputChanged(txt.value);
				}
				else
				{
					// Paste canceled - restore old value, unless OnPaste handler called SetInputValue with a different value

					if (txt.value === pastedValue)
						txt.value = orgValue;
				}
			}, 0);
		}

		txt.onfocus = function(e)
		{
			focusAssigned = true;

			if (initialFocus === true)
			{
				initialFocus = false;
				me.ClearInput(txtPrimary);
			}

			txtActive = txt;
			prevValue = txtActive.value;

			clearAllInputsButActive();
		}

		txt.onblur = function(e)
		{
			focusAssigned = false;
		}

		var timeOutId = null;

		txt.onkeydown = function(e) // Fires continuously for any key pressed - both characters and e.g backspace/delete/arrows etc. Key press may be canceled (change has not yet occured)
		{
			var ev = Fit.Events.GetEvent(e);

			txtActive = txt;
			clearAllInputsButActive();

			if (picker !== null)
			{
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

					moveToInput("Prev");
				}
				else // Moving right
				{
					if (me.MultiSelectionMode() === false && partiallyHidden !== null)
					{
						// Let browser handle navigation - only left input control can receive focus at this point

						me.CloseDropDown();
						return;
					}
					else if (txt === txtPrimary)
					{
						me.CloseDropDown();
						return;
					}

					moveToInput("Next");
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
				moveToInput("Prev");
			}
			else if (ev.keyCode === 39) // Arrow right
			{
				if (me.MultiSelectionMode() === false && partiallyHidden !== null)
					return;

				moveToInput("Next");
			}
			else if (ev.keyCode === 27) // Escape
			{
				if (Fit.Browser.GetInfo().Name === "MSIE")
					Fit.Events.PreventDefault(ev); // Do not clear input on IE

				me.CloseDropDown();
			}
			else if (ev.keyCode === 8) // Backspace - remove selection
			{
				if (txt.value.length === 0)
				{
					if (Fit.Browser.GetInfo().Name === "MSIE")
						Fit.Events.PreventDefault(ev); // Do not navigate back on IE when backspace is pressed within input being removed

					var toRemove = null;

					if (txt !== txtPrimary && Fit.Dom.GetIndex(txt) === 2) // Right input
						toRemove = txt.parentElement;
					else if (txt !== txtPrimary && Fit.Dom.GetIndex(txt) === 0 && txt.parentElement.previousSibling !== null) // Left input
						toRemove = txt.parentElement.previousSibling;
					else if (txt.previousSibling !== null) // Primary input
						toRemove = txt.previousSibling;

					if (toRemove !== null)
					{
						me.RemoveSelection(decode(Fit.Dom.Data(toRemove.children[1], "value")));
					}
				}
				else
				{
					if (timeOutId !== null)
						clearTimeout(timeOutId);

					// New length is not known when removing characters until OnKeyUp is fired.
					// We won't wait for that. Instead we calculate the width "once in a while".
					// Passing txt instance rather than txtActive, as the latter may change before
					// timeout is reached and delegate is executed.
					timeOutId = setTimeout(function() { fitWidthToContent(txt); timeOutId = null; }, 50);
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
						me.RemoveSelection(decode(Fit.Dom.Data(toRemove.children[1], "value")));
					}
				}
				else
				{
					if (timeOutId !== null)
						clearTimeout(timeOutId);

					// New length is not known when removing characters until OnKeyUp is fired.
					// We won't wait for that. Instead we calculate the width "once in a while".
					// Passing txt instance rather than txtActive, as the latter may change before
					// timeout is reached and delegate is executed.
					timeOutId = setTimeout(function() { fitWidthToContent(txt); timeOutId = null; }, 50);
				}
			}
			else if (ev.keyCode === 13) // Enter - notice that item selection is handled by (delegated to) picker when Enter is pressed - picker.OnItemSelectionChanged receives selected item
			{
				// Prevent form submit
				Fit.Events.PreventDefault(e);
			}
			else
			{
				if (txtEnabled === false)
				{
					Fit.Events.PreventDefault(ev);
					return;
				}

				if (timeOutId !== null)
					clearTimeout(timeOutId);

				var mods = Fit.Events.GetModifierKeys();

				if (mods.Ctrl === true || mods.Meta === true) // Queue operation to have value updated - this could be Ctrl/Cmd+X to cut or Ctrl/Cmd+V to paste
					timeOutId = setTimeout(function() { fitWidthToContent(txt); timeOutId = null; }, 0);
				else
					fitWidthToContent(txt, txt.value + String.fromCharCode(ev.keyCode | ev.charCode)); // TODO: Will not work properly if multiple characters are selected, and just one character is entered - the input field will obtain an incorrect width until next key stroke. The solution is NOT to always use setTimeout since the delayed update is noticeable.
			}
		}

		txt.onkeyup = function(e) // Fires only once when a key is released
		{
			var ev = Fit.Events.GetEvent(e);

			if (ev.keyCode !== 37 && ev.keyCode !== 38 && ev.keyCode !== 39 && ev.keyCode !== 40 && ev.keyCode !== 27 && ev.keyCode !== 9 && ev.keyCode !== 16 && ev.ctrlKey === false && ev.keyCode !== 17) // Do not fire change event for: arrow keys, escape, tab, shift, and on paste (never fires when CTRL is held down (ev.ctrlKey true) or released (ev.keyCode 17))
			{
				if (txt.value !== prevValue)
				{
					prevValue = txt.value;
					fireOnInputChanged(txt.value);
				}
			}
		}

		txt.onclick = function(e)
		{
			focusInputOnMobile = true;
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
		var newWidth = (((value !== "") ? spanFitWidth.offsetWidth : 0) + txtCssWidth);

		// Make sure new input width does not exceed width of drop down control
		var offsetLeft = input.offsetLeft; // Get position relative to offset parent which is div.FitUiControlDropDownItems that have position:relative
		var innerWidth = Fit.Dom.GetInnerWidth(itemContainer);
		newWidth = ((offsetLeft + newWidth > innerWidth) ? innerWidth - offsetLeft : newWidth);

		input.style.width = newWidth + "px";
	}

	function moveToInput(direction) // direction = Next/Prev
	{
		Fit.Validation.ExpectString(direction);

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
			// TODO: Clean up - remove disabled code below - has been replaced by more compact code below it
			/*if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 0) // Left input has focus
			{
				var itemContainer = txtActive.parentElement;

				if (itemContainer.children[2].tabIndex !== -1) // Focus right search field in next item if not taken out of tab flow
					newInput = itemContainer.children[2];
				else if (itemContainer.nextSibling.tagName === "SPAN") // Next item's right search field has been taken out of flow - focus left search field in following item if found
					newInput = itemContainer.nextSibling.children[0];
				else // No more elements available, focus primary search field
					newInput = txtPrimary;
			}
			else if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2 && txtActive.parentElement.nextSibling.tagName === "SPAN") // Right input has focus
			{
				var nextItemContainer = txtActive.parentElement.nextSibling;

				if (nextItemContainer.children[2].tabIndex !== -1) // Focus right search field in next item if not taken out of tab flow
					newInput = nextItemContainer.children[2];
				else if (nextItemContainer.nextSibling.tagName === "SPAN") // Next item's right search field has been taken out of flow - focus left search field in following item if found
					newInput = nextItemContainer.nextSibling.children[0];
				else // No more elements available, focus primary search field
					newInput = txtPrimary;
			}*/

			var itemContainer = null; // Remains Null if last item's right input control has focus (unlikely since it will never be focused unless user manages to actually click it (5px wide)

			if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 0) // Left input has focus
				itemContainer = txtActive.parentElement; // Use current item
			else if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2 && txtActive.parentElement.nextSibling.tagName === "SPAN") // Right input has focus
				itemContainer = txtActive.parentElement.nextSibling; // Use next item

			if (itemContainer !== null)
			{
				if (itemContainer.children[2].tabIndex !== -1) // Focus right search field if not taken out of tab flow
					newInput = itemContainer.children[2];
				else if (itemContainer.nextSibling.tagName === "SPAN") // Right search field has been taken out of flow - focus left search field in following item if found
					newInput = itemContainer.nextSibling.children[0];
				else // No more elements available, focus primary search field - happens in Multi Selection Mode if last item is partially hidden due to overflow (item wider than control)
					newInput = txtPrimary;
			}

			// If newInput is last selection's right input field, then select txtPrimary instead
			if (newInput !== null && newInput.parentElement.nextSibling === txtPrimary && Fit.Dom.GetIndex(newInput) === 2)
				newInput = txtPrimary;
		}

		if (newInput === null) // May be null if no selections are available to move to
			return;

		// Move content
		/*newInput.value = txtActive.value;
		me.ClearInput();
		fitWidthToContent(newInput);*/

		focusInput(newInput);
	}

	function focusInput(input)
	{
		Fit.Validation.ExpectInstance(input, HTMLInputElement);

		txtActive = input;

		if (focusAssigned === true) // Only set focus if user initially assigned focus to control
			txtActive.focus();
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

	function optimizeTabOrder(item)
	{
		Fit.Validation.ExpectDomElement(item, true);

		// Fix tab order for passed item only

		if (Fit.Validation.IsSet(item) === true) // Used in Multi Selection Mode only
		{
			if (item.parentElement.offsetWidth + 1 > Fit.Dom.GetInnerWidth(itemContainer)) // Adding 1px to offsetWidth - otherwise right aligned cursor may become hidden behind drop down arrow box
				item.nextSibling.tabIndex = -1; // Item is partially hidden - disable right search field

			return;
		}

		// Fix tab navigation by taking input controls out of tab flow if hidden due to overflow

		if (me.MultiSelectionMode() === false) // Single Selection Mode
		{
			var selections = getSelectionElements();
			partiallyHidden = ((selections.length > 0 && selections[0].parentElement.offsetWidth + 1 > Fit.Dom.GetInnerWidth(itemContainer)) ? selections[0] : null); // Adding 1px to offsetWidth - otherwise right aligned cursor may become hidden behind drop down arrow box

			var inputs = itemContainer.querySelectorAll("input");
			Fit.Array.ForEach(inputs, function(input)
			{
				input.tabIndex = ((partiallyHidden !== null) ? -1 : 0);
			});

			if (partiallyHidden !== null)
				inputs[0].tabIndex = 0;
		}
		else // Multi Selection Mode
		{
			partiallyHidden = null;

			Fit.Array.ForEach(getSelectionElements(), function(item)
			{
				if (item.parentElement.offsetWidth + 1 > Fit.Dom.GetInnerWidth(itemContainer)) // Adding 1px to offsetWidth - otherwise right aligned cursor may become hidden behind drop down arrow box
					item.nextSibling.tabIndex = -1; // Item is partially hidden - disable right search field
				else
					item.nextSibling.tabIndex = 0; // Fully visible - part of tab flow
			});
		}
	}

	function onDragStop(draggable)
	{
		draggable.Reset();
	}

	function onDragging(draggable)
	{
		if (dropZone === null)
			return;

		var pointerPos = Fit.Events.GetPointerState().Coordinates.ViewPort;
		var elmPos = Fit.Dom.GetPosition(dropZone.GetDomElement(), true);

		if (elmPos.X + (dropZone.GetDomElement().offsetWidth / 2) < pointerPos.X) // Drop on right side
		{
			Fit.Dom.Data(dropZone.GetDomElement(), "dropping", "right");
		}
		else // Drop on left side
		{
			Fit.Dom.Data(dropZone.GetDomElement(), "dropping", "left");
		}

		me._internal.Repaint();
	}

	function onDrop(dropzone, draggable)
	{
		var fireChange = false;

		if (Fit.Dom.Data(dropzone.GetDomElement(), "dropping") === "right" && dropzone.GetDomElement() !== draggable.GetDomElement().previousSibling)
		{
			// Always focus control when removing and moving items.
			// First of all it prevents OnFocus and OnBlur from firing
			// a lot of times if multiple elements are removed or moved,
			// secondly it's easier to ensure consistency across browsers
			// as various events are implemented differently, especially
			// when drag and drop comes into place.
			focusAssigned = true;
			focusInput(txtPrimary);

			Fit.Dom.InsertAfter(dropzone.GetDomElement(), draggable.GetDomElement());
			fireChange = true;
		}
		else if (Fit.Dom.Data(dropzone.GetDomElement(), "dropping") === "left" && dropzone.GetDomElement().previousSibling !== draggable.GetDomElement())
		{
			// See comment in block above regarding focus
			focusAssigned = true;
			focusInput(txtPrimary);

			Fit.Dom.InsertBefore(dropzone.GetDomElement(), draggable.GetDomElement());
			fireChange = true;
		}

		Fit.Dom.Data(dropZone.GetDomElement(), "dropping", null);
		dropZone = null;

		me._internal.Repaint();

		if (fireChange === true)
			fireOnChange();
	}

	function onDropZoneEnter(dropzone)
	{
		dropZone = dropzone;
	}

	function onDropZoneLeave(dropzone)
	{
		Fit.Dom.Data(dropzone.GetDomElement(), "dropping", null);
		dropZone = null;
		me._internal.Repaint();
	}

	function decodeReserved(str)
	{
		Fit.Validation.ExpectString(str);
		return str.replace(/%3B/g, ";").replace(/%3D/g, "=") // Decode characters reserved for value format: title1=value1;title2=value2;etc..
	}

	function encodeReserved(str)
	{
		Fit.Validation.ExpectString(str);
		return str.replace(/;/g, "%3B").replace(/=/g, "%3D") // Encode characters reserved for value format: title1=value1;title2=value2;etc..
	}

	function decode(str)
	{
		Fit.Validation.ExpectString(str);
		return decodeURIComponent(str);
	}

	function encode(str)
	{
		Fit.Validation.ExpectString(str);
		return encodeURIComponent(str);
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

		var proceed = true;

		Fit.Array.ForEach(onPasteHandlers, function(handler)
		{
			if (handler(me, val) === false)
				proceed = false; // Do not cancel loop, allow all handlers to fire
		});

		return proceed;
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

/*Fit.Controls.DropDown.Item = function()
{
	var title = null;
	var value = null;

	function init()
	{
		if (arguments.length === 1)
		{
			value = arguments[0];
		}
		else if (arguments.length === 2)
		{
			title = arguments[0];
			value = arguments[1];
		}

	}

	this.Title = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
			title = val;

		return title;
	}

	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
			value = val;

		return value;
	}

	init();
}*/
