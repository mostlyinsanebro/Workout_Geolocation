// REFACTORED CODE
// CODE BEFORE REFACTORING
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

// Creating classes for storing Workout data.

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat,lng]
    this.distance = distance; // km
    this.duration = duration; // min
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([37, 37], 10, 120, 100);

// const cycling1 = new Cycling([41, 41], 10, 130, 120);

// console.log(run1);
// console.log(cycling1);

/////////////////////////////////////////////////////////
// PROJECT ARCHITECTURE.
class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getLocation();

    // the this keywork in addEventListener points to the DOM element to which the eventListener is attached.
    // So , we have to use the bind function which binds the this keyword to the current app object.
    form.addEventListener('submit', this._newWorkout.bind(this));

    type.addEventListener('change', this._toggleElevationField.bind(this));
  }

  _getLocation() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your location!');
        }
      );
  }

  _loadMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude];
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;

    form.classList.remove('hidden');

    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    // Function to validate inputs
    // (...inputs) -> way to take an array as input.
    const isNumbers = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    // This function is checking whether every one of the numbers present in the array passes to this function is in fact
    // a number or not, if yes, this function will return true. Else, if even one of the value in the array is not a number
    // it will return false, which we can use.

    const isPositives = (...inputs) => inputs.every(inp => inp > 0);

    // Take the inputs from the form.
    const input = type.value;
    const distance = +inputDistance.value; // It comes in the form of string, so convert it to number by using +.
    const duration = +inputDuration.value;
    let workout;
    const lat = this.#mapEvent.latlng.lat;
    const lng = this.#mapEvent.latlng.lng;
    // Pass array to the constructor of both workout types and not the whole object as this.#mapEvent.latlng

    // If the input value is running, take cadence as input, validate the inputs and create a new Running class and add it in
    // workouts array.
    if (input == 'running') {
      const cadence = +inputCadence.value;

      // Validate inputs
      if (
        !isNumbers(distance, duration, cadence) ||
        !isPositives(distance, duration, cadence)
      )
        return alert('Please enter positive numbers!');

      // Create new running object
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If the input value is cycling, take elevation as input, validate the inputs and create a new Running class and add it in
    // workouts array.
    if (input == 'cycling') {
      const elevation = +inputElevation.value;

      // Validate inputs -> not checking -ve for elevation as it can be -ve.
      if (
        !isNumbers(distance, duration, elevation) ||
        !isPositives(distance, duration)
      )
        return alert('Please enter positive numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add workout to workout array
    this.#workouts.push(workout);

    // Render the marker on the map with the desired color.
    this._renderMarkerOnMap(workout);

    // Clearing the input fields.
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    inputDistance.focus();
  }

  _renderMarkerOnMap(workout) {
    // Now, we have set coords == [lat,lng] of the current Workout in workout, so use that.
    // Also add type filed to the running and cycling classes to know which type of activity is that and we will sue it for
    // the popup color.

    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          maxHeight: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
          content: 'Workout',
        })
      )
      .openPopup();
  }
}

const app = new App();
