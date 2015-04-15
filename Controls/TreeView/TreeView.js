
// Features:
//  - WS capable
//  - DONE: Dirty aware
//  - DONE: Keyboard navigation: up/down (up/down keys), expand/collapse (left(expand)/right(collapse) keys), spacebar (select)
// Options:
//  - Focus()
//  - SelectAll checkbox
//  - DONE: Single selection
//  - DONE: Multi selection
//  - DONE: AllowNull (using Required!)
//  - DONE: Navigable (as links)
// Events:
//  - DONE: OnSelect		(before - cancellable)
//  - DONE: OnSelected		(after)
//  - DONE: OnToggle		(before - cancellable)
//  - DONE: OnToggled		(after)
//  - OnChildAdd	(WS - before)
//  - OnChildAdded	(WS - after)
//  - Fire events when nodes are set programmatically ???
//  - HandleEvent(ev) - allow keyboard events to be passed and handled.
//    Required by Outlook Picker, but also useful in conjunction with client based Unit test.

// CoreFlow: Replace FlowITTree to incorporate globally in CoreFlow!


Fit.Controls.TreeView = function(ctlId)
{
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var rootContainer = document.createElement("ul");
	var rootNode = new Fit.Controls.TreeView.Node(" ", "TREEVIEW_ROOT_NODE");

	var selectable = false;
	var multiSelect = false;
	var showSelectAll = false;
	var selected = [];
	var selectedOrg = [];

	var onSelectHandlers = [];
	var onSelectedHandlers = [];
	var onToggleHandlers = [];
	var onToggledHandlers = [];

	// Init

	me.AddCssClass("FitUiControlTreeView");
	me.Data("multiselect", "false");

	rootNode.GetDomElement().tabIndex = -1;
	rootContainer.appendChild(rootNode.GetDomElement());
	me._internal.AddDomElement(rootContainer);

	// TreeView Node Interface:
	// This allow nodes to sync. their selected state to tree.
	// It also ensures that nodes added are automatically configured
	// like the existing nodes in the TreeView (Selectable, Multi/Single, ShowSelectAll).

	var treeViewNodeInterface =
	{
		Select: function(node)
		{
			Fit.Array.Add(selected, node);
			me._internal.FireOnChange();
		},
		Deselect: function(node)
		{
			Fit.Array.Remove(selected, node);
			me._internal.FireOnChange();
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
		}
	}

	rootNode.GetDomElement()._internal.TreeView = treeViewNodeInterface;

	// Event handling

	rootNode.GetDomElement().onkeydown = function(e)
	{
		var ev = e || window.event;
		var elm = (ev.srcElement || ev.target);
		var node = null;

		if (elm.tagName === "LI")
			node = elm._internal.Node;

		if (node === null)
		{
			console.log("Node was null on Keyboard Navigation! - Event target element:");
			console.log(elm);
			return;
		}

		var focused = getNodeFocused();
		var next = null;

		//console.log("OnKeyDown", ev.keyCode);

		if (node.Value() === "TREEVIEW_ROOT_NODE")
		{
			console.log("Canceling out, fake root node!");
			return;
		}

		if (ev.keyCode === 32) // Spacebar (toggle selection)
		{
			if (node !== null && node.Selectable() === true)
			{
				toggleNodeSelection(node);
			}

			Fit.Events.PreventDefault(ev);
		}
		else if (ev.keyCode === 37) // Left (collapse or move to parent)
		{
			if (focused.Expanded() === false)
			{
				next = focused.GetParent();

				if (next.Value() === "TREEVIEW_ROOT_NODE")
					next = null;
			}
			else
			{
				if (node !== null && node.Expanded() === true)
					setNodeExpandedState(node, false);
			}

			Fit.Events.PreventDefault(ev);
		}
		else if (ev.keyCode === 39) // Right (expand)
		{
			if (node !== null && node.Expanded() === false)
				setNodeExpandedState(node, true);

			Fit.Events.PreventDefault(ev);
		}
		else if (ev.keyCode === 38) // Up
		{
			if (focused === null || focused.Value() === "TREEVIEW_ROOT_NODE")
			{
				var children = rootNode.GetChildren();
				next = ((children.length > 0) ? children[children.length-1] : null);
			}
			else
			{
				var children = focused.GetParent().GetChildren();
				var idx = Fit.Array.GetIndex(children, focused);
				next = ((idx > 0) ? children[idx-1] : null);

				if (next === null) // && focused.GetParent().GetParent() !== null)
				{
					next = focused.GetParent();

					if (next.Value() === "TREEVIEW_ROOT_NODE")
						next = null;
				}
				else if (next.Expanded() === true)
				{
					children = next.GetChildren();
					next = ((children.length > 0) ? children[children.length-1] : next);

					while (next.Expanded() === true)
					{
						children = next.GetChildren();
						next = ((children.length > 0) ? children[children.length-1] : next);
					}
				}
			}

			Fit.Events.PreventDefault(ev);
		}
		else if (ev.keyCode === 40) // Down
		{
			if (focused === null)
			{
				var children = rootNode.GetChildren();
				next = ((children.length > 0) ? children[0] : null);
			}
			else
			{
				if (focused.Expanded() === true)
				{
					var children = focused.GetChildren();
					next = ((children.length >= 0) ? children[0] : null);
				}
				else
				{
					var children = focused.GetParent().GetChildren();
					var idx = Fit.Array.GetIndex(children, focused);
					next = ((children.length - 1 >= idx + 1) ? children[idx+1] : null);

					var parent = focused.GetParent();
					while (next === null && parent !== null && parent.GetParent() !== null)
					{
						children = parent.GetParent().GetChildren();
						idx = Fit.Array.GetIndex(children, parent);
						next = ((idx > -1 && children.length - 1 >= idx + 1) ? children[idx+1] : null);

						parent = parent.GetParent();
					}
				}
			}

			Fit.Events.PreventDefault(ev);
		}
		else if (ev.keyCode === 13) // Enter
		{
			// Navigate link contained in item

			var links = ((focused !== null) ? focused.GetDomElement().getElementsByTagName("a") : []);

			if (links.length === 1 && Fit.Dom.GetParentOfType(links[0], "li") === focused.GetDomElement())
				links[0].click();

			Fit.Events.PreventDefault(ev);
		}

		if (next !== null)
		{
			if (false && isIe8 === true && (ev.keyCode === 38 || ev.keyCode === 40)) // Prevent major performance problems when focusing elements not within viewport
			{
				var scrollPos = Fit.Browser.GetScrollPosition();
				var pos = Fit.Dom.GetPosition(next.GetDomElement(), true);
				var vpDim = Fit.Browser.GetViewportDimensions();

				//console.log("ScrollPos: " + scrollPos.Y);
				//console.log("Viewport height: " + window.innerHeight);
				//console.log("Element Pos: " + pos.Y);

				if (ev.keyCode === 38 && pos.Y - 50 <= 0) // Up
					document.body.scrollTop = scrollPos.Y-400;
				else if (ev.keyCode === 40 && pos.Y + 50 >= vpDim.Height) // Down
					document.body.scrollTop = scrollPos.Y+400;
			}

			next.Focused(true);

			if (focused !== null)
				focused.Focused(false);

			focused = next;
		}

		repaint();
	}

	rootNode.GetDomElement().onclick = function(e)
	{
		var ev = e || window.event;
		var elm = (ev.srcElement || ev.target);
		var nodeElm = elm;

		if (nodeElm.tagName !== "LI")
			nodeElm = Fit.Dom.GetParentOfType(nodeElm, "LI");

		var node = nodeElm._internal.Node;

		var focused = getNodeFocused();
		if (focused !== null)
			focused.Focused(false);
		focused = node;
		node.Focused(true);

		if (elm.tagName === "DIV")
			toggleNode(node); // Expand/collapse
		else if (node.Selectable() === true)
			toggleNodeSelection(node);

		repaint();
	}

	rootNode.GetDomElement().ondblclick = function(e)
	{
		var ev = e || window.event;
		var elm = (ev.srcElement || ev.target);

		if (elm.tagName !== "LI")
			elm = Fit.Dom.GetParentOfType(elm, "LI");

		toggleNode(elm._internal.Node);

		repaint();
	}

	// Public

	this.Selectable = function(enable, multi, showSelAll)
	{
		Fit.Validation.ExpectBoolean(enable, true);
		Fit.Validation.ExpectBoolean(multi, true);
		Fit.Validation.ExpectBoolean(showSelectAll, true);

		if (Fit.Validation.IsSet(enable) === true)
		{
			selected = [];

			selectable = enable;
			multiSelect = ((multi === true) ? true : false);;
			showSelectAll = showSelAll;

			me.Data("selectable", selectable.toString());
			me.Data("multiselect", multiSelect.toString());

			executeRecursively(rootNode, function(n)
			{
				if (n.Value() === "TREEVIEW_ROOT_NODE")
					return; // Skip root node itself

				n.Selectable(enable, multiSelect, showSelectAll)
				n.Selected(false);
			});
		}

		return selectable;
	}

	this.Selected = function(nodes)
	{
		Fit.Validation.ExpectArray(nodes, true);

		if (Fit.Validation.IsSet(nodes) === true)
		{
			selectedOrg = [];
			me.Clear();

			Fit.Array.ForEach(nodes, function(node)
			{
				Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
				Fit.Array.Add(selectedOrg, node);

				node.Selected(true);
			});
		}

		return selected;
	}

	this.GetChildByValue = function(val)
	{
		var found = null;
		executeRecursively(rootNode, function(node)
		{
			if (node.Value() === val)
			{
				found = node;
				return false; // break loop
			}
		});
		return found;
	}

	this.GetValue = function()
	{
		//return me.Selected(); // Return string representation ???

		var val = "";
		Fit.Array.ForEach(selected, function(n)
		{
			val += ((val !== "") ? ", ": "") + n.Title();
		});

		return val;
	}

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

	this.ShowLines = function(val)
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

	this.Clear = function()
	{
		if (selected.length === 0)
			return;

		var sel = Fit.Core.Clone(selected); // Deselecting items causing them to be removed from internal collection - clone to avoid breaking ForEach
		Fit.Array.ForEach(sel, function(node)
		{
			console.log("Clear: " + node.Title());
			node.Selected(false); // Removes node from internal selection collection
		});

		me._internal.FireOnChange();
	}

	this.AddChild = function(node)
	{
		//node.GetDomElement()._internal.TreeView = treeViewNodeInterface;
		//node.Selectable(selectable, multiSelect, showSelectAll);

		if (node.Selected() === true)
			Fit.Array.Add(selected, node);

		rootNode.AddChild(node);
	}

	this.RemoveChild = function(node)
	{
		node.GetDomElement()._internal.TreeView = null;
		rootNode.RemoveChild(node);
	}

	this.GetChild = function(value)
	{
		return rootNode.GetChild(value);
	}

	this.GetChildren = function()
	{
		return rootNode.GetChildren();
	}

	var baseDispose = me.Dispose;
	this.Dispose = function()
	{
		rootNode.Dispose();
		baseDispose();
	}

	this.OnSelect = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectHandlers, cb);
	}

	this.OnSelected = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectedHandlers, cb);
	}

	this.OnToggle = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onToggleHandlers, cb);
	}

	this.OnToggled = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onToggledHandlers, cb);
	}

	// Private

	function executeRecursively(node, cb)
	{
		if (cb(node) === false)
			return;

		Fit.Array.ForEach(node.GetChildren(), function(child)
		{
			executeRecursively(child, cb);
		});
	}

	function OLDOLDOLDmakeSelectableRecursively(node, enable, multi, showSelectAll)
	{
		/*executeRecursively(node, function(n)
		{
			n.Selectable(enable, multi, showSelectAll)
			n.Selected(false);
		});*/



		/*node.Selectable(enable, multi, showSelectAll)
		node.Selected(false);

		Fit.Array.ForEach(node.GetChildren(), function(child)
		{
			makeSelectableRecursively(child, enable, multi, showSelectAll);
		});*/
	}

	var isIe8 = (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version === 8);
	function repaint()
	{
		//console.log(Fit.Browser.GetInfo().Name);
		//console.log(Fit.Browser.GetInfo().Version);

		if (isIe8 === true)
		{
			//console.log("Repainting for IE8");
			// Force re-paint on IE8
			rootContainer.style.zoom = 1;
			rootContainer.style.zoom = 0;
		}
	}

	function toggleNodeSelection(node)
	{
		if (fireEventHandlers(onSelectHandlers, node) === true)
		{
			//if (multiSelect === false && node.Selected() === false)
				//me.Clear();

			if (multiSelect === false)
				me.Clear();

			node.Selected(!node.Selected());

			if (node.Selected() === true)
			{
				/*if (multiSelect === false)
				{
					me.Clear(); // WAY to performance demanding, but only certain way of clearing entire tree since nodes can be set individually!

					if (lastSelection !== null && node !== lastSelection)
						lastSelection.Selected(false);
					lastSelection = node;
				}
				else
				{
					Fit.Array.Add(selected, node);
				}*/

				//Fit.Array.Add(selected, node);
			}
			else
			{
				/*if (multiSelect === false)
					me.Clear();
				else*/
					//Fit.Array.Remove(selected, node);

				/*if (multiSelect === false)
				{
					if (node === lastSelection)
						lastSelection = null;
				}
				else
				{
					Fit.Array.Remove(selected, node);
				}*/

				//Fit.Array.Remove(selected, node);
			}

			fireEventHandlers(onSelectedHandlers, node);
			me._internal.FireOnChange();
		}
		else // Event canceled
		{
			node.Selected(node.Selected()); // Make sure Checkbox keeps old state
		}
	}

	function toggleNode(node) // expand/collapse)
	{
		if (fireEventHandlers(onToggleHandlers, node) === true)
		{
			setNodeExpandedState(node, !node.Expanded()); //node.Toggle();

			fireEventHandlers(onToggledHandlers, node);
			repaint();
		}
	}

	function setNodeExpandedState(node, expanded)
	{
		if (fireEventHandlers(onToggleHandlers, node) === true)
		{
			if (isIe8 === true)
			{
				//node.GetDomElement().getElementsByTagName("ul")[0].style.display = (node.Expanded() === false ? "block" : "none");

				// Must be set when using Keyboard Navigation, otherwise expand/collapse breaks, causes IE to fall into CompatMode, and causes page to scroll up.
				if (node.GetChildren().length > 0)
				{
					node.GetDomElement().getElementsByTagName("ul")[0].style.display = (expanded === true ? "block" : "none");

					/*if (useIe8Fix === true)
						node.GetDomElement().getElementsByTagName("ul")[0].style.display = (expanded === true ? "block" : "none");
					else
						node.GetDomElement().getElementsByTagName("ul")[0].style.display = "";*/
				}
			}

			node.Expanded(expanded);
			fireEventHandlers(onToggledHandlers, node);
			repaint();
		}
	}

	function getNodeFocused()
	{
		return ((document.activeElement && document.activeElement.tagName === "LI" && document.activeElement._internal) ? document.activeElement._internal.Node : null);
	}

	function fireEventHandlers(handlers, node)
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (cb(me, node) === false)
				cancel = true;
		});

		return !cancel;
	}
}

Fit.Controls.TreeView.Node = function(displayTitle, nodeValue) // TODO: Inherit from ControlBase ???
{
	Fit.Validation.ExpectStringValue(displayTitle);
	Fit.Validation.ExpectStringValue(nodeValue);

	// Init

	var me = this;
	var elmLi = document.createElement("li");
	var elmUl = null;
	var cmdToggle = document.createElement("div");
	var lblTitle = document.createElement("span");
	var childrenIndexed = {}; // Performance - super fast node lookup using GetChild("value") - indexed
	var lastChild = null;

	var selectable = false;
	var chkSelect = null;
	var chkSelectAll = null;

	lblTitle.innerHTML = displayTitle;
	Fit.Dom.Data(elmLi, "value", nodeValue);
	Fit.Dom.Data(elmLi, "state", "static");
	Fit.Dom.Data(elmLi, "selectable", "false");
	Fit.Dom.Data(elmLi, "selected", "false");

	elmLi.tabIndex = 0; // Make selectable to allow keyboard navigation


	//elmLi.onfocus = function() { console.log("I got focus!"); }
	//elmLi.onblur = function() { console.log("I LOST focus!"); }


	elmLi.appendChild(cmdToggle);
	elmLi.appendChild(lblTitle);

	elmLi._internal = { Node: me, TreeView: null }; // Performance - super fast access to TreeView.Node instance when DOM node is clicked

	// Public

	this.Toggle = function()
	{
		var state = Fit.Dom.Data(elmLi, "state");

		if (state === "static")
			return;

		Fit.Dom.Data(elmLi, "state", ((state === "collapsed") ? "expanded" : "collapsed"));

		// Force IE8 to repaint - user must move mouse around to get expand/collapse to work if omitted!
		elmLi.className = elmLi.className;
	}

	this.Title = function(newValue)
	{
		Fit.Validation.ExpectString(newValue, true);

		if (Fit.Validation.IsSet(newValue) === true)
			lblTitle.innerHTML = newValue;

		return lblTitle.innerText; // Using innerText to get rid of any HTML - TODO: Good idea returning value different from value originally set ??? innerHTML is not much better since e.g. & is encoded into &amp;
	}

	this.Value = function(newValue)
	{
		Fit.Validation.ExpectString(newValue, true);

		if (Fit.Validation.IsSet(newValue) === true)
			Fit.Dom.Data(elmLi, "value", newValue);

		return Fit.Dom.Data(elmLi, "value");
	}

	this.Expanded = function(expand)
	{
		Fit.Validation.ExpectBoolean(expand, true);

		if (Fit.Validation.IsSet(expand) === true && Fit.Dom.Data(elmLi, "state") !== "static")
		{
			Fit.Dom.Data(elmLi, "state", ((expand === true) ? "expanded" : "collapsed"));
		}

		return (Fit.Dom.Data(elmLi, "state") === "expanded");
	}

	this.Selectable = function(enable, showCheckbox, showSelectAll)
	{
		Fit.Validation.ExpectBoolean(enable, true);
		Fit.Validation.ExpectBoolean(showCheckbox, true);
		Fit.Validation.ExpectBoolean(showSelectAll, true);

		if (Fit.Validation.IsSet(enable) === true)
		{
			Fit.Dom.Data(elmLi, "selectable", enable.toString());

			if (enable === false)
				Fit.Dom.Data(elmLi, "selected", "false");

			if (enable === true && showCheckbox === true && chkSelect === null)
			{
				chkSelect = document.createElement("input"); // TODO: Use Fit.Controls.Checkbox once ready !
				chkSelect.type = "checkbox";
				chkSelect.tabIndex = "-1";
				chkSelect.checked = me.Selected();

				Fit.Dom.InsertBefore(lblTitle, chkSelect);
			}
			//else if (enable === true && showCheckbox === false && chkSelect !== null)
			else if ((enable === false || showCheckbox === false) && chkSelect !== null)
			{
				Fit.Dom.Remove(chkSelect);
				chkSelect = null;
			}
		}

		return (Fit.Dom.Data(elmLi, "selectable") === "true");
	}

	this.Selected = function(select) // NOTICE: Only TreeView should use this, as manually setting node's Selected state doesn't cause it to be internally selected in TreeView, nor does it fire events
	{
		Fit.Validation.ExpectBoolean(select, true);

		if (Fit.Validation.IsSet(select) === true)
		{
			Fit.Dom.Data(elmLi, "selected", select.toString());

			if (chkSelect !== null)
				chkSelect.checked = select;

			if (elmLi._internal.TreeView !== null)
			{
				if (select === true)
					elmLi._internal.TreeView.Select(me);
				else
					elmLi._internal.TreeView.Deselect(me);
			}
		}

		return (Fit.Dom.Data(elmLi, "selected") === "true");
	}

	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true)
		{
			//////Fit.Dom.Data(elmLi, "focused", focus.toString());

			if (focus === true)
			{
				elmLi.focus();
			}
			else
			{
				elmLi.blur();

				if (chkSelect !== null)
					chkSelect.blur();
			}

			/*if (chkSelect !== null)
			{
				if (focus === true)
					chkSelect.focus();
				else
					chkSelect.blur();
			}*/


		}

		//////return (Fit.Dom.Data(elmLi, "focused") === "true");

		return (document.activeElement === elmLi);
	}

	this.GetParent = function()
	{
		var parentDomNode = elmLi.parentNode.parentNode;
		return ((parentDomNode._internal) ? parentDomNode._internal.Node : null);
	}

	this.AddChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

		// Make sure two nodes with identical values are not added
		var existing = me.GetChild(node.Value()); // No worries, this is super fast!
		if (existing !== null)
			Fit.Validation.ThrowError("Node with value '" + node.Value() + "' already added"); //me.RemoveChild(existing);

		// Configure TreeView association

		if (elmLi._internal.TreeView !== null)
		{
			var tv = elmLi._internal.TreeView;

			if (node.GetDomElement()._internal.TreeView !== tv)
			{
				console.log("Recursively setting up TreeView interface");

				executeRecursively(node, function(n)
				{
					n.GetDomElement()._internal.TreeView = elmLi._internal.TreeView;
					n.Selectable(tv.IsSelectable(), tv.IsMultiSelect(), tv.ShowSelectAll());
				});
			}
		}

		// Register child node

		// Create child container (<ul>) if not already added
		if (elmUl === null)
		{
			elmUl = document.createElement("ul");
			elmLi.appendChild(elmUl);

			Fit.Dom.Data(elmLi, "state", "collapsed");
		}

		if (lastChild !== null)
			Fit.Dom.Data(lastChild.GetDomElement(), "last", "false");
		Fit.Dom.Data(node.GetDomElement(), "last", "true");
		lastChild = node;

		elmUl.appendChild(node.GetDomElement());
		childrenIndexed[node.Value()] = node;
	}

	this.RemoveChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

		if (node.Selected() === true)
			node.Selected(false); // Make sure node does not stay in TreeView's internal selection

		var parentNode = node.GetParent();

		if (parentNode === me)
		{
			elmUl.removeChild(node.GetDomElement());
			delete childrenIndexed[node.Value()];

			if (childrenIndexed.length === 0)
			{
				elmLi.removeChild(elmUl);
				Fit.Dom.Data(elmLi, "state", "static");
			}
		}
	}

	this.GetChild = function(value)
	{
		var node = childrenIndexed[value];
		return node || null;
	}

	this.GetChildren = function()
	{
		var arr = [];
		Fit.Array.ForEach(childrenIndexed, function(key)
		{
			Fit.Array.Add(arr, childrenIndexed[key]);
		});

		return arr;
	}

	this.Dispose = function()
	{
		var parentNode = me.GetParent();

		if (parentNode !== null)
		{
			parentNode.RemoveChild(me);
		}
		else
		{
			elmLi.parentNode.removeChild(elmLi);
		}
	}

	this.GetDomElement = function()
	{
		return elmLi;
	}


	// Private

	function executeRecursively(node, cb)
	{
		if (cb(node) === false)
			return;

		Fit.Array.ForEach(node.GetChildren(), function(child)
		{
			executeRecursively(child, cb);
		});
	}
}
