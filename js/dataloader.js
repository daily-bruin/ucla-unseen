var dataURL = "https://spreadsheets.google.com/feeds/list/11bSWs8Lf_MvvvbE19rgKXyWmQ4OjM5bWwhm16-fpEYM/od6/public/values?alt=json";

// takes in JSON object from google sheets and turns into a json formatted
// this way based on the original google Doc
// [
// 	{
// 		'column1': info1,
// 		'column2': info2,
// 	}
// ]
function clean_google_sheet_json(data){
	var formatted_json = [];
	var elem = {};
	var real_keyname = '';
	$.each(data.feed.entry.reverse(), function(i, entry) {
		elem = {};
		$.each(entry, function(key, value){
			// fields that were in the spreadsheet start with gsx$
			if (key.indexOf("gsx$") == 0)
			{
				// get everything after gsx$
				real_keyname = key.substring(4);
				elem[real_keyname] = value['$t'];
			}
		});
		formatted_json.push(elem);
	});
	return formatted_json;
}

var currentCard = -1;
var autoMapScroll = 0;
var mapMarkers = new Array();
var infoWindows = new Array();
var pinToChange = null;
var currentPinIndex = -1;

// Gets data from Google Spreadsheets
$.getJSON(dataURL, function(json){
		var data = clean_google_sheet_json(json);
    var source   = $("#card-template").html();
    var cardTemp = Handlebars.compile(source);

    $("#content").append(cardTemp({apidata: data}));

    $.each(data, function (index, value){
      mapMarkers[mapMarkers.length] = new google.maps.Marker({
          position: new google.maps.LatLng(value["lattitude"], value["longitude"]),
          map: map,
          draggable: false,
          animation: google.maps.Animation.DROP,
          title: value["title"],
          icon: "http://dailybruin.com/images/2015/05/pin.png"
      });

	      var markerIndex = mapMarkers.length-1;
	      google.maps.event.addListener(mapMarkers[markerIndex], 'click', function() {
				clickPin(markerIndex);
	        });

	        var cardID = '#card-' + index;
	        $(window).bind('scroll', function() {

	              if(currentCard > index || autoMapScroll != 0)
	                return;

	              var position = $(cardID).offset().top + $(cardID).outerHeight() - window.innerHeight;
	              if(currentCard == index && $(window).scrollTop() < position)
	              {
	                currentCard--;
					panMapTo(markerIndex-1);
	              }

	              if($(window).scrollTop() >= position && currentCard != index) {
	                currentCard = index;
					panMapTo(markerIndex);
	              }
	        });
	    })

	    // Pan to first item at start
	    panMapTo(0);
	});

	function clickPin(markerIndex)
	{
		if(!mapMarkers[markerIndex])
			return;
		if(autoMapScroll != 0)
		{
			$('html, body').clearQueue();
		}
		autoMapScroll++;
		$('html, body').animate({
			scrollTop: $("#card-" + (markerIndex)).offset().top-75
		}, 200);
		setTimeout(function (){
			autoMapScroll--;
		}, 230);

		panMapTo(markerIndex);
	}

	function panMapTo(markerIndex)
	{
		if(markerIndex == currentPinIndex)
			return;
		mapMarker = mapMarkers[markerIndex];
		if(!mapMarker)
			return;
		currentPinIndex = markerIndex;
		if(pinToChange)
			pinToChange.setIcon("http://dailybruin.com/images/2015/05/pin.png");
		mapMarker.setIcon("http://dailybruin.com/images/2015/05/highlighted-pin.png");
		pinToChange = mapMarker;
		map.panTo(mapMarker.position);
		if(!( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) )) {
			var offset = $(".card").width()/2;
			map.panBy(-offset-16, -30);
		}
	}


	$(document).keydown(function(e) {
	    var code = (e.keyCode ? e.keyCode : e.which);
	    if (code == 40) {
			clickPin(currentPinIndex+1);
	    } else if (code == 38) {
			clickPin(currentPinIndex-1);
		}
	});
