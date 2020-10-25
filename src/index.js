import "./style.css";
import "./fonts/OpenSans-Regular.ttf";
import Cloud from "./images/cloudy.gif";
import Rain from "./images/rain.gif";
import "bootstrap/dist/css/bootstrap.min.css";
import { mod } from "./modules";

console.log(Cloud);
console.log(Rain);

// Check if browser supports geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
    // New York default
    fetchLocationCity("New York");
  }
}

// Callback for geolocation
function showPosition(position) {
  fetchLocationCoords(position.coords);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
    default:
      console.log("No switch case ran.");
  }
}

// Get location based on coordinates (latitude, longitude)
async function fetchLocationCoords(coords) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${mod.module}`
    );
    console.log(response);
    const user = await response.json();
    console.log(user);
    displayLocation(user);
  } catch {
    console.log("Search failed.");
    // New York default
    fetchLocationCity("New York");
  }
}

// Get location based on city
async function fetchLocationCity(city) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${mod.module}`
    );
    console.log(response);
    const user = await response.json();
    console.log(user);
    displayLocation(user);
  } catch {
    console.log("Search failed.");
    alert("Err..search failed! Try again!");
  }
}

// Output weather forecast to UI
function displayLocation(user) {
  loader.style.display = "None";
  // Get DOM elements
  const h1 = document.querySelector(".name-country");
  const pTemp = document.querySelector(".temp");
  const temp = kelvinToCelcius(user.main.temp);
  const pHumidity = document.querySelector(".humidity");
  const pFeelsLike = document.querySelector(".feels-like");
  const pDescription = document.querySelector(".description");
  const currentTemp = document.querySelector(".current-temp");
  const lowTemp = document.querySelector(".low-temp");
  const highTemp = document.querySelector(".high-temp");
  const tomorrowTemp = document.querySelector(".tomorrow-temp");

  // Update DOM elements
  h1.textContent = `${user.name}, ${user.sys.country}`;
  updateDate();
  pTemp.textContent = `${temp}°C`;
  pHumidity.textContent = `Humidity: ${user.main.humidity}%`;
  pFeelsLike.textContent = `Feels Like: ${kelvinToCelcius(
    user.main.feels_like
  )}°C`;
  pDescription.textContent = `Description: ${user.weather[0].description}`;
  currentTemp.textContent = `${temp}°C`;
  lowTemp.textContent = `${kelvinToCelcius(user.main.temp_min)}°C`;
  highTemp.textContent = `${kelvinToCelcius(user.main.temp_max)}°C`;
  tomorrowTemp.textContent = `${temp}°C`;

  // Check if custom switch is toggled to fahrenheit -> celcius -> fahrenheit
  if (customSwitch.checked) {
    updateTemperatures(customSwitch.checked);
  }
}

// Convert Kelvin to Celcius
function kelvinToCelcius(temp) {
  return Math.floor(temp - 273.15);
}

// Update date and output to UI
function updateDate() {
  const pDate = document.querySelector(".date");
  const date = extractDate(getDate());
  pDate.textContent = `${date.dayOfTheWeek} ${date.month} ${date.day} ${date.year} ${date.time}`;

  // Call this function again in 1000ms
  setTimeout(updateDate, 1000);
}

// Get date
function getDate() {
  return new Date();
}

// Parses date
function extractDate(date) {
  const dateArr = date.toString().split(" ");
  return {
    dayOfTheWeek: dateArr[0],
    month: dateArr[1],
    day: dateArr[2],
    year: dateArr[3],
    time: dateArr[4],
  };
}

// Update temperatures and output to UI
function updateTemperatures(checked) {
  const temps = document.querySelectorAll(".temps");
  for (let i = 0; i < temps.length; i += 1) {
    let newTemp = extractNumb(temps[i].textContent);
    // Check if custom switch val is true
    if (checked) {
      newTemp = celciusToFahrenheit(newTemp);
    } else {
      newTemp = fahrenheitToCelcius(newTemp);
    }
    // Custom if statement for "Feels like:" text
    if (i === 1) {
      temps[i].textContent = `Feels like: ${newTemp}`;
    } else {
      temps[i].textContent = newTemp;
    }
  }
}

// Parses text
function extractNumb(txt) {
  return txt.match(/-?\d/g).join("");
}

// Convert Celcius to Fahrenheit
function celciusToFahrenheit(temp) {
  return `${Math.floor((temp * 9) / 5 + 32)}°F`;
}

// Convert Fahrenheit to Celcius
function fahrenheitToCelcius(temp) {
  return `${Math.ceil(((temp - 32) * 5) / 9)}°C`;
}

/* Event listener callbacks */
// For when the user toggles the custom switch
function changeTempUnit() {
  updateTemperatures(this.checked);
}

// For when the user submits a search
function parseSearch(e) {
  e.preventDefault();
  const searchVal = document.getElementById("searchBox");
  if (searchVal.value) {
    fetchLocationCity(searchVal.value);
  } else {
    console.log("Empty");
  }
  searchVal.value = "";
}

const customSwitch = document.getElementById("customSwitch1");
const form = document.getElementById("form1");
const loader = document.querySelector(".loader");
customSwitch.addEventListener("change", changeTempUnit.bind(customSwitch));
form.addEventListener("submit", parseSearch.bind(form));
getLocation();
