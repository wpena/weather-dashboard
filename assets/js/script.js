$(function () {

  function buildQuery(cityName) {
    const APIKey = '25a131e364e3b7a6a6ce9928baf5b301';
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;

    $.get(queryURL, function (data) {
      const coordinates = {
        lat: data.coord.lat,
        lon: data.coord.lon
      };
      saveToSearchHistory(cityName);
      currentWeather(coordinates);
    });
  }

  const searchHistory = JSON.parse(localStorage.getItem('City:')) || [];

  displaySearchHistory();

  $('#search-form').submit(function (event) {
    event.preventDefault();

    const cityName = $('#search-input').val().trim();
    if (cityName !== '') {
      buildQuery(cityName);
    }
  });

  $('#history').on('click', '.list-group-item', function () {
    const cityName = $(this).text();
    buildQuery(cityName);
  });

  function saveToSearchHistory(cityName) {
    if (!searchHistory.includes(cityName)) {
      searchHistory.push(cityName);
      localStorage.setItem('City:', JSON.stringify(searchHistory));
      displaySearchHistory();
    }
  }

  function displaySearchHistory() {
    $('#history').empty();
    searchHistory.forEach(function (city) {
      const historyEl = $('<a>')
        .addClass('list-group-item list-group-item-action').text(`${city}`);
      $('#history').append(historyEl);
    });
  }

  function currentWeather(coordinates) {
    const APIKey = '25a131e364e3b7a6a6ce9928baf5b301';
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${APIKey}`;

    $.get(queryURL, function (data) {
      const weatherDiv = $('<div>');

      const cityName = data.name;
      const currentDate = dayjs().format('D/MM/YYYY');
      const iconURL = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      const iconAlt = data.weather[0].description;

      const cityEl = $('<h2>');
      const iconEl = $('<img>').attr('src', iconURL).attr('alt', iconAlt);
      cityEl.append(`${cityName} (${currentDate})`, iconEl);
      weatherDiv.append(cityEl);

      const currentTemp = data.main.temp;
      const tempEl = $('<p>').text(`Temp: ${currentTemp} °C`);
      weatherDiv.append(tempEl);

      const windspeed = data.wind.speed;
      const windEl = $('<p>').text(`Wind: ${windspeed} KPH`);
      weatherDiv.append(windEl);

      const humidity = data.main.humidity;
      const humidityEl = $('<p>').text(`Humidity: ${humidity}%`);
      weatherDiv.append(humidityEl);

      $('#today').html(weatherDiv);
    });
  }

});