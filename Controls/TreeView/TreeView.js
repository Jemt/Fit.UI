
// TODO: Make it WS capable !

// Options:
//  - PreOpened levels
//  - Single selection
//  - Multi selection (+ SelectAll)
//  - Navigable (navigate on click)


Fit.Controls.TreeView = function(ctlId)
{
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var rootContainer = document.createElement("ul");
	var rootNode = new Fit.Controls.TreeView.Node(" ", "TREEVIEW_ROOT_NODE");
	//rootNode.Selectable(false);

	var lastSelection = null;
	var multiSelect = true;
	var selected = [];

	// Init

	rootNode.GetDomElement().onclick = function(e)
	{
		var ev = e || window.event;
		var elm = (ev.srcElement || ev.target);

		if (elm.tagName === "DIV") // Expand/collapse toggle button
		{
			var node = elm.parentNode._internal.Node;
			node.Toggle();

			repaint();
		}
		else if (elm.tagName === "SPAN" || elm.tagName === "INPUT") // Node title or checkbox
		{
			var node = elm.parentNode._internal.Node;

			node.Selected(!node.Selected());

			if (node.Selected() === true)
			{
				if (multiSelect === false)
				{
					if (lastSelection !== null && node !== lastSelection)
						lastSelection.Selected(false);
					lastSelection = node;
				}
				else
				{
					Fit.Array.Add(selected, node);
				}
			}
			else
			{
				if (multiSelect === false)
				{
					if (node === lastSelection)
						lastSelection = null;
				}
				else
				{
					Fit.Array.Remove(selected, node);
				}
			}

			console.log(selected);
			console.log(lastSelection);
		}
	}

	me.AddCssClass("FitUiControlTreeView");
	rootContainer.appendChild(rootNode.GetDomElement());
	me._internal.AddDomElement(rootContainer);

	// Public

	this.Selectable = function(enable, multi, showSelectAll)
	{
		return rootNode.Selectable(enable, multi, showSelectAll); // TODO: RECURSIVELY!!!
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

	this.AddChild = function(node)
	{
		rootNode.AddChild(node);
	}

	this.RemoveChild = function(node)
	{
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

	// Private

	var isIe8 = (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() === 8);
	function repaint()
	{
		if (isIe8 === true)
		{
			// Force re-paint on IE8
			rootContainer.style.zoom = 1;
			rootContainer.style.zoom = 0;
		}
	}
}

Fit.Controls.TreeView.Node = function(displayTitle, nodeValue)
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

	elmLi.appendChild(cmdToggle);
	elmLi.appendChild(lblTitle);

	elmLi._internal = { Node: me }; // Performance - super fast access to TreeView.Node instance when DOM node is clicked

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

		return lblTitle.innerHTML;
	}

	this.Value = function(newValue)
	{
		Fit.Validation.ExpectString(newValue, true);

		if (Fit.Validation.IsSet(newValue) === true)
			Fit.Dom.Data(elmLi, "value", newValue);

		return Fit.Dom.Data(elmLi, "value");
	}

	this.Selectable = function(enable, showCheckbox, showSelectAll)
	{
		Fit.Validation.ExpectBoolean(enable, true);

		if (Fit.Validation.IsSet(enable) === true)
		{
			Fit.Dom.Data(elmLi, "selectable", enable.toString());

			if (enable === true && chkSelect === null)
			{
				chkSelect = document.createElement("input");
				chkSelect.type = "checkbox";
				Fit.Dom.InsertBefore(lblTitle, chkSelect);
			}
			else if (enable === false && chkSelect !== null)
			{
				if (chkSelect !== null)
				{
					Fit.Dom.Remove(chkSelect);
					chkSelect = null;
				}
			}
		}

		return (Fit.Dom.Data(elmLi, "selectable") === "true");
	}

	this.Selected = function(select)
	{
		Fit.Validation.ExpectBoolean(select, true);

		if (Fit.Validation.IsSet(select) === true)
		{
			Fit.Dom.Data(elmLi, "selected", select.toString());

			if (chkSelect !== null)
				chkSelect.checked = select;
		}

		return (Fit.Dom.Data(elmLi, "selected") === "true");
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

	me.Selectable(true, true, true);
}
