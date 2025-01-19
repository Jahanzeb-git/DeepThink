import React, { useEffect, useState, useRef } from 'react';
import { MoreHorizontal, Loader2, Check, X } from 'lucide-react';

const HistorySidebar = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        setHistory(storedHistory);
        setTimeout(() => setMounted(true), 100);

        // Add click outside listener
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNewChat = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const sessionIncResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/session_inc', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!sessionIncResponse.ok) {
                setLoading(false);
                return;
            }

            await new Promise((resolve) => setTimeout(resolve, 500));

            const historyResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/history', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            setLoading(false);

            if (!historyResponse.ok) {
                if (historyResponse.status === 404) return;
                return;
            }

            const historyData = await historyResponse.json();
            const newHistory = [{ session_number: historyData.session_number, prompt: historyData.prompt }, ...history];
            const truncatedHistory = newHistory.slice(0, 7);

            localStorage.setItem('chatHistory', JSON.stringify(truncatedHistory));
            setHistory(truncatedHistory);
        } catch (error) {
            console.error('Error handling new chat:', error);
            setLoading(false);
        }
    };

    const handleDeletePrompt = (indexToDelete) => {
        const updatedHistory = history.filter((_, index) => index !== indexToDelete);
        setHistory(updatedHistory);
        localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        setActiveDropdown(null);
    };

    const startRename = (index) => {
        setEditingIndex(index);
        setEditValue(history[index].prompt);
        setActiveDropdown(null);
    };

    const handleRename = (index) => {
        if (editValue.trim()) {
            const updatedHistory = [...history];
            updatedHistory[index] = { ...updatedHistory[index], prompt: editValue.trim() };
            setHistory(updatedHistory);
            localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        }
        setEditingIndex(null);
    };

    return (
        <div className="p-4 bg-gray-900 h-full text-white flex flex-col" ref={sidebarRef}>
            {/* New Chat Button with increased bottom margin */}
            <button
                onClick={handleNewChat}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md flex items-center justify-center mb-6 transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
            >
                {loading ? (
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                ) : (
                    <span className="mr-2">+</span>
                )}
                {loading ? 'Loading...' : 'New Chat'}
            </button>

            {/* History List with Increased Spacing */}
            <div className="flex-1 overflow-y-auto space-y-3 relative">
                {history.length === 0 ? (
                    <p className="text-center text-gray-400 mt-4">No History Found. Chat to continue.</p>
                ) : (
                    history.map((item, index) => (
                        <div
                            key={index}
                            className={`group relative p-3 rounded-md hover:bg-gray-800 transition-all duration-200 
                                     ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {editingIndex === index ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 bg-gray-700 text-white px-3 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleRename(index)}
                                        className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                                    >
                                        <Check className="w-4 h-4 text-green-500" />
                                    </button>
                                    <button
                                        onClick={() => setEditingIndex(null)}
                                        className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        className="text-left flex-1 text-white font-medium text-sm w-full pr-8"
                                        onClick={() => console.log(`Clicked session ${item.session_number}`)}
                                    >
                                        {item.prompt}
                                    </button>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={dropdownRef}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveDropdown(activeDropdown === index ? null : index);
                                            }}
                                            className="p-1.5 rounded-md hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        >
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </button>
                                        {activeDropdown === index && (
                                            <div 
                                                className="fixed transform translate-x-full -translate-y-full mt-2 py-1.5 w-36 bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50"
                                                style={{
                                                    top: '50%',
                                                    right: '2rem'
                                                }}
                                            >
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startRename(index);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                                >
                                                    Rename
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeletePrompt(index);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistorySidebar;


