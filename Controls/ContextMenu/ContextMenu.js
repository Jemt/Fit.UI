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
	var detectBoundaries = true;
	var highlightOnInitKeyStroke = true;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	var onShowing = [];
	var onShown = [];
	var onHide = [];
	var onSelect = [];

	// ============================================
	// Init
	// ============================================

	function init()
	{
		Fit._internal.Core.EnsureStyles();
		
		Fit.Dom.Data(tree.GetDomElement(), "keynav", "false");				// True when navigating using keyboard
		Fit.Dom.Data(tree.GetDomElement(), "sticky", "false");				// True when user toggles node
		Fit.Dom.Data(tree.GetDomElement(), "viewportcollision", "false");	// True when context menu collides with viewport boundaries

		tree.AddCssClass("FitUiControlContextMenu");
		tree.Selectable(true);

		// Custom keyboard navigation

		tree.KeyboardNavigation(false);

		Fit.Events.AddHandler(tree.GetDomElement(), "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			if (ev.keyCode === 27) // Escape
			{
				me.Hide();

				// Return focus to previously focused element
				if (prevFocused !== null)
				{
					prevFocused.focus();
					prevFocused = null;
				}

				return;
			}

			var node = tree.GetNodeFocused();

			if (node === null) // In case context menu has no children
				return;

			if (highlightOnInitKeyStroke === true)
			{
				highlightOnInitKeyStroke = false;
				Fit.Dom.Data(tree.GetDomElement(), "keynav", "true"); // Requires repaint in Legacy IE
				repaint();

				// Make sure the first item is highlighted instead of
				// the 2nd item, in case initial keystroke was arrow down.

				if (ev.keyCode === 40 && tree.GetChildren().length > 0)
				{
					tree.GetChildren()[0].Focused(true);

					Fit.Events.PreventDefault(ev); // Prevent scrolling
					return;
				}
			}

			if (ev.keyCode === 37) // Arrow left
			{
				if (node.Expanded() === true)
				{
					node.Expanded(false);
				}
				else if (node.GetParent() !== null)
				{
					node.GetParent().Focused(true);
				}

				Fit.Events.PreventDefault(ev); // Prevent scrolling
				return;
			}

			if (ev.keyCode === 39) // Arrow right
			{
				if (node.GetChildren().length > 0)
				{
					node.Expanded(true);
					node.GetChildren()[0].Focused(true);
				}

				Fit.Events.PreventDefault(ev); // Prevent scrolling
				return;
			}

			if (ev.keyCode === 38) // Arrow up
			{
				var newNode = tree.GetNodeAbove(node);

				if (newNode !== null)
					newNode.Focused(true);

				Fit.Events.PreventDefault(ev); // Prevent scrolling
				return;
			}

			if (ev.keyCode === 40) // Arrow down
			{
				var newNode = tree.GetNodeBelow(node);

				if (newNode !== null)
					newNode.Focused(true);

				Fit.Events.PreventDefault(ev); // Prevent scrolling
				return;
			}

			if (ev.keyCode === 13) // Enter
			{
				if (node.Selectable() === true)
					node.Selected(true);

				return;
			}
		});

		// Have OnSelect fire when TreeView node is selected

		tree.OnSelected(function(sender, node)
		{
			if (node.Selected() === true) // OnSelected fires when both selecting and deselecting nodes
			{
				node.Selected(false); // Notice: Fires OnSelected again
				node.Expanded(!node.Expanded());

				// Navigate link contained in item, or fire ContextMenu.OnSelect

				var links = node.GetDomElement().getElementsByTagName("a");

				if (links.length === 1 && Fit.Dom.GetParentOfType(links[0], "li") === node.GetDomElement())
				{
					if (links[0] !== Fit.Events.GetPointerState().Target)
						links[0].click();

					me.Hide();
				}
				else
				{
					fireEventHandlers(onSelect, node.GetDomElement()._internal.ContextMenuItem);
				}
			}
		});

		// Support for sticky nodes

		tree.OnToggled(function(sender, node)
		{
			if (node.Expanded() === false) // Node collapsed
			{
				// Collapse all children
				Fit.Array.ForEach(node.GetChildren(), function(c)
				{
					c.Expanded(false); // Notice: Fires OnToggled again if node is expanded, causing all children to be collapsed recursively
				});
			}
			else // Node expanded
			{
				if (node.Focused() === true) // Prevent this from executing when recursively expanding parent nodes (see further down)
				{
					Fit.Dom.Data(tree.GetDomElement(), "sticky", "true");
					highlightOnInitKeyStroke = false;

					// Collapse previously expanded nodes

					var expanded = null;
					var currentNode = node;

					while (currentNode !== null)
					{
						if (currentNode.GetParent() !== null)
							expanded = getExpandedChild(currentNode.GetParent().GetChildren(), currentNode);
						else
							expanded = getExpandedChild(tree.GetChildren(), currentNode);

						if (expanded !== null)
						{
							expanded.Expanded(false); // Notice: Fires OnToggled again, causing all children to be collapsed recursively
							break;
						}

						currentNode = currentNode.GetParent();
					}
				}

				// Expand parent nodes to make the currently hovered hierarchy/path sticky
				if (node.GetParent() !== null)
					node.GetParent().Expanded(true); // Notice: Fires OnToggled again causing all parents to expand recursively

				// Boundary detection - detect and handle viewport collisions
				if (detectBoundaries === true)
					handleViewPortCollision(node.GetDomElement());
			}
		});

		// Boundary detection - detect and handle viewport collisions when hovering items to open submenus

		Fit.Events.AddHandler(tree.GetDomElement(), "mouseover", function(e)
		{
			if (detectBoundaries === true && Fit.Dom.Data(tree.GetDomElement(), "sticky") === "false") // Viewport collision is handled by OnToggled handler when items are sticky
			{
				var elm = Fit.Events.GetTarget(e);
				elm = ((elm.tagName === "LI") ? elm : Fit.Dom.GetParentOfType(elm, "li")); // Null if user is hovering context menu border or any margin/padding applied to context menu container

				if (elm !== null)
					handleViewPortCollision(elm);
			}
		});

		// Contain clicks - prevents e.g. drop down from closing when context menu is used within picker control

		Fit.Events.AddHandler(tree.GetDomElement(), "click", function(e)
		{
			Fit.Events.StopPropagation(e);
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

		// Boundary detection

		if (detectBoundaries === true)
		{
			var treeElm = tree.GetDomElement();
			Fit.Dom.Data(treeElm, "viewportcollision", "false");

			if (Fit.Browser.GetViewPortDimensions().Height < (posY - Fit.Dom.GetScrollPosition(document.body).Y) + treeElm.offsetHeight)
			{
				Fit.Dom.Data(treeElm, "viewportcollision", "true");
				treeElm.style.top = (posY - treeElm.offsetHeight) + "px";
			}
		}

		// Focus context menu to allow keyboard navigation

		me.Focused(true);

		// Fire OnShown event

		fireEventHandlers(onShown);

		// Make sure OnClick handler on document does not close
		// Context Menu if triggered using left button.
		Fit._internal.ContextMenu.SkipClickClose = true;
		setTimeout(function() { Fit._internal.ContextMenu.SkipClickClose = false; }, 0);
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

			Fit.Array.ForEach(tree.GetChildren(), function(n) // OnToggled handler makes sure to collapse nodes recursively
			{
				n.Expanded(false);
			});

			highlightOnInitKeyStroke = true;
			Fit.Dom.Data(tree.GetDomElement(), "keynav", "false");
			Fit.Dom.Data(tree.GetDomElement(), "viewportcollision", "false");
			Fit.Dom.Data(tree.GetDomElement(), "sticky", "false");

			Fit.Array.ForEach(tree.GetDomElement().getElementsByTagName("ul"), function(ul)
			{
				Fit.Dom.Data(ul, "viewportcollision", null);
			});
		}
	}

	/// <function container="Fit.Controls.ContextMenu" name="DetectBoundaries" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether boundary/collision detection is enabled or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables collision detection (default), False disables it </param>
	/// </function>
	this.DetectBoundaries = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === false)
			{
				Fit.Dom.Data(tree.GetDomElement(), "viewportcollision", "false");

				Fit.Array.ForEach(tree.GetDomElement().getElementsByTagName("ul"), function(ul)
				{
					Fit.Dom.Data(ul, "viewportcollision", null);
				});
			}

			detectBoundaries = val;
		}

		return detectBoundaries;
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

	/// <function container="Fit.Controls.ContextMenu" name="GetAllChildren" access="public" returns="Fit.Controls.ContextMenu.Item[]">
	/// 	<description> Get all children across entire hierarchy in a flat collection </description>
	/// </function>
	this.GetAllChildren = function()
	{
		var items = [];

		Fit.Array.ForEach(tree.GetAllNodes(), function(tvNode)
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
			prevFocused = Fit.Dom.GetFocused();
		}

		return tree.Focused(value);
	}

	/// <function container="Fit.Controls.ContextMenu" name="Dispose" access="public">
	/// 	<description> Destroys component to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		if (me === Fit._internal.ContextMenu.Current) // In case ContextMenu is being disposed while being used
			Fit._internal.ContextMenu.Current = null;

		tree.Dispose();
		me = tree = prevFocused = detectBoundaries = highlightOnInitKeyStroke = isIe8 = onShowing = onShown = onHide = onSelect = null;
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

	/// <function container="Fit.Controls.ContextMenu" name="OnSelect" access="public">
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

	function getExpandedChild(children, childToIgnore)
	{
		Fit.Validation.ExpectInstanceArray(children, Fit.Controls.TreeView.Node);
		Fit.Validation.ExpectInstance(childToIgnore, Fit.Controls.TreeView.Node);

		var found = null;

		Fit.Array.ForEach(children, function(c)
		{
			if (c.Expanded() === true && c !== childToIgnore)
			{
				found = c;
				return false; // Break loop
			}
		});

		return found;
	}

	function handleViewPortCollision(nodeElm)
	{
		Fit.Validation.ExpectDomElement(nodeElm);

		if (nodeElm.getElementsByTagName("ul").length > 0)
		{
			var ul = nodeElm.getElementsByTagName("ul")[0];
			Fit.Dom.Data(ul, "viewportcollision", null); // Requires repaint in Legacy IE

			repaint(function()
			{
				var pos = Fit.Dom.GetPosition(ul, true);

				if (Fit.Browser.GetViewPortDimensions().Height < pos.Y + ul.offsetHeight)
					Fit.Dom.Data(ul, "viewportcollision", "true");
			});
		}
	}

	function repaint(f)
	{
		Fit.Validation.ExpectFunction(f, true);

		var cb = ((Fit.Validation.IsSet(f) === true) ? f : function() {});

		if (isIe8 === false)
		{
			cb();
		}
		else
		{
			// Flickering may occure on IE8 when updating UI over time
			// (UI update + JS thread released + UI updates again "later").

			Fit.Dom.AddClass(tree.GetDomElement(), "FitUi_Non_Existing_ContextMenu_Class");
			Fit.Dom.RemoveClass(tree.GetDomElement(), "FitUi_Non_Existing_ContextMenu_Class");

			setTimeout(function()
			{
				cb();

				Fit.Dom.AddClass(tree.GetDomElement(), "FitUi_Non_Existing_ContextMenu_Class");
				Fit.Dom.RemoveClass(tree.GetDomElement(), "FitUi_Non_Existing_ContextMenu_Class");
			}, 0);
		}
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

	/// <function container="Fit.Controls.ContextMenu.Item" name="Title" access="public" returns="string">
	/// 	<description> Get/set item title </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, item title is updated </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);
		return node.Title(val);
	}

	/// <function container="Fit.Controls.ContextMenu.Item" name="Value" access="public" returns="string">
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

	/// <function container="Fit.Controls.ContextMenu.Item" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing context menu item </description>
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

	/// <function container="Fit.Controls.ContextMenu.Item" name="GetParent" access="public" returns="Fit.Controls.ContextMenu.Item">
	/// 	<description> Get parent item - returns Null for a root item </description>
	/// </function>
	this.GetParent = function()
	{
		var parent = node.GetParent();
		return ((parent !== null) ? parent.GetDomElement()._internal.ContextMenuItem : null);
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
Fit._internal.ContextMenu.SkipClickClose = false;
Fit._internal.ContextMenu.Current = null;

// Event handler responsible for closing context menu when clicking outside of context menu

Fit.Events.OnReady(function()
{
	Fit.Events.AddHandler(document, "click", function(e)
	{
		if (Fit._internal.ContextMenu.SkipClickClose === true)
			return;

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
