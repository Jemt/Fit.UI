/*
 * Created by ALL-INKL.COM - Neue Medien Muennich - 04. Feb 2014
 * Licensed under the terms of GPL, LGPL and MPL licenses.
 */

/*
 * Improved by Jimmy Thomsen for CKEditor in Fit.UI (https://fitui.org), licensed under LGPL.
 *  * Improvements to UI (positioning, dimensions, and input experience)
 *  * No longer applying invalid values to vspace, hspace, width, and height when specifying a unit - these are pixel values only
 *  * Added support for em unit for dimensions (width, height, vspace, hspace, and border)
 *  * Better preservation of aspect ratio with support for decimals (% and em)
 *  * Dimensions are now restored if user enters an invalid value, rather than changing them to 0px x 0px
 *  * Made sure image retains a minimum width and height of 10px so the images cannot accidentally become invisible or inaccessible
 */

CKEDITOR.dialog.add("base64imageDialog", function(editor){

	var t = null,
		selectedImg = null,
		orgWidth = null, orgHeight = null, // Dimensions parsed from <img> tag - only used to initially set dimensions in dialog and to calculate imgScal
		prevValidWidth = null, prevValidHeight = null, // Dimensions parsed from <img> tag, or actual image dimensions if not defined in styles. Updated every time dimensions are changed to new valid values. Used to restore dimensions if user enters garbage.
		imgPreview = null, urlCB = null, urlI = null, fileCB = null, imgScal = 1, lock = true;

	/* Check File Reader Support */
	function fileSupport() {
		var r = false, n = null;
		try {
			if(FileReader) {
				var n = document.createElement("input");
				if(n && "files" in n) r = true;
			}
		} catch(e) { r = false; }
		n = null;
		return r;
	}
	var fsupport = fileSupport();

	/* Load preview image */
	function imagePreviewLoad(s) {

		/* no preview */
		if(typeof(s) != "string" || !s) {
			imgPreview.getElement().setHtml("");
			return;
		}

		/* Create image */
		var i = new Image();

		/* Display loading text in preview element */
		imgPreview.getElement().setHtml("Loading...");

		/* When image is loaded */
		i.onload = function() {

			// Use dimensions parsed from styles when dialog was opened, in case we are working with an image already found in the document,
			// or use the image's own dimensions in case the image was just added, or if no styles were defined for the image in the document.
			prevValidWidth = prevValidWidth || this.width.toString();
			prevValidHeight = prevValidHeight || this.height.toString();

			/* Remove preview */
			imgPreview.getElement().setHtml("");

			/* Set attributes */
			if(orgWidth == null || orgHeight == null) {
				t.setValueOf("tab-properties", "width", this.width);
				t.setValueOf("tab-properties", "height", this.height);
				imgScal = 1;
				if(this.height > 0 && this.width > 0) imgScal = this.width / this.height;
				if(imgScal <= 0) imgScal = 1;
			} else {
				orgWidth = null;
				orgHeight = null;
			}
			this.id = editor.id+"previewimage";
			this.setAttribute("style", "max-width:400px;max-height:100px;");
			this.setAttribute("alt", "");

			/* Insert preview image */
			try {
				var p = imgPreview.getElement().$;
				if(p) p.appendChild(this);
			} catch(e) {}

		};

		/* Error Function */
		i.onerror = function(){ imgPreview.getElement().setHtml(""); };
		i.onabort = function(){ imgPreview.getElement().setHtml(""); };

		/* Load image */
		i.src = s;
	}

	/* Change input values and preview image */
	function imagePreview(src){

		/* Remove preview */
		imgPreview.getElement().setHtml("");

		if(src == "base64") {

			/* Disable Checkboxes */
			if(urlCB) urlCB.setValue(false, true);
			if(fileCB) fileCB.setValue(false, true);

		} else if(src == "url") {

			/* Ensable Image URL Checkbox */
			if(urlCB) urlCB.setValue(true, true);
			if(fileCB) fileCB.setValue(false, true);

			/* Load preview image */
			if(urlI) imagePreviewLoad(urlI.getValue());

		} else if(fsupport) {

			/* Ensable Image File Checkbox */
			if(urlCB) urlCB.setValue(false, true);
			if(fileCB) fileCB.setValue(true, true);

			/* Read file and load preview */
			var fileI = t.getContentElement("tab-source", "file");
			var n = null;
			try { n = fileI.getInputElement().$; } catch(e) { n = null; }
			if(n && "files" in n && n.files && n.files.length > 0 && n.files[0]) {
				if("type" in n.files[0] && !n.files[0].type.match("image.*")) return;
				if(!FileReader) return;
				imgPreview.getElement().setHtml("Loading...");
				var fr = new FileReader();
				fr.onload = (function(f) { return function(e) {
					imgPreview.getElement().setHtml("");
					imagePreviewLoad(e.target.result);
				}; })(n.files[0]);
				fr.onerror = function(){ imgPreview.getElement().setHtml(""); };
				fr.onabort = function(){ imgPreview.getElement().setHtml(""); };
				fr.readAsDataURL(n.files[0]);
			}
		}
	};

	function roundWithDecimals(value, decimals) // Logic copied from Fit.UI: https://github.com/Jemt/Fit.UI/blob/51f3a2cd26e3b32d3e1cea83b2e27dc786ce4488/Core/Data.js#L131
	{
		var factor = 1;
		for (var i = 0 ; i < decimals || 0 ; i++) factor = factor * 10;
		return (value < 0 ? -1 : 1) * Math.round(Math.abs(value * factor)) / factor;
	}

	var getStyleSize = function(styles, propNameToGet)
	{
		// For debugging use https://regex101.com/r/5dVbPY/2
		// 0 = full match (or null), 1 = junk coming before width attribute, 2 = width (e.g. 2.2em), 3 = width decimals (e.g. .2), 4 = width unit (e.g. em)
		var regex = new RegExp("(^| |;)" + propNameToGet + " *: *(\\d+(\\.\\d+)?(px|em|%))", "i");
		var result = regex.exec(styles);
		return result && (result[4] === "px" ? Math.round(parseFloat(result[2])).toString() : result[2]);
	};

	var getMarginSize = function(styles, marginType)
	{
		// For debugging use https://regex101.com/r/2ITWa7/3/
		var regexEdge = new RegExp("(^| |;)margin-" + (marginType === "vertical" ? "top" : "left") + " *: *(\\d+(\\.\\d+)?(px|em|%))", "i"); // E.g. margin-top: 2.5em;
		var regexMargin1 = /(^| |;)margin *: *(\d+(\.\d+)?(px|em|%)) *(;|$)/i; // E.g. margin: 2.5em;
		var regexMargin2 = /(^| |;)margin *: *(\d+(\.\d+)?(px|em|%)) +(\d+(\.\d+)?(px|em|%)) *(;|$)/i; // E.g. margin: 2.5em 1.85em; (top/bottom left/right)
		var regexMargin3 = /(^| |;)margin *: *(\d+(\.\d+)?(px|em|%)) +(\d+(\.\d+)?(px|em|%)) +(\d+(\.\d+)?(px|em|%)) +(\d+(\.\d+)?(px|em|%)) *(;|$)/i; // E.g. margin: 2.5em 1.85em 2.5em 1.85em; (top right bottom left)

		var m1 = regexEdge.exec(styles);	// 0 = Full match, ... 2 = margin size, ...
		var m2 = regexMargin1.exec(styles);	// 0 = Full match, ... 2 = margin size, ...
		var m3 = regexMargin2.exec(styles);	// 0 = Full match, ... 2 = margin size top/bottom, 5 = margin size left/right, ...
		var m4 = regexMargin3.exec(styles);	// 0 = Full match, ... 2 = margin size top, 5 = margin size right, 8 = margin size bottom, 11 = margin size left ...

		var result = m1 && m1[2] || m2 && m2[2] || m3 && m3[marginType === "vertical" ? 2 : 5] || m4 && m4[marginType === "vertical" ? 2 : 11];
		return result && (result.indexOf("px") > -1 ? Math.round(parseFloat(result)).toString() : result);
	}

	/* Calculate image dimensions */
	function getImageDimensions() {
		var w = t.getContentElement("tab-properties", "width").getValue();
		var h = t.getContentElement("tab-properties", "height").getValue()
		var o = {
			"w" : w,
			"h" : h,
			"uw" : "px",
			"uh" : "px"
		};
		if(o.w.indexOf("%") >= 0) o.uw = "%";
		else if(o.w.indexOf("em") >= 0) o.uw = "em";
		if(o.h.indexOf("%") >= 0) o.uh = "%";
		else if(o.h.indexOf("em") >= 0) o.uh = "em";
		if (o.uw === "px") {
			o.w = parseInt(o.w, 10);
		} else {
			o.w = parseFloat(o.w);
		}
		if (o.uh === "px") {
			o.h = parseInt(o.h, 10);
		} else {
			o.h = parseFloat(o.h);
		}
		if(isNaN(o.w) || o.w + (o.uw !== "px" ? o.uw : "") !== w) { o.w = 0; o.err = true; };
		if(isNaN(o.h) || o.h + (o.uh !== "px" ? o.uh : "") !== h) { o.h = 0; o.err = true; };
		return o;
	}

	/* Set image dimensions */
	function imageDimensions(src) {
		var o = getImageDimensions();
		if (o.err) { // User entered an invalid value - restore to latest valid values applied
			t.getContentElement("tab-properties", "width").setValue(prevValidWidth);
			t.getContentElement("tab-properties", "height").setValue(prevValidHeight);
			return;
		}
		var u = "px";
		if(src == "width") {
			if (prevValidWidth === o.w + (o.uw !== "px" ? o.uw : "")) return; // User did not change value - avoid decimal adjustment on tab navigation
			if(o.uw == "%") u = "%";
			else if(o.uw == "em") u = "em";
			if (u === "px") {
				o.h = Math.round(o.w / imgScal);
			} else { // em or % where values might be small so we need better precision to avoid stretching image (e.g. 2em x 0.5em)
				o.h = roundWithDecimals(o.w / imgScal, 2);
			}
		} else {
			if (prevValidHeight === o.h + (o.uh !== "px" ? o.uh : "")) return; // User did not change value - avoid decimal adjustment on tab navigation
			if(o.uh == "%") u = "%";
			else if(o.uh == "em") u = "em";
			if (u === "px") {
				o.w = Math.round(o.h * imgScal);
			} else { // em or % where values might be small so we need better precision to avoid stretching image (e.g. 2em x 0.5em)
				o.w = roundWithDecimals(o.h * imgScal, 2);
			}
		}
		if(u == "%") {
			o.w += "%";
			o.h += "%";
		}
		else if(u == "em") {
			o.w += "em";
			o.h += "em";
		}
		t.getContentElement("tab-properties", "width").setValue(o.w.toString());
		t.getContentElement("tab-properties", "height").setValue(o.h.toString());
		prevValidWidth = o.w.toString();
		prevValidHeight = o.h.toString();
	}

	/* Set number value */
	function setNumberValue(elem) {
		var v = elem.getValue(), u = "";
		if(v.indexOf("%") >= 0) u = "%";
		else if(v.indexOf("em") >= 0) u = "em";
		if (u === "") {
			v = parseInt(v, 10);
			if(isNaN(v)) v = 0;
		} else { // em or %
			v = parseFloat(v);
			if(!isNaN(v)) {
				v = roundWithDecimals(v, 2);
			} else {
				v = 0;
			}
		}

		elem.setValue(v+u);
	}

	if(fsupport) {

		/* Dialog with file and url image source */
		var sourceElements = [
			{
				type: "hbox",
				widths: ["70px"],
				children: [
					{
						type: "checkbox",
						id: "urlcheckbox",
						//style: "margin-top:5px",
						label: editor.lang.common.url+":"
					},
					{
						type: "text",
						id: "url",
						label: "",
						style: "margin-top: -5px",
						onChange: function(){ imagePreview("url"); }
					}
				]
			},
			{ // Spacer
				type: "hbox",
				children: []
			},
			{
				type: "hbox",
				widths: ["70px"],
				children: [
					{
						type: "checkbox",
						id: "filecheckbox",
						//style: "margin-top:5px",
						label: editor.lang.common.upload+":"
					},
					{
						type: "file",
						id: "file",
						label: "",
						style: "margin-top: -5px",
						onChange: function(){ imagePreview("file"); }
					}
				]
			},
			{
				type: "html",
				id: "preview",
				html: new CKEDITOR.template("<div style=\"text-align:center;\"></div>").output()
			}
		];

	} else {

		/* Dialog with url image source */
		var sourceElements = [
			{
				type: "text",
				id: "url",
				label: editor.lang.common.url,
				onChange: function(){ imagePreview("url"); }
			},
			{
				type: "html",
				id: "preview",
				html: new CKEDITOR.template("<div style=\"text-align:center;\"></div>").output()
			}
		];
	}

	/* Dialog */
    return {
		title: editor.lang.common.image,
        minWidth: 450,
        minHeight: 180,
		onLoad: function(){

			if(fsupport) {

				/* Get checkboxes */
				urlCB = this.getContentElement("tab-source", "urlcheckbox");
				fileCB = this.getContentElement("tab-source", "filecheckbox");

				/* Checkbox Events */
				urlCB.getInputElement().on("click", function(){ imagePreview("url"); });
				fileCB.getInputElement().on("click", function(){ imagePreview("file"); });

			}

			/* Get url input element */
			urlI = this.getContentElement("tab-source", "url");

			/* Get image preview element */
			imgPreview = this.getContentElement("tab-source", "preview");

			/* Constrain proportions or not */
			this.getContentElement("tab-properties", "lock").getInputElement().on("click", function(){
				if(this.getValue()) lock = true; else lock = false;
				if(lock) imageDimensions("width");
			}, this.getContentElement("tab-properties", "lock"));

			/* Change Attributes Events  */
			this.getContentElement("tab-properties", "width").getInputElement().on("blur", function(){ if(lock) imageDimensions("width"); });
			this.getContentElement("tab-properties", "height").getInputElement().on("blur", function(){ if(lock) imageDimensions("height"); });
			this.getContentElement("tab-properties", "vmargin").getInputElement().on("blur", function(){ setNumberValue(this); }, this.getContentElement("tab-properties", "vmargin"));
			this.getContentElement("tab-properties", "hmargin").getInputElement().on("blur", function(){ setNumberValue(this); }, this.getContentElement("tab-properties", "hmargin"));
			this.getContentElement("tab-properties", "border").getInputElement().on("blur", function(){ setNumberValue(this); }, this.getContentElement("tab-properties", "border"));

		},
		onShow: function(){

			// NOTICE: IE11 on Win7+IE11 VM seems to be crashing a lot when opening the dialog to edit the properties
			// of an existing image. It seems to mainly happen when working with relative units (% and em),
			// and especially if assigning a border to the image. The original plugin had the same problem with %.
			// The problem can not be reproduced with Win7+IE10 though, nor when testing with IE11 on BrowserStack,
			// so this might be a problem with the VM or the specific build of IE11 being used.

			/* Remove preview */
			imgPreview.getElement().setHtml("");

			t = this, orgWidth = null, orgHeight = null, imgScal = 1, lock = true;

			/* selected image or null */
			selectedImg = editor.getSelection();
			if(selectedImg) selectedImg = selectedImg.getSelectedElement();
			if(!selectedImg || selectedImg.getName() !== "img") selectedImg = null;

			/* Set input values */
			t.setValueOf("tab-properties", "lock", lock);
			t.setValueOf("tab-properties", "vmargin", "0");
			t.setValueOf("tab-properties", "hmargin", "0");
			t.setValueOf("tab-properties", "border", "0");
			t.setValueOf("tab-properties", "align", "none");
			if(selectedImg) {

				/* Set input values from selected image */
				orgWidth = getStyleSize(selectedImg.getAttribute("style") || "", "width");
				orgHeight = getStyleSize(selectedImg.getAttribute("style") || "", "height");
				prevValidWidth = orgWidth;
				prevValidHeight = orgHeight;
				if((orgWidth == null || orgHeight == null) && selectedImg.$) {
					orgWidth = selectedImg.$.width;
					orgHeight = selectedImg.$.height;
				}
				if(orgWidth != null && orgHeight != null) {
					t.setValueOf("tab-properties", "width", orgWidth);
					t.setValueOf("tab-properties", "height", orgHeight);
					orgWidth = parseFloat(orgWidth);
					orgHeight = parseFloat(orgHeight);
					imgScal = 1;
					if(!isNaN(orgWidth) && !isNaN(orgHeight) && orgHeight > 0 && orgWidth > 0) imgScal = orgWidth / orgHeight;
					if(imgScal <= 0) imgScal = 1;
				}

				if(typeof(selectedImg.getAttribute("src")) == "string") {
					if(selectedImg.getAttribute("src").indexOf("data:") === 0) {
						imagePreview("base64");
						imagePreviewLoad(selectedImg.getAttribute("src"));
					} else {
						t.setValueOf("tab-source", "url", selectedImg.getAttribute("src"));
					}
				}
				if(typeof(selectedImg.getAttribute("alt")) == "string") t.setValueOf("tab-properties", "alt", selectedImg.getAttribute("alt"));
				t.setValueOf("tab-properties", "hmargin", getMarginSize(selectedImg.getAttribute("style"), "horizontal") || "0");
				t.setValueOf("tab-properties", "vmargin", getMarginSize(selectedImg.getAttribute("style"), "vertical") || "0");
				t.setValueOf("tab-properties", "border", getStyleSize(selectedImg.getAttribute("style"), "border") || "0");
				if(typeof(selectedImg.getAttribute("align")) == "string") {
					switch(selectedImg.getAttribute("align")) {
						case "top":
						case "text-top":
							t.setValueOf("tab-properties", "align", "top");
							break;
						case "baseline":
						case "bottom":
						case "text-bottom":
							t.setValueOf("tab-properties", "align", "bottom");
							break;
						case "left":
							t.setValueOf("tab-properties", "align", "left");
							break;
						case "right":
							t.setValueOf("tab-properties", "align", "right");
							break;
					}
				}
				t.selectPage("tab-properties");
			}

		},
		onOk : function(evArg){

			// NOTICE: IE11 on BrowserStack seems to trigger OnOk twice when pressing ENTER, but this
			// does not happen when testing locally on a Win7+IE11 VM. The problem might be related
			// to how BrowserStack map keystrokes from Mac to their in-browser remote Windows session.

			/* Get image source */
			var src = "";
			try { src = CKEDITOR.document.getById(editor.id+"previewimage").$.src; } catch(e) { src = ""; }
			if(typeof(src) != "string" || src == null || src === "") return;

			/* selected image or new image */
			if(selectedImg) var newImg = selectedImg; else var newImg = editor.document.createElement("img");
			newImg.setAttribute("src", src);
			src = null;

			/* Set attributes */
			newImg.setAttribute("alt", t.getValueOf("tab-properties", "alt").replace(/^\s+/, "").replace(/\s+$/, ""));
			var attr = {
				"width" : ["width", "width:#;", "integer", 1],
				"height" : ["height", "height:#;", "integer", 1],
				"vmargin" : ["vspace", "margin-top:#;margin-bottom:#;", "integer", 0],
				"hmargin" : ["hspace", "margin-left:#;margin-right:#;", "integer", 0],
				"align" : ["align", ""],
				"border" : ["border", "border:# solid black;", "integer", 0]
			}, css = [], value, cssvalue, attrvalue, k;
			for(k in attr) {

				value = t.getValueOf("tab-properties", k);
				attrvalue = value;
				cssvalue = value;
				unit = "px";

				if(k == "align") {
					switch(value) {
						case "top":
						case "bottom":
							attr[k][1] = "vertical-align:#;";
							break;
						case "left":
						case "right":
							attr[k][1] = "float:#;";
							break;
						default:
							value = null;
							break;
					}
				}

				if(attr[k][2] == "integer") {
					if(value.indexOf("%") >= 0) unit = "%";
					else if(value.indexOf("em") >= 0) unit = "em";
					if (unit === "px") {
						value = parseInt(value, 10); // No need to validate - valid values are enforced in the dialog
					} else { // em or %
						value = parseFloat(value); // No need to validate - valid values are enforced in the dialog
					}
					if(value != null) {
						if(unit == "%") {
							attrvalue = ""; // The width and height attributes are pixel values - specifying a unit does not comply with the spec
							cssvalue = value+"%";
						} else if(unit == "em") {
							attrvalue = ""; // The width and height attributes are pixel values - specifying a unit does not comply with the spec
							cssvalue = value+"em";
						} else {
							attrvalue = value;
							cssvalue = value+"px";
						}
					}
				}

				if(value != null) {
					attrvalue && newImg.setAttribute(attr[k][0], attrvalue);
					css.push(attr[k][1].replace(/#/g, cssvalue));
				}

			}
			if(css.length > 0) newImg.setAttribute("style", css.join(""));

			/* Insert new image */
			if(!selectedImg) editor.insertElement(newImg);

			/* Resize image (https://github.com/nmmf/imageresize) */
			if(editor.plugins.imageresize) editor.plugins.imageresize.resize(editor, newImg, 800, 800);

			/* Make sure image cannot become hidden or inaccessible with very small width or height */
			var minWidth = 10, minHeight = 10; // Do not go below 10px! Too much precision is lost if we do, making it impossible to calculate an aspect ratio close to the original!
			if (newImg.$.offsetWidth < minWidth || newImg.$.offsetHeight < minHeight) { // Notice: .width and .height returns the image size while .offsetWidth and .offsetHeight includes the border applied

				var newMinWidth = minWidth;
				var newMinHeight = minHeight;

				if (newImg.$.width > newImg.$.height) { // landscape
					newMinHeight = minHeight;
					newMinWidth = newMinHeight * imgScal;
				} else { // portrait or square
					newMinWidth = minWidth;
					newMinHeight = newMinWidth / imgScal;
				}

				newMinWidth = Math.round(newMinWidth);
				newMinHeight = Math.round(newMinHeight);

				var newCss = [];
				for (var i = 0 ; i < css.length ; i++) {
					if (/^width|height/.test(css[i]) === false) {
						newCss.push(css[i]);
					}
				}

				newCss.push("width:" + newMinWidth + "px;");
				newCss.push("height:" + newMinHeight + "px;");

				newImg.setAttribute("width", newMinWidth.toString());
				newImg.setAttribute("height", newMinHeight.toString());
				newImg.setAttribute("style", newCss.join(""));

				//evArg.data.hide = false; // Prevent dialog from closing
			}
		},

		/* Dialog form */
        contents: [
            {
                id: "tab-source",
                label: editor.lang.common.generalTab,
                elements: sourceElements
            },
            {
                id: "tab-properties",
                label: editor.lang.common.advancedTab,
                elements: [
                    {
                        type: "text",
                        id: "alt",
                        label: editor.lang.base64image.alt
                    },
                    {
						type: 'hbox',
						widths: ["15%", "15%", "70%"],
						children: [
							{
								type: "text",
								width: "70px",
								id: "width",
								label: editor.lang.common.width
							},
							{
								type: "text",
								width: "70px",
								id: "height",
								label: editor.lang.common.height
							},
							{
								type: 'hbox',
								style: "margin-top:26px;",
								children:
								[
									{
										type: "checkbox",
										id: "lock",
										label: editor.lang.base64image.lockRatio,
										//style: "margin-top:18px;"
									}
								]
							}
						]
                    },
					{
						type: 'hbox',
						widths: ["23%", "30%", "30%", "17%"],
						style: "margin-top:10px;",
						children: [
							{
								type: "select",
								id: "align",
								label: editor.lang.common.align,
								items: [
									[editor.lang.common.notSet, "none"],
									[editor.lang.common.alignTop, "top"],
									[editor.lang.common.alignBottom, "bottom"],
									[editor.lang.common.alignLeft, "left"],
									[editor.lang.common.alignRight, "right"]
								]
							},
							{
								type: "text",
								width: "70px",
								id: "vmargin",
								label: editor.lang.base64image.vSpace
							},
							{
								type: "text",
								width: "70px",
								id: "hmargin",
								label: editor.lang.base64image.hSpace
							},
							{
								type: "text",
								width: "70px",
								id: "border",
								label: editor.lang.base64image.border
							}
						]
					}
                ]
            }
        ]
    };
});