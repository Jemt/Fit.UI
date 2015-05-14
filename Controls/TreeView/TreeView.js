/// <container name="Fit.Controls.TreeView">
/// 	TreeView control allowing data to be listed in a structured manner.
/// 	Inheriting from Fit.Controls.ControlBase.
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
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.TreeView = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var rootContainer = null;		// UL element
	var rootNode = null;			// Fit.Controls.TreeView.Node instance

	var selectable = false;
	var multiSelect = false;
	var showSelectAll = false;

	var selected = createInternalCollection();
	var selectedOrg = [];

	// These events fire when user interacts with the tree,
	// NOT when nodes are manipulated programmatically!
	// OnSelect and OnToggle can be canceled by returning False.
	// OnChange event is always fired when state of nodes are
	// manipulated, also when done programmatically.
	var onSelectHandlers = [];
	var onSelectedHandlers = [];
	var onToggleHandlers = [];
	var onToggledHandlers = [];

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
		me._internal.Data("wordwrap", "false")

		// Create internal root node to hold children

		rootContainer = document.createElement("ul");
		me._internal.AddDomElement(rootContainer);

		rootNode = new Fit.Controls.TreeView.Node(" ", "TREEVIEW_ROOT_NODE");
		rootNode.GetDomElement().tabIndex = -1;
		rootContainer.appendChild(rootNode.GetDomElement());

		// TreeView Node Interface:
		// The Tree View Node Interface allow nodes to synchronize their selected state to the TreeView.
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
				// Unselect selected node if Multi Selection is not enabled
				if (multiSelect === false && selected.length > 0)
					executeWithNoOnChange(function() { selected[0].Selected(false) });

				// Add node to internal selection and fire OnChange
				Fit.Array.Add(selected, node);
				me._internal.FireOnChange();
			},
			Deselect: function(node)
			{
				// Remove node from internal selection and fire OnChange
				Fit.Array.Remove(selected, node);
				me._internal.FireOnChange();
			},
			Selected: function(val)
			{
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
				return fireEventHandlers(onToggleHandlers, node);
			},
			FireToggled: function(node)
			{
				return fireEventHandlers(onToggledHandlers, node);
			},
			FireSelect: function(node)
			{
				return fireEventHandlers(onSelectHandlers, node);
			},
			FireSelected: function(node)
			{
				return fireEventHandlers(onSelectedHandlers, node);
			}
		}

		rootNode.GetDomElement()._internal.TreeView = treeViewNodeInterface;

		// Event handling

		rootNode.GetDomElement().onkeydown = function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			var elm = Fit.Events.GetTarget(e);

			// Variable elm above is almost always a <li> node element since we make sure only these elements are focused.
			// when node is clicked or keyboard navigation occure. However, IF the node title for some strange reason contains an element
			// that gains focus (e.g. an input control), that element could be contained in the elm variable when onkeydown is fired.
			// We already make sure that <a> link elements do not gain focus which is more likely to be used as node title, so there
			// is almost no chance the elm variable will ever contain anything else but the <li> node element. But better safe than sorry.
			if (elm.tagName !== "LI")
				return;

			var node = elm._internal.Node;

			// Handle navigation links

			if (ev.keyCode === 13) // Enter
			{
				if (node.Selectable() === true && me.AutoPostBack() === true && document.forms.length > 0)
				{
					//  Auto postback

					node.Selected(true);
					document.forms[0].submit();
				}
				else
				{
					// Navigate link contained in item

					var links = node.GetDomElement().getElementsByTagName("a");

					if (links.length === 1)
						links[0].click();
				}

				Fit.Events.PreventDefault(ev);
				return;
			}

			// Toggle selection

			if (ev.keyCode === 32) // Spacebar (toggle selection)
			{
				if (node.Selectable() === true)
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
					if (node.Expanded() === true)
						node.Expanded(false);
				}
				else
				{
					next = node.GetParent();

					if (next === rootNode)
						next = null;
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

				// Find current node's position in parent node
				var children = node.GetParent().GetChildren();
				var idx = Fit.Array.GetIndex(children, node);

				// Select node above current node, within same parent
				next = ((idx > 0) ? children[idx-1] : null);

				if (next !== null)
				{
					// Now make sure the last node in a hierarchy
					// of expanded nodes gets selected.
					while (next.Expanded() === true)
					{
						children = next.GetChildren();
						next = children[children.length - 1];
					}
				}
				else
				{
					// Current node is top node within parent.
					// Move selection to parent, unless this is the hidden root node.

					next = node.GetParent();

					if (next === rootNode)
						next = null;

				}

				Fit.Events.PreventDefault(ev);
			}
			else if (ev.keyCode === 40) // Down
			{
				// Move selection down

				if (node.Expanded() === true)
				{
					// Select first child if current node is expanded
					var children = node.GetChildren();
					next = children[0];
				}
				else
				{
					// Get node below current bide within same level (parent)

					// Find current node's position in parent node
					var children = node.GetParent().GetChildren();
					var idx = Fit.Array.GetIndex(children, node);

					// Select node below current node, within same parent
					next = ((children.length - 1 >= idx + 1) ? children[idx+1] : null);

					// If no node within same level was found, traverse tree
					// bottom-up until a parent is found that has a node below current node.

					var parent = node.GetParent();
					var grandParent = parent.GetParent();

					while (next === null && parent !== null && grandParent !== null)
					{
						// Find parent's position within grandparent
						children = grandParent.GetChildren();
						idx = Fit.Array.GetIndex(children, parent);

						// Select node below parent if this is not the last node,
						// or set Null to continue traversing tree bottom-up.
						next = ((idx+1 <= children.length-1) ? children[idx+1] : null);

						parent = parent.GetParent();
						grandParent = parent.GetParent();
					}
				}

				Fit.Events.PreventDefault(ev);
			}

			// Focus next node

			if (next !== null)
				next.Focused(true);
		}

		rootNode.GetDomElement().onclick = function(e)
		{
			var elm = Fit.Events.GetTarget(e);
			var nodeElm = ((elm.tagName === "LI") ? elm : Fit.Dom.GetParentOfType(elm, "LI"));
			var node = nodeElm._internal.Node;

			// Focus node
			node.Focused(true);

			// Toggle node if expand button was clicked
			if (elm.tagName === "DIV")
				node.Expanded(!node.Expanded());

			// Toggle selection or perform auto postback if node is selectable
			if (elm.tagName !== "DIV" && node.Selectable() === true)
			{
				if (me.AutoPostBack() === true && document.forms.length > 0)
				{
					node.Selected(true);
					document.forms[0].submit();
				}
				else
				{
					toggleNodeSelection(node);
				}
			}
		}

		rootNode.GetDomElement().ondblclick = function(e)
		{
			var elm = Fit.Events.GetTarget(e);
			var nodeElm = ((elm.tagName === "LI") ? elm : Fit.Dom.GetParentOfType(elm, "LI"));
			var node = nodeElm._internal.Node;

			// Toggle node on double click
			if (node.GetChildren().length > 0)
				node.Expanded(!node.Expanded());
		}

		// Make value available from post back data

		var txtValue = document.createElement("input");
		txtValue.type = "hidden";
		txtValue.name = me.GetId();
		me._internal.AddDomElement(txtValue);

		me.OnChange(function(sender, value)
		{
			txtValue.value = value.toString();
		});
	}

	// Public

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

	/// <function container="Fit.Controls.TreeView" name="Selectable" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether user can change selection state of nodes.
	/// 		This affects all contained nodes. To configure nodes
	/// 		individually, use Selectable(..) function on node instances.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables node selection, False disables it </param>
	/// 	<param name="multi" type="boolean" default="false"> If defined, True enables node multi selection, False disables it </param>
	/// 	<param name="showSelAll" type="boolean" default="false"> If defined, True enables Select All checkbox, False disables it </param>
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

			me._internal.Data("selectable", selectable.toString());
			me._internal.Data("multiselect", multiSelect.toString());

			var fireOnChange = (selected.length > 0);

			selected = createInternalCollection();

			// Deselect all children and make sure they are configured identically
			executeWithNoOnChange(function() // Prevent n.Selected(false) from firering OnChange event
			{
				executeRecursively(rootNode, function(n)
				{
					if (n === rootNode)
						return; // Skip root node itself

					n.Selectable(selectable, multiSelect, showSelectAll)
					n.Selected(false);
				});
			});

			repaint();

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		return selectable;
	}

	/// <function container="Fit.Controls.TreeView" name="Selected" access="public" returns="Fit.Controls.TreeView.Node[]">
	/// 	<description> Get/set selected nodes </description>
	/// 	<param name="val" type="Fit.Controls.TreeView.Node[]" default="undefined"> If defined, provided nodes are selected </param>
	/// </function>
	this.Selected = function(val)
	{
		Fit.Validation.ExpectArray(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			selectedOrg = [];
			executeWithNoOnChange(function() // Prevent node.Selected(true) from firering OnChange event
			{
				me.Clear();

				Fit.Array.ForEach(val, function(node)
				{
					Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

					Fit.Array.Add(selectedOrg, node);
					node.Selected(true); // Adds node to internal selected collection through TreeViewNodeInterface
				});
			});

			me._internal.FireOnChange();
		}

		return selected;
	}

	/// <function container="Fit.Controls.TreeView" name="Value" access="public" returns="object">
	/// 	<description>
	/// 		Fit.Controls.ControlBase.Value override:
	/// 		Get/set selected nodes.
	/// 		Updating selection can be done by either providing a collection of
	/// 		Fit.Controls.TreeView.Node instances, or a string with a semicolon
	/// 		separated list of node values.
	/// 	</description>
	/// 	<param name="val" type="object" default="undefined"> If defined, provided nodes are selected </param>
	/// </function>
	this.Value = function(val)
	{
		if (Fit.Validation.IsSet(val) === true)
		{
			if (val instanceof Array)
			{
				me.Selected(val);
			}
			else if (typeof(val) === "string")
			{
				selectedOrg = [];
				executeWithNoOnChange(function()
				{
					me.Clear();

					var values = val.toString().split(";");

					Fit.Array.ForEach(values, function(nodeVal)
					{
						var child = me.GetChild(nodeVal, true);

						if (child !== null)
							child.Selected(true);
					});

					/*executeRecursively(rootNode, function(node)
					{
						node.Selected(Fit.Array.Contains(values, node.Value()));
					});*/
				});

				me._internal.FireOnChange();
			}
			else
			{
				Fit.Validation.ThrowError("Unsupported value type");
			}
		}

		return me.Selected();
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

	/// <function container="Fit.Controls.TreeView" name="Clear" access="public">
	/// 	<description>
	/// 		Fit.Controls.ControlBase.Clear override:
	/// 		Clear control value.
	/// 		Override allows for non-selectable nodes to keep their selected state.
	/// 		This is useful if TreeView has been configured to preselect some non-selectable
	/// 		nodes, hence preventing the user from removing these selections. In that case the
	/// 		desired functionality of the Clear function could be to preserve these preselections.
	/// 	</description>
	/// 	<param name="preserveNonSelectable" type="boolean" default="false">
	/// 		True causes selected state of non-selectable nodes to be preserved, False do not
	/// 	</param>
	/// </function>
	this.Clear = function(preserveNonSelectable)
	{
		if (selected.length === 0)
			return;

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

		me._internal.FireOnChange();
	}

	/// <function container="Fit.Controls.TreeView" name="AutoPostBack" access="public" returns="boolean">
	/// 	<description> Set flag indicating whether TreeView should post back changes automatically </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables auto post back, False disables it </param>
	/// </function>
	this.AutoPostBack = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			me._internal.Data("autopost", val.toString());
		}

		return (me._internal.Data("autopost") === "true");
	}

	/// <function container="Fit.Controls.TreeView" name="AddChild" access="public">
	/// 	<description> Add node to TreeView </description>
	/// 	<param name="node" type="Fit.Controls.TreeView.Node"> Node to add </param>
	/// </function>
	this.AddChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
		rootNode.AddChild(node);
	}

	/// <function container="Fit.Controls.TreeView" name="RemoveChild" access="public">
	/// 	<description> Remove node from TreeView </description>
	/// 	<param name="node" type="Fit.Controls.TreeView.Node"> Node to remove </param>
	/// </function>
	this.RemoveChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
		rootNode.RemoveChild(node);
	}

	/// <function container="Fit.Controls.TreeView" name="RemoveAllChildren" access="public">
	/// 	<description> Remove all nodes contained in TreeView </description>
	/// 	<param name="dispose" type="boolean" default="false"> Set True to dispose nodes </param>
	/// </function>
	this.RemoveAllChildren = function(dispose)
	{
		Fit.Validation.ExpectBoolean(dispose, true);

		me.Clear(); // Fires OnChange if selections were made

		executeWithNoOnChange(function()
		{
			var children = Fit.Array.Copy(rootNode.GetChildren());

			Fit.Array.ForEach(children, function(child)
			{
				if (dispose === true)
					child.Dispose();
				else
					rootNode.RemoveChild(child);
			});
		});
	}

	/// <function container="Fit.Controls.TreeView" name="GetChild" access="public" returns="Fit.Controls.TreeView.Node">
	/// 	<description> Get node by value - returns Null if not found </description>
	/// 	<param name="val" type="string"> Node value </param>
	/// 	<param name="recursive" type="boolean" default="false"> If defined, True enables recursive search </param>
	/// </function>
	this.GetChild = function(val, recursive)
	{
		Fit.Validation.ExpectStringValue(val);
		Fit.Validation.ExpectBoolean(recursive, true);

		return rootNode.GetChild(val, recursive);
	}

	/// <function container="Fit.Controls.TreeView" name="GetChildren" access="public" returns="Fit.Controls.TreeView.Node[]">
	/// 	<description> Get all children </description>
	/// </function>
	this.GetChildren = function()
	{
		return rootNode.GetChildren();
	}

	/// <function container="Fit.Controls.TreeView" name="GetAllNodes" access="public" returns="Fit.Controls.TreeView.Node[]">
	/// 	<description> Return all nodes across all children and their children, in a flat structure </description>
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

	// See documentation on ControlBase
	var baseDispose = me.Dispose;
	this.Dispose = function()
	{
		// This will destroy control - it will no longer work!

		rootNode.Dispose();
		me = rootContainer = rootNode = selectable = multiSelect = showSelectAll = selected = selectedOrg = onSelectHandlers = onSelectedHandlers = onToggleHandlers = onToggledHandlers = isIe8 = null;
		baseDispose();
	}

	// ============================================
	// Events (OnChange defined on BaseControl)
	// ============================================

	/// <function container="Fit.Controls.TreeView" name="OnSelect" access="public">
	/// 	<description>
	/// 		Add event handler fired when node is being selected.
	/// 		Selection can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnSelect = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSelectHandlers, cb);
	}

	/// <function container="Fit.Controls.TreeView" name="OnSelected" access="public">
	/// 	<description>
	/// 		Add event handler fired when node is selected.
	/// 		Selection can not be canceled. Function receives two arguments:
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
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
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
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
	/// 		Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnToggled = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onToggledHandlers, cb);
	}

	// Private

	function executeWithNoOnChange(cb)
	{
		Fit.Validation.ExpectFunction(cb);

		var onChangeHandler = me._internal.FireOnChange;
		me._internal.FireOnChange = function() {};

		var error = null;

		try // Try/catch to make absolutely sure OnChange handler is restored!
		{
			cb();
		}
		catch (err)
		{
			error = err.message;
		}

		me._internal.FireOnChange = onChangeHandler;

		if (error !== null)
			Fit.Validation.ThrowError(error);
	}
	me._internal.ExecuteWithNoOnChange = executeWithNoOnChange; // Make it available to derivatives

	function executeRecursively(node, cb)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
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

		selected.toString = function(alternativeSeparator)
		{
			Fit.Validation.ExpectStringValue(alternativeSeparator, true);

			var val = "";
			Fit.Array.ForEach(this, function(n)
			{
				val += ((val !== "") ? (alternativeSeparator ? alternativeSeparator : ";") : "") + n.Value();
			});
			return val;
		}

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
		executeWithNoOnChange(function() // Prevent OnChange from firering twice
		{
			if (multiSelect === false && selected.length > 0 && selected[0] !== node)
				selected[0].Selected(false);

			node.Selected(!node.Selected());
		});

		me._internal.FireOnChange();
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
				cancel = true; // Do NOT cancel loop though! All handlers must be fired!
		});

		return !cancel;
	}

	init();
}

/// <function container="Fit.Controls.TreeView.Node" name="Node" access="public">
/// 	<description> Create instance of TreeView Node </description>
/// 	<param name="displayTitle" type="string"> Node title </param>
/// 	<param name="nodeValue" type="string"> Node value </param>
/// </function>
Fit.Controls.TreeView.Node = function(displayTitle, nodeValue)
{
	Fit.Validation.ExpectStringValue(displayTitle);
	Fit.Validation.ExpectStringValue(nodeValue);

	var me = this;
	var elmLi = null;
	var elmUl = null;
	var cmdToggle = null;
	var chkSelectAll = null;
	var chkSelect = null;
	var lblTitle = null;
	var childrenIndexed = {};
	var childrenArray = [];
	var lastChild = null;

	// ============================================
	// Init
	// ============================================

	function init()
	{
		elmLi = document.createElement("li");
		cmdToggle = document.createElement("div");
		lblTitle = document.createElement("span");

		me.Title(displayTitle);
		Fit.Dom.Data(elmLi, "value", nodeValue);

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

	/// <function container="Fit.Controls.TreeView.Node" name="Title" access="public" returns="string">
	/// 	<description> Get/set node title </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, node title is updated </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			lblTitle.innerHTML = val;

			// Make sure any contained links do not receive focus when navigating TreeView with Tab/Shift+Tab
			Fit.Array.ForEach(lblTitle.getElementsByTagName("a"), function(link) { link.tabIndex = -1; });
		}

		return lblTitle.innerText; // Using innerText to get rid of HTML formatting
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Value" access="public" returns="string">
	/// 	<description> Get node value </description>
	/// </function>
	this.Value = function()
	{
		return Fit.Dom.Data(elmLi, "value"); // Read only - value has been used on parent node as index (childrenIndexed)
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Expanded" access="public" returns="boolean">
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

	/// <function container="Fit.Controls.TreeView.Node" name="Selectable" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether user can change node selection state </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables node selection, False disables it </param>
	/// 	<param name="showCheckbox" type="boolean" default="false"> If defined, True adds a selection checkbox, False removes it </param>
	/// 	<param name="showSelectAll" type="boolean" default="false"> If defined, True adds a Select All checkbox useful for selecting all children, False removes it </param>
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

				Fit.Dom.InsertBefore(lblTitle, chkSelect);
			}
			else if (showCheckbox === false && chkSelect !== null)
			{
				Fit.Dom.Remove(chkSelect);
				chkSelect = null;
			}

			if (chkSelect !== null)
				chkSelect.disabled = ((val === false) ? true : false);
		}

		return (Fit.Dom.Data(elmLi, "selectable") === "true");
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Selected" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether node is selected.
	/// 		If node is selected, it will automatically be made
	/// 		selectable, if not already done so.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True selects node, False deselects it </param>
	/// </function>
	this.Selected = function(select)
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

			// Fire OnSelect event

			if (tv !== null && tv.FireSelect(me) === false)
			{
				if (chkSelect !== null) // Make sure checkbox retains correct state
					chkSelect.checked = (Fit.Dom.Data(elmLi, "selected") === "true");

				return (Fit.Dom.Data(elmLi, "selected") === "true");
			}

			var wasSelected = me.Selected();

			// Update state

			Fit.Dom.Data(elmLi, "selected", select.toString());

			if (chkSelect !== null)
				chkSelect.checked = select;

			// Repaint

			if (tv !== null)
				tv.Repaint();

			// Synchronize selection to TreeView

			if (tv !== null)
			{
				if (select === true && wasSelected === false)
				{
					tv.Select(me);
				}
				else if (select === false && wasSelected === true)
				{
					tv.Deselect(me);
				}
			}

			// Fire OnSelected event

			if (tv !== null)
				tv.FireSelected(me);
		}

		return (Fit.Dom.Data(elmLi, "selected") === "true");
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Focused" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether node has focus </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True assigns focus, False removes it (blur) </param>
	/// </function>
	this.Focused = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true)
				elmLi.focus();
			else if (document.activeElement === elmLi)
				elmLi.blur();
		}

		return (document.activeElement === elmLi);
	}

	/// <function container="Fit.Controls.TreeView.Node" name="GetParent" access="public" returns="Fit.Controls.TreeView.Node">
	/// 	<description> Get parent node - returns Null if node has no parent </description>
	/// </function>
	this.GetParent = function()
	{
		if (elmLi.parentNode === null)
			return null; // Not rooted in another node yet
		if (!elmLi.parentNode.parentNode._internal)
			return null; // Rooted, but not in another node - most likely rooted in TreeView UL container

		return elmLi.parentNode.parentNode._internal.Node;
	}

	/// <function container="Fit.Controls.TreeView.Node" name="GetLevel" access="public" returns="integer">
	/// 	<description> Get node depth in current hierarchy - root node is considered level 0 </description>
	/// </function>
	this.GetLevel = function()
	{
		var level = 0;
		var node = me;

		// Parent is Null when no more nodes are found.
		// Parent value is "TREEVIEW_ROOT_NODE" when node is nested in TreeView.
		while ((node = node.GetParent()) !== null && node.Value() !== "TREEVIEW_ROOT_NODE")
		{
			level++;
		}

		return level;
	}

	/// <function container="Fit.Controls.TreeView.Node" name="AddChild" access="public">
	/// 	<description> Add child node </description>
	/// 	<param name="node" type="Fit.Controls.TreeView.Node"> Node to add </param>
	/// </function>
	this.AddChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

		if (me.GetChild(node.Value()) !== null) // Internal children collection is indexed using value - make sure it is unique
			Fit.Validation.ThrowError("A child with value '" + node.Value() + "' has already been added");

		// Configure TreeView association and synchronize selection state

		var tv = elmLi._internal.TreeView;

		if (tv !== null) // node.GetDomElement()._internal.TreeView !== tv)
		{
			var selected = [];

			executeRecursively(node, function(n)
			{
				if (n.Selected() === true)
				{
					Fit.Array.Add(selected, n);
					n.Selected(false);
				}

				n.GetDomElement()._internal.TreeView = tv;
				var ovr = n.GetDomElement()._internal.TreeViewConfigOverrides;

				// Configure node like TreeView, unless node has been explicitly configured (see TreeViewConfigOverrides)
				n.Selectable(((Fit.Validation.IsSet(ovr.Selectable) === true) ? ovr.Selectable : tv.IsSelectable()), ((Fit.Validation.IsSet(ovr.ShowCheckbox) === true) ? ovr.ShowCheckbox : tv.IsMultiSelect()), ((Fit.Validation.IsSet(ovr.ShowSelectAll) === true) ? ovr.ShowSelectAll : tv.ShowSelectAll()));
			});

			// Nodes previously selected is re-selected through TreeViewNodeInterface,
			// causing TreeView's internal selected collection to be updated appropriately.
			if (selected.length > 0)
				tv.Selected(Fit.Array.Merge(tv.Selected(), selected));
		}

		// Register child node

		// Create child container (<ul>) if not already added
		if (elmUl === null)
		{
			elmUl = document.createElement("ul");
			elmLi.appendChild(elmUl);

			Fit.Dom.Data(elmLi, "state", "collapsed");
		}

		// Make sure last node is marked as such, allowing for specialized CSS behaviour
		if (lastChild !== null)
			Fit.Dom.Data(lastChild.GetDomElement(), "last", "false");
		Fit.Dom.Data(node.GetDomElement(), "last", "true");
		lastChild = node;

		// Add child to DOM and internal collections
		elmUl.appendChild(node.GetDomElement());
		childrenIndexed[node.Value()] = node;
		Fit.Array.Add(childrenArray, node);

		// Changing data attribute above requires repaint in IE8
		// for dynamically added nodes to render helper lines properly.
		if (elmLi._internal.TreeView !== null)
			elmLi._internal.TreeView.Repaint();
	}

	/// <function container="Fit.Controls.TreeView.Node" name="RemoveChild" access="public">
	/// 	<description> Remove child node </description>
	/// 	<param name="node" type="Fit.Controls.TreeView.Node"> Node to remove </param>
	/// </function>
	this.RemoveChild = function(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);

		var parentNode = node.GetParent();
		if (parentNode === me)
		{
			// Deconfigure TreeView association and synchronize selection state

			var tv = node.GetDomElement()._internal.TreeView;

			if (tv !== null)
			{
				// Deselecting selected nodes in TreeView

				var treeSelection = tv.Selected();
				if (treeSelection.length > 0)
				{
					var selected = [];
					executeRecursively(node, function(n)
					{
						if (n.Selected() === true)
							Fit.Array.Add(selected, n);
					});

					if (selected.length > 0)
					{
						var newTreeSelection = [];
						Fit.Array.ForEach(treeSelection, function(n)
						{
							if (Fit.Array.Contains(selected, n) === false)
								Fit.Array.Add(newTreeSelection, n);
						});

						tv.Selected(newTreeSelection);
					}
				}

				// Remove reference to TreeView.
				// This cannot be done in recursive loop above since it
				// will break tv.Selected(..) - it depends on nodes being
				// able to synchronize their selected state.

				executeRecursively(node, function(n)
				{
					// Make sure removed node cannot update TreeView anymore
					n.GetDomElement()._internal.TreeView = null;
				});
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

	/// <function container="Fit.Controls.TreeView.Node" name="GetChild" access="public" returns="Fit.Controls.TreeView.Node">
	/// 	<description> Get node by value - returns Null if not found </description>
	/// 	<param name="val" type="string"> Node value </param>
	/// 	<param name="recursive" type="boolean" default="false"> If defined, True enables recursive search </param>
	/// </function>
	this.GetChild = function(val, recursive)
	{
		Fit.Validation.ExpectStringValue(val);
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

	/// <function container="Fit.Controls.TreeView.Node" name="GetChildren" access="public" returns="Fit.Controls.TreeView.Node[]">
	/// 	<description> Get all children </description>
	/// </function>
	this.GetChildren = function()
	{
		return childrenArray;
	}

	/// <function container="Fit.Controls.TreeView.Node" name="Dispose" access="public">
	/// 	<description> Destroys object to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		// This will destroy node - it will no longer work!

		// Dispose children
		Fit.Array.ForEach(childrenArray, function(child) { child.Dispose(); });

		// Remove from DOM

		var parentNode = me.GetParent();

		if (parentNode !== null)
			parentNode.RemoveChild(me);
		else
			Fit.Dom.Remove(elmLi);

		// Dispose private members
		elmLi = elmUl = cmdToggle = lblTitle = childrenIndexed = childrenArray = lastChild = selectable = chkSelect = chkSelectAll = null;
	}

	/// <function container="Fit.Controls.TreeView.Node" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get DOMElement representing node </description>
	/// </function>
	this.GetDomElement = function()
	{
		return elmLi;
	}

	// Private

	function executeRecursively(node, cb)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node);
		Fit.Validation.ExpectFunction(cb);

		if (cb(node) === false)
			return false;

		Fit.Array.ForEach(node.GetChildren(), function(child)
		{
			if (executeRecursively(child, cb) === false)
				return false;
		});
	}

	init();
}
