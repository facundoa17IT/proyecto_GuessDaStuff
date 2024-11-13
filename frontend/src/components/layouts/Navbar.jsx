/** React **/
import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

/** Assets **/
import AppLogoVertical from '../ui/AppLogoVertical';
import { FaUserCog, FaUserCircle } from "react-icons/fa";
import { BsDatabaseFillGear } from "react-icons/bs";
import { PiChartBarFill } from "react-icons/pi";
import { BsCollectionPlayFill } from "react-icons/bs";
import { FaRankingStar } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

/** Utils**/
import { PUBLIC_ROUTES, ADMIN_ROUTES, PLAYER_ROUTES } from '../../utils/constants';

/** Style **/
import '../../styles/navbar.css';

/** Context API **/
import { useRole } from '../../contextAPI/AuthContext'
import { SocketContext } from '../../contextAPI/SocketContext';

const Navbar = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    const { role } = useRole();  // Access the role from context

    const { invitationCount } = useContext(SocketContext);

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
                                <Link to={PUBLIC_ROUTES.LOGIN} className="nav-links">Iniciar Sesion</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={PUBLIC_ROUTES.REGISTER} className="nav-links">Registrarse</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            {role === 'ROLE_USER' && (
                                <>
                                    <li className="nav-item">
                                        <Link to="" className="nav-links">
                                            <FaRankingStar style={{ marginRight: '5px' }} />Ranking
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={PLAYER_ROUTES.INVITATIONS} className="nav-links">
                                            <IoMdMail style={{ marginRight: '5px' }} />Invitaciones<span style={{marginLeft:'5px'}}>&#40;{invitationCount}&#41;</span>
                                        </Link>
                                    </li>
                                    {/* <li className="nav-item">
                                        <Link to="comunidad" className="nav-links">
                                            <FaUsers style={{ marginRight: '5px' }} />Comunidad
                                        </Link>
                                    </li> */}
                                    <li className="nav-item">
                                        <Link to="" className="nav-links">
                                            <FaUserCircle style={{ marginRight: '5px' }} />Perfil
                                        </Link>
                                    </li>
                                </>
                            )}

                            {role === 'ROLE_ADMIN' && (
                                <>
                                    <li className="nav-item">
                                        <Link to={ADMIN_ROUTES.CONTENT_MANAGEMENT} className="nav-links">
                                            <BsDatabaseFillGear style={{ marginRight: '5px' }} />Contenido
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={ADMIN_ROUTES.USERS_MANAGEMENT} className="nav-links">
                                            <FaUserCog style={{ marginRight: '5px' }} />Usuarios
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="admin/game-matches-management" className="nav-links">
                                            <BsCollectionPlayFill style={{ marginRight: '5px' }} />Partidas
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="" className="nav-links">
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
