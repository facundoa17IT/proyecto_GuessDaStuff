
import React from 'react';
import { FaUserCircle } from "react-icons/fa";
import '../../styles/multiplayer-hud.css'

const WaitingLobby = ({ isHost = false, user1 = 'Undefined', user2 = 'Undefined', onClick }) => {
    return (
        <div className='border-container' style={{ width: '100%' }}>
            <p>Esperando Jugadores...</p>

            <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>

                <div style={{ display: 'flex' }}>
                    <FaUserCircle style={{ marginRight: '10px', fontSize: '35px' }} />
                </div>
                <div style={{ color: 'var(--player1-color)', display: 'flex', flexDirection: 'column' }}>
                    <b>{user1}</b>
                    <small>Listo ✅</small>
                </div>
                <div style={{ margin: '15px' }}>vs</div>
                {user2 ? (
                    <>
                        <div style={{ color: 'var(--player2-color)', display: 'flex', flexDirection: 'column' }}>
                            <b>{user2}</b>
                            <small>Listo ✅</small>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <FaUserCircle style={{ marginLeft: '10px', fontSize: '35px' }} />
                        </div>
                    </>
                ) : <>Esperando...</>}

            </div>
            {/* <h3 style={{ marginTop: '0px' }}>Players 2/2</h3> */}
            {/* <CircleTimerv2
                            isPlaying={enableTimer}
                            onTimerComplete={handleTimerComplete}
                            duration={3}
                        /> */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
                {/* <ReadyButton onReady={handleReady} /> */}
                {/* {isHost && <button onClick={onClick}>Iniciar</button>} */}
            </div>
        </div>
    );
};

export default WaitingLobby;