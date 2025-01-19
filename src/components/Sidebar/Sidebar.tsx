import React, { useEffect, useState, useRef } from 'react';
import { MoreHorizontal, Loader2 } from 'lucide-react';

const HistorySidebar = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        setHistory(storedHistory);
        setTimeout(() => setMounted(true), 100);

        const handleClickOutside = (event) => {
            // Handle dropdown close
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
            // Handle rename save on click away
            if (editingIndex !== null && inputRef.current && !inputRef.current.contains(event.target)) {
                handleRename(editingIndex);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [editingIndex]);

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
        if (editValue.trim() && editValue !== history[index].prompt) {
            const updatedHistory = [...history];
            updatedHistory[index] = { ...updatedHistory[index], prompt: editValue.trim() };
            setHistory(updatedHistory);
            localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        }
        setEditingIndex(null);
    };

    return (
        <div className="p-4 bg-gray-900 h-full text-white flex flex-col relative" ref={sidebarRef}>
            {/* New Chat Button */}
            <button
                onClick={handleNewChat}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center mb-8 transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
            >
                {loading ? (
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                ) : (
                    <span className="mr-2">+</span>
                )}
                <span className="text-base">{loading ? 'Loading...' : 'New Chat'}</span>
            </button>

            {/* History List */}
            <div className="flex-1 overflow-y-auto space-y-1 relative">
                {history.length === 0 ? (
                    <p className="text-center text-gray-400 mt-4 text-base">No History Found. Chat to continue.</p>
                ) : (
                    history.map((item, index) => (
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
                                    className="w-full bg-gray-700 text-white px-3 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base"
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <button
                                        className="text-left flex-1 text-white font-medium text-base w-full pr-8"
                                        onClick={() => console.log(`Clicked session ${item.session_number}`)}
                                    >
                                        {item.prompt}
                                    </button>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveDropdown(activeDropdown === index ? null : index);
                                            }}
                                            className="p-1.5 rounded-md hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        >
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}

                {/* Floating Dropdown Menu */}
                {activeDropdown !== null && (
                    <div 
                        ref={dropdownRef}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-1.5 w-36 bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                startRename(activeDropdown);
                            }}
                            className="block w-full text-left px-4 py-2 text-base text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                            Rename
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePrompt(activeDropdown);
                            }}
                            className="block w-full text-left px-4 py-2 text-base text-red-400 hover:bg-gray-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorySidebar;


