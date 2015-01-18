'use strict';

/* global define:true*/
define(['jquery',
    'knockout',
    'knockout.validation'
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

    self.initialLoad = function() {
      ApiRouter.ApiAccess(
        'active',
        'GET',
        function(data){
          var results = data.results,
              resultCollection = ko.utils.arrayMap(results,function(item) { // Map results to temp array
                return new EtsyItem(item);
              });

          self.etsyCollection.push.apply(self.etsyCollection,resultCollection);// Push reults into observableArray for UI use
          console.log(self.etsyCollection());
        });
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
  }
