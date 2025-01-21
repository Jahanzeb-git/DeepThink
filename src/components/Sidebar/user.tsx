import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
    UserCircle, LogIn, UserPlus, Settings, Globe, 
    Moon, Sun, User as UserIcon, Shield, Trash2, X,
    HelpCircle, LogOut
} from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import LoadingModal from './loading';
import LoadingModal2 from './loading2'

interface TabProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 font-medium rounded-xl transition-all duration-300 text-sm flex items-center
                   ${isActive 
                     ? 'bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10' 
                     : 'hover:bg-gray-800/80 text-gray-400 hover:text-gray-300'}`}
    >
        {children}
    </button>
);

interface ProfileModalProps {
    setShowProfile: (show: boolean) => void;
    isDark: boolean;
    toggleTheme: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ setShowProfile, isDark, toggleTheme }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'profile'>('general');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
        return () => {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleLogout = () => {
        setIsModal2Open(true) // open the modal
    };

    const handleModal2Close = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };


    const handleDeleteAccount = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleModalClose = async () => {
        try {
            // Retrieve token from local storage
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token not found in local storage.');
                return;
            }

            // Send DELETE request to the endpoint
            const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/delete_user', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Check if the response is successful
            if (response.status === 200) {
                console.log('User data successfully deleted from the database.');

                // Clear local storage
                localStorage.clear();

                // Navigate to the signup page
                navigate('/signup');
            } else {
                console.error(`Failed to delete user data. Status code: ${response.status}`);
            }
        } catch (error) {
            console.error('An error occurred while deleting user data:', error);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-[9999]
                        transition-opacity duration-300 ease-in-out"
             style={{ opacity: isVisible ? 1 : 0 }}>
            <div className={`bg-gray-900/95 backdrop-blur-xl w-full max-w-4xl md:max-w-4xl h-screen md:h-[85vh] rounded-2xl shadow-2xl relative
                           transition-all duration-500 ease-out transform overflow-hidden
                           ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
                
                {/* Header */}
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-gray-800/50 to-transparent p-8">
                    <button
                        onClick={() => setShowProfile(false)}
                        className="absolute right-6 top-6 text-gray-400 hover:text-white 
                                 transition-colors duration-300 rounded-full hover:bg-gray-800/50 p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
                    <p className="text-gray-400 mt-2">Manage your preferences and account settings</p>
                </div>

                {/* Tabs */}
                <div className="absolute top-32 inset-x-0 px-8">
                    <div className="flex space-x-4">
                        <Tab 
                            isActive={activeTab === 'general'}
                            onClick={() => setActiveTab('general')}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            General
                        </Tab>
                        <Tab 
                            isActive={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        >
                            <UserIcon className="w-4 h-4 mr-2" />
                            Profile
                        </Tab>
                    </div>
                </div>

                {/* Content */}
                <div className="absolute top-48 bottom-0 inset-x-0 overflow-y-auto px-8 pb-8">
                    {activeTab === 'general' ? (
                        <div className="space-y-6">
                            <div className="flex flex-col space-y-4">
                                <h3 className="text-lg font-medium text-white">Preferences</h3>
                                
                                {/* Language Selector */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
                                    <div className="flex items-center space-x-3">
                                        <Globe className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <span className="text-white text-sm">Language</span>
                                            <p className="text-gray-400 text-xs mt-0.5">Select your preferred language</p>
                                        </div>
                                    </div>
                                    <select className="bg-gray-700/50 text-white rounded-lg px-4 py-2 outline-none text-sm
                                                   border border-gray-600/50 focus:border-blue-500/50 transition-colors">
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                    </select>
                                </div>

                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
                                    <div className="flex items-center space-x-3">
                                        {isDark ? 
                                            <Moon className="w-5 h-5 text-gray-400" /> : 
                                            <Sun className="w-5 h-5 text-gray-400" />
                                        }
                                        <div>
                                            <span className="text-white text-sm">Theme</span>
                                            <p className="text-gray-400 text-xs mt-0.5">Toggle between light and dark mode</p>
                                        </div>
                                    </div>
                                    <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Profile Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white">Account Information</h3>
                                
                                <div className="space-y-4">
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
                                </div>
                            </div>

                            {/* Links */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white">Help & Support</h3>
                                
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
                            </div>

                            {/* Account Actions */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-lg font-medium text-white">Account Actions</h3>
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl 
                                             bg-gray-800/50 hover:bg-gray-700/50 text-white transition-colors
                                             border border-gray-600/50 hover:border-gray-500/50"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm">Log Out</span>
                                </button>
                                <LoadingModal2 isOpen={isModal2Open} onClose={handleModal2Close} />

                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl 
                                             bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors
                                             border border-red-500/20 hover:border-red-500/30"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    <span className="text-sm">Delete Account</span>
                                </button>
                                <LoadingModal isOpen={isModalOpen} onClose={handleModalClose} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

const SettingsPortal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    isDark: boolean;
    toggleTheme: () => void;
}> = ({ isOpen, onClose, isDark, toggleTheme }) => {
    if (!isOpen) return null;

    return (
        <ProfileModal 
            setShowProfile={onClose}
            isDark={isDark}
            toggleTheme={toggleTheme}
        />
    );
};

const User: React.FC = () => {
    const [authState, setAuthState] = useState<'new' | 'registered' | 'authenticated'>('new');
    const [showProfile, setShowProfile] = useState(false);
    const [isDark, setIsDark] = useState(() => 
        localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            const sToken = localStorage.getItem('Stoken');

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
        <>
            <div className="w-full">
                {getButton()}
            </div>
            <SettingsPortal
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
                isDark={isDark}
                toggleTheme={toggleTheme}
            />
        </>
    );
};

export default User;

