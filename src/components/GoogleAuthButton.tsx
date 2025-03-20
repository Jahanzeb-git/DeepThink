// GoogleAuthButton.tsx
import React, { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

interface GoogleAuthButtonProps {
  onSuccess: (credentialResponse: any) => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onSuccess }) => {
  const clientId = "1061742468081-1g389n9i177f9vk95eg88tsornpfsbm4.apps.googleusercontent.com"; // Replace with your actual client ID

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => console.log("Google Login Failed")}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthButton;
