import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'UserAuth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setToken: (state, action) => {
            state.token = action.payload.token; 
        },
        clearCredentials: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
    },
});

export const { setCredentials, clearCredentials, setToken } = authSlice.actions;

export default authSlice.reducer;
