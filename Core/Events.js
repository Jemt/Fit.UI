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
/// <function container="Fit.Events" name="AddHandler" access="public" static="true">
/// 	<description> Registers handler for specified event on given EventTarget </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="useCapture" type="boolean">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="function"> JavaScript function to register </param>
/// </function>
Fit.Events.AddHandler = function()
{
	var element = null;
	var event = null;
	var useCapture = false; // false = event bubbling (reverse of event capturing)
	var eventFunction = null;

	if (arguments.length === 3)
	{
		element = arguments[0];
		event = arguments[1];
		eventFunction = arguments[2];
	}
	else if (arguments.length === 4)
	{
		element = arguments[0];
		event = arguments[1];
		useCapture = arguments[2];
		eventFunction = arguments[3];
	}

	Fit.Validation.ExpectEventTarget(element);
	Fit.Validation.ExpectStringValue(event);
	Fit.Validation.ExpectBoolean(useCapture);
	Fit.Validation.ExpectFunction(eventFunction);

	if (element.addEventListener) // W3C
		element.addEventListener(event, eventFunction, useCapture);
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
/// <function container="Fit.Events" name="RemoveHandler" access="public" static="true">
/// 	<description> Remove event handler for specified event on given EventTarget </description>
/// 	<param name="element" type="DOMElement"> EventTarget (e.g. Window or DOMElement) from which event handler is removed </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="useCapture" type="boolean">
/// 		Value indicating whether event handler was registered using event capturing (True) or event bubbling (False).
/// 	</param>
/// 	<param name="eventFunction" type="function"> JavaScript function to remove </param>
/// </function>
Fit.Events.RemoveHandler = function()
{
	var element = null;
	var event = null;
	var useCapture = false; // false = event bubbling (reverse of event capturing)
	var eventFunction = null;

	if (arguments.length === 3)
	{
		element = arguments[0];
		event = arguments[1];
		eventFunction = arguments[2];
	}
	else if (arguments.length === 4)
	{
		element = arguments[0];
		event = arguments[1];
		useCapture = arguments[2];
		eventFunction = arguments[3];
	}

	Fit.Validation.ExpectEventTarget(element);
	Fit.Validation.ExpectStringValue(event);
	Fit.Validation.ExpectBoolean(useCapture);
	Fit.Validation.ExpectFunction(eventFunction);

	if (element.removeEventListener)
		element.removeEventListener(event, eventFunction, useCapture);
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

	if ((ev.type === "click" || ev.type === "mousedown" || ev.type === "mouseup") && ev.button === 2) // Right click = suppress context menu
	{
		var preventContextMenu = Fit.Events.PreventDefault;

		Fit.Events.AddHandler(document, "contextmenu", true, preventContextMenu);
		Fit.Events.AddHandler(document, "contextmenu", preventContextMenu);

		setTimeout(function()
		{
			Fit.Events.RemoveHandler(document, "contextmenu", true, preventContextMenu);
			Fit.Events.RemoveHandler(document, "contextmenu", preventContextMenu);
		}, 0);
	}

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

/// <function container="Fit.Events" name="GetTarget" access="public" static="true" returns="DOMElement">
/// 	<description> Get a reference to the object that is affected by an event </description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.GetTarget = function(e)
{
	Fit.Validation.ExpectEvent(e, true);

	var ev = e || window.event;
	var target = ev.srcElement || ev.target;
	return (target ? target : null);
}

/// <function container="Fit.Events" name="GetEvent" access="public" static="true" returns="Event">
/// 	<description> Get event argument related to event just fired in a cross browser compatible manner </description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.GetEvent = function(e)
{
	Fit.Validation.ExpectEvent(e, true);
	return e || window.event;
}

/// <function container="Fit.Events" name="GetModifierKeys" access="public" static="true" returns="object">
/// 	<description>
/// 		Get object containing information about modifier keys currently being active.
/// 		Object contains the following properties which are True if the given key is being held down:
/// 		Shift, Ctrl, Alt, Meta (Cmd key on Mac OSX, Win key on Windows).
/// 	</description>
/// </function>
Fit.Events.GetModifierKeys = function()
{
	if (window.event && (window.event.type === "keypress" || window.event.type === "keydown" || window.event.type === "keyup")) // Make sure state is current on IE8 which does not support event capturing
	{
		Fit._internal.Events.KeysDown.Shift = window.event.shiftKey;
		Fit._internal.Events.KeysDown.Ctrl = window.event.ctrlKey;
		Fit._internal.Events.KeysDown.Alt = window.event.altKey;
		Fit._internal.Events.KeysDown.Meta = window.event.metaKey;
	}

	// Cloning to prevent external code from manipulating the object
	return Fit.Core.Clone(Fit._internal.Events.KeysDown);
}

/// <function container="Fit.Events" name="GetPointerState" access="public" static="true" returns="object">
/// 	<description>
/// 		Get object containing information about pointer.
/// 		Object contains the following properties:
/// 		Buttons.Primary/Secondary: Is True if given button is being held down
/// 		Coordinates.ViewPort.X/Y: Mouse coordinates within viewport
/// 		Coordinates.Document.X/Y: Mouse coordinates within document which may have been scrolled
/// 	</description>
/// </function>
Fit.Events.GetPointerState = function()
{
	if (window.event && (window.event.type === "click" || window.event.type === "mousedown" || window.event.type === "mouseup")) // Make sure state is current on IE8 which does not support event capturing
	{
		if ((Fit._internal.Events.Browser.Name === "MSIE" && Fit._internal.Events.Browser.Version === 8 && window.event.button === 1) || window.event.button === 0)
		{
			Fit._internal.Events.Mouse.Buttons.Primary = true;
			Fit._internal.Events.Mouse.Buttons.Secondary = false;
		}
		else if (window.event.button === 2)
		{
			Fit._internal.Events.Mouse.Buttons.Secondary = true;
			Fit._internal.Events.Mouse.Buttons.Primary = false;
		}
	}

	// Cloning to prevent external code from manipulating the object
	return Fit.Core.Clone(Fit._internal.Events.Mouse);
}

// ==============================================
// Internals
// ==============================================

Fit._internal.Events = {};
Fit._internal.Events.Browser = Fit.Browser.GetInfo();
Fit._internal.Events.KeysDown = { Shift: false, Ctrl: false, Alt: false, Meta: false };
Fit._internal.Events.Mouse = { Buttons: { Primary: false, Secondary: false }, Coordinates: { ViewPort: { X: -1, Y: -1 }, Document: { X: -1, Y: -1 } } };
Fit._internal.Events.OnReadyHandlers = [];

// ==============================================
// Keyboard tracking
// ==============================================

// Using event capturing to make sure event is registered before target is reached.
// This is not supported by MSIE 8, but we solve this by updating the state when
// Fit.Events.GetModifierKeys() is invoked.

Fit.Events.AddHandler(document, "keydown", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	Fit._internal.Events.KeysDown.Shift = ev.shiftKey;
	Fit._internal.Events.KeysDown.Ctrl = ev.ctrlKey;
	Fit._internal.Events.KeysDown.Alt = ev.altKey;
	Fit._internal.Events.KeysDown.Meta = ev.metaKey;
});
Fit.Events.AddHandler(document, "keyup", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	Fit._internal.Events.KeysDown.Shift = ev.shiftKey;
	Fit._internal.Events.KeysDown.Ctrl = ev.ctrlKey;
	Fit._internal.Events.KeysDown.Alt = ev.altKey;
	Fit._internal.Events.KeysDown.Meta = ev.metaKey;
});

// ==============================================
// Mouse tracking
// ==============================================

// Using event capturing to make sure event is registered before target is reached.
// This is not supported by MSIE 8, but we solve this by updating the state when
// Fit.Events.GetPointerState() is invoked.

// Notice that MouseUp is not fired when using the secondary mouse button (right click)
// if context menu is not suppressed. Therefore we always assume the secondary button
// is released when MouseDown or MouseUp is fired.
// And for consistency, we do the same for the primary button.
// Therefore, the primary and secondary buttons are never considered pressed or held down
// simultaneously.

// http://www.quirksmode.org/js/events_properties.html

Fit.Events.AddHandler(document, "mousedown", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	if ((Fit._internal.Events.Browser.Name === "MSIE" && Fit._internal.Events.Browser.Version === 8 && ev.button === 1) || ev.button === 0)
	{
		Fit._internal.Events.Mouse.Buttons.Primary = true;
		Fit._internal.Events.Mouse.Buttons.Secondary = false;
	}
	else if (ev.button === 2)
	{
		Fit._internal.Events.Mouse.Buttons.Secondary = true;
		Fit._internal.Events.Mouse.Buttons.Primary = false;
	}
});
Fit.Events.AddHandler(document, "mouseup", true, function(e)
{
	Fit._internal.Events.Mouse.Buttons.Primary = false;
	Fit._internal.Events.Mouse.Buttons.Secondary = false;
});
Fit.Events.AddHandler(document, "mouseout", true, function(e)
{
	Fit._internal.Events.Mouse.Buttons.Primary = false;
	Fit._internal.Events.Mouse.Buttons.Secondary = false;
});
Fit.Events.AddHandler(document, "mousemove", function(e)
{
	var ev = Fit.Events.GetEvent(e);

	if (document.body === null) // Not ready yet
		return;

	// Notice: Browser vendors are changing the way coordinates
	// and dimensions are reported. W3C previously define these as
	// integers/longs, but browsers are moving to floats for smoother
	// animation and scrolling, and for more accurate positioning.
	// https://code.google.com/p/chromium/issues/detail?id=323935
	// For consistency we use Math.floor to make sure integers are
	// always returned on both modern and legacy browsers.

	// Mouse position in viewport
	Fit._internal.Events.Mouse.Coordinates.ViewPort.X = Math.floor(ev.clientX);
	Fit._internal.Events.Mouse.Coordinates.ViewPort.Y = Math.floor(ev.clientY);

	// Mouse position in document which may have been scrolled
	var scrollPos = Fit.Dom.GetScrollPosition(document.body); // Object with integer values returned
	Fit._internal.Events.Mouse.Coordinates.Document.X = Fit._internal.Events.Mouse.Coordinates.ViewPort.X + scrollPos.X;
	Fit._internal.Events.Mouse.Coordinates.Document.Y = Fit._internal.Events.Mouse.Coordinates.ViewPort.Y + scrollPos.Y;
});

// ==============================================
// Simple mutation tracking
// ==============================================

// This is a very simple substitution for native mutation observers,
// which unfortunately requires recent versions of some of the major
// browsers (e.g. IE 11, Safari 6 and Chrome on Android 4.4).

Fit._internal.Events.MutationObservers = [];
Fit._internal.Events.MutationObserverIds = -1;
Fit._internal.Events.MutationObserverIntervalId = -1;

/// <function container="Fit.Events" name="AddMutationObserver" access="public" static="true">
/// 	<description>
/// 		Registers mutation observer which is invoked when a DOMElement is updated. By default
/// 		only attributes are observed. Use deep flag to have children and character data observed too.
/// 		Important: Mutation observers should be removed when no longer needed for better performance!
/// 		To remove an observer from within the observer function itself, simply call disconnect().
/// 	</description>
/// 	<param name="elm" type="DOMElement"> DOMElement to observe </param>
/// 	<param name="obs" type="function"> JavaScript observer function to register - receives reference to DOMElement being observed when updated </param>
/// 	<param name="deep" type="boolean" default="false"> Flag indicating whether to check for modifications within element (children and character data) - this could potentially be expensive </param>
/// </function>
Fit.Events.AddMutationObserver = function(elm, obs, deep)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectFunction(obs);
	Fit.Validation.ExpectBoolean(deep, true);

	// Configure event handlers responsible for triggering mutation check

	if (Fit._internal.Events.MutationObservers.length === 0)
	{
		Fit.Events.AddHandler(document, "click", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "mousedown", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "mouseup", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "keypress", Fit._internal.Events.CheckMutations); // Not using keydown, it fires continuously
		Fit.Events.AddHandler(document, "keyup", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "touchstart", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "touchend", Fit._internal.Events.CheckMutations);
		Fit.Events.AddHandler(document, "touchcancel", Fit._internal.Events.CheckMutations);
		Fit._internal.Events.MutationObserverIntervalId = setInterval(Fit._internal.Events.CheckMutations, 1000);
	}

	// Add mutation observer

	var hashCode = 0;
	var dimensions = elm.offsetWidth + "x" + elm.offsetHeight;

	if (deep === true)
	{
		hashCode = Fit.String.Hash(elm.outerHTML + dimensions);
	}
	else
	{
		var clone = elm.cloneNode(false);
		hashCode = Fit.String.Hash(clone.outerHTML + dimensions)
	}

	Fit._internal.Events.MutationObserverIds++;
	Fit.Array.Add(Fit._internal.Events.MutationObservers, { Element: elm, Observer: obs, Hash: hashCode, Deep: (deep === true), Id: Fit._internal.Events.MutationObserverIds });

	return Fit._internal.Events.MutationObserverIds;
}

/// <function container="Fit.Events" name="RemoveMutationObserver" access="public" static="true">
/// 	<description> Remove mutation observer </description>
/// 	<param name="elm" type="DOMElement"> DOMElement being observed </param>
/// 	<param name="obs" type="function"> JavaScript observer function to remove </param>
/// 	<param name="deep" type="boolean" default="undefined"> If defined, observer must have been registered with the same deep value to be removed </param>
/// </function>
/// <function container="Fit.Events" name="RemoveMutationObserver" access="public" static="true">
/// 	<description> Remove mutation observer by ID </description>
/// 	<param name="id" type="integer"> Observer ID returned from AddMutationObserver(..) function </param>
/// </function>
Fit.Events.RemoveMutationObserver = function()
{
	var elm, obs, deep, id = undefined;

	if (arguments.length > 1)
	{
		elm = arguments[0];
		obs = arguments[1];
		deep = arguments[2];

		Fit.Validation.ExpectDomElement(elm);
		Fit.Validation.ExpectFunction(obs);
		Fit.Validation.ExpectBoolean(deep, true);
	}
	else
	{
		id = arguments[0];

		Fit.Validation.ExpectInteger(id);
	}

	Fit.Array.ForEach(Fit._internal.Events.MutationObservers, function(mo)
	{
		if ((Fit.Validation.IsSet(id) === true && mo.Id === id) || (mo.Element === elm && mo.Observer === obs && mo.Deep === ((Fit.Validation.IsSet(deep) === true) ? deep : false)))
		{
			Fit.Array.Remove(Fit._internal.Events.MutationObservers, mo);
			return false; // Break loop
		}
	});

	// Remove event handlers if all mutation observers have been removed

	if (Fit._internal.Events.MutationObservers.length === 0)
	{
		Fit.Events.RemoveHandler(document, "click", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "mousedown", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "mouseup", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "keypress", Fit._internal.Events.CheckMutations); // Not using keydown, it fires continuously
		Fit.Events.RemoveHandler(document, "keyup", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "touchstart", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "touchend", Fit._internal.Events.CheckMutations);
		Fit.Events.RemoveHandler(document, "touchcancel", Fit._internal.Events.CheckMutations);
		clearInterval(Fit._internal.Events.MutationObserverIntervalId);
	}
}

Fit._internal.Events.CheckMutations = function()
{
	var toRemove = [];

	Fit.Array.ForEach(Fit._internal.Events.MutationObservers, function(mo)
	{
		var newHash = 0;
		var dimensions = mo.Element.offsetWidth + "x" + mo.Element.offsetHeight;

		if (mo.Deep === true)
		{
			newHash = Fit.String.Hash(mo.Element.outerHTML + dimensions);
		}
		else
		{
			var clone = mo.Element.cloneNode(false);
			newHash = Fit.String.Hash(clone.outerHTML + dimensions)
		}

		if (mo.Hash !== newHash)
		{
			// Element has mutated

			mo.Hash = newHash;

			// Create global disconnect function allowing observer to remove itself by simply invoking disconnect()

			var orgDisconnect = window.disconnect;
			window.disconnect = function() { Fit.Array.Add(toRemove, mo); };

			// Call observer

			var error = null;

			try
			{
				mo.Observer(mo.Element);
			}
			catch (err)
			{
				error = err;
			}

			// Remove global disconnect function

			if (orgDisconnect)
			{
				window.disconnect = orgDisconnect;
			}
			else
			{
				try
				{
					delete window.disconnect; // Fails in IE8 with "Object doesn't support this action"
				}
				catch (err)
				{
					window.disconnect = undefined;
				}
			}

			// Re-throw error if observer failed

			if (error !== null)
				Fit.Validation.Throw(error);
		}
	});

	Fit.Array.ForEach(toRemove, function(mo)
	{
		Fit.Events.RemoveMutationObserver(mo.Element, mo.Observer, mo.Deep);
	});
}

// ==============================================
// OnReady handling
// ==============================================

/// <function container="Fit.Events" name="OnReady" access="public" static="true">
/// 	<description> Registers OnReady handler which gets fired when document is ready, or if it is already ready </description>
/// 	<param name="callback" type="function"> JavaScript function to register </param>
/// </function>
Fit.Events.OnReady = function(callback)
{
	Fit.Validation.ExpectFunction(callback);

	if (Fit._internal.Events.OnReadyFired === true)
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
	Fit._internal.Events.OnReadyFired = true;

	Fit.Array.ForEach(Fit._internal.Events.OnReadyHandlers, function(handler)
	{
		handler();
	});

	Fit.Array.Clear(Fit._internal.Events.OnReadyHandlers);
});
