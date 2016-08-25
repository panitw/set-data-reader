var restler = require('restler');
var parser = require('./parser');

var url = 'http://marketdata.set.or.th/mkt/sectorquotation.do?language=th&country=TH&market=SET&sector=SET';

module.exports = {
	read: function () {
		return new Promise(function (resolve, reject) {
			restler.get(url)
				   .on('success', function(data) {
						parser(data).then(
							function (result) {
								resolve(result);
							},
							function (err) {
								reject(err);
							}
						);
				   })
				   .on('complete', function (response) {
				   		if (typeof response === 'Error') {
				   			reject(response);
				   		}
				   });
		});
	}	
}