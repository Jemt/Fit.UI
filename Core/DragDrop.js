Fit.DragDrop = {};

// Draggable

/// <function container="Fit.DragDrop.Draggable" name="Draggable" access="public">
/// 	<description> Constructor - create instance of Draggable class </description>
/// 	<param name="domElm" type="DOMElement"> Element to turn into draggable object </param>
/// 	<param name="domTriggerElm" type="DOMElement" default="undefined"> Element that triggers dragging (optional) </param>
/// </function>
Fit.DragDrop.Draggable = function(domElm, domTriggerElm)
{
	Fit.Validation.ExpectElementNode(domElm);
	Fit.Validation.ExpectElementNode(domTriggerElm, true);

	// Private properties

	var me = this;
	var elm = domElm;
	var posState = null; // { position: "", left: "", top: "" };
	var trgElm = (domTriggerElm ? domTriggerElm : null);
	var bringToFrontOnActivation = false;
	var returnFocus = false;

	var onDragStart = null;
	var onDragging = null;
	var onDragStop = null;

	var activationEventId = -1;
	var mouseDownEventId = -1;

	// Construct

	function init()
	{
		Fit._internal.Core.EnsureStyles();

		Fit.Dom.AddClass(elm, "FitDragDropDraggable");
		Fit.Dom.AddClass((trgElm !== null ? trgElm : elm), "FitDragDropDraggableHandle");

		// Bring to front on activation

		activationEventId = Fit.Events.AddHandler(elm, (Fit.Browser.IsTouchEnabled() === true ? "touchstart" : "mousedown"), function(e)
		{
			if (bringToFrontOnActivation === true)
			{
				me.BringToFront();
			}
		});

		// Mouse down

		var focusedBeforeDrag = null;

		mouseDownEventId = Fit.Events.AddHandler(((trgElm !== null) ? trgElm : elm), (Fit.Browser.IsTouchEnabled() === true ? "touchstart" : "mousedown"), function(e)
		{
			if (Fit.DragDrop.Draggable._internal.active !== null)
				return; // Skip - current element is a draggable parent to which event propagated

			var ev = Fit.Events.GetEvent(e);

			if (onDragStart)
			{
				if (onDragStart(elm) === false)
				{
					return;
				}
			}

			focusedBeforeDrag = returnFocus === true ? Fit.Dom.GetFocused() : null;

			Fit.Dom.AddClass(elm, "FitDragDropDragging");

			// Initial positioning (used by Reset())
			if (posState === null)
			{
				// Element's positioning is only read on first drag attempt,
				// and again after Reset() has been called (which sets posState null),
				// as we can imagine an implementation that lets the user drag
				// an element and temporarily release it outside of a DropZone, and
				// then move it again, before finally dropping it into an actual DropZone,
				// where the positioning set by Draggable is canceled via Reset(), and
				// thereby reverted to the initial positioning defined by the element.

				posState =
				{
					position: elm.style.position,
					left: elm.style.left,
					top: elm.style.top
				};
			}

			// Mouse position in viewport
			var pp = Fit.Events.GetPointerState().Coordinates.ViewPort;
			var mouseXviewport = pp.X;
			var mouseYviewport = pp.Y;

			// Create state information object for draggable currently being dragged
			var state =
			{
				Draggable: me,
				Positioning: "relative",
				Mouse: {Viewport: {X: -1, Y: -1}, Document: {X: -1, Y: -1}},
				Position: {Viewport: {X: -1, Y: -1}, Document: {X: -1, Y: -1}, Offset: {X: -1, Y: -1}},
				Events: { OnDragStart: onDragStart, OnDragging: onDragging, OnDragStop: onDragStop }/*,
				OnSelectStart : document.onselectstart*/
			};

			var positioning = Fit.Dom.GetComputedStyle(elm, "position");
			if (positioning === "absolute" || positioning === "fixed")
			{
				state.Positioning = positioning;
			}

			// Disable text selection for legacy browsers.
			// DISABLED: Now handled using Fit.Events.PreventDefault(ev).
			//document.onselectstart = function() { return false; }

			// Find mouse position in viewport
			state.Mouse.Viewport.X = mouseXviewport;
			state.Mouse.Viewport.Y = mouseYviewport;

			// Find mouse position in document (which may have been scrolled)
			//state.Mouse.Document.X = mouseXviewport + window.scrollX;
			//state.Mouse.Document.Y = mouseYviewport + window.scrollY;
			var scrollPos = Fit.Dom.GetScrollPosition(elm);
			state.Mouse.Document.X = mouseXviewport + scrollPos.X;
			state.Mouse.Document.Y = mouseYviewport + scrollPos.Y;

			// Find draggable position in viewport and document
			state.Position.Viewport = Fit.Dom.GetPosition(elm, true);
			state.Position.Document = Fit.Dom.GetPosition(elm);

			// Find X,Y position already set for draggable (by previous drag operation or using CSS positioning)
			var offsetX = Fit.Dom.GetComputedStyle(elm, "left");
			var offsetY = Fit.Dom.GetComputedStyle(elm, "top");
			state.Position.Offset.X = (offsetX.indexOf("px") > -1 ? parseInt(offsetX) : 0);
			state.Position.Offset.Y = (offsetY.indexOf("px") > -1 ? parseInt(offsetY) : 0);

			Fit.DragDrop.Draggable._internal.active = state;

			// If draggable is also a dropzone, move it to the end of internal dropzones collection
			// to make sure this dropzone is considered "on top" of other dropzones.
			// NOTICE: This only works reliable if draggable dropzones are placed on top of each
			// other by the user. If the dropzones are programmatically floated on top of each other,
			// the dropzones must be added (turned into dropzones) in the same order as they appear
			// visually.

			if (Fit.Dom.HasClass(elm, "FitDragDropDropZone") === true)
			{
				// Find draggable dropzone in dropzones collection
				var draggableDropZone = null;
				Fit.Array.ForEach(Fit.DragDrop.DropZone._internal.dropzones, function(dzState)
				{
					if (dzState.DropZone.GetElement() === elm)
					{
						draggableDropZone = dzState;
						return false;
					}
				});

				// Move dropzone to end of collection
				Fit.Array.Remove(Fit.DragDrop.DropZone._internal.dropzones, draggableDropZone);
				Fit.Array.Add(Fit.DragDrop.DropZone._internal.dropzones, draggableDropZone);
			}

			if (ev.type === "touchstart")
			{
				Fit.Events.PreventDefault(ev); // Stop page scrolling on iOS (required in both ontouchstart and ontouchmove handlers)
			}
		});

		// Mouse Up

		if (Fit.DragDrop.Draggable._internal.mouseUpRegistered === false)
		{
			Fit.DragDrop.Draggable._internal.mouseUpRegistered = true;

			Fit.Events.AddHandler(document, (Fit.Browser.IsTouchEnabled() === true ? "touchend" : "mouseup"), function(e)
			{
				if (Fit.DragDrop.Draggable._internal.active === null)
					return;

				var draggableState = Fit.DragDrop.Draggable._internal.active;
				var draggable = Fit.DragDrop.Draggable._internal.active.Draggable;

				var dropzoneState = Fit.DragDrop.DropZone._internal.active
				var dropzone = (dropzoneState !== null ? dropzoneState.DropZone : null);

				// Handle draggable

				Fit.Dom.RemoveClass(draggable.GetElement(), "FitDragDropDragging");
				Fit.DragDrop.Draggable._internal.active = null;

				//if (draggableState.Events.OnDragStop)
				//    draggableState.Events.OnDragStop(draggable);

				// Handle active dropzone

				if (dropzoneState !== null)
				{
					Fit.Dom.RemoveClass(dropzone.GetElement(), "FitDragDropDropZoneActive");
					Fit.DragDrop.DropZone._internal.active = null;

					if (dropzoneState.OnDrop)
						dropzoneState.OnDrop(dropzone, draggable);
				}

				// Restore focus

				if (focusedBeforeDrag !== null)
				{
					focusedBeforeDrag.focus();
					focusedBeforeDrag = null;
				}

				// Fire OnDragStop after OnDrop to make sure OnDragStop can act
				// depending on whether draggable was dropped on a dropzone or not.

				if (draggableState.Events.OnDragStop)
					draggableState.Events.OnDragStop(draggable);

				// Restore OnSelectStart event
				//document.onselectstart = draggableState.OnSelectStart;
			});
		}

		Fit.Browser.IsTouchEnabled() === true && Fit.Events.AddHandler(document, "touchcancel", function(e)
		{
			focusedBeforeDrag = null;
		});

		// Mouse move

		if (Fit.DragDrop.Draggable._internal.mouseMoveRegistered === false)
		{
			Fit.DragDrop.Draggable._internal.mouseMoveRegistered = true;

			Fit.Events.AddHandler(document, (Fit.Browser.IsTouchEnabled() === true ? "touchmove" : "mousemove"), { passive: false /* https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener */ }, function(e)
			{
				if (Fit.DragDrop.Draggable._internal.active === null)
					return;

				var ev = Fit.Events.GetEvent(e);

				// Handle draggable

				var state = Fit.DragDrop.Draggable._internal.active;
				var draggable = state.Draggable;
				var elm = draggable.GetElement();

				// Mouse position in viewport
				var pp = Fit.Events.GetPointerState().Coordinates.ViewPort;
				var mouseXviewport = pp.X;
				var mouseYviewport = pp.Y;

				// Prevent user from moving object out of viewport
				var vpDim = Fit.Browser.GetViewPortDimensions();
				mouseXviewport = mouseXviewport >= 0 ? mouseXviewport : 0;
				mouseXviewport = mouseXviewport <= vpDim.Width ? mouseXviewport : vpDim.Width;
				mouseYviewport = mouseYviewport >= 0 ? mouseYviewport : 0;
				mouseYviewport = mouseYviewport <= vpDim.Height ? mouseYviewport : vpDim.Height;

				// Positioning (fixed, absolute, or relative)
				var positioning = Fit.DragDrop.Draggable._internal.active.Positioning;

				// Mouse position in viewport (fixed) or document (absolute or relative).
				// Potential performance optimization: Only call GetScrollPosition if element
				// is contained in scrollable element. If not, use window.scrollX/Y instead!
				//var mouseXdocument = mouseXviewport + window.scrollX;
				//var mouseYdocument = mouseYviewport + window.scrollY;
				var scrollPos = (positioning !== "fixed" ? Fit.Dom.GetScrollPosition(elm) : { X: 0, Y: 0 });
				var mouseXdocument = mouseXviewport + scrollPos.X;
				var mouseYdocument = mouseYviewport + scrollPos.Y;

				if (positioning !== "relative")
				{
					// Mouse position within draggable
					var mouseFromLeft = state.Mouse.Viewport.X - state.Position.Viewport.X;
					var mouseFromTop = state.Mouse.Viewport.Y - state.Position.Viewport.Y;

					elm.style.position = positioning; // absolute or fixed
					elm.style.left = (mouseXdocument - mouseFromLeft) + "px";
					elm.style.top = (mouseYdocument - mouseFromTop) + "px";
				}
				else // relative
				{
					// Number of pixels mouse moved
					var mouseXmoved = mouseXdocument - state.Mouse.Document.X;
					var mouseYmoved = mouseYdocument - state.Mouse.Document.Y;

					// Element have been initially positioned or previously moved
					var elementLeft = state.Position.Offset.X;
					var elementTop = state.Position.Offset.Y;

					elm.style.position = "relative";
					elm.style.left = elementLeft + mouseXmoved + "px";
					elm.style.top = elementTop + mouseYmoved + "px";
				}

				if (state.Events.OnDragging)
					state.Events.OnDragging(elm);

				// Handle dropzones

				var dropzone = null;
				var dropzoneElement = null;
				var pos = null;
				var dropZoneX = -1;
				var dropZoneY = -1;

				// State objects
				var previouslyActiveDropZone = Fit.DragDrop.DropZone._internal.active;
				var dropzoneActive = null;

				// Find active dropzone.
				// NOTICE: If dropzones are floated on top of each other, make sure they are added to the
				// internal dropzones collection in order of appearance to make sure the correct dropzone
				// is turned active.
				Fit.Array.ForEach(Fit.DragDrop.DropZone._internal.dropzones, function(dzState)
				{
					dropzone = dzState.DropZone;
					dropzoneElement = dropzone.GetElement();

					if (Fit.Dom.IsVisible(dropzoneElement) === false)
						return; // Skip - dropzone not currently visible

					pos = Fit.Dom.GetPosition(dropzoneElement, true);
					dropZoneX = pos.X;
					dropZoneY = pos.Y;

					var dropzoneFound = (dropzoneActive === null);
					var dropzoneDeeperThanPreviouslyFound = (dropzoneActive === null || Fit.Dom.GetDepth(dropzoneElement) > Fit.Dom.GetDepth(dropzoneActive.DropZone.GetElement()));
					var dropzoneCurrentlyBeingDragged = (Fit.Dom.HasClass(dropzoneElement, "FitDragDropDragging") === true);
					var draggableHoveringDropZone = (mouseXviewport > dropZoneX && mouseXviewport < (dropZoneX + dropzoneElement.offsetWidth) && mouseYviewport > dropZoneY && mouseYviewport < (dropZoneY + dropzoneElement.offsetHeight));

					if ((dropzoneFound === false || dropzoneDeeperThanPreviouslyFound === true) && dropzoneCurrentlyBeingDragged === false && draggableHoveringDropZone === true)
					{
						dropzoneActive = dzState;
					}
				});

				// Leave previously active dropzone if no longer active
				if (previouslyActiveDropZone !== null && dropzoneActive !== previouslyActiveDropZone)
				{
					Fit.Dom.RemoveClass(previouslyActiveDropZone.DropZone.GetElement(), "FitDragDropDropZoneActive");
					Fit.DragDrop.DropZone._internal.active = null;

					if (previouslyActiveDropZone.OnLeave)
						previouslyActiveDropZone.OnLeave(previouslyActiveDropZone.DropZone);
				}

				// Mark dropzone active if not already done
				if (dropzoneActive !== null && dropzoneActive !== previouslyActiveDropZone)
				{
					Fit.Dom.AddClass(dropzoneActive.DropZone.GetElement(), "FitDragDropDropZoneActive");
					Fit.DragDrop.DropZone._internal.active = dropzoneActive;

					if (dropzoneActive.OnEnter)
						dropzoneActive.OnEnter(dropzoneActive.DropZone);
				}

				// Stop page scrolling on iOS (required in both ontouchstart and ontouchmove handlers).
				// Ontouchmove must be registered with { passive: false } for this to work in browsers
				// which defaults to passive:true. This also prevents text selection on older browsers
				// not supporting user-select:none.

				Fit.Events.PreventDefault(ev);
			});
		}
	}

	// Public

	/// <function container="Fit.DragDrop.Draggable" name="BringToFrontOnActivation" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether to bring draggable to front when activated </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, a value of True enables functionality, False disables it (default) </param>
	/// </function>
	this.BringToFrontOnActivation = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			bringToFrontOnActivation = val;

			// NOTICE: z-index is not reset when BringToFrontOnActivation is disabled.
			// It may have been enabled at some point, but we keep the z-index to make
			// sure the element remains below other elements that have BringToFrontOnActivation
			// enabled. Resetting the z-index style attribute will cause the z-index value of
			// 99999 from CSS to be applied when dragging the element, causing it to temporarily
			// be positioned above elements with BringToFrontOnActivation enabled while dragging it.
			// That becomes bad UX when the user stops dragging it and releases it, at which point
			// the temporary z-index value of 99999 from CSS is no longer in effect and z-index:1200
			// takes effect again, which causes the element to be hidden behind elements with
			// BringToFrontOnActivation enabled.
		}

		return bringToFrontOnActivation;
	}

	/// <function container="Fit.DragDrop.Draggable" name="ReturnFocus" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether focus is returned/restored after drag operation </description>
	/// 	<param name="val" type="boolean" default="undefined">
	/// 		A value of True causes draggable to return focus to previously
	/// 		focused element when drag operation is completed - defaults to False
	/// 	</param>
	/// </function>
	this.ReturnFocus = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			returnFocus = val;
		}

		return returnFocus;
	}

	/// <function container="Fit.DragDrop.Draggable" name="BringToFront" access="public">
	/// 	<description> Bring draggable to front </description>
	/// </function>
	this.BringToFront = function()
	{
		elm.style.zIndex = Fit.DragDrop.Draggable._internal.getNextZindex();
	}

	/// <function container="Fit.DragDrop.Draggable" name="Reset" access="public">
	/// 	<description> Reset draggable to initial position </description>
	/// </function>
	this.Reset = function()
	{
		if (posState === null)
			return;

		elm.style.position = posState.position;
		elm.style.left = posState.left;
		elm.style.top = posState.top;
		elm.style.zIndex = "";

		posState = null;
	}

	/// <function container="Fit.DragDrop.Draggable" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get draggable DOM element </description>
	/// </function>
	this.GetDomElement = function()
	{
		return elm;
	}

	this.GetElement = this.GetDomElement; // Backward compatibility

	/// <function container="Fit.DragDrop.Draggable" name="Dispose" access="public">
	/// 	<description> Free resources and disable dragging support for DOM element </description>
	/// </function>
	this.Dispose = function()
	{
		// Dispose should not be called while dragging element!
		// To support this we would need to fire events, invoke Reset(),
		// remove FitDragDropDragging class, unset Fit.DragDrop.Draggable._internal.active etc.

		// For elements removed from DOM and memory, calling Dispose is not necessary to
		// ensure memory is freed. There are no global resources associated with the DOM element.

		Fit.Dom.RemoveClass(elm, "FitDragDropDraggable");
		Fit.Dom.RemoveClass((trgElm !== null ? trgElm : elm), "FitDragDropDraggableHandle");

		Fit.Events.RemoveHandler(elm, activationEventId);
		Fit.Events.RemoveHandler(((trgElm !== null) ? trgElm : elm), mouseDownEventId);

		if (Fit.DragDrop.Draggable._internal.active !== null && Fit.DragDrop.Draggable._internal.active.Draggable === me)
		{
			Fit.DragDrop.Draggable._internal.active = null;
		}

		me = elm = posState = trgElm = bringToFrontOnActivation = returnFocus = onDragStart = onDragging = onDragStop = activationEventId = mouseDownEventId = null;
	}

	// Event handling

	/// <function container="Fit.DragDrop.DraggableTypeDefs" name="DragEventHandler">
	/// 	<description> Event handler </description>
	/// 	<param name="dom" type="DOMElement"> DOM element to which event is associated </param>
	/// </function>

	/// <function container="Fit.DragDrop.DraggableTypeDefs" name="DragStopEventHandler">
	/// 	<description> Event handler </description>
	/// 	<param name="dom" type="DOMElement"> DOM element to which event is associated </param>
	/// 	<param name="draggable" type="Fit.DragDrop.Draggable"> Instance of Draggable to which event is associated </param>
	/// </function>

	/// <function container="Fit.DragDrop.Draggable" name="OnDragStart" access="public">
	/// 	<description> Add event handler which gets fired when dragging starts </description>
	/// 	<param name="cb" type="Fit.DragDrop.DraggableTypeDefs.DragEventHandler"> Callback (event handler) function - draggable DOM element is passed to function </param>
	/// </function>
	this.OnDragStart = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		onDragStart = cb;
	}

	/// <function container="Fit.DragDrop.Draggable" name="OnDragging" access="public">
	/// 	<description> Add event handler which constantly gets fired when dragging takes place </description>
	/// 	<param name="cb" type="Fit.DragDrop.DraggableTypeDefs.DragEventHandler"> Callback (event handler) function - draggable DOM element is passed to function </param>
	/// </function>
	this.OnDragging = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		onDragging = cb;
	}

	/// <function container="Fit.DragDrop.Draggable" name="OnDragStop" access="public">
	/// 	<description> Add event handler which gets fired when dragging stops </description>
	/// 	<param name="cb" type="Fit.DragDrop.DraggableTypeDefs.DragStopEventHandler"> Callback (event handler) function - instance of Draggable is passed to function </param>
	/// </function>
	this.OnDragStop = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		onDragStop = cb;
	}

	init();
}
Fit.DragDrop.Draggable._internal =
{
	/* Shared */
	_zIndex : 10000,
	getNextZindex: function()
	{
		Fit.DragDrop.Draggable._internal._zIndex++;
		return Fit.DragDrop.Draggable._internal._zIndex + (Fit.Dom.Data(document.documentElement, "fitui-companion") === "fluent-ui" ? 2000000 : 0);
	},
	mouseUpRegistered : false,
	mouseMoveRegistered : false,

	/* Draggable state object */
	active: null
}

// DropZone

/// <function container="Fit.DragDrop.DropZone" name="DropZone" access="public">
/// 	<description> Constructor - create instance of DropZone class </description>
/// 	<param name="domElm" type="DOMElement"> Element to turn into dropzone object </param>
/// </function>
Fit.DragDrop.DropZone = function(domElm)
{
	Fit.Validation.ExpectElementNode(domElm);

	var elm = domElm;

	var cfg =
	{
		DropZone: this,
		OnEnter: null,
		OnDrop: null,
		OnLeave: null
	};

	function init()
	{
		Fit._internal.Core.EnsureStyles();
		Fit.Dom.AddClass(elm, "FitDragDropDropZone");
		Fit.DragDrop.DropZone._internal.dropzones.push(cfg);
	}

	/// <function container="Fit.DragDrop.DropZone" name="Dispose" access="public">
	/// 	<description> Free resources and disable DropZone support for DOM element </description>
	/// </function>
	this.Dispose = function()
	{
		// Dispose should not be called while DropZone is active!
		// To support this we would need to fire OnLeave and unset
		// Fit.DragDrop.DropZone._internal.active. Draggable
		// does not support being disposed while being dragged either.

		Fit.Dom.RemoveClass(elm, "FitDragDropDropZone");
		Fit.Array.Remove(Fit.DragDrop.DropZone._internal.dropzones, cfg);
		elm = cfg = null;
	}

	/// <function container="Fit.DragDrop.DropZone" name="GetDomElement" access="public" returns="DOMElement">
	/// 	<description> Get dropzone DOM element </description>
	/// </function>
	this.GetDomElement = function()
	{
		return elm;
	}

	this.GetElement = this.GetDomElement; // Backward compatibility

	// Event handling

	/// <function container="Fit.DragDrop.DropZoneTypeDefs" name="EnterEventHandler">
	/// 	<description> Event handler </description>
	/// 	<param name="dropZone" type="Fit.DragDrop.DropZone"> Instance of DropZone to which draggable can potentially be dropped now </param>
	/// </function>

	/// <function container="Fit.DragDrop.DropZoneTypeDefs" name="DropEventHandler">
	/// 	<description> Event handler </description>
	/// 	<param name="dropZone" type="Fit.DragDrop.DropZone"> Instance of DropZone to which draggable is dropped </param>
	/// 	<param name="draggable" type="Fit.DragDrop.Draggable"> Instance of Draggable being dropped </param>
	/// </function>

	/// <function container="Fit.DragDrop.DropZoneTypeDefs" name="LeaveEventHandler">
	/// 	<description> Event handler </description>
	/// 	<param name="dropZone" type="Fit.DragDrop.DropZone"> Instance of DropZone from which draggable is moved away </param>
	/// </function>

	/// <function container="Fit.DragDrop.DropZone" name="OnEnter" access="public">
	/// 	<description> Add event handler which gets fired when draggable enters dropzone, ready to be dropped </description>
	/// 	<param name="cb" type="Fit.DragDrop.DropZoneTypeDefs.EnterEventHandler"> Callback (event handler) function - instance of DropZone is passed to function </param>
	/// </function>
	this.OnEnter = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		cfg.OnEnter = cb;
	}

	/// <function container="Fit.DragDrop.DropZone" name="OnDrop" access="public">
	/// 	<description> Add event handler which gets fired when draggable is dropped on dropzone </description>
	/// 	<param name="cb" type="Fit.DragDrop.DropZoneTypeDefs.DropEventHandler"> Callback (event handler) function - instance of DropZone and Draggable is passed to function (in that order) </param>
	/// </function>
	this.OnDrop = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		cfg.OnDrop = cb;
	}

	/// <function container="Fit.DragDrop.DropZone" name="OnLeave" access="public">
	/// 	<description> Add event handler which gets fired when draggable leaves dropzone </description>
	/// 	<param name="cb" type="Fit.DragDrop.DropZoneTypeDefs.LeaveEventHandler"> Callback (event handler) function - instance of DropZone is passed to function </param>
	/// </function>
	this.OnLeave = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		cfg.OnLeave = cb;
	}

	init();
}
Fit.DragDrop.DropZone._internal =
{
	dropzones: [],
	active: null
}
