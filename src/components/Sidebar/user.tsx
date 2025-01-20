import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UserCircle, LogIn, UserPlus, Settings, Globe, 
    Moon, Sun, User as UserIcon, Shield, Trash2, X 
} from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

interface TabProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-medium rounded-lg transition-all duration-200
                   ${isActive 
                     ? 'bg-blue-600/20 text-blue-400' 
                     : 'hover:bg-gray-800 text-gray-400'}`}
    >
        {children}
    </button>
);

const Switch: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                   ${enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                       ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);

const User = () => {
    const [authState, setAuthState] = useState<'new' | 'registered' | 'authenticated'>('new');
    const [showProfile, setShowProfile] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'profile'>('general');
    const [isDark, setIsDark] = useState(() => 
        localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            const sToken = localStorage.getItem('Stoken');
            const userEmail = localStorage.getItem('userEmail');

            if (token && sToken && userEmail) {
                setAuthState('authenticated');
            } else if (sToken) {
                setAuthState('registered');
            } else {
                setAuthState('new');
            }
        };

        checkAuthStatus();
        window.addEventListener('storage', checkAuthStatus);
        return () => window.removeEventListener('storage', checkAuthStatus);
    }, []);

    const handleSignup = () => navigate('/signup');
    const handleLogin = () => navigate('/login');
    const handleProfile = () => setShowProfile(true);

    const toggleTheme = () => {
        setIsDark(!isDark);
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const handleDeleteAccount = () => {
        // Clear all localStorage
        localStorage.clear();
        navigate('/signup');
    };

    const ProfileModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={() => setShowProfile(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                </div>

                <div className="flex space-x-2 mb-6">
                    <Tab 
                        isActive={activeTab === 'general'}
                        onClick={() => setActiveTab('general')}
                    >
                        General
                    </Tab>
                    <Tab 
                        isActive={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </Tab>
                </div>

                {activeTab === 'general' ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Globe className="w-5 h-5 text-gray-400" />
                                <span className="text-white">Language</span>
                            </div>
                            <select className="bg-gray-800 text-white rounded-lg px-3 py-2 outline-none">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {isDark ? 
                                    <Moon className="w-5 h-5 text-gray-400" /> : 
                                    <Sun className="w-5 h-5 text-gray-400" />
                                }
                                <span className="text-white">Theme</span>
                            </div>
                            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Username</label>
                            <input
                                type="text"
                                value={localStorage.getItem('username') || ''}
                                readOnly
                                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Email</label>
                            <input
                                type="email"
                                value={localStorage.getItem('userEmail') || ''}
                                readOnly
                                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                            />
                        </div>

                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                                <span className="text-white">Terms of Use</span>
                                <Shield className="w-5 h-5 text-gray-400" />
                            </button>

                            <button className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors" onClick={() => navigate("/terms")}>
                                <span className="text-white">Privacy Policy</span>
                                <Shield className="w-5 h-5 text-gray-400" />
                            </button>

                            <button
                                onClick={handleDeleteAccount}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span>Delete Account</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

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
            {showProfile && <ProfileModal />}
        </div>
    );
};

export default User;
