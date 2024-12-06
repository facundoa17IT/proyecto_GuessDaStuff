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
import LoadGame from '../views/LoadGame';
import Instrucciones from '../views/Instrucciones';

/** Player **/
import MultiplayerLobby1 from '../views/MultiplayerLobby1';
import Invitations from '../views/user/Invitations';
import SlotMachineMulti from '../components/ui/SlotMachineMulti';
import Ranking from '../views/user/Ranking';
import Profile from '../views/user/Profile';

/** Admin Views **/
import GameContentManagement from '../views/admin/GameContentManagement';
import UsersManagment from '../views/admin/UsersManagement';

/** Content - Categories **/
import { CategoryDetails } from '../views/admin/categories/CategoryDetails';
import { EditCategory } from '../views/admin/categories/EditCategory';
import { DeleteCategory } from '../views/admin/categories/DeleteCategory';
import { AddCategory } from '../views/admin/categories/AddCategory';
import { AddTitle } from '../views/admin/categories/AddTitle';

/** Content - Users **/
import { DeleteUser } from '../views/admin/users/DeleteUser'
import { UserDetails } from '../views/admin/users/userDetails';
import { BlockUser } from '../views/admin/users/BlockUser';
import { UnlockUser } from '../views/admin/users/UnblockUser';

/** Content - Game Matches **/
import GameMatchesManagement from '../views/admin/GameMatchesManagement';

/** Utils */
import { PUBLIC_ROUTES, ADMIN_ROUTES, PLAYER_ROUTES } from '../utils/constants';

import ForgotPassword from '../views/auth/ForgotPassword';
import ResetPassword from '../views/auth/ResetPassword';

function AppRouter() {
    const location = useLocation();

    return (
        <Routes location={location} key={location.pathname}>
            {/* Nested routes inside the MainPageLayout */}
            <Route path="/" element={<MainPageLayout />}>
                <Route index element={<HomeView />} />

                {/* Guess Routes */}
                <Route path={PUBLIC_ROUTES.REGISTER} element={<Register />} />
                <Route path={PUBLIC_ROUTES.LOGIN} element={<Login />} />
                <Route path={PUBLIC_ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />

                {/* Player & Guess Routes */}
                <Route path={PUBLIC_ROUTES.START_GAME} element={<StartGame />} />
                <Route path={PUBLIC_ROUTES.SELECTION_PHASE} element={<SelectionPhase />} />
                <Route path={PUBLIC_ROUTES.INIT_GAME} element={<GameMatchView />} />
                <Route path={"instrucciones"} element={<Instrucciones />} />

                {/* Player Routes */}
                <Route path={PLAYER_ROUTES.MULTIPLAYER_LOBBY} element={<MultiplayerLobby1 />} />
                <Route path={PLAYER_ROUTES.INVITATIONS} element={<Invitations />} />
                <Route path={PLAYER_ROUTES.SLOT_MACHINE} element={<SlotMachineMulti />} />
                <Route path={PLAYER_ROUTES.RANKING} element={<Ranking />} />
                <Route path={PLAYER_ROUTES.PROFILE} element={<Profile />} />
                <Route path={PLAYER_ROUTES.LOAD_GAME} element={<LoadGame />} />
                
                {/* Admin Routes */}
                {/* Categories */}
                <Route path={ADMIN_ROUTES.CONTENT_MANAGEMENT} element={<GameContentManagement />} />
                <Route path={ADMIN_ROUTES.ADD_CATEGORY} element={<AddCategory />} />
                <Route path={ADMIN_ROUTES.CATEGORY_DETAILS} element={<CategoryDetails />} />
                <Route path={ADMIN_ROUTES.EDIT_CATEGORY} element={<EditCategory />} />
                <Route path={ADMIN_ROUTES.DELETE_CATEGORY} element={<DeleteCategory />} />
                <Route path={ADMIN_ROUTES.ADD_TITLE} element={<AddTitle />} />
                {/* Users */}
                <Route path={ADMIN_ROUTES.USERS_MANAGEMENT} element={<UsersManagment />} />
                <Route path={ADMIN_ROUTES.USER_DETAILS} element={<UserDetails />} />
                <Route path={ADMIN_ROUTES.DELETE_USER} element={<DeleteUser />} />
                <Route path={ADMIN_ROUTES.BLOCK_USER} element={<BlockUser />} />
                <Route path={ADMIN_ROUTES.UNBLOCK_USER} element={<UnlockUser />} />
                {/* Partidas */}
                <Route path="admin/game-matches-management" element={<GameMatchesManagement />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;
