require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();

// Config
const PORT = process.env.PORT || 5000;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

// Basic validation for required env vars (log only; README covers setup)
if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
  console.warn('Auth0 environment variables are not fully configured. Check AUTH0_DOMAIN and AUTH0_AUDIENCE.');
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json());

// JWT middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Scope/permission check for read:weather
function requireReadWeather(req, res, next) {
  const authPayload = req.auth || req.user || {};
  const permissions = Array.isArray(authPayload.permissions) ? authPayload.permissions : [];
  const scope = typeof authPayload.scope === 'string' ? authPayload.scope : '';
  const hasPermission = permissions.includes('read:weather') || scope.split(' ').includes('read:weather');
  if (!hasPermission) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Missing permission: read:weather'
    });
  }
  return next();
}

// Routes
const weatherRouter = require('./routes/weather');
app.use('/api', checkJwt, requireReadWeather, weatherRouter);

// Health endpoints
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// JWT error handler
app.use((err, _req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Authentication failed', message: 'Invalid or missing token' });
  }
  next(err);
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});


