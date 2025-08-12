import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import authConfig from './auth_config.json';

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN || authConfig.domain;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || authConfig.clientId;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE || authConfig.audience;
  const redirectUri = window.location.origin;

  if (!domain || !clientId || !audience) {
    console.error('Auth0 configuration missing: domain, clientId, or audience is undefined');
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        
        audience: audience,
        scope: 'openid profile email read:weather'
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage" // Use localstorage for refresh token persistence
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
