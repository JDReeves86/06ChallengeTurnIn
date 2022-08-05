const weatherContainer = document.getElementById('container')
const requestUrl = 'https://api.weather.gov/alerts' // NWS

function getWeather(request) {
    fetch(request)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            console.log(data)
            }) 
}

getWeather(requestUrl)