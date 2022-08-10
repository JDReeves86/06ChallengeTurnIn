const weatherContainer = document.getElementById('container')
const cityName = document.getElementById('city');
const stateName = document.getElementById('state');
const countryCode = document.getElementById('country');
const searchBtn = document.getElementById('searchBtn');
const recentSearchDiv = document.getElementById('recentSearches');
let forecast = document.getElementById('forecast-cont');

let WeatherApi = 'https://api.openweathermap.org/data/2.5/onecall?lat='
//{lat}&lon={lon}&exclude={part}&appid={API key}
let GeoCodeApi = 'http://api.openweathermap.org/geo/1.0/direct?q='
//{city name},{state code},{country code}&limit={limit}&appid={API key}
const apiKey = 'f077831005b0a99879525b916f58d7b5'

let recentSearchArr = [];

init();

function searchButtonHandler() {
    let cityStr = trimInput(cityName.value)
    if (cityStr.length == 0) {
        alert('Please input a valid city')
        return
    }
    buildGeoRequest(cityStr);
    saveSearches(cityStr);
    buildRecents();
};

function convertCity(a) {
    return newCity = a.replace(/ /gi, "+");
};

function buildGeoRequest(g) {
    convertCity(g);
    console.log(newCity);
    let requestGeoCode = `${GeoCodeApi + newCity},${stateName.value},${countryCode.value}&appid=${apiKey}`;
    getGeoCode(requestGeoCode, g);
};

function buildWeatherRequest(b, j) {
    console.log(b[0].lat, b[0].lon);
    let requestWeather = `${WeatherApi + b[0].lat}&lon=${b[0].lon}&appid=${apiKey}&units=imperial`;
    console.log(requestWeather);
    getWeather(requestWeather, j);
};

function getGeoCode(request, i) {
    fetch(request)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            buildWeatherRequest(data, i);
            });
};

function getWeather(request, g) {
    fetch(request)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log(data)
            buildResults(data, g)
        });
};

function trimInput (str) {
    let newStr = str.trim()
    return newStr.charAt(0).toUpperCase() + newStr.slice(1)
}

function buildResults(c, d) {
    cityName.value = "";
    stateName.value = "";
    let cityCard = document.getElementById('cityCard');
    let weather = document.getElementById('weather');
    let temp = document.getElementById('temp');
    let wind = document.getElementById('wind');
    let uvindex = document.getElementById('UV');
    let humid = document.getElementById('humid');
    let icon = document.getElementById('icon');

    cityCard.textContent = `${d}`
    icon.setAttribute('src', `http://openweathermap.org/img/wn/${c.current.weather[0].icon}.png`)
    weather.textContent = `${c.current.weather[0].description}`
    temp.textContent = `Temp: ${c.current.temp}°F`
    wind.textContent = `Windspeed: ${c.current.wind_speed}mph`
    uvindex.textContent = `UVIndex: ${c.current.uvi}`
    humid.textContent = `Humidity: ${c.current.humidity}%`
    setUVColors(uvindex, c.current.uvi)

    forecast.innerHTML = "";

    for (let i=0; i<5; i++) {
        let node = document.createElement('div');
        node.setAttribute('class', 'col-2 mycard day')
        node.innerHTML = `
            <div class="p-3">
                <img src="http://openweathermap.org/img/wn/${c.daily[i].weather[0].icon}.png"id="icon">
            </div>
            <div class="col-md">
                <p>${c.daily[i].weather[0].description}</p>
                <p>Temp: ${c.daily[i].temp.day}°F</p>
                <p>Windspeed: ${c.daily[i].wind_gust}mph</p>
                <p class='UVIcreated' >UVIndex: ${c.daily[i].uvi}</p>
                <p>Humidity: ${c.daily[i].humidity}%</p>
            </div>`
        forecast.appendChild(node)
    }

    let UVIArr = document.querySelectorAll('.UVIcreated')
    for (let i = 0; i < UVIArr.length; i++) {
        setUVColors(UVIArr[i], c.daily[i].uvi)
    }

};

function setUVColors(target, l) {
    switch (true) {
        case (l < 3):
            console.log('UVI low');
            target.setAttribute('style', 'background-color: var(--UVlo); color: white')
            break;
        case (l >= 3 && l < 6):
            console.log('UVI mod');
            target.setAttribute('style', 'background-color: var(--UVmod)')
            break;
        case (l >= 6 && l < 8):
            console.log('UVI hi');
            target.setAttribute('style', 'background-color: var(--UVhi)')
            break;
        case (l >= 8 && l <= 11):
            console.log('UVI way hi');
            target.setAttribute('style', 'background-color: var(--UVwayhi); color: white')
            break;
        case (l > 11):
            console.log('UVI hi AF');
            target.setAttribute('style', 'background-color: var(--UVhiAF); color: white')
            break;
        default:
            console.log('I am confuse')
    }

}

function saveSearches(k) {
    if (recentSearchArr.includes(k)) {
        return
    }
    recentSearchArr.push(k);
    while (recentSearchArr.length > 5) {
        recentSearchArr.shift()
    }
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
    recentSearchDiv.innerHTML = ""
    for (let i = 0; i < 5; i++) {
        let myBtn = document.createElement('button');
        myBtn.setAttribute('class', 'myBtn');
        myBtn.setAttribute('data-city', recentSearchArr[i])
        myBtn.textContent = recentSearchArr[i];
        myBtn.addEventListener('click', recentSearchHandler)
        recentSearchDiv.appendChild(myBtn);
    }
}

function recentSearchHandler(f) {
    let clicked = f.target;
    let priorCity = trimInput(clicked.getAttribute('data-city'));
    forecast.innerHTML = "";
    buildGeoRequest(priorCity);
}

searchBtn.addEventListener('click', searchButtonHandler)