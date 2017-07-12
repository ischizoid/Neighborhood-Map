// center of map obj , if changed to another location , must also change (ll) property at ajax call to api
var centerPos = {lat: 29.9626961, lng: 31.2769423};
var mapObj;
mapCls = function(map , centerPos) {
  var self = this;
  this.map = map;
  this.markers = [];
  this.centerPos = centerPos;
  this.bounds = new google.maps.LatLngBounds();
  this.largeInfowindow = new google.maps.InfoWindow({maxWidth: 250});
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
        self.populateInfoWindow(this, self.largeInfowindow, place);
        self.map.panTo(this.position);
      });
      marker.addListener('mouseover', function() {
        this.setAnimation(google.maps.Animation.BOUNCE)
      });
      marker.addListener('mouseout', function() {
        this.setAnimation(null)
      });
    }
  };
  this.populateInfoWindow = function(marker, infowindow, place) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div><h4>' + marker.title + '</h4><p>Category : ' + place.category +'<br>Rate : ' + place.rate + '<br>User Review : '+place.review+'</p></div>');
      infowindow.open(self.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }

};


function initMap() {
  var styles = [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#c4c4c4"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#707070"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21},{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#be2026"},{"lightness":"0"},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"hue":"#ff000a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#575757"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#999999"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"saturation":"-52"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
  var map = new google.maps.Map(document.getElementById('map'), {
    center: centerPos,
    zoom: 12,
    styles: styles,
    mapTypeControl: false
  });
  mapObj = new mapCls(map, centerPos)

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
