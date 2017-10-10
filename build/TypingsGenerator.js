// Based on http://fiddle.jshell.net/bL8xyak4/184/
// Execute parser: node Parser.js > index.ts.d

var useFileReader = true;

// Fit.UI shim

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
        
                var options = url; /*{
                    host: "codemagic.dk",
                    path: "/FlowIT/GUI/SimpleDocs.html"
                };*/
        
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
    }
}

// Parser

function Parser()
{
	var me = this;

	var containers = null;	// Classes and Enums
	var properties = null;	// Public properties and Enum values (which are also just public properties on a container)
	var functions = null;	// Functions
	
	var internals = null;	// Interfaces (Enums) and classes to be moved to __FitInternals
	var enums = null;	// Enums

	function init(cb)
	{
		var startParsing = function(data)
		{
			var resp = data;
			var regex = /eval\("(.*?)"\)/g;

			var res = regex.exec(resp);
			containers = eval(res[1]);

			regex.lastIndex++;
			res = regex.exec(resp);
			properties = eval(res[1]);

			regex.lastIndex++;
			res = regex.exec(resp);
			functions = eval(res[1]);
			
			cleanData();
			
			internals = getInternals("Fit");
			enums = getEnums();
			
			if (cb)
			{
				cb();
			}
		};

		if (!useFileReader)
		{
			var r = new Fit.Http.Request("http://codemagic.dk/FlowIT/GUI/SimpleDocs.html");
			r.OnSuccess(function(sender)
			{
				startParsing(r.GetResponseText());
			});
			r.Start();
		}
		else
		{
			var fs = require('fs');

			fs.readFile("SimpleDocs.html", "utf8", function(err, data)
			{
				if (err) throw err;
				startParsing(data);
			});
		}
	}
	
	function cleanData()
	{
		// Preserve comments in documentation by replacing e.g. /* xyz */ with \* xyz *\
	
		Fit.Array.ForEach([containers, properties, functions], function(type)
		{
			Fit.Array.ForEach(type, function(ob)
			{
				ob.Description = ob.Description.replace(/\/\*/g, "\\*");
				ob.Description = ob.Description.replace(/\*\//g, "*\\");
				ob.Description = ob.Description.replace(/<br>/g, " ");
				
				if (ob.Parameters)
				{
					Fit.Array.ForEach(ob.Parameters, function(p)
					{
						p.Description = p.Description.replace(/\/\*/g, "\\*");
						p.Description = p.Description.replace(/\*\//g, "*\\");
						p.Description = p.Description.replace(/<br>/g, " ");
					});
				}
			});
		});
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
	
	function getContainers(container) // Get all container elements: /// <container ...>
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
		return get(functions, container);
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
	
	// Functions used to work around limitations in typings
	
	function getInternals(containerName) // Return "internals" which are classes nested within the 3rd level (e.g. Fit.Controls.TreeView.Node) - Enums such as Fit.Controls.Button.Type are not considered classes and are therefore not included
	{
		// Nested classes such as Fit.Controls.TreeView.Node are not supported in typings (Fit and Controls are declared as namespaces and not classes).
		// To work around this, we move nested classes to interfaces and declare a property of the interface type.
		// E.g. Fit.Controls.TreeView.Node is declare like so on the TreeView class: public static Node : typeof __FitInternals.FitControlsTreeViewNode;
		// NOTICE: Unfortunately this prevents us from type casting like so: (obj as Fit.Controls.TreeView.Node).AddChild(..);
		// NOTICE: This function does not include Enums since they are handled differently than classes - classes are registered as classes while enums are registered as interfaces. See getTypingsForInternals().
	
		var containerObject = getContainerByName(containerName);
		var exts = ((containerObject.Extends != "") ? containerObject.Extends.split(";") : []);
		var container = containerObject.Name;
		var subContainers = getContainers(container);
		var moveToInternals = [];
		
		if (subContainers.length > 0) // Current container has sub container(s) - classes or enums
		{
			var allFunctions = [];
			Fit.Array.ForEach(Fit.Array.Merge(exts, [containerName]), function(conName)
			{
				allFunctions = Fit.Array.Merge(allFunctions, getFunctions(conName));
			});
			
			var allProperties = []; // Properties and Enum values (which are also just properties)
			Fit.Array.ForEach(Fit.Array.Merge(exts, [containerName]), function(conName)
			{
				allProperties = Fit.Array.Merge(allProperties, getProperties(conName));
			});

			var hasObjectMember = false;

			Fit.Array.ForEach(Fit.Array.Merge(allFunctions, allProperties), function(x)
			{
				if (x.Static === false)
				{
					hasObjectMember = true;
					return false;
				}
			});
			
			if (hasObjectMember === true) // Current container has sub container(s) (e.g. Fit.Controls.TreeView.Node) AND contain object members itself which is not supported - move sub container(s) to different namespace
			{
				moveToInternals = Fit.Array.Merge(moveToInternals, subContainers);
			}
			
			Fit.Array.ForEach(subContainers, function(sc)
			{
				moveToInternals = Fit.Array.Merge(moveToInternals, getInternals(sc.Name));
			});
		}
		
		return moveToInternals;
	}
	
	// Typings construction
	
	function getTypingsForContainer(containerName, tabsStr, getInternals) // Generate typings for Fit.UI - getInternals is true when called from getTypingsForInternals()
	{
		var res = "";
		var tabs = ((tabsStr !== undefined) ? tabsStr : "");
		var containerObject = getContainerByName(containerName);
		var longContainerName = containerObject.Name;
		var shortContainerName = longContainerName.substring(longContainerName.lastIndexOf(".") + 1); // E.g. Fit.Controls.Button => Button
		var isClass = (getProperties(longContainerName).length > 0 || getFunctions(longContainerName).length > 0);
		var hasSubClass = (isClass === true && getContainers(longContainerName).length > 0);
		var declareAsNamespace = (isClass === false || (hasSubClass === true && isInitializable(longContainerName) === false));
		
		// Handle containers considered to be "internals" or enums (see getInternals() function for details)
		
		if (getInternals !== true && Fit.Array.Contains(internals, containerObject) === true)
		{
			return "\n" + tabs + "public static " + shortContainerName + " : typeof __FitInternals." + getContainerTypingName(longContainerName) + ";";
		}
		else if (getInternals !== true && Fit.Array.Contains(enums, containerObject) === true)
		{
			return "\n" + tabs + "public static readonly " + shortContainerName + " : __FitInternals.I" + getContainerTypingName(longContainerName) + ";";
		}
		
		// Handle containers considered to be classes

		res += "\n" + tabs + "/**";
		res += "\n" + tabs + "* " + containerObject.Description;
		res += "\n" + tabs + "* @class [" + longContainerName + " " + shortContainerName + "]";
		res += "\n" + tabs + "*/";
		
		res += "\n" + tabs + (declareAsNamespace === true ? (longContainerName === "Fit" ? "declare " : "") + "namespace " : "class ");
		res += (getInternals !== true ? shortContainerName : getContainerTypingName(longContainerName));
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
		
		// Add internal types (interfaces used to mimic the behaviour of enums (e.g. Fit.Controls.Button.Type) and classes that cannot be nested in other classes (e.g. Fit.Controls.TreeView.Node))
		
		if (longContainerName === "Fit")
		{
			res = getTypingsForInternals() + "\n" + res;
			
			res += "\n";
			res += "\ndeclare module \"fit-ui\"";
			res += "\n{";
			res += "\n	export = Fit;";
			res += "\n}";
		}
		
		return res;
	}
	
	function getMembersForContainer(containerName, tabsStr) // Generate typings for class members (properties and functions)
	{
		var res = "";
		var tabs = ((tabsStr !== undefined) ? tabsStr : "");
		var containerObject = getContainerByName(containerName);
		var longContainerName = containerObject.Name;
		var shortContainerName = longContainerName.substring(longContainerName.lastIndexOf(".") + 1); // E.g. Fit.Controls.Button => Button
		var exts = ((containerObject.Extends != "") ? containerObject.Extends.split(";") : []);

		var isClass = (getProperties(longContainerName).length > 0 || getFunctions(longContainerName).length > 0);
		var hasSubClass = (isClass === true && getContainers(longContainerName).length > 0);
		
		// Add properties
		
		res += "\n" + tabs + "// Properties defined by " + longContainerName;
		
		Fit.Array.ForEach(getProperties(longContainerName), function(p)
		{
			res += "\n" + tabs + "/**";
			res += "\n" + tabs + "* " + p.Description;
			res += "\n" + tabs + "* @member [" + p.Type + " " + p.Name + "]";
			res += "\n" + tabs + "*/";

			res += "\n" + tabs + p.Name + ":" + getType(p.Type) + ";";
		});

		// Add functions

		Fit.Array.ForEach(getFunctions(longContainerName), function(f)
		{
			// Determine function return type

			var returnType = null;
			
			if (f.Returns)
			{
				var containerInstance = getContainerByName(f.Returns.replace("[]", "")); // Null for e.g. string, boolean, integer, etc.
				
				if (containerInstance !== null && Fit.Array.Contains(enums, containerInstance) === true)
				{
					returnType = "typeof " + f.Returns + "[keyof __FitInternals.I" + getContainerTypingName(f.Returns) + "]";
				}
				else if (containerInstance !== null && Fit.Array.Contains(internals, containerInstance) === true)
				{
					returnType = "__FitInternals." + getContainerTypingName(f.Returns);
				}
				else
				{
					returnType = getType(f.Returns);
				}
			}

			// Construct function signature

			if (hasSubClass === true && f.Static === true) // NOTICE: Will not work if we add support for creating instances of "Fit"! We can't mix static functions and object functions!
			{
				var parms = getParameterString(f, tabs);
				res += "\n" + tabs + "export function " + f.Name + "(" + parms.Typings + "):" + (returnType !== null ? returnType : "void") + ";";
			}
			else
			{
				var funcName = (f.Name === shortContainerName ? "constructor" : f.Name);
				var access = (funcName !== "constructor" ? "public " : "") + (f.Static === true ? "static " : "");
				var parms = getParameterString(f, tabs);
				
				res += "\n" + tabs + "/**";
				res += "\n" + tabs + "* " + f.Description;
				res += "\n" + tabs + "* @function " + f.Name;
				res += parms.Docs;
				if (returnType !== null)
					res += "\n" + tabs + "* @returns " + returnType;
				res += "\n" + tabs + "*/";

				res += "\n" + tabs + access + funcName + "(" + parms.Typings + ")" + (funcName !== "constructor" ? ":" + (returnType !== null ? returnType : "void") : "") + ";";
			}
		});
		
		// Add members (properties and functions) from containers/classes from which the current container/class extends
		
		for (var i = 0 ; i < exts.length ; i++)
			res += getMembersForContainer(exts[i], tabs);
		
		return res;
	}
	
	function getParameterString(functionInstance, tabsStr) // Return typings for function parameters
	{
		var tabs = ((tabsStr !== undefined) ? tabsStr : "");	
		var str = "";
		var docs = "";
		
		Fit.Array.ForEach(functionInstance.Parameters, function(p)
		{
			var containerInstance = getContainerByName(p.Type.replace("[]", "")); // Null for e.g. string, boolean, integer, etc.
			var type = null;
			
			if (containerInstance !== null && Fit.Array.Contains(enums, containerInstance) === true)
			{;
				type = "typeof " + p.Type + "[keyof __FitInternals.I" + getContainerTypingName(p.Type) + "]";
			}
			else if (containerInstance !== null && Fit.Array.Contains(internals, containerInstance) === true)
			{
				type = "__FitInternals." + getContainerTypingName(p.Type);
			}
			else
			{
				type = getType(p.Type);
			}
				
			docs += "\n" + tabs + "* @param {" + p.Type + "} " + (p.Default ? "[" + p.Name + "=" + p.Default + "]" : p.Name) + " " + p.Description;
		
			str += (str !== "" ? ", " : "") + p.Name;
			str += (p.Default ? "?" : "");
			str += ":";
			str += type;
		});
		
		return { Typings: str, Docs: docs };
	}
	
	function getTypingsForInternals() // Return typings for internal members (enums and classes nested in other classes - e.g. Fit.Controls.Button.Type and Fit.Controls.TreeView.Node)
	{
		var res = "";
		//var containers = [];
		
		res += "/**";
		res += "\n* STOP! Do NOT use __FitInternals!";
		res += "\n* It is used only to support Fit.UI Typings.";
		res += "\n* @class [__FitInternals]";
		res += "\n*/";
		res += "\ndeclare namespace __FitInternals";
		res += "\n{";
		
		// Enums are registered as interfaces and exposed as members on their classes like so:
		// public static readonly Type: __FitInternals.IFitControlsButtonType;
		// The code above is found in Fit.Controls.Button.
		
		Fit.Array.ForEach(enums, function(en)
		{
			//en.__isEnum = true;
			//Fit.Array.Add(containers, en);
		
			res += "\n\tinterface I" + getContainerTypingName(en.Name);
			res += "\n\t{";
			
			Fit.Array.ForEach(getProperties(en.Name), function(p)
			{
				res += "\n\t\t/**";
				res += "\n\t\t* " + p.Description;
				res += "\n\t\t* @member [" + p.Type + " " + p.Name + "]";
				res += "\n\t\t*/";
			
				res += "\n\t\t" + p.Name + ": \"" + p.Default + "\";";
			});
			
			res += "\n\t}";
		});
		
		// Nested classes (e.g. Fit.Controls.TreeView.Node) is registered as traditional classes
		// within the "internal" namespace since nested classes are not supported in typings.
		
		Fit.Array.ForEach(internals, function(it)
		{
			//Fit.Array.Add(containers, it);
			res += getTypingsForContainer(it.Name, "\t", true);
		});
		
		res += "\n}";
		
		return res;
	}
	
	function getType(type)
	{
		if (type === "DOMElement")
			return "HTMLElement";
		if (type === "DOMNode")
			return "Node";
		else if (type === "array")
			return "any[]"; //"object[]"; //return "Array<object>";
		else if (type === "object")
			return "any";
		else if (type === "function")
			return "Function";
		else if (type === "integer") // TODO: Integer is not supported in TypeScript, but passing in a decimal where an integer is expected will cause Fit.UI to throw a type validation exception runtime
			return "number";
		
		return type;
	}
	
	function getContainerTypingName(containerName) // Transforms e.g. Fit.Controls.Button to FitControlsButton
	{
		return containerName.replace(/\./g, "");
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
			me.GetInternals = getInternals;
			me.Data = {};
			me.Data.Containers = Fit.Core.Clone(containers);
			me.Data.Properties = Fit.Core.Clone(properties);
			me.Data.Functions = Fit.Core.Clone(functions);
			me.Data.Internals = Fit.Core.Clone(internals);
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
