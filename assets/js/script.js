// Functions are called when the DOM has loaded
$(function () {

  // Function to fetch weather data from API
  function buildQuery(cityName) {
    const APIKey = '25a131e364e3b7a6a6ce9928baf5b301';
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;

    // API call to get coordinates
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        const coordinates = {
          lat: data.coord.lat,
          lon: data.coord.lon
        };
        // Save city to search history
        saveToSearchHistory(cityName);

        // Get and display weather information
        currentWeather(coordinates);
        fiveDayForecast(coordinates);

      });
  }

  // Checks if there's a search history in local storage
  const searchHistory = JSON.parse(localStorage.getItem('City:')) || [];

  // Call function and populate search history
  displaySearchHistory();

  // Listens for form submission
  $('#search-form').submit(function (event) {
    event.preventDefault();

    // Get city name from input field
    const cityName = $('#search-input').val().trim();
    // Check whether city name is empty
    if (cityName !== '') {
      // If city name is not empty, call function to fetch weather data
      buildQuery(cityName);
    }
  });

  // Listens for search history clicks
  $('#history').on('click', '.list-group-item', function () {
    const cityName = $(this).text();
    buildQuery(cityName);
  });

  // Saves city to search history
  function saveToSearchHistory(cityName) {
    if (!searchHistory.includes(cityName)) {
      searchHistory.push(cityName);
      localStorage.setItem('City:', JSON.stringify(searchHistory));
      displaySearchHistory();
    }
  }

  // Renders and displays search history
  function displaySearchHistory() {
    $('#history').empty();
    searchHistory.forEach(function (city) {
      const historyEl = $('<a>')
        .addClass('list-group-item list-group-item-action bg-secondary mb-2').text(`${city}`);
      $('#history').append(historyEl);
    });
  }

  // Gets and displays current weather
  function currentWeather(coordinates) {
    const APIKey = '25a131e364e3b7a6a6ce9928baf5b301';
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${APIKey}`;

    fetch(queryURL)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        const weatherDiv = $('<div>');

        const cityName = data.name;
        const currentDate = dayjs().format('D/MM/YYYY');
        const iconURL = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        const iconAlt = data.weather[0].description;

        const cityEl = $('<h2>');
        const iconEl = $('<img>').attr('src', iconURL).attr('alt', iconAlt);
        cityEl.append(`${cityName} (${currentDate})`, iconEl);

        const currentTemp = data.main.temp;
        const tempEl = $('<p>').text(`Temp: ${currentTemp} °C`);

        const windspeed = data.wind.speed;
        const windEl = $('<p>').text(`Wind: ${windspeed} KPH`);

        const humidity = data.main.humidity;
        const humidityEl = $('<p>').text(`Humidity: ${humidity}%`);
        weatherDiv.append(cityEl, tempEl, windEl, humidityEl);

        $('#today').html(weatherDiv);
      });
  }

  function fiveDayForecast(coordinates) {
    const APIKey = '25a131e364e3b7a6a6ce9928baf5b301';
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${APIKey}`;

    fetch(queryURL)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        $('#forecast').empty();
        if (data.list && Array.isArray(data.list)) {
          // Filter the forecast data to include only one data point per day
          const forecastFiltered = perDayForecast(data.list);

          const forecastHTML = forecastFiltered.reduce(function (accumulator, forecast) {

            // Extract relevant data for each forecast
            const date = dayjs(forecast.dt_txt).format('MMMM D, YYYY');
            const iconURL = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
            const iconAlt = forecast.weather[0].description;
            const temperature = forecast.main.temp;
            const windspeed = forecast.wind.speed;
            const humidity = forecast.main.humidity;

            const forecastElement = $('<div>').addClass('col-md-2');
            const cardElement = $('<div>').addClass('card');
            const cardBodyElement = $('<div>').addClass('card-body');

            const dateEl = $('<h5>').text(date);
            const iconEl = $('<img>').attr('src', iconURL).attr('alt', iconAlt);
            const tempEL = $('<p>').text(`Temp: ${temperature} °C`);
            const windEL = $('<p>').text(`Wind: ${windspeed} KPH`);
            const humidityEL = $('<p>').text(`Humidity: ${humidity} %`);

            // Add the data to the card body
            cardBodyElement.append(dateEl, iconEl, tempEL, windEL, humidityEL);
            cardElement.append(cardBodyElement);
            forecastElement.append(cardElement);
            $('#forecast').append(forecastElement);

            return accumulator;

          }, '');
        } else {
          console.error('Invalid forecast data:', data);
        }
      });

    function perDayForecast(forecastList) {
      const forecastFiltered = [];

      // Create an object to store the closest forecast for each day
      const closestForecastPerDay = {};

      forecastList.forEach(function (forecast) {
        const forecastDate = dayjs(forecast.dt_txt).format('YYYY-MM-DD');

        // If no forecast exists for this date or the current forecast is closer to the current time, update the closest forecast
        if (!closestForecastPerDay[forecastDate] || dayjs(forecast.dt_txt).isBefore(dayjs(closestForecastPerDay[forecastDate].dt_txt))) {
          closestForecastPerDay[forecastDate] = forecast;
        }
      });

      // Extract the closest forecast for each day from the object
      Object.values(closestForecastPerDay).forEach(function (closestForecast, index) {
        // Start from the next day
        // if (index !== 0) {
        //   forecastFiltered.push(closestForecast);
        // }
        forecastFiltered.push(closestForecast);
      });

      return forecastFiltered;
    }
  }
});