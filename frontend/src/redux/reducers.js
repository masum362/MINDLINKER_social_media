import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import themeReducer from './themeSlice'
import postReducer from './postSlice'
const rootReducer = combineReducers({
    user:userReducer,
    theme:themeReducer,
    post:postReducer
})

export default rootReducer;