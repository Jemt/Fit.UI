# Fit.UI

> Fit.UI is an Object Oriented framework for building rich User Interfaces in JavaScript.

For information on how to use Fit.UI, please see [Fit.UI's official website](http://fitui.org).
For source code, please visit [Fit.UI on GitHub](https://github.com/Jemt/Fit.UI).

## Installation

Install Fit.UI using the package manager or download it from [Fit.UI's website](http://fitui.org).

```
npm install fit-ui
```

## Include Fit.UI (external resource)

The following files and folders are required to use Fit.UI as an external resource (not bundled with the application).

 - node_modules/fit-ui/dist/Controls
 - node_modules/fit-ui/dist/Resources
 - node_modules/fit-ui/dist/Fit.UI.js
 - node_modules/fit-ui/dist/Fit.UI.css
 - node_modules/fit-ui/dist/Fit.UI.min.js
 - node_modules/fit-ui/dist/Fit.UI.min.css

Simply add references to the stylesheet and Fit.UI itself:

```html
<link rel="stylesheet" type="text/css" href="path/to/fit-ui/Fit.UI.min.css">
<script src="path/to/fit-ui/Fit.UI.min.js"></script>
```

Fit.UI is now ready to be used:

```js
alert("Fit.UI loaded: " + (window.Fit ? "Yes" : "No"));
```

## Bundle Fit.UI

If a bundler such as [Webpack](https://webpack.github.io) is used, all we need to do is `import` or `require` Fit.UI, and the core of the framework will be bundled with the application, allowing us to resolve Fit.UI from the global scope.

```ts
import * as Fitty from "fit-ui";
// or
var Fitty = require("fit-ui");

alert("Fit.UI is loaded: " + (Fitty ? "Yes" : "No"));
```

However, to use UI components such as Dialog, DatePicker, HTML Editor, and FilePicker, the following files and folders must be copied to the folder containing the application bundle:

 - node_modules/fit-ui/dist/Fit.UI.min.css
 - node_modules/fit-ui/dist/Controls
 - node_modules/fit-ui/dist/Resources

## Example code

The [official website for Fit.UI](http://fitui.org) has plenty of online demos. Here is a small sample to get you started.

```js
var datepicker = new Fit.Controls.DatePicker("DatePicker1");
datepicker.Date(new Date());
datepicker.Render(document.body);

var button = new Fit.Controls.Button("Button1");
button.Title("Get date");
button.Icon("calendar");
button.OnClick(function()
{
    var date = Fit.Date.Format(datepicker.Date(), "YYYY-MM-DD");
    Fit.Controls.Dialog.Alert("Date: " + date);
});
datepicker.Render(document.body);
```