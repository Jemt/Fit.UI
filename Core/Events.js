/// <container name="Fit.Events">
/// 	Event handler functionality
/// </container>
Fit.Events = {};

/// <function container="Fit.Events" name="AddHandler" access="public" static="true">
/// 	<description> Registers handler for specified event on given EventTarget </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="eventFunction" type="function"> JavaScript function to register </param>
/// </function>
Fit.Events.AddHandler = function(element, event, eventFunction)
{
	Fit.Validation.ExpectEventTarget(element);
	Fit.Validation.ExpectStringValue(event);
	Fit.Validation.ExpectFunction(eventFunction);

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
/// 	<description> Remove event handler for specified event on given EventTarget </description>
/// 	<param name="element" type="DOMElement"> EventTarget (e.g. Window or DOMElement) from which event handler is removed </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="eventFunction" type="function"> JavaScript function to remove </param>
/// </function>
Fit.Events.RemoveHandler = function(element, event, eventFunction)
{
	Fit.Validation.ExpectEventTarget(element);
	Fit.Validation.ExpectStringValue(event);
	Fit.Validation.ExpectFunction(eventFunction);

	if (element.removeEventListener)
		element.removeEventListener(event, eventFunction, false);
	else if (element.detachEvent)
		element.detachEvent("on" + event, eventFunction);
}

/// <function container="Fit.Events" name="PreventDefault" access="public" static="true" returns="boolean">
/// 	<description> Prevent default behaviour triggered by given event - returns False </description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.PreventDefault = function(e)
{
	Fit.Validation.ExpectEvent(e, true);

	var ev = e || window.event;

	if (ev.preventDefault)
		ev.preventDefault();
	ev.returnValue = false;
	return false;
}

/// <function container="Fit.Events" name="StopPropagation" access="public" static="true" returns="boolean">
/// 	<description> Prevent given event from propagating (bubble up) - returns False </description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.StopPropagation = function(e)
{
	Fit.Validation.ExpectEvent(e, true);

	var ev = e || window.event;

	if (ev.StopPropagation)
		ev.StopPropagation();
	ev.cancelBubble = true;
	return false;
}

/// <function container="Fit.Events" name="Stop" access="public" static="true" returns="boolean">
/// 	<description>
/// 		Completely suppress event which is equivalent of
/// 		calling both PreventDefault(e) and StopPropagation(e).
/// 		Returns False.
/// 	</description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.Stop = function(e) // e not validated, done by PreventDefault(..) and StopPropagation(..)
{
	Fit.Events.PreventDefault(e);
	Fit.Events.StopPropagation(e);
	return false;
}

// **********************************************************************
// OnReady handling
// **********************************************************************

Fit._internal.Events = {};
Fit._internal.Events.OnReadyHandlers = [];

/// <function container="Fit.Events" name="OnReady" access="public" static="true">
/// 	<description> Registers OnReady handler which gets fired when document is ready, or if it is already ready </description>
/// 	<param name="callback" type="function"> JavaScript function to register </param>
/// </function>
Fit.Events.OnReady = function(callback)
{
	Fit.Validation.ExpectFunction(callback);

	if (document.readyState === "complete")
	{
		callback();
	}
	else
	{
		Fit._internal.Events.OnReadyHandlers.push(callback);
	}
}

Fit.Events.AddHandler(window, "load", function()
{
	Fit.Array.ForEach(Fit._internal.Events.OnReadyHandlers, function(handler)
	{
		handler();
	});

	Fit.Array.Clear(Fit._internal.Events.OnReadyHandlers);
});
