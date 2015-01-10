Fit = {};
Fit.Core = {};

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
