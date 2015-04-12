/// <container name="Fit.Events">
/// 	Event handler functionality
/// </container>
Fit.Events = {};

/// <function container="Fit.Events" name="AddHandler" access="public" static="true">
/// 	<description> Registers handler for specified event on given DOMElement </description>
/// 	<param name="element" type="DOMElement"> DOMElement on to which event handler is registered </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="eventFunction" type="function"> JavaScript function to register </param>
/// </function>
Fit.Events.AddHandler = function(element, event, eventFunction)
{
	if (element.addEventListener) // W3C
		element.addEventListener(event, eventFunction, false); // false = event bubbling (reverse of event capturing)
	else if (element.attachEvent) // IE
		element.attachEvent("on" + event, eventFunction);

	// Fire event function for onload event if document in window/iframe has already been loaded.
	// Notice that no event argument is passed to function since we don't have one.
	if (event.toLowerCase() === "load" && element.document && element.document.readyState === "complete")
		eventFunction();
}

/// <function container="Fit.Events" name="RemoveHandler" access="public" static="true">
/// 	<description> Remove event handler for specified event on given DOMElement </description>
/// 	<param name="element" type="DOMElement"> DOMElement from which event handler is removed </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="eventFunction" type="function"> JavaScript function to remove </param>
/// </function>
Fit.Events.RemoveHandler = function(element, event, eventFunction)
{
	if (element.removeEventListener)
		element.removeEventListener(event, eventFunction, false);
	else if (element.detachEvent)
		element.detachEvent("on" + event, eventFunction);
}

Fit.Events.PreventDefault = function(e)
{
	var ev = e || window.event;

	if (ev.preventDefault)
		ev.preventDefault();
	ev.returnValue = false;
	return false;
}

Fit.Events.StopPropagation = function(e)
{
	var ev = e || window.event;

	if (ev.StopPropagation)
		ev.StopPropagation();
	ev.cancelBubble = true;
	return false;
}

Fit.Events.Stop = function(e)
{
	Fit.Events.PreventDefault(e);
	Fit.Events.StopPropagation(e);
	return false;
}

// **********************************************************************
// OnReady handling
// **********************************************************************

Fit._internal.OnReadyHandlers = [];

/// <function container="Fit.Events" name="OnReady" access="public" static="true">
/// 	<description> Registers OnReady handler which gets fired when document is ready, or if it is already ready </description>
/// 	<param name="callback" type="function"> JavaScript function to register </param>
/// </function>
Fit.Events.OnReady = function(callback)
{
	if (document.readyState === "complete")
	{
		callback();
	}
	else
	{
		Fit._internal.OnReadyHandlers.push(callback);
	}
}

Fit.Events.AddHandler(window, "load", function()
{
	Fit.Array.ForEach(Fit._internal.OnReadyHandlers, function(handler)
	{
		handler();
	});

	Fit.Array.Clear(Fit._internal.OnReadyHandlers);
});
