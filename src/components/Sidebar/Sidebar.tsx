// Import React, useEffect, useState, and Lucide React icons
import React, { useEffect, useState } from 'react';
import { Trash, Loader2 } from 'lucide-react';

const HistorySidebar = () => {
    const [history, setHistory] = useState([]); // Store history state
    const [loading, setLoading] = useState(false); // Loading state for button

    useEffect(() => {
        // On component mount, fetch local storage data
        const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        setHistory(storedHistory);
    }, []);

    const handleNewChat = async () => {
        try {
            setLoading(true); // Start loading

            // Fetch bearer token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            // Step 1: Increment the session
            const sessionIncResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/session_inc', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!sessionIncResponse.ok) {
                setLoading(false);
                return;
            }

            // Step 2: Wait for 500ms
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Step 3: Fetch history
            const historyResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/history', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            setLoading(false); // Stop loading

            if (!historyResponse.ok) {
                if (historyResponse.status === 404) {
                    // Do nothing for 404, handle gracefully
                    return;
                }
                return;
            }

            const historyData = await historyResponse.json();

            // Step 4: Update local storage and UI
            const newHistory = [{ session_number: historyData.session_number, prompt: historyData.prompt }, ...history];
            const truncatedHistory = newHistory.slice(0, 7); // Truncate to latest 7 sessions

            // Update local storage
            localStorage.setItem('chatHistory', JSON.stringify(truncatedHistory));

            // Update state
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
    };

    return (
        <div className="p-4 bg-gray-900 h-full text-white flex flex-col">
            {/* New Chat Button */}
            <button
                onClick={handleNewChat}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center mb-4"
            >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                {loading ? 'Loading...' : 'New Chat'}
            </button>

            {/* History Sidebar */}
            <div className="flex-1 overflow-y-auto">
                {history.length === 0 ? (
                    <p className="text-center text-gray-400">No History Found. Chat to continue.</p>
                ) : (
                    history.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 hover:bg-gray-700 p-3 rounded-md mb-2 flex items-center justify-between group"
                        >
                            <button
                                className="text-left flex-1 text-white font-medium text-sm"
                                onClick={() => console.log(`Clicked session ${item.session_number}`)}
                            >
                                {item.prompt}
                            </button>
                            <Trash
                                onClick={() => handleDeletePrompt(index)}
                                className="text-gray-400 hover:text-red-500 cursor-pointer ml-2 group-hover:opacity-100 opacity-0 transition-opacity"
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistorySidebar;


