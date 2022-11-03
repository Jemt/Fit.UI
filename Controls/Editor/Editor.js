// Components used internally by editor
Fit._internal.Controls.Editor = {
	Filter: null,			// Overridden by Filter.js
	FilterOrigin: null,		// Overridden by Filter.js
	LinkDialog: null,		// Overrideen by LinkDialog.js
	Selection: null,		// Overridden by Selection.js
	SelectionType: null,	// Overridden by Selection.js
	Toolbar: null			// Overridden by Toolbar.js
};

/// <container name="Fit.Controls.Editor" extends="Fit.Controls.ControlBase">
/// 	Simple rich text editor control.
/// 	Extending from Fit.Controls.ControlBase.
/// </container>

/// <function container="Fit.Controls.Editor" name="Editor" access="public">
/// 	<description> Create instance of Editor control </description>
/// 	<param name="ctlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.Editor = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId, true);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	// Components
	var Filter = Fit._internal.Controls.Editor.Filter;
	var FilterOrigin = Fit._internal.Controls.Editor.FilterOrigin;
	var LinkDialog = Fit._internal.Controls.Editor.LinkDialog;
	var Selection = Fit._internal.Controls.Editor.Selection;
	var SelectionType = Fit._internal.Controls.Editor.SelectionType;
	var Toolbar = Fit._internal.Controls.Editor.Toolbar;

	// Configuration
	var showToolbarMode = SelectionType.Selection;
	var showToolbarOnClick = true; // Always show toolbar when placing cursor using mouse/touch

	// Members
	var me = this;
	var editable = null;
	var selection = null;
	var toolbar = null;
	var linkDialog = null;
	var filter = null;
	var locale = null;
	var prevVal = "";
	var orgVal = "";
	var valueCache = null;
	var placeholder = "";
	var onChangeInvocator = null;
	var globalKeyDownEventId = -1;
	var globalKeyUpEventId = -1;
	var globalScrollEventId = -1;
	var localScrollEventId = -1;

	// ============================================
	// Init
	// ============================================

	function init()
	{
		me.AddCssClass("FitUiControlEditor");

		// Create editor (editable div)

		editable = document.createElement("div");
		editable.tabIndex = 0;
		editable.contentEditable = "true"; // It's a string (https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/contentEditable)
		editable.spellcheck = false;
		editable.onkeydown = function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			// Clear value cache - except if keydown is triggered by a modifier key which will not change the value of the editor (e.g. CTRL+A to select all, followed by CTRL+C to copy everything).
			// Actually the user might be able to change the value of the editor by applying styles using e.g. CTRL/CMD + B/I/U (bold/Italic/Underline), but we prevent this further down.
			if (ev.keyCode !== 27 /*ESC*/ && ev.keyCode !== 16 /*SHIFT*/ && ev.keyCode !== 17 /*CTRL*/ && ev.keyCode !== 18 /*ALT*/ && ev.keyCode !== 91 /*META/WIN/CMD*/)
			{
				clearValueCache();
			}

			if (ev.keyCode === 27) // ESC
			{
				hideToolbar();
			}
			else if (ev.keyCode === 13) // ENTER
			{
				hideToolbar(); // Firefox does not always trigger OnSelectionChange when pressing ENTER, which would normally hide toolbar
			}
			else if (ev.keyCode === 8 || ev.keyCode === 46) // Backspace or Delete
			{
				if (Fit.Browser.GetInfo().Name === "MSIE" && (editable.innerHTML === "" || editable.innerHTML === "<br>"))
				{
					editable.innerHTML = "<div>&nbsp;</div>"; // This will force IE to produce line breaks when pressing ENTER rather than new paragraphs - use <p>&nbsp;</p> to force modern browsers to produce paragraphs instead - similar code found in Value(..)
				}
			}
			else if (((ev.metaKey || ev.ctrlKey) && ev.keyCode === 66 /* B (bold) */) || ((ev.metaKey || ev.ctrlKey) && ev.keyCode === 73 /* I (italic) */) || ((ev.metaKey || ev.ctrlKey) && ev.keyCode === 85 /* U (underline) */))
			{
				// Prevent user from applying bold/italic/underline using browser shortcuts as
				// this bypasses button logic which restricts formatting to certain types of content.
				// This is not bullet proof as the web browser or OS might provide other means to apply
				// styling, e.g. via context menus.
				Fit.Events.PreventDefault(ev);
			}
		}
		editable.onkeyup = function(e)
		{
			fireOnChange();
		}
		editable.oncut = function(e) // IE9+
		{
			clearValueCache();
			fireOnChange();
		}
		editable.onpaste = function(e) // IE9+
		{
			var ev = Fit.Events.GetEvent(e);

			if (ev.clipboardData && ev.clipboardData.files && ev.clipboardData.files.length > 0)
			{
				// Do not allow image files to be pasted as base64
				Fit.Events.PreventDefault(ev);
			}
			else if (ev.clipboardData && selection)
			{
				clearValueCache();

				// Do not allow browser to insert data from clipboard - it needs to be cleaned up first
				Fit.Events.PreventDefault(ev);

				if (selection.SelectionContainsNodeOfType("h1") === true || selection.SelectionContainsNodeOfType("h2") === true || selection.SelectionContainsNodeOfType("h3") === true)
				{
					// Remove formatting completely when pasting into headings, as it may produce odd markup.
					// Copying e.g. <u>good</u> results in clipboard API returning the following HTML representation:
					// "<meta charset='utf-8'><u style="box-sizing: border-box; color: rgb(51, 51, 51); font-family: verdana; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px;">good</u>"
					// Applying the filter (filter.CleanHtml(..)) turns it back into <u>good</u>, but once inserted into the heading it will become something like this: <h1>Hello my&nbsp;<u style="color: rgb(51, 51, 51); font-size: 14px;">good</u>&nbsp;friend</h1>
					// Therefore we only read the plain text value and insert it as text when the target is a heading.
					// Reading the clipboard data does not require special clipboard permissions when done during the OnPaste event.
					var clipboardContent = ev.clipboardData.getData("text/plain");
					document.execCommand("insertText", false, clipboardContent);
				}
				else
				{
					// Clean up clipboard data before inserting it into editor.
					// Some browsers (e.g. older versions of Safari) does not support text/html, so falling back to text/plain.
					// Reading the clipboard data does not require special clipboard permissions when done during the OnPaste event.

					var clipboardContent = ev.clipboardData.getData("text/html") || ev.clipboardData.getData("text/plain");

					// Do not allow insertion of heading elements into list elements - insert as plain text
					if (/<(h1|h2|h3)/.test(clipboardContent) === true && selection.SelectionContainsNodeOfType("li") === true)
					{
						document.execCommand("insertText", false, Fit.String.StripHtml(clipboardContent));
					}
					else
					{
						var cleanedHtml = filter.CleanHtml(clipboardContent, FilterOrigin.ExternalValueClipboard);
						document.execCommand("insertHTML", false, cleanedHtml); // According to specification this must be valid HTML which CleanHtml(..) ensures
					}
				}

				fireOnChange(); // In case user pasted using context menu - usually event fires from OnKeyUp handler
			}
			else // Legacy browsers not supporting the Clipboard or Selection API (e.g. IE8-IE11)
			{
				clearValueCache();

				// Perform cleanup after browser has inserted content and fire OnChange
				postpone(function() // Wait for content to be inserted
				{
					me.Value(me.Value()); // Unfortunately this will always place the text cursor at the end - that's just too bad
					fireOnChange(); // In case user pasted using context menu - usually event fires from OnKeyUp handler
				});
			}
		}
		editable.onfocus = function()
		{
			clearValueCache(); // Clear cache when focused - user might manipulate value using e.g. undo/redo through the browser's context menu which OnBlur will catch, but the value cache must be reset in order for OnChange to fire
		}
		editable.onblur = function()
		{
			if (me === null) // Make sure control has not been disposed while having focus
			{
				return;
			}

			// Fire OnChange in case user modified text using cut or paste - OnCut and OnPaste events are not supported by IE8.
			// But even on modern browsers we don't have events for Undo/Redo, so this also ensures that changes caused by using
			// the context menu to undo/redo is propagated - undo/redo using shortcuts will be handled by the OnKeyDown handler.
			fireOnChange(true);

			hideToolbar(); // In case focus is stolen from control while toolbar is shown
		}
		editable.onclick = function(e)
		{
			var ev = Fit.Events.GetEvent(e);

			// Open links if clicked while holding down CTRL/META/SHIFT
			if (ev.ctrlKey === true || ev.metaKey === true || ev.shiftKey === true)
			{
				var target = Fit.Events.GetTarget(ev);
				var link = target.tagName === "A" ? target : Fit.Dom.GetParentOfType(target, "a");

				if (link !== null)
				{
					window.open(link.href, ev.shiftKey && "_blank" || undefined);
					return;
				}
			}

			// Show toolbar on click
			if (showToolbarOnClick === true && me.Enabled() === true)
			{
				// Two bugs which might cause toolbar to not show when clicking editor:

				// 1) Postpone to make sure code below always run after code in OnSelectionChange handler.
				// When dragging a selection using the mouse, OnSelectionChange fires first (multiple times).
				// When mouse button is released, OnClick fires. When clicking different places in the editor,
				// OnSelectionChange also fires before OnClick. But if clicking within an existing selection
				// (in the highlighted text), then OnClick fires before OnSelectionChange. This results in
				// OnSelectionChange handler hiding toolbar, even though it is supposed to show up on click.

				// 2) Similarly there is a problem in Safari and Chrome which does not update selection and fire
				// the native OnSelectionChange event when removing elements in an editable div. Bug is reported here:
				// https://bugs.chromium.org/p/chromium/issues/detail?id=1380891
				// Imagine an editor holding this content: <h1>Hello world</h1><div>This is some nice text</div>
				// Selecting all the text and pressing Backspace will cause an empty <h1> to remain selected.
				// Pressing backspace again will remove the empty <h1> element but due to the browser bug the native
				// OnSelectionChange event will not fire and therefore our selection API will think the current selection is <h1>.
				// When the user clicks the editable div it opens the toolbar which in turn results in a call
				// to selection.GetPosition() which due to another browser bugs introduces a temporary node into
				// the editor which is used to obtain the position of the text cursor. This results in OnSelectionChange
				// firing since our selection API now realises that the selection has in fact changed, and closing the toolbar
				// if showToolbarMode is SelectionType.Selection.
				// If only the browser had fired the native OnSelectionChange event when the <h1> element was removed,
				// then our selection API would have known that the content editable div was now the currently selection,
				// and our guard against invocation of selection.OnSelectionChange, as a result of calling selection.GetPosition(),
				// would have worked and prevented this problem.
				// If this is hard to understand, then place a breakpoint inside toolbar.Hide() and observe the call stack.
				postpone(function()
				{
					showToolbar();
				}, 100);

				return;
			}
		}
		editable.ondblclick = function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			var target = Fit.Events.GetTarget(ev);

			if (selection !== null && target !== editable && target.tagName !== "DIV" && target.tagName !== "LI")
			{
				// Select entire element when double clicking on e.g. a link, a bold tag or similar - this also resolves this Firefox issue:
				// https://bugzilla.mozilla.org/show_bug.cgi?id=1769320 (getSelection() returns wrong anchorNode & focusNode when double clicking an element)
				selection.SelectNodeContents(target);
			}
		}
		me._internal.AddDomElement(editable);

		// Create OnChange handler
		onChangeInvocator = getOnChangeInvocator(-1);

		// Make it obvious that a link will be opened when hovered, if CTRL/META/SHIFT is being held down at the same time
		makeLinksHighlightWithCommandButtonDown();

		// Add support for a placeholder text
		configurePlaceholderFeature();

		// Configure language support
		Fit.Internationalization.OnLocaleChanged(localize);
		localize();

		// Create and configure components used by editor
		createEditorFilterInstance();	// HTML filter (cleanup)
		createSelectionInstance();		// Text selection API
		createLinkDialogInstance([]);	// Link dialog
		createToolbarInstance();		// Floating toolbar

		// Ensure data-attributes
		me.Enabled(true);
		me.Styleless(false);

		// Editable div has no height if empty, so we need
		// to focus it when container element is clicked.
		Fit.Events.AddHandler(me.GetDomElement(), "click", function(e)
		{
			if (me.Enabled() === true)
			{
				editable.focus();
			}
		});

		// Hide toolbar when scrolling
		var scrollHandler = function(e) { hideToolbar(); };
		globalScrollEventId = Fit.Events.AddHandler(document, "scroll", { Passive: true }, scrollHandler);
		localScrollEventId = Fit.Events.AddHandler(editable, "scroll", { Passive: true }, scrollHandler);

		if (Fit.Browser.GetInfo().Name === "MSIE")
		{
			editable.innerHTML = "<div>&nbsp;</div>"; // This will force IE to produce line breaks when pressing ENTER rather than new paragraphs - use <p>&nbsp;</p> to force modern browsers to produce paragraphs instead
		}
	}

	// ============================================
	// Public - overrides
	// ============================================

	// See documentation on ControlBase
	this.Enabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === false)
			{
				hideToolbar(); // Hide toolbar in case editor is being disabled while editing (e.g. after a certain amount of time - could be an exam/test)
			}

			me._internal.Data("enabled", val.toString());
			editable.contentEditable = val.toString(); // It's a string (https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/contentEditable)
		}

		return editable.isContentEditable;
	}

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true)
		{
			if (focus === true)
			{
				editable.focus();
			}
			else
			{
				editable.blur();
			}
		}

		return (Fit.Dom.GetFocused() === editable || linkDialog.IsOpen() === true);
	}

	// See documentation on ControlBase
	this.Value = function(val, preserveDirtyState)
	{
		Fit.Validation.ExpectString(val, true);
		Fit.Validation.ExpectBoolean(preserveDirtyState, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			clearValueCache();

			// Wrap content in divs in Internet Explorer to make it produce line breaks instead of paragraphs
			if (Fit.Browser.GetInfo().Name === "MSIE")
			{
				if (val === "")
				{
					val = "<div>&nbsp;</div>"; // This will force IE to produce line breaks when pressing ENTER rather than new paragraphs - use <p>&nbsp;</p> to force modern browsers to produce paragraphs instead - similar code found in OnKeyDown handler
				}
				else
				{
					val = "<div>" + val + "</div>"; // Might produce nested divs, but CleanHtml(..) will flatten these
				}
			}

			var cleanedHtml = filter.CleanHtml(val, FilterOrigin.ExternalValue);
			var changed = orgVal !== cleanedHtml;

			if (preserveDirtyState !== true)
			{
				orgVal = cleanedHtml;
			}

			editable.innerHTML = cleanedHtml;
			prevVal = cleanedHtml;

			if (me.Focused() === false) // Do not show placeholder if cleared while focused (e.g. cleared using OnFocus event)
			{
				updatePlaceholder();
			}

			if (changed === true)
			{
				me._internal.FireOnChange();
			}
		}

		// Value() might be called several times (By OnChange, IsDirty, IsValid, externally, etc.),
		// but CleanHtml(..) can be very expensive for very large text blobs, so we cache the result.
		// But even with caching we might experience lag in the editor since OnChange fires on
		// every single character change. Consider using DebounceOnChange(..) to improve responsiveness.
		if (valueCache === null)
		{
			valueCache = filter.CleanHtml(editable.innerHTML, FilterOrigin.InternalValue);
		}

		return valueCache;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		return (orgVal !== me.Value());
	}

	// See documentation on ControlBase
	this.Clear = function()
	{
		me.Value("");
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		selection && selection.Dispose();
		toolbar && toolbar.Dispose();
		linkDialog.Dispose();

		onChangeInvocator.Cancel();
		Fit.Internationalization.RemoveOnLocaleChanged(localize);
		Fit.Events.RemoveHandler(document, globalKeyDownEventId);
		Fit.Events.RemoveHandler(document, globalKeyUpEventId);
		Fit.Events.RemoveHandler(document, globalScrollEventId);
		Fit.Events.RemoveHandler(editable, localScrollEventId);

		showToolbarMode = showToolbarOnClick = me = editable = selection = toolbar = linkDialog = filter = locale = prevVal = orgVal = valueCache = placeholder = onChangeInvocator = globalKeyDownEventId = globalKeyUpEventId = globalScrollEventId = localScrollEventId = null;
		base();
	});

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.Editor" name="SpellCheck" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value which determines whether the browser's built-in spell checker is enabled for the editor or not.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables spell checking, False disables it (default) </param>
	/// </function>
	this.SpellCheck = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			editable.spellcheck = val;
		}

		return editable.spellcheck === true;
	}

	/// <function container="Fit.Controls.Editor" name="Styleless" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value which determines whether editor is rendered with styles (especially borders and padding).
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables styleless state (no styles), False disables it (default) </param>
	/// </function>
	this.Styleless = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			me._internal.Data("styleless", val.toString());
		}

		return me._internal.Data("styleless") === "true";
	}

	/// <function container="Fit.Controls.Editor" name="Placeholder" access="public" returns="string">
	/// 	<description> Get/set placeholder text shown when editor is empty </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, value is set as placeholder </param>
	/// </function>
	this.Placeholder = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			placeholder = val;
			updatePlaceholder();
		}

		return placeholder;
	}

	/// <function container="Fit.Controls.Editor" name="DebounceOnChange" access="public" returns="integer">
	/// 	<description>
	/// 		Get/set number of milliseconds used to postpone OnChange event.
	/// 		Every new keystroke/change resets the timer. Debouncing can
	/// 		improve performance when working with large amounts of data.
	/// 	</description>
	/// 	<param name="timeout" type="integer" default="undefined">
	/// 		If defined, timeout value (milliseconds) is updated - a value of -1 disables debouncing
	/// 	</param>
	/// </function>
	this.DebounceOnChange = function(timeout)
	{
		Fit.Validation.ExpectInteger(timeout, true);

		if (Fit.Validation.IsSet(timeout) === true)
		{
			onChangeInvocator.Flush();
			onChangeInvocator = getOnChangeInvocator(timeout);
		}

		return onChangeInvocator.Timeout;
	}

	/// <member container="Fit.Controls.Editor" name="LinkList" type="Fit._internal.Controls.Editor.LinkDialogLinkList">
	/// 	Links shown in link dialog
	/// </member>
	this.LinkList =
	{
		Add: function(url, title, description)
		{
			linkDialog.LinkList.Add(url, title, description);
		},

		Remove: function(link)
		{
			linkDialog.LinkList.Remove(link);
		},

		Get: function(url)
		{
			return linkDialog.LinkList.Get(url);
		},

		Clear: function()
		{
			linkDialog.LinkList.Clear();
		}
	}

	// ============================================
	// Private
	// ============================================

	function createSelectionInstance()
	{
		selection = new Selection(editable, showToolbarMode);

		if (selection.IsSupported() === false)
		{
			selection.Dispose();
			selection = null;
			return;
		}

		selection.OnSelection(function(sender)
		{
			if (me.Enabled() === true)
			{
				if (selection.IsSelectionWithinEditor() === true)
				{
					showToolbar();
				}
				else
				{
					hideToolbar();
				}
			}
		});
	}

	function createLinkDialogInstance(links)
	{
		linkDialog = new LinkDialog(locale);

		Fit.Array.ForEach(links, function(link)
		{
			linkDialog.LinkList.Add(link.Url, link.Title, link.Description);
		});

		linkDialog.OnOpen(function(sender)
		{
			me._internal.FocusStateLocked(true);
		});
		linkDialog.OnClose(function(sender)
		{
			me._internal.FocusStateLocked(false);
		});
	}

	function createToolbarInstance()
	{
		if (selection !== null)
		{
			toolbar = new Toolbar(locale, editable, selection, linkDialog, function()
			{
				clearValueCache();
				fireOnChange();
			});
			me._internal.AddDomElement(toolbar.GetDomElement());
		}
	}

	function createEditorFilterInstance()
	{
		filter = new Filter();
	}

	function showToolbar()
	{
		toolbar && toolbar.Show();
	}

	function hideToolbar()
	{
		toolbar && toolbar.Hide();
	}

	function localize()
	{
		locale = Fit.Internationalization.GetLocale(me);

		if (linkDialog !== null && toolbar !== null) // Link dialog and toolbar is not created the first time localize() is called
		{
			var links = linkDialog.LinkList.GetAll();
			linkDialog.Dispose();
			createLinkDialogInstance(links);

			if (toolbar !== null)
			{
				toolbar.Dispose();
				createToolbarInstance();
			}
		}
	}

	function getOnChangeInvocator(timeout)
	{
		Fit.Validation.ExpectInteger(timeout);

		var fireOnChangeIfValueWasChanged = function()
		{
			var curVal = me.Value();

			if (curVal !== prevVal)
			{
				prevVal = curVal;

				me._internal.FireOnChange()
			}
		};

		if (timeout > -1)
		{
			var debouncer = Fit.Core.CreateDebouncer(fireOnChangeIfValueWasChanged, timeout);
			return { Invoke: function() { debouncer.Invoke(); }, Flush: function() { debouncer.Flush(); }, Cancel: function() { debouncer.Cancel(); }, Timeout: timeout };
		}
		else
		{
			return { Invoke: function() { fireOnChangeIfValueWasChanged(); }, Flush: function() { /* Nothing to flush since Invoke fires OnChange immediately */ }, Cancel: function() { /* Nothing to cancel since Invoke fires OnChange immediately */ }, Timeout: -1 };
		}
	}

	function fireOnChange(immediately)
	{
		Fit.Validation.ExpectBoolean(immediately, true);

		onChangeInvocator.Invoke();

		if (immediately === true)
		{
			onChangeInvocator.Flush();
		}
	}

	function makeLinksHighlightWithCommandButtonDown()
	{
		var mouseOver = false;

		Fit.Events.AddHandler(editable, "mouseover", function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			mouseOver = true;
			Fit.Dom.Data(editable, "command-button-active", ev.ctrlKey || ev.metaKey || ev.shiftKey ? "true" : null);
		});

		Fit.Events.AddHandler(editable, "mouseout", function(e)
		{
			mouseOver = false;
			Fit.Dom.Data(editable, "command-button-active", null);
		});

		globalKeyDownEventId = Fit.Events.AddHandler(document, "keydown", function(e)
		{
			var ev = Fit.Events.GetEvent(e);
			mouseOver && Fit.Dom.Data(editable, "command-button-active", ev.ctrlKey || ev.metaKey || ev.shiftKey ? "true" : null);
		});

		globalKeyUpEventId = Fit.Events.AddHandler(document, "keyup", function(e)
		{
			mouseOver && Fit.Dom.Data(editable, "command-button-active", null);
		});
	}

	function configurePlaceholderFeature()
	{
		me.OnFocus(function(sender)
		{
			Fit.Dom.Data(editable, "placeholder", null);
		});
		me.OnBlur(function(sender)
		{
			updatePlaceholder();
		});
	}

	function updatePlaceholder()
	{
		var empty = Fit.String.StripHtml(me.Value()) === ""; // Stripping HTML in case editor contains nothing but line break(s) (<br>)
		Fit.Dom.Data(editable, "placeholder", empty === true && placeholder || null);
	}

	function clearValueCache()
	{
		valueCache = null;
	}

	function postpone(cb, timeout)
	{
		return setTimeout(function()
		{
			if (me !== null) // Make sure control has not been disposed
			{
				cb();
			}
		}, timeout || 0);
	}

	init();
}
