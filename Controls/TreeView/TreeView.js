/// <container name="Fit.Controls.TreeView" extends="Fit.Controls.PickerBase;Fit.Controls.ControlBase">
/// 	TreeView control allowing data to be listed in a structured manner.
/// 	Extending from Fit.Controls.PickerBase.
/// 	Extending from Fit.Controls.ControlBase.
///
/// 	Performance considerations (for huge amounts of data):
///
/// 	1) Selectable(..) is used to transform how nodes allow selections
/// 	   (disabled/single select/multi select/select all). This requires the function to
/// 	   recursively modify all nodes contained to make sure they are configured identically.
/// 	   However, this also happens when AddChild(node) is called, to make sure
/// 	   nodes added at any time is configured in accordance with TreeView configuration.
/// 	   Selectable(..) should therefore be called before adding nodes to prevent
/// 	   an extra recursive operation on all nodes contained.
///
/// 	2) Selected(nodes) performs better than Value("val1;val2;val3")
///
/// 	3) RemoveChild(node) performance is non-linear, relative to the amount of children contained.
/// 	   The function recursively iterates children to find selected nodes to deselect them, to
/// 	   make sure TreeView is updated accordingly.
///
/// 	4) GetChild("val1", true) is faster at finding one specific node, compared to recursively
/// 	   iterating the result from GetChildren(), since internal children collections are indexed.
///
/// 	5) Be aware that some operations (e.g. AddChild, Expand/Collapse, Select/Deselect) forces
/// 	   Internet Explorer 8 to repaint tree to work around render bugs. Repainting can be minimized
/// 	   greately by populating root nodes before adding them to the TreeView instance.
/// 	   However, be aware that this comes with the performance penalty mentioned in article 1 (AddChild).
/// 	   It is likely that repainting does not pose a major performance problem, though.
/// </container>

/// <function container="Fit.Controls.TreeView" name="TreeView" access="public">
/// 	<description> Create instance of TreeView control </description>
/// 	<param name="ctlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.TreeView = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId, true);
	Fit.Core.Extend(this, Fit.Controls.PickerBase).Apply();
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var rootContainer = null;		// UL element
	var rootNode = null;			// Fit.Controls.TreeViewNode instance
	var focusInEventId = -1;		// ID for OnFocus event handler registered at the document level

	var keyNavigationEnabled = true;

	var selectable = false;
	var multiSelect = false;
	var showSelectAll = false; // TBD: Never implemented - can be achieved using ContextMenu. Remove or implement?
	var allowDeselect = true;
	var revealExpandedNodes = false;
	var persistView = false;
	var scrollPosition = { X: 0, Y: 0 };
	var highlightFirst = false;
	var firstWasHighlighted = false;

	var selected = createInternalCollection();
	var selectedOrg = [];

	var ctx = null; // Context menu

	var onSelectHandlers = [];
	var onSelectedHandlers = [];
	var onToggleHandlers = [];
	var onToggledHandlers = [];
	var onSelectAllHandlers = [];
	var onSelectAllCompleteHandlers = [];
	var onContextMenuHandlers = [];

	var forceClear = false;
	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);

	// ============================================
	// Init
	// ============================================

	function init()
	{
		// Initial settings

		me.AddCssClass("FitUiControlTreeView");
		me._internal.Data("selectable", "false");
		me._internal.Data("multiselect", "false");
		me._internal.Data("wordwrap", "false");
		me._internal.Data("picker", "false");
		me._internal.Data("htmlallowed", "false");

		// Create internal root node to hold children

		rootContainer = document.createElement("ul");
		me._internal.AddDomElement(rootContainer);

		rootNode = new Fit.Controls.TreeViewNode(" ", "TREEVIEW_ROOT_NODE");
		rootNode.GetDomElement().tabIndex = -1;
		rootContainer.appendChild(rootNode.GetDomElement());

		// TreeView Node Interface:
		// The Tree View Node Interface allow nodes to synchronize their selection state to the TreeView.
		// That way the TreeView never has to recursively iterate a potentially huge tree to determine
		// which nodes are selected, to clear all nodes, etc.
		// One might wonder why the TreeView does not maintain the internal selected collection itself
		//  - after all, all event handling is performed by the TreeView, so it knows when a node is
		//    selected. The reason for this, of course, is that nodes can be selected programmatically as well.
		// The TreeView Node Interface also ensures that once a node is attached to the TreeView, any children added to that
		// particular node is configured accordingly with the existing nodes in the TreeView (Selectable, Checkbox, ShowSelectAll).

		var treeViewNodeInterface =
		{
			Select: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);

				// Deselect selected node if Multi Selection is not enabled
				if (multiSelect === false && selected.length > 0)
					executeWithNoOnChange(function() { selected[0].Selected(false); });

				// Add node to internal selection
				Fit.Array.Add(selected, node);
			},
			Deselect: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);

				// Remove node from internal selection
				Fit.Array.Remove(selected, node);
			},
			Selected: function(val)
			{
				Fit.Validation.ExpectArray(val, true);
				return me.Selected(val); // Fires OnChange
			},
			IsSelectable: function()
			{
				return selectable;
			},
			IsMultiSelect: function()
			{
				return multiSelect;
			},
			ShowSelectAll: function()
			{
				return showSelectAll;
			},
			Repaint: function()
			{
				repaint();
			},
			FireToggle: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
				return fireEventHandlers(onToggleHandlers, node);
			},
			FireToggled: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
				return fireEventHandlers(onToggledHandlers, node);
			},
			FireSelect: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);

				// FireSelect is invoked prior to node change.
				// If TreeView is in Single Selection Mode, and a non-selectable node is already selected,
				// new selection is canceled by returning False, to keep existing selection.
				// However, we never want to cancel change if TreeView.Clear() is invoked, in which case forceClear is true.
				if (forceClear === false && multiSelect === false && selected.length > 0 && selected[0].Selectable() === false)
					return false;

				return fireEventHandlers(onSelectHandlers, node);
			},
			FireSelected: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
				fireEventHandlers(onSelectedHandlers, node);
			},
			FireOnChange: function()
			{
				me._internal.FireOnChange();
			},
			GetTreeView: function()
			{
				return me;
			},
			Dissociate: function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);

				if (node === activeNode)
				{
					Fit.Dom.Data(activeNode.GetDomElement(), "active", null);
					activeNode = null;
				}
			}
		}

		rootNode.GetDomElement()._internal.TreeView = treeViewNodeInterface;

		// Event handling

		rootNode.GetDomElement().onkeydown = function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			var elm = Fit.Events.GetTarget(e);

			if (keyNavigationEnabled === false)
				return;

			//{ PickerControl support - START

			// If used as picker control, make sure first node is selected on initial key press (activeNode has not yet been set)
			if (isPicker === true && isNodeSet(activeNode) === false)
			{
				focusFirstNode(); // Sets activeNode to first child
				return;
			}

			// If onkeydown was not fired from a list item (which usually has focus),
			// it was most likely fired from a host control through HandleEvent(..).
			// In this case activeNode will be set.
			if (elm.tagName !== "LI" && isPicker === true && isNodeSet(activeNode) === true)
				elm = activeNode.GetDomElement();

			//} // PickerControl support - END

			// Variable elm above is almost always a <li> node element since we make sure only these elements are focused
			// when node is clicked or keyboard navigation occure. However, IF the node title for some strange reason contains an element
			// that gains focus (e.g. an input control), that element could be contained in the elm variable when onkeydown is fired.
			// We already make sure that <a> link elements do not gain focus which is more likely to be used as node title, so there
			// is almost no chance the elm variable will ever contain anything else but the <li> node element. But better safe than sorry.
			if (elm.tagName !== "LI")
				return;

			// Element is root node if user clicked next to a child node within root node element
			if (elm === rootNode.GetDomElement())
			{
				if (rootNode.GetChildren().length > 0)
					focusNode(rootNode.GetChildren()[0]); // Select first node

				Fit.Events.PreventDefault(ev);
				return;
			}

			var node = elm._internal.Node;

			// Handle context menu

			if (ev.keyCode === 93 || (Fit.Events.GetModifierKeys().Shift === true && ev.keyCode === 121)) // Context menu button or Shift+F10
			{
				var label = node.GetDomElement().querySelector("span");

				var pos = Fit.Dom.GetPosition(label);
				var scrollContainers = Fit.Dom.GetScrollPosition(label); // TreeView may be placed in container(s) with scroll
				var scrollDocument = Fit.Dom.GetScrollPosition(document.body); // Page may have been scrolled

				pos.X = (pos.X - scrollContainers.X) + scrollDocument.X + label.offsetWidth - 10;
				pos.Y = (pos.Y - scrollContainers.Y) + scrollDocument.Y + label.offsetHeight - 5;

				openContextMenu(node, pos);

				Fit.Events.PreventDefault(ev);
				return;
			}

			// Handle navigation links

			if (ev.keyCode === 13) // Enter
			{
				if (node.Selectable() === true && me.Enabled() === true)
				{
					node.Selected(true);
				}
				else
				{
					// Navigate link contained in item

					var links = node.GetDomElement().getElementsByTagName("a");

					if (links.length === 1)
					{
						if (links[0].click) // Some browsers, e.g. Safari 5, does not support click()
						{
							links[0].click();
						}
						else
						{
							var clickEvent = document.createEvent("MouseEvent");
							clickEvent.initEvent("click", true, true);
							links[0].dispatchEvent(clickEvent);
						}
					}
				}

				Fit.Events.PreventDefault(ev);
				return;
			}

			// Toggle selection

			if (ev.keyCode === 32) // Spacebar (toggle selection)
			{
				if (node.Selectable() === true && me.Enabled() === true)
					toggleNodeSelection(node);

				Fit.Events.PreventDefault(ev);
				return;
			}

			// Determine which node to focus next on keyboard navigation (arrow keys)

			var next = null;

			if (ev.keyCode === 37) // Left (collapse or move to parent)
			{
				// Collapse node if expanded - if not expanded, jump to parent node

				if (node.Expanded() === true)
				{
					node.Expanded(false);
				}
				else
				{
					next = node.GetParent();
				}

				Fit.Events.PreventDefault(ev);
			}
			else if (ev.keyCode === 39) // Right (expand)
			{
				// Expand node if not already expanded, and children are contained

				if (node.Expanded() === false && node.GetChildren().length > 0)
					node.Expanded(true);

				Fit.Events.PreventDefault(ev);
			}
			else if (ev.keyCode === 38) // Up
			{
				// Move selection up
				next = getNodeAbove(node);

				Fit.Events.PreventDefault(ev);
			}
			else if (ev.keyCode === 40) // Down
			{
				// Move selection down
				next = getNodeBelow(node);

				Fit.Events.PreventDefault(ev);
			}

			// Focus next node

			if (next !== null)
				focusNode(next);
		}

		rootNode.GetDomElement().onclick = function(e)
		{
			var elm = Fit.Events.GetTarget(e);

			// If element was a node's checkbox, cancel change to selection,
			// and let node handle whether it should be checked or not.
			if (elm.tagName === "INPUT" && elm.parentElement.tagName === "LI")
				elm.checked = !elm.checked;

			var nodeElm = ((elm.tagName === "LI") ? elm : Fit.Dom.GetParentOfType(elm, "LI"));
			var node = nodeElm._internal.Node;

			// Focus node
			focusNode(node);

			// Toggle node if expand button was clicked
			if (elm === node.GetDomElement().children[0])
				node.Expanded(!node.Expanded());

			// Toggle selection or perform auto postback if node is selectable
			if (elm !== node.GetDomElement().children[0] && node.Selectable() === true)
			{
				toggleNodeSelection(node);
			}
		}

		// Clicking the TreeView's scrollbar causes it to lose focus to a parent container if it is focusable (has tabindex).
		// IE not affected though. We detect when user clicks on the TreeView's scrollable container and then reclaims focus
		// when OnFocus fires at the document root level. Since OnFocus is handled in the capture phase at the document
		// root level, it happens early enough to prevent the control from firing its OnBlur event.
		if (Fit.Browser.GetBrowser() !== "MSIE")
		{
			var reclaimFocus = false;

			Fit.Events.AddHandler(me.GetDomElement(), "mousedown", true, function(e)
			{
				if (Fit.Events.GetTarget(e) === me.GetDomElement()) // True if TreeView container was clicked, including its scrollbar
				{
					// Only reclaim focus if a container further up the hierarchy is focusable (has tabindex)

					var parent = me.GetDomElement();
					while ((parent = parent.parentElement) !== null)
					{
						if (Fit.Dom.Attribute(parent, "tabindex") !== null) // We cannot check against parent.tabIndex as it defaults to -1 when not set
						{
							reclaimFocus = true;
							break;
						}
					}
				}
			});

			focusInEventId = Fit.Events.AddHandler(document, "focus", true, function(e)
			{
				if (reclaimFocus === true)
				{
					reclaimFocus = false; // MUST be set immediately as code below changes focus and fires OnFocus for the document yet again

					// Fire PickerBase.OnFocusIn event - this causes DropDown to steal back focus - search for picker.OnFocusIn(..)
					// DISABLED - depends on the knowledge of DropDown specific behaviour which we should not rely on! Now focusing
					// root node instead (see below), which in turn also results in invocation of PickerBase.OnFocusIn since TreeView
					// invokes this whenever it gains focus - search for this.OnFocus(function(sender)...
					//me._internal.FireOnFocusIn();

					// Focus was lost to an outer container with tabindex. Move focus back to control.
					// We do not use me.Focused(true) since it returns focus to a previously focused
					// node, which will cause scroll position to change.
					// This will also fire the PickerBase.OnFocusIn event since TreeView fires this event
					// whenever it gains focus. This allows e.g. DropDown to yet again move focus to its
					// primary input field.
					rootNode.GetDomElement().focus();
				}
			});
		}

		Fit.Events.AddHandler(me.GetDomElement(), "contextmenu", function(e) { return Fit.Events.PreventDefault(e); }); // Disable context menu
		Fit.Events.AddHandler(me.GetDomElement(), "mouseup", function(e) // Select All feature
		{
			if (Fit.Events.GetPointerState().Buttons.Secondary === true) // Right click
			{
				var target = Fit.Events.GetTarget(e);

				if (target !== me.GetDomElement()) // Skip if right clicking TreeView container (possible if padding is applied)
				{
					var node = ((target.tagName === "LI") ? target._internal.Node : Fit.Dom.GetParentOfType(target, "li")._internal.Node);
					openContextMenu(node);
				}

				return Fit.Events.PreventDefault(e);
			}
		});

		var touchTimeout = -1;
		Fit.Events.AddHandler(me.GetDomElement(), "touchstart", function(e)
		{
			var target = Fit.Events.GetTarget(e);

			if (target !== me.GetDomElement()) // Skip if touching TreeView container (possible if padding is applied)
			{
				touchTimeout = setTimeout(function()
				{
					if (me === null)
					{
						return; // Control was disposed while holding down finger to trigger ContextMenu (unlikely though)
					}

					var node = ((target.tagName === "LI") ? target._internal.Node : Fit.Dom.GetParentOfType(target, "li")._internal.Node);
					openContextMenu(node);

					touchTimeout = -1;
				}, 500);
			}
		});
		Fit.Events.AddHandler(me.GetDomElement(), "touchend", function(e)
		{
			var elm = Fit.Events.GetTarget(e);

			if (touchTimeout !== -1)
			{
				clearTimeout(touchTimeout);
				touchTimeout = -1;
			}
		});

		Fit.Events.AddHandler(me.GetDomElement(), "scroll", function(e)
		{
			// Preserve scroll position which is lost if picker control is removed from DOM
			scrollPosition.X = me.GetDomElement().scrollLeft;
			scrollPosition.Y = me.GetDomElement().scrollTop;
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.TreeView" name="WordWrap" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether Word Wrapping is enabled </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables Word Wrapping, False disables it </param>
	/// </function>
	this.WordWrap = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			me._internal.Data("wordwrap", val.toString()); // Actual word-wrapping is achieved using CSS
			repaint();
		}

		return (me._internal.Data("wordwrap") === "true");
	}

	/// <function container="Fit.Controls.TreeView" name="HtmlAllowed" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether HTML is allowed (shown) in TreeView nodes </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables support for HTML, False disables it </param>
	/// </function>
	this.HtmlAllowed = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			me._internal.Data("htmlallowed", val.toString());

			// Update view for all nodes recursively

			var nodes = rootNode.GetChildren();

			Fit.Array.ForEach(nodes, function(node)
			{
				node.HtmlAllowed(val, true); // Recursive
			});
		}

		return (me._internal.Data("htmlallowed") === "true");
	}

	/// <function container="Fit.Controls.TreeView" name="Selectable" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether user can change selection state of nodes.
	/// 		This affects all contained nodes. To configure nodes
	/// 		individually, use Selectable(..) function on node instances.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables node selection, False disables it </param>
	/// 	<param name="multi" type="boolean" default="false"> If defined, True enables node multi selection, False disables it </param>
	/* 	<param name="showSelAll" type="boolean" default="false"> If defined, True enables Select All checkbox, False disables it </param> */
	/// </function>
	this.Selectable = function(val, multi, showSelAll)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(multi, true);
		Fit.Validation.ExpectBoolean(showSelAll, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			selectable = val;
			multiSelect = ((multi === true) ? true : false);
			showSelectAll = ((showSelAll === true) ? true : false);
			//allowDeselect = multi; // DISABLED - Selectable(..) should not change this behaviour!

			me._internal.Data("selectable", selectable.toString());
			me._internal.Data("multiselect", multiSelect.toString());

			var fireOnChange = (selected.length > 0);

			selected = createInternalCollection();

			// Deselect all children and make sure they are configured identically

			if (me.Value() !== "")
			{
				// Help developers - it might be confusing that changing Selectable state also clears selection
				Fit.Browser.Debug("TreeView: Selectable changed - Selections will be cleared");
			}

			executeWithNoOnChange(function() // Prevent n.Selected(false) from firering OnChange event
			{
				executeRecursively(rootNode, function(n)
				{
					if (n === rootNode)
						return; // Skip root node itself

					n.Selectable(selectable, multiSelect, showSelectAll);
					n.Selected(false);
				});
			});

			repaint();

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		return selectable;
	}

	/// <function container="Fit.Controls.TreeView" name="Selected" access="public" returns="Fit.Controls.TreeViewNode[]">
	/// 	<description> Get/set selected nodes </description>
	/// 	<param name="val" type="Fit.Controls.TreeViewNode[]" default="undefined"> If defined, provided nodes are selected </param>
	/// </function>
	this.Selected = function(val)
	{
		Fit.Validation.ExpectArray(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			selectedOrg = [];
			var fireOnChange = (selected.length > 0);

			executeWithNoOnChange(function() // Prevent node.Selected(true) from firering OnChange event
			{
				me.Clear();

				Fit.Array.ForEach(val, function(n)
				{
					Fit.Validation.ExpectInstance(n, Fit.Controls.TreeViewNode);

					var node = ((n.GetTreeView() === me) ? n : me.GetChild(n.Value(), true)); // Try GetChild(..) in case node was constructed, but with a valid value

					if (node === null)
						Fit.Validation.ThrowError("Node is not associated with this TreeView, unable to change selection");

					Fit.Array.Add(selectedOrg, node);
					node.Selected(true); // Adds node to internal selected collection through TreeViewNodeInterface
					fireOnChange = true;
				});
			});

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		return Fit.Array.Copy(selected); // Copy to prevent changes to internal selection array

		/*var copy = Fit.Array.Copy(selected); // Copy to prevent changes to internal selection array
		copy.toString = selected.toString;

		return copy;*/
	}

	/// <function container="Fit.Controls.TreeView" name="SelectAll" access="public">
	/// 	<description> Select all nodes </description>
	/// 	<param name="selected" type="boolean"> Value indicating whether to select or deselect nodes </param>
	/// 	<param name="selectAllNode" type="Fit.Controls.TreeViewNode" default="undefined">
	/// 		If specified, children under given node is selected/deselected recursively.
	/// 		If not specified, all nodes contained in TreeView will be selected/deselected.
	/// 	</param>
	/// </function>
	this.SelectAll = function(selected, selectAllNode/*, suppressOnSelectAllCompletedCallback*/) // suppressOnSelectAllCompletedCallback is for internal use only!
	{
		Fit.Validation.ExpectBoolean(selected);
		Fit.Validation.ExpectInstance(selectAllNode, Fit.Controls.TreeViewNode, true);

		// NOTICE: Selecting thousands of nodes using SelectAll may result in very poor performance
		// due to the large amount of DOM manipulation. The control goes through a full state change
		// for every single item being selected or deselected, so all events fire and reflows are
		// triggered for visible items.
		// To increase performance, temporarily hide TreeView with display:none while SelectAll is being performed.

		var node = (selectAllNode ? selectAllNode : null); // Null = select all nodes, Set = select only children under passed node

		// Fire OnSelectAll event

		if (me._internal.FireOnSelectAll(selected, node) === false)
			return; // Event handler canceled event

		// Change selection and expand (all nodes)

		var changed = false;

		executeWithNoOnChange(function() // Prevent OnChange from firing every time a node's selection state is changed
		{
			var nodes = ((node !== null) ? node.GetChildren() : rootNode.GetChildren());

			Fit.Array.Recurse(nodes, "GetChildren", function(child)
			{
				if (child.Selectable() === true)
				{
					if (child.Selected() !== selected)
					{
						changed = true;
						child.Selected(selected);
					}
				}

				//child.Expanded(true); // DISABLED - This hurts performance significantly for large TreeViews (10-15.000 nodes) as a huge amounts of DOM elements needs to be pushed to render tree, e.g. when opening/closing dropdown hosting TreeView
			});
		});

		//if (suppressOnSelectAllCompletedCallback !== true)
		//{
		me._internal.FireOnSelectAllComplete(selected, node);
		//}

		if (changed === true)
			me._internal.FireOnChange();
	}

	/// <function container="Fit.Controls.TreeView" name="ExpandAll" access="public">
	/// 	<description> Expand all nodes, optionally to a maximum depth </description>
	/// 	<param name="maxDepth" type="integer" default="undefined"> Optional maximum depth to expand nodes </param>
	/// </function>
	this.ExpandAll = function(maxDepth) // Overridden by WSTreeView
	{
		Fit.Validation.ExpectInteger(maxDepth, true);

		Fit.Array.CustomRecurse(me.GetChildren(), function(node)
		{
			node.Expanded(true);
			return (node.GetLevel() + 1 < (maxDepth || 99999) ? node.GetChildren() : null);
		});
	}

	/// <function container="Fit.Controls.TreeView" name="CollapseAll" access="public">
	/// 	<description> Collapse all nodes, optionally to a maximum depth </description>
	/// 	<param name="maxDepth" type="integer" default="undefined"> Optional maximum depth to collapse nodes </param>
	/// </function>
	this.CollapseAll = function(maxDepth) // Overridden by WSTreeView
	{
		Fit.Validation.ExpectInteger(maxDepth, true);

		Fit.Array.CustomRecurse(me.GetChildren(), function(node)
		{
			node.Expanded(false);
			return (node.GetLevel() + 1 < (maxDepth || 99999) ? node.GetChildren() : null);
		});
	}

	/// <function container="Fit.Controls.TreeView" name="AllowDeselect" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether user is allowed to deselect nodes.
	/// 		By default the user is allowed to deselect nodes.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, changes behaviour to specified value </param>
	/// </function>
	this.AllowDeselect = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			allowDeselect = val;
		}

		return allowDeselect;
	}

	// See documentation on ControlBase
	this.Value = function(val, preserveDirtyState)
	{
		Fit.Validation.ExpectString(val, true);
		Fit.Validation.ExpectBoolean(preserveDirtyState, true);

		// Set

		if (Fit.Validation.IsSet(val) === true)
		{
			selectedOrg = (preserveDirtyState !== true ? [] : selectedOrg);
			var fireOnChange = (selected.length > 0);

			executeWithNoOnChange(function()
			{
				me.Clear();

				var values = val.split(";");

				Fit.Array.ForEach(values, function(nodeValue)
				{
					var nodeVal = decodeReserved(((nodeValue.indexOf("=") === -1) ? nodeValue : nodeValue.split("=")[1]));
					var child = me.GetChild(nodeVal, true);

					if (child !== null)
					{
						if (preserveDirtyState !== true)
						{
							Fit.Array.Add(selectedOrg, child);
						}

						child.Selected(true);
						fireOnChange = true;
					}
				});
			});

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		// Get

		var nodes = me.Selected();
		var value = "";

		Fit.Array.ForEach(nodes, function(node)
		{
			value += ((value !== "") ? ";" : "") + encodeReserved(node.Title()) + "=" + encodeReserved(node.Value());
		});

		return value;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		if (selected.length !== selectedOrg.length)
			return true;

		var dirty = false;
		Fit.Array.ForEach(selectedOrg, function(node)
		{
			if (Fit.Array.Contains(selected, node) === false)
			{
				dirty = true;
				return false;
			}
		});
		return dirty;
	}

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true)
		{
			var focused = getNodeFocused();

			if (focus === true && focused === null)
			{
				var nodes = rootNode.GetChildren();

				if (nodes.length > 0)
					nodes[0].Focused(true);
			}
			else if (focus === false && focused !== null)
			{
				focused.Focused(false);
			}
		}

		return (getNodeFocused() !== null);
	}

	/// <function container="Fit.Controls.TreeView" name="Lines" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether helper lines are shown.
	/// 		Notice that helper lines cause node items to obtain a fixed
	/// 		line height of 20px, making it unsuitable for large fonts.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables helper lines, False disables them </param>
	/// </function>
	this.Lines = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true)
			{
				me.AddCssClass("FitUiControlTreeViewLines");
				me.AddCssClass("FitUiControlTreeViewDotLines"); // Optional, render dotted lines instead of solid lines
			}
			else
			{
				me.RemoveCssClass("FitUiControlTreeViewLines");
				me.RemoveCssClass("FitUiControlTreeViewDotLines");
			}

			repaint();
		}

		return me.HasCssClass("FitUiControlTreeViewLines");
	}

	/// <function container="Fit.Controls.TreeView" name="ContextMenu" access="public" returns="Fit.Controls.ContextMenu">
	/// 	<description> Get/set instance of ContextMenu control triggered when right clicking nodes in TreeView </description>
	/// 	<param name="contextMenu" type="Fit.Controls.ContextMenu | null"> If defined, assignes ContextMenu control to TreeView </param>
	/// </function>
	this.ContextMenu = function(contextMenu)
	{
		Fit.Validation.ExpectInstance(contextMenu, Fit.Controls.ContextMenu, true);

		if (contextMenu !== undefined) // Accept null to disable context menu
		{
			ctx = contextMenu;
		}

		return ctx;
	}

	/// <function container="Fit.Controls.TreeView" name="Clear" access="public">
	/// 	<description>
	/// 		Fit.Controls.ControlBase.Clear override:
	/// 		Clear control value.
	/// 		Override allows for non-selectable nodes to keep their selection state.
	/// 		This is useful if TreeView has been configured to preselect some non-selectable
	/// 		nodes, hence preventing the user from removing these selections. In that case the
	/// 		desired functionality of the Clear function could be to preserve these preselections.
	/// 		If called with no arguments, all selections are cleared.
	/// 	</description>
	/// 	<param name="preserveNonSelectable" type="boolean" default="false">
	/// 		True causes selection state of non-selectable nodes to be preserved, False do not
	/// 	</param>
	/// </function>
	this.Clear = function(preserveNonSelectable)
	{
		if (selected.length === 0)
			return;

		forceClear = (preserveNonSelectable !== true);

		// Deselecting items causes them to be removed from internal selected collection.
		// Copying array to avoid breaking ForEach which doesn't like collection being modified while iterated.
		var sel = Fit.Array.Copy(selected);

		executeWithNoOnChange(function() // Prevent node.Selected(false) from firering OnChange
		{
			Fit.Array.ForEach(sel, function(node)
			{
				if (preserveNonSelectable !== true || node.Selectable() === true)
					node.Selected(false); // Removes node from internal selected collection through TreeViewNodeInterface
			});
		});

		forceClear = false;

		me._internal.FireOnChange();
	}

	/// <function container="Fit.Controls.TreeView" name="AddChild" access="public">
	/// 	<description> Add node to TreeView </description>
	/// 	<param name="node" type="Fit.Controls.TreeViewNode"> Node to add </param>
	/// 	<param name="atIndex" type="integer" default="undefined"> Optional index at which node is added </param>
	/// </function>
	this.AddChild = function(node, atIndex)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
		Fit.Validation.ExpectInteger(atIndex, true);
		rootNode.AddChild(node, atIndex);
	}

	/// <function container="Fit.Controls.TreeView" name="RemoveChild" access="public">
	/// 	<description> Remove node from TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes </description>
	/// 	<param name="node" type="Fit.Controls.TreeViewNode"> Node to remove </param>
	/// </function>
	this.RemoveChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
		rootNode.RemoveChild(node);
	}

	/// <function container="Fit.Controls.TreeView" name="RemoveAllChildren" access="public">
	/// 	<description> Remove all nodes contained in TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes </description>
	/// 	<param name="dispose" type="boolean" default="false"> Set True to dispose nodes </param>
	/// </function>
	this.RemoveAllChildren = function(dispose)
	{
		Fit.Validation.ExpectBoolean(dispose, true);

		var fireOnChange = (selected.length > 0);

		// Clear internal selections by creating new collection rather than calling me.Clear().
		// This is done to prevent OnSelect (and OnItemSelectionChanging), OnSelected (and
		// OnItemSelectionChanged), and OnChange from firing if selections were made.
		// In fact, we want to preserve selection state for removed nodes in case it is
		// needed later, e.g. if moved to another TreeView.
		selected = createInternalCollection();

		executeWithNoOnChange(function()
		{
			var children = rootNode.GetChildren();

			Fit.Array.ForEach(children, function(child)
			{
				if (dispose === true)
					child.Dispose();
				else
					rootNode.RemoveChild(child);
			});
		});

		if (fireOnChange === true)
			me._internal.FireOnChange();
	}

	/// <function container="Fit.Controls.TreeView" name="GetChild" access="public" returns="Fit.Controls.TreeViewNode | null">
	/// 	<description> Get node by value - returns Null if not found </description>
	/// 	<param name="val" type="string"> Node value </param>
	/// 	<param name="recursive" type="boolean" default="false"> If defined, True enables recursive search </param>
	/// </function>
	this.GetChild = function(val, recursive)
	{
		Fit.Validation.ExpectString(val);
		Fit.Validation.ExpectBoolean(recursive, true);

		return rootNode.GetChild(val, recursive);
	}

	/// <function container="Fit.Controls.TreeView" name="GetChildren" access="public" returns="Fit.Controls.TreeViewNode[]">
	/// 	<description> Get all children </description>
	/// </function>
	this.GetChildren = function()
	{
		return rootNode.GetChildren();
	}

	/// <function container="Fit.Controls.TreeView" name="GetAllNodes" access="public" returns="Fit.Controls.TreeViewNode[]">
	/// 	<description> Get all nodes across all children and their children, in a flat structure </description>
	/// </function>
	this.GetAllNodes = function()
	{
		var nodes = [];
		executeRecursively(rootNode, function(n)
		{
			if (n === rootNode)
				return;

			Fit.Array.Add(nodes, n);
		});
		return nodes;
	}

	/// <function container="Fit.Controls.TreeView" name="GetNodeFocused" access="public" returns="Fit.Controls.TreeViewNode | null">
	/// 	<description> Get node currently having focus - returns Null if no node has focus </description>
	/// </function>
	this.GetNodeFocused = function()
	{
		return getNodeFocused();
	}

	/// <function container="Fit.Controls.TreeView" name="GetActiveNode" access="public" returns="Fit.Controls.TreeViewNode | null">
	/// 	<description> Get active (highlighted or focused) node - returns Null if no node is currently active </description>
	/// </function>
	this.GetActiveNode = function()
	{
		return isPicker ? activeNode : getNodeFocused();
	}

	/// <function container="Fit.Controls.TreeView" name="SetActiveNode" access="public">
	/// 	<description> Set active (highlighted or focused) node </description>
	/// 	<param name="node" type="Fit.Controls.TreeViewNode"> Node to set active in TreeView </param>
	/// </function>
	this.SetActiveNode = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);

		if (node.GetTreeView() === me)
		{
			focusNode(node); // Will highlight node if TreeView is used as picker, otherwise focus node
		}
	}

	/// <function container="Fit.Controls.TreeView" name="GetNodeAbove" access="public" returns="Fit.Controls.TreeViewNode | null">
	/// 	<description> Get node above specified node - returns Null if no node is above the specified one </description>
	/// 	<param name="node" type="Fit.Controls.TreeViewNode"> Node to get node above </param>
	/// </function>
	this.GetNodeAbove = function(node)
	{
		return getNodeAbove(node, true);
	}

	/// <function container="Fit.Controls.TreeView" name="GetNodeBelow" access="public" returns="Fit.Controls.TreeViewNode | null">
	/// 	<description> Get node below specified node - returns Null if no node is below the specified one </description>
	/// 	<param name="node" type="Fit.Controls.TreeViewNode"> Node to get node below </param>
	/// </function>
	this.GetNodeBelow = function(node)
	{
		return getNodeBelow(node, true, true);
	}

	/// <function container="Fit.Controls.TreeView" name="KeyboardNavigation" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether keyboard navigation is enabled </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables keyboard navigation, False disables it </param>
	/// </function>
	this.KeyboardNavigation = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			keyNavigationEnabled = val;
		}

		return keyNavigationEnabled;
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function(calledInternally)
	{
		Fit.Validation.ExpectBoolean(calledInternally, true);

		// This will destroy control - it will no longer work!

		if (focusInEventId !== -1)
		{
			Fit.Events.RemoveHandler(document, focusInEventId);
		}

		me._internal.ExecuteWithNoOnChange(function() // Prevent Dispose() on nodes from firing OnChange when they are removed from hierarchy
		{
			rootNode.Dispose();
		});

		if (ctx !== null)
		{
			ctx.Dispose(); //ctx.Hide();
		}

		base();

		if (calledInternally !== true)
		{
			me.Destroy(true); // PickerBase.Destroy()
		}

		me = rootContainer = rootNode = focusInEventId = keyNavigationEnabled = selectable = multiSelect = showSelectAll = allowDeselect = revealExpandedNodes = persistView = scrollPosition = highlightFirst = firstWasHighlighted = selected = selectedOrg = ctx = onSelectHandlers = onSelectedHandlers = onToggleHandlers = onToggledHandlers = onSelectAllHandlers = onSelectAllCompleteHandlers = onContextMenuHandlers = forceClear = isIe8 = isPicker = activeNode = hostFocused = null;
	});

	// ============================================
	// Events (OnChange defined on BaseControl)
	// ============================================

	/// <container name="Fit.Controls.TreeViewTypeDefs.SelectionEventHandlerArgs">
	/// 	<description> Selection event handler arguments </description>
	/// 	<member name="Node" type="Fit.Controls.TreeViewNode | null">
	/// 		Instance of TreeViewNode - Null if Select All was triggered for root nodes (all nodes)
	/// 	</member>
	/// 	<member name="Selected" type="boolean"> Value indicating new selection state </member>
	/// </container>

	/// <function container="Fit.Controls.TreeViewTypeDefs" name="CancelableNodeEventHandler" returns="boolean | void">
	/// 	<description> Cancelable node event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="node" type="Fit.Controls.TreeViewNode"> Instance of TreeViewNode </param>
	/// </function>

	/// <function container="Fit.Controls.TreeViewTypeDefs" name="NodeEventHandler">
	/// 	<description> Node event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="node" type="Fit.Controls.TreeViewNode"> Instance of TreeViewNode </param>
	/// </function>

	/// <function container="Fit.Controls.TreeViewTypeDefs" name="CancelableSelectionEventHandler" returns="boolean | void">
	/// 	<description> Cancelable select all event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="eventArgs" type="Fit.Controls.TreeViewTypeDefs.SelectionEventHandlerArgs">
	/// 		Event handler arguments
	/// 	</param>
	/// </function>

	/// <function container="Fit.Controls.TreeViewTypeDefs" name="SelectionCompleteEventHandler">
	/// 	<description> Select all complete event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="eventArgs" type="Fit.Controls.TreeViewTypeDefs.SelectionEventHandlerArgs">
	/// 		Event handler arguments
	/// 	</param>
	/// </function>

	/// <function container="Fit.Controls.TreeView" name="OnSelect" access="public">
	/// 	<description>
	/// 		Add event handler fired when node is being selected or deselected.
	/// 		Selection can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnSelect = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnSelected" access="public">
	/// 	<description>
	/// 		Add event handler fired when node is selected or deselected.
	/// 		Selection can not be canceled. Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.TreeViewTypeDefs.NodeEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnSelected = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectedHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnToggle" access="public">
	/// 	<description>
	/// 		Add event handler fired when node is being expanded or collapsed.
	/// 		Toggle can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnToggle = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onToggleHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnToggled" access="public">
	/// 	<description>
	/// 		Add event handler fired when node is expanded or collapsed.
	/// 		Toggle can not be canceled. Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.TreeViewTypeDefs.NodeEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnToggled = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onToggledHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnSelectAll" access="public">
	/// 	<description>
	/// 		Add event handler fired when Select All is used for a given node.
	/// 		This event can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Node: Fit.Controls.TreeViewNode instance - Null if Select All was triggered for root nodes (all nodes)
	/// 		 - Selected: Boolean value indicating new selection state
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.TreeViewTypeDefs.CancelableSelectionEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnSelectAll = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectAllHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnSelectAllComplete" access="public">
	/// 	<description>
	/// 		Add event handler fired when Select All operation has completed.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Node: Fit.Controls.TreeViewNode instance - Null if Select All was triggered for root nodes (all nodes)
	/// 		 - Selected: Boolean value indicating new selection state
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.TreeViewTypeDefs.SelectionCompleteEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnSelectAllComplete = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectAllCompleteHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnContextMenu" access="public">
	/// 	<description>
	/// 		Add event handler fired before context menu is shown.
	/// 		This event can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
	/// 		Use Sender.ContextMenu() to obtain a reference to the context menu.
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnContextMenu = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onContextMenuHandlers, cb);
	}

	// ============================================
	// PickerBase interface
	// ============================================

	var isPicker = false;
	var activeNode = null;
	var hostFocused = false;

	this.OnShow(function(sender)
	{
		if (persistView === false) // Reset selection and scroll position
		{
			if (highlightFirst === true)
			{
				focusFirstNode();
			}
			else
			{
				unsetActiveNode();
			}

			me.GetDomElement().scrollTop = 0;
			me.GetDomElement().scrollLeft = 0;
		}
		else // View persisted
		{
			if (highlightFirst === true && firstWasHighlighted === false)
			{
				focusFirstNode();
				firstWasHighlighted = true;
			}

			me.GetDomElement().scrollTop = scrollPosition.Y;
			me.GetDomElement().scrollLeft = scrollPosition.X;
		}
	});

	this.OnSelect(function(sender, node)
	{
		// Handlers may return False which will prevent node from being selected, and OnSelected from being fired
		return me._internal.FireOnItemSelectionChanging(node.Title(), node.Value(), node.Selected(), hostFocused === false);
	});

	this.OnSelected(function(sender, node)
	{
		me._internal.FireOnItemSelectionChanged(node.Title(), node.Value(), node.Selected(), hostFocused === false);
	});

	this.OnChange(function(sender)
	{
		me._internal.FireOnItemSelectionComplete();
	});

	this.OnFocus(function(sender)
	{
		me._internal.FireOnFocusIn();
	});

	this.OnBlur(function(sender)
	{
		me._internal.FireOnFocusOut();
	});

	this.SetSelections = function(items)
	{
		Fit.Validation.ExpectArray(items);

		var vals = [];
		var fireOnChange = false;

		Fit.Array.ForEach(items, function(item)
		{
			Fit.Array.Add(vals, item.Value);
		});

		// Set new selections provided by host control

		executeWithNoOnChange(function()
		{
			// Deselect nodes not found in items passed (vals array)

			Fit.Array.ForEach(Fit.Array.Copy(selected), function(selectedNode) // Copying array to prevent "Collection modified" error - deselecting nodes causes them to be removed from array
			{
				// Notice that non-selectable (read only) nodes always keep their selection state
				if (Fit.Array.Contains(vals, selectedNode.Value()) === false && selectedNode.Selectable() === true)
				{
					selectedNode.Selected(false);
					fireOnChange = true;
				}
			});

			// Select nodes from items argument not already selected

			Fit.Array.ForEach(vals, function(nodeVal)
			{
				var child = me.GetChild(nodeVal, true); // Based on indexed lookup - fast!

				// Notice: Items passed may contain nodes that were already selected, hence checking node's
				// Selected state to prevent OnChange from firing if items provided matched TreeView's current selection.
				if (child !== null && child.Selected() === false)
				{
					child.Selected(true);
					fireOnChange = true;
				}
			});
		});

		// Fire OnChange

		if (fireOnChange === true)
			me._internal.FireOnChange();
	}

	this.GetItemByValue = function(val)
	{
		Fit.Validation.ExpectString(val);

		var node = me.GetChild(val, true);

		if (node !== null)
		{
			return { Title: node.Title(), Value: node.Value() };
		}

		return null;
	}

	this.RevealItemInView = function(val)
	{
		Fit.Validation.ExpectString(val);

		var node = me.GetChild(val, true);

		if (node !== null)
		{
			// Expand parent nodes if selected node is a child node.
			// But only expand nodes automatically the first time to
			// allow user to collapse nodes and have them remain collapsed.
			if (revealExpandedNodes === false)
			{
				revealExpandedNodes = true;

				var parent = node;
				while ((parent = parent.GetParent()) !== null)
				{
					parent.Expanded(true);
				}
			}

			focusNode(node);
		}
	}

	this.GetHighlighted = function()
	{
		if (isNodeSet(activeNode) === true)
		{
			return { Title: activeNode.Title(), Value: activeNode.Value() };
		}

		return null;
	}

	this.PersistView = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && val !== persistView)
		{
			persistView = val;
			scrollPosition.X = 0;
			scrollPosition.Y = 0;
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
				focusFirstNode();
				firstWasHighlighted = true;
			}
		}

		return highlightFirst;
	}

	this.UpdateItemSelection = function(itemValue, selected, programmaticallyChanged)
	{
		Fit.Validation.ExpectString(itemValue);
		Fit.Validation.ExpectBoolean(selected);
		Fit.Validation.ExpectBoolean(programmaticallyChanged);

		var node = me.GetChild(itemValue, true);

		if (node !== null && node.Selected() !== selected)
		{
			if (node.Selectable() === false)
				return false; // Cancel, node is not selectable

			node.Selected(selected); // Fires OnSelect (which fires OnItemSelectionChanging) and OnSelected (which fires OnItemSelectionChanged)

			if (node.Selected() !== selected)
				return false; // An event handler has canceled change, node's selection state was not updated - return false to prevent host control from adding item
		}
	}

	this._internal = (this._internal ? this._internal : {});

	this._internal.InitializePicker = function() // Override function from PickerBase
	{
		isPicker = true;
		me._internal.Data("picker", "true");
	}

	this._internal.ReportFocused = function(focused) // Override function from PickerBase
	{
		Fit.Validation.ExpectBoolean(focused);
		hostFocused = focused;
	}

	this._internal.FireOnSelectAll = function(selected, node) // Make function available to derivatives
	{
		Fit.Validation.ExpectBoolean(selected);
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode, true);

		return fireEventHandlers(onSelectAllHandlers, { Selected: selected, Node: node || null });
	}

	this._internal.FireOnSelectAllComplete = function(selected, node) // Make function available to derivatives
	{
		Fit.Validation.ExpectBoolean(selected);
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode, true);

		fireEventHandlers(onSelectAllCompleteHandlers, { Selected: selected, Node: node || null });
	}

	this._internal.FocusFirstNode = function() // Similar implementation in Fit.Controls.ListView._internal.FocusFirstItem()
	{
		// If picker is still visible (it might have been hidden if user closed
		// host control while data was being loaded/populated async.) then focus first node.
		if (Fit.Dom.IsVisible(me.GetDomElement()) === true)
		{
			focusFirstNode();
			firstWasHighlighted = true;
		}
	}

    this.HandleEvent = function(e)
    {
		Fit.Validation.ExpectEvent(e, true);

		var ev = Fit.Events.GetEvent(e);

		if (ev.type === "keydown")
		{
			rootNode.GetDomElement().onkeydown(e);

			if (ev.keyCode === 37 || ev.keyCode === 39) // Left/Right
				return false; // Suppress, left/right is reserved for expanding/collapsing nodes
			if (ev.keyCode === 32) // Space
				return false; // Suppress, space is reserved for selecting nodes
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

	// ============================================
	// Private
	// ============================================

	function executeWithNoOnChange(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		me._internal.ExecuteWithNoOnChange(cb);
	}

	function executeRecursively(node, cb)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
		Fit.Validation.ExpectFunction(cb);

		if (cb(node) === false)
			return false;

		Fit.Array.ForEach(node.GetChildren(), function(child)
		{
			if (executeRecursively(child, cb) === false)
				return false;
		});
	}

	function createInternalCollection()
	{
		var selected = [];
		return selected;
	}

	function repaint()
	{
		// In some cases, IE8 does not repaint Treeview properly.
		// This often happens when modifying the TreeView programmatically.
		// Calling this function resolves the problem.

		if (isIe8 === true)
		{
			me.AddCssClass("FitUi_Non_Existing_TreeView_Class");
			me.RemoveCssClass("FitUi_Non_Existing_TreeView_Class");
		}
	}

	function toggleNodeSelection(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);

		if (node.Selected() === true && allowDeselect === false)
			return;

		// TreeViewNodeInterface now takes care of deselecting an existing node if in Single Selection Mode,
		// but prevents selection change if currently selected node is non-selectable (read only).
		// See Select and FireSelect functions on TreeViewNodeInterface for details.
		// Node itself is responsible for firing OnChange which also happens through TreeViewNodeInterface.
		node.Selected(!node.Selected());
	}

	function focusNode(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);

		// Only set node active if it is visible (not hidden by collapsed parent, not
		// hidden by closed DropDown control when used as picker, not hidden using
		// styles such as display:none, and not disconnected from (not rooted in) DOM).
		// RevealItemInView() may be triggered asynchronously by WSDropDown when loading
		// nodes, in which case user may have closed dropdown while waiting for data,
		// resulting in node no longer being visible to focus.
		// We use offsetParent further down which is only available for elements in
		// the render tree - "visible" elements. Furthermore scroll position cannot be
		// determined when control is not visible (part of render tree).
		if (Fit.Dom.IsVisible(node.GetDomElement()) === false)
		{
			if (isPicker === true)
			{
				// Picker is invisible, but we would still like active node to
				// be set so keyboard navigation uses this as offset, rather than
				// starting from the top again. Therefore, if node passed is visible
				// in the hierarcy (not hidden behind collapsed nodes), then use it.

				nodeIsVisibleInHierarchy = true;

				var parent = node;
				while ((parent = parent.GetParent()) !== null)
				{
					if (parent.Expanded() === false)
					{
						nodeIsVisibleInHierarchy = false;
						break;
					}
				}

				if (nodeIsVisibleInHierarchy === true)
				{
					if (isNodeSet(activeNode) === true)
					{
						Fit.Dom.Data(activeNode.GetDomElement(), "active", null);
					}

					activeNode = node;
					Fit.Dom.Data(activeNode.GetDomElement(), "active", "true");
				}
			}

			return;
		}

		if (isPicker === true)
		{
			// Since host control has focus, we use the "active" data attribute
			// to indicate that the node has focus, even though it has not,
			// and keep a reference to the "pseudo focused" node in activeNode.

			if (isNodeSet(activeNode) === true)
				Fit.Dom.Data(activeNode.GetDomElement(), "active", null);

			activeNode = node;
			Fit.Dom.Data(activeNode.GetDomElement(), "active", "true");

			// Scroll active node into view if necessary.
			// This is a bit expensive, especially if we navigate up the
			// tree from 5+ nested levels, and hold down the arrow key.

			// Get node position within control

			// Get position relative to offset parent (parent node) which has position:relative
			var nodePositionWithinControl = { X: activeNode.GetDomElement().offsetLeft, Y: activeNode.GetDomElement().offsetTop };

			// Get node position all the way up to the div.FitUiControl control container which has position:relative
			var offsetParent = activeNode.GetDomElement().offsetParent;
			while (offsetParent !== me.GetDomElement())
			{
				nodePositionWithinControl.X += offsetParent.offsetLeft;
				nodePositionWithinControl.Y += offsetParent.offsetTop;

				offsetParent = offsetParent.offsetParent;
			}

			// Get node height

			var nodeHeightWithoutChildren = -1;

			var childrenContainer = ((activeNode.GetChildren().length > 0) ? activeNode.GetChildren()[0].GetDomElement().parentElement : null);

			if (childrenContainer !== null)
				childrenContainer.style.display = "none";

			nodeHeightWithoutChildren = activeNode.GetDomElement().offsetHeight;

			if (childrenContainer !== null)
				childrenContainer.style.display = "";

			// Scroll item into view

			// Vertical scroll
			if (nodePositionWithinControl.Y > (me.GetDomElement().scrollTop + me.GetDomElement().clientHeight - nodeHeightWithoutChildren) || nodePositionWithinControl.Y < me.GetDomElement().scrollTop)
				me.GetDomElement().scrollTop = Math.ceil(nodePositionWithinControl.Y - (me.GetDomElement().clientHeight / 2)); // Horizontal center

			// Horizontal scroll
			if (activeNode.GetLevel() > 2)
				me.GetDomElement().scrollLeft = Math.ceil(nodePositionWithinControl.X);
			else
				me.GetDomElement().scrollLeft = 0;

			repaint();
		}
		else
		{
			node.Focused(true);
		}
	}

	function focusFirstNode() // Focus first node in TreeView
	{
		if (rootNode.GetChildren().length > 0)
		{
			focusNode(rootNode.GetChildren()[0]);
		}
	}

	function unsetActiveNode() // Unset picker selection
	{
		if (isNodeSet(activeNode) === true)
		{
			Fit.Dom.Data(activeNode.GetDomElement(), "active", null);
			activeNode = null;
		}
	}

	function isNodeSet(node) // Used to check whether activeNode is set and that it has not been disposed
	{
		// TODO: It does not seem that isNodeSet(..) serves a purpose anymore.
		// Since the introduction of Dissociate on treeViewNodeInterface, activeNode
		// is nullified whenever a node is either removed or disposed. Theoretically
		// a disposed node could be set via SetActiveNode(..), but we don't need to
		// guard against incorrect usecases like that.
		// The use of isNodeSet(activeNode) can probably be replaced by: activeNode !== null
		return (node !== null && node.GetDomElement() !== null); // GetDomElement() returns null if node has been disposed
	}

	function getNodeFocused()
	{
		// Returns focused node or null - active node is not actually focused when TreeView is used as picker control but merely highlighted
		return ((Fit.Dom.GetFocused() && Fit.Dom.GetFocused().tagName === "LI" && Fit.Dom.GetFocused()._internal && Fit.Dom.Contained(rootContainer, Fit.Dom.GetFocused()) === true) ? Fit.Dom.GetFocused()._internal.Node : null);
	}

	function getNodeAbove(node, noLastOnExpand)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
		Fit.Validation.ExpectBoolean(noLastOnExpand, true);

		// Get parent node
		var parent = node.GetParent();
		parent = ((parent !== null) ? parent : rootNode);

		// Find current node's position in parent node
		var children = parent.GetChildren();
		var idx = Fit.Array.GetIndex(children, node);

		// Select node above current node, within same parent
		var next = ((idx > 0) ? children[idx-1] : null);

		if (noLastOnExpand === true)
			return next;

		// Now make sure the last node in a hierarchy
		// of expanded nodes gets selected.

		if (next !== null)
		{
			while (next.Expanded() === true)
			{
				children = next.GetChildren();
				next = children[children.length - 1];
			}
		}
		else
		{
			// Current node is top node within parent - select parent
			next = node.GetParent();
		}

		return next;
	}

	function getNodeBelow(node, noFirstOnExpand, noSkipToParent)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
		Fit.Validation.ExpectBoolean(noFirstOnExpand, true);
		Fit.Validation.ExpectBoolean(noSkipToParent, true);

		if (node.Expanded() === true && noFirstOnExpand !== true) // Select first child if current node is expanded
		{
			var children = node.GetChildren();
			return children[0];
		}
		else // Get node below current node within same level (parent)
		{
			// Get parent node

			var parent = node.GetParent();
			parent = ((parent !== null) ? parent : rootNode);

			// Find current node's position in parent node
			var children = parent.GetChildren();
			var idx = Fit.Array.GetIndex(children, node);

			// Select node below current node, within same parent
			var next = ((children.length - 1 >= idx + 1) ? children[idx+1] : null);

			if (noSkipToParent === true || next !== null || node.GetParent() === null) // Found, or last element within root node (in which case next variable is Null)
				return next;

			// No more nodes within parent - select node below parent

			return getNodeBelow(parent, true);
		}
	}

	function openContextMenu(node, pos) // pos is optional
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);

		if (ctx === null)
			return;

		if (fireEventHandlers(onContextMenuHandlers, node) === false)
			return;

		if (Fit.Validation.IsSet(pos) === true)
			ctx.Show(pos.X, pos.Y);
		else
			ctx.Show();
	}

	function fireEventHandlers(handlers, evObj)
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (cb(me, evObj) === false)
				cancel = true; // Do NOT cancel loop though! All handlers must be fired!
		});

		return !cancel;
	}

	function decodeReserved(str)
	{
		Fit.Validation.ExpectString(str);
		return str.replace(/%3B/g, ";").replace(/%3D/g, "="); // Decode characters reserved for value format
	}

	function encodeReserved(str)
	{
		Fit.Validation.ExpectString(str);
		return str.replace(/;/g, "%3B").replace(/=/g, "%3D"); // Encode characters reserved for value format
	}

	init();
}

/// <container name="Fit.Controls.TreeViewNodeOptions">
/// 	<description> Options for TreeViewNode </description>
/// 	<member name="HtmlAllowed" type="boolean" default="undefined"> Value indicating whether HTML is allowed (shown) in TreeView node </member>
/// </container>

/// <function container="Fit.Controls.TreeViewNode" name="TreeViewNode" access="public">
/// 	<description> Create instance of TreeViewNode </description>
/// 	<param name="displayTitle" type="string"> Node title </param>
/// 	<param name="nodeValue" type="string"> Node value </param>
/// 	<param name="options" type="Fit.Controls.TreeViewNodeOptions" default="undefined"> Optional options </param>
/// </function>
Fit.Controls.TreeViewNode = function(displayTitle, nodeValue, options)
{
	Fit.Validation.ExpectString(displayTitle);
	Fit.Validation.ExpectString(nodeValue);
	Fit.Validation.ExpectObject(options, true);
	Fit.Validation.ExpectBoolean((options || {}).HtmlAllowed, true);

	var me = this;
	var nodeTitle = null;
	var elmLi = null;
	var elmUl = null;
	var cmdToggle = null;
	var chkSelect = null;
	var lblTitle = null;
	var childrenIndexed = {};
	var childrenArray = [];
	var lastChild = null;
	var behavioralNodeCallback = null;
	var htmlAllowed = options && options.HtmlAllowed === true || false;

	// ============================================
	// Init
	// ============================================

	function init()
	{
		elmLi = document.createElement("li");
		cmdToggle = document.createElement("div");
		lblTitle = document.createElement("span");

		me.Title(displayTitle);
		Fit.Dom.Data(elmLi, "value", encode(nodeValue));

		Fit.Dom.Data(elmLi, "state", "static");
		Fit.Dom.Data(elmLi, "selectable", "false");
		Fit.Dom.Data(elmLi, "selected", "false");
		Fit.Dom.Data(elmLi, "last", "false");

		elmLi.tabIndex = 0; // Make focusable

		elmLi.appendChild(cmdToggle);
		elmLi.appendChild(lblTitle);

		elmLi._internal = { Node: me, TreeView: null, TreeViewConfigOverrides: { Selectable: undefined, ShowCheckbox: undefined, ShowSelectAll: undefined } };
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.TreeViewNode" name="HtmlAllowed" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether HTML is allowed (shown) in TreeView node </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables support for HTML, False disables it </param>
	/// 	<param name="recursive" type="boolean" default="undefined"> If defined, True applies change recursively to children </param>
	/// </function>
	this.HtmlAllowed = function(val, recursive)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(recursive, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			htmlAllowed = val;

			// Update view - optionally update children recursively

			me.Title(me.Title());

			if (recursive === true)
			{
				Fit.Array.ForEach(childrenArray, function(child)
				{
					child.HtmlAllowed(val, true);
				});
			}
		}

		return htmlAllowed;
	}

	/// <function container="Fit.Controls.TreeViewNode" name="Title" access="public" returns="string">
	/// 	<description> Get/set node title </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, node title is updated </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			nodeTitle = val;

			if (htmlAllowed === false)
			{
				Fit.Dom.Text(lblTitle, Fit.String.StripHtml(val));
			}
			else
			{
				lblTitle.innerHTML = val;

				// Make sure any contained links do not receive focus when navigating TreeView with Tab/Shift+Tab
				Fit.Array.ForEach(lblTitle.getElementsByTagName("a"), function(link) { link.tabIndex = -1; });
			}
		}

		return nodeTitle;
	}

	/// <function container="Fit.Controls.TreeViewNode" name="Value" access="public" returns="string">
	/// 	<description> Get node value </description>
	/// </function>
	this.Value = function()
	{
		return nodeValue; // Read only - value has been used on parent node as index (childrenIndexed)
	}

	/// <function container="Fit.Controls.TreeViewNode" name="Expanded" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether node is expanded </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True expands node, False collapses it </param>
	/// </function>
	this.Expanded = function(expand)
	{
		Fit.Validation.ExpectBoolean(expand, true);

		if (Fit.Validation.IsSet(expand) === true && Fit.Dom.Data(elmLi, "state") !== "static" && me.Expanded() !== expand)
		{
			var tv = elmLi._internal.TreeView;

			// Fire OnToggle event

			if (tv !== null && tv.FireToggle(me) === false)
				return (Fit.Dom.Data(elmLi, "state") === "expanded");

			// Update state

			Fit.Dom.Data(elmLi, "state", ((expand === true) ? "expanded" : "collapsed"));

			// Repaint and fire OnToggled event

			if (tv !== null)
			{
				tv.Repaint();
				tv.FireToggled(me);
			}
		}

		return (Fit.Dom.Data(elmLi, "state") === "expanded");
	}

	/// <function container="Fit.Controls.TreeViewTypeDefs" name="CancelableBehavioralNodeCallback" returns="boolean | void">
	/// 	<description> Behavioral node callback </description>
	/// 	<param name="sender" type="Fit.Controls.TreeViewNode"> Instance of TreeViewNode </param>
	/// 	<param name="selected" type="boolean"> Value indicating new selection state </param>
	/// </function>

	/// <function container="Fit.Controls.TreeViewNode" name="SetBehavioralNodeCallback" access="public">
	/// 	<description>
	/// 		Set callback invoked when node is selected.
	/// 		A behavioral node is not considered data, so selecting it will not change
	/// 		the control value. Since the node is not considered data, it will not trigger
	/// 		the OnSelect and OnSelected TreeView events either.
	/// 		Callback receives two arguments:
	/// 		Sender (Fit.Controls.TreeViewNode) and Selected (boolean value indicating new selection state).
	/// 		Callback may cancel changed selection state by returning False.
	/// 	</description>
	/// 	<param name="func" type="Fit.Controls.TreeViewTypeDefs.CancelableBehavioralNodeCallback | null">
	/// 		Callback function invoked when node is selected - Null disables behavioral state
	/// 	</param>
	/// </function>
	this.SetBehavioralNodeCallback = function(func)
	{
		Fit.Validation.ExpectFunction(func !== null ? func : function() {});
		behavioralNodeCallback = func;
	}

	/// <function container="Fit.Controls.TreeViewNode" name="IsBehavioralNode" access="public" returns="boolean">
	/// 	<description> Returns True if this is a behavioral node, otherwise False - see SetBehavioralNodeCallback for more details </description>
	/// </function>
	this.IsBehavioralNode = function()
	{
		return behavioralNodeCallback !== null;
	}

	/// <function container="Fit.Controls.TreeViewNode" name="Selectable" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether user can change node selection state </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables node selection, False disables it </param>
	/// 	<param name="showCheckbox" type="boolean" default="false"> If defined, True adds a selection checkbox, False removes it </param>
	/* 	<param name="showSelectAll" type="boolean" default="false"> If defined, True adds a Select All checkbox useful for selecting all children, False removes it </param> */
	/// </function>
	this.Selectable = function(val, showCheckbox, showSelectAll)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(showCheckbox, true);
		Fit.Validation.ExpectBoolean(showSelectAll, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			// Prevent node from obtaining configuration from TreeView if explicitly set
			// before adding node to TreeView. See AddChild(..) for TreeViewConfigOverrides usage.
			elmLi._internal.TreeViewConfigOverrides.Selectable = val;
			elmLi._internal.TreeViewConfigOverrides.ShowCheckbox = showCheckbox;
			elmLi._internal.TreeViewConfigOverrides.ShowSelectAll = showSelectAll;

			Fit.Dom.Data(elmLi, "selectable", val.toString());

			if (showCheckbox === true && chkSelect === null)
			{
				chkSelect = document.createElement("input");
				chkSelect.type = "checkbox";
				chkSelect.tabIndex = "-1";
				chkSelect.checked = me.Selected();

				// Alternatively use Fit.UI CheckBox (will most likely need changes to CSS to adjust position and size)
				// Also search for chkSelect._FitControl to find related changes if this is enabled at some point!
				/*var chk = new Fit.Controls.CheckBox(Fit.Data.CreateGuid());
				chkSelect = chk.GetDomElement();
				chk.OnChange(function(sender)
				{
					chkSelect.checked = chk.Checked();
				});
				chkSelect._FitControl = chk;*/

				Fit.Dom.InsertBefore(lblTitle, chkSelect);
			}
			else if (showCheckbox === false && chkSelect !== null)
			{
				Fit.Dom.Remove(chkSelect);
				chkSelect = null;
			}

			if (chkSelect !== null)
			{
				chkSelect.disabled = ((val === false) ? true : false);
				//chkSelect._FitControl.Enabled(val); // Related to alternative use of Fit.UI CheckBox
			}
		}

		return (Fit.Dom.Data(elmLi, "selectable") === "true");
	}

	/// <function container="Fit.Controls.TreeViewNode" name="HasCheckbox" access="public" returns="boolean">
	/// 	<description> Get value indicating whether node has its selection checkbox enabled </description>
	/// </function>
	this.HasCheckbox = function()
	{
		return (chkSelect !== null);
	}

	/// <function container="Fit.Controls.TreeViewNode" name="Selected" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether node is selected.
	/// 		If node is selected, it will automatically be made
	/// 		selectable, if not already done so.
	/// 	</description>
	/// 	<param name="select" type="boolean" default="undefined"> If defined, True selects node, False deselects it </param>
	/// </function>
	this.Selected = function(select, suppressOnChange) // suppressOnChange is for internal use only!
	{
		Fit.Validation.ExpectBoolean(select, true);

		// Notice:
		// Nodes are responsible for keeping the TreeView current
		// in regards to selected nodes, through the TreeViewNodeInterface.
		// If this approach was not used, TreeView would have to
		// iterate recursively over all nodes to determine which
		// nodes are selected, which would be too expensive for
		// huge tree views containing thousands of nodes.

		if (Fit.Validation.IsSet(select) === true && me.Selected() !== select)
		{
			var tv = elmLi._internal.TreeView;

			if (behavioralNodeCallback !== null)
			{
				if (behavioralNodeCallback(me, !me.Selected()) === false)
				{
					return (Fit.Dom.Data(elmLi, "selected") === "true");
				}
			}

			// Fire OnSelect event

			if (behavioralNodeCallback === null)
			{
				if (tv !== null && tv.FireSelect(me) === false)
				{
					return (Fit.Dom.Data(elmLi, "selected") === "true");
				}
			}

			var wasSelected = me.Selected();

			// Update state

			Fit.Dom.Data(elmLi, "selected", select.toString());

			if (chkSelect !== null)
				chkSelect.checked = select;

			// Repaint

			if (tv !== null)
				tv.Repaint();

			// Synchronize selection to TreeView (unless this was a behavioral node (not a data node))

			if (behavioralNodeCallback === null && tv !== null)
			{
				if (select === true && wasSelected === false)
				{
					tv.Select(me);
					tv.FireSelected(me);

					if (suppressOnChange !== true)
						tv.FireOnChange();
				}
				else if (select === false && wasSelected === true)
				{
					tv.Deselect(me);
					tv.FireSelected(me);

					if (suppressOnChange !== true)
						tv.FireOnChange();
				}
			}
		}

		return (Fit.Dom.Data(elmLi, "selected") === "true");
	}

	/// <function container="Fit.Controls.TreeViewNode" name="Focused" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether node has focus </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True assigns focus, False removes it (blur) </param>
	/// </function>
	this.Focused = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true)
			{
				if (Fit.Dom.IsVisible(elmLi) === true)
				{
					elmLi.focus();
				}
			}
			else if (Fit.Dom.GetFocused() === elmLi)
			{
				elmLi.blur();
			}
		}

		return (Fit.Dom.GetFocused() === elmLi);
	}

	/// <function container="Fit.Controls.TreeViewNode" name="GetParent" access="public" returns="Fit.Controls.TreeViewNode | null">
	/// 	<description> Get parent node - returns Null if node has no parent </description>
	/// </function>
	this.GetParent = function()
	{
		if (!elmLi.parentElement)
			return null; // Not rooted in another node yet
			if (!elmLi.parentElement.parentElement._internal || !elmLi.parentElement.parentElement._internal.TreeView) // Notice: _internal may have been set by e.g. Fit.Events.AddHandler
			return null; // Rooted, but not in another node - most likely rooted in TreeView UL container
		if (elmLi.parentElement.parentElement._internal.Node.Value() === "TREEVIEW_ROOT_NODE")
			return null; // Indicate top by returning Null when root node is reached

		return elmLi.parentElement.parentElement._internal.Node;
	}

	/// <function container="Fit.Controls.TreeViewNode" name="GetTreeView" access="public" returns="Fit.Controls.TreeView | null">
	/// 	<description> Returns TreeView if associated, otherwise Null </description>
	/// </function>
	this.GetTreeView = function()
	{
		if (elmLi._internal.TreeView !== null)
			return elmLi._internal.TreeView.GetTreeView();

		return null;
	}

	/// <function container="Fit.Controls.TreeViewNode" name="GetLevel" access="public" returns="integer">
	/// 	<description> Get node depth in current hierarchy - root node is considered level 0 </description>
	/// </function>
	this.GetLevel = function()
	{
		var level = 0;
		var node = me;

		while ((node = node.GetParent()) !== null) // Parent is Null when no more nodes are found, and when TREEVIEW_ROOT_NODE is reached for nodes rooted in TreeView
		{
			level++;
		}

		return level;
	}

	/// <function container="Fit.Controls.TreeViewNode" name="GetIndex" access="public" returns="integer">
	/// 	<description> Get node index (position in parent node or TreeView) - returns -1 if node has not been added yet </description>
	/// </function>
	this.GetIndex = function()
	{
		if (me.GetTreeView() === null)
		{
			return -1;
		}

		return Fit.Dom.GetIndex(me.GetDomElement());
	}

	/// <function container="Fit.Controls.TreeViewNode" name="AddChild" access="public">
	/// 	<description> Add child node </description>
	/// 	<param name="node" type="Fit.Controls.TreeViewNode"> Node to add </param>
	/// 	<param name="atIndex" type="integer" default="undefined"> Optional index at which node is added </param>
	/// </function>
	this.AddChild = function(node, atIndex)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
		Fit.Validation.ExpectInteger(atIndex, true);

		// Remove node from existing parent if already rooted.
		// This is important to make sure that TreeView, from which
		// node is moved, is updated to reflect the change, and
		// to ensure that node (and its children) is no longer capable
		// of updating the old TreeView through its TreeViewNodeInterface.

		if (node.GetParent() !== null)
			node.GetParent().RemoveChild(node);
		if (node.GetTreeView() !== null)
			node.GetTreeView().RemoveChild(node);

		// Register child node.
		// This is done prior to firing any events so that event handlers
		// can rely on node being fully accessible through DOM (rooted).

		// Create child container (<ul>) if not already added
		if (elmUl === null)
		{
			elmUl = document.createElement("ul");
			elmLi.appendChild(elmUl);

			Fit.Dom.Data(elmLi, "state", "collapsed");
		}

		if (Fit.Validation.IsSet(atIndex) === false || lastChild === null || atIndex > lastChild.GetIndex())
		{
			// Make sure last node is marked as such, allowing for specialized CSS behaviour
			if (lastChild !== null)
				Fit.Dom.Data(lastChild.GetDomElement(), "last", "false");
			Fit.Dom.Data(node.GetDomElement(), "last", "true");
			lastChild = node;
		}

		// Add child to DOM and internal collections
		if (lastChild === node)
		{
			elmUl.appendChild(node.GetDomElement());
			childrenIndexed[node.Value()] = node;
			Fit.Array.Add(childrenArray, node);
		}
		else
		{
			Fit.Dom.InsertAt(elmUl, atIndex, node.GetDomElement());
			childrenIndexed[node.Value()] = node;
			Fit.Array.Insert(childrenArray, atIndex, node);
		}

		// Changing data attribute above requires repaint in IE8
		// for dynamically added nodes to render helper lines properly.
		if (elmLi._internal.TreeView !== null)
			elmLi._internal.TreeView.Repaint();

		// Behavioral node support

		if (node.IsBehavioralNode() === true)
		{
			executeRecursively(node, function(n)
			{
				n.GetDomElement()._internal.TreeView = elmLi._internal.TreeView;
			});

			return; // Skip remaining wiring - behavioral nodes are not considered data, so it should not fire OnSelect, OnSelected, and OnChange
		}

		// Configure TreeView association and synchronize selection state

		var tv = elmLi._internal.TreeView;

		if (tv !== null)
		{
			var selected = [];
			var fireOnChange = false;

			executeRecursively(node, function(n)
			{
				//n.GetDomElement()._internal.TreeView = null; // Avoid conflicts if node currently belongs to another TreeView (e.g. drag and drop)

				if (n.Selected() === true)
				{
					// Deselect node which allows us to reselect it later and have all
					// relevant events fired with appropriate current selection state set
					// (OnSelect with Selected = false, and OnSelected with Selected = true).
					Fit.Array.Add(selected, n);
					n.Selected(false); // Does not fire any events since TreeViewNodeInterface is not set yet
				}

				n.GetDomElement()._internal.TreeView = tv;
				var ovr = n.GetDomElement()._internal.TreeViewConfigOverrides;

				// Configure node like TreeView, unless node has been explicitly configured (see TreeViewConfigOverrides)
				n.Selectable(((Fit.Validation.IsSet(ovr.Selectable) === true) ? ovr.Selectable : tv.IsSelectable()), ((Fit.Validation.IsSet(ovr.ShowCheckbox) === true) ? ovr.ShowCheckbox : tv.IsMultiSelect()), ((Fit.Validation.IsSet(ovr.ShowSelectAll) === true) ? ovr.ShowSelectAll : tv.ShowSelectAll()));
			});

			// Re-select nodes initially selected

			Fit.Array.ForEach(selected, function(node)
			{
				// Notice that TreeViewNodeInterface is temporarily removed to prevent
				// node.Selected(true) from firing events - we do not want OnChange to be
				// fired multiple times, so we fire only OnSelect and OnSelected below.
				// DISABLED: This is garbage! Functions such as node.GetTreeView() or node.Expanded(true)
				// will not work properly with this approach from e.g. an OnSelected event handler! Fixed
				// by passing an argument to node.Selected(..) instead which suppresses the OnChange event.
				/*node.GetDomElement()._internal.TreeView = null;

				if (tv.FireSelect(node) === true)
				{
					node.Selected(true);
					tv.Select(node);
					tv.FireSelected(node);
					fireOnChange = true;
				}

				node.GetDomElement()._internal.TreeView = tv;*/

				var wasSelected = node.Selected();
				var newSelection = node.Selected(true, true); // Second True is an internal argument suppressing firing of the OnChange event

				if (wasSelected !== newSelection)
				{
					fireOnChange = true;
				}
			});

			// if (tv.GetTreeView().Enabled() === false)
			// {
			// 	tv.GetTreeView().Enabled(true);
			// 	tv.GetTreeView().Enabled(false);
			// }

			// Fire OnChange if selections were made

			if (fireOnChange === true)
				tv.FireOnChange();
		}
	}

	/// <function container="Fit.Controls.TreeViewNode" name="RemoveChild" access="public">
	/// 	<description> Remove child node - this does not result in TreeView.OnSelect and TreeView.OnSelected being fired for selected nodes </description>
	/// 	<param name="node" type="Fit.Controls.TreeViewNode"> Node to remove </param>
	/// </function>
	this.RemoveChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);

		if (node.GetParent() === me || (me.Value() === "TREEVIEW_ROOT_NODE" && me.GetTreeView().GetChild(node.Value()) !== null))
		{
			// Deconfigure TreeView association and synchronize selection state

			var tv = node.GetDomElement()._internal.TreeView;

			if (tv !== null)
			{
				// Deselecting selected nodes in TreeView

				var fireOnChange = false;

				executeRecursively(node, function(n)
				{
					if (n.Selected() === true)
					{
						// Node itself remains selected, this only removes node from TreeView's internal selection collection.
						// Notice that OnSelect and OnSelected is not fired since the node is not actually deselected, only removed from TreeView.
						tv.Deselect(n);

						fireOnChange = true;
					}

					n.GetDomElement()._internal.TreeView = null; // Make sure removed node cannot update TreeView anymore
				});

				tv.Dissociate(node);

				if (fireOnChange === true)
					tv.FireOnChange();
			}

			// Remove from DOM

			elmUl.removeChild(node.GetDomElement());
			delete childrenIndexed[node.Value()];
			Fit.Array.Remove(childrenArray, node);

			if (childrenArray.length === 0)
			{
				elmLi.removeChild(elmUl);
				elmUl = null;
				Fit.Dom.Data(elmLi, "state", "static");
			}

			// Update last node

			if (node === lastChild)
			{
				lastChild = null;
				Fit.Dom.Data(node.GetDomElement(), "last", "false");

				if (childrenArray.length > 0)
				{
					lastChild = childrenArray[childrenArray.length - 1];
					Fit.Dom.Data(lastChild.GetDomElement(), "last", "true");
				}
			}

			// Make sure helper lines are repainted on IE8
			if (elmLi._internal.TreeView !== null)
				elmLi._internal.TreeView.Repaint();
		}
	}

	/// <function container="Fit.Controls.TreeViewNode" name="GetChild" access="public" returns="Fit.Controls.TreeViewNode | null">
	/// 	<description> Get node by value - returns Null if not found </description>
	/// 	<param name="val" type="string"> Node value </param>
	/// 	<param name="recursive" type="boolean" default="false"> If defined, True enables recursive search </param>
	/// </function>
	this.GetChild = function(val, recursive)
	{
		Fit.Validation.ExpectString(val);
		Fit.Validation.ExpectBoolean(recursive, true);

		var node = childrenIndexed[val];

		if (node === undefined && recursive === true)
		{
			var found = null;
			Fit.Array.ForEach(childrenArray, function(child)
			{
				found = child.GetChild(val, recursive);

				if (found !== null)
					return false;
			});
			return found;
		}

		return ((node !== undefined) ? node : null);
	}

	/// <function container="Fit.Controls.TreeViewNode" name="GetChildren" access="public" returns="Fit.Controls.TreeViewNode[]">
	/// 	<description> Get all children </description>
	/// </function>
	this.GetChildren = function()
	{
		return Fit.Array.Copy(childrenArray); // Copy to prevent changes to internal children array
	}

	/// <function container="Fit.Controls.TreeViewNode" name="Dispose" access="public">
	/// 	<description> Destroys object to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		// This will destroy node - it will no longer work!

		// Dispose children
		Fit.Array.ForEach(Fit.Array.Copy(childrenArray), function(child) { child.Dispose(); });

		// Remove from DOM

		var parentNode = me.GetParent();

		if (parentNode !== null)
		{
			parentNode.RemoveChild(me);
		}
		else
		{
			if (me.GetTreeView() !== null)
			{
				me.GetTreeView().RemoveChild(me);
			}
			else
			{
				Fit.Dom.Remove(elmLi);
			}
		}

		// Dispose private members
		me = nodeTitle = elmLi = elmUl = cmdToggle = chkSelect = lblTitle = childrenIndexed = childrenArray = lastChild = behavioralNodeCallback = htmlAllowed = null;
	}

	/// <function container="Fit.Controls.TreeViewNode" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing node </description>
	/// </function>
	this.GetDomElement = function()
	{
		return elmLi;
	}

	// Private

	function executeRecursively(node, cb)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
		Fit.Validation.ExpectFunction(cb);

		if (cb(node) === false)
			return false;

		Fit.Array.ForEach(node.GetChildren(), function(child)
		{
			if (executeRecursively(child, cb) === false)
				return false;
		});
	}

	/*function decode(str)
	{
		Fit.Validation.ExpectString(str);
		return decodeURIComponent(str); // Turn string back to original value
	}*/

	function encode(str)
	{
		Fit.Validation.ExpectString(str);
		return encodeURIComponent(str); // Allow value to be stored in a HTML Data Attribute
	}

	init();
}

Fit.Controls.TreeView.Node = Fit.Controls.TreeViewNode; // Backward compatibility
