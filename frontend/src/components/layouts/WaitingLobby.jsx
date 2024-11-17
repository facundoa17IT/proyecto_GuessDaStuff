
/** React **/
import React from 'react';

/** Assets **/
import { FaUserCircle } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';

/** Style **/
import '../../styles/multiplayer-hud.css'

const WaitingLobby = ({ isHost = false, isMatchAccepted = false, user1 = 'Undefined', user2 = 'Undefined', onClick }) => {
    return (
        <div className='border-container' style={{ width: '100%' }}>
            {!isMatchAccepted ? <p>Esperando Jugadores...</p> : <p>{user2} se ha unido!</p>}

            <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                <div style={{ display: 'flex' }}>
                    <FaUserCircle style={{ marginRight: '10px', fontSize: '35px' }} />
                </div>
                <div style={{ color: 'var(--player1-color)', display: 'flex', flexDirection: 'column' }}>
                    <b>{user1}</b>
                    <small>Listo ✅</small>
                </div>
                <div style={{ margin: '15px' }}>vs</div>
                {isMatchAccepted ? (
                    <>
                        <div style={{ color: 'var(--player2-color)', display: 'flex', flexDirection: 'column' }}>
                            <b>{user2}</b>
                            <small>Listo ✅</small>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <FaUserCircle style={{ marginLeft: '10px', fontSize: '35px' }} />
                        </div>
                    </>
                ) : <ClipLoader size={30} speedMultiplier={0.5} color="var(--link-color)" loading={true} />}
            </div>
            {/* <h3 style={{ marginTop: '0px' }}>Players 2/2</h3> */}
            {/* <CircleTimerv2
                isPlaying={enableTimer}
                onTimerComplete={handleTimerComplete}
                duration={3}
            /> */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
                {isMatchAccepted ? (
                    <div>
                        <p>Ya puedes comenzar la partida!</p>
                        <button onClick={onClick}>Iniciar</button>
                    </div>
                ) : (
                    isHost && <p>Has invitado a {user2}</p>
                )}
            </div>
        </div>
    );
};

export default WaitingLobby;