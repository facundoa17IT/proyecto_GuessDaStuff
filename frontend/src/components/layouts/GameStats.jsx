import React from 'react';
import { GAME_SETTINGS } from '../../utils/constants';

const GameStats = ({ currentGameIndex, hintCounter }) => {
    return (
        <div>
            <p><b style={{ color: 'var(--link-color)' }}>Ronda</b></p>
            <p><b>{currentGameIndex + 1}/{GAME_SETTINGS.MAX_ROUNDS}</b></p>
            <p><b style={{ color: 'var(--link-color)' }}>Pistas disponibles</b></p>
            <p><b>{hintCounter || 0}/{GAME_SETTINGS.MAX_HINTS}</b></p>
        </div>
    );
};

export default GameStats;
