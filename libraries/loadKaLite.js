(function(window)
{
	function createProcessing()
	{
		var args = Array.prototype.slice.call(arguments);
		args.push({ beginCode: "with(processing)\n{", endCode: "}"});

		// Any aka the anonymous functiosn 
		var any = combine.apply(this, args);

		this.setup = function()
		{
			function code(processing)
			{
				processing.size(400, 400);
				processing.background(255, 255, 255);
				processing.stroke(0, 0, 0);
				processing.strokeWeight(1);
				processing.angleMode = "degrees";
				
				// Blank functions
				processing.mousePressed = function() {};
				processing.mouseReleased = function() {};
				processing.mouseMoved = function() {};
				processing.mouseDragged = function() {};
				processing.mouseOver = function() {};
				processing.mouseOut = function() {};
				processing.keyPressed = function() {};
				processing.keyReleased = function() {};
				processing.keyTyped = function() {};

				// "Special" case functions
				processing.playSound = function() {};
				processing.getSound = function() 
				{
					return document.createElement("source");
				};
				processing.image = function() {};
				processing.getImage = function()
				{
					return processing.get(0, 0, 1, 1);
				};

				// Other stuff we need to take care of
				processing.debug = function()
				{
					window.console.log.apply(this, arguments);
				};
				processing.Program = {
					restart: function() 
					{
						window.location.reload();
					},
					assertEqual: function(equiv) 
					{
						if(!equiv) 
						{
							console.warn(equiv);
						}
					},
				};
			}

			// Create a new processing instance then run it.
			window.processing = new Processing(document.getElementById("canvas"), combine(code, any));
		};

		this.setup();
	}

	// combines 2 functions
	function combine(a, c)
	{
		var args = Array.prototype.slice.call(arguments);
		var config = {};

		var funcArgs = "";
		var join = "";
		for(var i = 0; i < args.length; i++)
		{
			if(typeof args[i] === "object")
			{
				config = args[i];
				continue;
			}

			var to = args[i].toString();

			var temp = to.substring(to.indexOf('(') + 1, to.indexOf(')'));

			if(temp !== "" && temp !== " ")
			{
				funcArgs += temp + ",";
			}

			join += to.slice(to.indexOf('{') + 1, -1);
		}

		funcArgs = funcArgs.slice(0, -1);
		
		return new Function("return function any(" + funcArgs + "){" + (config.beginCode || "").replace("\n", "") + join + (config.endCode || "") + "}")();
	}

	// Xhr function
	function toDataURL(url, callback) 
	{
		var xhr = new XMLHttpRequest();
		xhr.onload = function() 
		{
			var reader = new FileReader();
			reader.onloadend = function() 
			{
				callback(reader.result);
			}
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
	}

	// Export
	window.createProcessing = createProcessing;
}(window));