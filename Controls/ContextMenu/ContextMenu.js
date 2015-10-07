/// <container name="Fit.Controls.ContextMenu">
/// 	ContextMenu control allowing for quick access to select features.
/// </container>

/// <function container="Fit.Controls.ContextMenu" name="ContextMenu" access="public">
/// 	<description> Create instance of ContextMenu control </description>
/// </function>
Fit.Controls.ContextMenu = function()
{
	var me = this;
	var tree = new Fit.Controls.TreeView("ContextMenuTreeView_" + Fit.Data.CreateGuid());
	var prevFocused = null;

	var onShowing = [];
	var onShown = [];
	var onHide = [];
	var onSelect = [];

	// ============================================
	// Init
	// ============================================

	function init()
	{
		//tree.RemoveCssClass("FitUiControlTreeView");
		tree.AddCssClass("FitUiControlContextMenu");
		tree.Selectable(true);

		// Allow context menu to be closed using ESC key

		Fit.Events.AddHandler(tree.GetDomElement(), "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			if (ev.keyCode === 27) // Escape
			{
				// Hide context menu
				me.Hide();

				// Return focus to previously focused element
				if (prevFocused !== null)
				{
					prevFocused.focus();
					prevFocused = null;
				}
			}
		});

		// Have OnSelect fire when TreeView node is selected

		tree.OnSelected(function(sender, node)
		{
			if (node.Selected() === false) // Another node may have been selected without navigating away - skip this event for deselected node when new selection is made
				return;

			fireEventHandlers(onSelect, node.GetDomElement()._internal.ContextMenuItem);

			me.Hide();
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.ContextMenu" name="Show" access="public">
	/// 	<description> Make context menu show up. If X,Y coordinates are not specified, the position of the mouse pointer will be used. </description>
	/// 	<param name="x" type="integer" default="undefined"> If defined, context menu will open at specified horizontal position </param>
	/// 	<param name="y" type="integer" default="undefined"> If defined, context menu will open at specified vertical position </param>
	/// </function>
	this.Show = function(x, y)
	{
		Fit.Validation.ExpectInteger(x, true);
		Fit.Validation.ExpectInteger(y, true);

		// Fire OnShowing event

		if (fireEventHandlers(onShowing) === false)
			return;

		// Close context menu if one is already open

		if (Fit._internal.ContextMenu.Current !== null && Fit._internal.ContextMenu.Current !== me && Fit._internal.ContextMenu.Current.IsVisible() === true)
		{
			Fit._internal.ContextMenu.Current.Hide();
			Fit._internal.ContextMenu.Current = null;
		}

		// Set position

		var pos = Fit.Events.GetPointerState().Coordinates.Document;

		var posX = ((Fit.Validation.IsSet(x) === true) ? x : pos.X);
		var posY = ((Fit.Validation.IsSet(y) === true) ? y : pos.Y);

		tree.GetDomElement().style.left = posX + "px";
		tree.GetDomElement().style.top = posY + "px";
		tree.GetDomElement().style.width = "auto"; // TreeView.Width(val, unit) cannot be used to set width:auto

		// Add to DOM

		if (me.IsVisible() === false) // Only append to DOM once - ContextMenu may have been rooted elsewhere by external code
		{
			Fit.Dom.Add(document.body, tree.GetDomElement());
			Fit._internal.ContextMenu.Current = me;
		}

		// Focus context menu

		me.Focused(true);

		// Fire OnShown event

		fireEventHandlers(onShown);
	}

	/// <function container="Fit.Controls.ContextMenu" name="Hide" access="public">
	/// 	<description> Hide context menu </description>
	/// </function>
	this.Hide = function()
	{
		if (me.IsVisible() === true)
		{
			Fit.Dom.Remove(tree.GetDomElement());
			fireEventHandlers(onHide);
		}
	}

	/// <function container="Fit.Controls.ContextMenu" name="IsVisible" access="public" returns="boolean">
	/// 	<description> Get value indicating whether context menu is visible or not </description>
	/// </function>
	this.IsVisible = function()
	{
		return (tree.GetDomElement().parentElement !== null);
	}

	/// <function container="Fit.Controls.ContextMenu" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing context menu </description>
	/// </function>
	this.GetDomElement = function()
	{
		return tree.GetDomElement();
	}

	/// <function container="Fit.Controls.ContextMenu" name="AddChild" access="public">
	/// 	<description> Add item to ContextMenu </description>
	/// 	<param name="item" type="Fit.Controls.ContextMenu.Item"> Item to add </param>
	/// </function>
	this.AddChild = function(item)
	{
		Fit.Validation.ExpectInstance(item, Fit.Controls.ContextMenu.Item);

		var tvNode = item.GetDomElement()._internal.Node;
		tree.AddChild(tvNode);
	}

	/// <function container="Fit.Controls.ContextMenu" name="RemoveChild" access="public">
	/// 	<description> Remove item from ContextMenu </description>
	/// 	<param name="item" type="Fit.Controls.ContextMenu.Item"> Item to remove </param>
	/// </function>
	this.RemoveChild = function(item)
	{
		Fit.Validation.ExpectInstance(item, Fit.Controls.ContextMenu.Item);

		var tvNode = tree.GetChild(item.Value());

		if (tvNode !== null)
			tree.RemoveChild(tvNode);
	}

	/// <function container="Fit.Controls.ContextMenu" name="RemoveAllChildren" access="public">
	/// 	<description> Remove all items contained in ContextMenu </description>
	/// 	<param name="dispose" type="boolean" default="false"> Set True to dispose items </param>
	/// </function>
	this.RemoveAllChildren = function(dispose)
	{
		Fit.Validation.ExpectBoolean(dispose, true);
		tree.RemoveAllChildren(dispose);
	}

	/// <function container="Fit.Controls.ContextMenu" name="GetChild" access="public" returns="Fit.Controls.ContextMenu.Item">
	/// 	<description> Get item by value - returns Null if not found </description>
	/// 	<param name="val" type="string"> Item value </param>
	/// 	<param name="recursive" type="boolean" default="false"> If defined, True enables recursive search </param>
	/// </function>
	this.GetChild = function(val, recursive)
	{
		Fit.Validation.ExpectString(val);
		Fit.Validation.ExpectBoolean(recursive, true);

		var tvNode = tree.GetChild(val, recursive);

		if (tvNode === null)
			return null;

		return tvNode.GetDomElement()._internal.ContextMenuItem;
	}

	/// <function container="Fit.Controls.ContextMenu" name="GetChildren" access="public" returns="Fit.Controls.ContextMenu.Item[]">
	/// 	<description> Get all children </description>
	/// </function>
	this.GetChildren = function()
	{
		var items = [];

		Fit.Array.ForEach(tree.GetChildren(), function(tvNode)
		{
			Fit.Array.Add(items, tvNode.GetDomElement()._internal.ContextMenuItem);
		});

		return items;
	}

	/// <function container="Fit.Controls.ContextMenu" name="Focused" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control has focus </description>
	/// 	<param name="value" type="boolean" default="undefined"> If defined, True assigns focus, False removes focus (blur) </param>
	/// </function>
	this.Focused = function(value)
	{
		Fit.Validation.ExpectBoolean(value, true);

		if (Fit.Validation.IsSet(value) === true)
		{
			prevFocused = document.activeElement;
		}

		return tree.Focused(value);
	}

	/// <function container="Fit.Controls.ContextMenu" name="Dispose" access="public">
	/// 	<description> Destroys component to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		tree.Dispose();
		tree = prevFocused = onShowing = onShown = onHide = onSelect = null;
	}

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.ContextMenu" name="OnShowing" access="public">
	/// 	<description>
	/// 		Add event handler fired before context menu is shown.
	/// 		This event can be canceled by returning False.
	/// 		Function receives one argument: Sender (Fit.Controls.ContextMenu).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnShowing = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onShowing, cb);
	}

	/// <function container="Fit.Controls.ContextMenu" name="OnShown" access="public">
	/// 	<description>
	/// 		Add event handler fired when context menu is shown.
	/// 		Function receives one argument: Sender (Fit.Controls.ContextMenu).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnShown = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onShown, cb);
	}

	/// <function container="Fit.Controls.ContextMenu" name="OnHide" access="public">
	/// 	<description>
	/// 		Add event handler fired when context menu is hidden.
	/// 		Function receives one argument: Sender (Fit.Controls.ContextMenu).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnHide = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onHide, cb);
	}

	/// <function container="Fit.Controls.ContextMenu" name="OnHide" access="public">
	/// 	<description>
	/// 		Add event handler fired when an item is selected in context menu.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.ContextMenu) and Item (Fit.Controls.ContextMenu.Item).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnSelect = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelect, cb);
	}

	// ============================================
	// Private
	// ============================================

	this._internal = (this._internal ? this._internal : {});

	this._internal.FireOnShowing = function()
	{
		return fireEventHandlers(onShowing);
	}
	this._internal.FireOnShown = function()
	{
		fireEventHandlers(onShown);
	}
	this._internal.FireOnHide = function()
	{
		fireEventHandlers(onHide);
	}
	this._internal.FireOnSelect = function()
	{
		fireEventHandlers(onSelect);
	}

	function fireEventHandlers(handlers, item) // Notice: item variable only provided for OnSelect event
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (cb(me, item) === false)
				cancel = true; // Do NOT cancel loop though! All handlers must be fired!
		});

		return !cancel;
	}

	init();
}

/// <function container="Fit.Controls.ContextMenu.Item" name="Item" access="public">
/// 	<description> Create instance of ContextMenu Item </description>
/// 	<param name="displayTitle" type="string"> Item title </param>
/// 	<param name="itemValue" type="string"> Item value </param>
/// </function>
Fit.Controls.ContextMenu.Item = function(displayTitle, itemValue)
{
	Fit.Validation.ExpectString(displayTitle);
	Fit.Validation.ExpectString(itemValue);

	var me = this;
	var node = new Fit.Controls.TreeView.Node(displayTitle, itemValue);

	// ============================================
	// Init
	// ============================================

	function init()
	{
		node.GetDomElement()._internal.ContextMenuItem = me;
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.ContextMenu.Node" name="Title" access="public" returns="string">
	/// 	<description> Get/set item title </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, item title is updated </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);
		return node.Title(val);
	}

	/// <function container="Fit.Controls.ContextMenu.Node" name="Value" access="public" returns="string">
	/// 	<description> Get item value </description>
	/// </function>
	this.Value = function()
	{
		return node.Value();
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="Selectable" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether item is selectable or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables item, False disables it </param>
	/// </function>
	this.Selectable = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);
		return node.Selectable(val);
	}

	/// <function container="Fit.Controls.ContextMenu" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing context menu </description>
	/// </function>
	this.GetDomElement = function()
	{
		return node.GetDomElement();
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="AddChild" access="public">
	/// 	<description> Add child item </description>
	/// 	<param name="item" type="Fit.Controls.ContextMenu.Item"> Item to add </param>
	/// </function>
	this.AddChild = function(item)
	{
		Fit.Validation.ExpectInstance(item, Fit.Controls.ContextMenu.Item);

		var tvNode = item.GetDomElement()._internal.Node;
		node.AddChild(tvNode);
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="RemoveChild" access="public">
	/// 	<description> Remove child item </description>
	/// 	<param name="item" type="Fit.Controls.ContextMenu.Item"> Item to remove </param>
	/// </function>
	this.RemoveChild = function(item)
	{
		Fit.Validation.ExpectInstance(item, Fit.Controls.ContextMenu.Item);

		var tvNode = node.GetChild(item.Value());

		if (tvNode !== null)
			node.RemoveChild(tvNode);
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="GetChild" access="public" returns="Fit.Controls.ContextMenu.Item">
	/// 	<description> Get item by value - returns Null if not found </description>
	/// 	<param name="val" type="string"> Item value </param>
	/// 	<param name="recursive" type="boolean" default="false"> If defined, True enables recursive search </param>
	/// </function>
	this.GetChild = function(val, recursive)
	{
		Fit.Validation.ExpectString(val);
		Fit.Validation.ExpectBoolean(recursive, true);

		var tvNode = node.GetChild(val, recursive);

		if (tvNode === null)
			return null;

		return tvNode.GetDomElement()._internal.ContextMenuItem;
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="GetChildren" access="public" returns="Fit.Controls.ContextMenu.Item[]">
	/// 	<description> Get all children </description>
	/// </function>
	this.GetChildren = function()
	{
		var items = [];

		Fit.Array.ForEach(node.GetChildren(), function(tvNode)
		{
			Fit.Array.Add(items, tvNode.GetDomElement()._internal.ContextMenuItem);
		});

		return items;
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="Dispose" access="public">
	/// 	<description> Destroys item to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		node.Dispose();
		node = null;
	}

	init();
}

// Internals

Fit._internal.ContextMenu = {};
Fit._internal.ContextMenu.Current = null;

// Event handler responsible for closing context menu when clicking outside of context menu

Fit.Events.OnReady(function()
{
	Fit.Events.AddHandler(document, "click", function(e)
	{
		var target = Fit.Events.GetTarget(e);
		var ctx = Fit._internal.ContextMenu.Current;

		if (ctx === null || target === ctx.GetDomElement() || Fit.Dom.Contained(ctx.GetDomElement(), target) === true)
			return;

		ctx.Hide();
	});

	/*Fit.Events.AddHandler(document, "mousewheel", function(e) // Close ContextMenu when scrolling
	{
		if (Fit._internal.ContextMenu.Current !== null)
			Fit._internal.ContextMenu.Current.Hide();
	});*/
});
