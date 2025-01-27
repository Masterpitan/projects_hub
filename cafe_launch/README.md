##LAUNCHING A CAFE WEBSITE WITH CLOUDFORMATION
A cafe business has adopted production and deployment using cloudformation to create multiple region deployments with similar configurations. Thus, this challenge lab tasks me to use cloudformation and the AWS CLI to do the following:

-[]Deploy a virtual private cloud (VPC) networking layer by using a CloudFormation template.
-[]Deploy an application layer by using a CloudFormation template.
-[]Use Git to invoke CodePipeline and to create or update stacks from templates that are stored in CodeCommit.
-[]Duplicate network and application resources to another AWS Region by using CloudFormation.  

Static web contents were first hosted in Amazon S3, the cloudformation code used is provided in this repository and file named as “s3.yaml”. 

After writing the code for bucket creation, I uploaded the stack which created the bucket in the Cloud IDE using:

    aws cloudformation create-stack –stack-name CreateBucket –template-body file://s3.yaml

The code above created a stack which creates an s3 bucket in my AWS Management console. The web application code which have been provided for the static website alongside the static web contents (images) was then uploaded in a zip format to my cloud IDE using the command below:

    wget https://aws-tc-largeobjects.s3.us-west-2.amazonaws.com/CUR-TF-200-ACACAD-3-113230/15-lab-mod11-challenge-CFn/s3/static-website.zip

To unzip into a folder named “static”, I used the code:

    unzip static-website.zip -d static

The unzipped contents were then uploaded to the s3 bucket created earlier using the codes and the processes below:
#2. Set the ownership controls on the bucket

    aws s3api put-bucket-ownership-controls --bucket createbucket-s3bucket-pvv8fegfuhbp --ownership-controls Rules=[{ObjectOwnership=BucketOwnerPreferred}]

#3. Set the public access block settings on the bucket

    aws s3api put-public-access-block --bucket createbucket-s3bucket-pvv8fegfuhbp --public-access-block-configuration "BlockPublicAcls=false,RestrictPublicBuckets=false,IgnorePublicAcls=false,BlockPublicPolicy=false"

#4. Copy the website files to the bucket

    aws s3 cp --recursive . s3://createbucket-s3bucket-pvv8fegfuhbp/ --acl public-read

The stack is now updated to enable static website hosting, I configured the website urls and wrote additional lines of code updated in my file “s3.yaml”

Next, I wrote the scripts in CLI:

    cd ../

    aws cloudformation validate-template --template-body file://S3.yaml

    aws cloudformation update-stack --stack-name CreateBucket --template-body file://S3.yaml

The scripts validated and updated the stack respectively, at the outputs section of the stack, the website link was there hosting my static website.
After uploading the contents, I had to go back to my stack and update the code in my IDE to accommodate static website hosting. Thus, I added few lines of code to it to retain deletion policy and output web url.

##Using Version Control System to Build and Store Templates for other resources for the web application

Next, I saved a copy of the repository to my IDE using the git clone function where I cloned from the AWS Code omit, a source control service similar to GitHub. This allows having my templates and web application files in my IDE for the dynamic website hosting. Since templates are updated regularly, I also used CI/CD with the AWS Code pipeline to update and define new templates that launch new services for the cafe such as VPC, subnets, security groups and EC2 Instances.

The first template contained seven resources:
1. VPC
2. IGW
3. VPCTOIGW Connection
4. Public Route Table
5. Public Route
6. Public Subnet
7. Public Route Table Association

In cloning the repo, I copied the HTPPS code and inserted into the CLI:

    git clone <htpps code>

I navigated into the repo directory using:

    cd <repo directory>

I updated changes using the GitHub code actions to the template folder:

    git add .

    git commit -m “commit message”

    git push

My stacks were also updated through the code pipeline and code commit. In the AWS console, VPC, internet gateway, public route table and subnet were already created using the cloudformation stacks deployed through the AW Code pipeline
The stacks were updated to include information that exports necessary information about the resources created (VPC and subnet) which are instrumental to the ec2 instances launched afterwards. This cloudformation stack that creates vpc and subnet is named “cafe-network.yaml”

Thus, I modified another cloudformation resource to create an ec-2 instance launched with the following configurations:

An option to launch using various instance sizes including t2.micro, t2.small, t3.micro and t3.small.
An imageID that references the latest ID parameter
An instance profile (caferole) already created in the console which allows retrieval of parameter store values from the AWS System Manager
Properties code to ensure the instance is deployed to the right subnet created earlier
A tag name
User data

The code was pushed using the github commands in the terminal while the code pipeline integrated the changes thereby validating the launch of the ec-2 instance and the security group. The cafe website successfully loaded showing the details:
Ip address
Region and availability zones
Instance ID

The cloudformation code is named “cafe-app.yaml”
