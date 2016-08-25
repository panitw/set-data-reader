var reader = require('./index');

reader.read().then(function (data) {
	console.log(data);
});