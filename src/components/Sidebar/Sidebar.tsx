// Assuming React + localStorage setup
import React, { useEffect, useState } from 'react';

const HistorySidebar = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // On component mount, fetch the local storage data
        const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        setHistory(storedHistory);
    }, []);

    const handleNewChat = async () => {
        try {
            // Fetch bearer token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No Chat found.'); // Message if token is missing
                return;
            }

            // Step 1: Increment the session
            const sessionIncResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/session_inc', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!sessionIncResponse.ok) {
                alert('Failed to start a new session.');
                return;
            }
            const sessionData = await sessionIncResponse.json();

            // Step 2: Wait for 500ms
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Step 3: Fetch history
            const historyResponse = await fetch('https://jahanzebahmed25.pythonanywhere.com/history', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!historyResponse.ok) {
                if (historyResponse.status === 404) {
                    alert('No Chat found.'); // Gracefully handle 404
                } else {
                    alert('Failed to fetch history.');
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
        }
    };

    // Handle Page Leave
    useEffect(() => {
        const handleBeforeUnload = () => {
            handleNewChat(); // Call the same logic as new chat
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [history]); // Dependency on history for updated state

    return (
        <div>
            <button onClick={handleNewChat}>New Chat</button>
            <div className="history-sidebar">
                {history.map((item, index) => (
                    <div key={index} className="history-item">
                        <p>Session {item.session_number}: {item.prompt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistorySidebar;

