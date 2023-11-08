'use strict';
// prettier-ignore
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Select the elements
const form = document.querySelector('.form');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const type = document.querySelector('.form__input--type');
// Using the Geolocation API
// Geolocation is a browser's API that we can use to get the current position of our device.
// For that use, navigator.geolocation.getCurrentPosition() method.
// The getCurrentPosition() method takes two callback functions as parameters, it calls the first cbF and passes the
// position object [having data regarding currentLocation and other data].The second cbF is called in case the API could
// not fetch the current location for some reason.

let map, mapEvent;
// First check if the geolocation even exists or not in the browser because it does not in some of the old browsers.
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // latitude and longitude of the device are there in the coords object of position object.

      // Getting latitude and longitude of the device.
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const coords = [latitude, longitude];
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      // Here, L is the namespace that leaflet provides us to work with it like Intl.
      // The map method will fetch and display the map in the html element with the 'map' class.
      // The map will be rendered at the coordinates in the array. 13 is the zoom% i.e. how much the map will be zoomed.
      map = L.map('map').setView(coords, 13);

      // tileLayer method will display map in form of tiles in the .png format.
      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // marker method displays the marker on the coords coordinates.
      // Here we are creating a marker on the coords and then adding it to the map that leaflet gave us
      // After that, created the popup with A pretty... text in it and opened it with openPopup() method.
      // L.marker(coords)
      //   .addTo(map)
      //   .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      //   .openPopup();

      // Now, we want to add the eventListener to the map so that when a user clicks on some coordinates, the marker
      // appears on those coordinates. For that, add eventListener on the map object returned by the lefalet library.
      // on eventHandler will call a cb function and will pass an event to it as well when map is clicked which will have
      // the coordinates of the point that was clicked on map.
      map.on('click', function (mapE) {
        // Get the coordinates that the mapEvent has and add a marker to the map with popup.
        // const lat = mapEvent.latlng.lat;
        // const lng = mapEvent.latlng.lng;
        // console.log(mapEvent, lat, lng);
        mapEvent = mapE;

        // Add marker to clicked coords.Here what we are doing is that, we are first creatring a marker on lat, lng coords
        // then we are adding that marker to the map, then we are creating a popup using L.popup() and giving all features to it
        // and then binding that opoup to the marker and then opening that popup using openPopup().
        // L.marker([lat, lng])
        //   .addTo(map)
        //   .bindPopup(
        //     L.popup({
        //       maxWidth: 250,
        //       maxHeight: 100,
        //       autoClose: false,
        //       closeOnClick: false,
        //       className: 'running-popup',
        //       content: 'Workout',
        //     })
        //   )
        //   .openPopup();

        // Make the form visible when the suerr clicks on the map.
        form.classList.remove('hidden');

        // Now, for better user experience, we want that the focus is on distance field by default so the
        // user can start typeing right away.
        inputDistance.focus();

        // Now, we want that when the user submits the form i.e. presses enter then the marker is displayed on the map.
        // For that, we will have to add eventListener to the form for submit event.
      });
    },
    function () {
      alert('Could not get your location!');
    }
  );

// Displaying the map using

// Include the leaflet library in our script. - Done
console.log(firstName);

// Include the code to render the map on the current cooordinates from leaflet website. - Done

// Also, change the change the theme of the map in which it is displayed to -> fr/hot. - Done

// Adding eventListener to the form that gets triggered when the user submits the form i.e. hits enter
// on any of the input fields.

// When user submits the form, the marker should appear on screen and the input values should get cleared.
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Clearing the input fields.
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';

  inputDistance.focus();

  // Now, display the marker on map on the coordinates where the user clicked on the map.

  // Here, we have two problems one is we do not have access to the mapEvent and we also do not have access to map object.
  // For solving that, make both of them the global variables and then set them to the suitable values once the user clicks
  // on the map.
  L.marker(mapEvent.latlng)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        maxHeight: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
        content: 'Workout',
      })
    )
    .openPopup();
});

// Now, we want that when the user changes the input type, then the inputCadence and inputElevation should toggle
// i.e. when the type is running, then the cadence field should be displayed and when the user changes type to Cycling
// then inplace of cadence , we elevation gain should be displayed.
// For that, add eventListener to Type field or element which listens to the change event.
// Toggle the hidden class from those two elements.
type.addEventListener('change', function (e) {
  // First, select the parent row that has the form--row class on it,toggle the form--row--hidden class on it
  // then, if the hiddden class will be there on it it will get removed and if not, it will get hidden.
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

  // Also, do this for inputElevation. What it will do is that if running is selected then cadence will be visible
  // and if cycling is selected then elevation gain will be visible.
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
});
