var NodeGeocoder = require('node-geocoder');
var async = require('async');

module.exports = function(config) {
  var geocoders = [
    'google',
    'here',
    'freegeoip',
    'datasciencetoolkit',
    'openstreetmap',
    'mapquest',
    'openmapquest',
    'agol',
    'tomtom',
    'nominatimmapquest',
    'opencage',
    'smartyStreet',
    'geocodio',
    'yandex',
    'teleport',
    'opendata france'
  ].filter(function(geocoder) {
    return !(!config[geocoder]);
  })
  .map(function(geocoder) {
    var options = config[geocoder].options;
    options.provider = geocoder;
    return {
      'priority': config[geocoder].priority || 0,
      'geocoder': NodeGeocoder(options)
    };
  });
  geocoders.sort(function(a,b) {
    return a.priority - b.priority;
  });
  return function(string,done) {
    var i = 0;
    var makeNextRequest = function() {
      if (i < geocoders.length) {
        geocoders[i].geocoder.geocode(string,function(err,res) {
          if (err || !res || res.length == 0) {
            i++;
            makeNextRequest();
          } else {
            done(null,res);
          }
        })
      } else {
        done();
      }
    }
    makeNextRequest();
  }
}
