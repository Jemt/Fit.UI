Fit._internal.Controls.Editor.LinkDialog = function(locale)
{
	var me = this;
	var linkCollection = {};
	var openDialogDestructor = null;
	var onOpenHandlers = [];
	var onCloseHandlers = [];
	var isMobile = Fit.Device.OptimizeForTouch;

	/// <container name="Fit._internal.Controls.Editor.LinkDialogLinkList">
	/// </container>

	/// <container name="Fit._internal.Controls.Editor.LinkDialogLinkListLink">
	/// 	<member name="Url" type="string"> Link URL </member>
	/// 	<member name="Title" type="string"> Link title </member>
	/// 	<member name="Description" type="string | null"> Link description </member>
	/// </container>

	/// <member container="Fit._internal.Controls.Editor.LinkDialog" name="LinkList" type="Fit._internal.Controls.Editor.LinkDialogLinkList">
	/// 	Links shown in dropdown control
	/// </member>
	this.LinkList =
	{
		/// <function container="Fit._internal.Controls.Editor.LinkDialogLinkList" name="Add" access="public">
		/// 	<description> Add link </description>
		/// 	<param name="url" type="string"> Link URL </param>
		/// 	<param name="title" type="string"> Link title </param>
		/// 	<param name="description" type="string" default="undefined"> Link description </param>
		/// </function>
		Add: function(url, title, description)
		{
			Fit.Validation.ExpectStringValue(url);
			Fit.Validation.ExpectStringValue(title);
			Fit.Validation.ExpectStringValue(description, true);

			linkCollection[url] = { Url: url, Title: title, Description: Fit.Validation.IsSet(description) ? description : null };
		},

		/// <function container="Fit._internal.Controls.Editor.LinkDialogLinkList" name="Remove" access="public">
		/// 	<description> Remove link by URL </description>
		/// 	<param name="url" type="string"> URL for link to remove </param>
		/// </function>
		Remove: function(url)
		{
			Fit.Validation.ExpectString(url);
			delete linkCollection[url];
		},

		/// <function container="Fit._internal.Controls.Editor.LinkDialogLinkList" name="Get" access="public" returns="Fit._internal.Controls.Editor.LinkDialogLinkListLink | null">
		/// 	<description> Get link by URL </description>
		/// 	<param name="url" type="string"> URL for link to retrieve </param>
		/// </function>
		Get: function(url)
		{
			Fit.Validation.ExpectString(url);
			return linkCollection[url] || null;
		},

		/// <function container="Fit._internal.Controls.Editor.LinkDialogLinkList" name="GetAll" access="public" returns="Fit._internal.Controls.Editor.LinkDialogLinkListLink[]">
		/// 	<description> Get all links </description>
		/// </function>
		GetAll: function()
		{
			var returnItems = [];

			Fit.Array.ForEach(linkCollection, function(key)
			{
				Fit.Array.Add(returnItems, Fit.Core.Clone(linkCollection[key]));
			});

			return returnItems;
		},

		/// <function container="Fit._internal.Controls.Editor.LinkDialogLinkList" name="Clear" access="public">
		/// 	<description> Remove all links </description>
		/// </function>
		Clear: function()
		{
			linkCollection = {};
		}
	}

	this.Open = function(selectedValue, newWindow, cb)
	{
		Fit.Validation.ExpectString(selectedValue);
		Fit.Validation.ExpectBoolean(newWindow);
		Fit.Validation.ExpectFunction(cb);

		// Declare dialog content template

		var tpl = new Fit.Template();
		tpl.AllowUnsafeContent(false);
		tpl.LoadHtml(
			'<!-- LIST Controls -->' +
			'<div>{[Label]}</div>' +
			'<div>{[Control]}</div><br>' +
			'<!-- /LIST Controls -->'
		);

		// Create dialog controls

		var txtUrl = new Fit.Controls.Input();
		var lstLinks = Fit.Array.Count(linkCollection) > 0 && new Fit.Controls.DropDown() || null;

		// Create URL field

		txtUrl.Width(100, "%");
		txtUrl.Value(selectedValue);
		txtUrl.OnChange(function(sender)
		{
			// Select matching link in dropdown

			if (lstLinks !== null && txtUrl.Focused() === true) // Input value changed by user if control has focus - otherwise changed when a link is selected from dropdown
			{
				var link = linkCollection[txtUrl.Value()] || null;

				if (link !== null)
				{
					lstLinks.AddSelection(link.Title, link.Url);
				}
				else
				{
					lstLinks.Clear();
				}
			}
		});

		var item = tpl.Content.Controls.AddItem();
		item.Label = locale.LinkDialogUrl;
		item.Control = txtUrl;

		// Create dropdown control

		if (lstLinks !== null)
		{
			var lv = new Fit.Controls.ListView();
			Fit.Array.ForEach(linkCollection, function(key)
			{
				var link = linkCollection[key];
				lv.AddItem({ Value: link.Url, Title: link.Title, Description: link.Description });
			});

			lstLinks.SetPicker(lv);
			lstLinks.MultiSelectionMode(false);
			lstLinks.TextSelectionMode(true);
			lstLinks.Width(100, "%");
			lstLinks.DropDownMaxHeight(250);
			lstLinks.DetectBoundaries(true);
			lstLinks.OnChange(function(sender)
			{
				var selections = lstLinks.GetSelections();

				if (selections.length === 1)
				{
					txtUrl.Value(selections[0].Value);
				}
			});

			item = tpl.Content.Controls.AddItem();
			item.Label = locale.LinkDialogLinkList;
			item.Control = lstLinks;
		}

		var item = linkCollection[selectedValue] || null;
		if (item !== null)
		{
			lstLinks.AddSelection(item.Title, item.Url);
		}

		// Create checkbox control

		var chk = new Fit.Controls.CheckBox();
		chk.Label(locale.LinkDialogNewWindow);
		chk.Checked(newWindow);

		item = tpl.Content.Controls.AddItem();
		item.Control = chk;

		// Create destructor function

		var dia = new Fit.Controls.Dialog();

		openDialogDestructor = function()
		{
			tpl.Dispose();
			dia.Dispose();

			openDialogDestructor = null;

			Fit.Array.ForEach(onCloseHandlers, function(cb)
			{
				cb(me);
			});
		};

		// Create dialog buttons

		var cmdOk = new Fit.Controls.Button();
		var cmdCancel = new Fit.Controls.Button();

		cmdOk.Title(locale.LinkDialogButtonOk);
		cmdOk.Type(Fit.Controls.ButtonType.Success);
		cmdOk.OnClick(function()
		{
			var url = txtUrl.Value();
			var newWin = chk.Checked();

			cb({ Url: url, NewWindow: newWin });

			openDialogDestructor();
		});

		cmdCancel.Title(locale.LinkDialogButtonCancel);
		cmdCancel.Type(Fit.Controls.ButtonType.Danger);
		cmdCancel.OnClick(function()
		{
			cb(null);
			openDialogDestructor();
		});

		Fit.Events.AddHandler(txtUrl.GetDomElement(), "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			if (ev.keyCode === 13) // ENTER
			{
				Fit.Events.PreventDefault(ev); // Prevent insertion of link break in editor when dialog closes
				cmdOk.Click();
			}
			else if (ev.keyCode === 27) // ESC
			{
				cmdCancel.Click();
			}
		});

		// Render dialog

		tpl.Render(dia.GetContentDomElement());

		dia.GetContentDomElement().style.overflow = "visible"; // Allow DropDown to exceed boundaries

		dia.Modal(true);
		dia.Width(450);
		dia.MaximumWidth(90, "%");
		dia.AddButton(cmdOk);
		dia.AddButton(cmdCancel);
		dia.Open();

		// Fire OnOpen event.
		// Event MUST be executed before focus is changed further down
		// to allow editor to set focus lock so it doesn't fire OnBlur.

		Fit.Array.ForEach(onOpenHandlers, function(cb)
		{
			cb(me);
		});

		// Set initial focus

		if (isMobile === true) // Make sure visual keyboard is closed on a tablet
		{
			cmdOk.Focused(true);
		}
		else
		{
			txtUrl.Focused(true);
		}
	}

	this.Close = function()
	{
		if (openDialogDestructor !== null)
		{
			openDialogDestructor();
		}
	}

	this.IsOpen = function()
	{
		return openDialogDestructor !== null;
	}

	this.OnOpen = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		onOpenHandlers.push(cb);
	}

	this.OnClose = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		onCloseHandlers.push(cb);
	}

	this.Dispose = function()
	{
		if (openDialogDestructor !== null)
		{
			openDialogDestructor();
		}

		me = linkCollection = openDialogDestructor = onOpenHandlers = onCloseHandlers = isMobile = null;
	}
}
