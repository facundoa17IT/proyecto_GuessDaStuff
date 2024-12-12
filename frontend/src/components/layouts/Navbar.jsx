/** React **/
import React, { useEffect, useContext } from 'react';
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
import { FaAddressCard } from "react-icons/fa6";
import { ImEnter } from "react-icons/im";
/** Utils**/
import { PUBLIC_ROUTES, ADMIN_ROUTES, PLAYER_ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

/** Style **/
import '../../styles/navbar.css';

/** Context API **/
import { useRole } from '../../contextAPI/AuthContext'
import { SocketContext } from '../../contextAPI/SocketContext';
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

const Navbar = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 630px)' });

    const { role } = useRole();  // Access the role from context

    const { invitation, setInvitation, invitationCount, setInvitationCount, invitationCollection, setInvitationCollection } = useContext(SocketContext);
    const { isGameView } = useContext(LoadGameContext);

    const userObj = JSON.parse(localStorage.getItem("userObj"));

    const handleInvitationInteraction = (invitation) => {
        if (invitation) {
            if (invitation.action === 'INVITE') {
                setInvitationCount(invitationCount + 1);
                setInvitationCollection([...invitationCollection, invitation]);
                setInvitation(null);
                toast('Has recibido una nueva invitacion!', { icon: '📩' });
            }
        } else {
            console.error("Invalid Invitation");
        }
    };

    useEffect(() => {
        if (invitation) {
            handleInvitationInteraction(invitation);
            console.log(invitation);
        }
    }, [invitation]);

    if (isGameView) return null;

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
                                <Link to={PUBLIC_ROUTES.LOGIN} className="nav-links">
                                    <ImEnter className='navbar-icon' />{isMobile ? <></> : <>Iniciar Sesion</>}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={PUBLIC_ROUTES.REGISTER} className="nav-links">
                                    <FaAddressCard className='navbar-icon' />{isMobile ? <></> : <>Registrarse</>}
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            {role === 'ROLE_USER' && (
                                <>
                                    <li className="nav-item">
                                        <Link to={PLAYER_ROUTES.RANKING} className="nav-links">
                                            <FaRankingStar className='navbar-icon' />{isMobile ? <></> : <>Ranking</>}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={PLAYER_ROUTES.INVITATIONS} className="nav-links">
                                            <IoMdMail className='navbar-icon' />{isMobile ? <></> : <>Invitaciones</>}<span style={{ marginLeft: '5px' }}>&#40;{invitationCount}&#41;</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={PLAYER_ROUTES.PROFILE} className="nav-links">
                                            <FaUserCircle className='navbar-icon' />{isMobile ? <></> : <>Perfil -<span style={{ marginLeft: '5px' }}>{userObj.username}</span></>}
                                        </Link>
                                    </li>
                                </>
                            )}

                            {role === 'ROLE_ADMIN' && (
                                <>
                                    <li className="nav-item">
                                        <Link to={ADMIN_ROUTES.CONTENT_MANAGEMENT} className="nav-links">
                                            <BsDatabaseFillGear className='navbar-icon' />{isMobile ? <></> : <>Contenido</>}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={ADMIN_ROUTES.USERS_MANAGEMENT} className="nav-links">
                                            <FaUserCog className='navbar-icon' />{isMobile ? <></> : <>Usuarios</>}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="admin/game-matches-management" className="nav-links">
                                            <BsCollectionPlayFill className='navbar-icon' />{isMobile ? <></> : <>Partidas</>}
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
