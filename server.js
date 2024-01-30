const express = require('express');
const dotenv = require('dotenv').config();
// const fetch = require('node-fetch');
const path = require('path');
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json()); // Parse JSON bodies

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('index', { weather: null }); // Pass initial weather data as null
});

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


app.get('/aqi/:city', async (req, res) => {
    const city = req.params.city;
    const url = `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${process.env.AQICN_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "ok") {
            res.json(data.data);
        } else {
            throw new Error('Failed to fetch AQI data');
        }
    } catch (error) {
        console.error('Error fetching AQI data:', error);
        res.status(500).json({ error: 'Error fetching AQI data' });
    }
});

app.get('/timezone/:lat/:lng', async (req, res) => {
    const { lat, lng } = req.params;
    const apiKey = process.env.TIMEZONEDB_API_KEY;
    const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching time zone data:', error);
        res.status(500).json({ error: 'Error fetching time zone data' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
