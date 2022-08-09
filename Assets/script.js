const weatherContainer = document.getElementById('container')
const cityName = document.getElementById('city');
const stateName = document.getElementById('state');
const countryCode = document.getElementById('country');
const searchBtn = document.getElementById('searchBtn')

let WeatherApi = 'https://api.openweathermap.org/data/2.5/onecall?lat='
//{lat}&lon={lon}&exclude={part}&appid={API key}
let GeoCodeApi = 'http://api.openweathermap.org/geo/1.0/direct?q='
//{city name},{state code},{country code}&limit={limit}&appid={API key}
const apiKey = 'f077831005b0a99879525b916f58d7b5'

function searchButtonHandler() {
    buildGeoRequest()
    cityName.value = ""
    stateName.value = ""
}

function convertCity(a) {
    return newCity = a.replace(/ /gi, "+")
}

function buildGeoRequest() {
    convertCity(cityName.value)
    console.log(newCity)
    let requestGeoCode = `${GeoCodeApi + newCity},${stateName.value},${countryCode.value}&appid=${apiKey}`
    getGeoCode(requestGeoCode)
}

function buildWeatherRequest(b) {
    console.log(b[0].lat, b[0].lon)
    let requestWeather = `${WeatherApi + b[0].lat}&lon=${b[0].lon}&appid=${apiKey}`
    console.log(requestWeather)
    getWeather(requestWeather)
}

function getGeoCode(request) {
    fetch(request)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            buildWeatherRequest(data)
            }) 
}

function getWeather(request) {
    fetch(request)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log(data)
        })
}

function buildResults() {
    let divRow = document.createElement('<div>');
    weatherContainer.appendChild(divRow);

    let divColumn = document.createElement('<div>');
    weatherContainer.appendChild(divColumn);
}


searchBtn.addEventListener('click', searchButtonHandler)

// getGeoCode()
