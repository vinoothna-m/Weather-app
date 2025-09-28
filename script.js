const apiKey = "1f650a1e7fb145136e455620fb350df3"; // Replace with your OpenWeatherMap API key

const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const sunData = document.getElementById('sunData');

function getWeather(city = null) {
  const cityName = city || document.getElementById('cityInput').value.trim();
  if (!cityName) return alert("Enter a city name!");

  // Current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) return currentWeather.innerHTML = "City not found.";

      const { main, weather, name, sys, wind } = data;
      const icon = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

      document.body.style.backgroundImage = getBackgroundImage(weather[0].main);

      currentWeather.innerHTML = `
        <h2>${name}, ${sys.country}</h2>
        <img src="${icon}" alt="${weather[0].description}">
        <p>${weather[0].description}</p>
        <p>🌡️ Temp: ${main.temp}°C</p>
        <p>💧 Humidity: ${main.humidity}% | 💨 Wind: ${wind.speed} m/s</p>
      `;

      sunData.innerHTML = `
        🌅 Sunrise: ${convertUnix(sys.sunrise)} |
        🌇 Sunset: ${convertUnix(sys.sunset)}
      `;

      // 5-day forecast
      getForecast(cityName);
    });
}
// This is a simplified example. Adjust variable names as per your code.
const weatherCondition = data.weather[0].main.toLowerCase(); // e.g., 'clear', 'rain', 'clouds'

let backgroundUrl = '';
switch(weatherCondition) {
    case 'clear':
        backgroundUrl = 'images/sunny.jpg';
        break;
    case 'rain':
        backgroundUrl = 'images/rainy.jpg';
        break;
    case 'clouds':
        backgroundUrl = 'images/cloudy.jpg';
        break;
    case 'snow':
        backgroundUrl = 'images/snow.jpg';
        break;
    default:
        backgroundUrl = 'images/thunder.jpg';
}

document.body.style.backgroundImage = `url('${backgroundUrl}')`;
document.body.style.backgroundSize = 'cover'; // Make sure the image covers the whole background

function getForecast(cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const days = data.list.filter(f => f.dt_txt.includes("12:00:00"));
      forecast.innerHTML = days.map(day => {
        const date = new Date(day.dt_txt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
        const icon = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        return `
          <div class="forecast-day">
            <strong>${date}</strong>
            <img src="${icon}" alt="${day.weather[0].description}" />
            <p>${day.main.temp}°C</p>
          </div>
        `;
      }).join('');
    });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          document.getElementById('cityInput').value = data.name;
          getWeather(data.name);
        });
    });
  } else {
    alert("Geolocation not supported");
  }
}

function convertUnix(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function getBackgroundImage(condition) {
  const images = {
    Clear: "url('https://source.unsplash.com/1600x900/?sunny,sky')",
    Clouds: "url('https://source.unsplash.com/1600x900/?cloudy')",
    Rain: "url('https://source.unsplash.com/1600x900/?rain')",
    Snow: "url('https://source.unsplash.com/1600x900/?snow')",
    Thunderstorm: "url('https://source.unsplash.com/1600x900/?storm')",
    Mist: "url('https://source.unsplash.com/1600x900/?fog')"
  };
  return images[condition] || "url('https://source.unsplash.com/1600x900/?weather')";
}

