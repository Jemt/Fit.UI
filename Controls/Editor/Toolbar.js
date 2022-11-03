Fit._internal.Controls.Editor.Toolbar = function(locale, editable, selection, linkDialog, fireOnChange)
{
	var me = this;
	var toolbar = null;
	var supported = selection.IsSupported();
	var buttons =
	{
		Bold: defineFormatButton("bold", "B", "bold", locale.ButtonBold),
		Italic: defineFormatButton("italic", "I", "italic", locale.ButtonItalic),
		Underline:
		{
			TagType: "U",
			Icon: "underline",
			Label: locale.ButtonUnderline,
			Command: "underline",
			IsVisible: function(nodeOfButtonType, selectionArgs)
			{
				return selectionArgs.HasHeading === false; // Never show format button for headings as they might produce e.g. <span style="font-style:normal">selected text</span> to invert heading styles such as font-style:italic which we don't want
			}
		},
		Heading1: defineHeadingButton(1),
		Heading2: defineHeadingButton(2),
		Heading3: defineHeadingButton(3),
		Link:
		{
			TagType: "A",
			Icon: "link",
			Label: locale.ButtonLink,
			Command: "createLink",
			IsActive: function(nodeOfButtonType, selectionArgs) // We can't use document.queryCommandState("createLink") to determine button state like we can for e.g. document.queryCommandState("bold")
			{
				return nodeOfButtonType !== null;
			},
			IsVisible: function(nodeOfButtonType, selectionArgs)
			{
				return (nodeOfButtonType !== null || selectionArgs.HasHeading === false) && selectionArgs.HasInvalidListSelection === false;
			},
			Callback: function(nodeOfButtonType)
			{
				// Open link dialog

				var selectionSnapshot = selection.GetSnapshot();
				var linkUrl = nodeOfButtonType !== null && nodeOfButtonType.getAttribute("href") || "http://";
				var newWindow = nodeOfButtonType !== null && nodeOfButtonType.getAttribute("target") === "_blank";

				linkDialog.Open(linkUrl, newWindow, function(res)
				{
					// Restore selection when dialog is closed.
					// Dialog temporarily holds selection when controls in dialog gains focus.

					selectionSnapshot.Restore();

					if (res === null) // Dialog was canceled
					{
						return;
					}

					fixSelectionInFirefoxAfterChange("a", nodeOfButtonType !== null, function(fixSingleSelectionInFirefox, fixMultipleSelectionsInFirefox)
					{
						if (nodeOfButtonType !== null) // Update entire link node when updating URL for a link - otherwise the existing link is separated into multiple link elements
						{
							selection.SelectNodeContents(nodeOfButtonType);
						}

						var url = res.Url;
						var target = res.NewWindow === true ? "_blank" : null;

						document.execCommand("createLink", false, url);

						if (nodeOfButtonType !== null && Fit.Dom.Attribute(nodeOfButtonType, "target") !== target) // Existing node with existing target attribute which needs to be updated
						{
							var linkNode = selection.GetNodeOfTypeFromSelection("A"); // nodeOfButtonType was replaced when document.execCommand("createLink", false, url) was invoked - get updated node
							Fit.Dom.Attribute(linkNode, "target", target);
						}
						else if (nodeOfButtonType === null && target !== null) // New node created with target=_blank enabled
						{
							fixSingleSelectionInFirefox(); // Firefox: Immediately fix selection in Firefox - otherwise selection.GetNodeOfTypeFromSelection("A") below won't work

							var linkNode = selection.GetNodeOfTypeFromSelection("A"); // Get new node just created
							Fit.Dom.Attribute(linkNode, "target", target);
						}

						fireOnChange();
					});
				});
			}
		},
		Unlink:
		{
			TagType: "A",
			Icon: "unlink",
			Label: locale.ButtonUnlink,
			Command: "unlink",
			EntireNode: true,
			IsActive: function(nodeOfButtonType, selectionArgs)
			{
				return false;
			},
			IsVisible: function(nodeOfButtonType, selectionArgs)
			{
				return nodeOfButtonType !== null && selectionArgs.HasInvalidListSelection === false;
			}
		},
		UnorderedList:
		{
			TagType: "LI",
			Icon: "list-ul",
			Label: locale.ButtonList,
			Command: "insertUnorderedList",
			IsVisible: function(nodeOfButtonType, selectionArgs)
			{
				return (nodeOfButtonType !== null || selectionArgs.HasHeading === false) && selectionArgs.HasInvalidListSelection === false;
			}
		},
		Indent:
		{
			TagType: "LI",
			Icon: "indent",
			Label: locale.ButtonListIndent,
			Command: "indent",
			IsVisible: function(nodeOfButtonType, selectionArgs)
			{
				return nodeOfButtonType !== null && selectionArgs.HasInvalidListSelection === false;
			}
		},
		Outdent:
		{
			TagType: "LI",
			Icon: "outdent",
			Label: locale.ButtonListOutdent,
			Command: "outdent",
			IsVisible: function(nodeOfButtonType, selectionArgs)
			{
				return nodeOfButtonType !== null && selectionArgs.HasInvalidListSelection === false;
			}
		},
		RemoveFormatting:
		{
			Icon: "eraser",
			Label: locale.ButtonRemoveFormatting,
			Command: "removeFormat",
			IsActive: function(nodeOfButtonType, selectionArgs)
			{
				return false;
			},
			IsVisible: function(nodeOfButtonType, selectionArgs) // Show button if Bold/Italic/Underline is found within H1/H2/H3
			{
				// Variables become True if either format is contained in selection (selection may start or end outside of each element type)
				var b = selection.GetNodeOfTypeFromSelection("B") !== null || selection.GetNodeOfTypeFromSelection("B", true) !== null || selection.SelectionContainsNodeOfType("b") === true;
				var i = selection.GetNodeOfTypeFromSelection("I") !== null || selection.GetNodeOfTypeFromSelection("I", true) !== null || selection.SelectionContainsNodeOfType("i") === true;
				var u = selection.GetNodeOfTypeFromSelection("U") !== null || selection.GetNodeOfTypeFromSelection("U", true) !== null || selection.SelectionContainsNodeOfType("u") === true;

				// One of the variables become True if the entire selection starts and ends within a heading element
				var isAllH1 = selection.GetNodeOfTypeFromSelection("H1") !== null && selection.GetNodeOfTypeFromSelection("H1", true) !== null;
				var isAllH2 = selection.GetNodeOfTypeFromSelection("H2") !== null && selection.GetNodeOfTypeFromSelection("H2", true) !== null;
				var isAllH3 = selection.GetNodeOfTypeFromSelection("H3") !== null && selection.GetNodeOfTypeFromSelection("H3", true) !== null;

				return ((b || i || u) && (isAllH1 || isAllH2 || isAllH3));
			}
		}
	}

	function init()
	{
		toolbar = document.createElement("div");
		toolbar.className = "FitUiControlEditorToolbar";
		toolbar.style.display = "none";

		// Create button elements

		Fit.Array.ForEach(buttons, function(name) // E.g. Bold
		{
			var button = buttons[name];

			button.DomElement = createToolbarButton(button.Icon, button.Label, function() // Callback triggered when button is activated
			{
				// Select entire node if element is of the same type as produced by the button

				var nodeOfButtonType = button.TagType && (selection.GetNodeOfTypeFromSelection(button.TagType) || selection.GetNodeOfTypeFromSelection(button.TagType, true)) || null;

				if (nodeOfButtonType !== null && button.EntireNode)
				{
					selection.SelectNodeContents(nodeOfButtonType);
				}

				// Select word if caret is placed within

				selection.SelectWordIfCaretWithin();

				// Execute button logic

				if (button.Callback)
				{
					button.Callback(nodeOfButtonType);
				}
				else
				{
					document.execCommand(button.Command);
				}

				// Fire OnChange

				fireOnChange();

				// Update toolbar

				if (selection.HasSelection() === false)
				{
					me.Hide(); // Hide toolbar when a style is applied without a selection (usually an empty line) - a selection is required for toolbar buttons to be able to update their activated state
				}
				else if (selection.IsSelectionWithinEditor() === true) // If button opens a dialog and assigns focus to it, then selection is removed and toolbar is hidden
				{
					updateToolbarButtons();
				}
			});

			if (button.ClassName)
			{
				button.DomElement.className += " " + button.ClassName;
			}

			Fit.Dom.Add(toolbar, button.DomElement);
		});
	}

	// ============================================
	// Public
	// ============================================

	this.GetDomElement = function()
	{
		return toolbar;
	}

	this.Dispose = function()
	{
		Fit.Dom.Remove(toolbar);
		me = toolbar = supported = buttons = null;
	}

	// ============================================
	// Private
	// ============================================

	function defineFormatButton(command, tagType, icon, label)
	{
		var button =
		{
			TagType: tagType,
			Icon: icon,
			Label: label,
			Command: command,
			IsVisible: function(nodeOfButtonType, selectionArgs)
			{
				return selectionArgs.HasHeading === false; // Never show format button for headings as they might produce e.g. <span style="font-weight:normal">selected text</span> to invert heading styles such as font-weight:bold which we don't want
			}
		};

		return button;
	}

	function defineHeadingButton(size)
	{
		var button =
		{
			TagType: "H" + size,
			Icon: "header",
			ClassName: "FitUiControlEditorToolbarButtonHeader-h" + size,
			Label: locale["ButtonHeading" + size],
			Command: "formatBlock",
			EntireNode: true,
			IsActive: function(nodeOfButtonType, selectionArgs)
			{
				return nodeOfButtonType !== null;
			},
			IsVisible: function(nodeOfButtonType, selectionArgs)
			{
				return (selectionArgs.HasHeading === true || size === 1) && isInvalidHeadingSelection() === false && selectionArgs.HasInvalidListSelection === false;
			},
			Callback: function(nodeOfButtonType)
			{
				// Remove list formatting when applying header styles.
				// Unfortunately this might create one snapshop in the undo history for every
				// indentation level, but it's better than manipulating the DOM which will
				// break native undo/redo.
				var failSafeCount = 0;
				while (selection.SelectionContainsNodeOfType("li") === true)
				{
					failSafeCount++;
					if (failSafeCount === 20) return; // Firefox bug: document.execCommand("outdent") below doesn't work in Firefox if list item contains a linebreak (<br> produced using SHIFT+ENTER) in the end (https://bugzilla.mozilla.org/show_bug.cgi?id=1797844#c3)
					document.execCommand("outdent");
				}

				var isFirefox = Fit.Browser.GetBrowser() === "Firefox";
				var IsIE = Fit.Browser.GetBrowser() === "MSIE";
				var tagName = "h" + size;

				if (nodeOfButtonType !== null && isFirefox === true) // Firefox won't let us remove heading style using document.execCommand(..) - manipulate DOM instead
				{
					var newNode = Fit.Dom.CreateElement("<div>" + nodeOfButtonType.innerHTML + "</div>");
					Fit.Dom.Replace(nodeOfButtonType, newNode); // Undo (CTRL+Z) will not work for this
					selection.SelectNodeContents(newNode);
				}
				else
				{
					fixSelectionInFirefoxAfterChange(tagName, nodeOfButtonType !== null, function(fixSingleSelectionInFirefox, fixMultipleSelectionsInFirefox)
					{
						document.execCommand("formatBlock", false, nodeOfButtonType === null ? (IsIE ? "<" + tagName + ">" : tagName) : (IsIE ? "<div>" : "div"));

						if (nodeOfButtonType === null) // Heading created
						{
							fixMultipleSelectionsInFirefox(function() // Firefox might produce multiple heading elements if multiple paragraph divs are selected - callback invoked for each of them
							{
								// Make sure entire heading element is selected.
								// It will only get selected by fixMultipleSelectionsInFirefox(..) if
								// this is actually Firefox running, and only if a new element was
								// created, not if we manipulate an existing one partially selected.
								// In Firefox it will make no difference since a newly created element is
								// already selected (thanks to fixMultipleSelectionsInFirefox), and therefore
								// just gets selected once again, which is fine.
								var heading = selection.GetNodeOfTypeFromSelection("H" + size);
								selection.SelectNodeContents(heading);

								// Remove any existing formatting: bold/italic/underline.
								// The user can undo this (CTRL+Z). If this happens, the toolbar will allow the user to remove
								// individual styles using the eraser button, since we do not show the formatting buttons for headers.
								document.execCommand("removeFormat");

								// Remove any links contained.
								// The user can undo this (CTRL+Z). If this happens, the toolbar
								// will allow the user to remove links using the unlink button.
								document.execCommand("unlink"); // Firefox is unable to remove links in some situations due to a bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1797844
							});
						}
					});
				}
			}
		}

		return button;
	}

	// This function will fix a broken selection for newly created elements.
	// For instance applying document.execCommand("createLink", false, url)
	// to a text node will in most browsers result in selection automatically
	// being updated to the text node inside the newly created link element.
	// But in Firefox the selection is placed on the text node in front of the
	// newly created link element instead, resulting in the toolbar not updating
	// to highlight the link button and display the unlink button.
	// So if nodeOfButtonTypeAlreadySelected is false, then we need to find the
	// newly created element and select the text inside of it.
	// https://bugzilla.mozilla.org/show_bug.cgi?id=1797920
	function fixSelectionInFirefoxAfterChange(tagName, nodeOfButtonTypeAlreadySelected, cb)
	{
		if (nodeOfButtonTypeAlreadySelected === true || Fit.Browser.GetBrowser() !== "Firefox")
		{
			cb(function() {}, function(cb) { cb(); });
		}
		else
		{
			var tagsBefore = editable.querySelectorAll(tagName);
			var selectionFixed = false;

			var fixSingleSelection = function() // Fix selection for the first newly created element found
			{
				var tagsAfter = editable.querySelectorAll(tagName);

				Fit.Array.ForEach(tagsAfter, function(tag)
				{
					if (Fit.Array.Contains(tagsBefore, tag) === false)
					{
						selection.SelectNodeContents(tag);
						return false; // Break loop
					}
				});

				selectionFixed = true;
			};

			var fixMultipleSelections = function(cb) // Fix selections for all newly created elements found
			{
				var tagsAfter = editable.querySelectorAll(tagName);

				Fit.Array.ForEach(tagsAfter, function(tag)
				{
					if (Fit.Array.Contains(tagsBefore, tag) === false)
					{
						selection.SelectNodeContents(tag);
						cb();
					}
				});

				selectionFixed = true;
			};

			// Execute callback responsible for manipulating the content of the editor
			// after which the selection will be fixed automatically in Firefox. The
			// callback can also manually invoke the fix functions if additional manipulation
			// needs to be done once the selection(s) has/have been fixed.
			cb(fixSingleSelection, fixMultipleSelections);

			if (selectionFixed === false) // Only auto fix selection if the callback did not invoke one of the fix functions manually
			{
				fixSingleSelection();
			}
		}
	}

	function isInvalidListSelection()
	{
		var selectionContainsListItem = selection.SelectionContainsNodeOfType("li");

		if (selectionContainsListItem === false)
		{
			return false; // Selection does not contain any list items - selection is valid
		}

		var selectionListItemStart = selection.GetNodeOfTypeFromSelection("LI");
		var selectionListItemEnd = selection.GetNodeOfTypeFromSelection("LI", true);

		if ((selectionListItemStart !== null) !== (selectionListItemEnd !== null) || // Selection partially inside and outside of list
			(selectionListItemStart !== null && selectionListItemEnd !== null && selectionListItemStart.parentElement !== selectionListItemEnd.parentElement) || // Selection starts in one list and ends in another list
			(selectionListItemStart === null && selectionListItemEnd === null && selectionContainsListItem === true)) // Selection contains a list but selection does not start and end within it, so selection starts above and below the list
		{
			return true; // Yes, this is an invalid list selection
		}

		return false; // No, this is not an invalid list selection
	}

	function isInvalidHeadingSelection()
	{
		var selectionTagStart = selection.GetNodeOfTypeFromSelection("H1") || selection.GetNodeOfTypeFromSelection("H2") || selection.GetNodeOfTypeFromSelection("H3");
		var selectionTagEnd = selection.GetNodeOfTypeFromSelection("H1", true) || selection.GetNodeOfTypeFromSelection("H2", true) || selection.GetNodeOfTypeFromSelection("H3", true);

		if (/*(selectionTagStart !== null) !== (selectionTagEnd !== null) ||*/ // Selection partially inside and outside of heading
			(selectionTagStart !== null && selectionTagEnd !== null && selectionTagStart !== selectionTagEnd) /*|| // Selection starts in one heading and ends in another heading
			(selectionTagStart === null && selectionTagEnd === null && selectionContainsTag === true)*/) // Selection contains a heading but selection does not start and end within it, so selection starts above and below the heading
		{
			return true; // Yes, this is an invalid list selection
		}

		return false; // No, this is not an invalid header selection
	}

	function createToolbarButton(icon, label, callback)
	{
		var cmd = document.createElement("span")
		cmd.className = "FitUiControlEditorToolbarButton fa fa-" + icon;
		cmd.title = label;
		cmd.onmousedown = function(e)
		{
			Fit.Events.PreventDefault(e); // Preserve focus in editor
			callback();
		};
		cmd.ontouchstart = cmd.onmousedown;

		return cmd;
	}

	function updateToolbarButtons()
	{
		Fit.Array.ForEach(buttons, function(name) // E.g. Bold
		{
			var button = buttons[name];

			// Reset button state
			button.DomElement.style.display = "";
			button.DomElement.style.backgroundColor = "";
			button.DomElement.style.opacity = 1;
			button.DomElement.onmousedown = button.DomElement.onmousedown || button.DomElement._onmousedown;
			button.DomElement.ontouchstart = button.DomElement.ontouchstart || button.DomElement._ontouchstart;
			delete button.DomElement._onmousedown;
			delete button.DomElement._ontouchstart;

			// Get node from selection if of same type as produced by button
			var nodeOfButtonTypeStart = button.TagType && selection.GetNodeOfTypeFromSelection(button.TagType) || null;
			var nodeOfButtonTypeEnd = button.TagType && selection.GetNodeOfTypeFromSelection(button.TagType, true) || null;
			var nodeOfButtonType = nodeOfButtonTypeStart || nodeOfButtonTypeEnd;

			var hasH1 = selection.GetNodeOfTypeFromSelection("H1") !== null || selection.GetNodeOfTypeFromSelection("H1", true) !== null || selection.SelectionContainsNodeOfType("H1");
			var hasH2 = selection.GetNodeOfTypeFromSelection("H2") !== null || selection.GetNodeOfTypeFromSelection("H2", true) !== null || selection.SelectionContainsNodeOfType("H2");
			var hasH3 = selection.GetNodeOfTypeFromSelection("H3") !== null || selection.GetNodeOfTypeFromSelection("H3", true) !== null || selection.SelectionContainsNodeOfType("H3");

			var selectionArgs =
			{
				HasNodeOfButtonType: nodeOfButtonType !== null,
				HasHeading: hasH1 || hasH2 || hasH3,
				HasInvalidListSelection: isInvalidListSelection()
			};

			// Set button's activated state
			if (button.IsActive)
			{
				Fit.Dom.Data(button.DomElement, "activated", button.IsActive(nodeOfButtonType, selectionArgs) === true ? "true" : null);
			}
			else
			{
				Fit.Dom.Data(button.DomElement, "activated", document.queryCommandState(button.Command) === true ? "true" : null);
			}

			// Hide button if necessary
			if (button.IsVisible && button.IsVisible(nodeOfButtonType, selectionArgs) === false)
			{
				button.DomElement.style.display = "none";
			}

			// Disable button if necessary
			if (button.Enabled && button.Enabled(nodeOfButtonType, selectionArgs) === false)
			{
				button.DomElement.style.opacity = 0.40;

				button.DomElement._onmousedown = button.DomElement.onmousedown;
				button.DomElement._ontouchstart = button.DomElement.ontouchstart;
				button.DomElement.onmousedown = null;
				button.DomElement.ontouchstart = null;
			}
		});
	}

	// https://stackoverflow.com/questions/71916923/open-safari-context-menu-below-text-selection
	this.Show = function()
	{
		if (supported === false)
		{
			return;
		}

		// Update toolbar buttons

		updateToolbarButtons();

		// Reset position

		toolbar.style.left = "";
		toolbar.style.top = "";
		toolbar.style.display = "";

		// Position above selected text (position:absolute - relative to editor control)

		var container = editable.offsetParent; // Parent to which toolbar is relatively positioned (control container which has position:relative)
		var containerDistanceFromViewPortTop = container.offsetTop - document.documentElement.scrollTop;
		var containerDistanceFromViewPortLeft = container.offsetLeft - document.documentElement.scrollLeft;

		var rect = selection.GetPosition(); // Selection's position in viewport
		rect.Top = rect.Top - containerDistanceFromViewPortTop;
		rect.Left = rect.Left - containerDistanceFromViewPortLeft;

		var rectTop = rect.Top;
		var rectCenter = rect.Left + (rect.Width / 2);

		// Position above selected text (position:relative - relative to viewport)

		// DISABLED: Used with position:relative which doesn't work on iOS
		/*var rect = selection.GetPosition(); // Selection's position in viewport
		var rectTop = rect.Top;
		var rectCenter = rect.Left + (rect.Width / 2);*/

		// Set toolbar position

		toolbar.style.left = Math.floor(rectCenter - (toolbar.offsetWidth / 2)) + "px";
		toolbar.style.top = Math.floor(rectTop - toolbar.offsetHeight) + "px";

		// Adjust position if toolbar is outside viewport (position:absolute - relative to editor control)

		var toolbarViewPortPosition = Fit.Dom.GetBoundingPosition(toolbar);

		if (toolbarViewPortPosition.Y < 0) // Push down if above viewport top
		{
			toolbar.style.top = (parseInt(toolbar.style.top) + Math.ceil(Math.abs(toolbarViewPortPosition.Y))) + "px";
		}
		if (toolbarViewPortPosition.X < 0) // Push right if outside of viewport's left side
		{
			toolbar.style.left = (parseInt(toolbar.style.left) + Math.ceil(Math.abs(toolbarViewPortPosition.X))) + "px";
		}
		if (toolbarViewPortPosition.X + toolbar.offsetWidth > Fit.Browser.GetViewPortDimensions().Width) // Push left if outside of viewport's right side
		{
			var exceeds = toolbarViewPortPosition.X + toolbar.offsetWidth - Fit.Browser.GetViewPortDimensions().Width;
			toolbar.style.left = Math.floor(parseInt(toolbar.style.left) - exceeds) + "px";
		}

		// Adjust position if toolbar is outside viewport (position:relative - relative to viewport)

		// DISABLED: Used with position:relative which doesn't work on iOS
		/*if (parseInt(toolbar.style.top) < 0)
		{
			toolbar.style.top = "0px";
		}
		if (parseInt(toolbar.style.left) < 0)
		{
			toolbar.style.left = "0px";
		}
		if (parseInt(toolbar.style.left) + toolbar.offsetWidth > Fit.Browser.GetViewPortDimensions().Width)
		{
			var exceeds = (parseInt(toolbar.style.left) + toolbar.offsetWidth) - Fit.Browser.GetViewPortDimensions().Width;
			toolbar.style.left = Math.floor(parseInt(toolbar.style.left) - exceeds) + "px";
		}*/
	}

	this.Hide = function()
	{
		if (supported === false)
		{
			return;
		}

		toolbar.style.display = "none";
	}

	init();
}
