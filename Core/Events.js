/// <container name="Fit.Events">
/// 	Event handler functionality
/// </container>
Fit.Events = {};

// See TypeScript's GlobalEventHandlersEventMap (lib.dom.d.ts) which reveals how named events map to event types.

/// <function container="Fit.EventsTypeDefs" name="EventHandlerCallbackKeyboard" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddHandler(..) </description>
/// 	<param name="e" type="KeyboardEvent"> Event argument </param>
/// </function>

/// <function container="Fit.EventsTypeDefs" name="EventHandlerCallbackMouse" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddHandler(..) </description>
/// 	<param name="e" type="MouseEvent"> Event argument </param>
/// </function>

/// <function container="Fit.EventsTypeDefs" name="EventHandlerCallbackPopState" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddHandler(..) </description>
/// 	<param name="e" type="PopStateEvent"> Event argument </param>
/// </function>

/// <function container="Fit.EventsTypeDefs" name="EventHandlerCallbackHashChange" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddHandler(..) </description>
/// 	<param name="e" type="HashChangeEvent"> Event argument </param>
/// </function>

/// <function container="Fit.EventsTypeDefs" name="EventHandlerCallbackFocus" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddHandler(..) </description>
/// 	<param name="e" type="FocusEvent"> Event argument </param>
/// </function>

/// <function container="Fit.EventsTypeDefs" name="EventHandlerCallbackBeforeUnload" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddHandler(..) </description>
/// 	<param name="e" type="BeforeUnloadEvent"> Event argument </param>
/// </function>

/// <function container="Fit.EventsTypeDefs" name="EventHandlerCallbackClipboard" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddHandler(..) </description>
/// 	<param name="e" type="ClipboardEvent"> Event argument </param>
/// </function>

/// <function container="Fit.EventsTypeDefs" name="EventHandlerCallbackStorage" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddHandler(..) </description>
/// 	<param name="e" type="StorageEvent"> Event argument </param>
/// </function>

/// <function container="Fit.EventsTypeDefs" name="EventHandlerCallbackRooted" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddHandler(..) </description>
/// 	<param name="dom" type="DOMElement"> DOM element </param>
/// </function>

/// <function container="Fit.EventsTypeDefs" name="EventHandlerCallbackGeneric" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddHandler(..) </description>
/// 	<param name="e" type="Event"> Event argument </param>
/// </function>

/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"keydown" | "keyup" | "keypress"'> Event name without the 'on' prefix </param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackKeyboard"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "mousewheel"'> Event name without the 'on' prefix </param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackMouse"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"popstate"'> Event name without the 'on' prefix </param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackPopState"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"hashchange"'> Event name without the 'on' prefix </param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackHashChange"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"focus" | "focusin" | "focusout" | "blur"'> Event name without the 'on' prefix </param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackFocus"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"beforeunload"'> Event name without the 'on' prefix </param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackBeforeUnload"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"cut" | "copy" | "paste"'> Event name without the 'on' prefix </param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackClipboard"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"storage"'> Event name without the 'on' prefix </param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackStorage"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given DOMElement and returns Event ID </description>
/// 	<param name="element" type="DOMElement"> DOM element on to which event handler is registered </param>
/// 	<param name="event" type='"#rooted"'> Event name </param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackRooted"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type="string"> Event name without the 'on' prefix </param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackGeneric"> JavaScript function to register </param>
/// </function>
//  ------------------------------------------------------------------------------------------
//  Overloads with useCapture or options argument
//  ------------------------------------------------------------------------------------------
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"keydown" | "keyup" | "keypress"'> Event name without the 'on' prefix </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		Alternatively pass options object to control behaviour on a more fine-grained scale.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackKeyboard"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "mousewheel"'> Event name without the 'on' prefix </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		Alternatively pass options object to control behaviour on a more fine-grained scale.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackMouse"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"popstate"'> Event name without the 'on' prefix </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		Alternatively pass options object to control behaviour on a more fine-grained scale.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackPopState"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"hashchange"'> Event name without the 'on' prefix </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		Alternatively pass options object to control behaviour on a more fine-grained scale.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackHashChange"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"focus" | "focusin" | "focusout" | "blur"'> Event name without the 'on' prefix </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		Alternatively pass options object to control behaviour on a more fine-grained scale.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackFocus"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"beforeunload"'> Event name without the 'on' prefix </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		Alternatively pass options object to control behaviour on a more fine-grained scale.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackBeforeUnload"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"cut" | "copy" | "paste"'> Event name without the 'on' prefix </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		Alternatively pass options object to control behaviour on a more fine-grained scale.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackClipboard"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type='"storage"'> Event name without the 'on' prefix </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		Alternatively pass options object to control behaviour on a more fine-grained scale.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackStorage"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given DOMElement and returns Event ID </description>
/// 	<param name="element" type="DOMElement"> DOM element on to which event handler is registered </param>
/// 	<param name="event" type='"#rooted"'> Event name </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		This argument is ignored for the specialized #rooted event.
/// 	</param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackRooted"> JavaScript function to register </param>
/// </function>
/// <function container="Fit.Events" name="AddHandler" access="public" static="true" returns="integer">
/// 	<description> Registers handler for specified event on given EventTarget and returns Event ID </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) on to which event handler is registered </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
/// 		Alternatively pass options object to control behaviour on a more fine-grained scale.
/// 		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
/// 	</param>
/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackGeneric"> JavaScript function to register </param>
/// </function>
Fit.Events.AddHandler = function()
{
	var element = null;
	var event = null;
	var useCaptureOrOptions = false; // false = event bubbling (reverse of event capturing)
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
		useCaptureOrOptions = arguments[2];
		eventFunction = arguments[3];
	}

	Fit.Validation.ExpectEventTarget(element);
	Fit.Validation.ExpectStringValue(event);
	Fit.Validation.ExpectBoolean(typeof(useCaptureOrOptions) !== "object" ? useCaptureOrOptions : true);
	Fit.Validation.ExpectBoolean(useCaptureOrOptions && useCaptureOrOptions.Capture || true);
	Fit.Validation.ExpectBoolean(useCaptureOrOptions && useCaptureOrOptions.Once || true);
	Fit.Validation.ExpectBoolean(useCaptureOrOptions && useCaptureOrOptions.Passive || true);
	Fit.Validation.ExpectFunction(eventFunction);

	if (event.toLowerCase() === "#rooted") // Custom event
	{
		if (useCaptureOrOptions)
			Fit.Validation.ThrowError("Event capturing or event options not supported for Rooted event");

		Fit.Array.Add(Fit._internal.Events.OnRootedHandlers, { Element: element, Parent: element.parentElement, Event: event, Callback: eventFunction });
	}
	else if (element.addEventListener) // W3C
	{
		var options = false;

		if (useCaptureOrOptions === true)
		{
			options = true;
		}
		else if (useCaptureOrOptions)
		{
			options = {};

			if (useCaptureOrOptions.Capture !== undefined)
			{
				options.capture = useCaptureOrOptions.Capture;
			}
			if (useCaptureOrOptions.Once !== undefined)
			{
				options.once = useCaptureOrOptions.Once;
			}
			if (useCaptureOrOptions.Passive !== undefined)
			{
				options.passive = useCaptureOrOptions.Passive;
			}
		}

		element.addEventListener(event, eventFunction, options);
	}
	else if (element.attachEvent) // IE
	{
		if (event.toLowerCase() === "domcontentloaded" && Fit._internal.Events.Browser.Name === "MSIE" && Fit._internal.Events.Browser.Version === 8)
		{
			// DOMContentLoaded not supported on IE8.
			// Using OnReadyStateChange to achieve similar behaviour.

			element.attachEvent("onreadystatechange", function(e)
			{
				if (element.readyState === "complete")
				{
					eventFunction(e); // NOTICE: Event argument not identical to argument passed to modern browsers using the real DOMContentLoaded event!
				}
			});
		}
		else
		{
			element.attachEvent("on" + event, eventFunction);
		}
	}

	element._internal = element._internal || {};
	element._internal.Events = element._internal.Events || { Handlers: [] };

	var eventId = element._internal.Events.Handlers.length;

	Fit.Array.Add(element._internal.Events.Handlers, { Event: event, Handler: eventFunction, UseCaptureOrOptions: useCaptureOrOptions, Id: eventId });

	// Fire event function for onload event if document in window/iframe has already been loaded.
	// Notice that no event argument is passed to function since we don't have one.
	// BE AWARE that contentDocument is replaced when loading another document (URL) within a frame!
	// Do not register onload on iFrame.contentDocument prior to starting loading content - it will never fire.
	// Instead register OnLoad on contentDocument afterwards, or register OnLoad on the iFrame element. The latter
	// will always fire, every time the document is replaced (URL changed / navigation occur).
	// Also be aware that a frame without a src attribute will always be considered loaded (readyState === "complete")
	// because it already has a contentDocument ready to be used. Therefore we only immediately fire onload for a
	// frame that has readyState "complete" IF it also has a src attribute set. If no src attribute is set, we
	// assume it will be set later, in which case the onload event will fire normally. It simply doesn't make sense to
	// register an OnLoad handler for a frame that is dynamically populated (which has no src attribute) - it will always be ready ("complete").
	if (event.toLowerCase() === "load" && element.nodeType === 9 && element.readyState === "complete") // Element is a Document (window.document or iframe.contentDocument)
	{
		eventFunction();
	}
	else if (event.toLowerCase() === "load" && (typeof(element.contentDocument) === "object" && element.contentDocument !== null) && element.src && element.contentDocument.readyState === "complete") // Element is an iFrame
	{
		// MSIE 8 requires use of typeof(element.contentDocument) - accessing element.contentDocument without typeof results in an "unspecified error" if
		// the iFrame is not rooted in DOM. This has been fixed in MSIE 9 where contentDocument on the other hand remains Null until rooted in DOM.

		eventFunction();
	}
	else if (event.toLowerCase() === "load" && element === window && Fit._internal.Events.OnReadyFired === true) // Element is the current Window instance
	{
		eventFunction();
	}

	return eventId;
}

/// <function container="Fit.Events" name="RemoveHandler" access="public" static="true">
/// 	<description> Remove event handler given by Event ID returned from Fit.Events.AddHandler(..) </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) from which event handler is removed </param>
/// 	<param name="eventId" type="integer"> Event ID identifying handler to remove </param>
/// </function>
/// <function container="Fit.Events" name="RemoveHandler" access="public" static="true">
/// 	<description> Remove event handler for specified event on given EventTarget </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) from which event handler is removed </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="eventFunction" type="function"> JavaScript function to remove </param>
/// </function>
/// <function container="Fit.Events" name="RemoveHandler" access="public" static="true">
/// 	<description> Remove event handler for specified event on given EventTarget </description>
/// 	<param name="element" type="EventTarget"> EventTarget (e.g. Window or DOMElement) from which event handler is removed </param>
/// 	<param name="event" type="string"> Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.) </param>
/// 	<param name="useCaptureOrOptions" type="boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }">
/// 		Value indicating whether event handler was registered using event capturing (True) or event bubbling (False).
/// 		If event handler was registered with event options for more fine-grained control, these options are passed instead.
/// 	</param>
/// 	<param name="eventFunction" type="function"> JavaScript function to remove </param>
/// </function>
Fit.Events.RemoveHandler = function()
{
	var element = null;
	var event = null;
	var useCaptureOrOptions = false; // false = event bubbling (reverse of event capturing)
	var eventFunction = null;

	if (arguments.length === 2)
	{
		Fit.Validation.ExpectEventTarget(arguments[0]);
		Fit.Validation.ExpectInteger(arguments[1]);

		element = arguments[0];

		var handler = ((element._internal && element._internal.Events && element._internal.Events.Handlers) ? element._internal.Events.Handlers[arguments[1]] : undefined);

		if (handler === undefined)
			Fit.Validation.Throw("No event handler with ID '" + arguments[0] + "' exists for this element");

		if (handler === null)
			return; // Already removed

		event = handler.Event;
		eventFunction = handler.Handler;
		useCaptureOrOptions = handler.UseCaptureOrOptions;
	}
	else if (arguments.length === 3)
	{
		element = arguments[0];
		event = arguments[1];
		eventFunction = arguments[2];
	}
	else if (arguments.length === 4)
	{
		element = arguments[0];
		event = arguments[1];
		useCaptureOrOptions = arguments[2];
		eventFunction = arguments[3];
	}

	Fit.Validation.ExpectEventTarget(element);
	Fit.Validation.ExpectStringValue(event);
	Fit.Validation.ExpectBoolean(typeof(useCaptureOrOptions) !== "object" ? useCaptureOrOptions : true);
	Fit.Validation.ExpectBoolean(useCaptureOrOptions && useCaptureOrOptions.Capture || true);
	Fit.Validation.ExpectBoolean(useCaptureOrOptions && useCaptureOrOptions.Once || true);
	Fit.Validation.ExpectBoolean(useCaptureOrOptions && useCaptureOrOptions.Passive || true);
	Fit.Validation.ExpectFunction(eventFunction);

	if (event.toLowerCase() === "#rooted")
	{
		var handlers = Fit._internal.Events.OnRootedHandlers;

		Fit.Array.ForEach(handlers, function(handler)
		{
			if (element === handler.Element && event.toLowerCase() === handler.Event.toLowerCase() && eventFunction === handler.Callback && useCaptureOrOptions === false)
			{
				handler.Removed = true; // Allow OnRooted handler to remove element without causing a "Collection was modified" exception - properly removed in timer responsible for observing elements
				return false; // Break loop
			}
		});
	}
	else if (element.removeEventListener)
	{
		// Notice regarding useCaptureOrOptions:
		// Only the capture flag is used when removing event handlers.
		// This can be either a boolean or an object like this: { capture: true|false }.
		// Other flags are not considered - or at least should not have been. But unfortunately
		// some browser versions are known to be byggy in this regard.
		// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
		// "It's worth noting that some browser releases have been inconsistent on this, and
		//  unless you have specific reasons otherwise, it's probably wise to use the same values
		//  used for the call to addEventListener() when calling removeEventListener()".
		// Nothing in the documentation states that the same object reference must be used.
		// In fact it states "it's probably wise to use the same VALUES ..." in the quote above.
		// This has been verified using unit tests on various browsers (see Tests/Core/Events.js).

		var options = false;

		if (useCaptureOrOptions === true)
		{
			options = true;
		}
		else if (useCaptureOrOptions)
		{
			options = {};

			if (useCaptureOrOptions.Capture !== undefined)
			{
				options.capture = useCaptureOrOptions.Capture;
			}
			if (useCaptureOrOptions.Once !== undefined)
			{
				options.once = useCaptureOrOptions.Once;
			}
			if (useCaptureOrOptions.Passive !== undefined)
			{
				options.passive = useCaptureOrOptions.Passive;
			}
		}

		element.removeEventListener(event, eventFunction, options);
	}
	else if (element.detachEvent)
	{
		element.detachEvent("on" + event, eventFunction);
	}

	if (arguments.length === 2)
	{
		element._internal.Events.Handlers[arguments[1]] = null;
	}
	else
	{
		for (var i = 0 ; i < element._internal.Events.Handlers.length ; i++)
		{
			var handler = element._internal.Events.Handlers[i];

			if (handler !== null && event.toLowerCase() === handler.Event.toLowerCase() && eventFunction === handler.Handler && Fit.Core.IsEqual(useCaptureOrOptions, handler.UseCaptureOrOptions) === true)
			{
				element._internal.Events.Handlers[i] = null;
				break;
			}
		}
	}
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

	if (ev.stopPropagation)
		ev.stopPropagation();
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
	return (target ? target : null); // Should never return null
}

/// <function container="Fit.Events" name="GetRelatedTarget" access="public" static="true" returns="DOMElement | null">
/// 	<description>
/// 		Get a reference to the secondary object related to an event - e.g. the element losing
/// 		focus in a focus event handler. Returns Null if there is no related event object, or if
/// 		not supported by the browser.
/// 	</description>
/// 	<param name="e" type="Event" default="undefined"> Event argument </param>
/// </function>
Fit.Events.GetRelatedTarget = function(e)
{
	Fit.Validation.ExpectEvent(e, true);

	var ev = e || window.event;
	return ev.relatedTarget || null;
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

/// <container name="Fit.EventTypeDefs.ModifierKeys">
/// 	<description> Modifier keys </description>
/// 	<member name="Shift" type="boolean"> True if Shift key is being held down, otherwise False </member>
/// 	<member name="Ctrl" type="boolean"> True if Ctrl key is being held down, otherwise False </member>
/// 	<member name="Alt" type="boolean"> True if Alt key is being held down, otherwise False </member>
/// 	<member name="Meta" type="boolean"> True if Meta key (Windows key on a PC, Cmd key on a Mac) is being held down, otherwise False </member>
/// 	<member name="KeyUp" type="integer"> Key code if key is released, otherwise -1 </member>
/// 	<member name="KeyDown" type="integer"> Key code if key is pressed, otherwise -1 </member>
/// </container>

/// <function container="Fit.Events" name="GetModifierKeys" access="public" static="true" returns="Fit.EventTypeDefs.ModifierKeys">
/// 	<description>
/// 		Get object containing information about modifier keys currently being active.
/// 	</description>
/// </function>
Fit.Events.GetModifierKeys = function()
{
	if (window.event && (window.event.type === "keypress" || window.event.type === "keydown" || window.event.type === "keyup")) // Make sure state is current on IE8 which does not support event capturing
	{
		Fit._internal.Events.KeysDown.Shift = window.event.shiftKey === true;
		Fit._internal.Events.KeysDown.Ctrl = window.event.ctrlKey === true;
		Fit._internal.Events.KeysDown.Alt = window.event.altKey === true;
		Fit._internal.Events.KeysDown.Meta = window.event.metaKey === true;
		Fit._internal.Events.KeysDown.KeyUp = window.event.type === "keyup" ? window.event.keyCode : -1;
		Fit._internal.Events.KeysDown.KeyDown = window.event.type === "keypress" || window.event.type === "keydown" ? window.event.keyCode : -1;
	}

	// Cloning to prevent external code from manipulating the object
	return Fit.Core.Clone(Fit._internal.Events.KeysDown);
}

/// <container name="Fit.EventTypeDefs.PointerState">
/// 	<description> Pointer state </description>
/// 	<member name="Buttons" type="{ Primary: boolean, Secondary: boolean, Touch: boolean }"> Pointer buttons currently activated </member>
/// 	<member name="Coordinates" type="{ ViewPort: Fit.TypeDefs.Position, Document: Fit.TypeDefs.Position }"> Pointer position within viewport and document, which might have been scrolled </member>
/// 	<member name="Target" type="DOMElement | null"> Pointer target </member>
/// </container>

/// <function container="Fit.Events" name="GetPointerState" access="public" static="true" returns="Fit.EventTypeDefs.PointerState">
/// 	<description>
/// 		Get object containing information about pointer.
/// 		Object contains the following properties:
/// 		Target: Is the DOMElement affected by click/touch.
/// 		Buttons.Primary/Secondary: Is True if given button is being held down.
/// 		Coordinates.ViewPort.X/Y: Mouse coordinates within viewport.
/// 		Coordinates.Document.X/Y: Mouse coordinates within document which might have been scrolled.
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

	var target = Fit._internal.Events.Mouse.Target;
	Fit._internal.Events.Mouse.Target = null; // It is not possible to clone DOMElements with Fit.Core.Clone

	var obj = Fit.Core.Clone(Fit._internal.Events.Mouse);

	obj.Target = target;
	Fit._internal.Events.Mouse.Target = target;

	return obj;
}

// ==============================================
// Internals
// ==============================================

Fit._internal.Events = {};
Fit._internal.Events.Browser = Fit.Browser.GetInfo();
Fit._internal.Events.KeysDown = { Shift: false, Ctrl: false, Alt: false, Meta: false, KeyDown: -1, KeyUp: -1 };
Fit._internal.Events.Mouse = { Buttons: { Primary: false, Secondary: false, Touch: false }, Coordinates: { ViewPort: { X: -1, Y: -1 }, Document: { X: -1, Y: -1 } }, Target: null };
Fit._internal.Events.OnReadyHandlers = [];
Fit._internal.Events.OnDomReadyHandlers = [];
Fit._internal.Events.OnRootedHandlers = [];

// ==============================================
// Observing DOM rooting
// ==============================================

setInterval(function()
{
	var remove = [];

	Fit.Array.ForEach(Fit._internal.Events.OnRootedHandlers, function(handler)
	{
		if (handler.Removed === true)
		{
			Fit.Array.Add(remove, handler);
			return; // Skip to next
		}

		if (Fit.Dom.IsRooted(handler.Element) === true && handler.Parent !== handler.Element.parentElement)
		{
			// Element was rooted or moved to another parent

			handler.Parent = handler.Element.parentElement;
			handler.Callback(handler.Element);
		}
	});

	Fit.Array.ForEach(remove, function(handler)
	{
		Fit.Array.Remove(Fit._internal.Events.OnRootedHandlers, handler);
	});

}, 100);

// ==============================================
// Keyboard tracking
// ==============================================

// Using event capturing to make sure event is registered before target is reached.
// This is not supported by MSIE 8, but we solve this by updating the state when
// Fit.Events.GetModifierKeys() is invoked.

Fit.Events.AddHandler(document, "keydown", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	Fit._internal.Events.KeysDown.Shift = ev.shiftKey === true;
	Fit._internal.Events.KeysDown.Ctrl = ev.ctrlKey === true;
	Fit._internal.Events.KeysDown.Alt = ev.altKey === true;
	Fit._internal.Events.KeysDown.Meta = ev.metaKey === true;
	Fit._internal.Events.KeysDown.KeyUp = -1;
	Fit._internal.Events.KeysDown.KeyDown = ev.keyCode;
});
Fit.Events.AddHandler(document, "keyup", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	Fit._internal.Events.KeysDown.Shift = ev.shiftKey === true;
	Fit._internal.Events.KeysDown.Ctrl = ev.ctrlKey === true;
	Fit._internal.Events.KeysDown.Alt = ev.altKey === true;
	Fit._internal.Events.KeysDown.Meta = ev.metaKey === true;
	Fit._internal.Events.KeysDown.KeyUp = ev.keyCode;
	Fit._internal.Events.KeysDown.KeyDown = -1;
});

// ==============================================
// Mouse and touch tracking
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

	Fit._internal.Events.Mouse.Target = Fit.Events.GetTarget(ev);
});
Fit.Events.AddHandler(document, "mouseup", true, function(e)
{
	setTimeout(function()
	{
		// OnContextMenu event usually fires before MouseUp, but on Firefox it fires after, so the
		// button states are preserved a little longer to make them accessible to OnContextMenu handlers on Firefox.
		Fit._internal.Events.Mouse.Buttons.Primary = false;
		Fit._internal.Events.Mouse.Buttons.Secondary = false;

		// OnClick event might fire after MouseUp (if mouse was not moved away from element on which
		// MouseDown fired), so keep Target a little longer to make it accessible to OnClick handlers.
		Fit._internal.Events.Mouse.Target = null;
	}, 0);
});
Fit.Events.AddHandler(document, "mouseout", true, function(e)
{
	Fit._internal.Events.Mouse.Buttons.Primary = false;
	Fit._internal.Events.Mouse.Buttons.Secondary = false;
	Fit._internal.Events.Mouse.Target = null;
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
Fit.Events.AddHandler(document, "touchstart", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	Fit._internal.Events.Mouse.Buttons.Touch = true;

	// Touch position in viewport
	Fit._internal.Events.Mouse.Coordinates.ViewPort.X = Math.floor(ev.touches[0].clientX);
	Fit._internal.Events.Mouse.Coordinates.ViewPort.Y = Math.floor(ev.touches[0].clientY);

	// Touch position in document which may have been scrolled
	var scrollPos = Fit.Dom.GetScrollPosition(document.body); // Object with integer values returned
	Fit._internal.Events.Mouse.Coordinates.Document.X = Fit._internal.Events.Mouse.Coordinates.ViewPort.X + scrollPos.X;
	Fit._internal.Events.Mouse.Coordinates.Document.Y = Fit._internal.Events.Mouse.Coordinates.ViewPort.Y + scrollPos.Y;

	Fit._internal.Events.Mouse.Target = Fit.Events.GetTarget(ev);
});
Fit.Events.AddHandler(document, "touchend", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	// Postpone reset to allow touchend handlers registered to fire in bubbling phase,
	// as well as OnClick handlers which might fire on touch devices, to access pointer state.
	setTimeout(function()
	{
		Fit._internal.Events.Mouse.Buttons.Touch = false;

		/*Fit._internal.Events.Mouse.Coordinates.ViewPort.X = -1;
		Fit._internal.Events.Mouse.Coordinates.ViewPort.Y = -1;
		Fit._internal.Events.Mouse.Coordinates.Document.X = -1;
		Fit._internal.Events.Mouse.Coordinates.Document.Y = -1;*/

		Fit._internal.Events.Mouse.Target = null;
	}, 0);
});
Fit.Events.AddHandler(document, "touchcancel", true, function(e)
{
	var ev = Fit.Events.GetEvent(e);

	// Postpone reset to allow touchcancel handlers registered to fire in bubbling phase to access pointer state
	setTimeout(function()
	{
		Fit._internal.Events.Mouse.Buttons.Touch = false;

		/*Fit._internal.Events.Mouse.Coordinates.ViewPort.X = -1;
		Fit._internal.Events.Mouse.Coordinates.ViewPort.Y = -1;
		Fit._internal.Events.Mouse.Coordinates.Document.X = -1;
		Fit._internal.Events.Mouse.Coordinates.Document.Y = -1;*/

		Fit._internal.Events.Mouse.Target = null;
	}, 0);
});
Fit.Events.AddHandler(document, "touchmove", function(e)
{
	var ev = Fit.Events.GetEvent(e);

	// Touch position in viewport
	Fit._internal.Events.Mouse.Coordinates.ViewPort.X = Math.floor(ev.touches[0].clientX);
	Fit._internal.Events.Mouse.Coordinates.ViewPort.Y = Math.floor(ev.touches[0].clientY);

	// Touch position in document which may have been scrolled
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
Fit._internal.Events.MutationCheckExecuting = false;
Fit._internal.Events.MutationRegisterPostponed = [];

/// <function container="Fit.EventsTypeDefs" name="MutationObserverCallback" returns="any">
/// 	<description> Event handler callback used with Fit.Events.AddMutationObserver(..) </description>
/// 	<param name="dom" type="DOMElement"> DOM element </param>
/// </function>

/// <function container="Fit.Events" name="AddMutationObserver" access="public" static="true" returns="integer">
/// 	<description>
/// 		Registers mutation observer which is invoked when a DOMElement is updated. By default
/// 		only attributes and dimensions are observed. Use deep flag to have children and character data observed too.
/// 		An observer ID is returned which can be used to remove mutation observer.
/// 		Important: Mutation observers should be removed when no longer needed for better performance!
/// 		To remove an observer from within the observer function itself, simply call disconnect().
/// 	</description>
/// 	<param name="elm" type="DOMElement"> DOMElement to observe </param>
/// 	<param name="obs" type="Fit.EventsTypeDefs.MutationObserverCallback"> JavaScript observer function to register - receives reference to DOMElement being observed when updated </param>
/// 	<param name="deep" type="boolean" default="false"> Flag indicating whether to check for modifications within element (children and character data) - this could potentially be expensive </param>
/// </function>
Fit.Events.AddMutationObserver = function(elm, obs, deep)
{
	Fit.Validation.ExpectDomElement(elm);
	Fit.Validation.ExpectFunction(obs);
	Fit.Validation.ExpectBoolean(deep, true);

	// Postpone if check is running

	if (Fit._internal.Events.MutationCheckExecuting === true)
	{
		Fit.Array.Add(Fit._internal.Events.MutationRegisterPostponed, { Task: "Add", Element: elm, Observer: obs, Deep: deep === true });
		return;
	}

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

		var checkInterval = Fit._internal.Events.Browser.Name !== "MSIE" ? 500 : 1000;
		Fit._internal.Events.MutationObserverIntervalId = setInterval(Fit._internal.Events.CheckMutations, checkInterval);
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
/// 	<param name="obs" type="Fit.EventsTypeDefs.MutationObserverCallback"> JavaScript observer function to remove </param>
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

	if (Fit._internal.Events.MutationCheckExecuting === true)
	{
		if (Fit.Validation.IsSet(id) === true)
		{
			Fit.Array.Add(Fit._internal.Events.MutationRegisterPostponed, { Task: "Remove", Id: id });
		}
		else
		{
			Fit.Array.Add(Fit._internal.Events.MutationRegisterPostponed, { Task: "Remove", Element: elm, Observer: obs, Deep: deep === true });
		}

		return;
	}

	var found = null;

	Fit.Array.ForEach(Fit._internal.Events.MutationObservers, function(mo)
	{
		if ((Fit.Validation.IsSet(id) === true && mo.Id === id) || (mo.Element === elm && mo.Observer === obs && mo.Deep === ((Fit.Validation.IsSet(deep) === true) ? deep : false)))
		{
			found = mo;
			return false; // Break loop
		}
	});

	if (found !== null)
		Fit.Array.Remove(Fit._internal.Events.MutationObservers, found);

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
	// Guard against changes to mutation observer collection while running CheckMutations().
	// This is necessary in case a running mutation observer, triggered from CheckMutations(),
	// results in another mutation observer being added/removed. We do not want to change a
	// collection being iterated, and we do not want to risk invoking mutation observers that
	// have been removed.
	Fit._internal.Events.MutationCheckExecuting = true;

	var toRemove = [];

	Fit.Array.ForEach(Fit._internal.Events.MutationObservers, function(mo)
	{
		// Skip mutation observers removed while CheckMutations() was running

		var skipRemovedObserver = false;

		Fit.Array.ForEach(Fit._internal.Events.MutationRegisterPostponed, function(mop)
		{
			if (mop.Task === "Add")
			{
				return; // Skip, only check for removals
			}

			if ((Fit.Validation.IsSet(mop.Id) === true && mop.Id === mo.Id) || (mop.Element === mo.Element && mop.Observer === mo.Observer && mo.Deep === ((Fit.Validation.IsSet(mo.Deep) === true) ? mo.Deep : false)))
			{
				// Observer has been scheduled for removal - do not invoke it

				skipRemovedObserver = true;
				return false; // Break loop
			}

		});

		if (skipRemovedObserver === true)
		{
			return; // Skip, scheduled for removal
		}

		// Calculate and compare hashes revealing changes to element

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

		// Trigger mutation observer if element has changed

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

	// Remove observers that called disconnect()

	Fit.Array.ForEach(toRemove, function(mo)
	{
		Fit.Events.RemoveMutationObserver(mo.Element, mo.Observer, mo.Deep);
	});

	// Handle mutation observers that were added/removed
	// while CheckMutations() invoked existing mutation observers.

	Fit._internal.Events.MutationCheckExecuting = false;

	Fit.Array.ForEach(Fit._internal.Events.MutationRegisterPostponed, function(mo)
	{
		if (mo.Task === "Add")
		{
			Fit.Events.AddMutationObserver(mo.Element, mo.Observer, mo.Deep);
		}
		else // if (mo.Task === "Remove")
		{
			if (Fit.Validation.IsSet(mo.Id) === true)
			{
				Fit.Events.RemoveMutationObserver(mo.Id);
			}
			else
			{
				Fit.Events.RemoveMutationObserver(mo.Element, mo.Observer, mo.Deep);
			}
		}
	});

	Fit._internal.Events.MutationRegisterPostponed = [];
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

/// <function container="Fit.Events" name="OnDomReady" access="public" static="true">
/// 	<description> Registers OnReady handler which gets fired when DOM is ready for manipulation, or if it is already ready </description>
/// 	<param name="callback" type="function"> JavaScript function to register </param>
/// </function>
Fit.Events.OnDomReady = function(callback)
{
	Fit.Validation.ExpectFunction(callback);

	if (Fit._internal.Events.OnDomReadyFired === true)
	{
		callback();
	}
	else
	{
		Fit._internal.Events.OnDomReadyHandlers.push(callback);
	}
}

Fit.Events.AddHandler(document, "DOMContentLoaded", function()
{
	Fit._internal.Events.OnDomReadyFired = true;

	Fit.Array.ForEach(Fit._internal.Events.OnDomReadyHandlers, function(handler)
	{
		handler();
	});

	Fit.Array.Clear(Fit._internal.Events.OnDomReadyHandlers);
});
