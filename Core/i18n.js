Fit.Internationalization._internal.AddSystemLocalization(
{
	// Primary locales must be registered before language specific overrides.
	// Example order: en, en_US, en_GB, de, de_AT, etc.
	// All locales inherit from en. All country specific overrides inherit
	// from their primary locale (e.g. de_AT inherits from de).
	// English (en) MUST be defined!
	
	"en": // US
	{
		Formatting:
		{
			DecimalSeparator		: ".",
			ThousandsSeparator		: ",",
			DateFormat				: "MM/DD/YYYY",
			TimeFormat				: "hh:mm",
			TimeFormatLong			: "hh:mm:ss",
			ClockHours				: 12 // 24 or 12 (AM/PM)
		},
		Translations:
		{
			Required				: "Field is required"
		}
	},
	"en_GB":
	{
		Formatting:
		{
			DateFormat				: "DD/MM/YYYY"
		}
	},
	"da":
	{
		Formatting:
		{
			DecimalSeparator		: ",",
			ThousandsSeparator		: ".",
			DateFormat				: "DD-MM-YYYY",
			ClockHours				: 24
		},
		Translations:
		{
			Required				: "Feltet er påkrævet"
		}
	},
	"de":
	{
		Formatting:
		{
			DecimalSeparator		: ",",
			ThousandsSeparator		: ".",
			DateFormat				: "DD.MM.YYYY",
			ClockHours				: 24
		},
		Translations:
		{
			Required				: "Feld ist erforderlich"
		}
	}
});
