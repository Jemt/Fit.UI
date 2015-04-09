
// TODO: Tilfoej expand/collapse ikoner foran noderne.
//       Hvis ikonet bliver foerste element i <li> elementet, saa
//       soerg for at opdatere de steder hvor der staar:
//       elm.firstElementChild - pt. antages at <ul> elementet i
//       <li> elementet er foerste element!


//Fit.Array.ForEach(document.querySelectorAll("li"), function(l) { new Fit.DragDrop.Draggable(l); });


Fit.Controls.TreeView = function(ctlId)
{
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	// WS capable !

	var me = this;
	var rootNode = new Fit.Controls.TreeView.Node(" ", "HIDDEN_ROOT_NODE");

	rootNode.GetDomElement().ondblclick = function(e)
	{
		var ev = e || window.event;
		var nodeElm = (ev.srcElement || ev.target);

		if (nodeElm.tagName === "LI")
		{
			var node = nodeElm._internal.Node;

			var newTitle = prompt("Enter new title", node.Title());
			node.Title(newTitle);
		}
	}

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
	me._internal.AddDomElement(rootNode.GetDomElement());

	this.ShowLines = function(val)
	{
		if (val === true)
		{
			me.AddCssClass("FitUiControlTreeViewLines");
			me.AddCssClass("FitUiControlTreeViewDotLines");
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

	/*var baseGetDomElement = me.GetDomElement;
	this.GetDomElement = function()
	{
		var container = baseGetDomElement();
		container.innerHTML = "";

		if (me.GetChildren().length > 0)
			//container.appendChild(rootNode.GetDomElement().firstElementChild.nextSibling.nextSibling); // Node is a list item - add it's <ul> children container
			container.appendChild(rootNode.GetDomElement());

		return container;
	}*/
}


/*<li data-value="1471" data-title="Title here">
	<div data-state="expanded"></div>
	<input type="checkbox">
	<ul>
		<li>Children here..</li>
	</ul>
</li>*/

/*<li data-value="1471" data-title="Title here" data-state="collapsed">
	<div></div>
	<ul>
		<li>Children here..</li>
	</ul>
</li>*/


/*<li data-value="1471" data-title="Title here" data-state="collapsed">
	<div>
	<input type="checkbox">
	<ul>
		<li>Children here..</li>
	</ul>
</li>*/

Fit.Controls.TreeView.Node = function(displayTitle, nodeValue)
{
	Fit.Validation.ExpectStringValue(displayTitle);
	Fit.Validation.ExpectStringValue(nodeValue);

	var me = this;
	var elmLi = document.createElement("li");
	var elmUl = null;
	var childrenIndexed = {}; // Performance - super fast node lookup using GetChild("value") - indexed
	var lastChild = null;

	// Register title and value as data-* attributes which makes
	// them available to CSS engine, e.g. content: attr(data-value);
	Fit.Dom.Data(elmLi, "title", displayTitle);
	Fit.Dom.Data(elmLi, "value", nodeValue);
	Fit.Dom.Data(elmLi, "state", "static");

	var cmdToggle = document.createElement("div");
	/*cmdToggle.onclick = function()
	{
		// TODO: MOVE EVENT HANDLER TO TREE!! NO NEED TO REGISTER A MILLION HANDLERS !!!

		var state = Fit.Dom.Data(elmLi, "state");

		if (state === "static")
			return;

		Fit.Dom.Data(elmLi, "state", ((state === "collapsed") ? "expanded" : "collapsed"));

		// Force IE8 to repaint - user must move mouse around to get expand/collapse to work if omitted!
		elmLi.className = elmLi.className;
	}*/
	elmLi.appendChild(cmdToggle);

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

		if (newValue)
			Fit.Dom.Data(elmLi, "title", newValue);

		return Fit.Dom.Data(elmLi, "title");
	}

	this.Value = function(newValue)
	{
		Fit.Validation.ExpectString(newValue, true);

		if (newValue)
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

		var existing = me.GetChild(node.Value()); // No worries, this is super fast!
		if (existing !== null)
			me.RemoveChild(existing); // TODO: Throw exception instead ???

		// Create child container (<ul>) if not already added
		if (elmUl === null)
		{
			elmUl = document.createElement("ul");
			elmLi.appendChild(elmUl);

			Fit.Dom.Data(elmLi, "state", "collapsed");
		}

		if (lastChild !== null)
			Fit.Dom.Data(lastChild.GetDomElement(), "last", ""); // TODO: Adds empty attribute to all nodes!!!!!
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
