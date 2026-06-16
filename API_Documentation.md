# API Documentation

in these examples .env looks like this

```
PORT = 3000 
HOST = localhost

# JWT
JWT_SECRET = your_super_secret_here
JWT_EXPIRES_IN = 1h
```
## Authentication & Authorization
Some endpoints require the user to be authenticated and authorized. To access these endpoints, you need to include a valid JWT token in the Authorization header of your request. 

>To get a JWT token, you need to log in using the Login User endpoint. Once you have the token, you can include it in your requests.

# User API

## Create User

```POST: http://localhost:3000/api/users/create-user```

### Description
Creates as user in the database

### Body data
<details>
<summary>Format</summary>
<pre>{
    "username": String,
    "password": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "username": "newuser",
    "password": "password"
}</pre>
</details>

### Returns
**status**: 201
<details>
<summary>Format</summary>
<pre>{
    "id": String,
    "createdAt": String,
    "updatedAt": String,
    "deletedAt": String?,
    "username": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a",
    "createdAt": "2026-05-12T23:52:18.000Z",
    "updatedAt": "2026-05-12T23:52:18.000Z",
    "deletedAt": null,
    "username": "newuser"
}</pre>
</details>

## Login User
```POST: http://localhost:3000/api/users/login```

### Description
Logs in the user by checking their username and password against the database and returns the user objected with a JWT used as auth in most other endpoints

### Body data
<details>
<summary>Format</summary>
<pre>{
    "username": String,
    "password": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "username": "newuser",
    "password": "newpassword"
}</pre>
</details>

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "token": String,
    "user":{
        "id": String,
        "createdAt": String,
        "updatedAt": String,
        "deletedAt": String?,
        "username": String
    }
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld3VzZXIiLCJpYXQiOjE2MTk5MzQ0MDAsImV4cCI6MTYxOTkzODAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "user": {
        "id": "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a",
        "createdAt": "2026-05-12T23:52:18.000Z",
        "updatedAt": "2026-05-12T23:52:18.000Z",
        "deletedAt": null,
        "username": "newuser"
    }
}</pre>
</details>

## Get All Users

```GET: http://localhost:3000/api/users/all-users```

### Description
Gets all user objects from the database

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>[
    {
        "id": String,
        "createdAt": String,
        "updatedAt": String,
        "deletedAt": String?,
        "username": String
    }
]</pre>
</details>

<details>
<summary>Example</summary>
<pre>[
    {
        "id": "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a",
        "createdAt": "2026-05-12T23:52:18.000Z",
        "updatedAt": "2026-05-12T23:52:18.000Z",
        "deletedAt": null,
        "username": "testuser"
    }
]</pre>
</details>

## Get User By ID

```GET: http://localhost:3000/api/users/get-by-id/:id``` <br>
<br>
For example<br>
```GET: http://localhost:3000/api/users/get-by-id/9ad83156-5ed1-4e2f-8358-c6e2ce906f3a```

### Description
Gets a single user object from the database where the id numbers match

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": String,
    "createdAt": String,
    "updatedAt": String,
    "deletedAt": String?,
    "username": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a",
    "createdAt": "2026-05-12T23:52:18.000Z",
    "updatedAt": "2026-05-12T23:52:18.000Z",
    "deletedAt": null,
    "username": "testuser"
}</pre>
</details>



## Update User
```PUT: http://localhost:3000/api/users/update-user/:id``` <br>
<br>
For example<br>
```PUT: http://localhost:3000/api/users/update-user/9ad83156-5ed1-4e2f-8358-c6e2ce906f3a```

### Description
updates a user object in the database that matches the ID 

### Body Data
<details>
<summary>Format</summary>
<pre>{
    "username": String,
    "password": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "username": "newuser",
    "password": "newpassword"
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "message": String,
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "message": "User updated successfully"
}</pre>
</details>

## Delete User
```DELETE: http://localhost:3000/api/users/delete-user/:id``` <br>
<br>
For example<br>
```DELETE: http://localhost:3000/api/users/delete-user/9ad83156-5ed1-4e2f-8358-c6e2ce906f3a```

### Description 
Deletes a User object from the database where the IDs match

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID to access this endpoint

### Returns
**status**: 204

# Patient API

## Create Patient
```POST: http://localhost:3000/api/patients/create-patient```

### Description
Creates a Patient object in the database and returns back the same object with an id number added 

### Body data
<details>
<summary>Format</summary>
<pre>{
    "userId": String,
    "firstName": String,
    "lastName": String,
    "birthDate": String,
    "gender": String,
    "ethnicity": String,
    "weight": Number,
    "height": Number,
    "activityLevel": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "userId": "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a",
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-01-01",
    "gender": "Male",
    "ethnicity": "Caucasian",
    "weight": 70,
    "height": 180,
    "activityLevel": "Moderate"
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": String,
    "userId": String,
    "firstName": String,
    "lastName": String,
    "birthDate": String,
    "gender": String,
    "ethnicity": String,
    "weight": Number,
    "height": Number,
    "activityLevel": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "userId": "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a",
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-01-01",
    "gender": "Male",
    "ethnicity": "Caucasian",
    "weight": 70,
    "height": 180,
    "activityLevel": "Moderate"
}</pre>
</details>

## Get All Patients For a User
```GET: http://localhost:3000/api/patients/all-patients/:userId``` <br>
<br>
For example<br>
```GET: http://localhost:3000/api/patients/all-patients/9ad83156-5ed1-4e2f-8358-c6e2ce906f3a```

### Description
Gets all Patient objects from the database that have a user ID the same as what is in the params

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>[
    {
        "id": String,
        "userId": String,
        "firstName": String,
        "lastName": String,
        "birthDate": String,
        "gender": String,
        "ethnicity": String,
        "weight": Number,
        "height": Number,
        "activityLevel": String
    }
]</pre>
</details>

<details>
<summary>Example</summary>
<pre>[
    {
        "id": "9ad83156-5ed1-4e2f-8358-abcdef12345",
        "userId": "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a",
        "firstName": "John",
        "lastName": "Doe",
        "birthDate": "1990-01-01",
        "gender": "Male",
        "ethnicity": "Caucasian",
        "weight": 70,
        "height": 180,
        "activityLevel": "Moderate"
    }
]</pre>
</details>

## Get Patient By ID

```GET: http://localhost:3000/api/patients/get-by-id/:id``` <br>
<br>
For example<br>
```GET: http://localhost:3000/api/patients/get-by-id/9ad83156-5ed1-4e2f-8358-abcdef12345```

### Description
Gets the Patient object from the database with the same ID as in params

### Headers
Authorization: Bearer {token}
### Authorization   
User needs to be Signed in and have the same ID as the userId of the patient to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": String,
    "userId": String,
    "firstName": String,
    "lastName": String,
    "birthDate": String,
    "gender": String,
    "ethnicity": String,
    "weight": Number,
    "height": Number,
    "activityLevel": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "userId": "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a",
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-01-01",
    "gender": "Male",
    "ethnicity": "Caucasian",
    "weight": 70,
    "height": 180,
    "activityLevel": "Moderate"
}</pre>
</details>

## Update Patient
```PUT: http://localhost:3000/api/patients/update-patient/:id``` <br>
<br>
For example<br>
```PUT: http://localhost:3000/api/patients/update-patient/9ad83156-5ed1-4e2f-8358-abcdef12345```

### Description
Updates the patient object in the database that has the same id as params

### Body Data
<details>
<summary>Format</summary>
<pre>{
    "firstName": String,
    "lastName": String,
    "birthDate": String,
    "gender": String,
    "ethnicity": String,
    "weight": Number,
    "height": Number,
    "activityLevel": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "firstName": "Jane",
    "lastName": "Doe",
    "birthDate": "1990-01-01",
    "gender": "Female",
    "ethnicity": "Caucasian",
    "weight": 65,
    "height": 165,
    "activityLevel": "Low"
}</pre>
</details>

### Headers
Authorization: Bearer {token}
### Authorization
User needs to be Signed in and have the same ID as the userId of the patient to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "message": String,
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "message": "Patient updated successfully"
}</pre>
</details>

## Delete Patient
```DELETE: http://localhost:3000/api/patients/delete-patient/:id``` <br>
<br>
For example<br>
```DELETE: http://localhost:3000/api/patients/delete-patient/9ad83156-5ed1-4e2f-8358-abcdef12345```
### Description
Deletes Patient object in the database that matches the ID in params

### Headers
Authorization: Bearer {token}
### Authorization
User needs to be Signed in and have the same ID as the userId of the patient to access this endpoint

### Returns
**status**: 204


# Dietary Restriction API

## Create Dietary Restriction
```POST: http://localhost:3000/api/dietary-restrictions/create-dietary-restriction```
### Description
creates Dietary Restriction object in the database and returns the same object with a generated ID

### Body data
<details>
<summary>Format</summary>
<pre>{
    "name": String,
    "description": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "name": "Gluten Free",
    "description": "Avoid all products containing gluten"
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": String,
    "name": String,
    "description": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-54321fedcba",
    "name": "Gluten Free",
    "description": "Avoid all products containing gluten"
}</pre>
</details>

## Get All Dietary Restrictions
```GET: http://localhost:3000/api/dietary-restrictions/all-dietary-restrictions```
### Description
Gets all Dietary restrication objects from the database 

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>[
    {
        "id": String,
        "name": String,
        "description": String
    }
]</pre>
</details>

<details>
<summary>Example</summary>
<pre>[
    {
        "id": "9ad83156-5ed1-4e2f-8358-54321fedcba",
        "name": "Gluten Free",
        "description": "Avoid all products containing gluten"
    }
]</pre>
</details>

## Get Dietary Restriction By ID

```GET: http://localhost:3000/api/dietary-restrictions/get-by-id/:id``` <br>
<br>
For example<br>
```GET: http://localhost:3000/api/dietary-restrictions/get-by-id/9ad83156-5ed1-4e2f-8358-54321fedcba```
### Description
Gets a single Dietary restriction object from the database with the matching id from params

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": String,
    "name": String,
    "description": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-54321fedcba",
    "name": "Gluten Free",
    "description": "Avoid all products containing gluten"
}</pre>
</details>

## Update Dietary Restriction
```PUT: http://localhost:3000/api/dietary-restrictions/update-dietary-restriction/:id``` <br>
<br>
For example<br>
```PUT: http://localhost:3000/api/dietary-restrictions/update-dietary-restriction/9ad83156-5ed1-4e2f-8358-54321fedcba```
### Description
Updates the Dietary restriction object in the database that has the same id as in params 

### Body Data
<details>
<summary>Format</summary>
<pre>{
    "name": String,
    "description": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "name": "Vegan",
    "description": "Avoid all animal products"
}</pre>
</details>

### Headers
Authorization: Bearer {token}
### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "message": String,
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "message": "Dietary restriction updated successfully"
}</pre>
</details>

## Delete Dietary Restriction
```DELETE: http://localhost:3000/api/dietary-restrictions/delete-dietary-restriction/:id``` <br>
<br>
For example<br>
```DELETE: http://localhost:3000/api/dietary-restrictions/delete-dietary-restriction/9ad83156-5ed1-4e2f-8358-54321fedcba```
### Description
Deletes the Dietary restriction in the database that has the same ID as params

### Headers
Authorization: Bearer {token}
### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 204

## Assign Dietary Restriction to Patient
```POST: http://localhost:3000/api/dietary-restrictions/assign-to-patient```
### Description
Links a Patient Object with a Dietary restriction object in the database 

### Body data
<details>
<summary>Format</summary>
<pre>{
    "patientId": String,
    "dietaryRestrictionId": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "dietaryRestrictionId": "9ad83156-5ed1-4e2f-8358-54321fedcba"
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId of the patient to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "patientId": String,
    "dietaryRestrictionId": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "dietaryRestrictionId": "9ad83156-5ed1-4e2f-8358-54321fedcba"
}</pre>
</details>

## Remove Dietary Restriction from Patient
```DELETE: http://localhost:3000/api/dietary-restrictions/remove-from-patient```
### Description
removes the link between a Patient Object with a Dietary restriction in the database

### Body data
<details>
<summary>Format</summary>
<pre>{
    "patientId": String,
    "dietaryRestrictionId": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "dietaryRestrictionId": "9ad83156-5ed1-4e2f-8358-54321fedcba"
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId of the patient to access this endpoint

### Returns
**status**: 204

## Get All Dietary Restrictions for a Patient
```GET: http://localhost:3000/api/dietary-restrictions/patient-dietary-restrictions/:patientId``` <br>
<br>
For example<br>
```GET: http://localhost:3000/api/dietary-restrictions/patient-dietary-restrictions/9ad83156-5ed1-4e2f-8358-abcdef12345```
### Description
Gets all the Dietary Restriction objects for a Patient from the database that has the same ID as params

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId of the patient to access this endpoint'

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>[
    {
        "id": String,
        "name": String,
        "description": String
    }
]</pre>
</details>

<details>
<summary>Example</summary>
<pre>[
    {
        "id": "9ad83156-5ed1-4e2f-8358-54321fedcba",
        "name": "Gluten Free",
        "description": "Avoid all products containing gluten"
    }
]</pre>
</details>

# Medical Conditions API

## Create Medical Condition
```POST: http://localhost:3000/api/medical-conditions/create-medical-condition```
### Description
Creates a Medical condition object in the database

### Body data
<details>
<summary>Format</summary>
<pre>{
    "name": String,
    "description": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "name": "Diabetes",
    "description": "Chronic condition that affects how the body processes blood sugar"
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": String,
    "name": String,
    "description": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-44444condid",
    "name": "Diabetes",
    "description": "Chronic condition that affects how the body processes blood sugar"
}</pre>
</details>

## Get All Medical Conditions
```GET: http://localhost:3000/api/medical-conditions/all-medical-conditions```
### Description
Gets all medical condition objects from the database

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>[
    {
        "id": String,
        "name": String,
        "description": String
    }
]</pre>
</details>

<details>
<summary>Example</summary>
<pre>[
    {
        "id": "9ad83156-5ed1-4e2f-8358-44444condid",
        "name": "Diabetes",
        "description": "Chronic condition that affects how the body processes blood sugar"
    }
]</pre>
</details>

## Get Medical Condition By ID

```GET: http://localhost:3000/api/medical-conditions/get-by-id/:id```
### Description
Gets a medical condition object from the database that has the matching ID in params

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": String,
    "name": String,
    "description": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-44444condid",
    "name": "Diabetes",
    "description": "Chronic condition that affects how the body processes blood sugar"
}</pre>
</details>

## Update Medical Condition
```PUT: http://localhost:3000/api/medical-conditions/update-medical-condition/:id```
### Description
Updates the medical condition object  in the database that has the same Id as params

### Body Data
<details>
<summary>Format</summary>
<pre>{
    "name": String,
    "description": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "name": "Type 2 Diabetes",
    "description": "Metabolic disorder characterized by high blood sugar, insulin resistance"
}</pre>
</details>

### Headers
Authorization: Bearer {token}
### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "message": String,
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "message": "Medical condition updated successfully"
}</pre>
</details>

## Delete Medical Condition
```DELETE: http://localhost:3000/api/medical-conditions/delete-medical-condition/:id```
### Description
Deletes the medical condition object in the database that has the same id as params 

### Headers
Authorization: Bearer {token}
### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 204

## Assign Medical Condition to Patient
```POST: http://localhost:3000/api/medical-conditions/assign-to-patient```
### Description
Creates a link between a Medical conditon object and a patient object in the database

### Body data
<details>
<summary>Format</summary>
<pre>{
    "patientId": String,
    "medicalConditionId": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "medicalConditionId": "9ad83156-5ed1-4e2f-8358-44444condid"
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId of the patient to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "patientId": String,
    "medicalConditionId": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "medicalConditionId": "9ad83156-5ed1-4e2f-8358-44444condid"
}</pre>
</details>

## Remove Medical Condition from Patient
```DELETE: http://localhost:3000/api/medical-conditions/remove-from-patient```
### Description
Removes the link between Medical conditon object and a patient object in the database

### Body data
<details>
<summary>Format</summary>
<pre>{
    "patientId": String,
    "medicalConditionId": String
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "medicalConditionId": "9ad83156-5ed1-4e2f-8358-44444condid"
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId of the patient to access this endpoint

### Returns
**status**: 204

## Get All Medical Conditions for a Patient
```GET: http://localhost:3000/api/medical-conditions/patient-medical-conditions/:patientId``` <br>

For example <br>
```GET: http://localhost:3000/api/medical-conditions/patient-medical-conditions/9ad83156-5ed1-4e2f-8358-abcdef12345```
### Description
Gets all Medical condition objects a patient object is linked to with the same ID as params

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId of the patient to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>[
    {
        "id": String,
        "name": String,
        "description": String
    }
]</pre>
</details>

<details>
<summary>Example</summary>
<pre>[
    {
        "id": "9ad83156-5ed1-4e2f-8358-44444condid",
        "name": "Diabetes",
        "description": "Chronic condition that affects how the body processes blood sugar"
    }
]</pre>
</details>

# Search API

## Search for Food
```GET: http://localhost:3000/api/search?foodname=:foodname&userid=:userId ``` <br>
For example <br>
```GET: http://localhost:3000/api/search?foodname=apple&userid=9ad83156-5ed1-4e2f-8358-c6e2ce906f3a ```

## Description
Gets a list of foods that match or contain the given foodname from the database custom foods that the user has linked and the foodfiles API

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "foodFile":[
        {
            "id": string,
            "foodName": string,
            "shortName": string,
            "description": string,
            "serving_size": float,
            "group": string,
            "serving_size_unit": string,
            "measure_description": string
        }
    ],
    "customFood":[
        {
            "id": string,
            "userId": string,
            "foodName": string,
            "description": string,
            "serving_size": float,
            "group": string,
            "serving_size_unit": string,
            "measure_description": string
        }
    ]
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "foodFile":[
        {
            "id": "L1151",
            "foodName": "Apple, flesh & skin, raw, 'Braeburn'",
            "shortName": "Apple, 'Braeburn', flesh & skin, raw",
            "description": null,
            "serving_size": 145.0,
            "group": "Fruits",
            "serving_size_unit": "g",
            "measure_description": "1 apple"
        }
    ],
    "customFood":[
        {
            "id": "9ad83156-5ed1-4e2f-8358-111111111111",
            "userId" : "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a"
            "foodName": "Butter Chicken with rice",
            "description": "A curry made from chicken cooked in a spiced tomato and butter-based gravy served with rice",
            "serving_size": 350.0,
            "group": "Meal",
            "serving_size_unit": "g",
            "measure_description": "1 bowl"
        }
    ]
}</pre>
</details>

## Get food from foodfile
```GET: http://localhost:3000/api/search-get/foodfile/:id ``` <br>

For example <br>
```GET: http://localhost:3000/api/search-get/foodfile/L1151 ```

## Description  
Gets the matching food with the same id from the food files api

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": string,
    "foodName": string,
    "shortName": string,
    "description": string,
    "serving_size": float,
    "group": string,
    "serving_size_unit": string,
    "measure_description": string
    "energy" : {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "protein": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "totalFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "saturatedFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "carbohydrate": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sugars": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "fiber": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sodium": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    }
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "L1151",
    "foodName": "Apple, flesh & skin, raw, 'Braeburn'",
    "shortName": "Apple, 'Braeburn', flesh & skin, raw",
    "description": null,
    "serving_size": 145.0,
    "group": "Fruits",
    "serving_size_unit": "g",
    "measure_description": "1 apple",
    "energy" : {
        "unit": "KJ,
        "qty_per_serving": "270",
        "percent_RQI": "3",
        "qty_per_100": "190"
    },
    "protein": {
        "unit": "g",
        "qty_per_serving": "0.3",
        "percent_RQI": "1",
        "qty_per_100": "0.2"
    },
    "totalFat": {
        "unit": "g",
        "qty_per_serving": "0.4",
        "percent_RQI": "1",
        "qty_per_100": "0.3"
    },
    "saturatedFat": {
        "unit": "g",
        "qty_per_serving": "0.03",
        "percent_RQI": "0",
        "qty_per_100": "0.02"
    },
    "carbohydrate": {
        "unit": "g",
        "qty_per_serving": "14",
        "percent_RQI": "4",
        "qty_per_100": "9.3"
    },
    "sugars": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "14",
        "qty_per_100": "9.0"
    },
    "fiber": {
        "unit": "g",
        "qty_per_serving": "2.8",
        "percent_RQI": "9",
        "qty_per_100": "1.9"
    },
    "sodium": {
        "unit": "mg",
        "qty_per_serving": "1",
        "percent_RQI": "0",
        "qty_per_100": "1"
    }
}</pre>
</details>

## Get custom food/meal 
```GET: http://localhost:3000/api/search-get/customfood/:id ``` <br>

For example <br>
```GET: http://localhost:3000/api/search-get/customfood/9ad83156-5ed1-4e2f-8358-111111111111 ```

## Description  
Gets the matching food or meal with the same id from the custom foods table in the database

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same user id as the userId to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": string,
    "userId": string,
    "foodName": string,
    "description": string,
    "serving_size": float,
    "group": string,
    "serving_size_unit": string,
    "measure_description": string
    "energy" : {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "protein": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "totalFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "saturatedFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "carbohydrate": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sugars": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "fiber": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sodium": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    }
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-111111111111",
    "userId" : "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a"
    "foodName": "Butter Chicken with rice",
    "description": "A curry made from chicken cooked in a spiced tomato and butter-based gravy served with rice",
    "serving_size": 350.0,
    "group": "Meal",
    "serving_size_unit": "g",
    "measure_description": "1 bowl",
    "energy" : {
        "unit": "KJ,
        "qty_per_serving": "1900",
        "percent_RQI": "22",
        "qty_per_100": "750"
    },
    "protein": {
        "unit": "g",
        "qty_per_serving": "30",
        "percent_RQI": "60",
        "qty_per_100": "12"
    },
    "totalFat": {
        "unit": "g",
        "qty_per_serving": "31",
        "percent_RQI": "44",
        "qty_per_100": "12"
    },
    "saturatedFat": {
        "unit": "g",
        "qty_per_serving": "14",
        "percent_RQI": "60",
        "qty_per_100": "5.6"
    },
    "carbohydrate": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "4",
        "qty_per_100": "5.1"
    },
    "sugars": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "14",
        "qty_per_100": "5.0"
    },
    "fiber": {
        "unit": "g",
        "qty_per_serving": "5.7",
        "percent_RQI": "19",
        "qty_per_100": "2.2"
    },
    "sodium": {
        "unit": "mg",
        "qty_per_serving": "990",
        "percent_RQI": "43",
        "qty_per_100": "380"
    }
}</pre>
</details>

# Log intake

## Create Log 
``` POST: http://localhost:3000/api/log/create ```

## Description
creates a log in the database that links a patient and the food item they ate with the amount, time and meal type ( only one of "CustomFoodId" or "FCDBFoodId" should be specified)  

### Body data
<details>
<summary>Format</summary>
<pre>{
    "patientId": String,
    "FCDBFoodId": string,
    "CustomFoodId": string,
    "dateTime": string,
    "amount" : float,
    "unit" : string,
    "mealType" : string
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "FCDBFoodId": "L1151",
    "CustomFoodId": null,
    "dateTime": "2026-05-12T23:52:18.000Z",
    "amount" : 130,
    "unit" : "g",
    "mealType" : "snack"
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the user id in the patient that is linked to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": string,
    "patientId": String,
    "FCDBFoodId": string,
    "CustomFoodId": string,
    "dateTime": string,
    "amount" : float,
    "unit": string,
    "mealType": string
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-22222222222",
    "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "FCDBFoodId": "L1151",
    "CustomFoodId": null,
    "dateTime": "2026-05-12T23:52:18.000Z",
    "amount": 130,
    "unit": "g",
    "mealType": "snack"
}</pre>
</details>

## Update Log
``` PUT: http://localhost:3000/api/log/update/:id ``` <br>

For example <br>
``` PUT: http://localhost:3000/api/log/update/9ad83156-5ed1-4e2f-8358-22222222222 ```
### Description 
updates food log in the database that matches the given id

### Body data
<details>
<summary>Format</summary>
<pre>{
    "patientId": String,
    "FCDBFoodId": string,
    "CustomFoodId": string,
    "dateTime": string,
    "amount" : float,
    "unit" : string,
    "mealType" : string
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
    "FCDBFoodId": "L1101",
    "CustomFoodId": null,
    "dateTime": "2026-05-13T12:52:18.000Z",
    "amount" : 111,
    "unit" : "g",
    "mealType" : "snack"
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the user id in the patient that is alread linked in the databse to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "message": String,
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "message": "Food log updated successfully"
}</pre>
</details>

## Delete food log 
``` DELETE: http://localhost:3000/api/log/delete/:id ``` <br>

For example <br>
``` DELETE: http://localhost:3000/api/log/delete/9ad83156-5ed1-4e2f-8358-22222222222 ```

### Description 
Deletes the food log in the database that has the same id 

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the user id in the patient that is linked in the databse to access this endpoint

### Returns
**status**: 204

## Get food log by date and patient id
``` GET: http://localhost:3000/api/log/get/:id ``` <br>
For example <br>
``` GET: http://localhost:3000/api/log/get/9ad83156-5ed1-4e2f-8358-22222222222 ``` <br>
### Description 
get food logs for a given id of the log

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the user id in the patient that is linked to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>[
    {
        "id": string,
        "patientId": String,
        "FCDBFoodId": string,
        "CustomFoodId": string,
        "dateTime": string,
        "amount" : float,
        "unit": string,
        "mealType": string
    }
]</pre>
</details>

<details>
<summary>Example</summary>
<pre>[
    {
        "id": "9ad83156-5ed1-4e2f-8358-22222222222",
        "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
        "FCDBFoodId": "L1151",
        "CustomFoodId": null,
        "dateTime": "2026-05-12T23:52:18.000Z",
        "amount": 130,
        "unit": "g",
        "mealType": "snack"
    }
]</pre>
</details>

## Get food log by date and patient id
``` GET: http://localhost:3000/api/log/getbypatientanddate?date=:date&patientid=:patientId ``` <br>
For example <br>
``` GET: http://localhost:3000/api/log/getbypatientanddate?date=:2026-05-12&patientid=9ad83156-5ed1-4e2f-8358-abcdef12345 ``` <br>
### Description 
get all food logs for a given day for a patient

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the user id in the patient that is linked to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>[
    {
        "id": string,
        "patientId": String,
        "FCDBFoodId": string,
        "CustomFoodId": string,
        "dateTime": string,
        "amount" : float,
        "unit": string,
        "mealType": string
    }
]</pre>
</details>

<details>
<summary>Example</summary>
<pre>[
    {
        "id": "9ad83156-5ed1-4e2f-8358-22222222222",
        "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
        "FCDBFoodId": "L1151",
        "CustomFoodId": null,
        "dateTime": "2026-05-12T23:52:18.000Z",
        "amount": 130,
        "unit": "g",
        "mealType": "snack"
    }
]</pre>
</details>

## Get food log by patient id
``` GET: http://localhost:3000/api/log/getbypatient/:id``` <br>

For example <br>
``` GET: http://localhost:3000/api/log/getbypatient/9ad83156-5ed1-4e2f-8358-abcdef12345```

### Description 
get all food logs for a patient

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the user id in the patient that is linked to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>[
    {
        "id": string,
        "patientId": String,
        "FCDBFoodId": string,
        "CustomFoodId": string,
        "dateTime": string,
        "amount" : float,
        "unit": string,
        "mealType": string
    }
]</pre>
</details>

<details>
<summary>Example</summary>
<pre>[
    {
        "id": "9ad83156-5ed1-4e2f-8358-22222222222",
        "patientId": "9ad83156-5ed1-4e2f-8358-abcdef12345",
        "FCDBFoodId": "L1151",
        "CustomFoodId": null,
        "dateTime": "2026-05-12T23:52:18.000Z",
        "amount": 130,
        "unit": "g",
        "mealType": "snack"
    }
]</pre>
</details>

# Custom foods/meals

## create
``` POST: http://localhost:3000/api/customfood/create```

### Description
creates a custom food item or meal in the databse linked to a user

### Body data
<details>
<summary>Format</summary>
<pre>{
    "userId": string,
    "foodName": string,
    "description": string,
    "serving_size": float,
    "group": string,
    "serving_size_unit": string,
    "measure_description": string
    "energy" : {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "protein": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "totalFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "saturatedFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "carbohydrate": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sugars": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "fiber": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sodium": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    }
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "userId" : "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a"
    "foodName": "Butter Chicken with rice",
    "description": "A curry made from chicken cooked in a spiced tomato and butter-based gravy served with rice",
    "serving_size": 350.0,
    "group": "Meal",
    "serving_size_unit": "g",
    "measure_description": "1 bowl",
    "energy" : {
        "unit": "KJ,
        "qty_per_serving": "1900",
        "percent_RQI": "22",
        "qty_per_100": "750"
    },
    "protein": {
        "unit": "g",
        "qty_per_serving": "30",
        "percent_RQI": "60",
        "qty_per_100": "12"
    },
    "totalFat": {
        "unit": "g",
        "qty_per_serving": "31",
        "percent_RQI": "44",
        "qty_per_100": "12"
    },
    "saturatedFat": {
        "unit": "g",
        "qty_per_serving": "14",
        "percent_RQI": "60",
        "qty_per_100": "5.6"
    },
    "carbohydrate": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "4",
        "qty_per_100": "5.1"
    },
    "sugars": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "14",
        "qty_per_100": "5.0"
    },
    "fiber": {
        "unit": "g",
        "qty_per_serving": "5.7",
        "percent_RQI": "19",
        "qty_per_100": "2.2"
    },
    "sodium": {
        "unit": "mg",
        "qty_per_serving": "990",
        "percent_RQI": "43",
        "qty_per_100": "380"
    }
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId to access this endpoint

### Returns
**statu**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": string,
    "userId": string,
    "foodName": string,
    "description": string,
    "serving_size": float,
    "group": string,
    "serving_size_unit": string,
    "measure_description": string
    "energy" : {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "protein": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "totalFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "saturatedFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "carbohydrate": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sugars": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "fiber": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sodium": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    }
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-111111111111",
    "userId" : "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a"
    "foodName": "Butter Chicken with rice",
    "description": "A curry made from chicken cooked in a spiced tomato and butter-based gravy served with rice",
    "serving_size": 350.0,
    "group": "Meal",
    "serving_size_unit": "g",
    "measure_description": "1 bowl",
    "energy" : {
        "unit": "KJ,
        "qty_per_serving": "1900",
        "percent_RQI": "22",
        "qty_per_100": "750"
    },
    "protein": {
        "unit": "g",
        "qty_per_serving": "30",
        "percent_RQI": "60",
        "qty_per_100": "12"
    },
    "totalFat": {
        "unit": "g",
        "qty_per_serving": "31",
        "percent_RQI": "44",
        "qty_per_100": "12"
    },
    "saturatedFat": {
        "unit": "g",
        "qty_per_serving": "14",
        "percent_RQI": "60",
        "qty_per_100": "5.6"
    },
    "carbohydrate": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "4",
        "qty_per_100": "5.1"
    },
    "sugars": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "14",
        "qty_per_100": "5.0"
    },
    "fiber": {
        "unit": "g",
        "qty_per_serving": "5.7",
        "percent_RQI": "19",
        "qty_per_100": "2.2"
    },
    "sodium": {
        "unit": "mg",
        "qty_per_serving": "990",
        "percent_RQI": "43",
        "qty_per_100": "380"
    }
}</pre>
</details>

## update 
``` PUT: http://localhost:3000/api/customfood/update/:id``` <br>
For example <br>
``` PUT: http://localhost:3000/api/customfood/update/9ad83156-5ed1-4e2f-8358-111111111111```

### Description
updates the custome food item that has the same id

### Body data
<details>
<summary>Format</summary>
<pre>{
    "userId": string,
    "foodName": string,
    "description": string,
    "serving_size": float,
    "group": string,
    "serving_size_unit": string,
    "measure_description": string
    "energy" : {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "protein": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "totalFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "saturatedFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "carbohydrate": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sugars": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "fiber": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sodium": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    }
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "userId" : "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a"
    "foodName": "Butter Chicken without rice",
    "description": "A curry made from chicken cooked in a spiced tomato and butter-based gravy served with rice",
    "serving_size": 350.0,
    "group": "Meal",
    "serving_size_unit": "g",
    "measure_description": "1 bowl",
    "energy" : {
        "unit": "KJ,
        "qty_per_serving": "1900",
        "percent_RQI": "22",
        "qty_per_100": "750"
    },
    "protein": {
        "unit": "g",
        "qty_per_serving": "30",
        "percent_RQI": "60",
        "qty_per_100": "12"
    },
    "totalFat": {
        "unit": "g",
        "qty_per_serving": "31",
        "percent_RQI": "44",
        "qty_per_100": "12"
    },
    "saturatedFat": {
        "unit": "g",
        "qty_per_serving": "14",
        "percent_RQI": "60",
        "qty_per_100": "5.6"
    },
    "carbohydrate": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "4",
        "qty_per_100": "5.1"
    },
    "sugars": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "14",
        "qty_per_100": "5.0"
    },
    "fiber": {
        "unit": "g",
        "qty_per_serving": "5.7",
        "percent_RQI": "19",
        "qty_per_100": "2.2"
    },
    "sodium": {
        "unit": "mg",
        "qty_per_serving": "990",
        "percent_RQI": "43",
        "qty_per_100": "380"
    }
}</pre>
</details>

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "message": String,
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "message": "Custom food item updated successfully"
}</pre>
</details>

## delete
``` DELETE: http://localhost:3000/api/customfood/delete/{id}``` <br>
For example <br>
``` DELETE: http://localhost:3000/api/customfood/delete/9ad83156-5ed1-4e2f-8358-111111111111```
### Description
deletes food item with the same id 

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID as the userId to access this endpoint

### Returns
**status**: 204

## Get custom food/meal 
```GET: http://localhost:3000/api/customfood/get/:id ``` <br>

For example <br>
```GET: http://localhost:3000/api/customfood/get/9ad83156-5ed1-4e2f-8358-111111111111 ```

## Description  
Gets the matching food or meal with the same id from the custom foods table in the database

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same user id as the userId to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>{
    "id": string,
    "userId": string,
    "foodName": string,
    "description": string,
    "serving_size": float,
    "group": string,
    "serving_size_unit": string,
    "measure_description": string
    "energy" : {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "protein": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "totalFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "saturatedFat": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "carbohydrate": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sugars": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "fiber": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    },
    "sodium": {
        "unit": string,
        "qty_per_serving": string,
        "percent_RQI": string,
        "qty_per_100": string
    }
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "id": "9ad83156-5ed1-4e2f-8358-111111111111",
    "userId" : "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a"
    "foodName": "Butter Chicken with rice",
    "description": "A curry made from chicken cooked in a spiced tomato and butter-based gravy served with rice",
    "serving_size": 350.0,
    "group": "Meal",
    "serving_size_unit": "g",
    "measure_description": "1 bowl",
    "energy" : {
        "unit": "KJ,
        "qty_per_serving": "1900",
        "percent_RQI": "22",
        "qty_per_100": "750"
    },
    "protein": {
        "unit": "g",
        "qty_per_serving": "30",
        "percent_RQI": "60",
        "qty_per_100": "12"
    },
    "totalFat": {
        "unit": "g",
        "qty_per_serving": "31",
        "percent_RQI": "44",
        "qty_per_100": "12"
    },
    "saturatedFat": {
        "unit": "g",
        "qty_per_serving": "14",
        "percent_RQI": "60",
        "qty_per_100": "5.6"
    },
    "carbohydrate": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "4",
        "qty_per_100": "5.1"
    },
    "sugars": {
        "unit": "g",
        "qty_per_serving": "13",
        "percent_RQI": "14",
        "qty_per_100": "5.0"
    },
    "fiber": {
        "unit": "g",
        "qty_per_serving": "5.7",
        "percent_RQI": "19",
        "qty_per_100": "2.2"
    },
    "sodium": {
        "unit": "mg",
        "qty_per_serving": "990",
        "percent_RQI": "43",
        "qty_per_100": "380"
    }
}</pre>
</details>

## Get custom food/meal for a user by id
```GET: http://localhost:3000/api/customfood/getbyuserid/:id ``` <br>

For example <br>
```GET: http://localhost:3000/api/customfood/get/9ad83156-5ed1-4e2f-8358-c6e2ce906f3a ```

## Description  
Gets all the matching custom food items that have the same user id linked

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same user id as the userId to access this endpoint

### Returns
**status**: 200
<details>
<summary>Format</summary>
<pre>[
    {
        "id": string,
        "userId": string,
        "foodName": string,
        "description": string,
        "serving_size": float,
        "group": string,
        "serving_size_unit": string,
        "measure_description": string
        "energy" : {
            "unit": string,
            "qty_per_serving": string,
            "percent_RQI": string,
            "qty_per_100": string
        },
        "protein": {
            "unit": string,
            "qty_per_serving": string,
            "percent_RQI": string,
            "qty_per_100": string
        },
        "totalFat": {
            "unit": string,
            "qty_per_serving": string,
            "percent_RQI": string,
            "qty_per_100": string
        },
        "saturatedFat": {
            "unit": string,
            "qty_per_serving": string,
            "percent_RQI": string,
            "qty_per_100": string
        },
        "carbohydrate": {
            "unit": string,
            "qty_per_serving": string,
            "percent_RQI": string,
            "qty_per_100": string
        },
        "sugars": {
            "unit": string,
            "qty_per_serving": string,
            "percent_RQI": string,
            "qty_per_100": string
        },
        "fiber": {
            "unit": string,
            "qty_per_serving": string,
            "percent_RQI": string,
            "qty_per_100": string
        },
        "sodium": {
            "unit": string,
            "qty_per_serving": string,
            "percent_RQI": string,
            "qty_per_100": string
        }
    }
]</pre>
</details>

<details>
<summary>Example</summary>
<pre>[
        {
        "id": "9ad83156-5ed1-4e2f-8358-111111111111",
        "userId" : "9ad83156-5ed1-4e2f-8358-c6e2ce906f3a"
        "foodName": "Butter Chicken with rice",
        "description": "A curry made from chicken cooked in a spiced tomato and butter-based gravy served with rice",
        "serving_size": 350.0,
        "group": "Meal",
        "serving_size_unit": "g",
        "measure_description": "1 bowl",
        "energy" : {
            "unit": "KJ,
            "qty_per_serving": "1900",
            "percent_RQI": "22",
            "qty_per_100": "750"
        },
        "protein": {
            "unit": "g",
            "qty_per_serving": "30",
            "percent_RQI": "60",
            "qty_per_100": "12"
        },
        "totalFat": {
            "unit": "g",
            "qty_per_serving": "31",
            "percent_RQI": "44",
            "qty_per_100": "12"
        },
        "saturatedFat": {
            "unit": "g",
            "qty_per_serving": "14",
            "percent_RQI": "60",
            "qty_per_100": "5.6"
        },
        "carbohydrate": {
            "unit": "g",
            "qty_per_serving": "13",
            "percent_RQI": "4",
            "qty_per_100": "5.1"
        },
        "sugars": {
            "unit": "g",
            "qty_per_serving": "13",
            "percent_RQI": "14",
            "qty_per_100": "5.0"
        },
        "fiber": {
            "unit": "g",
            "qty_per_serving": "5.7",
            "percent_RQI": "19",
            "qty_per_100": "2.2"
        },
        "sodium": {
            "unit": "mg",
            "qty_per_serving": "990",
            "percent_RQI": "43",
            "qty_per_100": "380"
        }
    }
]</pre>
</details>

