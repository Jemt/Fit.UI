// Working with text selections in JavaScript:
// https://javascript.info/selection-range

Fit._internal.Controls.Editor.Selection = function(editable, selectionWithinEditorType)
{
	var SelectionType = Fit._internal.Controls.Editor.SelectionType;

	Fit.Validation.ExpectDomElement(editable);
	Fit.Validation.ExpectEnum(selectionWithinEditorType, SelectionType);

	var me = this;
	var globalSelectionChangeHandlerId = -1;
	var validSelection = selectionWithinEditorType;
	var onSelectionHandlers = [];

	// IMPORTANT: Only call Selection API when page has had focus - otherwise it
	// might fail. For instance getSelection().getRangeAt(0) will throw an error.
	// We can use `getSelection().type === "None"` to detect lack of a selection.

	// ============================================
	// Init
	// ============================================

	function init()
	{
		if (me.IsSupported() === true)
		{
			var prevSel = null;

			globalSelectionChangeHandlerId = Fit.Events.AddHandler(document, "selectionchange", function(e)
			{
				// GetPosition() temporarily manipulates selection and restores it.
				// Unfortunately it sometimes trigger OnSelectionChange. Prevent event from
				// being processed - unless selection has actually changed - to avoid infinite loops.

				var sel = getSelection();

				var newSel =
				{
					startNode: sel.anchorNode,
					startOffset: sel.anchorOffset,
					endNode: sel.focusNode,
					endOffset: sel.focusOffset
				};

				if (prevSel !== null && newSel.startNode === prevSel.startNode && newSel.startOffset === prevSel.startOffset && newSel.endNode === prevSel.endNode && newSel.endOffset === prevSel.endOffset)
				{
					return;
				}

				prevSel = newSel;

				// Trigger OnSelection event

				Fit.Array.ForEach(onSelectionHandlers, function(cb)
				{
					cb(me);
				});
			});
		}
	}

	// ============================================
	// Public
	// ============================================

	this.IsSupported = function()
	{
		// MSIE support:
		// The Selection API was initially designed to work with IE9+ but at the final
		// stage of implementation the need to use containsNode(..) was introduced, which
		// excluded even IE11. All functionality should work in IE9-11 except
		// SelectionContainsNodeOfType(..) which uses the native containsNode(..) function.

		return window.getSelection !== undefined /* IE9+ */ && getSelection().containsNode !== undefined /* not supported by MSIE */;
	}

	this.IsSelectionWithinEditor = function()
	{
		// The selection API is inconsistent across different browsers.
		// Here is a test showing how e.g. getSelection().anchorNode produce different results
		// in different browsers. Especially notice that it sometimes produce Null in Safari.
		// Proof: https://jsfiddle.net/7mvgkp8s/12/

		var sel = getSelection();

		if (sel.anchorNode === null || (sel.anchorNode !== editable && Fit.Dom.Contained(editable, sel.anchorNode) === false))
		{
			return false;
		}

		if (validSelection === SelectionType.Caret)
		{
			return sel.anchorNode === editable || Fit.Dom.Contained(editable, sel.anchorNode) === true;
		}
		else if (validSelection === SelectionType.Selection || validSelection === SelectionType.SelectionAndCaretOnEmptyLine)
		{
			var isSelection = (sel.anchorNode === editable || Fit.Dom.Contained(editable, sel.anchorNode) === true) && isSelectionCollapsed(sel) === false; // Notice that anchorNode is editable element itself when starting selection on an empty line

			if (validSelection === SelectionType.Selection)
			{
				return isSelection;
			}

			var isCaretOnEmptyLine = sel.anchorNode.nodeType !== 3 /* not a text node - becomes text node when a character is present on the line */ && isSelectionCollapsed(sel) === true;

			return isSelection || isCaretOnEmptyLine;
		}

		return false;
	}

	this.HasSelection = function()
	{
		return isSelectionCollapsed(getSelection()) === false; // Returns True if selection is a range
	}

	this.SelectionContainsNodeOfType = function(tagType)
	{
		Fit.Validation.ExpectString(tagType);

		var sel = getSelection();

		if (isSelectionCollapsed(sel) === true)
		{
			return me.GetNodeOfTypeFromSelection(tagType.toUpperCase()) !== null;
		}

		var elements = editable.querySelectorAll(tagType);
		var contained = false;

		Fit.Array.ForEach(elements, function(elm)
		{
			// Notice that containsNode(..) only returns true if the entire element is selected.
			// Partially selecting the content of e.g. a <li> element does not include it and
			// results in containsNode(..) returning False. Work around implemented further down.
			if (sel.containsNode(elm) === true) // NOT supported by any version of MSIE
			{
				contained = true;
				return false; // Break loop
			}
		});

		if (contained === true)
		{
			return true;
		}

		var selectionStartsWithinElement = me.GetNodeOfTypeFromSelection(tagType.toUpperCase()) !== null;
		var selectionEndsWithinElement = me.GetNodeOfTypeFromSelection(tagType.toUpperCase(), true) !== null;

		if (selectionStartsWithinElement === true || selectionEndsWithinElement === true)
		{
			return true;
		}

		return false;
	}

	this.GetSnapshot = function()
	{
		var range = getSelection().getRangeAt(0);

		var snapshot =
		{
			Restore: function()
			{
				sel = getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			}
		};

		return snapshot;
	}

	this.GetNodeOfTypeFromSelection = function(tagType, useFocusNode) // useFocusNode = get node from where selection ends instead of where it starts
	{
		Fit.Validation.ExpectString(tagType);
		Fit.Validation.ExpectBoolean(useFocusNode, true);

		var sel = getSelection();
		var anchorNode = sel.anchorNode;
		var node = null;

		if (useFocusNode === true)
		{
			anchorNode = sel.focusNode;
		}

		if (anchorNode === null || (anchorNode !== editable && Fit.Dom.Contained(editable, anchorNode) === false))
		{
			return null;
		}

		if (anchorNode.nodeType === 3) // Text node
		{
			node = anchorNode.parentNode; // MSIE does not support parentElement on text nodes
		}
		else
		{
			node = anchorNode;
		}

		while (node !== editable) // Iterate up the DOM hierarchy to check whether current selection is within an element of the queried tag type
		{
			if (node.tagName === tagType)
			{
				return node;
			}

			node = node.parentElement;
		}

		return null;
	}

	this.SelectNodeContents = function(node)
	{
		Fit.Validation.ExpectNode(node);

		// Update selection so content within newly added node
		// gets selected. That way we can apply additional styles
		// within that node. Not updating the selection would cause
		// additional changes to replace previous changes.

		var sel = getSelection();
		sel.removeAllRanges();

		var range = document.createRange();
		range.selectNodeContents(node);

		sel.addRange(range);
	}

	this.SelectWordIfCaretWithin = function()
	{
		var sel = getSelection();
		var node = sel.anchorNode;

		if (node.nodeType === 3 /* text node */ && isSelectionCollapsed(sel) === true)
		{
			var nodeValue = node.nodeValue;
			var textLength = nodeValue.length;
			var cursorPos = sel.anchorOffset;

			var wordStart = cursorPos;
			var wordEnd = cursorPos;

			var stops = [" ", ".", ",", ":", ";", "\"", "'", "(", ")", "[", "]", "/", "!", "?", "@"];

			// Check letters left of caret
			while (wordStart - 1 >= 0)
			{
				var prevChar = nodeValue.substring(wordStart - 1, wordStart);

				if (Fit.Array.Contains(stops, prevChar) === true)
				{
					break;
				}

				wordStart--;
			}

			if (wordStart === cursorPos) return; // Do not select word - caret was placed in front of word, not within

			// Check letters right of caret
			while (wordEnd + 1 <= textLength)
			{
				var nextChar = nodeValue.substring(wordEnd, wordEnd + 1);

				if (Fit.Array.Contains(stops, nextChar) === true)
				{
					break;
				}

				wordEnd++;
			}

			if (wordEnd === cursorPos) return; // Do not select word - caret was placed behind word, not within

			var newRange = document.createRange();
			newRange.setStart(node, wordStart);
			newRange.setEnd(node, wordEnd);

			sel.removeAllRanges();
			sel.addRange(newRange);
		}
	}

	this.GetPosition = function()
	{
		var sel = getSelection();
		var rect = sel.getRangeAt(0).getBoundingClientRect(); // Only works when anchorNode is a text node or when selection has a range (https://stackoverflow.com/questions/74166196/getselection-getrangeat0-getboundingclientrect-return-zero-values)

		if (sel.anchorNode.nodeType === 1 && isSelectionCollapsed(sel) === true) // Caret most likely placed on an empty line in which case anchorNode becomes either line div or editable div
		{
			// We need to add a node where the caret is currently at to obtain its position

			var tempNode = document.createElement("span");
			tempNode.innerHTML = "&nbsp;"; // Must have a value - otherwise position cannot be reliably determined in Safari

			if (sel.anchorNode.tagName !== "BR") // Make sure anchorNode is not a linebreak which cannot have children
			{
				// Insert node where text cursor is at.
				// WARNING: This sometimes result in OnSelectionChange firing, potentially
				// causing an infinite loop if GetPosition() is called again as a result! A guard
				// against this has been added to our OnSelectChange handler registered in init().
				// OnSelectionChange mostly fires when selection is collapsed and anchorNode is
				// an element (not a text node). Since we remove tempNode below, and since the
				// OnSelectionChange event is async and fires after this code block is done executing,
				// the selection state will not actually have changed, which our safe guard detects,
				// and suppresses the event. See implementation details in OnSelectionChange handler.
				sel.getRangeAt(0).insertNode(tempNode);
			}
			else // AnchorNode is a linebreak - this happens when creating a heading in an empty editor and clicking in the editor again, in which case the linebreak becomes the selected element
			{
				Fit.Dom.InsertBefore(sel.anchorNode, tempNode); // Insert node just before linebreak to obtain the position of the text cursor
			}

			var pos = Fit.Dom.GetBoundingPosition(tempNode);
			rect = { top: pos.Y, left: pos.X, width: 0 };

			Fit.Dom.Remove(tempNode);
		}

		return { Top: Math.round(rect.top), Left: Math.round(rect.left), Width: Math.round(rect.width) };
	}

	this.OnSelection = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		onSelectionHandlers.push(cb);
	}

	this.Dispose = function()
	{
		if (globalSelectionChangeHandlerId !== -1)
		{
			Fit.Events.RemoveHandler(document, globalSelectionChangeHandlerId);
		}

		SelectionType = me = globalSelectionChangeHandlerId = validSelection = onSelectionHandlers = null;
	}

	// ============================================
	// Private
	// ============================================

	function isSelectionCollapsed(sel)
	{
		if (sel.type)
		{
			return sel.type === "Caret";
		}

		return sel.getRangeAt(0).collapsed === true; // IE9+
	}

	init();
}

// <container name="Fit._internal.Controls.Editor.SelectionType">
// 	Enum values determining valid selection within editor
// </container>
Fit._internal.Controls.Editor.SelectionType =
{
	// <member container="Fit._internal.Controls.Editor.SelectionType" name="Caret" access="public" static="true" type="string" default="Caret">
	// 	<description>
	// 		Placing the caret anywhere in the editor is considered a selection
	// 		expected to activate the editor's toolbar. The toolbar will follow
	// 		the position of the caret as the user types.
	// 	</description>
	// </member>
	Caret: "Caret",

	// <member container="Fit._internal.Controls.Editor.SelectionType" name="Selection" access="public" static="true" type="string" default="Selection">
	// 	<description> A text selection is required to activate the editor's toolbar </description>
	// </member>
	Selection: "Selection",

	// <member container="Fit._internal.Controls.Editor.SelectionType" name="SelectionAndCaretOnEmptyLine" access="public" static="true" type="string" default="SelectionAndCaretOnEmptyLine">
	// 	<description> A text selection or placing the caret on an empty line is required to activate the editor's toolbar </description>
	// </member>
	SelectionAndCaretOnEmptyLine: "SelectionAndCaretOnEmptyLine"
}
