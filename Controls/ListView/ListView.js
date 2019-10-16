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
	var active = null;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	function init()
	{
		list.tabIndex = "0";
		Fit.Dom.AddClass(list, "FitUiControlListView");

		me.OnShow(function()
		{
			list.scrollTop = 0;
			setActive(null);
		});

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

			// Notice: We always pass False as current selection state to OnItemSelectionChanging since ListView does
			// not keep track of selection state. In theory item could very well already be selected in host control.
			// Event handlers should not trust boolean to reveal selection in host control, only in picker.
			if (me._internal.FireOnItemSelectionChanging(Fit.Dom.Text(elm), decode(Fit.Dom.Data(elm, "value")), false) === true)
			{
				me._internal.FireOnItemSelectionChanged(Fit.Dom.Text(elm), decode(Fit.Dom.Data(elm, "value")), true);
				me._internal.FireOnItemSelectionComplete();
			}
		}

		list.onfocus = function(e)
		{
			var ev = Fit.Events.GetEvent(e);

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
	/// 	<param name="title" type="string"> Item title </param>
	/// 	<param name="value" type="string"> Item value </param>
	/// </function>
	this.AddItem = function(title, value)
	{
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);

		var entry = document.createElement("div");
		entry.innerHTML = title;
		Fit.Dom.Data(entry, "value", encode(value));
		Fit.Dom.Data(entry, "active", "false");

		list.appendChild(entry);
	}

	/// <function container="Fit.Controls.ListView" name="GetItem" access="public" returns="object">
	/// 	<description> Get item by value - returns object with Title (string) and Value (string) properties if found, otherwise Null </description>
	/// 	<param name="value" type="string"> Value of item to retrieve </param>
	/// </function>
	this.GetItem = function(value)
	{
		Fit.Validation.ExpectString(value);

		var itemElm = getItemElement(value);

		if (itemElm !== null)
		{
			return convertItemElementToObject(itemElm);
		}

		return null;
	}

	/// <function container="Fit.Controls.ListView" name="HasItem" access="public" returns="boolean">
	/// 	<description> Returns value indicating whether control contains item with specified value </description>
	/// 	<param name="value" type="string"> Value of item to check for </param>
	/// </function>
	this.HasItem = function(value)
	{
		Fit.Validation.ExpectString(value);
		return getItemElement(value) !== null;

		/*var exists = false;

		Fit.Array.ForEach(list.children, function(child)
		{
			if (decode(Fit.Dom.Data(child, "value")) === value)
			{
				exists = true;
				return false;
			}
		});

		return exists;*/
	}

	/// <function container="Fit.Controls.ListView" name="RemoveItem" access="public">
	/// 	<description> Remove item from ListView </description>
	/// 	<param name="value" type="string"> Value of item to remove </param>
	/// </function>
	this.RemoveItem = function(value)
	{
		Fit.Validation.ExpectString(value);

		var item = getItemElement(value);

		if (item !== null)
		{
			Fit.Dom.Remove(item);
		}

		/*Fit.Array.ForEach(Fit.Array.Copy(list.children), function(child)
		{
			if (decode(Fit.Dom.Data(child, "value")) === value)
			{
				Fit.Dom.Remove(child);
				return false;
			}
		});*/
	}

	/// <function container="Fit.Controls.ListView" name="RemoveItems" access="public">
	/// 	<description> Remove all items from ListView </description>
	/// </function>
	this.RemoveItems = function()
	{
		list.innerHTML = "";
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

		var itemElm = getItemElement(val);

		if (itemElm !== null)
		{
			setActive(itemElm);
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
					// Notice: We always pass False as current selection state to OnItemSelectionChanging since ListView does
					// not keep track of selection state. In theory item could very well already be selected in host control.
					// Event handlers should not trust boolean to reveal selection in host control, only in picker.
					if (me._internal.FireOnItemSelectionChanging(Fit.Dom.Text(active), decode(Fit.Dom.Data(active, "value")), false) === true)
					{
						me._internal.FireOnItemSelectionChanged(Fit.Dom.Text(active), decode(Fit.Dom.Data(active, "value")), true);
						me._internal.FireOnItemSelectionComplete();
					}
				}

				// Prevent form submit
				Fit.Events.PreventDefault(ev);
            }
        }
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

		me = list = active = isIe8 = null;
	});

    // ============================================
	// Private
	// ============================================

	function getItemElement(value)
	{
		Fit.Validation.ExpectString(value);

		var found = null;

		Fit.Array.ForEach(list.children, function(child)
		{
			if (decode(Fit.Dom.Data(child, "value")) === value)
			{
				found = child;
				return false;
			}
		});

		return found;
	}

	function convertItemElementToObject(elm)
	{
		Fit.Validation.ExpectDomElement(elm);
		return { Title: Fit.Dom.Text(elm), Value: Fit.Dom.Data(elm, "value") }; // Using Text(..) to get rid of HTML formatting
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
				list.scrollTop = active.offsetHeight * Fit.Dom.GetIndex(active); // Alternative to active.scrollIntoView(true) which unfortunately also scrolls main view
				repaint();
			}
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
