Fit = {};
Fit.Core = {};

/// <function container="Fit.Core" name="Extend" access="public" static="true">
/// 	<description>
/// 		Extend any object with the public members of a super class.
///
/// 		MyClass = function(controlId)
/// 		{
/// 			&#160;&#160;&#160;&#160; Fit.Core.Extend(this, MySuperClass).Apply();
/// 		}
///
/// 		The code above defines a class called MyClass which inherits from MySuperClass.
/// 		Use Apply() to pass variables to the super class constructor as shown below:
///
/// 		Male = function(name, age)
/// 		{
/// 			&#160;&#160;&#160;&#160; Fit.Core.Extend(this, Person).Apply("Male", name, age);
/// 		}
///
/// 		Notice that calling just Extend(..) without calling Apply() on the object returned,
/// 		will not cause inheritance. Apply() must be called, with or without parameters.
/// 	</description>
/// 	<param name="subInstance" type="object"> Instance of sub class </param>
/// 	<param name="superType" type="function"> Class (function) to inherit from </param>
/// </function>
Fit.Core.Extend = function(subInstance, superType)
{
	var binder =
	{
		Apply: function()
		{
			superType.apply(subInstance, arguments);
		}
	}
	return binder;
}

Fit._internal = {};

(function()
{
	var src = document.scripts[document.scripts.length - 1].src;
	Fit._internal.BasePath = src.substring(0, src.lastIndexOf("/"));
})();
