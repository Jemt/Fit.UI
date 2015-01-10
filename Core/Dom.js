Fit.Dom = {};

// CSS

Fit.Dom.AddClass = function(elm, cls)
{
	if (Fit.Dom.HasClass(elm, cls) === false)
		elm.className += ((elm.className !== "") ? " " : "") + cls;
}

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

Fit.Dom.GetComputedStyle = function(elm, style)
{
    if (window.getComputedStyle)
        return window.getComputedStyle(elm)[style];
    else if (elm.currentStyle)
        return elm.currentStyle[style];

    return null;
}

// Structure

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
