import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

/** Layout **/
import MainPageLayout from '../components/layouts/MainPageLayout';

/** Home Page **/
import HomeView from '../views/HomeView';

/** Guess Views **/
import { Register } from '../views/auth/Register';
import { Login } from '../views/auth/Login';

/** Player & Guess Views **/
import StartGame from '../views/StartGame';
import SelectionPhase from '../views/SelectionPhase';
import GameMatchView from '../views/GameMatchView';

/** Admin Views **/
import GameContentManagement from '../views/admin/GameContentManagement';
import UsersManagment from '../views/admin/UsersManagement';

/** Content - Categories **/
import { CategoryDetails } from '../views/admin/CategoryDetails';
import { EditCategory } from '../views/admin/EditCategory';
import { DeleteCategory } from '../views/admin/DeleteCategory';
import { AddCategory } from '../views/admin/AddCategory';

/** Content - Game Modes**/
import { AddTitle } from '../views/admin/AddTitle';

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

                {/* Player & Guess Routes */}
                <Route path="start-game" element={<StartGame />} />
                <Route path="selection-phase" element={<SelectionPhase />} />
                <Route path="init-game" element={<GameMatchView />} />

                {/* Admin Routes */}
                <Route path="admin/game-content-management" element={<GameContentManagement />} />
                <Route path="admin/add-category" element={<AddCategory />} />
                <Route path="admin/category-details" element={<CategoryDetails />} />
                <Route path="admin/edit-category" element={<EditCategory />} />
                <Route path="admin/delete-category" element={<DeleteCategory />} />
                <Route path="admin/add-title" element={<AddTitle />} />
                <Route path="admin/users-management" element={<UsersManagment />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;
