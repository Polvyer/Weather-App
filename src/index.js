import "./style.css";
import "./fonts/OpenSans-Regular.ttf";
import Cloud from "./images/cloudy.gif";
import Rain from "./images/rain.gif";
import "bootstrap/dist/css/bootstrap.min.css";

const apiKey = "572d281c55a3fb5b4ca4f553f5c5df3f";
console.log(Cloud);
console.log(Rain);

// Check if browser supports geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Callback for geolocation
function showPosition(position) {
  fetchLocation(position.coords);
}

// Get location based on coordinates (latitude, longitude)
async function fetchLocation(coords) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}`
  );
  console.log(response);
  const user = await response.json();
  console.log(user);
  displayLocation(user);
}

// Output weather forecast to UI
function displayLocation(user) {
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
}

// Convert Kelvin to Celcius
function kelvinToCelcius(temp) {
  return Math.ceil(temp - 273.15);
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

getLocation();
