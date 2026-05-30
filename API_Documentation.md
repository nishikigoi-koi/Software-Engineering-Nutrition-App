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



