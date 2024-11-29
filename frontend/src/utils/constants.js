import { m } from "framer-motion";

export const STATUS = {
    ONLINE: "ONLINE",
    OFFLINE: "OFFLINE",
    BLOCKED: "BLOCKED",
    PLAYING: "PLAYING",
    REGISTERED: "REGISTERED",
    DELETED: "DELETED"
};

export const ROLE = {
    ADMIN: "ROLE_ADMIN",
    USER: "ROLE_USER",
    GUESS: "ROLE_INVITADO"
}

export const CATEGORY_STATUS = {
    INITIALIZED: "INITIALIZED",
    EMPTY: "EMPTY",
    DELETED: "DELETED"
}

export const PUBLIC_ROUTES = {
    REGISTER: "register",
    LOGIN: "login",
    START_GAME: "start-game",
    SELECTION_PHASE: "/selection-phase",
    INIT_GAME: "/init-game",
    SINGLE_GAME_LOBBY: "single-game-lobby",
    FORGOT_PASSWORD: 'forgot-password'
  
}

export const ADMIN_ROUTES = {
    CONTENT_MANAGEMENT: "/admin/game-content-management",
    ADD_CATEGORY: "/admin/add-category",
    CATEGORY_DETAILS: "/admin/category-details",
    EDIT_CATEGORY: "/admin/edit-category",
    DELETE_CATEGORY: "/admin/delete/category",
    ADD_TITLE: "/admin/add-title",
    USERS_MANAGEMENT: "/admin/users-management",
    USER_DETAILS: "/admin/user-details",
    BLOCK_USER: "/admin/block-user",
    UNBLOCK_USER: "/admin/unblock-user",
    DELETE_USER: "/admin/delete-user"
}

export const PLAYER_ROUTES = {
    PROFILE: "/profile",
    GAME_LOBBY: "game-lobby",
    MULTIPLAYER_LOBBY: '/multiplayer-lobby',
    INVITATIONS: '/invitations',
    SLOT_MACHINE: '/slot-machine-multi',
    RANKING: '/ranking',
    LOAD_GAME: '/load-game'
}