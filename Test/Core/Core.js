Tests.Extend = function()
{
	var dog = null;
	var cat = null;

	this.Description = "Testing support for inheritance/mixins (Extend/Extends/InstanceOf/CreateOverride/Clone/IsEqual)";

	this.Execute = function()
	{
		dog = new CoreHelper.Dog("Pluto");
		cat = new CoreHelper.Cat("Figaro");
	}

	this.Assertions =
	[
		{
			Message: "Dog and Cat extends Animal (testing using Extends function)",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Core.Extends(dog, CoreHelper.Animal) === true && Fit.Core.Extends(cat, CoreHelper.Animal) === true );
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
				return (Fit.Core.InstanceOf(dog, CoreHelper.Dog) === true && Fit.Core.InstanceOf(dog, CoreHelper.Animal) === true && Fit.Core.InstanceOf(dog, CoreHelper.Cat) === false);
			}
		},
		{
			Message: "The cat is an instance of Cat and Animal, but not Dog (testing using InstanceOf function)",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Core.InstanceOf(cat, CoreHelper.Cat) === true && Fit.Core.InstanceOf(cat, CoreHelper.Animal) === true && Fit.Core.InstanceOf(cat, CoreHelper.Dog) === false);
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

		obj1 = CoreHelper.CreateTestObject();
		obj1.arr3[6].x.hapsen = f1;

		obj2 = CoreHelper.CreateTestObject();
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
			Message: "IsEqual consideres two complex object structures identical",
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
		obj1 = CoreHelper.CreateTestObject();
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

CoreHelper = {};

CoreHelper.CreateTestObject = function()
{
	var obj =
	{
		str: "Hello world",
		num: 123,
		dec: 123.321,
		date: new Date("2014-12-01 13:02:23"),
		bool: true,
		bool2: false,
		arr: [100, 200, 250, 400],
		arr2: ["Hello", "world"],
		arr3: [123, "hello", true, false, new Date("1990-01-20"), [1,2,3], { x: { "hello": new Array(1,2,3) } }],
		obj: { a: 123, b: 123.321, c: true, d: false, e: new Date("1993-06-25"), f: "hello", g: null, h: undefined }
	}

	return obj;
}

CoreHelper.Animal = function(name)
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

CoreHelper.Dog = function(name)
{
	Fit.Core.Extend(this, CoreHelper.Animal).Apply(name);
	this.Sound = "Woof Woof"
}

CoreHelper.Cat = function(name)
{
	Fit.Core.Extend(this, CoreHelper.Animal).Apply(name);
	this.Sound = "Miaaaauuu *prrr*";
	this.MakeNoise = Fit.Core.CreateOverride(this.MakeNoise, function()
	{
		return base() + " to greet you";
	});
}
