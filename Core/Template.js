/// <container name="Fit.Template">
/// 	<![CDATA[
/// 	Templating engine allowing for separation between layout and logic.
///
/// 	// Example code
///
/// 	// Load template (asynchronously)
/// 	var tpl = new Fit.Template(true);
/// 	tpl.LoadUrl(&quot;UserListView.html&quot;, function(sender)
/// 	{
/// 		&#160;&#160;&#160;&#160; // Populate placeholders
/// 		&#160;&#160;&#160;&#160; tpl.Content.Title = &quot;User list&quot;;
/// 		&#160;&#160;&#160;&#160; tpl.Content.Description = &quot;List of users created in system&quot;;
///
/// 		&#160;&#160;&#160;&#160; // Load user data
/// 		&#160;&#160;&#160;&#160; var users = getUsers();
///
/// 		&#160;&#160;&#160;&#160; // Populate user list with data
/// 		&#160;&#160;&#160;&#160; Fit.Array.ForEach(users, function(userData)
/// 		&#160;&#160;&#160;&#160; {
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; var user = tpl.Content.Users.AddItem();
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; user.Name = userData.Name;
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; user.Role = userData.Role;
/// 		&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; user.Email = userData.Email;
/// 		&#160;&#160;&#160;&#160; });
///
/// 		&#160;&#160;&#160;&#160; // Push changes to DOM
/// 		&#160;&#160;&#160;&#160; tpl.Update();
/// 	});
/// 	tpl.Render(document.getElementById("UserList"));
///
/// 	// HTML template example (UserListView.html)
///
/// 	&lt;h1&gt;{[Title]}&lt;/h1&gt;
/// 	&lt;p&gt;{[Description]}&lt;/p&gt;
/// 	&lt;table&gt;
/// 	&#160;&#160;&#160;&#160; &lt;tr&gt;
/// 	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;User ID&lt;/b&gt;&lt;/td&gt;
/// 	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;Name&lt;/b&gt;&lt;/td&gt;
/// 	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;E-mail&lt;/b&gt;&lt;/td&gt;
/// 	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;&lt;b&gt;Department&lt;/b&gt;&lt;/td&gt;
/// 	&#160;&#160;&#160;&#160; &lt;/tr&gt;
/// 	&#160;&#160;&#160;&#160; &lt;!-- LIST Users --&gt;
/// 	&#160;&#160;&#160;&#160; &lt;tr&gt;
/// 	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;{[Name]}&lt;/td&gt;
/// 	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;{[Role]}&lt;/td&gt;
/// 	&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &lt;td&gt;{[Email]}&lt;/td&gt;
/// 	&#160;&#160;&#160;&#160; &lt;/tr&gt;
/// 	&#160;&#160;&#160;&#160; &lt;!-- /LIST Users --&gt;
/// 	&lt;/table&gt;
/// 	]]>
/// </container>

/// <function container="Fit.Template" name="Template" access="public">
/// 	<description> Constructor - creates instance of Template class </description>
/// 	<param name="refreshable" type="boolean" default="false">
/// 		Flag indicating whether template can be updated after being rendered
/// 		to DOM. A value of True results in template being wrapped in a div container
/// 		controlled by the templating system.
/// 	</param>
/// 	<param name="autoDispose" type="boolean" default="true">
/// 		Flag indicating whether Fit.UI controls should be automatically disposed
/// 		when removed from view. Controls are disposed once changes are pushed to
/// 		DOM using the Update() function.
/// 	</param>
/// </function>
Fit.Template = function(refreshable, autoDispose) // http://fiddle.jshell.net/5sb97qtn/28/  --  http://fiddle.jshell.net/3rbq1r13/3/
{
	Fit.Validation.ExpectBoolean(refreshable, true);
	Fit.Validation.ExpectBoolean(autoDispose, true);

	var me = this;
	var allowUnsafe = -1;		// -1 = default behaviour (see code) which may change in the future, 0 = protect against code injection, 1 = allow code injection
	var unsafeWarned = false;
	var htmlContent = "";
	var container = null;
	var pendingElements = [];	// Holds references to all DOMElements to be rendered: { Id:string, Element:DOMElements }
	var nodesRendered = [];		// Holds references to all DOMElements rendered to DOM
	var eventHandlers = []; 	// Holds references to all event handler functions associated with DOM elements: { ElementId:string, EventType:string, Callback:function }
	var controls = [];			// Holds references to all Fit.UI controls (DOMElements) rendered to DOM

	function init()
	{
		if (refreshable === true)
			container = document.createElement("div");
	}

	/// <member container="Fit.Template" name="Content" access="public" type="object">
	/// 	<description>
	/// 		Once template is loaded, any placeholder or list will be accessible
	/// 		through the Content property. A placeholder identified as UserRole
	/// 		will be accessible as templateInstance.Content.UserRole.
	/// 		UserRole is a property that can be set with either a string,
	/// 		an instance of a Fit.UI control, or a DOMElement.
	/// 		A list identified as Users is accessible using
	/// 		templateInstance.Content.Users. See Fit.TemplateList for
	/// 		additional information.
	/// 	</description>
	/// </member>
	this.Content = null;

	/// <function container="Fit.Template" name="LoadHtml" access="public">
	/// 	<description> Load HTML string into template </description>
	/// 	<param name="htmlSource" type="string"> HTML string </param>
	/// </function>
	this.LoadHtml = function(htmlSource)
	{
		Fit.Validation.ExpectString(htmlSource);
		parse(htmlSource);
	}

	/// <function container="Fit.TemplateTypeDefs" name="LoadUrlCallback">
	/// 	<description> Callback invoked when template is loaded </description>
	/// 	<param name="sender" type="Fit.Template"> Instance of Template </param>
	/// 	<param name="html" type="string"> Template's HTML content </param>
	/// </function>

	/// <function container="Fit.Template" name="LoadUrl" access="public">
	/// 	<description> Load HTML from URL asynchronously </description>
	/// 	<param name="url" type="string"> URL to HTML template </param>
	/// 	<param name="cb" type="Fit.TemplateTypeDefs.LoadUrlCallback">
	/// 		Callback function invoked once HTML template has
	/// 		been loaded. Template instance and raw HTML data
	/// 		is passed to function. At this point placeholders
	/// 		and lists are accessible from the Content propery.
	/// 	</param>
	/// </function>
	this.LoadUrl = function(url, cb)
	{
		Fit.Validation.ExpectString(url);
		Fit.Validation.ExpectFunction(cb);

		var r = new Fit.Http.Request(url);
		r.OnSuccess(function(sender)
		{
			parse(r.GetResponseText());
			cb(me, r.GetResponseText());
		});
		r.Start();
	}

	/// <function container="Fit.Template" name="AllowUnsafeContent" access="public" returns="boolean">
	/// 	<description>
	/// 		Get/set flag indicating whether unsafe string values are handled or not.
	/// 		If AllowUnsafeContent is True, arbitrary code can be added to the template
	/// 		and will be intepreted by the browser. If AllowUnsafeContent is False,
	/// 		potentially unsafe code will be encoded and displayed as is without interpretation.
	/// 	</description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, handling of string encoding is changed to reflect value </param>
	/// </function>
	this.AllowUnsafeContent = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			allowUnsafe = (val === true ? 1 : 0);
		}

		return (allowUnsafe !== 0);
	}

	/// <function container="Fit.Template" name="Reset" access="public">
	/// 	<description> Resets template - all data and event handlers are removed. Change is not pushed to DOM automatically. </description>
	/// </function>
	this.Reset = function()
	{
		// Do NOT clear e.g. 'nodesRendered' or 'controls' as they are needed if template is disposed.
		// The purpose of this function is to clear data added externally, not internal state.

		parse(htmlContent); // Re-initializes Content property
		eventHandlers = [];
	}

	/// <function container="Fit.Template" name="Dispose" access="public">
	/// 	<description> Dispose template to free up memory </description>
	/// </function>
	this.Dispose = function()
	{
		if (autoDispose !== false)
		{
			Fit.Array.ForEach(controls, function(controlElm)
			{
				// Dispose control unless manually disposed by external code in which case the _internal property no longer exists
				if (controlElm._internal !== undefined)
				{
					controlElm._internal.Instance.Dispose();
				}
			});
		}

		if (container !== null)
		{
			Fit.Dom.Remove(container);
		}
		else
		{
			Fit.Array.ForEach(nodesRendered, function(node)
			{
				Fit.Dom.Remove(node);
			});
		}

		this.Content = null;
		me = htmlContent = container = pendingElements = nodesRendered = eventHandlers = controls = null;
	}

	/// <function container="Fit.Template" name="GetHtml" access="public" returns="string">
	/// 	<description> Get HTML from template including any changes made </description>
	/// </function>
	this.GetHtml = function()
	{
		return me.toString();
	}

	/// <function container="Fit.Template" name="Render" access="public">
	/// 	<description> Render template, either inline or to element specified </description>
	/// 	<param name="toElement" type="DOMElement" default="undefined"> If defined, template is rendered to this element </param>
	/// </function>
	this.Render = function(toElement)
	{
		Fit.Validation.ExpectDomElement(toElement, true);

		if (nodesRendered.length > 0)
			return; // Skip - already rendered - Update() should be used to push changes!

		// Turn Template into DOM element

		var html = me.toString(); // Also populates 'pendingElements' array containing DOMElements to be added further down
		var dom = Fit.Dom.CreateElement("<div>" + html + "</div>");

		// Inject DOMElements

		Fit.Array.ForEach(pendingElements, function(elm)
		{
			var element = dom.querySelector("var.FitTemplate[id='PH" + elm.Id + "']");

			if (element !== null) // Null if element was added with non-existing placeholder key
			{
				Fit.Dom.Replace(element, elm.Element);
			}

			if (elm.Element._internal !== undefined && elm.Element._internal.Instance !== undefined) // Fit.UI control inheriting from Fit.Controls.Component which is disposable
			{
				Fit.Array.Add(controls, elm.Element);
			}
		});

		Fit.Array.Clear(pendingElements); // No longer needed - do not create new object - it will break references to collection on lists

		// Register event handlers

		Fit.Array.ForEach(eventHandlers, function(ev)
		{
			if (ev === null) // Event handler was removed
				return;

			var elm = dom.querySelector("#" + ev.ElementId);

			if (elm !== null)
				Fit.Events.AddHandler(elm, ev.EventType, ev.Callback);
		});

		// Render to DOM

		var renderTarget = ((container !== null) ? container : toElement);
		var nodes = Fit.Array.Copy(dom.childNodes); // Copy to prevent "Collection was modified" error when rendering elements, which moves them to a new parent

		nodesRendered = [];

		if (Fit.Validation.IsSet(renderTarget) === true)
		{
			Fit.Array.ForEach(nodes, function(n)
			{
				Fit.Dom.Add(renderTarget, n);
				Fit.Array.Add(nodesRendered, n);
			});
		}
		else
		{
			var script = document.scripts[document.scripts.length - 1];

			Fit.Array.ForEach(nodes, function(n)
			{
				Fit.Dom.InsertBefore(script, n);
				Fit.Array.Add(nodesRendered, n);
			});
		}

		if (container !== null)
		{
			if (Fit.Validation.IsSet(toElement) === true)
			{
				Fit.Dom.Add(toElement, container);
			}
			else
			{
				var script = document.scripts[document.scripts.length - 1];
				Fit.Dom.InsertBefore(script, container);
			}
		}
	}

	/// <function container="Fit.Template" name="AddEventHandler" access="public" returns="integer">
	/// 	<description> Add event handler to element within template given by element ID - event handler ID is returned </description>
	/// 	<param name="elmId" type="string"> Element ID </param>
	/// 	<param name="event" type='"keydown" | "keyup" | "keypress"'> Event name without the 'on' prefix </param>
	/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackKeyboard"> JavaScript function to register </param>
	/// </function>
	/// <function container="Fit.Template" name="AddEventHandler" access="public" returns="integer">
	/// 	<description> Add event handler to element within template given by element ID - event handler ID is returned </description>
	/// 	<param name="elmId" type="string"> Element ID </param>
	/// 	<param name="event" type='"click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "mousewheel"'> Event name without the 'on' prefix </param>
	/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackMouse"> JavaScript function to register </param>
	/// </function>
	/// <function container="Fit.Template" name="AddEventHandler" access="public" returns="integer">
	/// 	<description> Add event handler to element within template given by element ID - event handler ID is returned </description>
	/// 	<param name="elmId" type="string"> Element ID </param>
	/// 	<param name="event" type='"popstate"'> Event name without the 'on' prefix </param>
	/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackPopState"> JavaScript function to register </param>
	/// </function>
	/// <function container="Fit.Template" name="AddEventHandler" access="public" returns="integer">
	/// 	<description> Add event handler to element within template given by element ID - event handler ID is returned </description>
	/// 	<param name="elmId" type="string"> Element ID </param>
	/// 	<param name="event" type='"hashchange"'> Event name without the 'on' prefix </param>
	/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackHashChange"> JavaScript function to register </param>
	/// </function>
	/// <function container="Fit.Template" name="AddEventHandler" access="public" returns="integer">
	/// 	<description> Add event handler to element within template given by element ID - event handler ID is returned </description>
	/// 	<param name="elmId" type="string"> Element ID </param>
	/// 	<param name="event" type='"focus" | "focusin" | "focusout" | "blur"'> Event name without the 'on' prefix </param>
	/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackFocus"> JavaScript function to register </param>
	/// </function>
	/// <function container="Fit.Template" name="AddEventHandler" access="public" returns="integer">
	/// 	<description> Add event handler to element within template given by element ID - event handler ID is returned </description>
	/// 	<param name="elmId" type="string"> Element ID </param>
	/// 	<param name="event" type='"beforeunload"'> Event name without the 'on' prefix </param>
	/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackBeforeUnload"> JavaScript function to register </param>
	/// </function>
	/// <function container="Fit.Template" name="AddEventHandler" access="public" returns="integer">
	/// 	<description> Add event handler to element within template given by element ID - event handler ID is returned </description>
	/// 	<param name="elmId" type="string"> Element ID </param>
	/// 	<param name="event" type='"cut" | "copy" | "paste"'> Event name without the 'on' prefix </param>
	/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackClipboard"> JavaScript function to register </param>
	/// </function>
	/// <function container="Fit.Template" name="AddEventHandler" access="public" returns="integer">
	/// 	<description> Add event handler to element within template given by element ID - event handler ID is returned </description>
	/// 	<param name="elmId" type="string"> Element ID </param>
	/// 	<param name="event" type='"#rooted"'> Event name </param>
	/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackRooted"> JavaScript function to register </param>
	/// </function>
	/// <function container="Fit.Template" name="AddEventHandler" access="public" returns="integer">
	/// 	<description> Add event handler to element within template given by element ID - event handler ID is returned </description>
	/// 	<param name="elmId" type="string"> Element ID </param>
	/// 	<param name="event" type="string"> Event name without the 'on' prefix </param>
	/// 	<param name="eventFunction" type="Fit.EventsTypeDefs.EventHandlerCallbackGeneric"> JavaScript function to register </param>
	/// </function>
	this.AddEventHandler = function(elmId, event, eventFunction)
	{
		Fit.Validation.ExpectStringValue(elmId);
		Fit.Validation.ExpectStringValue(event);
		Fit.Validation.ExpectFunction(eventFunction);

		Fit.Array.Add(eventHandlers, { ElementId: elmId, EventType: event, Callback: eventFunction });
		return (eventHandlers.length - 1);
	}

	/// <function container="Fit.Template" name="RemoveEventHandler" access="public">
	/// 	<description> Remove event handler by event ID returned by AddEventHandler(..) </description>
	/// 	<param name="eventId" type="integer"> Event ID </param>
	/// </function>
	this.RemoveEventHandler = function(eventId)
	{
		Fit.Validation.ExpectInteger(eventId);

		if (eventHandlers.length - 1 >= eventId)
			eventHandlers[eventId] = null;
	}

	/// <function container="Fit.Template" name="Update" access="public">
	/// 	<description> Push changes to DOM to make them visible through the user interface </description>
	/// </function>
	this.Update = function()
	{
		if (container === null)
			throw "UpdateTemplateError: Template has not been configured to allow updates";

		// Turn Template into DOM element

		var html = me.toString(); // Also populates 'pendingElements' array containing DOMElements to be added further down
		var dom = Fit.Dom.CreateElement("<div>" + html + "</div>");

		// Inject DOMElements

		var oldControls = controls;
		controls = [];

		Fit.Array.ForEach(pendingElements, function(elm)
		{
			var element = dom.querySelector("var.FitTemplate[id='PH" + elm.Id + "']");

			if (element !== null) // Null if element was added with non-existing placeholder key
			{
				Fit.Dom.Replace(element, elm.Element);
			}

			if (elm.Element._internal !== undefined && elm.Element._internal.Instance !== undefined) // Fit.UI control inheriting from Fit.Controls.Component which is disposable
			{
				Fit.Array.Add(controls, elm.Element);
			}
		});

		Fit.Array.Clear(pendingElements); // No longer needed - do not create new object - it will break references to collection on lists

		// Auto dispose controls previously added to template if now left out

		if (autoDispose !== false)
		{
			Fit.Array.ForEach(oldControls, function(oldControl)
			{
				// Dispose control if no longer found in view, unless manually disposed by external code in which case the _internal property no longer exists
				if (Fit.Array.Contains(controls, oldControl) === false && oldControl._internal !== undefined)
				{
					oldControl._internal.Instance.Dispose();
				}
			});
		}

		// Register event handlers

		Fit.Array.ForEach(eventHandlers, function(ev)
		{
			if (ev === null) // Event handler was removed
				return;

			var elm = dom.querySelector("#" + ev.ElementId);

			if (elm !== null)
				Fit.Events.AddHandler(elm, ev.EventType, ev.Callback);
		});

		// Clear view

		container.innerHTML = "";

		// Render to DOM

		var nodes = Fit.Array.Copy(dom.childNodes); // Copy to prevent "Collection was modified" error when rendering elements, which moves them to a new parent
		nodesRendered = [];

		Fit.Array.ForEach(nodes, function(n)
		{
			Fit.Dom.Add(container, n);
			Fit.Array.Add(nodesRendered, n);
		});
	}

	this.toString = function()
	{
		// Turn populated template into HTML string.
		// DOMElements added to template are added to DOM later - they are temporarily represented using <var> elements.
		// Corresponding, event handlers are registered later when template is rendered to real DOM.

		if (allowUnsafe === -1 && unsafeWarned === false)
		{
			unsafeWarned = true;
			Fit.Browser.Log("WARNING: An instance of Fit.Template allows for unsafe content which could potentially lead to code injection (XSS attacks). The default behaviour for handling unsafe content will change in the future from allowing unsafe content to NOT allowing unsafe content which may break this application. Please explicitely set AllowUnsafeContent(bool) to ensure compatibility with future versions of Fit.UI.");
		}

		var newHtml = htmlContent;
		Fit.Array.Clear(pendingElements); // Do not create new object - it will break references to collection on lists

		Fit.Array.ForEach(me.Content, function(key)
		{
			var obj = me.Content[key];

			if (!obj)
				return;

			if (obj._internal !== undefined && obj._internal.IsFitTemplate === true) // List
			{
				newHtml = newHtml.replace(obj._internal.Block, obj.toString());
			}
			else
			{
				if (Fit.Core.InstanceOf(obj, Fit.Controls.Component) === true) // Fit.UI Control
				{
					var id = Fit.Data.CreateGuid();
					Fit.Array.Add(pendingElements, { Id: id, Element: obj.GetDomElement() });

					newHtml = newHtml.replace("{[" + key + "]}", "<var class='FitTemplate' id='PH" + id + "'></var>");
				}
				else if (typeof(obj) === "object" && (obj instanceof Element || obj instanceof Text)) // DOM
				{
					var id = Fit.Data.CreateGuid();
					Fit.Array.Add(pendingElements, { Id: id, Element: obj });

					// Notice: Placeholders to be replaced by DOM elements should only
					// be declared once - a DOM element cannot be added multiple times!
					// Placeholders for string values can on the other hand be declared multiple times.
					newHtml = newHtml.replace("{[" + key + "]}", "<var class='FitTemplate' id='PH" + id + "'></var>");
				}
				else // String value
				{
					var sVal = (me.AllowUnsafeContent() === true ? obj.toString() : Fit.String.EncodeHtml(obj.toString()));
					newHtml = newHtml.replace(new RegExp("{\\[" + key + "\\]}", "g"), sVal);
				}
			}
		});

		// Remove placeholders that have not been replaced
		newHtml = newHtml.replace(/\{\[(\S+?)\]\}/g, "");

		return newHtml;
	}

	function parse(sourceHtml)
	{
		Fit.Validation.ExpectString(sourceHtml);

		htmlContent = sourceHtml;

		// Parse lists

		var result = {};

		var lists = handleLists(htmlContent);
		Fit.Array.ForEach(lists, function(l)
		{
			result[l] = lists[l];
		});

		// Parse placeholders

		var placeHolders = handlePlaceHolders(htmlContent);
		Fit.Array.ForEach(placeHolders, function(ph)
		{
			result[ph] = placeHolders[ph];
		});

		// Expose lists and placeholders

		me.Content = result;
	}

	function handleLists(html)
	{
		Fit.Validation.ExpectString(html);

		var regEx = /<!-- LIST (\S+) -->[\S\s]*<!-- \/LIST \1 -->/g; // https://regex101.com/r/uL4vM9/2
		var match;

		var res = {};

		while ((match = regEx.exec(html)))
		{
			res[match[1]] = createListObject(match[1], match[0]); // 0 = HTML, 1 = List name
		}

		return res;
	}

	function handlePlaceHolders(html)
	{
		Fit.Validation.ExpectString(html);

		// Remove lists and their associated placeholders.
		// We only want to extract the global placeholders,
		// not the placeholders within lists.

		var regExLists = /<!-- LIST (\S+) -->[\S\s]*<!-- \/LIST \1 -->/g;
		html = html.replace(regExLists, "");

		// Parse global placeholders

		var regEx = /\{\[(\S+?)\]\}/g; // https://regex101.com/r/aM5cV4/1
		var match;
		var res = {};

		while ((match = regEx.exec(html)))
		{
			res[match[1]] = null; // String or DOMNode
		}

		return res;
	}

	function createListObject(name, html)
	{
		Fit.Validation.ExpectString(name);
		Fit.Validation.ExpectString(html);

		// The design of the List object is not ideal.
		// Each time an item is added, the object structure representing
		// that item is parsed from HTML. Caching the parsed item and cloning it
		// the next time AddItem is called will not work since functions
		// on the 'res' object is not cloned - they keep pointing to the original
		// functions, hence they will continue using the orignal 'res' object
		// part of their closure.
		// This can be fixed by referring to 'this' rather than 'res' within the
		// functions, but we also need to "fix" clones which holds a reference to
		// 'pendingElements' on the template instance, and needs to keep this reference
		// rather than having its own copy.
		// Another issue is that the List object depends heavily on
		// functionality on the Template object (e.g. handlePlaceHolders(..)
		// and handleLists(..)). It all works - and works well - but it is a bit
		// difficult to maintain and understand, and could potentially perform better
		// if designed differently, although such performance gain would only be
		// noticable on pretty large and complex applications which is why refactoring
		// is not prioritized at the moment.

		/// <container name="Fit.TemplateList">
		/// 	A template list is a dynamically created object representing
		/// 	a variable number of items containing placeholders. An example
		/// 	could be a list of Users containing information such as Name,
		/// 	Phone number, and E-mail address about each user.
		/// </container>

		var res = { _internal: {} };
		res._internal.Id = name;
		res._internal.Block = html;
		res._internal.Html = html.replace("<!-- LIST " + name + " -->", "").replace("<!-- /LIST " + name + " -->", "");
		res._internal.Items = [];
		res._internal.PendingElements = pendingElements;
		res._internal.IsFitTemplate = true;

		/// <function container="Fit.TemplateList" name="AddItem" access="public" returns="object">
		/// 	<description>
		/// 		Create list item represented by associative object
		/// 		array containing either strings or DOMElements.
		/// 		Example:
		/// 		var item = templateInstance.Content.MyList.AddItem();
		/// 		item[&quot;Name&quot;] = &quot;James Thompson&quot;;
		/// 		item[&quot;Email&quot;] = &quot;james@server.com&quot;;
		/// 		It is also possible to assign data using properties:
		/// 		item.ProfilePicture = document.createElement(&quot;img&quot;);
		/// 		item.ProfilePicture.src = &quot;james.png&quot;;
		/// 	</description>
		/// </function>
		res.AddItem = function()
		{
			var item = handlePlaceHolders(res._internal.Html);

			var nestedLists = handleLists(res._internal.Html);
			Fit.Array.ForEach(nestedLists, function(l)
			{
				item[l] = nestedLists[l];
			});

			Fit.Array.Add(res._internal.Items, item);
			return item;
		}

		/// <function container="Fit.TemplateList" name="GetItems" access="public" returns="object[]">
		/// 	<description> Get all list items added using AddItem() </description>
		/// </function>
		res.GetItems = function()
		{
			return res._internal.Items;
		}

		/// <function container="Fit.TemplateList" name="RemoveItem" access="public">
		/// 	<description> Remove list item (associative object array) </description>
		/// 	<param name="item" type="object"> Item to remove </param>
		/// </function>
		res.RemoveItem = function(item)
		{
			Fit.Array.Remove(res._internal.Items, item);
		}

		/// <function container="Fit.TemplateList" name="Clear" access="public">
		/// 	<description> Clear list </description>
		/// </function>
		res.Clear = function()
		{
			Fit.Array.Clear(res._internal.Items);
		}

		res.toString = function()
		{
			var listHtml = "";

			function populateItem(itemHtml, item)
			{
				Fit.Array.ForEach(item, function(prop)
				{
					var obj = item[prop];

					if (!obj)
						return;

					if (obj._internal !== undefined && obj._internal.IsFitTemplate === true) // Nested list
					{
						var allSubItems = "";

						Fit.Array.ForEach(obj._internal.Items, function(subItem)
						{
							allSubItems += populateItem(obj._internal.Html, subItem);
						});

						itemHtml = itemHtml.replace(obj._internal.Block, allSubItems);
					}
					else if (Fit.Core.InstanceOf(obj, Fit.Controls.Component) === true) // Fit.UI Control
					{
						var id = Fit.Data.CreateGuid();
						Fit.Array.Add(res._internal.PendingElements, { Id: id, Element: obj.GetDomElement() });

						// Notice: Placeholders to be replaced by DOM elements should only
						// be declared once - a DOM element cannot be added multiple times!
						// Theoretically placeholders for string values could be used multiple times, but
						// for the sake of consistency we only replace the first occurrence in this case too.
						itemHtml = itemHtml.replace("{[" + prop + "]}", "<var class='FitTemplate' id='PH" + id + "'></var>");
					}
					else if (typeof(obj) === "object" && (obj instanceof Element || obj instanceof Text)) // DOM
					{
						var id = Fit.Data.CreateGuid();
						Fit.Array.Add(res._internal.PendingElements, { Id: id, Element: obj });

						// Notice: Placeholders to be replaced by DOM elements should only
						// be declared once - a DOM element cannot be added multiple times!
						// Theoretically placeholders for string values could be used multiple times, but
						// for the sake of consistency we only replace the first occurrence in this case too.
						itemHtml = itemHtml.replace("{[" + prop + "]}", "<var class='FitTemplate' id='PH" + id + "'></var>");
					}
					else // String value
					{
						var sVal = (me.AllowUnsafeContent() === true ? obj.toString() : Fit.String.EncodeHtml(obj.toString()));
						itemHtml = itemHtml.replace(new RegExp("{\\[" + prop + "\\]}", "g"), sVal);
					}
				});

				return itemHtml;
			}

			var itmHtml = res._internal.Html;

			Fit.Array.ForEach(res._internal.Items, function(item)
			{
				listHtml += populateItem(itmHtml, item);
			});

			return listHtml;
		}

		return res;
	}

	init();
}
