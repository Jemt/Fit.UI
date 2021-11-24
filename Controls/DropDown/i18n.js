;(function()
{
	var locale = {
		// Primary locales must be registered before country specific overrides.
		// Example order: en, en_US, en_GB, de, de_AT, etc.
		// All locales inherit from en. All country specific overrides inherit
		// from their primary locale (e.g. de_AT inherits from de).
		// English (en) MUST be defined!

		"en": // US
		{
			Translations:
			{
				InvalidSelection		: "Invalid selection",

				SearchMore				: "Search for more options",
				ShowAllOptions			: "Show all available options",
				RemoveAll				: "Remove all selected",
				Remove					: "Remove"
			}
		},
		"da":
		{
			Translations:
			{
				InvalidSelection		: "Ugyldigt valg",

				SearchMore				: "Søg efter flere valgmuligheder",
				ShowAllOptions			: "Vis alle tilgængelige valgmuligheder",
				RemoveAll				: "Fjern alle valgte",
				Remove					: "Fjern"
			}
		},
		"de":
		{
			Translations:
			{
				InvalidSelection		: "Ungültige Auswahl",

				SearchMore				: "Nach weiteren Optionen suchen",
				ShowAllOptions			: "Alle verfügbaren Optionen anzeigen",
				RemoveAll				: "Alle ausgewählten entfernen",
				Remove					: "Entfernen"
			}
		}
	}
	Fit.Internationalization.AddLocalization(Fit.Controls.DropDown, locale);
	Fit.Internationalization.AddLocalization(Fit.Controls.WSDropDown, locale);
})();