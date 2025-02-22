# /auth/register Endpoint Documentation

The `/auth/register` endpoint allows new users to register by providing required user information. It creates a new user in the system and returns an authentication token on successful registration.

## Endpoint Details

- **Method:** POST
- **URL:** `/auth/register`

## Request Body

The endpoint expects a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "string (min 3 characters)",
    "lastname": "string (optional, min 3 characters)"
  },
  "date_of_birth": "string (valid date in ISO 8601 format)",
  "email": "string (valid email address)",
  "password": "string (min 6 characters)"
}


### Response Body
The endpoint returns a JSON object with the following structure:

Success (201 Created)
Status Code: 201
Content: JSON object containing the created user (excluding password) and an authentication token.

{
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "date_of_birth": "YYYY-MM-DDT00:00:00.000Z",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}

Client Error <vscode_annotation details='%5B%7B%22title%22%3A%22hardcoded-credentials%22%2C%22description%22%3A%22Embedding%20credentials%20in%20source%20code%20risks%20unauthorized%20access%22%7D%5D'> Bad</vscode_annotation>(400 Request)
Status Code: 400
Content: JSON object containing validation error details if the request data fails to meet criteria.

{
  "errors": [
    { "msg": "Invalid email", "param": "email", "location": "body" },
    { "msg": "First name must be at least 3 characters", "param": "fullname.firstname", "location": "body" }
  ]
}

Server Error (500 Internal Server Error)
Status Code: 500
Content: Error message when an unexpected error occurs.
Validation Rules
fullname.firstname: Required, minimum 3 characters.
fullname.lastname: Optional, minimum 3 characters if provided.
date_of_birth: Required, valid date in ISO 8601 format.
email: Required, must be a valid email address.
password: Required, minimum 6 characters.
