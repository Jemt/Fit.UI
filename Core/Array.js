Fit.Array = {};

Fit.Array.ForEach = function(arr, callback)
{
	for (var i = 0 ; i < arr.length ; i++)
		if (callback(arr[i]) === false)
			break;
}

Fit.Array.Add = function(arr, elm)
{
    arr.push(elm);
}

Fit.Array.Remove = function(arr, elm)
{
    var idx = Fit.Array.GetIndex(arr, elm);

    if (idx !== -1)
        arr.splice(idx, 1);
}

Fit.Array.Clear = function(arr)
{
    arr = [];
}

Fit.Array.GetIndex = function(arr, elm)
{
    for (var i = 0 ; i < arr.length ; i++)
        if (arr[i] === elm)
            return i;

    return -1;
}

/*
// Difference between using ordinary for loop and Fit.Array.ForEach
// can be easily demonstrated with the code below.
// Fit.Array.ForEach creates a new execution scope (closure) which
// ensure the expected array value is used, while an ordinary loop
// results in the same index (i) variable being used, which will
// have the value 3 when all setTimeout callbacks finally fire.

// Will output 1, 3, 6, 8 as expected
Fit.Array.ForEach([1,3,6,8], function(val)
{
	setTimeout(function() { console.log(val); }, 100);
});

// Will output "8" 4 times
for (var i in vals = [1,3,6,8])
{
	setTimeout(function() { console.log(vals[i]); }, 100);
}
*/
