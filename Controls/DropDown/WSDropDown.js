/// <container name="Fit.Controls.WSDropDown" extends="Fit.Controls.DropDown">
/// 	WebService enabled Drop Down Menu control allowing for single and multi selection.
/// 	Supports data selection using any control extending from Fit.Controls.PickerBase.
/// 	This control is extending from Fit.Controls.DropDown.
/// </container>

/// <function container="Fit.Controls.WSDropDown" name="WSDropDown" access="public">
/// 	<description> Create instance of WSDropDown control </description>
/// 	<param name="ctlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.WSDropDown = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId, true);
	Fit.Core.Extend(this, Fit.Controls.DropDown).Apply(ctlId);

	var me = this;
	var list = null;
	var tree = null;

	var search = "";
	var forceNewSearch = false;
	var hideLinesForFlatData = true;
	var dataRequested = false;		// Flag indicating whether TreeView data has been requested or not - determines whether a call to ensureTreeViewData() actually loads data or not
	var dataLoading = false;		// Flag indicating whether TreeView data is currently being loaded by WSDropDown internals (awaiting response) - will not be True when user expand nodes to load children, or when invoking e.g. dd.GetTreeView.Reload()
	var requestCount = 0;			// Counter to keep track of nodes for which data is currently being loaded, no matter how it was being loaded (via WSDropDown internals, programmatically on WSTreeView from external code, or by user expanding nodes)
	var onDataLoadedCallback = [];
	var suppressTreeOnOpen = false;
	var timeOut = null;
	var currentRequest = null;
	var classes = null;
	var autoUpdatedSelections = null; // Cached result from AutoUpdateSelected: [{ Title:string, Value:string, Exists:boolean }, ...]

	var onRequestHandlers = [];
	var onResponseHandlers = [];
	var onAbortHandlers = [];
	//var onPopulatedHandlers = [];

	function init()
	{
		// Initialize self (drop down)

		me.OnInputChanged(function(sender, value)
		{
			if (me.Focused() === true) // Prevent search from being triggered when OnInputChanged fires after programmatically changing input value
				searchData(value);
		});

		// Get drop down open/close button element (arrow)

		var cmdOpen = me.GetDomElement().firstChild.children[me.GetDomElement().firstChild.children.length - 1];
		classes = cmdOpen.className;

		// Create ListView

		list = new Fit.Controls.WSListView(ctlId + "__WSListView");
		list.OnRequest(function(sender, eventArgs)
		{
			if (fireEventHandlers(onRequestHandlers, list, eventArgs) === false)
				return false;

			requestCount++;
			currentRequest = eventArgs.Request;
			cmdOpen.className = "fa fa-refresh fa-spin";
		});
		list.OnResponse(function(sender, eventArgs)
		{
			requestCount--;

			fireEventHandlers(onResponseHandlers, list, eventArgs);

			cmdOpen.className = classes;
			currentRequest = null;

			if (forceNewSearch === true)
			{
				forceNewSearch = false;

				eventArgs.Items = []; // Remove data, we do not want it to be populated to control
				searchData(me.GetInputValue());
			}
		});
		list.OnAbort(function(sender, eventArgs)
		{
			requestCount--;
		});
		list.OnItemSelectionChanging(function(sender, item)
		{
			// Prevent user from deselecting node which is read only in tree (not selectable)

			var node = tree.GetChild(item.Value, true);

			if (node !== null && node.Selectable() === false)
				return false;
		});
		list.OnItemSelectionChanged(function(sender, item)
		{
			// DropDown (base) automatically closes drop down in Single Selection Mode, but we
			// always want it to close drop down when using ListView to select data from a search query.
			// ListView is only used to select data from search results - TreeView is used to display
			// all data, no matter if it is received in a flat list or a hierarchy.
			if (item.Selected === true) // Only close when a selection is made - removing an item keeps drop down open
				me.CloseDropDown();
		});

		// Create TreeView

		tree = new Fit.Controls.WSTreeView(ctlId + "__WSTreeView");
		tree.Selectable(true); // Make nodes selectable by default when added
		tree.Width(100, "%");
		//tree.Lines(true); // DISABLED - lines do not scale with font size
		//tree.AllowDeselect(true); // DISABLED - AllowDeselect is True by default
		tree.OnRequest(function(sender, eventArgs)
		{
			if (fireEventHandlers(onRequestHandlers, tree, eventArgs) === false)
			{
				return false;
			}

			dataRequested = true;
			requestCount++;

			if (dataLoading === true)
			{
				cmdOpen.className = "fa fa-refresh fa-spin";
			}
		});
		tree.OnResponse(function(sender, eventArgs)
		{
			requestCount--;

			fireEventHandlers(onResponseHandlers, tree, eventArgs);

			if (requestCount === 0)
			{
				cmdOpen.className = classes;

				// Make sure to fire internal OnDataLoaded event in case a WebService operation
				// was invoked on DropDown while WSTreeView was loading data, e.g. triggered by
				// a user interaction such as expanding a node.
				// DropDown takes care of firing internal event OnDataLoaded if dataLoading is True,
				// in which case DropDown triggered the initial WebService operation and knows when
				// it has finished.
				if (dataLoading === false)
				{
					fireOnDataLoaded();
				}
			}
		});
		tree.OnAbort(function(sender, eventArgs)
		{
			requestCount--;

			fireEventHandlers(onAbortHandlers, tree, eventArgs);

			if (requestCount === 0)
			{
				cmdOpen.className = classes;

				if (dataLoading === false) // See comment to related code in OnResponse handler above
				{
					fireOnDataLoaded();
				}
			}
		});
		tree.OnPopulated(function(sender, eventArgs)
		{
			if (hideLinesForFlatData === true && tree.Lines() === true) // Lines are off by default but might have been enabled like so: dd.GetTreeView().Lines(true)
			{
				// Disable helper lines if no children are contained

				var hasChildren = false;

				Fit.Array.ForEach(tree.GetChildren(), function(c)
				{
					if (c.GetChildren().length > 0)
					{
						hasChildren = true;
						return false;
					}
				});

				if (hasChildren === false)
				{
					tree.Lines(false);
					//tree.GetDomElement().style.marginLeft = "-2em";
				}

				hideLinesForFlatData = false;
			}

			// Scroll selected item into view in Single Selection Mode.
			// NOTICE: DropDown also calls RevealItemInView(..) when
			// dropdown is opened. But for WSDropDown there are (most often)
			// no nodes initially, so we make sure to call RevealItemInView(..)
			// below when root nodes have been loaded and populated.
			// We only want to do this for root nodes - otherwise the selected
			// item would constantly be scrolled into view while user expand nodes
			// with remote children.
			// This works even for nested items if they are returned in the initial
			// call for root nodes. It will not work if nodes are loaded programmatically
			// using e.g. WSDropDown.AutoUpdateSelected() or WSTreeView.ExpandAll() though,
			// if the selected item is returned in a secondary request for remote children.
			// To support this scenario we would need to carry information about whether
			// the request was made programmatically or triggered via a user interaction,
			// which would complicate things, so for now we are satisfied with the current
			// implementation.

			if (eventArgs.Node === null && me.MultiSelectionMode() === false && me.GetSelections().length === 1)
			{
				tree.RevealItemInView(me.GetSelections()[0].Value);
			}
		});
		tree.OnSelectAll(function(sender, eventArgs)
		{
			// Make sure focus is lost when SelectAll is invoked. Otherwise control will
			// reassign focus every time an item is added which is very expensive performance wise.
			// DISABLED: This is simply to annoying for the user as dropdown closes when Focused(false) is called.
			// Also, due to the implementation of DropDown.Focused(..), it only closes when control has focus
			// which it won't have if SelectAll is triggered using e.g. a ContextMenu, since the ContextMenu becomes
			// focused when clicked. So the inconsistency is also annoying. Furthermore automatically closing or
			// changing focus takes away control from the developer implementing the SelectAll behaviour.
			//me.Focused(false);

			// NOTICE: Selecting thousands of nodes using SelectAll may result in very poor performance
			// due to the large amount of DOM manipulation. Both the TreeView and DropDown goes through a full
			// state change for every single item being selected or deselected, so all events fire and reflows are
			// triggered for visible items.
			// To increase performance, temporarily hide TreeView and/or DropDown with display:none while SelectAll
			// is being performed. Switching to TextSelectionMode may also increase performance significantly.

			// Make sure TreeView is the active picker to have changes synchronized with
			// drop down control (in case SelectAll is triggered programmatically).
			if (me.GetPicker() !== tree)
				me.SetPicker(tree);
		});

		me.OnOpen(function()
		{
			if (suppressTreeOnOpen === true)
			{
				suppressTreeOnOpen = false;
				return;
			}

			me.SetPicker(tree);
			ensureTreeViewData();
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.WSDropDownTypeDefs" name="AutoUpdateSelectedCallback">
	/// 	<description> AutoUpdateSelected callback </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="updatedItems" type="Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem[]"> Updated items </param>
	/// </function>

	/// <function container="Fit.Controls.WSDropDown" name="AutoUpdateSelected" access="public">
	/// 	<description>
	/// 		Automatically update title of selected items based on data from WebService.
	/// 		Contrary to UpdateSelected(), AutoUpdateSelected() automatically loads all
	/// 		data from the associated WebService before updating the selected items, but
	/// 		only if one or more items are selected.
	/// 		The callback function is invoked when selected items have been updated.
	/// 		The following arguments are passed to function:
	/// 		 - Sender (WSDropDown)
	/// 		 - An array of updated items, each with a Title (string), Value (string), and Exists (boolean) property.
	/// 		Notice that items that no longer exists in picker's data, will NOT automatically be removed.
	/// 		To obtain all items with the most current state (both updated and unmodified selections), use;
	/// 		dropdown.AutoUpdateSelected(function(sender, updated) { console.log(&quot;All selected&quot;, dropdown.GetSelections()); });
	/// 		For additiona details see UpdateSelected().
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSDropDownTypeDefs.AutoUpdateSelectedCallback" default="undefined">
	/// 		Optional callback function invoked when selected items have been updated
	/// 	</param>
	/// </function>
	this.AutoUpdateSelected = function(cb)
	{
		Fit.Validation.ExpectFunction(cb, true);

		if (me.GetSelections().length === 0) // Do not request data if no selections are made to be updated
		{
			if (Fit.Validation.IsSet(cb) === true)
			{
				cb(me, []);
			}

			return;
		}

		if (requestCount > 0)
		{
			// Data is currently loading - postpone by adding request to process queue
			onDataLoaded(function() { me.AutoUpdateSelected(cb); });
			return;
		}

		if (autoUpdatedSelections !== null)
		{
			if (Fit.Validation.IsSet(cb) === true)
			{
				cb(me, Fit.Core.Clone(autoUpdatedSelections)); // Clone to prevent changes to internal array and its data
			}

			return;
		}

		dataLoading = true;

		var ensure = function()
		{
			tree.EnsureData(function(sender)
			{
				// Ensure all nodes in case only a subset is returned
				// when requesting root nodes via tree.Reload(..)

				// Picker must be set when calling UpdateSelected() on
				// DropDown from which WSDropDown inherits. Selected items
				// are updated based on data loaded by the picker control.
				me.SetPicker(tree);

				autoUpdatedSelections = me.UpdateSelected();

				dataLoading = false;

				if (Fit.Validation.IsSet(cb) === true)
				{
					cb(me, Fit.Core.Clone(autoUpdatedSelections)); // Clone to prevent changes to internal array and its data
				}

				fireOnDataLoaded();
			});
		}

		if (dataRequested === false)
		{
			// Notice that dataRequested may have been set to False in ClearData(..), which is why
			// we first call Reload to fetch initial data, since it also discards any existing nodes.

			tree.Reload(true, function(sender)
			{
				ensure(); // Get remaining nodes in case WebService did not return the entire hierarchy at once (Progressive Mode)
			});
		}
		else
		{
			// Some data has already been loaded - make sure we get the rest
			ensure();
		}
	}

	/// <function container="Fit.Controls.WSDropDown" name="Url" access="public" returns="string">
	/// 	<description>
	/// 		Get/set URL to WebService responsible for providing data to drop down.
	/// 		WebService must deliver data in the following JSON format:
	/// 		[
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 1", Value: "1001", Selectable: true, Selected: true, Children: [] },
	/// 			&#160;&#160;&#160;&#160; { Title: "Test 2", Value: "1002", Selectable: false, Selected: false, Children: [] }
	/// 		]
	/// 		Only Value is required. Children is a collection of nodes with the same format as described above.
	/// 		HasChildren:boolean may be set to indicate that children are available server side and that WebService
	/// 		should be called to load these children when the given node is expanded.
	/// 	</description>
	/// 	<param name="wsUrl" type="string" default="undefined"> If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetData) </param>
	/// </function>
	this.Url = function(wsUrl)
	{
		Fit.Validation.ExpectString(wsUrl, true);

		if (Fit.Validation.IsSet(wsUrl) === true)
		{
			list.Url(wsUrl);
			tree.Url(wsUrl);
		}

		return list.Url();
	}

	/// <function container="Fit.Controls.WSDropDown" name="JsonpCallback" access="public" returns="string | null">
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
			list.JsonpCallback(val);
			tree.JsonpCallback(val);
		}

		return list.JsonpCallback();
	}

	/// <function container="Fit.Controls.WSDropDownTypeDefs" name="ClearDataCallback">
	/// 	<description> Event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// </function>

	/// <function container="Fit.Controls.WSDropDown" name="ClearData" access="public">
	/// 	<description>
	/// 		Call this function to make control reload data when needed,
	/// 		ensuring that the user will see the most recent values available.
	/// 		Operation may be postponed if data is currently loading from WebService.
	/// 		Use callback to pick up execution once data has been cleared.
	/// 		Sender (Fit.Controls.WSDropDown) is passed to callback as an argument.
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSDropDownTypeDefs.ClearDataCallback" default="undefined">
	/// 		If defined, callback is invoked when data is cleared
	/// 	</param>
	/// </function>
	this.ClearData = function(cb)
	{
		Fit.Validation.ExpectFunction(cb, true);

		// Postpone if WebService operation is currently running

		if (requestCount > 0)
		{
			// Data is currently loading - postpone by adding request to process queue
			onDataLoaded(function() { me.ClearData(cb); });
			return;
		}

		// Clear data/cache/state

		hideLinesForFlatData = true;	// Make TreeView hide helper lines if nodes received have no children
		dataRequested = false;			// Make data in TreeView reload via ensureTreeViewData() when DropDown is opened
		autoUpdatedSelections = null;	// Remove cached result from AutoUpdateSelected(..) used when multiple calls to the function is made

		// Cancel pending search operation if scheduled

		cancelSearch();

		// Invoke callback

		if (Fit.Validation.IsSet(cb) === true)
		{
			cb(me);
		}

		// Immediately load TreeView data if DropDown is open and TreeView is active picker

		if (me.IsDropDownOpen() === true && me.GetPicker() === tree)
		{
			ensureTreeViewData(); // Will not load anything if callback above triggered data load, e.g. by calling AutoUpdateSelected(..)
		}
	}

	/// <function container="Fit.Controls.WSDropDown" name="MultiSelectionMode" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control allows for multiple selections simultaneously </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables support for multiple selections, False disables it </param>
	/// </function>
	this.MultiSelectionMode = Fit.Core.CreateOverride(this.MultiSelectionMode, function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			tree.Selectable(true, val);
		}

		return base(val);
	});


	/// <function container="Fit.Controls.WSDropDown" name="GetListView" access="public" returns="Fit.Controls.WSListView">
	/// 	<description> Get WSListView control used to display data in a flat list view </description>
	/// </function>
	this.GetListView = function()
	{
		return list;
	}

	/// <function container="Fit.Controls.WSDropDown" name="GetTreeView" access="public" returns="Fit.Controls.WSTreeView">
	/// 	<description> Get WSTreeView control used to display data in a hierarchical tree view </description>
	/// </function>
	this.GetTreeView = function()
	{
		return tree;
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		me.SetPicker(null);

		list.Destroy();
		tree.Destroy();

		cancelSearch();

		me = list = tree = search = forceNewSearch = hideLinesForFlatData = dataRequested = dataLoading = requestCount = onDataLoadedCallback = suppressTreeOnOpen = timeOut = currentRequest = classes = autoUpdatedSelections = onRequestHandlers = onResponseHandlers = null;

		base();
	});

	// ============================================
	// Events
	// ============================================

	/// <container name="Fit.Controls.WSDropDownTypeDefs.RequestEventArgs">
	/// 	<description> Request event arguments </description>
	/// 	<member name="Sender" type="$TypeOfThis"> Instance of control </member>
	/// 	<member name="Picker" type="Fit.Controls.WSTreeView | Fit.Controls.WSListView"> Instance of picker control causing web service request </member>
	/// 	<member name="Node" type="Fit.Controls.TreeViewNode | null"> Instance of TreeViewNode for which chilren are being requested, Null if root nodes are being requested, or if WSListView triggered request </member>
	/// 	<member name="Search" type="string"> Search value if entered by user </member>
	/// 	<member name="Request" type="Fit.Http.JsonpRequest | Fit.Http.JsonRequest"> Instance of JsonpRequest or JsonRequest </member>
	/// </container>

	/// <container name="Fit.Controls.WSDropDownTypeDefs.ResponseEventArgs" extends="Fit.Controls.WSDropDownTypeDefs.RequestEventArgs">
	/// 	<description> Response event arguments </description>
	/// 	<member name="Data" type="Fit.Controls.WSListViewTypeDefs.JsonItem[] | Fit.Controls.WSTreeViewTypeDefs.JsonItem[]"> JSON data received from web service </member>
	/// </container>

	/// <container name="Fit.Controls.WSDropDownTypeDefs.AbortedRequestEventArgs" extends="Fit.Controls.WSDropDownTypeDefs.RequestEventArgs">
	/// 	<description> Aborted request event arguments </description>
	/// 	<member name="Data" type="null"> JSON data received from web service </member>
	/// </container>

	/// <function container="Fit.Controls.WSDropDownTypeDefs" name="CancelableRequestEventHandler">
	/// 	<description> Cancelable request event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="eventArgs" type="Fit.Controls.WSDropDownTypeDefs.RequestEventArgs"> Event arguments </param>
	/// </function>

	/// <function container="Fit.Controls.WSDropDownTypeDefs" name="ResponseEventHandler">
	/// 	<description> Response event handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="eventArgs" type="Fit.Controls.WSDropDownTypeDefs.ResponseEventArgs"> Event arguments </param>
	/// </function>

	/// <function container="Fit.Controls.WSDropDownTypeDefs" name="RequestAbortedEventHandler">
	/// 	<description> Aborted request handler </description>
	/// 	<param name="sender" type="$TypeOfThis"> Instance of control </param>
	/// 	<param name="eventArgs" type="Fit.Controls.WSDropDownTypeDefs.AbortedRequestEventArgs"> Event arguments </param>
	/// </function>

	/// <function container="Fit.Controls.WSDropDown" name="OnRequest" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is being requested.
	/// 		Request can be canceled by returning False.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSDropDown) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSDropDown instance
	/// 		 - Picker: Picker causing WebService data request (WSTreeView or WSListView instance)
	/// 		 - Node: Fit.Controls.TreeViewNode instance if requesting TreeView children, Null if requesting root nodes
	/// 		 - Search: Search value if entered by user
	/// 		 - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSDropDownTypeDefs.CancelableRequestEventHandler"> Event handler function </param>
	/// </function>
	this.OnRequest = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onRequestHandlers, cb);
	}

	/// <function container="Fit.Controls.WSDropDown" name="OnResponse" access="public">
	/// 	<description>
	/// 		Add event handler fired when data is received,
	/// 		allowing for data transformation to occure before
	/// 		picker control is populated. Function receives two arguments:
	/// 		Sender (Fit.Controls.WSDropDown) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSDropDown instance
	/// 		 - Picker: Picker causing WebService data request (WSTreeView or WSListView instance)
	/// 		 - Node: Fit.Controls.TreeViewNode instance if requesting TreeView children, Null if requesting root nodes
	/// 		 - Search: Search value if entered by user
	/// 		 - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
	/// 		 - Data: JSON data received from WebService
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSDropDownTypeDefs.ResponseEventHandler"> Event handler function </param>
	/// </function>
	this.OnResponse = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onResponseHandlers, cb);
	}

	/// <function container="Fit.Controls.WSDropDown" name="OnAbort" access="public">
	/// 	<description>
	/// 		Add event handler fired if data request is canceled.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.WSDropDown) and EventArgs object.
	/// 		EventArgs object contains the following properties:
	/// 		 - Sender: Fit.Controls.WSDropDown instance
	/// 		 - Picker: Picker causing WebService data request (WSTreeView or WSListView instance)
	/// 		 - Node: Fit.Controls.TreeViewNode instance if requesting TreeView children, Null if requesting root nodes
	/// 		 - Search: Search value if entered by user
	/// 		 - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
	/// 		 - Data: JSON data received from WebService (Null in this particular case)
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSDropDownTypeDefs.RequestAbortedEventHandler"> Event handler function </param>
	/// </function>
	this.OnAbort = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onAbortHandlers, cb);
	}

	/*this.OnPopulated = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onPopulatedHandlers, cb);
	}*/

	// ============================================
	// Private
	// ============================================

	function ensureTreeViewData(/*cb*/)
	{
		//Fit.Validation.ExpectFunction(cb, true);

		if (dataRequested === false)
		{
			dataLoading = true;

			tree.Reload(true, function(sender)
			{
				dataLoading = false;

				/*if (Fit.Validation.IsSet(cb) === true)
				{
					cb(me);
				}*/

				fireOnDataLoaded();
			});
		}
	}

	function searchData(value)
	{
		// Abort timer responsible for starting search request X milliseconds after user stops typing

		cancelSearch();

		// Schedule new search request if a WebService request is already in progress

		if (currentRequest !== null)
		{
			forceNewSearch = true;
			return;
		}

		// Schedule search to run X milliseconds after user stops typing

		// Search value is passed to WSDropDown event handler using EventArgs object. External code
		// is responsible for exposing it to the backend, which in turn must return matching items.
		search = value;

		if (search !== "")
		{
			list.RemoveItems(); // Remove data from previous search
			me.SetPicker(list);

			timeOut = setTimeout(function()
			{
				if (me.IsDropDownOpen() === false)
				{
					suppressTreeOnOpen = true; // Drop Down changes picker to TreeView when OnOpen fires - prevent this from happening
					me.OpenDropDown();
				}

				list.Reload();

				timeOut = null;
			}, 500);
		}
	}

	function cancelSearch()
	{
		if (timeOut !== null)
		{
			clearTimeout(timeOut);
			timeOut = null;
		}
	}

	function onDataLoaded(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onDataLoadedCallback, cb);
	}

	function fireOnDataLoaded()
	{
		// Copied from WSTreeView.
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

	function fireEventHandlers(handlers, picker, eventArgs)
	{
		var cancel = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			var data = null; // Remains Null for OnAbort event (no Children or Items provided)
			var searchValue = Fit.Core.InstanceOf(picker, Fit.Controls.WSListView) === true ? search : "";

			if (eventArgs.Children) // WSTreeView
			{
				data = eventArgs.Children;
			}
			else if (eventArgs.Items) // WSListView
			{
				data = eventArgs.Items;
			}

			var newArgs = { Sender: me, Picker: picker, Node: (eventArgs.Node ? eventArgs.Node : null), SelectAll: eventArgs.SelectAll, Search: searchValue, Data: data, Request: eventArgs.Request };

			if (cb(me, newArgs) === false)
				cancel = true; // Do not cancel loop though - all handlers must be fired!

			// Assign data back to eventArgs, in case a new array instance was created
			if (eventArgs.Children) // WSTreeView
				eventArgs.Children = newArgs.Data;
			else if (eventArgs.Items) // WSListView
				eventArgs.Items = newArgs.Data;

			if (newArgs.Request !== eventArgs.Request)
			{
				// Support for changing request instans to
				// take control over webservice communication.

				// Restrict to support for Fit.Http.Request or classes derived from this
				Fit.Validation.ExpectInstance(newArgs.Request, Fit.Http.Request);

				eventArgs.Request = newArgs.Request;
			}
		});

		return !cancel;
	}

	init();
}
