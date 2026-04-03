# Phase 2 Testing Guide

## Prerequisites
- Phase 1 completed (database setup)
- Neon database connected
- Environment variables configured

## Start the Development Server

```bash
cd vibekit-studio
npx netlify dev
```

Wait for the server to start on `http://localhost:8888`

## Run Automated Tests

```bash
node test-api.js
```

## Manual Testing with cURL

### 1. Signup
```bash
curl -X POST http://localhost:8888/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### 2. Login
```bash
curl -X POST http://localhost:8888/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### 3. Get Current User
```bash
curl http://localhost:8888/api/me \
  -b cookies.txt
```

### 4. Create Page
```bash
curl -X POST http://localhost:8888/api/pages \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"My Page","slug":"my-page","theme":"minimal","content":{}}'
```

### 5. List Pages
```bash
curl http://localhost:8888/api/pages \
  -b cookies.txt
```

### 6. Get Page by Slug
```bash
curl http://localhost:8888/api/pages/my-page \
  -b cookies.txt
```

### 7. Update Page
```bash
curl -X PUT http://localhost:8888/api/pages/PAGE_ID \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Updated Page","slug":"my-page","status":"published","content":{}}'
```

### 8. Submit Contact Form
```bash
curl -X POST http://localhost:8888/api/contact \
  -H "Content-Type: application/json" \
  -d '{"pageId":"PAGE_ID","name":"John Doe","email":"john@example.com","message":"Hello!"}'
```

### 9. Delete Page
```bash
curl -X DELETE http://localhost:8888/api/pages/PAGE_ID \
  -b cookies.txt
```

### 10. Logout
```bash
curl -X POST http://localhost:8888/api/logout \
  -b cookies.txt
```

## Expected Results

All endpoints should return appropriate status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 405: Method Not Allowed
- 500: Internal Server Error

## Phase 2 Complete ✅

All backend Netlify Functions are implemented and ready for testing.
