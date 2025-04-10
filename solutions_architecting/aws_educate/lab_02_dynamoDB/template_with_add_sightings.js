var TEMPLATES = (function(){
	var
		expose = {
			birds: birds,
			home: home,
			report: report,
			sightings: sightings
		},hide = {
			//init
			addSighting: addSighting,
			reportSightingsFailure: reportSightingsFailure,
			reportSightingsSuccess: reportSightingsSuccess,
			sightingsFailure: sightingsFailure,
			sightingsSuccess: sightingsSuccess,
			setUpHandlers: setUpHandlers
		};


	async function addSighting(){

		var msg_str = "We are verifying that your temporary AWS credentials can access dynamoDB. One moment...";
		$("[data-role='add_sighting_output']").text(msg_str);


		var username = document.getElementById('cognito_user').value;;
		var bird_name = document.getElementById('bird_name_str').value;
		var location = document.getElementById('location_str').value;
		var count = document.getElementById('count_str').value;
		var date_str = document.getElementById('date_str').value;
		var grade_level = document.getElementById('class_level_str').value;
		console.log(bird_name);
		var id = uuidv4();

		//convert date string to date int
		sighting_date = new Date(date_str);
		date_int = sighting_date.getTime()/1000;
		console.log(date_int);

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


		var params = {
				TableName: 'BirdSightings',
				Item: {
					'id': id,
					'student_name_str': username,
					'bird_name_str': bird_name,
					'location_str': location,
					'count_int': parseInt(count),
					'date_int': date_int,
					'class_level_str': grade_level
			}
		};

		async function addItem(){
        	try {
            	const data = await docClient.put(params).promise()
       	    	return data
       		} catch (err) {
       	    	return err
       		}
    	}

    	var addItemResponse = await addItem();

		if (addItemResponse["statusCode"]){
    		var msg_str = "There was a problem addng the record.";
			$("[data-role='add_sighting_output']").text(msg_str);
		}else{
			var msg_str = "Your new bird sighting was added.";
			$("[data-role='add_sighting_output']").text(msg_str);
			document.getElementById('bird_name_str').value = "";
    		document.getElementById('location_str').value = "";
    		document.getElementById('count_str').value = "";
    		document.getElementById('date_str').value = "";
    		document.getElementById('class_level_str').value = "";
		}
	}

	function birds(){
		console.info("showing the all birds page");
		var
		bird = {},
		html_str = '';
		html_str += 	'<section>';
		html_str += 		'<p>Tap on a bird picture for more details.</p>';
		html_str += 		'<div data-role="bird_wrapper">';
		$.get("bird_info.json", function(bird_info_obj_arr){
			//auto parses
			for(var i_int = 0; i_int < bird_info_obj_arr.length; i_int += 1){
				bird = bird_info_obj_arr[i_int];
				html_str += 	'<a href="javascript:void(0);" data-action="show_bird_detail" data-image="' + bird.image_name_str + '" data-name="' + bird.bird_type_str + '" title="' + bird.bird_type_str + '" data-description="' + bird.description_str + '">';
				html_str += 		'<figure>';
				html_str += 			'<img width="120" height="80" alt="' + bird.bird_type_str + '" src="images/' + bird.image_name_str + '" />';
				html_str += 			'<figcaption>';
				html_str += 				bird.bird_type_str;
				html_str += 			'</figcaption>';
				html_str += 		'</figure>';
				html_str += 	'</a>';
			}
			html_str += 	'</div>';
			html_str += '</section>';
			$("[data-role='page_header'] > h1").text("the bird page");
			$("[data-role='page_content']").html(html_str);
			$("[data-target]").removeAttr("data-selected");
			$("[data-target='birds']").attr("data-selected", "selected");
		});
	}

	function home(){
		console.info("showing the home page");
		var html_str = '';
		html_str += '<section>';
		html_str += 	'<h2>Welcome Students!</h2>';
		html_str += 	'<p>';
		html_str += 		'This school year, you will be learning to identify different kinds of birds. Whenever you spot a bird, you will save your sighting details in the bird sightings log. The more you look, the more birds you will notice. You may be surprised how many you can spot around your home, local, parks, or even inside a store!';
		html_str += 	'</p><p>';
		html_str += 		'You can use the all birds page to help identify birds that you have found. Simply choose a bird image to find out the bird’s name and common characteristics.';
		html_str +=  	'</p><p>';
		html_str += 		'You will need to login to get to the secret page where you will add your bird sightings.';
		html_str += '</section>';

		$("[data-role='page_header'] > h1").text("home page");
		$("[data-role='page_content']").html(html_str);
		$("[data-target]").removeAttr("data-selected");
		$("[data-target='home']").attr("data-selected", "selected");
	}

	(function init(){
		setUpHandlers();
	})();


	function report(){
		console.info("showing the report page");
		var html_str = '';

		html_str += '<section>';
		html_str += 	'<p>Report a sighting</p>';
		html_str += 	'<p>This page now requires a login</p>';
		html_str += 	'<span data-action="login">login</span>';


		html_str += '</section>';

		$("[data-role='page_header'] > h1").text("report page");
		$("[data-role='page_content']").html(html_str);
		$("[data-target]").removeAttr("data-selected");
		$("[data-target='report']").attr("data-selected", "selected");

		var params = {

		};

		AJAXER.post("report-sightings", params, reportSightingsSuccess, reportSightingsFailure);

	}

	function reportSightingsFailure(e, response){
		if(e.status === 0 || e.status === 404 || e.status == 500){
			return; //we handled this already
		}
		//403 likely
		var html_str = '';
		// debugger;
		html_str += '<h1>Could not authenticate you.</h1>'; //403 || 412 (correct info not passed)
		html_str += '<p>' + e.responseJSON.msg_str + '</p>';
		AUTH.handleLogout();//clears the token so they have to login
		HELPER.showProblemModal(html_str);
	}

	function reportSightingsSuccess(response){
		var birds_array = ["American Crow","American Goldfinch","American Kestrel","American Robin","Baltimore Oriole","Barn Owl","Blue Jay","Carolina Wren","Cedar Waxwing","Downy Woodpecker","Eastern Bluebird","Eastern Screech Owl","European Starling","House Sparrow","House Wren","Mourning Dove","Northern Cardinal","Peregrine Falcon","Red-winged Blackbird","Rufous Hummingbird","Song Sparrow","Tufted Titmouse","White-breasted Nuthatch"];
		var locations_array = ["Park","School","Home","Lake","Grocery Store","Other"]
		var html_str = '';
		if(response && response.cognito_username_str){
			html_str += 	'<section>';
			html_str += 		'<p>Report a sighting</p>';
			html_str += 		'<span data-role="loggedin_in_student_name">Hello ' + response.cognito_username_str + '</span>';
			html_str += 		'<span data-action="logout">logout</span>';
			html_str += 		'<section data-role="report_container">';
			html_str += 			'<p>You are logged in, so you should also now have temporary credentials on this device.</p>';
			// added my awsmira
			html_str += 			'<label for="bird_name_str">Bird type:</label> <select id="bird_name_str" name="bird_name_str">';
			// build birds select list

			for (var i = 0; i < birds_array.length; i++) {
				bird_name = birds_array[i];
				html_str += 				'<option value="' + bird_name + '"> ' + bird_name + '</option>';
			}


			html_str +=             '</select><br>';
			html_str +=				'<label for="location_str">Location:</label><select id="location_str" name="location_str">';

			for (var i = 0; i < locations_array.length; i++) {
				location_name = locations_array[i];
				html_str += 				'<option value="' + location_name + '"> ' + location_name + '</option>';
			}

			html_str +=             '</select><br>';
			html_str +=				'<label for="count_str">How many?:</label><input value="1" min="1" type="number" id="count_str" name="count_str"><br>';
			html_str +=				'<label for="date_str">When?:</label><input type="date" value="' + (new Date()).toJSON().substring(0,10) + '" id="date_str" name="date_str"><br>';
			html_str +=				'<label for="class_level_str">Choose your grade level:</label><select id="class_level_str" name="class_level_str">';
            html_str +=					'<option value="3rd Grade">3rd Grade</option>';
        	html_str +=					'<option value="4th Grade">4th Grade</option>';
            html_str +=				'</select><br>';
            html_str +=				'<input type="hidden" id="cognito_user" name="cognito_user" value=' + response.cognito_username_str + '>';
			//
			html_str += 			'<span data-action="add_sighting">Add Sighting</span>';
			html_str += 			'<output data-role="add_sighting_output"></output>'; //add data returned from DDB API
			html_str += 	'</section>';
			$("[data-role='page_content']").html(html_str);
		}else{
			html_str += '<h2>Something went wrong</h2>';
			html_str += '<p>Check the server is set up correctly</p>';
			return HELPER.showProblemModal(html_str);
		}
	}


	function sightings(){
		console.info("showing the sightings page");
		var
		html_str = '',
		bird_image_name_str = "";
		html_str += '<section>';
		html_str += 	'<p>Sightings by students</p>';
		html_str += 	'<p>This page now requires a login</p>';
		html_str += 	'<span data-action="login">login</span>';
		// html_str += 	'<p>Some more text can go here...</p>';
		html_str += 	'<section data-role="secret_container">';
		html_str += 	'</section>';
		$("[data-role='page_content']").html(html_str);
		$("[data-role='page_header'] > h1").text("sightings page");
		$("[data-target]").removeAttr("data-selected");
		$("[data-target='sightings']").attr("data-selected", "selected");


		var params = {

		};

		AJAXER.post("sightings", params, sightingsSuccess, sightingsFailure);
	}

	function sightingsFailure(e, response){
		if(e.status === 0 || e.status === 404 || e.status == 500){
			return; //we handled this already
		}
		console.log('sightingsFailure');
		console.log(e);
		//403 likely
		var html_str = '';
		// debugger;
		html_str += '<h1>Could not authenticate you.</h1>'; //403 || 412 (correct info not passed)
		html_str += '<p>' + e.responseJSON.msg_str + '</p>';
		AUTH.handleLogout();//clears the token so they have to login
		HELPER.showProblemModal(html_str);
	}


	async function sightingsSuccess(response){
		var html_str = '';
		//updating to get sightings from database. Only checking that user is logged in.
		if(response && response.cognito_username_str){
			// need to get sightings from DB
			sightings_obj_arr = await DB.getSightings(response.cognito_username_str);

				html_str += 	'<section>';
				html_str += 		'<p>Sightings by students</p>';
				html_str += 		'<span data-role="loggedin_in_student_name">Hello ' + response.cognito_username_str + '</span>';
				html_str += 		'<span data-action="logout">logout</span>';
				html_str += 		'<section data-role="secret_container">';
				//student = response.sightings_obj_arr[i_int];
			for(var i_int = 0; i_int < sightings_obj_arr.length; i_int += 1){
				student = sightings_obj_arr[i_int];
				bird_image_name_str = student.bird_name_str.replace(/ /gi, "_").toLowerCase() + ".png";
				html_str += 			'<div data-role="student_info">';
				html_str += 				'<img width="48" height="auto" alt="' + student.bird_name_str + '" src="/images/' + bird_image_name_str + '" />';
				html_str += 				'<span data-role="bird_name">' + student.bird_name_str + '<em>(' + student.count_int.toString() + ')</em></span>';
				html_str += 				'<span data-role="student_name">' + student.student_name_str + '<em>(' + student.class_level_str + ')</em></span>';
				html_str += 				'<section data-role="bird_finder_detail">';
				html_str += 					'<span data-role="location">' + student.location_str + '<em>(' + student.date_str + ')</em></span>';
				html_str += 				'</section>';
				html_str += 			'</div>';
			}
			html_str +=  			'</section>';//end secret contaoner
			html_str += 		'</section>';
			$("[data-role='page_content']").html(html_str);
		}else{
			html_str += '<h2>Something went wrong</h2>';
			html_str += '<p>Check the server is set up correctly</p>';
			return showProblemModal(html_str);
		}
	}


	function setUpHandlers(){
		$(document).on("click", "[data-action='add_sighting']", addSighting);
		$(document).on("click", "[data-action='show_bird_detail']", showBirdDetail);
	}

	function showBirdDetail(){
		var bird = $(this).data();
		HELPER.showBirdModal(bird);
	}

	return expose;

})();
