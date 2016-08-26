var cheerio = require('cheerio');

function parseNumber(str) {
	return parseFloat(str.replace(/,/g, ''));
}

module.exports = function (pageData) {
	var output = [];
	var $ = cheerio.load(pageData);
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