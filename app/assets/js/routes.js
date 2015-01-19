var ApiRouter = (function() {
	'use strict'

	function urlParser(url) {
		var apiKey = '79jkljqj8ntbrx55nvg1uhb1';
		return url + '?includes=Images:1&limit=24&api_key=' + apiKey
	}

	var RouteList = (function() {
		function initial(UI) {
			return {
				url: 'https://openapi.etsy.com/v2/listings/trending.js',
				action: UI ? UI.initialLoad : null
			}
		}
		function search(UI) {
			return {
				url: 'https://openapi.etsy.com/v2/listings/active.js',
				action: UI ? UI.searchItems : null
			}
		}
		function latest(UI) {
			return {
				url: 'https://openapi.etsy.com/v2/listings/active.js',
				action: UI ? UI.latestItems : null
			}
		}
		function addFavorite(UI) {
			return {
				url: 'https://openapi.etsy.com/v2/users/:user_id/favorites/listings/:listing_id'
			}
		} //Needs oAuth =(
		return {
			initial : initial,
			search : search,
			latest : latest
		}	

	})();

	function ApiAccess(target, method, callback, params) {
		if (target && method) {
			$.ajax({
				type: method,
				url: urlParser(ApiRouter.RouteList[target]().url),
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
		ApiAccess: ApiAccess,
		RouteList: RouteList
	}

}());