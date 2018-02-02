'use strict';

angular.module('openWeatherApp.directives', [])
var app = angular.module('openWeatherApp.directives', [])
  .directive('weatherPanel', [
  function factory() {
    return {
      restrict: 'EA',

      scope: {
        useDayForecast: '=showEntry',
        forecast: '=weatherPanel'
      },

      templateUrl: 'partials/_weather-panel-light.html',

      link: function(scope, element, attrs) {
        scope.getIconImageUrl = function(iconName) {
          return (
            iconName
            ? 'https://openweathermap.org/img/w/' + iconName + '.png'
            : '');
        };

        scope.parseDate = function(time) {
          return new Date(time * 1000);
        };
      }
    }
  }
])

app.directive('ngSparkline', function() {

  var url = "https://api.openweathermap.org/data/2.5/forecast/daily?APPID=" + apiKey + "&mode=json&units=imperial&cnt=7&callback=JSON_CALLBACK&q=";
  return {
    restrict: 'A',
    require: '^ngCity',
    transclude: true,
    scope: {
      ngCity: '@'
    },
    template: '<div class="sparkline"><div ng-transclude></div><div class="graph"></div></div>',
    controller: [
      '$scope',
      '$http',
      function($scope, $http) {
        $scope.getTemp = function(city) {
          $http({
            method: 'JSONP',
            url: url + city
          }).success(function(data) {
            var weather = [];
            angular.forEach(data.list, function(value) {
              weather.push(value);
            });
            $scope.weather = weather;
          });
        }
      }
    ],
    link: function(scope, iElement, iAttrs, ctrl) {
      scope.getTemp(iAttrs.ngCity);
      scope.$watch('weather', function(newVal) {
        if (newVal) {
          var highs = [],
            w_date = [];

          angular.forEach(scope.weather, function(value) {
            highs.push(value.temp.max);
            w_date.push(value.dt)
          });

          chartGraph(iElement, highs, iAttrs, w_date);
        }
      });
    }
  }
});

var chartGraph = function(element, data, opts, w_date) {
  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width = 1110 - margin.left - margin.right,
    height = 500;
  var conv_date = [];
  for (var i = 0; i < w_date.length; i++) {

    conv_date[i] = new Date(w_date[i] * 1000);
  }

  var timeFormat = d3.time.format("%b-%e")
  var svg = d3.select(element[0]).append('svg:svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).attr('class', 'sparkline').append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  for (var i = 0; i < w_date.length; i++) {
    w_date[i] = new Date(w_date[i] * 1000);
    //console.log(w_date[i]);
  }

  var xMin = d3.min(w_date);
  var xMax = d3.max(w_date);
  //console.log("xMin is: " + xMin);
  var maxY = d3.max(data),

    x = d3.time.scale().domain([xMin, xMax]).range([0, width]),
    y = d3.scale.linear().domain([
      0, maxY + 10
    ]).range([height, 0]),
    yAxis = d3.svg.axis().scale(y).orient('left').ticks(5),
    xAxis = d3.svg.axis().scale(x).orient('bottom')
    // .ticks(5)
      .tickFormat(timeFormat);


  var innerwidth = width - margin.left - margin.right,
    innerheight = height - margin.top - margin.bottom;


  svg.append('g').attr('class', 'axis').call(yAxis);

  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

  svg.append("text").attr("x", width).attr("y", height + margin.bottom)

  var line = d3.svg.line().interpolate('linear')
      .x(function(d, i) {
      return x(w_date[i]);
    }).y(function(d, i) {
      return y(d);
    }),
    path = svg.append('svg:path').data([data]).attr('d', line).attr('fill', 'none').attr('stroke-width', '1').attr('stroke', 'blue');
}

app.directive('ngCity', function() {
  return {controller: function($scope) {}}
});
