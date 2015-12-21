/// <container name="Fit.Dom">
/// 	DOM (Document Object Model) manipulation and helper functionality
/// </container>
Fit.Dom = {};

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
/// 		An empty string may be returned if style has not been defined, or Null if style does not exist.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element which contains desired CSS style value </param>
/// 	<param name="style" type="string"> CSS style property name </param>
/// </function>
Fit.Dom.GetComputedStyle = function(elm, style)
{
	var res = null;

    if (window.getComputedStyle)
	{
		res = window.getComputedStyle(elm)[style];
	}
    else if (elm.currentStyle)
	{
        res = elm.currentStyle[style];
	}

    return (res !== undefined ? res : null);
}

/// <function container="Fit.Dom" name="GetInnerWidth" access="public" static="true" returns="integer">
/// 	<description> Get inner width of given container (width with padding and borders substracted) </description>
/// 	<param name="elm" type="DOMElement"> Element to get inner width for </param>
/// </function>
Fit.Dom.GetInnerWidth = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	var px = function(val) { return (val ? parseInt(val) : 0); }

	var width = elm.offsetWidth;

	if (width === 0) // Element is either 0px wide, or is not visible
		return width;

	width -= px(Fit.Dom.GetComputedStyle(elm, "padding-left"));
	width -= px(Fit.Dom.GetComputedStyle(elm, "padding-right"));
	width -= px(Fit.Dom.GetComputedStyle(elm, "border-left-width"));
	width -= px(Fit.Dom.GetComputedStyle(elm, "border-right-width"));

	return width;
}


// ==========================================================
// DOM
// ==========================================================

/// <function container="Fit.Dom" name="InsertBefore" access="public" static="true">
/// 	<description> Insert DOMElement before another DOMElement </description>
/// 	<param name="target" type="DOMElement"> Element to insert new element before </param>
/// 	<param name="newElm" type="DOMElement"> Element to insert before target element </param>
/// </function>
Fit.Dom.InsertBefore = function(target, newElm)
{
	Fit.Validation.ExpectDomElement(target);
	Fit.Validation.ExpectDomElement(newElm);

	target.parentElement.insertBefore(newElm, target);
}

/// <function container="Fit.Dom" name="InsertAfter" access="public" static="true">
/// 	<description> Insert DOMElement after another DOMElement </description>
/// 	<param name="target" type="DOMElement"> Element to insert new element after </param>
/// 	<param name="newElm" type="DOMElement"> Element to insert after target element </param>
/// </function>
Fit.Dom.InsertAfter = function(target, newElm)
{
	Fit.Validation.ExpectDomElement(target);
	Fit.Validation.ExpectDomElement(newElm);

	if (target.nextElementSibling)
		target.parentElement.insertBefore(newElm, target.nextElementSibling);
	else
		target.parentElement.appendChild(newElm);
}

/// <function container="Fit.Dom" name="InsertAt" access="public" static="true">
/// 	<description> Insert DOMElement at given position </description>
/// 	<param name="container" type="DOMElement"> Container to insert element into </param>
/// 	<param name="position" type="integer"> Position (index) to insert element at </param>
/// 	<param name="newElm" type="DOMElement"> Element to insert </param>
/// </function>
Fit.Dom.InsertAt = function(container, position, newElm)
{
	Fit.Validation.ExpectDomElement(container);
	Fit.Validation.ExpectInteger(position);
	Fit.Validation.ExpectDomElement(newElm);

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

/// <function container="Fit.Dom" name="Add" access="public" static="true">
/// 	<description> Add DOMElement to container </description>
/// 	<param name="container" type="DOMElement"> Add element to this container </param>
/// 	<param name="elm" type="object"> Element or Text node to add to container </param>
/// </function>
Fit.Dom.Add = function(container, elm)
{
	Fit.Validation.ExpectDomElement(container);
	Fit.Validation.ExpectContentNode(elm);

	container.appendChild(elm);
}

/// <function container="Fit.Dom" name="Remove" access="public" static="true">
/// 	<description> Remove DOMElement from its container element </description>
/// 	<param name="elm" type="DOMElement"> DOMElement to remove </param>
/// </function>
Fit.Dom.Remove = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

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

/// <function container="Fit.Dom" name="CreateElement" access="public" static="true" returns="DOMElement">
/// 	<description>
/// 		Create element with the specified HTML content.
/// 		HTML content is (by default) wrapped in a &lt;div&gt; if it produced multiple elements.
/// 		If content on the other hand produces only one outer element, that particular element is returned.
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

	var container = document.createElement(((Fit.Validation.IsSet(containerTagName) === true) ? containerTagName : "div"));
	container.innerHTML = html;

	if (container.children.length === 1)
		return container.firstChild;

	return container;
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
/// 	<description> Get element position within parent element </description>
/// 	<param name="elm" type="DOMElement"> DOMElement to get index for </param>
/// </function>
Fit.Dom.GetIndex = function(elm)
{
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
/// 	<param name="elm" type="DOMElement"> Element to get depth in DOM for </param>
/// </function>
Fit.Dom.GetDepth = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

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
/// 	<param name="elm" type="DOMElement"> Element expected to be found in container's object hierarchy </param>
/// </function>
Fit.Dom.Contained = function(container, elm)
{
	Fit.Validation.ExpectDomElement(container);
	Fit.Validation.ExpectDomElement(elm);

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
/// 	<param name="elm" type="DOMElement"> Element to check visibility for </param>
/// </function>
Fit.Dom.IsVisible = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

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
/// 	<param name="elm" type="DOMElement"> Element to get concealer for </param>
/// </function>
Fit.Dom.GetConcealer = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

	if (Fit.Dom.IsVisible(elm) === true)
		return null; // Element is not concealed - it is visible and rooted in DOM

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

/// <function container="Fit.Dom" name="GetParentOfType" access="public" static="true" returns="DOMElement">
/// 	<description> Returns first parent of specified type for a given DOMElement if found, otherwise Null </description>
/// 	<param name="element" type="DOMElement"> DOMElement to find parent for </param>
/// 	<param name="parentType" type="string"> Tagname of parent element to look for </param>
/// </function>
Fit.Dom.GetParentOfType = function(element, parentType)
{
	Fit.Validation.ExpectDomElement(element);
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
/// 	<description> Wraps element in container element while preserving position in DOM </description>
/// 	<param name="elementToWrap" type="DOMElement"> Element to wrap </param>
/// 	<param name="container" type="DOMElement"> Container to wrap element within </param>
/// </function>
Fit.Dom.Wrap = function(elementToWrap, container)
{
	Fit.Validation.ExpectDomElement(elementToWrap);
	Fit.Validation.ExpectDomElement(container);

	var parent = elementToWrap.parentElement;
	var nextSibling = elementToWrap.nextSibling;

	container.appendChild(elementToWrap); // Causes elementToWrap to be removed from existing container

	if (nextSibling === null)
		parent.appendChild(container);
	else
		parent.insertBefore(container, nextSibling);
}


// ==========================================================
// Position
// ==========================================================

/// <function container="Fit.Dom" name="GetPosition" access="public" static="true" returns="object">
/// 	<description>
/// 		Get element position.
/// 		Object returned contains an X and Y property with the desired integer values (pixels).
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get position for </param>
/// 	<param name="relativeToViewport" type="boolean" default="false">
/// 		Set False to get element position relative to viewport rather than to document which may exceed the viewport
/// 	</param>
/// </function>
Fit.Dom.GetPosition = function(elm, relativeToViewport)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectBoolean(relativeToViewport, true);

    // Return position within viewport

    if (relativeToViewport === true)
    {
        var res = elm.getBoundingClientRect();
        return { X: res.left, Y: res.top };
    }

    // Return position within document

    var pos = { X: 0, Y: 0 };

	while (elm)
    {
        pos.X += elm.offsetLeft;
        pos.Y += elm.offsetTop;
        elm = elm.offsetParent;
	}

    return pos;
}

/// <function container="Fit.Dom" name="GetInnerPosition" access="public" static="true" returns="object">
/// 	<description>
/// 		Get element position relative to a parent or ancestor.
/// 		Object returned contains an X and Y property with the desired integer values (pixels).
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get position for </param>
/// 	<param name="parent" type="DOMElement"> Parent or ancestor element to measure distance within </param>
/// </function>
Fit.Dom.GetInnerPosition = function(elm, parent)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectDomElement(parent);

	var x = elm.offsetLeft;
	var y = elm.offsetTop;

	while ((elm = elm.offsetParent) !== parent && elm !== null)
	{
		x += elm.offsetLeft;
		y += elm.offsetTop;
	}

	return { X: x, Y: y };
}

/// <function container="Fit.Dom" name="GetPosition" access="public" static="true" returns="object">
/// 	<description>
/// 		Get number of pixels specified element's container(s)
/// 		have been scrolled. This gives us the total scroll value
/// 		for nested scrollable elements.
/// 		Object returned contains an X and Y property with the desired integer values (pixels).
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get scroll position for </param>
/// </function>
Fit.Dom.GetScrollPosition = function(elm)
{
	Fit.Validation.ExpectDomElement(elm);

    // Get number of pixels specified element's container(s)
    // have been scrolled. This gives us the total scroll value
    // for nested scrollable elements which in combination with
    // X,Y mouse coordinates can be used to determine the mouse
    // position in the document rather than in the viewport:
    // scrollX = mouseXviewport + GetScrollPosition(elm).X;
    // scrollY = mouseYviewport + GetScrollPosition(elm).Y;

    var pos = { X: 0, Y: 0 };

	while (elm)
    {
        pos.X += elm.scrollLeft;
        pos.Y += elm.scrollTop;
        elm = elm.parentElement;
	}

    return pos;
}

// Internal members

Fit._internal.Dom = {};

Fit._internal.Dom.IsOffsetParentSupported = function()
{
	if (Fit._internal.Dom.OffsetParentSupported === undefined)
	{
		var parent = document.createElement("div");
		var child = document.createElement("div");

		parent.style.display = "none";

		Fit.Dom.Add(document.body, parent);
		Fit.Dom.Add(parent, child);

		Fit._internal.Dom.OffsetParentSupported = (child.offsetParent === null); // If supported, offsetParent should return Null (will return <body> on e.g. IE9-10)
	}

	return Fit._internal.Dom.OffsetParentSupported;
}
