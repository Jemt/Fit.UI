/**
* STOP! Do NOT use __FitInternals!
* It is used only to support Fit.UI Typings.
* @class [__FitInternals]
*/
declare namespace __FitInternals
{
	interface IFitControlsButtonType
	{
		/**
		* Red unless styled differently
		* @member [string Danger]
		*/
		Danger: "Danger";
		/**
		* White unless styled differently - default look and feel
		* @member [string Default]
		*/
		Default: "Default";
		/**
		* Turquoise unless styled differently
		* @member [string Info]
		*/
		Info: "Info";
		/**
		* Blue unless styled differently
		* @member [string Primary]
		*/
		Primary: "Primary";
		/**
		* Green unless styled differently
		* @member [string Success]
		*/
		Success: "Success";
		/**
		* Orange unless styled differently
		* @member [string Warning]
		*/
		Warning: "Warning";
	}
	interface IFitControlsInputType
	{
		/**
		* Input control useful for entering a color
		* @member [string Color]
		*/
		Color: "Color";
		/**
		* Input control useful for entering a date
		* @member [string Date]
		*/
		Date: "Date";
		/**
		* Input control useful for entering a date and time
		* @member [string DateTime]
		*/
		DateTime: "DateTime";
		/**
		* Input control useful for entering an e-mail address
		* @member [string Email]
		*/
		Email: "Email";
		/**
		* Input control useful for entering a month
		* @member [string Month]
		*/
		Month: "Month";
		/**
		* Input control useful for entering a number
		* @member [string Number]
		*/
		Number: "Number";
		/**
		* Input control useful for entering a password (characters are masked)
		* @member [string Password]
		*/
		Password: "Password";
		/**
		* Input control useful for entering a phone number
		* @member [string PhoneNumber]
		*/
		PhoneNumber: "PhoneNumber";
		/**
		* Input control useful for entering ordinary text
		* @member [string Text]
		*/
		Text: "Text";
		/**
		* Multi line input field
		* @member [string Textarea]
		*/
		Textarea: "Textarea";
		/**
		* Input control useful for entering time
		* @member [string Time]
		*/
		Time: "Time";
		/**
		* Input control useful for entering a week number
		* @member [string Week]
		*/
		Week: "Week";
	}
	interface IFitControlsWSTreeViewSelectAllMode
	{
		/**
		* Load all children at once (WebService is expected to return the complete hierarchy in one single request). This approach will provide better performance as it does not fire OnChange for every child expanded, and only sends one HTTP request to WebService.
		* @member [string Instantly]
		*/
		Instantly: "Instantly";
		/**
		* Chain load children by progressively expanding them as they are loaded. This may result in several HTTP requests to WebService, and OnChange will fire for every node expanded if children are available server side.
		* @member [string Progressively]
		*/
		Progressively: "Progressively";
	}
	/**
	* 
	* @class [Fit.Controls.ContextMenu.Item Item]
	*/
	class FitControlsContextMenuItem
	{
		// Properties defined by Fit.Controls.ContextMenu.Item
		/**
		* Add child item
		* @function AddChild
		* @param {Fit.Controls.ContextMenu.Item} item Item to add
		*/
		public AddChild(item:__FitInternals.FitControlsContextMenuItem):void;
		/**
		* Destroys item to free up memory
		* @function Dispose
		*/
		public Dispose():void;
		/**
		* Get item by value - returns Null if not found
		* @function GetChild
		* @param {string} val Item value
		* @param {boolean} [recursive=false] If defined, True enables recursive search
		* @returns __FitInternals.FitControlsContextMenuItem
		*/
		public GetChild(val:string, recursive?:boolean):__FitInternals.FitControlsContextMenuItem;
		/**
		* Get all children
		* @function GetChildren
		* @returns __FitInternals.FitControlsContextMenuItem[]
		*/
		public GetChildren():__FitInternals.FitControlsContextMenuItem[];
		/**
		* Get DOMElement representing context menu item
		* @function GetDomElement
		* @returns HTMLElement
		*/
		public GetDomElement():HTMLElement;
		/**
		* Get parent item - returns Null for a root item
		* @function GetParent
		* @returns __FitInternals.FitControlsContextMenuItem
		*/
		public GetParent():__FitInternals.FitControlsContextMenuItem;
		/**
		* Create instance of ContextMenu Item
		* @function Item
		* @param {string} displayTitle Item title
		* @param {string} itemValue Item value
		*/
		constructor(displayTitle:string, itemValue:string);
		/**
		* Remove child item
		* @function RemoveChild
		* @param {Fit.Controls.ContextMenu.Item} item Item to remove
		*/
		public RemoveChild(item:__FitInternals.FitControlsContextMenuItem):void;
		/**
		* Get/set value indicating whether item is selectable or not
		* @function Selectable
		* @param {boolean} [val=undefined] If defined, True enables item, False disables it
		* @returns boolean
		*/
		public Selectable(val?:boolean):boolean;
		/**
		* Get/set item title
		* @function Title
		* @param {string} [val=undefined] If defined, item title is updated
		* @returns string
		*/
		public Title(val?:string):string;
		/**
		* Get item value
		* @function Value
		* @returns string
		*/
		public Value():string;
	}
	/**
	* 
	* @class [Fit.Controls.TreeView.Node Node]
	*/
	class FitControlsTreeViewNode
	{
		// Properties defined by Fit.Controls.TreeView.Node
		/**
		* Add child node
		* @function AddChild
		* @param {Fit.Controls.TreeView.Node} node Node to add
		*/
		public AddChild(node:__FitInternals.FitControlsTreeViewNode):void;
		/**
		* Destroys object to free up memory
		* @function Dispose
		*/
		public Dispose():void;
		/**
		* Get/set value indicating whether node is expanded
		* @function Expanded
		* @param {boolean} [val=undefined] If defined, True expands node, False collapses it
		* @returns boolean
		*/
		public Expanded(val?:boolean):boolean;
		/**
		* Get/set value indicating whether node has focus
		* @function Focused
		* @param {boolean} [val=undefined] If defined, True assigns focus, False removes it (blur)
		* @returns boolean
		*/
		public Focused(val?:boolean):boolean;
		/**
		* Get node by value - returns Null if not found
		* @function GetChild
		* @param {string} val Node value
		* @param {boolean} [recursive=false] If defined, True enables recursive search
		* @returns __FitInternals.FitControlsTreeViewNode
		*/
		public GetChild(val:string, recursive?:boolean):__FitInternals.FitControlsTreeViewNode;
		/**
		* Get all children
		* @function GetChildren
		* @returns __FitInternals.FitControlsTreeViewNode[]
		*/
		public GetChildren():__FitInternals.FitControlsTreeViewNode[];
		/**
		* Get DOMElement representing node
		* @function GetDomElement
		* @returns HTMLElement
		*/
		public GetDomElement():HTMLElement;
		/**
		* Get node depth in current hierarchy - root node is considered level 0
		* @function GetLevel
		* @returns number
		*/
		public GetLevel():number;
		/**
		* Get parent node - returns Null if node has no parent
		* @function GetParent
		* @returns __FitInternals.FitControlsTreeViewNode
		*/
		public GetParent():__FitInternals.FitControlsTreeViewNode;
		/**
		* Returns TreeView if associated, otherwise Null
		* @function GetTreeView
		* @returns Fit.Controls.TreeView
		*/
		public GetTreeView():Fit.Controls.TreeView;
		/**
		* Get value indicating whether node has its selection checkbox enabled
		* @function HasCheckbox
		* @returns boolean
		*/
		public HasCheckbox():boolean;
		/**
		* Create instance of TreeView Node
		* @function Node
		* @param {string} displayTitle Node title
		* @param {string} nodeValue Node value
		*/
		constructor(displayTitle:string, nodeValue:string);
		/**
		* Remove child node - this does not result in TreeView.OnSelect and TreeView.OnSelected being fired for selected nodes
		* @function RemoveChild
		* @param {Fit.Controls.TreeView.Node} node Node to remove
		*/
		public RemoveChild(node:__FitInternals.FitControlsTreeViewNode):void;
		/**
		* Get/set value indicating whether user can change node selection state
		* @function Selectable
		* @param {boolean} [val=undefined] If defined, True enables node selection, False disables it
		* @param {boolean} [showCheckbox=false] If defined, True adds a selection checkbox, False removes it
		* @returns boolean
		*/
		public Selectable(val?:boolean, showCheckbox?:boolean):boolean;
		/**
		* Get/set value indicating whether node is selected. If node is selected, it will automatically be made selectable, if not already done so.
		* @function Selected
		* @param {boolean} [select=undefined] If defined, True selects node, False deselects it
		* @returns boolean
		*/
		public Selected(select?:boolean):boolean;
		/**
		* Get/set node title
		* @function Title
		* @param {string} [val=undefined] If defined, node title is updated
		* @returns string
		*/
		public Title(val?:string):string;
		/**
		* Get node value
		* @function Value
		* @returns string
		*/
		public Value():string;
	}
	/**
	* A template list is a dynamically created object representing a variable number of items containing placeholders. An example could be a list of Users containing information such as Name, Phone number, and E-mail address about each user.
	* @class [Fit.Template.List List]
	*/
	class FitTemplateList
	{
		// Properties defined by Fit.Template.List
		/**
		* Create list item represented by associative object array contaning either strings or DOMElements. Example: var item = templateInstance.Content.MyList.AddItem(); item[&quot;Name&quot;] = &quot;James Thompson&quot;; item[&quot;Email&quot;] = &quot;james@server.com&quot;; It is also possible to assign data using properties: item.ProfilePicture = document.createElement(&quot;img&quot;); item.ProfilePicture.src = &quot;james.png&quot;;
		* @function AddItem
		* @returns object[]
		*/
		public AddItem():object[];
		/**
		* Clear list
		* @function Clear
		*/
		public Clear():void;
		/**
		* Get all list items added using AddItem()
		* @function GetItems
		* @returns object[][]
		*/
		public GetItems():object[][];
		/**
		* Remove list item (associative object array)
		* @function RemoveItem
		* @param {object[]} item Item to remove
		*/
		public RemoveItem(item:object[]):void;
	}
}

/**
* 
* @class [Fit Fit]
*/
declare namespace Fit
{
	// Properties defined by Fit
	export function GetPath():string;
	export function GetUrl():string;
	export function GetVersion():any;
	export function SetPath(basePath:string):void;
	/**
	* Functionality extending the capabilities of native JS arrays
	* @class [Fit.Array Array]
	*/
	class Array
	{
		// Properties defined by Fit.Array
		/**
		* Add object to array
		* @function Add
		* @param {array} arr Array to which object is added
		* @param {object} obj Object to add to array
		*/
		public static Add(arr:any[], obj:any):void;
		/**
		* Clear all items from array
		* @function Clear
		* @param {array} arr Array from which all objects are remove
		*/
		public static Clear(arr:any[]):void;
		/**
		* Returns True if given object is contained in array, otherwise False
		* @function Contains
		* @param {array} arr Array to search through
		* @param {object} obj Object to look for
		* @returns boolean
		*/
		public static Contains(arr:any[], obj:any):boolean;
		/**
		* Returns a shallow copy of the array - for a deep copy see Fit.Core.Clone(..)
		* @function Copy
		* @param {array} arr Array to copy
		* @returns any[]
		*/
		public static Copy(arr:any[]):any[];
		/**
		* Returns number of elements in collection
		* @function Count
		* @param {array} arr Collection to count elements within
		* @returns number
		*/
		public static Count(arr:any[]):number;
		/**
		* Returns number of elements in object array
		* @function Count
		* @param {object} obj Object array to count elements within
		* @returns number
		*/
		public static Count(obj:any):number;
		/**
		* Iterate objects in collection and pass each object to provided callback. Callback is expected to return any children supposed to be iterated too, or Null if further/deeper iteration is not necessary.
		* @function CustomRecurse
		* @param {array} arr Array containing objects to iterate through
		* @param {function} callback Callback function accepting objects from the array, passed in turn. Function must return children collection to continue recursive operation, or Null to prevent further processing.
		* @returns boolean
		*/
		public static CustomRecurse(arr:any[], callback:Function):boolean;
		/**
		* Iterates through object properties and passes each property name to the provided callback function. Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @function ForEach
		* @param {object} obj Object containing properties to iterate through
		* @param {function} callback Callback function accepting properties from the object, passed in turn. Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach(obj:any, callback:Function):boolean;
		/**
		* Iterates through elements in array and passes each value to the provided callback function. Returns boolean indicating whether iteration was carried through (True) or interrupted (False).
		* @function ForEach
		* @param {array} arr Array containing values to iterate through
		* @param {function} callback Callback function accepting values from the array, passed in turn. Return False from callback to break loop.
		* @returns boolean
		*/
		public static ForEach(arr:any[], callback:Function):boolean;
		/**
		* Returns index of object in array if found, otherwise a value of -1 is returned
		* @function GetIndex
		* @param {array} arr Array to search through
		* @param {object} obj Object to obtain index for
		* @returns number
		*/
		public static GetIndex(arr:any[], obj:any):number;
		/**
		* Returns all keys in array (indices) - 0, 1, 2, 3, ...
		* @function GetKeys
		* @param {array} arr Array to get keys from
		* @returns any[]
		*/
		public static GetKeys(arr:any[]):any[];
		/**
		* Returns all keys (property names) in object
		* @function GetKeys
		* @param {object} obj Object to get keys from
		* @returns any[]
		*/
		public static GetKeys(obj:any):any[];
		/**
		* Insert object into array at specified index
		* @function Insert
		* @param {array} arr Array into which object is inserted
		* @param {integer} idx Index to insert object at
		* @param {object} obj Object to insert into array
		*/
		public static Insert(arr:any[], idx:number, obj:any):void;
		/**
		* Merge/join two arrays
		* @function Merge
		* @param {array} arr1 Array 1 to merge with array 2
		* @param {array} arr2 Array 2 to merge with array 1
		*/
		public static Merge(arr1:any[], arr2:any[]):void;
		/**
		* Recursively iterates through objects in array and passes each object to the provided callback function. Returns boolean indicating whether recursion was carried through (True) or interrupted (False).
		* @function Recurse
		* @param {array} arr Array containing objects to iterate through
		* @param {string} childrenProperty Name of property or argumentless getter function returning children (e.g. &quot;Children&quot; or &quot;GetChildren&quot;)
		* @param {function} callback Callback function accepting objects from the array, passed in turn. Return False from callback to break loop.
		* @returns boolean
		*/
		public static Recurse(arr:any[], childrenProperty:string, callback:Function):boolean;
		/**
		* Remove object from array
		* @function Remove
		* @param {array} arr Array from which object is remove
		* @param {object} obj Object to remove from array
		*/
		public static Remove(arr:any[], obj:any):void;
		/**
		* Remove object from array at specified index
		* @function RemoveAt
		* @param {array} arr Array from which object is remove
		* @param {integer} idx Object index in array
		*/
		public static RemoveAt(arr:any[], idx:number):void;
		/**
		* Convert collection (NodeList, StaticNodeList, or HTMLCollection) to JS array
		* @function ToArray
		* @param {object} coll Collection to convert to array
		* @returns any[]
		*/
		public static ToArray(coll:any):any[];
	}
	/**
	* Provides access to various browser information.  // Example code  var browserName = Fit.Browser.GetBrowser(); var browserVersion = Fit.Browser.GetVersion(); var browserLanguage = Fit.Browser.GetLanguage();  if (browserName === &quot;MSIE&quot; &amp;&amp; browserVersion &lt; 7) { &#160;&#160;&#160;&#160; if (browserLanguage === &quot;da&quot;) &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; alert(&quot;Opgrader venligst til IE7 eller nyere&quot;); &#160;&#160;&#160;&#160; else &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; alert(&quot;Please upgrade to IE7 or newer&quot;); }
	* @class [Fit.Browser Browser]
	*/
	class Browser
	{
		// Properties defined by Fit.Browser
		/**
		* Returns browser name. Possible values are: Chrome, Safari, Edge, MSIE, Firefox, Opera, Unknown
		* @function GetBrowser
		* @returns string
		*/
		public static GetBrowser():string;
		/**
		* Returns cached object with browser information available through Name, Version, and Language properties
		* @function GetInfo
		* @returns any
		*/
		public static GetInfo():any;
		/**
		* Returns browser language - e.g. &quot;da&quot; (Danish), &quot;en&quot; (English) etc.
		* @function GetLanguage
		* @returns string
		*/
		public static GetLanguage():string;
		/**
		* Returns page height in pixels
		* @function GetPageHeight
		* @returns number
		*/
		public static GetPageHeight():number;
		/**
		* Returns page width in pixels
		* @function GetPageWidth
		* @returns number
		*/
		public static GetPageWidth():number;
		/**
		* Returns query string object containing the following properties: - Url:string (Full URL) - Parameters:object (associative object array with URL parameters as keys) - Anchor:string (anchor if set, otherwise Null)
		* @function GetQueryString
		* @param {string} [alternativeUrl=undefined] Alternative URL to parse
		* @returns any
		*/
		public static GetQueryString(alternativeUrl?:string):any;
		/**
		* Returns object with Width and Height properties specifying screen dimensions
		* @function GetScreenDimensions
		* @param {boolean} [onlyAvailable=false] Set True to return only available space (may be reduced by e.g. Start menu (Windows) or Dock (Linux/OSX)
		* @returns any
		*/
		public static GetScreenDimensions(onlyAvailable?:boolean):any;
		/**
		* Get screen height
		* @function GetScreenHeight
		* @param {boolean} [onlyAvailable=false] Set True to return only available space (may be reduced by e.g. start menu (Windows) or Dock (Linux/OSX)
		* @returns number
		*/
		public static GetScreenHeight(onlyAvailable?:boolean):number;
		/**
		* Get screen width
		* @function GetScreenWidth
		* @param {boolean} [onlyAvailable=false] Set True to return only available space (may be reduced by e.g. start menu (Windows) or Dock (Linux/OSX)
		* @returns number
		*/
		public static GetScreenWidth(onlyAvailable?:boolean):number;
		/**
		* Returns object with X and Y properties specifying scroll position
		* @function GetScrollPosition
		* @returns any
		*/
		public static GetScrollPosition():any;
		/**
		* Returns major version number for known browsers, -1 for unknown browsers
		* @function GetVersion
		* @returns number
		*/
		public static GetVersion():number;
		/**
		* Returns object with Width and Height properties specifying dimensions of viewport
		* @function GetViewPortDimensions
		* @returns any
		*/
		public static GetViewPortDimensions():any;
		/**
		* Returns value indicating whether devices currently being used is a mobile device or not
		* @function IsMobile
		* @param {boolean} [includeTablets=true] Value indicating whether tablets are considered mobile devices or not
		* @returns boolean
		*/
		public static IsMobile(includeTablets?:boolean):boolean;
		/**
		* Returns value indicating whether Session and Local storage is supported or not
		* @function IsStorageSupported
		* @returns boolean
		*/
		public static IsStorageSupported():boolean;
		/**
		* Log message or object
		* @function Log
		* @param {object} msg Message or object to log
		*/
		public static Log(msg:any):void;
	}
	/**
	* 
	* @class [Fit.Color Color]
	*/
	class Color
	{
		// Properties defined by Fit.Color
		/**
		* Convert HEX color string into RGB color string - returns Null in case of invalid HEX value
		* @function HexToRgb
		* @param {string} hex HEX color string, e.g. #C0C0C0 (hash symbol is optional)
		* @returns string
		*/
		public static HexToRgb(hex:string):string;
		/**
		* Convert HEX color string into RGB color object, e.g. { Red: 150, Green: 30, Blue: 185 } - returns Null in case of invalid HEX value
		* @function ParseHex
		* @param {string} hex HEX color string, e.g. #C0C0C0 (hash symbol is optional)
		* @returns any
		*/
		public static ParseHex(hex:string):any;
		/**
		* Parses RGB(A) string and turns result into a RGB(A) color object, e.g. { Red: 100, Green: 100, Blue: 100, Alpha: 0.3 } - returns Null in case of invalid value.
		* @function ParseRgb
		* @param {string} val RGB(A) color string, e.g. rgba(100, 100, 100, 0.3) or simply 100,100,200,0.3
		* @returns any
		*/
		public static ParseRgb(val:string):any;
		/**
		* Convert RGB colors into HEX color string - returns Null in case of invalid RGB values
		* @function RgbToHex
		* @param {integer} r Color index for red
		* @param {integer} g Color index for green
		* @param {integer} b Color index for blue
		* @returns string
		*/
		public static RgbToHex(r:number, g:number, b:number):string;
	}
	/**
	* 
	* @class [Fit.Controls Controls]
	*/
	namespace Controls
	{
		// Properties defined by Fit.Controls
		export function DirtyCheckAll(scope?:string):boolean;
		export function Find(id:string):any;
		export function ValidateAll(scope?:string):boolean;
		/**
		* Button control with support for Font Awesome icons
		* @class [Fit.Controls.Button Button]
		*/
		class Button
		{
			// Properties defined by Fit.Controls.Button
			/**
			* Create instance of Button control
			* @function Button
			* @param {string} [controlId=undefined] Unique control ID. If specified, control will be accessible using the Fit.Controls.Find(..) function.
			*/
			constructor(controlId?:string);
			/**
			* Programmatically trigger a button click
			* @function Click
			*/
			public Click():void;
			/**
			* Destroys control to free up memory
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether button is enabled or not
			* @function Enabled
			* @param {boolean} [val=undefined] If specified, True enables button, False disables it
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [focus=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(focus?:boolean):boolean;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID - returns Null if not set
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Get/set control height - returns object with Value and Unit properties
			* @function Height
			* @param {number} [val=undefined] If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {string} [unit=px] If defined, control height is updated to specified CSS unit
			* @returns any
			*/
			public Height(val?:number, unit?:string):any;
			/**
			* Get/set button icon (Font Awesome icon name, e.g. fa-check-circle-o - http://fontawesome.io/icons)
			* @function Icon
			* @param {string} [val=undefined] If specified, button icon will be set to specified value
			* @returns string
			*/
			public Icon(val?:string):string;
			/**
			* Set callback function invoked when button is clicked
			* @function OnClick
			* @param {function} cb Callback function invoked when button is clicked - takes button instance as argument
			*/
			public OnClick(cb:Function):void;
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set button title
			* @function Title
			* @param {string} [val=undefined] If specified, button title will be set to specified value
			* @returns string
			*/
			public Title(val?:string):string;
			/**
			* Get/set button type producing specific look and feel. Possible values are: - Fit.Controls.Button.Type.Default (white) - Fit.Controls.Button.Type.Primary (blue) - Fit.Controls.Button.Type.Success (green) - Fit.Controls.Button.Type.Info (turquoise) - Fit.Controls.Button.Type.Warning (orange) - Fit.Controls.Button.Type.Danger (red)
			* @function Type
			* @param {Fit.Controls.Button.Type} [val=undefined] If specified, button type will be set to specified value
			* @returns typeof Fit.Controls.Button.Type[keyof __FitInternals.IFitControlsButtonType]
			*/
			public Type(val?:typeof Fit.Controls.Button.Type[keyof __FitInternals.IFitControlsButtonType]):typeof Fit.Controls.Button.Type[keyof __FitInternals.IFitControlsButtonType];
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
			public static readonly Type : __FitInternals.IFitControlsButtonType;
		}
		/**
		* Simple CheckBox control. Extending from Fit.Controls.ControlBase.
		* @class [Fit.Controls.CheckBox CheckBox]
		*/
		class CheckBox
		{
			// Properties defined by Fit.Controls.CheckBox
			/**
			* Create instance of CheckBox control
			* @function CheckBox
			* @param {string} ctlId Unique control ID
			*/
			constructor(ctlId:string);
			/**
			* Get/set value indicating whether control is checked
			* @function Checked
			* @param {boolean} [val=undefined] If defined, control&#39;s checked state is updated to specified value
			* @returns boolean
			*/
			public Checked(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control is enabled or not
			* @function Enabled
			* @param {boolean} [val=undefined] If specified, True enables control, False disables it
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Get/set label associated with checkbox
			* @function Label
			* @param {string} [val=undefined] If defined, label is updated to specified value
			* @returns string
			*/
			public Label(val?:string):string;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
			// Properties defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control
			* @function AddCssClass
			* @param {string} val CSS class to add
			*/
			public AddCssClass(val:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This comes in handy when programmatically changing a value of a control on behalf of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] If defined, Always Dirty is enabled/disabled
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed
			* @function AutoPostBack
			* @param {boolean} [val=undefined] If defined, True enables auto post back, False disables it
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value
			* @function Clear
			*/
			public Clear():void;
			/**
			* Destroys control to free up memory. Make sure to call Dispose() on ControlBase which can be done like so: this.Dispose = Fit.Core.CreateOverride(this.Dispose, function() { &#160;&#160;&#160;&#160; // Add control specific dispose logic here &#160;&#160;&#160;&#160; base(); // Call Dispose on ControlBase });
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Check whether CSS class is found on DOMElement representing control
			* @function HasCssClass
			* @param {string} val CSS class to check for
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties
			* @function Height
			* @param {number} [val=undefined] If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {string} [unit=px] If defined, control height is updated to specified CSS unit
			* @returns any
			*/
			public Height(val?:number, unit?:string):any;
			/**
			* Get value indicating whether user has changed control value
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid. Control value is considered invalid if control is required, but no value is set, or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus
			* @function OnBlur
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnBlur(cb:Function):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user
			* @function OnChange
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnChange(cb:Function):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus
			* @function OnFocus
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnFocus(cb:Function):void;
			/**
			* Remove CSS class from DOMElement representing control
			* @function RemoveCssClass
			* @param {string} val CSS class to remove
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set value indicating whether control is required to be set
			* @function Required
			* @param {boolean} [val=undefined] If defined, control required feature is enabled/disabled
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] If defined, control scope is updated
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* Set callback function used to perform on-the-fly validation against control value
			* @function SetValidationCallback
			* @param {function} cb Function receiving control value - must return True if value is valid, otherwise False
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationCallback(cb:Function, errorMsg?:string):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value
			* @function SetValidationExpression
			* @param {RegExp} regEx Regular expression to validate against
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationExpression(regEx:RegExp, errorMsg?:string):void;
			/**
			* Get/set control value. For controls supporting multiple selections: Set value by providing a string in one the following formats: title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]]. If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded. Selected items are returned in the first format described, also with reserved characters URIEncoded. Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] If defined, items are selected
			* @returns string
			*/
			public Value(val?:string):string;
			/**
			* Get/set value indicating whether control is visible
			* @function Visible
			* @param {boolean} [val=undefined] If defined, control visibility is updated
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
		}
		/**
		* ContextMenu control allowing for quick access to select features.
		* @class [Fit.Controls.ContextMenu ContextMenu]
		*/
		class ContextMenu
		{
			// Properties defined by Fit.Controls.ContextMenu
			/**
			* Add item to ContextMenu
			* @function AddChild
			* @param {Fit.Controls.ContextMenu.Item} item Item to add
			*/
			public AddChild(item:__FitInternals.FitControlsContextMenuItem):void;
			/**
			* Create instance of ContextMenu control
			* @function ContextMenu
			*/
			constructor();
			/**
			* Get/set value indicating whether boundary/collision detection is enabled or not
			* @function DetectBoundaries
			* @param {boolean} [val=undefined] If defined, True enables collision detection (default), False disables it
			* @returns boolean
			*/
			public DetectBoundaries(val?:boolean):boolean;
			/**
			* Destroys component to free up memory
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get all children across entire hierarchy in a flat collection
			* @function GetAllChildren
			* @returns __FitInternals.FitControlsContextMenuItem[]
			*/
			public GetAllChildren():__FitInternals.FitControlsContextMenuItem[];
			/**
			* Get item by value - returns Null if not found
			* @function GetChild
			* @param {string} val Item value
			* @param {boolean} [recursive=false] If defined, True enables recursive search
			* @returns __FitInternals.FitControlsContextMenuItem
			*/
			public GetChild(val:string, recursive?:boolean):__FitInternals.FitControlsContextMenuItem;
			/**
			* Get all children
			* @function GetChildren
			* @returns __FitInternals.FitControlsContextMenuItem[]
			*/
			public GetChildren():__FitInternals.FitControlsContextMenuItem[];
			/**
			* Get DOMElement representing context menu
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Hide context menu
			* @function Hide
			*/
			public Hide():void;
			/**
			* Get value indicating whether context menu is visible or not
			* @function IsVisible
			* @returns boolean
			*/
			public IsVisible():boolean;
			/**
			* Add event handler fired when context menu is hidden. Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnHide
			* @param {function} cb Event handler function
			*/
			public OnHide(cb:Function):void;
			/**
			* Add event handler fired when an item is selected in context menu. Function receives two arguments: Sender (Fit.Controls.ContextMenu) and Item (Fit.Controls.ContextMenu.Item).
			* @function OnSelect
			* @param {function} cb Event handler function
			*/
			public OnSelect(cb:Function):void;
			/**
			* Add event handler fired before context menu is shown. This event can be canceled by returning False. Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnShowing
			* @param {function} cb Event handler function
			*/
			public OnShowing(cb:Function):void;
			/**
			* Add event handler fired when context menu is shown. Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnShown
			* @param {function} cb Event handler function
			*/
			public OnShown(cb:Function):void;
			/**
			* Remove all items contained in ContextMenu
			* @function RemoveAllChildren
			* @param {boolean} [dispose=false] Set True to dispose items
			*/
			public RemoveAllChildren(dispose?:boolean):void;
			/**
			* Remove item from ContextMenu
			* @function RemoveChild
			* @param {Fit.Controls.ContextMenu.Item} item Item to remove
			*/
			public RemoveChild(item:__FitInternals.FitControlsContextMenuItem):void;
			/**
			* Make context menu show up. If X,Y coordinates are not specified, the position of the mouse pointer will be used.
			* @function Show
			* @param {integer} [x=undefined] If defined, context menu will open at specified horizontal position
			* @param {integer} [y=undefined] If defined, context menu will open at specified vertical position
			*/
			public Show(x?:number, y?:number):void;
			public static Item : typeof __FitInternals.FitControlsContextMenuItem;
		}
		/**
		* Class from which all UI Controls extend
		* @class [Fit.Controls.ControlBase ControlBase]
		*/
		class ControlBase
		{
			// Properties defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control
			* @function AddCssClass
			* @param {string} val CSS class to add
			*/
			public AddCssClass(val:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This comes in handy when programmatically changing a value of a control on behalf of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] If defined, Always Dirty is enabled/disabled
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed
			* @function AutoPostBack
			* @param {boolean} [val=undefined] If defined, True enables auto post back, False disables it
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value
			* @function Clear
			*/
			public Clear():void;
			/**
			* Destroys control to free up memory. Make sure to call Dispose() on ControlBase which can be done like so: this.Dispose = Fit.Core.CreateOverride(this.Dispose, function() { &#160;&#160;&#160;&#160; // Add control specific dispose logic here &#160;&#160;&#160;&#160; base(); // Call Dispose on ControlBase });
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Check whether CSS class is found on DOMElement representing control
			* @function HasCssClass
			* @param {string} val CSS class to check for
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties
			* @function Height
			* @param {number} [val=undefined] If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {string} [unit=px] If defined, control height is updated to specified CSS unit
			* @returns any
			*/
			public Height(val?:number, unit?:string):any;
			/**
			* Get value indicating whether user has changed control value
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid. Control value is considered invalid if control is required, but no value is set, or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus
			* @function OnBlur
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnBlur(cb:Function):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user
			* @function OnChange
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnChange(cb:Function):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus
			* @function OnFocus
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnFocus(cb:Function):void;
			/**
			* Remove CSS class from DOMElement representing control
			* @function RemoveCssClass
			* @param {string} val CSS class to remove
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set value indicating whether control is required to be set
			* @function Required
			* @param {boolean} [val=undefined] If defined, control required feature is enabled/disabled
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] If defined, control scope is updated
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* Set callback function used to perform on-the-fly validation against control value
			* @function SetValidationCallback
			* @param {function} cb Function receiving control value - must return True if value is valid, otherwise False
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationCallback(cb:Function, errorMsg?:string):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value
			* @function SetValidationExpression
			* @param {RegExp} regEx Regular expression to validate against
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationExpression(regEx:RegExp, errorMsg?:string):void;
			/**
			* Get/set control value. For controls supporting multiple selections: Set value by providing a string in one the following formats: title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]]. If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded. Selected items are returned in the first format described, also with reserved characters URIEncoded. Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] If defined, items are selected
			* @returns string
			*/
			public Value(val?:string):string;
			/**
			* Get/set value indicating whether control is visible
			* @function Visible
			* @param {boolean} [val=undefined] If defined, control visibility is updated
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
		}
		/**
		* DatePicker control allowing user to easily pick a date and optionally time. On mobile devices (phones and tablets) the native date and time pickers are used. Extending from Fit.Controls.ControlBase.
		* @class [Fit.Controls.DatePicker DatePicker]
		*/
		class DatePicker
		{
			// Properties defined by Fit.Controls.DatePicker
			/**
			* Get/set control value. The function works the same as the Value function, expect it accepts and returns a Date object instead of a string.
			* @function Date
			* @param {Date} [val=undefined] If defined, date is selected
			* @returns Date
			*/
			public Date(val?:Date):Date;
			/**
			* Create instance of DatePicker control
			* @function DatePicker
			* @param {string} ctlId Unique control ID
			*/
			constructor(ctlId:string);
			/**
			* Get/set format used by the DatePicker control. This will affect the format in which the date is presented, as well as the value returned by the GetText function. Format takes precedense over locale if set after locale is applied.
			* @function Format
			* @param {string} [val=undefined] If defined, format is changed. The following tokens can be used to construct the format: YYYY = Year with four digits (e.g. 2016) M = Month with one digit if possible (e.g. 1 or 12) MM = Month with two digits (e.g. 01 or 12) D = Day with one digit if possible (e.g. 1 or 24) DD = Day with two digits (e.g. 01 or 24) Examples: YYYY-MM-DD or D/M-YYYY
			* @returns string
			*/
			public Format(val?:string):string;
			/**
			* Returns a string array containing supported locales
			* @function GetLocales
			* @returns string[]
			*/
			public GetLocales():string[];
			/**
			* Get control value as a string. Opposite to the Value function GetText returns the selected Date/DateTime in the format configured (see Format function). The Value function always returns the value in a fixed format, which is YYYY-MM-DD[ hh:mm]. The time portion is only appended if time is enabled (see Time function).
			* @function GetText
			* @returns string
			*/
			public GetText():string;
			/**
			* Calling this function will close the calendar widget. Whether this results in picker being hidden on mobile depends on implementation. Often it will only work if Hide() or Focused(false) is triggered by a user action such as a button click.
			* @function Hide
			*/
			public Hide():void;
			/**
			* Get/set locale used by the DatePicker control. This will affect the date format as well as the language used by the calendar widget. Call the GetLocales function to get a complete list of supported locales.
			* @function Locale
			* @param {string} [val=undefined] If defined, locale is changed
			* @returns string
			*/
			public Locale(val?:string):string;
			/**
			* Calling this function will open the calendar widget. Whether this results in picker being displayed on mobile depends on implementation. Often it will only work if Show() or Focused(true) is triggered by a user action such as a button click.
			* @function Show
			*/
			public Show():void;
			/**
			* Get/set value indicating whether DatePicker should allow a time portion to be set.
			* @function Time
			* @param {boolean} [val=undefined] If defined, time is changed
			* @returns boolean
			*/
			public Time(val?:boolean):boolean;
			// Properties defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control
			* @function AddCssClass
			* @param {string} val CSS class to add
			*/
			public AddCssClass(val:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This comes in handy when programmatically changing a value of a control on behalf of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] If defined, Always Dirty is enabled/disabled
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed
			* @function AutoPostBack
			* @param {boolean} [val=undefined] If defined, True enables auto post back, False disables it
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value
			* @function Clear
			*/
			public Clear():void;
			/**
			* Destroys control to free up memory. Make sure to call Dispose() on ControlBase which can be done like so: this.Dispose = Fit.Core.CreateOverride(this.Dispose, function() { &#160;&#160;&#160;&#160; // Add control specific dispose logic here &#160;&#160;&#160;&#160; base(); // Call Dispose on ControlBase });
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Check whether CSS class is found on DOMElement representing control
			* @function HasCssClass
			* @param {string} val CSS class to check for
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties
			* @function Height
			* @param {number} [val=undefined] If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {string} [unit=px] If defined, control height is updated to specified CSS unit
			* @returns any
			*/
			public Height(val?:number, unit?:string):any;
			/**
			* Get value indicating whether user has changed control value
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid. Control value is considered invalid if control is required, but no value is set, or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus
			* @function OnBlur
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnBlur(cb:Function):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user
			* @function OnChange
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnChange(cb:Function):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus
			* @function OnFocus
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnFocus(cb:Function):void;
			/**
			* Remove CSS class from DOMElement representing control
			* @function RemoveCssClass
			* @param {string} val CSS class to remove
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set value indicating whether control is required to be set
			* @function Required
			* @param {boolean} [val=undefined] If defined, control required feature is enabled/disabled
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] If defined, control scope is updated
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* Set callback function used to perform on-the-fly validation against control value
			* @function SetValidationCallback
			* @param {function} cb Function receiving control value - must return True if value is valid, otherwise False
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationCallback(cb:Function, errorMsg?:string):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value
			* @function SetValidationExpression
			* @param {RegExp} regEx Regular expression to validate against
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationExpression(regEx:RegExp, errorMsg?:string):void;
			/**
			* Get/set control value. For controls supporting multiple selections: Set value by providing a string in one the following formats: title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]]. If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded. Selected items are returned in the first format described, also with reserved characters URIEncoded. Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] If defined, items are selected
			* @returns string
			*/
			public Value(val?:string):string;
			/**
			* Get/set value indicating whether control is visible
			* @function Visible
			* @param {boolean} [val=undefined] If defined, control visibility is updated
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
		}
		/**
		* Simple Dialog control with support for Fit.UI buttons.
		* @class [Fit.Controls.Dialog Dialog]
		*/
		class Dialog
		{
			// Properties defined by Fit.Controls.Dialog
			/**
			* Display alert dialog
			* @function Alert
			* @param {string} content Content to display in alert dialog
			* @param {function} [cb=undefined] Optional callback function invoked when OK button is clicked
			*/
			public static Alert(content:string, cb?:Function):void;
			/**
			* Display confirmation dialog with OK and Cancel buttons
			* @function Confirm
			* @param {string} content Content to display in confirmation dialog
			* @param {function} cb Callback function invoked when a button is clicked. True is passed to callback function when OK is clicked, otherwise False.
			*/
			public static Confirm(content:string, cb:Function):void;
			/**
			* Add button to dialog
			* @function AddButton
			* @param {Fit.Controls.Button} btn Instance of Fit.Controls.Button
			*/
			public AddButton(btn:Fit.Controls.Button):void;
			/**
			* Close dialog
			* @function Close
			*/
			public Close():void;
			/**
			* Get/set dialog content
			* @function Content
			* @param {string} [val=undefined] If specified, dialog content is updated with specified value
			* @returns string
			*/
			public Content(val?:string):string;
			/**
			* Create instance of Dialog control
			* @function Dialog
			*/
			constructor();
			/**
			* Destroys component to free up memory, including associated buttons
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get/set value indicating whether dialog is modal or not
			* @function Modal
			* @param {boolean} [val=undefined] If specified, True enables modal mode, False disables it
			* @returns boolean
			*/
			public Modal(val?:boolean):boolean;
			/**
			* Open dialog
			* @function Open
			*/
			public Open():void;
		}
		/**
		* Drop Down Menu control allowing for single and multi selection. Supports data selection using any control extending from Fit.Controls.PickerBase. This control is extending from Fit.Controls.ControlBase.
		* @class [Fit.Controls.DropDown DropDown]
		*/
		class DropDown
		{
			// Properties defined by Fit.Controls.DropDown
			/**
			* Add selection to control
			* @function AddSelection
			* @param {string} title Item title
			* @param {string} value Item value
			* @param {boolean} [valid=true] Flag indicating whether selection is valid or not. Invalid selections are highlighted and not included when selections are retrived using Value() function, and not considered when IsDirty() is called to determine whether control value has been changed by user. GetSelections(true) can be used to retrive all items, including invalid selections.
			*/
			public AddSelection(title:string, value:string, valid?:boolean):void;
			/**
			* Clear text field
			* @function ClearInput
			*/
			public ClearInput():void;
			/**
			* Clear selections
			* @function ClearSelections
			*/
			public ClearSelections():void;
			/**
			* Close drop down menu
			* @function CloseDropDown
			*/
			public CloseDropDown():void;
			/**
			* Create instance of DropDown control
			* @function DropDown
			* @param {string} ctlId Unique control ID
			*/
			constructor(ctlId:string);
			/**
			* Get/set max height of drop down - returns object with Value (number) and Unit (string) properties
			* @function DropDownMaxHeight
			* @param {number} [value=undefined] If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {string} [unit=undefined] If defined, max height is updated to specified CSS unit, otherwise px is assumed
			* @returns any
			*/
			public DropDownMaxHeight(value?:number, unit?:string):any;
			/**
			* Get/set max width of drop down - returns object with Value (number) and Unit (string) properties
			* @function DropDownMaxWidth
			* @param {number} [value=undefined] If defined, max width is updated to specified value. A value of -1 forces drop down to use control width.
			* @param {string} [unit=undefined] If defined, max width is updated to specified CSS unit, otherwise px is assumed
			* @returns any
			*/
			public DropDownMaxWidth(value?:number, unit?:string):any;
			/**
			* Get input value
			* @function GetInputValue
			* @returns string
			*/
			public GetInputValue():string;
			/**
			* Get picker control used to add items to drop down control
			* @function GetPicker
			* @returns Fit.Controls.PickerBase
			*/
			public GetPicker():Fit.Controls.PickerBase;
			/**
			* Get selected item by value - returns object with Title (string), Value (string), and Valid (boolean) properties if found, otherwise Null is returned
			* @function GetSelectionByValue
			* @param {string} val Value of selected item to retrive
			* @returns any
			*/
			public GetSelectionByValue(val:string):any;
			/**
			* Get selected items - returned array contain objects with Title (string), Value (string), and Valid (boolean) properties
			* @function GetSelections
			* @param {boolean} [includeInvalid=false] Flag indicating whether invalid selection should be included or not
			* @returns any[]
			*/
			public GetSelections(includeInvalid?:boolean):any[];
			/**
			* Get/set value indicating whether input is enabled
			* @function InputEnabled
			* @param {boolean} [val=undefined] If defined, True enables input, False disables it
			* @returns boolean
			*/
			public InputEnabled(val?:boolean):boolean;
			/**
			* Get/set mouse over text shown for invalid selections
			* @function InvalidSelectionMessage
			* @param {string} [msg=undefined] If defined, error message for invalid selections are set
			* @returns string
			*/
			public InvalidSelectionMessage(msg?:string):string;
			/**
			* Get flag indicating whether drop down is open or not
			* @function IsDropDownOpen
			* @returns boolean
			*/
			public IsDropDownOpen():boolean;
			/**
			* Get/set flag indicating whether control allows for multiple selections
			* @function MultiSelectionMode
			* @param {boolean} [val=undefined] If defined, True enables multi selection mode, False disables it
			* @returns boolean
			*/
			public MultiSelectionMode(val?:boolean):boolean;
			/**
			* Add event handler fired when drop down menu is closed. Function receives one argument: Sender (Fit.Controls.DropDown)
			* @function OnClose
			* @param {function} cb Event handler function
			*/
			public OnClose(cb:Function):void;
			/**
			* Add event handler fired when input value is changed. Function receives two arguments: Sender (Fit.Controls.DropDown) and Value (string).
			* @function OnInputChanged
			* @param {function} cb Event handler function
			*/
			public OnInputChanged(cb:Function):void;
			/**
			* Add event handler fired when drop down menu is opened. Function receives one argument: Sender (Fit.Controls.DropDown)
			* @function OnOpen
			* @param {function} cb Event handler function
			*/
			public OnOpen(cb:Function):void;
			/**
			* Add event handler fired when text is pasted into input field. Function receives two arguments: Sender (Fit.Controls.DropDown) and Value (string). Return False to cancel event and change, and prevent OnInputChanged from firing.
			* @function OnPaste
			* @param {function} cb Event handler function
			*/
			public OnPaste(cb:Function):void;
			/**
			* Open drop down menu
			* @function OpenDropDown
			*/
			public OpenDropDown():void;
			/**
			* Remove selected item by value
			* @function RemoveSelection
			* @param {string} value Value of selected item to remove
			*/
			public RemoveSelection(value:string):void;
			/**
			* Set value of text field which is automatically cleared the first time control receives focus. Notice that this function should be called after AddSelection(..), since adding selections causes the value of the text field to be cleared.
			* @function SetInputValue
			* @param {string} val New value for text field
			*/
			public SetInputValue(val:string):void;
			/**
			* Set picker control used to add items to drop down control
			* @function SetPicker
			* @param {Fit.Controls.PickerBase} pickerControl Picker control extending from PickerBase
			*/
			public SetPicker(pickerControl:Fit.Controls.PickerBase):void;
			// Properties defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control
			* @function AddCssClass
			* @param {string} val CSS class to add
			*/
			public AddCssClass(val:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This comes in handy when programmatically changing a value of a control on behalf of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] If defined, Always Dirty is enabled/disabled
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed
			* @function AutoPostBack
			* @param {boolean} [val=undefined] If defined, True enables auto post back, False disables it
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value
			* @function Clear
			*/
			public Clear():void;
			/**
			* Destroys control to free up memory. Make sure to call Dispose() on ControlBase which can be done like so: this.Dispose = Fit.Core.CreateOverride(this.Dispose, function() { &#160;&#160;&#160;&#160; // Add control specific dispose logic here &#160;&#160;&#160;&#160; base(); // Call Dispose on ControlBase });
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Check whether CSS class is found on DOMElement representing control
			* @function HasCssClass
			* @param {string} val CSS class to check for
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties
			* @function Height
			* @param {number} [val=undefined] If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {string} [unit=px] If defined, control height is updated to specified CSS unit
			* @returns any
			*/
			public Height(val?:number, unit?:string):any;
			/**
			* Get value indicating whether user has changed control value
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid. Control value is considered invalid if control is required, but no value is set, or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus
			* @function OnBlur
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnBlur(cb:Function):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user
			* @function OnChange
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnChange(cb:Function):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus
			* @function OnFocus
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnFocus(cb:Function):void;
			/**
			* Remove CSS class from DOMElement representing control
			* @function RemoveCssClass
			* @param {string} val CSS class to remove
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set value indicating whether control is required to be set
			* @function Required
			* @param {boolean} [val=undefined] If defined, control required feature is enabled/disabled
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] If defined, control scope is updated
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* Set callback function used to perform on-the-fly validation against control value
			* @function SetValidationCallback
			* @param {function} cb Function receiving control value - must return True if value is valid, otherwise False
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationCallback(cb:Function, errorMsg?:string):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value
			* @function SetValidationExpression
			* @param {RegExp} regEx Regular expression to validate against
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationExpression(regEx:RegExp, errorMsg?:string):void;
			/**
			* Get/set control value. For controls supporting multiple selections: Set value by providing a string in one the following formats: title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]]. If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded. Selected items are returned in the first format described, also with reserved characters URIEncoded. Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] If defined, items are selected
			* @returns string
			*/
			public Value(val?:string):string;
			/**
			* Get/set value indicating whether control is visible
			* @function Visible
			* @param {boolean} [val=undefined] If defined, control visibility is updated
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
		}
		/**
		* Control allowing for files to be selected locally and uploaded asynchronously. Extending from Fit.Controls.ControlBase.
		* @class [Fit.Controls.FilePicker FilePicker]
		*/
		class FilePicker
		{
			// Properties defined by Fit.Controls.FilePicker
			/**
			* Get/set value indicating whether control is enabled or not
			* @function Enabled
			* @param {boolean} [val=undefined] If specified, True enables control, False disables it
			* @returns boolean
			*/
			public Enabled(val?:boolean):boolean;
			/**
			* Create instance of FilePicker control
			* @function FilePicker
			* @param {string} ctlId Unique control ID
			*/
			constructor(ctlId:string);
			/**
			* Get collection of selected files. Each file is represented as an object with the following members: - Filename:string (Name of selected file) - Type:string (Mime type for selected file) - Size:integer (File size in bytes) - Id:string (Unique file ID) - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded) - Input:HTMLInputElement (Input control used as file picker) - FileObject:File (Native JS File object representing selected file) - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types) NOTICE: The following properties/functions are not available in Legacy Mode: Type, Size, FileObject, GetImagePreview().
			* @function GetFiles
			* @returns object[]
			*/
			public GetFiles():object[];
			/**
			* Get value indicating whether control is in legacy mode (old fashion upload control)
			* @function IsLegacyModeEnabled
			* @returns boolean
			*/
			public IsLegacyModeEnabled():boolean;
			/**
			* Get/set flag indicating whether control allows for multiple selections
			* @function MultiSelectionMode
			* @param {boolean} [val=undefined] If defined, True enables multi selection mode, False disables it
			* @returns boolean
			*/
			public MultiSelectionMode(val?:boolean):boolean;
			/**
			* Add event handler fired when all files selected have been fully processed. Be aware that this event fires even if some files were not uploaded successfully. At this point files returned from GetFiles() contains a ServerResponse:string property containing the response from the server. This property remains Null in case of errors. Function receives one argument: Sender (Fit.Controls.FlePicker).
			* @function OnCompleted
			* @param {function} cb Event handler function
			*/
			public OnCompleted(cb:Function):void;
			/**
			* Add event handler fired for a given file if the upload process failed. Function receives two arguments: Sender (Fit.Controls.FlePicker) and EventArgs object. EventArgs object contains the following members: - Filename:string (Name of given file) - Type:string (Mime type for given file) - Size:integer (File size in bytes) - Id:string (Unique file ID) - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded) - Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded) - Input:HTMLInputElement (Input control used as file picker) - FileObject:File (Native JS File object representing given file) - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types) Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this case will be Null. GetImagePreview() will also return Null in Legacy Mode.
			* @function OnFailure
			* @param {function} cb Event handler function
			*/
			public OnFailure(cb:Function):void;
			/**
			* Add event handler fired when the upload process for a given file is progressing. Function receives two arguments: Sender (Fit.Controls.FlePicker) and EventArgs object. EventArgs object contains the following members: - Filename:string (Name of given file) - Type:string (Mime type for given file) - Size:integer (File size in bytes) - Id:string (Unique file ID) - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded) - Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded) - Input:HTMLInputElement (Input control used as file picker) - FileObject:File (Native JS File object representing given file) - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types) Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this case will be Null. GetImagePreview() will also return Null in Legacy Mode.
			* @function OnProgress
			* @param {function} cb Event handler function
			*/
			public OnProgress(cb:Function):void;
			/**
			* Add event handler fired when a file has successfully been uploaded. Function receives two arguments: Sender (Fit.Controls.FlePicker) and EventArgs object. EventArgs object contains the following members: - Filename:string (Name of given file) - Type:string (Mime type for given file) - Size:integer (File size in bytes) - Id:string (Unique file ID) - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded) - Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded) - Input:HTMLInputElement (Input control used as file picker) - FileObject:File (Native JS File object representing given file) - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types) - ServerResponse:string (Contains the response received from the server after a successful upload) Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this case will be Null. GetImagePreview() will also return Null in Legacy Mode.
			* @function OnSuccess
			* @param {function} cb Event handler function
			*/
			public OnSuccess(cb:Function):void;
			/**
			* Add event handler fired when upload is started. Operation can be canceled by returning False. Function receives one argument: Sender (Fit.Controls.FilePicker).
			* @function OnUpload
			* @param {function} cb Event handler function
			*/
			public OnUpload(cb:Function):void;
			/**
			* Get/set file picker title
			* @function Title
			* @param {string} [val=undefined] If defined, file picker title is set to specified value
			* @returns string
			*/
			public Title(val?:string):string;
			/**
			* Upload selected files. Each file will be uploaded using POST over individual HTTP connections, and each file will be accessible from the POST data collection using the SelectedFile key. Use the OnProgress event to monitor the upload process, or use the OnCompleted event to be notified when all files have been fully processed.
			* @function Upload
			* @param {string[]} [skip=undefined] Optional argument allowing some of the selected files to be skipped during upload. The argument is a string array with the names of the files to skip.
			*/
			public Upload(skip?:string[]):void;
			/**
			* Get/set URL to which files are uploaded when FilePicker.Upload() is called. Multiple files will be uploaded using POST over individual HTTP connections, and each file will be accessible from the POST data collection using the SelectedFile key.
			* @function Url
			* @param {string} [url=undefined] If defined, upload URL is set to specified value
			* @returns string
			*/
			public Url(url?:string):string;
			/**
			* Fit.Controls.ControlBase.Width override: Get/set control width - returns object with Value and Unit properties. This implementation differs from ControlBase.Width as passing a value of -1 resets the control width to fit its content, rather than assuming a fixed default width.
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
			// Properties defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control
			* @function AddCssClass
			* @param {string} val CSS class to add
			*/
			public AddCssClass(val:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This comes in handy when programmatically changing a value of a control on behalf of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] If defined, Always Dirty is enabled/disabled
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed
			* @function AutoPostBack
			* @param {boolean} [val=undefined] If defined, True enables auto post back, False disables it
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value
			* @function Clear
			*/
			public Clear():void;
			/**
			* Destroys control to free up memory. Make sure to call Dispose() on ControlBase which can be done like so: this.Dispose = Fit.Core.CreateOverride(this.Dispose, function() { &#160;&#160;&#160;&#160; // Add control specific dispose logic here &#160;&#160;&#160;&#160; base(); // Call Dispose on ControlBase });
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Check whether CSS class is found on DOMElement representing control
			* @function HasCssClass
			* @param {string} val CSS class to check for
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties
			* @function Height
			* @param {number} [val=undefined] If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {string} [unit=px] If defined, control height is updated to specified CSS unit
			* @returns any
			*/
			public Height(val?:number, unit?:string):any;
			/**
			* Get value indicating whether user has changed control value
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid. Control value is considered invalid if control is required, but no value is set, or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus
			* @function OnBlur
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnBlur(cb:Function):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user
			* @function OnChange
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnChange(cb:Function):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus
			* @function OnFocus
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnFocus(cb:Function):void;
			/**
			* Remove CSS class from DOMElement representing control
			* @function RemoveCssClass
			* @param {string} val CSS class to remove
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set value indicating whether control is required to be set
			* @function Required
			* @param {boolean} [val=undefined] If defined, control required feature is enabled/disabled
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] If defined, control scope is updated
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* Set callback function used to perform on-the-fly validation against control value
			* @function SetValidationCallback
			* @param {function} cb Function receiving control value - must return True if value is valid, otherwise False
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationCallback(cb:Function, errorMsg?:string):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value
			* @function SetValidationExpression
			* @param {RegExp} regEx Regular expression to validate against
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationExpression(regEx:RegExp, errorMsg?:string):void;
			/**
			* Get/set control value. For controls supporting multiple selections: Set value by providing a string in one the following formats: title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]]. If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded. Selected items are returned in the first format described, also with reserved characters URIEncoded. Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] If defined, items are selected
			* @returns string
			*/
			public Value(val?:string):string;
			/**
			* Get/set value indicating whether control is visible
			* @function Visible
			* @param {boolean} [val=undefined] If defined, control visibility is updated
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
		}
		/**
		* Input control which allows for one or multiple lines of text, and features a Design Mode for rich HTML content. Extending from Fit.Controls.ControlBase.
		* @class [Fit.Controls.Input Input]
		*/
		class Input
		{
			// Properties defined by Fit.Controls.Input
			/**
			* Get/set value indicating whether control should have spell checking enabled (default) or disabled
			* @function CheckSpelling
			* @param {boolean} [val=undefined] If defined, true enables spell checking while false disables it
			* @returns boolean
			*/
			public CheckSpelling(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control is in Design Mode allowing for rich HTML content. Notice that this control type requires dimensions (Width/Height) to be specified in pixels.
			* @function DesignMode
			* @param {boolean} [val=undefined] If defined, True enables Design Mode, False disables it
			* @returns boolean
			*/
			public DesignMode(val?:boolean):boolean;
			/**
			* Create instance of Input control
			* @function Input
			* @param {string} ctlId Unique control ID
			*/
			constructor(ctlId:string);
			/**
			* Get/set value indicating whether control is maximizable
			* @function Maximizable
			* @param {boolean} [val=undefined] If defined, True enables maximize button, False disables it
			* @param {number} [heightMax=undefined] If defined, this becomes the height of the input control when maximized. The value is considered the same unit set using Height(..) which defaults to px. However, if DesignMode is enabled, the value unit is considered to be px.
			* @returns boolean
			*/
			public Maximizable(val?:boolean, heightMax?:number):boolean;
			/**
			* Get/set value indicating whether control is maximized
			* @function Maximized
			* @param {boolean} [val=undefined] If defined, True maximizes control, False minimizes it
			* @returns boolean
			*/
			public Maximized(val?:boolean):boolean;
			/**
			* Get/set value indicating whether control is in Multi Line mode (textarea)
			* @function MultiLine
			* @param {boolean} [val=undefined] If defined, True enables Multi Line mode, False disables it
			* @returns boolean
			*/
			public MultiLine(val?:boolean):boolean;
			/**
			* Get/set input type (e.g. Text, Password, Email, etc.)
			* @function Type
			* @param {Fit.Controls.Input.Type} [val=undefined] If defined, input type is changed to specified value
			* @returns typeof Fit.Controls.Input.Type[keyof __FitInternals.IFitControlsInputType]
			*/
			public Type(val?:typeof Fit.Controls.Input.Type[keyof __FitInternals.IFitControlsInputType]):typeof Fit.Controls.Input.Type[keyof __FitInternals.IFitControlsInputType];
			// Properties defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control
			* @function AddCssClass
			* @param {string} val CSS class to add
			*/
			public AddCssClass(val:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This comes in handy when programmatically changing a value of a control on behalf of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] If defined, Always Dirty is enabled/disabled
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed
			* @function AutoPostBack
			* @param {boolean} [val=undefined] If defined, True enables auto post back, False disables it
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value
			* @function Clear
			*/
			public Clear():void;
			/**
			* Destroys control to free up memory. Make sure to call Dispose() on ControlBase which can be done like so: this.Dispose = Fit.Core.CreateOverride(this.Dispose, function() { &#160;&#160;&#160;&#160; // Add control specific dispose logic here &#160;&#160;&#160;&#160; base(); // Call Dispose on ControlBase });
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Check whether CSS class is found on DOMElement representing control
			* @function HasCssClass
			* @param {string} val CSS class to check for
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties
			* @function Height
			* @param {number} [val=undefined] If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {string} [unit=px] If defined, control height is updated to specified CSS unit
			* @returns any
			*/
			public Height(val?:number, unit?:string):any;
			/**
			* Get value indicating whether user has changed control value
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid. Control value is considered invalid if control is required, but no value is set, or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus
			* @function OnBlur
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnBlur(cb:Function):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user
			* @function OnChange
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnChange(cb:Function):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus
			* @function OnFocus
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnFocus(cb:Function):void;
			/**
			* Remove CSS class from DOMElement representing control
			* @function RemoveCssClass
			* @param {string} val CSS class to remove
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set value indicating whether control is required to be set
			* @function Required
			* @param {boolean} [val=undefined] If defined, control required feature is enabled/disabled
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] If defined, control scope is updated
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* Set callback function used to perform on-the-fly validation against control value
			* @function SetValidationCallback
			* @param {function} cb Function receiving control value - must return True if value is valid, otherwise False
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationCallback(cb:Function, errorMsg?:string):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value
			* @function SetValidationExpression
			* @param {RegExp} regEx Regular expression to validate against
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationExpression(regEx:RegExp, errorMsg?:string):void;
			/**
			* Get/set control value. For controls supporting multiple selections: Set value by providing a string in one the following formats: title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]]. If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded. Selected items are returned in the first format described, also with reserved characters URIEncoded. Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] If defined, items are selected
			* @returns string
			*/
			public Value(val?:string):string;
			/**
			* Get/set value indicating whether control is visible
			* @function Visible
			* @param {boolean} [val=undefined] If defined, control visibility is updated
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
			public static readonly Type : __FitInternals.IFitControlsInputType;
		}
		/**
		* Picker control which allows for entries to be selected in the DropDown control.
		* @class [Fit.Controls.ListView ListView]
		*/
		class ListView
		{
			// Properties defined by Fit.Controls.ListView
			/**
			* Add item to ListView
			* @function AddItem
			* @param {string} title Item title
			* @param {string} value Item value
			*/
			public AddItem(title:string, value:string):void;
			/**
			* Returns value indicating whether control contains item with specified value
			* @function HasItem
			* @param {string} value Value of item to check for
			* @returns boolean
			*/
			public HasItem(value:string):boolean;
			/**
			* Create instance of ListView control
			* @function ListView
			* @param {string} [controlId=undefined] Unique control ID. if specified, control will be accessible using the Fit.Controls.Find(..) function.
			*/
			constructor(controlId?:string);
			/**
			* Remove item from ListView
			* @function RemoveItem
			* @param {string} value Value of item to remove
			*/
			public RemoveItem(value:string):void;
			/**
			* Remove all items from ListView
			* @function RemoveItems
			*/
			public RemoveItems():void;
			// Properties defined by Fit.Controls.PickerBase
			/**
			* Overridden by control developers (required). Destroys control to free up memory. Make sure to call Destroy() on PickerBase which can be done like so: this.Destroy = Fit.Core.CreateOverride(this.Destroy, function() { &#160;&#160;&#160;&#160; // Add control specific logic here &#160;&#160;&#160;&#160; base(); // Call Destroy on PickerBase });
			* @function Destroy
			*/
			public Destroy():void;
			/**
			* Overridden by control developers (required). Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Overridden by control developers (optional). Host control dispatches keyboard events to this function to allow picker control to handle keyboard navigation with keys such as arrow up/down/left/right, enter, space, etc. Picker may return False to prevent host control from reacting to given event.
			* @function HandleEvent
			* @param {Event} [e=undefined] Keyboard event to process
			*/
			public HandleEvent(e?:Event):void;
			/**
			* Get/set max height of control - returns object with Value (number) and Unit (string) properties
			* @function MaxHeight
			* @param {number} [value=undefined] If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {string} [unit=undefined] If defined, max height is updated to specified CSS unit, otherwise px is assumed
			* @returns any
			*/
			public MaxHeight(value?:number, unit?:string):any;
			/**
			* Register event handler fired when picker control is hidden in host control. The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnHide
			* @param {function} cb Event handler function
			*/
			public OnHide(cb:Function):void;
			/**
			* Register event handler fired when item selection is changed. This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode, where an existing selected item is deselected, followed by selection of new item. The following arguments are passed to event handler function: Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanged
			* @param {function} cb Event handler function
			*/
			public OnItemSelectionChanged(cb:Function):void;
			/**
			* Register event handler fired when item selection is changing. Selection can be canceled by returning False. The following arguments are passed to event handler function: Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanging
			* @param {function} cb Event handler function
			*/
			public OnItemSelectionChanging(cb:Function):void;
			/**
			* Register event handler invoked when a series of related item changes are completed
			* @function OnItemSelectionComplete
			* @param {function} cb Event handler function which accepts Sender (PickerBase)
			*/
			public OnItemSelectionComplete(cb:Function):void;
			/**
			* Register event handler fired when picker control is shown in host control. The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnShow
			* @param {function} cb Event handler function
			*/
			public OnShow(cb:Function):void;
			/**
			* Overriden by control developers (optional). Host control invokes this function, passing a reference to the input control dispatching keyboard events using the HandleEvent function. This function may be called multiple times with identical or different controls.
			* @function SetEventDispatcher
			* @param {DOMElement} control Event dispatcher control
			* @returns HTMLElement
			*/
			public SetEventDispatcher(control:HTMLElement):HTMLElement;
			/**
			* Overridden by control developers (optional). Host control invokes this function when picker is assigned to host control, providing an array of items already selected. An item is an object with a Title (string) and Value (string) property set. If picker defines preselected items, firing OnItemSelectionChanged for these items, will update the host control appropriately.
			* @function SetSelections
			* @param {array} items Array containing selected items: {Title:string, Value:string}
			*/
			public SetSelections(items:any[]):void;
			/**
			* Overridden by control developers (optional). Host control invokes this function when an item&#39;s selection state is changed from host control. Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged, as demonstrated below, if the picker control contains the given item.  var item = getItem(value); if (item !== null) { &#160;&#160;&#160;&#160; if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected) === false) &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; return false;  &#160;&#160;&#160;&#160; item.SetSelected(selected); &#160;&#160;&#160;&#160; this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected); }  Both events are fired by passing the given item&#39;s title, value, and current selection state. Be aware that host control may pass information about items not found in picker, e.g. when pasting items which may turn out not to be valid selections. Returning False from UpdateItemSelection will cancel the change.
			* @function UpdateItemSelection
			* @param {string} value Item value
			* @param {boolean} selected True if item was selected, False if item was deselected
			*/
			public UpdateItemSelection(value:string, selected:boolean):void;
		}
		/**
		* Class from which all Picker Controls extend. Control developers must override: GetDomElement, Destroy. Overriding the following functions is optional: UpdateItemSelectionState, SetEventDispatcher, HandleEvent. Picker Control must fire OnItemSelectionChanging and OnItemSelectionChanged when an item&#39;s selection state is being changed, which is done by invoking this._internal.FireOnItemSelectionChanging(title:string, value:string, currentSelectionState:boolean) and this._internal.FireOnItemSelectionChanged(title:string, value:string, newSelectionState:boolean). Notice that FireOnItemSelectionChanging may return False, which must prevent item from being selected, and at the same time prevent FireOnItemSelectionChanged from being called. Changing an item selection may cause OnItemSelectionChanging and OnItemSelectionChanged to be fired multiple times (e.g. if picker needs to first deselect one item before selecting another one). Therefore PickerBase also features the OnItemSelectionComplete event which must be fired when related changes complete, which is done by invoking this._internal.FireOnItemSelectionComplete(). OnItemSelectionComplete should only fire if a change was made (changes can be canceled using OnItemSelectionChanging).
		* @class [Fit.Controls.PickerBase PickerBase]
		*/
		class PickerBase
		{
			// Properties defined by Fit.Controls.PickerBase
			/**
			* Overridden by control developers (required). Destroys control to free up memory. Make sure to call Destroy() on PickerBase which can be done like so: this.Destroy = Fit.Core.CreateOverride(this.Destroy, function() { &#160;&#160;&#160;&#160; // Add control specific logic here &#160;&#160;&#160;&#160; base(); // Call Destroy on PickerBase });
			* @function Destroy
			*/
			public Destroy():void;
			/**
			* Overridden by control developers (required). Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Overridden by control developers (optional). Host control dispatches keyboard events to this function to allow picker control to handle keyboard navigation with keys such as arrow up/down/left/right, enter, space, etc. Picker may return False to prevent host control from reacting to given event.
			* @function HandleEvent
			* @param {Event} [e=undefined] Keyboard event to process
			*/
			public HandleEvent(e?:Event):void;
			/**
			* Get/set max height of control - returns object with Value (number) and Unit (string) properties
			* @function MaxHeight
			* @param {number} [value=undefined] If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {string} [unit=undefined] If defined, max height is updated to specified CSS unit, otherwise px is assumed
			* @returns any
			*/
			public MaxHeight(value?:number, unit?:string):any;
			/**
			* Register event handler fired when picker control is hidden in host control. The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnHide
			* @param {function} cb Event handler function
			*/
			public OnHide(cb:Function):void;
			/**
			* Register event handler fired when item selection is changed. This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode, where an existing selected item is deselected, followed by selection of new item. The following arguments are passed to event handler function: Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanged
			* @param {function} cb Event handler function
			*/
			public OnItemSelectionChanged(cb:Function):void;
			/**
			* Register event handler fired when item selection is changing. Selection can be canceled by returning False. The following arguments are passed to event handler function: Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanging
			* @param {function} cb Event handler function
			*/
			public OnItemSelectionChanging(cb:Function):void;
			/**
			* Register event handler invoked when a series of related item changes are completed
			* @function OnItemSelectionComplete
			* @param {function} cb Event handler function which accepts Sender (PickerBase)
			*/
			public OnItemSelectionComplete(cb:Function):void;
			/**
			* Register event handler fired when picker control is shown in host control. The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnShow
			* @param {function} cb Event handler function
			*/
			public OnShow(cb:Function):void;
			/**
			* Overriden by control developers (optional). Host control invokes this function, passing a reference to the input control dispatching keyboard events using the HandleEvent function. This function may be called multiple times with identical or different controls.
			* @function SetEventDispatcher
			* @param {DOMElement} control Event dispatcher control
			* @returns HTMLElement
			*/
			public SetEventDispatcher(control:HTMLElement):HTMLElement;
			/**
			* Overridden by control developers (optional). Host control invokes this function when picker is assigned to host control, providing an array of items already selected. An item is an object with a Title (string) and Value (string) property set. If picker defines preselected items, firing OnItemSelectionChanged for these items, will update the host control appropriately.
			* @function SetSelections
			* @param {array} items Array containing selected items: {Title:string, Value:string}
			*/
			public SetSelections(items:any[]):void;
			/**
			* Overridden by control developers (optional). Host control invokes this function when an item&#39;s selection state is changed from host control. Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged, as demonstrated below, if the picker control contains the given item.  var item = getItem(value); if (item !== null) { &#160;&#160;&#160;&#160; if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected) === false) &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; return false;  &#160;&#160;&#160;&#160; item.SetSelected(selected); &#160;&#160;&#160;&#160; this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected); }  Both events are fired by passing the given item&#39;s title, value, and current selection state. Be aware that host control may pass information about items not found in picker, e.g. when pasting items which may turn out not to be valid selections. Returning False from UpdateItemSelection will cancel the change.
			* @function UpdateItemSelection
			* @param {string} value Item value
			* @param {boolean} selected True if item was selected, False if item was deselected
			*/
			public UpdateItemSelection(value:string, selected:boolean):void;
		}
		/**
		* ProgressBar control useful for indicating progress.
		* @class [Fit.Controls.ProgressBar ProgressBar]
		*/
		class ProgressBar
		{
			// Properties defined by Fit.Controls.ProgressBar
			/**
			* Destroys control to free up memory
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID - returns Null if not set
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Set callback function invoked when progress is changed
			* @function OnProgress
			* @param {function} cb Callback function invoked when progress is changed - takes progress bar instance as argument
			*/
			public OnProgress(cb:Function):void;
			/**
			* Get/set progress - a value between 0 and 100
			* @function Progress
			* @param {integer} [val=undefined] If defined, progress is set to specified value (0-100)
			* @returns number
			*/
			public Progress(val?:number):number;
			/**
			* Create instance of ProgressBar control
			* @function ProgressBar
			* @param {string} [controlId=undefined] Unique control ID. if specified, control will be accessible using the Fit.Controls.Find(..) function.
			*/
			constructor(controlId?:string);
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set title in progress bar
			* @function Title
			* @param {string} [val=undefined] If specified, title will be set to specified value
			* @returns string
			*/
			public Title(val?:string):string;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
		}
		/**
		* TreeView control allowing data to be listed in a structured manner. Extending from Fit.Controls.PickerBase. Extending from Fit.Controls.ControlBase.  Performance considerations (for huge amounts of data):  1) Selectable(..) is used to transform how nodes allow selections (disabled/single select/multi select/select all). This requires the function to recursively modify all nodes contained to make sure they are configured identically. However, this also happens when AddChild(node) is called, to make sure nodes added at any time is configured in accordance with TreeView configuration. Selectable(..) should therefore be called before adding nodes to prevent an extra recursive operation on all nodes contained.  2) Selected(nodes) performs better than Value(&quot;val1;val2;val3&quot;)  3) RemoveChild(node) performance is non-linear, relative to the amount of children contained. The function recursively iterates children to find selected nodes to deselect them, to make sure TreeView is updated accordingly.  4) GetChild(&quot;val1&quot;, true) is faster at finding one specific node, compared to recursively iterating the result from GetChildren(), since internal children collections are indexed.  5) Be aware that some operations (e.g. AddChild, Expand/Collapse, Select/Deselect) forces Internet Explorer 8 to repaint tree to work around render bugs. Repainting can be minimized greately by populating root nodes before adding them to the TreeView instance. However, be aware that this comes with the performance penalty mentioned in article 1 (AddChild). It is likely that repainting does not pose a major performance problem, though.
		* @class [Fit.Controls.TreeView TreeView]
		*/
		class TreeView
		{
			// Properties defined by Fit.Controls.TreeView
			/**
			* Add node to TreeView
			* @function AddChild
			* @param {Fit.Controls.TreeView.Node} node Node to add
			*/
			public AddChild(node:__FitInternals.FitControlsTreeViewNode):void;
			/**
			* Get/set value indicating whether user is allowed to deselect nodes. By default the user is allowed to deselect nodes.
			* @function AllowDeselect
			* @param {boolean} [val=undefined] If defined, changes behaviour to specified value
			* @returns boolean
			*/
			public AllowDeselect(val?:boolean):boolean;
			/**
			* Fit.Controls.ControlBase.Clear override: Clear control value. Override allows for non-selectable nodes to keep their selection state. This is useful if TreeView has been configured to preselect some non-selectable nodes, hence preventing the user from removing these selections. In that case the desired functionality of the Clear function could be to preserve these preselections. If called with no arguments, all selections are cleared.
			* @function Clear
			* @param {boolean} [preserveNonSelectable=false] True causes selection state of non-selectable nodes to be preserved, False do not
			*/
			public Clear(preserveNonSelectable?:boolean):void;
			/**
			* Get/set instance of ContextMenu control triggered when right clicking nodes in TreeView
			* @function ContextMenu
			* @param {Fit.Controls.ContextMenu} [contextMenu=undefined] If defined, assignes ContextMenu control to TreeView
			* @returns Fit.Controls.ContextMenu
			*/
			public ContextMenu(contextMenu?:Fit.Controls.ContextMenu):Fit.Controls.ContextMenu;
			/**
			* Get all nodes across all children and their children, in a flat structure
			* @function GetAllNodes
			* @returns __FitInternals.FitControlsTreeViewNode[]
			*/
			public GetAllNodes():__FitInternals.FitControlsTreeViewNode[];
			/**
			* Get node by value - returns Null if not found
			* @function GetChild
			* @param {string} val Node value
			* @param {boolean} [recursive=false] If defined, True enables recursive search
			* @returns __FitInternals.FitControlsTreeViewNode
			*/
			public GetChild(val:string, recursive?:boolean):__FitInternals.FitControlsTreeViewNode;
			/**
			* Get all children
			* @function GetChildren
			* @returns __FitInternals.FitControlsTreeViewNode[]
			*/
			public GetChildren():__FitInternals.FitControlsTreeViewNode[];
			/**
			* Get node above specified node - returns Null if no node is above the specified one
			* @function GetNodeAbove
			* @param {Fit.Controls.TreeView.Node} node Node to get node above
			* @returns __FitInternals.FitControlsTreeViewNode
			*/
			public GetNodeAbove(node:__FitInternals.FitControlsTreeViewNode):__FitInternals.FitControlsTreeViewNode;
			/**
			* Get node below specified node - returns Null if no node is below the specified one
			* @function GetNodeBelow
			* @param {Fit.Controls.TreeView.Node} node Node to get node below
			* @returns __FitInternals.FitControlsTreeViewNode
			*/
			public GetNodeBelow(node:__FitInternals.FitControlsTreeViewNode):__FitInternals.FitControlsTreeViewNode;
			/**
			* Get node currently having focus - returns Null if no node has focus
			* @function GetNodeFocused
			* @returns __FitInternals.FitControlsTreeViewNode
			*/
			public GetNodeFocused():__FitInternals.FitControlsTreeViewNode;
			/**
			* Get/set value indicating whether keyboard navigation is enabled
			* @function KeyboardNavigation
			* @param {boolean} [val=undefined] If defined, True enables keyboard navigation, False disables it
			* @returns boolean
			*/
			public KeyboardNavigation(val?:boolean):boolean;
			/**
			* Get/set value indicating whether helper lines are shown. Notice that helper lines cause node items to obtain a fixed line height of 20px, making it unsuitable for large fonts.
			* @function Lines
			* @param {boolean} [val=undefined] If defined, True enables helper lines, False disables them
			* @returns boolean
			*/
			public Lines(val?:boolean):boolean;
			/**
			* Add event handler fired before context menu is shown. This event can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node). Use Sender.ContextMenu() to obtain a reference to the context menu.
			* @function OnContextMenu
			* @param {function} cb Event handler function
			*/
			public OnContextMenu(cb:Function):void;
			/**
			* Add event handler fired when node is being selected or deselected. Selection can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
			* @function OnSelect
			* @param {function} cb Event handler function
			*/
			public OnSelect(cb:Function):void;
			/**
			* Add event handler fired when Select All is used for a given node. This event can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.TreeView) and EventArgs object. EventArgs object contains the following properties: - Node: Fit.Controls.TreeView.Node instance - Selected: Boolean value indicating new selection state
			* @function OnSelectAll
			* @param {function} cb Event handler function
			*/
			public OnSelectAll(cb:Function):void;
			/**
			* Add event handler fired when node is selected or deselected. Selection can not be canceled. Function receives two arguments: Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
			* @function OnSelected
			* @param {function} cb Event handler function
			*/
			public OnSelected(cb:Function):void;
			/**
			* Add event handler fired when node is being expanded or collapsed. Toggle can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
			* @function OnToggle
			* @param {function} cb Event handler function
			*/
			public OnToggle(cb:Function):void;
			/**
			* Add event handler fired when node is expanded or collapsed. Toggle can not be canceled. Function receives two arguments: Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
			* @function OnToggled
			* @param {function} cb Event handler function
			*/
			public OnToggled(cb:Function):void;
			/**
			* Remove all nodes contained in TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes
			* @function RemoveAllChildren
			* @param {boolean} [dispose=false] Set True to dispose nodes
			*/
			public RemoveAllChildren(dispose?:boolean):void;
			/**
			* Remove node from TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes
			* @function RemoveChild
			* @param {Fit.Controls.TreeView.Node} node Node to remove
			*/
			public RemoveChild(node:__FitInternals.FitControlsTreeViewNode):void;
			/**
			* Get/set value indicating whether user can change selection state of nodes. This affects all contained nodes. To configure nodes individually, use Selectable(..) function on node instances.
			* @function Selectable
			* @param {boolean} [val=undefined] If defined, True enables node selection, False disables it
			* @param {boolean} [multi=false] If defined, True enables node multi selection, False disables it
			* @returns boolean
			*/
			public Selectable(val?:boolean, multi?:boolean):boolean;
			/**
			* Select all nodes
			* @function SelectAll
			* @param {boolean} selected Value indicating whether to select or deselect nodes
			* @param {Fit.Controls.TreeView.Node} [selectAllNode=undefined] If specified, given node is selected/deselected along with all its children. If not specified, all nodes contained in TreeView will be selected/deselected.
			*/
			public SelectAll(selected:boolean, selectAllNode?:__FitInternals.FitControlsTreeViewNode):void;
			/**
			* Get/set selected nodes
			* @function Selected
			* @param {Fit.Controls.TreeView.Node[]} [val=undefined] If defined, provided nodes are selected
			* @returns __FitInternals.FitControlsTreeViewNode[]
			*/
			public Selected(val?:__FitInternals.FitControlsTreeViewNode[]):__FitInternals.FitControlsTreeViewNode[];
			/**
			* Create instance of TreeView control
			* @function TreeView
			* @param {string} ctlId Unique control ID
			*/
			constructor(ctlId:string);
			/**
			* Get/set value indicating whether Word Wrapping is enabled
			* @function WordWrap
			* @param {boolean} [val=undefined] If defined, True enables Word Wrapping, False disables it
			* @returns boolean
			*/
			public WordWrap(val?:boolean):boolean;
			// Properties defined by Fit.Controls.PickerBase
			/**
			* Overridden by control developers (required). Destroys control to free up memory. Make sure to call Destroy() on PickerBase which can be done like so: this.Destroy = Fit.Core.CreateOverride(this.Destroy, function() { &#160;&#160;&#160;&#160; // Add control specific logic here &#160;&#160;&#160;&#160; base(); // Call Destroy on PickerBase });
			* @function Destroy
			*/
			public Destroy():void;
			/**
			* Overridden by control developers (required). Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Overridden by control developers (optional). Host control dispatches keyboard events to this function to allow picker control to handle keyboard navigation with keys such as arrow up/down/left/right, enter, space, etc. Picker may return False to prevent host control from reacting to given event.
			* @function HandleEvent
			* @param {Event} [e=undefined] Keyboard event to process
			*/
			public HandleEvent(e?:Event):void;
			/**
			* Get/set max height of control - returns object with Value (number) and Unit (string) properties
			* @function MaxHeight
			* @param {number} [value=undefined] If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {string} [unit=undefined] If defined, max height is updated to specified CSS unit, otherwise px is assumed
			* @returns any
			*/
			public MaxHeight(value?:number, unit?:string):any;
			/**
			* Register event handler fired when picker control is hidden in host control. The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnHide
			* @param {function} cb Event handler function
			*/
			public OnHide(cb:Function):void;
			/**
			* Register event handler fired when item selection is changed. This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode, where an existing selected item is deselected, followed by selection of new item. The following arguments are passed to event handler function: Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanged
			* @param {function} cb Event handler function
			*/
			public OnItemSelectionChanged(cb:Function):void;
			/**
			* Register event handler fired when item selection is changing. Selection can be canceled by returning False. The following arguments are passed to event handler function: Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanging
			* @param {function} cb Event handler function
			*/
			public OnItemSelectionChanging(cb:Function):void;
			/**
			* Register event handler invoked when a series of related item changes are completed
			* @function OnItemSelectionComplete
			* @param {function} cb Event handler function which accepts Sender (PickerBase)
			*/
			public OnItemSelectionComplete(cb:Function):void;
			/**
			* Register event handler fired when picker control is shown in host control. The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnShow
			* @param {function} cb Event handler function
			*/
			public OnShow(cb:Function):void;
			/**
			* Overriden by control developers (optional). Host control invokes this function, passing a reference to the input control dispatching keyboard events using the HandleEvent function. This function may be called multiple times with identical or different controls.
			* @function SetEventDispatcher
			* @param {DOMElement} control Event dispatcher control
			* @returns HTMLElement
			*/
			public SetEventDispatcher(control:HTMLElement):HTMLElement;
			/**
			* Overridden by control developers (optional). Host control invokes this function when picker is assigned to host control, providing an array of items already selected. An item is an object with a Title (string) and Value (string) property set. If picker defines preselected items, firing OnItemSelectionChanged for these items, will update the host control appropriately.
			* @function SetSelections
			* @param {array} items Array containing selected items: {Title:string, Value:string}
			*/
			public SetSelections(items:any[]):void;
			/**
			* Overridden by control developers (optional). Host control invokes this function when an item&#39;s selection state is changed from host control. Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged, as demonstrated below, if the picker control contains the given item.  var item = getItem(value); if (item !== null) { &#160;&#160;&#160;&#160; if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected) === false) &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; return false;  &#160;&#160;&#160;&#160; item.SetSelected(selected); &#160;&#160;&#160;&#160; this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected); }  Both events are fired by passing the given item&#39;s title, value, and current selection state. Be aware that host control may pass information about items not found in picker, e.g. when pasting items which may turn out not to be valid selections. Returning False from UpdateItemSelection will cancel the change.
			* @function UpdateItemSelection
			* @param {string} value Item value
			* @param {boolean} selected True if item was selected, False if item was deselected
			*/
			public UpdateItemSelection(value:string, selected:boolean):void;
			// Properties defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control
			* @function AddCssClass
			* @param {string} val CSS class to add
			*/
			public AddCssClass(val:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This comes in handy when programmatically changing a value of a control on behalf of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] If defined, Always Dirty is enabled/disabled
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed
			* @function AutoPostBack
			* @param {boolean} [val=undefined] If defined, True enables auto post back, False disables it
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value
			* @function Clear
			*/
			public Clear():void;
			/**
			* Destroys control to free up memory. Make sure to call Dispose() on ControlBase which can be done like so: this.Dispose = Fit.Core.CreateOverride(this.Dispose, function() { &#160;&#160;&#160;&#160; // Add control specific dispose logic here &#160;&#160;&#160;&#160; base(); // Call Dispose on ControlBase });
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Check whether CSS class is found on DOMElement representing control
			* @function HasCssClass
			* @param {string} val CSS class to check for
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties
			* @function Height
			* @param {number} [val=undefined] If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {string} [unit=px] If defined, control height is updated to specified CSS unit
			* @returns any
			*/
			public Height(val?:number, unit?:string):any;
			/**
			* Get value indicating whether user has changed control value
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid. Control value is considered invalid if control is required, but no value is set, or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus
			* @function OnBlur
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnBlur(cb:Function):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user
			* @function OnChange
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnChange(cb:Function):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus
			* @function OnFocus
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnFocus(cb:Function):void;
			/**
			* Remove CSS class from DOMElement representing control
			* @function RemoveCssClass
			* @param {string} val CSS class to remove
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set value indicating whether control is required to be set
			* @function Required
			* @param {boolean} [val=undefined] If defined, control required feature is enabled/disabled
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] If defined, control scope is updated
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* Set callback function used to perform on-the-fly validation against control value
			* @function SetValidationCallback
			* @param {function} cb Function receiving control value - must return True if value is valid, otherwise False
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationCallback(cb:Function, errorMsg?:string):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value
			* @function SetValidationExpression
			* @param {RegExp} regEx Regular expression to validate against
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationExpression(regEx:RegExp, errorMsg?:string):void;
			/**
			* Get/set control value. For controls supporting multiple selections: Set value by providing a string in one the following formats: title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]]. If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded. Selected items are returned in the first format described, also with reserved characters URIEncoded. Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] If defined, items are selected
			* @returns string
			*/
			public Value(val?:string):string;
			/**
			* Get/set value indicating whether control is visible
			* @function Visible
			* @param {boolean} [val=undefined] If defined, control visibility is updated
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
			public static Node : typeof __FitInternals.FitControlsTreeViewNode;
		}
		/**
		* ContextMenu control allowing for quick access to select features provided by a WebService. Extending from Fit.Controls.ContextMenu.
		* @class [Fit.Controls.WSContextMenu WSContextMenu]
		*/
		class WSContextMenu
		{
			// Properties defined by Fit.Controls.WSContextMenu
			/**
			* Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication. Often this argument is simply &quot;callback&quot;. Passing Null disables JSONP communication again.
			* @function JsonpCallback
			* @param {string} [val=undefined] If defined, enables JSONP and updates JSONP callback argument
			* @returns string
			*/
			public JsonpCallback(val?:string):string;
			/**
			* Add event handler fired when ContextMenu has been populated with items. Function receives two arguments: Sender (Fit.Controls.WSContextMenu) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSContextMenu instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance - Children: JSON items received from WebService
			* @function OnPopulated
			* @param {function} cb Event handler function
			*/
			public OnPopulated(cb:Function):void;
			/**
			* Add event handler fired when data is being requested. Request can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.WSContextMenu) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSContextMenu instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			* @function OnRequest
			* @param {function} cb Event handler function
			*/
			public OnRequest(cb:Function):void;
			/**
			* Add event handler fired when data is received, allowing for data transformation to occure before ContextMenu is populated. Function receives two arguments: Sender (Fit.Controls.WSContextMenu) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSContextMenu instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance - Children: JSON items received from WebService
			* @function OnResponse
			* @param {function} cb Event handler function
			*/
			public OnResponse(cb:Function):void;
			/**
			* Get/set URL to WebService responsible for providing data to ContextMenu. WebService must deliver all data at once in the following JSON format: [ &#160;&#160;&#160;&#160; { Title: &quot;Test 1&quot;, Value: &quot;1001&quot;, Selectable: true, Selected: true, Children: [] }, &#160;&#160;&#160;&#160; { Title: &quot;Test 2&quot;, Value: &quot;1002&quot;, Selectable: false, Selected: false, Children: [] } ] Only Value is required. Children is a collection of items with the same format as described above.
			* @function Url
			* @param {string} [wsUrl=undefined] If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetItems)
			* @returns string
			*/
			public Url(wsUrl?:string):string;
			/**
			* Create instance of WSContextMenu control
			* @function WSContextMenu
			*/
			constructor();
			// Properties defined by Fit.Controls.ContextMenu
			/**
			* Add item to ContextMenu
			* @function AddChild
			* @param {Fit.Controls.ContextMenu.Item} item Item to add
			*/
			public AddChild(item:__FitInternals.FitControlsContextMenuItem):void;
			/**
			* Create instance of ContextMenu control
			* @function ContextMenu
			*/
			constructor();
			/**
			* Get/set value indicating whether boundary/collision detection is enabled or not
			* @function DetectBoundaries
			* @param {boolean} [val=undefined] If defined, True enables collision detection (default), False disables it
			* @returns boolean
			*/
			public DetectBoundaries(val?:boolean):boolean;
			/**
			* Destroys component to free up memory
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get all children across entire hierarchy in a flat collection
			* @function GetAllChildren
			* @returns __FitInternals.FitControlsContextMenuItem[]
			*/
			public GetAllChildren():__FitInternals.FitControlsContextMenuItem[];
			/**
			* Get item by value - returns Null if not found
			* @function GetChild
			* @param {string} val Item value
			* @param {boolean} [recursive=false] If defined, True enables recursive search
			* @returns __FitInternals.FitControlsContextMenuItem
			*/
			public GetChild(val:string, recursive?:boolean):__FitInternals.FitControlsContextMenuItem;
			/**
			* Get all children
			* @function GetChildren
			* @returns __FitInternals.FitControlsContextMenuItem[]
			*/
			public GetChildren():__FitInternals.FitControlsContextMenuItem[];
			/**
			* Get DOMElement representing context menu
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Hide context menu
			* @function Hide
			*/
			public Hide():void;
			/**
			* Get value indicating whether context menu is visible or not
			* @function IsVisible
			* @returns boolean
			*/
			public IsVisible():boolean;
			/**
			* Add event handler fired when context menu is hidden. Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnHide
			* @param {function} cb Event handler function
			*/
			public OnHide(cb:Function):void;
			/**
			* Add event handler fired when an item is selected in context menu. Function receives two arguments: Sender (Fit.Controls.ContextMenu) and Item (Fit.Controls.ContextMenu.Item).
			* @function OnSelect
			* @param {function} cb Event handler function
			*/
			public OnSelect(cb:Function):void;
			/**
			* Add event handler fired before context menu is shown. This event can be canceled by returning False. Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnShowing
			* @param {function} cb Event handler function
			*/
			public OnShowing(cb:Function):void;
			/**
			* Add event handler fired when context menu is shown. Function receives one argument: Sender (Fit.Controls.ContextMenu).
			* @function OnShown
			* @param {function} cb Event handler function
			*/
			public OnShown(cb:Function):void;
			/**
			* Remove all items contained in ContextMenu
			* @function RemoveAllChildren
			* @param {boolean} [dispose=false] Set True to dispose items
			*/
			public RemoveAllChildren(dispose?:boolean):void;
			/**
			* Remove item from ContextMenu
			* @function RemoveChild
			* @param {Fit.Controls.ContextMenu.Item} item Item to remove
			*/
			public RemoveChild(item:__FitInternals.FitControlsContextMenuItem):void;
			/**
			* Make context menu show up. If X,Y coordinates are not specified, the position of the mouse pointer will be used.
			* @function Show
			* @param {integer} [x=undefined] If defined, context menu will open at specified horizontal position
			* @param {integer} [y=undefined] If defined, context menu will open at specified vertical position
			*/
			public Show(x?:number, y?:number):void;
		}
		/**
		* WebService enabled Drop Down Menu control allowing for single and multi selection. Supports data selection using any control extending from Fit.Controls.PickerBase. This control is extending from Fit.Controls.DropDown.
		* @class [Fit.Controls.WSDropDown WSDropDown]
		*/
		class WSDropDown
		{
			// Properties defined by Fit.Controls.WSDropDown
			/**
			* Get WSListView control used to display data in a flat list view
			* @function GetListView
			* @returns Fit.Controls.WSListView
			*/
			public GetListView():Fit.Controls.WSListView;
			/**
			* Get WSTreeView control used to display data in a hierarchical tree view
			* @function GetTreeView
			* @returns Fit.Controls.WSTreeView
			*/
			public GetTreeView():Fit.Controls.WSTreeView;
			/**
			* Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication. Often this argument is simply &quot;callback&quot;. Passing Null disables JSONP communication again.
			* @function JsonpCallback
			* @param {string} [val=undefined] If defined, enables JSONP and updates JSONP callback argument
			* @returns string
			*/
			public JsonpCallback(val?:string):string;
			/**
			* Get/set value indicating whether control allows for multiple selections simultaneously
			* @function MultiSelectionMode
			* @param {boolean} [val=undefined] If defined, True enables support for multiple selections, False disables it
			* @returns boolean
			*/
			public MultiSelectionMode(val?:boolean):boolean;
			/**
			* Add event handler fired if data request is canceled. Function receives two arguments: Sender (Fit.Controls.WSDropDown) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSDropDown instance - Picker: Picker causing WebService data request (WSTreeView or WSListView instance) - Node: Fit.Controls.TreeView.Node instance if requesting TreeView children, Null if requesting root nodes - Search: Search value if entered - Data: JSON data received from WebService (Null in this particular case) - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
			* @function OnAbort
			* @param {function} cb Event handler function
			*/
			public OnAbort(cb:Function):void;
			/**
			* Add event handler fired when data is being requested. Request can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.WSDropDown) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSDropDown instance - Picker: Picker causing WebService data request (WSTreeView or WSListView instance) - Node: Fit.Controls.TreeView.Node instance if requesting TreeView children, Null if requesting root nodes - Search: Search value if entered - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
			* @function OnRequest
			* @param {function} cb Event handler function
			*/
			public OnRequest(cb:Function):void;
			/**
			* Add event handler fired when data is received, allowing for data transformation to occure before picker control is populated. Function receives two arguments: Sender (Fit.Controls.WSDropDown) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSDropDown instance - Picker: Picker causing WebService data request (WSTreeView or WSListView instance) - Node: Fit.Controls.TreeView.Node instance if requesting TreeView children, Null if requesting root nodes - Search: Search value if entered - Data: JSON data received from WebService - Request: Fit.Http.Request or Fit.Http.JsonRequest instance
			* @function OnResponse
			* @param {function} cb Event handler function
			*/
			public OnResponse(cb:Function):void;
			/**
			* Get/set URL to WebService responsible for providing data to drop down. WebService must deliver data in the following JSON format: [ &#160;&#160;&#160;&#160; { Title: &quot;Test 1&quot;, Value: &quot;1001&quot;, Selectable: true, Selected: true, Children: [] }, &#160;&#160;&#160;&#160; { Title: &quot;Test 2&quot;, Value: &quot;1002&quot;, Selectable: false, Selected: false, Children: [] } ] Only Value is required. Children is a collection of nodes with the same format as described above. HasChildren:boolean may be set to indicate that children are available server side and that WebService should be called to load these children when the given node is expanded.
			* @function Url
			* @param {string} [wsUrl=undefined] If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetData)
			* @returns string
			*/
			public Url(wsUrl?:string):string;
			/**
			* Create instance of WSDropDown control
			* @function WSDropDown
			* @param {string} ctlId Unique control ID
			*/
			constructor(ctlId:string);
			// Properties defined by Fit.Controls.DropDown
			/**
			* Add selection to control
			* @function AddSelection
			* @param {string} title Item title
			* @param {string} value Item value
			* @param {boolean} [valid=true] Flag indicating whether selection is valid or not. Invalid selections are highlighted and not included when selections are retrived using Value() function, and not considered when IsDirty() is called to determine whether control value has been changed by user. GetSelections(true) can be used to retrive all items, including invalid selections.
			*/
			public AddSelection(title:string, value:string, valid?:boolean):void;
			/**
			* Clear text field
			* @function ClearInput
			*/
			public ClearInput():void;
			/**
			* Clear selections
			* @function ClearSelections
			*/
			public ClearSelections():void;
			/**
			* Close drop down menu
			* @function CloseDropDown
			*/
			public CloseDropDown():void;
			/**
			* Create instance of DropDown control
			* @function DropDown
			* @param {string} ctlId Unique control ID
			*/
			constructor(ctlId:string);
			/**
			* Get/set max height of drop down - returns object with Value (number) and Unit (string) properties
			* @function DropDownMaxHeight
			* @param {number} [value=undefined] If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {string} [unit=undefined] If defined, max height is updated to specified CSS unit, otherwise px is assumed
			* @returns any
			*/
			public DropDownMaxHeight(value?:number, unit?:string):any;
			/**
			* Get/set max width of drop down - returns object with Value (number) and Unit (string) properties
			* @function DropDownMaxWidth
			* @param {number} [value=undefined] If defined, max width is updated to specified value. A value of -1 forces drop down to use control width.
			* @param {string} [unit=undefined] If defined, max width is updated to specified CSS unit, otherwise px is assumed
			* @returns any
			*/
			public DropDownMaxWidth(value?:number, unit?:string):any;
			/**
			* Get input value
			* @function GetInputValue
			* @returns string
			*/
			public GetInputValue():string;
			/**
			* Get picker control used to add items to drop down control
			* @function GetPicker
			* @returns Fit.Controls.PickerBase
			*/
			public GetPicker():Fit.Controls.PickerBase;
			/**
			* Get selected item by value - returns object with Title (string), Value (string), and Valid (boolean) properties if found, otherwise Null is returned
			* @function GetSelectionByValue
			* @param {string} val Value of selected item to retrive
			* @returns any
			*/
			public GetSelectionByValue(val:string):any;
			/**
			* Get selected items - returned array contain objects with Title (string), Value (string), and Valid (boolean) properties
			* @function GetSelections
			* @param {boolean} [includeInvalid=false] Flag indicating whether invalid selection should be included or not
			* @returns any[]
			*/
			public GetSelections(includeInvalid?:boolean):any[];
			/**
			* Get/set value indicating whether input is enabled
			* @function InputEnabled
			* @param {boolean} [val=undefined] If defined, True enables input, False disables it
			* @returns boolean
			*/
			public InputEnabled(val?:boolean):boolean;
			/**
			* Get/set mouse over text shown for invalid selections
			* @function InvalidSelectionMessage
			* @param {string} [msg=undefined] If defined, error message for invalid selections are set
			* @returns string
			*/
			public InvalidSelectionMessage(msg?:string):string;
			/**
			* Get flag indicating whether drop down is open or not
			* @function IsDropDownOpen
			* @returns boolean
			*/
			public IsDropDownOpen():boolean;
			/**
			* Get/set flag indicating whether control allows for multiple selections
			* @function MultiSelectionMode
			* @param {boolean} [val=undefined] If defined, True enables multi selection mode, False disables it
			* @returns boolean
			*/
			public MultiSelectionMode(val?:boolean):boolean;
			/**
			* Add event handler fired when drop down menu is closed. Function receives one argument: Sender (Fit.Controls.DropDown)
			* @function OnClose
			* @param {function} cb Event handler function
			*/
			public OnClose(cb:Function):void;
			/**
			* Add event handler fired when input value is changed. Function receives two arguments: Sender (Fit.Controls.DropDown) and Value (string).
			* @function OnInputChanged
			* @param {function} cb Event handler function
			*/
			public OnInputChanged(cb:Function):void;
			/**
			* Add event handler fired when drop down menu is opened. Function receives one argument: Sender (Fit.Controls.DropDown)
			* @function OnOpen
			* @param {function} cb Event handler function
			*/
			public OnOpen(cb:Function):void;
			/**
			* Add event handler fired when text is pasted into input field. Function receives two arguments: Sender (Fit.Controls.DropDown) and Value (string). Return False to cancel event and change, and prevent OnInputChanged from firing.
			* @function OnPaste
			* @param {function} cb Event handler function
			*/
			public OnPaste(cb:Function):void;
			/**
			* Open drop down menu
			* @function OpenDropDown
			*/
			public OpenDropDown():void;
			/**
			* Remove selected item by value
			* @function RemoveSelection
			* @param {string} value Value of selected item to remove
			*/
			public RemoveSelection(value:string):void;
			/**
			* Set value of text field which is automatically cleared the first time control receives focus. Notice that this function should be called after AddSelection(..), since adding selections causes the value of the text field to be cleared.
			* @function SetInputValue
			* @param {string} val New value for text field
			*/
			public SetInputValue(val:string):void;
			/**
			* Set picker control used to add items to drop down control
			* @function SetPicker
			* @param {Fit.Controls.PickerBase} pickerControl Picker control extending from PickerBase
			*/
			public SetPicker(pickerControl:Fit.Controls.PickerBase):void;
			// Properties defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control
			* @function AddCssClass
			* @param {string} val CSS class to add
			*/
			public AddCssClass(val:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This comes in handy when programmatically changing a value of a control on behalf of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] If defined, Always Dirty is enabled/disabled
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed
			* @function AutoPostBack
			* @param {boolean} [val=undefined] If defined, True enables auto post back, False disables it
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value
			* @function Clear
			*/
			public Clear():void;
			/**
			* Destroys control to free up memory. Make sure to call Dispose() on ControlBase which can be done like so: this.Dispose = Fit.Core.CreateOverride(this.Dispose, function() { &#160;&#160;&#160;&#160; // Add control specific dispose logic here &#160;&#160;&#160;&#160; base(); // Call Dispose on ControlBase });
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Check whether CSS class is found on DOMElement representing control
			* @function HasCssClass
			* @param {string} val CSS class to check for
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties
			* @function Height
			* @param {number} [val=undefined] If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {string} [unit=px] If defined, control height is updated to specified CSS unit
			* @returns any
			*/
			public Height(val?:number, unit?:string):any;
			/**
			* Get value indicating whether user has changed control value
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid. Control value is considered invalid if control is required, but no value is set, or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus
			* @function OnBlur
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnBlur(cb:Function):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user
			* @function OnChange
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnChange(cb:Function):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus
			* @function OnFocus
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnFocus(cb:Function):void;
			/**
			* Remove CSS class from DOMElement representing control
			* @function RemoveCssClass
			* @param {string} val CSS class to remove
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set value indicating whether control is required to be set
			* @function Required
			* @param {boolean} [val=undefined] If defined, control required feature is enabled/disabled
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] If defined, control scope is updated
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* Set callback function used to perform on-the-fly validation against control value
			* @function SetValidationCallback
			* @param {function} cb Function receiving control value - must return True if value is valid, otherwise False
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationCallback(cb:Function, errorMsg?:string):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value
			* @function SetValidationExpression
			* @param {RegExp} regEx Regular expression to validate against
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationExpression(regEx:RegExp, errorMsg?:string):void;
			/**
			* Get/set control value. For controls supporting multiple selections: Set value by providing a string in one the following formats: title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]]. If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded. Selected items are returned in the first format described, also with reserved characters URIEncoded. Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] If defined, items are selected
			* @returns string
			*/
			public Value(val?:string):string;
			/**
			* Get/set value indicating whether control is visible
			* @function Visible
			* @param {boolean} [val=undefined] If defined, control visibility is updated
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
		}
		/**
		* 
		* @class [Fit.Controls.WSListView WSListView]
		*/
		class WSListView
		{
			// Properties defined by Fit.Controls.WSListView
			/**
			* Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication. Often this argument is simply &quot;callback&quot;. Passing Null disables JSONP communication again.
			* @function JsonpCallback
			* @param {string} [val=undefined] If defined, enables JSONP and updates JSONP callback argument
			* @returns string
			*/
			public JsonpCallback(val?:string):string;
			/**
			* Add event handler fired if data request is canceled. Function receives two arguments: Sender (Fit.Controls.WSListView) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSListView instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance - Items: JSON items received from WebService (Null in this particular case)
			* @function OnAbort
			* @param {function} cb Event handler function
			*/
			public OnAbort(cb:Function):void;
			/**
			* Add event handler fired when ListView has been populated with items. Function receives two arguments: Sender (Fit.Controls.WSListView) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSListView instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance - Items: JSON items received from WebService
			* @function OnPopulated
			* @param {function} cb Event handler function
			*/
			public OnPopulated(cb:Function):void;
			/**
			* Add event handler fired when data is being requested. Request can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.WSListView) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSListView instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance
			* @function OnRequest
			* @param {function} cb Event handler function
			*/
			public OnRequest(cb:Function):void;
			/**
			* Add event handler fired when data is received, allowing for data transformation to occure before ListView is populated. Function receives two arguments: Sender (Fit.Controls.WSListView) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSListView instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance - Items: JSON items received from WebService
			* @function OnResponse
			* @param {function} cb Event handler function
			*/
			public OnResponse(cb:Function):void;
			/**
			* Load/reload data from WebService
			* @function Reload
			*/
			public Reload():void;
			/**
			* Get/set URL to WebService responsible for providing data to control. WebService must deliver data in the following JSON format: [ &#160;&#160;&#160;&#160; { Title: &quot;Test 1&quot;, Value: &quot;1001&quot;, Selectable: true, Children: [] }, &#160;&#160;&#160;&#160; { Title: &quot;Test 2&quot;, Value: &quot;1002&quot;, Selectable: false, Children: [] } ] Only Value is required. Children is a collection of items with the same format as described above. Be aware that items are treated as a flat list, even when hierarchically structured using the Children property. Items with Selectable set to False will simply be ignored (not shown) while children will still be added.
			* @function Url
			* @param {string} [wsUrl=undefined] If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetItems)
			* @returns string
			*/
			public Url(wsUrl?:string):string;
		}
		/**
		* TreeView control allowing data from a WebService to be listed in a structured manner. Extending from Fit.Controls.TreeView.  Notice: WSTreeView works a bit differently from TreeView. Nodes are loaded on-demand, meaning when Selected(..) or Value(..) is called to set selections, nodes not loaded yet are stored internally as preselections. Nodes not loaded yet will not have OnSelect, OnSelected, and any associated events fired, until they are actually loaded. But they will be returned when Selected() or Value() is called (getters). OnChange, however, will always be fired when selections are changed, no matter if nodes are loaded or not.
		* @class [Fit.Controls.WSTreeView WSTreeView]
		*/
		class WSTreeView
		{
			// Properties defined by Fit.Controls.WSTreeView
			/**
			* Get/set name of JSONP callback argument. Assigning a value will enable JSONP communication. Often this argument is simply &quot;callback&quot;. Passing Null disables JSONP communication again.
			* @function JsonpCallback
			* @param {string} [val=undefined] If defined, enables JSONP and updates JSONP callback argument
			* @returns string
			*/
			public JsonpCallback(val?:string):string;
			/**
			* Add event handler fired if data request is canceled. Function receives two arguments: Sender (Fit.Controls.WSTreeView) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSTreeView instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance - Node: Fit.Controls.TreeView.Node instance to be populated - Children: JSON nodes received from WebService (Null in this particular case)
			* @function OnAbort
			* @param {function} cb Event handler function
			*/
			public OnAbort(cb:Function):void;
			/**
			* Add event handler fired when TreeView has been populated with nodes. Function receives two arguments: Sender (Fit.Controls.WSTreeView) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSTreeView instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance - Node: Fit.Controls.TreeView.Node instance now populated with children - Children: JSON nodes received from WebService
			* @function OnPopulated
			* @param {function} cb Event handler function
			*/
			public OnPopulated(cb:Function):void;
			/**
			* Add event handler fired when data is being requested. Request can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.WSTreeView) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSTreeView instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance - Node: Fit.Controls.TreeView.Node instance
			* @function OnRequest
			* @param {function} cb Event handler function
			*/
			public OnRequest(cb:Function):void;
			/**
			* Add event handler fired when data is received, allowing for data transformation to occure before TreeView is populated. Function receives two arguments: Sender (Fit.Controls.WSTreeView) and EventArgs object. EventArgs object contains the following properties: - Sender: Fit.Controls.WSTreeView instance - Request: Fit.Http.JsonpRequest or Fit.Http.JsonRequest instance - Node: Fit.Controls.TreeView.Node instance to be populated - Children: JSON nodes received from WebService
			* @function OnResponse
			* @param {function} cb Event handler function
			*/
			public OnResponse(cb:Function):void;
			/**
			* Reload data from WebService. This will clear any selections, which are not restored. Use the approach below to restore selections after reload. var selected = tree.Selected(); tree.Reload(); tree.Selected(selected);
			* @function Reload
			* @param {function} [cb=undefined] If defined, callback function is invoked when root nodes have been loaded and populated - takes Sender (Fit.Controls.WSTreeView) as an argument.
			*/
			public Reload(cb?:Function):void;
			/**
			* Get/set flag indicating whether WebService returns the complete hierarchy when Select All is triggered (Instantly), or loads data for each level individually when TreeView automatically expands all nodes (Progressively - chain loading).
			* @function SelectAllMode
			* @param {Fit.Controls.WSTreeView.SelectAllMode} [val=undefined] If defined, behaviour is set to specified mode
			* @returns typeof Fit.Controls.WSTreeView.SelectAllMode[keyof __FitInternals.IFitControlsWSTreeViewSelectAllMode]
			*/
			public SelectAllMode(val?:typeof Fit.Controls.WSTreeView.SelectAllMode[keyof __FitInternals.IFitControlsWSTreeViewSelectAllMode]):typeof Fit.Controls.WSTreeView.SelectAllMode[keyof __FitInternals.IFitControlsWSTreeViewSelectAllMode];
			/**
			* Fit.Controls.TreeView.Selected override: Get/set selected nodes. Notice for getter: Nodes not loaded yet (preselections) are NOT valid nodes associated with TreeView. Therefore most functions will not work. Preselection nodes can be identified by their title: if (node.Title() === &quot;[pre-selection]&quot;) console.log(&quot;This is a preselection node&quot;); Only the following getter functions can be used for preselection nodes: node.Title(), node.Value(), node.Selected()
			* @function Selected
			* @param {Fit.Controls.TreeView.Node[]} [val=undefined] If defined, provided nodes are selected
			* @returns __FitInternals.FitControlsTreeViewNode[]
			*/
			public Selected(val?:__FitInternals.FitControlsTreeViewNode[]):__FitInternals.FitControlsTreeViewNode[];
			/**
			* Get/set URL to WebService responsible for providing data to TreeView. WebService must deliver data in the following JSON format: [ &#160;&#160;&#160;&#160; { Title: &quot;Test 1&quot;, Value: &quot;1001&quot;, Selectable: true, Selected: true, Children: [] }, &#160;&#160;&#160;&#160; { Title: &quot;Test 2&quot;, Value: &quot;1002&quot;, Selectable: false, Selected: false, Children: [] } ] Only Value is required. Children is a collection of nodes with the same format as described above. HasChildren:boolean may be set to indicate that children are available server side and that WebService should be called to load these children when the given node is expanded. Additionally Expanded:boolean can be set to initially display node as expanded.
			* @function Url
			* @param {string} [wsUrl=undefined] If defined, updates WebService URL (e.g. http://server/ws/data.asxm/GetNodes)
			* @returns string
			*/
			public Url(wsUrl?:string):string;
			/**
			* Create instance of WSTreeView control
			* @function WSTreeView
			* @param {string} ctlId Unique control ID
			*/
			constructor(ctlId:string);
			// Properties defined by Fit.Controls.TreeView
			/**
			* Add node to TreeView
			* @function AddChild
			* @param {Fit.Controls.TreeView.Node} node Node to add
			*/
			public AddChild(node:__FitInternals.FitControlsTreeViewNode):void;
			/**
			* Get/set value indicating whether user is allowed to deselect nodes. By default the user is allowed to deselect nodes.
			* @function AllowDeselect
			* @param {boolean} [val=undefined] If defined, changes behaviour to specified value
			* @returns boolean
			*/
			public AllowDeselect(val?:boolean):boolean;
			/**
			* Fit.Controls.ControlBase.Clear override: Clear control value. Override allows for non-selectable nodes to keep their selection state. This is useful if TreeView has been configured to preselect some non-selectable nodes, hence preventing the user from removing these selections. In that case the desired functionality of the Clear function could be to preserve these preselections. If called with no arguments, all selections are cleared.
			* @function Clear
			* @param {boolean} [preserveNonSelectable=false] True causes selection state of non-selectable nodes to be preserved, False do not
			*/
			public Clear(preserveNonSelectable?:boolean):void;
			/**
			* Get/set instance of ContextMenu control triggered when right clicking nodes in TreeView
			* @function ContextMenu
			* @param {Fit.Controls.ContextMenu} [contextMenu=undefined] If defined, assignes ContextMenu control to TreeView
			* @returns Fit.Controls.ContextMenu
			*/
			public ContextMenu(contextMenu?:Fit.Controls.ContextMenu):Fit.Controls.ContextMenu;
			/**
			* Get all nodes across all children and their children, in a flat structure
			* @function GetAllNodes
			* @returns __FitInternals.FitControlsTreeViewNode[]
			*/
			public GetAllNodes():__FitInternals.FitControlsTreeViewNode[];
			/**
			* Get node by value - returns Null if not found
			* @function GetChild
			* @param {string} val Node value
			* @param {boolean} [recursive=false] If defined, True enables recursive search
			* @returns __FitInternals.FitControlsTreeViewNode
			*/
			public GetChild(val:string, recursive?:boolean):__FitInternals.FitControlsTreeViewNode;
			/**
			* Get all children
			* @function GetChildren
			* @returns __FitInternals.FitControlsTreeViewNode[]
			*/
			public GetChildren():__FitInternals.FitControlsTreeViewNode[];
			/**
			* Get node above specified node - returns Null if no node is above the specified one
			* @function GetNodeAbove
			* @param {Fit.Controls.TreeView.Node} node Node to get node above
			* @returns __FitInternals.FitControlsTreeViewNode
			*/
			public GetNodeAbove(node:__FitInternals.FitControlsTreeViewNode):__FitInternals.FitControlsTreeViewNode;
			/**
			* Get node below specified node - returns Null if no node is below the specified one
			* @function GetNodeBelow
			* @param {Fit.Controls.TreeView.Node} node Node to get node below
			* @returns __FitInternals.FitControlsTreeViewNode
			*/
			public GetNodeBelow(node:__FitInternals.FitControlsTreeViewNode):__FitInternals.FitControlsTreeViewNode;
			/**
			* Get node currently having focus - returns Null if no node has focus
			* @function GetNodeFocused
			* @returns __FitInternals.FitControlsTreeViewNode
			*/
			public GetNodeFocused():__FitInternals.FitControlsTreeViewNode;
			/**
			* Get/set value indicating whether keyboard navigation is enabled
			* @function KeyboardNavigation
			* @param {boolean} [val=undefined] If defined, True enables keyboard navigation, False disables it
			* @returns boolean
			*/
			public KeyboardNavigation(val?:boolean):boolean;
			/**
			* Get/set value indicating whether helper lines are shown. Notice that helper lines cause node items to obtain a fixed line height of 20px, making it unsuitable for large fonts.
			* @function Lines
			* @param {boolean} [val=undefined] If defined, True enables helper lines, False disables them
			* @returns boolean
			*/
			public Lines(val?:boolean):boolean;
			/**
			* Add event handler fired before context menu is shown. This event can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node). Use Sender.ContextMenu() to obtain a reference to the context menu.
			* @function OnContextMenu
			* @param {function} cb Event handler function
			*/
			public OnContextMenu(cb:Function):void;
			/**
			* Add event handler fired when node is being selected or deselected. Selection can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
			* @function OnSelect
			* @param {function} cb Event handler function
			*/
			public OnSelect(cb:Function):void;
			/**
			* Add event handler fired when Select All is used for a given node. This event can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.TreeView) and EventArgs object. EventArgs object contains the following properties: - Node: Fit.Controls.TreeView.Node instance - Selected: Boolean value indicating new selection state
			* @function OnSelectAll
			* @param {function} cb Event handler function
			*/
			public OnSelectAll(cb:Function):void;
			/**
			* Add event handler fired when node is selected or deselected. Selection can not be canceled. Function receives two arguments: Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
			* @function OnSelected
			* @param {function} cb Event handler function
			*/
			public OnSelected(cb:Function):void;
			/**
			* Add event handler fired when node is being expanded or collapsed. Toggle can be canceled by returning False. Function receives two arguments: Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
			* @function OnToggle
			* @param {function} cb Event handler function
			*/
			public OnToggle(cb:Function):void;
			/**
			* Add event handler fired when node is expanded or collapsed. Toggle can not be canceled. Function receives two arguments: Sender (Fit.Controls.TreeView) and Node (Fit.Controls.TreeView.Node).
			* @function OnToggled
			* @param {function} cb Event handler function
			*/
			public OnToggled(cb:Function):void;
			/**
			* Remove all nodes contained in TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes
			* @function RemoveAllChildren
			* @param {boolean} [dispose=false] Set True to dispose nodes
			*/
			public RemoveAllChildren(dispose?:boolean):void;
			/**
			* Remove node from TreeView - this does not result in OnSelect and OnSelected being fired for selected nodes
			* @function RemoveChild
			* @param {Fit.Controls.TreeView.Node} node Node to remove
			*/
			public RemoveChild(node:__FitInternals.FitControlsTreeViewNode):void;
			/**
			* Get/set value indicating whether user can change selection state of nodes. This affects all contained nodes. To configure nodes individually, use Selectable(..) function on node instances.
			* @function Selectable
			* @param {boolean} [val=undefined] If defined, True enables node selection, False disables it
			* @param {boolean} [multi=false] If defined, True enables node multi selection, False disables it
			* @returns boolean
			*/
			public Selectable(val?:boolean, multi?:boolean):boolean;
			/**
			* Select all nodes
			* @function SelectAll
			* @param {boolean} selected Value indicating whether to select or deselect nodes
			* @param {Fit.Controls.TreeView.Node} [selectAllNode=undefined] If specified, given node is selected/deselected along with all its children. If not specified, all nodes contained in TreeView will be selected/deselected.
			*/
			public SelectAll(selected:boolean, selectAllNode?:__FitInternals.FitControlsTreeViewNode):void;
			/**
			* Get/set selected nodes
			* @function Selected
			* @param {Fit.Controls.TreeView.Node[]} [val=undefined] If defined, provided nodes are selected
			* @returns __FitInternals.FitControlsTreeViewNode[]
			*/
			public Selected(val?:__FitInternals.FitControlsTreeViewNode[]):__FitInternals.FitControlsTreeViewNode[];
			/**
			* Create instance of TreeView control
			* @function TreeView
			* @param {string} ctlId Unique control ID
			*/
			constructor(ctlId:string);
			/**
			* Get/set value indicating whether Word Wrapping is enabled
			* @function WordWrap
			* @param {boolean} [val=undefined] If defined, True enables Word Wrapping, False disables it
			* @returns boolean
			*/
			public WordWrap(val?:boolean):boolean;
			// Properties defined by Fit.Controls.PickerBase
			/**
			* Overridden by control developers (required). Destroys control to free up memory. Make sure to call Destroy() on PickerBase which can be done like so: this.Destroy = Fit.Core.CreateOverride(this.Destroy, function() { &#160;&#160;&#160;&#160; // Add control specific logic here &#160;&#160;&#160;&#160; base(); // Call Destroy on PickerBase });
			* @function Destroy
			*/
			public Destroy():void;
			/**
			* Overridden by control developers (required). Get DOMElement representing control.
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Overridden by control developers (optional). Host control dispatches keyboard events to this function to allow picker control to handle keyboard navigation with keys such as arrow up/down/left/right, enter, space, etc. Picker may return False to prevent host control from reacting to given event.
			* @function HandleEvent
			* @param {Event} [e=undefined] Keyboard event to process
			*/
			public HandleEvent(e?:Event):void;
			/**
			* Get/set max height of control - returns object with Value (number) and Unit (string) properties
			* @function MaxHeight
			* @param {number} [value=undefined] If defined, max height is updated to specified value. A value of -1 forces picker to fit height to content.
			* @param {string} [unit=undefined] If defined, max height is updated to specified CSS unit, otherwise px is assumed
			* @returns any
			*/
			public MaxHeight(value?:number, unit?:string):any;
			/**
			* Register event handler fired when picker control is hidden in host control. The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnHide
			* @param {function} cb Event handler function
			*/
			public OnHide(cb:Function):void;
			/**
			* Register event handler fired when item selection is changed. This event may be fired multiple times when a selection is changed, e.g. in Single Selection Mode, where an existing selected item is deselected, followed by selection of new item. The following arguments are passed to event handler function: Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanged
			* @param {function} cb Event handler function
			*/
			public OnItemSelectionChanged(cb:Function):void;
			/**
			* Register event handler fired when item selection is changing. Selection can be canceled by returning False. The following arguments are passed to event handler function: Sender (PickerBase), EventArgs (containing Title (string), Value (string), and Selected (boolean) properties).
			* @function OnItemSelectionChanging
			* @param {function} cb Event handler function
			*/
			public OnItemSelectionChanging(cb:Function):void;
			/**
			* Register event handler invoked when a series of related item changes are completed
			* @function OnItemSelectionComplete
			* @param {function} cb Event handler function which accepts Sender (PickerBase)
			*/
			public OnItemSelectionComplete(cb:Function):void;
			/**
			* Register event handler fired when picker control is shown in host control. The following argument is passed to event handler function: Sender (PickerBase).
			* @function OnShow
			* @param {function} cb Event handler function
			*/
			public OnShow(cb:Function):void;
			/**
			* Overriden by control developers (optional). Host control invokes this function, passing a reference to the input control dispatching keyboard events using the HandleEvent function. This function may be called multiple times with identical or different controls.
			* @function SetEventDispatcher
			* @param {DOMElement} control Event dispatcher control
			* @returns HTMLElement
			*/
			public SetEventDispatcher(control:HTMLElement):HTMLElement;
			/**
			* Overridden by control developers (optional). Host control invokes this function when picker is assigned to host control, providing an array of items already selected. An item is an object with a Title (string) and Value (string) property set. If picker defines preselected items, firing OnItemSelectionChanged for these items, will update the host control appropriately.
			* @function SetSelections
			* @param {array} items Array containing selected items: {Title:string, Value:string}
			*/
			public SetSelections(items:any[]):void;
			/**
			* Overridden by control developers (optional). Host control invokes this function when an item&#39;s selection state is changed from host control. Picker control is responsible for firing FireOnItemSelectionChanging and FireOnItemSelectionChanged, as demonstrated below, if the picker control contains the given item.  var item = getItem(value); if (item !== null) { &#160;&#160;&#160;&#160; if (this._internal.FireOnItemSelectionChanging(item.Title, item.Value, item.Selected) === false) &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; return false;  &#160;&#160;&#160;&#160; item.SetSelected(selected); &#160;&#160;&#160;&#160; this._internal.FireOnItemSelectionChanged(item.Title, item.Value, item.Selected); }  Both events are fired by passing the given item&#39;s title, value, and current selection state. Be aware that host control may pass information about items not found in picker, e.g. when pasting items which may turn out not to be valid selections. Returning False from UpdateItemSelection will cancel the change.
			* @function UpdateItemSelection
			* @param {string} value Item value
			* @param {boolean} selected True if item was selected, False if item was deselected
			*/
			public UpdateItemSelection(value:string, selected:boolean):void;
			// Properties defined by Fit.Controls.ControlBase
			/**
			* Add CSS class to DOMElement representing control
			* @function AddCssClass
			* @param {string} val CSS class to add
			*/
			public AddCssClass(val:string):void;
			/**
			* Get/set value indicating whether control is always considered dirty. This comes in handy when programmatically changing a value of a control on behalf of the user. Some applications may choose to only save values from dirty controls.
			* @function AlwaysDirty
			* @param {boolean} [val=undefined] If defined, Always Dirty is enabled/disabled
			* @returns boolean
			*/
			public AlwaysDirty(val?:boolean):boolean;
			/**
			* Set flag indicating whether control should post back changes automatically when value is changed
			* @function AutoPostBack
			* @param {boolean} [val=undefined] If defined, True enables auto post back, False disables it
			* @returns boolean
			*/
			public AutoPostBack(val?:boolean):boolean;
			/**
			* Clear control value
			* @function Clear
			*/
			public Clear():void;
			/**
			* Destroys control to free up memory. Make sure to call Dispose() on ControlBase which can be done like so: this.Dispose = Fit.Core.CreateOverride(this.Dispose, function() { &#160;&#160;&#160;&#160; // Add control specific dispose logic here &#160;&#160;&#160;&#160; base(); // Call Dispose on ControlBase });
			* @function Dispose
			*/
			public Dispose():void;
			/**
			* Get/set value indicating whether control has focus
			* @function Focused
			* @param {boolean} [value=undefined] If defined, True assigns focus, False removes focus (blur)
			* @returns boolean
			*/
			public Focused(value?:boolean):boolean;
			/**
			* Get DOMElement representing control
			* @function GetDomElement
			* @returns HTMLElement
			*/
			public GetDomElement():HTMLElement;
			/**
			* Get unique Control ID
			* @function GetId
			* @returns string
			*/
			public GetId():string;
			/**
			* Check whether CSS class is found on DOMElement representing control
			* @function HasCssClass
			* @param {string} val CSS class to check for
			* @returns boolean
			*/
			public HasCssClass(val:string):boolean;
			/**
			* Get/set control height - returns object with Value and Unit properties
			* @function Height
			* @param {number} [val=undefined] If defined, control height is updated to specified value. A value of -1 resets control height.
			* @param {string} [unit=px] If defined, control height is updated to specified CSS unit
			* @returns any
			*/
			public Height(val?:number, unit?:string):any;
			/**
			* Get value indicating whether user has changed control value
			* @function IsDirty
			* @returns boolean
			*/
			public IsDirty():boolean;
			/**
			* Get value indicating whether control value is valid. Control value is considered invalid if control is required, but no value is set, or if control value does not match regular expression set using SetValidationExpression(..).
			* @function IsValid
			* @returns boolean
			*/
			public IsValid():boolean;
			/**
			* Register OnBlur event handler which is invoked when control loses focus
			* @function OnBlur
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnBlur(cb:Function):void;
			/**
			* Register OnChange event handler which is invoked when control value is changed either programmatically or by user
			* @function OnChange
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnChange(cb:Function):void;
			/**
			* Register OnFocus event handler which is invoked when control gains focus
			* @function OnFocus
			* @param {function} cb Event handler function which accepts Sender (ControlBase)
			*/
			public OnFocus(cb:Function):void;
			/**
			* Remove CSS class from DOMElement representing control
			* @function RemoveCssClass
			* @param {string} val CSS class to remove
			*/
			public RemoveCssClass(val:string):void;
			/**
			* Render control, either inline or to element specified
			* @function Render
			* @param {DOMElement} [toElement=undefined] If defined, control is rendered to this element
			*/
			public Render(toElement?:HTMLElement):void;
			/**
			* Get/set value indicating whether control is required to be set
			* @function Required
			* @param {boolean} [val=undefined] If defined, control required feature is enabled/disabled
			* @returns boolean
			*/
			public Required(val?:boolean):boolean;
			/**
			* Get/set scope to which control belongs - this is used to validate multiple controls at once using Fit.Controls.ValidateAll(scope) or Fit.Controls.DirtyCheckAll(scope).
			* @function Scope
			* @param {string} [val=undefined] If defined, control scope is updated
			* @returns string
			*/
			public Scope(val?:string):string;
			/**
			* Set callback function used to perform on-the-fly validation against control value
			* @function SetValidationCallback
			* @param {function} cb Function receiving control value - must return True if value is valid, otherwise False
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationCallback(cb:Function, errorMsg?:string):void;
			/**
			* Set regular expression used to perform on-the-fly validation against control value
			* @function SetValidationExpression
			* @param {RegExp} regEx Regular expression to validate against
			* @param {string} [errorMsg=undefined] If defined, specified error message is displayed when user clicks or hovers validation error indicator
			*/
			public SetValidationExpression(regEx:RegExp, errorMsg?:string):void;
			/**
			* Get/set control value. For controls supporting multiple selections: Set value by providing a string in one the following formats: title1=val1[;title2=val2[;title3=val3]] or val1[;val2[;val3]]. If Title or Value contains reserved characters (semicolon or equality sign), these most be URIEncoded. Selected items are returned in the first format described, also with reserved characters URIEncoded. Providing a new value to this function results in OnChange being fired.
			* @function Value
			* @param {string} [val=undefined] If defined, items are selected
			* @returns string
			*/
			public Value(val?:string):string;
			/**
			* Get/set value indicating whether control is visible
			* @function Visible
			* @param {boolean} [val=undefined] If defined, control visibility is updated
			* @returns boolean
			*/
			public Visible(val?:boolean):boolean;
			/**
			* Get/set control width - returns object with Value and Unit properties
			* @function Width
			* @param {number} [val=undefined] If defined, control width is updated to specified value. A value of -1 resets control width.
			* @param {string} [unit=px] If defined, control width is updated to specified CSS unit
			* @returns any
			*/
			public Width(val?:number, unit?:string):any;
			public static readonly SelectAllMode : __FitInternals.IFitControlsWSTreeViewSelectAllMode;
		}
	}
	/**
	* Cookie functionality. Set/Get/Remove functions can be invoked as static members, or an instance of Fit.Cookies can be created to isolate cookies to either the current path or a custom path.
	* @class [Fit.Cookies Cookies]
	*/
	class Cookies
	{
		// Properties defined by Fit.Cookies
		/**
		* Returns cookie value if found, otherwise Null
		* @function Get
		* @param {string} name Unique cookie name
		* @returns string
		*/
		public static Get(name:string):string;
		/**
		* Remove cookie
		* @function Remove
		* @param {string} name Unique cookie name
		* @param {string} [path=undefined] Optional cookie path. If cookie was defined on a custom path, the same path must be specified to remove the cookie.
		*/
		public static Remove(name:string, path?:string):void;
		/**
		* Create or update cookie
		* @function Set
		* @param {string} name Unique cookie name
		* @param {string} value Cookie value (cannot contain semicolon!)
		* @param {integer} [seconds=undefined] Optional expiration time in seconds. Creating a cookie with no expiration time will cause it to expire when session ends.
		* @param {string} [path=undefined] Optional cookie path. Specifying no path makes cookie accessible to entire domain.
		*/
		public static Set(name:string, value:string, seconds?:number, path?:string):void;
		/**
		* Create instance of cookie container isolated to either current path or a custom path
		* @function Cookies
		*/
		constructor();
		/**
		* Returns cookie value if found, otherwise Null
		* @function Get
		* @param {string} name Unique cookie name
		* @returns string
		*/
		public Get(name:string):string;
		/**
		* Get/set path to which cookies are isolated
		* @function Path
		* @param {string} [val=undefined] If defined, changes isolation to specified path
		* @returns string
		*/
		public Path(val?:string):string;
		/**
		* Get/set prefix added to all cookies - useful for grouping related cookies and to avoid naming conflicts. Notice that Set/Get/Remove functions automatically apply the prefix to cookie names, so the use of a prefix is completely transparent.
		* @function Prefix
		* @param {string} [val=undefined] If defined, changes cookie prefix to specified value
		* @returns string
		*/
		public Prefix(val?:string):string;
		/**
		* Remove cookie
		* @function Remove
		* @param {string} name Unique cookie name
		*/
		public Remove(name:string):void;
		/**
		* Create or update cookie
		* @function Set
		* @param {string} name Unique cookie name
		* @param {string} value Cookie value (cannot contain semicolon!)
		* @param {integer} [seconds=undefined] Optional expiration time in seconds. Creating a cookie with no expiration time will cause it to expire when session ends.
		*/
		public Set(name:string, value:string, seconds?:number):void;
	}
	/**
	* Core features extending the capabilities of native JS
	* @class [Fit.Core Core]
	*/
	class Core
	{
		// Properties defined by Fit.Core
		/**
		* Clone JavaScript object. Supported object types and values: String, Number, Boolean, Date, Array, (JSON) Object, Function, Undefined, Null, NaN. Variables defined as undefined are left out of clone, since an undefined variable is equal to a variable defined as undefined. Notice that Arrays and Objects can contain supported object types and values only. Functions are considered references, and as such the cloned object will reference the same functions. Custom properties set on native JS objects (e.g. Array.XYZ) are not cloned, only values are. Naturally custom (JSON) objects will be fully cloned, including all properties. Both arrays and custom (JSON) objects are cloned recursively. Be aware of self referencing variables and circular structures, which will cause an infinite loop, and eventually a stack overflow exception. DOM objects and window/frame instances are not supported.
		* @function Clone
		* @param {object} obj JS object to clone
		* @returns any
		*/
		public static Clone(obj:any):any;
		/**
		* Create a function override for any given function using the approach below.  this.SayHello = function(name) { alert(&quot;Hello &quot; + name); } this.SayHello = Fit.Core.CreateOverride(this.SayHello, function(name) { console.log(name + &quot; logged in&quot;); console.log(name + &quot; is using the following browser: &quot; + navigator.userAgent);  base(name); // Call original SayHello function });  Notice how base(..) allows us to call the original function.
		* @function CreateOverride
		* @param {function} originalFunction Reference to function to override
		* @param {function} newFunction Reference to replacement function
		* @returns Function
		*/
		public static CreateOverride(originalFunction:Function, newFunction:Function):Function;
		/**
		* Extend any object with the public members of a super class.  MyClass = function(controlId) { &#160;&#160;&#160;&#160; Fit.Core.Extend(this, MySuperClass).Apply(); }  The code above defines a class called MyClass which extends from MySuperClass. Use Apply() to pass variables to the super class constructor as shown below:  Male = function(name, age) { &#160;&#160;&#160;&#160; Fit.Core.Extend(this, Person).Apply(&quot;Male&quot;, name, age); }  Notice that calling just Extend(..) without calling Apply() on the object returned, will not cause extension to occure. Apply() must be called, with or without parameters.  Notice that Fit.UI supports multiple inheritance. Be careful not to extend from multiple classes implementing functions with identical names, or at least be aware that the last class from which the derivative extends, takes precedence.
		* @function Extend
		* @param {object} subInstance Instance of sub class to extend
		* @param {function} superType Class (function) to extend from
		*/
		public static Extend(subInstance:any, superType:Function):void;
		/**
		* Returns boolean indicating whether given object is an extension of a given super type - see Fit.Core.Extend(..). Also look into Fit.Core.InstanceOf(..) which may provide the desired behaviour.
		* @function Extends
		* @param {object} instance Object instance
		* @param {function} superType Reference to super class (function)
		* @returns boolean
		*/
		public static Extends(instance:any, superType:Function):boolean;
		/**
		* Returns boolean indicating whether given object is an instance or extension of a given class type - see Fit.Core.Extend(..). This is equivalent of: var result = (obj instanceof MyType || Fit.Core.Extends(obj, MyType));
		* @function InstanceOf
		* @param {object} instance Object instance
		* @param {function} type Reference to class (function)
		* @returns boolean
		*/
		public static InstanceOf(instance:any, type:Function):boolean;
		/**
		* Compare two JavaScript objects to determine whether they are identical. Returns True if objects are identical (equal), otherwise False. Functions are compared by reference, not by value. Custom properties set on native JS objects (e.g. Array.XYZ) are not compared, only values are. Naturally JSON objects will be fully compared, including all properties. Be aware of self referencing variables and circular structures, which will cause an infinite loop, and eventually a stack overflow exception. DOM objects and window/frame instances are not supported.
		* @function IsEqual
		* @param {object} jsObj1 JS object to compare agains second JS object
		* @param {object} jsObj2 JS object to compare agains first JS object
		* @returns boolean
		*/
		public static IsEqual(jsObj1:any, jsObj2:any):boolean;
	}
	/**
	* 
	* @class [Fit.Data Data]
	*/
	class Data
	{
		// Properties defined by Fit.Data
		/**
		* Returns Version 4 compliant GUID
		* @function CreateGuid
		* @param {boolean} [dashFormat=true] Flag indicating whether to use format with or without dashes. True = With dashes (default): 57df75f2-3d09-48ca-9c94-f64a5986518f (length = 36) False = Without dashes: 57df75f23d0948ca9c94f64a5986518f (length = 32)
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
		// Properties defined by Fit.Date
		/**
		* Format instance of Date. Example: Fit.Date.Format(new Date(), &quot;YYYY-MM-DD hh:mm:ss&quot;); Result: 2016-06-18 15:23:48  Date can be formatted using the following variables: YYYY: 4 digits year (e.g. 2016) YY: 2 digits year (e.g. 16) MM: 2 digits month (e.g. 04) M: Prefer 1 digit month if possible (e.g. 4) DD: 2 digits day (e.g. 09) D: Prefer 1 digit day if possible (e.g. 9) W: 1 digit week number (e.g. 35) hh: 2 digits hours value (e.g. 08) h: 1 digit hours value if possible (e.g. 8) mm: 2 digits minutes value (e.g. 02) m: 1 digit minutes value if possible (e.g. 2) ss: 2 digits seconds value (e.g. 05) s: 1 digit seconds value if possible (e.g. 5)
		* @function Format
		* @param {Date} date Date to format as string
		* @param {string} format Date format
		* @returns string
		*/
		public static Format(date:Date, format:string):string;
		/**
		* Get ISO 8601 week number from date
		* @function GetWeek
		* @param {Date} date Date to get week number from
		* @returns number
		*/
		public static GetWeek(date:Date):number;
		/**
		* Parse date as string into an instance of Date - example: 18-09/2016 17:03:21
		* @function Parse
		* @param {string} strDate Date as string
		* @param {string} format Specify date format used to allow parser to determine which parts of the string is Year, Month, Day, etc. The same variables used for Fit.Date.Format can be used, except for W (week). Since the parser do not need to know the length of the different parts that makes up the Date, one can simply use the shorter variable format: Y, M, D, h, m, s. Be aware that the Parse function does not support a Year represented by a 2 digit value, since it will be impossible to determine which century it belongs to. Example: D-M/Y h:m:s
		* @returns Date
		*/
		public static Parse(strDate:string, format:string):Date;
	}
	/**
	* DOM (Document Object Model) manipulation and helper functionality
	* @class [Fit.Dom Dom]
	*/
	class Dom
	{
		// Properties defined by Fit.Dom
		/**
		* Add element to container
		* @function Add
		* @param {DOMElement} container Add element to this container
		* @param {DOMNode} elm Element, Text, or Comment to add to container
		*/
		public static Add(container:HTMLElement, elm:Node):void;
		/**
		* Add CSS class to element if not already found
		* @function AddClass
		* @param {DOMElement} elm Element on which CSS class is to be added
		* @param {string} cls CSS class name
		*/
		public static AddClass(elm:HTMLElement, cls:string):void;
		/**
		* Get/set attribute on DOMElement
		* @function Attribute
		* @param {DOMElement} elm DOMElement to which attribute is set and/or returned from
		* @param {string} name Name of attribute to set or retrieve
		* @param {string} [value=undefined] If defined, attribute is updated with specified value. Passing Null results in attribute being removed.
		* @returns string
		*/
		public static Attribute(elm:HTMLElement, name:string, value?:string):string;
		/**
		* Check whether given element is found in given container at any given level in object hierarchy
		* @function Contained
		* @param {DOMElement} container Container expected to contain element
		* @param {DOMNode} elm Element expected to be found in container&#39;s object hierarchy
		* @returns boolean
		*/
		public static Contained(container:HTMLElement, elm:Node):boolean;
		/**
		* Create element with the specified HTML content. HTML content is (by default) wrapped in a &lt;div&gt; if it produced multiple elements. If content on the other hand produces only one outer element, that particular element is returned. It is possible to construct DOM objects of type Element, Text, and Comment. The container type used to wrap multiple elements can be changed using the containerTagName argument.
		* @function CreateElement
		* @param {string} html HTML element to create DOMElement from
		* @param {string} [containerTagName=div] If defined, and html argument produces multiple element, the result is wrapped in a container of the specified type. If not set, multiple elements will be wrapped in a &lt;div&gt; container.
		* @returns Node
		*/
		public static CreateElement(html:string, containerTagName?:string):Node;
		/**
		* Get/set data attribute on DOMElement
		* @function Data
		* @param {DOMElement} elm DOMElement to which data attribute is set and/or returned from
		* @param {string} name Name of data attribute to set or retrieve
		* @param {string} [value=undefined] If defined, data attribute is updated with specified value. Passing Null results in data attribute being removed.
		* @returns string
		*/
		public static Data(elm:HTMLElement, name:string, value?:string):string;
		/**
		* Get style value applied after stylesheets have been loaded. An empty string or null may be returned if style has not been defined or does not exist. Make sure not to use shorthand properties (e.g. border-color or padding) as some browsers are not capable of calculating these - use the fullly qualified property name (e.g. border-left-color or padding-left).
		* @function GetComputedStyle
		* @param {DOMElement} elm Element which contains desired CSS style value
		* @param {string} style CSS style property name
		* @returns string
		*/
		public static GetComputedStyle(elm:HTMLElement, style:string):string;
		/**
		* Get container responsible for hiding given element. Element passed will be returned if hidden itself. Returns Null if element is visible, or has not been rooted in DOM yet.
		* @function GetConcealer
		* @param {DOMNode} elm Element to get concealer for
		* @returns HTMLElement
		*/
		public static GetConcealer(elm:Node):HTMLElement;
		/**
		* Get number of levels specified element is nested in DOM. HTMLElement is at level 0, HTMLBodyElement is at level 1, first element in HTMLBodyElement is at level 2, and so forth.
		* @function GetDepth
		* @param {DOMNode} elm Element to get depth in DOM for
		* @returns number
		*/
		public static GetDepth(elm:Node):number;
		/**
		* Returns element currently focused. If no element is focused, the document body is returned. Null will be returned if the document has not been loaded yet.
		* @function GetFocused
		* @returns HTMLElement
		*/
		public static GetFocused():HTMLElement;
		/**
		* Get element position within parent element. Notice that Text and Comment nodes are ignored.
		* @function GetIndex
		* @param {DOMElement} elm Element to get index for
		* @returns number
		*/
		public static GetIndex(elm:HTMLElement):number;
		/**
		* Returns object with X and Y properties (integers) with inner dimensions of specified container. Inner dimensions are width and height with padding and borders substracted.
		* @function GetInnerDimensions
		* @param {DOMElement} elm Element to get inner dimensions for
		* @returns any
		*/
		public static GetInnerDimensions(elm:HTMLElement):any;
		/**
		* Returns first parent of specified type for a given element if found, otherwise Null
		* @function GetParentOfType
		* @param {DOMNode} element Element to find parent for
		* @param {string} parentType Tagname of parent element to look for
		* @returns HTMLElement
		*/
		public static GetParentOfType(element:Node, parentType:string):HTMLElement;
		/**
		* Get position for visible element. Object returned contains an X and Y property with the desired integer values (pixels). Null will be returned if element is not visible.
		* @function GetPosition
		* @param {DOMElement} elm Element to get position for
		* @param {boolean} [relativeToViewport=false] Set True to get element position relative to viewport rather than to document which may exceed the viewport
		* @returns any
		*/
		public static GetPosition(elm:HTMLElement, relativeToViewport?:boolean):any;
		/**
		* Get element position relative to a positioned parent or ancestor (offsetParent). Coordinates returned are relative to document if no positioned parent or ancestor is found. For an element with position:fixed coordinates relative to the document is returned. Object returned contains an X and Y property with the desired integer values (pixels). Notice that Null is returned in case element is not rooted yet (added to DOM) or invisible.
		* @function GetRelativePosition
		* @param {DOMElement} elm Element to get position for
		* @returns any
		*/
		public static GetRelativePosition(elm:HTMLElement):any;
		/**
		* Get number of pixels specified element&#39;s container(s) have been scrolled. This gives us the total scroll value for nested scrollable elements. Object returned contains an X and Y property with the desired integer values (pixels).
		* @function GetScrollPosition
		* @param {DOMNode} elm Element to get scroll position for
		* @returns any
		*/
		public static GetScrollPosition(elm:Node):any;
		/**
		* Check whether given DOMElement has specified CSS class registered - returns True if found, otherwise False
		* @function HasClass
		* @param {DOMElement} elm Element for which CSS class may be registered
		* @param {string} cls CSS class name
		* @returns boolean
		*/
		public static HasClass(elm:HTMLElement, cls:string):boolean;
		/**
		* Insert DOMNode after another DOMNode
		* @function InsertAfter
		* @param {DOMNode} target Element to insert new element after
		* @param {DOMNode} newElm Element to insert after target element
		*/
		public static InsertAfter(target:Node, newElm:Node):void;
		/**
		* Insert DOMNode at given position. Notice that position is relative to contained DOM Elements. Text and Comment nodes are ignored.
		* @function InsertAt
		* @param {DOMElement} container Container to insert element into
		* @param {integer} position Position (index) to insert element at
		* @param {DOMNode} newElm Element to insert
		*/
		public static InsertAt(container:HTMLElement, position:number, newElm:Node):void;
		/**
		* Insert DOMNode before another DOMNode
		* @function InsertBefore
		* @param {DOMNode} target Element to insert new element before
		* @param {DOMNode} newElm Element to insert before target element
		*/
		public static InsertBefore(target:Node, newElm:Node):void;
		/**
		* Returns True if element is rooted in document (appended to body), otherwise False
		* @function IsRooted
		* @param {DOMNode} elm Element to check
		* @returns boolean
		*/
		public static IsRooted(elm:Node):boolean;
		/**
		* Check whether given element is visible. Returns True if element has been rooted in DOM and is visible. Returns False if not rooted, or display:none has been set on element or any of its ancestors.
		* @function IsVisible
		* @param {DOMNode} elm Element to check visibility for
		* @returns boolean
		*/
		public static IsVisible(elm:Node):boolean;
		/**
		* Remove DOMNode from its container element
		* @function Remove
		* @param {DOMNode} elm DOMNode to remove
		*/
		public static Remove(elm:Node):void;
		/**
		* Remove CSS class from element if found
		* @function RemoveClass
		* @param {DOMElement} elm Element from which CSS class is to be removed
		* @param {string} cls CSS class name
		*/
		public static RemoveClass(elm:HTMLElement, cls:string):void;
		/**
		* Replace element with another one
		* @function Replace
		* @param {DOMNode} oldElm Element to replace (Element, Text, or Comment)
		* @param {DOMNode} newElm Replacement element (Element, Text, or Comment)
		*/
		public static Replace(oldElm:Node, newElm:Node):void;
		/**
		* Get/set inner text of DOMElement
		* @function Text
		* @param {DOMElement} elm DOMElement to which text is added and/or returned from
		* @param {string} [value=undefined] If defined, inner text is updated with specified value
		* @returns string
		*/
		public static Text(elm:HTMLElement, value?:string):string;
		/**
		* Wraps element in container element while preserving position in DOM if rooted
		* @function Wrap
		* @param {DOMNode} elementToWrap Element to wrap
		* @param {DOMElement} container Container to wrap element within
		*/
		public static Wrap(elementToWrap:Node, container:HTMLElement):void;
	}
	/**
	* Event handler functionality
	* @class [Fit.Events Events]
	*/
	class Events
	{
		// Properties defined by Fit.Events
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID
		* @function AddHandler
		* @param {EventTarget} element EventTarget (e.g. Window or DOMElement) on to which event handler is registered
		* @param {string} event Event name without &#39;on&#39; prefix (e.g. &#39;load&#39;, &#39;mouseover&#39;, &#39;click&#39; etc.)
		* @param {boolean} useCapture Set True to capture event before it reaches target, False to catch event when it bubbles out from target. NOTICE: This feature will be ignored by Internet Explorer 8 and below.
		* @param {function} eventFunction JavaScript function to register
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:string, useCapture:boolean, eventFunction:Function):number;
		/**
		* Registers handler for specified event on given EventTarget and returns Event ID
		* @function AddHandler
		* @param {EventTarget} element EventTarget (e.g. Window or DOMElement) on to which event handler is registered
		* @param {string} event Event name without &#39;on&#39; prefix (e.g. &#39;load&#39;, &#39;mouseover&#39;, &#39;click&#39; etc.)
		* @param {function} eventFunction JavaScript function to register
		* @returns number
		*/
		public static AddHandler(element:EventTarget, event:string, eventFunction:Function):number;
		/**
		* Registers mutation observer which is invoked when a DOMElement is updated. By default only attributes and dimensions are observed. Use deep flag to have children and character data observed too. An observer ID is returned which can be used to remove mutation observer. Important: Mutation observers should be removed when no longer needed for better performance! To remove an observer from within the observer function itself, simply call disconnect().
		* @function AddMutationObserver
		* @param {DOMElement} elm DOMElement to observe
		* @param {function} obs JavaScript observer function to register - receives reference to DOMElement being observed when updated
		* @param {boolean} [deep=false] Flag indicating whether to check for modifications within element (children and character data) - this could potentially be expensive
		* @returns number
		*/
		public static AddMutationObserver(elm:HTMLElement, obs:Function, deep?:boolean):number;
		/**
		* Get event argument related to event just fired in a cross browser compatible manner
		* @function GetEvent
		* @param {Event} [e=undefined] Event argument
		* @returns Event
		*/
		public static GetEvent(e?:Event):Event;
		/**
		* Get object containing information about modifier keys currently being active. Object contains the following properties which are True if the given key is being held down: Shift, Ctrl, Alt, Meta (Cmd key on Mac OSX, Win key on Windows).
		* @function GetModifierKeys
		* @returns any
		*/
		public static GetModifierKeys():any;
		/**
		* Get object containing information about pointer. Object contains the following properties: Buttons.Primary/Secondary: Is True if given button is being held down Coordinates.ViewPort.X/Y: Mouse coordinates within viewport Coordinates.Document.X/Y: Mouse coordinates within document which may have been scrolled
		* @function GetPointerState
		* @returns any
		*/
		public static GetPointerState():any;
		/**
		* Get a reference to the object that is affected by an event
		* @function GetTarget
		* @param {Event} [e=undefined] Event argument
		* @returns HTMLElement
		*/
		public static GetTarget(e?:Event):HTMLElement;
		/**
		* Registers OnReady handler which gets fired when DOM is ready for manipulation, or if it is already ready
		* @function OnDomReady
		* @param {function} callback JavaScript function to register
		*/
		public static OnDomReady(callback:Function):void;
		/**
		* Registers OnReady handler which gets fired when document is ready, or if it is already ready
		* @function OnReady
		* @param {function} callback JavaScript function to register
		*/
		public static OnReady(callback:Function):void;
		/**
		* Prevent default behaviour triggered by given event - returns False
		* @function PreventDefault
		* @param {Event} [e=undefined] Event argument
		* @returns boolean
		*/
		public static PreventDefault(e?:Event):boolean;
		/**
		* Remove event handler for specified event on given EventTarget
		* @function RemoveHandler
		* @param {DOMElement} element EventTarget (e.g. Window or DOMElement) from which event handler is removed
		* @param {string} event Event name without &#39;on&#39; prefix (e.g. &#39;load&#39;, &#39;mouseover&#39;, &#39;click&#39; etc.)
		* @param {function} eventFunction JavaScript function to remove
		*/
		public static RemoveHandler(element:HTMLElement, event:string, eventFunction:Function):void;
		/**
		* Remove event handler given by Event ID returned from Fit.Events.AddHandler(..)
		* @function RemoveHandler
		* @param {DOMElement} element EventTarget (e.g. Window or DOMElement) from which event handler is removed
		* @param {integer} eventId Event ID identifying handler to remove
		*/
		public static RemoveHandler(element:HTMLElement, eventId:number):void;
		/**
		* Remove event handler for specified event on given EventTarget
		* @function RemoveHandler
		* @param {DOMElement} element EventTarget (e.g. Window or DOMElement) from which event handler is removed
		* @param {string} event Event name without &#39;on&#39; prefix (e.g. &#39;load&#39;, &#39;mouseover&#39;, &#39;click&#39; etc.)
		* @param {boolean} useCapture Value indicating whether event handler was registered using event capturing (True) or event bubbling (False).
		* @param {function} eventFunction JavaScript function to remove
		*/
		public static RemoveHandler(element:HTMLElement, event:string, useCapture:boolean, eventFunction:Function):void;
		/**
		* Remove mutation observer by ID
		* @function RemoveMutationObserver
		* @param {integer} id Observer ID returned from AddMutationObserver(..) function
		*/
		public static RemoveMutationObserver(id:number):void;
		/**
		* Remove mutation observer
		* @function RemoveMutationObserver
		* @param {DOMElement} elm DOMElement being observed
		* @param {function} obs JavaScript observer function to remove
		* @param {boolean} [deep=undefined] If defined, observer must have been registered with the same deep value to be removed
		*/
		public static RemoveMutationObserver(elm:HTMLElement, obs:Function, deep?:boolean):void;
		/**
		* Completely suppress event which is equivalent of calling both PreventDefault(e) and StopPropagation(e). Returns False.
		* @function Stop
		* @param {Event} [e=undefined] Event argument
		* @returns boolean
		*/
		public static Stop(e?:Event):boolean;
		/**
		* Prevent given event from propagating (bubble up) - returns False
		* @function StopPropagation
		* @param {Event} [e=undefined] Event argument
		* @returns boolean
		*/
		public static StopPropagation(e?:Event):boolean;
	}
	/**
	* Loader is a useful mechanism for loading styleheets and JavaScript on demand in a non blocking manner.
	* @class [Fit.Loader Loader]
	*/
	class Loader
	{
		// Properties defined by Fit.Loader
		/**
		* Load client script on demand in a non-blocking manner.  ExecuteScript differs from LoadScript in the way code is loaded and executed. ExecuteScript loads the script using AJAX, meaning the script file either has to be located on the same domain as the application invoking ExecuteScript, or have the Access-Control-Allow-Origin header configured to allow file to be loaded from a foreign domain. The code loaded is injected into the virtual machine meaning debugging will not reveal from which file the code originated, although this information can be retrived by inspecting the call stack. ExecuteScript has the advantages that is allows for	both an OnSuccess and OnFailure handler, and it allows for objects to be passed to the executing script using the context parameter, which will cause the code to execute within its own contained scope (closure). The script will execute in the global scope if no context object is provided.  // Example of loading a JavaScript file, passing variables to it:  Fit.Loader.ExecuteScript(&quot;extensions/test/test.js&quot;, function(src) { &#160;&#160;&#160;&#160; alert(&quot;JavaScript &quot; + src + &quot; loaded and ready to be used!&quot;); }, function(src) { &#160;&#160;&#160;&#160; alert(&quot;JavaScript &quot; + src + &quot; could NOT be loaded;);  }, { $: window.jQuery, mode: &quot;advanced&quot;, showData: &quot;users&quot; });
		* @function ExecuteScript
		* @param {string} src Script source (path or URL)
		* @param {function} [onSuccess=undefined] Callback function fired when script has been successfully loaded and executed. The function takes the script source requested as an argument.
		* @param {function} [onFailure=undefined] Callback function fired if script could not be loaded or executed successfully. The function takes the script source requested as an argument.
		* @param {object} [context=undefined] Properties registered on the context object will be exposed as globally accessible objects for the executing script. Example: { jQuery: window.jQuery, $: window.jQuery } The script will execute in the global window scope if no context object is defined.
		*/
		public static ExecuteScript(src:string, onSuccess?:Function, onFailure?:Function, context?:any):void;
		/**
		* Load client script on demand in a non-blocking manner.  // Example of loading a JavaScript file  Fit.Loader.LoadScript(&quot;extensions/test/test.js&quot;, function(src) { &#160;&#160;&#160;&#160; alert(&quot;JavaScript &quot; + src + &quot; loaded and ready to be used!&quot;); });
		* @function LoadScript
		* @param {string} src Script source (path or URL)
		* @param {function} [callback=undefined] Callback function fired when script loading is complete - takes the script source requested as an argument. Be aware that a load error will also trigger the callback to make sure control is always returned. Consider using feature detection within callback function for super reliable execution - example: if (expectedObjectOrFunction) { \* Successfully loaded, continue.. *\ }
		*/
		public static LoadScript(src:string, callback?:Function):void;
		/**
		* Chain load multiple client scripts on demand in a non-blocking manner.  // Example of loading multiple JavaScript files in serial:  Fit.Loader.LoadScripts( [ &#160;&#160;&#160;&#160; { &#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;extensions/test/menu.js&quot;, &#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;JavaScript &quot; + cfg.source + &quot; loaded&quot;); } &#160;&#160;&#160;&#160; }, &#160;&#160;&#160;&#160; { &#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;http://cdn.domain.com/chat.js&quot;, &#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;JavaScript &quot; + cfg.source + &quot; loaded&quot;); } &#160;&#160;&#160;&#160; } ], function(cfgs) { &#160;&#160;&#160;&#160; alert(&quot;All files loaded&quot;); });  First argument is an array of script configurations: source:string (required): Script source (path or URL) loaded:function (optional): Callback function to execute when file has loaded (takes file configuration as argument) Be aware that loaded callback is invoked even if a load error occures, to make sure control is returned to your code.  Second argument is the callback function fired when all files have finished loading - takes configuration array as argument. This too may be invoked even if a load error occured, to make sure control is returned to your code.  Consider using feature detection within callback functions for super reliable execution - example: if (expectedObjectOrFunction) { \* Successfully loaded, continue.. *\ }
		* @function LoadScripts
		* @param {array} cfg Configuration array (see function description for details)
		* @param {function} [callback=undefined] Callback function fired when all scripts have finished loading (see function description for details)
		*/
		public static LoadScripts(cfg:any[], callback?:Function):void;
		/**
		* Load CSS stylesheet on demand in a non-blocking manner. It is recommended to load stylesheets before rendering items using the CSS classes to avoid FOUC (Flash Of Unstyled Content).  // Example of loading a CSS file  Fit.Loader.LoadStyleSheet(&quot;extensions/test/layout.css&quot;, function(src) { &#160;&#160;&#160;&#160; alert(&quot;CSS file &quot; + src + &quot; loaded!&quot;); });
		* @function LoadStyleSheet
		* @param {string} src CSS file source (path or URL)
		* @param {function} [callback=undefined] Callback function fired when CSS file loading is complete - takes the file source requested as an argument. Be aware that a load error will also trigger the callback to make sure control is always returned.
		*/
		public static LoadStyleSheet(src:string, callback?:Function):void;
		/**
		* Load multiple stylesheets in parrallel in a non-blocking manner.  // Example of loading multiple CSS files:  Fit.Loader.LoadStyleSheets( [ &#160;&#160;&#160;&#160; { &#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;extensions/test/menu.css&quot;, &#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;Stylesheet &quot; + cfg.source + &quot; loaded&quot;); } &#160;&#160;&#160;&#160; }, &#160;&#160;&#160;&#160; { &#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; source: &quot;http://cdn.domain.com/chat.css&quot;, &#160;&#160;&#160;&#160; &#160;&#160;&#160;&#160; loaded: function(cfg) { alert(&quot;Stylesheet &quot; + cfg.source + &quot; loaded&quot;); } &#160;&#160;&#160;&#160; } ], function(cfgs) { &#160;&#160;&#160;&#160; alert(&quot;All stylesheets loaded&quot;); });  First argument is an array of stylesheet configurations: source:string (required): Stylesheet source (path or URL) loaded:function (optional): Callback function to execute when stylesheet has loaded (takes stylesheet configuration as argument) Be aware that loaded callback is invoked even if a load error occures, to make sure control is returned to your code.  Second argument is the callback function fired when all stylesheets have finished loading - takes configuration array as argument. This too may be invoked even if a load error occured, to make sure control is returned to your code.
		* @function LoadStyleSheets
		* @param {array} cfg Configuration array (see function description for details)
		* @param {function} [callback=undefined] Callback function fired when all stylesheets have finished loading (see function description for details)
		*/
		public static LoadStyleSheets(cfg:any[], callback?:Function):void;
	}
	/**
	* 
	* @class [Fit.Math Math]
	*/
	class Math
	{
		// Properties defined by Fit.Math
		/**
		* Format value to produce a number with the specified number of decimals. Value is properly rounded off to ensure best precision.
		* @function Format
		* @param {number} value Number to format
		* @param {integer} decimals Desired number of decimals
		* @param {string} [decimalSeparator=undefined] If defined, the specified decimal separator will be used
		* @returns string
		*/
		public static Format(value:number, decimals:number, decimalSeparator?:string):string;
		/**
		* Round off value to a number with the specified precision
		* @function Round
		* @param {number} value Number to round off
		* @param {integer} precision Desired precision
		* @returns number
		*/
		public static Round(value:number, precision:number):number;
	}
	/**
	* 
	* @class [Fit.String String]
	*/
	class String
	{
		// Properties defined by Fit.String
		/**
		* Decode special characters represented as HTML entities back into their actual characters
		* @function DecodeHtml
		* @param {string} str String to decode
		* @returns string
		*/
		public static DecodeHtml(str:string):string;
		/**
		* Encode special characters into HTML entities
		* @function EncodeHtml
		* @param {string} str String to encode
		* @returns string
		*/
		public static EncodeHtml(str:string):string;
		/**
		* Get Java compatible Hash Code from string
		* @function Hash
		* @param {string} str String to get hash code from
		* @returns number
		*/
		public static Hash(str:string):number;
		/**
		* Removes any HTML contained in string, and returns the raw text value
		* @function StripHtml
		* @param {string} str String to strip HTML from
		* @returns string
		*/
		public static StripHtml(str:string):string;
		/**
		* Removes any whitespaces in beginning and end of string passed, and returns the new string
		* @function Trim
		* @param {string} str String to trim
		* @returns string
		*/
		public static Trim(str:string):string;
		/**
		* Returns string with first letter upper cased
		* @function UpperCaseFirst
		* @param {string} str String to turn first letter into upper case
		* @returns string
		*/
		public static UpperCaseFirst(str:string):string;
	}
	/**
	* Templating engine allowing for separation between layout and logic.  // Example code  // Load template (asynchronously) var tpl = new Fit.Template(true); tpl.LoadUrl(&quot;UserListView.html&quot;, function(sender) { &#160;&#160;&#160;&#160; // Populate placeholders &#160;&#160;&#160;&#160; tpl.Content.Title = &quot;User list&quot;; &#160;&#160;&#160;&#160; tpl.Content.Description = &quot;List of users created in system&quot;;  &#160;&#160;&#160;&#160; // Load user data &#160;&#160;&#160;&#160; var users = getUsers();  &#160;&#160;&#160;&#160; // Populate user list with data &#160;&#160;&#160;&#160; Fit.Array.ForEach(users, function(userData) &#160;&#160;&#160;&#160; { &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; var user = tpl.Content.Users.AddItem(); &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; user.Name = userData.Name; &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; user.Role = userData.Role; &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; user.Email = userData.Email; &#160;&#160;&#160;&#160; });  &#160;&#160;&#160;&#160; // Push changes to DOM &#160;&#160;&#160;&#160; tpl.Update(); }); tpl.Render(document.getElementById(&quot;UserList&quot;));  // HTML template example (UserListView.html)  &lt;h1&gt;{[Title]}&lt;/h1&gt; &lt;p&gt;{[Description]}&lt;/p&gt; &lt;table&gt; &#160;&#160;&#160;&#160; &lt;tr&gt; &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;User ID&lt;/b&gt;&lt;/td&gt; &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;Name&lt;/b&gt;&lt;/td&gt; &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;E-mail&lt;/b&gt;&lt;/td&gt; &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;Department&lt;/b&gt;&lt;/td&gt; &#160;&#160;&#160;&#160; &lt;/tr&gt; &#160;&#160;&#160;&#160; &lt;!-- LIST Users --&gt; &#160;&#160;&#160;&#160; &lt;tr&gt; &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;{[Name]}&lt;/td&gt; &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;{[Role]}&lt;/td&gt; &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;{[Email]}&lt;/td&gt; &#160;&#160;&#160;&#160; &lt;/tr&gt; &#160;&#160;&#160;&#160; &lt;!-- /LIST Users --&gt; &lt;/table&gt;
	* @class [Fit.Template Template]
	*/
	class Template
	{
		// Properties defined by Fit.Template
		/**
		* Once template is loaded, any placeholder or list will be accessible through the Content property. A placeholder identified as UserRole will be accessible as templateInstance.Content.UserRole. UserRole is an object that can be set with either a string or a DOMElement. A list identified as Users is accessible using templateInstance.Content.Users. See Fit.Template.List for additional information.
		* @member [object Content]
		*/
		Content:any;
		/**
		* Add event handler to element within template given by element ID - event handler ID is returned
		* @function AddEventHandler
		* @param {string} elmId Element ID
		* @param {string} eventType Event type (e.g. &quot;click&quot; or &quot;mouseover&quot;)
		* @param {function} cb Event handler function which takes event argument
		* @returns number
		*/
		public AddEventHandler(elmId:string, eventType:string, cb:Function):number;
		/**
		* Get HTML from template including any changes made
		* @function GetHtml
		* @returns string
		*/
		public GetHtml():string;
		/**
		* Load HTML string into template
		* @function LoadHtml
		* @param {string} htmlSource HTML string
		*/
		public LoadHtml(htmlSource:string):void;
		/**
		* Load HTML from URL asynchronously
		* @function LoadUrl
		* @param {string} url URL to HTML template
		* @param {function} cb Callback function invoked once HTML template has been loaded. Template instance and raw HTML data is passed to function. At this point placeholders and lists are accessible from the Content propery.
		*/
		public LoadUrl(url:string, cb:Function):void;
		/**
		* Remove event handler by event ID returned by AddEventHandler(..)
		* @function RemoveEventHandler
		* @param {integer} eventId Event ID
		*/
		public RemoveEventHandler(eventId:number):void;
		/**
		* Render template, either inline or to element specified
		* @function Render
		* @param {DOMElement} [toElement=undefined] If defined, template is rendered to this element
		*/
		public Render(toElement?:HTMLElement):void;
		/**
		* Constructor - creates instance of Template class
		* @function Template
		* @param {boolean} [refreshable=false] Flag indicating whether template can be updated after being rendered to DOM. A value of True results in template being wrapped in a div container controlled by the templating system.
		*/
		constructor(refreshable?:boolean);
		/**
		* Push changes to DOM to make them visible through the user interface
		* @function Update
		*/
		public Update():void;
		public static List : typeof __FitInternals.FitTemplateList;
	}
	/**
	* Validation logic
	* @class [Fit.Validation Validation]
	*/
	class Validation
	{
		// Properties defined by Fit.Validation
		/**
		* Set or get flag indicating whether type checking should take place (DebugMode)
		* @function Enabled
		* @param {boolean} val True enables DebugMode, False disables DebugMode
		*/
		public static Enabled(val:boolean):void;
		/**
		* Throws error if passed object is not an instance of Array
		* @function ExpectArray
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectArray(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a boolean
		* @function ExpectBoolean
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectBoolean(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a collection that can be iterated
		* @function ExpectCollection
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectCollection(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Comment
		* @function ExpectCommentNode
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectCommentNode(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Date
		* @function ExpectDate
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectDate(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Element
		* @function ExpectElementNode
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectElementNode(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Event
		* @function ExpectEvent
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectEvent(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of EventTarget
		* @function ExpectEventTarget
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectEventTarget(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a valid function
		* @function ExpectFunction
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectFunction(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of specified type
		* @function ExpectInstance
		* @param {object} val Object to validate
		* @param {object} instanceType Instance type (constructor, e.g. Fit.Http.Request)
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectInstance(val:any, instanceType:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Array contaning only instances of specified type. Example: Fit.Validation.ExpectInstanceArray(arr, Fit.Controls.TreeView.Node)
		* @function ExpectInstanceArray
		* @param {object} val Object to validate
		* @param {object} instanceType Instance type (constructor, e.g. Fit.Http.Request)
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectInstanceArray(val:any, instanceType:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an integer
		* @function ExpectInteger
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectInteger(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is either Null or Undefined
		* @function ExpectIsSet
		* @param {object} val Object to validate
		*/
		public static ExpectIsSet(val:any):void;
		/**
		* Throws error if passed object is not an instance of Element, Text, or Comment
		* @function ExpectNode
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectNode(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a number
		* @function ExpectNumber
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectNumber(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of RegExp
		* @function ExpectRegExp
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectRegExp(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not a string
		* @function ExpectString
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectString(val:any, allowNotSet?:boolean):void;
		/**
		* Same as Fit.Validation.ExpectString(..), but string must contain an actual value if set (not be empty)
		* @function ExpectStringValue
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectStringValue(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Text
		* @function ExpectTextNode
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectTextNode(val:any, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Array contaning only objects/values of type given by validation callback. Example: Fit.Validation.ExpectTypeArray(arr, Fit.Validation.ExpectString)
		* @function ExpectTypeArray
		* @param {object} val Object to validate
		* @param {function} typeValCallback Value validation callback
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectTypeArray(val:any, typeValCallback:Function, allowNotSet?:boolean):void;
		/**
		* Throws error if passed object is not an instance of Window
		* @function ExpectWindow
		* @param {object} val Object to validate
		* @param {boolean} [allowNotSet=false] Set True to allow object to be Null or Undefined
		*/
		public static ExpectWindow(val:any, allowNotSet?:boolean):void;
		/**
		* Returns True if specified object is set (not Null or Undefined), otherwise False
		* @function IsSet
		* @param {object} val Object to validate
		*/
		public static IsSet(val:any):void;
		/**
		* Throw error and provide stack trace to browser console
		* @function ThrowError
		* @param {object} msg Object to validate
		*/
		public static ThrowError(msg:any):void;
	}
}

declare module "fit-ui"
{
	export = Fit;
}
