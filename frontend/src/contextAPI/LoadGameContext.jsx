import React, { createContext, useContext, useState } from 'react';

export const LoadGameContext = createContext();

export const LoadGameProvider = ({ children }) => {
    const [selectedCategories, setSelectedCategories] = useState([]); // Start Game Selected Categories
    const [loadGameData, setLoadGameData] = useState({}); // Load Game Response Data
    const [initGameModes, setInitGameModes] = useState({}); // Init Game Response Data
    const [gameId, setGameId] = useState(null); // Id Game
    const [isMultiplayer, setIsMultiplayer] = useState(null);

    const [answer, setAnswer] = useState('');
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);

    const [hostWinsCount, setHostWinsCount] = useState(0);
    const [guestWinsCount, setGuestWinsCount] = useState(0);

    return (
        <LoadGameContext.Provider value={{
            loadGameData,selectedCategories,
            setSelectedCategories,setLoadGameData,
            initGameModes,setInitGameModes,
            gameId, setGameId,
            isCorrectAnswer, setIsCorrectAnswer,
            answer, setAnswer,
            isMultiplayer, setIsMultiplayer,
            hostWinsCount, setHostWinsCount,
            guestWinsCount, setGuestWinsCount
        }}>
            {children}
        </LoadGameContext.Provider>
    );
};
