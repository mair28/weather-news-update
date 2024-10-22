// Initialize the map and set the default view
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

// Function to search weather by city name
async function searchCity() {
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    const apiKey = '54dfecb32764672ca5eae983bceb50e6';
    const cityWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(cityWeatherUrl);
        if (!response.ok) throw new Error(`City search error: ${response.status}`);

        const data = await response.json();
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        // Center the map on the searched city
        map.setView([lat, lon], 13);

        // Fetch and display weather for the searched city
        fetchWeather(lat, lon);
    } catch (error) {
        alert(`Error searching for city: ${error.message}`);
    }
}

// Add event listener for "Enter" key on the input field
document.getElementById('cityInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchCity();
    }
});

// Existing function to display current weather information
function displayCurrentWeather(data) {
    const cityName = data.name || 'Unknown Location';
    const countryName = data.sys?.country || '';
    const currentTemp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const weatherDescription = data.weather[0].description;
    const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById('currentWeather').innerHTML = `
        <h3>${cityName}, ${countryName}</h3>
        <div class="temp">
            <img src="${icon}" alt="Weather Icon">
            ${currentTemp}°C
        </div>
        <p>Feels like: ${feelsLike}°C. ${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}.</p>
    `;

    return `${cityName}, ${countryName}`;
}

// Existing function to fetch weather data and update the forecast
async function fetchWeather(lat, lon) {
    const apiKey = '54dfecb32764672ca5eae983bceb50e6';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const currentResponse = await fetch(currentWeatherUrl);
        if (!currentResponse.ok) throw new Error(`Current weather error: ${currentResponse.status}`);
        const currentData = await currentResponse.json();
        const locationName = displayCurrentWeather(currentData);

        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error(`3-hour forecast error: ${forecastResponse.status}`);
        const forecastData = await forecastResponse.json();

        const weatherDiv = document.getElementById('weather');
        weatherDiv.innerHTML = `<h2>Next 3-Hour Forecast for ${locationName}</h2>`;

        forecastData.list.slice(0, 5).forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toLocaleString();
            const temp = forecast.main.temp;
            const weather = forecast.weather[0].description;
            const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

            weatherDiv.innerHTML += `
                <div class="forecast">
                    <strong>${date}</strong><br>
                    <img src="${icon}" alt="Weather icon"><br>
                    Temp: ${temp}°C<br>
                    ${weather}
                </div>
            `;
        });
    } catch (error) {
        alert(`Error fetching weather data: ${error.message}`);
    }
}

// Request user's location and fetch weather data
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Center the map on user's location
        map.setView([lat, lon], 13);

        // Fetch weather data for user's location
        fetchWeather(lat, lon);
    }, error => {
        alert('Location access denied. Click on the map to view weather data.');
    });
} else {
    alert('Geolocation is not supported by this browser.');
}

// Fetch weather data when the map is clicked
map.on('click', e => {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    map.setView([lat, lon], 13);

    // Fetch weather data for the clicked location
    fetchWeather(lat, lon);
});
