document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    fetchUserLocationAndWeather();




    function fetchUserLocationAndWeather() {
        fetch('/location')
            .then(response => response.json())
            .then(locationData => {
                const coords = locationData.loc.split(',');
                const lat = coords[0];
                const lon = coords[1];
                fetchWeatherDataByCoords(lat, lon); // Implement this function to fetch weather by coordinates
            })
            .catch(error => console.error('Error fetching user location:', error));
    }
    

    // Event listener for the search button
    searchButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the form from submitting traditionally
        const city = searchInput.value; // Get the city name from the input field

        if (city) {
            fetchWeatherData(city); // Fetch weather data for the entered city
        }
    });
});


function fetchAQIData(city) {
    fetch(`/aqi?city=${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(aqiData => {
            updateAQIDisplay(aqiData); // Function to update the DOM with AQI data
        })
        .catch(error => console.error('Error fetching AQI data:', error));
}


function fetchWeatherData(city) {
    fetch(`/weather?city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateWeatherDisplay(data); // Update the DOM with the received weather data
            updateMap(data.coord.lat, data.coord.lon); // Update the map based on the coordinates
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function updateWeatherDisplay(weatherData) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = `
        <h2>Weather in ${weatherData.name}</h2>
        <p><strong>Temperature:</strong> ${weatherData.main.temp}°C</p>
        <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
        <p><strong>Country:</strong> ${weatherData.sys.country}</p>
        <p><strong>Feels like:</strong> ${weatherData.main.feels_like}°C</p>
    `;
    weatherDisplay.classList.remove('hidden'); // Make the weather display visible
}

function updateMap(lat, lon) {
    const mapDisplay = document.getElementById('mapDisplay');
    mapDisplay.innerHTML = "<div id='map' style='height: 250px;'></div>"; // Create a new div for the map

    const map = L.map('map').setView([lat, lon], 13); // Initialize the map with Leaflet.js

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map) // Add a marker to the map at the specified coordinates
        .bindPopup('The weather location')
        .openPopup();
}

function updateAQIDisplay(aqiData) {
    const aqiDisplay = document.getElementById('aqiDisplay'); // Ensure you have this element in your HTML
    aqiDisplay.innerHTML = `
        <p><strong>AQI:</strong> ${aqiData.aqi}</p>
        <p><strong>Main Pollutant:</strong> ${aqiData.mainus}</p>
    `;
}

function fetchWeatherDataByCoords(lat, lon) {
    fetch(`/weather?lat=${lat}&lon=${lon}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateWeatherDisplay(data); // Use your existing function to display weather data
        })
        .catch(error => console.error('Error fetching weather data:', error));
}
