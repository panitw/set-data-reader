var cheerio = require('cheerio');

module.exports = function (pageData) {
	return new Promise(function (resolve, reject) {
		var $ = cheerio.load(pageData);
	});
};