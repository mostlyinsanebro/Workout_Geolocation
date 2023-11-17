# Workout_Geolocation

This project is created for logging the workout data in a fun manner.

Technologies used :- HTML, CSS and JavaScript.

APIs Used:- Geolocation, Leaflet and localStorage.

Functionality :- This project is created for the purpose of logging the user workout data. This webapp fetches the current location of the user's device and then renders the map on that location.
After that, the user can click anywhere on the map and input his workout information -> there are two types of workouts as of now , running and cycling. When the user submits that data, a marker will
be created on the map along with a small bar on the sidebar for that workout with information such as diatnce, duration, speed, cadence or elevation. The user can keep adding workouts and on clicking 
a particular workout on the sidebar, the app will take the user to the marker corresponding to that workout on the map zooming on it.

The data for the workouts persists against the app refresh as well.


Good points of the app -> * Data persists against refreshes.
* The app is based on Geolocation so it can fetch the location of the user's device.


