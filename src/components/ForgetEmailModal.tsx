// ForgetEmailModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ForgetEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Optionally, you can pass an onSubmit function; here we call the endpoint directly.
}

const ForgetEmailModal: React.FC<ForgetEmailModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link.');
      }
      setStatus('success');
      // Automatically close the modal after 3 seconds
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setEmail('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
      setStatus('error');
    }
  };

  // Animation variants for the backdrop and modal content
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 max-w-md mx-auto"
            variants={modalVariants}
          >
            <button
              onClick={() => {
                setStatus('idle');
                setEmail('');
                onClose();
              }}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            {status !== 'success' ? (
              <>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Forgot Password
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  Enter your email address below and we will send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                  {status === 'error' && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all duration-200"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Verification Email Sent!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  Please check your inbox for a reset link.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgetEmailModal;
