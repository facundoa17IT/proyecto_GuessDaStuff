/** React **/
import React from 'react';

/** Assets **/
import AppLogo from '../components/ui/AppLogo'

import LogoutButton from '../components/ui/LogoutButton';
import axiosInstance from '../AxiosConfig';

const StartGame = () => {
    const testWelcome = async () => {
        try {
            await axios.get('http://localhost:2024/api/welcome', {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,  // Add the token to the Authorization header
                },
              });
            console.log('Welcome User!');
        } catch (error) {
            console.error('Error!');
        }
    }

    return (
        <div>
            <div className='home-page-header'>
                <AppLogo />
                <LogoutButton />
                <button onClick={testWelcome}>Enter</button>
            </div>
        </div>
    );
}

export default StartGame;
