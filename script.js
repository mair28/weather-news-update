// Initialize the map and set the default view
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

// Display current weather information
function displayCurrentWeather(data) {
    const cityName = data.name || 'Unknown Location';
    const countryName = data.sys?.country || '';
    const currentTemp = data.main.temp;
    const weatherDescription = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // Update the current weather container
    document.getElementById('currentWeather').innerHTML = `
        <h3>${cityName}, ${countryName}</h3>
        <img src="${icon}" alt="Weather Icon">
        <p>Temperature: ${currentTemp}°C</p>
        <p>Weather: ${weatherDescription}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

// Fetch and display both current weather and 3-hour forecast
async function fetchWeather(lat, lon) {
    const apiKey = '54dfecb32764672ca5eae983bceb50e6';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    try {
        // Fetch current weather data
        const currentResponse = await fetch(currentWeatherUrl);
        if (!currentResponse.ok) throw new Error(`Current weather error: ${currentResponse.status}`);
        const currentData = await currentResponse.json();
        displayCurrentWeather(currentData);

        // Fetch 3-hour forecast data
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error(`3-hour forecast error: ${forecastResponse.status}`);
        const forecastData = await forecastResponse.json();

        // Update the 3-hour forecast container
        const weatherDiv = document.getElementById('weather');
        weatherDiv.innerHTML = `<h2>Next 3-Hour Forecast for [${lat.toFixed(2)}, ${lon.toFixed(2)}]</h2>`;

        // Display the next 5 forecasts (15 hours)
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
