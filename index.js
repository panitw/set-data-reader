var restler = require('restler');
var parser = require('./parser');

var url = 'http://marketdata.set.or.th/mkt/sectorquotation.do?language=en&country=US&market=SET&sector=';
var sectors = ['AGRO', 'CONSUMP', 'FINCIAL', 'INDUS', 'PROPCON', 'RESOURC', 'SERVICE', 'TECH'];

module.exports = {
	read: function () {
		return new Promise(function (resolve, reject) {
			var allPromises = [];
			for (var i=0; i<sectors.length; i++) {
				allPromises.push(this.readSector(sectors[i]));
			}
			return Promise.all(allPromises).then(
				function (results) {
					var merged = [].concat.apply([], results);
					resolve(merged);
				},
				function (err) {
					reject(err);
				}
			);
		}.bind(this));
	},
	readSector: function (sector) {
		return new Promise(function (resolve, reject) {
			var finalUrl = url + sector;
			restler.get(finalUrl)
				   .on('success', function(data) {
						var parsed = parser(data);
						if (parsed.length > 0) {
							resolve(parsed);
						} else {
							reject(new Error('Unable to read any data from sector page '+sector));
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