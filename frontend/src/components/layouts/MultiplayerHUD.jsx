
import React from 'react';
import { FaUserCircle } from "react-icons/fa";
import '../../styles/multiplayer-hud.css'

const MultiplayerHUD = ({ player1='Undefined', player2='Undefined' ,currentScore = 0, currentRound = 1, maxNumberOfRounds = 0 }) => {
    return (
        <div className='player-hud' style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
                <FaUserCircle style={{ marginRight: '10px', fontSize: '35px' }} />
            </div>
            <div style={{ color:'var(--player1-color)', display: 'flex', flexDirection: 'column' }}>
                <b>{player1}</b>
                <small>Estado</small>
                <small>🧠 x 0</small>
            </div>
            <div style={{ margin: '15px' }}>vs</div>
            <div style={{ color:'var(--player2-color)', display: 'flex', flexDirection: 'column' }}>
                <b>{player2}</b>
                <small>Estado</small>
                <small>🧠 x 0</small>
            </div>
            <div style={{ display: 'flex' }}>
                <FaUserCircle style={{ marginLeft: '10px', fontSize: '35px' }} />
            </div>

            {/* <p><b>Player 1: </b><br /><br /><BasicVerticalSlide key={statusP1}>{statusP1}</BasicVerticalSlide></p>
                    <p><b>Player 2: </b><br /><br /><BasicVerticalSlide key={statusP2}>{statusP2}</BasicVerticalSlide></p>
                    <FaUserCircle style={{ marginRight: '5px' }} /> */}
        </div>
    );
};

export default MultiplayerHUD;