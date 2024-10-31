import React, { createContext, useContext, useState } from 'react';

export const ListContext = createContext();

export const ListProvider = ({ children }) => {
    const [selectedItem, setSelectedItem] = useState();
    const [selectedBtn, setSelectedBtn] = useState();
    const [selectedListId, setSelectedListId] = useState();

    return (
        <ListContext.Provider value={{ selectedItem, setSelectedItem, selectedBtn, setSelectedBtn, selectedListId, setSelectedListId}}>
            {children}
        </ListContext.Provider>
    );
};
