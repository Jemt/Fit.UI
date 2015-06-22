Fit.DragDrop = {};

/*

TODO: Ryd op i Draggable og Dropzone!
      Properties på objekt i _internal.active og objekter i _internal.dropzones
      bør være instanser af Draggable og DropZone, som blot eksponerer en funktion
      der giver adgang til relevante properties. Saml det sammen!

      Performance-test: Hvordan fungerer det med 3000 draggable elementer og 1000 dropzones?

*/





// Draggable

/// <function container="Fit.DragDrop.Draggable" name="Draggable" access="public">
/// 	<description> Constructor - create instance of Draggable class </description>
/// 	<param name="domElm" type="DOMElement"> Element to turn into draggable object </param>
/// </function>
Fit.DragDrop.Draggable = function(domElm)
{
    // Private properties

    var elm = domElm;
    var me = this;

    var onDragStart = null;
    var onDragging = null;
    var onDragStop = null;

    // Construct

    function init()
    {
        Fit.Dom.AddClass(elm, "FitDragDropDraggable");

        // Mouse down

        Fit.Events.AddHandler(elm, "mousedown", function(e)
        {
            var ev = e || window.event;

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

            if (Fit.Dom.HasClass(elm, "FitDragDropDropzone") === true)
            {
                // Find draggable dropzone in dropzones collection
                var draggableDropzone = null;
                Fit.Array.ForEach(Fit.DragDrop.Dropzone._internal.dropzones, function(dzState)
                {
                    if (dzState.Dropzone.GetElement() === elm)
                    {
                        draggableDropzone = dzState;
                        return false;
                    }
                });

                // Move dropzone to end of collection
                Fit.Array.Remove(Fit.DragDrop.Dropzone._internal.dropzones, draggableDropzone);
                Fit.Array.Add(Fit.DragDrop.Dropzone._internal.dropzones, draggableDropzone);
            }

            if (state.Events.OnDragStart)
                state.Events.OnDragStart(elm);

            // NECESSARY?
            if (ev.preventDefault)
                ev.preventDefault();
            ev.cancelBubble = true;
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

                var dropzoneState = Fit.DragDrop.Dropzone._internal.active
                var dropzone = (dropzoneState !== null ? dropzoneState.Dropzone : null);

                // Handle draggable

                Fit.Dom.RemoveClass(draggable.GetElement(), "FitDragDropDragging");
                Fit.DragDrop.Draggable._internal.active = null;

                if (draggableState.Events.OnDragStop)
                    draggableState.Events.OnDragStop(draggable);

                // Handle active dropzone

                if (dropzoneState !== null)
                {
                    Fit.Dom.RemoveClass(dropzone.GetElement(), "FitDragDropDropzoneActive");
                    Fit.DragDrop.Dropzone._internal.active = null;

                    if (dropzoneState.OnDrop)
                        dropzoneState.OnDrop(dropzone, draggable);
                }

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
                mouseXdocument = mouseXviewport + scrollPos.X;
                mouseYdocument = mouseYviewport + scrollPos.Y;

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
                var previouslyActiveDropzone = Fit.DragDrop.Dropzone._internal.active;
                var dropzoneActive = null;

                // Find active dropzone.
                // NOTICE: If dropzones are floated on top of each other, make sure they are added to the
                // internal dropzones collection in order of appearance to make sure the correct dropzone
                // is turned active.
                Fit.Array.ForEach(Fit.DragDrop.Dropzone._internal.dropzones, function(dzState)
                {
                    dropzone = dzState.Dropzone;
                    dropzoneElement = dropzone.GetElement();

                    pos = Fit.Dom.GetPosition(dropzoneElement, true);
                    dropZoneX = pos.X;
                    dropZoneY = pos.Y;

                    var dropzoneFound = (dropzoneActive === null);
                    var dropzoneDeeperThanPreviouslyFound = (dropzoneActive === null || Fit.Dom.GetDepth(dropzoneElement) > Fit.Dom.GetDepth(dropzoneActive.Dropzone.GetElement()));
                    var dropzoneCurrentlyBeingDragged = (Fit.Dom.HasClass(dropzoneElement, "FitDragDropDragging") === true);
                    var draggableHoveringDropzone = (mouseXviewport > dropZoneX && mouseXviewport < (dropZoneX + dropzoneElement.offsetWidth) && mouseYviewport > dropZoneY && mouseYviewport < (dropZoneY + dropzoneElement.offsetHeight));

                    if ((dropzoneFound === false || dropzoneDeeperThanPreviouslyFound === true) && dropzoneCurrentlyBeingDragged === false && draggableHoveringDropzone === true)
                    {
                        dropzoneActive = dzState;
                    }
                });

                // Leave previously active dropzone if no longer active
                if (previouslyActiveDropzone !== null && dropzoneActive !== previouslyActiveDropzone)
                {
                    Fit.Dom.RemoveClass(previouslyActiveDropzone.Dropzone.GetElement(), "FitDragDropDropzoneActive");
                    Fit.DragDrop.Dropzone._internal.active = null;

                    if (previouslyActiveDropzone.OnLeave)
                        previouslyActiveDropzone.OnLeave(previouslyActiveDropzone.Dropzone);
                }

                // Mark dropzone active if not already done
                if (dropzoneActive !== null && dropzoneActive !== previouslyActiveDropzone)
                {
                    Fit.Dom.AddClass(dropzoneActive.Dropzone.GetElement(), "FitDragDropDropzoneActive");
                    Fit.DragDrop.Dropzone._internal.active = dropzoneActive;

                    if (dropzoneActive.OnEnter)
                        dropzoneActive.OnEnter(dropzoneActive.Dropzone);
                }
            });
        }
    }
    init();

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

	/// <function container="Fit.DragDrop.Draggable" name="GetElement" access="public" returns="DOMElement">
	/// 	<description> Get draggable DOM element </description>
	/// </function>
    this.GetElement = function()
    {
        return elm;
    }

    // Event handling
	// TODO: Allow multiple event handlers !!!

    /// <function container="Fit.DragDrop.Draggable" name="OnDragStart" access="public">
	/// 	<description> Add event handler which gets fired when dragging starts </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - draggable DOM element is passed to function </param>
	/// </function>
	this.OnDragStart = function(cb)
    {
        onDragStart = cb;
    }

	/// <function container="Fit.DragDrop.Draggable" name="OnDragging" access="public">
	/// 	<description> Add event handler which constantly gets fired when dragging takes place </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - draggable DOM element is passed to function </param>
	/// </function>
    this.OnDragging = function(cb)
    {
        onDragging = cb;
    }

    /// <function container="Fit.DragDrop.Draggable" name="OnDragStop" access="public">
	/// 	<description> Add event handler which gets fired when dragging stops </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - draggable DOM element is passed to function </param>
	/// </function>
	this.OnDragStop = function(cb)
    {
        onDragStop = cb;
    }
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

// Dropzone

/// <function container="Fit.DragDrop.Dropzone" name="Dropzone" access="public">
/// 	<description> Constructor - create instance of Dropzone class </description>
/// 	<param name="domElm" type="DOMElement"> Element to turn into dropzone object </param>
/// </function>
Fit.DragDrop.Dropzone = function(domElm)
{
    var elm = domElm;

    var cfg =
    {
        Dropzone: this,
        OnEnter: null,
        OnDrop: null,
        OnLeave: null
    };

    function init()
    {
        Fit.Dom.AddClass(elm, "FitDragDropDropzone");
        Fit.DragDrop.Dropzone._internal.dropzones.push(cfg);
    }
    init();

	/// <function container="Fit.DragDrop.Dropzone" name="GetElement" access="public" returns="DOMElement">
	/// 	<description> Get dropzone DOM element </description>
	/// </function>
    this.GetElement = function()
    {
        return elm;
    }

	// Event handling
	// TODO: Allow multiple event handlers !!!

    /// <function container="Fit.DragDrop.Dropzone" name="OnEnter" access="public">
	/// 	<description> Add event handler which gets fired when draggable enters dropzone, ready to be dropped </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - instance of Dropzone is passed to function </param>
	/// </function>
	this.OnEnter = function(cb)
    {
        cfg.OnEnter = cb;
    }

    /// <function container="Fit.DragDrop.Dropzone" name="OnDrop" access="public">
	/// 	<description> Add event handler which gets fired when draggable is dropped on dropzone </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - instance of Dropzone and Draggable is passed to function (in that order) </param>
	/// </function>
	this.OnDrop = function(cb)
    {
        cfg.OnDrop = cb;
    }

	/// <function container="Fit.DragDrop.Dropzone" name="OnLeave" access="public">
	/// 	<description> Add event handler which gets fired when draggable leaves dropzone </description>
	/// 	<param name="cb" type="function"> Callback (event handler) function - instance of Dropzone is passed to function </param>
	/// </function>
    this.OnLeave = function(cb)
    {
        cfg.OnLeave = cb;
    }
}
Fit.DragDrop.Dropzone._internal =
{
    dropzones: [],
    active: null
}
