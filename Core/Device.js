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

	var pointerQueriesSupported = window.matchMedia && (window.matchMedia("(any-pointer:coarse)").matches === true || window.matchMedia("(any-pointer:fine)").matches === true);

	// Older touch enabled browsers such as IE11 running on early hybrid devices like Surface tablets, will not have
	// OptimizeForTouch become true because IE11 does not support pointer media queries (e.g. pointer:fine). Furthermore such
	// devices detached from mouse and keyboard (tablet mode) will not have HasMouse become false, also due to the lack of pointer
	// media query support. Too bad - these devices are old and not very common - they will have to rely on the desktop experience.
	// If such devices are required to work with Fit.UI with a touch optimized experience, the UI should allow the user to configure
	// the desired experience, which must ensure that the Fit.Device flags are set appropriately after Fit.UI has loaded, but before
	// any widgets or controls are created.

	// Detect touch support using fairly new maxTouchPoints property (Safari 13+) if possible. If not, then try alternatives.
	// Some browsers on modern devices with support for both touch and mouse returns false for ("ontouchstart" in window),
	// since it historically has been used to detect "touch only" devices. Therefore we also check against ("TouchEvent" in window).
	// However, TouchEvent is present in Chrome, even on "mouse only" devices, so we also need to check against the precision of
	// pointer devices. If any of the available pointers (any-pointer) are coarse, then assume touch support.
	if ((navigator.maxTouchPoints || 0) > 0 || "ontouchstart" in window || ("TouchEvent" in window && window.matchMedia && matchMedia("(any-pointer:coarse)").matches === true))
	{
		Fit.Device.HasTouch = true;
	}

	// Detect lack of high precision pointer device (mouse).
	// If pointer queries are not supported, then assume a mouse is not present if touch capabilities are detected, which
	// will be the case on old touch devices (e.g. Safari v. 8 and below on iOS or Chrome v. 40 and below on Android).
	if ((pointerQueriesSupported === true && matchMedia("(any-pointer:fine)").matches === false) ||
		(pointerQueriesSupported === false && Fit.Device.HasTouch === true))
	{
		Fit.Device.HasMouse = false;
	}

	// Determine whether user experience should be optimized for touch
	if ((pointerQueriesSupported === true && matchMedia("(pointer:coarse)").matches === true) ||				// Optimize for touch if this is the primary pointing device
		(pointerQueriesSupported === false && Fit.Device.HasTouch === true && Fit.Device.HasMouse === false))	// Optimize for touch if this is supported and no mouse is detected
	{
		Fit.Device.OptimizeForTouch = true;
	}
})();
