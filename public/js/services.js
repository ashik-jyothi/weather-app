'use strict';

angular.module('openWeatherApp.services', ['ngResource'])
  .value('exampleLocations',['Calicut','Ernakulam','New Delhi','Bangalore','Hyderabad','Chennai','Pune'])

  .factory('openWeatherMap', function($resource) {

    var apiKey = '26416597cea257592c8f3895f4cb53ed';
    var apiBaseUrl = 'https://api.openweathermap.org/data/2.5/';

    return $resource(apiBaseUrl + ':path/:subPath?q=:location',
      {
        APPID: apiKey,
        mode: 'json',
        callback: 'JSON_CALLBACK',
        lang: 'en',
        units: 'imperial'
      },
      {
        queryWeather: {
          method: 'JSONP',
          params: {
            path: 'weather'
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        },
        queryForecast: {
          method: 'JSONP',
          params: {
            path: 'forecast'
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        },
        queryForecastDaily: {
          method: 'JSONP',
          params: {
            path: 'forecast',
            subPath: 'daily',
            //cnt: 7
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        }
      }
    )
  });
