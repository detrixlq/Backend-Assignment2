// Import necessary modules
const express = require('express');
const dotenv = require('dotenv').config();
// const fetch = require('node-fetch');
const path = require('path');

// Initialize Express
const app = express();

// Set the view engine to EJS for templating
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Get the port from the environment and set a default
const PORT = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
    res.render('index', { weather: null }); // Pass initial weather data as null
});

// API route for fetching weather data
app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;

    try {
        const response = await fetch(weatherUrl);
        const weatherData = await response.json();
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.get('/location', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const url = `https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`;

    try {
        const response = await fetch(url);
        const locationData = await response.json();
        res.json(locationData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching location data' });
    }
});


app.get('/aqi', async (req, res) => {
    const city = req.query.city;
    const aqiUrl = `http://api.airvisual.com/v2/city?city=${city}&state=YOUR_STATE&country=YOUR_COUNTRY&key=${process.env.AQI_API_KEY}`;

    try {
        const response = await fetch(aqiUrl);
        const aqiData = await response.json();
        res.json(aqiData.data.current.pollution);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching AQI data' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
