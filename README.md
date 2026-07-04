# internix-api

Node.js + Express backend for Internix candidate registration, dashboard profile data, placement fee status, and offer letter access control.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set the required `.env` values:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/internix
JWT_SECRET=replace-this-secret
CLIENT_URL=http://localhost:3000
ADMIN_SECRET=replace-this-admin-secret
PLACEMENT_FEE_AMOUNT=0
PAYMENT_CURRENCY=INR
```

## Routes

- `POST /api/candidates/register`
- `POST /api/candidates/login`
- `GET /api/candidates/me`
- `GET /api/payments/placement-fee`
- `POST /api/payments/mark-verifying`
- `POST /api/payments/mark-verified`
- `GET /api/offer-letter`
- `GET /api/health`

Protected candidate routes use:

```http
Authorization: Bearer <token>
```

The temporary admin verification route uses:

```http
x-admin-secret: <ADMIN_SECRET>
```

## Candidate Registration

```http
POST /api/candidates/register
```

```json
{
  "fullName": "Candidate Name",
  "email": "candidate@example.com",
  "phone": "+91 98765 43210",
  "password": "securepass123",
  "confirmPassword": "securepass123",
  "gender": "Male",
  "coordinator": "Coordinator Name",
  "companyHiredIn": "Company Name"
}
```

Passwords are hashed before storage. `confirmPassword` is validated but not stored.

## Candidate Login

Candidates can log in with the email and password used during registration.

```http
POST /api/candidates/login
```

```json
{
  "email": "candidate@example.com",
  "password": "securepass123"
}
```

Successful login returns a fresh JWT token and candidate profile:

```json
{
  "success": true,
  "message": "Candidate logged in successfully",
  "token": "jwt-token",
  "candidate": {
    "_id": "...",
    "fullName": "...",
    "email": "...",
    "phone": "...",
    "gender": "...",
    "coordinator": "...",
    "companyHiredIn": "...",
    "paymentStatus": "pending",
    "offerLetterUrl": null
  }
}
```
