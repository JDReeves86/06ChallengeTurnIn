const weatherContainer = document.getElementById('container')
const cityName = document.getElementById('city');
const stateName = document.getElementById('state');
const searchBtn = document.getElementById('searchBtn');
const recentSearchDiv = document.getElementById('recentSearches');
let forecast = document.getElementById('forecast-cont');

let WeatherApi = 'https://api.openweathermap.org/data/2.5/onecall?lat='

let GeoCodeApi = 'https://api.openweathermap.org/geo/1.0/direct?q='

const apiKey = 'f077831005b0a99879525b916f58d7b5'

// Array to be used for local storage
let recentSearchArr = [];

//calls init() function
init();

// Called when search button is clicked. Trims input in the event white space is inadvertantly added.
// If string is trimmed to a length of 0 an alert is called to prompt the user to input a valid city.
// Calls the buildGeoRequest function to start the process.
function searchButtonHandler() {
    let cityStr = trimInput(cityName.value)
    if (cityStr.length == 0) {
        alert('Please input a valid city')
        return
    }
    buildGeoRequest(cityStr);
};

// Trims input and capitalizes the first letter of the city input.
function trimInput (str) {
    let newStr = str.trim()
    return newStr.charAt(0).toUpperCase() + newStr.slice(1)
}

// Takes the string passed into it and passes it into the convertCity() function to then build an API URL.
// Passes the built URL into the getGeoCode function. 
// Variable g is the city string and is handed down through into getGeoCode() fucntion for later use.
function buildGeoRequest(g) {
    convertCity(g);
    let requestGeoCode = `${GeoCodeApi + newCity},${stateName.value},&appid=${apiKey}`;
    // let requestBrokenCode = `${GeoCodeApi + newCity},${stateName.value},&appdi=${apiKey}`;
    getGeoCode(requestGeoCode, g);
    // getGeoCode(requestBrokenCode, g);
};

// Converts the city string to remove spaces and replace them with '+' to ensure API request delivers an appropriate URL.
function convertCity(a) {
    return newCity = a.replace(/ /gi, "+");
};

// Receives the built API URL and requests the Geocoding data so that weather data may be requested.
// Variable g continues to be handed down through function calls.
function getGeoCode(request, g) {
    fetch(request)
        .then(function(response) {
            if (response.ok) {
                return response.json()
                    .then(function(data) {
                    console.log(data)
                    buildWeatherRequest(data, g);
                    });
            }
            else {
                alert(`Error: ${response.statusText}`)
            }
        })
        .catch(function(error) {
            alert('Unable to retrieve requested data.')
        }); 
};

// Builds the weather request by pulling the latitude and longitude data from the returned data in the getGeoCode() function.
// If the returned array from getGeoCode has a length of 0, this means an invalid location was entered and an alert is called to prompt the user.
// If not, the function will continue. At this point the variable that has been handed down through the other functions is used.
// Calls buildRecents() to update the buttons with the newly searched location.
// Once these actions are completed, the getWeather() function is called to fetch the weather data.
function buildWeatherRequest(b, g) {
    if (b.length == 0) {
        alert('That is not a valid location')
        return
    }
    saveSearches(g);
    buildRecents();
    let requestWeather = `${WeatherApi + b[0].lat}&lon=${b[0].lon}&appid=${apiKey}&units=imperial`;
    // let requestBADWeather = `${WeatherApi + b[0].lat}&lon=${b[0].lon}&appdi=${apiKey}&units=imperial`;
    getWeather(requestWeather, g);
    // getWeather(requestBADWeather, g);
};

// Requests weather data fromt he API. Receives variable g and passes into buildResults() to be used.
function getWeather(request, g) {
    fetch(request)
        .then(function(response) {
            if(response.ok) {
                return response.json()
                    .then(function(data) {
                    console.log(data)
                    buildResults(data, g)
                    });
            }
            else {
                alert(`Error: ${response.statusText}`)
            }
        })
        .catch(function(error) {
            alert('Unable to retrieve requested data.')
        });
};

// Takes data returned by getWeather() and builds the weather displays on screen.
// Utilizes variable g to display the requested city name. 
// Iterates over the future weather report 5 times to generate 5 day forecast. 
function buildResults(c, g) {
    cityName.value = "";
    stateName.value = "";
    let cityCard = document.getElementById('cityCard');
    let date = document.getElementById('date');
    let weather = document.getElementById('weather');
    let temp = document.getElementById('temp');
    let wind = document.getElementById('wind');
    let uvindex = document.getElementById('UV');
    let humid = document.getElementById('humid');
    let icon = document.getElementById('icon');

    cityCard.textContent = `${g}`
    date.textContent = `${moment().format('MMM Do YYYY')}`
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
                <h4>${moment().add((i+1), 'days').format('MMM Do YYYY')}</h4>
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

// Uses switch statement to compare received UV index value and element to apply CSS format changes.
function setUVColors(target, l) {
    switch (true) {
        case (l < 3):
            target.setAttribute('style', 'background-color: var(--UVlo); color: white')
            break;
        case (l >= 3 && l < 6):
            target.setAttribute('style', 'background-color: var(--UVmod)')
            break;
        case (l >= 6 && l < 8):
            target.setAttribute('style', 'background-color: var(--UVhi)')
            break;
        case (l >= 8 && l <= 11):
            target.setAttribute('style', 'background-color: var(--UVwayhi); color: white')
            break;
        case (l > 11):
            target.setAttribute('style', 'background-color: var(--UVhiAF); color: white')
            break;
        default:
            console.log('I am confuse')
    }

}

// Checks recentSearchArr for the presence of the value it is given. If present in current array, function returns.
// If it passes the first check, then it proceeds to push the value gien into the array.
// Includes while loop to ensure array des not grow past a length of 5.
// Sets local stroage.
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

// Sets recentSearchArr with local storage values if present.
// Calls buildRecents() to generate recent search buttons.
function init() {
    let storedSearches = JSON.parse(localStorage.getItem('searches'));
    if (storedSearches !== null) {
        recentSearchArr = storedSearches
    }
    buildRecents();
}

// Iterates over recentSearchArr and for each value in the array, a button is generated and event listener appended.
// Sets a data value to be called upon when clicked.
function buildRecents() {
    recentSearchDiv.innerHTML = ""
    for (let i = 0; i < recentSearchArr.length; i++) {
        let myBtn = document.createElement('button');
        myBtn.setAttribute('class', 'myBtn');
        myBtn.setAttribute('data-city', recentSearchArr[i])
        myBtn.textContent = recentSearchArr[i];
        myBtn.addEventListener('click', recentSearchHandler)
        recentSearchDiv.appendChild(myBtn);
    }
}

// Starts process same as the search button. Uses the data value of the button to pass into the buildGeoRequest() function.
function recentSearchHandler(f) {
    let clicked = f.target;
    let priorCity = trimInput(clicked.getAttribute('data-city'));
    forecast.innerHTML = "";
    buildGeoRequest(priorCity);
}

searchBtn.addEventListener('click', searchButtonHandler)