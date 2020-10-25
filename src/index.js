import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

const apiKey = "572d281c55a3fb5b4ca4f553f5c5df3f";

// Check if browser supports geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    element.textContent = "Geolocation is not supported by this browser.";
  }
}

// Callback for geolocation
function showPosition(position) {
  element.textContent = `Latitude: ${position.coords.latitude} 
  Longitude: ${position.coords.longitude}`;
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

function displayLocation(user) {
  const h1 = document.querySelector(".name-country");
  const pTemp = document.querySelector(".temp");
  const temp = kelvinToCelcius(user.main.temp);
  const pDescription = document.querySelector(".description");

  h1.textContent = `${user.name}, ${user.sys.country}`;
  updateDate();
  pTemp.textContent = `${temp}°C`;
  pDescription.textContent = user.weather[0].description;
}

function getDate() {
  return new Date();
}

function updateDate() {
  const pDate = document.querySelector(".date");
  pDate.textContent = getDate();

  // Call this function again in 1000ms
  setTimeout(updateDate, 1000);
}

function kelvinToCelcius(temp) {
  return Math.ceil(temp - 273.15);
}

const element = document.createElement("div");
getLocation();
document.body.append(element);
