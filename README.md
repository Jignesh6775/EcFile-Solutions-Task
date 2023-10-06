# EcFile-Solutions-Task

## Backend API Documentation

This documentation provides an overview of the backend API routes for user registration, authentication, and management.

## Routes

### User Signup with OTP
- **Endpoint**: `/signup`
- **Method**: POST
- **Description**: Allows users to register by providing their name, email, phone number, profile image, password, and role. An OTP (One-Time Password) is generated and sent to the user's email and phone number for verification.
- **Validation Criteria**:
  - Email must be valid.
  - Phone number must be 10 digits long and start with 6, 7, 8, or 9.
- **Request Body**:
  - Name (String): User's name.
  - Email (String): User's email address.
  - PhoneNumber (String): User's phone number.
  - Image (File): User's profile image.
  - Password (String): User's password.
  - Role (String): User's role.
- **Response**:
  - 200 OK: User created successfully. Check email and SMS for OTP verification.
  - 400 Bad Request: Invalid email address or mobile number.
  - 500 Internal Server Error: Failed to send OTP.

### User Signin
- **Endpoint**: `/signin`
- **Method**: POST
- **Description**: Allows users to log in by providing their phone number and password. If the provided credentials are valid, a JWT (JSON Web Token) is generated for authentication.
- **Validation Criteria**:
  - Phone number must be 10 digits long and start with 6, 7, 8, or 9.
- **Request Body**:
  - PhoneNumber (String): User's phone number.
  - Password (String): User's password.
- **Response**:
  - 200 OK: Login successful. Returns a JWT for authentication.
  - 400 Bad Request: Invalid phone number or password.

### Get All Users (Admin Only)
- **Endpoint**: `/`
- **Method**: GET
- **Description**: Allows admins to retrieve a list of all users in the system. Requires an authorization token with the 'admin' role.
- **Authorization**: Requires an authorization token with the 'admin' role.
- **Response**:
  - 200 OK: Returns a list of all users.
  - 400 Bad Request: Authorization token missing.
  - 401 Unauthorized: Unauthorized access.

### Delete User (Admin Only)
- **Endpoint**: `/delete/:id`
- **Method**: DELETE
- **Description**: Allows admins to delete a user by their ID. Requires an authorization token with the 'admin' role.
- **Authorization**: Requires an authorization token with the 'admin' role.
- **Parameters**:
  - id (String): User's ID to delete.
- **Response**:
  - 200 OK: User deleted successfully.
  - 400 Bad Request: Authorization token missing.
  - 401 Unauthorized: Unauthorized access.

### OTP Verification
- **Endpoint**: `/otp-verify`
- **Method**: POST
- **Description**: Allows users to verify their OTP (One-Time Password) sent via email and SMS during signup. The email and SMS OTPs must match for successful verification.
- **Request Body**:
  - Email (String): User's email address.
  - OTP (String): OTP provided by the user.
  - PhoneNumber (String): User's phone number.
- **Response**:
  - 200 OK: OTP verification successful. User can now sign in.
  - 400 Bad Request: Invalid OTP or phone number.

## Note

**Email Verification Issue:** Due to an issue with Google's email services, email verification may not work as expected. We apologize for the inconvenience and are actively working to resolve this issue. In the meantime, please use mobile OTP verification for account verification.

For any further assistance or inquiries, please contact our support team.
