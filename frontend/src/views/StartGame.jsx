/** React **/
import React from 'react';

/** Assets **/
import AppLogo from '../components/ui/AppLogo'

import LogoutButton from '../components/ui/LogoutButton';
import axiosInstance from '../AxiosConfig';

const StartGame = () => {
    const testWelcome = async () => {
        try {
            await axiosInstance.get('/api/welcome');
            alert('Bienvenido usuario autenticado!');
            console.log('Bienvenido usuario autenticado!');
        } catch (error) {
            alert('Error necesitas estar autenticado!');
            console.error('Error necesitas estar autenticado!');
        }
    }

    const testAdmin = async () => {
        try {
            await axiosInstance.get('/api/admin');
            alert('Bienvenido Admin!');
            console.log('Bienvenido Admin!');
        } catch (error) {
            alert('Error necesitas estar autenticado con ROLE_ADMIN!');
            console.error('Error necesitas estar autenticado con ROLE_ADMIN!');
        }
    }

    const testPlayer = async () => {
        try {
            await axiosInstance.get('/api/user');
            alert('Bienvenido Jugador!');
            console.log('Bienvenido Jugador!');
        } catch (error) {
            alert('Error necesitas estar autenticado con ROLE_USER!');
            console.error('Error necesitas estar autenticado con ROLE_USER!');
        }
    }

    return (
        <div>
            <div className='home-page-header'>
                <AppLogo />

                {/* Testing */}
                <div style={{}}>
                    <h3 style={{ marginBottom: '0' }}>Test de Autenticacion</h3>
                    <div>
                        <button onClick={testWelcome}>General</button>
                        <button onClick={testAdmin}>Admin</button>
                        <button onClick={testPlayer}>Jugador</button>
                    </div>
                </div>

                <LogoutButton />
            </div>
        </div>
    );
}

export default StartGame;
