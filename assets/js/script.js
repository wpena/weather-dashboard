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
});