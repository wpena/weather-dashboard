$(function () {

  function buildQuery(cityName) {
    const APIKey = '25a131e364e3b7a6a6ce9928baf5b301';
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;

    $.get(queryURL, function (data) {
      const coordinates = {
        lat: data.coord.lat,
        lon: data.coord.lon
      };
    });
  }
});