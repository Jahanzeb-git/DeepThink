import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Settings_menu from './settings_menu';
import { format } from 'date-fns';
import { 
    UserCircle, LogIn, UserPlus, Settings, Globe, 
    Moon, Sun, User as UserIcon, Shield, Trash2, X,
    HelpCircle, LogOut, Key, Copy, Terminal, CheckCircle2, Loader2,
    Clock, Activity, AlertTriangle
} from 'lucide-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ThemeToggle } from '../ThemeToggle';
import LoadingModal2 from './loading2';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ isOpen, onClose, onConfirm }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/80 dark:bg-white/20 backdrop-blur-lg flex items-center justify-center z-[9999]
                        transition-opacity duration-300 ease-in-out"
             style={{ opacity: isVisible ? 1 : 0 }}>
            <div className={`bg-gray-900/95 dark:bg-gray-100/95 backdrop-blur-xl w-full max-w-md rounded-2xl shadow-2xl p-6
                           transition-all duration-500 ease-out transform
                           ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white dark:text-gray-900">
                            Are you sure to proceed delete account?
                        </h3>
                        <p className="text-gray-400 dark:text-gray-600">
                            All account details will be deleted and never be restored.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3 w-full pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-xl bg-gray-800/50 dark:bg-gray-200/50 
                                     text-gray-300 dark:text-gray-600 hover:bg-gray-700/50 dark:hover:bg-gray-300/50
                                     transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30
                                     text-red-400 hover:text-red-300 transition-colors duration-200
                                     border border-red-500/20 hover:border-red-500/30"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

interface TabProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 font-medium rounded-xl transition-all duration-300 text-sm flex items-center flex-1 justify-center
                   ${isActive 
                     ? 'bg-blue-600/20 text-blue-400 dark:text-blue-300 shadow-lg shadow-blue-500/10' 
                     : 'hover:bg-gray-800/80 dark:hover:bg-gray-100/10 text-gray-400 hover:text-gray-300 dark:hover:text-gray-200'}`}
    >
        {children}
    </button>
);

interface EndpointCardProps {
    title: string;
    method: 'GET' | 'POST';
    url: string;
    headers?: { [key: string]: string };
    body?: any;
    description?: string;
}

const EndpointCard: React.FC<EndpointCardProps> = ({ title, method, url, headers, body, description }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-gray-800/50 dark:bg-gray-200/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium
                        ${method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {method}
                    </span>
                    <h3 className="text-white dark:text-gray-900 font-medium">{title}</h3>
                </div>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-400 hover:text-white dark:hover:text-gray-900 transition-colors"
                >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                </button>
            </div>
            
            <div className="flex items-center space-x-2">
                <code className="text-sm bg-gray-900/50 dark:bg-gray-100/50 px-3 py-1 rounded-lg text-gray-300 dark:text-gray-700 flex-1">
                    {url}
                </code>
                <CopyToClipboard text={url}>
                    <button className="p-2 hover:bg-gray-700/50 dark:hover:bg-gray-300/50 rounded-lg transition-colors">
                        <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                </CopyToClipboard>
            </div>

            {isExpanded && (
                <div className="space-y-3 pt-2">
                    {description && (
                        <p className="text-sm text-gray-400 dark:text-gray-600">{description}</p>
                    )}
                    {headers && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 dark:text-gray-600 mb-2">Headers:</h4>
                            <pre className="bg-gray-900/50 dark:bg-gray-100/50 p-3 rounded-lg text-sm text-gray-300 dark:text-gray-700">
                                {JSON.stringify(headers, null, 2)}
                            </pre>
                        </div>
                    )}
                    {body && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 dark:text-gray-600 mb-2">Body:</h4>
                            <pre className="bg-gray-900/50 dark:bg-gray-100/50 p-3 rounded-lg text-sm text-gray-300 dark:text-gray-700">
                                {JSON.stringify(body, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

interface LogEntry {
    endpoint: string;
    model: string;
    timestamp: number;
}

const LogsSection: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showLogs, setShowLogs] = useState(false);
    const [isDeletingLogs, setIsDeletingLogs] = useState(false);

    const fetchLogs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                throw new Error('User email not found');
            }

            const keyResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/user_key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });

            if (!keyResponse.ok) {
                throw new Error('Failed to retrieve API key');
            }

            const { api_key } = await keyResponse.json();
            
            if (!api_key) {
                setError('No API key Generated yet!');
                return;
            }

            const logsResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/v1/logs', {
                headers: {
                    'x-api-key': api_key,
                },
            });

            if (!logsResponse.ok) {
                throw new Error('Failed to fetch logs');
            }

            const { logs } = await logsResponse.json();
            setLogs(logs);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch logs');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLogs = async () => {
        setIsDeletingLogs(true);
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                throw new Error('User email not found');
            }

            const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/delete_logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });

            const data = await response.json();
            setError(data.message);
            if (response.ok) {
                setLogs([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete logs');
        } finally {
            setIsDeletingLogs(false);
        }
    };

    if (!showLogs) {
        return (
            <button
                onClick={() => {
                    setShowLogs(true);
                    fetchLogs();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl 
                         bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors
                         border border-blue-500/20 hover:border-blue-500/30"
            >
                <Activity className="w-5 h-5" />
                <span>Display API Access Logs</span>
            </button>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white dark:text-gray-900">API Usage Logs</h3>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 dark:text-gray-600">
                        {logs.length} requests
                    </span>
                    <button
                        onClick={handleDeleteLogs}
                        disabled={isDeletingLogs}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                    >
                        {isDeletingLogs ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Trash2 className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {logs.map((log, index) => (
                    <div
                        key={index}
                        className="bg-gray-800/50 dark:bg-gray-200/50 rounded-xl p-4 space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-blue-400" />
                                <span className="text-white dark:text-gray-900 text-sm font-medium">
                                    {log.endpoint}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-600 flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{format(log.timestamp * 1000, 'MMM d, yyyy HH:mm:ss')}</span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                {log.model}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface ProfileModalProps {
    setShowProfile: (show: boolean) => void;
    isDark: boolean;
    toggleTheme: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ setShowProfile, isDark, toggleTheme }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'profile' | 'api'>('general');
    const [isModal2Open, setIsModal2Open] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
        return () => {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (apiKey && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setApiKey(null);
        }
        return () => clearInterval(timer);
    }, [apiKey, timeLeft]);

    const handleGenerateApiKey = async () => {
        setIsGenerating(true);
        const userEmail = localStorage.getItem('userEmail');
        
        try {
            const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/generate_key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail
                })
            });

            const data = await response.json();
            setApiKey(data.api_key);
            setTimeLeft(60);
        } catch (error) {
            console.error('Error generating API key:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = () => {
        setIsModal2Open(true);
    };

    const handleModal2Close = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDeleteAccount = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in local storage.');
                return;
            }

            const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/delete_user', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log('User data successfully deleted from the database.');
                localStorage.clear();
                navigate('/signup');
            } else {
                console.error(`Failed to delete user data. Status code: ${response.status}`);
            }
        } catch (error) {
            console.error('An error occurred while deleting user data:', error);
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/80 dark:bg-white/20 backdrop-blur-lg flex items-center justify-center z-[9999]
                        transition-opacity duration-300 ease-in-out overflow-hidden"
             style={{ opacity: isVisible ? 1 : 0 }}>
            <div className={`bg-gray-900/95 dark:bg-gray-100/95 backdrop-blur-xl w-full max-w-4xl md:max-w-4xl h-screen md:h-[85vh] rounded-2xl shadow-2xl relative
                           transition-all duration-500 ease-out transform overflow-hidden
                           ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
                
                {/* Header */}
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-gray-800/50 dark:from-gray-200/50 to-transparent p-8">
                    <button
                        onClick={() => setShowProfile(false)}
                        className="absolute right-6 top-6 text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 
                                 transition-colors duration-300 rounded-full hover:bg-gray-800/50 dark:hover:bg-gray-200/50 p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-3xl font-bold text-white dark:text-gray-900 tracking-tight">Settings</h2>
                    <p className="text-gray-400 dark:text-gray-600 mt-2">Manage your preferences and account settings</p>
                </div>

                {/* Tabs */}
                <div className="absolute top-32 inset-x-0 px-4 md:px-8">
                    <div className="flex space-x-2 md:space-x-4">
                        <Tab 
                            isActive={activeTab === 'general'}
                            onClick={() => setActiveTab('general')}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            <span>General</span>
                        </Tab>
                        <Tab 
                            isActive={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        >
                            <UserIcon className="w-4 h-4 mr-2" />
                            <span>Profile</span>
                        </Tab>
                        <Tab 
                            isActive={activeTab === 'api'}
                            onClick={() => setActiveTab('api')}
                        >
                            <Terminal className="w-4 h-4 mr-2" />
                            <span>Service API</span>
                        </Tab>
                    </div>
                </div>

                {/* Content */}
                <div className="absolute top-48 bottom-0 inset-x-0 overflow-y-auto px-4 md:px-8 pb-8 scrollbar-hide">
                    {activeTab === 'general' ? (
                        <div className="space-y-6">
                            <div className="flex flex-col space-y-4">
                                <h3 className="text-lg font-medium text-white dark:text-gray-900">Preferences</h3>
                                
                                {/* Language Selector */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 dark:bg-gray-200/50">
                                    <div className="flex items-center space-x-3">
                                        <Globe className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                                        <div>
                                            <span className="text-white dark:text-gray-900 text-sm">Language</span>
                                            <p className="text-gray-400 dark:text-gray-600 text-xs mt-0.5">Select your preferred language</p>
                                        </div>
                                    </div>
                                    <select className="bg-gray-700/50 dark:bg-gray-300/50 text-white dark:text-gray-900 rounded-lg px-4 py-2 outline-none text-sm
                                                   border border-gray-600/50 dark:border-gray-400/50 focus:border-blue-500/50 transition-colors">
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                    </select>
                                </div>

                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 dark:bg-gray-200/50">
                                    <div className="flex items-center space-x-3">
                                        {isDark ? 
                                            <Moon className="w-5 h-5 text-gray-400 dark:text-gray-600" /> : 
                                            <Sun className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                                        }
                                        <div>
                                            <span className="text-white dark:text-gray-900 text-sm">Theme</span>
                                            <p className="text-gray-400 dark:text-gray-600 text-xs mt-0.5">Toggle between light and dark mode</p>
                                        </div>
                                    </div>
                                    <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
                                </div>
                            </div>
                            <Settings_menu/>
                        </div>
                    ) : activeTab === 'profile' ? (
                        <div className="space-y-6">
                            {/* Profile Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white dark:text-gray-900">Account Information</h3>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 dark:text-gray-600">Username</label>
                                        <input
                                            type="text"
                                            value={localStorage.getItem('username') || ''}
                                            readOnly
                                            className="w-full bg-gray-800/50 dark:bg-gray-200/50 text-white dark:text-gray-900 px-4 py-3 rounded-xl
                                                     border border-gray-700/50 dark:border-gray-300/50 focus:border-blue-500/50 transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 dark:text-gray-600">Email</label>
                                        <input
                                            type="email"
                                            value={localStorage.getItem('userEmail') || ''}
                                            readOnly
                                            className="w-full bg-gray-800/50 dark:bg-gray-200/50 text-white dark:text-gray-900 px-4 py-3 rounded-xl
                                                     border border-gray-700/50 dark:border-gray-300/50 focus:border-blue-500/50 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white dark:text-gray-900">Help & Support</h3>
                                
                                <button onClick={() => navigate('/terms')} className="w-full flex items-center justify-between px-4 py-3 rounded-xl 
                                               bg-gray-800/50 dark:bg-gray-200/50 hover:bg-gray-700/50 dark:hover:bg-gray-300/50 transition-colors">
                                    <span className="text-white dark:text-gray-900 text-sm">Terms of Use</span>
                                    <Shield className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                                </button>

                                <a 
                                    href="mailto:jahanzebahmed.mail@gmail.com" 
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl 
                                       bg-gray-800/50 dark:bg-gray-200/50 hover:bg-gray-700/50 dark:hover:bg-gray-300/50 transition-colors"
                                >
                                    <span className="text-white dark:text-gray-900 text-sm">Help</span>
                                    <HelpCircle className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                                </a>
                            </div>

                            {/* Account Actions */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-lg font-medium text-white dark:text-gray-900">Account Actions</h3>
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl 
                                             bg-gray-800/50 dark:bg-gray-200/50 hover:bg-gray-700/50 dark:hover:bg-gray-300/50 text-white dark:text-gray-900 transition-colors
                                             border border-gray-600/50 dark:border-gray-400/50 hover:border-gray-500/50 dark:hover:border-gray-500/50"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm">Log Out</span>
                                </button>
                                <LoadingModal2 isOpen={isModal2Open} onClose={handleModal2Close} />

                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl 
                                             bg-red-500/10 hover:bg-red-500/20 text-red-400 dark:text-red-500 transition-colors
                                             border border-red-500/20 hover:border-red-500/30"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    <span className="text-sm">Delete Account</span>
                                </button>
                                <DeleteConfirmDialog 
                                    isOpen={showDeleteConfirm}
                                    onClose={() => setShowDeleteConfirm(false)}
                                    onConfirm={handleConfirmDelete}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white dark:text-gray-900">API Access</h3>
                                <p className="text-gray-400 dark:text-gray-600">Generate an API key to access our services programmatically</p>

                                <div className="bg-gray-800/50 dark:bg-gray-200/50 p-4 md:p-6 rounded-xl space-y-4">
                                    {apiKey ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-400 dark:text-gray-600">Your API Key (visible for {timeLeft} seconds)</span>
                                                <CopyToClipboard text={apiKey} onCopy={handleCopy}>
                                                    <button className="p-2 hover:bg-gray-700/50 dark:hover:bg-gray-300/50 rounded-lg transition-colors">
                                                        {copied ? 
                                                            <CheckCircle2 className="w-5 h-5 text-green-400" /> :
                                                            <Copy className="w-5 h-5 text-gray-400" />
                                                        }
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                            <code className="block w-full bg-gray-900/50 dark:bg-gray-100/50 px-4 py-3 rounded-lg 
                                                         text-blue-400 dark:text-blue-600 font-mono text-sm">
                                                {apiKey}
                                            </code>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleGenerateApiKey}
                                            disabled={isGenerating}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl 
                                                     bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors
                                                     border border-blue-500/20 hover:border-blue-500/30"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Generating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Key className="w-5 h-5" />
                                                    <span>Generate API Key</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white dark:text-gray-900">API Documentation</h3>
                                <p className="text-gray-400 dark:text-gray-600">Available endpoints and their usage</p>

                                <div className="space-y-4 overflow-x-auto">
                                    <EndpointCard
                                        title="Chat Completions"
                                        method="POST"
                                        url="https://jahanzebahmed25.pythonanywhere.com/v1/chat/completions"
                                        headers={{
                                            "Content-Type": "application/json",
                                            "x-api-key": "<YOUR_API_KEY>"
                                        }}
                                        body={{
                                            "prompt": "Explain how the solar system works.",
                                            "reason": true,
                                            "temperature": 0.7,
                                            "max_completion_tokens": 1500,
                                            "top_p": 0.9,
                                            "stream": true,
                                            "stop": null
                                        }}
                                        description="Main endpoint for chat functionality. Supports streaming responses and reasoning capabilities."
                                    />

                                    <EndpointCard
                                        title="Health Check"
                                        method="GET"
                                        url="https://jahanzebahmed25.pythonanywhere.com/v1/health"
                                        description="Check if the API is operational."
                                    />

                                    <EndpointCard
                                        title="Usage Logs"
                                        method="GET"
                                        url="https://jahanzebahmed25.pythonanywhere.com/v1/logs"
                                        headers={{
                                            "x-api-key": "<YOUR_API_KEY>"
                                        }}
                                        description="Retrieve API usage logs for your account."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 mt-8">
                                <LogsSection />
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
                        className="group relative w-full px-6 py-3 rounded-lg text-white dark:text-gray-900 font-medium
                                 overflow-hidden transition-all duration-300
                                 bg-gradient-to-br from-blue-600/20 to-cyan-600/20
                                 dark:from-blue-400/30 dark:to-cyan-400/30
                                 hover:from-blue-600/30 hover:to-cyan-600/30
                                 dark:hover:from-blue-400/40 dark:hover:to-cyan-400/40
                                 border border-blue-500/50 dark:border-blue-400/50 hover:border-cyan-400 dark:hover:border-cyan-500"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-full h-full absolute bg-gradient-to-r from-blue-600/10 to-cyan-600/10 
                                        dark:from-blue-400/20 dark:to-cyan-400/20 backdrop-blur-sm" />
                        </div>
                        <span className="relative flex items-center justify-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Sign Up
                        </span>
                        <div className="absolute inset-0 border border-cyan-400/50 dark:border-cyan-500/50 rounded-lg opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300 scale-105" />
                    </button>
                );
            case 'registered':
                return (
                    <button
                        onClick={handleLogin}
                        className="group relative w-full px-6 py-3 rounded-lg text-white dark:text-gray-900 font-medium
                                 overflow-hidden transition-all duration-300
                                 bg-gradient-to-br from-indigo-600/20 to-purple-600/20
                                 dark:from-indigo-400/30 dark:to-purple-400/30
                                 hover:from-indigo-600/30 hover:to-purple-600/30
                                 dark:hover:from-indigo-400/40 dark:hover:to-purple-400/40
                                 border border-indigo-500/50 dark:border-indigo-400/50 hover:border-purple-400 dark:hover:border-purple-500"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-full h-full absolute bg-gradient-to-r from-indigo-600/10 to-purple-600/10 
                                        dark:from-indigo-400/20 dark:to-purple-400/20 backdrop-blur-sm" />
                        </div>
                        <span className="relative flex items-center justify-center gap-2">
                            <LogIn className="w-5 h-5" />
                            Login
                        </span>
                        <div className="absolute inset-0 border border-purple-400/50 dark:border-purple-500/50 rounded-lg opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300 scale-105" />
                    </button>
                );
            case 'authenticated':
                return (
                    <button
                        onClick={handleProfile}
                        className="group relative w-full px-6 py-3 rounded-lg text-white dark:text-gray-900 font-medium
                                 overflow-hidden transition-all duration-300
                                 bg-gradient-to-br from-emerald-600/20 to-teal-600/20
                                 dark:from-emerald-400/30 dark:to-teal-400/30
                                 hover:from-emerald-600/30 hover:to-teal-600/30
                                 dark:hover:from-emerald-400/40 dark:hover:to-teal-400/40
                                 border border-emerald-500/50 dark:border-emerald-400/50 hover:border-teal-400 dark:hover:border-teal-500"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-full h-full absolute bg-gradient-to-r from-emerald-600/10 to-teal-600/10 
                                        dark:from-emerald-400/20 dark:to-teal-400/20 backdrop-blur-sm" />
                        </div>
                        <span className="relative flex items-center justify-center gap-2">
                            <UserCircle className="w-5 h-5" />
                            My Profile
                        </span>
                        <div className="absolute inset-0 border border-teal-400/50 dark:border-teal-500/50 rounded-lg opacity-0 
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
