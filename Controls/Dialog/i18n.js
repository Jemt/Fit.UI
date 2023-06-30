Fit.Internationalization.AddLocalization(Fit.Controls.Dialog,
{
	// Primary locales must be registered before country specific overrides.
	// Example order: en, en_US, en_GB, de, de_AT, etc.
	// All locales inherit from en. All country specific overrides inherit
	// from their general locale (e.g. de_AT inherits from de).
	// English (en) MUST be defined, and be defined first!

	"en":
	{
		"Ok": "OK",
		"Cancel": "Cancel"
	},
	"da":
	{
		"Ok": "OK",
		"Cancel": "Annuller"
	},
	"de":
	{
		"Ok" : "OK",
		"Cancel" : "Abbrechen"
	},
	"no":
	{
		"Ok" : "OK",
		"Cancel" : "Avbryt"
	}
});