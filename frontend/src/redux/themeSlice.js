import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme:JSON.parse(window?.localStorage.getItem('theme') ) ?? "dark",
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, actions){
        state.theme = actions.payload;
        localStorage.setItem('theme', JSON.stringify(actions.payload));
    }
  },
})

// Action creators are generated for each case reducer function
export const { setTheme  } = themeSlice.actions

export default themeSlice.reducer