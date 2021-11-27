/// <container name="Fit.Controls.DropDown" extends="Fit.Controls.ControlBase">
/// 	Drop Down Menu control allowing for single and multi selection.
/// 	Supports data selection using any control extending from Fit.Controls.PickerBase.
/// 	This control is extending from Fit.Controls.ControlBase.
/// </container>

/// <function container="Fit.Controls.DropDown" name="DropDown" access="public">
/// 	<description> Create instance of DropDown control </description>
/// 	<param name="ctlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.DropDown = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId, true);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;								// Access to members from event handlers (where "this" may have a different meaning)
	var itemContainer = null;					// Container for selected items and input fields
	var itemCollection = {};					// Indexed collection for selected items (for fast lookup)
	var itemCollectionOrdered = [];				// Ordered item collection (item order can be changed using drag and drop)
	var itemDropZones = {};						// Indexed collection of dropzones used to enable item dragging/dropping
	var placeholder = "";						// Placeholder value displayed when no selection is made
	var arrow = null;							// Arrow button used to open/close drop down menu
	var txtPrimary = null;						// Primary input (search) field initially available
	var txtActive = null;						// Currently active input (search) field
	var txtEnabled = false;						// Flag indicating whether user can enter text
	var dropDownMenu = null;					// Drop down menu element
	var picker = null;							// Picker control within drop down menu
	var orgSelections = [];						// Original selection set using Value(..) function - used to determine whether control is dirty
	var invalidMessage = "Invalid selection";	// Mouse over text for invalid selections
	var invalidMessageChanged = false;			// Flag indicating whether built-in Invalid Selection Message has been overridden or not
	var initialFocus = true;					// Flag indicating first focus of control
	var maxHeight = { Value: 150, Unit: "px"};	// Picker max height (px)
	var maxWidth = { Value: -1, Unit: "px" };	// Picker max width (px)
	var prevValue = "";							// Previous input value - used to determine whether OnChange should be fired
	var focusAssigned = false;					// Boolean ensuring that control is only given focus when AddSelection is called, if user assigned focus to control
	var closeHandlers = [];						// Events (IDs) responsible for closing drop down when user clicks outside of control
	var dropZone = null;						// Active DropZone (drag and drop support)
	var isMobile = false;						// Flag indicating whether control is running on a mobile (touch) device
	var focusInputOnMobile = true;				// Flag indicating whether control should focus input fields (and potentially bring up a virtual keyboard) based on configuration, platform (computer vs touch) and where user initially clicked/touched DropDown to activate it
	var detectBoundaries = false;				// Flag indicating whether drop down menu should detect viewport collision and open upwards when needed
	var detectBoundariesRelToViewPort = false;	// Flag indicating whether drop down menu should be positioned relative to viewport (true) or scroll parent (false)
	var persistView = false;					// Flag indicating whether picker controls should remember and restore its scroll position and highlighted item when reopened
	var highlightFirst = false;					// Flag indicating whether picker controls should focus its first node automatically when opened

	var onInputChangedHandlers = [];			// Invoked when input value is changed - takes two arguments (sender (this), text value)
	var onPasteHandlers = [];					// Invoked when a value is pasted - takes two arguments (sender (this), text value)
	var onOpenHandlers = [];					// Invoked when drop down is opened - takes one argument (sender (this))
	var onCloseHandlers = [];					// Invoked when drop down is closed - takes one argument (sender (this))

	// Picker - suppress events
	var suppressUpdateItemSelectionState = false;
	var suppressOnItemSelectionChanged = false;

	// Text selection mode
	var clearTextSelectionOnInputChange = false;
	var prevTextSelection = null;
	var textSelectionCallback = null;
	var cmdToggleTextMode = null;

	function init()
	{
		Fit.Internationalization.OnLocaleChanged(localize);
		localize();

		// Initial settings

		me._internal.Data("multiselect", "false");
		me._internal.Data("selectionmode", "visual");
		me._internal.Data("selectionmodetoggle", "false");
		me._internal.Data("open", "false");

		if (Fit.Browser.GetInfo().IsMobile === true)
			isMobile = true;

		// Create item container

		itemContainer = document.createElement("div");
		itemContainer.tabIndex = -1; // Make it focusable but not part of tab flow
		itemContainer.onclick = function(e) // Not triggered when user clicks arrow button - it has its own logic and suppresses event propagation
		{
			var target = Fit.Events.GetTarget(e);

			if (target.tagName !== "INPUT") // Focus input unless already focused (if input was clicked)
			{
				focusInputOnMobile = me.InputEnabled() === true; // Focus input on mobile only if input is enabled - otherwise we get a virtual keyboard presented which does nothing - user can still click/touch an input between selected items in Visual Selection Mode to place an item between two existing selections
				focusAssigned = true; // Clicking the item container causes blur to fire for input fields in drop down which changes focusAssigned to false - it must be true for focusInput(..) to assign focus
				focusInput(txtPrimary);
			}

			me.OpenDropDown();
		}
		Fit.Dom.AddClass(itemContainer, "FitUiControlDropDownItems");

		// Create arrow button used to open drop down

		arrow = document.createElement("i");
		Fit.Dom.AddClass(arrow, "fa");
		Fit.Dom.AddClass(arrow, "fa-chevron-down");
		arrow.tabIndex = -1; // Make it focusable but not part of tab flow
		arrow.onclick = function(e)
		{
			focusInputOnMobile = false; // On mobile, do not focus input fields when interacting with control, when DropDown was initially activated by clicking/touching arrow icon

			// Close drop down if already open
			if (me.IsDropDownOpen() === true)
			{
				me.CloseDropDown();

				if (isMobile === true)
				{
					me.Focused(false); // Force control to lose focus when closed on mobile, to have the OnBlur event fire
				}
			}
			else // DropDown is closed - open it
			{
				me.OpenDropDown();
			}

			if (isMobile === false)
			{
				focusAssigned = true; // Clicking the arrow causes blur to fire for input fields in drop down which changes focusAssigned to false - it must be true for focusInput(..) to assign focus
				focusInput(txtPrimary);
			}

			Fit.Events.StopPropagation(e); // Prevent event from reaching itemContainer.onclick which opens DropDown and might assign a different value to focusInputOnMobile
		}
		arrow.onfocus = function(e)
		{
			focusAssigned = true;
		}
		arrow.onblur = function(e)
		{
			if (me === null)
			{
				// Fix for Chrome which fires OnChange and OnBlur (in both capturering and bubbling phase)
				// if control has focus while being removed from DOM, e.g. if used in a dialog closed using ESC.
				// More details here: https://bugs.chromium.org/p/chromium/issues/detail?id=866242
				return;
			}

			focusAssigned = false;
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

		// Make drop down close when user clicks outside of control

		if (isMobile === false)
		{
			var eventId = Fit.Events.AddHandler(document, "click", function(e)
			{
				var target = Fit.Events.GetTarget(e);

				if (target !== document.documentElement && target !== document.body && Fit.Dom.IsRooted(target) === false)
				{
					return; // Do not close DropDown if target no longer exists - this may happen if something is removed within DropDown (e.g. an item in the WSDropDown's action menu)
				}

				if (me.IsDropDownOpen() === true && target !== me.GetDomElement() && Fit.Dom.Contained(me.GetDomElement(), target) === false)
				{
					me.CloseDropDown();
				}
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

				if (target !== document.documentElement && target !== document.body && Fit.Dom.IsRooted(target) === false)
				{
					return; // Do not close DropDown if target no longer exists - this may happen if something is removed within DropDown (e.g. an item in the WSDropDown's action menu)
				}

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

		// Make drop down close if focus is lost on mobile
		// which happens when onscreen keyboard is closed.

		me.OnBlur(function()
		{
			focusInputOnMobile = true; // Reset to initial value when focus is lost

			if (isMobile === true)
			{
				me.CloseDropDown();
			}
		});

		// Suppress context menu (except for input fields)

		Fit.Events.AddHandler(me.GetDomElement(), "contextmenu", function(e)
		{
			if (Fit.Events.GetTarget(e).tagName !== "INPUT")
				return Fit.Events.PreventDefault(e);
		});

		// Text selection mode

		me.OnFocus(function()
		{
			if (me.TextSelectionMode() === true)
			{
				if (Fit.Browser.GetBrowser() === "MSIE" || Fit.Browser.GetBrowser() === "Edge")
				{
					txtPrimary.readOnly = false; // ReadOnly set to true to make text-overflow:ellipsis work
					setTimeout(function() { txtPrimary.blur(); txtPrimary.focus(); }, 0); // Change to ReadOnly is not applied immediately unless blurred and re-focused
				}

				clearTextSelectionOnInputChange = true;

				//me.OpenDropDown(); // DISABLED - will also open control when gaining focus from tab navigation
			}
		});

		me.OnChange(function()
		{
			if (me.TextSelectionMode() === true)
			{
				updateTextSelection();
			}
		});

		me.OnBlur(function()
		{
			if (me.TextSelectionMode() === true)
			{
				updateTextSelection(); // Update when blurred in case user have entered a value

				if (Fit.Browser.GetBrowser() === "MSIE" || Fit.Browser.GetBrowser() === "Edge")
				{
					txtPrimary.readOnly = true; // ReadOnly set to true to make text-overflow:ellipsis work
				}
			}
		});

		// PickerBase - make picker aware of focused state of host control

		me.OnFocus(function()
		{
			if (picker !== null)
			{
				picker._internal.ReportFocused(true);
			}
		});

		me.OnBlur(function()
		{
			if (picker !== null)
			{
				picker._internal.ReportFocused(false);
			}
		});

		// Append elements to the DOM

		Fit.Dom.Add(itemContainer, txtPrimary);
		Fit.Dom.Add(itemContainer, arrow);
		me._internal.AddDomElement(itemContainer);
		me._internal.AddDomElement(dropDownMenu);

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
			invalidMessageChanged = true; // Make sure message is not changed if locale is changed on page

			updateInvalidMessageForSelectedItems();
		}

		return invalidMessage;
	}

	// Dimensions

	/// <function container="Fit.Controls.DropDown" name="DropDownMaxHeight" access="public" returns="Fit.TypeDefs.CssValue">
	/// 	<description> Get/set max height of drop down - returns object with Value (number) and Unit (string) properties </description>
	/// 	<param name="value" type="number" default="undefined"> If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content. </param>
	/// 	<param name="unit" type="Fit.TypeDefs.CssUnit" default="undefined"> If defined, max height is updated to specified CSS unit, otherwise px is assumed </param>
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

	/// <function container="Fit.Controls.DropDown" name="DropDownMaxWidth" access="public" returns="Fit.TypeDefs.CssValue">
	/// 	<description> Get/set max width of drop down - returns object with Value (number) and Unit (string) properties </description>
	/// 	<param name="value" type="number" default="undefined"> If defined, max width is updated to specified value. A value of -1 forces drop down to use control width. </param>
	/// 	<param name="unit" type="Fit.TypeDefs.CssUnit" default="undefined"> If defined, max width is updated to specified CSS unit, otherwise px is assumed </param>
	/// </function>
	this.DropDownMaxWidth = function(value, unit)
	{
		Fit.Validation.ExpectNumber(value, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(value) === true)
		{
			maxWidth = { Value: value, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px")};

			if (value !== -1)
			{
				dropDownMenu.style.width = "auto"; // Adjust width to content - notice that optimizeDropDownPosition(..) and resetDropDownPosition() also manipulate the width property!
				dropDownMenu.style.maxWidth = maxWidth.Value + maxWidth.Unit;
			}
			else
			{
				dropDownMenu.style.width = (me.DetectBoundaries() === true ? dropDownMenu.style.width : ""); // Preserve width value if DetectBoundaries is enabled since it also modifies this property
				dropDownMenu.style.maxWidth = "";
			}
		}

		return maxWidth;
	}

	// ControlBase interface

	// See documentation on ControlBase
	this.Value = function(val, preserveDirtyState)
	{
		Fit.Validation.ExpectString(val, true);
		Fit.Validation.ExpectBoolean(preserveDirtyState, true);

		// Set

		if (Fit.Validation.IsSet(val) === true)
		{
			if (preserveDirtyState !== true)
			{
				orgSelections = [];
			}

			var fireChange = (itemCollectionOrdered.length > 0 || val !== ""); // Fire OnChange if current selections are cleared, and/or if new selections are set

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

			if (preserveDirtyState !== true)
			{
				orgSelections = me.GetSelections();
			}

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
				var c = txtPrimary;
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

		return (txtActive === Fit.Dom.GetFocused() || arrow === Fit.Dom.GetFocused());
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

		Fit.Internationalization.RemoveOnLocaleChanged(localize);

		Fit.Array.ForEach(closeHandlers, function(eventId)
		{
			Fit.Events.RemoveHandler(document, eventId);
		});

		Fit.Array.ForEach(itemDropZones, function(key)
		{
			itemDropZones[key].Dispose();
		});

		me = itemContainer = itemCollection = itemDropZones = arrow = txtPrimary = txtActive = txtEnabled = dropDownMenu = picker = orgSelections = invalidMessage = invalidMessageChanged = initialFocus = maxHeight = prevValue = focusAssigned = closeHandlers = dropZone = isMobile = focusInputOnMobile = detectBoundaries = detectBoundariesRelToViewPort = persistView = highlightFirst = onInputChangedHandlers = onPasteHandlers = onOpenHandlers = onCloseHandlers = suppressUpdateItemSelectionState = suppressOnItemSelectionChanged = clearTextSelectionOnInputChange = prevTextSelection = textSelectionCallback = cmdToggleTextMode = null;

		base();
	});

	// Misc. options

	/// <function container="Fit.Controls.DropDown" name="Placeholder" access="public" returns="string">
	/// 	<description> Get/set value used as a placeholder on supported browsers, to indicate expected value or action </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, value is set as placeholder </param>
	/// </function>
	this.Placeholder = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			placeholder = val;
			updatePlaceholder(true);
		}

		return placeholder;
	}

	/// <function container="Fit.Controls.DropDownTypeDefs" name="SelectionToStringCallback" returns="string">
	/// 	<description> Callback responsible for constructing string value representing selected items </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// </function>

	/// <function container="Fit.Controls.DropDown" name="TextSelectionMode" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set flag indicating whether to use Text Selection Mode (true) or Visual Selection Mode (false).
	/// 		Visual Selection Mode is the default way selected items are displayed, but it may result in control
	/// 		changing dimensions as items are added/removed. Text Selection Mode prevents this and gives the
	/// 		user a traditional DropDown control instead.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables Text Selection Mode, False disables it (Visual Selection Mode) </param>
	/// 	<param name="cb" type="Fit.Controls.DropDownTypeDefs.SelectionToStringCallback" default="undefined">
	/// 		If defined, function will be called with DropDown being passed as an argument when selection text
	/// 		needs to be updated. Function is expected to return a string representation of the selected items.
	/// 	</param>
	/// </function>
	this.TextSelectionMode = function(val, cb)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectFunction(cb, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true && me.TextSelectionMode() === false)
			{
				textSelectionCallback = (cb ? cb : null);

				me.ClearInput(); // Clear any value entered by the user and fire OnInputChanged

				updateTextSelection();

				if (me.Focused() === false && (Fit.Browser.GetBrowser() === "MSIE" || Fit.Browser.GetBrowser() === "Edge"))
				{
					txtPrimary.readOnly = true; // Necessary to make text-overflow:ellipsis work in IE and Edge - disabled in OnFocus handler
				}
			}
			else if (val === false && me.TextSelectionMode() === true)
			{
				if (txtPrimary.value === prevTextSelection)
				{
					txtPrimary.value = "";
				}
				else
				{
					// User has changed value - clear and fire OnInputChanged.
					// This only happens if Text Selection Mode is being disabled
					// while control has focus and user have entered a value,
					// since selection text is always updated when control lose focus.
					me.ClearInput();
				}

				clearTextSelectionOnInputChange = false;
				prevTextSelection = null;
				textSelectionCallback = null;

				if (Fit.Browser.GetBrowser() === "MSIE" || Fit.Browser.GetBrowser() === "Edge")
				{
					txtPrimary.readOnly = false;
				}
			}

			me._internal.Data("selectionmode", (val === true ? "text" : "visual"));

			if (cmdToggleTextMode !== null)
			{
				if (val === true)
				{
					Fit.Dom.RemoveClass(cmdToggleTextMode, "fa-compress");
					Fit.Dom.AddClass(cmdToggleTextMode, "fa-expand");
				}
				else
				{
					{
						Fit.Dom.RemoveClass(cmdToggleTextMode, "fa-expand");
						Fit.Dom.AddClass(cmdToggleTextMode, "fa-compress");
					}
				}
			}

			me._internal.Repaint();
		}

		return (me._internal.Data("selectionmode") === "text");
	}

	/// <function container="Fit.Controls.DropDown" name="SelectionModeToggle" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control allow user to toggle Selection Mode (Visual or Text) </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables toggle button, False disables it </param>
	/// </function>
	this.SelectionModeToggle = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true && cmdToggleTextMode === null)
			{
				cmdToggleTextMode = document.createElement("span");
				cmdToggleTextMode.onclick = function()
				{
					me.TextSelectionMode(!me.TextSelectionMode());
				}
				Fit.Dom.AddClass(cmdToggleTextMode, "fa");
				Fit.Dom.AddClass(cmdToggleTextMode, me.TextSelectionMode() === true ? "fa-expand" : "fa-compress");
				me._internal.AddDomElement(cmdToggleTextMode);
				me._internal.Data("selectionmodetoggle", "true");
			}
			else if (val === false && cmdToggleTextMode !== null)
			{
				me._internal.RemoveDomElement(cmdToggleTextMode);
				cmdToggleTextMode = null;
				me._internal.Data("selectionmodetoggle", "false");
			}
		}

		return (cmdToggleTextMode !== null);
	}

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
		}

		return (me._internal.Data("multiselect") === "true");
	}

	// Controlling selections

	/// <function container="Fit.Controls.DropDown" name="GetPicker" access="public" returns="Fit.Controls.PickerBase">
	/// 	<description> Get picker control used to add items to drop down control </description>
	/// </function>
	this.GetPicker = function()
	{
		return picker;
	}

	/// <function container="Fit.Controls.DropDown" name="SetPicker" access="public">
	/// 	<description> Set picker control used to add items to drop down control </description>
	/// 	<param name="pickerControl" type="Fit.Controls.PickerBase | null"> Picker control extending from PickerBase </param>
	/// </function>
	this.SetPicker = function(pickerControl)
	{
		Fit.Validation.ExpectInstance(pickerControl, Fit.Controls.PickerBase, true);

		if (pickerControl === picker)
			return; // Already active picker

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
		pickerControl._internal.ReportFocused(me.Focused());

		picker = pickerControl;
		Fit.Dom.Add(dropDownMenu, picker.GetDomElement());

		// Allow picker to select items in case selections have already been set in drop down

		suppressOnItemSelectionChanged = true;
		picker.SetSelections(me.GetSelections());
		suppressOnItemSelectionChanged = false;

		// Set picker MaxHeight

		picker.MaxHeight(maxHeight.Value, maxHeight.Unit);
		optimizeDropDownPosition(); // In case dropdown is already open and SetPicker was called async, e.g. initiated from OnOpen event. Function may change MaxHeight on Picker.

		// Persist view and initial focus

		picker.PersistView(persistView);
		picker.HighlightFirst(highlightFirst);

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
			else
			{
				// User selected an item which is already selected

				if (me.TextSelectionMode() === true)
				{
					updateTextSelection(); // Make sure any search value is removed and text selection is restored
				}
				else
				{
					me.ClearInput(); // Make sure any search value is removed
				}
			}

			// DISABLED: Now handled using picker.OnFocus(..) handler further down - see https://github.com/Jemt/Fit.UI/issues/86 for details
			// if (eventArgs.ProgrammaticallyChanged === false && (isMobile === false || focusInputOnMobile === true))
			// {
			// 	focusAssigned = true; // Clicking the picker causes blur to fire for input fields in drop down which changes focusAssigned to false - it must be true for focusInput(..) to assign focus
			// 	focusInput(((txt !== null) ? txt : txtActive));
			// }

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

		picker.OnFocusIn(function(sender)
		{
			// Steal back focus - DropDown should remain the focused control
			focusAssigned = true; // Clicking the picker causes blur to fire for input fields in drop down which changes focusAssigned to false - it must be true for focusInput(..) to assign focus
			focusInput(txtActive);
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
				res = picker.UpdateItemSelection(value, true, me.Focused() === false);
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

			if (itemCollectionOrdered.length > 0) // A picker prevented selected item from being removed
				return;
		}

		// Create new item

		// Delete button
		var cmdDelete = document.createElement("i");
		Fit.Dom.AddClass(cmdDelete, "fa");
		Fit.Dom.AddClass(cmdDelete, "fa-times");
		cmdDelete.tabIndex = -1; // Prevents control from losing focus when clicking button - will not interfear with tab flow as -1 makes it focusable, but not part of tab flow
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
			focusAssigned = true;
			focusInput(txtPrimary);

			// Do not open drop down when an item is removed
			Fit.Events.StopPropagation(e);
		}
		cmdDelete.onmouseup = function() // MouseUp fires before OnClick
		{
			// OnClick is not fired in Firefox when mouse is moved (but not dropped in a new position),
			// which causes the item to remain intact and focused. Make sure proper element is focused in this case.
			focusAssigned = true;
			focusInput(txtPrimary);
		}

		// Item container (left input, title box, right input)
		var container = document.createElement("span");
		container.tabIndex = -1; // Make it focusable but not part of tab flow
		/*container.onclick = function(e)
		{
			focusInputOnMobile = true;
			focusAssigned = true;
			focusInput(txtPrimary);
		}*/

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
		var titleWithoutHtml = Fit.String.StripHtml(title);
		var textNode = document.createTextNode(titleWithoutHtml);
		Fit.Dom.Add(item, textNode);
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

		var itemObject = createItemObject(titleWithoutHtml, value, valid !== false, item, textNode); //convertItemElementToItemObject(item);
		itemCollection[itemObject.Value] = itemObject;
		itemCollectionOrdered.push(itemObject);

		// Clear input control value

		if (me.TextSelectionMode() === false)
		{
			me.ClearInput();
		}

		// Drag and Drop

		var drg = new Fit.DragDrop.Draggable(container, item);
		drg.OnDragStop(onDragStop);
		drg.OnDragging(onDragging);

		var drp = new Fit.DragDrop.DropZone(container);
		drp.OnDrop(onDrop);
		drp.OnEnter(onDropZoneEnter);
		drp.OnLeave(onDropZoneLeave);
		itemDropZones[value] = drp; // Keep reference so we can dispose it when item is removed

		// Focus input control

		if (me.MultiSelectionMode() === true)
		{
			// Make input to the right of newly added item active. This to make sure that
			// the next item added appears to the right of the previously added item.
			// If a left input field is selected, it remains focused, as the new element
			// is added in front of the left input field.
			if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2)
			{
				focusInput(searchRight);
			}
		}
		else
		{
			focusInput(txtPrimary);
		}

		// Fire OnChange event

		fireOnChange();
	}

	/// <container name="Fit.Controls.DropDownTypeDefs.DropDownItem">
	/// 	<description> DropDown item </description>
	/// 	<member name="Title" type="string"> Item title </member>
	/// 	<member name="Value" type="string"> Unique item value </member>
	/// 	<member name="Valid" type="boolean"> Value indicating whether item is a valid selection </member>
	/// </container>

	/// <function container="Fit.Controls.DropDown" name="GetSelections" access="public" returns="Fit.Controls.DropDownTypeDefs.DropDownItem[]">
	/// 	<description> Get selected items - returned array contain objects with Title (string), Value (string), and Valid (boolean) properties </description>
	/// 	<param name="includeInvalid" type="boolean" default="false"> Flag indicating whether invalid selection should be included or not </param>
	/// </function>
	this.GetSelections = function(includeInvalid)
	{
		Fit.Validation.ExpectBoolean(includeInvalid, true);

		var toReturn = [];

		Fit.Array.ForEach(itemCollectionOrdered, function(selection)
		{
			if (includeInvalid === true || selection.Valid === true)
			{
				Fit.Array.Add(toReturn, { Title: selection.Title, Value: selection.Value, Valid: selection.Valid });
			}
		});

		return toReturn;
	}

	/// <function container="Fit.Controls.DropDown" name="GetSelectionByValue" access="public" returns="Fit.Controls.DropDownTypeDefs.DropDownItem | null">
	/// 	<description> Get selected item by value - returns object with Title (string), Value (string), and Valid (boolean) properties if found, otherwise Null is returned </description>
	/// 	<param name="val" type="string"> Value of selected item to retrive </param>
	/// </function>
	this.GetSelectionByValue = function(val)
	{
		Fit.Validation.ExpectString(val);

		var selection = itemCollection[val] || null;

		if (selection !== null)
		{
			return { Title: selection.Title, Value: selection.Value, Valid: selection.Valid };
		}

		return null;
	}

	/// <function container="Fit.Controls.DropDown" name="GetHighlighted" access="public" returns="Fit.Controls.DropDownTypeDefs.DropDownItem | null">
	/// 	<description>
	/// 		Get item currently highlighted in picker control.
	/// 		Returns an object with Title (string), Value (string),
	/// 		and Valid (boolean) properties if found, otherwise Null.
	/// 	</description>
	/// </function>
	this.GetHighlighted = function()
	{
		if (picker !== null)
		{
			var hl = picker.GetHighlighted();
			return (hl !== null ? { Title: hl.Title, Value: hl.Value, Valid: true } : null);
		}

		return null;
	}

	/// <function container="Fit.Controls.DropDown" name="PersistView" access="public" returns="boolean">
	/// 	<description> Make DropDown restore scroll position and previously highlighted item when reopened </description>
	/// 	<param name="val" type="boolean" default="undefined"> If set, True enables feature, False disables it (default) </param>
	/// </function>
	this.PersistView = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && val !== persistView)
		{
			persistView = val;

			if (me.GetPicker() !== null)
			{
				me.GetPicker().PersistView(val);
			}
		}

		return persistView;
	}

	/// <function container="Fit.Controls.DropDown" name="HighlightFirst" access="public" returns="boolean">
	/// 	<description> Make DropDown highlight first selectable item when opened </description>
	/// 	<param name="val" type="boolean" default="undefined"> If set, True enables feature, False disables it (default) </param>
	/// </function>
	this.HighlightFirst = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			highlightFirst = val;

			if (me.GetPicker() !== null)
			{
				me.GetPicker().HighlightFirst(val);
			}
		}

		return highlightFirst;
	}

	/// <function container="Fit.Controls.DropDown" name="RenameSelection" access="public">
	/// 	<description> Rename title of selected item by its value </description>
	/// 	<param name="val" type="string"> Value of selected item to rename </param>
	/// 	<param name="newTitle" type="string"> New item title </param>
	/// </function>
	this.RenameSelection = function(val, newTitle)
	{
		Fit.Validation.ExpectString(val);
		Fit.Validation.ExpectString(newTitle);

		var selection = itemCollection[val] || null;

		if (selection !== null && selection.Title !== newTitle)
		{
			var titleWithoutHtml = Fit.String.StripHtml(newTitle);

			Fit.Dom.Text(selection.TextNode, titleWithoutHtml);
			selection.Title = titleWithoutHtml;

			fireOnChange();
		}
	}

	/// <function container="Fit.Controls.DropDown" name="ClearSelections" access="public">
	/// 	<description> Clear selections </description>
	/// </function>
	this.ClearSelections = function()
	{
		var fireEvent = false;
		var wasFocused = focusAssigned; // Removing an input from DOM fires OnBlur which sets focusAssigned to False

		me._internal.ExecuteWithNoOnChange(function() // picker.UpdateItemSelection results in OnChange being fired
		{
			Fit.Array.ForEach(itemCollectionOrdered, function(selection)
			{
				if (picker !== null)
				{
					// Notice: Picker fires OnItemSelectionChanged when picker.UpdateItemSelection(..) is invoked
					// below (other controls than DropDown may have registered an OnItemSelectionChanged
					// handler too). In this case we set suppressOnItemSelectionChanged to True, causing
					// drop down to do nothing in OnItemSelectionChanged handler when fired. Drop down's OnItemSelectionChanged
					// handler is responsible for handling items added/removed by picker, but in this case the change did not
					// come from the picker.
					suppressOnItemSelectionChanged = true;

					var res = true;
					var error = null;

					try // Make sure we can set suppressOnItemSelectionChanged false again, so drop down remains in a functioning state
					{
						var res = picker.UpdateItemSelection(selection.Value, false, me.Focused() === false); // OnItemSelectionChanging and OnItemSelectionChanged are fired if picker recognizes item, causing it to be removed in drop down's OnItemSelectionChanged handler (unless canceled, in which case False is returned)
					}
					catch (err) { error = err; }

					suppressOnItemSelectionChanged = false;

					if (error !== null)
						Fit.Validation.ThrowError(error);

					if (res !== false && selection.DomElement.parentElement.parentElement !== null)
					{
						// Element was not removed (still rooted in DOM), because picker did not recognize
						// it (did not fire OnItemSelectionChanged) which would otherwise have triggered Drop
						// Down's OnItemSelectionChanged handler, which in turn would have called RemoveSelection.
						// And we know it did not cancel change since picker.UpdateItemSelection did not return False.
						// It is fine to remove item.
						Fit.Dom.Remove(selection.DomElement.parentElement);
					}

					if (res !== false)
						fireEvent = true;
				}
				else
				{
					Fit.Dom.Remove(selection.DomElement.parentElement);
					fireEvent = true;
				}
			});

			Fit.Array.ForEach(itemDropZones, function(key)
			{
				itemDropZones[key].Dispose();
			});

			itemCollection = {};
			itemCollectionOrdered = [];
			itemDropZones = {};
		});

		focusAssigned = wasFocused;

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
				res = picker.UpdateItemSelection(value, false, me.Focused() === false);
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

		var itemObject = itemCollection[value] || null;

		if (itemObject === null)
			return;

		if (me.MultiSelectionMode() === true && itemObject.DomElement.parentElement.nextSibling !== null && itemObject.DomElement.parentElement.nextSibling !== txtPrimary)
			txt = itemObject.DomElement.parentElement.nextSibling.children[0];

		found = itemObject.DomElement.parentElement;

		if (me.TextSelectionMode() === false)
		{
			// Do not assign focus in TextSelectionMode - only txtPrimary is visible,
			// and while modern browsers will just ignore focus assignment for hidden
			// inputs and keep focus where it is, IE8 will throw an error in a modal
			// alert dialog with the following message:
			// "ThrowError: Can't move focus to the control because it is invisible, not enabled, or of a type that does not accept the focus."
			// Focus is changed internally in DropDown when de-selecting items, in which case
			// one of the inputs belonging to one of the remaining hidden items will be assigned
			// focus and trigger the error because it is hidden.

			if (me.MultiSelectionMode() === false)
				focusInput(txtPrimary);
			else
				focusInput(((txt !== null) ? txt : txtPrimary)); // Place focus in front of item to the right of removed element
		}

		Fit.Dom.Remove(found);
		Fit.Array.Remove(itemCollectionOrdered, itemObject);
		delete itemCollection[value];

		itemDropZones[value].Dispose();
		delete itemDropZones[value];

		fireOnChange();
	}

	/// <container name="Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem">
	/// 	<description> DropDown item </description>
	/// 	<member name="Title" type="string"> Updated item title </member>
	/// 	<member name="Value" type="string"> unique item value </member>
	/// 	<member name="Exists" type="boolean"> Value indicating whether item still exists or not </member>
	/// </container>

	/// <function container="Fit.Controls.DropDown" name="UpdateSelected" access="public" returns="Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem[]">
	/// 	<description>
	/// 		Update title of selected items based on data in associated picker control.
	/// 		An array of updated items are returned. Each object has the following properties:
	/// 		 - Title: string (Updated title)
	/// 		 - Value: string (Unique item value)
	/// 		 - Exists: boolean (True if item still exists, False if not)
	/// 		This is useful if selections are stored in a database, and
	/// 		available items may have their titles changed over time. Invoking
	/// 		this function will ensure that the selection displayed to the user
	/// 		reflects the actual state of data in the picker control. Be aware
	/// 		that this function can only update selected items if a picker has been
	/// 		associated (see SetPicker(..)), and it contains the data from which
	/// 		selected items are to be updated.
	/// 		Items that no longer exists in picker's data will not automatically
	/// 		be removed.
	/// 	</description>
	/// </function>
	this.UpdateSelected = function()
	{
		if (me.GetPicker() === null)
		{
			return [];
		}

		var updated = [];
		var selections = me.GetSelections();

		Fit.Array.ForEach(selections, function(selected)
		{
			var pickerItem = me.GetPicker().GetItemByValue(selected.Value);

			if (pickerItem !== null)
			{
				updateSelectionElementTitleByValue(selected.Value, Fit.String.StripHtml(pickerItem.Title));

				Fit.Array.Add(updated, { Title: pickerItem.Title, Value: selected.Value, Exists: true });
			}
			else
			{
				Fit.Array.Add(updated, { Title: selected.Title, Value: selected.Value, Exists: false });
			}
		});

		// Update text representation if TextSelectionMode is enabled
		if (me.TextSelectionMode() === true)
		{
			me.TextSelectionMode(false);
			me.TextSelectionMode(true);
		}

		return updated;
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

		setInputEditing(inp, false);

		if (inp === txtActive)
			prevValue = "";

		fireOnInputChanged("");
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

		var txt = txtActive;
		var fireOnChange = txt.value !== val;

		if (focusAssigned === false && txt !== txtPrimary)
		{
			// DropDown does not have focus, and the currently active input field
			// is not the primary one. Change it to the primary input field instead.

			// Clear active input field in case it has a value
			txtActive.value = "";
			setInputEditing(txtActive, false);

			txt = txtPrimary;
			txtActive = txtPrimary;
		}

		setInputEditing(txt, val !== "");

		txt.value = val;
		prevValue = val;

		if (fireOnChange === true)
		{
			fireOnInputChanged(txt.value);
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

		if (txtActive === txtPrimary && me.GetInputValue() === "")
		{
			me._internal.UndoClearInputForSearch();
		}

		// Do this before displaying drop down to prevent dropdown with position:absolute
		// from changing height of document which may cause page to temporarily scroll, hence
		// result in incorrect measurement of control position in optimizeDropDownPosition().
		optimizeDropDownPosition(true);

		dropDownMenu.style.minWidth = me.GetDomElement().offsetWidth + "px"; // In case DropDownMaxWidth(..) is set - update every time drop down is opened in case viewport is resized and has changed control width
		dropDownMenu.style.display = "block";

		me._internal.Data("open", "true");

		//optimizeDropDownPosition();

		Fit._internal.DropDown.Current = me;

		fireOnDropDownOpen();

		// Scroll selected item into view in Single Selection Mode.
		// This needs to be done after fireOnDropDownOpen() is invoked
		// because it fires PickerBase.OnShow which in TreeView resets
		// the scroll position.
		// NOTICE: WSDropDown also calls RevealItemInView(..) when
		// root nodes have been populated.

		if (me.MultiSelectionMode() === false && me.GetSelections().length === 1)
		{
			me.GetPicker().RevealItemInView(me.GetSelections()[0].Value);
		}
	}

	/// <function container="Fit.Controls.DropDown" name="CloseDropDown" access="public">
	/// 	<description> Close drop down menu </description>
	/// </function>
	this.CloseDropDown = function()
	{
		if (dropDownMenu.style.display === "none")
			return;

		dropDownMenu.style.display = "none";
		resetDropDownPosition();

		me._internal.Data("open", "false");

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

	/// <function container="Fit.Controls.DropDown" name="DetectBoundaries" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether boundary/collision detection is enabled or not (off by default).
	/// 		This may cause drop down to open upwards if sufficient space is not available below control.
	/// 		If control is contained in a scrollable parent, this will be considered the active viewport,
	/// 		and as such define the active boundaries - unless relativeToViewport is set to True, in which
	/// 		case the actual browser viewport will be used.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables collision detection, False disables it (default) </param>
	/// 	<param name="relativeToViewport" type="boolean" default="false">
	/// 		If defined, True results in viewport being considered the container to which available space is determined.
	/// 		This also results in DropDown menu being positioned with position:fixed, allowing it to escape a container
	/// 		with overflow (e.g. overflow:auto|hidden|scroll). Be aware though that this does not work reliably in combination
	/// 		with CSS animation and CSS transform as it creates a new stacking context to which position:fixed becomes relative.
	/// 		A value of False (default) results in available space being determined relative to the boundaries of the
	/// 		control's scroll parent. The DropDown menu will stay within its container and not overflow it.
	/// 	</param>
	/// </function>
	this.DetectBoundaries = function(val, relativeToViewport)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(relativeToViewport, true);

		// NOTICE: This feature is known to not work properly with iOS 9 and below:
		// https://github.com/Jemt/Fit.UI/issues/87

		if (Fit.Validation.IsSet(val) === true)
		{
			detectBoundaries = val;
			detectBoundariesRelToViewPort = relativeToViewport === true;
		}

		return detectBoundaries;
	}

	// ============================================
	// Events (OnChange defined on BaseControl)
	// ============================================

	/// <function container="Fit.Controls.DropDownTypeDefs" name="InputChangedEventHandler">
	/// 	<description> Input changed event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="value" type="string"> Input value </param>
	/// </function>

	/// <function container="Fit.Controls.DropDownTypeDefs" name="PasteEventHandler" returns="boolean | void">
	/// 	<description> Paste event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="value" type="string"> Value pasted into input field </param>
	/// </function>

	/// <function container="Fit.Controls.DropDownTypeDefs" name="InteractionEventHandler">
	/// 	<description> Event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// </function>

	/// <function container="Fit.Controls.DropDown" name="OnInputChanged" access="public">
	/// 	<description>
	/// 		Add event handler fired when input value is changed.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.DropDown) and Value (string).
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.DropDownTypeDefs.InputChangedEventHandler">
	/// 		Event handler function
	/// 	</param>
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
	/// 	<param name="cb" type="Fit.Controls.DropDownTypeDefs.PasteEventHandler">
	/// 		Event handler function
	/// 	</param>
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
	/// 	<param name="cb" type="Fit.Controls.DropDownTypeDefs.InteractionEventHandler">
	/// 		Event handler function
	/// 	</param>
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
	/// 	<param name="cb" type="Fit.Controls.DropDownTypeDefs.InteractionEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnClose = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onCloseHandlers, cb);
	}

	// ============================================
	// Protected
	// ============================================

	this._internal = (this._internal ? this._internal : {});

	this._internal.ClearInputForSearch = function()
	{
		if (me.TextSelectionMode() === true)
		{
			forceFocusInput(txtPrimary);
			txtPrimary.value = "";
			updatePlaceholder(true);
		}
		else
		{
			forceFocusInput(txtPrimary);
			me.ClearInput();
			setInputEditing(txtPrimary, true);
		}

		// If DropDown is in Visual Selection Mode, the search field is now displayed
		// on a separate "line" (see code above where setInputEditing(..) is called).
		// When that input field lose focus, it will immediately return to its normal
		// state. This results in the control's height changing which in turn results
		// in the pulldown menu moving up. So if a user clicks an item in the pulldown
		// menu, the input lose focus, the position of the pulldown menu changes, and
		// nothing happens from the click because the picker uses a traditional onclick
		// event to register interactions, which doesn't fire unless the mouse button is released
		// on the same object it was pressed down on. We avoid this by closing the control.
		// We close it in both Text Selection Mode and Visual Selection Mode for consistency.
		me.CloseDropDown();
	}

	this._internal.UndoClearInputForSearch = function()
	{
		if (me.TextSelectionMode() === true)
		{
			updateTextSelection(); // Also removes placeholder by calling updatePlaceholder(true)
		}
		else
		{
			me.ClearInput();
			setInputEditing(txtPrimary, false);
		}
	}

	// ============================================
	// Private
	// ============================================

	function createSearchField()
	{
		var txt = document.createElement("input");
		txt.autocomplete = "off";
		txt.spellcheck = false;

		txt.onpaste = function(e)
		{
			var orgValue = txt.value;

			setTimeout(function() // Timeout to queue event to have pasted value available
			{
				/*if (me.TextSelectionMode() === true && txt.value === prevTextSelection)
				{
					// User just copied selection text and pasted it again - ignore
					// so we don't fire OnInputChanged below and change prevValue which
					// will cause OnInputChanged to fire once again when control lose focus.
					return;
				}*/

				// DISABLED - does not make sense.
				// Pasting a value would not fire OnInputChanged, but starting to delete
				// the characters just pasted would. So pasting "ABC" would not fire anything, but
				// pressing backspace would fire OnInputChanged with the value "AB" - that is odd.
				/*if (txt.value === prevValue || txt.value === prevTextSelection)
				{
					return; // Skip event if user just copied text and pasted it again
				}*/

				prevValue = txt.value;
				var pastedValue = txt.value;

				setInputEditing(txt, true);

				if (fireOnPaste(txt.value) === true)
				{
					if (txt.value === pastedValue)
					{
						// No OnPaste handler altered input value by calling SetInputValue(..)

						fireOnInputChanged(txt.value);
					}
				}
				else
				{
					// Paste canceled - restore old value, unless OnPaste handler called SetInputValue with a different value

					if (txt.value === pastedValue)
					{
						txt.value = orgValue;
						prevValue = txt.value;
					}
				}
			}, 0);

			clearTextSelectionOnInputChange = false;
		}

		txt.ontouchstart = function(e) // Ontouchstart fires before onfocus which is needed - txt.onfocus uses focusInputOnMobile
		{
			focusInputOnMobile = true; // Always focus inputs on mobile if user initially activated control by clicking/touching an input field
		}

		txt.onfocus = function(e)
		{
			// Move focus to arrow icon if on mobile and if user activated control in a way where bringing focus to
			// input fields does not make sense (search for focusInputOnMobile), or if control is configured with
			// TextSelectionMode(true) and InputEnabled(false) which doesn't allow user to place cursor between
			// selected items, nor write in the input field.
			if (isMobile === true && (focusInputOnMobile === false || (me.TextSelectionMode() === true && me.InputEnabled() === false)))
			{
				arrow.focus(); // Notice that arrow.onfocus will set focusAssigned
				return;
			}

			if (Fit.Dom.GetIndex(txt.parentElement) === itemCollectionOrdered.length - 1 && txt.nextSibling === null)
			{
				// Right input control in last selected item - focus txtPrimary instead so it word wraps alone when entering text
				txtPrimary.focus();
				return;
			}

			focusAssigned = true;

			if (initialFocus === true)
			{
				initialFocus = false;

				if (me.TextSelectionMode() === false)
					me.ClearInput(txtPrimary);
			}

			txtActive = txt;
			prevValue = (me.TextSelectionMode() === false ? txtActive.value : prevValue); // Do not assign text selection to prevValue - it should only hold changes made by user or by calls to SetInputValue(..)

			clearAllInputsButActive();
		}

		txt.onblur = function(e)
		{
			if (me === null)
			{
				// Fix for Chrome which fires OnChange and OnBlur (in both capturering and bubbling phase)
				// if control has focus while being removed from DOM, e.g. if used in a dialog closed using ESC.
				// More details here: https://bugs.chromium.org/p/chromium/issues/detail?id=866242
				return;
			}

			focusAssigned = false;

			if (txt.value === "")
			{
				setInputEditing(txt, false);
			}
		}

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

			if (me.TextSelectionMode() === true && clearTextSelectionOnInputChange === true && txtEnabled === true)
			{
				// Clear input in Text Selection Mode if user starts entering a value

				// Skip if key press is TAB, ENTER, ESC, LEFT, UP, RIGHT, or DOWN.
				// Also ignore key press if combined with modifier keys (except if SHIFT+Key for upper case letters, of course).
				var modKeys = Fit.Events.GetModifierKeys();
				if (Fit.Array.Contains([9, 13, 27, 37, 38, 39, 40], ev.keyCode) === false && (modKeys.Shift === false || modKeys.KeyDown !== 16) && modKeys.Ctrl === false && modKeys.Alt === false && modKeys.Meta === false)
				{
					// User is entering a value - clear input before character is applied to input

					clearTextSelectionOnInputChange = false;
					txt.value = ""; // No need to update prevValue - this is not the value set by the user - see onkeyup which updates prevValue

					return;
				}
			}

			if (ev.keyCode === 9) // Tab
			{
				if (me.TextSelectionMode() === true)
				{
					me.CloseDropDown();
					return;
				}

				if (ev.shiftKey === true) // Moving left
				{
					if (me.GetSelections().length === 0)
					{
						me.CloseDropDown();
						return; // Let browser handle navigation
					}
					else if (txt !== txtPrimary && txt.parentElement.previousSibling === null)
					{
						me.CloseDropDown();
						return; // Let browser handle navigation
					}

					moveToInput("Prev");
				}
				else // Moving right
				{
					if (txt === txtPrimary)
					{
						me.CloseDropDown();
						return; // Let browser handle navigation
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

				if (me.TextSelectionMode() === true) // && (Fit.Browser.GetBrowser() !== "MSIE" || Fit.Browser.GetVersion() !== 8)
				{
					// Set cursor at the beginning of text field.
					// Suppressing default behaviour to prevent cursor
					// from jumping to the end. SetCaretPosition(..)
					// is also necessary to make sure text value
					// does not remain selected (blue text selection) if
					// focus was assigned using tab navigation.
					Fit.Dom.SetCaretPosition(txtPrimary, 0);
					Fit.Events.PreventDefault(ev);
				}
			}
			else if (ev.keyCode === 37) // Arrow left
			{
				if (me.TextSelectionMode() === true)
					return;

				moveToInput("Prev");
			}
			else if (ev.keyCode === 39) // Arrow right
			{
				if (me.TextSelectionMode() === true)
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
				if (me.TextSelectionMode() === true)
				{
					if (txtEnabled === false)
					{
						Fit.Events.PreventDefault(ev); // Prevent user from clearing input value
					}

					return;
				}

				if (txt.value.length === 0)
				{
					if (txt === txtPrimary)
					{
						me._internal.UndoClearInputForSearch();
					}

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
			}
			else if (ev.keyCode === 46) // Delete - remove selection
			{
				if (me.TextSelectionMode() === true)
				{
					if (txtEnabled === false)
					{
						Fit.Events.PreventDefault(ev); // Prevent user from clearing input value
					}

					return;
				}

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
					if (Fit.Events.GetModifierKeys().Meta === false && Fit.Events.GetModifierKeys().Ctrl === false)
					{
						// Suppress key press unless modifier key is being used (e.g. CTRL+F5 or CMD+R to reload page)
						Fit.Events.PreventDefault(ev);
					}

					return;
				}
			}
		}

		txt.onkeypress = function(e) // Fires continuously for real character keys (unless suppressed in OnKeyDown)
		{
			updatePlaceholder(true, true); // Make sure placeholder is removed immediately on keystroke

			setInputEditing(txt, true);
		}

		txt.onkeyup = function(e) // Fires only once when a key is released (unless suppressed in OnKeyDown)
		{
			var ev = Fit.Events.GetEvent(e);

			if (ev.keyCode !== 37 && ev.keyCode !== 38 && ev.keyCode !== 39 && ev.keyCode !== 40 && ev.keyCode !== 27 && ev.keyCode !== 9 && ev.keyCode !== 16 && ev.ctrlKey === false && ev.keyCode !== 17) // Do not fire change event for: arrow keys, escape, tab, shift, and on paste (never fires when CTRL is held down (ev.ctrlKey true) or released (ev.keyCode 17))
			{
				if (me.TextSelectionMode() === true && txt.value === prevTextSelection)
				{
					// Do not fire OnInputChanged. Input value is identical to text selection
					// so user probably pressed SPACE to toggle a selection (which doesn't change input value), or
					// pressed some other none-character key (e.g CMD/SUPER or ALT/OPTION) which did not alter input value.
					return;
				}

				if (txt.value !== prevValue /*&& (me.TextSelectionMode() === false || txt.value !== prevTextSelection)*/)
				{
					prevValue = txt.value;
					fireOnInputChanged(txt.value);
				}
			}
		}

		return txt;
	}

	function createItemObject(title, value, valid, domElement, textNode)
	{
		Fit.Validation.ExpectString(title); // NOTICE: Title with any HTML stripped away!
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(valid);
		Fit.Validation.ExpectDomElement(domElement);
		Fit.Validation.ExpectTextNode(textNode);

		return { Title: title, Value: value, Valid: valid, DomElement: domElement, TextNode: textNode };
	}
	/*function convertItemElementToItemObject(itemElm)
	{
		Fit.Validation.ExpectDomElement(itemElm);
		return { Title: Fit.Dom.Text(itemElm), Value: decode(Fit.Dom.Data(itemElm, "value")), Valid: Fit.Dom.HasClass(itemElm, "FitUiControlDropDownInvalid") === false, DomElement: itemElm };
	}*/

	function updateSelectionElementTitleByValue(value, newTitle)
	{
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectString(newTitle); // NOTICE: Title with any HTML stripped away!

		var item = itemCollection[value] || null;

		if (item !== null)
		{
			item.Title = newTitle;
			item.DomElement.childNodes[0].nodeValue = newTitle;
		}
	}

	/*function getFirstSelectionElement()
	{
		if (itemCollectionOrdered.length > 0)
		{
			return itemCollectionOrdered[0].DomElement;
		}

		return null;
	}*/

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
			// TODO: Rename this! We have a private property in this class with the same name!
			var itemContainer = null; // Remains Null if last item's right input control has focus (unlikely since it will never be focused unless user manages to actually click it (5px wide)

			if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 0) // Left input has focus
				itemContainer = txtActive.parentElement; // Use current item
			else if (txtActive !== txtPrimary && Fit.Dom.GetIndex(txtActive) === 2 && txtActive.parentElement.nextSibling.tagName === "SPAN") // Right input has focus
				itemContainer = txtActive.parentElement.nextSibling; // Use next item

			if (itemContainer !== null)
				newInput = itemContainer.children[2];
		}

		if (newInput === null) // May be null if no selections are available to move to
			return;

		// Move content
		/*newInput.value = txtActive.value;
		me.ClearInput();*/

		focusInput(newInput);
	}

	function focusInput(input)
	{
		Fit.Validation.ExpectInstance(input, HTMLInputElement);

		txtActive = input;

		if (focusAssigned === true) // Only set focus if user initially assigned focus to control
			txtActive.focus(); // Notice: Input field's onfocus handler will move focus to txtPrimary if this is the last selection's right side input field - on mobile it might redirect focus to the arrow icon to avoid bringing up the virtual keyboard
	}

	function forceFocusInput(input)
	{
		Fit.Validation.ExpectInstance(input, HTMLInputElement);

		// By default focus is never assigned to input on mobile if user opened the
		// DropDown by clicking the arrow icon. ForceFocusInput allows us to ignore this
		// aspect. On desktop the input field always remains focused  as it automatically
		// steals back focus immediately after interacting with a picker control. See
		// picker.OnFocusIn handler registered in SetPicker(..)
		var orgFocusInputOnMobile = focusInputOnMobile;
		focusInputOnMobile = true;
		focusInput(input);
		focusInputOnMobile = orgFocusInputOnMobile;
	}

	function setInputEditing(input, val, keepStateOnParent)
	{
		Fit.Validation.ExpectInstance(input, HTMLInputElement);
		Fit.Validation.ExpectBoolean(val);
		Fit.Validation.ExpectBoolean(keepStateOnParent, true);

		if (keepStateOnParent !== true)
		{
			Fit.Dom.Data(input.parentElement, "editing", val === true ? "true" : null);
		}

		Fit.Dom.Data(input, "editing", val === true ? "true" : null);

		if (input === txtPrimary)
		{
			// DropDown's placeholder is only displayed when no items are selected.
			// Therefore, use native placeholder for input if items are selected.
			txtPrimary.placeholder = val === true && me.GetSelections().length > 0 ? me.Placeholder() : "";
		}

		me._internal.Repaint();
	}

	function clearAllInputsButActive()
	{
		var inputs = itemContainer.getElementsByTagName("input");

		Fit.Array.ForEach(inputs, function(input)
		{
			if (input === txtActive)
				return;

			if (txtActive.parentElement === input.parentElement)
			{
				// Input is contained in a selected object whose other input is txtActive.
				// Do not remove editing state from parent element in this case - keep it!
				setInputEditing(input, false, true);
			}
			else
			{
				setInputEditing(input, false);
			}

			me.ClearInput(input);
		});

		me._internal.Repaint(); // Repaint - data attributes changed above
	}

	function optimizeDropDownPosition(force)
	{
		Fit.Validation.ExpectBoolean(force, true);

		if (detectBoundaries === false || (me.IsDropDownOpen() === false && force !== true))
			return;

		// Check visibility in case DropDown control is hidden while items are being selected.
		// This is a common approach to reduce expensive reflows when programmatically selecting
		// many items (e.g. using SelectAll in TreeView picker). If control is in fact hidden,
		// the picker container will keep its current position rather than being positioned
		// below/above DropDown as expected - that's acceptable. Re-opening DropDown will position
		// it properly. Without this fix, Fit.Dom.GetBoundingPosition(..) used below would return Null and
		// result in an error.
		if (Fit.Dom.IsVisible(me.GetDomElement()) === false)
			return;

		// DropDown menu is positioned above control if sufficient space is not available below it. It will always prefer
		// to open downwards if possible. The MaxHeight of the DropDown menu will be adjusted automatically to better fit.
		// In addition, if sufficient space is not available to the right of the control, the DropDown menu will open to
		// the left side instead. If sufficient space is not available on the left side either, it will choose the side with
		// the most space, and adjust the DropDown menu's MaxWidth to make it fit.

		// DropDown menu is positioned relative to itemContainer which is what makes up the DropDown UI - me.GetDomElement() is merely a container with no styling by default

		// Allow DropDown to reposition when items are added/remove which might affect height of control
		resetDropDownPosition();

		var spaceRequiredBelowControl = 100;							// Opens upwards if this amount of pixels is not available below control, and more space is available above control
		var spaceRequiredRightSide = getDropDownMaxWidthPixelValue();	// DropDownMaxWidth as px value - DropDown menu opens to the side that best accommodates the needed space - opening to the right is preferred
		var spacingToEdge = 10;											// Makes sure that DropDown menu has this amount of spacing (in pixels) to the edge of the viewport or scroll parent

		if (detectBoundariesRelToViewPort === false) // Detecting collisions against scroll parent
		{
			var posFromTopWithinContainer = -1;		// DropDown control's position from top within scrollable parent
			var posFromLeftWithinContainer = -1;	// DropDown control's position from left within scrollable parent
			var availableSpaceBelowControl = -1;	// Number of pixels available below control (from bottom side of control)
			var availableSpaceRightOfControl = -1;	// Number of pixels available to the right of control (from right side of control)
			var mostSpaceAboveControl = false;		// Flag indicating whether more space is available above control or not
			var mostSpaceLeftOfControl = false;		// Flag indicating whether more space is available to the left of control or not
			var condNotEnoughSpaceBelow = false;	// Flag indicating whether DropDown menu has insufficient space below control - opens upwards if this is true and mostSpaceAboveControl is true
			var condNotEnoughSpaceRightSide = false;// Flag indicating whether DropDown menu has insufficient space to the right of control - opens to the left if this is true and mostSpaceLeftOfControl is true

			var overflowParent = Fit.Dom.GetOverflowingParent(me.GetDomElement()); // Contrary to GetScrollParent(..), GetOverflowingParent(..) also take overflow:hidden into account

			if (overflowParent !== null) // Contained in custom scroll parent (not document)
			{
				var overflowParentPosition = Fit.Dom.GetBoundingPosition(overflowParent);
				var parentPosY = overflowParentPosition.Y + parseInt(Fit.Dom.GetComputedStyle(overflowParent, "border-top-width")); // Position inside scroll parent and inside its borders which are placed inside the box (box-sizing:border-box)
				var parentPosX = overflowParentPosition.X + parseInt(Fit.Dom.GetComputedStyle(overflowParent, "border-right-width")); // Position inside scroll parent and inside its borders which are placed inside the box (box-sizing:border-box)
				var parentInnerHeight = overflowParent.offsetHeight - parseInt(Fit.Dom.GetComputedStyle(overflowParent, "border-top-width")) - parseInt(Fit.Dom.GetComputedStyle(overflowParent, "border-bottom-width")); // Substract borders so we have the actual space available to the positioned element - borders are placed inside the box (box-sizing:border-box)
				var parentInnerWidth = overflowParent.offsetWidth - parseInt(Fit.Dom.GetComputedStyle(overflowParent, "border-left-width")) - parseInt(Fit.Dom.GetComputedStyle(overflowParent, "border-right-width")); // Substract borders so we have the actual space available to the positioned element - borders are placed inside the box (box-sizing:border-box)
				var controlPos = Fit.Dom.GetBoundingPosition(itemContainer);
				var parentScrollbars = Fit.Dom.GetScrollBars(overflowParent);

				posFromTopWithinContainer = controlPos.Y - parentPosY;
				posFromLeftWithinContainer = controlPos.X - parentPosX;
				availableSpaceBelowControl = parentInnerHeight - (posFromTopWithinContainer + itemContainer.offsetHeight) - parentScrollbars.Horizontal.Size;
				availableSpaceRightOfControl = parentInnerWidth - (posFromLeftWithinContainer + itemContainer.offsetWidth) - parentScrollbars.Vertical.Size;
			}
			else // Document itself is scroll parent
			{
				var controlPos = Fit.Dom.GetBoundingPosition(itemContainer);
				var controlPositionY = controlPos.Y;
				var controlPositionX = controlPos.X;
				var viewPortDimensions = Fit.Browser.GetViewPortDimensions(); // Returns { Width, Height } - actual space available (scrollbars are not included in these dimensions)
				var spaceBelowControl = viewPortDimensions.Height - (controlPositionY + itemContainer.offsetHeight); // Space available below control
				var spaceRightOfControl = viewPortDimensions.Width - (controlPositionX + itemContainer.offsetWidth); // Space available right of control

				posFromTopWithinContainer = controlPositionY;
				posFromLeftWithinContainer = controlPositionX;
				availableSpaceBelowControl = spaceBelowControl;
				availableSpaceRightOfControl = spaceRightOfControl;
			}

			mostSpaceAboveControl = posFromTopWithinContainer > availableSpaceBelowControl;
			mostSpaceLeftOfControl = posFromLeftWithinContainer > availableSpaceRightOfControl;
			condNotEnoughSpaceBelow = availableSpaceBelowControl - spacingToEdge < spaceRequiredBelowControl;
			condNotEnoughSpaceRightSide = spaceRequiredRightSide === -1 ? false /* DropDownMaxWidth not set - will not extend beyond width of control */ : availableSpaceRightOfControl - spacingToEdge < spaceRequiredRightSide;

			// Open upward or downward (default)

			var spaceAvailable = -1;

			if (condNotEnoughSpaceBelow === true && mostSpaceAboveControl === true) // Open upward
			{
				dropDownMenu.style.bottom = itemContainer.offsetHeight + "px";
				spaceAvailable = posFromTopWithinContainer - spacingToEdge;
			}
			else // Open like normal, downwards
			{
				spaceAvailable = availableSpaceBelowControl - spacingToEdge;
			}

			// Adjust DropDown menu's MaxHeight to make it fit

			if (picker !== null && (maxHeight.Unit !== "px" || maxHeight.Value > spaceAvailable))
			{
				// Reduce DropDown menu's max height.
				// CSS unit for MaxHeight is something like 'em' (so enforce pixel based
				// max height), or pixel based MaxHeight simply exceeds space available.

				picker.MaxHeight(spaceAvailable, "px");
			}

			if (picker !== null && Fit.Core.IsEqual(picker.MaxHeight(), maxHeight) === false && picker.MaxHeight().Value < maxHeight.Value)
			{
				// MaxHeight has previously been reduced by optimizeDropDownPosition and is now smaller than
				// the value initially configured for the DropDown menu. Increase its size again if sufficient space is available.

				picker.MaxHeight((maxHeight.Value < spaceAvailable ? maxHeight.Value : spaceAvailable), "px");
			}

			// Open left or right (default)

			if (condNotEnoughSpaceRightSide === true && mostSpaceLeftOfControl === true) // Open to the left
			{
				dropDownMenu.style.right = "0px";
				var spaceAvailableLeftSide = posFromLeftWithinContainer + itemContainer.offsetWidth - spacingToEdge;

				if (spaceAvailableLeftSide < spaceRequiredRightSide) // Adjust max-width if sufficient space is not available to the left side
				{
					dropDownMenu.style.maxWidth = spaceAvailableLeftSide + "px";
				}
			}
			else // Open like normal, to the right
			{
				var spaceAvailableRightSide = availableSpaceRightOfControl + itemContainer.offsetWidth - spacingToEdge;

				if (spaceAvailableRightSide < spaceRequiredRightSide) // Adjust max-width if sufficient space is not available to the right side
				{
					dropDownMenu.style.maxWidth = spaceAvailableRightSide + "px";
				}
			}
		}
		else // Position DropDown menu relative to viewport using position:fixed
		{
			// Position:fixed has the ability to escape overflow:hidden|auto|scroll,
			// but also results in the DropDown menu being "detached" from the
			// control, allowing the control to be scrolled away from the
			// DropDown menu - it sticks to the screen.
			// Also notice that position:fixed does not work reliable if control
			// is contained in a parent that uses CSS animation or transform,
			// as this creates a new stacking context to which position:fixed
			// becomes relative.

			var viewPortDimensions = Fit.Browser.GetViewPortDimensions();											// Returns { Width, Height } - actual space available (scrollbars are not included in these dimensions)
			var controlPositionY = Fit.Dom.GetBoundingPosition(itemContainer).Y;									// Position from top
			var controlPositionX = Fit.Dom.GetBoundingPosition(itemContainer).X;									// Position from left
			var spaceAboveControl = controlPositionY;																// Space available above control
			var spaceBelowControl = viewPortDimensions.Height - (controlPositionY + itemContainer.offsetHeight);	// Space available below control
			var spaceLeftOfControl = controlPositionX;																// Soace available left of control (from left side of control)
			var spaceRightOfControl = viewPortDimensions.Width - (controlPositionX + itemContainer.offsetWidth);	// Space available right of control (from right side of control)
			var mostSpaceAboveControl = spaceAboveControl > spaceBelowControl;										// True if there is more space available above control than below control
			var mostSpaceLeftOfControl = spaceRightOfControl < spaceLeftOfControl;									// True if there is more space available right of control than left of control
			var condNotEnoughSpaceBelow = spaceBelowControl - spacingToEdge < spaceRequiredBelowControl;
			var condNotEnoughSpaceRightSide = spaceRightOfControl + itemContainer.offsetWidth - spacingToEdge < spaceRequiredRightSide;

			dropDownMenu.style.position = "fixed";	// Using fixed positioning to escape containers with overflow:scroll|hidden|auto
			dropDownMenu.style.width = "auto";		// Picker by default has width:100% to assume the same width as the control, except if DropDownMaxWidth is set, in which case it is already "auto"

			// Open upward or downward (default)

			var spaceAvailable = -1;

			if (condNotEnoughSpaceBelow === true && mostSpaceAboveControl === true) // Open upward
			{
				// Handle situation where the control is contained in a parent with scroll
				// and the control has been partially scrolled out of view. In this case
				// we do not want to position the DropDown menu where the (now hidden)
				// top of the control is located in the viewport, but where the scrollable
				// container starts.
				// https://github.com/Jemt/Fit.UI/issues/51

				var scrollParent = Fit.Dom.GetScrollParent(me.GetDomElement());

				if (scrollParent !== Fit.Dom.GetScrollDocument())
				{
					// Control is positioned within a container with scroll.
					// Calculate position relative to viewport to determine
					// whether control has been scrolled out of view.

					var scrollParentPosY = Fit.Dom.GetBoundingPosition(scrollParent).Y;
					scrollParentPosY = scrollParentPosY + parseInt(Fit.Dom.GetComputedStyle(scrollParent, "border-top-width"));

					if (controlPositionY < scrollParentPosY)
					{
						// Relative to the viewport the control is positioned above the
						// scroll container which means it has been scrolled out of view.
						controlPositionY = scrollParentPosY;
					}
				}

				dropDownMenu.style.bottom = (viewPortDimensions.Height - controlPositionY) + "px";
				spaceAvailable = controlPositionY - spacingToEdge;
			}
			else // Open like normal, downwards
			{
				// Handle situation where the control is contained in a parent with scroll
				// and the control has been partially scrolled out of view. In this case
				// we do not want to position the DropDown menu where the (now hidden)
				// bottom of the control is located in the viewport, but where the scrollable
				// container ends.
				// https://github.com/Jemt/Fit.UI/issues/51 (see re-open comment oct. 30, 2020)

				var scrollParent = Fit.Dom.GetScrollParent(me.GetDomElement());
				var alternativeTopPos = -1;

				if (scrollParent !== Fit.Dom.GetScrollDocument())
				{
					// Control is positioned within a container with scroll.
					// Calculate position relative to viewport to determine
					// whether control has been scrolled out of view.

					var scrollParentBottomPosY = Fit.Dom.GetBoundingPosition(scrollParent).Y + scrollParent.offsetHeight - parseInt(Fit.Dom.GetComputedStyle(scrollParent, "border-bottom-width"));
					var controlBottomPosY = controlPositionY + itemContainer.offsetHeight;

					if (controlBottomPosY > scrollParentBottomPosY)
					{
						// Relative to the viewport the bottom of the control is positioned below the
						// bottom of the scroll container which means it has been scrolled out of view.
						alternativeTopPos = scrollParentBottomPosY;
					}
				}

				dropDownMenu.style.top = (alternativeTopPos !== -1 ? alternativeTopPos : controlPositionY + itemContainer.offsetHeight) + "px";
				spaceAvailable = spaceBelowControl - spacingToEdge;
			}

			if (picker !== null && (maxHeight.Unit !== "px" || maxHeight.Value > spaceAvailable))
			{
				// Reduce drop down menu's max height.
				// CSS unit for MaxHeight is something like 'em' (so enforce pixel based
				// max height), or pixel based MaxHeight simply exceeds space available.

				picker.MaxHeight(spaceAvailable, "px");
			}

			if (picker !== null && Fit.Core.IsEqual(picker.MaxHeight(), maxHeight) === false && picker.MaxHeight().Value < maxHeight.Value)
			{
				// MaxHeight has previously been reduced by optimizeDropDownPosition and is now smaller than
				// the value initially configured for the drop down. Increase its size again if sufficient space is available.

				picker.MaxHeight((maxHeight.Value < spaceAvailable ? maxHeight.Value : spaceAvailable), "px");
			}

			// Open left or right (defafult)

			if (condNotEnoughSpaceRightSide === true && mostSpaceLeftOfControl === true) // Open to the left
			{
				dropDownMenu.style.right = spaceRightOfControl + "px";
				var spaceAvailableLeftSide = controlPositionX + itemContainer.offsetWidth - spacingToEdge; // Space available to the left, from right side of control

				if (spaceAvailableLeftSide < spaceRequiredRightSide) // Adjust max-width if sufficient space is not available to the left side
				{
					dropDownMenu.style.maxWidth = spaceAvailableLeftSide + "px";
				}
			}
			else // Open like normal, to the right
			{
				dropDownMenu.style.left = controlPositionX + "px"; // Set in case document or containers have been scrolled
				var spaceAvailableRightSide = spaceRightOfControl + itemContainer.offsetWidth - spacingToEdge; // Space available to the right, from left side of control

				if (spaceAvailableRightSide < spaceRequiredRightSide) // Adjust max-width if sufficient space is not available to the right side
				{
					dropDownMenu.style.maxWidth = spaceAvailableRightSide + "px";
				}
			}
		}
	}

	function resetDropDownPosition()
	{
		// Reset changes made by optimizeDropDownPosition()
		dropDownMenu.style.position = "";
		dropDownMenu.style.width = (maxWidth.Value > -1 ? dropDownMenu.style.width : ""); // Preserve width if DropDownMaxWidth is enabled since it also modifies this property
		dropDownMenu.style.maxWidth = (maxWidth.Value > -1 ? maxWidth.Value + maxWidth.Unit : "");
		dropDownMenu.style.bottom = "";
		dropDownMenu.style.top = "";
		dropDownMenu.style.left = "";
		dropDownMenu.style.right = "";

		if (picker !== null) // Checking in case picker was removed while opened (unlikely though)
			picker.MaxHeight(maxHeight.Value, maxHeight.Unit);
	}

	function getDropDownMaxWidthPixelValue()
	{
		var maxWidthPixels = -1;

		if (maxWidth.Value !== -1)
		{
			if (maxWidth.Unit === "px")
			{
				maxWidthPixels = maxWidth.Value;
			}
			else
			{
				maxWidthPixels = parseInt(Fit.Dom.GetComputedStyle(dropDownMenu, "maxWidth")); // Get computed pixel value rather than e.g. 15% or 20em
			}
		}

		return maxWidthPixels;
	}

	function updatePlaceholder(force, willAssumeInputValue)
	{
		Fit.Validation.ExpectBoolean(force, true);
		Fit.Validation.ExpectBoolean(willAssumeInputValue, true);

		if (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() < 10)
		{
			// Placeholder is not supported on IE8 as it currently relies on calc(..) in CSS.
			// Furthermore native support for placeholders (using the real placeholder attribute)
			// were introduced in IE10, so this also ensure consistent behaviour for all controls,
			// as e.g. Input and DatePicker uses the native placeholder implementation.
			return;
		}

		if (placeholder !== "" || force === true)
		{
			var setPlaceholder = placeholder !== "" && (me.TextSelectionMode() === true || itemCollectionOrdered.length === 0) && me.GetInputValue() === "" && willAssumeInputValue !== true;

			Fit.Dom.Data(itemContainer, "placeholder", setPlaceholder === true ? placeholder : null);
			Fit.Dom.Data(itemContainer, "placeholder-autoclear", setPlaceholder === true ? Fit.Browser.GetBrowser() === "MSIE" ? "true" : "false" : null);
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

			var draggableIndex = Fit.Dom.GetIndex(draggable.GetDomElement());
			var dropzoneIndex =  Fit.Dom.GetIndex(dropzone.GetDomElement());
			var itemObject = itemCollectionOrdered[draggableIndex];

			Fit.Array.RemoveAt(itemCollectionOrdered, draggableIndex);
			Fit.Array.Insert(itemCollectionOrdered, (draggableIndex < dropzoneIndex ? dropzoneIndex : dropzoneIndex + 1), itemObject);
			Fit.Dom.InsertAfter(dropzone.GetDomElement(), draggable.GetDomElement());

			fireChange = true;
		}
		else if (Fit.Dom.Data(dropzone.GetDomElement(), "dropping") === "left" && dropzone.GetDomElement().previousSibling !== draggable.GetDomElement())
		{
			// See comment in block above regarding focus
			focusAssigned = true;
			focusInput(txtPrimary);

			var draggableIndex = Fit.Dom.GetIndex(draggable.GetDomElement());
			var dropzoneIndex =  Fit.Dom.GetIndex(dropzone.GetDomElement());
			var itemObject = itemCollectionOrdered[draggableIndex];

			Fit.Array.RemoveAt(itemCollectionOrdered, draggableIndex);
			Fit.Array.Insert(itemCollectionOrdered, (draggableIndex < dropzoneIndex ? dropzoneIndex - 1 : dropzoneIndex), itemObject);
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

	function updateTextSelection()
	{
		// Add selected items to input field

		// Local flag controlling event behaviour - whether to fire OnInputChanged
		// when programmatically updating input with selection text or not.
		// Some developers want OnInputChanged fired always, while others only
		// expect it to fire when the user enters a value, or when SetInputValue(..)
		// is called from external code.
		// True		= Always fire OnInputChanged.
		// False	= Only fire when user enters a value or when SetInputValue(..) is
		//            called. Do not fire OnInputChanged when TextSelection is updated.
		var fireOnInputChangedEvent = false;

		// If fireOnInputChangedEvent is false:
		// Notice that in TextSelectionMode with fireOnInputChangedEvent=false the input field
		// handles two states: The value set by TextSelectionMode, and the value set by
		// either the user or a call to SetInputValue(..).
		// Therefore, even when a text selection is set, the input field will still be
		// considered empty in regards to how OnInputChanged fires.
		// So an actual value has to be entered for OnInputChanged to fire.
		// Clearing the text selection will not fire OnInputChanged since it is already
		// considered empty.

		if (fireOnInputChangedEvent === false && prevValue !== "")
		{
			// User entered a value which will now be removed and replaced.
			// Make sure OnInputChanged handlers are fired - this is the same
			// behaviour as in the ordinary visual selection mode
			// which also clears the input once a selection is made.
			me.ClearInput();
		}

		// Convert selected items to text

		var text = "";

		if (textSelectionCallback !== null)
		{
			text = textSelectionCallback(me);
		}
		else
		{
			var selections = me.GetSelections();

			Fit.Array.ForEach(selections, function(selection)
			{
				text += (text !== "" ? ", " : "") + selection.Title;
			});

			if (me.MultiSelectionMode() === true && selections.length > 0)
			{
				text = "(" + selections.length + ") " + text;
			}
		}

		// Set new text selection

		if (fireOnInputChangedEvent === true)
		{
			//me.SetInputValue(text); // Notice: SetInputValue fires OnInputChanged event
			if (txtPrimary.value !== text)
			{
				txtPrimary.value = text;
				prevValue = text;
				fireOnInputChanged(text);
			}
		}
		else
		{
			txtPrimary.value = text;
		}

		prevTextSelection = (text !== "" ? text : null);

		// Set cursor position

		// Make cursor move to end and scroll it into view.
		// Unfortunately it will not make the field scroll to the right on IE
		// and Edge, and it seems very difficult (impossible?) to get working.
		// Other similar controls simply clear their selection when opened, and
		// restore it when closed, which might be the only way to ensure the
		// same experience across all browsers.
		/*if (me.Focused() === true)
		{
			txtPrimary.blur();
			txtPrimary.focus();
		}*/

		// Make cursor move to beginning of input field if focused
		if (me.Focused() === true)
		{
			Fit.Dom.SetCaretPosition(txtPrimary, 0);
		}

		// Remove placeholder in case it was added using this._internal.ClearInputForSearch()

		updatePlaceholder(true);

		// Have TextSelection removed when input is changed

		clearTextSelectionOnInputChange = true;
	}

	function updateInvalidMessageForSelectedItems()
	{
		Fit.Array.ForEach(itemCollection, function(key)
		{
			var selection = itemCollection[key];

			if (selection.Valid === false)
			{
				Fit.Dom.Attribute(selection.DomElement, "title", invalidMessage);
			}
		});
	}

	function localize()
	{
		if (invalidMessageChanged === false)
		{
			var locale = Fit.Internationalization.GetLocale(me);
			invalidMessage = locale.Translations.InvalidSelection;

			updateInvalidMessageForSelectedItems();
		}
	}

	// Event dispatchers

	function fireOnInputChanged(val)
	{
		Fit.Validation.ExpectString(val);

		updatePlaceholder();

		Fit.Array.ForEach(onInputChangedHandlers, function(handler)
		{
			handler(me, val);
		});
	}

	function fireOnChange()
	{
		updatePlaceholder();
		optimizeDropDownPosition();
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
