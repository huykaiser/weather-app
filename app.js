const asyncRequest = require('async-request');

const getWeather = async (location) => {
    const access_key = "369338b146a02e57671c0b114774b31c";
    const url = `http://api.weatherstack.com/current?access_key=${access_key}&query=${location}`;

    try {
        const res = await asyncRequest(url); // call api
        const data = JSON.parse(res.body);

        const weather = {
            isSuccess: true,
            region: data.location.region,
            country: data.location.country,
            temperature: data.current.temperature,
            wind_speed: data.current.wind_speed,
            precip: data.current.precip,
            cloudcover: data.current.cloudcover,
        };

        console.log(weather);

        return weather;
    } catch (error) {
        return {
            isSuccess: false,
            error,
        };
    }
};

// getWeather("tokyo");

const express = require('express');
const app = express(); // create express server
const path = require('path');

const pathPublic = path.join(__dirname, './public');
app.use(express.static(pathPublic));
// console.log('pathPublic', pathPublic);

// http://localhost:7000
app.get("/", async (req, res) => {
    // res.send("Hello World");
    const params = req.query;
    // console.log('params', params);

    const location = params.address;
    const weather = await getWeather(location);
    console.log('weather', weather);

    if (location) {
        res.render('weather', { //weather.bhs
            status: true,
            region: weather.region,
            country: weather.country,
            temperature: weather.temperature,
            wind_speed: weather.wind_speed,
            precip: weather.precip,
            cloudcover: weather.cloudcover,
        });
    }else{
        res.render('weather', { 
            status: false,
        });
    }
});

app.set("view engine", "hbs");

const port = 7000;
app.listen(port, () => {
    console.log(`app run on http://localhost:${port}`);
});
