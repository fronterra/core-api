# Core API Design Document


## Overview

## Technical Specification

### Databases
#### Summary
The database layer is comprised of one document-based data store, and one object-based database. In this case we will use MongoDB for docoument storage, and AWS S3 for object storage. MongoDB will contain the majority of our applications data--anything that can be encoded into a BSON document, MongoDB's json analog. An S3 bucket will hold any additional objects or files that MongoDB isn't equied to store, such as media files.

#### Specification
1. **Setup Instructions**: Database setup instructions for both S3 and MongoDB Atlas. Instructions should explain implementation procedures for setting up each cloud database for production. Additional instructions should be provided for setting up local versions of each database for testing purposes. All setup instructions should be added to the `README.md` file.

2. **Schema Documents**: Schema documents should be written up for each MongoDB collection used by the application. They should follow the [JSON Schema protocol](https://json-schema.org). A useful tool for building and visualizing JSON Schema can be found [here](https://jsonschema.net).

### Operations
#### Summary
Operations--specifically referring to "database operations"--is an abstraction layer that sits between the traditional model and database layers. It's purpose here is to clearly define a  set of robust CRUD operations, which are returned from function closures, one defined for each database. For instance, `~/operations/mongodb/databaseOps.js` defines a function closure that establishes a connection to the database server, and then returns an object containing functions such as `getPage`, `getResource`, `updateResource` and `deleteResource`. Analogous functions are defined in `~/operations/aws/s3Bucket.js`, which is responsible for standardizing the process of manipluting  the S3 bucket regardless of the context under which it occurs.

#### Specification
1. MongoDB Operations
    - `databaseOps.js`
    - `connection.js`
2. AWS S3 Operations
    - `s3Bucket.js`

### Models
#### Summary
A model should be constructed for each collection or table in the database. Each should contain, at a minimum, one `static` method for each CRUD operation. 

#### Example Model
```javascript
class Model {
    static async _read() {};

    static async _write() {};

    static async _update() {};

    static async _delete() {};
}
```
#### Specification
### Controllers
#### Summary
#### Goals