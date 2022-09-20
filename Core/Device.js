/// <container name="Fit.Device">
/// 	Provides access to device information.
/// </container>
Fit.Device =
{
	// Assuming ordinary desktop device by default - touch support is determined further down

	HasMouse: true,
	HasTouch: false,

	/// <member container="Fit.Device" name="OptimizeForTouch" static="true" type="boolean"> Flag indicating whether user experience should be optimized for touch interaction </member>
	OptimizeForTouch: false
};

(function()
{
	// Inspired by https://github.com/rafgraph/detect-it

	// Browser support:
	// matchMedia(..)				Chrome 9+	IE 10+	Safari 5.1+		https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
	// maxTouchPoints				Chrome 35+	IE 11+	Safari 13+		https://developer.mozilla.org/en-US/docs/Web/API/Navigator/maxTouchPoints
	// Pointer media queries		Chrome 41+	Edge12	Safari 9+		https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer

	// Older touch enabled browsers such as IE11 running on early hybrid devices like Surface tablets, will not have
	// OptimizeForTouch become true because IE11 does not support pointer media queries (e.g. pointer:fine). Furthermore such
	// devices detached from mouse and keyboard (tablet mode) will not have HasMouse become false, also due to the lack of pointer
	// media query support. Too bad - these devices are old and not very common - they will have to rely on the desktop experience.
	// If such devices are required to work with Fit.UI with a touch optimized experience, the UI should allow the user to configure
	// the desired experience, which must ensure that the Fit.Device flags are set appropriately after Fit.UI has loaded, but before
	// any widgets or controls are created.

	// Detect lack of high precision pointer device (mouse)
	if (window.matchMedia && matchMedia("(pointer:fine)").matches === false) // Will not detect e.g. IE11 in "tablet mode" - see comment above
	{
		Fit.Device.HasMouse = false;
	}

	// Detect touch support using fairly new maxTouchPoints property (Safari 13+) if possible. If not, then try alternatives.
	// Some browsers on modern devices with support for both touch and mouse returns false for ("ontouchstart" in window),
	// since it historically has been used to detect "touch only" devices. Therefore we also check against ("TouchEvent" in window).
	// However, TouchEvent is present in Chrome, even on "mouse only" devices, so we also need to check against the precision of
	// pointer devices. If any of the available pointers (any-pointer) are coarse, then assume touch support.
	if ((navigator.maxTouchPoints || 0) > 0 || "ontouchstart" in window || ("TouchEvent" in window && window.matchMedia && matchMedia("(any-pointer:coarse)").matches === true))
	{
		Fit.Device.HasTouch = true;
	}

	// Determine whether user experience should be optimized for touch.
	// Obviously we should optimize for touch if touch is supported and no mouse is present.
	if (Fit.Device.HasTouch === true && Fit.Device.HasMouse === false)
	{
		Fit.Device.OptimizeForTouch = true;
	}
})();
