const weatherContainer = document.getElementById('container')


function getWeather() {
    const requestUrl = 'https://api.weather.gov'
    fetch(requestUrl)
        .then(function(response) {
            return response.JSON
        })
}