
/**
* 
* @namespace [Fit Fit]
*/
declare namespace Fit
{
	// Functions defined by Fit
	/**
	* Get absolute path to Fit.UI on server - e.g. /libs/fitui.
	* @function GetPath
	* @static
	* @returns string
	*/
	export function GetPath():string;
	/**
	* Get fully qualified URL to Fit.UI on server - e.g. http://server.com/libs/fitui.
	* @function GetUrl
	* @static
	* @returns string
	*/
	export function GetUrl():string;
	/**
	* Get Fit.UI version object containing the following properties:
	Major (integer), Minor (integer), Patch (integer), Version (string representing Major.Minor.Patch).
	* @function GetVersion
	* @static
	* @returns Fit.CoreTypeDefs.VersionInfo
	*/
	export function GetVersion():Fit.CoreTypeDefs.VersionInfo;
	/**
	* Set path to Fit.UI on server - e.g. libs/fitui.
	This may be necessary if Fit.UI is loaded dynamically
	using RequireJS or bundled using e.g. WebPack.
	Changing the path affects the return value of both
	GetUrl() and GetPath(), and from where Fit.UI will
	load resources dynamically.
	* @function SetPath
	* @static
	* @param {string} basePath - Absolute or relative path to folder containing Fit.UI.
	*/
	export function SetPath(basePath:string):void;
	/**
	* Set URL to Fit.UI on server - e.g. http://cdn/libs/fitui/.
	This may be necessary if Fit.UI is loaded dynamically
	from a foreign domain such as a CDN (Content Delivery Network).
	Changing the URL affects the return value of both
	GetUrl() and GetPath(), and from where Fit.UI will
	load resources dynamically.
	* @function SetUrl
	* @static
	* @param {string} baseUrl - Full URL to folder containing Fit.UI.
	*/
	export function SetUrl(baseUrl:string):void;
	/**
	* Functionality extending the capabilities of native JS arrays.
	* @class [Fit.Array Array]
	*/
	class Array
	{
		// Functions defined by Fit.Array
		/**
		* Add object to array.
		* @function Add
		* @static
		* @param {any[]} arr - Array to which object is added.
		* @param {any} obj - Object to add to array.
		*/
		public static Add(arr:any[], obj:any):void;
		/**
		* Clear all items from array.
		* @function Clear
		* @static
		* @param {any[]} arr - Array from which all objects are remove.
		*/
		public static Clear(arr:any[]):void;
		/**
		* Returns True if given object is contained in collection, otherwise False.
		* @function Contains
		* @static
		* @param {any[] | HTMLCollection | NodeList | NamedNodeMap | FileList | StyleSheetList | CSSRuleList} arr - Collection to search through.
		* @param {any} obj - Object to look for.
		* @returns boolean
		*/
		public static Contains(arr:any[] | HTMLCollection | NodeList | NamedNodeMap | FileList | StyleSheetList | CSSRuleList, obj:any):boolean;
		/**
		* Returns a shallow copy of the collection. For a deep copy see Fit.Core.Clone(..).
		* @template Type
		* @function Copy
		* @static
		* @param {Type[]} arr - Collection to copy.
		* @returns Type[]
		*/
		public static Copy<Type>(arr:Type[]):Type[];
		/**
		* Returns a shallow copy of the collection. For a deep copy see Fit.Core.Clone(..).
		* @function Copy
		* @static
		* @param {HTMLCollection} arr - Collection to copy.
		* @returns HTMLElement[]
		*/
		public static Copy(arr:HTMLCollection):HTMLElement[];
		/**
		* Returns a shallow copy of the collection. For a deep copy see Fit.Core.Clone(..).
		* @function Copy
		* @static
		* @param {NodeList} arr - Collection to copy.
		* @returns Node[]
		*/
		public static Copy(arr:NodeList):Node[];
		/**
		* Returns a shallow copy of the collection. For a deep copy see Fit.Core.Clone(..).
		* @function Copy
		* @static
		* @param {NamedNodeMap} arr - Collection to copy.
		* @returns Attr[]
		*/
		public static Copy(arr:NamedNodeMap):Attr[];
		/**
		* Returns a shallow copy of the collection. For a deep copy see Fit.Core.Clone(..).
		* @function Copy
		* @static
		* @param {FileList} arr - Collection to copy.
		* @returns File[]
		*/
		public static Copy(arr:FileList):File[];
		/**
		* Returns a shallow copy of the collection. For a deep copy see Fit.Core.Clone(..).
		* @function Copy
		* @static
		* @param {StyleSheetList} arr - Collection to copy.
		* @returns StyleSheet[]
		*/
		public static Copy(arr:StyleSheetList):StyleSheet[];
		/**
		* Returns a shallow copy of the collection. For a deep copy see Fit.Core.Clone(..).
		* @function Copy
		* @static
		* @param {CSSRuleList} arr - Collection to copy.
		* @returns CSSRule[]
		*/
		public static Copy(arr:CSSRuleList):CSSRule[];
		/**
		* Returns number of elements in collection.
		* @function Count
		* @static
		* @param {any[] | HTMLCollection | NodeList | NamedNodeMap | FileList | StyleSheetList | CSSRuleList} arr - Collection to count elements within.
		* @returns number
		*/
		public static Count(arr:any[] | HTMLCollection | NodeList | NamedNodeMap | FileList | StyleSheetList | CSSRuleList):number;
		/**
		* Returns number of elements in object array.
		* @function Count
		* @static
		* @param {any} obj - Object array to count elements within.
		* @returns number
		*/
		public static Count(obj:any):number;
		/**
		* Iterates through objects in collection and passes each object to provided callback.
		Callback is expected to return any children supposed to be iterated too, or Null
		if further/deeper iteration is not required.
		* @template Type
		* @function CustomRecurse
		* @static
		* @param {Type[]} arr - Collection containing objects to iterate through.
		* @param {(obj:Type) => Type[] | null | void} callback - Callback function accepting objects from the collection, passed in turn.
		Function must return children collection to continue recursive operation,
		or Null (or nothing) to stop further processing.
		* @returns boolean
		*/
		public static CustomRecurse<Type>(arr:Type[], callback:(obj:Type) => Type[] | null | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to provided callback.
		Callback is expected to return any children supposed to be iterated too, or Null
		if further/deeper iteration is not required.
		* @function CustomRecurse
		* @static
		* @param {HTMLCollection} arr - Collection containing objects to iterate through.
		* @param {(obj:HTMLElement) => HTMLCollection | HTMLElement[] | null | void} callback - Callback function accepting objects from the collection, passed in turn.
		Function must return children collection to continue recursive operation,
		or Null (or nothing) to stop further processing.
		* @returns boolean
		*/
		public static CustomRecurse(arr:HTMLCollection, callback:(obj:HTMLElement) => HTMLCollection | HTMLElement[] | null | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to provided callback.
		Callback is expected to return any children supposed to be iterated too, or Null
		if further/deeper iteration is not required.
		* @function CustomRecurse
		* @static
		* @param {NodeList} arr - Collection containing objects to iterate through.
		* @param {(obj:Node) => NodeList | Node[] | null | void} callback - Callback function accepting objects from the collection, passed in turn.
		Function must return children collection to continue recursive operation,
		or Null (or nothing) to stop further processing.
		* @returns boolean
		*/
		public static CustomRecurse(arr:NodeList, callback:(obj:Node) => NodeList | Node[] | null | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to provided callback.
		Callback is expected to return any children supposed to be iterated too, or Null
		if further/deeper iteration is not required.
		* @function CustomRecurse
		* @static
		* @param {NamedNodeMap[]} arr - Collection containing objects to iterate through.
		* @param {(obj:Attr) => NamedNodeMap | Attr[] | null | void} callback - Callback function accepting objects from the collection, passed in turn.
		Function must return children collection to continue recursive operation,
		or Null (or nothing) to stop further processing.
		* @returns boolean
		*/
		public static CustomRecurse(arr:NamedNodeMap[], callback:(obj:Attr) => NamedNodeMap | Attr[] | null | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to provided callback.
		Callback is expected to return any children supposed to be iterated too, or Null
		if further/deeper iteration is not required.
		* @function CustomRecurse
		* @static
		* @param {FileList} arr - Collection containing objects to iterate through.
		* @param {(obj:File) => FileList | File[] | null | void} callback - Callback function accepting objects from the collection, passed in turn.
		Function must return children collection to continue recursive operation,
		or Null (or nothing) to stop further processing.
		* @returns boolean
		*/
		public static CustomRecurse(arr:FileList, callback:(obj:File) => FileList | File[] | null | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to provided callback.
		Callback is expected to return any children supposed to be iterated too, or Null
		if further/deeper iteration is not required.
		* @function CustomRecurse
		* @static
		* @param {StyleSheetList} arr - Collection containing objects to iterate through.
		* @param {(obj:StyleSheet) => StyleSheetList | StyleSheet[] | null | void} callback - Callback function accepting objects from the collection, passed in turn.
		Function must return children collection to continue recursive operation,
		or Null (or nothing) to stop further processing.
		* @returns boolean
		*/
		public static CustomRecurse(arr:StyleSheetList, callback:(obj:StyleSheet) => StyleSheetList | StyleSheet[] | null | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to provided callback.
		Callback is expected to return any children supposed to be iterated too, or Null
		if further/deeper iteration is not required.
		* @function CustomRecurse
		* @static
		* @param {CSSRuleList} arr - Collection containing objects to iterate through.
		* @param {(obj:CSSRule) => CSSRuleList | CSSRule[] | null | void} callback - Callback function accepting objects from the collection, passed in turn.
		Function must return children collection to continue recursive operation,
		or Null (or nothing) to stop further processing.
		* @returns boolean
		*/
		public static CustomRecurse(arr:CSSRuleList, callback:(obj:CSSRule) => CSSRuleList | CSSRule[] | null | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @template Type
		* @function ForEach
		* @static
		* @param {Type[]} arr - Collection containing objects to iterate through.
		* @param {(obj:Type) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach<Type>(arr:Type[], callback:(obj:Type) => boolean | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @function ForEach
		* @static
		* @param {HTMLCollection} arr - Collection containing objects to iterate through.
		* @param {(obj:HTMLElement) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach(arr:HTMLCollection, callback:(obj:HTMLElement) => boolean | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @function ForEach
		* @static
		* @param {NodeList} arr - Collection containing objects to iterate through.
		* @param {(obj:Node) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach(arr:NodeList, callback:(obj:Node) => boolean | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @function ForEach
		* @static
		* @param {NamedNodeMap} arr - Collection containing objects to iterate through.
		* @param {(obj:Attr) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach(arr:NamedNodeMap, callback:(obj:Attr) => boolean | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @function ForEach
		* @static
		* @param {FileList} arr - Collection containing objects to iterate through.
		* @param {(obj:File) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach(arr:FileList, callback:(obj:File) => boolean | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @function ForEach
		* @static
		* @param {StyleSheetList} arr - Collection containing objects to iterate through.
		* @param {(obj:StyleSheet) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach(arr:StyleSheetList, callback:(obj:StyleSheet) => boolean | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @function ForEach
		* @static
		* @param {CSSRuleList} arr - Collection containing objects to iterate through.
		* @param {(obj:CSSRule) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach(arr:CSSRuleList, callback:(obj:CSSRule) => boolean | void):boolean;
		/**
		* Iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @function ForEach
		* @static
		* @param {any[]} arr - Collection containing objects to iterate through.
		* @param {(obj:any) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach(arr:any[], callback:(obj:any) => boolean | void):boolean;
		/**
		* Iterates through object properties and passes each property name to the provided callback function.
		Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @function ForEach
		* @static
		* @param {any} obj - Object containing properties to iterate through.
		* @param {(key:string) => boolean | void} callback - Callback function accepting properties from the object, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach(obj:any, callback:(key:string) => boolean | void):boolean;
		/**
		* Returns index of object in collection if found, otherwise a value of -1 is returned.
		* @function GetIndex
		* @static
		* @param {any[] | HTMLCollection | NodeList | NamedNodeMap | FileList | StyleSheetList | CSSRuleList} arr - Collection to search through.
		* @param {any} obj - Object to obtain index for.
		* @returns number
		*/
		public static GetIndex(arr:any[] | HTMLCollection | NodeList | NamedNodeMap | FileList | StyleSheetList | CSSRuleList, obj:any):number;
		/**
		* Returns all keys in collection (indices) - 0, 1, 2, 3, ...
		* @function GetKeys
		* @static
		* @param {any[] | HTMLCollection | NodeList | NamedNodeMap | FileList | StyleSheetList | CSSRuleList} arr - Collection to get keys from.
		* @returns number[]
		*/
		public static GetKeys(arr:any[] | HTMLCollection | NodeList | NamedNodeMap | FileList | StyleSheetList | CSSRuleList):number[];
		/**
		* Returns all keys (property names) in object.
		* @function GetKeys
		* @static
		* @param {any} obj - Object to get keys from.
		* @returns string[]
		*/
		public static GetKeys(obj:any):string[];
		/**
		* Returns True if collection has items, otherwise False.
		* @function HasItems
		* @static
		* @param {any[] | HTMLCollection | NodeList | NamedNodeMap | FileList | StyleSheetList | CSSRuleList} arr - Collection to investigate.
		* @returns boolean
		*/
		public static HasItems(arr:any[] | HTMLCollection | NodeList | NamedNodeMap | FileList | StyleSheetList | CSSRuleList):boolean;
		/**
		* Returns True if object array has items, otherwise False.
		* @function HasItems
		* @static
		* @param {any} obj - Object array to investigate.
		* @returns boolean
		*/
		public static HasItems(obj:any):boolean;
		/**
		* Insert object into array at specified index.
		* @function Insert
		* @static
		* @param {any[]} arr - Array into which object is inserted.
		* @param {number} idx - Index to insert object at.
		* @param {any} obj - Object to insert into array.
		*/
		public static Insert(arr:any[], idx:number, obj:any):void;
		/**
		* Join objects from a collection into a string.
		* @template Type
		* @function Join
		* @static
		* @param {Type[]} arr - Collection containing objects.
		* @param {string} separator - String used to glue values together.
		* @param {(obj:Type) => string} callback - Callback returning string representation of objects passed from collection in turn.
		* @returns string
		*/
		public static Join<Type>(arr:Type[], separator:string, callback:(obj:Type) => string):string;
		/**
		* Join objects from a collection into a string.
		* @function Join
		* @static
		* @param {HTMLCollection} arr - Collection containing objects.
		* @param {string} separator - String used to glue values together.
		* @param {(obj:HTMLElement) => string} callback - Callback returning string representation of objects passed from collection in turn.
		* @returns string
		*/
		public static Join(arr:HTMLCollection, separator:string, callback:(obj:HTMLElement) => string):string;
		/**
		* Join objects from a collection into a string.
		* @function Join
		* @static
		* @param {NodeList} arr - Collection containing objects.
		* @param {string} separator - String used to glue values together.
		* @param {(obj:Node) => string} callback - Callback returning string representation of objects passed from collection in turn.
		* @returns string
		*/
		public static Join(arr:NodeList, separator:string, callback:(obj:Node) => string):string;
		/**
		* Join objects from a collection into a string.
		* @function Join
		* @static
		* @param {NamedNodeMap} arr - Collection containing objects.
		* @param {string} separator - String used to glue values together.
		* @param {(obj:Attr) => string} callback - Callback returning string representation of objects passed from collection in turn.
		* @returns string
		*/
		public static Join(arr:NamedNodeMap, separator:string, callback:(obj:Attr) => string):string;
		/**
		* Join objects from a collection into a string.
		* @function Join
		* @static
		* @param {FileList} arr - Collection containing objects.
		* @param {string} separator - String used to glue values together.
		* @param {(obj:File) => string} callback - Callback returning string representation of objects passed from collection in turn.
		* @returns string
		*/
		public static Join(arr:FileList, separator:string, callback:(obj:File) => string):string;
		/**
		* Join objects from a collection into a string.
		* @function Join
		* @static
		* @param {StyleSheetList} arr - Collection containing objects.
		* @param {string} separator - String used to glue values together.
		* @param {(obj:StyleSheet) => string} callback - Callback returning string representation of objects passed from collection in turn.
		* @returns string
		*/
		public static Join(arr:StyleSheetList, separator:string, callback:(obj:StyleSheet) => string):string;
		/**
		* Join objects from a collection into a string.
		* @function Join
		* @static
		* @param {CSSRuleList} arr - Collection containing objects.
		* @param {string} separator - String used to glue values together.
		* @param {(obj:CSSRule) => string} callback - Callback returning string representation of objects passed from collection in turn.
		* @returns string
		*/
		public static Join(arr:CSSRuleList, separator:string, callback:(obj:CSSRule) => string):string;
		/**
		* Merge/join two arrays.
		* @template TypeA
		* @template TypeB
		* @function Merge
		* @static
		* @param {TypeA[]} arr1 - Array 1 to merge with array 2.
		* @param {TypeB[]} arr2 - Array 2 to merge with array 1.
		* @returns (TypeA | TypeB)[]
		*/
		public static Merge<TypeA, TypeB>(arr1:TypeA[], arr2:TypeB[]):(TypeA | TypeB)[];
		/**
		* Move object within array from one position to another.
		* @function Move
		* @static
		* @param {any[]} arr - Array to manipulate.
		* @param {number} fromIdx - Position of object to move.
		* @param {number} ToIdx - New object position.
		*/
		public static Move(arr:any[], fromIdx:number, ToIdx:number):void;
		/**
		* Recursively iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether recursion was carried through (True) or interrupted (False).
		* @template Type
		* @function Recurse
		* @static
		* @param {Type[]} arr - Collection containing objects to iterate through.
		* @param {string} childrenProperty - Name of property or argumentless getter function returning children (e.g. "Children" or "GetChildren").
		* @param {(obj:Type) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static Recurse<Type>(arr:Type[], childrenProperty:string, callback:(obj:Type) => boolean | void):boolean;
		/**
		* Recursively iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether recursion was carried through (True) or interrupted (False).
		* @function Recurse
		* @static
		* @param {HTMLCollection} arr - Collection containing objects to iterate through.
		* @param {string} childrenProperty - Name of property or argumentless getter function returning children (e.g. "Children" or "GetChildren").
		* @param {(obj:HTMLElement) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static Recurse(arr:HTMLCollection, childrenProperty:string, callback:(obj:HTMLElement) => boolean | void):boolean;
		/**
		* Recursively iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether recursion was carried through (True) or interrupted (False).
		* @function Recurse
		* @static
		* @param {NodeList} arr - Collection containing objects to iterate through.
		* @param {string} childrenProperty - Name of property or argumentless getter function returning children (e.g. "Children" or "GetChildren").
		* @param {(obj:Node) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static Recurse(arr:NodeList, childrenProperty:string, callback:(obj:Node) => boolean | void):boolean;
		/**
		* Recursively iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether recursion was carried through (True) or interrupted (False).
		* @function Recurse
		* @static
		* @param {NamedNodeMap} arr - Collection containing objects to iterate through.
		* @param {string} childrenProperty - Name of property or argumentless getter function returning children (e.g. "Children" or "GetChildren").
		* @param {(obj:Attr) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static Recurse(arr:NamedNodeMap, childrenProperty:string, callback:(obj:Attr) => boolean | void):boolean;
		/**
		* Recursively iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether recursion was carried through (True) or interrupted (False).
		* @function Recurse
		* @static
		* @param {FileList} arr - Collection containing objects to iterate through.
		* @param {string} childrenProperty - Name of property or argumentless getter function returning children (e.g. "Children" or "GetChildren").
		* @param {(obj:File) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static Recurse(arr:FileList, childrenProperty:string, callback:(obj:File) => boolean | void):boolean;
		/**
		* Recursively iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether recursion was carried through (True) or interrupted (False).
		* @function Recurse
		* @static
		* @param {StyleSheetList} arr - Collection containing objects to iterate through.
		* @param {string} childrenProperty - Name of property or argumentless getter function returning children (e.g. "Children" or "GetChildren").
		* @param {(obj:StyleSheet) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static Recurse(arr:StyleSheetList, childrenProperty:string, callback:(obj:StyleSheet) => boolean | void):boolean;
		/**
		* Recursively iterates through objects in collection and passes each object to the provided callback function.
		Returns boolean indicating whether recursion was carried through (True) or interrupted (False).
		* @function Recurse
		* @static
		* @param {CSSRuleList} arr - Collection containing objects to iterate through.
		* @param {string} childrenProperty - Name of property or argumentless getter function returning children (e.g. "Children" or "GetChildren").
		* @param {(obj:CSSRule) => boolean | void} callback - Callback function accepting objects from the collection, passed in turn.
		Return False from callback to break loop.
		* @returns boolean
		*/
		public static Recurse(arr:CSSRuleList, childrenProperty:string, callback:(obj:CSSRule) => boolean | void):boolean;
		/**
		* Remove object from array.
		* @function Remove
		* @static
		* @param {any[]} arr - Array from which object is remove.
		* @param {any} obj - Object to remove from array.
		*/
		public static Remove(arr:any[], obj:any):void;
		/**
		* Remove object from array at specified index.
		* @function RemoveAt
		* @static
		* @param {any[]} arr - Array from which object is remove.
		* @param {number} idx - Object index in array.
		*/
		public static RemoveAt(arr:any[], idx:number):void;
		/**
		* Convert collection to a traditional JavaScript array.
		* @function ToArray
		* @static
		* @param {HTMLCollection} coll - Collection to convert to array.
		* @returns HTMLElement[]
		*/
		public static ToArray(coll:HTMLCollection):HTMLElement[];
		/**
		* Convert collection to a traditional JavaScript array.
		* @function ToArray
		* @static
		* @param {NodeList} coll - Collection to convert to array.
		* @returns Node[]
		*/
		public static ToArray(coll:NodeList):Node[];
		/**
		* Convert collection to a traditional JavaScript array.
		* @function ToArray
		* @static
		* @param {NamedNodeMap} coll - Collection to convert to array.
		* @returns Attr[]
		*/
		public static ToArray(coll:NamedNodeMap):Attr[];
		/**
		* Convert collection to a traditional JavaScript array.
		* @function ToArray
		* @static
		* @param {FileList} coll - Collection to convert to array.
		* @returns File[]
		*/
		public static ToArray(coll:FileList):File[];
		/**
		* Convert collection to a traditional JavaScript array.
		* @function ToArray
		* @static
		* @param {StyleSheetList} coll - Collection to convert to array.
		* @returns StyleSheet[]
		*/
		public static ToArray(coll:StyleSheetList):StyleSheet[];
		/**
		* Convert collection to a traditional JavaScript array.
		* @function ToArray
		* @static
		* @param {CSSRuleList} coll - Collection to convert to array.
		* @returns CSSRule[]
		*/
		public static ToArray(coll:CSSRuleList):CSSRule[];
		/**
		* Copy array to a new array.
		* @template Type
		* @function ToArray
		* @static
		* @param {Type[]} coll - Array to copy to a new array.
		* @returns Type[]
		*/
		public static ToArray<Type>(coll:Type[]):Type[];
	}
	/**
	* Provides access to various browser information.
	
	// Example code
	
	var browserName = Fit.Browser.GetBrowser();
	var browserVersion = Fit.Browser.GetVersion();
	var browserLanguage = Fit.Browser.GetLanguage();
	
	if (browserName === "MSIE" && browserVersion < 7)
	{
	     if (browserLanguage === "da")
	         alert("Opgrader venligst til IE7 eller nyere");
	     else
	         alert("Please upgrade to IE7 or newer");
	}.
	* @class [Fit.Browser Browser]
	*/
	class Browser
	{
		// Functions defined by Fit.Browser
		/**
		* Returns name of browser. Possible values are: Chrome (which also covers modern versions of Opera and Edge),
		Safari, Edge (version 12-18), MSIE (version 8-11), Firefox, Opera (version 1-12), Unknown.
		* @function GetBrowser
		* @static
		* @param {false} [returnAppId=false] - Set True to have app specific identifier returned.
		* @returns "Edge" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "Unknown"
		*/
		public static GetBrowser(returnAppId?:false):"Edge" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "Unknown";
		/**
		* Returns browser app identifer. Possible values are: Chrome, Safari, Edge (version 12-18), EdgeChromium (version 85+),
		MSIE (version 8-11), Firefox, Opera (version 1-12), OperaChromium (version 15+), Unknown.
		* @function GetBrowser
		* @static
		* @param {true} returnAppId - Set True to have app specific identifier returned.
		* @returns "Edge" | "EdgeChromium" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "OperaChromium" | "Unknown"
		*/
		public static GetBrowser(returnAppId:true):"Edge" | "EdgeChromium" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "OperaChromium" | "Unknown";
		/**
		* Get style value applied after stylesheets have been loaded.
		An empty string or null may be returned if style has not been defined or does not exist.
		Make sure not to use shorthand properties (e.g. border-color or padding) as some browsers are
		not capable of calculating these - use the fully qualified property name (e.g. border-left-color
		or padding-left).
		* @function GetComputedStyle
		* @static
		* @param {HTMLElement} elm - Element which contains desired CSS style value.
		* @param {string} style - CSS style property name.
		* @returns string | null
		*/
		public static GetComputedStyle(elm:HTMLElement, style:string):string | null;
		/**
		* Returns cached object with browser information.
		* @function GetInfo
		* @static
		* @param {false} [returnAppInfo=false] - Set True to have app specific browser information returned - see GetBrowser(..) for details.
		* @returns Fit.BrowserTypeDefs.BrowserInfo
		*/
		public static GetInfo(returnAppInfo?:false):Fit.BrowserTypeDefs.BrowserInfo;
		/**
		* Returns cached object with browser app information.
		* @function GetInfo
		* @static
		* @param {true} returnAppInfo - Set True to have app specific browser information returned - see GetBrowser(..) for details.
		* @returns Fit.BrowserTypeDefs.BrowserAppInfo
		*/
		public static GetInfo(returnAppInfo:true):Fit.BrowserTypeDefs.BrowserAppInfo;
		/**
		* Returns browser language - e.g. "da" (Danish), "en" (English) etc.
		* @function GetLanguage
		* @static
		* @returns string
		*/
		public static GetLanguage():string;
		/**
		* Returns page height in pixels.
		* @function GetPageHeight
		* @static
		* @returns number
		*/
		public static GetPageHeight():number;
		/**
		* Returns page width in pixels.
		* @function GetPageWidth
		* @static
		* @returns number
		*/
		public static GetPageWidth():number;
		/**
		* Returns query string information.
		* @function GetQueryString
		* @static
		* @param {string} [alternativeUrl=undefined] - Alternative URL to parse.
		* @returns Fit.BrowserTypeDefs.QueryString
		*/
		public static GetQueryString(alternativeUrl?:string):Fit.BrowserTypeDefs.QueryString;
		/**
		* Returns object with Width and Height properties specifying screen dimensions.
		* @function GetScreenDimensions
		* @static
		* @param {boolean} [onlyAvailable=false] - Set True to return only available space (may be reduced by e.g. Start menu (Windows) or Dock (Linux/OSX).
		* @returns Fit.TypeDefs.Dimension
		*/
		public static GetScreenDimensions(onlyAvailable?:boolean):Fit.TypeDefs.Dimension;
		/**
		* Get screen height.
		* @function GetScreenHeight
		* @static
		* @param {boolean} [onlyAvailable=false] - Set True to return only available space (may be reduced by e.g. start menu (Windows) or Dock (Linux/OSX).
		* @returns number
		*/
		public static GetScreenHeight(onlyAvailable?:boolean):number;
		/**
		* Get screen width.
		* @function GetScreenWidth
		* @static
		* @param {boolean} [onlyAvailable=false] - Set True to return only available space (may be reduced by e.g. start menu (Windows) or Dock (Linux/OSX).
		* @returns number
		*/
		public static GetScreenWidth(onlyAvailable?:boolean):number;
		/**
		* Get information about scrollbars in viewport.
		Returns an object with Vertical and Horizontal properties, each containing
		Enabled and Size properties, which can be used to determine whether scrolling is enabled,
		and the size of the scrollbar. The size remains 0 when scrolling is not enabled.
		To determine whether a DOM element has scrolling enabled, use Fit.Dom.GetScrollBars(..).
		* @function GetScrollBars
		* @static
		* @returns Fit.TypeDefs.ScrollBarsPresent
		*/
		public static GetScrollBars():Fit.TypeDefs.ScrollBarsPresent;
		/**
		* Get thickness of browser scrollbars. The function works even when
		no scrollbars are currently present. For browsers and operating systems
		hiding scrollbars for scrollable objects, the value returned will be 0 (zero).
		* @function GetScrollBarSize
		* @static
		* @returns number
		*/
		public static GetScrollBarSize():number;
		/**
		* Get scrolling document element. This is the cross browser
		equivalent of document.scrollingElement.
		* @function GetScrollDocument
		* @static
		* @returns HTMLElement
		*/
		public static GetScrollDocument():HTMLElement;
		/**
		* Returns object with X and Y properties specifying scroll position.
		* @function GetScrollPosition
		* @static
		* @returns Fit.TypeDefs.Position
		*/
		public static GetScrollPosition():Fit.TypeDefs.Position;
		/**
		* Returns major version number for known browsers, -1 for unknown browsers.
		* @function GetVersion
		* @static
		* @param {boolean} [returnAppVersion=false] - Set True to have app specific version number returned, rather than version number of browser engine.
		If version number is used in combination with the result from Fit.Browser.GetBrowser(true), then
		this argument should be True as well, otherwise False (default).
		* @returns number
		*/
		public static GetVersion(returnAppVersion?:boolean):number;
		/**
		* Returns object with Width and Height properties specifying dimensions of viewport.
		* @function GetViewPortDimensions
		* @static
		* @param {boolean} [includeScrollbars=false] - Include scrollbars if present to get all potential space available if scrollbars are removed.
		* @returns Fit.TypeDefs.Dimension
		*/
		public static GetViewPortDimensions(includeScrollbars?:boolean):Fit.TypeDefs.Dimension;
		/**
		* Returns value indicating whether devices currently being used is a mobile device or not.
		* @function IsMobile
		* @static
		* @param {boolean} [includeTablets=true] - Value indicating whether tablets are considered mobile devices or not.
		* @returns boolean
		*/
		public static IsMobile(includeTablets?:boolean):boolean;
		/**
		* Returns value indicating whether Session and Local storage is supported or not.
		* @function IsStorageSupported
		* @static
		* @returns boolean
		*/
		public static IsStorageSupported():boolean;
		/**
		* Log message or object.
		* @function Log
		* @static
		* @param {any} msg - Message or object to log.
		*/
		public static Log(msg:any):void;
		/**
		* Log message about use of deprecated feature.
		* @function LogDeprecated
		* @static
		* @param {string} msg - Message to log.
		*/
		public static LogDeprecated(msg:string):void;
		/**
		* Parses well-formed URLs and returns an object containing the various components.
		* @function ParseUrl
		* @static
		* @param {string} url - Well-formed URL to parse.
		* @returns Fit.BrowserTypeDefs.ParsedUrl
		*/
		public static ParseUrl(url:string):Fit.BrowserTypeDefs.ParsedUrl;
	}
	/**
	* 
	* @class [Fit.Color Color]
	*/
	class Color
	{
		// Functions defined by Fit.Color
		/**
		* Convert HEX color string into RGB color string.
		* @function HexToRgb
		* @static
		* @param {string} hex - HEX color string, e.g. #C0C0C0 (hash symbol is optional).
		* @returns string
		*/
		public static HexToRgb(hex:string):string;
		/**
		* Returns True if value is a valid HEX color value, otherwise False.
		* @function IsHex
		* @static
		* @param {string} val - Value to validate.
		* @returns boolean
		*/
		public static IsHex(val:string):boolean;
		/**
		* Returns True if value is a valid RGB(A) color value, otherwise False.
		* @function IsRgb
		* @static
		* @param {string} val - Value to validate.
		* @returns boolean
		*/
		public static IsRgb(val:string):boolean;
		/**
		* Convert HEX color string into RGB color object, e.g. { Red: 150, Green: 30, Blue: 185 }.
		* @function ParseHex
		* @static
		* @param {string} hex - HEX color string, e.g. #C0C0C0 (hash symbol is optional).
		* @returns Fit.ColorTypeDefs.RgbColor
		*/
		public static ParseHex(hex:string):Fit.ColorTypeDefs.RgbColor;
		/**
		* Parses RGB(A) string and turns result into a RGB(A) color object, e.g. { Red: 100, Green: 100, Blue: 100, Alpha: 0.3 }.
		* @function ParseRgb
		* @static
		* @param {string} val - RGB(A) color string, e.g. rgba(100, 100, 100, 0.3) or simply 100,100,200,0.3.
		* @returns Fit.ColorTypeDefs.RgbaColor
		*/
		public static ParseRgb(val:string):Fit.ColorTypeDefs.RgbaColor;
		/**
		* Convert RGB colors into HEX color string.
		* @function RgbToHex
		* @static
		* @param {number} r - Color index for red.
		* @param {number} g - Color index for green.
		* @param {number} b - Color index for blue.
		* @returns string
		*/
		public static RgbToHex(r:number, g:number, b:number):string;
	}
	/**
	* 
	* @namespace [Fit.Controls Controls]
	*/
	namespace Controls
	{
		// Functions defined by Fit.Controls
		/**
		* Check dirty state for all controls - either all controls on page, or within specified scope.
		Returns True if one or more controls are dirty, otherwise False.
		* @function DirtyCheckAll
		* @static
		* @param {string} [scope=undefined] - If specified, dirty check controls only within this scope.
		See Fit.Controls.ControlBase.Scope(..)
		for details on configurering scoped validation.
		* @returns boolean
		*/
		export function DirtyCheckAll(scope?:string):boolean;
		/**
		* Get control by unique Control ID - returns Null if not found.
		* @function Find
		* @static
		* @param {string} id - Unique Control ID.
		* @returns Fit.Controls.Component | null
		*/
		export function Find(id:string):Fit.Controls.Component | null;
		/**
		* Get control by unique Control ID - returns Null if not found.
		* @template ExpectedControlType
		* @function Find
		* @static
		* @param {string} id - Unique Control ID.
		* @param {ExpectedControlType} expectedType - For development environments supporting JSDoc and generics (e.g. VSCode), make Find(..) return found component
		as specified type. For instance to return a type as Fit.Controls.DropDown, specify Fit.Controls.DropDown.prototype.
		* @returns ExpectedControlType | null
		*/
		export function Find<ExpectedControlType>(id:string, expectedType:ExpectedControlType):ExpectedControlType | null;
		/**
		* Validate all controls - either all controls on page, or within specified scope.
		Returns True if all controls contain valid values, otherwise False.
		* @function ValidateAll
		* @static
		* @param {string} [scope=undefined] - If specified, validate controls only within this scope.
		See Fit.Controls.ControlBase.Scope(..)
		for details on configurering scoped validation.
		* @returns boolean
		*/
		export function ValidateAll(scope?:string):boolean;
		/**
		* Button control with support for Font Awesome icons.
		* @class [Fit.Controls.Button Button]
		*/
		class Button
		{
			// Functions defined by Fit.Controls.Button
			/**
			* Create instance of Button control.
			* @function Button
			* @param {string} [controlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(controlId?:string);
			/**
			* Programmatically trigger a button click.
			* @function Click
			*/
			public Click():void;
			/**
			* Get/set value indicating whether button is enabled or not.
			* @function Enabled
			* @param {boolean} [val=undefined] - If specified, True enables button, False disables it.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [focus=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(focus?:boolean):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get/set button icon (Font Awesome icon name, e.g. fa-check-circle-o - https://fontawesome.com/v4.7.0/icons).
			* @function Icon
			* @param {string} [val=undefined] - If specified, button icon will be set to specified value.
			* @returns string
			*/
			public Icon(val?:string):string;
			/**
			* Set callback function invoked when button is clicked.
			* @function OnClick
			* @param {Fit.Controls.ButtonTypeDefs.ClickEventHandler} cb - Callback function invoked when button is clicked - takes button instance as argument.
			*/
			public OnClick(cb:Fit.Controls.ButtonTypeDefs.ClickEventHandler):void;
			/**
			* Get/set button title.
			* @function Title
			* @param {string} [val=undefined] - If specified, button title will be set to specified value.
			* @returns string
			*/
			public Title(val?:string):string;
			/**
			* Get/set button type producing specific look and feel.
			Possible values are:
			- Fit.Controls.ButtonType.Default (white)
			- Fit.Controls.ButtonType.Primary (blue)
			- Fit.Controls.ButtonType.Success (green)
			- Fit.Controls.ButtonType.Info (turquoise)
			- Fit.Controls.ButtonType.Warning (orange)
			- Fit.Controls.ButtonType.Danger (red).
			* @function Type
			* @param {Fit.Controls.ButtonType | "Danger" | "Default" | "Info" | "Primary" | "Success" | "Warning"} [val=undefined] - If specified, button type will be set to specified value.
			* @returns Fit.Controls.ButtonType | "Danger" | "Default" | "Info" | "Primary" | "Success" | "Warning"
			*/
			public Type(val?:Fit.Controls.ButtonType | "Danger" | "Default" | "Info" | "Primary" | "Success" | "Warning"):Fit.Controls.ButtonType | "Danger" | "Default" | "Info" | "Primary" | "Success" | "Warning";
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.ButtonTypeDefs ButtonTypeDefs]
		*/
		namespace ButtonTypeDefs
		{
			// Functions defined by Fit.Controls.ButtonTypeDefs
			/**
			* OnClick event handler.
			* @callback ClickEventHandler
			* @param {Fit.Controls.Button} sender - Instance of Button.
			*/
			type ClickEventHandler = (sender:Fit.Controls.Button) => void;
		}
		/**
		* Simple CheckBox control.
		Extending from Fit.Controls.ControlBase.
		* @class [Fit.Controls.CheckBox CheckBox]
		*/
		class CheckBox
		{
			// Functions defined by Fit.Controls.CheckBox
			/**
			* Create instance of CheckBox control.
			* @function CheckBox
			* @param {string} [ctlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(ctlId?:string);
			/**
			* Get/set value indicating whether control is checked.
			* @function Checked
			* @param {boolean} [val=undefined] - If defined, control's checked state is updated to specified value.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns boolean
			*/
			public Checked(val?:boolean, preserveDirtyState?:boolean):boolean;
			/**
			* Get/set value indicating whether control is enabled or not.
			* @function Enabled
			* @param {boolean} [val=undefined] - If specified, True enables control, False disables it.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set label associated with checkbox.
			* @function Label
			* @param {string} [val=undefined] - If defined, label is updated to specified value.
			* @returns string
			*/
			public Label(val?:string):string;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control.
			* @function AddCssClass
			* @param {string} val - CSS class to add.
			*/
			public AddCssClass(val:string):void;
			/**
			* Set callback function used to perform on-the-fly validation against control.
			* @function AddValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Function receiving an instance of the control.
			A value of False or a non-empty string with an
			error message must be returned if value is invalid.
			*/
			public AddValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value, as returned by the Value() function.
			* @function AddValidationRule
			* @param {RegExp} validator - Regular expression to validate value against.
			* @param {string} [errorMessage=undefined] - Optional error message displayed if value validation fails.
			*/
			public AddValidationRule(validator:RegExp, errorMessage?:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This
			comes in handy when programmatically changing a value of a control on behalf
			of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] - If defined, Always Dirty is enabled/disabled.
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed.
			* @function AutoPostBack
			* @param {boolean} [val=undefined] - If defined, True enables auto post back, False disables it.
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value.
			* @function Clear
			*/
			public Clear():void;
			/**
			* Get/set value indicating whether control is enabled or disabled.
			A disabled control's value and state is still included on postback, if part of a form.
			* @function Enabled
			* @param {boolean} [val=undefined] - If defined, True enables control (default), False disables control.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Check whether CSS class is found on DOMElement representing control.
			* @function HasCssClass
			* @param {string} val - CSS class to check for.
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get value indicating whether user has changed control value.
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid.
			Control value is considered invalid if control is required, but no value is set,
			or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Get/set value indicating whether control initially appears as valid, even
			though it is not. It will appear invalid once the user touches the control,
			or when control value is validated using Fit.Controls.ValidateAll(..).
			* @function LazyValidation
			* @param {boolean} [val=undefined] - If defined, Lazy Validation is enabled/disabled.
			* @returns boolean
			*/
			public LazyValidation(val?:boolean):boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus.
			* @function OnBlur
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnBlur(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user.
			* @function OnChange
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnChange(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus.
			* @function OnFocus
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnFocus(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Remove all validation rules.
			* @function RemoveAllValidationRules
			*/
			public RemoveAllValidationRules():void;
			/**
			* Remove CSS class from DOMElement representing control.
			* @function RemoveCssClass
			* @param {string} val - CSS class to remove.
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Remove validation function used to perform on-the-fly validation against control.
			* @function RemoveValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Validation function registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Remove regular expression used to perform on-the-fly validation against control value.
			* @function RemoveValidationRule
			* @param {RegExp} validator - Regular expression registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:RegExp):void;
			/**
			* Get/set value indicating whether control is required to be set.
			* @function Required
			* @param {boolean} [val=undefined] - If defined, control required feature is enabled/disabled.
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple
			controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] - If defined, control scope is updated.
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationCallback
			* @param {Function | null} cb - Function receiving control value - must return True if value is valid, otherwise False.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationCallback(cb:Function | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set regular expression used to perform on-the-fly validation against control value.
			* @function SetValidationExpression
			* @param {RegExp | null} regEx - Regular expression to validate against.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationExpression(regEx:RegExp | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationHandler
			* @param {Function | null} cb - Function receiving an instance of the control and its value.
			An error message string must be returned if value is invalid,
			otherwise Null or an empty string if the value is valid.
			*/
			public SetValidationHandler(cb:Function | null):void;
			/**
			* Get/set value as if it was changed by the user. Contrary to Value(..), this function will never reset the dirty state.
			Restrictions/filtering/modifications may be enforced just as the UI control might do, e.g. prevent the use of certain
			characters, or completely ignore input if not allowed. It may also allow invalid values such as a partially entered date
			value. The intention with UserValue(..) is to mimic the behaviour of what the user can do with the user interface control.
			For picker controls the value format is equivalent to the one dictated by the Value(..) function.
			* @function UserValue
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @returns string
			*/
			public UserValue(val?:string):string;
			/**
			* Get/set control value.
			For controls supporting multiple selections: Set value by providing a string in one the following formats:
			title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
			If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
			Selected items are returned in the first format described, also with reserved characters URIEncoded.
			Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns string
			*/
			public Value(val?:string, preserveDirtyState?:boolean):string;
			/**
			* Get/set value indicating whether control is visible.
			* @function Visible
			* @param {boolean} [val=undefined] - If defined, control visibility is updated.
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* Class from which all UI components extend.
		* @class [Fit.Controls.Component Component]
		*/
		class Component
		{
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* ContextMenu control allowing for quick access to select features.
		* @class [Fit.Controls.ContextMenu ContextMenu]
		*/
		class ContextMenu
		{
			// Functions defined by Fit.Controls.ContextMenu
			/**
			* Add item to ContextMenu.
			* @function AddChild
			* @param {Fit.Controls.ContextMenuItem} item - Item to add.
			*/
			public AddChild(item:Fit.Controls.ContextMenuItem):void;
			/**
			* Create instance of ContextMenu control.
			* @function ContextMenu
			* @param {string} [controlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(controlId?:string);
			/**
			* Get/set value indicating whether boundary/collision detection is enabled or not.
			* @function DetectBoundaries
			* @param {boolean} [val=undefined] - If defined, True enables collision detection (default), False disables it.
			* @returns boolean
			*/
			public DetectBoundaries(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get all children across entire hierarchy in a flat collection.
			* @function GetAllChildren
			* @returns Fit.Controls.ContextMenuItem[]
			*/
			public GetAllChildren():Fit.Controls.ContextMenuItem[];
			/**
			* Get item by value - returns Null if not found.
			* @function GetChild
			* @param {string} val - Item value.
			* @param {boolean} [recursive=false] - If defined, True enables recursive search.
			* @returns Fit.Controls.ContextMenuItem | null
			*/
			public GetChild(val:string, recursive?:boolean):Fit.Controls.ContextMenuItem | null;
			/**
			* Get all children.
			* @function GetChildren
			* @returns Fit.Controls.ContextMenuItem[]
			*/
			public GetChildren():Fit.Controls.ContextMenuItem[];
			/**
			* Hide context menu.
			* @function Hide
			*/
			public Hide():void;
			/**
			* Get value indicating whether context menu is visible or not.
			* @function IsVisible
			* @returns boolean
			*/
			public IsVisible():boolean;
			/**
			* Add event handler fired when context menu is hidden.
			Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnHide
			* @param {Fit.Controls.ContextMenuTypeDefs.EventHandler<this>} cb - Event handler function.
			*/
			public OnHide(cb:Fit.Controls.ContextMenuTypeDefs.EventHandler<this>):void;
			/**
			* Add event handler fired when an item is selected in context menu.
			Function receives two arguments:
			Sender (Fit.Controls.ContextMenu) and Item (Fit.Controls.ContextMenuItem).
			* @function OnSelect
			* @param {Fit.Controls.ContextMenuTypeDefs.SelectEventHandler<this>} cb - Event handler function.
			*/
			public OnSelect(cb:Fit.Controls.ContextMenuTypeDefs.SelectEventHandler<this>):void;
			/**
			* Add event handler fired before context menu is shown.
			This event can be canceled by returning False.
			Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnShowing
			* @param {Fit.Controls.ContextMenuTypeDefs.CancelableEventHandler<this>} cb - Event handler function.
			*/
			public OnShowing(cb:Fit.Controls.ContextMenuTypeDefs.CancelableEventHandler<this>):void;
			/**
			* Add event handler fired when context menu is shown.
			Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnShown
			* @param {Fit.Controls.ContextMenuTypeDefs.EventHandler<this>} cb - Event handler function.
			*/
			public OnShown(cb:Fit.Controls.ContextMenuTypeDefs.EventHandler<this>):void;
			/**
			* Remove all items contained in ContextMenu.
			* @function RemoveAllChildren
			* @param {boolean} [dispose=false] - Set True to dispose items.
			*/
			public RemoveAllChildren(dispose?:boolean):void;
			/**
			* Remove item from ContextMenu.
			* @function RemoveChild
			* @param {Fit.Controls.ContextMenuItem} item - Item to remove.
			*/
			public RemoveChild(item:Fit.Controls.ContextMenuItem):void;
			/**
			* Make context menu show up. If X,Y coordinates are not specified, the position of the mouse pointer will be used.
			* @function Show
			* @param {number} [x=undefined] - If defined, context menu will open at specified horizontal position.
			* @param {number} [y=undefined] - If defined, context menu will open at specified vertical position.
			*/
			public Show(x?:number, y?:number):void;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @class [Fit.Controls.ContextMenuItem ContextMenuItem]
		*/
		class ContextMenuItem
		{
			// Functions defined by Fit.Controls.ContextMenuItem
			/**
			* Add child item.
			* @function AddChild
			* @param {Fit.Controls.ContextMenuItem} item - Item to add.
			*/
			public AddChild(item:Fit.Controls.ContextMenuItem):void;
			/**
			* Create instance of ContextMenu Item.
			* @function ContextMenuItem
			* @param {string} displayTitle - Item title.
			* @param {string} itemValue - Item value.
			*/
			constructor(displayTitle:string, itemValue:string);
			/**
			* Destroys item to free up memory.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get item by value - returns Null if not found.
			* @function GetChild
			* @param {string} val - Item value.
			* @param {boolean} [recursive=false] - If defined, True enables recursive search.
			* @returns Fit.Controls.ContextMenuItem | null
			*/
			public GetChild(val:string, recursive?:boolean):Fit.Controls.ContextMenuItem | null;
			/**
			* Get all children.
			* @function GetChildren
			* @returns Fit.Controls.ContextMenuItem[]
			*/
			public GetChildren():Fit.Controls.ContextMenuItem[];
			/**
			* Get DOMElement representing context menu item.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get parent item - returns Null for a root item.
			* @function GetParent
			* @returns Fit.Controls.ContextMenuItem | null
			*/
			public GetParent():Fit.Controls.ContextMenuItem | null;
			/**
			* Remove child item.
			* @function RemoveChild
			* @param {Fit.Controls.ContextMenuItem} item - Item to remove.
			*/
			public RemoveChild(item:Fit.Controls.ContextMenuItem):void;
			/**
			* Get/set value indicating whether item is selectable or not.
			* @function Selectable
			* @param {boolean} [val=undefined] - If defined, True enables item, False disables it.
			* @returns boolean
			*/
			public Selectable(val?:boolean):boolean;
			/**
			* Get/set item title.
			* @function Title
			* @param {string} [val=undefined] - If defined, item title is updated.
			* @returns string
			*/
			public Title(val?:string):string;
			/**
			* Get item value.
			* @function Value
			* @returns string
			*/
			public Value():string;
		}
		/**
		* 
		* @namespace [Fit.Controls.ContextMenuTypeDefs ContextMenuTypeDefs]
		*/
		namespace ContextMenuTypeDefs
		{
			// Functions defined by Fit.Controls.ContextMenuTypeDefs
			/**
			* Event handler.
			* @template TypeOfThis
			* @callback CancelableEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @returns boolean | void
			*/
			type CancelableEventHandler<TypeOfThis> = (sender:TypeOfThis) => boolean | void;
			/**
			* Event handler.
			* @template TypeOfThis
			* @callback EventHandler
			* @param {TypeOfThis} sender - Instance of control.
			*/
			type EventHandler<TypeOfThis> = (sender:TypeOfThis) => void;
			/**
			* OnSelect event handler.
			* @template TypeOfThis
			* @callback SelectEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.ContextMenuItem} item - Instance of ContextMenuItem.
			*/
			type SelectEventHandler<TypeOfThis> = (sender:TypeOfThis, item:Fit.Controls.ContextMenuItem) => void;
		}
		/**
		* Class from which all editable controls extend.
		* @class [Fit.Controls.ControlBase ControlBase]
		*/
		class ControlBase
		{
			// Functions defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control.
			* @function AddCssClass
			* @param {string} val - CSS class to add.
			*/
			public AddCssClass(val:string):void;
			/**
			* Set callback function used to perform on-the-fly validation against control.
			* @function AddValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Function receiving an instance of the control.
			A value of False or a non-empty string with an
			error message must be returned if value is invalid.
			*/
			public AddValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value, as returned by the Value() function.
			* @function AddValidationRule
			* @param {RegExp} validator - Regular expression to validate value against.
			* @param {string} [errorMessage=undefined] - Optional error message displayed if value validation fails.
			*/
			public AddValidationRule(validator:RegExp, errorMessage?:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This
			comes in handy when programmatically changing a value of a control on behalf
			of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] - If defined, Always Dirty is enabled/disabled.
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed.
			* @function AutoPostBack
			* @param {boolean} [val=undefined] - If defined, True enables auto post back, False disables it.
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value.
			* @function Clear
			*/
			public Clear():void;
			/**
			* Get/set value indicating whether control is enabled or disabled.
			A disabled control's value and state is still included on postback, if part of a form.
			* @function Enabled
			* @param {boolean} [val=undefined] - If defined, True enables control (default), False disables control.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Check whether CSS class is found on DOMElement representing control.
			* @function HasCssClass
			* @param {string} val - CSS class to check for.
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get value indicating whether user has changed control value.
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid.
			Control value is considered invalid if control is required, but no value is set,
			or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Get/set value indicating whether control initially appears as valid, even
			though it is not. It will appear invalid once the user touches the control,
			or when control value is validated using Fit.Controls.ValidateAll(..).
			* @function LazyValidation
			* @param {boolean} [val=undefined] - If defined, Lazy Validation is enabled/disabled.
			* @returns boolean
			*/
			public LazyValidation(val?:boolean):boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus.
			* @function OnBlur
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnBlur(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user.
			* @function OnChange
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnChange(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus.
			* @function OnFocus
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnFocus(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Remove all validation rules.
			* @function RemoveAllValidationRules
			*/
			public RemoveAllValidationRules():void;
			/**
			* Remove CSS class from DOMElement representing control.
			* @function RemoveCssClass
			* @param {string} val - CSS class to remove.
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Remove validation function used to perform on-the-fly validation against control.
			* @function RemoveValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Validation function registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Remove regular expression used to perform on-the-fly validation against control value.
			* @function RemoveValidationRule
			* @param {RegExp} validator - Regular expression registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:RegExp):void;
			/**
			* Get/set value indicating whether control is required to be set.
			* @function Required
			* @param {boolean} [val=undefined] - If defined, control required feature is enabled/disabled.
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple
			controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] - If defined, control scope is updated.
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationCallback
			* @param {Function | null} cb - Function receiving control value - must return True if value is valid, otherwise False.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationCallback(cb:Function | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set regular expression used to perform on-the-fly validation against control value.
			* @function SetValidationExpression
			* @param {RegExp | null} regEx - Regular expression to validate against.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationExpression(regEx:RegExp | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationHandler
			* @param {Function | null} cb - Function receiving an instance of the control and its value.
			An error message string must be returned if value is invalid,
			otherwise Null or an empty string if the value is valid.
			*/
			public SetValidationHandler(cb:Function | null):void;
			/**
			* Get/set value as if it was changed by the user. Contrary to Value(..), this function will never reset the dirty state.
			Restrictions/filtering/modifications may be enforced just as the UI control might do, e.g. prevent the use of certain
			characters, or completely ignore input if not allowed. It may also allow invalid values such as a partially entered date
			value. The intention with UserValue(..) is to mimic the behaviour of what the user can do with the user interface control.
			For picker controls the value format is equivalent to the one dictated by the Value(..) function.
			* @function UserValue
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @returns string
			*/
			public UserValue(val?:string):string;
			/**
			* Get/set control value.
			For controls supporting multiple selections: Set value by providing a string in one the following formats:
			title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
			If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
			Selected items are returned in the first format described, also with reserved characters URIEncoded.
			Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns string
			*/
			public Value(val?:string, preserveDirtyState?:boolean):string;
			/**
			* Get/set value indicating whether control is visible.
			* @function Visible
			* @param {boolean} [val=undefined] - If defined, control visibility is updated.
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.ControlBaseTypeDefs ControlBaseTypeDefs]
		*/
		namespace ControlBaseTypeDefs
		{
			// Functions defined by Fit.Controls.ControlBaseTypeDefs
			/**
			* Event handler receiving an instance of the control firing the event.
			* @template TypeOfThis
			* @callback BaseEvent
			* @param {TypeOfThis} sender - Control instance.
			*/
			type BaseEvent<TypeOfThis> = (sender:TypeOfThis) => void;
			/**
			* Validation callback used with AddValidationRule(..) inherited from Fit.Controls.ControlBase.
			* @template TypeOfThis
			* @callback ValidationCallback
			* @param {TypeOfThis} sender - Control to validate.
			* @returns boolean | string | void
			*/
			type ValidationCallback<TypeOfThis> = (sender:TypeOfThis) => boolean | string | void;
		}
		/**
		* DatePicker control allowing user to easily pick a date and optionally time.
		On mobile devices (phones and tablets) the native date and time pickers are used.
		Extending from Fit.Controls.ControlBase.
		* @class [Fit.Controls.DatePicker DatePicker]
		*/
		class DatePicker
		{
			// Functions defined by Fit.Controls.DatePicker
			/**
			* Get/set control value.
			The function works the same as the Value function, expect it
			accepts and returns a Date object instead of a string.
			* @function Date
			* @param {Date} [val=undefined] - If defined, date is selected.
			* @returns Date
			*/
			public Date(val?:__fitUiAliasDate):__fitUiAliasDate;
			/**
			* Create instance of DatePicker control.
			* @function DatePicker
			* @param {string} [ctlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(ctlId?:string);
			/**
			* Get/set date placeholder value. Returns Null if not set.
			* @function DatePlaceholder
			* @param {string | null} [val=undefined] - If defined, placeholder is updated. Pass Null to use default
			placeholder, or an empty string to remove placeholder.
			* @returns string | null
			*/
			public DatePlaceholder(val?:string | null):string | null;
			/**
			* Get/set value indicating whether boundary/collision detection is enabled or not (off by default).
			This may cause calendar to open upwards if sufficient space is not available below control.
			If control is contained in a scrollable parent, this will be considered the active viewport,
			and as such define the active boundaries - unless relativeToViewport is set to True, in which
			case the actual browser viewport will be used.
			* @function DetectBoundaries
			* @param {boolean} [val=undefined] - If defined, True enables collision detection, False disables it (default).
			* @param {boolean} [relativeToViewport=false] - If defined, True results in viewport being considered the container to which available space is determined.
			This also results in calendar widget being positioned with position:fixed, allowing it to escape a container
			with overflow (e.g. overflow:auto|hidden|scroll). Be aware though that this does not work reliably in combination
			with CSS animation and CSS transform as it creates a new stacking context to which position:fixed becomes relative.
			A value of False (default) results in available space being determined relative to the boundaries of the
			control's scroll parent. The calendar widget will stay within its container and not overflow it.
			* @returns boolean
			*/
			public DetectBoundaries(val?:boolean, relativeToViewport?:boolean):boolean;
			/**
			* Get/set format used by the DatePicker control. This will affect the format
			in which the date is presented, as well as the value returned by the GetText function.
			Format takes precedence over locale.
			* @function Format
			* @param {string} [val=undefined] - If defined, format is changed.
			The following tokens can be used to construct the format:
			YYYY = Year with four digits (e.g. 2016)
			M = Month with one digit if possible (e.g. 1 or 12)
			MM = Month with two digits (e.g. 01 or 12)
			D = Day with one digit if possible (e.g. 1 or 24)
			DD = Day with two digits (e.g. 01 or 24)
			Examples: YYYY-MM-DD or D/M-YYYY.
			* @returns string
			*/
			public Format(val?:string):string;
			/**
			* Returns a string array containing supported locales.
			* @function GetLocales
			* @returns string[]
			*/
			public GetLocales():string[];
			/**
			* Get control value as a string. Opposite to the Value function GetText returns the
			selected Date/DateTime in the format configured (see Format function). The Value
			function always returns the value in a fixed format, which is YYYY-MM-DD[ hh:mm].
			The time portion is only appended if time is enabled (see Time function).
			* @function GetText
			* @returns string
			*/
			public GetText():string;
			/**
			* Calling this function will close the calendar widget.
			Whether this results in picker being hidden on mobile depends on implementation.
			Often it will only work if Hide() or Focused(false) is triggered by a user action such as a button click.
			* @function Hide
			*/
			public Hide():void;
			/**
			* Get/set locale used by the DatePicker control. This will affect the
			date format, unless format has been set explicitely, as well as the language used by the calendar widget.
			DatePicker locale takes precedence over locale set using Fit.Internationalization.Locale(..).
			Call the GetLocales function to get a complete list of supported locales.
			* @function Locale
			* @param {string} [val=undefined] - If defined, locale is changed.
			* @returns string
			*/
			public Locale(val?:string):string;
			/**
			* Calling this function will open the calendar widget.
			Whether this results in picker being displayed on mobile depends on implementation.
			Often it will only work if Show() or Focused(true) is triggered by a user action such as a button click.
			* @function Show
			*/
			public Show():void;
			/**
			* Get/set value indicating whether DatePicker should allow a time portion to be set.
			* @function Time
			* @param {boolean} [val=undefined] - If defined, time is changed.
			* @returns boolean
			*/
			public Time(val?:boolean):boolean;
			/**
			* Get/set time placeholder value. Returns Null if not set.
			* @function TimePlaceholder
			* @param {string | null} [val=undefined] - If defined, placeholder is updated. Pass Null to use default
			placeholder, or an empty string to remove placeholder.
			* @returns string | null
			*/
			public TimePlaceholder(val?:string | null):string | null;
			/**
			* Get/set value as if it was changed by the user.
			Contrary to Value(..), this function allows for a partial (or invalid) date value.
			If the time picker is enabled (see Time(..)) then both the date and time portion can
			be set, separated by a space (e.g. 2020-10-25 14:30).
			OnChange fires if value provided is valid. See ControlBase.UserValue(..) for more details.
			* @function UserValue
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @returns string
			*/
			public UserValue(val?:string):string;
			/**
			* Get/set control value in the following format: YYYY-MM-DD[ hh:mm].
			* @function Value
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns string
			*/
			public Value(val?:string, preserveDirtyState?:boolean):string;
			// Functions defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control.
			* @function AddCssClass
			* @param {string} val - CSS class to add.
			*/
			public AddCssClass(val:string):void;
			/**
			* Set callback function used to perform on-the-fly validation against control.
			* @function AddValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Function receiving an instance of the control.
			A value of False or a non-empty string with an
			error message must be returned if value is invalid.
			*/
			public AddValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value, as returned by the Value() function.
			* @function AddValidationRule
			* @param {RegExp} validator - Regular expression to validate value against.
			* @param {string} [errorMessage=undefined] - Optional error message displayed if value validation fails.
			*/
			public AddValidationRule(validator:RegExp, errorMessage?:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This
			comes in handy when programmatically changing a value of a control on behalf
			of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] - If defined, Always Dirty is enabled/disabled.
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed.
			* @function AutoPostBack
			* @param {boolean} [val=undefined] - If defined, True enables auto post back, False disables it.
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value.
			* @function Clear
			*/
			public Clear():void;
			/**
			* Get/set value indicating whether control is enabled or disabled.
			A disabled control's value and state is still included on postback, if part of a form.
			* @function Enabled
			* @param {boolean} [val=undefined] - If defined, True enables control (default), False disables control.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Check whether CSS class is found on DOMElement representing control.
			* @function HasCssClass
			* @param {string} val - CSS class to check for.
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get value indicating whether user has changed control value.
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid.
			Control value is considered invalid if control is required, but no value is set,
			or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Get/set value indicating whether control initially appears as valid, even
			though it is not. It will appear invalid once the user touches the control,
			or when control value is validated using Fit.Controls.ValidateAll(..).
			* @function LazyValidation
			* @param {boolean} [val=undefined] - If defined, Lazy Validation is enabled/disabled.
			* @returns boolean
			*/
			public LazyValidation(val?:boolean):boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus.
			* @function OnBlur
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnBlur(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user.
			* @function OnChange
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnChange(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus.
			* @function OnFocus
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnFocus(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Remove all validation rules.
			* @function RemoveAllValidationRules
			*/
			public RemoveAllValidationRules():void;
			/**
			* Remove CSS class from DOMElement representing control.
			* @function RemoveCssClass
			* @param {string} val - CSS class to remove.
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Remove validation function used to perform on-the-fly validation against control.
			* @function RemoveValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Validation function registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Remove regular expression used to perform on-the-fly validation against control value.
			* @function RemoveValidationRule
			* @param {RegExp} validator - Regular expression registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:RegExp):void;
			/**
			* Get/set value indicating whether control is required to be set.
			* @function Required
			* @param {boolean} [val=undefined] - If defined, control required feature is enabled/disabled.
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple
			controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] - If defined, control scope is updated.
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationCallback
			* @param {Function | null} cb - Function receiving control value - must return True if value is valid, otherwise False.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationCallback(cb:Function | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set regular expression used to perform on-the-fly validation against control value.
			* @function SetValidationExpression
			* @param {RegExp | null} regEx - Regular expression to validate against.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationExpression(regEx:RegExp | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationHandler
			* @param {Function | null} cb - Function receiving an instance of the control and its value.
			An error message string must be returned if value is invalid,
			otherwise Null or an empty string if the value is valid.
			*/
			public SetValidationHandler(cb:Function | null):void;
			/**
			* Get/set value as if it was changed by the user. Contrary to Value(..), this function will never reset the dirty state.
			Restrictions/filtering/modifications may be enforced just as the UI control might do, e.g. prevent the use of certain
			characters, or completely ignore input if not allowed. It may also allow invalid values such as a partially entered date
			value. The intention with UserValue(..) is to mimic the behaviour of what the user can do with the user interface control.
			For picker controls the value format is equivalent to the one dictated by the Value(..) function.
			* @function UserValue
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @returns string
			*/
			public UserValue(val?:string):string;
			/**
			* Get/set control value.
			For controls supporting multiple selections: Set value by providing a string in one the following formats:
			title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
			If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
			Selected items are returned in the first format described, also with reserved characters URIEncoded.
			Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns string
			*/
			public Value(val?:string, preserveDirtyState?:boolean):string;
			/**
			* Get/set value indicating whether control is visible.
			* @function Visible
			* @param {boolean} [val=undefined] - If defined, control visibility is updated.
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* Simple Dialog control with support for Fit.UI buttons.
		* @class [Fit.Controls.Dialog Dialog]
		*/
		class Dialog
		{
			// Functions defined by Fit.Controls.Dialog
			/**
			* Add button to dialog.
			* @function AddButton
			* @param {Fit.Controls.Button} btn - Instance of Fit.Controls.Button.
			*/
			public AddButton(btn:Fit.Controls.Button):void;
			/**
			* Close dialog.
			* @function Close
			*/
			public Close():void;
			/**
			* Get/set dialog content.
			* @function Content
			* @param {string} [val=undefined] - If specified, dialog content is updated with specified value.
			* @returns string
			*/
			public Content(val?:string):string;
			/**
			* Get/set content URL - returns null if not set.
			* @function ContentUrl
			* @param {string} [url=undefined] - If specified, dialog is updated with content from specified URL.
			* @param {Fit.Controls.DialogTypeDefs.DialogEventHandler} [onLoadHandler=undefined] - If specified, callback is invoked when content has been loaded.
			Instance of Dialog is passed as an argument.
			* @returns string | null
			*/
			public ContentUrl(url?:string, onLoadHandler?:Fit.Controls.DialogTypeDefs.DialogEventHandler):string | null;
			/**
			* Create instance of Dialog control.
			* @function Dialog
			* @param {string} [controlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(controlId?:string);
			/**
			* Get/set flag indicating whether dialog is dismissible or not.
			* @function Dismissible
			* @param {boolean} [val=undefined] - If defined, a value of True makes dialog dismissible by adding a close button while False disables it.
			* @param {boolean} [disposeOnDismiss=undefined] - If defined, a value of True results in dialog being disposed (destroyed) when closed using dismiss/close button.
			* @returns boolean
			*/
			public Dismissible(val?:boolean, disposeOnDismiss?:boolean):boolean;
			/**
			* Get dialog content element.
			* @function GetContentDomElement
			* @returns HTMLElement
			*/
			public GetContentDomElement():HTMLElement;
			/**
			* Get/set dialog height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, dialog height is updated to specified value. A value of -1 resets height to default.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, dialog width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get flag indicating whether dialog is open or not.
			* @function IsOpen
			* @returns boolean
			*/
			public IsOpen():boolean;
			/**
			* Get/set flag indicating whether dialog is maximizable or not.
			* @function Maximizable
			* @param {boolean} [val=undefined] - If defined, a value of True makes dialog maximizable by adding a maximize button while False disables it.
			* @returns boolean
			*/
			public Maximizable(val?:boolean):boolean;
			/**
			* Get/set flag indicating whether dialog is maximized or not.
			* @function Maximized
			* @param {boolean} [val=undefined] - If defined, True maximizes dialog while False restores it.
			* @returns boolean
			*/
			public Maximized(val?:boolean):boolean;
			/**
			* Get/set dialog maximum height - returns object with Value and Unit properties.
			* @function MaximumHeight
			* @param {number} [val=undefined] - If defined, dialog maximum height is updated to specified value. A value of -1 resets maximum height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, dialog maximum height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public MaximumHeight(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get/set dialog maximum width - returns object with Value and Unit properties.
			* @function MaximumWidth
			* @param {number} [val=undefined] - If defined, dialog maximum width is updated to specified value. A value of -1 resets maximum width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, dialog maximum width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public MaximumWidth(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get/set dialog minimum height - returns object with Value and Unit properties.
			* @function MinimumHeight
			* @param {number} [val=undefined] - If defined, dialog minimum height is updated to specified value. A value of -1 resets minimum height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, dialog minimum height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public MinimumHeight(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get/set dialog minimum width - returns object with Value and Unit properties.
			* @function MinimumWidth
			* @param {number} [val=undefined] - If defined, dialog minimum width is updated to specified value. A value of -1 resets minimum width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, dialog minimum width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public MinimumWidth(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get/set value indicating whether dialog is modal or not.
			* @function Modal
			* @param {boolean} [val=undefined] - If specified, True enables modal mode, False disables it.
			* @returns boolean
			*/
			public Modal(val?:boolean):boolean;
			/**
			* Add event handler fired when dialog is closed or dismissed.
			Use this event to react to dialog being closed, no matter
			the cause. Use OnDismiss event to detect when user closed it.
			Action can be suppressed by returning False.
			Function receives one argument: Sender (Fit.Controls.Dialog).
			* @function OnClose
			* @param {Fit.Controls.DialogTypeDefs.DialogEventHandler} cb - Event handler function.
			*/
			public OnClose(cb:Fit.Controls.DialogTypeDefs.DialogEventHandler):void;
			/**
			* Add event handler fired when dialog is being dismissed by the user.
			Action can be suppressed by returning False.
			Function receives one argument: Sender (Fit.Controls.Dialog).
			* @function OnDismiss
			* @param {Fit.Controls.DialogTypeDefs.DialogEventHandler} cb - Event handler function.
			*/
			public OnDismiss(cb:Fit.Controls.DialogTypeDefs.DialogEventHandler):void;
			/**
			* Open dialog.
			* @function Open
			* @param {HTMLElement} [renderTarget=undefined] - Optional render target which can be used to render dialog to specific
			container rather than the root of the body element. This allows for
			the dialog to inherit styles from the specified render target.
			*/
			public Open(renderTarget?:HTMLElement):void;
			/**
			* Remove all buttons from dialog.
			* @function RemoveAllButtons
			* @param {boolean} [dispose=undefined] - If defined, a value of True results in buttons being disposed (destroyed).
			*/
			public RemoveAllButtons(dispose?:boolean):void;
			/**
			* Remove button from dialog.
			* @function RemoveButton
			* @param {Fit.Controls.Button} btn - Instance of Fit.Controls.Button.
			* @param {boolean} [dispose=undefined] - If defined, a value of True results in button being disposed (destroyed).
			*/
			public RemoveButton(btn:Fit.Controls.Button, dispose?:boolean):void;
			/**
			* Get/set title - returns null if not set, and null can be passed to remove title.
			* @function Title
			* @param {string | null} [val=undefined] - If specified, dialog title is updated with specified value.
			* @returns string | null
			*/
			public Title(val?:string | null):string | null;
			/**
			* Get/set dialog width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, dialog width is updated to specified value. A value of -1 resets width (auto sizing).
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, dialog width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Display alert dialog.
			* @function Alert
			* @static
			* @param {string} content - Content to display in alert dialog.
			* @param {Function} [cb=undefined] - Optional callback function invoked when OK button is clicked.
			* @returns Fit.Controls.DialogInterface
			*/
			public static Alert(content:string, cb?:Function):Fit.Controls.DialogInterface;
			/**
			* Display confirmation dialog with OK and Cancel buttons.
			* @function Confirm
			* @static
			* @param {string} content - Content to display in confirmation dialog.
			* @param {Fit.Controls.DialogTypeDefs.ConfirmCallback} cb - Callback function invoked when a button is clicked.
			True is passed to callback function when OK is clicked, otherwise False.
			* @returns Fit.Controls.DialogInterface
			*/
			public static Confirm(content:string, cb:Fit.Controls.DialogTypeDefs.ConfirmCallback):Fit.Controls.DialogInterface;
			/**
			* Display prompt dialog that allows for user input.
			* @function Prompt
			* @static
			* @param {string} content - Content to display in prompt dialog.
			* @param {string} defaultValue - Default value in input field.
			* @param {Fit.Controls.DialogTypeDefs.PromptCallback} [cb=undefined] - Callback function invoked when OK or Cancel button is clicked.
			Value entered in input field is passed, null if prompt is canceled.
			* @returns Fit.Controls.DialogInterface
			*/
			public static Prompt(content:string, defaultValue:string, cb?:Fit.Controls.DialogTypeDefs.PromptCallback):Fit.Controls.DialogInterface;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* Simple interface for controlling Prompt, Confirm, and Alert dialogs.
		* @class [Fit.Controls.DialogInterface DialogInterface]
		*/
		class DialogInterface
		{
			// Functions defined by Fit.Controls.DialogInterface
			/**
			* Cancel dialog - equivalent to clicking the Cancel button, or the OK button on an Alert dialog.
			* @function Cancel
			*/
			public Cancel():void;
			/**
			* Confirm dialog - equivalent to clicking the OK button.
			* @function Confirm
			*/
			public Confirm():void;
			/**
			* Dismiss dialog without taking any action.
			* @function Dismiss
			*/
			public Dismiss():void;
		}
		/**
		* 
		* @namespace [Fit.Controls.DialogTypeDefs DialogTypeDefs]
		*/
		namespace DialogTypeDefs
		{
			// Functions defined by Fit.Controls.DialogTypeDefs
			/**
			* Confirmation dialog callback.
			* @callback ConfirmCallback
			* @param {boolean} confirmed - True if OK button is clicked, otherwise False.
			*/
			type ConfirmCallback = (confirmed:boolean) => void;
			/**
			* Dialog event handler.
			* @callback DialogEventHandler
			* @param {Fit.Controls.Dialog} sender - Instance of Dialog.
			*/
			type DialogEventHandler = (sender:Fit.Controls.Dialog) => void;
			/**
			* Prompt dialog callback.
			* @callback PromptCallback
			* @param {string | null} value - String value entered if OK button is clicked, Null if prompt is canceled.
			*/
			type PromptCallback = (value:string | null) => void;
		}
		/**
		* Drop Down Menu control allowing for single and multi selection.
		Supports data selection using any control extending from Fit.Controls.PickerBase.
		This control is extending from Fit.Controls.ControlBase.
		* @class [Fit.Controls.DropDown DropDown]
		*/
		class DropDown
		{
			// Functions defined by Fit.Controls.DropDown
			/**
			* Add selection to control.
			* @function AddSelection
			* @param {string} title - Item title.
			* @param {string} value - Item value.
			* @param {boolean} [valid=true] - Flag indicating whether selection is valid or not. Invalid selections are highlighted and
			not included when selections are retrived using Value() function, and not considered when
			IsDirty() is called to determine whether control value has been changed by user.
			GetSelections(true) can be used to retrive all items, including invalid selections.
			*/
			public AddSelection(title:string, value:string, valid?:boolean):void;
			/**
			* Clear text field.
			* @function ClearInput
			*/
			public ClearInput():void;
			/**
			* Clear selections.
			* @function ClearSelections
			*/
			public ClearSelections():void;
			/**
			* Close drop down menu.
			* @function CloseDropDown
			*/
			public CloseDropDown():void;
			/**
			* Get/set value indicating whether boundary/collision detection is enabled or not (off by default).
			This may cause drop down to open upwards if sufficient space is not available below control.
			If control is contained in a scrollable parent, this will be considered the active viewport,
			and as such define the active boundaries - unless relativeToViewport is set to True, in which
			case the actual browser viewport will be used.
			* @function DetectBoundaries
			* @param {boolean} [val=undefined] - If defined, True enables collision detection, False disables it (default).
			* @param {boolean} [relativeToViewport=false] - If defined, True results in viewport being considered the container to which available space is determined.
			This also results in DropDown menu being positioned with position:fixed, allowing it to escape a container
			with overflow (e.g. overflow:auto|hidden|scroll). Be aware though that this does not work reliably in combination
			with CSS animation and CSS transform as it creates a new stacking context to which position:fixed becomes relative.
			A value of False (default) results in available space being determined relative to the boundaries of the
			control's scroll parent. The DropDown menu will stay within its container and not overflow it.
			* @returns boolean
			*/
			public DetectBoundaries(val?:boolean, relativeToViewport?:boolean):boolean;
			/**
			* Create instance of DropDown control.
			* @function DropDown
			* @param {string} [ctlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(ctlId?:string);
			/**
			* Get/set max height of drop down - returns object with Value (number) and Unit (string) properties.
			* @function DropDownMaxHeight
			* @param {number} [value=undefined] - If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=undefined] - If defined, max height is updated to specified CSS unit, otherwise px is assumed.
			* @returns Fit.TypeDefs.CssValue
			*/
			public DropDownMaxHeight(value?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get/set max width of drop down - returns object with Value (number) and Unit (string) properties.
			* @function DropDownMaxWidth
			* @param {number} [value=undefined] - If defined, max width is updated to specified value. A value of -1 forces drop down to use control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=undefined] - If defined, max width is updated to specified CSS unit, otherwise px is assumed.
			* @returns Fit.TypeDefs.CssValue
			*/
			public DropDownMaxWidth(value?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get item currently highlighted in picker control.
			Returns an object with Title (string), Value (string),
			and Valid (boolean) properties if found, otherwise Null.
			* @function GetHighlighted
			* @returns Fit.Controls.DropDownTypeDefs.DropDownItem | null
			*/
			public GetHighlighted():Fit.Controls.DropDownTypeDefs.DropDownItem | null;
			/**
			* Get input value.
			* @function GetInputValue
			* @returns string
			*/
			public GetInputValue():string;
			/**
			* Get picker control used to add items to drop down control.
			* @function GetPicker
			* @returns Fit.Controls.PickerBase
			*/
			public GetPicker():Fit.Controls.PickerBase;
			/**
			* Get selected item by value - returns object with Title (string), Value (string), and Valid (boolean) properties if found, otherwise Null is returned.
			* @function GetSelectionByValue
			* @param {string} val - Value of selected item to retrive.
			* @returns Fit.Controls.DropDownTypeDefs.DropDownItem | null
			*/
			public GetSelectionByValue(val:string):Fit.Controls.DropDownTypeDefs.DropDownItem | null;
			/**
			* Get selected items - returned array contain objects with Title (string), Value (string), and Valid (boolean) properties.
			* @function GetSelections
			* @param {boolean} [includeInvalid=false] - Flag indicating whether invalid selection should be included or not.
			* @returns Fit.Controls.DropDownTypeDefs.DropDownItem[]
			*/
			public GetSelections(includeInvalid?:boolean):Fit.Controls.DropDownTypeDefs.DropDownItem[];
			/**
			* Make DropDown highlight first selectable item when opened.
			* @function HighlightFirst
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public HighlightFirst(val?:boolean):boolean;
			/**
			* Get/set value indicating whether input is enabled.
			* @function InputEnabled
			* @param {boolean} [val=undefined] - If defined, True enables input, False disables it.
			* @returns boolean
			*/
			public InputEnabled(val?:boolean):boolean;
			/**
			* Get/set mouse over text shown for invalid selections.
			* @function InvalidSelectionMessage
			* @param {string} [msg=undefined] - If defined, error message for invalid selections are set.
			* @returns string
			*/
			public InvalidSelectionMessage(msg?:string):string;
			/**
			* Get flag indicating whether drop down is open or not.
			* @function IsDropDownOpen
			* @returns boolean
			*/
			public IsDropDownOpen():boolean;
			/**
			* Get/set flag indicating whether control allows for multiple selections.
			* @function MultiSelectionMode
			* @param {boolean} [val=undefined] - If defined, True enables multi selection mode, False disables it.
			* @returns boolean
			*/
			public MultiSelectionMode(val?:boolean):boolean;
			/**
			* Add event handler fired when drop down menu is closed.
			Function receives one argument: Sender (Fit.Controls.DropDown).
			* @function OnClose
			* @param {Fit.Controls.DropDownTypeDefs.InteractionEventHandler<this>} cb - Event handler function.
			*/
			public OnClose(cb:Fit.Controls.DropDownTypeDefs.InteractionEventHandler<this>):void;
			/**
			* Add event handler fired when input value is changed.
			Function receives two arguments:
			Sender (Fit.Controls.DropDown) and Value (string).
			* @function OnInputChanged
			* @param {Fit.Controls.DropDownTypeDefs.InputChangedEventHandler<this>} cb - Event handler function.
			*/
			public OnInputChanged(cb:Fit.Controls.DropDownTypeDefs.InputChangedEventHandler<this>):void;
			/**
			* Add event handler fired when drop down menu is opened.
			Function receives one argument: Sender (Fit.Controls.DropDown).
			* @function OnOpen
			* @param {Fit.Controls.DropDownTypeDefs.InteractionEventHandler<this>} cb - Event handler function.
			*/
			public OnOpen(cb:Fit.Controls.DropDownTypeDefs.InteractionEventHandler<this>):void;
			/**
			* Add event handler fired when text is pasted into input field.
			Function receives two arguments:
			Sender (Fit.Controls.DropDown) and Value (string).
			Return False to cancel event and change, and prevent OnInputChanged from firing.
			* @function OnPaste
			* @param {Fit.Controls.DropDownTypeDefs.PasteEventHandler<this>} cb - Event handler function.
			*/
			public OnPaste(cb:Fit.Controls.DropDownTypeDefs.PasteEventHandler<this>):void;
			/**
			* Open drop down menu.
			* @function OpenDropDown
			*/
			public OpenDropDown():void;
			/**
			* Make DropDown restore scroll position and previously highlighted item when reopened.
			* @function PersistView
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public PersistView(val?:boolean):boolean;
			/**
			* Get/set value used as a placeholder on supported browsers, to indicate expected value or action.
			* @function Placeholder
			* @param {string} [val=undefined] - If defined, value is set as placeholder.
			* @returns string
			*/
			public Placeholder(val?:string):string;
			/**
			* Remove selected item by value.
			* @function RemoveSelection
			* @param {string} value - Value of selected item to remove.
			*/
			public RemoveSelection(value:string):void;
			/**
			* Rename title of selected item by its value.
			* @function RenameSelection
			* @param {string} val - Value of selected item to rename.
			* @param {string} newTitle - New item title.
			*/
			public RenameSelection(val:string, newTitle:string):void;
			/**
			* Clear input and display "Search.." placeholder when control receives focus.
			If SearchModeOnFocus is enabled, InputEnabled will also be enabled. Disabling
			SearchModeOnFocus does not disable InputEnabled.
			* @function SearchModeOnFocus
			* @param {boolean} [val=undefined] - If defined, True enables search mode on focus, False disables it.
			* @returns boolean
			*/
			public SearchModeOnFocus(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control allow user to toggle Selection Mode (Visual or Text).
			* @function SelectionModeToggle
			* @param {boolean} [val=undefined] - If defined, True enables toggle button, False disables it.
			* @returns boolean
			*/
			public SelectionModeToggle(val?:boolean):boolean;
			/**
			* Set value of text field which is automatically cleared the first time control
			receives focus. Notice that this function should be called after AddSelection(..),
			since adding selections causes the value of the text field to be cleared.
			* @function SetInputValue
			* @param {string} val - New value for text field.
			*/
			public SetInputValue(val:string):void;
			/**
			* Set picker control used to add items to drop down control.
			* @function SetPicker
			* @param {Fit.Controls.PickerBase | null} pickerControl - Picker control extending from PickerBase.
			*/
			public SetPicker(pickerControl:Fit.Controls.PickerBase | null):void;
			/**
			* Get/set flag indicating whether to use Text Selection Mode (true) or Visual Selection Mode (false).
			Visual Selection Mode is the default way selected items are displayed, but it may result in control
			changing dimensions as items are added/removed. Text Selection Mode prevents this and gives the
			user a traditional DropDown control instead.
			* @function TextSelectionMode
			* @param {boolean} [val=undefined] - If defined, True enables Text Selection Mode, False disables it (Visual Selection Mode).
			* @param {Fit.Controls.DropDownTypeDefs.SelectionToStringCallback<this>} [cb=undefined] - If defined, function will be called with DropDown being passed as an argument when selection text
			needs to be updated. Function is expected to return a string representation of the selected items.
			* @returns boolean
			*/
			public TextSelectionMode(val?:boolean, cb?:Fit.Controls.DropDownTypeDefs.SelectionToStringCallback<this>):boolean;
			/**
			* Update title of selected items based on data in associated picker control.
			An array of updated items are returned. Each object has the following properties:
			- Title: string (Updated title)
			- Value: string (Unique item value)
			- Exists: boolean (True if item still exists, False if not)
			This is useful if selections are stored in a database, and
			available items may have their titles changed over time. Invoking
			this function will ensure that the selection displayed to the user
			reflects the actual state of data in the picker control. Be aware
			that this function can only update selected items if a picker has been
			associated (see SetPicker(..)), and it contains the data from which
			selected items are to be updated.
			Items that no longer exists in picker's data will not automatically
			be removed.
			* @function UpdateSelected
			* @returns Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem[]
			*/
			public UpdateSelected():Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem[];
			// Functions defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control.
			* @function AddCssClass
			* @param {string} val - CSS class to add.
			*/
			public AddCssClass(val:string):void;
			/**
			* Set callback function used to perform on-the-fly validation against control.
			* @function AddValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Function receiving an instance of the control.
			A value of False or a non-empty string with an
			error message must be returned if value is invalid.
			*/
			public AddValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value, as returned by the Value() function.
			* @function AddValidationRule
			* @param {RegExp} validator - Regular expression to validate value against.
			* @param {string} [errorMessage=undefined] - Optional error message displayed if value validation fails.
			*/
			public AddValidationRule(validator:RegExp, errorMessage?:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This
			comes in handy when programmatically changing a value of a control on behalf
			of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] - If defined, Always Dirty is enabled/disabled.
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed.
			* @function AutoPostBack
			* @param {boolean} [val=undefined] - If defined, True enables auto post back, False disables it.
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value.
			* @function Clear
			*/
			public Clear():void;
			/**
			* Get/set value indicating whether control is enabled or disabled.
			A disabled control's value and state is still included on postback, if part of a form.
			* @function Enabled
			* @param {boolean} [val=undefined] - If defined, True enables control (default), False disables control.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Check whether CSS class is found on DOMElement representing control.
			* @function HasCssClass
			* @param {string} val - CSS class to check for.
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get value indicating whether user has changed control value.
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid.
			Control value is considered invalid if control is required, but no value is set,
			or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Get/set value indicating whether control initially appears as valid, even
			though it is not. It will appear invalid once the user touches the control,
			or when control value is validated using Fit.Controls.ValidateAll(..).
			* @function LazyValidation
			* @param {boolean} [val=undefined] - If defined, Lazy Validation is enabled/disabled.
			* @returns boolean
			*/
			public LazyValidation(val?:boolean):boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus.
			* @function OnBlur
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnBlur(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user.
			* @function OnChange
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnChange(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus.
			* @function OnFocus
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnFocus(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Remove all validation rules.
			* @function RemoveAllValidationRules
			*/
			public RemoveAllValidationRules():void;
			/**
			* Remove CSS class from DOMElement representing control.
			* @function RemoveCssClass
			* @param {string} val - CSS class to remove.
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Remove validation function used to perform on-the-fly validation against control.
			* @function RemoveValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Validation function registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Remove regular expression used to perform on-the-fly validation against control value.
			* @function RemoveValidationRule
			* @param {RegExp} validator - Regular expression registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:RegExp):void;
			/**
			* Get/set value indicating whether control is required to be set.
			* @function Required
			* @param {boolean} [val=undefined] - If defined, control required feature is enabled/disabled.
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple
			controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] - If defined, control scope is updated.
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationCallback
			* @param {Function | null} cb - Function receiving control value - must return True if value is valid, otherwise False.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationCallback(cb:Function | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set regular expression used to perform on-the-fly validation against control value.
			* @function SetValidationExpression
			* @param {RegExp | null} regEx - Regular expression to validate against.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationExpression(regEx:RegExp | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationHandler
			* @param {Function | null} cb - Function receiving an instance of the control and its value.
			An error message string must be returned if value is invalid,
			otherwise Null or an empty string if the value is valid.
			*/
			public SetValidationHandler(cb:Function | null):void;
			/**
			* Get/set value as if it was changed by the user. Contrary to Value(..), this function will never reset the dirty state.
			Restrictions/filtering/modifications may be enforced just as the UI control might do, e.g. prevent the use of certain
			characters, or completely ignore input if not allowed. It may also allow invalid values such as a partially entered date
			value. The intention with UserValue(..) is to mimic the behaviour of what the user can do with the user interface control.
			For picker controls the value format is equivalent to the one dictated by the Value(..) function.
			* @function UserValue
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @returns string
			*/
			public UserValue(val?:string):string;
			/**
			* Get/set control value.
			For controls supporting multiple selections: Set value by providing a string in one the following formats:
			title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
			If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
			Selected items are returned in the first format described, also with reserved characters URIEncoded.
			Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns string
			*/
			public Value(val?:string, preserveDirtyState?:boolean):string;
			/**
			* Get/set value indicating whether control is visible.
			* @function Visible
			* @param {boolean} [val=undefined] - If defined, control visibility is updated.
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.DropDownTypeDefs DropDownTypeDefs]
		*/
		namespace DropDownTypeDefs
		{
			// Functions defined by Fit.Controls.DropDownTypeDefs
			/**
			* Input changed event handler.
			* @template TypeOfThis
			* @callback InputChangedEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {string} value - Input value.
			*/
			type InputChangedEventHandler<TypeOfThis> = (sender:TypeOfThis, value:string) => void;
			/**
			* Event handler.
			* @template TypeOfThis
			* @callback InteractionEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			*/
			type InteractionEventHandler<TypeOfThis> = (sender:TypeOfThis) => void;
			/**
			* Paste event handler.
			* @template TypeOfThis
			* @callback PasteEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {string} value - Value pasted into input field.
			* @returns boolean | void
			*/
			type PasteEventHandler<TypeOfThis> = (sender:TypeOfThis, value:string) => boolean | void;
			/**
			* Callback responsible for constructing string value representing selected items.
			* @template TypeOfThis
			* @callback SelectionToStringCallback
			* @param {TypeOfThis} sender - Instance of control.
			* @returns string
			*/
			type SelectionToStringCallback<TypeOfThis> = (sender:TypeOfThis) => string;
			/**
			* DropDown item.
			* @class [Fit.Controls.DropDownTypeDefs.DropDownItem DropDownItem]
			*/
			class DropDownItem
			{
				// Properties defined by Fit.Controls.DropDownTypeDefs.DropDownItem
				/**
				* Item title.
				* @member {string} Title
				*/
				Title:string;
				/**
				* Value indicating whether item is a valid selection.
				* @member {boolean} Valid
				*/
				Valid:boolean;
				/**
				* Unique item value.
				* @member {string} Value
				*/
				Value:string;
			}
			/**
			* DropDown item.
			* @class [Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem UpdatedDropDownItem]
			*/
			class UpdatedDropDownItem
			{
				// Properties defined by Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem
				/**
				* Value indicating whether item still exists or not.
				* @member {boolean} Exists
				*/
				Exists:boolean;
				/**
				* Updated item title.
				* @member {string} Title
				*/
				Title:string;
				/**
				* unique item value.
				* @member {string} Value
				*/
				Value:string;
			}
		}
		/**
		* Control allowing for files to be selected locally and uploaded asynchronously.
		Extending from Fit.Controls.ControlBase.
		* @class [Fit.Controls.FilePicker FilePicker]
		*/
		class FilePicker
		{
			// Functions defined by Fit.Controls.FilePicker
			/**
			* Get/set value indicating whether control automatically starts upload process when files are selected.
			* @function AutoUpload
			* @param {boolean} [val=undefined] - If specified, True enables auto upload, False disables it (default).
			* @returns boolean
			*/
			public AutoUpload(val?:boolean):boolean;
			/**
			* Get/set button text.
			* @function ButtonText
			* @param {string} [val=undefined] - If defined, button text is set to specified value.
			* @returns string
			*/
			public ButtonText(val?:string):string;
			/**
			* Get/set drop zone text.
			* @function DropZoneText
			* @param {string} [val=undefined] - If defined, drop zone text is set to specified value.
			* @returns string
			*/
			public DropZoneText(val?:string):string;
			/**
			* Get/set value indicating whether control is enabled or not.
			Any files added to the control prior to being disabled, will
			not be included with a traditional postback to the server.
			* @function Enabled
			* @param {boolean} [val=undefined] - If specified, True enables control, False disables it.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Create instance of FilePicker control.
			* @function FilePicker
			* @param {string} [ctlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(ctlId?:string);
			/**
			* Get collection of selected files. Each file is represented as an object with the following members:
			- Filename:string (Name of selected file)
			- Type:string (Mime type for selected file)
			- Size:integer (File size in bytes)
			- Id:string (Unique file ID)
			- Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
			- Progress:integer (Value from 0-100 indicating upload progress, a value of -1 when not uploading/uploaded)
			- FileObject:File (Native JS File object representing selected file)
			- GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
			- ServerResponse:string (Response from server after successful file upload, otherwise Null)
			NOTICE: The following properties/functions are not available in Legacy Mode: Type, Size, FileObject, GetImagePreview().
			* @function GetFiles
			* @returns Fit.Controls.FilePickerTypeDefs.File[]
			*/
			public GetFiles():Fit.Controls.FilePickerTypeDefs.File[];
			/**
			* Get value indicating whether control is in legacy mode (old fashion upload control).
			* @function IsLegacyModeEnabled
			* @returns boolean
			*/
			public IsLegacyModeEnabled():boolean;
			/**
			* Get/set flag indicating whether control allows for multiple selections.
			* @function MultiSelectionMode
			* @param {boolean} [val=undefined] - If defined, True enables multi selection mode, False disables it.
			* @returns boolean
			*/
			public MultiSelectionMode(val?:boolean):boolean;
			/**
			* Add event handler fired when all files selected have been fully processed.
			Be aware that this event fires even if some files were not uploaded successfully.
			At this point files returned from GetFiles() contains a ServerResponse:string property
			containing the response from the server. This property remains Null in case of errors.
			Function receives one argument: Sender (Fit.Controls.FlePicker).
			* @function OnCompleted
			* @param {Fit.Controls.FilePickerTypeDefs.CompletedEventHandler} cb - Event handler function.
			*/
			public OnCompleted(cb:Fit.Controls.FilePickerTypeDefs.CompletedEventHandler):void;
			/**
			* Add event handler fired for a given file if the upload process failed.
			Function receives two arguments:
			Sender (Fit.Controls.FlePicker) and EventArgs object.
			EventArgs object contains the following members:
			- Filename:string (Name of given file)
			- Type:string (Mime type for given file)
			- Size:integer (File size in bytes)
			- Id:string (Unique file ID)
			- Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
			- Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded)
			- FileObject:File (Native JS File object representing given file)
			- GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
			- ServerResponse:string (Response from server after successful file upload, otherwise Null)
			Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this
			case will be Null. GetImagePreview() will also return Null in Legacy Mode.
			* @function OnFailure
			* @param {Fit.Controls.FilePickerTypeDefs.ProgressEventHandler} cb - Event handler function.
			*/
			public OnFailure(cb:Fit.Controls.FilePickerTypeDefs.ProgressEventHandler):void;
			/**
			* Add event handler fired when the upload process for a given file is progressing.
			Function receives two arguments:
			Sender (Fit.Controls.FlePicker) and EventArgs object.
			EventArgs object contains the following members:
			- Filename:string (Name of given file)
			- Type:string (Mime type for given file)
			- Size:integer (File size in bytes)
			- Id:string (Unique file ID)
			- Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
			- Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded)
			- FileObject:File (Native JS File object representing given file)
			- GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
			- ServerResponse:string (Response from server after successful file upload, otherwise Null)
			Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this
			case will be Null. GetImagePreview() will also return Null in Legacy Mode.
			* @function OnProgress
			* @param {Fit.Controls.FilePickerTypeDefs.ProgressEventHandler} cb - Event handler function.
			*/
			public OnProgress(cb:Fit.Controls.FilePickerTypeDefs.ProgressEventHandler):void;
			/**
			* Add event handler fired when a file has successfully been uploaded.
			Function receives two arguments:
			Sender (Fit.Controls.FlePicker) and EventArgs object.
			EventArgs object contains the following members:
			- Filename:string (Name of given file)
			- Type:string (Mime type for given file)
			- Size:integer (File size in bytes)
			- Id:string (Unique file ID)
			- Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
			- Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded)
			- FileObject:File (Native JS File object representing given file)
			- GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
			- ServerResponse:string (Response from server after successful file upload, otherwise Null)
			Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this
			case will be Null. GetImagePreview() will also return Null in Legacy Mode.
			* @function OnSuccess
			* @param {Fit.Controls.FilePickerTypeDefs.ProgressEventHandler} cb - Event handler function.
			*/
			public OnSuccess(cb:Fit.Controls.FilePickerTypeDefs.ProgressEventHandler):void;
			/**
			* Add event handler fired when upload is started.
			Operation can be canceled by returning False.
			Function receives one argument: Sender (Fit.Controls.FilePicker).
			* @function OnUpload
			* @param {Fit.Controls.FilePickerTypeDefs.CancelableUploadEventHandler} cb - Event handler function.
			*/
			public OnUpload(cb:Fit.Controls.FilePickerTypeDefs.CancelableUploadEventHandler):void;
			/**
			* Get/set value indicating whether control is displayed as a drop zone on supported browsers or not.
			* @function ShowDropZone
			* @param {boolean} [val=undefined] - If specified, True enables drop zone, False disables it (default).
			* @returns boolean
			*/
			public ShowDropZone(val?:boolean):boolean;
			/**
			* Upload selected files. Each file will be uploaded using POST over individual HTTP connections,
			and each file will be accessible from the POST data collection using the SelectedFile key.
			Use the OnProgress event to monitor the upload process, or use the OnCompleted event
			to be notified when all files have been fully processed.
			* @function Upload
			* @param {string[]} [skip=undefined] - Optional argument allowing some of the selected files to be skipped during
			upload. The argument is a string array with the names of the files to skip.
			*/
			public Upload(skip?:string[]):void;
			/**
			* Get/set URL to which files are uploaded when FilePicker.Upload() is called.
			Multiple files will be uploaded using POST over individual HTTP connections,
			and each file will be accessible from the POST data collection using the SelectedFile key.
			* @function Url
			* @param {string} [url=undefined] - If defined, upload URL is set to specified value.
			* @returns string
			*/
			public Url(url?:string):string;
			/**
			* Fit.Controls.ControlBase.Width override:
			Get/set control width - returns object with Value and Unit properties.
			This implementation differs from ControlBase.Width as passing a value of -1 resets
			the control width to fit its content, rather than assuming a fixed default width.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control.
			* @function AddCssClass
			* @param {string} val - CSS class to add.
			*/
			public AddCssClass(val:string):void;
			/**
			* Set callback function used to perform on-the-fly validation against control.
			* @function AddValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Function receiving an instance of the control.
			A value of False or a non-empty string with an
			error message must be returned if value is invalid.
			*/
			public AddValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value, as returned by the Value() function.
			* @function AddValidationRule
			* @param {RegExp} validator - Regular expression to validate value against.
			* @param {string} [errorMessage=undefined] - Optional error message displayed if value validation fails.
			*/
			public AddValidationRule(validator:RegExp, errorMessage?:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This
			comes in handy when programmatically changing a value of a control on behalf
			of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] - If defined, Always Dirty is enabled/disabled.
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed.
			* @function AutoPostBack
			* @param {boolean} [val=undefined] - If defined, True enables auto post back, False disables it.
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value.
			* @function Clear
			*/
			public Clear():void;
			/**
			* Get/set value indicating whether control is enabled or disabled.
			A disabled control's value and state is still included on postback, if part of a form.
			* @function Enabled
			* @param {boolean} [val=undefined] - If defined, True enables control (default), False disables control.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Check whether CSS class is found on DOMElement representing control.
			* @function HasCssClass
			* @param {string} val - CSS class to check for.
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get value indicating whether user has changed control value.
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid.
			Control value is considered invalid if control is required, but no value is set,
			or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Get/set value indicating whether control initially appears as valid, even
			though it is not. It will appear invalid once the user touches the control,
			or when control value is validated using Fit.Controls.ValidateAll(..).
			* @function LazyValidation
			* @param {boolean} [val=undefined] - If defined, Lazy Validation is enabled/disabled.
			* @returns boolean
			*/
			public LazyValidation(val?:boolean):boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus.
			* @function OnBlur
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnBlur(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user.
			* @function OnChange
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnChange(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus.
			* @function OnFocus
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnFocus(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Remove all validation rules.
			* @function RemoveAllValidationRules
			*/
			public RemoveAllValidationRules():void;
			/**
			* Remove CSS class from DOMElement representing control.
			* @function RemoveCssClass
			* @param {string} val - CSS class to remove.
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Remove validation function used to perform on-the-fly validation against control.
			* @function RemoveValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Validation function registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Remove regular expression used to perform on-the-fly validation against control value.
			* @function RemoveValidationRule
			* @param {RegExp} validator - Regular expression registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:RegExp):void;
			/**
			* Get/set value indicating whether control is required to be set.
			* @function Required
			* @param {boolean} [val=undefined] - If defined, control required feature is enabled/disabled.
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple
			controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] - If defined, control scope is updated.
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationCallback
			* @param {Function | null} cb - Function receiving control value - must return True if value is valid, otherwise False.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationCallback(cb:Function | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set regular expression used to perform on-the-fly validation against control value.
			* @function SetValidationExpression
			* @param {RegExp | null} regEx - Regular expression to validate against.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationExpression(regEx:RegExp | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationHandler
			* @param {Function | null} cb - Function receiving an instance of the control and its value.
			An error message string must be returned if value is invalid,
			otherwise Null or an empty string if the value is valid.
			*/
			public SetValidationHandler(cb:Function | null):void;
			/**
			* Get/set value as if it was changed by the user. Contrary to Value(..), this function will never reset the dirty state.
			Restrictions/filtering/modifications may be enforced just as the UI control might do, e.g. prevent the use of certain
			characters, or completely ignore input if not allowed. It may also allow invalid values such as a partially entered date
			value. The intention with UserValue(..) is to mimic the behaviour of what the user can do with the user interface control.
			For picker controls the value format is equivalent to the one dictated by the Value(..) function.
			* @function UserValue
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @returns string
			*/
			public UserValue(val?:string):string;
			/**
			* Get/set control value.
			For controls supporting multiple selections: Set value by providing a string in one the following formats:
			title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
			If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
			Selected items are returned in the first format described, also with reserved characters URIEncoded.
			Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns string
			*/
			public Value(val?:string, preserveDirtyState?:boolean):string;
			/**
			* Get/set value indicating whether control is visible.
			* @function Visible
			* @param {boolean} [val=undefined] - If defined, control visibility is updated.
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.FilePickerTypeDefs FilePickerTypeDefs]
		*/
		namespace FilePickerTypeDefs
		{
			// Functions defined by Fit.Controls.FilePickerTypeDefs
			/**
			* Cancelable upload event handler.
			* @callback CancelableUploadEventHandler
			* @param {Fit.Controls.FilePicker} sender - Instance of FilePicker.
			* @returns boolean | void
			*/
			type CancelableUploadEventHandler = (sender:Fit.Controls.FilePicker) => boolean | void;
			/**
			* Completed event handler.
			* @callback CompletedEventHandler
			* @param {Fit.Controls.FilePicker} sender - Instance of FilePicker.
			*/
			type CompletedEventHandler = (sender:Fit.Controls.FilePicker) => void;
			/**
			* Returns image preview for supported file types, Null for unsupported file types, and Null on browsers not supporting the File API.
			* @callback GetImagePreview
			* @returns HTMLImageElement | null
			*/
			type GetImagePreview = () => HTMLImageElement | null;
			/**
			* Progress event handler.
			* @callback ProgressEventHandler
			* @param {Fit.Controls.FilePicker} sender - Instance of FilePicker.
			* @param {Fit.Controls.FilePickerTypeDefs.File} eventArgs - Event arguments.
			*/
			type ProgressEventHandler = (sender:Fit.Controls.FilePicker, eventArgs:Fit.Controls.FilePickerTypeDefs.File) => void;
			/**
			* File information.
			* @class [Fit.Controls.FilePickerTypeDefs.File File]
			*/
			class File
			{
				// Properties defined by Fit.Controls.FilePickerTypeDefs.File
				/**
				* File name.
				* @member {string} Filename
				*/
				Filename:string;
				/**
				* Native JS File object representing file data - returns Null on browsers not supporting the File API.
				* @member {File | null} FileObject
				*/
				FileObject:File | null;
				/**
				* Get image preview for supported file types - returns Null on browsers not supporting the File API.
				* @member {Fit.Controls.FilePickerTypeDefs.GetImagePreview} GetImagePreview
				*/
				GetImagePreview:Fit.Controls.FilePickerTypeDefs.GetImagePreview;
				/**
				* Unique file ID.
				* @member {string} Id
				*/
				Id:string;
				/**
				* Flag indicating whether file has been uploaded, or is currently being uploaded, with a value of True.
				* @member {boolean} Processed
				*/
				Processed:boolean;
				/**
				* Value from 0-100 indicating upload progress, a value of -1 when not uploading/uploaded.
				* @member {number} Progress
				*/
				Progress:number;
				/**
				* Response from server after successful file upload, otherwise Null.
				* @member {string | null} ServerResponse
				*/
				ServerResponse:string | null;
				/**
				* File size in bytes - returns -1 on browsers not supporting the File API.
				* @member {number} Size
				*/
				Size:number;
				/**
				* Mime type - returns Unknown on browsers not supporting the File API.
				* @member {string} Type
				*/
				Type:string;
			}
		}
		/**
		* Input control which allows for one or multiple lines of
		text, and features a Design Mode for rich HTML content.
		Extending from Fit.Controls.ControlBase.
		* @class [Fit.Controls.Input Input]
		*/
		class Input
		{
			// Functions defined by Fit.Controls.Input
			/**
			* Get/set value indicating whether control should have spell checking enabled (default) or disabled.
			* @function CheckSpelling
			* @param {boolean} [val=undefined] - If defined, true enables spell checking while false disables it.
			* @returns boolean
			*/
			public CheckSpelling(val?:boolean):boolean;
			/**
			* Get/set number of milliseconds used to postpone onchange event.
			Every new keystroke/change resets the timer. Debouncing can
			improve performance when working with large amounts of data.
			* @function DebounceOnChange
			* @param {number} timeout - If defined, timeout value (milliseconds) is updated - a value of -1 disables debouncing.
			* @returns number
			*/
			public DebounceOnChange(timeout:number):number;
			/**
			* Get/set value indicating whether control is in Design Mode allowing for rich HTML content.
			Notice that this control type requires dimensions (Width/Height) to be specified in pixels.
			* @function DesignMode
			* @param {boolean} [val=undefined] - If defined, True enables Design Mode, False disables it.
			* @returns boolean
			*/
			public DesignMode(val?:boolean):boolean;
			/**
			* Create instance of Input control.
			* @function Input
			* @param {string} [ctlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(ctlId?:string);
			/**
			* Get/set value indicating whether control is maximizable.
			Making control maximizable will disable Resizable.
			* @function Maximizable
			* @param {boolean} [val=undefined] - If defined, True enables maximize button, False disables it.
			* @param {number} [heightMax=undefined] - If defined, this becomes the height of the input control when maximized.
			The value is considered the same unit set using Height(..) which defaults to px.
			However, if DesignMode is enabled, the value unit is considered to be px.
			* @returns boolean
			*/
			public Maximizable(val?:boolean, heightMax?:number):boolean;
			/**
			* Get/set value indicating whether control is maximized.
			* @function Maximized
			* @param {boolean} [val=undefined] - If defined, True maximizes control, False minimizes it.
			* @returns boolean
			*/
			public Maximized(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control is in Multi Line mode (textarea).
			* @function MultiLine
			* @param {boolean} [val=undefined] - If defined, True enables Multi Line mode, False disables it.
			* @returns boolean
			*/
			public MultiLine(val?:boolean):boolean;
			/**
			* Get/set value used as a placeholder to indicate expected input on supported browsers.
			* @function Placeholder
			* @param {string} [val=undefined] - If defined, value is set as placeholder.
			* @returns string
			*/
			public Placeholder(val?:string):string;
			/**
			* Get/set value indicating whether control is resizable on supported
			(modern) browsers. Making control resizable will disable Maximizable.
			* @function Resizable
			* @param {Fit.Controls.InputResizing | "Disabled" | "Enabled" | "Horizontal" | "Vertical"} [val=undefined] - If defined, determines whether control resizes, and in what direction(s).
			* @returns Fit.Controls.InputResizing | "Disabled" | "Enabled" | "Horizontal" | "Vertical"
			*/
			public Resizable(val?:Fit.Controls.InputResizing | "Disabled" | "Enabled" | "Horizontal" | "Vertical"):Fit.Controls.InputResizing | "Disabled" | "Enabled" | "Horizontal" | "Vertical";
			/**
			* Get/set input type (e.g. Text, Password, Email, etc.).
			* @function Type
			* @param {Fit.Controls.InputType | "Color" | "Date" | "DateTime" | "Email" | "Month" | "Number" | "Password" | "PhoneNumber" | "Text" | "Textarea" | "Time" | "Week"} [val=undefined] - If defined, input type is changed to specified value.
			* @returns Fit.Controls.InputType | "Color" | "Date" | "DateTime" | "Email" | "Month" | "Number" | "Password" | "PhoneNumber" | "Text" | "Textarea" | "Time" | "Week"
			*/
			public Type(val?:Fit.Controls.InputType | "Color" | "Date" | "DateTime" | "Email" | "Month" | "Number" | "Password" | "PhoneNumber" | "Text" | "Textarea" | "Time" | "Week"):Fit.Controls.InputType | "Color" | "Date" | "DateTime" | "Email" | "Month" | "Number" | "Password" | "PhoneNumber" | "Text" | "Textarea" | "Time" | "Week";
			// Functions defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control.
			* @function AddCssClass
			* @param {string} val - CSS class to add.
			*/
			public AddCssClass(val:string):void;
			/**
			* Set callback function used to perform on-the-fly validation against control.
			* @function AddValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Function receiving an instance of the control.
			A value of False or a non-empty string with an
			error message must be returned if value is invalid.
			*/
			public AddValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value, as returned by the Value() function.
			* @function AddValidationRule
			* @param {RegExp} validator - Regular expression to validate value against.
			* @param {string} [errorMessage=undefined] - Optional error message displayed if value validation fails.
			*/
			public AddValidationRule(validator:RegExp, errorMessage?:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This
			comes in handy when programmatically changing a value of a control on behalf
			of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] - If defined, Always Dirty is enabled/disabled.
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed.
			* @function AutoPostBack
			* @param {boolean} [val=undefined] - If defined, True enables auto post back, False disables it.
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value.
			* @function Clear
			*/
			public Clear():void;
			/**
			* Get/set value indicating whether control is enabled or disabled.
			A disabled control's value and state is still included on postback, if part of a form.
			* @function Enabled
			* @param {boolean} [val=undefined] - If defined, True enables control (default), False disables control.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Check whether CSS class is found on DOMElement representing control.
			* @function HasCssClass
			* @param {string} val - CSS class to check for.
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get value indicating whether user has changed control value.
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid.
			Control value is considered invalid if control is required, but no value is set,
			or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Get/set value indicating whether control initially appears as valid, even
			though it is not. It will appear invalid once the user touches the control,
			or when control value is validated using Fit.Controls.ValidateAll(..).
			* @function LazyValidation
			* @param {boolean} [val=undefined] - If defined, Lazy Validation is enabled/disabled.
			* @returns boolean
			*/
			public LazyValidation(val?:boolean):boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus.
			* @function OnBlur
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnBlur(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user.
			* @function OnChange
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnChange(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus.
			* @function OnFocus
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnFocus(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Remove all validation rules.
			* @function RemoveAllValidationRules
			*/
			public RemoveAllValidationRules():void;
			/**
			* Remove CSS class from DOMElement representing control.
			* @function RemoveCssClass
			* @param {string} val - CSS class to remove.
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Remove validation function used to perform on-the-fly validation against control.
			* @function RemoveValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Validation function registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Remove regular expression used to perform on-the-fly validation against control value.
			* @function RemoveValidationRule
			* @param {RegExp} validator - Regular expression registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:RegExp):void;
			/**
			* Get/set value indicating whether control is required to be set.
			* @function Required
			* @param {boolean} [val=undefined] - If defined, control required feature is enabled/disabled.
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple
			controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] - If defined, control scope is updated.
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationCallback
			* @param {Function | null} cb - Function receiving control value - must return True if value is valid, otherwise False.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationCallback(cb:Function | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set regular expression used to perform on-the-fly validation against control value.
			* @function SetValidationExpression
			* @param {RegExp | null} regEx - Regular expression to validate against.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationExpression(regEx:RegExp | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationHandler
			* @param {Function | null} cb - Function receiving an instance of the control and its value.
			An error message string must be returned if value is invalid,
			otherwise Null or an empty string if the value is valid.
			*/
			public SetValidationHandler(cb:Function | null):void;
			/**
			* Get/set value as if it was changed by the user. Contrary to Value(..), this function will never reset the dirty state.
			Restrictions/filtering/modifications may be enforced just as the UI control might do, e.g. prevent the use of certain
			characters, or completely ignore input if not allowed. It may also allow invalid values such as a partially entered date
			value. The intention with UserValue(..) is to mimic the behaviour of what the user can do with the user interface control.
			For picker controls the value format is equivalent to the one dictated by the Value(..) function.
			* @function UserValue
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @returns string
			*/
			public UserValue(val?:string):string;
			/**
			* Get/set control value.
			For controls supporting multiple selections: Set value by providing a string in one the following formats:
			title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
			If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
			Selected items are returned in the first format described, also with reserved characters URIEncoded.
			Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns string
			*/
			public Value(val?:string, preserveDirtyState?:boolean):string;
			/**
			* Get/set value indicating whether control is visible.
			* @function Visible
			* @param {boolean} [val=undefined] - If defined, control visibility is updated.
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* Picker control which allows for entries
		to be selected in the DropDown control.
		* @class [Fit.Controls.ListView ListView]
		*/
		class ListView
		{
			// Functions defined by Fit.Controls.ListView
			/**
			* Add item to ListView.
			* @function AddItem
			* @param {string} title - Item title.
			* @param {string} value - Item value.
			*/
			public AddItem(title:string, value:string):void;
			/**
			* Get item by value - returns object with Title (string) and Value (string) properties if found, otherwise Null.
			* @function GetItem
			* @param {string} value - Value of item to retrieve.
			* @returns Fit.Controls.ListViewTypeDefs.ListViewItem | null
			*/
			public GetItem(value:string):Fit.Controls.ListViewTypeDefs.ListViewItem | null;
			/**
			* Get all items - returns array containing objects with Title (string) and Value (string) properties.
			* @function GetItems
			* @returns Fit.Controls.ListViewTypeDefs.ListViewItem[]
			*/
			public GetItems():Fit.Controls.ListViewTypeDefs.ListViewItem[];
			/**
			* Returns value indicating whether control contains item with specified value.
			* @function HasItem
			* @param {string} value - Value of item to check for.
			* @returns boolean
			*/
			public HasItem(value:string):boolean;
			/**
			* Create instance of ListView control.
			* @function ListView
			* @param {string} [controlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(controlId?:string);
			/**
			* Register event handler fired when item is being selected.
			Selection can be canceled by returning False.
			The following arguments are passed to event handler function:
			Sender (ListView) and Item (with Title (string) and Value (string) properties).
			* @function OnSelect
			* @param {Fit.Controls.ListViewTypeDefs.OnSelectEventHandler<this>} cb - Event handler function.
			*/
			public OnSelect(cb:Fit.Controls.ListViewTypeDefs.OnSelectEventHandler<this>):void;
			/**
			* Register event handler fired when item is selected.
			The following arguments are passed to event handler function:
			Sender (ListView) and Item (with Title (string) and Value (string) properties).
			* @function OnSelected
			* @param {Fit.Controls.ListViewTypeDefs.OnSelectedEventHandler<this>} cb - Event handler function.
			*/
			public OnSelected(cb:Fit.Controls.ListViewTypeDefs.OnSelectedEventHandler<this>):void;
			/**
			* Remove item from ListView.
			* @function RemoveItem
			* @param {string} value - Value of item to remove.
			*/
			public RemoveItem(value:string):void;
			/**
			* Remove all items from ListView.
			* @function RemoveItems
			*/
			public RemoveItems():void;
			// Functions defined by Fit.Controls.PickerBase
			/**
			* Overridden by control developers (required).
			Destroys control to free up memory.
			Make sure to call Destroy() on PickerBase which can be done like so:
			this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
			{
			     // Add control specific logic here
			     base(); // Call Destroy on PickerBase
			});.
			* @function Destroy
			*/
			public Destroy():void;
			/**
			* Overridden by control developers (required).
			Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Overridden by control developers (optional).
			Host control or external code may invoke this function to obtain the currently
			highlighted item in the picker control.
			Function returns Null when not implemented or when no item is highlighted. If found,
			an object with the following signature is returned: { Title: string, Value: string }.
			* @function GetHighlighted
			* @returns Fit.Controls.PickerBaseTypeDefs.Item | null
			*/
			public GetHighlighted():Fit.Controls.PickerBaseTypeDefs.Item | null;
			/**
			* Overridden by control developers (optional).
			Host control may invoke this function, for instance to update the title of selected items,
			to make sure these properly reflect the state of data displayed in the picker.
			Function returns Null when not implemented or when an item is not found. If found, an object
			with the following signature is returned: { Title: string, Value: string }.
			* @function GetItemByValue
			* @param {string} val - Value of item to retrieve.
			* @returns Fit.Controls.PickerBaseTypeDefs.Item | null
			*/
			public GetItemByValue(val:string):Fit.Controls.PickerBaseTypeDefs.Item | null;
			/**
			* Overridden by control developers (optional).
			Host control dispatches keyboard events to this function to allow
			picker control to handle keyboard navigation with keys such as
			arrow up/down/left/right, enter, space, etc.
			Picker may return False to prevent host control from reacting to given event.
			* @function HandleEvent
			* @param {Event} [e=undefined] - Keyboard event to process.
			*/
			public HandleEvent(e?:Event):void;
			/**
			* Overridden by control developers (optional).
			This function can be used to make the picker control automatically highlight the first item.
			* @function HighlightFirst
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public HighlightFirst(val?:boolean):boolean;
			/**
			* Get/set max height of control - returns object with Value (number) and Unit (string) properties.
			* @function MaxHeight
			* @param {number} [value=undefined] - If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=undefined] - If defined, max height is updated to specified CSS unit, otherwise px is assumed.
			* @returns Fit.TypeDefs.CssValue
			*/
			public MaxHeight(value?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Register OnFocusIn event handler which is invoked when picker gains focus.
			* @function OnFocusIn
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnFocusIn(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register OnFocusOut event handler which is invoked when picker loses focus.
			* @function OnFocusOut
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnFocusOut(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when picker control is hidden in host control.
			The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnHide
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function.
			*/
			public OnHide(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when item selection is changed.
			This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode,
			where an existing selected item is deselected, followed by selection of new item.
			The following arguments are passed to event handler function:
			Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanged
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionChangedEventHandler<this>} cb - Event handler function.
			*/
			public OnItemSelectionChanged(cb:Fit.Controls.PickerBaseTypeDefs.SelectionChangedEventHandler<this>):void;
			/**
			* Register event handler fired when item selection is changing.
			Selection can be canceled by returning False.
			The following arguments are passed to event handler function:
			Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanging
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionChangingEventHandler<this>} cb - Event handler function.
			*/
			public OnItemSelectionChanging(cb:Fit.Controls.PickerBaseTypeDefs.SelectionChangingEventHandler<this>):void;
			/**
			* Register event handler invoked when a series of related item changes are completed.
			* @function OnItemSelectionComplete
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnItemSelectionComplete(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when picker control is shown in host control.
			The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnShow
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function.
			*/
			public OnShow(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Overridden by control developers (optional).
			This function can be used to tell the picker control to persist (remember) its current state between interactions.
			For instance a TreeView control would remembers its scroll position and highlighted node, while a calendar would
			remember the previously selected year and month.
			* @function PersistView
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public PersistView(val?:boolean):boolean;
			/**
			* Overridden by control developers (optional).
			Host control may invoke this function to reveal a selected item in
			the picker control. Often this means having the item scrolled into view.
			* @function RevealItemInView
			* @param {string} val - Value of item to reveal in view.
			*/
			public RevealItemInView(val:string):void;
			/**
			* Overridden by control developers (optional).
			Host control invokes this function when picker is assigned to host control, providing an array
			of items already selected. An item is an object with a Title (string) and Value (string) property set.
			If picker defines preselected items, firing OnItemSelectionChanged
			for these items, will update the host control appropriately.
			* @function SetSelections
			* @param {Fit.Controls.PickerBaseTypeDefs.Item[]} items - Array containing selected items: {Title:string, Value:string}.
			*/
			public SetSelections(items:Fit.Controls.PickerBaseTypeDefs.Item[]):void;
			/**
			* Overridden by control developers (optional).
			Host control invokes this function when an item's selection state is changed from host control.
			Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged,
			as demonstrated below, if the picker control contains the given item.
			
			var item = getItem(value);
			if (item !== null)
			{
			     if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected, programmaticallyChanged) === false)
			         return false;
			
			     item.SetSelected(selected);
			     this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected, programmaticallyChanged);
			}
			
			Both events are fired by passing the given item's title, value, and current selection state.
			Be aware that host control may pass information about items not found in picker, e.g. when pasting
			items which may turn out not to be valid selections.
			Returning False from UpdateItemSelection will cancel the change.
			* @function UpdateItemSelection
			* @param {string} value - Item value.
			* @param {boolean} selected - True if item was selected, False if item was deselected.
			* @param {boolean} programmaticallyChanged - True if item was selected programmatically (not by user interaction), False otherwise.
			*/
			public UpdateItemSelection(value:string, selected:boolean, programmaticallyChanged:boolean):void;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.ListViewTypeDefs ListViewTypeDefs]
		*/
		namespace ListViewTypeDefs
		{
			// Functions defined by Fit.Controls.ListViewTypeDefs
			/**
			* OnSelected event handler.
			* @template TypeOfThis
			* @callback OnSelectedEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {{ Title: string, Value: string }} item - Selected item.
			*/
			type OnSelectedEventHandler<TypeOfThis> = (sender:TypeOfThis, item:{ Title: string, Value: string }) => void;
			/**
			* OnSelect event handler.
			* @template TypeOfThis
			* @callback OnSelectEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {{ Title: string, Value: string }} item - Selected item.
			* @returns boolean | void
			*/
			type OnSelectEventHandler<TypeOfThis> = (sender:TypeOfThis, item:{ Title: string, Value: string }) => boolean | void;
			/**
			* ListView item.
			* @class [Fit.Controls.ListViewTypeDefs.ListViewItem ListViewItem]
			*/
			class ListViewItem
			{
				// Properties defined by Fit.Controls.ListViewTypeDefs.ListViewItem
				/**
				* Item title.
				* @member {string} Title
				*/
				Title:string;
				/**
				* Unique item value.
				* @member {string} Value
				*/
				Value:string;
			}
		}
		/**
		* Class from which all Picker Controls extend.
		Control developers must override: GetDomElement, Destroy.
		Overriding the following functions is optional:
		UpdateItemSelectionState, HandleEvent.
		Picker Control must fire OnItemSelectionChanging and OnItemSelectionChanged when an item's
		selection state is being changed, which is done by invoking
		this._internal.FireOnItemSelectionChanging(title:string, value:string, currentSelectionState:boolean, programmaticallyChanged:boolean)
		and
		this._internal.FireOnItemSelectionChanged(title:string, value:string, newSelectionState:boolean, programmaticallyChanged:boolean).
		Notice that FireOnItemSelectionChanging may return False, which must prevent item from being
		selected, and at the same time prevent FireOnItemSelectionChanged from being called.
		Changing an item selection may cause OnItemSelectionChanging and OnItemSelectionChanged to be
		fired multiple times (e.g. if picker needs to first deselect one item before selecting another one).
		Therefore PickerBase also features the OnItemSelectionComplete event which must be fired when related
		changes complete, which is done by invoking this._internal.FireOnItemSelectionComplete().
		OnItemSelectionComplete should only fire if a change was made (changes can be canceled using
		OnItemSelectionChanging).
		Picker control is also to invoke this._internal.FireOnFocusIn() if control gains focus, and
		this._internal.FireOnFocusOut() if control loses focus.
		* @class [Fit.Controls.PickerBase PickerBase]
		*/
		class PickerBase
		{
			// Functions defined by Fit.Controls.PickerBase
			/**
			* Overridden by control developers (required).
			Destroys control to free up memory.
			Make sure to call Destroy() on PickerBase which can be done like so:
			this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
			{
			     // Add control specific logic here
			     base(); // Call Destroy on PickerBase
			});.
			* @function Destroy
			*/
			public Destroy():void;
			/**
			* Overridden by control developers (required).
			Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Overridden by control developers (optional).
			Host control or external code may invoke this function to obtain the currently
			highlighted item in the picker control.
			Function returns Null when not implemented or when no item is highlighted. If found,
			an object with the following signature is returned: { Title: string, Value: string }.
			* @function GetHighlighted
			* @returns Fit.Controls.PickerBaseTypeDefs.Item | null
			*/
			public GetHighlighted():Fit.Controls.PickerBaseTypeDefs.Item | null;
			/**
			* Overridden by control developers (optional).
			Host control may invoke this function, for instance to update the title of selected items,
			to make sure these properly reflect the state of data displayed in the picker.
			Function returns Null when not implemented or when an item is not found. If found, an object
			with the following signature is returned: { Title: string, Value: string }.
			* @function GetItemByValue
			* @param {string} val - Value of item to retrieve.
			* @returns Fit.Controls.PickerBaseTypeDefs.Item | null
			*/
			public GetItemByValue(val:string):Fit.Controls.PickerBaseTypeDefs.Item | null;
			/**
			* Overridden by control developers (optional).
			Host control dispatches keyboard events to this function to allow
			picker control to handle keyboard navigation with keys such as
			arrow up/down/left/right, enter, space, etc.
			Picker may return False to prevent host control from reacting to given event.
			* @function HandleEvent
			* @param {Event} [e=undefined] - Keyboard event to process.
			*/
			public HandleEvent(e?:Event):void;
			/**
			* Overridden by control developers (optional).
			This function can be used to make the picker control automatically highlight the first item.
			* @function HighlightFirst
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public HighlightFirst(val?:boolean):boolean;
			/**
			* Get/set max height of control - returns object with Value (number) and Unit (string) properties.
			* @function MaxHeight
			* @param {number} [value=undefined] - If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=undefined] - If defined, max height is updated to specified CSS unit, otherwise px is assumed.
			* @returns Fit.TypeDefs.CssValue
			*/
			public MaxHeight(value?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Register OnFocusIn event handler which is invoked when picker gains focus.
			* @function OnFocusIn
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnFocusIn(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register OnFocusOut event handler which is invoked when picker loses focus.
			* @function OnFocusOut
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnFocusOut(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when picker control is hidden in host control.
			The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnHide
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function.
			*/
			public OnHide(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when item selection is changed.
			This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode,
			where an existing selected item is deselected, followed by selection of new item.
			The following arguments are passed to event handler function:
			Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanged
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionChangedEventHandler<this>} cb - Event handler function.
			*/
			public OnItemSelectionChanged(cb:Fit.Controls.PickerBaseTypeDefs.SelectionChangedEventHandler<this>):void;
			/**
			* Register event handler fired when item selection is changing.
			Selection can be canceled by returning False.
			The following arguments are passed to event handler function:
			Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanging
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionChangingEventHandler<this>} cb - Event handler function.
			*/
			public OnItemSelectionChanging(cb:Fit.Controls.PickerBaseTypeDefs.SelectionChangingEventHandler<this>):void;
			/**
			* Register event handler invoked when a series of related item changes are completed.
			* @function OnItemSelectionComplete
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnItemSelectionComplete(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when picker control is shown in host control.
			The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnShow
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function.
			*/
			public OnShow(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Overridden by control developers (optional).
			This function can be used to tell the picker control to persist (remember) its current state between interactions.
			For instance a TreeView control would remembers its scroll position and highlighted node, while a calendar would
			remember the previously selected year and month.
			* @function PersistView
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public PersistView(val?:boolean):boolean;
			/**
			* Overridden by control developers (optional).
			Host control may invoke this function to reveal a selected item in
			the picker control. Often this means having the item scrolled into view.
			* @function RevealItemInView
			* @param {string} val - Value of item to reveal in view.
			*/
			public RevealItemInView(val:string):void;
			/**
			* Overridden by control developers (optional).
			Host control invokes this function when picker is assigned to host control, providing an array
			of items already selected. An item is an object with a Title (string) and Value (string) property set.
			If picker defines preselected items, firing OnItemSelectionChanged
			for these items, will update the host control appropriately.
			* @function SetSelections
			* @param {Fit.Controls.PickerBaseTypeDefs.Item[]} items - Array containing selected items: {Title:string, Value:string}.
			*/
			public SetSelections(items:Fit.Controls.PickerBaseTypeDefs.Item[]):void;
			/**
			* Overridden by control developers (optional).
			Host control invokes this function when an item's selection state is changed from host control.
			Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged,
			as demonstrated below, if the picker control contains the given item.
			
			var item = getItem(value);
			if (item !== null)
			{
			     if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected, programmaticallyChanged) === false)
			         return false;
			
			     item.SetSelected(selected);
			     this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected, programmaticallyChanged);
			}
			
			Both events are fired by passing the given item's title, value, and current selection state.
			Be aware that host control may pass information about items not found in picker, e.g. when pasting
			items which may turn out not to be valid selections.
			Returning False from UpdateItemSelection will cancel the change.
			* @function UpdateItemSelection
			* @param {string} value - Item value.
			* @param {boolean} selected - True if item was selected, False if item was deselected.
			* @param {boolean} programmaticallyChanged - True if item was selected programmatically (not by user interaction), False otherwise.
			*/
			public UpdateItemSelection(value:string, selected:boolean, programmaticallyChanged:boolean):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.PickerBaseTypeDefs PickerBaseTypeDefs]
		*/
		namespace PickerBaseTypeDefs
		{
			// Functions defined by Fit.Controls.PickerBaseTypeDefs
			/**
			* Event handler.
			* @template TypeOfThis
			* @callback BaseEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			*/
			type BaseEventHandler<TypeOfThis> = (sender:TypeOfThis) => void;
			/**
			* Selection changed event handler.
			* @template TypeOfThis
			* @callback SelectionChangedEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionEventHandlerArguments} eventArgs - Event arguments.
			*/
			type SelectionChangedEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.PickerBaseTypeDefs.SelectionEventHandlerArguments) => void;
			/**
			* Selection changing event handler.
			* @template TypeOfThis
			* @callback SelectionChangingEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionEventHandlerArguments} eventArgs - Event arguments.
			* @returns boolean | void
			*/
			type SelectionChangingEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.PickerBaseTypeDefs.SelectionEventHandlerArguments) => boolean | void;
			/**
			* Item information.
			* @class [Fit.Controls.PickerBaseTypeDefs.Item Item]
			*/
			class Item
			{
				// Properties defined by Fit.Controls.PickerBaseTypeDefs.Item
				/**
				* Item title.
				* @member {string} Title
				*/
				Title:string;
				/**
				* Item value.
				* @member {string} Value
				*/
				Value:string;
			}
			/**
			* Selection event handler arguments.
			* @class [Fit.Controls.PickerBaseTypeDefs.SelectionEventHandlerArguments SelectionEventHandlerArguments]
			*/
			class SelectionEventHandlerArguments
			{
				// Properties defined by Fit.Controls.PickerBaseTypeDefs.SelectionEventHandlerArguments
				/**
				* Flag indicating whether item is selected or not.
				* @member {boolean} Selected
				*/
				Selected:boolean;
				/**
				* Item title.
				* @member {string} Title
				*/
				Title:string;
				/**
				* Item value.
				* @member {string} Value
				*/
				Value:string;
			}
		}
		/**
		* ProgressBar control useful for indicating progress.
		* @class [Fit.Controls.ProgressBar ProgressBar]
		*/
		class ProgressBar
		{
			// Functions defined by Fit.Controls.ProgressBar
			/**
			* Set callback function invoked when progress is changed.
			* @function OnProgress
			* @param {Fit.Controls.ProgressBarTypeDefs.ProgressEventHandler} cb - Event handler invoked when progress is changed - takes progress bar instance as argument.
			*/
			public OnProgress(cb:Fit.Controls.ProgressBarTypeDefs.ProgressEventHandler):void;
			/**
			* Get/set progress - a value between 0 and 100.
			* @function Progress
			* @param {number} [val=undefined] - If defined, progress is set to specified value (0-100).
			* @returns number
			*/
			public Progress(val?:number):number;
			/**
			* Create instance of ProgressBar control.
			* @function ProgressBar
			* @param {string} [controlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(controlId?:string);
			/**
			* Get/set title in progress bar.
			* @function Title
			* @param {string} [val=undefined] - If specified, title will be set to specified value.
			* @returns string
			*/
			public Title(val?:string):string;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.ProgressBarTypeDefs ProgressBarTypeDefs]
		*/
		namespace ProgressBarTypeDefs
		{
			// Functions defined by Fit.Controls.ProgressBarTypeDefs
			/**
			* Progress event handler.
			* @callback ProgressEventHandler
			* @param {Fit.Controls.ProgressBar} sender - Instance of ProgressBar.
			*/
			type ProgressEventHandler = (sender:Fit.Controls.ProgressBar) => void;
		}
		/**
		* The SoftLog is an alternative to the browser's console log which allows for debugging on devices without developer tools.
		* @class [Fit.Controls.SoftLog SoftLog]
		*/
		class SoftLog
		{
			// Functions defined by Fit.Controls.SoftLog
			/**
			* Get/set value determining whether to catch unhandled exceptions.
			* @function CatchUncaughtExceptions
			* @param {boolean} [val=undefined] - If defined, True enables exception logging, False disables it.
			* @returns boolean
			*/
			public CatchUncaughtExceptions(val?:boolean):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get/set value determining whether to intercept console.log(..).
			* @function InterceptConsoleLog
			* @param {boolean} [val=undefined] - If defined, True enables console.log(..) interception, False disables it.
			* @returns boolean
			*/
			public InterceptConsoleLog(val?:boolean):boolean;
			/**
			* Log message.
			* @function Log
			* @param {string} msg - Text message to log.
			*/
			public Log(msg:string):void;
			/**
			* Get/set number of log entries preserved.
			* @function MaxEntries
			* @param {boolean} [val=undefined] - If defined, changes number of log entries preserved.
			* @returns number
			*/
			public MaxEntries(val?:boolean):number;
			/**
			* Create instance of SoftLog control.
			* @function SoftLog
			* @param {string} [controlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(controlId?:string);
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* TreeView control allowing data to be listed in a structured manner.
		Extending from Fit.Controls.PickerBase.
		Extending from Fit.Controls.ControlBase.
		
		Performance considerations (for huge amounts of data):
		
		1) Selectable(..) is used to transform how nodes allow selections
		(disabled/single select/multi select/select all). This requires the function to
		recursively modify all nodes contained to make sure they are configured identically.
		However, this also happens when AddChild(node) is called, to make sure
		nodes added at any time is configured in accordance with TreeView configuration.
		Selectable(..) should therefore be called before adding nodes to prevent
		an extra recursive operation on all nodes contained.
		
		2) Selected(nodes) performs better than Value("val1;val2;val3")
		
		3) RemoveChild(node) performance is non-linear, relative to the amount of children contained.
		The function recursively iterates children to find selected nodes to deselect them, to
		make sure TreeView is updated accordingly.
		
		4) GetChild("val1", true) is faster at finding one specific node, compared to recursively
		iterating the result from GetChildren(), since internal children collections are indexed.
		
		5) Be aware that some operations (e.g. AddChild, Expand/Collapse, Select/Deselect) forces
		Internet Explorer 8 to repaint tree to work around render bugs. Repainting can be minimized
		greately by populating root nodes before adding them to the TreeView instance.
		However, be aware that this comes with the performance penalty mentioned in article 1 (AddChild).
		It is likely that repainting does not pose a major performance problem, though.
		* @class [Fit.Controls.TreeView TreeView]
		*/
		class TreeView
		{
			// Functions defined by Fit.Controls.TreeView
			/**
			* Add node to TreeView.
			* @function AddChild
			* @param {Fit.Controls.TreeViewNode} node - Node to add.
			* @param {number} [atIndex=undefined] - Optional index at which node is added.
			*/
			public AddChild(node:Fit.Controls.TreeViewNode, atIndex?:number):void;
			/**
			* Get/set value indicating whether user is allowed to deselect nodes.
			By default the user is allowed to deselect nodes.
			* @function AllowDeselect
			* @param {boolean} [val=undefined] - If defined, changes behaviour to specified value.
			* @returns boolean
			*/
			public AllowDeselect(val?:boolean):boolean;
			/**
			* Fit.Controls.ControlBase.Clear override:
			Clear control value.
			Override allows for non-selectable nodes to keep their selection state.
			This is useful if TreeView has been configured to preselect some non-selectable
			nodes, hence preventing the user from removing these selections. In that case the
			desired functionality of the Clear function could be to preserve these preselections.
			If called with no arguments, all selections are cleared.
			* @function Clear
			* @param {boolean} [preserveNonSelectable=false] - True causes selection state of non-selectable nodes to be preserved, False do not.
			*/
			public Clear(preserveNonSelectable?:boolean):void;
			/**
			* Collapse all nodes, optionally to a maximum depth.
			* @function CollapseAll
			* @param {number} [maxDepth=undefined] - Optional maximum depth to collapse nodes.
			*/
			public CollapseAll(maxDepth?:number):void;
			/**
			* Get/set instance of ContextMenu control triggered when right clicking nodes in TreeView.
			* @function ContextMenu
			* @param {Fit.Controls.ContextMenu | null} contextMenu - If defined, assignes ContextMenu control to TreeView.
			* @returns Fit.Controls.ContextMenu
			*/
			public ContextMenu(contextMenu:Fit.Controls.ContextMenu | null):Fit.Controls.ContextMenu;
			/**
			* Expand all nodes, optionally to a maximum depth.
			* @function ExpandAll
			* @param {number} [maxDepth=undefined] - Optional maximum depth to expand nodes.
			*/
			public ExpandAll(maxDepth?:number):void;
			/**
			* Get active (highlighted or focused) node - returns Null if no node is currently active.
			* @function GetActiveNode
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetActiveNode():Fit.Controls.TreeViewNode | null;
			/**
			* Get all nodes across all children and their children, in a flat structure.
			* @function GetAllNodes
			* @returns Fit.Controls.TreeViewNode[]
			*/
			public GetAllNodes():Fit.Controls.TreeViewNode[];
			/**
			* Get node by value - returns Null if not found.
			* @function GetChild
			* @param {string} val - Node value.
			* @param {boolean} [recursive=false] - If defined, True enables recursive search.
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetChild(val:string, recursive?:boolean):Fit.Controls.TreeViewNode | null;
			/**
			* Get all children.
			* @function GetChildren
			* @returns Fit.Controls.TreeViewNode[]
			*/
			public GetChildren():Fit.Controls.TreeViewNode[];
			/**
			* Get node above specified node - returns Null if no node is above the specified one.
			* @function GetNodeAbove
			* @param {Fit.Controls.TreeViewNode} node - Node to get node above.
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetNodeAbove(node:Fit.Controls.TreeViewNode):Fit.Controls.TreeViewNode | null;
			/**
			* Get node below specified node - returns Null if no node is below the specified one.
			* @function GetNodeBelow
			* @param {Fit.Controls.TreeViewNode} node - Node to get node below.
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetNodeBelow(node:Fit.Controls.TreeViewNode):Fit.Controls.TreeViewNode | null;
			/**
			* Get node currently having focus - returns Null if no node has focus.
			* @function GetNodeFocused
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetNodeFocused():Fit.Controls.TreeViewNode | null;
			/**
			* Get/set value indicating whether keyboard navigation is enabled.
			* @function KeyboardNavigation
			* @param {boolean} [val=undefined] - If defined, True enables keyboard navigation, False disables it.
			* @returns boolean
			*/
			public KeyboardNavigation(val?:boolean):boolean;
			/**
			* Get/set value indicating whether helper lines are shown.
			Notice that helper lines cause node items to obtain a fixed
			line height of 20px, making it unsuitable for large fonts.
			* @function Lines
			* @param {boolean} [val=undefined] - If defined, True enables helper lines, False disables them.
			* @returns boolean
			*/
			public Lines(val?:boolean):boolean;
			/**
			* Add event handler fired before context menu is shown.
			This event can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
			Use Sender.ContextMenu() to obtain a reference to the context menu.
			* @function OnContextMenu
			* @param {Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>} cb - Event handler function.
			*/
			public OnContextMenu(cb:Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>):void;
			/**
			* Add event handler fired when node is being selected or deselected.
			Selection can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
			* @function OnSelect
			* @param {Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>} cb - Event handler function.
			*/
			public OnSelect(cb:Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>):void;
			/**
			* Add event handler fired when Select All is used for a given node.
			This event can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.TreeView) and EventArgs object.
			EventArgs object contains the following properties:
			- Node: Fit.Controls.TreeViewNode instance - Null if Select All was triggered for root nodes (all nodes)
			- Selected: Boolean value indicating new selection state.
			* @function OnSelectAll
			* @param {Fit.Controls.TreeViewTypeDefs.CancelableSelectionEventHandler<this>} cb - Event handler function.
			*/
			public OnSelectAll(cb:Fit.Controls.TreeViewTypeDefs.CancelableSelectionEventHandler<this>):void;
			/**
			* Add event handler fired when Select All operation has completed.
			Function receives two arguments:
			Sender (Fit.Controls.TreeView) and EventArgs object.
			EventArgs object contains the following properties:
			- Node: Fit.Controls.TreeViewNode instance - Null if Select All was triggered for root nodes (all nodes)
			- Selected: Boolean value indicating new selection state.
			* @function OnSelectAllComplete
			* @param {Fit.Controls.TreeViewTypeDefs.SelectionCompleteEventHandler<this>} cb - Event handler function.
			*/
			public OnSelectAllComplete(cb:Fit.Controls.TreeViewTypeDefs.SelectionCompleteEventHandler<this>):void;
			/**
			* Add event handler fired when node is selected or deselected.
			Selection can not be canceled. Function receives two arguments:
			Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
			* @function OnSelected
			* @param {Fit.Controls.TreeViewTypeDefs.NodeEventHandler<this>} cb - Event handler function.
			*/
			public OnSelected(cb:Fit.Controls.TreeViewTypeDefs.NodeEventHandler<this>):void;
			/**
			* Add event handler fired when node is being expanded or collapsed.
			Toggle can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
			* @function OnToggle
			* @param {Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>} cb - Event handler function.
			*/
			public OnToggle(cb:Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>):void;
			/**
			* Add event handler fired when node is expanded or collapsed.
			Toggle can not be canceled. Function receives two arguments:
			Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
			* @function OnToggled
			* @param {Fit.Controls.TreeViewTypeDefs.NodeEventHandler<this>} cb - Event handler function.
			*/
			public OnToggled(cb:Fit.Controls.TreeViewTypeDefs.NodeEventHandler<this>):void;
			/**
			* Remove all nodes contained in TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes.
			* @function RemoveAllChildren
			* @param {boolean} [dispose=false] - Set True to dispose nodes.
			*/
			public RemoveAllChildren(dispose?:boolean):void;
			/**
			* Remove node from TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes.
			* @function RemoveChild
			* @param {Fit.Controls.TreeViewNode} node - Node to remove.
			*/
			public RemoveChild(node:Fit.Controls.TreeViewNode):void;
			/**
			* Get/set value indicating whether user can change selection state of nodes.
			This affects all contained nodes. To configure nodes
			individually, use Selectable(..) function on node instances.
			* @function Selectable
			* @param {boolean} [val=undefined] - If defined, True enables node selection, False disables it.
			* @param {boolean} [multi=false] - If defined, True enables node multi selection, False disables it.
			* @returns boolean
			*/
			public Selectable(val?:boolean, multi?:boolean):boolean;
			/**
			* Select all nodes.
			* @function SelectAll
			* @param {boolean} selected - Value indicating whether to select or deselect nodes.
			* @param {Fit.Controls.TreeViewNode} [selectAllNode=undefined] - If specified, children under given node is selected/deselected recursively.
			If not specified, all nodes contained in TreeView will be selected/deselected.
			*/
			public SelectAll(selected:boolean, selectAllNode?:Fit.Controls.TreeViewNode):void;
			/**
			* Get/set selected nodes.
			* @function Selected
			* @param {Fit.Controls.TreeViewNode[]} [val=undefined] - If defined, provided nodes are selected.
			* @returns Fit.Controls.TreeViewNode[]
			*/
			public Selected(val?:Fit.Controls.TreeViewNode[]):Fit.Controls.TreeViewNode[];
			/**
			* Set active (highlighted or focused) node.
			* @function SetActiveNode
			* @param {Fit.Controls.TreeViewNode} node - Node to set active in TreeView.
			*/
			public SetActiveNode(node:Fit.Controls.TreeViewNode):void;
			/**
			* Create instance of TreeView control.
			* @function TreeView
			* @param {string} [ctlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(ctlId?:string);
			/**
			* Get/set value indicating whether Word Wrapping is enabled.
			* @function WordWrap
			* @param {boolean} [val=undefined] - If defined, True enables Word Wrapping, False disables it.
			* @returns boolean
			*/
			public WordWrap(val?:boolean):boolean;
			// Functions defined by Fit.Controls.PickerBase
			/**
			* Overridden by control developers (required).
			Destroys control to free up memory.
			Make sure to call Destroy() on PickerBase which can be done like so:
			this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
			{
			     // Add control specific logic here
			     base(); // Call Destroy on PickerBase
			});.
			* @function Destroy
			*/
			public Destroy():void;
			/**
			* Overridden by control developers (required).
			Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Overridden by control developers (optional).
			Host control or external code may invoke this function to obtain the currently
			highlighted item in the picker control.
			Function returns Null when not implemented or when no item is highlighted. If found,
			an object with the following signature is returned: { Title: string, Value: string }.
			* @function GetHighlighted
			* @returns Fit.Controls.PickerBaseTypeDefs.Item | null
			*/
			public GetHighlighted():Fit.Controls.PickerBaseTypeDefs.Item | null;
			/**
			* Overridden by control developers (optional).
			Host control may invoke this function, for instance to update the title of selected items,
			to make sure these properly reflect the state of data displayed in the picker.
			Function returns Null when not implemented or when an item is not found. If found, an object
			with the following signature is returned: { Title: string, Value: string }.
			* @function GetItemByValue
			* @param {string} val - Value of item to retrieve.
			* @returns Fit.Controls.PickerBaseTypeDefs.Item | null
			*/
			public GetItemByValue(val:string):Fit.Controls.PickerBaseTypeDefs.Item | null;
			/**
			* Overridden by control developers (optional).
			Host control dispatches keyboard events to this function to allow
			picker control to handle keyboard navigation with keys such as
			arrow up/down/left/right, enter, space, etc.
			Picker may return False to prevent host control from reacting to given event.
			* @function HandleEvent
			* @param {Event} [e=undefined] - Keyboard event to process.
			*/
			public HandleEvent(e?:Event):void;
			/**
			* Overridden by control developers (optional).
			This function can be used to make the picker control automatically highlight the first item.
			* @function HighlightFirst
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public HighlightFirst(val?:boolean):boolean;
			/**
			* Get/set max height of control - returns object with Value (number) and Unit (string) properties.
			* @function MaxHeight
			* @param {number} [value=undefined] - If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=undefined] - If defined, max height is updated to specified CSS unit, otherwise px is assumed.
			* @returns Fit.TypeDefs.CssValue
			*/
			public MaxHeight(value?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Register OnFocusIn event handler which is invoked when picker gains focus.
			* @function OnFocusIn
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnFocusIn(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register OnFocusOut event handler which is invoked when picker loses focus.
			* @function OnFocusOut
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnFocusOut(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when picker control is hidden in host control.
			The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnHide
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function.
			*/
			public OnHide(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when item selection is changed.
			This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode,
			where an existing selected item is deselected, followed by selection of new item.
			The following arguments are passed to event handler function:
			Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanged
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionChangedEventHandler<this>} cb - Event handler function.
			*/
			public OnItemSelectionChanged(cb:Fit.Controls.PickerBaseTypeDefs.SelectionChangedEventHandler<this>):void;
			/**
			* Register event handler fired when item selection is changing.
			Selection can be canceled by returning False.
			The following arguments are passed to event handler function:
			Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanging
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionChangingEventHandler<this>} cb - Event handler function.
			*/
			public OnItemSelectionChanging(cb:Fit.Controls.PickerBaseTypeDefs.SelectionChangingEventHandler<this>):void;
			/**
			* Register event handler invoked when a series of related item changes are completed.
			* @function OnItemSelectionComplete
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnItemSelectionComplete(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when picker control is shown in host control.
			The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnShow
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function.
			*/
			public OnShow(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Overridden by control developers (optional).
			This function can be used to tell the picker control to persist (remember) its current state between interactions.
			For instance a TreeView control would remembers its scroll position and highlighted node, while a calendar would
			remember the previously selected year and month.
			* @function PersistView
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public PersistView(val?:boolean):boolean;
			/**
			* Overridden by control developers (optional).
			Host control may invoke this function to reveal a selected item in
			the picker control. Often this means having the item scrolled into view.
			* @function RevealItemInView
			* @param {string} val - Value of item to reveal in view.
			*/
			public RevealItemInView(val:string):void;
			/**
			* Overridden by control developers (optional).
			Host control invokes this function when picker is assigned to host control, providing an array
			of items already selected. An item is an object with a Title (string) and Value (string) property set.
			If picker defines preselected items, firing OnItemSelectionChanged
			for these items, will update the host control appropriately.
			* @function SetSelections
			* @param {Fit.Controls.PickerBaseTypeDefs.Item[]} items - Array containing selected items: {Title:string, Value:string}.
			*/
			public SetSelections(items:Fit.Controls.PickerBaseTypeDefs.Item[]):void;
			/**
			* Overridden by control developers (optional).
			Host control invokes this function when an item's selection state is changed from host control.
			Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged,
			as demonstrated below, if the picker control contains the given item.
			
			var item = getItem(value);
			if (item !== null)
			{
			     if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected, programmaticallyChanged) === false)
			         return false;
			
			     item.SetSelected(selected);
			     this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected, programmaticallyChanged);
			}
			
			Both events are fired by passing the given item's title, value, and current selection state.
			Be aware that host control may pass information about items not found in picker, e.g. when pasting
			items which may turn out not to be valid selections.
			Returning False from UpdateItemSelection will cancel the change.
			* @function UpdateItemSelection
			* @param {string} value - Item value.
			* @param {boolean} selected - True if item was selected, False if item was deselected.
			* @param {boolean} programmaticallyChanged - True if item was selected programmatically (not by user interaction), False otherwise.
			*/
			public UpdateItemSelection(value:string, selected:boolean, programmaticallyChanged:boolean):void;
			// Functions defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control.
			* @function AddCssClass
			* @param {string} val - CSS class to add.
			*/
			public AddCssClass(val:string):void;
			/**
			* Set callback function used to perform on-the-fly validation against control.
			* @function AddValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Function receiving an instance of the control.
			A value of False or a non-empty string with an
			error message must be returned if value is invalid.
			*/
			public AddValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value, as returned by the Value() function.
			* @function AddValidationRule
			* @param {RegExp} validator - Regular expression to validate value against.
			* @param {string} [errorMessage=undefined] - Optional error message displayed if value validation fails.
			*/
			public AddValidationRule(validator:RegExp, errorMessage?:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This
			comes in handy when programmatically changing a value of a control on behalf
			of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] - If defined, Always Dirty is enabled/disabled.
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed.
			* @function AutoPostBack
			* @param {boolean} [val=undefined] - If defined, True enables auto post back, False disables it.
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value.
			* @function Clear
			*/
			public Clear():void;
			/**
			* Get/set value indicating whether control is enabled or disabled.
			A disabled control's value and state is still included on postback, if part of a form.
			* @function Enabled
			* @param {boolean} [val=undefined] - If defined, True enables control (default), False disables control.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Check whether CSS class is found on DOMElement representing control.
			* @function HasCssClass
			* @param {string} val - CSS class to check for.
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get value indicating whether user has changed control value.
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid.
			Control value is considered invalid if control is required, but no value is set,
			or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Get/set value indicating whether control initially appears as valid, even
			though it is not. It will appear invalid once the user touches the control,
			or when control value is validated using Fit.Controls.ValidateAll(..).
			* @function LazyValidation
			* @param {boolean} [val=undefined] - If defined, Lazy Validation is enabled/disabled.
			* @returns boolean
			*/
			public LazyValidation(val?:boolean):boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus.
			* @function OnBlur
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnBlur(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user.
			* @function OnChange
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnChange(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus.
			* @function OnFocus
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnFocus(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Remove all validation rules.
			* @function RemoveAllValidationRules
			*/
			public RemoveAllValidationRules():void;
			/**
			* Remove CSS class from DOMElement representing control.
			* @function RemoveCssClass
			* @param {string} val - CSS class to remove.
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Remove validation function used to perform on-the-fly validation against control.
			* @function RemoveValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Validation function registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Remove regular expression used to perform on-the-fly validation against control value.
			* @function RemoveValidationRule
			* @param {RegExp} validator - Regular expression registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:RegExp):void;
			/**
			* Get/set value indicating whether control is required to be set.
			* @function Required
			* @param {boolean} [val=undefined] - If defined, control required feature is enabled/disabled.
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple
			controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] - If defined, control scope is updated.
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationCallback
			* @param {Function | null} cb - Function receiving control value - must return True if value is valid, otherwise False.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationCallback(cb:Function | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set regular expression used to perform on-the-fly validation against control value.
			* @function SetValidationExpression
			* @param {RegExp | null} regEx - Regular expression to validate against.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationExpression(regEx:RegExp | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationHandler
			* @param {Function | null} cb - Function receiving an instance of the control and its value.
			An error message string must be returned if value is invalid,
			otherwise Null or an empty string if the value is valid.
			*/
			public SetValidationHandler(cb:Function | null):void;
			/**
			* Get/set value as if it was changed by the user. Contrary to Value(..), this function will never reset the dirty state.
			Restrictions/filtering/modifications may be enforced just as the UI control might do, e.g. prevent the use of certain
			characters, or completely ignore input if not allowed. It may also allow invalid values such as a partially entered date
			value. The intention with UserValue(..) is to mimic the behaviour of what the user can do with the user interface control.
			For picker controls the value format is equivalent to the one dictated by the Value(..) function.
			* @function UserValue
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @returns string
			*/
			public UserValue(val?:string):string;
			/**
			* Get/set control value.
			For controls supporting multiple selections: Set value by providing a string in one the following formats:
			title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
			If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
			Selected items are returned in the first format described, also with reserved characters URIEncoded.
			Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns string
			*/
			public Value(val?:string, preserveDirtyState?:boolean):string;
			/**
			* Get/set value indicating whether control is visible.
			* @function Visible
			* @param {boolean} [val=undefined] - If defined, control visibility is updated.
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @class [Fit.Controls.TreeViewNode TreeViewNode]
		*/
		class TreeViewNode
		{
			// Functions defined by Fit.Controls.TreeViewNode
			/**
			* Add child node.
			* @function AddChild
			* @param {Fit.Controls.TreeViewNode} node - Node to add.
			* @param {number} [atIndex=undefined] - Optional index at which node is added.
			*/
			public AddChild(node:Fit.Controls.TreeViewNode, atIndex?:number):void;
			/**
			* Destroys object to free up memory.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether node is expanded.
			* @function Expanded
			* @param {boolean} [val=undefined] - If defined, True expands node, False collapses it.
			* @returns boolean
			*/
			public Expanded(val?:boolean):boolean;
			/**
			* Get/set value indicating whether node has focus.
			* @function Focused
			* @param {boolean} [val=undefined] - If defined, True assigns focus, False removes it (blur).
			* @returns boolean
			*/
			public Focused(val?:boolean):boolean;
			/**
			* Get node by value - returns Null if not found.
			* @function GetChild
			* @param {string} val - Node value.
			* @param {boolean} [recursive=false] - If defined, True enables recursive search.
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetChild(val:string, recursive?:boolean):Fit.Controls.TreeViewNode | null;
			/**
			* Get all children.
			* @function GetChildren
			* @returns Fit.Controls.TreeViewNode[]
			*/
			public GetChildren():Fit.Controls.TreeViewNode[];
			/**
			* Get DOMElement representing node.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get node index (position in parent node or TreeView) - returns -1 if node has not been added yet.
			* @function GetIndex
			* @returns number
			*/
			public GetIndex():number;
			/**
			* Get node depth in current hierarchy - root node is considered level 0.
			* @function GetLevel
			* @returns number
			*/
			public GetLevel():number;
			/**
			* Get parent node - returns Null if node has no parent.
			* @function GetParent
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetParent():Fit.Controls.TreeViewNode | null;
			/**
			* Returns TreeView if associated, otherwise Null.
			* @function GetTreeView
			* @returns Fit.Controls.TreeView | null
			*/
			public GetTreeView():Fit.Controls.TreeView | null;
			/**
			* Get value indicating whether node has its selection checkbox enabled.
			* @function HasCheckbox
			* @returns boolean
			*/
			public HasCheckbox():boolean;
			/**
			* Returns True if this is a behavioral node, otherwise False - see SetBehavioralNodeCallback for more details.
			* @function IsBehavioralNode
			* @returns boolean
			*/
			public IsBehavioralNode():boolean;
			/**
			* Remove child node - this does not result in TreeView.OnSelect and TreeView.OnSelected being fired for selected nodes.
			* @function RemoveChild
			* @param {Fit.Controls.TreeViewNode} node - Node to remove.
			*/
			public RemoveChild(node:Fit.Controls.TreeViewNode):void;
			/**
			* Get/set value indicating whether user can change node selection state.
			* @function Selectable
			* @param {boolean} [val=undefined] - If defined, True enables node selection, False disables it.
			* @param {boolean} [showCheckbox=false] - If defined, True adds a selection checkbox, False removes it.
			* @returns boolean
			*/
			public Selectable(val?:boolean, showCheckbox?:boolean):boolean;
			/**
			* Get/set value indicating whether node is selected.
			If node is selected, it will automatically be made
			selectable, if not already done so.
			* @function Selected
			* @param {boolean} [select=undefined] - If defined, True selects node, False deselects it.
			* @returns boolean
			*/
			public Selected(select?:boolean):boolean;
			/**
			* Set callback invoked when node is selected.
			A behavioral node is not considered data, so selecting it will not change
			the control value. Since the node is not considered data, it will not trigger
			the OnSelect and OnSelected TreeView events either.
			Callback receives two arguments:
			Sender (Fit.Controls.TreeViewNode) and Selected (boolean value indicating new selection state).
			Callback may cancel changed selection state by returning False.
			* @function SetBehavioralNodeCallback
			* @param {Fit.Controls.TreeViewTypeDefs.CancelableBehavioralNodeCallback | null} func - Callback function invoked when node is selected - Null disables behavioral state.
			*/
			public SetBehavioralNodeCallback(func:Fit.Controls.TreeViewTypeDefs.CancelableBehavioralNodeCallback | null):void;
			/**
			* Get/set node title.
			* @function Title
			* @param {string} [val=undefined] - If defined, node title is updated.
			* @returns string
			*/
			public Title(val?:string):string;
			/**
			* Create instance of TreeViewNode.
			* @function TreeViewNode
			* @param {string} displayTitle - Node title.
			* @param {string} nodeValue - Node value.
			*/
			constructor(displayTitle:string, nodeValue:string);
			/**
			* Get node value.
			* @function Value
			* @returns string
			*/
			public Value():string;
		}
		/**
		* 
		* @namespace [Fit.Controls.TreeViewTypeDefs TreeViewTypeDefs]
		*/
		namespace TreeViewTypeDefs
		{
			// Functions defined by Fit.Controls.TreeViewTypeDefs
			/**
			* Behavioral node callback.
			* @callback CancelableBehavioralNodeCallback
			* @param {Fit.Controls.TreeViewNode} sender - Instance of TreeViewNode.
			* @param {boolean} selected - Value indicating new selection state.
			* @returns boolean | void
			*/
			type CancelableBehavioralNodeCallback = (sender:Fit.Controls.TreeViewNode, selected:boolean) => boolean | void;
			/**
			* Cancelable node event handler.
			* @template TypeOfThis
			* @callback CancelableNodeEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.TreeViewNode} node - Instance of TreeViewNode.
			* @returns boolean | void
			*/
			type CancelableNodeEventHandler<TypeOfThis> = (sender:TypeOfThis, node:Fit.Controls.TreeViewNode) => boolean | void;
			/**
			* Cancelable select all event handler.
			* @template TypeOfThis
			* @callback CancelableSelectionEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.TreeViewTypeDefs.SelectionEventHandlerArgs} eventArgs - Event handler arguments.
			* @returns boolean | void
			*/
			type CancelableSelectionEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.TreeViewTypeDefs.SelectionEventHandlerArgs) => boolean | void;
			/**
			* Node event handler.
			* @template TypeOfThis
			* @callback NodeEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.TreeViewNode} node - Instance of TreeViewNode.
			*/
			type NodeEventHandler<TypeOfThis> = (sender:TypeOfThis, node:Fit.Controls.TreeViewNode) => void;
			/**
			* Select all complete event handler.
			* @template TypeOfThis
			* @callback SelectionCompleteEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.TreeViewTypeDefs.SelectionEventHandlerArgs} eventArgs - Event handler arguments.
			*/
			type SelectionCompleteEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.TreeViewTypeDefs.SelectionEventHandlerArgs) => void;
			/**
			* Selection event handler arguments.
			* @class [Fit.Controls.TreeViewTypeDefs.SelectionEventHandlerArgs SelectionEventHandlerArgs]
			*/
			class SelectionEventHandlerArgs
			{
				// Properties defined by Fit.Controls.TreeViewTypeDefs.SelectionEventHandlerArgs
				/**
				* Instance of TreeViewNode - Null if Select All was triggered for root nodes (all nodes).
				* @member {Fit.Controls.TreeViewNode | null} Node
				*/
				Node:Fit.Controls.TreeViewNode | null;
				/**
				* Value indicating new selection state.
				* @member {boolean} Selected
				*/
				Selected:boolean;
			}
		}
		/**
		* ContextMenu control allowing for quick access to select features provided by a WebService.
		Extending from Fit.Controls.ContextMenu.
		* @class [Fit.Controls.WSContextMenu WSContextMenu]
		*/
		class WSContextMenu
		{
			// Functions defined by Fit.Controls.WSContextMenu
			/**
			* Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication.
			Often this argument is simply "callback". Passing Null disables JSONP communication again.
			* @function JsonpCallback
			* @param {string | null} [val=undefined] - If defined, enables JSONP and updates JSONP callback argument.
			* @returns string
			*/
			public JsonpCallback(val?:string | null):string;
			/**
			* Add event handler fired when ContextMenu has been populated with items.
			Function receives two arguments:
			Sender (Fit.Controls.WSContextMenu) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSContextMenu instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Children: JSON items received from WebService.
			* @function OnPopulated
			* @param {Fit.Controls.WSContextMenuTypeDefs.DataEventHandler<this>} cb - Event handler function.
			*/
			public OnPopulated(cb:Fit.Controls.WSContextMenuTypeDefs.DataEventHandler<this>):void;
			/**
			* Add event handler fired when data is being requested.
			Request can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.WSContextMenu) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSContextMenu instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance.
			* @function OnRequest
			* @param {Fit.Controls.WSContextMenuTypeDefs.RequestEventHandler<this>} cb - Event handler function.
			*/
			public OnRequest(cb:Fit.Controls.WSContextMenuTypeDefs.RequestEventHandler<this>):void;
			/**
			* Add event handler fired when data is received,
			allowing for data transformation to occure before
			ContextMenu is populated. Function receives two arguments:
			Sender (Fit.Controls.WSContextMenu) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSContextMenu instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Children: JSON items received from WebService.
			* @function OnResponse
			* @param {Fit.Controls.WSContextMenuTypeDefs.DataEventHandler<this>} cb - Event handler function.
			*/
			public OnResponse(cb:Fit.Controls.WSContextMenuTypeDefs.DataEventHandler<this>):void;
			/**
			* Get/set URL to WebService responsible for providing data to ContextMenu.
			WebService must deliver all data at once in the following JSON format:
			[
			     { Title: "Test 1", Value: "1001", Selectable: true, Selected: true, Children: [] },
			     { Title: "Test 2", Value: "1002", Selectable: false, Selected: false, Children: [] }
			]
			Only Value is required. Children is a collection of items with the same format as described above.
			* @function Url
			* @param {string} [wsUrl=undefined] - If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetItems).
			* @returns string
			*/
			public Url(wsUrl?:string):string;
			/**
			* Create instance of WSContextMenu control.
			* @function WSContextMenu
			* @param {string} [controlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(controlId?:string);
			// Functions defined by Fit.Controls.ContextMenu
			/**
			* Add item to ContextMenu.
			* @function AddChild
			* @param {Fit.Controls.ContextMenuItem} item - Item to add.
			*/
			public AddChild(item:Fit.Controls.ContextMenuItem):void;
			/**
			* Get/set value indicating whether boundary/collision detection is enabled or not.
			* @function DetectBoundaries
			* @param {boolean} [val=undefined] - If defined, True enables collision detection (default), False disables it.
			* @returns boolean
			*/
			public DetectBoundaries(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get all children across entire hierarchy in a flat collection.
			* @function GetAllChildren
			* @returns Fit.Controls.ContextMenuItem[]
			*/
			public GetAllChildren():Fit.Controls.ContextMenuItem[];
			/**
			* Get item by value - returns Null if not found.
			* @function GetChild
			* @param {string} val - Item value.
			* @param {boolean} [recursive=false] - If defined, True enables recursive search.
			* @returns Fit.Controls.ContextMenuItem | null
			*/
			public GetChild(val:string, recursive?:boolean):Fit.Controls.ContextMenuItem | null;
			/**
			* Get all children.
			* @function GetChildren
			* @returns Fit.Controls.ContextMenuItem[]
			*/
			public GetChildren():Fit.Controls.ContextMenuItem[];
			/**
			* Hide context menu.
			* @function Hide
			*/
			public Hide():void;
			/**
			* Get value indicating whether context menu is visible or not.
			* @function IsVisible
			* @returns boolean
			*/
			public IsVisible():boolean;
			/**
			* Add event handler fired when context menu is hidden.
			Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnHide
			* @param {Fit.Controls.ContextMenuTypeDefs.EventHandler<this>} cb - Event handler function.
			*/
			public OnHide(cb:Fit.Controls.ContextMenuTypeDefs.EventHandler<this>):void;
			/**
			* Add event handler fired when an item is selected in context menu.
			Function receives two arguments:
			Sender (Fit.Controls.ContextMenu) and Item (Fit.Controls.ContextMenuItem).
			* @function OnSelect
			* @param {Fit.Controls.ContextMenuTypeDefs.SelectEventHandler<this>} cb - Event handler function.
			*/
			public OnSelect(cb:Fit.Controls.ContextMenuTypeDefs.SelectEventHandler<this>):void;
			/**
			* Add event handler fired before context menu is shown.
			This event can be canceled by returning False.
			Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnShowing
			* @param {Fit.Controls.ContextMenuTypeDefs.CancelableEventHandler<this>} cb - Event handler function.
			*/
			public OnShowing(cb:Fit.Controls.ContextMenuTypeDefs.CancelableEventHandler<this>):void;
			/**
			* Add event handler fired when context menu is shown.
			Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnShown
			* @param {Fit.Controls.ContextMenuTypeDefs.EventHandler<this>} cb - Event handler function.
			*/
			public OnShown(cb:Fit.Controls.ContextMenuTypeDefs.EventHandler<this>):void;
			/**
			* Remove all items contained in ContextMenu.
			* @function RemoveAllChildren
			* @param {boolean} [dispose=false] - Set True to dispose items.
			*/
			public RemoveAllChildren(dispose?:boolean):void;
			/**
			* Remove item from ContextMenu.
			* @function RemoveChild
			* @param {Fit.Controls.ContextMenuItem} item - Item to remove.
			*/
			public RemoveChild(item:Fit.Controls.ContextMenuItem):void;
			/**
			* Make context menu show up. If X,Y coordinates are not specified, the position of the mouse pointer will be used.
			* @function Show
			* @param {number} [x=undefined] - If defined, context menu will open at specified horizontal position.
			* @param {number} [y=undefined] - If defined, context menu will open at specified vertical position.
			*/
			public Show(x?:number, y?:number):void;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.WSContextMenuTypeDefs WSContextMenuTypeDefs]
		*/
		namespace WSContextMenuTypeDefs
		{
			// Functions defined by Fit.Controls.WSContextMenuTypeDefs
			/**
			* Data event handler.
			* @template TypeOfThis
			* @callback DataEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSContextMenuTypeDefs.DataEventArgs<TypeOfThis>} eventArgs - Event arguments.
			*/
			type DataEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSContextMenuTypeDefs.DataEventArgs<TypeOfThis>) => void;
			/**
			* OnRequest event handler.
			* @template TypeOfThis
			* @callback RequestEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSContextMenuTypeDefs.RequestEventArgs<TypeOfThis>} eventArgs - Event arguments.
			* @returns boolean | void
			*/
			type RequestEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSContextMenuTypeDefs.RequestEventArgs<TypeOfThis>) => boolean | void;
			/**
			* Data event handler arguments.
			* @class [Fit.Controls.WSContextMenuTypeDefs.DataEventArgs DataEventArgs]
			* @template TypeOfThis
			*/
			class DataEventArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSContextMenuTypeDefs.DataEventArgs
				/**
				* JSON items received from web service.
				* @member {any} Children
				*/
				Children:any;
				/**
				* Instance of JsonpRequest or JsonRequest.
				* @member {Fit.Http.JsonpRequest | Fit.Http.JsonRequest} Request
				*/
				Request:Fit.Http.JsonpRequest | Fit.Http.JsonRequest;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
			/**
			* Request event handler arguments.
			* @class [Fit.Controls.WSContextMenuTypeDefs.RequestEventArgs RequestEventArgs]
			* @template TypeOfThis
			*/
			class RequestEventArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSContextMenuTypeDefs.RequestEventArgs
				/**
				* Instance of JsonpRequest or JsonRequest.
				* @member {Fit.Http.JsonpRequest | Fit.Http.JsonRequest} Request
				*/
				Request:Fit.Http.JsonpRequest | Fit.Http.JsonRequest;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
		}
		/**
		* WebService enabled Drop Down Menu control allowing for single and multi selection.
		Supports data selection using any control extending from Fit.Controls.PickerBase.
		This control is extending from Fit.Controls.DropDown.
		* @class [Fit.Controls.WSDropDown WSDropDown]
		*/
		class WSDropDown
		{
			// Functions defined by Fit.Controls.WSDropDown
			/**
			* Automatically update title of selected items based on data from WebService.
			Contrary to UpdateSelected(), AutoUpdateSelected() automatically loads all
			data from the associated WebService before updating the selected items, but
			only if one or more items are selected.
			The callback function is invoked when selected items have been updated.
			The following arguments are passed to function:
			- Sender (WSDropDown)
			- An array of updated items, each with a Title (string), Value (string), and Exists (boolean) property.
			Notice that items that no longer exists in picker's data, will NOT automatically be removed.
			To obtain all items with the most current state (both updated and unmodified selections), use;
			dropdown.AutoUpdateSelected(function(sender, updated) { console.log("All selected", dropdown.GetSelections()); });
			For additiona details see UpdateSelected().
			* @function AutoUpdateSelected
			* @param {Fit.Controls.WSDropDownTypeDefs.AutoUpdateSelectedCallback<this>} [cb=undefined] - Optional callback function invoked when selected items have been updated.
			*/
			public AutoUpdateSelected(cb?:Fit.Controls.WSDropDownTypeDefs.AutoUpdateSelectedCallback<this>):void;
			/**
			* Call this function to make control reload data when needed,
			ensuring that the user will see the most recent values available.
			Operation may be postponed if data is currently loading from WebService.
			Use callback to pick up execution once data has been cleared.
			Sender (Fit.Controls.WSDropDown) is passed to callback as an argument.
			* @function ClearData
			* @param {Fit.Controls.WSDropDownTypeDefs.ClearDataCallback<this>} [cb=undefined] - If defined, callback is invoked when data is cleared.
			*/
			public ClearData(cb?:Fit.Controls.WSDropDownTypeDefs.ClearDataCallback<this>):void;
			/**
			* Get WSListView control used to display data in a flat list view.
			* @function GetListView
			* @returns Fit.Controls.WSListView
			*/
			public GetListView():Fit.Controls.WSListView;
			/**
			* Get WSTreeView control used to display data in a hierarchical tree view.
			* @function GetTreeView
			* @returns Fit.Controls.WSTreeView
			*/
			public GetTreeView():Fit.Controls.WSTreeView;
			/**
			* Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication.
			Often this argument is simply "callback". Passing Null disables JSONP communication again.
			* @function JsonpCallback
			* @param {string | null} [val=undefined] - If defined, enables JSONP and updates JSONP callback argument.
			* @returns string | null
			*/
			public JsonpCallback(val?:string | null):string | null;
			/**
			* Get/set flag indicating whether searchable ListView is enabled or not.
			The value provided also determines the value for InputEnabled and vice versa.
			* @function ListViewEnabled
			* @param {boolean} [val=undefined] - If defined, True enables ListView and search capability (default), False disables it.
			* @returns boolean
			*/
			public ListViewEnabled(val?:boolean):boolean;
			/**
			* Add event handler fired if data request is canceled.
			Function receives two arguments:
			Sender (Fit.Controls.WSDropDown) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSDropDown instance
			- Picker: Picker causing WebService data request (WSTreeView or WSListView instance)
			- Node: Fit.Controls.TreeViewNode instance if requesting TreeView children, Null if requesting root nodes
			- Search: Search value if entered by user
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Data: JSON data received from WebService (Null in this particular case).
			* @function OnAbort
			* @param {Fit.Controls.WSDropDownTypeDefs.RequestAbortedEventHandler<this>} cb - Event handler function.
			*/
			public OnAbort(cb:Fit.Controls.WSDropDownTypeDefs.RequestAbortedEventHandler<this>):void;
			/**
			* Add event handler fired when data is being requested.
			Request can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.WSDropDown) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSDropDown instance
			- Picker: Picker causing WebService data request (WSTreeView or WSListView instance)
			- Node: Fit.Controls.TreeViewNode instance if requesting TreeView children, Null if requesting root nodes
			- Search: Search value if entered by user
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance.
			* @function OnRequest
			* @param {Fit.Controls.WSDropDownTypeDefs.CancelableRequestEventHandler<this>} cb - Event handler function.
			*/
			public OnRequest(cb:Fit.Controls.WSDropDownTypeDefs.CancelableRequestEventHandler<this>):void;
			/**
			* Add event handler fired when data is received,
			allowing for data transformation to occure before
			picker control is populated. Function receives two arguments:
			Sender (Fit.Controls.WSDropDown) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSDropDown instance
			- Picker: Picker causing WebService data request (WSTreeView or WSListView instance)
			- Node: Fit.Controls.TreeViewNode instance if requesting TreeView children, Null if requesting root nodes
			- Search: Search value if entered by user
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Data: JSON data received from WebService.
			* @function OnResponse
			* @param {Fit.Controls.WSDropDownTypeDefs.ResponseEventHandler<this>} cb - Event handler function.
			*/
			public OnResponse(cb:Fit.Controls.WSDropDownTypeDefs.ResponseEventHandler<this>):void;
			/**
			* Get/set value indicating whether TreeView control is enabled or not.
			* @function TreeViewEnabled
			* @param {boolean} [val=undefined] - If defined, True enables TreeView (default), False disables it.
			* @returns boolean
			*/
			public TreeViewEnabled(val?:boolean):boolean;
			/**
			* Get/set URL to WebService responsible for providing data to drop down.
			WebService must deliver data in the following JSON format:
			[
			     { Title: "Test 1", Value: "1001", Selectable: true, Selected: true, Children: [] },
			     { Title: "Test 2", Value: "1002", Selectable: false, Selected: false, Children: [] }
			]
			Only Value is required. Children is a collection of nodes with the same format as described above.
			HasChildren:boolean may be set to indicate that children are available server side and that WebService
			should be called to load these children when the given node is expanded.
			* @function Url
			* @param {string} [wsUrl=undefined] - If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetData).
			* @returns string
			*/
			public Url(wsUrl?:string):string;
			/**
			* Get/set value indicating whether control uses the built-in action menu to ease addition and removal of items.
			If this property is not explicitly set, it will automatically be changed by the control depending on data and other settings.
			The action menu will be enabled if TreeViewEnabled is set to False, as it would otherwise not show anything unless the user
			enters a search value. If TreeViewEnabled is True but no data is provided to the TreeView control upon request, the action menu
			is also enabled.
			If the control does not have any selections, InputEnabled (or its alias ListViewEnabled) is True, and TreeViewEnabled is False,
			no picker will be displayed since the action menu would only display the "Search for options" item - but it should already
			be obvious to the user that searching is required due to the placeholder displaying "Search.." by default.
			Likewise, if TreeViewEnabled is True and InputEnabled (or its alias ListViewEnabled) is False, and no selections are made,
			the action menu would only display "Show available options". In this case the TreeView will be displayed instead,
			even if UseActionMenu has explicitely been set to True.
			The behaviour described is in place to make sure the action menu is only displayed when it makes sense, since it introduces
			and extra step (click) required by the user to access data.
			* @function UseActionMenu
			* @param {boolean} [val=undefined] - If defined, True enables the action menu, False disables it.
			*/
			public UseActionMenu(val?:boolean):void;
			/**
			* Create instance of WSDropDown control.
			* @function WSDropDown
			* @param {string} [ctlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(ctlId?:string);
			// Functions defined by Fit.Controls.DropDown
			/**
			* Add selection to control.
			* @function AddSelection
			* @param {string} title - Item title.
			* @param {string} value - Item value.
			* @param {boolean} [valid=true] - Flag indicating whether selection is valid or not. Invalid selections are highlighted and
			not included when selections are retrived using Value() function, and not considered when
			IsDirty() is called to determine whether control value has been changed by user.
			GetSelections(true) can be used to retrive all items, including invalid selections.
			*/
			public AddSelection(title:string, value:string, valid?:boolean):void;
			/**
			* Clear text field.
			* @function ClearInput
			*/
			public ClearInput():void;
			/**
			* Clear selections.
			* @function ClearSelections
			*/
			public ClearSelections():void;
			/**
			* Close drop down menu.
			* @function CloseDropDown
			*/
			public CloseDropDown():void;
			/**
			* Get/set value indicating whether boundary/collision detection is enabled or not (off by default).
			This may cause drop down to open upwards if sufficient space is not available below control.
			If control is contained in a scrollable parent, this will be considered the active viewport,
			and as such define the active boundaries - unless relativeToViewport is set to True, in which
			case the actual browser viewport will be used.
			* @function DetectBoundaries
			* @param {boolean} [val=undefined] - If defined, True enables collision detection, False disables it (default).
			* @param {boolean} [relativeToViewport=false] - If defined, True results in viewport being considered the container to which available space is determined.
			This also results in DropDown menu being positioned with position:fixed, allowing it to escape a container
			with overflow (e.g. overflow:auto|hidden|scroll). Be aware though that this does not work reliably in combination
			with CSS animation and CSS transform as it creates a new stacking context to which position:fixed becomes relative.
			A value of False (default) results in available space being determined relative to the boundaries of the
			control's scroll parent. The DropDown menu will stay within its container and not overflow it.
			* @returns boolean
			*/
			public DetectBoundaries(val?:boolean, relativeToViewport?:boolean):boolean;
			/**
			* Get/set max height of drop down - returns object with Value (number) and Unit (string) properties.
			* @function DropDownMaxHeight
			* @param {number} [value=undefined] - If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=undefined] - If defined, max height is updated to specified CSS unit, otherwise px is assumed.
			* @returns Fit.TypeDefs.CssValue
			*/
			public DropDownMaxHeight(value?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get/set max width of drop down - returns object with Value (number) and Unit (string) properties.
			* @function DropDownMaxWidth
			* @param {number} [value=undefined] - If defined, max width is updated to specified value. A value of -1 forces drop down to use control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=undefined] - If defined, max width is updated to specified CSS unit, otherwise px is assumed.
			* @returns Fit.TypeDefs.CssValue
			*/
			public DropDownMaxWidth(value?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get item currently highlighted in picker control.
			Returns an object with Title (string), Value (string),
			and Valid (boolean) properties if found, otherwise Null.
			* @function GetHighlighted
			* @returns Fit.Controls.DropDownTypeDefs.DropDownItem | null
			*/
			public GetHighlighted():Fit.Controls.DropDownTypeDefs.DropDownItem | null;
			/**
			* Get input value.
			* @function GetInputValue
			* @returns string
			*/
			public GetInputValue():string;
			/**
			* Get picker control used to add items to drop down control.
			* @function GetPicker
			* @returns Fit.Controls.PickerBase
			*/
			public GetPicker():Fit.Controls.PickerBase;
			/**
			* Get selected item by value - returns object with Title (string), Value (string), and Valid (boolean) properties if found, otherwise Null is returned.
			* @function GetSelectionByValue
			* @param {string} val - Value of selected item to retrive.
			* @returns Fit.Controls.DropDownTypeDefs.DropDownItem | null
			*/
			public GetSelectionByValue(val:string):Fit.Controls.DropDownTypeDefs.DropDownItem | null;
			/**
			* Get selected items - returned array contain objects with Title (string), Value (string), and Valid (boolean) properties.
			* @function GetSelections
			* @param {boolean} [includeInvalid=false] - Flag indicating whether invalid selection should be included or not.
			* @returns Fit.Controls.DropDownTypeDefs.DropDownItem[]
			*/
			public GetSelections(includeInvalid?:boolean):Fit.Controls.DropDownTypeDefs.DropDownItem[];
			/**
			* Make DropDown highlight first selectable item when opened.
			* @function HighlightFirst
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public HighlightFirst(val?:boolean):boolean;
			/**
			* Get/set value indicating whether input is enabled.
			* @function InputEnabled
			* @param {boolean} [val=undefined] - If defined, True enables input, False disables it.
			* @returns boolean
			*/
			public InputEnabled(val?:boolean):boolean;
			/**
			* Get/set mouse over text shown for invalid selections.
			* @function InvalidSelectionMessage
			* @param {string} [msg=undefined] - If defined, error message for invalid selections are set.
			* @returns string
			*/
			public InvalidSelectionMessage(msg?:string):string;
			/**
			* Get flag indicating whether drop down is open or not.
			* @function IsDropDownOpen
			* @returns boolean
			*/
			public IsDropDownOpen():boolean;
			/**
			* Get/set flag indicating whether control allows for multiple selections.
			* @function MultiSelectionMode
			* @param {boolean} [val=undefined] - If defined, True enables multi selection mode, False disables it.
			* @returns boolean
			*/
			public MultiSelectionMode(val?:boolean):boolean;
			/**
			* Add event handler fired when drop down menu is closed.
			Function receives one argument: Sender (Fit.Controls.DropDown).
			* @function OnClose
			* @param {Fit.Controls.DropDownTypeDefs.InteractionEventHandler<this>} cb - Event handler function.
			*/
			public OnClose(cb:Fit.Controls.DropDownTypeDefs.InteractionEventHandler<this>):void;
			/**
			* Add event handler fired when input value is changed.
			Function receives two arguments:
			Sender (Fit.Controls.DropDown) and Value (string).
			* @function OnInputChanged
			* @param {Fit.Controls.DropDownTypeDefs.InputChangedEventHandler<this>} cb - Event handler function.
			*/
			public OnInputChanged(cb:Fit.Controls.DropDownTypeDefs.InputChangedEventHandler<this>):void;
			/**
			* Add event handler fired when drop down menu is opened.
			Function receives one argument: Sender (Fit.Controls.DropDown).
			* @function OnOpen
			* @param {Fit.Controls.DropDownTypeDefs.InteractionEventHandler<this>} cb - Event handler function.
			*/
			public OnOpen(cb:Fit.Controls.DropDownTypeDefs.InteractionEventHandler<this>):void;
			/**
			* Add event handler fired when text is pasted into input field.
			Function receives two arguments:
			Sender (Fit.Controls.DropDown) and Value (string).
			Return False to cancel event and change, and prevent OnInputChanged from firing.
			* @function OnPaste
			* @param {Fit.Controls.DropDownTypeDefs.PasteEventHandler<this>} cb - Event handler function.
			*/
			public OnPaste(cb:Fit.Controls.DropDownTypeDefs.PasteEventHandler<this>):void;
			/**
			* Open drop down menu.
			* @function OpenDropDown
			*/
			public OpenDropDown():void;
			/**
			* Make DropDown restore scroll position and previously highlighted item when reopened.
			* @function PersistView
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public PersistView(val?:boolean):boolean;
			/**
			* Get/set value used as a placeholder on supported browsers, to indicate expected value or action.
			* @function Placeholder
			* @param {string} [val=undefined] - If defined, value is set as placeholder.
			* @returns string
			*/
			public Placeholder(val?:string):string;
			/**
			* Remove selected item by value.
			* @function RemoveSelection
			* @param {string} value - Value of selected item to remove.
			*/
			public RemoveSelection(value:string):void;
			/**
			* Rename title of selected item by its value.
			* @function RenameSelection
			* @param {string} val - Value of selected item to rename.
			* @param {string} newTitle - New item title.
			*/
			public RenameSelection(val:string, newTitle:string):void;
			/**
			* Clear input and display "Search.." placeholder when control receives focus.
			If SearchModeOnFocus is enabled, InputEnabled will also be enabled. Disabling
			SearchModeOnFocus does not disable InputEnabled.
			* @function SearchModeOnFocus
			* @param {boolean} [val=undefined] - If defined, True enables search mode on focus, False disables it.
			* @returns boolean
			*/
			public SearchModeOnFocus(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control allow user to toggle Selection Mode (Visual or Text).
			* @function SelectionModeToggle
			* @param {boolean} [val=undefined] - If defined, True enables toggle button, False disables it.
			* @returns boolean
			*/
			public SelectionModeToggle(val?:boolean):boolean;
			/**
			* Set value of text field which is automatically cleared the first time control
			receives focus. Notice that this function should be called after AddSelection(..),
			since adding selections causes the value of the text field to be cleared.
			* @function SetInputValue
			* @param {string} val - New value for text field.
			*/
			public SetInputValue(val:string):void;
			/**
			* Set picker control used to add items to drop down control.
			* @function SetPicker
			* @param {Fit.Controls.PickerBase | null} pickerControl - Picker control extending from PickerBase.
			*/
			public SetPicker(pickerControl:Fit.Controls.PickerBase | null):void;
			/**
			* Get/set flag indicating whether to use Text Selection Mode (true) or Visual Selection Mode (false).
			Visual Selection Mode is the default way selected items are displayed, but it may result in control
			changing dimensions as items are added/removed. Text Selection Mode prevents this and gives the
			user a traditional DropDown control instead.
			* @function TextSelectionMode
			* @param {boolean} [val=undefined] - If defined, True enables Text Selection Mode, False disables it (Visual Selection Mode).
			* @param {Fit.Controls.DropDownTypeDefs.SelectionToStringCallback<this>} [cb=undefined] - If defined, function will be called with DropDown being passed as an argument when selection text
			needs to be updated. Function is expected to return a string representation of the selected items.
			* @returns boolean
			*/
			public TextSelectionMode(val?:boolean, cb?:Fit.Controls.DropDownTypeDefs.SelectionToStringCallback<this>):boolean;
			/**
			* Update title of selected items based on data in associated picker control.
			An array of updated items are returned. Each object has the following properties:
			- Title: string (Updated title)
			- Value: string (Unique item value)
			- Exists: boolean (True if item still exists, False if not)
			This is useful if selections are stored in a database, and
			available items may have their titles changed over time. Invoking
			this function will ensure that the selection displayed to the user
			reflects the actual state of data in the picker control. Be aware
			that this function can only update selected items if a picker has been
			associated (see SetPicker(..)), and it contains the data from which
			selected items are to be updated.
			Items that no longer exists in picker's data will not automatically
			be removed.
			* @function UpdateSelected
			* @returns Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem[]
			*/
			public UpdateSelected():Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem[];
			// Functions defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control.
			* @function AddCssClass
			* @param {string} val - CSS class to add.
			*/
			public AddCssClass(val:string):void;
			/**
			* Set callback function used to perform on-the-fly validation against control.
			* @function AddValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Function receiving an instance of the control.
			A value of False or a non-empty string with an
			error message must be returned if value is invalid.
			*/
			public AddValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value, as returned by the Value() function.
			* @function AddValidationRule
			* @param {RegExp} validator - Regular expression to validate value against.
			* @param {string} [errorMessage=undefined] - Optional error message displayed if value validation fails.
			*/
			public AddValidationRule(validator:RegExp, errorMessage?:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This
			comes in handy when programmatically changing a value of a control on behalf
			of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] - If defined, Always Dirty is enabled/disabled.
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed.
			* @function AutoPostBack
			* @param {boolean} [val=undefined] - If defined, True enables auto post back, False disables it.
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value.
			* @function Clear
			*/
			public Clear():void;
			/**
			* Get/set value indicating whether control is enabled or disabled.
			A disabled control's value and state is still included on postback, if part of a form.
			* @function Enabled
			* @param {boolean} [val=undefined] - If defined, True enables control (default), False disables control.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Check whether CSS class is found on DOMElement representing control.
			* @function HasCssClass
			* @param {string} val - CSS class to check for.
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get value indicating whether user has changed control value.
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid.
			Control value is considered invalid if control is required, but no value is set,
			or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Get/set value indicating whether control initially appears as valid, even
			though it is not. It will appear invalid once the user touches the control,
			or when control value is validated using Fit.Controls.ValidateAll(..).
			* @function LazyValidation
			* @param {boolean} [val=undefined] - If defined, Lazy Validation is enabled/disabled.
			* @returns boolean
			*/
			public LazyValidation(val?:boolean):boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus.
			* @function OnBlur
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnBlur(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user.
			* @function OnChange
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnChange(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus.
			* @function OnFocus
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnFocus(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Remove all validation rules.
			* @function RemoveAllValidationRules
			*/
			public RemoveAllValidationRules():void;
			/**
			* Remove CSS class from DOMElement representing control.
			* @function RemoveCssClass
			* @param {string} val - CSS class to remove.
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Remove validation function used to perform on-the-fly validation against control.
			* @function RemoveValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Validation function registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Remove regular expression used to perform on-the-fly validation against control value.
			* @function RemoveValidationRule
			* @param {RegExp} validator - Regular expression registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:RegExp):void;
			/**
			* Get/set value indicating whether control is required to be set.
			* @function Required
			* @param {boolean} [val=undefined] - If defined, control required feature is enabled/disabled.
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple
			controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] - If defined, control scope is updated.
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationCallback
			* @param {Function | null} cb - Function receiving control value - must return True if value is valid, otherwise False.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationCallback(cb:Function | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set regular expression used to perform on-the-fly validation against control value.
			* @function SetValidationExpression
			* @param {RegExp | null} regEx - Regular expression to validate against.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationExpression(regEx:RegExp | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationHandler
			* @param {Function | null} cb - Function receiving an instance of the control and its value.
			An error message string must be returned if value is invalid,
			otherwise Null or an empty string if the value is valid.
			*/
			public SetValidationHandler(cb:Function | null):void;
			/**
			* Get/set value as if it was changed by the user. Contrary to Value(..), this function will never reset the dirty state.
			Restrictions/filtering/modifications may be enforced just as the UI control might do, e.g. prevent the use of certain
			characters, or completely ignore input if not allowed. It may also allow invalid values such as a partially entered date
			value. The intention with UserValue(..) is to mimic the behaviour of what the user can do with the user interface control.
			For picker controls the value format is equivalent to the one dictated by the Value(..) function.
			* @function UserValue
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @returns string
			*/
			public UserValue(val?:string):string;
			/**
			* Get/set control value.
			For controls supporting multiple selections: Set value by providing a string in one the following formats:
			title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
			If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
			Selected items are returned in the first format described, also with reserved characters URIEncoded.
			Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns string
			*/
			public Value(val?:string, preserveDirtyState?:boolean):string;
			/**
			* Get/set value indicating whether control is visible.
			* @function Visible
			* @param {boolean} [val=undefined] - If defined, control visibility is updated.
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.WSDropDownTypeDefs WSDropDownTypeDefs]
		*/
		namespace WSDropDownTypeDefs
		{
			// Functions defined by Fit.Controls.WSDropDownTypeDefs
			/**
			* AutoUpdateSelected callback.
			* @template TypeOfThis
			* @callback AutoUpdateSelectedCallback
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem[]} updatedItems - Updated items.
			*/
			type AutoUpdateSelectedCallback<TypeOfThis> = (sender:TypeOfThis, updatedItems:Fit.Controls.DropDownTypeDefs.UpdatedDropDownItem[]) => void;
			/**
			* Cancelable request event handler.
			* @template TypeOfThis
			* @callback CancelableRequestEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSDropDownTypeDefs.RequestEventArgs<TypeOfThis>} eventArgs - Event arguments.
			*/
			type CancelableRequestEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSDropDownTypeDefs.RequestEventArgs<TypeOfThis>) => void;
			/**
			* Event handler.
			* @template TypeOfThis
			* @callback ClearDataCallback
			* @param {TypeOfThis} sender - Instance of control.
			*/
			type ClearDataCallback<TypeOfThis> = (sender:TypeOfThis) => void;
			/**
			* Aborted request handler.
			* @template TypeOfThis
			* @callback RequestAbortedEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSDropDownTypeDefs.AbortedRequestEventArgs<TypeOfThis>} eventArgs - Event arguments.
			*/
			type RequestAbortedEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSDropDownTypeDefs.AbortedRequestEventArgs<TypeOfThis>) => void;
			/**
			* Response event handler.
			* @template TypeOfThis
			* @callback ResponseEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSDropDownTypeDefs.ResponseEventArgs<TypeOfThis>} eventArgs - Event arguments.
			*/
			type ResponseEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSDropDownTypeDefs.ResponseEventArgs<TypeOfThis>) => void;
			/**
			* Aborted request event arguments.
			* @class [Fit.Controls.WSDropDownTypeDefs.AbortedRequestEventArgs AbortedRequestEventArgs]
			* @template TypeOfThis
			*/
			class AbortedRequestEventArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSDropDownTypeDefs.AbortedRequestEventArgs
				/**
				* JSON data received from web service.
				* @member {null} Data
				*/
				Data:null;
				// Properties defined by Fit.Controls.WSDropDownTypeDefs.RequestEventArgs
				/**
				* Instance of TreeViewNode for which chilren are being requested, Null if root nodes are being requested, or if WSListView triggered request.
				* @member {Fit.Controls.TreeViewNode | null} Node
				*/
				Node:Fit.Controls.TreeViewNode | null;
				/**
				* Instance of picker control causing web service request.
				* @member {Fit.Controls.WSTreeView | Fit.Controls.WSListView} Picker
				*/
				Picker:Fit.Controls.WSTreeView | Fit.Controls.WSListView;
				/**
				* Instance of JsonpRequest or JsonRequest.
				* @member {Fit.Http.JsonpRequest | Fit.Http.JsonRequest} Request
				*/
				Request:Fit.Http.JsonpRequest | Fit.Http.JsonRequest;
				/**
				* Search value if entered by user.
				* @member {string} Search
				*/
				Search:string;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
			/**
			* Request event arguments.
			* @class [Fit.Controls.WSDropDownTypeDefs.RequestEventArgs RequestEventArgs]
			* @template TypeOfThis
			*/
			class RequestEventArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSDropDownTypeDefs.RequestEventArgs
				/**
				* Instance of TreeViewNode for which chilren are being requested, Null if root nodes are being requested, or if WSListView triggered request.
				* @member {Fit.Controls.TreeViewNode | null} Node
				*/
				Node:Fit.Controls.TreeViewNode | null;
				/**
				* Instance of picker control causing web service request.
				* @member {Fit.Controls.WSTreeView | Fit.Controls.WSListView} Picker
				*/
				Picker:Fit.Controls.WSTreeView | Fit.Controls.WSListView;
				/**
				* Instance of JsonpRequest or JsonRequest.
				* @member {Fit.Http.JsonpRequest | Fit.Http.JsonRequest} Request
				*/
				Request:Fit.Http.JsonpRequest | Fit.Http.JsonRequest;
				/**
				* Search value if entered by user.
				* @member {string} Search
				*/
				Search:string;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
			/**
			* Response event arguments.
			* @class [Fit.Controls.WSDropDownTypeDefs.ResponseEventArgs ResponseEventArgs]
			* @template TypeOfThis
			*/
			class ResponseEventArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSDropDownTypeDefs.ResponseEventArgs
				/**
				* JSON data received from web service.
				* @member {Fit.Controls.WSListViewTypeDefs.JsonItem[] | Fit.Controls.WSTreeViewTypeDefs.JsonItem[]} Data
				*/
				Data:Fit.Controls.WSListViewTypeDefs.JsonItem[] | Fit.Controls.WSTreeViewTypeDefs.JsonItem[];
				// Properties defined by Fit.Controls.WSDropDownTypeDefs.RequestEventArgs
				/**
				* Instance of TreeViewNode for which chilren are being requested, Null if root nodes are being requested, or if WSListView triggered request.
				* @member {Fit.Controls.TreeViewNode | null} Node
				*/
				Node:Fit.Controls.TreeViewNode | null;
				/**
				* Instance of picker control causing web service request.
				* @member {Fit.Controls.WSTreeView | Fit.Controls.WSListView} Picker
				*/
				Picker:Fit.Controls.WSTreeView | Fit.Controls.WSListView;
				/**
				* Instance of JsonpRequest or JsonRequest.
				* @member {Fit.Http.JsonpRequest | Fit.Http.JsonRequest} Request
				*/
				Request:Fit.Http.JsonpRequest | Fit.Http.JsonRequest;
				/**
				* Search value if entered by user.
				* @member {string} Search
				*/
				Search:string;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
		}
		/**
		* WebService enabled picker control which allows for entries
		to be selected in the DropDown control.
		* @class [Fit.Controls.WSListView WSListView]
		*/
		class WSListView
		{
			// Functions defined by Fit.Controls.WSListView
			/**
			* Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication.
			Often this argument is simply "callback". Passing Null disables JSONP communication again.
			* @function JsonpCallback
			* @param {string | null} [val=undefined] - If defined, enables JSONP and updates JSONP callback argument.
			* @returns string | null
			*/
			public JsonpCallback(val?:string | null):string | null;
			/**
			* Add event handler fired if data request is canceled.
			Function receives two arguments:
			Sender (Fit.Controls.WSListView) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSListView instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Items: JSON items received from WebService (Null in this particular case).
			* @function OnAbort
			* @param {Fit.Controls.WSListViewTypeDefs.AbortEventHandler<this>} cb - Event handler function.
			*/
			public OnAbort(cb:Fit.Controls.WSListViewTypeDefs.AbortEventHandler<this>):void;
			/**
			* Add event handler fired when ListView has been populated with items.
			Function receives two arguments:
			Sender (Fit.Controls.WSListView) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSListView instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Items: JSON items received from WebService.
			* @function OnPopulated
			* @param {Fit.Controls.WSListViewTypeDefs.DataEventHandler<this>} cb - Event handler function.
			*/
			public OnPopulated(cb:Fit.Controls.WSListViewTypeDefs.DataEventHandler<this>):void;
			/**
			* Add event handler fired when data is being requested.
			Request can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.WSListView) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSListView instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance.
			* @function OnRequest
			* @param {Fit.Controls.WSListViewTypeDefs.CancelableRequestEventHandler<this>} cb - Event handler function.
			*/
			public OnRequest(cb:Fit.Controls.WSListViewTypeDefs.CancelableRequestEventHandler<this>):void;
			/**
			* Add event handler fired when data is received,
			allowing for data transformation to occure before
			ListView is populated. Function receives two arguments:
			Sender (Fit.Controls.WSListView) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSListView instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Items: JSON items received from WebService.
			* @function OnResponse
			* @param {Fit.Controls.WSListViewTypeDefs.DataEventHandler<this>} cb - Event handler function.
			*/
			public OnResponse(cb:Fit.Controls.WSListViewTypeDefs.DataEventHandler<this>):void;
			/**
			* Load/reload data from WebService.
			* @function Reload
			* @param {Fit.Controls.WSListViewTypeDefs.ReloadCallback<this>} [cb=undefined] - If defined, callback function is invoked when data has been loaded
			and populated - takes Sender (Fit.Controls.WSListView) as an argument.
			*/
			public Reload(cb?:Fit.Controls.WSListViewTypeDefs.ReloadCallback<this>):void;
			/**
			* Get/set URL to WebService responsible for providing data to control.
			WebService must deliver data in the following JSON format:
			[
			     { Title: "Test 1", Value: "1001", Selectable: true, Children: [] },
			     { Title: "Test 2", Value: "1002", Selectable: false, Children: [] }
			]
			Only Value is required. Children is a collection of items with the same format as described above.
			Be aware that items are treated as a flat list, even when hierarchically structured using the Children property.
			Items with Selectable set to False will simply be ignored (not shown) while children will still be added.
			* @function Url
			* @param {string} [wsUrl=undefined] - If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetItems).
			* @returns string
			*/
			public Url(wsUrl?:string):string;
			/**
			* Create instance of WSListView control.
			* @function WSListView
			* @param {string} [ctlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(ctlId?:string);
			// Functions defined by Fit.Controls.ListView
			/**
			* Add item to ListView.
			* @function AddItem
			* @param {string} title - Item title.
			* @param {string} value - Item value.
			*/
			public AddItem(title:string, value:string):void;
			/**
			* Get item by value - returns object with Title (string) and Value (string) properties if found, otherwise Null.
			* @function GetItem
			* @param {string} value - Value of item to retrieve.
			* @returns Fit.Controls.ListViewTypeDefs.ListViewItem | null
			*/
			public GetItem(value:string):Fit.Controls.ListViewTypeDefs.ListViewItem | null;
			/**
			* Get all items - returns array containing objects with Title (string) and Value (string) properties.
			* @function GetItems
			* @returns Fit.Controls.ListViewTypeDefs.ListViewItem[]
			*/
			public GetItems():Fit.Controls.ListViewTypeDefs.ListViewItem[];
			/**
			* Returns value indicating whether control contains item with specified value.
			* @function HasItem
			* @param {string} value - Value of item to check for.
			* @returns boolean
			*/
			public HasItem(value:string):boolean;
			/**
			* Register event handler fired when item is being selected.
			Selection can be canceled by returning False.
			The following arguments are passed to event handler function:
			Sender (ListView) and Item (with Title (string) and Value (string) properties).
			* @function OnSelect
			* @param {Fit.Controls.ListViewTypeDefs.OnSelectEventHandler<this>} cb - Event handler function.
			*/
			public OnSelect(cb:Fit.Controls.ListViewTypeDefs.OnSelectEventHandler<this>):void;
			/**
			* Register event handler fired when item is selected.
			The following arguments are passed to event handler function:
			Sender (ListView) and Item (with Title (string) and Value (string) properties).
			* @function OnSelected
			* @param {Fit.Controls.ListViewTypeDefs.OnSelectedEventHandler<this>} cb - Event handler function.
			*/
			public OnSelected(cb:Fit.Controls.ListViewTypeDefs.OnSelectedEventHandler<this>):void;
			/**
			* Remove item from ListView.
			* @function RemoveItem
			* @param {string} value - Value of item to remove.
			*/
			public RemoveItem(value:string):void;
			/**
			* Remove all items from ListView.
			* @function RemoveItems
			*/
			public RemoveItems():void;
			// Functions defined by Fit.Controls.PickerBase
			/**
			* Overridden by control developers (required).
			Destroys control to free up memory.
			Make sure to call Destroy() on PickerBase which can be done like so:
			this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
			{
			     // Add control specific logic here
			     base(); // Call Destroy on PickerBase
			});.
			* @function Destroy
			*/
			public Destroy():void;
			/**
			* Overridden by control developers (required).
			Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Overridden by control developers (optional).
			Host control or external code may invoke this function to obtain the currently
			highlighted item in the picker control.
			Function returns Null when not implemented or when no item is highlighted. If found,
			an object with the following signature is returned: { Title: string, Value: string }.
			* @function GetHighlighted
			* @returns Fit.Controls.PickerBaseTypeDefs.Item | null
			*/
			public GetHighlighted():Fit.Controls.PickerBaseTypeDefs.Item | null;
			/**
			* Overridden by control developers (optional).
			Host control may invoke this function, for instance to update the title of selected items,
			to make sure these properly reflect the state of data displayed in the picker.
			Function returns Null when not implemented or when an item is not found. If found, an object
			with the following signature is returned: { Title: string, Value: string }.
			* @function GetItemByValue
			* @param {string} val - Value of item to retrieve.
			* @returns Fit.Controls.PickerBaseTypeDefs.Item | null
			*/
			public GetItemByValue(val:string):Fit.Controls.PickerBaseTypeDefs.Item | null;
			/**
			* Overridden by control developers (optional).
			Host control dispatches keyboard events to this function to allow
			picker control to handle keyboard navigation with keys such as
			arrow up/down/left/right, enter, space, etc.
			Picker may return False to prevent host control from reacting to given event.
			* @function HandleEvent
			* @param {Event} [e=undefined] - Keyboard event to process.
			*/
			public HandleEvent(e?:Event):void;
			/**
			* Overridden by control developers (optional).
			This function can be used to make the picker control automatically highlight the first item.
			* @function HighlightFirst
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public HighlightFirst(val?:boolean):boolean;
			/**
			* Get/set max height of control - returns object with Value (number) and Unit (string) properties.
			* @function MaxHeight
			* @param {number} [value=undefined] - If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=undefined] - If defined, max height is updated to specified CSS unit, otherwise px is assumed.
			* @returns Fit.TypeDefs.CssValue
			*/
			public MaxHeight(value?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Register OnFocusIn event handler which is invoked when picker gains focus.
			* @function OnFocusIn
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnFocusIn(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register OnFocusOut event handler which is invoked when picker loses focus.
			* @function OnFocusOut
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnFocusOut(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when picker control is hidden in host control.
			The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnHide
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function.
			*/
			public OnHide(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when item selection is changed.
			This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode,
			where an existing selected item is deselected, followed by selection of new item.
			The following arguments are passed to event handler function:
			Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanged
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionChangedEventHandler<this>} cb - Event handler function.
			*/
			public OnItemSelectionChanged(cb:Fit.Controls.PickerBaseTypeDefs.SelectionChangedEventHandler<this>):void;
			/**
			* Register event handler fired when item selection is changing.
			Selection can be canceled by returning False.
			The following arguments are passed to event handler function:
			Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanging
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionChangingEventHandler<this>} cb - Event handler function.
			*/
			public OnItemSelectionChanging(cb:Fit.Controls.PickerBaseTypeDefs.SelectionChangingEventHandler<this>):void;
			/**
			* Register event handler invoked when a series of related item changes are completed.
			* @function OnItemSelectionComplete
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnItemSelectionComplete(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when picker control is shown in host control.
			The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnShow
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function.
			*/
			public OnShow(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Overridden by control developers (optional).
			This function can be used to tell the picker control to persist (remember) its current state between interactions.
			For instance a TreeView control would remembers its scroll position and highlighted node, while a calendar would
			remember the previously selected year and month.
			* @function PersistView
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public PersistView(val?:boolean):boolean;
			/**
			* Overridden by control developers (optional).
			Host control may invoke this function to reveal a selected item in
			the picker control. Often this means having the item scrolled into view.
			* @function RevealItemInView
			* @param {string} val - Value of item to reveal in view.
			*/
			public RevealItemInView(val:string):void;
			/**
			* Overridden by control developers (optional).
			Host control invokes this function when picker is assigned to host control, providing an array
			of items already selected. An item is an object with a Title (string) and Value (string) property set.
			If picker defines preselected items, firing OnItemSelectionChanged
			for these items, will update the host control appropriately.
			* @function SetSelections
			* @param {Fit.Controls.PickerBaseTypeDefs.Item[]} items - Array containing selected items: {Title:string, Value:string}.
			*/
			public SetSelections(items:Fit.Controls.PickerBaseTypeDefs.Item[]):void;
			/**
			* Overridden by control developers (optional).
			Host control invokes this function when an item's selection state is changed from host control.
			Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged,
			as demonstrated below, if the picker control contains the given item.
			
			var item = getItem(value);
			if (item !== null)
			{
			     if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected, programmaticallyChanged) === false)
			         return false;
			
			     item.SetSelected(selected);
			     this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected, programmaticallyChanged);
			}
			
			Both events are fired by passing the given item's title, value, and current selection state.
			Be aware that host control may pass information about items not found in picker, e.g. when pasting
			items which may turn out not to be valid selections.
			Returning False from UpdateItemSelection will cancel the change.
			* @function UpdateItemSelection
			* @param {string} value - Item value.
			* @param {boolean} selected - True if item was selected, False if item was deselected.
			* @param {boolean} programmaticallyChanged - True if item was selected programmatically (not by user interaction), False otherwise.
			*/
			public UpdateItemSelection(value:string, selected:boolean, programmaticallyChanged:boolean):void;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.WSListViewTypeDefs WSListViewTypeDefs]
		*/
		namespace WSListViewTypeDefs
		{
			// Functions defined by Fit.Controls.WSListViewTypeDefs
			/**
			* Abort event handler.
			* @template TypeOfThis
			* @callback AbortEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSListViewTypeDefs.AbortHandlerEventArgs<TypeOfThis>} eventArgs - Event arguments.
			*/
			type AbortEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSListViewTypeDefs.AbortHandlerEventArgs<TypeOfThis>) => void;
			/**
			* Request event handler.
			* @template TypeOfThis
			* @callback CancelableRequestEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSListViewTypeDefs.EventHandlerArgs<TypeOfThis>} eventArgs - Event arguments.
			* @returns boolean | void
			*/
			type CancelableRequestEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSListViewTypeDefs.EventHandlerArgs<TypeOfThis>) => boolean | void;
			/**
			* Response event handler.
			* @template TypeOfThis
			* @callback DataEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSListViewTypeDefs.DataHandlerEventArgs<TypeOfThis>} eventArgs - Event arguments.
			*/
			type DataEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSListViewTypeDefs.DataHandlerEventArgs<TypeOfThis>) => void;
			/**
			* Reload callback.
			* @template TypeOfThis
			* @callback ReloadCallback
			* @param {TypeOfThis} sender - Instance of control.
			*/
			type ReloadCallback<TypeOfThis> = (sender:TypeOfThis) => void;
			/**
			* Abort event handler arguments.
			* @class [Fit.Controls.WSListViewTypeDefs.AbortHandlerEventArgs AbortHandlerEventArgs]
			* @template TypeOfThis
			*/
			class AbortHandlerEventArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSListViewTypeDefs.AbortHandlerEventArgs
				/**
				* JSON list items.
				* @member {null} Items
				*/
				Items:null;
				// Properties defined by Fit.Controls.WSListViewTypeDefs.EventHandlerArgs
				/**
				* Instance of JsonRequest or JsonpRequest.
				* @member {Fit.Http.JsonRequest | Fit.Http.JsonpRequest} Request
				*/
				Request:Fit.Http.JsonRequest | Fit.Http.JsonpRequest;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
			/**
			* Data event handler arguments.
			* @class [Fit.Controls.WSListViewTypeDefs.DataHandlerEventArgs DataHandlerEventArgs]
			* @template TypeOfThis
			*/
			class DataHandlerEventArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSListViewTypeDefs.DataHandlerEventArgs
				/**
				* JSON list items.
				* @member {Fit.Controls.WSListViewTypeDefs.JsonItem[]} Items
				*/
				Items:Fit.Controls.WSListViewTypeDefs.JsonItem[];
				// Properties defined by Fit.Controls.WSListViewTypeDefs.EventHandlerArgs
				/**
				* Instance of JsonRequest or JsonpRequest.
				* @member {Fit.Http.JsonRequest | Fit.Http.JsonpRequest} Request
				*/
				Request:Fit.Http.JsonRequest | Fit.Http.JsonpRequest;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
			/**
			* Event handler arguments.
			* @class [Fit.Controls.WSListViewTypeDefs.EventHandlerArgs EventHandlerArgs]
			* @template TypeOfThis
			*/
			class EventHandlerArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSListViewTypeDefs.EventHandlerArgs
				/**
				* Instance of JsonRequest or JsonpRequest.
				* @member {Fit.Http.JsonRequest | Fit.Http.JsonpRequest} Request
				*/
				Request:Fit.Http.JsonRequest | Fit.Http.JsonpRequest;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
			/**
			* JSON list item.
			* @class [Fit.Controls.WSListViewTypeDefs.JsonItem JsonItem]
			*/
			class JsonItem
			{
				// Properties defined by Fit.Controls.WSListViewTypeDefs.JsonItem
				/**
				* Value indicating whether item can be selected or not - selectable by default.
				* @member {boolean} [Selectable=undefined]
				*/
				Selectable?:boolean;
				/**
				* Title - using Value if not defined.
				* @member {string} [Title=undefined]
				*/
				Title?:string;
				/**
				* Unique value.
				* @member {string} Value
				*/
				Value:string;
			}
		}
		/**
		* TreeView control allowing data from a
		WebService to be listed in a structured manner.
		Extending from Fit.Controls.TreeView.
		
		Notice: WSTreeView works a bit differently from TreeView.
		Nodes are loaded on-demand, meaning when Selected(..) or Value(..)
		is called to set selections, nodes not loaded yet are stored internally as
		preselections. Nodes not loaded yet will not have OnSelect, OnSelected,
		and any associated events fired, until they are actually loaded.
		But they will be returned when Selected() or Value() is called (getters).
		OnChange, however, will always be fired when selections are changed,
		no matter if nodes are loaded or not.
		* @class [Fit.Controls.WSTreeView WSTreeView]
		*/
		class WSTreeView
		{
			// Functions defined by Fit.Controls.WSTreeView
			/**
			* Ensure all data from WebService.
			Contrary to Reload(..), this function does not clear selected
			values, or remove nodes already loaded - it merely loads data
			not already loaded.
			* @function EnsureData
			* @param {Fit.Controls.WSTreeViewTypeDefs.ReloadCallback<this>} [callback=undefined] - If defined, callback function is invoked when all nodes have been loaded
			and populated - takes Sender (Fit.Controls.WSTreeView) as an argument.
			*/
			public EnsureData(callback?:Fit.Controls.WSTreeViewTypeDefs.ReloadCallback<this>):void;
			/**
			* Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication.
			Often this argument is simply "callback". Passing Null disables JSONP communication again.
			* @function JsonpCallback
			* @param {string | null} [val=undefined] - If defined, enables JSONP and updates JSONP callback argument.
			* @returns string | null
			*/
			public JsonpCallback(val?:string | null):string | null;
			/**
			* Add event handler fired if data request is canceled.
			Function receives two arguments:
			Sender (Fit.Controls.WSTreeView) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSTreeView instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Node: Fit.Controls.TreeViewNode instance to be populated
			- Children: JSON nodes received from WebService (Null in this particular case).
			* @function OnAbort
			* @param {Fit.Controls.WSTreeViewTypeDefs.AbortEventHandler<this>} cb - Event handler function.
			*/
			public OnAbort(cb:Fit.Controls.WSTreeViewTypeDefs.AbortEventHandler<this>):void;
			/**
			* Add event handler fired when TreeView has been populated with nodes.
			Node is not populated and event is not fired though if node is disposed
			or detached from TreeView while data is loading from WebService.
			Function receives two arguments:
			Sender (Fit.Controls.WSTreeView) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSTreeView instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Node: Fit.Controls.TreeViewNode instance now populated with children
			- Children: JSON nodes received from WebService.
			* @function OnPopulated
			* @param {Fit.Controls.WSTreeViewTypeDefs.DataEventHandler<this>} cb - Event handler function.
			*/
			public OnPopulated(cb:Fit.Controls.WSTreeViewTypeDefs.DataEventHandler<this>):void;
			/**
			* Add event handler fired when data is being requested.
			Request can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.WSTreeView) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSTreeView instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Node: Fit.Controls.TreeViewNode instance.
			* @function OnRequest
			* @param {Fit.Controls.WSTreeViewTypeDefs.CancelableRequestEventHandler<this>} cb - Event handler function.
			*/
			public OnRequest(cb:Fit.Controls.WSTreeViewTypeDefs.CancelableRequestEventHandler<this>):void;
			/**
			* Add event handler fired when data is received,
			allowing for data transformation to occure before
			TreeView is populated. Function receives two arguments:
			Sender (Fit.Controls.WSTreeView) and EventArgs object.
			EventArgs object contains the following properties:
			- Sender: Fit.Controls.WSTreeView instance
			- Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			- Node: Fit.Controls.TreeViewNode instance to be populated
			- Children: JSON nodes received from WebService.
			* @function OnResponse
			* @param {Fit.Controls.WSTreeViewTypeDefs.DataEventHandler<this>} cb - Event handler function.
			*/
			public OnResponse(cb:Fit.Controls.WSTreeViewTypeDefs.DataEventHandler<this>):void;
			/**
			* Reload data from WebService.
			* @function Reload
			* @param {boolean} [keepSelections=undefined] - If defined, True will preserve selections, False will remove them (default).
			* @param {Fit.Controls.WSTreeViewTypeDefs.ReloadCallback<this>} [cb=undefined] - If defined, callback function is invoked when root nodes have been loaded
			and populated - takes Sender (Fit.Controls.WSTreeView) as an argument.
			*/
			public Reload(keepSelections?:boolean, cb?:Fit.Controls.WSTreeViewTypeDefs.ReloadCallback<this>):void;
			/**
			* Get/set flag indicating whether WebService returns the complete hierarchy when
			Select All is triggered (Instantly), or loads data for each level individually
			when TreeView automatically expands all nodes (Progressively - chain loading).
			* @function SelectAllMode
			* @param {Fit.Controls.WSTreeViewSelectAllMode | "Instantly" | "Progressively"} [val=undefined] - If defined, behaviour is set to specified mode.
			* @returns Fit.Controls.WSTreeViewSelectAllMode | "Instantly" | "Progressively"
			*/
			public SelectAllMode(val?:Fit.Controls.WSTreeViewSelectAllMode | "Instantly" | "Progressively"):Fit.Controls.WSTreeViewSelectAllMode | "Instantly" | "Progressively";
			/**
			* Fit.Controls.TreeView.Selected override:
			Get/set selected nodes.
			Notice for getter: Nodes not loaded yet (preselections) are NOT valid nodes associated with TreeView.
			Therefore most functions will not work. Preselection nodes can be identified by their title:
			if (node.Title() === "[pre-selection]") console.log("This is a preselection node");
			Only the following getter functions can be used for preselection nodes:
			node.Title(), node.Value(), node.Selected().
			* @function Selected
			* @param {Fit.Controls.TreeViewNode[]} [val=undefined] - If defined, provided nodes are selected.
			* @returns Fit.Controls.TreeViewNode[]
			*/
			public Selected(val?:Fit.Controls.TreeViewNode[]):Fit.Controls.TreeViewNode[];
			/**
			* Get/set URL to WebService responsible for providing data to TreeView.
			WebService must deliver data in the following JSON format:
			[
			     { Title: "Test 1", Value: "1001", Selectable: true, Selected: true, Children: [] },
			     { Title: "Test 2", Value: "1002", Selectable: false, Selected: false, Children: [] }
			]
			Only Value is required. Children is a collection of nodes with the same format as described above.
			HasChildren:boolean may be set to indicate that children are available server side and that WebService
			should be called to load these children when the given node is expanded.
			Additionally Expanded:boolean can be set to initially display node as expanded.
			* @function Url
			* @param {string} [wsUrl=undefined] - If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetNodes).
			* @returns string
			*/
			public Url(wsUrl?:string):string;
			/**
			* Create instance of WSTreeView control.
			* @function WSTreeView
			* @param {string} [ctlId=undefined] - Unique control ID that can be used to access control using Fit.Controls.Find(..).
			*/
			constructor(ctlId?:string);
			// Functions defined by Fit.Controls.TreeView
			/**
			* Add node to TreeView.
			* @function AddChild
			* @param {Fit.Controls.TreeViewNode} node - Node to add.
			* @param {number} [atIndex=undefined] - Optional index at which node is added.
			*/
			public AddChild(node:Fit.Controls.TreeViewNode, atIndex?:number):void;
			/**
			* Get/set value indicating whether user is allowed to deselect nodes.
			By default the user is allowed to deselect nodes.
			* @function AllowDeselect
			* @param {boolean} [val=undefined] - If defined, changes behaviour to specified value.
			* @returns boolean
			*/
			public AllowDeselect(val?:boolean):boolean;
			/**
			* Fit.Controls.ControlBase.Clear override:
			Clear control value.
			Override allows for non-selectable nodes to keep their selection state.
			This is useful if TreeView has been configured to preselect some non-selectable
			nodes, hence preventing the user from removing these selections. In that case the
			desired functionality of the Clear function could be to preserve these preselections.
			If called with no arguments, all selections are cleared.
			* @function Clear
			* @param {boolean} [preserveNonSelectable=false] - True causes selection state of non-selectable nodes to be preserved, False do not.
			*/
			public Clear(preserveNonSelectable?:boolean):void;
			/**
			* Collapse all nodes, optionally to a maximum depth.
			* @function CollapseAll
			* @param {number} [maxDepth=undefined] - Optional maximum depth to collapse nodes.
			*/
			public CollapseAll(maxDepth?:number):void;
			/**
			* Get/set instance of ContextMenu control triggered when right clicking nodes in TreeView.
			* @function ContextMenu
			* @param {Fit.Controls.ContextMenu | null} contextMenu - If defined, assignes ContextMenu control to TreeView.
			* @returns Fit.Controls.ContextMenu
			*/
			public ContextMenu(contextMenu:Fit.Controls.ContextMenu | null):Fit.Controls.ContextMenu;
			/**
			* Expand all nodes, optionally to a maximum depth.
			* @function ExpandAll
			* @param {number} [maxDepth=undefined] - Optional maximum depth to expand nodes.
			*/
			public ExpandAll(maxDepth?:number):void;
			/**
			* Get active (highlighted or focused) node - returns Null if no node is currently active.
			* @function GetActiveNode
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetActiveNode():Fit.Controls.TreeViewNode | null;
			/**
			* Get all nodes across all children and their children, in a flat structure.
			* @function GetAllNodes
			* @returns Fit.Controls.TreeViewNode[]
			*/
			public GetAllNodes():Fit.Controls.TreeViewNode[];
			/**
			* Get node by value - returns Null if not found.
			* @function GetChild
			* @param {string} val - Node value.
			* @param {boolean} [recursive=false] - If defined, True enables recursive search.
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetChild(val:string, recursive?:boolean):Fit.Controls.TreeViewNode | null;
			/**
			* Get all children.
			* @function GetChildren
			* @returns Fit.Controls.TreeViewNode[]
			*/
			public GetChildren():Fit.Controls.TreeViewNode[];
			/**
			* Get node above specified node - returns Null if no node is above the specified one.
			* @function GetNodeAbove
			* @param {Fit.Controls.TreeViewNode} node - Node to get node above.
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetNodeAbove(node:Fit.Controls.TreeViewNode):Fit.Controls.TreeViewNode | null;
			/**
			* Get node below specified node - returns Null if no node is below the specified one.
			* @function GetNodeBelow
			* @param {Fit.Controls.TreeViewNode} node - Node to get node below.
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetNodeBelow(node:Fit.Controls.TreeViewNode):Fit.Controls.TreeViewNode | null;
			/**
			* Get node currently having focus - returns Null if no node has focus.
			* @function GetNodeFocused
			* @returns Fit.Controls.TreeViewNode | null
			*/
			public GetNodeFocused():Fit.Controls.TreeViewNode | null;
			/**
			* Get/set value indicating whether keyboard navigation is enabled.
			* @function KeyboardNavigation
			* @param {boolean} [val=undefined] - If defined, True enables keyboard navigation, False disables it.
			* @returns boolean
			*/
			public KeyboardNavigation(val?:boolean):boolean;
			/**
			* Get/set value indicating whether helper lines are shown.
			Notice that helper lines cause node items to obtain a fixed
			line height of 20px, making it unsuitable for large fonts.
			* @function Lines
			* @param {boolean} [val=undefined] - If defined, True enables helper lines, False disables them.
			* @returns boolean
			*/
			public Lines(val?:boolean):boolean;
			/**
			* Add event handler fired before context menu is shown.
			This event can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
			Use Sender.ContextMenu() to obtain a reference to the context menu.
			* @function OnContextMenu
			* @param {Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>} cb - Event handler function.
			*/
			public OnContextMenu(cb:Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>):void;
			/**
			* Add event handler fired when node is being selected or deselected.
			Selection can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
			* @function OnSelect
			* @param {Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>} cb - Event handler function.
			*/
			public OnSelect(cb:Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>):void;
			/**
			* Add event handler fired when Select All is used for a given node.
			This event can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.TreeView) and EventArgs object.
			EventArgs object contains the following properties:
			- Node: Fit.Controls.TreeViewNode instance - Null if Select All was triggered for root nodes (all nodes)
			- Selected: Boolean value indicating new selection state.
			* @function OnSelectAll
			* @param {Fit.Controls.TreeViewTypeDefs.CancelableSelectionEventHandler<this>} cb - Event handler function.
			*/
			public OnSelectAll(cb:Fit.Controls.TreeViewTypeDefs.CancelableSelectionEventHandler<this>):void;
			/**
			* Add event handler fired when Select All operation has completed.
			Function receives two arguments:
			Sender (Fit.Controls.TreeView) and EventArgs object.
			EventArgs object contains the following properties:
			- Node: Fit.Controls.TreeViewNode instance - Null if Select All was triggered for root nodes (all nodes)
			- Selected: Boolean value indicating new selection state.
			* @function OnSelectAllComplete
			* @param {Fit.Controls.TreeViewTypeDefs.SelectionCompleteEventHandler<this>} cb - Event handler function.
			*/
			public OnSelectAllComplete(cb:Fit.Controls.TreeViewTypeDefs.SelectionCompleteEventHandler<this>):void;
			/**
			* Add event handler fired when node is selected or deselected.
			Selection can not be canceled. Function receives two arguments:
			Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
			* @function OnSelected
			* @param {Fit.Controls.TreeViewTypeDefs.NodeEventHandler<this>} cb - Event handler function.
			*/
			public OnSelected(cb:Fit.Controls.TreeViewTypeDefs.NodeEventHandler<this>):void;
			/**
			* Add event handler fired when node is being expanded or collapsed.
			Toggle can be canceled by returning False.
			Function receives two arguments:
			Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
			* @function OnToggle
			* @param {Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>} cb - Event handler function.
			*/
			public OnToggle(cb:Fit.Controls.TreeViewTypeDefs.CancelableNodeEventHandler<this>):void;
			/**
			* Add event handler fired when node is expanded or collapsed.
			Toggle can not be canceled. Function receives two arguments:
			Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeViewNode).
			* @function OnToggled
			* @param {Fit.Controls.TreeViewTypeDefs.NodeEventHandler<this>} cb - Event handler function.
			*/
			public OnToggled(cb:Fit.Controls.TreeViewTypeDefs.NodeEventHandler<this>):void;
			/**
			* Remove all nodes contained in TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes.
			* @function RemoveAllChildren
			* @param {boolean} [dispose=false] - Set True to dispose nodes.
			*/
			public RemoveAllChildren(dispose?:boolean):void;
			/**
			* Remove node from TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes.
			* @function RemoveChild
			* @param {Fit.Controls.TreeViewNode} node - Node to remove.
			*/
			public RemoveChild(node:Fit.Controls.TreeViewNode):void;
			/**
			* Get/set value indicating whether user can change selection state of nodes.
			This affects all contained nodes. To configure nodes
			individually, use Selectable(..) function on node instances.
			* @function Selectable
			* @param {boolean} [val=undefined] - If defined, True enables node selection, False disables it.
			* @param {boolean} [multi=false] - If defined, True enables node multi selection, False disables it.
			* @returns boolean
			*/
			public Selectable(val?:boolean, multi?:boolean):boolean;
			/**
			* Select all nodes.
			* @function SelectAll
			* @param {boolean} selected - Value indicating whether to select or deselect nodes.
			* @param {Fit.Controls.TreeViewNode} [selectAllNode=undefined] - If specified, children under given node is selected/deselected recursively.
			If not specified, all nodes contained in TreeView will be selected/deselected.
			*/
			public SelectAll(selected:boolean, selectAllNode?:Fit.Controls.TreeViewNode):void;
			/**
			* Get/set selected nodes.
			* @function Selected
			* @param {Fit.Controls.TreeViewNode[]} [val=undefined] - If defined, provided nodes are selected.
			* @returns Fit.Controls.TreeViewNode[]
			*/
			public Selected(val?:Fit.Controls.TreeViewNode[]):Fit.Controls.TreeViewNode[];
			/**
			* Set active (highlighted or focused) node.
			* @function SetActiveNode
			* @param {Fit.Controls.TreeViewNode} node - Node to set active in TreeView.
			*/
			public SetActiveNode(node:Fit.Controls.TreeViewNode):void;
			/**
			* Get/set value indicating whether Word Wrapping is enabled.
			* @function WordWrap
			* @param {boolean} [val=undefined] - If defined, True enables Word Wrapping, False disables it.
			* @returns boolean
			*/
			public WordWrap(val?:boolean):boolean;
			// Functions defined by Fit.Controls.PickerBase
			/**
			* Overridden by control developers (required).
			Destroys control to free up memory.
			Make sure to call Destroy() on PickerBase which can be done like so:
			this.Destroy = Fit.Core.CreateOverride(this.Destroy, function()
			{
			     // Add control specific logic here
			     base(); // Call Destroy on PickerBase
			});.
			* @function Destroy
			*/
			public Destroy():void;
			/**
			* Overridden by control developers (required).
			Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Overridden by control developers (optional).
			Host control or external code may invoke this function to obtain the currently
			highlighted item in the picker control.
			Function returns Null when not implemented or when no item is highlighted. If found,
			an object with the following signature is returned: { Title: string, Value: string }.
			* @function GetHighlighted
			* @returns Fit.Controls.PickerBaseTypeDefs.Item | null
			*/
			public GetHighlighted():Fit.Controls.PickerBaseTypeDefs.Item | null;
			/**
			* Overridden by control developers (optional).
			Host control may invoke this function, for instance to update the title of selected items,
			to make sure these properly reflect the state of data displayed in the picker.
			Function returns Null when not implemented or when an item is not found. If found, an object
			with the following signature is returned: { Title: string, Value: string }.
			* @function GetItemByValue
			* @param {string} val - Value of item to retrieve.
			* @returns Fit.Controls.PickerBaseTypeDefs.Item | null
			*/
			public GetItemByValue(val:string):Fit.Controls.PickerBaseTypeDefs.Item | null;
			/**
			* Overridden by control developers (optional).
			Host control dispatches keyboard events to this function to allow
			picker control to handle keyboard navigation with keys such as
			arrow up/down/left/right, enter, space, etc.
			Picker may return False to prevent host control from reacting to given event.
			* @function HandleEvent
			* @param {Event} [e=undefined] - Keyboard event to process.
			*/
			public HandleEvent(e?:Event):void;
			/**
			* Overridden by control developers (optional).
			This function can be used to make the picker control automatically highlight the first item.
			* @function HighlightFirst
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public HighlightFirst(val?:boolean):boolean;
			/**
			* Get/set max height of control - returns object with Value (number) and Unit (string) properties.
			* @function MaxHeight
			* @param {number} [value=undefined] - If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=undefined] - If defined, max height is updated to specified CSS unit, otherwise px is assumed.
			* @returns Fit.TypeDefs.CssValue
			*/
			public MaxHeight(value?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Register OnFocusIn event handler which is invoked when picker gains focus.
			* @function OnFocusIn
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnFocusIn(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register OnFocusOut event handler which is invoked when picker loses focus.
			* @function OnFocusOut
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnFocusOut(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when picker control is hidden in host control.
			The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnHide
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function.
			*/
			public OnHide(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when item selection is changed.
			This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode,
			where an existing selected item is deselected, followed by selection of new item.
			The following arguments are passed to event handler function:
			Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanged
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionChangedEventHandler<this>} cb - Event handler function.
			*/
			public OnItemSelectionChanged(cb:Fit.Controls.PickerBaseTypeDefs.SelectionChangedEventHandler<this>):void;
			/**
			* Register event handler fired when item selection is changing.
			Selection can be canceled by returning False.
			The following arguments are passed to event handler function:
			Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanging
			* @param {Fit.Controls.PickerBaseTypeDefs.SelectionChangingEventHandler<this>} cb - Event handler function.
			*/
			public OnItemSelectionChanging(cb:Fit.Controls.PickerBaseTypeDefs.SelectionChangingEventHandler<this>):void;
			/**
			* Register event handler invoked when a series of related item changes are completed.
			* @function OnItemSelectionComplete
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function which accepts Sender (PickerBase).
			*/
			public OnItemSelectionComplete(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Register event handler fired when picker control is shown in host control.
			The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnShow
			* @param {Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>} cb - Event handler function.
			*/
			public OnShow(cb:Fit.Controls.PickerBaseTypeDefs.BaseEventHandler<this>):void;
			/**
			* Overridden by control developers (optional).
			This function can be used to tell the picker control to persist (remember) its current state between interactions.
			For instance a TreeView control would remembers its scroll position and highlighted node, while a calendar would
			remember the previously selected year and month.
			* @function PersistView
			* @param {boolean} [val=undefined] - If set, True enables feature, False disables it (default).
			* @returns boolean
			*/
			public PersistView(val?:boolean):boolean;
			/**
			* Overridden by control developers (optional).
			Host control may invoke this function to reveal a selected item in
			the picker control. Often this means having the item scrolled into view.
			* @function RevealItemInView
			* @param {string} val - Value of item to reveal in view.
			*/
			public RevealItemInView(val:string):void;
			/**
			* Overridden by control developers (optional).
			Host control invokes this function when picker is assigned to host control, providing an array
			of items already selected. An item is an object with a Title (string) and Value (string) property set.
			If picker defines preselected items, firing OnItemSelectionChanged
			for these items, will update the host control appropriately.
			* @function SetSelections
			* @param {Fit.Controls.PickerBaseTypeDefs.Item[]} items - Array containing selected items: {Title:string, Value:string}.
			*/
			public SetSelections(items:Fit.Controls.PickerBaseTypeDefs.Item[]):void;
			/**
			* Overridden by control developers (optional).
			Host control invokes this function when an item's selection state is changed from host control.
			Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged,
			as demonstrated below, if the picker control contains the given item.
			
			var item = getItem(value);
			if (item !== null)
			{
			     if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected, programmaticallyChanged) === false)
			         return false;
			
			     item.SetSelected(selected);
			     this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected, programmaticallyChanged);
			}
			
			Both events are fired by passing the given item's title, value, and current selection state.
			Be aware that host control may pass information about items not found in picker, e.g. when pasting
			items which may turn out not to be valid selections.
			Returning False from UpdateItemSelection will cancel the change.
			* @function UpdateItemSelection
			* @param {string} value - Item value.
			* @param {boolean} selected - True if item was selected, False if item was deselected.
			* @param {boolean} programmaticallyChanged - True if item was selected programmatically (not by user interaction), False otherwise.
			*/
			public UpdateItemSelection(value:string, selected:boolean, programmaticallyChanged:boolean):void;
			// Functions defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control.
			* @function AddCssClass
			* @param {string} val - CSS class to add.
			*/
			public AddCssClass(val:string):void;
			/**
			* Set callback function used to perform on-the-fly validation against control.
			* @function AddValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Function receiving an instance of the control.
			A value of False or a non-empty string with an
			error message must be returned if value is invalid.
			*/
			public AddValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value, as returned by the Value() function.
			* @function AddValidationRule
			* @param {RegExp} validator - Regular expression to validate value against.
			* @param {string} [errorMessage=undefined] - Optional error message displayed if value validation fails.
			*/
			public AddValidationRule(validator:RegExp, errorMessage?:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This
			comes in handy when programmatically changing a value of a control on behalf
			of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] - If defined, Always Dirty is enabled/disabled.
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed.
			* @function AutoPostBack
			* @param {boolean} [val=undefined] - If defined, True enables auto post back, False disables it.
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value.
			* @function Clear
			*/
			public Clear():void;
			/**
			* Get/set value indicating whether control is enabled or disabled.
			A disabled control's value and state is still included on postback, if part of a form.
			* @function Enabled
			* @param {boolean} [val=undefined] - If defined, True enables control (default), False disables control.
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus.
			* @function Focused
			* @param {boolean} [value=undefined] - If defined, True assigns focus, False removes focus (blur).
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Check whether CSS class is found on DOMElement representing control.
			* @function HasCssClass
			* @param {string} val - CSS class to check for.
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties.
			* @function Height
			* @param {number} [val=undefined] - If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control height is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Height(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			/**
			* Get value indicating whether user has changed control value.
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid.
			Control value is considered invalid if control is required, but no value is set,
			or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Get/set value indicating whether control initially appears as valid, even
			though it is not. It will appear invalid once the user touches the control,
			or when control value is validated using Fit.Controls.ValidateAll(..).
			* @function LazyValidation
			* @param {boolean} [val=undefined] - If defined, Lazy Validation is enabled/disabled.
			* @returns boolean
			*/
			public LazyValidation(val?:boolean):boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus.
			* @function OnBlur
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnBlur(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user.
			* @function OnChange
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnChange(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus.
			* @function OnFocus
			* @param {Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>} cb - Event handler function which accepts Sender (ControlBase).
			*/
			public OnFocus(cb:Fit.Controls.ControlBaseTypeDefs.BaseEvent<this>):void;
			/**
			* Remove all validation rules.
			* @function RemoveAllValidationRules
			*/
			public RemoveAllValidationRules():void;
			/**
			* Remove CSS class from DOMElement representing control.
			* @function RemoveCssClass
			* @param {string} val - CSS class to remove.
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Remove validation function used to perform on-the-fly validation against control.
			* @function RemoveValidationRule
			* @param {Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>} validator - Validation function registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:Fit.Controls.ControlBaseTypeDefs.ValidationCallback<this>):void;
			/**
			* Remove regular expression used to perform on-the-fly validation against control value.
			* @function RemoveValidationRule
			* @param {RegExp} validator - Regular expression registered using AddValidationRule(..).
			*/
			public RemoveValidationRule(validator:RegExp):void;
			/**
			* Get/set value indicating whether control is required to be set.
			* @function Required
			* @param {boolean} [val=undefined] - If defined, control required feature is enabled/disabled.
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple
			controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] - If defined, control scope is updated.
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationCallback
			* @param {Function | null} cb - Function receiving control value - must return True if value is valid, otherwise False.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationCallback(cb:Function | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set regular expression used to perform on-the-fly validation against control value.
			* @function SetValidationExpression
			* @param {RegExp | null} regEx - Regular expression to validate against.
			* @param {string} [errorMsg=undefined] - If defined, specified error message is displayed when user clicks or hovers validation error indicator.
			*/
			public SetValidationExpression(regEx:RegExp | null, errorMsg?:string):void;
			/**
			* DEPRECATED! Please use AddValidationRule(..) instead.
			Set callback function used to perform on-the-fly validation against control value.
			* @function SetValidationHandler
			* @param {Function | null} cb - Function receiving an instance of the control and its value.
			An error message string must be returned if value is invalid,
			otherwise Null or an empty string if the value is valid.
			*/
			public SetValidationHandler(cb:Function | null):void;
			/**
			* Get/set value as if it was changed by the user. Contrary to Value(..), this function will never reset the dirty state.
			Restrictions/filtering/modifications may be enforced just as the UI control might do, e.g. prevent the use of certain
			characters, or completely ignore input if not allowed. It may also allow invalid values such as a partially entered date
			value. The intention with UserValue(..) is to mimic the behaviour of what the user can do with the user interface control.
			For picker controls the value format is equivalent to the one dictated by the Value(..) function.
			* @function UserValue
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @returns string
			*/
			public UserValue(val?:string):string;
			/**
			* Get/set control value.
			For controls supporting multiple selections: Set value by providing a string in one the following formats:
			title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]].
			If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded.
			Selected items are returned in the first format described, also with reserved characters URIEncoded.
			Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] - If defined, value is inserted into control.
			* @param {boolean} [preserveDirtyState=false] - If defined, True prevents dirty state from being reset, False (default) resets the dirty state.
			If dirty state is reset (default), the control value will be compared against the value passed,
			to determine whether it has been changed by the user or not, when IsDirty() is called.
			* @returns string
			*/
			public Value(val?:string, preserveDirtyState?:boolean):string;
			/**
			* Get/set value indicating whether control is visible.
			* @function Visible
			* @param {boolean} [val=undefined] - If defined, control visibility is updated.
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties.
			* @function Width
			* @param {number} [val=undefined] - If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} [unit=px] - If defined, control width is updated to specified CSS unit.
			* @returns Fit.TypeDefs.CssValue
			*/
			public Width(val?:number, unit?:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"):Fit.TypeDefs.CssValue;
			// Functions defined by Fit.Controls.Component
			/**
			* Destroys control to free up memory.
			Make sure to call Dispose() on Component which can be done like so:
			this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
			{
			     // Add control specific dispose logic here
			     base(); // Call Dispose on Component
			});.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID.
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Render control, either inline or to element specified.
			* @function Render
			* @param {HTMLElement} [toElement=undefined] - If defined, control is rendered to this element.
			*/
			public Render(toElement?:HTMLElement):void;
		}
		/**
		* 
		* @namespace [Fit.Controls.WSTreeViewTypeDefs WSTreeViewTypeDefs]
		*/
		namespace WSTreeViewTypeDefs
		{
			// Functions defined by Fit.Controls.WSTreeViewTypeDefs
			/**
			* Abort event handler.
			* @template TypeOfThis
			* @callback AbortEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSTreeViewTypeDefs.AbortHandlerEventArgs<TypeOfThis>} eventArgs - Event arguments.
			*/
			type AbortEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSTreeViewTypeDefs.AbortHandlerEventArgs<TypeOfThis>) => void;
			/**
			* Cancelable request event handler.
			* @template TypeOfThis
			* @callback CancelableRequestEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSTreeViewTypeDefs.EventHandlerArgs<TypeOfThis>} eventArgs - Event arguments.
			* @returns boolean | void
			*/
			type CancelableRequestEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSTreeViewTypeDefs.EventHandlerArgs<TypeOfThis>) => boolean | void;
			/**
			* Data event handler.
			* @template TypeOfThis
			* @callback DataEventHandler
			* @param {TypeOfThis} sender - Instance of control.
			* @param {Fit.Controls.WSTreeViewTypeDefs.DataHandlerEventArgs<TypeOfThis>} eventArgs - Event arguments.
			*/
			type DataEventHandler<TypeOfThis> = (sender:TypeOfThis, eventArgs:Fit.Controls.WSTreeViewTypeDefs.DataHandlerEventArgs<TypeOfThis>) => void;
			/**
			* Reload callback.
			* @template TypeOfThis
			* @callback ReloadCallback
			* @param {TypeOfThis} sender - Instance of control.
			*/
			type ReloadCallback<TypeOfThis> = (sender:TypeOfThis) => void;
			/**
			* Abort event handler arguments.
			* @class [Fit.Controls.WSTreeViewTypeDefs.AbortHandlerEventArgs AbortHandlerEventArgs]
			* @template TypeOfThis
			*/
			class AbortHandlerEventArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSTreeViewTypeDefs.AbortHandlerEventArgs
				/**
				* JSON objects representing nodes.
				* @member {null} Children
				*/
				Children:null;
				// Properties defined by Fit.Controls.WSTreeViewTypeDefs.EventHandlerArgs
				/**
				* Instance of TreeViewNode.
				* @member {Fit.Controls.TreeViewNode} Node
				*/
				Node:Fit.Controls.TreeViewNode;
				/**
				* Instance of JsonRequest or JsonpRequest.
				* @member {Fit.Http.JsonRequest | Fit.Http.JsonpRequest} Request
				*/
				Request:Fit.Http.JsonRequest | Fit.Http.JsonpRequest;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
			/**
			* Data event handler arguments.
			* @class [Fit.Controls.WSTreeViewTypeDefs.DataHandlerEventArgs DataHandlerEventArgs]
			* @template TypeOfThis
			*/
			class DataHandlerEventArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSTreeViewTypeDefs.DataHandlerEventArgs
				/**
				* JSON objects representing nodes.
				* @member {Fit.Controls.WSTreeViewTypeDefs.JsonItem[]} Children
				*/
				Children:Fit.Controls.WSTreeViewTypeDefs.JsonItem[];
				// Properties defined by Fit.Controls.WSTreeViewTypeDefs.EventHandlerArgs
				/**
				* Instance of TreeViewNode.
				* @member {Fit.Controls.TreeViewNode} Node
				*/
				Node:Fit.Controls.TreeViewNode;
				/**
				* Instance of JsonRequest or JsonpRequest.
				* @member {Fit.Http.JsonRequest | Fit.Http.JsonpRequest} Request
				*/
				Request:Fit.Http.JsonRequest | Fit.Http.JsonpRequest;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
			/**
			* Request handler event arguments.
			* @class [Fit.Controls.WSTreeViewTypeDefs.EventHandlerArgs EventHandlerArgs]
			* @template TypeOfThis
			*/
			class EventHandlerArgs<TypeOfThis>
			{
				// Properties defined by Fit.Controls.WSTreeViewTypeDefs.EventHandlerArgs
				/**
				* Instance of TreeViewNode.
				* @member {Fit.Controls.TreeViewNode} Node
				*/
				Node:Fit.Controls.TreeViewNode;
				/**
				* Instance of JsonRequest or JsonpRequest.
				* @member {Fit.Http.JsonRequest | Fit.Http.JsonpRequest} Request
				*/
				Request:Fit.Http.JsonRequest | Fit.Http.JsonpRequest;
				/**
				* Instance of control.
				* @member {TypeOfThis} Sender
				*/
				Sender:TypeOfThis;
			}
			/**
			* JSON object representing node.
			* @class [Fit.Controls.WSTreeViewTypeDefs.JsonItem JsonItem]
			*/
			class JsonItem
			{
				// Properties defined by Fit.Controls.WSTreeViewTypeDefs.JsonItem
				/**
				* Children.
				* @member {Fit.Controls.WSTreeViewTypeDefs.JsonItem[]} [Children=undefined]
				*/
				Children?:Fit.Controls.WSTreeViewTypeDefs.JsonItem[];
				/**
				* Value indicating whether item is initially expanded to reveal children - not expanded by default.
				* @member {boolean} [Expanded=undefined]
				*/
				Expanded?:boolean;
				/**
				* Set True to trigger an additional request to web service to retrieve children for this item when it is expanded.
				* @member {boolean} [HasChildren=undefined]
				*/
				HasChildren?:boolean;
				/**
				* Value indicating whether item can be selected or not - not selectable by default.
				* @member {boolean} [Selectable=undefined]
				*/
				Selectable?:boolean;
				/**
				* Value indicating whether item is initially selected - not selected by default.
				* @member {boolean} [Selected=undefined]
				*/
				Selected?:boolean;
				/**
				* Associative string array to carry additional information.
				* @member {Object.<string, string>} [Supplementary=undefined]
				*/
				Supplementary?:{[key:string]: string};
				/**
				* Title - using Value if not defined.
				* @member {string} [Title=undefined]
				*/
				Title?:string;
				/**
				* Unique value.
				* @member {string} Value
				*/
				Value:string;
			}
		}
		/**
		* Enum values determining visual appearance of button controls.
		* @enum {string}
		*/
		enum ButtonType
		{
			/** Red unless styled differently. */
			Danger = "Danger",
			/** White unless styled differently - default look and feel. */
			Default = "Default",
			/** Turquoise unless styled differently. */
			Info = "Info",
			/** Blue unless styled differently. */
			Primary = "Primary",
			/** Green unless styled differently. */
			Success = "Success",
			/** Orange unless styled differently. */
			Warning = "Warning"
		}
		/**
		* Resizing options.
		* @enum {string}
		*/
		enum InputResizing
		{
			/** Do not allow resizing. */
			Disabled = "Disabled",
			/** Allow for resizing both vertically and horizontally. */
			Enabled = "Enabled",
			/** Allow for horizontal resizing. */
			Horizontal = "Horizontal",
			/** Allow for vertical resizing. */
			Vertical = "Vertical"
		}
		/**
		* Enum values determining input type.
		* @enum {string}
		*/
		enum InputType
		{
			/** Input control useful for entering a color. */
			Color = "Color",
			/** Input control useful for entering a date. */
			Date = "Date",
			/** Input control useful for entering a date and time. */
			DateTime = "DateTime",
			/** Input control useful for entering an e-mail address. */
			Email = "Email",
			/** Input control useful for entering a month. */
			Month = "Month",
			/** Input control useful for entering a number. */
			Number = "Number",
			/** Input control useful for entering a password (characters are masked). */
			Password = "Password",
			/** Input control useful for entering a phone number. */
			PhoneNumber = "PhoneNumber",
			/** Input control useful for entering ordinary text. */
			Text = "Text",
			/** Multi line input field. */
			Textarea = "Textarea",
			/** Input control useful for entering time. */
			Time = "Time",
			/** Input control useful for entering a week number. */
			Week = "Week"
		}
		/**
		* Enum indicating how data is loaded from WebService when using the Select All feature.
		* @enum {string}
		*/
		enum WSTreeViewSelectAllMode
		{
			/** Load all children at once (WebService is expected to return the complete hierarchy in one single request).
		This approach will provide better performance as it does not fire OnChange for every child expanded,
		and only sends one HTTP request to WebService. */
			Instantly = "Instantly",
			/** Chain load children by progressively expanding them as they are loaded.
		This may result in several HTTP requests to WebService, and OnChange will
		fire for every node expanded if children are available server side. */
			Progressively = "Progressively"
		}
	}
	/**
	* Cookie functionality.
	Set/Get/Remove functions can be invoked as static members, or an instance of Fit.Cookies
	can be created to isolate cookies to either the current path or a custom path.
	* @class [Fit.Cookies Cookies]
	*/
	class Cookies
	{
		// Functions defined by Fit.Cookies
		/**
		* Create instance of cookie container isolated to either current path (default)
		or a custom path, and optionally an alternative part of the domain (by default
		cookies are available only on the current domain, while defining a domain makes
		cookies available to that particular domain and subdomains).
		* @function Cookies
		*/
		constructor();
		/**
		* Get/set portion of domain to which cookies are isolated.
		* @function Domain
		* @param {string | null} [val=undefined] - If defined, changes isolation to specified domain portion, including subdomains - pass
		Null to unset it to make cookies available to current domain only (excluding subdomains).
		* @returns string | null
		*/
		public Domain(val?:string | null):string | null;
		/**
		* Returns cookie value if found, otherwise Null.
		* @function Get
		* @param {string} name - Unique cookie name.
		* @returns string | null
		*/
		public Get(name:string):string | null;
		/**
		* Get/set path to which cookies are isolated.
		* @function Path
		* @param {string} [val=undefined] - If defined, changes isolation to specified path.
		* @returns string
		*/
		public Path(val?:string):string;
		/**
		* Get/set prefix added to all cookies - useful for grouping related cookies and to avoid naming conflicts.
		Notice that Set/Get/Remove functions automatically apply the prefix to cookie names, so the use of a prefix
		is completely transparent.
		* @function Prefix
		* @param {string} [val=undefined] - If defined, changes cookie prefix to specified value - pass Null to unset it.
		* @returns string | null
		*/
		public Prefix(val?:string):string | null;
		/**
		* Remove cookie.
		* @function Remove
		* @param {string} name - Unique cookie name.
		*/
		public Remove(name:string):void;
		/**
		* Get/set SameSite policy.
		* @function SameSite
		* @param {"None" | "Lax" | "Strict" | null} [val=undefined] - If defined, changes SameSite policy - pass Null to unset it.
		* @returns string | null
		*/
		public SameSite(val?:"None" | "Lax" | "Strict" | null):string | null;
		/**
		* Get/set Secure flag.
		* @function Secure
		* @param {boolean} [val=undefined] - If defined, changes Secure flag.
		* @returns boolean
		*/
		public Secure(val?:boolean):boolean;
		/**
		* Create or update cookie.
		* @function Set
		* @param {string} name - Unique cookie name.
		* @param {string} value - Cookie value (cannot contain semicolon!).
		* @param {number} [seconds=undefined] - Optional expiration time in seconds. Creating a cookie with
		no expiration time will cause it to expire when session ends.
		*/
		public Set(name:string, value:string, seconds?:number):void;
		/**
		* Returns cookie value if found, otherwise Null.
		* @function Get
		* @static
		* @param {string} name - Unique cookie name.
		* @returns string | null
		*/
		public static Get(name:string):string | null;
		/**
		* Remove cookie.
		* @function Remove
		* @static
		* @param {string} name - Unique cookie name.
		* @param {string} [path=undefined] - Optional cookie path.
		If cookie was defined on a custom path, the
		same path must be specified to remove the cookie.
		* @param {string} [domain=undefined] - Optional cookie domain.
		If cookie was defined on a specific domain, the
		same domain must be specified to remove the cookie.
		*/
		public static Remove(name:string, path?:string, domain?:string):void;
		/**
		* Remove cookie.
		* @function Remove
		* @static
		* @param {Fit.CookiesDefs.CookieIdentity} cookie - Cookie to remove.
		*/
		public static Remove(cookie:Fit.CookiesDefs.CookieIdentity):void;
		/**
		* Create or update cookie.
		* @function Set
		* @static
		* @param {string} name - Unique cookie name.
		* @param {string} value - Cookie value (cannot contain semicolon!).
		* @param {number} [seconds=undefined] - Optional expiration time in seconds. Creating a cookie with
		no expiration time will cause it to expire when session ends.
		* @param {string} [path=undefined] - Optional cookie path.
		Specifying no path makes cookie accessible to entire domain.
		Specifying a path makes the cookie accessible to that particular path only.
		However, this is not a security feature! A page can read cookies from any path
		by creating an iframe with the path of the cookies, and read them through
		the iframe's contentDocument.cookie property.
		* @param {string} [domain=undefined] - Optional cookie domain.
		Not specifying a domain restricts the cookie to the host portion of the page currently loaded.
		Specifying a domain makes the cookies accessible to the domain and subdomains.
		It is not possible to specify a foreign domain name - this will be silently ignored.
		Example: domain.com or sub.domain.com.
		* @param {"None" | "Lax" | "Strict"} [sameSite=undefined] - Optional Same-Site policy determining whether to accept cookie and send it along with HTTP requests.
		Different browsers (and versions) default to different values/behaviour, and a lot of different versions
		are known to incorrectly handle SameSite, so don't expect this to work reliably across browsers.
		Some browers may even work differently across platforms, despite being the same version, such as Safari on macOS and iOS.
		Furthermore the behaviour may vary depending on browser configuration (configuration flags).
		See https://www.chromium.org/updates/same-site/incompatible-clients
		and https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#browser_compatibility
		and https://caniuse.com/same-site-cookie-attribute
		None = Cookie is included with cross-site requests, but only when Secure is True.
		Lax = Cookie is included with all types of Same-Site requests, but only for top-level
		navigation for cross-site requests (GET/HEAD requests only, and only in main window/frame).
		Strict = Cookie is included with all types of Same-Site requests, never for cross-site requests.
		More recent versions of Chrome (and Chrome based browsers) default to Lax.
		* @param {boolean} [secure=undefined] - Optional flag determining whether to accept and send along cookie on secure connections only.
		*/
		public static Set(name:string, value:string, seconds?:number, path?:string, domain?:string, sameSite?:"None" | "Lax" | "Strict", secure?:boolean):void;
		/**
		* Create or update cookie.
		* @function Set
		* @static
		* @param {Fit.CookiesDefs.Cookie} newCookie - New or updated cookie.
		*/
		public static Set(newCookie:Fit.CookiesDefs.Cookie):void;
	}
	/**
	* Core features extending the capabilities of native JS.
	* @class [Fit.Core Core]
	*/
	class Core
	{
		// Functions defined by Fit.Core
		/**
		* Clone JavaScript object. Supported object types and values:
		String, Number, Boolean, Date, Array, (JSON) Object, Function, Undefined, Null, NaN,
		Infinity.
		Variables defined as undefined are left out of clone,
		since an undefined variable is equal to a variable defined as undefined.
		Notice that Arrays and Objects can contain supported object types and values only.
		Functions are considered references, and as such the cloned object will reference
		the same functions.
		Custom properties set on native JS objects (e.g. Array.XYZ) are not cloned, only
		values are. Naturally custom (JSON) objects will be fully cloned, including all
		properties. Both arrays and custom (JSON) objects are cloned recursively.
		Be aware of self referencing variables and circular structures, which
		will cause an infinite loop, and eventually a stack overflow exception.
		DOM objects and window/frame instances are not supported.
		* @template ObjectType
		* @function Clone
		* @static
		* @param {ObjectType} obj - JS object to clone.
		* @returns ObjectType
		*/
		public static Clone<ObjectType>(obj:ObjectType):ObjectType;
		/**
		* Create a debouncing function that delays execution the specified number of milliseconds.
		Invoking function multiple times merely postpone execution the specified number of milliseconds.
		This can greatly increase performance for expensive operations invoked often.
		* @function CreateDebouncer
		* @static
		* @param {Function} func - Reference to function to invoke.
		* @param {number} timeout - Number of milliseconds to postpone execution.
		* @param {any} [thisArg=undefined] - The value 'this' resolves to within debounced function.
		* @returns Fit.CoreTypeDefs.DebounceFunction
		*/
		public static CreateDebouncer(func:Function, timeout:number, thisArg?:any):Fit.CoreTypeDefs.DebounceFunction;
		/**
		* Create a function override for any given function using the approach below.
		
		this.SayHello = function(name) { alert("Hello " + name); }
		this.SayHello = Fit.Core.CreateOverride(this.SayHello, function(name)
		{
		console.log(name + " logged in");
		console.log(name + " is using the following browser: " + navigator.userAgent);
		
		base(name); // Call original SayHello function
		});
		
		Notice how base(..) allows us to call the original function.
		* @function CreateOverride
		* @static
		* @param {Function} originalFunction - Reference to function to override.
		* @param {Function} newFunction - Reference to replacement function.
		* @returns Function
		*/
		public static CreateOverride(originalFunction:Function, newFunction:Function):Function;
		/**
		* Extend any object with the public members of a super class.
		
		MyClass = function(controlId)
		{
		     Fit.Core.Extend(this, MySuperClass).Apply();
		}
		
		The code above defines a class called MyClass which extends from MySuperClass.
		Use Apply() to pass variables to the super class constructor as shown below:
		
		Male = function(name, age)
		{
		     Fit.Core.Extend(this, Person).Apply("Male", name, age);
		}
		
		Notice that calling just Extend(..) without calling Apply() on the object returned,
		will not cause extension to occure. Apply() must be called, with or without parameters.
		
		Notice that Fit.UI supports multiple inheritance. Be careful not to extend from multiple
		classes implementing functions with identical names, or at least be aware that the last
		class from which the derivative extends, takes precedence.
		* @function Extend
		* @static
		* @param {any} subInstance - Instance of sub class to extend.
		* @param {Function} superType - Class (function) to extend from.
		* @returns any
		*/
		public static Extend(subInstance:any, superType:Function):any;
		/**
		* Returns boolean indicating whether given object is an extension of a given super type - see Fit.Core.Extend(..).
		Also look into Fit.Core.InstanceOf(..) which may provide the desired behaviour.
		* @function Extends
		* @static
		* @param {any} instance - Object instance.
		* @param {Function} superType - Reference to super class (function).
		* @returns boolean
		*/
		public static Extends(instance:any, superType:Function):boolean;
		/**
		* Returns boolean indicating whether given object is an instance or extension of a given class type - see Fit.Core.Extend(..).
		This is equivalent of: var result = (obj instanceof MyType || Fit.Core.Extends(obj, MyType));.
		* @function InstanceOf
		* @static
		* @param {any} instance - Object instance.
		* @param {Function} type - Reference to class (function).
		* @returns boolean
		*/
		public static InstanceOf(instance:any, type:Function):boolean;
		/**
		* Compare two JavaScript objects to determine whether they are identical.
		Returns True if objects are identical (equal), otherwise False.
		Functions are compared by reference, not by value.
		Custom properties set on native JS objects (e.g. Array.XYZ) are not compared, only
		values are. Naturally JSON objects will be fully compared, including all properties.
		Be aware of self referencing variables and circular structures, which
		will cause an infinite loop, and eventually a stack overflow exception.
		DOM objects and window/frame instances are not supported.
		* @function IsEqual
		* @static
		* @param {any} jsObj1 - JS object to compare agains second JS object.
		* @param {any} jsObj2 - JS object to compare agains first JS object.
		* @returns boolean
		*/
		public static IsEqual(jsObj1:any, jsObj2:any):boolean;
		/**
		* Deep merges two objects and returns the resulting object.
		Take notice of the behaviour and restriction of Fit.Core.Clone(..) since
		the target object is first cloned using that function. The resulting object is
		then enriched with the data from the merge object.
		Property values on the merge object takes precedence over property values on the
		target object. Arrays are not merged but merely replaced if defined on the merge object.
		* @template ObjectTypeA
		* @template ObjectTypeB
		* @function Merge
		* @static
		* @param {ObjectTypeA} targetObject - Target object.
		* @param {ObjectTypeB} mergeObject - Merge object.
		* @returns ObjectTypeA & ObjectTypeB
		*/
		public static Merge<ObjectTypeA, ObjectTypeB>(targetObject:ObjectTypeA, mergeObject:ObjectTypeB):ObjectTypeA & ObjectTypeB;
	}
	/**
	* 
	* @class [Fit.Data Data]
	*/
	class Data
	{
		// Functions defined by Fit.Data
		/**
		* Returns Version 4 compliant GUID.
		* @function CreateGuid
		* @static
		* @param {boolean} [dashFormat=true] - Flag indicating whether to use format with or without dashes.
		True = With dashes (default): 57df75f2-3d09-48ca-9c94-f64a5986518f (length = 36)
		False = Without dashes: 57df75f23d0948ca9c94f64a5986518f (length = 32).
		* @returns string
		*/
		public static CreateGuid(dashFormat?:boolean):string;
	}
	/**
	* 
	* @class [Fit.Date Date]
	*/
	class Date
	{
		// Functions defined by Fit.Date
		/**
		* Format instance of Date.
		Example: Fit.Date.Format(new Date(), "YYYY-MM-DD hh:mm:ss");
		Result: 2016-06-18 15:23:48
		
		Date can be formatted using the following variables:
		YYYY: 4 digits year (e.g. 2016)
		YY: 2 digits year (e.g. 16)
		MM: 2 digits month (e.g. 04)
		M: Prefer 1 digit month if possible (e.g. 4)
		DD: 2 digits day (e.g. 09)
		D: Prefer 1 digit day if possible (e.g. 9)
		W: 1 digit week number (e.g. 35)
		hh: 2 digits hours value (e.g. 08)
		h: 1 digit hours value if possible (e.g. 8)
		mm: 2 digits minutes value (e.g. 02)
		m: 1 digit minutes value if possible (e.g. 2)
		ss: 2 digits seconds value (e.g. 05)
		s: 1 digit seconds value if possible (e.g. 5).
		* @function Format
		* @static
		* @param {Date} date - Date to format as string.
		* @param {string} format - Date format.
		* @returns string
		*/
		public static Format(date:__fitUiAliasDate, format:string):string;
		/**
		* Get ISO 8601 week number from date.
		* @function GetWeek
		* @static
		* @param {Date} date - Date to get week number from.
		* @returns number
		*/
		public static GetWeek(date:__fitUiAliasDate):number;
		/**
		* Parse date as string into an instance of Date - example: 18-09/2016 17:03:21.
		* @function Parse
		* @static
		* @param {string} strDate - Date as string.
		* @param {string} format - Specify date format used to allow parser to determine which parts of the string
		is Year, Month, Day, etc. The same variables used for Fit.Date.Format
		can be used, except for W (week).
		Since the parser do not need to know the length of the different parts that
		makes up the Date, one can simply use the shorter variable format: Y, M, D, h, m, s.
		Be aware that the Parse function does not support a Year represented by a
		2 digit value, since it will be impossible to determine which century it belongs to.
		Example: D-M/Y h:m:s.
		* @returns Date
		*/
		public static Parse(strDate:string, format:string):__fitUiAliasDate;
	}
	/**
	* DOM (Document Object Model) manipulation and helper functionality.
	* @class [Fit.Dom Dom]
	*/
	class Dom
	{
		// Functions defined by Fit.Dom
		/**
		* Add element to container.
		* @function Add
		* @static
		* @param {HTMLElement} container - Add element to this container.
		* @param {Node} elm - Element, Text, or Comment to add to container.
		*/
		public static Add(container:HTMLElement, elm:Node):void;
		/**
		* Add CSS class to element if not already found.
		* @function AddClass
		* @static
		* @param {HTMLElement} elm - Element on which CSS class is to be added.
		* @param {string} cls - CSS class name.
		*/
		public static AddClass(elm:HTMLElement, cls:string):void;
		/**
		* Get/set attribute on DOMElement - returns Null if attribute does not exist.
		* @function Attribute
		* @static
		* @param {HTMLElement} elm - DOMElement to which attribute is set and/or returned from.
		* @param {string} name - Name of attribute to set or retrieve.
		* @param {string | null} [value=undefined] - If defined, attribute is updated with specified value.
		Passing Null results in attribute being removed.
		* @returns string | null
		*/
		public static Attribute(elm:HTMLElement, name:string, value?:string | null):string | null;
		/**
		* Check whether given element is found in given container at any given level in object hierarchy.
		* @function Contained
		* @static
		* @param {HTMLElement} container - Container expected to contain element.
		* @param {Node} elm - Element expected to be found in container's object hierarchy.
		* @returns boolean
		*/
		public static Contained(container:HTMLElement, elm:Node):boolean;
		/**
		* Create element with the specified HTML content.
		HTML content is (by default) wrapped in a  &lt;div&gt;  if it produced multiple elements.
		If content on the other hand produces only one outer element, that particular element is returned.
		It is possible to construct DOM objects of type Element, Text, and Comment.
		The container type used to wrap multiple elements can be changed using the containerTagName argument.
		* @function CreateElement
		* @static
		* @param {string} html - HTML element to create DOMElement from.
		* @param {string} [containerTagName=div] - If defined, and html argument produces multiple element, the result is wrapped in a container of
		the specified type. If not set, multiple elements will be wrapped in a  &lt;div&gt;  container.
		* @returns Node
		*/
		public static CreateElement(html:string, containerTagName?:string):Node;
		/**
		* Get/set data attribute on DOMElement - returns Null if data attribute does not exist.
		* @function Data
		* @static
		* @param {HTMLElement} elm - DOMElement to which data attribute is set and/or returned from.
		* @param {string} name - Name of data attribute to set or retrieve.
		* @param {string | null} [value=undefined] - If defined, data attribute is updated with specified value.
		Passing Null results in data attribute being removed.
		* @returns string | null
		*/
		public static Data(elm:HTMLElement, name:string, value?:string | null):string | null;
		/**
		* Get position for visible element within viewport.
		Object returned contains an X and Y property
		with the desired integer values (pixels).
		Contrary to Fit.Dom.GetPosition(elm, true) which returns
		the position to the margin edge, this function returns the
		position of the element's border edge, and is the recommended
		approach.
		Null will be returned if element is not visible.
		* @function GetBoundingPosition
		* @static
		* @param {HTMLElement} elm - Element to get position for.
		* @returns Fit.TypeDefs.Position | null
		*/
		public static GetBoundingPosition(elm:HTMLElement):Fit.TypeDefs.Position | null;
		/**
		* Get style value applied after stylesheets have been loaded.
		An empty string or null may be returned if style has not been defined or does not exist.
		Make sure not to use shorthand properties (e.g. border-color or padding) as some browsers are
		not capable of calculating these - use the fully qualified property name (e.g. border-left-color
		or padding-left).
		* @function GetComputedStyle
		* @static
		* @param {HTMLElement} elm - Element which contains desired CSS style value.
		* @param {string} style - CSS style property name.
		* @returns string | null
		*/
		public static GetComputedStyle(elm:HTMLElement, style:string):string | null;
		/**
		* Get container responsible for hiding given element.
		Element passed will be returned if hidden itself.
		Returns Null if element is visible, or has not been rooted in DOM yet.
		* @function GetConcealer
		* @static
		* @param {Node} elm - Element to get concealer for.
		* @returns HTMLElement | null
		*/
		public static GetConcealer(elm:Node):HTMLElement | null;
		/**
		* Get number of levels specified element is nested in DOM.
		HTMLElement is at level 0, HTMLBodyElement is at level 1,
		first element in HTMLBodyElement is at level 2, and so forth.
		* @function GetDepth
		* @static
		* @param {Node} elm - Element to get depth in DOM for.
		* @returns number
		*/
		public static GetDepth(elm:Node):number;
		/**
		* Returns element currently focused. If no element is focused, the document body is returned.
		Null will be returned if the document has not been loaded yet.
		* @function GetFocused
		* @static
		* @returns HTMLElement | null
		*/
		public static GetFocused():HTMLElement | null;
		/**
		* Get element position within parent element.
		Notice that Text and Comment nodes are ignored.
		* @function GetIndex
		* @static
		* @param {HTMLElement} elm - Element to get index for.
		* @returns number
		*/
		public static GetIndex(elm:HTMLElement):number;
		/**
		* Returns object with Width and Height properties (integers) with inner dimensions of specified
		container. Inner dimensions are width and height with padding and borders substracted.
		Result returned will be as expected no matter the box-sizing model being used.
		* @function GetInnerDimensions
		* @static
		* @param {HTMLElement} elm - Element to get inner dimensions for.
		* @returns Fit.TypeDefs.Dimension
		*/
		public static GetInnerDimensions(elm:HTMLElement):Fit.TypeDefs.Dimension;
		/**
		* Get parent that has overflow set to auto, scroll, or hidden (hidden is optional).
		To get the parent that actually affects the position of the element when scrolled,
		use GetScrollParent(..) instead, as it may not be the first parent with overflow set.
		Which parent affects the position of an element when scrolled depends on which element
		is the offsetParent - it might not be an element within the overflowing parent, or
		the overflowing parent itself, which would be required to affect the element's position
		when the overflowing parent is scrolled.
		A scrollable container will only affect an element's position if it is statically positioned
		within the scrollable parent, or if it is positioned relative to another statically positioned element
		within the parent with overflow, or if the parent with overflow itself is positioned, which makes it the
		offsetParent, hence causing the element to scroll along.
		In most cases GetScrollParent(..) will be the correct function to use.
		Exceptions to this is when we also want to include overflow:hidden, or if we have an
		element with position:absolute that is positioned relative to the document or an element
		outside of the overflowing/scrollable parent, and we still want a reference to the nearest
		parent with overflow set.
		Returns null if element passed is placed on its own stacking context with position:fixed.
		* @function GetOverflowingParent
		* @static
		* @param {HTMLElement} elm - Element to get overflowing parent for.
		* @param {boolean} [scrollableOnly=false] - Flag indicating whether to only consider parents with overflow:auto or overflow:scroll.
		Parents with overflow:hidden will be ignored. As such, only a parent with the ability to
		scroll overflowing content into view can be returned.
		* @returns HTMLElement | null
		*/
		public static GetOverflowingParent(elm:HTMLElement, scrollableOnly?:boolean):HTMLElement | null;
		/**
		* Returns first parent of specified type for a given element if found, otherwise Null.
		* @function GetParentOfType
		* @static
		* @param {Node} element - Element to find parent for.
		* @param {string} parentType - Tagname of parent element to look for.
		* @returns HTMLElement | null
		*/
		public static GetParentOfType(element:Node, parentType:string):HTMLElement | null;
		/**
		* Get position for visible element.
		Object returned contains an X and Y property
		with the desired integer values (pixels).
		The position returned is where the margin edge
		starts, if such is applied.
		Null will be returned if element is not visible.
		* @function GetPosition
		* @static
		* @param {HTMLElement} elm - Element to get position for.
		* @param {boolean} [relativeToViewport=false] - Set True to get element position relative to viewport rather than to document which may exceed the viewport.
		Contrary to Fit.Dom.GetBoundingPosition(elm), the position returned is where the margin edge starts, if such is applied.
		* @returns Fit.TypeDefs.Position | null
		*/
		public static GetPosition(elm:HTMLElement, relativeToViewport?:boolean):Fit.TypeDefs.Position | null;
		/**
		* Get element position relative to a positioned parent or ancestor (offsetParent).
		Coordinates returned are relative to document if no positioned parent or ancestor is found.
		For an element with position:fixed coordinates relative to the document is returned.
		Object returned contains an X and Y property with the desired integer values (pixels).
		Notice that Null is returned in case element is not rooted yet (added to DOM) or invisible.
		* @function GetRelativePosition
		* @static
		* @param {HTMLElement} elm - Element to get position for.
		* @returns Fit.TypeDefs.Position | null
		*/
		public static GetRelativePosition(elm:HTMLElement):Fit.TypeDefs.Position | null;
		/**
		* Get information about scrollbars within a given DOM element.
		Returns an object with Vertical and Horizontal properties, each containing
		Enabled and Size properties, which can be used to determine whether scrolling is enabled,
		and the size of the scrollbar. The size remains 0 when scrolling is not enabled.
		To determine whether the browser's viewport has scrolling enabled, use Fit.Browser.GetScrollBars().
		* @function GetScrollBars
		* @static
		* @param {HTMLElement} elm - Element to get scrollbar information for.
		* @returns Fit.TypeDefs.ScrollBarsPresent
		*/
		public static GetScrollBars(elm:HTMLElement):Fit.TypeDefs.ScrollBarsPresent;
		/**
		* Get scrolling document element. This is the cross browser
		equivalent of document.scrollingElement.
		* @function GetScrollDocument
		* @static
		* @returns HTMLElement
		*/
		public static GetScrollDocument():HTMLElement;
		/**
		* Get element's scroll parent (parent that has overflow:auto or overflow:scroll,
		and that affects the position of the element if scrolled). This may not necessarily
		be the first parent with overflow set - it also depends on the element's offsetParent.
		For a parent to be considered the scroll parent, it must be scrollable, and the element
		passed to this function must be relatively positioned against this scroll parent, or
		relatively positioned against an element within the scroll parent that is statically
		positioned, or in turn relatively positioned against the scroll parent.
		Returns null if element passed is placed on its own stacking context with position:fixed.
		* @function GetScrollParent
		* @static
		* @param {HTMLElement} elm - Element to get scroll parent for.
		* @returns HTMLElement | null
		*/
		public static GetScrollParent(elm:HTMLElement):HTMLElement | null;
		/**
		* Get number of pixels specified element's container(s)
		have been scrolled. This gives us the total scroll value
		for nested scrollable elements.
		Object returned contains an X and Y property with the desired integer values (pixels).
		* @function GetScrollPosition
		* @static
		* @param {Node} elm - Element to get scroll position for.
		* @returns Fit.TypeDefs.Position
		*/
		public static GetScrollPosition(elm:Node):Fit.TypeDefs.Position;
		/**
		* Check whether given DOMElement has specified CSS class registered - returns True if found, otherwise False.
		* @function HasClass
		* @static
		* @param {HTMLElement} elm - Element for which CSS class may be registered.
		* @param {string} cls - CSS class name.
		* @returns boolean
		*/
		public static HasClass(elm:HTMLElement, cls:string):boolean;
		/**
		* Insert DOMNode after another DOMNode.
		* @function InsertAfter
		* @static
		* @param {Node} target - Element to insert new element after.
		* @param {Node} newElm - Element to insert after target element.
		*/
		public static InsertAfter(target:Node, newElm:Node):void;
		/**
		* Insert DOMNode at given position.
		Notice that position is relative to contained DOM Elements.
		Text and Comment nodes are ignored.
		* @function InsertAt
		* @static
		* @param {HTMLElement} container - Container to insert element into.
		* @param {number} position - Position (index) to insert element at.
		* @param {Node} newElm - Element to insert.
		*/
		public static InsertAt(container:HTMLElement, position:number, newElm:Node):void;
		/**
		* Insert DOMNode before another DOMNode.
		* @function InsertBefore
		* @static
		* @param {Node} target - Element to insert new element before.
		* @param {Node} newElm - Element to insert before target element.
		*/
		public static InsertBefore(target:Node, newElm:Node):void;
		/**
		* Returns True if element is rooted in document (appended to body), otherwise False.
		* @function IsRooted
		* @static
		* @param {Node} elm - Element to check.
		* @returns boolean
		*/
		public static IsRooted(elm:Node):boolean;
		/**
		* Check whether given element is visible. Returns True if element has been rooted
		in DOM and is visible. Returns False if not rooted, or display:none has been set
		on element or any of its ancestors.
		* @function IsVisible
		* @static
		* @param {Node} elm - Element to check visibility for.
		* @returns boolean
		*/
		public static IsVisible(elm:Node):boolean;
		/**
		* Remove DOMNode from its container element.
		* @function Remove
		* @static
		* @param {Node} elm - DOMNode to remove.
		*/
		public static Remove(elm:Node):void;
		/**
		* Remove CSS class from element if found.
		* @function RemoveClass
		* @static
		* @param {HTMLElement} elm - Element from which CSS class is to be removed.
		* @param {string} cls - CSS class name.
		*/
		public static RemoveClass(elm:HTMLElement, cls:string):void;
		/**
		* Replace element with another one.
		* @function Replace
		* @static
		* @param {Node} oldElm - Element to replace (Element, Text, or Comment).
		* @param {Node} newElm - Replacement element (Element, Text, or Comment).
		*/
		public static Replace(oldElm:Node, newElm:Node):void;
		/**
		* Set caret position for input control.
		* @function SetCaretPosition
		* @static
		* @param {HTMLElement} input - Input element.
		* @param {number} pos - Integer value specifying caret position in input control.
		*/
		public static SetCaretPosition(input:HTMLElement, pos:number):void;
		/**
		* Get/set inner text of DOMElement.
		* @function Text
		* @static
		* @param {Node} elm - Node to update and/or get text value from.
		* @param {string} [value=undefined] - If defined, inner text is updated with specified value.
		* @returns string
		*/
		public static Text(elm:Node, value?:string):string;
		/**
		* Wraps element in container element while preserving position in DOM if rooted.
		* @function Wrap
		* @static
		* @param {Node} elementToWrap - Element to wrap.
		* @param {HTMLElement} container - Container to wrap element within.
		*/
		public static Wrap(elementToWrap:Node, container:HTMLElement):void;
	}
	/**
	* Event handler functionality.
	* @class [Fit.Events Events]
	*/
	class Events
	{
		// Functions defined by Fit.Events
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"keydown" | "keyup" | "keypress"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackKeyboard} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"keydown" | "keyup" | "keypress", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackKeyboard):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "mousewheel"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackMouse} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "mousewheel", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackMouse):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"popstate"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackPopState} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"popstate", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackPopState):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"hashchange"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackHashChange} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"hashchange", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackHashChange):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"focus" | "focusin" | "focusout" | "blur"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackFocus} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"focus" | "focusin" | "focusout" | "blur", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackFocus):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"beforeunload"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackBeforeUnload} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"beforeunload", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackBeforeUnload):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"cut" | "copy" | "paste"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackClipboard} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"cut" | "copy" | "paste", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackClipboard):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"storage"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackStorage} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"storage", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackStorage):number;
		/**
		* Registers handler for specified event on given DOMElement and returns Event ID.
		* @function AddHandler
		* @static
		* @param {HTMLElement} element - DOM element on to which event handler is registered.
		* @param {"#rooted"} event - Event name.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackRooted} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:HTMLElement, event:"#rooted", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackRooted):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {string} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackGeneric} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:string, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackGeneric):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"keydown" | "keyup" | "keypress"} event - Event name without the 'on' prefix.
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
		Alternatively pass options object to control behaviour on a more fine-grained scale.
		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackKeyboard} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"keydown" | "keyup" | "keypress", useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackKeyboard):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "mousewheel"} event - Event name without the 'on' prefix.
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
		Alternatively pass options object to control behaviour on a more fine-grained scale.
		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackMouse} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "mousewheel", useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackMouse):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"popstate"} event - Event name without the 'on' prefix.
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
		Alternatively pass options object to control behaviour on a more fine-grained scale.
		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackPopState} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"popstate", useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackPopState):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"hashchange"} event - Event name without the 'on' prefix.
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
		Alternatively pass options object to control behaviour on a more fine-grained scale.
		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackHashChange} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"hashchange", useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackHashChange):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"focus" | "focusin" | "focusout" | "blur"} event - Event name without the 'on' prefix.
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
		Alternatively pass options object to control behaviour on a more fine-grained scale.
		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackFocus} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"focus" | "focusin" | "focusout" | "blur", useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackFocus):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"beforeunload"} event - Event name without the 'on' prefix.
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
		Alternatively pass options object to control behaviour on a more fine-grained scale.
		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackBeforeUnload} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"beforeunload", useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackBeforeUnload):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"cut" | "copy" | "paste"} event - Event name without the 'on' prefix.
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
		Alternatively pass options object to control behaviour on a more fine-grained scale.
		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackClipboard} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"cut" | "copy" | "paste", useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackClipboard):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {"storage"} event - Event name without the 'on' prefix.
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
		Alternatively pass options object to control behaviour on a more fine-grained scale.
		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackStorage} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:"storage", useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackStorage):number;
		/**
		* Registers handler for specified event on given DOMElement and returns Event ID.
		* @function AddHandler
		* @static
		* @param {HTMLElement} element - DOM element on to which event handler is registered.
		* @param {"#rooted"} event - Event name.
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - This argument is ignored for the specialized #rooted event.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackRooted} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:HTMLElement, event:"#rooted", useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackRooted):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID.
		* @function AddHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) on to which event handler is registered.
		* @param {string} event - Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.).
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - Set True to capture event before it reaches target, False to catch event when it bubbles out from target.
		Alternatively pass options object to control behaviour on a more fine-grained scale.
		NOTICE: This feature will be ignored by Internet Explorer 8 and below.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackGeneric} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:string, useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackGeneric):number;
		/**
		* Registers mutation observer which is invoked when a DOMElement is updated. By default
		only attributes and dimensions are observed. Use deep flag to have children and character data observed too.
		An observer ID is returned which can be used to remove mutation observer.
		Important: Mutation observers should be removed when no longer needed for better performance!
		To remove an observer from within the observer function itself, simply call disconnect().
		* @function AddMutationObserver
		* @static
		* @param {HTMLElement} elm - DOMElement to observe.
		* @param {Fit.EventsTypeDefs.MutationObserverCallback} obs - JavaScript observer function to register - receives reference to DOMElement being observed when updated.
		* @param {boolean} [deep=false] - Flag indicating whether to check for modifications within element (children and character data) - this could potentially be expensive.
		* @returns number
		*/
		public static AddMutationObserver(elm:HTMLElement, obs:Fit.EventsTypeDefs.MutationObserverCallback, deep?:boolean):number;
		/**
		* Get event argument related to event just fired in a cross browser compatible manner.
		* @function GetEvent
		* @static
		* @param {Event} [e=undefined] - Event argument.
		* @returns Event
		*/
		public static GetEvent(e?:Event):Event;
		/**
		* Get object containing information about modifier keys currently being active.
		* @function GetModifierKeys
		* @static
		* @returns Fit.EventTypeDefs.ModifierKeys
		*/
		public static GetModifierKeys():Fit.EventTypeDefs.ModifierKeys;
		/**
		* Get object containing information about pointer.
		Object contains the following properties:
		Buttons.Primary/Secondary: Is True if given button is being held down
		Coordinates.ViewPort.X/Y: Mouse coordinates within viewport
		Coordinates.Document.X/Y: Mouse coordinates within document which might have been scrolled.
		* @function GetPointerState
		* @static
		* @returns Fit.EventTypeDefs.PointerState
		*/
		public static GetPointerState():Fit.EventTypeDefs.PointerState;
		/**
		* Get a reference to the secondary object related to an event - e.g. the element losing
		focus in a focus event handler. Returns Null if there is no related event object, or if
		not supported by the browser.
		* @function GetRelatedTarget
		* @static
		* @param {Event} [e=undefined] - Event argument.
		* @returns HTMLElement | null
		*/
		public static GetRelatedTarget(e?:Event):HTMLElement | null;
		/**
		* Get a reference to the object that is affected by an event.
		* @function GetTarget
		* @static
		* @param {Event} [e=undefined] - Event argument.
		* @returns HTMLElement
		*/
		public static GetTarget(e?:Event):HTMLElement;
		/**
		* Registers OnReady handler which gets fired when DOM is ready for manipulation, or if it is already ready.
		* @function OnDomReady
		* @static
		* @param {Function} callback - JavaScript function to register.
		*/
		public static OnDomReady(callback:Function):void;
		/**
		* Registers OnReady handler which gets fired when document is ready, or if it is already ready.
		* @function OnReady
		* @static
		* @param {Function} callback - JavaScript function to register.
		*/
		public static OnReady(callback:Function):void;
		/**
		* Prevent default behaviour triggered by given event - returns False.
		* @function PreventDefault
		* @static
		* @param {Event} [e=undefined] - Event argument.
		* @returns boolean
		*/
		public static PreventDefault(e?:Event):boolean;
		/**
		* Remove event handler given by Event ID returned from Fit.Events.AddHandler(..).
		* @function RemoveHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) from which event handler is removed.
		* @param {number} eventId - Event ID identifying handler to remove.
		*/
		public static RemoveHandler(element:EventTarget, eventId:number):void;
		/**
		* Remove event handler for specified event on given EventTarget.
		* @function RemoveHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) from which event handler is removed.
		* @param {string} event - Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.).
		* @param {Function} eventFunction - JavaScript function to remove.
		*/
		public static RemoveHandler(element:EventTarget, event:string, eventFunction:Function):void;
		/**
		* Remove event handler for specified event on given EventTarget.
		* @function RemoveHandler
		* @static
		* @param {EventTarget} element - EventTarget (e.g. Window or DOMElement) from which event handler is removed.
		* @param {string} event - Event name without 'on' prefix (e.g. 'load', 'mouseover', 'click' etc.).
		* @param {boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }} useCaptureOrOptions - Value indicating whether event handler was registered using event capturing (True) or event bubbling (False).
		If event handler was registered with event options for more fine-grained control, these options are passed instead.
		* @param {Function} eventFunction - JavaScript function to remove.
		*/
		public static RemoveHandler(element:EventTarget, event:string, useCaptureOrOptions:boolean | { Capture?: boolean, Once?: boolean, Passive?: boolean }, eventFunction:Function):void;
		/**
		* Remove mutation observer.
		* @function RemoveMutationObserver
		* @static
		* @param {HTMLElement} elm - DOMElement being observed.
		* @param {Fit.EventsTypeDefs.MutationObserverCallback} obs - JavaScript observer function to remove.
		* @param {boolean} [deep=undefined] - If defined, observer must have been registered with the same deep value to be removed.
		*/
		public static RemoveMutationObserver(elm:HTMLElement, obs:Fit.EventsTypeDefs.MutationObserverCallback, deep?:boolean):void;
		/**
		* Remove mutation observer by ID.
		* @function RemoveMutationObserver
		* @static
		* @param {number} id - Observer ID returned from AddMutationObserver(..) function.
		*/
		public static RemoveMutationObserver(id:number):void;
		/**
		* Completely suppress event which is equivalent of
		calling both PreventDefault(e) and StopPropagation(e).
		Returns False.
		* @function Stop
		* @static
		* @param {Event} [e=undefined] - Event argument.
		* @returns boolean
		*/
		public static Stop(e?:Event):boolean;
		/**
		* Prevent given event from propagating (bubble up) - returns False.
		* @function StopPropagation
		* @static
		* @param {Event} [e=undefined] - Event argument.
		* @returns boolean
		*/
		public static StopPropagation(e?:Event):boolean;
	}
	/**
	* 
	* @namespace [Fit.EventsTypeDefs EventsTypeDefs]
	*/
	namespace EventsTypeDefs
	{
		// Functions defined by Fit.EventsTypeDefs
		/**
		* Event handler callback used with Fit.Events.AddHandler(..).
		* @callback EventHandlerCallbackBeforeUnload
		* @param {BeforeUnloadEvent} e - Event argument.
		* @returns any
		*/
		type EventHandlerCallbackBeforeUnload = (e:BeforeUnloadEvent) => any;
		/**
		* Event handler callback used with Fit.Events.AddHandler(..).
		* @callback EventHandlerCallbackClipboard
		* @param {ClipboardEvent} e - Event argument.
		* @returns any
		*/
		type EventHandlerCallbackClipboard = (e:ClipboardEvent) => any;
		/**
		* Event handler callback used with Fit.Events.AddHandler(..).
		* @callback EventHandlerCallbackFocus
		* @param {FocusEvent} e - Event argument.
		* @returns any
		*/
		type EventHandlerCallbackFocus = (e:FocusEvent) => any;
		/**
		* Event handler callback used with Fit.Events.AddHandler(..).
		* @callback EventHandlerCallbackGeneric
		* @param {Event} e - Event argument.
		* @returns any
		*/
		type EventHandlerCallbackGeneric = (e:Event) => any;
		/**
		* Event handler callback used with Fit.Events.AddHandler(..).
		* @callback EventHandlerCallbackHashChange
		* @param {HashChangeEvent} e - Event argument.
		* @returns any
		*/
		type EventHandlerCallbackHashChange = (e:HashChangeEvent) => any;
		/**
		* Event handler callback used with Fit.Events.AddHandler(..).
		* @callback EventHandlerCallbackKeyboard
		* @param {KeyboardEvent} e - Event argument.
		* @returns any
		*/
		type EventHandlerCallbackKeyboard = (e:KeyboardEvent) => any;
		/**
		* Event handler callback used with Fit.Events.AddHandler(..).
		* @callback EventHandlerCallbackMouse
		* @param {MouseEvent} e - Event argument.
		* @returns any
		*/
		type EventHandlerCallbackMouse = (e:MouseEvent) => any;
		/**
		* Event handler callback used with Fit.Events.AddHandler(..).
		* @callback EventHandlerCallbackPopState
		* @param {PopStateEvent} e - Event argument.
		* @returns any
		*/
		type EventHandlerCallbackPopState = (e:PopStateEvent) => any;
		/**
		* Event handler callback used with Fit.Events.AddHandler(..).
		* @callback EventHandlerCallbackRooted
		* @param {HTMLElement} dom - DOM element.
		* @returns any
		*/
		type EventHandlerCallbackRooted = (dom:HTMLElement) => any;
		/**
		* Event handler callback used with Fit.Events.AddHandler(..).
		* @callback EventHandlerCallbackStorage
		* @param {StorageEvent} e - Event argument.
		* @returns any
		*/
		type EventHandlerCallbackStorage = (e:StorageEvent) => any;
		/**
		* Event handler callback used with Fit.Events.AddMutationObserver(..).
		* @callback MutationObserverCallback
		* @param {HTMLElement} dom - DOM element.
		* @returns any
		*/
		type MutationObserverCallback = (dom:HTMLElement) => any;
	}
	/**
	* 
	* @class [Fit.Internationalization Internationalization]
	*/
	class Internationalization
	{
		// Functions defined by Fit.Internationalization
		/**
		* Register information such as translations related to a specific language and country.
		* @function AddLocalization
		* @static
		* @param {Function} type - Object type associated with localization information - e.g. MyApp.ContactForm.
		* @param {Object} translations - Object array containing language and country specific information such as translations.
		The object array must be indexed using locale keys, and "en" must be defined first.
		Example: { "en": {}, "en_GB": {}, "da": {} }
		Every language inherits all the information from "en", and country specific information
		such as "de_AT" automatically inherits everything from "de" - in which case
		"de" must be declared first.
		Information can be obtained from within instances of the given type using:
		Fit.Internationalization.GetLocale(this); // Translations for current locale
		Fit.Internationalization.GetLocale(this, "de_AT"); // Translations for specific locale
		Naturally "this" is an instance of MyApp.ContactForm in this example.
		*/
		public static AddLocalization(type:Function, translations:Object):void;
		/**
		* Get type specific locale information registered using Fit.Internationalization.AddLocalization(..).
		* @function GetLocale
		* @static
		* @param {any} instance - Instance of type used to register locale information.
		* @param {string} [locale=undefined] - If defined, information for specified locale such as en, en_GB, or da is returned.
		If not found, en (en_US) is returned. If omitted, information for current locale is returned.
		* @returns any
		*/
		public static GetLocale(instance:any, locale?:string):any;
		/**
		* Get locale object such as:
		{
		     Formatting:
		     {
		         DecimalSeparator: '.',
		         ThousandsSeparator: ',',
		         DateFormat: 'MM/DD/YYYY',
		         TimeFormat: 'hh:mm',
		         TimeFormatLong: 'hh:mm:ss',
		         ClockHours: 12 // 24 or 12 (AM/PM)
		     },
		     Translations:
		     {
		         Required: 'Field is required'
		     }
		}.
		* @function GetSystemLocale
		* @static
		* @param {string} [localeKey=undefined] - If defined, specified locale such as en, en_GB, or da is returned. If not
		found, en (en_US) is returned. If omitted, current locale is returned.
		* @returns any
		*/
		public static GetSystemLocale(localeKey?:string):any;
		/**
		* Get/set active locale. Value returned is a lower cased string such as
		"en", "en_us", "de", etc. Changing locale results in OnLocaleChanged being fired.
		* @function Locale
		* @static
		* @param {string} [locale=undefined] - If defined, locale is updated with specified value (e.g. en, en_GB, da, etc.).
		* @returns string
		*/
		public static Locale(locale?:string):string;
		/**
		* Add event handler which is called if locale is changed.
		* @function OnLocaleChanged
		* @static
		* @param {Function} cb - Event handler which takes no arguments.
		*/
		public static OnLocaleChanged(cb:Function):void;
		/**
		* Remove event handler to avoid it being called when locale is changed.
		* @function RemoveOnLocaleChanged
		* @static
		* @param {Function} cb - Event handler to remove.
		*/
		public static RemoveOnLocaleChanged(cb:Function):void;
	}
	/**
	* Loader is a useful mechanism for loading styleheets and JavaScript on demand in a non blocking manner.
	* @class [Fit.Loader Loader]
	*/
	class Loader
	{
		// Functions defined by Fit.Loader
		/**
		* Load client script on demand in a non-blocking manner.
		
		ExecuteScript differs from LoadScript in the way code is loaded
		and executed. ExecuteScript loads the script using AJAX, meaning
		the script file either has to be located on the same domain as
		the application invoking ExecuteScript, or have the
		Access-Control-Allow-Origin header configured to allow file to be
		loaded from a foreign domain.
		The code loaded is injected into the virtual machine meaning debugging
		will not reveal from which file the code originated, although this
		information can be retrived by inspecting the call stack.
		ExecuteScript has the advantages that is allows for both an OnSuccess
		and OnFailure handler, and it allows for objects to be passed to
		the executing script using the context parameter, which will
		cause the code to execute within its own contained scope (closure).
		The script will execute in the global scope if no context object is provided.
		
		// Example of loading a JavaScript file, passing variables to it:
		
		Fit.Loader.ExecuteScript("extensions/test/test.js", function(src)
		{
		     alert("JavaScript " + src + " loaded and ready to be used!");
		},
		function(src)
		{
		     alert("JavaScript " + src + " could NOT be loaded;);
		
		}, { $: window.jQuery, mode: "advanced", showData: "users" });.
		* @function ExecuteScript
		* @static
		* @param {string} src - Script source (path or URL).
		* @param {Fit.LoaderTypeDefs.LoadSingleEventHandler} [onSuccess=undefined] - Callback function fired when script has been successfully loaded and executed.
		The function takes the script source requested as an argument.
		* @param {Fit.LoaderTypeDefs.LoadSingleEventHandler} [onFailure=undefined] - Callback function fired if script could not be loaded or executed successfully.
		The function takes the script source requested as an argument.
		* @param {any} [context=undefined] - Properties registered on the context object will be
		exposed as globally accessible objects for the executing script.
		Example: { jQuery: window.jQuery, $: window.jQuery }
		The script will execute in the global window scope if no
		context object is defined.
		*/
		public static ExecuteScript(src:string, onSuccess?:Fit.LoaderTypeDefs.LoadSingleEventHandler, onFailure?:Fit.LoaderTypeDefs.LoadSingleEventHandler, context?:any):void;
		/**
		* Load client script on demand in a non-blocking manner.
		
		// Example of loading a JavaScript file
		
		Fit.Loader.LoadScript("extensions/test/test.js", function(src)
		{
		     alert("JavaScript " + src + " loaded and ready to be used!");
		});.
		* @function LoadScript
		* @static
		* @param {string} source - Script source (path or URL).
		* @param {Fit.LoaderTypeDefs.LoadSingleEventHandler} [cb=undefined] - Callback function fired when script loading is complete - takes the script source requested as an argument.
		Be aware that a load error will also trigger the callback to make sure control is always returned.
		Consider using feature detection within callback function for most reliable execution - example:
		if (expectedObjectOrFunction) { // Successfully loaded, continue..  }.
		*/
		public static LoadScript(source:string, cb?:Fit.LoaderTypeDefs.LoadSingleEventHandler):void;
		/**
		* Load client script on demand in a non-blocking manner.
		
		// Example of loading a JavaScript file
		
		Fit.Loader.LoadScript("extensions/test/test.js", { id: "my-script", charset: "UTF-8" }, function(src)
		{
		     alert("JavaScript " + src + " loaded and ready to be used!");
		});.
		* @function LoadScript
		* @static
		* @param {string} source - Script source (path or URL).
		* @param {Object.<string, string>} attributes - Attributes registered with script block.
		* @param {Fit.LoaderTypeDefs.LoadSingleEventHandler} [cb=undefined] - Callback function fired when script loading is complete - takes the script source requested as an argument.
		Be aware that a load error will also trigger the callback to make sure control is always returned.
		Consider using feature detection within callback function for most reliable execution - example:
		if (expectedObjectOrFunction) { // Successfully loaded, continue..  }.
		*/
		public static LoadScript(source:string, attributes:{[key:string]: string}, cb?:Fit.LoaderTypeDefs.LoadSingleEventHandler):void;
		/**
		* Chain load multiple client scripts on demand in a non-blocking manner.
		
		// Example of loading multiple JavaScript files in serial:
		
		Fit.Loader.LoadScripts(
		[
		     {
		          source: "extensions/test/menu.js",
		          attributes: { id: "my-script" },
		          loaded: function(cfg) { alert("JavaScript " + cfg.source + " loaded"); }
		     },
		     {
		          source: "http://cdn.domain.com/chat.js",
		          attributes: { id: "another-script" },
		          loaded: function(cfg) { alert("JavaScript " + cfg.source + " loaded"); }
		     }
		],
		function(cfgs)
		{
		     alert("All files loaded");
		});
		
		First argument is an array of script configurations:
		source:string (required): Script source (path or URL)
		loaded:function (optional): Callback function to execute when file has loaded (takes file configuration as argument)
		Be aware that loaded callback is invoked even if a load error occures, to make sure control is returned to your code.
		
		Second argument is the callback function fired when all files have finished loading - takes configuration array as argument.
		This too may be invoked even if a load error occured, to make sure control is returned to your code.
		
		Consider using feature detection within callback functions for super reliable execution - example:
		if (expectedObjectOrFunction) { // Successfully loaded, continue..  }.
		* @function LoadScripts
		* @static
		* @param {Fit.LoaderTypeDefs.ResourceConfiguration[]} cfg - Configuration array (see function description for details).
		* @param {Fit.LoaderTypeDefs.LoadMultiConfigurationsEventHandler} [callback=undefined] - Callback function fired when all scripts have finished loading (see function description for details).
		*/
		public static LoadScripts(cfg:Fit.LoaderTypeDefs.ResourceConfiguration[], callback?:Fit.LoaderTypeDefs.LoadMultiConfigurationsEventHandler):void;
		/**
		* Load CSS stylesheet on demand in a non-blocking manner.
		It is recommended to load stylesheets before rendering items using
		the CSS classes to avoid FOUC (Flash Of Unstyled Content).
		
		// Example of loading a CSS file
		
		Fit.Loader.LoadStyleSheet("extensions/test/layout.css", function(src)
		{
		     alert("CSS file " + src + " loaded!");
		});.
		* @function LoadStyleSheet
		* @static
		* @param {string} src - CSS file source (path or URL).
		* @param {Fit.LoaderTypeDefs.LoadSingleEventHandler} [callback=undefined] - Callback function fired when CSS file loading is complete - takes the file source requested as an argument.
		Be aware that a load error will also trigger the callback to make sure control is always returned.
		*/
		public static LoadStyleSheet(src:string, callback?:Fit.LoaderTypeDefs.LoadSingleEventHandler):void;
		/**
		* Load multiple stylesheets in parrallel in a non-blocking manner.
		
		// Example of loading multiple CSS files:
		
		Fit.Loader.LoadStyleSheets(
		[
		     {
		          source: "extensions/test/menu.css",
		          loaded: function(cfg) { alert("Stylesheet " + cfg.source + " loaded"); }
		     },
		     {
		          source: "http://cdn.domain.com/chat.css",
		          loaded: function(cfg) { alert("Stylesheet " + cfg.source + " loaded"); }
		     }
		],
		function(cfgs)
		{
		     alert("All stylesheets loaded");
		});
		
		First argument is an array of stylesheet configurations:
		source:string (required): Stylesheet source (path or URL)
		loaded:function (optional): Callback function to execute when stylesheet has loaded (takes stylesheet configuration as argument)
		Be aware that loaded callback is invoked even if a load error occures, to make sure control is returned to your code.
		
		Second argument is the callback function fired when all stylesheets have finished loading - takes configuration array as argument.
		This too may be invoked even if a load error occured, to make sure control is returned to your code.
		* @function LoadStyleSheets
		* @static
		* @param {Fit.LoaderTypeDefs.ResourceConfiguration[]} cfg - Configuration array (see function description for details).
		* @param {Fit.LoaderTypeDefs.LoadMultiConfigurationsEventHandler} [callback=undefined] - Callback function fired when all stylesheets have finished loading (see function description for details).
		*/
		public static LoadStyleSheets(cfg:Fit.LoaderTypeDefs.ResourceConfiguration[], callback?:Fit.LoaderTypeDefs.LoadMultiConfigurationsEventHandler):void;
	}
	/**
	* 
	* @namespace [Fit.LoaderTypeDefs LoaderTypeDefs]
	*/
	namespace LoaderTypeDefs
	{
		// Functions defined by Fit.LoaderTypeDefs
		/**
		* Callback invoked when all resources are loaded.
		* @callback LoadMultiConfigurationsEventHandler
		* @param {Fit.LoaderTypeDefs.ResourceConfiguration[]} cfgs - Resources loaded.
		*/
		type LoadMultiConfigurationsEventHandler = (cfgs:Fit.LoaderTypeDefs.ResourceConfiguration[]) => void;
		/**
		* Callback invoked when resource is loaded.
		* @callback LoadSingleConfigurationEventHandler
		* @param {Fit.LoaderTypeDefs.ResourceConfiguration} cfg - Resource loaded.
		*/
		type LoadSingleConfigurationEventHandler = (cfg:Fit.LoaderTypeDefs.ResourceConfiguration) => void;
		/**
		* Callback invoked when resource is loaded.
		* @callback LoadSingleEventHandler
		* @param {string} src - Resource loaded.
		*/
		type LoadSingleEventHandler = (src:string) => void;
		/**
		* Resource configuration.
		* @class [Fit.LoaderTypeDefs.ResourceConfiguration ResourceConfiguration]
		*/
		class ResourceConfiguration
		{
			// Properties defined by Fit.LoaderTypeDefs.ResourceConfiguration
			/**
			* Attributes registered with script block.
			* @member {Object.<string, string>} [attributes=undefined]
			*/
			attributes?:{[key:string]: string};
			/**
			* Callback invoked when resource is loaded.
			* @member {Fit.LoaderTypeDefs.LoadSingleConfigurationEventHandler} [loaded=undefined]
			*/
			loaded?:Fit.LoaderTypeDefs.LoadSingleConfigurationEventHandler;
			/**
			* Path to resource.
			* @member {string} source
			*/
			source:string;
		}
	}
	/**
	* Math related functionality.
	* @namespace [Fit.Math Math]
	*/
	namespace Math
	{
		// Functions defined by Fit.Math
		/**
		* Format value to produce a number with the specified number of decimals.
		Value is properly rounded off to ensure best precision.
		* @function Format
		* @static
		* @param {number} value - Number to format.
		* @param {number} decimals - Desired number of decimals.
		* @param {string} [decimalSeparator=undefined] - If defined, the specified decimal separator will be used.
		* @returns string
		*/
		export function Format(value:number, decimals:number, decimalSeparator?:string):string;
		/**
		* Get random integer value.
		* @function Random
		* @static
		* @param {number} [min=undefined] - Minimum value - assumes 0 if not defined.
		* @param {number} [max=undefined] - Maximum value - assumes Number.MAX_SAFE_INTEGER (9007199254740991) if not defined.
		* @returns number
		*/
		export function Random(min?:number, max?:number):number;
		/**
		* Round off value to a number with the specified precision.
		* @function Round
		* @static
		* @param {number} value - Number to round off.
		* @param {number} precision - Desired precision.
		* @param {Fit.Math.MidpointRounding | "AwayFromZero" | "Down" | "Up"} [midpointRounding=undefined] - Argument specifies how the function processes a number that is midway between
		two numbers - defaults to Fit.Math.MidpointRounding.AwayFromZero if not specified.
		* @returns number
		*/
		export function Round(value:number, precision:number, midpointRounding?:Fit.Math.MidpointRounding | "AwayFromZero" | "Down" | "Up"):number;
		/**
		* Enum values determining how a rounding mechanism processes a number that is midway between two numbers.
		* @enum {string}
		*/
		enum MidpointRounding
		{
			/** When a number is midway between two others, the value is rounded towards the nearest number away from zero. Examples:
		1.4 becomes 1, 1.5 (midway) becomes 2, and 1.6 becomes 2.
		-1,4 becomes -1, -1,5 (midway) becomes -2, and -1.6 becomes -2.
		This is the default behaviour of PHP's round(..) function and .NET's Math.Round(..) function. */
			AwayFromZero = "AwayFromZero",
			/** When a number is midway between two others, the value is rounded down towards a negative value. Examples:
		1.4 becomes 1, 1.5 (midway) becomes 1, and 1.6 becomes 2.
		-1,4 becomes -1, -1,5 (midway) becomes -2, and -1.6 becomes -2.
		This is the reverse behaviour of Fit.Math.MidpointRounding.Up. */
			Down = "Down",
			/** When a number is midway between two others, the value is rounded up towards a positive value. Examples:
		1.4 becomes 1, 1.5 (midway) becomes 2, and 1.6 becomes 2.
		-1,4 becomes -1, -1,5 (midway) becomes -1, and -1.6 becomes -2.
		This is the default behaviour for JavaScript's Math.round(..) function. */
			Up = "Up"
		}
	}
	/**
	* 
	* @class [Fit.String String]
	*/
	class String
	{
		// Functions defined by Fit.String
		/**
		* Decode special characters represented as HTML entities back into their actual characters.
		* @function DecodeHtml
		* @static
		* @param {string} str - String to decode.
		* @returns string
		*/
		public static DecodeHtml(str:string):string;
		/**
		* Encode special characters into HTML entities.
		* @function EncodeHtml
		* @static
		* @param {string} str - String to encode.
		* @returns string
		*/
		public static EncodeHtml(str:string):string;
		/**
		* Get Java compatible Hash Code from string.
		* @function Hash
		* @static
		* @param {string} str - String to get hash code from.
		* @returns number
		*/
		public static Hash(str:string):number;
		/**
		* Removes any HTML contained in string, and returns the raw text value.
		* @function StripHtml
		* @static
		* @param {string} str - String to strip HTML from.
		* @returns string
		*/
		public static StripHtml(str:string):string;
		/**
		* Removes any whitespaces in beginning and end of string passed, and returns the new string.
		* @function Trim
		* @static
		* @param {string} str - String to trim.
		* @returns string
		*/
		public static Trim(str:string):string;
		/**
		* Returns string with first letter upper cased.
		* @function UpperCaseFirst
		* @static
		* @param {string} str - String to turn first letter into upper case.
		* @returns string
		*/
		public static UpperCaseFirst(str:string):string;
	}
	/**
	* Templating engine allowing for separation between layout and logic.
	
	// Example code
	
	// Load template (asynchronously)
	var tpl = new Fit.Template(true);
	tpl.LoadUrl(&quot;UserListView.html&quot;, function(sender)
	{
	&#160;&#160;&#160;&#160; // Populate placeholders
	&#160;&#160;&#160;&#160; tpl.Content.Title = &quot;User list&quot;;
	&#160;&#160;&#160;&#160; tpl.Content.Description = &quot;List of users created in system&quot;;
	
	&#160;&#160;&#160;&#160; // Load user data
	&#160;&#160;&#160;&#160; var users = getUsers();
	
	&#160;&#160;&#160;&#160; // Populate user list with data
	&#160;&#160;&#160;&#160; Fit.Array.ForEach(users, function(userData)
	&#160;&#160;&#160;&#160; {
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; var user = tpl.Content.Users.AddItem();
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; user.Name = userData.Name;
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; user.Role = userData.Role;
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; user.Email = userData.Email;
	&#160;&#160;&#160;&#160; });
	
	&#160;&#160;&#160;&#160; // Push changes to DOM
	&#160;&#160;&#160;&#160; tpl.Update();
	});
	tpl.Render(document.getElementById("UserList"));
	
	// HTML template example (UserListView.html)
	
	&lt;h1&gt;{[Title]}&lt;/h1&gt;
	&lt;p&gt;{[Description]}&lt;/p&gt;
	&lt;table&gt;
	&#160;&#160;&#160;&#160; &lt;tr&gt;
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;User ID&lt;/b&gt;&lt;/td&gt;
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;Name&lt;/b&gt;&lt;/td&gt;
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;E-mail&lt;/b&gt;&lt;/td&gt;
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;Department&lt;/b&gt;&lt;/td&gt;
	&#160;&#160;&#160;&#160; &lt;/tr&gt;
	&#160;&#160;&#160;&#160; &lt;!-- LIST Users --&gt;
	&#160;&#160;&#160;&#160; &lt;tr&gt;
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;{[Name]}&lt;/td&gt;
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;{[Role]}&lt;/td&gt;
	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;{[Email]}&lt;/td&gt;
	&#160;&#160;&#160;&#160; &lt;/tr&gt;
	&#160;&#160;&#160;&#160; &lt;!-- /LIST Users --&gt;
	&lt;/table&gt;.
	* @class [Fit.Template Template]
	*/
	class Template
	{
		// Properties defined by Fit.Template
		/**
		* Once template is loaded, any placeholder or list will be accessible
		through the Content property. A placeholder identified as UserRole
		will be accessible as templateInstance.Content.UserRole.
		UserRole is a property that can be set with either a string,
		an instance of a Fit.UI control, or a DOMElement.
		A list identified as Users is accessible using
		templateInstance.Content.Users. See Fit.TemplateList for
		additional information.
		* @member {any} Content
		*/
		Content:any;
		// Functions defined by Fit.Template
		/**
		* Add event handler to element within template given by element ID - event handler ID is returned.
		* @function AddEventHandler
		* @param {string} elmId - Element ID.
		* @param {"keydown" | "keyup" | "keypress"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackKeyboard} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public AddEventHandler(elmId:string, event:"keydown" | "keyup" | "keypress", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackKeyboard):number;
		/**
		* Add event handler to element within template given by element ID - event handler ID is returned.
		* @function AddEventHandler
		* @param {string} elmId - Element ID.
		* @param {"click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "mousewheel"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackMouse} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public AddEventHandler(elmId:string, event:"click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "mousewheel", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackMouse):number;
		/**
		* Add event handler to element within template given by element ID - event handler ID is returned.
		* @function AddEventHandler
		* @param {string} elmId - Element ID.
		* @param {"popstate"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackPopState} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public AddEventHandler(elmId:string, event:"popstate", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackPopState):number;
		/**
		* Add event handler to element within template given by element ID - event handler ID is returned.
		* @function AddEventHandler
		* @param {string} elmId - Element ID.
		* @param {"hashchange"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackHashChange} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public AddEventHandler(elmId:string, event:"hashchange", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackHashChange):number;
		/**
		* Add event handler to element within template given by element ID - event handler ID is returned.
		* @function AddEventHandler
		* @param {string} elmId - Element ID.
		* @param {"focus" | "focusin" | "focusout" | "blur"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackFocus} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public AddEventHandler(elmId:string, event:"focus" | "focusin" | "focusout" | "blur", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackFocus):number;
		/**
		* Add event handler to element within template given by element ID - event handler ID is returned.
		* @function AddEventHandler
		* @param {string} elmId - Element ID.
		* @param {"beforeunload"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackBeforeUnload} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public AddEventHandler(elmId:string, event:"beforeunload", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackBeforeUnload):number;
		/**
		* Add event handler to element within template given by element ID - event handler ID is returned.
		* @function AddEventHandler
		* @param {string} elmId - Element ID.
		* @param {"cut" | "copy" | "paste"} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackClipboard} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public AddEventHandler(elmId:string, event:"cut" | "copy" | "paste", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackClipboard):number;
		/**
		* Add event handler to element within template given by element ID - event handler ID is returned.
		* @function AddEventHandler
		* @param {string} elmId - Element ID.
		* @param {"#rooted"} event - Event name.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackRooted} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public AddEventHandler(elmId:string, event:"#rooted", eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackRooted):number;
		/**
		* Add event handler to element within template given by element ID - event handler ID is returned.
		* @function AddEventHandler
		* @param {string} elmId - Element ID.
		* @param {string} event - Event name without the 'on' prefix.
		* @param {Fit.EventsTypeDefs.EventHandlerCallbackGeneric} eventFunction - JavaScript function to register.
		* @returns number
		*/
		public AddEventHandler(elmId:string, event:string, eventFunction:Fit.EventsTypeDefs.EventHandlerCallbackGeneric):number;
		/**
		* Get/set flag indicating whether unsafe string values are handled or not.
		If AllowUnsafeContent is True, arbitrary code can be added to the template
		and will be intepreted by the browser. If AllowUnsafeContent is False,
		potentially unsafe code will be encoded and displayed as is without interpretation.
		* @function AllowUnsafeContent
		* @param {boolean} [val=undefined] - If defined, handling of string encoding is changed to reflect value.
		* @returns boolean
		*/
		public AllowUnsafeContent(val?:boolean):boolean;
		/**
		* Dispose template to free up memory.
		* @function Dispose
		*/
		public Dispose():void;
		/**
		* Get HTML from template including any changes made.
		* @function GetHtml
		* @returns string
		*/
		public GetHtml():string;
		/**
		* Load HTML string into template.
		* @function LoadHtml
		* @param {string} htmlSource - HTML string.
		*/
		public LoadHtml(htmlSource:string):void;
		/**
		* Load HTML from URL asynchronously.
		* @function LoadUrl
		* @param {string} url - URL to HTML template.
		* @param {Fit.TemplateTypeDefs.LoadUrlCallback} cb - Callback function invoked once HTML template has
		been loaded. Template instance and raw HTML data
		is passed to function. At this point placeholders
		and lists are accessible from the Content propery.
		*/
		public LoadUrl(url:string, cb:Fit.TemplateTypeDefs.LoadUrlCallback):void;
		/**
		* Remove event handler by event ID returned by AddEventHandler(..).
		* @function RemoveEventHandler
		* @param {number} eventId - Event ID.
		*/
		public RemoveEventHandler(eventId:number):void;
		/**
		* Render template, either inline or to element specified.
		* @function Render
		* @param {HTMLElement} [toElement=undefined] - If defined, template is rendered to this element.
		*/
		public Render(toElement?:HTMLElement):void;
		/**
		* Resets template - all data and event handlers are removed. Change is not pushed to DOM automatically.
		* @function Reset
		*/
		public Reset():void;
		/**
		* Constructor - creates instance of Template class.
		* @function Template
		* @param {boolean} [refreshable=false] - Flag indicating whether template can be updated after being rendered
		to DOM. A value of True results in template being wrapped in a div container
		controlled by the templating system.
		* @param {boolean} [autoDispose=true] - Flag indicating whether Fit.UI controls should be automatically disposed
		when removed from view. Controls are disposed once changes are pushed to
		DOM using the Update() function.
		*/
		constructor(refreshable?:boolean, autoDispose?:boolean);
		/**
		* Push changes to DOM to make them visible through the user interface.
		* @function Update
		*/
		public Update():void;
	}
	/**
	* A template list is a dynamically created object representing
	a variable number of items containing placeholders. An example
	could be a list of Users containing information such as Name,
	Phone number, and E-mail address about each user.
	* @class [Fit.TemplateList TemplateList]
	*/
	class TemplateList
	{
		// Functions defined by Fit.TemplateList
		/**
		* Create list item represented by associative object
		array containing either strings or DOMElements.
		Example:
		var item = templateInstance.Content.MyList.AddItem();
		item["Name"] = "James Thompson";
		item["Email"] = "james@server.com";
		It is also possible to assign data using properties:
		item.ProfilePicture = document.createElement("img");
		item.ProfilePicture.src = "james.png";.
		* @function AddItem
		* @returns any
		*/
		public AddItem():any;
		/**
		* Clear list.
		* @function Clear
		*/
		public Clear():void;
		/**
		* Get all list items added using AddItem().
		* @function GetItems
		* @returns any[]
		*/
		public GetItems():any[];
		/**
		* Remove list item (associative object array).
		* @function RemoveItem
		* @param {any} item - Item to remove.
		*/
		public RemoveItem(item:any):void;
	}
	/**
	* 
	* @namespace [Fit.TemplateTypeDefs TemplateTypeDefs]
	*/
	namespace TemplateTypeDefs
	{
		// Functions defined by Fit.TemplateTypeDefs
		/**
		* Callback invoked when template is loaded.
		* @callback LoadUrlCallback
		* @param {Fit.Template} sender - Instance of Template.
		* @param {string} html - Template's HTML content.
		*/
		type LoadUrlCallback = (sender:Fit.Template, html:string) => void;
	}
	/**
	* Validation logic.
	* @class [Fit.Validation Validation]
	*/
	class Validation
	{
		// Functions defined by Fit.Validation
		/**
		* Set or get flag indicating whether type checking should take place (DebugMode).
		* @function Enabled
		* @static
		* @param {boolean} val - True enables DebugMode, False disables DebugMode.
		*/
		public static Enabled(val:boolean):void;
		/**
		* Throws error if passed object is not an instance of Array.
		* @function ExpectArray
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectArray(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a boolean.
		* @function ExpectBoolean
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectBoolean(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a collection that can be iterated.
		* @function ExpectCollection
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectCollection(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Date.
		* @function ExpectDate
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectDate(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a dictionary (associative array / object array),
		contaning only objects/values of type given by validation callback.
		Example: Fit.Validation.ExpectDictionary(dict, Fit.Validation.ExpectString).
		* @function ExpectDictionary
		* @static
		* @param {any} val - Dictionary to validate.
		* @param {Function} typeValCallback - Value validation callback.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectDictionary(val:any, typeValCallback:Function, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of HTMLElement.
		* @function ExpectElement
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectElement(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Event.
		* @function ExpectEvent
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectEvent(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of EventTarget.
		* @function ExpectEventTarget
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectEventTarget(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a valid function.
		* @function ExpectFunction
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectFunction(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of specified type.
		* @function ExpectInstance
		* @static
		* @param {any} val - Object to validate.
		* @param {any} instanceType - Instance type (constructor, e.g. Fit.Http.Request).
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectInstance(val:any, instanceType:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Array
		contaning only instances of specified type. Example:
		Fit.Validation.ExpectInstanceArray(arr, Fit.Controls.TreeViewNode).
		* @function ExpectInstanceArray
		* @static
		* @param {any} val - Object to validate.
		* @param {any} instanceType - Instance type (constructor, e.g. Fit.Http.Request).
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectInstanceArray(val:any, instanceType:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an integer.
		* @function ExpectInteger
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectInteger(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is either Null or Undefined.
		* @function ExpectIsSet
		* @static
		* @param {any} val - Object to validate.
		*/
		public static ExpectIsSet(val:any):void;
		/**
		* Throws error if passed object is not an instance of Element, Text, or Comment.
		* @function ExpectNode
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectNode(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a number.
		* @function ExpectNumber
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectNumber(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a valid object such as { Name: 'Jimmy', Age: 34 }.
		* @function ExpectObject
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectObject(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of RegExp.
		* @function ExpectRegExp
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectRegExp(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a string.
		* @function ExpectString
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectString(val:any, allowNotSet?:boolean):void;
		/**
		* Same as Fit.Validation.ExpectString(..), but string must contain an actual value if set (not be empty).
		* @function ExpectStringValue
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectStringValue(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Array
		contaning only objects/values of type given by validation callback.
		Example: Fit.Validation.ExpectTypeArray(arr, Fit.Validation.ExpectString).
		* @function ExpectTypeArray
		* @static
		* @param {any} val - Object to validate.
		* @param {Function} typeValCallback - Value validation callback.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectTypeArray(val:any, typeValCallback:Function, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Window.
		* @function ExpectWindow
		* @static
		* @param {any} val - Object to validate.
		* @param {boolean} [allowNotSet=false] - Set True to allow object to be Null or Undefined.
		*/
		public static ExpectWindow(val:any, allowNotSet?:boolean):void;
		/**
		* Returns True if specified object is set (not Null or Undefined), otherwise False.
		* @function IsSet
		* @static
		* @param {any} val - Object to validate.
		*/
		public static IsSet(val:any):void;
		/**
		* Throw error and provide stack trace to browser console.
		* @function ThrowError
		* @static
		* @param {string} msg - Error message.
		*/
		public static ThrowError(msg:string):void;
	}
	/**
	* 
	* @namespace [Fit._internal _internal]
	*/
	namespace _internal
	{
		/**
		* 
		* @namespace [Fit._internal.Controls Controls]
		*/
		namespace Controls
		{
			/**
			* Allows for manipulating control (appearance, features, and behaviour).
			Features are NOT guaranteed to be backward compatible, and incorrect use might break control!.
			* @namespace [Fit._internal.Controls.Input Input]
			*/
			namespace Input
			{
				/**
				* Internal settings related to blob storage management in HTML Editor (Design Mode).
				* @class [Fit._internal.Controls.Input.BlobManager BlobManager]
				*/
				class BlobManager
				{
					// Properties defined by Fit._internal.Controls.Input.BlobManager
					/**
					* Dispose images from blob storage (revoke blob URLs) added though image plugins when control is disposed.
					If "UnreferencedOnly" is specified, the component using Fit.UI's input control will be responsible for
					disposing referenced blobs. Failing to do so may cause a memory leak.
					* @member {'All' | 'UnreferencedOnly'} RevokeBlobUrlsOnDispose
					* @static
					*/
					static RevokeBlobUrlsOnDispose:'All' | 'UnreferencedOnly';
					/**
					* Dispose images from blob storage (revoke blob URLs) added through Value(..)
					function when control is disposed. Basically ownership of these blobs are handed
					over to the control for the duration of its life time.
					These images are furthermore subject to the rule set in RevokeBlobUrlsOnDispose.
					* @member {boolean} RevokeExternalBlobUrlsOnDispose
					* @static
					*/
					static RevokeExternalBlobUrlsOnDispose:boolean;
				}
				/**
				* Internal settings related to HTML Editor (Design Mode).
				* @class [Fit._internal.Controls.Input.Editor Editor]
				*/
				class Editor
				{
					// Properties defined by Fit._internal.Controls.Input.Editor
					/**
					* Additional plugins used with DesignMode.
					* @member {('htmlwriter' | 'justify' | 'pastefromword' | 'resize' | 'base64image' | 'base64imagepaste' | 'dragresize')[]} Plugins
					* @static
					*/
					static Plugins:('htmlwriter' | 'justify' | 'pastefromword' | 'resize' | 'base64image' | 'base64imagepaste' | 'dragresize')[];
					/**
					* Skin used with DesignMode - must be set before an editor is created and cannot be changed for each individual control.
					* @member {'bootstrapck' | 'moono-lisa' | null} Skin
					* @static
					*/
					static Skin:'bootstrapck' | 'moono-lisa' | null;
					/**
					* Toolbar buttons used with DesignMode - make sure necessary plugins are loaded (see Fit._internal.Controls.Input.EditorPlugins).
					* @member {( { name: 'BasicFormatting', items: ('Bold' | 'Italic' | 'Underline')[] } | { name: 'Justify', items: ('JustifyLeft' | 'JustifyCenter' | 'JustifyRight')[] } | { name: 'Lists', items: ('NumberedList' | 'BulletedList' | 'Indent' | 'Outdent')[] } | { name: 'Links', items: ('Link' | 'Unlink')[] } | { name: 'Insert', items: ('base64image')[] } )[]} Toolbar
					* @static
					*/
					static Toolbar:( { name: 'BasicFormatting', items: ('Bold' | 'Italic' | 'Underline')[] } | { name: 'Justify', items: ('JustifyLeft' | 'JustifyCenter' | 'JustifyRight')[] } | { name: 'Lists', items: ('NumberedList' | 'BulletedList' | 'Indent' | 'Outdent')[] } | { name: 'Links', items: ('Link' | 'Unlink')[] } | { name: 'Insert', items: ('base64image')[] } )[];
				}
			}
		}
	}
	/**
	* 
	* @namespace [Fit.BrowserTypeDefs BrowserTypeDefs]
	*/
	namespace BrowserTypeDefs
	{
		/**
		* Object representing browser app environment.
		* @class [Fit.BrowserTypeDefs.BrowserAppInfo BrowserAppInfo]
		*/
		class BrowserAppInfo
		{
			// Properties defined by Fit.BrowserTypeDefs.BrowserAppInfo
			/**
			* Browser app name.
			* @member {"Edge" | "EdgeChromium" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "OperaChromium" | "Unknown"} Name
			*/
			Name:"Edge" | "EdgeChromium" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "OperaChromium" | "Unknown";
			// Properties defined by Fit.BrowserTypeDefs.BrowserDetails
			/**
			* Boolean indicating whether this is a mobile device (tablet or phone).
			* @member {boolean} IsMobile
			*/
			IsMobile:boolean;
			/**
			* Boolean indicating whether this is a phone.
			* @member {boolean} IsPhone
			*/
			IsPhone:boolean;
			/**
			* Boolean indicating whether this is a tablet device.
			* @member {boolean} IsTablet
			*/
			IsTablet:boolean;
			/**
			* Browser language, e.g. en, da, de, etc.
			* @member {string} Language
			*/
			Language:string;
			/**
			* Browser version.
			* @member {number} Version
			*/
			Version:number;
		}
		/**
		* Object representing browser details.
		* @class [Fit.BrowserTypeDefs.BrowserDetails BrowserDetails]
		*/
		class BrowserDetails
		{
			// Properties defined by Fit.BrowserTypeDefs.BrowserDetails
			/**
			* Boolean indicating whether this is a mobile device (tablet or phone).
			* @member {boolean} IsMobile
			*/
			IsMobile:boolean;
			/**
			* Boolean indicating whether this is a phone.
			* @member {boolean} IsPhone
			*/
			IsPhone:boolean;
			/**
			* Boolean indicating whether this is a tablet device.
			* @member {boolean} IsTablet
			*/
			IsTablet:boolean;
			/**
			* Browser language, e.g. en, da, de, etc.
			* @member {string} Language
			*/
			Language:string;
			/**
			* Browser version.
			* @member {number} Version
			*/
			Version:number;
		}
		/**
		* Object representing browser environment.
		* @class [Fit.BrowserTypeDefs.BrowserInfo BrowserInfo]
		*/
		class BrowserInfo
		{
			// Properties defined by Fit.BrowserTypeDefs.BrowserInfo
			/**
			* Browser name.
			* @member {"Edge" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "Unknown"} Name
			*/
			Name:"Edge" | "Chrome" | "Safari" | "MSIE" | "Firefox" | "Opera" | "Unknown";
			// Properties defined by Fit.BrowserTypeDefs.BrowserDetails
			/**
			* Boolean indicating whether this is a mobile device (tablet or phone).
			* @member {boolean} IsMobile
			*/
			IsMobile:boolean;
			/**
			* Boolean indicating whether this is a phone.
			* @member {boolean} IsPhone
			*/
			IsPhone:boolean;
			/**
			* Boolean indicating whether this is a tablet device.
			* @member {boolean} IsTablet
			*/
			IsTablet:boolean;
			/**
			* Browser language, e.g. en, da, de, etc.
			* @member {string} Language
			*/
			Language:string;
			/**
			* Browser version.
			* @member {number} Version
			*/
			Version:number;
		}
		/**
		* Object representing components of a URL.
		* @class [Fit.BrowserTypeDefs.ParsedUrl ParsedUrl]
		*/
		class ParsedUrl
		{
			// Properties defined by Fit.BrowserTypeDefs.ParsedUrl
			/**
			* Authentication token or user:pass if specified, otherwise Null.
			* @member {string | null} Auth
			*/
			Auth:string | null;
			/**
			* Path and Resource combined, e.g. /folder/resource.php.
			* @member {string} FullPath
			*/
			FullPath:string;
			/**
			* URL hash value if specified, otherwise Null.
			* @member {string | null} Hash
			*/
			Hash:string | null;
			/**
			* Hostname, e.g. localhost or domain name.
			* @member {string} Host
			*/
			Host:string;
			/**
			* Associative array with key value pairs representing URL parameters.
			* @member {Object.<string, string | undefined>} Parameters
			*/
			Parameters:{[key:string]: string | undefined};
			/**
			* Path to folder containing resources, e.g. / or /folder.
			* @member {string} Path
			*/
			Path:string;
			/**
			* Port number - returns -1 if not defined in URL.
			* @member {number} Port
			*/
			Port:number;
			/**
			* Full URL address.
			* @member {"ftp" | "http" | "https"} Protocol
			*/
			Protocol:"ftp" | "http" | "https";
			/**
			* Name of resource, e.g. resource.php.
			* @member {string} Resource
			*/
			Resource:string;
			/**
			* Full URL address.
			* @member {string} Url
			*/
			Url:string;
		}
		/**
		* Object representing query string.
		* @class [Fit.BrowserTypeDefs.QueryString QueryString]
		*/
		class QueryString
		{
			// Properties defined by Fit.BrowserTypeDefs.QueryString
			/**
			* URL hash value if specified, otherwise Null.
			* @member {string | null} Hash
			*/
			Hash:string | null;
			/**
			* Associative array with key value pairs representing URL parameters.
			* @member {Object.<string, string | undefined>} Parameters
			*/
			Parameters:{[key:string]: string | undefined};
			/**
			* Full URL address.
			* @member {string} Url
			*/
			Url:string;
		}
	}
	/**
	* 
	* @namespace [Fit.ColorTypeDefs ColorTypeDefs]
	*/
	namespace ColorTypeDefs
	{
		/**
		* RGBA color object.
		* @class [Fit.ColorTypeDefs.RgbaColor RgbaColor]
		*/
		class RgbaColor
		{
			// Properties defined by Fit.ColorTypeDefs.RgbaColor
			/**
			* Alpha channel (opacity).
			* @member {number} Alpha
			*/
			Alpha:number;
			// Properties defined by Fit.ColorTypeDefs.RgbColor
			/**
			* 
			* @member {number} Blue
			*/
			Blue:number;
			/**
			* 
			* @member {number} Green
			*/
			Green:number;
			/**
			* 
			* @member {number} Red
			*/
			Red:number;
		}
		/**
		* RGB color object.
		* @class [Fit.ColorTypeDefs.RgbColor RgbColor]
		*/
		class RgbColor
		{
			// Properties defined by Fit.ColorTypeDefs.RgbColor
			/**
			* 
			* @member {number} Blue
			*/
			Blue:number;
			/**
			* 
			* @member {number} Green
			*/
			Green:number;
			/**
			* 
			* @member {number} Red
			*/
			Red:number;
		}
	}
	/**
	* 
	* @namespace [Fit.CookiesDefs CookiesDefs]
	*/
	namespace CookiesDefs
	{
		/**
		* New cookie.
		* @class [Fit.CookiesDefs.Cookie Cookie]
		*/
		class Cookie
		{
			// Properties defined by Fit.CookiesDefs.Cookie
			/**
			* See Fit.Cookies.Set(..) function's description for its sameSite argument.
			* @member {"None" | "Lax" | "Strict"} [SameSite=undefined]
			*/
			SameSite?:"None" | "Lax" | "Strict";
			/**
			* See Fit.Cookies.Set(..) function's description for its seconds argument.
			* @member {number} [Seconds=undefined]
			*/
			Seconds?:number;
			/**
			* See Fit.Cookies.Set(..) function's description for its secure argument.
			* @member {boolean} [Secure=undefined]
			*/
			Secure?:boolean;
			/**
			* See Fit.Cookies.Set(..) function's description for its value argument.
			* @member {string} Value
			*/
			Value:string;
			// Properties defined by Fit.CookiesDefs.CookieIdentity
			/**
			* See Fit.Cookies.Set(..) function's description for its domain argument.
			* @member {string} [Domain=undefined]
			*/
			Domain?:string;
			/**
			* See Fit.Cookies.Set(..) function's description for its name argument.
			* @member {string} Name
			*/
			Name:string;
			/**
			* See Fit.Cookies.Set(..) function's description for its path argument.
			* @member {string} [Path=undefined]
			*/
			Path?:string;
		}
		/**
		* Cookie identity.
		* @class [Fit.CookiesDefs.CookieIdentity CookieIdentity]
		*/
		class CookieIdentity
		{
			// Properties defined by Fit.CookiesDefs.CookieIdentity
			/**
			* See Fit.Cookies.Set(..) function's description for its domain argument.
			* @member {string} [Domain=undefined]
			*/
			Domain?:string;
			/**
			* See Fit.Cookies.Set(..) function's description for its name argument.
			* @member {string} Name
			*/
			Name:string;
			/**
			* See Fit.Cookies.Set(..) function's description for its path argument.
			* @member {string} [Path=undefined]
			*/
			Path?:string;
		}
	}
	/**
	* 
	* @namespace [Fit.CoreTypeDefs CoreTypeDefs]
	*/
	namespace CoreTypeDefs
	{
		/**
		* 
		* @class [Fit.CoreTypeDefs.DebounceFunction DebounceFunction]
		*/
		class DebounceFunction
		{
			// Properties defined by Fit.CoreTypeDefs.DebounceFunction
			/**
			* Schedule or re-schedule execution of function.
			* @member {Function} Invoke
			*/
			Invoke:Function;
			// Functions defined by Fit.CoreTypeDefs.DebounceFunction
			/**
			* Cancel debounced function if scheduled for execution.
			* @function Cancel
			*/
			public Cancel():void;
			/**
			* Force execution of debounced function if scheduled for execution.
			* @function Flush
			*/
			public Flush():void;
		}
		/**
		* Version information.
		* @class [Fit.CoreTypeDefs.VersionInfo VersionInfo]
		*/
		class VersionInfo
		{
			// Properties defined by Fit.CoreTypeDefs.VersionInfo
			/**
			* Major version number.
			* @member {number} Major
			*/
			Major:number;
			/**
			* Minor version number.
			* @member {number} Minor
			*/
			Minor:number;
			/**
			* Patch version number.
			* @member {number} Patch
			*/
			Patch:number;
			/**
			* String version number in the format Major.Minor.Patch.
			* @member {string} Version
			*/
			Version:string;
		}
	}
	/**
	* 
	* @namespace [Fit.DragDrop DragDrop]
	*/
	namespace DragDrop
	{
		/**
		* 
		* @class [Fit.DragDrop.Draggable Draggable]
		*/
		class Draggable
		{
			// Functions defined by Fit.DragDrop.Draggable
			/**
			* Free resources and disable dragging support for DOM element.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Constructor - create instance of Draggable class.
			* @function Draggable
			* @param {HTMLElement} domElm - Element to turn into draggable object.
			* @param {HTMLElement} [domTriggerElm=undefined] - Element that triggers dragging (optional).
			*/
			constructor(domElm:HTMLElement, domTriggerElm?:HTMLElement);
			/**
			* Get draggable DOM element.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Add event handler which constantly gets fired when dragging takes place.
			* @function OnDragging
			* @param {Fit.DragDrop.DraggableTypeDefs.DragEventHandler} cb - Callback (event handler) function - draggable DOM element is passed to function.
			*/
			public OnDragging(cb:Fit.DragDrop.DraggableTypeDefs.DragEventHandler):void;
			/**
			* Add event handler which gets fired when dragging starts.
			* @function OnDragStart
			* @param {Fit.DragDrop.DraggableTypeDefs.DragEventHandler} cb - Callback (event handler) function - draggable DOM element is passed to function.
			*/
			public OnDragStart(cb:Fit.DragDrop.DraggableTypeDefs.DragEventHandler):void;
			/**
			* Add event handler which gets fired when dragging stops.
			* @function OnDragStop
			* @param {Fit.DragDrop.DraggableTypeDefs.DragStopEventHandler} cb - Callback (event handler) function - instance of Draggable is passed to function.
			*/
			public OnDragStop(cb:Fit.DragDrop.DraggableTypeDefs.DragStopEventHandler):void;
			/**
			* Reset draggable to initial position.
			* @function Reset
			*/
			public Reset():void;
		}
		/**
		* 
		* @namespace [Fit.DragDrop.DraggableTypeDefs DraggableTypeDefs]
		*/
		namespace DraggableTypeDefs
		{
			// Functions defined by Fit.DragDrop.DraggableTypeDefs
			/**
			* Event handler.
			* @callback DragEventHandler
			* @param {HTMLElement} dom - DOM element to which event is associated.
			*/
			type DragEventHandler = (dom:HTMLElement) => void;
			/**
			* Event handler.
			* @callback DragStopEventHandler
			* @param {HTMLElement} dom - DOM element to which event is associated.
			* @param {Fit.DragDrop.Draggable} draggable - Instance of Draggable to which event is associated.
			*/
			type DragStopEventHandler = (dom:HTMLElement, draggable:Fit.DragDrop.Draggable) => void;
		}
		/**
		* 
		* @class [Fit.DragDrop.DropZone DropZone]
		*/
		class DropZone
		{
			// Functions defined by Fit.DragDrop.DropZone
			/**
			* Free resources and disable DropZone support for DOM element.
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Constructor - create instance of DropZone class.
			* @function DropZone
			* @param {HTMLElement} domElm - Element to turn into dropzone object.
			*/
			constructor(domElm:HTMLElement);
			/**
			* Get dropzone DOM element.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Add event handler which gets fired when draggable is dropped on dropzone.
			* @function OnDrop
			* @param {Fit.DragDrop.DropZoneTypeDefs.DropEventHandler} cb - Callback (event handler) function - instance of DropZone and Draggable is passed to function (in that order).
			*/
			public OnDrop(cb:Fit.DragDrop.DropZoneTypeDefs.DropEventHandler):void;
			/**
			* Add event handler which gets fired when draggable enters dropzone, ready to be dropped.
			* @function OnEnter
			* @param {Fit.DragDrop.DropZoneTypeDefs.EnterEventHandler} cb - Callback (event handler) function - instance of DropZone is passed to function.
			*/
			public OnEnter(cb:Fit.DragDrop.DropZoneTypeDefs.EnterEventHandler):void;
			/**
			* Add event handler which gets fired when draggable leaves dropzone.
			* @function OnLeave
			* @param {Fit.DragDrop.DropZoneTypeDefs.LeaveEventHandler} cb - Callback (event handler) function - instance of DropZone is passed to function.
			*/
			public OnLeave(cb:Fit.DragDrop.DropZoneTypeDefs.LeaveEventHandler):void;
		}
		/**
		* 
		* @namespace [Fit.DragDrop.DropZoneTypeDefs DropZoneTypeDefs]
		*/
		namespace DropZoneTypeDefs
		{
			// Functions defined by Fit.DragDrop.DropZoneTypeDefs
			/**
			* Event handler.
			* @callback DropEventHandler
			* @param {Fit.DragDrop.DropZone} dropZone - Instance of DropZone to which draggable is dropped.
			* @param {Fit.DragDrop.Draggable} draggable - Instance of Draggable being dropped.
			*/
			type DropEventHandler = (dropZone:Fit.DragDrop.DropZone, draggable:Fit.DragDrop.Draggable) => void;
			/**
			* Event handler.
			* @callback EnterEventHandler
			* @param {Fit.DragDrop.DropZone} dropZone - Instance of DropZone to which draggable can potentially be dropped now.
			*/
			type EnterEventHandler = (dropZone:Fit.DragDrop.DropZone) => void;
			/**
			* Event handler.
			* @callback LeaveEventHandler
			* @param {Fit.DragDrop.DropZone} dropZone - Instance of DropZone from which draggable is moved away.
			*/
			type LeaveEventHandler = (dropZone:Fit.DragDrop.DropZone) => void;
		}
	}
	/**
	* 
	* @namespace [Fit.EventTypeDefs EventTypeDefs]
	*/
	namespace EventTypeDefs
	{
		/**
		* Modifier keys.
		* @class [Fit.EventTypeDefs.ModifierKeys ModifierKeys]
		*/
		class ModifierKeys
		{
			// Properties defined by Fit.EventTypeDefs.ModifierKeys
			/**
			* True if Alt key is being held down, otherwise False.
			* @member {boolean} Alt
			*/
			Alt:boolean;
			/**
			* True if Ctrl key is being held down, otherwise False.
			* @member {boolean} Ctrl
			*/
			Ctrl:boolean;
			/**
			* Key code if key is pressed, otherwise -1.
			* @member {number} KeyDown
			*/
			KeyDown:number;
			/**
			* Key code if key is released, otherwise -1.
			* @member {number} KeyUp
			*/
			KeyUp:number;
			/**
			* True if Meta key (Windows key on a PC, Cmd key on a Mac) is being held down, otherwise False.
			* @member {boolean} Meta
			*/
			Meta:boolean;
			/**
			* True if Shift key is being held down, otherwise False.
			* @member {boolean} Shift
			*/
			Shift:boolean;
		}
		/**
		* Pointer state.
		* @class [Fit.EventTypeDefs.PointerState PointerState]
		*/
		class PointerState
		{
			// Properties defined by Fit.EventTypeDefs.PointerState
			/**
			* Pointer buttons currently activated.
			* @member {{ Primary: boolean, Secondary: boolean }} Buttons
			*/
			Buttons:{ Primary: boolean, Secondary: boolean };
			/**
			* Pointer position within viewport and document, which might have been scrolled.
			* @member {{ ViewPort: Fit.TypeDefs.Position, Document: Fit.TypeDefs.Position }} Coordinates
			*/
			Coordinates:{ ViewPort: Fit.TypeDefs.Position, Document: Fit.TypeDefs.Position };
		}
	}
	/**
	* 
	* @namespace [Fit.Http Http]
	*/
	namespace Http
	{
		/**
		* JSONP (JSON with Padding) request functionality allowing for cross-domain data exchange.
		
		// Example code
		
		var http = new Fit.Http.JsonpRequest("GetUsers.php");
		http.OnSuccess(function(r)
		{
		     var data = http.GetResponse();
		     console.log(data);
		});
		http.Start();.
		* @class [Fit.Http.JsonpRequest JsonpRequest]
		*/
		class JsonpRequest
		{
			// Functions defined by Fit.Http.JsonpRequest
			/**
			* Get/set name of URL parameter receiving the name of the JSONP callback function.
			* @function Callback
			* @param {string} [val=undefined] - If defined, changes the name of the URL parameter to specified value.
			* @returns string
			*/
			public Callback(val?:string):string;
			/**
			* Get URL parameter value - returns Null if parameter is not defined.
			* @function GetParameter
			* @param {string} key - URL parameter key.
			* @returns string | null
			*/
			public GetParameter(key:string):string | null;
			/**
			* Get all URL parameter keys.
			* @function GetParameters
			* @returns string[]
			*/
			public GetParameters():string[];
			/**
			* Get response returned from server.
			* @function GetResponse
			* @returns any
			*/
			public GetResponse():any;
			/**
			* Constructor - creates instance of JsonpRequest class.
			* @function JsonpRequest
			* @param {string} uri - URL to request.
			* @param {string} [jsonpCallbackName=callback] - Name of URL parameter receiving name of JSONP callback function.
			*/
			constructor(uri:string, jsonpCallbackName?:string);
			/**
			* Add function to invoke when request is initiated.
			Request can be canceled by returning False.
			* @function OnRequest
			* @param {Fit.Http.JsonpRequestTypeDefs.EventHandler} func - JavaScript function invoked when request is initiated.
			Fit.Http.JsonpRequest instance is passed to function.
			*/
			public OnRequest(func:Fit.Http.JsonpRequestTypeDefs.EventHandler):void;
			/**
			* Add function to invoke when request is successful.
			* @function OnSuccess
			* @param {Fit.Http.JsonpRequestTypeDefs.EventHandler} func - JavaScript function invoked when request finished successfully.
			Fit.Http.JsonpRequest instance is passed to function.
			*/
			public OnSuccess(func:Fit.Http.JsonpRequestTypeDefs.EventHandler):void;
			/**
			* Add function to invoke when request is unsuccessful due to timeout.
			* @function OnTimeout
			* @param {Fit.Http.JsonpRequestTypeDefs.EventHandler} func - JavaScript function invoked when request timed out.
			Fit.Http.JsonpRequest instance is passed to function.
			*/
			public OnTimeout(func:Fit.Http.JsonpRequestTypeDefs.EventHandler):void;
			/**
			* Set URL parameter.
			* @function SetParameter
			* @param {string} key - URL parameter key.
			* @param {string} value - URL parameter value.
			* @param {boolean} [uriEncode=true] - Set False to prevent value from being URI encoded to preserve special characters.
			*/
			public SetParameter(key:string, value:string, uriEncode?:boolean):void;
			/**
			* Invoke asynchroneus request.
			* @function Start
			*/
			public Start():void;
			/**
			* Get/set request timeout in milliseconds.
			OnTimeout is fired if response is not received
			within specified amount of time. Defaults to 30000 ms.
			* @function Timeout
			* @param {string} [val=undefined] - If defined, changes timeout to specified value.
			* @returns number
			*/
			public Timeout(val?:string):number;
			/**
			* Get/set request URL.
			* @function Url
			* @param {string} [val=undefined] - If defined, changes request URL to specified value.
			* @returns string
			*/
			public Url(val?:string):string;
		}
		/**
		* 
		* @namespace [Fit.Http.JsonpRequestTypeDefs JsonpRequestTypeDefs]
		*/
		namespace JsonpRequestTypeDefs
		{
			// Functions defined by Fit.Http.JsonpRequestTypeDefs
			/**
			* JsonpRequest event handler.
			* @callback EventHandler
			* @param {Fit.Http.JsonpRequest} sender - Instance of JsonpRequest which triggered event.
			*/
			type EventHandler = (sender:Fit.Http.JsonpRequest) => void;
		}
		/**
		* Asynchronous HTTP request functionality (AJAX/WebService)
		optimized for exchanging data with the server in JSON format.
		Extending from Fit.Http.Request.
		
		// Example code
		
		var http = new Fit.Http.JsonRequest("WebService.asmx/AddUser");
		
		http.SetData({ Username: "Jack", Password: "Secret" });
		http.OnSuccess(function(sender)
		{
		     var json = http.GetResponseJson();
		     alert("User created - server response: " + json.Message);
		});
		
		http.Start();.
		* @class [Fit.Http.JsonRequest JsonRequest]
		*/
		class JsonRequest
		{
			// Functions defined by Fit.Http.JsonRequest
			/**
			* Returns result from request as JSON object, Null if no response was returned.
			Return value will only be as expected if GetCurrentState() returns a value of 4
			(request done) and GetHttpStatus() returns a value of 2xx (request successful).
			Notice: .NET usually wraps data in a .d property. Data is automatically extracted
			from this property, hence contained data is returned as the root object.
			* @function GetResponseJson
			* @returns any | null
			*/
			public GetResponseJson():any | null;
			/**
			* Constructor - creates instance of JSON Request class.
			* @function JsonRequest
			* @param {string} url - URL to request, e.g.
			http://server/_layouts/15/Company/MyWebService.asmx/MyMethod.
			*/
			constructor(url:string);
			// Functions defined by Fit.Http.Request
			/**
			* Abort asynchroneus request.
			* @function Abort
			*/
			public Abort():void;
			/**
			* Add form data - this will change the request method from GET to POST
			and cause the following header to be added to the request, unless already
			defined: Content-type: application/x-www-form-urlencoded.
			* @function AddFormData
			* @param {string} key - Data key.
			* @param {string} value - Data value.
			* @param {boolean} [uriEncode=true] - Set False to prevent value from being URI encoded to preserve special characters.
			*/
			public AddFormData(key:string, value:string, uriEncode?:boolean):void;
			/**
			* Add header to request.
			* @function AddHeader
			* @param {string} key - Header key.
			* @param {string} value - Header value.
			*/
			public AddHeader(key:string, value:string):void;
			/**
			* Get/set flag indicating whether request is made asynchronously or synchronously.
			* @function Async
			* @param {boolean} [val=undefined] - If defined, enforces an async or sync request based on the boolean value provided.
			* @returns boolean
			*/
			public Async(val?:boolean):boolean;
			/**
			* Remove all form values from form data collection.
			* @function ClearFormData
			*/
			public ClearFormData():void;
			/**
			* Remove all request headers.
			* @function ClearHeaders
			*/
			public ClearHeaders():void;
			/**
			* Get current request state.
			0 = Unsent
			1 = Opened
			2 = Headers received
			3 = Loading
			4 = Done (response is ready for processing).
			* @function GetCurrentState
			* @returns number
			*/
			public GetCurrentState():number;
			/**
			* Get data set to be posted.
			* @function GetData
			* @returns any
			*/
			public GetData():any;
			/**
			* Get form value added to form data collection - returns Null if not found.
			* @function GetFormData
			* @param {string} key - Data key.
			* @returns string | null
			*/
			public GetFormData(key:string):string | null;
			/**
			* Get request header - returns Null if not found.
			* @function GetHeader
			* @param {string} key - Header name.
			* @returns string | null
			*/
			public GetHeader(key:string):string | null;
			/**
			* Get all request header names.
			* @function GetHeaders
			* @returns string[]
			*/
			public GetHeaders():string[];
			/**
			* Returns HTTP status. Common return values are:
			200 = OK (successful request)
			304 = Forbidden (access denied)
			404 = Not found
			408 = Request time out
			500 = Internal server error
			503 = Service unavailable.
			* @function GetHttpStatus
			* @returns number
			*/
			public GetHttpStatus():number;
			/**
			* Returns result from request. Use this to obtain e.g. binary data on supported browsers.
			For requests without custom RequestProperties set the return value will be the response text.
			* @function GetResponse
			* @returns any
			*/
			public GetResponse():any;
			/**
			* Get response header (e.g. text/html) - returns Null if not found.
			* @function GetResponseHeader
			* @param {string} key - Header key (e.g. Content-Type).
			* @returns string | null
			*/
			public GetResponseHeader(key:string):string | null;
			/**
			* Get response headers - returned array contain objects with Key (string) and Value (string) properties.
			* @function GetResponseHeaders
			* @returns { Key: string, Value: string }[]
			*/
			public GetResponseHeaders():{ Key: string, Value: string }[];
			/**
			* Returns result from request as JSON object, Null if no response was returned.
			Return value will only be as expected if GetCurrentState() returns a value of 4
			(request done) and GetHttpStatus() returns a value of 2xx (request successful).
			* @function GetResponseJson
			* @returns any | null
			*/
			public GetResponseJson():any | null;
			/**
			* Returns text result from request.
			Return value will only be as expected if GetCurrentState() returns a value of 4
			(request done) and GetHttpStatus() returns a value of 2xx (request successful).
			* @function GetResponseText
			* @returns string
			*/
			public GetResponseText():string;
			/**
			* Returns result from request as XML or HTML document.
			Return value will only be as expected if GetCurrentState() returns a value of 4
			(request done) and GetHttpStatus() returns a value of 2xx (request successful).
			* @function GetResponseXml
			* @returns Document
			*/
			public GetResponseXml():Document;
			/**
			* Get/set request method (e.g. GET, POST, HEAD, PUT, DELETE, OPTIONS).
			* @function Method
			* @param {"GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS"} [val=undefined] - If defined, changes HTTP request method to specified value.
			* @returns "GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS"
			*/
			public Method(val?:"GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS"):"GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS";
			/**
			* Add function to invoke when request is canceled.
			* @function OnAbort
			* @param {Fit.Http.RequestTypeDefs.EventHandler<this>} func - JavaScript function invoked when request is canceled.
			Fit.Http.Request instance is passed to function.
			*/
			public OnAbort(func:Fit.Http.RequestTypeDefs.EventHandler<this>):void;
			/**
			* Add function to invoke when request is unsuccessful.
			* @function OnFailure
			* @param {Fit.Http.RequestTypeDefs.EventHandler<this>} func - JavaScript function invoked when request finished, but not successfully.
			Fit.Http.Request instance is passed to function.
			*/
			public OnFailure(func:Fit.Http.RequestTypeDefs.EventHandler<this>):void;
			/**
			* Add function to invoke when request is initiated.
			Request can be canceled by returning False.
			* @function OnRequest
			* @param {Fit.Http.RequestTypeDefs.EventHandler<this>} func - JavaScript function invoked when request is initiated.
			Fit.Http.Request instance is passed to function.
			*/
			public OnRequest(func:Fit.Http.RequestTypeDefs.EventHandler<this>):void;
			/**
			* Add function to invoke when request state is changed.
			Use GetCurrentState() to read the state at the given time.
			* @function OnStateChange
			* @param {Fit.Http.RequestTypeDefs.EventHandler<this>} func - JavaScript function invoked when state changes.
			Fit.Http.Request instance is passed to function.
			*/
			public OnStateChange(func:Fit.Http.RequestTypeDefs.EventHandler<this>):void;
			/**
			* Add function to invoke when request is successful.
			* @function OnSuccess
			* @param {Fit.Http.RequestTypeDefs.EventHandler<this>} func - JavaScript function invoked when request finished successfully.
			Fit.Http.Request instance is passed to function.
			*/
			public OnSuccess(func:Fit.Http.RequestTypeDefs.EventHandler<this>):void;
			/**
			* Remove form value from form data collection.
			* @function RemoveFormData
			* @param {string} key - Data key.
			*/
			public RemoveFormData(key:string):void;
			/**
			* Remove request header.
			* @function RemoveHeader
			* @param {string} key - Header name.
			*/
			public RemoveHeader(key:string):void;
			/**
			* Set/get custom XHR request properties.
			Example of property object: { withCredentials: true, responseType: 'blob' }.
			How different browsers and versions support and handle custom properties differ:
			https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
			Full cross browser support is therefore not guaranteed.
			* @function RequestProperties
			* @param {any} [propertyObject=undefined] - If specified, properties will be applied to XHR request when Start() is invoked.
			* @returns any
			*/
			public RequestProperties(propertyObject?:any):any;
			/**
			* Set data to post - this will change the request method from GET to POST.
			* @function SetData
			* @param {any} dataObj - Data to send.
			*/
			public SetData(dataObj:any):void;
			/**
			* Invoke request. An asynchroneus request is performed if an
			OnStateChange, OnSuccess, or OnFailure event handler has been set.
			If no event handlers have been set, a synchronous request will be performed,
			causing the client to wait (and freeze) until data is received.
			* @function Start
			*/
			public Start():void;
			/**
			* Get/set request URL.
			* @function Url
			* @param {string} [val=undefined] - If defined, changes request URL to specified value.
			* @returns string
			*/
			public Url(val?:string):string;
		}
		/**
		* Asynchronous HTTP request functionality (AJAX/WebService).
		
		// Example code
		
		var http = new Fit.Http.Request("CreateUser.php");
		
		http.SetData("username=Jack&password=Secret");
		http.OnStateChange(function(r)
		{
		     if (http.GetCurrentState() === 4 && http.GetHttpStatus() === 200)
		         alert("User created - server said: " + http.GetResponseText());
		});
		
		http.Start();.
		* @class [Fit.Http.Request Request]
		*/
		class Request
		{
			// Functions defined by Fit.Http.Request
			/**
			* Abort asynchroneus request.
			* @function Abort
			*/
			public Abort():void;
			/**
			* Add form data - this will change the request method from GET to POST
			and cause the following header to be added to the request, unless already
			defined: Content-type: application/x-www-form-urlencoded.
			* @function AddFormData
			* @param {string} key - Data key.
			* @param {string} value - Data value.
			* @param {boolean} [uriEncode=true] - Set False to prevent value from being URI encoded to preserve special characters.
			*/
			public AddFormData(key:string, value:string, uriEncode?:boolean):void;
			/**
			* Add header to request.
			* @function AddHeader
			* @param {string} key - Header key.
			* @param {string} value - Header value.
			*/
			public AddHeader(key:string, value:string):void;
			/**
			* Get/set flag indicating whether request is made asynchronously or synchronously.
			* @function Async
			* @param {boolean} [val=undefined] - If defined, enforces an async or sync request based on the boolean value provided.
			* @returns boolean
			*/
			public Async(val?:boolean):boolean;
			/**
			* Remove all form values from form data collection.
			* @function ClearFormData
			*/
			public ClearFormData():void;
			/**
			* Remove all request headers.
			* @function ClearHeaders
			*/
			public ClearHeaders():void;
			/**
			* Get current request state.
			0 = Unsent
			1 = Opened
			2 = Headers received
			3 = Loading
			4 = Done (response is ready for processing).
			* @function GetCurrentState
			* @returns number
			*/
			public GetCurrentState():number;
			/**
			* Get data set to be posted.
			* @function GetData
			* @returns any
			*/
			public GetData():any;
			/**
			* Get form value added to form data collection - returns Null if not found.
			* @function GetFormData
			* @param {string} key - Data key.
			* @returns string | null
			*/
			public GetFormData(key:string):string | null;
			/**
			* Get request header - returns Null if not found.
			* @function GetHeader
			* @param {string} key - Header name.
			* @returns string | null
			*/
			public GetHeader(key:string):string | null;
			/**
			* Get all request header names.
			* @function GetHeaders
			* @returns string[]
			*/
			public GetHeaders():string[];
			/**
			* Returns HTTP status. Common return values are:
			200 = OK (successful request)
			304 = Forbidden (access denied)
			404 = Not found
			408 = Request time out
			500 = Internal server error
			503 = Service unavailable.
			* @function GetHttpStatus
			* @returns number
			*/
			public GetHttpStatus():number;
			/**
			* Returns result from request. Use this to obtain e.g. binary data on supported browsers.
			For requests without custom RequestProperties set the return value will be the response text.
			* @function GetResponse
			* @returns any
			*/
			public GetResponse():any;
			/**
			* Get response header (e.g. text/html) - returns Null if not found.
			* @function GetResponseHeader
			* @param {string} key - Header key (e.g. Content-Type).
			* @returns string | null
			*/
			public GetResponseHeader(key:string):string | null;
			/**
			* Get response headers - returned array contain objects with Key (string) and Value (string) properties.
			* @function GetResponseHeaders
			* @returns { Key: string, Value: string }[]
			*/
			public GetResponseHeaders():{ Key: string, Value: string }[];
			/**
			* Returns result from request as JSON object, Null if no response was returned.
			Return value will only be as expected if GetCurrentState() returns a value of 4
			(request done) and GetHttpStatus() returns a value of 2xx (request successful).
			* @function GetResponseJson
			* @returns any | null
			*/
			public GetResponseJson():any | null;
			/**
			* Returns text result from request.
			Return value will only be as expected if GetCurrentState() returns a value of 4
			(request done) and GetHttpStatus() returns a value of 2xx (request successful).
			* @function GetResponseText
			* @returns string
			*/
			public GetResponseText():string;
			/**
			* Returns result from request as XML or HTML document.
			Return value will only be as expected if GetCurrentState() returns a value of 4
			(request done) and GetHttpStatus() returns a value of 2xx (request successful).
			* @function GetResponseXml
			* @returns Document
			*/
			public GetResponseXml():Document;
			/**
			* Get/set request method (e.g. GET, POST, HEAD, PUT, DELETE, OPTIONS).
			* @function Method
			* @param {"GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS"} [val=undefined] - If defined, changes HTTP request method to specified value.
			* @returns "GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS"
			*/
			public Method(val?:"GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS"):"GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "OPTIONS";
			/**
			* Add function to invoke when request is canceled.
			* @function OnAbort
			* @param {Fit.Http.RequestTypeDefs.EventHandler<this>} func - JavaScript function invoked when request is canceled.
			Fit.Http.Request instance is passed to function.
			*/
			public OnAbort(func:Fit.Http.RequestTypeDefs.EventHandler<this>):void;
			/**
			* Add function to invoke when request is unsuccessful.
			* @function OnFailure
			* @param {Fit.Http.RequestTypeDefs.EventHandler<this>} func - JavaScript function invoked when request finished, but not successfully.
			Fit.Http.Request instance is passed to function.
			*/
			public OnFailure(func:Fit.Http.RequestTypeDefs.EventHandler<this>):void;
			/**
			* Add function to invoke when request is initiated.
			Request can be canceled by returning False.
			* @function OnRequest
			* @param {Fit.Http.RequestTypeDefs.EventHandler<this>} func - JavaScript function invoked when request is initiated.
			Fit.Http.Request instance is passed to function.
			*/
			public OnRequest(func:Fit.Http.RequestTypeDefs.EventHandler<this>):void;
			/**
			* Add function to invoke when request state is changed.
			Use GetCurrentState() to read the state at the given time.
			* @function OnStateChange
			* @param {Fit.Http.RequestTypeDefs.EventHandler<this>} func - JavaScript function invoked when state changes.
			Fit.Http.Request instance is passed to function.
			*/
			public OnStateChange(func:Fit.Http.RequestTypeDefs.EventHandler<this>):void;
			/**
			* Add function to invoke when request is successful.
			* @function OnSuccess
			* @param {Fit.Http.RequestTypeDefs.EventHandler<this>} func - JavaScript function invoked when request finished successfully.
			Fit.Http.Request instance is passed to function.
			*/
			public OnSuccess(func:Fit.Http.RequestTypeDefs.EventHandler<this>):void;
			/**
			* Remove form value from form data collection.
			* @function RemoveFormData
			* @param {string} key - Data key.
			*/
			public RemoveFormData(key:string):void;
			/**
			* Remove request header.
			* @function RemoveHeader
			* @param {string} key - Header name.
			*/
			public RemoveHeader(key:string):void;
			/**
			* Constructor - creates instance of Request class.
			* @function Request
			* @param {string} uri - URL to request.
			*/
			constructor(uri:string);
			/**
			* Set/get custom XHR request properties.
			Example of property object: { withCredentials: true, responseType: 'blob' }.
			How different browsers and versions support and handle custom properties differ:
			https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
			Full cross browser support is therefore not guaranteed.
			* @function RequestProperties
			* @param {any} [propertyObject=undefined] - If specified, properties will be applied to XHR request when Start() is invoked.
			* @returns any
			*/
			public RequestProperties(propertyObject?:any):any;
			/**
			* Set data to post - this will change the request method from GET to POST.
			* @function SetData
			* @param {any} dataObj - Data to send.
			*/
			public SetData(dataObj:any):void;
			/**
			* Invoke request. An asynchroneus request is performed if an
			OnStateChange, OnSuccess, or OnFailure event handler has been set.
			If no event handlers have been set, a synchronous request will be performed,
			causing the client to wait (and freeze) until data is received.
			* @function Start
			*/
			public Start():void;
			/**
			* Get/set request URL.
			* @function Url
			* @param {string} [val=undefined] - If defined, changes request URL to specified value.
			* @returns string
			*/
			public Url(val?:string):string;
		}
		/**
		* 
		* @namespace [Fit.Http.RequestTypeDefs RequestTypeDefs]
		*/
		namespace RequestTypeDefs
		{
			// Functions defined by Fit.Http.RequestTypeDefs
			/**
			* Request event handler.
			* @template TypeOfThis
			* @callback EventHandler
			* @param {TypeOfThis} sender - Instance of request which triggered event.
			*/
			type EventHandler<TypeOfThis> = (sender:TypeOfThis) => void;
		}
	}
	/**
	* 
	* @namespace [Fit.TypeDefs TypeDefs]
	*/
	namespace TypeDefs
	{
		/**
		* Represents a CSS value.
		* @class [Fit.TypeDefs.CssValue CssValue]
		*/
		class CssValue
		{
			// Properties defined by Fit.TypeDefs.CssValue
			/**
			* Unit.
			* @member {Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw"} Unit
			*/
			Unit:Fit.TypeDefs.CssUnit | "%" | "ch" | "cm" | "em" | "ex" | "in" | "mm" | "pc" | "pt" | "px" | "rem" | "vh" | "vmax" | "vmin" | "vw";
			/**
			* Value.
			* @member {number} Value
			*/
			Value:number;
		}
		/**
		* Represents the size of a visual object.
		* @class [Fit.TypeDefs.Dimension Dimension]
		*/
		class Dimension
		{
			// Properties defined by Fit.TypeDefs.Dimension
			/**
			* Object height in pixels.
			* @member {number} Height
			*/
			Height:number;
			/**
			* Object width in pixels.
			* @member {number} Width
			*/
			Width:number;
		}
		/**
		* Position of a visual object from top and left.
		* @class [Fit.TypeDefs.Position Position]
		*/
		class Position
		{
			// Properties defined by Fit.TypeDefs.Position
			/**
			* Position from left in pixels.
			* @member {number} X
			*/
			X:number;
			/**
			* Position from top in pixels.
			* @member {number} Y
			*/
			Y:number;
		}
		/**
		* True if scrollbar is enabled, otherwise False  Size of scrollbar - always returns 0 if Enabled is False.
		* @class [Fit.TypeDefs.ScrollBarInfo ScrollBarInfo]
		*/
		class ScrollBarInfo
		{
			// Properties defined by Fit.TypeDefs.ScrollBarInfo
			/**
			* True if scrollbar is enabled, otherwise False.
			* @member {boolean} Enabled
			*/
			Enabled:boolean;
			/**
			* Size of scrollbar - always returns 0 if Enabled is False.
			* @member {number} Size
			*/
			Size:number;
		}
		/**
		* Vertical scrollbar information  Horizontal scrollbar information.
		* @class [Fit.TypeDefs.ScrollBarsPresent ScrollBarsPresent]
		*/
		class ScrollBarsPresent
		{
			// Properties defined by Fit.TypeDefs.ScrollBarsPresent
			/**
			* Horizontal scrollbar information.
			* @member {Fit.TypeDefs.ScrollBarInfo} Horizontal
			*/
			Horizontal:Fit.TypeDefs.ScrollBarInfo;
			/**
			* Vertical scrollbar information.
			* @member {Fit.TypeDefs.ScrollBarInfo} Vertical
			*/
			Vertical:Fit.TypeDefs.ScrollBarInfo;
		}
		/**
		* Represents a CSS unit.
		* @enum {string}
		*/
		enum CssUnit
		{
			/**  */
			"%" = "%",
			/**  */
			ch = "ch",
			/**  */
			cm = "cm",
			/**  */
			em = "em",
			/**  */
			ex = "ex",
			/**  */
			in = "in",
			/**  */
			mm = "mm",
			/**  */
			pc = "pc",
			/**  */
			pt = "pt",
			/**  */
			px = "px",
			/**  */
			rem = "rem",
			/**  */
			vh = "vh",
			/**  */
			vmax = "vmax",
			/**  */
			vmin = "vmin",
			/**  */
			vw = "vw"
		}
	}
}

type __fitUiAliasArray = Array<any>;
type __fitUiAliasDate = Date;
type __fitUiAliasMath = Math;
type __fitUiAliasString = String;

declare module "fit-ui"
{
	export = Fit;
}
