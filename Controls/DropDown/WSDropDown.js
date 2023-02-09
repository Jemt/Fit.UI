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
	var actionMenu = null;

	var search = "";
	var forceNewSearch = false;
	var hideLinesForFlatData = true;
	var dataRequested = false;		// Flag indicating whether TreeView data has been requested or not - determines whether a call to ensureTreeViewData() actually loads data or not
	var dataLoading = false;		// Flag indicating whether TreeView data is currently being loaded by WSDropDown internals (awaiting response) - will not be True when user expand nodes to load children, or when invoking e.g. dd.GetTreeView.Reload()
	//var nodesPopulated = false;	// Flag indicating whether TreeView root nodes have been populated - contrary to dataLoading this flag is set when a potentially partial portion of the data has been loaded
	var requestCount = 0;			// Counter to keep track of nodes for which data is currently being loaded, no matter how it was being loaded (via WSDropDown internals, programmatically on WSTreeView from external code, or by user expanding nodes)
	var onDataLoadedCallback = [];
	var suppressTreeOnOpen = false;
	var timeOut = null;
	var currentRequest = null;
	var classes = null;
	var autoUpdatedSelections = null; // Cached result from AutoUpdateSelected: [{ Title:string, Value:string, Exists:boolean }, ...]
	var useActionMenu = false;
	var useActionMenuForced = false;
	var useActionMenuAfterLoad = true;
	var treeViewEnabled = true;
	var orgPlaceholder = this.Placeholder;
	var customPlaceholderSet = false;
	var translations = null;

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

		list = new Fit.Controls.WSListView(me.GetId() + "__WSListView");
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

		tree = new Fit.Controls.WSTreeView(me.GetId() + "__WSTreeView");
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
			//nodesPopulated = true;

			// Helper lines

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

		// Make sure synchronization events are wired immedately. These events ensure that changes to selected
		// items, done through the picker controls programmatically, are synchronized back to the DropDown control.
		me.SetPicker(list);
		me.SetPicker(tree);
		me.SetPicker(null); // Make sure no picker remains rooted as some controls (WSTreeView) loads data when rooted (using synthetic #rooted event)

		// Keep both pickers up to date when selections are changed. Otherwise only
		// the active picker receives changes immediately. WSTreeView.Reload(keepState = true)
		// is dependant upon selection state being up to date.
		// Imagine a scenario where WSTreeView.Reload(true) is called every time a selection
		// is changed in the DropDown control. If an item is removed while the WSListView picker
		// is active, WSTreeView will reload via OnChange, but since WSTreeView.Reload(..) is called
		// with keepState=true, it will restore the selection we just removed while WSListView was active.
		// The code below resolves this by ensuring all pickers are always current on selection state.

		var updateItemSelectionTree = tree.UpdateItemSelection;
		var updateItemSelectionList = list.UpdateItemSelection;

		var updateItemSelectionOverride = function(value, selected, programmaticallyChanged)
		{
			updateItemSelectionTree(value, selected, programmaticallyChanged);
			updateItemSelectionList(value, selected, programmaticallyChanged);
		};

		// UpdateItemSelection(..) is called by host control to update the picker's selections
		tree.UpdateItemSelection = updateItemSelectionOverride;
		list.UpdateItemSelection = updateItemSelectionOverride;

		// Create action menu

		var skipUpdateActionMenuOnChange = false;

		actionMenu = new Fit.Controls.ListView(me.GetId() + "__ActionsListView");
		actionMenu.OnSelect(function(sender, item) // Using OnSelect instead of OnItemSelectionChanging since DropDown fires OnItemSelectionChanging when selection is changed, which would result in OnItemSelectionChanging being executed multiple times
		{
			if (item.Value === "SearchMore")
			{
				me._internal.ClearInputForSearch();
			}
			else if (item.Value === "ShowAll")
			{
				me._internal.UndoClearInputForSearch(); // In case user first picked SearchMore, entered a search value, changed their mind, and then selected ShowAll

				useActionMenuAfterLoad = false;

				me.SetPicker(tree);
				ensureTreeViewData();
			}
			else if (item.Value === "RemoveAll")
			{
				skipUpdateActionMenuOnChange = true;
				me.ClearSelections(); // Fires OnChange
				skipUpdateActionMenuOnChange = false;

				updateActionMenu(); // Update action menu (remove all "Remove: xyz" options)
			}
			else if (item.Value.indexOf("Remove:") === 0)
			{
				var dataValue = item.Value.replace("Remove:", "");

				// Find item below if using keyboard to remove item

				var above = null;
				var below = null;

				if (Fit.Browser.GetInfo().IsMobile === false && Fit.Events.GetPointerState().Buttons.Primary === false) // Do not find and highlight item below on touch devices, or if using the mouse
				{
					var items = actionMenu.GetItems();
					var stopNext = false;

					for (var i = 0 ; i < items.length ; i++)
					{
						if (items[i].Value.indexOf("Remove:") !== 0)
						{
							continue; // Skip items that do not remove individual selections
						}

						if (items[i].Value.replace("Remove:", "") === dataValue)
						{
							stopNext = true;
							continue;
						}

						if (stopNext === false)
						{
							above = items[i].Value;
						}
						else
						{
							below = items[i].Value;
							break;
						}
					}
				}

				// Remove item

				skipUpdateActionMenuOnChange = true;
				me.RemoveSelection(dataValue); // Fires OnChange
				skipUpdateActionMenuOnChange = false;

				// Update list of removable items

				actionMenu.RemoveItem(item.Value);

				if (me.GetSelections().length === 1)
				{
					updateActionMenu(); // Update action menu to get rid of "Remove all" item when only one item is left
				}

				// Highlight item below (or above) the item that was just removed

				if (above !== null || below !== null)
				{
					actionMenu.RevealItemInView(below !== null ? below : above);
				}
			}

			return false; // Prevent selection of behavioural item
		});

		me.OnChange(function(sender)
		{
			if (skipUpdateActionMenuOnChange === false)
			{
				updateActionMenu();
			}
		});

		// Misc

		me.OnOpen(function()
		{
			if (suppressTreeOnOpen === true)
			{
				suppressTreeOnOpen = false;
				return;
			}

			// Do not show action menu if the only option available is ShowAll.
			// In this case the user will not be able to select SeachMore, and
			// there is no selected items that can be removed from the control.
			// In this case we ignore useActionMenu === true, even when useActionMenuForced is true.
			var onlyTheShowAllOptionIsDisplayedInActionMenu = actionMenu.GetItems().length === 1 && actionMenu.HasItem("ShowAll") === true;

			if (useActionMenu === true && onlyTheShowAllOptionIsDisplayedInActionMenu === false)
			{
				me.SetPicker(actionMenu);
			}
			else
			{
				if (onlyTheShowAllOptionIsDisplayedInActionMenu === true)
				{
					useActionMenuAfterLoad = false;
				}

				if (treeViewEnabled === true)
				{
					me.SetPicker(tree);
					ensureTreeViewData();
				}
				else
				{
					list.RemoveItems(); // Do not show previous search results again
				}
			}
		});

		Fit.Internationalization.OnLocaleChanged(localize);
		localize();
	}

	// ============================================
	// Public
	// ============================================

	this.AddSelection = Fit.Core.CreateOverride(this.AddSelection, function(title, value, valid)
	{
		Fit.Validation.ExpectString(title);
		Fit.Validation.ExpectString(value);
		Fit.Validation.ExpectBoolean(valid, true);

		base(title, value, valid);

		// Keep TreeView up to date with selection state

		if (me.GetPicker() !== tree) // DropDown (from which WSDropDown inherits) automatically updates the picker's selection state, but it can only do so for the active picker of course - make sure TreeView's selection state is kept up to date
		{
			// Selection just added might originate from a call to WSDropDown.Value(..), so the node might not have been loaded yet,
			// which is why we can't expect it to be available via tree.GetChild(value, true). Therefore we use tree.SetNodeSelection(..) to
			// update selection state since this will add the selection regardless of the node existing or not (using preselections).

			tree.SetNodeSelection(value, true);
		}
	});

	this.RemoveSelection = Fit.Core.CreateOverride(this.RemoveSelection, function(value)
	{
		Fit.Validation.ExpectString(value);

		base(value);

		// Keep TreeView up to date with selection state

		if (me.GetPicker() !== tree) // DropDown (from which WSDropDown inherits) automatically updates the picker's selection state, but it can only do so for the active picker of course - make sure TreeView's selection state is kept up to date
		{
			// Selection just remove might originate from a call to WSDropDown.Value(..), so the node might not have been loaded yet,
			// which is why we can't expect it to be available via tree.GetChild(value, true). Therefore we use tree.SetNodeSelection(..) to
			// update selection state since this will remove the selection regardless of the node existing or not (using preselections).

			tree.SetNodeSelection(value, false);
		}
	});

	this.Value = Fit.Core.CreateOverride(this.Value, function(value)
	{
		Fit.Validation.ExpectString(value, true);

		var val = base(value);

		// Keep TreeView up to date with selection state

		if (Fit.Validation.IsSet(value) === true && me.GetPicker() !== tree) // DropDown (from which WSDropDown inherits) automatically updates the picker's selection state, but it can only do so for the active picker of course - make sure TreeView's selection state is kept up to date
		{
			// Nodes just set might not have been loaded yet, so we can't expect them to be available via tree.GetChild(nodeValue, true).
			// Therefore we use tree.SetSelections(..) to update selection state since this will set the selections regardless of the
			// nodes existing or not (using preselections).

			tree.SetSelections(me.GetSelections());
		}

		return val;
	});

	this.ClearSelections = Fit.Core.CreateOverride(this.ClearSelections, function()
	{
		base();

		// Keep TreeView up to date with selection state

		if (me.GetPicker() !== tree) // DropDown (from which WSDropDown inherits) automatically updates the picker's selection state, but it can only do so for the active picker of course - make sure TreeView's selection state is kept up to date
		{
			tree.Clear();
		}
	});

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
		//nodesPopulated = false;

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

				// Switch to action menu if no data was received. Must
				// be called after dataLoading is set since function
				// calls updateActionMenu(..) which relies on this flag.
				showActionMenuIfNoDataReceivedOrOnFirstInteractionIfEnabled();

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

	/// <function container="Fit.Controls.WSDropDownTypeDefs" name="DataCallback">
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
	/// 		To make sure data reloads immediate, please use ReloadData(..) instead.
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSDropDownTypeDefs.DataCallback" default="undefined">
	/// 		If defined, callback is invoked when data is cleared
	/// 	</param>
	/// </function>
	this.ClearData = function(cb)
	{
		clearData(true, true, cb);
	}

	/// <function container="Fit.Controls.WSDropDown" name="ReloadData" access="public">
	/// 	<description>
	/// 		Call this function to make control reload data immediately,
	/// 		ensuring that the user will see the most recent values available.
	/// 		Use callback to pick up execution once data has been loaded.
	/// 		Sender (Fit.Controls.WSDropDown) is passed to callback as an argument.
	/// 		To have data reload when needed (lazy loading), please use ClearData(..) instead.
	/// 	</description>
	/// 	<param name="cb" type="Fit.Controls.WSDropDownTypeDefs.DataCallback" default="undefined">
	/// 		If defined, callback is invoked when data has been loaded
	/// 	</param>
	/// </function>
	this.ReloadData = function(cb)
	{
		clearData(false, false, function() // false 1 = prevent clearData(..) from reloading data, false 2 = prevent action menu from updating to avoid flickering - done when data has been reloaded
		{
			ensureTreeViewData(function()
			{
				updateActionMenu();
				cb && cb(me);
			});
		});
	}

	this.MultiSelectionMode = Fit.Core.CreateOverride(this.MultiSelectionMode, function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			tree.Selectable(true, val);
		}

		return base(val);
	});

	this.InputEnabled = Fit.Core.CreateOverride(this.InputEnabled, function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && base() !== val)
		{
			base(val);
			localize(); // Add/remove placeholder depending on whether input is enabled or not - also calls updateActionMenu() which will make sure SearchMore action is added/removed depending on whether input is enabled or not

			if (val === false && me.GetPicker() === list)
			{
				me.SetPicker(null); // Which picker to use is decided in the OnOpen handler
			}
		}

		return base();
	});

	/// <function container="Fit.Controls.WSDropDown" name="TreeViewEnabled" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether TreeView control is enabled or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables TreeView (default), False disables it </param>
	/// </function>
	this.TreeViewEnabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && val !== treeViewEnabled)
		{
			treeViewEnabled = val;

			if (useActionMenuForced === false)
			{
				// Use action menu if there is no data to display, which makes it impossible to remove
				// selected items in TextSelectionMode - unless DropDown.SelectionModeToggle is enabled,
				// which lets the user switch to Visual Selection Mode with each item displaying a delete button.
				// But we want a consistent behaviour, so we use the action menu for both Text and Visual Selection Mode.

				if (val === true)
				{
					var isWaitingForData = dataRequested === false || dataLoading === true;
					useActionMenu = isWaitingForData === true || tree.GetChildren().length === 0;
				}
				else
				{
					useActionMenu = true; // User must search to retrieve available options
				}
			}

			if (val === false && me.GetPicker() === tree)
			{
				me.SetPicker(null); // Which picker to use is decided in the OnOpen handler
			}

			updateActionMenu(); // Update action menu to have ShowAll action added/removed depending on whether TreeView is enabled or not
		}

		return treeViewEnabled;
	}

	/// <function container="Fit.Controls.WSDropDown" name="ListViewEnabled" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set flag indicating whether searchable ListView is enabled or not.
	/// 		The value provided also determines the value for InputEnabled and vice versa.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables ListView and search capability (default), False disables it </param>
	/// </function>
	this.ListViewEnabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);
		return me.InputEnabled(val);
	}

	this.SearchModeOnFocus = Fit.Core.CreateOverride(this.SearchModeOnFocus, function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true && val !== base())
		{
			base(val);
			updateActionMenu(); // Add/remove search option depending on whether SearchModeOnFocus is enabled or not
		}

		return base();
	});

	this.Placeholder = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		customPlaceholderSet = true;
		return orgPlaceholder(val);
	}

	this.OpenDropDown = Fit.Core.CreateOverride(this.OpenDropDown, function()
	{
		if (me.InputEnabled() === true && me.GetInputValue() === "" && me.GetSelections().length === 0 && treeViewEnabled === false)
		{
			// Do not open DropDown - it will only contain "Search for more options"
			// when no items are currently selected and TreeView is disabled, and no
			// search value has been entered yet.
			// The control will display "Search.." (or a custom placeholder), making it
			// obvious what the user need to do to get data - no need to display the action menu.

			if (Fit.Browser.GetInfo().IsMobile === true)
			{
				// Focus input on mobile, even if DropDown was opened using
				// the arrow icon - this will bring up the virtual keyboard.
				me._internal.ForceFocusMobile();
			}

			return;
		}

		base();
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

	/// <function container="Fit.Controls.WSDropDown" name="UseActionMenu" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether control uses the built-in action menu to ease addition and removal of items.
	/// 		If this property is not explicitly set, it will automatically be changed by the control depending on data and other settings.
	/// 		The action menu will be enabled if TreeViewEnabled is set to False, as it would otherwise not show anything unless the user
	/// 		enters a search value. If TreeViewEnabled is True but no data is provided to the TreeView control upon request, the action menu
	/// 		is also enabled.
	/// 		If the control does not have any selections, InputEnabled (or its alias ListViewEnabled) is True, and TreeViewEnabled is False,
	/// 		no picker will be displayed since the action menu would only display the &quot;Search for options&quot; item - but it should already
	/// 		be obvious to the user that searching is required due to the placeholder displaying &quot;Search..&quot; by default.
	/// 		Likewise, if TreeViewEnabled is True and InputEnabled (or its alias ListViewEnabled) is False, and no selections are made,
	/// 		the action menu would only display &quot;Show available options&quot;. In this case the TreeView will be displayed instead,
	/// 		even if UseActionMenu has explicitely been set to True.
	/// 		The behaviour described is in place to make sure the action menu is only displayed when it makes sense, since it introduces
	/// 		and extra step (click) required by the user to access data.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables the action menu, False disables it </param>
	/// </function>
	this.UseActionMenu = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			useActionMenuForced = true;

			if (val !== useActionMenu)
			{
				useActionMenu = val;

				if (val === true)
				{
					updateActionMenu();

					if (me.IsDropDownOpen() === true)
					{
						me.SetPicker(actionMenu);
					}
				}
				else
				{
					if (me.GetPicker() === actionMenu)
					{
						me.SetPicker(tree.GetChildren().length > 0 ? tree : list);
					}
				}
			}
		}

		return useActionMenu;
	}

	/// <function container="Fit.Controls.WSDropDown" name="ResetActionMenu" access="public">
	/// 	<description>
	/// 		Reset action menu so it automatically determines whether to show up or not
	/// 		when DropDown control is opened/re-opened, based on rules outlined in the
	/// 		description for UseActionMenu(..).
	/// 		This is useful if calling ClearData(..) and one wants to make sure the TreeView
	/// 		data is immediately made visible once ready, rather than showing the action menu
	/// 		if it was previously shown.
	/// 	</description>
	/// </function>
	this.ResetActionMenu = function()
	{
		useActionMenuForced = false;
		useActionMenu = false;
		useActionMenuAfterLoad = true;
	}

	/// <function container="Fit.Controls.WSDropDown" name="UpdateActionMenu" access="public">
	/// 	<description>
	/// 		Update action menu to make it reflect availablity of data in TreeView
	/// 	</description>
	/// </function>
	this.UpdateActionMenu = function() // Comes in handy if TreeView data is reloaded/manipulated (accessible via GetTreeView()) which DropDown won't know about
	{
		updateActionMenu();
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		me.SetPicker(null);

		list.Destroy();
		tree.Destroy();
		actionMenu.Destroy();

		cancelSearch();

		Fit.Internationalization.RemoveOnLocaleChanged(localize);

		me = list = tree = actionMenu = search = forceNewSearch = hideLinesForFlatData = dataRequested = dataLoading /*= nodesPopulated*/ = requestCount = onDataLoadedCallback = suppressTreeOnOpen = timeOut = currentRequest = classes = autoUpdatedSelections = useActionMenu = useActionMenuForced = useActionMenuAfterLoad = treeViewEnabled = orgPlaceholder = customPlaceholderSet = translations = onRequestHandlers = onResponseHandlers = null;

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

	function ensureTreeViewData(cb)
	{
		Fit.Validation.ExpectFunction(cb, true);

		if (dataRequested === false)
		{
			dataLoading = true;
			//nodesPopulated = false;

			tree.Reload(true, function(sender)
			{
				dataLoading = false;

				// Switch to action menu if no data was received. Must
				// be called after dataLoading is set since function
				// calls updateActionMenu(..) which relies on this flag.
				showActionMenuIfNoDataReceivedOrOnFirstInteractionIfEnabled();

				if (Fit.Validation.IsSet(cb) === true)
				{
					cb(me);
				}

				fireOnDataLoaded();
			});
		}
	}

	function clearData(allowImmediateReload, refreshActionMenu, cb)
	{
		Fit.Validation.ExpectBoolean(allowImmediateReload);
		Fit.Validation.ExpectBoolean(refreshActionMenu);
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

		// Update action menu

		// Update action menu in case "Show available options" has been disabled, which
		// will be the case if the previous request returned no data. We need it enabled if
		// action menu is enabled - otherwise the user won't be able to request updated data.
		refreshActionMenu && updateActionMenu();

		// Cancel pending search operation if scheduled

		cancelSearch();

		// Invoke callback

		if (Fit.Validation.IsSet(cb) === true)
		{
			cb(me);
		}

		// Immediately load TreeView data if DropDown is open and TreeView is active picker

		if (allowImmediateReload === true && me.IsDropDownOpen() === true && me.GetPicker() === tree)
		{
			ensureTreeViewData(); // Will not load anything if callback above triggered data load, e.g. by calling AutoUpdateSelected(..)
		}
	}

	function showActionMenuIfNoDataReceivedOrOnFirstInteractionIfEnabled()
	{
		// If no data is returned and DropDown is in TextSelectionMode, the user will
		// not be able to remove objects from the DropDown, unless SelectionModeToggle
		// is true. Therefore we allow for items to be removed using an action menu.
		// EDIT: Now displays action menu in both Visual and Text Selection Mode for consistency.

		if (useActionMenuForced === false)
		{
			useActionMenu = tree.GetChildren().length === 0;
		}

		if (/*me.TextSelectionMode() === true &&*/ useActionMenu === true)
		{
			updateActionMenu();

			if (useActionMenuAfterLoad === true || tree.GetChildren().length === 0)
			{
				me.SetPicker(actionMenu);
			}
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

	function updateActionMenu()
	{
		// Do not update unless needed. Notice that useActionMenu can be changed while action menu is active
		// by calling ResetActionMenu(), e.g. during OnChange when removing an item using the action menu.
		// See https://github.com/Jemt/Fit.UI/issues/179
		if (useActionMenu === false && me.GetPicker() !== actionMenu)
		{
			return;
		}

		var searchIcon = "<span class='FitUiControlDropDownActionMenuItemIcon FitUiControlDropDownActionMenuItemIconSearch fa fa-search'></span> ";
		var showAllIcon = "<span class='FitUiControlDropDownActionMenuItemIcon FitUiControlDropDownActionMenuItemIconShowAll fa fa-sitemap'></span> ";
		var delIcon = "<span class='FitUiControlDropDownActionMenuItemIcon FitUiControlDropDownActionMenuItemIconDelete fa fa-times'></span> ";

		var selectedItems = me.GetSelections();
		var addRemoveAll = selectedItems.length > 1;

		actionMenu.RemoveItems();

		if (me.InputEnabled() === true && me.SearchModeOnFocus() === false)
		{
			actionMenu.AddItem(searchIcon + translations.SearchMore, "SearchMore");
		}

		if (treeViewEnabled === true)
		{
			var isWaitingForData = dataRequested === false || dataLoading === true;

			if (isWaitingForData === true || tree.GetChildren().length > 0)
			{
				actionMenu.AddItem(showAllIcon + translations.ShowAllOptions, "ShowAll");
			}
			else
			{
				actionMenu.AddItem(showAllIcon + "<i>" + translations.NoneAvailable + "</i>", "ShowAllNoneFound");
			}
		}

		if (addRemoveAll === true)
		{
			actionMenu.AddItem(delIcon + translations.RemoveAll, "RemoveAll");
		}

		Fit.Array.ForEach(selectedItems, function(item)
		{
			actionMenu.AddItem((addRemoveAll === true ? " &nbsp; &nbsp; &nbsp; " : "") + delIcon + translations.Remove + " " + item.Title, "Remove:" + item.Value);
		});
	}

	function localize()
	{
		var locale = Fit.Internationalization.GetLocale(me);
		translations = locale.Translations;

		updateActionMenu();

		if (customPlaceholderSet === false)
		{
			orgPlaceholder(me.InputEnabled() === true ? translations.Search : "");
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
