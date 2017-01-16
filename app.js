var express = require('express');
var path    = require('path');
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

app.get('/area/:swlat/:swlng/:nelat/:nelng',function(req,res){
  var swlng = parseFloat(req.params.swlng);
  var swlat = parseFloat(req.params.swlat);
  var nelng = parseFloat(req.params.nelng);
  var nelat = parseFloat(req.params.nelat);
  var cr = [[swlng,swlat],[nelng,swlat],[nelng,nelat],[nelng,swlat],[swlng,swlat]];
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
        type: "FeatureCollection"
      };
      result.features = dox;
      res.json(result);
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
