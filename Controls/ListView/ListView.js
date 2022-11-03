/// <container name="Fit.Controls.ListView" extends="Fit.Controls.PickerBase;Fit.Controls.Component">
/// 	Picker control which allows for entries
/// 	to be selected in the DropDown control.
/// </container>

/// <function container="Fit.Controls.ListView" name="ListView" access="public">
/// 	<description> Create instance of ListView control </description>
/// 	<param name="controlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.ListView = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);
	Fit.Core.Extend(this, Fit.Controls.PickerBase).Apply();
	Fit.Core.Extend(this, Fit.Controls.Component).Apply(controlId);

	var me = this;
	var list = me.GetDomElement();
	var items = {}; // {[key:string]: { Title: string, Value: string, DomElement: Element }}
	var active = null;
	var persistView = false;
	var scrollPositionTop = 0;
	var highlightFirst = false;
	var firstWasHighlighted = false;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	var onSelectHandlers = [];
	var onSelectedHandlers = [];

	function init()
	{
		list.tabIndex = "0";
		Fit.Dom.AddClass(list, "FitUiControlListView");

		me.OnShow(function()
		{
			if (persistView === false) // Reset selection and scroll position
			{
				if (highlightFirst === true)
				{
					focusFirstItem();
				}
				else
				{
					setActive(null);
				}

				list.scrollTop = 0;
			}
			else // View persisted
			{
				if (highlightFirst === true && firstWasHighlighted === false)
				{
					focusFirstItem();
					firstWasHighlighted = true;
				}

				list.scrollTop = scrollPositionTop;
			}
		});

		list.onscroll = function(e)
		{
			// Preserve scroll position which is lost if picker control is removed from DOM
			scrollPositionTop = list.scrollTop;
		};

		list.onclick = function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			var elm = Fit.Events.GetTarget(e);

			if (elm === list)
				return;

			while (elm.parentElement !== list)
				elm = elm.parentElement;

			setActive(elm, true); // true = do not scroll into view - it already is

			// Fire OnChanging and OnChange events

			var item = getItem(getItemValueFromElement(elm));
			var selectionCanceled = fireOnSelectHandlers(item) === false;

			// Notice: We always pass False as current selection state to OnItemSelectionChanging since ListView does
			// not keep track of selection state. In theory item could very well already be selected in host control.
			// Event handlers should not trust boolean to reveal selection in host control, only in picker.
			if (selectionCanceled === false && me._internal.FireOnItemSelectionChanging(item.Title, item.Value, false, false) === true)
			{
				fireOnSelectedHandlers(item);

				me._internal.FireOnItemSelectionChanged(item.Title, item.Value, true, false);
				me._internal.FireOnItemSelectionComplete();
			}
		}

		list.onfocus = function(e)
		{
			me._internal.FireOnFocusIn(); // Fire OnFocusIn on PickerBase

			// Skip if this was a mouse click, leave handling to OnClick which fires after OnFocus.
			// Notice that Fit.Events.GetPointerState() is used to determine whether mouse button
			// is active since this information is not accessible through Event instance passed in OnFocus.
			if (Fit.Events.GetPointerState().Buttons.Primary === true)
				return;

			// Implemented Tab and Shift+Tab support below rather than using built-in support to prevent
			// the need for an OnFocus event handler on every single item contained, which would otherwise
			// be necessary to intercept focus and make element active.

			if (Fit.Events.GetModifierKeys().Shift === true) // Shift+Tab: Navigate up/backwards
			{
				if (list.children.length > 0)
					setActive(list.children[list.children.length - 1]);
			}
			else // Tab: Navigate down/forward
			{
				if (list.children.length > 0)
					setActive(list.children[0]);
			}
		}

		list.onblur = function(e)
		{
			setActive(null);
			me._internal.FireOnFocusOut(); // Fire OnFocusOut on PickerBase
		}

		list.onkeydown = function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			// Handle Tab navigation manually to prevent the need to
			// implement a onfocus handler on every single item, responsible
			// for selecting an item when it gains focus.

			if (ev.keyCode === 9 && ev.shiftKey === false) // Tab
			{
				if (active !== list.children[list.children.length - 1])
				{
					moveDown();

					// Prevent native tab navigation from moving focus to next focusable element
					Fit.Events.PreventDefault(ev);
					return false;
				}
			}
			else if (ev.keyCode === 9 && ev.shiftKey === true) // Shift + Tab
			{
				if (active !== list.firstChild)
				{
					moveUp();

					// Prevent native tab navigation from moving focus to any focusable element above
					Fit.Events.PreventDefault(ev);
					return false;
				}
			}
			else
			{
				me.HandleEvent(ev); // Handle arrow up/down and enter
			}
		}
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.ListView" name="AddItem" access="public">
	/// 	<description> Add item to ListView </description>
	/// 	<param name="itemTitle" type="string"> Item title </param>
	/// 	<param name="itemValue" type="string"> Item value </param>
	/// </function>
	/// <function container="Fit.Controls.ListView" name="AddItem" access="public">
	/// 	<description> Add item to ListView </description>
	/// 	<param name="item" type="{ Title: string, Value: string, Description?: string }"> Item to add </param>
	/// </function>
	this.AddItem = function(itemTitle, itemValue)
	{
		var title = "";
		var value = "";
		var description = undefined;

		if (arguments.length === 1)
		{
			var item = arguments[0];

			Fit.Validation.ExpectObject(item);

			title = item.Title;
			value = item.Value;
			description = item.Description;
		}
		else
		{
			title = itemTitle;
			value = itemValue;
		}

		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectString(description, true);

		var entry = document.createElement("div");

		items[value] = { Title: title, Value: value, DomElement: entry };

		if (Fit.Validation.IsSet(description) === true)
		{
			title += "<div class='FitUiControlListViewItemDescription'>" + item.Description + "</div>";
		}

		entry.innerHTML = title;
		Fit.Dom.Data(entry, "value", encode(value));
		Fit.Dom.Data(entry, "active", "false");

		list.appendChild(entry);
	}

	/// <container name="Fit.Controls.ListViewTypeDefs.ListViewItem">
	/// 	<description> ListView item </description>
	/// 	<member name="Title" type="string"> Item title </member>
	/// 	<member name="Value" type="string"> Unique item value </member>
	/// </container>

	/// <function container="Fit.Controls.ListView" name="GetItem" access="public" returns="Fit.Controls.ListViewTypeDefs.ListViewItem | null">
	/// 	<description> Get item by value - returns object with Title (string) and Value (string) properties if found, otherwise Null </description>
	/// 	<param name="value" type="string"> Value of item to retrieve </param>
	/// </function>
	this.GetItem = function(value)
	{
		Fit.Validation.ExpectString(value);
		return getItem(value);
	}

	/// <function container="Fit.Controls.ListView" name="GetItems" access="public" returns="Fit.Controls.ListViewTypeDefs.ListViewItem[]">
	/// 	<description> Get all items - returns array containing objects with Title (string) and Value (string) properties </description>
	/// </function>
	this.GetItems = function()
	{
		return getItems();
	}

	/// <function container="Fit.Controls.ListView" name="HasItem" access="public" returns="boolean">
	/// 	<description> Returns value indicating whether control contains item with specified value </description>
	/// 	<param name="value" type="string"> Value of item to check for </param>
	/// </function>
	this.HasItem = function(value)
	{
		Fit.Validation.ExpectString(value);
		return items[value] !== undefined;
	}

	/// <function container="Fit.Controls.ListView" name="RemoveItem" access="public">
	/// 	<description> Remove item from ListView </description>
	/// 	<param name="value" type="string"> Value of item to remove </param>
	/// </function>
	this.RemoveItem = function(value)
	{
		Fit.Validation.ExpectString(value);

		var item = items[value] || null;

		if (item !== null)
		{
			Fit.Dom.Remove(item.DomElement);
			delete items[value];

			if (item.DomElement === active)
			{
				active = null;
			}
		}
	}

	/// <function container="Fit.Controls.ListView" name="RemoveItems" access="public">
	/// 	<description> Remove all items from ListView </description>
	/// </function>
	this.RemoveItems = function()
	{
		list.innerHTML = "";
		items = {};
		setActive(null);
	}

	// ============================================
	// PickerBase interface
	// ============================================

	this.GetItemByValue = function(val)
	{
		Fit.Validation.ExpectString(val);
		return me.GetItem(val);
	}

	this.RevealItemInView = function(val)
	{
		Fit.Validation.ExpectString(val);

		var item = items[val] || null;

		if (item !== null)
		{
			setActive(item.DomElement);
		}
	}

	this.HandleEvent = function(e)
	{
		Fit.Validation.ExpectEvent(e, true);

		var ev = Fit.Events.GetEvent(e);

		if (ev.type === "keydown")
		{
			if (ev.keyCode === 38) // arrow up
			{
				moveUp();

				// Prevent scrollable div from scrolling up
				Fit.Events.PreventDefault(ev);
			}
			else if (ev.keyCode === 40) // arrow down
			{
				moveDown();

				// Prevent scrollable div from scrolling down
				Fit.Events.PreventDefault(ev);
			}
			else if (ev.keyCode === 13) // enter
			{
				if (active === null && list.children.length === 1)
					moveDown(); // Select first item if no item is selected

				if (active !== null)
				{
					var item = getItem(getItemValueFromElement(active));
					var selectionCanceled = fireOnSelectHandlers(item) === false;

					// Notice: We always pass False as current selection state to OnItemSelectionChanging since ListView does
					// not keep track of selection state. In theory item could very well already be selected in host control.
					// Event handlers should not trust boolean to reveal selection in host control, only in picker.
					if (selectionCanceled === false && me._internal.FireOnItemSelectionChanging(item.Title, item.Value, false, false) === true)
					{
						fireOnSelectedHandlers(item);

						me._internal.FireOnItemSelectionChanged(item.Title, item.Value, true, false);
						me._internal.FireOnItemSelectionComplete();
					}
				}

				// Prevent form submit
				Fit.Events.PreventDefault(ev);
			}
		}
	}

	this.GetHighlighted = function()
	{
		if (active !== null)
		{
			return getItem(getItemValueFromElement(active));
		}

		return null;
	}

	this.PersistView = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && val !== persistView)
		{
			persistView = val;
			scrollPositionTop = 0;
		}

		return persistView;
	}

	this.HighlightFirst = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val !== highlightFirst)
			{
				highlightFirst = val;
				firstWasHighlighted = false;
			}

			// Allow external code to force focus first item if picker is visible.
			// Usually first item is automatically highlighted when the host control
			// is opened (see OnShow handler in init()).
			if (val === true && Fit.Dom.IsVisible(me.GetDomElement()) === true)
			{
				focusFirstItem();
				firstWasHighlighted = true;
			}
		}

		return highlightFirst;
	}

	/// <function container="Fit.Controls.ListViewTypeDefs" name="OnSelectEventHandler" returns="boolean | void">
	/// 	<description> OnSelect event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="item" type="{ Title: string, Value: string }"> Selected item </param>
	/// </function>

	/// <function container="Fit.Controls.ListView" name="OnSelect" access="public">
	/// 	<description>
	/// 		Register event handler fired when item is being selected.
	/// 		Selection can be canceled by returning False.
	/// 		The following arguments are passed to event handler function:
	/// 		Sender (ListView) and Item (with Title (string) and Value (string) properties).
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.ListViewTypeDefs.OnSelectEventHandler"> Event handler function </param>
	/// </function>
	this.OnSelect = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectHandlers, cb);
	}

	/// <function container="Fit.Controls.ListViewTypeDefs" name="OnSelectedEventHandler">
	/// 	<description> OnSelected event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="item" type="{ Title: string, Value: string }"> Selected item </param>
	/// </function>

	/// <function container="Fit.Controls.ListView" name="OnSelected" access="public">
	/// 	<description>
	/// 		Register event handler fired when item is selected.
	/// 		The following arguments are passed to event handler function:
	/// 		Sender (ListView) and Item (with Title (string) and Value (string) properties).
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.ListViewTypeDefs.OnSelectedEventHandler"> Event handler function </param>
	/// </function>
	this.OnSelected = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectedHandlers, cb);
	}

	this.Destroy = Fit.Core.CreateOverride(this.Destroy, function(calledInternally)
	{
		Fit.Validation.ExpectBoolean(calledInternally, true);

		// This will destroy control - it will no longer work!

		if (calledInternally !== true)
		{
			me.Dispose(true); // Component.Dispose()
		}

		base(); // PickerBase.Destroy()
	});

	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function(calledInternally)
	{
		Fit.Validation.ExpectBoolean(calledInternally, true);

		base(); // Component.Dispose()

		if (calledInternally !== true)
		{
			me.Destroy(true); // PickerBase.Destroy()
		}

		me = list = items = active = persistView = scrollPositionTop = highlightFirst = firstWasHighlighted = isIe8 = onSelectHandlers = onSelectedHandlers = null;
	});

	// ============================================
	// Protected
	// ============================================

	this._internal = (this._internal ? this._internal : {});

	this._internal.FocusFirstItem = function() // Similar implementation in Fit.Controls.TreeView._internal.FocusFirstNode()
	{
		// If picker is still visible (it might have been hidden if user closed
		// host control while data was being loaded/populated async.) then focus first item.
		if (Fit.Dom.IsVisible(me.GetDomElement()) === true)
		{
			focusFirstItem();
			firstWasHighlighted = true;
		}
	}

	// ============================================
	// Private
	// ============================================

	function getItem(value)
	{
		Fit.Validation.ExpectString(value);
		return (items[value] && { Title: items[value].Title, Value: items[value].Value }) || null;
	}

	function getItems()
	{
		var returnItems = [];

		Fit.Array.ForEach(items, function(itemValue)
		{
			Fit.Array.Add(returnItems, getItem(itemValue));
		});

		return returnItems;
	}

	function getItemValueFromElement(elm)
	{
		Fit.Validation.ExpectDomElement(elm);
		return decode(Fit.Dom.Data(elm, "value"));
	}

	function setActive(elm, suppressScrollIntoView)
	{
		Fit.Validation.ExpectDomElement(elm, true);
		Fit.Validation.ExpectBoolean(suppressScrollIntoView, true);

		if (active !== null)
			Fit.Dom.Data(active, "active", "false");

		active = (elm ? elm : null);

		if (active !== null)
		{
			Fit.Dom.Data(active, "active", "true");

			if (suppressScrollIntoView !== true)
			{
				list.scrollTop = active.offsetTop; // Alternative to active.scrollIntoView(true) which unfortunately also scrolls main view - scrollable container must be positioned for offsetTop to work properly!
				repaint();
			}
		}
	}

	function focusFirstItem()
	{
		if (list.children.length > 0)
		{
			setActive(list.children[0]);
		}
	}

	function moveUp()
	{
		if (list.children.length === 0)
			return;

		// Select item

		if (active === null) // Select first entry if no selection is made
		{
			setActive(list.firstChild);
		}
		else if (active.previousSibling !== null) // Select previous entry if available
		{
			setActive(active.previousSibling);
		}
	}

	function moveDown()
	{
		if (list.children.length === 0)
			return;

		// Select item

		if (active === null) // Select first entry if no selection is made
		{
			setActive(list.firstChild);
		}
		else if (active.nextSibling !== null) // Select next entry if available
		{
			setActive(active.nextSibling);
		}
	}

	function fireOnSelectHandlers(item)
	{
		Fit.Validation.ExpectObject(item);
		Fit.Validation.ExpectString(item.Title);
		Fit.Validation.ExpectString(item.Value);

		var selectionCanceled = false;

		Fit.Array.ForEach(onSelectHandlers, function(handler)
		{
			if (handler(me, item) === false)
			{
				selectionCanceled = true;
			}
		});

		return selectionCanceled === true ? false : true; // Return False if canceled
	}

	function fireOnSelectedHandlers(item)
	{
		Fit.Validation.ExpectObject(item);
		Fit.Validation.ExpectString(item.Title);
		Fit.Validation.ExpectString(item.Value);

		Fit.Array.ForEach(onSelectedHandlers, function(handler)
		{
			handler(me, item);
		});
	}

	function repaint()
	{
		if (isIe8 === true)
		{
			Fit.Dom.AddClass(list, "FitUi_Non_Existing_ListView_Class");
			Fit.Dom.RemoveClass(list, "FitUi_Non_Existing_ListView_Class");
		}
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

	init();
}
