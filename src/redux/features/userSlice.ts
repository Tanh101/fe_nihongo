import {  createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    dob: string;
    phone_number: string;
    role: string;
    gender: string;
    avatar: string;
    deleted_at: string;
    status: string;
}
interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};


export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
    },
  },
});

export default UserSlice.reducer;
export const { addUser } = UserSlice.actions;