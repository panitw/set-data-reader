var restler = require('restler');
var parser = require('./parser');

var url = 'http://marketdata.set.or.th/mkt/sectorquotation.do?language=en&country=US&market=SET&sector=';
var indexUrl = 'http://www.set.or.th/static/mktstat/setindex.csv';

module.exports = {
	read: function () {
		return this.readSector('SET');
	},
	readSector: function (sector) {
		return new Promise(function (resolve, reject) {
			var finalUrl = url + sector;
			restler.get(finalUrl)
				   .on('success', function(data) {
				   		try {
							var parsed = parser.parsePriceData(data);
							if (parsed.length > 0) {
								resolve(parsed);
							} else {
								reject(new Error('Unable to read any data from sector page '+sector));
							}
				   		}
				   		catch (ex) {
				   			reject(ex);
				   		}
				   })
				   .on('complete', function (response) {
				   		if (typeof response === 'Error') {
				   			reject(response);
				   		}
				   });
		});
	},
	readIndices: function () {
		return new Promise(function (resolve, reject) {

			restler.get(indexUrl)
				   .on('success', function(data) {
				   		try {
							var parsed = parser.parseIndexData(data);
							resolve(parsed);
				   		}
				   		catch (ex) {
				   			reject(ex);
				   		}
				   })
				   .on('complete', function (response) {
				   		if (typeof response === 'Error') {
				   			reject(response);
				   		}
				   });
		});
	}
}