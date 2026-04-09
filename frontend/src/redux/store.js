import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        _dummy: (state = {}) => state
    },
});
