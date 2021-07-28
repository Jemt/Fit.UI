/// <container name="Fit.Controls.SoftLog" extends="Fit.Controls.Component">
/// 	The SoftLog is an alternative to the browser's console log which allows for debugging on devices without developer tools.
/// </container>

/// <function container="Fit.Controls.SoftLog" name="SoftLog" access="public">
/// 	<description> Create instance of SoftLog control </description>
/// 	<param name="controlId" type="string" default="undefined">
/// 		Unique control ID that can be used to access control using Fit.Controls.Find(..)
/// 	</param>
/// </function>
Fit.Controls.SoftLog = function(controlId)
{
	Fit.Validation.ExpectStringValue(controlId, true);
	Fit.Core.Extend(this, Fit.Controls.Component).Apply(controlId);

	var me = this;
	var txt = null;
	var maxEntries = 100;
	var height = { Value: -1, Unit: "px" } // Any changes to this line must be dublicated to Height(..)
	var orgConsoleLog = null;
	var exceptionEventHandlerId = -1;

	function init()
	{
		var dom = me.GetDomElement();

		Fit.Dom.AddClass(dom, "FitUiControl");
		Fit.Dom.AddClass(dom, "FitUiControlSoftLog");

		txt = document.createElement("textarea");
		txt.readOnly = true;
		Fit.Dom.Add(dom, txt);
	}

	/// <function container="Fit.Controls.SoftLog" name="CatchUncaughtExceptions" access="public" returns="boolean">
	/// 	<description> Get/set value determining whether to catch unhandled exceptions </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables exception logging, False disables it </param>
	/// </function>
	this.CatchUncaughtExceptions = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true && exceptionEventHandlerId === -1)
			{
				exceptionEventHandlerId = Fit.Events.AddHandler(window, "error", function(e) // IE10+ is required (https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent)
				{
					var ev = Fit.Events.GetEvent(e);
					me.Log(ev.message + " (" + ev.filename + ":" + ev.lineno + ")");
				});
			}
			else if (val === false && exceptionEventHandlerId !== -1)
			{
				Fit.Events.RemoveHandler(window, exceptionEventHandlerId);
				exceptionEventHandlerId = -1;
			}
		}

		return exceptionEventHandlerId !== -1;
	}

	/// <function container="Fit.Controls.SoftLog" name="InterceptConsoleLog" access="public" returns="boolean">
	/// 	<description> Get/set value determining whether to intercept console.log(..) </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables console.log(..) interception, False disables it </param>
	/// </function>
	this.InterceptConsoleLog = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val === true && orgConsoleLog === null)
			{
				orgConsoleLog = window.console.log;

				window.console.log = function()
				{
					orgConsoleLog.apply(this, arguments);

					Fit.Array.ForEach(arguments, function(arg)
					{
						if (Fit.Array.Contains(["string", "number", "function", "boolean"], typeof(arg)))
						{
							me.Log(arg.toString());
						}
						else if (arg === null || arg === undefined)
						{
							me.Log(arg + "");
						}
						else if (arg.tagName && arg.outerHTML)
						{
							me.Log(arg.cloneNode(false).outerHTML);
						}
						else
						{
							me.Log(JSON.stringify(arg));
						}
					});
				}
			}
			else if (val === false && orgConsoleLog !== null)
			{
				window.console.log = orgConsoleLog;
				orgConsoleLog = null;
			}
		}

		return orgConsoleLog !== null;
	}

	/// <function container="Fit.Controls.SoftLog" name="MaxEntries" access="public" returns="integer">
	/// 	<description> Get/set number of log entries preserved </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, changes number of log entries preserved </param>
	/// </function>
	this.MaxEntries = function(val)
	{
		Fit.Validation.ExpectInteger(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > 0)
			{
				maxEntries = val;
				trimLog(false);
			}
			else
			{
				maxEntries = -1;
			}
		}

		return maxEntries;
	}

	/// <function container="Fit.Controls.SoftLog" name="Height" access="public" returns="Fit.TypeDefs.CssValue">
	/// 	<description> Get/set control height - returns object with Value and Unit properties </description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control height is updated to specified value. A value of -1 resets control height. </param>
	/// 	<param name="unit" type="Fit.TypeDefs.CssUnit" default="px"> If defined, control height is updated to specified CSS unit </param>
	/// </function>
	this.Height = function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1)
			{
				height = { Value: val, Unit: ((Fit.Validation.IsSet(unit) === true) ? unit : "px") };
				txt.style.height = height.Value + height.Unit;
			}
			else
			{
				height = { Value: -1, Unit: "px" }; // Any changes to this line must be dublicated to line declaring the height variable !
				txt.style.height = "";
			}
		}

		return height;
	}

	/// <function container="Fit.Controls.SoftLog" name="Log" access="public">
	/// 	<description> Log message </description>
	/// 	<param name="msg" type="string"> Text message to log </param>
	/// </function>
	this.Log = function(msg)
	{
		Fit.Validation.ExpectString(msg);

		var dt = new Date();
		var ms = dt.getMilliseconds();
		var time = Fit.Date.Format(dt, "hh:mm:ss") + "." + (ms === 0 ? "000" : ms < 10 ? "00" + ms : ms < 100 ? "0" + ms : ms);

		trimLog(true);

		txt.value += (txt.value !== "" ? "\n" : "") + time + ": " + msg.replace(/\r/g, "").replace(/\n/g, " ");
		txt.scrollLeft = 0;
		txt.scrollTop = 999999;
	}

	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		if (orgConsoleLog !== null)
		{
			window.console.log = orgConsoleLog;
		}

		if (exceptionEventHandlerId !== -1)
		{
			Fit.Events.RemoveHandler(window, exceptionEventHandlerId);
		}

		me = txt = maxEntries = height = orgConsoleLog = exceptionEventHandlerId = null;

		base();
	});

	function trimLog(leaveRoomForNewLogEntry)
	{
		Fit.Validation.ExpectBoolean(leaveRoomForNewLogEntry);

		if (maxEntries > 0)
		{
			var messages = txt.value !== "" ? txt.value.split("\n") : [];

			if (messages.length >= maxEntries)
			{
				messages = maxEntries === 1 && leaveRoomForNewLogEntry === true ? [] : messages.slice((maxEntries - (leaveRoomForNewLogEntry === true ? 1 : 0)) * -1);
			}

			txt.value = messages.join("\n");
		}
	}

	init();
}