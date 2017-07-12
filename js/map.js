// center of map obj , if changed to another location , must also change (ll) property at ajax call to api
var centerPos = {lat: 29.9626961, lng: 31.2769423};
var mapObj;

MapCls = function(map , centerPos, bounds, infoWindow) {
  var self = this;
  this.map = map;
  this.markers = [];
  this.bounds = bounds;
  this.centerPos = centerPos;
  this.infoWindow = infoWindow;
  this.makeMarkers = function(places) {
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      var marker = new google.maps.Marker({
        id: place.id,
        title: place.name,
        position: place.position
      });
      self.markers.push(marker);
      self.bounds.extend(place.position);
      marker.addListener('click', function() {
        for (var i = 0; i < self.markers.length; i++) {
          self.markers[i].setAnimation(null);
        }
        this.setAnimation(google.maps.Animation.BOUNCE)
        self.populateInfoWindow(this, self.infoWindow, place);
        self.map.panTo(this.position);
        self.map.panBy(0,-100);
      });
    }
  };
  this.populateInfoWindow = function(marker, infoWindow, place) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
      infoWindow.setContent('<div><h4>' + marker.title + '</h4><p>Category : ' + place.category +'<br>Rate : ' + place.rate + '<br>User Review : '+place.review+'</p></div>');
      infoWindow.open(self.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infoWindow.addListener('closeclick',function(){
        infoWindow.setMarker = null;
      });
    }
  }

};

function logMapError() {
  mapError = 'Google maps Error'
}

function initMap() {
  var mapStyles = [];
  $.getJSON('map-styles.json', function(data) {
    for (var i = 0; i < data.length; i++) {
      mapStyles.push(data[i]);
    }
  }).fail(function(err) {
    mapError = 'map styles loading error '
  });
  var map = new google.maps.Map(document.getElementById('map'), {
    center: centerPos,
    zoom: 12,
    styles: mapStyles,
    mapTypeControl: false
  });
  var bounds = new google.maps.LatLngBounds();
  var infoWindow = new google.maps.InfoWindow({maxWidth: 250});
  mapObj = new MapCls(map, centerPos, bounds, infoWindow)

  // listen to sidebar expand/collapse to resize the map and repostion
  $('body').bind('expanded.pushMenu', function() {
    var center = mapObj.map.getCenter();
    $('#map').css('width', $(window).width()-$('#sidebar').width());
    google.maps.event.trigger(mapObj.map, 'resize');
    mapObj.map.setCenter(center);
  });
  $('body').bind('collapsed.pushMenu', function() {
    var center = mapObj.map.getCenter();
    $('#map').css('width', $(window).width());
    google.maps.event.trigger(mapObj.map, 'resize');
    mapObj.map.setCenter(center);
  });
  // listen to window resize resize the map and repostion
  $(window).bind('resize', function() {
    $('#map').css('width', '');
    var center = mapObj.map.getCenter();
    google.maps.event.trigger(mapObj.map, 'resize');
    mapObj.map.setCenter(center);
  });
}
