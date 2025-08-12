# Backend (Node + Express)

## Endpoints
- GET `/api/weather?city={cityName}`: Returns current weather for the given city. Secured with Auth0 and requires scope `read:weather`.
- GET `/health`: Basic health check.

## Environment Variables (.env)
```
PORT=5000
AUTH0_DOMAIN=your-tenant.region.auth0.com
AUTH0_AUDIENCE=your-api-identifier
WEATHER_API_KEY=your_openweathermap_api_key
```

Notes:
- `WEATHER_API_KEY` uses OpenWeatherMap.
- CORS allows `http://localhost:3000` by default.

## Install & Run
```
npm install
npm run dev   # nodemon server.js
# or
npm start     # node server.js
```

## AuthZ Details
- JWTs are verified using Auth0 JWKS and RS256.
- Access is restricted by scope/permission: request must include `read:weather` (via `scope` or `permissions` claim when RBAC is enabled).
