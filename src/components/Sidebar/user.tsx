import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogIn, UserPlus } from 'lucide-react';

const User = () => {
    const [authState, setAuthState] = useState<'new' | 'registered' | 'authenticated'>('new');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            const sToken = localStorage.getItem('Stoken');

            if (token && sToken) {
                setAuthState('authenticated');
            } else if (sToken) {
                setAuthState('registered');
            } else {
                setAuthState('new');
            }
        };

        checkAuthStatus();
        // Listen for storage changes
        window.addEventListener('storage', checkAuthStatus);
        return () => window.removeEventListener('storage', checkAuthStatus);
    }, []);

    const handleSignup = () => {
        navigate('/signup');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleProfile = () => {
        // This can be implemented later for profile functionality
        console.log('Profile clicked');
    };

    const getButton = () => {
        switch (authState) {
            case 'new':
                return (
                    <button
                        onClick={handleSignup}
                        className="group relative w-full px-6 py-3 rounded-lg text-white font-medium
                                 overflow-hidden transition-all duration-300
                                 bg-gradient-to-br from-blue-600/20 to-cyan-600/20
                                 hover:from-blue-600/30 hover:to-cyan-600/30
                                 border border-blue-500/50 hover:border-cyan-400"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-full h-full absolute bg-gradient-to-r from-blue-600/10 to-cyan-600/10 
                                        backdrop-blur-sm" />
                        </div>
                        <span className="relative flex items-center justify-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Sign Up
                        </span>
                        <div className="absolute inset-0 border border-cyan-400/50 rounded-lg opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300 scale-105" />
                    </button>
                );
            case 'registered':
                return (
                    <button
                        onClick={handleLogin}
                        className="group relative w-full px-6 py-3 rounded-lg text-white font-medium
                                 overflow-hidden transition-all duration-300
                                 bg-gradient-to-br from-indigo-600/20 to-purple-600/20
                                 hover:from-indigo-600/30 hover:to-purple-600/30
                                 border border-indigo-500/50 hover:border-purple-400"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-full h-full absolute bg-gradient-to-r from-indigo-600/10 to-purple-600/10 
                                        backdrop-blur-sm" />
                        </div>
                        <span className="relative flex items-center justify-center gap-2">
                            <LogIn className="w-5 h-5" />
                            Login
                        </span>
                        <div className="absolute inset-0 border border-purple-400/50 rounded-lg opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300 scale-105" />
                    </button>
                );
            case 'authenticated':
                return (
                    <button
                        onClick={handleProfile}
                        className="group relative w-full px-6 py-3 rounded-lg text-white font-medium
                                 overflow-hidden transition-all duration-300
                                 bg-gradient-to-br from-emerald-600/20 to-teal-600/20
                                 hover:from-emerald-600/30 hover:to-teal-600/30
                                 border border-emerald-500/50 hover:border-teal-400"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-full h-full absolute bg-gradient-to-r from-emerald-600/10 to-teal-600/10 
                                        backdrop-blur-sm" />
                        </div>
                        <span className="relative flex items-center justify-center gap-2">
                            <UserCircle className="w-5 h-5" />
                            My Profile
                        </span>
                        <div className="absolute inset-0 border border-teal-400/50 rounded-lg opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300 scale-105" />
                    </button>
                );
        }
    };

    return (
        <div className="w-full">
            {getButton()}
        </div>
    );
};

export default User;
