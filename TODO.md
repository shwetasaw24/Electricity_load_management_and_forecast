# TODO: Solve Axios Network Error and Add Admin Auth

## 1. Fix Axios Network Error
- [ ] Check backend server configuration and ensure it's running on the correct port (likely 8000)
- [ ] Verify frontend API base URL in frontend/src/api/api.js
- [ ] Test API connectivity from frontend to backend
- [ ] Fix any CORS issues if present

## 2. Add Admin Authentication Backend
- [ ] Add auth dependencies to backend/requirements.txt (e.g., python-jose, passlib)
- [ ] Create auth schemas in backend/app/schemas.py (LoginRequest, TokenResponse)
- [ ] Implement auth service in backend/app/services/auth_service.py (hash password, verify password, create token)
- [ ] Add auth controller in backend/app/controllers/auth_controller.py (login endpoint)
- [ ] Add auth middleware in backend/app/main.py to protect admin routes
- [ ] Update User model if needed for auth

## 3. Add Admin Authentication Frontend
- [ ] Update frontend/src/auth/authContext.jsx to handle JWT tokens
- [ ] Create login component in frontend/src/pages/Login.jsx
- [ ] Update App.jsx to include login route and protect admin routes
- [ ] Update API calls to include auth headers
- [ ] Add logout functionality

## 4. Test and Verify
- [ ] Test login functionality
- [ ] Verify admin routes are protected
- [ ] Ensure axios calls work with auth
- [ ] Test overall application flow
