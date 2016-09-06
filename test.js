var reader = require('./index');
reader.read().then(function (results) {
	console.log(results[0]);
});