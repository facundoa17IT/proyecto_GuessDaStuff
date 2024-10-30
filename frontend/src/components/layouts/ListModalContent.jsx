import React, { useContext } from 'react';
//import PropTypes from 'prop-types';
import { buttonMapping } from "../layouts/ItemListButtons";
import { ListContext } from '../../contextAPI/ListContext';
const ListModaContent = ({ extraDetails, isInfoBtn = false, customModalContent, selectedItem, selectedBtn }) => {
    const { hideData } = useContext(ListContext);

    if (!selectedItem) {
        return <p>No Info Available</p>;
    }

    const selectedButtonData = selectedBtn ? buttonMapping[selectedBtn] : null;

    return (
        <div style={{ width: '85%', height: '100%' }}>
            {/* Render the selected button's icon and label */}
            <hr />
            {selectedButtonData && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
                    <h1 style={{ marginBottom: '0px' }}>
                        {typeof selectedButtonData.icon === 'string' && selectedButtonData.icon.endsWith('.png') ? (
                            <img
                                src={selectedButtonData.icon}
                                alt="icon"
                                style={{ width: '30px', height: '30px', marginRight: '10px' }}
                            />
                        ) : (
                            React.createElement(selectedButtonData.icon, { style: { marginRight: '10px', fontSize: '30px' } })
                        )}
                    </h1>
                    <h1 style={{ marginBottom: '0px' }}>{selectedButtonData.label}</h1>
                </div>
            )}

            {isInfoBtn ? (
                <div>
                    {!hideData && <ul style={{ textAlign: 'left' }}>
                        {Object.entries(selectedItem).map(([key, value]) => (
                            <li key={key}>
                                {key === "icon" ? (
                                    <span>
                                        <strong>{key}:</strong>
                                        {typeof value === 'string' && value.endsWith('.png') ? (
                                            <img
                                                src={value}
                                                alt={key}
                                                style={{ width: '30px', height: '30px', marginLeft: '10px' }}
                                            />
                                        ) : (
                                            React.createElement(value, { style: { marginLeft: '10px', fontSize: '30px' } })
                                        )}
                                    </span>
                                ) : (
                                    <span>
                                        <strong>{key}:</strong> {String(value)}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>}
                    {extraDetails}
                </div>
            ) : (
                customModalContent
            )}
        </div>
    );
};

// ListModaContent.propTypes = {
//     selectedItem: PropTypes.object,
//     selectedBtn: PropTypes.string
// };

export default ListModaContent;
