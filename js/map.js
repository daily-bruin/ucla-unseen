
// The latitude and longitude of your business / place
var position = [34.0708189, -118.4531212];

function showGoogleMaps() {

    var latLng = new google.maps.LatLng(position[0], position[1]);

    var mapOptions = {
        zoom: 18, // initialize zoom level - the max value is 21
        streetViewControl: false, // hide the yellow Street View pegman
        scaleControl: false, // allow users to zoom the Google Map
		 navigationControl: false,
		mapTypeControl: false,
		scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: latLng
    };

    map = new google.maps.Map(document.getElementById('googlemaps'),
        mapOptions);

}

google.maps.event.addDomListener(window, 'load', showGoogleMaps);
