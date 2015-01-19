'use strict';

/* global define:true*/
define(['jquery',
  'knockout',
  'knockout.validation'
], function($, ko) {

  return function() {
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
    self.isLoading = ko.observable(true);

// Subscriptions ***********************************

    self.selectedItem.subscribe(function(val) {
      if(val.favorite()) { //Check if clicked was a favorite. if so, remove it
        self.removeLocalCopy(val.category_id,val);
        return;
      }
      self.storeLocalCopy(val.category_id,ko.toJSON(val),val); // When value is set (heart clicked), convert it to JSON and store locally
    })

// End Subscriptions *******************************


//Action Functions **********************************
    self.initialLoad = function() {
      self.isLoading(true);
      ApiRouter.ApiAccess(
        'trending',
        'GET',
        self.resultsCallback
      )
    }



    self.afterInit = function() {
      // console.log('model loaded');
      self.lookForFavorites(true);
    }

    self.searchItems = function() {
      self.isLoading(true);
      var query = self.searchQuery();
      ApiRouter.ApiAccess(
        'active',
        'GET',
        self.resultsCallback, {
          keywords: query
        }
      )
    }

    self.latestItems = function() {
      self.isLoading(true);
      ApiRouter.ApiAccess(
        'active',
        'GET',
        self.resultsCallback
      )
    }

    self.resultsCallback = function(data) {
      var results = data.results,
        resultCollection = ko.utils.arrayMap(results, function(item) { // Map results to temp array
          return new EtsyItem(item,ko);
        });
        ApiOffset = ApiOffset + data.results.length;
      if(self.etsyCollection.length <= ApiOffset){
        self.etsyCollection.push.apply(self.etsyCollection, resultCollection); // Push reults into observableArray for UI use
        self.isLoading(false);
      } else {
        self.etsyCollection.removeAll();
        self.etsyCollection.push.apply(self.etsyCollection, resultCollection); // Push reults into observableArray for UI use
        self.isLoading(false);
      }
    }

    self.storeLocalCopy = function(id,json_item,item) {
      if (!localStorage.getItem(id)) { //If item doesn't exist in collection, add it
        localStorage.setItem(id, json_item);
        item.favorite(true);
        FavKeys[id] = true;
      } 
    }

    self.loadLocalCopies = function() {
      var returnArray = self.lookForFavorites();
      self.resultsCallback(returnArray); //Run this data through the generic callback
    }

    self.removeLocalCopy = function(id,item) {
      item.favorite(false); //Update UI favorite icon
      self.etsyCollection.remove(item); //Update UI: Remove item from collection
      delete FavKeys[id]; //Update key map
      localStorage.removeItem(id); //Update local storage
      console.log('favorite removed');
    }

    self.lookForFavorites = function(update) {
      if (!update) {
        var returnArray = {
          results: []
        };
        for (var i = 0; i < localStorage.length; i++) {
          returnArray.results.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }
        return returnArray;
      } else {
        for (var i = 0; i < localStorage.length; i++) {
          FavKeys[localStorage.key(i)] = true;
        }
      }
    }

// Action functions End ********************************************

    self.initialLoad(); //Entry Point

  };

});

var EtsyItem = function(item,ko) {
  var self = this;
  self.category_id = item.category_id;
  self.description = item.description;
  self.title = item.title;
  self.price = item.price;
  self.url = item.url;
  self.favorite = ko.observable(false);
  self.image_url = item.image_url ? item.image_url : item.Images[0].url_570xN; //TODO: Array of all image sizes?
  self.favToggle = function() {
    FavKeys.hasOwnProperty(self.category_id) ? self.favorite(true) : self.favorite(false);
  }
  self.navToItem = function() {
    window.open(self.url, '_blank');
  }
  self.favToggle(); //Initial check of favorite status
}