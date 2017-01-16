# mongopoop\\


-  edited out everything outsize of the featureContent stuff in the resulting .json file
-  mongoimport --db geo -c zips --file zcta5-clean.json  --jsonArray
-  db.zips.ensureIndex({"geometry":"2dsphere"})

 db.zips.createIndex( {geometry: "2dsphere" } )

db.zips.find({ properies : { GEOID10 : '78749' } }}


{
	"_id" : ObjectId("587ae09a8e5fb9f1dfe9c9b1"),
	"type" : "Feature",
	"properties" : {
		"ZCTA5CE10" : "04758",
		"GEOID10" : "04758",
		"CLASSFP10" : "B5",
		"MTFCC10" : "G6350",
		"FUNCSTAT10" : "S",
		"ALAND10" : 91006829,
		"AWATER10" : 191946,
		"INTPTLAT10" : "+46.5592719",
		"INTPTLON10" : "-067.8532254"
	},
	"geometry" : {
		"type" : "Polygon",
		"coordinates" : [
			[
				[
					-67.906499,
					46.525259

}


db.zips.find(
  {
     geometry: {
       $geoWithin: { 
         $centerSphere:  [ [ -70, 45 ], .5 ] 
         }
     }
  }
)

db.zips.find(
      {
         geometry: {
           $geoWithin: {
             $geometry: {
               type: "Polygon",
               coordinates: [ [ [ -71, 44 ], [ -71.3, 44 ], [ -71.3, 44.4 ], [ -71, 44.4 ], [ -71, 44] ] ]
             }
           }
         }
      }
)
