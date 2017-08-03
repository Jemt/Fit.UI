/// <container name="Fit.Dom">
/// 	DOM (Document Object Model) manipulation and helper functionality
/// </container>
Fit.Dom = {};
Fit._internal.Dom = {};

// ==========================================================
// CSS
// ==========================================================

/// <function container="Fit.Dom" name="AddClass" access="public" static="true">
/// 	<description> Add CSS class to element if not already found </description>
/// 	<param name="elm" type="DOMElement"> Element on which CSS class is to be added </param>
/// 	<param name="cls" type="string"> CSS class name </param>
/// </function>
Fit.Dom.AddClass = function(elm, cls)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(cls);

	if (Fit.Dom.HasClass(elm, cls) === false)
		elm.className += ((elm.className !== "") ? " " : "") + cls;
}

/// <function container="Fit.Dom" name="RemoveClass" access="public" static="true">
/// 	<description> Remove CSS class from element if found </description>
/// 	<param name="elm" type="DOMElement"> Element from which CSS class is to be removed </param>
/// 	<param name="cls" type="string"> CSS class name </param>
/// </function>
Fit.Dom.RemoveClass = function(elm, cls)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(cls);

    var arr = elm.className.split(" ");
    var newCls = "";

    Fit.Array.ForEach(arr, function(item)
    {
        if (item !== cls)
            newCls += ((newCls !== "") ? " " : "") + item;
    });

    elm.className = newCls;
}

/// <function container="Fit.Dom" name="HasClass" access="public" static="true" returns="boolean">
/// 	<description> Check whether given DOMElement has specified CSS class registered - returns True if found, otherwise False </description>
/// 	<param name="elm" type="DOMElement"> Element for which CSS class may be registered </param>
/// 	<param name="cls" type="string"> CSS class name </param>
/// </function>
Fit.Dom.HasClass = function(elm, cls)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(cls);

    var arr = elm.className.split(" ");
	var found = false;

    Fit.Array.ForEach(arr, function(item)
    {
        if (item === cls)
		{
			found = true;
			return false; // Stop loop
		}
    });

    return found;
}

/// <function container="Fit.Dom" name="GetComputedStyle" access="public" static="true" returns="string">
/// 	<description>
/// 		Get style value applied after stylesheets have been loaded.
/// 		An empty string or null may be returned if style has not been defined or does not exist.
/// 		Make sure not to use shorthand properties (e.g. border-color or padding) as some browsers are
/// 		not capable of calculating these - use the fullly qualified property name (e.g. border-left-color
/// 		or padding-left).
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element which contains desired CSS style value </param>
/// 	<param name="style" type="string"> CSS style property name </param>
/// </function>
Fit.Dom.GetComputedStyle = function(elm, style)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(style);

	var res = null;

    if (window.getComputedStyle) // W3C
	{
		res = window.getComputedStyle(elm)[style];
	}
    else if (elm.currentStyle)
	{
		if (style.indexOf("-") !== -1) // Turn e.g. border-bottom-style into borderBottomStyle which is required by legacy browsers
		{
			var items = style.split("-");
			style = "";

			Fit.Array.ForEach(items, function(i)
			{
				if (style === "")
					style = i;
				else
					style += Fit.String.UpperCaseFirst(i);
			});
		}

        res = elm.currentStyle[style]; // Might return strings rather than useful values - e.g. "3em" or "medium"

		// IE Computed Style fix by Dean Edwards - http://disq.us/p/myl99x
		// Transform values such as 2em or 4pt to actual pixel values.

		if (res !== undefined && res !== null && /^\d+/.test(res) === true && res.toLowerCase().indexOf("px") === -1) // Non-pixel numeric value
		{
			// Save original value
			var orgLeft = elm.style.left;

			// Calculate pixel value
			var runtimeStyle = elm.runtimeStyle.left;
			elm.runtimeStyle.left = elm.currentStyle.left;
			elm.style.left = ((style === "fontSize") ? "1em" : res || 0); // Throws error for a value such as "medium"
			res = elm.style.pixelLeft + "px";

			// Restore value
			elm.style.left = orgLeft;
			elm.runtimeStyle.left = runtimeStyle;
		}
	}

    return (res !== undefined ? res : null);
}

/// <function container="Fit.Dom" name="GetInnerDimensions" access="public" static="true" returns="object">
/// 	<description>
/// 		Returns object with X and Y properties (integers) with inner dimensions of specified
/// 		container. Inner dimensions are width and height with padding and borders substracted.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get inner dimensions for </param>
/// </function>
Fit.Dom.GetInnerDimensions = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	var width = elm.offsetWidth;
	var height = elm.offsetHeight;

	if (width !== 0) // Width is 0 if element is either not visible, or truly 0px
	{
		width -= Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(elm, "padding-left"));
		width -= Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(elm, "padding-right"));
		width -= Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(elm, "border-left-width"));
		width -= Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(elm, "border-right-width"));
	}

	if (height !== 0) // Height is 0 if element is either not visible, or truly 0px
	{
		height -= Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(elm, "padding-top"));
		height -= Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(elm, "padding-bottom"));
		height -= Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(elm, "border-top-width"));
		height -= Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(elm, "border-bottom-width"));
	}

	return { X: Math.floor(width), Y: Math.floor(height) };
}

Fit.Dom.GetInnerWidth = function(elm) // Backward compatibility
{
	Fit.Validation.ExpectDomElement(elm);
	return Fit.Dom.GetInnerDimensions(elm).X;
}


// ==========================================================
// DOM
// ==========================================================

/// <function container="Fit.Dom" name="IsRooted" access="public" static="true" returns="boolean">
/// 	<description> Returns True if element is rooted in document (appended to body), otherwise False </description>
/// 	<param name="elm" type="DOMNode"> Element to check </param>
/// </function>
Fit.Dom.IsRooted = function(elm)
{
	Fit.Validation.ExpectNode(elm);

	var parent = elm.parentElement;
	while (parent !== null)
	{
		if (parent === document.body)
			return true;

		parent = parent.parentElement;
	}

	return false;
}

/// <function container="Fit.Dom" name="InsertBefore" access="public" static="true">
/// 	<description> Insert DOMNode before another DOMNode </description>
/// 	<param name="target" type="DOMNode"> Element to insert new element before </param>
/// 	<param name="newElm" type="DOMNode"> Element to insert before target element </param>
/// </function>
Fit.Dom.InsertBefore = function(target, newElm)
{
	Fit.Validation.ExpectNode(target);
	Fit.Validation.ExpectNode(newElm);

	if (target.parentElement === null)
		Fit.Validation.ThrowError("Unable to insert element - target is not rooted");

	target.parentElement.insertBefore(newElm, target);
}

/// <function container="Fit.Dom" name="InsertAfter" access="public" static="true">
/// 	<description> Insert DOMNode after another DOMNode </description>
/// 	<param name="target" type="DOMNode"> Element to insert new element after </param>
/// 	<param name="newElm" type="DOMNode"> Element to insert after target element </param>
/// </function>
Fit.Dom.InsertAfter = function(target, newElm)
{
	Fit.Validation.ExpectNode(target);
	Fit.Validation.ExpectNode(newElm);

	if (target.parentElement === null)
		Fit.Validation.ThrowError("Unable to insert element - target is not rooted");

	if (target.nextSibling)
		target.parentElement.insertBefore(newElm, target.nextSibling);
	else
		target.parentElement.appendChild(newElm);
}

/// <function container="Fit.Dom" name="InsertAt" access="public" static="true">
/// 	<description>
/// 		Insert DOMNode at given position.
/// 		Notice that position is relative to contained DOM Elements.
/// 		Text and Comment nodes are ignored.
/// 	</description>
/// 	<param name="container" type="DOMElement"> Container to insert element into </param>
/// 	<param name="position" type="integer"> Position (index) to insert element at </param>
/// 	<param name="newElm" type="DOMNode"> Element to insert </param>
/// </function>
Fit.Dom.InsertAt = function(container, position, newElm)
{
	Fit.Validation.ExpectDomElement(container);
	Fit.Validation.ExpectInteger(position);
	Fit.Validation.ExpectNode(newElm);

	// Notice: InsertAt does not allow insertion based on childNodes as it is unreliable on Legacy IE.

	if (container.children.length === 0 || container.children.length - 1 < position)
	{
		container.appendChild(newElm);
	}
	else
	{
		var before = container.children[position];

		if (before)
			Fit.Dom.InsertBefore(before, newElm);
	}
}

/// <function container="Fit.Dom" name="Replace" access="public" static="true">
/// 	<description> Replace element with another one </description>
/// 	<param name="oldElm" type="DOMNode"> Element to replace (Element, Text, or Comment) </param>
/// 	<param name="newElm" type="DOMNode"> Replacement element (Element, Text, or Comment) </param>
/// </function>
Fit.Dom.Replace = function(oldElm, newElm) // http://jsfiddle.net/Jemt/eu74o984/
{
	Fit.Validation.ExpectNode(oldElm);
	Fit.Validation.ExpectNode(newElm);

	if (oldElm.parentElement === null)
		Fit.Validation.ThrowError("Unable to replace element - not rooted");

	var container = oldElm.parentElement;
	container.replaceChild(newElm, oldElm);
}

/// <function container="Fit.Dom" name="Add" access="public" static="true">
/// 	<description> Add element to container </description>
/// 	<param name="container" type="DOMElement"> Add element to this container </param>
/// 	<param name="elm" type="DOMNode"> Element, Text, or Comment to add to container </param>
/// </function>
Fit.Dom.Add = function(container, elm)
{
	Fit.Validation.ExpectDomElement(container);
	Fit.Validation.ExpectNode(elm);

	container.appendChild(elm);
}

/// <function container="Fit.Dom" name="Remove" access="public" static="true">
/// 	<description> Remove DOMNode from its container element </description>
/// 	<param name="elm" type="DOMNode"> DOMNode to remove </param>
/// </function>
Fit.Dom.Remove = function(elm)
{
	Fit.Validation.ExpectNode(elm);

	if (elm.parentElement === null)
		return; // Element not rooted

	elm.parentElement.removeChild(elm);
}

/// <function container="Fit.Dom" name="Attribute" access="public" static="true" returns="string">
/// 	<description> Get/set attribute on DOMElement </description>
/// 	<param name="elm" type="DOMElement"> DOMElement to which attribute is set and/or returned from </param>
/// 	<param name="name" type="string"> Name of attribute to set or retrieve </param>
/// 	<param name="value" type="string" default="undefined">
/// 		If defined, attribute is updated with specified value.
/// 		Passing Null results in attribute being removed.
/// 	</param>
/// </function>
Fit.Dom.Attribute = function(elm, name, value)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(name);
	Fit.Validation.ExpectString(value, true);

	if (Fit.Validation.IsSet(value) === true)
		elm.setAttribute(name, value);
	else if (value === null)
		elm.removeAttribute(name);

	return elm.getAttribute(name);
}

/// <function container="Fit.Dom" name="Data" access="public" static="true" returns="string">
/// 	<description> Get/set data attribute on DOMElement </description>
/// 	<param name="elm" type="DOMElement"> DOMElement to which data attribute is set and/or returned from </param>
/// 	<param name="name" type="string"> Name of data attribute to set or retrieve </param>
/// 	<param name="value" type="string" default="undefined">
/// 		If defined, data attribute is updated with specified value.
/// 		Passing Null results in data attribute being removed.
/// 	</param>
/// </function>
Fit.Dom.Data = function(elm, name, value)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectStringValue(name);
	Fit.Validation.ExpectString(value, true);

	// Modern browsers can read data-attributes from elm.dataset.ATTRIBUTE.
	// Notice that data-title-value="XYZ" becomes elm.dataset.titleValue.

	return Fit.Dom.Attribute(elm, "data-" + name, value);
}

/// <function container="Fit.Dom" name="CreateElement" access="public" static="true" returns="DOMNode">
/// 	<description>
/// 		Create element with the specified HTML content.
/// 		HTML content is (by default) wrapped in a &lt;div&gt; if it produced multiple elements.
/// 		If content on the other hand produces only one outer element, that particular element is returned.
/// 		It is possible to construct DOM objects of type Element, Text, and Comment.
/// 		The container type used to wrap multiple elements can be changed using the containerTagName argument.
/// 	</description>
/// 	<param name="html" type="string"> HTML element to create DOMElement from </param>
/// 	<param name="containerTagName" type="string" default="div">
/// 		If defined, and html argument produces multiple element, the result is wrapped in a container of
/// 		the specified type. If not set, multiple elements will be wrapped in a &lt;div&gt; container.
/// 	</param>
/// </function>
Fit.Dom.CreateElement = function(html, containerTagName)
{
	Fit.Validation.ExpectString(html);
	Fit.Validation.ExpectStringValue(containerTagName, true);

	if (Fit.String.Trim(html).toLowerCase().indexOf("<tr") === 0) // <tr> can only be rooted in a <table> container
	{
		html = Fit.String.Trim(html);

		var container = document.createElement("div"); // Using <div> rather than <tbody> because tbody.innerHTML is read-only in Legacy IE
		container.innerHTML = "<table><tbody>" + html + "</tbody></table>";

		if (container.firstChild.firstChild.children.length === 1)
			return container.firstChild.firstChild.firstChild;

		return container.firstChild;
	}
	else if (Fit.String.Trim(html).toLowerCase().indexOf("<td") === 0) // <td> can only be rooted in a <tr> container
	{
		html = Fit.String.Trim(html); // Make sure container is not returned if e.g. "  <td>test</td>" is passed

		var container = document.createElement("div"); // Using <div> rather than <tr> because tr.innerHTML is read-only in Legacy IE
		container.innerHTML = "<table><tbody><tr>" + html + "</tr></tbody></table>";

		if (container.firstChild.firstChild.firstChild.children.length === 1)
			return container.firstChild.firstChild.firstChild.firstChild;

		return container.firstChild.firstChild.firstChild;
	}
	else
	{
		var container = document.createElement(((Fit.Validation.IsSet(containerTagName) === true) ? containerTagName : "div"));
		container.innerHTML = html;

		// Using childNodes property instead of children property to include text nodes,
		// which the DOM functions in Fit.UI usually do not take into account.
		// If text nodes are not included, a call like the following would exclude
		// the " world" portion. We do not want to throw away data, naturally! Example:
		// Fit.Dom.CreateElement("<span>Hello</span> world"); // Returns <div><span>Hello</span> world</div>
		if (container.childNodes.length === 1)
			return container.firstChild;

		return container;
	}
}

/// <function container="Fit.Dom" name="Text" access="public" static="true" returns="string">
/// 	<description> Get/set inner text of DOMElement </description>
/// 	<param name="elm" type="DOMElement"> DOMElement to which text is added and/or returned from </param>
/// 	<param name="value" type="string" default="undefined"> If defined, inner text is updated with specified value </param>
/// </function>
Fit.Dom.Text = function(elm, value)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectString(value, true);

	if (Fit.Validation.IsSet(value) === true)
	{
		if (elm.textContent)
			elm.textContent = value;
		else
			elm.innerText = value;
	}

	return (elm.textContent ? elm.textContent : elm.innerText);
}

/// <function container="Fit.Dom" name="GetIndex" access="public" static="true" returns="integer">
/// 	<description>
/// 		Get element position within parent element.
/// 		Notice that Text and Comment nodes are ignored.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get index for </param>
/// </function>
Fit.Dom.GetIndex = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	if (!elm.parentElement)
		return -1;

	var parent = elm.parentElement;

	for (var i = 0 ; i < parent.children.length ; i++)
		if (parent.children[i] === elm)
			return i;

	return -1; // Should not happen
}

/// <function container="Fit.Dom" name="GetDepth" access="public" static="true" returns="integer">
/// 	<description>
/// 		Get number of levels specified element is nested in DOM.
/// 		HTMLElement is at level 0, HTMLBodyElement is at level 1,
/// 		first element in HTMLBodyElement is at level 2, and so forth.
/// 	</description>
/// 	<param name="elm" type="DOMNode"> Element to get depth in DOM for </param>
/// </function>
Fit.Dom.GetDepth = function(elm)
{
	Fit.Validation.ExpectNode(elm);

    var i = 0;
    var parent = elm.parentElement;

    while (parent)
    {
        i++;
        parent = parent.parentElement;
    }

    return i;
}

/// <function container="Fit.Dom" name="Contained" access="public" static="true" returns="boolean">
/// 	<description> Check whether given element is found in given container at any given level in object hierarchy </description>
/// 	<param name="container" type="DOMElement"> Container expected to contain element </param>
/// 	<param name="elm" type="DOMNode"> Element expected to be found in container's object hierarchy </param>
/// </function>
Fit.Dom.Contained = function(container, elm)
{
	Fit.Validation.ExpectDomElement(container);
	Fit.Validation.ExpectNode(elm);

    var parent = elm.parentElement;

    while (parent)
    {
        if (parent === container)
			return true;

        parent = parent.parentElement;
    }

    return false;
}

/// <function container="Fit.Dom" name="IsVisible" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Check whether given element is visible. Returns True if element has been rooted
/// 		in DOM and is visible. Returns False if not rooted, or display:none has been set
/// 		on element or any of its ancestors.
/// 	</description>
/// 	<param name="elm" type="DOMNode"> Element to check visibility for </param>
/// </function>
Fit.Dom.IsVisible = function(elm)
{
	Fit.Validation.ExpectNode(elm);

	if (elm.nodeType === 8)
		return false; // Comments are not visual, hence not visible

	if (elm.nodeType === 3)
	{
		// Check parent element if a Text element is passed

		if (elm.parentElement === null)
			return false; // Not rooted

		elm = elm.parentElement;
	}

	// Determine visibility quickly using offsetParent if possible.
	// Notice that offsetParent is always Null for an element with
	// position:fixed, in which case this check will not suffice.
	if (Fit._internal.Dom.IsOffsetParentSupported() === true && Fit.Dom.GetComputedStyle(elm, "position") !== "fixed")
	{
		return (elm.offsetParent !== null);
	}

	// Traverse DOM bottom-up to determine whether element or any ancestors have display:none set

	var element = elm;
	var previous = null;

	while (element !== null)
	{
		if (Fit.Dom.GetComputedStyle(element, "display") === "none")
			return false; // Element is not visible

		previous = element;
		element = element.parentElement;
	}

	return (previous === document.documentElement); // If last parent reached is not <html>, then element is not rooted in DOM yet
}

/// <function container="Fit.Dom" name="GetConcealer" access="public" static="true" returns="DOMElement">
/// 	<description>
/// 		Get container responsible for hiding given element.
/// 		Element passed will be returned if hidden itself.
/// 		Returns Null if element is visible, or has not been rooted in DOM yet.
/// 	</description>
/// 	<param name="elm" type="DOMNode"> Element to get concealer for </param>
/// </function>
Fit.Dom.GetConcealer = function(elm)
{
	Fit.Validation.ExpectNode(elm);

	if (elm.nodeType === 8)
		return elm; // Comments are not visual, hence not visible

	if (Fit.Dom.IsVisible(elm) === true)
		return null; // Element is not concealed - it is visible and rooted in DOM

	if (elm.nodeType === 3)
		elm = elm.parentElement; // Check parent element if a Text element is passed

	// Element is hidden or not rooted in DOM.
	// Traverse DOM bottom-up to find container hiding element.

	var element = elm;
	while (element !== null)
	{
		if (Fit.Dom.GetComputedStyle(element, "display") === "none")
			return element;

		element = element.parentElement;
	}

	return null; // Not rooted in DOM yet
}

/// <function container="Fit.Dom" name="GetFocused" access="public" static="true" returns="DOMElement">
/// 	<description>
/// 		Returns element currently focused. If no element is focused, the document body is returned.
/// 		Null will be returned if the document has not been loaded yet.
/// 	</description>
/// </function>
Fit.Dom.GetFocused = function()
{
	var focused = null;

	try // Legacy IE is buggy (https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement)
	{
		focused = document.activeElement;

		if (!focused.nodeType) // IE11 returns an empty object when running in an iFrame (http://fiddle.jshell.net/Jemt/dL9q6b2d/6/embedded/result,js)
			focused = document.body;
	}
	catch (err)
	{
		focused = document.body;
	}

	return focused;
}

/// <function container="Fit.Dom" name="GetParentOfType" access="public" static="true" returns="DOMElement">
/// 	<description> Returns first parent of specified type for a given element if found, otherwise Null </description>
/// 	<param name="element" type="DOMNode"> Element to find parent for </param>
/// 	<param name="parentType" type="string"> Tagname of parent element to look for </param>
/// </function>
Fit.Dom.GetParentOfType = function(element, parentType)
{
	Fit.Validation.ExpectNode(element);
	Fit.Validation.ExpectStringValue(parentType);

    var parent = element.parentElement;

    while (parent !== null)
    {
        if (parent.tagName.toLowerCase() === parentType.toLowerCase())
			return parent;

        parent = parent.parentElement;
    }

    return null;
}

/// <function container="Fit.Dom" name="Wrap" access="public" static="true">
/// 	<description> Wraps element in container element while preserving position in DOM if rooted </description>
/// 	<param name="elementToWrap" type="DOMNode"> Element to wrap </param>
/// 	<param name="container" type="DOMElement"> Container to wrap element within </param>
/// </function>
Fit.Dom.Wrap = function(elementToWrap, container)
{
	Fit.Validation.ExpectNode(elementToWrap);
	Fit.Validation.ExpectDomElement(container);

	var parent = elementToWrap.parentElement;
	var nextSibling = elementToWrap.nextSibling;

	container.appendChild(elementToWrap); // Causes elementToWrap to be removed from existing container

	if (parent === null)
		return; // Not rooted

	if (nextSibling === null)
		parent.appendChild(container);
	else
		parent.insertBefore(container, nextSibling);
}


// ==========================================================
// Position
// ==========================================================

// Notice: Browser vendors are changing the way coordinates
// and dimensions are reported. W3C previously define these as
// integers/longs, but browsers are moving to floats for smoother
// animation and scrolling, and for more accurate positioning.
// https://code.google.com/p/chromium/issues/detail?id=323935
// For consistency we use Math.round/floor to make sure integers are
// always returned on both modern and legacy browsers.

/// <function container="Fit.Dom" name="GetPosition" access="public" static="true" returns="object">
/// 	<description>
/// 		Get position for visible element.
/// 		Object returned contains an X and Y property
/// 		with the desired integer values (pixels).
/// 		Null will be returned if element is not visible.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get position for </param>
/// 	<param name="relativeToViewport" type="boolean" default="false">
/// 		Set True to get element position relative to viewport rather than to document which may exceed the viewport
/// 	</param>
/// </function>
Fit.Dom.GetPosition = function(elm, relativeToViewport) { return Fit._internal.Dom.GetPosition(elm, relativeToViewport); }
Fit._internal.Dom.GetPosition = function(elm, relativeToViewport, internalKeepMargin)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectBoolean(relativeToViewport, true);
	Fit.Validation.ExpectBoolean(internalKeepMargin, true);

	if (Fit.Dom.IsVisible(elm) === false)
		return null;

	var pos = { X: 0, Y: 0 };

	// Get position relative to viewport
	var rect = elm.getBoundingClientRect(); // Might contain floating point values
	pos.X = rect.left;
	pos.Y = rect.top;

	// Substract margin as positioning is done where margin starts
	if (internalKeepMargin !== true)
	{
		pos.X -= Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(elm, "margin-left"));
		pos.Y -= Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(elm, "margin-top"));
	}

	if (relativeToViewport === true)
	{
		pos.X = Math.round(pos.X);
		pos.Y = Math.round(pos.Y);
		return pos;
	}

	// Add scroll to get position relative to document
	pos.X += window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
	pos.Y += window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

	pos.X = Math.round(pos.X);
	pos.Y = Math.round(pos.Y);

	return pos;
}

/// <function container="Fit.Dom" name="GetInnerDistance" access="public" static="true" returns="object">
/// 	<description>
/// 		Get distance from element to any given parent or ancestor.
/// 		Object returned contains an X and Y property with the desired integer values (pixels).
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get position for </param>
/// 	<param name="parent" type="DOMElement"> Parent or ancestor element to measure distance within </param>
/// </function>
Fit.Dom.GetInnerDistance = function(elm, parent)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectDomElement(parent);

	// Notice that the distance returned is not suitable for positioning since this
	// is done relative to the offsetParent (positioned parent), and the code below
	// does not take margin and borders into account which affects positioning.
	// Use GetRelativePosition(..) instead if actual position coordinates are needed.

	var x = elm.offsetLeft;
	var y = elm.offsetTop;

	while ((elm = elm.offsetParent) !== parent && elm !== null)
	{
		x += elm.offsetLeft;
		y += elm.offsetTop;
	}

	return { X: Math.round(x), Y: Math.round(y) };
}

/// <function container="Fit.Dom" name="GetRelativePosition" access="public" static="true" returns="object">
/// 	<description>
/// 		Get element position relative to a positioned parent or ancestor (offsetParent).
/// 		Coordinates returned are relative to document if no positioned parent or ancestor is found.
/// 		For an element with position:fixed coordinates relative to the document is returned.
/// 		Object returned contains an X and Y property with the desired integer values (pixels).
/// 		Notice that Null is returned in case element is not rooted yet (added to DOM) or invisible.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get position for </param>
/// </function>
Fit.Dom.GetRelativePosition = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	if (Fit.Dom.GetComputedStyle(elm, "position") === "fixed")
	{
		return Fit.Dom.GetPosition(elm); // Page scroll and element margin has already been added and substracted
	}

	// Make sure offsetParent is available, which will not be the cause if element is not
	// rooted, hidden using display:none, or has position:fixed (the latter is handled above).
	if (Fit.Dom.IsVisible(elm) === false)
		return null;

	var pos = Fit.Dom.GetPosition(elm); // Page scroll and element margin has already been added and substracted

	// Get actual offsetParent.
	// For an element without a positioned parent, the offsetParent
	// is most often the body element, but for elements in e.g. a table,
	// the immediate offsetParent is the td element, and the td's offsetParent
	// is the table element. So we need to walk up the hierarchy until
	// we either find a positioned parent or reach the body element.
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent

	var offsetParent = elm.offsetParent;
	while (offsetParent !== null && Fit.Dom.GetComputedStyle(offsetParent, "position") === "static" /*&& offsetParent !== document.body && offsetParent !== document.documentElement*/)
	{
		offsetParent = offsetParent.offsetParent;
	}
	offsetParent = offsetParent || document.documentElement;

	if (offsetParent !== document.documentElement)
	{
		var offsetParentPos = Fit._internal.Dom.GetPosition(offsetParent, false, true);

		if ((Fit.Browser.GetInfo().Name === "Firefox" && offsetParent.tagName === "TABLE")
			|| (Fit.Browser.GetInfo().Name === "MSIE" && Fit.Browser.GetInfo().Version >= 10 && offsetParent.tagName === "TABLE")
			|| (Fit.Browser.GetInfo().Name === "Edge" && offsetParent.tagName === "TABLE"))
		{
			pos.X = pos.X - offsetParentPos.X;
			pos.Y = pos.Y - offsetParentPos.Y;
		}
		else
		{
			pos.X = pos.X - (offsetParentPos.X + Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(offsetParent, "border-left-width")));
			pos.Y = pos.Y - (offsetParentPos.Y + Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(offsetParent, "border-top-width")));
		}

		//pos.X = pos.X - (offsetParent.offsetLeft + Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(offsetParent, "border-left-width")));
		//pos.Y = pos.Y - (offsetParent.offsetTop + Fit._internal.Dom.GetPx(Fit.Dom.GetComputedStyle(offsetParent, "border-top-width")));
	}

	return pos;
}

/// <function container="Fit.Dom" name="GetScrollPosition" access="public" static="true" returns="object">
/// 	<description>
/// 		Get number of pixels specified element's container(s)
/// 		have been scrolled. This gives us the total scroll value
/// 		for nested scrollable elements.
/// 		Object returned contains an X and Y property with the desired integer values (pixels).
/// 	</description>
/// 	<param name="elm" type="DOMNode"> Element to get scroll position for </param>
/// </function>
Fit.Dom.GetScrollPosition = function(elm)
{
	Fit.Validation.ExpectNode(elm);

	// Get number of pixels specified element's container(s)
	// have been scrolled. This gives us the total scroll value
	// for nested scrollable elements which in combination with
	// X,Y mouse coordinates can be used to determine the mouse
	// position in the document rather than in the viewport:
	// scrollX = mouseXviewport + GetScrollPosition(elm).X;
	// scrollY = mouseYviewport + GetScrollPosition(elm).Y;

	var pos = { X: 0, Y: 0 };

	if (elm.nodeType !== 1) // Text or Comment element which do not have scrollLeft and scrollTop properties
		elm = elm.parentElement;

	while (elm)
	{
		pos.X += elm.scrollLeft;
		pos.Y += elm.scrollTop;
		elm = elm.parentElement;
	}

	pos.X = Math.floor(pos.X);
	pos.Y = Math.floor(pos.Y);

	return pos;
}

// Internal members

Fit._internal.Dom.IsOffsetParentSupported = function() // Returns True if offsetParent can be used to determine whether an element is visible or not
{
	if (Fit._internal.Dom.OffsetParentSupported === undefined)
	{
		var parent = document.createElement("div");
		var child = document.createElement("div");

		parent.style.display = "none";

		Fit.Dom.Add(document.body, parent);
		Fit.Dom.Add(parent, child);

		Fit._internal.Dom.OffsetParentSupported = (child.offsetParent === null); // If supported, offsetParent should return Null (will return <body> on e.g. IE9-10)

		Fit.Dom.Remove(parent);
	}

	return Fit._internal.Dom.OffsetParentSupported;
}

Fit._internal.Dom.GetPx = function(val)
{
	val = (val ? parseInt(val) : 0);

	if (isNaN(val) === true) // E.g. if val was "auto"
		val = 0;

	return val;
}
