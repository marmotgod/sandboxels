elements.paint = {
	color: ["#c27070","#c29c70","#c2c270","#70c270","#70c2c2","#7070c2","#c270c2"],
	tool: function(pixel) {
		if (!shiftDown) {
			pixel.color = pixelColorPick(pixel,currentColorMap.paint)
		}
		else {
			// convert the hex of currentColor to rgb and set it as a string
			var rgb = currentColorMap.paint.replace("#","").match(/.{1,2}/g);
			for (var i = 0; i < rgb.length; i++) {  
				rgb[i] = parseInt(rgb[i],16);
			}
			pixel.color = "rgb(" + rgb.join(",") + ")"
		}
		delete pixel.origColor;
        pixel.painted = "yeah";
	},
	customColor: true,
	category: "tools",
	canPlace: false,
	desc: "Use on pixels to change color."
}

function changePixel(pixel,element,changetemp=true) {
			if (!element) { return }
			if (elements[pixel.element].onChange !== undefined) {
				elements[pixel.element].onChange(pixel,element);
			}
			if (!elements[element]) {
				pixel.invalidElement = element;
				element = "unknown"
			}
			pixel.element = element;
            if (!pixel.painted) {
			    pixel.color = pixelColorPick(pixel);
            }
			pixel.start = pixelTicks;
			var elementInfo = elements[element];
			if (elementInfo.burning == true) {
				pixel.burning = true;
				pixel.burnStart = pixelTicks;
			}
			else if (pixel.burning && !elementInfo.burn) {
				delete pixel.burning;
				delete pixel.burnStart;
			}
			delete pixel.origColor; // remove stain
			delete pixel.clone;
			if (pixel.glow !== undefined) {
				delete pixel.glow;
			}
			if (pixel.r && !elementInfo.rotatable) {
				delete pixel.r;
			}
			if (pixel.flipX && !elementInfo.flippableX) {
				delete pixel.flipX;
			}
			if (pixel.flipY && !elementInfo.flippableY) {
				delete pixel.flipY;
			}
			// If elementInfo.flippableX, set it to true or false randomly
			if (elementInfo.flipX !== undefined) { pixel.flipX = elementInfo.flipX }
			else if (elementInfo.flippableX) {
				pixel.flipX = Math.random() >= 0.5;
			}
			// If elementInfo.flippableY, set it to true or false randomly
			if (elementInfo.flipY !== undefined) { pixel.flipY = elementInfo.flipY }
			else if (elementInfo.flippableY) {
				pixel.flipY = Math.random() >= 0.5;
			}
			if (elementInfo.temp !== undefined && changetemp) {
				pixel.temp = (elementInfo.temp+pixel.temp)/2;
				pixelTempCheck(pixel)
			}
			if (pixel.con && !elementInfo.canContain) {
				delete pixel.con;
			}
			// If elementInfo.properties, set each key to its value
			if (elementInfo.properties !== undefined) {
				for (var key in elementInfo.properties) {
					// If it is an array or object, make a copy of it
					if (typeof elementInfo.properties[key] == "object") {
						pixel[key] = JSON.parse(JSON.stringify(elementInfo.properties[key]));
					}
					else {
						pixel[key] = elementInfo.properties[key];
					}
				}
			}
			if (pixel.alpha !== undefined) {
				delete pixel.alpha;
			}
			if (pixel.emit) {
				delete pixel.emit;
			}
			if (elements[element].alpha !== undefined) {
				pixel.alpha = elements[element].alpha;
			}
			if (elements[element].onPlace !== undefined) {
				elements[element].onPlace(pixel);
			}
			checkUnlock(element);
		}


