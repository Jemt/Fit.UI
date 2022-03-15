(function()
{
	var pluginName = "custombuttons";
	CKEDITOR.plugins.add(pluginName,
	{
		icons: pluginName,
		init: function(editor)
		{
			var regCommand = function(commandName, callback)
			{
				editor.addCommand(commandName, { exec: function(ed) { callback({ Command: this, Editor: ed }); } });
			}

			var buttons = editor.config.customButtons || [];

			for (var i = 0 ; i < buttons.length ; i++)
			{
				var button = buttons[i];

				// Register command
				regCommand(button.Command, button.Callback);

				// Register toolbar button
				editor.ui.addButton(button.Command, // Button name/identifier used to add button to toolbar
				{
					label: button.Label,
					command: button.Command, // Command (name/identifier) to trigger on button click
					icon: button.Icon,
					toolbar: "custombuttons" // Default toolbar group
				});
			}
		}
	});
})();
