import React, { createContext, useContext, useState } from 'react';

export const LoadGameContext = createContext();

export const LoadGameProvider = ({ children }) => {
    const [selectedCategories, setSelectedCategories] = useState([]); // Start Game Selected Categories
    const [loadGameData, setLoadGameData] = useState({}); // Load Game Response Data
    const [initGameModes, setInitGameModes] = useState({}); // Init Game Response Data
    return (
        <LoadGameContext.Provider value={{ loadGameData, selectedCategories, setSelectedCategories, setLoadGameData, initGameModes, setInitGameModes }}>
            {children}
        </LoadGameContext.Provider>
    );
};
