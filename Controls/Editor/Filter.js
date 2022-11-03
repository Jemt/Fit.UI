Fit._internal.Controls.Editor.Filter = function()
{
	var FilterOrigin = Fit._internal.Controls.Editor.FilterOrigin;

	this.CleanHtml = function(val, origin)
	{
		Fit.Validation.ExpectString(val);
		Fit.Validation.ExpectEnum(origin, FilterOrigin);

		var externalData = origin === FilterOrigin.ExternalValue || origin === FilterOrigin.ExternalValueClipboard;

		var html = val;

		// Some browsers produce HTML code with line breaks and indentation, others without - remove line breaks for
		// consistency and to ease working with regular expressions since these no longer have to account for line breaks.
		html = html.replace(/\r/g, "");
		html = html.replace(/\n/g, "");
		html = html.replace(/\t/g, "");

		// Convert tags produced by legacy browsers (e.g. Internet Explorer producing <STRONG> and <EM>)
		html = html.replace(/<(\/?)strong( .*?)?>/gi, "<$1b>");
		html = html.replace(/<(\/?)em( .*?)?>/gi, "<$1i>");

		// Create parser element

		var parser = document.createElement("div");
		parser.innerHTML = html;

		// Remove unsupported elements (e.g. <iframe>)

		if (externalData === true)
		{
			var allowed =
			{
				p: [], span: [], div: [], br: [],
				h1: [], h2: [], h3: [],
				b: [], u: [], i: [],
				ul: [], ol: [], li: [],
				a: ["href", "target"]
			};

			removeUnsupportedElementsAndAttributes(parser, allowed);
		}

		// Remove empty elements (e.g. <div></div>)

		if (externalData === true)
		{
			removeEmptyElements(parser);
		}

		// Remove/extract spans as they serve no purpose since we do not allow styles on spans

		/*if (externalData === true)
		{
			extractAndRemoveSpanElements(parser);
		}*/

		// Convert paragraphs to divs

		if (externalData === true)
		{
			convertParagraphsToDivs(parser);
		}

		// Flatten HTML structure

		if (externalData === true)
		{
			// Extract content from spans and remove them as they
			// serve no purpose, since we do not allow styles on spans.
			extractAndRemoveElements(parser, "span");

			// Extract content from nested divs and remove them since
			// we only use divs at the root level to represent line lines.
			Fit.Array.ForEach(parser.children, function(child)
			{
				extractAndRemoveElements(child, "div");
			});
		}

		// Remove most common double linebreaks when origin is clipboard.
		// We can only do this when pasting since we otherwise wouldn't
		// allow the user to insert linebreaks anywhere, save it, and later
		// have it restored exactly as created.

		if (origin === FilterOrigin.ExternalValueClipboard)
		{
			removeDoubleLinebreaks(parser);
		}

		// Stringify

		var html = parser.innerHTML;

		// Fix browser quirks

		html = html.replace(/(<[a-z]+[^>]*?)( [a-z]+=(["'])\3)(.*?>)/g, "$1$4"); // Remove empty attributes introduced by some browsers (e.g. Chrome/Safari/Firefox which adds style="" to links when placing text cursor in them) - regex: https://regex101.com/r/UCg4he/1 (will only remove one empty attribute in each element)
		html = html.replace(/<(\/?)([A-Z]+)(.*?)>/g, function(full, cg1, cg2, cg3) { return "<" + cg1 + cg2.toLowerCase() + cg3 + ">" }); // Some browsers' innerHTML (e.g. Internet Explorer 8) produces upper case HTML tags - convert to lower case

		return html;
	}

	function removeUnsupportedElementsAndAttributes(element, allowedTags) // allowedTags = { p: [], div: [], a: ["href", "target"], b: [], u: [], ... }
	{
		Fit.Array.ForEach(element.querySelectorAll("*"), function(node)
		{
			var allowedTag = allowedTags[node.tagName.toLowerCase()];

			if (allowedTag === undefined) // Not allowed - extract children and remove it
			{
				var childNodes = Fit.Array.ToArray(node.childNodes);

				Fit.Array.ForEach(childNodes, function(childNode)
				{
					Fit.Dom.InsertBefore(node, childNode);
				});

				Fit.Dom.Remove(node);
			}
			else // Allowed - remove unsupported attributes
			{
				var attributes = Fit.Array.ToArray(node.attributes);

				Fit.Array.ForEach(attributes, function(attr)
				{
					if (Fit.Array.Contains(allowedTag, attr.name) === false) // Attribute not allowed - remove it
					{
						Fit.Dom.Attribute(node, attr.name, null);
					}
				});
			}
		});
	}

	function removeEmptyElements(element)
	{
		var elementsWithoutChildren = ["br", "hr", "img"]; // See full list: https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
		var mustRerun = false;

		Fit.Array.ForEach(Fit.Array.ToArray(element.children), function(child)
		{
			if (Fit.Array.Contains(elementsWithoutChildren, child.tagName.toLowerCase()) === true)
			{
				return; // Skip elements that cannot have children
			}

			if (child.innerHTML === "") // Element is empty - remove it
			{
				Fit.Dom.Remove(child);
				mustRerun = true; // We need to rerun operation for parent when a child has been removed since parent may end up empty as well
			}
			else // Element is not empty - check recursively for empty elements
			{
				if (removeEmptyElements(child) === true)
				{
					mustRerun = true;
				}
			}
		});

		if (mustRerun === true)
		{
			removeEmptyElements(element);
		}

		return mustRerun;
	}

	function convertParagraphsToDivs(element)
	{
		Fit.Array.ForEach(element.querySelectorAll("p"), function(para)
		{
			var div = document.createElement("div");

			Fit.Array.ForEach(Fit.Array.ToArray(para.childNodes), function(node)
			{
				Fit.Dom.Add(div, node);
			});

			Fit.Dom.Replace(para, div);

			// Add spacing above and below paragraph div
			Fit.Dom.InsertBefore(div, document.createElement("br"));
			Fit.Dom.InsertAfter(div, document.createElement("br"));
		});
	}

	function extractAndRemoveElements(element, type)
	{
		Fit.Array.ForEach(element.querySelectorAll(type), function(childOfType)
		{
			// Move any content out of element before removing it
			Fit.Array.ForEach(Fit.Array.ToArray(childOfType.childNodes), function(node)
			{
				Fit.Dom.InsertBefore(childOfType, node);
			});

			// Remove element
			Fit.Dom.Remove(childOfType);
		});
	}

	function removeDoubleLinebreaks(element)
	{
		var lineBreakElement = null;
		while ((lineBreakElement = element.querySelector("h1 + br, h2 + br, h3 + br, h1 + div > br:first-child, h2 + div > br:first-child, h3 + div > br:first-child")) !== null)
		{
			Fit.Dom.Remove(lineBreakElement);
		}
	}
}

// Enum values determining filter mode based on origin
Fit._internal.Controls.Editor.FilterOrigin =
{
	// Value to filter originates from editor itself - trusted content, minimal filtering
	InternalValue: "InternalValue",

	// Value to filter originates from external source - not trusted content, maximum filtering, optimize structure and content
	ExternalValue: "ExternalValue",

	// Value to filter originates from external source (clipboard) - not trusted content, maximum filtering, optimize structure and content
	ExternalValueClipboard: "ExternalValueClipboard"
}
