import boto3
import os

# Setup boto3
S3API = boto3.client("s3", region_name="us-east-1")

# Copy website code to S3
buckets = S3API.list_buckets()
website_bucket = buckets['Buckets'][0]['Name']
print('The website S3 bucket is:', website_bucket)

os.chdir('/home/ec2-user/environment')
os.system('aws s3 cp website s3://%s --recursive --cache-control "max-age=0"' %website_bucket)
