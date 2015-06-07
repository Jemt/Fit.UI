/// <container name="Fit.Controls.WSTreeView">
/// 	TreeView control allowing data from a
/// 	WebService to be listed in a structured manner.
/// 	Inheriting from Fit.Controls.TreeView.
///
/// 	Notice: WSTreeView works a bit differently from TreeView.
/// 	Nodes are loaded on-demand, meaning when Selected(..) or Value(..)
/// 	is called to set selections, nodes not loaded yet are stored internally as
/// 	preselections. Nodes not loaded yet will not have OnSelect, OnSelected,
/// 	and any associated events fired, until they are actually loaded.
/// 	But they will be returned when Selected() or Value() is called (getters).
/// 	OnChange, however, will always be fired when selections are changed,
/// 	no matter if nodes are loaded or not.
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
	var preSelected = [];
	var orgSelected = [];
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

	/// <function container="Fit.Controls.WSTreeView" name="Url" access="public" returns="string">
	/// 	<description>
	/// 		Get/set URL to WebService responsible for providing data to TreeView.
	/// 		WebService must deliver data in the following JSON format:
	/// 		[
	/// 			{ Title: "Test 1", Value: "1001", Selectable: true, Selected: true, Children: [] },
	/// 			{ Title: "Test 2", Value: "1002", Selectable: false, Selected: false, Children: [] }
	/// 		]
	/// 		Only Value is required. Children is a collection of nodes with the same format as described above.
	/// 		HasChildren:boolean may be set to indicate that children are available server side and that WebService
	/// 		should be called to load these children when the given node is expanded.
	/// 	</description>
	/// 	<param name="wsUrl" type="string"> WebService URL - e.g. http://server/ws/data.asxm/GetNodes </param>
	/// </function>
	this.Url = function(wsUrl)
	{
		Fit.Validation.ExpectString(wsUrl);

		if (Fit.Validation.IsSet(wsUrl) === true)
		{
			url = wsUrl;
		}

		return url;
	}

	// See documentation on TreeView
	this.RemoveAllChildren = Fit.Core.CreateOverride(this.RemoveAllChildren, function()
	{
		preSelected = []; // Clear preselections to avoid auto selection of nodes added later
		base();
	});

	// See documentation on TreeView
	this.Selectable = Fit.Core.CreateOverride(this.Selectable, function(val, multi, showSelAll)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(multi, true);
		Fit.Validation.ExpectBoolean(showSelAll, true);

		preSelected = []; // Clear preselections to ensure same behaviour as TreeView.Selectable(..) which clear selections - avoid auto selection if nodes are loaded later
		base(val, multi, showSelAll);
	});

	// See documentation on ControlBase
	this.Clear = Fit.Core.CreateOverride(this.Clear, function()
	{
		var fireChange = (me.Selected().length > 0); // Selected() return nodes loaded as well as preselections

		preSelected = [];

		me._internal.ExecuteWithNoOnChange(function() { base(); });

		if (fireChange === true)
			me._internal.FireOnChange();
	});

	/// <function container="Fit.Controls.WSTreeView" name="Reload" access="public">
	/// 	<description>
	/// 		Reload data from WebService. This will clear any selections, which are not
	/// 		restored. Use the approach below to restore selections after reload.
	/// 		var selected = tree.Selected();
	/// 		tree.Reload();
	/// 		tree.Selected(selected);
	/// 	</description>
	/// </function>
	this.Reload = function()
	{
		me.RemoveAllChildren(true); // True to dispose objects

		preSelected = [];

		getData(null, function(node, eventArgs)
		{
			Fit.Array.ForEach(eventArgs.Children, function(jsonChild)
			{
				me.AddChild(createNodeFromJson(jsonChild));
			});
		});
	}

	/// <function container="Fit.Controls.WSTreeView" name="Value" access="public" returns="object">
	/// 	<description>
	/// 		Fit.Controls.TreeView.Value override:
	/// 		Get/set selected nodes.
	/// 		Updating selection can be done by either providing a collection of
	/// 		Fit.Controls.TreeView.Node instances, or a string with a semicolon
	/// 		separated list of node values.
	/// 		Data is returned as an array of Fit.Controls.TreeView.Node[] instances.
	/// 		Array implements ToString as defined by ControlBase which returns data as val1[;val2[;val3]].
	/// 		Notice for getter: Nodes not loaded yet (preselections) are NOT valid nodes associated with TreeView.
	/// 		Therefore most functions will not work. Preselection nodes can be identified by their title:
	/// 		if (node.Title() === "[pre-selection]") console.log("This is a preselection node");
	/// 		Only the following getter functions can be used for preselection nodes:
	/// 		node.Title(), node.Value(), node.Selected()
	/// 	</description>
	/// 	<param name="val" type="object" default="undefined"> If defined, provided nodes are selected </param>
	/// </function>
	this.Value = Fit.Core.CreateOverride(this.Value, function(val)
	{
		// Setter

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val instanceof Array)
			{
				me.Selected(val);
			}
			else if (typeof(val) === "string")
			{
				orgSelected = [];
				preSelected = [];
				var fireOnChange = (me.Selected().length > 0); // Selected() return nodes already loaded and preselections

				me._internal.ExecuteWithNoOnChange(function()
				{
					// Select nodes already loaded

					var selected = base(val);

					if (selected.length > 0)
						fireOnChange = true;

					// Update orgSelected used to determine dirty state

					Fit.Array.ForEach(selected, function(node)
					{
						Fit.Array.Add(orgSelected, node.Value());
					});

					// Add nodes not loaded yet to preselections

					var values = val.toString().split(";");

					Fit.Array.ForEach(values, function(nodeVal)
					{
						if (me.GetChild(nodeVal, true) === null)
						{
							Fit.Array.Add(preSelected, nodeVal);
							Fit.Array.Add(orgSelected, nodeVal);
							fireOnChange = true;
						}
					});
				});

				if (fireOnChange === true)
					me._internal.FireOnChange();
			}
		}

		// Getter

		return me.Selected();
	});

	/// <function container="Fit.Controls.WSTreeView" name="Selected" access="public" returns="Fit.Controls.TreeView.Node[]">
	/// 	<description>
	/// 		Fit.Controls.TreeView.Selected override:
	/// 		Get/set selected nodes.
	/// 		Notice for getter: Nodes not loaded yet (preselections) are NOT valid nodes associated with TreeView.
	/// 		Therefore most functions will not work. Preselection nodes can be identified by their title:
	/// 		if (node.Title() === "[pre-selection]") console.log("This is a preselection node");
	/// 		Only the following getter functions can be used for preselection nodes:
	/// 		node.Title(), node.Value(), node.Selected()
	/// 	</description>
	/// 	<param name="val" type="Fit.Controls.TreeView.Node[]" default="undefined"> If defined, provided nodes are selected </param>
	/// </function>
	var baseSelected = me.Selected; // Used by Selected(..) and SetSelections(..)
	this.Selected = function(val)
	{
		Fit.Validation.ExpectArray(val, true);

		// Setter

		if (Fit.Validation.IsSet(val) === true)
		{
			// Exclude nodes not belonging to TreeView - trying to select them
			// will cause an error to be thrown from TreeView.Selected (base).
			// Nodes excluded is added as preselections instead.

			var toSelect = [];

			Fit.Array.ForEach(val, function(n)
			{
				Fit.Validation.ExpectInstance(n, Fit.Controls.TreeView.Node);

				var node = ((n.GetTreeView() === me) ? n : me.GetChild(n.Value(), true)); // Try GetChild(..) in case node was constructed, but with a value of an existing node

				if (node !== null)
					Fit.Array.Add(toSelect, node);
			});

			// Select nodes

			orgSelected = [];
			preSelected = [];
			var fireOnChange = (me.Selected().length > 0); // Selected() return nodes already loaded and preselections

			// Select nodes already loaded

			var selected = -1;
			me._internal.ExecuteWithNoOnChange(function() { selected = baseSelected(toSelect); });

			if (selected.length > 0)
				fireOnChange = true;

			// Update orgSelected used to determine dirty state

			Fit.Array.ForEach(selected, function(node)
			{
				Fit.Array.Add(orgSelected, node.Value());
			});

			// Add nodes not loaded yet to preselections

			Fit.Array.ForEach(val, function(node)
			{
				if (me.GetChild(node.Value(), true) === null)
				{
					Fit.Array.Add(preSelected, node.Value());
					Fit.Array.Add(orgSelected, node.Value());
					fireOnChange = true;
				}
			});
		}

		// Getter

		var nodes = baseSelected();

		// Add preselections - they are considered part of value
		Fit.Array.ForEach(preSelected, function(nodeVal)
		{
			Fit.Array.Add(nodes, new Fit.Controls.TreeView.Node("[pre-selection]", nodeVal)); // Invalid nodes! E.g. node.Selected(true) and node.GetTreeView() will not work since node has no association with TreeView
		});

		return nodes;
	}

	// See documentation on ControlBase
	this.IsDirty = Fit.Core.CreateOverride(this.IsDirty, function()
	{
		// Get nodes currently selected

		var valuesSelected = me.Value().toString().split(";");

		// Determine dirty state

		if (valuesSelected.length !== orgSelected.length)
			return true;

		var dirty = false;
		Fit.Array.ForEach(orgSelected, function(val)
		{
			if (Fit.Array.Contains(valuesSelected, val) === false)
			{
				dirty = true;
				return false;
			}
		});
		return dirty;
	});

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		me = url = preSelected = orgSelected = loadDataOnInit = onRequestHandlers = onResponseHandlers = onPopulatedHandlers = baseRender = baseSelected = null;

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

	// See documentation on PickerBase
	this.SetSelections = Fit.Core.CreateOverride(this.SetSelections, function(values)
	{
		Fit.Validation.ExpectString(values);

		var fireOnChange = (me.Selected().length > 0); // me.Selected() return nodes not loaded yet and preselections

		// Make sure calls to Value() or Selected() does not return old preselections for events fired

		preSelected = [];

		// Call SetSelections(..) on base class to make sure nodes already loaded is immediately selected.

		me._internal.ExecuteWithNoOnChange(function() { base(values); });

		if (me.Selected().length > 0)
			fireOnChange = true;

		// Set preselections for nodes not loaded yet

		if (values !== "")
		{
			preSelected = values.split(";");

			// Remove nodes already selected
			Fit.Array.ForEach(baseSelected(), function(selected)
			{
				Fit.Array.Remove(preSelected, selected.Value());
			});

			if (preSelected.length > 0)
				fireOnChange = true;
		}

		// Fire OnChange

		if (fireOnChange === true)
			me._internal.FireOnChange();
	});

	// See documentation on PickerBase
	this.UpdateItemSelection = Fit.Core.CreateOverride(this.UpdateItemSelection, function(itemValue, selected)
	{
		Fit.Validation.ExpectString(itemValue);
		Fit.Validation.ExpectBoolean(selected);

		if (me.GetChild(itemValue, true) === null) // Node not loaded yet, update preselections
		{
			// Since the node is not loaded yet, OnSelect, OnItemSelectionChanging,
			// OnSelected, and OnItemSelectionChanged are not fired - they fire once the node is loaded.

			if (selected === true && Fit.Array.Contains(preSelected, itemValue) === false)
			{
				Fit.Array.Add(preSelected, itemValue);
				me._internal.FireOnChange();
			}
			else if (selected === false)
			{
				var length = preSelected.length;
				Fit.Array.Remove(preSelected, itemValue);

				if (preSelected.length !== length)
					me._internal.FireOnChange();
			}
		}
		else // Update nodes already loaded
		{
			if (base(itemValue, selected) === false) // Fires OnSelect, OnItemSelectionChanging, OnSelected, OnItemSelectionChanged, and OnChange
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
				// Notice: OnChange is not fired! It has already been fired when PreSelections were added.
				// They are also included when e.g. WSTreeView.Value() is called to obtain current selections.
				// However, OnSelect (which fires OnItemSelectionChanging) and OnSelected (which fires OnItemSelectionChanged)
				// fires when node.selected(boolean) is called below.
				me._internal.ExecuteWithNoOnChange(function()
				{
					Fit.Array.Recurse(((node !== null) ? node.GetChildren() : me.GetChildren()), "GetChildren", function(n)
					{
						if (Fit.Array.Contains(preSelected, n.Value()) === true)
						{
							n.Selected(true);
							Fit.Array.Remove(preSelected, n.Value());
						}
					});
				});
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
