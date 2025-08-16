const apiKey = "18a3093fb68f6c1bead99825ac8034a1"; // 🔑 Get from https://openweathermap.org/api

async function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city!");

  fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      },
      () => alert("Location access denied.")
    );
  } else {
    alert("Geolocation not supported.");
  }
}

async function fetchWeather(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data.cod !== 200) {
    alert("City not found!");
    return;
  }

  displayWeather(data);
  fetchForecast(data.coord.lat, data.coord.lon);
}

function displayWeather(data) {
  document.getElementById("weather").classList.remove("hidden");
  document.getElementById("city").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("temp").textContent = `🌡️ ${data.main.temp} °C`;
  document.getElementById("desc").textContent = data.weather[0].description;
  document.getElementById("humidity").textContent = `💧 Humidity: ${data.main.humidity}%`;
  document.getElementById("wind").textContent = `💨 Wind: ${data.wind.speed} m/s`;
  document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  // Change background dynamically
  const condition = data.weather[0].main.toLowerCase();
  if (condition.includes("cloud")) {
    document.body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
  } else if (condition.includes("rain")) {
    document.body.style.background = "linear-gradient(to right, #00c6ff, #0072ff)";
  } else if (condition.includes("clear")) {
    document.body.style.background = "linear-gradient(to right, #f7971e, #ffd200)";
  } else {
    document.body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
  }
}

async function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  document.getElementById("forecast").innerHTML = "";
  document.getElementById("forecast-title").classList.remove("hidden");

  // Show next 5 forecast entries (3-hour interval)
  for (let i = 0; i < 5; i++) {
    const item = data.list[i];
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${new Date(item.dt_txt).getHours()}:00</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
      <p>${item.main.temp}°C</p>
    `;
    document.getElementById("forecast").appendChild(div);
  }
}


