var assert = require('assert');
var rotatingGecoder = require('./index');

describe('Rotating geocoder',function() {
  it('recurses the geocoding options using geocodio prioritized',function(done) {
    rotatingGecoder({
      'opencage': {
        'options': {
          'apiKey': 'fsfsdfsdf'
        },
        'priority': 1
      },
      'geocodio': {
        'options': {
          'apiKey': process.env.GEOCODEIO_KEY
        },
        'priority': 0
      }
    })('1600 Pennsylvania Ave NW, Washington, DC 22201',function(err,res) {
      assert(res.length > 0);
      assert.equal(res[0].provider,'geocodio');
      assert.equal(res[0].latitude,38.897667);
      assert.equal(res[0].longitude,-77.036545);
      done(err);
    });
  });

  it('recurses the geocoding options using google prioritized',function(done) {
    rotatingGecoder({
      'google': {
        'options': {
          'apiKey': process.env.GOOGLE_KEY
        },
        'priority': 0
      },
      'geocodio': {
        'options': {
          'apiKey': process.env.GEOCODEIO_KEY
        },
        'priority': 1
      }
    })('1600 Pennsylvania Ave NW, Washington, DC 22201, USA',function(err,res) {
      assert(res.length > 0);
      assert.equal(res[0].provider,'google');
      assert.equal(res[0].latitude,38.89767579999999);
      assert.equal(res[0].longitude,-77.0364827);
      done(err);
    });
  });

  it('recurses the geocoding options using geocodio prioritized after dummy key',function(done) {
    rotatingGecoder({
      'tomtom': {
        'options': {
          'apiKey': 'dfsfscvcvsdf'
        },
        'priority': 0
      },
      'geocodio': {
        'options': {
          'apiKey': process.env.GEOCODEIO_KEY
        },
        'priority': 1
      }
    })('1600 Pennsylvania Ave NW, Washington, DC 22201',function(err,res) {
      assert(res.length > 0);
      assert.equal(res[0].provider,'geocodio');
      assert.equal(res[0].latitude,38.897667);
      assert.equal(res[0].longitude,-77.036545);
      done(err);
    });
  });
});
