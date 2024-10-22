# Weather Web App with Map Integration

## Overview
This web application provides real-time weather information, a 3-hour weather forecast, and weather news for the Philippines. It includes a search functionality for cities worldwide and integrates a map that displays the current location's weather. The app uses OpenWeatherMap API for weather data and CurrentsAPI for news updates.

## Features
- **Current Weather Information:** Displays the current temperature, weather description, and "feels like" temperature.
- **3-Hour Weather Forecast:** Shows the temperature, weather conditions, and icons for the next 3-hour intervals.
- **Weather News:** Fetches the latest weather news for the Philippines using CurrentsAPI.
- **City Search:** Users can search for weather data by entering a city name.
- **Geolocation Integration:** Centers the map on the user's current location and fetches relevant weather data.
- **Interactive Map:** Users can click on the map to fetch weather data for specific coordinates.

## Technologies Used
- **HTML** for structure
- **CSS** for styling
- **JavaScript** for functionality
- **Leaflet.js** for map rendering
- **OpenWeatherMap API** for weather data
- **CurrentsAPI** for news updates

## Getting Started

### Prerequisites
- You need an active internet connection to fetch data from the APIs.

### Installation
1. Clone this repository:
    ```bash
    git clone https://github.com/your-username/weather-web-app.git
    ```
2. Navigate to the project directory:
    ```bash
    cd weather-web-app
    ```
3. Open the `index.html` file in a web browser to run the app.

## Configuration

### API Keys
- This project requires two API keys:
  1. **OpenWeatherMap API Key:** For fetching weather data.
  2. **CurrentsAPI Key:** For fetching weather news.

Replace the placeholders in the script with your API keys:
```javascript
const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
const currentsApiKey = 'YOUR_CURRENTSAPI_KEY';
