/// <container name="Fit.Controls.WSTreeView">
/// 	TreeView control allowing data from a
/// 	WebService to be listed in a structured manner.
/// 	Inheriting from Fit.Controls.TreeView.
/// </container>

/// <function container="Fit.Controls.WSTreeView" name="WSTreeView" access="public">
/// 	<description> Create instance of WSTreeView control </description>
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.WSTreeView = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.TreeView).Apply(ctlId);

	var me = this;
	var url = null;
	var loadDataOnInit = true;
	var onRequestHandlers = [];
	var onResponseHandlers = [];
	var onPopulatedHandlers = [];

	function init()
	{
		me.OnToggle(function(sender, node)
		{
			if (node.GetDomElement()._internal.WsDone === true)
				return;

			if (node.GetDomElement()._internal.WSHasChildren === false)
				return;

			// Loading indicator

			var li = node.GetDomElement();

			var loading = document.createElement("i");
			Fit.Dom.AddClass(loading, "FitUiControlLoadingIndicator");
			Fit.Dom.Add(li, loading);

			// Get data

			var canceled = !getData(node, function(n, eventArgs) // Delegate fired when data is ready
			{
				// Remove place holder child which served the purpose of making the node expandable

				if (node.GetChildren()[0].Value() === "__")
					node.RemoveChild(node.GetChildren()[0]);

				// Populate node

				Fit.Array.ForEach(eventArgs.Children, function(c)
				{
					node.AddChild(createNodeFromJson(c));
				});

				// Remove loading indicator

				Fit.Dom.Remove(loading);

				node.GetDomElement()._internal.WsDone = true;
				node.Expanded(true); // Unfortunately causes both OnToggle and OnToggled to be fired, although OnToggle has already been fired once (canceled below)
			});

			// Remove loading indicator if request was canceled

			if (canceled === true)
				Fit.Dom.Remove(loading);

			return false; // Cancel toggle, will be "resumed" when data is loaded
		});
	}

	function createNodeFromJson(jsonNode)
	{
		Fit.Validation.ExpectIsSet(jsonNode);

		// Convert JSON to TreeView node, including all contained children

		var child = new Fit.Controls.TreeView.Node(jsonNode.Title, jsonNode.Value);

		if (jsonNode.Selectable !== undefined)
			child.Selectable((jsonNode.Selectable === true)); // Node will obtain Selectable state from TreeView unless explicitly set here

		if (jsonNode.Selected !== undefined)
			child.Selected((jsonNode.Selected === true)); // Notice, will not cause various events to fire since TreeViewNodeInterface is not assigned at this point

		if (jsonNode.Children instanceof Array)
		{
			Fit.Array.ForEach(jsonNode.Children, function(c)
			{
				child.AddChild(createNodeFromJson(c));
			});
		}

		// Set internal flag indicating whether node has children server side

		child.GetDomElement()._internal.WSHasChildren = (jsonNode.HasChildren === true);

		// Add fake child to node if HasChildren indicates that there are more children
		// server side. Adding the fake child ensures that the node can be expanded, which
		// allow us to use OnToggle to load the children at this point.
		// However, the current node may already have some of its children added,
		// so only add the fake child if no children are found.

		if (jsonNode.HasChildren === true && child.GetChildren().length === 0)
		{
			// Make node expandable by attaching a place holder node
			// which is automatically removed when node is expanded.
			child.AddChild(new Fit.Controls.TreeView.Node("__", "__"));
		}

		return child;
	}

	/// <function container="Fit.Controls.WSTreeView" name="Render" access="public">
	/// 	<description>
	/// 		Render control, either inline or to element specified.
	/// 		This also results in initial WebService request to load root nodes.
	/// 	</description>
	/// 	<param name="toElement" type="DOMElement" default="undefined"> If defined, control is rendered to this element </param>
	/// </function>
	var baseRender = me.Render;
	this.Render = function(elm)
	{
		if (loadDataOnInit === true)
		{
			me.Reload();
			loadDataOnInit = false;
		}

		baseRender(elm);
	}

	this.Url = function(wsUrl)
	{
		Fit.Validation.ExpectStringValue(wsUrl);

		if (Fit.Validation.IsSet(wsUrl) === true)
		{
			url = wsUrl;
		}

		return url;
	}

	this.Reload = function()
	{
		me.RemoveAllChildren(true);

		getData(null, function(node, eventArgs)
		{
			Fit.Array.ForEach(eventArgs.Children, function(jsonChild)
			{
				me.AddChild(createNodeFromJson(jsonChild));
			});
		});
	}

	var baseSelected = me.Selected;
	this.Selected = function(val)
	{
		Fit.Validation.ExpectArray(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			baseSelected(val);
		}

		// Get selection

		var orgSelected = baseSelected();
		var selected = Fit.Array.Copy(orgSelected); // Use copy - preselections are added below
		selected.toString = orgSelected.toString;

		// Add preselections that have not been loaded yet

		Fit.Array.ForEach(preSelected, function(sel)
		{
			Fit.Array.Add(selected, new Fit.Controls.TreeView.Node("&lt;pre-selection not loaded&gt;", sel));
		});

		return selected;
	}

	/// <function container="Fit.Controls.WSTreeView" name="PreSelected" access="public">
	/// 	<description> Set nodes to select automatically when loaded. Nodes already loaded will be immediately selected. </description>
	/// 	<param name="val" type="string"> Semicolon separated list of node values </param>
	/// </function>
	var preSelected = [];
	this.PreSelected = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			me.Value(val); // Select nodes already loaded

			preSelected = val.split(";");

			// Remove nodes already selected
			Fit.Array.ForEach(baseSelected(), function(selected)
			{
				Fit.Array.Remove(preSelected, selected.Value());
			});
		}

		return preSelected.join(";");
	}

	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		me = url = loadDataOnInit = onRequestHandlers = onResponseHandlers = onPopulatedHandlers = null;

		base();
	});

	// ============================================
	// PickerBase interface
	// ============================================

	this.OnShow(function(sender) // Event defined on PickerBase
	{
		if (loadDataOnInit === true)
		{
			me.Reload();
			loadDataOnInit = false;
		}
	});

	this.SetSelections = Fit.Core.CreateOverride(this.SetSelections, function(values)
	{
		Fit.Validation.ExpectString(values);

		// Make sure calls to Value() or Selected() does not return old preselections

		preSelected = [];

		// Call SetSelections(..) on base class to make sure nodes already loaded is immediately selected.

		base(values);

		// Set preselections for nodes not loaded yet

		if (values !== "")
		{
			preSelected = values.split(";");

			// Remove nodes already selected
			Fit.Array.ForEach(baseSelected(), function(selected)
			{
				Fit.Array.Remove(preSelected, selected.Value());
			});
		}
	});

	this.UpdateItemSelection = Fit.Core.CreateOverride(this.UpdateItemSelection, function(itemValue, selected)
	{
		Fit.Validation.ExpectString(itemValue);
		Fit.Validation.ExpectBoolean(selected);

		if (me.GetChild(itemValue, true) === null) // Node not loaded yet, update preselections
		{
			if (selected === true && Fit.Array.Contains(preSelected, itemValue) === false)
				Fit.Array.Add(preSelected, itemValue);
			else if (selected === false)
				Fit.Array.Remove(preSelected, itemValue);
		}
		else // Update nodes already loaded
		{
			if (base(itemValue, selected) === false)
				return false;
		}
	});

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.WSTreeView" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is being requested.
	/// 		Request can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSTreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSTreeView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.DotNetJsonRequest instance
	/// 		 - Node: Fit.Controls.TreeView.Node instance
	/// 		 - Children: Fit.Controls.TreeView.Node[] collection which
	/// 		   is available when OnResponse and OnPopulated is fired.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnRequest = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onRequestHandlers, cb);
	}

	/// <function container="Fit.Controls.WSTreeView" name="OnResponse" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is received,
	/// 		allowing for data transformation to occure before
	/// 		TreeView is populated. Function receives two arguments:
	/// 		Sender (Fit.Controls.WSTreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSTreeView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.DotNetJsonRequest instance
	/// 		 - Node: Fit.Controls.TreeView.Node instance
	/// 		 - Children: Fit.Controls.TreeView.Node[] collection which
	/// 		   is available when OnResponse and OnPopulated is fired.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnResponse = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onResponseHandlers, cb);
	}

	/// <function container="Fit.Controls.WSTreeView" name="OnPopulated" access="public">
	/// 	<description>
	/// 		Add event handler fired when TreeView has been populated with nodes.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSTreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSTreeView instance
	/// 		 - Request: Fit.Http.Request or Fit.Http.DotNetJsonRequest instance
	/// 		 - Node: Fit.Controls.TreeView.Node instance
	/// 		 - Children: Fit.Controls.TreeView.Node[] collection which
	/// 		   is available when OnResponse and OnPopulated is fired.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnPopulated = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPopulatedHandlers, cb);
	}

	// ============================================
	// Private
	// ============================================

	function getData(node, cb)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeView.Node, true); // Node is null when requesting root nodes
		Fit.Validation.ExpectFunction(cb);

		if (url === null)
			Fit.Validation.ThrowError("Unable to get data, no WebService URL has been specified");

		var request = ((url.toLowerCase().indexOf(".asmx/") === -1) ? new Fit.Http.Request(url) : new Fit.Http.DotNetJsonRequest(url));

		// Fire OnRequest

		var eventArgs = { Sender: null, Node: null, Request: null, Children: null };
		eventArgs.Sender = me;
		eventArgs.Node = node;
		eventArgs.Request = request;

		if (fireEventHandlers(onRequestHandlers, eventArgs) === false)
			return false;

		// Set request callbacks

		request.OnSuccess(function(req)
		{
			var children = request.GetResponseJson();

			// Fire OnResponse

			eventArgs.Children = ((children instanceof Array) ? children : []);
			fireEventHandlers(onResponseHandlers, eventArgs);

			// Fire getData callback

			cb(node, eventArgs); // Callback is responsible for populating TreeView

			// Fire OnPopulated

			fireEventHandlers(onPopulatedHandlers, eventArgs);

			// Select nodes found in preselections

			if (preSelected.length > 0)
			{
				var fireOnChange = false;

				me._internal.ExecuteWithNoOnChange(function()
				{
					Fit.Array.Recurse(((node !== null) ? node.GetChildren() : me.GetChildren()), "GetChildren", function(n)
					{
						if (Fit.Array.Contains(preSelected, n.Value()) === true)
						{
							n.Selected(true)
							Fit.Array.Remove(preSelected, n.Value());
						}
					});
				});

				// Fire OnChange if any of the children was selected above

				if (fireOnChange === true)
					me._internal.FireOnChange();
			}
		});

		request.OnFailure(function(req)
		{
			Fit.Validation.ThrowError("Unable to get children for " + ((node !== null) ? "node '" + node.Title() + "'" : "root level") + " - request failed with HTTP Status code " + request.GetHttpStatus())
		});

		// Invoke request

		request.Start();

		return true;
	}

	function fireEventHandlers(handlers, eventArgs)
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (cb(me, eventArgs) === false)
				cancel = true; // Do NOT cancel loop though! All handlers must be fired!
		});

		return !cancel;
	}

	init();
}
