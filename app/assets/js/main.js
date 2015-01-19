'use strict';

/* global define:true*/
define(['jquery',
	'knockout',
	'../../assets/js/models/appViewModel.js',
	'jquery.bootstrap',
	'../../assets/js/routes.js'
], function($, ko, AppViewModel) {

	var UI = new AppViewModel();

		ko.applyBindings(UI);

	$("#menu-toggle").click(function(e) {
	    e.preventDefault();
	    $("#wrapper").toggleClass("toggled");
	});

	$(window).scroll(function() {
	    if($(window).scrollTop() == $(document).height() - $(window).height()) {
	    	if(CurrentRoute == "trending") {
	    		UI.isLoading(true);
	    		ApiRouter.ApiAccess(
	    		  'trending',
	    		  'GET',
	    		  UI.resultsCallback,
	    		  {offset: ApiOffset}
	    		)
	    	}
	           // ajax call get data from server and append to the div
	    }
	});

});
