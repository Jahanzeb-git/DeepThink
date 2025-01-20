import React, { useEffect, useState, useRef } from 'react';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import User from './user'


const HistorySidebar = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const menuPositionRef = useRef({ top: 0, left: 0 });

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        const historyWithDates = storedHistory.map(item => ({
            ...item,
            timestamp: item.timestamp || new Date().toISOString()
        }));
        setHistory(historyWithDates);
        setTimeout(() => setMounted(true), 100);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
            if (editingIndex !== null && inputRef.current && !inputRef.current.contains(event.target)) {
                handleRename(editingIndex);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [editingIndex]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        
        // Reset time portion for accurate day comparison
        const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const diffTime = nowWithoutTime - dateWithoutTime;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const startRename = (index) => {
        setEditingIndex(index);
        setEditValue(history[index].prompt);
        setActiveDropdown(null);
    };

    const handleRename = (index) => {
        if (editingIndex !== null && editValue.trim() !== '') {
            const updatedHistory = [...history];
            updatedHistory[index] = {
                ...updatedHistory[index],
                prompt: editValue.trim()
            };
            setHistory(updatedHistory);
            localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        }
        setEditingIndex(null);
        setEditValue('');
    };

    const handleDeletePrompt = (index) => {
        const updatedHistory = history.filter((_, idx) => idx !== index);
        setHistory(updatedHistory);
        localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        setActiveDropdown(null);
    };

    const handleOpenDropdown = (index, event) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        menuPositionRef.current = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
        setActiveDropdown(activeDropdown === index ? null : index);
    };

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
            const newHistory = [{
                session_number: historyData.session_number,
                prompt: historyData.prompt,
                timestamp: new Date().toISOString()
            }, ...history];
            const truncatedHistory = newHistory.slice(0, 7);

            localStorage.setItem('chatHistory', JSON.stringify(truncatedHistory));
            setHistory(truncatedHistory);
        } catch (error) {
            console.error('Error handling new chat:', error);
            setLoading(false);
        }
    };

    // Group history items by date
    const groupedHistory = history.reduce((groups, item) => {
        const date = formatDate(item.timestamp);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(item);
        return groups;
    }, {});

    return (
        <div className="p-4 bg-gray-900 h-full text-white flex flex-col relative">
            <div className="mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    Deepthink
                </h1>
            </div>

            <button
                onClick={handleNewChat}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center mb-10 transition-all duration-200 shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]"
            >
                {loading ? (
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                ) : (
                    <span className="mr-2">+</span>
                )}
                <span className="text-base">{loading ? 'Loading...' : 'New Chat'}</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-6">
                {history.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 text-base">No History Found. Chat to Continue</p>
                    </div>
                ) : (
                    Object.entries(groupedHistory).map(([date, items]) => (
                    <div key={date} className="space-y-1">
                        <h3 className="text-xs text-gray-400 font-medium mb-2 px-2">{date}</h3>
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className={`group relative p-2.5 rounded-md hover:bg-gray-800 transition-all duration-200 
                                         ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {editingIndex === index ? (
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleRename(index);
                                            }
                                        }}
                                        className="w-full bg-gray-700 text-white px-3 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base"
                                        autoFocus
                                    />
                                ) : (
                                    <div className="flex flex-col">
                                        <button
                                            className="text-left flex-1 text-white font-medium text-base w-full pr-8 mb-1"
                                            onClick={() => console.log(`Clicked session ${item.session_number}`)}
                                        >
                                            {item.prompt}
                                        </button>
                                    </div>
                                )}
                                
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <button
                                        onClick={(e) => handleOpenDropdown(index, e)}
                                        className="p-1.5 rounded-md hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    >
                                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    ))
                )}
            </div>
            
            {/* User component at the bottom */}
            <div className="mt-4 border-t border-gray-800 pt-4">
                <User />
            </div>

            {activeDropdown !== null && (
                <div 
                    ref={dropdownRef}
                    style={{
                        position: 'fixed',
                        top: `${menuPositionRef.current.top}px`,
                        left: `${menuPositionRef.current.left - 150}px`,
                    }}
                    className="py-1.5 w-36 bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 
                             animate-in fade-in duration-200 scale-95 origin-top-right"
                >
                    <button
                        onClick={() => startRename(activeDropdown)}
                        className="block w-full text-left px-4 py-2 text-base text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                        Rename
                    </button>
                    <button
                        onClick={() => handleDeletePrompt(activeDropdown)}
                        className="block w-full text-left px-4 py-2 text-base text-red-400 hover:bg-gray-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistorySidebar;


