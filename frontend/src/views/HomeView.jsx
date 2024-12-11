/** React **/
import React, { useState, useEffect, useContext } from 'react'
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

/** Assets **/
import AppLogo from '../components/ui/AppLogo'
import { FaRegPlayCircle, FaTools, FaAppStoreIos } from "react-icons/fa";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";

/** Anim **/
import HorizontalSlideTransition from '../components/anim/HorizontalSlideTransition';

/** Components **/
import MobileHomeView from '../views/MobileHomeView';
import LogoutButton from '../components/ui/LogoutButton'

/** Context API**/
import { useRole } from '../contextAPI/AuthContext';
import { LoadGameContext } from '../contextAPI/LoadGameContext';

/** Styles **/
import '../styles/home.css'

const HomePage = () => {
	const { role } = useRole();
	const { setIsGameView } = useContext(LoadGameContext);
	//const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const isMobile = false;

	const navigate = useNavigate();

	const handleStartGame = () => {
		navigate('/start-game')
	}

	const minimalistButtonStyle = {
		padding: '0',
		background: 'none',
		border: 'none',
		boxShadow: 'none',
		color: 'var(--link-color)',
		width: '180px',
		fontSize: 'medium'
	}

	useEffect(() => {
		localStorage.removeItem("host");
		localStorage.removeItem("guest");
		setIsGameView(false);
	}, []);

	return (
		<div className='home-page-wrapper'>
			<div className='home-page-header'>
				{role === 'ROLE_ADMIN' && <h2><FaTools style={{ marginRight: '5px' }} />GDS Admin Panel</h2>}
				<HorizontalSlideTransition>
					<AppLogo />
				</HorizontalSlideTransition>
			</div>
			<div className='home-page-body'>
				{isMobile ? (
					<MobileHomeView />
				) : (
					role === 'ROLE_ADMIN' ? (
						<LogoutButton />
					) : (
						<>
							<button onClick={handleStartGame}>
								<span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									<FaRegPlayCircle fontSize={30} style={{ marginRight: '5px' }} />Iniciar Partida
								</span>
							</button>
							<button onClick={()=>navigate("/instrucciones")}>
								<span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									<BsInfoCircle fontSize={30} style={{ marginRight: '5px' }} />Instrucciones
								</span>
							</button>
							{role !== 'ROLE_GUESS' && <LogoutButton />}
						</>
					)
				)}
			</div>
			{/* {!isMobile && <div className='home-page-footer'>
				<div className='home-page-footer-container'>
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<small style={{ marginBottom: '0' }}>Descarga la App</small>
						<button style={minimalistButtonStyle}><span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><IoLogoGooglePlaystore fontSize={30} style={{ marginRight: '10px' }} />Google Play</span></button>
						<button style={minimalistButtonStyle}><span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaAppStoreIos fontSize={30} style={{ marginRight: '10px' }} />App Store</span></button>
					</div>
				</div>
			</div>} */}
		</div>
	);
};

export default HomePage;
