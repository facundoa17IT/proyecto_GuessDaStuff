import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

/** Layout **/
import MainPageLayout from '../components/layouts/MainPageLayout';

/** Home Page **/
import HomeView from '../views/HomeView';

/** Guess Views **/
import { Register } from '../views/auth/Register';
import { Login } from '../views/auth/Login';

function AppRouter() {
    const location = useLocation();

    return (
        <Routes location={location} key={location.pathname}>
            {/* Nested routes inside the MainPageLayout */}
            <Route path="/" element={<MainPageLayout />}>
                <Route index element={<HomeView />} />

                {/* Guess Routes */}
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;
