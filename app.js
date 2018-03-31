
const STORE = {origin: 'Boring, OR', destination: 'Vancouver, OR'};
const setTotal = total => document.getElementById('total').innerHTML = total + ' miles';

let directionsService;
let directionDisplay;

function initMap() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    panel: document.getElementById('right-panel')
  });
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: { lat: 45.5231, lng: -122.6765 },  //Portland, OR
    disableDefaultUI: true
  });

  // AUTOCOMLETE
  new autocompleteDirectionsHandler(map);
  

  directionsDisplay.setMap(map);
  render();

//   document.getElementById('mode').addEventListener('change', function () {
//     calculateAndDisplayRoute(directionsService, directionsDisplay);
//   });

  directionsDisplay.addListener('directions_changed', function () {
    
    setTotal(computeTotalDistance(directionsDisplay.getDirections()));
  });

}

function autocompleteDirectionsHandler(map){
  var originInput = document.getElementById('start-input');
  var destinationInput = document.getElementById('end-input');
  var originAutocomplete = new google.maps.places.Autocomplete(
    originInput, {placeIdOnly: true});
var destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput, {placeIdOnly: true});
}

function render() {
  calculateAndDisplayRoute(
    directionsService.route.bind(directionsService), 
    directionsDisplay.setDirections.bind(directionsDisplay), 
    STORE.origin, STORE.destination);

}

function formSubmit() {

  $('#location-form').submit((e) => {
    e.preventDefault();
    STORE.origin = $(e.currentTarget).find('#start-input').val();
    STORE.destination = $(e.currentTarget).find('#end-input').val();
    render();
  });
}


function calculateAndDisplayRoute(route, setDirections, origin, destination) {
  route({
    origin: origin,
    destination: destination,
    // add waypoint functionality later
    // waypoints: [{ location: 'Tryon Creek, Portland, OR' }, { location: 'Woodstock, Portland, OR' }],
    travelMode: 'BICYCLING'
  }, function (response, status) {
    if (status == 'OK') {
      setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = parseFloat(total / 1609).toFixed(1);
  return total;
}

$(formSubmit);
