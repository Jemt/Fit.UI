/// <container name="Fit.Controls.ListView">
/// 	Picker control which allows for entries
/// 	to be selected in the DropDown control.
/// </container>

/// <function container="Fit.Controls.ListView" name="ListView" access="public">
/// 	<description> Create instance of ListView control </description>
/// </function>
Fit.Controls.ListView = function()
{
	Fit.Core.Extend(this, Fit.Controls.PickerBase).Apply();

	var me = this;
	var list = null;
	var active = null;
    var onSelectedHandlers = [];
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	function init()
	{
		list = document.createElement("div");
		list.tabIndex = "0";
		Fit.Dom.AddClass(list, "FitUiControlListView");

		me.MaxHeight(150, "px");

		list.onclick = function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			var elm = Fit.Events.GetTarget(e);

			if (elm === list)
				return;

			while (elm.parentElement !== list)
				elm = elm.parentElement;

			setActive(elm, true);
		}

		list.onfocus = function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			if (Fit.Events.GetPointerState().Buttons.Primary === true)
				return; // This was a mouse click, leave handling to OnClick which fires after OnFocus

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

					// Prevent native tab navigation from moving focus to previous focusable element
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
	/// 	<param name="node" type="Fit.Controls.ListView.Item"> Item to add </param>
	/// </function>
	this.AddItem = function(item)
	{
		Fit.Validation.ExpectInstance(item, Fit.Controls.ListView.Item);

		var entry = document.createElement("div");
		entry.innerHTML = item.Title();
		Fit.Dom.Data(entry, "value", item.Value());
		Fit.Dom.Data(entry, "active", "false");

		if (item.Selected() === true)
			fireOnSelected(Fit.Dom.Text(entry), Fit.Dom.Data(entry, "value"));

		list.appendChild(entry);
	}

	// ============================================
	// PickerBase interface
	// ============================================

	this.GetDomElement = function()
	{
		return list;
	}

	this.MaxHeight = function (height, unit)
    {
		Fit.Validation.ExpectNumber(height, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(height) === true)
		{
			list.style.maxHeight = height + ((Fit.Validation.IsSet(unit) === true) ? unit : "px");
		}

		var res = { Value: parseInt(list.style.maxHeight), Unit: "px" };
		res.Unit = list.style.maxHeight.replace(res.Value);

		return res;
    }

	this.OnSelected = function(cb)
    {
		Fit.Validation.ExpectFunction(cb);
        Fit.Array.Add(onSelectedHandlers, cb);
    }

    this.HandleEvent = function(e)
    {
		Fit.Validation.ExpectEvent(e);

        var ev = Fit.Events.GetEvent(e);

        if (ev.type === "keydown")
        {
            if (ev.keyCode === 38) // arrow up
            {
                moveUp();

				// Prevent scrollable div from scrolling up
				Fit.Events.PreventDefault(ev);
				return false;
            }
            else if (ev.keyCode === 40) // arrow down
            {
                moveDown();

				// Prevent scrollable div from scrolling down
				Fit.Events.PreventDefault(ev);
				return false;
            }
            else if (ev.keyCode === 13) // enter
            {
                if (active === null && list.children.length === 1)
					moveDown();

				if (active !== null)
					fireOnSelected(Fit.Dom.Text(active), Fit.Dom.Data(active, "value"));

				// Prevent form submit
				Fit.Events.PreventDefault(ev);
				return false;
            }
        }
    }

    // ============================================
	// Private
	// ============================================

	function setActive(elm, commitToHostControl)
	{
		Fit.Validation.ExpectDomElement(elm, true);
		Fit.Validation.ExpectBoolean(commitToHostControl, true);

		if (active !== null)
			Fit.Dom.Data(active, "active", "false");

		active = (elm ? elm : null);

		if (active !== null)
		{
			Fit.Dom.Data(active, "active", "true");

			list.scrollTop = active.offsetHeight * Fit.Dom.GetIndex(active); // Alternative to active.scrollIntoView(true) which unfortunately also scrolls main view
			repaint();

			if (commitToHostControl === true)
				fireOnSelected(Fit.Dom.Text(active), Fit.Dom.Data(active, "value"));
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

	function fireOnSelected(title, value)
	{
		Fit.Array.ForEach(onSelectedHandlers, function(cb)
		{
			cb(title, value);
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

	init();
}

/// <function container="Fit.Controls.ListView.Item" name="Item" access="public">
/// 	<description> Create instance of ListView Item </description>
/// 	<param name="itemTitle" type="string"> Node title </param>
/// 	<param name="itemValue" type="string"> Node value </param>
/// 	<param name="itemSelected" type="boolean" default="false">
/// 		Flag indicating whether item is initially selected in host control
/// 	</param>
/// </function>
Fit.Controls.ListView.Item = function(itemTitle, itemValue, itemSelected)
{
	Fit.Validation.ExpectStringValue(itemTitle);
	Fit.Validation.ExpectStringValue(itemValue);
	Fit.Validation.ExpectBoolean(itemSelected, true);

	var me = this;
	var title = itemTitle;
	var value = itemValue;
	var selected = (itemSelected === true);

	/// <function container="Fit.Controls.ListView.Item" name="Title" access="public" returns="string">
	/// 	<description> Get/Set item title </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, item title is updated </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
			title = val;

		return title;
	}

	/// <function container="Fit.Controls.ListView.Item" name="Value" access="public" returns="string">
	/// 	<description> Get/Set item value </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, item value is updated </param>
	/// </function>
	this.Value = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
			value = val;

		return value;
	}

	/// <function container="Fit.Controls.ListView.Item" name="Selected" access="public" returns="boolean">
	/// 	<description> Get/Set flag indicating whether item is initially selected in host control </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, selected state is updated </param>
	/// </function>
	this.Selected = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
			selected = val;

		return selected;
	}
}
