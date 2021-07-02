Tests.DomManipulation = function()
{
	this.Description = "Add DOM element";

	//this.PostponeTest = 500; // Optional - postpone test for 500 ms
	this.Execute = function()
	{
		var elm = document.createElement();
		elm.id = "HelloWorldElement";
		elm.innerHTML = "hello world";

		document.body.appendChild(elm);
	}

	//this.PostponeVerification = 1500; // Optional - postpone verification for 1500 ms after Execute is invoked
	this.Assertions =
	[
		{
			Message: "DOM element exists",
			Expected: true,
			GetResult: function()
			{
				return (document.getElementById("HelloWorldElement") !== null);
			}
		}
	]

	this.Dispose = function() // Optional - dispose objects if necessary - executes immediately after validating assertions
	{
	}

	this.Tests = // Optional - add any number of associated tests with the same format as shown above - executes after assertions have been verified
	{
		/*ChangeDomElement: function()
		{
		},
		RemoveDomElement: function()
		{
		}*/
	}
}

// Add any number of tests

/*Tests.AnotherTest = function()
{
}*/
