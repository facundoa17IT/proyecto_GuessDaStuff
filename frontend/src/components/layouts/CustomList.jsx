/** React **/
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

/** Style **/
import '../../styles/custom-list.css'

/** Icons **/
import { IoMdAddCircleOutline } from "react-icons/io";
import DefaultIcon from '../../assets/GDS-coin.png'
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

/** Props Validation **/
//import PropTypes from 'prop-types';

/** Sub Components **/
import { IconButton, buttonMapping } from "../layouts/ItemListButtons"
import Dropdown from '../ui/Dropdown';

/** Context API **/
import { ListContext } from '../../contextAPI/ListContext';

const CustomList = ({
    listId,
    headerContent,
    listContent = [],
    getItemLabel = (item = null) => { },
    addNewEntry = false,
    onAddNewEntry = () => { },
    buttons = [],
    extraColumns = () => [],
    width = '100%',
    defaultFilter = 'none', // Nueva propiedad para el filtro predeterminado
    customFilter = [],  // Accept custom filter function
    defaultSort = 'label-asc',
    customSort = [],     // Accept custom sort function
    onButtonInteraction, // New prop
}) => {
    const { setSelectedItem, setSelectedBtn, setSelectedListId } = useContext(ListContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
    const [sortOption, setSortOption] = useState(defaultSort); // Default sort by item label (ascending)

    const isDesignBreakpoint = useMediaQuery({ query: '(max-width: 650px)' });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const filteredSortedList = useMemo(() => {
        let filteredList = [...listContent];

        // Filter the list based on search query
        if (searchQuery) {
            filteredList = filteredList.filter((item) =>
                getItemLabel(item).toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply the custom filter if provided
        if (selectedFilter !== 'none') {
            const selectedFilterOption = customFilter.find(option => option.label === selectedFilter);
            if (selectedFilterOption) {
                filteredList = filteredList.filter(selectedFilterOption.criteria);
            }
        }

        // Apply Default sorting
        const defaultSortOptions = [
            { value: 'label-asc', criteria: (a, b) => getItemLabel(a).localeCompare(getItemLabel(b)) },
            { value: 'label-desc', criteria: (a, b) => getItemLabel(b).localeCompare(getItemLabel(a)) },
        ];

        const allSortOptions = [...defaultSortOptions, ...customSort];

        // Find the selected sorting criteria
        const selectedSortOption = allSortOptions.find(option => option.value === sortOption);
        if (selectedSortOption) {
            filteredList.sort(selectedSortOption.criteria);
        }

        return filteredList;
    }, [listContent, searchQuery, selectedFilter, sortOption, customFilter, customSort, getItemLabel]);

    const handleButtonClick = (item, buttonKey) => {
        setSelectedListId(listId);
        setSelectedItem(item);      // Set the clicked item
        setSelectedBtn(buttonKey);  // Set the button identifier
        // Trigger the callback with listId, buttonKey, and item
        onButtonInteraction?.(listId, buttonKey, item);
        console.log(`List ID: ${listId}, Button: ${buttonKey}, Item: ${JSON.stringify(item, null, 2)}`);
    };

    return (
        <div className='list-wrapper' style={{ width: `${width}` }}>
            <div className='list-container'>
                <div className='list-header'>
                    {/* Search, Filter, and Sort Controls */}
                    <div className="list-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px' }}>
                        {/* Search Input */}
                        <FaSearch fontSize={30} style={{ margin: '5px', color: 'var(--text-color)' }} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{ width: '50%', margin: '0', fontSize: 'small', padding: '5px' }}
                        />

                        {/* Filter Dropdown */}
                        <FaFilter fontSize={20} style={{ margin: '5px', color: 'var(--text-color)' }} />
                        <select
                            value={selectedFilter}
                            onChange={handleFilterChange}
                            style={{ width: '50%', height: '100%', border: '2px solid var(--border-color)', borderRadius: '8px', padding: '3px' }}
                        >
                            <option value="none">Ninguno</option>
                            {/* Add other filter options here */}
                            {customFilter.map((filterOption, index) => (
                                <option key={index} value={filterOption.label}>
                                    {filterOption.label}
                                </option>
                            ))}
                        </select>

                        {/* Sort Dropdown */}
                        <FaSort fontSize={20} style={{ margin: '5px', color: 'var(--text-color)' }} />
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            style={{ width: '50%', height: '100%', border: '2px solid var(--border-color)', borderRadius: '8px', padding: '3px' }}
                        >
                            {/* Render sorting options dynamically */}
                            {[
                                { label: 'Ninguno', value: 'none' },
                                { label: '(A-Z)', value: 'label-asc' },
                                { label: '(Z-A)', value: 'label-desc' },

                                ...customSort
                            ].map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {headerContent}
                </div>

                <div className='list-body'>
                    <table>
                        <tbody>
                            {filteredSortedList.length > 0 ? (
                                filteredSortedList.map((item, index) => (
                                    <tr key={index}>

                                        {/* Show Index */}
                                        <td style={{ width: '25px' }}>
                                            <p style={{ fontSize: 'medium' }}>#{index + 1}</p>
                                        </td>

                                        {/* Show Id */}
                                        {item.id && <td style={{ width: '60px' }}>
                                            <p style={{ fontSize: 'small' }}>id: {item.id}</p>
                                        </td>}

                                        {/* Dynamically accept item.icon, if empty use default icon, also accept img as icon */}
                                        <td style={{ display: 'flex', alignItems: 'center' }}>
                                            {item.urlPerfil ? (
                                                typeof item.urlPerfil === 'string' && !item.urlPerfil.includes('urlDoMacaco') ? (
                                                    <img
                                                        src={item.urlPerfil}
                                                        alt={item.name}
                                                        style={{ marginRight: '10px', width: '30px', height: '30px', borderRadius: '50%', border: '2px solid var(--border-color)' }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={DefaultIcon}
                                                        alt={item.name}
                                                        style={{ marginRight: '10px', width: '30px', height: '30px', borderRadius: '50%', border: '2px solid var(--border-color)' }}
                                                    />
                                                )
                                            ) : (
                                                <img
                                                    src={DefaultIcon}
                                                    alt={item.name}
                                                    style={{ marginRight: '10px', width: '30px', height: '30px', borderRadius: '50%', border: '2px solid var(--border-color)' }}
                                                />
                                            )}
                                            <p style={{ fontSize: 'medium' }}>{getItemLabel(item)}</p>
                                        </td>

                                        {/* Dynamically added extra <td> elements */}
                                        {extraColumns(item).map((content, i) => (
                                            <td key={i}>
                                                <small>{content}</small>
                                            </td>
                                        ))}

                                        {/* Dynamically render buttons with custom icon and action */}
                                        {buttons.length > 0 &&<td>
                                            {!isDesignBreakpoint ? (
                                                buttons.map((buttonKey, i) => (
                                                    buttonMapping[buttonKey] ? (
                                                        <IconButton
                                                            key={buttonKey}
                                                            icon={buttonMapping[buttonKey].icon}
                                                            label={buttonMapping[buttonKey].label}
                                                            onClick={() => handleButtonClick(item, buttonKey)}
                                                        />
                                                    ) : null
                                                ))
                                            ) : (
                                                    <Dropdown
                                                    options={buttons.map((buttonKey) => ({
                                                        key: buttonKey,
                                                        label: buttonMapping[buttonKey]?.label,
                                                        icon: buttonMapping[buttonKey]?.icon,
                                                        onClick: () => handleButtonClick(item, buttonKey),
                                                    }))}
                                                />
                                            )}
                                        </td>}

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No hay contenido disponible.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* <div className='list-footer'></div> */}
            </div>
            <div className='list-external-footer'>
                {/* Add New Entry */}
                {addNewEntry && (
                    <button onClick={onAddNewEntry}>
                        <IoMdAddCircleOutline style={{ marginRight: '5px', fontSize: '30px' }} /><small>Agregar</small>
                    </button>
                )}
                <small style={{ marginTop: '0' }}>Total: {filteredSortedList.length}</small>
            </div>
        </div>
    );
};

// Add PropTypes validation
// GenericList.propTypes = {
//     listContent: PropTypes.arrayOf(PropTypes.object), // An array of objects, each representing an item in the list
//     getItemLabel: PropTypes.func, // Function that returns a label for each item
//     addNewEntry: PropTypes.bool, // Boolean indicating whether adding a new entry is allowed
//     buttons: PropTypes.arrayOf(PropTypes.string), // An array of button keys (strings) to show
//     extraColumns: PropTypes.func, // Function that returns extra columns for each item
//     width: PropTypes.string, // String for setting the width of the component
//     customFilter: PropTypes.arrayOf(PropTypes.object),
//     customSort: PropTypes.arrayOf(PropTypes.object),
// };

export default CustomList;
