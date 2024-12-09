import React, { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { IconButton } from '../layouts/ItemListButtons';
const Dropdown = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Botón principal que abre/cierra el dropdown */}
            <IconButton
                icon={GiHamburgerMenu}
                label={''}
                onClick={toggleDropdown}
            />
            {isOpen && (
                <ul
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        background: 'white',
                        border: '2px solid var(--border-color)',
                        padding: '10px',
                        listStyleType: 'none',
                        margin: '0',
                        zIndex: 10,
                        borderRadius: '8px'
                    }}
                >
                    {/* Opciones dentro del dropdown */}
                    {options.map((option) => (
                        <li
                            key={option.key}
                            style={{
                                padding: '5px 10px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent:'center',
                                alignItems:'center'
                            }}
                            onClick={() => {
                                option.onClick();
                                setIsOpen(false); // Cerrar el dropdown al seleccionar una opción
                            }}
                        >
                            <IconButton
                                icon={option.icon}
                                label={option.label}
                                onClick={option.onClick}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;