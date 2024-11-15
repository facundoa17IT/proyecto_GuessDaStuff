import React, { createContext, useContext, useState } from 'react';

export const ListContext = createContext();

export const ListProvider = ({ children }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedBtn, setSelectedBtn] = useState(null);
    const [selectedListId, setSelectedListId] = useState(null);

    return (
        <ListContext.Provider value={{ selectedItem, setSelectedItem, selectedBtn, setSelectedBtn, selectedListId, setSelectedListId}}>
            {children}
        </ListContext.Provider>
    );
};
