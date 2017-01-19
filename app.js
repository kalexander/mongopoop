var express = require('express');
var path    = require('path');
var _       = require('lodash');
var request = require('superagent');
var async   = require('async');
var app = express();
var MongoClient = require('mongodb').MongoClient

var db = void(0);

MongoClient.connect('mongodb://127.0.0.1/geo',function(err,deebee){
  if(err){
   console.log(err);
  }
  console.log('workz...');
  db = deebee;
});

app.use('/', express.static(path.join(__dirname, 'public')))


app.get('/70816',function(req,res){
  var coll = db.collection('zips');
  coll
    .find({ 'properties.GEOID10' : '70816' } )
    .toArray(function(err, dox){
      var result = {
        type: "FeatureCollection"
      };
      result.features = dox;
      res.json(result);
    });
});

app.get('/zipdata/:zip', function(req,res){
  var zip = req.params.zip;
  var codes = {
    713940: 'Fitness Center',
    54111: 'Offices of Laywers'
  };

  var retStr = "";

  var getZipData = function(code,cb){
    var url = 'http://api.census.gov/data/2014/zbp?get=EMP_F,ESTAB_F,EMP,ESTAB,EMPSZES&for=zipcode:'+zip+'&NAICS2012='+code;
    console.log(url);
    request
      .get(url)
      .set('Accept', 'application/json')
      .end(function(err, resp){
        if(err){
          console.log(err);
        }
        retStr = retStr + codes[code] + " : " + (_.isEmpty(resp.body) ? "n/a" : resp.body[1][3]) +"<br/>";
        cb();
      });
  };

  async.eachSeries(_.keysIn(codes),getZipData,function(){
    res.json({data: retStr});
  })
});

app.get('/area/:swlat/:swlng/:nelat/:nelng',function(req,res){
  var swlng = parseFloat(req.params.swlng);
  var swlat = parseFloat(req.params.swlat);
  var nelng = parseFloat(req.params.nelng);
  var nelat = parseFloat(req.params.nelat);
  var coll = db.collection('zips');
  coll.find(
    {
      geometry: {
        $geoWithin: {
          $geometry: {
            type: "Polygon",
            coordinates: [ [ [nelng,swlat], [swlng,swlat], [swlng,nelat], [nelng,nelat], [nelng,swlat] ] ]
          }
        }
      }
    }
  ).toArray(function(err, dox){
    var result = {
      type: "FeatureCollection",
      features: dox
    };
    res.json(result);
  });
});

app.get('/plotzips/:zipz',function(req,res){
  console.log('in plotzips..')
  var zips = req.params.zipz.split(",");
  zips = _.map(zips,function(o){
    return "" + o;
  });
  console.log(zips);
  var coll = db.collection('zips');
  coll.find(
    { 'properties.GEOID10' : { $in : zips } }
  ).toArray(function(err, dox){
    var result = {
      type: "FeatureCollection"
    };
    result.features = dox;
    console.log(result);
    console.log(err);
    res.json(result);
  });
});

app.get('/circlearea/:lat/:lng/:radius',function(req,res){
  var lng = parseFloat(req.params.lng);
  var lat = parseFloat(req.params.lat);
  var radius = parseFloat(req.params.radius);
  var coll = db.collection('zips');
  coll.find(
      { geometry:
        {
          $nearSphere: {
            $geometry: {
              type : "Point",
              coordinates : [ lng, lat ]
            },
            $minDistance: 0,
            $maxDistance: radius
          }
        }
      }
  ).toArray(function(err, dox){
    var result = {
      type: "FeatureCollection"
    };
    result.features = dox;
    console.log(result);
    console.log(err);
    res.json(result);
  });
});

app.get('/bigarea', function(req,res){
  var coll = db.collection('zips');
  coll.find(
      {
         geometry: {
           $geoWithin: {
             $geometry: {
               type: "Polygon",
               coordinates: [ [ [ -70, 45 ], [ -70, 40 ], [ -75, 40 ], [ -70, 45 ] ] ]
             }
           }
         }
      }
  ).toArray(function(err, dox){
    var result = {
      type: "FeatureCollection",
      features: dox
    };
    console.log(result)
    res.json(result);
  });
});


app.listen(3011, function () {
  console.log('Example app listening on port 3011!');
});
