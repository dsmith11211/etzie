'use strict';

/* global define:true*/
define(['jquery',
    'knockout',
    'knockout.validation',
    ], function ($, ko) {
  return function () {
    var self = this;

    // Configure knockout validation plugin
    // To decorate form-group elements, use the validationElement binding
    ko.validation.configure({
      decorateElement: true,
      errorElementClass: 'has-error',
      errorMessageClass: 'help-block',
      errorsAsTitle: false
    });

    //End Config



    self.etsyCollection = ko.observableArray();
    self.selectedItem = ko.observable();
    self.searchQuery = ko.observable();

    self.initialLoad = function() {
      ApiRouter.ApiAccess(
        'trending',
        'GET',
        self.resultsCallback
        )
    }

    self.afterInit = function() {
      // console.log('model loaded');
    }

    self.searchItems = function() {
      var query = self.searchQuery();
      ApiRouter.ApiAccess(
        'active',
        'GET',
        self.resultsCallback,
        {keywords: query}
        )
    }

    self.latestItems = function() {
      ApiRouter.ApiAccess(
        'active',
        'GET',
        self.resultsCallback
        )
    }

    self.resultsCallback = function(data) {
      var results = data.results,
          resultCollection = ko.utils.arrayMap(results,function(item) { // Map results to temp array
            return new EtsyItem(item);
          });
      self.etsyCollection.removeAll();
      self.etsyCollection.push.apply(self.etsyCollection,resultCollection);// Push reults into observableArray for UI use
      console.log(self.etsyCollection());
      console.log(data.results);
    }

    self.initialLoad(); //Entry Point


  };

});

  var EtsyItem = function(item) {
    var self = this;
    self.description = item.description;
    self.title = item.title;
    self.price = item.price;
    self.url = item.url;
    self.image_url = item.Images[0].url_570xN; //TODO: Array of all image sizes?

    self.navToItem = function() {
      window.open(self.url,'_blank');
    }

    self.previewItem = function(e) {
      console.log('preview placeholder');
    }
  }
