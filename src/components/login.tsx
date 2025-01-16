import React, { useState } from 'react';
import { MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }
    setLoading(true);
    setError('');
    
    // Simulate minimum loading time of 4 seconds
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
        loadingPromise // Ensure minimum 4 second loading time
      ]);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Handle successful login (e.g., store token, redirect)
      console.log('Login successful:', data);
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center">
          <div className="flex justify-center">
            <MessageCircle className="h-12 w-12 text-blue-600 animate-pulse" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Deepthinks</h2>
          <p className="mt-2 text-gray-600">Welcome back to intelligent conversations</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center">
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
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed relative transition-all duration-300"
          >
            {loading ? (
              <>
                <span className="opacity-0">Login</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span className="animate-pulse">Logging in</span>
                  </div>
                </div>
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="flex items-center justify-between text-sm">
            <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Forgot password?
            </a>
            <a href="/contact" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Contact us
            </a>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
