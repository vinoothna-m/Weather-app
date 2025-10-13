const apiKey = "1f650a1e7fb145136e455620fb350df3";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const cityList = document.getElementById("city-list");
const modeToggle = document.getElementById("mode-toggle");

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.cod !== 200) {
    alert("City not found!");
    return;
  }

  displayWeather(data);
  getForecast(city);
}

function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  const desc = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("city-name").textContent = data.name;
  document.getElementById("temperature").textContent = `${temp}°C`;
  document.getElementById("realfeel").textContent = `Feels like ${feels}°C`;
  document.getElementById("description").textContent = desc;
  document.getElementById("humidity").textContent = `${humidity}%`;
  document.getElementById("wind").textContent = `${wind} m/s`;
  document.getElementById("weather-icon").src = icon;
  document.getElementById("time").textContent = new Date().toLocaleTimeString();

  setWeatherTip(desc);
  setBackground(desc);
}

function setWeatherTip(desc) {
  let tip = "Enjoy your day!";
  if (desc.includes("rain")) tip = "☔ Carry an umbrella today!";
  else if (desc.includes("clear")) tip = "😎 Great day for a walk!";
  else if (desc.includes("snow")) tip = "🧣 Dress warm and stay cozy!";
  else if (desc.includes("cloud")) tip = "☁️ Might get gloomy later!";
  document.getElementById("weather-tip").textContent = tip;
}

function setBackground(desc) {
  const bg = document.getElementById("animated-bg");
  if (desc.includes("rain")) {
    bg.style.backgroundImage = "url('https://cdn.jsdelivr.net/gh/nikhilvijayan007/assets/animated-rain.svg')";
  } else if (desc.includes("cloud")) {
    bg.style.backgroundImage = "url('https://cdn.jsdelivr.net/gh/nikhilvijayan007/assets/animated-clouds.svg')";
  } else if (desc.includes("clear")) {
    bg.style.backgroundImage = "url('https://cdn.jsdelivr.net/gh/nikhilvijayan007/assets/animated-sun.svg')";
  } else {
    bg.style.backgroundImage = "url('https://cdn.jsdelivr.net/gh/nikhilvijayan007/assets/animated-clouds.svg')";
  }
}

async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = "";

  const daily = data.list.filter((_, i) => i % 8 === 0);
  daily.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
    const temp = Math.round(day.main.temp);
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    const div = document.createElement("div");
    div.classList.add("forecast-day");
    div.innerHTML = `<p>${date}</p><img src="${icon}" alt=""><p>${temp}°C</p>`;
    forecastContainer.appendChild(div);
  });

  drawHourlyChart(data.list.slice(0, 8));
}

function drawHourlyChart(hours) {
  const ctx = document.getElementById("tempChart").getContext("2d");
  const temps = hours.map(h => h.main.temp);
  const labels = hours.map(h => new Date(h.dt_txt).getHours() + ":00");

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Hourly Temp (°C)",
        data: temps,
        fill: true,
        tension: 0.4,
        borderColor: "#fff"
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } }
    }
  });
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    addCity(city);
    getWeather(city);
    cityInput.value = "";
  }
});

function addCity(city) {
  const li = document.createElement("li");
  li.textContent = city;
  li.addEventListener("click", () => getWeather(city));
  li.addEventListener("dblclick", () => li.remove());
  cityList.appendChild(li);
}

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  modeToggle.textContent = document.body.classList.contains("dark") ? "🌙" : "☀️";
});
