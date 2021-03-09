# Fronterra Open Source API

## Introduction
The Fronterra API is an open source pollution reporting API. The core api provides CRUD operations for three enpoints: `reports`, `media` and  `admin`.


## Synopsis
Use the following instructions and source code to deploy a complete community-supported pollution reporting API.


## Database Setup
A key component of the reporting API is its ability to store media relating to an incidence of pollution. In order to accomplish this, our system relies on two different data-stores: MongoDB and AWS S3. MongoDB is a NoSQL database that stores unstructured information in the form of "documents". Although we *can* store media in MongoDB under certain encodings, there are far better options for the storage of potentially large media files. We are going to use an AWS S3 bucket. In the following section, you will find information on how to setup both databases.

### MongoDB

#### Atlas

#### Community Server

### AWS S3
1. Download the AWS CLI v2. See OS dependent instructions [here](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

2. Configure your CLI environment
- Once the AWS CLI has been installed, you can start to configure your profile using `aws configure`
- It will prompt you with the fields shown below
```
AWS Access Key ID [None]: <access_key_id>
AWS Secret Access Key [None]: <secret_access_key>
Default region name [None]: us-west-2
Default output format [None]: json
```

3. Create an S3 Bucket
```
user@MacBook-Pro ~ % aws s3 mb s3://fronterra-media
make_bucket: fronterra-media
```

## Endpoints
### 1. `/reports`


**GET**
- header
- url params
- query string params
- body

**POST**
- header
- url params
- query string params
- body

**DELETE**
- header
- url params
- query string params
- body

### 2. `/admin`


**GET**
- header
    - JWT token
- url params
- query string params
- body

**POST**
- header
- url params
- query string params
- body

**PATCH**
- header
    - JWT token
- url params
- query string params
- body


**DELETE**
- header
    - JWT token
- url params
- query string params
- body


### 3. `/media`


**GET**
- header
- url params
- query string params
- body

**POST**
- header
- url params
- query string params
- body
