// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import WordsFooter from '../ui/WordsFooter';
import FadeTransition from '../anim/FadeTransition';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
    return (
        <div>
            <Toaster
                toastOptions={{
                    style: {
                        border: '2px solid var(--border-color)',
                        fontWeight: 'bold',
                        padding: '16px',
                        color: 'var(--link-color)',
                    },
                    duration: 3000
                }}
            />
            <Navbar />
            <FadeTransition duration={0.5}>
                <Outlet />
            </FadeTransition>
            <WordsFooter />
        </div>
    );
};

export default Layout;
