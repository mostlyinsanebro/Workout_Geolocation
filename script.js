'use strict';
// prettier-ignore
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Select the elements

// Using the Geolocation API
// Geolocation is a browser's API that we can use to get the current position of our device.
// For that use, navigator.geolocation.getCurrentPosition() method.
// The getCurrentPosition() method takes two callback functions as parameters, it calls the first cbF and passes the
// position object [having data regarding currentLocation and other data].The second cbF is called in case the API could
// not fetch the current location for some reason.

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
      const map = L.map('map').setView(coords, 13);

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
      map.on('click', function (mapEvent) {
        // Get the coordinates that the mapEvent has and add a marker to the map with popup.
        const lat = mapEvent.latlng.lat;
        const lng = mapEvent.latlng.lng;
        // console.log(mapEvent, lat, lng);

        // Add marker to clicked coords.Here what we are doing is that, we are first creatring a marker on lat, lng coords
        // then we are adding that marker to the map, then we are creating a popup using L.popup() and giving all features to it
        // and then binding that opoup to the marker and then opening that popup using openPopup().
        L.marker([lat, lng])
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
