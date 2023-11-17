'use strict';

//const mapEl = document.querySelector('.map');
const form = document.querySelector('.form');
const distanceInput = document.querySelector('.form__input--distance');
const durationInput = document.querySelector('.form__input--duration');
const cadenceInput = document.querySelector('.form__input--cadence');
const elevationGainInput = document.querySelector('.form__input--elevation');
const inputType = document.querySelector('.form__input--type');
const workouts = document.querySelector('.workouts');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const month = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      month[this.date.getMonth()]
    } ${this.date.getDate()} `;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this._caclPace();
    this._setDescription();
  }

  _caclPace() {
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this._calcSpeed();
    this._setDescription();
  }

  _calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
  }
}

let workoutLatitude, workoutLongitude;
let map, workout;

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getLocation();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleInputType);
    workouts.addEventListener('click', this._moveMarkerOnClick.bind(this));
    this._getLocalStorage();
  }

  _getLocation() {
    // Use the geolocation API and render the map and marker on the current location.
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          return alert('Could not get your current location!');
        }
      );
  }

  _loadMap(position) {
    //console.log(this);
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    map = L.map('map').setView([lat, long], 13);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(wrk => this._renderWorkoutMarker(wrk));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    //console.log(this.#mapEvent);
    form.classList.remove('hidden');
    distanceInput.focus();
  }

  _hideForm() {
    // What we are doing here is that when the form will be sumitted and _newWorkout function will be called
    // then this function will be called and then then we need to hide it, so we will first set the style to none
    // because on adding the hidden class, it will translate to -30 vertically which creates a sliding effect upwards
    // and we do not want that, so to tackle that, first we set the style to none and after a second make it grid again
    // so when new workout is to be added the submit form appears with a sliding effect.

    form.style.display = 'none';
    form.classList.add('hidden');

    setTimeout(function () {
      form.style.display = 'grid';
    }, 1000);
  }

  _newWorkout(e) {
    e.preventDefault();
    const validateInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const positiveNumbers = (...inputs) => inputs.every(inp => inp > 0);
    workoutLatitude = this.#mapEvent.latlng.lat;
    workoutLongitude = this.#mapEvent.latlng.lng;

    const distance = Number(distanceInput.value);
    const duration = Number(durationInput.value);
    const lat = this.#mapEvent.latlng.lat;
    const lng = this.#mapEvent.latlng.lng;

    if (inputType.value == 'running') {
      const cadence = Number(cadenceInput.value);

      if (
        !validateInputs(distance, duration, cadence) ||
        !positiveNumbers(distance, duration, cadence)
      ) {
        return alert('Please enter positive numbers as input!');
      }

      workout = new Running([lat, lng], distance, duration, cadence);
      //console.log(workout);
    }

    if (inputType.value == 'cycling') {
      const elevation = +elevationGainInput.value;

      if (
        !validateInputs(distance, duration, elevation) ||
        !positiveNumbers(distance, duration)
      ) {
        return alert('Please enter positive numbers as input!');
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
      //console.log(workout);
    }

    this.#workouts.push(workout);
    // console.log(this.#workouts);

    // Clear the inputs
    distanceInput.value =
      durationInput.value =
      cadenceInput.value =
      elevationGainInput.value =
        '';
    this._renderWorkoutMarker(workout);

    this._addWorkoutToSidebar(workout);

    this._hideForm();

    this._addToLocalStorage();
  }

  _moveMarkerOnClick(e) {
    const target = e.target;

    const clickedElement = target.closest('.workout');

    if (!clickedElement) return;

    const id = clickedElement.dataset.id;

    const clickedObject = this.#workouts.find(wrk => wrk.id === id);

    map.setView(clickedObject.coords, 14, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _addWorkoutToSidebar(workout) {
    let html = `
         <li class="workout ${workout.type}" data-id=${workout.id}>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
           </div>
           `;

    if (workout.type === 'running')
      html += `
    <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.pace}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${workout.cadence}</span>
    <span class="workout__unit">spm</span>
  </div>
</li>`;

    if (workout.type === 'cycling')
      html += `
    <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;

    form.insertAdjacentHTML('afterend', html);
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          maxHeight: 100,
          closeOnClick: false,
          className: `${workout.type}-popup`,
          autoClose: false,
        }).setContent('Workout')
      )
      .openPopup();
  }

  _toggleInputType() {
    cadenceInput.closest('.form__row').classList.toggle('form__row--hidden');
    elevationGainInput
      .closest('.form__row')
      .classList.toggle('form__row--hidden');
  }

  _addToLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;
    this.#workouts = data;

    this.#workouts.forEach(wrk => this._addWorkoutToSidebar(wrk));
  }
}

const app = new App();
