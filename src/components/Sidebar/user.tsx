import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UserCircle, LogIn, UserPlus, Settings, Globe, 
    Moon, Sun, User as UserIcon, Shield, Trash2, X,
    HelpCircle
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
        className={`px-6 py-3 font-medium rounded-xl transition-all duration-300 text-sm
                   ${isActive 
                     ? 'bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10' 
                     : 'hover:bg-gray-800/80 text-gray-400 hover:text-gray-300'}`}
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

            if (token || (token && sToken)) {
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
        localStorage.clear();
        navigate('/signup');
    };

    const ProfileModal = () => {
        const [isVisible, setIsVisible] = useState(false);
        
        useEffect(() => {
            setIsVisible(true);
            return () => setIsVisible(false);
        }, []);

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50
                            transition-opacity duration-300 ease-in-out"
                 style={{ opacity: isVisible ? 1 : 0 }}>
                <div className={`bg-gray-900/90 backdrop-blur-xl rounded-2xl w-full max-w-md p-8 shadow-2xl relative
                               transition-all duration-500 ease-out transform
                               ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <button
                        onClick={() => setShowProfile(false)}
                        className="absolute right-6 top-6 text-gray-400 hover:text-white 
                                 transition-colors duration-300 rounded-full hover:bg-gray-800/50 p-2"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Settings</h2>
                        <p className="text-gray-400 mt-1 text-sm">Manage your preferences and account settings</p>
                    </div>

                    <div className="flex space-x-3 mb-8">
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
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm">
                                <div className="flex items-center space-x-3">
                                    <Globe className="w-5 h-5 text-gray-400" />
                                    <span className="text-white text-sm">Language</span>
                                </div>
                                <select className="bg-gray-700/50 text-white rounded-lg px-4 py-2 outline-none text-sm
                                               border border-gray-600/50 focus:border-blue-500/50 transition-colors">
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm">
                                <div className="flex items-center space-x-3">
                                    {isDark ? 
                                        <Moon className="w-5 h-5 text-gray-400" /> : 
                                        <Sun className="w-5 h-5 text-gray-400" />
                                    }
                                    <span className="text-white text-sm">Theme</span>
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
                                    className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-xl
                                             border border-gray-700/50 focus:border-blue-500/50 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Email</label>
                                <input
                                    type="email"
                                    value={localStorage.getItem('userEmail') || ''}
                                    readOnly
                                    className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-xl
                                             border border-gray-700/50 focus:border-blue-500/50 transition-colors"
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl 
                                               bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                                    <span className="text-white text-sm">Terms of Use</span>
                                    <Shield className="w-5 h-5 text-gray-400" />
                                </button>

                                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl 
                                               bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                                    <span className="text-white text-sm">Help Center</span>
                                    <HelpCircle className="w-5 h-5 text-gray-400" />
                                </button>

                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl 
                                             bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors
                                             border border-red-500/20 hover:border-red-500/30"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    <span className="text-sm">Delete Account</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
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
            {showProfile && <ProfileModal />}
        </div>
    );
};

export default User;
