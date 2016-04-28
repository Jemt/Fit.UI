Tests.Focus = function()
{
	var tv = new Fit.Controls.TreeView("FitUiTreeViewTest1");
	tv.AddChild(new Fit.Controls.TreeView.Node("Test", "Test"));

	Fit.Core.Extend(this, ControlBase.Focus).Apply(tv, "TreeView");
}

Tests.OnChange = function()
{
	var tv = new Fit.Controls.TreeView("FitUiTreeViewTest2");
	tv.AddChild(new Fit.Controls.TreeView.Node("Test", "Test"));

	Fit.Core.Extend(this, ControlBase.OnChange).Apply(tv, "TreeView");
}
