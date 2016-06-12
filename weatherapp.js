var cityIds = [
  4180439,
  5128638,
  4560349,
  4726206,
  4671654,
  5809844,
  5368361,
  5391811,
  5308655,
  4684888,
  4887398,
  5391959,
  5392171,
  4164138,
  4273837,
  5746545,
  4699066,
  5419384,
  4990729
];
var cityIdList = cityIds.join(',');
var infoWindows = [];
var app = angular.module('weatherApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when("/", {
    controller: "MainController",
    templateUrl: 'overview.html'
  })
  .when("/city/:cityId", {
    controller: "forcastController",
    templateUrl: "forcast.html"
  });
});

app.factory('googleMap', function() {
  //initialize google maps
  // var kansas = {lat: 39.099727, lng: -94.578567};
  // var mapOptions = {
  //   center: kansas,
  //   zoom: 4
  // };
  // var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    return {
      addNewMap: function(lat, lng, zoom) {
        var mapOptions = {
          center: {lat: lat, lng: lng},
          zoom: zoom
        };
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        return map;
      },
      addMarker: function(result, map) {
        var image = {
          url: "http://openweathermap.org/img/w/" + result.weather[0].icon + ".png",
          size: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(25, 25)
        };
        var marker = new google.maps.Marker({
          position: { lat: result.coord.lat, lng: result.coord.lon },
          map: map,
          icon: image,
          anchorPoint: new google.maps.Point(0,-8)
        });
        var contentString = "<h4>" + result.name + "</h4>" + "Current Temp: " + result.main.temp + "<br>High Of: " + result.main.temp_max + "°F<br>Low Of: " + result.main.temp_min + "°F<br>Pressure: " + result.main.pressure + "<br>Humidity: " + result.main.humidity + "%<br>Wind Speed: " + result.wind.speed;
        var infoWindow = new google.maps.InfoWindow({
          content: contentString
        });
        //push infoWindow in to array
        infoWindows.push(infoWindow);
        function hideAllInfoWindows() {
          //goes through each infoWindow in the infoWindows array
          infoWindows.forEach(function(infoWindow) {
            infoWindow.close();
          });
        }
        marker.addListener('click', function() {
          hideAllInfoWindows();
          infoWindow.open(map, marker);
        });
        result.openInfoWindow = function(){
          hideAllInfoWindows();
          infoWindow.open(map, marker);
        };
      }
    };
});

//custom service for weather request
app.factory('weather', function($http) {
  var APPID = '16b35f21e8495fad2af63abb2d969031';
  return {
    getByIds: function(cityIdList, callback) {
      $http({
        url: 'http://api.openweathermap.org/data/2.5/group',
        params: {
          APPID: APPID,
          id: cityIdList,
          units: 'imperial'
        }
      }).success(callback);
    },
    getWeatherForcast: function(cityId, callback) {
      var APPID = '16b35f21e8495fad2af63abb2d969031';
        $http({
          url: "http://api.openweathermap.org/data/2.5/forecast",
          params: {
            APPID: APPID,
            id: cityId,
            units: 'imperial'
          }
        }).success(callback);
    }
   };
});

app.controller("forcastController", function($scope, $http, $routeParams, weather) {
  var cityId = $routeParams.cityId;
  weather.getWeatherForcast(cityId, function(data) {
    $scope.data = data;
    var results = data.list;
    console.log(data);
  });

});

app.controller('MainController', function($scope, weather, googleMap){
  weather.getByIds(cityIdList, function(data) {
    $scope.data = data;
    console.log(data);
    var map = googleMap.addNewMap(39.099727,-94.578567, 4);
    var results = data.list.map(function(result) {
      googleMap.addMarker(result, map);
    });
  });
});
