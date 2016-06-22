/// <container name="Fit.Controls.FilePicker">
/// 	Control allowing for files to be selected locally and uploaded asynchronously.
/// 	Extending from Fit.Controls.ControlBase.
/// </container>

// http://fiddle.jshell.net/gho7Lmno/84/

/// <function container="Fit.Controls.FilePicker" name="FilePicker" access="public">
/// 	<description> Create instance of FilePicker control </description>
/// 	<param name="ctlId" type="string"> Unique control ID </param>
/// </function>
Fit.Controls.FilePicker = function(ctlId)
{
	Fit.Validation.ExpectStringValue(ctlId);
	Fit.Core.Extend(this, Fit.Controls.ControlBase).Apply(ctlId);

	var me = this;
	var button = null;
	var input = null;
	var width = { Value: -1, Unit: "px" }; // Differs from default value on ControlBase which is 200px - here a value of -1 indicates width:auto
	var url = null;
	var files = [];
	var inputs = []; // Legacy control - contains input controls when legacy mode is enabled (IE9 and older)

	var onUploadHandlers = [];
	var onProgressHandlers = [];
	var onSuccessHandlers = [];
	var onFailureHandlers = [];
	var onCompletedHandlers = [];
	//var onAbortHandlers = [];

	function init()
	{
		createUploadField();

		if (inputs.length === 0) // Modern control
		{
			button = new Fit.Controls.Button("Button" + me.GetId());
			button.Title(Fit.Language.Translations.SelectFile);
			button.Icon("upload"); // files-o
			button.OnClick(function(sender) { input.click(); }); // Make sure Enter/Spacebar opens file dialog

			// Add file picker to button
			Fit.Dom.Add(button.GetDomElement(), input);
			me._internal.AddDomElement(button.GetDomElement());
		}

		me.AddCssClass("FitUiControlFilePicker");
		me.Width(-1); // Set width:auto - ControlBase uses width:200px by default
		me.Enabled(true);

		me._internal.Data("legacy", (inputs.length > 0).toString());
	}

	function createUploadField()
	{
		var inp = document.createElement("input");
		inp.type = "file";
		inp.onchange = function(e) // e may be null if called programmatically from FilePicker.Clear()
		{
			// The modern control clears any previously selected files when a new selection is made.
			// The legacy control consists of multiple single picker controls, so it has to keep
			// previously selected files. This adds a bit more complexity to the legacy control since
			// we need to preserve some state information between every time OnChange is fired
			// and if Upload is called multiple times.

			if (inputs.length === 0) // Modern control
			{
				files = [];

				// Add selected files to internal collection
				Fit.Array.ForEach(inp.files, function(file)
				{
					Fit.Array.Add(files, { Filename: file.name, Type: file.type, Size: file.size, Id: Fit.Data.CreateGuid(), Processed: false, Input: inp, FileObject: file, GetImagePreview: function() { return getImagePreview(file); }, ServerResponse: null });
				});
			}
			else // Legacy control
			{
				files = [];

				// Add selected files to internal collection

				Fit.Array.ForEach(Fit.Array.Copy(inputs), function(i)
				{
					// Remove empty input fields

					if (i.value === "")
					{
						if (me.MultiSelectionMode() === true) // Remove empty upload controls in Multi Selection Mode
						{
							Fit.Dom.Remove(i);
							Fit.Array.Remove(inputs, i);
						}

						return; // Skip file picker, no file selected
					}

					// file has been selected, create file information object

					var file = null;

					// Some files may have been uploaded earlier (e.g. if AutoPostBack is enabled or if user
					// selects 3 files, triggers upload, selects another 5 files, and triggers upload again).
					// Make sure file information is preserved for files already processed.

					if (me.MultiSelectionMode() === true && i._file !== undefined && i._file.Processed === true)
					{
						file = i._file;
					}
					else
					{
						file = { Filename: i.value, Type: "Unknown", Size: -1, Id: Fit.Data.CreateGuid(), Processed: false, Input: i, FileObject: null, GetImagePreview: function() { return null; }, ServerResponse: null };
					}

					i._file = file;

					// Add file information

					Fit.Array.Add(files, file);
				});

				// Make sure an empty upload control is always available in Multi Selection Mode, allowing for another file to be added
				if (me.MultiSelectionMode() === true)
					createUploadField();
			}

			me._internal.FireOnChange();

			if (me.AutoPostBack() === true)
				me.Upload();
		}

		if (inp.files && !Fit.Controls.FilePicker.ForceLegacyMode) // Modern control
		{
			input = inp;
			input.tabIndex = -1;

			Fit.Events.AddHandler(input, "click", function(e)
			{
				// Do not trigger OnClick on button containing file picker.
				// It will cause file picker to open file dialog twice.
				Fit.Events.StopPropagation(e);
			});
		}
		else // Legacy control
		{
			inp.name = "SelectedFile";

			Fit.Array.Add(inputs, inp);
			me._internal.AddDomElement(inp);
		}
	}

	// ============================================
	// Public - overrides
	// ============================================

	// See documentation on ControlBase
	this.Focused = function(focus)
	{
		Fit.Validation.ExpectBoolean(focus, true);

		if (Fit.Validation.IsSet(focus) === true)
		{
			if (inputs.length === 0) // Modern control
			{
				if (focus === true)
					input.focus();
				else
					input.blur();
			}
			else // Legacy control
			{
				if (focus === true)
					inputs[0].focus();
				else
					inputs[0].blur();
			}
		}

		return (document.activeElement === input);
	}

	// See documentation on ControlBase
	this.Value = function(val)
	{
		Fit.Validation.ExpectString(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			Fit.Validation.ThrowError("SecurityError: Due to security restrictions, the value of an upload control cannot be set");
		}

		var strFiles = "";

		Fit.Array.ForEach(files, function(file)
		{
			strFiles += ((strFiles !== "") ? ";" : "") + file.Filename;
		});

		return strFiles;
	}

	// See documentation on ControlBase
	this.IsDirty = function()
	{
		return (files.length > 0);
	}

	// See documentation on ControlBase
	this.Clear = function()
	{
		if (files.length === 0)
			return;

		if (inputs.length === 0) // Modern control
		{
			input.value = "";
			input.onchange(null);
		}
		else // Legacy control
		{
			// Remove all file pickers in Legacy Mode - clearing them is not possible in Legacy IE
			Fit.Array.ForEach(Fit.Array.Copy(inputs), function(i)
			{
				Fit.Dom.Remove(i);
				Fit.Array.Remove(inputs, i);
			});

			createUploadField();
			inputs[0].onchange(null);
		}
	}

	// See documentation on ControlBase
	this.Dispose = Fit.Core.CreateOverride(this.Dispose, function()
	{
		// This will destroy control - it will no longer work!

		me = button = input = width = url = files = inputs = onUploadHandlers = onProgressHandlers = onSuccessHandlers = onFailureHandlers = onCompletedHandlers = null; // onAbortHandlers
		base();
	});

	/// <function container="Fit.Controls.FilePicker" name="Width" access="public" returns="object">
	/// 	<description>
	/// 		Fit.Controls.ControlBase.Width override:
	/// 		Get/set control width - returns object with Value and Unit properties.
	/// 		This implementation differs from ControlBase.Width as passing a value of -1 resets
	/// 		the control width to fit its content, rather than assuming a fixed default width.
	/// 	</description>
	/// 	<param name="val" type="number" default="undefined"> If defined, control width is updated to specified value. A value of -1 resets control width. </param>
	/// 	<param name="unit" type="string" default="px"> If defined, control width is updated to specified CSS unit </param>
	/// </function>
	this.Width = Fit.Core.CreateOverride(this.Width, function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			if (val > -1) // Fixed width
			{
				width = base(val, unit);

				if (inputs.length === 0)
					button.Width(100, "%");
			}
			else // Adjust width to content size
			{
				width = { Value: -1, Unit: "px" }; // Any changes to this line must be dublicated to line declaring the width variable !
				me.GetDomElement().style.width = "auto";

				if (inputs.length === 0)
					button.Width(-1);
			}
		}

		return width;
	});

	// See documentation on ControlBase
	this.Height = Fit.Core.CreateOverride(this.Height, function(val, unit)
	{
		Fit.Validation.ExpectNumber(val, true);
		Fit.Validation.ExpectStringValue(unit, true);

		if (Fit.Validation.IsSet(val) === true && inputs.length === 0) // Modern control - not supported in Legacy Mode
		{
			base(val, unit);

			if (val > -1) // Fixed height
				button.Height(100, "%");
			else // Adjust height to content size
				button.Height(-1);
		}

		return base();
	});

	// ============================================
	// Public
	// ============================================

	/// <function container="Fit.Controls.FilePicker" name="Url" access="public" returns="string">
	/// 	<description>
	/// 		Get/set URL to which files are uploaded when FilePicker.Upload() is called.
	/// 		Multiple files will be uploaded using POST over individual HTTP connections,
	/// 		and each file will be accessible from the POST data collection using the SelectedFile key.
	/// 	</description>
	/// 	<param name="url" type="string" default="undefined"> If defined, upload URL is set to specified value </param>
	/// </function>
	this.Url = function(val)
	{
		Fit.Validation.ExpectStringValue(val, true)

		if (Fit.Validation.IsSet(val) === true)
		{
			url = val;
		}

		return url;
	}

	/// <function container="Fit.Controls.FilePicker" name="Title" access="public" returns="string">
	/// 	<description> Get/set file picker title </description>
	/// 	<param name="val" type="string" default="undefined"> If defined, file picker title is set to specified value </param>
	/// </function>
	this.Title = function(val)
	{
		Fit.Validation.ExpectString(val, true)

		if (button === null)
			return ""; // Legacy mode

		if (Fit.Validation.IsSet(val) === true)
		{
			button.Title(val);
			Fit.Dom.Add(button.GetDomElement(), input);
		}

		return button.Title();
	}

	/// <function container="Fit.Controls.FilePicker" name="GetFiles" access="public" returns="object[]">
	/// 	<description>
	/// 		Get collection of selected files. Each file is represented as an object with the following members:
	/// 		 - Filename:string (Name of selected file)
	/// 		 - Type:string (Mime type for selected file)
	/// 		 - Size:integer (File size in bytes)
	/// 		 - Id:string (Unique file ID)
	/// 		 - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
	/// 		 - Input:HTMLInputElement (Input control used as file picker)
	/// 		 - FileObject:File (Native JS File object representing selected file)
	/// 		 - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
	/// 		NOTICE: The following properties/functions are not available in Legacy Mode: Type, Size, FileObject, GetImagePreview().
	/// 	</description>
	/// </function>
	this.GetFiles = function()
	{
		return files;
	}

	/// <function container="Fit.Controls.FilePicker" name="MultiSelectionMode" access="public" returns="boolean">
	/// 	<description> Get/set flag indicating whether control allows for multiple selections </description>
	/// 	<param name="val" type="boolean" default="undefined"> If defined, True enables multi selection mode, False disables it </param>
	/// </function>
	this.MultiSelectionMode = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true)

		if (Fit.Validation.IsSet(val) === true)
		{
			if (inputs.length === 0) // Modern control
			{
				if (val === true && me.MultiSelectionMode() === false)
				{
					input.multiple = "multiple";

					// Change title unless a custom title has been set
					if (me.Title() === Fit.Language.Translations.SelectFile)
						me.Title(Fit.Language.Translations.SelectFiles);
				}
				else if (val === false && me.MultiSelectionMode() === true)
				{
					if (files.length > 1)
						me.Clear();

					input.multiple = "";

					// Change title unless a custom title has been set
					if (me.Title() === Fit.Language.Translations.SelectFiles)
						me.Title(Fit.Language.Translations.SelectFile);
				}
			}
			else // Legacy control
			{
				me.Clear();
			}

			me._internal.Data("multiple", val.toString());
		}

		return (me._internal.Data("multiple") === "true");
	}

	/// <function container="Fit.Controls.FilePicker" name="Enabled" access="public" returns="boolean">
	/// 	<description> Get/set value indicating whether control is enabled or not </description>
	/// 	<param name="val" type="boolean" default="undefined"> If specified, True enables control, False disables it </param>
	/// </function>
	this.Enabled = function(val)
	{
		Fit.Validation.ExpectBoolean(val, true);

		if (Fit.Validation.IsSet(val) === true)
		{
			me._internal.Data("enabled", val.toString());

			if (inputs.length === 0) // Modern control
			{
				input.disabled = !val;
				button.Enabled(val);
			}
			else // Legacy control
			{
				Fit.Array.ForEach(inputs, function(inp)
				{
					inp.disabled = !val;

					if (me.MultiSelectionMode() === true && val === true && inp._file !== undefined && inp._file.Processed === true) // Input controls previously uploaded should remain disabled
						inp.disabled = true;
				})
			}
		}

		return (me._internal.Data("enabled") === "true");
	}

	/// <function container="Fit.Controls.FilePicker" name="IsLegacyModeEnabled" access="public" returns="boolean">
	/// 	<description> Get value indicating whether control is in legacy mode (old fashion upload control) </description>
	/// </function>
	this.IsLegacyModeEnabled = function()
	{
		return (inputs.length > 0);
	}

	/// <function container="Fit.Controls.FilePicker" name="Upload" access="public">
	/// 	<description>
	/// 		Upload selected files. Each file will be uploaded using POST over individual HTTP connections,
	/// 		and each file will be accessible from the POST data collection using the SelectedFile key.
	/// 		Use the OnProgress event to monitor the upload process, or use the OnCompleted event
	/// 		to be notified when all files have been fully processed.
	/// 	</description>
	/// 	<param name="skip" type="string[]" default="undefined">
	/// 		Optional argument allowing some of the selected files to be skipped during
	/// 		upload. The argument is a string array with the names of the files to skip.
	/// 	</param>
	/// </function>
	this.Upload = function(skip)
	{
		Fit.Validation.ExpectTypeArray(skip, Fit.Validation.ExpectStringValue, true);

		if (url === null)
			Fit.Validation.ThrowError("Unable to upload file(s), no URL has been specified");

		if (me.Enabled() === false) // Legacy control cannot upload data when disabled - this ensures consistency
			return;

		var filesToUpload = [];

		Fit.Array.ForEach(files, function(file)
		{
			if (Fit.Validation.IsSet(skip) === false || Fit.Array.Contains(skip, file.Filename) === false)
			{
				if (file.Processed === true) // Skip previously uploaded files
					return;

				Fit.Array.Add(filesToUpload, file);
			}
		});

		if (filesToUpload.length === 0)
			return;

		if (fireEvent(onUploadHandlers) === false)
			return;

		var completed = [];

		Fit.Array.ForEach(filesToUpload, function(file)
		{
			file.Processed = true;

			if (inputs.length === 0) // Modern control
			{
				var data = new FormData();
				data.append("SelectedFile", file.FileObject);

				var req = new XMLHttpRequest();
				Fit.Events.AddHandler(req.upload, "progress", function(e)
				{
					var ev = Fit.Events.GetEvent(e);
					fireEvent(onProgressHandlers, file, ((ev.loaded > 0 && ev.total > 0) ? Math.floor((ev.loaded / ev.total) * 100) : 0));
				});
				Fit.Events.AddHandler(req, "readystatechange", function(e)
				{
					// Using readystatechange rather than req.upload.onload (success) and req.upload.onerror (failure).
					// Server response is not available when req.upload.onload fires: Fit.Events.AddHandler(req.upload, "load", function(e) { /*..*/ });
					// OnError only fires when network communication fails (e.g. network unplugged or server process is restarted), not when an error
					// occur server side (500 Internal Server Error). Using readystatechange we can catch both communication and server errors.

					if (req.readyState === 4)
					{
						if (req.status === 200) // Success
						{
							file.ServerResponse = req.responseText;

							Fit.Array.Add(completed, file);
							fireEvent(onSuccessHandlers, file);
						}
						else // Failure
						{
							Fit.Array.Add(completed, file);
							fireEvent(onFailureHandlers, file);
						}

						if (completed.length === filesToUpload.length)
							fireEvent(onCompletedHandlers);
					}
				});
				/*Fit.Events.AddHandler(req.upload, "abort", function(e)
				{
					fireEvent(onAbortHandlers, file);
				});*/

				req.open("POST", url);
				req.send(data);
			}
			else // Legacy control
			{
				var enforcedOnModernBrowser = (Fit.Browser.GetInfo().Name !== "MSIE" || Fit.Browser.GetInfo().Version > 8);

				var picker = file.Input;

				var iFrame = null;
				var form = null;

				var progress = 0;
				var interval = null;

				// Create hidden iFrame used to upload current file asynchronously

				iFrame = document.createElement("iframe");
				iFrame.name = "iFrame" + Fit.Data.CreateGuid();
				iFrame.style.display = "none";

				if (enforcedOnModernBrowser === true)
				{
					// When Legacy Mode is enforced in modern browsers, the OnLoad handler MUST be registered
					// AFTER rooting iFrame in DOM, to prevent WebKit/Chrome from firing OnLoad multiple times.
					Fit.Dom.InsertAfter(picker, iFrame);
				}

				Fit.Events.AddHandler(iFrame, "load", function(e)
				{
					// Read server response

					try // Will throw an error if uploading to foreign domain, in which case ServerResponse will remain Null
					{
						file.ServerResponse = iFrame.contentDocument.body.innerHTML;
					}
					catch (err)
					{
						Fit.Browser.Log("Unable to read server response, most likely due to violation of Same-Origin Policy");
					}

					// Clean up

					Fit.Dom.Remove(iFrame);
					clearInterval(interval);

					// Fire events

					Fit.Array.Add(completed, file);

					fireEvent(onProgressHandlers, file, 100);
					fireEvent(onSuccessHandlers, file);

					if (completed.length === filesToUpload.length)
						fireEvent(onCompletedHandlers);
				});

				if (enforcedOnModernBrowser === false)
				{
					// On IE8 the OnLoad handler MUST be registered BEFORE
					// rooting iFrame in DOM, otherwise it will not be fired.
					Fit.Dom.InsertAfter(picker, iFrame);
				}

				// Create form used to upload current file - data is posted to hidden iFrame created above

				form = document.createElement("form");
				form.action = url;
				form.method = "POST";
				form.setAttribute("enctype", "multipart/form-data"); // Must be registered using setAttribute() for upload to work in IE8 //form.enctype="multipart/form-data";
				form.target = iFrame.name;

				// Add form to page, and file picker to form.
				// Having multiple forms on the same page might break apps expecting only one form element, so it is
				// immediately removed from page once submitted, and picker is returned to its prior location in the DOM.
				Fit.Dom.InsertAfter(picker, form);
				form.appendChild(picker);

				// Post data - start file upload
				form.submit();

				// Immediately remove form element after submit, as it might confuse apps expecting
				// only one form element on page. Picker is returned to its prior location in the DOM.
				Fit.Dom.InsertBefore(iFrame, picker);
				Fit.Dom.Remove(form);

				// Simulate progress in legacy mode which does not support the progress event

				interval = setInterval(function()
				{
					progress = progress + 5;
					fireEvent(onProgressHandlers, file, progress);

					if (progress === 90) // Halt progress on 90% and wait for file to fully complete
						clearInterval(interval);

				}, 1000);

				if (me.MultiSelectionMode() === true)
					picker.disabled = true;
			}
		});
	}

	function getImagePreview(file) // file is an instance of File (native JS object type) - returns Image instance if preview can be created, otherwise Null
	{
		if (inputs.length > 0)
			return null; // Legacy control

		if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/svg" || file.type === "image/gif")
		{
			var img = new Image();

			setTimeout(function() // Postpone to allow external code to register an onload handler on the image, which should be registered before assigning image source (src)
			{
				var fr = new FileReader();
				fr.onload = function(e)
				{
					var ev = Fit.Events.GetEvent(e);
					img.src = ev.target.result;
				}
				fr.readAsDataURL(file);
			}, 0);

			return img;
		}

		return null;
	}

	function fireEvent(handlers, file, progress)
	{
		var canceled = false;

		Fit.Array.ForEach(handlers, function(cb)
		{
			if (Fit.Validation.IsSet(file) === true) // OnSuccess/OnFailure/OnProcess
			{
				var eventArgs = file;
				eventArgs.Progress = 100;

				if (Fit.Validation.IsSet(progress) === true)
					eventArgs.Progress = progress;

				if (cb(me, eventArgs) === false)
					canceled = true;
			}
			else // OnUpload/OnCompleted
			{
				if (cb(me) === false)
					canceled = true;
			}
		});

		return !canceled;
	}

	// ============================================
	// Events
	// ============================================

	/// <function container="Fit.Controls.FilePicker" name="OnUpload" access="public">
	/// 	<description>
	/// 		Add event handler fired when upload is started.
	/// 		Operation can be canceled by returning False.
	/// 		Function receives one argument: Sender (Fit.Controls.FilePicker).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnUpload = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onUploadHandlers, cb);
	}

	/// <function container="Fit.Controls.FilePicker" name="OnProgress" access="public">
	/// 	<description>
	/// 		Add event handler fired when the upload process for a given file is progressing.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.FlePicker) and EventArgs object.
	/// 		EventArgs object contains the following members:
	/// 		 - Filename:string (Name of given file)
	/// 		 - Type:string (Mime type for given file)
	/// 		 - Size:integer (File size in bytes)
	/// 		 - Id:string (Unique file ID)
	/// 		 - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
	/// 		 - Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded)
	/// 		 - Input:HTMLInputElement (Input control used as file picker)
	/// 		 - FileObject:File (Native JS File object representing given file)
	/// 		 - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
	/// 		Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this
	/// 		case will be Null. GetImagePreview() will also return Null in Legacy Mode.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnProgress = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onProgressHandlers, cb);
	}

	/// <function container="Fit.Controls.FilePicker" name="OnSuccess" access="public">
	/// 	<description>
	/// 		Add event handler fired when a file has successfully been uploaded.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.FlePicker) and EventArgs object.
	/// 		EventArgs object contains the following members:
	/// 		 - Filename:string (Name of given file)
	/// 		 - Type:string (Mime type for given file)
	/// 		 - Size:integer (File size in bytes)
	/// 		 - Id:string (Unique file ID)
	/// 		 - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
	/// 		 - Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded)
	/// 		 - Input:HTMLInputElement (Input control used as file picker)
	/// 		 - FileObject:File (Native JS File object representing given file)
	/// 		 - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
	/// 		 - ServerResponse:string (Contains the response received from the server after a successful upload)
	/// 		Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this
	/// 		case will be Null. GetImagePreview() will also return Null in Legacy Mode.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnSuccess = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onSuccessHandlers, cb);
	}

	/// <function container="Fit.Controls.FilePicker" name="OnFailure" access="public">
	/// 	<description>
	/// 		Add event handler fired for a given file if the upload process failed.
	/// 		Function receives two arguments:
	/// 		Sender (Fit.Controls.FlePicker) and EventArgs object.
	/// 		EventArgs object contains the following members:
	/// 		 - Filename:string (Name of given file)
	/// 		 - Type:string (Mime type for given file)
	/// 		 - Size:integer (File size in bytes)
	/// 		 - Id:string (Unique file ID)
	/// 		 - Processed:boolean (Flag indicating whether file has been uploaded, or is currently being uploaded)
	/// 		 - Progress:integer (A value from 0-100 indicating how many percent of the file has been uploaded)
	/// 		 - Input:HTMLInputElement (Input control used as file picker)
	/// 		 - FileObject:File (Native JS File object representing given file)
	/// 		 - GetImagePreview:function (Returns an HTMLImageElement with a preview for supported file types)
	/// 		Be aware that Type and Size cannot be determined in Legacy Mode, and that FileObject in this
	/// 		case will be Null. GetImagePreview() will also return Null in Legacy Mode.
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnFailure = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onFailureHandlers, cb);
	}

	/// <function container="Fit.Controls.FilePicker" name="OnCompleted" access="public">
	/// 	<description>
	/// 		Add event handler fired when all files selected have been fully processed.
	/// 		Be aware that this event fires even if some files were not uploaded successfully.
	/// 		At this point files returned from GetFiles() contains a ServerResponse:string property
	/// 		containing the response from the server. This property remains Null in case of errors.
	/// 		Function receives one argument: Sender (Fit.Controls.FlePicker).
	/// 	</description>
	/// 	<param name="cb" type="function"> Event handler function </param>
	/// </function>
	this.OnCompleted = function(cb) // Fires when all files have been processed, even if files have failed!
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onCompletedHandlers, cb);
	}

	/*this.OnAbort = function(cb)
	{
		Fit.Validation.ExpectFunction(cb);
		Fit.Array.Add(onAbortHandlers, cb);
	}*/

	init();
}
