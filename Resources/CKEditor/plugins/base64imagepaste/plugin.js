// Written by Jimmy Thomsen for CKEditor in Fit.UI (https://fitui.org/), licensed under LGPL

(function ()
{
    CKEDITOR.plugins.add("base64imagepaste",
	{
        init: function(editor)
		{
			var cfg = {
				storage: editor.config.base64imagepaste && editor.config.base64imagepaste.storage || "base64",
				onImageAdded: editor.config.base64imagepaste && editor.config.base64imagepaste.onImageAdded || null
			};

			if (window.FileReader) // Only register feature on supported browsers
			{
				if (editor.addFeature({ allowedContent: "img[src]" })) // Only register feature if <img src=".."> is allowed (false is returned if not due to content restrictions)
				{
					editor.on("contentDom", function()
					{
						var editorElement = editor.editable ? editor.editable() : editor.document;
						editorElement.on("paste", function(event) // Notice: CKEditor's OnPaste implementation is extremely slow with large images in Chrome - bug filed here: https://github.com/ckeditor/ckeditor4/issues/4807
						{
							var clipboardEvent = event.data.$;
							var clipboardData = clipboardEvent.clipboardData;

							if (!clipboardData)
							{
								return;
							}

							// Skip handling of image blobs when mixed content (text and images) is received. In this case
							// images are represented both as <img> tags and (sometimes) as image blobs, resulting in images
							// being inserted twice. Image blobs are contained in clipboardData.files while image tags are
							// contained in clipboardData.items.
							// Copying an image from a web page results in clipboardData containing both an image blob and
							// an <img> tag with an external image URL.
							// Copying both text and images from a web page (at least in Chrome 99) results in an empty files
							// collection, while text and images are contained as text and <img> tags in the items collection.
							// Copying text and/or images from Word results in files collection containing image blobs,
							// as well as text and images being represented in the items collection, where images are
							// represented as <img> tags with image data encoded as base64 (inline images).
							// Therefore, skipping handling of file data when receiving mixed content, will not cause problems.
							// We will simply get references to external image URLs or base64 images instead. Insertion of images
							// as base64 is also what older browsers does.
							if (clipboardData.files && clipboardData.files.length !== clipboardData.items.length)
							{
								return; // Skip image blob handling - let browser insert text content
							}

							var imageType = /^image/;
							var items = clipboardData.files || clipboardData.items;

							for (var i = 0 ; i < items.length ; i++)
							{
								var type = items[i].type; // Defined for objects from both clipboardData.files and clipboardData.items

								if (imageType.test(type) === true)
								{
									var insertImage = function(type, imageUrl, blob)
									{
										var img = editor.document.createElement("img",
										{
											attributes:
											{
												src: imageUrl
											}
										});

										editor.insertElement(img);

										if (cfg.onImageAdded)
										{
											cfg.onImageAdded({
												type: type,
												image: img.$,
												url: imageUrl,
												blob: blob
											});
										}
									};

									var file = items[i].getAsFile && items[i].getAsFile() || items[i]; // Items from clipboardData.items relies on getAsFile() to retrieve blobs while items from clipboardData.files are already blobs

									if (URL.createObjectURL && cfg.storage === "blob") // Browsers supporting blob storage
									{
										var imageUrl = URL.createObjectURL(file); // WARNING: Images remain in blob storage until page is reloaded, closed, or until URL.revokeObjectURL(imageUrl) is invoked! Use onImageAdded callback to keep track of image blobs so they can be disposed when no longer needed!
										insertImage("blob", imageUrl, file);
									}
									else // Use base64 encoding rather than blob storage
									{
										// WARNING: Using base64 encoded images can seriously hurt performance when using large images,
										// especially if retrieving editor value from CKEditor on every key stroke (e.g. from an OnChange event handler).

										var reader = new FileReader();
										reader.onload = function(ev)
										{
											var imageUrl = ev.target.result;
											insertImage("base64", imageUrl, file);
										};
										reader.readAsDataURL(file);
									}
								}
							}
						}, null, { editor: editor });
					});
				}
			}
		}
    });
})();