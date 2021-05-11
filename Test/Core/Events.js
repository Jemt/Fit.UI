Tests.AddRemove = function()
{
	var executionOrder = 0;
	var highDivCausingScroll = null;
	var msIe8 = Fit.Browser.GetBrowser() === "MSIE" && Fit.Browser.GetVersion() === 8;
	var eventTarget = msIe8 === false && document || window;
	var handlerCountBeforeTest = 0;

	var createTestFunction = function(listener)
	{
		return function(e)
		{
			//console.log("Event handler '" + listener.Id + "' executed");

			listener.Invocations++;
			listener.ExecutionOrder = ++executionOrder;
		};
	};

	var listeners =
    [
        {
            Id: "Scroll 1",
            Target: eventTarget,
            Type: "scroll",
            Function: null,
            EventId: -1,
			Invocations: 0,
			ExecutionOrder: 0
        },
        {
            Id: "Scroll 2",
            Target: eventTarget,
            Type: "scroll",
            Function: null,
            Options: true, // Capture
            EventId: -1,
			Invocations: 0,
			ExecutionOrder: 0
        },
        {
            Id: "Scroll 3",
            Target: eventTarget,
            Type: "scroll",
            Function: null,
            Options: { Capture: true, Passive: true },
            EventId: -1,
			Invocations: 0,
			ExecutionOrder: 0
        },
		// Duplicates identical to listeners above - used to test removal using EventId
		{
            Id: "Scroll 4",
            Target: eventTarget,
            Type: "scroll",
            Function: null,
            EventId: -1,
			Invocations: 0,
			ExecutionOrder: 0
        },
        {
            Id: "Scroll 5",
            Target: eventTarget,
            Type: "scroll",
            Function: null,
            Options: true,
            EventId: -1,
			Invocations: 0,
			ExecutionOrder: 0
        },
        {
            Id: "Scroll 6",
            Target: eventTarget,
            Type: "scroll",
            Function: null,
            Options: { Capture: true, Passive: true },
            EventId: -1,
			Invocations: 0,
			ExecutionOrder: 0
        }
    ];

	this.Description = "Add OnScroll event handlers in different ways";

	this.Execute = function()
	{
		var handlers = eventTarget._internal && eventTarget._internal.Events && eventTarget._internal.Events.Handlers || [];
		Fit.Array.ForEach(handlers, function(handler)
		{
			if (handler !== null) // Unregistered event handlers are nullified
			{
				handlerCountBeforeTest++;
			}
		});

		window.scrollTo(0, 0);

		highDivCausingScroll = document.createElement("div");
		highDivCausingScroll.style.cssText = "height: 5000px";
		document.body.appendChild(highDivCausingScroll);

		Fit.Array.ForEach(listeners, function(listener)
		{
			listener.Function = createTestFunction(listener);

			if (listener.Options !== undefined)
			{
				//console.log("Adding event listener with options: " + listener.Id);
				listener.EventId = Fit.Events.AddHandler(listener.Target, listener.Type, listener.Options, listener.Function);
			}
			else
			{
				//console.log("Adding event listener without options: " + listener.Id);
				listener.EventId = Fit.Events.AddHandler(listener.Target, listener.Type, listener.Function);
			}
		});

		window.scrollTo(0, 299);
	}

	this.PostponeVerification = 200;
	this.Assertions =
	[
		{
			Message: "Scroll handler 1 has registered scroll event",
			Expected: true,
			GetResult: function()
			{
				return listeners[0].Invocations > 0;
			}
		},
		{
			Message: "Scroll handler 2 has registered scroll event",
			Expected: true,
			GetResult: function()
			{
				return listeners[1].Invocations > 0;
			}
		},
		{
			Message: "Scroll handler 3 has registered scroll event",
			Expected: true,
			GetResult: function()
			{
				return listeners[2].Invocations > 0;
			}
		},
		{
			Message: "Scroll handler 4 has registered scroll event",
			Expected: true,
			GetResult: function()
			{
				return listeners[3].Invocations > 0;
			}
		},
		{
			Message: "Scroll handler 5 has registered scroll event",
			Expected: true,
			GetResult: function()
			{
				return listeners[4].Invocations > 0;
			}
		},
		{
			Message: "Scroll handler 6 has registered scroll event",
			Expected: true,
			GetResult: function()
			{
				return listeners[5].Invocations > 0;
			}
		},
		{
			Message: "Scroll handlers executed in expected order (NOTICE: Only executed on Chromium 89+ and Safari 12+)",
			Expected: true,
			GetResult: function()
			{
				// Many browsers simply invoke OnScroll events in order of registration, completely ignoring whether it
				// was registered using Capture or Bubbling. Interestingly IE8 works properly while IE9-11, Edge 15-88
				// and Chrome prior to version 89 does not. Browsers based on Chrome 89+ is expected to work properly.
				// Safari 11.1 and prior does not work as expected, Safari 12.1 and later does.
				// Basically the execution order for OnScroll events is a mess, so we only test this on modern browsers.

				if ((Fit.Browser.GetBrowser() === "Chrome" && Fit.Browser.GetVersion() >= 89) || (Fit.Browser.GetBrowser() === "Safari" && Fit.Browser.GetVersion() >= 12))
				{
					var onScrollBubblePhase = listeners[0]; // This is expected to be invoked last
					var firstOnScrollCapturePhase = listeners[1]; // This is expected to be invoked first
					var secondOnScrollCapturePhasePassive = listeners[2]; // This is expected to be invoked second

					//console.log("Execution order: " + firstOnScrollCapturePhase.ExecutionOrder + " < " + secondOnScrollCapturePhasePassive.ExecutionOrder + " && " + secondOnScrollCapturePhasePassive.ExecutionOrder + " < " + onScrollBubblePhase.ExecutionOrder);

					return firstOnScrollCapturePhase.ExecutionOrder < secondOnScrollCapturePhasePassive.ExecutionOrder && secondOnScrollCapturePhasePassive.ExecutionOrder < onScrollBubblePhase.ExecutionOrder;
				}

				return true; // Just pretend test case went through on older browsers
			}
		}
	]

	this.Tests =
	{
		Remove: function()
		{
			this.Description = "Remove OnScroll event handlers previously registered";

			this.PostponeTest = 500; // Wait for tests above to complete
			this.Execute = function()
			{
				for (var i = 0 ; i < listeners.length ; i++)
				{
					var listener = listeners[i];
					listener.Invocations = 0;

					if (i <= 2) // First 3 listeners are removed using function reference and options
					{
						if (listener.Options !== undefined)
						{
							//console.log("Removing event listener with options using full signature: " + listener.Id);
							Fit.Events.RemoveHandler(listener.Target, listener.Type, listener.Options, listener.Function);
						}
						else
						{
							//console.log("Removing event listener without options using full signature: " + listener.Id);
							Fit.Events.RemoveHandler(listener.Target, listener.Type, listener.Function);
						}
					}
					else // Last 3 listeners are removed using Event ID
					{
						//console.log("Removing event listener using Event ID: " + listener.Id);
						Fit.Events.RemoveHandler(listener.Target, listener.EventId);
					}
				}

				window.scrollTo(0, 99);
			}

			this.PostponeVerification = 200;
			this.Assertions =
			[
				{
					Message: "Scroll handler 1 has NOT registered scroll event after removal",
					Expected: true,
					GetResult: function()
					{
						return listeners[0].Invocations === 0;
					}
				},
				{
					Message: "Scroll handler 2 has NOT registered scroll event after removal",
					Expected: true,
					GetResult: function()
					{
						return listeners[1].Invocations === 0;
					}
				},
				{
					Message: "Scroll handler 3 has NOT registered scroll event after removal",
					Expected: true,
					GetResult: function()
					{
						return listeners[2].Invocations === 0;
					}
				},
				{
					Message: "Scroll handler 4 has NOT registered scroll event after removal",
					Expected: true,
					GetResult: function()
					{
						return listeners[3].Invocations === 0;
					}
				},
				{
					Message: "Scroll handler 5 has NOT registered scroll event after removal",
					Expected: true,
					GetResult: function()
					{
						return listeners[4].Invocations === 0;
					}
				},
				{
					Message: "Scroll handler 6 has NOT registered scroll event after removal",
					Expected: true,
					GetResult: function()
					{
						return listeners[5].Invocations === 0;
					}
				},
				{
					Message: "Event handlers are properly removed from memory",
					Expected: handlerCountBeforeTest,
					GetResult: function()
					{
						var handlers = eventTarget._internal && eventTarget._internal.Events && eventTarget._internal.Events.Handlers || [];
						var newHandlerCount = 0;
						Fit.Array.ForEach(handlers, function(handler)
						{
							if (handler !== null) // Unregistered event handlers are nullified
							{
								newHandlerCount++;
							}
						});

						return newHandlerCount;
					}
				}
			],

			this.Dispose = function()
			{
				Fit.Dom.Remove(highDivCausingScroll);
			}
		}
	}
}