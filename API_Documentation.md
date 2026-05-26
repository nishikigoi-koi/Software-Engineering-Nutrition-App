# API Documentation

in these examples .env looks like this

```
PORT = 3000 
HOST = localhost
```


# User API

## Get All Users

```GET: http://localhost:3000/api/users/all-users```

#### Returns
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

#### Returns
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

## Create User
```POST: http://localhost:3000/api/users/create-user```
#### Body data
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

#### Returns
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
    "username": "newuser"
}</pre>
</details>

## Update User
```PUT: http://localhost:3000/api/users/update-user/:id``` <br>
<br>
For example<br>
```PUT: http://localhost:3000/api/users/update-user/9ad83156-5ed1-4e2f-8358-c6e2ce906f3a```
#### Body data
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

#### Returns
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
#### Returns
**status**: 204


## Check User Password
```POST: http://localhost:3000/api/users/check-password```
#### Body data
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

#### Returns
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
    "username": "newuser"
}</pre>
</details>
