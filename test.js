var reader = require('./index');
reader.readIndices().then(function (results) {
	console.log(results);
});