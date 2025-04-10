This lab involve task that deal with creating an Amazon DynamoDB table and using it to support a web application (the bird web application). The task objectives include the following:

    - Use the AWS Management Console to create a DynamoDB table.
    - Use a batch script to insert multiple records into a DynamoDB table.
    - Update the website to read items from the DynamoDB table.
    - Update the website to add items to the DynamoDB table.
    - Use the console to create a global secondary index (GSI) for a DynamoDB table.
    - Query table data by using a GSI.
### SCENARIO

In the first lab involving Cognito setup and configuration, security has been configured for the application using Amazon Cognito.

By using an Amazon Cognito user pool, we have required users to log in to reach both the Sightings page and the Report page on the website. We also verified that the Amazon Cognito identity pool provides the logged in user with credentials that the application can use to interact with AWS services such as DynamoDB.

So far, the application has been using a JSON formatted text file to provide static bird sighting data to the website's Sightings page. Now that we have taken care of security, we will update the application to provide live data to the application.

First, we will create a DynamoDB table to store bird sighting records. Then, we will load historical data into the table. We will update the website code to retrieve items and add new items to the table. Finally, we will update a script to provide a weekly report for Ms. García.

### TASK ONE: CONNECTING TO CLOUD9
A cloud9url was already setup, in the AWS Console, we access the Cloud9 and click on the url which opens an IDE for us to use throughout the task.

We pass in a "wget" command and a url to install the web application codes for use. the code pattern is:

    wget <zip folder link>

Afterwards, we unzip using:

    unzip code.zip

then, we set up using:

    . ./setup.sh

The codes above set our web application code up which we will use throughout the tasks.

A cloudfront domain is provided and an s3 bucket which will be needed for further use. Therefore, they are saved into a text document outside the IDE alognside other texts which are needed later in the tasks. They include:

    - CloudFront distribution domain
    - S3 Bucket
    - Table name:
    - Table partition key:
    - Table sort key:
    - Password:
    - Index name:
    - Index partition key:
    - Index sort key:
After inputing the available values, we navigate back to the node_server folder to start and use the application.

    cd ..
    cd /node_server/
    npm start

This deploys our cloudfront distribution using the cloudfront domain derived earlier, we check the availability status and once it's in an "enabled" stage, we can use the domain to access the bird web application. The page image without dynamoDB set up is shown below:
![main-page](images/main-page.PNG)

### TASK TWO: Creating a DynamoDB table

To store and dynamically manage student bird sighting data, we create a new DynamoDB table.

Initially, we will create this table with only two attributes. Every DynamoDB table requires a primary key. For this table, we will configure a composite primary key, which means it will have a partition key and a sort key.

The first attribute that we will define in the table is id, which will be the table's partition key. The second attribute will be student_name_str, which will be the sort key.

We navigate to DynamoDB through the AWS Console

We click on "create table", table name is "BirdSightings"; partition key is "id" with string format selected
sort key is "student_name_str" with string format also selected. These values are kept in the notepad variables stored earlier.

### Task 3: Adding multiple records to the table by using a batch script

In this task, we use a batch script to load multiple data into the table. we use a batch script because its efficient and faster than using manual entry which can also generate errors. Hnece, we write a script that reads through multiple entries and loads them into the table while also formatting them

We edit the javascript file that contains the script by replacing the dynamodb placeholder with the dynamoDB table name "BirdSightings". The name of the file is "load_past_sightings.js"

After saving the file, we open another terminal while the first terminal is still running, we then run the loas_past_sightins.js by running:

    node load_past_sightings.js

It loads the sightings and displays an image just like it's shown below:
![load-table](images/load-table.PNG)

Upon loading the records of the past sightings, we navigate back to our AWS Console and click on the table created. We click on "explore table items" and select the "scan" feature. It displays our recently loaded items which we did from the IDE, a picture of it is shown below:
![table-scan](images/table-scan.PNG)

However, when we created our table using the console, we setup only two attributes, our records loaded into the table from the IDE returned seven attributes. This is possible because DynamoDB is expandable and can include more attributes unlike the SQL which must tally with the schema set. DynamoDB is NoSQL, hence, the difference in attribute cannot fail its loadings.

### Task 4: Retrieving data programmatically by using the scan method

In the Amazon Cognito lab, the Birds website returned a list of past bird sightings by reading them from a static file. In this task, you will update the website code to show dynamic data from your BirdSightings table. This way, when students add more records in the future, the new records will automatically display on the Sightings page in the application.

The AWS SDK offers multiple methods to retrieve data from a DynamoDB table. One method is the scan operation. A scan operation reads every record in a table or a secondary index. If you want to retrieve every record, this is the best method to use.

In this task, you will update the website code to scan records from your DynamoDB table.

The db_scan.js file was used to perform this function. We updated the code to include the BirdSightings table so as to scan records from the DynamoDB table. The db_scan.js file is also in this folder

Using the following commands below, the website codes are updated to take upon the new changes:

    cd /home/ec2-user/environment/website
    cp index_db_scan.html index.html
    cp scripts/templates_sightings_from_db.js scripts/templates.js

The website codes also needed to be updated in the AWS S3 bucket, a Python code was already written to that effect. So we navigate back to the /resources folder and run the python code using the following codes:

    cd /home/ec2-user/environment/resources
    python upload_website_code.py

After the update, the update website now looks like this as against the first one:
![updated-web-page](images/updated-web-page.PNG)

The sightings page is being tested and the image below shows all the sightings recorded after students are able to log in:
![whole-sighting-page](images/whole-sighting-page.PNG)

However, the request is to allow students only access their own sightings and not the whole sightings, requiring a new task.

Therefore, the filter expression in the db_scan_filter.js file is edited to include the attribute name which we set earlier while setting up our DynamoDB table.

After the code update, we also update the website code to reflect the new filter feature as done earlier using the codes:

    cp index_db_scan_filter.html index.html

We also update te AWS S3 bucket using the code:

    python upload_website_code.py

We test the new feature by refreshing the website and loading the sightings page again using the teststudent login details used earlier. This is how it loads now bringing only sightings by the testdtudent and not all the sightings of students:
![test-student-sighting](images/test-student-sighting.PNG)

### Task 5: Adding a single record to the table by using the put method
This task updates the bird application so students can add records through the report page

We navigate back to the website/scripts folder locating the template_with_add_sightings.js file and editing the following parameter placeholders to include the parameters saved at the creation of the DynamoDB table:

    - Table Name
    - partition key
    - sort key

We update the website code by copying the new files to the files and also updating the codes in the S3 Bucket by running the python code

We test the updated feature by selecting the report page which now looks like this:
![report-page](images/report-page.PNG)

We include some new sightings of birds and go back to the sightings page to check for the new update. the new sightings are updated on the teststudent page as shown below too:
![new-sighting-page](images/new-sighting-page.PNG)

### Task 6: Adding a GSI to the table
Just like we edited the code to filter the table to include only sightings by each student and not all sightings at once, this task charges us to filter the code such that only selected grades can be viewed at a time. Hence, we edit the code to include Grade three students alone since all grades have access to update sightings.

Before we do this, we need to add records from other grades to effectively test our new feature.

We do this by running the load_past_sightings_2.js file using the code:

    node load_past_sightings_2.js

This loads additional records to the table

After loading additional records, we now create a GSI. The following steps achieve this:

1. We return to the AWS console and click on our DynamoDB BirdSightings Table
2. Click on "actions" and select "create index"
3. We use the following details to create:
    - partition key: class_level_str; data type is string
    - sort key: date_int; data type is number
    - index name: class-date-index
    We click on "create index"
4. The index name, partition and sort key are recorded in a text editor for future reference

### Task 7: Using a GSI in a DynamoDB query operation
The importance of query operation allows us to search specific data from the database rather than scanning all the items. This saves more time, limits the number of reads and saves cost.

We open the ddb_query.js file to update the placeholders for:

    <index_name>
    <partition_key>
    <sort_key>

They are replaced with the codes saved earlier. Then we save our file and run the query to test the new feature by using:

    node ddb_query.js

# NOTE: The code above can only be ran after the GSI status shows "active" in the AWS DynamoDB console

The query response is shown below after reading the data queried:
![query](images/query.PNG)

The output confirms that our query feature now works perfectly which marks the end of this lab.

# END OF LAB
