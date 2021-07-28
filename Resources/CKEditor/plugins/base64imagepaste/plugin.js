// Written by Jimmy Thomsen for CKEditor in Fit.UI (https://fitui.org/), licensed under LGPL

(function ()
{
    CKEDITOR.plugins.add("base64imagepaste",
	{
        init: function(editor)
		{
			if (window.FileReader) // Only register feature on supported browsers
			{
				if (editor.addFeature({ allowedContent: "img[src]" })) // Only register feature if <img src=".."> is allowed (false is returned if not due to content restrictions)
				{
					editor.on("contentDom", function()
					{
						var editorElement = editor.editable ? editor.editable() : editor.document;
						editorElement.on("paste", function(event)
						{
							var clipboardEvent = event.data.$;
							var clipboardData = clipboardEvent.clipboardData;

							if (!clipboardData)
							{
								return;
							}

							var imageType = /^image/;

							for (var i = 0 ; i < clipboardData.types.length ; i++)
							{
								var type = clipboardData.types[i];

								if ((imageType.test(type) === true || imageType.test(clipboardData.items[i].type) === true) && clipboardData.items[i].getAsFile)
								{
									var file = clipboardData.items[i].getAsFile();
							        var reader = new FileReader();
									reader.onload = function(ev)
									{
										var base64ImageData = ev.target.result;

										var img = editor.document.createElement("img",
										{
											attributes:
											{
												src: base64ImageData
											}
										});

										editor.insertElement(img);
									};
									reader.readAsDataURL(file);

									break;
								}
							}
						}, null, { editor: editor });
					});
				}
			}
		}
    });
})();