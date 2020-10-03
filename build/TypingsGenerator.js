// Based on http://fiddle.jshell.net/bL8xyak4/184/
// Execute parser: node Parser.js > index.ts.d
// Expects file SimpleDocs.html to be accessible.
// Alternatively test in a browser which is great for debugging:
// TypingsGenerator.html loads TypingsGenerator and parses the documentation
// directly in the browser, allowing us to use the JS debugger.
// The generated type definitions are written to the browser console.

var isNodeJs = (typeof(window) === "undefined");
var globals = isNodeJs ? global : window;

// Fit.UI shim

if (isNodeJs === true)
{
	Fit =
	{
		Core:
		{
			Clone: function(obj)
			{
				return obj; // DANGEROUS! Returns same object - any modifications will affect the original object!!!
			}
		},

		Array:
		{
			GetIndex: function(arr, obj)
			{
				for (var i = 0 ; i < arr.length ; i++)
					if (arr[i] === obj)
						return i;

				return -1;
			},

			Contains: function(arr, obj)
			{
				return (Fit.Array.GetIndex(arr, obj) > -1);
			},

			ForEach: function(obj, callback)
			{
				if (obj instanceof Array)
				{
					for (var i = 0 ; i < obj.length ; i++)
					{
						if (callback(obj[i]) === false)
						{
							return false;
						}
					}
				}
				else
				{
					for (var i in obj)
					{
						if (callback(i) === false)
						{
							return false;
						}
					}
				}

				return true;
			},

			Add: function(arr, obj)
			{
				arr.push(obj);
			},

			Merge: function(arr1, arr2)
			{
				return arr1.concat(arr2);
			}
		},

		String:
		{
			Trim: function(str)
			{
				return str.replace(/^\s+|\s+$/g, "");
			}
		}/*,

		Http:
		{
			Request: function(url)
			{
				var me = this;
				var onSuccess = [];
				var responseText = null;

				this.OnSuccess = function(cb)
				{
					onSuccess.push(cb);
				}
				this.Start = function()
				{
					var http = require("http");

					var options = url; //{ host: "codemagic.dk", path: "/FlowIT/GUI/SimpleDocs.html" };

					callback = function(response)
					{
						responseText = null;
						var str = "";

						response.on("data", function (chunk)
						{
							str += chunk;
						});

						response.on("end", function ()
						{
							responseText = str;

							for (var i = 0 ; i < onSuccess.length ; i++)
								onSuccess[i](me);
						});
					}

					http.request(options, callback).end();
				}

				this.GetResponseText = function()
				{
					return responseText;
				}
			}
		}*/
	}
}
else
{
	if (!window.Fit)
		alert("Fatal error - Fit.UI must be loaded first!");
}

// Parser

function Parser()
{
	var me = this;

	var containers = null;	// Classes and Enums
	var aliasTypes = null;	// Type aliases
	var properties = null;	// Public properties and Enum values (which are also just public properties on a container)
	var functions = null;	// Functions
	var enums = null;		// Enums

	function init(cb)
	{
		var startParsing = function(data)
		{
			containers = data.Containers;
			ensureParentContainers();
			aliasTypes = getAliases();

			properties = data.Members;
			functions = data.Functions;

			enums = getEnums();

			/*var resp = data;
			var regex = /eval\("(.*?)"\)/g;

			var res = regex.exec(resp);
			containers = eval(res[1]);
			ensureParentContainers();
			aliasTypes = getAliases();

			regex.lastIndex++;
			res = regex.exec(resp);
			properties = eval(res[1]);

			regex.lastIndex++;
			res = regex.exec(resp);
			functions = eval(res[1]);

			enums = getEnums();*/

			if (cb)
			{
				cb();
			}
		};

		if (isNodeJs === false)
		{
			var r = new Fit.Http.Request("SimpleDocs.json");
			r.OnSuccess(function(sender)
			{
				//startParsing(r.GetResponseText());
				startParsing(r.GetResponseJson());
			});
			r.Start();
		}
		else
		{
			var fs = require('fs');

			fs.readFile("SimpleDocs.json", "utf8", function(err, data)
			{
				if (err) throw err;
				//startParsing(data);
				startParsing(JSON.parse(data));
			});
		}
	}

	function ensureParentContainers()
	{
		// Some containers such as Fit.Http does not expose functions or members,
		// only sub containers such as Fit.Http.Request and Fit.Http.JsonRequest.
		// Therefore the Fit.Http container is not currently defined in the 'containers'
		// collection. This function will ensure missing parent containers.

		var ensured = {};

		Fit.Array.ForEach(containers, function(c)
		{
			if (c.Name.indexOf(".") === -1)
				return; // Skip root container

			var parentContainer = c.Name.substring(0, c.Name.lastIndexOf(".")); // Parses e.g. Fit.Http from Fit.Http.Request or Fit from Fit.Array.

			if (ensured[parentContainer] === undefined && getContainerByName(parentContainer) === null)
			{
				ensured[parentContainer] = { Name: parentContainer, Description: "", Extends: "" };
			}
		});

		Fit.Array.ForEach(ensured, function(name)
		{
			Fit.Array.Add(containers, ensured[name]);
		});
	}

	function getAliases()
	{
		// Create aliases for native JS types that Fit.UI declare within its own namespace.
		// For instance Fit.Array and Fit.Date will both override the native Array and Date
		// within the Fit namespace, preventing us from using the native types.

		var aliasTypes = [];

		Fit.Array.ForEach(containers, function(container)
		{
			if (container.Name === "Fit")
				return; // Skip

			var shortContainerName = container.Name.substring(container.Name.lastIndexOf(".") + 1); // E.g. Fit.Controls.Button => Button

			if (globals[shortContainerName] !== undefined)
			{
				// Type already exists (e.g. Array or Date) - register alias
				Fit.Array.Add(aliasTypes, { Name: shortContainerName, Alias: "__fitUiAlias" + shortContainerName });
			}
		});

		return aliasTypes;
	}

	// Functions used to get documentation elemenets

	function getContainerByName(name) // Get specific container by name - e.g. /// <container name="Fit.Controls.TreeView" ...>
	{
		var found = null;

		Fit.Array.ForEach(containers, function(c)
		{
			if (c.Name === name)
			{
				found = c;
				return false; // Break loop
			}
		});

		return found;
	}

	function getContainers(container) // Get all container elements (except enums): /// <container ...>
	{
		var matches = [];

		Fit.Array.ForEach(containers, function(c)
		{
			if (c.Name.replace(container, "").lastIndexOf(".") === 0 && isEnum(c) === false)
				Fit.Array.Add(matches, c);
		});

		return matches;
	}

	function getEnums(container) // Get all enums or enums related to specific container
	{
		// An enum is a class with public static properties of type string where the property name is identical to the string value.

		var matches = [];

		Fit.Array.ForEach(containers, function(c)
		{
			if ((!container || container === "Fit" || c.Name.replace(container, "").lastIndexOf(".") === 0) && isEnum(c) === true)
				Fit.Array.Add(matches, c);
		});

		return matches;
	}

	function getProperties(container) // Get public properties (e.g. possible values for an enum)
	{
		return get(properties, container);
	}

	function getFunctions(container) // Get functions related to a specific container
	{
		var funcs = get(functions, container);

		var matches = [];

		Fit.Array.ForEach(funcs, function(f)
		{
			if (f.Access !== "") // If access modifier is missing, it is considered a callback - a type definition for a function signature
				Fit.Array.Add(matches, f);
		});

		return matches;
	}

	function getCallbacks(container) // Get callbacks related to a specific container
	{
		var funcs = get(functions, container);

		var matches = [];

		Fit.Array.ForEach(funcs, function(f)
		{
			if (f.Access === "") // This is the type definition for a callback - the signature of a function
				Fit.Array.Add(matches, f);
		});

		return matches;
	}

	function get(collection, container) // Helper function
	{
		var matches = [];

		Fit.Array.ForEach(collection, function(m)
		{
			if (m.Container === container)
				Fit.Array.Add(matches, m);
		});

		return matches;
	}

	function getAlias(typeName)
	{
		var match = null;

		Fit.Array.ForEach(aliasTypes, function(alias)
		{
			if (alias.Name === typeName)
			{
				match = alias;
				return false; // Break loop
			}
		});

		return match;
	}

	// Functions used to determine container characteristics

	function isEnum(containerInstance) // Returns True if given container instance has the design of an Enum (contains only public static properties of type string where the property name is identical to the string value)
	{
		if (getContainers(containerInstance.Name).length > 0)
			return false;

		var properties = getProperties(containerInstance.Name);
		var isEnum = (properties.length > 0);

		Fit.Array.ForEach(properties, function(m)
		{
			if (m.Access !== "public" || m.Static === false || m.Name !== m.Default || m.Type !== "string")
			{
				isEnum = false;
				return false;
			}
		});

		return isEnum;
	}

	function isInitializable(containerName) // Returns True if given container has at least one function that is not static, meaning an instance of the container (class) can be created
	{
		var shortContainerName = containerName.substring(containerName.lastIndexOf(".") + 1); // E.g. Fit.Controls.Button => Button
		var res = false;

		Fit.Array.ForEach(getFunctions(containerName), function(f)
		{
			if (f.Static === false)
			{
				res = true;
				return false; // Break loop
			}
		});

		return res;
	}

	// Typings construction

	function getInternals(containerName) // Return "internals" which are classes nested within the 3rd level (e.g. Fit.Controls.TreeView.Node) - Enums such as Fit.Controls.Button.Type are not considered classes and are therefore not included
	{
		// TODO: Remove this function - only serves the purpose of making the diff tool happy so the latest changes doesn't seem like a complete rewrite
	}

	function getTypingsForContainer(containerName, tabsStr)
	{
		var res = "";
		var tabs = ((tabsStr !== undefined) ? tabsStr : "");
		var containerObject = getContainerByName(containerName);
		var longContainerName = containerObject.Name;
		var shortContainerName = longContainerName.substring(longContainerName.lastIndexOf(".") + 1); // E.g. Fit.Controls.Button => Button
		var isClass = (getProperties(longContainerName).length > 0 || getFunctions(longContainerName).length > 0);
		var hasSubClassOrEnum = (isClass === true && (getContainers(longContainerName).length > 0 || getEnums(longContainerName).length > 0));
		var declareAsNamespace = (isClass === false || (hasSubClassOrEnum === true && isInitializable(longContainerName) === false));

		// Handle enums as they are different from classes, obviously

		if (Fit.Array.Contains(enums, containerObject) === true)
		{
			res += "\n" + tabs + "/**";
			res += "\n" + tabs + "* " + formatDescription(containerObject.Description, tabs);
			res += "\n" + tabs + "* @enum {string}";
			res += "\n" + tabs + "*/";

			res += "\n" + tabs + "enum " + shortContainerName;
			res += "\n" + tabs + "{";

			var values = "";

			Fit.Array.ForEach(getProperties(longContainerName), function(p)
			{
				values += (values !== "" ? "," : "");

				values += "\n" + tabs + "\t/** " + formatDescription(p.Description, tabs) + " */";
				values += "\n" + tabs + "\t" + p.Name + " = \"" + p.Default + "\"";
			});

			res += values;

			res += "\n" + tabs + "}";

			return res;
		}

		// Handle containers considered to be classes

		res += "\n" + tabs + "/**";
		res += "\n" + tabs + "* " + formatDescription(containerObject.Description, tabs);
		res += "\n" + tabs + "* @" + (declareAsNamespace === true ? "namespace" : "class") + " [" + longContainerName + " " + shortContainerName + "]";
		res += "\n" + tabs + "*/";

		res += "\n" + tabs + (declareAsNamespace === true ? (longContainerName === "Fit" ? "declare " : "") + "namespace " : "class ");
		res += shortContainerName;
		res += "\n" + tabs + "{";

		// Add class members (properties and functions - e.g. Fit.Template.Content or Fit.GetPath())

		res += getMembersForContainer(longContainerName, tabs + "\t");

		// Recursively add nested containers (e.g. Controls for Fit, TreeView for Fit.Controls, and Type enum for Fit.Controls.Button)

		var subContainers = Fit.Array.Merge(getContainers(longContainerName), (longContainerName !== "Fit" ? getEnums(longContainerName) : []));
		Fit.Array.ForEach(subContainers, function(sc)
		{
			res += getTypingsForContainer(sc.Name, tabs + "\t");
		});

		res += "\n" + tabs + "}";

		// Register type aliases

		if (longContainerName === "Fit")
		{
			res += (aliasTypes.length > 0 ? "\n" : "");

			Fit.Array.ForEach(aliasTypes, function(alias)
			{
				res += "\n";

				if (alias.Name === "Array")
				{
					res += "type " + alias.Alias + " = " + alias.Name + "<any>;";
				}
				else
				{
					res += "type " + alias.Alias + " = " + alias.Name + ";";
				}
			});
		}

		// Declare Fit.UI as a module

		if (longContainerName === "Fit")
		{
			res += "\n";
			res += "\ndeclare module \"fit-ui\"";
			res += "\n{";
			res += "\n	export = Fit;";
			res += "\n}";
		}

		return res;
	}

	function getMembersForContainer(containerName, tabsStr, skipConstructor) // Generate typings for class members (properties and functions)
	{
		var res = "";
		var tabs = ((tabsStr !== undefined) ? tabsStr : "");
		var containerObject = getContainerByName(containerName);
		var longContainerName = containerObject.Name;
		var shortContainerName = longContainerName.substring(longContainerName.lastIndexOf(".") + 1); // E.g. Fit.Controls.Button => Button
		var exts = ((containerObject.Extends !== "") ? containerObject.Extends.split(";") : []);

		var isClass = (getProperties(longContainerName).length > 0 || getFunctions(longContainerName).length > 0);
		var hasSubClassOrEnum = (isClass === true && (getContainers(longContainerName).length > 0 || getEnums(longContainerName).length > 0));

		// Add properties

		var properties = getProperties(longContainerName);

		if (properties.length > 0)
			res += "\n" + tabs + "// Properties defined by " + longContainerName;

		Fit.Array.ForEach(properties, function(p)
		{
			res += "\n" + tabs + "/**";
			res += "\n" + tabs + "* " + formatDescription(p.Description, tabs);
			res += "\n" + tabs + "* @member {" + (p.Nullable === true ? "(" + getType(p.Type) + "|null)" : getType(p.Type))+ "} " + p.Name;
			res += "\n" + tabs + "*/";

			res += "\n" + tabs + p.Name + ":" + getType(p.Type, true) + (p.Nullable === true ? " | null" : "") + ";";
		});

		// Add functions

		var functions = Fit.Array.Merge(getFunctions(longContainerName), getCallbacks(longContainerName));

		if (functions.length > 0)
			res += "\n" + tabs + "// Functions defined by " + longContainerName;

		Fit.Array.ForEach(functions, function(f)
		{
			// Determine function return type

			var returnType = null;
			var returnTypeAlias = null;
			var returnTypeGenerics = null;

			if (f.Returns)
			{
				returnType = getType(f.Returns);
				returnTypeAlias = getType(f.Returns, true);

				if (f.Returns.indexOf("$") > -1) // Generic type(s) defined
				{
					returnTypeGenerics = "";
					var regex = /\$(\w+)/g;
					var match = null;

					while ((match = regex.exec(f.Returns)) !== null) // match[0] = full match, match[1] = name of type
					{
						returnTypeGenerics += (returnTypeGenerics !== "" ? ", " : "") + match[1];
					}
				}
			}

			// Construct function signature

			if (skipConstructor === true && f.Name === shortContainerName) // This is a constructor from a super class - skip!
				return;

			var access = null;
			var funcName = null;

			var isCallback = (f.Access === ""); // True if function is not a public/private function, but merely a callback signature (type definition)

			if (isCallback === true)
			{
				access = "type ";
				funcName = f.Name;
			}
			else if (hasSubClassOrEnum === true && f.Static === true) // NOTICE: Will not work if we add support for creating instances of "Fit"! We can't mix static functions and object functions!
			{
				access = "export function ";
				funcName = f.Name;
			}
			else
			{
				funcName = (f.Name === shortContainerName ? "constructor" : f.Name);
				access = (funcName !== "constructor" ? "public " : "") + (f.Static === true ? "static " : "");
			}

			var parms = getParameterString(f, tabs);

			res += "\n" + tabs + "/**";
			res += "\n" + tabs + "* " + formatDescription(f.Description, tabs);
			res += "\n" + tabs + "* @function " + f.Name;
			if (returnTypeGenerics !== null) // https://github.com/google/closure-compiler/wiki/Generic-Types
			{
				Fit.Array.ForEach(returnTypeGenerics.split(", "), function(genericName)
				{
					res += "\n" + tabs + "* @template " + genericName;
				});
			}
			res += parms.Docs;
			if (returnType !== null)
				res += "\n" + tabs + "* @returns " + returnType;
			res += "\n" + tabs + "*/";

			if (isCallback === true)
			{
				res += "\n" + tabs + access + funcName + " = (" + parms.Typings + ") => " + (returnTypeAlias !== null ? returnTypeAlias : "void") + ";";
			}
			else
			{
				res += "\n" + tabs + access + funcName + (returnTypeGenerics !== null ? "<" + returnTypeGenerics + ">" : "") + "(" + parms.Typings + ")" + (funcName !== "constructor" ? ":" + (returnTypeAlias !== null ? returnTypeAlias : "void") : "") + ";";
			}
		});

		// Add members (properties and functions) from containers/classes from which the current container/class extends.

		// Notice how functions and properties from classes from which the current container
		// extends are added as ordinary members rather than using the Extends construct in
		// TypeScript (class Y extends X). The reason for this is that Fit.UI supports
		// multiple inheritance which TypeScript does not.
		// Fortunately this is not a problem, even if a function accepts only the super class.
		// Example:
		//   var ctx = new Fit.Controls.WSContextMenu();
		//   treeView.ContextMenu(ctx); // ContextMenu(..) accepts an instance of Fit.Controls.ContextMenu().
		// TypeScript interrogates the ctx instance and concludes that it is compatible with the definition of
		// Fit.Controls.ContextMenu (it implements all the same members), so it will allow the specialized
		// WSContextMenu to be passed to the ContextMenu(..) function.
		// If, for some reason, TypeScript will not allow this in the future, we could make the typings generator
		// modify the resulting typings so that ContextMenu(contextMenu?:Fit.Controls.ContextMenu):Fit.Controls.ContextMenu;
		// instead becomes ContextMenu(contextMenu?:Fit.Controls.ContextMenu | Fit.Controls.WSContextMenu):Fit.Controls.ContextMenu | Fit.Controls.WSContextMenu;
		// Another solution would be to ditch support for multiple inheritance in Fit.UI which was actually added to support some form of interfaces,
		// PickerBase in particular. TypeScript supports interfaces out of the box.

		for (var i = 0 ; i < exts.length ; i++)
			res += getMembersForContainer(exts[i], tabs, true);

		return res;
	}

	function getParameterString(functionInstance, tabsStr) // Return typings for function parameters
	{
		var tabs = ((tabsStr !== undefined) ? tabsStr : "");
		var str = "";
		var docs = "";

		Fit.Array.ForEach(functionInstance.Parameters, function(p)
		{
			//var containerInstance = getContainerByName(p.Type.replace("[]", "")); // Null for e.g. string, boolean, integer, etc.

			docs += "\n" + tabs + "* @param {" + (p.Nullable === true ? "(" + getType(p.Type) + "|null)" : getType(p.Type))+ "} " + (p.Default ? "[" + p.Name + "=" + p.Default + "]" : p.Name) + " - " + formatDescription(p.Description, tabs);

			str += (str !== "" ? ", " : "") + p.Name;
			str += (p.Default ? "?" : "");
			str += ":";
			str += getType(p.Type, true) + (p.Nullable === true ? " | null" : "");
		});

		return { Typings: str, Docs: docs };
	}

	function getType(type, resolveAlias)
	{
		if (type.indexOf("|") > -1) // Multipe types - e.g.: (integer | (string | Date)[])[] - make sure we resolve the actual types for all of them
		{
			// Capture names of all types - all names come after a starting paranthesis,
			// a whitespace or a pie, and can optionally start with a dollar sign if it is a generic type.

			var regex = /(^|\(| |\|)(\$?\w+)/g;
			var match = null;
			var newType = type; // Perform replacement on copy of string to avoid affecting regex matching which keeps an internal index of where to continue with next search

			while ((match = regex.exec(type)) !== null) // match[0] = full match, match[1] = character before name of type, match[2] = name of type
			{
				newType = newType.replace(match[0], match[1] + getType(match[2], resolveAlias));
			}

			return newType;
		}

		if (type.indexOf("$") === 0) // Generics start with a dollar sign which needs to be removed
		{
			return type.substring(1);
		}

		if (resolveAlias === true)
		{
			var alias = getAlias(type);

			if (alias !== null)
				return alias.Alias;
		}

		if (type === "DOMElement")
			return "HTMLElement"; // An object of type DOMElement in Fit.UI is actually an instance of HTMLElement - see Fit.Validation.ExpectElement(..) for details
		else if (type === "DOMNode")
			return "Node";
		else if (type === "array")
			return "any[]"; //"object[]"; //return "Array<object>";
		else if (type === "object")
			return "any";
		else if (type === "object[]")
			return "any[]";
		else if (type === "function")
			return "Function";
		else if (type === "integer") // TODO: Integer is not supported in TypeScript, but passing in a decimal where an integer is expected will cause Fit.UI to throw a type validation exception runtime
			return "number";
		else if (type === "integer[]")
			return "number[]";

		return type;
	}

	function formatDescription(description, tabs)
	{
		description = description.replace(/\n/g, "\n" + tabs);
		//description = description.replace(/<br>/g, "\n" + tabs);
		//description = description.replace(/&#160;&#160;&#160;&#160; ?/g, "\t");
		description = description.replace(/\/\*/g, "//");
		description = description.replace(/\*\//g, "");

		return description;
	}

	this.GenerateTypings = function(cb)
	{
		init(function()
		{
			// DEBUG - Expose public API and data when parser is done processing
			me.GetContainerByName = getContainerByName;
			me.GetContainers = getContainers;
			me.GetEnums = getEnums;
			me.GetProperties = getProperties;
			me.GetFunctions = getFunctions;
			me.Data = {};
			me.Data.Containers = Fit.Core.Clone(containers);
			me.Data.Properties = Fit.Core.Clone(properties);
			me.Data.Functions = Fit.Core.Clone(functions);
			me.Data.Enums = Fit.Core.Clone(enums);

			// Finalize
			var result = getTypingsForContainer("Fit");
			cb(result);
		});
	};
}

var parser = new Parser();
parser.GenerateTypings(function(code)
{
	console.log(code);
});
