import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 posts:{}
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getPosts(state,actions){
        state.posts = actions.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { getPosts } = postSlice.actions

export default postSlice.reducer