var apiError;
var mapError;
var places = [];

// ajax call to foursquare
// exploring venues at specefic lat&lng with radius of 10KM
$.ajax('https://api.foursquare.com/v2/venues/explore', {
  data: {
    ll: '29.9626961,31.2769423',
    radius: 10000,
    client_id: 'BRJCIX0JGDMSV52ER0SUFFMDEYRDTWZ3U4DA4VD5GCV1SNU5',
    client_secret: 'PLEUIRNGNHXJNNEHG1UZFHJKL25IAEJ0WAJPSBVJDTW50TZS',
    v: '20170101'
  },
  success: function (data) {
    console.log(data.response.groups[0].items);
    getPlaces(data);
  },
  error: function (jqXHR, textStatus, errorThrown) {
    apiError = 'foursquare API ERROR - ' + jqXHR.responseJSON.meta.errorDetail;
    // console.log(errorThrown);
    // console.log(textStatus);
    // console.log(jqXHR.responseJSON.meta.errorDetail);
  }
}).complete(function(jqXHR) {
  ko.applyBindings(new ViewModel(places, apiError, mapError));
});


// parsing api response and create array of places
var getPlaces = function (data) {
  var venues = data.response.groups[0].items;
  for (var i = 0; i < venues.length; i++) {
    var place = venues[i].venue;
    if (place.categories[0]) {
      var category = place.categories[0].name;
      var position = {
        lat: place.location.lat,
        lng: place.location.lng
      };
      var review = venues[i].tips[0].text;
      places.push({
        id: place.id,
        name: place.name,
        category: category,
        position: position,
        rate: place.rating,
        review: review
      });
    }
  }
};


var ViewModel = function (places, apiError, mapError) {
  var self = this;
  this.places = places;
  this.error = ko.observable();
  this.inputString = ko.observable('');
  this.selectedPlace = ko.observable();
  this.showCategories = ko.observable(false);
  // if no errot at ajax call, pass places to makeMarkers function
  // listen to changing the center of map
  if (apiError||mapError) {
    if (mapError) {
      this.error(mapError);
    }else {
      this.error(apiError);
    }
  }else {
    mapObj.makeMarkers(places);
    mapObj.map.addListener('center_changed', function () {
      self.selectedPlace(null);
    });
  }
  // fetching Marker from the markers array
  this.getMarker = function(place) {
    for (var i = 0; i < mapObj.markers.length; i++) {
      if(mapObj.markers[i].id === place.id){
        return mapObj.markers[i];
      }
    }
  };
  // showInfo of place and repostion the map center
  this.showInfo = function(place) {
    for (var i = 0; i < mapObj.markers.length; i++) {
      mapObj.markers[i].setAnimation(null);
    }
    var marker = self.getMarker(place);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    mapObj.populateInfoWindow(marker, mapObj.infoWindow, place);
    mapObj.map.panTo(marker.position);
    mapObj.map.panBy(0,-100);
    self.selectedPlace(place);
  };
  // filter through places (.names and .category) and repostion map by places result bounds
  this.listResult = ko.computed(function() {
    var result = [];
    if (self.error()) {
      return null;
    }
    self.showCategories(false);
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < mapObj.markers.length; i++) {
      mapObj.markers[i].setMap(null);
    }
    for (i = 0; i < self.places.length; i++) {
      var place = self.places[i];
      var input = self.inputString();
      var marker = self.getMarker(place);
      if (place.name.match(new RegExp(input, "i"))||place.category.match(new RegExp(input, "i"))) {
        result.push(place);
        marker.setMap(mapObj.map);
        bounds.extend(marker.position);
        if (place.category.match(new RegExp(input, "i"))&&input.length>0) {
          self.showCategories(true);
        }
      }
    }
    if (result[0]) {
      mapObj.map.fitBounds(bounds);
      google.maps.event.addDomListener(window, 'resize', function() {
        mapObj.map.fitBounds(bounds);
      });
    }
    if (!result[0]) {
      mapObj.map.fitBounds(mapObj.bounds);
      return null;
    }
    return result;
  }, this);
};
