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
var app = angular.module('weatherApp', []);

app.factory('googleMap', function() {
  var kansas = {lat: 39.099727, lng: -94.578567};
  var mapOptions = {
    center: kansas,
    zoom: 4
  };
  //makes map
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    return {
      addMarker: function(result) {
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
        var contentString = "City: " + result.name + "<br>Current Temp: " + result.main.temp + "<br>High Of: " + result.main.temp_max + "<br>Low Of: " + result.main.temp_min + "<br>Pressure: " + result.main.pressure + "<br>Humidity: " + result.main.humidity + "<br>Wind Speed: " + result.wind.speed;
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
    }
  };
});

app.controller('MainController', function($scope, weather, googleMap){
  weather.getByIds(cityIdList, function(data) {
    $scope.data = data;
    console.log(data);
    var results = data.list.map(function(result) {
      googleMap.addMarker(result);
    });
  });
});
