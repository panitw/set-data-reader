var cheerio = require('cheerio');
var moment = require('moment');
var Papa = require('papaparse');

function parseNumber(str) {
	return parseFloat(str.replace('+','').replace(/,/g, ''));
}

function parsePriceData (pageData) {
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
			date = moment(dateText, 'DD/MM/YYYY hh:mm:ss').toDate();
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
		} else
		if (cells.length === 8) {
			symbol = $(cells[0]).text().trim();
			close = parseNumber($(cells[1]).text());
			change = parseNumber($(cells[2]).text());
			high = parseNumber($(cells[4]).text());
			low = parseNumber($(cells[5]).text());
			open = close - change;
			volume = parseNumber($(cells[6]).text()) * 1000;
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

function parseIndexData(indexData) {

	var results = Papa.parse(indexData, {
		header: true
	});

	var fields = results.meta.fields;
	var data = results.data;

	//Convert date and find the newest data
	var newestData = null;	
	for (var i=0; i<data.length; i++) {
		var item = data[i];
		item.Date = moment(item.Date, 'DD/MM/YYYY').toDate();

		if (!newestData) {
			newestData = item;
		} else {
			if (item.Date > newestData.Date) {
				newestData = item;
			}
		}
	}

	var output = [];
	if (newestData) {
		for (var i=1; i<fields.length; i++) {
			output.push({
				date: newestData.Date,
				symbol: fields[i].trim(),
				close: parseFloat(newestData[fields[i]])
			});
		}
	}

	return output;
}

module.exports = {
	parsePriceData: parsePriceData,
	parseIndexData: parseIndexData
}