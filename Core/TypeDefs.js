// ======================================
// Common type defintions
// ======================================

Fit.TypeDefs = {};

/// <container name="Fit.TypeDefs.Position">
/// 	<description> Position of a visual object from top and left </description>
/// 	<member name="X" type="integer"> Position from left </member>
/// 	<member name="Y" type="integer"> Position from top </member>
/// </container>

/// <container name="Fit.TypeDefs.Dimension">
/// 	<description> Represents the size of a visual object </description>
/// 	<member name="Width" type="integer"> Object width </member>
/// 	<member name="Height" type="integer"> Object height </member>
/// </container>

/// <container name="Fit.TypeDefs.CssUnit">
/// 	<description> Represents a CSS unit </description>
/// 	<member name="cm" access="public" static="true" type="string" default="cm"> </member>
/// 	<member name="mm" access="public" static="true" type="string" default="mm"> </member>
/// 	<member name="in" access="public" static="true" type="string" default="in"> </member>
/// 	<member name="px" access="public" static="true" type="string" default="px"> </member>
/// 	<member name="pt" access="public" static="true" type="string" default="pt"> </member>
/// 	<member name="pc" access="public" static="true" type="string" default="pc"> </member>
/// 	<member name="em" access="public" static="true" type="string" default="em"> </member>
/// 	<member name="ex" access="public" static="true" type="string" default="ex"> </member>
/// 	<member name="ch" access="public" static="true" type="string" default="ch"> </member>
/// 	<member name="rem" access="public" static="true" type="string" default="rem"> </member>
/// 	<member name="vw" access="public" static="true" type="string" default="vw"> </member>
/// 	<member name="vh" access="public" static="true" type="string" default="vh"> </member>
/// 	<member name="vmin" access="public" static="true" type="string" default="vmin"> </member>
/// 	<member name="vmax" access="public" static="true" type="string" default="vmax"> </member>
/// 	<member name="%" access="public" static="true" type="string" default="%"> </member>
/// </container>
Fit.TypeDefs.CssUnit = // Enums must exist runtime
{
	"cm":"cm", "mm":"mm", "in":"in", "px":"px", "pt":"pt", "pc":"pc", "em":"em", "ex":"ex",
	"ch":"ch", "rem":"rem", "vw":"vw", "vh":"vh", "vmin":"vmin", "vmax":"vmax", "%":"%"
};

/// <container name="Fit.TypeDefs.CssValue">
/// 	<description> Represents a CSS value </description>
/// 	<member name="Value" type="number"> Value </member>
/// 	<member name="Unit" type="Fit.TypeDefs.CssUnit"> Unit </member>
/// </container>