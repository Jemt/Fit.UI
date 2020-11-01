var view = new Fit.Template(true);
view.AllowUnsafeContent(false);
view.LoadUrl("debug.html", function(sender)
{
	var item = null;

	var input = new Fit.Controls.Input(Fit.Data.CreateGuid());
	input.Value("Hello world");
	item = view.Content.Controls.AddItem();
	item.Control = input.GetDomElement();

	var datepicker = new Fit.Controls.DatePicker(Fit.Data.CreateGuid());
	datepicker.Date(new Date());
	item = view.Content.Controls.AddItem();
	item.Control = datepicker.GetDomElement();

	var button = new Fit.Controls.Button();
	button.Icon("cog");
	button.Title("Configure");
	item = view.Content.Controls.AddItem();
	item.Control = button.GetDomElement();

	view.Update();
});
view.Render(document.body);