# Etzie (a.k.a Schmetsy)
Playing around with the etsy API w/o oAuth

*Best viewed in current Chrome browser, but compatible with all modern browsers and responsively designed for mobile.*

# Technologies Used:

## Scaffolding
###[Yeoman](http://yeoman.io/)

   * [Knockout-Boostrap generator](https://www.npmjs.com/package/generator-knockout-bootstrap)
   * [Grunt](http://gruntjs.com/)

Includes the following tools and libraries:

##Libraries

* [Knockout.js](http://knockoutjs.com/) - * my tool of choice for easy two-way data-binding *
* [jQuery](jquery.com)
* [Twitter Bootstrap](http://getbootstrap.com/)
* [Google Fonts](https://www.google.com/fonts)
* [Font Awesome](http://fortawesome.github.io/Font-Awesome/icons/)

##Purpose

To be able to perform basic search, listing and bookmarking of Etsy's catalog and present them in a easy to use ui with only provisional [API](https://www.etsy.com/developers/documentation) access (no 2 factor authentication etc.) and only client side code. This was accomplished using an underlying data-model in knockout bound to an HTML template using a few of Etsy's basic GET endpoints. The bookmarking was done using [HTML5 localStorage](http://www.html5rocks.com/en/features/storage). Routes are handled by the module, [routes.js](https://github.com/dsmith11211/etzie/blob/master/app/assets/js/routes.js) and all of the data-model functionality resides in [appViewModel.js](https://github.com/dsmith11211/etzie/blob/master/app/assets/js/models/appViewModel.js). Feel free to pull and play around!

##TODO

* Better, full-screen ajax loading indicator
* Fixed Header
* Menu Items
* Smoother transition when scrolling to page bottom and loading more data.
* Sexy parallax linked to mouse movement on product boxes when images are larger that their constraint
* Possible light-box style modal when clicking the magnifier icon 

Thanks for looking!
