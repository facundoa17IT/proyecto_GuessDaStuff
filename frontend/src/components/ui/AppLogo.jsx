import React from 'react';

const AppLogo = ({ width, height = 120, bgImg = 'var(--app-logo)', enableAnim = true }) => {
    return (
        <div className="app-logo" style={{ width: `${width}`, height: `${height}`, backgroundImage: `${bgImg}` }}></div>
    );
};

export default AppLogo;