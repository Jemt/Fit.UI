
// TODO: Make it WS capable !

// Options:
//  - PreOpened levels
//  - Single selection
//  - Multi selection


Fit.Controls.TreeView = function(ctlId)
{
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var rootContainer = document.createElement("ul");
	var rootNode = new Fit.Controls.TreeView.Node(" ", "TREEVIEW_ROOT_NODE");

	// Init

	rootNode.GetDomElement().onclick = function(e)
	{
		var ev = e || window.event;
		var cmdToggleElm = (ev.srcElement || ev.target);

		if (cmdToggleElm.tagName === "DIV")
		{
			var node = cmdToggleElm.parentNode._internal.Node;
			node.Toggle();
		}
	}

	me.AddCssClass("FitUiControlTreeView");
	rootContainer.appendChild(rootNode.GetDomElement());
	me._internal.AddDomElement(rootContainer);

	// Public

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

		if (Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() === 8)
		{
			// IE8 doesn't re-paint tree properly when switching lines
			// on and off on-the-fly. Removing and re-adding to DOM resolves the problem.
			me._internal.RemoveDomElement(rootNode.GetDomElement());
			me._internal.AddDomElement(rootNode.GetDomElement());
		}
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
}

Fit.Controls.TreeView.Node = function(displayTitle, nodeValue)
{
	Fit.Validation.ExpectStringValue(displayTitle);
	Fit.Validation.ExpectStringValue(nodeValue);

	var me = this;
	var elmLi = document.createElement("li");
	var elmUl = null;
	var cmdToggle = document.createElement("div");
	var lblTitle = document.createElement("span");
	var childrenIndexed = {}; // Performance - super fast node lookup using GetChild("value") - indexed
	var lastChild = null;

	lblTitle.innerHTML = displayTitle;
	Fit.Dom.Data(elmLi, "value", nodeValue);
	Fit.Dom.Data(elmLi, "state", "static");

	elmLi.appendChild(cmdToggle);
	elmLi.appendChild(lblTitle);

	elmLi._internal = { Node: me }; // Performance - super fast access to TreeView.Node instance when DOM node is clicked

	// Functions

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

		elmLi.innerHTML = newValue;
		return elmLi.innerHTML;
	}

	this.Value = function(newValue)
	{
		Fit.Validation.ExpectString(newValue, true);

		Fit.Dom.Data(elmLi, "value", newValue);
		return Fit.Dom.Data(elmLi, "value");
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
}
