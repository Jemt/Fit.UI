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

				// WSDropDown
				Search					: "Search..",
				SearchMore				: "Search for options",
				ShowAllOptions			: "Show available options",
				RemoveAll				: "Remove all selected",
				Remove					: "Remove",
				NoneAvailable			: "List with options is empty"
			}
		},
		"da":
		{
			Translations:
			{
				InvalidSelection		: "Ugyldigt valg",

				// WSDropDown
				Search					: "Søg..",
				SearchMore				: "Søg efter valgmuligheder",
				ShowAllOptions			: "Vis tilgængelige valgmuligheder",
				RemoveAll				: "Fjern alle valgte",
				Remove					: "Fjern",
				NoneAvailable			: "Liste med valgmuligheder er tom"
			}
		},
		"de":
		{
			Translations:
			{
				InvalidSelection		: "Ungültige Auswahl",

				// WSDropDown
				Search					: "Suchen..",
				SearchMore				: "Nach Optionen suchen",
				ShowAllOptions			: "Verfügbare Optionen anzeigen",
				RemoveAll				: "Alle ausgewählten entfernen",
				Remove					: "Entfernen",
				NoneAvailable			: "Liste der Optionen ist leer"
			}
		}
	}
	Fit.Internationalization.AddLocalization(Fit.Controls.DropDown, locale);
	Fit.Internationalization.AddLocalization(Fit.Controls.WSDropDown, locale);
})();