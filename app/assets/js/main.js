'use strict';

/* global define:true*/
define(['jquery',
	'knockout',
	'../../assets/js/models/appViewModel.js',
	'jquery.bootstrap',
	'../../assets/js/routes.js'
], function($, ko, AppViewModel) {

	var UI = new AppViewModel();

		ko.applyBindings(UI); //Apply bindings to knockout model

	$("#menu-toggle").click(function(e) { //Toggle for side menu show/hide
	    e.preventDefault();
	    $("#wrapper").toggleClass("toggled");
	});

	$(window).scroll(function(e) {  //Function to load more data when user scrolls to bottom of screen
	    if($(window).scrollTop() == $(document).height() - $(window).height()) {
	    	if(!WindowIsScrolling) {
	    		WindowIsScrolling = true;
		    	var route = UI.currentRoute(),
		    		action = ApiRouter.RouteList[route](UI).action;

		    	action(null,e,ApiOffset); //Run appropriate method for loading
		    	console.log('Window load');
	    	}
	    }
	});

});
