Fit.Cookies = {};

Fit.Cookies.Set = function(name, value, seconds)
{
	if (value.indexOf(';') > -1)
	{
		throw new Error("Unable to set cookie - value contains illegal character: ';'");
		return false;
	}

	var date = new Date();
	date.setTime(date.getTime() + (seconds * 1000));
	document.cookie = name + "=" + value + "; expires=" + date.toGMTString() + "; path=/"; // TODO: Is this wise? I don't think it should be hardcoded to root path!

	return true;
}

Fit.Cookies.Get = function(name)
{
	var name = name + "=";
	var cookies = document.cookie.split(";");
	var cookie = null;

	for (i = 0 ; i < cookies.length ; i++)
	{
		cookie = cookies[i];

		while (cookie.charAt(0) === " ")
			cookie = cookie.substring(1, cookie.length);

		if (cookie.indexOf(name) === 0)
			return cookie.substring(name.length, cookie.length);
	}

	return null;
}

Fit.Cookies.Remove = function(name)
{
	return this.Set(name, "", -1);
}
