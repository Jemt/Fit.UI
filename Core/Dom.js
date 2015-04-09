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
/// 		An empty string may be returned if style has not been defined, or Null if style does not exist. </description>
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


// ==========================================================
// DOM
// ==========================================================

Fit.Dom.Attribute = function(elm, name, value)
{
	if (Fit.Validation.IsSet(value) === true)
	{
		Fit.Validation.ExpectString(value);
		elm.setAttribute(name, value);
	}

	return elm.getAttribute(name);
}

Fit.Dom.Data = function(elm, name, value)
{
	// Modern browsers can read data-attributes from elm.dataset.ATTRIBUTE.
	// Notice that data-title-value="XYZ" becomes elm.dataset.titleValue.

	// Performance:
	// If performance becomes vital, consider alternative storage:
	// http://jsperf.com/data-dataset
	// Perhaps something as simple as this will do: elm["_data" + name] = value;
	// However, be aware that it won't allow the use of data attributes in CSS,
	// e.g. content: attr(data-xyz).

	return Fit.Dom.Attribute(elm, "data-" + name, value);
}

/// <function container="Fit.Dom" name="GetDepth" access="public" static="true" returns="integer">
/// 	<description>
/// 		Get number of levels specified element is nested in DOM.
/// 		HTMLElement is at level 0, HTMLBodyElement is at level 1,
/// 		first element in BODYElement is at level 2, and so forth.
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get depth in DOM for </param>
/// </function>
Fit.Dom.GetDepth = function(elm)
{
    var i = 0;
    var parent = elm.parentElement;

    while (parent)
    {
        i++;
        parent = parent.parentElement;
    }

    return i;
}

/// <function container="Fit.Dom" name="Wrap" access="public" static="true">
/// 	<description> Wraps element in container element while preserving position in DOM </description>
/// 	<param name="elementToWrap" type="DOMElement"> Element to wrap </param>
/// 	<param name="container" type="DOMElement"> Container to wrap element within </param>
/// </function>
Fit.Dom.Wrap = function(elementToWrap, container)
{
	var parent = elementToWrap.parentNode;
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
/// 	Get element position.
/// 	Object returned contains an X and Y property with the desired integer values (pixels).
/// 	</description>
/// 	<param name="elm" type="DOMElement"> Element to get position for </param>
/// 	<param name="relativeToViewport" type="boolean" default="false">
/// 		Set False to get element position relative to viewport rather than to document which may exceed the viewport
/// 	</param>
/// </function>
Fit.Dom.GetPosition = function(elm, relativeToViewport)
{
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
