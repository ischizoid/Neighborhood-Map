var places = [];
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
    var venues = data.response.groups[0].items;
    for (var i = 0; i < venues.length; i++) {
      var place = venues[i].venue;
      if (place.categories[0]) {
        var category = place.categories[0].name;
        var position = {
          lat: place.location.lat,
          lng: place.location.lng
        };
        places.push(new Place(place.id, place.name, category, position));
      }
    }
    ko.applyBindings(new ViewModel(places));
  },
  error: function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
    console.log(textStatus);
    console.log(jqXHR.responseJSON.meta.errorDetail);
    ko.applyBindings(new ViewModel(places));
    $('#error-msg').text(jqXHR.responseJSON.meta.errorDetail);
    $('#api-error').modal('show')

  }
});


var Place = function (id, name, category, position) {
  this.id = id;
  this.name = name;
  this.category = category;
  this.position = position;
  this.fav = ko.observable(false);
};


var ViewModel = function (places) {
  mapObj.makeMarkers(places);
  var self = this;
  this.places = places;
  this.inputString = ko.observable('');
  this.getMarker = function(place) {
    for (var i = 0; i < mapObj.markers.length; i++) {
      if(mapObj.markers[i].id === place.id){
        return mapObj.markers[i];
      }
    }
  }
  this.listResult = ko.computed(function() {
    var result = [];
    bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < mapObj.markers.length; i++) {
      mapObj.markers[i].setMap(null);
    }
    for (var i = 0; i < self.places.length; i++) {
      var place = self.places[i];
      var marker = self.getMarker(place);
      if (place.name.includes(self.inputString())) {
        result.push(place);
        marker.setMap(mapObj.map);
        bounds.extend(marker.position);
      }
    }
    if (result[0]) {
      mapObj.map.fitBounds(bounds, 160);
    }
    return result
  }, this);
  this.showInfo = function(place) {
    var marker = self.getMarker(place);
    mapObj.populateInfoWindow(marker, mapObj.largeInfowindow);
  };
  this.markerBounce = function(place) {
    var marker = self.getMarker(place);
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
  this.markerStill = function(place) {
    var marker = self.getMarker(place);
    marker.setAnimation(null);
  }
};
