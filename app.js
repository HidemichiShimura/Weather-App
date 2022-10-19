const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

// Read API KEY from .env
require('dotenv').config();
const apiKey = process.env.MY_API_KEY;

app.use(bodyParser.urlencoded({extended: true}));

// HTTP GET request
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// HTTP POST request
app.post("/", (req, res) => {
    const query = req.body.cityName;
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;

    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            console.log(apiKey);
            console.log(weatherData);

            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<h1>The temparature in " + query + " is " + temp + " degrees Celcius.</h1>");
            res.write("<p>The weather is currently " + description + "</p>");
            res.write("<img src=\"" + iconURL + "\">");
            res.send();
        });
    });    
});

// LISTEN
app.listen(process.env.PORT, () => {
    console.log("Server is running");
});