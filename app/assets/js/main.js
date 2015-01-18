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

});
