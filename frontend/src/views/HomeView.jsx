/** React **/
import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

/** Assets **/
import AppLogo from '../components/ui/AppLogo'
import { FaRegPlayCircle, FaTools, FaAppStoreIos } from "react-icons/fa";
import { IoLogoGooglePlaystore } from "react-icons/io5";

/** Components **/
import MobileHomeView from '../views/MobileHomeView';
import LogoutButton from '../components/ui/LogoutButton'

/** Context API**/
import { useRole } from '../contextAPI/AuthContext';

/** Styles **/
import '../styles/home.css'

/** Utils **/
import axiosInstance from '../utils/AxiosConfig';

const HomePage = () => {
	const { role } = useRole();

	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

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

	return (
		<div className='home-page-wrapper'>
			<div className='home-page-header'>
				{role === 'ROLE_ADMIN' && <h2><FaTools style={{ marginRight: '5px' }} />GDS Admin Panel</h2>}
				<AppLogo />
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
							{role !== 'ROLE_GUESS' && <LogoutButton />}
						</>
					)
				)}
			</div>
			{!isMobile && <div className='home-page-footer'>
				<div className='home-page-footer-container'>
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<small style={{ marginBottom: '0' }}>Descarga la App</small>
						<button style={minimalistButtonStyle}><span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><IoLogoGooglePlaystore fontSize={30} style={{ marginRight: '10px' }} />Google Play</span></button>
						<button style={minimalistButtonStyle}><span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaAppStoreIos fontSize={30} style={{ marginRight: '10px' }} />App Store</span></button>
					</div>
				</div>
			</div>}
		</div>
	);
};

export default HomePage;
