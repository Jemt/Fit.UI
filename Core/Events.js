Fit.Events = {};

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

Fit.Events.RemoveHandler = function(element, event, eventFunction)
{
	if (element.removeEventListener)
		element.removeEventListener(event, eventFunction, false);
	else if (element.detachEvent)
		element.detachEvent("on" + event, eventFunction);
}

// **********************************************************************
// OnReady handling
// **********************************************************************

Fit._internal.OnReadyHandlers = [];

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
