var reader = require('./index');
reader.readSETIndex().then(function (results) {
	console.log(results);
});