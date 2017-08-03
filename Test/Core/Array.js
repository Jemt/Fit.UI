Tests.ForEach = function()
{
	var resultArray = 0;
	var resultObjectArray = 0;
	var resultNodeList = 0;

	this.Description = "ForEach can iterate collection types: array, object array, node list";

	this.Execute = function()
	{
		var arr = [ 1, 2, 3, 4, 5 ];
		var objArr = { a: 1, b: 2, c: 3, d: 4, e:5 };
		var nodes = UnitTestHelper.Array.CreateList().children;
		var total = 0;

		Fit.Array.ForEach(arr, function(val)
		{
			if (val === 4)
				return false;

			resultArray += val;
		});
		Fit.Array.ForEach(objArr, function(i)
		{
			if (i === "d")
				return false;

			resultObjectArray += objArr[i];
		});
		Fit.Array.ForEach(nodes, function(n)
		{
			if (parseInt(n.innerHTML) === 4)
				return false;

			resultNodeList += parseInt(n.innerHTML);
		});
	}

	this.Assertions =
	[
		{
			Message: "Iterating native arrays work",
			Expected: 6,
			GetResult: function()
			{
				return resultArray;
			}
		},
		{
			Message: "Iterating object arrays work",
			Expected: 6,
			GetResult: function()
			{
				return resultObjectArray;
			}
		},
		{
			Message: "Iterating node lists work",
			Expected: 6,
			GetResult: function()
			{
				return resultNodeList;
			}
		}
	]
}

Tests.Count = function()
{
	var resultArray = 0;
	var resultObjectArray = 0;
	var resultNodeList = 0;

	this.Description = "Count can count items in collection types: array, object array, node list";

	this.Execute = function()
	{
		var arr = [ 1, 2, 3, 4, 5 ];
		var objArr = { a: 1, b: 2, c: 3, d: 4, e:5 };
		var nodes = UnitTestHelper.Array.CreateList().children;
		var total = 0;

		resultArray += Fit.Array.Count(arr);
		resultObjectArray += Fit.Array.Count(objArr);
		resultNodeList += Fit.Array.Count(nodes);
	}

	this.Assertions =
	[
		{
			Message: "Count works for native arrays",
			Expected: 5,
			GetResult: function()
			{
				return resultArray;
			}
		},
		{
			Message: "Count works for object arrays",
			Expected: 5,
			GetResult: function()
			{
				return resultObjectArray;
			}
		},
		{
			Message: "Count works for node lists",
			Expected: 5,
			GetResult: function()
			{
				return resultNodeList;
			}
		}
	]
}

Tests.Recurse = function()
{
	var level1 = false;
	var level2 = false;
	var level3 = false;
	var level4 = false;
	var res = 0;

	this.Description = "Recurse can iterate tree structure";

	this.Execute = function()
	{
		Fit.Array.Recurse(UnitTestHelper.TestValues.GetType("object[]").Values[0], "Children", function(item)
		{
			res++;

			if (item.Value === "RN1")
				level1 = true;
			else if (item.Value === "CN1.1")
				level2 = true;
			else if (item.Value === "CN1.1.1")
				level3 = true;
			else if (item.Value === "CN1.1.1.1")
				level4 = true;
		});
	}

	this.Assertions =
	[
		{
			Message: "19 nodes found in tree structure",
			Expected: 19,
			GetResult: function()
			{
				return res;
			}
		},
		{
			Message: "Level 1 of 4 reached",
			Expected: true,
			GetResult: function()
			{
				return level1;
			}
		},
		{
			Message: "Level 2 of 4 reached",
			Expected: true,
			GetResult: function()
			{
				return level2;
			}
		},
		{
			Message: "Level 3 of 4 reached",
			Expected: true,
			GetResult: function()
			{
				return level3;
			}
		},
		{
			Message: "Level 4 of 4 reached",
			Expected: true,
			GetResult: function()
			{
				return level4;
			}
		},
	]
}

Tests.CustomRecurse = function()
{
	var level1 = false;
	var level2 = false;
	var level3 = false;
	var level4 = false;
	var res = 0;

	this.Description = "CustomRecurse can iterate tree structure";

	this.Execute = function()
	{
		Fit.Array.CustomRecurse(UnitTestHelper.TestValues.GetType("object[]").Values[0], function(item)
		{
			res++;

			if (item.Value === "RN1")
				level1 = true;
			else if (item.Value === "CN1.1")
				level2 = true;
			else if (item.Value === "CN1.1.1")
				level3 = true;
			else if (item.Value === "CN1.1.1.1")
				level4 = true;

			return (item.Children ? item.Children : null);
		});
	}

	this.Assertions =
	[
		{
			Message: "19 nodes found in tree structure",
			Expected: 19,
			GetResult: function()
			{
				return res;
			}
		},
		{
			Message: "Level 1 of 4 reached",
			Expected: true,
			GetResult: function()
			{
				return level1;
			}
		},
		{
			Message: "Level 2 of 4 reached",
			Expected: true,
			GetResult: function()
			{
				return level2;
			}
		},
		{
			Message: "Level 3 of 4 reached",
			Expected: true,
			GetResult: function()
			{
				return level3;
			}
		},
		{
			Message: "Level 4 of 4 reached",
			Expected: true,
			GetResult: function()
			{
				return level4;
			}
		},
	]
}

Tests.ArrayManipulation = function()
{
	var obj = { Title: "Item 4", Value: 10004 }

	var arr1 = [];
	var arr2 = [];
	var arr3 = [];
	var arr4 = [];
	var arr5 = [];

	var arr2IdxExisting = -1;
	var arr2IdxNonExisting = -1;

	this.Description = "Arrays can be manipulated (Add/Insert/Remove/RemoveAt/Clear/GetIndex/Contains)";

	this.Execute = function()
	{
		Fit.Array.Add(arr1, 1);
		Fit.Array.Add(arr1, 2);
		Fit.Array.Add(arr1, 3);
		Fit.Array.Add(arr1, 4);
		Fit.Array.Add(arr1, 5); // Result: [1, 2, 3, 4, 5]

		Fit.Array.Add(arr2, "A");
		Fit.Array.Add(arr2, "B");
		Fit.Array.Add(arr2, "C");
		Fit.Array.Insert(arr2, 2, "XYZ"); // Result: ["A", "B", "XYZ", "C"]

		arr3 = Fit.Array.Merge(arr1, arr2); // Result: [1, 2, 3, 4, 5, "A", "B", "XYZ", "C"]

		var tmp = { Title: "Item 2", Value: 10002 }
		Fit.Array.Add(arr4, { Title: "Item 1", Value: 10001 });
		Fit.Array.Add(arr4, tmp);
		Fit.Array.Add(arr4, { Title: "Item 3", Value: 10003 });
		Fit.Array.Add(arr4, obj);
		Fit.Array.Add(arr4, { Title: "Item 5", Value: 10005 });
		Fit.Array.Add(arr4, { Title: "Item 6", Value: 10006 });
		Fit.Array.Remove(arr4, tmp);
		Fit.Array.RemoveAt(arr4, 0);
		Fit.Array.RemoveAt(arr4, 3);
		Fit.Array.RemoveAt(arr4, 4); // Result: [Item 3, Item 4, Item 5]

		Fit.Array.Add(arr5, "A");
		Fit.Array.Add(arr5, "B");
		Fit.Array.Add(arr5, "C");
		Fit.Array.Clear(arr5); // Result: []
	}

	this.Assertions =
	[
		{
			Message: "Add function added 5 integers (1,2,3,4,5) with a sum of 15",
			Expected: true,
			GetResult: function()
			{
				var res = 0;

				Fit.Array.ForEach(arr1, function(val)
				{
					res += val;
				})

				return (arr1.length === 5 && res === 15);
			}
		},
		{
			Message: "Contains function can determine whether an element (integer, string, or object) is contained in an array",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Array.Contains(arr1, 4) === true && Fit.Array.Contains(arr1, 58489) === false
						&& Fit.Array.Contains(arr2, "B") === true && Fit.Array.Contains(arr2, "Hello") === false
						&& Fit.Array.Contains(arr4, obj) === true && Fit.Array.Contains(arr4, { Title: "Hello" }) === false);
			}
		},
		{
			Message: "GetIndex function can determine an element's (integer, string, or object) index within an array",
			Expected: true,
			GetResult: function()
			{
				return (Fit.Array.GetIndex(arr1, 4) === 3 && Fit.Array.GetIndex(arr1, 58489) === -1
						&& Fit.Array.GetIndex(arr2, "B") === 1 && Fit.Array.GetIndex(arr2, "Hello") === -1
						&& Fit.Array.GetIndex(arr4, obj) === 1 && Fit.Array.GetIndex(arr4, { Title: "Hello" }) === -1);
			}
		},
		{
			Message: "Insert function was able to insert an element at index 2",
			Expected: true,
			GetResult: function()
			{
				return (arr2.length === 4 && arr2[2] === "XYZ");
			}
		},
		{
			Message: "Merge can join two arrays",
			Expected: true,
			GetResult: function()
			{
				if (arr1.length + arr2.length !== arr3.length)
					return false;

				for (var i = 0 ; i < arr1.length ; i++)
				{
					if (Fit.Array.Contains(arr3, arr1[i]) === false)
						return false;
				}

				for (var i = 0 ; i < arr2.length ; i++)
				{
					if (Fit.Array.Contains(arr3, arr2[i]) === false)
						return false;
				}

				return true;
			}
		},
		{
			Message: "Remove/RemoveAt functions were able to remove elements from an array",
			Expected: true,
			GetResult: function()
			{
				return (arr4.length === 3 && arr4[0].Value === 10003 && arr4[1].Value === 10004 && arr4[2].Value === 10005);
			}
		},
		{
			Message: "Clear function was able to remove all elements from an array",
			Expected: true,
			GetResult: function()
			{
				return (arr5.length === 0 && arr5[0] === undefined);
			}
		}
	]
}

Tests.Copy = function()
{
	var arrays = [];
	var copies = [];

	this.Description = "Copy function can create a shallow copy of collections (Array, NodeList, HTMLCollection)";

	this.Execute = function()
	{
		var testTypes = UnitTestHelper.TestValues.GetTypes(["string[]", "integer[]", "float[]", "object[]", "NodeList", "HTMLCollection"]);

		Fit.Array.ForEach(testTypes, function(testType)
		{
			Fit.Array.ForEach(testTypes, function(testType)
			{
				var type = testType.Type;

				Fit.Array.ForEach(testType.Values, function(arr)
				{
					Fit.Array.Add(arrays, arr);
					Fit.Array.Add(copies, Fit.Array.Copy(arr));
				});
			});
		});
	}

	this.Assertions =
	[
		{
			Message: "Successfully copied collections: string[], integer[], float[], object[], NodeList, HTMLCollection",
			Expected: true,
			GetResult: function()
			{
				var arr = null;
				var copy = null;

				for (var i = 0 ; i < arrays.length ; i++)
				{
					arr = arrays[i];
					copy = copies[i];

					if (arr.length !== copy.length)
						return false;

					Fit.Array.ForEach(arr, function(item)
					{
						if (Fit.Array.Contains(copy, item) === false)
							return false;
					});
				}

				return true;
			}
		}
	]
}

Tests.ToArray = function()
{
	var collections = [];
	var converts = [];

	this.Description = "ToArray function can turn collections (NodeList, HTMLCollection) into native JS arrays";

	this.Execute = function()
	{
		var testTypes = UnitTestHelper.TestValues.GetTypes(["NodeList", "HTMLCollection"]);

		Fit.Array.ForEach(testTypes, function(testType)
		{
			Fit.Array.ForEach(testTypes, function(testType)
			{
				var type = testType.Type;

				Fit.Array.ForEach(testType.Values, function(coll)
				{
					Fit.Array.Add(collections, coll);
					Fit.Array.Add(converts, Fit.Array.ToArray(coll));
				});
			});
		});
	}

	this.Assertions =
	[
		{
			Message: "NodeList and HTMLCollection turned into native JS arrays",
			Expected: true,
			GetResult: function()
			{
				var coll = null;
				var convert = null;

				for (var i = 0 ; i < collections.length ; i++)
				{
					coll = collections[i];
					convert = converts[i];

					Fit.Validation.ExpectArray(convert);

					if (coll.length !== convert.length)
						return false;

					Fit.Array.ForEach(coll, function(item)
					{
						if (Fit.Array.Contains(convert, item) === false)
							return false;
					});
				}

				return true;
			}
		}
	]
}

UnitTestHelper.Array = {};
UnitTestHelper.Array.CreateList = function()
{
	function createListItem(val)
	{
		var li = document.createElement("li");
		li.innerHTML = val;
		return li;
	}

	var ul = document.createElement("ul");

	ul.appendChild(createListItem("1"));
	ul.appendChild(createListItem("2"));
	ul.appendChild(createListItem("3"));
	ul.appendChild(createListItem("4"));
	ul.appendChild(createListItem("5"));

	return ul;
}
