// create node.js ddb query to find records created in the past week

var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
var date = new Date();

date.setDate(date.getDate()-7);
begin_date = Date.parse(date)/1000;

console.log(begin_date);

var params = {
    TableName: "BirdSightings",
    IndexName: "class-date-index",
    KeyConditionExpression: "#class = :class and #date > :begin_date",
    ExpressionAttributeNames:{
        "#class": "class_level_str",
        "#date": "date_int"
    },
    ExpressionAttributeValues: {
        ":class": "3rd Grade",
        ":begin_date": begin_date
    }
};

docClient.query(params, onQuery);
var count = 0;


function onQuery(err, data) {
    if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else  {
        console.log("Query succeeded.");
        data.Items.forEach(function(itemdata) {
            console.log(itemdata);
        });

        // continue scanning if we have more items
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.query(params, onQuery);
        }
    }
}
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
