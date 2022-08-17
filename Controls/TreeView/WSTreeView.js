/// <container name="Fit.Controls.WSTreeView" extends="Fit.Controls.TreeView">
/// 	TreeView control allowing data from a
/// 	WebService to be listed in a structured manner.
/// 	Extending from Fit.Controls.TreeView.
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
/// 	<param name="ctlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.WSTreeView = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId, true);
	Fit.Core.Extend(this, Fit.Controls.TreeView).Apply(ctlId);

	var me = this;
	var url = null;
	var jsonpCallback = null;
	var rootNode = null;
	var preSelected = {};
	var orgSelected = [];
	var loadDataOnInit = true;
	var dataLoading = false;			// True when requesting data via Reload, EnsureData, and SelectAll
	var dataReloading = false;			// True when requesting new data via Reload
	var dataReloadingEnableFunc = null;	// Callback function when data is reloading and control has been disabled, and later needs to be re-enabled via this callback
	var nodesLoading = 0;				// Value is above zero when nodes are being loaded when expanded
	var recursiveNodeLoadCount = -1;	// Value used by recursivelyLoadAllNodes(..) to keep track of progress when chain loading nodes
	var onDataLoadedCallback = [];
	var selectAllMode = Fit.Controls.WSTreeViewSelectAllMode.Progressively;
	var onRequestHandlers = [];
	var onResponseHandlers = [];
	var onAbortHandlers = [];
	var onPopulatedHandlers = [];
	var baseSelected = this.Selected;	// Used by Selected(..), Value(), and SetSelections(..)

	// Support for ExpandAll which may trigger WebService requests to load data.
	// We therefore need to keep some state to resume ExpandAll when nodes are received,
	// which is done using the WSTreeView's OnPopulated event further down.
	var expandCollapseAllMode = -1;			// 0 = Collapse, 1 = Expand
	var expandCollapseAllMaxDepth = 99999;	// The maximum depth to expand/collapse

	function init()
	{
		rootNode = me.GetDomElement().firstChild.firstChild._internal.Node;
		rootNode.GetDomElement()._internal.WSHasChildren = true; // Support for nodeFullyLoaded(..)

		var rootedEventId = -1;
		rootedEventId = Fit.Events.AddHandler(me.GetDomElement(), "#rooted", function(elm)
		{
			if (loadDataOnInit === true)
			{
				me.Reload(true);
			}

			Fit.Events.RemoveHandler(me.GetDomElement(), rootedEventId);
		});

		me.OnToggle(function(sender, node)
		{
			// Load node data when expanded

			if (node.IsBehavioralNode() === true)
				return; // Do not request data for behavioral node

			if (node.Expanded() === true) // Node is currently expanded and will now become collapsed
				return;

			if (dataReloading === true && node.GetDomElement()._internal.WSHasChildren === true && node.GetDomElement()._internal.WSDone !== true)
			{
				// All data is currently being reloaded, so loading remote children for a node
				// which will be replaced when reload operation completes does not make sense,
				// and it will fail because the node will be disposed and replaced by the new set
				// of nodes from the reload operation.
				return false;
			}

			if (dataLoading === true && node.GetDomElement()._internal.WSHasChildren === true && node.GetDomElement()._internal.WSDone !== true)
			{
				// Node contains remote children that has not yet been loaded, and
				// data is currently being loaded, e.g. by EnsureData(..), Reload(..),
				// or SelectAll(..). Adding request to process queue.
				onDataLoaded(function() { node.Expanded(true); });
				return false;
			}

			if (node.GetDomElement()._internal.WSLoading === true)
			{
				// Data for this node is currently being loaded.
				// Return False to cancel toggle to prevent user from being
				// able to expand node (and re-trigger data load) multiple times.
				return false;
			}

			var dataStartedLoading = loadNodeData(node, function(nodePopulated) // Returns False if there are no remote nodes to load, or if request is suppressed using an OnRequest handler
			{
				// Children now loaded and populated

				nodesLoading--;

				if (nodeDisposedOrDetached(node) === false)
				{
					delete node.GetDomElement()._internal.WSLoading;
					node.Expanded(true); // Unfortunately causes both OnToggle and OnToggled to be fired, although OnToggle has already been fired once (canceled below)
				}

				if (nodesLoading === 0)
				{
					// Reload, SelectAll, or EnsureData may have been called while
					// node was loading - make sure they are resumed from process queue.
					fireOnDataLoadedToResumeProcessQueue();
				}
			});

			if (dataStartedLoading === true)
			{
				// Prevent e.g. EnsureData, Reload, and SelectAll from loading while current node
				// is being loaded and populated.
				// We cannot use the dataLoading variable for this though, as it would also prevent the
				// user from expanding (and requesting data for) multiple nodes simultaneously since this OnToggle
				// handler prevents the user from expanding nodes if dataLoading is True (set by EnsureData/Reload/etc).
				// Instead we use nodesLoading which is incremented and decremented when node data is requested and populated.
				// EnsureData(..), Reload(..) and other functions fetching data checks this variable, and
				// if its value is above zero, the functions will reschedule and run after all requested
				// nodes are done loading.
				nodesLoading++;

				node.GetDomElement()._internal.WSLoading = true;
				return false; // Cancel toggle, will be "resumed" (triggered again in loadNodeData callback above) when data is loaded
			}

			if (dataStartedLoading === false && node.GetDomElement()._internal.WSHasChildren === true && node.GetChildren().length === 1 && node.GetChildren()[0].Value() === "__" && node.GetChildren()[0].Title() === "__")
			{
				// Node has remote children and no pre-populated children, but data load
				// was not started, meaning it was suppressed using an OnRequest handler.
				// Prevent node from expanding since it will reveal the place holder node making
				// parent node expandable.
				return false;
			}
		});

		//{ SelectAll - Mode: Instantly

		// Instant Mode - how it works:
		// Node on which Select All is triggered will have all its children removed (in OnResponse handler)
		// and replaced by the new data returned. This is to prevent that any children already loaded is
		// expanded and causing separate requests. Instant Mode is quaranteed to only trigger
		// one request and fire OnChange only once, provided that no nodes returned has HasChildren set to True
		// which WILL trigger additional requests and fire OnChange multiple times.
		// Instant Mode provides better performance over Progressive Mode since the latter will constantly
		// occupy the JS thread on and off, as nodes are received from multiple requests, making the browser less responsive.
		// However, Instant Mode loads data by expanding nodes while Progressive Mode can do this without affecting the UI.
		// Progressive Mode is handled in SelectAll function override.
		// TBD: Can/should we change implementation so it uses the new node loader mechanism which Progressive Mode uses,
		// so SelectAll in Instant Mode does not expand nodes, but merely loads children?

		me.OnSelectAll(function(sender, eventArgs)
		{
			if (selectAllMode === Fit.Controls.WSTreeViewSelectAllMode.Progressively)
				return; // Progressive Mode is handled in WSTreeView.SelectAll function override

			var node = ((eventArgs.Node !== null) ? eventArgs.Node : rootNode);
			var internal = node.GetDomElement()._internal;

			// Check whether all nodes have already been loaded

			if (nodeFullyLoaded(node) === true)
				return; // Everything is already loaded, let TreeView.SelectAll take care of selecting and expanding nodes

			// Some (or all) children missing - load now

			// Flags set below ensures that Select All is resumed in OnRequest and OnPopulated event handlers
			internal.WSSelectAll = true; // Used when firing OnRequest, OnResponse, and OnPopulated events which expose an eventArgs.SelectAll boolean
			internal.WSCheckedState = eventArgs.Selected;

			if (node === rootNode) // Load root nodes
			{
				setTimeout(function() // Postpone call to Reload to allow SelectAll to fire all OnSelectAll listeners before requesting data, causing OnRequest to fire
				{
					me.Reload(true);
				}, 0);
			}
			else
			{
				// Clear WebService state in case node has already been expanded
				delete internal.WSDone;
				delete internal.WSLoading;

				// Make node load children after OnSelectAll is canceled below, by returning False
				node.Expanded(false);
				setTimeout(function() { node.Expanded(true); }, 0);
			}

			// Cancel SelectAll, it will cause any existing children to be selected, and in turn fire OnChange.
			// Children will be selected once the complete hierarchy of children is received and populated (see OnResponse and OnPopulated below).
			return false;
		});

		me.OnResponse(function(sender, eventArgs)
		{
			if (selectAllMode === Fit.Controls.WSTreeViewSelectAllMode.Progressively)
				return;

			// Remove any existing children (subtree may have been partially loaded by user).
			// WebService is expected to return entire record set capable of replacing partially loaded data.

			var node = ((eventArgs.Node !== null) ? eventArgs.Node : rootNode);

			if (eventArgs.SelectAll === true) // Select All triggered request
			{
				me._internal.ExecuteWithNoOnChange(function() // Prevent checked nodes from firing OnChange when removed, fires in OnPopulated event handler
				{
					// Deselect children first (recursively) - may need to be synchronized with drop down control
					Fit.Array.Recurse(node.GetChildren(), "GetChildren", function(n)
					{
						n.Selected(false); // NOTICE: In case n.Selectable() returns False, we rely on WebService to return node with the same Selectable and Selected state as it has now
					});

					// Remove nodes - will be replaced in OnPopulated event handler
					Fit.Array.ForEach(node.GetChildren(), function(child)
					{
						node.RemoveChild(child);
					});
				});
			}
		});

		me.OnPopulated(function(sender, eventArgs)
		{
			if (selectAllMode === Fit.Controls.WSTreeViewSelectAllMode.Progressively)
				return;

			var node = ((eventArgs.Node !== null) ? eventArgs.Node : rootNode);
			var selected = node.GetDomElement()._internal.WSCheckedState;

			if (eventArgs.SelectAll === true) // Select All triggered request
			{
				// Select/deselect and expand all nodes

				var changed = false;

				me._internal.ExecuteWithNoOnChange(function()
				{
					if (node !== rootNode && node.Selectable() === true && node.Selected() !== selected)
					{
						node.Selected(selected);
						changed = true;
					}

					Fit.Array.Recurse(node.GetChildren(), "GetChildren", function(child)
					{
						// Support HasChildren:true, even in Instant Mode

						var childInternal = child.GetDomElement()._internal;

						if (childInternal.WSHasChildren === true && childInternal.WSDone !== true) // Node has children server side which have not loaded yet
						{
							Fit.Browser.Log("NOTICE: WebService did not provide all data in one single HTTP request - an additional request is required to load data for node with value '" + child.Value() + "'");
							childInternal.WSSelectAll = true; // Used when firing OnRequest, OnResponse, and OnPopulated events which expose an eventArgs.SelectAll boolean
							childInternal.WSCheckedState = selected;
						}

						// Select node if selectable

						if (child.Selectable() === true && child.Selected() !== selected)
						{
							child.Selected(selected);
							changed = true;
						}

						// Expand node to load children (HasChildren)

						child.Expanded(true);
					});
				});

				if (changed === true)
					me._internal.FireOnChange();
			}
		});

		//}

		// ExpandAll(..) support.
		// Using the OnPopulated event to progressively expand nodes is more
		// complicated than just loading all nodes first with recursivelyLoadAllNodes(..),
		// and via its callback, which is fired when all nodes are loaded, expand all the nodes.
		// But the approach using OnPopulated to resume the ExpandAll operation has the advantage
		// that the user can visually see the progress as nodes expand and their children start loading.
		me.OnPopulated(function(sender, eventArgs)
		{
			if (expandCollapseAllMode === -1)
				return;

			var node = eventArgs.Node;

			if (node === null)
				return; // Root node populated

			if (node.GetLevel() + 1 < expandCollapseAllMaxDepth)
			{
				expandCollapseNodesRecursively(node.GetChildren(), expandCollapseAllMode, expandCollapseAllMaxDepth);
			}
		});
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
	/// 		Additionally Expanded:boolean can be set to initially display node as expanded.
	/// 	</description>
	/// 	<param name="wsUrl" type="string" default="undefined"> If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetNodes) </param>
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

	/// <function container="Fit.Controls.WSTreeView" name="JsonpCallback" access="public" returns="string | null">
	/// 	<description>
	/// 		Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication.
	/// 		Often this argument is simply &quot;callback&quot;. Passing Null disables JSONP communication again.
	/// 	</description>
	/// 	<param name="val" type="string | null" default="undefined"> If defined, enables JSONP and updates JSONP callback argument </param>
	/// </function>
	this.JsonpCallback = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true || val === null)
		{
			jsonpCallback = val;
		}

		return jsonpCallback;
	}

	/// <function container="Fit.Controls.WSTreeView" name="SelectAllMode" access="public" returns="Fit.Controls.WSTreeViewSelectAllMode">
	/// 	<description>
	/// 		Get/set flag indicating whether WebService returns the complete hierarchy when
	/// 		Select All is triggered (Instantly), or loads data for each level individually
	/// 		when TreeView automatically expands all nodes (Progressively - chain loading).
	/// 	</description>
	/// 	<param name="val" type="Fit.Controls.WSTreeViewSelectAllMode" default="undefined"> If defined, behaviour is set to specified mode </param>
	/// </function>
	this.SelectAllMode = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === Fit.Controls.WSTreeViewSelectAllMode.Progressively || val === Fit.Controls.WSTreeViewSelectAllMode.Instantly)
				selectAllMode = val;
		}

		return selectAllMode;
	}

	// See documentation on TreeView
	this.SelectAll = Fit.Core.CreateOverride(this.SelectAll, function(select, selectAllNode)
	{
		Fit.Validation.ExpectBoolean(select);
		Fit.Validation.ExpectInstance(selectAllNode, Fit.Controls.TreeViewNode, true);

		// NOTICE: Selecting thousands of nodes using SelectAll may result in very poor performance
		// due to the large amount of DOM manipulation. The control goes through a full state change
		// for every single item being selected or de-selected, so all events fire and reflows are
		// triggered for visible items.
		// To increase performance, temporarily hide TreeView with display:none while SelectAll is being performed.

		// TBD: Add support for completed callback (?).
		// EnsureData, which is also based on the new node loader mechanism
		// (loadNodeData and recursivelyLoadAllNodes) keeps track of progress
		// and knows when all nodes have been loaded, so we could easily
		// add support for a callback or an event such as OnSelectAllComplete.
		// We already have an event called OnSelectAll which fires prior to
		// selection changes.
		// We can implement this when/if needed at some point. See EnsureData
		// for inspiration.

		if (selectAllMode === Fit.Controls.WSTreeViewSelectAllMode.Instantly)
		{
			// Fit.Controls.WSTreeViewSelectAllMode.Instantly Mode is handled with
			// OnSelectAll, OnResponse, and OnPopulated handlers registered in init()
			// when TreeView.SelectAll (base) is invoked below.
			base(select, selectAllNode);
			return;
		}

		// Progressive Mode - how it works:
		// Nodes are loaded progressively (chain loaded) from WebService.
		// Nodes with children not loaded yet will be loaded and populated, while
		// nodes already populated will remain (which is the opposite of Instant Mode which removes
		// children already loaded to make sure all data is received in just one request).
		// WebService may return multiple levels of nodes, or even the complete hierarchy, but Progressive Mode
		// will never be able to quarantee that only one request is made, since the node triggering Select All
		// may already have multiple children loaded with HasChildren set to True, which will spawn individual
		// requests.
		// To select all nodes and ensure only one request is made, set SelectAllMode
		// to Fit.Controls.WSTreeViewSelectAllMode.Instantly and make sure the server
		// returns the entire children hierarchy for a given target node.

		if (dataLoading === true || nodesLoading > 0)
		{
			// Data is currently loading - postpone by adding request to process queue
			onDataLoaded(function() { me.SelectAll(select, selectAllNode); });
			return;
		}

		var internal = (selectAllNode || rootNode).GetDomElement()._internal;
		internal.WSSelectAll = true; // Used when firing OnRequest, OnResponse, and OnPopulated events which expose an eventArgs.SelectAll boolean

		var baseSelectAll = base; // Reference to original SelectAll function on TreeView class
		var exec = function()
		{
			dataLoading = true;

			recursivelyLoadAllNodes(selectAllNode || null, function() // Fired when all nodes have been loaded
			{
				/*//baseSelectAll(select, selectAllNode);
				baseSelectAll(select, selectAllNode, true); // Passing True to suppress firing of OnSelectAllComplete event (internal argument)
				dataLoading = false;
				me._internal.FireOnSelectAllComplete(select, selectAllNode);
				fireOnDataLoadedToResumeProcessQueue();*/

				// This callback passed to recursivelyLoadAllNodes(..) is fired BEFORE OnPopulated
				// is fired, so if SelectAll results in multiple nodes loading data async, we may experience
				// events firing like so:
				//  - OnPopulated(sender, node1) fired
				//  - OnPopulated(sender, node2) fired
				//  - OnPopulated(sender, node3) fired
				//  - SelectAll(sender, nodeA) fired
				//  - SelectAllComplete(sender, nodeA) fired
				//  - OnPopulated(sender, node4) fired
				// Notice how the last node will have OnPopulated called after OnSelect and OnSelectComplete,
				// while all the other nodes had it called prior to that. Such inconsistency is no good. And
				// since SelectAll is async anyways, we might as well just queue the execution of SelectAll
				// using setTimeout(..) allowing for the last OnPopulated event to fire first.
				// This way we can also let baseSelectAll(..) handle execution of both OnSelectAll and OnSelectAllComplete.
				// https://github.com/Jemt/Fit.UI/issues/84

				dataLoading = false;
				fireOnDataLoadedToResumeProcessQueue();
				setTimeout(function() { baseSelectAll(select, selectAllNode); }, 0); // Allow OnPopulated to fire first in recursivelyLoadAllNodes => loadNodeData => getData
			}/*,
			function(nodePopulated) // Fired for every node loaded, except if node has been disposed or detached while loading
			{
				//nodePopulated.Expanded(true); // DISABLED: This hurts performance significantly for large TreeViews (10-15.000 nodes) as a huge amounts of DOM elements needs to be pushed to render tree, e.g. when opening/closing dropdown hosting TreeView
			}*/);
		};

		if (loadDataOnInit === true) // No data loaded yet
		{
			me.Reload(true, function(sender) // Will change loadDataOnInit to False
			{
				exec();
			});
		}
		else // Data already (partially) loaded - often just the root nodes
		{
			exec();
		}
	});

	// See documentation on TreeView
	this.RemoveAllChildren = Fit.Core.CreateOverride(this.RemoveAllChildren, function(dispose)
	{
		Fit.Validation.ExpectBoolean(dispose, true);

		preSelected = {}; // Clear preselections to avoid auto selection of nodes added later
		base(dispose);
	});

	// See documentation on TreeView
	this.Selectable = Fit.Core.CreateOverride(this.Selectable, function(val, multi, showSelAll)
	{
		Fit.Validation.ExpectBoolean(val, true);
		Fit.Validation.ExpectBoolean(multi, true);
		Fit.Validation.ExpectBoolean(showSelAll, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (Fit.Array.Count(preSelected) > 0)
			{
				// Help developers - it might be confusing that changing Selectable state also clears selection
				Fit.Browser.Debug("WSTreeView: Selectable changed - PreSelections will be cleared");
			}

			preSelected = {}; // Clear preselections to ensure same behaviour as TreeView.Selectable(..) which clear selections - avoid auto selection if nodes are loaded later
		}

		return base(val, multi, showSelAll);
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

	/// <function container="Fit.Controls.WSTreeViewTypeDefs" name="ReloadCallback">
	/// 	<description> Reload callback </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// </function>

	/// <function container="Fit.Controls.WSTreeView" name="Reload" access="public">
	/// 	<description> Reload data from WebService </description>
	/// 	<param name="keepState" type="boolean" default="undefined">
	/// 		If defined, True will preserve selections, expanded state, and focus state, False will not (default)
	/// 	</param>
	/// 	<param name="cb" type="Fit.Controls.WSTreeViewTypeDefs.ReloadCallback" default="undefined">
	/// 		If defined, callback function is invoked when root nodes have been loaded
	/// 		and populated - takes Sender (Fit.Controls.WSTreeView) as an argument.
	/// 	</param>
	/// </function>
	this.Reload = function(a, b) // Correct signature: Reload(boolean, function)
	{
		// Backward compatibility - temporary support for deprecated Reload signature: Reload([callback])

		var keepState = undefined;
		var cb = undefined;

		if (typeof(a) === "boolean")
		{
			// Correct signature used: Reload([bool[, callback]])

			keepState = a;
			cb = b;
		}
		else if (typeof(a) === "function")
		{
			// Deprecated signature used: Reload([callback])

			keepState = b;
			cb = a;

			Fit.Browser.Log("WARNING: Using deprecated function signature for WSTreeView.Reload(callback) which will be removed in the future - please use Reload(boolean, callback) instead");
		}

		// End of backward compatibility for deprecated Reload signature

		Fit.Validation.ExpectBoolean(keepState, true);
		Fit.Validation.ExpectFunction(cb, true);

		// Disable control when new data is requested so old data cannot be selected

		if (me.Enabled() === true && dataReloadingEnableFunc === null)
		{
			dataReloadingEnableFunc = me._internal.DisableAndKeepFocus(); // Only preserves focus if control is already focused, of course
			dataReloading = true;
		}

		// Postpone operation if currently loading data

		if (dataLoading === true || nodesLoading > 0)
		{
			// Data is currently loading - postpone by adding request to process queue
			onDataLoaded(function() { me.Reload(keepState, cb); });
			return;
		}

		// Load data

		dataLoading = true;
		dataReloading = true;

		getData(null, keepState === true, function(node, eventArgs) // Notice: node argument is null when requesting root nodes
		{
			// Preserve expanded state

			var expanded = {};

			if (keepState === true)
			{
				Fit.Array.ForEach(me.GetAllNodes(), function(node)
				{
					if (node.Expanded() === true)
					{
						expanded[node.Value()] = true;
					}
				});
			}

			// Get focused or highlighted node

			var focusedNode = keepState === true && me.GetNodeFocused() !== null ? me.GetNodeFocused().Value() : null;		// Focused node (real focus) - when WSTreeView is used as a separate control
			var highlightedNode = keepState === true && me.GetHighlighted() !== null ? me.GetHighlighted().Value : null;	// Highlighted noded - when WSTreeView is used as a picker control

			// Preserve selection if instructed to.
			// Nodes will automatatically be selected again using preselections
			// once data has been populated. This happens in the getData(..) function.

			var selected = me.Selected();
			var newPreselection = {};

			if (keepState === true)
			{
				Fit.Array.ForEach(selected, function(node)
				{
					newPreselection[node.Value()] = {Title: node.Title(), Value: node.Value()};
				});
			}
			else
			{
				// Clear control if selection is not preserved. This ensures that events such as
				// OnSelect and OnSelected (PickerBase) and OnChange fires for nodes currently selected,
				// which in turn updates a host control using WSTreeView as a picker control.
				me.Clear();
			}

			// Preserve scroll position in case user scrolled view while data was loading. Calling node.Focused(true)
			// or SetActiveNode(..) further down will not only focus or highlight node, but also scroll it into view.
			var scrollbars = Fit.Dom.GetScrollBars(me.GetDomElement());
			var scrollParent = scrollbars.Vertical.Enabled === true || scrollbars.Horizontal.Enabled === true ? me.GetDomElement() : Fit.Dom.GetScrollParent(me.GetDomElement());
			var scrollPositionToRestore = keepState === true ? { Top: scrollParent.scrollTop, Left: scrollParent.scrollLeft } : null;

			// Remove nodes
			me._internal.ExecuteWithNoOnChange(function()
			{
				me.RemoveAllChildren(true); // True to dispose objects - also clears selections, including preselections
			});

			preSelected = newPreselection;

			// Restore expanded state (createNodeFromJson reads Expanded property from JSON children).
			// NOTICE: Nodes with remote children (HasChildren is true) will NOT be expanded, even if
			// expanded prior to calling Reload(true, ..)! These nodes must be expanded using TreeViewNode.Expanded(true)
			// to load data, and it will cause data to load async. which will result in additional updates to the UI - and one
			// of the intentions with keepState is to reduce such "flickering" in the user interface. If one really wants
			// to preserve expanded state for nodes with remote children, then enrich the request to the server with information
			// about what children are expanded so their children can be included in the data response, and set HasChildren to False.
			if (keepState === true)
			{
				Fit.Array.Recurse(eventArgs.Children, "Children", function(jsonChild)
				{
					if (jsonChild.HasChildren === true)
					{
						return; // Skip node with remote children - see reason in comment above
					}

					jsonChild.Expanded = expanded[jsonChild.Value] === true;
				});
			}

			// Populate nodes
			Fit.Array.ForEach(eventArgs.Children, function(jsonChild)
			{
				me.AddChild(createNodeFromJson(jsonChild));
			});

			// Re-enable control
			if (dataReloadingEnableFunc !== null)
			{
				dataReloadingEnableFunc();
				dataReloadingEnableFunc = null;
			}

			// Focus or highlight previously focused/highlighted node
			if (focusedNode !== null && me.Focused() === true)
			{
				var nodeToFocus = me.GetChild(focusedNode, true);

				if (nodeToFocus !== null)
				{
					nodeToFocus.Focused(true);
				}
			}
			else if (highlightedNode !== null)
			{
				var nodeToActivate = me.GetChild(highlightedNode, true);

				if (nodeToActivate !== null)
				{
					me.SetActiveNode(nodeToActivate);
				}
			}

			// Restore scroll position
			if (scrollPositionToRestore !== null)
			{
				scrollParent.scrollTop = scrollPositionToRestore.Top;
				scrollParent.scrollLeft = scrollPositionToRestore.Left;
			}

			dataLoading = false;
			dataReloading = false;

			rootNode.GetDomElement()._internal.WSDone = true;

			/*if (Fit.Validation.IsSet(cb) === true)
			{
				cb(me); // Fires when nodes are populated (above), but before OnPopulated is fired by getData(..)
			}*/

			fireOnDataLoadedToResumeProcessQueue();

			if (Fit.Validation.IsSet(cb) === true)
			{
				setTimeout(function() { cb(me); }, 0); // Allow OnPopulated to fire first in recursivelyLoadAllNodes => loadNodeData => getData - see WSTreeView.SelectAll(..) for details
			}
		});

		loadDataOnInit = false;
	}

	/// <function container="Fit.Controls.WSTreeView" name="EnsureData" access="public">
	/// 	<description>
	/// 		Ensure all data from WebService.
	/// 		Contrary to Reload(..), this function does not clear selected
	/// 		values, or remove nodes already loaded - it merely loads data
	/// 		not already loaded.
	/// 	</description>
	/// 	<param name="callback" type="Fit.Controls.WSTreeViewTypeDefs.ReloadCallback" default="undefined">
	/// 		If defined, callback function is invoked when all nodes have been loaded
	/// 		and populated - takes Sender (Fit.Controls.WSTreeView) as an argument.
	/// 	</param>
	/// </function>
	this.EnsureData = function(cb)
	{
		Fit.Validation.ExpectFunction(cb, true);

		if (dataLoading === true || nodesLoading > 0)
		{
			// Data is currently loading - postpone by adding request to process queue
			onDataLoaded(function() { me.EnsureData(cb); });
			return;
		}

		var exec = function()
		{
			dataLoading = true;

			recursivelyLoadAllNodes(null, function() // Fired when all nodes have been loaded
			{
				dataLoading = false;

				/*if (Fit.Validation.IsSet(cb) === true)
				{
					cb(me);
				}*/

				fireOnDataLoadedToResumeProcessQueue();

				if (Fit.Validation.IsSet(cb) === true)
				{
					setTimeout(function() { cb(me); }, 0); // Allow OnPopulated to fire first in recursivelyLoadAllNodes => loadNodeData => getData - see WSTreeView.SelectAll(..) for details
				}
			});
		};

		if (me.GetChildren().length === 0) // No nodes in TreeView - we check against node count instead of loadDataOnInit since we want to be able to re-ensure nodes in case they we initially loaded and later removed
		{
			me.Reload(true, function(sender) // Will change loadDataOnInit to False
			{
				exec();
			});
		}
		else // Data already (partially) loaded - often just the root nodes
		{
			exec();
		}
	}

	// See documentation on TreeView
	this.ExpandAll = function(maxDepth)
	{
		Fit.Validation.ExpectInteger(maxDepth, true);
		setExpandedStateForAllNodes(1, maxDepth);
	}

	// See documentation on TreeView
	this.CollapseAll = function(maxDepth)
	{
		Fit.Validation.ExpectInteger(maxDepth, true);
		setExpandedStateForAllNodes(0, maxDepth);
	}

	// See documentation on ControlBase
	this.Value = Fit.Core.CreateOverride(this.Value, function(val, preserveDirtyState)
	{
		Fit.Validation.ExpectString(val, true);
		Fit.Validation.ExpectBoolean(preserveDirtyState, true);

		// Setter

		if (Fit.Validation.IsSet(val) === true)
		{
			orgSelected = (preserveDirtyState !== true ? [] : orgSelected);
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

				if (preserveDirtyState !== true)
				{
					Fit.Array.ForEach(selected, function(node)
					{
						Fit.Array.Add(orgSelected, node.Value());
					});
				}

				// Add nodes not loaded yet to preselections

				var values = val !== "" ? val.split(";") : [];

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

						if (preserveDirtyState !== true)
						{
							Fit.Array.Add(orgSelected, preSel.Value);
						}

						fireOnChange = true;
					}
				});
			});

			if (fireOnChange === true)
				me._internal.FireOnChange();
		}

		// Getter

		var nodes = me.Selected();
		var value = "";

		Fit.Array.ForEach(nodes, function(node)
		{
			value += ((value !== "") ? ";" : "") + encodeReserved(node.Title()) + "=" + encodeReserved(node.Value());
		});

		return value;
	});

	/// <function container="Fit.Controls.WSTreeView" name="SetNodeSelection" access="public">
	/// 	<description>
	/// 		Allows for a node's selection state to be set even if node has not been loaded yet
	/// 	</description>
	/// 	<param name="value" type="string"> Node value </param>
	/// 	<param name="selected" type="boolean"> Node selection state </param>
	/// </function>
	this.SetNodeSelection = function(value, selected)
	{
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(selected);

		var node = me.GetChild(value, true);

		if (node !== null)
		{
			node.Selected(selected); // Will fire OnChange
		}
		else
		{
			if (selected === true && preSelected[value] === undefined)
			{
				preSelected[value] = { Title: "[pre-selection]", Value: value };
				me._internal.FireOnChange();
			}
			else if (selected === false && preSelected[value] !== undefined)
			{
				delete preSelected[value];
				me._internal.FireOnChange();
			}
		}
	}

	/// <function container="Fit.Controls.WSTreeView" name="Selected" access="public" returns="Fit.Controls.TreeViewNode[]">
	/// 	<description>
	/// 		Fit.Controls.TreeView.Selected override:
	/// 		Get/set selected nodes.
	/// 		Notice for getter: Nodes not loaded yet (preselections) are NOT valid nodes associated with TreeView.
	/// 		Therefore most functions will not work. Preselection nodes can be identified by their title:
	/// 		if (node.Title() === "[pre-selection]") console.log("This is a preselection node");
	/// 		Only the following getter functions can be used for preselection nodes:
	/// 		node.Title(), node.Value(), node.Selected()
	/// 	</description>
	/// 	<param name="val" type="Fit.Controls.TreeViewNode[]" default="undefined"> If defined, provided nodes are selected </param>
	/// </function>
	this.Selected = function(val)
	{
		Fit.Validation.ExpectInstanceArray(val, Fit.Controls.TreeViewNode, true);

		// Setter

		if (Fit.Validation.IsSet(val) === true)
		{
			// Exclude nodes not belonging to TreeView - trying to select them
			// will cause an error to be thrown from TreeView.Selected (base).
			// Nodes excluded are added as preselections instead.

			var toSelect = [];

			Fit.Array.ForEach(val, function(n)
			{
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

			// Fire OnChange

			if (fireOnChange === true)
			{
				me._internal.FireOnChange();
			}
		}

		// Getter

		var nodes = baseSelected();

		// Add preselections - they are considered part of value
		Fit.Array.ForEach(preSelected, function(preSelVal)
		{
			var preSel = preSelected[preSelVal];
			Fit.Array.Add(nodes, new Fit.Controls.TreeViewNode(preSel.Title, preSel.Value)); // Invalid nodes! E.g. node.Selected(true) and node.GetTreeView() will not work since node has no association with TreeView
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
		me = url = jsonpCallback = preSelected = orgSelected = loadDataOnInit = dataLoading = dataReloading = dataReloadingEnableFunc = nodesLoading = recursiveNodeLoadCount = onDataLoadedCallback = onRequestHandlers = onResponseHandlers = onPopulatedHandlers = baseSelected = expandCollapseAllMode = expandCollapseAllMaxDepth = null;

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
	this.UpdateItemSelection = Fit.Core.CreateOverride(this.UpdateItemSelection, function(itemValue, selected, programmaticallyChanged)
	{
		Fit.Validation.ExpectString(itemValue);
		Fit.Validation.ExpectBoolean(selected);
		Fit.Validation.ExpectBoolean(programmaticallyChanged);

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
			if (base(itemValue, selected, programmaticallyChanged) === false) // Fires OnSelect, OnItemSelectionChanging, OnSelected, OnItemSelectionChanged, and OnChange
				return false;
		}
	});

	// ============================================
	// Events
	// ============================================

	/// <container name="Fit.Controls.WSTreeViewTypeDefs.EventHandlerArgs">
	/// 	<description> Request handler event arguments </description>
	/// 	<member name="Sender" type="$TypeOfThis"> Instance of control </member>
	/// 	<member name="Request" type="Fit.Http.JsonRequest | Fit.Http.JsonpRequest"> Instance of JsonRequest or JsonpRequest </member>
	/// 	<member name="Node" type="Fit.Controls.TreeViewNode"> Instance of TreeViewNode </member>
	/// </container>

	/// <container name="Fit.Controls.WSTreeViewTypeDefs.JsonItem">
	/// 	<description> JSON object representing node </description>
	/// 	<member name="Value" type="string"> Unique value </member>
	/// 	<member name="Title" type="string" default="undefined"> Title - using Value if not defined </member>
	/// 	<member name="Selected" type="boolean" default="undefined"> Value indicating whether item is initially selected - not selected by default </member>
	/// 	<member name="Selectable" type="boolean" default="undefined"> Value indicating whether item can be selected or not - not selectable by default </member>
	/// 	<member name="HasChildren" type="boolean" default="undefined"> Set True to trigger an additional request to web service to retrieve children for this item when it is expanded </member>
	/// 	<member name="Children" type="Fit.Controls.WSTreeViewTypeDefs.JsonItem[]" default="undefined"> Children </member>
	/// 	<member name="Expanded" type="boolean" default="undefined"> Value indicating whether item is initially expanded to reveal children - not expanded by default </member>
	/// 	<member name="Supplementary" type="{[key:string]: string}" default="undefined"> Associative string array to carry additional information </member>
	/// </container>

	/// <container name="Fit.Controls.WSTreeViewTypeDefs.DataHandlerEventArgs" extends="Fit.Controls.WSTreeViewTypeDefs.EventHandlerArgs">
	/// 	<description> Data event handler arguments </description>
	/// 	<member name="Children" type="Fit.Controls.WSTreeViewTypeDefs.JsonItem[]"> JSON objects representing nodes </member>
	/// </container>

	/// <container name="Fit.Controls.WSTreeViewTypeDefs.AbortHandlerEventArgs" extends="Fit.Controls.WSTreeViewTypeDefs.EventHandlerArgs">
	/// 	<description> Abort event handler arguments </description>
	/// 	<member name="Children" type="null"> JSON objects representing nodes </member>
	/// </container>

	/// <function container="Fit.Controls.WSTreeViewTypeDefs" name="CancelableRequestEventHandler" returns="boolean | void">
	/// 	<description> Cancelable request event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="eventArgs" type="Fit.Controls.WSTreeViewTypeDefs.EventHandlerArgs"> Event arguments </param>
	/// </function>

	/// <function container="Fit.Controls.WSTreeViewTypeDefs" name="DataEventHandler">
	/// 	<description> Data event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="eventArgs" type="Fit.Controls.WSTreeViewTypeDefs.DataHandlerEventArgs"> Event arguments </param>
	/// </function>

	/// <function container="Fit.Controls.WSTreeViewTypeDefs" name="AbortEventHandler">
	/// 	<description> Abort event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="eventArgs" type="Fit.Controls.WSTreeViewTypeDefs.AbortHandlerEventArgs"> Event arguments </param>
	/// </function>

	/// <function container="Fit.Controls.WSTreeView" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is being requested.
	/// 		Request can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSTreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSTreeView instance
	/// 		 - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
	/// 		 - Node: Fit.Controls.TreeViewNode instance
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSTreeViewTypeDefs.CancelableRequestEventHandler">
	/// 		Event handler function
	/// 	</param>
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
	/// 		 - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
	/// 		 - Node: Fit.Controls.TreeViewNode instance to be populated
	/// 		 - Children: JSON nodes received from WebService
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSTreeViewTypeDefs.DataEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnResponse = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onResponseHandlers, cb);
	}

	/// <function container="Fit.Controls.WSTreeView" name="OnAbort" access="public">
	/// 	<description>
	/// 		Add event handler fired if data request is canceled.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSTreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSTreeView instance
	/// 		 - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
	/// 		 - Node: Fit.Controls.TreeViewNode instance to be populated
	/// 		 - Children: JSON nodes received from WebService (Null in this particular case)
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSTreeViewTypeDefs.AbortEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnAbort = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onAbortHandlers, cb);
	}

	/// <function container="Fit.Controls.WSTreeView" name="OnPopulated" access="public">
	/// 	<description>
	/// 		Add event handler fired when TreeView has been populated with nodes.
	/// 		Node is not populated and event is not fired though if node is disposed
	/// 		or detached from TreeView while data is loading from WebService.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSTreeView) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSTreeView instance
	/// 		 - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
	/// 		 - Node: Fit.Controls.TreeViewNode instance now populated with children
	/// 		 - Children: JSON nodes received from WebService
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSTreeViewTypeDefs.DataEventHandler">
	/// 		Event handler function
	/// 	</param>
	/// </function>
	this.OnPopulated = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPopulatedHandlers, cb);
	}

	// ============================================
	// Private
	// ============================================

	// Several functions end up calling getData(..) which is a bit confusing.
	// The following link has a drawing that clarifies how this works: https://github.com/Jemt/Fit.UI/issues/83
	function getData(node, forcePersist, cb)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode, true); // Node is null when requesting root nodes
		Fit.Validation.ExpectBoolean(forcePersist);
		Fit.Validation.ExpectFunction(cb);

		if (url === null)
			Fit.Validation.ThrowError("Unable to get data, no WebService URL has been specified");

		// Determine request method

		var request = null;

		if (jsonpCallback !== null)
		{
			request = new Fit.Http.JsonpRequest(url, jsonpCallback);
		}
		else
		{
			request = new Fit.Http.JsonRequest(url)
		}

		// Fire OnRequest

		var eventArgs = { Sender: null, Node: null, Request: null, Children: null };
		eventArgs.Sender = me;
		eventArgs.Node = node;
		eventArgs.Request = request;
		eventArgs.SelectAll = (node || rootNode).GetDomElement()._internal.WSSelectAll === true;

		if (fireEventHandlers(onRequestHandlers, eventArgs) === false)
			return false;

		if (eventArgs.Request !== request)
		{
			// Support for changing request instans to
			// take control over webservice communication.

			// Restrict to support for Fit.Http.Request or classes derived from this
			Fit.Validation.ExpectInstance(eventArgs.Request, Fit.Http.Request);

			request = eventArgs.Request;
		}

		// Define request callbacks

		var onSuccess = function(children)
		{
			if (me === null)
				return; // Control was disposed while waiting for data to be loaded

			// Fire OnResponse

			eventArgs.Children = ((children instanceof Array) ? children : []);
			fireEventHandlers(onResponseHandlers, eventArgs);

			// Fire getData callback

			// WARNING: node might have been disposed - WebService communication is async!
			cb(node, eventArgs); // Callback is responsible for populating TreeView

			// Remove loading indicator

			if (request._loadingIndicator !== undefined) // Loading indicator not set when requesting root nodes
			{
				Fit.Dom.Remove(request._loadingIndicator);
				delete request._loadingIndicator;
			}

			// Highlight first node

			if (node === null) // Only do this for root nodes
			{
				if (me.PersistView() === true && forcePersist === false)
				{
					// Reset PersistView to make sure it does not reuse state
					// for newly loaded nodes, in case node list is changed.
					me.PersistView(false);
					me.PersistView(true);
				}

				if (me.HighlightFirst() === true)
				{
					// Reset HighlightFirst to make sure it takes effect again
					// for newly loaded nodes, in case node list is changed.
					me.HighlightFirst(false);
					me.HighlightFirst(true);

					me._internal.FocusFirstNode();
				}
			}

			// Select nodes found in preselections

			var hasBeenDisposedOrDetached = node !== null && nodeDisposedOrDetached(node);

			if (hasBeenDisposedOrDetached === false && Fit.Core.IsEqual(preSelected, {}) === false) // Prevent nodes from being iterated if no preselections are found
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

			// Fire OnPopulated.
			// Contrary to OnRequest, OnResponse, and OnAbort, OnPopulated does not
			// fire if node has been disposed or detached, in which case WSTreeView
			// will not have populated the node.
			// OnRequest/OnResponse/OnAbort handlers can check whether a given node
			// has been disposed or detached like this:
			// var disposed = node.GetDomElement() === null;
			// var detached = !disposed && node.GetTreeView() === null;
			// var moved = !disposed && node.GetTreeView() !== myTreeViewInstance;
			// var disposedOrDetached = node.GetDomElement() === null || node.GetTreeView() === null;

			if (hasBeenDisposedOrDetached === false)
			{
				fireEventHandlers(onPopulatedHandlers, eventArgs);
			}
		}

		var onFailure = function(httpStatusCode)
		{
			if (me === null)
				return; // Control was disposed while waiting for data to be loaded

			Fit.Validation.ThrowError("Unable to get children for " + ((node !== null) ? "node '" + node.Title() + "'" : "root level") + " - request failed with HTTP Status code " + httpStatusCode)
		}

		var onAbort = function()
		{
			if (me === null)
				return; // Control was disposed while waiting for data to be loaded

			if (request._loadingIndicator !== undefined) // Loading indicator not set when requesting root nodes
			{
				Fit.Dom.Remove(request._loadingIndicator);
				delete request._loadingIndicator;
			}

			if (node !== null) // Null when requesting root nodes
			{
				if (nodeDisposedOrDetached(node) === false)
				{
					delete node.GetDomElement()._internal.WSLoading;
				}
			}

			fireEventHandlers(onAbortHandlers, eventArgs);
		};

		// Register request callbacks

		if (Fit.Core.InstanceOf(request, Fit.Http.JsonpRequest) === false)
		{
			request.OnSuccess(function(req)
			{
				var children = request.GetResponseJson();
				onSuccess(children);
			});

			request.OnFailure(function(req)
			{
				onFailure(request.GetHttpStatus());
			});

			request.OnAbort(function(req)
			{
				onAbort();
			});
		}
		else
		{
			request.OnSuccess(function(req)
			{
				var children = req.GetResponse();
				onSuccess(children);
			});

			request.OnTimeout(function()
			{
				onFailure("UNKNOWN (JSONP)");
			});
		}

		// Display loading indicator

		if (node !== null) // Null when requesting root nodes
		{
			var li = node.GetDomElement();

			request._loadingIndicator = document.createElement("i");
			Fit.Dom.AddClass(request._loadingIndicator, "FitUiControlLoadingIndicator");
			Fit.Dom.Add(li, request._loadingIndicator);
		}

		// Invoke request

		request.Start();

		return true;
	}

	function onDataLoaded(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onDataLoadedCallback, cb);
	}

	function fireOnDataLoadedToResumeProcessQueue()
	{
		// Immediately clear collection. If multiple callbacks are registered,
		// chances are that only the first will run, and the remaining will be
		// re-scheduled again - so we need the collection to be cleared before
		// invoking callbacks.
		var orgOnDataLoadedCallback = onDataLoadedCallback;
		onDataLoadedCallback = [];

		Fit.Array.ForEach(orgOnDataLoadedCallback, function(cb)
		{
			cb();
		});
	}

	function createNodeFromJson(jsonNode)
	{
		Fit.Validation.ExpectIsSet(jsonNode);

		// Convert JSON to TreeView node, including all contained children

		var child = new Fit.Controls.TreeViewNode((jsonNode.Title ? jsonNode.Title : jsonNode.Value), jsonNode.Value);

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

		if (jsonNode.Expanded !== undefined)
			child.Expanded((jsonNode.Expanded === true)); // Notice, will not cause various events to fire since TreeViewNodeInterface is not assigned at this point

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
			var expanderNode = new Fit.Controls.TreeViewNode("__", "__");
			expanderNode.Selectable(false); // Prevent it from being selected when using SelectAll
			child.AddChild(expanderNode);
		}

		// Add supplementary information provided by WebService

		child.Supplementary = {};
		var reserved = new Array("Title", "Value", "Children", "HasChildren", "Selected", "Selectable", "Expanded");

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

	// Check whether a node has been disposed or detached from TreeView.
	// We use this function when loading nodes async, to make sure the
	// nodes are still in working order when data is received, which will
	// not be the case for a node that has been disposed (destroyed).
	// Also, a node that has been detached should no longer affect this
	// TreeView instance.
	function nodeDisposedOrDetached(node)
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);

		// Return True if node is either disposed or no longer attached to TreeView.
		// GetTreeView() returns Null if node has been removed from TreeView, or a
		// TreeView instance different from this one, if attached to another TreeView.
		// NOTICE: Moving a node currently being loaded will not work properly.
		// It will not have its _internal state updated to reflect its proper
		// state. If this is needed, search for calls to nodeDisposedOrDetached(..),
		// and make sure the node is updated if only detached, but do NOT process
		// it any further (e.g. expand it), nor let it affect state within the initial
		// TreeView from which it was moved. And make sure to test it properly!
		return node.GetDomElement() === null || node.GetTreeView() !== me;
	}

	// Loads node data and returns True if data is being loaded, False if no data needs to be loaded.
	// Does not load nodes recursively! Use recursivelyLoadAllNodes(..) for that!
	function loadNodeData(node, cb) // Populated node is passed to callback
	{
		Fit.Validation.ExpectInstance(node, Fit.Controls.TreeViewNode);
		Fit.Validation.ExpectFunction(cb, true);

		if (node.GetDomElement()._internal.WSDone === true)
		{
			return false; // Data has already been loaded
		}

		if (node.GetDomElement()._internal.WSHasChildren === false)
		{
			return false; // No remote children to load
		}

		// Get data

		var canceled = !getData(node, false, function(n, eventArgs) // Callback fired when data is ready
		{
			if (nodeDisposedOrDetached(node) === false)
			{
				// Remove place holder child which served the purpose of making the node expandable

				var expanderNode = node.GetChild("__");

				if (expanderNode !== null) // Does not exist if node was partially pre-populated server side
				{
					node.RemoveChild(expanderNode);
				}

				// Populate node

				Fit.Array.ForEach(eventArgs.Children, function(c)
				{
					node.AddChild(createNodeFromJson(c));
				});

				node.GetDomElement()._internal.WSDone = true;
			}

			// Invoke callback

			if (Fit.Validation.IsSet(cb) === true)
			{
				// WARNING: node might have been disposed - WebService communication is async!
				cb(node);
			}
		});

		return canceled === false;
	}

	// Load all children for given node recursively.
	// No arguments are passed to cbComplete - populated node is passed to cbProgress.
	function recursivelyLoadAllNodes(targetNode, cbComplete, cbProgress, isSubCall)
	{
		Fit.Validation.ExpectInstance(targetNode, Fit.Controls.TreeViewNode, true);
		Fit.Validation.ExpectFunction(cbComplete, true);
		Fit.Validation.ExpectFunction(cbProgress, true);
		Fit.Validation.ExpectBoolean(isSubCall, true);

		if (isSubCall !== true)
		{
			recursiveNodeLoadCount = 0;
		}

		var targetNodeInternal = (targetNode || rootNode).GetDomElement()._internal;
		var nodes = null;

		if (targetNode === null)
		{
			nodes = me.GetChildren();
		}
		else
		{
			nodes = targetNode.GetChildren();
		}

		var anythingToLoad = false;

		Fit.Array.ForEach(nodes, function(node)
		{
			if (node.IsBehavioralNode() === true)
				return; // Do not request data for behavioral node

			if (targetNodeInternal.WSSelectAll === true)
				node.GetDomElement()._internal.WSSelectAll = true; // Used when firing OnRequest, OnResponse, and OnPopulated events which expose an eventArgs.SelectAll boolean

			var dataStartedLoading = loadNodeData(node, function(n) // True if node has remote children that will be loaded, False if no remote children is available to be loaded
			{
				var hasBeenDisposed = nodeDisposedOrDetached(node);

				if (hasBeenDisposed === false && Fit.Validation.IsSet(cbProgress) === true)
				{
					cbProgress(node);
				}

				recursiveNodeLoadCount--;

				if (hasBeenDisposed === false)
				{
					recursivelyLoadAllNodes(node, cbComplete, cbProgress, true);
				}

				if (recursiveNodeLoadCount === 0)
				{
					if (Fit.Validation.IsSet(cbComplete) === true)
					{
						cbComplete();
					}
				}
			});

			if (dataStartedLoading === true)
			{
				anythingToLoad = true;
				recursiveNodeLoadCount++;
			}
			else
			{
				// No remote children to load, but node may have existing children that could have remote children

				if (Fit.Validation.IsSet(cbProgress) === true)
				{
					cbProgress(node);
				}

				if (recursivelyLoadAllNodes(node, cbComplete, cbProgress, true) === true)
				{
					anythingToLoad = true;
				}
			}
		});

		if (isSubCall !== true && anythingToLoad === false && Fit.Validation.IsSet(cbComplete) === true)
		{
			cbComplete();
		}

		return anythingToLoad;
	}

	// Progressively expand nodes. Nodes containing remote children will keep
	// expanding when nodes are loaded and populated, which is handled by
	// an OnToggle handler registered in init().
	function setExpandedStateForAllNodes(expandMode, maxDepth)
	{
		Fit.Validation.ExpectInteger(expandMode); // 0 = Collapse, 1 = Expand
		Fit.Validation.ExpectInteger(maxDepth, true);

		if (dataLoading === true || nodesLoading > 0)
		{
			// Data is currently loading - postpone by adding request to process queue.
			// This also applies when collapsing nodes, since the operation currently loading
			// data may be ExpandAll or SelectAll (which also expand nodes), which should be allowed
			// to finish first.
			onDataLoaded(function() { setExpandedStateForAllNodes(expandMode, maxDepth); });
			return;
		}

		// Save state to allow operation to be resumed as nodes are progressively
		// loaded and populated. State is used in OnPopulated handler registered in init().

		expandCollapseAllMode = -1;
		expandCollapseAllMaxDepth = 99999;

		if (Fit.Validation.IsSet(maxDepth) === true)
		{
			if (maxDepth < 1)
				return;

			expandCollapseAllMaxDepth = maxDepth;
		}

		expandCollapseAllMode = expandMode;

		// Load data and start expanding/collapsing

		if (loadDataOnInit === true && expandCollapseAllMode === 1)
		{
			me.Reload(true, function(sender)
			{
				expandCollapseNodesRecursively(me.GetChildren(), expandCollapseAllMode, expandCollapseAllMaxDepth);
			});
		}
		else // Data already loaded
		{
			expandCollapseNodesRecursively(me.GetChildren(), expandCollapseAllMode, expandCollapseAllMaxDepth);
		}
	}

	function expandCollapseNodesRecursively(nodes, expandCollapseMode, maxDepth)
	{
		Fit.Validation.ExpectInstanceArray(nodes, Fit.Controls.TreeViewNode);
		Fit.Validation.ExpectInteger(expandCollapseMode);
		Fit.Validation.ExpectInteger(maxDepth);

		Fit.Array.CustomRecurse(nodes, function(node)
		{
			if (expandCollapseMode === 1)
				node.Expanded(true);
			else if (expandCollapseMode === 0)
				node.Expanded(false);

			return (node.GetLevel() + 1 < maxDepth ? node.GetChildren() : null);
		});
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

/// <container name="Fit.Controls.WSTreeViewSelectAllMode">
/// 	Enum indicating how data is loaded from WebService when using the Select All feature
/// </container>
Fit.Controls.WSTreeViewSelectAllMode =
{
	/// <member container="Fit.Controls.WSTreeViewSelectAllMode" name="Progressively" access="public" static="true" type="string" default="Progressively">
	/// 	<description>
	/// 		Chain load children by progressively expanding them as they are loaded.
	/// 		This may result in several HTTP requests to WebService, and OnChange will
	/// 		fire for every node expanded if children are available server side.
	/// 	</description>
	/// </member>
	Progressively: "Progressively",

	/// <member container="Fit.Controls.WSTreeViewSelectAllMode" name="Instantly" access="public" static="true" type="string" default="Instantly">
	/// 	<description>
	/// 		Load all children at once (WebService is expected to return the complete hierarchy in one single request).
	/// 		This approach will provide better performance as it does not fire OnChange for every child expanded,
	/// 		and only sends one HTTP request to WebService.
	/// 	</description>
	/// </member>
	Instantly: "Instantly"
};

Fit.Controls.WSTreeView.SelectAllMode = Fit.Controls.WSTreeViewSelectAllMode; // Backward compatibility
