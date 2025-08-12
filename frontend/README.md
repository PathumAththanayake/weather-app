# Frontend Setup

## Requirements
- Node.js
- npm

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure Auth0:
   - Create a Single Page Application in Auth0.
   - Set Allowed Callback URLs to: `http://localhost:3000`
   - Set Allowed Logout URLs to: `http://localhost:3000`
   - Set Allowed Web Origins to: `http://localhost:3000`
   - Enable MFA (email verification).
   - Disable public signups; only pre-registered users can log in.
   - Create a test user: username/pw
3. Set your Auth0 values in `src/auth_config.json`:
   ```json
   {
     "domain": "YOUR_AUTH0_DOMAIN",
     "clientId": "YOUR_AUTH0_CLIENT_ID",
     "audience": "YOUR_AUTH0_API_IDENTIFIER"
   }
   ```
4. Start the frontend:
   ```bash
   npm start
   ```

The app will require login to view weather data.
