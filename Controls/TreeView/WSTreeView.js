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
	var preSelected = {};
	var orgSelected = [];
	var loadDataOnInit = true;
	var selectAllMode = Fit.Controls.WSTreeView.SelectAllMode.Progressively;
	var onRequestHandlers = [];
	var onResponseHandlers = [];
	var onPopulatedHandlers = [];

	function init()
	{
		me.OnToggle(function(sender, node)
		{
			if (node.Expanded() === true) // Node is currently expanded and will now become collapsed
				return;

			if (node.GetDomElement()._internal.WSDone === true)
				return;

			if (node.GetDomElement()._internal.WSLoading === true)
				return;

			if (node.GetDomElement()._internal.WSHasChildren === false)
				return;

			// Loading indicator

			var li = node.GetDomElement();

			var loading = document.createElement("i");
			Fit.Dom.AddClass(loading, "FitUiControlLoadingIndicator");
			Fit.Dom.Add(li, loading);

			// Get data

			node.GetDomElement()._internal.WSLoading = true;

			var canceled = !getData(node, function(n, eventArgs) // Delegate fired when data is ready
			{
				// Remove place holder child which served the purpose of making the node expandable

				var expanderNode = node.GetChild("__");

				if (expanderNode !== null)
					node.RemoveChild(expanderNode);

				// Populate node

				Fit.Array.ForEach(eventArgs.Children, function(c)
				{
					node.AddChild(createNodeFromJson(c));
				});

				// Remove loading indicator

				Fit.Dom.Remove(loading);

				node.GetDomElement()._internal.WSDone = true;
				node.Expanded(true); // Unfortunately causes both OnToggle and OnToggled to be fired, although OnToggle has already been fired once (canceled below)
			});

			// Remove loading indicator if request was canceled

			if (canceled === true)
				Fit.Dom.Remove(loading);

			return false; // Cancel toggle, will be "resumed" when data is loaded
		});

		//{ SelectAll

		me.OnSelectAll(function(sender, node)
		{
			// NOTICE: How it works:
			// Fit.Controls.TreeView checks and expands all children ALREADY loaded.
			// Nodes with children NOT loaded yet (WSHasChildren === true)
			// are expanded here to force them to load. The OnPopulated handler registered
			// below is then responsible for checking and expanding the children received.
			// If Instant Mode (selectAllMode variable) is enabled, all children is expected
			// to be returned at once through one single HTTP request. In this case
			// the OnResponse handler below will remove existing children to have
			// them replaced by the complete record set return from the WebService.
			// If Progressive Mode on the other hand is enabled, nodes will be chain loaded,
			// just as if the user expanded all the nodes - it just happens automatically.

			var selected = !node.Selected();

			if (selectAllMode === Fit.Controls.WSTreeView.SelectAllMode.Instantly) // Load all children at once (in just one HTTP request)
			{
				if (nodeFullyLoaded(node) === false)
				{
					var internal = node.GetDomElement()._internal;

					// Make OnPopulated update selection state, and automatically expand children returned from WebService.
					// OnResponse handler will remove existing children when response is received since any existing children
					// will also be contained in response data - we do not want dublicates.
					internal.WSSelectAll = true;
					internal.WSCheckedState = selected;

					// Clear WebService state in case node has already been expanded
					delete internal.WSDone;
					delete internal.WSLoading;

					node.Expanded(false);
					setTimeout(function() { node.Expanded(true); }, 0); // Auto expand node to have children load after SelectAll is canceled below (False returned)

					// Cancel SelectAll, it will cause any existing children to be selected, and in turn fire OnChange.
					// Children will be selected once the complete hierarchy of children is received and populated (see OnResponse and OnPopulated below).
					return false;
				}
			}
			else // Progressively (chain loading) - load children in each level individually (multiple HTTP requests, one for each node expanded)
			{
				// Make OnPopulated update selection state, and automatically expand children returned from WebService, which in turn loads the next level of children

				Fit.Array.Recurse([node], "GetChildren", function(child)
				{
					var childInternal = child.GetDomElement()._internal;

					if (childInternal.WSHasChildren === true && childInternal.WSDone !== true) // Node has children server side which have not loaded yet
					{
						childInternal.WSSelectAll = true;
						childInternal.WSCheckedState = selected;
					}
				});
			}
		});

		me.OnResponse(function(sender, eventArgs)
		{
			// Select All in Instant Mode returns all children at once (not populated yet).
			// Remove any existing children - may have been partically loaded by user.

			if (selectAllMode === Fit.Controls.WSTreeView.SelectAllMode.Instantly)
			{
				if (eventArgs.Node !== null && eventArgs.Node.GetDomElement()._internal.WSSelectAll === true)
				{
					me._internal.ExecuteWithNoOnChange(function() // Prevent checked nodes from firing OnChange when removed
					{
						var children = Fit.Array.Copy(eventArgs.Node.GetChildren());

						Fit.Array.ForEach(children, function(child)
						{
							eventArgs.Node.RemoveChild(child);
						});
					});
				}
			}
		});

		me.OnPopulated(function(sender, eventArgs)
		{
			var node = eventArgs.Node;

			if (node === null) return; // Root

			if (node.GetDomElement()._internal.WSSelectAll === true) // Select All triggered request
			{
				// Select and expand all children

				var selected = node.GetDomElement()._internal.WSCheckedState;

				if (selectAllMode === Fit.Controls.WSTreeView.SelectAllMode.Instantly)
					node.Selected(selected); // SelectAll was canceled in Instant Mode to prevent OnChange from firing - select node now

				me._internal.ExecuteWithNoOnChange(function()
				{
					Fit.Array.Recurse(node.GetChildren(), "GetChildren", function(child)
					{
						// Make sure children (and their children) keeps loading in Progressive Mode (chain loading)

						if (selectAllMode === Fit.Controls.WSTreeView.SelectAllMode.Progressively)
						{
							var childInternal = child.GetDomElement()._internal;

							if (childInternal.WSHasChildren === true && childInternal.WSDone !== true) // Node has children server side which have not loaded yet
							{
								childInternal.WSSelectAll = true;
								childInternal.WSCheckedState = selected;
							}
						}

						// Select and expand

						if (child.Selectable() === true)
							child.Selected(selected);

						child.Expanded(true);
					});
				});

				me._internal.FireOnChange();
			}
		});

		//}
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
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 1", Value: "1001", Selectable: true, Selected: true, Children: [] },
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 2", Value: "1002", Selectable: false, Selected: false, Children: [] }
	/// 		]
	/// 		Only Value is required. Children is a collection of nodes with the same format as described above.
	/// 		HasChildren:boolean may be set to indicate that children are available server side and that WebService
	/// 		should be called to load these children when the given node is expanded.
	/// 	</description>
	/// 	<param name="wsUrl" type="string"> WebService URL - e.g. http://server/ws/data.asxm/GetNodes </param>
	/// </function>
	this.Url = function(wsUrl)
	{
		Fit.Validation.ExpectString(wsUrl, true);

		if (Fit.Validation.IsSet(wsUrl) === true)
		{
			url = wsUrl;
		}

		return url;
	}

	/// <function container="Fit.Controls.WSTreeView" name="SelectAllMode" access="public" returns="Fit.Controls.WSTreeView.SelectAllMode">
	/// 	<description>
	/// 		Get/set flag indicating whether WebService returns the complete hierarchy when
	/// 		Select All is triggered (Instantly), or loads data for each level individually
	/// 		when TreeView automatically expands all nodes (Progressively - chain loading).
	/// 	</description>
	/// 	<param name="val" type="Fit.Controls.WSTreeView.SelectAllMode" default="undefined"> If defined, behaviour is set to specified mode </param>
	/// </function>
	this.SelectAllMode = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === Fit.Controls.WSTreeView.SelectAllMode.Progressively || val === Fit.Controls.WSTreeView.SelectAllMode.Instantly)
				selectAllMode = val;
		}

		return selectAllMode;
	}

	// See documentation on TreeView
	this.RemoveAllChildren = Fit.Core.CreateOverride(this.RemoveAllChildren, function()
	{
		preSelected = {}; // Clear preselections to avoid auto selection of nodes added later
		base();
	});

	// See documentation on TreeView
	this.Selectable = Fit.Core.CreateOverride(this.Selectable, function(val, multi, showSelAll)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(multi, true);
		Fit.Validation.ExpectBoolean(showSelAll, true);

		preSelected = {}; // Clear preselections to ensure same behaviour as TreeView.Selectable(..) which clear selections - avoid auto selection if nodes are loaded later
		base(val, multi, showSelAll);
	});

	// See documentation on ControlBase
	this.Clear = Fit.Core.CreateOverride(this.Clear, function()
	{
		var fireChange = (me.Selected().length > 0); // Selected() return nodes loaded as well as preselections

		preSelected = {};

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
		if (loadDataOnInit === false) // Do not clear on initial data load - no children have been loaded, but more importantly, we want to keep preselections
		{
			me.RemoveAllChildren(true); // True to dispose objects
			preSelected = {};
		}

		getData(null, function(node, eventArgs)
		{
			Fit.Array.ForEach(eventArgs.Children, function(jsonChild)
			{
				me.AddChild(createNodeFromJson(jsonChild));
			});
		});

		loadDataOnInit = false;
	}

	// See documentation on ControlBase
	this.Value = Fit.Core.CreateOverride(this.Value, function(val)
	{
		Fit.Validation.ExpectString(val, true);

		// Setter

		if (Fit.Validation.IsSet(val) === true)
		{
			orgSelected = [];
			preSelected = {};
			var fireOnChange = (me.Selected().length > 0); // Selected() return nodes already loaded and preselections

			me._internal.ExecuteWithNoOnChange(function()
			{
				// Select nodes already loaded

				base(val);
				var selected = baseSelected(); // Get selection just made as node objects, which can be iterated using ForEach

				if (selected.length > 0)
					fireOnChange = true;

				// Update orgSelected used to determine dirty state

				Fit.Array.ForEach(selected, function(node)
				{
					Fit.Array.Add(orgSelected, node.Value());
				});

				// Add nodes not loaded yet to preselections

				var values = val.split(";");

				Fit.Array.ForEach(values, function(nodeVal)
				{
					var info = nodeVal.split("=");
					var preSel = { Title: null, Value: null };

					if (info.length === 1)
					{
						preSel.Title = "[pre-selection]";
						preSel.Value = decodeReserved(info[0]);
					}
					else
					{
						preSel.Title = decodeReserved(info[0]);
						preSel.Value = decodeReserved(info[1]);
					}

					if (me.GetChild(preSel.Value, true) === null)
					{
						preSelected[preSel.Value] = preSel;
						Fit.Array.Add(orgSelected, preSel.Value);
						fireOnChange = true;
					}
				});
			});

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		// Getter

		var nodes = me.Selected();
		var val = "";

		Fit.Array.ForEach(nodes, function(node)
		{
			val += ((val !== "") ? ";" : "") + encodeReserved(node.Title()) + "=" + encodeReserved(node.Value());
		});

		return val;
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
	var baseSelected = me.Selected; // Used by Selected(..), Value(), and SetSelections(..)
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
			preSelected = {};
			var fireOnChange = (me.Selected().length > 0); // Selected() return nodes already loaded and preselections

			// Select nodes already loaded

			var selected = null;
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
					preSelected[node.Value()] = {Title: node.Title(), Value: node.Value()};
					Fit.Array.Add(orgSelected, node.Value());
					fireOnChange = true;
				}
			});
		}

		// Getter

		var nodes = baseSelected();

		// Add preselections - they are considered part of value
		Fit.Array.ForEach(preSelected, function(preSelVal)
		{
			var preSel = preSelected[preSelVal];
			Fit.Array.Add(nodes, new Fit.Controls.TreeView.Node(preSel.Title, preSel.Value)); // Invalid nodes! E.g. node.Selected(true) and node.GetTreeView() will not work since node has no association with TreeView
		});

		return nodes;
	}

	// See documentation on ControlBase
	this.IsDirty = Fit.Core.CreateOverride(this.IsDirty, function()
	{
		// Get nodes currently selected

		var valuesSelected = [];

		Fit.Array.ForEach(me.Selected(), function(selected)
		{
			Fit.Array.Add(valuesSelected, selected.Value());
		});

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

	/*this.OnShow(function(sender) // Event defined on PickerBase
	{
		if (loadDataOnInit === true)
		{
			me.Reload();
			loadDataOnInit = false;
		}
	});*/

	// See documentation on PickerBase
	this.SetSelections = Fit.Core.CreateOverride(this.SetSelections, function(items)
	{
		Fit.Validation.ExpectArray(items);

		var fireOnChange = (me.Selected().length > 0); // me.Selected() return nodes already loaded and preselections

		// Make sure calls to Value() or Selected() does not return old preselections for events fired

		preSelected = {};

		// Call SetSelections(..) on base class to make sure nodes already loaded is immediately selected.

		me._internal.ExecuteWithNoOnChange(function() { base(items); });

		if (me.Selected().length > 0)
			fireOnChange = true;

		// Set preselections for nodes not loaded yet

		// Add all values to preselections - preselections for nodes already loaded is removed further down
		Fit.Array.ForEach(items, function(item)
		{
			Fit.Validation.ExpectString(item.Title);
			Fit.Validation.ExpectString(item.Value);

			preSelected[item.Value] = {Title: item.Title, Value: item.Value};
		});

		// Remove values from preselections if already loaded
		Fit.Array.ForEach(baseSelected(), function(selected)
		{
			delete preSelected[selected.Value()];
		});

		if (Fit.Core.IsEqual(preSelected, {}) === false)
			fireOnChange = true;

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

			if (selected === true && preSelected[itemValue] === undefined)
			{
				preSelected[itemValue] = {Title: "[pre-selection]", Value: itemValue};
				me._internal.FireOnChange();
			}
			else if (selected === false && preSelected[itemValue] !== undefined)
			{
				delete preSelected[itemValue];
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
	/// 		 - Node: Fit.Controls.TreeView.Node instance to be populated
	/// 		 - Children: JSON nodes received from WebService
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
	/// 		 - Node: Fit.Controls.TreeView.Node instance now populated with children
	/// 		 - Children: JSON nodes received from WebService
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
		eventArgs.SelectAll = (node !== null && node.GetDomElement()._internal.WSSelectAll === true);

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

			// Select nodes found in preselections

			if (Fit.Core.IsEqual(preSelected, {}) === false) // Prevent nodes from being iterated if no preselections are found
			{
				// Notice: OnChange is not fired! It has already been fired when PreSelections were added.
				// They are also included when e.g. WSTreeView.Value() is called to obtain current selections.
				// However, OnSelect (which fires OnItemSelectionChanging) and OnSelected (which fires OnItemSelectionChanged)
				// fires when node.selected(boolean) is called below.
				me._internal.ExecuteWithNoOnChange(function()
				{
					Fit.Array.Recurse(((node !== null) ? node.GetChildren() : me.GetChildren()), "GetChildren", function(n)
					{
						if (preSelected[n.Value()] !== undefined)
						{
							delete preSelected[n.Value()];
							n.Selected(true);
						}
					});
				});
			}

			// Fire OnPopulated

			fireEventHandlers(onPopulatedHandlers, eventArgs);
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

		var child = new Fit.Controls.TreeView.Node((jsonNode.Title ? jsonNode.Title : jsonNode.Value), jsonNode.Value);

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
			var expanderNode = new Fit.Controls.TreeView.Node("__", "__");
			expanderNode.Selectable(false); // Prevent it from being selected when using SelectAll
			child.AddChild(expanderNode);
		}

		// Add supplementary information provided by WebService

		child.Supplementary = {};
		var reserved = new Array("Title", "Value", "Children", "HasChildren", "Selected", "Selectable");

		Fit.Array.ForEach(jsonNode, function(key)
		{
			if (Fit.Array.Contains(reserved, key) === false)
				child.Supplementary[key] = jsonNode[key];
		});

		return child;
	}

	function nodeFullyLoaded(node) // Check whether all children has been loaded
	{
		var internal = node.GetDomElement()._internal;

		if (internal.WSSelectAll === true)
			return true; // This node previously caused SelectAll

		// Check whether node was part of hierarchy loaded using Select All

		var parent = node.GetParent();

		while (parent !== null)
		{
			if (parent.GetDomElement()._internal.WSSelectAll === true)
				return true;

			parent = parent.GetParent();
		}

		// Check whether all children are loaded (usually manually by expanding nodes)

		var fullyLoaded = true;

		Fit.Array.Recurse([node], "GetChildren", function(child)
		{
			var childInternal = child.GetDomElement()._internal;

			if (childInternal.WSHasChildren === true && childInternal.WSDone !== true)
			{
				fullyLoaded = false;
				return false; // Break loop
			}
		});

		return fullyLoaded;
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

/// <container name="Fit.Controls.WSTreeView.SelectAllMode">
/// 	Enum indicating how data is loaded from WebService when using the Select All feature
/// </container>
Fit.Controls.WSTreeView.SelectAllMode =
{
	/// <member container="Fit.Controls.WSTreeView.SelectAllMode" name="Progressively" access="public" static="true" type="string" default="Progressively">
	/// 	<description>
	/// 		Chain load children by progressively expanding them as they are loaded.
	/// 		This may result in several HTTP requests to WebService, and OnChange will
	/// 		fire for every node expanded if children are available server side.
	/// 	</description>
	/// </member>
	Progressively: "Progressively",

	/// <member container="Fit.Controls.WSTreeView.SelectAllMode" name="Instantly" access="public" static="true" type="string" default="Instantly">
	/// 	<description>
	/// 		Load all children at once (WebService is expected to return the complete hierarchy in one single request).
	/// 		This approach will provide better performance as it does not fire OnChange for every child expanded,
	/// 		and only sends one HTTP request to WebService.
	/// 	</description>
	/// </member>
	Instantly: "Instantly"
};
