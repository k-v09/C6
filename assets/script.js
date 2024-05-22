const aKey = '20b9333670326f5c59cab9a18010ac64';
const gurrrl = 'https://api.openweathermap.org/geo/1.0/direct?q=';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=';

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        cityCoords(city);
    }
});

function cityCoords(city) {
    fetch(`${gurrrl}${city}&appid=${aKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeather(lat, lon, city);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching coordinates:', error));
}

function getWeather(lat, lon, city) {
    fetch(`${weatherUrl}${lat}&lon=${lon}&appid=${aKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            weatherInfo(data, city);
            searchHistory(city);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function weatherInfo(data, city) {
    const weatherInfo = document.getElementById('weatherInfo');
    const forecast = document.getElementById('forecast');
    
    weatherInfo.innerHTML = '';
    forecast.innerHTML = '';

    const current = data.list[0];
    weatherInfo.innerHTML = `
        <div class="weather-card">
            <div>
                <h3>${city} (${new Date(current.dt * 1000).toLocaleDateString()})</h3>
                <p>Temperature: ${current.main.temp}°C</p>
                <p>Humidity: ${current.main.humidity}%</p>
                <p>Wind Speed: ${current.wind.speed} m/s</p>
            </div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="${current.weather[0].description}">
        </div>
    `;

    for (let i = 0; i < data.list.length; i += 8) {
        const forecastData = data.list[i];
        forecast.innerHTML += `
            <div class="forecast-card">
                <h3>${new Date(forecastData.dt * 1000).toLocaleDateString()}</h3>
                <img class="weather-icon" src="https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png" alt="${forecastData.weather[0].description}">
                <p>Temp: ${forecastData.main.temp}°C</p>
                <p>Humidity: ${forecastData.main.humidity}%</p>
                <p>Wind: ${forecastData.wind.speed} m/s</p>
            </div>
        `;
    }
}

function searchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        showSH();
    }
}

function showSH() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '';

    history.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => cityCoords(city));
        historyContainer.appendChild(button);
    });
}


document.addEventListener('DOMContentLoaded', showSH);
