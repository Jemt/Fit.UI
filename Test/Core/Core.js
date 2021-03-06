Tests.Extend = function()
{
	var dog = null;
	var cat = null;

	this.Description = "Testing support for inheritance/mixins (Extend/Extends/InstanceOf/CreateOverride/Clone/IsEqual)";

	this.Execute = function()
	{
		dog = new UnitTestHelper.Core.Dog("Pluto");
		cat = new UnitTestHelper.Core.Cat("Figaro");
	}

	this.Assertions =
	[
		{
			Message: "Dog and Cat extends Animal (testing using Extends function)",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Core.Extends(dog, UnitTestHelper.Core.Animal) === true && Fit.Core.Extends(cat, UnitTestHelper.Core.Animal) === true );
			}
		},
		{
			Message: "Dog and Cat exposes a Sound property and MakeNoise function defined on Animal",
			Expected: true,
			GetResult: function()
			{
				return (dog.Sound !== undefined && dog.MakeNoise !== undefined && cat.Sound !== undefined && cat.MakeNoise !== undefined);
			}
		},
		{
			Message: "The dog is called Pluto and says 'Woof Woof'",
			Expected: "Pluto says Woof Woof",
			GetResult: function()
			{
				return dog.MakeNoise();
			}
		},
		{
			Message: "The Cat class has successfully overridden the MakeNoise function (using CreateOverride function)",
			Expected: "Figaro says Miaaaauuu *prrr* to greet you",
			GetResult: function()
			{
				return cat.MakeNoise();
			}
		},
		{
			Message: "The dog is an instance of Dog and Animal, but not Cat (testing using InstanceOf function)",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Core.InstanceOf(dog, UnitTestHelper.Core.Dog) === true && Fit.Core.InstanceOf(dog, UnitTestHelper.Core.Animal) === true && Fit.Core.InstanceOf(dog, UnitTestHelper.Core.Cat) === false);
			}
		},
		{
			Message: "The cat is an instance of Cat and Animal, but not Dog (testing using InstanceOf function)",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Core.InstanceOf(cat, UnitTestHelper.Core.Cat) === true && Fit.Core.InstanceOf(cat, UnitTestHelper.Core.Animal) === true && Fit.Core.InstanceOf(cat, UnitTestHelper.Core.Dog) === false);
			}
		}
	]
}

Tests.Compare = function()
{
	var obj1 = null;
	var obj2 = null;

	this.Description = "Testing IsEqual function";

	this.Execute = function()
	{
		var f1 = function() { alert("Hello"); }
		var f2 = f1;

		obj1 = UnitTestHelper.Core.CreateTestObject();
		obj1.arr3[6].x.hapsen = f1;

		obj2 = UnitTestHelper.Core.CreateTestObject();
		obj2.arr3[6].x.hapsen = f2;

		/*obj1 =
		{
			str: "Hello world",
			num: 123,
			dec: 123.321,
			date: new Date("2014-12-01 13:02:23"),
			bool: true,
			bool2: false,
			arr: [100, 200, 250, 400],
			arr2: ["Hello", "world"],
			arr3: [123, "hello", true, false, new Date("1990-01-20"), [1,2,3], { x: { "hapsen": f1, "hello": new Array(1,2,3) } }],
			obj: { a: 123, b: 123.321, c: true, d: false, e: new Date("1993-06-25"), f: "hello", g: null, h: undefined }
		}

		obj2 =
		{
			str: "Hello world",
			num: 123,
			dec: 123.321,
			date: new Date("2014-12-01 13:02:23"),
			bool: true,
			bool2: false,
			arr: [100, 200, 250, 400],
			arr2: ["Hello", "world"],
			arr3: [123, "hello", true, false, new Date("1990-01-20"), [1,2,3], { x: { "hapsen": f2, "hello": new Array(1,2,3) } }],
			obj: { a: 123, b: 123.321, c: true, d: false, e: new Date("1993-06-25"), f: "hello", g: null, h: undefined }
		};*/
	}

	this.Assertions =
	[
		{
			Message: "IsEqual considers two complex object structures identical",
			Expected: true,
			GetResult: function()
			{
				return Fit.Core.IsEqual(obj1, obj2);
			}
		},
		{
			Message: "IsEqual no longer consideres two complex object structures identical when a string value is changed",
			Expected: false,
			GetResult: function()
			{
				var orgVal = obj2.str;
				obj2.str = "Hello you";
				var result = Fit.Core.IsEqual(obj1, obj2);
				obj2.str = orgVal;

				return result;
			}
		},
		{
			Message: "IsEqual no longer consideres two complex object structures identical when a number value is changed",
			Expected: false,
			GetResult: function()
			{
				var orgVal = obj2.num;
				obj2.num = 987654;
				var result = Fit.Core.IsEqual(obj1, obj2);
				obj2.num = orgVal;

				return result;
			}
		},
		{
			Message: "IsEqual no longer consideres two complex object structures identical when a date within an array is changed",
			Expected: false,
			GetResult: function()
			{
				var orgVal = obj2.arr3[4];
				obj2.arr3[4] = new Date();
				var result = Fit.Core.IsEqual(obj1, obj2);
				obj2.arr3[4] = orgVal;

				return result;
			}
		},
		{
			Message: "IsEqual no longer consideres two complex object structures identical when a function within an object within an array is changed",
			Expected: false,
			GetResult: function()
			{
				var orgVal = obj2.arr3[6].x.hapsen;
				obj2.arr3[6].x.hapsen = function() { console.log("Another function"); }
				var result = Fit.Core.IsEqual(obj1, obj2);
				obj2.arr3[6].x.hapsen = orgVal;

				return result;
			}
		},
		{
			Message: "IsEqual still consideres two complex object structures identical (validate all previous tests which made temporary modifications to test object)", // Rerun first test to make sure object is left in a consistent state
			Expected: true,
			GetResult: function()
			{
				return Fit.Core.IsEqual(obj1, obj2);
			}
		}
	]
}

Tests.Clone = function()
{
	var obj1 = null;
	var obj2 = null;

	this.Description = "Testing Clone function";

	this.Execute = function()
	{
		obj1 = UnitTestHelper.Core.CreateTestObject();
		obj1.arr3[6].x.hapsen = function() { return "ABC-123321-DEF"; };

		obj2 = Fit.Core.Clone(obj1);
	}

	this.Assertions =
	[
		{
			Message: "Complex object was successfully cloned",
			Expected: true,
			GetResult: function()
			{
				return Fit.Core.IsEqual(obj1, obj2);
			}
		},
		{
			Message: "Function preserved in clone (same reference)",
			Expected: true,
			GetResult: function()
			{
				return (obj1.arr3[6].x.hapsen() === obj2.arr3[6].x.hapsen());
			}
		}
	]
}

Tests.SetPath = function()
{
	var orgPath = Fit.GetPath();			// E.g. /build
	var orgUrl = Fit.GetUrl();				// E.g. http://localhost:8080/build
	var root = orgUrl.replace(orgPath, "");	// E.g. http://localhost:8080

	this.Description = "Testing SetPath function";

	this.Execute = function()
	{
	}

	this.Assertions =
	[
		{
			Message: "Deep path without trailing slash",
			Expected: JSON.stringify(["/new/path/to/Fit.UI", root + "/new/path/to/Fit.UI"]),
			GetResult: function()
			{
				Fit.SetPath("/new/path/to/Fit.UI");
				return JSON.stringify([Fit.GetPath(), Fit.GetUrl()]);
			}
		},
		{
			Message: "Deep path with trailing slash",
			Expected: JSON.stringify(["/new/path/to/Fit.UI", root + "/new/path/to/Fit.UI"]),
			GetResult: function()
			{
				Fit.SetPath("/new/path/to/Fit.UI/");
				return JSON.stringify([Fit.GetPath(), Fit.GetUrl()]);
			}
		},
		{
			Message: "Root path",
			Expected: JSON.stringify(["/", root]),
			GetResult: function()
			{
				Fit.SetPath("/");
				return JSON.stringify([Fit.GetPath(), Fit.GetUrl()]);
			}
		},
		{
			Message: "Can reset path",
			Expected: JSON.stringify([orgPath, orgUrl]),
			GetResult: function()
			{
				Fit.SetPath(null);
				return JSON.stringify([Fit.GetPath(), Fit.GetUrl()]);
			}
		}
	]
}

Tests.SetUrl = function()
{
	var orgPath = Fit.GetPath();			// E.g. /build
	var orgUrl = Fit.GetUrl();				// E.g. http://localhost:8080/build
	var root = orgUrl.replace(orgPath, "");	// E.g. http://localhost:8080

	this.Description = "Testing SetUrl function";

	this.Execute = function()
	{
	}

	this.Assertions =
	[
		{
			Message: "Deep URL path without trailing slash",
			Expected: JSON.stringify(["/new/path/to/Fit.UI", "https://token@10.20.1.20:8082/new/path/to/Fit.UI"]),
			GetResult: function()
			{
				Fit.SetUrl("https://token@10.20.1.20:8082/new/path/to/Fit.UI");
				return JSON.stringify([Fit.GetPath(), Fit.GetUrl()]);
			}
		},
		{
			Message: "Deep URL path with trailing slash",
			Expected: JSON.stringify(["/new/path/to/Fit.UI", "https://token@10.20.1.20:8082/new/path/to/Fit.UI"]),
			GetResult: function()
			{
				Fit.SetUrl("https://token@10.20.1.20:8082/new/path/to/Fit.UI/");
				return JSON.stringify([Fit.GetPath(), Fit.GetUrl()]);
			}
		},
		{
			Message: "Root URL path",
			Expected: JSON.stringify(["/", "https://token@10.20.1.20:8082"]),
			GetResult: function()
			{
				Fit.SetUrl("https://token@10.20.1.20:8082");
				return JSON.stringify([Fit.GetPath(), Fit.GetUrl()]);
			}
		},
		{
			Message: "Can reset URL path",
			Expected: JSON.stringify([orgPath, orgUrl]),
			GetResult: function()
			{
				Fit.SetUrl(null);
				return JSON.stringify([Fit.GetPath(), Fit.GetUrl()]);
			}
		}
	]
}


UnitTestHelper.Core = {};

UnitTestHelper.Core.CreateTestObject = function()
{
	var obj =
	{
		str: "Hello world",
		num: 123,
		dec: 123.321,
		date: new Date(2014, 11, 1, 13, 02, 23),
		bool: true,
		bool2: false,
		arr: [100, 200, 250, 400],
		arr2: ["Hello", "world"],
		arr3: [123, "hello", true, false, new Date(1990, 0, 20), [1,2,3], { x: { "hello": new Array(1,2,3) } }],
		obj: { a: 123, b: 123.321, c: true, d: false, e: new Date(1993, 5, 25), f: "hello", g: null, h: undefined }
	}

	return obj;
}

UnitTestHelper.Core.Animal = function(name)
{
	var me = this;
	this.Sound = "";
	this.MakeNoise = function()
	{
		return name + " says " + me.Sound;
	}
	this.GetName = function()
	{
		return name;
	}
}

UnitTestHelper.Core.Dog = function(name)
{
	Fit.Core.Extend(this, UnitTestHelper.Core.Animal).Apply(name);
	this.Sound = "Woof Woof"
}

UnitTestHelper.Core.Cat = function(name)
{
	Fit.Core.Extend(this, UnitTestHelper.Core.Animal).Apply(name);
	this.Sound = "Miaaaauuu *prrr*";
	this.MakeNoise = Fit.Core.CreateOverride(this.MakeNoise, function()
	{
		return base() + " to greet you";
	});
}
