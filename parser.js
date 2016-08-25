var cheerio = require('cheerio');

module.exports = function (pageData) {
	var output = [];
	var $ = cheerio.load(pageData);
	var rows = $('table.table-info tr');
	var symbol, open, high, low, close, volume;
	for (var i=0; i<rows.length; i++) {
		var cells = $(rows[i]).find('td');
		if (cells.length === 12) {
			symbol = $(cells[0]).text().trim();
			open = parseFloat($(cells[2]).text());
			high = parseFloat($(cells[3]).text());
			low = parseFloat($(cells[4]).text());
			close = parseFloat($(cells[5]).text());
			volume = parseFloat($(cells[10]).text());
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