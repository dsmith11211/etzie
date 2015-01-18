var ApiRouter = (function() {
	'use strict'

	function urlParser(url) {
		var apiKey = '79jkljqj8ntbrx55nvg1uhb1';

		return url + '?includes=Images:1&api_key=' + apiKey

	}

	var RouteList = {
		active: 'https://openapi.etsy.com/v2/listings/active.js',

	}

	function ApiAccess(target, method, callback, params) {
		if (target && method) {
			$.ajax({
				type: method,
				url: urlParser(RouteList[target]),
				data: params,
				dataType: "jsonp",
				success: callback,
				error: function(data) {
					/*TODO: Handle error in UI*/
					console.log("api error: %O", data);
				}
			});
		} else {
			console.log('Missing target or method params');
		}
	}

	return {
		ApiAccess: ApiAccess
	}

}());