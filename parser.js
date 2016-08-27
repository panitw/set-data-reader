var cheerio = require('cheerio');
var moment = require('moment');

function parseNumber(str) {
	return parseFloat(str.replace(/,/g, ''));
}

module.exports = function (pageData) {
	var output = [];
	var date = null;
	var $ = cheerio.load(pageData);

	//Get Last Updated
	var captions = $('caption');
	for (var i=0; i<captions.length; i++) {
		var captionText = $(captions[i]).text().trim();
		var markerIndex = captionText.indexOf('Last Update');
		if (markerIndex > -1) {
			var dateText = captionText.substring(markerIndex + 11).trim();
			date = moment(dateText, 'DD MMM YYYY hh:mm:ss').startOf('day').toDate();
			break;
		}
	}

	if (date === null) {
		throw new Error('No date found in the page');
	}

	//Get Data
	var rows = $('table.table-info tr');
	var symbol, open, high, low, close, volume;
	for (var i=0; i<rows.length; i++) {
		var cells = $(rows[i]).find('td');
		if (cells.length === 12) {
			symbol = $(cells[0]).text().trim().replace('&','N');
			open = parseNumber($(cells[2]).text());
			high = parseNumber($(cells[3]).text());
			low = parseNumber($(cells[4]).text());
			close = parseNumber($(cells[5]).text());
			volume = parseNumber($(cells[10]).text());
			if (!isNaN(open) && !isNaN(high) && !isNaN(low) && !isNaN(close) && !isNaN(volume)) {
				output.push({
					symbol: symbol,
					date: date,
					open: open,
					high: high,
					low: low,
					close: close,
					volume: volume
				});
			}
		}
	}
	return output;
};