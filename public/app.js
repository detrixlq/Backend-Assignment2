document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    fetchAQIData('Astana');
    fetchWeatherData('Astana')

    searchButton.addEventListener('click', function(e) {
        e.preventDefault(); 
        const city = searchInput.value; 

        if (city) {
            fetchWeatherData(city); 
            fetchAQIData(city);
        }
    });
});

function fetchWeatherData(city) {
    fetch(`/weather?city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched Data:', data);
            updateWeatherDisplay(data); // Update the DOM with the received weather data
            // displayWeatherIcon(data.weather[0].icon);
            updateMap(data.coord.lat, data.coord.lon); 
            fetchTimeZone(data.coord.lat, data.coord.lon, data.name);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}


function fetchAQIData(city) {
    fetch(`/aqi/${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(aqiData => {
            displayAQIData(aqiData, city);
        })
        .catch(error => console.error('Error fetching AQI data:', error));
}

function fetchTimeZone(lat, lng, city) {
    fetch(`/timezone/${lat}/${lng}`)
        .then(response => response.json())
        .then(data => {
            displayTimeZone(data, city);
            // displayCurrentTime(data);
        })
        .catch(error => console.error('Error fetching time zone data:', error));
}


function displayAQIData(aqiData, city) {
    const aqiDisplay = document.getElementById('aqiDisplay');
    if (aqiData && aqiData.aqi) {
        aqiDisplay.innerHTML = `
            <h2>AQI Information for ${city}:</h2>
            <p>AQI: ${aqiData.aqi}</p>
            <!-- Add more details as needed -->
        `;
    } else {
        aqiDisplay.innerHTML = '<p>AQI information is not available for selected location.</p>';
    }
}


function displayWeatherIcon(iconCode) {
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const weatherIconDisplay = document.getElementById('weatherIcon');
    weatherIconDisplay.src = iconUrl;
    weatherIconDisplay.alt = 'Weather Icon';
}

function updateWeatherDisplay(weatherData) {
    const weatherDisplay = document.getElementById('weatherDisplay'); //API does not provide rain data, I checked the logs
    weatherDisplay.innerHTML = `
        <h2>Weather in ${weatherData.name}:</h2>
        <img src='http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png'></img>
        <p><strong>Temperature:</strong> ${weatherData.main.temp}°C</p>
        <p><strong>Feels like:</strong> ${weatherData.main.feels_like}°C</p>
        <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
        <p><strong>Coordinates:</strong> ${weatherData.coord.lat}, ${weatherData.coord.lon}</p>
        <p><strong>Humidity:</strong> ${weatherData.main.humidity}</p>
        <p><strong>Pressure:</strong> ${weatherData.main.pressure} hPa</p>
        <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
        <p><strong>Country:</strong> ${weatherData.sys.country}</p> 
    `;
    weatherDisplay.classList.remove('hidden'); 
}

function updateMap(lat, lon) {
    const mapDisplay = document.getElementById('mapDisplay');
    mapDisplay.innerHTML = "<div id='map' style='height: 250px;'></div>"; 

    const map = L.map('map').setView([lat, lon], 13); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map) 
        .bindPopup('The weather location')
        .openPopup();
}

function displayTimeZone(timeZoneData, city) {
    const timeZoneDisplay = document.getElementById('timeZoneDisplay');
    const timestamp = timeZoneData.timestamp + timeZoneData.gmtOffset;
    const currentTime = new Date(timestamp * 1000).toLocaleString();
    timeZoneDisplay.innerHTML = `
    <h2>Time in ${city}:</h2>
    <p><strong>Time Zone:</strong> ${timeZoneData.zoneName}</p>
    <p><strong>Current Time:</strong> ${currentTime}</p>`;
}