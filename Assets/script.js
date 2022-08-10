const weatherContainer = document.getElementById('container')
const cityName = document.getElementById('city');
const stateName = document.getElementById('state');
const countryCode = document.getElementById('country');
const searchBtn = document.getElementById('searchBtn');
const recentSearchDiv = document.getElementById('recentSearches');

let WeatherApi = 'https://api.openweathermap.org/data/2.5/onecall?lat='
//{lat}&lon={lon}&exclude={part}&appid={API key}
let GeoCodeApi = 'http://api.openweathermap.org/geo/1.0/direct?q='
//{city name},{state code},{country code}&limit={limit}&appid={API key}
const apiKey = 'f077831005b0a99879525b916f58d7b5'

let recentSearchArr = [];
let searchObj = {};


function searchButtonHandler() {
    buildGeoRequest();
    searchObj.city = cityName.value;
};

function convertCity(a) {
    return newCity = a.replace(/ /gi, "+");
};

function buildGeoRequest() {
    convertCity(cityName.value);
    console.log(newCity);
    let requestGeoCode = `${GeoCodeApi + newCity},${stateName.value},${countryCode.value}&appid=${apiKey}`;
    getGeoCode(requestGeoCode);
};

function buildWeatherRequest(b) {
    console.log(b[0].lat, b[0].lon);
    let requestWeather = `${WeatherApi + b[0].lat}&lon=${b[0].lon}&appid=${apiKey}&units=imperial`;
    console.log(requestWeather);
    searchObj.weatherReq = requestWeather;
    console.log(searchObj);
    getWeather(requestWeather);
};

function getGeoCode(request) {
    fetch(request)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            buildWeatherRequest(data);
            });
};

function getWeather(request) {
    fetch(request)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log(data)
            buildResults(data, cityName.value)
        });
    saveSearches();
};

function capitalizeFirstLetter(e) {
    return e.charAt(0).toUpperCase() + e.slice(1);
};

function buildResults(c, d) {
    let cityDisplay = capitalizeFirstLetter(d)
    cityName.value = "";
    stateName.value = "";
    let cityCard = document.getElementById('cityCard');
    let weather = document.getElementById('weather');
    let temp = document.getElementById('temp');
    let wind = document.getElementById('wind');
    let uvindex = document.getElementById('UV');
    let humid = document.getElementById('humid');

    cityCard.textContent = `${cityDisplay}`
    weather.textContent = `${c.current.weather[0].description}`
    temp.textContent = `Temp: ${c.current.temp}°F`
    wind.textContent = `Windspeed: ${c.current.wind_speed}mph`
    uvindex.textContent = `UVIndex: ${c.current.uvi}`
    humid.textContent = `Humidity: ${c.current.humidity}%`

    for (let i=0; i<5; i++) {
        let forecast = document.getElementById('forecast-cont');
        let node = document.createElement('div');
        node.setAttribute('class', 'col-2 mycard day')
        node.innerHTML = `
            <div class="p-3">
                <i class="fa-solid fa-sun sun" id="icon"></i>
            </div>
            <div class="col-md">
                <p>${c.daily[i].weather[0].description}</p>
                <p>Temp: ${c.daily[i].temp.day}°F</p>
                <p>Windspeed: ${c.daily[i].wind_gust}mph</p>
                <p>UVIndex: ${c.daily[i].uvi}</p>
                <p>Humidity: ${c.daily[i].humidity}%</p>
            </div>`


        // node.appendChild(textNode)
        forecast.appendChild(node)

    }


};

function saveSearches() {
    recentSearchArr.push(searchObj);
    searchObj = {};
    localStorage.setItem('searches', JSON.stringify(recentSearchArr));
};

function init() {
    let storedSearches = JSON.parse(localStorage.getItem('searches'));
    if (storedSearches !== null) {
        recentSearchArr = storedSearches
    }
    buildRecents()
}

function buildRecents() {
    for (let i = 0; i < 5; i++) {
        let myBtn = document.createElement('button');
        myBtn.setAttribute('class', 'myBtn');
        myBtn.setAttribute('data-request', recentSearchArr[i].weatherReq)
        myBtn.textContent = recentSearchArr[i].city;
        recentSearchDiv.appendChild(myBtn);
    }
}

function recentSearchHandler(f) {
    let clicked = f.target;
    
}

searchBtn.addEventListener('click', searchButtonHandler)

init();