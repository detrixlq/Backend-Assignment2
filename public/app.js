document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    fetchAQIData('Astana');
    fetchWeatherData('Astana')





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
    fetch(`/aqi/${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(aqiData => {
            displayAQIData(aqiData);
        })
        .catch(error => console.error('Error fetching AQI data:', error));
}

function displayAQIData(aqiData) {
    const aqiDisplay = document.getElementById('aqiDisplay');
    if (aqiData && aqiData.aqi) {
        aqiDisplay.innerHTML = `
            <h2>AQI Information for ${aqiData.city.name}</h2>
            <p>AQI: ${aqiData.aqi}</p>
            <!-- Add more details as needed -->
        `;
    } else {
        aqiDisplay.innerHTML = '<p>AQI information is currently unavailable.</p>';
    }
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

