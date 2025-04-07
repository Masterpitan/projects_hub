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
