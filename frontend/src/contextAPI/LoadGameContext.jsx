import React, { createContext, useContext, useState } from 'react';

export const LoadGameContext = createContext();

export const LoadGameProvider = ({ children }) => {
    const [loadGameData, setLoadGameData] = useState(); // Load Game Response
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [initGameData, setinitGameData] = useState({}); // Init Game Data
    return (
        <LoadGameContext.Provider value={{ loadGameData, selectedCategories, setSelectedCategories, setLoadGameData, initGameData, setinitGameData }}>
            {children}
        </LoadGameContext.Provider>
    );
};
