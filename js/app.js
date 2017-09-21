     //MODEL
     var model = {
         //Places to visit in the Neighborood map
         locations: [{
                 title: 'Miami, Floride',
                 city: 'Miami',
                 location: {
                     lat: 25.76168,
                     lng: -80.19179
                 }
             },
             {
                 title: 'Everglades National Park, Floride',
                 city: 'Everglades National Park',
                 location: {
                     lat: 25.286615,
                     lng: -80.89865
                 }
             },
             {
                 title: 'Key West, Floride',
                 city: 'Key-West',
                 location: {
                     lat: 24.555059,
                     lng: -81.779987
                 }
             },
             {
                 title: 'Orlando, Floride',
                 city: 'Orlando',
                 location: {
                     lat: 28.538336,
                     lng: -81.379236
                 }
             },
             {
                 title: 'Cap Coral, Floride',
                 city: 'Cap Coral',
                 location: {
                     lat: 26.562854,
                     lng: -81.949533
                 }
             },
             {
                 title: 'Fort Lauderdale, Floride',
                 city: 'Fort Lauderdale',
                 location: {
                     lat: 26.122439,
                     lng: -80.137317
                 }
             },
             {
                 title: 'Tampa, Floride',
                 city: 'Tampa',
                 location: {
                     lat: 27.950575,
                     lng: -82.457178
                 }
             },
             {
                 title: 'Naples, Floride',
                 city: 'Naples',
                 location: {
                     lat: 26.142036,
                     lng: -81.79481
                 }
             }
         ],

         restaurants: [{
                 title: 'Mr and Mrs Bun',
                 address: '15572 SW 72 St',
                 city: 'Miami',
                 location: {
                     lat: 25.698868,
                     lng: -80.445164
                 }
             },
             {
                 title: 'Red Carpet Italian',
                 address: '3438 SW 8th St',
                 city: 'Miami',
                 location: {
                     lat: 25.764413,
                     lng: -80.25132
                 }
             },
             {
                 title: 'NAOE',
                 address: '668 NW 5th St',
                 city: 'Miami',
                 location: {
                     lat: 25.767399,
                     lng: -80.185415
                 }
             },
             {
                 title: 'Garbo’s Grill',
                 address: ' 15572 SW 72 St',
                 city: 'Key-West',
                 location: {
                     lat: 24.557802,
                     lng: -81.805402
                 }
             },
             {
                 title: 'Bien Caribbean Latino',
                 address: '1000 Eaton St',
                 city: 'Key-West',
                 location: {
                     lat: 24.560488,
                     lng: -81.797515
                 }
             },
             {
                 title: 'Juana La Cubana Cafe',
                 address: '2850 SW 54th St',
                 city: 'Fort Lauderdale',
                 location: {
                     lat: 26.054233,
                     lng: -80.179617
                 }
             }
         ]
     };

     var Location = function(data) {
         this.title = data.title;
         this.city = data.city;
         this.location = data.location;
     };

     var Restaurant = function(data) {
         this.title = data.title;
         this.address = data.address;
         this.city = data.city;
         this.location = data.location;
         this.marker = data.marker;
     };

     //Create a markers variable
     var markers = [];
     var currentBouncingMarker = null;
     var newInfoWindow;

     //VIEWMODEL
     var ViewModel = function() {
         var self = this;
         self.defaultCaption = ko.observable('Select a city...');
         self.noResults = ko.observable(false);
         self.isVisible = ko.observable(true);
         self.mapError = ko.observable(false);
         self.selectedValue = ko.observable();
         self.locationsList = ko.observableArray([]);
         self.restaurantsList = ko.observableArray([]);
         self.restaurantsListResult = ko.observableArray([]);
         model.locations.forEach(function(locationItem) {
             self.locationsList.push(new Location(locationItem));
         });
         model.restaurants.forEach(function(restaurantItem) {
             self.restaurantsList.push(new Restaurant(restaurantItem));
         });
         self.currentLocation = ko.observable(self.restaurantsList()[0]);


         self.updateCurrentLocation = function(clickedLoc) {
             // Populate the infowindow
             populateInfoWindow(clickedLoc.marker, newInfoWindow);
         };

         self.searchResult = function() {
             var selectedCity = " ";
             if (self.selectedValue() !== undefined) {
                 selectedCity = self.selectedValue().city;
                 hideMarkers(selectedCity);
                 //empty the array before starting
                 self.restaurantsListResult([]);
                 //loop through the restaurantslist array to find the selected city
                 for (var i = 0; i < self.restaurantsList().length; i++) {
                     var n = self.restaurantsList()[i].city.search(self.selectedValue().city);
                     if (n != -1) {
                         self.restaurantsListResult.push(self.restaurantsList()[i]);
                     }

                 }
                 if (self.restaurantsListResult().length === 0) {
                     //if there is no result put back the map to the original center and zoom state
                     self.noResults(true);
                     var center = new google.maps.LatLng(25.664827, -81);
                     map.setCenter(center);
                     map.setZoom(8);

                 } else {
                     self.noResults(false);
                 }
             }
             //if the default option is selected
             else {
                 // show all markers
                 showAllMarkers();
                 self.noResults(false);
             }
         };

     };
     //Create global variable to store instance of View Model
     var vm = new ViewModel();

     //Apply the bindings to the global instance
     ko.applyBindings(vm);


     var nonce_generate = function() {
         return (Math.floor(Math.random() * 1e12).toString());
     };

     var formate_name = function(title, city) {
         var id = title.concat("-" + city);
         id = id.replace(/ /g, "-");
         id = id.replace(/’/g, "");
         id = id.replace(/&/g, "and");
         id = id.toLowerCase();
         return id;

     };

     var LoadData = function(title, city, infowindow) {
         var id = formate_name(title, city);
         var YELP_KEY = 'uIK7QBYn8eOeOOmyId4u7g';
         var YELP_TOKEN = 'mM8r3MlpDUxDcFF2z7Fx-NzwKeqDziKq';
         var YELP_KEY_SECRET = 'fso2MxjLNsPowQmYf4B1zjMCvqM';
         var YELP_TOKEN_SECRET = '0r7JeIj1UZhAuIB92jBC8qU3RWE';
         var yelp_url = 'https://api.yelp.com/v2/business/' + id;
         var parameters = {
             oauth_consumer_key: YELP_KEY,
             oauth_token: YELP_TOKEN,
             oauth_nonce: nonce_generate(),
             oauth_timestamp: Math.floor(Date.now() / 1000),
             oauth_signature_method: 'HMAC-SHA1',
             oauth_version: '1.0',
             callback: 'cb'
         };
         var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
         parameters.oauth_signature = encodedSignature;

         var yelpRequestTimeout = setTimeout(function() {
             var content = '<h2>' + title + '</h2><p>Yelp ratings could not be loaded</p>';
             infowindow.setContent(content);
         }, 3000);

         var settings = {
             url: yelp_url,
             data: parameters,
             cache: true,
             dataType: 'jsonp',
             success: function(results) {
                 var businessRating;
                 var businessImg;
                 var snippetText;
                 var businessLocation;
                 results.image_url ?  businessImg = results.image_url : businessImg = 'No image available';
                 results.snippet_text ?  snippetText = results.snippet_text : snippetText = 'No review available';
                 results.rating_img_url_large ?  businessRating = results.rating_img_url_large : businessRating = 'No rating available';
                 results.location.display_address ?  businessLocation = results.location.display_address : businessLocation = 'No location available';
                 var content = '<h2>' + title + '</h2><div id="yelp-address">Address: ' + businessLocation + '</div><div><img id="yelp-img" alt="business image" src="' + businessImg + '"></div><a href="https://www.yelp.com"><img id="yelp-logo" alt="yelp logo" src="img/Yelp_trademark_RGB.png"></a><br><div id="container2"><div class="rating"><h2 id="yelp-rating-title">Yelp Rating: </h2><img id="img-yelp-rating" alt="rating yelp" src="' + businessRating + '"></div>\
                 <div class="review-snippet"><h2 id="yelp-review-snippet_title">review snippet: </h2><p><i>'+snippetText+'</i></p></div></div>';
                 infowindow.setContent(content);

                 // AN ERROR FUNCTION
                 clearTimeout(yelpRequestTimeout);
             },

         };
         $.ajax(settings);
     };

     // Function to initialize the map within the map div
     function initMap() {
         var style = [{
                 featureType: 'water',
                 stylers: [{
                     color: 'dodgerblue'
                 }]
             },
             {
                 featureType: 'poi.park',
                 elementType: 'geometry',
                 stylers: [{
                         color: '#7ed05d'
                     },
                     {
                         lightness: -40
                     }
                 ]
             }
         ];

         //Create a new map
         map = new google.maps.Map(document.getElementById('map'), {
             center: {
                 lat: 25.664827,
                 lng: -81
             },
             zoom: 7,
             styles: style,
             gestureHandling: 'auto',
             scrollwheel: false,
             mapTypeControl: false
         });

         //style the markers
         var defaultIcon = makeMarkerIcon('0091ff');
         var highlightedIcon = makeMarkerIcon('FFFF24');

         // Create an infowindow
         newInfoWindow = new google.maps.InfoWindow({
             maxWidth: '400',
             disableAutoPan: false
         });


         //Create markers attached to the locations
         for (var i = 0; i < model.restaurants.length; i++) {
             var position = model.restaurants[i].location;
             var title = model.restaurants[i].title;
             var address = model.restaurants[i].address;
             var city = model.restaurants[i].city;
             var marker = new google.maps.Marker({
                 map: map,
                 position: position,
                 city: city,
                 title: title,
                 icon: defaultIcon,
                 animation: google.maps.Animation.DROP,
                 id: i
             });

             //Pusch the marker in the array markers
             markers.push(marker);

             // Create an EVENT LISTENER so that the infowindow opens when
             // the marker is clicked!
             marker.addListener('click', function() {
                 populateInfoWindow(this, newInfoWindow);
             });
             //event listener to change the icon color
             marker.addListener('mouseover', function() {
                 this.setIcon(highlightedIcon);
             });
             marker.addListener('mouseout', function() {
                 this.setIcon(defaultIcon);
             });
         }
         //Add markers to the restaurantList data
         for (i = 0; i < vm.restaurantsList().length; i++) {
             vm.restaurantsList()[i].marker = markers[i];
         }
         //event resize
         google.maps.event.addDomListener(window, "resize", function() {
             var center = map.getCenter();
             google.maps.event.trigger(map, "resize");
             map.setCenter(center);
         });
     }

     function populateInfoWindow(marker, infowindow) {

         if (infowindow.marker != marker) {
             infowindow.setContent('');
             var urlYelp = 'https://www.yelp.com/search?find_desc=restaurant&find_loc=' + marker.title + '&sortby=rating';
             infowindow.marker = marker;
             infowindow.setContent('<div id="info-title">' + marker.title + '</div><br><div id="yelp-rating"></div>');
             LoadData(marker.title, marker.city, infowindow);
             toggleBounce(marker);
             //add event listener to close the info window and stop the bouncing
             infowindow.addListener('closeclick', function() {
                 infowindow.setMarker = null;
                 infowindow.marker = null;
                 marker.setAnimation(null);
             });
             //open the infowindow
             infowindow.open(map, marker);

         }
     }

     function toggleBounce(marker) {
        //check whether currentBouncingMarker has an animation
         if (currentBouncingMarker === null) {
             currentBouncingMarker = marker;
             currentBouncingMarker.setAnimation(google.maps.Animation.BOUNCE);
         }
         else
         {
            //if the currently bouncing marker is not or marker...
             if (currentBouncingMarker != marker) {
                //we stop the bouncing
                currentBouncingMarker.setAnimation(null);
                 currentBouncingMarker = marker;
                 //we start the bouncing for the selected marker
                 currentBouncingMarker.setAnimation(google.maps.Animation.BOUNCE);
             }
            //if the currently bouncing marker is our marker...
            else
            {
                //we stop the bouncing if it is already bouncing
                if(marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                 }
                 //if not bouncing we start it
                 else{
                    currentBouncingMarker.setAnimation(google.maps.Animation.BOUNCE);
                 }
            }
        }
     }


     function makeMarkerIcon(color) {
         var markerImage = new google.maps.MarkerImage(
             'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + color +
             '|40|_|%E2%80%A2',
             new google.maps.Size(21, 34),
             new google.maps.Point(0, 0),
             new google.maps.Point(10, 34),
             new google.maps.Size(21, 34));
         return markerImage;
     }

     function showAllMarkers() {
         var bounds = new google.maps.LatLngBounds();
         //loop on the markers array
         for (var i = 0; i < markers.length; i++) {
             markers[i].setMap(map);
             //Extend the boundaries of the map for each marker
             bounds.extend(markers[i].position);

         }
         map.fitBounds(bounds);
     }

     function hideMarkers(selectedCity) {
         var bounds = new google.maps.LatLngBounds();
         for (var i = 0; i < markers.length; i++) {
             var n = markers[i].city.search(selectedCity);
             if (n == -1) {
                 //hide the markers not matching the selected city
                 markers[i].setMap(null);
             } else {
                 //display the markers that match the selected city
                 markers[i].setMap(map);
                 //extend the bounds to the selected markers
                 bounds.extend(markers[i].position);
                 map.fitBounds(bounds);
             }
         }
     }

     function initMapError() {
         vm.mapError(true);
     }

     function myfunction() {
         vm.isVisible(true);
         var center = map.getCenter();
         google.maps.event.trigger(map, "resize");
         map.setCenter(center);
     }

     function closeNav() {
         vm.isVisible(false);
         var center = map.getCenter();
         google.maps.event.trigger(map, "resize");
         map.setCenter(center);
     }
