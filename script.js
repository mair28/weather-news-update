// Initialize the map and set the default view
const map = L.map('map').setView([51.505, -0.09], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

// Add temp_new layer for temperature visualization
const tempNewLayer = L.tileLayer(
    'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=54dfecb32764672ca5eae983bceb50e6',
    { maxZoom: 19, opacity: 0.5 }
);

// Add temp_new layer to the map
map.addLayer(tempNewLayer);

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
        // Fetch weather data for the searched city
        const response = await fetch(cityWeatherUrl);
        if (!response.ok) throw new Error(`City search error: ${response.status}`);

        const data = await response.json();
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        // Center the map on the searched city
        map.setView([lat, lon], 10);

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

// Function to fetch weather news for the Philippines
async function fetchWeatherNews() {
    const apiKey = '0gAYDSISVv-BJD2WHuzSgBkY5gC6Rz8KZ3xx9oBYHqcbTtvi';
    const newsUrl = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}&country=PH`;

    try {
        // Fetch weather news data
        const response = await fetch(newsUrl);
        if (!response.ok) throw new Error(`News fetch error: ${response.status}`);

        const data = await response.json();
        const newsDiv = document.getElementById('weatherNews');
        newsDiv.innerHTML = '<h2>Weather News in the Philippines</h2>';

        // Filter and display articles with keyword in the title
        const stormArticles = data.news.filter(article => 
            article.title.toLowerCase().includes('storm')
        );

        // Display top 5 storm-related articles
        stormArticles.slice(0, 5).forEach(article => {
            const { title, description, url } = article;

            newsDiv.innerHTML += `
                <div class="news-article">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <a href="${url}" target="_blank">Read more</a>
                </div>
            `;
        });
    } catch (error) {
        alert(`Error fetching weather news: ${error.message}`);
    }
}

// Fetch filtered weather news on page load
fetchWeatherNews();

// Function to display current weather and return city name
function displayCurrentWeather(data) {
    const cityName = data.name || 'Unknown Location';
    const countryName = data.sys?.country || '';
    const currentTemp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const weatherDescription = data.weather[0].description;
    const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // Update the current weather container
    document.getElementById('currentWeather').innerHTML = `
        <h3>${cityName}, ${countryName}</h3>
        <div class="temp">
            <img src="${icon}" alt="Weather Icon">
            ${currentTemp}°C
        </div>
        <p>Feels like: ${feelsLike}°C. ${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}.</p>
    `;

    // Return the full location name
    return `${cityName}, ${countryName}`;
}

// Function to fetch weather data and update the forecast
async function fetchWeather(lat, lon) {
    const apiKey = '54dfecb32764672ca5eae983bceb50e6';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        // Fetch current weather data
        const currentResponse = await fetch(currentWeatherUrl);
        if (!currentResponse.ok) throw new Error(`Current weather error: ${currentResponse.status}`);
        const currentData = await currentResponse.json();

        // Get location name from current weather data
        const locationName = displayCurrentWeather(currentData);

        // Fetch 3-hour forecast data
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error(`3-hour forecast error: ${forecastResponse.status}`);
        const forecastData = await forecastResponse.json();

        const weatherDiv = document.getElementById('weather');
        
        // Display the city name in the forecast title
        weatherDiv.innerHTML = `<h2>Next 3-Hour Forecast for ${locationName}</h2>`;

        // Display forecast data
        forecastData.list.slice(0, 5).forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toLocaleString();
            const temp = forecast.main.temp;
            const weather = forecast.weather[0].description;
            const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

            // Create forecast container
            const forecastElem = document.createElement('div');
            forecastElem.className = 'forecast';

            // Create and add elements for each forecast item
            const dateElem = document.createElement('div');
            dateElem.className = 'date';
            dateElem.textContent = date;

            const iconTempElem = document.createElement('div');
            iconTempElem.className = 'icon-temp';

            const iconElem = document.createElement('img');
            iconElem.src = icon;
            iconElem.alt = 'Weather Icon';

            const tempElem = document.createElement('div');
            tempElem.className = 'temp';
            tempElem.textContent = `${temp}°C`;

            const descElem = document.createElement('div');
            descElem.className = 'description';
            descElem.textContent = weather.charAt(0).toUpperCase() + weather.slice(1);

            // Append elements to the forecast container
            iconTempElem.append(iconElem, tempElem);
            forecastElem.append(dateElem, iconTempElem, descElem);

            // Add the forecast element to the weather container
            weatherDiv.appendChild(forecastElem);
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
    map.setView([lat, lon], 10);

    // Fetch weather data for the clicked location
    fetchWeather(lat, lon);
});
