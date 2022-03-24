/// <container name="Fit.Controls.DialogEditor" extends="Fit.Controls.Dialog">
/// 	Dialog containing HTML editor for rich text editing
/// </container>

/// <function container="Fit.Controls.DialogEditor" name="DialogEditor" access="public">
/// 	<description> Create instance of DialogEditor control </description>
/// 	<param name="controlId" type="string" default="undefined"> Unique control ID that can be used to access control using Fit.Controls.Find(..) </param>
/// </function>
Fit.Controls.DialogEditor = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId, true);
	Fit.Core.Extend(this, Fit.Controls.Dialog).Apply(ctlId);

	var me = this;
	var ed = null;
	var updatedConfig = null;

	function init()
	{
		Fit.Dom.AddClass(me.GetDomElement(), "FitUiControlDialogEditor");

		ed = new Fit.Controls.Input();
		ed.Width(100, "%");
		ed.Height(100, "%");
		ed.Render(me.GetContentDomElement());

		// Performance optimization:
		// The editor internally fires OnChange on every change which is expensive.
		// By configuring OnChange debouncing, we can greatly increase performance,
		// especially for large documents, which is what DialogEditor is intended for.
		// The only downside to this is that ControlBase will not be able to update IsDirty
		// and IsValid state in the control's data-dirty and data-valid DOM attributes.
		// Control will always fire OnChange immediately when the editor lose focus though.
		ed.DebounceOnChange(5000); // Only process OnChange every 5 seconds - we don't rely on OnChange or the data-dirty and data-valid attributes

		// me.Modal(true);
		// me.Maximizable(true);
		// me.Dismissible(true);
		// me.Resizable(true);
		// me.Draggable(true);

		me.Width(850);
		me.MinimumWidth(20, "em");
		me.MaximumWidth(100, "%");

		me.Height(550);
		me.MinimumHeight(15, "em");
		me.MaximumHeight(100, "%");
	}

	// ============================================
	// Public - overrides
	// ============================================

	this.Open = Fit.Core.CreateOverride(this.Open, function(toElement)
	{
		Fit.Validation.ExpectDomElement(toElement, true);

		if (ed.DesignMode() === false || updatedConfig !== null)
		{
			ed.DesignMode(true, updatedConfig || undefined);
			updatedConfig = null
		}

		base(toElement);
		ed.Focused(true);
	});

	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		ed.Dispose();
		base();

		me = ed = updatedConfig = null;
	});

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.DialogEditor" name="Placeholder" access="public" returns="string">
	/// 	<description> Get/set value used as a placeholder to indicate expected input on supported browsers </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, value is set as placeholder </param>
	/// </function>
	this.Placeholder = function(val)
	{
		Fit.Validation.ExpectString(val, true);
		return ed.Placeholder(val);
	}

	/// <function container="Fit.Controls.DialogEditor" name="CheckSpelling" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control should have spell checking enabled (default) or disabled </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, true enables spell checking while false disables it </param>
	/// </function>
	this.CheckSpelling = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);
		return ed.CheckSpelling(val);
	}

	/// <function container="Fit.Controls.DialogEditor" name="Value" access="public" returns="string">
	/// 	<description> Get/set editor control value </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, value is inserted into control </param>
	/// </function>
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);
		return ed.Value(val);
	}

	/// <function container="Fit.Controls.DialogEditor" name="IsDirty" access="public" returns="boolean">
	/// 	<description> Get value indicating whether user has changed control value </description>
	/// </function>
	this.IsDirty = function()
	{
		return ed.IsDirty();
	}

	/// <function container="Fit.Controls.DialogEditor" name="Enabled" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is enabled or disabled </description>
	/// 	<param name="val" type="boolean" default="undefined">
	/// 		If defined, True enables control (default), False disables control.
	/// 	</param>
	/// </function>
	this.Enabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);
		return ed.Enabled(val);
	}

	/// <function container="Fit.Controls.DialogEditor" name="Focused" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set value indicating whether editor control has focus.
	/// 		Dialog must be open and visible for focus assignment to work.
	/// 	</description>
	/// 	<param name="value" type="boolean" default="undefined"> If defined, True assigns focus, False removes focus (blur) </param>
	/// </function>
	this.Focused = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);
		return ed.Focused(val);
	}

	// ============================================
	// Protected
	// ============================================

	this._internal = this._internal || {};
	this._internal.SetDesignModeConfig = function(config) // Allow Input control (DesignMode) to update editor within dialog (detached editing) - config object validated in DesignMode(..)
	{
		if (me.IsOpen() === true)
		{
			ed.DesignMode(true, config);
		}
		else
		{
			updatedConfig = config;
		}
	}

	init();
}