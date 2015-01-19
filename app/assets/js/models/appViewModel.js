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


//Model Variables *********************************

    self.etsyCollection = ko.observableArray();
    self.selectedItem = ko.observable();
    self.searchQuery = ko.observable();
    self.isLoading = ko.observable(true);
    self.dirtyFlag = ko.observable(false);
    self.currentRoute = ko.observable('');

//End Model Variables *****************************

// Subscriptions ***********************************

    self.selectedItem.subscribe(function(val) {
      if(val.favorite()) { //Check if clicked was a favorite. if so, remove it
        self.removeLocalCopy(val.category_id,val);
        return;
      }
      self.storeLocalCopy(val.category_id,ko.toJSON(val),val); // When value is set (heart clicked), convert it to JSON and store locally
    })

    self.currentRoute.subscribe(function(val) {
      console.log(val);
      self.dirtyFlag(true); //If route has changed, set dirty flag
    })

// End Subscriptions *******************************


//Action Functions **********************************
    self.afterInit = function() { //After model is initialized, build favorites hash
      self.lookForFavorites(true);
    }

    self.initialLoad = function(element,event,offset) { //API call for model load
      var params = {};
      offset ? params.offset = offset : null;     
      self.isLoading(true);
      self.currentRoute('initial');
      ApiRouter.ApiAccess(
        'initial',
        'GET',
        self.resultsCallback,
        params
      )
    }

    self.searchItems = function(element,event,offset) { //API call for search query
      var query = self.searchQuery(),
          params = {keywords: query},
          dirty = self.checkForQueryChange(query);
      offset ? params.offset = offset : null;     
      self.isLoading(true);
      (self.currentRoute() == 'search' && !offset && dirty) ? self.currentRoute.valueHasMutated() : self.currentRoute('search');
       //Need to mutate manually to compensate for new searches if we are already in the search route(multiple searches e.g) TODO: ugh..Hacky^^
      ApiRouter.ApiAccess(
        'search',
        'GET',
        self.resultsCallback,
        params
      )
      QueryCache = query;
    }

    self.latestItems = function(element,event,offset) { //API call for latest query
      var params = {};
      offset ? params.offset = offset : null;
      self.isLoading(true);
      self.currentRoute('latest');
      ApiRouter.ApiAccess(
        'latest',
        'GET',
        self.resultsCallback,
        params
      )
    }

    self.resultsCallback = function(data) { //Generic callback for any API calls. Takes returned results and changes underlying array that updates UI
      var results = data.results,
        resultCollection = ko.utils.arrayMap(results, function(item) { // Map results to temp array
          return new EtsyItem(item,ko);
        });
        ApiOffset = ApiOffset + data.results.length;
      if(!self.dirtyFlag()){ // If we are in the same route, add more data
        self.etsyCollection.push.apply(self.etsyCollection, resultCollection); // Push results into observableArray for UI use
        self.isLoading(false);
      } else { // If the route has changed, clear the collection before adding the new entries
        self.etsyCollection.removeAll();
        self.etsyCollection.push.apply(self.etsyCollection, resultCollection); // Push results into observableArray for UI use
        self.isLoading(false);
        if($(window).scrollTop() !== 0){$(window).scrollTop(0);} //Scroll back to top when switching routes
      }
      self.dirtyFlag(false); //Reset Route change dirty flag
      WindowIsScrolling = false;
    }

    self.storeLocalCopy = function(id,json_item,item) { //Store a favorited item in local storage
      if (!localStorage.getItem(id)) { //If item doesn't exist in collection, add it
        localStorage.setItem(id, json_item);
        item.favorite(true);
        FavKeys[id] = true;
      } 
    }

    self.loadLocalCopies = function() { //Load favorites from local storage
      self.currentRoute('favorites');
      var returnArray = self.lookForFavorites();
      self.resultsCallback(returnArray); //Run this data through the generic callback
    }

    self.removeLocalCopy = function(id,item) { //Remove favorite from local storage
      item.favorite(false); //Update UI favorite icon
      self.etsyCollection.remove(item); //Update UI: Remove item from collection
      delete FavKeys[id]; //Update key map
      localStorage.removeItem(id); //Update local storage
    }

    self.lookForFavorites = function(update) {
      if (!update) { //Load favorites
        var returnArray = {
          results: []
        };
        for (var i = 0; i < localStorage.length; i++) {
          returnArray.results.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }
        return returnArray;
      } else {
        for (var i = 0; i < localStorage.length; i++) { // Populate favorites hash
          FavKeys[localStorage.key(i)] = true;
        }
      }
    }

    self.checkForQueryChange = function(query) {
      return query !== QueryCache ? true : false;
    }

// Action functions End ********************************************

    self.initialLoad(); //Entry Point

  };

});

var EtsyItem = function(item,ko) { //Constructor for each Item Card
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