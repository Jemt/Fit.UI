Fit.Internationalization = { _internal: { Locale: "en", Locales: {}, Additions: {}, OnChangeHandlers: [] } };

// ====================================================
// Locales
// ====================================================

Fit.Internationalization._internal.AddSystemLocalization = function(locales) // May be called multiple times, e.g. if splitting languages up into several files
{
	Fit.Validation.ExpectObject(locales);

	// Make sure all locales inherit from "en", and make sure country specific
	// overrides (e.g. de_AT) inherits from their primary locale (e.g. de).

	Fit.Array.ForEach(locales, function(localeKey)
	{
		var key = localeKey.toLowerCase();
		var locale = null;

		if (key !== "en") // E.g. da or de_AT
		{
			// Merge everything from "en" to current locale

			var english = locales["en"] || Fit.Internationalization._internal.Locales["en"] || null;

			if (english === null)
				Fit.Validation.ThrowError("Unexpected error - English not defined in System Locales");

			locale = Fit.Core.Merge(english, locales[localeKey]);
		}
		else // en
		{
			locale = locales[localeKey];
		}

		// For country specific locales, merge everything from their parent (e.g. de_AT inherits from de)
		if (key.indexOf("_") !== -1) // E.g. de_AT
		{
			// Merge e.g. de_AT with de

			var primaryLangKey = key.split("_")[0]; // E.g. de_AT => de
			var primaryLocale = locales[primaryLangKey] || Fit.Internationalization._internal.Locales[primaryLangKey] || null;

			if (primaryLocale === null)
				Fit.Validation.ThrowError("Unexpected error - '" + primaryLangKey + "' not defined in System Locales");

			locale = Fit.Core.Merge(primaryLocale, locales[localeKey]);
		}

		Fit.Internationalization._internal.Locales[key] = locale;
	});
}

/// <function container="Fit.Internationalization" name="GetSystemLocale" access="public" static="true" returns="object">
/// 	<description>
/// 		Get locale object such as:
/// 		{
/// 		&#8239;&#8239;&#8239;&#8239; Formatting:
/// 		&#8239;&#8239;&#8239;&#8239; {
/// 		&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239; DecimalSeparator: '.',
/// 		&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239; ThousandsSeparator: ',',
/// 		&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239; DateFormat: 'MM/DD/YYYY',
/// 		&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239; TimeFormat: 'hh:mm',
/// 		&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239; TimeFormatLong: 'hh:mm:ss',
/// 		&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239; ClockHours: 12 // 24 or 12 (AM/PM)
/// 		&#8239;&#8239;&#8239;&#8239; },
/// 		&#8239;&#8239;&#8239;&#8239; Translations:
/// 		&#8239;&#8239;&#8239;&#8239; {
/// 		&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239; Required: 'Field is required'
/// 		&#8239;&#8239;&#8239;&#8239; }
/// 		}
/// 	</description>
/// 	<param name="localeKey" type="string" default="undefined">
/// 		If defined, specified locale such as en, en_GB, or da is returned. If not
/// 		found, en (en_US) is returned. If omitted, current locale is returned.
/// 	</param>
/// </function>
Fit.Internationalization.GetSystemLocale = function(localeKey)
{
	Fit.Validation.ExpectString(localeKey, true);

	var locale = localeKey ? localeKey.toLowerCase() : Fit.Internationalization._internal.Locale;

	// Get locale

	var locales = Fit.Internationalization._internal.Locales;
	var found = locales[locale] || null;

	// In case e.g. de_AT is loaded, but not found, try to load de instead

	if (found === null && locale.indexOf("_") !== -1) // E.g. de_AT
	{
		var key = locale.split("_")[0]; // E.g. de_AT => de
		found = locales[key] || null;
	}

	// If specified locale is not found then fall back to English

	if (found === null)
	{
		found = locales["en"] || null; // English MUST exist!
	}

	if (found === null)
	{
		Fit.Validation.ThrowError("Unexpected error - English not defined in System Locales");
	}

	return Fit.Core.Clone(found); // Clone to avoid changes
}

/// <function container="Fit.Internationalization" name="Locale" access="public" static="true" returns="string">
/// 	<description>
/// 		Get/set active locale. Value returned is a lower cased string such as
/// 		&quot;en&quot;, &quot;en_us&quot;, &quot;de&quot;, etc. Changing locale results in OnLocaleChanged being fired.
/// 	</description>
/// 	<param name="locale" type="string" default="undefined"> If defined, locale is updated with specified value (e.g. en, en_GB, da, etc.) </param>
/// </function>
Fit.Internationalization.Locale = function(locale)
{
	Fit.Validation.ExpectString(locale, true);

	if (Fit.Validation.IsSet(locale) === true)
	{
		var key = locale.toLowerCase();

		if (Fit.Core.IsEqual(Fit.Internationalization.GetSystemLocale(key), Fit.Internationalization.GetSystemLocale()) === false)
		{
			Fit.Internationalization._internal.Locale = key;

			Fit.Array.ForEach(Fit.Array.Copy(Fit.Internationalization._internal.OnChangeHandlers), function(onChangeHandler)
			{
				if (onChangeHandler._fitUiInternationalizationRemoved === undefined)
				{
					onChangeHandler();
				}
			});
		}
	}

	return Fit.Internationalization._internal.Locale;
}

// ====================================================
// Localization - internationalization of apps
// ====================================================

/// <function container="Fit.Internationalization" name="AddLocalization" access="public" static="true">
/// 	<description>
/// 		Register information such as translations related to a specific language and country.
/// 	</description>
/// 	<param name="type" type="function">
/// 		Object type associated with localization information - e.g. MyApp.ContactForm
/// 	</param>
/// 	<param name="translations" type="Object">
/// 		Object array containing language and country specific information such as translations.
/// 		The object array must be indexed using locale keys, and &quot;en&quot; must be defined first.
/// 		Example: { &quot;en&quot;: {}, &quot;en_GB&quot;: {}, &quot;da&quot;: {} }
/// 		Every language inherits all the information from &quot;en&quot;, and country specific information
/// 		such as &quot;de_AT&quot; automatically inherits everything from &quot;de&quot; - in which case
/// 		&quot;de&quot; must be declared first.
/// 		Information can be obtained from within instances of the given type using:
/// 		Fit.Internationalization.GetLocale(this); // Translations for current locale
/// 		Fit.Internationalization.GetLocale(this, &quot;de_AT&quot;); // Translations for specific locale
/// 		Naturally &quot;this&quot; is an instance of MyApp.ContactForm in this example.
/// 	</param>
/// </function>
Fit.Internationalization.AddLocalization = function(type, translations) // May be called multiple times, e.g. if splitting languages up into several files
{
	Fit.Validation.IsSet(type);
	Fit.Validation.ExpectObject(translations);

	// Assign ID to type which can be used to resolve translations later

	type._internal = type._internal || {};
	type._internal.LocalizationKey = type._internal.LocalizationKey || Fit.Data.CreateGuid();
	var typeId = type._internal.LocalizationKey;

	// Register translations

	Fit.Internationalization._internal.Additions[typeId] = Fit.Internationalization._internal.Additions[typeId] || {};
	var existingTranslations = Fit.Internationalization._internal.Additions[typeId];

	Fit.Array.ForEach(translations, function(key)
	{
		var localeKey = key.toLowerCase();
		var translationSet = translations[key];

		if (localeKey !== "en")
		{
			// Not primary english - merge with en which MUST exist

			var english = translations["en"] || existingTranslations["en"] || null;

			if (english === null)
				Fit.Validation.ThrowError("Unexpected error - English (en) not defined in locales");

			translationSet = Fit.Core.Merge(english, translationSet);
		}

		if (localeKey.indexOf("_") !== -1) // E.g. de_AT
		{
			// Merge e.g. de_AT with de

			var primaryLangKey = localeKey.split("_")[0];
			var primaryLocale = translations[primaryLangKey] || existingTranslations[primaryLangKey] || null;

			if (primaryLocale === null)
				Fit.Validation.ThrowError("Unexpected error - '" + primaryLangKey + "' not defined in locales");

			translationSet = Fit.Core.Merge(primaryLocale, translationSet);
		}

		existingTranslations[localeKey] = translationSet;
	});
}

/// <function container="Fit.Internationalization" name="GetLocale" access="public" static="true" returns="object">
/// 	<description> Get type specific locale information registered using Fit.Internationalization.AddLocalization(..) </description>
/// 	<param name="instance" type="object"> Instance of type used to register locale information </param>
/// 	<param name="locale" type="string" default="undefined">
/// 		If defined, information for specified locale such as en, en_GB, or da is returned.
/// 		If not found, en (en_US) is returned. If omitted, information for current locale is returned.
/// 	</param>
/// </function>
Fit.Internationalization.GetLocale = function(instance, locale)
{
	Fit.Validation.ExpectIsSet(instance);
	Fit.Validation.ExpectString(locale, true);

	var found = null;

	if (instance.constructor._internal && instance.constructor._internal.LocalizationKey)
	{
		var langKey = (locale ? locale.toLowerCase() : null) || Fit.Internationalization._internal.Locale;

		found = Fit.Internationalization._internal.Additions[instance.constructor._internal.LocalizationKey][langKey] || null;

		if (found === null && langKey.indexOf("_") !== -1) // E.g. de_AT
		{
			var primaryLangKey = langKey.split("_")[0]; // E.g. de_AT => de
			found = Fit.Internationalization._internal.Additions[instance.constructor._internal.LocalizationKey][primaryLangKey] || null;
		}

		if (found === null)
		{
			found = Fit.Internationalization._internal.Additions[instance.constructor._internal.LocalizationKey]["en"] || null;
		}
	}

	return found;
}

/// <function container="Fit.Internationalization" name="OnLocaleChanged" access="public" static="true">
/// 	<description> Add event handler which is called if locale is changed </description>
/// 	<param name="cb" type="function"> Event handler which takes no arguments </param>
/// </function>
Fit.Internationalization.OnLocaleChanged = function(cb)
{
	Fit.Validation.ExpectFunction(cb);
	Fit.Array.Add(Fit.Internationalization._internal.OnChangeHandlers, cb);
	delete cb._fitUiInternationalizationRemoved; // In case it was removed and added again
}

/// <function container="Fit.Internationalization" name="RemoveOnLocaleChanged" access="public" static="true">
/// 	<description> Remove event handler to avoid it being called when locale is changed </description>
/// 	<param name="cb" type="function"> Event handler to remove </param>
/// </function>
Fit.Internationalization.RemoveOnLocaleChanged = function(cb)
{
	Fit.Validation.ExpectFunction(cb);
	Fit.Array.Remove(Fit.Internationalization._internal.OnChangeHandlers, cb);
	cb._fitUiInternationalizationRemoved = true; // In case it is removed while OnLocaleChanged is firing, in which case it should be ignored
}