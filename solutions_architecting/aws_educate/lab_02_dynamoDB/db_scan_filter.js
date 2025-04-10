var DB = (function(){
	var
		expose = {
			getSightings: getSightings
		},hide = {
			//init
			setUpHandlers: setUpHandlers
		};

	(function init(){
		setUpHandlers();
	})();

	function setUpHandlers(){
		$(document).on("load", "[data-action='get-sightings']", getSightings);
	}

	async function getSightings(req, res, next){
		console.log('getSightings');
		var msg_str = "We are verifying that your temporary AWS credentials can access dynamoDB. One moment...";
		$("[data-role='get-sightings-from-ddb']").text(msg_str);


		var token_str_or_null = localStorage.getItem("bearer_str");

		AWS.config.update({region: "us-east-1"});

		// Using Cognito Identity to retrieve temporary AWS Credentials
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        	IdentityPoolId : CONFIG.COGNITO_IDENTITY_POOL_ID_STR,
	    	Logins : {
       		   "cognito-idp.us-east-1.amazonaws.com/us-east-1_9aq7jGv9p": token_str_or_null
       		}
		});

		var docClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

		var student_name = req;
		console.log('Checking student name.');
		console.log(student_name);

		var params = {
        	TableName: "BirdSightings",
    		FilterExpression: "student_name_str = :student_name_str",
    		ExpressionAttributeValues: { ":student_name_str": student_name }
    	};

    	// testing communitaction with DynamoDB
    	async function getDdbData(){
        	try {
        	    const data = await docClient.scan(params).promise()
        	    msg_str = "Got DB data.";
        	    sightings_list = data['Items'];
        	    for ( var i = 0; i < sightings_list.length; i++ ) {
        	    	sighting_date = new Date(sightings_list[i].date_int * 1000);
        	    	sighting_date.toISOString().substring(0, 10);
        	    	year = sighting_date.getFullYear();
        	    	month = sighting_date.getMonth()+1;
        	    	day = sighting_date.getDate();
        	    	sightings_list[i].date_str = month+'-' + day + '-'+year;
        	    	delete sightings_list[i].date_int;
        	    }

       	    	return {
       	    		msg_str: msg_str,
       	    		sightings_list: sightings_list,
       	    	}
       		} catch (err) {
       			msg_str = "There was a problem with your credentials.";
       	    	return msg_str
       		}
    	}

		var sightingsDdbData = await getDdbData();

		$("[data-role='get-sightings-from-ddb']").text(msg_str);

		return sightingsDdbData['sightings_list']

	}

	return expose;

})();
