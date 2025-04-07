function load_past_sightings(){
	var	FS = require("fs");
	const { v4: uuidv4 } = require('uuid');
	var AWS = require("aws-sdk");
	var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

	console.log("getting past bird sightings");
	//console.log(req);

	let rawdata = FS.readFileSync('past_sightings.json');
	let past_sightings = JSON.parse(rawdata);
	var items_array = [];

	for ( var i = 0; i < past_sightings.length; i++ ) {
	    //adding id to data
	    past_sightings[i].id = uuidv4();

	    //replacing date_str (ISO date) with date_int (epoch time - numerical date)
	    var sighting_date = new Date(past_sightings[i].date_str); // some mock date
		past_sightings[i].date_int = sighting_date.getTime()/1000;
		delete past_sightings[i].date_str;

		console.log(past_sightings[i]);

		var item = {
                PutRequest: {
                 Item: past_sightings[i]
                }
             };

        if (item) {
            items_array.push(item);
        }

	}


	console.log(items_array);

	var params = {
    	RequestItems: {
        	'BirdSightings': items_array
    	}
    };

    docClient.batchWrite(params, function(err, data) {
        if (err) {
            console.log(err);
        } else  {
            console.log('Added ' + items_array.length + ' items to DynamoDB');
        }
    });

}

load_past_sightings();
/*
Copyright @2021 [Amazon Web Services] [AWS]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
