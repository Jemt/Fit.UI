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
	var dataLoading = false;
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

			currentRequest = eventArgs.Request;
			cmdOpen.className = "fa fa-refresh fa-spin";
		});
		list.OnResponse(function(sender, eventArgs)
		{
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

		var initialLoad = true;
		var dataRequested = false;
		var requestCount = 0;

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
			}
		});
		tree.OnAbort(function(sender, eventArgs)
		{
			requestCount--;
			
			fireEventHandlers(onAbortHandlers, tree, eventArgs);
			
			if (requestCount === 0)
			{
				cmdOpen.className = classes;
			}
		});
		tree.OnPopulated(function(sender, eventArgs)
		{
			if (initialLoad === true)
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

				initialLoad = false;
			}
		});
		tree.OnSelectAll(function(sender, eventArgs)
		{
			// Make sure focus is lost when SelectAll is invoked. Otherwise control will
			// reassign focus every time an item is added which is very expensive performance wise.
			me.Focused(false);

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

			if (dataRequested === false)
			{
				dataLoading = true;

				var selected = tree.Selected(); // Save selection which is cleared when Reload() is called
				tree.Reload(function(sender)
				{
					dataLoading = false;
					fireOnDataLoaded();
				});
				tree.Selected(selected); // Restore selection
			}
		});
	}

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.WSDropDown" name="AutoUpdateSelected" access="public">
	/// 	<description>
	/// 		Automatically update title of selected items based on data from WebService.
	/// 		Contrary to UpdateSelected(), AutoUpdateSelected() automatically loads all
	/// 		data from the associated WebService before updating the selected items.
	/// 		The callback function is invoked when selected items have been updated.
	/// 		The following arguments are passed to function:
	/// 		 - Sender (WSDropDown)
	/// 		 - An array of updated items, each with a Title (string), Value (string), and Exists (boolean) property.
	/// 		Notice that items that no longer exists in picker's data, will NOT automatically be removed.
	/// 		To obtain all items with the most current state (both updated and unmodified selections), use;
	/// 		dropdown.AutoUpdateSelected(function(sender, updated) { console.log("All selected", dropdown.GetSelections); });
	/// 		For additiona details see UpdateSelected().
	/// 	</description>
	/// 	<param name="cb" type="function" default="undefined">
	/// 		Optional callback function invoked when selected items have been updated
	/// 	</param>
	/// </function>
	this.AutoUpdateSelected = function(cb)
	{
		Fit.Validation.ExpectFunction(cb, true);

		if (dataLoading === true && autoUpdatedSelections === null)
		{
			// Data is currently loading - postpone by adding request to process queue
			onDataLoaded(function() { me.AutoUpdateSelected(cb); });
			return;
		}

		if (autoUpdatedSelections !== null)
		{
			if (Fit.Validation.IsSet(cb) === true)
			{
				cb(me, autoUpdatedSelections);
			}

			return;
		}

		dataLoading = true;

		tree.EnsureData(function(sender)
		{
			// Picker must be set when calling UpdateSelected() on
			// DropDown from which WSDropDown inherits. Selected items
			// are updated based on data loaded by the picker control.
			me.SetPicker(tree);

			autoUpdatedSelections = me.UpdateSelected();

			dataLoading = false;

			if (Fit.Validation.IsSet(cb) === true)
			{
				cb(me, autoUpdatedSelections);
			}

			fireOnDataLoaded();
		});
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

	/// <function container="Fit.Controls.WSDropDown" name="JsonpCallback" access="public" returns="string">
	/// 	<description>
	/// 		Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication.
	/// 		Often this argument is simply &quot;callback&quot;. Passing Null disables JSONP communication again.
	/// 	</description>
	/// 	<param name="val" type="string" default="undefined"> If defined, enables JSONP and updates JSONP callback argument </param>
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

		me = list = tree = search = forceNewSearch = dataLoading = onDataLoadedCallback = suppressTreeOnOpen = timeOut = currentRequest = classes = autoUpdatedSelections = onRequestHandlers = onResponseHandlers = null;

		base();
	});

	// ============================================
	// Events
	// ============================================

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
	/// 		 - Search: Search value if entered
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
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
	/// 		 - Search: Search value if entered
	/// 		 - Data: JSON data received from WebService
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
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
	/// 		 - Search: Search value if entered
	/// 		 - Data: JSON data received from WebService (Null in this particular case)
	/// 		 - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
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

	function searchData(value)
	{
		// Abort time responsible for starting search request X milliseconds after user stops typing

		if (timeOut !== null)
		{
			clearTimeout(timeOut);
			timeOut = null;
		}

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

			if (eventArgs.Children) // WSTreeView
				data = eventArgs.Children;
			else if (eventArgs.Items) // WSListView
				data = eventArgs.Items;

			var newArgs = { Sender: me, Picker: picker, Node: (eventArgs.Node ? eventArgs.Node : null), SelectAll: eventArgs.SelectAll, Search: search, Data: data, Request: eventArgs.Request };

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
