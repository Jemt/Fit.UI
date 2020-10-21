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
			var parentContainer = c.Name;

			while (parentContainer.indexOf(".") > -1)
			{
				parentContainer = parentContainer.substring(0, parentContainer.lastIndexOf(".")); // Parses e.g. Fit.Http from Fit.Http.Request or Fit from Fit.Array.

				if (ensured[parentContainer] === undefined && getContainerByName(parentContainer) === null)
				{
					ensured[parentContainer] = { Name: parentContainer, Description: "", Extends: "" };
				}
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

	function getEnumByName(enumName)
	{
		var found = null;

		Fit.Array.ForEach(enums, function(enumObj)
		{
			if (enumObj.Name === enumName)
			{
				found = enumObj;
				return false; // Break loop
			}
		});

		return found;
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

	function getCallbackByName(callback) // Get callback based on name/path, e.g. Fit.ArrayTypeDefs.ForEachCallback
	{
		var callbackName = callback.substring(callback.lastIndexOf(".") + 1); // E.g. Fit.ArrayTypeDefs.ForEachCallback => ForEachCallback
		var containerName = callback.indexOf(".") > -1 ? callback.substring(0, callback.lastIndexOf(".")) : "Fit"; // E.g. Fit.ArrayTypeDefs.ForEachCallback => Fit.ArrayTypeDefs
		var callback = null;

		Fit.Array.ForEach(getCallbacks(containerName), function(cb)
		{
			if (cb.Name === callbackName)
			{
				callback = cb;
				return false; // Break loop
			}
		});

		return callback;
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
				values += "\n" + tabs + "\t" + (/^[a-z0-9]+$/i.test(p.Name) === true ? p.Name : "\"" + p.Name + "\"") + " = \"" + p.Default + "\"";
			});

			res += values;

			res += "\n" + tabs + "}";

			return res;
		}

		// Handle containers considered to be classes

		var dtoGenerics = (declareAsNamespace === false ? getGenericsUsageFromDtoOrCallback(longContainerName) : []);

		res += "\n" + tabs + "/**";
		res += "\n" + tabs + "* " + formatDescription(containerObject.Description, tabs);
		res += "\n" + tabs + "* @" + (declareAsNamespace === true ? "namespace" : "class") + " [" + longContainerName + " " + shortContainerName + "]";
		Fit.Array.ForEach(dtoGenerics, function(genericName)
		{
			res += "\n" + tabs + "* @template " + genericName;
		});
		res += "\n" + tabs + "*/";

		res += "\n" + tabs + (declareAsNamespace === true ? (longContainerName === "Fit" ? "declare " : "") + "namespace " : "class ");
		res += shortContainerName + getGenericsString(dtoGenerics);
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
			res += "\n" + tabs + "* @member {" + convertToJsDocType(getType(p.Type)) + (p.Nullable === true ? "|null" : "")+ "} " + (p.Default ? "[" + p.Name + "=" + p.Default + "]" : p.Name);
			res += "\n" + tabs + "*/";

			res += "\n" + tabs + p.Name + (p.Default ? "?" : "") + ":" + getType(p.Type, true) + (p.Nullable === true ? " | null" : "") + ";";
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
			var generics = [];

			if (f.Returns)
			{
				returnType = getType(f.Returns);
				returnTypeAlias = getType(f.Returns, true);

				generics = getGenerics(f.Returns);
			}

			// Construct function signature

			if (skipConstructor === true && f.Name === shortContainerName) // This is a constructor from a super class - skip!
				return;

			var access = null;
			var funcName = null;

			var isCallback = (f.Access === ""); // True if function is not a public/private function, but merely a callback signature (type definition)

			if (isCallback === true)
			{
				access = "type "; // Specify "export type " to make it available externally
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

			Fit.Array.ForEach(parms.Generics, function(genericName)
			{
				if (Fit.Array.Contains(generics, genericName) === false)
				{
					generics.push(genericName);
				}
			});

			res += "\n" + tabs + "/**";
			res += "\n" + tabs + "* " + formatDescription(f.Description, tabs);
			res += "\n" + tabs + "* @function " + f.Name;
			Fit.Array.ForEach(generics, function(genericName) // https://github.com/google/closure-compiler/wiki/Generic-Types and https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
			{
				res += "\n" + tabs + "* @template " + genericName;
			});
			res += parms.Docs;
			if (returnType !== null)
				res += "\n" + tabs + "* @returns " + convertToJsDocType(returnType);
			res += "\n" + tabs + "*/";

			if (isCallback === true)
			{
				res += "\n" + tabs + access + funcName + getGenericsString(generics) + " = " + "(" + parms.Typings + ") => " + (returnTypeAlias !== null ? returnTypeAlias : "void") + ";";
			}
			else
			{
				res += "\n" + tabs + access + funcName + getGenericsString(generics) + "(" + parms.Typings + ")" + (funcName !== "constructor" ? ":" + (returnTypeAlias !== null ? returnTypeAlias : "void") : "") + ";";
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
		var generics = [];

		Fit.Array.ForEach(functionInstance.Parameters, function(p)
		{
			// Find generics required by named callbacks (as apposed to anonymous/inline callbacks).
			// Notice that the generic types used by named callbacks must be defined with the
			// same name as the generics used in the function declaration, in order for
			// the typings generator to be able to associate generics from function input
			// parameters to named callback input parameters. Example - notice how both declarations use $Type:
			// <function container="Fit.ArrayTypeDefs" name="ForEachObjectCallback" returns="boolean | void">
			//     <param name="obj" type="$Type"> Object from array </param>
			// </function>
			// <function container="Fit.Array" name="ForEach" access="public" static="true" returns="boolean">
			//     <param name="arr" type="$Type[]"> Array with objects </param>
			//     <param name="callback" type="Fit.ArrayTypeDefs.ForEachObjectCallback"> Callback receiving objects </param>
			// </function>
			// Being able to declare the required generics would be more desirable, but this would require
			// changes to SimpleDocs since using less-than and greater-than is not allowed in XML:
			// <param name="callback" type="Fit.ArrayTypeDefs.ForEachObjectCallback<$Type, $TypeB, ..>"> </param>
			// But since this is not possible, we would need to either extend SimpleDocs with support like this:
			// <param name="callback" type="Fit.ArrayTypeDefs.ForEachObjectCallback" generics="$Type, $typeB, .."> </param>
			// or use an alternative syntax for passing generics to the type attribute like this (ugly!):
			// <param name="callback" type="Fit.ArrayTypeDefs.ForEachObjectCallback{$Type, $TypeB, ..}"> </param>
			// We will go with the requirement to use identical naming in both function declaration and named callback declaration
			// for now. However, if this is completely unacceptable, inline declaration of a callback signature is supported,
			// which works fine and doesn't get too bloated, when there is only a couple of callback arguments.
			// <function container="Fit.Array" name="ForEach" access="public" static="true" returns="boolean">
			//     <param name="arr" type="$Type[]"> Array with objects </param>
			//     <param name="callback" type="(obj:$Type) => boolean | void"> Callback receiving objects </param>
			// </function>

			docs += "\n" + tabs + "* @param {" + convertToJsDocType(getType(p.Type)) + (p.Nullable === true ? "|null" : "") + "} " + (p.Default ? "[" + p.Name + "=" + p.Default + "]" : p.Name) + " - " + formatDescription(p.Description, tabs);

			str += (str !== "" ? ", " : "") + p.Name;
			str += (p.Default ? "?" : "");
			str += ":";
			str += getType(p.Type, true) + (p.Nullable === true ? " | null" : "");

			Fit.Array.ForEach(Fit.Array.Merge(getGenerics(p.Type) /* E.g. $MyType[]|string[] */, getGenericsUsageFromDtoOrCallback(p.Type) /* E.g. String|Fit.Demo.CustomTypeUsingGenerics|Fit.Demo.CallbackUsingGenerics */), function(genericName)
			{
				if (Fit.Array.Contains(generics, genericName) === false)
				{
					generics.push(genericName);
				}
			});
		});

		return { Typings: str, Docs: docs, Generics: generics };
	}

	function getGenerics(type) // Parses names of generic types defined from e.g. $MyType or $MyType|$AnotherType or ($MyType[])=>$Type
	{
		var generics = [];
		var regex = /\$(\w+)/g;
		var match = null;

		while ((match = regex.exec(type)) !== null) // match[0] = full match, match[1] = name of type
		{
			generics.push(match[1]);
		}

		return generics;
	}

	function getGenericsUsageFromDtoOrCallback(type) // Get list of all generics used by container (DTO class) or named callback
	{
		var generics = [];

		var regex = /(^|\(| |\||:|=>|\+)(\$?[\w\.]+)/g; // Also found in getTypes(..) along with an explaination - make changes both places!
		var match = null;

		while ((match = regex.exec(type)) !== null) // match[0] = full match, match[1] = character before name of type, match[2] = name of type
		{
			var container = getContainerByName(match[2]); // Null if not a container

			// Only extract generic types for data transfer object classes which only define properties.
			// Generics in class functions are mostly used to define an input type and an equivalent
			// return type, and we do not want these to be added to the class definition. For instance we would not
			// want to define the Array class as "class Fit.Array<TypeA, TypeB>" just because Fit.Array.Merge(..)
			// defines the usage of TypeA and TypeB.
			// However, remember that property types can still describe functions! So rather than describing class
			// function implementations (public/private/static), they merely describe the function signature.
			// So to sum up, <container> elements with only <member> elements will have generics returned while
			// <container> elements that also define <function> elements will not.
			if (container !== null && getFunctions(match[2]).length === 0)
			{
				// DISABLED - see comment above!
				/*var functions = getFunctions(container.Name);
				Fit.Array.ForEach(functions, function(func)
				{
					Fit.Array.ForEach(func.Parameters, function(param)
					{
						var paramGenerics = getGenerics(param.Type);

						Fit.Array.ForEach(paramGenerics, function(genericName)
						{
							if (Fit.Array.Contains(generics, genericName) === false)
							{
								generics.push(genericName);
							}
						});
					});
				});*/

				var properties = getProperties(container.Name); // Properties can describe both data types AND function signatures

				Fit.Array.ForEach(properties, function(prop)
				{
					var propGenerics = getGenerics(prop.Type);

					Fit.Array.ForEach(propGenerics, function(genericName)
					{
						if (Fit.Array.Contains(generics, genericName) === false)
						{
							generics.push(genericName);
						}
					});
				});
			}
			else
			{
				var callback = getCallbackByName(match[2]); // Null if not a named callback

				if (callback !== null)
				{
					Fit.Array.ForEach(callback.Parameters, function(cbParm)
					{
						Fit.Array.ForEach(getGenerics(cbParm.Type), function(genericName)
						{
							if (Fit.Array.Contains(generics, genericName) === false)
							{
								generics.push(genericName);
							}
						});
					});

					Fit.Array.ForEach(getGenerics(callback.Returns), function(genericName)
					{
						if (Fit.Array.Contains(generics, genericName) === false)
						{
							generics.push(genericName);
						}
					});
				}
			}
		}

		return generics;
	}

	function getGenericsString(genericsArray)
	{
		var str = "";

		if (genericsArray.length > 0)
		{
			str = "<" + genericsArray.join(", ") + ">";
		}

		return str;
	}

	function getType(type, resolveAlias)
	{
		if (type.indexOf("|") > -1 || type.indexOf(":") > -1 || type.indexOf("+") > -1)
		{
			// Multipe types (e.g.: integer | (string | Date)[])[]), type(s) in an anonymous
			// callback (e.g.: (val:$MyType, compare:string) => void), or intersection types (e.g.: TypeA + TypeB) present.
			// Make sure actual types are resolved. However, be aware not to use types as parameter names in anonymous functions!
			// For instance (integer:integer)=>boolean|integer will translate the name of the argument, not just
			// the type, turning it into (number:number)=>boolean|number. Since this is just type declarations without
			// implementation, it's of no big deal, but it does create inconsistency with the HTML documentation.
			// In any event, using types as parameter names is bad practice.

			// Capture names of all types - all names come after a starting paranthesis, a space, a colon (function argument type),
			// equal-or-greater-than arrow (function return type), or a pipe, and can optionally start with a dollar sign if it is a generic type.

			var regex = /(^|\(| |\||:|=>|\+)(\$?[\w\.]+)/g; // Also found in getGenericsUsageFromDtoOrCallback(..) - make changes both places!
			var match = null;
			var newType = type; // Perform replacement on copy of string to avoid affecting regex matching which keeps an internal index of where to continue with next search

			while ((match = regex.exec(type)) !== null) // match[0] = full match, match[1] = character before name of type, match[2] = name of type
			{
				newType = newType.replace(match[0], match[1] + getType(match[2], resolveAlias));
			}

			return newType.replace(/\+/g, "&"); // In XML documentation we use + to specify intersection types (e.g.: TypeA + TypeB => TypeA & TypeB)
		}

		if (type.indexOf("$") > -1) // Generics start with a dollar sign which needs to be removed
		{
			return type.replace(/\$/g, ""); // E.g. $Type converts to Type or ($Type)=>$Type[] converts to (Type)=>Type[]
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

		// Expand enum.
		// An enum such as Fit.Demo.MyEnum with OptionA and OptionB is expanded to
		// Fit.Demo.MyEnum|"OptionA"|"OptionB" to allow the use of both the enum and its values.

		var enumObj = getEnumByName(type);

		if (enumObj !== null)
		{
			Fit.Array.ForEach(getProperties(type), function(enumValue)
			{
				type += " | " + "\"" + enumValue.Default + "\"";
			});

			return type;
		}

		// Return type as-is, but with generics attached if defined (e.g. SomeType<TypeA, TypeB>)

		return type + getGenericsString(getGenericsUsageFromDtoOrCallback(type));
	}

	function convertToJsDocType(type) // Returns type as-is if conversion is not required
	{
		// Handle dictionaries

		// Converts e.g. {[key:string]:string|number} to Object.<string,string|number>.
		// Nested dictionaries are supported as well: {[row:string]: {[column:string]:string|number}}
		// Support for nested dictionaries is achieved by matching individual dictionaries, replacing
		// them with placeholders, making the outer dictionary match the regular expression too, e.g.:
		// {[row:string]: {[column:string]:string|number}}  ==>  {[row:string]: DICTREPLACEMENT0}
		// and {[row:string]: DICTREPLACEMENT0}  ==>  DICTREPLACEMENT1
		// The placeholders will be replaced with their equivalent JSDoc dictionaries like this:
		// DICTREPLACEMENT1  ==>  Object.<string, DICTREPLACEMENT0>
		// and Object.<string, DICTREPLACEMENT0>  ==>  Object.<string, Object.<string, string|number>>

		var regex = /\{\s*\[\s*(\w+)\s*:\s*(\w+)\s*\]\s*:\s*(\w+(\s*\|\s*\w+)*)\s*\}/g; // https://regex101.com/r/SelKCi/3/
		var match = null;

		var replacements = [];
		var retry = true;
		var testString = type;

		while (retry === true) // Make sure regex search re-runs to find nested dictionaries
		{
			regex.lastIndex = 0; // Reset regex
			retry = false;
			testString = type; // Matching and replacing on different strings to avoid affecting internal regex index used to find next match

			while ((match = regex.exec(testString)) !== null) // match[0] = full match, match[1] = name of dictionary key, match[2] = dictionary key type, match[3] = dictionary value type(s)
			{
				if (match[2].toLowerCase() !== "string")
				{
					throw "Unsupported key type in associative array - must be of type string but found " + match[2] + ": " + match[0];
				}

				replacements.push("Object.<string, " + match[3] + ">"); // Key type (string) MUST be in lower case for JSDoc intellisense to work
				type = type.replace(match[0], "DICTREPLACEMENT" + (replacements.length - 1));
				retry = true;
			}
		}

		for (var i = replacements.length - 1 ; i >= 0 ; i--)
		{
			type = type.replace("DICTREPLACEMENT" + i, replacements[i]);
		}

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
