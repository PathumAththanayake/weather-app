# Weather App (Auth0-secured, Full Stack)

## Overview
- Backend: Node.js + Express
- Frontend: React (CRA)
- Auth: Auth0 (SPA + API scopes)
- Weather API: OpenWeatherMap

## Quick Start
1. Backend
   - Copy `backend/.env.example` to `backend/.env` and fill values.
   - Install and run: `cd backend && npm install && npm run dev`.
2. Frontend
   - Copy `frontend/.env.example` to `frontend/.env` and fill values.
   - Install and run: `cd frontend && npm install && npm start`.

## Auth0 Configuration
1. Create an Auth0 API (e.g., identifier `https://weather-api`).
   - Add scope `read:weather`.
   - Enable RBAC and "Add Permissions in the Access Token".
2. Create an Auth0 Application (SPA) for the frontend.
   - Allowed Callback URLs: `http://localhost:3000`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
3. Authorize the SPA to call the API and grant `read:weather`.
4. Set environment variables:
   - Backend `.env`: `AUTH0_DOMAIN`, `AUTH0_AUDIENCE` (your API identifier), `WEATHER_API_KEY`.
   - Frontend `.env`: `REACT_APP_AUTH0_DOMAIN`, `REACT_APP_AUTH0_CLIENT_ID`, `REACT_APP_AUTH0_AUDIENCE`, `REACT_APP_API_BASE_URL`.

## API
- GET `/api/weather?city={cityName}`
  - Requires a Bearer token with `read:weather` scope.
  - Returns normalized weather info for the city.

## Security Notes
- JWT validated via Auth0 JWKS and RS256 on the backend.
- Frontend uses in-memory token storage by default.
- CORS is limited to `http://localhost:3000` for local dev.


