Fit.Internationalization.Locale("da");

var view = new Fit.Template(true);
view.AllowUnsafeContent(false);
view.LoadUrl("debug.html", function(sender)
{
	var item = null;

    window.input = new Fit.Controls.Input(Fit.Data.CreateGuid());
	//input.Value("Velkommen til vores online demo :-)<br><br>");
	input.Width(800);
	input.Height(550);
	input.DesignMode(true);
    item = view.Content.Controls.AddItem();
    item.Control = input.GetDomElement();

    view.Update();
});
view.Render(document.body);