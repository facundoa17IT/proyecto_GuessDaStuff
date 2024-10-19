// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import WordsFooter from '../ui/WordsFooter';
import FadeTransition from '../anim/FadeTransition';

const Layout = () => {
    return (
        <div>
            <Navbar />
            <FadeTransition>
                <Outlet duration={0.5} />
            </FadeTransition>
            <WordsFooter />
        </div>
    );
};

export default Layout;
