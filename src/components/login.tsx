import React, { useState } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GoogleAuthButton from './GoogleAuthButton';
import ForgetEmailModal from './ForgetEmailModal'; // Import your modal component

interface LoginResponse {
  access_token: string;
  token_type: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // State for controlling the Forgot Password modal
  const [isForgetModalOpen, setIsForgetModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }
    setLoading(true);
    setError('');
    
    const loadingPromise = new Promise(resolve => setTimeout(resolve, 4000));

    try {
      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const [data] = await Promise.all([
        response.json(),
        loadingPromise
      ]) as [LoginResponse, void];

      if (!response.ok) {
        throw new Error((data as any).message || 'Login failed');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      
      const storedEmail = localStorage.getItem('userEmail');
      if (!storedEmail || storedEmail !== formData.email) {
        localStorage.setItem('userEmail', formData.email);
      }
      
      navigate('/chat');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (credentialResponse: any) => {
    setLoading(true);
    setError('');

    try {
      const googleToken = credentialResponse.credential;
      const res = await fetch('https://jahanzebahmed25.pythonanywhere.com/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('userEmail', data.user.email);
      navigate('/chat');
    } catch (err: any) {
      setError(err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the forgot password submission in the modal
  const handleForgetPasswordSubmit = async (email: string) => {
    try {
      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }
      // On success, the modal component will handle auto-closing
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Animated Welcome */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-black opacity-80"></div>
        <div className="relative z-10 text-center px-8">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6"
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-gray-300 text-xl max-w-md mx-auto"
          >
            Continue your journey of meaningful conversations powered by AI
          </motion.p>
          
          {/* Animated Circles Background */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-overlay"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0.1, 0.3],
                x: [0, 100, 0],
                y: [0, -100, 0],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: `${200 + i * 100}px`,
                height: `${200 + i * 100}px`,
                background: `linear-gradient(45deg, ${['#4F46E5', '#7C3AED', '#EC4899'][i]}, transparent)`,
                left: `${i * 20}%`,
                top: `${30 + i * 20}%`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
      >
        <div className="w-full max-w-md space-y-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="flex justify-center">
              <MessageCircle className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Continue your journey with Deepthinks</p>
          </motion.div>

          {/* Google OAuth Button */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <GoogleAuthButton onSuccess={handleGoogleResponse} />
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01 }} 
                className="flex items-center"
              >
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </motion.div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span className="animate-pulse">Logging in</span>
                </div>
              ) : (
                'Login'
              )}
            </motion.button>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between text-sm"
            >
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgetModalOpen(true);
                }}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Forgot password?
              </a>
              <a href="/contact" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Contact us
              </a>
            </motion.div>
          </motion.form>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-gray-600"
          >
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Sign up
            </a>
          </motion.p>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgetEmailModal
        isOpen={isForgetModalOpen}
        onClose={() => setIsForgetModalOpen(false)}
        onSubmit={handleForgetPasswordSubmit}
      />
    </div>
  );
};

export default LoginPage;


