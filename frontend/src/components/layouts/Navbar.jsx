import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

/** UI Elements **/
import AppLogoVertical from '../ui/AppLogoVertical';

/** Icons **/
import { FaUsers, FaUserCog, FaUserCircle } from "react-icons/fa";
import { BsDatabaseFillGear } from "react-icons/bs";
import { PiChartBarFill } from "react-icons/pi";
import { BsCollectionPlayFill } from "react-icons/bs";

/** Style **/
import '../../styles/navbar.css';

import { useRole } from '../../contextAPI/AuthContext'

const Navbar = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    const { role } = useRole();  // Access the role from context

    useEffect(() => {
        console.log(role);  // For debugging
    }, [role]);

    if (isMobile) return null;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <AppLogoVertical />
                </Link>

                <ul className="nav-menu">
                    {role === 'ROLE_GUESS' ? (
                        <>
                            <li className="nav-item">
                                <Link to="login" className="nav-links">Iniciar Sesion</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="register" className="nav-links">Registrarse</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            {role === 'ROLE_USER' && (
                                <>
                                    <li className="nav-item">
                                        <Link to="game-stats-management" className="nav-links">
                                            <PiChartBarFill style={{ marginRight: '5px' }} />Estadisticas
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="comunidad" className="nav-links">
                                            <FaUsers style={{ marginRight: '5px' }} />Comunidad
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="profile" className="nav-links">
                                            <FaUserCircle style={{ marginRight: '5px' }} />Perfil
                                        </Link>
                                    </li>
                                </>
                            )}

                            {role === 'ROLE_ADMIN' && (
                                <>
                                    <li className="nav-item">
                                        <Link to="admin/game-content-management" className="nav-links">
                                            <BsDatabaseFillGear style={{ marginRight: '5px' }} />Contenido
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="admin/user-management" className="nav-links">
                                            <FaUserCog style={{ marginRight: '5px' }} />Usuarios
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="admin/game-matches-management" className="nav-links">
                                            <BsCollectionPlayFill style={{ marginRight: '5px' }} />Partidas
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="game-stats-management" className="nav-links">
                                            <PiChartBarFill style={{ marginRight: '5px' }} />Estadisticas
                                        </Link>
                                    </li>
                                </>
                            )}
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
