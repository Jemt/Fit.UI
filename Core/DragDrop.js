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

    var elm = domElm;
	var trgElm = (domTriggerElm ? domTriggerElm : null);
    var me = this;

    var onDragStart = null;
    var onDragging = null;
	var onDragStop = null;

	var mouseDownEventId = -1;

    // Construct

    function init()
    {
		Fit._internal.Core.EnsureStyles();

        Fit.Dom.AddClass(elm, "FitDragDropDraggable");
        Fit.Dom.AddClass((trgElm !== null ? trgElm : elm), "FitDragDropDraggableHandle");

        // Mouse down

        mouseDownEventId = Fit.Events.AddHandler(((trgElm !== null) ? trgElm : elm), "mousedown", function(e)
        {
            var ev = e || window.event;

			if (Fit.DragDrop.Draggable._internal.active !== null)
				return; // Skip - current element is a draggable parent to which event propagated

            Fit.Dom.AddClass(elm, "FitDragDropDragging");

            // Mouse position in viewport
            var mouseXviewport = (ev.clientX || e.pageX);
            var mouseYviewport = (ev.clientY || e.pageY);

            // Make sure element being dragged is on top of every other draggable element
            Fit.DragDrop.Draggable._internal.zIndex++;
            elm.style.zIndex = Fit.DragDrop.Draggable._internal.zIndex;

            // Create state information object for draggable currently being dragged
            var state =
            {
                Draggable: me,
                Positioning: (Fit.Dom.GetComputedStyle(elm, "position") === "absolute" ? "absolute" : "relative"),
                Mouse: {Viewport: {X: -1, Y: -1}, Document: {X: -1, Y: -1}},
                Position: {Viewport: {X: -1, Y: -1}, Document: {X: -1, Y: -1}, Offset: {X: -1, Y: -1}},
                Events: { OnDragStart: onDragStart, OnDragging: onDragging, OnDragStop: onDragStop },
                OnSelectStart : document.onselectstart
            };

            // Disable text selection for legacy browsers
            document.onselectstart = function() { return false; }

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

            if (state.Events.OnDragStart)
                state.Events.OnDragStart(elm);

            /*if (ev.preventDefault)
                ev.preventDefault();
            ev.cancelBubble = true;*/
        });

        // Mouse Up

        if (Fit.DragDrop.Draggable._internal.mouseUpRegistered === false)
        {
            Fit.DragDrop.Draggable._internal.mouseUpRegistered = true;

            Fit.Events.AddHandler(document, "mouseup", function(e)
            {
                if (Fit.DragDrop.Draggable._internal.active === null)
                    return;

                var ev = e || window.event;

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

				// Fire OnDragStop after OnDrop to make sure OnDragStop can act
				// depending on whether draggable was dropped on a dropzone or not.

				if (draggableState.Events.OnDragStop)
                    draggableState.Events.OnDragStop(draggable);

                // Restore OnSelectStart event
                document.onselectstart = draggableState.OnSelectStart;
            });
        }

        // Mouse move

        if (Fit.DragDrop.Draggable._internal.mouseMoveRegistered === false)
        {
            Fit.DragDrop.Draggable._internal.mouseMoveRegistered = true;

            Fit.Events.AddHandler(document, "mousemove", function(e)
            {
                if (Fit.DragDrop.Draggable._internal.active === null)
					return;

                var ev = e || window.event;

                // Handle draggable

                var state = Fit.DragDrop.Draggable._internal.active;
                var draggable = state.Draggable;
                var elm = draggable.GetElement();

                // Mouse position in viewport
                var mouseXviewport = (ev.clientX || e.pageX);
                var mouseYviewport = (ev.clientY || e.pageY);

                // Mouse position in document.
                // Potential performance optimization: Only call GetScrollPosition if element
                // is contained in scrollable element. If not, use window.scrollX/Y instead!
                //var mouseXdocument = mouseXviewport + window.scrollX;
                //var mouseYdocument = mouseYviewport + window.scrollY;
                var scrollPos = Fit.Dom.GetScrollPosition(elm);
                var mouseXdocument = mouseXviewport + scrollPos.X;
                var mouseYdocument = mouseYviewport + scrollPos.Y;

                if (Fit.DragDrop.Draggable._internal.active.Positioning === "absolute")
                {
                    // Mouse position within draggable
                    var mouseFromLeft = state.Mouse.Viewport.X - state.Position.Viewport.X;
                    var mouseFromTop = state.Mouse.Viewport.Y - state.Position.Viewport.Y;

                    elm.style.position = "absolute";
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
            });
        }
    }

    // Public

	/// <function container="Fit.DragDrop.Draggable" name="Reset" access="public">
	/// 	<description> Reset draggable to initial position </description>
	/// </function>
    this.Reset = function()
    {
        elm.style.position = "";
        elm.style.left = "";
        elm.style.top = "";
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

		Fit.Events.RemoveHandler(((trgElm !== null) ? trgElm : elm), mouseDownEventId);

		me = elm = trgElm = onDragStart = onDragging = onDragStop = mouseDownEventId = null;
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
    zIndex : 10000,
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
