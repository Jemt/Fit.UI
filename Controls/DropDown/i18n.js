Fit.Internationalization.AddLocalization(Fit.Controls.DropDown,
{
	// Primary locales must be registered before country specific overrides.
	// Example order: en, en_US, en_GB, de, de_AT, etc.
	// All locales inherit from en. All country specific overrides inherit
	// from their primary locale (e.g. de_AT inherits from de).
	// English (en) MUST be defined!
	
	"en": // US
	{
		Translations:
		{
			InvalidSelection		: "Invalid selection"
		}
	},
	"da":
	{
		Translations:
		{
			InvalidSelection		: "Ugyldigt valg"
		}
	},
	"de":
	{
		Translations:
		{
			InvalidSelection		: "Ungültige Auswahl"
		}
	}
});
