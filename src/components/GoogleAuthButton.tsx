import React from "react";
import { GoogleLogin } from "@react-oauth/google";

interface GoogleAuthButtonProps {
  onSuccess: (credentialResponse: any) => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onSuccess }) => {
  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => console.log("Google Login Failed")}
        size="large" // Ensures button is large
        theme="outline" // Can be 'filled_blue', 'filled_black', etc.
      />
    </div>
  );
};

export default GoogleAuthButton;

