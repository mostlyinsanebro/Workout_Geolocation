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
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    },
    function () {
      alert('Could not get your location!');
    }
  );
