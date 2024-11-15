import React, { createContext, useContext, useState } from 'react';

export const LoadGameContext = createContext();

export const LoadGameProvider = ({ children }) => {
    const [selectedCategories, setSelectedCategories] = useState([]); // Start Game Selected Categories
    const [loadGameData, setLoadGameData] = useState({}); // Load Game Response Data
    const [initGameModes, setInitGameModes] = useState({}); // Init Game Response Data
    const [idGameSingle, setIdGameSingle] = useState({}); // Id Game Single
    const [isMultiplayer, setIsMultiplayer] = useState(null);

    const [answer, setAnswer] = useState('');
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);

    return (
        <LoadGameContext.Provider value={{
            loadGameData,selectedCategories,
            setSelectedCategories,setLoadGameData,
            initGameModes,setInitGameModes,
            idGameSingle,setIdGameSingle,
            isCorrectAnswer, setIsCorrectAnswer,
            answer, setAnswer,
            isMultiplayer, setIsMultiplayer
        }}>
            {children}
        </LoadGameContext.Provider>
    );
};
