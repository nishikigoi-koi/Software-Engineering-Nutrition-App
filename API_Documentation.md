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

### Headers
Authorization: Bearer {token}

### Authorization
User needs to be Signed in and have the same ID to access this endpoint

### Returns
**status**: 204

# Patient API

## Create Patient
```POST: http://localhost:3000/api/patients/create-patient```

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
    "activity level": String
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
    "activity level": "Moderate"
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
    "activity level": String
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
    "activity level": "Moderate"
}</pre>
</details>

## Get All Patients For a User
```GET: http://localhost:3000/api/patients/all-patients/:userId``` <br>
<br>
For example<br>
```GET: http://localhost:3000/api/patients/all-patients/9ad83156-5ed1-4e2f-8358-c6e2ce906f3a```

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
        "activity level": String
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
        "activity level": "Moderate"
    }
]</pre>
</details>

## Get Patient By ID

```GET: http://localhost:3000/api/patients/get-by-id/:id``` <br>
<br>
For example<br>
```GET: http://localhost:3000/api/patients/get-by-id/9ad83156-5ed1-4e2f-8358-abcdef12345```

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
    "activity level": String
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
    "activity level": "Moderate"
}</pre>
</details>

## Update Patient
```PUT: http://localhost:3000/api/patients/update-patient/:id``` <br>
<br>
For example<br>
```PUT: http://localhost:3000/api/patients/update-patient/9ad83156-5ed1-4e2f-8358-abcdef12345```
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
    "activity level": String
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
    "activity level": "Low"
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

### Headers
Authorization: Bearer {token}
### Authorization
User needs to be Signed in and have the same ID as the userId of the patient to access this endpoint

### Returns
**status**: 204


# Dietary Restriction API

## Create Dietary Restriction
```POST: http://localhost:3000/api/dietary-restrictions/create-dietary-restriction```

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

### Headers
Authorization: Bearer {token}
### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 204

## Assign Dietary Restriction to Patient
```POST: http://localhost:3000/api/dietary-restrictions/assign-to-patient```
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
    "message": String,
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "message": "Dietary restriction assigned to patient successfully"
}</pre>
</details>

## Remove Dietary Restriction from Patient
```DELETE: http://localhost:3000/api/dietary-restrictions/remove-from-patient```
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

### Headers
Authorization: Bearer {token}
### Authorization
User needs to be Signed in to access this endpoint

### Returns
**status**: 204

## Assign Medical Condition to Patient
```POST: http://localhost:3000/api/medical-conditions/assign-to-patient```
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
    "message": String,
}</pre>
</details>

<details>
<summary>Example</summary>
<pre>{
    "message": "Medical condition assigned to patient successfully"
}</pre>
</details>

## Remove Medical Condition from Patient
```DELETE: http://localhost:3000/api/medical-conditions/remove-from-patient```
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
```GET: http://localhost:3000/api/medical-conditions/patient-medical-conditions/:patientId```

For example
```GET: http://localhost:3000/api/medical-conditions/patient-medical-conditions/9ad83156-5ed1-4e2f-8358-abcdef12345```

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
